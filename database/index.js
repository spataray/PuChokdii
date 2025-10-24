const { Pool } = require('pg');

// Use Supabase Postgres connection
const DATABASE_URL = process.env.POSTGRES_URL || process.env.DATABASE_URL;

class Database {
    constructor() {
        this.pool = null;
        this.initializing = false;
        this.initialized = false;
        this._tablesCreated = false;
    }

    async connect() {
        if (this.pool) return;

        // Remove sslmode from connection string to avoid conflicts
        let connectionString = DATABASE_URL;
        if (connectionString) {
            connectionString = connectionString.replace(/[?&]sslmode=[^&]*/gi, '');
        }

        this.pool = new Pool({
            connectionString: connectionString,
            ssl: {
                rejectUnauthorized: false
            },
            // Optimize for serverless with aggressive timeouts
            max: 10, // Reduced for serverless
            min: 0,  // Don't keep idle connections
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 30000, // Increased from 10s to 30s
            allowExitOnIdle: true
        });

        console.log('📦 Connected to PostgreSQL database (Supabase)');
    }

    async initialize() {
        // Prevent multiple initializations
        if (this.initialized) return;
        if (this.initializing) {
            // Wait for existing initialization to complete
            while (this.initializing) {
                await new Promise(resolve => setTimeout(resolve, 50));
            }
            return;
        }

        this.initializing = true;
        try {
            await this.connect();
            // Don't create tables on every initialization - do it lazily only when needed
            // This prevents timeout issues in serverless cold starts
            this.initialized = true;
        } finally {
            this.initializing = false;
        }
    }

    async ensureTablesExist() {
        // Only create tables if they haven't been created yet
        // This is called lazily on first query
        if (!this._tablesCreated) {
            // Quick check: if users table exists, assume all tables exist
            try {
                const result = await this.pool.query(`
                    SELECT EXISTS (
                        SELECT FROM information_schema.tables
                        WHERE table_schema = 'public'
                        AND table_name = 'users'
                    );
                `);

                if (result.rows[0].exists) {
                    // Tables already exist, skip creation
                    console.log('✅ Database tables already exist');
                    this._tablesCreated = true;
                    return;
                }
            } catch (err) {
                console.log('⚠️ Error checking tables, will attempt to create:', err.message);
            }

            // Tables don't exist, create them
            await this.createTables();
            this._tablesCreated = true;
        }
    }

    async createTables() {
        // Use pool.query directly to avoid circular dependency with run() method
        const tables = [
            // Users table
            `CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                email TEXT UNIQUE NOT NULL,
                name TEXT,
                phone_number TEXT,
                carrier TEXT,
                email_reminders BOOLEAN DEFAULT TRUE,
                email_summary BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,

            // Magic links table for authentication
            `CREATE TABLE IF NOT EXISTS magic_links (
                id TEXT PRIMARY KEY,
                email TEXT NOT NULL,
                token TEXT UNIQUE NOT NULL,
                expires_at TIMESTAMP NOT NULL,
                used BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,

            // User stocks table
            `CREATE TABLE IF NOT EXISTS user_stocks (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                symbol TEXT NOT NULL,
                name TEXT,
                threshold DECIMAL NOT NULL,
                alert_type TEXT NOT NULL CHECK (alert_type IN ('above', 'below')),
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                UNIQUE(user_id, symbol)
            )`,

            // Alert history table
            `CREATE TABLE IF NOT EXISTS alert_history (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                stock_id TEXT NOT NULL,
                symbol TEXT NOT NULL,
                price DECIMAL NOT NULL,
                threshold DECIMAL NOT NULL,
                alert_type TEXT NOT NULL,
                message TEXT NOT NULL,
                sent_successfully BOOLEAN DEFAULT FALSE,
                error_message TEXT,
                sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (stock_id) REFERENCES user_stocks(id) ON DELETE CASCADE
            )`,

            // Stock price cache table
            `CREATE TABLE IF NOT EXISTS stock_prices (
                symbol TEXT PRIMARY KEY,
                current_price DECIMAL,
                change_percent DECIMAL,
                last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`
        ];

        for (const table of tables) {
            await this.pool.query(table);
        }

        // Create indexes
        const indexes = [
            'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)',
            'CREATE INDEX IF NOT EXISTS idx_magic_links_token ON magic_links(token)',
            'CREATE INDEX IF NOT EXISTS idx_magic_links_email ON magic_links(email)',
            'CREATE INDEX IF NOT EXISTS idx_user_stocks_user_id ON user_stocks(user_id)',
            'CREATE INDEX IF NOT EXISTS idx_user_stocks_symbol ON user_stocks(symbol)',
            'CREATE INDEX IF NOT EXISTS idx_alert_history_user_id ON alert_history(user_id)',
            'CREATE INDEX IF NOT EXISTS idx_alert_history_sent_at ON alert_history(sent_at)'
        ];

        for (const index of indexes) {
            await this.pool.query(index);
        }

        console.log('✅ Database tables initialized');
    }

    async run(sql, params = []) {
        // Ensure database is initialized
        if (!this.initialized) {
            await this.initialize();
        }

        // Only check tables once per container lifetime
        if (!this._tablesCreated) {
            await this.ensureTablesExist();
        }

        try {
            const result = await this.pool.query(sql, params);
            return {
                id: result.rows[0]?.id || null,
                changes: result.rowCount || 0
            };
        } catch (err) {
            console.error('Database run error:', err);
            throw err;
        }
    }

    async get(sql, params = []) {
        // Ensure database is initialized
        if (!this.initialized) {
            await this.initialize();
        }

        // Only check tables once per container lifetime
        if (!this._tablesCreated) {
            await this.ensureTablesExist();
        }

        try {
            const result = await this.pool.query(sql, params);
            return result.rows[0] || null;
        } catch (err) {
            console.error('Database get error:', err);
            throw err;
        }
    }

    async all(sql, params = []) {
        // Ensure database is initialized
        if (!this.initialized) {
            await this.initialize();
        }

        // Only check tables once per container lifetime
        if (!this._tablesCreated) {
            await this.ensureTablesExist();
        }

        try {
            const result = await this.pool.query(sql, params);
            return result.rows;
        } catch (err) {
            console.error('Database all error:', err);
            throw err;
        }
    }

    async close() {
        if (this.pool) {
            await this.pool.end();
            console.log('📦 Database connection closed');
        }
    }
}

// Create and export database instance
const database = new Database();

// DON'T initialize on module load - it causes timeout in serverless cold starts
// Initialization happens lazily on first query

module.exports = database;

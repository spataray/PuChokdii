require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const { RateLimiterMemory } = require('rate-limiter-flexible');

// Import routes
const authRoutes = require('./api/auth');
const userRoutes = require('./api/user');
const stockRoutes = require('./api/stocks');
const monitorRoutes = require('./api/monitor');

// Import middleware
const authMiddleware = require('./middleware/auth');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiting
const rateLimiter = new RateLimiterMemory({
    keyPrefix: 'middleware',
    points: 100, // 100 requests
    duration: 60, // per 1 minute
});

const rateLimiterMiddleware = async (req, res, next) => {
    try {
        await rateLimiter.consume(req.ip);
        next();
    } catch (rejRes) {
        res.status(429).json({
            success: false,
            message: 'Too many requests, please try again later.'
        });
    }
};

// Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"]
        }
    }
}));

app.use(cors({
    origin: true, // Allow all origins temporarily for debugging
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    preflightContinue: false,
    optionsSuccessStatus: 200
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(rateLimiterMiddleware);

// Serve static files
app.use(express.static(path.join(__dirname)));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', authMiddleware, userRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/monitor', monitorRoutes);

// Health check endpoint with database test
app.get('/api/health', async (req, res) => {
    const health = {
        success: true,
        message: 'StockAlerts API is running',
        timestamp: new Date().toISOString(),
        database: 'unknown'
    };

    try {
        const database = require('./database');
        await database.initialize();
        const result = await database.pool.query('SELECT NOW() as now');

        health.database = 'connected';
        health.databaseTime = result.rows[0].now;

        res.json(health);
    } catch (error) {
        health.success = false;
        health.database = 'disconnected';
        health.error = error.message;

        res.status(503).json(health);
    }
});

// Debug endpoint to test actual queries
app.get('/api/debug', async (req, res) => {
    const debug = {
        timestamp: new Date().toISOString(),
        tests: {}
    };

    try {
        const database = require('./database');
        await database.initialize();

        // Test 1: Database connection
        debug.tests.database = { status: 'connected' };

        // Test 2: Count users
        const userCount = await database.pool.query('SELECT COUNT(*) as count FROM users');
        debug.tests.users = {
            status: 'success',
            count: parseInt(userCount.rows[0].count)
        };

        // Test 3: List all users (email only)
        const users = await database.pool.query('SELECT id, email, phone_number, carrier FROM users LIMIT 5');
        debug.tests.userList = {
            status: 'success',
            users: users.rows
        };

        // Test 4: Count user stocks
        const stockCount = await database.pool.query('SELECT COUNT(*) as count FROM user_stocks WHERE is_active = TRUE');
        debug.tests.userStocks = {
            status: 'success',
            count: parseInt(stockCount.rows[0].count)
        };

        // Test 5: List all stocks
        const stocks = await database.pool.query(`
            SELECT us.id, us.user_id, us.symbol, us.name, us.threshold, us.alert_type, us.is_active,
                   u.email as user_email
            FROM user_stocks us
            JOIN users u ON us.user_id = u.id
            WHERE us.is_active = TRUE
            LIMIT 5
        `);
        debug.tests.stockList = {
            status: 'success',
            stocks: stocks.rows
        };

        // Test 6: Test the getUserStocks query for first user
        if (users.rows.length > 0) {
            const firstUserId = users.rows[0].id;
            const userDb = require('./database/users');
            const userStocks = await userDb.getUserStocks(firstUserId);
            debug.tests.getUserStocksQuery = {
                status: 'success',
                userId: firstUserId,
                stockCount: userStocks.length,
                stocks: userStocks
            };
        }

        res.json(debug);
    } catch (error) {
        debug.error = error.message;
        debug.stack = error.stack;
        res.status(500).json(debug);
    }
});

// Serve frontend for SPA routes
app.get('*', (req, res) => {
    // Serve index.html for all non-API routes
    if (!req.path.startsWith('/api/')) {
        res.sendFile(path.join(__dirname, 'index.html'));
    } else {
        res.status(404).json({
            success: false,
            message: 'API endpoint not found'
        });
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Server error:', error);

    // Don't leak error details in production
    const isDevelopment = process.env.NODE_ENV !== 'production';

    res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Internal server error',
        ...(isDevelopment && { stack: error.stack })
    });
});

// Start server
const server = app.listen(PORT, () => {
    console.log(`🚀 StockAlerts server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'localhost'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('Process terminated');
        process.exit(0);
    });
});

module.exports = app;
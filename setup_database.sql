-- StockAlerts Database Schema for Supabase PostgreSQL
-- Run this script in Supabase SQL Editor to create all tables

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    phone_number TEXT,
    carrier TEXT,
    email_reminders BOOLEAN DEFAULT TRUE,
    email_summary BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Magic links table for authentication
CREATE TABLE IF NOT EXISTS magic_links (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User stocks table
CREATE TABLE IF NOT EXISTS user_stocks (
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
);

-- Alert history table
CREATE TABLE IF NOT EXISTS alert_history (
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
);

-- Stock price cache table
CREATE TABLE IF NOT EXISTS stock_prices (
    symbol TEXT PRIMARY KEY,
    current_price DECIMAL,
    change_percent DECIMAL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_magic_links_token ON magic_links(token);
CREATE INDEX IF NOT EXISTS idx_magic_links_email ON magic_links(email);
CREATE INDEX IF NOT EXISTS idx_user_stocks_user_id ON user_stocks(user_id);
CREATE INDEX IF NOT EXISTS idx_user_stocks_symbol ON user_stocks(symbol);
CREATE INDEX IF NOT EXISTS idx_alert_history_user_id ON alert_history(user_id);
CREATE INDEX IF NOT EXISTS idx_alert_history_sent_at ON alert_history(sent_at);

-- Verify tables were created
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

// Health check endpoint for monitoring
const database = require('../database');

module.exports = async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    const health = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'production',
        database: 'unknown'
    };

    try {
        // Test database connection
        await database.initialize();
        const result = await database.pool.query('SELECT NOW()');

        health.database = 'connected';
        health.databaseTime = result.rows[0].now;

        res.status(200).json(health);
    } catch (error) {
        health.status = 'error';
        health.database = 'disconnected';
        health.error = error.message;

        res.status(503).json(health);
    }
};

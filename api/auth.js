const express = require('express');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const userDb = require('../database/users');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// OAuth2 Email configuration
const OAUTH2_CLIENT_ID = process.env.OAUTH2_CLIENT_ID;
const OAUTH2_CLIENT_SECRET = process.env.OAUTH2_CLIENT_SECRET;
const OAUTH2_REFRESH_TOKEN = process.env.OAUTH2_REFRESH_TOKEN;
const EMAIL_USER = process.env.EMAIL_USER;
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';

let transporter = null;

async function initializeEmailTransporter() {
    // Debug: Check which environment variables are available
    console.log('🔍 OAuth2 Environment Variables Check (v3):');
    console.log('OAUTH2_CLIENT_ID:', OAUTH2_CLIENT_ID ? 'SET' : 'MISSING');
    console.log('OAUTH2_CLIENT_SECRET:', OAUTH2_CLIENT_SECRET ? 'SET' : 'MISSING');
    console.log('OAUTH2_REFRESH_TOKEN:', OAUTH2_REFRESH_TOKEN ? 'SET' : 'MISSING');
    console.log('EMAIL_USER:', EMAIL_USER ? 'SET' : 'MISSING');

    // Additional debugging - check process.env directly
    console.log('🔍 Direct process.env check:');
    console.log('process.env.OAUTH2_CLIENT_ID:', process.env.OAUTH2_CLIENT_ID ? 'SET' : 'MISSING');
    console.log('process.env.OAUTH2_CLIENT_SECRET:', process.env.OAUTH2_CLIENT_SECRET ? 'SET' : 'MISSING');
    console.log('process.env.OAUTH2_REFRESH_TOKEN:', process.env.OAUTH2_REFRESH_TOKEN ? 'SET' : 'MISSING');
    console.log('process.env.EMAIL_USER:', process.env.EMAIL_USER ? 'SET' : 'MISSING');

    // Show all available environment variables (first few characters only for security)
    console.log('🔍 Available env vars starting with OAUTH2 or EMAIL:');
    Object.keys(process.env).filter(key => key.startsWith('OAUTH2') || key.startsWith('EMAIL')).forEach(key => {
        console.log(`${key}: ${process.env[key] ? process.env[key].substring(0, 10) + '...' : 'UNDEFINED'}`);
    });

    // Check if OAuth2 credentials are available (use process.env directly)
    const clientId = process.env.OAUTH2_CLIENT_ID;
    const clientSecret = process.env.OAUTH2_CLIENT_SECRET;
    const refreshToken = process.env.OAUTH2_REFRESH_TOKEN;
    const emailUser = process.env.EMAIL_USER;

    if (!clientId || !clientSecret || !refreshToken || !emailUser) {
        console.warn('⚠️ OAuth2 email credentials not configured - magic links will be logged to console');
        console.warn('Required environment variables: OAUTH2_CLIENT_ID, OAUTH2_CLIENT_SECRET, OAUTH2_REFRESH_TOKEN, EMAIL_USER');
        return null;
    }

    try {
        const oAuth2Client = new google.auth.OAuth2(
            clientId,
            clientSecret,
            REDIRECT_URI
        );

        oAuth2Client.setCredentials({
            refresh_token: refreshToken
        });

        const accessToken = await oAuth2Client.getAccessToken();

        const transporter = nodemailer.createTransporter({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: emailUser,
                clientId: clientId,
                clientSecret: clientSecret,
                refreshToken: refreshToken,
                accessToken: accessToken.token,
            },
        });

        return transporter;
    } catch (error) {
        console.error('Failed to initialize OAuth2 email transporter:', error);
        return null;
    }
}

// Initialize email transporter (async)
(async () => {
    transporter = await initializeEmailTransporter();
})();

// Send magic link
router.post('/send-magic-link', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }

        // Generate magic link token
        const token = uuidv4();
        const magicLink = `${FRONTEND_URL}?token=${token}`;

        // Create or get user
        const user = await userDb.createOrGetUser(email);

        // Store magic link in database
        await userDb.createMagicLink(email, token);

        // Send email or log to console
        // Create fresh transporter for OAuth2 (access tokens can expire)
        const emailTransporter = await initializeEmailTransporter();

        if (emailTransporter) {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Your StockAlerts Login Link',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <div style="background: linear-gradient(135deg, #2563eb, #8b5cf6); padding: 2rem; text-align: center; border-radius: 8px 8px 0 0;">
                            <h1 style="color: white; margin: 0; font-size: 1.8rem;">📈 StockAlerts</h1>
                        </div>

                        <div style="background: white; padding: 2rem; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                            <h2 style="color: #1e293b; margin-bottom: 1rem;">Welcome back!</h2>

                            <p style="color: #64748b; line-height: 1.6; margin-bottom: 2rem;">
                                Click the button below to securely log in to your StockAlerts account. This link will expire in 1 hour.
                            </p>

                            <div style="text-align: center; margin: 2rem 0;">
                                <a href="${magicLink}"
                                   style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 500;">
                                    🚀 Log In to StockAlerts
                                </a>
                            </div>

                            <p style="color: #94a3b8; font-size: 0.875rem; margin-bottom: 0;">
                                If you didn't request this login link, you can safely ignore this email.
                            </p>
                        </div>

                        <div style="text-align: center; margin-top: 1rem; color: #94a3b8; font-size: 0.75rem;">
                            © 2024 StockAlerts. Free stock monitoring for everyone.
                        </div>
                    </div>
                `
            };

            await emailTransporter.sendMail(mailOptions);
            console.log(`📧 Magic link sent to ${email} via OAuth2`);
        } else {
            // Development mode - log the magic link
            console.log(`🔗 Magic link for ${email}: ${magicLink}`);
        }

        res.json({
            success: true,
            message: 'Magic link sent! Check your email to continue.'
        });

    } catch (error) {
        console.error('Send magic link error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send magic link. Please try again.'
        });
    }
});

// Verify magic link and create session
router.post('/verify-magic-link', async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Token is required'
            });
        }

        // Get and validate magic link
        const magicLink = await userDb.getMagicLink(token);

        if (!magicLink) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired login link'
            });
        }

        // Mark magic link as used
        await userDb.useMagicLink(token);

        // Get or create user
        const user = await userDb.createOrGetUser(magicLink.email);

        // Create JWT token
        const authToken = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            token: authToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        });

    } catch (error) {
        console.error('Verify magic link error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to verify login link. Please try again.'
        });
    }
});

// Refresh token endpoint
router.post('/refresh-token', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Access token is required'
            });
        }

        const token = authHeader.substring(7);

        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            const user = await userDb.getUserById(decoded.userId);

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Create new token
            const newToken = jwt.sign(
                { userId: user.id, email: user.email },
                JWT_SECRET,
                { expiresIn: '30d' }
            );

            res.json({
                success: true,
                token: newToken
            });

        } catch (jwtError) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }

    } catch (error) {
        console.error('Refresh token error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to refresh token'
        });
    }
});

// Cleanup expired magic links (run periodically)
setInterval(async () => {
    try {
        const cleaned = await userDb.cleanupExpiredMagicLinks();
        if (cleaned > 0) {
            console.log(`🧹 Cleaned up ${cleaned} expired magic links`);
        }
    } catch (error) {
        console.error('Magic link cleanup error:', error);
    }
}, 60 * 60 * 1000); // Run every hour

module.exports = router;
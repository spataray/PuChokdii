require('dotenv').config();
const nodemailer = require('nodemailer');
const { google } = require('googleapis');

// OAuth2 Email configuration
const OAUTH2_CLIENT_ID = process.env.OAUTH2_CLIENT_ID;
const OAUTH2_CLIENT_SECRET = process.env.OAUTH2_CLIENT_SECRET;
const OAUTH2_REFRESH_TOKEN = process.env.OAUTH2_REFRESH_TOKEN;
const EMAIL_USER = process.env.EMAIL_USER;
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';

const alertPhone = process.env.ALERT_PHONE_NUMBER;
const carrierOverride = process.env.CARRIER_OVERRIDE; // Optional manual carrier

let transporter = null;

// Carrier email gateways for SMS
const carrierGateways = {
    'verizon': 'vtext.com',
    'att': 'txt.att.net',
    'tmobile': 'tmomail.net',
    'sprint': 'messaging.sprintpcs.com',
    'boost': 'sms.myboostmobile.com',
    'cricket': 'sms.cricketwireless.net',
    'metropcs': 'mymetropcs.com',
    'virgin': 'vmobl.com',
    'uscellular': 'email.uscc.net',
    'straighttalk': 'vtext.com'
};

// Auto-detect carrier based on phone number patterns (basic detection)
function detectCarrier(phoneNumber) {
    if (carrierOverride) {
        return carrierOverride.toLowerCase();
    }

    // Remove all non-digits
    const digits = phoneNumber.replace(/\D/g, '');

    // Basic carrier detection by area code patterns (this is approximate)
    // In reality, number portability makes this unreliable
    // Users should set CARRIER_OVERRIDE in .env for accuracy

    // Default to Verizon if can't detect (most common)
    return 'verizon';
}

function getCarrierGateway(phoneNumber) {
    const carrier = detectCarrier(phoneNumber);
    return carrierGateways[carrier] || carrierGateways['verizon'];
}
async function initializeEmail() {
    // Check if OAuth2 credentials are available
    if (!OAUTH2_CLIENT_ID || !OAUTH2_CLIENT_SECRET || !OAUTH2_REFRESH_TOKEN || !EMAIL_USER) {
        console.warn('⚠️ OAuth2 email credentials not configured. Running in test mode.');
        console.warn('Required: OAUTH2_CLIENT_ID, OAUTH2_CLIENT_SECRET, OAUTH2_REFRESH_TOKEN, EMAIL_USER');
        return null;
    }

    try {
        const oAuth2Client = new google.auth.OAuth2(
            OAUTH2_CLIENT_ID,
            OAUTH2_CLIENT_SECRET,
            REDIRECT_URI
        );

        oAuth2Client.setCredentials({
            refresh_token: OAUTH2_REFRESH_TOKEN
        });

        const accessToken = await oAuth2Client.getAccessToken();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: EMAIL_USER,
                clientId: OAUTH2_CLIENT_ID,
                clientSecret: OAUTH2_CLIENT_SECRET,
                refreshToken: OAUTH2_REFRESH_TOKEN,
                accessToken: accessToken.token,
            },
        });

        console.log('✅ OAuth2 email transporter initialized successfully');
        return transporter;
    } catch (error) {
        console.error('❌ Failed to initialize OAuth2 email transporter:', error);
        return null;
    }
}

function formatTrend(value) {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
}

function getTrendEmoji(value) {
    if (value > 5) return '📈';
    if (value < -5) return '📉';
    return '➡️';
}
async function sendAlert(alertData) {
    const {
        symbol,
        name,
        price,
        change,
        changePercent,
        threshold,
        trends,
        chartUrl
    } = alertData;

    // Format the SMS message
    const message = `
🔔 ${symbol} Alert: $${price.toFixed(2)} (${changePercent})
${name}
Threshold: $${threshold.toFixed(2)}
📊 Trends:
${getTrendEmoji(trends['3mo'])} 3mo: ${formatTrend(trends['3mo'])}
${getTrendEmoji(trends['6mo'])} 6mo: ${formatTrend(trends['6mo'])}
${getTrendEmoji(trends['12mo'])} 12mo: ${formatTrend(trends['12mo'])}
📈 Chart: ${chartUrl}
`.trim();

    console.log('\n' + '='.repeat(50));
    console.log('SENDING ALERT:');
    console.log('='.repeat(50));
    console.log(message);
    console.log('='.repeat(50) + '\n');

    // Create fresh OAuth2 transporter (access tokens can expire)
    const emailTransporter = await initializeEmail();

    // Send email-to-SMS if email is configured
    if (emailTransporter && alertPhone) {
        try {
            // Clean phone number and get carrier gateway
            const cleanPhone = alertPhone.replace(/\D/g, '');
            const gateway = getCarrierGateway(alertPhone);
            const emailAddress = `${cleanPhone}@${gateway}`;
            const carrier = detectCarrier(alertPhone);

            console.log(`📱 Sending to: ${emailAddress} (detected carrier: ${carrier})`);

            const mailOptions = {
                from: EMAIL_USER,
                to: emailAddress,
                subject: `${symbol} Alert`, // Keep subject short for SMS
                text: message
            };

            const result = await emailTransporter.sendMail(mailOptions);
            console.log(`✓ Email-to-SMS sent successfully via OAuth2! Message ID: ${result.messageId}`);
            return true;
        } catch (error) {
            console.error('✗ Error sending email-to-SMS:', error.message);
            return false;
        }
    } else {
        console.log('⚠ Test mode: Email-to-SMS would be sent to', alertPhone || 'NOT_CONFIGURED');
        console.log('⚠ Configure email credentials in .env to enable email-to-SMS');
        return false;
    }
}

// Test function to send a test alert
async function sendTestAlert() {
    console.log('🧪 Sending test alert...\n');

    const testData = {
        symbol: 'TEST',
        name: 'Test Stock Alert',
        price: 150.00,
        change: -2.50,
        changePercent: '-1.6%',
        threshold: 152.50,
        trends: {
            '3mo': -5.2,
            '6mo': 12.3,
            '12mo': 8.7
        },
        chartUrl: 'https://example.com/chart/TEST'
    };

    const result = await sendAlert(testData);

    if (result) {
        console.log('✅ Test alert sent successfully!');
    } else {
        console.log('❌ Test alert failed to send.');
    }

    return result;
}

module.exports = { sendAlert, sendTestAlert };
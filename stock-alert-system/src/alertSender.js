require('dotenv').config();
const nodemailer = require('nodemailer');

// Email configuration
const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;
const emailHost = process.env.EMAIL_HOST || 'smtp.gmail.com';
const emailPort = process.env.EMAIL_PORT || 587;
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
function initializeEmail() {
    if (!emailUser || !emailPass) {
        console.warn('Email credentials not configured. Running in test mode.');
        return null;
    }

    return nodemailer.createTransporter({
        host: emailHost,
        port: emailPort,
        secure: false, // true for 465, false for other ports
        auth: {
            user: emailUser,
            pass: emailPass
        }
    });
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

    // Initialize email transporter if not already done
    if (!transporter) {
        transporter = initializeEmail();
    }

    // Send email-to-SMS if email is configured
    if (transporter && alertPhone) {
        try {
            // Clean phone number and get carrier gateway
            const cleanPhone = alertPhone.replace(/\D/g, '');
            const gateway = getCarrierGateway(alertPhone);
            const emailAddress = `${cleanPhone}@${gateway}`;
            const carrier = detectCarrier(alertPhone);

            console.log(`📱 Sending to: ${emailAddress} (detected carrier: ${carrier})`);

            const mailOptions = {
                from: emailUser,
                to: emailAddress,
                subject: `${symbol} Alert`, // Keep subject short for SMS
                text: message
            };

            const result = await transporter.sendMail(mailOptions);
            console.log(`✓ Email-to-SMS sent successfully! Message ID: ${result.messageId}`);
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
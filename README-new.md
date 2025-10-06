# 📈 StockAlerts & 🍀 PuChokDii

**Multi-Platform Suite**: Free SMS stock monitoring and Thai lottery companion with full bilingual support.

[![Deploy to GitLab Pages](https://img.shields.io/badge/Deploy-GitLab%20Pages-orange)](https://gitlab.com)
[![Backend Status](https://img.shields.io/badge/Backend-Vercel-black)](https://stockalerts-backend-g784hxipc-spataray-5609s-projects.vercel.app)
[![Translation Status](https://img.shields.io/badge/i18n-EN%20%7C%20TH-green)](#)

## 🌟 Features

### StockAlerts Platform
- **100% Free SMS Alerts** via email-to-SMS technology
- **Real-time Stock Monitoring** with custom thresholds
- **Magic Link Authentication** (passwordless login)
- **Multi-user Support** with individual settings
- **Bilingual Interface** (English/Thai)

### PuChokDii Platform
- **Thai Lottery Companion** with cultural authenticity
- **Number Checking** against latest results
- **Bilingual Support** (Thai/English)
- **Cultural Design** with traditional Thai aesthetics
- **Shared Backend** with StockAlerts authentication

## 🚀 Live Deployment

### Frontend (GitLab Pages)
- **StockAlerts**: `https://yourusername.gitlab.io/stockalerts/`
- **PuChokDii**: `https://yourusername.gitlab.io/stockalerts/puchokdii/`
- **Platform Selector**: `https://yourusername.gitlab.io/stockalerts/platforms.html`

### Backend (Vercel)
- **API Base**: `https://stockalerts-backend-g784hxipc-spataray-5609s-projects.vercel.app`
- **Endpoints**: Authentication, User Management, Stock Monitoring

## 🌍 Translation System

Both platforms feature a comprehensive bilingual system:

- **Auto-detection**: Browser language detection
- **Persistent Storage**: Language preference memory
- **Instant Switching**: Real-time translation updates
- **Cultural Theming**: Platform-specific styling
- **Flag Toggles**: 🇺🇸 EN / 🇹🇭 ไทย

## 🛠️ Technology Stack

### Frontend
- **Vanilla JavaScript** with modern ES6+
- **Responsive CSS** with CSS custom properties
- **Translation Engine** with dynamic content updates
- **PWA-Ready** with service worker support

### Backend
- **Node.js + Express** serverless functions
- **SQLite Database** for user management
- **Email-to-SMS** via nodemailer + carrier gateways
- **JWT Authentication** with magic links
- **CORS & Security** middleware

### Deployment
- **GitLab CI/CD** for automated builds
- **GitLab Pages** for frontend hosting
- **Vercel** for serverless backend
- **Custom Domain** support ready

## 📱 Mobile Responsive

Both platforms are fully optimized for:
- **📱 Mobile phones** (iOS, Android)
- **💻 Tablets** (iPad, Android tablets)
- **🖥️ Desktop** (all modern browsers)
- **🌐 Cross-browser** compatibility

## 🔧 Local Development

```bash
# Clone repository
git clone https://gitlab.com/yourusername/stockalerts.git
cd stockalerts

# Install dependencies
npm install

# Start local backend (optional)
npm run dev

# Open platforms in browser
# StockAlerts: open index.html
# PuChokDii: open puchokdii/index.html
```

## 🎯 Carrier Support

**Email-to-SMS** works with all major US carriers:
- Verizon (`@vtext.com`)
- AT&T (`@txt.att.net`)
- T-Mobile (`@tmomail.net`)
- Sprint (`@messaging.sprintpcs.com`)
- And 10+ more carriers

## 🔐 Security Features

- **No API keys stored** in frontend code
- **JWT tokens** with secure expiration
- **Rate limiting** on all endpoints
- **CORS protection** for cross-origin requests
- **Input validation** and sanitization

## 📊 Analytics Ready

Ready for integration with:
- Google Analytics
- Plausible Analytics
- Custom tracking events
- User behavior monitoring

## 🌟 Cultural Authenticity

**PuChokDii** features:
- **Sarabun Font** for authentic Thai typography
- **Traditional Colors** (gold, indigo, crimson)
- **Cultural Wisdom** quotes and messaging
- **Respectful Design** honoring Thai traditions

## 🚀 Deployment Guide

### GitLab Pages (Frontend)
1. Push to main branch
2. GitLab CI automatically builds and deploys
3. Access at `https://yourusername.gitlab.io/stockalerts/`

### Vercel (Backend)
```bash
vercel --prod
```

## 📞 Support

- **Issues**: Use GitLab Issues for bug reports
- **Features**: Submit merge requests for enhancements
- **Documentation**: Check our comprehensive guides

## 📄 License

MIT License - feel free to use and modify for your projects.

---

**Made with ❤️ by the StockAlerts Team**

*Bringing free stock monitoring and cultural lottery experiences to everyone.*
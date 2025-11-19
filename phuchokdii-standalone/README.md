# 🍀 PhuChokDii (ผู้โชคดี)

**Your Thai Lottery Companion - Where Wisdom Meets Luck**

A beautiful, culturally authentic Thai lottery companion featuring real-time results, fun interactive features, and full Thai/English bilingual support.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://stockalerts-9afde2.gitlab.io/phuchokdii-v2/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## ✨ Features

### 🔍 Core Features
- **Real Lottery Checker** - Check 6-digit numbers against actual Thai Government Lottery results
- **Live API Integration** - Real-time results from rayriffy Thai Lottery API
- **Bilingual Support** - Full Thai 🇹🇭 and English 🇺🇸 with instant language switching
- **Mobile Optimized** - Numeric keyboard on iPhone/iOS, responsive design

### 🎲 Fun Interactive Features
1. **Lucky Number Generator** - Animated random 6-digit lottery numbers
2. **Dream Interpreter** - Convert Thai dreams (snake, water, monk, elephant, etc.) to lucky numbers
3. **Lucky Color of the Day** - Thai Buddhist daily lucky colors with suggested numbers
4. **Jackpot Visualizer** - See what 6M baht can buy (fun and relatable)
5. **Lucky Number Combos** - 4 strategies: Golden Dragon, Phoenix, Lucky 7, Royal Fortune
6. **Thai Zodiac Numbers** - 12-year cycle lucky numbers (rat, ox, tiger, etc.)
7. **Number Scanner** - Check any 6-digit number from daily life
8. **Spin the Wheel** - Animated fortune wheel (0-9)
9. **Temple Fortune Sticks** - Traditional Thai temple fortune with shake animation
10. **Number Meanings Encyclopedia** - Cultural meanings for digits 0-9

---

## 🎨 Design Philosophy

### Culturally Authentic
- **Thai Royal Colors**: Purple (สีม่วง), Gold (สีทอง), Crimson (สีแดง)
- **Buddhist Symbolism**: Lotus 🪷, Temple design, Monk robes colors
- **Thai Typography**: Sarabun font for Thai, Inter for English
- **Respectful**: Footer disclaimer "เพื่อความบันเทิงเท่านั้น" (For entertainment only)

### Beautiful UI
- Thai silk texture background with golden shimmer
- Temple roof accent on navbar with gold gradient
- Smooth animations: wheel spins, stick shakes, digit reveals
- Card-based layout on warm cream background

---

## 🚀 Quick Start

### Prerequisites
- None! Pure static HTML/CSS/JavaScript - no build tools needed

### Local Development
```bash
# Clone the repository
git clone https://github.com/yourusername/PhuChokDii.git
cd PhuChokDii

# Open in browser (no server needed, but recommended for CORS)
# Option 1: Simple Python server
python3 -m http.server 8000

# Option 2: Node.js http-server
npx http-server

# Option 3: Just open index.html in browser
open index.html
```

Visit `http://localhost:8000` in your browser.

---

## 📁 Project Structure

```
PhuChokDii/
├── index.html              # Main HTML file (461 lines)
├── assets/
│   ├── css/
│   │   └── style.css       # Thai temple-inspired styles (1,698 lines)
│   └── js/
│       ├── app.js          # Core application logic (1,035 lines)
│       └── translations.js # Bilingual translations (214 lines)
├── docs/                   # Documentation
├── README.md               # This file
└── LICENSE                 # MIT License
```

**Total**: ~3,400 lines of clean, documented code

---

## 🌐 Deployment

### GitHub Pages (Recommended)
```bash
# Push to GitHub
git push origin main

# Enable GitHub Pages in repository settings
# Settings → Pages → Source: main branch / root folder
```

Your site will be live at: `https://yourusername.github.io/PhuChokDii/`

### GitLab Pages
```bash
# .gitlab-ci.yml is already configured
git push origin main

# Site will auto-deploy to GitLab Pages
```

### Other Static Hosts
Works perfectly on:
- **Netlify**: Drop the folder or connect to GitHub
- **Vercel**: Deploy with `vercel --prod`
- **Cloudflare Pages**: Connect to Git repo
- **GitHub Pages**: As shown above

---

## 🔧 Technology Stack

### Pure Vanilla Stack (No Dependencies!)
- **HTML5**: Semantic, accessible markup
- **CSS3**: CSS Variables, Grid, Flexbox, Animations
- **JavaScript ES6+**: Modern vanilla JS, async/await
- **External Fonts**: Google Fonts (Sarabun, Inter)
- **Icons**: Font Awesome 6.0
- **API**: rayriffy Thai Lottery API (free, community-maintained)

### Why Vanilla?
- ✅ **Fast**: No framework overhead, instant load times
- ✅ **Simple**: Easy to understand and modify
- ✅ **Portable**: Works anywhere, no build step
- ✅ **Maintainable**: No dependency hell, no breaking updates

---

## 🎯 API Integration

Uses the free **rayriffy Thai Lottery API**:
- Latest results: `https://lotto.api.rayriffy.com/latest`
- Historical data: `https://lotto.api.rayriffy.com/list`

Features graceful fallback to mock data if API is unavailable.

---

## 🌍 Internationalization (i18n)

Full bilingual support:
- **172 translation keys** covering all UI elements
- **Language switcher** in navbar (🇹🇭 ไทย / 🇺🇸 EN)
- **Persisted preference** in localStorage
- **Dynamic updates** without page reload

---

## 📱 Mobile Support

Optimized for mobile:
- **Responsive design**: Mobile-first approach
- **Numeric keyboard**: `type="tel"` for number inputs (iPhone-friendly)
- **Touch-friendly**: Large buttons, comfortable tap targets
- **Fast loading**: Minimal assets, optimized images

---

## 🎨 Color Palette

```css
/* Thai Royal Colors */
--primary: #7C3AED;        /* Royal Purple (สีม่วง) */
--gold: #FFD700;           /* Temple Gold (สีทอง) */
--crimson: #DC143C;        /* Thai Crimson (สีแดง) */
--lotus-pink: #FFB6C1;     /* Lotus Pink (สีชมพูบัว) */
--saffron: #FF9933;        /* Monk Robes (สีเหลืองกุ๊น) */

/* Neutral Thai Palette */
--bg: #FFF8F0;             /* Warm cream like Thai silk */
--text: #2D1810;           /* Dark brown like teak wood */
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Areas for Contribution
- 🌐 Additional language support (Chinese, Japanese, etc.)
- 🎨 UI/UX improvements
- ✨ New lottery-related features
- 🐛 Bug fixes and optimizations
- 📚 Documentation improvements

---

## 📄 License

MIT License - Free to use and modify

---

## 🙏 Acknowledgments

- **Thai Government Lottery Office** for official lottery data
- **rayriffy** for the free Thai lottery API
- **Thai lottery community** for inspiration and cultural insights
- **Open source community** for fonts, icons, and tools

---

## ⚠️ Disclaimer

**เพื่อความบันเทิงเท่านั้น - For entertainment only**

This application is designed for entertainment and educational purposes only. It does not promote gambling. The lottery results are provided by third-party APIs and we cannot guarantee 100% accuracy. Always verify results with official Thai Government Lottery Office sources.

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/PhuChokDii/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/PhuChokDii/discussions)

---

## 🍀 About the Name

**PhuChokDii (ผู้โชคดี)** translates to:
- **Pu (ผู้)** - "Person" or "One who"
- **ChokDii (โชคดี)** - "Good luck" or "Fortune"

*"The one who has good fortune"*

---

**Made with ❤️ for the Thai lottery community**

*ไม่ส่งเสริมการพนัน - Does not promote gambling*

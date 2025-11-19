# 🚀 Migration from StockAlerts Repository

## Why Separate?

PhuChokDii v2 has been moved to its own repository because:

1. **No Backend Dependencies** - PhuChokDii is pure frontend, doesn't use StockAlerts backend
2. **Different Purpose** - StockAlerts = Stock monitoring, PhuChokDii = Thai lottery
3. **Simpler Deployment** - Static hosting only, no Node.js/PostgreSQL needed
4. **Cleaner Codebase** - No mixing of unrelated projects
5. **Better Maintainability** - Separate issues, PRs, and documentation

## What Was Removed?

The following StockAlerts files are **NOT** included in this clean repository:

- ❌ `/api/` - Backend API endpoints
- ❌ `/database/` - PostgreSQL database schemas
- ❌ `/middleware/` - Backend middleware
- ❌ `server.js` - Node.js Express server
- ❌ `package.json` - Node.js dependencies
- ❌ `vercel.json` - Backend deployment config
- ❌ `multiUserMonitor.js` - Stock monitoring cron job
- ❌ `/phuchokdii/` - Old v1 version (discontinued)
- ❌ StockAlerts HTML files (index.html, dashboard.html)

## What Was Kept?

Only PhuChokDii v2 essentials:

- ✅ `index.html` - Main app
- ✅ `assets/css/style.css` - Thai temple styling
- ✅ `assets/js/app.js` - Core logic
- ✅ `assets/js/translations.js` - Bilingual support
- ✅ New deployment configs for static hosting
- ✅ Clean README specific to PhuChokDii

## External Dependencies

PhuChokDii uses only:

1. **rayriffy Thai Lottery API** (free, community-maintained)
   - `https://lotto.api.rayriffy.com/latest`
   - `https://lotto.api.rayriffy.com/list`

2. **CDN Resources**
   - Google Fonts: Sarabun & Inter
   - Font Awesome 6.0 icons

No backend, no database, no server needed!

## Deployment

### Before (StockAlerts repo):
- Mixed deployment with StockAlerts
- Required Node.js backend on Vercel
- PostgreSQL database needed
- Complex GitLab CI with multiple projects

### After (PhuChokDii standalone):
- Pure static hosting (GitHub Pages, Netlify, etc.)
- No backend required
- No database needed
- Simple deployment (just push to main branch)

## Next Steps

1. Create new repository on GitHub or GitLab
2. Push this clean codebase
3. Enable GitHub/GitLab Pages
4. Update domain/URL in documentation
5. Archive or remove PhuChokDii from StockAlerts repo

## Migration Date

Migrated: 2025-11-19

## Questions?

See main README.md or open an issue.

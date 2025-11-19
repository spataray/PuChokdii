# 📱 Cloud-Based Workflow Guide - PhuChokDii on GitLab

**Purpose**: Edit PhuChokDii from anywhere - iPhone, iPad, or any web browser - without using a laptop or terminal.

---

## 🌐 Editing from iPhone/Web Browser

### Method 1: GitLab Web IDE (Recommended)

**From Any Device with Browser**:

1. **Open GitLab Project**
   - Go to: `https://gitlab.com/yourusername/PhuChokDii`
   - Sign in to GitLab

2. **Launch Web IDE**
   - Click **"Web IDE"** button (top right, next to Clone)
   - Or press `.` (period key) on keyboard
   - Full VS Code-like editor opens in browser!

3. **Edit Files**
   - Navigate file tree on left
   - Click any file to edit
   - Changes are highlighted in real-time

4. **Commit Changes**
   - Click **"Source Control"** icon (left sidebar)
   - Review changes
   - Type commit message
   - Click **"Commit to main"**
   - Changes auto-deploy in 1-2 minutes!

**Supported Devices**:
- ✅ iPhone Safari (iOS 14+)
- ✅ iPad Safari
- ✅ Chrome/Firefox on any computer
- ✅ Android Chrome

---

### Method 2: Quick Edit (Single File)

**For small changes**:

1. **Navigate to File**
   - Browse to file in GitLab UI
   - Example: `assets/js/app.js`

2. **Click "Edit"**
   - Click **"Edit"** button (top right)
   - Or **"Web IDE"** for more features

3. **Make Changes**
   - Edit directly in browser
   - Preview changes (for markdown)

4. **Commit**
   - Scroll down
   - Enter commit message
   - Click **"Commit changes"**

---

### Method 3: Mobile App (Optional)

**GitLab Mobile App** (iOS/Android):
- Download from App Store
- View projects
- Review code
- Limited editing capability
- Better for viewing than editing

**Recommendation**: Use Safari/Chrome instead for full editing.

---

## 📝 Common Editing Tasks

### Update Lottery Numbers (Mock Data)

**File**: `assets/js/app.js`
**Lines**: 119-130

```javascript
function useMockData() {
    latestDraw = {
        date: '16 ตุลาคม 2567',
        firstPrize: '123456',  // ← Change this
        twoDigit: '56',         // ← Change this
        threeFront: '123',      // ← Change this
        threeBack: '456',       // ← Change this
        // ... etc
    };
}
```

---

### Update Translations

**File**: `assets/js/translations.js`
**Lines**: 2-173

```javascript
const translations = {
    th: {
        'check-title': 'ตรวจหวยของคุณ',  // ← Edit Thai text
        // ...
    },
    en: {
        'check-title': 'Check Your Number',  // ← Edit English text
        // ...
    }
};
```

---

### Update Styles

**File**: `assets/css/style.css`
**Lines**: 1-1698

```css
:root {
    --primary: #7C3AED;    /* ← Change colors */
    --gold: #FFD700;       /* ← Change colors */
}
```

---

### Add New Dream Symbol

**File**: `assets/js/app.js`
**Lines**: 506-515

```javascript
const dreamNumbers = {
    snake: ['341', '187', '925', '653'],
    // Add new entry:
    tiger: ['123', '456', '789', '012'],  // ← New symbol
};
```

Also add to HTML:
**File**: `index.html`
**Lines**: 150-176

```html
<button class="dream-btn" data-dream="tiger">
    🐅
    <span data-i18n="dream-tiger">เสือ</span>
</button>
```

---

## 🚀 Deployment (Automatic)

**GitLab Pages auto-deploys when you commit**:

1. **Commit to `main` branch** (via Web IDE or Edit)
2. **Wait 1-2 minutes** for GitLab CI/CD pipeline
3. **Check deployment**:
   - Go to: Settings → Pages
   - Your site URL: `https://yourusername.gitlab.io/PhuChokDii`
4. **View in browser** - changes are live!

**No build steps. No terminal. Just commit and go! 🎉**

---

## 📊 Monitor Deployments

**Check Pipeline Status**:
1. Click **"CI/CD"** → **"Pipelines"** (left sidebar)
2. See latest pipeline status:
   - ✅ Green = Success (site deployed)
   - ⏳ Orange = Running (wait ~1 min)
   - ❌ Red = Failed (check logs)

**View Logs**:
- Click pipeline number
- Click job name ("pages")
- See detailed logs

---

## 💡 Pro Tips for iPhone/Mobile Editing

### For Better Mobile Experience:

1. **Use Landscape Mode**
   - Rotate iPhone/iPad to landscape
   - More screen space for code

2. **Enable Desktop Site** (Optional)
   - Safari: Tap **AA** → **Request Desktop Website**
   - Gets full Web IDE features

3. **Use External Keyboard** (iPad)
   - Bluetooth keyboard = much faster editing
   - Supports all keyboard shortcuts

4. **Zoom In**
   - Pinch to zoom if text too small
   - GitLab Web IDE is responsive

---

## 🔄 Typical Workflow

### Example: Update Lucky Numbers

1. **Open GitLab** on iPhone Safari
   - Go to `gitlab.com/yourusername/PhuChokDii`

2. **Open Web IDE**
   - Tap **"Web IDE"** button

3. **Edit File**
   - Navigate: `assets/js/app.js`
   - Find line 122: `firstPrize: '123456'`
   - Change to: `firstPrize: '999888'`

4. **Commit**
   - Click **Source Control** (left)
   - Message: "Update first prize number"
   - Click **"Commit"**

5. **Wait 1 min**
   - Site auto-deploys

6. **Test**
   - Visit: `https://yourusername.gitlab.io/PhuChokDii`
   - Check your number: `999888`
   - Should show "Congratulations! 1st Prize!"

**Total time: ~3 minutes from iPhone! 📱✨**

---

## ⚙️ Advanced: Environment-Specific Changes

### Testing Before Going Live

**Option A: Use Branches** (Advanced)
1. Create branch: `test-changes`
2. Make edits in branch
3. Preview at: `https://yourusername.gitlab.io/PhuChokDii/-/jobs/artifacts/test-changes/...`
4. Merge to `main` when ready

**Option B: Quick Test** (Simple)
1. Make changes directly
2. If wrong, click file → **History**
3. Click previous version → **Revert**

---

## 🆘 Troubleshooting

### Site Not Updating?

1. **Check Pipeline**
   - CI/CD → Pipelines
   - Ensure latest pipeline succeeded (green)

2. **Hard Refresh Browser**
   - Chrome: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
   - Safari: Cmd+Option+R
   - Clears cache

3. **Check .gitlab-ci.yml**
   - Ensure file exists
   - Should have `only: - main` (deploys only main branch)

### Mobile Editing Issues?

1. **Try Different Browser**
   - Safari vs Chrome
   - Some work better on mobile

2. **Request Desktop Site**
   - Safari: AA button → Desktop Website

3. **Use Larger Device**
   - iPad > iPhone for editing
   - Any computer browser works perfectly

---

## 🎯 Summary

**You can edit PhuChokDii from anywhere, anytime:**

✅ **iPhone/iPad** - Full Web IDE in Safari
✅ **Any Computer** - Browser-based editing
✅ **Auto-Deploy** - Changes live in 1-2 minutes
✅ **No Terminal** - Never need command line
✅ **No Laptop** - Cloud-first workflow

**Perfect for entertainment projects where you want quick updates on the go! 🚀**

---

## 📱 Quick Reference

| Task | Steps | Time |
|------|-------|------|
| Quick text change | Edit → Commit | 1 min |
| Update numbers | Web IDE → Edit → Commit | 2 min |
| Add new feature | Web IDE → Multiple files → Commit | 5-10 min |
| Deploy changes | Automatic on commit | 1-2 min |

**Total workflow: Pure cloud. Pure convenience. Pure awesome. ☁️✨**

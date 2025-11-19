# 🚀 GitLab Setup Guide - PhuChokDii

**Complete step-by-step guide to deploy PhuChokDii on GitLab with cloud-based editing.**

---

## 📋 Prerequisites

- ✅ GitLab account (free): https://gitlab.com/users/sign_up
- ✅ Files ready at: `/tmp/PhuChokDii-new/`
- ✅ 5 minutes of your time

---

## 🎯 Setup Steps

### Step 1: Create New GitLab Project

1. **Go to GitLab**
   - Visit: https://gitlab.com
   - Sign in to your account

2. **Create New Project**
   - Click **"New project"** button (top right)
   - Or: https://gitlab.com/projects/new

3. **Choose "Create blank project"**

4. **Fill Project Details**:
   ```
   Project name: PhuChokDii
   Project slug: phuchokdii (auto-filled, lowercase)
   Visibility: Public (recommended) or Private

   ☑️ Initialize repository with a README
   ```

5. **Click "Create project"**

---

### Step 2: Upload Files via Web

**Option A: Web IDE Upload** (Recommended)

1. **Open Web IDE**
   - Click **"Web IDE"** button (top right)

2. **Delete Default README**
   - Right-click `README.md`
   - Select **"Delete"**

3. **Upload Files**
   - Right-click in file tree
   - Select **"Upload file"**
   - Upload files in this order:
     - `index.html`
     - `LICENSE`
     - `README.md`
     - `.gitignore`
     - `.gitlab-ci.yml`

4. **Upload Folders**
   - Create folder: Right-click → **"New folder"**
   - Create: `assets`, `assets/css`, `assets/js`, `docs`
   - Upload files to each folder

5. **Commit All**
   - Click **"Source Control"** (left sidebar)
   - Message: "Initial commit: PhuChokDii standalone repository"
   - Click **"Commit to main"**

**Option B: Git Push** (If you have git on laptop)

```bash
# Navigate to clean files
cd /tmp/PhuChokDii-new

# Initialize git
git init
git add .
git commit -m "Initial commit: PhuChokDii standalone repository"

# Add GitLab remote
git remote add origin https://gitlab.com/yourusername/phuchokdii.git

# Push to GitLab
git branch -M main
git push -u origin main
```

---

### Step 3: Enable GitLab Pages

1. **Wait for Pipeline**
   - Go to: **CI/CD** → **Pipelines** (left sidebar)
   - Wait ~1-2 minutes for first pipeline to complete
   - Status should show: ✅ **Passed**

2. **Configure Pages**
   - Go to: **Settings** → **Pages** (left sidebar)
   - Your site URL will appear:
     ```
     https://yourusername.gitlab.io/phuchokdii/
     ```

3. **Visit Your Site!**
   - Click the URL
   - 🎉 PhuChokDii is now live!

---

### Step 4: Test Cloud Editing

**From Your iPhone or Browser**:

1. **Go to Project**
   - `https://gitlab.com/yourusername/phuchokdii`

2. **Open Web IDE**
   - Click **"Web IDE"** button

3. **Make a Test Edit**
   - Open: `index.html`
   - Line 44: Change "ตรวจหวยไทย" to "ตรวจหวยไทย v2"
   - Save (Cmd+S or Ctrl+S)

4. **Commit**
   - Click **Source Control**
   - Message: "Test: Update title"
   - Click **"Commit to main"**

5. **Wait 1 Minute**
   - Pipeline will auto-run

6. **Refresh Your Site**
   - Visit: `https://yourusername.gitlab.io/phuchokdii/`
   - See updated title!

**✅ Cloud editing works! 🎉**

---

## 🔧 Configuration Files Explained

### `.gitlab-ci.yml` (Already Included)

```yaml
# GitLab Pages deployment
pages:
  script:
    - mkdir -p public
    - cp index.html public/
    - cp -r assets public/
    # Creates 404 redirect
    - echo '...' > public/404.html
  artifacts:
    paths:
      - public
  only:
    - main  # Only deploy main branch
```

**How it works**:
1. Triggered on every commit to `main`
2. Copies files to `public/` folder
3. Publishes `public/` to GitLab Pages
4. Your site goes live automatically!

---

### Custom Domain (Optional)

**If you want your own domain**:

1. **Go to Settings → Pages**

2. **Click "New Domain"**

3. **Add Domain**:
   ```
   Domain: lottery.yourdomain.com
   ```

4. **Configure DNS** (at your domain registrar):
   ```
   CNAME: lottery → yourusername.gitlab.io
   ```

5. **Verify Domain**
   - GitLab will auto-verify
   - SSL certificate auto-generated (free!)

---

## 🌐 Cloud Editing Workflow

### Daily Workflow

```
iPhone/iPad/Computer
    ↓
Open gitlab.com
    ↓
Click "Web IDE"
    ↓
Edit files
    ↓
Commit changes
    ↓
Wait 1-2 minutes
    ↓
Site auto-deploys!
    ↓
View live site
```

**No laptop required. No terminal commands. Pure cloud! ☁️**

---

## 📱 Mobile Access

### From iPhone

1. **Safari** (Recommended)
   - Best compatibility
   - Request Desktop Site for full IDE

2. **Chrome**
   - Also works great
   - Full Web IDE support

3. **GitLab Mobile App**
   - Good for viewing
   - Limited editing
   - Use browser instead

---

## 🆘 Troubleshooting

### Pipeline Fails?

**Check Logs**:
1. CI/CD → Pipelines
2. Click failed pipeline (red ❌)
3. Click "pages" job
4. Read error message
5. Common fix: Check `.gitlab-ci.yml` syntax

### Site Not Updating?

1. **Hard Refresh**:
   - Chrome: Ctrl+Shift+R
   - Safari: Cmd+Option+R

2. **Check Pipeline Passed**:
   - CI/CD → Pipelines
   - Ensure latest is green ✅

3. **Wait Longer**:
   - Can take 2-5 minutes sometimes

### Can't Edit on Mobile?

1. **Request Desktop Site**:
   - Safari: Tap AA → Desktop Website

2. **Try Different Browser**:
   - Safari vs Chrome

3. **Use Computer**:
   - Any browser works perfectly

---

## 🎯 Next Steps

### After Setup:

1. ✅ **Bookmark Your Project**
   - `https://gitlab.com/yourusername/phuchokdii`

2. ✅ **Bookmark Your Live Site**
   - `https://yourusername.gitlab.io/phuchokdii/`

3. ✅ **Read Cloud Workflow Guide**
   - See: `docs/CLOUD_WORKFLOW.md`

4. ✅ **Make Your First Edit**
   - Update lottery numbers
   - Add new features
   - Customize colors

---

## 📊 GitLab vs GitHub - Why GitLab Wins Here

| Feature | GitLab | GitHub |
|---------|--------|--------|
| **Web IDE** | ✅ Built-in, full featured | ⚠️ github.dev (limited) |
| **Mobile Editing** | ✅ Excellent | ⚠️ Okay |
| **Pages Setup** | ✅ Automatic | ⚠️ Requires workflow file |
| **CI/CD** | ✅ Built-in, unlimited minutes | ⚠️ 2000 min/month limit |
| **Solo Projects** | ✅ Clean UI | ⚠️ More complex |
| **Content Scanning** | ✅ More lenient | ⚠️ Strict (caused lockout) |

**Winner for PhuChokDii**: 🏆 **GitLab**

---

## 🎉 You're Done!

**Your PhuChokDii site is now:**

✅ Live on GitLab Pages
✅ Auto-deploying on commits
✅ Editable from iPhone/Web
✅ Separated from critical GitHub repos
✅ 100% cloud-based workflow
✅ No laptop/terminal needed

**Live URL**: `https://yourusername.gitlab.io/phuchokdii/`

**Edit URL**: `https://gitlab.com/yourusername/phuchokdii` → Web IDE

---

**Questions?** See `docs/CLOUD_WORKFLOW.md` for detailed editing guide.

**Happy lottery checking! 🍀**

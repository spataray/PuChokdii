# 🚀 Vercel Deployment Guide - OAuth2 Configuration

## Step 1: Deploy to Vercel

### 1. Login to Vercel
Go to [vercel.com](https://vercel.com) and sign in

### 2. Import Project
- Click "Add New..." → "Project"
- Click "Import Third-Party Git Repository"
- Enter: `https://gitlab.com/spataray/stockalerts.git`
- Click "Continue"

### 3. Configure Project Settings
- **Project Name**: stockalerts (or your choice)
- **Framework Preset**: "Other"
- **Root Directory**: `./` (leave default)
- **Build Command**: Leave empty
- **Output Directory**: Leave empty

### 4. Add Environment Variables

**CRITICAL:** Click "Environment Variables" section and add these ONE BY ONE:

**For EACH variable:**
1. Enter the name in "KEY" field
2. Enter the value in "VALUE" field
3. Select ALL THREE checkboxes: ✅ Production ✅ Preview ✅ Development
4. Click "Add"

**Add these variables:**

| KEY | VALUE |
|-----|-------|
| `NODE_ENV` | `production` |
| `FRONTEND_URL` | `https://spataray.gitlab.io/stockalerts` |
| `JWT_SECRET` | `create-your-own-random-secret-string-here` |
| `EMAIL_USER` | `phuchokdii@gmail.com` |
| `OAUTH2_CLIENT_ID` | `354705083681-f86dh8e022f84d4fgnfpr5i2oncqs6af.apps.googleusercontent.com` |
| `OAUTH2_CLIENT_SECRET` | `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` |
| `OAUTH2_REFRESH_TOKEN` | `1//0422xsgKcFiQ2CgYIARAAGAQSNwF-L9IrSu_sto1m2QD0ukCiRo_62EDkmeKn3Bz3knM4bY-tyWT0Ahh1OXvtAcyM30JJU2lJGWc` |
| `ALPHA_VANTAGE_API_KEY` | Your Alpha Vantage API key |

### 5. Deploy
Click "Deploy" button and wait 2-3 minutes

---

## Step 2: Verify Deployment

### Get Your Vercel URL
After deployment completes, you'll see a URL like:
```
https://stockalerts-xyz123.vercel.app
```

### Test the Backend
Visit: `https://your-vercel-url.vercel.app/api/health`

**Expected Response:**
```json
{
  "success": true,
  "message": "StockAlerts API is running",
  "timestamp": "2024-10-23T..."
}
```

### Check OAuth2 Initialization
Look at the deployment logs:
1. Vercel Dashboard → Your Project → Deployments tab
2. Click on latest deployment
3. Click "View Function Logs" or "Runtime Logs"
4. Look for: `✅ OAuth2 email transporter initialized successfully`

---

## Step 3: Update Frontend

Once you have your Vercel URL, you need to update the frontend to use it.

**I'll help you do this in the next step** - just tell me your Vercel URL!

---

## Troubleshooting

### ❌ "Environment variables not loading"
**Solution:**
1. Go to: Vercel Dashboard → Settings → Environment Variables
2. Verify EACH variable shows "Production, Preview, Development"
3. If any show only one environment, delete and re-add them
4. Redeploy: Deployments → ⋯ → Redeploy

### ❌ OAuth2 errors in logs
**Check:**
- Are all 4 OAuth2 variables set? (EMAIL_USER, OAUTH2_CLIENT_ID, OAUTH2_CLIENT_SECRET, OAUTH2_REFRESH_TOKEN)
- Any typos in the values?
- Are they set for ALL environments?

### ❌ "Failed to initialize OAuth2"
**Solution:**
- Check the refresh token hasn't expired
- Verify Client ID and Secret match your Google Cloud project
- Make sure EMAIL_USER matches the Gmail account you authorized

---

## 💰 Total Cost: $0/month

Everything runs on free tiers!

---

## 📋 Quick Checklist

Before proceeding:
- [ ] Vercel project deployed successfully
- [ ] All 8 environment variables added
- [ ] Each variable set for Production, Preview, AND Development
- [ ] `/api/health` endpoint returns success
- [ ] No OAuth2 errors in deployment logs

**Ready? Share your Vercel URL and we'll update the frontend!**

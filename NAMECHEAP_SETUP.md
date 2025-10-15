# 🌐 Namecheap Domain Setup Guide

## Overview
This guide will help you configure your custom domain (baintegrate.com) to work with your deployed Vercel frontend and Railway backend.

## Prerequisites
- ✅ Frontend deployed to Vercel
- ✅ Backend deployed to Railway
- ✅ Namecheap account with baintegrate.com domain

## Step 1: Get Your Deployment URLs

### Frontend (Vercel)
Your frontend is deployed at: `https://baintegrate-6xrv9bbz3-stephen-besseys-projects.vercel.app`

### Backend (Railway)
Your backend will be deployed at: `https://your-railway-app.up.railway.app` (replace with your actual Railway URL)

## Step 2: Configure Vercel Custom Domain

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Select your `baintegrate` project

2. **Add Custom Domain**
   - Go to Settings → Domains
   - Click "Add Domain"
   - Enter: `baintegrate.com`
   - Click "Add"

3. **Add WWW Domain**
   - Click "Add Domain" again
   - Enter: `www.baintegrate.com`
   - Click "Add"

4. **Note the DNS Records**
   Vercel will show you DNS records to add to Namecheap:
   ```
   Type: A Record
   Host: @
   Value: 76.76.21.21
   TTL: Automatic

   Type: CNAME Record
   Host: www
   Value: cname.vercel-dns.com.
   TTL: Automatic
   ```

## Step 3: Configure Railway Custom Domain

1. **Go to Railway Dashboard**
   - Visit: https://railway.app/dashboard
   - Select your backend project

2. **Add Custom Domain**
   - Go to Settings → Networking
   - Click "Custom Domain"
   - Enter: `api.baintegrate.com`
   - Click "Add"

3. **Note the DNS Record**
   Railway will show you a DNS record like:
   ```
   Type: CNAME Record
   Host: api
   Value: your-app-name.up.railway.app.
   TTL: Automatic
   ```

## Step 4: Configure DNS in Namecheap

1. **Login to Namecheap**
   - Go to: https://ap.www.namecheap.com/domains/list/
   - Find your `baintegrate.com` domain
   - Click "Manage"

2. **Go to Advanced DNS**
   - Click on "Advanced DNS" tab

3. **Add DNS Records**
   Add these records (replace existing ones if needed):

   **For Frontend (Vercel):**
   ```
   Type: A Record
   Host: @
   Value: 76.76.21.21
   TTL: Automatic

   Type: CNAME Record
   Host: www
   Value: cname.vercel-dns.com.
   TTL: Automatic
   ```

   **For Backend (Railway):**
   ```
   Type: CNAME Record
   Host: api
   Value: your-railway-app.up.railway.app.
   TTL: Automatic
   ```
   ⚠️ **Replace `your-railway-app.up.railway.app` with your actual Railway domain**

4. **Save Changes**
   - Click "Save All Changes"
   - DNS propagation takes 5-30 minutes

## Step 5: Update Frontend Configuration

Once you have your Railway backend URL, update the frontend configuration:

1. **Edit config.js**
   ```bash
   # Edit this file:
   /Users/stephenbessey/Documents/Development/baintegrate/assets/js/core/config.js
   ```

2. **Update API_BASE_URL**
   ```javascript
   const CONFIG = {
     API_BASE_URL: 'https://api.baintegrate.com',  // Your Railway domain
     // ... rest of config
   };
   ```

3. **Redeploy Frontend**
   ```bash
   cd /Users/stephenbessey/Documents/Development/baintegrate
   vercel --prod
   ```

## Step 6: Test Your Setup

### Test Frontend
```bash
# Visit these URLs:
https://baintegrate.com
https://www.baintegrate.com
```

### Test Backend
```bash
# Test health endpoint
curl https://api.baintegrate.com/health

# Should return: {"status": "healthy"}
```

### Test Customer Login
```bash
# Visit customer login
https://baintegrate.com/pages/login.html

# Test login (will use mock data until backend is fully configured)
```

## Step 7: Verify Everything Works

- [ ] Frontend loads at `https://baintegrate.com`
- [ ] Backend responds at `https://api.baintegrate.com/health`
- [ ] Customer login page loads
- [ ] All pages display correctly
- [ ] No SSL certificate errors

## Troubleshooting

### DNS Not Working
```bash
# Check DNS propagation
dig baintegrate.com
dig api.baintegrate.com

# Or use: https://dnschecker.org
```

### SSL Certificate Issues
- Vercel and Railway automatically provision SSL certificates
- Wait 5-10 minutes after DNS propagation
- Clear browser cache if needed

### Frontend Not Loading
- Check Vercel deployment status
- Verify DNS records are correct
- Ensure domain is added in Vercel dashboard

### Backend Not Responding
- Check Railway deployment logs
- Verify environment variables are set
- Ensure custom domain is configured

## Final Result

After setup, you'll have:
- ✅ **Frontend**: https://baintegrate.com
- ✅ **Backend**: https://api.baintegrate.com
- ✅ **Customer Portal**: https://baintegrate.com/pages/login.html
- ✅ **Dashboard**: https://baintegrate.com/pages/dashboard.html

Your customers can now access their portal at `https://baintegrate.com/pages/login.html` and view their business metrics and agent interactions!

---

**Need Help?**
- Vercel Support: https://vercel.com/support
- Railway Support: https://railway.app/support
- DNS Checker: https://dnschecker.org

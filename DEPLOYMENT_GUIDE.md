# 🚀 BA Integrate - 10-Day Deployment Guide

## 🎯 **CRITICAL SECURITY NOTICE**
This guide contains deployment instructions. Ensure all sensitive data (API keys, passwords, secrets) are kept secure and never committed to version control.

## 📋 **Pre-Deployment Checklist**

### ✅ **Frontend Files Complete**
- [x] All HTML pages created (platform.html, documentation.html, pricing.html)
- [x] Logo and favicon assets added
- [x] Deployment configuration files ready
- [x] Security headers configured

### ✅ **Backend Files Complete**
- [x] Railway deployment configuration
- [x] Database initialization scripts
- [x] Environment variable templates
- [x] Quick start scripts

## 🚀 **Day 1-2: Deploy Infrastructure**

### **Step 1: Deploy Frontend to Vercel**

```bash
# Navigate to frontend repository
cd /Users/stephenbessey/Documents/Development/baintegrate

# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Answer prompts:
# Set up and deploy? Yes
# Scope? Your account
# Link to existing project? No
# Project name: baintegrate
# Directory: ./
# Override settings? No

# Deploy to production
vercel --prod
```

**Expected Result**: Frontend deployed at `https://baintegrate.vercel.app`

### **Step 2: Deploy Backend to Railway**

```bash
# Navigate to backend repository
cd /Users/stephenbessey/Documents/Development/BAIS

# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Project name: baintegrate-api
# Environment: production

# Link to GitHub repo
railway link

# Add PostgreSQL database
railway add
# Select: PostgreSQL
# Name: baintegrate-db

# Deploy
railway up
```

### **Step 3: Configure Environment Variables**

In Railway Dashboard → Your Project → Variables, add:

```bash
API_ENV=production
JWT_SECRET=<generate-with-openssl-rand-base64-32>
ALLOWED_ORIGINS=https://baintegrate.com,https://www.baintegrate.com
RATE_LIMIT_ENABLED=true
RATE_LIMIT_PER_MINUTE=100
```

**Generate JWT Secret**:
```bash
openssl rand -base64 32
```

## 🌐 **Day 3: Configure DNS & Domains**

### **Step 1: Setup Custom Domains**

#### **Frontend (Vercel)**
1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add domain: `baintegrate.com`
3. Add domain: `www.baintegrate.com`
4. **Save the DNS records shown**

#### **Backend (Railway)**
1. Go to Railway Dashboard → Settings → Networking
2. Click "Generate Domain"
3. Note the generated URL (e.g., `baintegrate-api.up.railway.app`)
4. Click "Custom Domain"
5. Enter: `api.baintegrate.com`
6. **Save the DNS records shown**

### **Step 2: Configure DNS in Namecheap**

Go to: https://ap.www.namecheap.com/domains/list/

**Add these DNS records**:

```
Type: A Record
Host: @
Value: 76.76.21.21
TTL: Automatic

Type: CNAME Record
Host: www
Value: cname.vercel-dns.com.
TTL: Automatic

Type: CNAME Record
Host: api
Value: baintegrate-api.up.railway.app.
TTL: Automatic
```

**⚠️ Replace `baintegrate-api.up.railway.app` with your actual Railway domain**

### **Step 3: Wait for DNS Propagation**
- DNS changes take 5-30 minutes to propagate
- Use https://dnschecker.org to verify propagation

## 🔧 **Day 4: Post-Deployment Setup**

### **Step 1: Update Frontend Configuration**

Update `assets/js/core/config.js`:
```javascript
const CONFIG = {
  API_BASE_URL: 'https://api.baintegrate.com',  // Your Railway domain
  // ... rest of config
};
```

### **Step 2: Initialize Database**

```bash
# Connect to Railway
railway connect

# Run database initialization
railway run python scripts/init-db.sql

# Seed initial data
railway run python scripts/seed_data.py
```

### **Step 3: Test Integration**

```bash
# Test backend health
curl https://api.baintegrate.com/health

# Should return: {"status": "healthy"}

# Test frontend
# Visit: https://baintegrate.com
```

## 👥 **Day 5-7: Customer Onboarding**

### **Customer Onboarding Checklist**

For each customer:

1. **Create Business Account**
   ```bash
   # Use the seeding script to create customer
   python scripts/seed_data.py
   ```

2. **Generate API Key**
   - API key will be displayed once
   - Save securely - won't be shown again

3. **Setup Integration**
   - Provide customer with API documentation
   - Guide through first integration
   - Test contact form submission

4. **Monitor & Support**
   - Check Railway logs: `railway logs`
   - Monitor performance metrics
   - Provide ongoing support

## 📊 **Day 8-9: Monitoring & Optimization**

### **Setup Monitoring**

1. **UptimeRobot**
   - Monitor: `https://api.baintegrate.com/health`
   - Alert interval: 5 minutes

2. **Railway Metrics**
   - Monitor CPU, memory, and request metrics
   - Set up alerts for high usage

3. **Error Tracking**
   - Add Sentry DSN to Railway environment variables
   - Monitor application errors

### **Performance Optimization**

1. **Frontend**
   - Enable Vercel Analytics
   - Optimize images and assets
   - Test page load speeds

2. **Backend**
   - Monitor API response times
   - Optimize database queries
   - Scale resources as needed

## 🎉 **Day 10: Production Launch**

### **Final Verification**

- [ ] Frontend: `https://baintegrate.com` loads correctly
- [ ] Backend: `https://api.baintegrate.com/health` returns success
- [ ] API Docs: `https://api.baintegrate.com/docs` accessible
- [ ] Contact form submits successfully
- [ ] All customer integrations working
- [ ] Monitoring active and alerting properly

### **Customer Communication**

Send customers:
1. **API Documentation**: `https://baintegrate.com/pages/documentation.html`
2. **API Key**: (Generated during onboarding)
3. **Support Contact**: Your support email
4. **Status Page**: (If you set one up)

## 🔐 **Security Checklist**

- [ ] All environment variables secured
- [ ] No secrets in code or logs
- [ ] HTTPS enforced on all domains
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] Database access restricted
- [ ] API keys properly hashed
- [ ] Audit logging enabled

## 💰 **Monthly Costs**

- **Railway**: $25/month (Backend + Database)
- **Vercel**: $0/month (Frontend)
- **Domain**: $1/month (Namecheap)
- **Total**: $26/month

## 🆘 **Troubleshooting**

### **Frontend Not Loading**
```bash
# Check Vercel deployment
vercel logs

# Common issues:
# - Wrong API URL in config.js
# - Missing files in deployment
```

### **Backend Not Responding**
```bash
# Check Railway logs
railway logs

# Common issues:
# - Missing environment variables
# - Database connection failed
# - Port binding error
```

### **DNS Not Working**
```bash
# Check DNS propagation
dig baintegrate.com
dig api.baintegrate.com

# Or use: https://dnschecker.org
```

## 📞 **Support Resources**

- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs
- **DNS Checker**: https://dnschecker.org
- **Railway Status**: https://railway.app/status
- **Vercel Status**: https://vercel-status.com

---

## 🎯 **Success Criteria**

By Day 10, you should have:
- ✅ Production-ready platform live
- ✅ 3 customers successfully onboarded
- ✅ All integrations working
- ✅ Monitoring and support systems active
- ✅ Documentation and training materials ready

**You're ready to scale! 🚀**

# Cursor AI - Complete Implementation Guide
## BA Integrate Deployment to Railway + Vercel

---

## 📦 Repository Structure

You have **TWO separate repositories**:

### Frontend Repository
- **GitHub**: `https://github.com/stephenbessey/baintegrate.git`
- **Deployment**: Vercel
- **Domain**: `baintegrate.com` and `www.baintegrate.com`

### Backend Repository  
- **GitHub**: `https://github.com/stephenbessey/BAIS.git`
- **Deployment**: Railway
- **Domain**: `api.baintegrate.com`

---

## 🎯 PART 1: Frontend Repository Setup

### Directory Structure to Create

```bash
cd /path/to/baintegrate

# Create directory structure
mkdir -p assets/css/base
mkdir -p assets/css/components
mkdir -p assets/css/layouts
mkdir -p assets/js/core
mkdir -p assets/js/components
mkdir -p assets/images
mkdir -p pages
```

### Files to Create in Frontend Repo

Copy these files from the artifacts above:

**Root Files:**
1. `index.html` - Homepage
2. `vercel.json` - Vercel configuration
3. `package.json` - Node dependencies
4. `.gitignore` - Git ignore rules
5. `README.md` - Documentation

**CSS Files (`assets/css/`):**
6. `base/variables.css`
7. `base/reset.css`
8. `base/typography.css`
9. `components/button.css`
10. `components/card.css`
11. `components/form.css`
12. `components/navigation.css`
13. `components/footer.css`
14. `layouts/grid.css`
15. `layouts/section.css`

**JavaScript Files (`assets/js/`):**
16. `core/config.js`
17. `core/utils.js`
18. `components/Navigation.js`
19. `components/ContactForm.js`

**HTML Pages (`pages/`):**
20. `contact.html`
21. `platform.html`
22. `solutions.html`
23. `pricing.html` *(use existing or create simple version)*
24. `documentation.html` *(use existing or create simple version)*

**Images (`assets/images/`):**
25. `logo.svg`
26. `favicon.svg`

### Update config.js for Your API

**File: `assets/js/core/config.js`**

```javascript
const CONFIG = {
  // IMPORTANT: Update this after Railway deployment
  API_BASE_URL: 'https://api.baintegrate.com',  // Will be your Railway domain
  API_VERSION: 'v1',
  
  ENDPOINTS: {
    CONTACT: '/api/v1/contact',
    DEMO_REQUEST: '/api/v1/demo-generation/generate',
    NEWSLETTER: '/api/v1/newsletter/subscribe',
    BUSINESSES: '/api/v1/businesses',
  },
  
  CONTACT: {
    EMAIL: 'contact@baintegrate.com',
    SALES_EMAIL: 'sales@baintegrate.com',
    SUPPORT_EMAIL: 'support@baintegrate.com',
    PARTNERSHIPS_EMAIL: 'partnerships@baintegrate.com',
  },
  
  // Rest remains the same...
};

export default CONFIG;
```

### Commit Frontend Files

```bash
cd baintegrate
git add .
git commit -m "Add complete frontend with Clean Code architecture"
git push origin main
```

---

## 🎯 PART 2: Backend Repository Setup

### Files to Add to Backend Repo

Copy these files from the artifacts above:

**Root Files:**
1. `railway.json` - Railway configuration
2. `Dockerfile` - Container definition
3. `docker-compose.yml` - Local development
4. `requirements.txt` - Python dependencies (update with your existing)
5. `.env.example` - Environment template
6. `.gitignore` - Git ignore rules (merge with existing)
7. `Makefile` - Development commands

**Scripts (`scripts/`):**
8. `seed_data.py` - Database seeding
9. `init-db.sql` - Database initialization
10. `quick-start.sh` - Setup script

### Update railway.json for BAIS Repo

**File: `railway.json`**

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "pip install -r requirements.txt"
  },
  "deploy": {
    "startCommand": "uvicorn backend.production.main:app --host 0.0.0.0 --port $PORT --workers 4",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10,
    "healthcheckPath": "/health",
    "healthcheckTimeout": 30
  }
}
```

### Create .env File

**File: `.env` (DO NOT COMMIT)**

```bash
# Copy from .env.example
cp .env.example .env

# Generate JWT Secret
openssl rand -base64 32

# Edit .env and add:
DATABASE_URL=postgresql://...  # Railway will provide this
API_ENV=production
JWT_SECRET=<generated-secret>
OAUTH_DISCOVERY_URL=https://oauth.baintegrate.com/.well-known/openid-configuration
ALLOWED_ORIGINS=https://baintegrate.com,https://www.baintegrate.com
RATE_LIMIT_ENABLED=true
RATE_LIMIT_PER_MINUTE=100
```

### Commit Backend Files

```bash
cd BAIS
git add .
git commit -m "Add Railway deployment configuration"
git push origin main
```

---

## 🚀 PART 3: Deploy Backend to Railway

### Step 1: Install Railway CLI

```bash
npm install -g @railway/cli
```

### Step 2: Login and Initialize

```bash
# Navigate to backend repo
cd /path/to/BAIS

# Login to Railway
railway login

# Initialize project
railway init

# Project name: baintegrate-api
# Environment: production

# Link to GitHub repo
railway link
```

### Step 3: Add PostgreSQL Database

```bash
# Add PostgreSQL
railway add

# Select: PostgreSQL
# Name: baintegrate-db
```

### Step 4: Set Environment Variables

Go to Railway Dashboard → Your Project → Variables

Add these manually in the dashboard:

```bash
API_ENV=production
JWT_SECRET=<your-generated-secret>
OAUTH_DISCOVERY_URL=https://oauth.baintegrate.com/.well-known/openid-configuration
ALLOWED_ORIGINS=https://baintegrate.com,https://www.baintegrate.com
RATE_LIMIT_ENABLED=true
RATE_LIMIT_PER_MINUTE=100
```

**DATABASE_URL is automatically provided by Railway**

### Step 5: Deploy

```bash
railway up
```

### Step 6: Setup Custom Domain

1. Go to Railway Dashboard → Settings → Networking
2. Click "Generate Domain" (you'll get something like `baintegrate-api.up.railway.app`)
3. Note this URL - you'll need it
4. Click "Custom Domain"
5. Enter: `api.baintegrate.com`
6. Railway will show DNS records - **SAVE THESE**

Example:
```
CNAME api.baintegrate.com → baintegrate-api.up.railway.app
```

---

## 🚀 PART 4: Deploy Frontend to Vercel

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Deploy Frontend

```bash
# Navigate to frontend repo
cd /path/to/baintegrate

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

### Step 3: Setup Custom Domain

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add domain: `baintegrate.com`
3. Add domain: `www.baintegrate.com`
4. Vercel will show DNS records - **SAVE THESE**

Example:
```
A @ 76.76.21.21
CNAME www cname.vercel-dns.com
```

---

## 🌐 PART 5: Configure DNS in Namecheap

### Step 1: Login to Namecheap

Go to: https://ap.www.namecheap.com/domains/list/

### Step 2: Manage baintegrate.com

Click "Manage" next to baintegrate.com

### Step 3: Advanced DNS Settings

Go to: Advanced DNS tab

### Step 4: Add DNS Records

Add these records:

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
Value: baintegrate-api.up.railway.app.
TTL: Automatic

(Replace 'baintegrate-api.up.railway.app' with YOUR actual Railway domain)
```

### Step 5: Save Changes

Click "Save All Changes"

**DNS propagation takes 5-30 minutes**

---

## ✅ PART 6: Verification Checklist

### Test Backend API

```bash
# Wait 5 minutes after DNS update, then test:

# Health check
curl https://api.baintegrate.com/health

# Should return: {"status": "healthy"}

# API docs
# Visit: https://api.baintegrate.com/docs
```

### Test Frontend

```bash
# Visit in browser:
https://baintegrate.com

# Check:
- Homepage loads ✓
- Navigation works ✓
- All CSS loaded ✓
- All JS functional ✓
- Contact form works ✓
```

### Test Integration

```bash
# Contact form should send to:
https://api.baintegrate.com/api/v1/contact

# Check Railway logs:
railway logs

# Should see form submissions
```

---

## 🔧 PART 7: Post-Deployment Tasks

### 1. Run Database Migrations

```bash
# Connect to Railway
railway connect

# Or use Railway CLI
railway run alembic upgrade head
```

### 2. Seed Initial Data

```bash
railway run python scripts/seed_data.py
```

### 3. Setup Monitoring

**Add Sentry (Optional but Recommended):**

1. Sign up at sentry.io
2. Create project
3. Add to Railway environment variables:
```bash
SENTRY_DSN=<your-sentry-dsn>
SENTRY_ENVIRONMENT=production
```

**Add UptimeRobot:**

1. Go to uptimerobot.com
2. Add monitor:
   - Type: HTTPS
   - URL: `https://api.baintegrate.com/health`
   - Interval: 5 minutes
   - Alert contact: your email

### 4. Create Customer Onboarding Script

Create this in your BAIS repo:

**File: `scripts/onboard_customer.py`**

```python
"""
Customer Onboarding Script
Creates new customer with API key
"""

import sys
import secrets
import hashlib
from uuid import uuid4

def generate_api_key():
    """Generate secure API key"""
    return secrets.token_urlsafe(32)

def hash_api_key(api_key):
    """Hash API key for storage"""
    return hashlib.sha256(api_key.encode()).hexdigest()

def onboard_customer(business_name, business_email):
    """Onboard new customer"""
    business_id = str(uuid4())
    api_key = generate_api_key()
    api_key_hash = hash_api_key(api_key)
    
    print(f"Customer: {business_name}")
    print(f"Email: {business_email}")
    print(f"Business ID: {business_id}")
    print(f"API Key: {api_key}")
    print(f"Hash: {api_key_hash}")
    print()
    print("SAVE THE API KEY - IT WON'T BE SHOWN AGAIN!")
    
    # Here: Insert into database
    # db.insert_business(...)
    # db.insert_api_key(...)

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python onboard_customer.py <name> <email>")
        sys.exit(1)
    
    onboard_customer(sys.argv[1], sys.argv[2])
```

---

## 📋 PART 8: Summary for Next 10 Days

### Day 1 (TODAY): Infrastructure
- ✅ Frontend deployed to Vercel
- ✅ Backend deployed to Railway  
- ✅ DNS configured
- ✅ All working

### Day 2-3: Preparation
- Create customer documentation
- Setup demo environments
- Test all endpoints
- Prepare onboarding materials

### Day 4-6: Customer Onboarding
- Day 4: Customer 1
- Day 5: Customer 2
- Day 6: Customer 3

### Day 7-8: Testing & Optimization
- Load testing
- Performance tuning
- Monitor logs
- Fix any issues

### Day 9-10: Production Support
- Customer training
- Documentation updates
- Support monitoring
- Iterate based on feedback

---

## 🆘 Troubleshooting

### Backend Won't Start

```bash
# Check Railway logs
railway logs

# Common issues:
# - Missing environment variables
# - Database connection failed
# - Port binding error

# Solution:
# - Verify all env vars in Railway dashboard
# - Check DATABASE_URL is set
# - Ensure PORT variable is not set manually
```

### Frontend Not Loading

```bash
# Check Vercel logs
vercel logs

# Common issues:
# - Wrong API URL in config.js
# - CORS errors
# - Missing files

# Solution:
# - Update API_BASE_URL in config.js
# - Verify ALLOWED_ORIGINS in Railway
# - Check all files committed
```

### DNS Not Working

```bash
# Check DNS propagation
dig baintegrate.com
dig api.baintegrate.com

# Or use: https://dnschecker.org

# Common issues:
# - DNS hasn't propagated (wait 30 min)
# - Wrong DNS records
# - Missing trailing dots

# Solution:
# - Wait for propagation
# - Verify records in Namecheap
# - Add trailing dots: example.com.
```

---

## 💰 Monthly Costs

- Railway (Backend + DB): **$25/month**
- Vercel (Frontend): **$0/month**
- Domain (Namecheap): **$1/month**
- **Total: $26/month**

---

## 🎉 You're Done!

Your complete BA Integrate platform is now live at:
- **Frontend**: https://baintegrate.com
- **Backend API**: https://api.baintegrate.com
- **API Docs**: https://api.baintegrate.com/docs

**Ready to onboard your 3 customers!** 🚀

# Cursor AI - Quick Reference Checklist

## 📁 Two Separate Repositories

| Repo | URL | Deploy To | Domain |
|------|-----|-----------|--------|
| **Frontend** | `https://github.com/stephenbessey/baintegrate.git` | Vercel | `baintegrate.com` |
| **Backend** | `https://github.com/stephenbessey/BAIS.git` | Railway | `api.baintegrate.com` |

---

## ✅ Complete File Manifest

### Frontend Repo Files (26 files)

**Root (5 files):**
- [ ] `index.html`
- [ ] `vercel.json`
- [ ] `package.json`
- [ ] `.gitignore`
- [ ] `README.md`

**CSS - Base (3 files):**
- [ ] `assets/css/base/variables.css`
- [ ] `assets/css/base/reset.css`
- [ ] `assets/css/base/typography.css`

**CSS - Components (5 files):**
- [ ] `assets/css/components/button.css`
- [ ] `assets/css/components/card.css`
- [ ] `assets/css/components/form.css`
- [ ] `assets/css/components/navigation.css`
- [ ] `assets/css/components/footer.css`

**CSS - Layouts (2 files):**
- [ ] `assets/css/layouts/grid.css`
- [ ] `assets/css/layouts/section.css`

**JavaScript (4 files):**
- [ ] `assets/js/core/config.js`
- [ ] `assets/js/core/utils.js`
- [ ] `assets/js/components/Navigation.js`
- [ ] `assets/js/components/ContactForm.js`

**HTML Pages (5 files):**
- [ ] `index.html` (root)
- [ ] `pages/contact.html`
- [ ] `pages/platform.html`
- [ ] `pages/solutions.html`
- [ ] `pages/pricing.html` *(if have from earlier)*
- [ ] `pages/documentation.html` *(if have from earlier)*

**Images (2 files):**
- [ ] `assets/images/logo.svg`
- [ ] `assets/images/favicon.svg`

---

### Backend Repo Files (10 files)

**Root (7 files):**
- [ ] `railway.json`
- [ ] `Dockerfile`
- [ ] `docker-compose.yml`
- [ ] `requirements.txt` *(update existing)*
- [ ] `.env.example`
- [ ] `.gitignore` *(merge with existing)*
- [ ] `Makefile`

**Scripts (3 files):**
- [ ] `scripts/seed_data.py`
- [ ] `scripts/init-db.sql`
- [ ] `scripts/quick-start.sh`

---

## 🚀 Deployment Commands

### Frontend (Vercel)

```bash
cd /path/to/baintegrate
vercel login
vercel
vercel --prod
```

### Backend (Railway)

```bash
cd /path/to/BAIS
npm install -g @railway/cli
railway login
railway init
railway add  # Select PostgreSQL
railway up
```

---

## 🌐 DNS Configuration (Namecheap)

| Type | Host | Value | Purpose |
|------|------|-------|---------|
| A | @ | `76.76.21.21` | Frontend root |
| CNAME | www | `cname.vercel-dns.com` | Frontend www |
| CNAME | api | `<your-railway-url>.up.railway.app` | Backend API |

**After Railway deployment, replace `<your-railway-url>` with actual URL**

---

## ⚙️ Critical Configuration Updates

### 1. Update Frontend config.js

**File:** `assets/js/core/config.js`

**Line 4:** Change to your Railway URL:
```javascript
API_BASE_URL: 'https://api.baintegrate.com',  // After Railway deployment
```

### 2. Update Backend ALLOWED_ORIGINS

**Railway Environment Variables:**
```bash
ALLOWED_ORIGINS=https://baintegrate.com,https://www.baintegrate.com
```

### 3. Generate JWT Secret

```bash
openssl rand -base64 32
# Add to Railway environment variables
```

---

## 🔐 Railway Environment Variables

Required variables (add in Railway Dashboard):

```bash
DATABASE_URL=<auto-provided-by-railway>
API_ENV=production
JWT_SECRET=<generate-with-openssl>
OAUTH_DISCOVERY_URL=https://oauth.baintegrate.com/.well-known/openid-configuration
ALLOWED_ORIGINS=https://baintegrate.com,https://www.baintegrate.com
RATE_LIMIT_ENABLED=true
RATE_LIMIT_PER_MINUTE=100
```

---

## ✅ Verification Tests

### After Frontend Deployment

```bash
# Visit these URLs:
https://baintegrate.com            # Homepage
https://baintegrate.com/pages/contact.html  # Contact
https://baintegrate.com/pages/platform.html # Platform
```

### After Backend Deployment

```bash
# Test health endpoint
curl https://api.baintegrate.com/health

# Should return: {"status": "healthy"}

# Visit API docs
https://api.baintegrate.com/docs
```

### After DNS Configuration

```bash
# Check DNS propagation
dig baintegrate.com
dig api.baintegrate.com

# Or use: https://dnschecker.org
```

---

## 📝 Post-Deployment Tasks

1. **Run Database Migrations:**
```bash
railway run alembic upgrade head
```

2. **Seed Initial Data:**
```bash
railway run python scripts/seed_data.py
```

3. **Setup Monitoring:**
- Sign up for UptimeRobot
- Monitor: `https://api.baintegrate.com/health`
- Alert interval: 5 minutes

4. **Test Contact Form:**
- Go to `https://baintegrate.com/pages/contact.html`
- Submit test form
- Check Railway logs: `railway logs`

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Frontend not loading | Check Vercel deployment logs |
| Backend not responding | Run `railway logs` |
| CORS errors | Verify ALLOWED_ORIGINS in Railway |
| DNS not working | Wait 30 min for propagation |
| Database connection failed | Check DATABASE_URL in Railway |

---

## 📞 Support Resources

- **Railway Docs:** https://docs.railway.app
- **Vercel Docs:** https://vercel.com/docs
- **Railway Status:** https://railway.app/status
- **Vercel Status:** https://vercel-status.com
- **DNS Checker:** https://dnschecker.org

---

## 🎯 Success Criteria

- [ ] Frontend live at `https://baintegrate.com`
- [ ] Backend API live at `https://api.baintegrate.com`
- [ ] API docs accessible at `https://api.baintegrate.com/docs`
- [ ] Contact form working and submitting to backend
- [ ] All pages loading correctly
- [ ] DNS fully propagated
- [ ] Health check returning 200
- [ ] Database connected and migrations run
- [ ] Monitoring setup complete

---

## ⏱️ Timeline

| Task | Duration |
|------|----------|
| Copy all frontend files | 15 min |
| Deploy frontend to Vercel | 15 min |
| Copy backend config files | 10 min |
| Deploy backend to Railway | 30 min |
| Configure DNS in Namecheap | 15 min |
| Wait for DNS propagation | 15-30 min |
| Test and verify | 15 min |
| **Total** | **~2 hours** |

---

## 💰 Monthly Cost: $26

- Railway: $25/month
- Vercel: $0/month  
- Domain: $1/month

---

## 🎉 Final Status Check

Once everything is done, verify:

```bash
✅ https://baintegrate.com is live
✅ https://api.baintegrate.com/health returns success
✅ https://api.baintegrate.com/docs shows API documentation
✅ Contact form submits successfully
✅ Railway logs show no errors
✅ Monitoring is active
```

**You're ready to onboard customers!** 🚀

---

**Last Updated:** October 13, 2025
**Deployment Target:** Production
**Estimated Time to Complete:** 2 hours

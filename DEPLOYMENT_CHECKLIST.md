# 🚀 XEN MARKETS - DEPLOYMENT CHECKLIST

## Pre-Deployment

### **Environment Setup**
- [ ] Copy `.env.example` to `.env`
- [ ] Set `DATABASE_URL` (PostgreSQL connection string)
- [ ] Set `REDIS_URL` (optional, for caching)
- [ ] Set `ADMIN_WALLET_1` (your admin wallet address)
- [ ] Set `POLYGON_AMOY_RPC` or mainnet RPC
- [ ] Set `PRIVATE_KEY` (for contract deployment)
- [ ] Set `NODE_ENV=production`

### **Database**
- [ ] Create production database
- [ ] Run migrations: `npm run db:push`
- [ ] Apply indexes: `psql $DATABASE_URL -f DATABASE_INDEXES.sql`
- [ ] Verify tables created
- [ ] Set up automated backups

### **Dependencies**
- [ ] Install production dependencies: `npm install --production`
- [ ] Install rate limiting: `npm install express-rate-limit`
- [ ] Verify all packages installed

### **Smart Contracts**
- [ ] Deploy ConditionalTokens to mainnet
- [ ] Deploy OrderBookV2 to mainnet
- [ ] Deploy MarketFactory to mainnet
- [ ] Update `addresses.json` with deployed addresses
- [ ] Verify contracts on block explorer

### **Testing**
- [ ] Run unit tests: `npm run test`
- [ ] Test API endpoints manually
- [ ] Test trading flow end-to-end
- [ ] Test resolution flow
- [ ] Test admin functions
- [ ] Load test with 100+ concurrent users

---

## Deployment

### **Backend Deployment (Render/Railway/Heroku)**

#### **Option 1: Render**
```bash
# 1. Create new Web Service on Render
# 2. Connect GitHub repository
# 3. Set build command: npm install && npm run build
# 4. Set start command: npm start
# 5. Add environment variables from .env
# 6. Deploy
```

#### **Option 2: Railway**
```bash
# 1. Install Railway CLI: npm i -g @railway/cli
# 2. Login: railway login
# 3. Initialize: railway init
# 4. Add PostgreSQL: railway add
# 5. Set environment variables: railway variables
# 6. Deploy: railway up
```

#### **Option 3: Docker**
```bash
# Build image
docker build -t xen-markets .

# Run container
docker run -p 5000:5000 --env-file .env xen-markets
```

### **Frontend Deployment (Vercel/Netlify)**

#### **Option 1: Vercel**
```bash
# 1. Install Vercel CLI: npm i -g vercel
# 2. Login: vercel login
# 3. Deploy: vercel --prod
# 4. Set environment variables in Vercel dashboard
```

#### **Option 2: Netlify**
```bash
# 1. Install Netlify CLI: npm i -g netlify-cli
# 2. Login: netlify login
# 3. Build: npm run build
# 4. Deploy: netlify deploy --prod --dir=dist/public
```

### **DNS Configuration**
- [ ] Point domain to backend server
- [ ] Point subdomain to frontend CDN
- [ ] Configure SSL certificates
- [ ] Verify HTTPS working

---

## Post-Deployment

### **Verification**
- [ ] Visit production URL
- [ ] Connect wallet
- [ ] Test deposit
- [ ] Test buy order
- [ ] Test sell order
- [ ] Test portfolio view
- [ ] Test market resolution (admin)
- [ ] Verify WebSocket connection
- [ ] Check API response times

### **Monitoring**
- [ ] Set up error tracking (Sentry)
- [ ] Configure uptime monitoring (UptimeRobot)
- [ ] Set up performance monitoring
- [ ] Configure log aggregation
- [ ] Set up alerts for errors
- [ ] Monitor database performance

### **Security**
- [ ] Verify rate limiting working
- [ ] Test admin authentication
- [ ] Verify input validation
- [ ] Check CORS configuration
- [ ] Scan for vulnerabilities
- [ ] Review security headers

### **Performance**
- [ ] Check API response times
- [ ] Verify caching working
- [ ] Test with multiple users
- [ ] Monitor database queries
- [ ] Check WebSocket latency

---

## Launch

### **Pre-Launch**
- [ ] Announce launch date
- [ ] Prepare marketing materials
- [ ] Set up social media
- [ ] Create launch blog post
- [ ] Prepare support documentation

### **Launch Day**
- [ ] Deploy to production
- [ ] Verify all systems operational
- [ ] Monitor error rates
- [ ] Watch user activity
- [ ] Be ready for support requests

### **Post-Launch**
- [ ] Monitor for 24 hours
- [ ] Fix any critical issues
- [ ] Gather user feedback
- [ ] Plan improvements
- [ ] Celebrate! 🎉

---

## Rollback Plan

### **If Issues Occur:**
1. Identify the problem
2. Check error logs
3. Revert to previous deployment if needed
4. Fix issue in development
5. Test thoroughly
6. Redeploy

### **Rollback Commands:**
```bash
# Render: Revert to previous deployment in dashboard
# Railway: railway rollback
# Vercel: vercel rollback
# Docker: docker run previous-image-tag
```

---

## Environment Variables Reference

```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/db

# Redis (optional)
REDIS_URL=redis://host:6379

# Admin
ADMIN_WALLET_1=0x...
ADMIN_WALLET_2=0x...

# Blockchain
POLYGON_AMOY_RPC=https://rpc-amoy.polygon.technology
PRIVATE_KEY=...

# Monitoring
SENTRY_DSN=https://...

# App
NODE_ENV=production
PORT=5000
```

---

## Support Contacts

- **Technical Issues:** [your-email]
- **Security Issues:** [security-email]
- **General Support:** [support-email]

---

## Success Metrics

### **Week 1 Targets:**
- [ ] 100+ users
- [ ] 10+ markets created
- [ ] $10,000+ trading volume
- [ ] 99.9% uptime
- [ ] < 0.1% error rate

### **Month 1 Targets:**
- [ ] 1,000+ users
- [ ] 100+ markets
- [ ] $100,000+ volume
- [ ] Feature requests prioritized
- [ ] Community established

---

**Ready to launch! 🚀**

*Follow this checklist step-by-step for a smooth deployment.*

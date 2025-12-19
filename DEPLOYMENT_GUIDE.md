# 🚀 Deployment Guide - Render + Vercel

## ✅ Contracts Deployed (Polygon Amoy)
- **ConditionalTokens**: `0xa0a04094b602f65d053c7d957b71c47734431a68`
- **MarketFactory**: `0x701e59e245b25851d9a8e4c92741aa98eb1e922f`
- **OrderBook**: `0xf166cf88288e8479af84211d9fa9f53567863cf0`

## 📦 RENDER (Backend API)

### 1. Create PostgreSQL Database on Render
1. Go to Render Dashboard → New → PostgreSQL
2. Name: `xen-markets-db`
3. Copy the **Internal Database URL**

### 2. Deploy Backend
1. Go to Render Dashboard → New → Web Service
2. Connect your GitHub repo
3. Settings:
   - **Name**: `xen-markets-api`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment**: Node

### 3. Environment Variables (Render)
```bash
NODE_ENV=production
PORT=10000
DATABASE_URL=<paste_internal_database_url>
```

### 4. Initialize Database
After deployment, run in Render Shell:
```bash
npm run db:push
```

### 5. Get API URL
Copy your Render URL: `https://xen-markets-api.onrender.com`

---

## 🌐 VERCEL (Frontend)

### 1. Deploy Frontend
1. Go to Vercel Dashboard → New Project
2. Import your GitHub repo
3. Settings:
   - **Framework**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 2. Environment Variables (Vercel)
```bash
VITE_API_URL=https://xen-markets-api.onrender.com
VITE_WALLETCONNECT_PROJECT_ID=9945df869a89d702d7e974e7fc533383
```

### 3. Deploy
Click "Deploy" and wait for build to complete.

---

## ✅ Verification Checklist

### Backend (Render)
- [ ] Visit `https://your-api.onrender.com/api/health` → Should return `{"status":"ok"}`
- [ ] Visit `https://your-api.onrender.com/api/config` → Should return contract addresses
- [ ] Visit `https://your-api.onrender.com/api/markets` → Should return markets array

### Frontend (Vercel)
- [ ] Visit your Vercel URL
- [ ] Connect wallet (should work with Reown AppKit)
- [ ] Check browser console for API errors
- [ ] Try viewing markets

---

## 🔧 Post-Deployment Setup

### 1. Seed Initial Data (Optional)
Run in Render Shell:
```bash
npm run seed
```

### 2. Update Frontend Config
The frontend will automatically fetch contract addresses from `/api/config`

### 3. Test Full Flow
1. Connect wallet on frontend
2. Create a test market
3. Place a trade
4. Check portfolio

---

## 🐛 Troubleshooting

### Backend Issues
- **Database connection failed**: Check DATABASE_URL format
- **addresses.json not found**: Ensure `addresses.json` is in root directory
- **CORS errors**: Backend already has CORS enabled for all origins

### Frontend Issues
- **API calls failing**: Check VITE_API_URL is correct
- **Wallet not connecting**: Verify VITE_WALLETCONNECT_PROJECT_ID
- **Contract errors**: Ensure addresses.json is accessible via `/api/config`

---

## 📊 Current Status
✅ Smart contracts deployed to Polygon Amoy
✅ Backend API ready for deployment
✅ Frontend configured with Reown AppKit
✅ PostgreSQL schema ready
⏳ Awaiting Render + Vercel deployment

# Xen Markets - Deployment Guide

## 🚀 Quick Deploy

### Frontend (Vercel)
1. Push code to GitHub: `https://github.com/celvios/xen-market`
2. Connect Vercel to your GitHub repo
3. Set environment variables:
   - `VITE_API_URL=https://xen-markets-api.onrender.com`
4. Deploy automatically on push to main

### Backend (Render)
1. Connect Render to your GitHub repo
2. Create new Web Service
3. Set build command: `npm install && npm run build`
4. Set start command: `npm start`
5. Set environment variables:
   - `NODE_ENV=production`
   - `PORT=10000`

## 📋 Manual Deployment Steps

### 1. Prepare Repository
```bash
# Clone your repo
git clone https://github.com/celvios/xen-market.git
cd xen-market

# Install dependencies
npm install
```

### 2. Deploy Backend to Render
1. Go to [render.com](https://render.com)
2. Connect GitHub account
3. Create "New Web Service"
4. Select your repository
5. Configure:
   - **Name**: `xen-markets-api`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free (or Starter for better performance)

### 3. Deploy Frontend to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure:
   - **Framework**: `Vite`
   - **Root Directory**: `./`
   - **Build Command**: `npm run build:client`
   - **Output Directory**: `client/dist`
4. Set Environment Variables:
   - `VITE_API_URL`: Your Render backend URL

## 🔧 Environment Variables

### Backend (Render)
```
NODE_ENV=production
PORT=10000
DATABASE_URL=postgresql://... (optional)
REDIS_URL=redis://... (optional)
```

### Frontend (Vercel)
```
VITE_API_URL=https://your-backend.onrender.com
```

## 🌐 URLs After Deployment

- **Frontend**: `https://xen-markets.vercel.app`
- **Backend**: `https://xen-markets-api.onrender.com`
- **API Health**: `https://xen-markets-api.onrender.com/api/health`

## 🔄 Auto-Deploy Setup

### GitHub Actions (Optional)
The included `.github/workflows/deploy.yml` will:
1. Run tests on every push
2. Deploy to production on main branch
3. Requires secrets:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`

## 🐛 Troubleshooting

### Common Issues:
1. **Build fails**: Check Node.js version (use 18+)
2. **API not connecting**: Verify CORS settings and API URL
3. **WebSocket issues**: Ensure WebSocket support on hosting platform
4. **Database errors**: Check DATABASE_URL format

### Health Checks:
- Backend: `GET /api/health`
- Frontend: Check console for API connection errors

## 📊 Monitoring

After deployment, monitor:
- Response times
- Error rates
- Database connections
- WebSocket connections
- Fee revenue tracking

## 🔐 Security Notes

- Never commit `.env` files
- Use environment variables for all secrets
- Enable HTTPS in production
- Set up proper CORS policies
- Monitor for suspicious activity
# 🎯 Xen Markets - Prediction Market Platform

A modern, production-ready prediction market platform built on Polygon with automatic payouts and real-time trading.

## ✨ Features

- **Multi-Outcome Markets** - Binary, categorical, and scalar markets
- **Automatic Payouts** - Winners paid instantly on resolution (no claim needed!)
- **Real-Time Trading** - WebSocket updates for orders and trades
- **Order Book** - Full order book with bids/asks
- **Portfolio Management** - Track positions and P&L
- **Analytics Dashboard** - Market metrics and insights
- **Secure & Fast** - Rate limiting, validation, and optimized queries

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis (optional)

### Installation

```bash
# Clone repository
git clone <repo-url>
cd Xen-Markets

# Install dependencies
npm install
npm install express-rate-limit

# Setup environment
cp .env.example .env
# Edit .env with your values

# Setup database
npm run db:push
psql $DATABASE_URL -f DATABASE_INDEXES.sql

# Start development
npm run dev
```

Visit `http://localhost:5000`

## 📦 Tech Stack

### Frontend
- React + TypeScript + Vite
- TailwindCSS + shadcn/ui
- wagmi + viem + RainbowKit
- React Query + Zustand

### Backend
- Node.js + Express + TypeScript
- PostgreSQL + Drizzle ORM
- Redis caching
- WebSocket real-time updates

### Smart Contracts
- ConditionalTokens (ERC1155)
- OrderBookV2
- MarketFactory

## 🏗️ Architecture

```
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Route pages
│   │   ├── hooks/       # Custom hooks
│   │   └── lib/         # Utilities
├── server/              # Express backend
│   ├── middleware/      # Auth, validation, rate limiting
│   ├── __tests__/       # Unit tests
│   └── *.ts             # Services and routes
├── shared/              # Shared types and schemas
└── packages/
    └── contracts/       # Smart contracts
```

## 🔐 Security

- ✅ Admin authentication with wallet whitelist
- ✅ Rate limiting on all endpoints
- ✅ Input validation with Zod
- ✅ SQL injection prevention
- ✅ XSS protection

## 📊 API Endpoints

### Markets
- `GET /api/markets` - List all markets
- `POST /api/markets` - Create market (admin)
- `GET /api/markets/:id` - Get market details
- `POST /api/markets/:id/resolve` - Resolve market (admin)

### Trading
- `POST /api/trade/buy` - Buy shares
- `POST /api/trade/sell` - Sell shares
- `POST /api/orders` - Place order
- `GET /api/orders/market/:id` - Get order book

### Portfolio
- `GET /api/portfolio/:userId` - Get user positions
- `GET /api/activity/:userId` - Get trade history

### Users
- `POST /api/auth/wallet` - Authenticate with wallet
- `POST /api/users/:id/deposit` - Deposit USDC
- `POST /api/users/:id/withdraw` - Withdraw USDC

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run specific test
npm run test storage.test.ts
```

## 🚀 Deployment

See [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) for detailed deployment instructions.

### Quick Deploy

```bash
# Build
npm run build

# Start production
NODE_ENV=production npm start
```

## 📈 Performance

- API response time: < 200ms
- Page load time: < 2s
- WebSocket latency: < 100ms
- Database queries: Optimized with indexes

## 🎯 Unique Features

### 1. Automatic Payouts
Unlike traditional prediction markets, Xen Markets automatically credits winners when markets resolve. No claim button, no extra transactions!

### 2. Instant Settlement
Selling shares immediately credits your balance. No waiting period.

### 3. Multi-Outcome Support
Trade on complex events with multiple possible outcomes (categorical and scalar markets).

## 📝 Environment Variables

```bash
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
ADMIN_WALLET_1=0x...
POLYGON_AMOY_RPC=https://...
NODE_ENV=production
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

## 📄 License

MIT License - see LICENSE file

## 🆘 Support

- Documentation: [docs/](./docs/)
- Issues: GitHub Issues
- Discord: [Join our community]

## 🎉 Acknowledgments

Built with:
- [Gnosis Conditional Tokens](https://docs.gnosis.io/conditionaltokens/)
- [shadcn/ui](https://ui.shadcn.com/)
- [wagmi](https://wagmi.sh/)
- [Drizzle ORM](https://orm.drizzle.team/)

---

**Status: Production Ready 🚀**

All 7 development phases complete. Ready for mainnet deployment.

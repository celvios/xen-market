# Xen Markets

## Overview

Xen Markets is a prediction market platform for crypto, politics, sports, and tech events. Users can trade on market outcomes, track their portfolio, view activity history, and compete on leaderboards. The application features a modern dark-themed UI with wallet-based authentication.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: React Query for server state, custom React Context store for user state
- **Styling**: Tailwind CSS v4 with CSS variables for theming
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Charts**: Recharts for data visualization
- **Build Tool**: Vite

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (ES modules)
- **API Design**: RESTful JSON API with `/api` prefix
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Validation**: Zod with drizzle-zod integration

### Data Storage
- **Database**: PostgreSQL
- **Schema Location**: `shared/schema.ts` contains all table definitions
- **Tables**: users, markets, outcomes, positions, trades
- **Migrations**: Drizzle Kit for schema migrations (`drizzle-kit push`)

### Key Design Patterns
- **Monorepo Structure**: Client code in `client/`, server code in `server/`, shared types in `shared/`
- **Shared Schema**: Database types and validation schemas shared between frontend and backend
- **Storage Abstraction**: `IStorage` interface in `server/storage.ts` abstracts database operations
- **Path Aliases**: `@/` maps to client/src, `@shared/` maps to shared directory

### Authentication
- Wallet-based authentication (mock implementation for demo)
- User created or retrieved by wallet address via `/api/auth/wallet` endpoint
- User state managed in React Context with localStorage persistence potential

## External Dependencies

### Database
- PostgreSQL via `DATABASE_URL` environment variable
- Connection pooling with node-postgres (`pg` package)

### UI Libraries
- Full shadcn/ui component set with Radix UI primitives
- Lucide React for icons
- Embla Carousel for carousels
- date-fns for date formatting

### Development Tools
- Vite with React plugin and Tailwind CSS plugin
- Replit-specific plugins for development (cartographer, dev-banner, runtime-error-modal)
- esbuild for production server bundling

### Build Configuration
- Client builds to `dist/public`
- Server bundles common dependencies to reduce cold start times
- Production server runs as CommonJS bundle
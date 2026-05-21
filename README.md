# KhetiSe — Farm-to-Home Fresh Subscription Platform

A full-stack web application for managing recurring fresh produce subscriptions with automated order scheduling and inventory management.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js (App Router), Tailwind CSS, Radix UI / shadcn |
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB (Mongoose) |
| Auth | JWT (bcrypt password hashing, 7-day tokens) |
| Scheduling | node-cron (recurring order generation) |

## Features

- **Product browsing** — browse available fresh produce items
- **Subscriptions** — create daily/weekly recurring produce subscriptions
- **Automated orders** — cron-based scheduler generates orders on schedule with inventory guardrails
- **Auth & RBAC** — JWT authentication with `user` and `admin` roles
- **Admin dashboard** — sidebar-driven console with:
  - KPI overview
  - Products & inventory management (add/edit/update stock)
  - Orders view (all users)
  - Users management (paginated)
- **Profile management** — users can view and update their own profile

## Project Structure

```
grofresh/
├── backend/          # Express + TypeScript API
│   └── src/
│       ├── modules/  # auth, products, subscriptions, orders, users, scheduler
│       ├── middlewares/
│       ├── config/
│       └── seeds/    # seed scripts for users and products
└── frontend/         # Next.js app
    └── src/
        ├── app/      # pages (App Router)
        ├── components/
        ├── context/  # AuthContext
        └── lib/      # API client, utilities
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB instance (local or Atlas)

### Backend

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
PORT=4000
MONGO_URL=mongodb://localhost:27017/
MONGO_DB_NAME=khetise
JWT_SECRET_KEY=your-secret-key-change-in-production
```

```bash
# Seed the database
npm run seed

# Start development server
npm run dev
```

The API runs at `http://localhost:4000/api`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:3000`.

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Register a new user |
| POST | `/api/auth/login` | — | Login, returns JWT |
| GET | `/api/auth/me` | User | Get current user |
| GET | `/api/products` | — | List products |
| POST | `/api/products` | Admin | Create product |
| PATCH | `/api/products/:id` | Admin | Update product/stock |
| GET | `/api/subscriptions` | User | List own subscriptions |
| POST | `/api/subscriptions` | User | Create subscription |
| GET | `/api/orders` | User | List own orders |
| GET | `/api/admin/users` | Admin | List all users (paginated) |
| POST | `/api/scheduler/run` | Admin | Manually trigger scheduler |
| GET | `/api/health` | — | Health check |

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `4000` | API server port |
| `MONGO_URL` | `mongodb://localhost:27017/` | MongoDB connection string |
| `MONGO_DB_NAME` | `khetise` | Database name |
| `JWT_SECRET_KEY` | *(required)* | Secret for signing JWTs — change in production |

## Scripts

### Backend

```bash
npm run dev        # Start with nodemon (hot reload)
npm run build      # Compile TypeScript
npm run start      # Run compiled output
npm run seed       # Seed users and products
npm run seed:users
npm run seed:products
```

### Frontend

```bash
npm run dev    # Start development server
npm run build  # Production build
npm run start  # Start production server
npm run lint   # Run ESLint
```


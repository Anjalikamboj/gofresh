# KhetiSe Backend — Node.js + TypeScript

A production-grade Node.js TypeScript backend that is a faithful migration of the original Python FastAPI backend. All API routes, response shapes, auth flows, business rules, database indexes, and scheduler logic are preserved exactly.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Language | TypeScript (strict mode) |
| Framework | Express.js |
| Database | MongoDB via Mongoose |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Scheduler | node-cron |
| Security | helmet, cors |

---

## Project Structure

```
src/
├── app.ts                  # Express app setup (middleware, routes)
├── server.ts               # Bootstrap: DB connect, scheduler, HTTP listen
│
├── config/
│   ├── env.ts              # Typed environment variable loader
│   └── db.ts               # Mongoose connection helper
│
├── modules/
│   ├── auth/               # Register, Login, Me, Profile update
│   ├── users/              # Admin: paginated user list
│   ├── products/           # Products CRUD
│   ├── subscriptions/      # User subscriptions CRUD
│   ├── orders/             # Orders read + status update
│   └── scheduler/          # Order-generation cron + manual trigger
│
├── middlewares/
│   ├── auth.middleware.ts  # JWT verification + role guard
│   └── error.middleware.ts # Centralized error handler
│
├── utils/
│   ├── ApiError.ts         # Custom HTTP error class
│   └── catchAsync.ts       # Async route error wrapper
│
├── routes/
│   └── index.ts            # Top-level API router
│
└── types/
    └── express.d.ts        # Express Request augmentation (req.user)
```

---

## Setup

### 1. Install dependencies

```bash
cd backend-node
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env with your MongoDB URL and a strong JWT_SECRET_KEY
```

### 3. Run in development

```bash
npm run dev
```

### 4. Build for production

```bash
npm run build
npm start
```

The server starts on `http://localhost:8001` by default.

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `8001` | HTTP server port |
| `NODE_ENV` | `development` | Environment name |
| `MONGO_URL` | `mongodb://localhost:27017/` | MongoDB connection string |
| `MONGO_DB_NAME` | `khetise` | MongoDB database name |
| `JWT_SECRET_KEY` | *(must be set)* | JWT signing secret — **change in production** |

---

## API Reference

All routes are prefixed with `/api`.

### Auth

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register new user, returns `{user, access_token, token_type}` |
| POST | `/api/auth/login` | Public | Login, returns `{user, access_token, token_type}` |
| GET | `/api/auth/me` | Bearer | Current user info |
| PATCH | `/api/auth/profile` | Bearer | Update name / email / password |

### Products

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/products` | Public | List all products |
| GET | `/api/products/:id` | Public | Get product by ID |
| POST | `/api/products` | Admin | Create product |
| PATCH | `/api/products/:id` | Admin | Update stock only |
| PUT | `/api/products/:id` | Admin | Full product update |
| DELETE | `/api/products/:id` | Admin | Delete product |

### Subscriptions

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/subscriptions` | Bearer | List user's subscriptions |
| GET | `/api/subscriptions/:id` | Bearer | Get subscription |
| POST | `/api/subscriptions` | Bearer | Create subscription |
| PATCH | `/api/subscriptions/:id` | Bearer | Update (pause/resume/items) |
| DELETE | `/api/subscriptions/:id` | Bearer | Delete subscription |

### Orders

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/orders?user_stub_id=` | Public | List orders (optional filter) |
| GET | `/api/orders/:id` | Public | Get order |
| PATCH | `/api/orders/:id/status?status=` | Public | Update order status |

### Admin

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/admin/users?page=&page_size=` | Admin | Paginated user list |

### Scheduler

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/scheduler/run` | Public | Manually trigger order generation |

### Health

| Method | Path | Description |
|---|---|---|
| GET | `/api/health` | Returns `{status: "healthy", service: "KhetiSe API"}` |

---

## Scheduler Logic

The order-generation job runs **every hour** via cron (`0 * * * *`).

For each active subscription with `next_run_at <= now`:

1. **Idempotency check** — skip if order already exists for this `(subscription_id, scheduled_for)` pair.
2. **Inventory check** — verify each item's `stock_on_hand >= quantity`.
3. If inventory is **insufficient** → create a `blocked` order with `reason: "insufficient_inventory"` (no stock deducted).
4. If inventory is **sufficient** → create a `created` order and atomically decrement each product's `stock_on_hand`.
5. Advance `next_run_at` by 1 day (daily) or 7 days (weekly).

---

## Error Responses

All errors mirror the Python FastAPI `HTTPException` format:

```json
{ "detail": "Error message here" }
```

---

## Database Indexes

| Collection | Index | Unique |
|---|---|---|
| `products` | `sku` | Yes |
| `orders` | `(subscription_id, scheduled_for)` | Yes |
| `subscriptions` | `user_id` | No |
| `users` | `email` | Yes |

# GroFresh (React + FastAPI + MongoDB) — plan.md

## 1) Objectives
- Deliver an MVP farm-to-home subscription platform focused on **daily/weekly subscription scheduling**.
- Implement **recurring order generation** with **inventory checks**, and **pause/resume** subscriptions.
- Maintain **real-time inventory** updates driven by farm supply adjustments.
- Provide **basic admin inventory management** and product visibility.
- Add **JWT auth + roles (user/admin)** after core workflow is proven stable.

## 2) Implementation Steps (Phased)

### Phase 1 — Core Scheduling POC (isolation; no auth, minimal UI) ✅ COMPLETED
**Goal:** Prove the hardest workflow: subscription → schedule → recurring order generation → inventory guardrails.

**Status:** All POC tests passed! Core scheduling verified.

**Web search (best practices to confirm approach)**
- Research: FastAPI background tasks vs APScheduler vs Celery for recurring jobs; idempotency patterns for recurring order generation; MongoDB schema patterns for subscriptions/orders.

**POC scope (backend-first + tiny harness UI/CLI)**
- Data model (minimal): Product(sku, name, unit, price, stock_on_hand), Subscription(user_stub_id, items, frequency[daily/weekly], start_date, next_run_at, status), Order(subscription_id, scheduled_for, items, status).
- Implement **idempotent order generation** endpoint/job:
  - For each active subscription whose `next_run_at <= now`: attempt to create order for `scheduled_for=next_run_at`.
  - Enforce uniqueness: `(subscription_id, scheduled_for)` unique index.
  - Check inventory per item; if insufficient, create order with `status=blocked` (or `partial/failed`) and do not decrement stock.
  - If sufficient, decrement stock atomically and create order `status=created`.
  - Advance `next_run_at` by frequency.
- Implement pause/resume logic (status + next_run_at behavior).
- Provide a simple runner:
  - Option A: `POST /poc/run-scheduler?now=...` (manual trigger)
  - Option B: APScheduler interval job (but keep manual trigger for deterministic tests)

**POC test checklist (must pass before Phase 2)**
- Daily subscription generates 3 consecutive orders across simulated days.
- Weekly subscription generates correct weekly cadence.
- Duplicate runs do not create duplicate orders (idempotency).
- Inventory shortage blocks order and does not reduce stock.
- Pause stops generation; resume restarts correctly.

**User stories (Phase 1)**
1. As a tester, I want to trigger the scheduler manually so I can verify order generation deterministically.
2. As a user, I want a daily subscription to create an order each day automatically.
3. As a user, I want a weekly subscription to create an order on the correct weekly schedule.
4. As an operator, I want inventory to prevent orders when stock is insufficient.
5. As a user, I want pausing a subscription to stop new orders until I resume it.

**Exit criteria:** POC tests pass consistently; schema/indexes finalized.

---

### Phase 2 — V1 App Development (MVP UI + API; still no auth) ✅ COMPLETED
**Goal:** Wrap the proven core with an end-to-end usable app.
**Status:** All features implemented and tested. 100% test success rate!

**Backend (FastAPI)**
- Product APIs: list/view, admin stock update.
- Subscription APIs: create/list/detail, pause/resume, update items/frequency.
- Order APIs: list by user_stub_id, order detail, basic delivery status progression.
- Scheduler: keep APScheduler (or manual trigger) running in-app; retain manual trigger for debugging.
- Real-time inventory: reflect latest stock after admin updates + after successful order generation.

**Frontend (React + Tailwind)**
- Pages:
  - Products: browse products + availability.
  - Build Subscription: choose frequency (daily/weekly), pick items/quantities, confirm.
  - My Subscriptions: view next delivery date, pause/resume.
  - Orders: view upcoming/past orders + statuses (created/blocked/delivered).
  - Admin (unguarded for now): product list + stock adjust.
- UX states: loading/empty/error, blocked order explanation (out of stock), next_run_at visibility.

**Testing (end of Phase 2)**
- One full E2E pass: create products → create subscription → run scheduler → verify orders + stock changes → pause/resume.

**User stories (Phase 2)**
1. As a user, I want to subscribe to a set of products with daily delivery so I don’t reorder manually.
2. As a user, I want to see my next scheduled delivery date so I can plan ahead.
3. As a user, I want to see when an order is blocked due to stock so I understand what happened.
4. As an admin, I want to update stock levels so availability reflects farm supply changes.
5. As a user, I want to view my order history so I can track past deliveries.

**Exit criteria:** V1 flows work end-to-end; scheduler stable in-app.

---

### Phase 3 — Add Auth + Roles + Hardening
**Note:** Adding auth reduces testability; do only after Phase 2 is stable.

**Backend**
- JWT auth: signup/login, password hashing, refresh strategy (simple).
- Role-based access: admin-only inventory endpoints; user-specific subscriptions/orders.
- Replace user_stub_id with real user_id.
- Security: input validation, CORS, rate limiting basics (lightweight).

**Frontend**
- Auth pages, protected routes.
- Admin route gated by role.

**Testing (end of Phase 3)**
- E2E: user signup → create subscription → scheduler generates orders → admin updates stock → verify user views.

**User stories (Phase 3)**
1. As a user, I want to sign up and log in so my subscriptions are saved securely.
2. As a user, I want to see only my subscriptions and orders so my data is private.
3. As an admin, I want only admins to access inventory management so stock can’t be tampered with.
4. As a user, I want to stay logged in across refresh so I don’t re-authenticate often.
5. As an admin, I want to manage products without affecting user access controls.

**Exit criteria:** Auth enforced, role checks correct, no regression in scheduling.

---

### Phase 4 — Stabilization + Production Readiness (no payments yet)
- Observability: structured logs, basic metrics, error tracking hooks.
- Data integrity: stronger indexes, migrations/seed scripts.
- Delivery tracking refinement: statuses + timestamps.
- Performance: pagination for lists; efficient queries.
- Optional: email/SMS notifications (only if requested later).

**User stories (Phase 4)**
1. As a user, I want fast loading product and order lists so the app feels reliable.
2. As a user, I want clearer delivery status updates so I know what to expect.
3. As an admin, I want safe stock updates with validation so I avoid mistakes.
4. As an operator, I want logs that explain why an order was blocked so I can resolve issues.
5. As a user, I want consistent behavior even if the scheduler runs twice so I never get duplicate orders.

## 3) Next Actions (immediate)
1. Run web search and choose scheduler approach (APScheduler + manual trigger; confirm best practice).
2. Implement Phase 1 POC backend models + unique index + generator logic.
3. Create POC runner endpoint and scripted test scenario.
4. Verify all POC checklist items; iterate until stable.

## 4) Success Criteria
- POC: deterministic recurring order generation with idempotency and inventory protection.
- V1: end-to-end subscription creation → automatic order creation → inventory updates visible in UI.
- No duplicate orders across repeated scheduler runs.
- Pause/resume works and is reflected in next delivery date.
- Admin can adjust stock and it immediately affects new order generation.
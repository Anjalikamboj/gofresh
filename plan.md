# GroFresh (React + FastAPI + MongoDB) — plan.md

## 1) Objectives
- Deliver a scalable farm-to-home **fresh subscription** platform focused on **daily/weekly scheduling**.
- Ensure **recurring order generation** with **inventory checks**, idempotency, and pause/resume.
- Provide **real-time inventory visibility** across user browsing and admin management.
- Provide **secure JWT authentication** with **roles (user/admin)**.
- Deliver a production-grade **Admin Dashboard** with a **sidebar layout** supporting multiple admin pages:
  - Dashboard overview (KPIs)
  - Products / Inventory management
  - Orders (admin view)
  - Subscriptions (admin view — upcoming)
  - **All Users** (admin view) with **pagination**
- Keep payments explicitly **out of scope for now**.

## 2) Implementation Steps (Phased)

### Phase 1 — Core Scheduling POC (isolation; no auth, minimal UI) ✅ COMPLETED
**Goal:** Prove the hardest workflow: subscription → schedule → recurring order generation → inventory guardrails.

**Status:** Completed. APScheduler-based recurring order generation validated with deterministic tests.

**Key outcomes**
- Idempotent order generation behavior validated.
- Inventory shortage handling validated (blocked orders; no stock decrement).

**Exit criteria:** Met.

---

### Phase 2 — V1 App Development (MVP UI + API; still no auth) ✅ COMPLETED
**Goal:** Wrap the proven core with an end-to-end usable app.

**Status:** Completed. Product browsing + subscription creation + orders UI + initial admin inventory UI working.

**Exit criteria:** Met.

---

### Phase 3 — Auth + Roles + Core Hardening ✅ COMPLETED
**Goal:** Add JWT authentication, role gating, and ensure user-specific data access.

**Status:** Completed.

**Backend**
- JWT auth implemented: `/api/auth/register`, `/api/auth/login`, `/api/auth/me`.
- Role checks working with admin-only dependency.

**Frontend**
- Login/Register pages built.
- Protected routes added.
- Profile page supports user updates (email read-only).
- Profile dropdown includes My Subscriptions and Orders.

**Exit criteria:** Met.

---

### Phase 4 — Admin Dashboard Refactor (Sidebar + Multi-page Admin) ✅ COMPLETED (P0)
**Goal:** Replace the old single-page admin view with a sidebar-driven admin console with nested routes.

**Status:** Completed and verified via screenshot testing.

**Delivered**
- **Admin layout + nested routing** mounted under `/admin/*` using `AdminLayout` + `<Outlet />`.
- Sidebar navigation implemented and tested:
  - `/admin` → `AdminDashboard`
  - `/admin/products` → `AdminProductsPage`
  - `/admin/orders` → `AdminOrdersPage`
  - `/admin/users` → `AdminUsersPage`
- Legacy monolithic `AdminPage` functionality extracted into **`AdminProductsPage`**.
- **Paginated users API (Admin-only)** implemented:
  - `GET /api/admin/users?page=1&page_size=10`
  - Returns `{ items, page, page_size, total, total_pages }`
  - `hashed_password` is never returned due to `serialize_doc` filtering.
- **AdminUsersPage** implemented with pagination controls (currently showing 3 users, page 1 of 1).
- Sidebar **collapse/expand** toggle implemented and tested.

**Exit criteria:** Met.

---

### Phase 5 — Admin: Subscriptions View + Global Admin Data (P1) ⏳ UPCOMING
**Goal:** Complete the admin console with subscriptions visibility and proper admin-wide data access patterns.

**Work items**
1. Implement `/admin/subscriptions` page:
   - Table listing subscriptions across all users
   - Include: user id/email (if available), product(s), quantity, frequency, status, next_delivery_date
2. Backend considerations:
   - If current `/api/subscriptions` is user-scoped, add an admin-only endpoint (recommended):
     - `GET /api/admin/subscriptions` (optionally paginated)
   - Consider adding filters: status, frequency, next_delivery_date range

**Exit criteria**
- Admin can navigate to `/admin/subscriptions` and view global subscription data.

---

### Phase 6 — Stabilization + Production Readiness (no payments yet) ⏳ UPCOMING
- Performance:
  - Add pagination to other list endpoints (orders/subscriptions/products) as needed.
  - Consider server-side filtering and sorting for admin tables.
- Observability:
  - Structured logs around scheduler job runs and blocked order reasons.
- UI/UX polish:
  - Add toasts (sonner) for admin actions (stock updates, create product success/failure).
  - Improve admin tables: search, sort, inline edit loading states.

## 3) Next Actions (immediate)
1. **Admin Subscriptions**:
   - Add backend admin subscriptions endpoint if needed.
   - Implement `/admin/subscriptions` UI and wire it into the sidebar.
2. **Admin Orders hardening**:
   - If `/api/orders` is user-scoped, add `GET /api/admin/orders` and update admin UI to use it.
3. **Admin UX improvements**:
   - Add sonner toasts for create product and stock update.
   - Add lightweight search/filter on admin products/users.

## 4) Success Criteria
- Admin sidebar layout is visible and reachable at `/admin`.
- Admin navigation supports multi-page routing with `<Outlet />`.
- Legacy `AdminPage.js` is no longer the single admin experience.
- Admin can view:
  - Products/inventory management ✅
  - Orders view ✅
  - Subscriptions view ⏳ (next)
  - **All Users** view with **pagination** ✅
- All admin endpoints are protected by role checks and do not leak sensitive fields.
- No regression in authentication, product browsing, subscriptions, or order generation.

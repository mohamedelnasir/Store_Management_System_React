# Store Management System — Frontend

A React (Vite) single-page app for the Store Management System REST API. Role-aware
UI for Admins, Managers, and Cashiers covering catalog, inventory, POS, expenses,
employees, payroll, dashboard, and reports.

## Getting started

```bash
npm install
cp .env.example .env      # point VITE_API_BASE_URL at your backend
npm run dev
```

Open http://localhost:5173.

## Design direction

The visual language treats the app like a well-run paper ledger: a cool paper-white
background, deep register-green for primary actions, and a signature detail —
every quantitative figure (prices, quantities, SKUs, dates) renders in tabular
monospace, so tables read like ledger entries rather than generic dashboard cards.
The dashboard's summary-card row carries a subtle torn-receipt edge as the one
deliberate flourish; everything else stays quiet and structured. Tokens live in
`tailwind.config.js`; the shared `.figure` utility class in `src/index.css` applies
the monospace treatment.

## Project structure

```
src/
├── api/            # axios instance (client.js) + one file per resource
├── components/     # Button, Table, Modal, FormField, StatusBadge, Sidebar, etc.
├── context/         # AuthContext — current user, token, role
├── hooks/           # useAuth, useFetch, useDebounce
├── pages/           # one folder per module, matching the SRS's section 6
├── routes/          # ProtectedRoute (auth) and RoleRoute (role-gating)
├── utils/           # constants.js (enum <-> label maps), formatters.js, navItems.jsx
└── App.jsx          # route table
```

## Auth & role gating

- `AuthContext` stores the JWT + user in memory and mirrors them to `localStorage`
  so a refresh doesn't log the user out. Login response is expected as
  `{ token, user: { id, name, email, role } }` where `role` is the backend's
  integer enum (`0` Admin, `1` Manager, `2` Cashier).
- `ProtectedRoute` sends unauthenticated visitors to `/login`.
- `RoleRoute` sends authenticated-but-unauthorized visitors to `/not-authorized`.
  **This is UX only** — the real enforcement is the backend's `[Authorize]`
  attributes, per the SRS's security notes.
- The sidebar (`utils/navItems.jsx`) filters links by role from the same list
  RoleRoute uses, so nav and routing can't drift apart.
- There's no public self-registration screen. Per the SRS's security note, new
  accounts are created via the Admin-only Users page instead, so the role
  selector is never exposed to a self-signup flow.

## API integration

`src/api/client.js` is the single Axios instance:
- attaches `Authorization: Bearer <token>` to every request,
- on `401`, clears storage and redirects to `/login`,
- on any other error, toasts `error.response.data.message` (falls back to
  `title`, then a generic message) — this is the "centralized error handling"
  from the SRS's non-functional requirements.

Each resource file (`productsApi.js`, `salesApi.js`, …) is a thin wrapper
returning `response.data`, matching the endpoint list in the SRS section 8.
**Adjust the expected request/response shapes to match your actual backend DTOs**
— they're written from the SRS description and will need small tweaks once
you point this at the real API (e.g. exact field names on `/api/dashboard`,
sale item shape, payroll fields).

## What's stubbed vs. what's real

Everything is wired end-to-end (forms validate, tables call the real endpoints,
loading/empty states work), but this was built without access to the live
backend, so:
- Response shapes are my best inference from the SRS — check them against your
  actual DTOs, especially `dashboardApi.summary()` and the reports endpoints.
- CSV/PDF export on the Reports page is a placeholder button (marked "Optional"
  in the SRS) — wire it to a real export endpoint or client-side CSV generation
  once the report shape is confirmed.
- Client-side validation (Zod) mirrors the SRS's stated rules (sell price > buy
  price, quantities ≥ 0, etc.); server-side validation errors still surface via
  the toast interceptor.

## Tech stack

React Router, Axios, React Hook Form + Zod, Tailwind CSS, Recharts, react-hot-toast,
Lucide icons — as specified in the SRS section 4.

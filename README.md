# Quick Basket presentation prototype

## Run locally

```powershell
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The development command starts the React/Vite site and the trusted Node API. Orders and staff data are stored in the ignored `data/quick-basket.sqlite` database. The local demo supports PIN `560038` for the seeded Bengaluru shops.

The development app uses the Node/SQLite API by default. It calculates order prices, delivery fees, stock changes, fulfilment timing, and pickup deadlines on the server. Orders use idempotency keys, persist status history, and publish role-scoped updates over server-sent events.

## Presentation accounts

The current local demo database has these roles provisioned:

- Admin: `arvindbagri2006@gmail.com`
- Shop owner: `vishesh123`
- Delivery partner: `namit123`

Demo passwords were set in the local database using salted hashes. Do not add passwords to this file, source control, or the browser. Change the temporary presentation passwords before any public deployment.

To intentionally reset these local demo credentials, set `QB_PRESENTATION_ADMIN_PASSWORD`, `QB_PRESENTATION_SHOP_PASSWORD`, and `QB_PRESENTATION_DELIVERY_PASSWORD` in the current PowerShell session, then run:

```powershell
npm run provision:presentation
```

The script updates only those three existing demo identities, clears their sessions, and preserves shop, order, and history records. It does not create or reset accounts on Firebase.

For a fresh local database, configure the backend `QB_ADMIN_EMAIL`, `QB_ADMIN_PASSWORD`, `QB_VISHESH_PASSWORD`, and `QB_NAMIT_PASSWORD` variables before `npm run dev`. The optional fulfilment settings and their defaults are listed in `.env.example`. These are server environment values; do not prefix backend credentials with `VITE_`.

## Hosting note

Firebase Hosting serves static files; it does not run `server.js`. The expanded checkout and panel workflows require this Node API to be deployed to a Node-capable host and `/api/*` routed to it. Configure `VITE_API_MODE=server` for a production frontend only when a same-origin API route is available. Firebase client configuration alone does not deploy this backend or its SQLite database. Avoid deploying the demo accounts or their temporary passwords to a public site.

No payment provider is connected. A successful order is a demo order and is not marked paid.

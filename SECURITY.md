# Quick Basket security boundary

## Services and data paths

- The hosted client is configured for Firebase Authentication and Cloud Firestore.
- The app does not use Realtime Database or Firebase Cloud Functions.
- Firebase Storage is not used by the client. `storage.rules` denies all access until image paths and upload validation are implemented.
- The local development app uses `server.js` with SQLite. This API authenticates from server-side scrypt password hashes and HttpOnly cookies, checks roles on every staff route, calculates order prices from its catalog/inventory, reserves stock transactionally, enforces idempotency, and validates order-state transitions.
- Firebase Hosting serves static files only. It does not run `server.js` or provide the trusted backend needed by Firebase-only order creation and staff account provisioning.

## Firebase client restrictions

Firestore defaults to deny for unknown collections. Customer self-registration can create only a customer profile; users cannot change their own role or active state. Customer order reads are limited to their own documents, shop owners to their own active shop, and delivery partners to explicitly assigned orders. Status transitions and admin delivery assignment have field and role checks. Client order creation is denied because the browser cannot authoritatively validate prices, totals, or inventory. Staff account provisioning is disabled in the Firebase-only adapter until a trusted backend exists.

These restrictions are not a complete production backend: Cloud Functions are not configured, and Firebase Emulator rule tests have not been run in this workspace. Do not re-enable direct client order creation or client staff provisioning to work around the restrictions.

## Secrets and environment

- `.env.local` and `.env` are excluded by `.gitignore`; `.env.example` contains placeholders only.
- Firebase web configuration and restricted browser Maps keys are public client configuration, not service-account credentials. Restrict API keys by site origin and API.
- Never put service-account JSON, Admin SDK credentials, private keys, or passwords in `VITE_*` variables or the browser bundle. Use the host's secret manager / Application Default Credentials for a future trusted backend.
- No Firebase Admin SDK credential file is present in the project workspace.

## Required setup for live secure orders and staff provisioning

Choose one trusted backend before enabling those features on the hosted site:

1. Deploy a server-side Firebase Cloud Function that verifies Firebase ID tokens and role profiles, provisions Auth users with the Admin SDK, validates the server-owned product catalog and shop inventory in a Firestore transaction, and applies allowed order transitions; or
2. Deploy `server.js` to a Node-capable host with persistent encrypted SQLite storage, configure `QB_ALLOWED_ORIGIN`, and route the frontend `/api/*` requests to that host.

Firebase Hosting alone cannot run this Node API. Cloud Functions/Cloud Run may require the Firebase/Google Cloud billing plan; check the project's current plan and pricing before enabling them. Do not expose Admin SDK credentials in the frontend.

## Validation

The current `package.json` has no test script or Firebase Rules Unit Testing dependency. `npm run build` is available. Firebase Emulator rule tests require a Java runtime, which is not installed in this workspace; therefore the Firestore and Storage rules have not been emulator-validated or deployed.

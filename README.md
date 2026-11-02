# Cait Restaurant

A React and Vite restaurant website with a PostgreSQL-backed menu, an Express API, and email/password signup, login, and persistent sessions.

## Requirements

- Node.js 20.19+ (or 22.12+) and npm
- A PostgreSQL database (for example, a free Neon project)

## Local development

1. Create a PostgreSQL database and copy its connection URL.
2. Create `server/.env` from `server/.env.example`. Set `DATABASE_URL` and a private `SESSION_SECRET` of at least 32 characters. For example, generate one with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
3. Keep the `.env` files local; they are ignored by Git.
4. Install and seed the server:

   ```sh
   cd server
   npm install
   npm run seed
   ```

   The seed script creates the schema and loads the menu from `src/data/foodmenu.json`. It can be run again safely.
5. In another terminal, start the API and frontend:

   ```sh
   cd server
   npm run dev
   ```

   ```sh
   npm install
   npm run dev
   ```

   The Vite development server proxies `/api` to `http://localhost:5000`. The API creates any missing tables at startup. The menu is available at `GET /api/menu`; authentication is provided by `/api/auth/signup`, `/api/auth/login`, `/api/auth/session`, and `/api/auth/logout`.

The root `.env.example` documents `VITE_API_URL`. Leave it blank for the local Vite proxy. Set it to the API base URL only when the production frontend can send credentials to that API (see deployment notes).

## Deployment

The repository is arranged for separate frontend and backend deployments. The cloud accounts, database, and service URLs must be created by the project owner; no deployment credentials or hosted database URL are stored in this repository.

### PostgreSQL

Create a free PostgreSQL database with a provider such as Neon. Use its pooled connection URL as `DATABASE_URL` for the backend and run `npm run seed` from `server` with that variable set. Keep the provider's SSL parameters in the URL.

### Backend (Railway or similar)

- Deploy the `server` directory as a Node service.
- Build/install command: `npm install`; start command: `npm start`.
- Set `DATABASE_URL`, `SESSION_SECRET` (generate a unique random value), `CLIENT_ORIGIN` (the exact public frontend origin), and `NODE_ENV=production`.
- After the first deployment, run `npm run seed` once against the production database.

### Frontend (Vercel or similar)

- Deploy the repository root as a Vite project.
- Build command: `npm run build`; output directory: `dist`.
- Set `VITE_API_URL` to the backend base URL, then redeploy whenever it changes.

For browser sessions, serve the frontend and API on the same site when possible (for example, use a custom domain and a reverse proxy). If they use different sites, the browser may block the API's cross-site session cookie even with credentials enabled. Configure the backend's `CLIENT_ORIGIN` to the frontend origin and verify cookie behavior in the target browsers before considering deployment complete.

## API and data

- `GET /api/menu` returns menu categories and items from PostgreSQL as JSON.
- Signup stores a bcrypt password hash and starts a database-backed session.
- Login, current-session lookup, and logout use an HTTP-only session cookie stored in PostgreSQL.
- The menu tables and user/session tables are defined in `server/src/schema.sql`.

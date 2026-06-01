# TripMate Server

Node + Express + Prisma + PostgreSQL backend that fulfills the endpoint
contracts already used by the Expo frontend (`services/*.ts`).

## Endpoints

```
POST   /auth/signup                { email, password, nickname }
POST   /auth/login                 { email, password }
GET    /auth/me                    (bearer)

POST   /match/find                 (bearer) filter body
GET    /match/recommended          (bearer)

GET    /users/:id
POST   /users/:id/like             (bearer)

GET    /chat/rooms                 (bearer)
GET    /chat/rooms/:id             (bearer)
POST   /chat/rooms                 (bearer) { userId }
GET    /chat/rooms/:id/messages    (bearer)
POST   /chat/rooms/:id/messages    (bearer) text or trip_share
POST   /chat/rooms/:id/accept      (bearer)
POST   /chat/rooms/:id/reject      (bearer)

GET    /community/posts            (?category=&city=)
GET    /community/posts/:id
POST   /community/posts            (bearer) create
POST   /community/posts/:id/like   (bearer) toggle
```

## Local development

1. Install Postgres (Docker is simplest):
   ```bash
   docker run -d --name tripmate-pg \
     -e POSTGRES_PASSWORD=postgres \
     -e POSTGRES_DB=tripmate \
     -p 5432:5432 postgres:16-alpine
   ```
2. Copy env: `cp .env.example .env`
3. Install deps: `npm install`
4. Generate client + migrate: `npm run db:migrate`
5. Seed demo data: `npm run db:seed`
6. Run: `npm run dev` → http://localhost:4000

Then point the Expo app at it:
```bash
# from tripmate/ root
EXPO_PUBLIC_API_URL=http://localhost:4000 npm run web
# or on a phone, replace localhost with your LAN IP
```

Seed login: `alice@tripmate.app` / `password`

## Railway deploy

1. New project → Add **PostgreSQL** plugin (copies `DATABASE_URL` into env).
2. Add service → "Deploy from GitHub" → pick this repo → set **Root Directory** to `server`.
3. Variables: add `JWT_SECRET` (long random string).
4. Build command: `npm install && npx prisma migrate deploy && npm run build`
   Start command: `npm start`
5. Once deployed, copy the public URL and set in Expo:
   ```
   EXPO_PUBLIC_API_URL=https://<your-railway-domain>
   ```
   Rebuild the Expo web export to bake it in:
   ```
   EXPO_PUBLIC_API_URL=https://<your-railway-domain> npm run build:web
   ```

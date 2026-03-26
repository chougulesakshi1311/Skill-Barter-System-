# Skill Barter System (MERN)

A full-stack MERN platform where users exchange skills without monetary transactions.

## Features

- JWT auth, bcrypt password hashing, forgot/reset password via NodeMailer
- Role-based access (`user`, `admin`)
- User profiles with editable bio, avatar URL, skills offered/wanted, and availability slots
- Skill matching engine:
  - 1-to-1 weighted matching with exact/partial tag similarity and level weighting
  - Multi-user chain barter loop suggestions
- Barter request lifecycle: pending, accepted, rejected, canceled, completed
- Real-time chat and notifications using Socket.IO
- Review and rating system after completed barter
- Search/filter APIs for skill, location, experience level, top-rated, recently active
- User and admin dashboards
- Admin panel for user management and activity monitoring
- Recommendation endpoint (rule-based)
- Bookmark/favorite users
- PWA foundation (manifest + service worker)
- Lazy-loaded React routes, centralized error handling, validation, and rate limiting

## Folder Structure

- `server/` Express + MongoDB API (MVC)
- `client/` React + Vite frontend

## Setup

### 1. Install dependencies

```bash
cd server && npm install
cd ../client && npm install
```

### 2. Configure environment

```bash
cd server
copy .env.example .env
# edit values

cd ../client
copy .env.example .env
```

### 3. Run development servers

```bash
npm run dev
```

Or run separately:

```bash
cd server
npm run dev
```

In another terminal:

```bash
cd client
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000/api

Environment notes:

- Backend reads `server/.env`.
- Frontend supports both `VITE_API_URL` and `REACT_APP_API_URL` (for compatibility), and auto-appends `/api` when needed.

## Core REST API

- `/api/auth`
- `/api/users`
- `/api/skills`
- `/api/match`
- `/api/barter`
- `/api/messages`
- `/api/reviews`
- `/api/notifications`
- `/api/dashboard`
- `/api/admin`

## Security and Optimization

- `helmet`, `cors`, `express-rate-limit`
- `express-validator` request validation
- JWT-protected routes and role authorization
- Centralized not found/error middleware
- React route lazy loading

## Notes

- For email reset flow, configure SMTP variables in `server/.env`.
- Chat is enabled for accepted barter requests only.
- File sharing is represented by `fileUrl` field and can be expanded with file upload middleware.
- For production, add Redis cache for match results and CI/CD pipeline (GitHub Actions + Docker).

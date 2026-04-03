# next-gin

Next.js 16 frontend for a Go Gin backend. Features email/password auth, Google OAuth, a user dashboard, and an admin panel. All API calls are proxied server-side through a Next.js route handler so credentials never leave the server.

## Tech Stack

- **Next.js 16** — App Router, TypeScript, standalone output
- **React 19** with Zustand for state management
- **Tailwind CSS v4**
- **Google OAuth** via `@react-oauth/google`
- **Bun** — package manager and production runtime
- **Vitest** + React Testing Library — unit/integration tests
- **Husky** + lint-staged — pre-commit hooks

## Features

- Email/password login and registration
- Google OAuth sign-in
- Protected dashboard with Todos
- Admin panel — user list and role/permission management (requires `super_admin` role)
- Middleware-based route protection (`proxy.ts` / `middleware.ts`)
- API proxy at `app/api/[...path]/route.ts` — forwards all requests to the backend, forwarding cookies

## Environment Variables

Create a `.env` file in the project root:

```env
# Backend API base URL (server-side only)
API_URL=http://localhost:8080

# Google OAuth client ID (exposed to the browser)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

## Prerequisites

- [Bun](https://bun.sh/) 1.2+

## Install

```bash
bun install
```

## Development

```bash
bun run dev
```

Open http://localhost:3000.

## Build & Start

```bash
bun run build
bun run start
```

## Tests

```bash
bun run test
```

## Lint

```bash
bun run lint
```

## Docker

Build and run with Docker Compose (reads `.env` automatically):

```bash
docker compose up --build
```

The container runs on port **3000**. The multi-stage `Dockerfile` produces a minimal standalone image using `bun run build` → `bun server.js`.

## Project Layout

```
app/
  (locale)/
    admin/          — Admin panel (users & access control)
    dashboard/      — Authenticated user dashboard (todos)
    login/          — Login page
    register/       — Registration page
  api/[...path]/    — API proxy route handler
  components/       — Shared UI components (NavBar, GoogleLoginButton)
  hooks/            — React hooks (useAuth, useTodosStore, useUsersStore)
  lib/              — API helpers (api.ts, auth.ts, adminApi.ts)
  models/           — TypeScript types (User)
  providers/        — Context providers (GoogleProvider)
proxy.ts            — Next.js middleware for route protection
```

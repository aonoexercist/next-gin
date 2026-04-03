# --- STAGE 1: Install dependencies ---
FROM oven/bun:1.2-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# --- STAGE 2: Build the app ---
FROM oven/bun:1.2-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables for build time
ARG API_URL
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID

ENV API_URL=$API_URL
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=$NEXT_PUBLIC_GOOGLE_CLIENT_ID

ENV NEXT_TELEMETRY_DISABLED=1
# This creates the .next/standalone folder
RUN bun run build

# --- STAGE 3: Production Runner ---
FROM oven/bun:1.2-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Standalone mode only needs these 3 specific parts
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

# IMPORTANT: Run 'server.js', NOT 'next start'
CMD ["bun", "server.js"]
# SHONGJOG — Deployment & Production Operations Guide (V4)
**Target Platform:** Node.js 20+ / Vercel / Google Cloud Run / Docker  
**Status:** Verified Production Ready

---

## 1. Quick Start (Local Production Run)

```bash
# 1. Clone repository
git clone <repo-url> shongjog
cd shongjog

# 2. Install dependencies
npm install

# 3. Initialize and seed database
npx prisma db push
npm run build

# 4. Start production server
npm run start
# Server listens on http://localhost:3000
```

---

## 2. Environment Variables Configuration

Copy `.env.example` or set the following variables:

```bash
# Database Connection (SQLite default for local/edge; PostgreSQL for enterprise cloud)
DATABASE_URL="file:./prisma/dev.db"

# Google Maps Platform (Optional - Enables dynamic JS API with custom markers)
# If omitted, platform gracefully defaults to authentic WGS84 Google Maps Embeds
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=""
NEXT_PUBLIC_GOOGLE_MAP_ID=""

# Operational Telemetry Mode
NEXT_PUBLIC_SIMULATION_MODE="true"
NEXT_PUBLIC_DEFAULT_REGION="Dacope, Khulna"
```

---

## 3. Running Verification Test Suites

```bash
# 1. Static TypeScript Compilation (0 errors)
npx tsc --noEmit

# 2. Vitest Unit & Integration Suites (18 tests)
npx vitest run

# 3. Playwright Multi-Viewport E2E Tests (20 tests)
npx playwright test
```

---

## 4. Production Cloud Deployment (Docker)

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000
CMD ["npm", "run", "start"]
```


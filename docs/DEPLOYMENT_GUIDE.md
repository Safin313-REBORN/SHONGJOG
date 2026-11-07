# SHONGJOG (সংযোগ) — Production Deployment & Operations Guide (V4.2.1)
**Target Platform:** Next.js 16.4.5 (App Router) on Vercel Serverless / Node.js 22.x LTS  
**Database Provider:** Neon Serverless PostgreSQL (`provider = "postgresql"`)  
**Production URL:** [https://shongjog-eight.vercel.app](https://shongjog-eight.vercel.app)  
**Status:** Verified Production Ready (100% Green Gates)

---

## 1. Production Architecture Overview

SHONGJOG is architected for extreme high-availability and zero serverless data loss during flood and disaster response operations:

```mermaid
flowchart TD
    Client["Citizen / Coordinator / Responder Browser"] -->|HTTPS / HTTP2| CDN["Vercel Global Edge Network"]
    CDN --> NextApp["Next.js 16 App Router Serverless Functions (Node.js 22.x)"]
    NextApp -->|Prisma ORM 6.4.1| NeonPooler["Neon Serverless PostgreSQL (pgbouncer connection pooling)"]
    NeonPooler --> NeonDB["Neon PostgreSQL Database (neon-blue-garden)"]
    NextApp -.->|Optional AI Extraction| AdaptionAPI["Adaption Labs API / Gemini API"]
    NextApp -.->|WGS84 Navigation| GoogleMaps["Google Maps Platform API & Embedded Navigation"]
```

- **Frontend & API Gateway:** Vercel Serverless Edge runtime running Node.js 22.x LTS.
- **Relational Storage:** Neon Serverless PostgreSQL (`neon-blue-garden`) providing scalable, ACID-compliant transactional consistency across distributed coordinator and responder sessions.
- **Transactional Integrity:** Quoted PostgreSQL identifiers (`"Resource"`, `"reservedCapacity"`, `"isActive" = true`) with WAN-resilient interactive transaction timeouts (`maxWait: 15000, timeout: 30000`).
- **Zero Data Loss Guarantee:** Persistent serverless database prevents local file vaporization inherent in traditional SQLite edge deployments.

---

## 2. Prerequisites & Environment Setup

### Required Runtimes & Tooling
- **Node.js:** `v22.x` (LTS recommended) or `v20.x+`
- **Package Manager:** `npm v10.x+`
- **Vercel CLI:** `vercel@latest` (`npm install -g vercel@latest`)
- **Git:** Git 2.30+

### Dependency Installation
Due to peer dependency trees between Vitest and Node types in modern stacks, install with `--legacy-peer-deps` or ensure `.npmrc` is present:

```bash
# Clone the repository
git clone https://github.com/Safin313-REBORN/SHONGJOG-PLATFORM-OPERATIONAL-DIRECTIVE-FOR-ANTIGRAVITY.git shongjog
cd shongjog

# Install dependencies cleanly
npm install --legacy-peer-deps
```

---

## 3. Database Setup & Migration Procedure

The project uses Prisma ORM 6.4.1 with PostgreSQL.

### Connecting Neon PostgreSQL
Obtain your Neon connection string from the Neon Console or via the Vercel Marketplace Storage integration:
```bash
DATABASE_URL="postgresql://neondb_owner:YOUR_PASSWORD@ep-example-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require"
```

### Safest Migration-Management Approach (Zero Data Loss)
In serverless PostgreSQL architectures with connection poolers (e.g., Neon pgbouncer), **`npx prisma db push`** is the safest and recommended schema synchronization method:

1. **Why `db push` is preferred over `migrate dev`:**
   - Serverless poolers do not provide dedicated shadow databases required by `prisma migrate dev`.
   - Running `prisma migrate dev` on a database with existing tables may trigger destructive database reset prompts (`All data will be lost. Reset database? [y/N]`).
   - `prisma db push` synchronizes `prisma/schema.prisma` directly with Neon, detects schema diffs, applies table modifications safely, and preserves all existing rows and indexes.

2. **Executing Schema Push & Client Generation:**
   ```bash
   # 1. Generate Prisma Client
   npx prisma generate

   # 2. Synchronize schema with Neon PostgreSQL
   npx prisma db push

   # 3. Seed baseline Dacope simulation scenario (Resources, Requests, Active Alerts)
   npx tsx src/lib/seed/seed.ts
   ```

3. **Strict Safety Rules for Operators:**
   > [!CAUTION]
   > **NEVER run `npx prisma migrate reset` or approve interactive reset prompts on staging or production Neon PostgreSQL.** This will erase all registered shelters, vehicles, and active emergency assistance records.

4. **Optional SQL Migration Baseline (For Enterprise GitOps):**
   If a team requires committed SQL migration history files without resetting the live database:
   ```bash
   mkdir -p prisma/migrations/0_init
   npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > prisma/migrations/0_init/migration.sql
   npx prisma migrate resolve --applied 0_init
   ```
   This records the baseline as applied without altering live database structures.

---

## 4. Environment Variables Specification & Priority

Environment variables configure database connectivity, AI services, and mapping integrations.

### Variable Reference Table

| Variable Name | Required | Default / Fallback | Description |
| :--- | :---: | :--- | :--- |
| `DATABASE_URL` | **Yes** | — | Pooled Neon PostgreSQL connection string (`postgresql://...sslmode=require`). |
| `POSTGRES_PRISMA_URL` | Optional | — | Vercel Neon marketplace pooled connection string with pgbouncer. |
| `POSTGRES_URL_NON_POOLING` | Optional | — | Direct unpooled Neon connection string for direct migration scripts. |
| `ADAPTION_API_KEY` | Optional | Empty (`""`) | Adaption Labs API key for natural language emergency needs understanding. |
| `ADAPTION_API_URL` | Optional | `https://api.adaptionlabs.ai/v1` | Adaption Labs API endpoint. |
| `GEMINI_API_KEY` | Optional | Empty (`""`) | Google Gemini API key for multimodal and complex reasoning fallback. |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Optional | Empty (`""`) | Google Maps JavaScript API key for dynamic interactive vector maps. |
| `NEXT_PUBLIC_GOOGLE_MAP_ID` | Optional | Empty (`""`) | Google Maps Map ID for vector styled maps. |
| `NEXT_PUBLIC_SIMULATION_MODE` | Optional | `"true"` | Enables simulated coastal surge signals and demonstration controls. |
| `NEXT_PUBLIC_DEFAULT_REGION` | Optional | `"Dacope, Khulna"` | Default geographic operations center focus. |
| `NODE_ENV` | Optional | `"production"` | Runtime environment (`development`, `test`, `production`). |

### Environment Variable Override Order
Next.js and Vercel enforce strict override precedence:
1. **System / Vercel Production Environment Variables (HIGHEST PRIORITY):** Injected by Vercel at runtime; strictly overrides all `.env` files.
2. `.env.production.local` / `.env.local`: Local workstation secret overrides.
3. `.env.production` / `.env.development`: Environment-specific committed profiles.
4. `.env`: Project baseline defaults (LOWEST PRIORITY).

---

## 5. Vercel Production Deployment Workflow

Deploying SHONGJOG to Vercel is executed via the Vercel CLI.

### Step 1: Vercel Authentication & Project Linking
```bash
# Authenticate CLI with browser approval
vercel login

# Verify identity
vercel whoami

# Link local directory to existing Vercel project
vercel link
```

### Step 2: Configure Project Settings on Vercel
In the Vercel Project Dashboard (or via `vercel project`):
- **Framework Preset:** `Next.js`
- **Node.js Version:** `22.x`
- **Root Directory:** `./`
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install --legacy-peer-deps`

### Step 3: Configure Production Secrets
Ensure `DATABASE_URL` is configured in **Vercel Settings → Environment Variables** for `Production`, `Preview`, and `Development`.

### Step 4: Run Pre-Deployment Verification
Before deploying, execute all local verification gates:
```bash
# 1. Static Type Check (0 errors required)
npx tsc --noEmit

# 2. Linting (0 errors required)
npm run lint

# 3. Vitest Unit & Integration Suites (28/28 tests passed)
npx vitest run

# 4. Local Turbopack Production Build
npm run build
```

### Step 5: Deploy Preview & Verify
```bash
# Deploy preview deployment
vercel

# Smoke test the preview URL
vercel curl https://<preview-domain>/api/health
```

### Step 6: Deploy Production Release
```bash
# Promote to live production alias
vercel --prod --yes
```

The production platform will immediately be live at:
**[https://shongjog-eight.vercel.app](https://shongjog-eight.vercel.app)**

---

## 6. Verification Test Suites & Pass Criteria

SHONGJOG enforces a strict multi-tier quality gate:

```bash
# 1. Static TypeScript Check (0 errors)
npx tsc --noEmit

# 2. Vitest Unit & Integration Test Suites (28 tests across 4 suites)
npx vitest run
# Suites:
# - ai_and_matching.test.ts (12 tests: multilingual, parsing, hard constraints)
# - concurrency_and_dispatch.test.ts (6 tests: atomic transactions, race conditions)
# - requests_api.test.ts (4 tests: citizen intake, schema validation)
# - i18n_localization.test.ts (6 tests: English & Bengali dictionary parity)

# 3. Playwright Multi-Viewport E2E Tests (40 test runs across 4 device profiles)
npx playwright test
# Viewports:
# - Desktop Chrome (1440x900)
# - Tablet iPad (1024x768)
# - Mobile iPhone 14 (390x844)
# - Mobile Compact Android (360x780)

# 4. Live API Route Smoke Test
curl -s -i "https://shongjog-eight.vercel.app/api/health" | grep "HTTP/2 200"
curl -s -i "https://shongjog-eight.vercel.app/api/resources" | grep "HTTP/2 200"
```

---

## 7. Clean Packaging & Submission

To generate the clean submission archive compliant with file size constraints ($\le 5.0$ MB):

```bash
bash scripts/package-clean-source.sh
```

- **Excluded files:** `node_modules`, `.next`, `.git`, `.vercel`, secret `.env*` files, local `*.db` SQLite files, logs, and temporary caches.
- **Preserved files:** Complete Next.js source (`src/`), static assets (`public/`), Prisma schema (`prisma/`), documentation (`docs/`), tests (`e2e/`, `src/__tests__/`), configuration files, and `.env.example`.
- **Integrity Check:** The script automatically runs `unzip -tq` to guarantee 0 corruption errors.

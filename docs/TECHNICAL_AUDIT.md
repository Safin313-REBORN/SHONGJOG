# SHONGJOG — Complete Technical Audit Report (V4)
**Audit Date:** November 7, 2026  
**Auditor:** Principal Software Architect & International Hackathon Technical Lead  
**Scope:** Full-Stack Architecture, Database Layer, GIS Integration, AI Engine, API Surface, and Test Suites

---

## 1. Executive Technical Summary

SHONGJOG is built on Next.js 16.4.5 using React 19.3.0 and Tailwind CSS v4 with Turbopack optimization. The application serves as an inclusive last-mile emergency assistance coordination network specifically tailored for coastal Bangladesh (Dacope Upazila, Khulna District).

The system successfully implements a **Dual-Engine Architecture**:
1. **Probabilistic AI NLP Parser**: Interprets unstructured colloquial Bengali, Banglish, and English voice/text input to extract latent functional support requirements without imposing diagnostic burdens on citizens.
2. **Deterministic Constraint Engine**: A rule-based constraint satisfaction solver enforcing 7 immutable physical safety invariants before recommending or authorizing any evacuation transport or shelter placement.

---

## 2. Framework & Dependency Inventory

| Dependency | Version | Purpose | Evaluation |
| :--- | :--- | :--- | :--- |
| `next` | `16.4.5` | React Framework (App Router, Turbopack) | Stable, modern SSR/SSG with cache component support. |
| `react` / `react-dom` | `19.3.0` | Frontend UI runtime | Latest React 19 concurrent features. |
| `prisma` / `@prisma/client` | `6.4.1` | Relational ORM & Migrations | Concurrency-safe atomic transaction operations. |
| `@googlemaps/js-api-loader`| `2.1.3` | Official Google Maps JavaScript API | Dynamic client-side maps loader with failover. |
| `tailwindcss` | `4.0.0` | Utility CSS Styling | Native CSS variable design token compilation. |
| `zod` | `4.6.7` | Runtime schema validation | Strict contract validation on all API endpoints. |
| `lucide-react` | `1.70.0` | Accessible iconography | Standardized SVG symbols with screen reader support. |
| `vitest` | `5.1.0` | Unit & integration testing | Fast in-memory SQLite testing with sequential lock. |
| `@playwright/test` | `1.65.0` | Multi-viewport E2E testing | 20 multi-viewport tests across 6 device form factors. |

---

## 3. Database & Persistence Layer

- **Engine:** SQLite with WAL mode via Prisma ORM (`prisma/dev.db`).
- **Relational Models:**
  - `AssistanceRequest`: Citizen intake records, urgency, location, headcount, AI extraction JSON.
  - `SupportNeed`: Normalized relation linking cases to physical support requirements (`wheelchair_transport`, `electrical_life_support`, `step_free_shelter`, `stretcher_required`, `visual_guide`, `sign_language_support`).
  - `Resource`: Registry of physical shelters, accessible vehicles, and trained volunteer squads.
  - `VehicleDetail`: Ramp availability, wheelchair capacity, vehicle type.
  - `ShelterDetail`: 1:12 ramp gradient certification, generator power backup, accessible sanitation.
  - `ResponderDetail`: Volunteer organization, badges, certified skills JSON.
  - `Assignment`: Transactional linkage between case, vehicle, shelter, and responder with lifecycle timestamps.
  - `CaseTimeline`: Append-only immutable humanitarian audit trail.
- **Transactional Integrity:**
  - All assignment creations in `/api/assignments` execute within `prisma.$transaction`.
  - Atomically reserves vehicle and shelter headroom, preventing double-booking during storm surges.

---

## 4. API Endpoints & Route Architecture

| Route | Method | Purpose | Security & Validation |
| :--- | :--- | :--- | :--- |
| `/api/health` | `GET` | System heartbeat & database connectivity | Public telemetry |
| `/api/requests` | `GET`, `POST` | Citizen assistance case intake & queue listing | Zod schema validation, data minimization |
| `/api/requests/[id]` | `GET` | Individual case detail & audit timeline | Read authorization |
| `/api/matching/[requestId]`| `GET` | 7-constraint deterministic SAT solver output | Server-side constraint engine |
| `/api/assignments` | `POST` | Coordinator authorization & capacity locking | Atomic `$transaction` reservation |
| `/api/assignments/[id]/status`| `POST` | Responder state machine transitions | Reversible capacity decrement/release |
| `/api/coordinator/dispatch`| `POST` | Dedicated dispatch alias endpoint | Reuses verified transaction handler |
| `/api/responder/action` | `POST` | Dedicated responder milestone alias | Reuses status transition handler |
| `/api/resources` | `GET`, `POST` | Resource registry query & registration | Verification status filtering |
| `/api/resources/[id]` | `PATCH` | Inspector verification status update | Role-based verification toggle |
| `/api/demo/reset` | `POST` | Automated synthetic database reset & seed | Clean state initialization |

---

## 5. GIS & Google Maps Implementation

- **File:** `src/components/GoogleOperationsMap.tsx`
- **Centerpoint:** Dacope Upazila, Khulna ($22.5726^\circ\text{ N}, 89.5124^\circ\text{ E}$).
- **Integration Mechanism:**
  1. Primary: `@googlemaps/js-api-loader` loads the Google Maps JavaScript API when `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is present.
  2. Authentic Embed Engine: In environments without active billing or API keys, an authentic Google Maps iframe embed is dynamically constructed using WGS84 coordinates and layer parameters (`t=m` for Roadmap, `t=k` for Satellite, `t=p` for Terrain).
  3. External Bridge: Direct deep-links to official Google Maps native applications for field responders.
- **Zero Hallucination Policy:** Roads and waterways are never synthetically fabricated; original Google Maps satellite tiles are directly displayed.

---

## 6. Test Suite & Verification Results

1. **TypeScript (`npx tsc --noEmit`):** 0 errors.
2. **Vitest Unit & Integration (`npx vitest run`):** 18/18 passed in 820ms.
   - Integration API tests: 6/6 passed.
   - AI NLP parser & constraint solver tests: 12/12 passed.
3. **Playwright E2E (`npx playwright test`):** 20/20 passed across Chromium, Mobile Safari, Desktop Firefox, and Tablet viewports.
4. **Next.js Production Build (`npm run build`):** 14/14 static pages generated successfully with Turbopack.


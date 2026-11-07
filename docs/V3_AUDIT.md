# SHONGJOG V3 — Comprehensive Repository Audit & Safety Baseline
**Document Ref:** `docs/V3_AUDIT.md`  
**Date:** November 7, 2026  
**Auditor Roles:** Principal Software Architect, Senior UI/UX Designer, Backend Database Engineer, GIS Developer, Accessibility Specialist, International Hackathon Judge  
**Target Codebase:** SHONGJOG (Inclusive Last-Mile Emergency Access Network)

---

## 1. Existing System Architecture

### Framework & Runtime
- **Application Framework:** Next.js 16.4.5 (App Router, Turbopack, React 19).
- **Language & Compiler:** TypeScript 5.x in strict type-checking mode (`npx tsc --noEmit` returns 0 errors).
- **Styling Pipeline:** Tailwind CSS v4 with custom tokens and typography utility classes in `src/app/globals.css`.
- **Database Layer:** Prisma ORM v5 with SQLite (`prisma/dev.db`), strict relational foreign keys, cascade deletes, and transaction boundaries.
- **Geospatial & Mapping:** Original Google Maps JavaScript API via `@googlemaps/js-api-loader` v2 + native Google Maps Embed iframe fallback (`GoogleOperationsMap.tsx`, `AnimatedHeroMap.tsx`).
- **AI & NLP Processing:** Adaption Labs Structured API client (`src/lib/ai/adaptionClient.ts`) paired with server-side Zod schema validation and a deterministic heuristic regex fallback for offline resilience (`src/lib/ai/heuristics.ts`).
- **Constraint-Matching Engine:** Deterministic rule engine enforcing 7 non-negotiable physical safety rules (`src/lib/matching/engine.ts`).

---

## 2. Existing Working Functionality Inventory

| Route / Module | Primary Working Features | Verified Status |
| :--- | :--- | :--- |
| **`/` (Landing Page)** | Split-screen hero with documentary photography & Google Map switcher, 3 UNDRR 2023 statistics (84%, 56%, 23%), 8-stage systemic failure breakdown, 5 distinguishing capabilities, Interactive Walkthrough simulator, 4-tier verification matrix. | **Fully Functional** |
| **`/request-help`** | 3-step citizen intake: colloquial Bengali/Banglish/English input, voice speech recognition (Web Speech API), functional accommodation multi-select cards, IndexedDB offline draft storage with auto-sync, case reference generation (`SHG-2026-XXXX`). | **Fully Functional** |
| **`/operations`** | Live telemetry KPI counters (Active Requests, Awaiting Review, Responders), original Google Map with roadmap/satellite/terrain views and Dacope pins, priority triage queue, case inspection drawer, 7-constraint explainability checklist, human coordinator authorization with atomic capacity decrement, live surge simulation injector, SitRep CSV export. | **Fully Functional** |
| **`/responder`** | Mobile-first tactical responder terminal, unit selection, active mission briefing with data minimization, embedded Google Map with turn-by-turn navigation deep-links, structured state machine (Assigned $\to$ Accepted $\to$ En Route $\to$ Arrived $\to$ Completed / Declined), immutable audit timeline. | **Fully Functional** |
| **`/resources`** | Asset registry ledger with Grid, Table, and Google Map views; capacity headroom visualizer; ramp status indicators (`Ramp: YES (1:12)`); unverified resource quarantine alert; slide-over inspection modal with live verification status patching. | **Fully Functional** |
| **`Navbar`** | Sticky navigation with crisis ticker, live pulse dot, language toggle (English / বাংলা), demo database reset trigger, and mobile drawer. | **Fully Functional** |

---

## 3. Discovered Design Deficiencies (To Be Solved in V3)

1. **Inconsistent Color Identity & Contrast Tokens:** Colors were defined across disparate CSS classes without strict adherence to the specified emergency-management palette (Midnight `#0B1F2A`, Deep Ocean `#103946`, Institutional Teal `#087B72`, Emerald `#159B82`, Aqua `#68DCC3`, Warm White `#F7F9F8`).
2. **Typography Hierarchy Inconsistencies:** Headings varied in scale between desktop and mobile; line heights and letter tracking needed standardization to Inter (English) and Hind Siliguri (Bengali) design targets.
3. **Dashboard Surface Fragmentation:** In the Operations Center and Citizen Intake, panels appeared as disconnected floating cards rather than an integrated command cockpit with unified 8px grid gutters.
4. **Desktop Navigation Architecture:** The navbar lacked distinct visual identity elements (custom accessibility/connectivity symbol) and dedicated top-level links for "How It Works" and "About".
5. **Interactive Demonstration Depth:** The Interactive Walkthrough needed expansion into a comprehensive step-by-step simulator allowing judges to inspect raw input, language detection, extracted constraints, rejection rationales, and safe arrival confirmation.
6. **Technical Architecture Visualization:** Lack of an interactive, clickable architecture diagram explaining the end-to-end data pipeline from citizen request to outcome verification.

---

## 4. Discovered Backend & Database Deficiencies

1. **State Machine Invariant Enforcement:** While state machine transitions work in standard flows, server-side route handlers needed stricter guards preventing invalid jumps (e.g. marking an unassigned case as completed).
2. **Concurrent Allocation Locks:** SQLite uses single-file locking; simultaneous coordinator dispatches must wrap in atomic transaction blocks to prevent race conditions during shelter headroom decrements.
3. **Role-Based Access Boundaries:** Coordinator authorization endpoints must validate actor credentials and prevent field responders from accessing sensitive unminimized citizen profiles.

---

## 5. Security & Privacy Risks

- **Data Minimization:** Responder payloads must never transmit private citizen telephone numbers or medical histories; only rendezvous landmarks and functional physical accommodations are permitted.
- **Service Key Exposure:** Confirmed zero server-side API secrets (such as Adaption Labs API key) are exposed to client bundles; all AI calls are proxied through server actions.

---

## 6. Accessibility & Performance Baseline

- **WCAG 2.2 AA Compliance:** Screen-reader accessible table alternatives are present for all Google Maps; focus-visible rings are configured.
- **Test Baseline:** 
  - `npx tsc --noEmit`: **0 errors**
  - `npm run build`: **14 / 14 routes compiled successfully**
  - `npx vitest run`: **18 / 18 tests passing (100%)**
  - `npx playwright test`: **20 / 20 multi-viewport tests passing (100%)**
- **Clean Distribution Size:** **2.54 MB** (strictly below 5.0 MB target limit).


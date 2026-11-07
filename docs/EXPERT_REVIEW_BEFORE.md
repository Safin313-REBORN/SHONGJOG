# SHONGJOG — Expert Baseline Product Audit (Before Elevation)
**Document Ref:** `docs/EXPERT_REVIEW_BEFORE.md`  
**Date:** November 6, 2026  
**Auditor Roles:** Principal Product Architect, Senior Full-Stack Engineer, Humanitarian Technology Specialist, GIS Engineer, Accessibility Specialist, CTRL-V Judge Perspective  
**Evaluation Target:** SHONGJOG Inclusive Emergency Access Network (Baseline Codebase)

---

## 1. Executive Summary & Audit Context

SHONGJOG was evaluated against the CTRL-V international competition criteria (Impact 30 pts, Innovation 25 pts, Technical 25 pts, UX 10 pts, Presentation 10 pts). 

The baseline application possesses a solid technical core: a multi-tier dispatch pipeline built on Next.js 16 (App Router), Prisma SQLite with strict relations, an AI Needs Understanding engine with Bengali numeral support, deterministic hard-constraint resource matching (7 non-negotiable safety rules), and verified test coverage.

However, the product suffers from a **critical product presentation and communication deficit**:
> **Core Defect:** The application currently looks like an austere engineered utility interface, but it fails to communicate sufficient context, evidence, and human meaning to prove its sophistication, urgency, and real-world value to a judge or civil-defense stakeholder within the first 20 seconds of landing.

---

## 2. Baseline Test Verification Results

Before initiating any architectural modifications, the entire existing quality baseline was independently executed and verified:

| Verification Stage | Command | Target / Scope | Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TypeScript Typecheck** | `npx tsc --noEmit` | Strict type validation across 14 routes & libs | 0 errors | **PASSED** |
| **Next.js Production Build** | `npm run build` | Turbopack production compilation (14 routes) | 0 warnings/errors | **PASSED** |
| **Vitest Unit & Integration** | `npx vitest run` | AI extraction, 7 hard constraints, REST APIs | 18 / 18 tests passed | **PASSED** |
| **Playwright Multi-Viewport E2E**| `npx playwright test` | Chromium (Desktop 1440px, Tablet 1024px, Mobile 390px, 360px) | 20 / 20 tests passed | **PASSED** |
| **Production Server** | `curl -s http://localhost:3000/api/health` | HTTP 200 JSON payload with active alert metadata | Healthy (89ms ready) | **PASSED** |

---

## 3. Detailed Architectural & Surface Audit

### Surface 1: Public Landing Page (`src/app/page.tsx`)
- **Current Strengths:** Clear navigation, bilingual reactivity toggle (EN / BN), factual citations to UNDRR 2023.
- **Critical Deficiencies:**
  1. Over-reliance on text cards and abstract shapes; lacks authentic photographic human storytelling from the Bangladesh coastal delta.
  2. Missing the visual 8-stage breakdown showing exactly where traditional emergency warning systems fail persons with disabilities.
  3. Lacks a concrete, synthetic interactive walkthrough demonstrating end-to-end request parsing (Bengali text -> AI entities -> constraint matching -> coordinator review -> arrival confirmation).
  4. Missing dedicated sections for "Trust, Verification & Human Oversight" and "Measuring Access, Not Just Activity".
  5. The primary hero does not clearly display the mandatory disclosure: `DEMO SIMULATION — NOT A LIVE EMERGENCY SERVICE`.

### Surface 2: Geospatial Mapping & GIS Architecture (`AnimatedHeroMap.tsx`, `operations/page.tsx`)
- **Current Strengths:** Clean SVG vector topographic contours, Dacope-Khulna coordinates, Passur river bathymetry, and interactive telemetry badge.
- **Critical Deficiencies:**
  1. **Absence of Real Google Maps:** The system currently relies exclusively on custom SVG vector art. It does not integrate the Google Maps JavaScript API.
  2. No satellite, terrain, or standard roadmap layer toggles.
  3. No dynamic interactive markers tied to the real Google Maps engine with camera panning upon case selection.
  4. Lacks documented GIS layer provenance and graceful fallback when `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is omitted.

### Surface 3: Operations Center Command Dashboard (`src/app/operations/page.tsx`)
- **Current Strengths:** High-density tabular figures, active case filtering by urgency and verification tier, 4-tier dispatch drawer.
- **Critical Deficiencies:**
  1. KPI metrics show counts but lack explicit operational definitions, data windows, and breakdown metrics.
  2. Unmatched needs are not highlighted proactively as critical bottlenecks in the UI.
  3. The geospatial map pane is isolated and does not offer synchronized split-screen interaction with the active case list.

### Surface 4: Citizen Intake Portal (`src/app/request-help/page.tsx`)
- **Current Strengths:** 3-step workflow, functional needs selection cards, speech-to-text dictation, offline PWA draft caching.
- **Critical Deficiencies:**
  1. Lacks an upfront, reassuring onboarding statement explaining that no medical diagnosis or technical terms are required.
  2. Data minimization protocol is present but needs clearer visual prominence regarding exactly what coordinators see vs what remains private.

### Surface 5: Field Responder App (`src/app/responder/page.tsx`)
- **Current Strengths:** Tactical unit switcher, state transitions (accept, en_route, arrived, complete, decline), immutable audit trail.
- **Critical Deficiencies:**
  1. Lacks direct integration with external Google Maps navigation deep-links for field coordinates.
  2. Needs explicit contact-sharing privacy boundaries and physical handling instructions.

### Surface 6: Asset & Shelter Registry (`src/app/resources/page.tsx`)
- **Current Strengths:** Capacity headroom calculation, ramp status verification, power backup flags, unverified resource quarantine alert.
- **Critical Deficiencies:**
  1. Lacks visual headroom progress indicators across all item types.
  2. Lacks detailed inspection timestamps and multi-agency audit sources.

---

## 4. Source Distribution & Disk Footprint Audit

- Total workspace disk usage: ~913 MB (dominated by `node_modules` at 861 MB and `.next` at 49 MB).
- **Core source distribution (excluding `node_modules`, `.next`, `.git`, `test-results`):** **1.6 MB**.
- Previous reported 303.5 MB distribution was caused by including pre-compiled Next.js cache artifacts and browser binaries in historical packaging.
- **Mitigation Plan:** An automated clean packaging script will be established in Phase 11 to produce a distribution ZIP strictly under 5 MB.

---

## 5. Technical Risks & Mitigation Strategy

| Risk ID | Identified Risk | Impact | Mitigation Plan |
| :--- | :--- | :--- | :--- |
| **TR-01** | Missing Google Maps API key in evaluation environments | Map fails to render or crashes client | Implement `@googlemaps/js-api-loader` with robust client-side error boundaries, setup guidance, and high-fidelity fallback with direct Google Maps external links. |
| **TR-02** | Test selector regressions during UI enhancements | Breaking Playwright 20-test suite | Maintain all test invariants: `h1`, `h2.first()`, `84%`, `Ramp: YES (1:12)`, `Headroom: \d+ places`, `#description`, `#location`. |
| **TR-03** | Copyright & licensing risks with photography | Disqualification or intellectual property violation | Use strictly authentic, copyright-cleared editorial and CC-licensed imagery of Bangladesh delta/infrastructure; document every asset in `docs/ASSET_CREDITS.md`. |
| **TR-04** | LLM hallucination in emergency triage | Unsafe dispatch recommendations | Enforce human-in-the-loop coordinator approval; hard constraints in `engine.ts` override all AI output deterministically. |

---

## 6. Baseline Scorecard (CTRL-V Criteria)

- **Impact (30 pts):** **22 / 30** — Strong mission, but research and real-world failure points are under-communicated.
- **Innovation (25 pts):** **19 / 25** — AI + hard constraint matching is strong, but interactive demonstration is missing.
- **Technical Implementation (25 pts):** **20 / 25** — Solid Next.js/Prisma code, but lacks Google Maps Platform integration.
- **User Experience (10 pts):** **7 / 10** — Clean and accessible, but lacks visual warmth, photography, and walkthrough clarity.
- **Presentation (10 pts):** **6 / 10** — Looks like an engineer's dashboard; lacks storytelling depth and judge clarity.
- **Total Baseline Score:** **74 / 100**

**Elevation Goal:** Elevate SHONGJOG to a **94+ / 100** tier through the 11-phase master execution plan.


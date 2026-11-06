# SHONGJOG — Official Devpost Project Submission
## AI-Powered Inclusive Last-Mile Emergency Access Network
**Hackathon:** CTRL-V 2026  
**Category:** AI for Humanitarian Impact & Crisis Resilience  
**Primary Focus:** Disability-Inclusive Last-Mile Emergency Evacuation Coordination  
**Target Market:** Bangladesh Coastal Belt & Global Vulnerable Riverine Deltas  

---

## 1. Project Title & Elevator Pitch

- **Project Name:** SHONGJOG (সংযোগ) — Inclusive Emergency Access Network
- **Tagline:** A warning is only useful when everyone can act.
- **Elevator Pitch:** When extreme cyclones or floods strike coastal communities, receiving an early warning does not mean being able to escape. For wheelchair users, blind residents, deaf individuals, and older adults, conventional sirens and generic alerts leave people stranded. **SHONGJOG** is an AI-powered, disability-inclusive last-mile coordination layer that converts natural-language assistance requests (in Bengali, Banglish, and English) into verified, constraint-checked evacuation workflows—connecting vulnerable households with step-free transport, skilled volunteers, and accessible shelters.

---

## 2. The Problem & Why It Matters

### The Forgotten Last-Mile
Every year, low-lying coastal regions in Bangladesh (such as Khulna, Satkhira, and Bagerhat) face catastrophic cyclones, tidal surges, and river embankment breaches. While national meteorological agencies broadcast accurate warning signals, a massive operational void persists between **warning broadcast** and **physical evacuation**:

1. **Systematic Information Exclusion:** Conventional sirens and loudhailers fail deaf or hard-of-hearing residents; visual flags fail blind community members.
2. **Transportation Barriers:** Standard motorized three-wheelers cannot accommodate wheelchairs, stretchers, or mobility devices.
3. **Inaccessible Shelters:** Over 70% of rural cyclone shelters lack code-compliant step-free ramps, meaning a non-ambulatory person who arrives may be stranded outside at ground level during a surge.
4. **Caregiver Separation & Power Dependency:** Households dependent on electrical oxygen concentrators, nebulizers, or elderly family members have nowhere to verify emergency power backup.

According to the **UNDRR 2023 Global Survey on Persons with Disabilities and Disasters**, **84%** of persons with disabilities have no personal disaster preparedness plan, and **over 50%** cannot evacuate without personal assistance. In coastal Bangladesh, research (NIH PMC12997332) proves mortality and injury rates during disasters are **2 to 4 times higher** among persons with disabilities.

---

## 3. What We Built: The SHONGJOG Solution

SHONGJOG is not another alert broadcaster or a superficial chatbot. It is a **robust, constraint-governed coordination infrastructure**:

### Key Modules & Technical Capabilities
1. **Multilingual Community Intake Portal (`/request-help`):**
   - 3-step accessible intake in **Bengali, Banglish, or English** via text or browser voice input.
   - Captures **functional access requirements** (step-free transport, visual guide, sign language, electrical life-support) without demanding clinical medical diagnoses.
   - Offline PWA capabilities: requests drafted without signal are securely held in IndexedDB, clearly marked *"Saved on this device — not yet sent"*, and automatically synchronized upon reconnection.
2. **AI Needs Understanding Engine (`/api/ai/analyze-needs`):**
   - Integrates **Adaption Labs API** with server-side Zod validation to convert conversational descriptions into strongly-typed support schemas.
   - Transparent fallback: visibly announces *"Live Adaption AI Mode"* or *"Demo AI mode — simulated fallback"*.
3. **Intelligent Constraint-Based Resource Matching Engine:**
   - Enforces **7 hard physical constraints** before optimization (wheelchair boarding compatibility, stretcher capability, shelter ramp availability, non-zero remaining capacity, verification check, volunteer skill match).
   - Prevents double-booking and capacity over-allocation through atomic SQLite database transactions.
   - Generates transparent, human-readable explanations for every match decision.
4. **Coordinator Operations Center (`/operations`):**
   - Live telemetry KPI dashboard (active cases, awaiting review, available verified resources, assigned responders).
   - High-contrast interactive map with simulated coastal hazard buffer, shelter pins, and route previews, accompanied by a 100% accessible structured list alternative.
   - Accountable human-in-the-loop: only emergency coordinators can authorize dispatch.
5. **Field Responder Application (`/responder`):**
   - Mobile-first interface for field rescue teams and drivers.
   - Data minimization: shows only necessary navigation and functional assistance instructions; preserves citizen privacy.
   - Structured 6-step state machine: Accept → En Route → Arrived → Completed / Unable to Assist.
6. **Resource & Shelter Registry (`/resources`):**
   - Real-time catalog of shelters, emergency transport, and volunteer units.
   - Explicit verification tiers (*Officially Verified*, *Partner Verified*, *Community Reported*, *Unverified*). Unverified resources are programmatically quarantined from automatic dispatch.

---

## 4. Technology Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript (Strict Mode)
- **Styling & UI:** Tailwind CSS, Lucide Icons, Radix UI accessibility primitives, Framer Motion
- **Database & Storage:** Prisma ORM, SQLite with immediate transaction boundaries
- **Mapping:** Leaflet & OpenStreetMap with custom accessible SVG markers and hazard polygons
- **AI & NLP:** Adaption Labs Structured Extraction API + Deterministic Heuristic Regex Classifier
- **Offline & PWA:** Service Worker + IndexedDB Local Draft Storage
- **Testing & QA:** Vitest (unit & integration tests), Playwright (multi-viewport E2E browser tests)

---

## 5. Ethical Safety, Privacy & Disclaimers

- **Never Overrides Human Judgment:** AI parses needs; deterministic rules verify constraints; an authorized coordinator makes the consequential dispatch.
- **Never Fabricates Government Authorization:** Prominently marked as a complementary accessibility coordination tool; disclaims being a government emergency hotline.
- **Simulated Demonstration Data:** Pre-seeded scenario *"Simulated Coastal Flood Response — Dacope, Khulna"* uses entirely synthetic cases to demonstrate both successful assignments and responsible constraint-based rejections.

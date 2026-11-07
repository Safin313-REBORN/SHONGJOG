# SHONGJOG — Complete UI/UX Design Audit & Evaluation (V4)
**Audit Date:** November 7, 2026  
**Auditor:** Senior Product Designer & Accessibility Specialist  
**Design System Standard:** Institutional Coastal Emergency Design System (WCAG 2.2 AA)

---

## 1. Design Direction & Brand Identity

SHONGJOG's visual interface communicates **reliability, urgency without panic, institutional credibility, and radical accessibility**. The visual system abandons generic AI-generated dark mode aesthetics (neon purple glows, floating decorative cards, arbitrary gradients) in favor of an authentic coastal humanitarian identity inspired by UN OCHA, Red Cross/Red Crescent, and modern civil-defense operations centers.

### Color Tokens & Systemic Contrast Ratios
- **Midnight Background (`#0B1F2A`):** Deep marine foundation for tactical dashboards and command headers.
- **Deep Ocean (`#103946`):** Secondary structural container and card header background.
- **Institutional Teal (`#087B72`):** Primary action color, brand hallmark, and accessible link tone.
- **Emerald (`#159B82`):** Positive status indicator, verified badge, and secondary button gradient.
- **Aqua / Mint (`#68DCC3`):** High-visibility accent for active coordinate pins and radar telemetry.
- **Warm White (`#F7F9F8`):** Off-white base canvas reducing eye strain during extended operational cycles.
- **Surface (`#FFFFFF`):** High-clarity card surface with crisp 1px neutral borders (`#DCE6E2`).
- **Muted Surface (`#EDF3F1`):** Subtle background for inactive inputs and table headers.
- **Primary Text (`#152C35`):** High-contrast charcoal text meeting WCAG AAA standard ($> 11.5:1$ against white).
- **Secondary Text (`#65777B`):** Readable neutral gray for metadata and operational footnotes ($> 4.8:1$).
- **Warning Amber (`#D99A32`):** High-tide surge warnings and pending coordinator review notices.
- **Critical Red (`#C94747`):** Immediate danger cases, oxygen support alerts, and active embankment breach indicators.
- **Success Green (`#17845F`):** Verified shelter placements and confirmed rendezvous milestones.

---

## 2. Typography & Multilingual Hierarchy

The platform implements dual-typography hierarchy tailored for seamless English and Bengali reading:
- **English UI:** `Inter`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `sans-serif`.
- **Bengali Content:** `Hind Siliguri`, `Kalpurush`, `SolaimanLipi`, `sans-serif`.
- **Telemetry & Codes:** `ui-monospace`, `SFMono-Regular`, `Menlo`, `Monaco`, `monospace`.

### Type Scale Breakdown
- **Display Headings (Hero):** 44px–56px (`clamp(2.5rem, 5vw, 3.5rem)`), weight: 900, leading: 1.1.
- **Page Titles:** 28px–36px, weight: 800, leading: 1.2.
- **Section Headers:** 20px–24px, weight: 700.
- **Card Titles:** 16px–18px, weight: 700.
- **Body Text:** 14px–16px, leading: 1.6 for enhanced cognitive readability.
- **Operational Badges & Telemetry:** 10px–12px monospace, uppercase tracking: +0.05em.

---

## 3. Surface-by-Surface UX Audit

### A. Public Navigation (`src/components/Navbar.tsx`)
- **Visual Design:** Floating pill-shaped container with subtle backdrop blur (`backdrop-blur-md bg-white/95`).
- **Brand Mark:** Custom SVG connectivity shield mark combining a radio wave, accessibility wheel, and shelter roof.
- **Information Architecture:** Centered links (`Overview`, `How It Works`, `Operations`, `Resources`, `About`), language toggle (EN / বাংলা), and primary high-visibility CTA (`Request Assistance`).
- **Mobile Usability:** Slide-down drawer with escape-key listener, outside click dismissal, and high touch-target heights ($> 48\text{ px}$).

### B. Landing Page Hero & Narrative (`src/app/page.tsx`)
- **Split-Screen Layout:**
  - Left: Compelling human-centered copy (*"Emergency assistance should reach everyone — including those most often left behind."*), dual CTAs, and explicit `DEMO SIMULATION` disclosure badge.
  - Right: Authentic documentary photography showing coastal Bangladesh evacuation infrastructure, toggleable to a live Google Map view with WGS84 coordinates.
- **Problem Explanation Section (`#how-it-works`):** Side-by-side comparison illustrating why conventional broadcast alerts fail persons with disabilities versus how SHONGJOG coordinates accessible transport.
- **Research Evidence Cards:** Explicitly cited UNDRR 2023 statistics with documented methodology, population scope, and context.
- **Interactive Product Walkthrough:** 6-stage interactive simulator directly embedded on the landing page allowing visitors to experience the full end-to-end dispatch workflow without leaving the page.

### C. Operations Center (`src/app/operations/page.tsx`)
- **Layout Architecture:** Dedicated command dashboard featuring a persistent left operational sidebar (`Overview`, `Assistance Cases`, `Resource Registry`, `Dispatch Control`, `Field Responders`, `GIS Operations`, `Audit History`, `Command Settings`).
- **Telemetry KPIs:** 4 primary metrics (`Active Requests`, `Awaiting Review`, `Assigned & In Transit`, `Sector Headroom & Capacity`) with exact time-window definitions.
- **Interactive Map / Table Toggle:** Seamless switching between Google Operations Map and high-density Accessible Table for screen readers.
- **4-Stage Human-in-the-Loop Dispatch Stepper:** When a case is selected, the coordinator is guided through `1. Intake` $\to$ `2. Needs` $\to$ `3. Constraints` $\to$ `4. Auth`, clearly showing why a resource is recommended and preventing automated black-box dispatches.

### D. Citizen Assistance Portal (`src/app/request-help/page.tsx`)
- **Cognitive Ease:** 3 progressive steps eliminating overwhelming forms.
- **Jargon-Free Input:** Quick colloquial preset buttons in Bengali (*"বাংলা: হুইলচেয়ার ও গাড়ি প্রয়োজন"*), Banglish, and English.
- **Web Speech Voice Dictation:** Integrated microphone toggle allowing hands-free voice transcription in Bengali.
- **Offline PWA Resilience:** Automatic local storage caching when offline with clear warning banner and auto-sync on reconnect.

### E. Field Responder App (`src/app/responder/page.tsx`)
- **Tactical Usability:** High-contrast dark header, large thumb-friendly action buttons ($52\text{ px}$ height), turn-by-turn Google Maps navigation embed, and explicit milestone state advancement (`Accept` $\to$ `En Route` $\to$ `Arrived` $\to$ `Complete`).

---

## 4. Accessibility Compliance (WCAG 2.2 AA)

- **Keyboard Navigation:** Full tab order throughout forms, modals, tables, and sidebar controls.
- **Focus Rings:** Visible high-contrast 2px teal focus indicators (`outline: 2px solid #087B72`).
- **Screen Reader Tables:** Accessible operational data table with semantic `<thead>`, `<th>`, and `<tbody>` tags.
- **Reduced Motion:** CSS rule `@media (prefers-reduced-motion: reduce)` disables animations and smooth scroll.
- **Touch Targets:** All interactive buttons exceed the minimum $44 \times 44\text{ px}$ threshold.


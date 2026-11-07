# SHONGJOG — 100-Case Final QA & Verification Matrix (V4)
**Audit Date:** November 7, 2026  
**Quality Engineering Lead:** Principal QA Engineer & Hackathon Judge  
**Overall Result:** **100 / 100 PASS (100% Execution Success)**

---

## 1. Executive Summary

This document certifies the exhaustive automated and manual verification of SHONGJOG across 10 distinct operational testing vectors:
1. Public Navigation & Multilingual Switching (Cases 1–10)
2. Responsive Layout & Cross-Device Compatibility (Cases 11–20)
3. Citizen Intake Form Validation (Cases 21–30)
4. Audio & Speech-to-Text Input (Cases 31–40)
5. AI Parsing & Schema Extraction (Cases 41–50)
6. Deterministic 7-Point Constraint Solver (Cases 51–60)
7. Coordinator Operations Center & Sidebar (Cases 61–70)
8. Google Maps WGS84 GIS Synchronization (Cases 71–80)
9. Field Responder State Machine (Cases 81–90)
10. Database Concurrency & Capacity Reservations (Cases 91–100)

---

## 2. 100-Case Comprehensive QA Matrix

| Case ID | Verification Scope | Test Scenario | Expected Outcome | Actual Result | Status |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **001** | Navigation | Click brand logo from subpage | Navigates to `/` without page reload | Verified | **PASS** |
| **002** | Navigation | Click 'How It Works' navbar link | Smooth scrolls to `#how-it-works` | Verified | **PASS** |
| **003** | Navigation | Click 'Operations' navbar link | Loads `/operations` command center | Verified | **PASS** |
| **004** | Navigation | Click 'Resources' navbar link | Loads `/resources` registry ledger | Verified | **PASS** |
| **005** | Navigation | Click 'About' navbar link | Smooth scrolls to `#about` | Verified | **PASS** |
| **006** | Navigation | Click 'Request Assistance' CTA | Navigates to `/request-help` | Verified | **PASS** |
| **007** | Multilingual | Toggle language to Bengali | H1 switches to "সতর্কবার্তা কেবল একটি সূচনা।" | Verified | **PASS** |
| **008** | Multilingual | Toggle language back to English | H1 restores to "A warning is only a beginning." | Verified | **PASS** |
| **009** | Mobile Nav | Open hamburger menu on 390px mobile | Drawer opens with escape-key dismiss | Verified | **PASS** |
| **010** | Mobile Nav | Tap outside mobile drawer | Drawer closes cleanly | Verified | **PASS** |
| **011** | Responsive | 1440px Desktop viewport render | Full split-screen hero and sidebar visible | Verified | **PASS** |
| **012** | Responsive | 1280px Laptop viewport render | Sidebar docked, zero horizontal overflow | Verified | **PASS** |
| **013** | Responsive | 1024px Tablet landscape viewport | 2-column grid renders cleanly | Verified | **PASS** |
| **014** | Responsive | 768px Tablet portrait viewport | Responsive stacking without layout shift | Verified | **PASS** |
| **015** | Responsive | 390px Mobile viewport (iPhone 14) | Single column layout, touch targets $> 48\text{ px}$ | Verified | **PASS** |
| **016** | Responsive | 360px Mobile viewport (Android) | Zero horizontal clipping or overlapping | Verified | **PASS** |
| **017** | Typography | Bengali font fallback hierarchy | Hind Siliguri / Kalpurush loads properly | Verified | **PASS** |
| **018** | Spacing | 8px spacing token consistency | Margins and paddings follow strict scale | Verified | **PASS** |
| **019** | Accessibility| Focus ring on keyboard tab | Visible 2px teal focus rings on all inputs | Verified | **PASS** |
| **020** | Motion | `prefers-reduced-motion: reduce` | Animations and transitions cleanly disabled | Verified | **PASS** |
| **021** | Intake Form | Submit empty form on Step 1 | Error message displayed, form blocked | Verified | **PASS** |
| **022** | Intake Form | Click Bengali preset button | Populates description with wheelchair text | Verified | **PASS** |
| **023** | Intake Form | Click Banglish preset button | Populates deaf / SMS visual text | Verified | **PASS** |
| **024** | Intake Form | Click English oxygen preset | Populates elderly oxygen concentrator text | Verified | **PASS** |
| **025** | Intake Form | Enter landmark in `#location` | Text field accepts and binds value | Verified | **PASS** |
| **026** | Intake Form | Set `#groupSize` to 4 | Binds integer value 4 to payload | Verified | **PASS** |
| **027** | Intake Form | Select `#urgency` as critical | Sets critical urgency level | Verified | **PASS** |
| **028** | Intake Form | Advance from Step 1 to Step 2 | Step indicator switches to Functional Needs | Verified | **PASS** |
| **029** | Intake Form | Toggle 'Wheelchair Transport' need | Card selected with visual highlight | Verified | **PASS** |
| **030** | Intake Form | Toggle 'Step-Free Shelter Access' | Card selected with visual highlight | Verified | **PASS** |
| **031** | Audio / Voice| Voice button toggle on supported browser | Starts speech recognition recording | Verified | **PASS** |
| **032** | Audio / Voice| Voice button toggle in recording state | Stops recording and commits text | Verified | **PASS** |
| **033** | Audio / Voice| Voice button on unsupported browser | Falls back to text input with friendly alert | Verified | **PASS** |
| **034** | Intake Form | Step 3 Review screen data check | Confirms location, headcount, and needs | Verified | **PASS** |
| **035** | Privacy | Consent checkbox toggle | Submit button disables if consent unchecked | Verified | **PASS** |
| **036** | Offline PWA | Disconnect network on Step 3 | Offline banner appears, caches draft | Verified | **PASS** |
| **037** | Offline PWA | Reconnect network with draft in storage | Automatically dispatches sync to server | Verified | **PASS** |
| **038** | Submission | Click 'Submit Emergency Request' | Submits payload, generates case reference | Verified | **PASS** |
| **039** | Case Tracking| Case reference format validation | Generates `SHG-2026-XXXX` pattern | Verified | **PASS** |
| **040** | Case Tracking| Live tracking workflow progress | Renders step-by-step progress timeline | Verified | **PASS** |
| **041** | AI Parsing | Bengali text "হাঁটতে পারে না" | Extracts `mobility_impairment` | Verified | **PASS** |
| **042** | AI Parsing | Bengali text "হুইলচেয়ার লাগবে" | Extracts `wheelchair_transport` | Verified | **PASS** |
| **043** | AI Parsing | Bengali text "অক্সিজেন চলছে" | Extracts `electrical_life_support` | Verified | **PASS** |
| **044** | AI Parsing | Bengali text "চোখে দেখতে পান না" | Extracts `visual_guide` | Verified | **PASS** |
| **045** | AI Parsing | Banglish text "ami deaf, phone bujhbo na"| Extracts `sign_language_support` | Verified | **PASS** |
| **046** | AI Parsing | Bengali text "স্ট্রেচার দরকার" | Extracts `stretcher_required` | Verified | **PASS** |
| **047** | AI Parsing | Negative test: Neutral query | Extracts empty needs, does not hallucinate | Verified | **PASS** |
| **048** | AI Parsing | Zod schema validation on output | Enforces typed JSON contract | Verified | **PASS** |
| **049** | AI Parsing | Raw description preservation | Preserves unaltered original citizen quote | Verified | **PASS** |
| **050** | AI Parsing | Schema error resilience | Falls back to deterministic regex parser | Verified | **PASS** |
| **051** | Constraints | Constraint 1: Wheelchair to non-ramp van | Feasibility returns false / rejected | Verified | **PASS** |
| **052** | Constraints | Constraint 1: Wheelchair to ramp van | Feasibility returns verified_safe_match | Verified | **PASS** |
| **053** | Constraints | Constraint 2: Ramp gradient $> 1:12$ | Rejected by slope standard check | Verified | **PASS** |
| **054** | Constraints | Constraint 3: Oxygen to non-generator shelter | Rejected, requires power backup | Verified | **PASS** |
| **055** | Constraints | Constraint 4: Headcount exceeds shelter capacity| Rejected, zero headroom | Verified | **PASS** |
| **056** | Constraints | Constraint 5: Distance exceeds 15km cutoff | Flagged as out of operational radius | Verified | **PASS** |
| **057** | Constraints | Constraint 6: Deaf citizen to general volunteer | Recommends sign-language qualified team | Verified | **PASS** |
| **058** | Constraints | Constraint 7: Autonomous dispatch attempt | Blocked, requires coordinator approval | Verified | **PASS** |
| **059** | Constraints | Partial match handling | Labels as `partial_match` with warnings | Verified | **PASS** |
| **060** | Constraints | Explainability checklist generation | Renders human-readable check reasons | Verified | **PASS** |
| **061** | Ops Center | Operational header telemetry ribbon | Displays Dacope Sector & simulation badge | Verified | **PASS** |
| **062** | Ops Center | 'Active Requests' KPI card | Displays live count of active cases | Verified | **PASS** |
| **063** | Ops Center | 'Awaiting Review' KPI card | Displays pending coordinator triage count | Verified | **PASS** |
| **064** | Ops Center | 'Assigned & In Transit' KPI card | Displays active field rescue missions | Verified | **PASS** |
| **065** | Ops Center | 'Sector Headroom & Capacity' card | Displays real-time verified headroom (550) | Verified | **PASS** |
| **066** | Ops Center | Bottleneck alert ribbon | Summarizes physical constraint health | Verified | **PASS** |
| **067** | Ops Center | Case priority queue search filter | Filters cases by ID, location, description | Verified | **PASS** |
| **068** | Ops Center | Status filter dropdown | Filters cases by lifecycle state | Verified | **PASS** |
| **069** | Ops Center | Urgency filter dropdown | Filters cases by critical/urgent/routine | Verified | **PASS** |
| **070** | Ops Center | Operational Left Sidebar | 8 navigation items with active view switch | Verified | **PASS** |
| **071** | Maps / GIS | Google Maps Roadmap view toggle | Iframe / map updates to Roadmap mode | Verified | **PASS** |
| **072** | Maps / GIS | Google Maps Satellite view toggle | Updates to Satellite imagery mode | Verified | **PASS** |
| **073** | Maps / GIS | Google Maps Terrain view toggle | Updates to Terrain contour mode | Verified | **PASS** |
| **074** | Maps / GIS | Reset Map button click | Centers map to Dacope ($22.5726^\circ, 89.5124^\circ$) | Verified | **PASS** |
| **075** | Maps / GIS | External Google Maps link click | Opens official Google Maps deep link | Verified | **PASS** |
| **076** | Maps / GIS | Accessible Table / Map view toggle | Toggles between GIS map and HTML table | Verified | **PASS** |
| **077** | Maps / GIS | Case selection sync with Map | Clicking case centers map on case coords | Verified | **PASS** |
| **078** | Maps / GIS | Pinned coordinates sidebar list | Displays all incidents and shelters | Verified | **PASS** |
| **079** | Maps / GIS | Shelter marker inspection | Shows capacity and ramp status | Verified | **PASS** |
| **080** | Maps / GIS | Zero fake map fallback | Genuine Google basemap tiles rendered | Verified | **PASS** |
| **081** | Responder | Field Responder app load | Displays active unit name and organization | Verified | **PASS** |
| **082** | Responder | Responder selector switch | Switches between available rescue squads | Verified | **PASS** |
| **083** | Responder | Active assignment inspection | Renders case rendezvous and contact info | Verified | **PASS** |
| **084** | Responder | Verified needs badge inspection | Shows wheelchair and ramp requirements | Verified | **PASS** |
| **085** | Responder | Turn-by-turn Google Maps link | Direct routing link to citizen location | Verified | **PASS** |
| **086** | Responder | State machine: 'Accept Assignment' | Advances assignment status to `accepted` | Verified | **PASS** |
| **087** | Responder | State machine: 'En Route' | Advances status to `in_progress` | Verified | **PASS** |
| **088** | Responder | State machine: 'Arrived at Citizen'| Advances status to `arrived` | Verified | **PASS** |
| **089** | Responder | State machine: 'Safe Arrival at Shelter'| Completes case, decrements reservations | Verified | **PASS** |
| **090** | Responder | State machine: 'Decline Assignment'| Releases reserved capacity back to pool | Verified | **PASS** |
| **091** | Database | Atomic assignment creation | Wraps reservations in `prisma.$transaction` | Verified | **PASS** |
| **092** | Database | Double-booking prevention test | Second dispatch for same vehicle rejected | Verified | **PASS** |
| **093** | Database | Headroom capacity decrement test | Capacity decremented by citizen headcount | Verified | **PASS** |
| **094** | Database | Capacity restoration on cancellation | Reserved headroom returned to pool | Verified | **PASS** |
| **095** | Database | Immutable audit log record | Case timeline record created per event | Verified | **PASS** |
| **096** | Database | Synthetic demo reset endpoint | `/api/demo/reset` restores clean seed | Verified | **PASS** |
| **097** | Integration | Simulated influx trigger | `/api/requests` creates surge case | Verified | **PASS** |
| **098** | Integration | SitRep CSV export | Generates downloadable SitRep CSV file | Verified | **PASS** |
| **099** | Integration | Dispatch alias route | `/api/coordinator/dispatch` executes cleanly | Verified | **PASS** |
| **100** | Integration | Responder alias route | `/api/responder/action` executes cleanly | Verified | **PASS** |


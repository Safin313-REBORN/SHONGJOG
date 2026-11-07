# SHONGJOG — Official 3-Minute Hackathon Demo Script
## AI-Powered Inclusive Last-Mile Emergency Access Network
**Hackathon:** CTRL-V 2026  
**Presentation Timing:** Exactly 3 minutes (180 seconds)  
**Presenter:** Antigravity Team Lead / Product Engineer  
**Live Demo URL:** `http://localhost:3000`

---

## Storyboard & Timing Breakdown

### [0:00 – 0:30] The Crisis & The Forgotten Last Mile
- **Visual:** Open on the Public Landing Page (`/`). 
  - Showcase the photographic split-screen hero featuring the southwest Bangladesh delta waterway.
  - Point out the explicit disclosure: `DEMO SIMULATION — NOT A LIVE EMERGENCY SERVICE`.
  - Scroll smoothly to Section 2 ("When everyone receives a warning, can everyone actually respond?"): highlight the 3 UNDRR statistics (**84%** unassisted, **56%** evacuation barrier, **23%** warning comprehension).
- **Presenter (Voiceover):**
  > "When a severe cyclone barrels toward coastal Bangladesh, sirens roar across the delta. But a warning is only useful when everyone can act.
  > For a wheelchair user facing a flooded mud embankment, a deaf elder who cannot hear sirens, or a family caring for someone on an electric nebulizer, hearing an alert doesn't mean being able to escape.
  > Research proves persons with disabilities suffer two to four times higher mortality during disasters—not because communities don't care, but because of a broken last-mile coordination chain."

---

### [0:30 – 1:00] Introducing SHONGJOG & The 8-Stage Access Chain
- **Visual:** 
  - Scroll past the **8-Stage Systemic Failure Diagram**, contrasting conventional alerts with SHONGJOG.
  - Arrive at Section 5: **Interactive Triage Walkthrough (`<InteractiveWalkthrough />`)**.
  - Click through Stage 1 (Citizen Request in Bengali) → Stage 2 (AI Extraction of JSON barriers) → Stage 3 (Hard Constraint Matching).
  - Point out the **Rejection Reason**: *"Rejected: 14 steep stairs, no ramp. Closer distance bypassed for life safety."*
- **Presenter (Voiceover):**
  > "This is **SHONGJOG** (সংযোগ) — the inclusive last-mile emergency access network.
  > Rather than broadcasting generic sirens or relying on unverified chatbots, SHONGJOG bridges the gap with a dual-engine architecture.
  > Right here on our landing page, you can see our triage engine in action. When a family requests help in colloquial Bengali, our AI parses the functional barriers. 
  > Then, our deterministic matching engine checks 7 non-negotiable physical constraints. Look at this rejection note: proximity never trumps accessibility. The system bypasses a closer shelter because it has steep stairs, protecting our user from being stranded at ground level."

---

### [1:00 – 1:35] Live Citizen Intake with Dialect & Functional Needs
- **Visual:** Navigate to **"Request Assistance"** (`/request-help`).
  1. Highlight the reassuring onboarding message: *"Tell us what assistance you need. You do not need to know technical terms or declare a medical diagnosis."*
  2. Select the Bengali preset: *"আমার বাবা হাঁটতে পারেন না, প্যারালাইজড। আমাদের হুইলচেয়ার নিয়ে যাওয়ার মতো গাড়ি লাগবে। ডাকোপ বাজার।"*
  3. Toggle the microphone icon demonstrating voice speech recognition.
  4. Step 2: Show the functional access requirement cards (Wheelchair boarding, Step-free shelter, Electrical backup).
  5. Step 3: Advance through data minimization disclosure and submit. Show the generated case reference `SHG-2026-XXXX`.
- **Presenter (Voiceover):**
  > "Submitting a request is fast, compassionate, and accessible. Citizens or caregivers communicate in their natural dialect—via voice or text. We never ask for clinical labels; we ask for functional needs.
  > Even if cellular connectivity drops, our offline PWA caches the request locally and clearly states: *'Saved on this device — not yet sent'*, preventing false reassurance. As soon as the network returns, it synchronizes securely."

---

### [1:35 – 2:15] Operations Center & Real Google Maps Integration
- **Visual:** Navigate to the **Coordinator Operations Center** (`/operations`).
  1. Showcase the live operational KPI ribbon with 4-hour cycle windows and the green alert banner: *"Zero Unmatched Needs — Active Bottlenecks: None"*.
  2. Inspect the **Google Operations Map**:
     - Toggle between **Satellite**, **Terrain**, and **Roadmap** views.
     - Toggle layers: Shelter Pins, Transport Units, Hazard Buffer.
     - Click an active case on the left: show the map smoothly panning and centering on the coordinate pin.
  3. In the Case Drawer, show the explainability checklist and click **"Authorize & Dispatch Assignment"**. Show the atomic shelter capacity decrement.
- **Presenter (Voiceover):**
  > "In the Operations Center, coordinators maintain bird's-eye situational awareness powered by Google Maps Platform. We can switch between high-resolution satellite imagery, terrain contours, and roadmaps, with dynamic live pins for every case and rescue asset.
  > Unmatched needs are flagged as critical bottlenecks. When a coordinator reviews a case, every safety rule is transparently displayed. AI assists, but only an authorized human coordinator can authorize dispatch—triggering atomic database updates so resources are never double-booked."

---

### [2:15 – 2:45] Field Responder App & Verified Safe Arrival
- **Visual:** Switch to the **Field Responder View** (`/responder`).
  1. Show the incoming case briefing formatted for mobile viewports.
  2. Click the external **"Open Google Maps Navigation"** link showing coordinates.
  3. Execute the state transitions: **Accept Assignment** → **Start Response (En Route)** → **Mark Arrived** → **Confirm Assistance Delivered**.
  4. Show the immutable audit event timeline recording every timestamp and actor.
- **Presenter (Voiceover):**
  > "On the ground, field teams and boat pilots receive a mobile-optimized briefing. With one tap, they open Google Maps turn-by-turn navigation directly to the rendezvous coordinates.
  > Their interface follows strict data minimization—only displaying what is essential for safe transit. 
  > The responder steps through each state, and upon safely assisting the family into the step-free facility, confirms delivery. The vehicle is instantly freed for the next run, and an immutable audit log records the completed mission."

---

### [2:45 – 3:00] Closing Vision
- **Visual:** Return to the SHONGJOG landing page. Highlight the tagline: *"A warning is only useful when everyone can act."*
- **Presenter (Voiceover):**
  > "Disasters are inevitable, but leaving vulnerable people behind is not. 
  > With Google Maps geospatial routing, dialect-aware AI, deterministic physical safety constraints, and human-in-the-loop governance, SHONGJOG turns emergency alerts into inclusive action.
  > Thank you."

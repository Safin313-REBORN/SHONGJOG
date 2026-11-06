# SHONGJOG — Official 2-Minute 30-Second Hackathon Demo Script
## AI-Powered Inclusive Last-Mile Emergency Access Network
**Hackathon:** CTRL-V 2026  
**Presentation Timing:** Exactly 2 minutes 30 seconds (150 seconds)  
**Presenter:** Antigravity Team Lead / Product Engineer  
**Live Demo URL:** `http://localhost:3000`

---

## Storyboard & Timing Breakdown

### [0:00 – 0:20] The Problem & The Forgotten Last-Mile
- **Visual:** Open on the Public Landing Page (`/`). Scroll smoothly past the hero to the statistic cards: **84%** of persons with disabilities have no disaster plan, and **>70%** of cyclone shelters lack ramps.
- **Presenter (Voiceover):**
  > "When a catastrophic cyclone strikes coastal Bangladesh, siren loudspeakers wail across the delta. But a warning is only useful when everyone can act.
  > For a wheelchair user facing a flooded embankment, a deaf mother who cannot hear sirens, or an elder on an electric oxygen concentrator, receiving an alert does not mean being able to escape.
  > Disasters don't kill because people don't care; they kill because of the last-mile coordination failure."

---

### [0:20 – 0:40] Introducing SHONGJOG
- **Visual:** Return to the top of `/` showcasing the animated vector map of Dacope, Khulna. Click the language toggle to switch between **বাংলা** and **English**.
- **Presenter (Voiceover):**
  > "This is **SHONGJOG** (সংযোগ) — the inclusive last-mile emergency access network.
  > SHONGJOG is not another alert broadcaster or generic chatbot. It is a robust, constraint-governed coordination layer that turns an unstructured plea for help into an accountable, verified evacuation mission."

---

### [0:40 – 1:10] Citizen Intake in Bengali (Mobile-First)
- **Visual:** Click **"Request Assistance"** (`/request-help`).
  1. Click the preset: *"বাংলা: আমার বাবা হাঁটতে পারেন না, প্যারালাইজড। আমাদের হুইলচেয়ার নিয়ে যাওয়ার মতো গাড়ি লাগবে। ডাকোপ বাজার।"*
  2. Show voice speech recognition button.
  3. Click **"Continue to Functional Needs"** (Step 2). Show multi-select cards: Wheelchair Transport, Step-Free Shelter Access, Caregiver Accompaniment.
  4. Advance to Step 3, display data minimization disclosure, check consent, and click **"Submit Emergency Request"**.
  5. Show immediate confirmation: **Case Reference `SHG-2026-XXXX`** with the live pipeline tracker.
- **Presenter (Voiceover):**
  > "A citizen or caregiver enters what is happening in colloquial Bengali, Banglish, or English—by voice or text. Notice we never ask for a medical diagnosis; we ask for functional barriers.
  > Even if network towers go down, our offline-first PWA caches the request locally and clearly states: *'Saved on this device — not yet sent'* so false hope is never given. Upon connection, it syncs instantly."

---

### [1:10 – 1:40] AI Needs Engine & Constrained Resource Matching
- **Visual:** Navigate to the **Coordinator Operations Center** (`/operations`).
  1. Show live KPI telemetry counters (Active Requests, Awaiting Review, Responders).
  2. Click the newly created case in the Priority Queue.
  3. Inspect the right-hand Case Detail Drawer:
     - Show AI extraction card: language identified as `bn`, group size 4, support needs detected.
     - Show **Intelligent Matching Engine Output**:
       - Vehicle: *Dacope Accessible Van Alpha* (Retrofitted Ramp, verified).
       - Shelter: *Dacope Model Cyclone Shelter* (1:12 concrete ramp, 15kVA generator).
       - Rejection note: Shows that closer shelter *Bajua Union Building* was **rejected** because it has 14 steep stairs and no ramp!
- **Presenter (Voiceover):**
  > "In the Operations Center, our AI engine converts conversational Bengali into verified JSON constraints. 
  > Then, our deterministic matching engine applies **7 hard physical constraints**. Look closely: proximity never trumps accessibility. The system bypasses a closer shelter because it has steep stairs, safely routing our wheelchair user to a verified step-free facility.
  > Furthermore, unverified crowdsourced boats are quarantined from the safe dispatch pool."

---

### [1:40 – 2:05] Human Authorization & Field Responder Workflow
- **Visual:**
  1. In Coordinator Operations, click **"Authorize & Dispatch Assignment"**. Show atomic capacity deduction.
  2. Switch to the **Field Responder App** (`/responder`).
  3. Show the incoming case briefing on the mobile viewport with data minimization.
  4. Click **"Accept Assignment"** → click **"Start Response (En Route)"** → click **"Mark Arrived"**.
- **Presenter (Voiceover):**
  > "Crucially, AI never dispatches units alone. An accountable human coordinator reviews the explainability checklist and authorizes the assignment.
  > The field responder receives a data-minimized navigation briefing on their phone. They accept, mark en route, and confirm arrival with atomic server-side validation."

---

### [2:05 – 2:25] Confirmed Delivery & Audit Timeline
- **Visual:**
  1. In the Responder App, click **"Confirm Assistance Delivered"**.
  2. Show the updated case status: **Completed**.
  3. Show the **Event Timeline (Audit Log)** with every timestamp and actor.
  4. Quick peek at `/resources` showing updated shelter headroom and verification tags.
- **Presenter (Voiceover):**
  > "Upon arrival, the responder confirms the family is safely inside the accessible ground-floor shelter ward. 
  > The vehicle is released back to the fleet, the shelter's available headroom updates atomically, and every step is permanently recorded on an immutable audit trail."

---

### [2:25 – 2:30] Closing Vision
- **Visual:** Return to the hero headline of SHONGJOG on desktop.
- **Presenter (Voiceover):**
  > "In an emergency, seconds matter—but dignity and accessibility matter just as much. 
  > SHONGJOG: Because no one should be left behind when help could have reached them. Thank you."


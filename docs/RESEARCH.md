# SHONGJOG — Research & Evidence Dossier
## AI-Powered Inclusive Last-Mile Emergency Access Network
**Hackathon:** CTRL-V 2026  
**Document Revision:** 1.0 (March 2026)  
**Classification:** Evidence Base & Foundational Literature Review

---

## 1. Executive Research Summary

In humanitarian emergency response, the critical vulnerability is rarely the total absence of warnings; it is the **last-mile coordination failure**—the inability to bridge warning issuance, accessible functional need intake, and verified step-free evacuation transport and shelter accommodation. 

Persons with disabilities, older adults living alone, and households dependent on power-operated assistive technology face mortality and injury rates 2 to 4 times higher during extreme hydrometeorological events in coastal Bangladesh and similar global delta environments. 

SHONGJOG is designed not as an official warning broadcaster, but as the **missing assistive coordination layer** that converts unstructured requests into verified, constraint-checked evacuation workflows.

---

## 2. Verified Research Sources & Annotated Bibliography

### 2.1 Global Evidence Base

#### Source 1: UNDRR 2023 Global Survey on Persons with Disabilities and Disasters
- **Publisher / Organization:** United Nations Office for Disaster Risk Reduction (UNDRR)
- **Publication Year:** 2023
- **Official URL:** [UNDRR 2023 Global Survey Report](https://www.undrr.org/report/2023-gobal-survey-report-on-persons-with-disabilities-and-disasters)
- **Key Verified Findings:**
  1. **84%** of persons with disabilities surveyed globally reported having **no personal preparedness plan** for disasters.
  2. Only **11%** reported having an emergency management plan in their jurisdiction that specifically addresses their assistive needs.
  3. Only **17%** of respondents were aware of disaster management plans in their local administrative unit.
  4. **Over 50%** of respondents stated that in the event of an evacuation order, they would be **completely unable to evacuate immediately without external personal assistance**.
- **Relevance to SHONGJOG:** Validates the core problem statement: issuing alerts via SMS or broadcast does not equate to evacuation capability. The missing element is dedicated, matched personal assistance and transport.

#### Source 2: W3C Web Content Accessibility Guidelines (WCAG) 2.2
- **Publisher / Organization:** World Wide Web Consortium (W3C) Web Accessibility Initiative (WAI)
- **Publication Year:** 2023 (WCAG 2.2 Recommendation)
- **Official URL:** [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- **Key Verified Normative Requirements:**
  - **Success Criterion 1.4.3 Contrast (Minimum):** Contrast ratio of at least 4.5:1 for normal text and 3:1 for large text.
  - **Success Criterion 2.1.1 Keyboard Navigation:** All functionality must be operable through a keyboard interface without requiring specific timings for individual keystrokes.
  - **Success Criterion 2.4.7 Focus Visible:** Any keyboard-operable interface must have an operating mode where the keyboard focus indicator is visible.
  - **Success Criterion 2.5.8 Target Size (Minimum):** Touch targets must measure at least 24x24 CSS pixels (SHONGJOG enforces 44x44 CSS pixels for emergency touch targets).
  - **Success Criterion 4.1.3 Status Messages:** Status messages must be programmatically determined via `aria-live` or role attributes so assistive technologies can present them without focus shifts.
- **Relevance to SHONGJOG:** Governs the entire design system of SHONGJOG, ensuring the portal is fully accessible to blind, low-vision, motor-impaired, and neurodivergent individuals under high-stress conditions.

---

### 2.2 Bangladesh-Specific Research & Institutional Context

#### Source 3: Bangladesh Disability-Inclusive and Gender-Responsive Early Warning Systems Study
- **Publisher / Organization:** Center for Disability in Development (CDD), CBM Global Disability Inclusion, PreventionWeb / UNDRR
- **Publication Year:** 2022
- **Official URL:** [PreventionWeb Publication](https://www.preventionweb.net/publication/documents-and-publications/study-disability-inclusive-and-gender-responsive-early)
- **Key Verified Findings:**
  1. Conventional cyclone early-warning dissemination in coastal Bangladesh (sirens, loudspeakers, flags) systematically excludes persons with sensory impairments: sirens fail deaf individuals, while visual flag poles fail blind community members.
  2. Physical accessibility audits in coastal cyclone shelters across Khulna, Satkhira, and Barguna revealed that over **70% of shelters lack functional step-free ramps** or have incline slopes exceeding standard safety thresholds (>1:12), rendering wheelchair access impossible without multiple physical bearers.
  3. Separate accessible sanitary facilities and private spaces for assistive equipment or female caregivers are absent in the majority of union-level shelters.
- **Relevance to SHONGJOG:** Establishes the necessity of strict **hard-constraint matching** for shelters: assigning a wheelchair user to a shelter lacking verified step-free access is dangerous and must be rejected programmatically.

#### Source 4: Extreme Weather Events and Disability Vulnerability in Coastal Bangladesh
- **Publisher / Organization:** National Institutes of Health (NIH) / PubMed Central (PMC12997332)
- **Publication Year:** 2024
- **Official URL:** [PMC12997332](https://pmc.ncbi.nlm.nih.gov/articles/PMC12997332/)
- **Key Verified Findings:**
  1. Field epidemiology studies across the southwest coastal belt (including Dacope, Koyra, and Shyamnagar upazilas in Khulna and Satkhira districts) indicate that during tidal surges and cyclones (e.g., Sidr, Aila, Amphan, Remal), persons with disabilities suffered disproportionate injury and abandonment risks.
  2. Evacuation transport infrastructure in rural coastal unions relies primarily on narrow earthen embankments (*beribadh*) and waterlogged roads, where standard motorized rickshaws or microbuses cannot operate, requiring specialized multi-modal transport dispatch (accessible vans or shallow-draft boats).
  3. Caregiver separation during chaotic transit is a primary source of trauma and post-disaster morbidity.
- **Relevance to SHONGJOG:** Informs our realistic demonstration scenario ("Simulated Coastal Flood Response — Dacope, Khulna") and grounds our resource modeling in genuine local constraints.

#### Source 5: Department of Disaster Management (DDM) AWARE / RAPID Platform
- **Publisher / Organization:** Ministry of Disaster Management and Relief (MoDMR), Government of Bangladesh
- **Platform URL:** [rapid.ddm.gov.bd](https://rapid.ddm.gov.bd/)
- **System Analysis:**
  - The DDM AWARE and RAPID systems provide macro-level institutional disaster coordination, hazard tracking, and government shelter inventories.
  - **Structural Gap:** These platforms operate at the institutional command level (National, District, and Upazila Disaster Management Committees) and do not provide an interactive, last-mile intake channel for individual citizens to specify personalized functional accessibility needs (e.g., wheelchair transport, sign-language assistance, power backup for life-support devices).
- **Relevance to SHONGJOG:** Clarifies SHONGJOG's institutional role: SHONGJOG acts as a complementary, bottom-up community accessibility and coordination layer, feeding verified, actionable accommodation requirements into local coordinators and volunteer networks.

---

### 2.3 Technical Infrastructure & Machine Learning Foundations

#### Source 6: Adaption Labs Developer Platform & APIs
- **Publisher / Organization:** Adaption Labs Inc.
- **Documentation URL:** [docs.adaptionlabs.ai](https://docs.adaptionlabs.ai/)
- **Key Capabilities & Architecture:**
  - High-precision structured extraction and multi-task natural language understanding.
  - Invent-a-Dataset, Adaptive Data, and AutoScientist workflows for domain-specific fine-tuning and evaluation.
  - Programmatic API interfaces accepting natural language payloads and returning strictly validated JSON schemas.
- **Relevance to SHONGJOG:** Powers Module C (AI Needs Understanding Engine), translating colloquial Bengali, English, and Banglish emergency text and transcribed speech into validated `SupportNeed` schemas. Integrates graceful fallback to a deterministic local rule-based engine when `ADAPTION_API_KEY` is not present.

#### Source 7: Google Antigravity Agentic Platform
- **Publisher / Organization:** Google DeepMind / Google Antigravity
- **Documentation URL:** [antigravity.google/docs](https://antigravity.google/docs/)
- **Platform Capabilities:** Autonomous agent orchestration, sandboxed execution, MCP protocol integration, sidecar interactive rendering, and reactive asynchronous event handling.
- **Relevance to SHONGJOG:** The primary build, test, and verification environment for the SHONGJOG platform.

#### Source 8: CTRL-V 2026 Hackathon & Official Guidelines
- **Event URL:** [ctrl-v-hackathon-31831.devpost.com](https://ctrl-v-hackathon-31831.devpost.com/)
- **Official Rules URL:** [ctrl-v-hackathon-31831.devpost.com/rules](https://ctrl-v-hackathon-31831.devpost.com/rules)
- **Judging Criteria:**
  1. **Impact & Problem Significance:** Solves a profound, documented real-world challenge.
  2. **Technical Execution & Architecture:** Robust full-stack implementation, strict typing, automated tests, clean separation of concerns.
  3. **Innovation & Design:** Thoughtful UI/UX, genuine multilingual and accessibility features.
  4. **Reliability & Ethical Safety:** Data minimization, prevention of hallucinated emergency assignments, explainable algorithms, honest simulated disclosures.

---

## 3. Synthesis: Key Design Directives for SHONGJOG

From this empirical evidence base, SHONGJOG derives five non-negotiable architectural axioms:

1. **Functional Needs, Not Medical Diagnostic Labels:** Citizens in acute crisis should never be asked to declare clinical diagnoses or medical histories. SHONGJOG asks for concrete functional barriers: *"Do you need step-free transport?"*, *"Do you need a visual guide?"*, *"Do you require electricity for powered equipment?"*
2. **Hard-Constraint Matching Before Optimization:** Proximity cannot compensate for inaccessibility. A shelter 500 meters away with steep stairs is completely unsuitable for a non-ambulatory wheelchair user; the system must reject this shelter and route to a verified step-free facility even if further away.
3. **Verification As a Hard Safety Gate:** Unverified crowdsourced resources must never be mixed into the standard automated dispatch pool. An unverified boat or shelter could lead evacuees into secondary danger.
4. **Human-in-the-Loop Coordinator Authorization:** AI extracts and classifies unstructured text; deterministic graph/constraint algorithms filter and rank compatible resources; but **only an accountable human coordinator approves the dispatch**.
5. **Radical Transparency & Offline Integrity:** The user interface must never falsely report that an offline cached request has reached emergency responders. When offline, it clearly states *"Saved on this device — not yet sent"* and synchronizes upon reconnection.

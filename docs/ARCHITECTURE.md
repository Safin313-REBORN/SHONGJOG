# SHONGJOG — System Architecture & Technical Specification
## AI-Powered Inclusive Last-Mile Emergency Access Network
**Version:** 1.0 (March 2026)  
**Hackathon:** CTRL-V 2026

---

## 1. High-Level Architecture Overview

SHONGJOG operates as an accessibility and resource-coordination layer that complements national disaster management platforms (such as Bangladesh DDM AWARE) by solving the **last-mile evacuation assistance gap** for persons with disabilities and older adults.

```mermaid
flowchart TD
    subgraph Client["Edge & Client Applications"]
        CitizenPortal["Community Assistance Portal (/request-help)\n- Mobile-First PWA\n- Bengali / English / Banglish\n- Functional Needs Triage\n- Offline IndexedDB Draft Cache"]
        CoordCenter["Coordinator Operations Center (/operations)\n- Live KPI Telemetry\n- Geospatial Interactive Map\n- Explainable Resource Matcher\n- Consequential Dispatch Approval"]
        ResponderApp["Responder Mobile App (/responder)\n- Role-based Case Views\n- Step-by-Step State Machine\n- Data-Minimized Briefings\n- Arrival Confirmation"]
        RegistryMgr["Resource Registry (/resources)\n- Shelters, Vehicles, Teams\n- Verification Lifecycle Gate\n- Capacity & Headroom Tracking"]
    end

    subgraph Server["Server Core (Next.js App Router / Node.js)"]
        APIRoutes["Secure API Endpoints\n(/api/requests, /api/matching, /api/assignments)"]
        
        subgraph Engines["Domain Engines"]
            AIEngine["AI Needs Understanding Engine\n- Adaption Labs API Client\n- Deterministic Heuristic Fallback\n- Zod Schema Sanitization"]
            MatchingEngine["Intelligent Matching Engine\n- 7 Hard Constraints Validator\n- Soft Haversine & Skill Ranker\n- Explainability Generator"]
            StateMachine["Assignment & Reservation Engine\n- Atomic Capacity Deductions\n- Concurrency Protection\n- State Transition Enforcement"]
            AuditEngine["Timeline & Event Auditing\n- Immutable Action Logs\n- Verification State Tracking"]
        end
    end

    subgraph Persistence["Storage & External Providers"]
        SQLiteDB[("Relational Database (Prisma / SQLite)\n- Transactional Boundaries\n- Relational Referential Integrity")]
        AdaptionAPI["Adaption Labs API\n(Structured Extraction & Model Inference)"]
        LocalModel["Deterministic Rule-Based Parser\n(Zero-Dependency Offline Fallback)"]
    end

    CitizenPortal -->|"HTTPS / PWA Sync"| APIRoutes
    CoordCenter -->|"HTTPS / Real-time Poll"| APIRoutes
    ResponderApp -->|"HTTPS State Transitions"| APIRoutes
    RegistryMgr -->|"HTTPS Catalog Ops"| APIRoutes

    APIRoutes --> AIEngine
    APIRoutes --> MatchingEngine
    APIRoutes --> StateMachine
    APIRoutes --> AuditEngine

    AIEngine -->|"Live API (ADAPTION_API_KEY)"| AdaptionAPI
    AIEngine -.->|"Fallback if Unconfigured"| LocalModel

    MatchingEngine --> SQLiteDB
    StateMachine --> SQLiteDB
    AuditEngine --> SQLiteDB
```

---

## 2. Core Architectural Principles

1. **Functional Barriers Over Clinical Labels:**
   We never mandate medical diagnosis or clinical classification. The system captures functional access requirements: *wheelchair step-free, guided visual navigation, visual/textual communication, sign-language, continuous electrical life-support*.
2. **Hard Constraints Before Soft Optimization:**
   In emergency logistics, physical barriers are absolute. Proximity cannot compensate for an inaccessible facility or vehicle. Hard accessibility constraints filter out incompatible resources before soft distance scoring occurs.
3. **Accountable Human Authorization:**
   AI never autonomously dispatches physical units. AI parses ambiguous language into a validated structural hypothesis; mathematical algorithms verify physical constraints; but an accountable human emergency coordinator reviews and authorizes assignments.
4. **Data Minimization & Selective Disclosure:**
   Responders receive only operational navigation details (approximate location, group count, specific physical assistance needed). Medical details and extraneous personal contacts are withheld.
5. **Radical Transparency in Offline and Simulated States:**
   When the user is offline, requests are cached locally in IndexedDB and flagged clearly as *"Saved on this device — not yet sent"*. The system never falsely reports that an offline request has reached responders.

---

## 3. Relational Data Models & Entity Relationships

```mermaid
erDiagram
    AssistanceRequest ||--o{ SupportNeed : requires
    AssistanceRequest ||--o| AIAnalysis : analyzed_by
    AssistanceRequest ||--o| Assignment : fulfilled_by
    AssistanceRequest ||--o{ CaseTimeline : logs
    
    Resource ||--o{ Assignment : assigned_to
    Resource ||--o{ Reservation : reserves
    Resource ||--o| VerificationRecord : verified_by
    
    Shelter ||--|| Resource : extends
    Vehicle ||--|| Resource : extends
    Responder ||--|| Resource : extends

    AssistanceRequest {
        string id PK "SHG-2026-XXXX"
        string status "pending_review | matching | assigned | en_route | arrived | completed | cancelled"
        string urgency "routine | urgent | critical"
        string language "bn | en | banglish"
        int group_size
        string raw_description
        string approximate_location
        float latitude
        float longitude
        string contact_name
        string contact_phone
        boolean consent_given
        datetime created_at
        datetime updated_at
    }

    SupportNeed {
        string id PK
        string request_id FK
        string need_type "wheelchair_transport | step_free_access | guided_assistance | visual_communication | sign_language | power_equipment | caregiver_accompaniment | cognitive_support | other"
        string priority "mandatory | preferred"
        string notes
    }

    Resource {
        string id PK "RES-XXXX"
        string resource_type "vehicle | shelter | responder | equipment"
        string name
        string verification_status "verified | partner_verified | community_reported | unverified | expired"
        boolean is_active
        int total_capacity
        int reserved_capacity
        int current_occupancy
        float latitude
        float longitude
        string contact_info
    }

    Vehicle {
        string id PK
        string resource_id FK
        boolean wheelchair_accessible
        int wheelchair_capacity
        boolean stretcher_capable
        string vehicle_type "van | ambulance | boat | auto_rickshaw | bus"
    }

    Shelter {
        string id PK
        string resource_id FK
        boolean step_free_access
        boolean ramp_available
        boolean accessible_toilets
        boolean power_backup
        boolean separate_female_space
    }

    Responder {
        string id PK
        string resource_id FK
        string organization
        string capabilities_json
        string badge_number
        string current_status "available | en_route | busy | off_duty"
    }

    Assignment {
        string id PK "ASG-XXXX"
        string request_id FK
        string vehicle_id FK
        string shelter_id FK
        string responder_id FK
        string status "assigned | accepted | declined | in_progress | arrived | completed | failed"
        string assigned_by_coordinator
        string decline_reason
        datetime assigned_at
        datetime accepted_at
        datetime completed_at
    }

    CaseTimeline {
        string id PK
        string request_id FK
        string event_type
        string actor_role "citizen | ai_engine | coordinator | responder | system"
        string actor_name
        string details_json
        datetime timestamp
    }
```

---

## 4. End-to-End Interaction Workflows

### 4.1 Citizen Intake to Confirmed Evacuation

```mermaid
sequenceDiagram
    autonumber
    actor Citizen as Citizen / Caregiver
    participant Portal as Assistance Portal (PWA)
    participant API as SHONGJOG API
    participant AI as AI Needs Engine
    participant Matcher as Matching Engine
    actor Coordinator as Emergency Coordinator
    actor Responder as Response Volunteer

    Citizen->>Portal: Enters situation (Voice/Text in Bengali)
    Portal->>API: POST /api/requests (with Consent)
    API->>AI: Analyze natural text (Adaption API / Fallback)
    AI-->>API: Validated JSON Support Needs & Urgency
    API->>API: Persist Request (status: "pending_review")
    API-->>Portal: Return Case ID (SHG-2026-0812)
    Portal-->>Citizen: Show Live Status ("Waiting for Review")

    Coordinator->>API: Open Case in Operations Center
    API->>Matcher: Evaluate Candidates against 7 Hard Constraints
    Matcher-->>API: Verified Safe Match Options + Explanations
    API-->>Coordinator: Present Ranked Candidates (Vehicle, Shelter, Team)
    Coordinator->>API: POST /api/assignments (Approve Dispatch)
    
    API->>API: Atomically Reserve Capacity & Update Status
    API->>Responder: Push Case Briefing (Data-minimized)
    
    Responder->>API: POST /api/assignments/:id/accept
    API-->>Portal: Status Update: "Responder Accepted"
    
    Responder->>API: POST /api/assignments/:id/status (en_route -> arrived)
    API-->>Portal: Status Update: "Assistance Arrived"

    Responder->>API: POST /api/assignments/:id/status (completed)
    API-->>Portal: Status Update: "Assistance Confirmed Delivered"
```

---

## 5. Security, Privacy & Reliability Constraints

1. **Strict Data Minimization:** Private phone numbers and full residential coordinates are accessible only to authenticated coordinators. Field responders receive landmark instructions and functional requirements.
2. **Deterministic Fallbacks:** The platform operates seamlessly regardless of whether `ADAPTION_API_KEY` is present. If absent, the deterministic keyword & rule-based engine activates, and the user interface explicitly displays `"Demo AI mode — simulated fallback"`.
3. **Atomic Concurrency Handling:** SQLite transactions with immediate locks prevent double-booking of vehicles or over-allocation of accessible shelter capacity.
4. **Audited State Transitions:** Responders and coordinators cannot jump status backwards or bypass verification gates. All state mutations are append-only recorded in `CaseTimeline`.

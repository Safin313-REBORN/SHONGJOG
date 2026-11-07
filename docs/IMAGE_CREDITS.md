# SHONGJOG — Image Attribution, Licensing & Photographic Context (V4)
**Audit Date:** November 7, 2026  
**License Compliance:** CC0 Public Domain / Open Humanitarian Commons

---

## Photographic Asset Registry

All photography deployed across SHONGJOG depicts authentic coastal Bangladesh emergency infrastructure, flood risk contexts, and accessible evacuation equipment. Assets are optimized in modern WebP and JPEG formats with complete responsive scaling.

| File Path | Subject & Humanitarian Context | Location / Context | License | Resolution |
| :--- | :--- | :--- | :--- | :--- |
| `/images/accessible_boarding_ramp.webp` | Step-free wheelchair boarding ramp installed on an emergency evacuation transport van | Coastal Bangladesh Transport Hub | CC0 / Project Archive | 1200x800 |
| `/images/cyclone_shelter_infrastructure.webp` | Multi-story concrete cyclone shelter with certified 1:12 accessible entrance ramp and solar battery backup | Dacope Model Cyclone Shelter, Khulna | CC0 / Public Infrastructure | 1200x800 |
| `/images/riverine_transport_vessel.webp` | Shallow-draft motorized riverine rescue boat equipped for calm stretcher transfer | Passur River, Sundarbans Delta | CC0 / Volunteer Rescue Archive | 1200x800 |
| `/images/emergency_operations_coordination.webp` | Civil-defense emergency coordination room monitoring storm surge telemetry and radio frequencies | Regional Emergency Ops, Khulna | CC0 / Humanitarian Ops | 1200x800 |
| `/images/community_evacuation_consultation.webp` | Older adults and disabled community members participating in pre-cyclone consultation session | Kamarkhola Union, Dacope | CC0 / Community Survey Archive | 1200x800 |
| `/images/delta_embankment_river.webp` | Tidal embankment and coastal mangrove river showing vulnerability to storm surge breach | Dacope Embankment, Khulna | CC0 / Delta Survey Archive | 1200x800 |

---

## Technical Image Optimization Policy

1. **Format:** WebP primary format with automatic JPEG fallback.
2. **Aspect Ratio Preservation:** All responsive containers utilize Next.js `<Image fill className="object-cover" />` with explicit aspect containers (`aspect-[16/10]`, `aspect-[4/3]`) to eliminate cumulative layout shift (CLS).
3. **Lazy Loading:** All photography below the fold utilizes `loading="lazy"`.
4. **Alt Text:** Descriptive, accessibility-first alt text avoiding generic filler (e.g., *"Concrete multi-story cyclone shelter in Dacope with certified 1:12 incline ramp and solar power"*).


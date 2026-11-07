import { useSyncExternalStore } from "react";

export type I18nLanguage = "en" | "bn";

export const translations = {
  en: {
    // Navigation & Global Brand
    brand_name: "SHONGJOG",
    brand_tagline: "Inclusive Emergency Access Network",
    motto: "A warning is only useful when everyone can act.",
    nav_home: "Overview",
    nav_request: "Request Assistance",
    nav_operations: "Operations Center",
    nav_responder: "Field Responder",
    nav_resources: "Shelter & Resource Registry",
    demo_badge: "DEMO SIMULATION — NOT A LIVE EMERGENCY",
    reset_demo: "Reset Simulation Data",
    resetting_demo: "Resetting Scenario...",
    reset_confirm: "Reset the simulated scenario and clear all dynamic requests back to baseline?",
    reset_success: "Scenario Reset to Baseline",
    language_toggle_label: "Language: English",
    switch_to_bengali: "বাংলা",
    switch_to_english: "English",
    emergency_call_btn: "Call 999",

    // Alert Banner
    active_alert_banner: "SIMULATED WARNING — Dacope Coastal Surge Signal 7. Response network active.",
    alert_signal: "Signal 7",
    alert_location: "Dacope Coastal Delta, Khulna",

    // Landing Page
    hero_title_1: "A warning is only a beginning.",
    hero_title_2: "Everyone deserves a way to reach safety.",
    hero_desc: "SHONGJOG uses multilingual AI and intelligent resource coordination to make emergency assistance more accessible, accountable and inclusive for people with disabilities and older adults.",
    cta_explore: "Explore the live simulation",
    cta_request: "Request assistance",
    cta_field_app: "Field Responder App",
    hero_stat_1_val: "84%",
    hero_stat_1_lbl: "People with disabilities without personal evacuation plans (UNDRR 2023)",
    hero_stat_2_val: "56%",
    hero_stat_2_lbl: "Official early warnings with inaccessible formats or terminology",
    hero_stat_3_val: "23%",
    hero_stat_3_lbl: "Emergency shelters with certified barrier-free ramps in coastal deltas",

    section_breakdown_title: "Where the System Breaks Down",
    section_breakdown_subtitle: "Standard emergency response assumes able-bodied mobility and centralized digital connectivity. In the last mile, that assumption fails.",
    stage_warning_title: "1. The Warning",
    stage_warning_desc: "Broadcast sirens and SMS are broadcast in high-speed technical terminology without Bengali audio or sign language.",
    stage_evac_title: "2. The Evacuation",
    stage_evac_desc: "Road networks flood. Motorized vehicles without wheelchair locks cannot cross muddy embankments.",
    stage_shelter_title: "3. The Shelter",
    stage_shelter_desc: "Cyclone shelters have raised stairs without 1:12 ramps, leaving wheelchair users stranded at the base.",
    stage_isolation_title: "4. The Isolation",
    stage_isolation_desc: "Unrecorded citizens are presumed safe while coordinators operate on blind assumptions.",

    capabilities_heading: "What Makes SHONGJOG Different",
    capabilities_sub: "Five structural innovations designed specifically for the realities of rural coastal disaster response.",
    cap_1_title: "Multilingual Needs Understanding",
    cap_1_desc: "Accepts colloquial Bengali voice dictation and SMS, identifying implicit mobility, medical, and caregiver constraints.",
    cap_2_title: "Hard Constraint Verification",
    cap_2_desc: "Prevents false promises. Never assigns a vehicle without wheelchair ramps to a non-ambulatory resident.",
    cap_3_title: "Human-in-the-Loop Dispatch",
    cap_3_desc: "AI recommends; licensed coordinators authorize. Complete accountability before any field unit moves.",
    cap_4_title: "Offline-First Resilience",
    cap_4_desc: "PWA caches requests locally. Syncs automatically the moment intermittent cellular connectivity returns.",
    cap_5_title: "Immutable Telemetry Ledger",
    cap_5_desc: "Every status transition, capacity decrement, and milestone is recorded for public post-disaster audit.",

    walkthrough_heading: "Interactive Simulation Sandbox",
    walkthrough_sub: "Experience the complete end-to-end lifecycle of an inclusive emergency dispatch.",

    // Operations Center
    ops_center_title: "Coordinator Operations Center",
    ops_center_subtitle: "Human-in-the-Loop Emergency Resource Dispatch · Dacope, Khulna",
    ops_live_feed: "Live Dispatch Stream",
    ops_search_placeholder: "Search case ID, citizen name, location, or support need...",
    ops_filter_status: "Filter by Status",
    ops_filter_urgency: "Filter by Urgency",
    ops_filter_all: "All Cases",
    ops_btn_map_view: "Map View",
    ops_btn_list_view: "Accessible List",
    ops_btn_simulate_influx: "Simulate Surge Influx",
    ops_sidebar_overview: "Overview",
    ops_sidebar_cases: "Assistance Cases",
    ops_sidebar_dispatch: "Dispatch Control",
    ops_sidebar_gis: "GIS Operations",
    ops_sidebar_activity: "Activity History",
    ops_sidebar_settings: "Duty Settings",
    ops_sidebar_mobile_toggle: "Open Operations Menu",

    kpi_active_cases: "Active Cases",
    kpi_unmatched_needs: "Unmatched Needs",
    kpi_verified_capacity: "Shelter Headroom",
    kpi_active_responders: "Active Responders",
    kpi_cases_desc: "Awaiting review or currently en route",
    kpi_unmatched_desc: "Cases with zero verified safe matches",
    kpi_capacity_desc: "Physically accessible verified spaces",
    kpi_responders_desc: "Deployed volunteer units in field",

    table_col_case_id: "Case Reference",
    table_col_location: "Rendezvous Location",
    table_col_urgency: "Urgency Level",
    table_col_needs: "Support Constraints",
    table_col_group_size: "Group Size",
    table_col_status: "Status",
    table_col_actions: "Action",
    btn_inspect_case: "Review & Match",
    btn_close_drawer: "Close Review",

    stepper_step_1: "1. Intake Review",
    stepper_step_2: "2. Safe Matching",
    stepper_step_3: "3. Coordinator Authorize",
    stepper_step_4: "4. Live Tracking",

    drawer_verified_constraints: "Verified Support Constraints:",
    drawer_matching_output: "Intelligent Matching Engine Output",
    drawer_vehicle_assigned: "Recommended Accessible Vehicle:",
    drawer_shelter_assigned: "Recommended Barrier-Free Shelter:",
    drawer_responder_assigned: "Recommended Field Responder:",
    btn_authorize_dispatch: "Authorize & Dispatch Assignment",
    btn_authorizing: "Authorizing Dispatch...",
    dispatch_success_banner: "Dispatch Authorized & Active with Field Responder.",
    no_safe_match_alert: "CRITICAL: No verified safe resource matches all physical accessibility constraints. Coordinator intervention required.",

    // Citizen Intake (Request Help)
    request_page_title: "Request Emergency Assistance",
    request_page_subtitle: "Accessible emergency intake for people with disabilities, older adults, and caregivers.",
    wizard_step_1: "1. Describe Situation",
    wizard_step_2: "2. Support Needs",
    wizard_step_3: "3. Location & Group",
    wizard_step_4: "4. Confirmation",

    form_description_label: "What is your situation and what assistance is needed?",
    form_description_placeholder: "e.g., We are 3 people at Dacope Bazar near the riverbank. My grandmother is 82 and cannot walk. Water is entering the house.",
    btn_voice_start: "Dictate in Bengali / English",
    btn_voice_recording: "Listening... Speak clearly",
    voice_unsupported: "Voice input is not supported in this browser version. Please type in text directly.",

    presets_title: "Quick Situational Presets (Colloquial Bengali)",
    preset_1: "Wheelchair user stranded, water entering home",
    preset_2: "Elderly resident with cardiac medication need",
    preset_3: "Visually impaired resident alone without evacuation guide",
    preset_4: "Bedridden patient requiring stretcher transport",

    form_needs_title: "Select All Functional Accessibility Constraints:",
    need_wheelchair_ramp: "Wheelchair & Ramp Access",
    need_accessible_vehicle: "Accessible Transport",
    need_medical_support: "Medical Oxygen / Cold-Chain",
    need_elderly_support: "Geriatric / Mobility Support",
    need_visual_guidance: "Visual Guidance / Sighted Guide",
    need_hearing_support: "Hearing / Visual Alerts",
    need_mental_health: "Psychosocial Support",
    need_female_responder: "Female Responder Team",

    form_location_label: "Approximate Location or Nearby Landmark:",
    form_location_placeholder: "e.g., Dacope Bazar High School, Union: Pankhali",
    form_group_size_label: "Total Number of People Evacuating:",
    form_urgency_label: "Perceived Urgency:",
    form_contact_name_label: "Contact Name (Optional):",
    form_contact_name_placeholder: "e.g., Abdul Karim (Caregiver)",
    form_contact_phone_label: "Phone Number (Optional):",
    form_contact_phone_placeholder: "e.g., +8801700000000",
    form_consent_label: "I consent to sharing functional accessibility requirements with verified emergency coordinators.",

    btn_next_step: "Continue to Next Step",
    btn_prev_step: "Previous Step",
    btn_submit_request: "Submit Emergency Request",
    btn_submitting: "Submitting to Dispatch...",

    submission_confirmed_title: "Submission Confirmed",
    submission_confirmed_desc: "Your assistance request has been received by the Dacope Emergency Operations Center. An AI triage engine has extracted functional constraints for human coordinator verification.",
    offline_draft_notice: "Saved on this device — not yet sent",
    offline_draft_desc: "Your request was recorded in local offline cache. When internet connectivity is restored, this terminal will automatically transmit the record to the emergency coordinator pool.",
    draft_reference_label: "Draft Reference:",
    btn_submit_another: "Submit Another Request",
    btn_return_overview: "Return to Operations Overview",

    // Field Responder App
    responder_page_title: "Field Volunteer Mobile Terminal",
    responder_page_subtitle: "Turn-by-turn guidance and barrier-free rendezvous management",
    responder_select_unit: "Select Active Volunteer Unit:",
    responder_status_en_route: "En Route to Rendezvous",
    responder_status_available: "Available on Standby",
    responder_no_active_assignment: "No active field assignment currently allocated to this unit.",
    responder_rendezvous_card_title: "Active Mission Rendezvous",
    btn_open_external_nav: "Open in Google Maps App",
    btn_accept_assignment: "Accept Assignment",
    btn_start_en_route: "Mark En Route",
    btn_confirm_arrival: "Confirm Arrival on Scene",
    btn_complete_mission: "Safely Delivered to Shelter",
    btn_decline_assignment: "Unable to Fulfill / Obstacle",
    modal_decline_title: "Report Field Obstacle or Rejection",
    modal_decline_desc: "Please provide reason so coordinators can immediately re-route alternate resources.",
    modal_decline_reason_label: "Reason for inability to complete:",
    modal_decline_placeholder: "e.g., Road embankment washed away, vehicle cannot pass safely...",
    btn_confirm_decline: "Confirm Re-routing",
    btn_cancel: "Cancel",

    // Shelter & Resource Registry
    resources_page_title: "Accessible Resource & Shelter Ledger",
    resources_page_subtitle: "Physical barrier audit ledger for cyclone shelters, modified boats, and volunteer squads · Dacope, Khulna",
    filter_all_types: "All Resource Types",
    filter_shelters: "Cyclone Shelters",
    filter_vehicles: "Accessible Transport",
    filter_responders: "Responder Units",
    filter_all_verification: "All Verification Levels",
    filter_verified_only: "Verified Safe Only",
    btn_view_grid: "Card Grid",
    btn_view_map: "Interactive Map",
    btn_view_table: "Audit Table",
    headroom_available: "places available",
    ramp_certified: "Ramp: YES (1:12 Certified)",
    ramp_unverified: "Ramp: Missing / Steep (>1:8)",
    btn_verify_asset: "Audit & Verify Facility",
    modal_verify_title: "Physical Accessibility Audit Verification",
    modal_verify_desc: "Update verification grade based on on-site physical barrier inspection.",

    // Google Operations Map
    map_bar_title: "GOOGLE MAPS OPERATIONAL GIS · DACOPE",
    map_btn_roadmap: "Roadmap",
    map_btn_satellite: "Satellite",
    map_btn_terrain: "Terrain",
    map_btn_reset: "Reset View",
    map_btn_open_gmaps: "Open in Google Maps",
    map_key_missing_banner: "Google Maps API Key not set: Rendering official Google Maps coordinate embed directly.",
    map_pinned_coordinates: "Active Pinned Coordinates",
    map_requests_label: "Evacuation Requests",
    map_shelters_label: "Verified Shelters & Assets",

    // Status Names
    status_intake_received: "Intake Received",
    status_ai_parsed: "AI Parsed",
    status_pending_review: "Awaiting Review",
    status_matching: "Matching Resources",
    status_assigned: "Responder Assigned",
    status_accepted: "Mission Accepted",
    status_en_route: "Unit En Route",
    status_in_progress: "In Progress",
    status_arrived: "Arrived on Scene",
    status_completed: "Completed & Safe",
    status_cancelled: "Cancelled",
    status_declined: "Declined / Re-routed",
    status_failed: "Failed / Escalated",

    // Schema Functional Needs
    need_wheelchair_transport: "Wheelchair Transport",
    need_step_free_access: "Step-Free Shelter Access",
    need_guided_assistance: "Guided Visual Assistance",
    need_visual_communication: "Hearing-Accessible Comms",
    need_sign_language: "Sign Language (BdSL)",
    need_power_equipment: "Power for Medical Devices",
    need_caregiver_accompaniment: "Caregiver Accompaniment",
    need_older_adult_assistance: "Older Adult Support",
    need_cognitive_support: "Cognitive / Sensory Calm",
    need_other: "Other Specialized Need",

    // Urgency Names
    urgency_critical: "Critical (Imminent Danger)",
    urgency_urgent: "Urgent (High Vulnerability)",
    urgency_routine: "Routine (Precautionary)",

    // Error & 404 Pages
    error_404_title: "404 — Page Not Found",
    error_404_desc: "The requested emergency resource or coordination view could not be located.",
    error_500_title: "500 — Application Error",
    error_500_desc: "An unexpected error occurred in the coordination runtime. Our telemetry audit system has captured the incident.",
    btn_return_home: "Return to Safe Overview",

    // Footer
    footer_disclosure_title: "Research & Simulation Disclosure:",
    footer_disclosure_text: "SHONGJOG is an AI-powered accessibility research and engineering prototype developed for the CTRL-V 2026 Hackathon. It functions as a complementary coordination layer and does not claim to replace official government early-warning alerts or national emergency services (e.g., Bangladesh National Emergency Hotline 999 or CPP volunteers). All demo personas and contact details are synthetic.",
    footer_core_modules: "Core Modules",
    footer_evidence: "Evidence & References",
    footer_standards: "Accessibility & Ethics",
    footer_rights: "© 2026 SHONGJOG Team — Built with dedication for the CTRL-V 2026 Hackathon.",
    footer_tagline: "Designed for equity and dignity in crisis",
  },
  bn: {
    // Navigation & Global Brand
    brand_name: "সংযোগ",
    brand_tagline: "সবার জন্য দুর্যোগ সহায়তা নেটওয়ার্ক",
    motto: "সতর্কবার্তা তখনই কার্যকর, যখন প্রত্যেকে নিরাপদ আশ্রয়ে পৌঁছাতে পারে।",
    nav_home: "মূল পাতা",
    nav_request: "সহায়তার আবেদন",
    nav_operations: "কন্ট্রোল সেন্টার",
    nav_responder: "মাঠপর্যায়ের রেসপন্ডার",
    nav_resources: "আশ্রয় ও রিসোর্স রেজিস্ট্রি",
    demo_badge: "ডেমো সিমুলেশন — এটি কোনো বাস্তব জরুরি সেবা নয়",
    reset_demo: "সিমুলেশন রিসেট করুন",
    resetting_demo: "রিসেট করা হচ্ছে...",
    reset_confirm: "সিমুলেটেড দৃশ্যপট এবং সব পরিবর্তন রিসেট করে প্রাথমিক অবস্থায় ফিরিয়ে নিতে চান?",
    reset_success: "সিমুলেশন সফলভাবে প্রাথমিক অবস্থায় ফিরেছে",
    language_toggle_label: "ভাষা: বাংলা",
    switch_to_bengali: "বাংলা",
    switch_to_english: "English",
    emergency_call_btn: "কল ৯৯৯",

    // Alert Banner
    active_alert_banner: "সিমুলেটেড বিপদ সংকেত — ডাকোপ উপকূলীয় জলোচ্ছ্বাস ৭ নম্বর বিপদ সংকেত চলমান। স্থানান্তর ব্যবস্থা সক্রিয়।",
    alert_signal: "৭ নম্বর বিপদ সংকেত",
    alert_location: "ডাকোপ উপকূলীয় অঞ্চল, খুলনা",

    // Landing Page
    hero_title_1: "সতর্কবার্তা কেবল একটি সূচনা।",
    hero_title_2: "নিরাপদে পৌঁছানোর অধিকার সবার।",
    hero_desc: "বহুভাষিক কৃত্রিম বুদ্ধিমত্তা ও বুদ্ধিমান রিসোর্স সমন্বয়ের মাধ্যমে প্রতিবন্ধী ব্যক্তি ও প্রবীণদের জন্য নিরাপদ জরুরি স্থানান্তরের কার্যকর মাধ্যম সংযোগ।",
    cta_explore: "সিমুলেশন কন্ট্রোল সেন্টার",
    cta_request: "সহায়তার আবেদন করুন",
    cta_field_app: "মাঠপর্যায়ের রেসপন্ডার অ্যাপ",
    hero_stat_1_val: "৮৪%",
    hero_stat_1_lbl: "প্রতিবন্ধী ব্যক্তির নিজস্ব স্থানান্তর বা উদ্ধার পরিকল্পনা নেই (UNDRR ২০২৩)",
    hero_stat_2_val: "৫৬%",
    hero_stat_2_lbl: "সরকারি আগাম সতর্কবার্তায় অ্যাক্সেসিবল ফরম্যাট বা সহজ ভাষার অভাব",
    hero_stat_3_val: "২৩%",
    hero_stat_3_lbl: "উপকূলীয় বহুমুখী সাইক্লোন শেল্টারে প্রতিবন্ধীবান্ধব উপযুক্ত র‍্যাম্প রয়েছে",

    section_breakdown_title: "যেখানে প্রচলিত ব্যবস্থা ব্যর্থ হয়",
    section_breakdown_subtitle: "সাধারণ উদ্ধার ব্যবস্থা ধরে নেয় সবাই শারীরিকভাবে সক্ষম এবং নিরবচ্ছিন্ন ইন্টারনেট সংযোগ রয়েছে। কিন্তু দুর্যোগের মুহূর্তে এই ধারণা সম্পূর্ণ ভেঙে পড়ে।",
    stage_warning_title: "১. সতর্কবার্তা প্রচার",
    stage_warning_desc: "সাইরেন ও বার্তাগুলো দ্রুতগতির কাঠখোট্টা ভাষায় প্রচারিত হয়; কোনো বাংলা অডিও বা সাইন ল্যাঙ্গুয়েজ থাকে না।",
    stage_evac_title: "২. স্থানান্তর সংকট",
    stage_evac_desc: "যোগাযোগ সড়ক তলিয়ে যায়। সাধারণ গাড়িতে হুইলচেয়ার বা স্ট্রেচার লক ব্যবস্থা না থাকায় কাদার মধ্যে আটকে পড়ে।",
    stage_shelter_title: "৩. শেল্টারের বাধা",
    stage_shelter_desc: "সাইক্লোন শেল্টারের প্রবেশদ্বারে ১:১২ ঢালের র‍্যাম্প না থাকায় হুইলচেয়ার ব্যবহারকারীরা নিচে অসহায় দাঁড়িয়ে থাকেন।",
    stage_isolation_title: "৪. অদৃশ্য সংকট",
    stage_isolation_desc: "নথিবিহীন নাগরিকরা মানচিত্র থেকে বাদ পড়েন; সমন্বয়কারীরা অন্ধ অনুমানের ওপর দায়িত্ব পালন করেন।",

    capabilities_heading: "সংযোগ-এর মূল বৈশিষ্ট্যসমূহ",
    capabilities_sub: "উপকূলীয় গ্রামীণ দুর্যোগ পরিস্থিতির বাস্তবতার ওপর ভিত্তি করে গড়ে তোলা পাঁচটি প্রযুক্তিগত উদ্ভাবন।",
    cap_1_title: "সহজ বাংলা ভাষার প্রয়োজন বিশ্লেষণ",
    cap_1_desc: "কথ্য বাংলা ভয়েস ও এসএমএস বিশ্লেষণ করে শারীরিক সীমাবদ্ধতা, অক্সিজেন ও পরিচর্যাকারীর চাহিদা চিহ্নিত করে।",
    cap_2_title: "বাস্তব অ্যাক্সেসিবিলিটি যাচাই",
    cap_2_desc: "ভুল প্রতিশ্রুতি নয়। র‍্যাম্পবিহীন শেল্টার বা হুইলচেয়ার লক ছাড়া নৌযান কখনো বরাদ্দ করা হয় না।",
    cap_3_title: "মানবিক তত্ত্বাবধানে অনুমোদন",
    cap_3_desc: "এআই কেবল বিকল্প প্রস্তাব করে; দায়িত্বপ্রাপ্ত সমন্বয়কারী অনুমোদন করলেই কেবল মাঠের দল যাত্রা শুরু করে।",
    cap_4_title: "ইন্টারনেটবিহীন অফলাইন প্রযুক্তি",
    cap_4_desc: "মোবাইলে ইন্টারনেট না থাকলেও আবেদন জমা থাকে; সংযোগ আসামাত্র স্বয়ংক্রিয়ভাবে সেন্টারে সিঙ্ক হয়।",
    cap_5_title: "অপরিবর্তনযোগ্য অডিট ট্রেইল",
    cap_5_desc: "প্রতিটি উদ্ধার বরাদ্দ, আসন রিজার্ভেশন ও অগ্রগতি স্বচ্ছভাবে ভবিষ্যতে মূল্যায়নের জন্য সংরক্ষিত থাকে।",

    walkthrough_heading: "সরাসরি ইন্টারেক্টিভ সিমুলেশন",
    walkthrough_sub: "একটি অন্তর্ভুক্তিমূলক জরুরি উদ্ধার অভিযানের শুরু থেকে শেষ পর্যন্ত সম্পূর্ণ প্রক্রিয়াটি দেখুন।",

    // Operations Center
    ops_center_title: "সমন্বয়কারী কন্ট্রোল সেন্টার",
    ops_center_subtitle: "দায়িত্বশীল সমন্বয় ও সম্পদ বরাদ্দ কন্ট্রোল রুম · ডাকোপ, খুলনা",
    ops_live_feed: "লাইভ ডিসপ্যাচ ফিড",
    ops_search_placeholder: "কেস আইডি, নাগরিকের নাম, এলাকা বা সহায়তার ধরন দিয়ে খুঁজুন...",
    ops_filter_status: "অবস্থা অনুযায়ী ফিল্টার",
    ops_filter_urgency: "জরুরিতা অনুযায়ী ফিল্টার",
    ops_filter_all: "সকল কেস",
    ops_btn_map_view: "ম্যাপ ভিউ",
    ops_btn_list_view: "সহজ তালিকা",
    ops_btn_simulate_influx: "নতুন অনুরোধ সিমুলেশন",
    ops_sidebar_overview: "সারসংক্ষেপ",
    ops_sidebar_cases: "সহায়তার কেসসমূহ",
    ops_sidebar_dispatch: "ডিসপ্যাচ কন্ট্রোল",
    ops_sidebar_gis: "জিআইএস ম্যাপ",
    ops_sidebar_activity: "কার্যক্রম লগ",
    ops_sidebar_settings: "ডিউটি সেটিংস",
    ops_sidebar_mobile_toggle: "কন্ট্রোল মেনু খুলুন",

    kpi_active_cases: "সক্রিয় কেসসমূহ",
    kpi_unmatched_needs: "অমীমাংসিত চাহিদা",
    kpi_verified_capacity: "নিরাপদ আশ্রয় ক্ষমতা",
    kpi_active_responders: "মাঠপর্যায়ের দল",
    kpi_cases_desc: "পর্যালোচনার অপেক্ষায় বা উদ্ধার চলমান",
    kpi_unmatched_desc: "উপযুক্ত নিরাপদ যান বা আশ্রয় অমিল",
    kpi_capacity_desc: "র‍্যাম্পযুক্ত প্রত্যয়িত খালি স্থান",
    kpi_responders_desc: "মাঠে কর্মরত স্বেচ্ছাসেবক ইউনিট",

    table_col_case_id: "কেস রেফারেন্স",
    table_col_location: "মিলনস্থল / এলাকা",
    table_col_urgency: "জরুরিতা",
    table_col_needs: "সহায়তার ধরন",
    table_col_group_size: "সদস্য সংখ্যা",
    table_col_status: "অবস্থা",
    table_col_actions: "পদক্ষেপ",
    btn_inspect_case: "পর্যালোচনা ও মেলানো",
    btn_close_drawer: "ড্রয়ার বন্ধ করুন",

    stepper_step_1: "১. কেস পর্যালোচনা",
    stepper_step_2: "২. নিরাপদ মেলানো",
    stepper_step_3: "৩. সমন্বয়ক অনুমোদন",
    stepper_step_4: "৪. উদ্ধার ট্র্যাকিং",

    drawer_verified_constraints: "যাচাইকৃত শারীরিক সীমাবদ্ধতা:",
    drawer_matching_output: "বুদ্ধিমান ম্যাচিং ইঞ্জিনের ফলাফল",
    drawer_vehicle_assigned: "প্রস্তাবিত অ্যাক্সেসিবল যান:",
    drawer_shelter_assigned: "প্রস্তাবিত নিরাপদ সাইক্লোন শেল্টার:",
    drawer_responder_assigned: "প্রস্তাবিত উদ্ধারকারী দল:",
    btn_authorize_dispatch: "উদ্ধার অভিযান অনুমোদন করুন",
    btn_authorizing: "অনুমোদন করা হচ্ছে...",
    dispatch_success_banner: "অভিযান অনুমোদিত হয়েছে এবং উদ্ধারকারী দল অবহিত হয়েছে।",
    no_safe_match_alert: "সতর্কতা: এই কেসের সব শারীরিক শর্ত পূরণ করে এমন কোনো যাচাইকৃত নিরাপদ সম্পদ খালি নেই। সমন্বয়কের সরাসরি হস্তক্ষেপ প্রয়োজন।",

    // Citizen Intake (Request Help)
    request_page_title: "জরুরি সহায়তার আবেদন",
    request_page_subtitle: "প্রতিবন্ধী ব্যক্তি, প্রবীণ ও তাদের পরিচর্যাকারীদের জন্য সহজে ব্যবহারযোগ্য জরুরি সেবা ফর্ম।",
    wizard_step_1: "১. পরিস্থিতি বর্ণনা",
    wizard_step_2: "২. সহায়তার চাহিদা",
    wizard_step_3: "৩. স্থান ও সদস্য",
    wizard_step_4: "৪. আবেদন নিশ্চিতকরণ",

    form_description_label: "আপনার বর্তমান পরিস্থিতি ও কী ধরণের সহায়তা প্রয়োজন তা বলুন বা লিখুন:",
    form_description_placeholder: "যেমন: আমরা ডাকোপ বাজারের কাছে ওয়াপদা বাঁধে ৩ জন আছি। আমার দাদি হাঁটতে পারেন না, পানি ঘরের ভেতর উঠছে। গাড়ি বা নৌকা দরকার।",
    btn_voice_start: "বাংলায় মুখে বলুন (ভয়েস)",
    btn_voice_recording: "শুনছি... স্পষ্টভাবে বলুন",
    voice_unsupported: "আপনার ব্রাউজারে সরাসরি ভয়েস টাইপিং সমর্থিত নয়। অনুগ্রহ করে লিখে জানান।",

    presets_title: "সহজ পরিস্থিতি নির্বাচন (কথ্য বাংলা প্রিসেট)",
    preset_1: "হুইলচেয়ার ব্যবহারকারী, পানি ঘরে ঢুকছে, বের হতে পারছি না",
    preset_2: "প্রবীণ সদস্য, হৃদরোগের জরুরি ওষুধ দরকার",
    preset_3: "দৃষ্টিপ্রতিবন্ধী সদস্য একা আছেন, পথ দেখানোর কেউ নেই",
    preset_4: "শয্যাশায়ী রোগী, স্ট্রেচারে বহনযোগ্য যান প্রয়োজন",

    form_needs_title: "শারীরিক ও লজিস্টিক সীমাবদ্ধতা নির্বাচন করুন:",
    need_wheelchair_ramp: "হুইলচেয়ার ও র‍্যাম্প সুবিধা",
    need_accessible_vehicle: "বিশেষ অ্যাক্সেসিবল যানবাহন",
    need_medical_support: "জরুরি ওষুধ ও অক্সিজেন",
    need_elderly_support: "প্রবীণ / শারীরিক দুর্বলতা",
    need_visual_guidance: "দৃষ্টিসহায়তা ও পথপ্রদর্শক",
    need_hearing_support: "শ্রবণসহায়তা ও চাক্ষুষ সতর্কবার্তা",
    need_mental_health: "মানসিক স্বাস্থ্য ও ট্রমা সাপোর্ট",
    need_female_responder: "নারী উদ্ধারকারী দল",

    form_location_label: "বর্তমান অবস্থান বা পরিচিত স্থান:",
    form_location_placeholder: "যেমন: ডাকোপ বাজার সরকারি প্রাথমিক বিদ্যালয় সংলগ্ন, পানখালী",
    form_group_size_label: "মোট সদস্য সংখ্যা:",
    form_urgency_label: "জরুরিতা বিবেচনা:",
    form_contact_name_label: "যোগাযোগকারীর নাম (ঐচ্ছিক):",
    form_contact_name_placeholder: "যেমন: আব্দুল করিম (পরিচর্যাকারী)",
    form_contact_phone_label: "মোবাইল নম্বর (ঐচ্ছিক):",
    form_contact_phone_placeholder: "যেমন: ০১৭০০০০০০০০",
    form_consent_label: "উদ্ধার ও আশ্রয়ের সুবিধার্থে সমন্বয়কদের সাথে শারীরিক সহায়তার তথ্য শেয়ার করতে সম্মতি দিচ্ছি।",

    btn_next_step: "পরবর্তী ধাপে যান",
    btn_prev_step: "পূর্ববর্তী ধাপ",
    btn_submit_request: "জরুরি আবেদন জমা দিন",
    btn_submitting: "পাঠানো হচ্ছে...",

    submission_confirmed_title: "আবেদন সফলভাবে গৃহীত হয়েছে",
    submission_confirmed_desc: "আপনার অনুরোধ ডাকোপ জরুরি কন্ট্রোল সেন্টারে পৌঁছেছে। কৃত্রিম বুদ্ধিমত্তা আপনার সহায়তার শর্তগুলো শনাক্ত করেছে এবং মানবিক সমন্বয়কারী দ্রুত পদক্ষেপ নিচ্ছেন।",
    offline_draft_notice: "এই ডিভাইসে সংরক্ষিত — এখনো ইন্টারনেটে পাঠানো হয়নি",
    offline_draft_desc: "আপনার এলাকায় মোবাইল নেটওয়ার্ক বন্ধ থাকায় আবেদনটি ডিভাইসে সুরক্ষিত আছে। ইন্টারনেট সংযোগ আসামাত্র এটি সমন্বয় সেন্টারে চলে যাবে।",
    draft_reference_label: "ড্রাফট নম্বর:",
    btn_submit_another: "আরেকটি আবেদন জমা দিন",
    btn_return_overview: "কন্ট্রোল সেন্টার ড্যাশবোর্ডে ফিরুন",

    // Field Responder App
    responder_page_title: "মাঠপর্যায়ের রেসপন্ডার মোবাইল অ্যাপ",
    responder_page_subtitle: "সরাসরি মিলনস্থল ও অ্যাক্সেসিবল উদ্ধার অভিযান পরিচালনা",
    responder_select_unit: "স্বেচ্ছাসেবক ইউনিট পরিবর্তন করুন:",
    responder_status_en_route: "ঘটনাস্থলের দিকে যাত্রা চলমান",
    responder_status_available: "স্ট্যান্ডবাই অবস্থায় প্রস্তুত",
    responder_no_active_assignment: "এই ইউনিটে বর্তমানে কোনো সক্রিয় উদ্ধার দায়িত্ব নির্ধারিত নেই।",
    responder_rendezvous_card_title: "সক্রিয় উদ্ধার অভিযান ও মিলনস্থল",
    btn_open_external_nav: "গুগল ম্যাপে দিকনির্দেশনা দেখুন",
    btn_accept_assignment: "দায়িত্ব গ্রহণ করুন",
    btn_start_en_route: "রওয়ানা হয়েছি",
    btn_confirm_arrival: "ঘটনাস্থলে পৌঁছেছি",
    btn_complete_mission: "নিরাপদ আশ্রয়ে স্থানান্তর সম্পন্ন",
    btn_decline_assignment: "অপারগতা / পথে প্রাকৃতিক বাধা",
    modal_decline_title: "বাধা বা অপারগতার কারণ জানান",
    modal_decline_desc: "কারণ উল্লেখ করুন যাতে সমন্বয়কারী অবিলম্বে বিকল্প ইউনিট পাঠাতে পারেন।",
    modal_decline_reason_label: "অপারগতার কারণ:",
    modal_decline_placeholder: "যেমন: ওয়াপদা বাঁধের রাস্তা ভেঙে গেছে, ট্রলার বা নৌকা দরকার...",
    btn_confirm_decline: "পুনঃবরাদ্দের জন্য নিশ্চিত করুন",
    btn_cancel: "বাতিল",

    // Shelter & Resource Registry
    resources_page_title: "অ্যাক্সেসিবল সম্পদ ও আশ্রয়কেন্দ্র রেজিস্ট্রি",
    resources_page_subtitle: "সাইক্লোন শেল্টার, বিশেষায়িত যান ও উদ্ধারকারী দলের শারীরিক অ্যাক্সেসিবিলিটি অডিট হিসাব · ডাকোপ, খুলনা",
    filter_all_types: "সকল প্রকার সম্পদ",
    filter_shelters: "সাইক্লোন শেল্টার",
    filter_vehicles: "স্থানান্তর যান",
    filter_responders: "রেসপন্ডার দল",
    filter_all_verification: "সকল প্রত্যয়ন মাত্রা",
    filter_verified_only: "কেবল সম্পূর্ণ নিরাপদ ও প্রত্যয়িত",
    btn_view_grid: "কার্ড গ্রিড",
    btn_view_map: "ইন্টারেক্টিভ ম্যাপ",
    btn_view_table: "অডিট টেবিল",
    headroom_available: "টি স্থান খালি",
    ramp_certified: "র‍্যাম্প: আছে (১:১২ আন্তর্জাতিক মানসম্পন্ন)",
    ramp_unverified: "র‍্যাম্প: নেই বা অতিরিক্ত খাড়া (>১:৮)",
    btn_verify_asset: "স্থান সরেজমিনে অডিট করুন",
    modal_verify_title: "শারীরিক অ্যাক্সেসিবিলিটি অডিট প্রত্যয়ন",
    modal_verify_desc: "সরেজমিনে পরিদর্শনের ভিত্তিতে স্থাপনার অ্যাক্সেসিবিলিটি মান আপডেট করুন।",

    // Google Operations Map
    map_bar_title: "গুগল ম্যাপস অপারেশনাল জিআইএস · ডাকোপ",
    map_btn_roadmap: "সাধারণ ম্যাপ",
    map_btn_satellite: "স্যাটেলাইট",
    map_btn_terrain: "ভূপ্রকৃতি (টেরেইন)",
    map_btn_reset: "ভিউ রিসেট",
    map_btn_open_gmaps: "গুগল ম্যাপস অ্যাপে খুলুন",
    map_key_missing_banner: "গুগল ম্যাপস এপিআই কি ছাড়া সরাসরি অফিসিয়াল গুগল ম্যাপস এমবেড প্রদর্শিত হচ্ছে।",
    map_pinned_coordinates: "চিহ্নিত স্থানসমূহ",
    map_requests_label: "সহায়তার আবেদনসমূহ",
    map_shelters_label: "যাচাইকৃত আশ্রয় ও সম্পদ",

    // Status Names
    status_intake_received: "অনুরোধ গৃহীত",
    status_ai_parsed: "এআই বিশ্লেষিত",
    status_pending_review: "পর্যালোচনার অপেক্ষায়",
    status_matching: "সম্পদ মেলানো হচ্ছে",
    status_assigned: "রেসপন্ডার নির্ধারিত",
    status_accepted: "দায়িত্ব গৃহীত",
    status_en_route: "ইউনিট রওয়ানা হয়েছে",
    status_in_progress: "উদ্ধার চলমান",
    status_arrived: "ঘটনাস্থলে পৌঁছেছেন",
    status_completed: "নিরাপদে স্থানান্তর সম্পন্ন",
    status_cancelled: "বাতিলকৃত",
    status_declined: "প্রত্যাখ্যাত / বিকল্প বরাদ্দ",
    status_failed: "ব্যর্থ / জরুরি পুনর্বিবেচনা",

    // Schema Functional Needs
    need_wheelchair_transport: "হুইলচেয়ার পরিবহন",
    need_step_free_access: "ধাপহীন আশ্রয়কেন্দ্র প্রবেশ",
    need_guided_assistance: "দৃষ্টিপ্রতিবন্ধী নির্দেশিত সহায়তা",
    need_visual_communication: "শ্রবণপ্রতিবন্ধী ভিজ্যুয়াল যোগাযোগ",
    need_sign_language: "বাংলা ইশারা ভাষা (বিডিএসএল)",
    need_power_equipment: "চিকিৎসা সরঞ্জামের বিদ্যুৎ সরবরাহ",
    need_caregiver_accompaniment: "পরিচর্যাদাতার উপস্থিতি",
    need_older_adult_assistance: "প্রবীণ নাগরিক সহায়তা",
    need_cognitive_support: "সংবেদনশীল ও স্নায়বিক শান্ত পরিবেশ",
    need_other: "অন্যান্য বিশেষ সুবিধা",

    // Urgency Names
    urgency_critical: "জীবনঝুঁকি (অবিলম্বে স্থানান্তর)",
    urgency_urgent: "উচ্চ অগ্রাধিকার (জরুরি)",
    urgency_routine: "নিয়মিত (সতর্কতামূলক স্থানান্তর)",

    // Error & 404 Pages
    error_404_title: "৪০৪ — পৃষ্ঠাটি পাওয়া যায়নি",
    error_404_desc: "আপনার অনুরোধকৃত পৃষ্ঠা বা সমন্বয় ইন্টারফেসটি খুঁজে পাওয়া যায়নি।",
    error_500_title: "৫০০ — সিস্টেম সমস্যা",
    error_500_desc: "সমন্বয় সিস্টেমে সাময়িক সমস্যা দেখা দিয়েছে। আমাদের অডিট সিস্টেমে ত্রুটি রেকর্ড করা হয়েছে।",
    btn_return_home: "মূল কন্ট্রোল সেন্টারে ফিরুন",

    // Footer
    footer_disclosure_title: "গবেষণা ও ডেমো সিমুলেশন ডিসক্লোজার:",
    footer_disclosure_text: "সংযোগ (SHONGJOG) হলো CTRL-V 2026 হ্যাকাথনের জন্য তৈরি একটি গবেষণা ও প্রযুক্তিগত প্রোটোটাইপ। এটি সহায়ক সমন্বয় হিসেবে কাজ করে এবং কোনোভাবেই সরকারি জরুরি সংকেত বা জাতীয় জরুরি সেবা (যেমন: জাতীয় হেল্পলাইন ৯৯৯ বা সিপিপি স্বেচ্ছাসেবক দল)-এর বিকল্প নয়। ডেমো ব্যক্তির নাম ও ফোন নম্বর সম্পূর্ণ প্রতীকী।",
    footer_core_modules: "মূল মডিউলসমূহ",
    footer_evidence: "উৎস ও প্রমাণাদি",
    footer_standards: "অ্যাক্সেসিবিলিটি ও নৈতিকতা",
    footer_rights: "© ২০২৬ সংযোগ টিম — CTRL-V ২০২৬ হ্যাকাথনের জন্য নিবেদিতপ্রাণভাবে নির্মিত।",
    footer_tagline: "দুর্যোগের মুহূর্তে সবার জন্য মর্যাদা ও সমান অধিকার",
  },
};

export type TranslationKey = keyof typeof translations.en;

function subscribeLang(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("shongjog_lang_change", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("shongjog_lang_change", callback);
    window.removeEventListener("storage", callback);
  };
}

function getLangSnapshot(): I18nLanguage {
  if (typeof window === "undefined") return "en";
  const saved = localStorage.getItem("shongjog_lang");
  return saved === "bn" ? "bn" : "en";
}

function getLangServerSnapshot(): I18nLanguage {
  return "en";
}

/**
 * Universal hook for bilingual language switching with zero cascading renders
 */
export function useTranslation() {
  const lang = useSyncExternalStore(subscribeLang, getLangSnapshot, getLangServerSnapshot);

  const t = (key: TranslationKey | string, fallback?: string): string => {
    const langDict = translations[lang] as Record<string, string>;
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    const enDict = translations.en as Record<string, string>;
    if (enDict && enDict[key]) {
      return enDict[key];
    }
    return fallback || key;
  };

  const setLang = (newLang: I18nLanguage) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("shongjog_lang", newLang);
        document.cookie = `shongjog_lang=${newLang}; path=/; max-age=31536000; SameSite=Lax`;
      } catch {
        // Fallback if localStorage or cookies are restricted
      }
      window.dispatchEvent(new Event("shongjog_lang_change"));
      document.documentElement.lang = newLang;
      if (newLang === "bn") {
        document.documentElement.classList.add("lang-bn");
      } else {
        document.documentElement.classList.remove("lang-bn");
      }
    }
  };

  return { lang, t, setLang };
}

/**
 * Convert Latin numerals to authentic Bengali numeral glyphs
 */
export function toBengaliNumber(val: number | string): string {
  const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return String(val).replace(/[0-9]/g, (digit) => bengaliDigits[parseInt(digit, 10)]);
}

/**
 * Format numbers according to active language using locale-aware Intl.NumberFormat
 */
export function formatNumber(val: number | string, lang: I18nLanguage): string {
  if (typeof val === "number" && !isNaN(val)) {
    if (lang === "bn") {
      try {
        return new Intl.NumberFormat("bn-BD").format(val);
      } catch {
        return toBengaliNumber(val);
      }
    }
    return new Intl.NumberFormat("en-US").format(val);
  }
  if (typeof val === "string") {
    const trimmed = val.trim();
    if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
      const num = Number(trimmed);
      if (!isNaN(num)) {
        if (lang === "bn") {
          try {
            return new Intl.NumberFormat("bn-BD").format(num);
          } catch {
            return toBengaliNumber(val);
          }
        }
        return new Intl.NumberFormat("en-US").format(num);
      }
    }
    if (lang === "bn") {
      return toBengaliNumber(val);
    }
    return val;
  }
  return String(val);
}

/**
 * Translate dynamic assistance case and assignment status
 */
export function translateStatus(status: string, lang: I18nLanguage): string {
  const dict = translations[lang] as Record<string, string>;
  const key = `status_${status.toLowerCase()}`;
  return dict[key] || translations.en[key as TranslationKey] || status;
}

/**
 * Translate dynamic urgency level
 */
export function translateUrgency(urgency: string, lang: I18nLanguage): string {
  const dict = translations[lang] as Record<string, string>;
  const key = `urgency_${urgency.toLowerCase()}`;
  return dict[key] || translations.en[key as TranslationKey] || urgency;
}

/**
 * Translate dynamic support need types
 */
export function translateNeed(need: string, lang: I18nLanguage): string {
  const dict = translations[lang] as Record<string, string>;
  const key = `need_${need.toLowerCase()}`;
  return dict[key] || translations.en[key as TranslationKey] || need.replace(/_/g, " ");
}

/**
 * Translate resource types
 */
export function translateResourceType(type: string, lang: I18nLanguage): string {
  if (lang === "bn") {
    switch (type.toLowerCase()) {
      case "shelter":
        return "সাইক্লোন শেল্টার";
      case "vehicle":
        return "স্থানান্তর যান";
      case "responder":
        return "রেসপন্ডার ইউনিট";
      default:
        return type;
    }
  }
  switch (type.toLowerCase()) {
    case "shelter":
      return "Cyclone Shelter";
    case "vehicle":
      return "Accessible Vehicle";
    case "responder":
      return "Responder Unit";
    default:
      return type;
  }
}

/**
 * Translate verification grades
 */
export function translateVerification(status: string, lang: I18nLanguage): string {
  if (lang === "bn") {
    switch (status) {
      case "verified":
        return "যাচাইকৃত নিরাপদ";
      case "partner_verified":
        return "সহযোগী সংস্থা দ্বারা যাচাইকৃত";
      case "unverified":
        return "যাচাইবিহীন";
      default:
        return status;
    }
  }
  switch (status) {
    case "verified":
      return "Verified Safe";
    case "partner_verified":
      return "Partner Verified";
    case "unverified":
      return "Unverified";
    default:
      return status;
  }
}

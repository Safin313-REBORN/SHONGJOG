"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Radio,
  Truck,
  Building2,
  Users,
  CheckCircle,
  Clock,
  Sparkles,
  FileCheck2,
  Activity,
  Layers,
  HeartHandshake,
} from "lucide-react";
import AnimatedHeroMap from "@/components/AnimatedHeroMap";
import { I18nLanguage, translations } from "@/lib/i18n";

export default function LandingPage() {
  const [lang, setLang] = useState<I18nLanguage>("en");

  useEffect(() => {
    const updateLang = () => {
      const saved = (localStorage.getItem("shongjog_lang") as I18nLanguage) || "en";
      setLang(saved);
    };
    updateLang();
    window.addEventListener("shongjog_lang_change", updateLang);
    return () => window.removeEventListener("shongjog_lang_change", updateLang);
  }, []);

  const t = translations[lang];

  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION */}
      <section className="relative hero-gradient text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-[#103B48] overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#0B766E]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 bg-[#103B48] border border-[#0B766E] text-[#63DEC2] px-3 py-1 rounded-full text-xs font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                <span>CTRL-V 2026 Hackathon Master Build</span>
              </div>

              <div className="space-y-2">
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                  {t.hero_title_1}
                </h1>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#63DEC2]">
                  {t.hero_title_2}
                </h2>
              </div>

              <p className="text-base sm:text-lg text-[#DBE6E2] leading-relaxed max-w-xl">
                {t.hero_desc}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/operations"
                  className="inline-flex items-center gap-2 bg-[#0B766E] hover:bg-[#159B82] text-white px-6 py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-[#0B766E]/25 transition transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#63DEC2]"
                >
                  <Radio className="w-4 h-4 text-[#63DEC2]" />
                  <span>{t.cta_explore}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/request-help"
                  className="inline-flex items-center gap-2 bg-[#D9534F] hover:bg-[#c4413d] text-white px-6 py-3.5 rounded-xl font-bold text-sm shadow-md transition transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-white"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>{t.cta_request}</span>
                </Link>
              </div>

              {/* Micro proof points */}
              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs text-[#DBE6E2]/80">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-[#63DEC2]" />
                  <span>Bengali, Banglish & English</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-[#63DEC2]" />
                  <span>7 Hard Physical Constraints</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-[#63DEC2]" />
                  <span>Human-in-the-Loop Coordinator</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Animated Map */}
            <div className="lg:col-span-6">
              <AnimatedHeroMap />
            </div>
          </div>
        </div>
      </section>

      {/* ROLE-BASED QUICK ENTRY CARDS */}
      <section className="bg-[#F4F7F6] py-12 px-4 sm:px-6 lg:px-8 border-b border-[#DBE6E2]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h3 className="text-xs uppercase tracking-wider font-bold text-[#0B766E]">
              Role-Based Operational Access
            </h3>
            <p className="text-2xl font-bold text-[#142D36] mt-1">
              Choose your role in the evacuation network
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Role 1 */}
            <Link
              href="/request-help"
              className="bg-white p-6 rounded-2xl border border-[#DBE6E2] shadow-sm hover:shadow-md hover:border-[#0B766E] transition group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#D9534F]/10 flex items-center justify-center text-[#D9534F] mb-4 group-hover:scale-110 transition">
                  <Users className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-lg text-[#142D36] group-hover:text-[#0B766E] transition">
                  Citizen or Caregiver
                </h4>
                <p className="text-xs text-[#60747A] mt-2 leading-relaxed">
                  Submit accessible assistance requirements (voice/text, Bengali/Banglish/English). Works offline.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#DBE6E2]/50 flex items-center text-xs font-bold text-[#D9534F]">
                <span>Submit Request</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </Link>

            {/* Role 2 */}
            <Link
              href="/operations"
              className="bg-white p-6 rounded-2xl border border-[#DBE6E2] shadow-sm hover:shadow-md hover:border-[#0B766E] transition group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#0B766E]/10 flex items-center justify-center text-[#0B766E] mb-4 group-hover:scale-110 transition">
                  <Radio className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-lg text-[#142D36] group-hover:text-[#0B766E] transition">
                  Emergency Coordinator
                </h4>
                <p className="text-xs text-[#60747A] mt-2 leading-relaxed">
                  Monitor live GIS map, evaluate explainable matches, and authorize verified vehicle & shelter dispatches.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#DBE6E2]/50 flex items-center text-xs font-bold text-[#0B766E]">
                <span>Open Operations</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </Link>

            {/* Role 3 */}
            <Link
              href="/responder"
              className="bg-white p-6 rounded-2xl border border-[#DBE6E2] shadow-sm hover:shadow-md hover:border-[#0B766E] transition group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#159B82]/10 flex items-center justify-center text-[#159B82] mb-4 group-hover:scale-110 transition">
                  <Truck className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-lg text-[#142D36] group-hover:text-[#0B766E] transition">
                  Field Responder
                </h4>
                <p className="text-xs text-[#60747A] mt-2 leading-relaxed">
                  Mobile-first task views for rescue drivers and volunteers: accept, en route, arrived, confirm delivered.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#DBE6E2]/50 flex items-center text-xs font-bold text-[#159B82]">
                <span>Field Portal</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </Link>

            {/* Role 4 */}
            <Link
              href="/resources"
              className="bg-white p-6 rounded-2xl border border-[#DBE6E2] shadow-sm hover:shadow-md hover:border-[#0B766E] transition group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#ECAF42]/10 flex items-center justify-center text-[#ECAF42] mb-4 group-hover:scale-110 transition">
                  <Building2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-lg text-[#142D36] group-hover:text-[#0B766E] transition">
                  Shelter & Asset Registry
                </h4>
                <p className="text-xs text-[#60747A] mt-2 leading-relaxed">
                  Track wheelchair ramps, generator power, capacity headroom, and multi-tier verification statuses.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#DBE6E2]/50 flex items-center text-xs font-bold text-[#ECAF42]">
                <span>View Registry</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 1 & 2: THE ACCESSIBILITY REALITY & EVIDENCE-BACKED RESEARCH */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-b border-[#DBE6E2]">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-12">
            <span className="text-xs uppercase tracking-wider font-bold text-[#0B766E]">
              Ground Reality & Literature Review
            </span>
            <h2 className="text-3xl font-extrabold text-[#142D36] mt-2">
              Why emergency warnings fail vulnerable communities
            </h2>
            <p className="text-[#60747A] mt-3 leading-relaxed">
              When a cyclone or flood siren wails in coastal Bangladesh, getting to safety is not a matter of willingness—it is a physical, architectural, and communicative barrier.
            </p>
          </div>

          {/* 4 Research Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#F4F7F6] p-6 rounded-2xl border-l-4 border-l-[#D9534F] border border-[#DBE6E2]">
              <div className="text-3xl font-black text-[#D9534F]">84%</div>
              <h4 className="font-bold text-sm text-[#142D36] mt-1">No Personal Disaster Plan</h4>
              <p className="text-xs text-[#60747A] mt-2 leading-relaxed">
                Globally, 84% of persons with disabilities have no individualized evacuation plan for rapid-onset disasters.
              </p>
              <div className="mt-4 pt-2 border-t border-[#DBE6E2] text-[11px] text-[#0B766E] font-medium">
                UNDRR 2023 Global Survey
              </div>
            </div>

            <div className="bg-[#F4F7F6] p-6 rounded-2xl border-l-4 border-l-[#ECAF42] border border-[#DBE6E2]">
              <div className="text-3xl font-black text-[#ECAF42]">&gt;50%</div>
              <h4 className="font-bold text-sm text-[#142D36] mt-1">Unable to Evacuate Alone</h4>
              <p className="text-xs text-[#60747A] mt-2 leading-relaxed">
                More than half of surveyed persons with disabilities cannot evacuate without immediate, dedicated external assistance.
              </p>
              <div className="mt-4 pt-2 border-t border-[#DBE6E2] text-[11px] text-[#0B766E] font-medium">
                UNDRR Global Findings
              </div>
            </div>

            <div className="bg-[#F4F7F6] p-6 rounded-2xl border-l-4 border-l-[#0B766E] border border-[#DBE6E2]">
              <div className="text-3xl font-black text-[#0B766E]">&gt;70%</div>
              <h4 className="font-bold text-sm text-[#142D36] mt-1">Cyclone Shelters Lack Ramps</h4>
              <p className="text-xs text-[#60747A] mt-2 leading-relaxed">
                Field audits in coastal Khulna and Satkhira revealed over 70% of shelters lack code-compliant ramps or step-free entries.
              </p>
              <div className="mt-4 pt-2 border-t border-[#DBE6E2] text-[11px] text-[#0B766E] font-medium">
                CDD & PreventionWeb Study
              </div>
            </div>

            <div className="bg-[#F4F7F6] p-6 rounded-2xl border-l-4 border-l-[#159B82] border border-[#DBE6E2]">
              <div className="text-3xl font-black text-[#159B82]">2x–4x</div>
              <h4 className="font-bold text-sm text-[#142D36] mt-1">Higher Disaster Mortality</h4>
              <p className="text-xs text-[#60747A] mt-2 leading-relaxed">
                Persons with disabilities suffer 2 to 4 times higher death and injury rates during severe coastal delta flood events.
              </p>
              <div className="mt-4 pt-2 border-t border-[#DBE6E2] text-[11px] text-[#0B766E] font-medium">
                NIH Study (PMC12997332)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 & 4: HOW SHONGJOG WORKS & THE 4-STAGE RESPONSE WORKFLOW */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F4F7F6] border-b border-[#DBE6E2]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-wider font-bold text-[#0B766E]">
              Accountable Coordination
            </span>
            <h2 className="text-3xl font-extrabold text-[#142D36] mt-2">
              The 4-Stage Response Process
            </h2>
            <p className="text-[#60747A] mt-3">
              How an unstructured cry for help becomes a verified, trackable evacuation mission.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Stage 1 */}
            <div className="bg-white p-6 rounded-2xl border border-[#DBE6E2] shadow-sm relative">
              <div className="text-xs font-mono font-bold text-[#0B766E] bg-[#0B766E]/10 px-2 py-1 rounded inline-block mb-3">
                STAGE 01
              </div>
              <h3 className="font-bold text-lg text-[#142D36]">Accessible Intake</h3>
              <p className="text-xs text-[#60747A] mt-2 leading-relaxed">
                Citizen or caregiver speaks or types what is happening in Bengali, Banglish, or English. Selects concrete functional needs (ramp, wheelchair, visual guide, oxygen power) without declaring medical diagnoses.
              </p>
            </div>

            {/* Stage 2 */}
            <div className="bg-white p-6 rounded-2xl border border-[#DBE6E2] shadow-sm relative">
              <div className="text-xs font-mono font-bold text-[#0B766E] bg-[#0B766E]/10 px-2 py-1 rounded inline-block mb-3">
                STAGE 02
              </div>
              <h3 className="font-bold text-lg text-[#142D36]">AI Needs Understanding</h3>
              <p className="text-xs text-[#60747A] mt-2 leading-relaxed">
                Adaption Labs AI extracts group size, urgency, and specific physical constraints into a validated JSON schema. Graceful local heuristic fallback ensures zero outage when offline.
              </p>
            </div>

            {/* Stage 3 */}
            <div className="bg-white p-6 rounded-2xl border border-[#DBE6E2] shadow-sm relative">
              <div className="text-xs font-mono font-bold text-[#0B766E] bg-[#0B766E]/10 px-2 py-1 rounded inline-block mb-3">
                STAGE 03
              </div>
              <h3 className="font-bold text-lg text-[#142D36]">Constrained Matching</h3>
              <p className="text-xs text-[#60747A] mt-2 leading-relaxed">
                Deterministic algorithms enforce 7 hard safety constraints: wheelchair ramp compatibility, shelter power, remaining headroom, and verified status. Unverified assets are isolated.
              </p>
            </div>

            {/* Stage 4 */}
            <div className="bg-white p-6 rounded-2xl border border-[#DBE6E2] shadow-sm relative">
              <div className="text-xs font-mono font-bold text-[#0B766E] bg-[#0B766E]/10 px-2 py-1 rounded inline-block mb-3">
                STAGE 04
              </div>
              <h3 className="font-bold text-lg text-[#142D36]">Accountable Delivery</h3>
              <p className="text-xs text-[#60747A] mt-2 leading-relaxed">
                Coordinator authorizes dispatch; responder receives data-minimized navigation tasks; arrival and shelter occupancy are confirmed on an immutable event audit timeline.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: TECHNICAL CAPABILITY HIGHLIGHTS */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-b border-[#DBE6E2]">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-12">
            <span className="text-xs uppercase tracking-wider font-bold text-[#0B766E]">
              Engineered for Extreme Conditions
            </span>
            <h2 className="text-3xl font-extrabold text-[#142D36] mt-2">
              Built like critical infrastructure
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#0B766E]/10 flex items-center justify-center text-[#0B766E]">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#142D36]">
                Hard Constraints Before Proximity
              </h3>
              <p className="text-xs text-[#60747A] leading-relaxed">
                In emergency logistics, physical barriers are absolute. Proximity cannot compensate for steep stairs or an inaccessible vehicle. A wheelchair user is never routed to a shelter without step-free ramps.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#0B766E]/10 flex items-center justify-center text-[#0B766E]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#142D36]">
                Verification Gate & Resource Quarantine
              </h3>
              <p className="text-xs text-[#60747A] leading-relaxed">
                Unverified community boats or informal club shelters are programmatically excluded from the verified safe dispatch pool to avoid leading vulnerable families into secondary hazards.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#0B766E]/10 flex items-center justify-center text-[#0B766E]">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#142D36]">
                Atomic Concurrency Protection
              </h3>
              <p className="text-xs text-[#60747A] leading-relaxed">
                SQLite transactions with immediate locks eliminate race conditions. Prevents vehicle double-booking or over-allocating remaining shelter beds during mass evacuation rushes.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#0B766E]/10 flex items-center justify-center text-[#0B766E]">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#142D36]">
                Offline-First PWA Draft Integrity
              </h3>
              <p className="text-xs text-[#60747A] leading-relaxed">
                When network towers fail during coastal storms, requests are cached in browser IndexedDB and marked clearly as &ldquo;Saved on this device — not yet sent.&rdquo; Never falsely promises delivery when offline.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#0B766E]/10 flex items-center justify-center text-[#0B766E]">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#142D36]">
                Data Minimization & Dignity
              </h3>
              <p className="text-xs text-[#60747A] leading-relaxed">
                Field responders receive only actionable operational instructions (e.g. &ldquo;2 wheelchair passengers, carry ramp&rdquo;). Extraneous personal medical history is strictly withheld.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#0B766E]/10 flex items-center justify-center text-[#0B766E]">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#142D36]">
                WCAG 2.2 AA Accessibility
              </h3>
              <p className="text-xs text-[#60747A] leading-relaxed">
                Engineered with high-contrast color ratios (&gt;4.5:1), full keyboard tab navigation, visible focus rings, large 44px touch targets, and full screen-reader semantic landmarks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: SIMULATED EVACUATION SCENARIO */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#091E2C] text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs uppercase tracking-wider font-bold text-[#63DEC2]">
                Realistic Synthetic Scenario
              </span>
              <h2 className="text-3xl font-extrabold text-white">
                Simulated Coastal Flood Response — Dacope, Khulna
              </h2>
              <p className="text-sm text-[#DBE6E2] leading-relaxed">
                A 2.8-meter tidal storm surge threatens the low-lying riverine unions of Dacope (Chalna, Bajua, Pankhali). The simulation seeds 8 diverse assistance cases showcasing both successful multi-modal dispatches and responsible constraint-based rejections.
              </p>
              <div className="space-y-2 text-xs text-[#DBE6E2]/90">
                <div className="flex items-start gap-2">
                  <span className="text-[#63DEC2] font-bold">Case 1:</span>
                  <span>Paralyzed father + 3 family members matched to wheelchair-lift van and step-free Dacope Model Shelter.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#ECAF42] font-bold">Case 3:</span>
                  <span>Blind 75-year-old living alone matched to trained sighted guide volunteer squad.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#D9534F] font-bold">Case 4:</span>
                  <span>Ventilator patient requiring guaranteed diesel generator backup matched to high-power facility.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-white/60 font-bold">Case 7:</span>
                  <span>Unverified private wooden boat isolated from dispatch pool until safety check.</span>
                </div>
              </div>
              <div className="pt-4">
                <Link
                  href="/operations"
                  className="inline-flex items-center gap-2 bg-[#0B766E] hover:bg-[#159B82] text-white px-5 py-2.5 rounded-xl font-bold text-xs transition"
                >
                  <span>Launch Operations Center</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 bg-[#103B48] p-6 rounded-2xl border border-[#0B766E]/40 space-y-4">
              <h3 className="font-bold text-sm text-[#63DEC2] uppercase tracking-wide">
                Live Scenario Telemetry
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#091E2C] p-4 rounded-xl border border-white/10">
                  <div className="text-2xl font-black text-white">8</div>
                  <div className="text-[11px] text-[#DBE6E2]">Synthetic Cases Active</div>
                </div>
                <div className="bg-[#091E2C] p-4 rounded-xl border border-white/10">
                  <div className="text-2xl font-black text-[#63DEC2]">4</div>
                  <div className="text-[11px] text-[#DBE6E2]">Transport Vehicles</div>
                </div>
                <div className="bg-[#091E2C] p-4 rounded-xl border border-white/10">
                  <div className="text-2xl font-black text-[#ECAF42]">4</div>
                  <div className="text-[11px] text-[#DBE6E2]">Emergency Shelters</div>
                </div>
                <div className="bg-[#091E2C] p-4 rounded-xl border border-white/10">
                  <div className="text-2xl font-black text-[#159B82]">4</div>
                  <div className="text-[11px] text-[#DBE6E2]">Volunteer Units</div>
                </div>
              </div>
              <div className="text-[11px] text-[#DBE6E2]/70 leading-relaxed pt-2 border-t border-white/10">
                Notice: All records are strictly synthetic and designed to demonstrate software behavior across linguistic nuances and accessibility constraints.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F4F7F6] text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#142D36]">
            Every second counts when water is rising.
          </h2>
          <p className="text-sm sm:text-base text-[#60747A] leading-relaxed">
            Experience how SHONGJOG turns panic into an accountable, inclusive rescue workflow.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              href="/request-help"
              className="bg-[#D9534F] hover:bg-[#c4413d] text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-md transition"
            >
              Request Assistance
            </Link>
            <Link
              href="/operations"
              className="bg-[#0B766E] hover:bg-[#159B82] text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-md transition"
            >
              Open Operations Center
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

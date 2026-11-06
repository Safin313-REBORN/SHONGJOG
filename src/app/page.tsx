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
  FileText,
  Activity,
  Layers,
  HeartHandshake,
  ExternalLink,
  ShieldAlert,
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
      <section className="relative hero-gradient text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b border-[#103B48]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 bg-[#103B48] border border-[#0B766E]/50 text-[#63DEC2] px-3 py-1 rounded-md text-xs font-mono font-medium">
                <span className="w-2 h-2 rounded-full bg-[#159B82]" />
                <span>INCLUSIVE DISASTER COORDINATION PROTOCOL</span>
              </div>

              <div className="space-y-1.5">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                  {t.hero_title_1}
                </h1>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#63DEC2]">
                  {t.hero_title_2}
                </h2>
              </div>

              <p className="text-sm sm:text-base text-[#DBE6E2] leading-relaxed max-w-xl">
                {t.hero_desc}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3.5 pt-1">
                <Link
                  href="/operations"
                  className="inline-flex items-center gap-2 bg-[#0B766E] hover:bg-[#159B82] text-white px-5 py-3 rounded-lg font-bold text-xs uppercase tracking-wider transition border border-[#159B82] focus:outline-none focus:ring-1 focus:ring-[#63DEC2]"
                >
                  <Radio className="w-4 h-4 text-[#63DEC2]" />
                  <span>{t.cta_explore}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/request-help"
                  className="inline-flex items-center gap-2 bg-[#D9534F] hover:bg-[#c4413d] text-white px-5 py-3 rounded-lg font-bold text-xs uppercase tracking-wider transition border border-[#D9534F] focus:outline-none focus:ring-1 focus:ring-white"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>{t.cta_request}</span>
                </Link>
              </div>

              {/* Core System Guarantees */}
              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-5 text-xs text-[#DBE6E2]/80">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-[#159B82]" />
                  <span>Multilingual (বাংলা, Banglish, English)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-[#159B82]" />
                  <span>7 Hard Physical Constraints</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-[#159B82]" />
                  <span>Coordinator-Authorized Dispatch</span>
                </div>
              </div>
            </div>

            {/* Right Precision GIS Map */}
            <div className="lg:col-span-6">
              <AnimatedHeroMap />
            </div>
          </div>
        </div>
      </section>

      {/* ROLE-BASED QUICK ENTRY PORTALS */}
      <section className="bg-[#F4F7F6] py-12 px-4 sm:px-6 lg:px-8 border-b border-[#DBE6E2]">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mx-auto text-center mb-8">
            <span className="text-[11px] uppercase tracking-wider font-mono font-bold text-[#0B766E]">
              Operational Access Channels
            </span>
            <p className="text-xl sm:text-2xl font-black text-[#142D36] mt-1">
              Select your response workflow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {/* Citizen Intake */}
            <Link
              href="/request-help"
              className="pro-card pro-card-hover p-5 rounded-xl flex flex-col justify-between group"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#D9534F]/10 flex items-center justify-center text-[#D9534F] mb-3">
                  <Users className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-base text-[#142D36] group-hover:text-[#0B766E] transition">
                  Citizen or Caregiver
                </h4>
                <p className="text-xs text-[#60747A] mt-1.5 leading-relaxed">
                  Submit functional requirements (step-free ramp, visual guide, sign language, oxygen power). Text or voice input. Operates offline.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#DBE6E2] flex items-center justify-between text-xs font-bold text-[#D9534F]">
                <span>Submit Request</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            {/* Operations Center */}
            <Link
              href="/operations"
              className="pro-card pro-card-hover p-5 rounded-xl flex flex-col justify-between group"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#0B766E]/10 flex items-center justify-center text-[#0B766E] mb-3">
                  <Radio className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-base text-[#142D36] group-hover:text-[#0B766E] transition">
                  Emergency Coordinator
                </h4>
                <p className="text-xs text-[#60747A] mt-1.5 leading-relaxed">
                  Monitor live GIS sector telemetry, review algorithmic constraint validations, and authorize safe vehicle and shelter dispatches.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#DBE6E2] flex items-center justify-between text-xs font-bold text-[#0B766E]">
                <span>Command Operations</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            {/* Field Responder */}
            <Link
              href="/responder"
              className="pro-card pro-card-hover p-5 rounded-xl flex flex-col justify-between group"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#159B82]/10 flex items-center justify-center text-[#159B82] mb-3">
                  <Truck className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-base text-[#142D36] group-hover:text-[#0B766E] transition">
                  Field Responder
                </h4>
                <p className="text-xs text-[#60747A] mt-1.5 leading-relaxed">
                  Mobile-first task queue for rescue drivers and volunteer squads: accept assignments, log travel states, and confirm shelter arrival.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#DBE6E2] flex items-center justify-between text-xs font-bold text-[#159B82]">
                <span>Field Terminal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            {/* Asset Registry */}
            <Link
              href="/resources"
              className="pro-card pro-card-hover p-5 rounded-xl flex flex-col justify-between group"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#ECAF42]/10 flex items-center justify-center text-[#ECAF42] mb-3">
                  <Building2 className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-base text-[#142D36] group-hover:text-[#0B766E] transition">
                  Shelter & Asset Registry
                </h4>
                <p className="text-xs text-[#60747A] mt-1.5 leading-relaxed">
                  Live verification tracking: step-free ramp slopes, generator capacity, sanitary access, and headroom calculations.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#DBE6E2] flex items-center justify-between text-xs font-bold text-[#ECAF42]">
                <span>Asset Ledger</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* EVIDENCE BASE & EMPIRICAL REALITY */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-white border-b border-[#DBE6E2]">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-10">
            <span className="text-[11px] uppercase tracking-wider font-mono font-bold text-[#0B766E]">
              Documented Vulnerability & Field Evidence
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#142D36] mt-1">
              Why emergency warnings fail vulnerable communities
            </h2>
            <p className="text-xs sm:text-sm text-[#60747A] mt-2 leading-relaxed">
              In low-lying riverine deltas, receiving an early warning is not the barrier to safety. Architectural exclusion, lack of step-free transport, and power dependencies prevent physical evacuation.
            </p>
          </div>

          {/* 4 Research Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="pro-card p-5 rounded-xl border-l-4 border-l-[#D9534F]">
              <div className="text-3xl font-black text-[#D9534F] tabular-nums">84%</div>
              <h4 className="font-bold text-sm text-[#142D36] mt-1">No Personal Preparedness Plan</h4>
              <p className="text-xs text-[#60747A] mt-1.5 leading-relaxed">
                Globally, 84% of surveyed persons with disabilities have no individualized evacuation protocol for rapid-onset weather extremes.
              </p>
              <div className="mt-4 pt-2 border-t border-[#DBE6E2] text-[10px] font-mono text-[#0B766E]">
                UNDRR 2023 Global Survey
              </div>
            </div>

            <div className="pro-card p-5 rounded-xl border-l-4 border-l-[#ECAF42]">
              <div className="text-3xl font-black text-[#ECAF42] tabular-nums">&gt;50%</div>
              <h4 className="font-bold text-sm text-[#142D36] mt-1">Unable to Evacuate Alone</h4>
              <p className="text-xs text-[#60747A] mt-1.5 leading-relaxed">
                Over half of surveyed individuals state they cannot reach safety without direct external logistical assistance and accessible transport.
              </p>
              <div className="mt-4 pt-2 border-t border-[#DBE6E2] text-[10px] font-mono text-[#0B766E]">
                UNDRR Global Findings
              </div>
            </div>

            <div className="pro-card p-5 rounded-xl border-l-4 border-l-[#0B766E]">
              <div className="text-3xl font-black text-[#0B766E] tabular-nums">&gt;70%</div>
              <h4 className="font-bold text-sm text-[#142D36] mt-1">Cyclone Shelters Lack Ramps</h4>
              <p className="text-xs text-[#60747A] mt-1.5 leading-relaxed">
                Field accessibility audits in Khulna and Satkhira revealed over 70% of shelters lack ramps or exceed the maximum 1:12 safe incline.
              </p>
              <div className="mt-4 pt-2 border-t border-[#DBE6E2] text-[10px] font-mono text-[#0B766E]">
                CDD & PreventionWeb Study
              </div>
            </div>

            <div className="pro-card p-5 rounded-xl border-l-4 border-l-[#159B82]">
              <div className="text-3xl font-black text-[#159B82] tabular-nums">2x–4x</div>
              <h4 className="font-bold text-sm text-[#142D36] mt-1">Higher Disaster Mortality</h4>
              <p className="text-xs text-[#60747A] mt-1.5 leading-relaxed">
                Mortality and injury rates during severe coastal surges are 2 to 4 times higher among disabled residents due to transit delays.
              </p>
              <div className="mt-4 pt-2 border-t border-[#DBE6E2] text-[10px] font-mono text-[#0B766E]">
                NIH Study (PMC12997332)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE 4-STAGE RESPONSE PROTOCOL */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-[#F4F7F6] border-b border-[#DBE6E2]">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mx-auto text-center mb-10">
            <span className="text-[11px] uppercase tracking-wider font-mono font-bold text-[#0B766E]">
              Deterministic Coordination Pipeline
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#142D36] mt-1">
              The 4-Stage Response Process
            </h2>
            <p className="text-xs sm:text-sm text-[#60747A] mt-1.5">
              Converting unstructured emergency requests into verified, constraint-checked evacuation missions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div className="pro-card p-5 rounded-xl space-y-2">
              <span className="text-[10px] font-mono font-bold text-[#0B766E] bg-[#0B766E]/10 px-2 py-0.5 rounded">
                PHASE 01
              </span>
              <h3 className="font-bold text-base text-[#142D36]">Accessible Intake</h3>
              <p className="text-xs text-[#60747A] leading-relaxed">
                Captures functional support requirements without demanding medical diagnoses. Full speech-to-text and offline IndexedDB support.
              </p>
            </div>

            <div className="pro-card p-5 rounded-xl space-y-2">
              <span className="text-[10px] font-mono font-bold text-[#0B766E] bg-[#0B766E]/10 px-2 py-0.5 rounded">
                PHASE 02
              </span>
              <h3 className="font-bold text-base text-[#142D36]">Needs Extraction</h3>
              <p className="text-xs text-[#60747A] leading-relaxed">
                Adaption Labs multilingual AI translates colloquial phrasing into validated JSON schemas with zero-downtime deterministic fallback.
              </p>
            </div>

            <div className="pro-card p-5 rounded-xl space-y-2">
              <span className="text-[10px] font-mono font-bold text-[#0B766E] bg-[#0B766E]/10 px-2 py-0.5 rounded">
                PHASE 03
              </span>
              <h3 className="font-bold text-base text-[#142D36]">Constrained Matching</h3>
              <p className="text-xs text-[#60747A] leading-relaxed">
                Applies 7 hard physical constraints: wheelchair ramps, electrical backup, and verified status. Unverified assets are quarantined.
              </p>
            </div>

            <div className="pro-card p-5 rounded-xl space-y-2">
              <span className="text-[10px] font-mono font-bold text-[#0B766E] bg-[#0B766E]/10 px-2 py-0.5 rounded">
                PHASE 04
              </span>
              <h3 className="font-bold text-base text-[#142D36]">Accountable Delivery</h3>
              <p className="text-xs text-[#60747A] leading-relaxed">
                Coordinator approves dispatch; responder executes mobile workflow; safe arrival is recorded on an immutable timeline.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SYSTEM RELIABILITY STANDARDS */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-white border-b border-[#DBE6E2]">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-10">
            <span className="text-[11px] uppercase tracking-wider font-mono font-bold text-[#0B766E]">
              Operational Resilience
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#142D36] mt-1">
              Built like critical infrastructure
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="pro-card p-5 rounded-xl space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#0B766E]/10 flex items-center justify-center text-[#0B766E]">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-[#142D36]">
                Hard Constraints Before Proximity
              </h3>
              <p className="text-xs text-[#60747A] leading-relaxed">
                Physical barriers are absolute. Proximity cannot compensate for steep stairs. Non-accessible facilities are strictly bypassed.
              </p>
            </div>

            <div className="pro-card p-5 rounded-xl space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#0B766E]/10 flex items-center justify-center text-[#0B766E]">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-[#142D36]">
                Quarantine of Unverified Assets
              </h3>
              <p className="text-xs text-[#60747A] leading-relaxed">
                Uninspected private boats and informal clubhouses are isolated from the automated safe dispatch pool to prevent secondary hazards.
              </p>
            </div>

            <div className="pro-card p-5 rounded-xl space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#0B766E]/10 flex items-center justify-center text-[#0B766E]">
                <Activity className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-[#142D36]">
                Atomic Concurrency Protection
              </h3>
              <p className="text-xs text-[#60747A] leading-relaxed">
                Database transactions prevent vehicle double-booking or over-allocating remaining shelter beds during sudden mass evacuation surges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SYNTHETIC SCENARIO DISCLOSURE */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-[#091E2C] text-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono font-bold text-[#63DEC2] uppercase tracking-wider">
              Synthetic Operational Scenario
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Simulated Coastal Flood Response — Dacope, Khulna
            </h2>
            <p className="text-xs text-[#DBE6E2]/80 max-w-xl">
              Tidal inundation (+2.8m) simulation across Dacope unions with 8 diverse assistance cases demonstrating multi-modal matching and constraint enforcement.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <Link
              href="/operations"
              className="inline-flex items-center gap-2 bg-[#0B766E] hover:bg-[#159B82] text-white px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition"
            >
              <span>Operations Center</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { useTranslation } from "@/lib/i18n";
import {
  FileText,
  Cpu,
  ShieldCheck,
  UserCheck,
  Truck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

export default function InteractiveWalkthrough() {
  const { lang } = useTranslation();
  const [activeStep, setActiveStep] = useState<number>(1);

  const steps = [
    { num: 1, title: lang === "bn" ? "১. নাগরিকের অনুরোধ" : "1. Citizen Request", icon: FileText, subtitle: lang === "bn" ? "বহুভাষিক সাধারণ বার্তা" : "Multilingual Plain Text" },
    { num: 2, title: lang === "bn" ? "২. এআই বিশ্লেষণ" : "2. AI Extraction", icon: Cpu, subtitle: lang === "bn" ? "কার্যকরী সুবিধাসমূহ" : "Functional Constraints" },
    { num: 3, title: lang === "bn" ? "৩. কঠোর ম্যাচিং" : "3. Hard Matching", icon: ShieldCheck, subtitle: lang === "bn" ? "শর্তাবলী ফিল্টারিং" : "Constraint Filtering" },
    { num: 4, title: lang === "bn" ? "৪. সমন্বয়ক তদারকি" : "4. Human Oversight", icon: UserCheck, subtitle: lang === "bn" ? "সমন্বয়ক অনুমোদন" : "Coordinator Review" },
    { num: 5, title: lang === "bn" ? "৫. রেসপন্ডার কার্যক্রম" : "5. Responder Action", icon: Truck, subtitle: lang === "bn" ? "মাঠপর্যায়ে কার্যকর" : "Mobile Execution" },
    { num: 6, title: lang === "bn" ? "৬. নিরাপদ আশ্রয়" : "6. Confirmed Safety", icon: CheckCircle2, subtitle: lang === "bn" ? "অপরিবর্তনীয় অডিট" : "Immutable Audit" },
  ];

  return (
    <div className="bg-[#091E2C] text-white rounded-2xl border border-[#103B48] p-5 sm:p-8 shadow-xl space-y-6">
      {/* Walkthrough Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#103B48] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#63DEC2]" />
            <span className="text-[11px] font-mono font-bold text-[#63DEC2] uppercase tracking-wider">
              {lang === "bn" ? "ইন্টারেক্টিভ সিস্টেম প্রদর্শন" : "Interactive System Walkthrough"}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white mt-1 tracking-tight">
            {lang === "bn" ? "সতর্কবার্তা থেকে নিরাপদ আশ্রয়কেন্দ্রে পৌঁছানো পর্যন্ত" : "From Colloquial Warning to Verified Safe Arrival"}
          </h3>
          <p className="text-xs text-[#DBE6E2]/80 mt-1">
            {lang === "bn"
              ? "শংযোগ কীভাবে একটি বহুভাষিক জরুরি অনুরোধ ধাপে ধাপে যাচাই ও নিষ্পত্তি করে তা দেখুন।"
              : "Explore how SHONGJOG processes a real-world multilingual emergency request step by step."}
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#103B48] border border-[#0B766E]/50 text-[#63DEC2] text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-[#159B82] animate-pulse" />
          {lang === "bn" ? "ডিটারমিনিস্টিক সিমুলেটর" : "DETERMINISTIC SIMULATOR"}
        </div>
      </div>

      {/* Step Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {steps.map((st) => {
          const Icon = st.icon;
          const isActive = activeStep === st.num;
          const isPast = activeStep > st.num;

          return (
            <button
              key={st.num}
              onClick={() => setActiveStep(st.num)}
              className={`p-3 rounded-xl border text-left transition flex flex-col justify-between gap-2 ${
                isActive
                  ? "bg-[#0B766E] border-[#63DEC2] text-white shadow-md ring-1 ring-[#63DEC2]"
                  : isPast
                  ? "bg-[#103B48]/60 border-[#0B766E]/40 text-[#DBE6E2] hover:bg-[#103B48]"
                  : "bg-[#103B48]/30 border-transparent text-[#DBE6E2]/50 hover:bg-[#103B48]/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <Icon className={`w-4 h-4 ${isActive ? "text-[#63DEC2]" : "text-[#DBE6E2]/70"}`} />
                <span className="text-[10px] font-mono font-bold">{st.num}/6</span>
              </div>
              <div>
                <div className="font-bold text-xs truncate">{st.title.replace(/^\d\.\s/, "")}</div>
                <div className="text-[10px] text-[#DBE6E2]/70 truncate">{st.subtitle}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Step Content Container */}
      <div className="bg-[#103B48]/40 rounded-xl border border-[#103B48] p-5 sm:p-6 min-h-[300px] flex flex-col justify-between">
        {/* STEP 1 */}
        {activeStep === 1 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-[#63DEC2]">
              <span>STAGE 1: CITIZEN / CAREGIVER INTAKE</span>
              <span>NO DIAGNOSIS REQUIRED</span>
            </div>

            <div className="bg-[#091E2C] p-4 rounded-xl border border-[#103B48] space-y-2">
              <span className="text-[10px] font-mono text-[#DBE6E2]/60 uppercase">Submitted Bengali Audio / Text</span>
              <p className="text-base sm:text-lg font-bold text-white leading-relaxed">
                &ldquo;আমার বাবা হুইলচেয়ার ব্যবহার করেন। আমরা তিনজন। আমাদের এমন গাড়ি প্রয়োজন যাতে হুইলচেয়ার নিয়ে ওঠা যায়।&rdquo;
              </p>
              <p className="text-xs text-[#63DEC2] font-mono pt-1">
                Translation: &ldquo;My father uses a wheelchair. We are three persons. We need a vehicle that can board a wheelchair.&rdquo;
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-[#091E2C] border border-[#103B48]">
                <span className="text-[#DBE6E2]/70 block text-[10px] font-mono">INPUT CHANNEL</span>
                <span className="font-bold text-white mt-0.5 block">Web Speech API Voice / Text</span>
              </div>
              <div className="p-3 rounded-lg bg-[#091E2C] border border-[#103B48]">
                <span className="text-[#DBE6E2]/70 block text-[10px] font-mono">OFFLINE CAPABILITY</span>
                <span className="font-bold text-white mt-0.5 block">PWA IndexedDB Local Cache</span>
              </div>
              <div className="p-3 rounded-lg bg-[#091E2C] border border-[#103B48]">
                <span className="text-[#DBE6E2]/70 block text-[10px] font-mono">PRIVACY SCOPE</span>
                <span className="font-bold text-[#63DEC2] mt-0.5 block">Zero Clinical Records Asked</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {activeStep === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-[#63DEC2]">
              <span>STAGE 2: MULTILINGUAL AI EXTRACTION ENGINE</span>
              <span>STRUCTURED ENTITY SCHEMA</span>
            </div>

            <div className="bg-[#091E2C] p-4 rounded-xl border border-[#103B48] font-mono text-xs text-[#DBE6E2] space-y-2">
              <div className="text-[10px] text-[#63DEC2] pb-1 border-b border-[#103B48]">
                EXTRACTED JSON SCHEMA (Adaption AI + Deterministic Fallback)
              </div>
              <pre className="text-xs text-[#63DEC2] leading-relaxed overflow-x-auto">
{`{
  "language": "bn",
  "group_size": 3,
  "support_needs": [
    "mobility_assistance",
    "wheelchair_accessible_transport"
  ],
  "urgency": "urgent",
  "location": null,
  "missing_information": ["approximate_location"],
  "requires_human_review": true
}`}
              </pre>
            </div>

            <div className="p-3.5 rounded-lg bg-[#091E2C] border border-[#0B766E]/50 text-xs text-[#DBE6E2]/90 leading-relaxed">
              <strong className="text-white">Safety Guarantee:</strong> The AI extracts physical requirements (wheelchair access, headcount: 3) without guessing a medical etiology. If location is missing, it explicitly flags <code>missing_information</code> for human clarification rather than hallucinating coordinates.
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {activeStep === 3 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-[#63DEC2]">
              <span>STAGE 3: HARD CONSTRAINT MATCHING ENGINE</span>
              <span>7 NON-NEGOTIABLE SAFETY RULES</span>
            </div>

            <div className="space-y-2.5">
              {/* Candidate 1: Rejected */}
              <div className="p-3.5 rounded-xl bg-[#091E2C] border border-[#D9534F]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">Chalna Standard Minibus Beta</span>
                    <span className="px-2 py-0.5 rounded bg-[#D9534F]/20 text-[#D9534F] font-mono font-bold text-[10px]">
                      PROXIMITY: 0.8 KM (CLOSEST)
                    </span>
                  </div>
                  <div className="text-[#DBE6E2]/70 text-[11px] mt-0.5">Capacity: 12 passengers · No ramp/lift equipment</div>
                </div>
                <div className="flex items-center gap-1.5 text-[#D9534F] font-bold shrink-0">
                  <XCircle className="w-4 h-4" />
                  <span>REJECTED: Constraint Violation (No Ramp)</span>
                </div>
              </div>

              {/* Candidate 2: Quarantined */}
              <div className="p-3.5 rounded-xl bg-[#091E2C] border border-[#ECAF42]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">Private Fishing Trawler #9</span>
                    <span className="px-2 py-0.5 rounded bg-[#ECAF42]/20 text-[#ECAF42] font-mono font-bold text-[10px]">
                      UNVERIFIED
                    </span>
                  </div>
                  <div className="text-[#DBE6E2]/70 text-[11px] mt-0.5">Community reported boat · No civil-defense inspection</div>
                </div>
                <div className="flex items-center gap-1.5 text-[#ECAF42] font-bold shrink-0">
                  <AlertTriangle className="w-4 h-4" />
                  <span>QUARANTINED: Unverified Resource Policy</span>
                </div>
              </div>

              {/* Candidate 3: Selected */}
              <div className="p-3.5 rounded-xl bg-[#0B766E]/20 border border-[#159B82] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">Dacope Accessible Emergency Van Alpha</span>
                    <span className="px-2 py-0.5 rounded bg-[#159B82]/20 text-[#63DEC2] font-mono font-bold text-[10px]">
                      VERIFIED · FOLDING RAMP
                    </span>
                  </div>
                  <div className="text-[#DBE6E2]/80 text-[11px] mt-0.5">Capacity: 4 (including wheelchair bay) · Driver: Trained volunteer</div>
                </div>
                <div className="flex items-center gap-1.5 text-[#63DEC2] font-bold shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>OPTIMAL MATCH (Hard Constraint Verified)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4 */}
        {activeStep === 4 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-[#63DEC2]">
              <span>STAGE 4: HUMAN COORDINATOR DISPATCH OVERSIGHT</span>
              <span>HUMAN-IN-THE-LOOP MANDATE</span>
            </div>

            <div className="p-4 rounded-xl bg-[#091E2C] border border-[#103B48] space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">Coordinator Dispatch Authorization Drawer</span>
                <span className="text-[11px] font-mono text-[#63DEC2]">ACTION REQUIRED</span>
              </div>
              <div className="text-xs text-[#DBE6E2]/80 leading-relaxed space-y-1">
                <p>
                  • <strong>Assigned Unit:</strong> Dacope Accessible Emergency Van Alpha (Driver: Rafiqul Islam)
                </p>
                <p>
                  • <strong>Target Shelter:</strong> Dacope Model Cyclone Shelter (1:12 Ramp, Generator: YES, Headroom: 142)
                </p>
                <p>
                  • <strong>Special Notice:</strong> 3 Passengers; 1 manual wheelchair tie-down required.
                </p>
              </div>
              <div className="pt-2 border-t border-[#103B48] flex items-center justify-between">
                <span className="text-[11px] font-mono text-[#DBE6E2]/60">Coordinator: Civil Defense Duty Officer #04</span>
                <span className="px-3 py-1 rounded bg-[#159B82] text-white text-xs font-bold">
                  ✓ Dispatch Authorized
                </span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5 */}
        {activeStep === 5 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-[#63DEC2]">
              <span>STAGE 5: FIELD RESPONDER MOBILE EXECUTION</span>
              <span>RUGGED TACTICAL TERMINAL</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#091E2C] border border-[#0B766E]/40 space-y-1">
                <div className="flex items-center justify-between font-mono text-[10px] text-[#63DEC2]">
                  <span>STEP A</span>
                  <span>CONFIRMED</span>
                </div>
                <h5 className="font-bold text-white">Accept Assignment</h5>
                <p className="text-[11px] text-[#DBE6E2]/70 leading-relaxed">
                  Responder reviews step-free handling requirements and accepts mission.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#091E2C] border border-[#0B766E]/40 space-y-1">
                <div className="flex items-center justify-between font-mono text-[10px] text-[#63DEC2]">
                  <span>STEP B</span>
                  <span>EN ROUTE</span>
                </div>
                <h5 className="font-bold text-white">Mark En Route</h5>
                <p className="text-[11px] text-[#DBE6E2]/70 leading-relaxed">
                  Vehicle navigates to Dacope Bazar landmark using offline waypoint cache.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#091E2C] border border-[#159B82] space-y-1 bg-[#159B82]/10">
                <div className="flex items-center justify-between font-mono text-[10px] text-[#159B82]">
                  <span>STEP C</span>
                  <span>ACTIVE</span>
                </div>
                <h5 className="font-bold text-white">Arrived at Citizen</h5>
                <p className="text-[11px] text-[#DBE6E2]/70 leading-relaxed">
                  Folding ramp deployed; citizen and caregiver boarded safely.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 6 */}
        {activeStep === 6 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-[#63DEC2]">
              <span>STAGE 6: OUTCOME CONFIRMATION & AUDIT LOG</span>
              <span>VERIFIED IMMUTABLE TIMELINE</span>
            </div>

            <div className="bg-[#091E2C] p-4 rounded-xl border border-[#159B82] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#159B82]" />
                  Assistance Arrival Confirmed
                </span>
                <span className="text-[11px] font-mono text-[#63DEC2] bg-[#159B82]/20 px-2.5 py-0.5 rounded">
                  CASE CLOSED · SAFE
                </span>
              </div>
              <p className="text-xs text-[#DBE6E2]/80 leading-relaxed">
                Citizen and 2 family members confirmed safely inside Dacope Model Cyclone Shelter. Target shelter headroom updated (-3 places). Reserved vehicle released back into available fleet.
              </p>
              <div className="pt-2 border-t border-[#103B48] flex items-center justify-between text-[11px] font-mono text-[#DBE6E2]/60">
                <span>AUDIT RECORD ID: EV-2026-9041</span>
                <span>STATUS: 100% ACCOUNTABLE</span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-[#103B48] mt-4">
          <button
            type="button"
            disabled={activeStep === 1}
            onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#103B48] hover:bg-[#159B82] disabled:opacity-30 disabled:pointer-events-none text-white transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{lang === "bn" ? "পূর্ববর্তী ধাপ" : "Previous Stage"}</span>
          </button>

          <span className="text-xs font-mono text-[#DBE6E2]/60">
            {lang === "bn" ? `ধাপ ${activeStep} / ৬` : `Stage ${activeStep} of 6`}
          </span>

          <button
            type="button"
            disabled={activeStep === 6}
            onClick={() => setActiveStep((prev) => Math.min(6, prev + 1))}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold bg-[#0B766E] hover:bg-[#159B82] disabled:opacity-30 disabled:pointer-events-none text-white transition shadow-sm"
          >
            <span>{lang === "bn" ? "পরবর্তী ধাপ" : "Next Stage"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}


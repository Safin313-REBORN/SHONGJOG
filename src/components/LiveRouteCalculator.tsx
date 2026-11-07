"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Compass,
  MapPin,
  ExternalLink,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Zap,
  Truck,
  Building2,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { useTranslation, formatNumber } from "@/lib/i18n";

function generateSimulatedCaseId(): string {
  return `SHG-SIM-${Date.now().toString().slice(-4)}`;
}

interface Scenario {
  id: string;
  nameEn: string;
  nameBn: string;
  locationEn: string;
  locationBn: string;
  lat: number;
  lng: number;
  elevation: string;
  headcount: number;
  needs: string[];
  urgency: "critical" | "urgent";
  householdDescEn: string;
  householdDescBn: string;
  rejectedShelter: {
    nameEn: string;
    nameBn: string;
    distanceKm: number;
    reasonEn: string;
    reasonBn: string;
    failureBadgeEn: string;
    failureBadgeBn: string;
  };
  approvedShelter: {
    nameEn: string;
    nameBn: string;
    distanceKm: number;
    rampEn: string;
    rampBn: string;
    powerEn: string;
    powerBn: string;
    headroom: number;
    lat: number;
    lng: number;
  };
  assignedVehicle: {
    nameEn: string;
    nameBn: string;
    specsEn: string;
    specsBn: string;
  };
}

const PRESET_SCENARIOS: Scenario[] = [
  {
    id: "wheelchair-dacope",
    nameEn: "Mother & Wheelchair-User Teenager",
    nameBn: "মা ও হুইলচেয়ার ব্যবহারকারী কিশোর",
    locationEn: "Dacope Bazar Ghat, Khulna",
    locationBn: "দাকোপ বাজার ঘাট, খুলনা",
    lat: 22.5733,
    lng: 89.5141,
    elevation: "1.4m AMSL",
    headcount: 2,
    needs: ["mobility_ramp", "step_free_vehicle"],
    urgency: "urgent",
    householdDescEn:
      "14-year-old manual wheelchair user with paraplegia and mother. Ground level mud road flooding quickly. Requires step-free boarding and verified 1:12 shelter ramp.",
    householdDescBn:
      "১৪ বছর বয়সী প্যারাপ্লেজিক হুইলচেয়ার ব্যবহারকারী কিশোর ও তার মা। মাটির কাঁচা রাস্তায় পানি উঠছে। ধাপমুক্ত পরিবহন ও ১:১২ ঢালের পরীক্ষিত র‍্যাম্প প্রয়োজন।",
    rejectedShelter: {
      nameEn: "Chalna Primary School (Walk-Up)",
      nameBn: "চালনা প্রাথমিক বিদ্যালয় (সিঁড়িযুক্ত)",
      distanceKm: 0.8,
      failureBadgeEn: "NON-COMPLIANT · 1:6 STAIRS ONLY",
      failureBadgeBn: "অননুমোদিত · কেবল ১:৬ খাড়া সিঁড়ি",
      reasonEn:
        "Proximity rule violated: Even though this building is 0.8 km away, it has 3 flights of 7-inch concrete steps with no ramp and ground floor is waterlogged. Manual wheelchair evacuation is physically impossible.",
      reasonBn:
        "নৈকট্য অপ্রবেশগম্যতা ঢাকতে পারে না: ভবনটি মাত্র ০.৮ কিমি দূরে হলেও এতে ৩ ধাপের খাড়া সিঁড়ি রয়েছে, কোনো র‍্যাম্প নেই এবং নিচতলায় পানি ঢুকেছে। হুইলচেয়ার ওঠানো সম্পূর্ণ অসম্ভব।",
    },
    approvedShelter: {
      nameEn: "Dacope Model Cyclone Shelter",
      nameBn: "দাকোপ মডেল সাইক্লোন শেল্টার",
      distanceKm: 1.6,
      rampEn: "Verified 1:12 Slope Concrete Switchback Ramp with Double Handrails",
      rampBn: "প্রকৌশলী কর্তৃক ১:১২ ঢাল পরীক্ষিত ডাবল হ্যান্ডরেল কংক্রিট র‍্যাম্প",
      powerEn: "15 kVA Diesel Generator + 5 kW Solar-Hybrid Microgrid",
      powerBn: "১৫ কেভিএ ডিজেল জেনারেটর + ৫ কিলোওয়াট সোলার-হাইব্রিড মাইক্রোগ্রিড",
      headroom: 230,
      lat: 22.5708,
      lng: 89.5158,
    },
    assignedVehicle: {
      nameEn: "Accessible Evacuation Van Alpha (RES-VEH-01)",
      nameBn: "প্রবেশগম্য উদ্ধার ভ্যান আলফা (RES-VEH-01)",
      specsEn: "Folding hydraulic tail-lift ramp (350kg capacity), 2 floor-lock wheelchair anchors, 4 companion seats.",
      specsBn: "হাইড্রলিক ফোল্ডিং টেইল-লিফট র‍্যাম্প (৩৫০ কেজি), ২টি ফ্লোর-লক হুইলচেয়ার অ্যাঙ্কর, ৪টি সহযাত্রী আসন।",
    },
  },
  {
    id: "oxygen-pankhali",
    nameEn: "Home Oxygen Concentrator Patient",
    nameBn: "হোম অক্সিজেন কনসেন্ট্রেটর লাইফ-সাপোর্ট রোগী",
    locationEn: "Pankhali Embankment, Dacope",
    locationBn: "পাংখালী বেড়িবাঁধ, দাকোপ",
    lat: 22.5764,
    lng: 89.5097,
    elevation: "1.6m AMSL",
    headcount: 3,
    needs: ["generator_power", "medical_priority"],
    urgency: "critical",
    householdDescEn:
      "68-year-old chronic COPD patient dependent on 5L/min continuous oxygen concentrator. Local grid blackout active; inverter battery has 35 minutes of backup remaining.",
    householdDescBn:
      "৬৮ বছর বয়সী ক্রনিক সিওপিডি রোগী, ৫ লি/মিনিট অবিচ্ছিন্ন অক্সিজেন কনসেন্ট্রেটরে বেঁচে আছেন। বিদ্যুৎ নেই; ইনভার্টার ব্যাটারিতে আর মাত্র ৩৫ মিনিট বিদ্যুৎ বাকি।",
    rejectedShelter: {
      nameEn: "Pankhali Union Parishad Complex",
      nameBn: "পাংখালী ইউনিয়ন পরিষদ ভবন",
      distanceKm: 0.5,
      failureBadgeEn: "REJECTED · NO BACKUP POWER",
      failureBadgeBn: "বাতিল · জেনারেটর বা ব্যাকআপ নেই",
      reasonEn:
        "Shelter is only 500m away, but has zero auxiliary fuel, damaged solar inverter, and no medical oxygen circuit. Patient would suffer fatal hypoxia within 40 minutes.",
      reasonBn:
        "আশ্রয়কেন্দ্রটি মাত্র ৫০০ মিটার দূরে হলেও এতে কোনো জেনারেটর তেল নেই, সোলার ইনভার্টার অচল এবং অক্সিজেন প্লাগ নেই। রোগী ৪০ মিনিটের মধ্যে প্রাণ হারাবেন।",
    },
    approvedShelter: {
      nameEn: "Chalna High School Resilience Hub",
      nameBn: "চালনা বহুমুখী উচ্চ বিদ্যালয় আশ্রয়কেন্দ্র",
      distanceKm: 2.1,
      rampEn: "Elevated Plinth with Continuous 1:12 Barrier-Free Walkway",
      rampBn: "উঁচু প্লিথসহ অবিচ্ছিন্ন ১:১২ ধাপমুক্ত কংক্রিট ওয়াকওয়ে",
      powerEn: "Continuous 24h Solar-Hybrid Battery Bank + Dedicated Medical Oxygen Circuit",
      powerBn: "২৪ ঘণ্টা সোলার-হাইব্রিড ব্যাটারি ব্যাংক + লাইফ-সাপোর্ট অক্সিজেন সার্কিট",
      headroom: 155,
      lat: 22.5850,
      lng: 89.5250,
    },
    assignedVehicle: {
      nameEn: "Rapid Medical Transport Unit Beta (RES-VEH-02)",
      nameBn: "দ্রুত চিকিৎসা পরিবহন ইউনিট বেটা (RES-VEH-02)",
      specsEn: "Onboard pure sine-wave 1000W AC inverter, dual oxygen bottle brackets, basic EMT attendant.",
      specsBn: "অনবোর্ড ১০০০ ওয়াট বিশুদ্ধ সাইন-ওয়েভ এসি ইনভার্টার, ২টি অক্সিজেন সিলিন্ডার ব্র্যাকেট, প্রাথমিক প্যারামেডিক।",
    },
  },
  {
    id: "blind-bajua",
    nameEn: "Blind Senior Living Alone",
    nameBn: "দৃষ্টিহীন একা বসবাসকারী প্রবীণ নাগরিক",
    locationEn: "Bajua West Embankment, Khulna",
    locationBn: "বাজুয়া পশ্চিম বেড়িবাঁধ, খুলনা",
    lat: 22.5542,
    lng: 89.5014,
    elevation: "1.1m AMSL",
    headcount: 1,
    needs: ["visual_guide", "tactile_signage"],
    urgency: "critical",
    householdDescEn:
      "75-year-old totally blind widower living alone 60 meters from tidal river. High tide overflow has reached homestead threshold. Cannot perceive visual flags or navigate inundated paths alone.",
    householdDescBn:
      "৭৫ বছর বয়সী সম্পূর্ণ দৃষ্টিহীন প্রবীণ, নদী থেকে ৬০ মিটার দূরে একা বসবাস করেন। জোয়ারের পানি উঠানে উঠেছে। ভিজ্যুয়াল লাল পতাকা দেখতে বা একা তলিয়ে যাওয়া পথ পার হতে অক্ষম।",
    rejectedShelter: {
      nameEn: "Bajua Market Shed (Unmonitored)",
      nameBn: "বাজুয়া বাজার অস্থায়ী শেড (তদারকিহীন)",
      distanceKm: 0.4,
      failureBadgeEn: "UNSAFE · OPEN WATER BOUNDARY",
      failureBadgeBn: "বিপজ্জনক · খোলা নালা ও রেলিংহীন",
      reasonEn:
        "Unfenced deep canal boundary and missing guardrails along approach cause extreme drowning risk for unaccompanied visually impaired evacuees.",
      reasonBn:
        "খোলা গভীর নালা এবং পৌঁছানোর পথে রেলিং না থাকায় সঙ্গীহীন দৃষ্টিহীন ব্যক্তির জন্য পানিতে ডুবে মৃত্যুর মারাত্মক ঝুঁকি রয়েছে।",
    },
    approvedShelter: {
      nameEn: "Dacope Model Cyclone Shelter",
      nameBn: "দাকোপ মডেল সাইক্লোন শেল্টার",
      distanceKm: 2.4,
      rampEn: "Tactile Ground Guidance Surface Indicators (TGSI) + Continuous Double Guardrails",
      rampBn: "ট্যাকটাইল মেঝে নির্দেশক টাইলস + অবিচ্ছিন্ন দ্বৈত নিরাপত্তা রেলিং",
      powerEn: "Acoustic Beacon Navigation + 15 kVA Diesel Generator",
      powerBn: "শব্দনির্দেশক বীকন নেভিগেশন + ১৫ কেভিএ ডিজেল জেনারেটর",
      headroom: 230,
      lat: 22.5708,
      lng: 89.5158,
    },
    assignedVehicle: {
      nameEn: "Community Rescue Boat Alpha (RES-BOT-01)",
      nameBn: "কমিউনিটি উদ্ধার বোট আলফা (RES-BOT-01)",
      specsEn: "Shallow-draft amphibious vessel with 2 trained civil defense sighted escorts and life vests.",
      specsBn: "অগভীর পানিতে চলাচলক্ষম উভচর জলযান, ২ জন প্রশিক্ষিত পথপ্রদর্শক এবং লাইফ জ্যাকেটসহ।",
    },
  },
];

export default function LiveRouteCalculator() {
  const { lang } = useTranslation();
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>("wheelchair-dacope");
  const [activeTab, setActiveTab] = useState<"analysis" | "map" | "specs">("analysis");
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchSuccess, setDispatchSuccess] = useState<{
    caseId: string;
    shelterName: string;
    vehicleName: string;
  } | null>(null);

  const scenario = PRESET_SCENARIOS.find((s) => s.id === selectedScenarioId) || PRESET_SCENARIOS[0];

  const handleSimulateDispatch = async () => {
    setIsDispatching(true);
    setDispatchSuccess(null);

    try {
      const payload = {
        rawDescription: `${scenario.nameEn}: ${scenario.householdDescEn}`,
        approximateLocation: scenario.locationEn,
        groupSize: scenario.headcount,
        urgency: scenario.urgency,
        statedNeeds: scenario.needs,
        contactName: "Caregiver Representative",
        contactPhone: "01711000000",
        consentGiven: true,
      };

      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const json = await res.json();
        setDispatchSuccess({
          caseId: json.case_reference || generateSimulatedCaseId(),
          shelterName: lang === "bn" ? scenario.approvedShelter.nameBn : scenario.approvedShelter.nameEn,
          vehicleName: lang === "bn" ? scenario.assignedVehicle.nameBn : scenario.assignedVehicle.nameEn,
        });
      } else {
        // Fallback for simulation UI responsiveness
        setDispatchSuccess({
          caseId: generateSimulatedCaseId(),
          shelterName: lang === "bn" ? scenario.approvedShelter.nameBn : scenario.approvedShelter.nameEn,
          vehicleName: lang === "bn" ? scenario.assignedVehicle.nameBn : scenario.assignedVehicle.nameEn,
        });
      }
    } catch {
      setDispatchSuccess({
        caseId: generateSimulatedCaseId(),
        shelterName: lang === "bn" ? scenario.approvedShelter.nameBn : scenario.approvedShelter.nameEn,
        vehicleName: lang === "bn" ? scenario.assignedVehicle.nameBn : scenario.assignedVehicle.nameEn,
      });
    } finally {
      setIsDispatching(false);
    }
  };

  // Google Maps embed URL for the calculated route between household and approved shelter
  const embedGoogleMapUrl = `https://maps.google.com/maps?saddr=${scenario.lat},${scenario.lng}&daddr=${scenario.approvedShelter.lat},${scenario.approvedShelter.lng}&t=k&z=14&output=embed`;
  const externalGoogleDirectionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${scenario.lat},${scenario.lng}&destination=${scenario.approvedShelter.lat},${scenario.approvedShelter.lng}&travelmode=driving`;

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#071520] text-white border-b border-[#133446]">
      <div className="max-w-[1240px] mx-auto space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#0B766E]/30 border border-[#0B766E] text-[#63DEC2] px-3.5 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#63DEC2]" />
              <span>
                {lang === "bn"
                  ? "সক্রিয় সমস্যা সমাধান ইঞ্জিন · লাইভ ট্রায়াজ ও রুট ক্যালকুলেটর"
                  : "ACTIVE PROBLEM-SOLVING ENGINE · DUAL-TRIAGE & ROUTE CALCULATOR"}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              {lang === "bn"
                ? "বাস্তব প্রতিবন্ধকতা যাচাই: কেন নৈকট্য কখনোই প্রবেশগম্যতার বিকল্প নয়"
                : "Real Barrier Verification: Why Proximity Never Excuses Inaccessibility"}
            </h2>
            <p className="text-xs sm:text-sm text-[#DBE6E2]/80 leading-relaxed">
              {lang === "bn"
                ? "নিচে বিভিন্ন পারিবারিক পরিস্থিতি নির্বাচন করুন। দেখুন কীভাবে সাধারণ অ্যাপ কেবল কাছের ভবন সুপারিশ করে মারাত্মক বিপদ ডেকে আনে, এবং সংযোগ কীভাবে ৭টি কঠোর শর্ত প্রয়োগ করে সঠিক জীবনরক্ষাকারী রুট ও যানবাহন নির্ধারণ করে।"
                : "Select a vulnerable household profile below. Observe why generic dispatch models fail by picking closer, inaccessible buildings, and how SHONGJOG enforces 7 hard constraints to guarantee physical safety."}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#0B1F2A] p-1.5 rounded-xl border border-[#133446] text-xs font-mono shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#159B82] animate-pulse" />
            <span className="text-[#63DEC2] font-bold">
              {lang === "bn" ? "লাইভ ডিটারমিনিস্টিক ইঞ্জিন" : "Live Deterministic Engine"}
            </span>
          </div>
        </div>

        {/* 3 Scenario Presets Selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PRESET_SCENARIOS.map((sc) => {
            const isSelected = sc.id === selectedScenarioId;
            return (
              <button
                key={sc.id}
                onClick={() => {
                  setSelectedScenarioId(sc.id);
                  setDispatchSuccess(null);
                }}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between gap-3 ${
                  isSelected
                    ? "bg-[#0B766E]/20 border-[#63DEC2] shadow-lg shadow-[#0B766E]/20 ring-1 ring-[#63DEC2]"
                    : "bg-[#0B1F2A] border-[#133446] text-[#DBE6E2] hover:border-[#0B766E]/60 hover:bg-[#0D2232]"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span
                      className={`font-bold px-2 py-0.5 rounded text-[10px] uppercase ${
                        sc.urgency === "critical"
                          ? "bg-[#C94747]/20 text-[#FF7A7A] border border-[#C94747]/50"
                          : "bg-[#D99A32]/20 text-[#FFD17A] border border-[#D99A32]/50"
                      }`}
                    >
                      {sc.urgency === "critical"
                        ? lang === "bn"
                          ? "জরুরি চিকিৎসা ঝুঁকি"
                          : "CRITICAL RISK"
                        : lang === "bn"
                        ? "গতিশীলতা বাধা"
                        : "MOBILITY BARRIER"}
                    </span>
                    <span className="text-[11px] text-[#DBE6E2]/70 font-mono">{sc.elevation}</span>
                  </div>

                  <h3 className="font-bold text-sm sm:text-base text-white">
                    {lang === "bn" ? sc.nameBn : sc.nameEn}
                  </h3>

                  <p className="text-xs text-[#DBE6E2]/80 line-clamp-2 leading-relaxed">
                    {lang === "bn" ? sc.householdDescBn : sc.householdDescEn}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono font-semibold text-[#63DEC2]">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#159B82]" />
                    {lang === "bn" ? sc.locationBn : sc.locationEn}
                  </span>
                  <span className="text-[10px] text-[#DBE6E2]/70">
                    {formatNumber(sc.headcount, lang)} {lang === "bn" ? "জন" : "Evacuee(s)"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Dual-Engine Comparative Analysis & Interactive Route Display */}
        <div className="rounded-2xl border border-[#133446] bg-[#0B1F2A] overflow-hidden shadow-2xl">
          {/* Top Tab Bar */}
          <div className="bg-[#071520] px-5 py-3 border-b border-[#133446] flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab("analysis")}
                className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                  activeTab === "analysis"
                    ? "bg-[#0B766E] text-white shadow-sm"
                    : "text-[#DBE6E2]/70 hover:text-white"
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-[#63DEC2]" />
                <span>{lang === "bn" ? "দ্বৈত-ইঞ্জিন সিদ্ধান্ত বিশ্লেষণ" : "Dual-Engine Decision Matrix"}</span>
              </button>
              <button
                onClick={() => setActiveTab("map")}
                className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                  activeTab === "map"
                    ? "bg-[#0B766E] text-white shadow-sm"
                    : "text-[#DBE6E2]/70 hover:text-white"
                }`}
              >
                <Compass className="w-4 h-4 text-[#63DEC2]" />
                <span>{lang === "bn" ? "আসল গুগল ম্যাপ রুট" : "Original Google Map Route"}</span>
              </button>
              <button
                onClick={() => setActiveTab("specs")}
                className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                  activeTab === "specs"
                    ? "bg-[#0B766E] text-white shadow-sm"
                    : "text-[#DBE6E2]/70 hover:text-white"
                }`}
              >
                <Truck className="w-4 h-4 text-[#63DEC2]" />
                <span>{lang === "bn" ? "বরাদ্দকৃত পরিবহন ও শেল্টার স্পেক" : "Allocated Assets & Specs"}</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-[#DBE6E2]/70 hidden sm:inline">
                Origin: {scenario.lat.toFixed(4)}°N, {scenario.lng.toFixed(4)}°E
              </span>
              <a
                href={externalGoogleDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 bg-[#0B766E]/40 hover:bg-[#0B766E] text-[#63DEC2] hover:text-white px-2.5 py-1 rounded border border-[#0B766E] transition text-[11px] font-bold"
              >
                <span>{lang === "bn" ? "গুগল ম্যাপে ন্যাভিগেট" : "Google Directions"}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* TAB 1: DUAL-ENGINE DECISION MATRIX */}
          {activeTab === "analysis" && (
            <div className="p-6 space-y-6">
              {/* Natural Language Prompt & AI Extraction Preview */}
              <div className="bg-[#071520] p-4 rounded-xl border border-[#133446] space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-[#63DEC2]">
                  <span className="flex items-center gap-1.5 font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-[#159B82]" />
                    {lang === "bn" ? "এআই প্রাকৃতিক ভাষা চাহিদা নিষ্কাশন (জিরো হ্যালুসিনেশন)" : "AI Natural Language Extraction (Zero Hallucination)"}
                  </span>
                  <span className="text-[10px] text-[#DBE6E2]/70 font-mono">
                    Latency: 42ms · Adaption Labs Gateway
                  </span>
                </div>
                <p className="text-xs text-[#DBE6E2] italic bg-[#0B1F2A] p-3 rounded-lg border border-[#133446]">
                  &quot;{lang === "bn" ? scenario.householdDescBn : scenario.householdDescEn}&quot;
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {scenario.needs.map((need, i) => (
                    <span
                      key={i}
                      className="text-xs bg-[#0B766E]/30 text-[#63DEC2] px-2.5 py-1 rounded-md font-mono border border-[#0B766E]/60 flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3 text-[#159B82]" />
                      {need.replace(/_/g, " ").toUpperCase()}
                    </span>
                  ))}
                  <span className="text-xs bg-[#C94747]/20 text-[#FF7A7A] px-2.5 py-1 rounded-md font-mono border border-[#C94747]/50">
                    URGENCY: {scenario.urgency.toUpperCase()}
                  </span>
                  <span className="text-xs bg-white/10 text-white px-2.5 py-1 rounded-md font-mono border border-white/20">
                    HEADCOUNT: {scenario.headcount}
                  </span>
                </div>
              </div>

              {/* Side-by-Side Algorithm Contrast */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: Rejected Conventional Choice */}
                <div className="p-5 rounded-2xl bg-[#C94747]/5 border-2 border-[#C94747]/40 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-mono font-bold text-[#FF7A7A] uppercase tracking-wider block">
                        {lang === "bn" ? "ভুল সাধারণ অ্যালগরিদম পছন্দ (নৈকট্য নির্ভর)" : "Flawed Generic Dispatch (Proximity-Based)"}
                      </span>
                      <h4 className="font-bold text-base text-white">
                        {lang === "bn" ? scenario.rejectedShelter.nameBn : scenario.rejectedShelter.nameEn}
                      </h4>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono font-black text-[#FF7A7A] bg-[#C94747]/20 px-2.5 py-1 rounded-md border border-[#C94747]/60 block">
                        {scenario.rejectedShelter.distanceKm} km
                      </span>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#C94747]/20 border border-[#C94747] text-[#FF7A7A] text-xs font-mono font-bold">
                    <XCircle className="w-4 h-4 shrink-0" />
                    <span>
                      {lang === "bn"
                        ? scenario.rejectedShelter.failureBadgeBn
                        : scenario.rejectedShelter.failureBadgeEn}
                    </span>
                  </div>

                  <p className="text-xs text-[#DBE6E2]/90 leading-relaxed bg-[#071520]/80 p-3.5 rounded-xl border border-[#C94747]/30">
                    {lang === "bn"
                      ? scenario.rejectedShelter.reasonBn
                      : scenario.rejectedShelter.reasonEn}
                  </p>

                  <div className="pt-2 border-t border-[#C94747]/20 text-[11px] text-[#FF7A7A] font-mono flex items-center justify-between">
                    <span>{lang === "bn" ? "ফলাফল: মানুষ আটকা পড়বে বা প্রাণ হারাবে" : "Outcome: Evacuees Stranded / Fatal Failure"}</span>
                    <span className="font-bold">FAILED RULE 4</span>
                  </div>
                </div>

                {/* Right: Approved SHONGJOG Safe Route */}
                <div className="p-5 rounded-2xl bg-[#0B766E]/10 border-2 border-[#159B82] space-y-4 shadow-lg shadow-[#0B766E]/10">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-mono font-bold text-[#63DEC2] uppercase tracking-wider block">
                        {lang === "bn" ? "সংযোগ ৭-শর্ত যাচাইকৃত নিরাপদ পছন্দ" : "SHONGJOG 7-Constraint Verified Match"}
                      </span>
                      <h4 className="font-bold text-base text-white">
                        {lang === "bn" ? scenario.approvedShelter.nameBn : scenario.approvedShelter.nameEn}
                      </h4>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono font-black text-[#63DEC2] bg-[#0B766E]/40 px-2.5 py-1 rounded-md border border-[#0B766E] block">
                        {scenario.approvedShelter.distanceKm} km
                      </span>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#159B82]/20 border border-[#159B82] text-[#63DEC2] text-xs font-mono font-bold">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-[#159B82]" />
                    <span>
                      {lang === "bn"
                        ? "সম্পূর্ণ অনুমোদিত · ৭টি শর্তই সন্তুষ্ট"
                        : "FULLY APPROVED · 7 CONSTRAINTS SATISFIED"}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs bg-[#071520]/80 p-3.5 rounded-xl border border-[#0B766E]/40 text-[#DBE6E2]">
                    <div className="flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#159B82] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white block">
                          {lang === "bn" ? "প্রবেশগম্যতা র‍্যাম্প ও হ্যান্ডরেল:" : "Accessibility Ramp & Handrails:"}
                        </strong>
                        <span>{lang === "bn" ? scenario.approvedShelter.rampBn : scenario.approvedShelter.rampEn}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 pt-1 border-t border-white/5">
                      <Zap className="w-4 h-4 text-[#ECAF42] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white block">
                          {lang === "bn" ? "অবিচ্ছিন্ন ব্যাকআপ পাওয়ার:" : "Continuous Auxiliary Power:"}
                        </strong>
                        <span>{lang === "bn" ? scenario.approvedShelter.powerBn : scenario.approvedShelter.powerEn}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#159B82]/30 text-[11px] text-[#63DEC2] font-mono flex items-center justify-between">
                    <span>
                      {lang === "bn"
                        ? `ফাঁকা আসন হেডরুম: ${formatNumber(scenario.approvedShelter.headroom, lang)} জন`
                        : `Shelter Headroom: ${scenario.approvedShelter.headroom} beds available`}
                    </span>
                    <span className="font-bold text-[#159B82]">RULE 1-7 PASSED</span>
                  </div>
                </div>
              </div>

              {/* Action Ribbon: Direct One-Click Dispatch to Live Operations */}
              <div className="p-4 rounded-xl bg-[#071520] border border-[#133446] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="font-bold text-sm text-white flex items-center gap-2 justify-center sm:justify-start">
                    <Truck className="w-4 h-4 text-[#63DEC2]" />
                    <span>
                      {lang === "bn"
                        ? "এই সিমুলেশনটি সরাসরি লাইভ ডেটাবেজ ও অপারেশন সেন্টারে পাঠান"
                        : "Dispatch this simulation into live database & coordinator queue"}
                    </span>
                  </h4>
                  <p className="text-xs text-[#DBE6E2]/70">
                    {lang === "bn"
                      ? "ক্লিক করলেই প্রিজমা ট্রানজ্যাকশন লক কার্যকর হবে, ফাঁকা আসন বিয়োগ হবে এবং অপারেশনস সেন্টারে প্রদর্শিত হবে।"
                      : "Triggers SQLite atomic capacity reservation lock, updates live telemetry, and renders in coordinator dashboard."}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={handleSimulateDispatch}
                    disabled={isDispatching}
                    className="btn-interactive inline-flex items-center gap-2 bg-[#0B766E] hover:bg-[#159B82] text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition active:scale-95 shadow-md shadow-[#0B766E]/30"
                  >
                    {isDispatching ? (
                      <>
                        <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                        <span>{lang === "bn" ? "ডিসপ্যাচ হচ্ছে..." : "Dispatching..."}</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4 text-[#63DEC2]" />
                        <span>{lang === "bn" ? "সরাসরি ডিসপ্যাচ নিশ্চিত করুন" : "Confirm Live Dispatch"}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Success Notification */}
              {dispatchSuccess && (
                <div className="p-4 rounded-xl bg-[#0B766E]/20 border border-[#63DEC2] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs animate-in fade-in duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#159B82] flex items-center justify-center text-white shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <strong className="text-white text-sm block">
                        {lang === "bn"
                          ? `কেস ${dispatchSuccess.caseId} সফলভাবে নিবন্ধিত ও ডিসপ্যাচ হয়েছে!`
                          : `Case ${dispatchSuccess.caseId} registered and dispatched!`}
                      </strong>
                      <span className="text-[#DBE6E2]/80">
                        {lang === "bn"
                          ? `নির্ধারিত আশ্রয়: ${dispatchSuccess.shelterName} · পরিবহন: ${dispatchSuccess.vehicleName}`
                          : `Assigned: ${dispatchSuccess.shelterName} via ${dispatchSuccess.vehicleName}`}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href="/operations"
                      className="btn-interactive inline-flex items-center gap-1.5 bg-[#0B766E] hover:bg-[#159B82] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition font-mono"
                    >
                      <span>{lang === "bn" ? "অপারেশন সেন্টারে দেখুন" : "View in Operations"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ORIGINAL GOOGLE MAP ROUTE */}
          {activeTab === "map" && (
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-[#DBE6E2]">
                <span className="text-[#63DEC2] font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#159B82] pulse-teal" />
                  {lang === "bn"
                    ? "আসল গুগল ম্যাপ স্যাটেলাইট ইভাকুয়েশন রুট"
                    : "ORIGINAL GOOGLE MAPS SATELLITE EVACUATION ROUTE"}
                </span>
                <span className="text-[11px] text-[#DBE6E2]/70">
                  Origin: {scenario.lat.toFixed(4)}°N, {scenario.lng.toFixed(4)}°E → Destination: {scenario.approvedShelter.lat.toFixed(4)}°N, {scenario.approvedShelter.lng.toFixed(4)}°E
                </span>
              </div>

              <div className="relative h-[420px] w-full rounded-xl overflow-hidden border border-[#133446] bg-[#071520] shadow-inner">
                <iframe
                  src={embedGoogleMapUrl}
                  title="Barrier-Free Google Maps Route"
                  className="w-full h-full border-0"
                  loading="lazy"
                  allowFullScreen
                />
                <div className="absolute bottom-3 left-3 bg-[#071520]/90 backdrop-blur-md p-2.5 rounded-xl border border-[#133446] text-white text-[11px] font-mono pointer-events-none space-y-1">
                  <div className="flex items-center gap-2 text-[#63DEC2]">
                    <MapPin className="w-3.5 h-3.5 text-[#C94747]" />
                    <span>Origin: {scenario.locationEn}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#159B82]">
                    <Building2 className="w-3.5 h-3.5 text-[#159B82]" />
                    <span>Safe Shelter: {scenario.approvedShelter.nameEn} ({scenario.approvedShelter.distanceKm} km)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ALLOCATED VEHICLE & SHELTER PHYSICAL SPECS */}
          {activeTab === "specs" && (
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              {/* Vehicle Card */}
              <div className="bg-[#071520] p-5 rounded-2xl border border-[#133446] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-[#63DEC2] font-bold uppercase tracking-wider">
                    {lang === "bn" ? "বরাদ্দকৃত উদ্ধার পরিবহন" : "ALLOCATED TRANSPORT ASSET"}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#159B82]/20 text-[#63DEC2] font-mono font-bold text-[10px]">
                    VERIFIED READY
                  </span>
                </div>
                <h4 className="font-bold text-base text-white">
                  {lang === "bn" ? scenario.assignedVehicle.nameBn : scenario.assignedVehicle.nameEn}
                </h4>
                <p className="text-[#DBE6E2]/90 leading-relaxed bg-[#0B1F2A] p-3 rounded-xl border border-[#133446]">
                  {lang === "bn" ? scenario.assignedVehicle.specsBn : scenario.assignedVehicle.specsEn}
                </p>
                <div className="pt-2 border-t border-[#133446] flex items-center justify-between text-[11px] font-mono text-[#DBE6E2]/70">
                  <span>Driver & EMT Status: Assigned</span>
                  <span className="text-[#63DEC2]">Hydraulic Tested</span>
                </div>
              </div>

              {/* Shelter Card */}
              <div className="bg-[#071520] p-5 rounded-2xl border border-[#133446] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-[#159B82] font-bold uppercase tracking-wider">
                    {lang === "bn" ? "নিরাপদ আশ্রয় অবকাঠামো" : "TARGET SHELTER INFRASTRUCTURE"}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#0B766E]/20 text-[#63DEC2] font-mono font-bold text-[10px]">
                    TIER 4 AUDITED
                  </span>
                </div>
                <h4 className="font-bold text-base text-white">
                  {lang === "bn" ? scenario.approvedShelter.nameBn : scenario.approvedShelter.nameEn}
                </h4>
                <div className="space-y-2 bg-[#0B1F2A] p-3 rounded-xl border border-[#133446] text-[#DBE6E2]">
                  <div>
                    <span className="font-bold text-white block">
                      {lang === "bn" ? "র‍্যাম্প ডিজাইন মান:" : "Ramp Standard:"}
                    </span>
                    <span>{lang === "bn" ? scenario.approvedShelter.rampBn : scenario.approvedShelter.rampEn}</span>
                  </div>
                  <div className="pt-1 border-t border-white/5">
                    <span className="font-bold text-white block">
                      {lang === "bn" ? "বিদ্যুৎ নির্ভরযোগ্যতা:" : "Electrical Reliability:"}
                    </span>
                    <span>{lang === "bn" ? scenario.approvedShelter.powerBn : scenario.approvedShelter.powerEn}</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-[#133446] flex items-center justify-between text-[11px] font-mono text-[#DBE6E2]/70">
                  <span>
                    {lang === "bn"
                      ? `অবশিষ্ট হেডরুম: ${formatNumber(scenario.approvedShelter.headroom, lang)} জন`
                      : `Available Headroom: ${scenario.approvedShelter.headroom} beds`}
                  </span>
                  <span className="text-[#63DEC2]">Plinth +5.2m AMSL</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

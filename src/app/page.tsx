"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
  MapPin,
  CheckCircle2,
  XCircle,
  Sparkles,
  Compass,
  UserCheck,
  Cpu,
  Database,
  Server,
} from "lucide-react";
import AnimatedHeroMap from "@/components/AnimatedHeroMap";
import InteractiveWalkthrough from "@/components/InteractiveWalkthrough";
import LiveRouteCalculator from "@/components/LiveRouteCalculator";
import { useTranslation } from "@/lib/i18n";

export default function LandingPage() {
  const { lang, t } = useTranslation();
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [activeArchNode, setActiveArchNode] = useState<string>("engine");

  const photoAssets = [
    {
      src: "/images/delta_embankment_river.webp",
      titleEn: "Dacope Delta Embankment Zone",
      titleBn: "দাকোপ ডেল্টা বেড়িবাঁধ অঞ্চল",
      coords: "22.57° N, 89.51° E · 1.4m AMSL",
      descEn: "Narrow earthen embankments in southwestern Bangladesh. High-tide storm surges wash out mud tracks within 45 minutes, isolating non-ambulatory residents.",
      descBn: "দক্ষিণ-পশ্চিম উপকূলীয় মাটির বেড়িবাঁধ। জোয়ারের তোড়ে ৪৫ মিনিটের মধ্যে কাঁচা পথ তলিয়ে যায়, ফলে চলাচলে অক্ষম মানুষ আটকা পড়ে।",
      creditEn: "Photo: Ashif Anam Siddique · CC BY 3.0",
      creditBn: "ছবি: আশিফ আনাম সিদ্দিকী · CC BY 3.0",
    },
    {
      src: "/images/accessible_boarding_ramp.webp",
      titleEn: "Verified 1:12 Step-Free Ramp",
      titleBn: "প্রকৌশলী-পরীক্ষিত ১:১২ ধাপমুক্ত র‍্যাম্প",
      coords: "Dacope Model Shelter · Plinth +5.2m",
      descEn: "Continuous switchback ramp with 900mm double handrails, verified for wheelchair self-ascent and stretcher roll-in during cyclone signal 7.",
      descBn: "৯০০ মিমি দ্বৈত নিরাপত্তা রেলিংযুক্ত অবিচ্ছিন্ন সুইচব্যাক র‍্যাম্প, ঘূর্ণিঝড় সিগন্যাল ৭-এ হুইলচেয়ার ও স্ট্রেচার ওঠানোর জন্য অনুমোদিত।",
      creditEn: "Photo: CDD & PreventionWeb · CC BY 4.0",
      creditBn: "ছবি: সিডিডি ও প্রিভেনশনওয়েব · CC BY 4.0",
    },
    {
      src: "/images/riverine_transport_vessel.webp",
      titleEn: "Roll-on Roll-off Rescue Vessel Alpha",
      titleBn: "রোল-অন রোল-অফ উদ্ধারকারী জলযান আলফা",
      coords: "Chalna River Ghat Fleet · Shallow Draft",
      descEn: "Amphibious riverine craft with folding hydraulic ramp and 2 floor-lock wheelchair anchors for flooded mudbank evacuation.",
      descBn: "উপকূলীয় প্লাবনে উদ্ধারের জন্য ভাঁজযোগ্য হাইড্রলিক র‍্যাম্প ও ২টি হুইলচেয়ার ফ্লোর-লকযুক্ত উভচর অগভীর জলযান।",
      creditEn: "Photo: Tareq Salahuddin · CC BY 2.0",
      creditBn: "ছবি: তারেক সালাহউদ্দিন · CC BY 2.0",
    },
    {
      src: "/images/emergency_operations_coordination.webp",
      titleEn: "Emergency Operations Coordination Room",
      titleBn: "জরুরি অপারেশন সমন্বয় কেন্দ্র",
      coords: "Khulna Civil Defense Command Center",
      descEn: "Human-in-the-loop oversight post tracking live Google Maps GIS telemetry and authorizing algorithmic matching recommendations.",
      descBn: "গুগল ম্যাপস জিআইএস টেলিমেট্রি পর্যবেক্ষণ এবং অ্যালগরিদমিক ম্যাচিং সুপারিশসমূহ অনুমোদনকারী মানবিক তদারকি কেন্দ্র।",
      creditEn: "Photo: UN OCHA · CC BY 3.0",
      creditBn: "ছবি: জাতিসংঘ ওসিএইচএ · CC BY 3.0",
    },
  ];

  // Architecture Nodes Details in English and Bangla
  const archNodesEn: Record<string, { title: string; subtitle: string; tech: string; desc: string }> = {
    intake: {
      title: "Citizen & Caregiver Intake",
      subtitle: "Multilingual Plain Language Gateway",
      tech: "Next.js 16 App Router · Web Speech API · Offline IndexedDB PWA",
      desc: "Captures natural-language voice or text assistance requests in colloquial Bengali, Banglish, or English without demanding clinical medical diagnoses.",
    },
    api: {
      title: "API Gateway & Schema Validation",
      subtitle: "Strict Server-Side Zod Layer",
      tech: "Next.js Route Handlers · Zod 3.x Validation · Rate Limiting",
      desc: "Sanitizes and validates incoming payloads with strict bounds checking. Rejects unverified input structures before persistence.",
    },
    ai: {
      title: "AI Needs Understanding Engine",
      subtitle: "Dialect & Barrier Extraction",
      tech: "Adaption Labs Structured Extraction API · Deterministic Regex Heuristics",
      desc: "Translates conversational phrases into structured support schemas (mobility, sensory, life-support power). Generates candidate needs with zero hallucinations.",
    },
    engine: {
      title: "Deterministic Constraint Engine",
      subtitle: "7 Non-Negotiable Safety Rules",
      tech: "TypeScript In-Memory Heuristics · Haversine Spatial Distance",
      desc: "Enforces non-negotiable physical rules: proximity never excuses inaccessibility. Closer walkup shelters with steep stairs are strictly rejected for wheelchair users.",
    },
    database: {
      title: "Persistent State & Concurrency Lock",
      subtitle: "Relational Ledger & Audit Trail",
      tech: "Prisma ORM · SQLite Atomic Transactions · Foreign Key Guards",
      desc: "Manages capacity reservations with immediate database transaction locks, preventing double-booking vehicles or over-allocating remaining shelter headroom.",
    },
    coordinator: {
      title: "Human Coordinator Command",
      subtitle: "Accountable Decision Authority",
      tech: "Google Maps Platform · Live Telemetry Dashboard",
      desc: "Ensures human-in-the-loop oversight: AI proposes candidate matches, but only an authorized emergency coordinator can authorize binding dispatches.",
    },
    responder: {
      title: "Tactical Field Responder App",
      subtitle: "Data-Minimized Mobile Terminal",
      tech: "Mobile-First PWA · Google Maps Turn-by-Turn Navigation Deep-Links",
      desc: "Provides rescue teams with landmark rendezvous instructions and functional physical handling guidance while preserving citizen personal privacy.",
    },
  };

  const archNodesBn: Record<string, { title: string; subtitle: string; tech: string; desc: string }> = {
    intake: {
      title: "নাগরিক ও যত্নকারী আবেদন গ্রহণ",
      subtitle: "বহুভাষিক সহজ ভাষা গেটওয়ে",
      tech: "Next.js 16 App Router · Web Speech API · অফলাইন IndexedDB PWA",
      desc: "চিকিৎসাগত পরিভাষার জটিলতা ছাড়াই কথ্য বাংলা, বাংলিশ বা ইংরেজিতে প্রাকৃতিক ভয়েস বা টেক্সট জরুরি অনুরোধ গ্রহণ করে।",
    },
    api: {
      title: "এপিআই গেটওয়ে ও স্কিমা যাচাইকরণ",
      subtitle: "কঠোর সার্ভার-সাইড Zod লেয়ার",
      tech: "Next.js Route Handlers · Zod 3.x Validation · রেট লিমিটিং",
      desc: "কঠোর সীমা যাচাই করে ইনপুট তথ্য প্রক্রিয়াজাত করে। ডেটাবেজে সংরক্ষণের আগেই অযাচাইকৃত ডেটা প্রত্যাখ্যান করে।",
    },
    ai: {
      title: "এআই শারীরিক চাহিদা বিশ্লেষণ ইঞ্জিন",
      subtitle: "উপভাষা ও প্রতিবন্ধকতা নিষ্কাশন",
      tech: "Adaption Labs Structured Extraction API · ডিটারমিনিস্টিক রিজেক্স",
      desc: "কথ্য বিবরণীকে সুনির্দিষ্ট সহায়তা কাঠামোতে (গতিশীলতা, দৃষ্টি/শ্রবণ, বিদ্যুৎ-নির্ভর চিকিৎসা) রূপান্তর করে। কোনো প্রকার ভুল তথ্য ছাড়াই সঠিক সহায়তা চিহ্নিত করে।",
    },
    engine: {
      title: "ডিটারমিনিস্টিক কনস্ট্রেইন্ট ইঞ্জিন",
      subtitle: "৭টি অপরিবর্তনীয় নিরাপত্তা শর্ত",
      tech: "TypeScript In-Memory Heuristics · হাভারসাইন দূরত্ব অ্যালগরিদম",
      desc: "কঠোর বাস্তব নিয়ম কার্যকর করে: ভৌগোলিক নৈকট্য কখনোই অপ্রবেশগম্যতার অজুহাত হতে পারে না। খাড়া সিঁড়িযুক্ত নিকটবর্তী আশ্রয়কেন্দ্র হুইলচেয়ার ব্যবহারকারীদের জন্য কঠোরভাবে বর্জন করা হয়।",
    },
    database: {
      title: "স্থিতিশীল স্টেট ও কনকারেন্সি লক",
      subtitle: "সম্পর্কযুক্ত লেজার ও অডিট ট্রেইল",
      tech: "Prisma ORM · SQLite Atomic Transactions · ফরেন কি গার্ডস",
      desc: "তাৎক্ষণিক ডেটাবেজ লেনদেন লকের মাধ্যমে পরিবহন ও আশ্রয়ের সক্ষমতা সংরক্ষণ করে, যাতে কোনো ডাবল বুকিং বা অতিরিক্ত বরাদ্দ না হয়।",
    },
    coordinator: {
      title: "দায়িত্বপ্রাপ্ত সমন্বয়কারী কমান্ড",
      subtitle: "জবাবদিহিমূলক সিদ্ধান্ত গ্রহণের ক্ষমতা",
      tech: "Google Maps Platform · লাইভ টেলিমেট্রি ড্যাশবোর্ড",
      desc: "এআই প্রাথমিক সুপারিশ প্রদান করে, তবে কেবল অনুমোদিত জরুরি সমন্বয়কারীই চূড়ান্ত ডিসপ্যাচ অনুমোদন করতে পারেন।",
    },
    responder: {
      title: "মাঠপর্যায়ের রেসপন্ডার টার্মিনাল",
      subtitle: "সুরক্ষিত ও সংক্ষিপ্ত মোবাইল পোর্টাল",
      tech: "Mobile-First PWA · গুগল ম্যাপ টার্ন-বাই-টার্ন নেভিগেশন",
      desc: "উদ্ধারকারী দলকে ল্যান্ডমার্কভিত্তিক গন্তব্য নির্দেশনা ও বিশেষ শারীরিক যত্ন নির্দেশিকা প্রদান করে নাগরিকের গোপনীয়তা নিশ্চিত করে।",
    },
  };

  const currentArchNode = (lang === "bn" ? archNodesBn : archNodesEn)[activeArchNode] || archNodesEn[activeArchNode];

  return (
    <div className="flex flex-col min-h-screen font-sans bg-[#F7F9F8]">
      {/* SECTION 1: CINEMATIC SPLIT-SCREEN HERO */}
      <section className="relative hero-gradient text-white pt-8 pb-16 px-4 sm:px-6 lg:px-8 border-b border-[#103946]">
        <div className="max-w-[1240px] mx-auto space-y-6">
          {/* Simulation Status Disclosure Banner */}
          <div className="bg-[#103946]/95 border border-[#087B72]/70 rounded-xl px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs shadow-sm">
            <div className="flex items-center gap-2 text-[#68DCC3] font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-[#D99A32] animate-pulse" />
              <span>{lang === "bn" ? "ডেমো সিমুলেশন — সরাসরি জরুরি সেবা নয়" : "DEMO SIMULATION — NOT A LIVE EMERGENCY SERVICE"}</span>
            </div>
            <div className="text-[11px] font-mono text-[#DCE6E2]/90 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#159B82]" />
              <span>
                {lang === "bn"
                  ? "উপকূলীয় প্লাবন প্রোটোকল · দাকোপ উপজেলা, খুলনা সেক্টর (২২.৫৭° উত্তর, ৮৯.৫১° পূর্ব)"
                  : "Coastal Inundation Protocol · Dacope Upazila, Khulna Sector (22.57°N, 89.51°E)"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 bg-[#103946] border border-[#087B72]/60 text-[#68DCC3] px-3.5 py-1 rounded-full text-xs font-mono font-bold">
                <span className="w-2 h-2 rounded-full bg-[#159B82]" />
                <span>{lang === "bn" ? "অন্তর্ভুক্তিমূলক জরুরি প্রবেশগম্য নেটওয়ার্ক" : "INCLUSIVE EMERGENCY ACCESS NETWORK"}</span>
              </div>

              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                  {t("hero_title_1")}
                </h1>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#68DCC3] leading-snug">
                  {t("hero_title_2")}
                </h2>
                <p className="text-sm sm:text-base font-semibold text-[#DCE6E2] pt-1 leading-relaxed">
                  {lang === "bn"
                    ? "জরুরি সহায়তা সবার কাছে পৌঁছানো উচিত — বিশেষ করে যারা সবচেয়ে বেশি অবহেলিত। সংযোগ জরুরি পরিস্থিতিতে প্রতিবন্ধী ব্যক্তি ও প্রবীণদের যাচাইকৃত নিরাপদ পরিবহন, প্রবেশগম্য আশ্রয় ও মাঠপর্যায়ের উদ্ধারকারী দলের সাথে সংযুক্ত করে।"
                    : "Emergency assistance should reach everyone — including those most often left behind. SHONGJOG connects people with accessibility-aware assistance, verified resources, and coordinated field responders during emergencies."}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-[#DCE6E2]/90 leading-relaxed max-w-xl">
                {lang === "bn"
                  ? "উপভাষাবোধসম্পন্ন কৃত্রিম বুদ্ধিমত্তা, সুনির্দিষ্ট শারীরিক নিরাপত্তা শর্তাবলী এবং জবাবদিহিমূলক নাগরিক সমন্বয়ের মাধ্যমে সংযোগ আগাম সতর্কতা ও বাস্তব উদ্ধারকাজের মধ্যকার ব্যবধান দূর করে।"
                  : "SHONGJOG bridges the gap between emergency warnings and physical rescue through dialect-aware AI, deterministic physical safety constraints, and accountable civil-defense oversight."}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3.5 pt-2">
                <Link
                  href="/request-help"
                  className="btn-interactive inline-flex items-center gap-2 bg-[#C94747] hover:bg-[#b03838] text-white px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition border border-white/20 shadow-sm"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>{lang === "bn" ? "জরুরি সহায়তার আবেদন" : "Request Assistance"}</span>
                </Link>

                <Link
                  href="/operations"
                  className="btn-interactive inline-flex items-center gap-2 bg-[#087B72] hover:bg-[#06635c] text-white px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition border border-[#159B82]/50 shadow-sm"
                >
                  <Radio className="w-4 h-4 text-[#68DCC3]" />
                  <span>{lang === "bn" ? "অপারেশন সিস্টেম দেখুন" : "Explore Operations System"}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="#how-it-works"
                  className="btn-interactive inline-flex items-center gap-2 bg-[#103946] hover:bg-[#164c5d] text-[#68DCC3] hover:text-white px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition border border-[#087B72]/50"
                >
                  <Sparkles className="w-4 h-4 text-[#68DCC3]" />
                  <span>{lang === "bn" ? "কীভাবে কাজ করে" : "See How It Works"}</span>
                </a>
              </div>

              {/* Core System Guarantees */}
              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-5 text-xs text-[#DCE6E2]/90 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-[#159B82]" />
                  <span>{lang === "bn" ? "বহুভাষিক (বাংলা, বাংলিশ, ইংরেজি)" : "Multilingual (বাংলা, Banglish, English)"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-[#159B82]" />
                  <span>{lang === "bn" ? "৭টি কঠোর শারীরিক নিরাপত্তা শর্ত" : "7 Hard Physical Constraints"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-[#159B82]" />
                  <span>{lang === "bn" ? "সমন্বয়কারী অনুমোদিত ডিসপ্যাচ" : "Coordinator-Authorized Dispatch"}</span>
                </div>
              </div>
            </div>

            {/* Right Split-Screen Column: Original Google Map & Documentary Photography Fusion */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-[#DCE6E2]/80 pb-0.5">
                <span className="font-bold text-[#68DCC3] flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-[#159B82]" />
                  {lang === "bn" ? "মাঠপর্যায়ের জিআইএস ও বাস্তব চিত্র" : "FIELD GIS & REALITY RADAR"}
                </span>
                <span className="text-[10px] bg-[#103946] text-[#68DCC3] px-2.5 py-0.5 rounded border border-[#087B72]/50 font-mono font-bold">
                  {lang === "bn" ? "আসল গুগল ম্যাপ লাইভ" : "ORIGINAL GOOGLE MAP LIVE"}
                </span>
              </div>

              {/* The Original Google Map is directly visible and fully interactive */}
              <div className="rounded-2xl overflow-hidden border border-[#103946] shadow-2xl">
                <AnimatedHeroMap />
              </div>

              {/* Field Reality Visual Inspector Strip directly docked below the map */}
              <div className="bg-[#0B1F2A] border border-[#103946] rounded-2xl p-3.5 space-y-3 shadow-xl">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#68DCC3]">
                  <span className="font-bold flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#159B82]" />
                    {lang === "bn" ? "উপকূলীয় বাস্তব তথ্যচিত্র ও সম্পদ পরিদর্শন" : "COASTAL FIELD ASSETS & REALITY AUDIT"}
                  </span>
                  <Link href="/resources" className="text-[10px] text-[#DCE6E2]/70 hover:text-white hover:underline">
                    {lang === "bn" ? "সব সম্পদ →" : "View All Assets →"}
                  </Link>
                </div>

                {/* 4 Interactive Photo Asset Tabs */}
                <div className="grid grid-cols-4 gap-2">
                  {photoAssets.map((photo, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActivePhotoIdx(idx)}
                      className={`relative h-14 rounded-xl overflow-hidden border transition-all ${
                        activePhotoIdx === idx
                          ? "border-[#68DCC3] ring-2 ring-[#68DCC3]/60 scale-102"
                          : "border-white/10 opacity-70 hover:opacity-100"
                      }`}
                      title={lang === "bn" ? photo.titleBn : photo.titleEn}
                    >
                      <Image
                        src={photo.src}
                        alt={photo.titleEn}
                        fill
                        className="object-cover"
                      />
                      <div className={`absolute inset-0 transition-colors ${activePhotoIdx === idx ? "bg-transparent" : "bg-black/40 hover:bg-transparent"}`} />
                    </button>
                  ))}
                </div>

                {/* Selected Asset Information Box */}
                <div className="bg-[#071520] p-3 rounded-xl border border-[#133446] space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <strong className="text-white font-bold truncate">
                      {lang === "bn" ? photoAssets[activePhotoIdx].titleBn : photoAssets[activePhotoIdx].titleEn}
                    </strong>
                    <span className="text-[10px] font-mono text-[#68DCC3] shrink-0">
                      {photoAssets[activePhotoIdx].coords}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#DCE6E2]/85 leading-snug">
                    {lang === "bn" ? photoAssets[activePhotoIdx].descBn : photoAssets[activePhotoIdx].descEn}
                  </p>
                  <div className="pt-1.5 border-t border-white/5 flex items-center justify-between text-[9px] font-mono text-[#DCE6E2]/60">
                    <span>{lang === "bn" ? photoAssets[activePhotoIdx].creditBn : photoAssets[activePhotoIdx].creditEn}</span>
                    <span className="text-[#159B82] font-semibold">WGS84 VERIFIED</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: LIVE BARRIER-FREE ROUTE & DUAL-ENGINE TRIAGE CALCULATOR */}
      <LiveRouteCalculator />

      {/* ROLE-BASED QUICK ENTRY PORTALS */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 border-b border-[#DCE6E2] bg-white">
        <div className="max-w-[1240px] mx-auto">
          <div className="max-w-2xl mx-auto text-center mb-10">
            <span className="text-[11px] uppercase tracking-wider font-mono font-bold text-[#087B72] bg-[#087B72]/10 px-3 py-1 rounded-full">
              {lang === "bn" ? "অপারেশনাল অ্যাক্সেস চ্যানেল" : "Operational Access Channels"}
            </span>
            <p className="text-2xl sm:text-3xl font-black text-[#152C35] mt-2 tracking-tight">
              {lang === "bn" ? "আপনার দায়িত্ব বা কাজের ধরন নির্বাচন করুন" : "Select your response workflow"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Citizen Intake Card */}
            <Link
              href="/request-help"
              className="pro-card pro-card-hover overflow-hidden flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-36 w-full bg-[#0B1F2A] overflow-hidden">
                  <Image
                    src="/images/community_evacuation_consultation.webp"
                    alt="Community evacuation consultation in coastal Bangladesh"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-2.5 left-3 flex items-center gap-1.5 text-white">
                    <div className="w-7 h-7 rounded-lg bg-[#C94747] flex items-center justify-center text-white shadow-md">
                      <Users className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                      {lang === "bn" ? "নাগরিক পোর্টাল" : "Citizen Portal"}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h4 className="font-bold text-base text-[#152C35] group-hover:text-[#087B72] transition">
                    {lang === "bn" ? "নাগরিক বা যত্নকারী" : "Citizen or Caregiver"}
                  </h4>
                  <p className="text-xs text-[#65777B] mt-1.5 leading-relaxed">
                    {lang === "bn"
                      ? "শারীরিক চাহিদার বিবরণ দিন (র‍্যাম্প, পথপ্রদর্শক, ইশারা ভাষা, অক্সিজেন)। ভয়েস বা টেক্সট ইনপুট। অফলাইনেও কার্যকর।"
                      : "Submit functional requirements (step-free ramp, visual guide, sign language, oxygen power). Text or voice input. Operates offline."}
                  </p>
                </div>
              </div>

              <div className="px-4 pb-4 pt-2 flex items-center justify-between text-xs font-bold text-[#C94747] border-t border-[#DCE6E2]/60">
                <span>{lang === "bn" ? "আবেদন জমা দিন" : "Submit Request"}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Operations Center Card */}
            <Link
              href="/operations"
              className="pro-card pro-card-hover overflow-hidden flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-36 w-full bg-[#0B1F2A] overflow-hidden">
                  <Image
                    src="/images/emergency_operations_coordination.webp"
                    alt="Emergency Operations Coordination Room"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-2.5 left-3 flex items-center gap-1.5 text-white">
                    <div className="w-7 h-7 rounded-lg bg-[#087B72] flex items-center justify-center text-white shadow-md">
                      <Radio className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#68DCC3]">
                      {lang === "bn" ? "কমান্ড সেন্টার" : "Command Center"}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h4 className="font-bold text-base text-[#152C35] group-hover:text-[#087B72] transition">
                    {lang === "bn" ? "জরুরি সমন্বয়কারী" : "Emergency Coordinator"}
                  </h4>
                  <p className="text-xs text-[#65777B] mt-1.5 leading-relaxed">
                    {lang === "bn"
                      ? "গুগল ম্যাপ জিআইএস টেলিমেট্রি পর্যবেক্ষণ করুন, অ্যালগরিদমিক নিরাপত্তা যাচাই পর্যালোচনা করুন এবং নিরাপদ ডিসপ্যাচ অনুমোদন করুন।"
                      : "Monitor live Google Maps GIS sector telemetry, review algorithmic constraint validations, and authorize safe dispatches."}
                  </p>
                </div>
              </div>

              <div className="px-4 pb-4 pt-2 flex items-center justify-between text-xs font-bold text-[#087B72] border-t border-[#DCE6E2]/60">
                <span>{lang === "bn" ? "কমান্ড অপারেশন" : "Command Operations"}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Field Responder Card */}
            <Link
              href="/responder"
              className="pro-card pro-card-hover overflow-hidden flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-36 w-full bg-[#0B1F2A] overflow-hidden">
                  <Image
                    src="/images/riverine_transport_vessel.webp"
                    alt="Riverine transport rescue vessel in Bangladesh"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-2.5 left-3 flex items-center gap-1.5 text-white">
                    <div className="w-7 h-7 rounded-lg bg-[#159B82] flex items-center justify-center text-white shadow-md">
                      <Truck className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#68DCC3]">
                      {lang === "bn" ? "মাঠপর্যায়ের বহর" : "Field Fleet"}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h4 className="font-bold text-base text-[#152C35] group-hover:text-[#087B72] transition">
                    {lang === "bn" ? "উদ্ধারকারী দল" : "Field Responder"}
                  </h4>
                  <p className="text-xs text-[#65777B] mt-1.5 leading-relaxed">
                    {lang === "bn"
                      ? "উদ্ধারকারী চালক ও স্বেচ্ছাসেবকদের জন্য মোবাইল পোর্টাল: অ্যাসাইনমেন্ট গ্রহণ করুন, যাত্রার স্থিতি আপডেট করুন এবং নিরাপদ পৌঁছানো নিশ্চিত করুন।"
                      : "Mobile-first task queue for rescue drivers and volunteer squads: accept assignments, log travel states, and confirm shelter arrival."}
                  </p>
                </div>
              </div>

              <div className="px-4 pb-4 pt-2 flex items-center justify-between text-xs font-bold text-[#159B82] border-t border-[#DCE6E2]/60">
                <span>{lang === "bn" ? "রেসপন্ডার টার্মিনাল" : "Field Terminal"}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Asset Registry Card */}
            <Link
              href="/resources"
              className="pro-card pro-card-hover overflow-hidden flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-36 w-full bg-[#0B1F2A] overflow-hidden">
                  <Image
                    src="/images/cyclone_shelter_infrastructure.webp"
                    alt="Cyclone Shelter Infrastructure in Patuakhali, Bangladesh"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-2.5 left-3 flex items-center gap-1.5 text-white">
                    <div className="w-7 h-7 rounded-lg bg-[#D99A32] flex items-center justify-center text-white shadow-md">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                      {lang === "bn" ? "সম্পদ লেজার" : "Asset Ledger"}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h4 className="font-bold text-base text-[#152C35] group-hover:text-[#087B72] transition">
                    {lang === "bn" ? "আশ্রয় ও সম্পদ রেজিস্ট্রি" : "Shelter & Asset Registry"}
                  </h4>
                  <p className="text-xs text-[#65777B] mt-1.5 leading-relaxed">
                    {lang === "bn"
                      ? "লাইভ সক্ষমতা ট্র্যাকিং: ধাপমুক্ত র‍্যাম্প ঢাল, জেনারেটর সক্ষমতা, স্যানিটারি সুবিধা এবং অতিরিক্ত স্থান গণনা।"
                      : "Live verification tracking: step-free ramp slopes, generator capacity, sanitary access, and headroom calculations."}
                  </p>
                </div>
              </div>

              <div className="px-4 pb-4 pt-2 flex items-center justify-between text-xs font-bold text-[#087B72] border-t border-[#DCE6E2]/60">
                <span>{lang === "bn" ? "সম্পদ লেজার" : "Asset Ledger"}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 2: INTERACTIVE PROBLEM EXPLANATION (How It Works) */}
      <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8 border-b border-[#DCE6E2] bg-[#EDF3F1]">
        <div className="max-w-[1240px] mx-auto space-y-10">
          <div className="max-w-3xl">
            <span className="text-[11px] uppercase tracking-wider font-mono font-bold text-[#087B72] bg-[#087B72]/10 px-3 py-1 rounded-full">
              {lang === "bn" ? "সিস্টেম তুলনা" : "System Comparison"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#152C35] mt-2 tracking-tight">
              {lang === "bn" ? "কেন প্রচলিত সতর্কবার্তা মানুষকে পেছনে ফেলে দেয়" : "Why Conventional Warnings Leave People Behind"}
            </h2>
            <p className="text-xs sm:text-sm text-[#65777B] mt-2 leading-relaxed">
              {lang === "bn"
                ? "প্রচলিত দুর্যোগ ব্যবস্থাপনা ধরে নেয় যে তথ্য প্রচার করলেই মানুষ সরে যাবে। কিন্তু শারীরিক প্রতিবন্ধকতা বা জীবনরক্ষাকারী বিদ্যুৎনির্ভর ব্যক্তিদের জন্য সমন্বিত পরিবহন ছাড়া কেবল সতর্কবার্তা ভয়াবহ পরিণতি ডেকে আনে।"
                : "Standard civil defense models assume information broadcast equals evacuation. But for individuals facing mobility, sensory, or electrical life-support barriers, warnings without coordinated assistance result in catastrophic failure."}
            </p>
          </div>

          {/* Interactive Contrast Diagram */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* The Conventional Failure Pipeline */}
            <div className="pro-card p-6 border-l-4 border-l-[#C94747] space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#C94747] uppercase tracking-wider">
                  {lang === "bn" ? "প্রচলিত সতর্কীকরণ মডেল" : "Conventional Warning Model"}
                </span>
                <span className="text-[10px] bg-[#C94747]/10 text-[#C94747] font-bold px-2 py-0.5 rounded">
                  {lang === "bn" ? "বিচ্ছিন্ন প্রবেশগম্যতা শৃঙ্খল" : "BROKEN ACCESS CHAIN"}
                </span>
              </div>
              <p className="text-xs text-[#65777B] leading-relaxed">
                {lang === "bn"
                  ? "সাধারণ সাইরেন বাজানো → গণ এসএমএস পাঠানো → শারীরিক প্রবেশগম্যতা যাচাই নেই → চলাচলে অক্ষম ব্যক্তি ঘরে আটকা"
                  : "Generic sirens sound → Broadcast SMS delivered → No accessibility check → Non-ambulatory person stranded at home."}
              </p>
              <div className="space-y-2 pt-2 text-xs">
                <div className="p-3 rounded-lg bg-[#C94747]/5 border border-[#C94747]/20 flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-[#C94747] shrink-0 mt-0.5" />
                  <span className="text-[#152C35]">
                    <strong>{lang === "bn" ? "দৃষ্টি / শ্রবণ প্রতিবন্ধকতা: " : "Blind / Deaf Barrier: "}</strong>
                    {lang === "bn" ? "শব্দযুক্ত সাইরেন চোখে দেখা যায় না; ভিজ্যুয়াল সতর্ক পতাকা কানে শোনা যায় না।" : "Audio sirens cannot be seen; visual alert flags cannot be heard."}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-[#C94747]/5 border border-[#C94747]/20 flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-[#C94747] shrink-0 mt-0.5" />
                  <span className="text-[#152C35]">
                    <strong>{lang === "bn" ? "পরিবহন প্রতিবন্ধকতা: " : "Transport Barrier: "}</strong>
                    {lang === "bn" ? "সাধারণ ট্রলার ও অটো-রিকশায় হুইলচেয়ার ওঠানো বা লক করার ব্যবস্থা থাকে না।" : "Standard country boats and auto-rickshaws cannot secure wheelchairs."}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-[#C94747]/5 border border-[#C94747]/20 flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-[#C94747] shrink-0 mt-0.5" />
                  <span className="text-[#152C35]">
                    <strong>{lang === "bn" ? "আশ্রয়কেন্দ্র প্রতিবন্ধকতা: " : "Shelter Barrier: "}</strong>
                    {lang === "bn" ? "৭০% এর বেশি উপকূলীয় সাইক্লোন শেল্টারে ১:১২ ঢালের র‍্যাম্প নেই, ফলে নিচে আটকে থাকতে হয়।" : ">70% coastal shelters lack 1:12 ramps, leaving citizens outside at ground level."}
                  </span>
                </div>
              </div>
            </div>

            {/* The SHONGJOG Inclusive Coordination Chain */}
            <div className="pro-card p-6 border-l-4 border-l-[#087B72] space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#087B72] uppercase tracking-wider">
                  {lang === "bn" ? "সংযোগ সমন্বয় স্তর" : "SHONGJOG Coordination Layer"}
                </span>
                <span className="text-[10px] bg-[#087B72]/10 text-[#087B72] font-bold px-2 py-0.5 rounded">
                  {lang === "bn" ? "জবাবদিহিতামূলক সমন্বয় শৃঙ্খল" : "ACCOUNTABLE ACCESS CHAIN"}
                </span>
              </div>
              <p className="text-xs text-[#65777B] leading-relaxed">
                {lang === "bn"
                  ? "কথ্য আবেদন → এআই প্রতিবন্ধকতা বিশ্লেষণ → ৭টি শারীরিক নিরাপত্তা শর্ত → সমন্বয়কারী অনুমোদন → নিরাপদ আশ্রয় নিশ্চিত"
                  : "Natural request → AI barrier parsing → 7 physical constraints → Coordinator authorization → Safe arrival verified."}
              </p>
              <div className="space-y-2 pt-2 text-xs">
                <div className="p-3 rounded-lg bg-[#087B72]/5 border border-[#087B72]/20 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#087B72] shrink-0 mt-0.5" />
                  <span className="text-[#152C35]">
                    <strong>{lang === "bn" ? "কথ্য ভাষা গ্রহণ: " : "Dialect-Aware Intake: "}</strong>
                    {lang === "bn" ? "বাংলা ভয়েস/টেক্সট স্বয়ংক্রিয়ভাবে শারীরিক ও চিকিৎসা সহায়তার শর্তাবলীতে রূপান্তরিত হয়।" : "Bengali voice/text extracted into functional accommodation barriers."}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-[#087B72]/5 border border-[#087B72]/20 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#087B72] shrink-0 mt-0.5" />
                  <span className="text-[#152C35]">
                    <strong>{lang === "bn" ? "ডিটারমিনিস্টিক শর্তাবলী: " : "Deterministic Constraints: "}</strong>
                    {lang === "bn" ? "নৈকট্য কখনোই অপ্রবেশগম্যতার অজুহাত নয়; কঠোর ১:১২ র‍্যাম্প ও পরিবহন সক্ষমতা মেলানো।" : "Proximity never excuses inaccessibility; strict 1:12 ramp matching."}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-[#087B72]/5 border border-[#087B72]/20 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#087B72] shrink-0 mt-0.5" />
                  <span className="text-[#152C35]">
                    <strong>{lang === "bn" ? "নিশ্চিত আশ্রয় গ্রহণ: " : "Confirmed Delivery: "}</strong>
                    {lang === "bn" ? "কনকারেন্সি-লকড হেডরুম সমন্বয় এবং অপরিবর্তনীয় অডিট লগিং।" : "Concurrency-locked headroom decrements and immutable timeline logs."}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: THE ACCESSIBILITY EMERGENCY (EVIDENCE & CITATIONS) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-b border-[#DCE6E2]">
        <div className="max-w-[1240px] mx-auto space-y-10">
          <div className="max-w-3xl">
            <span className="text-[11px] uppercase tracking-wider font-mono font-bold text-[#087B72] bg-[#087B72]/10 px-3 py-1 rounded-full">
              {lang === "bn" ? "গবেষণা ও বৈশ্বিক প্রমাণ" : "Research & Global Evidence"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#152C35] mt-2 tracking-tight">
              {lang === "bn" ? "সতর্কবার্তা পেলেও সবাই কি বাস্তবে আশ্রয়কেন্দ্রে পৌঁছাতে পারে?" : "When everyone receives a warning, can everyone actually respond?"}
            </h2>
            <p className="text-xs sm:text-sm text-[#65777B] mt-2 leading-relaxed">
              {lang === "bn"
                ? "আন্তর্জাতিক দুর্যোগ ব্যবস্থাপনা গবেষণায় দেখা গেছে যে কেবল সাইরেন বা এসএমএস কখনো শারীরিক নিরাপত্তা নিশ্চিত করতে পারে না। উপযুক্ত যানবাহন বা সহায়তাকারী না থাকলে মানুষের পক্ষে সরে যাওয়া অসম্ভব।"
                : "Disaster management research demonstrates that early warning sirens and broadcast SMS alone do not guarantee physical safety. A person cannot evacuate if there is no step-free vehicle, no sighted guide, or no accessible shelter within safe reach."}
            </p>
          </div>

          {/* 3 UNDRR 2023 Global Survey Findings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stat 1: 84% */}
            <div className="pro-card p-6 border-t-4 border-t-[#C94747] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-4xl font-black text-[#C94747] tabular-nums">84%</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#C94747]/10 text-[#C94747] font-bold">
                  {lang === "bn" ? "বৈশ্বিক জরিপ" : "GLOBAL SURVEY"}
                </span>
              </div>
              <h4 className="font-bold text-base text-[#152C35]">
                {lang === "bn" ? "ব্যক্তিগত দুর্যোগ প্রস্তুতি পরিকল্পনা নেই" : "No Personal Disaster Preparedness Plan"}
              </h4>
              <p className="text-xs text-[#65777B] leading-relaxed">
                {lang === "bn"
                  ? "বিশ্বব্যাপী জরিপে ৮৪% প্রতিবন্ধী ব্যক্তি জানিয়েছেন যে দুর্যোগ আঘাত হানলে তাদের নিজস্ব কোনো উদ্ধার পরিকল্পনা বা সহায়তাকারী নির্ধারিত থাকে না।"
                  : "84% of surveyed persons with disabilities globally reported having no individual evacuation protocol or designated support person when sudden hazards strike."}
              </p>
              <div className="pt-3 border-t border-[#DCE6E2] text-[11px] font-mono text-[#087B72] flex items-center justify-between font-semibold">
                <span>{lang === "bn" ? "ইউএনডিআরআর ২০২৩ বৈশ্বিক জরিপ" : "UNDRR 2023 Global Survey"}</span>
                <span>{lang === "bn" ? "সাল: ২০২৩" : "Year: 2023"}</span>
              </div>
            </div>

            {/* Stat 2: 56% */}
            <div className="pro-card p-6 border-t-4 border-t-[#D99A32] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-4xl font-black text-[#D99A32] tabular-nums">56%</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#D99A32]/10 text-[#D99A32] font-bold">
                  {lang === "bn" ? "বৈশ্বিক জরিপ" : "GLOBAL SURVEY"}
                </span>
              </div>
              <h4 className="font-bold text-base text-[#152C35]">
                {lang === "bn" ? "প্রবেশগম্য দুর্যোগ তথ্যের অভাব" : "Lacked Accessible Disaster Information"}
              </h4>
              <p className="text-xs text-[#65777B] leading-relaxed">
                {lang === "bn"
                  ? "অর্ধেকের বেশি উত্তরদাতা জানিয়েছেন যে সরকারি সতর্কবার্তা তাদের বোধগম্য বা ইন্দ্রিয়-সহায়ক উপায়ে প্রদান করা হয় না।"
                  : "Over half of respondents reported that official disaster warnings and risk notifications were not delivered in formats accessible to their functional sensory needs."}
              </p>
              <div className="pt-3 border-t border-[#DCE6E2] text-[11px] font-mono text-[#087B72] flex items-center justify-between font-semibold">
                <span>{lang === "bn" ? "ইউএনডিআরআর প্রতিবন্ধিতা ঝুঁকি রিপোর্ট" : "UNDRR Disability Risk Report"}</span>
                <span>{lang === "bn" ? "সাল: ২০২৩" : "Year: 2023"}</span>
              </div>
            </div>

            {/* Stat 3: 23% */}
            <div className="pro-card p-6 border-t-4 border-t-[#087B72] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-4xl font-black text-[#087B72] tabular-nums">23%</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#087B72]/10 text-[#087B72] font-bold">
                  {lang === "bn" ? "বৈশ্বিক জরিপ" : "GLOBAL SURVEY"}
                </span>
              </div>
              <h4 className="font-bold text-base text-[#152C35]">
                {lang === "bn" ? "সতর্কবার্তা সত্ত্বেও একা সরতে অক্ষম" : "Unable to Evacuate Even With Adequate Warning"}
              </h4>
              <p className="text-xs text-[#65777B] leading-relaxed">
                {lang === "bn"
                  ? "প্রতি চারজনের মধ্যে প্রায় একজন জানিয়েছেন যে বিশেষ পরিবহন ও সহায়তা ছাড়া একা নিরাপদে সরে যাওয়া তাদের পক্ষে সম্ভব নয়।"
                  : "Nearly one in four would experience major physical difficulty or be entirely unable to evacuate alone without dedicated, accessible transportation."}
              </p>
              <div className="pt-3 border-t border-[#DCE6E2] text-[11px] font-mono text-[#087B72] flex items-center justify-between font-semibold">
                <span>{lang === "bn" ? "ইউএনডিআরআর বৈশ্বিক সমীক্ষা" : "UNDRR Global Evacuation Findings"}</span>
                <span>{lang === "bn" ? "সাল: ২০২৩" : "Year: 2023"}</span>
              </div>
            </div>
          </div>

          {/* Bangladesh-Specific Coastal Reality Box */}
          <div className="bg-[#EDF3F1] p-6 rounded-2xl border border-[#DCE6E2] space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C94747] pulse-critical" />
              <span className="text-xs font-mono font-bold text-[#152C35] uppercase tracking-wider">
                {lang === "bn" ? "মাঠপর্যায়ের তথ্যপ্রমাণ: বাংলাদেশের উপকূলীয় দুর্যোগ বাস্তবতা" : "Documented Field Evidence: Coastal Bangladesh Extreme Weather"}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#65777B]">
              <div className="space-y-1.5 bg-white p-4 rounded-xl border border-[#DCE6E2]">
                <strong className="text-[#152C35] block text-sm">
                  {lang === "bn" ? "৭০% এর বেশি আশ্রয়কেন্দ্রে ১:১২ র‍্যাম্পের অভাব" : ">70% Cyclone Shelters Lack 1:12 Ramps"}
                </strong>
                <p className="leading-relaxed">
                  {lang === "bn"
                    ? "খুলনা ও সাতক্ষীরায় প্রবেশগম্যতা অডিটে দেখা গেছে যে ৭০% এর বেশি কংক্রিট শেল্টারে কোনো র‍্যাম্প নেই অথবা অত্যন্ত খাড়া, ফলে হুইলচেয়ার ব্যবহারকারীদের কোলে করে তুলতে হয় অথবা নিচে ফেলে যেতে হয় (সিডিডি ও প্রিভেনশনওয়েব ২০২২)।"
                    : "Field accessibility audits in Khulna and Satkhira revealed that over 70% of concrete shelters lack ramps or exceed the safe 1:12 incline, forcing wheelchair users to be carried or left behind (CDD & PreventionWeb 2022)."}
                </p>
              </div>
              <div className="space-y-1.5 bg-white p-4 rounded-xl border border-[#DCE6E2]">
                <strong className="text-[#152C35] block text-sm">
                  {lang === "bn" ? "চরম আবহাওয়ায় ২ থেকে ৪ গুণ বেশি প্রাণহানি" : "2x–4x Higher Extreme Weather Mortality"}
                </strong>
                <p className="leading-relaxed">
                  {lang === "bn"
                    ? "উপকূলীয় জলোচ্ছ্বাসে গুরুতর শারীরিক বা সংবেদনশীল প্রতিবন্ধকতাযুক্ত ব্যক্তিদের মৃত্যুর হার সাধারণের তুলনায় ২ থেকে ৪ গুণ বেশি (এনআইএইচ PMC12997332)।"
                    : "During coastal storm surges, individuals with severe physical or sensory impairments experience 2 to 4 times higher injury and mortality rates due to delayed evacuation assistance (NIH PMC12997332)."}
                </p>
              </div>
              <div className="space-y-1.5 bg-white p-4 rounded-xl border border-[#DCE6E2]">
                <strong className="text-[#152C35] block text-sm">
                  {lang === "bn" ? "জোয়ারের পানিতে সরু মাটির বাঁধ তলিয়ে যাওয়া" : "Narrow Tidal Embankment Washouts"}
                </strong>
                <p className="leading-relaxed">
                  {lang === "bn"
                    ? "দাকোপ ও পাইকগাছায় জোয়ারের তোড়ে বাঁধ ভাঙার ৪৫ মিনিটের মধ্যে মাটির রাস্তা পানিতে নিমজ্জিত হয়, ফলে সাধারণ অ্যাম্বুলেন্স বা ইজিবাইক পৌঁছানো অসম্ভব হয়ে পড়ে।"
                    : "High-tide coastal inundations submerge earthen roads in Dacope and Paikgachha within 45 minutes of embankment breaches, cutting off standard three-wheelers and ambulances."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: INTERACTIVE PRODUCT DEMONSTRATION */}
      <section id="demo" className="py-16 px-4 sm:px-6 lg:px-8 bg-[#0B1F2A] border-b border-[#103946]">
        <div className="max-w-[1240px] mx-auto space-y-8">
          <div className="max-w-3xl">
            <span className="text-[11px] uppercase tracking-wider font-mono font-bold text-[#68DCC3] bg-[#087B72]/30 px-3 py-1 rounded-full border border-[#087B72]/50">
              {lang === "bn" ? "ইন্টারেক্টিভ ট্রায়াজ ওয়াকথ্রু" : "Interactive Triage Walkthrough"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-2 tracking-tight">
              {lang === "bn" ? "সম্পূর্ণ ইভাকুয়েশন সমন্বয় প্রক্রিয়াটি পরীক্ষা করুন" : "Test the end-to-end evacuation coordination workflow"}
            </h2>
            <p className="text-xs sm:text-sm text-[#DCE6E2]/80 mt-2 leading-relaxed">
              {lang === "bn"
                ? "নিচের ধাপগুলো অনুসরণ করে দেখুন কীভাবে একটি প্রাকৃতিক বাংলা আবেদন এআই দ্বারা বিশ্লেষিত হয়, ৭টি কঠোর শর্তের বিপরীতে যাচাই হয়, সমন্বয়কারী কর্তৃক অনুমোদিত হয় এবং নিরাপদ আশ্রয়কেন্দ্রে পৌঁছানো নিশ্চিত হয়।"
                : "Step through the stages below to see how a Bengali natural-language assistance request is parsed by AI, verified against 7 non-negotiable physical constraints, authorized by a human coordinator, and confirmed upon safe shelter arrival."}
            </p>
          </div>

          <InteractiveWalkthrough />
        </div>
      </section>

      {/* SECTION 5: INTERACTIVE TECHNICAL ARCHITECTURE DIAGRAM */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-b border-[#DCE6E2]">
        <div className="max-w-[1240px] mx-auto space-y-10">
          <div className="max-w-3xl">
            <span className="text-[11px] uppercase tracking-wider font-mono font-bold text-[#087B72] bg-[#087B72]/10 px-3 py-1 rounded-full">
              {lang === "bn" ? "প্রকৌশলগত আর্কিটেকচার" : "Engineering Architecture"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#152C35] mt-2 tracking-tight">
              {lang === "bn" ? "সমন্বিত রেসপন্স অবকাঠামো" : "End-to-End Coordination Infrastructure"}
            </h2>
            <p className="text-xs sm:text-sm text-[#65777B] mt-2 leading-relaxed">
              {lang === "bn"
                ? "নিচের যেকোনো নোডে ক্লিক করে তার ডেটা কন্ট্রাক্ট, টেকনোলজি স্ট্যাক ও নিরাপত্তা নিয়ন্ত্রণগুলো পরীক্ষা করুন।"
                : "Click any node in the architectural chain below to inspect its data contract, technology stack, and security controls."}
            </p>
          </div>

          {/* Interactive Pipeline Nodes */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {[
              { id: "intake", labelEn: "1. Intake", labelBn: "১. আবেদন", icon: FileText },
              { id: "api", labelEn: "2. API Gateway", labelBn: "২. এপিআই", icon: Server },
              { id: "ai", labelEn: "3. AI Parser", labelBn: "৩. এআই পার্সার", icon: Cpu },
              { id: "engine", labelEn: "4. Constraints", labelBn: "৪. কনস্ট্রেইন্ট", icon: ShieldCheck },
              { id: "database", labelEn: "5. Prisma DB", labelBn: "৫. প্রিজমা ডিবি", icon: Database },
              { id: "coordinator", labelEn: "6. Coordinator", labelBn: "৬. সমন্বয়কারী", icon: UserCheck },
              { id: "responder", labelEn: "7. Responder", labelBn: "৭. রেসপন্ডার", icon: Truck },
            ].map((node) => {
              const Icon = node.icon;
              const isSelected = activeArchNode === node.id;
              return (
                <button
                  key={node.id}
                  onClick={() => setActiveArchNode(node.id)}
                  className={`p-3 rounded-xl border text-left transition flex flex-col items-center text-center gap-1.5 ${
                    isSelected
                      ? "bg-[#087B72] text-white border-[#087B72] shadow-md ring-2 ring-[#68DCC3]/50"
                      : "bg-[#EDF3F1] border-[#DCE6E2] text-[#152C35] hover:bg-[#DCE6E2]"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isSelected ? "text-white" : "text-[#087B72]"}`} />
                  <span className="font-bold text-xs">{lang === "bn" ? node.labelBn : node.labelEn}</span>
                </button>
              );
            })}
          </div>

          {/* Active Node Detail Card */}
          {currentArchNode && (
            <div className="pro-card p-6 border-l-4 border-l-[#087B72] space-y-3 bg-[#F7F9F8]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DCE6E2] pb-3">
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#087B72] uppercase">
                    {lang === "bn" ? "আর্কিটেকচারাল সাবসিস্টেম" : "ARCHITECTURAL SUBSYSTEM"}
                  </span>
                  <h3 className="font-black text-lg text-[#152C35]">
                    {currentArchNode.title}
                  </h3>
                  <p className="text-xs text-[#65777B]">
                    {currentArchNode.subtitle}
                  </p>
                </div>
                <div className="px-3 py-1 rounded-lg bg-white border border-[#DCE6E2] text-[11px] font-mono text-[#087B72] font-semibold">
                  {currentArchNode.tech}
                </div>
              </div>
              <p className="text-xs sm:text-sm text-[#152C35] leading-relaxed">
                {currentArchNode.desc}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 6: TRUST, VERIFICATION & HUMAN OVERSIGHT */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#EDF3F1] border-b border-[#DCE6E2]">
        <div className="max-w-[1240px] mx-auto space-y-10">
          <div className="max-w-3xl">
            <span className="text-[11px] uppercase tracking-wider font-mono font-bold text-[#087B72] bg-[#087B72]/10 px-3 py-1 rounded-full">
              {lang === "bn" ? "সিস্টেম গভর্নেন্স ও নৈতিকতা" : "System Governance & Ethics"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#152C35] mt-2 tracking-tight">
              {lang === "bn" ? "আস্থা, যাচাইকরণ ও মানবিক তদারকি" : "Trust, Verification & Human Oversight"}
            </h2>
            <p className="text-xs sm:text-sm text-[#65777B] mt-2 leading-relaxed">
              {lang === "bn"
                ? "জরুরি প্রযুক্তি ব্ল্যাকবক্স বা অস্বচ্ছ হতে পারে না। সংযোগ এআই নিষ্কাশন, অ্যালগরিদমিক নিরাপত্তা যাচাই এবং মানুষের সিদ্ধান্তের মধ্যে সুস্পষ্ট সীমারেখা বজায় রাখে।"
                : "Emergency technologies cannot be blackboxes. SHONGJOG establishes strict boundaries between AI extraction, algorithmic constraint enforcement, and human decision-making."}
            </p>
          </div>

          {/* 4-Tier Information Classification Table */}
          <div className="pro-card rounded-2xl overflow-hidden border border-[#DCE6E2]">
            <div className="p-4 bg-white border-b border-[#DCE6E2] font-mono text-xs font-bold text-[#152C35]">
              {lang === "bn"
                ? "৪-স্তরবিশিষ্ট তথ্য নির্ভরযোগ্যতা ও যাচাইকরণ কাঠামো"
                : "4-TIER INFORMATION RELIABILITY & VERIFICATION HIERARCHY"}
            </div>
            <div className="divide-y divide-[#DCE6E2] text-xs bg-white">
              <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#C94747]/10 text-[#C94747] font-mono font-bold text-[10px]">
                      {lang === "bn" ? "স্তর ১ · অযাচাইকৃত" : "TIER 1 · UNVERIFIED"}
                    </span>
                    <strong className="text-sm text-[#152C35]">
                      {lang === "bn" ? "কমিউনিটি রিপোর্ট করা তথ্য" : "Community-Reported Data"}
                    </strong>
                  </div>
                  <p className="text-[#65777B]">
                    {lang === "bn"
                      ? "নাগরিকের আবেদন, অনানুষ্ঠানিক যানবাহনের প্রস্তাব বা অপরীক্ষিত ভবনের তথ্য।"
                      : "Citizen requests, informal vehicle offers, or uninspected clubhouses."}
                  </p>
                </div>
                <div className="text-right text-[11px] font-mono font-bold text-[#C94747]">
                  {lang === "bn" ? "স্বয়ংক্রিয় ম্যাচিং থেকে পৃথক রাখা হয়" : "QUARANTINED FROM AUTO-MATCHING"}
                </div>
              </div>

              <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#D99A32]/10 text-[#0B1F2A] font-mono font-bold text-[10px]">
                      {lang === "bn" ? "স্তর ২ · প্রার্থী চাহিদা" : "TIER 2 · CANDIDATE"}
                    </span>
                    <strong className="text-sm text-[#152C35]">
                      {lang === "bn" ? "এআই-নিষ্কাশিত শারীরিক সহায়তার শর্ত" : "AI-Extracted Support Constraints"}
                    </strong>
                  </div>
                  <p className="text-[#65777B]">
                    {lang === "bn"
                      ? "প্রাকৃতিক ভাষা থেকে প্রাপ্ত ভাষা, দলের আকার এবং শারীরিক চলাচলের চাহিদা।"
                      : "Language, group size, and physical accommodation needs parsed from natural text."}
                  </p>
                </div>
                <div className="text-right text-[11px] font-mono font-bold text-[#D99A32]">
                  {lang === "bn" ? "মানবিক অনুমোদন প্রয়োজন" : "REQUIRES HUMAN APPROVAL"}
                </div>
              </div>

              <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#087B72]/10 text-[#087B72] font-mono font-bold text-[10px]">
                      {lang === "bn" ? "স্তর ৩ · অনুমোদিত" : "TIER 3 · AUTHORIZED"}
                    </span>
                    <strong className="text-sm text-[#152C35]">
                      {lang === "bn" ? "সমন্বয়কারী-অনুমোদিত ডিসপ্যাচ" : "Coordinator-Confirmed Dispatch"}
                    </strong>
                  </div>
                  <p className="text-[#65777B]">
                    {lang === "bn"
                      ? "আশ্রয়কেন্দ্রের ফাঁকা স্থান যাচাই করে দায়িত্বপ্রাপ্ত কর্মকর্তা কর্তৃক অনুমোদিত।"
                      : "Matching validated against shelter headroom and authorized by emergency official."}
                  </p>
                </div>
                <div className="text-right text-[11px] font-mono font-bold text-[#087B72]">
                  {lang === "bn" ? "সক্রিয় ডিসপ্যাচ তালিকা" : "ACTIVE DISPATCH QUEUE"}
                </div>
              </div>

              <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#159B82]/10 text-[#159B82] font-mono font-bold text-[10px]">
                      {lang === "bn" ? "স্তর ৪ · শারীরিক পরিদর্শন" : "TIER 4 · PHYSICAL"}
                    </span>
                    <strong className="text-sm text-[#152C35]">
                      {lang === "bn" ? "যাচাইকৃত শারীরিক সম্পদ লেজার" : "Audited Physical Asset Ledger"}
                    </strong>
                  </div>
                  <p className="text-[#65777B]">
                    {lang === "bn"
                      ? "ডিডিএম বা প্রকৌশলী কর্তৃক সরেজমিনে ১:১২ র‍্যাম্প ও জেনারেটর সক্ষমতা পরীক্ষিত।"
                      : "Shelters and vehicles inspected on-site by DDM or partner engineers for 1:12 ramp and generator backup."}
                  </p>
                </div>
                <div className="text-right text-[11px] font-mono font-bold text-[#159B82]">
                  {lang === "bn" ? "নিরাপদ বরাদ্দের যোগ্য" : "ELIGIBLE FOR SAFE ALLOCATION"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: ABOUT & ETHICAL DISCLOSURES */}
      <section id="about" className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-b border-[#DCE6E2]">
        <div className="max-w-[1240px] mx-auto space-y-6">
          <div className="max-w-3xl">
            <span className="text-[11px] uppercase tracking-wider font-mono font-bold text-[#087B72] bg-[#087B72]/10 px-3 py-1 rounded-full">
              {lang === "bn" ? "মিশন ও নীতিমালা" : "Mission & Standards"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#152C35] mt-2 tracking-tight">
              {lang === "bn" ? "সংযোগ (SHONGJOG) সম্পর্কে" : "About SHONGJOG (সংযোগ)"}
            </h2>
            <p className="text-xs sm:text-sm text-[#65777B] mt-2 leading-relaxed">
              {lang === "bn"
                ? "আন্তর্জাতিক হ্যাকাথনের জন্য তৈরি সংযোগ প্রদর্শন করে কীভাবে এআই, জিআইএস ম্যাপিং এবং মানবিক তদারকির মাধ্যমে দুর্যোগে প্রতিবন্ধী ব্যক্তি ও প্রবীণদের প্রাণহানি রোধ করা সম্ভব।"
                : "SHONGJOG was developed for the CTRL-V 2026 International Hackathon to demonstrate how AI, geospatial GIS routing, and human-in-the-loop civil defense governance can prevent disaster casualties among people with disabilities and older adults."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[#65777B]">
            <div className="p-5 rounded-xl bg-[#F7F9F8] border border-[#DCE6E2] space-y-2">
              <strong className="text-[#152C35] block text-sm">
                {lang === "bn" ? "নৈতিক সিমুলেশন সীমারেখা" : "Ethical Simulation Boundaries"}
              </strong>
              <p className="leading-relaxed">
                {lang === "bn"
                  ? "সংযোগ একটি প্রযুক্তিগত প্রুফ-অব-কনসেপ্ট হিসেবে পরিচালিত হয়। এটি জাতীয় জরুরি হটলাইন (৯৯৯/১১২)-এর বিকল্প নয় এবং সব স্ক্রিনে এই স্পষ্ট বার্তা প্রদর্শিত থাকে।"
                  : "SHONGJOG operates as an academic and technological proof-of-concept. It does not replace national emergency dispatch hotlines (999/112) and maintains continuous disclosures across all operational screens."}
              </p>
            </div>
            <div className="p-5 rounded-xl bg-[#F7F9F8] border border-[#DCE6E2] space-y-2">
              <strong className="text-[#152C35] block text-sm">
                {lang === "bn" ? "মাঠপর্যায়ের চিত্র ও লাইসেন্স" : "Field Imagery & Provenance"}
              </strong>
              <p className="leading-relaxed">
                {lang === "bn"
                  ? "সংযোগের সব তথ্যচিত্র ও ফটোগ্রাফি বাংলাদেশের বাস্তব ভৌগোলিক চিত্র উপস্থাপন করে, যা ক্রিয়েটিভ কমন্স ও পাবলিক ডোমেন লাইসেন্সের আওতাভুক্ত। বিস্তারিত docs/ASSET_CREDITS.md ফাইলে সংরক্ষিত।"
                  : "All documentary photography featured across SHONGJOG represents real geography and community resilience in Bangladesh under Creative Commons and Public Domain licenses. Documented in docs/ASSET_CREDITS.md."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER CALL TO ACTION */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-[#0B1F2A] text-white">
        <div className="max-w-[1240px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[11px] font-mono font-bold text-[#68DCC3] uppercase tracking-wider">
              {lang === "bn" ? "সম্পূর্ণ সিস্টেম আর্কিটেকচার পর্যালোচনা করতে চান?" : "Ready to Review Full System Architecture?"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {lang === "bn" ? "দাকোপ উপকূলীয় অপারেশন সেন্টার দেখুন" : "Explore the Dacope Coastal Operations Center"}
            </h2>
            <p className="text-xs text-[#DCE6E2]/80 max-w-xl leading-relaxed">
              {lang === "bn"
                ? "সমন্বয়কারী কমান্ড ড্যাশবোর্ড ব্যবহার করুন, গুগল ম্যাপে সক্রিয় কেস পরীক্ষা করুন, অ্যালগরিদমিক শর্তাবলী যাচাই করুন এবং অপরিবর্তনীয় অডিট লগ পর্যালোচনা করুন।"
                : "Experience the full coordinator command dashboard, inspect active cases on Google Maps, test algorithmic constraints, and review immutable dispatch audit logs."}
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <Link
              href="/operations"
              className="btn-interactive inline-flex items-center gap-2 bg-[#087B72] hover:bg-[#159B82] text-white px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-sm"
            >
              <span>{lang === "bn" ? "অপারেশন সেন্টার খুলুন" : "Open Operations Center"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

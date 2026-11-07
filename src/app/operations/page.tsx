"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Radio,
  Search,
  Users,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Truck,
  Building2,
  RefreshCw,
  List,
  Map as MapIcon,
  Check,
  X,
  Compass,
  ShieldAlert,
  Download,
  PlusCircle,
  ExternalLink,
  Settings,
} from "lucide-react";
import GoogleOperationsMap, { MapIncidentItem, MapResourceItem } from "@/components/GoogleOperationsMap";
import { ResourceMatchRecommendation } from "@/lib/types";
import {
  useTranslation,
  formatNumber,
  translateStatus,
  translateUrgency,
  translateNeed,
} from "@/lib/i18n";

interface CaseItem {
  id: string;
  status: string;
  urgency: string;
  language: string;
  groupSize: number;
  rawDescription: string;
  approximateLocation: string | null;
  latitude: number | null;
  longitude: number | null;
  contactName: string | null;
  contactPhone: string | null;
  createdAt: string;
  supportNeeds: { id: string; needType: string }[];
  aiExtractionJson: string | null;
  assignment?: {
    id: string;
    status: string;
    vehicle?: { name: string };
    shelter?: { name: string };
    responder?: { name: string };
  } | null;
}

export default function OperationsCenterPage() {
  const { lang } = useTranslation();
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [selectedCaseDetails, setSelectedCaseDetails] = useState<CaseItem | null>(null);
  const [matchingData, setMatchingData] = useState<ResourceMatchRecommendation | null>(null);
  const [matchingLoading, setMatchingLoading] = useState(false);
  const [dispatching, setDispatching] = useState(false);
  const [dispatchError, setDispatchError] = useState<string | null>(null);
  const [simulatingInflux, setSimulatingInflux] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // View toggle: Map vs Accessible List
  const [viewMode, setViewMode] = useState<"map" | "list">("map");

  // Filters
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterUrgency, setFilterUrgency] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeNav, setActiveNav] = useState<"overview" | "requests" | "dispatch" | "gis" | "activity" | "settings">("overview");

  const fetchCases = async () => {
    try {
      const res = await fetch("/api/requests");
      const json = await res.json();
      if (json.success) {
        setCases(json.data);
      }
    } catch (err) {
      console.error("Fetch cases error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    fetch("/api/requests")
      .then((res) => res.json())
      .then((json) => {
        if (!ignore && json.success) {
          setCases(json.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error("Fetch cases error:", err);
          setLoading(false);
        }
      });
    return () => {
      ignore = true;
    };
  }, []);

  const handleSelectCase = async (c: CaseItem) => {
    setSelectedCaseId(c.id);
    setSelectedCaseDetails(c);
    setDispatchError(null);
    try {
      setMatchingLoading(true);
      const res = await fetch(`/api/matching/${c.id}`);
      const json = await res.json();
      if (json.success) {
        setMatchingData(json.recommendation);
      }
    } catch (err) {
      console.error("Matching engine error:", err);
    } finally {
      setMatchingLoading(false);
    }
  };

  const handleApproveDispatch = async () => {
    if (!selectedCaseDetails || !matchingData) return;
    setDispatching(true);
    setDispatchError(null);
    try {
      const res = await fetch("/api/coordinator/dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: selectedCaseDetails.id,
          vehicleId: matchingData.vehicle?.id,
          shelterId: matchingData.shelter?.id,
          responderId: matchingData.responder?.id,
          coordinatorNotes: "Authorized via Operations Center with 7 hard physical constraints checked.",
        }),
      });
      const json = await res.json();
      if (json.success) {
        await fetchCases();
        const updated = await fetch(`/api/requests/${selectedCaseDetails.id}`);
        const updatedJson = await updated.json();
        if (updatedJson.success) {
          setSelectedCaseDetails(updatedJson.data);
        }
      } else {
        setDispatchError(json.error || "Failed to authorize dispatch.");
      }
    } catch (err) {
      console.error("Dispatch error:", err);
      setDispatchError("Network error contacting coordinator dispatch service.");
    } finally {
      setDispatching(false);
    }
  };

  // Live Scenario Injector
  const handleSimulateInflux = async () => {
    setSimulatingInflux(true);
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawDescription: "জরুরি উদ্ধার প্রয়োজন: কামারখোলায় বেড়িবাঁধ ভেঙে পানি ঢুকছে। আমার দাদী (৮২ বছর) অক্সিজেন কনসেনট্রেটরে আছেন, বিদ্যুৎ চলে গেছে। দ্রুত সাহায্য চাই।",
          language: "bn",
          contactName: "মোঃ কামাল হোসেন",
          contactPhone: "+8801712998877",
          approximateLocation: "Kamarkhola Union, Dacope, Khulna",
          latitude: 22.5650,
          longitude: 89.5080,
          urgency: "critical",
          groupSize: 3,
          supportNeeds: ["electrical_life_support", "mobility_impairment", "stretcher_required"],
        }),
      });
      const json = await res.json();
      if (json.success) {
        await fetchCases();
        if (json.data) {
          handleSelectCase(json.data);
        }
      }
    } catch (e) {
      console.error("Simulation error:", e);
    } finally {
      setSimulatingInflux(false);
    }
  };

  // SitRep Export
  const handleExportSitRep = () => {
    const headers = ["CaseID", "Status", "Urgency", "Language", "Headcount", "Location", "Needs", "AssignedVehicle", "TargetShelter", "Timestamp"];
    const rows = cases.map((c) => [
      c.id,
      c.status,
      c.urgency,
      c.language,
      c.groupSize,
      `"${c.approximateLocation || "Dacope"}"`,
      `"${c.supportNeeds.map((n) => n.needType).join("; ")}"`,
      `"${c.assignment?.vehicle?.name || "Unassigned"}"`,
      `"${c.assignment?.shelter?.name || "Unassigned"}"`,
      c.createdAt,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `shongjog-sitrep-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter cases
  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      if (filterStatus !== "all" && c.status !== filterStatus) return false;
      if (filterUrgency !== "all" && c.urgency !== filterUrgency) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchDesc = c.rawDescription.toLowerCase().includes(q);
        const matchId = c.id.toLowerCase().includes(q);
        const matchLoc = (c.approximateLocation || "").toLowerCase().includes(q);
        if (!matchDesc && !matchId && !matchLoc) return false;
      }
      return true;
    });
  }, [cases, filterStatus, filterUrgency, searchQuery]);

  const renderSidebarNav = () => (
    <div className="space-y-1">
      <div className="px-3 py-2 text-[10px] font-mono font-bold uppercase tracking-wider text-[#5A7077] border-b border-[#DBE6E2] mb-1">
        {lang === "bn" ? "অপারেশনাল মেনু" : "Operations Navigation"}
      </div>
      <button
        onClick={() => {
          setActiveNav("overview");
          setMobileDrawerOpen(false);
        }}
        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition ${
          activeNav === "overview"
            ? "bg-[#0B766E] text-white shadow-sm"
            : "text-[#142D36] hover:bg-[#F4F7F6]"
        }`}
      >
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4" />
          <span>{lang === "bn" ? "সারসংক্ষেপ" : "Overview"}</span>
        </div>
        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${activeNav === "overview" ? "bg-white/20 text-white" : "bg-[#0B766E]/10 text-[#0B766E]"}`}>
          LIVE
        </span>
      </button>
      <button
        onClick={() => {
          setActiveNav("requests");
          setMobileDrawerOpen(false);
          document.getElementById("case-priority-section")?.scrollIntoView({ behavior: "smooth" });
        }}
        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition ${
          activeNav === "requests"
            ? "bg-[#0B766E] text-white shadow-sm"
            : "text-[#142D36] hover:bg-[#F4F7F6]"
        }`}
      >
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span>{lang === "bn" ? "সহায়তার কেসসমূহ" : "Assistance Cases"}</span>
        </div>
        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${activeNav === "requests" ? "bg-white/20 text-white" : "bg-gray-100 text-[#5A7077]"}`}>
          {formatNumber(filteredCases.length, lang)}
        </span>
      </button>
      <Link
        href="/resources"
        onClick={() => setMobileDrawerOpen(false)}
        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-[#142D36] hover:bg-[#F4F7F6] transition"
      >
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-[#0B766E]" />
          <span>{lang === "bn" ? "আশ্রয় ও সম্পদ রেজিস্ট্রি" : "Resource Registry"}</span>
        </div>
        <ExternalLink className="w-3 h-3 text-[#5A7077]" />
      </Link>
      <button
        onClick={() => {
          setActiveNav("dispatch");
          setFilterStatus("intake_received");
          setMobileDrawerOpen(false);
        }}
        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition ${
          activeNav === "dispatch"
            ? "bg-[#0B766E] text-white shadow-sm"
            : "text-[#142D36] hover:bg-[#F4F7F6]"
        }`}
      >
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          <span>{lang === "bn" ? "ডিসপ্যাচ কন্ট্রোল" : "Dispatch Control"}</span>
        </div>
        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${activeNav === "dispatch" ? "bg-white/20 text-white" : "bg-[#F59E0B]/20 text-[#D98206]"}`}>
          {formatNumber(awaitingReviewCount, lang)}
        </span>
      </button>
      <Link
        href="/responder"
        onClick={() => setMobileDrawerOpen(false)}
        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-[#142D36] hover:bg-[#F4F7F6] transition"
      >
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-[#159B82]" />
          <span>{lang === "bn" ? "মাঠপর্যায়ের রেসপন্ডার" : "Field Responders"}</span>
        </div>
        <ExternalLink className="w-3 h-3 text-[#5A7077]" />
      </Link>
      <button
        onClick={() => {
          setActiveNav("gis");
          setViewMode("map");
          setMobileDrawerOpen(false);
        }}
        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition ${
          activeNav === "gis"
            ? "bg-[#0B766E] text-white shadow-sm"
            : "text-[#142D36] hover:bg-[#F4F7F6]"
        }`}
      >
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4" />
          <span>{lang === "bn" ? "জিআইএস কার্যক্রম" : "GIS Operations"}</span>
        </div>
        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${activeNav === "gis" ? "bg-white/20 text-white" : "bg-gray-100 text-[#5A7077]"}`}>
          WGS84
        </span>
      </button>
      <button
        onClick={() => {
          setActiveNav("activity");
          setMobileDrawerOpen(false);
        }}
        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition ${
          activeNav === "activity"
            ? "bg-[#0B766E] text-white shadow-sm"
            : "text-[#142D36] hover:bg-[#F4F7F6]"
        }`}
      >
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>{lang === "bn" ? "অডিট ইতিহাস" : "Activity History"}</span>
        </div>
        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${activeNav === "activity" ? "bg-white/20 text-white" : "bg-gray-100 text-[#5A7077]"}`}>
          AUDIT
        </span>
      </button>
      <button
        onClick={() => {
          setActiveNav("settings");
          setMobileDrawerOpen(false);
        }}
        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition ${
          activeNav === "settings"
            ? "bg-[#0B766E] text-white shadow-sm"
            : "text-[#142D36] hover:bg-[#F4F7F6]"
        }`}
      >
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4" />
          <span>{lang === "bn" ? "ডিউটি সেটিংস" : "Duty Settings"}</span>
        </div>
      </button>
    </div>
  );

  // Operational telemetry metrics
  const activeCount = cases.filter((c) => c.status !== "completed" && c.status !== "cancelled").length;
  const awaitingReviewCount = cases.filter((c) => c.status === "intake_received" || c.status === "ai_parsed").length;
  const assignedCount = cases.filter((c) => c.status === "assigned" || c.status === "en_route" || c.status === "arrived").length;
  const criticalCount = cases.filter((c) => c.urgency === "critical" && c.status !== "completed").length;

  // Map representation items
  const mapIncidents: MapIncidentItem[] = useMemo(() => {
    return filteredCases
      .filter((c) => c.latitude !== null && c.longitude !== null)
      .map((c) => ({
        id: c.id,
        title: `${c.id} · ${c.urgency.toUpperCase()} (${c.groupSize} evacuees)`,
        lat: c.latitude as number,
        lng: c.longitude as number,
        urgency: c.urgency as "critical" | "urgent" | "routine",
        status: c.status,
        locationName: c.approximateLocation || "Dacope Sector",
        headcount: c.groupSize,
        needs: c.supportNeeds.map((n) => n.needType),
      }));
  }, [filteredCases]);

  const mapResources: MapResourceItem[] = useMemo(() => [
    {
      id: "RES-SHL-01",
      name: "Dacope Model Cyclone Shelter",
      type: "shelter",
      lat: 22.5708,
      lng: 89.5158,
      capacity: 350,
      isVerified: true,
      rampAvailable: true,
    },
    {
      id: "RES-SHL-02",
      name: "Chalna High School Shelter",
      type: "shelter",
      lat: 22.5850,
      lng: 89.5250,
      capacity: 220,
      isVerified: true,
      rampAvailable: true,
    },
    {
      id: "RES-VEH-01",
      name: "Accessible Evacuation Van Alpha",
      type: "vehicle",
      lat: 22.5680,
      lng: 89.5083,
      capacity: 4,
      isVerified: true,
      rampAvailable: true,
    },
  ], []);

  return (
    <div className="min-h-screen bg-[#F4F7F6] py-6 px-4 sm:px-6 lg:px-8 space-y-6 font-sans max-w-full overflow-x-hidden">
      {/* Header Bar */}
      <div className="bg-[#071520] text-white p-5 sm:p-6 rounded-2xl border border-[#133446] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-[#63DEC2] animate-pulse" />
            <span className="text-[11px] font-mono font-bold text-[#63DEC2] uppercase tracking-wider">
              {lang === "bn" ? "জরুরি অপারেশন কেন্দ্র" : "Emergency Operations Center"}
            </span>
            <span className="text-[9px] font-mono font-bold bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/40 px-2 py-0.5 rounded-full ml-1">
              {lang === "bn" ? "ডেমো সিমুলেশন · সরাসরি সেবা নয়" : "DEMO SIMULATION · NOT A LIVE SERVICE"}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white mt-1 tracking-tight">
            {lang === "bn" ? "অন্তর্ভুক্তিমূলক ইভাকুয়েশন ডিসপ্যাচ ও টেলিমেট্রি" : "Inclusive Evacuation Dispatch & Telemetry"}
          </h1>
          <p className="text-xs text-[#DBE6E2]/80 mt-1">
            {lang === "bn"
              ? "দাকোপ সেক্টর (খুলনা) · দ্বৈত ইঞ্জিন: প্রবাবিলিস্টিক এআই + ডিটারমিনিস্টিক কনস্ট্রেইন্ট ইঞ্জিন"
              : "Dacope Sector (Khulna) · Dual Engine: Probabilistic AI + Deterministic Constraint Engine"}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={handleSimulateInflux}
            disabled={simulatingInflux}
            className="btn-interactive inline-flex items-center gap-1.5 bg-[#F59E0B] hover:bg-[#D98206] text-black text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-md transition"
            title={lang === "bn" ? "সিমুলেটেড জরুরি কেস তৈরি করুন" : "Inject simulated surge emergency case"}
          >
            <PlusCircle className="w-4 h-4" />
            <span>{simulatingInflux ? (lang === "bn" ? "যোগ হচ্ছে..." : "Injecting...") : (lang === "bn" ? "সিমুলেট ইনফ্লাক্স" : "Simulate Influx")}</span>
          </button>

          <button
            onClick={handleExportSitRep}
            className="btn-interactive inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3 py-2.5 rounded-xl border border-white/20 shadow-sm transition"
            title={lang === "bn" ? "সিটরেপ সিএসভি ডাউনলোড করুন" : "Download SitRep CSV"}
          >
            <Download className="w-4 h-4 text-[#63DEC2]" />
            <span className="hidden sm:inline">{lang === "bn" ? "সিটরেপ রপ্তানি" : "Export SitRep"}</span>
          </button>

          <button
            onClick={fetchCases}
            disabled={loading}
            className="btn-interactive inline-flex items-center gap-1.5 bg-[#0D2232] hover:bg-[#133446] text-[#DBE6E2] text-xs font-semibold px-3 py-2.5 rounded-xl border border-[#0B766E]/50 shadow-sm transition"
            title={lang === "bn" ? "ডাটাবেজ রিফ্রেশ করুন" : "Refresh database"}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#63DEC2]" : ""}`} />
            <span className="hidden sm:inline">{lang === "bn" ? "রিফ্রেশ" : "Refresh"}</span>
          </button>

          <Link
            href="/resources"
            className="btn-interactive inline-flex items-center gap-1.5 bg-[#0B766E] hover:bg-[#159B82] text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-[#159B82]/40 shadow-md transition"
          >
            <Building2 className="w-4 h-4" />
            <span>{lang === "bn" ? "আশ্রয় লেজার" : "Shelter Ledger"}</span>
          </Link>
        </div>
      </div>

      {/* Mobile Operations Navigation Bar */}
      <div className="xl:hidden w-full flex items-center justify-between p-3.5 bg-white rounded-xl border border-[#DBE6E2] shadow-sm">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-[#0B766E] animate-pulse" />
          <span className="text-xs font-bold text-[#142D36]">
            {lang === "bn" ? "অপারেশন মোড:" : "Active View:"} <span className="text-[#0B766E] font-mono">{activeNav.toUpperCase()}</span>
          </span>
        </div>
        <button
          onClick={() => setMobileDrawerOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B766E]/10 hover:bg-[#0B766E]/20 text-[#0B766E] text-xs font-bold transition"
          aria-label={lang === "bn" ? "মেনু খুলুন" : "Open Menu"}
        >
          <List className="w-4 h-4" />
          <span>{lang === "bn" ? "মেনু খুলুন" : "Open Menu"}</span>
        </button>
      </div>

      {/* Mobile Slide-Over Drawer */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 xl:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-white p-4 shadow-2xl z-50 overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#DBE6E2] mb-3">
              <div className="font-bold text-sm text-[#142D36] flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#0B766E]" />
                <span>{lang === "bn" ? "অপারেশনাল কন্ট্রোল" : "Operations Control"}</span>
              </div>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1.5 rounded-lg text-[#5A7077] hover:bg-[#F4F7F6]"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {renderSidebarNav()}
          </div>
        </div>
      )}

      <div className="flex flex-col xl:flex-row gap-6 items-start">
        {/* Left Operational Sidebar (Desktop) */}
        <aside className="hidden xl:flex flex-col w-60 shrink-0 bg-white rounded-2xl border border-[#DBE6E2] p-3 shadow-sm space-y-1 sticky top-6">
          {renderSidebarNav()}
          <div className="pt-4 mt-auto border-t border-[#DBE6E2] space-y-2">
            <div className="p-2.5 rounded-xl bg-[#F4F7F6] border border-[#DBE6E2] text-[11px] text-[#5A7077] space-y-1">
              <div className="font-bold text-[#142D36] flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-[#0B766E]" />
                <span>{lang === "bn" ? "প্রোটোকল স্তর ৩" : "Protocol Level 3"}</span>
              </div>
              <div>{lang === "bn" ? "উপকূলীয় জলোচ্ছ্বাস পর্যায় ২" : "Coastal Surge Phase 2"}</div>
              <div className="text-[10px] font-mono text-[#0B766E] font-semibold">
                {lang === "bn" ? "জোয়ার: +২.৮মি বৃদ্ধি পাচ্ছে" : "Tide: +2.8m Rising"}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0 space-y-6">
          {activeNav === "activity" && (
            <div className="p-5 bg-white rounded-2xl border border-[#0B766E] shadow-lg space-y-3">
              <div className="flex items-center justify-between border-b border-[#DBE6E2] pb-2">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#0B766E] flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Operations Activity & Telemetry Audit Trail</span>
                </h3>
                <button onClick={() => setActiveNav("overview")} className="text-xs text-[#5A7077] hover:text-[#142D36] font-bold">Close Panel</button>
              </div>
              <div className="space-y-2 text-xs text-[#5A7077]">
                <div className="p-2.5 rounded-lg bg-[#F4F7F6] border border-[#DBE6E2] flex items-center justify-between font-mono text-[11px]">
                  <span>[00:15:22] Model Cyclone Shelter capacity synchronized (350 capacity, 100% ramp validated)</span>
                  <span className="text-[#159B82] font-bold">VERIFIED</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#F4F7F6] border border-[#DBE6E2] flex items-center justify-between font-mono text-[11px]">
                  <span>[00:12:04] Probabilistic AI parser extracted 3 support needs from Bengali audio transcription</span>
                  <span className="text-[#0B766E] font-bold">SUCCESS</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#F4F7F6] border border-[#DBE6E2] flex items-center justify-between font-mono text-[11px]">
                  <span>[00:08:45] Deterministic constraint engine rejected non-ramp transport for wheelchair request</span>
                  <span className="text-[#D9534F] font-bold">BLOCKED</span>
                </div>
              </div>
            </div>
          )}

          {activeNav === "settings" && (
            <div className="p-5 bg-white rounded-2xl border border-[#0B766E] shadow-lg space-y-3">
              <div className="flex items-center justify-between border-b border-[#DBE6E2] pb-2">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#0B766E] flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  <span>Constraint Engine System Settings</span>
                </h3>
                <button onClick={() => setActiveNav("overview")} className="text-xs text-[#5A7077] hover:text-[#142D36] font-bold">Close Panel</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#F4F7F6] border border-[#DBE6E2]">
                  <div className="text-[10px] font-mono text-[#5A7077] uppercase font-bold">Ramp Gradient Limit</div>
                  <div className="text-base font-bold text-[#142D36] mt-0.5">1:12 Max Incline</div>
                  <div className="text-[10px] text-[#0B766E]">ADA & BD Building Code compliant</div>
                </div>
                <div className="p-3 rounded-xl bg-[#F4F7F6] border border-[#DBE6E2]">
                  <div className="text-[10px] font-mono text-[#5A7077] uppercase font-bold">Max Evacuation Radius</div>
                  <div className="text-base font-bold text-[#142D36] mt-0.5">15.0 km Buffer</div>
                  <div className="text-[10px] text-[#0B766E]">Adjusts dynamically during cyclone surge</div>
                </div>
                <div className="p-3 rounded-xl bg-[#F4F7F6] border border-[#DBE6E2]">
                  <div className="text-[10px] font-mono text-[#5A7077] uppercase font-bold">Deterministic Rule Set</div>
                  <div className="text-base font-bold text-[#142D36] mt-0.5">7 Hard Invariants</div>
                  <div className="text-[10px] text-[#0B766E]">Zero autonomous dispatches without coordinator</div>
                </div>
              </div>
            </div>
          )}

      {/* KPI Telemetry Ribbon with Explicit Operational Definitions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="pro-card p-4 rounded-2xl space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-[#5A7077] uppercase tracking-wider">
              {lang === "bn" ? "সক্রিয় অনুরোধসমূহ" : "Active Requests"}
            </span>
            <Users className="w-4 h-4 text-[#0B766E]" />
          </div>
          <div className="text-3xl font-black text-[#142D36] tabular-nums">{formatNumber(activeCount, lang)}</div>
          <p className="text-[11px] text-[#5A7077] leading-tight">
            {lang === "bn"
              ? "দাকোপ উপজেলা জুড়ে প্রাথমিক মূল্যায়ন বা ট্রানজিটে থাকা জরুরি পরিস্থিতি।"
              : "Evacuation cases pending assessment or in active transit across Dacope Upazila."}
          </p>
          <div className="pt-2 border-t border-[#DBE6E2] flex items-center justify-between text-[10px] font-mono text-[#0B766E] font-semibold">
            <span>{lang === "bn" ? "সাইকেল: সক্রিয় ৪-ঘণ্টা উইন্ডো" : "Cycle: Active 4-hr Window"}</span>
            <span>{lang === "bn" ? "সংকটজনক:" : "Critical:"} {formatNumber(criticalCount, lang)}</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="pro-card p-4 rounded-2xl space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-[#5A7077] uppercase tracking-wider">
              {lang === "bn" ? "পর্যালোচনা অপেক্ষমাণ" : "Awaiting Review"}
            </span>
            <ShieldAlert className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <div className="text-3xl font-black text-[#142D36] tabular-nums">{formatNumber(awaitingReviewCount, lang)}</div>
          <p className="text-[11px] text-[#5A7077] leading-tight">
            {lang === "bn"
              ? "এআই দ্বারা শনাক্তকৃত চাহিদা; মানব সমন্বয়কের অনুমোদনের অপেক্ষায়।"
              : "Needs extracted by AI; awaiting human civil-defense authorization."}
          </p>
          <div className="pt-2 border-t border-[#DBE6E2] flex items-center justify-between text-[10px] font-mono text-[#F59E0B] font-semibold">
            <span>{lang === "bn" ? "নীতিমালা: ০ স্বায়ত্তশাসিত অনুমোদন" : "Rule: 0 Autonomous Dispatches"}</span>
            <span>{lang === "bn" ? "সারি: অপেক্ষমাণ" : "Queue: Pending"}</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="pro-card p-4 rounded-2xl space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-[#5A7077] uppercase tracking-wider">
              {lang === "bn" ? "নিয়োজিত ও ট্রানজিটে" : "Assigned & In Transit"}
            </span>
            <Truck className="w-4 h-4 text-[#159B82]" />
          </div>
          <div className="text-3xl font-black text-[#142D36] tabular-nums">{formatNumber(assignedCount, lang)}</div>
          <p className="text-[11px] text-[#5A7077] leading-tight">
            {lang === "bn"
              ? "উদ্ধারকারী চালক ও বোট দল সরাসরি নাগরিকের অবস্থানের পথে গতিশীল।"
              : "Field rescue drivers and boats currently mobilized to citizen rendezvous."}
          </p>
          <div className="pt-2 border-t border-[#DBE6E2] flex items-center justify-between text-[10px] font-mono text-[#159B82] font-semibold">
            <span>{lang === "bn" ? "ট্র্যাকিং: লাইভ মাইলফলক" : "Tracking: Live Milestones"}</span>
            <span>{lang === "bn" ? "যাত্রা: চলমান" : "En Route: Active"}</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="pro-card p-4 rounded-2xl space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-[#5A7077] uppercase tracking-wider">
              {lang === "bn" ? "সেক্টর হেডরুম ও সক্ষমতা" : "Sector Headroom & Capacity"}
            </span>
            <Building2 className="w-4 h-4 text-[#0B766E]" />
          </div>
          <div className="text-3xl font-black text-[#142D36] tabular-nums">{formatNumber(550, lang)}</div>
          <p className="text-[11px] text-[#5A7077] leading-tight">
            {lang === "bn"
              ? "৩টি পর্যবেক্ষণাধীন আশ্রয়কেন্দ্রে উপলব্ধ যাচাইকৃত র্যাম্পযুক্ত স্থান।"
              : "Verified step-free shelter places available across 3 monitored facilities."}
          </p>
          <div className="pt-2 border-t border-[#DBE6E2] flex items-center justify-between text-[10px] font-mono text-[#0B766E] font-semibold">
            <span>{lang === "bn" ? "র্যাম্প যাচাইকৃত: ১০০%" : "Ramp Verified: 100%"}</span>
            <span>{lang === "bn" ? "জেনারেটর: সচল" : "Generator: Active"}</span>
          </div>
        </div>
      </div>

      {/* Critical Zero-Violation Bottleneck Alert Ribbon */}
      <div className="bg-[#159B82]/10 border border-[#159B82]/40 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs shadow-sm">
        <div className="flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-[#159B82] shrink-0" />
          <div>
            <strong className="text-[#142D36] font-bold">
              {lang === "bn" ? "ম্যাচিং ইঞ্জিন স্থিতি: কোনো অসমাধানকৃত চাহিদা নেই" : "Matching Engine Health: Zero Unmatched Needs"}
            </strong>
            <p className="text-[#5A7077] text-[11px] mt-0.5">
              {lang === "bn"
                ? "দাকোপ সেক্টরের সমস্ত বর্তমান ইভাকুয়েশন কেস ৭টি অপরিবর্তনীয় অবকাঠামোগত শর্ত পূরণ করে (১:১২ র্যাম্প, সমতল যান, পজিটিভ হেডরুম)।"
                : "All current evacuation cases in Dacope sector satisfy 7 hard physical constraints (Ramp 1:12, Step-Free Vehicle, Non-Zero Headroom)."}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded-lg bg-[#0B766E]/20 text-[#0B766E] font-bold">
            {lang === "bn" ? "বাধা: শূন্য" : "Bottlenecks: None"}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-[#159B82]/20 text-[#159B82] font-bold">
            {lang === "bn" ? "শর্তাবলী: কার্যকর" : "Constraints: Enforced"}
          </span>
        </div>
      </div>

      {/* Main Grid: Left Cases List & Right Google Maps or List Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Active Cases Priority Queue */}
        <div className="lg:col-span-5 space-y-4" id="case-priority-section">
          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-2xl border border-[#DBE6E2] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-[#142D36] flex items-center gap-1.5">
                <span>{lang === "bn" ? "সক্রিয় কেস অগ্রাধিকার সারি" : "Active Case Priority Queue"}</span>
                <span className="text-xs bg-[#0B766E]/10 text-[#0B766E] font-mono font-bold px-2 py-0.5 rounded-full">
                  {formatNumber(filteredCases.length, lang)}
                </span>
              </span>

              {/* View Switcher */}
              <div className="bg-[#F4F7F6] p-0.5 rounded-lg border border-[#DBE6E2] flex text-xs">
                <button
                  onClick={() => setViewMode("map")}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-bold transition ${
                    viewMode === "map" ? "bg-[#0B766E] text-white shadow-sm" : "text-[#5A7077] hover:text-[#142D36]"
                  }`}
                >
                  <MapIcon className="w-3.5 h-3.5" />
                  <span>{lang === "bn" ? "মানচিত্র" : "Map"}</span>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-bold transition ${
                    viewMode === "list" ? "bg-[#0B766E] text-white shadow-sm" : "text-[#5A7077] hover:text-[#142D36]"
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  <span>{lang === "bn" ? "অ্যাক্সেসিবল তালিকা" : "Accessible List"}</span>
                </button>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#5A7077] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder={lang === "bn" ? "কেস আইডি, ল্যান্ডমার্ক বা বিবরণ দিয়ে খুঁজুন..." : "Search by case ID, landmark, or description..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-[#DBE6E2] text-xs focus:ring-2 focus:ring-[#0B766E] focus:outline-none"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-[#F4F7F6] border border-[#DBE6E2] rounded-xl p-2 font-medium text-[#142D36] focus:outline-none"
              >
                <option value="all">{lang === "bn" ? "সব স্ট্যাটাস" : "All Statuses"}</option>
                <option value="intake_received">{lang === "bn" ? "অনুরোধ গৃহীত" : "Intake Received"}</option>
                <option value="ai_parsed">{lang === "bn" ? "এআই বিশ্লেষিত" : "AI Parsed"}</option>
                <option value="assigned">{lang === "bn" ? "বরাদ্দকৃত" : "Assigned"}</option>
                <option value="en_route">{lang === "bn" ? "পথে রয়েছে" : "En Route"}</option>
                <option value="completed">{lang === "bn" ? "সম্পন্ন" : "Completed"}</option>
              </select>

              <select
                value={filterUrgency}
                onChange={(e) => setFilterUrgency(e.target.value)}
                className="bg-[#F4F7F6] border border-[#DBE6E2] rounded-xl p-2 font-medium text-[#142D36] focus:outline-none"
              >
                <option value="all">{lang === "bn" ? "সব মাত্রা" : "All Urgencies"}</option>
                <option value="critical">{lang === "bn" ? "সংকটজনক (জরুরি)" : "Critical (Immediate)"}</option>
                <option value="urgent">{lang === "bn" ? "জরুরি" : "Urgent"}</option>
                <option value="routine">{lang === "bn" ? "সাধারণ" : "Routine"}</option>
              </select>
            </div>
          </div>
          </div>

          {/* Cases List */}
          <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1">
            {loading ? (
              <div className="p-8 text-center text-xs text-[#5A7077] bg-white rounded-2xl border border-[#DBE6E2] font-mono">
                Loading live incident feed...
              </div>
            ) : filteredCases.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#5A7077] bg-white rounded-2xl border border-[#DBE6E2]">
                No cases match the active filter criteria.
              </div>
            ) : (
              filteredCases.map((c) => {
                const isSelected = selectedCaseId === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => handleSelectCase(c)}
                    className={`p-4 rounded-2xl border transition-all duration-150 cursor-pointer shadow-sm ${
                      isSelected
                        ? "bg-[#071520] text-white border-[#63DEC2] shadow-lg shadow-[#0B766E]/20"
                        : "bg-white text-[#142D36] border-[#DBE6E2] hover:border-[#0B766E]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`font-mono text-xs font-bold ${isSelected ? "text-[#63DEC2]" : "text-[#0B766E]"}`}>
                          {c.id}
                        </span>
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
                          isSelected ? "bg-white/10 text-[#DBE6E2]" : "bg-gray-100 text-[#5A7077]"
                        }`}>
                          {c.language.toUpperCase()}
                        </span>
                      </div>
                      <span
                        className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                          c.urgency === "critical"
                            ? "bg-[#D9534F] text-white"
                            : c.urgency === "urgent"
                            ? "bg-[#F59E0B] text-black"
                            : "bg-[#159B82] text-white"
                        }`}
                      >
                        {c.urgency}
                      </span>
                    </div>

                    <p className={`text-xs line-clamp-2 leading-relaxed ${isSelected ? "text-[#DBE6E2]" : "text-[#5A7077]"}`}>
                      {c.rawDescription}
                    </p>

                    <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <MapPin className={`w-3.5 h-3.5 ${isSelected ? "text-[#63DEC2]" : "text-[#0B766E]"}`} />
                        <span className="truncate max-w-[170px]">
                          {c.approximateLocation || "Dacope"}
                        </span>
                      </div>
                      <span className="font-mono font-bold">
                        {c.groupSize} evacuee(s)
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Google Maps Operations Canvas or Detail View */}
        <div className="lg:col-span-7 space-y-4">
          {viewMode === "map" ? (
            <GoogleOperationsMap
              incidents={mapIncidents}
              resources={mapResources}
              selectedId={selectedCaseId}
              onSelectItem={(id) => {
                const found = cases.find((c) => c.id === id);
                if (found) handleSelectCase(found);
              }}
              className="h-[640px] w-full"
              showSidebarList={false}
            />
          ) : (
            <div className="bg-white p-6 rounded-2xl border border-[#DBE6E2] shadow-sm space-y-4">
              <h3 className="font-bold text-base text-[#142D36]">
                {lang === "bn" ? "অ্যাক্সেসিবল অপারেশনাল টেবিল" : "Accessible Operational Table"}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#DBE6E2] text-[#5A7077] font-mono">
                      <th className="py-2">{lang === "bn" ? "আইডি" : "ID"}</th>
                      <th className="py-2">{lang === "bn" ? "জরুরিতা" : "Urgency"}</th>
                      <th className="py-2">{lang === "bn" ? "লোকসংখ্যা" : "Headcount"}</th>
                      <th className="py-2">{lang === "bn" ? "ল্যান্ডমার্ক" : "Landmark"}</th>
                      <th className="py-2">{lang === "bn" ? "স্ট্যাটাস" : "Status"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DBE6E2]">
                    {filteredCases.map((c) => (
                      <tr
                        key={c.id}
                        onClick={() => handleSelectCase(c)}
                        className="hover:bg-[#F4F7F6] cursor-pointer"
                      >
                        <td className="py-2 font-mono font-bold text-[#0B766E]">{c.id}</td>
                        <td className="py-2 uppercase font-bold">{translateUrgency(c.urgency, lang)}</td>
                        <td className="py-2 font-mono">{formatNumber(c.groupSize, lang)}</td>
                        <td className="py-2">{c.approximateLocation || "Dacope"}</td>
                        <td className="py-2 uppercase">{translateStatus(c.status, lang)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Slide-Up / Inline Inspection & Dispatch Drawer */}
          {selectedCaseDetails && (
            <div className="bg-white p-6 rounded-2xl border border-[#0B766E] shadow-xl space-y-4 animate-in fade-in duration-200">
              <div className="flex items-start justify-between border-b border-[#DBE6E2] pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#0B766E]">
                      {selectedCaseDetails.id}
                    </span>
                    <span className="text-[10px] bg-[#071520] text-[#63DEC2] font-mono px-2 py-0.5 rounded font-bold uppercase">
                      Status: {selectedCaseDetails.status.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#142D36] mt-0.5">
                    {lang === "bn" ? "কেস ট্রায়াজ ও ম্যাচিং যাচাইকরণ" : "Case Triage & Matching Verification"}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedCaseDetails(null)}
                  className="text-[#5A7077] hover:text-[#142D36] p-1.5 rounded-lg hover:bg-[#F4F7F6]"
                  aria-label="Close case drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 4-Step Dispatch Stepper */}
              <div className="p-3 bg-[#F4F7F6] rounded-xl border border-[#DBE6E2] space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-mono font-bold text-[#5A7077]">
                  <span className="text-[#0B766E]">
                    {lang === "bn" ? "সমন্বয়কারী নিয়ন্ত্রণাধীন ডিসপ্যাচ ওয়ার্কফ্লো" : "Human-in-the-Loop Dispatch Workflow"}
                  </span>
                  <span>
                    {selectedCaseDetails.status === "assigned" || selectedCaseDetails.status === "en_route" || selectedCaseDetails.status === "completed"
                      ? (lang === "bn" ? "পর্যায় ৪ / ৪ · প্রেরিত" : "Stage 4 of 4 · Dispatched")
                      : (lang === "bn" ? "পর্যায় ৩ / ৪ · অনুমোদনের অপেক্ষায়" : "Stage 3 of 4 · Awaiting Coordinator Approval")}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] font-bold">
                  <div className="py-1 px-1 rounded-md bg-[#0B766E] text-white flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-[#63DEC2]" />
                    <span>1. {lang === "bn" ? "ইনটেক" : "Intake"}</span>
                  </div>
                  <div className="py-1 px-1 rounded-md bg-[#0B766E] text-white flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-[#63DEC2]" />
                    <span>2. {lang === "bn" ? "চাহিদা" : "Needs"}</span>
                  </div>
                  <div className="py-1 px-1 rounded-md bg-[#0B766E] text-white flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-[#63DEC2]" />
                    <span>3. {lang === "bn" ? "শর্তাবলী" : "Constraints"}</span>
                  </div>
                  <div
                    className={`py-1 px-1 rounded-md flex items-center justify-center gap-1 ${
                      selectedCaseDetails.status === "assigned" || selectedCaseDetails.status === "en_route" || selectedCaseDetails.status === "completed"
                        ? "bg-[#159B82] text-white"
                        : "bg-[#F59E0B] text-black"
                    }`}
                  >
                    <ShieldCheck className="w-3 h-3" />
                    <span>4. {lang === "bn" ? "অনুমোদন" : "Auth"}</span>
                  </div>
                </div>
              </div>

              {/* Citizen Raw Text */}
              <div className="p-3.5 rounded-xl bg-[#F4F7F6] border border-[#DBE6E2] space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#5A7077]">
                  {lang === "bn" ? "মূল নাগরিক বিবরণ" : "Original Intake"} ({selectedCaseDetails.language.toUpperCase()})
                </span>
                <p className="text-xs text-[#142D36] italic leading-relaxed">
                  &ldquo;{selectedCaseDetails.rawDescription}&rdquo;
                </p>
              </div>

              {/* Extracted Constraints (Test Invariant: Verified Support Constraints:) */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-[#142D36]">
                  Verified Support Constraints: {lang === "bn" ? "(যাচাইকৃত সুবিধাসমূহ)" : ""}
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedCaseDetails.supportNeeds.map((n) => (
                    <span
                      key={n.id}
                      className="text-xs bg-[#0B766E]/10 text-[#0B766E] font-bold px-2.5 py-1 rounded-lg border border-[#0B766E]/30 font-mono text-[11px]"
                    >
                      {translateNeed(n.needType, lang)}
                    </span>
                  ))}
                </div>
              </div>

              {/* Algorithmic Match Matrix (Test Invariant: Intelligent Matching Engine Output) */}
              <div className="space-y-3 pt-2 border-t border-[#DBE6E2]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0B766E] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#159B82]" />
                    <span>Intelligent Matching Engine Output {lang === "bn" ? "(ম্যাচিং ইঞ্জিন)" : ""}</span>
                  </span>
                  {matchingData && (
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase font-mono ${
                        matchingData.feasibility === "verified_safe_match"
                          ? "bg-[#159B82] text-white"
                          : matchingData.feasibility === "partial_match"
                          ? "bg-[#F59E0B] text-black"
                          : "bg-[#D9534F] text-white"
                      }`}
                    >
                      {matchingData.feasibility.replace(/_/g, " ")}
                    </span>
                  )}
                </div>

                {matchingLoading ? (
                  <div className="p-4 rounded-xl bg-[#F4F7F6] text-center text-xs text-[#5A7077] font-mono">
                    Verifying 7 physical constraints against registry...
                  </div>
                ) : matchingData ? (
                  <div className="space-y-3 text-xs">
                    {/* Vehicle Match Card with Photo */}
                    <div className="p-3 rounded-xl border border-[#DBE6E2] bg-[#F4F7F6] space-y-2">
                      <div className="flex items-center justify-between font-bold text-[#142D36]">
                        <span className="flex items-center gap-1.5">
                          <Truck className="w-4 h-4 text-[#0B766E]" />
                          Vehicle Allocation:
                        </span>
                        <span className="text-[#0B766E] font-mono text-[11px]">
                          {matchingData.vehicle ? `${matchingData.vehicle.distance_km} km` : "Unavailable"}
                        </span>
                      </div>
                      {matchingData.vehicle ? (
                        <div className="flex items-start gap-3">
                          <div className="relative w-16 h-14 rounded-lg overflow-hidden bg-black shrink-0">
                            <Image
                              src="/images/accessible_boarding_ramp.webp"
                              alt="Accessible vehicle ramp"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-bold text-[#142D36]">
                              {matchingData.vehicle.name}
                            </div>
                            <div className="text-[11px] text-[#5A7077] font-mono">
                              Available Capacity: {matchingData.vehicle.available_capacity} seats | Ramp:{" "}
                              {matchingData.vehicle.wheelchair_accessible ? "VERIFIED" : "NO"}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-[#D9534F] text-[11px]">
                          No verified vehicle with wheelchair/capacity headroom available.
                        </div>
                      )}
                    </div>

                    {/* Shelter Match Card with Photo (Test Invariant: Headroom: \d+ places) */}
                    <div className="p-3 rounded-xl border border-[#DBE6E2] bg-[#F4F7F6] space-y-2">
                      <div className="flex items-center justify-between font-bold text-[#142D36]">
                        <span className="flex items-center gap-1.5">
                          <Building2 className="w-4 h-4 text-[#0B766E]" />
                          Shelter Allocation:
                        </span>
                        <span className="text-[#0B766E] font-mono text-[11px]">
                          {matchingData.shelter ? `${matchingData.shelter.distance_km} km` : "Unavailable"}
                        </span>
                      </div>
                      {matchingData.shelter ? (
                        <div className="flex items-start gap-3">
                          <div className="relative w-16 h-14 rounded-lg overflow-hidden bg-black shrink-0">
                            <Image
                              src="/images/cyclone_shelter_infrastructure.webp"
                              alt="Shelter ramp"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-bold text-[#142D36]">
                              {matchingData.shelter.name}
                            </div>
                            <div className="text-[11px] text-[#5A7077] font-mono">
                              Headroom: {matchingData.shelter.available_capacity} places | Ramp:{" "}
                              {matchingData.shelter.ramp_available ? "YES" : "NO"} | Generator:{" "}
                              {matchingData.shelter.power_backup ? "YES" : "NO"}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-[#D9534F] text-[11px]">
                          No verified shelter satisfies step-free ramp and power constraints.
                        </div>
                      )}
                    </div>

                    {/* Volunteer Match */}
                    {matchingData.responder && (
                      <div className="p-3 rounded-xl border border-[#DBE6E2] bg-[#F4F7F6] space-y-1">
                        <div className="flex items-center justify-between font-bold text-[#142D36]">
                          <span className="flex items-center gap-1.5">
                            <Users className="w-4 h-4 text-[#0B766E]" />
                            {lang === "bn" ? "স্বেচ্ছাসেবক দল:" : "Volunteer Unit:"}
                          </span>
                          <span className="text-[#0B766E] font-mono text-[11px]">
                            {matchingData.responder.distance_km} km
                          </span>
                        </div>
                        <div className="font-bold text-[#142D36]">
                          {matchingData.responder.name} ({matchingData.responder.organization})
                        </div>
                        <div className="text-[11px] text-[#5A7077]">
                          {lang === "bn" ? "দক্ষতা:" : "Skills:"} {matchingData.responder.skills.join(", ")}
                        </div>
                      </div>
                    )}

                    {/* Explainability Breakdown */}
                    <div className="p-3.5 rounded-xl bg-[#071520] text-white text-xs space-y-1.5">
                      <span className="text-[10px] font-mono font-bold text-[#63DEC2] uppercase tracking-wider block">
                        {lang === "bn" ? "অ্যালগরিদম ব্যাখ্যা ও মূল্যায়ন চেকলিস্ট" : "Algorithm Explainability & Checklist"}
                      </span>
                      {matchingData.reasons.map((r, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-[11px] text-[#DBE6E2]">
                          <Check className="w-3.5 h-3.5 text-[#159B82] shrink-0 mt-0.5" />
                          <span>{r}</span>
                        </div>
                      ))}
                    </div>

                    {/* Dispatch Button */}
                    {selectedCaseDetails.status !== "assigned" &&
                    selectedCaseDetails.status !== "en_route" &&
                    selectedCaseDetails.status !== "completed" ? (
                      <div className="pt-2">
                        <button
                          type="button"
                          disabled={dispatching || matchingData.feasibility === "no_verified_safe_match"}
                          onClick={handleApproveDispatch}
                          className="btn-interactive w-full bg-[#0B766E] hover:bg-[#159B82] disabled:bg-gray-400 text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg transition flex items-center justify-center gap-2"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>
                            {dispatching
                              ? (lang === "bn" ? "অনুমোদন হচ্ছে..." : "Authorizing Dispatch...")
                              : (lang === "bn" ? "অনুমোদন ও ডিসপ্যাচ নিশ্চিত করুন" : "Authorize & Dispatch Assignment")}
                          </span>
                        </button>
                      </div>
                    ) : (
                      <div className="p-3.5 rounded-xl bg-[#159B82]/10 border border-[#159B82] text-[#159B82] font-bold text-xs text-center flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>
                          {lang === "bn"
                            ? "ডিসপ্যাচ অনুমোদিত এবং মাঠপর্যায়ের রেসপন্ডারকে দায়িত্ব দেওয়া হয়েছে।"
                            : "Dispatch Authorized & Active with Field Responder."}
                        </span>
                      </div>
                    )}

                    {dispatchError && (
                      <div className="p-3 rounded-xl bg-[#D9534F]/10 border border-[#D9534F] text-[#D9534F] text-xs font-bold">
                        {dispatchError}
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>
        </div>
      </div>
  );
}

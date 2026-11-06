"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Radio,
  Search,
  Filter,
  Users,
  MapPin,
  Clock,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Truck,
  Building2,
  ChevronRight,
  RefreshCw,
  Eye,
  List,
  Map as MapIcon,
  Sparkles,
  Info,
  Check,
  AlertCircle,
  X,
} from "lucide-react";
import { ResourceMatchRecommendation } from "@/lib/types";

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
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [selectedCaseDetails, setSelectedCaseDetails] = useState<CaseItem | null>(null);
  const [matchingData, setMatchingData] = useState<ResourceMatchRecommendation | null>(null);
  const [matchingLoading, setMatchingLoading] = useState(false);
  const [dispatching, setDispatching] = useState(false);
  const [dispatchError, setDispatchError] = useState<string | null>(null);
  const [dispatchSuccess, setDispatchSuccess] = useState(false);

  // View toggle: Map vs Accessible List
  const [viewMode, setViewMode] = useState<"map" | "list">("map");

  // Filters
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterUrgency, setFilterUrgency] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCases = async () => {
    try {
      setLoading(true);
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
    fetchCases();
  }, []);

  // When a case is clicked, fetch its match recommendation
  const handleSelectCase = async (c: CaseItem) => {
    setSelectedCaseId(c.id);
    setSelectedCaseDetails(c);
    setDispatchError(null);
    setDispatchSuccess(false);
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

  // Dispatch Assignment
  const handleApproveDispatch = async () => {
    if (!selectedCaseDetails || !matchingData) return;
    setDispatching(true);
    setDispatchError(null);
    try {
      const res = await fetch("/api/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: selectedCaseDetails.id,
          vehicleId: matchingData.vehicle?.id,
          shelterId: matchingData.shelter?.id,
          responderId: matchingData.responder?.id,
          coordinatorName: "Coordinator Duty Desk (OpCell-1)",
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to approve assignment.");
      }

      setDispatchSuccess(true);
      await fetchCases();
      // Re-fetch case details
      const updatedRes = await fetch(`/api/requests/${selectedCaseDetails.id}`);
      const updatedJson = await updatedRes.json();
      if (updatedJson.success) {
        setSelectedCaseDetails(updatedJson.data);
      }
    } catch (err) {
      setDispatchError((err as Error).message);
    } finally {
      setDispatching(false);
    }
  };

  // Filtered cases
  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      if (filterStatus !== "all" && c.status !== filterStatus) return false;
      if (filterUrgency !== "all" && c.urgency !== filterUrgency) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = c.id.toLowerCase().includes(q);
        const matchText = c.rawDescription.toLowerCase().includes(q);
        const matchLoc = (c.approximateLocation || "").toLowerCase().includes(q);
        if (!matchId && !matchText && !matchLoc) return false;
      }
      return true;
    });
  }, [cases, filterStatus, filterUrgency, searchQuery]);

  // KPIs
  const activeCount = cases.filter((c) => c.status !== "completed" && c.status !== "cancelled").length;
  const awaitingCount = cases.filter((c) => c.status === "pending_review").length;
  const assignedCount = cases.filter((c) => ["assigned", "en_route", "arrived"].includes(c.status)).length;
  const completedCount = cases.filter((c) => c.status === "completed").length;

  return (
    <div className="min-h-screen bg-[#F4F7F6] py-6 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Operations Header */}
      <div className="bg-[#091E2C] text-white p-5 rounded-2xl border border-[#103B48] shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#63DEC2] animate-pulse" />
            <span className="text-xs font-mono font-semibold text-[#63DEC2] uppercase tracking-wider">
              Emergency Operations Center
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white mt-0.5">
            Dacope Coastal Flood Response — Upazila Operations Cell
          </h1>
          <p className="text-xs text-[#DBE6E2]/80 mt-1">
            Simulated Hazard: Tidal Surge Inundation 2.8m (Signal 7) | Operational Base: Chalna, Khulna
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-[#103B48] px-3 py-1.5 rounded-xl border border-[#0B766E]/40 text-xs text-[#63DEC2] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI: Demo mode — simulated fallback</span>
          </div>

          <button
            onClick={fetchCases}
            className="flex items-center gap-1.5 bg-[#0B766E] hover:bg-[#159B82] text-white text-xs font-bold px-3 py-2 rounded-xl transition"
            title="Refresh active case telemetry"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-[#DBE6E2] shadow-sm">
          <div className="text-xs font-bold text-[#60747A] uppercase tracking-wider">
            Active Requests
          </div>
          <div className="text-3xl font-black text-[#142D36] mt-1">{activeCount}</div>
          <div className="text-[11px] text-[#60747A] mt-1">Total in flight</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#DBE6E2] shadow-sm">
          <div className="text-xs font-bold text-[#D9534F] uppercase tracking-wider">
            Awaiting Review
          </div>
          <div className="text-3xl font-black text-[#D9534F] mt-1">{awaitingCount}</div>
          <div className="text-[11px] text-[#60747A] mt-1">Pending coordinator action</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#DBE6E2] shadow-sm">
          <div className="text-xs font-bold text-[#0B766E] uppercase tracking-wider">
            Assigned / In Progress
          </div>
          <div className="text-3xl font-black text-[#0B766E] mt-1">{assignedCount}</div>
          <div className="text-[11px] text-[#60747A] mt-1">Units deployed in field</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#DBE6E2] shadow-sm">
          <div className="text-xs font-bold text-[#159B82] uppercase tracking-wider">
            Confirmed Delivered
          </div>
          <div className="text-3xl font-black text-[#159B82] mt-1">{completedCount}</div>
          <div className="text-[11px] text-[#60747A] mt-1">Evacuations complete</div>
        </div>
      </div>

      {/* Main Grid: Left List/Map, Right Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (Cases & Map) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Controls Header */}
          <div className="bg-white p-4 rounded-2xl border border-[#DBE6E2] shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#60747A] absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search case ID, keyword, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#DBE6E2] text-xs focus:ring-1 focus:ring-[#0B766E] focus:outline-none"
                />
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-1 bg-[#F4F7F6] p-1 rounded-xl border border-[#DBE6E2] self-end sm:self-auto">
                <button
                  onClick={() => setViewMode("map")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    viewMode === "map"
                      ? "bg-[#0B766E] text-white shadow-sm"
                      : "text-[#60747A] hover:text-[#142D36]"
                  }`}
                  aria-label="Switch to operational map view"
                >
                  <MapIcon className="w-3.5 h-3.5" />
                  <span>Map</span>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    viewMode === "list"
                      ? "bg-[#0B766E] text-white shadow-sm"
                      : "text-[#60747A] hover:text-[#142D36]"
                  }`}
                  aria-label="Switch to accessible list view"
                >
                  <List className="w-3.5 h-3.5" />
                  <span>Accessible List</span>
                </button>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#DBE6E2]">
              <span className="text-[11px] font-bold text-[#60747A] flex items-center gap-1">
                <Filter className="w-3 h-3" /> Filters:
              </span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-[11px] bg-[#F4F7F6] border border-[#DBE6E2] rounded-lg px-2 py-1 font-medium text-[#142D36]"
              >
                <option value="all">All Statuses</option>
                <option value="pending_review">Pending Review</option>
                <option value="matching">Matching</option>
                <option value="assigned">Assigned</option>
                <option value="completed">Completed</option>
              </select>

              <select
                value={filterUrgency}
                onChange={(e) => setFilterUrgency(e.target.value)}
                className="text-[11px] bg-[#F4F7F6] border border-[#DBE6E2] rounded-lg px-2 py-1 font-medium text-[#142D36]"
              >
                <option value="all">All Urgencies</option>
                <option value="critical">Critical</option>
                <option value="urgent">Urgent</option>
                <option value="routine">Routine</option>
              </select>

              <div className="text-[11px] text-[#60747A] ml-auto">
                Showing {filteredCases.length} of {cases.length} cases
              </div>
            </div>
          </div>

          {/* Map View */}
          {viewMode === "map" && (
            <div className="bg-[#091E2C] rounded-2xl border border-[#103B48] p-4 shadow-md relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-[#63DEC2] mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span className="font-bold">Dacope Coastal Inundation Sector (22.57°N, 89.51°E)</span>
                </div>
                <span className="text-[11px] text-[#DBE6E2]/70">Click pin to open case</span>
              </div>

              {/* Interactive Vector Operational Map */}
              <div className="relative w-full h-[320px] bg-[#103B48]/40 rounded-xl border border-white/10 overflow-hidden flex items-center justify-center">
                {/* SVG Operational Layer */}
                <svg
                  className="w-full h-full"
                  viewBox="0 0 600 320"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Rivers */}
                  <path
                    d="M 100,-20 C 130,70 170,120 200,160 C 240,210 320,260 380,340 L 440,340 C 370,250 300,190 260,150 C 230,110 190,60 170,-20 Z"
                    fill="#103B48"
                    stroke="#0B766E"
                    strokeWidth="1.5"
                  />

                  {/* Hazard Zone */}
                  <polygon
                    points="70,90 240,70 420,110 520,180 480,290 260,310 90,260 50,160"
                    fill="#D9534F"
                    fillOpacity="0.12"
                    stroke="#D9534F"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />

                  {/* Shelters */}
                  <g>
                    <circle cx="340" cy="150" r="12" fill="#159B82" stroke="#FFFFFF" strokeWidth="2" />
                    <text x="340" y="175" fill="#63DEC2" fontSize="9" fontWeight="bold" textAnchor="middle">
                      Dacope Model Shelter
                    </text>
                  </g>
                  <g>
                    <circle cx="480" cy="220" r="10" fill="#159B82" stroke="#FFFFFF" strokeWidth="2" />
                    <text x="480" y="242" fill="#63DEC2" fontSize="9" fontWeight="bold" textAnchor="middle">
                      Chalna High School
                    </text>
                  </g>

                  {/* Case Pins from Real DB */}
                  {filteredCases.map((c, idx) => {
                    // Coordinate mapping onto SVG grid
                    const cx = 120 + ((idx * 55) % 420);
                    const cy = 70 + ((idx * 45) % 210);
                    const isSelected = selectedCaseId === c.id;
                    const isUrgent = c.urgency === "critical" || c.urgency === "urgent";

                    return (
                      <g
                        key={c.id}
                        className="cursor-pointer"
                        onClick={() => handleSelectCase(c)}
                      >
                        {isUrgent && (
                          <circle cx={cx} cy={cy} r={isSelected ? 16 : 10} fill={c.urgency === "critical" ? "#D9534F" : "#ECAF42"} fillOpacity="0.3">
                            <animate attributeName="r" values="8;16" dur="2s" repeatCount="indefinite" />
                          </circle>
                        )}
                        <circle
                          cx={cx}
                          cy={cy}
                          r={isSelected ? 8 : 6}
                          fill={c.urgency === "critical" ? "#D9534F" : "#ECAF42"}
                          stroke="#FFFFFF"
                          strokeWidth={isSelected ? 2 : 1}
                        />
                        <text
                          x={cx}
                          y={cy - 9}
                          fill="#FFFFFF"
                          fontSize="8"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          {c.id.slice(-4)}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Map legend overlay */}
                <div className="absolute bottom-2 left-2 bg-[#091E2C]/90 border border-white/10 rounded-lg p-2 text-[10px] text-[#DBE6E2] space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#D9534F]" /> Critical Case
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#ECAF42]" /> Urgent Case
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#159B82]" /> Verified Shelter
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Priority Queue (List / Cards) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-[#142D36]">
              <span>Active Case Priority Queue</span>
              <span className="text-[#60747A]">Sorted by Urgency & Arrival</span>
            </div>

            {loading ? (
              <div className="p-8 text-center text-xs text-[#60747A] bg-white rounded-2xl border border-[#DBE6E2]">
                Loading case telemetry...
              </div>
            ) : filteredCases.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#60747A] bg-white rounded-2xl border border-[#DBE6E2]">
                No cases matching current filter parameters.
              </div>
            ) : (
              filteredCases.map((c) => {
                const isSelected = selectedCaseId === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => handleSelectCase(c)}
                    className={`p-4 rounded-2xl border transition cursor-pointer shadow-sm ${
                      isSelected
                        ? "border-[#0B766E] bg-white ring-2 ring-[#0B766E]"
                        : "border-[#DBE6E2] bg-white hover:border-[#0B766E]/50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-[#0B766E]">
                          {c.id}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                            c.urgency === "critical"
                              ? "bg-[#D9534F] text-white"
                              : c.urgency === "urgent"
                              ? "bg-[#ECAF42] text-[#091E2C]"
                              : "bg-[#DBE6E2] text-[#142D36]"
                          }`}
                        >
                          {c.urgency}
                        </span>
                        <span className="text-[10px] bg-[#103B48] text-[#63DEC2] font-mono px-1.5 py-0.5 rounded">
                          {c.language.toUpperCase()}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[11px] font-bold capitalize text-[#142D36]">
                          {c.status.replace(/_/g, " ")}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-[#142D36] line-clamp-2 leading-relaxed">
                      {c.rawDescription}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 mt-3 pt-2 border-t border-[#DBE6E2]/60 text-[11px] text-[#60747A]">
                      <span className="flex items-center gap-1 font-semibold text-[#142D36]">
                        <Users className="w-3.5 h-3.5 text-[#0B766E]" />
                        {c.groupSize} Person(s)
                      </span>
                      {c.approximateLocation && (
                        <span className="flex items-center gap-1 truncate max-w-[200px]">
                          <MapPin className="w-3.5 h-3.5 text-[#0B766E]" />
                          {c.approximateLocation}
                        </span>
                      )}
                      <div className="flex flex-wrap gap-1 ml-auto">
                        {c.supportNeeds.slice(0, 2).map((n) => (
                          <span
                            key={n.id}
                            className="text-[10px] bg-[#0B766E]/10 text-[#0B766E] font-medium px-2 py-0.5 rounded"
                          >
                            {n.needType.replace(/_/g, " ")}
                          </span>
                        ))}
                        {c.supportNeeds.length > 2 && (
                          <span className="text-[10px] text-[#60747A]">
                            +{c.supportNeeds.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column (Case Detail & Resource Matching Engine) */}
        <div className="lg:col-span-5 sticky top-24">
          {selectedCaseDetails ? (
            <div className="bg-white p-6 rounded-2xl border border-[#DBE6E2] shadow-md space-y-5">
              {/* Header */}
              <div className="flex items-start justify-between gap-3 border-b border-[#DBE6E2] pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-[#142D36]">
                      {selectedCaseDetails.id}
                    </h2>
                    <span className="text-xs bg-[#0B766E]/10 text-[#0B766E] font-mono px-2 py-0.5 rounded font-bold">
                      {selectedCaseDetails.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-[#60747A] mt-0.5">
                    Landmark: {selectedCaseDetails.approximateLocation || "Pending Location Confirmation"}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedCaseDetails(null)}
                  className="text-[#60747A] hover:text-[#142D36] p-1"
                  aria-label="Close case drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Citizen Original Voice/Text */}
              <div className="p-3.5 rounded-xl bg-[#F4F7F6] border border-[#DBE6E2] space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#60747A]">
                  Original Assistance Intake ({selectedCaseDetails.language.toUpperCase()})
                </span>
                <p className="text-xs text-[#142D36] italic leading-relaxed">
                  &ldquo;{selectedCaseDetails.rawDescription}&rdquo;
                </p>
              </div>

              {/* Extracted Structured Support Needs */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#142D36]">
                  Verified Support Constraints:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCaseDetails.supportNeeds.map((n) => (
                    <span
                      key={n.id}
                      className="text-xs bg-[#0B766E]/10 text-[#0B766E] font-bold px-2.5 py-1 rounded-lg border border-[#0B766E]/20"
                    >
                      {n.needType.replace(/_/g, " ")}
                    </span>
                  ))}
                </div>
              </div>

              {/* Intelligent Matching Engine Recommendation */}
              <div className="space-y-3 pt-2 border-t border-[#DBE6E2]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#0B766E]">
                    <Sparkles className="w-4 h-4" />
                    <span>Intelligent Matching Engine Output</span>
                  </div>
                  {matchingData && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        matchingData.feasibility === "verified_safe_match"
                          ? "bg-[#159B82] text-white"
                          : matchingData.feasibility === "partial_match"
                          ? "bg-[#ECAF42] text-[#091E2C]"
                          : "bg-[#D9534F] text-white"
                      }`}
                    >
                      {matchingData.feasibility.replace(/_/g, " ")}
                    </span>
                  )}
                </div>

                {matchingLoading ? (
                  <div className="p-4 rounded-xl bg-[#F4F7F6] text-center text-xs text-[#60747A]">
                    Evaluating 7 hard physical constraints against registry...
                  </div>
                ) : matchingData ? (
                  <div className="space-y-3">
                    {/* Vehicle Match Card */}
                    <div className="p-3 rounded-xl border border-[#DBE6E2] bg-[#F4F7F6] text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold text-[#142D36]">
                        <span className="flex items-center gap-1.5">
                          <Truck className="w-3.5 h-3.5 text-[#0B766E]" />
                          Recommended Vehicle:
                        </span>
                        <span className="text-[#0B766E]">
                          {matchingData.vehicle ? `${matchingData.vehicle.distance_km} km away` : "None Available"}
                        </span>
                      </div>
                      {matchingData.vehicle ? (
                        <>
                          <div className="font-semibold text-[#142D36]">
                            {matchingData.vehicle.name}
                          </div>
                          <div className="text-[11px] text-[#60747A]">
                            Available Capacity: {matchingData.vehicle.available_capacity} seats | Ramp/Lift:{" "}
                            {matchingData.vehicle.wheelchair_accessible ? "YES" : "NO"}
                          </div>
                        </>
                      ) : (
                        <div className="text-[#D9534F] text-[11px]">
                          No verified vehicle with wheelchair/capacity headroom available.
                        </div>
                      )}
                    </div>

                    {/* Shelter Match Card */}
                    <div className="p-3 rounded-xl border border-[#DBE6E2] bg-[#F4F7F6] text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold text-[#142D36]">
                        <span className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-[#0B766E]" />
                          Recommended Shelter:
                        </span>
                        <span className="text-[#0B766E]">
                          {matchingData.shelter ? `${matchingData.shelter.distance_km} km away` : "None Available"}
                        </span>
                      </div>
                      {matchingData.shelter ? (
                        <>
                          <div className="font-semibold text-[#142D36]">
                            {matchingData.shelter.name}
                          </div>
                          <div className="text-[11px] text-[#60747A]">
                            Headroom: {matchingData.shelter.available_capacity} places | Ramp:{" "}
                            {matchingData.shelter.ramp_available ? "YES" : "NO"} | Generator:{" "}
                            {matchingData.shelter.power_backup ? "YES" : "NO"}
                          </div>
                        </>
                      ) : (
                        <div className="text-[#D9534F] text-[11px]">
                          No verified shelter satisfies step-free ramp and power constraints.
                        </div>
                      )}
                    </div>

                    {/* Responder Unit Match Card */}
                    {matchingData.responder && (
                      <div className="p-3 rounded-xl border border-[#DBE6E2] bg-[#F4F7F6] text-xs space-y-1">
                        <div className="flex items-center justify-between font-bold text-[#142D36]">
                          <span className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-[#0B766E]" />
                            Assigned Volunteer Team:
                          </span>
                          <span className="text-[#0B766E]">{matchingData.responder.distance_km} km away</span>
                        </div>
                        <div className="font-semibold text-[#142D36]">
                          {matchingData.responder.name} ({matchingData.responder.organization})
                        </div>
                        <div className="text-[11px] text-[#60747A]">
                          Skills: {matchingData.responder.skills.join(", ")}
                        </div>
                      </div>
                    )}

                    {/* Explainability Breakdown */}
                    <div className="p-3 rounded-xl bg-[#091E2C] text-white text-xs space-y-1.5">
                      <span className="text-[10px] font-bold text-[#63DEC2] uppercase tracking-wider block">
                        Algorithm Explainability & Checklist
                      </span>
                      {matchingData.reasons.map((r, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-[11px] text-[#DBE6E2]">
                          <Check className="w-3 h-3 text-[#159B82] shrink-0 mt-0.5" />
                          <span>{r}</span>
                        </div>
                      ))}
                      {matchingData.warnings.map((w, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-[11px] text-[#ECAF42]">
                          <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
                          <span>{w}</span>
                        </div>
                      ))}
                    </div>

                    {/* Dispatch Action Button */}
                    {selectedCaseDetails.status === "pending_review" ||
                    selectedCaseDetails.status === "matching" ? (
                      <div className="pt-2 space-y-2">
                        {dispatchError && (
                          <div className="p-2.5 rounded-lg bg-[#D9534F]/10 border border-[#D9534F] text-[#D9534F] text-xs font-semibold flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{dispatchError}</span>
                          </div>
                        )}

                        {dispatchSuccess ? (
                          <div className="p-3 rounded-xl bg-[#159B82]/10 border border-[#159B82] text-[#159B82] text-xs font-bold text-center">
                            Assignment successfully approved and dispatched to field responder!
                          </div>
                        ) : (
                          <button
                            type="button"
                            disabled={dispatching || matchingData.feasibility === "no_verified_safe_match"}
                            onClick={handleApproveDispatch}
                            className="w-full bg-[#0B766E] hover:bg-[#159B82] disabled:opacity-50 text-white py-3 rounded-xl font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
                          >
                            {dispatching ? (
                              <span>Locking Reservations & Dispatching...</span>
                            ) : (
                              <>
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Authorize & Dispatch Assignment</span>
                              </>
                            )}
                          </button>
                        )}
                        <p className="text-[10px] text-[#60747A] text-center">
                          Human-in-the-Loop Check: Consequential dispatches require coordinator authorization.
                        </p>
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-[#0B766E]/10 border border-[#0B766E]/30 text-[#0B766E] text-xs font-bold text-center">
                        Assignment active (Status: {selectedCaseDetails.status.toUpperCase()})
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-2xl border border-[#DBE6E2] text-center text-xs text-[#60747A] shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#0B766E]/10 text-[#0B766E] mx-auto flex items-center justify-center">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-[#142D36]">Select an Assistance Request</h3>
              <p className="text-xs text-[#60747A] max-w-xs mx-auto">
                Click on any case in the list or on the operational map to inspect original voice text, extracted constraints, and execute verified dispatches.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

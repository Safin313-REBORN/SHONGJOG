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
  Compass,
  Crosshair,
  ShieldAlert,
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

  // Operational KPIs
  const activeCount = cases.filter((c) => c.status !== "completed" && c.status !== "cancelled").length;
  const awaitingCount = cases.filter((c) => c.status === "pending_review").length;
  const assignedCount = cases.filter((c) => ["assigned", "en_route", "arrived"].includes(c.status)).length;
  const completedCount = cases.filter((c) => c.status === "completed").length;

  return (
    <div className="min-h-screen bg-[#F4F7F6] py-6 px-4 sm:px-6 lg:px-8 space-y-5">
      {/* Institutional EOC Header */}
      <div className="bg-[#091E2C] text-white p-4 sm:p-5 rounded-xl border border-[#103B48] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#159B82]" />
            <span className="text-[11px] font-mono tracking-wider uppercase text-[#63DEC2] font-semibold">
              Emergency Operations Center · Tactical Command
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-black text-white mt-0.5">
            Dacope Coastal Flood Response — Upazila Operations Cell
          </h1>
          <p className="text-xs text-[#DBE6E2]/80 font-mono mt-0.5">
            GRID: 22°34&apos;N, 89°30&apos;E | SECTOR: DACOPE, KHULNA | HAZARD: TIDAL SURGE SIGNAL 7
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="bg-[#103B48] px-3 py-1.5 rounded-lg border border-[#0B766E]/40 text-xs font-mono text-[#63DEC2] flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#63DEC2]" />
            <span>AI: Demo mode — simulated fallback</span>
          </div>

          <button
            onClick={fetchCases}
            className="flex items-center gap-1.5 bg-[#0B766E] hover:bg-[#159B82] text-white text-xs font-bold px-3 py-1.5 rounded-lg transition"
            title="Refresh case telemetry"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="pro-card p-4 rounded-xl">
          <div className="text-[11px] font-mono font-bold text-[#60747A] uppercase tracking-wider">
            Active Requests
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#142D36] mt-1 tabular-nums">
            {activeCount}
          </div>
          <div className="text-[11px] text-[#60747A] mt-0.5">Total in flight</div>
        </div>

        <div className="pro-card p-4 rounded-xl border-l-4 border-l-[#D9534F]">
          <div className="text-[11px] font-mono font-bold text-[#D9534F] uppercase tracking-wider">
            Awaiting Review
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#D9534F] mt-1 tabular-nums">
            {awaitingCount}
          </div>
          <div className="text-[11px] text-[#60747A] mt-0.5">Pending coordinator action</div>
        </div>

        <div className="pro-card p-4 rounded-xl border-l-4 border-l-[#0B766E]">
          <div className="text-[11px] font-mono font-bold text-[#0B766E] uppercase tracking-wider">
            Assigned / In Progress
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#0B766E] mt-1 tabular-nums">
            {assignedCount}
          </div>
          <div className="text-[11px] text-[#60747A] mt-0.5">Units deployed in field</div>
        </div>

        <div className="pro-card p-4 rounded-xl border-l-4 border-l-[#159B82]">
          <div className="text-[11px] font-mono font-bold text-[#159B82] uppercase tracking-wider">
            Confirmed Delivered
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#159B82] mt-1 tabular-nums">
            {completedCount}
          </div>
          <div className="text-[11px] text-[#60747A] mt-0.5">Safe shelter verified</div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column (Map & Priority Queue) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Controls Bar */}
          <div className="pro-card p-3.5 rounded-xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-[#60747A] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter by case ID, landmark, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-[#DBE6E2] text-xs focus:ring-1 focus:ring-[#0B766E] focus:outline-none"
                />
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-1 bg-[#F4F7F6] p-1 rounded-lg border border-[#DBE6E2] self-end sm:self-auto">
                <button
                  onClick={() => setViewMode("map")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition ${
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
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition ${
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
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#DBE6E2] text-[11px]">
              <span className="font-bold text-[#60747A] flex items-center gap-1">
                <Filter className="w-3 h-3" /> Filters:
              </span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-[#F4F7F6] border border-[#DBE6E2] rounded px-2 py-1 font-medium text-[#142D36]"
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
                className="bg-[#F4F7F6] border border-[#DBE6E2] rounded px-2 py-1 font-medium text-[#142D36]"
              >
                <option value="all">All Urgencies</option>
                <option value="critical">Critical</option>
                <option value="urgent">Urgent</option>
                <option value="routine">Routine</option>
              </select>

              <span className="text-[#60747A] ml-auto font-mono text-[11px]">
                Showing {filteredCases.length} of {cases.length} cases
              </span>
            </div>
          </div>

          {/* Operational Map View */}
          {viewMode === "map" && (
            <div className="bg-[#091E2C] rounded-xl border border-[#103B48] p-3 shadow-md relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-[#63DEC2] mb-2 font-mono">
                <div className="flex items-center gap-1.5">
                  <Crosshair className="w-3.5 h-3.5" />
                  <span>GIS INCIDENT PLOTTER (22.57°N, 89.51°E)</span>
                </div>
                <span className="text-[10px] text-[#DBE6E2]/70">Click pin to inspect case</span>
              </div>

              {/* Vector Cartographic Display */}
              <div className="relative w-full h-[280px] bg-[#103B48]/30 rounded-lg border border-white/10 overflow-hidden flex items-center justify-center">
                <svg
                  className="w-full h-full"
                  viewBox="0 0 600 280"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Rivers */}
                  <path
                    d="M 100,-20 C 130,60 170,110 200,150 C 240,190 320,240 380,310 L 440,310 C 370,230 300,170 260,130 C 230,100 190,50 170,-20 Z"
                    fill="#103B48"
                    stroke="#0B766E"
                    strokeWidth="1.2"
                  />

                  {/* Hazard Inundation Area */}
                  <polygon
                    points="70,80 240,60 420,100 520,160 480,260 260,280 90,230 50,140"
                    fill="#D9534F"
                    fillOpacity="0.12"
                    stroke="#D9534F"
                    strokeWidth="1.2"
                    strokeDasharray="4 4"
                  />

                  {/* Verified Shelters */}
                  <g>
                    <rect x="330" y="130" width="18" height="18" rx="3" fill="#159B82" stroke="#FFFFFF" strokeWidth="1.5" />
                    <text x="339" y="143" fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle">
                      S1
                    </text>
                  </g>
                  <g>
                    <rect x="470" y="190" width="18" height="18" rx="3" fill="#159B82" stroke="#FFFFFF" strokeWidth="1.5" />
                    <text x="479" y="203" fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle">
                      S2
                    </text>
                  </g>

                  {/* Incident Case Pins */}
                  {filteredCases.map((c, idx) => {
                    const cx = 110 + ((idx * 60) % 430);
                    const cy = 60 + ((idx * 40) % 190);
                    const isSelected = selectedCaseId === c.id;

                    return (
                      <g
                        key={c.id}
                        className="cursor-pointer"
                        onClick={() => handleSelectCase(c)}
                      >
                        <circle
                          cx={cx}
                          cy={cy}
                          r={isSelected ? 7 : 5}
                          fill={c.urgency === "critical" ? "#D9534F" : "#ECAF42"}
                          stroke="#FFFFFF"
                          strokeWidth={isSelected ? 2 : 1}
                        />
                        <text
                          x={cx}
                          y={cy - 7}
                          fill="#DBE6E2"
                          fontSize="8"
                          fontFamily="monospace"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          {c.id.slice(-4)}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                <div className="absolute bottom-2 left-2 bg-[#091E2C]/90 border border-white/10 rounded px-2 py-1 text-[9px] font-mono text-[#DBE6E2] space-y-0.5">
                  <div>● Red: Critical Incident</div>
                  <div>● Amber: Urgent Incident</div>
                  <div>■ Green: Verified Step-Free Shelter</div>
                </div>
              </div>
            </div>
          )}

          {/* Priority Queue Cards */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-[#142D36]">
              <span className="uppercase tracking-wider text-[11px] text-[#60747A] font-mono">
                Active Case Priority Queue
              </span>
              <span className="text-[11px] font-mono text-[#60747A]">
                Ordered by Triage Urgency
              </span>
            </div>

            {loading ? (
              <div className="pro-card p-6 text-center text-xs text-[#60747A] rounded-xl">
                Loading case telemetry...
              </div>
            ) : filteredCases.length === 0 ? (
              <div className="pro-card p-6 text-center text-xs text-[#60747A] rounded-xl">
                No active records match the current filter selection.
              </div>
            ) : (
              filteredCases.map((c) => {
                const isSelected = selectedCaseId === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => handleSelectCase(c)}
                    className={`pro-card p-3.5 rounded-xl transition cursor-pointer ${
                      isSelected
                        ? "border-[#0B766E] ring-1 ring-[#0B766E] bg-white"
                        : "hover:border-[#0B766E]/60 bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-[#0B766E]">
                          {c.id}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                            c.urgency === "critical"
                              ? "bg-[#D9534F] text-white"
                              : c.urgency === "urgent"
                              ? "bg-[#ECAF42] text-[#091E2C]"
                              : "bg-[#DBE6E2] text-[#142D36]"
                          }`}
                        >
                          {c.urgency}
                        </span>
                        <span className="text-[9px] bg-[#103B48] text-[#63DEC2] font-mono px-1 py-0.5 rounded">
                          {c.language.toUpperCase()}
                        </span>
                      </div>

                      <span className="text-[10px] font-mono font-bold uppercase text-[#142D36]">
                        {c.status.replace(/_/g, " ")}
                      </span>
                    </div>

                    <p className="text-xs text-[#142D36] line-clamp-2 leading-relaxed">
                      {c.rawDescription}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 mt-2.5 pt-2 border-t border-[#DBE6E2] text-[11px] text-[#60747A]">
                      <span className="flex items-center gap-1 font-semibold text-[#142D36]">
                        <Users className="w-3.5 h-3.5 text-[#0B766E]" />
                        {c.groupSize} Evacuee(s)
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
                            className="text-[9px] bg-[#0B766E]/10 text-[#0B766E] font-medium px-1.5 py-0.5 rounded font-mono"
                          >
                            {n.needType.replace(/_/g, " ")}
                          </span>
                        ))}
                        {c.supportNeeds.length > 2 && (
                          <span className="text-[9px] text-[#60747A] font-mono">
                            +{c.supportNeeds.length - 2}
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

        {/* Right Column (Case Inspection Drawer) */}
        <div className="lg:col-span-5 sticky top-20">
          {selectedCaseDetails ? (
            <div className="pro-card p-5 rounded-xl shadow-sm space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between gap-3 border-b border-[#DBE6E2] pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-black text-[#142D36] font-mono">
                      {selectedCaseDetails.id}
                    </h2>
                    <span className="text-[10px] bg-[#0B766E]/10 text-[#0B766E] font-mono px-2 py-0.5 rounded font-bold">
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
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Citizen Raw Text */}
              <div className="p-3 rounded-lg bg-[#F4F7F6] border border-[#DBE6E2] space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#60747A]">
                  Original Intake ({selectedCaseDetails.language.toUpperCase()})
                </span>
                <p className="text-xs text-[#142D36] italic leading-relaxed">
                  &ldquo;{selectedCaseDetails.rawDescription}&rdquo;
                </p>
              </div>

              {/* Extracted Constraints */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-[#142D36]">
                  Verified Support Constraints:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCaseDetails.supportNeeds.map((n) => (
                    <span
                      key={n.id}
                      className="text-xs bg-[#0B766E]/10 text-[#0B766E] font-bold px-2 py-0.5 rounded border border-[#0B766E]/30 font-mono text-[11px]"
                    >
                      {n.needType.replace(/_/g, " ")}
                    </span>
                  ))}
                </div>
              </div>

              {/* Algorithmic Match Matrix */}
              <div className="space-y-2.5 pt-2 border-t border-[#DBE6E2]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0B766E] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Intelligent Matching Engine Output</span>
                  </span>
                  {matchingData && (
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase font-mono ${
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
                  <div className="p-3 rounded bg-[#F4F7F6] text-center text-xs text-[#60747A] font-mono">
                    Verifying 7 physical constraints against registry...
                  </div>
                ) : matchingData ? (
                  <div className="space-y-2.5 text-xs">
                    {/* Vehicle Match */}
                    <div className="p-2.5 rounded-lg border border-[#DBE6E2] bg-[#F4F7F6] space-y-0.5">
                      <div className="flex items-center justify-between font-bold text-[#142D36]">
                        <span className="flex items-center gap-1">
                          <Truck className="w-3.5 h-3.5 text-[#0B766E]" />
                          Vehicle Allocation:
                        </span>
                        <span className="text-[#0B766E] font-mono text-[11px]">
                          {matchingData.vehicle ? `${matchingData.vehicle.distance_km} km` : "Unavailable"}
                        </span>
                      </div>
                      {matchingData.vehicle ? (
                        <>
                          <div className="font-semibold text-[#142D36]">
                            {matchingData.vehicle.name}
                          </div>
                          <div className="text-[11px] text-[#60747A] font-mono">
                            Available Capacity: {matchingData.vehicle.available_capacity} seats | Ramp:{" "}
                            {matchingData.vehicle.wheelchair_accessible ? "VERIFIED" : "NO"}
                          </div>
                        </>
                      ) : (
                        <div className="text-[#D9534F] text-[11px]">
                          No verified vehicle with wheelchair/capacity headroom available.
                        </div>
                      )}
                    </div>

                    {/* Shelter Match */}
                    <div className="p-2.5 rounded-lg border border-[#DBE6E2] bg-[#F4F7F6] space-y-0.5">
                      <div className="flex items-center justify-between font-bold text-[#142D36]">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-[#0B766E]" />
                          Shelter Allocation:
                        </span>
                        <span className="text-[#0B766E] font-mono text-[11px]">
                          {matchingData.shelter ? `${matchingData.shelter.distance_km} km` : "Unavailable"}
                        </span>
                      </div>
                      {matchingData.shelter ? (
                        <>
                          <div className="font-semibold text-[#142D36]">
                            {matchingData.shelter.name}
                          </div>
                          <div className="text-[11px] text-[#60747A] font-mono">
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

                    {/* Responder Match */}
                    {matchingData.responder && (
                      <div className="p-2.5 rounded-lg border border-[#DBE6E2] bg-[#F4F7F6] space-y-0.5">
                        <div className="flex items-center justify-between font-bold text-[#142D36]">
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-[#0B766E]" />
                            Volunteer Unit:
                          </span>
                          <span className="text-[#0B766E] font-mono text-[11px]">
                            {matchingData.responder.distance_km} km
                          </span>
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
                    <div className="p-3 rounded-lg bg-[#091E2C] text-white text-xs space-y-1">
                      <span className="text-[10px] font-mono font-bold text-[#63DEC2] uppercase tracking-wider block">
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

                    {/* Dispatch Action */}
                    {selectedCaseDetails.status === "pending_review" ||
                    selectedCaseDetails.status === "matching" ? (
                      <div className="pt-2 space-y-2">
                        {dispatchError && (
                          <div className="p-2.5 rounded-lg bg-[#D9534F]/10 border border-[#D9534F] text-[#D9534F] text-xs font-semibold flex items-center gap-2">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{dispatchError}</span>
                          </div>
                        )}

                        {dispatchSuccess ? (
                          <div className="p-2.5 rounded-lg bg-[#159B82]/10 border border-[#159B82] text-[#159B82] text-xs font-bold text-center">
                            Assignment authorized and dispatched to field responder.
                          </div>
                        ) : (
                          <button
                            type="button"
                            disabled={dispatching || matchingData.feasibility === "no_verified_safe_match"}
                            onClick={handleApproveDispatch}
                            className="w-full bg-[#0B766E] hover:bg-[#159B82] disabled:opacity-50 text-white py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-1.5 shadow-sm"
                          >
                            {dispatching ? (
                              <span>Locking Capacity & Dispatching...</span>
                            ) : (
                              <>
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Authorize & Dispatch Assignment</span>
                              </>
                            )}
                          </button>
                        )}
                        <p className="text-[10px] text-[#60747A] text-center font-mono">
                          Human-in-the-Loop Check: Consequential dispatches require coordinator authorization.
                        </p>
                      </div>
                    ) : (
                      <div className="p-2.5 rounded-lg bg-[#0B766E]/10 border border-[#0B766E]/30 text-[#0B766E] text-xs font-bold text-center font-mono uppercase">
                        Assignment committed ({selectedCaseDetails.status})
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="pro-card p-6 rounded-xl text-center text-xs text-[#60747A] space-y-2">
              <Eye className="w-6 h-6 text-[#0B766E] mx-auto" />
              <h3 className="font-bold text-sm text-[#142D36]">Select an Incident from Queue</h3>
              <p className="text-xs text-[#60747A] max-w-xs mx-auto">
                Inspect original voice text, examine extracted functional constraints, and approve safe dispatches.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

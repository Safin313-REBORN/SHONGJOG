"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Building2,
  Truck,
  Users,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Search,
  Check,
  Zap,
  Accessibility,
  ArrowLeft,
  X,
  ExternalLink,
} from "lucide-react";

interface ResourceItem {
  id: string;
  resourceType: string;
  name: string;
  verificationStatus: string;
  isActive: boolean;
  totalCapacity: number;
  reservedCapacity: number;
  currentOccupancy: number;
  latitude: number;
  longitude: number;
  contactInfo: string | null;
  notes: string | null;
  verificationSource: string | null;
  lastVerifiedAt: string | null;
  vehicleDetails?: {
    vehicleType: string;
    wheelchairAccessible: boolean;
    wheelchairCapacity: number;
    stretcherCapable: boolean;
    driverName: string | null;
  } | null;
  shelterDetails?: {
    stepFreeAccess: boolean;
    rampAvailable: boolean;
    accessibleToilets: boolean;
    powerBackup: boolean;
    separateFemaleSpace: boolean;
    managerName: string | null;
  } | null;
  responderDetails?: {
    organization: string;
    badgeNumber: string | null;
    skillsJson: string;
    currentStatus: string;
  } | null;
}

export default function ResourcesRegistryPage() {
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterVerification, setFilterVerification] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedResource, setSelectedResource] = useState<ResourceItem | null>(null);
  const [updating, setUpdating] = useState(false);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/resources");
      const json = await res.json();
      if (json.success) {
        setResources(json.data);
      }
    } catch (err) {
      console.error("Fetch resources error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleUpdateVerification = async (resId: string, newStatus: string) => {
    try {
      setUpdating(true);
      const res = await fetch(`/api/resources/${resId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verificationStatus: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        await fetchResources();
        setSelectedResource(json.data);
      }
    } catch (err) {
      console.error("Update error:", err);
    } finally {
      setUpdating(false);
    }
  };

  const filteredResources = resources.filter((r) => {
    if (filterType !== "all" && r.resourceType !== filterType) return false;
    if (filterVerification !== "all" && r.verificationStatus !== filterVerification) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = r.name.toLowerCase().includes(q);
      const matchId = r.id.toLowerCase().includes(q);
      const matchNotes = (r.notes || "").toLowerCase().includes(q);
      if (!matchName && !matchId && !matchNotes) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F4F7F6] py-6 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="bg-[#091E2C] text-white p-5 rounded-2xl border border-[#103B48] shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#63DEC2]" />
            <span className="text-xs font-mono font-semibold text-[#63DEC2] uppercase tracking-wider">
              Asset & Accommodation Registry
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white mt-0.5">
            Verified Shelters, Evacuation Vehicles & Response Squads
          </h1>
          <p className="text-xs text-[#DBE6E2]/80 mt-1">
            Dacope, Khulna Logistics Pool — Strict Hard Constraint Auditing
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/operations"
            className="inline-flex items-center gap-1.5 bg-[#0B766E] hover:bg-[#159B82] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Operations Center</span>
          </Link>
        </div>
      </div>

      {/* Safety Quarantine Callout */}
      <div className="bg-[#ECAF42]/10 border border-[#ECAF42]/40 p-4 rounded-2xl text-xs text-[#142D36] flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-[#ECAF42] shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">Verification Policy & Hard Constraint Integrity:</strong>
          <p className="text-[#60747A] mt-0.5 leading-relaxed">
            Resources flagged as <strong>Unverified</strong> or <strong>Community Reported</strong> are strictly isolated and quarantined from the automated safe dispatch pool until verified by an authorized field engineer or partner auditor.
          </p>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#DBE6E2] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#60747A] absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search assets by name or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#DBE6E2] text-xs focus:ring-1 focus:ring-[#0B766E] focus:outline-none"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="text-xs bg-[#F4F7F6] border border-[#DBE6E2] rounded-xl px-3 py-2 font-medium text-[#142D36]"
          >
            <option value="all">All Asset Types</option>
            <option value="shelter">Shelters Only</option>
            <option value="vehicle">Vehicles Only</option>
            <option value="responder">Volunteer Squads</option>
          </select>

          <select
            value={filterVerification}
            onChange={(e) => setFilterVerification(e.target.value)}
            className="text-xs bg-[#F4F7F6] border border-[#DBE6E2] rounded-xl px-3 py-2 font-medium text-[#142D36]"
          >
            <option value="all">All Verification Tiers</option>
            <option value="verified">Officially Verified</option>
            <option value="partner_verified">Partner Verified</option>
            <option value="community_reported">Community Reported</option>
            <option value="unverified">Unverified</option>
          </select>

          <div className="text-xs text-[#60747A] ml-auto">
            {filteredResources.length} items
          </div>
        </div>
      </div>

      {/* Resource Cards Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-[#60747A] bg-white rounded-2xl border border-[#DBE6E2]">
          Loading asset registry...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((res) => {
            const isVerified = res.verificationStatus === "verified" || res.verificationStatus === "partner_verified";
            const availableHeadroom = res.totalCapacity - res.reservedCapacity - res.currentOccupancy;

            return (
              <div
                key={res.id}
                onClick={() => setSelectedResource(res)}
                className="bg-white p-5 rounded-2xl border border-[#DBE6E2] shadow-sm hover:border-[#0B766E] transition cursor-pointer flex flex-col justify-between space-y-4"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-[11px] font-bold text-[#0B766E]">
                      {res.id}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        res.verificationStatus === "verified"
                          ? "bg-[#159B82] text-white"
                          : res.verificationStatus === "partner_verified"
                          ? "bg-[#0B766E] text-white"
                          : res.verificationStatus === "community_reported"
                          ? "bg-[#ECAF42] text-[#091E2C]"
                          : "bg-[#D9534F] text-white"
                      }`}
                    >
                      {res.verificationStatus.replace(/_/g, " ")}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-[#142D36] leading-snug">
                    {res.name}
                  </h3>
                  <p className="text-xs text-[#60747A] mt-1 line-clamp-2">
                    {res.notes}
                  </p>
                </div>

                {/* Specific Capability Chips */}
                <div className="space-y-3 pt-3 border-t border-[#DBE6E2]/70 text-xs">
                  {/* Shelter features */}
                  {res.shelterDetails && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] text-[#60747A]">
                        <span>Capacity Headroom:</span>
                        <span className="font-bold text-[#142D36]">
                          {availableHeadroom} / {res.totalCapacity} Available
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        <span
                          className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                            res.shelterDetails.rampAvailable
                              ? "bg-[#159B82]/10 text-[#159B82] font-bold"
                              : "bg-[#D9534F]/10 text-[#D9534F]"
                          }`}
                        >
                          Ramp: {res.shelterDetails.rampAvailable ? "YES (1:12)" : "NO RAMP"}
                        </span>
                        <span
                          className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                            res.shelterDetails.powerBackup
                              ? "bg-[#0B766E]/10 text-[#0B766E] font-bold"
                              : "bg-[#DBE6E2] text-[#60747A]"
                          }`}
                        >
                          Generator: {res.shelterDetails.powerBackup ? "YES" : "NO"}
                        </span>
                        <span
                          className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                            res.shelterDetails.accessibleToilets
                              ? "bg-[#0B766E]/10 text-[#0B766E]"
                              : "bg-[#DBE6E2] text-[#60747A]"
                          }`}
                        >
                          Accessible Toilet: {res.shelterDetails.accessibleToilets ? "YES" : "NO"}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Vehicle features */}
                  {res.vehicleDetails && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] text-[#60747A]">
                        <span>Seating Headroom:</span>
                        <span className="font-bold text-[#142D36]">
                          {availableHeadroom} / {res.totalCapacity} Seats
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        <span
                          className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                            res.vehicleDetails.wheelchairAccessible
                              ? "bg-[#159B82]/10 text-[#159B82] font-bold"
                              : "bg-[#D9534F]/10 text-[#D9534F]"
                          }`}
                        >
                          Wheelchair Ramp: {res.vehicleDetails.wheelchairAccessible ? "EQUIPPED" : "NO"}
                        </span>
                        <span className="text-[10px] bg-[#DBE6E2] text-[#142D36] px-2 py-0.5 rounded capitalize">
                          {res.vehicleDetails.vehicleType.replace(/_/g, " ")}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Responder features */}
                  {res.responderDetails && (
                    <div className="space-y-1.5">
                      <div className="text-[11px] text-[#60747A]">
                        Org: <strong className="text-[#142D36]">{res.responderDetails.organization}</strong>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {JSON.parse(res.responderDetails.skillsJson || "[]").map((s: string) => (
                          <span
                            key={s}
                            className="text-[10px] bg-[#0B766E]/10 text-[#0B766E] font-medium px-2 py-0.5 rounded"
                          >
                            {s.replace(/_/g, " ")}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-2 border-t border-[#DBE6E2]/50 flex items-center justify-between text-[11px] text-[#60747A]">
                    <span>Source: {res.verificationSource || "Government Records"}</span>
                    <span className="font-bold text-[#0B766E]">Inspect</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail & Verification Edit Modal */}
      {selectedResource && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full space-y-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-[#DBE6E2] pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-[#0B766E]">
                  {selectedResource.id}
                </span>
                <h2 className="text-lg font-black text-[#142D36] mt-0.5">
                  {selectedResource.name}
                </h2>
              </div>
              <button
                onClick={() => setSelectedResource(null)}
                className="text-[#60747A] hover:text-[#142D36] p-1"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#142D36]">
              <div>
                <span className="text-[#60747A] block font-semibold">Technical Notes:</span>
                <p className="mt-0.5 leading-relaxed bg-[#F4F7F6] p-3 rounded-xl border border-[#DBE6E2]">
                  {selectedResource.notes}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-[#F4F7F6] border border-[#DBE6E2]">
                  <span className="text-[#60747A] block font-semibold">Contact Info:</span>
                  <div className="font-bold mt-0.5">{selectedResource.contactInfo || "N/A"}</div>
                </div>
                <div className="p-3 rounded-xl bg-[#F4F7F6] border border-[#DBE6E2]">
                  <span className="text-[#60747A] block font-semibold">Verification Source:</span>
                  <div className="font-bold mt-0.5">{selectedResource.verificationSource || "DDM / CDD"}</div>
                </div>
              </div>

              {/* Coordinator Verification Promotion Action */}
              <div className="p-4 rounded-xl bg-[#091E2C] text-white space-y-2">
                <span className="text-[11px] font-bold text-[#63DEC2] uppercase tracking-wider block">
                  Coordinator Verification Control
                </span>
                <p className="text-[11px] text-[#DBE6E2]">
                  Current Status: <strong className="text-white uppercase">{selectedResource.verificationStatus}</strong>
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    disabled={updating}
                    onClick={() => handleUpdateVerification(selectedResource.id, "verified")}
                    className="bg-[#159B82] hover:bg-[#0e7c67] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition"
                  >
                    Set Officially Verified
                  </button>
                  <button
                    disabled={updating}
                    onClick={() => handleUpdateVerification(selectedResource.id, "partner_verified")}
                    className="bg-[#0B766E] hover:bg-[#085a54] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition"
                  >
                    Set Partner Verified
                  </button>
                  <button
                    disabled={updating}
                    onClick={() => handleUpdateVerification(selectedResource.id, "unverified")}
                    className="bg-[#D9534F] hover:bg-[#c4413d] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition"
                  >
                    Quarantine (Unverified)
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-[#DBE6E2]">
              <button
                onClick={() => setSelectedResource(null)}
                className="bg-[#0B766E] text-white px-4 py-2 rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

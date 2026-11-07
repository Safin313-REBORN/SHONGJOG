"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation, formatNumber } from "@/lib/i18n";
import {
  Building2,
  AlertTriangle,
  Search,
  Check,
  ArrowLeft,
  X,
  ExternalLink,
  Map as MapIcon,
  LayoutGrid,
} from "lucide-react";
import GoogleOperationsMap, { MapResourceItem } from "@/components/GoogleOperationsMap";

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
  const { lang } = useTranslation();
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterVerification, setFilterVerification] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedResource, setSelectedResource] = useState<ResourceItem | null>(null);
  const [updating, setUpdating] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "map" | "table">("grid");

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
    let ignore = false;
    fetch("/api/resources")
      .then((res) => res.json())
      .then((json) => {
        if (!ignore && json.success) {
          setResources(json.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error("Fetch resources error:", err);
          setLoading(false);
        }
      });
    return () => {
      ignore = true;
    };
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

  // Prepare Map format
  const mapResources: MapResourceItem[] = filteredResources.map((r) => ({
    id: r.id,
    name: r.name,
    type: r.resourceType as "shelter" | "vehicle" | "responder",
    lat: r.latitude,
    lng: r.longitude,
    capacity: r.totalCapacity,
    isVerified: r.verificationStatus === "verified" || r.verificationStatus === "partner_verified",
    rampAvailable: r.shelterDetails?.rampAvailable || r.vehicleDetails?.wheelchairAccessible,
  }));

  const getThumbnailImage = (r: ResourceItem) => {
    if (r.resourceType === "shelter") {
      return "/images/cyclone_shelter_infrastructure.webp";
    }
    if (r.resourceType === "vehicle") {
      if (r.vehicleDetails?.vehicleType === "boat") {
        return "/images/riverine_transport_vessel.webp";
      }
      return "/images/accessible_boarding_ramp.webp";
    }
    return "/images/community_evacuation_consultation.webp";
  };

  return (
    <div className="min-h-screen bg-[#F4F7F6] py-6 px-4 sm:px-6 lg:px-8 space-y-6 font-sans max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="bg-[#071520] text-white p-5 sm:p-6 rounded-2xl border border-[#133446] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#63DEC2]" />
            <span className="text-[11px] font-mono font-bold text-[#63DEC2] uppercase tracking-wider">
              {lang === "bn" ? "সম্পদ ও আশ্রয় রেজিস্ট্রি" : "Asset & Accommodation Registry"}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white mt-1 tracking-tight">
            {lang === "bn"
              ? "Verified Shelters, Evacuation Vehicles & Response Squads · যাচাইকৃত আশ্রয়, পরিবহন ও উদ্ধার দল"
              : "Verified Shelters, Evacuation Vehicles & Response Squads"}
          </h1>
          <p className="text-xs text-[#DBE6E2]/80 mt-1">
            {lang === "bn"
              ? "দাকোপ, খুলনা লজিস্টিকস পুল — কঠোর শারীরিক প্রবেশগম্যতা ও শর্তাবলী অডিট লেজার"
              : "Dacope, Khulna Logistics Pool — Strict Hard Constraint Auditing & Physical Accessibility Ledger"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {/* View Mode Switcher */}
          <div className="bg-[#0D2232] p-1 rounded-xl border border-[#0B766E]/40 flex text-xs font-bold">
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                viewMode === "grid" ? "bg-[#0B766E] text-white shadow-sm" : "text-[#DBE6E2]/70 hover:text-white"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>{lang === "bn" ? "গ্রিড" : "Grid"}</span>
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                viewMode === "map" ? "bg-[#0B766E] text-white shadow-sm" : "text-[#DBE6E2]/70 hover:text-white"
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>{lang === "bn" ? "গুগল ম্যাপ" : "Google Map"}</span>
            </button>
          </div>

          <Link
            href="/operations"
            className="btn-interactive inline-flex items-center gap-1.5 bg-[#0B766E] hover:bg-[#159B82] text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-[#159B82]/40 shadow-sm transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{lang === "bn" ? "সমন্বয়ক অপারেশন্স" : "Coordinator Operations"}</span>
          </Link>
        </div>
      </div>

      {/* Safety Quarantine Callout */}
      <div className="bg-[#F59E0B]/10 border border-[#F59E0B]/40 p-4 rounded-xl text-xs text-[#142D36] flex items-start gap-3 shadow-sm">
        <AlertTriangle className="w-5 h-5 text-[#F59E0B] shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">
            {lang === "bn"
              ? "Verification Policy & Hard Constraint Integrity: (যাচাইকরণ নীতিমালা ও নিরাপত্তা শর্তাবলী):"
              : "Verification Policy & Hard Constraint Integrity:"}
          </strong>
          <p className="text-[#5A7077] mt-0.5 leading-relaxed">
            {lang === "bn"
              ? "অননুমোদিত বা অনির্ভরযোগ্য হিসেবে চিহ্নিত সম্পদসমূহ অনুমোদিত ফিল্ড ইঞ্জিনিয়ার দ্বারা যাচাই না হওয়া পর্যন্ত স্বয়ংক্রিয় ডিসপ্যাচ পুল থেকে কঠোরভাবে আলাদা রাখা হয়।"
              : "Resources flagged as Unverified or Community Reported are strictly isolated and quarantined from the automated safe dispatch pool until verified on-site by an authorized field engineer or partner auditor."}
          </p>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#DBE6E2] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#5A7077] absolute left-3 top-3" />
          <input
            type="text"
            placeholder={lang === "bn" ? "আইডি, নাম বা সুবিধা দিয়ে সম্পদ খুঁজুন..." : "Search assets by ID, name, or facility note..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#DBE6E2] text-xs focus:ring-2 focus:ring-[#0B766E] focus:outline-none"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="text-xs bg-[#F4F7F6] border border-[#DBE6E2] rounded-xl px-3 py-2 font-semibold text-[#142D36] focus:outline-none"
          >
            <option value="all">{lang === "bn" ? "সব সম্পদ ধরন" : "All Asset Types"}</option>
            <option value="shelter">{lang === "bn" ? "আশ্রয়কেন্দ্রসমূহ" : "Shelters Only"}</option>
            <option value="vehicle">{lang === "bn" ? "যানবাহনসমূহ" : "Vehicles Only"}</option>
            <option value="responder">{lang === "bn" ? "স্বেচ্ছাসেবক স্কোয়াড" : "Volunteer Squads"}</option>
          </select>

          <select
            value={filterVerification}
            onChange={(e) => setFilterVerification(e.target.value)}
            className="text-xs bg-[#F4F7F6] border border-[#DBE6E2] rounded-xl px-3 py-2 font-semibold text-[#142D36] focus:outline-none"
          >
            <option value="all">{lang === "bn" ? "সব যাচাইকরণ স্তর" : "All Verification Tiers"}</option>
            <option value="verified">{lang === "bn" ? "দাপ্তরিকভাবে যাচাইকৃত" : "Officially Verified"}</option>
            <option value="partner_verified">{lang === "bn" ? "অংশীদার যাচাইকৃত" : "Partner Verified"}</option>
            <option value="community_reported">{lang === "bn" ? "কমিউনিটি রিপোর্টকৃত" : "Community Reported"}</option>
            <option value="unverified">{lang === "bn" ? "অযাচাইকৃত" : "Unverified"}</option>
          </select>

          <div className="text-xs font-mono font-medium text-[#5A7077] sm:ml-2">
            {lang === "bn" ? "প্রদর্শিত হচ্ছে" : "Showing"}{" "}
            <span className="font-bold text-[#142D36]">{formatNumber(filteredResources.length, lang)}</span>{" "}
            {lang === "bn" ? "টি সম্পদ" : "assets"}
          </div>
        </div>
      </div>

      {/* Main Content Area based on ViewMode */}
      {viewMode === "map" ? (
        /* Google Map View */
        <div className="space-y-4">
          <div className="bg-[#071520] p-4 rounded-xl border border-[#133446] text-xs text-[#DBE6E2] flex items-center justify-between">
            <span className="font-mono text-[#63DEC2] font-bold">
              SPATIAL RESOURCE LEDGER · DACOPE COASTAL SECTOR
            </span>
            <span className="text-[11px] text-[#DBE6E2]/70">
              Interactive Google Map View of all verified evacuation shelters, vehicles, and staging areas.
            </span>
          </div>
          <GoogleOperationsMap
            incidents={[]}
            resources={mapResources}
            selectedId={selectedResource?.id || null}
            onSelectItem={(id) => {
              const found = resources.find((r) => r.id === id);
              if (found) setSelectedResource(found);
            }}
            className="h-[560px] w-full"
            showSidebarList={true}
          />
        </div>
      ) : (
        /* Resource Cards Grid with Authentic Photography */
        loading ? (
          <div className="p-12 text-center text-xs text-[#5A7077] bg-white rounded-2xl border border-[#DBE6E2] font-mono">
            Loading asset registry ledger...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((res) => {
              const availableHeadroom = res.totalCapacity - res.reservedCapacity - res.currentOccupancy;
              const occupancyPct = res.totalCapacity > 0 ? Math.round(((res.reservedCapacity + res.currentOccupancy) / res.totalCapacity) * 100) : 0;
              const thumb = getThumbnailImage(res);

              return (
                <div
                  key={res.id}
                  onClick={() => setSelectedResource(res)}
                  className="pro-card pro-card-hover rounded-2xl overflow-hidden border border-[#DBE6E2] cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    {/* Authentic Thumbnail Header */}
                    <div className="relative h-32 w-full bg-[#071520] overflow-hidden">
                      <Image
                        src={thumb}
                        alt={res.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute top-2.5 left-3">
                        <span className="font-mono text-[10px] font-bold text-white bg-black/60 backdrop-blur-md px-2 py-0.5 rounded border border-white/20">
                          {res.id}
                        </span>
                      </div>
                      <div className="absolute top-2.5 right-3">
                        <span
                          className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                            res.verificationStatus === "verified"
                              ? "bg-[#159B82] text-white"
                              : res.verificationStatus === "partner_verified"
                              ? "bg-[#0B766E] text-white"
                              : res.verificationStatus === "community_reported"
                              ? "bg-[#F59E0B] text-black"
                              : "bg-[#D9534F] text-white"
                          }`}
                        >
                          {res.verificationStatus.replace(/_/g, " ")}
                        </span>
                      </div>
                      <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] text-white">
                        <span className="font-mono text-[10px] text-[#63DEC2]">
                          GPS: {res.latitude.toFixed(4)}°N, {res.longitude.toFixed(4)}°E
                        </span>
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <h3 className="font-bold text-base text-[#142D36] leading-snug group-hover:text-[#0B766E] transition">
                        {res.name}
                      </h3>
                      <p className="text-xs text-[#5A7077] line-clamp-2 leading-relaxed">
                        {res.notes}
                      </p>
                    </div>
                  </div>

                  {/* Specific Capability Chips */}
                  <div className="p-4 pt-0 space-y-3 text-xs">
                    {/* Shelter features */}
                    {res.shelterDetails && (
                      <div className="space-y-2 bg-[#F4F7F6] p-3 rounded-xl border border-[#DBE6E2]">
                        <div className="flex items-center justify-between text-[11px] text-[#5A7077]">
                          <span>Capacity Headroom:</span>
                          <span className="font-bold text-[#142D36] font-mono">
                            {availableHeadroom} / {res.totalCapacity} Available
                          </span>
                        </div>
                        {/* Visual Capacity Bar */}
                        <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              occupancyPct > 80 ? "bg-[#D9534F]" : occupancyPct > 50 ? "bg-[#F59E0B]" : "bg-[#159B82]"
                            }`}
                            style={{ width: `${Math.min(100, Math.max(5, occupancyPct))}%` }}
                          />
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          <span
                            className={`text-[10px] font-medium px-2 py-0.5 rounded border ${
                              res.shelterDetails.rampAvailable
                                ? "bg-[#159B82]/10 border-[#159B82]/30 text-[#159B82] font-bold"
                                : "bg-[#D9534F]/10 border-[#D9534F]/30 text-[#D9534F]"
                            }`}
                          >
                            Ramp: {res.shelterDetails.rampAvailable ? "YES (1:12)" : "NO RAMP"}
                          </span>
                          <span
                            className={`text-[10px] font-medium px-2 py-0.5 rounded border ${
                              res.shelterDetails.powerBackup
                                ? "bg-[#0B766E]/10 border-[#0B766E]/30 text-[#0B766E] font-bold"
                                : "bg-[#DBE6E2] border-transparent text-[#5A7077]"
                            }`}
                          >
                            Generator: {res.shelterDetails.powerBackup ? "YES" : "NO"}
                          </span>
                          <span
                            className={`text-[10px] font-medium px-2 py-0.5 rounded border ${
                              res.shelterDetails.accessibleToilets
                                ? "bg-[#0B766E]/10 border-[#0B766E]/30 text-[#0B766E]"
                                : "bg-[#DBE6E2] border-transparent text-[#5A7077]"
                            }`}
                          >
                            Accessible Toilet: {res.shelterDetails.accessibleToilets ? "YES" : "NO"}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Vehicle features */}
                    {res.vehicleDetails && (
                      <div className="space-y-2 bg-[#F4F7F6] p-3 rounded-xl border border-[#DBE6E2]">
                        <div className="flex items-center justify-between text-[11px] text-[#5A7077]">
                          <span>Seating Headroom:</span>
                          <span className="font-bold text-[#142D36] font-mono">
                            {availableHeadroom} / {res.totalCapacity} Seats
                          </span>
                        </div>
                        {/* Visual Capacity Bar */}
                        <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              occupancyPct > 80 ? "bg-[#D9534F]" : occupancyPct > 50 ? "bg-[#F59E0B]" : "bg-[#159B82]"
                            }`}
                            style={{ width: `${Math.min(100, Math.max(10, occupancyPct))}%` }}
                          />
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          <span
                            className={`text-[10px] font-medium px-2 py-0.5 rounded border ${
                              res.vehicleDetails.wheelchairAccessible
                                ? "bg-[#159B82]/10 border-[#159B82]/30 text-[#159B82] font-bold"
                                : "bg-[#D9534F]/10 border-[#D9534F]/30 text-[#D9534F]"
                            }`}
                          >
                            Wheelchair Ramp: {res.vehicleDetails.wheelchairAccessible ? "EQUIPPED" : "NO"}
                          </span>
                          <span className="text-[10px] bg-[#DBE6E2] text-[#142D36] px-2 py-0.5 rounded capitalize font-medium">
                            {res.vehicleDetails.vehicleType.replace(/_/g, " ")}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Responder features */}
                    {res.responderDetails && (
                      <div className="space-y-2 bg-[#F4F7F6] p-3 rounded-xl border border-[#DBE6E2]">
                        <div className="text-[11px] text-[#5A7077]">
                          Org: <strong className="text-[#142D36]">{res.responderDetails.organization}</strong>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {JSON.parse(res.responderDetails.skillsJson || "[]").map((s: string) => (
                            <span
                              key={s}
                              className="text-[10px] bg-[#0B766E]/10 border border-[#0B766E]/30 text-[#0B766E] px-2 py-0.5 rounded font-medium"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Bottom Google Maps Link */}
                    <div className="pt-2 border-t border-[#DBE6E2] flex items-center justify-between text-[11px]">
                      <span className="text-[#5A7077]">Inspect Details →</span>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${res.latitude},${res.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-[#0B766E] hover:underline font-bold"
                      >
                        <span>Google Maps</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}

      {/* Slide-over Inspection / Verification Modal */}
      {selectedResource && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl overflow-y-auto p-6 space-y-5 animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between border-b border-[#DBE6E2] pb-4">
              <div>
                <span className="font-mono text-xs font-bold text-[#0B766E]">
                  ASSET INSPECTION · {selectedResource.id}
                </span>
                <h3 className="text-lg font-black text-[#142D36] mt-0.5">
                  {selectedResource.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedResource(null)}
                className="p-2 text-[#5A7077] hover:text-[#142D36] rounded-lg hover:bg-[#F4F7F6]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Representative Image in Modal */}
            <div className="relative h-44 w-full rounded-xl overflow-hidden bg-[#071520] border border-[#DBE6E2]">
              <Image
                src={getThumbnailImage(selectedResource)}
                alt={selectedResource.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 text-white text-xs font-mono">
                Lat: {selectedResource.latitude.toFixed(4)}°N, Lng: {selectedResource.longitude.toFixed(4)}°E
              </div>
            </div>

            {/* Verification Tiers & Actions */}
            <div className="bg-[#F4F7F6] p-4 rounded-xl border border-[#DBE6E2] space-y-3">
              <span className="text-[10px] font-mono font-bold uppercase text-[#5A7077]">
                Update Verification Audit Tier
              </span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: "verified", label: "Officially Verified", color: "bg-[#159B82]" },
                  { key: "partner_verified", label: "Partner Verified", color: "bg-[#0B766E]" },
                  { key: "community_reported", label: "Community Reported", color: "bg-[#F59E0B]" },
                  { key: "unverified", label: "Quarantine / Unverified", color: "bg-[#D9534F]" },
                ].map((tier) => (
                  <button
                    key={tier.key}
                    disabled={updating}
                    onClick={() => handleUpdateVerification(selectedResource.id, tier.key)}
                    className={`p-2.5 rounded-lg text-xs font-bold transition flex items-center justify-between border ${
                      selectedResource.verificationStatus === tier.key
                        ? `${tier.color} text-white border-transparent shadow-sm`
                        : "bg-white border-[#DBE6E2] text-[#142D36] hover:bg-gray-50"
                    }`}
                  >
                    <span>{tier.label}</span>
                    {selectedResource.verificationStatus === tier.key && (
                      <Check className="w-4 h-4 text-white" />
                    )}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-[#5A7077] pt-1">
                Auditor Note: Quarantined assets are automatically removed from matching logic.
              </p>
            </div>

            {/* Google Map Link in modal */}
            <div className="p-3 bg-[#071520] text-white rounded-xl flex items-center justify-between text-xs">
              <span className="font-mono text-[#63DEC2]">View Verified Location</span>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${selectedResource.latitude},${selectedResource.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-[#0B766E] hover:bg-[#159B82] px-3 py-1.5 rounded-lg text-white font-bold"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

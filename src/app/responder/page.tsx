"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslation, formatNumber } from "@/lib/i18n";
import {
  Truck,
  Users,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Navigation,
  Check,
  AlertTriangle,
  AlertCircle,
  ExternalLink,
  Compass,
} from "lucide-react";

interface ResponderOption {
  id: string;
  name: string;
  organization: string;
  skills: string[];
}

interface ActiveAssignment {
  id: string;
  status: string;
  requestId: string;
  assignedAt: string;
  acceptedAt?: string;
  arrivedAt?: string;
  completedAt?: string;
  request: {
    id: string;
    status: string;
    urgency: string;
    groupSize: number;
    approximateLocation: string;
    contactName: string;
    contactPhone: string;
    supportNeeds: { needType: string }[];
    timelineEvents: {
      id: string;
      eventType: string;
      actorRole: string;
      actorName: string;
      timestamp: string;
      detailsJson?: string;
    }[];
  };
  vehicle?: { name: string; vehicleDetails?: { vehicleType: string } };
  shelter?: { name: string };
}

export default function ResponderPage() {
  const { lang } = useTranslation();
  const [responders, setResponders] = useState<ResponderOption[]>([]);
  const [selectedResponderId, setSelectedResponderId] = useState<string>("RES-RSP-01");
  const [assignment, setAssignment] = useState<ActiveAssignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch responders
  useEffect(() => {
    let ignore = false;
    fetch("/api/resources?type=responder")
      .then((res) => res.json())
      .then((json) => {
        if (!ignore && json.success) {
          const list = json.data.map((r: { id: string; name: string; responderDetails?: { organization: string; skillsJson: string } }) => ({
            id: r.id,
            name: r.name,
            organization: r.responderDetails?.organization || "Volunteer Squad",
            skills: JSON.parse(r.responderDetails?.skillsJson || "[]"),
          }));
          setResponders(list);
          if (list.length > 0 && !selectedResponderId) {
            setSelectedResponderId(list[0].id);
          }
        }
      })
      .catch((err) => {
        if (!ignore) console.error("Load responders error:", err);
      });
    return () => {
      ignore = true;
    };
  }, [selectedResponderId]);

  // Load active assignment for selected responder
  const loadActiveAssignment = async (respId: string) => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const res = await fetch("/api/requests");
      const json = await res.json();
      if (json.success) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const match = json.data.find((req: any) => req.assignment && req.assignment.responderId === respId);
        if (match && match.assignment) {
          setAssignment({
            id: match.assignment.id,
            status: match.assignment.status,
            requestId: match.id,
            assignedAt: match.assignment.assignedAt,
            acceptedAt: match.assignment.acceptedAt,
            arrivedAt: match.assignment.arrivedAt,
            completedAt: match.assignment.completedAt,
            request: {
              id: match.id,
              status: match.status,
              urgency: match.urgency,
              groupSize: match.groupSize,
              approximateLocation: match.approximateLocation || "Dacope Bazar, Khulna",
              contactName: match.contactName || "Citizen",
              contactPhone: match.contactPhone || "+8801700000000",
              supportNeeds: match.supportNeeds || [],
              timelineEvents: match.timelineEvents || [],
            },
            vehicle: match.assignment.vehicle,
            shelter: match.assignment.shelter,
          });
        } else {
          setAssignment(null);
        }
      }
    } catch (err) {
      console.error("Load assignment error:", err);
      setErrorMsg("Failed to synchronize active field assignment.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedResponderId) return;
    let ignore = false;
    fetch("/api/requests")
      .then((res) => res.json())
      .then((json) => {
        if (!ignore && json.success) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const match = json.data.find((req: any) => req.assignment && req.assignment.responderId === selectedResponderId);
          if (match && match.assignment) {
            setAssignment({
              id: match.assignment.id,
              status: match.assignment.status,
              requestId: match.id,
              assignedAt: match.assignment.assignedAt,
              acceptedAt: match.assignment.acceptedAt,
              arrivedAt: match.assignment.arrivedAt,
              completedAt: match.assignment.completedAt,
              request: {
                id: match.id,
                status: match.status,
                urgency: match.urgency,
                groupSize: match.groupSize,
                approximateLocation: match.approximateLocation || "Dacope Bazar, Khulna",
                contactName: match.contactName || "Citizen",
                contactPhone: match.contactPhone || "+8801700000000",
                supportNeeds: match.supportNeeds || [],
                timelineEvents: match.timelineEvents || [],
              },
              vehicle: match.assignment.vehicle,
              shelter: match.assignment.shelter,
            });
          } else {
            setAssignment(null);
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error("Load assignment error:", err);
          setErrorMsg("Failed to synchronize active field assignment.");
          setLoading(false);
        }
      });
    return () => {
      ignore = true;
    };
  }, [selectedResponderId]);

  // Handle state machine transitions
  const handleAction = async (action: string, notes?: string) => {
    if (!assignment) return;
    setActionLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/responder/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignmentId: assignment.id,
          action,
          notes,
          responderId: selectedResponderId,
          responderName: activeResponder?.name || "Field Responder",
        }),
      });
      const json = await res.json();
      if (json.success) {
        if (action === "decline") {
          setShowDeclineModal(false);
          setDeclineReason("");
          setAssignment(null);
        } else {
          await loadActiveAssignment(selectedResponderId);
        }
      } else {
        setErrorMsg(json.error || `Failed to transition assignment status.`);
      }
    } catch (err) {
      console.error("Action error:", err);
      setErrorMsg("Network error communicating with dispatch gateway.");
    } finally {
      setActionLoading(false);
    }
  };

  const activeResponder = responders.find((r) => r.id === selectedResponderId);

  // Google Maps embed URL for the rendezvous location
  const locationQuery = encodeURIComponent(assignment?.request.approximateLocation || "Dacope Bazar, Khulna");
  const embedMapUrl = `https://maps.google.com/maps?q=${locationQuery}&t=m&z=15&ie=UTF8&iwloc=&output=embed`;
  const externalGoogleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${locationQuery}`;

  return (
    <div className="min-h-screen bg-[#F4F7F6] py-6 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Header Card */}
        <div className="bg-[#071520] text-white p-5 sm:p-6 rounded-2xl border border-[#133446] shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0B766E] to-[#159B82] flex items-center justify-center text-white shrink-0 border border-[#63DEC2]/30 shadow-md">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] text-[#63DEC2] uppercase font-mono tracking-wider font-bold">
                FIELD RESPONDER APP · Active Responder Unit
              </div>
              <h1 className="font-extrabold text-lg text-white tracking-tight">
                {activeResponder?.name || "Field Volunteer Squad"}
              </h1>
              <div className="text-xs text-[#DBE6E2]/80 font-medium">
                {activeResponder?.organization}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <select
              value={selectedResponderId}
              onChange={(e) => setSelectedResponderId(e.target.value)}
              className="bg-[#0D2232] text-white border border-[#0B766E] text-xs rounded-xl p-2.5 font-semibold focus:ring-2 focus:ring-[#63DEC2] focus:outline-none"
            >
              {responders.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-[#D9534F]/10 border border-[#D9534F] text-[#D9534F] text-xs font-bold flex items-center gap-2 shadow-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Loading state */}
        {loading ? (
          <div className="bg-white p-12 rounded-2xl border border-[#DBE6E2] text-center text-xs text-[#5A7077] shadow-sm font-mono">
            {lang === "bn" ? "ট্যাকটিক্যাল ডিসপ্যাচ অ্যাসাইনমেন্ট সিঙ্ক হচ্ছে..." : "Synchronizing tactical dispatch assignments..."}
          </div>
        ) : !assignment ? (
          /* Empty state */
          <div className="bg-white p-10 rounded-2xl border border-[#DBE6E2] text-center space-y-4 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-[#159B82]/10 text-[#159B82] border border-[#159B82]/30 mx-auto flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h2 className="text-lg font-bold text-[#142D36]">
              {lang === "bn" ? "বর্তমানে কোনো সক্রিয় অ্যাসাইনমেন্ট নেই" : "No Active Assignment Assigned"}
            </h2>
            <p className="text-xs text-[#5A7077] max-w-md mx-auto leading-relaxed">
              {lang === "bn"
                ? "এই রেসপন্স ইউনিট বর্তমানে স্ট্যান্ডবাই মোডে আছে। সমন্বয়ক কোনো ইভাকুয়েশন কেস বরাদ্দ করলেই তা অবিলম্বে এখানে দৃশ্যমান হবে।"
                : "This response unit is currently in standby status. When the emergency coordinator assigns an evacuation case, it will appear here immediately with route constraints."}
            </p>
            <div className="pt-2">
              <Link
                href="/operations"
                className="btn-interactive inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#0B766E] hover:bg-[#159B82] px-4 py-2.5 rounded-xl shadow-md transition"
              >
                <span>{lang === "bn" ? "সমন্বয়ক অপারেশন কেন্দ্রে দেখুন" : "View Coordinator Operations Center"}</span>
                <Navigation className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          /* Active Assignment Briefing */
          <div className="space-y-6">
            {/* Top Briefing Card */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#DBE6E2] shadow-sm space-y-6">
              <div className="flex items-start justify-between gap-3 border-b border-[#DBE6E2] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#0B766E]">
                      {assignment.requestId}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono ${
                        assignment.request.urgency === "critical"
                          ? "bg-[#D9534F] text-white"
                          : "bg-[#F59E0B] text-black"
                      }`}
                    >
                      {assignment.request.urgency}
                    </span>
                  </div>
                  <h2 className="text-xl font-black text-[#142D36] mt-1 tracking-tight">
                    {lang === "bn" ? "ইভাকুয়েশন মিশন ব্রিফিং" : "Evacuation Mission Briefing"}
                  </h2>
                </div>

                <div className="text-right">
                  <span className="text-xs bg-[#071520] text-[#63DEC2] font-mono px-3 py-1.5 rounded-xl uppercase font-bold border border-[#0B766E]/50">
                    {assignment.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Data-Minimized Instructions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <div className="p-4 rounded-xl bg-[#F4F7F6] border border-[#DBE6E2] space-y-1">
                  <span className="text-[#5A7077] block font-mono text-[10px] uppercase font-bold">
                    {lang === "bn" ? "সাক্ষাতের ল্যান্ডমার্ক" : "Rendezvous Landmark"}
                  </span>
                  <div className="flex items-center justify-between mt-1">
                    <div className="font-bold text-[#142D36] flex items-center gap-1.5 text-sm">
                      <MapPin className="w-4 h-4 text-[#0B766E] shrink-0" />
                      <span>{assignment.request.approximateLocation}</span>
                    </div>
                    <a
                      href={externalGoogleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-[#0B766E] hover:text-[#159B82] bg-white px-2.5 py-1 rounded-lg border border-[#DBE6E2] shadow-sm"
                      title={lang === "bn" ? "গুগল ম্যাপে ন্যাভিগেশন খুলুন" : "Open in Google Maps Navigation"}
                    >
                      <span>{lang === "bn" ? "ন্যাভিগেট" : "Navigate"}</span>
                      <Navigation className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#F4F7F6] border border-[#DBE6E2] space-y-1">
                  <span className="text-[#5A7077] block font-mono text-[10px] uppercase font-bold">
                    {lang === "bn" ? "স্থানান্তরপ্রার্থীর সংখ্যা" : "Evacuees Headcount"}
                  </span>
                  <div className="font-bold text-[#142D36] flex items-center gap-1.5 mt-1 text-sm font-mono">
                    <Users className="w-4 h-4 text-[#0B766E] shrink-0" />
                    <span>{formatNumber(assignment.request.groupSize, lang)} {lang === "bn" ? "জন" : "Person(s)"}</span>
                  </div>
                </div>

                {assignment.vehicle && (
                  <div className="p-4 rounded-xl bg-[#F4F7F6] border border-[#DBE6E2] space-y-1">
                    <span className="text-[#5A7077] block font-mono text-[10px] uppercase font-bold">
                      {lang === "bn" ? "বরাদ্দকৃত পরিবহন" : "Allocated Transport"}
                    </span>
                    <div className="font-bold text-[#142D36] flex items-center gap-1.5 mt-1 text-sm">
                      <Truck className="w-4 h-4 text-[#0B766E] shrink-0" />
                      <span>{assignment.vehicle.name}</span>
                    </div>
                  </div>
                )}

                {assignment.shelter && (
                  <div className="p-4 rounded-xl bg-[#F4F7F6] border border-[#DBE6E2] space-y-1">
                    <span className="text-[#5A7077] block font-mono text-[10px] uppercase font-bold">
                      {lang === "bn" ? "নির্ধারিত নিরাপদ আশ্রয়" : "Target Safe Shelter"}
                    </span>
                    <div className="font-bold text-[#142D36] flex items-center gap-1.5 mt-1 text-sm">
                      <ShieldCheck className="w-4 h-4 text-[#159B82] shrink-0" />
                      <span>{assignment.shelter.name}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* ORIGINAL GOOGLE MAP EMBED IN MISSION BRIEFING */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-[#142D36]">
                  <span className="font-bold flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-[#0B766E]" />
                    {lang === "bn" ? "আসল গুগল ম্যাপ: পৌঁছানোর রুট" : "Original Google Map: Rendezvous Route"}
                  </span>
                  <a
                    href={externalGoogleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0B766E] hover:underline flex items-center gap-1 font-bold"
                  >
                    <span>{lang === "bn" ? "ফুলস্ক্রিন ম্যাপ" : "Full Screen Navigation"}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="relative h-60 w-full rounded-2xl overflow-hidden border border-[#DBE6E2] shadow-inner bg-[#071520]">
                  <iframe
                    src={embedMapUrl}
                    title="Rendezvous Google Map"
                    className="w-full h-full border-0"
                    loading="lazy"
                    allowFullScreen
                  />
                  <div className="absolute bottom-2.5 left-2.5 bg-black/75 backdrop-blur-md px-3 py-1 rounded-lg text-white text-[10px] font-mono pointer-events-none">
                    Target: {assignment.request.approximateLocation}
                  </div>
                </div>
              </div>

              {/* Required Functional Accommodations */}
              <div className="space-y-2 pt-1">
                <span className="text-xs font-bold text-[#142D36] block">
                  {lang === "bn" ? "বাধ্যতামূলক কার্যকরী সুবিধাসমূহ:" : "Mandatory Functional Accommodations:"}
                </span>
                <div className="flex flex-wrap gap-2">
                  {assignment.request.supportNeeds.map((n, i) => (
                    <span
                      key={i}
                      className="text-xs bg-[#0B766E]/10 text-[#0B766E] font-bold px-3 py-1 rounded-lg border border-[#0B766E]/30"
                    >
                      {n.needType.replace(/_/g, " ")}
                    </span>
                  ))}
                </div>
              </div>

              {/* Privacy Notice */}
              <div className="p-3.5 rounded-xl bg-[#F4F7F6] border border-[#DBE6E2] text-[11px] text-[#5A7077] leading-relaxed">
                <strong className="text-[#142D36]">{lang === "bn" ? "গোপনীয়তা প্রোটোকল:" : "Privacy Protocol:"}</strong>{" "}
                {lang === "bn"
                  ? "মানবিক ডেটা মিনিমাইজেশন মানদণ্ড অনুযায়ী শুধুমাত্র অপারেশনাল ল্যান্ডমার্ক এবং শারীরিক সহায়তার শর্তাবলী দৃশ্যমান।"
                  : "In compliance with humanitarian data minimization standards, only operational rendezvous landmarks and physical accommodation requirements are visible to field responders."}
              </div>

              {/* State Machine Action Controls */}
              <div className="pt-2 border-t border-[#DBE6E2] space-y-2.5">
                <span className="text-xs font-bold text-[#142D36] block">
                  {lang === "bn" ? "ট্যাকটিক্যাল রেসপন্স পদক্ষেপসমূহ:" : "Tactical Response Actions:"}
                </span>

                {/* 1. Accept / Decline (When status is "assigned") */}
                {assignment.status === "assigned" && (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => handleAction("accept")}
                      className="btn-interactive bg-[#0B766E] hover:bg-[#159B82] text-white py-3.5 rounded-xl font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>{lang === "bn" ? "মিশন গ্রহণ করুন" : "Accept Assignment"}</span>
                    </button>
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => setShowDeclineModal(true)}
                      className="btn-interactive bg-[#D9534F]/10 hover:bg-[#D9534F]/20 text-[#D9534F] py-3.5 rounded-xl font-bold text-xs border border-[#D9534F]/30 transition flex items-center justify-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>{lang === "bn" ? "কারণসহ প্রত্যাখ্যান" : "Decline with Reason"}</span>
                    </button>
                  </div>
                )}

                {/* 2. En Route (When status is "accepted") */}
                {assignment.status === "accepted" && (
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => handleAction("en_route")}
                    className="btn-interactive w-full bg-[#0B766E] hover:bg-[#159B82] text-white py-3.5 rounded-xl font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>{lang === "bn" ? "যাত্রারম্ভ (পথে রওনা নিশ্চিত করুন)" : "Start Response (Mark En Route)"}</span>
                  </button>
                )}

                {/* 3. Arrived (When status is "in_progress") */}
                {assignment.status === "in_progress" && (
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => handleAction("arrived")}
                    className="btn-interactive w-full bg-[#F59E0B] hover:bg-[#D98206] text-black py-3.5 rounded-xl font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
                  >
                    <MapPin className="w-4 h-4" />
                    <span>{lang === "bn" ? "ঘটনাস্থলে উপস্থিতি চিহ্নিত করুন" : "Mark Arrived at Citizen Location"}</span>
                  </button>
                )}

                {/* 4. Complete / Unable (When status is "arrived") */}
                {assignment.status === "arrived" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => handleAction("complete")}
                      className="btn-interactive bg-[#159B82] hover:bg-[#0e7c67] text-white py-3.5 rounded-xl font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{lang === "bn" ? "সহায়তা প্রদান সম্পন্ন নিশ্চিত করুন" : "Confirm Assistance Delivered"}</span>
                    </button>
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => handleAction("unable_to_assist", "Road flooded / inaccessible")}
                      className="btn-interactive bg-[#D9534F]/10 hover:bg-[#D9534F]/20 text-[#D9534F] py-3.5 rounded-xl font-bold text-xs border border-[#D9534F]/30 transition flex items-center justify-center gap-2"
                    >
                      <AlertTriangle className="w-4 h-4" />
                      <span>{lang === "bn" ? "সহায়তা প্রদানে অসমর্থতা রিপোর্ট" : "Report Unable to Assist"}</span>
                    </button>
                  </div>
                )}

                {/* Completed state */}
                {assignment.status === "completed" && (
                  <div className="p-4 rounded-xl bg-[#159B82]/10 border border-[#159B82] text-[#159B82] font-bold text-xs text-center flex items-center justify-center gap-2 shadow-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {lang === "bn"
                        ? "আশ্রয়কেন্দ্রে নিরাপদ স্থানান্তর সম্পন্ন হয়েছে। মিশন সমাপ্ত।"
                        : "Assistance confirmed delivered safely to shelter. Mission completed."}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Event Timeline Audit Trail */}
            <div className="bg-white p-6 rounded-2xl border border-[#DBE6E2] shadow-sm space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-[#142D36]">
                <span className="text-sm">
                  {lang === "bn" ? "কেস ইভেন্ট টাইমলাইন (অপরিবর্তনীয় অডিট লগ)" : "Case Event Timeline (Immutable Audit Log)"}
                </span>
                <Clock className="w-4 h-4 text-[#5A7077]" />
              </div>

              <div className="space-y-3.5 pt-1">
                {assignment.request.timelineEvents.map((ev) => (
                  <div key={ev.id} className="flex items-start gap-3 text-xs">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#0B766E] shrink-0 mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#142D36] capitalize">
                          {ev.eventType.replace(/_/g, " ")}
                        </span>
                        <span className="text-[10px] text-[#5A7077] font-mono">
                          {new Date(ev.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#5A7077] mt-0.5">
                        Actor: {ev.actorName} ({ev.actorRole})
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Decline Modal */}
        {showDeclineModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-[#DBE6E2]">
              <h3 className="font-bold text-sm text-[#142D36]">
                Reason for Declining Assignment
              </h3>
              <p className="text-xs text-[#5A7077] leading-relaxed">
                Declining immediately frees the reserved vehicle in the matching pool and notifies the emergency coordinator to re-dispatch another unit.
              </p>
              <textarea
                rows={3}
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                placeholder="e.g. Engine breakdown, road washed out, or vehicle occupied with previous emergency..."
                className="w-full p-3 rounded-xl border border-[#DBE6E2] text-xs focus:ring-2 focus:ring-[#D9534F] focus:outline-none"
              />
              <div className="flex justify-end gap-2 pt-2 border-t border-[#DBE6E2]">
                <button
                  type="button"
                  onClick={() => setShowDeclineModal(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-[#5A7077] hover:text-[#142D36]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={actionLoading || !declineReason.trim()}
                  onClick={() => handleAction("decline", declineReason)}
                  className="bg-[#D9534F] hover:bg-[#B33936] text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm"
                >
                  Confirm Decline
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

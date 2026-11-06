"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
  RotateCcw,
  Phone,
  ArrowLeft,
  Calendar,
  AlertCircle,
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
    async function loadResponders() {
      try {
        const res = await fetch("/api/resources?type=responder");
        const json = await res.json();
        if (json.success) {
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
      } catch (err) {
        console.error("Load responders error:", err);
      }
    }
    loadResponders();
  }, [selectedResponderId]);

  // Load active assignment for selected responder
  const loadActiveAssignment = async (respId: string) => {
    try {
      setLoading(true);
      setErrorMsg(null);
      // Fetch all requests and find one assigned to this responder
      const res = await fetch("/api/requests");
      const json = await res.json();
      if (json.success) {
        const matchingReq = json.data.find(
          (r: { assignment?: { responderId: string; status: string } }) =>
            r.assignment &&
            r.assignment.responderId === respId &&
            r.assignment.status !== "declined"
        );

        if (matchingReq) {
          const fullRes = await fetch(`/api/requests/${matchingReq.id}`);
          const fullJson = await fullRes.json();
          if (fullJson.success && fullJson.data.assignment) {
            setAssignment({
              id: fullJson.data.assignment.id,
              status: fullJson.data.assignment.status,
              requestId: fullJson.data.id,
              assignedAt: fullJson.data.assignment.assignedAt,
              acceptedAt: fullJson.data.assignment.acceptedAt,
              arrivedAt: fullJson.data.assignment.arrivedAt,
              completedAt: fullJson.data.assignment.completedAt,
              request: fullJson.data,
              vehicle: fullJson.data.assignment.vehicle,
              shelter: fullJson.data.assignment.shelter,
            });
          } else {
            setAssignment(null);
          }
        } else {
          setAssignment(null);
        }
      }
    } catch (err) {
      console.error("Load assignment error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedResponderId) {
      loadActiveAssignment(selectedResponderId);
    }
  }, [selectedResponderId]);

  // State Transition Action
  const handleAction = async (action: string, reason?: string) => {
    if (!assignment) return;
    setActionLoading(true);
    setErrorMsg(null);
    try {
      const activeResp = responders.find((r) => r.id === selectedResponderId);
      const res = await fetch(`/api/assignments/${assignment.id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          reason,
          responderName: activeResp?.name || "Field Responder",
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Action failed.");
      }

      setShowDeclineModal(false);
      await loadActiveAssignment(selectedResponderId);
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setActionLoading(false);
    }
  };

  const activeResponder = responders.find((r) => r.id === selectedResponderId);

  return (
    <div className="min-h-screen bg-[#F4F7F6] py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-5">
        {/* Header Breadcrumbs */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B766E] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Overview</span>
          </Link>
          <span className="text-xs font-mono font-semibold text-[#D9534F] bg-[#D9534F]/10 px-2 py-0.5 rounded">
            FIELD RESPONDER APP (MOBILE-FIRST)
          </span>
        </div>

        {/* Responder Identity Switcher Card */}
        <div className="bg-[#091E2C] text-white p-4 rounded-2xl border border-[#103B48] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0B766E] flex items-center justify-center text-[#63DEC2] shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] text-[#63DEC2] uppercase font-mono tracking-wider">
                Active Responder Unit
              </div>
              <h1 className="font-bold text-sm sm:text-base text-white">
                {activeResponder?.name || "Field Volunteer Squad"}
              </h1>
              <div className="text-[11px] text-[#DBE6E2]/70">
                {activeResponder?.organization}
              </div>
            </div>
          </div>

          <div className="shrink-0">
            <select
              value={selectedResponderId}
              onChange={(e) => setSelectedResponderId(e.target.value)}
              className="bg-[#103B48] text-white border border-[#0B766E] text-xs rounded-xl p-2 font-medium focus:ring-1 focus:ring-[#63DEC2] focus:outline-none"
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
          <div className="p-3.5 rounded-xl bg-[#D9534F]/10 border border-[#D9534F] text-[#D9534F] text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Loading state */}
        {loading ? (
          <div className="bg-white p-8 rounded-2xl border border-[#DBE6E2] text-center text-xs text-[#60747A] shadow-sm">
            Fetching active field assignment...
          </div>
        ) : !assignment ? (
          /* Empty state */
          <div className="bg-white p-8 rounded-2xl border border-[#DBE6E2] text-center space-y-3 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-[#159B82]/10 text-[#159B82] mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-[#142D36]">No Active Assignment Assigned</h2>
            <p className="text-xs text-[#60747A] max-w-sm mx-auto">
              This response team is currently available on standby. When the emergency coordinator assigns a verified evacuation request, it will appear here immediately.
            </p>
            <div className="pt-2">
              <Link
                href="/operations"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B766E] hover:underline"
              >
                <span>View Coordinator Operations Center</span>
                <Navigation className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          /* Active Assignment Briefing */
          <div className="space-y-4">
            {/* Top Briefing Card */}
            <div className="bg-white p-6 rounded-2xl border border-[#DBE6E2] shadow-sm space-y-5">
              <div className="flex items-start justify-between gap-3 border-b border-[#DBE6E2] pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#0B766E]">
                      {assignment.requestId}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        assignment.request.urgency === "critical"
                          ? "bg-[#D9534F] text-white"
                          : "bg-[#ECAF42] text-[#091E2C]"
                      }`}
                    >
                      {assignment.request.urgency}
                    </span>
                  </div>
                  <h2 className="text-lg font-black text-[#142D36] mt-1">
                    Evacuation Mission Briefing
                  </h2>
                </div>

                <div className="text-right">
                  <span className="text-xs bg-[#103B48] text-[#63DEC2] font-mono px-2 py-0.5 rounded uppercase font-bold">
                    {assignment.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Data-Minimized Instructions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#F4F7F6] border border-[#DBE6E2]">
                  <span className="text-[#60747A] block font-semibold">Location / Landmark:</span>
                  <div className="font-bold text-[#142D36] flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-[#0B766E] shrink-0" />
                    <span>{assignment.request.approximateLocation}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#F4F7F6] border border-[#DBE6E2]">
                  <span className="text-[#60747A] block font-semibold">Evacuation Headcount:</span>
                  <div className="font-bold text-[#142D36] flex items-center gap-1 mt-0.5">
                    <Users className="w-3.5 h-3.5 text-[#0B766E] shrink-0" />
                    <span>{assignment.request.groupSize} Person(s)</span>
                  </div>
                </div>

                {assignment.vehicle && (
                  <div className="p-3 rounded-xl bg-[#F4F7F6] border border-[#DBE6E2]">
                    <span className="text-[#60747A] block font-semibold">Allocated Transport:</span>
                    <div className="font-bold text-[#142D36] flex items-center gap-1 mt-0.5">
                      <Truck className="w-3.5 h-3.5 text-[#0B766E] shrink-0" />
                      <span>{assignment.vehicle.name}</span>
                    </div>
                  </div>
                )}

                {assignment.shelter && (
                  <div className="p-3 rounded-xl bg-[#F4F7F6] border border-[#DBE6E2]">
                    <span className="text-[#60747A] block font-semibold">Target Safe Shelter:</span>
                    <div className="font-bold text-[#142D36] flex items-center gap-1 mt-0.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#159B82] shrink-0" />
                      <span>{assignment.shelter.name}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Required Functional Accommodations */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-[#142D36]">
                  Critical Field Accommodations:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {assignment.request.supportNeeds.map((n, i) => (
                    <span
                      key={i}
                      className="text-xs bg-[#0B766E]/10 text-[#0B766E] font-bold px-2.5 py-1 rounded-lg border border-[#0B766E]/20"
                    >
                      {n.needType.replace(/_/g, " ")}
                    </span>
                  ))}
                </div>
              </div>

              {/* Privacy Notice */}
              <div className="p-3 rounded-xl bg-white border border-[#DBE6E2] text-[11px] text-[#60747A] leading-relaxed">
                <strong>Data Minimization Notice:</strong> Only operational navigation landmarks and physical handling instructions are displayed to preserve citizen privacy.
              </div>

              {/* State Machine Action Controls */}
              <div className="pt-2 border-t border-[#DBE6E2] space-y-2">
                <span className="text-xs font-bold text-[#142D36] block">
                  Field Response Actions:
                </span>

                {/* 1. Accept / Decline (When status is "assigned") */}
                {assignment.status === "assigned" && (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => handleAction("accept")}
                      className="bg-[#0B766E] hover:bg-[#159B82] text-white py-3 rounded-xl font-bold text-xs shadow transition flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>Accept Assignment</span>
                    </button>
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => setShowDeclineModal(true)}
                      className="bg-[#D9534F]/10 hover:bg-[#D9534F]/20 text-[#D9534F] py-3 rounded-xl font-bold text-xs border border-[#D9534F]/30 transition flex items-center justify-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Decline with Reason</span>
                    </button>
                  </div>
                )}

                {/* 2. En Route (When status is "accepted") */}
                {assignment.status === "accepted" && (
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => handleAction("en_route")}
                    className="w-full bg-[#0B766E] hover:bg-[#159B82] text-white py-3.5 rounded-xl font-bold text-xs shadow transition flex items-center justify-center gap-2"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>Start Response (Mark En Route)</span>
                  </button>
                )}

                {/* 3. Arrived (When status is "in_progress") */}
                {assignment.status === "in_progress" && (
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => handleAction("arrived")}
                    className="w-full bg-[#ECAF42] hover:bg-[#d89f36] text-[#091E2C] py-3.5 rounded-xl font-bold text-xs shadow transition flex items-center justify-center gap-2"
                  >
                    <MapPin className="w-4 h-4" />
                    <span>Mark Arrived at Citizen Location</span>
                  </button>
                )}

                {/* 4. Complete / Unable (When status is "arrived") */}
                {assignment.status === "arrived" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => handleAction("complete")}
                      className="bg-[#159B82] hover:bg-[#0e7c67] text-white py-3.5 rounded-xl font-bold text-xs shadow transition flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm Assistance Delivered</span>
                    </button>
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => handleAction("unable_to_assist", "Road flooded / inaccessible")}
                      className="bg-[#D9534F]/10 hover:bg-[#D9534F]/20 text-[#D9534F] py-3.5 rounded-xl font-bold text-xs border border-[#D9534F]/30 transition flex items-center justify-center gap-2"
                    >
                      <AlertTriangle className="w-4 h-4" />
                      <span>Report Unable to Assist</span>
                    </button>
                  </div>
                )}

                {/* Completed state */}
                {assignment.status === "completed" && (
                  <div className="p-3.5 rounded-xl bg-[#159B82]/10 border border-[#159B82] text-[#159B82] font-bold text-xs text-center flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Assistance confirmed delivered safely to shelter.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Event Timeline Audit Trail */}
            <div className="bg-white p-5 rounded-2xl border border-[#DBE6E2] shadow-sm space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-[#142D36]">
                <span>Case Event Timeline (Audit Log)</span>
                <Clock className="w-4 h-4 text-[#60747A]" />
              </div>

              <div className="space-y-3">
                {assignment.request.timelineEvents.map((ev) => (
                  <div key={ev.id} className="flex items-start gap-3 text-xs">
                    <div className="w-2 h-2 rounded-full bg-[#0B766E] shrink-0 mt-1.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#142D36] capitalize">
                          {ev.eventType.replace(/_/g, " ")}
                        </span>
                        <span className="text-[10px] text-[#60747A] font-mono">
                          {new Date(ev.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#60747A]">
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
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
              <h3 className="font-bold text-sm text-[#142D36]">
                Reason for Declining Assignment
              </h3>
              <p className="text-xs text-[#60747A]">
                Declining immediately frees the reserved vehicle and alerts the coordinator to re-match.
              </p>
              <textarea
                rows={3}
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                placeholder="e.g. Engine breakdown, road washed out, or vehicle occupied with previous emergency..."
                className="w-full p-2.5 rounded-xl border border-[#DBE6E2] text-xs focus:ring-1 focus:ring-[#D9534F] focus:outline-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowDeclineModal(false)}
                  className="px-3 py-2 text-xs font-semibold text-[#60747A]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={actionLoading || !declineReason.trim()}
                  onClick={() => handleAction("decline", declineReason)}
                  className="bg-[#D9534F] hover:bg-[#c4413d] text-white px-4 py-2 rounded-xl text-xs font-bold transition"
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

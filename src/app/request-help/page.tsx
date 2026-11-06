"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Mic,
  MicOff,
  CheckCircle2,
  AlertCircle,
  Clock,
  Shield,
  Users,
  MapPin,
  Phone,
  FileCheck,
  Send,
  WifiOff,
  Check,
  ExternalLink,
} from "lucide-react";
import { NeedType, UrgencyLevel } from "@/lib/types";

export default function RequestHelpPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form state
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [groupSize, setGroupSize] = useState<number>(1);
  const [urgency, setUrgency] = useState<UrgencyLevel>("urgent");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [selectedNeeds, setSelectedNeeds] = useState<NeedType[]>([]);
  const [consentGiven, setConsentGiven] = useState(true);

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  // Network & submission state
  const [isOnline, setIsOnline] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [offlineDraftSaved, setOfflineDraftSaved] = useState(false);
  const [submittedCase, setSubmittedCase] = useState<{
    id: string;
    status: string;
    aiExtraction?: Record<string, unknown>;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Track online status
  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => {
      setIsOnline(true);
      // Attempt auto sync if draft saved
      const saved = localStorage.getItem("shongjog_offline_draft");
      if (saved) {
        syncOfflineDraft(JSON.parse(saved));
      }
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Check speech recognition support
    if (typeof window !== "undefined") {
      const hasSpeech = "webkitSpeechRecognition" in window || "SpeechRecognition" in window;
      setSpeechSupported(hasSpeech);
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Web Speech API Voice Dictation
  const toggleSpeechRecognition = () => {
    if (!speechSupported) {
      alert("Voice speech-to-text is not supported in this browser version. Please type in text directly.");
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "bn-BD"; // Primary Bengali speech recognition with fallback to EN

      recognition.onstart = () => setIsRecording(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setDescription((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsRecording(false);
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);

      recognition.start();
    } catch (e) {
      console.warn("Speech recognition error:", e);
      setIsRecording(false);
    }
  };

  const toggleNeed = (need: NeedType) => {
    setSelectedNeeds((prev) =>
      prev.includes(need) ? prev.filter((n) => n !== need) : [...prev, need]
    );
  };

  const handleNextToStep2 = () => {
    if (!description.trim()) {
      setErrorMsg("Please describe your situation in text or using voice input.");
      return;
    }
    setErrorMsg(null);
    setStep(2);
  };

  const handleNextToStep3 = () => {
    setErrorMsg(null);
    setStep(3);
  };

  const syncOfflineDraft = async (draftData: Record<string, unknown>) => {
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draftData),
      });
      if (res.ok) {
        const json = await res.json();
        localStorage.removeItem("shongjog_offline_draft");
        setOfflineDraftSaved(false);
        setSubmittedCase({ id: json.case_reference, status: "pending_review" });
        setStep(4);
      }
    } catch {
      console.warn("Auto sync failed; keeping draft locally.");
    }
  };

  const handleSubmit = async () => {
    if (!consentGiven) {
      setErrorMsg("You must grant consent to share functional requirements with emergency coordinators.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const payload = {
      rawDescription: description,
      approximateLocation: location,
      groupSize,
      urgency,
      statedNeeds: selectedNeeds,
      contactName,
      contactPhone,
      consentGiven,
    };

    // If device is offline, cache in localStorage/IndexedDB
    if (!navigator.onLine) {
      localStorage.setItem("shongjog_offline_draft", JSON.stringify(payload));
      setOfflineDraftSaved(true);
      setIsSubmitting(false);
      setStep(4);
      return;
    }

    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to submit request.");
      }

      setSubmittedCase({
        id: json.case_reference,
        status: json.data.status,
        aiExtraction: json.ai_analysis,
      });
      setStep(4);
    } catch (err) {
      console.error("Submission failed:", err);
      // Cache as offline fallback draft
      localStorage.setItem("shongjog_offline_draft", JSON.stringify(payload));
      setOfflineDraftSaved(true);
      setStep(4);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7F6] py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Offline indicator banner */}
        {!isOnline && (
          <div className="bg-[#ECAF42] text-[#091E2C] px-4 py-3 rounded-xl border border-[#C99126] flex items-center gap-3 font-semibold text-xs shadow-sm">
            <WifiOff className="w-5 h-5 shrink-0" />
            <div>
              <span className="font-bold">Offline Storage Active:</span> You are currently offline. You can still complete and save your request. It will be stored securely on this device and dispatched automatically once network connectivity is restored.
            </div>
          </div>
        )}

        {/* Header Breadcrumbs & Classification */}
        <div className="flex items-center justify-between pb-1">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B766E] hover:text-[#085852] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Portal Overview</span>
          </Link>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#091E2C] text-[#63DEC2] text-[11px] font-mono font-medium border border-[#103B48]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#159B82]" />
            CIVIL ACCESS INTAKE · SECURE TRANSMISSION
          </div>
        </div>

        {/* Step Progress Tracker */}
        {step < 4 && (
          <div className="bg-white p-4 rounded-xl border border-[#DBE6E2] shadow-sm">
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
              <div
                className={`py-2 px-3 rounded-lg border transition ${
                  step === 1
                    ? "bg-[#0B766E] text-white border-[#0B766E]"
                    : step > 1
                    ? "bg-[#0B766E]/10 text-[#0B766E] border-[#0B766E]/20"
                    : "text-[#60747A] bg-[#F4F7F6] border-transparent"
                }`}
              >
                1. Describe Situation
              </div>
              <div
                className={`py-2 px-3 rounded-lg border transition ${
                  step === 2
                    ? "bg-[#0B766E] text-white border-[#0B766E]"
                    : step > 2
                    ? "bg-[#0B766E]/10 text-[#0B766E] border-[#0B766E]/20"
                    : "text-[#60747A] bg-[#F4F7F6] border-transparent"
                }`}
              >
                2. Functional Needs
              </div>
              <div
                className={`py-2 px-3 rounded-lg border transition ${
                  step === 3
                    ? "bg-[#0B766E] text-white border-[#0B766E]"
                    : "text-[#60747A] bg-[#F4F7F6] border-transparent"
                }`}
              >
                3. Review & Consent
              </div>
            </div>
          </div>
        )}

        {/* STEP 1: DESCRIBE THE SITUATION */}
        {step === 1 && (
          <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#DBE6E2] shadow-sm space-y-6">
            <div className="border-b border-[#DBE6E2] pb-4">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#0B766E]">
                Stage 1 of 3 · Incident Description
              </span>
              <h1 className="text-2xl font-extrabold text-[#142D36] mt-1 tracking-tight">
                What is happening right now?
              </h1>
              <p className="text-xs text-[#60747A] mt-1.5 leading-relaxed">
                Describe your current situation in everyday language. You can type in Bengali (বাংলা), Banglish, or English. Formal medical diagnosis is never required.
              </p>
            </div>

            {/* Quick preset scenario phrases */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#142D36] block">
                Standard Operational Templates (Click to insert):
              </label>
              <div className="flex flex-wrap gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={() =>
                    setDescription(
                      "আমার বাবা হাঁটতে পারেন না, প্যারালাইজড। আমাদের হুইলচেয়ার নিয়ে যাওয়ার মতো গাড়ি লাগবে। ডাকোপ বাজার।"
                    )
                  }
                  className="bg-[#F4F7F6] hover:bg-[#DBE6E2] text-[#142D36] px-3 py-1.5 rounded-lg border border-[#DBE6E2] transition font-medium text-left"
                >
                  বাংলা: হুইলচেয়ার ও গাড়ি প্রয়োজন
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setDescription(
                      "Ami deaf, phone call bujhbo na. SMS ba visual team pathan. 2 jon achi. Chalna high school kase."
                    )
                  }
                  className="bg-[#F4F7F6] hover:bg-[#DBE6E2] text-[#142D36] px-3 py-1.5 rounded-lg border border-[#DBE6E2] transition font-medium text-left"
                >
                  Banglish: Deaf / SMS Visual Team
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setDescription(
                      "Elderly mother on home oxygen concentrator. Electricity down, need generator shelter. Pankhali union."
                    )
                  }
                  className="bg-[#F4F7F6] hover:bg-[#DBE6E2] text-[#142D36] px-3 py-1.5 rounded-lg border border-[#DBE6E2] transition font-medium text-left"
                >
                  English: Oxygen / Generator Shelter
                </button>
              </div>
            </div>

            {/* Text Description & Voice Button */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="description" className="text-xs font-bold text-[#142D36]">
                  Describe who needs assistance and what is urgent: *
                </label>
                <button
                  type="button"
                  onClick={toggleSpeechRecognition}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
                    isRecording
                      ? "bg-[#D9534F] text-white border-[#B33936] animate-pulse"
                      : "bg-[#0B766E]/10 text-[#0B766E] border-[#0B766E]/20 hover:bg-[#0B766E]/20"
                  }`}
                  title="Toggle voice speech recognition"
                >
                  {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  <span>{isRecording ? "Recording Audio..." : "Speak Voice (কণ্ঠস্বর)"}</span>
                </button>
              </div>
              <textarea
                id="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="উদাহরণ: আমার বাবা হাঁটতে পারেন না। আমরা ৩ জন আছি। হুইলচেয়ার নিয়ে যাওয়ার মতো গাড়ি ও র‍্যাম্পযুক্ত আশ্রয় দরকার..."
                className="w-full p-3.5 rounded-xl border border-[#DBE6E2] focus:ring-2 focus:ring-[#0B766E] focus:border-[#0B766E] focus:outline-none text-sm text-[#142D36] leading-relaxed"
              />
            </div>

            {/* Approximate Location */}
            <div className="space-y-1.5">
              <label htmlFor="location" className="text-xs font-bold text-[#142D36] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#0B766E]" />
                Approximate Location / Nearest Landmark:
              </label>
              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Dacope Bazar near Bridge Road, or Chalna High School"
                className="w-full p-3 rounded-xl border border-[#DBE6E2] focus:ring-2 focus:ring-[#0B766E] focus:border-[#0B766E] focus:outline-none text-sm text-[#142D36]"
              />
            </div>

            {/* Group Size & Urgency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="groupSize" className="text-xs font-bold text-[#142D36] flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#0B766E]" />
                  Total Persons Requiring Evacuation:
                </label>
                <input
                  id="groupSize"
                  type="number"
                  min={1}
                  max={20}
                  value={groupSize}
                  onChange={(e) => setGroupSize(parseInt(e.target.value, 10) || 1)}
                  className="w-full p-3 rounded-xl border border-[#DBE6E2] focus:ring-2 focus:ring-[#0B766E] focus:border-[#0B766E] focus:outline-none text-sm text-[#142D36] font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="urgency" className="text-xs font-bold text-[#142D36] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#0B766E]" />
                  Urgency Level:
                </label>
                <select
                  id="urgency"
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as UrgencyLevel)}
                  className="w-full p-3 rounded-xl border border-[#DBE6E2] focus:ring-2 focus:ring-[#0B766E] focus:border-[#0B766E] focus:outline-none text-sm text-[#142D36] font-medium"
                >
                  <option value="critical">Critical — Immediate Danger (পানি ঢুকছে / জীবন সংশয়)</option>
                  <option value="urgent">Urgent — High Tide Rising (শীঘ্রই স্থানান্তর প্রয়োজন)</option>
                  <option value="routine">Routine — Pre-evacuation Planning (পূর্বপ্রস্তুতি)</option>
                </select>
              </div>
            </div>

            {/* Contact info (Optional) */}
            <div className="p-4 rounded-xl bg-[#F4F7F6] border border-[#DBE6E2] space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#142D36]">
                <Phone className="w-3.5 h-3.5 text-[#0B766E]" />
                Direct Contact Method (Optional — For Coordinator Dispatch):
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Contact Name (ঐচ্ছিক নাম)"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="p-2.5 rounded-lg border border-[#DBE6E2] text-xs bg-white focus:ring-1 focus:ring-[#0B766E] focus:outline-none"
                />
                <input
                  type="tel"
                  placeholder="Mobile Phone (মোবাইল নম্বর)"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="p-2.5 rounded-lg border border-[#DBE6E2] text-xs bg-white focus:ring-1 focus:ring-[#0B766E] focus:outline-none font-mono"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-[#D9534F]/10 border border-[#D9534F] text-[#D9534F] text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="flex justify-end pt-2 border-t border-[#DBE6E2]">
              <button
                type="button"
                onClick={handleNextToStep2}
                className="inline-flex items-center gap-2 bg-[#0B766E] hover:bg-[#085852] text-white px-6 py-3 rounded-xl font-bold text-xs shadow-sm transition"
              >
                <span>Continue to Functional Needs</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: IDENTIFY ASSISTANCE REQUIREMENTS */}
        {step === 2 && (
          <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#DBE6E2] shadow-sm space-y-6">
            <div className="border-b border-[#DBE6E2] pb-4">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#0B766E]">
                Stage 2 of 3 · Functional Constraints
              </span>
              <h1 className="text-2xl font-extrabold text-[#142D36] mt-1 tracking-tight">
                Select your functional requirements
              </h1>
              <p className="text-xs text-[#60747A] mt-1.5 leading-relaxed">
                Select all accommodation requirements that apply. The automated matching engine strictly filters out vehicles and shelters that lack verified compliance for these physical constraints.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {[
                {
                  id: "wheelchair_transport" as NeedType,
                  title: "Wheelchair Transport",
                  desc: "Needs vehicle with folding ramp/lift and tie-down anchors.",
                  badge: "Ramp / Lift",
                },
                {
                  id: "step_free_access" as NeedType,
                  title: "Step-Free Shelter Access",
                  desc: "Cannot climb stairs. Shelter must have 1:12 ramp or ground-floor entry.",
                  badge: "Ramp Shelter",
                },
                {
                  id: "guided_assistance" as NeedType,
                  title: "Guided Visual Assistance",
                  desc: "Blind or low-vision; requires trained sighted guide volunteer.",
                  badge: "Sighted Guide",
                },
                {
                  id: "visual_communication" as NeedType,
                  title: "Hearing-Accessible Comms",
                  desc: "Deaf or hard of hearing; communicate via SMS/visual signals, no voice calls.",
                  badge: "SMS / Text Only",
                },
                {
                  id: "sign_language" as NeedType,
                  title: "Sign Language (BdSL)",
                  desc: "Communicates using Bengali Sign Language.",
                  badge: "BdSL Volunteer",
                },
                {
                  id: "power_equipment" as NeedType,
                  title: "Power for Medical Devices",
                  desc: "Oxygen concentrator, ventilator, suction; requires generator backup.",
                  badge: "Generator Shelter",
                },
                {
                  id: "caregiver_accompaniment" as NeedType,
                  title: "Caregiver Accompaniment",
                  desc: "Family member or personal attendant must remain together during transit.",
                  badge: "Stay Together",
                },
                {
                  id: "older_adult_assistance" as NeedType,
                  title: "Older Adult Support",
                  desc: "Seniors with limited mobility needing patient boarding assistance.",
                  badge: "Elderly Care",
                },
                {
                  id: "cognitive_support" as NeedType,
                  title: "Cognitive / Sensory Calm",
                  desc: "Low-stimulus, calm environment for neurodivergent or anxious individuals.",
                  badge: "Calm Space",
                },
                {
                  id: "other" as NeedType,
                  title: "Other Specialized Need",
                  desc: "Details mentioned in description notes.",
                  badge: "Specialized",
                },
              ].map((item) => {
                const isSelected = selectedNeeds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleNeed(item.id)}
                    className={`p-4 rounded-xl border text-left transition flex items-start justify-between gap-3 ${
                      isSelected
                        ? "border-[#0B766E] bg-[#0B766E]/5 ring-1 ring-[#0B766E]"
                        : "border-[#DBE6E2] bg-white hover:border-[#0B766E]/50"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#142D36]">
                          {item.title}
                        </span>
                        <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-[#DBE6E2] text-[#142D36]">
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-xs text-[#60747A] mt-1.5 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition ${
                        isSelected
                          ? "bg-[#0B766E] border-[#0B766E] text-white"
                          : "border-[#DBE6E2] bg-white"
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#DBE6E2]">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#60747A] hover:text-[#142D36] transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Situation</span>
              </button>

              <button
                type="button"
                onClick={handleNextToStep3}
                className="inline-flex items-center gap-2 bg-[#0B766E] hover:bg-[#085852] text-white px-6 py-3 rounded-xl font-bold text-xs shadow-sm transition"
              >
                <span>Review & Confirm</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: REVIEW & CONSENT */}
        {step === 3 && (
          <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#DBE6E2] shadow-sm space-y-6">
            <div className="border-b border-[#DBE6E2] pb-4">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#0B766E]">
                Stage 3 of 3 · Final Verification
              </span>
              <h1 className="text-2xl font-extrabold text-[#142D36] mt-1 tracking-tight">
                Review and Submit Request
              </h1>
              <p className="text-xs text-[#60747A] mt-1.5 leading-relaxed">
                Confirm your submitted details prior to queuing for dispatch. You can update any field before transmitting.
              </p>
            </div>

            {/* Summary Review Card */}
            <div className="bg-[#F4F7F6] p-5 rounded-xl border border-[#DBE6E2] space-y-4">
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#60747A]">
                  Stated Evacuation Narrative
                </span>
                <p className="text-sm text-[#142D36] font-medium mt-1 italic leading-relaxed">
                  &ldquo;{description}&rdquo;
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-3 border-t border-[#DBE6E2]">
                <div>
                  <span className="text-[#60747A] block font-mono text-[11px]">LOCATION LANDMARK</span>
                  <span className="font-semibold text-[#142D36] text-sm">
                    {location || "Pending landmark confirmation"}
                  </span>
                </div>
                <div>
                  <span className="text-[#60747A] block font-mono text-[11px]">EVACUEES HEADCOUNT</span>
                  <span className="font-semibold text-[#142D36] text-sm font-mono">{groupSize} Person(s)</span>
                </div>
                <div>
                  <span className="text-[#60747A] block font-mono text-[11px]">URGENCY ASSESSMENT</span>
                  <span className="font-semibold capitalize text-[#D9534F] text-sm">{urgency}</span>
                </div>
                <div>
                  <span className="text-[#60747A] block font-mono text-[11px]">COMMUNICATION CHANNEL</span>
                  <span className="font-semibold text-[#142D36] text-sm">
                    {contactName || "Citizen"} {contactPhone ? `(${contactPhone})` : ""}
                  </span>
                </div>
              </div>

              {selectedNeeds.length > 0 && (
                <div className="pt-3 border-t border-[#DBE6E2]">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#60747A] block mb-2">
                    Verified Support Requirements:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedNeeds.map((n) => (
                      <span
                        key={n}
                        className="text-xs bg-[#0B766E]/10 text-[#0B766E] font-medium px-2.5 py-1 rounded-md border border-[#0B766E]/20"
                      >
                        {n.replace(/_/g, " ")}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Data Minimization & Consent Disclosure */}
            <div className="p-4 rounded-xl bg-white border border-[#0B766E]/40 space-y-3">
              <div className="flex items-start gap-2.5 text-xs text-[#142D36]">
                <Shield className="w-5 h-5 text-[#0B766E] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold">Transparent Data Sharing & Minimization Guarantee:</span>
                  <p className="text-[#60747A] leading-relaxed">
                    By submitting, only necessary functional accommodation parameters (such as wheelchair vehicle ramp or generator access) and navigation coordinates are transmitted to verified civil defense coordinators and assigned responders. Medical records and clinical diagnoses are neither requested nor stored.
                  </p>
                </div>
              </div>

              <label className="flex items-start gap-2.5 pt-3 border-t border-[#DBE6E2] cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentGiven}
                  onChange={(e) => setConsentGiven(e.target.checked)}
                  className="mt-0.5 rounded text-[#0B766E] focus:ring-[#0B766E] w-4 h-4"
                />
                <span className="text-xs font-semibold text-[#142D36] leading-relaxed">
                  I consent to sharing these functional assistance requirements with the verified emergency response coordination team for this simulated scenario.
                </span>
              </label>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-[#D9534F]/10 border border-[#D9534F] text-[#D9534F] text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-[#DBE6E2]">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#60747A] hover:text-[#142D36] transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Functional Needs</span>
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="inline-flex items-center gap-2 bg-[#D9534F] hover:bg-[#B33936] disabled:opacity-50 text-white px-8 py-3 rounded-xl font-bold text-xs shadow-sm transition"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing Constraints...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Emergency Request</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: SUCCESS CONFIRMATION & LIVE CASE STATUS TRACKER */}
        {step === 4 && (
          <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#DBE6E2] shadow-sm space-y-6">
            {offlineDraftSaved ? (
              <div className="text-center space-y-4 py-6">
                <div className="w-14 h-14 rounded-xl bg-[#ECAF42]/10 text-[#ECAF42] border border-[#ECAF42]/30 mx-auto flex items-center justify-center">
                  <WifiOff className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-[#142D36] tracking-tight">
                    Saved on this device — not yet sent
                  </h2>
                  <p className="text-xs text-[#60747A] mt-1.5 max-w-md mx-auto leading-relaxed">
                    Your request was recorded in local offline cache. When internet connectivity is restored, this terminal will automatically transmit the record to the emergency coordinator pool.
                  </p>
                </div>
                <div className="inline-block bg-[#F4F7F6] px-4 py-2 rounded-lg text-xs font-mono font-medium text-[#60747A] border border-[#DBE6E2]">
                  Draft Reference: DRAFT-{Date.now().toString().slice(-6)}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-start justify-between gap-4 border-b border-[#DBE6E2] pb-4">
                  <div>
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#0B766E] flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#159B82]" />
                      Submission Confirmed
                    </span>
                    <h2 className="text-2xl font-black text-[#142D36] mt-1 tracking-tight font-mono">
                      Case Reference: {submittedCase?.id}
                    </h2>
                    <p className="text-xs text-[#60747A] mt-0.5">
                      Request logged in dispatch pipeline. AI Needs Engine extracted constraints for human-in-the-loop coordinator approval.
                    </p>
                  </div>
                  <div className="px-3 py-1 rounded bg-[#0B766E]/10 border border-[#0B766E]/20 text-[#0B766E] text-xs font-mono font-bold">
                    QUEUED DISPATCH
                  </div>
                </div>

                {/* Live Status Pipeline Visualizer */}
                <div className="p-5 rounded-xl bg-[#091E2C] text-white border border-[#103B48] space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono text-[#63DEC2] pb-2 border-b border-[#103B48]">
                    <span className="font-bold">Live Tracking Workflow</span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#159B82] animate-pulse" />
                      MONITORING ACTIVE
                    </span>
                  </div>

                  <div className="space-y-3 pt-1">
                    {[
                      {
                        title: "1. Request Submitted",
                        desc: "Payload captured and stored securely in database.",
                        done: true,
                        active: false,
                      },
                      {
                        title: "2. AI Needs Understanding Completed",
                        desc: "Functional constraints extracted without clinical diagnosis.",
                        done: true,
                        active: false,
                      },
                      {
                        title: "3. Waiting for Coordinator Review",
                        desc: "Coordinator reviewing verified step-free vehicles & shelters.",
                        done: false,
                        active: true,
                      },
                      {
                        title: "4. Responder Assigned & Dispatched",
                        desc: "Volunteer team commits to arrival landmark.",
                        done: false,
                        active: false,
                      },
                      {
                        title: "5. Arrival & Safe Shelter Confirmed",
                        desc: "Evacuation recorded on immutable audit timeline.",
                        done: false,
                        active: false,
                      },
                    ].map((st, i) => (
                      <div key={i} className="flex items-start gap-3 text-xs">
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-mono ${
                            st.done
                              ? "bg-[#159B82] text-white"
                              : st.active
                              ? "bg-[#ECAF42] text-[#091E2C] font-bold"
                              : "bg-white/10 text-white/40"
                          }`}
                        >
                          {st.done ? <Check className="w-3.5 h-3.5" /> : i + 1}
                        </div>
                        <div>
                          <div className={`font-bold ${st.active ? "text-[#ECAF42]" : st.done ? "text-white" : "text-white/50"}`}>
                            {st.title}
                          </div>
                          <div className="text-[11px] text-white/60">{st.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* View case in operations center button */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#DBE6E2]">
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setDescription("");
                      setLocation("");
                      setSelectedNeeds([]);
                      setSubmittedCase(null);
                    }}
                    className="text-xs font-bold text-[#0B766E] hover:underline"
                  >
                    + Submit Another Assistance Request
                  </button>

                  <Link
                    href="/operations"
                    className="inline-flex items-center gap-2 bg-[#0B766E] hover:bg-[#085852] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-sm transition"
                  >
                    <span>View in Coordinator Operations Center</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

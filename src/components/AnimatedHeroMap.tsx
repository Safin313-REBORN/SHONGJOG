"use client";

import React, { useState } from "react";
import {
  Truck,
  AlertTriangle,
  Building2,
  ExternalLink,
} from "lucide-react";

interface IncidentPoint {
  id: string;
  code: string;
  type: "request" | "shelter" | "vehicle";
  label: string;
  details: string;
  lat: number;
  lng: number;
  elevation: string;
  status: "critical" | "urgent" | "verified_shelter" | "en_route";
  tags: string[];
}

export default function AnimatedHeroMap() {
  const [activePointId, setActivePointId] = useState<string>("pt-req-1");
  const [mapType, setMapType] = useState<"satellite" | "roadmap" | "terrain">("satellite");

  const incidentPoints: IncidentPoint[] = [
    {
      id: "pt-req-1",
      code: "SHG-0801",
      type: "request",
      label: "Non-Ambulatory Wheelchair Evacuation",
      details: "4 evacuees (1 wheelchair user). Ground transport with ramp required.",
      lat: 22.5733,
      lng: 89.5141,
      elevation: "1.4m AMSL",
      status: "urgent",
      tags: ["Wheelchair", "Step-Free Van", "Dacope Bazar"],
    },
    {
      id: "pt-req-2",
      code: "SHG-0803",
      type: "request",
      label: "Blind Senior Living Alone",
      details: "1 evacuee, 75 years old. Rising water level; requires sighted guide.",
      lat: 22.5542,
      lng: 89.5014,
      elevation: "1.1m AMSL",
      status: "critical",
      tags: ["Sighted Guide", "Elderly", "Bajua West"],
    },
    {
      id: "pt-req-3",
      code: "SHG-0804",
      type: "request",
      label: "Home Oxygen Life-Support Dependency",
      details: "3 evacuees. Medical oxygen concentrator on 35-min UPS battery.",
      lat: 22.5764,
      lng: 89.5097,
      elevation: "1.6m AMSL",
      status: "critical",
      tags: ["Generator Shelter", "Life Support", "Pankhali"],
    },
    {
      id: "pt-shl-1",
      code: "RES-SHL-01",
      type: "shelter",
      label: "Dacope Model Cyclone Shelter",
      details: "Capacity: 350 | Headroom: 230 | Ramp: 1:12 Verified | Generator: 15kVA",
      lat: 22.5708,
      lng: 89.5158,
      elevation: "5.2m AMSL",
      status: "verified_shelter",
      tags: ["Ramp Verified", "Generator", "Accessible Toilets"],
    },
    {
      id: "pt-shl-2",
      code: "RES-SHL-02",
      type: "shelter",
      label: "Chalna High School Shelter",
      details: "Capacity: 220 | Headroom: 155 | Ramp: Switchback | Generator: Solar-Hybrid",
      lat: 22.5850,
      lng: 89.5250,
      elevation: "4.8m AMSL",
      status: "verified_shelter",
      tags: ["Switchback Ramp", "Solar Power", "Chalna"],
    },
    {
      id: "pt-veh-1",
      code: "RES-VEH-01",
      type: "vehicle",
      label: "Accessible Evacuation Van Alpha",
      details: "Folding hydraulic ramp, 2 floor lock anchors, 4 companion seats.",
      lat: 22.5680,
      lng: 89.5083,
      elevation: "1.8m AMSL",
      status: "en_route",
      tags: ["Hydraulic Ramp", "Floor Locks", "Active Run"],
    },
  ];

  const activePoint = incidentPoints.find((p) => p.id === activePointId) || incidentPoints[0];

  // Embed parameters for original Google Map
  const embedTypeParam = mapType === "satellite" ? "k" : mapType === "terrain" ? "p" : "m";
  const embedUrl = `https://maps.google.com/maps?q=${activePoint.lat},${activePoint.lng}&t=${embedTypeParam}&z=14&ie=UTF8&iwloc=&output=embed`;
  const externalGoogleUrl = `https://www.google.com/maps/search/?api=1&query=${activePoint.lat},${activePoint.lng}`;

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-[#133446] bg-[#071520] shadow-2xl flex flex-col">
      {/* Precision Telemetry Header */}
      <div className="bg-[#071520]/95 backdrop-blur-xl px-4 py-2.5 border-b border-[#133446] flex flex-wrap items-center justify-between gap-2 text-xs z-10">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#159B82] pulse-teal shrink-0" />
          <span className="font-mono font-bold text-[#63DEC2] tracking-wider text-xs">
            ORIGINAL GOOGLE MAP · DACOPE WGS84
          </span>
          <span className="text-[10px] font-mono text-[#DBE6E2]/60 hidden sm:inline">
            (22.5726° N, 89.5124° E)
          </span>
        </div>

        {/* Layer Controls */}
        <div className="flex items-center gap-2">
          <div className="bg-[#0D2232] p-0.5 rounded-lg border border-[#0B766E]/40 flex text-[10px] font-bold">
            <button
              onClick={() => setMapType("satellite")}
              className={`px-2 py-0.5 rounded transition ${
                mapType === "satellite" ? "bg-[#0B766E] text-white shadow-sm" : "text-[#DBE6E2]/70 hover:text-white"
              }`}
            >
              Satellite
            </button>
            <button
              onClick={() => setMapType("roadmap")}
              className={`px-2 py-0.5 rounded transition ${
                mapType === "roadmap" ? "bg-[#0B766E] text-white shadow-sm" : "text-[#DBE6E2]/70 hover:text-white"
              }`}
            >
              Roadmap
            </button>
            <button
              onClick={() => setMapType("terrain")}
              className={`px-2 py-0.5 rounded transition ${
                mapType === "terrain" ? "bg-[#0B766E] text-white shadow-sm" : "text-[#DBE6E2]/70 hover:text-white"
              }`}
            >
              Terrain
            </button>
          </div>

          <a
            href={externalGoogleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#0B766E]/40 hover:bg-[#0B766E] text-[#63DEC2] hover:text-white border border-[#0B766E] text-[10px] font-bold transition active:scale-95"
            title="Open real coordinates in Google Maps"
          >
            <span>Google Maps</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Main Interactive Map & Point Selector */}
      <div className="relative w-full h-[380px] bg-[#071520]">
        {/* Real Embedded Google Map */}
        <iframe
          src={embedUrl}
          title="Original Google Map of Dacope Sector"
          className="w-full h-full border-0"
          loading="lazy"
          allowFullScreen
        />

        {/* Floating Top Point Chips for Quick Navigation */}
        <div className="absolute top-3 left-3 right-3 flex items-center gap-2 overflow-x-auto pb-1 pointer-events-auto">
          {incidentPoints.map((pt) => {
            const isSelected = pt.id === activePointId;
            return (
              <button
                key={pt.id}
                onClick={() => setActivePointId(pt.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap border shadow-lg backdrop-blur-md transition-all duration-150 active:scale-95 ${
                  isSelected
                    ? "bg-[#0B766E] border-[#63DEC2] text-white ring-2 ring-[#63DEC2]/50"
                    : "bg-[#071520]/80 border-[#133446] text-[#DBE6E2] hover:bg-[#0D2232] hover:text-white"
                }`}
              >
                {pt.type === "shelter" ? (
                  <Building2 className="w-3 h-3 text-[#63DEC2]" />
                ) : pt.type === "vehicle" ? (
                  <Truck className="w-3 h-3 text-[#159B82]" />
                ) : (
                  <AlertTriangle className="w-3 h-3 text-[#F59E0B]" />
                )}
                <span>{pt.code}</span>
              </button>
            );
          })}
        </div>

        {/* Bottom Floating Telemetry Card */}
        <div className="absolute bottom-3 left-3 right-3 bg-[#071520]/95 backdrop-blur-xl border border-[#133446] rounded-xl p-3 text-xs text-white shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 pointer-events-auto">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span
                className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                  activePoint.type === "shelter"
                    ? "bg-[#0B766E] text-white"
                    : activePoint.status === "critical"
                    ? "bg-[#D9534F] text-white"
                    : "bg-[#F59E0B] text-black"
                }`}
              >
                {activePoint.type} · {activePoint.code}
              </span>
              <h4 className="font-bold text-sm text-white truncate">{activePoint.label}</h4>
            </div>
            <p className="text-[11px] text-[#DBE6E2]/80 mt-1 line-clamp-1">{activePoint.details}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] font-mono text-[#63DEC2] bg-[#0D2232] px-2 py-1 rounded border border-[#133446]">
              {activePoint.lat.toFixed(4)}°N, {activePoint.lng.toFixed(4)}°E
            </span>
            <a
              href={externalGoogleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-lg bg-[#159B82] hover:bg-[#0E7C67] text-white text-[11px] font-bold transition flex items-center gap-1"
            >
              <span>View Point</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

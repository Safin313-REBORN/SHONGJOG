"use client";

import React, { useState } from "react";
import { ShieldCheck, Truck, AlertTriangle, Building2, Layers, Compass, Crosshair } from "lucide-react";

interface IncidentPoint {
  id: string;
  code: string;
  type: "request" | "shelter" | "vehicle";
  label: string;
  details: string;
  coordinates: string;
  elevation: string;
  cx: number;
  cy: number;
  status: "critical" | "urgent" | "verified_shelter" | "en_route";
  tags: string[];
}

export default function AnimatedHeroMap() {
  const [activePointId, setActivePointId] = useState<string>("pt-req-1");

  const incidentPoints: IncidentPoint[] = [
    {
      id: "pt-req-1",
      code: "SHG-0801",
      type: "request",
      label: "Non-Ambulatory Wheelchair Evacuation",
      details: "4 evacuees (1 wheelchair user). Ground transport with ramp required.",
      coordinates: "22°34'24\"N 89°30'51\"E",
      elevation: "1.4m AMSL",
      cx: 310,
      cy: 270,
      status: "urgent",
      tags: ["Wheelchair", "Step-Free Van", "Dacope Bazar"],
    },
    {
      id: "pt-req-2",
      code: "SHG-0803",
      type: "request",
      label: "Blind Senior Living Alone",
      details: "1 evacuee, 75 years old. Rising water level; requires sighted guide.",
      coordinates: "22°33'15\"N 89°30'05\"E",
      elevation: "1.1m AMSL",
      cx: 195,
      cy: 375,
      status: "critical",
      tags: ["Sighted Guide", "Elderly", "Bajua West"],
    },
    {
      id: "pt-req-3",
      code: "SHG-0804",
      type: "request",
      label: "Home Oxygen Life-Support Dependency",
      details: "3 evacuees. Medical oxygen concentrator on 35-min UPS battery.",
      coordinates: "22°34'35\"N 89°30'35\"E",
      elevation: "1.6m AMSL",
      cx: 450,
      cy: 205,
      status: "critical",
      tags: ["Generator Shelter", "Life Support", "Pankhali"],
    },
    {
      id: "pt-shl-1",
      code: "RES-SHL-01",
      type: "shelter",
      label: "Dacope Model Cyclone Shelter",
      details: "Capacity: 350 | Headroom: 230 | Ramp: 1:12 Verified | Generator: 15kVA",
      coordinates: "22°34'15\"N 89°30'57\"E",
      elevation: "5.2m AMSL",
      cx: 355,
      cy: 225,
      status: "verified_shelter",
      tags: ["Ramp Verified", "Generator", "Accessible Toilets"],
    },
    {
      id: "pt-shl-2",
      code: "RES-SHL-02",
      type: "shelter",
      label: "Chalna High School Shelter",
      details: "Capacity: 220 | Headroom: 155 | Ramp: Switchback | Generator: Solar-Hybrid",
      coordinates: "22°35'06\"N 89°31'30\"E",
      elevation: "4.8m AMSL",
      cx: 520,
      cy: 300,
      status: "verified_shelter",
      tags: ["Switchback Ramp", "Solar Power", "Chalna"],
    },
    {
      id: "pt-veh-1",
      code: "RES-VEH-01",
      type: "vehicle",
      label: "Accessible Evacuation Van Alpha",
      details: "Folding hydraulic ramp, 2 floor lock anchors, 4 companion seats.",
      coordinates: "22°34'05\"N 89°30'30\"E",
      elevation: "1.8m AMSL",
      cx: 275,
      cy: 295,
      status: "en_route",
      tags: ["Hydraulic Ramp", "Floor Locks", "Active Run"],
    },
  ];

  const activePoint = incidentPoints.find((p) => p.id === activePointId) || incidentPoints[0];

  return (
    <div className="relative w-full h-[470px] rounded-2xl overflow-hidden bg-[#091E2C] border border-[#103B48] flex flex-col justify-between shadow-lg">
      {/* Top GIS Status Header */}
      <div className="z-10 bg-[#091E2C]/95 border-b border-[#103B48] px-4 py-2.5 flex items-center justify-between text-xs text-[#DBE6E2]">
        <div className="flex items-center gap-2">
          <Crosshair className="w-3.5 h-3.5 text-[#63DEC2]" />
          <span className="font-mono text-[11px] tracking-wide text-white font-semibold">
            GIS SECTOR: DACOPE-KHULNA (WGS84 / UTM 45N)
          </span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px] text-[#63DEC2]">
          <span className="hidden sm:inline">HAZARD: TIDAL INUNDATION (+2.8m)</span>
          <span className="px-2 py-0.5 rounded bg-[#103B48] border border-[#0B766E]/40 text-white font-sans text-[10px] font-semibold">
            TELEMETRY ACTIVE
          </span>
        </div>
      </div>

      {/* Main Vector Cartographic Stage */}
      <div className="relative flex-1 w-full h-full">
        <svg
          className="w-full h-full"
          viewBox="0 0 700 380"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Grid Pattern */}
            <pattern id="gisGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#103B48" strokeWidth="0.5" strokeOpacity="0.4" />
            </pattern>

            {/* Inundation Hatch Pattern */}
            <pattern id="inundationHatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="8" stroke="#D9534F" strokeWidth="1" strokeOpacity="0.18" />
            </pattern>
          </defs>

          {/* Background Grid */}
          <rect width="100%" height="100%" fill="url(#gisGrid)" />

          {/* Topographic Elevation Contours */}
          <g stroke="#0B766E" strokeWidth="0.75" strokeOpacity="0.25" fill="none">
            <path d="M-50,110 Q140,80 290,140 T630,100 T800,170" />
            <path d="M-30,210 Q190,170 350,230 T690,200 T820,280" />
            <path d="M-60,320 Q160,270 320,340 T660,310 T810,390" />
            <ellipse cx="360" cy="225" rx="110" ry="60" strokeDasharray="3 6" />
            <ellipse cx="360" cy="225" rx="180" ry="100" strokeDasharray="3 6" />
          </g>

          {/* River System (Pasur River Estuary) */}
          <path
            d="M 110,-20 C 130,80 170,150 220,220 C 260,280 340,350 410,480 L 475,480 C 405,360 325,290 285,220 C 245,150 205,80 195,-20 Z"
            fill="#103B48"
            fillOpacity="0.65"
            stroke="#0B766E"
            strokeWidth="1.2"
          />

          {/* Tributary Creek */}
          <path
            d="M 220,220 C 280,240 390,220 530,200 L 540,215 C 390,235 290,255 220,220 Z"
            fill="#103B48"
            fillOpacity="0.5"
            stroke="#0B766E"
            strokeWidth="0.8"
          />

          {/* Simulated Inundation Hazard Polygon */}
          <polygon
            points="70,130 250,100 430,150 570,230 530,370 300,380 110,350 60,240"
            fill="url(#inundationHatch)"
            stroke="#D9534F"
            strokeWidth="1.2"
            strokeDasharray="5 3"
          />

          {/* Contour Height Label */}
          <text x="80" y="145" fill="#D9534F" fontSize="9" fontFamily="monospace" fontWeight="bold">
            FLOOD SURGE EXTENT (+2.8m)
          </text>

          {/* Evacuation Route Line: Van to Dacope Model Shelter */}
          <path
            d="M 310,270 Q 285,290 275,295 Q 315,260 355,225"
            stroke="#63DEC2"
            strokeWidth="2"
            strokeDasharray="4 4"
            fill="none"
          />

          {/* Route Direction Arrows / Waypoints */}
          <circle cx="275" cy="295" r="3" fill="#63DEC2" />
          <circle cx="310" cy="270" r="3" fill="#ECAF42" />

          {/* Secondary Route Line: Pankhali to Dacope Model Shelter */}
          <path
            d="M 450,205 Q 400,210 355,225"
            stroke="#ECAF42"
            strokeWidth="1.5"
            strokeDasharray="3 3"
            fill="none"
          />

          {/* Incident & Resource Markers */}
          {incidentPoints.map((pt) => {
            const isSelected = activePointId === pt.id;
            const isShelter = pt.type === "shelter";
            const isVehicle = pt.type === "vehicle";

            return (
              <g
                key={pt.id}
                className="cursor-pointer transition-transform"
                onClick={() => setActivePointId(pt.id)}
              >
                {/* Selection indicator */}
                {isSelected && (
                  <circle
                    cx={pt.cx}
                    cy={pt.cy}
                    r={isShelter ? 16 : 14}
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                  />
                )}

                {/* Shelter Square Symbol */}
                {isShelter ? (
                  <rect
                    x={pt.cx - 9}
                    y={pt.cy - 9}
                    width={18}
                    height={18}
                    rx={3}
                    fill="#159B82"
                    stroke="#FFFFFF"
                    strokeWidth={isSelected ? 2 : 1}
                  />
                ) : isVehicle ? (
                  /* Vehicle Diamond Symbol */
                  <polygon
                    points={`${pt.cx},${pt.cy - 8} ${pt.cx + 8},${pt.cy} ${pt.cx},${pt.cy + 8} ${pt.cx - 8},${pt.cy}`}
                    fill="#63DEC2"
                    stroke="#091E2C"
                    strokeWidth={1.5}
                  />
                ) : (
                  /* Request Circular Symbol */
                  <circle
                    cx={pt.cx}
                    cy={pt.cy}
                    r={7}
                    fill={pt.status === "critical" ? "#D9534F" : "#ECAF42"}
                    stroke="#FFFFFF"
                    strokeWidth={isSelected ? 2 : 1}
                  />
                )}

                {/* Code Tag Label */}
                <text
                  x={pt.cx}
                  y={pt.cy - (isShelter ? 12 : 10)}
                  fill="#DBE6E2"
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {pt.code}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Precision Map Scale & Compass */}
        <div className="absolute top-3 left-3 flex items-center gap-3 bg-[#091E2C]/85 border border-[#103B48] px-2.5 py-1.5 rounded-lg text-[10px] font-mono text-[#DBE6E2] backdrop-blur-sm">
          <div className="flex items-center gap-1 text-[#63DEC2]">
            <Compass className="w-3.5 h-3.5" />
            <span>N</span>
          </div>
          <div className="h-3 w-[1px] bg-[#103B48]" />
          <div className="flex items-center gap-1">
            <span className="w-6 h-[2px] bg-[#DBE6E2]" />
            <span>2.0 KM</span>
          </div>
        </div>

        {/* Cartographic Legend */}
        <div className="absolute top-3 right-3 hidden sm:flex flex-col gap-1 bg-[#091E2C]/85 border border-[#103B48] p-2.5 rounded-lg text-[10px] font-mono text-[#DBE6E2] backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D9534F]" />
            <span>Critical Request</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ECAF42]" />
            <span>Urgent Request</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#159B82]" />
            <span>Step-Free Shelter</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rotate-45 bg-[#63DEC2]" />
            <span>Dispatched Unit</span>
          </div>
        </div>
      </div>

      {/* Bottom Precision Telemetry Inspection Panel */}
      <div className="z-10 bg-[#091E2C] border-t border-[#103B48] p-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#63DEC2]">
                {activePoint.code}
              </span>
              <span
                className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                  activePoint.status === "critical"
                    ? "bg-[#D9534F] text-white"
                    : activePoint.status === "urgent"
                    ? "bg-[#ECAF42] text-[#091E2C]"
                    : activePoint.status === "verified_shelter"
                    ? "bg-[#159B82] text-white"
                    : "bg-[#63DEC2] text-[#091E2C]"
                }`}
              >
                {activePoint.status.replace(/_/g, " ")}
              </span>
              <span className="text-[11px] font-mono text-[#DBE6E2]/70">
                {activePoint.coordinates} | {activePoint.elevation}
              </span>
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-white">
              {activePoint.label}
            </h4>
            <p className="text-[11px] text-[#DBE6E2]/80 leading-normal">
              {activePoint.details}
            </p>
          </div>

          <div className="flex flex-wrap gap-1 sm:self-center shrink-0">
            {activePoint.tags.map((t, idx) => (
              <span
                key={idx}
                className="text-[10px] bg-[#103B48] text-[#DBE6E2] font-mono px-2 py-0.5 rounded border border-[#0B766E]/40"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

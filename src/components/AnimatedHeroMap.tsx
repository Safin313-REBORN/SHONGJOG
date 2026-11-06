"use client";

import React, { useState } from "react";
import { ShieldCheck, Truck, AlertCircle, Building2, UserCheck } from "lucide-react";

export default function AnimatedHeroMap() {
  const [activePin, setActivePin] = useState<string | null>("req1");

  const markers = [
    {
      id: "req1",
      type: "request",
      title: "SHG-0801: Non-ambulatory Wheelchair User",
      subtitle: "Dacope Bazar — 4 Persons (Needs Accessible Van)",
      cx: 320,
      cy: 280,
      color: "#ECAF42",
      badge: "URGENT",
    },
    {
      id: "req2",
      type: "request",
      title: "SHG-0803: Blind Senior Living Alone",
      subtitle: "Bajua West — 1 Person (Needs Sighted Guide)",
      cx: 190,
      cy: 390,
      color: "#D9534F",
      badge: "CRITICAL",
    },
    {
      id: "req3",
      type: "request",
      title: "SHG-0804: Oxygen Dependent Patient",
      subtitle: "Pankhali Ghat — 3 Persons (Needs Power Backup)",
      cx: 460,
      cy: 210,
      color: "#D9534F",
      badge: "CRITICAL",
    },
    {
      id: "shl1",
      type: "shelter",
      title: "RES-SHL-01: Dacope Model Cyclone Shelter",
      subtitle: "Capacity: 350 | Ramp: YES | Generator: YES",
      cx: 360,
      cy: 230,
      color: "#159B82",
      badge: "VERIFIED SHELTER",
    },
    {
      id: "shl2",
      type: "shelter",
      title: "RES-SHL-02: Chalna High School Shelter",
      subtitle: "Capacity: 220 | Ramp: YES | Generator: YES",
      cx: 520,
      cy: 310,
      color: "#159B82",
      badge: "VERIFIED SHELTER",
    },
    {
      id: "veh1",
      type: "vehicle",
      title: "RES-VEH-01: Accessible Van Alpha",
      subtitle: "Retrofitted Ramp + 2 Wheelchair Floor Locks",
      cx: 280,
      cy: 310,
      color: "#63DEC2",
      badge: "DISPATCHED",
    },
  ];

  return (
    <div className="relative w-full h-[460px] rounded-2xl overflow-hidden bg-[#091E2C] border border-[#103B48] shadow-2xl">
      {/* Background Topographic Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#103B48]/60 via-[#091E2C] to-[#091E2C]" />

      {/* SVG Map Graphic */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 700 480"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Tidal Surge Hazard Gradient */}
          <linearGradient id="surgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D9534F" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#ECAF42" stopOpacity="0.08" />
          </linearGradient>

          {/* Radar Sweep Gradient */}
          <radialGradient id="radarSweep" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#63DEC2" stopOpacity="0.3" />
            <stop offset="70%" stopColor="#0B766E" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#091E2C" stopOpacity="0" />
          </radialGradient>

          {/* Glow filter */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Topographic Elevation Contours */}
        <g stroke="#159B82" strokeWidth="0.75" strokeOpacity="0.18" fill="none">
          <path d="M-50,120 Q120,90 280,150 T620,110 T800,180" />
          <path d="M-30,220 Q180,180 340,240 T680,210 T820,290" />
          <path d="M-60,340 Q150,290 310,360 T650,330 T810,410" />
          <path d="M-40,430 Q200,380 380,440 T720,410 T830,480" />
          <circle cx="350" cy="240" r="140" strokeDasharray="4 8" />
          <circle cx="350" cy="240" r="220" strokeDasharray="6 12" />
        </g>

        {/* Coastal River Estuary (Pasur River Delta) */}
        <path
          d="M 120,-20 C 140,90 180,170 230,240 C 270,300 350,370 420,500 L 490,500 C 420,380 330,310 290,240 C 250,170 210,90 200,-20 Z"
          fill="#103B48"
          fillOpacity="0.55"
          stroke="#0B766E"
          strokeWidth="1.5"
          strokeOpacity="0.4"
        />

        {/* Secondary River Creek */}
        <path
          d="M 230,240 C 290,260 410,230 550,210 L 560,230 C 410,250 300,280 230,240 Z"
          fill="#103B48"
          fillOpacity="0.4"
          stroke="#0B766E"
          strokeWidth="1"
          strokeOpacity="0.3"
        />

        {/* Simulated Tidal Surge Inundation Hazard Polygon */}
        <polygon
          points="80,140 260,110 440,160 580,240 540,420 310,460 120,380 70,250"
          fill="url(#surgeGrad)"
          stroke="#D9534F"
          strokeWidth="1.5"
          strokeDasharray="6 4"
          className="animate-pulse"
        />

        {/* Connecting Active Evacuation Route 1 (Van to Dacope Model Shelter) */}
        <path
          d="M 320,280 Q 300,300 280,310 Q 320,270 360,230"
          stroke="#63DEC2"
          strokeWidth="2.5"
          strokeDasharray="4 4"
          fill="none"
          filter="url(#glow)"
        >
          <animate
            attributeName="stroke-dashoffset"
            values="16;0"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </path>

        {/* Route 2 (Pankhali Oxygen patient to Shelter) */}
        <path
          d="M 460,210 Q 410,200 360,230"
          stroke="#ECAF42"
          strokeWidth="2"
          strokeDasharray="4 4"
          fill="none"
        >
          <animate
            attributeName="stroke-dashoffset"
            values="16;0"
            dur="2s"
            repeatCount="indefinite"
          />
        </path>

        {/* Radar Coordination Pulse */}
        <circle cx="360" cy="230" r="80" fill="url(#radarSweep)">
          <animate
            attributeName="r"
            values="40;180"
            dur="4s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.6;0"
            dur="4s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Markers */}
        {markers.map((m) => {
          const isSelected = activePin === m.id;
          return (
            <g
              key={m.id}
              className="cursor-pointer transition-transform hover:scale-125"
              onClick={() => setActivePin(m.id)}
            >
              {/* Pulsing ring for urgent requests */}
              {m.type === "request" && (
                <circle cx={m.cx} cy={m.cy} r={isSelected ? 16 : 10} fill={m.color} fillOpacity="0.25">
                  <animate
                    attributeName="r"
                    values="8;20"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.8;0"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}

              {/* Pin Base */}
              <circle
                cx={m.cx}
                cy={m.cy}
                r={isSelected ? 9 : 7}
                fill={m.color}
                stroke="#FFFFFF"
                strokeWidth={isSelected ? 2.5 : 1.5}
                filter="url(#glow)"
              />
            </g>
          );
        })}
      </svg>

      {/* Floating Active Info Card */}
      {activePin && (() => {
        const pin = markers.find((m) => m.id === activePin);
        if (!pin) return null;
        return (
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md bg-[#091E2C]/95 border border-[#0B766E] rounded-xl p-3 shadow-xl backdrop-blur-md transition-all animate-fadeIn">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider text-white" style={{ backgroundColor: pin.color }}>
                {pin.badge}
              </span>
              <span className="text-[11px] text-[#63DEC2] font-mono">Dacope Coastal Simulation</span>
            </div>
            <h4 className="text-sm font-bold text-white truncate">{pin.title}</h4>
            <p className="text-xs text-[#DBE6E2]/80 mt-0.5">{pin.subtitle}</p>
          </div>
        );
      })()}

      {/* Map Legend Overlay */}
      <div className="absolute top-4 right-4 hidden sm:flex flex-col gap-1.5 bg-[#091E2C]/90 border border-white/10 rounded-xl p-2.5 text-[11px] text-[#DBE6E2] backdrop-blur-md">
        <div className="font-semibold text-white border-b border-white/10 pb-1 mb-0.5">
          Live Operational Legend
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ECAF42]" />
          <span>Mobility / Wheelchair Request</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#D9534F]" />
          <span>Critical / Sensory / Oxygen Need</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#159B82]" />
          <span>Verified Step-Free Shelter</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#63DEC2]" />
          <span>Accessible Vehicle En Route</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-1 border-t-2 border-dashed border-[#D9534F]" />
          <span>Inundation Surge Boundary</span>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
import { useTranslation, formatNumber } from "@/lib/i18n";
import {
  MapPin,
  ExternalLink,
  RefreshCw,
  Building2,
  Truck,
  Compass,
} from "lucide-react";

export interface MapIncidentItem {
  id: string;
  title: string;
  lat: number;
  lng: number;
  urgency: "critical" | "urgent" | "routine";
  status: string;
  locationName: string;
  headcount: number;
  needs: string[];
}

export interface MapResourceItem {
  id: string;
  name: string;
  type: "shelter" | "vehicle" | "responder";
  lat: number;
  lng: number;
  capacity?: number;
  isVerified: boolean;
  rampAvailable?: boolean;
}

interface GoogleOperationsMapProps {
  incidents: MapIncidentItem[];
  resources: MapResourceItem[];
  selectedId: string | null;
  onSelectItem: (id: string) => void;
  className?: string;
  showSidebarList?: boolean;
}

// Center on Dacope, Khulna coastal sector (WGS84 22.5726° N, 89.5124° E)
const DACOPE_CENTER = { lat: 22.5726, lng: 89.5124 };

export default function GoogleOperationsMap({
  incidents,
  resources,
  selectedId,
  onSelectItem,
  className = "h-[500px] w-full",
  showSidebarList = true,
}: GoogleOperationsMapProps) {
  const { lang } = useTranslation();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<{ [id: string]: any }>({});

  const [mapType, setMapType] = useState<"roadmap" | "satellite" | "terrain">("roadmap");
  const [useJsApi, setUseJsApi] = useState(false);
  const [centerCoord, setCenterCoord] = useState(DACOPE_CENTER);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAP_ID || "";

  // Selected item coordinates
  const activeSelected = useMemo(() => {
    if (!selectedId) return null;
    const inc = incidents.find((i) => i.id === selectedId);
    if (inc) return { lat: inc.lat, lng: inc.lng, title: inc.title, type: "incident" };
    const res = resources.find((r) => r.id === selectedId);
    if (res) return { lat: res.lat, lng: res.lng, title: res.name, type: res.type };
    return null;
  }, [selectedId, incidents, resources]);

  const currentLat = activeSelected ? activeSelected.lat : centerCoord.lat;
  const currentLng = activeSelected ? activeSelected.lng : centerCoord.lng;

  useEffect(() => {
    if (activeSelected && mapInstanceRef.current && typeof mapInstanceRef.current.panTo === "function") {
      mapInstanceRef.current.panTo({ lat: activeSelected.lat, lng: activeSelected.lng });
      mapInstanceRef.current.setZoom(15);
    }
  }, [activeSelected]);

  // Attempt JS API loader if key is available
  useEffect(() => {
    if (!apiKey) {
      return;
    }

    try {
      setOptions({
        key: apiKey,
        v: "weekly",
      });

      Promise.all([importLibrary("maps"), importLibrary("marker")])
        .then(([mapsLib, markerLib]) => {
          if (!mapContainerRef.current) return;
          const { Map } = mapsLib;
          const { Marker } = markerLib;

          const map = new Map(mapContainerRef.current, {
            center: DACOPE_CENTER,
            zoom: 12,
            mapTypeId: mapType,
            mapId: mapId || undefined,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            zoomControl: true,
          });

          mapInstanceRef.current = map;
          setUseJsApi(true);

          // Add Incidents
          incidents.forEach((inc) => {
            const marker = new Marker({
              position: { lat: inc.lat, lng: inc.lng },
              map,
              title: inc.title,
            });
            marker.addListener("click", () => onSelectItem(inc.id));
            markersRef.current[inc.id] = marker;
          });

          // Add Shelters
          resources.forEach((res) => {
            const marker = new Marker({
              position: { lat: res.lat, lng: res.lng },
              map,
              title: res.name,
            });
            marker.addListener("click", () => onSelectItem(res.id));
            markersRef.current[res.id] = marker;
          });
        })
        .catch((err) => {
          console.warn("Google Maps JS API load error, using high-fidelity embed fallback:", err);
        });
    } catch (e) {
      console.warn("Failed to init Google Maps API:", e);
    }
  }, [apiKey, mapId, incidents, resources, onSelectItem, mapType]);

  const handleMapTypeChange = (type: "roadmap" | "satellite" | "terrain") => {
    setMapType(type);
    if (mapInstanceRef.current && typeof mapInstanceRef.current.setMapTypeId === "function") {
      mapInstanceRef.current.setMapTypeId(type);
    }
  };

  const resetView = () => {
    setCenterCoord(DACOPE_CENTER);
    if (mapInstanceRef.current && typeof mapInstanceRef.current.setCenter === "function") {
      mapInstanceRef.current.setCenter(DACOPE_CENTER);
      mapInstanceRef.current.setZoom(12);
    }
  };

  // Google Maps standard embed parameters:
  // t=m (roadmap), t=k (satellite), t=p (terrain)
  const embedTypeParam = mapType === "satellite" ? "k" : mapType === "terrain" ? "p" : "m";
  const zoomLevel = activeSelected ? 15 : 13;
  const embedUrl = `https://maps.google.com/maps?q=${currentLat},${currentLng}&t=${embedTypeParam}&z=${zoomLevel}&ie=UTF8&iwloc=&output=embed`;
  
  const externalGoogleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${currentLat},${currentLng}`;

  return (
    <div className={`relative rounded-2xl overflow-hidden border border-[#133446] bg-[#071520] text-white flex flex-col shadow-2xl ${className}`}>
      {/* Top Map Action Bar */}
      <div className="bg-[#071520]/95 backdrop-blur-xl px-4 py-2.5 border-b border-[#133446] flex flex-wrap items-center justify-between gap-3 text-xs z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#159B82] pulse-teal shrink-0" />
          <span className="font-mono font-bold text-[#63DEC2] tracking-wider text-xs">
            {lang === "bn" ? "গুগল ম্যাপস অপারেশনাল জিআইএস · দাকোপ" : "GOOGLE MAPS OPERATIONAL GIS · DACOPE"}
          </span>
          <span className="text-[11px] font-mono text-[#DBE6E2]/70 hidden sm:inline bg-[#0D2232] px-2 py-0.5 rounded border border-[#133446]">
            {currentLat.toFixed(4)}° N, {currentLng.toFixed(4)}° E
          </span>
          <span className="text-[10px] font-mono text-[#63DEC2] bg-[#0D2232] px-2 py-0.5 rounded border border-[#0B766E]/50 hidden md:inline">
            {useJsApi ? "Google Maps JS API Active" : (lang === "bn" ? "গুগল ম্যাপস কোঅর্ডিনেট এম্বেড" : "Google Maps Coordinate Embed")}
          </span>
        </div>

        {/* Map Type & Navigation Controls */}
        <div className="flex items-center gap-2">
          <div className="bg-[#0D2232] p-0.5 rounded-lg border border-[#0B766E]/40 flex text-[11px] font-semibold">
            <button
              onClick={() => handleMapTypeChange("roadmap")}
              className={`px-2.5 py-1 rounded-md transition ${
                mapType === "roadmap" ? "bg-[#0B766E] text-white shadow-sm" : "text-[#DBE6E2]/70 hover:text-white"
              }`}
            >
              {lang === "bn" ? "রোডম্যাপ" : "Roadmap"}
            </button>
            <button
              onClick={() => handleMapTypeChange("satellite")}
              className={`px-2.5 py-1 rounded-md transition ${
                mapType === "satellite" ? "bg-[#0B766E] text-white shadow-sm" : "text-[#DBE6E2]/70 hover:text-white"
              }`}
            >
              {lang === "bn" ? "স্যাটেলাইট" : "Satellite"}
            </button>
            <button
              onClick={() => handleMapTypeChange("terrain")}
              className={`px-2.5 py-1 rounded-md transition ${
                mapType === "terrain" ? "bg-[#0B766E] text-white shadow-sm" : "text-[#DBE6E2]/70 hover:text-white"
              }`}
            >
              {lang === "bn" ? "টেরেইন" : "Terrain"}
            </button>
          </div>

          <button
            onClick={resetView}
            className="p-1.5 rounded-lg bg-[#0D2232] hover:bg-[#159B82] text-white border border-[#0B766E]/40 transition active:scale-95"
            title={lang === "bn" ? "দাকোপ কেন্দ্রে ম্যাপ রিসেট করুন" : "Reset Map to Dacope Center"}
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <a
            href={externalGoogleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#0B766E]/40 hover:bg-[#0B766E] text-[#63DEC2] hover:text-white border border-[#0B766E] text-[11px] font-bold transition active:scale-95 shadow-sm"
            title="Open in official Google Maps app"
          >
            <span>Google Maps</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* API Key Transparency Banner */}
      {!apiKey && (
        <div className="bg-[#103946]/90 border-b border-[#087B72]/40 px-4 py-1.5 flex items-center justify-between text-[11px] text-[#DBE6E2] z-20">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D99A32]" />
            <span>
              Google Maps API Key not set: Rendering official Google Maps coordinate embed directly from Google Maps.
            </span>
          </div>
          <span className="font-mono text-[10px] text-[#68DCC3]/80 hidden lg:inline">
            NEXT_PUBLIC_GOOGLE_MAPS_API_KEY optional
          </span>
        </div>
      )}

      {/* Main Map Body with Split Interactive Canvas */}
      <div className="relative flex-1 w-full min-h-[380px] bg-[#071520] flex flex-col md:flex-row">
        {/* Left Interactive Overlay List (if enabled) */}
        {showSidebarList && (
          <div className="w-full md:w-72 bg-[#071520]/95 backdrop-blur-md border-r border-[#133446] p-3 text-xs overflow-y-auto max-h-[380px] md:max-h-none flex flex-col gap-2 z-10 shrink-0">
            <div className="flex items-center justify-between pb-1 border-b border-[#133446]">
              <span className="font-mono text-[10px] uppercase font-bold text-[#63DEC2]">
                {lang === "bn" ? "সক্রিয় পিনকৃত স্থানাঙ্ক" : "Active Pinned Coordinates"}
              </span>
              <span className="text-[10px] text-[#DBE6E2]/60 font-mono">
                {formatNumber(incidents.length + resources.length, lang)} {lang === "bn" ? "মোট" : "Total"}
              </span>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] text-[#DBE6E2]/50 font-bold uppercase tracking-wider block mt-1">
                {lang === "bn" ? "ইভাকুয়েশন অনুরোধসমূহ" : "Evacuation Requests"} ({formatNumber(incidents.length, lang)})
              </span>
              {incidents.map((inc) => (
                <button
                  key={inc.id}
                  onClick={() => onSelectItem(inc.id)}
                  className={`w-full text-left p-2 rounded-lg border transition-all duration-150 flex items-start justify-between gap-2 text-[11px] ${
                    selectedId === inc.id
                      ? "bg-[#0B766E]/40 border-[#63DEC2] text-white shadow-sm"
                      : "bg-[#0D2232]/70 border-transparent text-[#DBE6E2]/80 hover:bg-[#0D2232] hover:text-white"
                  }`}
                >
                  <div className="truncate">
                    <p className="font-bold text-white truncate">{inc.title}</p>
                    <p className="text-[10px] text-[#DBE6E2]/60 truncate">{inc.locationName}</p>
                  </div>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase shrink-0 ${
                      inc.urgency === "critical"
                        ? "bg-[#D9534F] text-white"
                        : "bg-[#F59E0B] text-black"
                    }`}
                  >
                    {inc.urgency}
                  </span>
                </button>
              ))}

              <span className="text-[10px] text-[#DBE6E2]/50 font-bold uppercase tracking-wider block pt-2">
                {lang === "bn" ? "যাচাইকৃত আশ্রয় ও সম্পদ" : "Verified Shelters & Assets"} ({formatNumber(resources.length, lang)})
              </span>
              {resources.map((res) => (
                <button
                  key={res.id}
                  onClick={() => onSelectItem(res.id)}
                  className={`w-full text-left p-2 rounded-lg border transition-all duration-150 flex items-start justify-between gap-2 text-[11px] ${
                    selectedId === res.id
                      ? "bg-[#159B82]/40 border-[#63DEC2] text-white shadow-sm"
                      : "bg-[#0D2232]/70 border-transparent text-[#DBE6E2]/80 hover:bg-[#0D2232] hover:text-white"
                  }`}
                >
                  <div className="truncate">
                    <p className="font-bold text-white truncate flex items-center gap-1">
                      {res.type === "shelter" ? <Building2 className="w-3 h-3 text-[#63DEC2]" /> : <Truck className="w-3 h-3 text-[#159B82]" />}
                      {res.name}
                    </p>
                    <p className="text-[10px] text-[#DBE6E2]/60 truncate">
                      {res.rampAvailable ? (lang === "bn" ? "ধাপহীন র‍্যাম্প যাচাইকৃত" : "Step-Free Ramp Verified") : (lang === "bn" ? "নিচতলা প্রবেশযোগ্য" : "Ground Accessible")}
                    </p>
                  </div>
                  {res.isVerified && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#0B766E] text-white uppercase shrink-0">
                      {lang === "bn" ? "যাচাইকৃত" : "Verified"}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Live Original Google Map Canvas */}
        <div className="relative flex-1 w-full h-full min-h-[380px]">
          {useJsApi ? (
            /* Rendered via Google Maps JS API when key is valid */
            <div ref={mapContainerRef} className="w-full h-full min-h-[380px]" />
          ) : (
            /* Rendered via Google Maps Embed (Original Google Map directly from Google) */
            <iframe
              src={embedUrl}
              title="Google Map of Dacope, Khulna Incident Sector"
              className="w-full h-full min-h-[380px] border-0"
              loading="lazy"
              allowFullScreen
            />
          )}

          {/* Floating Operational HUD on Map */}
          <div className="absolute bottom-3 left-3 bg-[#071520]/90 backdrop-blur-md border border-[#133446] rounded-xl p-2.5 text-xs text-[#DBE6E2] shadow-xl pointer-events-none max-w-xs hidden sm:block">
            <div className="flex items-center gap-2 mb-1">
              <Compass className="w-3.5 h-3.5 text-[#63DEC2]" />
              <span className="font-bold text-white text-[11px]">Dacope Disaster Sector</span>
            </div>
            <p className="text-[10px] text-[#DBE6E2]/70 leading-tight">
              Passur river tidal surge corridor. Coordinates verified for emergency logistics and accessible vehicle routing.
            </p>
          </div>

          {/* Active Target Chip */}
          {activeSelected && (
            <div className="absolute top-3 left-3 bg-[#0B766E]/95 backdrop-blur-md border border-[#63DEC2] rounded-xl px-3 py-1.5 text-xs text-white shadow-2xl flex items-center gap-2 animate-in fade-in duration-200">
              <MapPin className="w-4 h-4 text-[#63DEC2] animate-bounce" />
              <div>
                <p className="font-bold text-[11px] leading-none">{activeSelected.title}</p>
                <p className="text-[9px] text-[#DBE6E2] font-mono mt-0.5">
                  Target Centered ({activeSelected.lat.toFixed(4)}, {activeSelected.lng.toFixed(4)})
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  AlertTriangle,
  RotateCcw,
  Globe,
  Menu,
  X,
  Truck,
  CheckCircle2,
  Moon,
  Sun,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { useSyncExternalStore } from "react";

function subscribeTheme(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("shongjog_theme_change", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("shongjog_theme_change", callback);
    window.removeEventListener("storage", callback);
  };
}

function getThemeSnapshot(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  try {
    return localStorage.getItem("shongjog_theme") === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

function getThemeServerSnapshot(): "light" | "dark" {
  return "light";
}

export default function Navbar() {
  const pathname = usePathname();
  const { lang, t, setLang } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getThemeServerSnapshot);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    try {
      localStorage.setItem("shongjog_theme", next);
    } catch {}
    window.dispatchEvent(new Event("shongjog_theme_change"));
    if (next === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Handle escape key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  const toggleLanguage = () => {
    const newLang = lang === "en" ? "bn" : "en";
    setLang(newLang);
  };

  const handleResetDemo = async () => {
    if (confirm(t("reset_confirm"))) {
      setIsResetting(true);
      try {
        const res = await fetch("/api/demo/reset", { method: "POST" });
        if (res.ok) {
          setResetSuccess(true);
          setTimeout(() => {
            setResetSuccess(false);
            window.location.reload();
          }, 1000);
        }
      } catch (err) {
        console.error("Reset failed", err);
      } finally {
        setIsResetting(false);
      }
    }
  };

  // Professional Core Navigation Structure (Dynamic Language)
  const navLinks = [
    { href: "/", label: lang === "bn" ? "মূল পাতা" : "Overview" },
    { href: "/operations", label: lang === "bn" ? "কন্ট্রোল সেন্টার" : "Operations" },
    { href: "/resources", label: lang === "bn" ? "রিসোর্স রেজিস্ট্রি" : "Resources" },
    { href: "/responder", label: lang === "bn" ? "রেসপন্ডার" : "Responder" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0B1F2A] text-white border-b border-[#103946] shadow-sm">
      {/* Precision Telemetry Ticker */}
      <div className="bg-[#103946] px-4 py-1.5 text-xs border-b border-[#087B72]/40 flex items-center justify-between">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <span className="inline-flex items-center gap-1.5 bg-[#C94747] text-white font-bold px-2 py-0.5 rounded text-[10px] tracking-wider uppercase shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            {t("demo_badge")}
          </span>
          <span className="text-[#68DCC3] font-medium truncate text-xs flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#159B82] inline-block shrink-0" />
            {t("active_alert_banner")}
          </span>
        </div>

        {/* Quick System Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleResetDemo}
            disabled={isResetting}
            className="flex items-center gap-1.5 text-xs bg-white/5 hover:bg-white/10 active:scale-95 text-[#DCE6E2] hover:text-white px-3 py-1.5 min-h-[32px] rounded-lg border border-white/10 transition font-medium focus:outline-none focus:ring-2 focus:ring-[#68DCC3]"
            title="Reset database to synthetic demo baseline"
          >
            {resetSuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#68DCC3]" />
                <span className="text-[#68DCC3] font-semibold">{t("reset_success")}</span>
              </>
            ) : (
              <>
                <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? "animate-spin text-[#68DCC3]" : "text-[#DCE6E2]/70"}`} />
                <span className="hidden sm:inline">{isResetting ? t("resetting_demo") : t("reset_demo")}</span>
              </>
            )}
          </button>

          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 text-xs bg-[#087B72]/40 hover:bg-[#087B72] text-white px-3 py-1.5 min-h-[32px] rounded-lg border border-[#087B72] active:scale-95 transition font-semibold focus:outline-none focus:ring-2 focus:ring-[#68DCC3]"
            aria-label="Toggle language English or Bengali"
          >
            <Globe className="w-3.5 h-3.5 text-[#68DCC3]" />
            <span className="font-bold">{lang === "en" ? "বাংলা" : "English"}</span>
          </button>

          <button
            onClick={toggleTheme}
            className="flex items-center gap-1.5 text-xs bg-white/5 hover:bg-white/10 text-white px-2.5 py-1.5 min-h-[32px] rounded-lg border border-white/10 active:scale-95 transition font-medium focus:outline-none focus:ring-2 focus:ring-[#68DCC3]"
            aria-label="Toggle dark or light theme"
            title={theme === "light" ? "Switch to Dark Theme" : "Switch to Light Theme"}
          >
            {theme === "light" ? (
              <>
                <Moon className="w-3.5 h-3.5 text-[#68DCC3]" />
                <span className="hidden md:inline text-[11px]">{lang === "bn" ? "ডার্ক" : "Dark"}</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-[#ECAF42]" />
                <span className="hidden md:inline text-[11px]">{lang === "bn" ? "লাইট" : "Light"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Desktop & Tablet Navigation */}
      <nav className="max-w-[1240px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left: Custom Accessibility/Connectivity Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-[#68DCC3] rounded-xl p-1 -ml-1 transition"
        >
          {/* Custom Connected Shield Symbol */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#087B72] to-[#159B82] flex items-center justify-center text-white border border-[#68DCC3]/40 shadow-sm group-hover:scale-105 transition-transform">
            <svg
              className="w-5 h-5 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <circle cx="9" cy="11" r="1.5" fill="currentColor" />
              <circle cx="15" cy="11" r="1.5" fill="currentColor" />
              <path d="M9 11h6" />
              <path d="M12 8v6" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white group-hover:text-[#68DCC3] transition">
                {t("brand_name")}
              </span>
              <span className="text-[11px] bg-[#103946] text-[#68DCC3] px-1.5 py-0.5 rounded font-mono font-bold border border-[#087B72]/50">
                {lang === "bn" ? "SHONGJOG" : "সংযোগ"}
              </span>
            </div>
            <p className="text-[11px] text-[#DCE6E2]/70 leading-none truncate hidden sm:block mt-0.5 font-medium">
              {t("brand_tagline")}
            </p>
          </div>
        </Link>

        {/* Center: Primary Navigation Links */}
        <div className="hidden xl:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? "bg-[#103946] text-[#68DCC3] border border-[#087B72]/80"
                    : "text-[#DCE6E2]/90 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right: Primary Call to Action */}
        <div className="hidden xl:flex items-center gap-3">
          <Link
            href="/responder"
            className="text-xs font-semibold text-[#DCE6E2]/80 hover:text-white transition px-2 py-1"
          >
            {t("nav_responder")}
          </Link>

          <Link
            href="/request-help"
            className="btn-interactive inline-flex items-center gap-2 bg-[#C94747] hover:bg-[#b03838] text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition border border-white/20 shadow-sm"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{t("nav_request")}</span>
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <div className="xl:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 text-[#DCE6E2] hover:text-white hover:bg-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#68DCC3]"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-[#68DCC3]" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="xl:hidden bg-[#0B1F2A] border-b border-[#103946] px-5 pt-3 pb-6 space-y-2 shadow-2xl animate-in fade-in duration-150"
        >
          <div className="space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition ${
                    isActive
                      ? "bg-[#103946] text-[#68DCC3] border border-[#087B72]"
                      : "text-[#DCE6E2] hover:bg-white/5"
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <span className="w-2 h-2 rounded-full bg-[#68DCC3]" />}
                </Link>
              );
            })}

            <Link
              href="/responder"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-[#DCE6E2] hover:bg-white/5"
            >
              <span>{t("nav_responder")}</span>
              <Truck className="w-4 h-4 text-[#159B82]" />
            </Link>
          </div>

          <div className="pt-3 border-t border-[#103946]">
            <Link
              href="/request-help"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 bg-[#C94747] text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>{t("nav_request")}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

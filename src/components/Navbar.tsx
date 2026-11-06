"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LifeBuoy,
  AlertTriangle,
  RotateCcw,
  Globe,
  Menu,
  X,
  Radio,
  Truck,
  Building2,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { I18nLanguage, translations } from "@/lib/i18n";

export default function Navbar() {
  const pathname = usePathname();
  const [lang, setLang] = useState<I18nLanguage>("en");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("shongjog_lang") as I18nLanguage;
    if (saved && (saved === "en" || saved === "bn")) {
      setLang(saved);
    }
  }, []);

  const toggleLanguage = () => {
    const newLang = lang === "en" ? "bn" : "en";
    setLang(newLang);
    localStorage.setItem("shongjog_lang", newLang);
    window.dispatchEvent(new Event("shongjog_lang_change"));
  };

  const handleResetDemo = async () => {
    if (confirm("Reset the simulated scenario and clear all dynamic requests back to baseline?")) {
      setIsResetting(true);
      try {
        const res = await fetch("/api/demo/reset", { method: "POST" });
        if (res.ok) {
          setResetSuccess(true);
          setTimeout(() => {
            setResetSuccess(false);
            window.location.reload();
          }, 1200);
        }
      } catch (err) {
        console.error("Reset failed", err);
      } finally {
        setIsResetting(false);
      }
    }
  };

  const t = translations[lang];

  const navLinks = [
    { href: "/", label: t.nav_home, icon: LifeBuoy },
    { href: "/request-help", label: t.nav_request, icon: AlertTriangle, highlight: true },
    { href: "/operations", label: t.nav_operations, icon: Radio },
    { href: "/responder", label: t.nav_responder, icon: Truck },
    { href: "/resources", label: t.nav_resources, icon: Building2 },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#091E2C] text-white border-b border-[#103B48] shadow-md">
      {/* Alert Ticker Bar */}
      <div className="bg-[#103B48] px-4 py-1 text-xs border-b border-[#0B766E]/40 flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="inline-flex items-center gap-1 bg-[#D9534F] text-white font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider animate-pulse">
            <AlertTriangle className="w-3 h-3" />
            {t.demo_badge}
          </span>
          <span className="text-[#63DEC2] font-medium truncate">
            {t.active_alert_banner}
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleResetDemo}
            disabled={isResetting}
            className="flex items-center gap-1 text-[11px] bg-[#0B766E]/60 hover:bg-[#0B766E] text-white px-2 py-0.5 rounded transition focus:outline-none focus:ring-1 focus:ring-[#63DEC2]"
            title="Reset database to synthetic demo baseline"
          >
            {resetSuccess ? (
              <>
                <CheckCircle2 className="w-3 h-3 text-[#63DEC2]" />
                <span>Reset Done</span>
              </>
            ) : (
              <>
                <RotateCcw className={`w-3 h-3 ${isResetting ? "animate-spin" : ""}`} />
                <span className="hidden sm:inline">{t.reset_demo}</span>
              </>
            )}
          </button>
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 text-[11px] bg-white/10 hover:bg-white/20 text-[#63DEC2] px-2 py-0.5 rounded transition font-semibold"
            aria-label="Toggle language English or Bengali"
          >
            <Globe className="w-3 h-3" />
            <span>{lang === "en" ? "বাংলা" : "English"}</span>
          </button>
        </div>
      </div>

      {/* Main Nav Bar */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-[#63DEC2] rounded-lg p-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0B766E] to-[#159B82] flex items-center justify-center text-white shadow-inner border border-[#63DEC2]/30">
            <ShieldCheck className="w-6 h-6 text-[#63DEC2]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight text-white group-hover:text-[#63DEC2] transition">
                SHONGJOG
              </span>
              <span className="text-xs bg-[#0B766E] text-[#63DEC2] px-1.5 py-0.2 rounded font-mono font-medium">
                সংযোগ
              </span>
            </div>
            <p className="text-[11px] text-[#DBE6E2]/70 leading-none truncate hidden sm:block">
              {t.brand_tagline}
            </p>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  link.highlight
                    ? "bg-[#D9534F] hover:bg-[#c4413d] text-white shadow-sm ml-2"
                    : isActive
                    ? "bg-[#103B48] text-[#63DEC2] border border-[#0B766E]"
                    : "text-[#DBE6E2] hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#DBE6E2] hover:text-white hover:bg-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#63DEC2]"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#091E2C] border-b border-[#103B48] px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-base font-medium transition ${
                  link.highlight
                    ? "bg-[#D9534F] text-white"
                    : isActive
                    ? "bg-[#103B48] text-[#63DEC2]"
                    : "text-[#DBE6E2] hover:bg-white/5"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}

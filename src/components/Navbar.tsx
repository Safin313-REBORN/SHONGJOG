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
    <header className="sticky top-0 z-50 bg-[#091E2C] text-white border-b border-[#103B48]">
      {/* Alert Ticker Bar */}
      <div className="bg-[#103B48] px-4 py-1.5 text-xs border-b border-[#0B766E]/30 flex items-center justify-between">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <span className="inline-flex items-center gap-1.5 bg-[#D9534F] text-white font-semibold px-2 py-0.5 rounded text-[10px] tracking-wider uppercase shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            {t.demo_badge}
          </span>
          <span className="text-[#63DEC2] font-medium truncate text-xs">
            {t.active_alert_banner}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleResetDemo}
            disabled={isResetting}
            className="flex items-center gap-1.5 text-[11px] bg-white/5 hover:bg-white/10 text-[#DBE6E2] hover:text-white px-2.5 py-1 rounded-md border border-white/10 transition focus:outline-none focus:ring-1 focus:ring-[#63DEC2]"
            title="Reset database to synthetic demo baseline"
          >
            {resetSuccess ? (
              <>
                <CheckCircle2 className="w-3 h-3 text-[#63DEC2]" />
                <span className="text-[#63DEC2] font-medium">Reset Complete</span>
              </>
            ) : (
              <>
                <RotateCcw className={`w-3 h-3 ${isResetting ? "animate-spin" : ""}`} />
                <span className="hidden sm:inline font-medium">{t.reset_demo}</span>
              </>
            )}
          </button>
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 text-[11px] bg-[#0B766E]/40 hover:bg-[#0B766E] text-white px-2.5 py-1 rounded-md border border-[#0B766E]/60 transition font-semibold"
            aria-label="Toggle language English or Bengali"
          >
            <Globe className="w-3 h-3 text-[#63DEC2]" />
            <span>{lang === "en" ? "বাংলা" : "English"}</span>
          </button>
        </div>
      </div>

      {/* Main Nav Bar */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-15 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group focus:outline-none focus:ring-1 focus:ring-[#63DEC2] rounded-lg p-1">
          <div className="w-9 h-9 rounded-lg bg-[#0B766E] flex items-center justify-center text-white border border-[#159B82]">
            <ShieldCheck className="w-5 h-5 text-[#63DEC2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-white group-hover:text-[#63DEC2] transition">
                SHONGJOG
              </span>
              <span className="text-[11px] bg-[#103B48] text-[#63DEC2] px-1.5 py-0.5 rounded font-mono font-medium border border-[#0B766E]/40">
                সংযোগ
              </span>
            </div>
            <p className="text-[11px] text-[#DBE6E2]/70 leading-none truncate hidden sm:block mt-0.5">
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
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition ${
                  link.highlight
                    ? "bg-[#D9534F] hover:bg-[#c4413d] text-white font-semibold ml-2 shadow-sm"
                    : isActive
                    ? "bg-[#103B48] text-[#63DEC2] border border-[#0B766E]/60"
                    : "text-[#DBE6E2] hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#DBE6E2] hover:text-white hover:bg-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#63DEC2]"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
                className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition ${
                  link.highlight
                    ? "bg-[#D9534F] text-white font-semibold"
                    : isActive
                    ? "bg-[#103B48] text-[#63DEC2] border border-[#0B766E]/60"
                    : "text-[#DBE6E2] hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}

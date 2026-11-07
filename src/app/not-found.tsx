"use client";

import Link from "next/link";
import { AlertCircle, ArrowLeft, Home } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export default function NotFound() {
  const { lang, t } = useTranslation();

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 py-12">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 rounded-2xl border border-[#DCE6E2] shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-[#C94747]/10 text-[#C94747] border border-[#C94747]/30 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div>
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#087B72]">
            {lang === "bn" ? "ভুল পৃষ্ঠা নির্দেশিকা" : "HTTP 404 ROUTE EXCEPTION"}
          </span>
          <h1 className="text-2xl font-black text-[#152C35] mt-1 tracking-tight">
            {t("error_404_title")}
          </h1>
          <p className="text-xs text-[#65777B] mt-2 leading-relaxed">
            {t("error_404_desc")}
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="btn-interactive inline-flex items-center justify-center gap-2 bg-[#087B72] hover:bg-[#159B82] text-white px-5 py-3 rounded-xl text-xs font-bold transition shadow-sm"
          >
            <Home className="w-4 h-4" />
            <span>{t("btn_return_home")}</span>
          </Link>
          <Link
            href="/operations"
            className="btn-interactive inline-flex items-center justify-center gap-2 bg-[#F7F9F8] hover:bg-[#EDF3F1] text-[#152C35] border border-[#DCE6E2] px-5 py-3 rounded-xl text-xs font-bold transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{lang === "bn" ? "কন্ট্রোল সেন্টার" : "Operations Center"}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}


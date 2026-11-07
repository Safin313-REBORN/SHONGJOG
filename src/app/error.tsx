"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { lang, t } = useTranslation();

  useEffect(() => {
    console.error("Application error boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 py-12">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 rounded-2xl border border-[#DCE6E2] shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-[#D99A32]/10 text-[#D99A32] border border-[#D99A32]/30 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div>
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#C94747]">
            {lang === "bn" ? "সিস্টেম ত্রুটি অডিট" : "RUNTIME EXCEPTION LOGGED"}
          </span>
          <h1 className="text-2xl font-black text-[#152C35] mt-1 tracking-tight">
            {t("error_500_title")}
          </h1>
          <p className="text-xs text-[#65777B] mt-2 leading-relaxed">
            {t("error_500_desc")}
          </p>
          {error.digest && (
            <p className="text-[10px] font-mono text-[#65777B]/70 mt-1">
              Digest: {error.digest}
            </p>
          )}
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="btn-interactive inline-flex items-center justify-center gap-2 bg-[#087B72] hover:bg-[#159B82] text-white px-5 py-3 rounded-xl text-xs font-bold transition shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{lang === "bn" ? "পুনরায় চেষ্টা করুন" : "Retry Operation"}</span>
          </button>
          <Link
            href="/"
            className="btn-interactive inline-flex items-center justify-center gap-2 bg-[#F7F9F8] hover:bg-[#EDF3F1] text-[#152C35] border border-[#DCE6E2] px-5 py-3 rounded-xl text-xs font-bold transition"
          >
            <Home className="w-4 h-4" />
            <span>{t("btn_return_home")}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}


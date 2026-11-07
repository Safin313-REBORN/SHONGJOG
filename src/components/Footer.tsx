"use client";

import Link from "next/link";
import { Shield, ExternalLink, Heart, AlertCircle, FileText } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export default function Footer() {
  const { lang, t } = useTranslation();

  return (
    <footer className="bg-[#091E2C] text-[#DBE6E2] border-t border-[#103B48] mt-auto">
      {/* Disclaimer Banner */}
      <div className="bg-[#103B48]/80 border-b border-[#0B766E]/30 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-start gap-3 text-xs text-[#DBE6E2]">
          <AlertCircle className="w-4 h-4 text-[#ECAF42] shrink-0 mt-0.5" />
          <p>
            <strong className="text-white">{t("footer_disclosure_title")}</strong>{" "}
            {t("footer_disclosure_text")}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Purpose */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#0B766E] flex items-center justify-center text-white">
                <Shield className="w-5 h-5 text-[#63DEC2]" />
              </div>
              <span className="font-bold text-lg text-white">{t("brand_name")}</span>
            </div>
            <p className="text-xs text-[#60747A] leading-relaxed">
              &ldquo;{t("motto")}&rdquo;
            </p>
            <p className="text-xs text-[#DBE6E2]/80 leading-relaxed">
              {lang === "bn"
                ? "প্রতিবন্ধী ব্যক্তি ও প্রবীণদের নিরাপদ স্থানান্তরের জন্য আগাম সতর্কবার্তা ও যাচাইকৃত অ্যাক্সেসিবল লজিস্টিকসের মধ্যকার সেতুবন্ধন।"
                : "Bridging the last-mile gap between emergency warnings and verified, accessible evacuation for persons with disabilities and older adults."}
            </p>
          </div>

          {/* Core Modules */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              {t("footer_core_modules")}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/request-help" className="hover:text-[#63DEC2] transition">
                  {lang === "bn" ? "সহায়তার আবেদন পোর্টাল" : "Community Assistance Portal"}
                </Link>
              </li>
              <li>
                <Link href="/operations" className="hover:text-[#63DEC2] transition">
                  {lang === "bn" ? "সমন্বয়কারী কন্ট্রোল সেন্টার" : "Coordinator Operations Center"}
                </Link>
              </li>
              <li>
                <Link href="/responder" className="hover:text-[#63DEC2] transition">
                  {lang === "bn" ? "মাঠপর্যায়ের রেসপন্ডার অ্যাপ" : "Field Responder Mobile App"}
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-[#63DEC2] transition">
                  {lang === "bn" ? "আশ্রয় ও সম্পদ রেজিস্ট্রি" : "Shelter & Vehicle Registry"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Research & Evidence Base */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              {t("footer_evidence")}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://www.undrr.org/report/2023-gobal-survey-report-on-persons-with-disabilities-and-disasters"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#63DEC2] transition inline-flex items-center gap-1"
                >
                  {lang === "bn" ? "ইউএনডিআরআর ২০২৩ বৈশ্বিক জরিপ" : "UNDRR 2023 Global Survey"} <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.preventionweb.net/publication/documents-and-publications/study-disability-inclusive-and-gender-responsive-early"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#63DEC2] transition inline-flex items-center gap-1"
                >
                  {lang === "bn" ? "বাংলাদেশ সিডিডি ডিজেবিলিটি ইডব্লিউএস" : "Bangladesh Disability EWS (CDD)"} <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://pmc.ncbi.nlm.nih.gov/articles/PMC12997332/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#63DEC2] transition inline-flex items-center gap-1"
                >
                  {lang === "bn" ? "এনআইএইচ দুর্যোগ ও অ্যাক্সেসিবিলিটি" : "NIH Extreme Weather & Disability"} <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://rapid.ddm.gov.bd/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#63DEC2] transition inline-flex items-center gap-1"
                >
                  {lang === "bn" ? "বাংলাদেশ ডিডিএম এওয়ার সিস্টেম" : "Bangladesh DDM AWARE"} <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Technology & Standards */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              {t("footer_standards")}
            </h4>
            <ul className="space-y-2 text-xs text-[#DBE6E2]/80">
              <li className="flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-[#63DEC2]" />
                {lang === "bn" ? "ডব্লিউসিএজি ২.২ এএ স্ট্যান্ডার্ড" : "WCAG 2.2 AA Compliance Target"}
              </li>
              <li>{lang === "bn" ? "কঠোর তথ্য সর্বনিম্নকরণ নীতি" : "Strict Data Minimization"}</li>
              <li>{lang === "bn" ? "দায়িত্বশীল মানবিক তত্ত্বাবধান" : "Accountable Human-in-the-Loop"}</li>
              <li>{lang === "bn" ? "অফলাইন ইনডেক্সডডিবি পিডব্লিউএ ড্রাফট" : "Offline IndexedDB PWA Drafts"}</li>
            </ul>
          </div>
        </div>

        {/* Bottom credits */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-[#60747A] gap-4">
          <p>{t("footer_rights")}</p>
          <p className="flex items-center gap-1 text-[#DBE6E2]">
            <span>{t("footer_tagline")}</span>
            <Heart className="w-3.5 h-3.5 text-[#D9534F] fill-current" />
          </p>
        </div>
      </div>
    </footer>
  );
}

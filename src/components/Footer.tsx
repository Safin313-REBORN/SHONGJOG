import Link from "next/link";
import { Shield, ExternalLink, Heart, AlertCircle, FileText } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#091E2C] text-[#DBE6E2] border-t border-[#103B48] mt-auto">
      {/* Disclaimer Banner */}
      <div className="bg-[#103B48]/80 border-b border-[#0B766E]/30 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-start gap-3 text-xs text-[#DBE6E2]">
          <AlertCircle className="w-4 h-4 text-[#ECAF42] shrink-0 mt-0.5" />
          <p>
            <strong className="text-white">Research & Simulation Disclosure:</strong> SHONGJOG is an AI-powered accessibility research and engineering prototype developed for the{" "}
            <strong>CTRL-V 2026 Hackathon</strong>. It functions as a complementary coordination layer and does not claim to replace official government early-warning alerts or national emergency services (e.g., Bangladesh National Emergency Hotline <strong>999</strong> or CPP volunteers). All demo personas and contact details are synthetic.
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
              <span className="font-bold text-lg text-white">SHONGJOG</span>
            </div>
            <p className="text-xs text-[#60747A] leading-relaxed">
              &ldquo;A warning is only useful when everyone can act.&rdquo;
            </p>
            <p className="text-xs text-[#DBE6E2]/80 leading-relaxed">
              Bridging the last-mile gap between emergency warnings and verified, accessible evacuation for persons with disabilities and older adults.
            </p>
          </div>

          {/* Core Modules */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Core Modules
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/request-help" className="hover:text-[#63DEC2] transition">
                  Community Assistance Portal
                </Link>
              </li>
              <li>
                <Link href="/operations" className="hover:text-[#63DEC2] transition">
                  Coordinator Operations Center
                </Link>
              </li>
              <li>
                <Link href="/responder" className="hover:text-[#63DEC2] transition">
                  Field Responder Mobile App
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-[#63DEC2] transition">
                  Shelter & Vehicle Registry
                </Link>
              </li>
            </ul>
          </div>

          {/* Research & Evidence Base */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Evidence & References
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://www.undrr.org/report/2023-gobal-survey-report-on-persons-with-disabilities-and-disasters"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#63DEC2] transition inline-flex items-center gap-1"
                >
                  UNDRR 2023 Global Survey <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.preventionweb.net/publication/documents-and-publications/study-disability-inclusive-and-gender-responsive-early"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#63DEC2] transition inline-flex items-center gap-1"
                >
                  Bangladesh Disability EWS (CDD) <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://pmc.ncbi.nlm.nih.gov/articles/PMC12997332/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#63DEC2] transition inline-flex items-center gap-1"
                >
                  NIH Extreme Weather & Disability <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://rapid.ddm.gov.bd/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#63DEC2] transition inline-flex items-center gap-1"
                >
                  Bangladesh DDM AWARE <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Technology & Standards */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Accessibility & Ethics
            </h4>
            <ul className="space-y-2 text-xs text-[#DBE6E2]/80">
              <li className="flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-[#63DEC2]" />
                WCAG 2.2 AA Compliance Target
              </li>
              <li>Strict Data Minimization</li>
              <li>Accountable Human-in-the-Loop</li>
              <li>Zero Silent Fallbacks</li>
              <li>Offline IndexedDB PWA Drafts</li>
            </ul>
          </div>
        </div>

        {/* Bottom credits */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-[#60747A] gap-4">
          <p>© 2026 SHONGJOG Team — Built with dedication for the CTRL-V 2026 Hackathon.</p>
          <p className="flex items-center gap-1 text-[#DBE6E2]">
            <span>Designed for equity and dignity in crisis</span>
            <Heart className="w-3.5 h-3.5 text-[#D9534F] fill-current" />
          </p>
        </div>
      </div>
    </footer>
  );
}

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Phone, Mail, MapPin, ExternalLink, Info } from 'lucide-react';
import { TermsModal } from './TermsModal';

export const Footer: React.FC = () => {
  const [modalType, setModalType] = useState<'terms' | 'privacy' | 'contact' | null>(null);

  return (
    <>
      <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-auto">
        {/* Compliance Banner */}
        <div className="bg-slate-950/80 border-b border-slate-800/80 py-4 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-slate-400">
            <div className="flex items-start gap-2.5">
              <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong className="text-slate-200">Regulatory & Prototype Notice:</strong> This is a product prototype. The “Credit Readiness Score” is an internal guidance score, not a credit rating issued by a registered credit rating agency. It must not claim to guarantee a loan, financing, credit limit, business outcome, or lender approval.
              </p>
            </div>
            <div className="whitespace-nowrap text-amber-400/90 font-mono text-[11px] bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
              Demo Mode · Simulated Data
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Col 1: Brand & Purpose */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <div className="w-6 h-6 rounded bg-teal-600 text-white flex items-center justify-center text-xs font-black">
                  ₹
                </div>
                <span>SME Readiness Portal India</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Empowering micro, small, and medium enterprises across India to self-assess creditworthiness, verify documentation, and strengthen readiness for commercial lending discussions.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs text-emerald-400 font-medium">
                <ShieldCheck className="w-4 h-4" />
                <span>Simulated Secure Local Storage</span>
              </div>
            </div>

            {/* Col 2: Services */}
            <div>
              <h4 className="text-xs font-semibold text-white tracking-wider uppercase mb-3">
                Readiness Solutions
              </h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>Credit Readiness Score (₹10,000)</li>
                <li>Business Grading Assessment (₹5,000)</li>
                <li>Verified Business Profile (₹5,000)</li>
                <li>Due Diligence Review Package (₹12,000)</li>
                <li>Pre-lending Documentation Audit</li>
              </ul>
            </div>

            {/* Col 3: Legal & Regulatory */}
            <div>
              <h4 className="text-xs font-semibold text-white tracking-wider uppercase mb-3">
                Policies & Governance
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button
                    onClick={() => setModalType('terms')}
                    className="text-slate-400 hover:text-white transition-colors underline-offset-4 hover:underline"
                  >
                    Terms of Use
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setModalType('privacy')}
                    className="text-slate-400 hover:text-white transition-colors underline-offset-4 hover:underline"
                  >
                    Privacy Notice & DPDP Alignment
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setModalType('terms')}
                    className="text-slate-400 hover:text-white transition-colors underline-offset-4 hover:underline"
                  >
                    Guidance Score Methodology
                  </button>
                </li>
                <li>
                  <span className="text-slate-500">Not a SEBI/RBI Credit Rating Agency</span>
                </li>
              </ul>
            </div>

            {/* Col 4: Support Contact */}
            <div>
              <h4 className="text-xs font-semibold text-white tracking-wider uppercase mb-3">
                Help & Support Desk
              </h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span className="font-mono text-slate-200">+91 1800 123 4567</span> (Toll-Free)
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span>support@sme-readiness.in</span>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                  <span>Sector 44, Institutional Area, Gurugram, Haryana 122003</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <p>
              © 2026 SME Readiness Portal India. Built for MSME enablement.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-center sm:text-right">
              <Link
                to="/internal/evals"
                className="text-[11px] text-slate-400 hover:text-white underline underline-offset-2 transition-colors"
              >
                Internal testing
              </Link>
              <span className="text-slate-700">·</span>
              <p>Demo application — no external rating, credit decision, or payment is issued.</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal for Terms / Privacy / Contact */}
      {modalType && (
        <TermsModal
          initialTab={modalType}
          onClose={() => setModalType(null)}
        />
      )}
    </>
  );
};

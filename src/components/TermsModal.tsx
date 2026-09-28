import React, { useState } from 'react';
import { X, ShieldCheck, FileText, Phone, AlertCircle } from 'lucide-react';

interface TermsModalProps {
  initialTab?: 'terms' | 'privacy' | 'contact';
  onClose: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({
  initialTab = 'terms',
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy' | 'contact'>(initialTab);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-700" />
            <h3 className="text-base font-bold text-slate-900">
              {activeTab === 'terms' && 'Terms of Use & Regulatory Disclaimer'}
              {activeTab === 'privacy' && 'Privacy Notice & Data Protection'}
              {activeTab === 'contact' && 'Support & Contact Information'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex border-b border-slate-200 px-6 gap-6 text-sm font-medium">
          <button
            onClick={() => setActiveTab('terms')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'terms'
                ? 'border-teal-700 text-teal-800 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Terms of Use
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'privacy'
                ? 'border-teal-700 text-teal-800 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Privacy Notice
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'contact'
                ? 'border-teal-700 text-teal-800 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Help & Contact
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs leading-relaxed text-slate-600">
          {activeTab === 'terms' && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Crucial Prototype Disclaimer:</strong> This portal is a demonstration tool. The “Credit Readiness Score” provided is purely an internal self-assessment and educational indicator. It is NOT a credit rating governed by SEBI (Credit Rating Agencies) Regulations, 1999, nor does it guarantee a loan, credit sanction, overdraft limit, or favorable terms from any bank, NBFC, or financial institution.
                </p>
              </div>

              <h4 className="font-bold text-slate-900 text-sm">1. Purpose and Scope</h4>
              <p>
                The SME Readiness Portal India provides Indian MSMEs with an automated framework to review corporate documents, test completeness of compliance filings (PAN, GSTIN, Bank Statements), and generate diagnostic guidance before engaging in formal credit negotiations.
              </p>

              <h4 className="font-bold text-slate-900 text-sm">2. Document Submissions & Prototype Boundaries</h4>
              <p>
                In this prototype version, uploaded files are processed strictly within the local client-side session of your browser. No files are uploaded to external cloud storage servers or transmitted across third-party networks.
              </p>

              <h4 className="font-bold text-slate-900 text-sm">3. No Lending or Advisory Guarantee</h4>
              <p>
                Generation of any report or score does not constitute financial, investment, legal, or commercial lending advice. Lenders maintain independent risk discretion under Reserve Bank of India (RBI) prudential norms.
              </p>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <div className="p-3 bg-teal-50 rounded-lg border border-teal-200 text-teal-900 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                <p>
                  <strong>Local Client-Side Storage:</strong> Your privacy is paramount. This prototype stores business information, KYC metadata, and file summaries strictly inside your browser’s localStorage.
                </p>
              </div>

              <h4 className="font-bold text-slate-900 text-sm">1. Information Collected</h4>
              <p>
                We capture business identification details (Legal Name, Trade Name, Constitution, PAN, GSTIN, Registered Address) solely to compile your draft readiness summary.
              </p>

              <h4 className="font-bold text-slate-900 text-sm">2. Compliance with Indian DPDP Norms</h4>
              <p>
                Data handling aligns with principles of the Digital Personal Data Protection (DPDP) Act, 2023. You have full control to inspect, update, or purge all local data instantly using the &quot;Reset Demo&quot; control located in the top bar and dashboard.
              </p>

              <h4 className="font-bold text-slate-900 text-sm">3. Financial Information Safeguard</h4>
              <p>
                No real bank credentials, net banking passwords, OTPs, or CVVs are ever requested or stored. Payment simulations operate entirely client-side without processing real currency.
              </p>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-sm">Support Desk for Indian MSMEs</h4>
              <p>
                If you have questions regarding the credit readiness checklist, document formats, or prototype navigation, our enterprise support team is available during standard Indian banking hours (Monday to Friday, 9:30 AM to 6:00 PM IST).
              </p>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-slate-800">
                  <Phone className="w-4 h-4 text-teal-700" />
                  <span className="font-semibold">Toll-Free Helpline:</span> +91 1800 123 4567
                </div>
                <div className="text-slate-600">
                  <span className="font-semibold">Email:</span> support@sme-readiness.in
                </div>
                <div className="text-slate-600">
                  <span className="font-semibold">Physical Desk:</span> 4th Floor, MSME Hub, Institutional Area, Sector 44, Gurugram 122003, Haryana
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 rounded-b-xl flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Understood & Close
          </button>
        </div>
      </div>
    </div>
  );
};

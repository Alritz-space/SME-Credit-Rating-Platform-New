import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Stepper } from '../components/Stepper';
import { PRODUCTS } from '../utils/constants';
import {
  ShieldCheck,
  Download,
  Printer,
  ArrowLeft,
  Building2,
  FileCheck2,
  AlertTriangle,
  Info,
  CheckCircle2,
  FileText,
  Clock,
  ExternalLink,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { ReceiptModal } from '../components/ReceiptModal';
import { BusinessGradingReport } from '../components/BusinessGradingReport';
import { VerifiedBusinessProfileReport } from '../components/VerifiedBusinessProfileReport';
import { DueDiligenceReport } from '../components/DueDiligenceReport';

export const ApplicationReportPage: React.FC = () => {
  const { state, navigate } = useApp();
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);

  // If not paid, redirect or show locked gate
  const isPaid = state.payment?.status === 'successful' || state.reportUnlocked;

  const handlePrint = () => {
    window.print();
  };

  const activeProductIds =
    state.payment?.paidProductIds && state.payment.paidProductIds.length > 0
      ? state.payment.paidProductIds
      : state.selectedProductIds;

  const selectedProducts = PRODUCTS.filter((p) =>
    activeProductIds.includes(p.id)
  );

  const hasBusinessGrading = activeProductIds.includes('business-grading');
  const hasVerifiedProfile = activeProductIds.includes('verified-business-profile');
  const hasDueDiligence = activeProductIds.includes('due-diligence-review');
  const hasAdditionalReports =
    activeProductIds.length > 1 &&
    (hasBusinessGrading || hasVerifiedProfile || hasDueDiligence);

  const issueDate = state.payment?.timestamp
    ? new Date(state.payment.timestamp).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

  if (!isPaid) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <main className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Payment Required to Access Draft Report
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
            Please complete the simulated payment step before accessing your internal Credit Readiness Score and diagnostic observations.
          </p>
          <div className="pt-4">
            <button
              onClick={() => navigate('/application/payment')}
              className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-sm font-semibold shadow-sm transition-all"
            >
              Go to Payment Step
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-20 sm:pb-12">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Top Control Bar (hidden during print) */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
          <div>
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider font-mono">
              Step E · Assessment Outcome
            </span>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
              Credit Readiness Guidance Report
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Internal assessment summary for {state.business.legalName}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 print-allow"
            >
              <Printer className="w-4 h-4" />
              <span>Download draft report as PDF</span>
            </button>

            <button
              onClick={() => setReceiptModalOpen(true)}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4" />
              <span>Download payment receipt</span>
            </button>

            <button
              onClick={() => navigate('/dashboard')}
              className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
            >
              Return to dashboard
            </button>
          </div>
        </div>

        {/* Printable Report Document Container */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-10 space-y-8 print:p-0 print:border-none print:shadow-none">
          {/* Document Header & Metadata */}
          <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                  <span className="text-amber-500 font-extrabold mr-0.5">₹</span>
                  <span className="text-teal-400">S</span>
                </div>
                <span className="text-base font-bold text-slate-900 tracking-tight">
                  SME Readiness Portal India
                </span>
                <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-teal-50 text-teal-800 border border-teal-200 ml-2">
                  Status: Draft report available
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {state.business.legalName}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Trade Name: <span className="font-semibold text-slate-700">{state.business.tradeName}</span> ·{' '}
                Constitution: <span className="font-semibold text-slate-700">{state.business.constitution}</span>
              </p>
              <p className="text-xs text-slate-500">
                Registered Office: {state.business.addressLine1}, {state.business.city}, {state.business.state} – {state.business.pinCode}
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-1.5 md:text-right shrink-0">
              <div>
                <span className="text-slate-500 text-[11px] block">Application Reference:</span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {state.referenceNumber}
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">Issue Date:</span>
                <span className="text-slate-800 font-medium">{issueDate}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">Corporate Tax IDs:</span>
                <span className="font-mono text-slate-700 text-[11px]">
                  PAN: {state.business.pan} · GSTIN: {state.business.gstin || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Selected Services Strip */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
              Selected Services & Review Scope:
            </span>
            <div className="flex flex-wrap gap-2">
              {selectedProducts.map((p) => (
                <span
                  key={p.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-white border border-slate-200 text-slate-800 shadow-2xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                  <span>{p.title}</span>
                </span>
              ))}
            </div>
          </div>

          {/* PRIMARY REPORT CARD: Score Gauge & Band Display */}
          <div className="rounded-2xl border-2 border-teal-700/80 bg-gradient-to-br from-teal-900 via-slate-900 to-slate-950 text-white p-6 sm:p-8 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Score Display (Left) */}
              <div className="lg:col-span-4 text-center lg:text-left space-y-2 border-b lg:border-b-0 lg:border-r border-slate-800 pb-6 lg:pb-0 lg:pr-6">
                <span className="text-xs font-semibold text-teal-300 uppercase tracking-wider block font-mono">
                  Internal Guidance Metric
                </span>
                <div className="flex items-baseline justify-center lg:justify-start gap-1">
                  <span className="text-5xl sm:text-6xl font-black tracking-tight text-white font-mono">
                    72
                  </span>
                  <span className="text-2xl font-bold text-slate-400 font-mono">
                    /100
                  </span>
                </div>
                <div className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Status: Developing readiness
                </div>
              </div>

              {/* Explanation & Bands (Right) */}
              <div className="lg:col-span-8 space-y-4">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Assessment Evaluation
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    “Your business has submitted a complete core profile and the required documents. Strengthening financial evidence, cash-flow records, and verification details may improve your credit readiness.”
                  </p>
                </div>

                {/* Score Bands */}
                <div className="pt-2 border-t border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-400 block mb-2">
                    Standard Credit Readiness Score Bands:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700">
                      <span className="font-mono font-bold text-emerald-400 block">
                        80–100
                      </span>
                      <span className="text-slate-300 text-[11px] font-semibold">
                        Strong readiness
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/50 ring-1 ring-amber-500/40">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-amber-400">
                          60–79
                        </span>
                        <span className="text-[9px] uppercase font-bold text-amber-300 bg-amber-900/60 px-1.5 py-0.5 rounded">
                          Current
                        </span>
                      </div>
                      <span className="text-slate-100 text-[11px] font-semibold">
                        Developing readiness
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700">
                      <span className="font-mono font-bold text-rose-400 block">
                        Below 60
                      </span>
                      <span className="text-slate-300 text-[11px] font-semibold">
                        Needs attention
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* REPORT SUMMARY CARDS (4 Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[11px] font-medium text-slate-500 block">
                Business Profile
              </span>
              <p className="text-xl font-black text-slate-900 font-mono">86%</p>
              <p className="text-[11px] text-teal-800 font-semibold">
                Completeness: High
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[11px] font-medium text-slate-500 block">
                Document Submission
              </span>
              <p className="text-xl font-black text-emerald-800 font-mono">Complete</p>
              <p className="text-[11px] text-slate-600">
                {state.documents.length} verified files
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[11px] font-medium text-slate-500 block">
                Financial Information
              </span>
              <p className="text-xl font-black text-amber-800 font-mono">Under review</p>
              <p className="text-[11px] text-slate-600">
                6-mo cash flow statements
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[11px] font-medium text-slate-500 block">
                Verification Status
              </span>
              <p className="text-xl font-black text-teal-900 font-mono">Initial</p>
              <p className="text-[11px] text-slate-600">
                Checks completed
              </p>
            </div>
          </div>

          {/* OBSERVATIONS SECTION */}
          <div className="border border-slate-200 rounded-xl p-6 bg-white space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-teal-700" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Key Diagnostic Observations
              </h3>
            </div>

            <ul className="space-y-3 text-xs text-slate-700">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Business Profile & Identification:</strong> Core registration information (PAN {state.business.pan}, GSTIN {state.business.gstin || 'exempt'}, incorporation dated {state.business.incorporationDate}) submitted and cross-checked against standard corporate filings.
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Supporting Operational Evidence:</strong> Supporting financial and operational documents (banking statements, facility photos, and GST REG-06) received for review.
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Enhancement Opportunity:</strong> Additional financial verification may improve the readiness score. Submitting continuous 12-month audited GST returns and detailed cash-flow statements can elevate readiness to the 80+ strong band.
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <TrendingUp className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                <div>
                  <strong>Lender Engagement Utility:</strong> The score is intended to help the business prepare for conversations with lenders or partners by highlighting data gaps before formal underwriting.
                </div>
              </li>
            </ul>
          </div>

          {/* ADDITIONAL REPORTS SECTION WHEN MULTIPLE PRODUCTS ARE SELECTED */}
          {hasAdditionalReports && (
            <div className="space-y-6 pt-2">
              <div className="border-b border-slate-200 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700 font-mono">
                  Multi-Product Package Inclusion
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  Additional Selected Diagnostic Reports ({selectedProducts.length} Services Enrolled)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Detailed evaluations for supplementary verification modules included in your package.
                </p>
              </div>

              {hasBusinessGrading && (
                <div className="print-page-break">
                  <BusinessGradingReport state={state} issueDate={issueDate} />
                </div>
              )}

              {hasVerifiedProfile && (
                <div className="print-page-break">
                  <VerifiedBusinessProfileReport state={state} issueDate={issueDate} />
                </div>
              )}

              {hasDueDiligence && (
                <div className="print-page-break">
                  <DueDiligenceReport state={state} issueDate={issueDate} />
                </div>
              )}
            </div>
          )}

          {/* UPLOADED EVIDENCE INDEX TABLE */}
          <div className="border border-slate-200 rounded-xl p-6 bg-white space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              Submitted Document Repository
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-left">
                    <th className="py-2">Category</th>
                    <th className="py-2">Document Name</th>
                    <th className="py-2">Type</th>
                    <th className="py-2 text-right">Verification Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {state.documents.map((doc) => (
                    <tr key={doc.id}>
                      <td className="py-2.5 font-medium text-slate-900 capitalize">
                        {doc.categoryId.replace('_', ' ')}
                      </td>
                      <td className="py-2.5 text-slate-700 font-mono">
                        {doc.fileName}
                      </td>
                      <td className="py-2.5 text-slate-500 uppercase text-[10px]">
                        {doc.fileType.split('/')[1] || 'FILE'}
                      </td>
                      <td className="py-2.5 text-right">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Received
                        </span>
                      </td>
                    </tr>
                  ))}
                  {state.documents.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-slate-400 italic">
                        No documents recorded in local storage.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* REQUIRED DISCLAIMER (Explicit exact prompt wording) */}
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="block text-amber-900 mb-0.5">
                Statutory Product Notice:
              </strong>
              “This draft shows an internal Credit Readiness Score for guidance only. It is not an external credit rating, credit opinion, lending decision, or loan approval.”
            </div>
          </div>

          {/* Report Footer Meta */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
            <span>Generated via SME Readiness Portal India · Local Diagnostic Prototype</span>
            <span className="font-mono">Reference: {state.referenceNumber}</span>
          </div>
        </div>

        {/* Bottom Actions Bar (hidden in print) */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 no-print">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to dashboard</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setReceiptModalOpen(true)}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download payment receipt</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-md transition-all flex items-center gap-2 print-allow"
            >
              <Printer className="w-4 h-4" />
              <span>Download draft report as PDF</span>
            </button>
          </div>
        </div>
      </main>

      {/* Payment Receipt Modal */}
      {receiptModalOpen && (
        <ReceiptModal onClose={() => setReceiptModalOpen(false)} />
      )}
    </div>
  );
};

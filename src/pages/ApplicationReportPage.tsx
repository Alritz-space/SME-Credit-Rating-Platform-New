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
  HelpCircle,
  MessageSquare,
  Edit3,
  X,
  Send,
  Calculator,
} from 'lucide-react';
import { ReceiptModal } from '../components/ReceiptModal';
import { BusinessGradingReport } from '../components/BusinessGradingReport';
import { VerifiedBusinessProfileReport } from '../components/VerifiedBusinessProfileReport';
import { DueDiligenceReport } from '../components/DueDiligenceReport';
import { maskEmail, maskGstin, maskMobile, maskPan } from '../utils/masking';
import {
  checkReportText,
  REQUIRED_LEGAL_DISCLAIMER,
} from '../utils/policyGuardrails';
import { SCORE_RULES_VERSION } from '../utils/scoring';
import { ScoreReviewRequest } from '../types/scoring';

export const ApplicationReportPage: React.FC = () => {
  const {
    state,
    navigate,
    scoreResult,
    recordScoreReview,
    createApplicationRevision,
  } = useApp();

  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [issueType, setIssueType] = useState<ScoreReviewRequest['issueType']>('Score question');
  const [issueComment, setIssueComment] = useState('');
  const [reviewSubmitMessage, setReviewSubmitMessage] = useState<string | null>(null);

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

  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueComment.trim()) return;

    const message = recordScoreReview({
      issueType,
      comment: issueComment.trim(),
    });

    setReviewSubmitMessage(message);
    setIssueComment('');
  };

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

  // Pre-check report observation texts via policy utility
  const observation1 = checkReportText(
    `Core registration information is complete. Submitted PAN (${maskPan(
      state.business.pan
    )}) and GSTIN (${maskGstin(
      state.business.gstin
    )}) are validated for profile completeness.`
  ).sanitizedText;

  const observation2 = checkReportText(
    `Supporting operational evidence: Bank statements and facility inspection evidence have been submitted.`
  ).sanitizedText;

  const observation3 = checkReportText(
    scoreResult.hasAllRequiredDocuments
      ? `Financial information is available for review across 6-month operational banking records.`
      : `Adding the missing GST registration certificate or bank statements may improve profile completeness.`
  ).sanitizedText;

  const observation4 = checkReportText(
    `This score reflects submitted information and document completeness. It provides internal guidance prior to commercial discussions.`
  ).sanitizedText;

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
              onClick={() => {
                if (window.confirm('Create a new application revision with a fresh reference number?')) {
                  createApplicationRevision();
                }
              }}
              className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-500" />
              <span>Edit application details</span>
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
                  Status: {scoreResult.reportStatus}
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
                <span className="text-slate-500 text-[11px] block">Masked Corporate Tax IDs:</span>
                <span className="font-mono text-slate-700 text-[11px]">
                  PAN: {maskPan(state.business.pan)} · GSTIN: {maskGstin(state.business.gstin)}
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
                {scoreResult.canCalculate ? (
                  <>
                    <div className="flex items-baseline justify-center lg:justify-start gap-1">
                      <span className="text-5xl sm:text-6xl font-black tracking-tight text-white font-mono">
                        {scoreResult.score}
                      </span>
                      <span className="text-2xl font-bold text-slate-400 font-mono">
                        /100
                      </span>
                    </div>
                    <div
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                        scoreResult.band === 'Strong readiness'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : scoreResult.band === 'Developing readiness'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      }`}
                    >
                      Status: {scoreResult.band}
                    </div>
                  </>
                ) : (
                  <div className="p-3 bg-rose-950/60 rounded-lg border border-rose-700/60 text-xs text-rose-200">
                    {scoreResult.validationMessage || 'Complete validation to view your readiness score.'}
                  </div>
                )}
              </div>

              {/* Explanation & Bands (Right) */}
              <div className="lg:col-span-8 space-y-4">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Assessment Evaluation
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    “This score reflects submitted information and document completeness. Core registration information is complete. Adding missing documents or statements may improve profile completeness.”
                  </p>
                </div>

                {/* Score Bands */}
                <div className="pt-2 border-t border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-400 block mb-2">
                    Standard Credit Readiness Score Bands:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <div
                      className={`p-2.5 rounded-lg border ${
                        scoreResult.band === 'Strong readiness'
                          ? 'bg-emerald-500/20 border-emerald-500 ring-1 ring-emerald-500'
                          : 'bg-slate-800/80 border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-emerald-400 block">
                          80–100
                        </span>
                        {scoreResult.band === 'Strong readiness' && (
                          <span className="text-[9px] uppercase font-bold text-emerald-300 bg-emerald-900/60 px-1.5 py-0.5 rounded">
                            Current
                          </span>
                        )}
                      </div>
                      <span className="text-slate-300 text-[11px] font-semibold">
                        Strong readiness
                      </span>
                    </div>

                    <div
                      className={`p-2.5 rounded-lg border ${
                        scoreResult.band === 'Developing readiness'
                          ? 'bg-amber-500/20 border-amber-500 ring-1 ring-amber-500'
                          : 'bg-slate-800/80 border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-amber-400">
                          60–79
                        </span>
                        {scoreResult.band === 'Developing readiness' && (
                          <span className="text-[9px] uppercase font-bold text-amber-300 bg-amber-900/60 px-1.5 py-0.5 rounded">
                            Current
                          </span>
                        )}
                      </div>
                      <span className="text-slate-100 text-[11px] font-semibold">
                        Developing readiness
                      </span>
                    </div>

                    <div
                      className={`p-2.5 rounded-lg border ${
                        scoreResult.band === 'Needs attention'
                          ? 'bg-rose-500/20 border-rose-500 ring-1 ring-rose-500'
                          : 'bg-slate-800/80 border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-rose-400 block">
                          0–59
                        </span>
                        {scoreResult.band === 'Needs attention' && (
                          <span className="text-[9px] uppercase font-bold text-rose-300 bg-rose-900/60 px-1.5 py-0.5 rounded">
                            Current
                          </span>
                        )}
                      </div>
                      <span className="text-slate-300 text-[11px] font-semibold">
                        Needs attention
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION: HOW THIS SCORE IS CALCULATED (Mandatory Guardrail Feature) */}
          <div className="border border-slate-200 rounded-xl p-6 bg-slate-50/60 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-teal-700" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  How This Score is Calculated
                </h3>
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                Model: {scoreResult.rulesVersion} · Deterministic & Rule-based
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              The internal Credit Readiness Score is computed deterministically from verified profile inputs and received evidence. No generative AI or external underwriting opinion is used. Missing items affect profile completeness only and do not constitute an adverse risk judgment.
            </p>

            {/* 4 Score Components Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800">Business Profile</span>
                  <span className="font-mono font-bold text-teal-800">
                    {scoreResult.breakdown.businessProfile.earned} / {scoreResult.breakdown.businessProfile.max}
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-teal-600 h-full rounded-full"
                    style={{
                      width: `${(scoreResult.breakdown.businessProfile.earned / scoreResult.breakdown.businessProfile.max) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  Legal entity, constitution, location, turnover tier & tax IDs.
                </p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800">Document Submission</span>
                  <span className="font-mono font-bold text-teal-800">
                    {scoreResult.breakdown.documentCompleteness.earned} / {scoreResult.breakdown.documentCompleteness.max}
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-teal-600 h-full rounded-full"
                    style={{
                      width: `${(scoreResult.breakdown.documentCompleteness.earned / scoreResult.breakdown.documentCompleteness.max) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  Bank statements, facility photos, GST cert & financials.
                </p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800">Verification Readiness</span>
                  <span className="font-mono font-bold text-teal-800">
                    {scoreResult.breakdown.verificationReadiness.earned} / {scoreResult.breakdown.verificationReadiness.max}
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-teal-600 h-full rounded-full"
                    style={{
                      width: `${(scoreResult.breakdown.verificationReadiness.earned / scoreResult.breakdown.verificationReadiness.max) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  OTP verified, applicant consent, signatory details & declaration.
                </p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800">Financial Declaration</span>
                  <span className="font-mono font-bold text-teal-800">
                    {scoreResult.breakdown.financialSelfDeclaration.earned} / {scoreResult.breakdown.financialSelfDeclaration.max}
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-teal-600 h-full rounded-full"
                    style={{
                      width: `${(scoreResult.breakdown.financialSelfDeclaration.earned / scoreResult.breakdown.financialSelfDeclaration.max) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  Turnover slab declared with statements uploaded for review.
                </p>
              </div>
            </div>

            {/* Score Controls: Report Issue & Timestamp */}
            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-500 border-t border-slate-200">
              <span>
                Calculated on {new Date(scoreResult.calculatedAt).toLocaleString('en-IN')}
              </span>
              <button
                type="button"
                onClick={() => {
                  setReviewSubmitMessage(null);
                  setIssueModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold rounded-lg transition-colors no-print"
              >
                <HelpCircle className="w-3.5 h-3.5 text-teal-700" />
                <span>Report an issue with this score</span>
              </button>
            </div>
          </div>

          {/* OBSERVATIONS SECTION (Policy-Guarded) */}
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
                  <strong>Business Profile & Identification:</strong> {observation1}
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Supporting Operational Evidence:</strong> {observation2}
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Enhancement Opportunity:</strong> {observation3}
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <TrendingUp className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                <div>
                  <strong>Guidance Purpose:</strong> {observation4}
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

          {/* REQUIRED EXACT STATUTORY DISCLAIMER (Explicit Prompt Rule 2) */}
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="block text-amber-900 mb-0.5">
                Statutory Product Notice:
              </strong>
              {REQUIRED_LEGAL_DISCLAIMER}
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

      {/* Human Review Request Modal */}
      {issueModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-teal-700" />
                <h3 className="text-sm font-bold text-slate-900">
                  Report an Issue with this Score
                </h3>
              </div>
              <button
                onClick={() => setIssueModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleIssueSubmit} className="p-6 space-y-4">
              {reviewSubmitMessage ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3 text-xs text-emerald-950">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <p className="leading-relaxed font-medium">
                      {reviewSubmitMessage}
                    </p>
                  </div>
                  <div className="pt-2 text-right">
                    <button
                      type="button"
                      onClick={() => setIssueModalOpen(false)}
                      className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-xs font-semibold hover:bg-emerald-800"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-xs text-slate-600">
                    If you believe submitted documents or company parameters were not accurately evaluated, submit your inquiry below. Our manual verification team will review your record.
                  </p>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 block">
                      Issue Type
                    </label>
                    <select
                      value={issueType}
                      onChange={(e) =>
                        setIssueType(e.target.value as ScoreReviewRequest['issueType'])
                      }
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:outline-none"
                    >
                      <option value="Incorrect details">Incorrect details</option>
                      <option value="Missing document">Missing document</option>
                      <option value="Score question">Score question</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 block">
                      Comment / Explanation
                    </label>
                    <textarea
                      value={issueComment}
                      onChange={(e) => setIssueComment(e.target.value)}
                      placeholder="Describe the discrepancy or question regarding your readiness score calculation..."
                      rows={4}
                      required
                      className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:outline-none"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={() => setIssueModalOpen(false)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit for review</span>
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

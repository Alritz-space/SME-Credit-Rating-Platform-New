import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { formatINR, PRODUCTS } from '../utils/constants';
import { REQUIRED_LEGAL_DISCLAIMER } from '../utils/policyGuardrails';
import { maskGstin, maskPan } from '../utils/masking';
import {
  Building2,
  FileCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Phone,
  AlertTriangle,
  RotateCcw,
  FileText,
  CreditCard,
  Download,
  Info,
  ExternalLink,
} from 'lucide-react';
import { ReceiptModal } from '../components/ReceiptModal';

export const DashboardPage: React.FC = () => {
  const {
    state,
    navigate,
    isStepComplete,
    calculateProgress,
    resetApplication,
    scoreResult,
    setGatingNotice,
  } = useApp();

  const [receiptOpen, setReceiptOpen] = useState(false);

  // Enforce OTP gating: cannot access dashboard until verified
  useEffect(() => {
    if (!state.user.isVerified) {
      setGatingNotice('Please complete mobile OTP verification before accessing the applicant dashboard.');
      navigate('/verify-otp');
    }
  }, [state.user.isVerified, navigate, setGatingNotice]);

  const progress = calculateProgress();
  const firstName = state.user.fullName.split(' ')[0] || 'Ananya';

  // Determine next step
  const regDone = isStepComplete('registration');
  const prodDone = isStepComplete('products');
  const kycDone = isStepComplete('kyc');
  const paymentDone = isStepComplete('payment');
  const reportDone = isStepComplete('report');

  let nextAction = {
    title: 'Complete Business Profile',
    description: 'Provide company registration, PAN, GSTIN, and turnover details.',
    path: '/application/registration',
    buttonText: 'Resume application',
  };

  if (!regDone) {
    nextAction = {
      title: 'Complete Business Profile',
      description: 'Step A: Enter legal entity, PAN, GSTIN, and location details.',
      path: '/application/registration',
      buttonText: 'Resume application',
    };
  } else if (!prodDone) {
    nextAction = {
      title: 'Select Verification Services',
      description: 'Step B: Choose Credit Readiness Score and business grading solutions.',
      path: '/application/product-selection',
      buttonText: 'Choose services',
    };
  } else if (!kycDone) {
    nextAction = {
      title: 'Submit KYC & Upload Documents',
      description: 'Step C: Attach bank statements, plant photos, and GST certificate.',
      path: '/application/kyc',
      buttonText: 'Upload documents',
    };
  } else if (!paymentDone) {
    nextAction = {
      title: 'Complete Application Payment',
      description: 'Step D: Simulate payment for your selected readiness products.',
      path: '/application/payment',
      buttonText: 'Proceed to payment',
    };
  } else {
    nextAction = {
      title: 'View Draft Readiness Report',
      description: 'Step E: Review your internal credit readiness score and diagnostic findings.',
      path: '/application/report',
      buttonText: 'View draft report',
    };
  }

  const selectedProducts = PRODUCTS.filter((p) =>
    state.selectedProductIds.includes(p.id)
  );

  const subtotal = selectedProducts.reduce((sum, p) => sum + p.price, 0);
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + gst;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div>
            <span className="text-xs font-semibold text-teal-700 font-mono">
              APPLICATION REFERENCE: {state.referenceNumber}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Welcome, {firstName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {state.business.legalName} · {state.user.association}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (window.confirm('Reset application to sample data for fresh testing?')) {
                  resetApplication();
                }
              }}
              className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset demo</span>
            </button>

            <button
              onClick={() => navigate(nextAction.path)}
              className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-sm transition-all flex items-center gap-2"
            >
              <span>{nextAction.buttonText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Primary Next Action Banner & Progress Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Status & Next Action Card */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Business Application Status
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-1">
                  {nextAction.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  {nextAction.description}
                </p>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold font-mono ${
                  reportDone
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}
              >
                {reportDone ? 'Report Ready' : 'In Progress'}
              </span>
            </div>

            {/* Progress bar */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold mb-2">
                <span className="text-slate-700">Application Progress</span>
                <span className="font-mono text-teal-800 font-bold">{progress}% Completed</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-teal-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* 5-Step Status Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
              <button
                onClick={() => navigate('/application/registration')}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100 transition-colors text-left"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-700">Step A</span>
                  {regDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Clock className="w-4 h-4 text-amber-500" />
                  )}
                </div>
                <p className="text-[11px] font-semibold text-slate-900 leading-tight">
                  Registration
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {regDone ? 'Complete' : 'Needs attention'}
                </p>
              </button>

              <button
                onClick={() => navigate('/application/product-selection')}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100 transition-colors text-left"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-700">Step B</span>
                  {prodDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Clock className="w-4 h-4 text-amber-500" />
                  )}
                </div>
                <p className="text-[11px] font-semibold text-slate-900 leading-tight">
                  Products
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {selectedProducts.length} selected
                </p>
              </button>

              <button
                onClick={() => navigate('/application/kyc')}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100 transition-colors text-left"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-700">Step C</span>
                  {kycDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Clock className="w-4 h-4 text-amber-500" />
                  )}
                </div>
                <p className="text-[11px] font-semibold text-slate-900 leading-tight">
                  KYC & Docs
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {state.documents.length} files
                </p>
              </button>

              <button
                onClick={() => navigate('/application/payment')}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100 transition-colors text-left"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-700">Step D</span>
                  {paymentDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Clock className="w-4 h-4 text-slate-400" />
                  )}
                </div>
                <p className="text-[11px] font-semibold text-slate-900 leading-tight">
                  Payment
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {paymentDone ? 'Paid (Demo)' : 'Pending'}
                </p>
              </button>

              <button
                onClick={() => {
                  if (paymentDone) navigate('/application/report');
                  else navigate('/application/payment');
                }}
                className={`p-3 rounded-xl border transition-colors text-left ${
                  reportDone
                    ? 'border-teal-200 bg-teal-50/60 hover:bg-teal-100/60'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-700">Step E</span>
                  {reportDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Clock className="w-4 h-4 text-slate-400" />
                  )}
                </div>
                <p className="text-[11px] font-semibold text-slate-900 leading-tight">
                  Draft Report
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {reportDone ? `Ready (${scoreResult.score}/100)` : 'Locked'}
                </p>
              </button>
            </div>

            {/* Quick Continue Button */}
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => navigate(nextAction.path)}
                className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-sm transition-all flex items-center gap-2"
              >
                <span>Resume application</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {paymentDone && (
                <button
                  onClick={() => setReceiptOpen(true)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download receipt</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Help Card & Quick Info */}
          <div className="lg:col-span-4 space-y-6">
            {/* Help Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 border border-teal-200">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Need help with your application?
                  </h3>
                  <p className="text-xs text-slate-500">
                    Dedicated support for Indian SMEs
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[11px] text-slate-500 block">Toll-free desk:</span>
                <a
                  href="tel:18001234567"
                  className="text-base font-bold font-mono text-teal-800 hover:underline block"
                >
                  +91 1800 123 4567
                </a>
                <span className="text-[10px] text-slate-500 block">
                  Mon–Fri, 9:30 AM – 6:00 PM IST
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Contact our verification team if you need assistance submitting high-volume bank statements or GST certificates.
              </p>
            </div>

            {/* Selected Products Summary Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-slate-900">
                  Selected Services
                </h3>
                <button
                  onClick={() => navigate('/application/product-selection')}
                  className="text-xs text-teal-700 font-semibold hover:underline"
                >
                  Edit
                </button>
              </div>

              {selectedProducts.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No services selected yet.</p>
              ) : (
                <div className="space-y-2.5">
                  {selectedProducts.map((p) => (
                    <div
                      key={p.id}
                      className="flex justify-between items-start text-xs border-b border-slate-100 pb-2"
                    >
                      <div>
                        <p className="font-semibold text-slate-800">{p.title}</p>
                        <p className="text-[10px] text-slate-400">Readiness Diagnostic</p>
                      </div>
                      <span className="font-mono font-semibold text-slate-900">
                        {formatINR(p.price)}
                      </span>
                    </div>
                  ))}

                  <div className="pt-2 text-xs flex justify-between font-bold text-slate-900">
                    <span>Total (incl. GST):</span>
                    <span className="font-mono text-teal-800">{formatINR(total)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mandatory Product Notice / Exact Disclaimer */}
        <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Mandatory Product Notice:</strong> {REQUIRED_LEGAL_DISCLAIMER}
          </p>
        </div>
      </div>

      {receiptOpen && <ReceiptModal onClose={() => setReceiptOpen(false)} />}
    </div>
  );
};

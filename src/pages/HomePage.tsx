import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AssociationType } from '../types';
import {
  formatINR,
  PRODUCTS,
  REGEX_PATTERNS,
} from '../utils/constants';
import {
  ShieldCheck,
  Building2,
  FileCheck2,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Lock,
  FileText,
  BadgeAlert,
  ChevronDown,
  Phone,
  HelpCircle,
} from 'lucide-react';
import { TermsModal } from '../components/TermsModal';

export const HomePage: React.FC = () => {
  const { state, updateUser, navigate } = useApp();

  // Registration Form State
  const [fullName, setFullName] = useState(state.user.fullName || 'Ananya Sharma');
  const [email, setEmail] = useState(
    state.user.email || 'ananya.sharma@sunrisecomponents.in'
  );
  const [mobile, setMobile] = useState(state.user.mobile || '9876543210');
  const [association, setAssociation] = useState<AssociationType>(
    state.user.association || 'Director'
  );
  const [agreedToTerms, setAgreedToTerms] = useState(
    state.user.agreedToTerms !== undefined ? state.user.agreedToTerms : true
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [termsModalOpen, setTermsModalOpen] = useState<'terms' | 'privacy' | null>(null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Please enter your full legal name.';
    }

    if (!email.trim() || !REGEX_PATTERNS.EMAIL.test(email)) {
      newErrors.email = 'Please provide a valid corporate or business email address.';
    }

    const cleanMobile = mobile.replace(/\D/g, '');
    if (!REGEX_PATTERNS.INDIAN_MOBILE.test(cleanMobile)) {
      newErrors.mobile = 'Enter a valid 10-digit Indian mobile number (starts with 6, 7, 8, or 9).';
    }

    if (!association) {
      newErrors.association = 'Please select your association with the enterprise.';
    }

    if (!agreedToTerms) {
      newErrors.terms = 'You must agree to the Terms of Use and Privacy Notice to proceed.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    updateUser({
      fullName: fullName.trim(),
      email: email.trim(),
      mobile: mobile.replace(/\D/g, ''),
      association,
      agreedToTerms,
      isVerified: false,
    });

    navigate('/verify-otp');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-white via-slate-50 to-slate-100/60 pt-8 pb-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Heading & Value Proposition */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
                <span>India MSME Credit Guidance & Readiness</span>
                <span className="text-slate-300">|</span>
                <span className="text-amber-700 font-medium">Self-Assessment Tool</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight [text-wrap:balance]">
                Know how ready your business is for credit.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                Complete your business profile, submit key documents, and receive an internal Credit Readiness Score with practical next steps.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#registration-panel"
                  className="px-6 py-3.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                >
                  <span>Start application</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href="#products"
                  className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg font-semibold text-sm transition-colors focus:ring-2 focus:ring-slate-300 focus:outline-none"
                >
                  Explore products
                </a>
              </div>

              {/* Trust Strip */}
              <div className="pt-6 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
                <div className="flex items-center gap-2.5 bg-white/70 p-2.5 rounded-lg border border-slate-200">
                  <ShieldCheck className="w-5 h-5 text-teal-700 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900 block">Secure document handling</span>
                    <span className="text-[11px] text-slate-500">Client-side privacy first</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 bg-white/70 p-2.5 rounded-lg border border-slate-200">
                  <Building2 className="w-5 h-5 text-teal-700 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900 block">India-focused SME workflow</span>
                    <span className="text-[11px] text-slate-500">PAN, GSTIN & MSME aligned</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 bg-white/70 p-2.5 rounded-lg border border-slate-200">
                  <TrendingUp className="w-5 h-5 text-teal-700 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900 block">Clear pricing before payment</span>
                    <span className="text-[11px] text-slate-500">Transparent GST breakdown</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Registration Panel */}
            <div id="registration-panel" className="lg:col-span-5">
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8">
                <div className="border-b border-slate-100 pb-4 mb-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-700 block mb-1">
                    Instant Enterprise Onboarding
                  </span>
                  <h2 className="text-xl font-bold text-slate-900">
                    Register your enterprise
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Begin in 2 minutes. Receive a 6-digit OTP to authenticate your registration.
                  </p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label
                      htmlFor="full-name"
                      className="block text-xs font-semibold text-slate-700 mb-1"
                    >
                      Full name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="full-name"
                      type="text"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (errors.fullName) setErrors({ ...errors, fullName: '' });
                      }}
                      placeholder="e.g. Ananya Sharma"
                      className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                        errors.fullName
                          ? 'border-red-400 focus:ring-red-200'
                          : 'border-slate-300 focus:ring-teal-500 focus:border-teal-500'
                      }`}
                    />
                    {errors.fullName && (
                      <p className="text-red-600 text-[11px] mt-1">{errors.fullName}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email-address"
                      className="block text-xs font-semibold text-slate-700 mb-1"
                    >
                      Corporate email address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email-address"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors({ ...errors, email: '' });
                      }}
                      placeholder="name@company.in"
                      className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                        errors.email
                          ? 'border-red-400 focus:ring-red-200'
                          : 'border-slate-300 focus:ring-teal-500 focus:border-teal-500'
                      }`}
                    />
                    {errors.email && (
                      <p className="text-red-600 text-[11px] mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label
                      htmlFor="mobile-number"
                      className="block text-xs font-semibold text-slate-700 mb-1"
                    >
                      Mobile number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-xs font-semibold text-slate-500 font-mono">
                        +91
                      </div>
                      <input
                        id="mobile-number"
                        type="tel"
                        maxLength={10}
                        value={mobile}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          setMobile(val);
                          if (errors.mobile) setErrors({ ...errors, mobile: '' });
                        }}
                        placeholder="98765 43210"
                        className={`w-full pl-12 pr-3.5 py-2.5 text-sm font-mono bg-white border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                          errors.mobile
                            ? 'border-red-400 focus:ring-red-200'
                            : 'border-slate-300 focus:ring-teal-500 focus:border-teal-500'
                        }`}
                      />
                    </div>
                    {errors.mobile ? (
                      <p className="text-red-600 text-[11px] mt-1">{errors.mobile}</p>
                    ) : (
                      <p className="text-slate-400 text-[10px] mt-1">
                        Demo OTP <span className="font-mono text-slate-600 font-semibold">123456</span> will be used.
                      </p>
                    )}
                  </div>

                  {/* Association Dropdown */}
                  <div>
                    <label
                      htmlFor="association-select"
                      className="block text-xs font-semibold text-slate-700 mb-1"
                    >
                      Association with business <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="association-select"
                      value={association}
                      onChange={(e) => {
                        setAssociation(e.target.value as AssociationType);
                        if (errors.association) setErrors({ ...errors, association: '' });
                      }}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    >
                      <option value="Proprietor">Proprietor</option>
                      <option value="Promoter">Promoter</option>
                      <option value="Partner">Partner</option>
                      <option value="Director">Director</option>
                    </select>
                    {errors.association && (
                      <p className="text-red-600 text-[11px] mt-1">{errors.association}</p>
                    )}
                  </div>

                  {/* Mandatory Checkbox */}
                  <div className="pt-2">
                    <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600">
                      <input
                        type="checkbox"
                        checked={agreedToTerms}
                        onChange={(e) => {
                          setAgreedToTerms(e.target.checked);
                          if (errors.terms) setErrors({ ...errors, terms: '' });
                        }}
                        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-500"
                      />
                      <span>
                        I agree to the{' '}
                        <button
                          type="button"
                          onClick={() => setTermsModalOpen('terms')}
                          className="text-teal-700 font-medium underline underline-offset-2 hover:text-teal-900"
                        >
                          Terms of Use
                        </button>{' '}
                        and{' '}
                        <button
                          type="button"
                          onClick={() => setTermsModalOpen('privacy')}
                          className="text-teal-700 font-medium underline underline-offset-2 hover:text-teal-900"
                        >
                          Privacy Notice
                        </button>
                        . <span className="text-red-500">*</span>
                      </span>
                    </label>
                    {errors.terms && (
                      <p className="text-red-600 text-[11px] mt-1">{errors.terms}</p>
                    )}
                  </div>

                  {/* Register Button */}
                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-2"
                  >
                    <span>Register and verify OTP</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-1">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Prefilled with demo enterprise profile</span>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Cards Section */}
      <section id="products" className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
              Diagnostic & Verification Offerings
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Transparent, tailored solutions for Indian enterprises
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Select standalone verification tools or our flagship Credit Readiness assessment to benchmark your company before meeting financial institutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRODUCTS.map((prod) => (
              <div
                key={prod.id}
                className={`relative rounded-xl p-6 flex flex-col justify-between transition-all bg-white border ${
                  prod.recommended
                    ? 'border-teal-700 shadow-md ring-1 ring-teal-700'
                    : 'border-slate-200 shadow-xs hover:border-slate-300'
                }`}
              >
                <div>
                  {prod.recommended && (
                    <div className="mb-3">
                      <span className="inline-block text-[11px] font-semibold text-teal-900 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded">
                        Recommended for loan readiness
                      </span>
                    </div>
                  )}

                  <h3 className="text-base font-bold text-slate-900">
                    {prod.title}
                  </h3>

                  <div className="mt-3 mb-4">
                    <span className="text-2xl font-black text-slate-900 font-mono">
                      {formatINR(prod.price)}
                    </span>
                    <span className="text-xs text-slate-500 ml-1.5">+ 18% GST</span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {prod.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100">
                  <button
                    onClick={() => {
                      if (!state.user.isVerified) {
                        navigate('/verify-otp');
                      } else {
                        navigate('/application/product-selection');
                      }
                    }}
                    className={`w-full py-2.5 px-3 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                      prod.recommended
                        ? 'bg-teal-700 text-white hover:bg-teal-800'
                        : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                    }`}
                  >
                    <span>Select package</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Internal Guidance Clarification */}
          <div className="mt-10 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-3 max-w-4xl mx-auto">
            <BadgeAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Important Guidance Note:</strong> The Credit Readiness Score is an internal assessment of your business’s credit readiness based on the information and documents you submit. It does not constitute a formal SEBI credit rating, credit score, or legal commitment from any lender.
            </p>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
              Simple 4-Step Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              How the assessment works
            </h2>
            <p className="text-sm text-slate-600">
              Fast, digital, and designed specifically for Indian proprietorships, partnerships, LLPs, and private limited companies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 relative shadow-2xs">
              <span className="text-3xl font-extrabold text-teal-800/20 font-mono block mb-2">
                01
              </span>
              <h3 className="text-sm font-bold text-slate-900 mb-2">
                Register your details
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Provide your mobile number and designated role (Proprietor, Partner, Promoter, or Director) to receive a secure OTP.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 relative shadow-2xs">
              <span className="text-3xl font-extrabold text-teal-800/20 font-mono block mb-2">
                02
              </span>
              <h3 className="text-sm font-bold text-slate-900 mb-2">
                Complete your business profile
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Enter legal entity name, PAN, GSTIN, registered office address, turnover slab, and operational industry category.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 relative shadow-2xs">
              <span className="text-3xl font-extrabold text-teal-800/20 font-mono block mb-2">
                03
              </span>
              <h3 className="text-sm font-bold text-slate-900 mb-2">
                Choose services & upload KYC
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Attach banking statements, plant/office photos, and GST filings. Use one-click sample documents or upload your own files.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 relative shadow-2xs">
              <span className="text-3xl font-extrabold text-teal-800/20 font-mono block mb-2">
                04
              </span>
              <h3 className="text-sm font-bold text-slate-900 mb-2">
                Simulate payment & get report
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Test checkout via UPI or card with zero money debited, and download your comprehensive draft readiness report instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section id="why-us" className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-5">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                Why Indian SMEs Trust This Portal
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-tight">
                Designed for the realities of Indian commercial credit
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Traditional loan applications are often delayed by missing GST reconciliations, inadequate banking turnover proofs, or unorganized KYC. Our diagnostic portal helps business owners audit their posture before approaching lenders.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      Standardized Indian KYC Documentation
                    </h4>
                    <p className="text-xs text-slate-500">
                      Aligned with standard Indian banking underwriting norms: PAN, GSTIN, Udyam, and audited financials.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      Actionable Improvement Observations
                    </h4>
                    <p className="text-xs text-slate-500">
                      Clear guidance on cash flow regularity, balance sheet evidence, and facility photos required by credit officers.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      Strict Privacy & Local Processing
                    </h4>
                    <p className="text-xs text-slate-500">
                      All prototype data remains within your browser storage with zero external database synchronization.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Highlight Graphic Card */}
            <div className="bg-slate-900 text-white rounded-2xl p-8 shadow-xl border border-slate-800 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <span className="text-xs text-slate-400 font-mono">
                  Readiness Diagnostic Blueprint
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-teal-900/60 text-teal-300 border border-teal-700">
                  Prototype Metric v1
                </span>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold text-slate-200">
                      Profile Completeness
                    </span>
                    <span className="text-xs font-mono font-bold text-teal-400">
                      86%
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-teal-400 h-full w-[86%]" />
                  </div>
                </div>

                <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold text-slate-200">
                      Document Evidence Verification
                    </span>
                    <span className="text-xs font-mono font-bold text-teal-400">
                      Complete
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-teal-400 h-full w-[100%]" />
                  </div>
                </div>

                <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold text-slate-200">
                      Indicative Score
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-400">
                      72 / 100 (Developing)
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full w-[72%]" />
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800 flex items-center justify-between">
                <span>Sunrise Components Pvt Ltd</span>
                <span className="font-mono">Ref: {state.referenceNumber}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Help & Support Strip */}
      <section id="help" className="py-12 bg-slate-100 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center shrink-0 border border-teal-200">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Need help with your business registration or documents?
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Our specialized SME support desk can assist you with accepted file types, GST validation, and prototype walkthroughs.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <a
                href="tel:18001234567"
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-teal-400" />
                <span>+91 1800 123 4567</span>
              </a>
              <button
                onClick={() => setTermsModalOpen('privacy')}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors"
              >
                Privacy FAQ
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Terms & Privacy Modal */}
      {termsModalOpen && (
        <TermsModal
          initialTab={termsModalOpen}
          onClose={() => setTermsModalOpen(null)}
        />
      )}
    </div>
  );
};

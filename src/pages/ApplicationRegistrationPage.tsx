import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Stepper } from '../components/Stepper';
import {
  CITIES,
  CONSTITUTIONS,
  INDUSTRIES,
  REGEX_PATTERNS,
  STATES,
  TURNOVER_SLABS,
} from '../utils/constants';
import {
  CityType,
  ConstitutionType,
  IndustryType,
  StateType,
  TurnoverType,
} from '../types';
import {
  Building,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Info,
} from 'lucide-react';

export const ApplicationRegistrationPage: React.FC = () => {
  const { state, updateBusiness, navigate, setHasUnsavedChanges } = useApp();

  const [formData, setFormData] = useState({
    legalName: state.business.legalName || 'Sunrise Components Private Limited',
    tradeName: state.business.tradeName || 'Sunrise Components',
    constitution: (state.business.constitution ||
      'Private Limited Company') as ConstitutionType,
    incorporationDate: state.business.incorporationDate || '2018-05-14',
    pan: state.business.pan || 'AABCS1429K',
    gstin: state.business.gstin || '06AABCS1429K1Z4',
    addressLine1: state.business.addressLine1 || 'Plot 42, Udyog Vihar Phase IV',
    addressLine2: state.business.addressLine2 || 'Near DLF Cyber City',
    city: (state.business.city || 'Gurugram') as CityType,
    state: (state.business.state || 'Haryana') as StateType,
    pinCode: state.business.pinCode || '122016',
    industry: (state.business.industry || 'Manufacturing') as IndustryType,
    subIndustry:
      state.business.subIndustry || 'Precision engineering components',
    yearlyTurnover: (state.business.yearlyTurnover ||
      '₹5 crore–₹25 crore') as TurnoverType,
    numberOfEmployees: state.business.numberOfEmployees || 84,
    preferredLanguage: state.business.preferredLanguage || 'English',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState<boolean>(false);

  const isProprietor = state.user.association === 'Proprietor';

  useEffect(() => {
    setHasUnsavedChanges(isDirty);
    return () => setHasUnsavedChanges(false);
  }, [isDirty, setHasUnsavedChanges]);

  const handleChange = (
    field: string,
    value: string | number | ConstitutionType | CityType | StateType | IndustryType | TurnoverType
  ) => {
    setIsDirty(true);
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.legalName.trim()) {
      errs.legalName = 'Please enter your registered legal business name.';
    }

    if (!formData.tradeName.trim()) {
      errs.tradeName = 'Please enter the trade name or commercial brand name.';
    }

    if (!formData.incorporationDate) {
      errs.incorporationDate = 'Select your business incorporation or commencement date.';
    }

    // PAN validation
    const cleanPan = formData.pan.toUpperCase().trim();
    if (!cleanPan) {
      errs.pan = 'Permanent Account Number (PAN) is mandatory.';
    } else if (!REGEX_PATTERNS.PAN.test(cleanPan)) {
      errs.pan = 'Invalid PAN format. Must be 10 characters (e.g. ABCDE1234F).';
    }

    // GSTIN validation rule:
    // If association is Proprietor, PAN is mandatory and GSTIN is optional.
    // For Promoter, Partner, and Director, PAN and GSTIN are mandatory in this prototype.
    const cleanGst = formData.gstin.toUpperCase().trim();
    if (!isProprietor) {
      if (!cleanGst) {
        errs.gstin = `GSTIN is mandatory for ${state.user.association} registration.`;
      } else if (!REGEX_PATTERNS.GSTIN.test(cleanGst)) {
        errs.gstin =
          'Invalid GSTIN format. Must follow standard 15-character structure (e.g. 22AAAAA0000A1Z5).';
      }
    } else if (cleanGst && !REGEX_PATTERNS.GSTIN.test(cleanGst)) {
      errs.gstin = 'Invalid GSTIN format. Must follow standard 15-character structure.';
    }

    // Address Line 1
    if (!formData.addressLine1.trim()) {
      errs.addressLine1 = 'Registered address line 1 is required.';
    }

    // PIN code validation
    const cleanPin = formData.pinCode.trim();
    if (!cleanPin) {
      errs.pinCode = 'PIN code is required.';
    } else if (!REGEX_PATTERNS.PIN_CODE.test(cleanPin)) {
      errs.pinCode = 'PIN code must be a valid 6-digit Indian postal code.';
    }

    if (!formData.subIndustry.trim()) {
      errs.subIndustry = 'Please specify your sub-industry or operational activity.';
    }

    if (Number(formData.numberOfEmployees) < 1) {
      errs.numberOfEmployees = 'Enter at least 1 employee.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }

    setIsDirty(false);
    setHasUnsavedChanges(false);

    updateBusiness({
      ...formData,
      pan: formData.pan.toUpperCase().trim(),
      gstin: formData.gstin.toUpperCase().trim(),
    });

    navigate('/application/product-selection');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-24 sm:pb-12">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Form Intro Banner */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <span className="text-xs font-bold text-teal-700 uppercase tracking-wider font-mono">
                Step A · Business Details
              </span>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
                Enterprise Registration & Profile
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Enter your company’s identification and tax credentials to initiate the readiness diagnostic.
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md font-mono">
                Applicant: {state.user.fullName} ({state.user.association})
              </span>
            </div>
          </div>

          <form onSubmit={handleContinue} className="mt-6 space-y-6">
            {/* Section 1: Entity Identification */}
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide text-slate-700 border-b border-slate-100 pb-2 mb-4">
                1. Legal Entity Identification
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Legal Name */}
                <div>
                  <label
                    htmlFor="legal-business-name"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Legal business name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="legal-business-name"
                    type="text"
                    value={formData.legalName}
                    onChange={(e) => handleChange('legalName', e.target.value)}
                    placeholder="e.g. Sunrise Components Private Limited"
                    className={`w-full px-3.5 py-2 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.legalName
                        ? 'border-red-400 focus:ring-red-200'
                        : 'border-slate-300 focus:ring-teal-500 focus:border-teal-500'
                    }`}
                  />
                  {errors.legalName && (
                    <p className="text-red-600 text-[11px] mt-1">{errors.legalName}</p>
                  )}
                </div>

                {/* Trade Name */}
                <div>
                  <label
                    htmlFor="trade-name"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Trade name / Brand <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="trade-name"
                    type="text"
                    value={formData.tradeName}
                    onChange={(e) => handleChange('tradeName', e.target.value)}
                    placeholder="e.g. Sunrise Components"
                    className={`w-full px-3.5 py-2 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.tradeName
                        ? 'border-red-400 focus:ring-red-200'
                        : 'border-slate-300 focus:ring-teal-500 focus:border-teal-500'
                    }`}
                  />
                  {errors.tradeName && (
                    <p className="text-red-600 text-[11px] mt-1">{errors.tradeName}</p>
                  )}
                </div>

                {/* Constitution Dropdown */}
                <div>
                  <label
                    htmlFor="constitution-select"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Constitution of business <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="constitution-select"
                    value={formData.constitution}
                    onChange={(e) =>
                      handleChange('constitution', e.target.value as ConstitutionType)
                    }
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    {CONSTITUTIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date of Incorporation */}
                <div>
                  <label
                    htmlFor="incorporation-date"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Date of incorporation / inception <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="incorporation-date"
                    type="date"
                    value={formData.incorporationDate}
                    onChange={(e) => handleChange('incorporationDate', e.target.value)}
                    className={`w-full px-3.5 py-2 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 font-mono ${
                      errors.incorporationDate
                        ? 'border-red-400 focus:ring-red-200'
                        : 'border-slate-300 focus:ring-teal-500 focus:border-teal-500'
                    }`}
                  />
                  {errors.incorporationDate && (
                    <p className="text-red-600 text-[11px] mt-1">{errors.incorporationDate}</p>
                  )}
                </div>

                {/* PAN */}
                <div>
                  <label
                    htmlFor="business-pan"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Permanent Account Number (PAN) <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="business-pan"
                    type="text"
                    maxLength={10}
                    value={formData.pan}
                    onChange={(e) => handleChange('pan', e.target.value.toUpperCase())}
                    placeholder="e.g. AABCS1429K"
                    className={`w-full px-3.5 py-2 text-sm uppercase font-mono tracking-wider bg-white border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.pan
                        ? 'border-red-400 focus:ring-red-200'
                        : 'border-slate-300 focus:ring-teal-500 focus:border-teal-500'
                    }`}
                  />
                  {errors.pan ? (
                    <p className="text-red-600 text-[11px] mt-1">{errors.pan}</p>
                  ) : (
                    <p className="text-slate-400 text-[11px] mt-1 font-mono">Format: 5 letters, 4 digits, 1 letter</p>
                  )}
                </div>

                {/* GSTIN */}
                <div>
                  <label
                    htmlFor="business-gstin"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    GSTIN {isProprietor ? '(Optional for Proprietor)' : <span className="text-red-500">*</span>}
                  </label>
                  <input
                    id="business-gstin"
                    type="text"
                    maxLength={15}
                    value={formData.gstin}
                    onChange={(e) => handleChange('gstin', e.target.value.toUpperCase())}
                    placeholder="e.g. 06AABCS1429K1Z4"
                    className={`w-full px-3.5 py-2 text-sm uppercase font-mono tracking-wider bg-white border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.gstin
                        ? 'border-red-400 focus:ring-red-200'
                        : 'border-slate-300 focus:ring-teal-500 focus:border-teal-500'
                    }`}
                  />
                  {errors.gstin ? (
                    <p className="text-red-600 text-[11px] mt-1">{errors.gstin}</p>
                  ) : (
                    <p className="text-slate-400 text-[11px] mt-1 font-mono">Format: 2 state digits + 10 PAN + 3 suffix</p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 2: Address & Location */}
            <div className="pt-2">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide text-slate-700 border-b border-slate-100 pb-2 mb-4">
                2. Registered Principal Place of Business
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="address-line-1"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Address line 1 <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="address-line-1"
                    type="text"
                    value={formData.addressLine1}
                    onChange={(e) => handleChange('addressLine1', e.target.value)}
                    placeholder="Plot / Building / Flat number, Street"
                    className={`w-full px-3.5 py-2 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.addressLine1
                        ? 'border-red-400 focus:ring-red-200'
                        : 'border-slate-300 focus:ring-teal-500 focus:border-teal-500'
                    }`}
                  />
                  {errors.addressLine1 && (
                    <p className="text-red-600 text-[11px] mt-1">{errors.addressLine1}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="address-line-2"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Address line 2 (Area, Landmark)
                  </label>
                  <input
                    id="address-line-2"
                    type="text"
                    value={formData.addressLine2}
                    onChange={(e) => handleChange('addressLine2', e.target.value)}
                    placeholder="Near landmark, Industrial area"
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>

                {/* City */}
                <div>
                  <label
                    htmlFor="city-select"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    City <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="city-select"
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value as CityType)}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    {CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* State */}
                <div>
                  <label
                    htmlFor="state-select"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    State <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="state-select"
                    value={formData.state}
                    onChange={(e) => handleChange('state', e.target.value as StateType)}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    {STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* PIN Code */}
                <div>
                  <label
                    htmlFor="pin-code"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    PIN code <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="pin-code"
                    type="text"
                    maxLength={6}
                    value={formData.pinCode}
                    onChange={(e) => handleChange('pinCode', e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 122016"
                    className={`w-full px-3.5 py-2 text-sm font-mono bg-white border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.pinCode
                        ? 'border-red-400 focus:ring-red-200'
                        : 'border-slate-300 focus:ring-teal-500 focus:border-teal-500'
                    }`}
                  />
                  {errors.pinCode && (
                    <p className="text-red-600 text-[11px] mt-1">{errors.pinCode}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 3: Industry & Operations */}
            <div className="pt-2">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide text-slate-700 border-b border-slate-100 pb-2 mb-4">
                3. Industry & Operating Scale
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Industry */}
                <div>
                  <label
                    htmlFor="industry-select"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Primary industry sector <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="industry-select"
                    value={formData.industry}
                    onChange={(e) =>
                      handleChange('industry', e.target.value as IndustryType)
                    }
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    {INDUSTRIES.map((ind) => (
                      <option key={ind} value={ind}>
                        {ind}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sub Industry */}
                <div>
                  <label
                    htmlFor="sub-industry"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Sub-industry / Product category <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="sub-industry"
                    type="text"
                    value={formData.subIndustry}
                    onChange={(e) => handleChange('subIndustry', e.target.value)}
                    placeholder="e.g. Precision engineering components"
                    className={`w-full px-3.5 py-2 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.subIndustry
                        ? 'border-red-400 focus:ring-red-200'
                        : 'border-slate-300 focus:ring-teal-500 focus:border-teal-500'
                    }`}
                  />
                  {errors.subIndustry && (
                    <p className="text-red-600 text-[11px] mt-1">{errors.subIndustry}</p>
                  )}
                </div>

                {/* Turnover Slab */}
                <div>
                  <label
                    htmlFor="yearly-turnover"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Annual turnover bracket <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="yearly-turnover"
                    value={formData.yearlyTurnover}
                    onChange={(e) =>
                      handleChange('yearlyTurnover', e.target.value as TurnoverType)
                    }
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    {TURNOVER_SLABS.map((slab) => (
                      <option key={slab} value={slab}>
                        {slab}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Employees */}
                <div>
                  <label
                    htmlFor="number-of-employees"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Number of employees <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="number-of-employees"
                    type="number"
                    min={1}
                    value={formData.numberOfEmployees}
                    onChange={(e) =>
                      handleChange('numberOfEmployees', parseInt(e.target.value) || 0)
                    }
                    className={`w-full px-3.5 py-2 text-sm font-mono bg-white border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.numberOfEmployees
                        ? 'border-red-400 focus:ring-red-200'
                        : 'border-slate-300 focus:ring-teal-500 focus:border-teal-500'
                    }`}
                  />
                  {errors.numberOfEmployees && (
                    <p className="text-red-600 text-[11px] mt-1">{errors.numberOfEmployees}</p>
                  )}
                </div>

                {/* Preferred Language */}
                <div>
                  <label
                    htmlFor="preferred-language"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Preferred communication language
                  </label>
                  <select
                    id="preferred-language"
                    value={formData.preferredLanguage}
                    onChange={(e) =>
                      handleChange('preferredLanguage', e.target.value as 'English' | 'Hindi')
                    }
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi (हिंदी)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Form Actions (Desktop) */}
            <div className="pt-6 border-t border-slate-200 hidden sm:flex items-center justify-between">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Dashboard</span>
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-sm font-semibold shadow-sm transition-all flex items-center gap-2"
              >
                <span>Save and Continue to Products</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Sticky Mobile Continue Bar (<= 15% viewport height compliance) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 p-3 shadow-lg flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="p-2.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={handleContinue}
          className="flex-1 py-3 px-4 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-semibold text-sm shadow-md flex items-center justify-center gap-2"
        >
          <span>Continue to Products</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

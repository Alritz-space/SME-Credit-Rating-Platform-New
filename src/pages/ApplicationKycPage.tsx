import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Stepper } from '../components/Stepper';
import { formatFileSize } from '../utils/constants';
import { DocumentUploadItem } from '../types';
import {
  ShieldCheck,
  Upload,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  Trash2,
  RefreshCw,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Info,
  Lock,
} from 'lucide-react';

interface DocCategoryConfig {
  id: string;
  title: string;
  description: string;
  acceptedFormats: string;
  acceptAttribute: string;
  required: boolean;
  minCount?: number;
  icon: 'pdf' | 'image' | 'sheet';
}

const DOCUMENT_CATEGORIES: DocCategoryConfig[] = [
  {
    id: 'bank_statement',
    title: 'Bank statements for the last six months',
    description: 'Current account operative statements showing operating cash inflows and outflows.',
    acceptedFormats: 'PDF, XLS, XLSX',
    acceptAttribute: '.pdf,.xls,.xlsx',
    required: true,
    icon: 'sheet',
  },
  {
    id: 'plant_photos',
    title: 'Plant or office photographs',
    description: 'Geo-tagged or timestamped exterior facade and interior workstation/machinery photos (minimum 2 photos).',
    acceptedFormats: 'JPG, PNG (minimum two photos)',
    acceptAttribute: '.jpg,.jpeg,.png',
    required: true,
    minCount: 2,
    icon: 'image',
  },
  {
    id: 'gst_certificate',
    title: 'GST registration certificate',
    description: 'Form GST REG-06 showing principal place of business and authorized signatories.',
    acceptedFormats: 'PDF',
    acceptAttribute: '.pdf',
    required: true,
    icon: 'pdf',
  },
  {
    id: 'financial_statement',
    title: 'Financial statements or ITR acknowledgement',
    description: 'Audited Balance Sheet, Profit & Loss statement or ITR-V acknowledgement for FY 2024-25 / 2025-26.',
    acceptedFormats: 'PDF',
    acceptAttribute: '.pdf',
    required: true,
    icon: 'pdf',
  },
  {
    id: 'udyam_cert',
    title: 'Udyam Registration Certificate',
    description: 'MSME classification certificate issued by Ministry of Micro, Small and Medium Enterprises.',
    acceptedFormats: 'PDF',
    acceptAttribute: '.pdf',
    required: false,
    icon: 'pdf',
  },
  {
    id: 'cin_cert',
    title: 'Company incorporation certificate',
    description: 'Certificate of Incorporation (COI) / Partnership deed / Shop & Establishment license.',
    acceptedFormats: 'PDF',
    acceptAttribute: '.pdf',
    required: false,
    icon: 'pdf',
  },
  {
    id: 'cancelled_cheque',
    title: 'Cancelled cheque',
    description: 'Personalized bank cheque displaying enterprise legal name, IFSC, and account number.',
    acceptedFormats: 'PDF, JPG, PNG',
    acceptAttribute: '.pdf,.jpg,.jpeg,.png',
    required: false,
    icon: 'sheet',
  },
];

export const ApplicationKycPage: React.FC = () => {
  const {
    state,
    updateKyc,
    addDocument,
    removeDocument,
    replaceDocument,
    loadDemoDocuments,
    navigate,
  } = useApp();

  const [pan, setPan] = useState(state.kyc.pan || state.business.pan || 'AABCS1429K');
  const [gstin, setGstin] = useState(state.kyc.gstin || state.business.gstin || '06AABCS1429K1Z4');
  const [signatoryName, setSignatoryName] = useState(
    state.kyc.signatoryName || state.user.fullName || 'Ananya Sharma'
  );
  const [signatoryDesignation, setSignatoryDesignation] = useState(
    state.kyc.signatoryDesignation || state.user.association || 'Director'
  );
  const [consentAccepted, setConsentAccepted] = useState(
    state.kyc.consentAccepted !== undefined ? state.kyc.consentAccepted : true
  );

  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const replaceInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Handle local file upload
  const handleFileUpload = (
    categoryId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      addDocument(categoryId, {
        name: file.name,
        size: file.size,
        type: file.type || 'application/octet-stream',
      });
    }
    // reset input
    e.target.value = '';
    setValidationErrors([]);
  };

  const handleFileReplace = (
    docId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    replaceDocument(docId, {
      name: file.name,
      size: file.size,
      type: file.type || 'application/octet-stream',
    });
    e.target.value = '';
    setValidationErrors([]);
  };

  const validate = (): boolean => {
    const errors: string[] = [];

    if (!pan.trim()) {
      errors.push('PAN is required for KYC identification.');
    }
    if (!signatoryName.trim()) {
      errors.push('Authorised signatory name is required.');
    }
    if (!signatoryDesignation.trim()) {
      errors.push('Authorised signatory designation is required.');
    }
    if (!consentAccepted) {
      errors.push('Mandatory authorization consent must be acknowledged.');
    }

    // Check required documents:
    // 1. Bank statements
    const hasBankStatement = state.documents.some(
      (d) => d.categoryId === 'bank_statement'
    );
    if (!hasBankStatement) {
      errors.push('Bank statements for the last six months must be uploaded.');
    }

    // 2. Plant or office photographs (min 2 photos)
    const plantPhotosCount = state.documents.filter(
      (d) => d.categoryId === 'plant_photos'
    ).length;
    if (plantPhotosCount < 2) {
      errors.push(
        `Plant or office photographs: minimum 2 photos required (currently ${plantPhotosCount} uploaded).`
      );
    }

    // 3. GST registration certificate
    const hasGstCert = state.documents.some(
      (d) => d.categoryId === 'gst_certificate'
    );
    if (!hasGstCert) {
      errors.push('GST registration certificate (REG-06) must be uploaded.');
    }

    // 4. Financial statements or ITR acknowledgement
    const hasFinancials = state.documents.some(
      (d) => d.categoryId === 'financial_statement'
    );
    if (!hasFinancials) {
      errors.push('Financial statements or ITR acknowledgement must be uploaded.');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }

    updateKyc({
      pan: pan.trim().toUpperCase(),
      gstin: gstin.trim().toUpperCase(),
      signatoryName: signatoryName.trim(),
      signatoryDesignation: signatoryDesignation.trim(),
      consentAccepted,
    });

    navigate('/application/payment');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-28 sm:pb-12">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Intro */}
        <div className="mb-6">
          <span className="text-xs font-bold text-teal-700 uppercase tracking-wider font-mono">
            Step C · Verification & Evidence
          </span>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
            KYC & Document Submission
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Attach financial, corporate, and operational verification records for your readiness assessment.
          </p>
        </div>

        {/* Mandatory Privacy Notice */}
        <div className="mb-8 p-4 bg-teal-50/80 rounded-xl border border-teal-200 text-xs text-teal-950 flex items-start gap-3 shadow-2xs">
          <ShieldCheck className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-teal-900 block mb-0.5">
              Privacy Reassurance & Data Handling Notice
            </span>
            <p className="leading-relaxed text-teal-800">
              “Your documents are used only to process this application. This prototype stores document information locally in your browser.”
            </p>
          </div>
        </div>

        {/* Validation Errors Box */}
        {validationErrors.length > 0 && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Please resolve the following required items before continuing:</span>
            </div>
            <ul className="list-disc pl-6 space-y-1 text-red-700">
              {validationErrors.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleContinue} className="space-y-8">
          {/* Signatory & KYC Details */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2">
              Authorised Signatory Credentials
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="kyc-pan"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  PAN <span className="text-red-500">*</span>
                </label>
                <input
                  id="kyc-pan"
                  type="text"
                  value={pan}
                  onChange={(e) => setPan(e.target.value.toUpperCase())}
                  placeholder="e.g. AABCS1429K"
                  className="w-full px-3.5 py-2 text-sm uppercase font-mono bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              <div>
                <label
                  htmlFor="kyc-gstin"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  GSTIN
                </label>
                <input
                  id="kyc-gstin"
                  type="text"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value.toUpperCase())}
                  placeholder="e.g. 06AABCS1429K1Z4"
                  className="w-full px-3.5 py-2 text-sm uppercase font-mono bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              <div>
                <label
                  htmlFor="signatory-name"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Authorised signatory name <span className="text-red-500">*</span>
                </label>
                <input
                  id="signatory-name"
                  type="text"
                  value={signatoryName}
                  onChange={(e) => setSignatoryName(e.target.value)}
                  placeholder="e.g. Ananya Sharma"
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              <div>
                <label
                  htmlFor="signatory-designation"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Authorised signatory designation <span className="text-red-500">*</span>
                </label>
                <input
                  id="signatory-designation"
                  type="text"
                  value={signatoryDesignation}
                  onChange={(e) => setSignatoryDesignation(e.target.value)}
                  placeholder="e.g. Director / Proprietor"
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700 font-medium">
                <input
                  type="checkbox"
                  checked={consentAccepted}
                  onChange={(e) => setConsentAccepted(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-500"
                />
                <span>
                  “I confirm that I am authorised to submit these business details and documents.”{' '}
                  <span className="text-red-500">*</span>
                </span>
              </label>
            </div>
          </div>

          {/* Document Upload Checklist Section */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Document Upload Checklist
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Attach files or click &quot;Use demo files&quot; to populate standard prototype documents.
                </p>
              </div>

              {/* Use Demo Files Button */}
              <button
                type="button"
                onClick={loadDemoDocuments}
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-semibold transition-colors shadow-2xs self-start sm:self-auto"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Use demo files</span>
              </button>
            </div>

            {/* Document Checklist Rows */}
            <div className="space-y-5">
              {DOCUMENT_CATEGORIES.map((cat) => {
                const uploadedFiles = state.documents.filter(
                  (d) => d.categoryId === cat.id
                );
                const hasFiles = uploadedFiles.length > 0;
                const isSatisfied =
                  !cat.required ||
                  (cat.minCount ? uploadedFiles.length >= cat.minCount : hasFiles);

                return (
                  <div
                    key={cat.id}
                    className={`rounded-xl p-4 sm:p-5 border transition-all ${
                      isSatisfied && hasFiles
                        ? 'border-emerald-200 bg-emerald-50/20'
                        : cat.required
                        ? 'border-slate-200 bg-white'
                        : 'border-slate-100 bg-slate-50/40'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-900">
                            {cat.title}
                          </h3>
                          {cat.required ? (
                            <span className="text-[10px] font-semibold text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.2 rounded">
                              Required
                            </span>
                          ) : (
                            <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                              Optional
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {cat.description}
                        </p>
                        <p className="text-[11px] text-slate-400 font-mono">
                          Accepted: {cat.acceptedFormats}
                        </p>
                      </div>

                      {/* Hidden File Input & Upload Trigger */}
                      <div className="shrink-0 pt-1">
                        <input
                          type="file"
                          ref={(el) => {
                            fileInputRefs.current[cat.id] = el;
                          }}
                          accept={cat.acceptAttribute}
                          multiple={cat.id === 'plant_photos'}
                          onChange={(e) => handleFileUpload(cat.id, e)}
                          className="hidden"
                          id={`file-input-${cat.id}`}
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRefs.current[cat.id]?.click()}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                        >
                          <Upload className="w-3.5 h-3.5 text-teal-700" />
                          <span>
                            {hasFiles && cat.id !== 'plant_photos'
                              ? 'Add another'
                              : 'Upload file'}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Uploaded Files Table / List for this category */}
                    {hasFiles && (
                      <div className="mt-4 pt-3 border-t border-slate-200/80 space-y-2">
                        {uploadedFiles.map((doc) => (
                          <div
                            key={doc.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 bg-white rounded-lg border border-slate-200 text-xs"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <FileText className="w-4 h-4 text-teal-700 shrink-0" />
                              <div className="min-w-0">
                                <p className="font-semibold text-slate-900 truncate font-mono">
                                  {doc.fileName}
                                </p>
                                <p className="text-[11px] text-slate-400">
                                  {formatFileSize(doc.fileSize)} · {doc.fileType}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Status: {doc.status}</span>
                              </span>

                              {/* Replace File Trigger */}
                              <input
                                type="file"
                                ref={(el) => {
                                  replaceInputRefs.current[doc.id] = el;
                                }}
                                accept={cat.acceptAttribute}
                                onChange={(e) => handleFileReplace(doc.id, e)}
                                className="hidden"
                                id={`replace-input-${doc.id}`}
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  replaceInputRefs.current[doc.id]?.click()
                                }
                                className="text-slate-500 hover:text-slate-800 p-1 rounded hover:bg-slate-100 transition-colors"
                                title="Replace file"
                              >
                                <RefreshCw className="w-3.5 h-3.5" />
                              </button>

                              {/* Remove File Trigger */}
                              <button
                                type="button"
                                onClick={() => removeDocument(doc.id)}
                                className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                                title="Remove file"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Desktop Navigation Actions */}
          <div className="pt-4 hidden sm:flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate('/application/product-selection')}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Product Selection</span>
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-sm font-semibold shadow-sm transition-all flex items-center gap-2"
            >
              <span>Continue to Payment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </main>

      {/* Sticky Mobile Continue Bar (<= 15% viewport height compliance) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 p-3 shadow-lg flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/application/product-selection')}
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
          <span>Continue to Payment</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

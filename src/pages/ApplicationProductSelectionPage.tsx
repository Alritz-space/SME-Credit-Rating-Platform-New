import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Stepper } from '../components/Stepper';
import { formatINR, PRODUCTS } from '../utils/constants';
import {
  Check,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Info,
  ShieldCheck,
} from 'lucide-react';

export const ApplicationProductSelectionPage: React.FC = () => {
  const { state, toggleProduct, navigate } = useApp();
  const [error, setError] = useState<string>('');

  const selectedProducts = PRODUCTS.filter((p) =>
    state.selectedProductIds.includes(p.id)
  );

  const subtotal = selectedProducts.reduce((sum, p) => sum + p.price, 0);
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + gst;

  const handleContinue = () => {
    if (state.selectedProductIds.length === 0) {
      setError('Please select at least one readiness product or verification service to proceed.');
      return;
    }
    setError('');
    navigate('/application/kyc');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-28 sm:pb-12">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Intro */}
        <div className="mb-8">
          <span className="text-xs font-bold text-teal-700 uppercase tracking-wider font-mono">
            Step B · Service Configuration
          </span>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Choose Diagnostic & Verification Packages
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Select the assessment modules required for your enterprise. You can bundle multiple services with combined GST invoicing.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Products List (Left/Main) */}
          <div className="lg:col-span-8 space-y-4">
            {PRODUCTS.map((prod) => {
              const isSelected = state.selectedProductIds.includes(prod.id);

              return (
                <div
                  key={prod.id}
                  onClick={() => {
                    toggleProduct(prod.id);
                    if (error) setError('');
                  }}
                  className={`cursor-pointer rounded-2xl p-5 sm:p-6 transition-all border bg-white ${
                    isSelected
                      ? 'border-teal-700 ring-2 ring-teal-700 shadow-md'
                      : 'border-slate-200 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Custom Checkbox */}
                    <div className="pt-0.5">
                      <div
                        className={`w-5 h-5 rounded flex items-center justify-center transition-colors border ${
                          isSelected
                            ? 'bg-teal-700 border-teal-700 text-white'
                            : 'border-slate-300 bg-white hover:border-slate-400'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-slate-900">
                            {prod.title}
                          </h3>
                          {prod.recommended && (
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-teal-900 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
                              Recommended for loan readiness
                            </span>
                          )}
                        </div>

                        <div className="text-right">
                          <span className="text-lg font-black text-slate-900 font-mono">
                            {formatINR(prod.price)}
                          </span>
                          <span className="text-[10px] text-slate-400 block">+18% GST</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {prod.description}
                      </p>

                      <div className="pt-1 flex items-center gap-2 text-[11px] text-slate-500">
                        <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                        <span>Includes detailed diagnostic breakdown & lender discussion guide</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Regulatory Guidance Note */}
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5 mt-6">
              <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Important Guidance Disclaimer:</strong> Your Credit Readiness Score is an internal guidance tool. It does not guarantee finance, loan approval, a credit limit, or commercial terms.
              </p>
            </div>

            {/* Back Button (Desktop) */}
            <div className="pt-4 hidden sm:block">
              <button
                type="button"
                onClick={() => navigate('/application/registration')}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Registration Details</span>
              </button>
            </div>
          </div>

          {/* Sticky Order Summary Sidebar (Desktop) */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Order Summary
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  Selected Readiness Services
                </h3>
              </div>

              {selectedProducts.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400 italic">
                  Select at least one package to continue
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedProducts.map((p) => (
                    <div key={p.id} className="flex justify-between items-start text-xs">
                      <span className="text-slate-700 font-medium">{p.title}</span>
                      <span className="font-mono font-semibold text-slate-900">
                        {formatINR(p.price)}
                      </span>
                    </div>
                  ))}

                  <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-mono text-slate-900">{formatINR(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GST (18% IGST / CGST+SGST)</span>
                      <span className="font-mono text-slate-900">{formatINR(gst)}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-sm font-bold text-slate-900">
                    <span>Total Payable</span>
                    <span className="font-mono text-base text-teal-800">
                      {formatINR(total)}
                    </span>
                  </div>
                </div>
              )}

              <div className="pt-2 hidden sm:block">
                <button
                  type="button"
                  onClick={handleContinue}
                  className="w-full py-3 px-4 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <span>Continue to KYC & Documents</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="text-[11px] text-slate-400 text-center space-y-1 pt-1">
                <p>Tax invoice generated upon payment</p>
                <p>Application Ref: {state.referenceNumber}</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Sticky Mobile Continue Bar (<= 15% viewport height compliance) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 p-3 shadow-lg flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => navigate('/application/registration')}
          className="p-2.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="text-right">
          <span className="text-[10px] text-slate-500 block">Total incl. GST</span>
          <span className="text-xs font-bold font-mono text-teal-800">{formatINR(total)}</span>
        </div>

        <button
          type="button"
          onClick={handleContinue}
          className="py-2.5 px-4 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-semibold text-xs shadow-md flex items-center gap-1.5"
        >
          <span>Continue to KYC</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

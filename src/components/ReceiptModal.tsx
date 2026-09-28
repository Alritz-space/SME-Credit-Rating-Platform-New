import React from 'react';
import { X, Printer, CheckCircle2, Building, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatINR, PRODUCTS } from '../utils/constants';

interface ReceiptModalProps {
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ onClose }) => {
  const { state } = useApp();
  const payment = state.payment;

  if (!payment) return null;

  const handlePrint = () => {
    window.print();
  };

  const paidProductIds = payment.paidProductIds && payment.paidProductIds.length > 0
    ? payment.paidProductIds
    : state.selectedProductIds;

  const paidProducts = PRODUCTS.filter((p) =>
    paidProductIds.includes(p.id)
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full flex flex-col border border-slate-200 overflow-hidden">
        {/* Modal Top Actions (no-print) */}
        <div className="flex items-center justify-between px-6 py-3 bg-slate-50 border-b border-slate-200 no-print">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-semibold text-slate-700">Official Payment Receipt</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded text-xs font-semibold transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
              aria-label="Close receipt modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Content */}
        <div className="p-6 sm:p-8 space-y-6 text-slate-800 bg-white" id="printable-receipt">
          {/* Header */}
          <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                  <span className="text-amber-500 font-extrabold mr-0.5">₹</span>
                  <span className="text-teal-400">S</span>
                </div>
                <h2 className="text-base font-bold text-slate-900">
                  SME Readiness Portal India
                </h2>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                MSME Verification & Credit Diagnostic Services
              </p>
              <p className="text-[11px] text-slate-500 font-mono">
                GSTIN: 07AAACS9912A1ZX · SAC Code: 998311
              </p>
            </div>
            <div className="sm:text-right">
              <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                Payment Completed
              </span>
              <p className="text-xs font-bold text-slate-900 mt-1.5 font-mono">
                {payment.receiptNumber}
              </p>
              <p className="text-[11px] text-slate-500">
                {new Date(payment.timestamp).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>

          {/* Customer & Transaction Meta */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div>
              <p className="text-slate-500 text-[11px]">Billed To</p>
              <p className="font-bold text-slate-900 mt-0.5">{state.business.legalName}</p>
              <p className="text-slate-600">Attn: {state.user.fullName} ({state.user.association})</p>
              <p className="text-slate-500 font-mono text-[11px] mt-0.5">
                GSTIN: {state.business.gstin || 'Unregistered / Exempt'}
              </p>
            </div>
            <div>
              <p className="text-slate-500 text-[11px]">Transaction Details</p>
              <p className="font-mono font-medium text-slate-900 mt-0.5">
                Txn ID: {payment.paymentId}
              </p>
              <p className="text-slate-600 font-mono">
                App Ref: {state.referenceNumber}
              </p>
              <p className="text-slate-600 capitalize">
                Method: {payment.method.toUpperCase()}
                {payment.upiId && ` (${payment.upiId})`}
                {payment.cardLast4 && ` (Ending ${payment.cardLast4})`}
                {payment.bankName && ` (${payment.bankName})`}
              </p>
            </div>
          </div>

          {/* Line items table */}
          <div>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="text-left py-2 font-medium">Service Description</th>
                  <th className="text-right py-2 font-medium">Amount (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paidProducts.map((p) => (
                  <tr key={p.id}>
                    <td className="py-2.5 text-slate-800">
                      <span className="font-medium">{p.title}</span>
                      <span className="block text-[11px] text-slate-500">
                        Prototype Verification & Assessment Report
                      </span>
                    </td>
                    <td className="py-2.5 text-right font-mono font-medium text-slate-900">
                      {formatINR(p.price)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t border-slate-300 font-medium">
                <tr>
                  <td className="pt-3 text-slate-600">Subtotal</td>
                  <td className="pt-3 text-right font-mono">{formatINR(payment.subtotal)}</td>
                </tr>
                <tr>
                  <td className="py-1 text-slate-600">GST (18% IGST / CGST+SGST)</td>
                  <td className="py-1 text-right font-mono">{formatINR(payment.gst)}</td>
                </tr>
                <tr className="border-t border-slate-200 font-bold text-slate-900 text-sm">
                  <td className="pt-2">Total Amount Paid</td>
                  <td className="pt-2 text-right font-mono text-teal-800">
                    {formatINR(payment.total)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Disclaimer footer */}
          <div className="text-[10px] text-slate-500 border-t border-slate-200 pt-3 space-y-1">
            <p>
              * This is a computer-generated prototype demonstration invoice. No monetary payment was debited from any external financial institution or payment gateway.
            </p>
            <p>
              * The diagnostic guidance score generated through this portal is purely advisory and does not represent an official SEBI/RBI credit rating or an obligation by any commercial lender.
            </p>
          </div>
        </div>

        {/* Modal Bottom (no-print) */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end no-print">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

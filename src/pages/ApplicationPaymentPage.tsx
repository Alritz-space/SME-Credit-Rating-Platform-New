import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Stepper } from '../components/Stepper';
import { formatINR, PRODUCTS } from '../utils/constants';
import {
  ShieldCheck,
  CheckCircle2,
  CreditCard,
  Building,
  Smartphone,
  ArrowRight,
  ArrowLeft,
  Download,
  AlertCircle,
  Lock,
  FileText,
} from 'lucide-react';
import { ReceiptModal } from '../components/ReceiptModal';

export const ApplicationPaymentPage: React.FC = () => {
  const { state, processDemoPayment, navigate } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('ananya@okaxis');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 4112');
  const [cardHolder, setCardHolder] = useState(state.user.fullName || 'Ananya Sharma');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // Confirmation dialog state
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedProducts = PRODUCTS.filter((p) =>
    state.selectedProductIds.includes(p.id)
  );

  const paidProductIds = state.payment?.paidProductIds && state.payment.paidProductIds.length > 0
    ? state.payment.paidProductIds
    : state.selectedProductIds;

  const paidProducts = PRODUCTS.filter((p) =>
    paidProductIds.includes(p.id)
  );

  const subtotal = selectedProducts.reduce((sum, p) => sum + p.price, 0);
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + gst;

  const isAlreadyPaid = state.payment?.status === 'successful';

  const handleOpenConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmModalOpen(true);
  };

  const handleConfirmPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      processDemoPayment(paymentMethod, {
        upiId: paymentMethod === 'upi' ? upiId : undefined,
        cardLast4: paymentMethod === 'card' ? '4112' : undefined,
        bankName: paymentMethod === 'netbanking' ? selectedBank : undefined,
      });
      setIsProcessing(false);
      setConfirmModalOpen(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-24 sm:pb-12">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* If already paid, show Success Screen */}
        {isAlreadyPaid && state.payment ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-lg text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border-2 border-emerald-200">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                Verification Fee Paid
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Payment successful
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                Your payment has been simulated and recorded in this prototype. Your draft Credit Readiness Report is now available.
              </p>
            </div>

            {/* Details Box */}
            <div className="max-w-md mx-auto bg-slate-50 rounded-xl p-5 border border-slate-200 text-xs text-left space-y-3">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Payment ID</span>
                <span className="font-mono font-bold text-slate-900">
                  {state.payment.paymentId}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Application Reference</span>
                <span className="font-mono text-slate-700">
                  {state.referenceNumber}
                </span>
              </div>

              {/* Itemized paid products */}
              <div className="py-1 border-b border-slate-200 space-y-1.5">
                <span className="text-slate-500 block text-[11px] font-semibold uppercase tracking-wider">
                  Enrolled Products ({paidProducts.length})
                </span>
                {paidProducts.map((p) => (
                  <div key={p.id} className="flex justify-between text-slate-800">
                    <span>{p.title}</span>
                    <span className="font-mono text-slate-900 font-medium">
                      {formatINR(p.price)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between py-0.5 text-slate-600">
                <span>Subtotal</span>
                <span className="font-mono text-slate-900">{formatINR(state.payment.subtotal)}</span>
              </div>
              <div className="flex justify-between py-0.5 text-slate-600">
                <span>GST (18% IGST)</span>
                <span className="font-mono text-slate-900">{formatINR(state.payment.gst)}</span>
              </div>

              <div className="flex justify-between py-1.5 border-t border-slate-300 font-bold">
                <span className="text-slate-900">Total Amount Paid</span>
                <span className="font-mono text-teal-800 text-sm">
                  {formatINR(state.payment.total)}
                </span>
              </div>

              <div className="flex justify-between py-1 border-t border-slate-200 text-[11px]">
                <span className="text-slate-500">Payment Timestamp</span>
                <span className="text-slate-700 font-mono">
                  {new Date(state.payment.timestamp).toLocaleString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setReceiptModalOpen(true)}
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download receipt</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/application/product-selection')}
                className="w-full sm:w-auto px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs sm:text-sm font-semibold transition-colors"
              >
                Change products
              </button>

              <button
                type="button"
                onClick={() => navigate('/application/report')}
                className="w-full sm:w-auto px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Continue to draft report</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Normal Payment Flow */
          <div className="space-y-8">
            <div>
              <span className="text-xs font-bold text-teal-700 uppercase tracking-wider font-mono">
                Step D · Verification Fee Payment
              </span>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
                Review Order & Simulate Payment
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Review your order details and choose your preferred simulated payment mode.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Order Review */}
              <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
                <div className="border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase font-mono">
                    Order Review
                  </span>
                  <h2 className="text-base font-bold text-slate-900 mt-1">
                    Application Summary
                  </h2>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Applicant Name:</span>
                      <span className="font-semibold text-slate-900">{state.user.fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Business Name:</span>
                      <span className="font-semibold text-slate-900 text-right">
                        {state.business.legalName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Application Reference:</span>
                      <span className="font-mono font-semibold text-teal-800">
                        {state.referenceNumber}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-800 mb-2">Selected Products</h3>
                    <div className="space-y-2">
                      {selectedProducts.map((p) => (
                        <div
                          key={p.id}
                          className="flex justify-between items-center py-1.5 border-b border-slate-100"
                        >
                          <span className="text-slate-700">{p.title}</span>
                          <span className="font-mono font-semibold text-slate-900">
                            {formatINR(p.price)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 space-y-1.5">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal</span>
                      <span className="font-mono text-slate-900">{formatINR(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>GST (18% IGST)</span>
                      <span className="font-mono text-slate-900">{formatINR(gst)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                      <span>Total Payable</span>
                      <span className="font-mono text-base text-teal-800">
                        {formatINR(total)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-2">
                  <Lock className="w-3.5 h-3.5 text-teal-600" />
                  <span>256-bit Simulated SSL Encryption · Demo Environment</span>
                </div>
              </div>

              {/* Right Column: Payment Methods */}
              <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Select Payment Method
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Choose any option below to simulate instant checkout.
                  </p>
                </div>

                {/* Tabs for UPI, Card, Net Banking */}
                <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                      paymentMethod === 'upi'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>UPI</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                      paymentMethod === 'card'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                      paymentMethod === 'netbanking'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Building className="w-3.5 h-3.5" />
                    <span>Net Banking</span>
                  </button>
                </div>

                {/* Tab 1: UPI */}
                {paymentMethod === 'upi' && (
                  <div className="space-y-4 text-xs">
                    <div>
                      <label
                        htmlFor="upi-id-input"
                        className="block font-semibold text-slate-700 mb-1"
                      >
                        Virtual Payment Address (UPI ID)
                      </label>
                      <input
                        id="upi-id-input"
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="username@bank"
                        className="w-full px-3.5 py-2.5 text-sm font-mono bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      />
                      <p className="text-slate-400 text-[11px] mt-1">
                        Prefilled with demo UPI ID: <span className="font-mono text-slate-600">ananya@okaxis</span>
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-500 space-y-1">
                      <p className="font-semibold text-slate-700">Supported UPI Handles:</p>
                      <p className="text-[11px]">@okaxis, @okhdfcbank, @oksbi, @paytm, @ybl, @gpay</p>
                    </div>
                  </div>
                )}

                {/* Tab 2: Debit / Credit Card */}
                {paymentMethod === 'card' && (
                  <div className="space-y-4 text-xs">
                    <div>
                      <label
                        htmlFor="card-number-input"
                        className="block font-semibold text-slate-700 mb-1"
                      >
                        Card number
                      </label>
                      <input
                        id="card-number-input"
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm font-mono bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label
                          htmlFor="card-expiry-input"
                          className="block font-semibold text-slate-700 mb-1"
                        >
                          Expiry (MM/YY)
                        </label>
                        <input
                          id="card-expiry-input"
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full px-3.5 py-2 text-sm font-mono bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="card-cvv-input"
                          className="block font-semibold text-slate-700 mb-1"
                        >
                          CVV
                        </label>
                        <input
                          id="card-cvv-input"
                          type="password"
                          maxLength={3}
                          value="892"
                          readOnly
                          className="w-full px-3.5 py-2 text-sm font-mono bg-slate-50 border border-slate-300 rounded-lg"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="cardholder-name-input"
                        className="block font-semibold text-slate-700 mb-1"
                      >
                        Cardholder name
                      </label>
                      <input
                        id="cardholder-name-input"
                        type="text"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>
                  </div>
                )}

                {/* Tab 3: Net Banking */}
                {paymentMethod === 'netbanking' && (
                  <div className="space-y-4 text-xs">
                    <div>
                      <label
                        htmlFor="netbanking-select"
                        className="block font-semibold text-slate-700 mb-1"
                      >
                        Select Bank
                      </label>
                      <select
                        id="netbanking-select"
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      >
                        <option value="HDFC Bank">HDFC Bank</option>
                        <option value="State Bank of India">State Bank of India</option>
                        <option value="ICICI Bank">ICICI Bank</option>
                        <option value="Axis Bank">Axis Bank</option>
                        <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                        <option value="Punjab National Bank">Punjab National Bank</option>
                      </select>
                    </div>

                    <p className="text-slate-500 leading-relaxed text-[11px]">
                      You will be directed to your bank’s simulated authorization portal upon continuing.
                    </p>
                  </div>
                )}

                {/* Pay Button Trigger */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleOpenConfirm}
                    className="w-full py-3.5 px-4 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Pay securely {formatINR(total)}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Back to KYC button */}
            <div className="pt-4 hidden sm:block">
              <button
                type="button"
                onClick={() => navigate('/application/kyc')}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to KYC & Documents</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Confirmation Dialog Modal */}
      {confirmModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center space-y-4 border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center mx-auto border border-teal-200">
              <Lock className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">
                Confirm Demo Payment
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                “This is a demo payment. No money will be charged.”
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs flex justify-between font-mono font-bold text-slate-800">
              <span>Payable Amount:</span>
              <span className="text-teal-800">{formatINR(total)}</span>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setConfirmModalOpen(false)}
                disabled={isProcessing}
                className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmPayment}
                disabled={isProcessing}
                className="flex-1 py-2.5 px-3 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-1.5"
              >
                {isProcessing ? (
                  <span>Processing...</span>
                ) : (
                  <span>Confirm Pay</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {receiptModalOpen && (
        <ReceiptModal onClose={() => setReceiptModalOpen(false)} />
      )}
    </div>
  );
};

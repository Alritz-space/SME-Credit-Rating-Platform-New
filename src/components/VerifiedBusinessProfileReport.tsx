import React from 'react';
import { ApplicationState } from '../types';
import { maskGstin, maskPan } from '../utils/masking';
import {
  BadgeCheck,
  Building,
  CheckCircle2,
  FileCheck,
  Globe,
  MapPin,
  Shield,
  UserCheck,
} from 'lucide-react';

interface VerifiedBusinessProfileReportProps {
  state: ApplicationState;
  issueDate: string;
}

export const VerifiedBusinessProfileReport: React.FC<VerifiedBusinessProfileReportProps> = ({
  state,
  issueDate,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6 print:border-slate-300 print:shadow-none">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center font-bold">
            <BadgeCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 font-mono">
                Section 3 · Supplemental Report
              </span>
              <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded">
                Verified Trust Profile
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
              Verified Business Profile Dossier
            </h3>
          </div>
        </div>

        <div className="text-left sm:text-right">
          <span className="text-[11px] text-slate-400 block font-mono">
            VERIFICATION SEAL
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Verified Enterprise Identity
          </span>
        </div>
      </div>

      <p className="text-xs text-slate-600 leading-relaxed">
        A reviewed company profile verifying registration status, authorized management, verified physical premises, and key tax credentials for commercial partnerships.
      </p>

      {/* Verified Data Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Left Column: Registered Identity */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
          <h4 className="font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
            <Building className="w-4 h-4 text-teal-700" />
            <span>Corporate Identity Verification</span>
          </h4>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <span className="text-slate-400 block">Legal Entity Name:</span>
              <span className="font-bold text-slate-800">{state.business.legalName}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Trade Name:</span>
              <span className="font-bold text-slate-800">{state.business.tradeName}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Constitution:</span>
              <span className="font-medium text-slate-700">{state.business.constitution}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Incorporation:</span>
              <span className="font-mono text-slate-700">{state.business.incorporationDate}</span>
            </div>
            <div>
              <span className="text-slate-400 block">PAN Status:</span>
              <span className="font-mono font-bold text-emerald-700">Verified ({maskPan(state.business.pan)})</span>
            </div>
            <div>
              <span className="text-slate-400 block">GSTIN Status:</span>
              <span className="font-mono font-bold text-emerald-700">Active ({maskGstin(state.business.gstin)})</span>
            </div>
          </div>
        </div>

        {/* Right Column: Physical & Signatory Audit */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
          <h4 className="font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
            <UserCheck className="w-4 h-4 text-teal-700" />
            <span>Authorized Signatory & Premises</span>
          </h4>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <span className="text-slate-400 block">Primary Signatory:</span>
              <span className="font-bold text-slate-800">{state.user.fullName}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Role / Designation:</span>
              <span className="font-medium text-slate-700">{state.user.association}</span>
            </div>
            <div className="col-span-2">
              <span className="text-slate-400 block">Verified Physical Premises:</span>
              <span className="text-slate-700">
                {state.business.addressLine1}, {state.business.addressLine2}, {state.business.city}, {state.business.state} – {state.business.pinCode}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Team Strength:</span>
              <span className="font-mono text-slate-700">{state.business.numberOfEmployees} full-time employees</span>
            </div>
            <div>
              <span className="text-slate-400 block">Language Preference:</span>
              <span className="text-slate-700">{state.business.preferredLanguage}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Seal Note */}
      <div className="bg-emerald-50/50 rounded-xl p-3.5 border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-950">
        <Shield className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Commercial Verification Seal:</strong> This profile dossier confirms that the business registration, authorized management, and principal place of business have completed initial validation against uploaded statutory documentation.
        </p>
      </div>
    </div>
  );
};

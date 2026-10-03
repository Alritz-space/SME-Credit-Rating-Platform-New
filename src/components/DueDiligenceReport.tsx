import React from 'react';
import { ApplicationState } from '../types';
import {
  Briefcase,
  CheckCircle2,
  AlertTriangle,
  Scale,
  FileSearch,
  ShieldAlert,
  Clock,
  Layers,
} from 'lucide-react';

interface DueDiligenceReportProps {
  state: ApplicationState;
  issueDate: string;
}

export const DueDiligenceReport: React.FC<DueDiligenceReportProps> = ({
  state,
  issueDate,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6 print:border-slate-300 print:shadow-none">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center font-bold">
            <FileSearch className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700 font-mono">
                Section 4 · Supplemental Report
              </span>
              <span className="text-[10px] font-semibold bg-purple-50 text-purple-800 border border-purple-200 px-2 py-0.5 rounded">
                Deep Review Package
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
              Due Diligence & Partnership Review
            </h3>
          </div>
        </div>

        <div className="text-left sm:text-right">
          <span className="text-[11px] text-slate-400 block font-mono">
            COMPLIANCE STATUS
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-800 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-md">
            Satisfactory Compliance
          </span>
        </div>
      </div>

      <p className="text-xs text-slate-600 leading-relaxed">
        A comprehensive review package intended for prospective joint ventures, institutional business partnerships, and preliminary banking underwriting preparations.
      </p>

      {/* Due Diligence Audit Checkpoints */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        {/* Checkpoint 1 */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-900">Legal & Entity Constitution</h4>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Clear
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Registered as {state.business.constitution} with valid MCA / Registrar records and designated key management personnel.
          </p>
        </div>

        {/* Checkpoint 2 */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-900">Banking Cash Flow Health</h4>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Verified
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Six months of operative banking statements examined for cheque returns, inward customer turnover, and statutory tax debits.
          </p>
        </div>

        {/* Checkpoint 3 */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-900">Physical Asset Presence</h4>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Confirmed
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Photographic inspection evidence of operating facility floor and commercial equipment received and catalogued.
          </p>
        </div>
      </div>

      {/* Risk Assessment & Advisory Remarks */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3 text-xs">
        <h4 className="font-bold text-slate-900 uppercase tracking-wide text-[11px]">
          Due Diligence Summary & Partnership Advisory
        </h4>
        <div className="space-y-2 text-slate-700">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Corporate Governance:</strong> No statutory non-compliance flagged in uploaded filings. Authorized signatory ({state.user.fullName}) holds valid corporate authority.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <Clock className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
            <span>
              <strong>Financial Record Readiness:</strong> Recommend maintaining continuous audited financial statements for FY 2025-26 to support structured discussions with financial institutions.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

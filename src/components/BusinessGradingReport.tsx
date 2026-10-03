import React from 'react';
import { ApplicationState } from '../types';
import {
  Award,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  ShieldCheck,
  Building2,
  Users,
  Gauge,
} from 'lucide-react';

interface BusinessGradingReportProps {
  state: ApplicationState;
  issueDate: string;
}

export const BusinessGradingReport: React.FC<BusinessGradingReportProps> = ({
  state,
  issueDate,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6 print:border-slate-300 print:shadow-none">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 font-mono">
                Section 2 · Supplemental Report
              </span>
              <span className="text-[10px] font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200 px-2 py-0.5 rounded">
                Operational Assessment
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
              Business Grading & Maturity Assessment
            </h3>
          </div>
        </div>

        <div className="text-left sm:text-right">
          <span className="text-[11px] text-slate-400 block font-mono">
            GRADE LEVEL
          </span>
          <span className="text-xl font-black text-indigo-700 font-mono">
            SME-2 (High Maturity)
          </span>
        </div>
      </div>

      <p className="text-xs text-slate-600 leading-relaxed">
        This operational grading assessment evaluates your manufacturing/service workflow stability, supplier track record, buyer procurement standards, and operational resilience.
      </p>

      {/* Grade Matrix & Pillar Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pillar 1 */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-700">Operational Stability</span>
            <span className="font-mono font-bold text-indigo-700">82/100</span>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div className="bg-indigo-600 h-full w-[82%]" />
          </div>
          <p className="text-[11px] text-slate-500">
            Plant floor photos and workflow continuity verified.
          </p>
        </div>

        {/* Pillar 2 */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-700">Management & Team</span>
            <span className="font-mono font-bold text-indigo-700">78/100</span>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div className="bg-indigo-600 h-full w-[78%]" />
          </div>
          <p className="text-[11px] text-slate-500">
            {state.business.numberOfEmployees} full-time personnel on payroll.
          </p>
        </div>

        {/* Pillar 3 */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-700">Statutory Track Record</span>
            <span className="font-mono font-bold text-emerald-600">88/100</span>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-600 h-full w-[88%]" />
          </div>
          <p className="text-[11px] text-slate-500">
            Valid GSTIN and incorporation track record since {state.business.incorporationDate.slice(0, 4)}.
          </p>
        </div>

        {/* Pillar 4 */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-700">Procurement Readiness</span>
            <span className="font-mono font-bold text-indigo-700">75/100</span>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div className="bg-indigo-600 h-full w-[75%]" />
          </div>
          <p className="text-[11px] text-slate-500">
            Suitable for corporate vendor empanelment & RFP submissions.
          </p>
        </div>
      </div>

      {/* Operational Highlights Box */}
      <div className="bg-indigo-50/40 rounded-xl p-4 border border-indigo-100 space-y-3">
        <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wide">
          Procurement & Operational Observations
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-700">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Supply Chain Consistency:</strong> Operating in {state.business.subIndustry} with documented industrial premises in {state.business.city}.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Corporate Scale:</strong> Turnover tier ({state.business.yearlyTurnover}) aligns with tier-2 institutional supplier criteria.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

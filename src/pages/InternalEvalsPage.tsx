import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  EVAL_TEST_CASES,
  getStoredEvalResults,
  runAllEvalTests,
  runEvalTest,
} from '../utils/evalSuite';
import { EvalTestResult } from '../types/scoring';
import {
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ShieldAlert,
  ArrowLeft,
  Terminal,
  Activity,
  AlertTriangle,
} from 'lucide-react';

export const InternalEvalsPage: React.FC = () => {
  const { resetApplication, navigate } = useApp();
  const [results, setResults] = useState<Record<number, EvalTestResult>>({});
  const [runningAll, setRunningAll] = useState(false);
  const [activeRunningId, setActiveRunningId] = useState<number | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Load latest run from localStorage on mount
  useEffect(() => {
    const stored = getStoredEvalResults();
    if (stored.length > 0) {
      const map: Record<number, EvalTestResult> = {};
      stored.forEach((r) => {
        map[r.id] = r;
      });
      setResults(map);
    }
  }, []);

  const handleRunAll = () => {
    setRunningAll(true);
    setTimeout(() => {
      const allResults = runAllEvalTests();
      const map: Record<number, EvalTestResult> = {};
      allResults.forEach((r) => {
        map[r.id] = r;
      });
      setResults(map);
      setRunningAll(false);
    }, 150);
  };

  const handleRunSingle = (testId: number) => {
    setActiveRunningId(testId);
    setTimeout(() => {
      const result = runEvalTest(testId);
      setResults((prev) => {
        const updated = { ...prev, [testId]: result };
        try {
          localStorage.setItem(
            'sme_eval_console_latest_run',
            JSON.stringify(Object.values(updated))
          );
        } catch {
          // ignore
        }
        return updated;
      });
      setActiveRunningId(null);
    }, 100);
  };

  const handleConfirmReset = () => {
    resetApplication();
    setShowResetConfirm(false);
    navigate('/');
  };

  // Stats calculation
  const totalCases = EVAL_TEST_CASES.length;
  const passCount = Object.values(results).filter((r) => r.status === 'PASS').length;
  const failCount = Object.values(results).filter((r) => r.status === 'FAIL').length;
  const notRunCount = totalCases - passCount - failCount;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Breadcrumb & Return */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to application</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 bg-amber-950/60 border border-amber-800/80 px-3 py-1 rounded-full">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Restricted Internal QA Environment</span>
          </div>
        </div>

        {/* Console Header */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-teal-400 text-xs font-mono uppercase tracking-wider mb-1">
                <Terminal className="w-4 h-4" />
                <span>Deterministic Model Verification</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Internal Evaluation Console — Demo Only
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                Executes formal regression tests for scoring bounds, policy checks, sensitive-data masking, route protection gates, and user review immutability.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleRunAll}
                disabled={runningAll}
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 disabled:bg-teal-800 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{runningAll ? 'Running suite...' : 'Run all 18 tests'}</span>
              </button>

              <button
                onClick={() => setShowResetConfirm(true)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs sm:text-sm rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-amber-400" />
                <span>Reset demo data</span>
              </button>
            </div>
          </div>

          {/* Test Metric Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800/80">
            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[11px] font-mono text-slate-400 block uppercase">
                Total Test Cases
              </span>
              <span className="text-2xl font-bold font-mono text-white">{totalCases}</span>
            </div>

            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[11px] font-mono text-emerald-400 block uppercase">
                Passed Tests
              </span>
              <span className="text-2xl font-bold font-mono text-emerald-400">
                {passCount}
              </span>
            </div>

            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[11px] font-mono text-rose-400 block uppercase">
                Failed Tests
              </span>
              <span className="text-2xl font-bold font-mono text-rose-400">
                {failCount}
              </span>
            </div>

            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[11px] font-mono text-slate-400 block uppercase">
                Not Run
              </span>
              <span className="text-2xl font-bold font-mono text-slate-400">
                {notRunCount}
              </span>
            </div>
          </div>
        </div>

        {/* Test Case Suite Listing */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-mono">
            <span>EVALUATION SUITE (18 GUARDRAIL CHECKS)</span>
            <span>SPECIFICATION REVISION: v1.0.0-deterministic</span>
          </div>

          <div className="space-y-3">
            {EVAL_TEST_CASES.map((tc) => {
              const res = results[tc.id];
              const status = res?.status || 'NOT_RUN';

              return (
                <div
                  key={tc.id}
                  className={`rounded-2xl p-5 border transition-all ${
                    status === 'PASS'
                      ? 'bg-slate-950/80 border-emerald-900/40 hover:border-emerald-700/60'
                      : status === 'FAIL'
                      ? 'bg-rose-950/20 border-rose-800/80 ring-1 ring-rose-800/50'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start sm:items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 text-teal-400 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                        #{tc.id}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-white tracking-wide">
                            {tc.name}
                          </h3>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {tc.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      {status === 'PASS' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono uppercase bg-emerald-950 text-emerald-400 border border-emerald-800">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>PASS</span>
                        </span>
                      )}

                      {status === 'FAIL' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono uppercase bg-rose-950 text-rose-300 border border-rose-800">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>FAIL</span>
                        </span>
                      )}

                      {status === 'NOT_RUN' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono uppercase bg-slate-900 text-slate-400 border border-slate-800">
                          <HelpCircle className="w-3.5 h-3.5" />
                          <span>NOT RUN</span>
                        </span>
                      )}

                      <button
                        onClick={() => handleRunSingle(tc.id)}
                        disabled={activeRunningId === tc.id || runningAll}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 disabled:opacity-50 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Play className="w-3 h-3" />
                        <span>Run test</span>
                      </button>
                    </div>
                  </div>

                  {/* Given / When / Then details */}
                  <div className="mt-4 pt-3 border-t border-slate-800/60 grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                    <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                      <span className="text-[10px] font-mono uppercase text-slate-500 block font-bold">
                        GIVEN
                      </span>
                      <span className="text-slate-300 text-[11px]">{tc.given}</span>
                    </div>

                    <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                      <span className="text-[10px] font-mono uppercase text-slate-500 block font-bold">
                        WHEN
                      </span>
                      <span className="text-slate-300 text-[11px]">{tc.when}</span>
                    </div>

                    <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                      <span className="text-[10px] font-mono uppercase text-slate-500 block font-bold">
                        THEN
                      </span>
                      <span className="text-slate-300 text-[11px]">{tc.then}</span>
                    </div>
                  </div>

                  {/* Results box if test was executed */}
                  {res && (
                    <div className="mt-3 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1 font-mono">
                      <div className="text-slate-400">
                        <strong className="text-slate-300">Expected:</strong> {res.expected}
                      </div>
                      <div className="text-teal-300">
                        <strong className="text-teal-400">Actual:</strong> {res.actual}
                      </div>
                      {res.failureReason && (
                        <div className="text-rose-400">
                          <strong>Failure Reason:</strong> {res.failureReason}
                        </div>
                      )}
                      {res.executedAt && (
                        <div className="text-[10px] text-slate-500 pt-1">
                          Executed at: {new Date(res.executedAt).toLocaleTimeString()}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer info notice */}
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-500 flex items-center justify-between">
          <span>SME Readiness Portal India · Internal Test Harness</span>
          <span>Zero external AI calls · Pure deterministic verification</span>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 text-slate-100">
            <div className="flex items-center gap-3 text-amber-400">
              <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-800 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Reset Demo Data?</h3>
                <p className="text-xs text-slate-400">Confirmation required</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              This action will reset local state back to the fictional demo business profile (Sunrise Components Private Limited). Any unsaved manual edits in the browser will be cleared.
            </p>

            <div className="pt-2 flex justify-end gap-3 text-xs font-semibold">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-lg transition-colors cursor-pointer"
              >
                Yes, Reset Demo Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

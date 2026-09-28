import React from 'react';
import { Check, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export interface StepItem {
  id: string;
  stepLetter: string;
  label: string;
  shortLabel: string;
  path: string;
  key: 'registration' | 'products' | 'kyc' | 'payment' | 'report';
}

export const APPLICATION_STEPS: StepItem[] = [
  {
    id: 'step-a',
    stepLetter: 'A',
    label: 'Registration',
    shortLabel: 'Registration',
    path: '/application/registration',
    key: 'registration',
  },
  {
    id: 'step-b',
    stepLetter: 'B',
    label: 'Product selection',
    shortLabel: 'Products',
    path: '/application/product-selection',
    key: 'products',
  },
  {
    id: 'step-c',
    stepLetter: 'C',
    label: 'KYC & documents',
    shortLabel: 'KYC & Docs',
    path: '/application/kyc',
    key: 'kyc',
  },
  {
    id: 'step-d',
    stepLetter: 'D',
    label: 'Payment',
    shortLabel: 'Payment',
    path: '/application/payment',
    key: 'payment',
  },
  {
    id: 'step-e',
    stepLetter: 'E',
    label: 'Draft report',
    shortLabel: 'Draft report',
    path: '/application/report',
    key: 'report',
  },
];

interface StepperProps {
  currentKey?: 'registration' | 'products' | 'kyc' | 'payment' | 'report';
}

export const Stepper: React.FC<StepperProps> = ({ currentKey }) => {
  const { navigate, isStepComplete, state, currentPath } = useApp();

  // If currentKey is not passed directly, infer from currentPath
  let activeKey = currentKey;
  if (!activeKey) {
    if (currentPath.includes('/application/product-selection')) activeKey = 'products';
    else if (currentPath.includes('/application/kyc')) activeKey = 'kyc';
    else if (currentPath.includes('/application/payment')) activeKey = 'payment';
    else if (currentPath.includes('/application/report')) activeKey = 'report';
    else activeKey = 'registration';
  }

  const currentIndex = APPLICATION_STEPS.findIndex((s) => s.key === activeKey);

  return (
    <div className="w-full bg-white border-b border-slate-200 py-3 sm:py-4 px-4 sm:px-6 lg:px-8 shadow-xs">
      <div className="max-w-5xl mx-auto">
        {/* Desktop Stepper */}
        <nav aria-label="Progress" className="hidden md:block">
          <ol className="flex items-center justify-between">
            {APPLICATION_STEPS.map((step, idx) => {
              const isCurrent = step.key === currentKey;
              const isCompleted = isStepComplete(step.key);
              const isAccessible = idx <= currentIndex || isCompleted;

              return (
                <li
                  key={step.id}
                  className={`relative flex-1 flex items-center ${
                    idx !== APPLICATION_STEPS.length - 1 ? 'pr-4' : ''
                  }`}
                >
                  <button
                    onClick={() => {
                      if (isAccessible) {
                        navigate(step.path);
                      }
                    }}
                    disabled={!isAccessible}
                    className={`flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 rounded px-1.5 py-1 ${
                      isAccessible ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
                    }`}
                  >
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isCompleted
                          ? 'bg-teal-700 text-white'
                          : isCurrent
                          ? 'bg-slate-900 text-white ring-2 ring-teal-600 ring-offset-2'
                          : 'bg-slate-100 text-slate-500 border border-slate-300'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-4 h-4 stroke-[2.5]" />
                      ) : (
                        step.stepLetter
                      )}
                    </span>
                    <span className="flex flex-col">
                      <span
                        className={`text-xs font-semibold leading-tight ${
                          isCurrent
                            ? 'text-slate-900 font-bold'
                            : isCompleted
                            ? 'text-teal-900'
                            : 'text-slate-500'
                        }`}
                      >
                        {step.label}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {isCompleted
                          ? 'Completed'
                          : isCurrent
                          ? 'In progress'
                          : 'Pending'}
                      </span>
                    </span>
                  </button>

                  {idx !== APPLICATION_STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 ml-4 ${
                        isCompleted && idx < currentIndex
                          ? 'bg-teal-700'
                          : 'bg-slate-200'
                      }`}
                      aria-hidden="true"
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Mobile Stepper - Compact Bar with step indicator */}
        <div className="md:hidden flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
              {APPLICATION_STEPS[currentIndex]?.stepLetter}
            </span>
            <div>
              <p className="text-xs font-bold text-slate-900">
                Step {APPLICATION_STEPS[currentIndex]?.stepLetter}:{' '}
                {APPLICATION_STEPS[currentIndex]?.label}
              </p>
              <p className="text-[11px] text-slate-500">
                {currentIndex + 1} of {APPLICATION_STEPS.length} steps · Ref:{' '}
                {state.referenceNumber}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {APPLICATION_STEPS.map((s, idx) => (
              <div
                key={s.id}
                className={`w-4 h-1.5 rounded-full transition-all ${
                  idx === currentIndex
                    ? 'w-6 bg-teal-600'
                    : idx < currentIndex || isStepComplete(s.key)
                    ? 'bg-slate-900'
                    : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

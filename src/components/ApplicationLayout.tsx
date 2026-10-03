import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Stepper } from './Stepper';
import { useApp } from '../context/AppContext';
import { AlertCircle, X } from 'lucide-react';

export const ApplicationLayout: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;
  const { checkRouteAccess, navigate, gatingNotice, setGatingNotice } = useApp();

  let currentKey: 'registration' | 'products' | 'kyc' | 'payment' | 'report' = 'registration';

  if (path.includes('/application/product-selection')) {
    currentKey = 'products';
  } else if (path.includes('/application/kyc')) {
    currentKey = 'kyc';
  } else if (path.includes('/application/payment')) {
    currentKey = 'payment';
  } else if (path.includes('/application/report')) {
    currentKey = 'report';
  } else {
    currentKey = 'registration';
  }

  // Enforce route protection: if user manually enters a protected step without prerequisites
  useEffect(() => {
    const access = checkRouteAccess(path);
    if (!access.allowed && access.redirectPath && access.redirectPath !== path) {
      if (access.reason) {
        setGatingNotice(access.reason);
      }
      navigate(access.redirectPath);
    }
  }, [path, checkRouteAccess, navigate, setGatingNotice]);

  return (
    <div className="flex-1 flex flex-col w-full">
      {/* Universal Wizard Stepper Header - Hidden when printing report or receipt */}
      <div className="no-print sticky top-16 z-30">
        <Stepper currentKey={currentKey} />
      </div>

      {/* Gating Notice Banner */}
      {gatingNotice && (
        <div className="no-print bg-amber-50 border-b border-amber-200 px-4 py-3">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-3 text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{gatingNotice}</span>
            </div>
            <button
              onClick={() => setGatingNotice(null)}
              className="p-1 text-amber-700 hover:text-amber-900 hover:bg-amber-100 rounded"
              aria-label="Dismiss message"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col">
        <Outlet />
      </div>
    </div>
  );
};


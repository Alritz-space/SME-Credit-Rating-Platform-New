import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Menu, X, RotateCcw } from 'lucide-react';

export const Header: React.FC = () => {
  const { currentPath, navigate, state, resetApplication } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHome = currentPath === '/';

  const handleNav = (path: string, hash?: string) => {
    setMobileMenuOpen(false);
    if (hash && isHome) {
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    } else if (hash) {
      navigate('/' + (hash ? '#' + hash : ''));
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }
    navigate(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single element brand wordmark */}
          <button
            onClick={() => handleNav('/')}
            className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 rounded-md py-1"
          >
            <div className="w-8 h-8 rounded bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-sm ring-1 ring-slate-800">
              <span className="text-amber-500 font-extrabold mr-0.5">₹</span>
              <span className="text-teal-400">S</span>
            </div>
            <div>
              <span className="text-base sm:text-lg font-bold text-slate-900 tracking-tight block leading-tight group-hover:text-teal-700 transition-colors">
                SME Readiness Portal India
              </span>
              <span className="text-[11px] text-slate-500 font-medium hidden sm:block">
                MSME Credit Readiness & Verification
              </span>
            </div>
          </button>

          {/* Zone 2: 4-6 clean text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <button
              onClick={() => handleNav('/', 'products')}
              className="hover:text-teal-700 hover:underline underline-offset-4 transition-colors"
            >
              Products
            </button>
            <button
              onClick={() => handleNav('/', 'how-it-works')}
              className="hover:text-teal-700 hover:underline underline-offset-4 transition-colors"
            >
              How it works
            </button>
            <button
              onClick={() => handleNav('/', 'why-us')}
              className="hover:text-teal-700 hover:underline underline-offset-4 transition-colors"
            >
              Why us
            </button>
            <button
              onClick={() => handleNav('/', 'help')}
              className="hover:text-teal-700 hover:underline underline-offset-4 transition-colors"
            >
              Help
            </button>
            {state.user.isVerified && (
              <button
                onClick={() => handleNav('/dashboard')}
                className={`transition-colors hover:text-teal-700 ${
                  currentPath === '/dashboard' ? 'text-teal-700 font-semibold' : ''
                }`}
              >
                Dashboard
              </button>
            )}
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="flex items-center gap-3">
            {/* Reset Prototype Helper button */}
            <button
              onClick={() => {
                if (window.confirm('Reset prototype data to default sample values?')) {
                  resetApplication();
                  navigate('/');
                }
              }}
              title="Reset sample data for testing"
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Reset prototype data"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {currentPath.startsWith('/application') ? (
              <button
                onClick={() => handleNav('/dashboard')}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
              >
                Dashboard
              </button>
            ) : state.reportUnlocked ? (
              <button
                onClick={() => handleNav('/application/report')}
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-sm transition-all whitespace-nowrap"
              >
                View Draft Report
              </button>
            ) : (
              <button
                onClick={() => {
                  if (!state.user.isVerified) {
                    handleNav('/verify-otp');
                  } else {
                    handleNav('/application/registration');
                  }
                }}
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-sm transition-all whitespace-nowrap"
              >
                Start application
              </button>
            )}

            {/* Mobile hamburger button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2 shadow-lg">
          <button
            onClick={() => handleNav('/', 'products')}
            className="block w-full text-left py-2 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md"
          >
            Products
          </button>
          <button
            onClick={() => handleNav('/', 'how-it-works')}
            className="block w-full text-left py-2 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md"
          >
            How it works
          </button>
          <button
            onClick={() => handleNav('/', 'why-us')}
            className="block w-full text-left py-2 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md"
          >
            Why us
          </button>
          <button
            onClick={() => handleNav('/', 'help')}
            className="block w-full text-left py-2 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md"
          >
            Help & Support
          </button>
          <button
            onClick={() => handleNav('/dashboard')}
            className="block w-full text-left py-2 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md"
          >
            Dashboard
          </button>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">Ref: {state.referenceNumber}</span>
            <button
              onClick={() => {
                resetApplication();
                setMobileMenuOpen(false);
                navigate('/');
              }}
              className="text-xs text-amber-700 hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset demo
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

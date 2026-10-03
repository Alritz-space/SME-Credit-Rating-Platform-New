/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ApplicationLayout } from './components/ApplicationLayout';
import { HomePage } from './pages/HomePage';
import { VerifyOtpPage } from './pages/VerifyOtpPage';
import { DashboardPage } from './pages/DashboardPage';
import { ApplicationRegistrationPage } from './pages/ApplicationRegistrationPage';
import { ApplicationProductSelectionPage } from './pages/ApplicationProductSelectionPage';
import { ApplicationKycPage } from './pages/ApplicationKycPage';
import { ApplicationPaymentPage } from './pages/ApplicationPaymentPage';
import { ApplicationReportPage } from './pages/ApplicationReportPage';
import { InternalEvalsPage } from './pages/InternalEvalsPage';

function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-teal-100 selection:text-teal-900">
      <Header />
      <div className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/verify-otp" element={<VerifyOtpPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          
          {/* Nested Application Wizard Routes under ApplicationLayout */}
          <Route path="/application" element={<ApplicationLayout />}>
            <Route path="registration" element={<ApplicationRegistrationPage />} />
            <Route path="product-selection" element={<ApplicationProductSelectionPage />} />
            <Route path="kyc" element={<ApplicationKycPage />} />
            <Route path="payment" element={<ApplicationPaymentPage />} />
            <Route path="report" element={<ApplicationReportPage />} />
          </Route>

          {/* Internal Hidden Evaluation Console */}
          <Route path="/internal/evals" element={<InternalEvalsPage />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppLayout />
      </AppProvider>
    </BrowserRouter>
  );
}

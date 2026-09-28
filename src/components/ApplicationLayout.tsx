import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Stepper } from './Stepper';

export const ApplicationLayout: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

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

  return (
    <div className="flex-1 flex flex-col w-full">
      {/* Universal Wizard Stepper Header - Hidden when printing report or receipt */}
      <div className="no-print sticky top-16 z-30">
        <Stepper currentKey={currentKey} />
      </div>
      <div className="flex-1 flex flex-col">
        <Outlet />
      </div>
    </div>
  );
};

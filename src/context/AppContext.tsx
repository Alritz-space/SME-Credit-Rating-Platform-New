import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate as useRouterNavigate, useLocation } from 'react-router-dom';
import {
  ApplicationState,
  BusinessDetails,
  DocumentUploadItem,
  KYCData,
  PaymentDetails,
  UserRegistration,
} from '../types';
import {
  DEMO_DOCUMENTS,
  INITIAL_APPLICATION_STATE,
  PRODUCTS,
} from '../utils/constants';

interface AppContextType {
  state: ApplicationState;
  currentPath: string;
  navigate: (path: string) => void;
  updateUser: (userData: Partial<UserRegistration>) => void;
  updateBusiness: (businessData: Partial<BusinessDetails>) => void;
  toggleProduct: (productId: string) => void;
  setProducts: (productIds: string[]) => void;
  updateKyc: (kycData: Partial<KYCData>) => void;
  addDocument: (
    categoryId: string,
    file: { name: string; size: number; type: string }
  ) => void;
  removeDocument: (docId: string) => void;
  replaceDocument: (
    docId: string,
    file: { name: string; size: number; type: string }
  ) => void;
  loadDemoDocuments: () => void;
  processDemoPayment: (
    method: 'upi' | 'card' | 'netbanking',
    extra?: { upiId?: string; cardLast4?: string; bankName?: string }
  ) => PaymentDetails;
  resetApplication: () => void;
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (val: boolean) => void;
  isStepComplete: (step: 'registration' | 'products' | 'kyc' | 'payment' | 'report') => boolean;
  calculateProgress: () => number;
}

const STORAGE_KEY = 'sme_readiness_portal_v1';

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const routerNavigate = useRouterNavigate();
  const location = useLocation();
  const currentPath = location.pathname || '/';

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  const [state, setState] = useState<ApplicationState>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          return JSON.parse(stored);
        }
      } catch (e) {
        console.error('Error loading stored state:', e);
      }
    }
    return INITIAL_APPLICATION_STATE;
  });

  // Keep state synced with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Error saving state:', e);
    }
  }, [state]);

  const navigate = (path: string) => {
    if (path === currentPath) return;
    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm(
        'You have unsaved changes in this step. Are you sure you want to navigate away?'
      );
      if (!confirmLeave) return;
      setHasUnsavedChanges(false);
    }

    routerNavigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateUser = (userData: Partial<UserRegistration>) => {
    setState((prev) => ({
      ...prev,
      user: { ...prev.user, ...userData },
    }));
  };

  const updateBusiness = (businessData: Partial<BusinessDetails>) => {
    setState((prev) => {
      const updatedBusiness = { ...prev.business, ...businessData };
      return {
        ...prev,
        business: updatedBusiness,
        // sync PAN/GSTIN into KYC state as well for convenience
        kyc: {
          ...prev.kyc,
          pan: updatedBusiness.pan || prev.kyc.pan,
          gstin: updatedBusiness.gstin || prev.kyc.gstin,
        },
      };
    });
  };

  const toggleProduct = (productId: string) => {
    setState((prev) => {
      const exists = prev.selectedProductIds.includes(productId);
      let updated: string[];
      if (exists) {
        updated = prev.selectedProductIds.filter((id) => id !== productId);
      } else {
        updated = [...prev.selectedProductIds, productId];
      }
      return {
        ...prev,
        selectedProductIds: updated,
        // Invalidate previous payment if product selection changes
        payment: null,
        reportUnlocked: false,
      };
    });
  };

  const setProducts = (productIds: string[]) => {
    setState((prev) => ({
      ...prev,
      selectedProductIds: productIds,
      payment: null,
      reportUnlocked: false,
    }));
  };

  const updateKyc = (kycData: Partial<KYCData>) => {
    setState((prev) => ({
      ...prev,
      kyc: { ...prev.kyc, ...kycData },
    }));
  };

  const addDocument = (
    categoryId: string,
    file: { name: string; size: number; type: string }
  ) => {
    const newDoc: DocumentUploadItem = {
      id: 'doc_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
      categoryId,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type || 'application/octet-stream',
      status: 'Received',
      uploadedAt: new Date().toISOString(),
    };

    setState((prev) => {
      // If category allows only 1 file (like bank statement or gst cert), replace, else append
      if (categoryId === 'plant_photos') {
        return {
          ...prev,
          documents: [...prev.documents, newDoc],
        };
      } else {
        // single document slot: replace existing in this category
        const filtered = prev.documents.filter((d) => d.categoryId !== categoryId);
        return {
          ...prev,
          documents: [...filtered, newDoc],
        };
      }
    });
  };

  const removeDocument = (docId: string) => {
    setState((prev) => ({
      ...prev,
      documents: prev.documents.filter((d) => d.id !== docId),
    }));
  };

  const replaceDocument = (
    docId: string,
    file: { name: string; size: number; type: string }
  ) => {
    setState((prev) => {
      const target = prev.documents.find((d) => d.id === docId);
      if (!target) return prev;
      const updatedDocs = prev.documents.map((d) => {
        if (d.id === docId) {
          return {
            ...d,
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type || d.fileType,
            uploadedAt: new Date().toISOString(),
          };
        }
        return d;
      });
      return {
        ...prev,
        documents: updatedDocs,
      };
    });
  };

  const loadDemoDocuments = () => {
    setState((prev) => ({
      ...prev,
      documents: DEMO_DOCUMENTS,
    }));
  };

  const processDemoPayment = (
    method: 'upi' | 'card' | 'netbanking',
    extra?: { upiId?: string; cardLast4?: string; bankName?: string }
  ): PaymentDetails => {
    // calculate subtotal from selected products
    const subtotal = state.selectedProductIds.reduce((sum, id) => {
      const prod = PRODUCTS.find((p) => p.id === id);
      return sum + (prod ? prod.price : 0);
    }, 0);
    const gst = Math.round(subtotal * 0.18);
    const total = subtotal + gst;

    const payment: PaymentDetails = {
      status: 'successful',
      paymentId: 'PAY-DEMO-782941',
      method,
      upiId: extra?.upiId || (method === 'upi' ? 'ananya@okaxis' : undefined),
      cardLast4: extra?.cardLast4 || (method === 'card' ? '4112' : undefined),
      bankName: extra?.bankName || (method === 'netbanking' ? 'HDFC Bank' : undefined),
      subtotal,
      gst,
      total,
      paidProductIds: [...state.selectedProductIds],
      timestamp: new Date().toISOString(),
      receiptNumber: 'RCP-2026-' + Math.floor(100000 + Math.random() * 900000),
    };

    setState((prev) => ({
      ...prev,
      payment,
      reportUnlocked: true,
    }));

    return payment;
  };

  const resetApplication = () => {
    setState(INITIAL_APPLICATION_STATE);
    setHasUnsavedChanges(false);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_APPLICATION_STATE));
    } catch (e) {
      console.error(e);
    }
  };

  const isStepComplete = (
    step: 'registration' | 'products' | 'kyc' | 'payment' | 'report'
  ): boolean => {
    switch (step) {
      case 'registration':
        return Boolean(
          state.business.legalName &&
            state.business.tradeName &&
            state.business.pan &&
            state.business.pinCode &&
            (state.user.association === 'Proprietor' || Boolean(state.business.gstin))
        );
      case 'products':
        return state.selectedProductIds.length > 0;
      case 'kyc': {
        const hasBankStatement = state.documents.some((d) => d.categoryId === 'bank_statement');
        const plantPhotosCount = state.documents.filter((d) => d.categoryId === 'plant_photos').length;
        const hasGstCert = state.documents.some((d) => d.categoryId === 'gst_certificate');
        const hasFinancials = state.documents.some((d) => d.categoryId === 'financial_statement');
        return (
          hasBankStatement &&
          plantPhotosCount >= 2 &&
          hasGstCert &&
          hasFinancials &&
          state.kyc.consentAccepted
        );
      }
      case 'payment':
        return state.payment?.status === 'successful';
      case 'report':
        return state.reportUnlocked;
      default:
        return false;
    }
  };

  const calculateProgress = (): number => {
    let completedCount = 0;
    if (isStepComplete('registration')) completedCount += 25;
    if (isStepComplete('products')) completedCount += 20;
    if (isStepComplete('kyc')) completedCount += 25;
    if (isStepComplete('payment')) completedCount += 20;
    if (isStepComplete('report')) completedCount += 10;
    return completedCount;
  };

  return (
    <AppContext.Provider
      value={{
        state,
        currentPath,
        navigate,
        updateUser,
        updateBusiness,
        toggleProduct,
        setProducts,
        updateKyc,
        addDocument,
        removeDocument,
        replaceDocument,
        loadDemoDocuments,
        processDemoPayment,
        resetApplication,
        hasUnsavedChanges,
        setHasUnsavedChanges,
        isStepComplete,
        calculateProgress,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

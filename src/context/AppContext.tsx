import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
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
import {
  ScoreCalculationResult,
  ScoreReviewRequest,
} from '../types/scoring';
import { calculateCreditReadinessScore } from '../utils/scoring';

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
  scoreResult: ScoreCalculationResult;
  recordScoreReview: (review: {
    issueType: ScoreReviewRequest['issueType'];
    comment: string;
  }) => string;
  reviewRequests: ScoreReviewRequest[];
  createApplicationRevision: () => void;
  gatingNotice: string | null;
  setGatingNotice: (msg: string | null) => void;
  checkRouteAccess: (targetPath: string) => {
    allowed: boolean;
    redirectPath?: string;
    reason?: string;
  };
}

const STORAGE_KEY = 'sme_readiness_portal_v1';
const REVIEWS_STORAGE_KEY = 'sme_score_review_requests';

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const routerNavigate = useRouterNavigate();
  const location = useLocation();
  const currentPath = location.pathname || '/';

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [gatingNotice, setGatingNotice] = useState<string | null>(null);

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

  const [reviewRequests, setReviewRequests] = useState<ScoreReviewRequest[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(REVIEWS_STORAGE_KEY);
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.error('Error loading review requests:', e);
      }
    }
    return [];
  });

  // Calculate score deterministically whenever state changes
  const scoreResult = useMemo(() => {
    return calculateCreditReadinessScore(state);
  }, [state]);

  // Keep state synced with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Error saving state:', e);
    }
  }, [state]);

  // Keep reviews synced with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviewRequests));
    } catch (e) {
      console.error('Error saving reviews:', e);
    }
  }, [reviewRequests]);

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

  const recordScoreReview = (review: {
    issueType: ScoreReviewRequest['issueType'];
    comment: string;
  }): string => {
    const newRecord: ScoreReviewRequest = {
      id: 'rev_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      referenceNumber: state.referenceNumber,
      issueType: review.issueType,
      comment: review.comment,
      createdAt: new Date().toISOString(),
      status: 'Recorded for manual review',
    };

    setReviewRequests((prev) => [newRecord, ...prev]);

    // Return the mandatory exact message
    return 'Your request has been recorded for manual review. This prototype does not make automated changes to your score.';
  };

  const createApplicationRevision = () => {
    const newRef = 'SME-2026-' + Math.floor(100000 + Math.random() * 900000);
    setState((prev) => ({
      ...prev,
      referenceNumber: newRef,
      payment: null,
      reportUnlocked: false,
    }));
    navigate('/application/registration');
  };

  const checkRouteAccess = (
    targetPath: string
  ): { allowed: boolean; redirectPath?: string; reason?: string } => {
    // 1. Dashboard and wizard require OTP verification
    if (targetPath.startsWith('/dashboard') || targetPath.startsWith('/application/')) {
      if (!state.user.isVerified) {
        return {
          allowed: false,
          redirectPath: '/verify-otp',
          reason: 'Please complete mobile OTP verification before accessing application details.',
        };
      }
    }

    // 2. Product selection requires registration completeness
    if (targetPath.startsWith('/application/product-selection')) {
      if (!isStepComplete('registration')) {
        return {
          allowed: false,
          redirectPath: '/application/registration',
          reason: 'Please complete your business profile registration details before selecting products.',
        };
      }
    }

    // 3. KYC requires product selection
    if (targetPath.startsWith('/application/kyc')) {
      if (!isStepComplete('registration')) {
        return {
          allowed: false,
          redirectPath: '/application/registration',
          reason: 'Please complete your business profile registration details first.',
        };
      }
      if (state.selectedProductIds.length === 0) {
        return {
          allowed: false,
          redirectPath: '/application/product-selection',
          reason: 'Please select at least one readiness product before submitting KYC documentation.',
        };
      }
    }

    // 4. Payment requires KYC and required documents
    if (targetPath.startsWith('/application/payment')) {
      if (!isStepComplete('registration')) {
        return {
          allowed: false,
          redirectPath: '/application/registration',
          reason: 'Please complete business registration before payment.',
        };
      }
      if (state.selectedProductIds.length === 0) {
        return {
          allowed: false,
          redirectPath: '/application/product-selection',
          reason: 'Please choose readiness products before proceeding to payment.',
        };
      }
      if (!isStepComplete('kyc')) {
        return {
          allowed: false,
          redirectPath: '/application/kyc',
          reason: 'Please upload all required verification documents and accept declaration consent before payment.',
        };
      }
    }

    // 5. Final report requires payment
    if (targetPath.startsWith('/application/report')) {
      if (state.payment?.status !== 'successful') {
        return {
          allowed: false,
          redirectPath: '/application/payment',
          reason: 'Please complete simulated payment to view and download your draft Credit Readiness Report.',
        };
      }
    }

    return { allowed: true };
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
        scoreResult,
        recordScoreReview,
        reviewRequests,
        createApplicationRevision,
        gatingNotice,
        setGatingNotice,
        checkRouteAccess,
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

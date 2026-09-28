import {
  ApplicationState,
  CityType,
  ConstitutionType,
  DocumentUploadItem,
  IndustryType,
  ProductItem,
  StateType,
  TurnoverType,
} from '../types';

export const PRODUCTS: ProductItem[] = [
  {
    id: 'credit-readiness-score',
    title: 'Credit Readiness Score',
    price: 10000,
    description:
      'An internal assessment of your business’s credit readiness based on the information and documents you submit.',
    recommended: true,
  },
  {
    id: 'business-grading',
    title: 'Business Grading',
    price: 5000,
    description:
      'An operational assessment that helps suppliers, buyers, and procurement teams understand your business maturity.',
  },
  {
    id: 'verified-business-profile',
    title: 'Verified Business Profile',
    price: 5000,
    description:
      'A reviewed business profile that helps you present key company information with greater confidence.',
  },
  {
    id: 'due-diligence-review',
    title: 'Due Diligence Review',
    price: 12000,
    description:
      'A deeper review package for business partnerships, lending preparation, or strategic decisions.',
  },
];

export const CITIES: CityType[] = [
  'Gurugram',
  'Mumbai',
  'Bengaluru',
  'Pune',
  'Ahmedabad',
  'Chennai',
  'Hyderabad',
  'Delhi',
  'Noida',
  'Jaipur',
];

export const STATES: StateType[] = [
  'Haryana',
  'Maharashtra',
  'Karnataka',
  'Gujarat',
  'Tamil Nadu',
  'Telangana',
  'Delhi',
  'Uttar Pradesh',
  'Rajasthan',
];

export const CONSTITUTIONS: ConstitutionType[] = [
  'Proprietorship',
  'Partnership',
  'LLP',
  'Private Limited Company',
  'Public Limited Company',
];

export const INDUSTRIES: IndustryType[] = [
  'Manufacturing',
  'Trading',
  'Professional Services',
  'Logistics',
  'Construction',
  'Food Processing',
  'Textiles',
  'Information Technology',
  'Healthcare',
];

export const TURNOVER_SLABS: TurnoverType[] = [
  'Below ₹40 lakh',
  '₹40 lakh–₹1 crore',
  '₹1 crore–₹5 crore',
  '₹5 crore–₹25 crore',
  '₹25 crore–₹100 crore',
  'Above ₹100 crore',
];

export const DEMO_OTP = '123456';
export const DEMO_APP_REF = 'SME-2026-004281';

export const INITIAL_APPLICATION_STATE: ApplicationState = {
  referenceNumber: DEMO_APP_REF,
  user: {
    fullName: 'Ananya Sharma',
    email: 'ananya.sharma@sunrisecomponents.in',
    mobile: '9876543210',
    association: 'Director',
    agreedToTerms: true,
    isVerified: true,
  },
  business: {
    legalName: 'Sunrise Components Private Limited',
    tradeName: 'Sunrise Components',
    constitution: 'Private Limited Company',
    incorporationDate: '2018-05-14',
    pan: 'AABCS1429K',
    gstin: '06AABCS1429K1Z4',
    addressLine1: 'Plot 42, Udyog Vihar Phase IV',
    addressLine2: 'Near DLF Cyber City',
    city: 'Gurugram',
    state: 'Haryana',
    pinCode: '122016',
    industry: 'Manufacturing',
    subIndustry: 'Precision engineering components',
    yearlyTurnover: '₹5 crore–₹25 crore',
    numberOfEmployees: 84,
    preferredLanguage: 'English',
  },
  selectedProductIds: ['credit-readiness-score', 'verified-business-profile'],
  kyc: {
    pan: 'AABCS1429K',
    gstin: '06AABCS1429K1Z4',
    signatoryName: 'Ananya Sharma',
    signatoryDesignation: 'Director',
    consentAccepted: true,
  },
  documents: [],
  payment: null,
  reportUnlocked: false,
  activeStepIndex: 0,
};

export const DEMO_DOCUMENTS: DocumentUploadItem[] = [
  {
    id: 'demo-doc-1',
    categoryId: 'bank_statement',
    fileName: 'Sunrise_Bank_Statement_Apr-Sep_2026.pdf',
    fileSize: 2457600, // 2.4 MB
    fileType: 'application/pdf',
    status: 'Received',
    uploadedAt: '2026-09-28T09:15:00.000Z',
  },
  {
    id: 'demo-doc-2',
    categoryId: 'plant_photos',
    fileName: 'Sunrise_Plant_Exterior.jpg',
    fileSize: 1887436, // 1.8 MB
    fileType: 'image/jpeg',
    status: 'Received',
    uploadedAt: '2026-09-28T09:16:00.000Z',
  },
  {
    id: 'demo-doc-3',
    categoryId: 'plant_photos',
    fileName: 'Sunrise_Assembly_Floor.jpg',
    fileSize: 1677721, // 1.6 MB
    fileType: 'image/jpeg',
    status: 'Received',
    uploadedAt: '2026-09-28T09:17:00.000Z',
  },
  {
    id: 'demo-doc-4',
    categoryId: 'gst_certificate',
    fileName: 'Sunrise_GST_Certificate.pdf',
    fileSize: 655360, // 640 KB
    fileType: 'application/pdf',
    status: 'Received',
    uploadedAt: '2026-09-28T09:18:00.000Z',
  },
  {
    id: 'demo-doc-5',
    categoryId: 'financial_statement',
    fileName: 'Sunrise_FY2025-26_Financials.pdf',
    fileSize: 3250585, // 3.1 MB
    fileType: 'application/pdf',
    status: 'Received',
    uploadedAt: '2026-09-28T09:19:00.000Z',
  },
];

export const formatINR = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

// Validation patterns
export const REGEX_PATTERNS = {
  PAN: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
  GSTIN: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
  PIN_CODE: /^[1-9][0-9]{5}$/,
  INDIAN_MOBILE: /^[6-9]\d{9}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

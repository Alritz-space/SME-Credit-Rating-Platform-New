export type AssociationType = 'Proprietor' | 'Promoter' | 'Partner' | 'Director';

export type ConstitutionType =
  | 'Proprietorship'
  | 'Partnership'
  | 'LLP'
  | 'Private Limited Company'
  | 'Public Limited Company';

export type CityType =
  | 'Gurugram'
  | 'Mumbai'
  | 'Bengaluru'
  | 'Pune'
  | 'Ahmedabad'
  | 'Chennai'
  | 'Hyderabad'
  | 'Delhi'
  | 'Noida'
  | 'Jaipur';

export type StateType =
  | 'Haryana'
  | 'Maharashtra'
  | 'Karnataka'
  | 'Gujarat'
  | 'Tamil Nadu'
  | 'Telangana'
  | 'Delhi'
  | 'Uttar Pradesh'
  | 'Rajasthan';

export type IndustryType =
  | 'Manufacturing'
  | 'Trading'
  | 'Professional Services'
  | 'Logistics'
  | 'Construction'
  | 'Food Processing'
  | 'Textiles'
  | 'Information Technology'
  | 'Healthcare';

export type TurnoverType =
  | 'Below ₹40 lakh'
  | '₹40 lakh–₹1 crore'
  | '₹1 crore–₹5 crore'
  | '₹5 crore–₹25 crore'
  | '₹25 crore–₹100 crore'
  | 'Above ₹100 crore';

export interface UserRegistration {
  fullName: string;
  email: string;
  mobile: string;
  association: AssociationType;
  agreedToTerms: boolean;
  isVerified: boolean;
}

export interface BusinessDetails {
  legalName: string;
  tradeName: string;
  constitution: ConstitutionType;
  incorporationDate: string;
  pan: string;
  gstin: string;
  addressLine1: string;
  addressLine2: string;
  city: CityType;
  state: StateType;
  pinCode: string;
  industry: IndustryType;
  subIndustry: string;
  yearlyTurnover: TurnoverType;
  numberOfEmployees: number;
  preferredLanguage: 'English' | 'Hindi';
}

export interface ProductItem {
  id: string;
  title: string;
  price: number;
  description: string;
  recommended?: boolean;
}

export interface KYCData {
  pan: string;
  gstin: string;
  signatoryName: string;
  signatoryDesignation: string;
  consentAccepted: boolean;
}

export interface DocumentUploadItem {
  id: string;
  categoryId: string; // e.g., 'bank_statement', 'plant_photos', 'gst_certificate', 'financial_statement', 'udyam_cert', 'cin_cert', 'cancelled_cheque'
  fileName: string;
  fileSize: number; // in bytes
  fileType: string;
  status: 'Received';
  uploadedAt: string;
}

export interface PaymentDetails {
  status: 'pending' | 'successful';
  paymentId: string;
  method: 'upi' | 'card' | 'netbanking';
  upiId?: string;
  cardLast4?: string;
  bankName?: string;
  subtotal: number;
  gst: number;
  total: number;
  paidProductIds?: string[];
  timestamp: string;
  receiptNumber: string;
}

export interface ApplicationState {
  referenceNumber: string;
  user: UserRegistration;
  business: BusinessDetails;
  selectedProductIds: string[];
  kyc: KYCData;
  documents: DocumentUploadItem[];
  payment: PaymentDetails | null;
  reportUnlocked: boolean;
  activeStepIndex: number;
}

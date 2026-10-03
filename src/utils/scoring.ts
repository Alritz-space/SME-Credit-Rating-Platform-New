import { ApplicationState } from '../types';
import {
  ReadinessBand,
  ScoreCalculationResult,
  ScoreComponentBreakdown,
} from '../types/scoring';
import { REGEX_PATTERNS } from './constants';

export const SCORE_RULES_VERSION = 'v1.0.0-deterministic';
export const SCORE_STORAGE_KEY_PREFIX = 'sme_score_record_';

/**
 * Validates tax identity formats according to legal constitution rules.
 */
export const validateTaxIdentity = (
  pan: string,
  gstin: string,
  association: string
): { isValid: boolean; message?: string } => {
  const cleanPan = (pan || '').trim().toUpperCase();
  const cleanGstin = (gstin || '').trim().toUpperCase();

  if (!cleanPan || !REGEX_PATTERNS.PAN.test(cleanPan)) {
    return {
      isValid: false,
      message: 'Invalid PAN format. Must be a valid 10-character PAN (e.g., AABCS1429K).',
    };
  }

  const isProprietor = association === 'Proprietor';
  if (isProprietor) {
    if (cleanGstin && !REGEX_PATTERNS.GSTIN.test(cleanGstin)) {
      return {
        isValid: false,
        message: 'Invalid GSTIN format. Must be a valid 15-character GSTIN.',
      };
    }
  } else {
    if (!cleanGstin || !REGEX_PATTERNS.GSTIN.test(cleanGstin)) {
      return {
        isValid: false,
        message: `GSTIN is mandatory and must follow standard 15-character structure for ${association}.`,
      };
    }
  }

  return { isValid: true };
};

/**
 * Deterministic rule-based Credit Readiness Score calculator.
 * Computes exact score (0–100) across 4 standard evaluation pillars.
 * Zero Generative AI — strictly rule and evidence-based.
 */
export const calculateCreditReadinessScore = (
  state: ApplicationState,
  options?: { forceRecalculate?: boolean }
): ScoreCalculationResult => {
  const pan = state.business.pan || state.kyc.pan;
  const gstin = state.business.gstin || state.kyc.gstin;
  const association = state.user.association;

  // Rule: If PAN or GSTIN format is invalid, do not calculate a final score.
  const taxCheck = validateTaxIdentity(pan, gstin, association);
  if (!taxCheck.isValid) {
    return {
      score: 0,
      maxScore: 100,
      band: 'Needs attention',
      breakdown: createEmptyBreakdown(),
      rulesVersion: SCORE_RULES_VERSION,
      calculatedAt: new Date().toISOString(),
      canCalculate: false,
      validationMessage: 'Complete validation to view your readiness score.',
      hasAllRequiredDocuments: false,
      reportStatus: 'Validation incomplete',
    };
  }

  // 1. Business Profile Completeness (max 25)
  const legalNamePoints = state.business.legalName?.trim() ? 3 : 0;
  const constitutionPoints = state.business.constitution?.trim() ? 3 : 0;
  const hasValidAddressAndPin =
    Boolean(state.business.addressLine1?.trim()) &&
    Boolean(state.business.city?.trim()) &&
    Boolean(state.business.state?.trim()) &&
    REGEX_PATTERNS.PIN_CODE.test((state.business.pinCode || '').trim());
  const addressAndPinPoints = hasValidAddressAndPin ? 5 : 0;
  const hasIndustryAndSub =
    Boolean(state.business.industry?.trim()) &&
    Boolean(state.business.subIndustry?.trim());
  const industryPoints = hasIndustryAndSub ? 4 : 0;
  const turnoverPoints = state.business.yearlyTurnover?.trim() ? 5 : 0;
  const employeeCountPoints = Number(state.business.numberOfEmployees) > 0 ? 2 : 0;
  const panGstinValidPoints = taxCheck.isValid ? 3 : 0;

  const businessProfileEarned =
    legalNamePoints +
    constitutionPoints +
    addressAndPinPoints +
    industryPoints +
    turnoverPoints +
    employeeCountPoints +
    panGstinValidPoints;

  // 2. Document Completeness (max 35)
  const bankStatementsCount = state.documents.filter(
    (d) => d.categoryId === 'bank_statement'
  ).length;
  const plantPhotosCount = state.documents.filter(
    (d) => d.categoryId === 'plant_photos'
  ).length;
  const gstCertificateCount = state.documents.filter(
    (d) => d.categoryId === 'gst_certificate'
  ).length;
  const financialStatementsCount = state.documents.filter(
    (d) => d.categoryId === 'financial_statement'
  ).length;

  const bankStatementsPoints = bankStatementsCount >= 1 ? 10 : 0;
  const plantPhotosPoints = plantPhotosCount >= 2 ? 5 : 0;
  const gstCertificatePoints = gstCertificateCount >= 1 ? 8 : 0;
  const financialStatementsPoints = financialStatementsCount >= 1 ? 12 : 0;

  const documentCompletenessEarned =
    bankStatementsPoints +
    plantPhotosPoints +
    gstCertificatePoints +
    financialStatementsPoints;

  const hasAllRequiredDocuments =
    bankStatementsCount >= 1 &&
    plantPhotosCount >= 2 &&
    gstCertificateCount >= 1 &&
    financialStatementsCount >= 1;

  // 3. Verification Readiness (max 20)
  const otpVerifiedPoints = state.user.isVerified ? 5 : 0;
  const applicantConsentPoints = state.user.agreedToTerms ? 5 : 0;
  const hasSignatoryInfo =
    Boolean(state.kyc.signatoryName?.trim()) &&
    Boolean(state.kyc.signatoryDesignation?.trim());
  const signatoryInfoPoints = hasSignatoryInfo ? 5 : 0;
  const kycConsentPoints = state.kyc.consentAccepted ? 5 : 0;

  const verificationReadinessEarned =
    otpVerifiedPoints +
    applicantConsentPoints +
    signatoryInfoPoints +
    kycConsentPoints;

  // 4. Financial Self-Declaration (max 20)
  const turnoverDeclaredPoints = state.business.yearlyTurnover?.trim() ? 5 : 0;
  const financialStatementsUploadedPoints = financialStatementsCount >= 1 ? 10 : 0;
  const bankStatementsUploadedPoints = bankStatementsCount >= 1 ? 5 : 0;

  const financialSelfDeclarationEarned =
    turnoverDeclaredPoints +
    financialStatementsUploadedPoints +
    bankStatementsUploadedPoints;

  const totalScore = Math.min(
    100,
    Math.max(
      0,
      businessProfileEarned +
        documentCompletenessEarned +
        verificationReadinessEarned +
        financialSelfDeclarationEarned
    )
  );

  let band: ReadinessBand = 'Needs attention';
  if (totalScore >= 80) {
    band = 'Strong readiness';
  } else if (totalScore >= 60) {
    band = 'Developing readiness';
  } else {
    band = 'Needs attention';
  }

  // Report status determination:
  let reportStatus: ScoreCalculationResult['reportStatus'] = 'Draft report available';
  if (!hasAllRequiredDocuments) {
    reportStatus = 'More information needed';
  } else if (state.payment?.status !== 'successful') {
    reportStatus = 'Payment pending';
  }

  const breakdown: ScoreComponentBreakdown = {
    businessProfile: {
      earned: businessProfileEarned,
      max: 25,
      details: {
        legalName: legalNamePoints,
        constitution: constitutionPoints,
        addressAndPin: addressAndPinPoints,
        industry: industryPoints,
        turnover: turnoverPoints,
        employeeCount: employeeCountPoints,
        panGstinValid: panGstinValidPoints,
      },
    },
    documentCompleteness: {
      earned: documentCompletenessEarned,
      max: 35,
      details: {
        bankStatements: bankStatementsPoints,
        plantPhotos: plantPhotosPoints,
        gstCertificate: gstCertificatePoints,
        financialStatements: financialStatementsPoints,
      },
    },
    verificationReadiness: {
      earned: verificationReadinessEarned,
      max: 20,
      details: {
        otpVerified: otpVerifiedPoints,
        applicantConsent: applicantConsentPoints,
        signatoryInfo: signatoryInfoPoints,
        kycConsent: kycConsentPoints,
      },
    },
    financialSelfDeclaration: {
      earned: financialSelfDeclarationEarned,
      max: 20,
      details: {
        turnoverDeclared: turnoverDeclaredPoints,
        financialStatementsUploaded: financialStatementsUploadedPoints,
        bankStatementsUploaded: bankStatementsUploadedPoints,
      },
    },
  };

  const calculatedAt = new Date().toISOString();

  const result: ScoreCalculationResult = {
    score: totalScore,
    maxScore: 100,
    band,
    breakdown,
    rulesVersion: SCORE_RULES_VERSION,
    calculatedAt,
    canCalculate: true,
    hasAllRequiredDocuments,
    reportStatus,
  };

  // Cache in localStorage per application reference number to guarantee persistence across reloads
  if (typeof window !== 'undefined' && state.referenceNumber && !options?.forceRecalculate) {
    try {
      const cacheKey = `${SCORE_STORAGE_KEY_PREFIX}${state.referenceNumber}`;
      localStorage.setItem(cacheKey, JSON.stringify(result));
    } catch {
      // ignore storage quota issues
    }
  }

  return result;
};

export const getCachedScore = (
  referenceNumber: string
): ScoreCalculationResult | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(`${SCORE_STORAGE_KEY_PREFIX}${referenceNumber}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const createEmptyBreakdown = (): ScoreComponentBreakdown => ({
  businessProfile: {
    earned: 0,
    max: 25,
    details: {
      legalName: 0,
      constitution: 0,
      addressAndPin: 0,
      industry: 0,
      turnover: 0,
      employeeCount: 0,
      panGstinValid: 0,
    },
  },
  documentCompleteness: {
    earned: 0,
    max: 35,
    details: {
      bankStatements: 0,
      plantPhotos: 0,
      gstCertificate: 0,
      financialStatements: 0,
    },
  },
  verificationReadiness: {
    earned: 0,
    max: 20,
    details: {
      otpVerified: 0,
      applicantConsent: 0,
      signatoryInfo: 0,
      kycConsent: 0,
    },
  },
  financialSelfDeclaration: {
    earned: 0,
    max: 20,
    details: {
      turnoverDeclared: 0,
      financialStatementsUploaded: 0,
      bankStatementsUploaded: 0,
    },
  },
});

export interface ScoreComponentBreakdown {
  businessProfile: {
    earned: number;
    max: number;
    details: {
      legalName: number;
      constitution: number;
      addressAndPin: number;
      industry: number;
      turnover: number;
      employeeCount: number;
      panGstinValid: number;
    };
  };
  documentCompleteness: {
    earned: number;
    max: number;
    details: {
      bankStatements: number;
      plantPhotos: number;
      gstCertificate: number;
      financialStatements: number;
    };
  };
  verificationReadiness: {
    earned: number;
    max: number;
    details: {
      otpVerified: number;
      applicantConsent: number;
      signatoryInfo: number;
      kycConsent: number;
    };
  };
  financialSelfDeclaration: {
    earned: number;
    max: number;
    details: {
      turnoverDeclared: number;
      financialStatementsUploaded: number;
      bankStatementsUploaded: number;
    };
  };
}

export type ReadinessBand = 'Strong readiness' | 'Developing readiness' | 'Needs attention';

export interface ScoreCalculationResult {
  score: number;
  maxScore: number;
  band: ReadinessBand;
  breakdown: ScoreComponentBreakdown;
  rulesVersion: string;
  calculatedAt: string;
  canCalculate: boolean;
  validationMessage?: string;
  hasAllRequiredDocuments: boolean;
  reportStatus: 'Draft report available' | 'More information needed' | 'Validation incomplete' | 'Payment pending';
}

export interface ScoreReviewRequest {
  id: string;
  referenceNumber: string;
  issueType: 'Incorrect details' | 'Missing document' | 'Score question' | 'Other';
  comment: string;
  createdAt: string;
  status: 'Recorded for manual review';
}

export type EvalTestStatus = 'NOT_RUN' | 'PASS' | 'FAIL';

export interface EvalTestCase {
  id: number;
  name: string;
  description: string;
  given: string;
  when: string;
  then: string;
}

export interface EvalTestResult {
  id: number;
  status: EvalTestStatus;
  expected: string;
  actual: string;
  failureReason?: string;
  executedAt?: string;
}

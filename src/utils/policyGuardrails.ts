/**
 * Policy Guardrails & Content Safety Check
 * Ensures all user-facing text, diagnostic observations, and report summaries strictly adhere to
 * internal SME guidance boundaries and cannot make regulated lending, credit rating, or creditworthiness assertions.
 */

export const REQUIRED_LEGAL_DISCLAIMER =
  'This Credit Readiness Score is an internal guidance score based on the information submitted in this application. It is not a credit rating, credit opinion, lending decision, loan approval, financial advice, or guarantee of financing.';

export const POLICY_BLOCKED_FALLBACK =
  'This information is unavailable because it falls outside the scope of the internal Credit Readiness Score.';

export interface PolicyViolationLog {
  id: string;
  ruleName: string;
  matchedPattern: string;
  timestamp: string;
}

// Prohibited terms, phrases, and regexes
export const PROHIBITED_POLICY_RULES: { ruleName: string; pattern: RegExp }[] = [
  { ruleName: 'PROHIBITED_LENDING_APPROVAL', pattern: /\bloan\s+approved\b/i },
  { ruleName: 'PROHIBITED_GUARANTEED_FINANCING', pattern: /\bguaranteed\s+financing\b/i },
  { ruleName: 'PROHIBITED_GUARANTEED_CREDIT_LIMIT', pattern: /\bguaranteed\s+credit\s+limit\b/i },
  { ruleName: 'PROHIBITED_ELIGIBLE_FOR_FINANCING', pattern: /\beligible\s+for\s+financing\b/i },
  { ruleName: 'PROHIBITED_QUALIFY_FOR_FINANCING', pattern: /\bqualif(y|ies)\s+for\s+financing\b/i },
  { ruleName: 'PROHIBITED_RECOMMENDED_LENDER', pattern: /\brecommended\s+lender\b/i },
  { ruleName: 'PROHIBITED_BORROWER_RISK_LABEL', pattern: /\b(low|high)[\s-]risk\s+borrower\b/i },
  { ruleName: 'PROHIBITED_CREDITWORTHY_CLAIM', pattern: /\bcreditworthy\b/i },
  { ruleName: 'PROHIBITED_CREDIT_RATING_CLAIM', pattern: /\bcredit\s+rating\b/i },
  { ruleName: 'PROHIBITED_CREDIT_OPINION_CLAIM', pattern: /\bcredit\s+opinion\b/i },
  { ruleName: 'PROHIBITED_CIBIL_SCORE_CLAIM', pattern: /\bcibil\s+score\b/i },
  { ruleName: 'PROHIBITED_BANK_SCORE_CLAIM', pattern: /\bbank\s+score\b/i },
  { ruleName: 'PROHIBITED_LOAN_ELIGIBILITY_SCORE', pattern: /\bloan\s+eligibility\s+score\b/i },
  { ruleName: 'PROHIBITED_LENDING_RECOMMENDATION', pattern: /\blending\s+recommendation\b/i },
  { ruleName: 'PROHIBITED_FINANCIALLY_STRONG', pattern: /\bfinancially\s+strong\b/i },
  { ruleName: 'PROHIBITED_LIKELY_TO_GET_LOAN', pattern: /\blikely\s+to\s+get\s+a\s+loan\b/i },
  { ruleName: 'PROHIBITED_REPAYMENT_CAPACITY', pattern: /\brepayment\s+capacity\b/i },
  { ruleName: 'PROHIBITED_CHANCE_OF_APPROVAL', pattern: /\bchance\s+of\s+approval\b/i },
  { ruleName: 'PROHIBITED_LENDERS_WILL_TRUST', pattern: /\blenders\s+will\s+trust\b/i },
];

const POLICY_LOG_KEY = 'sme_policy_violation_logs';

/**
 * Checks a text string against policy rules.
 * If blocked content is found, replaces it with the required neutral fallback
 * and records a policy violation log without sensitive customer data.
 */
export const checkReportText = (
  text: string
): { isSafe: boolean; sanitizedText: string; violations: string[] } => {
  if (!text) {
    return { isSafe: true, sanitizedText: '', violations: [] };
  }

  let isSafe = true;
  const violations: string[] = [];

  for (const { ruleName, pattern } of PROHIBITED_POLICY_RULES) {
    if (pattern.test(text)) {
      isSafe = false;
      violations.push(ruleName);
      logPolicyViolation(ruleName, pattern.source);
    }
  }

  if (!isSafe) {
    return {
      isSafe: false,
      sanitizedText: POLICY_BLOCKED_FALLBACK,
      violations,
    };
  }

  return {
    isSafe: true,
    sanitizedText: text,
    violations: [],
  };
};

/**
 * Audit logger for policy violations (contains NO sensitive customer data)
 */
export const logPolicyViolation = (ruleName: string, matchedPattern: string) => {
  try {
    const entry: PolicyViolationLog = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      ruleName,
      matchedPattern,
      timestamp: new Date().toISOString(),
    };
    const existing = getPolicyViolationLogs();
    const updated = [entry, ...existing].slice(0, 50); // keep last 50
    localStorage.setItem(POLICY_LOG_KEY, JSON.stringify(updated));
  } catch {
    // ignore in environments without localStorage
  }
};

export const getPolicyViolationLogs = (): PolicyViolationLog[] => {
  try {
    const stored = localStorage.getItem(POLICY_LOG_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

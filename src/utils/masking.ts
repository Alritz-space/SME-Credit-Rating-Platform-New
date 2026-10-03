/**
 * Sensitive Data Masking Utility
 * Implements strict data protection guardrails to ensure sensitive enterprise identifiers
 * (PAN, GSTIN, Mobile, Email, Bank Details) are never rendered unmasked in reports, logs, or evaluation summaries.
 */

export const maskPan = (pan?: string): string => {
  if (!pan) return '—';
  const clean = pan.trim().toUpperCase();
  if (clean.length < 6) return '*****';
  // Standard PAN is 10 chars: e.g. AABCS1429K -> AABCS****K
  const first5 = clean.slice(0, 5);
  const last1 = clean.slice(-1);
  return `${first5}****${last1}`;
};

export const maskGstin = (gstin?: string): string => {
  if (!gstin || gstin === 'N/A' || gstin === 'exempt') return gstin || '—';
  const clean = gstin.trim().toUpperCase();
  if (clean.length < 10) return '**********';
  // Standard GSTIN is 15 chars: e.g. 06AABCS1429K1Z4 -> 06AABC****1Z4 (matching 22AAAA****1Z5 format)
  const first6 = clean.slice(0, 6);
  const last3 = clean.slice(-3);
  return `${first6}****${last3}`;
};

export const maskMobile = (mobile?: string): string => {
  if (!mobile) return '—';
  const digits = mobile.replace(/\D/g, '');
  // Format as +91 98765 *****
  const national10 = digits.slice(-10);
  if (national10.length === 10) {
    const first5 = national10.slice(0, 5);
    return `+91 ${first5} *****`;
  }
  return `+91 ***** *****`;
};

export const maskEmail = (email?: string): string => {
  if (!email || !email.includes('@')) return '*****@*****';
  const [local, domain] = email.split('@');
  const firstChar = local.charAt(0) || 'u';
  return `${firstChar}*****@${domain}`;
};

export const maskBankAccount = (acc?: string): string => {
  if (!acc) return '—';
  const clean = acc.replace(/\s/g, '');
  const last4 = clean.slice(-4);
  return `**** **** **** ${last4}`;
};

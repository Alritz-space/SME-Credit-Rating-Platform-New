# SME Readiness Portal India

A specialized, responsive financial-services web application designed for Indian Small and Medium Enterprises (SMEs) to assess internal credit readiness, submit operational evidence and KYC verification documents, simulate prototype payments with full GST calculation, and generate structured diagnostic credit guidance reports.

---

## 🚀 Key Features

### 1. Enterprise Homepage & Onboarding (`/`)
- **Indian Financial Services Aesthetic**: Professional deep navy palette with saffron/amber accents, teal call-to-actions, and trust indicators.
- **Service Catalog**:
  - **Credit Readiness Score** (₹10,000) – Quantitative scoring (0–100) and readiness band diagnostic.
  - **Business Grading** (₹5,000) – Operational maturity assessment across 4 business pillars.
  - **Verified Business Profile** (₹5,000) – Commercial trust profile dossier with dual verification matrices.
  - **Due Diligence Review** (₹12,000) – Comprehensive institutional review for partnerships and preliminary banking lines.
- **Registration Form**: Validates Indian mobile number (+91 regex), PAN, and applicant business association.

### 2. Secure OTP Simulation (`/verify-otp`)
- 6-digit OTP verification interface with auto-advance, backspace handling, and resend timer.
- Demo passcode: `123456`.

### 3. Application Dashboard (`/dashboard`)
- Status overview banner for applicant enterprise (`Sunrise Components India Private Limited`).
- Dynamic progress bar, next-step action card, toll-free help desk information (+91 1800 123 4567), and demo reset controls.

### 5. Guardrails & Deterministic Scoring Engine
- **Deterministic 4-Pillar Scoring Model (0–100)**:
  - *Business profile completeness* (max 25 points)
  - *Document completeness* (max 35 points)
  - *Verification readiness* (max 20 points)
  - *Financial self-declaration* (max 20 points)
  - Zero generative AI used for scoring; computed purely through verified fields and document states.
- **Strict Product Boundaries**:
  - Internal guidance only; never calls the score a credit rating, credit opinion, CIBIL score, bank score, or loan eligibility recommendation.
  - Prohibits regulated lending claims (e.g. "loan approved", "guaranteed financing", "creditworthy", "eligible for financing").
- **Mandatory Exact Legal Disclaimer**:
  *“This Credit Readiness Score is an internal guidance score based on the information submitted in this application. It is not a credit rating, credit opinion, lending decision, loan approval, financial advice, or guarantee of financing.”*
- **Sensitive-Data Protection & Masking**:
  - Full PAN masked as `ABCDE****F`
  - GSTIN masked as `22AAAA****1Z5`
  - Mobile numbers masked as `+91 98765 *****`
  - Email addresses masked as `a*****@sunrisecomponents.in`
- **User Control & Manual Review**:
  - Transparent "How this score is calculated" breakdown with model rules version (`v1.0.0-deterministic`) and calculation timestamp.
  - "Report an issue with this score" manual review submission with immutable scoring guarantee.
  - "Edit application details" for creating fresh application revisions.

### 6. Internal Evaluation Console (`/internal/evals`)
- Hidden testing console accessible via the **"Internal testing"** footer link.
- Automated 18-test regression suite verifying:
  - Test 1: Valid full application
  - Test 2: Missing bank statement blocking
  - Test 3: Invalid PAN validation
  - Test 4: Invalid GSTIN validation
  - Test 5: Proprietor without GSTIN allowance
  - Test 6: Director without GSTIN blocking
  - Test 7: Incorrect OTP rejection
  - Test 8: Correct OTP unlock
  - Test 9: Score bounds (0–100)
  - Test 10: Missing information neutral behaviour
  - Test 11: Payment gating
  - Test 12: Route protection & sequential redirect
  - Test 13: LocalStorage persistence
  - Test 14: Sensitive-data masking
  - Test 15: Unsafe wording & policy checks
  - Test 16: Score consistency across re-runs
  - Test 17: Review request control
  - Test 18: Reset safety (fictional demo data only)
- Real-time pass/fail indicators, detailed assertion diagnostics, and one-click demo data reset with confirmation dialog.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/) (`react-router-dom`)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: React Context (`AppContext`) with persistent `localStorage` synchronization.

---

## 📁 Project Structure

```
├── index.html
├── metadata.json
├── package.json
├── tsconfig.json
├── vite.config.ts
└── src/
    ├── App.tsx                     # Main React Router configuration
    ├── main.tsx                    # React entry point
    ├── index.css                   # Global styles & Tailwind configuration
    ├── components/
    │   ├── ApplicationLayout.tsx   # Persistent wizard stepper layout wrapper
    │   ├── BusinessGradingReport.tsx # Supplementary grading report module
    │   ├── DueDiligenceReport.tsx  # Supplementary due diligence module
    │   ├── Footer.tsx              # Portal footer & statutory disclaimers
    │   ├── Header.tsx              # Portal header navigation
    │   ├── ReceiptModal.tsx        # Printable official tax receipt modal
    │   ├── Stepper.tsx             # Universal 5-step wizard progress indicator
    │   └── VerifiedBusinessProfileReport.tsx # Supplementary verified profile module
    ├── context/
    │   └── AppContext.tsx          # Global application state and storage handler
    ├── pages/
    │   ├── HomePage.tsx
    │   ├── VerifyOtpPage.tsx
    │   ├── DashboardPage.tsx
    │   ├── ApplicationRegistrationPage.tsx
    │   ├── ApplicationProductSelectionPage.tsx
    │   ├── ApplicationKycPage.tsx
    │   ├── ApplicationPaymentPage.tsx
    │   └── ApplicationReportPage.tsx
    ├── types/
    │   └── index.ts                # TypeScript interfaces & domain data models
    └── utils/
        └── constants.ts            # Indian financial presets, products, & demo datasets
```

---

## 🚦 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or bun

### Installation
```bash
npm install
```

### Development Server
To start the local development server on port 3000:
```bash
npm run dev
```

### Build for Production
To create an optimized production build:
```bash
npm run build
```

### Linting
To check TypeScript and lint constraints:
```bash
npm run lint
```

---

## 📄 License
Apache-2.0

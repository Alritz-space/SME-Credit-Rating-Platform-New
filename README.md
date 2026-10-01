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

### 4. 5-Step Application Wizard (`/application/*`)
Integrated sticky top progress Stepper with step letter badges (A–E) and mobile status indicators:
- **Step A: Business Registration (`/application/registration`)**:
  - Detailed entity inputs: Legal name, trade name, constitution (Private Limited, Partnership, LLP, Proprietorship, etc.), date of incorporation, corporate PAN, GSTIN, registered office address, PIN code, industry sector, employee headcount, and language preferences.
- **Step B: Product Selection (`/application/product-selection`)**:
  - Selectable service packages with real-time subtotal, 18% GST (CGST+SGST / IGST) breakdown, and statutory guidance notes.
- **Step C: KYC & Documents (`/application/kyc`)**:
  - Authorized signatory credentials and mandatory legal declaration.
  - Interactive file upload manager supporting required documents (6-month bank statements, facility photos min. 2, GST certificate, financials) with one-click **"Use demo files"** quick loader.
- **Step D: Payment Simulation (`/application/payment`)**:
  - Dynamic checkout supporting UPI (`ananya@okaxis`), Card, and Net Banking.
  - Itemized enrolled products breakdown matching exact product selections with 18% GST calculation.
  - Instant official payment receipt modal with tax breakdown and print/PDF support.
- **Step E: Draft Report (`/application/report`)**:
  - Protected outcome gate unlocked upon payment.
  - Primary **Credit Readiness Score (72/100 – Developing readiness)** with score bands (80–100, 60–79, Below 60) and 4 summary diagnostic cards.
  - **Multi-Product Support**: If multiple products are selected, the report automatically compiles supplemental reports:
    - *Business Grading & Maturity Assessment*
    - *Verified Business Profile Dossier*
    - *Due Diligence & Partnership Review*
  - Statutory disclaimer: *"This draft shows an internal Credit Readiness Score for guidance only. It is not an external credit rating, credit opinion, lending decision, or loan approval."*
  - Browser print-ready styling for saving as a PDF (`window.print()`).

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

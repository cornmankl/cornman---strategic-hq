# CORNMAN Strategic HQ - Project Context for Qwen Code

This document provides essential context about the CORNMAN Strategic HQ project for use with Qwen Code, an interactive CLI agent. This is a comprehensive, full-stack business management platform built with React, TypeScript, and Firebase.

## Project Type
Code Project - Full-stack web application built with React, TypeScript, Vite, and Firebase.

## Key Technologies
- **Frontend:** React 18, TypeScript, Tailwind CSS, Lucide Icons, Vite
- **Backend:** Firebase Functions (Node.js), Google GenAI (Gemini), Twilio
- **Database:** Firebase Firestore
- **Authentication:** JWT-based with Role-based Access Control (RBAC)
- **Deployment:** Firebase Hosting, Vercel/Netlify (for frontend)
- **Infrastructure:** Firebase (Functions, Hosting, Secrets), Google Cloud Secret Manager

## Project Overview
CORNMAN Strategic HQ is a complete enterprise business management platform that has successfully implemented all 13 planned phases. It covers core operations like sales, inventory, CRM, finance, project management, and advanced features like analytics, team management, e-commerce, mobile integration, automation, supply chain management, enterprise integrations, and global compliance.

A key feature is its integrated "Viral Prediction" system, which is a unique AI-powered tool designed to predict and guarantee the virality of social media content.

## Project Structure
The project has a well-defined structure separating concerns:
```
cornman-strategic-hq/
├── components/           # React components
│   ├── analytics/       # Analytics dashboard
│   ├── auth/            # Authentication components
│   ├── ecommerce/       # E-commerce management
│   ├── layouts/         # Layout components
│   ├── primitives/      # Base UI components
│   ├── team/            # Team management
│   └── viral/           # Viral prediction system components
├── contexts/            # React contexts
│   └── AuthContext.tsx  # Authentication state
├── services/            # Business logic & API calls
│   ├── firebase.ts      # Firebase service
│   ├── analytics.ts     # Analytics service
│   ├── teamService.ts   # Team management
│   └── ecommerceService.ts
├── types/               # TypeScript type definitions
│   ├── index.ts         # Core types
│   ├── team.ts          # Team management types
│   ├── ecommerce.ts     # E-commerce types
│   ├── mobile.ts        # Mobile app types
│   ├── automation.ts    # Automation types
│   ├── supplychain.ts   # Supply chain types
│   ├── integrations.ts  # Integration types
│   └── global.ts        # Global compliance types
├── utils/               # Utility functions
├── functions/           # Firebase Functions (backend)
│   └── src/             # Source code for backend functions
│       ├── index.ts     # Main entry point
│       └── whatsapp.ts  # WhatsApp integration
└── public/              # Static assets
```

## Building and Running
### Prerequisites
- Node.js 18+
- npm or yarn
- Firebase account (for backend features)

### Development
1.  **Install dependencies:** `npm install`
2.  **Environment Setup:** Copy `.env.example` to `.env.local` and configure variables.
3.  **Run development server:** `npm run dev`
    - This starts the Vite development server, typically accessible at `http://localhost:5173`.
    - The Vite config also proxies `/api` requests to `http://localhost:5001` (Firebase Functions Emulator).

### Backend (Firebase Functions)
1.  **Install dependencies:** `npm install --prefix functions`
2.  **Run development server with emulator:** `npm run serve --prefix functions`
    - This builds the functions and starts the Firebase Emulator Suite.

### Production Build
1.  **Build frontend:** `npm run build`
2.  **Deploy frontend:** `firebase deploy --only hosting` or use Vercel/Netlify.
3.  **Deploy backend functions:** `npm run deploy --prefix functions`

### Testing & Quality Checks
- **Linting:** `npm run lint`
- **Type Checking:** `npm run type-check`
- **Unit Tests:** `npm run test`
- **E2E Tests:** `npm run test:e2e`

## Key Features Highlighted in Codebase
### Viral Prediction System
Located in `src/components/viral/`, this system provides:
- AI-powered prediction of social media content virality.
- A "Viral Guarantee" feature for high-potential content.
- Live trending content analysis.
- "Viral Booster" tools to increase content potential.
- Competitor analysis ("Spy Mode").
- Campaign management for coordinated viral efforts.

### WhatsApp Integration (Twilio)
Significant backend logic exists in `functions/src/whatsapp.ts` for:
- Handling inbound messages via Twilio WhatsApp Sandbox webhooks.
- Sending outbound messages (text/template).
- AI-powered responses using Google Gemini for regular messages, product questions, and orders.
- Handling catalog and order webhooks from WhatsApp.
- Template approval workflow webhooks.
- Webhook analytics and logging.

### Security & Configuration
- **Backend Proxy:** Uses Firebase Functions as a secure backend proxy for AI calls (Gemini) and WhatsApp webhooks, keeping API keys in Google Secret Manager.
- **Environment Variables:** Managed via Vite's `.env` system and Firebase Functions' Secret Manager.
- **Demo Mode:** The frontend automatically detects if Firebase is configured and runs in a local/demo mode if not, using mock data and local storage.

## Development Conventions
- **Language:** 100% TypeScript for type safety.
- **Styling:** Tailwind CSS for utility-first styling.
- **Code Quality:** ESLint and Prettier for linting and formatting.
- **Git Commits:** Conventional commits are suggested.
- **Testing:** Unit and E2E testing setup with Vitest and Cypress.

## Extensions and Modular Features

While the project does not have a dedicated `extensions` directory, its architecture is designed for extensibility. Key functionalities can be viewed as modular extensions to the core platform:

1.  **Core Business Modules:** Sales, Inventory, CRM, Finance, Project Management, Team Management, E-commerce, Mobile Integration, Automation, Supply Chain, Integrations, and Compliance are distinct modules that extend the platform's capabilities.
2.  **Specialized AI Systems:** The "Viral Prediction" system is a unique, self-contained extension leveraging AI for social media analytics.
3.  **Third-Party Integrations:** Twilio (WhatsApp) and Google GenAI (Gemini) integrations are significant extensions that add communication and AI capabilities.
4.  **Backend Functions:** Firebase Functions (`functions/src/`) act as a flexible backend extension point for handling server-side logic, webhooks, and integrations.
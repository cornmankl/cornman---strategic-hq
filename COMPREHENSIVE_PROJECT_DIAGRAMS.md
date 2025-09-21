# 🌽 CORNMAN Strategic HQ - Comprehensive Project Diagrams

> **Panduan Visual Lengkap untuk Projek CORNMAN Strategic HQ**
> 
> Dokumen ini mengandungi diagram komprehensif yang menunjukkan struktur projek, arsitektur, dan aliran data.

## 📋 **KANDUNGAN**

1. [🏗️ Arsitektur Sistem Keseluruhan](#-arsitektur-sistem-keseluruhan)
2. [📊 Diagram Struktur Komponen](#-diagram-struktur-komponen)
3. [🔄 Aliran Data dan Integrasi](#-aliran-data-dan-integrasi)
4. [🛠️ Teknologi Stack](#️-teknologi-stack)
5. [📱 Organisasi Feature](#-organisasi-feature)
6. [🔐 Keselamatan dan Autentikasi](#-keselamatan-dan-autentikasi)
7. [📊 Dashboard dan Analytics](#-dashboard-dan-analytics)

---

## 🏗️ **ARSITEKTUR SISTEM KESELURUHAN**

```mermaid
graph TB
    subgraph "Frontend Layer"
        A[React App<br/>TypeScript + Vite] --> B[Component Library]
        A --> C[State Management<br/>Context API]
        A --> D[Routing<br/>React Router]
    end
    
    subgraph "UI Components"
        B --> E[Dashboard Components]
        B --> F[Business Components]
        B --> G[Analytics Components]
        B --> H[Mobile Components]
    end
    
    subgraph "Business Logic"
        C --> I[App State Context]
        C --> J[Auth Context]
        C --> K[Team Context]
        C --> L[Analytics Context]
    end
    
    subgraph "Services Layer"
        M[Firebase Services]
        N[Gemini AI Service]
        O[Twilio WhatsApp]
        P[Analytics Service]
        Q[Team Service]
    end
    
    subgraph "Backend/Cloud"
        R[Firebase Hosting]
        S[Firebase Functions]
        T[Firebase Firestore]
        U[Firebase Auth]
        V[Google Cloud Secret Manager]
    end
    
    subgraph "External APIs"
        W[Google Gemini API]
        X[Twilio WhatsApp API]
        Y[Third-party Integrations]
    end
    
    A --> M
    M --> R
    S --> T
    S --> U
    S --> V
    N --> W
    O --> X
    S --> W
    S --> X
    
    style A fill:#4CAF50,stroke:#2E7D32,color:#fff
    style B fill:#2196F3,stroke:#1565C0,color:#fff
    style C fill:#FF9800,stroke:#E65100,color:#fff
    style M fill:#9C27B0,stroke:#6A1B9A,color:#fff
    style R fill:#F44336,stroke:#C62828,color:#fff
```

---

## 📊 **DIAGRAM STRUKTUR KOMPONEN**

```mermaid
graph TD
    subgraph "App.tsx - Root Application"
        APP[App Component]
    end
    
    subgraph "Features - Main Pages"
        DASH[Dashboard Page]
        PROJ[Projects Page]
        SALES[Sales Page]
        INV[Inventory Page]
        ANAL[Analytics Page]
        TEAM[Team Page]
        WA[WhatsApp Page]
        SET[Settings Page]
    end
    
    subgraph "Shared Components"
        HEAD[Header]
        NAV[Navigation]
        CARD[Card Components]
        UI[UI Components]
        FORM[Form Components]
    end
    
    subgraph "Business Components"
        CREW[Project C.R.E.W.]
        GEN[Generator Cards]
        IMG[Image Generator]
        SCHED[Content Scheduler]
        BRIEF[AI Strategic Briefing]
    end
    
    subgraph "Dashboard Components"
        SMART[Smart Dashboard]
        KPI[KPI Widgets]
        CHARTS[Chart Components]
        METRICS[Metrics Display]
    end
    
    subgraph "Integration Components"
        PHONE[Phone Shell]
        TIKTOK[TikTok Preview]
        WHATS[WhatsApp Interface]
        TWILIO[Twilio Dashboard]
    end
    
    APP --> DASH
    APP --> PROJ
    APP --> SALES
    APP --> INV
    APP --> ANAL
    APP --> TEAM
    APP --> WA
    APP --> SET
    
    DASH --> SMART
    DASH --> KPI
    DASH --> CHARTS
    DASH --> METRICS
    
    PROJ --> CREW
    PROJ --> GEN
    PROJ --> IMG
    
    ALL_PAGES --> HEAD
    ALL_PAGES --> NAV
    ALL_PAGES --> CARD
    ALL_PAGES --> UI
    ALL_PAGES --> FORM
    
    WA --> PHONE
    WA --> WHATS
    WA --> TWILIO
    
    style APP fill:#4CAF50,stroke:#2E7D32,color:#fff
    style CREW fill:#FF9800,stroke:#E65100,color:#fff
    style SMART fill:#2196F3,stroke:#1565C0,color:#fff
    style WHATS fill:#25D366,stroke:#128C7E,color:#fff
```

---

## 🔄 **ALIRAN DATA DAN INTEGRASI**

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant C as Context
    participant S as Services
    participant FB as Firebase
    participant G as Gemini AI
    participant T as Twilio
    
    Note over U,T: Business Operation Flow
    
    U->>F: Input Business Data
    F->>C: Update State
    C->>S: Process Business Logic
    S->>FB: Store/Retrieve Data
    FB-->>S: Return Data
    S-->>C: Return Processed Data
    C-->>F: Update UI
    F-->>U: Display Results
    
    Note over U,T: AI Content Generation Flow
    
    U->>F: Request AI Content
    F->>S: Trigger AI Service
    S->>G: Send Prompt
    G-->>S: Return Generated Content
    S->>FB: Store Content
    S-->>F: Return Content
    F-->>U: Display Generated Content
    
    Note over U,T: WhatsApp Integration Flow
    
    U->>F: Configure WhatsApp
    F->>S: Setup WhatsApp Bot
    S->>T: Configure Webhook
    T-->>S: Confirm Setup
    S->>FB: Store Configuration
    
    Note over T: Incoming WhatsApp Message
    T->>FB: Webhook Trigger
    FB->>G: Process with AI
    G-->>FB: Return Response
    FB->>T: Send Reply
    T-->>U: WhatsApp Message
```

---

## 🛠️ **TEKNOLOGI STACK**

```mermaid
graph TB
    subgraph "Frontend Technologies"
        A[React 19.1.1]
        B[TypeScript 5.8.2]
        C[Vite 6.2.0]
        D[Tailwind CSS 3.4.13]
        E[Lucide React Icons]
    end
    
    subgraph "State Management"
        F[React Context API]
        G[Custom Contexts]
        H[Local Storage]
        I[Real-time Sync]
    end
    
    subgraph "Backend & Cloud"
        J[Firebase 12.1.0]
        K[Firebase Functions]
        L[Firebase Firestore]
        M[Firebase Auth]
        N[Firebase Hosting]
    end
    
    subgraph "AI & Communication"
        O[Google Gemini API]
        P[Twilio 5.8.0]
        Q[WhatsApp Business API]
        R[QR Code Generation]
    end
    
    subgraph "Development Tools"
        S[ESLint 8.57.0]
        T[Prettier 3.3.2]
        U[Vitest 1.6.0]
        V[PostCSS 8.4.49]
    end
    
    subgraph "Build & Deploy"
        W[Vite Build]
        X[Firebase Deploy]
        Y[Progressive Web App]
        Z[Service Workers]
    end
    
    A --> F
    B --> A
    C --> A
    D --> A
    F --> G
    G --> H
    J --> K
    J --> L
    J --> M
    J --> N
    O --> K
    P --> Q
    
    style A fill:#61DAFB,stroke:#21A5C4,color:#000
    style B fill:#3178C6,stroke:#2B5797,color:#fff
    style J fill:#FFCA28,stroke:#F57F17,color:#000
    style O fill:#4285F4,stroke:#1A73E8,color:#fff
    style P fill:#F22F46,stroke:#D91E36,color:#fff
```

---

## 📱 **ORGANISASI FEATURE**

```mermaid
graph LR
    subgraph "Core Features"
        A[Dashboard]
        B[Project Management]
        C[Sales Tracking]
        D[Inventory Control]
    end
    
    subgraph "AI-Powered Features"
        E[Content Generation]
        F[Strategic Briefing]
        G[Business Analytics]
        H[Market Insights]
    end
    
    subgraph "Communication Features"
        I[WhatsApp Integration]
        J[Twilio SMS]
        K[Customer Engagement]
        L[Team Collaboration]
    end
    
    subgraph "Business Intelligence"
        M[Real-time Analytics]
        N[Performance Metrics]
        O[Financial Tracking]
        P[Growth Forecasting]
    end
    
    subgraph "Mobile & Social"
        Q[Mobile App Interface]
        R[TikTok Integration]
        S[Social Media Scheduler]
        T[Viral Content Tools]
    end
    
    A --> E
    B --> F
    C --> G
    D --> H
    
    E --> I
    F --> J
    G --> K
    H --> L
    
    I --> M
    J --> N
    K --> O
    L --> P
    
    M --> Q
    N --> R
    O --> S
    P --> T
    
    style A fill:#4CAF50,stroke:#2E7D32,color:#fff
    style E fill:#FF9800,stroke:#E65100,color:#fff
    style I fill:#25D366,stroke:#128C7E,color:#fff
    style M fill:#2196F3,stroke:#1565C0,color:#fff
    style Q fill:#9C27B0,stroke:#6A1B9A,color:#fff
```

---

## 🔐 **KESELAMATAN DAN AUTENTIKASI**

```mermaid
graph TD
    subgraph "Authentication Flow"
        A[User Login]
        B[Firebase Auth]
        C[JWT Token]
        D[Protected Routes]
    end
    
    subgraph "Authorization"
        E[Role-Based Access]
        F[Owner Role]
        G[Manager Role]
        H[Crew Role]
    end
    
    subgraph "Data Security"
        I[Firestore Rules]
        J[Row Level Security]
        K[Data Encryption]
        L[HTTPS Only]
    end
    
    subgraph "API Security"
        M[Secret Manager]
        N[Environment Variables]
        O[API Key Rotation]
        P[Rate Limiting]
    end
    
    subgraph "Compliance"
        Q[GDPR Compliance]
        R[PDPA Malaysia]
        S[Data Privacy]
        T[Audit Logging]
    end
    
    A --> B
    B --> C
    C --> D
    D --> E
    
    E --> F
    E --> G
    E --> H
    
    F --> I
    G --> I
    H --> I
    
    I --> J
    J --> K
    K --> L
    
    B --> M
    M --> N
    N --> O
    O --> P
    
    L --> Q
    P --> R
    Q --> S
    R --> T
    
    style B fill:#4CAF50,stroke:#2E7D32,color:#fff
    style E fill:#FF9800,stroke:#E65100,color:#fff
    style I fill:#F44336,stroke:#C62828,color:#fff
    style M fill:#9C27B0,stroke:#6A1B9A,color:#fff
    style Q fill:#2196F3,stroke:#1565C0,color:#fff
```

---

## 📊 **DASHBOARD DAN ANALYTICS**

```mermaid
graph TB
    subgraph "Smart Dashboard"
        A[Executive Summary]
        B[KPI Widgets]
        C[Real-time Metrics]
        D[Performance Charts]
    end
    
    subgraph "Business Analytics"
        E[Sales Analytics]
        F[Customer Insights]
        G[Inventory Analysis]
        H[Financial Reports]
    end
    
    subgraph "AI Insights"
        I[Predictive Analytics]
        J[Market Trends]
        K[Growth Opportunities]
        L[Risk Assessment]
    end
    
    subgraph "Operational Metrics"
        M[Team Performance]
        N[Project Progress]
        O[System Health]
        P[User Engagement]
    end
    
    subgraph "Data Sources"
        Q[Firebase Firestore]
        R[Real-time Sync]
        S[External APIs]
        T[User Interactions]
    end
    
    A --> E
    B --> F
    C --> G
    D --> H
    
    E --> I
    F --> J
    G --> K
    H --> L
    
    I --> M
    J --> N
    K --> O
    L --> P
    
    M --> Q
    N --> R
    O --> S
    P --> T
    
    Q --> A
    R --> B
    S --> C
    T --> D
    
    style A fill:#4CAF50,stroke:#2E7D32,color:#fff
    style E fill:#2196F3,stroke:#1565C0,color:#fff
    style I fill:#FF9800,stroke:#E65100,color:#fff
    style M fill:#9C27B0,stroke:#6A1B9A,color:#fff
    style Q fill:#607D8B,stroke:#37474F,color:#fff
```

---

## 🗂️ **STRUKTUR DIREKTORI TERPERINCI**

```
cornman---strategic-hq/
├── 📁 src/                           # Source Code Utama
│   ├── 📁 components/                # Komponen React
│   │   ├── 📁 analytics/            # Komponen Analytics
│   │   │   ├── AnalyticsDashboard.tsx
│   │   │   ├── ChartComponents.tsx
│   │   │   └── MetricsDisplay.tsx
│   │   ├── 📁 auth/                 # Komponen Autentikasi
│   │   │   ├── LoginForm.tsx
│   │   │   ├── SignupForm.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── 📁 dashboard/            # Komponen Dashboard
│   │   │   ├── SmartDashboard.tsx
│   │   │   ├── KPIWidgets.tsx
│   │   │   └── ExecutiveSummary.tsx
│   │   ├── 📁 ecommerce/            # Komponen E-commerce
│   │   │   ├── ProductCatalog.tsx
│   │   │   ├── OrderManagement.tsx
│   │   │   └── PaymentIntegration.tsx
│   │   ├── 📁 navigation/           # Komponen Navigasi
│   │   │   ├── Header.tsx
│   │   │   ├── MobileNavigation.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── 📁 primitives/           # Komponen Asas UI
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Modal.tsx
│   │   ├── 📁 team/                 # Komponen Team
│   │   │   ├── TeamMembership.tsx
│   │   │   ├── TaskAssignment.tsx
│   │   │   └── PerformanceMetrics.tsx
│   │   ├── 📁 whatsapp/             # Komponen WhatsApp
│   │   │   ├── WhatsAppBot.tsx
│   │   │   ├── ChatInterface.tsx
│   │   │   └── BotConfiguration.tsx
│   │   ├── ProjectCrew.tsx          # Sistem Project C.R.E.W.
│   │   ├── GeneratorCard.tsx        # AI Content Generator
│   │   ├── BusinessOS.tsx           # Business Operating System
│   │   └── AiStrategicBriefing.tsx  # AI Strategic Briefing
│   ├── 📁 contexts/                 # React Contexts
│   │   ├── AppStateContext.tsx      # State Management Utama
│   │   ├── AuthContext.tsx          # Autentikasi Context
│   │   ├── AnalyticsContext.tsx     # Analytics Context
│   │   ├── TeamContext.tsx          # Team Management Context
│   │   └── ThemeContext.tsx         # Theme Management
│   ├── 📁 features/                 # Feature-based Organization
│   │   ├── 📁 analytics/            # Analytics Feature
│   │   ├── 📁 dashboard/            # Dashboard Feature
│   │   ├── 📁 inventory/            # Inventory Feature
│   │   ├── 📁 projects/             # Projects Feature
│   │   ├── 📁 sales/                # Sales Feature
│   │   ├── 📁 settings/             # Settings Feature
│   │   └── 📁 whatsapp/             # WhatsApp Feature
│   ├── 📁 hooks/                    # Custom React Hooks
│   │   ├── useAppState.ts           # App State Hook
│   │   ├── useAuth.ts               # Authentication Hook
│   │   ├── useAnalytics.ts          # Analytics Hook
│   │   └── useRealTimeSync.ts       # Real-time Synchronization
│   ├── 📁 services/                 # Business Logic Services
│   │   ├── firebase.ts              # Firebase Configuration
│   │   ├── geminiService.ts         # Google Gemini AI Service
│   │   ├── twilioService.ts         # Twilio WhatsApp Service
│   │   ├── analytics.ts             # Analytics Service
│   │   ├── teamService.ts           # Team Management Service
│   │   └── ecommerceService.ts      # E-commerce Service
│   ├── 📁 types/                    # TypeScript Type Definitions
│   │   ├── index.ts                 # Core Types
│   │   ├── team.ts                  # Team Types
│   │   ├── ecommerce.ts             # E-commerce Types
│   │   ├── analytics.ts             # Analytics Types
│   │   └── integrations.ts          # Integration Types
│   ├── 📁 utils/                    # Utility Functions
│   │   ├── constants.ts             # Application Constants
│   │   ├── helpers.ts               # Helper Functions
│   │   └── validators.ts            # Validation Functions
│   ├── App.tsx                      # Root Application Component
│   └── index.tsx                    # Application Entry Point
├── 📁 functions/                    # Firebase Cloud Functions
│   ├── 📁 src/                      # Functions Source Code
│   │   ├── gemini.ts                # Gemini AI Functions
│   │   ├── whatsapp.ts              # WhatsApp Webhook Functions
│   │   └── analytics.ts             # Analytics Functions
│   └── package.json                 # Functions Dependencies
├── 📁 public/                       # Static Assets
│   ├── manifest.json                # PWA Manifest
│   ├── favicon.ico                  # Application Icon
│   └── apple-touch-icon.png         # iOS Icon
├── 📁 docs/                         # Documentation
│   ├── 📁 api/                      # API Documentation
│   ├── 📁 setup/                    # Setup Guides
│   ├── 📁 architecture/             # Architecture Documentation
│   └── 📁 deployment/               # Deployment Guides
├── package.json                     # Project Dependencies
├── vite.config.ts                   # Vite Configuration
├── tailwind.config.ts               # Tailwind CSS Configuration
├── tsconfig.json                    # TypeScript Configuration
├── firebase.json                    # Firebase Configuration
└── README.md                        # Project Documentation
```

---

## 🎯 **KOMPONEN UTAMA DAN FUNGSINYA**

### **Dashboard Components**
- **SmartDashboard**: Dashboard utama dengan KPI real-time
- **AiStrategicBriefing**: Briefing strategik berdasarkan AI
- **AnalyticsDashboard**: Dashboard analytics mendalam

### **Business Management**
- **ProjectCrew**: Sistem pengurusan projek C.R.E.W.
- **BusinessOS**: Sistem operasi perniagaan terpadu
- **CustomerHub**: Pengurusan hubungan pelanggan

### **AI-Powered Tools**
- **GeneratorCard**: Penjana kandungan AI
- **ImageGeneratorCard**: Penjana imej AI
- **ContentScheduler**: Penjadual kandungan automatik

### **Communication & Integration**
- **WhatsAppBot**: Bot WhatsApp pintar
- **TwilioDashboard**: Dashboard integrasi Twilio
- **PhoneShell**: Interface komunikasi mobile

### **Analytics & Reporting**
- **PerformanceMetrics**: Metrik prestasi real-time
- **ChartComponents**: Komponen carta interaktif
- **RevenueTracking**: Jejak pendapatan dan keuntungan

---

## 🔄 **ALIRAN KERJA SISTEM**

### **1. User Authentication Flow**
```
Login → Firebase Auth → JWT Token → Protected Routes → Dashboard
```

### **2. Business Data Flow**
```
User Input → Context State → Service Layer → Firebase → Real-time Updates
```

### **3. AI Content Generation Flow**
```
User Request → Gemini Service → AI Processing → Content Storage → UI Display
```

### **4. WhatsApp Integration Flow**
```
WhatsApp Message → Twilio Webhook → Firebase Function → AI Processing → Auto Reply
```

### **5. Analytics Processing Flow**
```
User Actions → Event Tracking → Data Aggregation → Real-time Dashboard → Insights
```

---

## 🚀 **CARA PENGGUNAAN DIAGRAM**

### **Untuk Developer:**
1. Gunakan **Struktur Direktori** untuk navigasi kod
2. Rujuk **Arsitektur Sistem** untuk memahami aliran data
3. Ikut **Komponen Diagram** untuk pembangunan feature baru

### **Untuk Project Manager:**
1. Gunakan **Organisasi Feature** untuk planning sprint
2. Rujuk **Aliran Kerja** untuk memahami proses bisnes
3. Monitor **Dashboard Analytics** untuk KPI tracking

### **Untuk Business User:**
1. Fahami **Feature Map** untuk penggunaan sistem
2. Ikut **User Flow** untuk operasi harian
3. Gunakan **Dashboard** untuk monitoring perniagaan

---

**📝 Nota:** Diagram ini adalah representasi visual terkini projek CORNMAN Strategic HQ. Untuk maklumat terkini, sila rujuk dokumentasi kod dan README.md.

---

**🌽 Built with ❤️ by the CORNMAN Team**

*"Transforming businesses, one kernel at a time."*
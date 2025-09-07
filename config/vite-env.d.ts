/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY: string;
  readonly VITE_BACKEND_BASE_URL: string;
  readonly VITE_USE_BACKEND: string;
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly DEV: boolean;
  
  // Twilio environment variables
  readonly VITE_TWILIO_ACCOUNT_SID: string;
  readonly VITE_TWILIO_AUTH_TOKEN: string;
  readonly VITE_TWILIO_WHATSAPP_NUMBER: string;
  readonly VITE_TWILIO_PHONE_NUMBER: string;
  readonly VITE_TWILIO_ENVIRONMENT: string;
  readonly VITE_TWILIO_TEST_ACCOUNT_SID: string;
  readonly VITE_TWILIO_TEST_AUTH_TOKEN: string;
  readonly VITE_TWILIO_TEST_PHONE_NUMBER: string;
  readonly VITE_TWILIO_LIVE_ACCOUNT_SID: string;
  readonly VITE_TWILIO_LIVE_AUTH_TOKEN: string;
  readonly VITE_TWILIO_LIVE_WHATSAPP_NUMBER: string;
  readonly VITE_TWILIO_LIVE_PHONE_NUMBER: string;
  
  // Firebase environment variables
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
  readonly VITE_FIREBASE_MEASUREMENT_ID: string;
  readonly VITE_USE_FIREBASE_EMULATORS: string;
  
  // Other environment variables
  readonly VITE_ERROR_REPORTING_ENDPOINT: string;
  readonly VITE_OPENAI_API_KEY: string;
  readonly VITE_ANTHROPIC_API_KEY: string;
  readonly VITE_APP_ENVIRONMENT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

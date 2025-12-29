/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_API_TIMEOUT: string
  readonly VITE_ENVIRONMENT: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_ENABLE_ANALYTICS: string
  readonly VITE_ENABLE_DEBUG: string
  readonly VITE_ENABLE_MOCK_DATA: string
  readonly VITE_SENTRY_DSN: string
  readonly VITE_GOOGLE_ANALYTICS_ID: string
  readonly VITE_NGROK_ENABLED: string
  readonly VITE_NGROK_BACKEND_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

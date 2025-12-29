// API Configuration
const API_CONFIG = {
  // Usar variables de entorno de Vite
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
  
  // Configuración de entorno
  ENVIRONMENT: import.meta.env.VITE_ENVIRONMENT || 'development',
  
  // Features
  ENABLE_DEBUG: import.meta.env.VITE_ENABLE_DEBUG === 'true',
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  
  // Detectar automáticamente el entorno
  getBaseURL: () => {
    // Si hay configuración de ngrok habilitada
    if (import.meta.env.VITE_NGROK_ENABLED === 'true' && import.meta.env.VITE_NGROK_BACKEND_URL) {
      return import.meta.env.VITE_NGROK_BACKEND_URL;
    }
    
    // Si estamos en ngrok (URL contiene ngrok-free.app)
    if (window.location.hostname.includes('ngrok-free.app') && import.meta.env.VITE_NGROK_BACKEND_URL) {
      return import.meta.env.VITE_NGROK_BACKEND_URL;
    }
    
    // Usar la URL base configurada
    return API_CONFIG.BASE_URL;
  },
  
  // Headers por defecto
  getDefaultHeaders: () => ({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }),
};

export default API_CONFIG;
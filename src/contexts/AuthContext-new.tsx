import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Types
export interface Company {
  id: string;
  name: string;
  displayName: string;
  role: string;
  permissions: string[];
  status: string;
  lastAccess?: string;
  plan: string;
  industry: string;
  settings?: {
    baseCurrency: string;
    timezone: string;
    dateFormat: string;
  };
  subscription?: {
    plan: string;
    status: string;
    endDate: string;
    maxUsers: number;
    maxStorageGB: number;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  username?: string;
  avatar?: string;
  phone?: string;
  country?: string;
  globalRole: 'super_admin' | 'support' | 'user';
  status: 'pending' | 'active' | 'suspended' | 'deactivated';
  preferences?: {
    language: string;
    timezone: string;
    currency: string;
    theme: string;
  };
  hasCompanies: boolean;
  companies: Company[];
  lastLogin?: string;
}

export interface AuthState {
  user: User | null;
  selectedCompany: Company | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  needsCompanySelection: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  username?: string;
  phone?: string;
  country?: string;
}

export interface CompanyData {
  name: string;
  email: string;
  industry: string;
  country: string;
  phone?: string;
  description?: string;
}

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'COMPANY_SELECTED'; payload: { company: Company; token: string } }
  | { type: 'COMPANY_CREATED'; payload: { company: Company; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean };

// Initial state
const initialState: AuthState = {
  user: null,
  selectedCompany: null,
  isAuthenticated: false,
  isLoading: true,
  needsCompanySelection: false,
  error: null,
};

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        needsCompanySelection: !action.payload.user.hasCompanies || action.payload.user.companies.length === 0,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        selectedCompany: null,
        isAuthenticated: false,
        isLoading: false,
        needsCompanySelection: false,
        error: action.payload,
      };
    case 'COMPANY_SELECTED':
      return {
        ...state,
        selectedCompany: action.payload.company,
        needsCompanySelection: false,
        isLoading: false,
        error: null,
      };
    case 'COMPANY_CREATED':
      return {
        ...state,
        selectedCompany: action.payload.company,
        needsCompanySelection: false,
        isLoading: false,
        error: null,
        user: state.user ? {
          ...state.user,
          hasCompanies: true,
          companies: [...state.user.companies, action.payload.company]
        } : null,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        selectedCompany: null,
        isAuthenticated: false,
        isLoading: false,
        needsCompanySelection: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};

// Context
interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  selectCompany: (companyId: string) => Promise<void>;
  createCompany: (data: CompanyData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    dispatch({ type: 'LOGIN_START' });

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Error de autenticación');
      }

      const { token, user } = result.data;

      // Guardar token básico
      localStorage.setItem('siaff_token', token);
      
      if (credentials.rememberMe) {
        localStorage.setItem('siaff_user', JSON.stringify(user));
      }

      dispatch({ type: 'LOGIN_SUCCESS', payload: { user } });
    } catch (error) {
      dispatch({ 
        type: 'LOGIN_FAILURE', 
        payload: error instanceof Error ? error.message : 'Error de autenticación' 
      });
      throw error;
    }
  };

  const register = async (data: RegisterData): Promise<void> => {
    dispatch({ type: 'LOGIN_START' });

    try {
      // Validaciones
      if (data.password !== data.confirmPassword) {
        throw new Error('Las contraseñas no coinciden');
      }

      if (data.password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Error en el registro');
      }

      const { token, user } = result.data;

      // Guardar token básico
      localStorage.setItem('siaff_token', token);
      localStorage.setItem('siaff_user', JSON.stringify(user));

      dispatch({ type: 'LOGIN_SUCCESS', payload: { user } });
      
    } catch (error) {
      dispatch({ 
        type: 'LOGIN_FAILURE', 
        payload: error instanceof Error ? error.message : 'Error en el registro' 
      });
      throw error;
    }
  };

  const selectCompany = async (companyId: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      const token = localStorage.getItem('siaff_token');
      const response = await fetch('/api/auth/select-company', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ companyId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Error al seleccionar empresa');
      }

      const { token: newToken, selectedCompany } = result.data;

      // Actualizar token con contexto de empresa
      localStorage.setItem('siaff_token', newToken);
      localStorage.setItem('siaff_company', JSON.stringify(selectedCompany));

      dispatch({ type: 'COMPANY_SELECTED', payload: { company: selectedCompany, token: newToken } });
    } catch (error) {
      dispatch({ 
        type: 'LOGIN_FAILURE', 
        payload: error instanceof Error ? error.message : 'Error al seleccionar empresa' 
      });
      throw error;
    }
  };

  const createCompany = async (data: CompanyData): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      const token = localStorage.getItem('siaff_token');
      const response = await fetch('/api/auth/create-company', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Error al crear empresa');
      }

      const { token: newToken, company } = result.data;

      // Actualizar token con contexto de empresa
      localStorage.setItem('siaff_token', newToken);
      localStorage.setItem('siaff_company', JSON.stringify(company));

      dispatch({ type: 'COMPANY_CREATED', payload: { company, token: newToken } });
    } catch (error) {
      dispatch({ 
        type: 'LOGIN_FAILURE', 
        payload: error instanceof Error ? error.message : 'Error al crear empresa' 
      });
      throw error;
    }
  };

  const logout = (): void => {
    localStorage.removeItem('siaff_user');
    localStorage.removeItem('siaff_company');
    localStorage.removeItem('siaff_token');
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Verificar si hay usuario guardado al inicializar
  React.useEffect(() => {
    const initializeAuth = () => {
      const savedUser = localStorage.getItem('siaff_user');
      const savedCompany = localStorage.getItem('siaff_company');
      const savedToken = localStorage.getItem('siaff_token');
      
      if (savedUser && savedToken) {
        try {
          const user = JSON.parse(savedUser);
          
          if (savedCompany) {
            // Usuario tiene empresa seleccionada
            const company = JSON.parse(savedCompany);
            dispatch({ type: 'LOGIN_SUCCESS', payload: { user } });
            dispatch({ type: 'COMPANY_SELECTED', payload: { company, token: savedToken } });
          } else {
            // Usuario logueado pero sin empresa seleccionada
            dispatch({ type: 'LOGIN_SUCCESS', payload: { user } });
          }
        } catch (error) {
          // Datos corruptos, limpiar todo
          localStorage.removeItem('siaff_user');
          localStorage.removeItem('siaff_company');
          localStorage.removeItem('siaff_token');
          dispatch({ type: 'LOGOUT' });
        }
      } else {
        dispatch({ type: 'LOGOUT' });
      }
    };

    // Pequeño delay para evitar flashing
    const timer = setTimeout(initializeAuth, 100);
    return () => clearTimeout(timer);
  }, []);

  const value: AuthContextType = {
    ...state,
    login,
    register,
    selectCompany,
    createCompany,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
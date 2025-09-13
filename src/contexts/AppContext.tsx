import React, { createContext, useContext, useState, ReactNode } from 'react';

// Types
export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  path?: string;
  children?: NavigationItem[];
  expanded?: boolean;
}

export interface AppState {
  currentSection: string;
  sidebarOpen: boolean;
  currentCompany: string;
  currentUnit: string;
}

interface AppContextType extends AppState {
  setCurrentSection: (section: string) => void;
  setSidebarOpen: (open: boolean) => void;
  setCurrentCompany: (company: string) => void;
  setCurrentUnit: (unit: string) => void;
  navigationItems: NavigationItem[];
}

// Initial state
const initialState: AppState = {
  currentSection: 'balance-general',
  sidebarOpen: false,
  currentCompany: 'TreeCloud Technologies',
  currentUnit: 'Unidad A',
};

// Navigation structure
const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'BarChart3',
    path: '/dashboard',
  },
  {
    id: 'finanzas-corporativas',
    label: 'Finanzas Corporativas',
    icon: 'Briefcase',
    expanded: true,
    children: [
      { id: 'catalogo-cuentas', label: 'Catálogo de Cuentas', icon: '', path: '/dashboard/catalogo-cuentas' },
      { id: 'balance-comprobacion', label: 'Balance de Comprobación', icon: '', path: '/dashboard/balance-comprobacion' },
      { id: 'balance-general', label: 'Balance General', icon: '', path: '/dashboard/balance-general' },
      { id: 'estado-resultados', label: 'Estado de Resultados', icon: '', path: '/dashboard/estado-resultados' },
      { id: 'indices-financieros', label: 'Índices Financieros', icon: '', path: '/dashboard/indices-financieros' },
      { id: 'consolidado', label: 'Consolidado', icon: '', path: '/dashboard/consolidado' },
      { id: 'reporte-mes-u', label: 'Reporte del mes (u)', icon: '', path: '/dashboard/reporte-mes-u' },
      { id: 'reporte-mensual-u', label: 'Reporte mensual (u)', icon: '', path: '/dashboard/reporte-mensual-u' },
      { id: 'reporte-cierre-u', label: 'Reporte de cierre (u)', icon: '', path: '/dashboard/reporte-cierre-u' },
    ],
  },
  {
    id: 'operaciones',
    label: 'Operaciones',
    icon: 'RefreshCw',
    children: [
      { id: 'ventas', label: 'Ventas', icon: 'TrendingUp', path: '/dashboard/ventas' },
      { id: 'compras', label: 'Compras', icon: 'Package', path: '/dashboard/compras' },
      { id: 'cuentas-pagar', label: 'Cuentas por Pagar', icon: 'CreditCard', path: '/dashboard/cuentas-pagar' },
      { id: 'cuentas-cobrar', label: 'Cuentas por Cobrar', icon: 'FileText', path: '/dashboard/cuentas-cobrar' },
      { id: 'kardex', label: 'Kardex', icon: 'BarChart', path: '/dashboard/kardex' },
    ],
  },
  {
    id: 'tributacion',
    label: 'Tributación',
    icon: 'Building',
    children: [
      { id: 'impuestos', label: 'Impuestos', icon: 'Building', path: '/dashboard/impuestos' },
    ],
  },
  {
    id: 'finanzas',
    label: 'Finanzas',
    icon: 'DollarSign',
    children: [
      { id: 'flujo-efectivo', label: 'Flujo de Efectivos', icon: 'DollarSign', path: '/dashboard/flujo-efectivo' },
      { id: 'leyes-laborales', label: 'Leyes Laborales', icon: 'Users', path: '/dashboard/leyes-laborales' },
      { id: 'prestamos', label: 'Préstamos Bancarios', icon: 'Banknote', path: '/dashboard/prestamos' },
    ],
  },
];

// Context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, setState] = useState<AppState>(initialState);

  const setCurrentSection = (section: string) => {
    setState(prev => ({ ...prev, currentSection: section }));
  };

  const setSidebarOpen = (open: boolean) => {
    setState(prev => ({ ...prev, sidebarOpen: open }));
  };

  const setCurrentCompany = (company: string) => {
    setState(prev => ({ ...prev, currentCompany: company }));
  };

  const setCurrentUnit = (unit: string) => {
    setState(prev => ({ ...prev, currentUnit: unit }));
  };

  const value: AppContextType = {
    ...state,
    setCurrentSection,
    setSidebarOpen,
    setCurrentCompany,
    setCurrentUnit,
    navigationItems,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Hook
export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
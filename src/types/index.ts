// Authentication types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  company: string;
  avatar?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// Financial types
export interface BalanceItem {
  id: string;
  name: string;
  value: number;
  formattedValue: string;
  indicator?: 'green' | 'red' | 'blue' | 'yellow';
  children?: BalanceItem[];
}

export interface FinancialAccount {
  id: string;
  code: string;
  name: string;
  type: 'asset' | 'liability' | 'equity' | 'income' | 'expense';
  category: 'current' | 'non-current';
  balance: number;
  parentId?: string;
}

export interface CashFlowEntry {
  id: string;
  date: Date;
  description: string;
  amount: number;
  type: 'inflow' | 'outflow';
  category: string;
  account: string;
}

// UI types
export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  path?: string;
  children?: NavigationItem[];
  expanded?: boolean;
  active?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  icon?: string;
  active?: boolean;
  path?: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  errors?: string[];
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Form types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: RegExp;
    message?: string;
  };
}

// Theme types
export interface ThemeColors {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  error: string;
  neutral: string;
}

// Company and Business Unit types
export interface Company {
  id: string;
  name: string;
  country: string;
  currency: string;
  timezone: string;
  logo?: string;
}

export interface BusinessUnit {
  id: string;
  name: string;
  companyId: string;
  manager: string;
  status: 'active' | 'inactive';
}

// Export utility type helpers
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
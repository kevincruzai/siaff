import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext-new';
import { AppProvider } from '@/contexts/AppContext';
import MainLayout from '@/components/MainLayout';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import AdminDashboard from '@/pages/AdminDashboard';
import CompanySelector from '@/pages/CompanySelector';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; requiresCompany?: boolean; adminOnly?: boolean }> = ({ 
  children, 
  requiresCompany = true,
  adminOnly = false 
}) => {
  const { isAuthenticated, isLoading, user, needsCompanySelection, selectedCompany } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si necesita selección de empresa y no tiene empresa seleccionada
  if (requiresCompany && (needsCompanySelection || !selectedCompany)) {
    return <Navigate to="/select-company" replace />;
  }

  // Verificar permisos de admin (ahora basado en rol por empresa o rol global)
  if (adminOnly) {
    const isSystemAdmin = user?.globalRole === 'super_admin';
    const isCompanyAdmin = selectedCompany?.role === 'owner' || selectedCompany?.role === 'admin';
    
    if (!isSystemAdmin && !isCompanyAdmin) {
      return <Navigate to="/dashboard/financial-dashboard" replace />;
    }
  }
  
  return <>{children}</>;
};

// Public Route Component (redirect if authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, needsCompanySelection, selectedCompany } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }
  
  if (isAuthenticated) {
    // Si necesita selección de empresa, redirigir ahí
    if (needsCompanySelection || !selectedCompany) {
      return <Navigate to="/select-company" replace />;
    }
    
    // Si ya tiene empresa seleccionada, redirigir al dashboard
    return <Navigate to="/dashboard/financial-dashboard" replace />;
  }
  
  return <>{children}</>;
};

// Company Selection Route (only for authenticated users without company)
const CompanySelectionRoute: React.FC = () => {
  const { isAuthenticated, isLoading, needsCompanySelection, selectedCompany } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si ya tiene empresa seleccionada, redirigir al dashboard
  if (!needsCompanySelection && selectedCompany) {
    return <Navigate to="/dashboard/financial-dashboard" replace />;
  }
  
  return <CompanySelector />;
};

// Smart Home Route Component
const SmartHomeRoute: React.FC = () => {
  const { isAuthenticated, isLoading, needsCompanySelection, selectedCompany, user } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }
  
  if (isAuthenticated) {
    // Si necesita selección de empresa
    if (needsCompanySelection || !selectedCompany) {
      return <Navigate to="/select-company" replace />;
    }
    
    // Redirigir según el tipo de usuario
    const isSystemAdmin = user?.globalRole === 'super_admin';
    const isCompanyAdmin = selectedCompany?.role === 'owner' || selectedCompany?.role === 'admin';
    
    if (isSystemAdmin || isCompanyAdmin) {
      return <Navigate to="/admin/user-management" replace />;
    } else {
      return <Navigate to="/dashboard/financial-dashboard" replace />;
    }
  }
  
  return <Navigate to="/login" replace />;
};

// App Routes Component
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <Auth />
          </PublicRoute>
        } 
      />
      
      <Route 
        path="/register" 
        element={
          <PublicRoute>
            <Auth />
          </PublicRoute>
        } 
      />
      
      <Route 
        path="/select-company" 
        element={<CompanySelectionRoute />} 
      />
      
      <Route 
        path="/admin/*" 
        element={
          <ProtectedRoute adminOnly>
            <AppProvider>
              <AdminDashboard />
            </AppProvider>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/dashboard/*" 
        element={
          <ProtectedRoute>
            <AppProvider>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </AppProvider>
          </ProtectedRoute>
        } 
      />
      
      <Route path="/" element={<SmartHomeRoute />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// Main App Component
const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;
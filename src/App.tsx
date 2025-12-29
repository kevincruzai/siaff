import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { AppProvider } from '@/contexts/AppContext';
import MainLayout from '@/components/MainLayout';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import AdminDashboard from '@/pages/AdminDashboard';
import CompanySelector from '@/pages/CompanySelector';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isLoading, user, needsCompanySelection, selectedCompany, currentRole } = useAuth();
  
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

  // Si es super admin, no necesita selección de empresa
  if (user?.globalRole === 'super_admin') {
    // Verificar permisos de admin para super admins
    if (adminOnly) {
      // Super admins siempre tienen acceso admin
      return <>{children}</>;
    }
    return <>{children}</>;
  }

  // Para usuarios normales, verificar si necesita selección de empresa
  if (needsCompanySelection || !selectedCompany) {
    return <Navigate to="/company-selector" replace />;
  }

  // Verificar permisos de admin basado en el nuevo sistema de roles
  if (adminOnly) {
    const hasAdminAccess = currentRole === 'owner' || currentRole === 'admin';
    
    if (!hasAdminAccess) {
      return <Navigate to="/dashboard/financial-dashboard" replace />;
    }
  }
  
  return <>{children}</>;
};

// Public Route Component (redirect if authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, needsCompanySelection, selectedCompany, user } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }
  
  if (isAuthenticated) {
    // Si es super admin, redirigir directamente al panel de administración
    if (user?.globalRole === 'super_admin') {
      return <Navigate to="/admin/user-management" replace />;
    }
    
    if (needsCompanySelection || !selectedCompany) {
      return <Navigate to="/company-selector" replace />;
    }
    // Redirigir al dashboard si ya está autenticado y tiene empresa seleccionada
    return <Navigate to="/dashboard/financial-dashboard" replace />;
  }
  
  return <>{children}</>;
};

// Company Selection Route Component
const CompanySelectorRoute: React.FC = () => {
  const { isAuthenticated, isLoading, needsCompanySelection, selectedCompany, user } = useAuth();
  
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
  
  // Si es super admin, redirigir directamente al panel de administración
  if (user?.globalRole === 'super_admin') {
    return <Navigate to="/admin/user-management" replace />;
  }
  
  // Si ya tiene empresa seleccionada, redirigir al dashboard
  if (!needsCompanySelection && selectedCompany) {
    return <Navigate to="/dashboard/financial-dashboard" replace />;
  }
  
  return <CompanySelector />;
};

// Smart Home Route Component
const SmartHomeRoute: React.FC = () => {
  const { isAuthenticated, user, isLoading, needsCompanySelection, selectedCompany, currentRole } = useAuth();
  
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
  
  // Si es super admin, redirigir directamente al panel de administración
  if (user?.globalRole === 'super_admin') {
    return <Navigate to="/admin/user-management" replace />;
  }
  
  if (needsCompanySelection || !selectedCompany) {
    return <Navigate to="/company-selector" replace />;
  }
  
  // Redirigir según el rol del usuario
  const hasAdminAccess = currentRole === 'owner' || currentRole === 'admin';
  
  const redirectPath = hasAdminAccess ? '/admin/user-management' : '/dashboard/financial-dashboard';
  return <Navigate to={redirectPath} replace />;
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
        path="/company-selector" 
        element={<CompanySelectorRoute />}
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
      <Route path="*" element={<Navigate to="/login" replace />} />
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
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  X, 
  BarChart3, 
  TrendingUp, 
  Calculator, 
  DollarSign, 
  Banknote, 
  CreditCard, 
  PieChart, 
  FileText, 
  BarChart, 
  Target, 
  TrendingDown, 
  ChevronDown, 
  ChevronRight,
  LayoutDashboard,
  Settings,
  Users,
  Package,
  Shield,
  UserCheck,
  Building2,
  Repeat
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, selectedCompany, currentRole } = useAuth();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const sidebarClasses = `
    fixed left-0 top-0 h-screen w-80 z-50 transition-transform duration-300 ease-in-out
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    lg:translate-x-0 lg:static lg:z-auto
  `;

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      <div className={sidebarClasses}>
        <div className="h-screen bg-black/95 backdrop-blur-xl text-white border-r border-white/10 relative overflow-y-auto">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary-500/10 via-secondary-500/5 to-black/10 pointer-events-none" />
          
          {/* Top header */}
          <div className="relative z-10 bg-black/80 p-4 border-b border-white/10 flex items-center justify-end">
            <button 
              onClick={onClose}
              className="lg:hidden text-white hover:bg-white/10 p-2 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Company header */}
          <div className="relative z-10 p-6 border-b border-white/10">
            {selectedCompany ? (
              <>
                <div className="w-15 h-15 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center font-bold text-xl mb-4 shadow-glow">
                  {selectedCompany.name.charAt(0).toUpperCase()}
                  {selectedCompany.name.split(' ')[1]?.charAt(0).toUpperCase() || ''}
                </div>
                <div className="company-info">
                  <h2 className="text-lg font-bold mb-1 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                    {selectedCompany.displayName || selectedCompany.name}
                  </h2>
                  <p className="text-xs text-gray-400 mb-2">
                    {selectedCompany.industry} • Rol: {currentRole}
                  </p>
                  <span className="inline-block text-xs text-primary-400 bg-primary-400/10 px-3 py-1 rounded-full border border-primary-400/20">
                    {selectedCompany.subscription?.plan || 'FREE'}
                  </span>
                </div>
                
                {/* Botón para cambiar empresa */}
                {user?.companies && user.companies.length > 1 && (
                  <button
                    onClick={() => navigate('/company-selector')}
                    className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 text-xs text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-200 border border-white/10 hover:border-white/20"
                  >
                    <Repeat className="w-3 h-3" />
                    Cambiar Empresa
                  </button>
                )}
              </>
            ) : (
              <>
                <div className="w-15 h-15 bg-gradient-to-br from-gray-500 to-gray-600 rounded-2xl flex items-center justify-center font-bold text-xl mb-4 shadow-glow">
                  <Building2 className="w-6 h-6" />
                </div>
                <div className="company-info">
                  <h2 className="text-lg font-bold mb-1 text-gray-400">
                    Selecciona una empresa
                  </h2>
                  <p className="text-xs text-gray-500 mb-2">Para acceder al dashboard</p>
                  <button
                    onClick={() => navigate('/company-selector')}
                    className="inline-block text-xs text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full border border-blue-400/20 hover:bg-blue-400/20 transition-colors"
                  >
                    SELECCIONAR EMPRESA
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Navigation */}
          <nav className="relative z-10 p-2">
            {/* Información del contexto actual */}
            {selectedCompany && currentRole && (
              <div className="nav-group mb-4">
                <div className="mx-2 p-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20">
                  <div className="text-xs text-gray-400 mb-1">Trabajando como:</div>
                  <div className="text-sm font-medium text-blue-300 capitalize">{currentRole}</div>
                  {selectedCompany.industry && (
                    <div className="text-xs text-gray-500 mt-1">{selectedCompany.industry}</div>
                  )}
                </div>
              </div>
            )}

            {/* Dashboard - Solo para usuarios con empresa seleccionada */}
            {selectedCompany && currentRole && (
              <div className="nav-group">
                <div 
                  onClick={() => navigate('/dashboard/financial-dashboard')}
                  className={`nav-item mx-2 my-1 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 ${
                    location.pathname === '/dashboard/financial-dashboard'
                      ? 'bg-gradient-to-r from-primary-500/20 to-secondary-500/20 text-primary-400 border border-primary-500/30 shadow-md' 
                      : 'hover:bg-primary-500/10 hover:translate-x-2'
                  }`}
                >
                  {location.pathname === '/dashboard/financial-dashboard' && (
                    <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-primary-500 to-secondary-500 rounded-r"></div>
                  )}
                  <LayoutDashboard className="w-5 h-5 mr-3 inline" />
                  Dashboard Financiero
                </div>
              </div>
            )}

            {/* Finanzas Corporativas - Solo para usuarios con empresa seleccionada */}
            {selectedCompany && currentRole && (
              <div className="nav-group">
                <div className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-white/5">
                  Finanzas Corporativas
                </div>
                
                <div 
                  className={`nav-item mx-2 my-1 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 relative overflow-hidden ${
                    expandedMenus.includes('finanzas-corporativas') 
                      ? 'bg-gradient-to-r from-primary-500/20 to-secondary-500/20 text-primary-400 border border-primary-500/30 shadow-md' 
                      : 'hover:bg-primary-500/10 hover:translate-x-2'
                  }`}
                  onClick={() => toggleMenu('finanzas-corporativas')}
                >
                  {expandedMenus.includes('finanzas-corporativas') && (
                    <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-primary-500 to-secondary-500 rounded-r"></div>
                  )}
                  <BarChart3 className="w-5 h-5 mr-3 inline" />
                  Finanzas Corporativas
                  <ChevronDown className={`ml-auto w-4 h-4 transition-transform duration-300 ${expandedMenus.includes('finanzas-corporativas') ? 'rotate-180' : ''}`} />
                </div>

                {/* Submenu */}
                <div className={`mx-2 rounded-lg overflow-hidden transition-all duration-300 bg-white/2 ${
                  expandedMenus.includes('finanzas-corporativas') 
                    ? 'max-h-[500px] opacity-100' 
                    : 'max-h-0 opacity-0'
                }`}>
                  {[
                    { name: 'Catálogo de Cuentas', path: '/dashboard/catalogo-cuentas' },
                    { name: 'Parametrización', path: '/dashboard/parametrizacion-catalogo' },
                    { name: 'Balance de Comprobación', path: '/dashboard/balance-comprobacion' },
                    { name: 'Indicadores Financieros', path: '/dashboard/indicadores-financieros' },
                    { name: 'Accionistas', path: '/dashboard/accionistas' },
                    { name: 'Balance General', path: '/dashboard/balance-general' },
                    { name: 'Estado de Resultados', path: '/dashboard/estado-resultados' },
                    { name: 'Índices Financieros', path: '/dashboard/indices-financieros' },
                    { name: 'Consolidado', path: '/dashboard/consolidado' },
                    { name: 'Reporte del mes (u)', path: '/dashboard/reporte-mes-u' },
                    { name: 'Reporte mensual (u)', path: '/dashboard/reporte-mensual-u' },
                    { name: 'Reporte de cierre (u)', path: '/dashboard/reporte-cierre-u' }
                  ].map((item, index) => (
                    <div 
                      key={index}
                      onClick={() => navigate(item.path)}
                      className={`px-12 py-2 text-sm cursor-pointer transition-all duration-300 rounded-md mx-1 my-1 ${
                        location.pathname === item.path
                          ? 'bg-gray-800/50 text-gray-200' 
                          : 'text-gray-300 hover:bg-gray-800/30 hover:text-gray-200 hover:translate-x-1'
                      }`}
                    >
                      {item.name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Operaciones - Solo para usuarios con empresa seleccionada */}
            {selectedCompany && currentRole && (
              <div className="nav-group">
                <div className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-white/5">
                  Operaciones
                </div>
                
                {[
                  { icon: <TrendingUp className="w-4 h-4" />, name: 'Ventas', id: 'ventas' },
                  { icon: <Package className="w-4 h-4" />, name: 'Compras', id: 'compras' },
                  { icon: <CreditCard className="w-4 h-4" />, name: 'Cuentas por Pagar', id: 'cuentas-pagar' },
                  { icon: <FileText className="w-4 h-4" />, name: 'Cuentas por Cobrar', id: 'cuentas-cobrar' },
                  { icon: <BarChart className="w-4 h-4" />, name: 'Kardex', id: 'kardex' }
                ].map((item) => (
                  <div 
                    key={item.id}
                    className="nav-item mx-2 my-1 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 hover:bg-primary-500/10 hover:translate-x-2"
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.name}
                    {item.id !== 'kardex' && <ChevronDown className="ml-auto w-4 h-4" />}
                  </div>
                ))}
              </div>
            )}

            {/* Tributación - Solo para usuarios con empresa seleccionada */}
            {selectedCompany && currentRole && (
              <div className="nav-group">
                <div className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-white/5">
                  Tributación
                </div>
                
                <div className="nav-item mx-2 my-1 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 hover:bg-primary-500/10 hover:translate-x-2">
                  <Target className="w-5 h-5 mr-3 inline" />
                  Impuestos
                  <ChevronDown className="ml-auto w-4 h-4" />
                </div>
              </div>
            )}

            {/* Finanzas - Solo para usuarios con empresa seleccionada */}
            {selectedCompany && currentRole && (
              <div className="nav-group">
                <div className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-white/5">
                  Finanzas
                </div>
                
                {[
                  { icon: <DollarSign className="w-4 h-4" />, name: 'Flujo de Efectivos', id: 'flujo-efectivo' },
                  { icon: <Users className="w-4 h-4" />, name: 'Leyes Laborales', id: 'leyes-laborales' },
                  { icon: <Banknote className="w-4 h-4" />, name: 'Préstamos Bancarios', id: 'prestamos' }
                ].map((item) => (
                  <div 
                    key={item.id}
                    className="nav-item mx-2 my-1 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 hover:bg-primary-500/10 hover:translate-x-2"
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.name}
                    <ChevronDown className="ml-auto w-4 h-4" />
                  </div>
                ))}
              </div>
            )}

            {/* Administración - Solo para Super Admin */}
            {user?.globalRole === 'super_admin' && (
              <div className="nav-group">
                <div className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-white/5">
                  Administración del Sistema
                </div>
                
                <div 
                  onClick={() => navigate('/admin/user-management')}
                  className={`nav-item mx-2 my-1 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 ${
                    location.pathname === '/admin/user-management'
                      ? 'bg-gradient-to-r from-primary-500/20 to-secondary-500/20 text-primary-400 border border-primary-500/30 shadow-md' 
                      : 'hover:bg-primary-500/10 hover:translate-x-2'
                  }`}
                >
                  {location.pathname === '/admin/user-management' && (
                    <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-primary-500 to-secondary-500 rounded-r"></div>
                  )}
                  <Shield className="w-5 h-5 mr-3 inline" />
                  Gestión de Usuarios
                </div>

                <div 
                  onClick={() => navigate('/admin/users')}
                  className={`nav-item mx-2 my-1 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 ${
                    location.pathname === '/admin/users'
                      ? 'bg-gradient-to-r from-primary-500/20 to-secondary-500/20 text-primary-400 border border-primary-500/30 shadow-md' 
                      : 'hover:bg-primary-500/10 hover:translate-x-2'
                  }`}
                >
                  {location.pathname === '/admin/users' && (
                    <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-primary-500 to-secondary-500 rounded-r"></div>
                  )}
                  <UserCheck className="w-5 h-5 mr-3 inline" />
                  Usuarios
                </div>
              </div>
            )}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
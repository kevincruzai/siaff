import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  Package
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['finanzas-corporativas']);

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
            <div className="w-15 h-15 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center font-bold text-xl mb-4 shadow-glow">
              TC
            </div>
            <div className="company-info">
              <h2 className="text-lg font-bold mb-1 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                TreeCloud Technologies
              </h2>
              <p className="text-xs text-gray-400 mb-2">Última Sesión 29 / 06 / 2019</p>
              <span className="inline-block text-xs text-primary-400 bg-primary-400/10 px-3 py-1 rounded-full border border-primary-400/20">
                CONTACTAR
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="relative z-10 p-2">
            {/* Dashboard */}
            <div className="nav-group">
              <div className="nav-item mx-2 my-1 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 hover:bg-primary-500/10 hover:translate-x-2">
                <LayoutDashboard className="w-5 h-5 mr-3 inline" />
                Dashboard
              </div>
            </div>

            {/* Finanzas Corporativas */}
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
                  ? 'max-h-96 opacity-100' 
                  : 'max-h-0 opacity-0'
              }`}>
                {[
                  { name: 'Catálogo de Cuentas', path: '/dashboard/catalogo-cuentas' },
                  { name: 'Parametrización', path: '/dashboard/parametrizacion-catalogo' },
                  { name: 'Balance de Comprobación', path: '/dashboard/balance-comprobacion' },
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

            {/* Operaciones */}
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

            {/* Tributación */}
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

            {/* Finanzas */}
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
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
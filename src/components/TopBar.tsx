import React from 'react';
import { Search, Mail, Bell, HelpCircle, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Logo from '@/components/Logo';

interface TopBarProps {
  onMenuToggle: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();

  const currentDate = new Date().toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short'
  });

  const currentTime = new Date().toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  return (
    <div className="bg-gray-50 shadow-sm border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      {/* Left section */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <span className="text-gray-600">☰</span>
        </button>
        
        {/* Logo visible on larger screens */}
        <div className="hidden lg:block">
          <Logo size="md" variant="dark" />
        </div>
        
        <div className="text-sm font-semibold text-gray-900">
          {currentDate} / {currentTime}
        </div>
      </div>

      {/* Center section - Stock indicators */}
      <div className="hidden md:flex items-center gap-6">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>$1.75</span>
          <span className="text-green-600">+0.10%</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm font-semibold">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>$350.00</span>
          <span className="text-green-600">+0.7%</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm font-semibold">
          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
          <span>1,121</span>
          <span className="text-yellow-600">0%</span>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        {/* Action buttons */}
        <div className="hidden sm:flex items-center gap-2">
          <button className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors">
            <Search className="w-5 h-5 text-gray-600" />
          </button>
          <button className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors">
            <Mail className="w-5 h-5 text-gray-600" />
          </button>
          <button className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
          </button>
          <button className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors">
            <HelpCircle className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Language selector */}
        <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-full cursor-pointer hover:bg-gray-200 transition-colors">
          <span className="text-sm font-medium">ESP</span>
          <ChevronDown className="w-3 h-3 text-gray-600" />
        </div>

        {/* User info */}
        <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-full cursor-pointer hover:bg-gray-200 transition-colors group relative">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
            {user?.name?.charAt(0) || 'S'}
          </div>
          <span className="text-sm font-medium">{user?.name || 'SIAFF'}</span>
          <ChevronDown className="w-3 h-3 text-gray-600" />
          
          {/* Dropdown menu */}
          <div className="absolute right-0 top-full mt-2 w-48 bg-gray-50 border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <div className="p-3 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <div className="py-1">
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                Perfil
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                Configuración
              </button>
              <hr className="my-1" />
              <button 
                onClick={logout}
                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
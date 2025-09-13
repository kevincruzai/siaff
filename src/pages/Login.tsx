import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { LoginCredentials } from '@/contexts/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import Logo from '@/components/Logo';

interface LoginProps {
  onSwitchToRegister?: () => void;
}

const Login: React.FC<LoginProps> = ({ onSwitchToRegister }) => {
  const { login, isLoading, error, clearError } = useAuth();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const layerBackRef = useRef<HTMLDivElement>(null);
  const layerFrontRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);

  const handleDemoLogin = async () => {
    const demoCredentials: LoginCredentials = {
      email: 'admin@siaff.net',
      password: 'admin123',
      rememberMe: true,
    };
    
    setCredentials(demoCredentials);
    clearError();
    
    try {
      await login(demoCredentials);
    } catch (error) {
      // Error is handled by the context
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    try {
      await login(credentials);
    } catch (error) {
      // Error is handled by the context
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Animation logic
  useEffect(() => {
    const CONCEPTS = [
      'Flujo de caja', 'EBITDA', 'Balance general', 'ROE', 'ROI', 'WACC', 
      'Unit Economics', 'Forecast', 'Tesorería', 'Liquidez', 'Cash Flow', 
      'Revenue', 'CAPEX', 'Margen Bruto', 'Burnrate', 'Valuación', 
      'KPIs', 'Métricas', 'Capital', 'Inversión', 'Presupuesto', 'Activos',
      'Pasivos', 'Patrimonio', 'Rentabilidad', 'Solvencia', 'Estado P&G'
    ];
    
    const CURRENCIES = ['$', '€', '£', '¥', '₿', '₡', '₱', '₺', '₹'];

    const rand = (min: number, max: number) => Math.random() * (max - min) + min;
    const choice = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

    const randomMoney = () => {
      const amount = (Math.random() * 10000).toFixed(2);
      const symbol = choice(CURRENCIES);
      return symbol + amount;
    };

    const setupAnimatedMoney = (el: HTMLElement) => {
      const symbol = choice(CURRENCIES);
      let baseAmount = Math.random() * 10000;
      let currentAmount = baseAmount;
      const volatility = rand(0.001, 0.01);
      
      const updateValue = () => {
        const change = (Math.random() - 0.5) * volatility * currentAmount;
        currentAmount = Math.max(0, currentAmount + change);
        
        el.textContent = symbol + currentAmount.toFixed(2);
        
        if (change > 0) {
          el.style.color = 'rgba(76, 175, 80, 0.8)';
        } else if (change < 0) {
          el.style.color = 'rgba(244, 67, 54, 0.8)';
        }
        
        setTimeout(() => {
          el.style.color = 'rgba(255, 255, 255, 0.8)';
        }, 1000);
      };
      
      const updateInterval = setInterval(updateValue, rand(2000, 4000));
      setTimeout(() => clearInterval(updateInterval), 60000);
      updateValue();
    };

    const makeGreet = (layer: HTMLElement, depth: number) => {
      const el = document.createElement('span');
      el.className = 'financial-greet';
      
      const isMoney = Math.random() > 0.5;
      const isAnimated = isMoney && Math.random() > 0.6;
      
      if (isMoney) {
        el.classList.add('money');
        if (isAnimated) {
          setupAnimatedMoney(el);
        } else {
          el.textContent = randomMoney();
        }
      } else {
        el.textContent = choice(CONCEPTS);
      }

      const size = Math.round(rand(depth < 0.5 ? 16 : 26, depth < 0.5 ? 42 : 64));
      el.style.fontSize = size + 'px';

      const direction = Math.random();
      let animationName, x0, y0, x1, y1;

      if (direction < 0.4) {
        animationName = 'driftFromLeft';
        x0 = rand(10, 40);
        y0 = rand(15, 85);
        x1 = rand(60, 90);
        y1 = y0 + rand(-15, 15);
      } else if (direction < 0.8) {
        animationName = 'driftFromRight';
        x0 = rand(60, 90);
        y0 = rand(15, 85);
        x1 = rand(10, 40);
        y1 = y0 + rand(-15, 15);
      } else {
        animationName = 'driftFromCenter';
        x0 = rand(30, 70);
        y0 = rand(20, 80);
        x1 = rand(25, 75);
        y1 = rand(20, 80);
      }

      el.style.setProperty('--animation-name', animationName);
      el.style.setProperty('--x0', x0 + 'vw');
      el.style.setProperty('--y0', y0 + 'vh');
      el.style.setProperty('--x1', x1 + 'vw');
      el.style.setProperty('--y1', y1 + 'vh');
      el.style.setProperty('--z', depth * -300 + 'px');
      el.style.setProperty('--dur', rand(35, 55) + 's');
      el.style.setProperty('--delay', rand(0, 15) + 's');
      el.style.setProperty('--sx', rand(0.85, 1.1).toFixed(2));

      layer.appendChild(el);
      return el;
    };

    const populate = () => {
      if (!layerBackRef.current || !layerFrontRef.current) return;
      
      const count = 24;
      layerBackRef.current.innerHTML = '';
      layerFrontRef.current.innerHTML = '';
      
      const backCount = Math.round(count * 0.4);
      const frontCount = count - backCount;
      
      for (let i = 0; i < backCount; i++) {
        makeGreet(layerBackRef.current, 0.3);
      }
      for (let i = 0; i < frontCount; i++) {
        makeGreet(layerFrontRef.current, 0.8);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!layerBackRef.current || !layerFrontRef.current) return;
      
      const rx = (e.clientX - window.innerWidth / 2) / window.innerWidth;
      const ry = (e.clientY - window.innerHeight / 2) / window.innerHeight;
      
      layerBackRef.current.style.transform = `translate3d(${rx * 6}px, ${ry * 6}px, 0)`;
      layerFrontRef.current.style.transform = `translate3d(${rx * 12}px, ${ry * 12}px, 0)`;
    };

    populate();
    window.addEventListener('pointermove', handleMouseMove);

    return () => {
      window.removeEventListener('pointermove', handleMouseMove);
    };
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, #1C1C1E, #2C2C2E 40%, #121212)',
      perspective: '1200px'
    }}>
      {/* Background image overlay */}
      <div 
        className="fixed inset-0 opacity-15 z-0"
        style={{
          backgroundImage: 'url(https://cdn.pixabay.com/photo/2023/03/21/20/42/umbrellas-7868179_1280.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />

      {/* Animated scene */}
      <div ref={sceneRef} className="fixed inset-0 overflow-hidden">
        <div 
          ref={layerBackRef} 
          className="absolute inset-0 -top-[10vh] -bottom-[10vh] -left-[10vw] -right-[10vw]"
          style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,.3))' }}
        />
        <div 
          ref={layerFrontRef} 
          className="absolute inset-0 -top-[10vh] -bottom-[10vh] -left-[10vw] -right-[10vw]"
          style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,.3))' }}
        />
      </div>

      {/* Login container */}
      <div className="fixed inset-0 flex items-center justify-center z-10 p-4">
        <div className="flex items-center animate-[cardAppear_0.8s_ease-out_forwards]">
          
          {/* Login card */}
          <div 
            className="border border-white/20 rounded-2xl p-6 backdrop-blur-xl text-white shadow-2xl"
            style={{ 
              width: '360px',
              boxShadow: '0 16px 40px rgba(0,0,0,.45)',
              background: 'rgba(15, 15, 15, 0.99)' // Fondo más sólido y oscuro
            }}
          >
            {/* Header */}
            <div className="mb-6 text-center">
              <Logo size="lg" variant="light" className="justify-center mb-4" />
              <p className="text-sm opacity-70">Inicia sesión en tu panel financiero</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <label className="block">
                <span className="block text-xs opacity-80 mb-1">Correo</span>
                <input
                  type="email"
                  name="email"
                  value={credentials.email}
                  onChange={handleChange}
                  className="w-full bg-white/10 border border-white/18 rounded-lg px-3 py-2.5 text-white text-sm outline-none transition-all duration-300 focus:border-purple-500/50 focus:shadow-[0_0_0_2px_rgba(124,77,255,0.2)] focus:bg-gray-800/60"
                  placeholder="admin@siaff.net"
                  required
                />
              </label>

              {/* Password Field */}
              <label className="block">
                <span className="block text-xs opacity-80 mb-1">Contraseña</span>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    className="w-full bg-white/10 border border-white/18 rounded-lg px-3 py-2.5 text-white text-sm outline-none transition-all duration-300 focus:border-purple-500/50 focus:shadow-[0_0_0_2px_rgba(124,77,255,0.2)] focus:bg-gray-800/60 pr-10"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </label>

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={credentials.rememberMe}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-white/20 bg-white/10 text-purple-600 focus:ring-purple-500 focus:ring-2"
                  />
                  <span className="text-sm opacity-75">Recordarme</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gray-900 text-white py-2.5 px-4 rounded-lg font-bold text-sm transition-all duration-300 hover:bg-black hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(0,0,0,0.3)] disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Iniciando sesión...
                  </div>
                ) : (
                  'Entrar'
                )}
              </button>

              {/* Forgot password and Register */}
              <div className="flex justify-between items-center">
                <a 
                  href="#" 
                  className="text-xs text-white/75 hover:text-white transition-opacity duration-200 no-underline"
                >
                  ¿Olvidaste tu contraseña?
                </a>
                {onSwitchToRegister && (
                  <button
                    type="button"
                    onClick={onSwitchToRegister}
                    className="text-white hover:text-gray-300 text-xs font-medium transition-colors duration-200 underline underline-offset-2 hover:underline-offset-4"
                  >
                    Registrarse
                  </button>
                )}
              </div>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={isLoading}
                className="w-full text-blue-300 hover:text-blue-200 hover:bg-blue-500/10 p-2 rounded transition-all duration-200 text-xs font-mono disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-3 w-3 border-b border-blue-300"></div>
                    Iniciando...
                  </div>
                ) : (
                  <span className="group-hover:scale-105 inline-block transition-transform">
                    admin@siaff.net / admin123
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Ad card */}
          <div className="hidden lg:block w-80 h-96 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl flex-shrink-0 border border-white/20"
               style={{ 
                 boxShadow: '0 16px 40px rgba(0,0,0,.45)',
                 background: 'rgba(15, 15, 15, 0.85)'
               }}>
            <img 
              src="https://cdn.pixabay.com/photo/2025/09/10/10/42/maintenance-9826086_1280.jpg" 
              alt="Financial Dashboard" 
              className="w-full h-full object-cover opacity-85 transition-all duration-300 hover:opacity-100 hover:scale-105"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-black text-white py-7 px-4 z-20">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          {/* Logo y copyright */}
          <div className="flex items-center gap-3">
            <Logo size="md" variant="light" showIcon={true} />
            <span className="text-sm text-gray-400">© 2025-2026</span>
          </div>
          
          {/* Links */}
          <div className="flex items-center gap-6 text-sm">
            <a href="#" className="text-gray-300 hover:text-white transition-colors">
              INFORMACIÓN
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">
              AYUDA
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">
              PRIVACIDAD
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">
              CONDICIONES
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
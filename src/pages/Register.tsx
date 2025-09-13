import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Logo from '@/components/Logo';

interface RegisterData {
  fullName: string;
  country: string;
  countryCode: string;
  phone: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  isNotRobot: boolean;
}

interface RegisterProps {
  onSwitchToLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ onSwitchToLogin }) => {
  const { isLoading, error, clearError } = useAuth();
  const [formData, setFormData] = useState<RegisterData>({
    fullName: '',
    country: '',
    countryCode: '+503',
    phone: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    isNotRobot: false,
  });

  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const layerBackRef = useRef<HTMLDivElement>(null);
  const layerFrontRef = useRef<HTMLDivElement>(null);

  const countries = [
    { code: 'SV', name: 'El Salvador', phone: '+503' },
    { code: 'GT', name: 'Guatemala', phone: '+502' },
    { code: 'HN', name: 'Honduras', phone: '+504' },
    { code: 'CR', name: 'Costa Rica', phone: '+506' },
    { code: 'PA', name: 'Panamá', phone: '+507' },
    { code: 'NI', name: 'Nicaragua', phone: '+505' },
    { code: 'MX', name: 'México', phone: '+52' },
    { code: 'DO', name: 'República Dominicana', phone: '+1' },
  ];

  // Animation setup (reusing from Login)
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
      
      const count = 20;
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));

      // Update country code when country changes
      if (name === 'country') {
        const selectedCountry = countries.find(c => c.code === value);
        if (selectedCountry) {
          setFormData(prev => ({
            ...prev,
            countryCode: selectedCountry.phone,
          }));
        }
      }
    }
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (!formData.fullName.trim()) errors.push('El nombre completo es requerido');
    if (!formData.country) errors.push('Debe seleccionar un país');
    if (!formData.phone.trim()) errors.push('El teléfono es requerido');
    if (!formData.email.trim()) errors.push('El correo electrónico es requerido');
    if (!formData.username.trim()) errors.push('El usuario es requerido');
    if (!formData.password) errors.push('La contraseña es requerida');
    if (!formData.confirmPassword) errors.push('Debe confirmar la contraseña');
    if (formData.password !== formData.confirmPassword) errors.push('Las contraseñas no coinciden');
    if (!formData.acceptTerms) errors.push('Debe aceptar los términos y condiciones');
    if (!formData.isNotRobot) errors.push('Debe confirmar que no es un robot');

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.push('El formato del correo electrónico no es válido');
    }

    // Password validation
    if (formData.password && formData.password.length < 6) {
      errors.push('La contraseña debe tener al menos 6 caracteres');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setValidationErrors([]);

    if (!validateForm()) return;

    try {
      // Simular registro (aquí iría la llamada real al API)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Por ahora solo mostramos un alert
      alert('¡Registro exitoso! Por favor verifica tu correo electrónico.');
      onSwitchToLogin();
    } catch (error) {
      setValidationErrors(['Error en el registro. Por favor intenta nuevamente.']);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, #1C1C1E, #2C2C2E 40%, #121212)',
      perspective: '1200px'
    }}>
      {/* Background image overlay */}
      <div 
        className="fixed inset-0 opacity-15 z-0"
        style={{
          backgroundImage: 'url(https://cdn.pixabay.com/photo/2020/03/31/11/33/sunset-4987300_960_720.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />

      {/* Animated scene */}
      <div className="fixed inset-0 overflow-hidden">
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

      {/* Auth Container */}
      <div className="fixed inset-0 flex items-center justify-center z-10 p-4">
        <div className="flex max-w-5xl w-full bg-white/95 rounded-2xl overflow-hidden shadow-2xl animate-[containerAppear_0.8s_ease-out_forwards]" style={{ height: 'auto', maxHeight: '90vh' }}>
          
          {/* Register Panel */}
          <div className="flex-1 p-6 lg:p-8 bg-gray-50 text-gray-700 overflow-y-auto">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 tracking-tight">
                REGISTRARSE
              </h2>

              {/* Error Messages */}
              {(error || validationErrors.length > 0) && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  {error && <p className="text-red-600 text-sm mb-1">{error}</p>}
                  {validationErrors.map((err, index) => (
                    <p key={index} className="text-red-600 text-sm">{err}</p>
                  ))}
                </div>
              )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div className="form-group">
                <label className="block text-sm font-semibold mb-2 text-gray-600">
                  Nombre Completo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg text-sm bg-white text-gray-600 outline-none transition-all duration-200 focus:border-gray-800 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.1)]"
                  required
                />
              </div>

              {/* Country */}
              <div className="form-group">
                <label className="block text-sm font-semibold mb-2 text-gray-600">
                  País <span className="text-red-500">*</span>
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg text-sm bg-white text-gray-600 outline-none transition-all duration-200 focus:border-gray-800 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.1)]"
                  required
                >
                  <option value="">Seleccionar país</option>
                  {countries.map(country => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Phone */}
              <div className="form-group">
                <label className="block text-sm font-semibold mb-2 text-gray-600">
                  Contacto <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.countryCode}
                    className="w-20 p-3 border-2 border-gray-200 rounded-lg text-sm bg-gray-100 text-gray-600 outline-none"
                    readOnly
                  />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="7000-0000"
                    className="flex-1 p-3 border-2 border-gray-200 rounded-lg text-sm bg-white text-gray-600 outline-none transition-all duration-200 focus:border-gray-800 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.1)]"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="form-group">
                <label className="block text-sm font-semibold mb-2 text-gray-600">
                  Correo Electrónico <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg text-sm bg-white text-gray-600 outline-none transition-all duration-200 focus:border-gray-800 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.1)]"
                  required
                />
              </div>

              {/* Username */}
              <div className="form-group">
                <label className="block text-sm font-semibold mb-2 text-gray-600">
                  Usuario <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg text-sm bg-white text-gray-600 outline-none transition-all duration-200 focus:border-gray-800 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.1)]"
                  required
                />
              </div>

              {/* Password */}
              <div className="form-group">
                <label className="block text-sm font-semibold mb-2 text-gray-600">
                  Contraseña <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg text-sm bg-white text-gray-600 outline-none transition-all duration-200 focus:border-gray-800 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.1)]"
                  required
                />
              </div>

              {/* Confirm Password */}
              <div className="form-group">
                <label className="block text-sm font-semibold mb-2 text-gray-600">
                  Verificación de Contraseña <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg text-sm bg-white text-gray-600 outline-none transition-all duration-200 focus:border-gray-800 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.1)]"
                  required
                />
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2 mt-4">
                <input
                  type="checkbox"
                  id="terms"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  className="mt-1"
                  required
                />
                <label htmlFor="terms" className="text-sm leading-5">
                  Acepto los <a href="#" className="text-gray-800 hover:underline">Términos y Condiciones</a>
                </label>
              </div>

              {/* Robot Check */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="recaptcha"
                  name="isNotRobot"
                  checked={formData.isNotRobot}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="recaptcha" className="text-sm">
                  No soy un robot
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full p-4 bg-gray-900 text-white border-none rounded-lg font-bold text-sm cursor-pointer transition-all duration-200 hover:bg-black hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.4)] disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none uppercase"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Registrando...
                  </div>
                ) : (
                  'Listo'
                )}
              </button>
            </form>
            </div>
          </div>

          {/* Welcome Panel */}
          <div className="flex-1 bg-gradient-to-br from-gray-900 to-black text-white flex flex-col justify-center items-center text-center p-8 relative overflow-hidden">
            {/* Grain pattern overlay */}
            <div className="absolute inset-0 opacity-30" style={{
              backgroundImage: `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><pattern id='grain' width='100' height='100' patternUnits='userSpaceOnUse'><circle cx='25' cy='25' r='1' fill='white' opacity='0.1'/><circle cx='75' cy='75' r='1' fill='white' opacity='0.1'/><circle cx='50' cy='10' r='0.5' fill='white' opacity='0.15'/></pattern></defs><rect width='100' height='100' fill='url(%23grain)'/></svg>")`
            }}></div>

            <div className="relative z-10">
              <div className="text-sm font-medium opacity-90 mb-4 uppercase tracking-wide">
                Bienvenido a
              </div>

              <Logo size="lg" variant="light" className="justify-center mb-8" />

              <p className="text-lg leading-relaxed mb-12 opacity-95 max-w-xs">
                Crea una cuenta y empieza a disfrutar de los servicios que <strong>SIAFF</strong> ofrece.
              </p>

              <div className="text-sm mb-4 opacity-90">¿Ya tienes cuenta?</div>
              <button
                onClick={onSwitchToLogin}
                className="px-10 py-3 bg-transparent text-white border-2 border-white/30 rounded-lg font-semibold cursor-pointer transition-all duration-300 hover:bg-white/10 hover:border-white/50 hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(0,0,0,0.2)] backdrop-blur-sm"
              >
                Inicia Sesión
              </button>
            </div>

            <div className="absolute bottom-4 text-xs opacity-70">
              SIAFF ©2025
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
  showText?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  variant = 'light',
  showText = true,
  className = ''
}) => {
  const sizeClasses = {
    sm: { img: 'h-6', text: 'text-lg' },
    md: { img: 'h-8', text: 'text-xl' },
    lg: { img: 'h-10', text: 'text-2xl' }
  };

  const colorClasses = {
    light: 'text-white',
    dark: 'text-gray-900'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img 
        src="/logo.png" 
        alt="SIAFF Logo" 
        className={`${sizeClasses[size].img} w-auto object-contain`}
      />
      {showText && (
        <span className={`font-bold tracking-tight ${sizeClasses[size].text} ${colorClasses[variant]}`}>
          SIAFF
        </span>
      )}
    </div>
  );
};

export default Logo;
import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = 'h-12' }) => {
  return (
    <img 
      src="/src/assets/incom-logo.png" 
      alt="Incom - Ortopedia e Medicina da Dor" 
      className={className}
    />
  );
};

export default Logo;
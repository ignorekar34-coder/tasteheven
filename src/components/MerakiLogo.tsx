import React from 'react';

interface MerakiLogoProps {
  className?: string;
  theme?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
}

export const MerakiLogo: React.FC<MerakiLogoProps> = ({
  className = '',
  theme = 'light',
  size = 'md',
}) => {
  const isDark = theme === 'dark';
  const textColor = isDark ? 'text-[#F5F1EB]' : 'text-[#4A2C1A]';
  const subColor = isDark ? 'text-[#F5F1EB]/70' : 'text-[#4A2C1A]/70';
  const sealBg = isDark ? 'bg-[#F5F1EB]/10 border-[#F5F1EB]/30 text-[#F5F1EB]' : 'bg-[#4A2C1A]/5 border-[#4A2C1A]/20 text-[#4A2C1A]';

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Minimalist Monogram Seal */}
      <div
        className={`w-10 h-10 rounded-full border flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 ${sealBg}`}
      >
        <span className="font-serif italic text-lg leading-none tracking-tighter font-normal">
          M
        </span>
      </div>

      {/* Brand Wordmark */}
      <div className="flex flex-col text-left">
        <span
          className={`font-serif tracking-[0.18em] uppercase font-normal leading-tight ${textColor} ${
            size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl sm:text-3xl' : 'text-xl'
          }`}
        >
          MERAKI PANTRY
        </span>
        <span
          className={`text-[9px] sm:text-[10px] tracking-[0.28em] uppercase font-medium mt-0.5 ${subColor}`}
        >
          Artisanal Preserves · Pune
        </span>
      </div>
    </div>
  );
};

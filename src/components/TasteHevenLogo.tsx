import React from 'react';
import officialLogoImg from '../assets/images/taste_heven_official_hd_logo_1791888814616.jpg';

interface TasteHevenLogoProps {
  /**
   * 'badge': Circular HD badge emblem only (like the picture)
   * 'lockup': Circular HD badge emblem + typographic luxury wordmark
   * 'compact': Scaled circular badge for small icons / buttons
   */
  variant?: 'badge' | 'lockup' | 'compact';
  size?: number; // pixel diameter of badge, defaults: sm=44, md=54, lg=76, xl=110
  className?: string;
  theme?: 'dark' | 'light'; // context where logo is placed
  showTagline?: boolean;
}

/**
 * Taste Heven Official Brand Logo (Exact HD Quality):
 * - Circular black medallion badge (#0A0A0A) with ornate metallic gold filigree rim
 * - Exact luxury Roman serif typography "TASTE HEVEN" in gleaming gold (#D4AF37)
 * - Letter "H" is the iconic bright red chili pepper (#B91C1C) with gold stem
 * - Letter "E" has the glowing amber honey droplet
 * - Tagline "FINE FOOD EXPERIENCE" with gold star accents
 * - Exact font matching the official picture
 */
export const TasteHevenLogo: React.FC<TasteHevenLogoProps> = ({
  variant = 'lockup',
  size,
  className = '',
  theme = 'light',
  showTagline = true,
}) => {
  // Determine diameter
  const badgeSize = size || (variant === 'compact' ? 40 : variant === 'badge' ? 68 : 52);

  // The HD Circular Emblem Badge Image
  const BadgeImage = (
    <div
      style={{ width: badgeSize, height: badgeSize }}
      className="relative shrink-0 rounded-full overflow-hidden bg-[#0A0A0A] p-[1.5px] border border-[#D4AF37]/80 shadow-md group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(212,175,55,0.35)] transition-all duration-300 select-none"
    >
      <img
        src={officialLogoImg}
        alt="Taste Heven Official Logo Badge"
        width={badgeSize}
        height={badgeSize}
        loading="eager"
        decoding="sync"
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover rounded-full block"
      />
    </div>
  );

  if (variant === 'badge' || variant === 'compact') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`} title="Taste Heven - Fine Food Experience">
        {BadgeImage}
      </div>
    );
  }

  // Full Lockup: HD Circular Badge + Exact Matching Luxury Typography
  return (
    <div className={`group flex items-center gap-3.5 whitespace-nowrap text-left ${className}`}>
      {BadgeImage}

      <div className="flex flex-col justify-center">
        {/* Main Logo Text with Exact Cinzel Roman Luxury Serif Font matching picture */}
        <div className="flex items-center gap-1.5 leading-none">
          <span
            style={{ fontFamily: 'var(--font-cinzel), serif' }}
            className={`text-xl sm:text-2xl font-bold tracking-[0.06em] uppercase ${
              theme === 'dark' ? 'text-white' : 'text-[#0A0A0A]'
            }`}
          >
            TASTE
          </span>
          <span
            style={{ fontFamily: 'var(--font-cinzel), serif' }}
            className="text-xl sm:text-2xl font-bold tracking-[0.06em] uppercase text-[#D4AF37] flex items-center"
          >
            {/* Styled H with Red Chili accent */}
            <span className="text-[#B91C1C] drop-shadow-[0_1px_2px_rgba(185,28,28,0.3)]">H</span>
            {/* Styled E with Honey drop accent */}
            <span className="relative inline-block text-[#D4AF37]">
              E
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#D4AF37] shadow-xs" />
            </span>
            <span>VEN</span>
          </span>
        </div>

        {/* Tagline matching the picture font & spacing */}
        {showTagline && (
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className="w-2.5 h-[1px] bg-[#D4AF37]/70" />
            <span
              style={{ fontFamily: 'var(--font-cinzel), var(--font-sans), sans-serif' }}
              className="text-[9px] sm:text-[10px] tracking-[0.22em] uppercase font-semibold text-[#D4AF37]"
            >
              ★ FINE FOOD EXPERIENCE ★
            </span>
            <span className="w-2.5 h-[1px] bg-[#D4AF37]/70" />
          </div>
        )}
      </div>
    </div>
  );
};

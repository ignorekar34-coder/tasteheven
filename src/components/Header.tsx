import React from 'react';
import { ShoppingBag, Search, MessageCircle, Sparkles, X, Shield, RefreshCw } from 'lucide-react';
import { ProductCategory } from '../types';
import { generateGeneralInquiryWhatsAppUrl } from '../utils/whatsapp';
import { TasteHevenLogo } from './TasteHevenLogo';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenAdmin: () => void;
  activeCategory: ProductCategory;
  onSelectCategory: (category: ProductCategory) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSync?: () => void;
  isSyncing?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  onOpenAdmin,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onSync,
  isSyncing,
}) => {
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-[#0A0A0A]/10 transition-all duration-300">
      {/* Top Announcement Bar - Luxury Black & Gold Ribbon */}
      <div className="bg-[#0A0A0A] text-white text-xs py-2 px-4 border-b border-[#D4AF37]/30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="inline-flex items-center text-[#D4AF37] font-semibold">
              <Sparkles className="w-3.5 h-3.5 mr-1 inline shrink-0 text-[#D4AF37]" />
              100% Khalis & Raw Guarantee
            </span>
            <span className="hidden sm:inline text-white/30">·</span>
            <span className="hidden sm:inline text-white/90">
              FREE Delivery Nationwide Above ₨ 3,500
            </span>
            <span className="hidden md:inline text-white/30">·</span>
            <span className="hidden md:inline text-white font-medium">
              Cash on Delivery & EasyPaisa (0324-8314001)
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {onSync && (
              <button
                onClick={onSync}
                disabled={isSyncing}
                className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 hover:bg-[#D4AF37]/35 text-[#D4AF37] hover:text-white text-[11px] font-semibold transition-colors cursor-pointer border border-[#D4AF37]/50 disabled:opacity-50"
                title="Sync products and images with Cloud Firestore (phone & laptop)"
              >
                <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Syncing...' : 'Sync Devices'}</span>
              </button>
            )}

            <a
              href={generateGeneralInquiryWhatsAppUrl('Customer Support & Order Assistance')}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-xs text-[#D4AF37] hover:text-[#F9E498] transition-colors whitespace-nowrap shrink-0 font-medium"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>WhatsApp: 0324-8314001</span>
            </a>

            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-[#D4AF37] hover:text-white text-[11px] font-semibold transition-colors cursor-pointer border border-[#D4AF37]/40"
              title="Owners & Admin Portal (Ahmad Waseem & Farman Ali)"
            >
              <Shield className="w-3 h-3 text-[#D4AF37]" />
              <span>Owners Portal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Top Bar: Minimal Luxury Layout with Official Circular Logo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-20">
          {/* Left: Brand Identity with New Taste Heven Circular Badge Logo */}
          <a
            href="#hero"
            className="group flex items-center shrink-0"
            title="Taste Heven - Fine Food Experience"
          >
            <TasteHevenLogo variant="lockup" size={50} theme="light" />
          </a>

          {/* Center: Clean Navigation Menu */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold tracking-wide text-[#0A0A0A]">
            <a
              href="#products"
              onClick={() => onSelectCategory('honey')}
              className="hover:text-[#D4AF37] transition-colors whitespace-nowrap shrink-0 hover:underline decoration-[#D4AF37] decoration-2 underline-offset-8"
            >
              Pure Honey
            </a>
            <a
              href="#products"
              onClick={() => onSelectCategory('achar')}
              className="hover:text-[#D4AF37] transition-colors whitespace-nowrap shrink-0 hover:underline decoration-[#D4AF37] decoration-2 underline-offset-8"
            >
              Chatpata Achar
            </a>
            <a
              href="#products"
              onClick={() => onSelectCategory('murabba')}
              className="hover:text-[#D4AF37] transition-colors whitespace-nowrap shrink-0 hover:underline decoration-[#D4AF37] decoration-2 underline-offset-8"
            >
              Lazeez Murabbay
            </a>
            <a
              href="#why-choose-us"
              className="hover:text-[#D4AF37] transition-colors whitespace-nowrap shrink-0 hover:underline decoration-[#D4AF37] decoration-2 underline-offset-8"
            >
              Our Guarantee
            </a>
            <a
              href="#reviews"
              className="hover:text-[#D4AF37] transition-colors whitespace-nowrap shrink-0 hover:underline decoration-[#D4AF37] decoration-2 underline-offset-8"
            >
              Reviews (1,840+)
            </a>
          </nav>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Search Input */}
            <div className="hidden sm:flex relative items-center">
              <Search className="w-4 h-4 absolute left-3.5 text-[#0A0A0A]/40 pointer-events-none" />
              <input
                type="text"
                placeholder="Search pantry..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-44 lg:w-56 pl-9 pr-8 py-2 text-xs bg-[#FAFAFA] border border-[#0A0A0A]/15 rounded-full focus:outline-none focus:border-[#D4AF37] focus:bg-white text-[#0A0A0A] placeholder-[#0A0A0A]/50 transition-all shadow-2xs font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 text-[#0A0A0A]/40 hover:text-black"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Mobile Search Toggle */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="sm:hidden p-2 text-[#0A0A0A] hover:text-[#D4AF37] rounded-full hover:bg-stone-100"
              aria-label="Toggle search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Direct WhatsApp Order CTA Button (Black & Gold luxury) */}
            <a
              href={generateGeneralInquiryWhatsAppUrl('Ordering Assistance')}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-[#0A0A0A] bg-stone-50 hover:bg-[#0A0A0A] hover:text-[#D4AF37] border border-[#D4AF37]/50 rounded-full transition-all whitespace-nowrap shadow-2xs"
            >
              <MessageCircle className="w-4 h-4 text-[#B91C1C]" />
              <span>Order WhatsApp</span>
            </a>

            {/* Rounded Cart Button (Primary Black #0A0A0A + Gold badge #D4AF37) */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2.5 px-5 py-2.5 bg-[#0A0A0A] hover:bg-[#1A1A1A] text-white rounded-full transition-all shadow-sm hover:shadow border border-[#D4AF37]/50 cursor-pointer font-bold"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-xs font-semibold hidden md:inline">Cart</span>
              <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-[#0A0A0A] text-xs font-bold flex items-center justify-center tabular-nums">
                {cartCount}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        {isSearchOpen && (
          <div className="sm:hidden py-3 border-t border-[#0A0A0A]/10">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 absolute left-3 text-[#0A0A0A]/40" />
              <input
                type="text"
                placeholder="Search honey, achar, murabba..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                autoFocus
                className="w-full pl-9 pr-8 py-2 text-sm bg-[#FAFAFA] border border-[#0A0A0A]/15 rounded-full focus:outline-none focus:border-[#D4AF37] text-[#0A0A0A]"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 text-[#0A0A0A]/40"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

import React from 'react';
import { ShoppingBag, Search, MessageCircle, Sparkles, X, Shield } from 'lucide-react';
import { ProductCategory } from '../types';
import { generateGeneralInquiryWhatsAppUrl } from '../utils/whatsapp';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenAdmin: () => void;
  activeCategory: ProductCategory;
  onSelectCategory: (category: ProductCategory) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  onOpenAdmin,
  onSelectCategory,
  searchQuery,
  onSearchChange,
}) => {
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs transition-all">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-amber-950 text-amber-100 text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="inline-flex items-center text-amber-300 font-medium">
              <Sparkles className="w-3.5 h-3.5 mr-1 inline shrink-0" />
              100% Khalis & Natural
            </span>
            <span className="hidden sm:inline text-amber-200/50">·</span>
            <span className="hidden sm:inline text-stone-200">
              FREE Delivery Nationwide on Orders Above ₨ 3,500
            </span>
            <span className="hidden md:inline text-amber-200/50">·</span>
            <span className="hidden md:inline text-amber-200 font-medium">
              Cash on Delivery (COD) Available
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <a
              href={generateGeneralInquiryWhatsAppUrl('Customer Support & Order Assistance')}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-xs text-amber-300 hover:text-white transition-colors whitespace-nowrap shrink-0 font-medium"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp: 0324-8314001</span>
            </a>

            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-900/80 hover:bg-emerald-800 text-amber-200 hover:text-amber-100 text-[11px] font-semibold transition-colors cursor-pointer border border-emerald-700/60"
              title="Admin Portal for 4 Users"
            >
              <Shield className="w-3 h-3 text-amber-400" />
              <span>Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 md:gap-8 h-20">
          {/* Zone 1: Brand Wordmark & Insignia */}
          <a
            href="#hero"
            className="group flex items-center gap-3 whitespace-nowrap shrink-0 text-left"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 via-amber-600 to-emerald-800 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <span className="font-serif font-bold text-lg tracking-wider text-amber-50">TH</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-emerald-950 group-hover:text-amber-700 transition-colors">
                TASTE HEVEN
              </span>
              <span className="text-[10px] tracking-widest uppercase font-medium text-amber-700 -mt-1">
                KHALIS & LAZEEZ PANTRY
              </span>
            </div>
          </a>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-stone-700">
            <a
              href="#products"
              onClick={() => onSelectCategory('honey')}
              className="hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0"
            >
              Pure Honey
            </a>
            <a
              href="#products"
              onClick={() => onSelectCategory('achar')}
              className="hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0"
            >
              Chatpata Achar
            </a>
            <a
              href="#products"
              onClick={() => onSelectCategory('murabba')}
              className="hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0"
            >
              Lazeez Murabbay
            </a>
            <a
              href="#why-choose-us"
              className="hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0"
            >
              Why Taste Heven
            </a>
            <a
              href="#reviews"
              className="hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0"
            >
              Reviews
            </a>
          </nav>

          {/* Zone 3: Search, WhatsApp Direct Order & Cart Button */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Search Input on Desktop */}
            <div className="hidden sm:flex relative items-center">
              <Search className="w-4 h-4 absolute left-3 text-stone-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search honey, achar..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-44 lg:w-56 pl-9 pr-7 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-600 focus:bg-white text-stone-800 placeholder-stone-400 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2 text-stone-400 hover:text-stone-700"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Mobile Search Toggle */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="sm:hidden p-2 text-stone-600 hover:text-emerald-800 rounded-lg hover:bg-stone-100"
              aria-label="Toggle search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Direct WhatsApp Order CTA Button */}
            <a
              href={generateGeneralInquiryWhatsAppUrl('Ordering Assistance')}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-950 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4 text-emerald-700 fill-emerald-600/20" />
              <span>Order on WhatsApp</span>
            </a>

            {/* Cart Trigger Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-3 sm:px-4 py-2 bg-emerald-900 hover:bg-emerald-800 text-amber-50 rounded-lg transition-colors shadow-xs"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 text-amber-300" />
              <span className="text-xs font-semibold hidden md:inline">Cart</span>
              <span className="w-5 h-5 rounded-full bg-amber-500 text-emerald-950 text-xs font-bold flex items-center justify-center tabular-nums">
                {cartCount}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Dropdown */}
        {isSearchOpen && (
          <div className="sm:hidden py-3 border-t border-stone-200">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 absolute left-3 text-stone-400" />
              <input
                type="text"
                placeholder="Search honey, achar, murabba..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                autoFocus
                className="w-full pl-9 pr-8 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-600"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 text-stone-400"
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

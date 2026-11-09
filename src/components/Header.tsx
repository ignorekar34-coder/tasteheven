import React, { useState } from 'react';
import { ShoppingBag, Search, Sparkles, X, Shield, Menu, ArrowRight } from 'lucide-react';
import { ProductCategory } from '../types';
import { MerakiLogo } from './MerakiLogo';

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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F5F1EB]/95 backdrop-blur-md border-b border-[#4A2C1A]/10 transition-all duration-300">
      {/* Top Announcement Bar - Dark Brown #4A2C1A Ribbon */}
      <div className="bg-[#4A2C1A] text-[#F5F1EB] text-[11px] sm:text-xs py-2 px-4 select-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="inline-flex items-center text-[#F5F1EB] font-medium tracking-wide">
              <Sparkles className="w-3.5 h-3.5 mr-1.5 inline shrink-0 text-[#E8DFC8]" />
              Handcrafted in Small Batches · Pune, Maharashtra
            </span>
            <span className="hidden sm:inline text-[#F5F1EB]/40">·</span>
            <span className="hidden sm:inline text-[#F5F1EB]/90">
              Complimentary Shipping Across Pune on Orders Above Rs 999
            </span>
            <span className="hidden md:inline text-[#F5F1EB]/40">·</span>
            <span className="hidden md:inline text-[#F5F1EB]/90 font-light">
              Sun-Cured in Traditional Ceramic Bharanis
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1 px-2.5 py-0.5 rounded-none bg-[#F5F1EB]/10 hover:bg-[#F5F1EB]/20 text-[#F5F1EB] text-[11px] tracking-wider uppercase font-medium transition-colors cursor-pointer border border-[#F5F1EB]/20"
              title="Atelier Admin Portal"
            >
              <Shield className="w-3 h-3 text-[#E8DFC8]" />
              <span>Atelier Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-20">
          
          {/* Left: Brand Wordmark */}
          <a
            href="#hero"
            className="group flex items-center shrink-0 cursor-pointer"
            title="MERAKI PANTRY — Artisanal Preserves"
          >
            <MerakiLogo theme="light" size="md" />
          </a>

          {/* Center: Editorial Navigation */}
          <nav className="hidden lg:flex items-center gap-8 text-xs uppercase tracking-[0.22em] text-[#4A2C1A]/80 font-medium">
            <button
              onClick={() => scrollToSection('products')}
              className="hover:text-[#4A2C1A] hover:underline underline-offset-8 transition-colors cursor-pointer"
            >
              Our Pantry
            </button>
            <button
              onClick={() => scrollToSection('our-process')}
              className="hover:text-[#4A2C1A] hover:underline underline-offset-8 transition-colors cursor-pointer"
            >
              The Process
            </button>
            <button
              onClick={() => scrollToSection('philosophy')}
              className="hover:text-[#4A2C1A] hover:underline underline-offset-8 transition-colors cursor-pointer"
            >
              Heritage & Craft
            </button>
            <button
              onClick={() => scrollToSection('reviews')}
              className="hover:text-[#4A2C1A] hover:underline underline-offset-8 transition-colors cursor-pointer"
            >
              Notes & Reviews
            </button>
          </nav>

          {/* Right: Search, Cart & Mobile Trigger */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Inline Search Bar (Expandable) */}
            <div className="relative">
              {isSearchOpen ? (
                <div className="flex items-center bg-[#EDE7DD] border border-[#4A2C1A]/20 px-3 py-1.5 rounded-none text-xs w-48 sm:w-64 transition-all">
                  <Search className="w-3.5 h-3.5 text-[#4A2C1A]/70 mr-2 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search pickle or murabba..."
                    autoFocus
                    className="bg-transparent border-none outline-none text-[#4A2C1A] placeholder-[#4A2C1A]/50 w-full text-xs"
                  />
                  <button
                    onClick={() => {
                      setIsSearchOpen(false);
                      onSearchChange('');
                    }}
                    className="text-[#4A2C1A]/60 hover:text-[#4A2C1A] ml-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 text-[#4A2C1A]/80 hover:text-[#4A2C1A] hover:bg-[#EDE7DD]/60 rounded-full transition-colors cursor-pointer"
                  title="Search products"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative inline-flex items-center gap-2 px-3.5 py-2 bg-[#4A2C1A] hover:bg-[#341d10] text-[#F5F1EB] text-xs font-medium tracking-wider uppercase transition-all duration-300 cursor-pointer shadow-xs"
              title="View Cart"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Pantry Bag</span>
              <span className="inline-flex items-center justify-center bg-[#F5F1EB] text-[#4A2C1A] font-bold text-[10px] w-4 h-4 rounded-full ml-0.5">
                {cartCount}
              </span>
            </button>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-[#4A2C1A] hover:bg-[#EDE7DD] rounded-md cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#F5F1EB] border-t border-[#4A2C1A]/10 px-6 py-6 space-y-4 shadow-lg animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-3 text-sm uppercase tracking-[0.2em] font-medium text-[#4A2C1A]">
            <button
              onClick={() => scrollToSection('products')}
              className="text-left py-2 border-b border-[#4A2C1A]/10 hover:text-[#4A2C1A]/70"
            >
              Our Pantry
            </button>
            <button
              onClick={() => scrollToSection('our-process')}
              className="text-left py-2 border-b border-[#4A2C1A]/10 hover:text-[#4A2C1A]/70"
            >
              The Process
            </button>
            <button
              onClick={() => scrollToSection('philosophy')}
              className="text-left py-2 border-b border-[#4A2C1A]/10 hover:text-[#4A2C1A]/70"
            >
              Heritage & Craft
            </button>
            <button
              onClick={() => scrollToSection('reviews')}
              className="text-left py-2 border-b border-[#4A2C1A]/10 hover:text-[#4A2C1A]/70"
            >
              Customer Reviews
            </button>
          </div>

          <div className="pt-2 text-xs text-[#4A2C1A]/70 flex items-center justify-between">
            <span>Atelier in Koregaon Park, Pune</span>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="underline font-medium"
            >
              Owner Login
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

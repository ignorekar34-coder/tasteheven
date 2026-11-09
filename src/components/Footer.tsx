import React, { useState } from 'react';
import { MapPin, Phone, Mail, ShieldCheck, Sun, Droplets, ArrowRight, Check } from 'lucide-react';
import { ProductCategory } from '../types';
import { MerakiLogo } from './MerakiLogo';

interface FooterProps {
  onSelectCategory?: (cat: ProductCategory) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory, onOpenAdmin }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
        setSubscribed(false);
      }, 4000);
    }
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#4A2C1A] text-[#F5F1EB] border-t border-[#F5F1EB]/10 select-none">
      {/* 1. Pre-footer Minimalist Pillars */}
      <div className="border-b border-[#F5F1EB]/10 py-10 sm:py-12 bg-[#3D2314]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
            
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full border border-[#F5F1EB]/20 bg-[#F5F1EB]/5 flex items-center justify-center shrink-0">
                <Sun className="w-4 h-4 text-[#E8DFC8]" />
              </div>
              <div>
                <h4 className="font-serif text-base text-[#F5F1EB]">21-Day Sun Cured</h4>
                <p className="text-xs text-[#F5F1EB]/70 mt-1 leading-relaxed">
                  Steeped under natural daylight in traditional glazed ceramic bharanis.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full border border-[#F5F1EB]/20 bg-[#F5F1EB]/5 flex items-center justify-center shrink-0">
                <Droplets className="w-4 h-4 text-[#E8DFC8]" />
              </div>
              <div>
                <h4 className="font-serif text-base text-[#F5F1EB]">Cold Wood-Pressed Oils</h4>
                <p className="text-xs text-[#F5F1EB]/70 mt-1 leading-relaxed">
                  Pure Kachi Ghani mustard and sesame oils with zero chemical solvents.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full border border-[#F5F1EB]/20 bg-[#F5F1EB]/5 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-[#E8DFC8]" />
              </div>
              <div>
                <h4 className="font-serif text-base text-[#F5F1EB]">Zero Preservatives</h4>
                <p className="text-xs text-[#F5F1EB]/70 mt-1 leading-relaxed">
                  No synthetic vinegar, preservatives, or artificial colors ever used.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full border border-[#F5F1EB]/20 bg-[#F5F1EB]/5 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-[#E8DFC8]" />
              </div>
              <div>
                <h4 className="font-serif text-base text-[#F5F1EB]">Crafted in Pune</h4>
                <p className="text-xs text-[#F5F1EB]/70 mt-1 leading-relaxed">
                  Freshly bottled in small numbered batches in Koregaon Park, Pune.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 2. Main Footer Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 text-left">
          
          {/* Brand Philosophy */}
          <div className="md:col-span-5 space-y-5">
            <MerakiLogo theme="dark" size="lg" />
            <p className="text-xs sm:text-sm text-[#F5F1EB]/75 font-light leading-relaxed max-w-sm">
              Meraki Pantry is an artisanal food atelier based in Pune, devoted to preserving heritage Indian recipes through the quiet luxury of slow methods, pure cold oils, and sun-ripened fruit.
            </p>
            <div className="pt-2 text-xs text-[#F5F1EB]/60 space-y-1.5 font-light">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#E8DFC8]" />
                <span>Koregaon Park, Lane 7, Pune, MH 411001</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#E8DFC8]" />
                <span>Atelier Line: +91 98765 43210</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#E8DFC8]" />
                <span>concierge@merakipantry.in</span>
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-serif text-lg text-[#F5F1EB] tracking-wide">The Objects</h4>
            <ul className="space-y-2.5 text-xs text-[#F5F1EB]/75 tracking-wider uppercase font-medium">
              <li>
                <button
                  onClick={() => scrollTo('products')}
                  className="hover:text-[#F5F1EB] transition-colors cursor-pointer"
                >
                  Raw Mango Pickle (300g)
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('products')}
                  className="hover:text-[#F5F1EB] transition-colors cursor-pointer"
                >
                  Apple Murabba (350g)
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('products')}
                  className="hover:text-[#F5F1EB] transition-colors cursor-pointer"
                >
                  Apple Murabba with Saffron (350g)
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('our-process')}
                  className="hover:text-[#F5F1EB] transition-colors cursor-pointer"
                >
                  Bharani Curing Method
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('reviews')}
                  className="hover:text-[#F5F1EB] transition-colors cursor-pointer"
                >
                  Customer Impressions
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter / Seasonal Batch Dispatch */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="font-serif text-lg text-[#F5F1EB] tracking-wide">The Small-Batch Gazette</h4>
            <p className="text-xs text-[#F5F1EB]/75 leading-relaxed font-light">
              Receive private invitations when new seasonal harvests of mangoes or Kashmiri saffron preserves are uncorked.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2 pt-1">
              <div className="flex items-stretch border border-[#F5F1EB]/30 bg-[#F5F1EB]/5 focus-within:border-[#F5F1EB]">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="px-3.5 py-2.5 bg-transparent text-xs text-[#F5F1EB] placeholder-[#F5F1EB]/40 outline-none w-full font-light"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#F5F1EB] text-[#4A2C1A] text-xs font-medium tracking-wider uppercase hover:bg-[#E8DFC8] transition-colors cursor-pointer shrink-0"
                >
                  {subscribed ? <Check className="w-4 h-4 text-emerald-800" /> : 'Join'}
                </button>
              </div>
              {subscribed && (
                <p className="text-[11px] text-[#E8DFC8]">
                  Thank you. You have been added to our private release list.
                </p>
              )}
            </form>

            <div className="pt-2">
              <button
                onClick={onOpenAdmin}
                className="text-[11px] text-[#F5F1EB]/50 hover:text-[#F5F1EB]/90 underline tracking-wider uppercase transition-colors cursor-pointer"
              >
                Atelier Staff Portal
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Bottom Bar */}
      <div className="border-t border-[#F5F1EB]/10 py-6 bg-[#381F12] text-xs text-[#F5F1EB]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} MERAKI PANTRY. Handcrafted in Pune, Maharashtra. All rights reserved.</p>
          <div className="flex items-center gap-6 text-[11px] uppercase tracking-wider">
            <span>FSSAI Certified</span>
            <span>·</span>
            <span>Food-Grade Glass Packaging</span>
            <span>·</span>
            <span>Pan-India Courier</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

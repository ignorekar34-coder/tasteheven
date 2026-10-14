import React from 'react';
import { motion } from 'motion/react';
import { MessageCircle, ArrowRight, ShieldCheck, HeartHandshake, Sparkles, Truck } from 'lucide-react';
import { generateGeneralInquiryWhatsAppUrl } from '../utils/whatsapp';
import { TasteHevenLogo } from './TasteHevenLogo';

export const DEFAULT_HERO_BANNER = '/src/assets/images/taste_heaven_hero_banner_1791803683564.jpg';

interface HeroProps {
  onExploreClick: () => void;
  bannerImage?: string;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, bannerImage }) => {
  const activeBanner = bannerImage || DEFAULT_HERO_BANNER;

  return (
    <section id="hero" className="relative bg-white overflow-hidden border-b border-[#0A0A0A]/10">
      {/* Subtle luxury ambient gold glow */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#D4AF37]/10 blur-3xl" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 rounded-full bg-[#D4AF37]/15 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-20 lg:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Sweetgreen Layout with Luxury Black & Gold Typography */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ willChange: 'transform, opacity', transform: 'translateZ(0)' }}
            className="lg:col-span-7 space-y-7 text-left"
          >
            {/* Luxury Kicker */}
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0A0A0A] bg-white border border-[#D4AF37]/50 px-4 py-1.5 rounded-full shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>100% Raw · Khalis · Fine Food Experience</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="font-serif text-5xl sm:text-7xl lg:text-[5.5rem] font-bold text-[#0A0A0A] leading-[1.0] tracking-tight">
                Eat Fresh,
                <span className="block font-serif italic font-normal text-[#D4AF37] mt-1">
                  Feel Heaven.
                </span>
              </h1>
              
              <div className="pt-2 space-y-2">
                <p
                  style={{ fontFamily: 'var(--font-cinzel), serif' }}
                  className="text-xl sm:text-2xl font-bold tracking-[0.08em] uppercase text-[#0A0A0A]"
                >
                  TASTE HEVEN
                  <span className="text-[#D4AF37] text-sm sm:text-base font-medium normal-case block sm:inline sm:ml-3 font-serif italic tracking-normal">
                    — Pure Honey, Achar & Murabba
                  </span>
                </p>
                <p className="text-sm sm:text-base text-stone-600 max-w-xl leading-relaxed">
                  Handcrafted with heirloom recipes and nature’s rarest harvests. From wild Sidr berry blooms
                  to sun-cured spicy mango achar in pure mustard oil and saffron-steeped royal Kashmiri murabbay.
                </p>
              </div>
            </div>

            {/* Clean Trust Tags with Gold Accents */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-[#0A0A0A] pt-1">
              <span className="flex items-center gap-1.5 bg-stone-50 border border-[#D4AF37]/40 px-4 py-2 rounded-full shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                Zero Sugar Adulteration
              </span>
              <span className="flex items-center gap-1.5 bg-stone-50 border border-[#D4AF37]/40 px-4 py-2 rounded-full shadow-2xs">
                <HeartHandshake className="w-4 h-4 text-[#B91C1C]" />
                Pure Mustard Oil (Sarson)
              </span>
              <span className="flex items-center gap-1.5 bg-stone-50 border border-[#D4AF37]/40 px-4 py-2 rounded-full shadow-2xs">
                <Truck className="w-4 h-4 text-[#D4AF37]" />
                Cash on Delivery Pakistan
              </span>
            </div>

            {/* CTA Buttons in Luxury Rounded Style */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-3">
              <button
                onClick={onExploreClick}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#0A0A0A] hover:bg-[#1A1A1A] text-white hover:text-[#D4AF37] border border-[#D4AF37]/60 font-bold text-sm rounded-full shadow-sm hover:shadow-md transition-all group cursor-pointer"
              >
                <span>Shop Pure Collection</span>
                <ArrowRight className="w-4 h-4 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href={generateGeneralInquiryWhatsAppUrl('I would like to order Khalis Honey, Achar, and Murabba')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#D4AF37] hover:bg-[#F9E498] text-[#0A0A0A] font-bold text-sm rounded-full shadow-sm hover:shadow transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-[#0A0A0A] text-[#0A0A0A]" />
                <span>Quick Order WhatsApp</span>
              </a>
            </div>

            {/* Metrics Strip */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-[#0A0A0A]/10 max-w-lg">
              <div>
                <p className="font-serif text-3xl sm:text-4xl font-bold text-[#0A0A0A] tabular-nums">100%</p>
                <p className="text-xs text-[#0A0A0A]/70 font-semibold mt-0.5">Khalis Guarantee</p>
              </div>
              <div>
                <p className="font-serif text-3xl sm:text-4xl font-bold text-[#D4AF37] tabular-nums">4.9 ★</p>
                <p className="text-xs text-[#0A0A0A]/70 font-semibold mt-0.5">1,840+ Verified Reviews</p>
              </div>
              <div>
                <p className="font-serif text-3xl sm:text-4xl font-bold text-[#0A0A0A] tabular-nums">2-4 Days</p>
                <p className="text-xs text-[#0A0A0A]/70 font-semibold mt-0.5">Express Nationwide COD</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Hero Image with subtle parallax y: -20 and Brand Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: -20 }}
            transition={{ duration: 0.4, delay: 0.07, ease: [0.16, 1, 0.3, 1] }}
            style={{ willChange: 'transform, opacity', transform: 'translateZ(0)' }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-[36px] overflow-hidden bg-white border border-[#0A0A0A]/10 shadow-xl aspect-4/3 sm:aspect-16/11 lg:aspect-4/3 group">
              <img
                key={activeBanner}
                src={activeBanner}
                alt="Taste Heven Pure Honey, Spicy Achar and Lazeez Murabba Jars"
                referrerPolicy="no-referrer"
                decoding="async"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = DEFAULT_HERO_BANNER;
                }}
                className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-700 ease-out"
              />

              {/* Measured contrast scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

              {/* Floating official circular badge emblem at top right corner */}
              <div className="absolute top-4 right-4 z-10 drop-shadow-2xl">
                <TasteHevenLogo variant="badge" size={74} />
              </div>

              {/* Floating artisanal tag on bottom */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-xl border border-[#D4AF37]/40 p-4 rounded-[24px] flex items-center justify-between text-left shadow-lg">
                <div>
                  <p className="text-xs font-bold text-[#0A0A0A]">
                    Taste Heven Artisanal Pantry
                  </p>
                  <p className="text-[11px] text-stone-600 font-medium">
                    Sanitized food-grade glass jars · Zero chemicals
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold text-[#0A0A0A] bg-stone-100 border border-[#D4AF37]/50 px-3 py-1 rounded-full">
                    COD & EasyPaisa
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

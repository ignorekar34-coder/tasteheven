import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, HeartHandshake, ArrowRight, MessageCircle, Sparkles, Award } from 'lucide-react';
import { generateGeneralInquiryWhatsAppUrl } from '../utils/whatsapp';

export const DEFAULT_HERO_BANNER = '/src/assets/images/taste_heaven_hero_banner_1791803683564.jpg';

interface HeroProps {
  onExploreClick: () => void;
  bannerImage?: string;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, bannerImage }) => {
  const currentBanner = bannerImage || DEFAULT_HERO_BANNER;

  return (
    <section
      id="hero"
      className="relative bg-[#0A0A0A] text-[#F9F5EB] overflow-hidden border-b border-[#D4AF37]/20 select-none"
    >
      {/* 1. Subtle Luxury Ambient Studio Background & Radial Glows */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Soft radial golden aura behind the center banner */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[550px] bg-gradient-to-b from-[#D4AF37]/15 via-[#D4AF37]/5 to-transparent rounded-full blur-[120px]" />
        {/* Secondary warm ambient flares */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#C9A86A]/10 blur-3xl" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 rounded-full bg-[#D4AF37]/10 blur-3xl" />
        {/* Minimal studio grid vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0A0A0A_85%)] opacity-80" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 lg:pt-12 lg:pb-24">
        {/* Top Minimal Pill Kicker */}
        <div className="flex justify-center mb-5">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 text-xs font-mono font-medium tracking-widest text-[#D4AF37] uppercase bg-black/60 border border-[#D4AF37]/40 px-4 py-1.5 rounded-full shadow-lg backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>TASTE HEVEN · FINE FOOD EXPERIENCE</span>
          </motion.div>
        </div>

        {/* 2. Text Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto space-y-3 pt-1"
        >
          {/* Main Heading */}
          <h1
            style={{ fontFamily: 'var(--font-cinzel), serif' }}
            className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-[0.08em] text-[#FFFFFF] uppercase drop-shadow-md"
          >
            Eat Fresh, Feel Heaven
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm lg:text-base font-semibold tracking-[0.2em] text-[#D4AF37] uppercase">
            Pure Honey, Achar & Murabba · Pure, Natural & Crafted with Care
          </p>

          {/* Heritage Story */}
          <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl mx-auto leading-relaxed pt-1 font-medium">
            Raw Sidr and wildflower honey, sun-matured mango & garlic pickles in pure cold-pressed sarson oil, and royal fruit murabbay prepared with traditional heritage recipes.
          </p>

          {/* Action Buttons: SHOP NOW & ORDER ON WHATSAPP */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onExploreClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-[#D4AF37] hover:bg-[#c49f2e] text-[#0A0A0A] font-extrabold text-xs sm:text-sm tracking-wider uppercase rounded-full shadow-lg shadow-[#D4AF37]/25 hover:shadow-xl hover:shadow-[#D4AF37]/40 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
            >
              <span>SHOP NOW</span>
              <ArrowRight className="w-4 h-4 text-[#0A0A0A]" />
            </button>

            <a
              href={generateGeneralInquiryWhatsAppUrl('Hero Banner Order Link')}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-transparent hover:bg-[#D4AF37]/10 text-[#D4AF37] hover:text-[#FFFFFF] border-2 border-[#D4AF37] font-bold text-xs sm:text-sm tracking-wider uppercase rounded-full shadow-sm hover:border-[#F9F5EB] transition-all duration-300 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-[#D4AF37]" />
              <span>ORDER ON WHATSAPP</span>
            </a>
          </div>
        </motion.div>

        {/* 3. Hero Banner Image Showcase */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-8 sm:mt-10 max-w-5xl mx-auto rounded-3xl overflow-hidden border border-[#D4AF37]/40 shadow-2xl shadow-black/80 group"
        >
          <img
            src={currentBanner}
            alt="Taste Heven Artisanal Jars - Pure Honey, Spicy Mango Achar, Glistening Murabba"
            className="w-full h-auto max-h-[500px] object-cover sm:object-center transform group-hover:scale-[1.01] transition-transform duration-700"
            loading="eager"
            decoding="sync"
          />
          {/* Subtle gradient overlay at bottom edge */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
        </motion.div>

        {/* 4. Bottom Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-8">
          <div className="inline-flex items-center gap-2 bg-white text-[#0A0A0A] font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-full shadow-md border border-[#D4AF37]/40">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
            <span>100% Khalis & Pure Guarantee</span>
          </div>

          <div className="inline-flex items-center gap-2 bg-white text-[#0A0A0A] font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-full shadow-md border border-[#D4AF37]/40">
            <HeartHandshake className="w-4 h-4 text-[#DC2626] shrink-0" />
            <span>Cold-Pressed Sarson (Mustard) Oil</span>
          </div>

          <div className="inline-flex items-center gap-2 bg-white text-[#0A0A0A] font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-full shadow-md border border-[#D4AF37]/40">
            <Award className="w-4 h-4 text-[#D4AF37] shrink-0" />
            <span>Cash On Delivery Nationwide</span>
          </div>
        </div>
      </div>
    </section>
  );
};

import React from 'react';
import { MessageCircle, ArrowRight, ShieldCheck, HeartHandshake, Leaf, Truck } from 'lucide-react';
import { generateGeneralInquiryWhatsAppUrl } from '../utils/whatsapp';

interface HeroProps {
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick }) => {
  return (
    <section id="hero" className="relative bg-white overflow-hidden border-b border-stone-200">
      {/* Subtle organic background glow */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-amber-100 blur-3xl" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 rounded-full bg-emerald-50 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 lg:pt-14 lg:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Brand Story & Call to Action */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Editorial kicker */}
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-3 py-1.5 rounded-full">
              <Leaf className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Pure · Organic · Traditional Pantry</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 leading-[1.18] tracking-tight text-balance">
                Taste Heven
                <span className="block text-2xl sm:text-3xl lg:text-4xl font-normal text-amber-700 italic mt-1 font-serif">
                  Khalis Shehad, Chatpata Achar, Aur Lazeez Murabbay
                </span>
              </h1>
              
              <p className="text-base sm:text-lg text-stone-600 max-w-2xl leading-relaxed pt-2">
                Experience authentic desi pantry delicacies prepared with uncompromised purity.
                From raw wild Sidr honey to sun-cured mango achar in cold-pressed mustard oil
                and saffron-steeped royal murabbay — handcrafted for your family’s wellness.
              </p>
            </div>

            {/* Trust Badges Minimal Strip */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-stone-600 pt-1">
              <span className="flex items-center gap-1.5 bg-stone-50 border border-stone-200/80 px-3 py-1.5 rounded-md">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                Zero Sugar Adulteration
              </span>
              <span className="flex items-center gap-1.5 bg-stone-50 border border-stone-200/80 px-3 py-1.5 rounded-md">
                <HeartHandshake className="w-4 h-4 text-amber-600" />
                Pure Mustard Oil (Sarson)
              </span>
              <span className="flex items-center gap-1.5 bg-stone-50 border border-stone-200/80 px-3 py-1.5 rounded-md">
                <Truck className="w-4 h-4 text-emerald-700" />
                Cash on Delivery Pakistan
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={onExploreClick}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-900 hover:bg-emerald-800 text-amber-100 font-semibold text-sm rounded-xl shadow-xs transition-colors group cursor-pointer"
              >
                <span>Shop Pure Collection</span>
                <ArrowRight className="w-4 h-4 text-amber-300 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href={generateGeneralInquiryWhatsAppUrl('I would like to order Khalis Honey, Achar, and Murabba')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold text-sm rounded-xl shadow-xs transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Quick Order on WhatsApp</span>
              </a>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-stone-200/90 max-w-lg">
              <div>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tabular-nums">100%</p>
                <p className="text-xs text-stone-500 font-medium">Khalis & Raw Guarantee</p>
              </div>
              <div>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tabular-nums">4.9 ★</p>
                <p className="text-xs text-stone-500 font-medium">1,840+ Customer Reviews</p>
              </div>
              <div>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tabular-nums">2-4 Days</p>
                <p className="text-xs text-stone-500 font-medium">Nationwide Express Delivery</p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Showcase Photography */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden bg-stone-100 border border-stone-200/80 shadow-md aspect-4/3 sm:aspect-16/10 lg:aspect-4/3 group">
              <img
                src="/src/assets/images/taste_heaven_hero_banner_1791803683564.jpg"
                alt="Taste Heaven Pure Honey, Spicy Achar and Lazeez Murabba Jars"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                loading="eager"
              />
              
              {/* Subtle gradient scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 via-transparent to-transparent pointer-events-none" />

              {/* Floating artisanal tag on bottom corner */}
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 bg-white/95 backdrop-blur-md border border-stone-200/90 p-3 sm:p-3.5 rounded-xl flex items-center justify-between text-left shadow-xs">
                <div>
                  <p className="text-xs font-semibold text-emerald-950">
                    Artisanal Pakistani Pantry
                  </p>
                  <p className="text-[11px] text-stone-500">
                    Packed fresh in food-grade glass jars
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded">
                    COD All Cities
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

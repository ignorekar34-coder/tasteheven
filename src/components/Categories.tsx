import React from 'react';
import { motion } from 'motion/react';
import { ProductCategory } from '../types';
import { Sparkles, ArrowRight } from 'lucide-react';

interface CategoriesProps {
  activeCategory: ProductCategory;
  onSelectCategory: (category: ProductCategory) => void;
  counts: {
    all: number;
    honey: number;
    achar: number;
    murabba: number;
  };
}

export const Categories: React.FC<CategoriesProps> = ({
  activeCategory,
  onSelectCategory,
  counts,
}) => {
  const categoriesList = [
    {
      id: 'honey' as ProductCategory,
      title: 'Pure Honey',
      urduTitle: 'خالص قدرتی شہد',
      tagline: '100% Raw Sidr & Blossom Nectar',
      image: '/src/assets/images/product_pure_sidr_honey_1791803704705.jpg',
      count: counts.honey,
      color: 'from-amber-600/10 to-amber-700/5',
      badgeColor: 'text-amber-800 bg-amber-50 border-amber-200',
    },
    {
      id: 'achar' as ProductCategory,
      title: 'Chatpata Achar',
      urduTitle: 'اصلی سرسوں کا چٹپٹا اچار',
      tagline: 'Sun-cured in pure mustard oil',
      image: '/src/assets/images/product_spicy_mango_achar_1791803720039.jpg',
      count: counts.achar,
      color: 'from-red-600/10 to-amber-700/5',
      badgeColor: 'text-red-800 bg-red-50 border-red-200',
    },
    {
      id: 'murabba' as ProductCategory,
      title: 'Lazeez Murabbay',
      urduTitle: 'شاہی لذیذ مربہ جات',
      tagline: 'Cardamom & Saffron infused preserves',
      image: '/src/assets/images/product_lazeez_seb_murabba_1791803738733.jpg',
      count: counts.murabba,
      color: 'from-emerald-600/10 to-amber-700/5',
      badgeColor: 'text-emerald-800 bg-emerald-50 border-emerald-200',
    },
  ];

  return (
    <section className="py-16 bg-[#FAFAFA] border-b border-[#0A0A0A]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="text-left max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#0A0A0A] bg-white border border-[#D4AF37]/50 px-3.5 py-1.5 rounded-full mb-3 shadow-2xs">
              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
              <span>Core Pantry Collections</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#0A0A0A] tracking-tight leading-tight">
              Curated for Health,
              <span className="block italic text-[#D4AF37] font-serif font-normal">
                Crafted for Taste.
              </span>
            </h2>
          </div>
          <p className="text-sm text-stone-600 max-w-md text-left leading-relaxed font-medium">
            Every recipe is prepared in small batches using traditional slow-cooking methods to preserve raw bio-enzymes, vitamins, and authentic aroma.
          </p>
        </div>

        {/* 3 Spotlight Cards with rounded-[32px] */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {categoriesList.map((cat, i) => {
            const isSelected = activeCategory === cat.id;
            return (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.4, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                style={{ willChange: 'transform, opacity', transform: 'translateZ(0)' }}
                onClick={() => {
                  onSelectCategory(cat.id);
                  const el = document.getElementById('products');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`group relative rounded-[32px] p-7 text-left transition-all duration-300 bg-white border cursor-pointer overflow-hidden flex flex-col justify-between md:hover:-translate-y-1.5 ${
                  isSelected
                    ? 'border-[#D4AF37] shadow-xl ring-2 ring-[#D4AF37]/30'
                    : 'border-[#0A0A0A]/10 hover:border-[#D4AF37]/60 hover:shadow-lg'
                }`}
              >
                <div className="relative z-10 flex items-start justify-between gap-4">
                  <div>
                    <span className="inline-block text-[11px] font-bold px-3 py-1 rounded-full border mb-3 text-[#0A0A0A] bg-stone-50 border-[#D4AF37]/40">
                      {cat.count} Available
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#0A0A0A] group-hover:text-[#D4AF37] transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-xs font-semibold text-[#D4AF37] font-serif pt-1">
                      {cat.urduTitle}
                    </p>
                    <p className="text-xs text-stone-500 mt-2 line-clamp-2 leading-relaxed font-medium">
                      {cat.tagline}
                    </p>
                  </div>

                  <div className="w-24 h-24 rounded-[22px] overflow-hidden bg-stone-100 shrink-0 border border-[#D4AF37]/30 shadow-xs">
                    <img
                      src={cat.image}
                      alt={cat.title}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>

                <div className="relative z-10 mt-8 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-[#0A0A0A] group-hover:text-[#D4AF37]">
                  <span>Explore {cat.title}</span>
                  <div className="w-7 h-7 rounded-full bg-stone-50 border border-[#D4AF37]/40 flex items-center justify-center group-hover:bg-[#0A0A0A] group-hover:text-[#D4AF37] group-hover:border-[#D4AF37] transition-colors">
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Filter Segmented Pill Control in Luxury Black & Gold Style */}
        <div className="flex items-center justify-center">
          <div className="inline-flex p-1.5 bg-stone-100 rounded-full border border-[#0A0A0A]/10 shadow-2xs">
            <button
              onClick={() => onSelectCategory('all')}
              className={`px-5 py-2.5 text-xs sm:text-sm font-bold rounded-full transition-all cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-[#0A0A0A] text-[#D4AF37] shadow-sm border border-[#D4AF37]/50'
                  : 'text-[#0A0A0A] hover:text-[#D4AF37]'
              }`}
            >
              All Items ({counts.all})
            </button>
            <button
              onClick={() => onSelectCategory('honey')}
              className={`px-5 py-2.5 text-xs sm:text-sm font-bold rounded-full transition-all cursor-pointer ${
                activeCategory === 'honey'
                  ? 'bg-[#0A0A0A] text-[#D4AF37] shadow-sm border border-[#D4AF37]/50'
                  : 'text-[#0A0A0A] hover:text-[#D4AF37]'
              }`}
            >
              Pure Honey ({counts.honey})
            </button>
            <button
              onClick={() => onSelectCategory('achar')}
              className={`px-5 py-2.5 text-xs sm:text-sm font-bold rounded-full transition-all cursor-pointer ${
                activeCategory === 'achar'
                  ? 'bg-[#0A0A0A] text-[#D4AF37] shadow-sm border border-[#D4AF37]/50'
                  : 'text-[#0A0A0A] hover:text-[#D4AF37]'
              }`}
            >
              Chatpata Achar ({counts.achar})
            </button>
            <button
              onClick={() => onSelectCategory('murabba')}
              className={`px-5 py-2.5 text-xs sm:text-sm font-bold rounded-full transition-all cursor-pointer ${
                activeCategory === 'murabba'
                  ? 'bg-[#0A0A0A] text-[#D4AF37] shadow-sm border border-[#D4AF37]/50'
                  : 'text-[#0A0A0A] hover:text-[#D4AF37]'
              }`}
            >
              Lazeez Murabbay ({counts.murabba})
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

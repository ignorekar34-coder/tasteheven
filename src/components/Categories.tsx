import React from 'react';
import { ProductCategory, CategoryConfig } from '../types';
import { DEFAULT_CATEGORIES } from '../data/categories';
import { ArrowRight, Sparkles } from 'lucide-react';

interface CategoriesProps {
  activeCategory: ProductCategory;
  onSelectCategory: (category: ProductCategory) => void;
  counts: {
    all: number;
    honey: number;
    achar: number;
    murabba: number;
    featured?: number;
  };
  categories?: CategoryConfig[];
}

export const Categories: React.FC<CategoriesProps> = ({
  activeCategory,
  onSelectCategory,
  counts,
  categories,
}) => {
  const activeConfigs = categories && categories.length > 0 ? categories : DEFAULT_CATEGORIES;

  return (
    <section className="py-12 bg-[#F5F1EB] border-b border-[#4A2C1A]/10 text-[#4A2C1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Collection Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {activeConfigs.map((cat) => {
            const isSelected = activeCategory === cat.id;
            const count = counts[cat.id] ?? 0;

            return (
              <div
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  const el = document.getElementById('products');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`group p-6 sm:p-8 bg-[#FAF8F5] border transition-all duration-300 cursor-pointer flex items-center justify-between gap-6 ${
                  isSelected
                    ? 'border-[#4A2C1A] shadow-md ring-1 ring-[#4A2C1A]'
                    : 'border-[#4A2C1A]/15 hover:border-[#4A2C1A]/50 hover:shadow-xs'
                }`}
              >
                <div className="space-y-2 text-left flex-1">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#4A2C1A]/60 font-medium">
                    {count} Available · Small Batch
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#4A2C1A]">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-[#4A2C1A]/75 font-light leading-relaxed max-w-sm">
                    {cat.tagline}
                  </p>
                  <div className="pt-2 inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-medium text-[#4A2C1A] group-hover:translate-x-1 transition-transform">
                    <span>View Preserves</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="w-24 h-24 sm:w-28 sm:h-28 overflow-hidden bg-[#EDE7DD] border border-[#4A2C1A]/15 shrink-0">
                  <img
                    src={cat.bannerImage || cat.defaultImage}
                    alt={cat.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Minimalist Filter Navigation Tabs */}
        <div className="flex items-center justify-center pt-2">
          <div className="inline-flex p-1 bg-[#EDE7DD] border border-[#4A2C1A]/15 flex-wrap justify-center gap-1">
            <button
              onClick={() => onSelectCategory('all')}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-medium transition-all cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-[#4A2C1A] text-[#F5F1EB] shadow-xs'
                  : 'text-[#4A2C1A]/80 hover:text-[#4A2C1A]'
              }`}
            >
              All Jars ({counts.all})
            </button>
            <button
              onClick={() => onSelectCategory('achar')}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-medium transition-all cursor-pointer ${
                activeCategory === 'achar'
                  ? 'bg-[#4A2C1A] text-[#F5F1EB] shadow-xs'
                  : 'text-[#4A2C1A]/80 hover:text-[#4A2C1A]'
              }`}
            >
              Mango Pickle ({counts.achar})
            </button>
            <button
              onClick={() => onSelectCategory('murabba')}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-medium transition-all cursor-pointer ${
                activeCategory === 'murabba'
                  ? 'bg-[#4A2C1A] text-[#F5F1EB] shadow-xs'
                  : 'text-[#4A2C1A]/80 hover:text-[#4A2C1A]'
              }`}
            >
              Apple Murabba ({counts.murabba})
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

import React from 'react';
import { ProductCategory } from '../types';
import { Sparkles } from 'lucide-react';

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
    <section className="py-12 bg-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-800 bg-amber-100/70 px-3 py-1 rounded-full mb-3">
            <Sparkles className="w-3 h-3 text-amber-700" />
            <span>Pantry Categories</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Handcrafted Traditional Delicacies
          </h2>
          <p className="text-sm sm:text-base text-stone-600 mt-2">
            Explore our signature three ranges made using ancestral Pakistani recipes and purest ingredients.
          </p>
        </div>

        {/* 3 Visual Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {categoriesList.map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  const el = document.getElementById('products');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`group relative rounded-2xl p-6 text-left transition-all duration-300 bg-white border cursor-pointer overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'border-amber-600 shadow-md ring-2 ring-amber-500/20'
                    : 'border-stone-200 hover:border-stone-300 hover:shadow-xs'
                }`}
              >
                {/* Background Accent Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} pointer-events-none opacity-40`} />

                <div className="relative z-10 flex items-start justify-between gap-4">
                  <div>
                    <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded border mb-2 ${cat.badgeColor}`}>
                      {cat.count} Items Available
                    </span>
                    <h3 className="font-serif text-xl font-bold text-stone-900 group-hover:text-amber-700 transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-xs font-medium text-amber-800 font-serif pt-0.5">
                      {cat.urduTitle}
                    </p>
                    <p className="text-xs text-stone-500 mt-1.5 line-clamp-2">
                      {cat.tagline}
                    </p>
                  </div>

                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200/80 shadow-xs">
                    <img
                      src={cat.image}
                      alt={cat.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>

                <div className="relative z-10 mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-emerald-900 group-hover:text-amber-700">
                  <span>Browse {cat.title}</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Filter Segmented Control */}
        <div className="flex items-center justify-center">
          <div className="inline-flex p-1 bg-white border border-stone-200 rounded-xl shadow-xs">
            <button
              onClick={() => onSelectCategory('all')}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-emerald-900 text-amber-100 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All Products ({counts.all})
            </button>
            <button
              onClick={() => onSelectCategory('honey')}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                activeCategory === 'honey'
                  ? 'bg-emerald-900 text-amber-100 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Pure Honey ({counts.honey})
            </button>
            <button
              onClick={() => onSelectCategory('achar')}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                activeCategory === 'achar'
                  ? 'bg-emerald-900 text-amber-100 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Chatpata Achar ({counts.achar})
            </button>
            <button
              onClick={() => onSelectCategory('murabba')}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                activeCategory === 'murabba'
                  ? 'bg-emerald-900 text-amber-100 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
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

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Product } from '../types';
import { ShoppingBag, MessageCircle, Eye, Star, Check, Sparkles } from 'lucide-react';
import { formatPKR, generateSingleProductWhatsAppUrl } from '../utils/whatsapp';

interface ProductCardProps {
  product: Product;
  index?: number;
  onAddToCart: (product: Product, weight: string, price: number) => void;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  index = 0,
  onAddToCart,
  onQuickView,
}) => {
  const [selectedWeight, setSelectedWeight] = useState(product.weight);
  const [justAdded, setJustAdded] = useState(false);

  // Find price for selected weight option
  const activeOption = product.weightOptions.find((opt) => opt.weight === selectedWeight) || {
    weight: product.weight,
    price: product.price,
  };
  const activePrice = activeOption.price;

  const handleAdd = () => {
    onAddToCart(product, selectedWeight, activePrice);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const whatsAppUrl = generateSingleProductWhatsAppUrl(product, selectedWeight, activePrice, 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.4, delay: (index % 3) * 0.07, ease: [0.16, 1, 0.3, 1] }}
      style={{ willChange: 'transform, opacity', transform: 'translateZ(0)' }}
      className="group bg-white rounded-[32px] border border-[#0A0A0A]/10 hover:border-[#D4AF37]/60 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 md:hover:-translate-y-1.5 flex flex-col text-left"
    >
      {/* Product Image in Rounded Container */}
      <div className="relative aspect-4/3 bg-stone-100 overflow-hidden m-2.5 rounded-[24px]">
        <img
          src={product.image || '/src/assets/images/product_pure_sidr_honey_1791803704705.jpg'}
          alt={product.name}
          referrerPolicy="no-referrer"
          loading="lazy"
          decoding="async"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = '/src/assets/images/product_pure_sidr_honey_1791803704705.jpg';
          }}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges Container */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start z-10">
          {product.featured && (
            <div className="bg-[#0A0A0A]/95 backdrop-blur-md border border-[#D4AF37] text-[#D4AF37] text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
              <span>Featured</span>
            </div>
          )}
          {product.badge && (
            <div className="bg-white/95 backdrop-blur-md border border-[#D4AF37]/40 text-[#0A0A0A] text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-2xs">
              {product.badge}
            </div>
          )}
        </div>

        {/* Quick View Floating Button */}
        <button
          onClick={() => onQuickView(product)}
          className="absolute top-3 right-3 p-2.5 bg-white/95 backdrop-blur-md text-[#0A0A0A] hover:text-[#D4AF37] hover:bg-white rounded-full shadow-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
          title="Quick View Details"
          aria-label="Quick View Details"
        >
          <Eye className="w-4 h-4" />
        </button>

        {/* Stock status indicator */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-[#0A0A0A]/75 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-[#B91C1C] text-white text-xs font-bold px-3.5 py-1.5 rounded-full border border-white/20">
              Sold Out (Restocking Soon)
            </span>
          </div>
        )}
      </div>

      {/* Card Content with Generous Padding */}
      <div className="p-6 pt-3 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata: Category and Rating */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2 font-medium">
            <span className="uppercase tracking-wider font-bold text-[11px] text-[#0A0A0A]">
              {product.category === 'honey' ? 'Pure Honey' : product.category === 'achar' ? 'Spicy Achar' : 'Murabba'}
            </span>
            <div className="flex items-center gap-1 font-semibold text-[#0A0A0A] bg-stone-50 px-2.5 py-0.5 rounded-full border border-[#D4AF37]/30">
              <Star className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
              <span className="tabular-nums font-bold">{product.rating}</span>
              <span className="text-stone-400 font-normal">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Titles in Instrument Serif */}
          <h3
            onClick={() => onQuickView(product)}
            className="font-serif text-2xl font-bold text-[#0A0A0A] hover:text-[#D4AF37] transition-colors cursor-pointer line-clamp-1 leading-snug"
          >
            {product.name}
          </h3>
          <p className="text-xs font-semibold text-[#D4AF37] font-serif mb-2">
            {product.urduName}
          </p>

          <p className="text-xs sm:text-sm text-stone-600 line-clamp-2 leading-relaxed mb-4 font-normal">
            {product.shortDesc}
          </p>
        </div>

        <div>
          {/* Weight Selection Chips */}
          <div className="mb-4">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-2">
              Select Size:
            </span>
            <div className="flex items-center gap-2">
              {product.weightOptions.map((opt) => (
                <button
                  key={opt.weight}
                  onClick={() => setSelectedWeight(opt.weight)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-full border transition-all cursor-pointer ${
                    selectedWeight === opt.weight
                      ? 'bg-[#0A0A0A] text-[#D4AF37] border-[#D4AF37] shadow-2xs'
                      : 'bg-stone-50 text-[#0A0A0A] border-stone-200 hover:border-[#D4AF37]/50'
                  }`}
                >
                  {opt.weight}
                </button>
              ))}
            </div>
          </div>

          {/* Price Row (Tabular Numerals) */}
          <div className="flex items-baseline justify-between pt-3 border-t border-stone-100 mb-4">
            <div>
              <span className="font-serif text-2xl font-bold text-[#0A0A0A] tabular-nums">
                {formatPKR(activePrice)}
              </span>
              {product.originalPrice && (
                <span className="ml-2 text-xs text-stone-400 line-through tabular-nums">
                  {formatPKR(product.originalPrice)}
                </span>
              )}
            </div>
            <span className="text-[11px] font-semibold text-[#0A0A0A] bg-stone-50 px-2.5 py-1 rounded-full border border-[#D4AF37]/30">
              Glass Jar
            </span>
          </div>

          {/* Action Buttons: Add to Cart + WhatsApp in Luxury Style */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={handleAdd}
              disabled={!product.inStock}
              className={`flex items-center justify-center gap-1.5 py-3 px-3 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                justAdded
                  ? 'bg-[#D4AF37] text-[#0A0A0A] border-[#D4AF37]'
                  : 'bg-[#0A0A0A] hover:bg-[#1A1A1A] text-white hover:text-[#D4AF37] border-[#D4AF37]/40 active:scale-98 shadow-xs'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#0A0A0A]" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>

            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-full text-xs font-bold bg-[#D4AF37] hover:bg-[#F9E498] text-[#0A0A0A] active:scale-98 transition-all shadow-xs border border-[#AA8010]"
              title="Order on WhatsApp (0324-8314001)"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-[#0A0A0A] text-[#0A0A0A]" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

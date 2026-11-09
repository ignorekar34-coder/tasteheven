import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Product } from '../types';
import { ShoppingBag, Eye, Check, Sparkles, MessageCircle } from 'lucide-react';
import { generateSingleProductWhatsAppUrl } from '../utils/whatsapp';

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

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, selectedWeight, activePrice);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  const whatsAppUrl = generateSingleProductWhatsAppUrl(product, selectedWeight, activePrice, 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="group bg-[#FAF8F5] border border-[#4A2C1A]/12 hover:border-[#4A2C1A]/40 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col text-left cursor-pointer"
      onClick={() => onQuickView(product)}
    >
      {/* 1. Product Image Container (1:1 Ratio for Minimal Luxury Objects Feel) */}
      <div className="relative aspect-square w-full bg-[#EDE7DD] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Minimal Badge */}
        {product.badge && (
          <div className="absolute top-3.5 left-3.5 bg-[#FAF8F5]/95 backdrop-blur-xs border border-[#4A2C1A]/20 text-[#4A2C1A] text-[10px] tracking-[0.2em] uppercase font-medium px-2.5 py-1">
            {product.badge}
          </div>
        )}

        {/* Quick View Button on Hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onQuickView(product);
          }}
          className="absolute bottom-3 right-3 p-2 bg-[#FAF8F5]/90 hover:bg-[#FAF8F5] text-[#4A2C1A] border border-[#4A2C1A]/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-sm cursor-pointer"
          title="Inspect details"
        >
          <Eye className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 2. Content & Pricing Details */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        
        <div>
          {/* Category & Weight Indicator */}
          <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-[#4A2C1A]/60 font-medium mb-1.5">
            <span>{product.category === 'achar' ? 'Artisanal Pickle' : 'Ayurvedic Murabba'}</span>
            <span>{selectedWeight}</span>
          </div>

          {/* Product Title in Bold Serif */}
          <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#4A2C1A] tracking-tight group-hover:text-[#2c170d] transition-colors">
            {product.name}
          </h3>

          {/* Short Tasting & Ingredients Description */}
          <p className="text-xs text-[#4A2C1A]/75 mt-2 line-clamp-2 font-light leading-relaxed">
            {product.shortDesc}
          </p>
        </div>

        {/* Weight Selector Pills if multiple */}
        {product.weightOptions.length > 1 && (
          <div className="flex items-center gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
            {product.weightOptions.map((opt) => (
              <button
                key={opt.weight}
                onClick={() => setSelectedWeight(opt.weight)}
                className={`text-[11px] px-2.5 py-1 uppercase tracking-wider font-medium border transition-colors cursor-pointer ${
                  selectedWeight === opt.weight
                    ? 'border-[#4A2C1A] bg-[#4A2C1A] text-[#F5F1EB]'
                    : 'border-[#4A2C1A]/20 bg-transparent text-[#4A2C1A]/70 hover:border-[#4A2C1A]/50'
                }`}
              >
                {opt.weight}
              </button>
            ))}
          </div>
        )}

        {/* Pricing and Action Buttons */}
        <div className="pt-2 border-t border-[#4A2C1A]/10 flex items-center justify-between gap-3">
          {/* Price formatted with Rs */}
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-[#4A2C1A]/50 font-medium">Batch Price</span>
            <span className="font-serif text-lg sm:text-xl text-[#4A2C1A] font-semibold">
              Rs {activePrice.toLocaleString()}
            </span>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAdd}
            disabled={justAdded}
            className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-medium tracking-wider uppercase transition-all duration-300 cursor-pointer ${
              justAdded
                ? 'bg-emerald-800 text-white'
                : 'bg-[#4A2C1A] hover:bg-[#341d10] text-[#F5F1EB] shadow-xs hover:shadow-md'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>

      </div>
    </motion.div>
  );
};

import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { X, Star, ShoppingBag, ArrowLeft, Check, Sparkles, Droplets, Sun } from 'lucide-react';
import { generateSingleProductWhatsAppUrl } from '../utils/whatsapp';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, weight: string, price: number, quantity: number) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  if (!product) return null;

  const [selectedWeight, setSelectedWeight] = useState(product.weight);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const activeOption = product.weightOptions.find((opt) => opt.weight === selectedWeight) || {
    weight: product.weight,
    price: product.price,
  };
  const activePrice = activeOption.price;

  const handleAddToCart = () => {
    onAddToCart(product, selectedWeight, activePrice, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 800);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 overflow-y-auto bg-[#381F12]/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-[#FAF8F5] border border-[#4A2C1A]/20 max-w-3xl w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 text-[#4A2C1A]"
      >
        {/* Top Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-[#FAF8F5]/90 hover:bg-[#FAF8F5] text-[#4A2C1A] border border-[#4A2C1A]/20 rounded-full transition-colors cursor-pointer shadow-xs"
          aria-label="Close product view"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image Column */}
          <div className="relative aspect-square md:aspect-auto bg-[#EDE7DD] overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            {product.badge && (
              <div className="absolute top-4 left-4 bg-[#FAF8F5]/95 border border-[#4A2C1A]/20 text-[#4A2C1A] text-[10px] tracking-[0.2em] uppercase font-medium px-2.5 py-1">
                {product.badge}
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className="p-6 sm:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto text-left space-y-6">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-[#4A2C1A]/60 font-medium mb-1.5">
                <span>{product.category === 'achar' ? 'Artisanal Pickle' : 'Ayurvedic Murabba'}</span>
                <span className="flex items-center gap-1 text-[#4A2C1A]">
                  <Star className="w-3.5 h-3.5 fill-[#D49B45] text-[#D49B45]" />
                  <span>{product.rating} ({product.reviewCount} notes)</span>
                </span>
              </div>

              {/* Product Name in Serif */}
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#4A2C1A] tracking-tight">
                {product.name}
              </h2>

              {/* Price */}
              <div className="mt-3 pb-4 border-b border-[#4A2C1A]/10 flex items-baseline gap-3">
                <span className="font-serif text-2xl font-semibold text-[#4A2C1A]">
                  Rs {(activePrice * quantity).toLocaleString()}
                </span>
                <span className="text-xs text-[#4A2C1A]/60">
                  (Rs {activePrice.toLocaleString()} per jar)
                </span>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#4A2C1A]/80 font-light leading-relaxed mt-4">
                {product.fullDesc}
              </p>

              {/* Weight Selector */}
              <div className="mt-5 space-y-2">
                <span className="text-[11px] uppercase tracking-wider text-[#4A2C1A]/60 block font-medium">
                  Select Size
                </span>
                <div className="flex items-center gap-2">
                  {product.weightOptions.map((opt) => (
                    <button
                      key={opt.weight}
                      onClick={() => setSelectedWeight(opt.weight)}
                      className={`text-xs px-3.5 py-1.5 uppercase tracking-wider font-medium border transition-colors cursor-pointer ${
                        selectedWeight === opt.weight
                          ? 'border-[#4A2C1A] bg-[#4A2C1A] text-[#F5F1EB]'
                          : 'border-[#4A2C1A]/20 bg-transparent text-[#4A2C1A]/70 hover:border-[#4A2C1A]/50'
                      }`}
                    >
                      {opt.weight} — Rs {opt.price.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ingredients List */}
              <div className="mt-5 space-y-2">
                <span className="text-[11px] uppercase tracking-wider text-[#4A2C1A]/60 block font-medium">
                  Artisanal Ingredients
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {product.ingredients.map((ing, i) => (
                    <span
                      key={i}
                      className="text-[11px] bg-[#EDE7DD] text-[#4A2C1A] border border-[#4A2C1A]/15 px-2.5 py-1"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-[#4A2C1A]/10 flex items-center gap-3">
              {/* Quantity */}
              <div className="flex items-center border border-[#4A2C1A]/20 bg-[#EDE7DD]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-xs font-bold text-[#4A2C1A] hover:bg-[#4A2C1A]/10 cursor-pointer"
                >
                  -
                </button>
                <span className="px-3 py-2 text-xs font-medium text-[#4A2C1A]">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-xs font-bold text-[#4A2C1A] hover:bg-[#4A2C1A]/10 cursor-pointer"
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={added}
                className={`flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-medium tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                  added
                    ? 'bg-emerald-800 text-white'
                    : 'bg-[#4A2C1A] hover:bg-[#341d10] text-[#F5F1EB] shadow-xs hover:shadow-md'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Pantry Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Pantry Bag</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

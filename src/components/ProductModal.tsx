import React, { useState } from 'react';
import { Product } from '../types';
import { X, Star, ShoppingBag, MessageCircle, ShieldCheck, Heart, Sparkles, ArrowLeft } from 'lucide-react';
import { formatPKR, generateSingleProductWhatsAppUrl } from '../utils/whatsapp';

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
    }, 700);
  };

  const whatsAppUrl = generateSingleProductWhatsAppUrl(
    product,
    selectedWeight,
    activePrice,
    quantity
  );

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
    >
      {/* Modal Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-[32px] max-w-3xl w-full overflow-hidden shadow-2xl border border-[#D4AF37]/50 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Top-Left Back Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/95 hover:bg-[#0A0A0A] text-[#0A0A0A] hover:text-[#D4AF37] transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg border-2 border-[#D4AF37] text-xs sm:text-sm font-bold group"
          aria-label="Back to products"
        >
          <ArrowLeft className="w-4 h-4 text-[#D4AF37] group-hover:-translate-x-1 transition-transform" />
          <span>&lt; Back to Products</span>
          <span className="hidden sm:inline text-[11px] text-stone-500 group-hover:text-stone-300 font-medium">
            (ہوم پیج)
          </span>
        </button>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/95 hover:bg-[#0A0A0A] text-[#0A0A0A] hover:text-[#D4AF37] transition-colors cursor-pointer shadow-md border border-stone-300"
          aria-label="Close product view"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Product Image Column */}
          <div className="relative bg-stone-100 min-h-[300px] md:min-h-full">
            <img
              src={product.image || '/src/assets/images/product_pure_sidr_honey_1791803704705.jpg'}
              alt={product.name}
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.src = '/src/assets/images/product_pure_sidr_honey_1791803704705.jpg';
              }}
              className="w-full h-full object-cover object-center"
            />
            {/* Badges - positioned cleanly below the back button */}
            <div className="absolute top-16 left-4 flex flex-col gap-1.5 items-start z-10">
              {product.featured && (
                <span className="bg-[#0A0A0A]/95 text-[#D4AF37] text-xs font-bold px-3 py-1 rounded-full border border-[#D4AF37] shadow-xs flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                  Featured
                </span>
              )}
              {product.badge && (
                <span className="bg-white/95 text-[#0A0A0A] text-xs font-bold px-3 py-1 rounded-full border border-[#D4AF37]/50 shadow-xs">
                  {product.badge}
                </span>
              )}
            </div>
          </div>

          {/* Details Column */}
          <div className="p-6 md:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto text-left">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                <span className="uppercase tracking-wider font-bold text-[#0A0A0A]">
                  {product.category === 'honey'
                    ? 'Pure Honey (شہد)'
                    : product.category === 'achar'
                    ? 'Traditional Achar (اچار)'
                    : 'Lazeez Murabba (مربہ)'}
                </span>
                <div className="flex items-center gap-1 text-[#0A0A0A] font-semibold bg-stone-50 px-2.5 py-0.5 rounded-full border border-[#D4AF37]/30">
                  <Star className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                  <span className="tabular-nums font-bold">{product.rating}</span>
                  <span className="text-stone-400">({product.reviewCount})</span>
                </div>
              </div>

              {/* Title & Urdu Name */}
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0A0A0A] leading-snug">
                {product.name}
              </h2>
              <p className="text-sm font-semibold text-[#D4AF37] font-serif mb-4">
                {product.urduName}
              </p>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-4 pb-4 border-b border-stone-200">
                <span className="font-serif text-3xl font-bold text-[#0A0A0A] tabular-nums">
                  {formatPKR(activePrice * quantity)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-stone-400 line-through tabular-nums">
                    {formatPKR(product.originalPrice * quantity)}
                  </span>
                )}
                <span className="text-xs text-[#0A0A0A] font-semibold bg-stone-50 border border-[#D4AF37]/40 px-3 py-1 rounded-full ml-auto">
                  100% Khalis & Raw
                </span>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-5">
                {product.fullDesc}
              </p>

              {/* Health Benefits */}
              <div className="mb-5">
                <h4 className="text-xs font-bold text-[#0A0A0A] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-[#B91C1C]" />
                  <span>Key Natural Benefits:</span>
                </h4>
                <ul className="space-y-1.5">
                  {product.benefits.map((benefit, i) => (
                    <li key={i} className="text-xs text-stone-700 flex items-start gap-2">
                      <span className="text-[#D4AF37] font-bold shrink-0 mt-0.5">✓</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Ingredients */}
              <div className="mb-6">
                <h4 className="text-xs font-bold text-[#0A0A0A] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Pure Ingredients:</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {product.ingredients.map((ing, i) => (
                    <span
                      key={i}
                      className="text-xs bg-stone-50 text-[#0A0A0A] border border-[#D4AF37]/30 px-3 py-1 rounded-full font-medium"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>

              {/* Jar Size Selector */}
              <div className="mb-5">
                <label className="text-xs font-bold text-stone-600 uppercase tracking-wider block mb-2">
                  Choose Jar Size:
                </label>
                <div className="flex gap-2">
                  {product.weightOptions.map((opt) => (
                    <button
                      key={opt.weight}
                      onClick={() => setSelectedWeight(opt.weight)}
                      className={`flex-1 py-2 px-3 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                        selectedWeight === opt.weight
                          ? 'bg-[#0A0A0A] text-[#D4AF37] border-[#D4AF37] shadow-xs'
                          : 'bg-stone-50 text-[#0A0A0A] border-stone-200 hover:border-[#D4AF37]/40'
                      }`}
                    >
                      <div>{opt.weight}</div>
                      <div className="text-[11px] opacity-80 tabular-nums">
                        {formatPKR(opt.price)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-6">
                <label className="text-xs font-bold text-stone-600 uppercase tracking-wider">
                  Quantity:
                </label>
                <div className="flex items-center border border-stone-200 rounded-full overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-1.5 text-[#0A0A0A] hover:bg-stone-100 text-sm font-bold cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-xs font-bold text-[#0A0A0A] tabular-nums min-w-[2.5rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3.5 py-1.5 text-[#0A0A0A] hover:bg-stone-100 text-sm font-bold cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2 border-t border-stone-200">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  className={`flex items-center justify-center gap-2 py-3.5 px-4 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                    added
                      ? 'bg-[#D4AF37] text-[#0A0A0A] border-[#D4AF37]'
                      : 'bg-[#0A0A0A] hover:bg-[#1A1A1A] text-white hover:text-[#D4AF37] border-[#D4AF37]/50 shadow-xs'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                  <span>{added ? 'Added to Cart!' : 'Add to Cart'}</span>
                </button>

                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-full text-xs font-bold bg-[#D4AF37] hover:bg-[#F9E498] text-[#0A0A0A] shadow-xs transition-colors border border-[#AA8010]"
                >
                  <MessageCircle className="w-4 h-4 fill-[#0A0A0A] text-[#0A0A0A]" />
                  <span>Order on WhatsApp</span>
                </a>
              </div>

              {/* Bottom Return to Store Button */}
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-[#0A0A0A] font-semibold text-xs rounded-full flex items-center justify-center gap-2 border border-stone-300 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#0A0A0A]" />
                <span>← واپس پروڈکٹس پر جائیں (Back to Products)</span>
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500 pt-1 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Safely packaged in sanitized food-grade glass jars.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

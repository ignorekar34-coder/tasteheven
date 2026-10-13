import React, { useState } from 'react';
import { Product } from '../types';
import { X, Star, ShoppingBag, MessageCircle, ShieldCheck, Heart, Sparkles } from 'lucide-react';
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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      {/* Modal Container */}
      <div className="relative bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer shadow-xs"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Product Image Column */}
          <div className="relative bg-stone-50 min-h-[300px] md:min-h-full">
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 bg-emerald-900 text-amber-100 text-xs font-semibold px-3 py-1 rounded-md shadow-xs">
                {product.badge}
              </span>
            )}
          </div>

          {/* Details Column */}
          <div className="p-6 md:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto text-left">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                <span className="uppercase tracking-wider font-semibold text-amber-700">
                  {product.category === 'honey'
                    ? 'Pure Honey (شہد)'
                    : product.category === 'achar'
                    ? 'Traditional Achar (اچار)'
                    : 'Lazeez Murabba (مربہ)'}
                </span>
                <div className="flex items-center gap-1 text-stone-700 font-semibold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="tabular-nums">{product.rating}</span>
                  <span className="text-stone-400">({product.reviewCount} reviews)</span>
                </div>
              </div>

              {/* Title & Urdu Name */}
              <h2 className="font-serif text-2xl font-bold text-stone-900 leading-snug">
                {product.name}
              </h2>
              <p className="text-sm font-medium text-amber-800 font-serif mb-4">
                {product.urduName}
              </p>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-4 pb-4 border-b border-stone-200">
                <span className="font-serif text-3xl font-bold text-stone-900 tabular-nums">
                  {formatPKR(activePrice * quantity)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-stone-400 line-through tabular-nums">
                    {formatPKR(product.originalPrice * quantity)}
                  </span>
                )}
                <span className="text-xs text-emerald-800 font-medium bg-emerald-50 px-2.5 py-0.5 rounded ml-auto">
                  100% Purity Certified
                </span>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-5">
                {product.fullDesc}
              </p>

              {/* Health Benefits */}
              <div className="mb-5">
                <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-amber-600" />
                  <span>Key Natural Benefits:</span>
                </h4>
                <ul className="space-y-1.5">
                  {product.benefits.map((benefit, i) => (
                    <li key={i} className="text-xs text-stone-600 flex items-start gap-2">
                      <span className="text-emerald-700 font-bold shrink-0 mt-0.5">✓</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Ingredients */}
              <div className="mb-6">
                <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Pure Ingredients:</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {product.ingredients.map((ing, i) => (
                    <span
                      key={i}
                      className="text-xs bg-stone-100 text-stone-700 px-2.5 py-1 rounded-md"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>

              {/* Jar Size Selector */}
              <div className="mb-5">
                <label className="text-xs font-semibold text-stone-900 uppercase tracking-wider block mb-2">
                  Choose Jar Size:
                </label>
                <div className="flex gap-2">
                  {product.weightOptions.map((opt) => (
                    <button
                      key={opt.weight}
                      onClick={() => setSelectedWeight(opt.weight)}
                      className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        selectedWeight === opt.weight
                          ? 'bg-emerald-950 text-amber-100 border-emerald-950 shadow-xs'
                          : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
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
                <label className="text-xs font-semibold text-stone-900 uppercase tracking-wider">
                  Quantity:
                </label>
                <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-stone-600 hover:bg-stone-100 text-sm font-bold cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-xs font-semibold text-stone-900 tabular-nums min-w-[2.5rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1.5 text-stone-600 hover:bg-stone-100 text-sm font-bold cursor-pointer"
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
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    added
                      ? 'bg-emerald-700 text-white'
                      : 'bg-emerald-900 hover:bg-emerald-800 text-amber-100 shadow-xs'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4 text-amber-300" />
                  <span>{added ? 'Added to Cart!' : 'Add to Cart'}</span>
                </button>

                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-xs transition-colors"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Order on WhatsApp</span>
                </a>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>Safely packaged in sanitized food-grade glass jars.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

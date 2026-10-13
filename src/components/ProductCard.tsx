import React, { useState } from 'react';
import { Product } from '../types';
import { ShoppingBag, MessageCircle, Eye, Star, Check } from 'lucide-react';
import { formatPKR, generateSingleProductWhatsAppUrl } from '../utils/whatsapp';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, weight: string, price: number) => void;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
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
    <div className="group bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col text-left">
      {/* Product Image Container */}
      <div className="relative aspect-4/3 bg-stone-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs border border-stone-200 text-stone-900 text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-2xs">
            {product.badge}
          </div>
        )}

        {/* Quick View Floating Button */}
        <button
          onClick={() => onQuickView(product)}
          className="absolute top-3 right-3 p-2 bg-white/95 backdrop-blur-xs text-stone-700 hover:text-emerald-900 hover:bg-white rounded-lg shadow-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
          title="Quick View Details"
          aria-label="Quick View Details"
        >
          <Eye className="w-4 h-4" />
        </button>

        {/* Stock status indicator */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-stone-900 text-white text-xs font-bold px-3 py-1 rounded-md">
              Sold Out (Restocking Soon)
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata: Category and Rating (Zero-pill discipline) */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span className="uppercase tracking-wider font-semibold text-[11px] text-amber-700">
              {product.category === 'honey' ? 'Pure Honey' : product.category === 'achar' ? 'Spicy Achar' : 'Murabba'}
            </span>
            <div className="flex items-center gap-1 font-medium text-stone-700">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="tabular-nums font-semibold">{product.rating}</span>
              <span className="text-stone-400">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Titles */}
          <h3
            onClick={() => onQuickView(product)}
            className="font-serif text-lg font-bold text-stone-900 hover:text-emerald-800 transition-colors cursor-pointer line-clamp-1"
          >
            {product.name}
          </h3>
          <p className="text-xs font-medium text-amber-800 font-serif mb-2">
            {product.urduName}
          </p>

          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-4">
            {product.shortDesc}
          </p>
        </div>

        <div>
          {/* Weight Selection Chips */}
          <div className="mb-4">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block mb-1.5">
              Select Jar Size:
            </span>
            <div className="flex items-center gap-2">
              {product.weightOptions.map((opt) => (
                <button
                  key={opt.weight}
                  onClick={() => setSelectedWeight(opt.weight)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md border transition-colors cursor-pointer ${
                    selectedWeight === opt.weight
                      ? 'bg-emerald-950 text-amber-100 border-emerald-950 shadow-2xs'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {opt.weight}
                </button>
              ))}
            </div>
          </div>

          {/* Price Row (Tabular Numerals) */}
          <div className="flex items-baseline justify-between pt-2 border-t border-stone-100 mb-4">
            <div>
              <span className="font-serif text-xl font-bold text-stone-900 tabular-nums">
                {formatPKR(activePrice)}
              </span>
              {product.originalPrice && (
                <span className="ml-2 text-xs text-stone-400 line-through tabular-nums">
                  {formatPKR(product.originalPrice)}
                </span>
              )}
            </div>
            <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
              Glass Jar
            </span>
          </div>

          {/* Action Buttons: Add to Cart + WhatsApp */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleAdd}
              disabled={!product.inStock}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                justAdded
                  ? 'bg-emerald-700 text-white'
                  : 'bg-emerald-900 hover:bg-emerald-800 text-amber-100 active:scale-98 shadow-xs'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>

            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold bg-[#25D366] hover:bg-[#20bd5a] text-white active:scale-98 transition-all shadow-xs"
              title="Order on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

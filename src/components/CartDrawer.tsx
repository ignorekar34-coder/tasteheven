import React, { useState } from 'react';
import { CartItem, OrderRecord } from '../types';
import { X, Trash2, ShoppingBag, MessageCircle, ArrowRight, ShieldCheck, Sparkles, ArrowLeft } from 'lucide-react';
import { formatPKR, generateCartWhatsAppUrl, OrderCustomerInfo } from '../utils/whatsapp';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, weight: string, newQty: number) => void;
  onRemoveItem: (productId: string, weight: string) => void;
  onClearCart: () => void;
  onOrderPlaced?: (order: OrderRecord) => void;
}

const FREE_SHIPPING_THRESHOLD = 3500;
const STANDARD_SHIPPING_FEE = 250;

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOrderPlaced,
}) => {
  if (!isOpen) return null;

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [customer, setCustomer] = useState<OrderCustomerInfo>({
    name: '',
    phone: '',
    city: 'Lahore',
    address: '',
    notes: '',
  });

  const subtotal = items.reduce(
    (sum, item) => sum + item.selectedPrice * item.quantity,
    0
  );

  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingFee = items.length === 0 ? 0 : isFreeShipping ? 0 : STANDARD_SHIPPING_FEE;
  const grandTotal = subtotal + shippingFee;
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const whatsAppCheckoutUrl = generateCartWhatsAppUrl(
    items,
    subtotal,
    shippingFee,
    showAddressForm && customer.name ? customer : undefined
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-stone-900/50 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-stone-200">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#0A0A0A]/10 flex items-center justify-between bg-stone-50">
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-200/80 hover:bg-stone-300 text-[#0A0A0A] text-xs font-semibold transition-colors cursor-pointer mr-1"
                title="Back to Store"
                aria-label="Back to Store"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#0A0A0A]" />
                <span>واپس (Back)</span>
              </button>
              <ShoppingBag className="w-5 h-5 text-[#0A0A0A]" />
              <h2 className="font-serif text-lg sm:text-xl font-bold text-[#0A0A0A]">
                Your Cart
              </h2>
              <span className="text-xs bg-[#D4AF37] text-[#0A0A0A] font-bold px-2.5 py-0.5 rounded-full border border-[#AA8010] tabular-nums">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-stone-500 hover:text-black hover:bg-stone-200 transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          {items.length > 0 && (
            <div className="bg-stone-100 border-b border-stone-200 p-3 sm:px-5">
              <div className="flex items-center justify-between text-xs font-semibold text-[#0A0A0A] mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  {isFreeShipping ? (
                    <span className="text-[#0A0A0A] font-bold">
                      🎉 You have unlocked FREE Nationwide Delivery!
                    </span>
                  ) : (
                    <span>
                      Add <strong className="tabular-nums text-[#D4AF37]">{formatPKR(amountToFreeShipping)}</strong> more for FREE Delivery!
                    </span>
                  )}
                </span>
              </div>
              <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden border border-stone-300">
                <div
                  className="bg-[#0A0A0A] h-full rounded-full transition-all duration-300"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Item List / Empty State */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-500">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-lg font-bold text-stone-800 mb-1">
                  Your cart is empty
                </h3>
                <p className="text-xs text-stone-500 max-w-xs mb-6">
                  Add pure honey, spicy mango achar, or delicious murabba jars to begin your order.
                </p>
                <button
                  onClick={onClose}
                  className="flex items-center gap-2 px-6 py-3 bg-[#0A0A0A] hover:bg-[#1A1A1A] text-[#D4AF37] border border-[#D4AF37] text-xs font-bold rounded-full shadow-md transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 text-[#D4AF37]" />
                  <span>← واپس شاپنگ پر جائیں (Continue Shopping)</span>
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedWeight}`}
                  className="flex gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200/80 text-left"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.product.image || '/src/assets/images/product_pure_sidr_honey_1791803704705.jpg'}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = '/src/assets/images/product_pure_sidr_honey_1791803704705.jpg';
                    }}
                    className="w-16 h-16 rounded-lg object-cover bg-stone-200 shrink-0 border border-stone-200"
                  />

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="truncate">
                        <h4 className="text-xs sm:text-sm font-bold text-stone-900 truncate">
                          {item.product.name}
                        </h4>
                        <div className="text-[11px] text-stone-500 flex items-center gap-2 mt-0.5">
                          <span>Size: {item.selectedWeight}</span>
                          <span>·</span>
                          <span className="font-medium text-emerald-800 tabular-nums">
                            {formatPKR(item.selectedPrice)} each
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => onRemoveItem(item.product.id, item.selectedWeight)}
                        className="text-stone-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Quantity Stepper & Item Total */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-stone-300 rounded-md bg-white">
                        <button
                          onClick={() =>
                            onUpdateQuantity(
                              item.product.id,
                              item.selectedWeight,
                              item.quantity - 1
                            )
                          }
                          className="px-2 py-0.5 text-stone-600 hover:bg-stone-100 text-xs font-bold cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-semibold text-stone-900 tabular-nums min-w-[1.5rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            onUpdateQuantity(
                              item.product.id,
                              item.selectedWeight,
                              item.quantity + 1
                            )
                          }
                          className="px-2 py-0.5 text-stone-600 hover:bg-stone-100 text-xs font-bold cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <span className="font-serif font-bold text-sm text-stone-900 tabular-nums">
                        {formatPKR(item.selectedPrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Optional Customer Information Form for WhatsApp invoice */}
            {items.length > 0 && (
              <div className="pt-2">
                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="w-full text-left py-2 px-3 text-xs font-semibold text-emerald-950 bg-stone-100 hover:bg-stone-200/80 rounded-lg flex items-center justify-between cursor-pointer"
                >
                  <span>
                    {showAddressForm
                      ? '▼ Hide Delivery Address Details'
                      : '▶ Add Delivery Address (Recommended)'}
                  </span>
                  <span className="text-[10px] text-stone-500 font-normal">
                    {showAddressForm ? 'Will be included' : 'Click to add'}
                  </span>
                </button>

                {showAddressForm && (
                  <div className="mt-3 p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-2.5 text-left text-xs">
                    <div>
                      <label className="block text-stone-600 font-medium mb-1">
                        Full Name:
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Asad Khan"
                        value={customer.name}
                        onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                        className="w-full p-2 bg-white border border-stone-300 rounded-md focus:outline-none focus:border-amber-600"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-stone-600 font-medium mb-1">
                          Phone Number:
                        </label>
                        <input
                          type="tel"
                          placeholder="0300-1234567"
                          value={customer.phone}
                          onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                          className="w-full p-2 bg-white border border-stone-300 rounded-md focus:outline-none focus:border-amber-600"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-600 font-medium mb-1">
                          City:
                        </label>
                        <input
                          type="text"
                          placeholder="Lahore / Karachi"
                          value={customer.city}
                          onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                          className="w-full p-2 bg-white border border-stone-300 rounded-md focus:outline-none focus:border-amber-600"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-stone-600 font-medium mb-1">
                        Street Address:
                      </label>
                      <input
                        type="text"
                        placeholder="House / Street / Area"
                        value={customer.address}
                        onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                        className="w-full p-2 bg-white border border-stone-300 rounded-md focus:outline-none focus:border-amber-600"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer with Calculations and WhatsApp Checkout CTA */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-[#0A0A0A]/10 bg-stone-50 space-y-3">
              {/* Financial Breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal:</span>
                  <span className="font-semibold tabular-nums text-[#0A0A0A]">
                    {formatPKR(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Delivery Charges:</span>
                  <span className="font-semibold tabular-nums">
                    {isFreeShipping ? (
                      <span className="text-[#0A0A0A] font-bold">FREE</span>
                    ) : (
                      formatPKR(shippingFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#0A0A0A] pt-2 border-t border-stone-200">
                  <span>Grand Total (COD):</span>
                  <span className="font-serif text-xl text-[#0A0A0A] tabular-nums font-bold">
                    {formatPKR(grandTotal)}
                  </span>
                </div>
              </div>

              {/* EasyPaisa Payment Note */}
              <div className="bg-white border border-[#D4AF37]/40 rounded-2xl p-2.5 text-[11px] text-[#0A0A0A] flex items-center justify-between">
                <span>
                  <strong>EasyPaisa:</strong> 0324-8314001
                </span>
                <span className="text-stone-500 font-semibold">Or Cash on Delivery</span>
              </div>

              {/* Order via WhatsApp Action Button (Luxury Gold & Black) */}
              <a
                href={whatsAppCheckoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  if (onOrderPlaced) {
                    const newOrder: OrderRecord = {
                      id: `ord-${Date.now()}`,
                      orderNumber: `TH-${Math.floor(1000 + Math.random() * 9000)}`,
                      customerName: customer.name || 'WhatsApp Customer',
                      customerPhone: customer.phone || '0300-XXXXXXX',
                      city: customer.city || 'Pakistan',
                      address: customer.address || 'Shared via WhatsApp chat',
                      items: [...items],
                      subtotal,
                      shippingFee,
                      total: grandTotal,
                      status: 'pending',
                      createdAt: new Date().toLocaleString(),
                      notes: customer.notes,
                    };
                    onOrderPlaced(newOrder);
                  }
                }}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-[#D4AF37] hover:bg-[#F9E498] text-[#0A0A0A] text-sm font-bold rounded-full shadow-md transition-all border border-[#AA8010]"
              >
                <MessageCircle className="w-5 h-5 fill-[#0A0A0A] text-[#0A0A0A]" />
                <span>Complete Order on WhatsApp</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </a>

              {/* Continue Shopping / Back to Shop Button */}
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-[#0A0A0A] font-semibold text-xs rounded-full flex items-center justify-center gap-1.5 border border-stone-300 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#0A0A0A]" />
                <span>← شاپنگ جاری رکھیں (Continue Shopping)</span>
              </button>

              <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0A0A0A]" />
                  <span>Cash on Delivery (COD)</span>
                </div>
                <button
                  onClick={onClearCart}
                  className="text-stone-400 hover:text-black underline cursor-pointer"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

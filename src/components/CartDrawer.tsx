import React, { useState } from 'react';
import { CartItem, OrderRecord } from '../types';
import { X, Trash2, ShoppingBag, MessageCircle, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
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
          <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-900" />
              <h2 className="font-serif text-lg font-bold text-stone-900">
                Your Shopping Cart
              </h2>
              <span className="text-xs bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full tabular-nums">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          {items.length > 0 && (
            <div className="bg-amber-50/80 border-b border-amber-200/60 p-3 sm:px-5">
              <div className="flex items-center justify-between text-xs font-semibold text-amber-900 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                  {isFreeShipping ? (
                    <span className="text-emerald-800 font-bold">
                      🎉 Congratulations! You have unlocked FREE Delivery!
                    </span>
                  ) : (
                    <span>
                      Add <strong className="tabular-nums">{formatPKR(amountToFreeShipping)}</strong> more for FREE Delivery!
                    </span>
                  )}
                </span>
              </div>
              <div className="w-full bg-amber-200/70 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-700 h-full rounded-full transition-all duration-300"
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
                  className="px-5 py-2.5 bg-emerald-900 hover:bg-emerald-800 text-amber-100 text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Explore Pure Pantry
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
                    src={item.product.image}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
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
            <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50/70 space-y-3">
              {/* Financial Breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal:</span>
                  <span className="font-semibold tabular-nums text-stone-900">
                    {formatPKR(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Delivery Charges:</span>
                  <span className="font-semibold tabular-nums">
                    {isFreeShipping ? (
                      <span className="text-emerald-700 font-bold">FREE</span>
                    ) : (
                      formatPKR(shippingFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-stone-900 pt-2 border-t border-stone-200">
                  <span>Grand Total (COD):</span>
                  <span className="font-serif text-lg text-emerald-950 tabular-nums">
                    {formatPKR(grandTotal)}
                  </span>
                </div>
              </div>

              {/* EasyPaisa Payment Note */}
              <div className="bg-emerald-50 border border-emerald-200/80 rounded-lg p-2.5 text-[11px] text-emerald-950 flex items-center justify-between">
                <span>
                  <strong>EasyPaisa:</strong> 0324-8314001
                </span>
                <span className="text-emerald-700 font-medium">Or Cash on Delivery</span>
              </div>

              {/* Order via WhatsApp Action Button */}
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
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-semibold rounded-xl shadow-xs transition-colors"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>Complete Order on WhatsApp</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </a>

              <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Cash on Delivery (COD)</span>
                </div>
                <button
                  onClick={onClearCart}
                  className="text-stone-400 hover:text-stone-700 underline cursor-pointer"
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

import React, { useState } from 'react';
import { CartItem, OrderRecord } from '../types';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Sparkles, Check } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../data/products';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, weight: string, newQty: number) => void;
  onRemoveItem: (productId: string, weight: string) => void;
  onClearCart: () => void;
  onOrderPlaced?: (order: OrderRecord) => void;
}

const FREE_SHIPPING_THRESHOLD = 999;
const STANDARD_SHIPPING_FEE = 80;

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
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    city: 'Pune',
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

  const handleCheckout = () => {
    // Generate order record
    const newOrder: OrderRecord = {
      id: `mp-${Date.now().toString().slice(-6)}`,
      orderNumber: `MP-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
      customerName: customer.name || 'Atelier Patron',
      customerPhone: customer.phone || 'Inquiry',
      city: customer.city || 'Pune',
      address: customer.address || 'Direct Dispatch',
      items: items,
      subtotal,
      shippingFee,
      total: grandTotal,
      status: 'pending',
      notes: customer.notes || '',
    };

    if (onOrderPlaced) {
      onOrderPlaced(newOrder);
    }

    // Direct WhatsApp message
    const orderItemsSummary = items
      .map((it) => `• ${it.product.name} (${it.selectedWeight}) x${it.quantity} = Rs ${(it.selectedPrice * it.quantity).toLocaleString()}`)
      .join('\n');

    const message = encodeURIComponent(
      `*NEW ORDER — MERAKI PANTRY PUNE*\n\n` +
      `*Patron:* ${customer.name || 'Customer'}\n` +
      `*Phone:* ${customer.phone || 'N/A'}\n` +
      `*City:* ${customer.city}\n` +
      `*Address:* ${customer.address || 'To be shared'}\n\n` +
      `*Preserves Ordered:*\n${orderItemsSummary}\n\n` +
      `*Subtotal:* Rs ${subtotal.toLocaleString()}\n` +
      `*Courier:* ${shippingFee === 0 ? 'COMPLIMENTARY' : `Rs ${shippingFee}`}\n` +
      `*Total Payable:* Rs ${grandTotal.toLocaleString()}\n\n` +
      `Please confirm batch bottling and dispatch date.`
    );

    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    window.open(waUrl, '_blank');

    setOrderSuccess(true);
    setTimeout(() => {
      onClearCart();
      setOrderSuccess(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden text-[#4A2C1A]">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#381F12]/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F5] border-l border-[#4A2C1A]/15 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-6 border-b border-[#4A2C1A]/10 flex items-center justify-between bg-[#F5F1EB]">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-4 h-4 text-[#4A2C1A]" />
              <h3 className="font-serif text-xl font-normal tracking-tight text-[#4A2C1A]">
                Pantry Bag
              </h3>
              <span className="text-xs px-2 py-0.5 bg-[#4A2C1A]/10 text-[#4A2C1A] font-medium">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-[#4A2C1A]/70 hover:text-[#4A2C1A] hover:bg-[#4A2C1A]/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Complimentary Courier Progress Banner */}
          <div className="bg-[#EDE7DD] px-6 py-3 border-b border-[#4A2C1A]/10 text-xs">
            {isFreeShipping ? (
              <p className="font-medium text-[#4A2C1A] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#C46835]" />
                <span>Your order qualifies for complimentary Pune courier!</span>
              </p>
            ) : (
              <div>
                <p className="text-[#4A2C1A]/80 mb-1.5">
                  Add <strong className="text-[#4A2C1A]">Rs {amountToFreeShipping.toLocaleString()}</strong> more for complimentary courier.
                </p>
                <div className="w-full bg-[#4A2C1A]/10 h-1.5 overflow-hidden">
                  <div
                    className="bg-[#4A2C1A] h-full transition-all duration-300"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#EDE7DD] flex items-center justify-center text-[#4A2C1A]/40 mb-2">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <h4 className="font-serif text-lg font-normal text-[#4A2C1A]">
                  Your pantry bag is empty
                </h4>
                <p className="text-xs text-[#4A2C1A]/60 max-w-xs font-light">
                  Explore our small-batch mango pickles and apple murabba preserves to begin.
                </p>
                <button
                  onClick={onClose}
                  className="mt-4 px-6 py-2.5 bg-[#4A2C1A] text-[#F5F1EB] text-xs uppercase tracking-wider font-medium hover:bg-[#341d10] cursor-pointer"
                >
                  Explore Pantry
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedWeight}`}
                  className="flex gap-4 p-3.5 bg-[#F5F1EB] border border-[#4A2C1A]/10 text-left items-center"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover bg-[#EDE7DD] shrink-0"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <h5 className="font-serif text-sm font-normal text-[#4A2C1A] truncate">
                      {item.product.name}
                    </h5>
                    <p className="text-[11px] text-[#4A2C1A]/60 uppercase tracking-wider">
                      {item.selectedWeight} · Rs {item.selectedPrice.toLocaleString()}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-[#4A2C1A]/20 bg-[#FAF8F5]">
                        <button
                          onClick={() =>
                            onUpdateQuantity(
                              item.product.id,
                              item.selectedWeight,
                              item.quantity - 1
                            )
                          }
                          className="px-2 py-0.5 text-xs text-[#4A2C1A] hover:bg-[#4A2C1A]/10 cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-2.5 text-xs font-medium text-[#4A2C1A]">
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
                          className="px-2 py-0.5 text-xs text-[#4A2C1A] hover:bg-[#4A2C1A]/10 cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.product.id, item.selectedWeight)}
                        className="text-[#4A2C1A]/50 hover:text-red-800 transition-colors cursor-pointer"
                        title="Remove preserve"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Optional Patron Dispatch Details Form */}
            {items.length > 0 && (
              <div className="pt-2">
                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="w-full text-left py-2 px-3 text-xs font-medium text-[#4A2C1A] bg-[#EDE7DD] hover:bg-[#E4DCCE] flex items-center justify-between cursor-pointer border border-[#4A2C1A]/10"
                >
                  <span>
                    {showAddressForm
                      ? '− Hide Dispatch Details'
                      : '+ Add Dispatch Details (Optional)'}
                  </span>
                  <span className="text-[11px] text-[#4A2C1A]/60">
                    {showAddressForm ? 'Included' : 'Click to add'}
                  </span>
                </button>

                {showAddressForm && (
                  <div className="mt-3 p-4 bg-[#F5F1EB] border border-[#4A2C1A]/15 space-y-3 text-left text-xs">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#4A2C1A]/70 mb-1">
                        Patron Name:
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Radhika Apte"
                        value={customer.name}
                        onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                        className="w-full p-2 bg-[#FAF8F5] border border-[#4A2C1A]/20 outline-none text-[#4A2C1A] text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-[#4A2C1A]/70 mb-1">
                          Phone / WhatsApp:
                        </label>
                        <input
                          type="tel"
                          placeholder="9876543210"
                          value={customer.phone}
                          onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                          className="w-full p-2 bg-[#FAF8F5] border border-[#4A2C1A]/20 outline-none text-[#4A2C1A] text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-[#4A2C1A]/70 mb-1">
                          City:
                        </label>
                        <input
                          type="text"
                          placeholder="Pune / Mumbai"
                          value={customer.city}
                          onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                          className="w-full p-2 bg-[#FAF8F5] border border-[#4A2C1A]/20 outline-none text-[#4A2C1A] text-xs"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#4A2C1A]/70 mb-1">
                        Delivery Address:
                      </label>
                      <input
                        type="text"
                        placeholder="Apartment / Street / Area"
                        value={customer.address}
                        onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                        className="w-full p-2 bg-[#FAF8F5] border border-[#4A2C1A]/20 outline-none text-[#4A2C1A] text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Checkout Breakdown */}
          {items.length > 0 && (
            <div className="p-6 border-t border-[#4A2C1A]/10 bg-[#F5F1EB] space-y-4">
              <div className="space-y-1.5 text-xs text-[#4A2C1A]/80">
                <div className="flex justify-between">
                  <span>Preserves Subtotal:</span>
                  <span className="font-semibold text-[#4A2C1A]">Rs {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Courier & Packaging:</span>
                  <span className="font-semibold text-[#4A2C1A]">
                    {isFreeShipping ? 'COMPLIMENTARY' : `Rs ${shippingFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-serif pt-2 border-t border-[#4A2C1A]/10 text-[#4A2C1A]">
                  <span>Total Payable:</span>
                  <span className="font-semibold">Rs {grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={orderSuccess}
                className={`w-full py-3.5 text-xs uppercase tracking-wider font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  orderSuccess
                    ? 'bg-emerald-800 text-white'
                    : 'bg-[#4A2C1A] hover:bg-[#341d10] text-[#F5F1EB] shadow-sm hover:shadow-md'
                }`}
              >
                {orderSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Order Transmitted to Atelier</span>
                  </>
                ) : (
                  <>
                    <span>Complete Order via WhatsApp</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

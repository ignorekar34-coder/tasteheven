import React, { useState } from 'react';
import { X, CheckCircle, MessageCircle, MapPin, Phone, User, ShoppingBag, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import { Product, OrderRecord } from '../types';

interface OrderNowModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProduct: Product | null;
  allProducts: Product[];
  onOrderPlaced: (order: OrderRecord) => void;
}

const WHATSAPP_PHONE = '923248314001';

export const OrderNowModal: React.FC<OrderNowModalProps> = ({
  isOpen,
  onClose,
  selectedProduct,
  allProducts,
  onOrderPlaced,
}) => {
  const [product, setProduct] = useState<Product | null>(selectedProduct);
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<OrderRecord | null>(null);

  // Sync selectedProduct if prop changes
  React.useEffect(() => {
    if (selectedProduct) {
      setProduct(selectedProduct);
      setQuantity(1);
      setIsSubmitted(false);
      setSubmittedOrder(null);
    } else if (allProducts.length > 0 && !product) {
      setProduct(allProducts[0]);
    }
  }, [selectedProduct, allProducts]);

  if (!isOpen) return null;

  const currentProd = product || allProducts[0];
  const unitPrice = currentProd?.price || 650;
  const totalPrice = unitPrice * quantity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !address.trim() || !currentProd) {
      return;
    }

    const orderId = `TH-${Date.now().toString().slice(-6)}`;
    const newOrder: OrderRecord = {
      id: orderId,
      orderNumber: orderId,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      city: 'Lahore',
      address: address.trim(),
      items: [
        {
          product: currentProd,
          selectedWeight: currentProd.weight || '500g',
          selectedPrice: unitPrice,
          quantity: quantity,
        },
      ],
      subtotal: totalPrice,
      shippingFee: 0, // Free Cash on Delivery in Lahore
      total: totalPrice,
      status: 'pending',
      createdAt: new Date().toISOString(),
      notes: notes.trim() || undefined,
    };

    onOrderPlaced(newOrder);
    setSubmittedOrder(newOrder);
    setIsSubmitted(true);
  };

  const getWhatsAppReceiptUrl = (order: OrderRecord) => {
    const text = `As-salamu Alaikum! Naya Order Darj Hua Hai:
*Order ID:* ${order.orderNumber}
*Customer Name:* ${order.customerName}
*Phone:* ${order.customerPhone}
*Delivery Address (Lahore):* ${order.address}
*Item:* ${currentProd?.name} (${currentProd?.weight}) x ${quantity}
*Total Amount:* Rs ${order.total} (Cash on Delivery)
*City:* Lahore
${order.notes ? `*Special Note:* ${order.notes}` : ''}
Shukriya! Delivery confirm karein.`;

    return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setSubmittedOrder(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-3xl max-w-lg w-full p-5 sm:p-7 shadow-2xl border border-neutral-200 text-left animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-black rounded-full hover:bg-neutral-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted && submittedOrder ? (
          /* Order Confirmation View */
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 stroke-[2.5]" />
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-black">
              Shukriya! Aapka Order Darj Ho Chuka Hai
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1.5 font-medium">
              Order ID: <span className="font-bold text-black font-mono">{submittedOrder.orderNumber}</span>
            </p>
            <p className="text-xs text-emerald-700 font-semibold mt-1">
              Lahore Me Cash on Delivery - Kal Aapke Ghar Par!
            </p>

            {/* Receipt Box */}
            <div className="mt-5 bg-neutral-50 rounded-2xl p-4 border border-neutral-200 text-xs text-left space-y-2">
              <div className="flex justify-between border-b border-neutral-200 pb-2">
                <span className="text-neutral-500">Customer Name:</span>
                <span className="font-bold text-black">{submittedOrder.customerName}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-200 pb-2">
                <span className="text-neutral-500">Phone:</span>
                <span className="font-bold text-black font-mono">{submittedOrder.customerPhone}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-200 pb-2">
                <span className="text-neutral-500">Lahore Address:</span>
                <span className="font-medium text-black text-right max-w-[200px]">{submittedOrder.address}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-200 pb-2">
                <span className="text-neutral-500">Item:</span>
                <span className="font-medium text-black">{currentProd?.name} ({currentProd?.weight}) × {quantity}</span>
              </div>
              <div className="flex justify-between pt-1 text-sm font-extrabold">
                <span className="text-black">Total (Cash on Delivery):</span>
                <span className="text-black">Rs {submittedOrder.total}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col gap-3">
              <a
                href={getWhatsAppReceiptUrl(submittedOrder)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm rounded-full shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all"
              >
                <MessageCircle className="w-5 h-5 fill-white text-[#25D366]" />
                <span>Send Order Receipt to WhatsApp</span>
              </a>

              <button
                onClick={handleClose}
                className="w-full py-3 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-xs rounded-full transition-colors"
              >
                Close & Return to Store
              </button>
            </div>
          </div>
        ) : (
          /* Order Form View */
          <div>
            <div className="text-center mb-5">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full mb-1">
                <Truck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Lahore Me Cash on Delivery</span>
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-black tracking-tight">
                Quick Order Form
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Apna pata aur phone number darj karein, achar kal ghar par pohnch jayega.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Product Selection & Quantity Card */}
              <div className="p-3 sm:p-4 bg-neutral-50 rounded-2xl border border-neutral-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-white rounded-xl border border-neutral-200 overflow-hidden shrink-0 p-1 flex items-center justify-center">
                    <img
                      src={currentProd?.image}
                      alt={currentProd?.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <select
                      value={currentProd?.id}
                      onChange={(e) => {
                        const found = allProducts.find((p) => p.id === e.target.value);
                        if (found) setProduct(found);
                      }}
                      className="text-xs sm:text-sm font-bold text-black bg-transparent border-b border-neutral-300 focus:outline-none focus:border-black pr-2 py-0.5 cursor-pointer"
                    >
                      {allProducts.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.weight} - Rs {p.price})
                        </option>
                      ))}
                    </select>
                    <p className="text-[11px] text-amber-600 font-medium">
                      Rs {unitPrice} per jar · 100% Pure Oil
                    </p>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-7 h-7 rounded-full bg-white border border-neutral-300 hover:border-black font-bold text-xs flex items-center justify-center text-black"
                  >
                    -
                  </button>
                  <span className="text-xs font-bold w-4 text-center text-black tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-7 h-7 rounded-full bg-white border border-neutral-300 hover:border-black font-bold text-xs flex items-center justify-center text-black"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Customer Full Name */}
              <div>
                <label className="block text-xs font-semibold text-neutral-800 mb-1">
                  Aap Ka Pura Naam (Customer Name) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Fatima Ali / Ahmad Khan"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:border-black focus:bg-white text-black transition-colors"
                  />
                </div>
              </div>

              {/* Phone / WhatsApp */}
              <div>
                <label className="block text-xs font-semibold text-neutral-800 mb-1">
                  Phone Number / WhatsApp (فون نمبر) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="tel"
                    required
                    placeholder="0300-1234567"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:border-black focus:bg-white text-black transition-colors font-mono"
                  />
                </div>
              </div>

              {/* Delivery Address in Lahore */}
              <div>
                <label className="block text-xs font-semibold text-neutral-800 mb-1">
                  Lahore Delivery Address (لاہور کا مکمل پتہ) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-neutral-400 absolute left-3 top-3 pointer-events-none" />
                  <textarea
                    required
                    rows={2}
                    placeholder="House#, Street#, Mohalla/Town (e.g. Johar Town / Gulberg / DHA / Model Town), Lahore"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:border-black focus:bg-white text-black transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Optional Notes */}
              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1">
                  Special Delivery Instructions (اختیاری نوٹ)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Call before delivery / deliver in afternoon"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-black focus:bg-white text-neutral-800"
                />
              </div>

              {/* Total Summary */}
              <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-sm">
                <div>
                  <span className="text-neutral-500 text-xs block">Payment Method:</span>
                  <span className="font-bold text-emerald-700 text-xs">Cash on Delivery (Free)</span>
                </div>
                <div className="text-right">
                  <span className="text-neutral-500 text-xs block">Total Payable:</span>
                  <span className="text-lg font-extrabold text-black">Rs {totalPrice}</span>
                </div>
              </div>

              {/* Submit Button: Black button */}
              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-black hover:bg-neutral-800 text-white font-bold text-sm rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Confirm Cash on Delivery Order (Rs {totalPrice})</span>
              </button>

              <p className="text-[11px] text-center text-neutral-400">
                Aapka order foran process hoga aur call / WhatsApp par confirmation aayegi.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

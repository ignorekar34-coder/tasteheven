import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { generateGeneralInquiryWhatsAppUrl } from '../utils/whatsapp';

export const WhatsAppFloatingButton: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2">
      {/* Friendly conversation bubble */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 bg-white text-stone-800 text-xs py-2 px-3.5 rounded-xl shadow-lg border border-[#D4AF37]/40 animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-xs text-left">
          <div className="w-2 h-2 rounded-full bg-[#D4AF37] shrink-0 animate-pulse" />
          <p className="leading-tight text-[12px]">
            Need help or want to order directly? <strong className="text-[#0A0A0A] font-semibold block">Chat with us on WhatsApp!</strong>
          </p>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-stone-400 hover:text-stone-600 ml-1 p-0.5 cursor-pointer"
            aria-label="Dismiss message"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Action Button (Luxury Black & Gold) */}
      <a
        href={generateGeneralInquiryWhatsAppUrl('Order & Product Inquiries')}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2.5 bg-[#0A0A0A] hover:bg-[#1A1A1A] text-[#D4AF37] hover:text-[#F9E498] border-2 border-[#D4AF37] p-3.5 sm:px-4 sm:py-3.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
        aria-label="Order on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 fill-[#D4AF37] text-[#0A0A0A] shrink-0" />
        <span className="hidden sm:inline font-bold text-xs tracking-wide">
          Order on WhatsApp
        </span>
      </a>
    </div>
  );
};

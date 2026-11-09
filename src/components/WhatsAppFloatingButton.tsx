import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../data/products';

export const WhatsAppFloatingButton: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(true);

  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    'Hello Meraki Pantry! I would like to inquire about your artisanal mango pickles and apple murabba preserves.'
  )}`;

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2">
      {/* Friendly conversation bubble */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2.5 bg-[#FAF8F5] text-[#4A2C1A] text-xs py-2 px-3.5 shadow-lg border border-[#4A2C1A]/20 animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-xs text-left">
          <div className="w-2 h-2 rounded-full bg-[#C46835] shrink-0 animate-pulse" />
          <p className="leading-tight text-[11px]">
            Inquire directly with our Pune atelier: <strong className="text-[#4A2C1A] font-semibold block">Chat with the Preserve Masters</strong>
          </p>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-[#4A2C1A]/50 hover:text-[#4A2C1A] ml-1 p-0.5 cursor-pointer"
            aria-label="Dismiss message"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Action Button (Warm Dark Brown #4A2C1A) */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2.5 bg-[#4A2C1A] hover:bg-[#341d10] text-[#F5F1EB] border border-[#F5F1EB]/30 p-3.5 sm:px-4 sm:py-3 shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
        aria-label="Atelier WhatsApp Concierge"
      >
        <MessageCircle className="w-5 h-5 text-[#F5F1EB] shrink-0" />
        <span className="hidden sm:inline font-medium text-xs tracking-wider uppercase">
          Atelier WhatsApp
        </span>
      </a>
    </div>
  );
};

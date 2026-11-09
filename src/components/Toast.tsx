import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';

interface ToastProps {
  message: string;
  subMessage?: string;
  isVisible: boolean;
  onOpenCart: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  subMessage,
  isVisible,
  onOpenCart,
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-[#4A2C1A] text-[#F5F1EB] px-5 py-3 border border-[#FAF8F5]/20 shadow-2xl flex items-center gap-4 max-w-md">
        <div className="w-8 h-8 bg-[#FAF8F5] text-[#4A2C1A] flex items-center justify-center shrink-0">
          <ShoppingBag className="w-4 h-4" />
        </div>
        <div className="text-left font-sans">
          <p className="text-xs font-semibold text-[#F5F1EB]">{message}</p>
          {subMessage && (
            <p className="text-[11px] text-[#D8C4AC]">{subMessage}</p>
          )}
        </div>
        <button
          onClick={onOpenCart}
          className="ml-2 px-3 py-1.5 bg-[#F5F1EB] hover:bg-white text-[#4A2C1A] text-[11px] uppercase tracking-wider font-semibold flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
        >
          <span>View Bag</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

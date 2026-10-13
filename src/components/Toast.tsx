import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { formatPKR } from '../utils/whatsapp';

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
      <div className="bg-emerald-950 text-white px-4 py-3 rounded-2xl shadow-2xl border border-emerald-800 flex items-center gap-3 max-w-md">
        <div className="w-8 h-8 rounded-full bg-amber-500 text-emerald-950 flex items-center justify-center shrink-0">
          <ShoppingBag className="w-4 h-4" />
        </div>
        <div className="text-left">
          <p className="text-xs font-bold text-amber-100">{message}</p>
          {subMessage && (
            <p className="text-[11px] text-emerald-200">{subMessage}</p>
          )}
        </div>
        <button
          onClick={onOpenCart}
          className="ml-2 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-emerald-950 text-xs font-bold rounded-lg flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
        >
          <span>View Cart</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

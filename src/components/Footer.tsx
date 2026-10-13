import React from 'react';
import { MessageCircle, Phone, MapPin, Mail, ShieldCheck, Heart, Truck, RefreshCw, Shield } from 'lucide-react';
import { generateGeneralInquiryWhatsAppUrl } from '../utils/whatsapp';
import { ProductCategory } from '../types';

interface FooterProps {
  onSelectCategory: (cat: ProductCategory) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory, onOpenAdmin }) => {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800">
      {/* Pre-footer Trust Strip */}
      <div className="border-b border-stone-800/80 bg-stone-950/60 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-950/80 text-amber-300 border border-emerald-900">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">100% Khalis Quality</p>
                <p className="text-[11px] text-stone-400">Pure raw ingredients only</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-950/80 text-amber-300 border border-emerald-900">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Cash On Delivery</p>
                <p className="text-[11px] text-stone-400">All cities & towns in Pakistan</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-950/80 text-amber-300 border border-emerald-900">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Safe Glass Packaging</p>
                <p className="text-[11px] text-stone-400">Zero breakage guarantee</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-950/80 text-amber-300 border border-emerald-900">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">WhatsApp Ordering</p>
                <p className="text-[11px] text-stone-400">Quick 24/7 order response</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand Info & WhatsApp CTA */}
          <div className="md:col-span-5 space-y-4 text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-emerald-800 flex items-center justify-center text-white shadow-xs">
                <span className="font-serif font-bold text-lg text-amber-100">TH</span>
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-tight text-white block">
                  TASTE HEVEN
                </span>
                <span className="text-[10px] tracking-widest uppercase font-medium text-amber-400">
                  KHALIS SHEHAD · CHATPATA ACHAR · LAZEEZ MURABBAY
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed max-w-sm">
              Dedicated to reviving pure Pakistani culinary heritage. Handcrafted with cold-pressed oils,
              raw wild blooms, and wholesome fruits in certified hygienic glass jars.
            </p>

            {/* Prominent WhatsApp Order button */}
            <div className="pt-2">
              <a
                href={generateGeneralInquiryWhatsAppUrl('Footer Order Link')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-5 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md transition-all hover:scale-[1.02]"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>Order on WhatsApp (0324-8314001)</span>
              </a>
            </div>

            <div className="p-3 bg-stone-800/80 rounded-xl border border-stone-700/80 text-xs">
              <p className="font-bold text-amber-300">EasyPaisa & Advance Payment Account:</p>
              <p className="font-mono text-white text-sm mt-0.5 tracking-wider">
                <strong>0324-8314001</strong>
              </p>
              <p className="text-[11px] text-stone-400">Title: Taste Heven / Cash on Delivery also available</p>
            </div>
          </div>

          {/* Quick Category Links */}
          <div className="md:col-span-3 space-y-3 text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-serif">
              Our Specialties
            </h4>
            <ul className="space-y-2 text-xs text-stone-300">
              <li>
                <a
                  href="#products"
                  onClick={() => onSelectCategory('honey')}
                  className="hover:text-amber-300 transition-colors"
                >
                  Pure Sidr (Beri) Honey
                </a>
              </li>
              <li>
                <a
                  href="#products"
                  onClick={() => onSelectCategory('honey')}
                  className="hover:text-amber-300 transition-colors"
                >
                  Raw Phulai Wildflower Honey
                </a>
              </li>
              <li>
                <a
                  href="#products"
                  onClick={() => onSelectCategory('achar')}
                  className="hover:text-amber-300 transition-colors"
                >
                  Traditional Mustard Oil Mango Achar
                </a>
              </li>
              <li>
                <a
                  href="#products"
                  onClick={() => onSelectCategory('achar')}
                  className="hover:text-amber-300 transition-colors"
                >
                  Chatpata Garlic (Lehsan) Achar
                </a>
              </li>
              <li>
                <a
                  href="#products"
                  onClick={() => onSelectCategory('murabba')}
                  className="hover:text-amber-300 transition-colors"
                >
                  Royal Kashmiri Seb (Apple) Murabba
                </a>
              </li>
              <li>
                <a
                  href="#products"
                  onClick={() => onSelectCategory('murabba')}
                  className="hover:text-amber-300 transition-colors"
                >
                  Traditional Amla & Gajar Murabbay
                </a>
              </li>
            </ul>
          </div>

          {/* Delivery & Contact Info */}
          <div className="md:col-span-4 space-y-3 text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-serif">
              Order & Delivery Inquiries
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-300">
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">WhatsApp & Helpline</span>
                  <span className="text-stone-400">+92 324 8314001 (10 AM - 10 PM)</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Truck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Nationwide Delivery</span>
                  <span className="text-stone-400">
                    Lahore, Karachi, Islamabad: 2-3 Days<br />
                    Other Cities & Districts: 3-4 Days
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Pantry Headquarters</span>
                  <span className="text-stone-400">Artisanal Estate, Lahore, Pakistan</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div className="mt-12 pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-3">
          <p>© {new Date().getFullYear()} Taste Heven. All Rights Reserved. Pure & Natural Pantry.</p>
          <div className="flex items-center gap-4 text-xs">
            <span>Cash on Delivery (COD)</span>
            <span>·</span>
            <span>JazzCash / EasyPaisa</span>
            <span>·</span>
            <button
              onClick={onOpenAdmin}
              className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Shield className="w-3 h-3" />
              <span>Admin Login (4 Staff Accounts)</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

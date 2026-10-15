import React from 'react';
import { MessageCircle, Phone, MapPin, ShieldCheck, Truck, RefreshCw, Shield } from 'lucide-react';
import { generateGeneralInquiryWhatsAppUrl } from '../utils/whatsapp';
import { ProductCategory } from '../types';
import { TasteHevenLogo } from './TasteHevenLogo';

interface FooterProps {
  onSelectCategory: (cat: ProductCategory) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory, onOpenAdmin }) => {
  return (
    <footer className="bg-[#0A0A0A] text-white border-t border-[#D4AF37]/30">
      {/* Pre-footer Trust Strip */}
      <div className="border-b border-[#D4AF37]/20 bg-[#121212] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#0A0A0A] text-white border border-[#D4AF37]/40 shadow-xs">
                <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">100% Khalis Quality</p>
                <p className="text-[11px] text-[#D4AF37]/80">Pure raw ingredients only</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#0A0A0A] text-white border border-[#D4AF37]/40 shadow-xs">
                <Truck className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Cash On Delivery</p>
                <p className="text-[11px] text-[#D4AF37]/80">All cities & towns in Pakistan</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#0A0A0A] text-white border border-[#D4AF37]/40 shadow-xs">
                <RefreshCw className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Food-Grade Glass Jars</p>
                <p className="text-[11px] text-[#D4AF37]/80">Zero breakage guarantee</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#0A0A0A] text-white border border-[#D4AF37]/40 shadow-xs">
                <MessageCircle className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">WhatsApp Ordering</p>
                <p className="text-[11px] text-[#D4AF37]/80">0324-8314001 (24/7)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand Info & WhatsApp CTA */}
          <div className="md:col-span-5 space-y-4 text-left">
            {/* New Official Circular Badge Logo */}
            <div>
              <TasteHevenLogo variant="lockup" size={56} theme="dark" />
            </div>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-sm">
              Dedicated to reviving pure Pakistani culinary heritage. Handcrafted with cold-pressed oils,
              raw wild blooms, and wholesome fruits in certified hygienic glass jars.
            </p>

            {/* Founders / Owners Credit */}
            <div className="p-3.5 bg-[#141414] rounded-2xl border border-[#D4AF37]/30 text-xs text-stone-200">
              <p className="font-bold text-white uppercase tracking-wider text-[11px]">Store Founders & Owners:</p>
              <p className="text-sm font-semibold text-[#D4AF37] mt-0.5 font-serif">
                Ahmad Waseem & Farman Ali
              </p>
              <p className="text-[11px] text-stone-400 mt-1">
                Direct Contact & Inquiries: <span className="text-white font-mono">0324-8314001</span>
              </p>
            </div>

            {/* Prominent WhatsApp Order button (Luxury Gold & Black) */}
            <div className="pt-2">
              <a
                href={generateGeneralInquiryWhatsAppUrl('Footer Order Link')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#D4AF37] hover:bg-[#F9E498] text-[#0A0A0A] font-bold text-xs sm:text-sm rounded-full shadow-lg transition-all hover:scale-[1.02]"
              >
                <MessageCircle className="w-5 h-5 fill-[#0A0A0A] text-[#0A0A0A]" />
                <span>Order on WhatsApp: 0324-8314001</span>
              </a>
            </div>

            <div className="p-3 bg-[#141414] rounded-2xl border border-white/10 text-xs">
              <p className="font-bold text-[#D4AF37]">EasyPaisa & Advance Payment Account:</p>
              <p className="font-mono text-white text-sm mt-0.5 tracking-wider font-semibold">
                0324-8314001
              </p>
              <p className="text-[11px] text-stone-400">Account: Taste Heven · Cash on Delivery (COD) also accepted</p>
            </div>
          </div>

          {/* Quick Category Links */}
          <div className="md:col-span-3 space-y-3 text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] font-serif">
              Our Specialties
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-300">
              <li>
                <a
                  href="#products"
                  onClick={() => onSelectCategory('honey')}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  Pure Sidr (Beri) Honey
                </a>
              </li>
              <li>
                <a
                  href="#products"
                  onClick={() => onSelectCategory('honey')}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  Raw Phulai Wildflower Honey
                </a>
              </li>
              <li>
                <a
                  href="#products"
                  onClick={() => onSelectCategory('achar')}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  Traditional Mustard Oil Mango Achar
                </a>
              </li>
              <li>
                <a
                  href="#products"
                  onClick={() => onSelectCategory('achar')}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  Chatpata Garlic (Lehsan) Achar
                </a>
              </li>
              <li>
                <a
                  href="#products"
                  onClick={() => onSelectCategory('murabba')}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  Royal Kashmiri Seb (Apple) Murabba
                </a>
              </li>
              <li>
                <a
                  href="#products"
                  onClick={() => onSelectCategory('murabba')}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  Traditional Amla & Gajar Murabbay
                </a>
              </li>
            </ul>
          </div>

          {/* Delivery & Contact Info */}
          <div className="md:col-span-4 space-y-3 text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] font-serif">
              Order & Delivery Inquiries
            </h4>
            <ul className="space-y-3 text-xs text-stone-300">
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">WhatsApp & Helpline</span>
                  <span className="text-stone-400">+92 324 8314001 (10 AM - 10 PM)</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Truck className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Nationwide Delivery</span>
                  <span className="text-stone-400">
                    Lahore, Karachi, Islamabad: 2-3 Days<br />
                    Other Cities & Districts: 3-4 Days
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Pantry Headquarters</span>
                  <span className="text-stone-400">Artisanal Estate, Lahore, Pakistan</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-3">
          <p>© {new Date().getFullYear()} Taste Heven. All Rights Reserved. Fine Food Experience.</p>
          <div className="flex items-center gap-4 text-xs">
            <span>Cash on Delivery (COD)</span>
            <span>·</span>
            <span>EasyPaisa: 0324-8314001</span>
            <span>·</span>
            <button
              onClick={onOpenAdmin}
              className="text-[#D4AF37] hover:text-[#F9E498] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Shield className="w-3 h-3" />
              <span>Owners Portal</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

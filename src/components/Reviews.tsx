import React from 'react';
import { motion } from 'motion/react';
import { Star, ShieldCheck, Heart, MessageSquare } from 'lucide-react';
import { REVIEWS } from '../data/products';

export const Reviews: React.FC = () => {
  return (
    <section id="reviews" className="py-20 bg-[#FAFAFA] border-b border-[#0A0A0A]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0A0A0A] bg-white border border-[#D4AF37]/50 px-4 py-1.5 rounded-full mb-3.5 shadow-2xs">
            <Heart className="w-3.5 h-3.5 text-[#B91C1C] fill-[#B91C1C]" />
            <span>Customer Testimonials</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#0A0A0A] tracking-tight leading-tight">
            Loved Across Pakistani Households
            <span className="block italic text-[#D4AF37] font-serif font-normal">
              1,840+ Verified Reviews
            </span>
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-3 max-w-xl mx-auto leading-relaxed font-medium">
            Read what our valued customers from Karachi, Lahore, Islamabad, and across Pakistan say about our khalis pantry.
          </p>

          {/* Aggregate Rating Banner */}
          <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-4 bg-white border border-[#D4AF37]/40 py-3.5 px-7 rounded-full shadow-2xs">
            <div className="flex items-center gap-1 text-[#D4AF37]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
              ))}
            </div>
            <span className="font-serif text-lg font-bold text-[#0A0A0A] tabular-nums">
              4.9 out of 5
            </span>
            <span className="text-stone-300">·</span>
            <span className="text-xs text-stone-600 font-semibold">
              Based on 1,840+ verified buyer ratings
            </span>
          </div>
        </div>

        {/* Reviews Grid with rounded-[32px] cards and 0.07s stagger */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {REVIEWS.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.4, delay: (index % 3) * 0.07, ease: [0.16, 1, 0.3, 1] }}
              style={{ willChange: 'transform, opacity', transform: 'translateZ(0)' }}
              className="bg-white rounded-[32px] p-7 border border-[#0A0A0A]/10 hover:border-[#D4AF37]/50 shadow-sm hover:shadow-lg transition-transform duration-300 md:hover:-translate-y-1.5 flex flex-col justify-between text-left"
            >
              <div>
                {/* Rating & Verified Tag */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
                    ))}
                  </div>
                  {review.verified && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0A0A0A] bg-stone-50 px-2.5 py-1 rounded-full border border-[#D4AF37]/30">
                      <ShieldCheck className="w-3 h-3 text-[#D4AF37]" />
                      Verified Order
                    </span>
                  )}
                </div>

                {/* Review Body */}
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic mb-6">
                  "{review.comment}"
                </p>
              </div>

              {/* Author & Product */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-[#0A0A0A]">{review.name}</h4>
                  <p className="text-stone-400 text-[11px] font-medium">{review.city}</p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-semibold text-[#D4AF37] line-clamp-1">
                    {review.productName}
                  </span>
                  <span className="text-[10px] text-stone-400 font-medium">{review.date}</span>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Social Proof CTA card in Luxury Black #0A0A0A with Gold Accents */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.4, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
            style={{ willChange: 'transform, opacity', transform: 'translateZ(0)' }}
            className="bg-[#0A0A0A] border border-[#D4AF37]/30 rounded-[32px] p-7 text-white flex flex-col justify-between text-left shadow-lg md:hover:-translate-y-1.5 transition-transform duration-300"
          >
            <div>
              <div className="p-3 rounded-2xl bg-white/10 inline-block mb-4 text-[#D4AF37] border border-[#D4AF37]/30">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-white mb-2 leading-snug">
                Have You Tried Taste Heven?
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-normal">
                We value your honest feedback. Connect with our founders on WhatsApp (0324-8314001) to share your review or recipe pictures!
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-white/15">
              <span className="text-xs font-semibold text-[#D4AF37]">
                100% Khalis & Raw Guarantee on Every Jar
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

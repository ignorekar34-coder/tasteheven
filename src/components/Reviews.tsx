import React from 'react';
import { motion } from 'motion/react';
import { Star, ShieldCheck, Quote } from 'lucide-react';
import { REVIEWS } from '../data/products';

export const Reviews: React.FC = () => {
  return (
    <section id="reviews" className="py-20 sm:py-28 bg-[#F5F1EB] border-b border-[#4A2C1A]/10 text-[#4A2C1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.22em] text-[#4A2C1A]/70 bg-[#FAF8F5] border border-[#4A2C1A]/15 px-3 py-1 rounded-full">
            <Quote className="w-3.5 h-3.5 text-[#4A2C1A]" />
            <span>Customer Impressions</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#4A2C1A] tracking-tight">
            From Pune to Your Table
          </h2>

          <p className="text-sm sm:text-base text-[#4A2C1A]/80 font-light leading-relaxed">
            Unsolicited impressions from culinary enthusiasts and homes that cherish authentic, slow-cured preserves.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-[#FAF8F5] border border-[#4A2C1A]/15 p-7 flex flex-col justify-between text-left space-y-6 shadow-xs hover:shadow-md transition-shadow"
            >
              <div className="space-y-4">
                {/* 5 Stars */}
                <div className="flex items-center gap-1 text-[#D49B45]">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#D49B45] text-[#D49B45]" />
                  ))}
                </div>

                {/* Quote text */}
                <p className="text-xs sm:text-sm text-[#4A2C1A]/85 font-light leading-relaxed italic">
                  "{review.comment}"
                </p>
              </div>

              {/* Reviewer Details */}
              <div className="pt-4 border-t border-[#4A2C1A]/10 flex items-center justify-between text-xs">
                <div>
                  <p className="font-serif text-sm text-[#4A2C1A] font-medium">{review.name}</p>
                  <p className="text-[11px] text-[#4A2C1A]/60 font-light">{review.city}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] tracking-wider uppercase text-[#4A2C1A]/60 block font-medium">
                    Verified Jar
                  </span>
                  <span className="text-[11px] text-[#4A2C1A]/80 font-medium">
                    {review.productName.split(' ')[0]}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

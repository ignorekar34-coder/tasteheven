import React from 'react';
import { Star, ShieldCheck, Heart, MessageSquare } from 'lucide-react';
import { REVIEWS } from '../data/products';

export const Reviews: React.FC = () => {
  return (
    <section id="reviews" className="py-16 bg-[#FAF9F6] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-800 bg-amber-100/70 px-3 py-1 rounded-full mb-3">
            <Heart className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
            <span>Customer Testimonials</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            Loved Across Pakistani Households
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-2">
            Read what our valued customers from Karachi, Lahore, Islamabad, and across Pakistan say about our khalis pantry.
          </p>

          {/* Aggregate Rating Banner */}
          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-4 bg-white border border-stone-200 py-3 px-6 rounded-2xl shadow-2xs">
            <div className="flex items-center gap-1.5 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="font-serif text-lg font-bold text-stone-900 tabular-nums">
              4.9 out of 5
            </span>
            <span className="text-xs text-stone-500 font-medium">
              Based on 1,840+ verified buyer ratings
            </span>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {REVIEWS.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-2xl p-6 border border-stone-200 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between text-left"
            >
              <div>
                {/* Rating & Verified Tag */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  {review.verified && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Verified Order
                    </span>
                  )}
                </div>

                {/* Review Body */}
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic mb-4">
                  "{review.comment}"
                </p>
              </div>

              {/* Author & Product */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-stone-900">{review.name}</h4>
                  <p className="text-stone-500 text-[11px]">{review.city}</p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-semibold text-amber-800 line-clamp-1">
                    {review.productName}
                  </span>
                  <span className="text-[10px] text-stone-400">{review.date}</span>
                </div>
              </div>
            </div>
          ))}

          {/* Social Proof CTA card */}
          <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-amber-950 rounded-2xl p-6 text-white flex flex-col justify-between text-left shadow-xs">
            <div>
              <div className="p-2.5 rounded-lg bg-emerald-800/80 inline-block mb-3 text-amber-300">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-bold text-amber-100 mb-2">
                Have You Tried Taste Heven?
              </h3>
              <p className="text-xs text-amber-100/80 leading-relaxed">
                We value your honest feedback. Connect with our founders on WhatsApp to share your review or recipe pictures!
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-emerald-800/60">
              <span className="text-xs font-semibold text-amber-300">
                100% Purity Guarantee on Every Jar
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

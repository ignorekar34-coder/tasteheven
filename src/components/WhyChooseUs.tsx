import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Sparkles, PackageCheck, Truck, Award, CheckCircle } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const pillars = [
    {
      icon: ShieldCheck,
      title: '100% Khalis & Lab Tested',
      urduTitle: 'سو فیصد خالص اور ملاوٹ سے پاک',
      desc: 'Our Sidr & Flora honeys are cold-extracted directly from beehives without heat-processing. Guaranteed 0% sugar feeding, no commercial glucose adulteration.',
    },
    {
      icon: Sparkles,
      title: 'Sun-Cured in Pure Sarson Oil',
      urduTitle: 'اصلی کولہو کے سرسوں کا تیل',
      desc: 'No synthetic acetic acid or commercial stabilizers. Our achars mature naturally under warm sunshine with cold-pressed Kachi Ghani mustard oil and stone-ground spices.',
    },
    {
      icon: Award,
      title: 'Shahi Murabbay in Pure Cardamom',
      urduTitle: 'شاہی ذائقہ اور صحت بخش اجزاء',
      desc: 'Slowly candied according to ancestral culinary wisdom with fragrant cardamom and saffron threads. Wholesome restorative treats for heart, brain, and vigor.',
    },
    {
      icon: PackageCheck,
      title: 'Airtight Food-Grade Glass Jars',
      urduTitle: 'محفوظ اور جراثیم سے پاک شیشے کی پیکنگ',
      desc: 'We never compromise with cheap plastic containers. All products are sealed in heavy food-grade glass jars to preserve authentic aroma, crunch, and nutritional enzymes.',
    },
    {
      icon: Truck,
      title: 'Express Delivery with COD',
      urduTitle: 'پورے پاکستان میں کیش آن ڈیلیوری',
      desc: 'Shipped safely with shock-absorbent multi-layer bubble wrap to your doorstep across Karachi, Lahore, Islamabad, Rawalpindi, and every city.',
    },
  ];

  return (
    <section id="why-choose-us" className="py-20 bg-white border-b border-[#0A0A0A]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0A0A0A] bg-stone-50 border border-[#D4AF37]/50 px-4 py-1.5 rounded-full mb-3.5 shadow-2xs">
            <CheckCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>The Taste Heven Promise</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#0A0A0A] tracking-tight leading-tight">
            Why Discerning Pakistani Families
            <span className="block italic text-[#D4AF37] font-serif font-normal">
              Choose Taste Heven
            </span>
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-3 max-w-xl mx-auto leading-relaxed font-medium">
            In an era of industrial shortcuts and artificial flavors, Taste Heven revives the pure, wholesome taste that once graced our grandparents’ pantries.
          </p>
        </div>

        {/* 2-Column Split: Visual Craftsmanship Showcase + Feature Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Craft Photo in Rounded Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ willChange: 'transform, opacity', transform: 'translateZ(0)' }}
            className="lg:col-span-5"
          >
            <div className="relative rounded-[32px] overflow-hidden bg-white border border-[#0A0A0A]/10 shadow-lg aspect-4/3 lg:aspect-square group">
              <img
                src="/src/assets/images/why_choose_us_organic_craft_1791803752526.jpg"
                alt="Raw authentic spices, wild honeycomb and traditional preparation at Taste Heven"
                referrerPolicy="no-referrer"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent flex flex-col justify-end p-7 text-left">
                <span className="text-[#D4AF37] font-serif text-base italic">
                  Artisanal Craftsmanship
                </span>
                <h3 className="font-serif text-2xl font-bold text-white mt-1 leading-snug">
                  Pure Raw Ingredients From Nature’s Heart
                </h3>
                <p className="text-xs text-stone-300 mt-1.5 max-w-sm leading-relaxed">
                  Harvested with patience, prepared with love, delivered with honor.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Pillars List with rounded-[28px] cards and 0.07s stagger */}
          <div className="lg:col-span-7 space-y-3.5 text-left">
            {pillars.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.4, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
                  style={{ willChange: 'transform, opacity', transform: 'translateZ(0)' }}
                  className="p-5 rounded-[28px] bg-white border border-[#0A0A0A]/10 hover:border-[#D4AF37]/60 hover:shadow-lg transition-all flex items-start gap-4 md:hover:-translate-y-1"
                >
                  <div className="p-3 rounded-2xl bg-[#0A0A0A] text-[#D4AF37] border border-[#D4AF37]/40 shrink-0 mt-0.5 shadow-xs">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-baseline gap-2.5 mb-1">
                      <h4 className="font-serif text-lg font-bold text-[#0A0A0A]">
                        {item.title}
                      </h4>
                      <span className="font-serif text-xs text-[#D4AF37] font-semibold">
                        {item.urduTitle}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

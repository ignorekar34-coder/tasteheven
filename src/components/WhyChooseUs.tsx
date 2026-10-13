import React from 'react';
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
    <section id="why-choose-us" className="py-16 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-3.5 py-1.5 rounded-full mb-3">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>The Taste Heven Promise</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight text-balance">
            Why Discerning Pakistani Families Choose Taste Heven
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-3 leading-relaxed">
            In an era of industrial shortcuts and artificial flavors, Taste Heven revives the pure, wholesome taste that once graced our grandparents’ pantries.
          </p>
        </div>

        {/* 2-Column Split: Visual Craftsmanship Showcase + Feature Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Craft Photo */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-md aspect-4/3 lg:aspect-square group">
              <img
                src="/src/assets/images/why_choose_us_organic_craft_1791803752526.jpg"
                alt="Raw authentic spices, wild honeycomb and traditional preparation at Taste Heven"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/20 to-transparent flex flex-col justify-end p-6 text-left">
                <span className="text-amber-300 font-serif text-sm italic">
                  Artisanal Craftsmanship
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mt-1">
                  Pure Raw Ingredients From Nature’s Heart
                </h3>
                <p className="text-xs text-stone-200 mt-1 max-w-sm">
                  Harvested with patience, prepared with love, delivered with honor.
                </p>
              </div>
            </div>
          </div>

          {/* Pillars List */}
          <div className="lg:col-span-7 space-y-4 text-left">
            {pillars.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="p-4 sm:p-5 rounded-xl bg-stone-50/70 border border-stone-200/80 hover:border-amber-300 hover:bg-stone-50 transition-all flex items-start gap-4"
                >
                  <div className="p-2.5 rounded-lg bg-emerald-950 text-amber-300 shrink-0 mt-0.5 shadow-2xs">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-baseline gap-2 mb-1">
                      <h4 className="font-serif text-base font-bold text-stone-900">
                        {item.title}
                      </h4>
                      <span className="font-serif text-xs text-amber-800 font-medium">
                        {item.urduTitle}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

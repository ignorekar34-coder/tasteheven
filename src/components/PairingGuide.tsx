import React from 'react';
import { motion } from 'motion/react';
import { Utensils, Sparkles } from 'lucide-react';

export const PairingGuide: React.FC = () => {
  const pairings = [
    {
      preserve: 'Mango Pickle 300g',
      idealWith: 'Flaky Aloo Paratha & Fresh Curd',
      notes: 'The cold-pressed mustard oil and cracked yellow seeds pierce through the richness of ghee and buttery flatbreads with a bright, sun-cured acidity.',
      moment: 'Sunday Comfort Lunch',
    },
    {
      preserve: 'Apple Murabba 350g',
      idealWith: 'Toasted Sourdough & Whipped Ricotta',
      notes: 'Spread cold whipped ricotta over rustic country loaf, top with translucent tender apple slices, and drizzle a spoonful of cinnamon star anise syrup.',
      moment: 'Morning Reading Table',
    },
    {
      preserve: 'Apple Murabba with Saffron 350g',
      idealWith: 'Aged Goat Cheese & Roasted Walnuts',
      notes: 'The delicate Kashmiri saffron threads pair exquisitely with salty, earthy cheeses and cracked black pepper on an evening artisanal board.',
      moment: 'Sunset Aperitivo',
    },
  ];

  return (
    <section id="pairings" className="py-16 lg:py-20 bg-[#FAF8F5] text-[#4A2C1A] border-b border-[#4A2C1A]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-12 space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-[#6B3E26] font-medium font-sans">
            Table Rituals
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#4A2C1A] font-normal tracking-tight">
            How We Savor Our Preserves
          </h2>
          <p className="text-sm text-[#5C3A24]/80 font-sans leading-relaxed">
            Elevating everyday table moments into thoughtful culinary rituals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pairings.map((item, idx) => (
            <motion.div
              key={item.preserve}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-[#F5F1EB] p-6 border border-[#4A2C1A]/10 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#6B3E26] font-sans font-semibold block">
                  {item.moment}
                </span>
                <h3 className="font-serif text-lg text-[#4A2C1A] font-normal uppercase">
                  {item.preserve}
                </h3>
                <div className="text-xs font-semibold text-[#4A2C1A]/90 font-sans flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5 text-[#6B3E26]" />
                  <span>Pair With: {item.idealWith}</span>
                </div>
                <p className="text-xs text-[#5C3A24]/80 font-sans leading-relaxed">
                  {item.notes}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

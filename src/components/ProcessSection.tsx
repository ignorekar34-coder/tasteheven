import React from 'react';
import { motion } from 'motion/react';
import { Sun, Sparkles, Clock, ShieldCheck } from 'lucide-react';

export const PROCESS_IMAGE = '/src/assets/images/meraki_process_banner_1793443713709.jpg';

export const ProcessSection: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Single-Origin Sourcing',
      desc: 'Raw Rajapuri mangoes from Konkan coastal orchards and crisp cold-climate apples from high-altitude Himachal groves.',
      tag: 'Seasonal Harvest',
    },
    {
      num: '02',
      title: 'Cracked Spices & Cold Oil',
      desc: 'Whole yellow mustard seeds lightly crushed on stone, sun-dried Kashmiri red chilies, and pure cold-pressed kachi ghani oil.',
      tag: 'Zero Extraction Heat',
    },
    {
      num: '03',
      title: 'Bharani Ceramic Aging',
      desc: 'Cured inside heavy glazed stoneware Bharani vessels wrapped in natural unbleached muslin, sun-soaked for 21 days on our Pune terrace.',
      tag: 'Sun Fermentation',
    },
    {
      num: '04',
      title: 'Sealed by Hand',
      desc: 'Hand-poured into heavy glass jars in numbered micro-batches. Never touched by synthetic sodium benzoate or artificial vinegar.',
      tag: 'Pure Integrity',
    },
  ];

  return (
    <section id="process" className="py-16 lg:py-24 bg-[#F5F1EB] text-[#4A2C1A] border-b border-[#4A2C1A]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-12 lg:mb-16 space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-[#6B3E26] font-medium font-sans">
            The Method & Philosophy
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#4A2C1A] font-normal tracking-tight">
            The Slow Craft of Preservation
          </h2>
          <p className="text-sm text-[#5C3A24]/80 font-sans leading-relaxed">
            In an era of industrial speed and chemical additives, we return to the ancient
            rhythm of sunlight, stone, and patiently aged ceramics.
          </p>
        </div>

        {/* Process Banner Visual */}
        <div className="mb-14 relative group">
          <div className="relative overflow-hidden border border-[#4A2C1A]/15 shadow-lg bg-[#EAE2D5]">
            <img
              src={PROCESS_IMAGE}
              alt="Traditional ceramic Bharani pickle jars lined up on a sunlit stone terrace in Pune"
              className="w-full h-auto aspect-[16/9] object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#4A2C1A]/60 via-transparent to-transparent flex items-end p-6 sm:p-10">
              <div className="text-[#FAF8F5] max-w-lg space-y-1">
                <span className="text-[11px] uppercase tracking-[0.25em] text-[#D8C4AC]">
                  Atelier Courtyard · Pune
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-normal">
                  Ceramic Bharani Jars Maturing in the Deccan Sunlight
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Process Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-[#FAF8F5] p-6 border border-[#4A2C1A]/10 flex flex-col justify-between space-y-4 hover:border-[#4A2C1A]/30 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-serif text-2xl text-[#4A2C1A]/60 font-light">
                    {step.num}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.16em] text-[#6B3E26] px-2 py-0.5 bg-[#F5F1EB] border border-[#4A2C1A]/10 font-sans">
                    {step.tag}
                  </span>
                </div>
                <h4 className="font-serif text-lg text-[#4A2C1A] font-normal mb-2">
                  {step.title}
                </h4>
                <p className="text-xs text-[#5C3A24]/80 font-sans leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

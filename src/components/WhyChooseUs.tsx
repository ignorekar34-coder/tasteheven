import React from 'react';
import { motion } from 'motion/react';
import { Sun, Droplets, Sparkles, Clock, ShieldCheck, CheckCircle } from 'lucide-react';

export const DEFAULT_RAW_INGREDIENTS_BANNER = '/src/assets/images/meraki_hero_jars_1793444359915.jpg';

interface WhyChooseUsProps {
  bannerImage?: string;
}

export const WhyChooseUs: React.FC<WhyChooseUsProps> = ({ bannerImage }) => {
  const steps = [
    {
      number: '01',
      title: 'Single-Origin Sourcing',
      subtitle: 'Rajapuri Mangoes & Kinnaur Apples',
      desc: 'We procure hand-selected raw green mangoes from Konkan farmers and crisp cold-climate apples from Himachal growers at peak crispness.',
    },
    {
      number: '02',
      title: 'Cold Wood-Pressed Oils',
      subtitle: 'Traditional Wooden Ghani',
      desc: 'Our oils are pressed unheated in small wooden mills, preserving vital enzymes, golden viscosity, and gentle pungent depth.',
    },
    {
      number: '03',
      title: 'Stone-Ground Whole Spices',
      subtitle: 'Yellow Mustard & Whole Chilies',
      desc: 'Cracked yellow mustard seeds, wild roasted fenugreek, Ceylon cinnamon quills, and Byadgi red chilies bruised on granite stones.',
    },
    {
      number: '04',
      title: '21-Day Bharani Curing',
      subtitle: 'Traditional Glazed Stoneware',
      desc: 'Every jar is matured under Pune’s golden morning sunlight inside porous ceramic jars, allowing natural probiotics to bloom slowly.',
    },
  ];

  return (
    <section id="our-process" className="py-20 sm:py-28 bg-[#EDE7DD] border-b border-[#4A2C1A]/10 text-[#4A2C1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.22em] text-[#4A2C1A]/70 bg-[#FAF8F5] border border-[#4A2C1A]/15 px-3 py-1 rounded-full">
            <Clock className="w-3.5 h-3.5 text-[#4A2C1A]" />
            <span>The Slow Method</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#4A2C1A] tracking-tight">
            Our Process: The Ritual of Patience
          </h2>

          <p className="text-sm sm:text-base text-[#4A2C1A]/80 font-light leading-relaxed">
            In an era of artificial preservatives and rushed production, Meraki preserves are crafted with deliberate slowness in Pune.
          </p>
        </div>

        {/* 4 Process Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-[#FAF8F5] border border-[#4A2C1A]/15 p-7 flex flex-col justify-between text-left space-y-6 shadow-xs hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between border-b border-[#4A2C1A]/10 pb-4">
                <span className="font-serif text-2xl text-[#4A2C1A]/40 font-light">{step.number}</span>
                <span className="w-2 h-2 rounded-full bg-[#4A2C1A]/30" />
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-xl text-[#4A2C1A] font-normal tracking-tight">
                  {step.title}
                </h3>
                <p className="text-xs uppercase tracking-wider text-[#4A2C1A]/60 font-medium">
                  {step.subtitle}
                </p>
                <p className="text-xs text-[#4A2C1A]/75 font-light leading-relaxed pt-1">
                  {step.desc}
                </p>
              </div>

              <div className="pt-2 text-[10px] tracking-widest uppercase text-[#4A2C1A]/50 font-medium">
                Zero Chemical Preservatives
              </div>
            </motion.div>
          ))}
        </div>

        {/* Philosophy Callout Strip */}
        <div id="philosophy" className="mt-16 bg-[#FAF8F5] border border-[#4A2C1A]/15 p-8 sm:p-12 text-left">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3">
              <span className="text-xs uppercase tracking-[0.22em] text-[#4A2C1A]/60 font-medium">
                The Objects of Taste
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#4A2C1A] font-normal leading-snug">
                Made in limited batches, numbered by jar, and bottled by hand in Pune.
              </h3>
              <p className="text-sm text-[#4A2C1A]/80 font-light leading-relaxed max-w-2xl">
                We believe that preserves should be treated like fine wine or bespoke objects: allowed to develop complex character through time, warmth, and unhurried natural oil curing.
              </p>
            </div>
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <div className="px-5 py-3 bg-[#EDE7DD] border border-[#4A2C1A]/15 text-xs text-[#4A2C1A]">
                <strong>Batch Run:</strong> 150 Jars per harvest
              </div>
              <div className="px-5 py-3 bg-[#EDE7DD] border border-[#4A2C1A]/15 text-xs text-[#4A2C1A]">
                <strong>Packaging:</strong> Recyclable Amber Glass
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

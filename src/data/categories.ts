import { CategoryConfig } from '../types';

export const DEFAULT_CATEGORIES: CategoryConfig[] = [
  {
    id: 'achar',
    title: 'Artisanal Pickles',
    urduTitle: 'آم کا دیسی اچار',
    tagline: 'Raw mangoes cured 21 days in cold-pressed mustard oil & cracked spices',
    bannerImage: '/src/assets/images/meraki_mango_300g_1793444383270.jpg',
    defaultImage: '/src/assets/images/meraki_mango_300g_1793444383270.jpg',
    displayOrder: 1,
    color: 'from-[#4A2C1A]/10 to-[#C46835]/5',
    badgeColor: 'text-[#4A2C1A] bg-[#EDE7DD] border-[#4A2C1A]/20',
  },
  {
    id: 'murabba',
    title: 'Heritage Murabba',
    urduTitle: 'سیب کا شاہی مربہ',
    tagline: 'Slow-simmered orchard apples with Ceylon cinnamon and Kashmiri saffron',
    bannerImage: '/src/assets/images/meraki_murabba_350g_1793444383516.jpg',
    defaultImage: '/src/assets/images/meraki_murabba_350g_1793444383516.jpg',
    displayOrder: 2,
    color: 'from-[#4A2C1A]/10 to-[#D49B45]/5',
    badgeColor: 'text-[#4A2C1A] bg-[#EDE7DD] border-[#4A2C1A]/20',
  },
];

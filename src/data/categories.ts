import { CategoryConfig } from '../types';

export const DEFAULT_CATEGORIES: CategoryConfig[] = [
  {
    id: 'achar',
    title: 'Chatpata Achar',
    urduTitle: 'اصلی سرسوں کا چٹپٹا اچار',
    tagline: 'Sun-cured in pure cold-pressed mustard oil with organic spices',
    bannerImage: '/src/assets/images/product_spicy_mango_achar_1791803720039.jpg',
    defaultImage: '/src/assets/images/product_spicy_mango_achar_1791803720039.jpg',
    displayOrder: 1,
    color: 'from-red-600/10 to-amber-700/5',
    badgeColor: 'text-red-800 bg-red-50 border-red-200',
  },
  {
    id: 'murabba',
    title: 'Lazeez Murabbay',
    urduTitle: 'شاہی لذیذ مربہ جات',
    tagline: 'Cardamom & saffron infused classical fruit preserves',
    bannerImage: '/src/assets/images/product_lazeez_seb_murabba_1791803738733.jpg',
    defaultImage: '/src/assets/images/product_lazeez_seb_murabba_1791803738733.jpg',
    displayOrder: 2,
    color: 'from-emerald-600/10 to-amber-700/5',
    badgeColor: 'text-emerald-800 bg-emerald-50 border-emerald-200',
  },
  {
    id: 'honey',
    title: 'Pure Honey',
    urduTitle: 'خالص قدرتی شہد',
    tagline: '100% Raw Sidr & Blossom Nectar from wild Potohar blooms',
    bannerImage: '/src/assets/images/product_pure_sidr_honey_1791803704705.jpg',
    defaultImage: '/src/assets/images/product_pure_sidr_honey_1791803704705.jpg',
    displayOrder: 3,
    color: 'from-amber-600/10 to-amber-700/5',
    badgeColor: 'text-amber-800 bg-amber-50 border-amber-200',
  },
];

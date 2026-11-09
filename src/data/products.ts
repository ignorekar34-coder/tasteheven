import { Product, CustomerReview } from '../types';

export const WHATSAPP_NUMBER = '923248314001'; // TASTE HEAVEN Lahore official helpline
export const STORE_NAME = 'TASTE HEAVEN';

export const PRODUCTS: Product[] = [
  {
    id: 'mango-achar-lahore',
    name: 'Mango Achar',
    urduName: 'آم کا اچار',
    category: 'achar',
    price: 650,
    originalPrice: 750,
    weight: '500g',
    weightOptions: [
      { weight: '500g', price: 650 },
      { weight: '1kg', price: 1200 },
    ],
    rating: 4.95,
    reviewCount: 230,
    shortDesc: 'Khaalis kachi ghani sarson ka teil aur dadi ma ka riwayati nuskha. Daal chawal aur garma garam parathay ke sath lajawab!',
    fullDesc: 'Khaalis desi raw mango chunks cured in cold-pressed mustard oil with cracked yellow mustard seeds, whole sun-dried red chilies, fenugreek, and pink rock salt. 100% natural, zero synthetic vinegar.',
    ingredients: [
      'Fresh Raw Green Mangoes',
      'Cold-Pressed Kachi Ghani Mustard Oil',
      'Whole Fenugreek & Mustard Seeds',
      'Himalayan Pink Rock Salt',
      'Kalonji & Red Chili Flakes'
    ],
    benefits: [
      'Pure homemade taste without any chemical preservatives',
      'Sun-matured traditionally for gut health & digestion',
      'Steeped in pure cold-pressed sarson oil',
      'Cash on Delivery available across all Lahore'
    ],
    image: '/src/assets/images/mango_achar_lahore_jar_1794203977577.jpg',
    badge: 'Best Seller',
    inStock: true,
    featured: true,
  },
  {
    id: 'garlic-achar-lahore',
    name: 'Garlic Achar',
    urduName: 'لہسن کا اچار',
    category: 'achar',
    price: 550,
    originalPrice: 650,
    weight: '500g',
    weightOptions: [
      { weight: '500g', price: 550 },
      { weight: '1kg', price: 1000 },
    ],
    rating: 4.92,
    reviewCount: 165,
    shortDesc: 'Sabut desi lehsan aur kalonji ka chatpata zaiqa. Blood pressure aur digestion ke liye nihayat mufeed aur lazeez.',
    fullDesc: 'Whole peeled desi garlic cloves steeped in warm spiced mustard oil infused with kalonji, crushed coriander, and whole dried red chilies. Highly nutritious and delicious.',
    ingredients: [
      'Plump Desi Garlic Cloves',
      'Pure Mustard Oil',
      'Kalonji (Black Cumin)',
      'Rock Salt & Turmeric',
      'Traditional Spices'
    ],
    benefits: [
      'Known for cardiovascular & immune health benefits',
      'Helps maintain healthy digestion & cholesterol',
      'Rich aromatic garlic flavor that enhances any meal'
    ],
    image: '/src/assets/images/garlic_achar_lahore_jar_1794203978491.jpg',
    badge: 'Popular',
    inStock: true,
    featured: true,
  },
  {
    id: 'mix-achar-lahore',
    name: 'Mix Achar',
    urduName: 'مکس اچار',
    category: 'achar',
    price: 600,
    originalPrice: 700,
    weight: '500g',
    weightOptions: [
      { weight: '500g', price: 600 },
      { weight: '1kg', price: 1100 },
    ],
    rating: 4.94,
    reviewCount: 195,
    shortDesc: 'Taza gajar, hari mirch, kacha aam aur leemon ka chatkharedar imtezaaj. Har niwalay mein zabardast desi crunch!',
    fullDesc: 'A crunchy symphony of garden-fresh carrots, spicy green chillies, zesty lemon slices, and crisp raw mangoes marinated in pure sarson oil with traditional pickling spices.',
    ingredients: [
      'Crisp Carrots & Green Chillies',
      'Zesty Lemon Slices & Raw Mango',
      'Mustard Oil',
      'Pickling Spices & Rock Salt'
    ],
    benefits: [
      'Perfect accompaniment for daily lunch & dinner',
      'No artificial colors or preservatives',
      'Prepared with traditional Lahore homestyle recipe'
    ],
    image: '/src/assets/images/mix_achar_lahore_jar_1794203978362.jpg',
    badge: 'Chef Special',
    inStock: true,
    featured: true,
  },
];

export const REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    name: 'Mrs. Farzana Tariq',
    city: 'DHA Phase 5, Lahore',
    rating: 5,
    date: 'Yesterday',
    productName: 'Mango Achar 500g',
    comment: 'Bohot hi lazeez achar hai! Sarson ke tail ka asli zaiqa aata hai jesa nani amma banaya karti theen. Lahore me next day delivery mil gayi thi.',
    verified: true,
  },
  {
    id: 'rev-2',
    name: 'Zubair Chaudhry',
    city: 'Gulberg 3, Lahore',
    rating: 5,
    date: '3 days ago',
    productName: 'Garlic Achar 500g',
    comment: 'Desi lehsan ka zaiqa bohot zabardast hai. Bilkul fresh jar tha aur packing bhi bohot achi thi. Cash on delivery pay kiya.',
    verified: true,
  },
  {
    id: 'rev-3',
    name: 'Saima Waqas',
    city: 'Johar Town, Lahore',
    rating: 5,
    date: '1 week ago',
    productName: 'Mix Achar 500g',
    comment: 'Mix achar ka crunch aur hari mirch ka maza lajawab hai. Daal chawal ke sath maza aa gaya. Dobara zaroor order karungi.',
    verified: true,
  },
];

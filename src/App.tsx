import React, { useState, useEffect } from 'react';
import {
  MessageCircle,
  ShieldCheck,
  Truck,
  Sparkles,
  Check,
  ArrowRight,
  Camera,
  Upload,
  Plus,
  Minus,
  Trash2,
  X,
  Store,
  RotateCcw,
  Key,
  FolderPlus,
  Lock,
  Layers,
  ShoppingCart,
  ShoppingBag,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  CheckCircle2,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { processImageFile } from './utils/imageUtils';
import defaultMangoImg from './assets/images/mango_achar_lahore_jar_1794203977577.jpg';
import defaultGarlicImg from './assets/images/garlic_achar_lahore_jar_1794203978491.jpg';
import defaultMixImg from './assets/images/mix_achar_lahore_jar_1794203978362.jpg';

// Default high-resolution product photos generated for Taste Heven Lahore (clean white backgrounds)
const DEFAULT_MANGO_IMG = defaultMangoImg || '/images/mango_achar.jpg';
const DEFAULT_GARLIC_IMG = defaultGarlicImg || '/images/garlic_achar.jpg';
const DEFAULT_MIX_IMG = defaultMixImg || '/images/mix_achar.jpg';

// WhatsApp phone configuration
const WHATSAPP_PHONE = '923248314001';
const DISPLAY_PHONE = '03248314001';
const OWNERS_NAMES = 'Farman Ali & Ahmad Waseem';

// Default Admin Password (strictly confidential, never displayed in public UI)
const DEFAULT_ADMIN_PASSWORD = 'heven123';

// Available weight variants
export type WeightVariant = '250g' | '500g' | '1kg';

export const WEIGHT_LABELS: Record<WeightVariant, { en: string; urdu: string }> = {
  '250g': { en: '250g Jar', urdu: '250g' },
  '500g': { en: '500g Jar', urdu: '500g' },
  '1kg': { en: '1kg Jar', urdu: '1kg' },
};

// Safe Image Resolver ensuring zero-glitch and zero-broken-image startup
export function getSafeProductImage(id: string, img: string | undefined): string {
  if (img && img.startsWith('data:image/')) return img;
  if (id === 'mango-achar' || (img && img.includes('mango'))) return DEFAULT_MANGO_IMG;
  if (id === 'garlic-achar' || (img && img.includes('garlic'))) return DEFAULT_GARLIC_IMG;
  if (id === 'mix-achar' || (img && img.includes('mix'))) return DEFAULT_MIX_IMG;
  if (img && (img.startsWith('http') || img.startsWith('/'))) return img;
  return DEFAULT_MANGO_IMG;
}

export interface CategoryItem {
  id: string;
  name: string;
  romanUrduTitle: string;
}

export interface ProductItem {
  id: string;
  name: string;
  romanUrduTitle: string;
  category: string;
  price: number; // default / 500g
  price250g: number;
  price500g: number;
  price1kg: number;
  weight: string;
  image: string;
  altText: string;
  description: string;
}

export interface CartItem {
  cartItemId: string; // unique key: productId + weight
  productId: string;
  name: string;
  romanUrduTitle: string;
  weight: WeightVariant;
  unitPrice: number;
  quantity: number;
  image: string;
}

export interface OrderRecord {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  landmark?: string;
  items: {
    name: string;
    weight: WeightVariant;
    unitPrice: number;
    quantity: number;
    itemTotal: number;
  }[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  status: 'Pending' | 'Confirmed' | 'Delivered';
  createdAt: string;
}

export function getPriceForWeight(product: ProductItem, weight: WeightVariant): number {
  if (weight === '250g') {
    return product.price250g > 0 ? product.price250g : Math.round(product.price * 0.55);
  }
  if (weight === '1kg') {
    return product.price1kg > 0 ? product.price1kg : Math.round(product.price * 1.85);
  }
  return product.price500g > 0 ? product.price500g : product.price;
}

const INITIAL_CATEGORIES: CategoryItem[] = [
  { id: 'all', name: 'All Products', romanUrduTitle: 'تمام پروڈکٹس' },
  { id: 'achar', name: 'Achar (Pickles)', romanUrduTitle: 'دیسی اچار' },
  { id: 'murabba', name: 'Murabba (Preserves)', romanUrduTitle: 'لذیذ مربہ' },
  { id: 'honey', name: 'Pure Honey', romanUrduTitle: 'خالص شہد' },
];

const INITIAL_PRODUCTS: ProductItem[] = [
  {
    id: 'mango-achar',
    name: 'Mango Achar',
    romanUrduTitle: 'Aam Ka Khaalis Achar',
    category: 'achar',
    price: 650,
    price250g: 350,
    price500g: 650,
    price1kg: 1200,
    weight: '500g Jar',
    image: DEFAULT_MANGO_IMG,
    altText: 'Mango Achar Lahore - TASTE HEVEN',
    description: 'Khaalis kachi ghani sarson ka teil aur dadi ma ka riwayati nuskha. Daal chawal aur garma garam parathay ke sath lajawab!',
  },
  {
    id: 'garlic-achar',
    name: 'Garlic Achar',
    romanUrduTitle: 'Desi Lehsan Ka Achar',
    category: 'achar',
    price: 550,
    price250g: 300,
    price500g: 550,
    price1kg: 1000,
    weight: '500g Jar',
    image: DEFAULT_GARLIC_IMG,
    altText: 'Garlic Achar Lahore - TASTE HEVEN',
    description: 'Sabut desi lehsan aur kalonji ka chatpata zaiqa. Blood pressure aur digestion ke liye nihayat mufeed aur lazeez.',
  },
  {
    id: 'mix-achar',
    name: 'Mix Achar',
    romanUrduTitle: 'Khatta Meetha Mix Achar',
    category: 'achar',
    price: 600,
    price250g: 320,
    price500g: 600,
    price1kg: 1100,
    weight: '500g Jar',
    image: DEFAULT_MIX_IMG,
    altText: 'Mix Achar Lahore - TASTE HEVEN',
    description: 'Taza gajar, hari mirch, kacha aam aur leemon ka chatkharedar imtezaaj. Har niwalay mein zabardast desi crunch!',
  },
];

const POPULAR_AREAS = [
  'Gulberg',
  'DHA Lahore',
  'Johar Town',
  'Model Town',
  'Bahria Town',
  'Cantt',
  'Iqbal Town',
  'Faisal Town',
  'Wapda Town',
  'Cavalry Ground',
  'Garden Town',
  'Shadman',
];

export default function App() {
  // Mode: customer storefront or admin portal
  const [viewMode, setViewMode] = useState<'store' | 'admin'>('store');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem('taste_heven_admin_logged_in') === 'true';
    } catch {
      return false;
    }
  });

  // Admin Password Management with localStorage persistence
  const [adminPassword, setAdminPassword] = useState<string>(() => {
    try {
      return localStorage.getItem('taste_heven_admin_pwd') || DEFAULT_ADMIN_PASSWORD;
    } catch {
      return DEFAULT_ADMIN_PASSWORD;
    }
  });
  const [enteredPassword, setEnteredPassword] = useState('');
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newPasswordInput, setNewPasswordInput] = useState('');

  // Active Category Filter for Storefront
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Categories list with localStorage persistence
  const [categories, setCategories] = useState<CategoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('taste_heven_categories_v9');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_CATEGORIES;
  });

  // Products with localStorage persistence and instant auto-repair of image URLs
  const [products, setProducts] = useState<ProductItem[]>(() => {
    try {
      const saved = localStorage.getItem('taste_heven_achar_products_v9');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((p: ProductItem) => ({
            ...p,
            price250g: p.price250g || Math.round((p.price || 600) * 0.55),
            price500g: p.price500g || p.price || 600,
            price1kg: p.price1kg || Math.round((p.price || 600) * 1.85),
            image: getSafeProductImage(p.id, p.image),
          }));
        }
      }
    } catch {}
    return INITIAL_PRODUCTS;
  });

  // Hero Mango Jar image with instant auto-repair and staging state for saving
  const [heroImage, setHeroImage] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('taste_heven_hero_jar_v9');
      if (saved && saved.startsWith('data:image/')) return saved;
    } catch {}
    return DEFAULT_MANGO_IMG;
  });
  // Hero image staging draft in admin portal
  const [heroImageDraft, setHeroImageDraft] = useState<string | null>(null);

  // Storefront weight selections for each product card: { [productId]: WeightVariant }
  const [selectedWeights, setSelectedWeights] = useState<Record<string, WeightVariant>>({
    'mango-achar': '500g',
    'garlic-achar': '500g',
    'mix-achar': '500g',
  });

  // Hero section weight selection
  const [heroWeight, setHeroWeight] = useState<WeightVariant>('500g');

  // Shopping Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('taste_heven_cart_v9');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Checkout State & Order Flow
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutDirectItem, setCheckoutDirectItem] = useState<CartItem | null>(null);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [orderSuccessRecord, setOrderSuccessRecord] = useState<OrderRecord | null>(null);

  // Customer Checkout Form fields
  const [customerForm, setCustomerForm] = useState({
    name: '',
    phone: '',
    email: '',
    city: 'Lahore',
    area: 'Gulberg',
    address: '',
    landmark: '',
  });

  // Received Orders Record for Admin View
  const [receivedOrders, setReceivedOrders] = useState<OrderRecord[]>(() => {
    try {
      const saved = localStorage.getItem('taste_heven_orders_v9');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  // Admin active tab: 'products' | 'orders'
  const [adminTab, setAdminTab] = useState<'products' | 'orders'>('products');

  // New category creation form
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryUrdu, setNewCategoryUrdu] = useState('');
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // New product form in Admin Portal with full 250g, 500g, 1kg prices
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProductForm, setNewProductForm] = useState({
    name: '',
    romanUrduTitle: '',
    category: 'achar',
    price250g: 350,
    price500g: 650,
    price1kg: 1200,
    weight: '500g Jar',
    image: DEFAULT_MANGO_IMG,
    description: '',
  });

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Preload primary images on mount
  useEffect(() => {
    const urls = [
      DEFAULT_MANGO_IMG,
      DEFAULT_GARLIC_IMG,
      DEFAULT_MIX_IMG,
      '/images/mango_achar.jpg',
      '/images/garlic_achar.jpg',
      '/images/mix_achar.jpg',
    ];
    urls.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    if (window.location.search.includes('admin') || window.location.hash.includes('admin')) {
      setIsPasswordModalOpen(true);
    }
  }, []);

  // Persist products to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('taste_heven_achar_products_v9', JSON.stringify(products));
    } catch (e) {
      console.warn('localStorage save error', e);
    }
  }, [products]);

  // Persist categories to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('taste_heven_categories_v9', JSON.stringify(categories));
    } catch (e) {
      console.warn('localStorage save error', e);
    }
  }, [categories]);

  // Persist cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('taste_heven_cart_v9', JSON.stringify(cart));
    } catch (e) {
      console.warn('Cart save error', e);
    }
  }, [cart]);

  // Persist orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('taste_heven_orders_v9', JSON.stringify(receivedOrders));
    } catch (e) {
      console.warn('Orders save error', e);
    }
  }, [receivedOrders]);

  // Handle Admin Login Check (strictly confidential password validation for HEVEN123)
  const handleAdminLoginSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const entered = enteredPassword.trim().toLowerCase();
    const current = adminPassword.trim().toLowerCase();
    if (entered === current || entered === 'heven123') {
      setIsAdminLoggedIn(true);
      try {
        localStorage.setItem('taste_heven_admin_logged_in', 'true');
      } catch {}
      setIsPasswordModalOpen(false);
      setEnteredPassword('');
      setPasswordError('');
      setViewMode('admin');
      showToast('Welcome to Admin Portal! لاگ اِن کامیاب');
    } else {
      setPasswordError('غلط پاسورڈ! دوبارہ کوشش کریں۔');
    }
  };

  // Handle Admin Logout
  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    try {
      localStorage.setItem('taste_heven_admin_logged_in', 'false');
    } catch {}
    setViewMode('store');
    showToast('پورٹل سے لاگ آؤٹ ہو گئے');
  };

  // Change Admin Password
  const handleSaveNewPassword = () => {
    if (!newPasswordInput.trim()) return;
    setAdminPassword(newPasswordInput.trim());
    try {
      localStorage.setItem('taste_heven_admin_pwd', newPasswordInput.trim());
    } catch {}
    setIsChangingPassword(false);
    setNewPasswordInput('');
    showToast(`ایڈمن پاسورڈ کامیابی سے اپڈیٹ ہو گیا: ${newPasswordInput.trim()}`);
  };

  // Handle direct file upload for any product
  const handleFileUpload = async (productId: string, file: File) => {
    if (!file) return;
    try {
      const newImgData = await processImageFile(file, 800, 800, 0.82);
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, image: newImgData } : p))
      );
      if (productId === 'mango-achar') {
        setHeroImage(newImgData);
        try {
          localStorage.setItem('taste_heven_hero_jar_v9', newImgData);
        } catch {}
      }
      showToast('تصویر فوری اپلوڈ ہو گئی (Photo Updated Live)');
    } catch (err) {
      console.warn('Image processing fallback:', err);
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setProducts((prev) =>
            prev.map((p) => (p.id === productId ? { ...p, image: reader.result as string } : p))
          );
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Select Hero Draft File
  const handleHeroDraftSelect = async (file: File) => {
    if (!file) return;
    try {
      const compressed = await processImageFile(file, 800, 800, 0.82);
      setHeroImageDraft(compressed);
    } catch {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setHeroImageDraft(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Explicit Save Hero Image Functionality
  const handleSaveHeroImage = () => {
    if (!heroImageDraft) return;
    setHeroImage(heroImageDraft);
    try {
      localStorage.setItem('taste_heven_hero_jar_v9', heroImageDraft);
    } catch (e) {
      console.warn('Hero image save error:', e);
    }
    setHeroImageDraft(null);
    showToast('ہیرو جار کی تصویر کامیابی سے محفوظ ہو گئی اور ویب سائٹ پر لائیو تبدیل ہو گئی!');
  };

  // Add New Category Functionality
  const handleCreateCategory = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newCategoryName.trim()) return;
    const slug = newCategoryName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
    if (categories.some((c) => c.id === slug)) {
      alert('یہ کیٹیگری پہلے سے موجود ہے!');
      return;
    }
    const created: CategoryItem = {
      id: slug,
      name: newCategoryName.trim(),
      romanUrduTitle: newCategoryUrdu.trim() || newCategoryName.trim(),
    };
    setCategories([...categories, created]);
    setNewProductForm((prev) => ({ ...prev, category: slug }));
    setNewCategoryName('');
    setNewCategoryUrdu('');
    setIsCategoryModalOpen(false);
    showToast(`نئی کیٹیگری شامل کر دی گئی: ${created.name}`);
  };

  // Delete Category Functionality
  const handleDeleteCategory = (catId: string) => {
    if (catId === 'all' || catId === 'achar') {
      alert('بنیادی کیٹیگری حذف نہیں کی جا سکتی!');
      return;
    }
    if (confirm('کیا آپ واقعی یہ کیٹیگری حذف کرنا چاہتے ہیں؟')) {
      setCategories((prev) => prev.filter((c) => c.id !== catId));
      if (activeCategory === catId) setActiveCategory('all');
      showToast('کیٹیگری حذف کر دی گئی');
    }
  };

  // Reset to original defaults
  const handleResetDefaults = () => {
    if (!confirm('تمام پروڈکٹس، ہیرو تصویر اور کیٹیگریز اصل حالت پر ری سیٹ کریں؟')) return;
    setProducts(INITIAL_PRODUCTS);
    setCategories(INITIAL_CATEGORIES);
    setHeroImage(DEFAULT_MANGO_IMG);
    setHeroImageDraft(null);
    setAdminPassword(DEFAULT_ADMIN_PASSWORD);
    try {
      localStorage.removeItem('taste_heven_achar_products_v9');
      localStorage.removeItem('taste_heven_categories_v9');
      localStorage.removeItem('taste_heven_hero_jar_v9');
      localStorage.removeItem('taste_heven_admin_pwd');
    } catch {}
    showToast('تمام تصاویر، پروڈکٹس اور پاسورڈ ری سیٹ کر دیے گئے');
  };

  // --- CART FUNCTIONS ---
  const handleAddToCart = (product: ProductItem, weight: WeightVariant) => {
    const unitPrice = getPriceForWeight(product, weight);
    const cartItemId = `${product.id}-${weight}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.cartItemId === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          cartItemId,
          productId: product.id,
          name: product.name,
          romanUrduTitle: product.romanUrduTitle,
          weight,
          unitPrice,
          quantity: 1,
          image: product.image,
        },
      ];
    });

    showToast(`✓ ${product.name} (${weight}) added to cart!`);
  };

  const handleUpdateCartQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  // Total cart items count
  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Cart total in PKR
  const cartSubtotal = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

  // Open Direct "Order Now" Checkout
  const handleDirectOrderNow = (product: ProductItem, weight: WeightVariant) => {
    const unitPrice = getPriceForWeight(product, weight);
    const directItem: CartItem = {
      cartItemId: `${product.id}-${weight}`,
      productId: product.id,
      name: product.name,
      romanUrduTitle: product.romanUrduTitle,
      weight,
      unitPrice,
      quantity: 1,
      image: product.image,
    };
    setCheckoutDirectItem(directItem);
    setIsCheckoutOpen(true);
  };

  // Open Full Cart Checkout
  const handleOpenCartCheckout = () => {
    if (cart.length === 0) return;
    setCheckoutDirectItem(null);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Items currently in the checkout modal
  const activeCheckoutItems: CartItem[] = checkoutDirectItem
    ? [checkoutDirectItem]
    : cart;

  const checkoutSubtotal = activeCheckoutItems.reduce(
    (acc, it) => acc + it.unitPrice * it.quantity,
    0
  );
  // Free delivery for orders >= 1000, otherwise 150 PKR
  const checkoutDeliveryFee = checkoutSubtotal >= 1000 ? 0 : 150;
  const checkoutGrandTotal = checkoutSubtotal + checkoutDeliveryFee;

  // Submit Order Handler
  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerForm.name.trim()) {
      alert('براہ کرم اپنا پورا نام درج کریں (Please enter full name)');
      return;
    }
    if (!customerForm.phone.trim()) {
      alert('براہ کرم اپنا فون نمبر / واٹس ایپ درج کریں (Please enter phone number)');
      return;
    }
    if (!customerForm.address.trim()) {
      alert('براہ کرم اپنا مکمل پتہ درج کریں (Please enter complete delivery address)');
      return;
    }

    setIsSubmittingOrder(true);

    const orderId = `TH-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: OrderRecord = {
      id: orderId,
      customerName: customerForm.name.trim(),
      phone: customerForm.phone.trim(),
      email: customerForm.email.trim() || 'N/A',
      city: 'Lahore',
      address: `${customerForm.address.trim()}, ${customerForm.area}`,
      landmark: customerForm.landmark.trim() || undefined,
      items: activeCheckoutItems.map((it) => ({
        name: it.name,
        weight: it.weight,
        unitPrice: it.unitPrice,
        quantity: it.quantity,
        itemTotal: it.unitPrice * it.quantity,
      })),
      subtotal: checkoutSubtotal,
      deliveryFee: checkoutDeliveryFee,
      total: checkoutGrandTotal,
      paymentMethod: 'Cash on Delivery (COD)',
      status: 'Pending',
      createdAt: new Date().toLocaleString('en-PK', { timeZone: 'Asia/Karachi' }),
    };

    setTimeout(() => {
      // Save order
      setReceivedOrders((prev) => [newOrder, ...prev]);

      // If checkout was from full cart, clear cart
      if (!checkoutDirectItem) {
        setCart([]);
      }

      setIsSubmittingOrder(false);
      setIsCheckoutOpen(false);
      setOrderSuccessRecord(newOrder);
      showToast(`آرڈر نمبر ${orderId} کامیابی سے بک ہو گیا!`);
    }, 600);
  };

  // WhatsApp Order Confirmation String
  const generateWhatsAppOrderText = (order: OrderRecord) => {
    const itemsList = order.items
      .map(
        (it, idx) =>
          `${idx + 1}. ${it.name} (${it.weight}) x ${it.quantity} = Rs ${it.itemTotal}`
      )
      .join('\n');

    return `*NEW ORDER CONFIRMATION - TASTE HEVEN*\nOrder ID: ${order.id}\nCustomer: ${order.customerName}\nPhone: ${order.phone}\nEmail: ${order.email}\nCity: Lahore\nAddress: ${order.address}\n${order.landmark ? `Landmark: ${order.landmark}\n` : ''}\n*Items:*\n${itemsList}\n\n*Subtotal:* Rs ${order.subtotal}\n*Delivery Fee:* Rs ${order.deliveryFee} ${order.deliveryFee === 0 ? '(Free Delivery)' : ''}\n*Total Payable (COD):* Rs ${order.total}\n\nPayment: Cash on Delivery Lahore`;
  };

  const getGeneralWhatsAppUrl = () => {
    const message =
      'As-salamu Alaikum, mujhe TASTE HEVEN website se achar order karna hai. Lahore delivery chahiye.';
    return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
  };

  const scrollToProducts = () => {
    const el = document.getElementById('products');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filtered products list based on active category
  const filteredProducts =
    activeCategory === 'all'
      ? products
      : products.filter((p) => p.category === activeCategory);

  // ==========================================
  // VIEW 1: ADMIN PORTAL
  // ==========================================
  if (viewMode === 'admin') {
    return (
      <div className="min-h-screen bg-neutral-50 text-neutral-900 font-['Poppins',sans-serif]">
        {/* Admin Top Bar */}
        <header className="sticky top-0 z-40 bg-white border-b border-neutral-200 shadow-xs">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-lg sm:text-xl font-black text-black tracking-tight">
                TASTE HEVEN
              </span>
              <span className="text-[10px] sm:text-xs bg-black text-white font-semibold px-2 py-0.5 rounded-md">
                Admin Portal
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Switch View Tabs */}
              <div className="flex bg-neutral-100 p-0.5 rounded-full border border-neutral-200">
                <button
                  onClick={() => setAdminTab('products')}
                  className={`px-3 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                    adminTab === 'products' ? 'bg-black text-white shadow-xs' : 'text-neutral-600 hover:text-black'
                  }`}
                >
                  پروڈکٹس مینیجر
                </button>
                <button
                  onClick={() => setAdminTab('orders')}
                  className={`px-3 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer flex items-center gap-1 ${
                    adminTab === 'orders' ? 'bg-black text-white shadow-xs' : 'text-neutral-600 hover:text-black'
                  }`}
                >
                  <span>آرڈرز ({receivedOrders.length})</span>
                  {receivedOrders.filter((o) => o.status === 'Pending').length > 0 && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  )}
                </button>
              </div>

              <button
                onClick={() => setViewMode('store')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black hover:bg-neutral-800 text-white text-xs font-semibold rounded-full shadow-sm transition-all cursor-pointer ml-1"
              >
                <Store className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">دکان پر جائیں (View Store)</span>
                <span className="sm:hidden">Store</span>
              </button>
              <button
                onClick={handleAdminLogout}
                className="px-2.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold rounded-full transition-colors cursor-pointer"
                title="Logout"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Admin Content Area */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          {adminTab === 'orders' ? (
            /* TAB: CUSTOMER ORDERS LIST */
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-black flex items-center gap-2">
                    <FileText className="w-6 h-6 text-black" />
                    <span>گاہکوں کے موصولہ آرڈرز (Customer Orders)</span>
                  </h1>
                  <p className="text-xs sm:text-sm text-neutral-600 mt-1">
                    ویب سائٹ سے کسٹمرز کے بک کیے گئے آرڈرز، فون نمبر، ای میل اور پتے کی تفصیلات۔
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-neutral-500 font-semibold block">کل آرڈرز</span>
                  <span className="text-2xl font-black text-black">{receivedOrders.length}</span>
                </div>
              </div>

              {receivedOrders.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-neutral-200">
                  <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-neutral-800">ابھی تک کوئی نیا آرڈر موصول نہیں ہوا</h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    جیسے ہی کوئی گاہک آرڈر کرے گا، اس کی تمام تفصیلات خودکار طور پر یہاں محفوظ ہو جائیں گی۔
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {receivedOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-xs hover:border-neutral-300 transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-100">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-black font-mono bg-neutral-100 px-2.5 py-1 rounded-md text-black">
                            {ord.id}
                          </span>
                          <span
                            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                              ord.status === 'Delivered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {ord.status === 'Delivered' ? 'ڈیلیور ہو چکا (Delivered)' : 'زیرِ التواء (Pending COD)'}
                          </span>
                          <span className="text-xs text-neutral-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {ord.createdAt}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href={`https://wa.me/${ord.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                              `As-salamu Alaikum ${ord.customerName}, TASTE HEVEN Lahore se apke order ${ord.id} ke hawale se rabta kar rahe hain.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold rounded-full transition-colors"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>کسٹمر سے واٹس ایپ رابطہ</span>
                          </a>

                          <button
                            onClick={() => {
                              const newStatus = ord.status === 'Pending' ? 'Delivered' : 'Pending';
                              setReceivedOrders((prev) =>
                                prev.map((o) => (o.id === ord.id ? { ...o, status: newStatus } : o))
                              );
                              showToast(`آرڈر اسٹیٹس تبدیل ہو گیا: ${newStatus}`);
                            }}
                            className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold rounded-full transition-colors cursor-pointer"
                          >
                            اسٹیٹس بدلیں
                          </button>
                        </div>
                      </div>

                      {/* Customer Info Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-3 text-xs">
                        <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-100">
                          <span className="text-[10px] text-neutral-400 font-bold block uppercase">گاہک کا نام و رابطہ</span>
                          <span className="font-bold text-black text-sm block mt-0.5">{ord.customerName}</span>
                          <span className="font-mono text-neutral-700 block mt-0.5 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-neutral-400" /> {ord.phone}
                          </span>
                          {ord.email && ord.email !== 'N/A' && (
                            <span className="text-neutral-600 block mt-0.5 flex items-center gap-1 truncate">
                              <Mail className="w-3 h-3 text-neutral-400 shrink-0" /> {ord.email}
                            </span>
                          )}
                        </div>

                        <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-100 sm:col-span-2">
                          <span className="text-[10px] text-neutral-400 font-bold block uppercase">ڈیلیوری کا پتہ (لاہور)</span>
                          <span className="font-medium text-neutral-900 block mt-0.5 flex items-start gap-1">
                            <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                            <span>{ord.address}</span>
                          </span>
                          {ord.landmark && (
                            <span className="text-neutral-500 block mt-1 text-[11px]">
                              <strong>قریبی جگہ / نشان:</strong> {ord.landmark}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Order Items Table */}
                      <div className="bg-neutral-50/50 rounded-xl p-3 border border-neutral-100">
                        <span className="text-[10px] text-neutral-400 font-bold block uppercase mb-1.5">
                          آرڈر کردہ اشیاء (Ordered Items)
                        </span>
                        <div className="space-y-1">
                          {ord.items.map((it, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs">
                              <span className="font-medium text-neutral-800">
                                {it.name} <span className="bg-neutral-200 px-1.5 py-0.2 rounded text-[10px] font-bold ml-1">{it.weight}</span> x {it.quantity}
                              </span>
                              <span className="font-mono font-bold text-black">Rs {it.itemTotal}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-2 pt-2 border-t border-neutral-200 flex items-center justify-between text-xs font-bold text-black">
                          <span>
                            کل رقم (COD Total) {ord.deliveryFee === 0 ? '(Free Delivery)' : `(+ Rs ${ord.deliveryFee} Del)`}:
                          </span>
                          <span className="text-sm font-black text-emerald-700">Rs {ord.total}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* TAB: PRODUCTS & PHOTOS MANAGER */
            <div>
              {/* Top Info Banner & Actions */}
              <div className="bg-white rounded-2xl p-6 border border-neutral-200 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-black">
                    پروڈکٹس اور فوٹوز مینیجر
                  </h1>
                  <p className="text-xs sm:text-sm text-neutral-600 mt-1">
                    یہاں سے آپ پروڈکٹس کے تمام وزن (250g, 500g, 1kg) کی قیمت، تصویر اور کیٹیگریز کنٹرول کر سکتے ہیں۔
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                  {/* Add Product Button */}
                  <button
                    onClick={() => setIsAddingProduct(!isAddingProduct)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-black text-white rounded-full text-xs font-semibold hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>نیا پروڈکٹ شامل کریں</span>
                  </button>
                  {/* Create Category Button */}
                  <button
                    onClick={() => setIsCategoryModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-neutral-100 text-neutral-800 hover:bg-neutral-200 rounded-full text-xs font-semibold transition-colors cursor-pointer border border-neutral-300"
                  >
                    <FolderPlus className="w-4 h-4 text-amber-600" />
                    <span>نئی کیٹیگری بنائیں</span>
                  </button>
                  {/* Change Password Button */}
                  <button
                    onClick={() => setIsChangingPassword(!isChangingPassword)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-neutral-100 text-neutral-800 hover:bg-neutral-200 rounded-full text-xs font-semibold transition-colors cursor-pointer border border-neutral-300"
                  >
                    <Key className="w-4 h-4 text-neutral-600" />
                    <span>پاسورڈ بدلیں</span>
                  </button>
                  {/* Reset to Defaults */}
                  <button
                    onClick={handleResetDefaults}
                    className="inline-flex items-center gap-1 px-3 py-2 bg-neutral-100 text-neutral-700 hover:bg-neutral-200 rounded-full text-xs font-semibold transition-colors cursor-pointer"
                    title="Reset to default images and products"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>ری سیٹ</span>
                  </button>
                </div>
              </div>

              {/* Change Password Form (Accordion) */}
              {isChangingPassword && (
                <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200 mb-8 max-w-md">
                  <h3 className="text-xs font-bold text-neutral-800 uppercase mb-2">
                    نیا ایڈمن پاسورڈ سیٹ کریں:
                  </h3>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      placeholder="نیا پاسورڈ درج کریں..."
                      value={newPasswordInput}
                      onChange={(e) => setNewPasswordInput(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs bg-white border border-neutral-300 rounded-xl focus:outline-none focus:border-black font-mono"
                    />
                    <button
                      onClick={handleSaveNewPassword}
                      className="px-4 py-2 bg-black text-white text-xs font-bold rounded-xl hover:bg-neutral-800 cursor-pointer"
                    >
                      محفوظ کریں
                    </button>
                    <button
                      onClick={() => setIsChangingPassword(false)}
                      className="px-3 py-2 text-xs text-neutral-500 hover:text-black cursor-pointer"
                    >
                      کینسل
                    </button>
                  </div>
                </div>
              )}

              {/* SECTION 1: HERO CENTER JAR PHOTO WITH DEDICATED SAVE BUTTON */}
              <div className="bg-white rounded-2xl p-6 border border-neutral-200 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-sm font-extrabold text-black uppercase tracking-wider">
                      ہوم پیج ہیرو جار فوٹو (Homepage Hero Center Jar Photo)
                    </h2>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      تصویر منتخب کرنے کے بعد فوراً 'محفوظ کریں (Save)' دبائیں تاکہ ہوم پیج پر لائیو تبدیل ہو جائے۔
                    </p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-6">
                  {/* Current Live Image */}
                  <div className="text-center">
                    <div className="w-32 h-32 rounded-xl bg-neutral-50 p-2 border border-neutral-200 flex items-center justify-center">
                      <img
                        src={heroImage}
                        alt="Hero Jar Preview"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="text-[10px] font-bold text-neutral-500 mt-1 block">
                      موجودہ لائیو تصویر
                    </span>
                  </div>

                  {/* Staged Draft Preview (if chosen) */}
                  {heroImageDraft && (
                    <div className="text-center animate-fade-in">
                      <div className="w-32 h-32 rounded-xl bg-amber-50 p-2 border-2 border-amber-500 flex items-center justify-center">
                        <img
                          src={heroImageDraft}
                          alt="New Draft"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span className="text-[10px] font-bold text-amber-700 mt-1 block">
                        نئی تصویر (غیر محفوظ)
                      </span>
                    </div>
                  )}

                  {/* Actions & Save Button */}
                  <div className="space-y-3 text-center md:text-left flex-1">
                    <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start">
                      <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-xs font-semibold rounded-full cursor-pointer transition-colors border border-neutral-300">
                        <Upload className="w-3.5 h-3.5 text-black" />
                        <span>نئی تصویر منتخب کریں (Browse Photo)</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) handleHeroDraftSelect(f);
                          }}
                        />
                      </label>

                      {heroImageDraft && (
                        <>
                          <button
                            onClick={handleSaveHeroImage}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-full cursor-pointer shadow-md transition-all animate-bounce"
                          >
                            <Check className="w-4 h-4 stroke-[3]" />
                            <span>محفوظ کریں (Save Hero Image Live)</span>
                          </button>
                          <button
                            onClick={() => setHeroImageDraft(null)}
                            className="px-3 py-2 text-xs text-neutral-500 hover:text-black cursor-pointer"
                          >
                            منسوخ
                          </button>
                        </>
                      )}
                    </div>

                    <p className="text-[11px] text-neutral-500">
                      سفارش: سفید پس منظر والی شفاف یا صاف فوٹو منتخب کریں۔ سیو کرنے پر یہ ویب سائٹ کے سب سے اوپر مین بینر پر فوری لگ جائے گی۔
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION 2: CATEGORY MANAGER */}
              <div className="bg-white rounded-2xl p-6 border border-neutral-200 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-amber-600" />
                    <h2 className="text-sm font-extrabold text-black uppercase tracking-wider">
                      کیٹیگریز مینیجر (Categories Management)
                    </h2>
                  </div>
                  <button
                    onClick={() => setIsCategoryModalOpen(true)}
                    className="text-xs text-amber-700 font-bold hover:underline inline-flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>نئی کیٹیگری بنائیں</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {categories.map((cat) => {
                    const count =
                      cat.id === 'all'
                        ? products.length
                        : products.filter((p) => p.category === cat.id).length;
                    return (
                      <div
                        key={cat.id}
                        className="inline-flex items-center gap-2 bg-neutral-100 border border-neutral-200 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-neutral-800"
                      >
                        <span>{cat.name}</span>
                        <span className="text-[10px] text-neutral-500">({cat.romanUrduTitle})</span>
                        <span className="bg-white px-2 py-0.5 rounded-full text-[10px] text-black font-bold">
                          {count} items
                        </span>
                        {cat.id !== 'all' && cat.id !== 'achar' && (
                          <button
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="text-neutral-400 hover:text-red-600 ml-1"
                            title="Delete category"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 3: ADD NEW PRODUCT FORM WITH COMPLETE WEIGHT PRICING */}
              {isAddingProduct && (
                <div className="bg-white rounded-2xl p-6 border-2 border-black mb-8 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-bold text-black flex items-center gap-2">
                      <Plus className="w-4 h-4 text-emerald-600" />
                      <span>نیا پروڈکٹ شامل کریں (Add New Product With Weight Prices)</span>
                    </h2>
                    <button
                      onClick={() => setIsAddingProduct(false)}
                      className="p-1 text-neutral-400 hover:text-black"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Product Name (English) *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Kasuri Methi Achar"
                        value={newProductForm.name}
                        onChange={(e) =>
                          setNewProductForm({ ...newProductForm, name: e.target.value })
                        }
                        className="w-full px-3.5 py-2 text-xs border border-neutral-300 rounded-xl focus:outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Roman Urdu Subtitle
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Kasuri Methi Aur Sarson Ka Achar"
                        value={newProductForm.romanUrduTitle}
                        onChange={(e) =>
                          setNewProductForm({ ...newProductForm, romanUrduTitle: e.target.value })
                        }
                        className="w-full px-3.5 py-2 text-xs border border-neutral-300 rounded-xl focus:outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-neutral-700">Category *</label>
                        <button
                          type="button"
                          onClick={() => setIsCategoryModalOpen(true)}
                          className="text-[11px] text-amber-700 font-bold hover:underline"
                        >
                          + نئی کیٹیگری
                        </button>
                      </div>
                      <select
                        value={newProductForm.category}
                        onChange={(e) =>
                          setNewProductForm({ ...newProductForm, category: e.target.value })
                        }
                        className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl focus:outline-none focus:border-black bg-white"
                      >
                        {categories
                          .filter((c) => c.id !== 'all')
                          .map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name} ({c.romanUrduTitle})
                            </option>
                          ))}
                      </select>
                    </div>

                    {/* Weight Pricing Row: 250g, 500g, 1kg */}
                    <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200 sm:col-span-2 lg:col-span-3">
                      <span className="text-xs font-extrabold text-black block mb-2">
                        وزن کے لحاظ سے قیمتیں درج کریں (Weight & Pricing Details) *
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-neutral-600 mb-1">
                            Price for 250g (۲۵۰ گرام قیمت)
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-2 text-xs text-neutral-400 font-semibold">Rs</span>
                            <input
                              type="number"
                              value={newProductForm.price250g}
                              onChange={(e) =>
                                setNewProductForm({
                                  ...newProductForm,
                                  price250g: Number(e.target.value) || 0,
                                })
                              }
                              className="w-full pl-9 pr-3 py-1.5 text-xs font-bold border border-neutral-300 rounded-xl focus:outline-none focus:border-black bg-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-neutral-600 mb-1">
                            Price for 500g (۵۰۰ گرام قیمت) *
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-2 text-xs text-neutral-400 font-semibold">Rs</span>
                            <input
                              type="number"
                              value={newProductForm.price500g}
                              onChange={(e) =>
                                setNewProductForm({
                                  ...newProductForm,
                                  price500g: Number(e.target.value) || 0,
                                })
                              }
                              className="w-full pl-9 pr-3 py-1.5 text-xs font-bold border border-neutral-300 rounded-xl focus:outline-none focus:border-black bg-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-neutral-600 mb-1">
                            Price for 1kg (۱ کلو قیمت)
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-2 text-xs text-neutral-400 font-semibold">Rs</span>
                            <input
                              type="number"
                              value={newProductForm.price1kg}
                              onChange={(e) =>
                                setNewProductForm({
                                  ...newProductForm,
                                  price1kg: Number(e.target.value) || 0,
                                })
                              }
                              className="w-full pl-9 pr-3 py-1.5 text-xs font-bold border border-neutral-300 rounded-xl focus:outline-none focus:border-black bg-white"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="sm:col-span-2 lg:col-span-3">
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Upload Product Photo *
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            try {
                              const compressed = await processImageFile(file, 800, 800, 0.82);
                              setNewProductForm((prev) => ({ ...prev, image: compressed }));
                            } catch {
                              const reader = new FileReader();
                              reader.onload = () => {
                                if (typeof reader.result === 'string') {
                                  setNewProductForm((prev) => ({ ...prev, image: reader.result as string }));
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }
                        }}
                        className="w-full text-xs text-neutral-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-black file:text-white hover:file:bg-neutral-800"
                      />
                    </div>

                    <div className="sm:col-span-2 lg:col-span-3">
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Product Description (تفصیل / اجزاء)
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Khaalis kachi ghani sarson ke teil mein tayyar shuda..."
                        value={newProductForm.description}
                        onChange={(e) =>
                          setNewProductForm({ ...newProductForm, description: e.target.value })
                        }
                        className="w-full px-3.5 py-2 text-xs border border-neutral-300 rounded-xl focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>

                  {/* Photo Preview & Save Button */}
                  <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-neutral-50 border border-neutral-200 p-1 flex items-center justify-center shrink-0">
                        <img
                          src={newProductForm.image}
                          alt="Preview"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span className="text-xs text-neutral-500">پروڈکٹ فوٹو پریویو (Preview)</span>
                    </div>

                    <button
                      onClick={() => {
                        if (!newProductForm.name) {
                          alert('براہ کرم پروڈکٹ کا نام درج کریں');
                          return;
                        }
                        const created: ProductItem = {
                          id: `prod-${Date.now()}`,
                          name: newProductForm.name,
                          romanUrduTitle: newProductForm.romanUrduTitle || newProductForm.name,
                          category: newProductForm.category || 'achar',
                          price: newProductForm.price500g || 650,
                          price250g: newProductForm.price250g || 350,
                          price500g: newProductForm.price500g || 650,
                          price1kg: newProductForm.price1kg || 1200,
                          weight: '500g Jar',
                          image: newProductForm.image || DEFAULT_MANGO_IMG,
                          altText: `${newProductForm.name} Lahore - TASTE HEVEN`,
                          description: newProductForm.description || 'Ghar jaisa khaalis achar.',
                        };
                        setProducts([...products, created]);
                        setIsAddingProduct(false);
                        setNewProductForm({
                          name: '',
                          romanUrduTitle: '',
                          category: 'achar',
                          price250g: 350,
                          price500g: 650,
                          price1kg: 1200,
                          weight: '500g Jar',
                          image: DEFAULT_MANGO_IMG,
                          description: '',
                        });
                        showToast('نیا پروڈکٹ تمام وزن اور قیمتوں کے ساتھ شامل ہو گیا!');
                      }}
                      className="px-6 py-2.5 bg-black text-white text-xs font-bold rounded-full hover:bg-neutral-800 transition-colors cursor-pointer"
                    >
                      محفوظ کریں (Save Product)
                    </button>
                  </div>
                </div>
              )}

              {/* SECTION 4: ALL PRODUCTS LIST & WEIGHT PRICE MANAGER */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-extrabold text-black uppercase tracking-wider">
                    تمام پروڈکٹس ({products.length} Items) — تصویر اور ہر وزن (250g, 500g, 1kg) کی قیمت
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((prod) => (
                    <div
                      key={prod.id}
                      className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-xs flex flex-col justify-between"
                    >
                      <div>
                        {/* Product Photo with Upload Overlay */}
                        <div className="relative w-full aspect-square bg-neutral-50 rounded-xl overflow-hidden mb-3 border border-neutral-100 flex items-center justify-center p-3 group">
                          <img
                            src={prod.image}
                            alt={prod.altText}
                            className="w-full h-full object-contain"
                          />

                          {/* Direct Upload Overlay */}
                          <label
                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-bold gap-1 cursor-pointer"
                            title="Click to replace photo"
                          >
                            <Camera className="w-6 h-6 text-white" />
                            <span>نئی تصویر اپلوڈ کریں</span>
                            <span className="text-[10px] text-neutral-300">(Click to Upload)</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileUpload(prod.id, file);
                              }}
                            />
                          </label>
                        </div>

                        {/* Quick Button to Change Picture */}
                        <label className="w-full mb-3 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold rounded-xl cursor-pointer transition-colors border border-neutral-200">
                          <Upload className="w-3.5 h-3.5 text-black" />
                          <span>تصویر بدلیں (Change Photo)</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload(prod.id, file);
                            }}
                          />
                        </label>

                        {/* Editable Product Details */}
                        <div className="space-y-3 text-left">
                          {/* Name & Roman Urdu */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[11px] font-bold text-neutral-600 mb-0.5">
                                Product Name (نام) *
                              </label>
                              <input
                                type="text"
                                value={prod.name}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setProducts((prev) =>
                                    prev.map((p) =>
                                      p.id === prod.id
                                        ? { ...p, name: val, altText: `${val} Lahore - TASTE HEVEN` }
                                        : p
                                    )
                                  );
                                }}
                                className="w-full px-2.5 py-1.5 text-xs font-bold text-black border border-neutral-300 rounded-lg focus:outline-none focus:border-black"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-neutral-600 mb-0.5">
                                Roman Urdu Subtitle
                              </label>
                              <input
                                type="text"
                                value={prod.romanUrduTitle}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setProducts((prev) =>
                                    prev.map((p) => (p.id === prod.id ? { ...p, romanUrduTitle: val } : p))
                                  );
                                }}
                                className="w-full px-2.5 py-1.5 text-xs text-neutral-800 border border-neutral-300 rounded-lg focus:outline-none focus:border-black"
                              />
                            </div>
                          </div>

                          {/* Weight & Prices for 250g, 500g, 1kg */}
                          <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-200">
                            <span className="text-[11px] font-extrabold text-neutral-800 block mb-1.5">
                              وزن کے حساب سے قیمتیں (Weight Pricing Details):
                            </span>
                            <div className="grid grid-cols-3 gap-1.5">
                              <div>
                                <label className="block text-[10px] font-bold text-neutral-500 mb-0.5">
                                  250g (۲۵۰ گرام)
                                </label>
                                <div className="relative">
                                  <span className="absolute left-1.5 top-1.5 text-[10px] text-neutral-400 font-bold">Rs</span>
                                  <input
                                    type="number"
                                    value={prod.price250g || 0}
                                    onChange={(e) => {
                                      const val = Number(e.target.value) || 0;
                                      setProducts((prev) =>
                                        prev.map((p) => (p.id === prod.id ? { ...p, price250g: val } : p))
                                      );
                                    }}
                                    className="w-full pl-6 pr-1.5 py-1 text-xs font-bold text-black border border-neutral-300 rounded-md focus:outline-none focus:border-black bg-white"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-[10px] font-bold text-neutral-500 mb-0.5">
                                  500g (۵۰۰ گرام)
                                </label>
                                <div className="relative">
                                  <span className="absolute left-1.5 top-1.5 text-[10px] text-neutral-400 font-bold">Rs</span>
                                  <input
                                    type="number"
                                    value={prod.price500g || prod.price || 0}
                                    onChange={(e) => {
                                      const val = Number(e.target.value) || 0;
                                      setProducts((prev) =>
                                        prev.map((p) =>
                                          p.id === prod.id ? { ...p, price500g: val, price: val } : p
                                        )
                                      );
                                    }}
                                    className="w-full pl-6 pr-1.5 py-1 text-xs font-bold text-black border border-neutral-300 rounded-md focus:outline-none focus:border-black bg-white"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-[10px] font-bold text-neutral-500 mb-0.5">
                                  1kg (۱ کلو)
                                </label>
                                <div className="relative">
                                  <span className="absolute left-1.5 top-1.5 text-[10px] text-neutral-400 font-bold">Rs</span>
                                  <input
                                    type="number"
                                    value={prod.price1kg || 0}
                                    onChange={(e) => {
                                      const val = Number(e.target.value) || 0;
                                      setProducts((prev) =>
                                        prev.map((p) => (p.id === prod.id ? { ...p, price1kg: val } : p))
                                      );
                                    }}
                                    className="w-full pl-6 pr-1.5 py-1 text-xs font-bold text-black border border-neutral-300 rounded-md focus:outline-none focus:border-black bg-white"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Category */}
                          <div>
                            <label className="block text-[11px] font-bold text-neutral-600 mb-0.5">
                              Category (کیٹیگری)
                            </label>
                            <select
                              value={prod.category}
                              onChange={(e) => {
                                const val = e.target.value;
                                setProducts((prev) =>
                                  prev.map((p) => (p.id === prod.id ? { ...p, category: val } : p))
                                );
                              }}
                              className="w-full px-2 py-1.5 text-xs font-semibold text-black border border-neutral-300 rounded-lg focus:outline-none focus:border-black bg-white"
                            >
                              {categories
                                .filter((c) => c.id !== 'all')
                                .map((c) => (
                                  <option key={c.id} value={c.id}>
                                    {c.name}
                                  </option>
                                ))}
                            </select>
                          </div>

                          {/* Description */}
                          <div>
                            <label className="block text-[11px] font-bold text-neutral-600 mb-0.5">
                              Description (تفصیل / اجزاء)
                            </label>
                            <textarea
                              rows={2}
                              value={prod.description}
                              onChange={(e) => {
                                const val = e.target.value;
                                setProducts((prev) =>
                                  prev.map((p) => (p.id === prod.id ? { ...p, description: val } : p))
                                );
                              }}
                              className="w-full px-2.5 py-1.5 text-xs text-neutral-800 border border-neutral-300 rounded-lg focus:outline-none focus:border-black"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
                        <span className="text-[11px] text-emerald-700 font-semibold">
                          ✓ آٹو محفوظ (Auto-Saved)
                        </span>
                        {products.length > 1 && (
                          <button
                            onClick={() => {
                              if (confirm(`${prod.name} کو واقعی حذف کرنا چاہتے ہیں؟`)) {
                                setProducts((prev) => prev.filter((p) => p.id !== prod.id));
                                showToast('پروڈکٹ ہٹا دیا گیا');
                              }
                            }}
                            className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                            title="Delete product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Modal: Add New Category */}
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-extrabold text-black flex items-center gap-2">
                  <FolderPlus className="w-5 h-5 text-amber-600" />
                  <span>نئی کیٹیگری بنائیں (Create New Category)</span>
                </h3>
                <button
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="p-1 text-neutral-400 hover:text-black"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateCategory} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Category Name in English *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Chutney, Sirka, Dry Fruits"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    autoFocus
                    required
                    className="w-full px-3.5 py-2 text-xs border border-neutral-300 rounded-xl focus:outline-none focus:border-black font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Roman Urdu / Urdu Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Chatpati Chutniyan (روایتی چٹنیاں)"
                    value={newCategoryUrdu}
                    onChange={(e) => setNewCategoryUrdu(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs border border-neutral-300 rounded-xl focus:outline-none focus:border-black"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCategoryModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-black cursor-pointer"
                  >
                    کینسل
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-black hover:bg-neutral-800 text-white text-xs font-bold rounded-full shadow-sm cursor-pointer"
                  >
                    کیٹیگری شامل کریں (Add)
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // VIEW 2: CUSTOMER STOREFRONT (CLEAN & MODERN)
  // ==========================================
  return (
    <div className="min-h-screen bg-white text-neutral-900 font-['Poppins',sans-serif] selection:bg-amber-500 selection:text-white flex flex-col justify-between">
      {/* 
        NO BANNER RULE STRICTLY ENFORCED:
        - No top promo banner
        - No announcement bar
        - No discount strip
        - Start directly with clean header
      */}

      {/* 1. HEADER ONLY - LOGO COMPLETELY CENTERED & COMPACT MOBILE ADMIN BUTTON */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-100">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 h-16 sm:h-20 grid grid-cols-3 items-center">
          {/* Left: Ultra-Compact Admin Portal Button (Small on mobile per request) */}
          <div className="flex items-center justify-start">
            <button
              onClick={() => {
                if (isAdminLoggedIn) {
                  setViewMode('admin');
                } else {
                  setIsPasswordModalOpen(true);
                }
              }}
              className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-black text-[9px] sm:text-[11px] font-medium rounded-full border border-neutral-200 transition-colors cursor-pointer whitespace-nowrap"
              title="Admin Portal"
            >
              <Lock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-neutral-500" />
              <span>Admin</span>
            </button>
          </div>

          {/* Center: Logo Name "TASTE HEVEN" in SOLID BLACK, completely centered */}
          <div className="flex items-center justify-center text-center">
            <a
              href="#"
              className="text-lg sm:text-2xl md:text-3xl font-black text-black tracking-tight select-none whitespace-nowrap"
            >
              TASTE HEVEN
            </a>
          </div>

          {/* Right: Cart Button with Badge + Shop Now button */}
          <div className="flex items-center justify-end gap-1.5 sm:gap-3">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-neutral-800 hover:text-black hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
              title="Shopping Cart"
              aria-label="View Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-black text-white text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-xs">
                  {cartItemsCount}
                </span>
              )}
            </button>

            <button
              onClick={scrollToProducts}
              className="hidden sm:inline-flex px-4 py-2 bg-black hover:bg-neutral-800 text-white text-xs sm:text-sm font-semibold rounded-full shadow-sm hover:shadow transition-all duration-200 cursor-pointer whitespace-nowrap"
            >
              Shop Now
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT CONTAINER */}
      <main className="flex-1">
        {/* 2. HERO SECTION - NO BANNER, ONLY PRODUCT & WEIGHT SELECTOR */}
        <section className="pt-8 sm:pt-10 pb-12 sm:pb-16 px-4 sm:px-6 max-w-4xl mx-auto text-center">
          {/* Center Heading H1 */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-black tracking-tight leading-tight">
            Ghar Jaisa Khaalis Achar - Lahore
          </h1>

          {/* Subtext */}
          <p className="mt-2.5 text-xs sm:text-base text-neutral-600 font-medium">
            No Preservatives <span className="text-amber-500 font-bold mx-1">|</span> Pure Oil{' '}
            <span className="text-amber-500 font-bold mx-1">|</span> Homestyle
          </p>

          {/* Big Center Image of Mango Achar Jar (Clean white background, rounded) */}
          <div className="mt-6 sm:mt-8 flex justify-center">
            <div className="w-[260px] h-[260px] sm:w-[320px] sm:h-[320px] bg-white rounded-2xl p-2 border border-neutral-100 shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center justify-center">
              <img
                src={heroImage}
                alt="Mango Achar Lahore - TASTE HEVEN"
                width={320}
                height={320}
                loading="eager"
                decoding="async"
                fetchPriority="high"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  if (target.src !== DEFAULT_MANGO_IMG && target.src !== '/images/mango_achar.jpg') {
                    target.src = DEFAULT_MANGO_IMG || '/images/mango_achar.jpg';
                  }
                }}
                className="w-full h-full object-contain rounded-xl select-none"
              />
            </div>
          </div>

          {/* Hero Weight Selector Pills */}
          {(() => {
            const mangoProd = products.find((p) => p.id === 'mango-achar') || products[0];
            const currentHeroPrice = getPriceForWeight(mangoProd, heroWeight);

            return (
              <div className="mt-6 max-w-xs mx-auto">
                <div className="flex items-center justify-center gap-1.5 p-1 bg-neutral-100 rounded-full border border-neutral-200">
                  {(['250g', '500g', '1kg'] as WeightVariant[]).map((w) => (
                    <button
                      key={w}
                      onClick={() => setHeroWeight(w)}
                      className={`flex-1 py-1 px-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        heroWeight === w
                          ? 'bg-black text-white shadow-xs'
                          : 'text-neutral-600 hover:text-black'
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>

                <div className="mt-2 text-center">
                  <span className="text-2xl font-black text-black">Rs {currentHeroPrice}</span>
                  <span className="text-xs text-neutral-500 font-medium ml-1.5">
                    ({WEIGHT_LABELS[heroWeight].en})
                  </span>
                </div>

                {/* Primary Action Buttons under Hero Jar: Order Now & Add to Cart */}
                <div className="mt-5 flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleDirectOrderNow(mangoProd, heroWeight)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-black hover:bg-neutral-800 text-white font-bold text-xs sm:text-sm rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer"
                  >
                    <span>Order Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleAddToCart(mangoProd, heroWeight)}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-bold text-xs sm:text-sm rounded-full border border-neutral-300 transition-all cursor-pointer"
                    title="Add to Cart"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            );
          })()}
        </section>

        {/* 3. PRODUCTS SECTION - "Our Best Sellers in Lahore" WITH DYNAMIC CATEGORIES */}
        <section id="products" className="py-12 sm:py-16 px-4 sm:px-6 bg-white border-t border-neutral-100">
          <div className="max-w-6xl mx-auto">
            {/* Center Section Heading H2 */}
            <div className="text-center max-w-2xl mx-auto mb-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-black tracking-tight">
                Our Best Sellers in Lahore
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm text-neutral-500 font-medium">
                Ghar Ka Bana Zaiqedaar Achar
              </p>
            </div>

            {/* Dynamic Category Filter Pills */}
            <div className="flex items-center justify-center flex-wrap gap-2 mb-8 sm:mb-10">
              {categories.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-black text-white shadow-sm'
                        : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                    }`}
                  >
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Products Grid: 2 columns on mobile, 3 on desktop */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
                {filteredProducts.map((prod) => {
                  const currentWeight = selectedWeights[prod.id] || '500g';
                  const activePrice = getPriceForWeight(prod, currentWeight);

                  return (
                    <div
                      key={prod.id}
                      className="bg-white border border-neutral-200 rounded-2xl p-4 sm:p-5 text-center flex flex-col justify-between hover:shadow-md hover:border-neutral-300 transition-all duration-200 group"
                    >
                      <div>
                        {/* Product Image (Crisp, Stable & Glitch-Free) */}
                        <div className="w-full aspect-square bg-neutral-50 rounded-xl overflow-hidden mb-3.5 flex items-center justify-center p-2 border border-neutral-100">
                          <img
                            src={prod.image}
                            alt={prod.altText}
                            width={280}
                            height={280}
                            loading="eager"
                            decoding="async"
                            onError={(e) => {
                              const target = e.currentTarget;
                              const fallback =
                                prod.id === 'garlic-achar'
                                  ? DEFAULT_GARLIC_IMG || '/images/garlic_achar.jpg'
                                  : prod.id === 'mix-achar'
                                  ? DEFAULT_MIX_IMG || '/images/mix_achar.jpg'
                                  : DEFAULT_MANGO_IMG || '/images/mango_achar.jpg';
                              if (target.src !== fallback) {
                                target.src = fallback;
                              }
                            }}
                            className="w-full h-full object-contain select-none pointer-events-none"
                          />
                        </div>

                        {/* Product Name H3 */}
                        <h3 className="text-base sm:text-lg font-bold text-black tracking-tight">
                          {prod.name}
                        </h3>

                        {/* Weight Variants Selector (250g, 500g, 1kg) */}
                        <div className="mt-3">
                          <div className="flex items-center justify-center gap-1 p-0.5 bg-neutral-100 rounded-full border border-neutral-200">
                            {(['250g', '500g', '1kg'] as WeightVariant[]).map((w) => (
                              <button
                                key={w}
                                onClick={() =>
                                  setSelectedWeights((prev) => ({ ...prev, [prod.id]: w }))
                                }
                                className={`flex-1 py-1 text-[11px] font-bold rounded-full transition-all cursor-pointer ${
                                  currentWeight === w
                                    ? 'bg-black text-white shadow-xs'
                                    : 'text-neutral-600 hover:text-black'
                                }`}
                              >
                                {w}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Price Display */}
                        <div className="mt-3 flex items-center justify-center gap-1.5">
                          <span className="text-xl sm:text-2xl font-black text-black">
                            Rs {activePrice}
                          </span>
                          <span className="text-[10px] text-neutral-500 font-semibold bg-neutral-100 px-2 py-0.5 rounded-full">
                            {WEIGHT_LABELS[currentWeight].en}
                          </span>
                        </div>
                      </div>

                      {/* TWO DUAL BUTTONS IN PURE ENGLISH: "Add to Cart" & "Order Now" */}
                      <div className="mt-4 pt-3 border-t border-neutral-100 grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleAddToCart(prod, currentWeight)}
                          className="inline-flex items-center justify-center gap-1.5 px-2.5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-xs font-bold rounded-full border border-neutral-200 transition-all cursor-pointer"
                        >
                          <ShoppingCart className="w-3.5 h-3.5 text-neutral-700" />
                          <span className="whitespace-nowrap">Add to Cart</span>
                        </button>

                        <button
                          onClick={() => handleDirectOrderNow(prod, currentWeight)}
                          className="inline-flex items-center justify-center gap-1 px-2.5 py-2.5 bg-black hover:bg-neutral-800 text-white text-xs font-bold rounded-full shadow-xs hover:shadow transition-all cursor-pointer"
                        >
                          <span>Order Now</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center bg-neutral-50 rounded-2xl border border-neutral-200">
                <p className="text-sm text-neutral-600 font-semibold">
                  اس کیٹیگری میں فی الحال کوئی پروڈکٹ موجود نہیں۔
                </p>
                <button
                  onClick={() => setActiveCategory('all')}
                  className="mt-3 px-4 py-2 bg-black text-white text-xs font-bold rounded-full"
                >
                  تمام پروڈکٹس دیکھیں (View All)
                </button>
              </div>
            )}
          </div>
        </section>

        {/* 4. TRUST BADGES */}
        <section className="py-14 px-4 sm:px-6 bg-neutral-50 border-t border-neutral-100">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center">
              {/* Badge 1: 100% Halal */}
              <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-xs flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                  <Check className="w-6 h-6 stroke-[2.5]" />
                </div>
                <h4 className="text-sm sm:text-base font-bold text-black">100% Halal</h4>
                <p className="text-xs text-neutral-500 mt-1">
                  Khaalis pak-o-saaf tareeqay se tayyar shuda
                </p>
              </div>

              {/* Badge 2: Lahore Me Cash on Delivery */}
              <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-xs flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                  <Truck className="w-6 h-6 stroke-[2.5]" />
                </div>
                <h4 className="text-sm sm:text-base font-bold text-black">
                  Lahore Me Cash on Delivery
                </h4>
                <p className="text-xs text-neutral-500 mt-1">
                  Ghar par achar check karein aur payment dein
                </p>
              </div>

              {/* Badge 3: 100% Natural */}
              <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-xs flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                  <Sparkles className="w-6 h-6 stroke-[2.5]" />
                </div>
                <h4 className="text-sm sm:text-base font-bold text-black">100% Natural</h4>
                <p className="text-xs text-neutral-500 mt-1">
                  Bina chemical, bina artificial rang ya sirka
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* PROFESSIONAL LUXURY FOOTER: BRAND, FOUNDERS & CUSTOMER CARE */}
      <footer className="pt-14 pb-12 px-4 sm:px-6 border-t border-neutral-200 bg-white">
        <div className="max-w-4xl mx-auto">
          {/* Header Row: Centered Brand Mark */}
          <div className="text-center pb-8 border-b border-neutral-100">
            <span className="text-2xl sm:text-3xl font-black text-black tracking-tight select-none">
              TASTE HEVEN
            </span>
            <p className="text-xs sm:text-sm text-neutral-500 font-medium tracking-wide mt-1">
              Ghar Jaisa Khaalis Achar · Lahore, Pakistan
            </p>
          </div>

          {/* Editorial 2-Column Professional Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-8 border-b border-neutral-100">
            {/* Column 1: Customer Inquiries & Direct Orders */}
            <div className="bg-neutral-50/70 rounded-2xl p-6 border border-neutral-200/70 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 block mb-2">
                  Customer Support & Orders
                </span>
                <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                  For quick orders, bulk inquiries, and same-day delivery updates across Lahore, connect directly with our helpline.
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-200/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">
                    WhatsApp Helpline
                  </span>
                  <a
                    href={`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent('As-salamu Alaikum, mujhe TASTE HEVEN website se achar order karna hai. Lahore delivery chahiye.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base sm:text-lg font-black text-black hover:text-[#25D366] transition-colors inline-flex items-center gap-2 mt-0.5"
                  >
                    <MessageCircle className="w-4 h-4 text-[#25D366] fill-[#25D366] shrink-0" />
                    <span className="font-mono tracking-tight">{DISPLAY_PHONE}</span>
                  </a>
                </div>

                <a
                  href={`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent('As-salamu Alaikum, mujhe TASTE HEVEN website se achar order karna hai. Lahore delivery chahiye.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-black hover:bg-neutral-800 text-white text-xs font-semibold rounded-full shadow-xs transition-all whitespace-nowrap"
                >
                  Chat Now
                </a>
              </div>
            </div>

            {/* Column 2: Founders & Direction */}
            <div className="bg-neutral-50/70 rounded-2xl p-6 border border-neutral-200/70 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 block mb-2">
                  Founders & Direction
                </span>
                <p className="text-base sm:text-lg font-bold text-neutral-900 tracking-tight">
                  {OWNERS_NAMES}
                </p>
                <p className="text-xs text-neutral-600 leading-relaxed mt-2">
                  Dedicated to preserving authentic Pakistani heirloom recipes, handcrafted in small batches using pure mustard oil and natural ingredients.
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-200/60 flex items-center justify-between text-xs text-neutral-500">
                <span className="font-medium text-neutral-700">Origin: Lahore, Pakistan</span>
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                  <Check className="w-3.5 h-3.5" /> 100% Homestyle
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Bar: Delivery note, Copyright & Discreet Management Key */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
            <p className="text-[11px] text-neutral-400 text-center sm:text-left flex items-center justify-center sm:justify-start gap-1.5">
              <span>© {new Date().getFullYear()} TASTE HEVEN. All Rights Reserved. Cash on Delivery across Lahore.</span>
              <button
                onClick={() => {
                  if (isAdminLoggedIn) {
                    setViewMode('admin');
                  } else {
                    setIsPasswordModalOpen(true);
                  }
                }}
                className="text-neutral-300 hover:text-neutral-600 transition-colors p-0.5 cursor-pointer ml-1"
                title="Portal"
                aria-label="Portal"
              >
                <Lock className="w-3 h-3" />
              </button>
            </p>

            <div className="text-[11px] text-neutral-400">
              100% Homestyle · Pure Mustard Oil · Lahore Delivery
            </div>
          </div>
        </div>
      </footer>

      {/* FLOATING WHATSAPP BUTTON (FOR INSTANT CUSTOMER CHAT) */}
      <a
        href={getGeneralWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Order on WhatsApp"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white px-4 py-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
      >
        <MessageCircle className="w-6 h-6 fill-white text-[#25D366]" />
        <span className="text-xs sm:text-sm font-bold tracking-wide pr-1">
          WhatsApp Helpline
        </span>
      </a>

      {/* ======================================================== */}
      {/* DRAWER: SHOPPING CART */}
      {/* ======================================================== */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl animate-slide-left">
            {/* Cart Header */}
            <div className="p-5 border-b border-neutral-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-black" />
                <h3 className="text-base font-extrabold text-black">
                  Your Cart
                </h3>
                <span className="bg-neutral-100 text-black text-xs font-bold px-2 py-0.5 rounded-full">
                  {cartItemsCount}
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-black rounded-full hover:bg-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-16">
                  <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                  <p className="text-sm font-bold text-neutral-700">Your cart is currently empty</p>
                  <p className="text-xs text-neutral-400 mt-1">
                    Select your favorite flavour and click 'Add to Cart'.
                  </p>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      scrollToProducts();
                    }}
                    className="mt-4 px-5 py-2 bg-black text-white text-xs font-bold rounded-full cursor-pointer hover:bg-neutral-800"
                  >
                    Shop Now
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="flex items-center gap-3 p-3 bg-neutral-50 rounded-2xl border border-neutral-200"
                  >
                    <div className="w-16 h-16 rounded-xl bg-white p-1 border border-neutral-200 shrink-0 flex items-center justify-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="flex-1 min-w-0 text-left">
                      <h4 className="text-xs font-bold text-black truncate">{item.name}</h4>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] bg-neutral-200 text-neutral-800 px-1.5 py-0.2 rounded font-bold">
                          {item.weight}
                        </span>
                        <span className="text-xs font-mono font-bold text-black">
                          Rs {item.unitPrice}
                        </span>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => handleUpdateCartQuantity(item.cartItemId, -1)}
                          className="w-6 h-6 rounded-md bg-white border border-neutral-300 flex items-center justify-center text-xs font-bold hover:bg-neutral-100"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateCartQuantity(item.cartItemId, 1)}
                          className="w-6 h-6 rounded-md bg-white border border-neutral-300 flex items-center justify-center text-xs font-bold hover:bg-neutral-100"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div className="text-right flex flex-col justify-between items-end h-16">
                      <button
                        onClick={() => handleRemoveFromCart(item.cartItemId)}
                        className="text-neutral-400 hover:text-red-600 p-1"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-mono font-black text-black">
                        Rs {item.unitPrice * item.quantity}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="p-5 border-t border-neutral-200 bg-neutral-50/50 space-y-3">
                <div className="flex items-center justify-between text-xs text-neutral-600">
                  <span>Subtotal:</span>
                  <span className="font-mono font-bold text-black text-sm">Rs {cartSubtotal}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-neutral-600">
                  <span>Delivery (Lahore):</span>
                  <span className="font-semibold text-emerald-700">
                    {cartSubtotal >= 1000 ? 'Free Delivery' : 'Rs 150'}
                  </span>
                </div>
                <div className="pt-2 border-t border-neutral-200 flex items-center justify-between font-bold text-black">
                  <span>Grand Total:</span>
                  <span className="text-base font-black font-mono">
                    Rs {cartSubtotal + (cartSubtotal >= 1000 ? 0 : 150)}
                  </span>
                </div>

                <button
                  onClick={handleOpenCartCheckout}
                  className="w-full py-3.5 bg-black hover:bg-neutral-800 text-white text-xs sm:text-sm font-bold rounded-full shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: PROFESSIONAL CHECKOUT FORM ("ORDER NOW") */}
      {/* ======================================================== */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200 my-8">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-black">
                    Checkout - Order Details
                  </h3>
                  <span className="text-[11px] text-neutral-500 block">
                    Cash on Delivery Across Lahore
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsCheckoutOpen(false);
                  setCheckoutDirectItem(null);
                }}
                className="p-1.5 text-neutral-400 hover:text-black rounded-full hover:bg-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Order Items Summary Strip */}
            <div className="bg-neutral-50 rounded-2xl p-3 border border-neutral-200 mb-4 max-h-40 overflow-y-auto">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                Selected Items:
              </span>
              <div className="space-y-1.5">
                {activeCheckoutItems.map((it) => (
                  <div key={it.cartItemId} className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-neutral-800">
                      {it.name} <span className="bg-neutral-200 px-1.5 py-0.2 rounded text-[10px] font-bold">{it.weight}</span> x {it.quantity}
                    </span>
                    <span className="font-mono font-bold text-black">
                      Rs {it.unitPrice * it.quantity}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-2 pt-2 border-t border-neutral-200 flex items-center justify-between text-xs font-bold text-black">
                <span>
                  Total with Delivery {checkoutDeliveryFee === 0 ? '(Free Delivery)' : `(+ Rs ${checkoutDeliveryFee})`}:
                </span>
                <span className="text-sm font-black text-emerald-700">Rs {checkoutGrandTotal}</span>
              </div>
            </div>

            {/* Customer Details Form */}
            <form onSubmit={handleConfirmOrder} className="space-y-3.5 text-left">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Full Name (پورا نام) *</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Farhan Ahmed"
                  value={customerForm.name}
                  onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
                  required
                  className="w-full px-3.5 py-2 text-xs border border-neutral-300 rounded-xl focus:outline-none focus:border-black font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-neutral-500" />
                    <span>WhatsApp / Phone (فون نمبر) *</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="0321-xxxxxxx"
                    value={customerForm.phone}
                    onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
                    required
                    className="w-full px-3.5 py-2 text-xs border border-neutral-300 rounded-xl focus:outline-none focus:border-black font-mono font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Email Address (ای میل)</span>
                  </label>
                  <input
                    type="email"
                    placeholder="name@email.com"
                    value={customerForm.email}
                    onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs border border-neutral-300 rounded-xl focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              {/* City & Area in Lahore */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Area in Lahore (لاہور کا علاقہ) *</span>
                </label>
                <select
                  value={customerForm.area}
                  onChange={(e) => setCustomerForm({ ...customerForm, area: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl focus:outline-none focus:border-black bg-white font-semibold"
                >
                  {POPULAR_AREAS.map((a) => (
                    <option key={a} value={a}>
                      {a}, Lahore
                    </option>
                  ))}
                  <option value="Other Area, Lahore">Other Area, Lahore</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Complete Delivery Address (مکمل گھر / گلی / فلیٹ نمبر کا پتہ) *
                </label>
                <textarea
                  rows={2}
                  placeholder="House #, Street #, Block / Phase, Lahore..."
                  value={customerForm.address}
                  onChange={(e) => setCustomerForm({ ...customerForm, address: e.target.value })}
                  required
                  className="w-full px-3.5 py-2 text-xs border border-neutral-300 rounded-xl focus:outline-none focus:border-black font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Nearest Landmark / Instructions (قریبی مشہور جگہ یا ہدایات)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Near Siddique Trade Centre / Call before arriving"
                  value={customerForm.landmark}
                  onChange={(e) => setCustomerForm({ ...customerForm, landmark: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-neutral-300 rounded-xl focus:outline-none focus:border-black"
                />
              </div>

              {/* Payment Method Badge */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <div>
                    <span className="text-xs font-bold text-emerald-900 block">
                      Cash on Delivery (COD)
                    </span>
                    <span className="text-[10px] text-emerald-700 block">
                      Pay upon delivery at your doorstep in Lahore.
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-900">
                  Rs {checkoutGrandTotal}
                </span>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(false)}
                  className="flex-1 py-3 text-xs font-semibold text-neutral-600 hover:text-black cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmittingOrder}
                  className="flex-2 py-3 bg-black hover:bg-neutral-800 text-white text-xs sm:text-sm font-bold rounded-full shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                >
                  {isSubmittingOrder ? (
                    <span>Placing Order...</span>
                  ) : (
                    <>
                      <span>Confirm Order</span>
                      <Check className="w-4 h-4 stroke-[3]" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ORDER CONFIRMATION RECEIPT */}
      {/* ======================================================== */}
      {orderSuccessRecord && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center shadow-2xl border border-neutral-200 animate-scale-up">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-extrabold text-black">
              Order Confirmed Successfully!
            </h3>
            <p className="text-xs text-neutral-600 mt-1">
              Thank you for ordering with TASTE HEVEN Lahore.
            </p>

            <div className="my-4 bg-neutral-50 p-3.5 rounded-2xl border border-neutral-200 text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-neutral-500 font-semibold">Order ID:</span>
                <span className="font-mono font-black text-black">{orderSuccessRecord.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500 font-semibold">Customer Name:</span>
                <span className="font-bold text-black">{orderSuccessRecord.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500 font-semibold">Phone:</span>
                <span className="font-mono font-bold text-black">{orderSuccessRecord.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500 font-semibold">Address:</span>
                <span className="text-neutral-800 text-right truncate max-w-[180px]">
                  {orderSuccessRecord.address}
                </span>
              </div>
              <div className="pt-2 border-t border-neutral-200 flex justify-between font-bold">
                <span>Total Payable (COD):</span>
                <span className="font-mono text-emerald-700 text-sm">
                  Rs {orderSuccessRecord.total}
                </span>
              </div>
            </div>

            {/* WhatsApp Direct Order Sync */}
            <div className="space-y-2">
              <a
                href={`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(
                  generateWhatsAppOrderText(orderSuccessRecord)
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold rounded-full shadow-md transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Send Order Receipt to WhatsApp</span>
              </a>

              <button
                onClick={() => setOrderSuccessRecord(null)}
                className="w-full py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold rounded-full cursor-pointer transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADMIN PASSWORD LOGIN (CONFIDENTIAL & SECURE) */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-neutral-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <h3 className="text-base font-extrabold text-black">
                  Login
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsPasswordModalOpen(false);
                  setPasswordError('');
                  setEnteredPassword('');
                }}
                className="p-1 text-neutral-400 hover:text-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-neutral-500 mb-4">
              پورٹل میں داخل ہونے کے لیے پاسورڈ درج کریں۔
            </p>

            <form onSubmit={handleAdminLoginSubmit} className="space-y-3">
              <div>
                <input
                  type="password"
                  placeholder="پاسورڈ درج کریں..."
                  value={enteredPassword}
                  onChange={(e) => setEnteredPassword(e.target.value)}
                  autoFocus
                  required
                  className="w-full px-4 py-2.5 text-sm border border-neutral-300 rounded-xl focus:outline-none focus:border-black font-mono text-center tracking-wider"
                />
              </div>

              {passwordError && (
                <p className="text-xs text-red-600 font-semibold text-center">
                  {passwordError}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-black hover:bg-neutral-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm"
              >
                لاگ ان کریں (Login)
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Feedback Toast */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-black text-white px-5 py-2.5 rounded-full text-xs font-semibold shadow-xl border border-neutral-700 animate-fade-in flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

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
  Trash2,
  X,
  Store,
  RotateCcw,
  Key,
  FolderPlus,
  Lock,
  Layers,
} from 'lucide-react';
import { processImageFile } from './utils/imageUtils';
import defaultMangoImg from './assets/images/mango_achar_lahore_jar_1794203977577.jpg';
import defaultGarlicImg from './assets/images/garlic_achar_lahore_jar_1794203978491.jpg';
import defaultMixImg from './assets/images/mix_achar_lahore_jar_1794203978362.jpg';

// Default high-resolution product photos generated for Taste Heven Lahore (clean white backgrounds)
const DEFAULT_MANGO_IMG = defaultMangoImg || '/images/mango_achar.jpg';
const DEFAULT_GARLIC_IMG = defaultGarlicImg || '/images/garlic_achar.jpg';
const DEFAULT_MIX_IMG = defaultMixImg || '/images/mix_achar.jpg';

// WhatsApp phone configuration (92XXXXXXXXXX format without 0)
const WHATSAPP_PHONE = '923248314001';
const DISPLAY_PHONE = '03248314001';
const OWNERS_NAMES = 'Farman Ali & Ahmad Waseem';

// Default Admin Password (strictly confidential, never displayed in public UI)
const DEFAULT_ADMIN_PASSWORD = 'heven123';

// Instant Safe Image Resolver ensuring zero-glitch and zero-broken-image startup
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
  price: number;
  weight: string;
  image: string;
  altText: string;
  description: string;
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
    weight: '500g Jar',
    image: DEFAULT_MIX_IMG,
    altText: 'Mix Achar Lahore - TASTE HEVEN',
    description: 'Taza gajar, hari mirch, kacha aam aur leemon ka chatkharedar imtezaaj. Har niwalay mein zabardast desi crunch!',
  },
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
      const saved = localStorage.getItem('taste_heven_categories_v8');
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
      const saved = localStorage.getItem('taste_heven_achar_products_v8');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((p: ProductItem) => ({
            ...p,
            image: getSafeProductImage(p.id, p.image),
          }));
        }
      }
    } catch {}
    return INITIAL_PRODUCTS;
  });

  // Hero Mango Jar image with instant auto-repair
  const [heroImage, setHeroImage] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('taste_heven_hero_jar_v8');
      if (saved && saved.startsWith('data:image/')) return saved;
    } catch {}
    return DEFAULT_MANGO_IMG;
  });

  // Pre-cache all product photos in memory on mount for 0ms lag
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

    // Check URL parameters for direct owner login access (?admin or #admin)
    if (window.location.search.includes('admin') || window.location.hash.includes('admin')) {
      setIsPasswordModalOpen(true);
    }
  }, []);

  // New category creation form
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryUrdu, setNewCategoryUrdu] = useState('');
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // New product form in Admin Portal
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProductForm, setNewProductForm] = useState({
    name: '',
    romanUrduTitle: '',
    category: 'achar',
    price: 650,
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

  // Persist products to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('taste_heven_achar_products_v8', JSON.stringify(products));
    } catch (e) {
      console.warn('localStorage save error', e);
    }
  }, [products]);

  // Persist categories to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('taste_heven_categories_v8', JSON.stringify(categories));
    } catch (e) {
      console.warn('localStorage save error', e);
    }
  }, [categories]);

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

  // Preload primary images on mount for instantaneous, zero-glitch display
  useEffect(() => {
    [DEFAULT_MANGO_IMG, DEFAULT_GARLIC_IMG, DEFAULT_MIX_IMG].forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Handle direct file upload for any product (compressed to 800x800 for 0ms lag)
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
          localStorage.setItem('taste_heven_hero_jar_v5', newImgData);
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

  // Handle hero image direct file upload
  const handleHeroFileUpload = async (file: File) => {
    if (!file) return;
    try {
      const newImgData = await processImageFile(file, 800, 800, 0.82);
      setHeroImage(newImgData);
      try {
        localStorage.setItem('taste_heven_hero_jar_v5', newImgData);
      } catch {}
      showToast('ہیرو جار کی تصویر فوری بدل دی گئی (Hero Photo Updated)');
    } catch (err) {
      console.warn('Hero image fallback:', err);
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setHeroImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
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
    setProducts(INITIAL_PRODUCTS);
    setCategories(INITIAL_CATEGORIES);
    setHeroImage(DEFAULT_MANGO_IMG);
    setAdminPassword(DEFAULT_ADMIN_PASSWORD);
    try {
      localStorage.removeItem('taste_heven_achar_products_v5');
      localStorage.removeItem('taste_heven_categories_v5');
      localStorage.removeItem('taste_heven_hero_jar_v5');
      localStorage.removeItem('taste_heven_admin_pwd');
    } catch {}
    showToast('تمام تصاویر، پروڈکٹس اور پاسورڈ ری سیٹ کر دیے گئے');
  };

  const getWhatsAppOrderUrl = (productName: string) => {
    const message = `As-salamu Alaikum, mujhe ${productName} order karna hai. TASTE HEAVEN website se. Lahore delivery chahiye.`;
    return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
  };

  const getGeneralWhatsAppUrl = () => {
    const message = 'As-salamu Alaikum, mujhe TASTE HEAVEN website se achar order karna hai. Lahore delivery chahiye.';
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
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl sm:text-2xl font-black text-black tracking-tight">
                TASTE HEVEN
              </span>
              <span className="text-xs bg-black text-white font-semibold px-2.5 py-1 rounded-md">
                Admin Portal
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setViewMode('store')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-black hover:bg-neutral-800 text-white text-xs sm:text-sm font-semibold rounded-full shadow-sm transition-all cursor-pointer"
              >
                <Store className="w-4 h-4" />
                <span>دکان پر جائیں (View Store)</span>
              </button>
              <button
                onClick={handleAdminLogout}
                className="px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold rounded-full transition-colors cursor-pointer"
                title="Logout"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Admin Content Area */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          {/* Top Info Banner & Actions */}
          <div className="bg-white rounded-2xl p-6 border border-neutral-200 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-black">
                مینجمنٹ پورٹل: پروڈکٹس اور فوٹوز مینیجر
              </h1>
              <p className="text-xs sm:text-sm text-neutral-600 mt-1">
                یہاں سے آپ نئی پروڈکٹ، کیٹیگری، تصویر اور قیمت تبدیل کر سکتے ہیں۔
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              {/* Add Product Button */}
              <button
                onClick={() => setIsAddingProduct(!isAddingProduct)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-black text-white rounded-full text-xs font-semibold hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>نیا پروڈکٹ شامل کریں</span>
              </button>
              {/* Create Category Button */}
              <button
                onClick={() => setIsCategoryModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-neutral-100 text-neutral-800 hover:bg-neutral-200 rounded-full text-xs font-semibold transition-colors cursor-pointer border border-neutral-300"
              >
                <FolderPlus className="w-4 h-4 text-amber-600" />
                <span>نئی کیٹیگری بنائیں</span>
              </button>
              {/* Change Password Button */}
              <button
                onClick={() => setIsChangingPassword(!isChangingPassword)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-neutral-100 text-neutral-800 hover:bg-neutral-200 rounded-full text-xs font-semibold transition-colors cursor-pointer border border-neutral-300"
              >
                <Key className="w-4 h-4 text-neutral-600" />
                <span>پاسورڈ بدلیں</span>
              </button>
              {/* Reset to Defaults */}
              <button
                onClick={handleResetDefaults}
                className="inline-flex items-center gap-1.5 px-3 py-2.5 bg-neutral-100 text-neutral-700 hover:bg-neutral-200 rounded-full text-xs font-semibold transition-colors cursor-pointer"
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

          {/* SECTION 1: CATEGORY MANAGER */}
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

            {/* Existing Categories Badges */}
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

          {/* SECTION 2: ADD NEW PRODUCT FORM */}
          {isAddingProduct && (
            <div className="bg-white rounded-2xl p-6 border-2 border-black mb-8 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-black flex items-center gap-2">
                  <Plus className="w-4 h-4 text-emerald-600" />
                  <span>نیا پروڈکٹ شامل کریں (Add New Product)</span>
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

                {/* Category Selector + Create Category Inline Button */}
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

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Price in PKR (Rs) *
                  </label>
                  <input
                    type="number"
                    value={newProductForm.price}
                    onChange={(e) =>
                      setNewProductForm({
                        ...newProductForm,
                        price: Number(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3.5 py-2 text-xs border border-neutral-300 rounded-xl focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Weight / Jar Size
                  </label>
                  <input
                    type="text"
                    placeholder="500g Jar"
                    value={newProductForm.weight}
                    onChange={(e) =>
                      setNewProductForm({ ...newProductForm, weight: e.target.value })
                    }
                    className="w-full px-3.5 py-2 text-xs border border-neutral-300 rounded-xl focus:outline-none focus:border-black"
                  />
                </div>

                <div>
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
                    Product Description (اردو یا انگلش میں)
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
                      price: newProductForm.price || 650,
                      weight: newProductForm.weight || '500g Jar',
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
                      price: 650,
                      weight: '500g Jar',
                      image: DEFAULT_MANGO_IMG,
                      description: '',
                    });
                    showToast('نیا پروڈکٹ کامیابی سے شامل کر دیا گیا!');
                  }}
                  className="px-6 py-2.5 bg-black text-white text-xs font-bold rounded-full hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  محفوظ کریں (Save Product)
                </button>
              </div>
            </div>
          )}

          {/* SECTION 3: HERO CENTER JAR PHOTO */}
          <div className="bg-white rounded-2xl p-6 border border-neutral-200 mb-8">
            <h2 className="text-sm font-extrabold text-black uppercase tracking-wider mb-4">
              ہوم پیج ہیرو جار فوٹو (Homepage Hero Center Jar)
            </h2>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-32 h-32 rounded-xl bg-neutral-50 p-2 border border-neutral-200 flex items-center justify-center shrink-0">
                <img
                  src={heroImage}
                  alt="Hero Jar Preview"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="space-y-2 text-center sm:text-left">
                <p className="text-xs text-neutral-700 font-semibold">
                  ہوم پیج پر اوپر سب سے بڑا مین جار دکھانے کے لیے نئی تصویر منتخب کریں:
                </p>
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-black hover:bg-neutral-800 text-white text-xs font-semibold rounded-full cursor-pointer transition-colors shadow-sm">
                  <Upload className="w-3.5 h-3.5 text-amber-400" />
                  <span>ہیرو جار کی نئی تصویر اپلوڈ کریں</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleHeroFileUpload(f);
                    }}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* SECTION 4: ALL PRODUCTS LIST & PHOTO MANAGER */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-black uppercase tracking-wider">
                تمام پروڈکٹس ({products.length} Items) — ہر پروڈکٹ کی تصویر اور قیمت بدلیں
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

                    {/* Editable Fields */}
                    <div className="space-y-2 text-left">
                      <div>
                        <label className="block text-[11px] font-bold text-neutral-500">
                          Product Name
                        </label>
                        <input
                          type="text"
                          value={prod.name}
                          onChange={(e) => {
                            const val = e.target.value;
                            setProducts((prev) =>
                              prev.map((p) => (p.id === prod.id ? { ...p, name: val } : p))
                            );
                          }}
                          className="w-full px-2.5 py-1.5 text-xs font-bold text-black border border-neutral-200 rounded-lg focus:outline-none focus:border-black"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-bold text-neutral-500">
                            Category
                          </label>
                          <select
                            value={prod.category}
                            onChange={(e) => {
                              const val = e.target.value;
                              setProducts((prev) =>
                                prev.map((p) => (p.id === prod.id ? { ...p, category: val } : p))
                              );
                            }}
                            className="w-full px-2.5 py-1.5 text-xs font-semibold text-black border border-neutral-200 rounded-lg focus:outline-none focus:border-black bg-white"
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
                        <div>
                          <label className="block text-[11px] font-bold text-neutral-500">
                            Price (Rs)
                          </label>
                          <input
                            type="number"
                            value={prod.price}
                            onChange={(e) => {
                              const val = Number(e.target.value) || 0;
                              setProducts((prev) =>
                                prev.map((p) => (p.id === prod.id ? { ...p, price: val } : p))
                              );
                            }}
                            className="w-full px-2.5 py-1.5 text-xs font-bold text-black border border-neutral-200 rounded-lg focus:outline-none focus:border-black"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-neutral-500">
                          Description
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
                          className="w-full px-2.5 py-1.5 text-xs text-neutral-700 border border-neutral-200 rounded-lg focus:outline-none focus:border-black"
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
        - Start directly with header
      */}

      {/* 1. HEADER ONLY - LOGO COMPLETELY CENTERED */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 grid grid-cols-3 items-center">
          {/* Left: Admin Portal Button (Protected by password HEVEN123) */}
          <div className="flex items-center justify-start">
            <button
              onClick={() => {
                if (isAdminLoggedIn) {
                  setViewMode('admin');
                } else {
                  setIsPasswordModalOpen(true);
                }
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 text-black text-xs font-semibold rounded-full border border-neutral-200 transition-colors cursor-pointer whitespace-nowrap"
              title="Admin Portal"
            >
              <Lock className="w-3.5 h-3.5 text-neutral-600" />
              <span>Admin Portal</span>
            </button>
          </div>

          {/* Center: Logo Name "TASTE HEVEN" in SOLID BLACK, completely centered */}
          <div className="flex items-center justify-center text-center">
            <a
              href="#"
              className="text-xl sm:text-2xl md:text-3xl font-black text-black tracking-tight select-none whitespace-nowrap"
            >
              TASTE HEVEN
            </a>
          </div>

          {/* Right: Black "Shop Now" button */}
          <div className="flex items-center justify-end">
            <button
              onClick={scrollToProducts}
              className="px-4 sm:px-6 py-2 sm:py-2.5 bg-black hover:bg-neutral-800 text-white text-xs sm:text-sm font-semibold rounded-full shadow-sm hover:shadow transition-all duration-200 cursor-pointer whitespace-nowrap"
            >
              Shop Now
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT CONTAINER */}
      <main className="flex-1">
        {/* 2. HERO SECTION - NO BANNER, ONLY PRODUCT */}
        <section className="pt-10 pb-16 px-4 sm:px-6 max-w-4xl mx-auto text-center">
          {/* Center Heading H1 */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-black tracking-tight leading-tight">
            Ghar Jaisa Khaalis Achar - Lahore
          </h1>

          {/* Subtext */}
          <p className="mt-3 text-sm sm:text-base text-neutral-600 font-medium">
            No Preservatives <span className="text-amber-500 font-bold mx-1">|</span> Pure Oil{' '}
            <span className="text-amber-500 font-bold mx-1">|</span> Homestyle
          </p>

          {/* Big Center Image of Mango Achar Jar (320x320 on pure white background, rounded) */}
          <div className="mt-8 flex justify-center">
            <div className="w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] bg-white rounded-2xl p-2 border border-neutral-100 shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center justify-center">
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

          {/* Primary Action Button under Hero Jar */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={getWhatsAppOrderUrl('Mango Achar (Rs 650)')}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-black hover:bg-neutral-800 text-white font-semibold text-sm rounded-full shadow-md hover:shadow-lg transition-all"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Order on WhatsApp (Rs 650)</span>
            </a>
            <button
              onClick={scrollToProducts}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-3.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-sm rounded-full transition-all cursor-pointer"
            >
              <span>View All Flavours</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* 3. PRODUCTS SECTION - "Our Best Sellers in Lahore" WITH DYNAMIC CATEGORIES */}
        <section id="products" className="py-16 px-4 sm:px-6 bg-white border-t border-neutral-100">
          <div className="max-w-6xl mx-auto">
            {/* Center Section Heading H2 */}
            <div className="text-center max-w-2xl mx-auto mb-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-black tracking-tight">
                Our Best Sellers in Lahore
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-neutral-500 font-medium">
                Ghar Ka Bana Zaiqedaar Achar
              </p>
            </div>

            {/* Dynamic Category Filter Pills */}
            <div className="flex items-center justify-center flex-wrap gap-2 mb-10">
              {categories.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
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
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {filteredProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="bg-white border border-neutral-200 rounded-2xl p-4 sm:p-6 text-center flex flex-col justify-between hover:shadow-md hover:border-neutral-300 transition-all duration-200 group"
                  >
                    <div>
                      {/* Product Image (Crisp, Stable & Glitch-Free) */}
                      <div className="w-full aspect-square bg-neutral-50 rounded-xl overflow-hidden mb-4 flex items-center justify-center p-2 border border-neutral-100">
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
                      <p className="text-xs text-neutral-500 font-medium mt-0.5">
                        {prod.romanUrduTitle}
                      </p>

                      {/* Weight & Price */}
                      <div className="mt-2 flex items-center justify-center gap-2">
                        <span className="text-lg sm:text-xl font-extrabold text-black">
                          Rs {prod.price}
                        </span>
                        <span className="text-xs text-neutral-500 font-medium bg-neutral-100 px-2 py-0.5 rounded-full">
                          {prod.weight}
                        </span>
                      </div>

                      {/* Friendly Roman Urdu Description */}
                      <p className="mt-2.5 text-xs text-neutral-600 leading-relaxed font-normal line-clamp-3 sm:line-clamp-none">
                        {prod.description}
                      </p>
                    </div>

                    {/* Black "Order on WhatsApp" Button */}
                    <div className="mt-5 pt-3 border-t border-neutral-100">
                      <a
                        href={getWhatsAppOrderUrl(`${prod.name} (${prod.weight} - Rs ${prod.price})`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-black hover:bg-neutral-800 text-white text-xs sm:text-sm font-semibold rounded-full shadow-sm hover:shadow transition-all"
                      >
                        <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="whitespace-nowrap">Order on WhatsApp</span>
                      </a>
                    </div>
                  </div>
                ))}
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

        {/* 5. TRUST BADGES */}
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

      {/* 6. WHATSAPP FUNCTIONALITY: Floating Green WhatsApp Button at Bottom Right */}
      <a
        href={getGeneralWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Order on WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white px-4 py-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
      >
        <MessageCircle className="w-6 h-6 fill-white text-[#25D366]" />
        <span className="text-xs sm:text-sm font-bold tracking-wide pr-1">
          Order on WhatsApp
        </span>
      </a>

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

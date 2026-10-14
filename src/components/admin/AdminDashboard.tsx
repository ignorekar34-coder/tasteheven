import React, { useState } from 'react';
import { AdminUser, Product, OrderRecord, OrderStatus, ProductCategory } from '../../types';
import { formatPKR } from '../../utils/whatsapp';
import { TasteHevenLogo } from '../TasteHevenLogo';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  LogOut,
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  Truck,
  CheckCheck,
  AlertCircle,
  MessageCircle,
  Search,
  DollarSign,
  TrendingUp,
  Shield,
  Key,
  Save,
  X,
  Phone,
  Upload,
  Image as ImageIcon,
  Sparkles,
  RefreshCw,
  Eye,
  Check,
  Layers,
} from 'lucide-react';
import { processImageFile, processBannerImageFile } from '../../utils/imageUtils';
import { saveImageToIndexedDb, removeImageFromIndexedDb } from '../../utils/localImageDb';
import { PRODUCTS } from '../../data/products';
import { DEFAULT_HERO_BANNER } from '../Hero';


interface AdminDashboardProps {
  currentUser: AdminUser;
  onLogout: () => void;
  onReturnToStore: () => void;
  products: Product[];
  onUpdateProduct: (updatedProduct: Product) => void;
  onAddProduct: (newProduct: Product) => void;
  onDeleteProduct: (productId: string) => void;
  orders: OrderRecord[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onDeleteOrder?: (orderId: string) => void;
  onClearAllOrders?: () => void;
  adminUsers: AdminUser[];
  onUpdateAdminUsers: (users: AdminUser[]) => void;
  bannerImage?: string;
  onUpdateBannerImage?: (newBanner: string) => void;
  onManualSync?: () => Promise<void> | void;
  isSyncing?: boolean;
}

type AdminTab = 'overview' | 'orders' | 'products' | 'product-images' | 'banner-image' | 'team';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  onLogout,
  onReturnToStore,
  products,
  onUpdateProduct,
  onAddProduct,
  onDeleteProduct,
  orders,
  onUpdateOrderStatus,
  onDeleteOrder,
  onClearAllOrders,
  adminUsers,
  onUpdateAdminUsers,
  bannerImage,
  onUpdateBannerImage,
  onManualSync,
  isSyncing,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [productSearch, setProductSearch] = useState('');
  const [productCatFilter, setProductCatFilter] = useState<string>('all');


  // Order Deletion / Purge Modal State
  const [orderToDelete, setOrderToDelete] = useState<OrderRecord | null>(null);
  const [isClearAllConfirmOpen, setIsClearAllConfirmOpen] = useState(false);

  // Edit Product Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);

  // New Product Form State
  const [newProd, setNewProd] = useState<Partial<Product>>({
    name: '',
    urduName: '',
    category: 'honey',
    price: 1500,
    weight: '500g',
    shortDesc: '',
    fullDesc: '',
    image: '/src/assets/images/product_pure_sidr_honey_1791803704705.jpg',
    badge: 'New Arrival',
    inStock: true,
  });

  // User edit password state
  const [passwordChangeUser, setPasswordChangeUser] = useState<AdminUser | null>(null);
  const [newPasswordValue, setNewPasswordValue] = useState('');

  // Financial calculations
  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;
  const inStockCount = products.filter((p) => p.inStock).length;
  const outOfStockCount = products.filter((p) => !p.inStock).length;

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const matchesFilter = orderFilter === 'all' || o.status === orderFilter;
    const matchesSearch =
      orderSearch === '' ||
      o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerPhone.includes(orderSearch) ||
      o.city.toLowerCase().includes(orderSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Filtered products
  const filteredProducts = products.filter((p) => {
    const matchesCat = productCatFilter === 'all' || p.category === productCatFilter;
    const matchesSearch =
      productSearch === '' ||
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.urduName.includes(productSearch);
    return matchesCat && matchesSearch;
  });

  // Image upload states
  const [isUploadingEditImage, setIsUploadingEditImage] = useState(false);
  const [isUploadingNewImage, setIsUploadingNewImage] = useState(false);

  // Handle Edit Product Image Upload with Base64 Conversion
  const handleEditImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProduct) return;
    try {
      setIsUploadingEditImage(true);
      const base64 = await processImageFile(file, 640, 640, 0.78);
      setEditingProduct({
        ...editingProduct,
        image: base64,
      });
      saveImageToIndexedDb(editingProduct.id, base64).catch(() => {});
    } catch (err: any) {
      alert(err?.message || 'Failed to process image');
    } finally {
      setIsUploadingEditImage(false);
      e.target.value = '';
    }
  };

  // Handle Create Product Image Upload with Base64 Conversion
  const handleNewImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingNewImage(true);
      const base64 = await processImageFile(file, 640, 640, 0.78);
      setNewProd((prev) => ({
        ...prev,
        image: base64,
      }));
    } catch (err: any) {
      alert(err?.message || 'Failed to process image');
    } finally {
      setIsUploadingNewImage(false);
      e.target.value = '';
    }
  };

  // Section 1: Edit Product Images State & Handlers
  const [productImageCatFilter, setProductImageCatFilter] = useState<string>('all');
  const [productImageSearch, setProductImageSearch] = useState('');
  const [uploadingProductId, setUploadingProductId] = useState<string | null>(null);
  const [savedProductImageId, setSavedProductImageId] = useState<string | null>(null);

  const filteredImageProducts = products.filter((p) => {
    const matchesCat = productImageCatFilter === 'all' || p.category === productImageCatFilter;
    const matchesSearch =
      productImageSearch === '' ||
      p.name.toLowerCase().includes(productImageSearch.toLowerCase()) ||
      p.urduName.includes(productImageSearch);
    return matchesCat && matchesSearch;
  });

  const handleProductCardImageUpload = async (product: Product, file: File) => {
    try {
      setUploadingProductId(product.id);
      const base64 = await processImageFile(file, 800, 800, 0.78);
      onUpdateProduct({
        ...product,
        image: base64,
      });
      setSavedProductImageId(product.id);
      setTimeout(() => setSavedProductImageId(null), 3500);
    } catch (err: any) {
      alert(err?.message || 'تصویر پراسیس کرنے میں خرابی ہوئی۔ براہ کرم دوبارہ کوشش کریں۔');
    } finally {
      setUploadingProductId(null);
    }
  };

  const handleResetProductDefaultImage = (product: Product) => {
    const defaultProduct = PRODUCTS.find((p) => p.id === product.id);
    const categoryFallback =
      product.category === 'achar'
        ? '/src/assets/images/product_traditional_mango_achar_1791803728636.jpg'
        : product.category === 'murabba'
        ? '/src/assets/images/product_shahi_amla_murabba_1791803749444.jpg'
        : '/src/assets/images/product_pure_sidr_honey_1791803704705.jpg';
    const originalImage = defaultProduct?.image || categoryFallback;
    onUpdateProduct({
      ...product,
      image: originalImage,
    });
    setSavedProductImageId(product.id);
    setTimeout(() => setSavedProductImageId(null), 3500);
  };

  // Section 2: Edit Banner Image State & Handlers
  const [bannerPreview, setBannerPreview] = useState<string>(bannerImage || DEFAULT_HERO_BANNER);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [bannerSuccessNotice, setBannerSuccessNotice] = useState<string | null>(null);
  const [bannerUrlDraft, setBannerUrlDraft] = useState('');

  React.useEffect(() => {
    if (bannerImage) {
      setBannerPreview(bannerImage);
    }
  }, [bannerImage]);

  const handleBannerFileUpload = async (file: File) => {
    try {
      setIsUploadingBanner(true);
      const base64 = await processBannerImageFile(file);
      setBannerPreview(base64);
      onUpdateBannerImage?.(base64);
      setBannerSuccessNotice('ہوم پیج بینر فوری محفوظ اور لائیو ہو گیا ہے! (Banner updated & live on homepage)');
      setTimeout(() => setBannerSuccessNotice(null), 4000);
    } catch (err: any) {
      alert(err?.message || 'بینر تصویر پراسیس کرنے میں خرابی ہوئی');
    } finally {
      setIsUploadingBanner(false);
    }
  };

  const handleSaveBanner = () => {
    if (!bannerPreview) return;
    onUpdateBannerImage?.(bannerPreview);
    setBannerSuccessNotice('ہوم پیج بینر کامیابی سے محفوظ اور لائیو ہو گیا ہے! (Banner applied live to homepage)');
    setTimeout(() => setBannerSuccessNotice(null), 4000);
  };

  const handleResetDefaultBanner = () => {
    setBannerPreview(DEFAULT_HERO_BANNER);
    onUpdateBannerImage?.(DEFAULT_HERO_BANNER);
    setBannerSuccessNotice('اصل لگژری بینر بحال اور ہوم پیج پر لائیو ہو گیا ہے! (Original banner restored)');
    setTimeout(() => setBannerSuccessNotice(null), 4000);
  };

  // Handle Save Product Edit
  const handleSaveProductEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    onUpdateProduct(editingProduct);
    setEditingProduct(null);
  };

  // Handle Create New Product
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProd.name || !newProd.price) return;

    const fullProduct: Product = {
      id: `prod-${Date.now()}`,
      name: newProd.name,
      urduName: newProd.urduName || newProd.name,
      category: (newProd.category as any) || 'honey',
      price: Number(newProd.price),
      weight: newProd.weight || '500g',
      weightOptions: [
        { weight: '500g', price: Number(newProd.price) },
        { weight: '1kg', price: Math.round(Number(newProd.price) * 1.85) },
      ],
      rating: 5.0,
      reviewCount: 1,
      shortDesc: newProd.shortDesc || 'Handcrafted khalis pantry delicacy from Taste Heven.',
      fullDesc: newProd.fullDesc || 'Natural authentic recipe without preservatives.',
      ingredients: ['100% Pure Natural Ingredients'],
      benefits: ['Traditional health and wellness tonic', 'Aids natural digestion'],
      image: newProd.image || '/src/assets/images/product_pure_sidr_honey_1791803704705.jpg',
      badge: newProd.badge || 'New',
      inStock: true,
    };

    onAddProduct(fullProduct);
    setIsNewProductModalOpen(false);
    setNewProd({
      name: '',
      urduName: '',
      category: 'honey',
      price: 1500,
      weight: '500g',
      shortDesc: '',
      fullDesc: '',
      image: '/src/assets/images/product_pure_sidr_honey_1791803704705.jpg',
      badge: 'New Arrival',
      inStock: true,
    });
  };

  // Handle Password Change
  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordChangeUser || !newPasswordValue.trim()) return;

    const updated = adminUsers.map((u) =>
      u.id === passwordChangeUser.id ? { ...u, password: newPasswordValue.trim() } : u
    );
    onUpdateAdminUsers(updated);
    setPasswordChangeUser(null);
    setNewPasswordValue('');
  };

  // WhatsApp Customer message generator
  const getWhatsAppCustomerLink = (order: OrderRecord) => {
    const cleanPhone = order.customerPhone.replace(/[^0-9]/g, '');
    const phoneWithCountry = cleanPhone.startsWith('92')
      ? cleanPhone
      : cleanPhone.startsWith('0')
      ? '92' + cleanPhone.slice(1)
      : '92' + cleanPhone;

    const text = encodeURIComponent(
      `Assalam-o-Alaikum ${order.customerName} Sahib! 👋\nThis is from *Taste Heven* regarding your Order *#${order.orderNumber}* (${formatPKR(
        order.total
      )}).\nStatus: *${order.status.toUpperCase()}*.\nAddress: ${order.address}, ${order.city}.\n\nThank you for choosing 100% Khalis pantry!`
    );
    return `https://wa.me/${phoneWithCountry}?text=${text}`;
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-800 flex flex-col text-left">
      {/* Top Navbar */}
      <header className="bg-[#0A0A0A] text-white border-b border-[#D4AF37]/30 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <TasteHevenLogo variant="badge" size={38} />
            <div>
              <h1 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                <span>Taste Heven Admin</span>
                <span className="text-[10px] font-mono uppercase bg-white/10 text-[#D4AF37] border border-[#D4AF37]/30 px-2 py-0.5 rounded">
                  Internal Portal
                </span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Active User Badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 border border-[#D4AF37]/30 text-xs">
              <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />
              <div>
                <span className="font-semibold text-white">{currentUser.name}</span>
                <span className="text-[#D4AF37] text-[10px] ml-1">({currentUser.role})</span>
              </div>
            </div>

            {onManualSync && (
              <button
                onClick={onManualSync}
                disabled={isSyncing}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#D4AF37] hover:bg-[#c49f2e] text-[#0A0A0A] text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                title="Sync latest images and products between Phone and Laptop"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">{isSyncing ? 'Syncing...' : 'Sync Phone & Laptop'}</span>
                <span className="sm:hidden">{isSyncing ? '...' : 'Sync'}</span>
              </button>
            )}

            <button
              onClick={onReturnToStore}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer border border-stone-700"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Customer Store</span>
            </button>

            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-900/80 hover:bg-red-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Bar */}
        <div className="bg-[#141414] border-t border-white/10 px-4 sm:px-8 flex space-x-1 sm:space-x-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-[#D4AF37] text-[#D4AF37] bg-white/5'
                : 'border-transparent text-stone-400 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'orders'
                ? 'border-[#D4AF37] text-[#D4AF37] bg-white/5'
                : 'border-transparent text-stone-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Orders & Dispatch</span>
            {pendingOrdersCount > 0 && (
              <span className="bg-[#D4AF37] text-[#0A0A0A] text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {pendingOrdersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'products'
                ? 'border-[#D4AF37] text-[#D4AF37] bg-white/5'
                : 'border-transparent text-stone-400 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products & Pricing ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('product-images')}
            className={`flex items-center gap-2 py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'product-images'
                ? 'border-[#D4AF37] text-[#D4AF37] bg-white/5'
                : 'border-transparent text-stone-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Edit Product Images</span>
          </button>

          <button
            onClick={() => setActiveTab('banner-image')}
            className={`flex items-center gap-2 py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'banner-image'
                ? 'border-[#D4AF37] text-[#D4AF37] bg-white/5'
                : 'border-transparent text-stone-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Edit Banner Image</span>
          </button>

          <button
            onClick={() => setActiveTab('team')}
            className={`flex items-center gap-2 py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'team'
                ? 'border-[#D4AF37] text-[#D4AF37] bg-white/5'
                : 'border-transparent text-stone-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Store Owners ({adminUsers.length})</span>
          </button>
        </div>
      </header>

      {/* Main Tab Views */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Top KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
                <div className="flex items-center justify-between text-stone-500 text-xs mb-2 font-medium">
                  <span>Total Revenue</span>
                  <DollarSign className="w-4 h-4 text-emerald-700" />
                </div>
                <div className="font-serif text-2xl font-bold text-stone-900 tabular-nums">
                  {formatPKR(totalRevenue)}
                </div>
                <div className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>Cash on Delivery + Online</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
                <div className="flex items-center justify-between text-stone-500 text-xs mb-2 font-medium">
                  <span>Total Orders</span>
                  <ShoppingBag className="w-4 h-4 text-amber-700" />
                </div>
                <div className="font-serif text-2xl font-bold text-stone-900 tabular-nums">
                  {orders.length}
                </div>
                <div className="text-[11px] text-amber-700 mt-1">
                  {pendingOrdersCount} pending dispatch
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
                <div className="flex items-center justify-between text-stone-500 text-xs mb-2 font-medium">
                  <span>Active Jars in Catalog</span>
                  <Package className="w-4 h-4 text-emerald-700" />
                </div>
                <div className="font-serif text-2xl font-bold text-stone-900 tabular-nums">
                  {inStockCount}
                </div>
                <div className="text-[11px] text-stone-500 mt-1">
                  {outOfStockCount > 0 ? `${outOfStockCount} out of stock` : 'All items in stock'}
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
                <div className="flex items-center justify-between text-stone-500 text-xs mb-2 font-medium">
                  <span>Store Owners</span>
                  <Users className="w-4 h-4 text-blue-700" />
                </div>
                <div className="font-serif text-2xl font-bold text-stone-900 tabular-nums">
                  2 Owners
                </div>
                <div className="text-[11px] text-emerald-700 mt-1">
                  Ahmad Waseem & Farman Ali
                </div>
              </div>
            </div>

            {/* Quick Actions: Edit Product Images & Edit Banner Image */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-amber-50 to-stone-50 border border-amber-200/80 rounded-2xl p-5 shadow-2xs flex items-center justify-between gap-4 text-left">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                    <ImageIcon className="w-4 h-4 text-amber-700" />
                    <span>Edit Product Images (تصاویر تبدیل کریں)</span>
                  </div>
                  <p className="text-xs text-stone-600">
                    Update photos for Honey, Achar & Murabba jars with instant preview and auto base64 sync.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('product-images')}
                  className="shrink-0 px-4 py-2 bg-stone-900 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-stone-900 text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  Change Photos →
                </button>
              </div>

              <div className="bg-gradient-to-r from-stone-900 to-stone-800 text-white border border-[#D4AF37]/40 rounded-2xl p-5 shadow-2xs flex items-center justify-between gap-4 text-left">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#D4AF37]">
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                    <span>Edit Banner Image (ہوم پیج بینر تبدیل کریں)</span>
                  </div>
                  <p className="text-xs text-stone-300">
                    Upload a new hero banner showing your fresh honey jars on the homepage.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('banner-image')}
                  className="shrink-0 px-4 py-2 bg-[#D4AF37] hover:bg-[#F9E498] text-[#0A0A0A] text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  Change Banner →
                </button>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  Recent Orders & Inquiries
                </h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 underline cursor-pointer"
                >
                  View All Orders →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-semibold border-b border-stone-200">
                    <tr>
                      <th className="p-3">Order #</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">City</th>
                      <th className="p-3">Items</th>
                      <th className="p-3">Total (PKR)</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-stone-500">
                          <div className="flex flex-col items-center justify-center py-3">
                            <ShoppingBag className="w-8 h-8 text-stone-300 mb-2" />
                            <p className="font-semibold text-stone-700">کوئی آرڈر ابھی موجود نہیں ہے (No Orders)</p>
                            <p className="text-xs text-stone-400 mt-1">
                              پرانے فرضی/ڈیمو نام کلیئر کر دیے گئے ہیں۔ گاہک کے نئے لائیو آرڈرز یہاں شو ہوں گے۔
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      orders.slice(0, 5).map((ord) => (
                        <tr key={ord.id} className="hover:bg-stone-50/50">
                          <td className="p-3 font-mono font-bold text-emerald-950">
                            {ord.orderNumber}
                          </td>
                          <td className="p-3">
                            <div className="font-semibold text-stone-900">{ord.customerName}</div>
                            <div className="text-stone-500 text-[11px]">{ord.customerPhone}</div>
                          </td>
                          <td className="p-3 text-stone-700">{ord.city}</td>
                          <td className="p-3 text-stone-600">
                            {ord.items.map((i) => `${i.product.name} (${i.selectedWeight})`).join(', ')}
                          </td>
                          <td className="p-3 font-semibold text-stone-900 tabular-nums">
                            {formatPKR(ord.total)}
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                ord.status === 'delivered'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : ord.status === 'dispatched'
                                  ? 'bg-blue-100 text-blue-800'
                                  : ord.status === 'confirmed'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-stone-200 text-stone-700'
                              }`}
                            >
                              {ord.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <a
                                href={getWhatsAppCustomerLink(ord)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#25D366] text-white rounded-md text-[11px] font-semibold hover:bg-[#20bd5a]"
                              >
                                <MessageCircle className="w-3 h-3 fill-white" />
                                <span>WhatsApp</span>
                              </a>
                              {onDeleteOrder && (
                                <button
                                  onClick={() => setOrderToDelete(ord)}
                                  title="Delete Order (آرڈر ڈیلیٹ کریں)"
                                  className="p-1.5 text-stone-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>

                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Orders Controls */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 flex-1">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search by order #, customer name, phone, city..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-amber-600"
                  />
                </div>
              </div>

              {/* Status Filter Tabs & Clear All */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  {['all', 'pending', 'confirmed', 'dispatched', 'delivered'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setOrderFilter(st)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors cursor-pointer whitespace-nowrap ${
                        orderFilter === st
                          ? 'bg-emerald-950 text-amber-100 shadow-2xs'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                {orders.length > 0 && onClearAllOrders && (
                  <button
                    onClick={() => setIsClearAllConfirmOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All (تمام آرڈرز صاف کریں)</span>
                  </button>
                )}
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              {filteredOrders.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-2xl border border-stone-200 text-stone-500">
                  <ShoppingBag className="w-10 h-10 mx-auto text-stone-300 mb-2" />
                  <p className="font-semibold text-stone-800">کوئی آرڈر ابھی موجود نہیں ہے (No Orders)</p>
                  <p className="text-xs text-stone-400 mt-1">
                    پرانے فرضی/ڈیمو نام کلیئر ہو چکے ہیں۔ گاہک کے نئے آرڈرز یہاں ظاہر ہوں گے۔
                  </p>
                </div>
              ) : (

                filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs hover:border-amber-300 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-emerald-950 text-sm bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                          {order.orderNumber}
                        </span>
                        <span className="text-xs text-stone-400">{order.createdAt}</span>
                      </div>

                      {/* Status Selector */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-stone-500 font-medium">Status:</span>
                        <select
                          value={order.status}
                          onChange={(e) =>
                            onUpdateOrderStatus(order.id, e.target.value as OrderStatus)
                          }
                          className="text-xs font-bold py-1 px-2.5 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-amber-600 cursor-pointer"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="dispatched">Dispatched</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    {/* Order Details Body */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-xs">
                      {/* Customer info */}
                      <div>
                        <h4 className="font-semibold text-stone-900 mb-1">Customer & Address:</h4>
                        <p className="font-bold text-stone-800">{order.customerName}</p>
                        <p className="text-stone-600 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-emerald-700" />
                          <span>{order.customerPhone}</span>
                        </p>
                        <p className="text-stone-500 mt-1">{order.address}</p>
                        <p className="text-stone-700 font-semibold">{order.city}, Pakistan</p>
                        {order.notes && (
                          <p className="text-amber-800 bg-amber-50 p-1.5 rounded mt-2 text-[11px] border border-amber-200">
                            Note: {order.notes}
                          </p>
                        )}
                      </div>

                      {/* Order items */}
                      <div>
                        <h4 className="font-semibold text-stone-900 mb-1">Items Ordered:</h4>
                        <ul className="space-y-1.5">
                          {order.items.map((it, idx) => (
                            <li
                              key={idx}
                              className="flex items-center justify-between text-stone-700 bg-stone-50 p-1.5 rounded border border-stone-100"
                            >
                              <span>
                                {it.product.name} ({it.selectedWeight}) × {it.quantity}
                              </span>
                              <span className="font-semibold tabular-nums">
                                {formatPKR(it.selectedPrice * it.quantity)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Total & Action */}
                      <div className="flex flex-col justify-between bg-stone-50 p-3 rounded-xl border border-stone-100">
                        <div className="space-y-1">
                          <div className="flex justify-between text-stone-500">
                            <span>Subtotal:</span>
                            <span className="tabular-nums">{formatPKR(order.subtotal)}</span>
                          </div>
                          <div className="flex justify-between text-stone-500">
                            <span>Delivery:</span>
                            <span>{order.shippingFee === 0 ? 'FREE' : formatPKR(order.shippingFee)}</span>
                          </div>
                          <div className="flex justify-between font-bold text-stone-900 pt-1 border-t border-stone-200">
                            <span>Grand Total:</span>
                            <span className="font-serif text-emerald-950 text-sm tabular-nums">
                              {formatPKR(order.total)}
                            </span>
                          </div>
                        </div>

                        <div className="pt-3 flex items-center gap-2">
                          <a
                            href={getWhatsAppCustomerLink(order)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold rounded-lg text-xs shadow-xs transition-colors"
                          >
                            <MessageCircle className="w-3.5 h-3.5 fill-white" />
                            <span>WhatsApp Customer</span>
                          </a>
                          {onDeleteOrder && (
                            <button
                              onClick={() => setOrderToDelete(order)}
                              title="Delete Order (آرڈر ڈیلیٹ کریں)"
                              className="p-2 bg-stone-100 hover:bg-red-50 text-stone-500 hover:text-red-600 border border-stone-200 hover:border-red-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 3: PRODUCTS & PRICING */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search product by title or Urdu name..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-amber-600"
                  />
                </div>

                <select
                  value={productCatFilter}
                  onChange={(e) => setProductCatFilter(e.target.value)}
                  className="text-xs py-2 px-3 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none"
                >
                  <option value="all">All Categories</option>
                  <option value="honey">Pure Honey</option>
                  <option value="achar">Chatpata Achar</option>
                  <option value="murabba">Lazeez Murabbay</option>
                </select>
              </div>

              <button
                onClick={() => setIsNewProductModalOpen(true)}
                className="flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-950 hover:bg-emerald-900 text-amber-200 text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Jar / Product</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-semibold border-b border-stone-200">
                    <tr>
                      <th className="p-3">Product</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Base Price (PKR)</th>
                      <th className="p-3">Weight Sizes</th>
                      <th className="p-3">Stock Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredProducts.map((prod) => (
                      <tr key={prod.id} className="hover:bg-stone-50/50">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={prod.image || '/src/assets/images/product_pure_sidr_honey_1791803704705.jpg'}
                              alt={prod.name}
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = '/src/assets/images/product_pure_sidr_honey_1791803704705.jpg';
                              }}
                              className="w-12 h-12 rounded-lg object-cover bg-stone-100 border border-stone-200 shrink-0"
                            />
                            <div>
                              <div className="font-bold text-stone-900">{prod.name}</div>
                              <div className="text-amber-800 font-serif text-[11px]">
                                {prod.urduName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="capitalize text-stone-600 font-semibold">
                            {prod.category}
                          </span>
                        </td>
                        <td className="p-3 font-serif font-bold text-stone-900 text-sm tabular-nums">
                          {formatPKR(prod.price)}
                        </td>
                        <td className="p-3 text-stone-600">
                          {prod.weightOptions.map((o) => `${o.weight} (${formatPKR(o.price)})`).join(', ')}
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() =>
                              onUpdateProduct({ ...prod, inStock: !prod.inStock })
                            }
                            className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                              prod.inStock
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                            }`}
                          >
                            {prod.inStock ? 'In Stock ✓' : 'Out of Stock ✗'}
                          </button>
                        </td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            onClick={() => setEditingProduct(prod)}
                            className="p-1.5 text-stone-600 hover:text-emerald-900 rounded-md hover:bg-stone-100 transition-colors cursor-pointer inline-block"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete ${prod.name}?`)) {
                                onDeleteProduct(prod.id);
                              }
                            }}
                            className="p-1.5 text-stone-400 hover:text-red-700 rounded-md hover:bg-stone-100 transition-colors cursor-pointer inline-block"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: EDIT PRODUCT IMAGES */}
        {activeTab === 'product-images' && (
          <div className="space-y-6 text-left">
            {/* Header info */}
            <div className="bg-gradient-to-r from-stone-900 to-stone-800 text-white rounded-3xl p-6 sm:p-8 border border-[#D4AF37]/40 shadow-md">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-xs font-bold text-[#D4AF37] mb-2">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Product Catalog Photos (پروڈکٹس کی تصاویر)</span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
                    Edit Product Images — Honey, Achar & Murabba
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-2xl leading-relaxed">
                    Upload new photos for any jar in your pantry. Images are automatically converted into optimized high-definition format, saved to Cloud Firestore & localStorage, and immediately updated live across the homepage and product pages.
                  </p>
                </div>
                <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
                  {onManualSync && (
                    <button
                      onClick={onManualSync}
                      disabled={isSyncing}
                      className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#D4AF37] hover:bg-[#c49f2e] text-[#0A0A0A] rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
                      title="Sync images between phone and laptop"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                      <span>{isSyncing ? 'Syncing...' : 'Sync Phone & Laptop'}</span>
                    </button>
                  )}
                  <button
                    onClick={onReturnToStore}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Eye className="w-4 h-4 text-[#D4AF37]" />
                    <span>View Live Store</span>
                  </button>
                </div>
              </div>

              {/* Category Pills & Search */}
              <div className="mt-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                  {[
                    { id: 'all', label: 'All Products', count: products.length },
                    { id: 'honey', label: 'Pure Honey (شہد)', count: products.filter((p) => p.category === 'honey').length },
                    { id: 'achar', label: 'Desi Achar (اچار)', count: products.filter((p) => p.category === 'achar').length },
                    { id: 'murabba', label: 'Lazeez Murabba (مربہ)', count: products.filter((p) => p.category === 'murabba').length },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setProductImageCatFilter(cat.id)}
                      className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                        productImageCatFilter === cat.id
                          ? 'bg-[#D4AF37] text-[#0A0A0A] font-bold shadow-xs'
                          : 'bg-white/10 text-stone-300 hover:bg-white/20'
                      }`}
                    >
                      <span>{cat.label}</span>
                      <span className="text-[10px] opacity-75 font-mono">({cat.count})</span>
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search product..."
                    value={productImageSearch}
                    onChange={(e) => setProductImageSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-800/80 border border-stone-600 rounded-xl text-white placeholder-stone-400 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>
            </div>

            {/* Notification alert if an image was updated */}
            {savedProductImageId && (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-2xl flex items-center justify-between text-xs font-semibold shadow-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>تصویر کامیابی سے تبدیل ہو گئی ہے! (Product photo successfully saved & live on homepage!)</span>
                </div>
                <button
                  onClick={onReturnToStore}
                  className="px-3 py-1 bg-emerald-800 text-white rounded-lg text-xs hover:bg-emerald-900 cursor-pointer font-bold"
                >
                  View on Homepage →
                </button>
              </div>
            )}

            {/* Product Cards Grid for Image Management */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredImageProducts.map((prod) => {
                const isUploading = uploadingProductId === prod.id;

                return (
                  <div
                    key={prod.id}
                    className="bg-white rounded-3xl border border-stone-200 hover:border-[#D4AF37]/60 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    {/* Top details */}
                    <div className="p-5 pb-3">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                          {prod.category === 'honey'
                            ? 'Pure Honey (شہد)'
                            : prod.category === 'achar'
                            ? 'Desi Achar (اچار)'
                            : 'Murabba (مربہ)'}
                        </span>
                        <span className="text-xs font-serif font-bold text-stone-900">
                          {formatPKR(prod.price)}
                        </span>
                      </div>

                      <h3 className="font-serif font-bold text-stone-900 text-base leading-snug">
                        {prod.name}
                      </h3>
                      <p className="text-xs font-serif text-[#D4AF37] font-semibold mt-0.5">
                        {prod.urduName}
                      </p>
                    </div>

                    {/* Image Preview Box */}
                    <div className="px-5">
                      <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 group">
                        {(() => {
                          const categoryFallback =
                            prod.category === 'achar'
                              ? '/src/assets/images/product_traditional_mango_achar_1791803728636.jpg'
                              : prod.category === 'murabba'
                              ? '/src/assets/images/product_shahi_amla_murabba_1791803749444.jpg'
                              : '/src/assets/images/product_pure_sidr_honey_1791803704705.jpg';
                          const displaySrc = prod.image || categoryFallback;

                          return (
                            <img
                              key={displaySrc}
                              src={displaySrc}
                              alt={prod.name}
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = categoryFallback;
                              }}
                              className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-300"
                            />
                          );
                        })()}

                        {/* Loading Spinner during image upload & compression */}
                        {isUploading && (
                          <div className="absolute inset-0 bg-stone-950/85 backdrop-blur-xs flex flex-col items-center justify-center text-white text-xs gap-2 z-20">
                            <div className="w-8 h-8 rounded-full border-3 border-[#D4AF37]/30 border-t-[#D4AF37] animate-spin flex items-center justify-center" />
                            <span className="font-bold text-[#D4AF37]">Compressing (Max 800px)...</span>
                            <span className="text-[10px] text-stone-300">Saving to Phone & Cloud</span>
                          </div>
                        )}

                        <div className="absolute bottom-2 left-2 bg-[#0A0A0A]/80 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-md border border-white/20">
                          Active Photo
                        </div>
                        {prod.image?.startsWith('data:') && (
                          <div className="absolute top-2 right-2 bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                            <Check className="w-2.5 h-2.5" />
                            <span>Custom (Base64)</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions & Upload Input */}
                    <div className="p-5 pt-4 space-y-3">
                      {/* Upload button wrapper with hidden file input */}
                      <label className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-[#D4AF37] hover:text-white border border-[#D4AF37]/50 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer">
                        <Upload className="w-4 h-4 text-[#D4AF37]" />
                        <span>{isUploading ? 'Uploading...' : 'Upload New Photo'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          disabled={isUploading}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleProductCardImageUpload(prod, file);
                            }
                            e.target.value = '';
                          }}
                          className="hidden"
                        />
                      </label>

                      {/* Reset to default photo */}
                      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-stone-100">
                        <button
                          type="button"
                          onClick={() => handleResetProductDefaultImage(prod)}
                          className="text-stone-500 hover:text-amber-800 underline transition-colors cursor-pointer"
                        >
                          Reset original photo
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingProduct(prod)}
                          className="text-stone-700 hover:text-emerald-900 font-semibold cursor-pointer flex items-center gap-1"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Edit Details</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: EDIT BANNER IMAGE */}
        {activeTab === 'banner-image' && (
          <div className="space-y-6 text-left">
            {/* Header info */}
            <div className="bg-gradient-to-r from-stone-950 via-[#1A1A1A] to-stone-900 text-white rounded-3xl p-6 sm:p-8 border border-[#D4AF37]/40 shadow-lg">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-xs font-bold text-[#D4AF37] mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Hero Section Banner (ہوم پیج کا مین بینر)</span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
                    Edit Banner / Hero Image
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-2xl leading-relaxed">
                    Change the main banner showing honey jars on the homepage (Eat Fresh, Feel Heaven section). Upload a new banner image below, preview it instantly, and apply it live to the website.
                  </p>
                </div>
                <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
                  {onManualSync && (
                    <button
                      onClick={onManualSync}
                      disabled={isSyncing}
                      className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#D4AF37] hover:bg-[#c49f2e] text-[#0A0A0A] rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
                      title="Sync banner and products with Cloud"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                      <span>{isSyncing ? 'Syncing...' : 'Sync Phone & Laptop'}</span>
                    </button>
                  )}
                  <button
                    onClick={onReturnToStore}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Eye className="w-4 h-4 text-[#D4AF37]" />
                    <span>View Live Homepage</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Notification alert */}
            {bannerSuccessNotice && (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-2xl flex items-center justify-between text-xs font-semibold shadow-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>{bannerSuccessNotice}</span>
                </div>
                <button
                  onClick={onReturnToStore}
                  className="px-3 py-1 bg-emerald-800 text-white rounded-lg text-xs hover:bg-emerald-900 cursor-pointer font-bold"
                >
                  Open Homepage to View →
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Upload Controls */}
              <div className="lg:col-span-5 space-y-6">
                {/* Upload Box */}
                <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-2xs space-y-5">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-stone-900">
                      Upload New Banner Photo
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Auto-compressed to 800px width for ultra-fast loading across mobile and desktop.
                    </p>
                  </div>

                  {/* Drag and Drop / Click Area */}
                  <label className="relative border-2 border-dashed border-[#D4AF37]/60 hover:border-[#D4AF37] bg-stone-50/70 hover:bg-amber-50/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all group overflow-hidden">
                    {isUploadingBanner && (
                      <div className="absolute inset-0 bg-stone-950/85 backdrop-blur-xs flex flex-col items-center justify-center text-white text-xs gap-2.5 z-20">
                        <div className="w-9 h-9 rounded-full border-3 border-[#D4AF37]/30 border-t-[#D4AF37] animate-spin flex items-center justify-center" />
                        <span className="font-bold text-[#D4AF37]">Compressing Banner (Max 800px)...</span>
                        <span className="text-[10px] text-stone-300">Saving to localStorage & Cloud</span>
                      </div>
                    )}
                    <div className="w-14 h-14 rounded-full bg-[#0A0A0A] text-[#D4AF37] flex items-center justify-center shadow-md mb-3 group-hover:scale-105 transition-transform">
                      {isUploadingBanner ? (
                        <div className="w-6 h-6 rounded-full border-2 border-[#D4AF37]/30 border-t-[#D4AF37] animate-spin" />
                      ) : (
                        <Upload className="w-6 h-6" />
                      )}
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-stone-900 mb-1">
                      {isUploadingBanner ? 'Compressing image...' : 'Click to Upload New Banner'}
                    </span>
                    <span className="text-[11px] text-stone-500">
                      Supports JPG, PNG, WebP (Max 800px Base64)
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isUploadingBanner}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleBannerFileUpload(file);
                        e.target.value = '';
                      }}
                      className="hidden"
                    />
                  </label>

                  {/* Alternative URL Input */}
                  <div className="space-y-1.5 pt-2 border-t border-stone-100">
                    <label className="text-xs font-semibold text-stone-700 block">
                      Or Paste Image URL (یا ویب تصویر کا لنک درج کریں):
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://example.com/banner-jars.jpg"
                        value={bannerUrlDraft}
                        onChange={(e) => setBannerUrlDraft(e.target.value)}
                        className="flex-1 px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#D4AF37]"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (bannerUrlDraft.trim()) {
                            setBannerPreview(bannerUrlDraft.trim());
                            setBannerSuccessNotice('URL loaded! Click "Save & Apply to Homepage" below.');
                          }
                        }}
                        className="px-3 py-2 bg-stone-900 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-stone-900 text-xs font-bold rounded-xl transition-all cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>
                  </div>

                  {/* Primary Save & Reset Buttons */}
                  <div className="pt-3 space-y-2.5">
                    <button
                      type="button"
                      onClick={handleSaveBanner}
                      className="w-full py-3.5 px-5 bg-gradient-to-r from-emerald-800 to-emerald-950 hover:from-emerald-700 hover:to-emerald-900 text-amber-100 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Save className="w-4 h-4 text-amber-400" />
                      <span>Save & Apply to Homepage (محفوظ کریں اور ہوم پیج پر لگائیں)</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleResetDefaultBanner}
                      className="w-full py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Restore Default Luxury Banner (اصلی بینر بحال کریں)</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Live Mockup of Homepage Hero Card */}
              <div className="lg:col-span-7">
                <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-stone-900">
                        Live Homepage Hero Preview
                      </h3>
                      <p className="text-xs text-stone-500">
                        This is how your banner appears to visitors on the Taste Heven homepage.
                      </p>
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                      Live Preview
                    </span>
                  </div>

                  {/* Hero Image Container Mockup */}
                  <div className="relative rounded-[32px] overflow-hidden bg-stone-900 border border-[#0A0A0A]/10 shadow-xl aspect-16/10 group">
                    <img
                      src={bannerPreview || DEFAULT_HERO_BANNER}
                      alt="Banner Preview"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = DEFAULT_HERO_BANNER;
                      }}
                      className="w-full h-full object-cover object-center"
                    />

                    {/* Measured contrast scrim */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                    {/* Circular badge emblem mockup */}
                    <div className="absolute top-4 right-4 z-10 drop-shadow-2xl">
                      <TasteHevenLogo variant="badge" size={60} />
                    </div>

                    {/* Artisanal banner strip */}
                    <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-xl border border-[#D4AF37]/40 p-3 sm:p-4 rounded-[20px] flex items-center justify-between shadow-lg">
                      <div>
                        <p className="text-xs font-bold text-[#0A0A0A]">
                          Taste Heven Artisanal Pantry
                        </p>
                        <p className="text-[10px] text-stone-600 font-medium">
                          Sanitized food-grade glass jars · Zero chemicals
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-[#0A0A0A] bg-stone-100 border border-[#D4AF37]/50 px-2.5 py-0.5 rounded-full">
                          COD Pakistan
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 text-xs text-stone-600 flex items-center justify-between">
                    <span>
                      {bannerPreview.startsWith('data:')
                        ? 'Custom uploaded image active in preview.'
                        : 'Default luxury Taste Heven honey jars banner active.'}
                    </span>
                    <button
                      onClick={onReturnToStore}
                      className="text-emerald-800 font-bold hover:underline cursor-pointer"
                    >
                      Visit Live Storefront →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: STORE OWNERS */}
        {activeTab === 'team' && (
          <div className="space-y-6">
            <div className="bg-amber-50/80 p-5 rounded-2xl border border-amber-200/80">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm mb-1">
                <Shield className="w-4 h-4 text-amber-700" />
                <span>Taste Heven Store Owners: احمد وسیم & فرمان علی</span>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                Taste Heven کے دونوں آنرز (Ahmad Waseem اور Farman Ali) کے ایڈمن اکاؤنٹس یہاں محفوظ ہیں۔ دونوں حضرات پروڈکٹ کی قیمتیں، شہد، اچار اور مربے کا سٹاک، اور واٹس ایپ آرڈرز کا مکمل انتظام سنبھال سکتے ہیں۔
              </p>
            </div>

            {/* 4 Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {adminUsers.map((user, idx) => (
                <div
                  key={user.id}
                  className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${user.avatarColor} text-white font-serif font-bold text-lg flex items-center justify-center shadow-2xs`}
                        >
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-stone-900 text-base">{user.name}</h3>
                            <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded font-mono">
                              User #{idx + 1}
                            </span>
                          </div>
                          <span className="text-xs font-semibold text-emerald-800">
                            {user.role}
                          </span>
                        </div>
                      </div>

                      {currentUser.id === user.id && (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                          You (Active)
                        </span>
                      )}
                    </div>

                    {/* Credentials Box */}
                    <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs space-y-1.5 mb-4 font-mono">
                      <div className="flex justify-between">
                        <span className="text-stone-500">Username:</span>
                        <strong className="text-stone-900 font-bold">{user.username}</strong>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-stone-500">Password:</span>
                        <span className="text-amber-800 font-bold bg-white px-2 py-0.5 rounded border border-stone-200">
                          {user.password}
                        </span>
                      </div>
                      {user.phone && (
                        <div className="flex justify-between text-stone-500">
                          <span>Phone:</span>
                          <span>{user.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-[11px] text-stone-400">
                      Last access: {user.lastLogin || 'Recent'}
                    </span>
                    <button
                      onClick={() => {
                        setPasswordChangeUser(user);
                        setNewPasswordValue(user.password);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      <Key className="w-3.5 h-3.5" />
                      <span>Change Password</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* EDIT PRODUCT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 text-left max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-200">
              <h3 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
                <span>Edit Product & Price</span>
                <span className="text-xs font-normal text-stone-500 font-serif">
                  (پروڈکٹ، تصویر اور قیمت میں ترمیم)
                </span>
              </h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-stone-400 hover:text-stone-700 cursor-pointer p-1 rounded-lg hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProductEdit} className="space-y-4 text-xs">
              {/* PRODUCT IMAGE UPLOAD & PREVIEW FIELD */}
              <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-stone-800 font-bold flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#D4AF37]" />
                    <span>Product Image / پروڈکٹ کی تصویر:</span>
                  </label>
                  {editingProduct.image?.startsWith('data:image') && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                      Custom Base64 Image ✓
                    </span>
                  )}
                </div>

                <div className="flex gap-3.5 items-start">
                  {/* Image Preview Thumbnail */}
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-stone-200 border-2 border-[#D4AF37]/40 shrink-0 shadow-inner group">
                    <img
                      src={editingProduct.image || '/src/assets/images/product_pure_sidr_honey_1791803704705.jpg'}
                      alt={editingProduct.name}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/src/assets/images/product_pure_sidr_honey_1791803704705.jpg';
                      }}
                      className="w-full h-full object-cover"
                    />
                    {isUploadingEditImage && (
                      <div className="absolute inset-0 bg-stone-900/80 backdrop-blur-2xs flex flex-col items-center justify-center text-white p-1 text-center">
                        <RefreshCw className="w-4 h-4 animate-spin text-[#D4AF37] mb-1" />
                        <span className="text-[9px] font-bold">Processing...</span>
                      </div>
                    )}
                  </div>

                  {/* Upload Controls & URL */}
                  <div className="flex-1 space-y-2">
                    <label className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#0A0A0A] hover:bg-[#1A1A1A] text-[#D4AF37] border border-[#D4AF37]/50 rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-xs">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploadingEditImage ? 'Processing...' : 'Upload Image / تصویر منتخب کریں'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={isUploadingEditImage}
                        onChange={handleEditImageUpload}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[11px] text-stone-500 leading-tight">
                      Choose any photo from your mobile or PC. Automatically converted to base64 & saved to database.
                    </p>

                    {/* Direct Image URL input */}
                    <div>
                      <span className="text-[10px] text-stone-600 font-semibold block mb-0.5">
                        Image URL / یا تصویر کا ویب لنک:
                      </span>
                      <input
                        type="text"
                        value={editingProduct.image || ''}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, image: e.target.value })
                        }
                        placeholder="https://... or data:image/..."
                        className="w-full p-1.5 text-[11px] bg-white border border-stone-300 rounded-md font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="pt-1 border-t border-stone-200/80 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] text-stone-500 font-semibold">Quick Presets:</span>
                  <button
                    type="button"
                    onClick={() =>
                      setEditingProduct({
                        ...editingProduct,
                        image: '/src/assets/images/product_pure_sidr_honey_1791803704705.jpg',
                      })
                    }
                    className="px-2 py-0.5 text-[10px] bg-stone-200/70 hover:bg-stone-300 rounded text-stone-700 cursor-pointer"
                  >
                    🍯 Sidr Honey
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setEditingProduct({
                        ...editingProduct,
                        image: '/src/assets/images/product_spicy_mango_achar_1791803720039.jpg',
                      })
                    }
                    className="px-2 py-0.5 text-[10px] bg-stone-200/70 hover:bg-stone-300 rounded text-stone-700 cursor-pointer"
                  >
                    🥭 Mango Achar
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setEditingProduct({
                        ...editingProduct,
                        image: '/src/assets/images/product_lazeez_seb_murabba_1791803738733.jpg',
                      })
                    }
                    className="px-2 py-0.5 text-[10px] bg-stone-200/70 hover:bg-stone-300 rounded text-stone-700 cursor-pointer"
                  >
                    🍎 Seb Murabba
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Product Title:</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, name: e.target.value })
                  }
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Urdu Title (اردو نام):</label>
                <input
                  type="text"
                  value={editingProduct.urduName}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, urduName: e.target.value })
                  }
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg font-serif text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">
                    Base Price (PKR):
                  </label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        price: Number(e.target.value),
                      })
                    }
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Category:</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        category: e.target.value as any,
                      })
                    }
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg"
                  >
                    <option value="honey">Pure Honey (شہد)</option>
                    <option value="achar">Chatpata Achar (اچار)</option>
                    <option value="murabba">Lazeez Murabbay (مربہ)</option>
                  </select>
                </div>
              </div>

              {/* Status Toggles: Stock & Featured */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="flex items-center gap-2 p-2 bg-stone-50 border border-stone-200 rounded-lg">
                  <input
                    type="checkbox"
                    id="edit-in-stock"
                    checked={editingProduct.inStock ?? true}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, inStock: e.target.checked })
                    }
                    className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                  />
                  <label htmlFor="edit-in-stock" className="text-xs font-semibold text-stone-800 cursor-pointer">
                    In Stock (دستیاب ہے)
                  </label>
                </div>

                <div className="flex items-center gap-2 p-2 bg-stone-50 border border-stone-200 rounded-lg">
                  <input
                    type="checkbox"
                    id="edit-featured"
                    checked={editingProduct.featured ?? false}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, featured: e.target.checked })
                    }
                    className="w-4 h-4 text-amber-500 rounded cursor-pointer"
                  />
                  <label htmlFor="edit-featured" className="text-xs font-semibold text-stone-800 flex items-center gap-1 cursor-pointer">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Featured (خاص انتخاب)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">
                  Weight Sizes & Prices:
                </label>
                <div className="space-y-2">
                  {editingProduct.weightOptions.map((opt, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Size (e.g. 500g)"
                        value={opt.weight}
                        onChange={(e) => {
                          const updated = [...editingProduct.weightOptions];
                          updated[i] = { ...updated[i], weight: e.target.value };
                          setEditingProduct({ ...editingProduct, weightOptions: updated });
                        }}
                        className="w-1/2 p-2 bg-stone-50 border border-stone-300 rounded-lg"
                      />
                      <input
                        type="number"
                        placeholder="Price PKR"
                        value={opt.price}
                        onChange={(e) => {
                          const updated = [...editingProduct.weightOptions];
                          updated[i] = { ...updated[i], price: Number(e.target.value) };
                          setEditingProduct({ ...editingProduct, weightOptions: updated });
                        }}
                        className="w-1/2 p-2 bg-stone-50 border border-stone-300 rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Short Description:</label>
                <textarea
                  rows={2}
                  value={editingProduct.shortDesc || ''}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, shortDesc: e.target.value })
                  }
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0A0A0A] hover:bg-[#1A1A1A] text-[#D4AF37] border border-[#D4AF37]/50 font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE NEW PRODUCT MODAL */}
      {isNewProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 text-left max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-200">
              <h3 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
                <span>Add New Pantry Product</span>
                <span className="text-xs font-normal text-stone-500 font-serif">
                  (نئی پروڈکٹ اور تصویر شامل کریں)
                </span>
              </h3>
              <button
                onClick={() => setIsNewProductModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 cursor-pointer p-1 rounded-lg hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              {/* PRODUCT IMAGE UPLOAD & PREVIEW FIELD */}
              <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-stone-800 font-bold flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#D4AF37]" />
                    <span>Product Image / پروڈکٹ کی تصویر:</span>
                  </label>
                  {newProd.image?.startsWith('data:image') && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                      Uploaded Base64 ✓
                    </span>
                  )}
                </div>

                <div className="flex gap-3.5 items-start">
                  {/* Image Preview Thumbnail */}
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-stone-200 border-2 border-[#D4AF37]/40 shrink-0 shadow-inner group">
                    <img
                      src={newProd.image || '/src/assets/images/product_pure_sidr_honey_1791803704705.jpg'}
                      alt="New Product"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/src/assets/images/product_pure_sidr_honey_1791803704705.jpg';
                      }}
                      className="w-full h-full object-cover"
                    />
                    {isUploadingNewImage && (
                      <div className="absolute inset-0 bg-stone-900/80 backdrop-blur-2xs flex flex-col items-center justify-center text-white p-1 text-center">
                        <RefreshCw className="w-4 h-4 animate-spin text-[#D4AF37] mb-1" />
                        <span className="text-[9px] font-bold">Processing...</span>
                      </div>
                    )}
                  </div>

                  {/* Upload Controls & URL */}
                  <div className="flex-1 space-y-2">
                    <label className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#0A0A0A] hover:bg-[#1A1A1A] text-[#D4AF37] border border-[#D4AF37]/50 rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-xs">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploadingNewImage ? 'Processing...' : 'Upload Image / تصویر منتخب کریں'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={isUploadingNewImage}
                        onChange={handleNewImageUpload}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[11px] text-stone-500 leading-tight">
                      Upload from phone or computer. Automatically converted to base64 for fast rendering.
                    </p>

                    <div>
                      <span className="text-[10px] text-stone-600 font-semibold block mb-0.5">
                        Image URL / یا تصویر کا لنک:
                      </span>
                      <input
                        type="text"
                        value={newProd.image || ''}
                        onChange={(e) => setNewProd({ ...newProd, image: e.target.value })}
                        placeholder="https://... or data:image/..."
                        className="w-full p-1.5 text-[11px] bg-white border border-stone-300 rounded-md font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="pt-1 border-t border-stone-200/80 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] text-stone-500 font-semibold">Quick Presets:</span>
                  <button
                    type="button"
                    onClick={() =>
                      setNewProd({
                        ...newProd,
                        image: '/src/assets/images/product_pure_sidr_honey_1791803704705.jpg',
                      })
                    }
                    className="px-2 py-0.5 text-[10px] bg-stone-200/70 hover:bg-stone-300 rounded text-stone-700 cursor-pointer"
                  >
                    🍯 Sidr Honey
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setNewProd({
                        ...newProd,
                        image: '/src/assets/images/product_spicy_mango_achar_1791803720039.jpg',
                      })
                    }
                    className="px-2 py-0.5 text-[10px] bg-stone-200/70 hover:bg-stone-300 rounded text-stone-700 cursor-pointer"
                  >
                    🥭 Mango Achar
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setNewProd({
                        ...newProd,
                        image: '/src/assets/images/product_lazeez_seb_murabba_1791803738733.jpg',
                      })
                    }
                    className="px-2 py-0.5 text-[10px] bg-stone-200/70 hover:bg-stone-300 rounded text-stone-700 cursor-pointer"
                  >
                    🍎 Seb Murabba
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">
                  Product Name (e.g. Special Green Chilli Achar):
                </label>
                <input
                  type="text"
                  required
                  value={newProd.name}
                  onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">
                  Urdu Name (e.g. ہری مرچ کا چٹپٹا اچار):
                </label>
                <input
                  type="text"
                  value={newProd.urduName}
                  onChange={(e) => setNewProd({ ...newProd, urduName: e.target.value })}
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg font-serif text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">
                    Price in PKR:
                  </label>
                  <input
                    type="number"
                    required
                    value={newProd.price}
                    onChange={(e) => setNewProd({ ...newProd, price: Number(e.target.value) })}
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Category:</label>
                  <select
                    value={newProd.category}
                    onChange={(e) => setNewProd({ ...newProd, category: e.target.value as any })}
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg"
                  >
                    <option value="honey">Pure Honey (شہد)</option>
                    <option value="achar">Chatpata Achar (اچار)</option>
                    <option value="murabba">Lazeez Murabbay (مربہ)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Description:</label>
                <textarea
                  rows={2}
                  value={newProd.shortDesc}
                  onChange={(e) => setNewProd({ ...newProd, shortDesc: e.target.value })}
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsNewProductModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0A0A0A] hover:bg-[#1A1A1A] text-[#D4AF37] border border-[#D4AF37]/50 font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Product</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CHANGE PASSWORD MODAL */}
      {passwordChangeUser && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 text-left">
            <h3 className="font-serif text-base font-bold text-stone-900 mb-1">
              Change Password for {passwordChangeUser.name}
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Username: <strong className="text-stone-800">{passwordChangeUser.username}</strong>
            </p>

            <form onSubmit={handleSavePassword} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  New Password:
                </label>
                <input
                  type="text"
                  required
                  value={newPasswordValue}
                  onChange={(e) => setNewPasswordValue(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg font-mono text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPasswordChangeUser(null)}
                  className="px-3 py-2 bg-stone-100 text-stone-700 font-semibold rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-950 text-amber-200 font-semibold rounded-lg cursor-pointer"
                >
                  Save Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE SINGLE ORDER MODAL */}
      {orderToDelete && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 text-left">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-3">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-base font-bold text-stone-900 mb-1">
              آرڈر ڈیلیٹ کریں (Delete Order)
            </h3>
            <p className="text-xs text-stone-600 mb-4 leading-relaxed">
              کیا آپ واقعی آرڈر <strong className="text-stone-900">#{orderToDelete.orderNumber}</strong> ({orderToDelete.customerName}) کو پورٹل سے مستقل ختم کرنا چاہتے ہیں؟
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOrderToDelete(null)}
                className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-lg text-xs cursor-pointer"
              >
                کینسل (Cancel)
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onDeleteOrder && orderToDelete) {
                    onDeleteOrder(orderToDelete.id);
                  }
                  setOrderToDelete(null);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg text-xs cursor-pointer"
              >
                ہاں، ختم کریں (Delete)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM CLEAR ALL ORDERS MODAL */}
      {isClearAllConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 text-left">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-3">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-base font-bold text-stone-900 mb-1">
              تمام آرڈرز صاف کریں (Clear All Orders)
            </h3>
            <p className="text-xs text-stone-600 mb-4 leading-relaxed">
              کیا آپ تمام پرانے اور ڈیمو آرڈرز کو کلاؤڈ اور پورٹل سے مکمل طور پر صاف کرنا چاہتے ہیں؟ اس کے بعد صرف نئے گاہکوں کے حقیقی آرڈرز آئیں گے۔
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsClearAllConfirmOpen(false)}
                className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-lg text-xs cursor-pointer"
              >
                کینسل (Cancel)
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onClearAllOrders) {
                    onClearAllOrders();
                  }
                  setIsClearAllConfirmOpen(false);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg text-xs cursor-pointer"
              >
                تمام صاف کریں (Clear All)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


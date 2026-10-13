/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import Lenis from 'lenis';
import { Product, ProductCategory, CartItem, AdminUser, OrderRecord, OrderStatus } from './types';
import { PRODUCTS } from './data/products';
import { INITIAL_ADMIN_USERS, INITIAL_ORDERS } from './data/adminUsers';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Categories } from './components/Categories';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { WhyChooseUs } from './components/WhyChooseUs';
import { Reviews } from './components/Reviews';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';
import { Toast } from './components/Toast';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { formatPKR } from './utils/whatsapp';
import { testConnection } from './firebase';
import {
  subscribeToOrders,
  saveOrderToFirestore,
  deleteOrderFromFirestore,
  clearAllOrdersFromFirestore,
  updateOrderStatusInFirestore,
  subscribeToProducts,
  saveProductToFirestore,
  deleteProductFromFirestore,
} from './services/firebaseService';
import { Sparkles, Search, RotateCcw, Shield, ArrowRight, CloudCheck } from 'lucide-react';

export default function App() {
  // Load products with Firestore sync + localStorage persistence
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('taste_heven_products');
      return saved ? JSON.parse(saved) : PRODUCTS;
    } catch {
      return PRODUCTS;
    }
  });

  // Load orders with Firestore sync + localStorage persistence (purging any legacy demo orders)
  const [orders, setOrders] = useState<OrderRecord[]>(() => {
    try {
      const saved = localStorage.getItem('taste_heven_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const cleaned = parsed.filter(
            (o: OrderRecord) =>
              !o.id.startsWith('ord-10') &&
              !/ayesha|siddiqu|usman|salman|khurram/i.test(o.customerName || '')
          );
          localStorage.setItem('taste_heven_orders', JSON.stringify(cleaned));
          return cleaned;
        }
      }
      return [];
    } catch {
      return [];
    }
  });

  // Load Store Owners with localStorage persistence
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(() => {
    try {
      const saved = localStorage.getItem('taste_heven_owners_v2');
      return saved ? JSON.parse(saved) : INITIAL_ADMIN_USERS;
    } catch {
      return INITIAL_ADMIN_USERS;
    }
  });

  // Active logged-in admin user
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem('taste_heven_current_admin');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.username === 'ahmad' || parsed.username === 'farman') {
          return parsed;
        }
      }
      return null;
    } catch {
      return null;
    }
  });

  // Mode: customer store or admin dashboard
  const [viewMode, setViewMode] = useState<'store' | 'admin'>('store');
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState(false);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('taste_heven_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeCategory, setActiveCategory] = useState<ProductCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Toast feedback state
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    subMessage?: string;
  }>({
    visible: false,
    message: '',
  });

  // Initialize Lenis smooth scroll for 60fps Sweetgreen-style experience
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  // Test Firebase connection & subscribe to real-time updates
  useEffect(() => {
    testConnection().then((connected) => {
      setIsFirebaseConnected(connected);
    });

    const unsubscribeOrders = subscribeToOrders((cloudOrders) => {
      setOrders(cloudOrders || []);
    });


    const unsubscribeProducts = subscribeToProducts((cloudProducts) => {
      if (cloudProducts && cloudProducts.length > 0) {
        setProducts(cloudProducts);
      }
    });

    return () => {
      unsubscribeOrders();
      unsubscribeProducts();
    };
  }, []);

  // Persist products to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('taste_heven_products', JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  // Persist orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('taste_heven_orders', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  // Persist adminUsers to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('taste_heven_owners_v2', JSON.stringify(adminUsers));
    } catch (e) {
      console.error(e);
    }
  }, [adminUsers]);

  // Persist currentAdmin to localStorage
  useEffect(() => {
    try {
      if (currentAdmin) {
        localStorage.setItem('taste_heven_current_admin', JSON.stringify(currentAdmin));
      } else {
        localStorage.removeItem('taste_heven_current_admin');
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentAdmin]);

  // Persist cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('taste_heven_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Total quantity in cart
  const cartCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  // Counts per category
  const categoryCounts = useMemo(() => {
    return {
      all: products.length,
      honey: products.filter((p) => p.category === 'honey').length,
      achar: products.filter((p) => p.category === 'achar').length,
      murabba: products.filter((p) => p.category === 'murabba').length,
    };
  }, [products]);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        activeCategory === 'all' || product.category === activeCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.urduName.includes(searchQuery) ||
        product.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, searchQuery]);

  // Add to cart handler
  const handleAddToCart = (
    product: Product,
    weight: string,
    price: number,
    quantity = 1
  ) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedWeight === weight
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      } else {
        return [
          ...prev,
          {
            product,
            selectedWeight: weight,
            selectedPrice: price,
            quantity,
          },
        ];
      }
    });

    // Show toast
    setToast({
      visible: true,
      message: `Added ${product.name} (${weight}) to Cart`,
      subMessage: `${quantity} jar(s) · ${formatPKR(price * quantity)}`,
    });

    setTimeout(() => {
      setToast((t) => ({ ...t, visible: false }));
    }, 2800);
  };

  // Update item quantity in cart
  const handleUpdateQuantity = (
    productId: string,
    weight: string,
    newQty: number
  ) => {
    if (newQty <= 0) {
      handleRemoveItem(productId, weight);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.selectedWeight === weight
          ? { ...item, quantity: newQty }
          : item
      )
    );
  };

  // Remove item
  const handleRemoveItem = (productId: string, weight: string) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(item.product.id === productId && item.selectedWeight === weight)
      )
    );
  };

  // Clear entire cart
  const handleClearCart = () => {
    setCart([]);
  };

  // New order logged (from customer WhatsApp checkout) -> sync to Firestore!
  const handleOrderPlaced = (newOrder: OrderRecord) => {
    setOrders((prev) => [newOrder, ...prev]);
    saveOrderToFirestore(newOrder).catch((err) =>
      console.error('Firestore saveOrder error:', err)
    );
  };

  // Admin login success
  const handleLoginSuccess = (user: AdminUser) => {
    setCurrentAdmin(user);
    setViewMode('admin');
    setToast({
      visible: true,
      message: `Welcome back, ${user.name}!`,
      subMessage: `Logged in as ${user.role}`,
    });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3000);
  };

  // Admin logout
  const handleAdminLogout = () => {
    setCurrentAdmin(null);
    setViewMode('store');
    setToast({
      visible: true,
      message: 'Logged out successfully',
    });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2000);
  };

  // Product updates -> sync to Firestore!
  const handleUpdateProduct = (updated: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
    saveProductToFirestore(updated).catch((err) =>
      console.error('Firestore updateProduct error:', err)
    );
    setToast({
      visible: true,
      message: 'Product Updated',
      subMessage: `${updated.name} changes saved to Cloud Firestore.`,
    });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2500);
  };

  const handleAddProduct = (newProd: Product) => {
    setProducts((prev) => [newProd, ...prev]);
    saveProductToFirestore(newProd).catch((err) =>
      console.error('Firestore addProduct error:', err)
    );
    setToast({
      visible: true,
      message: 'New Product Added',
      subMessage: `${newProd.name} saved to Cloud Firestore.`,
    });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2500);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    deleteProductFromFirestore(productId).catch((err) =>
      console.error('Firestore deleteProduct error:', err)
    );
    setToast({
      visible: true,
      message: 'Product Removed',
      subMessage: 'Product removed from Cloud Firestore.',
    });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2500);
  };

  // Order status update -> sync to Firestore!
  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    updateOrderStatusInFirestore(orderId, status).catch((err) =>
      console.error('Firestore updateOrderStatus error:', err)
    );
    setToast({
      visible: true,
      message: 'Order Status Updated',
      subMessage: `Status changed to ${status.toUpperCase()} in Firestore`,
    });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2500);
  };

  // Delete individual order -> sync to Firestore & localStorage
  const handleDeleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    deleteOrderFromFirestore(orderId).catch((err) =>
      console.error('Firestore deleteOrder error:', err)
    );
    setToast({
      visible: true,
      message: 'Order Removed',
      subMessage: 'آرڈر کامیابی سے ہٹا دیا گیا ہے۔',
    });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2500);
  };

  // Clear all orders & history -> purge Firestore & localStorage
  const handleClearAllOrders = async () => {
    setOrders([]);
    try {
      localStorage.removeItem('taste_heven_orders');
    } catch (e) {}
    await clearAllOrdersFromFirestore().catch((err) =>
      console.error('Firestore clearAllOrders error:', err)
    );
    setToast({
      visible: true,
      message: 'All Orders Cleared',
      subMessage: 'تمام آرڈرز اور ہسٹری مکمل طور پر صاف کر دی گئی ہے۔',
    });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2500);
  };

  const scrollToProducts = () => {
    const el = document.getElementById('products');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Render Admin Dashboard if in admin view
  if (viewMode === 'admin' && currentAdmin) {
    return (
      <>
        <AdminDashboard
          currentUser={currentAdmin}
          onLogout={handleAdminLogout}
          onReturnToStore={() => setViewMode('store')}
          products={products}
          onUpdateProduct={handleUpdateProduct}
          onAddProduct={handleAddProduct}
          onDeleteProduct={handleDeleteProduct}
          orders={orders}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onDeleteOrder={handleDeleteOrder}
          onClearAllOrders={handleClearAllOrders}
          adminUsers={adminUsers}
          onUpdateAdminUsers={setAdminUsers}
        />
        <Toast
          message={toast.message}
          subMessage={toast.subMessage}
          isVisible={toast.visible}
          onOpenCart={() => {}}
        />
      </>
    );
  }


  // Render Customer Storefront
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-stone-800">
      {/* Admin Floating Shortcut Strip if logged in */}
      {currentAdmin && (
        <div className="bg-emerald-950 text-amber-200 text-xs py-2 px-4 border-b border-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>
              Logged in as <strong className="text-white">{currentAdmin.name}</strong> ({currentAdmin.role})
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-emerald-300 ml-2 bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-700">
              <CloudCheck className="w-3 h-3 text-emerald-400" />
              <span>Firebase Synced</span>
            </span>
          </div>
          <button
            onClick={() => setViewMode('admin')}
            className="flex items-center gap-1 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold rounded-md transition-colors cursor-pointer text-xs"
          >
            <span>Open Admin Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 1. Header with logo, nav links, cart badge, and admin button */}
      <Header
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={() => {
          if (currentAdmin) {
            setViewMode('admin');
          } else {
            setIsAdminLoginOpen(true);
          }
        }}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* 2. Taste Heaven Hero Banner */}
        <Hero onExploreClick={scrollToProducts} />

        {/* 3. Categories: Honey, Achar, Murabba */}
        <Categories
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          counts={categoryCounts}
        />

        {/* 4. Featured Products Section */}
        <section id="products" className="py-16 bg-white border-b border-[#0A0A0A]/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-6 border-b border-stone-100">
              <div className="text-left">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0A0A0A] bg-stone-50 border border-[#D4AF37]/40 px-3.5 py-1 rounded-full mb-2 shadow-2xs">
                  <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                  <span>
                    {activeCategory === 'all'
                      ? 'Our Complete Pantry'
                      : activeCategory === 'honey'
                      ? '100% Pure Honey (خالص شہد)'
                      : activeCategory === 'achar'
                      ? 'Chatpata Desi Achar (اچار)'
                      : 'Lazeez Murabbay (مربہ)'}
                  </span>
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0A0A0A] tracking-tight">
                  Featured Products & Handcrafted Jars
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 mt-1 font-medium">
                  Selected weight options in Pakistani Rupees (PKR) with instant Add to Cart and WhatsApp Order.
                </p>
              </div>

              {/* Active Filter Indicators / Clear Search */}
              {(searchQuery || activeCategory !== 'all') && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setActiveCategory('all');
                      setSearchQuery('');
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-[#0A0A0A] hover:text-[#D4AF37] bg-stone-100 hover:bg-stone-200 border border-[#D4AF37]/30 rounded-full transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Filters</span>
                  </button>
                </div>
              )}
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                    onAddToCart={(prod, weight, price) =>
                      handleAddToCart(prod, weight, price, 1)
                    }
                    onQuickView={(prod) => setSelectedProduct(prod)}
                  />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center bg-stone-50 rounded-3xl border border-[#0A0A0A]/10 p-8">
                <Search className="w-10 h-10 text-stone-400 mx-auto mb-3" />
                <h3 className="font-serif text-xl font-bold text-[#0A0A0A] mb-1">
                  No matching pantry items found
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto mb-4">
                  We couldn't find any products matching "{searchQuery}". Try searching for "Sidr", "Mango", or "Murabba".
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                  }}
                  className="px-5 py-2.5 bg-[#0A0A0A] text-[#D4AF37] border border-[#D4AF37]/50 text-xs font-bold rounded-full hover:bg-[#1A1A1A] transition-colors cursor-pointer"
                >
                  View All Products
                </button>
              </div>
            )}
          </div>
        </section>

        {/* 5. Why Choose Us */}
        <WhyChooseUs />

        {/* 6. Reviews */}
        <Reviews />
      </main>

      {/* 7. Footer with WhatsApp Order Button & Admin Link */}
      <Footer
        onSelectCategory={setActiveCategory}
        onOpenAdmin={() => {
          if (currentAdmin) {
            setViewMode('admin');
          } else {
            setIsAdminLoginOpen(true);
          }
        }}
      />

      {/* Slide-out Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onOrderPlaced={handleOrderPlaced}
      />

      {/* Product Quick View Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Floating WhatsApp Quick Action Widget */}
      <WhatsAppFloatingButton />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        adminUsers={adminUsers}
      />

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        subMessage={toast.subMessage}
        isVisible={toast.visible}
        onOpenCart={() => {
          setToast((t) => ({ ...t, visible: false }));
          setIsCartOpen(true);
        }}
      />
    </div>
  );
}

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
  Phone
} from 'lucide-react';

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
  adminUsers: AdminUser[];
  onUpdateAdminUsers: (users: AdminUser[]) => void;
}

type AdminTab = 'overview' | 'orders' | 'products' | 'team';

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
  adminUsers,
  onUpdateAdminUsers,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [productSearch, setProductSearch] = useState('');
  const [productCatFilter, setProductCatFilter] = useState<string>('all');

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

          <div className="flex items-center gap-3">
            {/* Active User Badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 border border-[#D4AF37]/30 text-xs">
              <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />
              <div>
                <span className="font-semibold text-white">{currentUser.name}</span>
                <span className="text-[#D4AF37] text-[10px] ml-1">({currentUser.role})</span>
              </div>
            </div>

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
                    {orders.slice(0, 4).map((ord) => (
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
                          <a
                            href={getWhatsAppCustomerLink(ord)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#25D366] text-white rounded-md text-[11px] font-semibold hover:bg-[#20bd5a]"
                          >
                            <MessageCircle className="w-3 h-3 fill-white" />
                            <span>WhatsApp</span>
                          </a>
                        </td>
                      </tr>
                    ))}
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

              {/* Status Filter Tabs */}
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
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              {filteredOrders.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-2xl border border-stone-200 text-stone-500">
                  <ShoppingBag className="w-10 h-10 mx-auto text-stone-400 mb-2" />
                  <p className="font-semibold text-stone-700">No orders found</p>
                  <p className="text-xs text-stone-400">Try adjusting your search or filters.</p>
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

                        <div className="pt-3">
                          <a
                            href={getWhatsAppCustomerLink(order)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center gap-1.5 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold rounded-lg text-xs shadow-xs transition-colors"
                          >
                            <MessageCircle className="w-3.5 h-3.5 fill-white" />
                            <span>WhatsApp Customer</span>
                          </a>
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
                              src={prod.image}
                              alt={prod.name}
                              referrerPolicy="no-referrer"
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

        {/* TAB 4: STORE OWNERS */}
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
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 text-left">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-200">
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Edit Product & Price
              </h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProductEdit} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-700 font-bold mb-1">Product Title:</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, name: e.target.value })
                  }
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Urdu Title:</label>
                <input
                  type="text"
                  value={editingProduct.urduName}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, urduName: e.target.value })
                  }
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg font-serif"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">
                    Base Price (PKR):
                  </label>
                  <input
                    type="number"
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
                    <option value="honey">Pure Honey</option>
                    <option value="achar">Chatpata Achar</option>
                    <option value="murabba">Lazeez Murabbay</option>
                  </select>
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

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-950 hover:bg-emerald-900 text-amber-200 font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
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
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 text-left">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-200">
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Add New Pantry Product
              </h3>
              <button
                onClick={() => setIsNewProductModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
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
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg font-serif"
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

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewProductModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-950 hover:bg-emerald-900 text-amber-200 font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
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
    </div>
  );
};

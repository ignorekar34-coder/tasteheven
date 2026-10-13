export type ProductCategory = 'all' | 'honey' | 'achar' | 'murabba';

export interface ProductWeightOption {
  weight: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  urduName: string;
  category: 'honey' | 'achar' | 'murabba';
  price: number;
  originalPrice?: number;
  weight: string;
  weightOptions: ProductWeightOption[];
  rating: number;
  reviewCount: number;
  shortDesc: string;
  fullDesc: string;
  ingredients: string[];
  benefits: string[];
  image: string;
  badge?: string;
  inStock: boolean;
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  selectedWeight: string;
  selectedPrice: number;
  quantity: number;
}

export interface CustomerReview {
  id: string;
  name: string;
  city: string;
  rating: number;
  date: string;
  productName: string;
  comment: string;
  verified: boolean;
}

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  role: 'Super Admin' | 'Store Manager' | 'Order Dispatcher' | 'Inventory Manager';
  password: string;
  phone?: string;
  avatarColor: string;
  lastLogin?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'dispatched' | 'delivered' | 'cancelled';

export interface OrderRecord {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  city: string;
  address: string;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  notes?: string;
}

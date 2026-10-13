import { AdminUser, OrderRecord } from '../types';
import { PRODUCTS } from './products';

export const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: 'usr-1',
    username: 'admin',
    name: 'Malik Tariq (Owner)',
    role: 'Super Admin',
    password: 'heven123',
    phone: '0324-8314001',
    avatarColor: 'from-amber-600 to-amber-800',
    lastLogin: 'Active now',
  },
  {
    id: 'usr-2',
    username: 'manager',
    name: 'Zeeshan Ahmed',
    role: 'Store Manager',
    password: 'taste2026',
    phone: '0321-4455667',
    avatarColor: 'from-emerald-600 to-emerald-800',
    lastLogin: '2 hours ago',
  },
  {
    id: 'usr-3',
    username: 'dispatcher',
    name: 'Hamza Farooq',
    role: 'Order Dispatcher',
    password: 'dispatch123',
    phone: '0333-8899001',
    avatarColor: 'from-blue-600 to-blue-800',
    lastLogin: 'Today, 11:30 AM',
  },
  {
    id: 'usr-4',
    username: 'inventory',
    name: 'Bilal Khan',
    role: 'Inventory Manager',
    password: 'stockkhalis',
    phone: '0345-5566778',
    avatarColor: 'from-purple-600 to-purple-800',
    lastLogin: 'Yesterday',
  },
];

export const INITIAL_ORDERS: OrderRecord[] = [
  {
    id: 'ord-101',
    orderNumber: 'TH-9842',
    customerName: 'Usman Ghani',
    customerPhone: '0300-4567890',
    city: 'Lahore',
    address: 'House 42, Sector Y, DHA Phase 3, Lahore',
    items: [
      {
        product: PRODUCTS[0], // Sidr honey
        selectedWeight: '500g',
        selectedPrice: 2450,
        quantity: 1,
      },
      {
        product: PRODUCTS[2], // Mango achar
        selectedWeight: '500g',
        selectedPrice: 850,
        quantity: 2,
      },
    ],
    subtotal: 4150,
    shippingFee: 0,
    total: 4150,
    status: 'dispatched',
    createdAt: '2026-10-12 09:15 AM',
    notes: 'Please call before delivering. Cash ready.',
  },
  {
    id: 'ord-102',
    orderNumber: 'TH-9841',
    customerName: 'Dr. Ayesha Siddiqua',
    customerPhone: '0321-9876543',
    city: 'Karachi',
    address: 'Bungalow 18, Block 4, Clifton, Karachi',
    items: [
      {
        product: PRODUCTS[5], // Apple Murabba
        selectedWeight: '500g',
        selectedPrice: 1250,
        quantity: 2,
      },
      {
        product: PRODUCTS[6], // Amla Murabba
        selectedWeight: '500g',
        selectedPrice: 1100,
        quantity: 1,
      },
    ],
    subtotal: 3600,
    shippingFee: 0,
    total: 3600,
    status: 'confirmed',
    createdAt: '2026-10-11 04:30 PM',
    notes: 'Fragile glass packing please.',
  },
  {
    id: 'ord-103',
    orderNumber: 'TH-9840',
    customerName: 'Muhammad Salman',
    customerPhone: '0334-1234567',
    city: 'Islamabad',
    address: 'Street 14, Sector F-8/2, Islamabad',
    items: [
      {
        product: PRODUCTS[0], // Sidr honey
        selectedWeight: '1kg',
        selectedPrice: 4600,
        quantity: 1,
      },
    ],
    subtotal: 4600,
    shippingFee: 0,
    total: 4600,
    status: 'delivered',
    createdAt: '2026-10-10 11:20 AM',
    notes: 'Delivered successfully via TCS.',
  },
  {
    id: 'ord-104',
    orderNumber: 'TH-9839',
    customerName: 'Rana Khurram',
    customerPhone: '0315-7788990',
    city: 'Faisalabad',
    address: 'Kohinoor City, Jaranwala Road, Faisalabad',
    items: [
      {
        product: PRODUCTS[4], // Garlic Achar
        selectedWeight: '500g',
        selectedPrice: 980,
        quantity: 2,
      },
    ],
    subtotal: 1960,
    shippingFee: 250,
    total: 2210,
    status: 'pending',
    createdAt: '2026-10-12 03:40 AM',
    notes: 'New WhatsApp inquiry received.',
  },
];

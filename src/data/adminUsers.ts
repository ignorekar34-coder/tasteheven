import { AdminUser, OrderRecord } from '../types';
import { PRODUCTS } from './products';

export const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: 'usr-1',
    username: 'ahmad',
    name: 'Ahmad Waseem (احمد وسیم)',
    role: 'Owner',
    password: 'heven123',
    phone: '0324-8314001',
    avatarColor: 'from-amber-600 to-amber-800',
    lastLogin: 'Active now',
  },
  {
    id: 'usr-2',
    username: 'farman',
    name: 'Farman Ali (فرمان علی)',
    role: 'Owner',
    password: 'taste2026',
    phone: '0324-8314001',
    avatarColor: 'from-emerald-600 to-emerald-800',
    lastLogin: 'Today',
  },
];

export const INITIAL_ORDERS: OrderRecord[] = [];

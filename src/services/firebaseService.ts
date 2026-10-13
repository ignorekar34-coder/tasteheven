import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { OrderRecord, Product, OrderStatus } from '../types';
import { PRODUCTS } from '../data/products';
import { INITIAL_ORDERS } from '../data/adminUsers';

const ORDERS_COLLECTION = 'orders';
const PRODUCTS_COLLECTION = 'products';

/**
 * Real-time listener for Orders
 */
export function subscribeToOrders(
  onUpdate: (orders: OrderRecord[]) => void,
  onError?: (err: any) => void
) {
  try {
    const q = query(collection(db, ORDERS_COLLECTION));
    return onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          // If Firestore collection is empty, initialize with default initial orders
          seedInitialOrders();
          return;
        }
        const orders: OrderRecord[] = snapshot.docs.map((d) => ({
          ...(d.data() as OrderRecord),
          id: d.id,
        }));
        // Sort newest first
        orders.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
        onUpdate(orders);
      },
      (error) => {
        if (onError) onError(error);
        handleFirestoreError(error, OperationType.GET, ORDERS_COLLECTION);
      }
    );
  } catch (err) {
    console.error('Failed to subscribe to orders:', err);
    return () => {};
  }
}

/**
 * Seed initial sample orders to Firestore once
 */
async function seedInitialOrders() {
  try {
    for (const order of INITIAL_ORDERS) {
      await setDoc(doc(db, ORDERS_COLLECTION, order.id), order);
    }
  } catch (err) {
    console.warn('Seeding initial orders skipped:', err);
  }
}

/**
 * Save new order to Firestore
 */
export async function saveOrderToFirestore(order: OrderRecord): Promise<void> {
  const docRef = doc(db, ORDERS_COLLECTION, order.id);
  try {
    await setDoc(docRef, order);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${ORDERS_COLLECTION}/${order.id}`);
  }
}

/**
 * Update order status in Firestore
 */
export async function updateOrderStatusInFirestore(
  orderId: string,
  status: OrderStatus
): Promise<void> {
  const docRef = doc(db, ORDERS_COLLECTION, orderId);
  try {
    await updateDoc(docRef, { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${ORDERS_COLLECTION}/${orderId}`);
  }
}

/**
 * Real-time listener for Products
 */
export function subscribeToProducts(
  onUpdate: (products: Product[]) => void,
  onError?: (err: any) => void
) {
  try {
    const colRef = collection(db, PRODUCTS_COLLECTION);
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (snapshot.empty) {
          seedInitialProducts();
          return;
        }
        const products: Product[] = snapshot.docs.map((d) => ({
          ...(d.data() as Product),
          id: d.id,
        }));
        onUpdate(products);
      },
      (error) => {
        if (onError) onError(error);
        handleFirestoreError(error, OperationType.GET, PRODUCTS_COLLECTION);
      }
    );
  } catch (err) {
    console.error('Failed to subscribe to products:', err);
    return () => {};
  }
}

/**
 * Seed initial products to Firestore once
 */
async function seedInitialProducts() {
  try {
    for (const product of PRODUCTS) {
      await setDoc(doc(db, PRODUCTS_COLLECTION, product.id), product);
    }
  } catch (err) {
    console.warn('Seeding products skipped:', err);
  }
}

/**
 * Save or update product in Firestore
 */
export async function saveProductToFirestore(product: Product): Promise<void> {
  const docRef = doc(db, PRODUCTS_COLLECTION, product.id);
  try {
    await setDoc(docRef, product);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${PRODUCTS_COLLECTION}/${product.id}`);
  }
}

/**
 * Delete product from Firestore
 */
export async function deleteProductFromFirestore(productId: string): Promise<void> {
  const docRef = doc(db, PRODUCTS_COLLECTION, productId);
  try {
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${PRODUCTS_COLLECTION}/${productId}`);
  }
}

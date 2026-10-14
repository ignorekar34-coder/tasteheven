import {
  collection,
  doc,
  getDoc,
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
          onUpdate([]);
          return;
        }

        // Identify any legacy demo orders (e.g. Dr. Ayesha Siddiqua, Usman Ghani) and purge them from Firestore
        const validOrders: OrderRecord[] = [];
        snapshot.docs.forEach((d) => {
          const data = d.data() as OrderRecord;
          const isDemo =
            d.id.startsWith('ord-10') ||
            (data.customerName && /ayesha|siddiqu|usman|salman|khurram/i.test(data.customerName));

          if (isDemo) {
            // Delete legacy demo order from Firestore in background
            deleteDoc(d.ref).catch(() => {});
          } else {
            validOrders.push({
              ...data,
              id: d.id,
            });
          }
        });

        // Sort newest first
        validOrders.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
        onUpdate(validOrders);
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
 * Delete a specific order from Firestore
 */
export async function deleteOrderFromFirestore(orderId: string): Promise<void> {
  const docRef = doc(db, ORDERS_COLLECTION, orderId);
  try {
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${ORDERS_COLLECTION}/${orderId}`);
  }
}

/**
 * Clear all orders from Firestore (for Store Owners)
 */
export async function clearAllOrdersFromFirestore(): Promise<void> {
  try {
    const snap = await getDocs(collection(db, ORDERS_COLLECTION));
    const deletePromises = snap.docs.map((d) => deleteDoc(d.ref));
    await Promise.all(deletePromises);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, ORDERS_COLLECTION);
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

        // Preserve consistent catalog ordering across devices
        const defaultOrder = PRODUCTS.map((p) => p.id);
        products.sort((a, b) => {
          const indexA = defaultOrder.indexOf(a.id);
          const indexB = defaultOrder.indexOf(b.id);
          if (indexA !== -1 && indexB !== -1) return indexA - indexB;
          if (indexA !== -1) return -1;
          if (indexB !== -1) return 1;
          return a.name.localeCompare(b.name);
        });

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

/**
 * Directly fetch latest products from Firestore (for cross-device instant sync)
 */
export async function fetchProductsFromFirestore(): Promise<Product[]> {
  try {
    const snap = await getDocs(collection(db, PRODUCTS_COLLECTION));
    if (snap.empty) return [];
    return snap.docs.map((d) => ({
      ...(d.data() as Product),
      id: d.id,
    }));
  } catch (err) {
    console.warn('fetchProductsFromFirestore error:', err);
    return [];
  }
}

/**
 * Directly fetch latest banner image from Firestore
 */
export async function fetchBannerFromFirestore(): Promise<string | null> {
  try {
    const snap = await getDoc(doc(db, SETTINGS_COLLECTION, HERO_BANNER_DOC));
    if (snap.exists()) {
      const data = snap.data();
      if (data && typeof data.bannerUrl === 'string' && data.bannerUrl) {
        return data.bannerUrl;
      }
    }
    return null;
  } catch (err) {
    console.warn('fetchBannerFromFirestore error:', err);
    return null;
  }
}

const SETTINGS_COLLECTION = 'settings';
const HERO_BANNER_DOC = 'hero_banner';

/**
 * Real-time listener for Hero Banner Image
 */
export function subscribeToBannerImage(
  onUpdate: (bannerUrl: string) => void,
  onError?: (err: any) => void
) {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, HERO_BANNER_DOC);
    return onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data && typeof data.bannerUrl === 'string' && data.bannerUrl) {
            onUpdate(data.bannerUrl);
          }
        }
      },
      (error) => {
        if (onError) onError(error);
        // Soft failover, don't crash app if settings not seeded
        console.warn('Banner subscription error:', error);
      }
    );
  } catch (err) {
    console.warn('Failed to subscribe to banner image:', err);
    return () => {};
  }
}

/**
 * Save Hero Banner Image to Firestore
 */
export async function saveBannerImageToFirestore(bannerUrl: string): Promise<void> {
  const docRef = doc(db, SETTINGS_COLLECTION, HERO_BANNER_DOC);
  try {
    await setDoc(docRef, {
      bannerUrl,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${SETTINGS_COLLECTION}/${HERO_BANNER_DOC}`);
  }
}


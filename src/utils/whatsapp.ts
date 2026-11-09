import { CartItem, Product } from '../types';
import { WHATSAPP_NUMBER, STORE_NAME } from '../data/products';

export interface OrderCustomerInfo {
  name: string;
  phone: string;
  city: string;
  address: string;
  notes?: string;
}

export function formatPrice(amount: number): string {
  return `Rs ${amount.toLocaleString('en-IN')}`;
}

// Keep formatPKR as an alias so existing references don't break
export const formatPKR = formatPrice;

/**
 * Creates WhatsApp URL for a complete Cart order with customer info
 */
export function generateCartWhatsAppUrl(
  items: CartItem[],
  subtotal: number,
  shippingFee: number,
  customer?: OrderCustomerInfo
): string {
  const grandTotal = subtotal + shippingFee;
  const isFreeDelivery = shippingFee === 0;

  let msg = `✨ *${STORE_NAME} — Artisanal Preserves Order* 🏺\n\n`;
  msg += `Hello! I would like to place an order from Meraki Pantry:\n\n`;
  msg += `*📋 Order Items:*\n`;

  items.forEach((item, index) => {
    const itemTotal = item.selectedPrice * item.quantity;
    msg += `${index + 1}. *${item.product.name}* (${item.selectedWeight})\n`;
    msg += `   Qty: ${item.quantity} × ${formatPrice(item.selectedPrice)} = *${formatPrice(itemTotal)}*\n`;
  });

  msg += `\n*💰 Summary:*`;
  msg += `\n• Subtotal: ${formatPrice(subtotal)}`;
  msg += `\n• Delivery: ${isFreeDelivery ? 'FREE (Pune Local / Special Order)' : formatPrice(shippingFee)}`;
  msg += `\n• *Grand Total: ${formatPrice(grandTotal)}*\n`;

  if (customer && customer.name) {
    msg += `\n*📦 Delivery Address:*`;
    msg += `\n• Name: ${customer.name}`;
    msg += `\n• Phone: ${customer.phone || 'Provided via WhatsApp'}`;
    msg += `\n• City: ${customer.city || 'Pune / India'}`;
    msg += `\n• Address: ${customer.address || 'To be confirmed'}`;
    if (customer.notes) {
      msg += `\n• Note: ${customer.notes}`;
    }
  } else {
    msg += `\nPlease confirm dispatch date and payment details. Thank you!`;
  }

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

/**
 * Creates WhatsApp URL for an instant single-product quick order
 */
export function generateSingleProductWhatsAppUrl(
  product: Product,
  weight: string,
  price: number,
  quantity = 1
): string {
  const total = price * quantity;
  let msg = `✨ *${STORE_NAME} — Quick Order* 🏺\n\n`;
  msg += `Hello! I would like to order:\n\n`;
  msg += `*Product:* ${product.name}\n`;
  msg += `*Size:* ${weight}\n`;
  msg += `*Quantity:* ${quantity}\n`;
  msg += `*Price:* ${formatPrice(price)} (Total: *${formatPrice(total)}*)\n\n`;
  msg += `Please confirm availability and dispatch timeline. Thank you!`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

export function generateArtisanPicklesWhatsAppUrl(jarName?: string): string {
  let msg = `✨ *${STORE_NAME} — Preserves Inquiry* 🏺\n\n`;
  msg += `Hello! I'm interested in Meraki Pantry handcrafted preserves (${jarName || 'Mango Pickle & Apple Murabba'}). Could you share batch availability?`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

export function generateGeneralInquiryWhatsAppUrl(topic = 'General Inquiry'): string {
  const msg = `Hello Meraki Pantry team! I have a question regarding ${topic}. Could you please guide me?`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

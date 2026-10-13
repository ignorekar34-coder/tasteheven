import { CartItem, Product } from '../types';
import { WHATSAPP_NUMBER, STORE_NAME } from '../data/products';

export interface OrderCustomerInfo {
  name: string;
  phone: string;
  city: string;
  address: string;
  notes?: string;
}

export function formatPKR(amount: number): string {
  return `₨ ${amount.toLocaleString('en-PK')}`;
}

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

  let msg = `🌿 *${STORE_NAME} - New Order Request* 🌿\n\n`;
  msg += `Assalam-o-Alaikum! I want to order the following items from ${STORE_NAME}:\n\n`;
  msg += `*📋 Order Items:*\n`;

  items.forEach((item, index) => {
    const itemTotal = item.selectedPrice * item.quantity;
    msg += `${index + 1}. *${item.product.name}* (${item.selectedWeight})\n`;
    msg += `   Qty: ${item.quantity} × ${formatPKR(item.selectedPrice)} = *${formatPKR(itemTotal)}*\n`;
  });

  msg += `\n*💰 Payment Summary:*`;
  msg += `\n• Subtotal: ${formatPKR(subtotal)}`;
  msg += `\n• Delivery Charges: ${isFreeDelivery ? 'FREE (Special Offer 🎉)' : formatPKR(shippingFee)}`;
  msg += `\n• *Grand Total (Cash on Delivery): ${formatPKR(grandTotal)}*\n`;

  if (customer && customer.name) {
    msg += `\n*📦 Delivery Details:*`;
    msg += `\n• Customer Name: ${customer.name}`;
    msg += `\n• Phone: ${customer.phone || 'Provided via WhatsApp'}`;
    msg += `\n• City: ${customer.city || 'Pakistan'}`;
    msg += `\n• Address: ${customer.address || 'To be shared'}`;
    if (customer.notes) {
      msg += `\n• Special Note: ${customer.notes}`;
    }
  } else {
    msg += `\n_Please confirm availability and dispatch date._`;
  }

  msg += `\n\nShukriya! Looking forward to your prompt response.`;

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
  let msg = `🌿 *${STORE_NAME} - Quick Order* 🌿\n\n`;
  msg += `Assalam-o-Alaikum! I want to order this product directly:\n\n`;
  msg += `*Product:* ${product.name} (${product.urduName})\n`;
  msg += `*Selected Size:* ${weight}\n`;
  msg += `*Quantity:* ${quantity}\n`;
  msg += `*Price:* ${formatPKR(price)} each (Total: *${formatPKR(total)}*)\n\n`;
  msg += `Please send me the delivery details and total with Cash on Delivery to my city.\nShukriya!`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

/**
 * General chat with customer care on WhatsApp
 */
export function generateGeneralInquiryWhatsAppUrl(topic = 'General Inquiry'): string {
  const msg = `Assalam-o-Alaikum Taste Heven team! I have a question regarding ${topic}. Could you please guide me?`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

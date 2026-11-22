import type { CartLine, DeliveryDetails } from "@/types";

// Store WhatsApp business number (Malaysia). Update to the real business line.
export const STORE_WHATSAPP = "60123456789";
export const STORE_PHONE_DISPLAY = "+60 12-345 6789";
export const STORE_EMAIL = "hello@kflore.my";
export const STORE_ADDRESS = "12 Jalan Bunga Raya, Bangsar, 59100 Kuala Lumpur";
export const STORE_HOURS = "Tue–Sun, 10am–7pm (closed Mondays)";

function formatMYR(n: number) {
  return `RM${n.toFixed(0)}`;
}

export function buildOrderMessage(lines: CartLine[], delivery: DeliveryDetails, orderId: string) {
  const itemRows = lines
    .map((l) => {
      const noteStr = l.note ? `\n   note: ${l.note}` : "";
      return `• ${l.product.name} (${l.product.size}) x${l.qty} — ${formatMYR(l.product.price * l.qty)}${noteStr}`;
    })
    .join("\n");

  const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.qty, 0);

  const recipientBlock = delivery.recipientDifferent
    ? `Recipient: ${delivery.recipientName || "-"} (${delivery.recipientPhone || "-"})\n`
    : "";

  return (
    `Hi KFLORÉ, I'd like to place an order (Ref ${orderId}).\n\n` +
    `${itemRows}\n\n` +
    `Subtotal: ${formatMYR(subtotal)}\n\n` +
    `Deliver to: ${delivery.address}\n` +
    `Preferred date: ${delivery.date || "-"}, ${delivery.timeSlot || "-"}\n` +
    recipientBlock +
    `Card message: "${delivery.cardMessage || "-"}"\n\n` +
    `Name: ${delivery.fullName}\n` +
    `Phone: ${delivery.phone}`
  );
}

export function buildWhatsAppLink(message: string, number: string = STORE_WHATSAPP) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function generalWhatsAppLink(text: string) {
  return buildWhatsAppLink(text);
}

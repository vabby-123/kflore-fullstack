import type { OrderRecord } from "../types";

function formatMYR(n: number) {
  return `RM${n.toFixed(0)}`;
}

export function buildOrderMessage(order: OrderRecord) {
  const itemRows = order.items
    .map((l) => `• ${l.name} x${l.qty} — ${formatMYR(l.price * l.qty)}${l.note ? `\n   note: ${l.note}` : ""}`)
    .join("\n");

  const recipientBlock = order.recipientDifferent
    ? `Recipient: ${order.recipientName || "-"} (${order.recipientPhone || "-"})\n`
    : "";

  return (
    `New order ${order.id} from ${order.fullName} (${order.phone})\n\n` +
    `${itemRows}\n\n` +
    `Subtotal: ${formatMYR(order.subtotal)}\n\n` +
    `Deliver to: ${order.address}\n` +
    `Date: ${order.date}, ${order.timeSlot}\n` +
    recipientBlock +
    `Card message: "${order.cardMessage || "-"}"`
  );
}

export function buildCustomerWhatsAppLink(order: OrderRecord, storeNumber: string) {
  return `https://wa.me/${storeNumber}?text=${encodeURIComponent(buildOrderMessage(order))}`;
}

/**
 * Optional: push the order straight into the florist's WhatsApp via the
 * official WhatsApp Cloud API, so staff see it without the customer having
 * to tap "send". No-ops silently if the env vars aren't set — the storefront's
 * own wa.me link (built client-side) works fine without this.
 */
export async function notifyStoreViaWhatsApp(order: OrderRecord) {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const to = process.env.WHATSAPP_NOTIFY_TO;
  if (!phoneNumberId || !accessToken || !to) return { sent: false, reason: "not_configured" as const };

  try {
    const resp = await fetch(`https://graph.facebook.com/v20.0/${phoneNumberId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: buildOrderMessage(order) },
      }),
    });
    if (!resp.ok) {
      const body = await resp.text();
      return { sent: false, reason: "api_error" as const, status: resp.status, body };
    }
    return { sent: true as const };
  } catch (err) {
    return { sent: false, reason: "network_error" as const, error: String(err) };
  }
}

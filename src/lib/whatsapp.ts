import { formatMoney } from "./money";

export type CheckoutItem = {
  productName: string;
  productSlug: string;
  variantLabel?: string | null;
  quantity: number;
  unitPriceMinor: number;
};

export type CheckoutDetails = {
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  notes?: string;
};

/**
 * Builds the pre-filled order message and returns a wa.me deep link.
 * The number comes from NEXT_PUBLIC_WHATSAPP_NUMBER (digits only, with country code).
 */
export function buildWhatsAppOrderLink(
  items: CheckoutItem[],
  details: CheckoutDetails,
  orderId?: string
): string {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "233000000000";
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://adzepaessentials.com").replace(/\/$/, "");

  const lines: string[] = [];
  lines.push("*ADZEPA ESSENTIALS*");
  lines.push("_New order request_");
  lines.push("");
  if (orderId) lines.push(`*Order ref:* ${orderId}`);
  lines.push("*ITEMS*");
  for (const item of items) {
    const variant = item.variantLabel ? ` (${item.variantLabel})` : "";
    const lineTotal = formatMoney(item.unitPriceMinor * item.quantity);
    lines.push(`${item.quantity} x *${item.productName}*${variant} — ${lineTotal}`);
    lines.push(`${siteUrl}/product/${item.productSlug}`);
  }
  const total = items.reduce((sum, i) => sum + i.unitPriceMinor * i.quantity, 0);
  lines.push("");
  lines.push(`*TOTAL: ${formatMoney(total)}*`);
  lines.push("");
  lines.push("*DELIVERY DETAILS*");
  lines.push(`*Name:* ${details.customerName}`);
  lines.push(`*Phone:* ${details.customerPhone}`);
  lines.push(`*Address:* ${details.deliveryAddress}`);
  if (details.notes) lines.push(`*Notes:* ${details.notes}`);
  lines.push("");
  lines.push("Please confirm availability and payment options. Thank you!");

  const message = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${number}?text=${message}`;
}

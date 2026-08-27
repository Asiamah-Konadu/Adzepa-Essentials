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
  const configuredNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "");
  if (!configuredNumber || configuredNumber.length < 8 || configuredNumber.length > 15) {
    throw new Error("WhatsApp checkout is not configured. Set NEXT_PUBLIC_WHATSAPP_NUMBER.");
  }

  const siteUrl = (
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL || "https://adzepa-essentials.vercel.app"
  ).replace(/\/$/, "");
  const productUrl = (slug: string) => `${siteUrl}/product/${encodeURIComponent(slug)}`;

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
    lines.push(productUrl(item.productSlug));
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
  return `https://wa.me/${configuredNumber}?text=${message}`;
}

import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import { formatMoney } from "@/lib/money";
import PrintReceiptButton from "@/components/admin/PrintReceiptButton";

export const dynamic = "force-dynamic";

export default async function OrderReceiptPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await getAdminSession())) redirect("/admin/login");
  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
  if (!order) notFound();

  return (
    <div className="receipt-shell mx-auto max-w-3xl">
      <div className="receipt-actions flex justify-between items-center mb-6">
        <Link href="/admin/orders" className="text-xs font-tag uppercase tracking-tag underline">
          ← Back to orders
        </Link>
        <PrintReceiptButton />
      </div>

      <article className="receipt-paper border border-ink/15 bg-paper p-6 sm:p-10">
        <header className="flex flex-wrap justify-between gap-6 border-b border-ink/15 pb-6">
          <div className="flex items-center gap-3">
            <Image src="/images/logo.svg" alt="" width={48} height={48} />
            <div>
              <h1 className="font-display font-black uppercase text-xl">Adzepa Essentials</h1>
              <p className="text-xs text-ink/60">African wax print bombers & fabric</p>
              <p className="text-xs text-ink/60">WhatsApp: {process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "Contact via WhatsApp"}</p>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <p className="font-tag text-[11px] uppercase tracking-tag text-muted">Order receipt</p>
            <p className="font-display font-black text-lg">{order.orderNumber}</p>
            <p className="text-xs text-ink/60">{order.createdAt.toLocaleString()}</p>
          </div>
        </header>

        <section className="grid sm:grid-cols-2 gap-6 py-6 border-b border-ink/15 text-sm">
          <div>
            <h2 className="font-tag text-[11px] uppercase tracking-tag text-muted mb-2">Customer</h2>
            <p className="font-semibold">{order.customerName}</p>
            <p>{order.customerPhone}</p>
            {order.customerEmail && <p>{order.customerEmail}</p>}
          </div>
          <div>
            <h2 className="font-tag text-[11px] uppercase tracking-tag text-muted mb-2">Delivery</h2>
            <p>{order.deliveryAddress}</p>
            {order.notes && <p className="mt-2 italic text-ink/60">Note: {order.notes}</p>}
          </div>
        </section>

        <table className="w-full text-sm">
          <thead className="border-b border-ink/15 text-left">
            <tr>
              <th className="py-3 font-tag text-[11px] uppercase tracking-tag text-muted">Item</th>
              <th className="py-3 text-right font-tag text-[11px] uppercase tracking-tag text-muted">Qty</th>
              <th className="py-3 text-right font-tag text-[11px] uppercase tracking-tag text-muted">Price</th>
              <th className="py-3 text-right font-tag text-[11px] uppercase tracking-tag text-muted">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {order.items.map((item) => (
              <tr key={item.id}>
                <td className="py-3">
                  <p className="font-semibold">{item.productName}</p>
                  {item.variantLabel && <p className="text-xs text-ink/60">{item.variantLabel}</p>}
                </td>
                <td className="py-3 text-right">{item.quantity}</td>
                <td className="py-3 text-right">{formatMoney(item.unitPriceMinor)}</td>
                <td className="py-3 text-right">{formatMoney(item.itemTotalMinor)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="ml-auto max-w-xs border-t border-ink/15 pt-4 mt-4 space-y-2 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>{formatMoney(order.subtotalMinor)}</span></div>
          <div className="flex justify-between"><span>Delivery fee</span><span>{formatMoney(order.deliveryFeeMinor)}</span></div>
          <div className="flex justify-between"><span>Discount</span><span>-{formatMoney(order.discountMinor)}</span></div>
          <div className="flex justify-between border-t border-ink pt-3 font-display font-black text-lg"><span>Grand total</span><span>{formatMoney(order.totalMinor)}</span></div>
        </div>

        <footer className="mt-8 flex flex-wrap justify-between gap-4 border-t border-ink/15 pt-5 text-xs">
          <p className={`font-tag uppercase tracking-tag ${order.paymentStatus === "PAID" ? "text-teal" : "text-signal"}`}>
            {order.paymentStatus === "PAID" ? "PAID" : "PAYMENT PENDING"}
          </p>
          <p className="font-tag uppercase tracking-tag">Order: {order.status}</p>
        </footer>
      </article>
    </div>
  );
}
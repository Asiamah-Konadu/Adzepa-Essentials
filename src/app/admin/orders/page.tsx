import { prisma } from "@/lib/db";
import { formatMoney } from "@/lib/money";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";
import MarkOrderPaidButton from "@/components/admin/MarkOrderPaidButton";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <div>
      <h1 className="font-display font-black uppercase text-2xl mb-6">Orders</h1>

      {orders.length === 0 ? (
        <p className="text-sm text-ink/50">No orders yet. They'll show up here as soon as customers check out.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border border-ink/10 p-4">
              <div className="flex flex-wrap justify-between gap-3 mb-3">
                <div>
                  <p className="font-display font-bold">{order.orderNumber}</p>
                  <p className="font-medium">{order.customerName}</p>
                  <p className="text-sm text-ink/60">{order.customerPhone}</p>
                  {order.customerEmail && <p className="text-sm text-ink/60">{order.customerEmail}</p>}
                  <p className="text-sm text-ink/60">{order.deliveryAddress}</p>
                  {order.notes && <p className="text-sm text-ink/50 italic mt-1">Note: {order.notes}</p>}
                </div>
                <div className="text-right">
                  <p className="font-display font-black text-lg">{formatMoney(order.totalMinor)}</p>
                  <p className={`text-xs font-tag uppercase tracking-tag ${order.paymentStatus === "PAID" ? "text-teal" : "text-signal"}`}>
                    {order.paymentStatus === "PAID" ? "Paid" : "Payment pending"}
                  </p>
                  <p className="text-xs text-ink/40">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <ul className="text-sm text-ink/70 mb-3 space-y-0.5">
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.quantity} x {item.productName}
                    {item.variantLabel ? ` (${item.variantLabel})` : ""} —{" "}
                    {formatMoney(item.itemTotalMinor)}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap items-center gap-3">
                <OrderStatusSelect orderId={order.id} status={order.status} />
                <MarkOrderPaidButton orderId={order.id} paid={order.paymentStatus === "PAID"} />
                <Link
                  href={`/admin/orders/${order.id}/receipt`}
                  className="bg-ink text-paper px-3 py-2 text-xs font-tag uppercase tracking-tag hover:bg-signal"
                >
                  View receipt
                </Link>
              </div>
              <div className="mt-3 border-t border-ink/10 pt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-ink/60">
                <span>Subtotal: {formatMoney(order.subtotalMinor)}</span>
                <span>Delivery: {formatMoney(order.deliveryFeeMinor)}</span>
                <span>Discount: {formatMoney(order.discountMinor)}</span>
                <span className="font-semibold text-ink">Total: {formatMoney(order.totalMinor)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

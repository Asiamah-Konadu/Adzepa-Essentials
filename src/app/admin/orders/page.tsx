import { prisma } from "@/lib/db";
import { formatMoney } from "@/lib/money";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";

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
                  <p className="font-display font-bold">{order.customerName}</p>
                  <p className="text-sm text-ink/60">{order.customerPhone}</p>
                  <p className="text-sm text-ink/60">{order.deliveryAddress}</p>
                  {order.notes && <p className="text-sm text-ink/50 italic mt-1">Note: {order.notes}</p>}
                </div>
                <div className="text-right">
                  <p className="font-display font-black text-lg">{formatMoney(order.totalMinor)}</p>
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
                    {formatMoney(item.unitPriceMinor * item.quantity)}
                  </li>
                ))}
              </ul>

              <OrderStatusSelect orderId={order.id} status={order.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

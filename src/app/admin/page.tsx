import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatMoney } from "@/lib/money";

export default async function AdminDashboard() {
  const [productCount, pendingOrders, allOrders, lowStock] = await Promise.all([
    prisma.product.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { items: true },
    }),
    prisma.productVariant.findMany({
      where: { stock: { lte: 3 } },
      include: { product: true },
      orderBy: { stock: "asc" },
      take: 5,
    }),
  ]);

  const revenueResult = await prisma.order.aggregate({
    _sum: { totalMinor: true },
    where: { status: { not: "CANCELLED" } },
  });

  return (
    <div>
      <h1 className="font-display font-black uppercase text-2xl mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatCard label="Products" value={String(productCount)} />
        <StatCard label="Pending orders" value={String(pendingOrders)} accent={pendingOrders > 0} />
        <StatCard label="Total revenue" value={formatMoney(revenueResult._sum.totalMinor ?? 0)} />
        <StatCard label="Low stock sizes" value={String(lowStock.length)} accent={lowStock.length > 0} />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-bold text-lg">Recent orders</h2>
            <Link href="/admin/orders" className="text-xs font-tag uppercase tracking-tag underline">
              View all
            </Link>
          </div>
          {allOrders.length === 0 ? (
            <p className="text-sm text-ink/50">No orders yet.</p>
          ) : (
            <div className="border border-ink/10 divide-y divide-ink/10">
              {allOrders.map((o) => (
                <div key={o.id} className="p-3 flex justify-between items-center text-sm">
                  <div>
                    <p className="font-medium">{o.customerName}</p>
                    <p className="text-ink/50 text-xs">
                      {o.items.length} item{o.items.length !== 1 ? "s" : ""} · {o.status}
                    </p>
                  </div>
                  <p className="font-semibold">{formatMoney(o.totalMinor)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="font-display font-bold text-lg mb-3">Low stock</h2>
          {lowStock.length === 0 ? (
            <p className="text-sm text-ink/50">Everything is well stocked.</p>
          ) : (
            <div className="border border-ink/10 divide-y divide-ink/10">
              {lowStock.map((v) => (
                <div key={v.id} className="p-3 flex justify-between items-center text-sm">
                  <div>
                    <p className="font-medium">{v.product.name}</p>
                    <p className="text-ink/50 text-xs">Size {v.label}</p>
                  </div>
                  <p className={`font-semibold ${v.stock === 0 ? "text-signal" : ""}`}>
                    {v.stock} left
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="border border-ink/10 p-4">
      <p className="font-tag text-[11px] uppercase tracking-tag text-muted mb-1">{label}</p>
      <p className={`font-display font-black text-2xl ${accent ? "text-signal" : ""}`}>{value}</p>
    </div>
  );
}

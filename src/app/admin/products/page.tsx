import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatMoney } from "@/lib/money";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true, images: true, variants: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-black uppercase text-2xl">Products</h1>
        <Link
          href="/admin/products/new"
          className="bg-ink text-paper font-tag text-xs uppercase tracking-tag px-4 py-2.5 hover:bg-signal transition-colors"
        >
          + New product
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="text-sm text-ink/50">No products yet.</p>
      ) : (
        <div className="border border-ink/10 divide-y divide-ink/10">
          {products.map((p) => {
            const totalStock = p.variants.reduce((sum, v) => sum + v.stock, 0);
            return (
              <div key={p.id} className="p-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-display font-bold truncate">
                    {p.name}{" "}
                    {!p.active && (
                      <span className="text-xs font-tag uppercase tracking-tag text-ink/40 ml-2">
                        (hidden)
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-ink/50">
                    {p.category.name} · {formatMoney(p.priceMinor)} · {totalStock} in stock
                  </p>
                </div>
                <div className="flex gap-3 shrink-0">
                  <Link href={`/admin/products/${p.id}`} className="text-xs underline text-ink/60 hover:text-ink">
                    Edit
                  </Link>
                  <DeleteProductButton productId={p.id} productName={p.name} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

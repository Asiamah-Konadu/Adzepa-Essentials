"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MarkOrderPaidButton({ orderId, paid }: { orderId: string; paid: boolean }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function markPaid() {
    if (paid || !window.confirm("Confirm that this order has been paid?")) return;
    const paymentMethod = window.prompt("Payment method (optional):", "") || undefined;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus: "PAID", paymentMethod }),
      });
      if (!res.ok) throw new Error();
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void markPaid()}
      disabled={paid || saving}
      className="border border-ink px-3 py-2 text-xs font-tag uppercase tracking-tag hover:bg-ink hover:text-paper disabled:cursor-not-allowed disabled:opacity-40"
    >
      {paid ? "Paid" : saving ? "Saving…" : "Mark as paid"}
    </button>
  );
}
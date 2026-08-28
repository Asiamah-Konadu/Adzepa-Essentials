"use client";

export default function PrintReceiptButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="print-trigger bg-ink text-paper px-4 py-2 text-xs font-tag uppercase tracking-tag hover:bg-signal"
    >
      Print receipt
    </button>
  );
}
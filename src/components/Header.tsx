"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";

const NAV_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/shop?category=bombers", label: "Bombers" },
  { href: "/shop?category=fabric", label: "Fabric" },
  { href: "/about", label: "About" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-paper/95 backdrop-blur border-b border-ink/10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="Adzepa Essentials home">
            <Image src="/images/logo.svg" alt="" width={32} height={32} className="h-8 w-8" priority />
            <span className="font-display font-black uppercase leading-none tracking-tight">
              <span className="block text-[15px]">Adzepa</span>
              <span className="block text-[10px] tracking-[0.22em] text-signal mt-1">Essentials</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="font-body text-sm font-medium text-ink/80 hover:text-signal transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/cart"
              className="relative flex items-center gap-2 font-tag text-xs uppercase tracking-tag border border-ink px-3 py-2 hover:bg-ink hover:text-paper transition-colors"
              aria-label={`Cart, ${totalItems} item${totalItems === 1 ? "" : "s"}`}
            >
              Cart
              {totalItems > 0 && (
                <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-signal text-white text-[11px] font-body font-semibold">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              className="md:hidden p-2 -mr-2"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-label="Toggle menu"
            >
              <span className="block w-6 h-0.5 bg-ink mb-1.5" />
              <span className="block w-6 h-0.5 bg-ink mb-1.5" />
              <span className="block w-6 h-0.5 bg-ink" />
            </button>
          </div>
        </div>
      </div>

      {open && (
        <nav className="md:hidden border-t border-ink/10 bg-paper">
          <div className="mx-auto max-w-6xl px-4 py-3 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="py-2.5 font-body text-base font-medium border-b border-ink/5 last:border-0"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="md:w-56 shrink-0 border-b md:border-b-0 md:border-r border-ink/10 bg-paper">
      <div className="p-5">
        <Link href="/" className="font-display font-black uppercase text-sm">
          Adzepa Admin
        </Link>
      </div>
      <nav className="flex md:flex-col overflow-x-auto md:overflow-visible px-3 md:px-2 pb-3 md:pb-0 gap-1">
        {LINKS.map((link) => {
          const active = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`whitespace-nowrap px-3 py-2 text-sm font-medium ${
                active ? "bg-ink text-paper" : "text-ink/70 hover:bg-ink/5"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 md:mt-auto">
        <button
          onClick={handleLogout}
          className="w-full text-left px-3 py-2 text-sm text-ink/60 hover:text-signal"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}

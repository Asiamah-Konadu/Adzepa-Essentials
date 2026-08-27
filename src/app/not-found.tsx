import Link from "next/link";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found | Adzepa Essentials",
  openGraph: {
    title: "Page Not Found | Adzepa Essentials",
    url: "/404",
    type: "website",
    images: [{
      url: "/images/products/bomber-red-block-mannequin.webp",
      alt: "Adzepa Essentials African wax print bomber jacket",
    }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/products/bomber-red-block-mannequin.webp"],
  },
};

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <p className="tag-badge text-signal mb-4">404</p>
      <h1 className="font-display font-black uppercase text-3xl mb-3">Page not found</h1>
      <p className="text-ink/60 mb-6 max-w-sm">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <Link
        href="/shop"
        className="bg-ink text-paper font-tag text-sm uppercase tracking-tag px-6 py-3.5 hover:bg-signal transition-colors"
      >
        Back to shop
      </Link>
    </div>
  );
}

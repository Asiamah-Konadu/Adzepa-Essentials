import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Cart | Adzepa Essentials",
  description: "Review your Adzepa Essentials order before checking out via WhatsApp.",
  openGraph: {
    title: "Your Cart | Adzepa Essentials",
    description: "Review your Adzepa Essentials order before checking out via WhatsApp.",
    url: "/cart",
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

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
import type { Metadata } from "next";
import { Archivo, Work_Sans, Space_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-archivo",
  display: "swap",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-work-sans",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || "https://adzepaessentials.com"),
  title: "Adzepa Essentials — African Wax Print Bombers & Fabric",
  description:
    "Statement bomber jackets and premium wax print fabric, cut from authentic African prints. Order straight to WhatsApp.",
  openGraph: {
    title: "Adzepa Essentials",
    description:
      "Statement bomber jackets and premium wax print fabric, cut from authentic African prints.",
    type: "website",
    images: [{ url: "/images/logo.svg", width: 512, height: 512, alt: "Adzepa Essentials" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/logo.svg"],
  },
  icons: { icon: "/images/logo.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${workSans.variable} ${spaceMono.variable}`}>
      <body className="font-body antialiased">
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}

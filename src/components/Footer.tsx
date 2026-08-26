import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-ink/10 bg-ink text-paper">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2">
          <div className="font-display font-black text-xl uppercase mb-3">
            Adzepa Essentials
          </div>
          <p className="text-sm text-paper/70 max-w-xs">
            Bomber jackets and wax print fabric cut from authentic African
            prints. Every order goes straight to WhatsApp — no accounts, no
            waiting on payment gateways.
          </p>
        </div>

        <div>
          <div className="font-tag text-xs uppercase tracking-tag text-paper/50 mb-4">
            Shop
          </div>
          <ul className="space-y-2 text-sm">
            <li><Link href="/shop?category=bombers" className="hover:text-signal">Bombers</Link></li>
            <li><Link href="/shop?category=fabric" className="hover:text-signal">Fabric</Link></li>
            <li><Link href="/shop" className="hover:text-signal">All products</Link></li>
          </ul>
        </div>

        <div>
          <div className="font-tag text-xs uppercase tracking-tag text-paper/50 mb-4">
            Help
          </div>
          <ul className="space-y-2 text-sm">
            <li><Link href="/faq" className="hover:text-signal">Delivery & sizing FAQ</Link></li>
            <li><Link href="/about" className="hover:text-signal">Our story</Link></li>
            <li>
              <a
                href="https://www.tiktok.com/@adzepa.essentials"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-signal"
              >
                TikTok @adzepa.essentials
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-paper/10 py-5">
        <p className="text-center text-xs text-paper/40 font-tag tracking-tag">
          © {new Date().getFullYear()} ADZEPA ESSENTIALS — ALL RIGHTS RESERVED
        </p>
      </div>
    </footer>
  );
}

export const metadata = { title: "FAQ — Adzepa Essentials" };

const FAQS = [
  {
    q: "How do I place an order?",
    a: "Add items to your cart, fill in your name, WhatsApp number and delivery address on the cart page, then tap \"Order via WhatsApp.\" It opens WhatsApp with your order already typed out — just hit send and we'll confirm availability and payment with you directly.",
  },
  {
    q: "How do I pick a size?",
    a: "Bombers currently run S–XXL in adult sizing. If you're between sizes, message us on WhatsApp before ordering and we'll help you choose based on your usual jacket size.",
  },
  {
    q: "Do you ship outside the country?",
    a: "Delivery is arranged after your order is confirmed on WhatsApp — let us know your location there and we'll confirm timing and cost for your area.",
  },
  {
    q: "How do I pay?",
    a: "Payment is arranged directly over WhatsApp once your order is confirmed — we'll share the available payment options at that point.",
  },
  {
    q: "What is the fabric made from?",
    a: "Our bombers use 100% cotton wax print with a poly-blend lining for structure. Fabric-only pieces are 100% cotton, sold by the 6-yard piece.",
  },
  {
    q: "Can I return or exchange an item?",
    a: "Since pieces are made in small batches, reach out on WhatsApp within 48 hours of delivery if there's a sizing or quality issue and we'll sort it out with you.",
  },
];

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-14">
      <h1 className="font-display font-black uppercase text-3xl mb-8">
        Delivery & Sizing FAQ
      </h1>
      <div className="divide-y divide-ink/10">
        {FAQS.map((item) => (
          <details key={item.q} className="group py-5">
            <summary className="flex justify-between items-center cursor-pointer list-none font-display font-bold text-base">
              {item.q}
              <span className="ml-4 shrink-0 text-ink/40 group-open:rotate-45 transition-transform">+</span>
            </summary>
            <p className="mt-3 text-ink/70 leading-relaxed">{item.a}</p>
          </details>
        ))}
      </div>
      <p className="mt-10 text-sm text-ink/50 italic">
        Placeholder answers — update with your real policies before launch.
      </p>
    </div>
  );
}

import Image from "next/image";

export const metadata = { title: "About — Adzepa Essentials" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-14">
      <span className="tag-badge text-teal mb-5">Our Story</span>
      <h1 className="font-display font-black uppercase text-3xl sm:text-4xl mb-6">
        Wax print, made wearable every day.
      </h1>
      <div className="relative aspect-video mb-8 bg-sand/40 overflow-hidden">
        <Image
          src="/images/products/bomber-navy-pattern-lifestyle.webp"
          alt="Adzepa Essentials bomber jacket worn outdoors"
          fill
          sizes="(min-width: 768px) 768px, 100vw"
          className="object-cover"
        />
      </div>
      <div className="prose prose-neutral max-w-none text-ink/80 leading-relaxed space-y-4">
        <p>
          Adzepa Essentials started with a simple idea: authentic African wax
          print deserves to be worn every day, not just for special occasions.
          We cut our bombers from genuine cotton wax print — the same
          material used for formal wear — and build it into a jacket you can
          reach for on a Tuesday.
        </p>
        <p>
          Every piece is made in small batches, which is why colourways sell
          out and don't always come back. If you see one you like, it's worth
          moving on it.
        </p>
        <p>
          We keep checkout simple too. No accounts, no card forms — you order
          straight through WhatsApp, talk to a real person, and we take it
          from there.
        </p>
      </div>
      <p className="mt-10 text-sm text-ink/50 italic">
        Replace this page with your real brand story before launch — this is
        placeholder copy written from your product photography.
      </p>
    </div>
  );
}

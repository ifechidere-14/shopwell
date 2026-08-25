import Link from "next/link";
import NewsletterSignup from "@/components/NewsletterSignup";

export default function Footer() {
  return (
    <footer className="mt-auto bg-[#1d1c1a] text-[#f4f1eb]">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <p className="text-xl font-bold">Lord<span className="text-[#c39a6b]">Temps</span></p>
          <p className="mt-3 text-sm text-neutral-400">
            Premium skin care and quality provisions delivered to your door.
          </p>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.15em] text-[#c39a6b]">The private list</p>
          <NewsletterSignup />
        </div>
        <div className="space-y-2 text-sm">
          <h4 className="font-semibold uppercase tracking-[0.15em] text-[#c39a6b]">Customer Service</h4>
          {["Help Center", "Contact Us", "How to Order", "Shipping & Returns"].map((t) => (
            <Link key={t} href="/help" className="block text-neutral-400 hover:text-green-400">{t}</Link>
          ))}
        </div>
        <div className="space-y-2 text-sm">
          <h4 className="font-semibold uppercase tracking-[0.15em] text-[#c39a6b]">Shop</h4>
          <Link href="/shop?category=skin-care" className="block text-neutral-400 hover:text-green-400">Skin Care</Link>
          <Link href="/shop?category=provisions" className="block text-neutral-400 hover:text-green-400">Provisions</Link>
        </div>
        <div className="space-y-2 text-sm">
          <h4 className="font-semibold uppercase tracking-[0.15em] text-[#c39a6b]">Follow Us</h4>
          <p className="flex gap-4 text-sm font-semibold uppercase tracking-[0.14em] text-neutral-300">
            <span title="Facebook">Facebook</span><span title="Instagram">Instagram</span>
          </p>
          <Link href="/login" className="block pt-2 text-neutral-400 hover:text-green-400">Login / Register</Link>
          <Link href="/track-order" className="block text-neutral-400 hover:text-[#f29a70]">Track an order</Link>
        </div>
      </div>
      <div className="border-t border-neutral-700 py-4 text-center text-xs text-neutral-500">
        © 2026 LordTempsMart. All rights reserved.
      </div>
    </footer>
  );
}
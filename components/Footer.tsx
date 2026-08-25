import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto bg-black text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <p className="text-lg font-bold">🛍️ Lord<span className="text-green-400">Temps</span>Mart</p>
          <p className="mt-3 text-sm text-neutral-400">
            Premium skin care and quality provisions delivered to your door.
          </p>
        </div>
        <div className="space-y-2 text-sm">
          <h4 className="font-semibold">Customer Service</h4>
          {["Help Center", "Contact Us", "How to Order", "Shipping & Returns"].map((t) => (
            <Link key={t} href="/help" className="block text-neutral-400 hover:text-green-400">{t}</Link>
          ))}
        </div>
        <div className="space-y-2 text-sm">
          <h4 className="font-semibold">Shop</h4>
          <Link href="/shop?category=skin-care" className="block text-neutral-400 hover:text-green-400">Skin Care</Link>
          <Link href="/shop?category=provisions" className="block text-neutral-400 hover:text-green-400">Provisions</Link>
        </div>
        <div className="space-y-2 text-sm">
          <h4 className="font-semibold">Follow Us</h4>
          <p className="flex gap-4 text-xl">
            <span title="Facebook">📘</span><span title="Instagram">📸</span>
            <span title="Twitter">🐦</span><span title="WhatsApp">💬</span>
          </p>
          <Link href="/login" className="block pt-2 text-neutral-400 hover:text-green-400">Login / Register</Link>
        </div>
      </div>
      <div className="border-t border-neutral-800 py-4 text-center text-xs text-neutral-500">
        © 2026 LordTempsMart. All rights reserved.
      </div>
    </footer>
  );
}
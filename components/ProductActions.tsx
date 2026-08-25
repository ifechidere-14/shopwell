"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Product } from "@/lib/db";
import { useCart } from "@/lib/cart-context";

export default function ProductActions({ product }: { product: Product }) {
  const { add } = useCart();
  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem("lordtempsmart-recent");
    const ids: string[] = raw ? JSON.parse(raw) : [];
    localStorage.setItem("lordtempsmart-recent", JSON.stringify([product.id, ...ids.filter((id) => id !== product.id)].slice(0, 8)));
  }, [product.id]);

  async function toggleWishlist() {
    const res = await fetch("/api/wishlist", { method: saved ? "DELETE" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId: product.id }) });
    if (res.ok) setSaved(!saved);
    else setMessage("Log in to save products to your wishlist.");
  }

  return (
    <div className="mt-6 space-y-3">
      <div className="flex gap-3">
        <button disabled={product.stock === 0} onClick={() => add({ id: product.id, name: product.name, price: Number(product.price), image: product.image })}
          className="flex-1 rounded-lg bg-brand py-3 font-semibold text-white hover:bg-brand-dark disabled:bg-neutral-400">Add to cart</button>
        <button onClick={toggleWishlist} aria-label="Save to wishlist" className="rounded-lg border border-black px-4 text-xl hover:bg-black hover:text-white">♡</button>
      </div>
      {message && <p className="text-sm text-amber-700">{message} <Link href="/login" className="font-semibold underline">Login</Link></p>}
      <p className="text-sm text-neutral-500">Secure checkout available. Contact us on WhatsApp for help.</p>
    </div>
  );
}

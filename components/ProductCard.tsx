"use client";

import { useState } from "react";
import type { Product } from "@/lib/db";
import { useCart, formatNaira } from "@/lib/cart-context";

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const [open, setOpen] = useState(false);
  const [added, setAdded] = useState(false);

  const addToCart = () => {
    add({ id: product.id, name: product.name, price: Number(product.price), image: product.image });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <>
      <div className="group flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white transition hover:shadow-lg">
        <button onClick={() => setOpen(true)} className="flex h-44 items-center justify-center bg-brand-light text-6xl">
          {product.image || "🛒"}
        </button>
        <div className="flex flex-1 flex-col gap-1 p-4">
          <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">{product.category_name}</span>
          <h3 className="font-semibold text-black">{product.name}</h3>
          <p className="text-sm text-yellow-600">★ {Number(product.rating).toFixed(1)}</p>
          <p className="mt-auto text-lg font-bold text-brand-dark">{formatNaira(product.price)}</p>
          <div className="mt-2 flex gap-2">
            <button
              onClick={addToCart}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold text-white transition ${
                added ? "bg-black" : "bg-brand hover:bg-brand-dark"
              }`}
            >
              {added ? "✓ Added" : "Add to Cart"}
            </button>
            <button
              onClick={() => setOpen(true)}
              className="rounded-lg border border-black px-3 py-2 text-sm font-semibold hover:bg-black hover:text-white"
            >
              Details
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setOpen(false)}>
          <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <h2 className="text-xl font-bold">🛍️ {product.name}</h2>
              <button onClick={() => setOpen(false)} className="text-2xl leading-none">&times;</button>
            </div>
            <div className="my-4 flex h-48 items-center justify-center rounded-xl bg-brand-light text-7xl">
              {product.image || "🛒"}
            </div>
            <p className="text-sm text-yellow-600">★ {Number(product.rating).toFixed(1)}</p>
            <p className="mt-2 text-neutral-700">{product.description}</p>
            <p className="mt-3 text-2xl font-bold text-brand-dark">{formatNaira(product.price)}</p>
            <p className="text-xs text-neutral-500">{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</p>
            <button
              onClick={addToCart}
              disabled={product.stock === 0}
              className="mt-4 w-full rounded-lg bg-brand py-3 font-semibold text-white hover:bg-brand-dark disabled:bg-neutral-400"
            >
              Add to Cart
            </button>
          </div>
        </div>
      )}
    </>
  );
}
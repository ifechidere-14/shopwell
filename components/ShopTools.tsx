"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/db";
import { formatNaira } from "@/lib/cart-context";

export default function ShopTools({ products }: { products: Product[] }) {
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [skinType, setSkinType] = useState("dry");
  const skinProducts = products.filter((product) => product.category_slug === "skin-care");
  const routineProducts = skinProducts.filter((product) => {
    const text = `${product.name} ${product.description}`.toLowerCase();
    return skinType === "dry" ? /moistur|hydrat|oil|cream/.test(text) : skinType === "oily" ? /cleanser|gel|serum|balanc/.test(text) : /gentle|calm|sensitive|sooth/.test(text);
  });

  function toggleCompare(id: string) {
    setCompareIds((current) => current.includes(id) ? current.filter((item) => item !== id) : current.length < 3 ? [...current, id] : current);
  }

  return <section className="mb-10 space-y-6 border-y border-[var(--line)] py-8">
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Personal edit</p>
        <h2 className="mt-2 text-2xl font-bold">Build your routine</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">Choose your skin profile and we will curate a starting edit from the collection.</p>
        <div className="mt-4 flex flex-wrap gap-2">{["dry", "oily", "sensitive"].map((type) => <button key={type} onClick={() => setSkinType(type)} className={`border px-3 py-2 text-sm font-semibold capitalize ${skinType === type ? "border-brand bg-brand text-white" : "border-[var(--line)] hover:border-brand"}`}>{type}</button>)}</div>
        <div className="mt-4 space-y-2">{routineProducts.slice(0, 3).map((product) => <Link key={product.id} href={`/shop/${product.id}`} className="flex items-center justify-between border-b border-[var(--line)] py-2 text-sm hover:text-brand"><span>{product.name}</span><span className="text-[var(--muted)]">{formatNaira(product.price)} ↗</span></Link>)}{routineProducts.length === 0 && <p className="text-sm text-[var(--muted)]">No matching products found yet.</p>}</div>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Make a decision</p>
        <h2 className="mt-2 text-2xl font-bold">Compare products</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">Select up to three products to compare price, rating, and availability.</p>
        <div className="mt-4 grid grid-cols-2 gap-2">{products.slice(0, 8).map((product) => <button key={product.id} onClick={() => toggleCompare(product.id)} className={`border p-3 text-left text-sm ${compareIds.includes(product.id) ? "border-brand bg-brand-light" : "border-[var(--line)]"}`}><span className="block truncate font-semibold">{product.name}</span><span className="text-xs text-[var(--muted)]">{compareIds.includes(product.id) ? "Selected" : "Add to compare"}</span></button>)}</div>
      </div>
    </div>
    {compareIds.length > 0 && <div className="overflow-x-auto"><table className="w-full min-w-[560px] text-sm"><thead><tr className="border-b border-[var(--line)] text-left"><th className="py-2">Comparison</th>{compareIds.map((id) => <th key={id} className="py-2">{products.find((product) => product.id === id)?.name}</th>)}</tr></thead><tbody><tr className="border-b border-[var(--line)]"><td className="py-2 text-[var(--muted)]">Price</td>{compareIds.map((id) => <td key={id}>{formatNaira(products.find((product) => product.id === id)?.price ?? 0)}</td>)}</tr><tr className="border-b border-[var(--line)]"><td className="py-2 text-[var(--muted)]">Rating</td>{compareIds.map((id) => <td key={id}>★ {Number(products.find((product) => product.id === id)?.rating ?? 0).toFixed(1)}</td>)}</tr><tr><td className="py-2 text-[var(--muted)]">Availability</td>{compareIds.map((id) => <td key={id}>{products.find((product) => product.id === id)?.stock ? "In stock" : "Unavailable"}</td>)}</tr></tbody></table></div>}
  </section>;
}

"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/lib/db";

export default function AdminInventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [message, setMessage] = useState("");
  useEffect(() => { fetch("/api/products").then((response) => response.json()).then((data) => setProducts(data.products ?? [])); }, []);
  async function update(product: Product, field: "price" | "stock", value: string) {
    const response = await fetch("/api/admin/products", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: product.id, [field]: Number(value) }) });
    setMessage(response.ok ? `${product.name} updated.` : "Update failed.");
  }
  async function remove(product: Product) {
    if (!window.confirm(`Delete ${product.name}?`)) return;
    const response = await fetch(`/api/admin/products?id=${product.id}`, { method: "DELETE" });
    if (response.ok) setProducts((current) => current.filter((item) => item.id !== product.id));
    setMessage(response.ok ? "Product deleted." : "Delete failed.");
  }
  return <section className="mt-8 rounded-2xl border border-neutral-200 p-6"><h2 className="font-bold">Inventory and catalog</h2><div className="mt-4 space-y-3">{products.map((product) => <div key={product.id} className="grid gap-3 border-b border-neutral-100 py-3 sm:grid-cols-[1fr_130px_130px_auto] sm:items-center"><div><p className="font-semibold">{product.name}</p><p className="text-xs text-neutral-500">{product.category_name}</p></div><label className="text-xs text-neutral-500">Price<input type="number" min="0" step="0.01" defaultValue={product.price} onBlur={(event) => void update(product, "price", event.target.value)} className="mt-1 w-full rounded-lg border border-neutral-300 px-2 py-1 text-sm text-black" /></label><label className="text-xs text-neutral-500">Stock<input type="number" min="0" defaultValue={product.stock} onBlur={(event) => void update(product, "stock", event.target.value)} className="mt-1 w-full rounded-lg border border-neutral-300 px-2 py-1 text-sm text-black" /></label><button onClick={() => void remove(product)} className="text-left text-sm font-semibold text-red-700 hover:underline">Delete</button></div>)}</div>{message && <p className="mt-3 text-sm text-brand-dark">{message}</p>}</section>;
}

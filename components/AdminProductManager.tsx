"use client";

import { useEffect, useState } from "react";
import ImageUpload from "@/components/ImageUpload";

export default function AdminProductManager() {
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [message, setMessage] = useState("");
  const [image, setImage] = useState("");
  useEffect(() => { fetch("/api/admin/categories").then((res) => res.json()).then((data) => setCategories(data.categories ?? [])); }, []);
  async function createProduct(form: HTMLFormElement) {
    const data = Object.fromEntries(new FormData(form));
    const res = await fetch("/api/admin/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...data, categoryId: Number(data.categoryId), price: Number(data.price), stock: Number(data.stock) }) });
    setMessage(res.ok ? "Product created." : "Could not create product.");
    if (res.ok) form.reset();
  }
  return <section className="mt-8 rounded-2xl border border-neutral-200 p-6"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-bold">Product management</h2><a href="/api/admin/export" className="rounded-lg border border-black px-3 py-2 text-sm font-semibold hover:bg-black hover:text-white">Export orders CSV</a></div><form onSubmit={(e) => { e.preventDefault(); void createProduct(e.currentTarget); }} className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><input name="name" required placeholder="Product name" className="rounded-lg border border-neutral-300 px-3 py-2" /><input name="price" required type="number" min="0" step="0.01" placeholder="Price" className="rounded-lg border border-neutral-300 px-3 py-2" /><input name="stock" required type="number" min="0" placeholder="Stock" className="rounded-lg border border-neutral-300 px-3 py-2" /><select name="categoryId" required className="rounded-lg border border-neutral-300 px-3 py-2"><option value="">Category</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select><textarea name="description" required placeholder="Description" className="rounded-lg border border-neutral-300 px-3 py-2 sm:col-span-2" /><input type="hidden" name="image" value={image} /><ImageUpload onUploaded={setImage} /><button className="rounded-lg bg-brand px-4 py-2 font-semibold text-white hover:bg-brand-dark">Add product</button></form>{message && <p className="mt-3 text-sm text-brand-dark">{message}</p>}</section>;
}

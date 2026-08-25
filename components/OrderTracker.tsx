"use client";

import { useState } from "react";

export default function OrderTracker() {
  const [order, setOrder] = useState<{ id: string; status: string; tracking_number?: string | null; total: string } | null>(null);
  const [error, setError] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); setError(""); const data = Object.fromEntries(new FormData(event.currentTarget)); const response = await fetch(`/api/orders/track?orderId=${encodeURIComponent(String(data.orderId))}&email=${encodeURIComponent(String(data.email))}`); const result = await response.json(); if (!response.ok) { setOrder(null); setError(result.error ?? "Order not found"); return; } setOrder(result.order); }
  return <div className="mx-auto max-w-lg"><form onSubmit={submit} className="space-y-3"><input name="orderId" required placeholder="Order reference" className="w-full border border-[var(--line)] bg-transparent px-3 py-3" /><input name="email" type="email" required placeholder="Email used at checkout" className="w-full border border-[var(--line)] bg-transparent px-3 py-3" /><button className="w-full bg-brand py-3 font-semibold text-white">Track order</button></form>{error && <p className="mt-3 text-sm text-red-700">{error}</p>}{order && <div className="mt-6 border border-[var(--line)] bg-brand-light p-5"><p className="text-sm text-[var(--muted)]">Order #{order.id.slice(0, 8)}</p><p className="mt-2 text-xl font-bold capitalize">{order.status}</p><p className="mt-2 text-sm">Total: ₦{Number(order.total).toLocaleString("en-NG")}</p>{order.tracking_number && <p className="mt-2 text-sm">Tracking: {order.tracking_number}</p>}</div>}</div>;
}

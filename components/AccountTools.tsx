"use client";

import { useState } from "react";

export default function AccountTools() {
  const [message, setMessage] = useState("");
  const [points, setPoints] = useState<number | null>(null);
  async function loadPoints() { const response = await fetch("/api/loyalty"); const data = await response.json(); setPoints(data.points ?? 0); }
  async function addAddress(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); const form = event.currentTarget; const data = Object.fromEntries(new FormData(form)); const response = await fetch("/api/account/addresses", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }); setMessage(response.ok ? "Address saved." : "Could not save address."); if (response.ok) form.reset(); }
  return <section className="mt-10 grid gap-6 border-t border-[var(--line)] pt-8 md:grid-cols-2"><div><h2 className="text-xl font-bold">Delivery addresses</h2><form onSubmit={addAddress} className="mt-4 space-y-2"><input name="label" required placeholder="Label e.g. Home" className="w-full border border-[var(--line)] bg-transparent px-3 py-2" /><textarea name="address" required placeholder="Full address" rows={2} className="w-full border border-[var(--line)] bg-transparent px-3 py-2" /><div className="grid grid-cols-2 gap-2"><input name="city" placeholder="City" className="border border-[var(--line)] bg-transparent px-3 py-2" /><input name="state" placeholder="State" className="border border-[var(--line)] bg-transparent px-3 py-2" /></div><button className="bg-brand px-4 py-2 font-semibold text-white">Save address</button></form>{message && <p className="mt-2 text-sm text-brand-dark">{message}</p>}</div><div><h2 className="text-xl font-bold">Loyalty rewards</h2><p className="mt-2 text-sm text-[var(--muted)]">Earn points on every completed order.</p><button onClick={() => void loadPoints()} className="mt-4 border border-[var(--ink)] px-4 py-2 text-sm font-semibold">View points</button>{points !== null && <p className="mt-4 text-3xl font-bold text-brand">{points} points</p>}</div></section>;
}

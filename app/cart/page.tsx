"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart, formatNaira } from "@/lib/cart-context";

export default function CartPage() {
  const { lines, total, setQuantity, remove, clear } = useCart();
  const [placing, setPlacing] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [deliveryState, setDeliveryState] = useState("");

  async function checkout(formData: FormData) {
    setPlacing(true);
    setError(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: formData.get("customerName"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          address: formData.get("address"),
          promoCode: formData.get("promoCode"),
          paymentMethod: formData.get("paymentMethod"),
          deliveryState: formData.get("deliveryState"),
          lines: lines.map((l) => ({ id: l.id, quantity: l.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Checkout failed");
      const paymentMethod = String(formData.get("paymentMethod") ?? "cash");
      if (paymentMethod === "paystack") {
        const payment = await fetch("/api/payments/initialize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.get("email"),
            amount: data.total,
            reference: data.orderId,
          }),
        });
        const paymentData = await payment.json();
        if (!payment.ok || !paymentData.data?.authorization_url)
          throw new Error(paymentData.error ?? "Online payment could not be started");
        window.location.assign(paymentData.data.authorization_url);
        return;
      }
      if (paymentMethod === "flutterwave") {
        const payment = await fetch("/api/payments/flutterwave/initialize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.get("email"), name: formData.get("customerName"), phone: formData.get("phone"), amount: data.total, reference: data.orderId }),
        });
        const paymentData = await payment.json();
        if (!payment.ok || !paymentData.data?.link)
          throw new Error(paymentData.message ?? "Flutterwave payment could not be started");
        window.location.assign(paymentData.data.link);
        return;
      }
      setOrderId(data.orderId as string);
      clear();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed");
    } finally {
      setPlacing(false);
    }
  }

  if (orderId) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <span className="text-6xl">✅</span>
        <h1 className="mt-4 text-2xl font-bold">Order placed!</h1>
        <p className="mt-2 text-neutral-500">Order reference: <code className="rounded bg-neutral-100 px-1">{orderId}</code></p>
        <Link href="/shop" className="mt-6 inline-block rounded-full bg-brand px-8 py-3 font-semibold text-white hover:bg-brand-dark">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold">🛒 Your Cart</h1>
      {lines.length === 0 ? (
        <div className="mt-8 rounded-xl border border-neutral-200 p-10 text-center">
          <p className="text-neutral-500">Your cart is empty.</p>
          <Link href="/shop" className="mt-4 inline-block rounded-full bg-brand px-6 py-2 font-semibold text-white hover:bg-brand-dark">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {lines.map((l) => (
              <div key={l.id} className="flex items-center gap-4 rounded-xl border border-neutral-200 p-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-brand-light text-3xl">
                  {l.image || "🛒"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{l.name}</p>
                  <p className="text-sm text-brand-dark">{formatNaira(l.price)}</p>
                </div>
                <input
                  type="number"
                  min={1}
                  value={l.quantity}
                  onChange={(e) => setQuantity(l.id, Number(e.target.value))}
                  className="w-16 rounded-lg border border-neutral-300 px-2 py-1"
                />
                <button onClick={() => remove(l.id)} className="text-red-600 hover:text-red-800" aria-label={`Remove ${l.name}`}>
                  ✕
                </button>
              </div>
            ))}
            <button onClick={clear} className="text-sm text-neutral-500 hover:underline">Clear cart</button>
          </div>

          <form action={checkout} className="h-fit space-y-3 rounded-xl border border-neutral-200 p-6">
            <h2 className="text-lg font-bold">Checkout</h2>
            <p className="text-xl font-bold text-brand-dark">Total: {formatNaira(total)}</p>
            {total >= 50000 && <p className="text-sm text-green-700">🎉 You qualify for free delivery!</p>}
            <input name="customerName" required placeholder="Full name" className="w-full rounded-lg border border-neutral-300 px-3 py-2" />
            <input name="email" type="email" required placeholder="Email" className="w-full rounded-lg border border-neutral-300 px-3 py-2" />
            <input name="phone" placeholder="Phone (optional)" className="w-full rounded-lg border border-neutral-300 px-3 py-2" />
            <textarea name="address" required placeholder="Delivery address" rows={3} className="w-full rounded-lg border border-neutral-300 px-3 py-2" />
            <div><label className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Delivery state</label><input name="deliveryState" value={deliveryState} onChange={(event) => setDeliveryState(event.target.value)} onBlur={async () => { if (!deliveryState) return; const response = await fetch(`/api/delivery/quote?state=${encodeURIComponent(deliveryState)}`); const quote = await response.json(); setDeliveryFee(Number(quote.fee) || 0); }} placeholder="e.g. Lagos" className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2" />{deliveryState && <p className="mt-1 text-xs text-neutral-500">Estimated delivery: {formatNaira(deliveryFee)}</p>}</div>
            <input name="promoCode" placeholder="Promo code (optional)" className="w-full rounded-lg border border-neutral-300 px-3 py-2" />
            <select name="paymentMethod" defaultValue="cash" className="w-full rounded-lg border border-neutral-300 px-3 py-2" aria-label="Payment method">
              <option value="cash">Cash on delivery</option>
              <option value="paystack">Pay online with Paystack</option>
              <option value="flutterwave">Pay online with Flutterwave</option>
            </select>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              disabled={placing}
              className="w-full rounded-lg bg-brand py-3 font-semibold text-white hover:bg-brand-dark disabled:bg-neutral-400"
            >
              {placing ? "Placing order…" : "Place Order"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
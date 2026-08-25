import OrderTracker from "@/components/OrderTracker";

export const metadata = { title: "Track order — LordTempsMart" };

export default function TrackOrderPage() {
  return <div className="mx-auto max-w-5xl px-4 py-16"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">Order service</p><h1 className="mt-3 text-4xl font-bold">Track your order</h1><p className="mt-3 mb-8 text-[var(--muted)]">Enter the reference and email used at checkout.</p><OrderTracker /></div>;
}

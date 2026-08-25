"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        router.refresh();
      }}
      className="rounded-full border border-white px-4 py-2 text-sm font-semibold hover:bg-white hover:text-black"
    >
      Log out
    </button>
  );
}

export function StatusSelect({ orderId, current }: { orderId: string; current: string }) {
  const router = useRouter();
  const [status, setStatus] = useState(current);
  const [saving, setSaving] = useState(false);

  async function update(next: string) {
    setStatus(next);
    setSaving(true);
    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status: next }),
    });
    setSaving(false);
    router.refresh();
  }

  const colors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-indigo-100 text-indigo-800",
    packed: "bg-purple-100 text-purple-800",
    shipped: "bg-blue-100 text-blue-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <select
      value={status}
      disabled={saving}
      onChange={(e) => update(e.target.value)}
      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${colors[status] ?? "bg-neutral-100"} disabled:opacity-50`}
    >
      {["pending", "confirmed", "packed", "shipped", "delivered", "cancelled"].map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  );
}
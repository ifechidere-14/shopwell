"use client";

import { useState } from "react";

export default function RefundButton({ orderId, total }: { orderId: string; total: string }) {
  const [message, setMessage] = useState("");
  async function refund() {
    if (!window.confirm("Issue a full refund for this order?")) return;
    const response = await fetch("/api/payments/refund", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderId, amount: Number(total) }) });
    const data = await response.json();
    setMessage(response.ok ? "Refund requested." : data.error ?? "Refund unavailable.");
  }
  return <div><button onClick={() => void refund()} className="text-xs font-semibold text-red-700 underline">Refund</button>{message && <p className="text-xs text-neutral-500">{message}</p>}</div>;
}

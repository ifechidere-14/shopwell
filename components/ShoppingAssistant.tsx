"use client";

import { useState } from "react";

export default function ShoppingAssistant() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  async function ask() {
    if (!message.trim()) return;
    setLoading(true);
    const response = await fetch("/api/ai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message }) });
    const data = await response.json();
    setReply(data.reply ?? data.error ?? "The assistant is unavailable.");
    setLoading(false);
  }
  return <section className="mx-auto max-w-6xl px-4 py-12"><div className="rounded-2xl bg-black p-6 text-white sm:p-8"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-400">Personal shopping desk</p><h2 className="mt-2 text-2xl font-bold">Need help choosing?</h2><p className="mt-2 max-w-xl text-sm text-neutral-300">Ask for a routine, gift suggestion, or product match.</p><div className="mt-5 flex flex-col gap-3 sm:flex-row"><input value={message} onChange={(event) => setMessage(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") void ask(); }} placeholder="e.g. Build me a gentle skincare routine" className="min-w-0 flex-1 rounded-lg border border-neutral-600 bg-neutral-900 px-4 py-3 text-white placeholder:text-neutral-500" /><button onClick={() => void ask()} disabled={loading} className="rounded-lg bg-brand px-5 py-3 font-semibold text-white hover:bg-brand-dark disabled:opacity-50">{loading ? "Thinking..." : "Ask assistant"}</button></div>{reply && <p className="mt-4 rounded-lg bg-white/10 p-4 text-sm text-neutral-200">{reply}</p>}</div></section>;
}

"use client";

import { useState } from "react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
    const data = await response.json();
    setMessage(response.ok ? "You are on the list." : data.error ?? "Could not subscribe.");
    if (response.ok) setEmail("");
  }
  return <form onSubmit={submit} className="mt-4 flex max-w-md flex-col gap-2 sm:flex-row"><input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required placeholder="Your email address" className="min-w-0 flex-1 border border-neutral-600 bg-neutral-900 px-3 py-2 text-white" /><button className="bg-[#f29a70] px-4 py-2 font-semibold text-[#172326]">Subscribe</button>{message && <span className="text-xs text-neutral-300 sm:self-center">{message}</span>}</form>;
}

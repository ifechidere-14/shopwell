"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: fd.get("username"), password: fd.get("password") }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setError(data.error ?? "Login failed");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-md px-4 py-20">
      <div className="rounded-2xl border border-neutral-200 p-8">
        <h1 className="text-2xl font-bold">🔐 Admin Login</h1>
        <p className="mt-1 text-sm text-neutral-500">Restricted area — LordTempsMart staff only.</p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <input name="username" required placeholder="Username"
            className="w-full rounded-lg border border-neutral-300 px-3 py-2" />
          <input name="password" type="password" required placeholder="Password"
            className="w-full rounded-lg border border-neutral-300 px-3 py-2" />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button disabled={loading}
            className="w-full rounded-lg bg-black py-3 font-semibold text-white hover:bg-brand-dark disabled:bg-neutral-400">
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
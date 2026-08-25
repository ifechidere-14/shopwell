"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (e.currentTarget.password.value !== e.currentTarget.confirm.value)
      return setError("Passwords do not match");
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: fd.get("fullName"),
        email: fd.get("email"),
        password: fd.get("password"),
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setError(data.error ?? "Registration failed");
    router.push("/");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-2xl border border-neutral-200 p-8">
        <h1 className="text-2xl font-bold">🛍️ Sign Up</h1>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <input name="fullName" required placeholder="Full name"
            className="w-full rounded-lg border border-neutral-300 px-3 py-2" />
          <input name="email" type="email" required placeholder="Email"
            className="w-full rounded-lg border border-neutral-300 px-3 py-2" />
          <input name="password" type="password" required minLength={6} placeholder="Password (min 6 chars)"
            className="w-full rounded-lg border border-neutral-300 px-3 py-2" />
          <input name="confirm" type="password" required placeholder="Confirm password"
            className="w-full rounded-lg border border-neutral-300 px-3 py-2" />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button disabled={loading}
            className="w-full rounded-lg bg-brand py-3 font-semibold text-white hover:bg-brand-dark disabled:bg-neutral-400">
            {loading ? "Creating account…" : "Sign Up"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-neutral-500">
          Already have an account? <Link href="/login" className="font-semibold text-brand-dark hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
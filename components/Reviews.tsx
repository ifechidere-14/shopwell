"use client";

import { useEffect, useState } from "react";

type Review = { id: string; rating: number; body: string; full_name: string; created_at: string };
export default function Reviews({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [message, setMessage] = useState("");
  useEffect(() => { fetch(`/api/reviews?productId=${productId}`).then((res) => res.json()).then((data) => setReviews(data.reviews ?? [])); }, [productId]);
  async function submit(form: HTMLFormElement) {
    const data = Object.fromEntries(new FormData(form));
    const res = await fetch("/api/reviews", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId, rating: Number(data.rating), body: data.body }) });
    setMessage(res.ok ? "Review saved." : "Log in to leave a review.");
    if (res.ok) { form.reset(); const next = await fetch(`/api/reviews?productId=${productId}`); setReviews((await next.json()).reviews ?? []); }
  }
  return <section className="mt-12 border-t border-neutral-200 pt-8"><h2 className="text-xl font-bold">Customer reviews</h2><form onSubmit={(e) => { e.preventDefault(); void submit(e.currentTarget); }} className="mt-4 grid gap-3 sm:grid-cols-[150px_1fr_auto]"><select name="rating" defaultValue="5" className="rounded-lg border border-neutral-300 px-3 py-2"><option value="5">★★★★★</option><option value="4">★★★★</option><option value="3">★★★</option><option value="2">★★</option><option value="1">★</option></select><input name="body" required placeholder="Share your experience" className="rounded-lg border border-neutral-300 px-3 py-2" /><button className="rounded-lg bg-black px-4 py-2 font-semibold text-white">Post</button></form>{message && <p className="mt-2 text-sm text-neutral-600">{message}</p>}<div className="mt-6 space-y-4">{reviews.map((review) => <article key={review.id} className="border-b border-neutral-100 pb-3"><p className="text-yellow-600">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</p><p className="mt-1">{review.body}</p><p className="mt-1 text-xs text-neutral-500">{review.full_name} · {new Date(review.created_at).toLocaleDateString("en-NG")}</p></article>)}</div></section>;
}

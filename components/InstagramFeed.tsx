"use client";

import { useEffect, useState } from "react";

type Post = { id: string; media_url?: string; permalink: string; caption?: string; media_type: string };
export default function InstagramFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  useEffect(() => { fetch("/api/marketing/instagram").then((response) => response.json()).then((data) => setPosts(data.posts ?? [])); }, []);
  if (!posts.length) return null;
  return <section className="mx-auto max-w-6xl px-4 pb-16"><div className="flex items-end justify-between"><div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-dark">From our studio</p><h2 className="mt-2 text-2xl font-bold">Follow the edit</h2></div><a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-sm font-semibold text-brand-dark hover:underline">Instagram ↗</a></div><div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">{posts.slice(0, 8).map((post) => <a key={post.id} href={post.permalink} target="_blank" rel="noreferrer" className="aspect-square overflow-hidden rounded-xl bg-neutral-100">{post.media_url && <img src={post.media_url} alt={post.caption || "LordTempsMart Instagram post"} className="h-full w-full object-cover transition hover:scale-105" />}</a>)}</div></section>;
}

import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getCategories, getProducts } from "@/lib/db";
import ShoppingAssistant from "@/components/ShoppingAssistant";
import InstagramFeed from "@/components/InstagramFeed";

export const dynamic = "force-dynamic";

export default async function Home() {
  let categories: Awaited<ReturnType<typeof getCategories>> = [];
  let featured: Awaited<ReturnType<typeof getProducts>> = [];
  try {
    [categories, featured] = await Promise.all([getCategories(), getProducts()]);
    featured = featured.filter((p) => p.featured).slice(0, 4);
  } catch (err) {
    console.error("DB not reachable yet:", err);
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-black text-white">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center">
          <span className="rounded-full bg-brand px-4 py-1 text-sm font-semibold">Beauty &amp; Essentials</span>
          <h1 className="mx-auto mt-6 max-w-2xl text-4xl font-bold sm:text-5xl">
            Premium skin care and everyday <span className="text-green-400">provisions</span> in one place.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-neutral-300">
            Glow with top skin care brands and stock up on quality provisions — all delivered to your door.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/shop" className="rounded-full bg-brand px-8 py-3 font-semibold hover:bg-green-600">
              Start Shopping
            </Link>
            <Link href="/shop?category=skin-care" className="rounded-full border border-white px-8 py-3 font-semibold hover:bg-white hover:text-black">
              Shop Skin Care
            </Link>
          </div>
        </div>
      </section>

      <ShoppingAssistant />

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-bold">Shop by category</h2>
          <Link href="/shop" className="font-semibold text-brand-dark hover:underline">View all →</Link>
        </div>
        <p className="text-neutral-500">Everything your skin and pantry needs.</p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/shop?category=${c.slug}`}
              className="group flex items-center justify-between rounded-2xl border border-neutral-200 p-8 transition hover:border-brand hover:bg-brand-light"
            >
              <div>
                <span className="text-5xl">{c.icon}</span>
                <h3 className="mt-3 text-xl font-bold group-hover:text-brand-dark">{c.name}</h3>
                <p className="text-sm text-neutral-500">{c.product_count} products</p>
              </div>
              <span className="text-3xl text-neutral-400 group-hover:text-brand">→</span>
            </Link>
          ))}
        </div>
      </section>
      <InstagramFeed />

      {/* Featured picks */}
      <section className="bg-brand-light/60 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold">Featured picks</h2>
          <p className="text-neutral-500">Popular items chosen for the week.</p>
          {featured.length > 0 ? (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <p className="mt-6 rounded-lg bg-white p-6 text-neutral-500">
              Products will appear here once the database is seeded. Run{" "}
              <code className="rounded bg-neutral-100 px-1">schema.sql</code> then{" "}
              <code className="rounded bg-neutral-100 px-1">db/seed.sql</code>.
            </p>
          )}
        </div>
      </section>

      {/* Value prop */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold">💎 Top-quality products</h2>
            <p className="mt-4 text-neutral-600">
              From premium skin care essentials to trusted pantry staples, we bring you authentic,
              quality products at the best prices. Free delivery on orders above ₦50,000.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              ["🧴", "Skin Care"],
              ["🍚", "Provisions"],
              ["🚚", "Fast Delivery"],
            ].map(([icon, label]) => (
              <div key={label} className="rounded-xl border border-neutral-200 p-6">
                <span className="text-4xl">{icon}</span>
                <p className="mt-2 font-semibold">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
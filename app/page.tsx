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
      <section className="relative overflow-hidden bg-[#083f46] text-[#fffaf3]">
        <div className="absolute right-[-8rem] top-[-10rem] h-[30rem] w-[30rem] rounded-full border border-[#f29a70]/40" />
        <div className="absolute bottom-[-14rem] left-[-6rem] h-[30rem] w-[30rem] rounded-full border border-[#7ed4ce]/30" />
        <div className="relative mx-auto grid max-w-6xl items-end gap-12 px-4 py-24 md:grid-cols-[1.15fr_0.85fr] md:py-32">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#f29a70]">The considered edit · Lagos</p>
            <h1 className="mt-6 max-w-3xl text-5xl leading-[0.98] font-bold sm:text-7xl">
              The daily ritual, <em className="font-normal text-[#f29a70]">elevated.</em>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-neutral-300">
            A finely edited collection of skin care and provisions for a home that feels well kept.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/shop" className="bg-[#f29a70] px-8 py-4 font-semibold text-[#172326] hover:bg-[#ffb08b]">
              Explore collection
            </Link>
            <Link href="/shop?category=skin-care" className="border border-neutral-500 px-8 py-4 font-semibold hover:border-white">
              Skin care edit
            </Link>
          </div>
          </div>
          <div className="hidden border-l border-neutral-700 pl-8 md:block">
            <p className="text-sm uppercase tracking-[0.2em] text-[#f29a70]">LordTemps / 01</p>
            <p className="mt-5 font-serif text-4xl leading-tight">Quiet luxury for everyday living.</p>
            <p className="mt-5 max-w-xs text-sm leading-6 text-neutral-400">Authentic products, thoughtfully sourced and delivered across Nigeria.</p>
          </div>
        </div>
      </section>

      <ShoppingAssistant />

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex items-end justify-between">
          <h2 className="text-3xl font-bold">Shop by category</h2>
          <Link href="/shop" className="text-sm font-semibold uppercase tracking-[0.12em] text-brand-dark hover:underline">View collection →</Link>
        </div>
        <p className="text-neutral-500">Everything your skin and pantry needs.</p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/shop?category=${c.slug}`}
              className="group flex items-center justify-between border border-[var(--line)] bg-[#f8f5f0]/70 p-8 transition hover:border-brand hover:shadow-[0_12px_30px_rgba(29,28,26,0.08)]"
            >
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Collection 0{c.id}</span>
                <h3 className="mt-4 text-2xl font-bold group-hover:text-brand-dark">{c.name}</h3>
                <p className="text-sm text-neutral-500">{c.product_count} products</p>
              </div>
              <span className="text-2xl text-neutral-400 group-hover:text-brand">↗</span>
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
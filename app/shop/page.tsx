import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ShopPage({
  searchParams,
}: PageProps<"/shop">) {
  const { category: rawCategory, q, sort } = await searchParams;
  const category = Array.isArray(rawCategory) ? rawCategory[0] : rawCategory;
  const search = Array.isArray(q) ? q[0] : q;
  const selectedSort = Array.isArray(sort) ? sort[0] : sort;
  let products: Awaited<ReturnType<typeof getProducts>> = [];
  try {
    products = await getProducts(category || undefined, {
      search,
      sort: selectedSort === "price-asc" || selectedSort === "price-desc" || selectedSort === "rating" ? selectedSort : "newest",
    });
  } catch (err) {
    console.error(err);
  }

  const tabs = [
    { slug: undefined, label: "All" },
    { slug: "skin-care", label: "🧴 Skin Care" },
    { slug: "provisions", label: "🍚 Provisions" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold">Shop</h1>
      <form className="mt-6 grid gap-3 sm:grid-cols-[1fr_180px_auto]" action="/shop">
        <input name="q" defaultValue={search} placeholder="Search products..." aria-label="Search products"
          className="rounded-lg border border-neutral-300 px-3 py-2" />
        {category && <input type="hidden" name="category" value={category} />}
        <select name="sort" defaultValue={selectedSort ?? "newest"} aria-label="Sort products"
          className="rounded-lg border border-neutral-300 px-3 py-2">
          <option value="newest">Newest first</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="rating">Highest rated</option>
        </select>
        <button className="rounded-lg bg-brand px-5 py-2 font-semibold text-white hover:bg-brand-dark">Search</button>
      </form>
      <div className="mt-4 flex flex-wrap gap-2">
        {tabs.map((t) => {
          const active = t.slug === category || (!t.slug && !category);
          return (
            <Link
              key={t.label}
              href={t.slug ? `/shop?category=${t.slug}` : "/shop"}
              className={`rounded-full px-5 py-2 text-sm font-semibold ${
                active ? "bg-brand text-white" : "border border-black hover:bg-black hover:text-white"
              }`}
            >
              {t.label}
            </Link>
          );
        })}
      </div>
      {products.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      ) : (
        <p className="mt-8 rounded-lg bg-brand-light p-6 text-neutral-700">
          No products found. Seed the database with <code className="font-mono">db/seed.sql</code>.
        </p>
      )}
    </div>
  );
}
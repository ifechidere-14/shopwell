import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function DealsPage() {
  let products: Awaited<ReturnType<typeof getProducts>> = [];
  try {
    products = (await getProducts()).filter((p) => Number(p.rating) >= 4.6);
  } catch (err) {
    console.error(err);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="rounded-2xl bg-black p-10 text-white">
        <h1 className="text-3xl font-bold">🔥 Deals of the Week</h1>
        <p className="mt-2 text-neutral-300">
          Our highest-rated picks — free delivery on orders above ₦50,000.
        </p>
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, formatNaira } from "@/lib/db";
import ProductActions from "@/components/ProductActions";
import Reviews from "@/components/Reviews";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: PageProps<"/shop/[id]">) {
  const product = await getProduct((await params).id);
  if (!product) notFound();
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <Link href="/shop" className="text-sm font-semibold text-brand-dark hover:underline">← Back to shop</Link>
      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <div className="flex min-h-80 items-center justify-center rounded-2xl bg-brand-light text-8xl">{product.image || "🛒"}</div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-neutral-500">{product.category_name}</p>
          <h1 className="mt-2 text-3xl font-bold">{product.name}</h1>
          <p className="mt-3 text-yellow-600">★ {Number(product.rating).toFixed(1)} <span className="text-sm text-neutral-500">({product.review_count ?? 0} reviews)</span></p>
          <p className="mt-5 text-neutral-700">{product.description}</p>
          {product.ingredients && <p className="mt-4 text-sm"><strong>Ingredients:</strong> {product.ingredients}</p>}
          {product.usage_instructions && <p className="mt-2 text-sm"><strong>How to use:</strong> {product.usage_instructions}</p>}
          <p className="mt-6 text-3xl font-bold text-brand-dark">{formatNaira(product.price)}</p>
          <p className={`mt-1 text-sm ${product.stock <= (product.low_stock_threshold ?? 5) ? "text-amber-700" : "text-neutral-500"}`}>
            {product.stock === 0 ? "Out of stock" : product.stock <= (product.low_stock_threshold ?? 5) ? `Only ${product.stock} left` : `${product.stock} in stock`}
          </p>
          <ProductActions product={product} />
        </div>
      </div>
      <Reviews productId={product.id} />
    </div>
  );
}

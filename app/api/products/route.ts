import { getProducts } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const category = new URL(req.url).searchParams.get("category") ?? undefined;
    const products = await getProducts(category || undefined);
    return Response.json({ count: products.length, products });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to load products" }, { status: 500 });
  }
}
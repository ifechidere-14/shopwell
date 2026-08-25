import { pool } from "@/lib/db";

export async function POST(req: Request) {
  const { productId, email } = await req.json();
  if (!productId || !email || !/^\S+@\S+\.\S+$/.test(String(email))) return Response.json({ error: "Product and valid email are required" }, { status: 400 });
  await pool.query("INSERT INTO back_in_stock_requests (product_id, email) VALUES ($1,$2) ON CONFLICT (product_id,email) DO NOTHING", [productId, String(email).toLowerCase().trim()]);
  return Response.json({ ok: true });
}

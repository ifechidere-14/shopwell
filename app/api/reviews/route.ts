import { getSessionUser } from "@/lib/auth";
import { pool } from "@/lib/db";

export async function GET(req: Request) {
  const productId = new URL(req.url).searchParams.get("productId");
  if (!productId) return Response.json({ error: "Product required" }, { status: 400 });
  const { rows } = await pool.query(`SELECT r.id, r.rating, r.body, r.created_at, u.full_name FROM product_reviews r JOIN users u ON u.id = r.user_id WHERE r.product_id = $1 ORDER BY r.created_at DESC`, [productId]);
  return Response.json({ reviews: rows });
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "Login required" }, { status: 401 });
  const { productId, rating, body } = await req.json();
  const score = Number(rating);
  if (!productId || !Number.isInteger(score) || score < 1 || score > 5 || !String(body ?? "").trim())
    return Response.json({ error: "Product, rating, and review are required" }, { status: 400 });
  await pool.query(`INSERT INTO product_reviews (product_id, user_id, rating, body) VALUES ($1, $2, $3, $4) ON CONFLICT (product_id, user_id) DO UPDATE SET rating = EXCLUDED.rating, body = EXCLUDED.body`, [productId, user.id, score, String(body).trim()]);
  await pool.query(`UPDATE products SET rating = (SELECT COALESCE(AVG(rating), 0) FROM product_reviews WHERE product_id = $1) WHERE id = $1`, [productId]);
  return Response.json({ ok: true });
}

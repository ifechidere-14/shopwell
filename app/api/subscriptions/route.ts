import { getSessionUser } from "@/lib/auth";
import { pool } from "@/lib/db";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "Login required" }, { status: 401 });
  const { rows } = await pool.query("SELECT s.*, p.name, p.price, p.image FROM subscriptions s JOIN products p ON p.id = s.product_id WHERE s.user_id = $1 ORDER BY s.active DESC", [user.id]);
  return Response.json({ subscriptions: rows });
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "Login required" }, { status: 401 });
  const { productId, quantity, frequency } = await req.json();
  if (!productId || !["weekly", "monthly", "quarterly"].includes(frequency)) return Response.json({ error: "Product and valid frequency are required" }, { status: 400 });
  const { rows } = await pool.query("INSERT INTO subscriptions (user_id, product_id, quantity, frequency, next_delivery) VALUES ($1,$2,$3,$4,CURRENT_DATE) RETURNING *", [user.id, productId, Math.max(1, Number(quantity) || 1), frequency]);
  return Response.json({ subscription: rows[0] }, { status: 201 });
}

import { getSessionUser } from "@/lib/auth";
import { pool } from "@/lib/db";

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "Login required" }, { status: 401 });
  const { productId } = await req.json();
  await pool.query("INSERT INTO wishlists (user_id, product_id) VALUES ($1, $2) ON CONFLICT DO NOTHING", [user.id, productId]);
  return Response.json({ ok: true });
}

export async function DELETE(req: Request) {
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "Login required" }, { status: 401 });
  const { productId } = await req.json();
  await pool.query("DELETE FROM wishlists WHERE user_id = $1 AND product_id = $2", [user.id, productId]);
  return Response.json({ ok: true });
}

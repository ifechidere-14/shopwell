import { pool } from "@/lib/db";

export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const orderId = params.get("orderId");
  const email = params.get("email");
  if (!orderId || !email) return Response.json({ error: "Order reference and email are required" }, { status: 400 });
  const { rows } = await pool.query("SELECT id, customer_name, total, status, payment_status, tracking_number, created_at FROM orders WHERE id = $1 AND LOWER(email) = LOWER($2)", [orderId, email]);
  if (!rows[0]) return Response.json({ error: "Order not found" }, { status: 404 });
  return Response.json({ order: rows[0] });
}

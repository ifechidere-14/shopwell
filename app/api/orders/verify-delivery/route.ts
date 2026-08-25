import { pool } from "@/lib/db";

export async function POST(req: Request) {
  const { orderId, otp } = await req.json();
  if (!orderId || !otp) return Response.json({ error: "Order and OTP are required" }, { status: 400 });
  const { rows } = await pool.query("UPDATE orders SET status = 'delivered', delivery_otp = NULL WHERE id = $1 AND delivery_otp = $2 RETURNING id, status", [orderId, String(otp)]);
  if (!rows[0]) return Response.json({ error: "Invalid delivery code" }, { status: 400 });
  return Response.json({ ok: true, order: rows[0] });
}
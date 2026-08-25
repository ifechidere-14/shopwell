import { isAdminAuthenticated } from "@/lib/admin-auth";
import { pool } from "@/lib/db";

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { orderId, amount } = await req.json();
  if (!orderId || !amount || Number(amount) <= 0) return Response.json({ error: "Order and positive amount required" }, { status: 400 });
  const { rows } = await pool.query<{ payment_reference: string | null }>("SELECT payment_reference FROM orders WHERE id = $1", [orderId]);
  const reference = rows[0]?.payment_reference;
  if (!reference) return Response.json({ error: "No payment reference exists for this order" }, { status: 400 });
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) return Response.json({ error: "Paystack is not configured" }, { status: 503 });
  const response = await fetch("https://api.paystack.co/refund", { method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" }, body: JSON.stringify({ transaction: reference, amount: Math.round(Number(amount) * 100) }) });
  const data = await response.json();
  if (response.ok) await pool.query("INSERT INTO payment_refunds (order_id, amount, provider, reference, status) VALUES ($1, $2, 'paystack', $3, $4)", [orderId, amount, reference, data.status ? "processed" : "pending"]);
  return Response.json(data, { status: response.status });
}

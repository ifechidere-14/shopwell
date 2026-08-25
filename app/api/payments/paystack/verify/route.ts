import { pool } from "@/lib/db";

export async function POST(req: Request) {
  const { reference, orderId } = await req.json();
  if (!reference || !orderId) return Response.json({ error: "Reference and order are required" }, { status: 400 });
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) return Response.json({ error: "Paystack is not configured" }, { status: 503 });
  const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, { headers: { Authorization: `Bearer ${key}` } });
  const data = await response.json();
  const verified = response.ok && data.data?.status === "success";
  if (verified) await pool.query("UPDATE orders SET payment_status = 'paid', payment_reference = $1 WHERE id = $2", [reference, orderId]);
  return Response.json({ ...data, verified }, { status: response.status });
}
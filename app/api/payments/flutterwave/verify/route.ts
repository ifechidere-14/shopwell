import { pool } from "@/lib/db";

export async function POST(req: Request) {
  const { transactionId, orderId } = await req.json();
  if (!transactionId || !orderId) return Response.json({ error: "Transaction and order are required" }, { status: 400 });
  const key = process.env.FLUTTERWAVE_SECRET_KEY;
  if (!key) return Response.json({ error: "Flutterwave is not configured" }, { status: 503 });
  const response = await fetch(`https://api.flutterwave.com/v3/transactions/${encodeURIComponent(transactionId)}/verify`, { headers: { Authorization: `Bearer ${key}` } });
  const data = await response.json();
  const verified = response.ok && data.data?.status === "successful";
  if (verified) await pool.query("UPDATE orders SET payment_status = 'paid', payment_reference = $1, payment_method = 'flutterwave' WHERE id = $2", [String(transactionId), orderId]);
  return Response.json({ ...data, verified }, { status: response.status });
}

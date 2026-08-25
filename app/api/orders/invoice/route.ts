import { pool, formatNaira } from "@/lib/db";

export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const orderId = params.get("orderId");
  const email = params.get("email");
  if (!orderId || !email) return new Response("Order reference and email are required", { status: 400 });
  const { rows } = await pool.query("SELECT o.id, o.customer_name, o.email, o.address, o.total, o.discount, o.created_at, STRING_AGG(p.name || ' x' || oi.quantity, ', ') AS items FROM orders o LEFT JOIN order_items oi ON oi.order_id = o.id LEFT JOIN products p ON p.id = oi.product_id WHERE o.id = $1 AND LOWER(o.email) = LOWER($2) GROUP BY o.id", [orderId, email]);
  const order = rows[0];
  if (!order) return new Response("Order not found", { status: 404 });
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>Invoice ${order.id}</title><style>body{font-family:Arial,sans-serif;max-width:700px;margin:48px auto;color:#172326}header{display:flex;justify-content:space-between;border-bottom:2px solid #087f8c;padding-bottom:20px}h1{font-size:28px}p{line-height:1.6}.total{font-size:22px;font-weight:bold;color:#07545c}</style></head><body><header><div><h1>LordTemps</h1><p>Order invoice</p></div><div><p><strong>Reference</strong><br>${order.id}</p><p>${new Date(order.created_at).toLocaleDateString("en-NG")}</p></div></header><p><strong>Customer</strong><br>${order.customer_name}<br>${order.email}<br>${order.address}</p><p><strong>Items</strong><br>${order.items ?? "No items"}</p><p>Discount: ${formatNaira(order.discount ?? 0)}</p><p class="total">Total: ${formatNaira(order.total)}</p></body></html>`;
  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8", "Content-Disposition": `attachment; filename=invoice-${order.id.slice(0, 8)}.html` } });
}

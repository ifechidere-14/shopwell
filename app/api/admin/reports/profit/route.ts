import { isAdminAuthenticated } from "@/lib/admin-auth";
import { pool } from "@/lib/db";

export async function GET() {
  if (!(await isAdminAuthenticated())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { rows } = await pool.query("SELECT COALESCE(SUM(oi.quantity * oi.unit_price),0) AS revenue, COALESCE(SUM(oi.quantity * p.cost_price),0) AS cost, COALESCE(SUM(oi.quantity * (oi.unit_price - p.cost_price)),0) AS gross_profit FROM order_items oi JOIN orders o ON o.id = oi.order_id JOIN products p ON p.id = oi.product_id WHERE o.status <> 'cancelled'");
  return Response.json({ report: rows[0] });
}
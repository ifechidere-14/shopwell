import { getSessionUser } from "@/lib/auth";
import { pool } from "@/lib/db";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "Login required" }, { status: 401 });
  const { rows } = await pool.query(`
    SELECT o.id, o.total, o.status, o.payment_status, o.created_at,
      COALESCE(json_agg(json_build_object('name', p.name, 'quantity', oi.quantity)) FILTER (WHERE p.id IS NOT NULL), '[]') AS items
    FROM orders o LEFT JOIN order_items oi ON oi.order_id = o.id LEFT JOIN products p ON p.id = oi.product_id
    WHERE o.user_id = $1 GROUP BY o.id ORDER BY o.created_at DESC`, [user.id]);
  return Response.json({ user, orders: rows });
}

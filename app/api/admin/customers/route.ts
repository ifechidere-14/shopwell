import { isAdminAuthenticated } from "@/lib/admin-auth";
import { pool } from "@/lib/db";

export async function GET() {
  if (!(await isAdminAuthenticated())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { rows } = await pool.query("SELECT u.id, u.full_name, u.email, u.phone, u.created_at, COUNT(o.id)::int AS order_count, COALESCE(SUM(o.total),0) AS lifetime_value FROM users u LEFT JOIN orders o ON o.user_id = u.id WHERE u.is_admin = FALSE GROUP BY u.id ORDER BY u.created_at DESC");
  return Response.json({ customers: rows });
}

import { pool } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export async function PATCH(req: Request) {
  if (!(await isAdminAuthenticated()))
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { orderId, status } = await req.json();
  const allowed = ["pending", "confirmed", "packed", "shipped", "delivered", "cancelled"];
  if (!orderId || !allowed.includes(status))
    return Response.json({ error: "Invalid input" }, { status: 400 });
  await pool.query("UPDATE orders SET status = $1 WHERE id = $2", [status, orderId]);
  return Response.json({ ok: true });
}
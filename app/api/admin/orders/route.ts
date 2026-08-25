import { pool } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { sendEmail, sendSms } from "@/lib/providers";

export async function PATCH(req: Request) {
  if (!(await isAdminAuthenticated()))
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { orderId, status } = await req.json();
  const allowed = ["pending", "confirmed", "packed", "shipped", "delivered", "cancelled"];
  if (!orderId || !allowed.includes(status))
    return Response.json({ error: "Invalid input" }, { status: 400 });
  const { rows } = await pool.query<{ email: string; phone: string | null; customer_name: string }>("UPDATE orders SET status = $1 WHERE id = $2 RETURNING email, phone, customer_name", [status, orderId]);
  const order = rows[0];
  if (order) {
    const message = `Hello ${order.customer_name}, your LordTempsMart order is now ${status}.`;
    await sendEmail({ to: order.email, subject: `Order update: ${status}`, html: `<p>${message}</p>` });
    if (order.phone) await sendSms(order.phone, message);
  }
  return Response.json({ ok: true });
}
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { pool } from "@/lib/db";

function csv(value: unknown) { return `"${String(value ?? "").replaceAll('"', '""')}"`; }

export async function GET() {
  if (!(await isAdminAuthenticated())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { rows } = await pool.query(`SELECT id, customer_name, email, phone, address, total, status, payment_status, created_at FROM orders ORDER BY created_at DESC`);
  const headers = ["id", "customer_name", "email", "phone", "address", "total", "status", "payment_status", "created_at"];
  const body = [headers, ...rows.map((row) => headers.map((header) => csv(row[header])))] .map((row) => row.join(",")).join("\n");
  return new Response(body, { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": "attachment; filename=lordtempsmart-orders.csv" } });
}

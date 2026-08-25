import { isAdminAuthenticated } from "@/lib/admin-auth";
import { pool } from "@/lib/db";

export async function GET() {
  if (!(await isAdminAuthenticated())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { rows } = await pool.query("SELECT * FROM promo_codes ORDER BY code");
  return Response.json({ promos: rows });
}

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { code, discountPercent, discountAmount, minimumOrder, expiresAt } = await req.json();
  if (!code || (!discountPercent && !discountAmount)) return Response.json({ error: "Code and discount are required" }, { status: 400 });
  const { rows } = await pool.query("INSERT INTO promo_codes (code, discount_percent, discount_amount, minimum_order, expires_at) VALUES (UPPER($1),$2,$3,$4,$5) RETURNING *", [code, discountPercent || null, discountAmount || null, minimumOrder || 0, expiresAt || null]);
  return Response.json({ promo: rows[0] }, { status: 201 });
}

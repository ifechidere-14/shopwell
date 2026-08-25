import { getSessionUser } from "@/lib/auth";
import { pool } from "@/lib/db";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "Login required" }, { status: 401 });
  const { rows } = await pool.query("INSERT INTO loyalty_accounts (user_id) VALUES ($1) ON CONFLICT (user_id) DO UPDATE SET updated_at = now() RETURNING points", [user.id]);
  return Response.json({ points: rows[0].points });
}

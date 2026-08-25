import { pool } from "@/lib/db";

export async function POST(req: Request) {
  const { code } = await req.json();
  if (!code) return Response.json({ error: "Gift-card code required" }, { status: 400 });
  const { rows } = await pool.query("SELECT code, balance, expires_at FROM gift_cards WHERE UPPER(code) = UPPER($1) AND active = TRUE AND (expires_at IS NULL OR expires_at > now())", [String(code).trim()]);
  if (!rows[0]) return Response.json({ error: "Gift card is invalid or expired" }, { status: 404 });
  return Response.json({ giftCard: rows[0] });
}

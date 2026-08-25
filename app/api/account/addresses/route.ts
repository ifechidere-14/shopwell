import { getSessionUser } from "@/lib/auth";
import { pool } from "@/lib/db";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "Login required" }, { status: 401 });
  const { rows } = await pool.query("SELECT * FROM addresses WHERE user_id = $1 ORDER BY is_default DESC, label", [user.id]);
  return Response.json({ addresses: rows });
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "Login required" }, { status: 401 });
  const { label, address, city, state } = await req.json();
  if (!label || !address) return Response.json({ error: "Label and address are required" }, { status: 400 });
  const { rows } = await pool.query("INSERT INTO addresses (user_id, label, address, city, state) VALUES ($1,$2,$3,$4,$5) RETURNING *", [user.id, label, address, city ?? null, state ?? null]);
  return Response.json({ address: rows[0] }, { status: 201 });
}

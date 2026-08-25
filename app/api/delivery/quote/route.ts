import { pool } from "@/lib/db";

export async function GET(req: Request) {
  const state = new URL(req.url).searchParams.get("state");
  if (!state) return Response.json({ error: "State is required" }, { status: 400 });
  const { rows } = await pool.query("SELECT name, fee FROM delivery_zones WHERE active = TRUE AND LOWER(name) = LOWER($1) LIMIT 1", [state]);
  return Response.json({ fee: rows[0]?.fee ?? 2500, zone: rows[0]?.name ?? "Standard delivery" });
}

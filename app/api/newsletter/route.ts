import { pool } from "@/lib/db";

export async function POST(req: Request) {
  const { email } = await req.json();
  if (!email || !/^\S+@\S+\.\S+$/.test(String(email))) return Response.json({ error: "Enter a valid email" }, { status: 400 });
  await pool.query("INSERT INTO newsletters (email) VALUES ($1) ON CONFLICT (email) DO UPDATE SET subscribed = TRUE", [String(email).toLowerCase().trim()]);
  return Response.json({ ok: true });
}

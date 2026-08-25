import { pool } from "@/lib/db";
import { createSession, hashPassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { fullName, email, password } = await req.json();
    if (!fullName || !email || !password)
      return Response.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    const existing = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );
    if (existing.rows.length > 0)
      return Response.json({ error: "Email already registered" }, { status: 409 });
    const { rows } = await pool.query(
      `INSERT INTO users (full_name, email, password_hash)
       VALUES ($1, $2, $3) RETURNING id, full_name, email`,
      [fullName, email.toLowerCase(), hashPassword(password)]
    );
    await createSession(rows[0].id);
    return Response.json({ user: rows[0] });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Registration failed" }, { status: 500 });
  }
}
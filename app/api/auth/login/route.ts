import { pool } from "@/lib/db";
import { createSession, verifyPassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password)
      return Response.json({ error: "Email and password required" }, { status: 400 });
    const { rows } = await pool.query(
      "SELECT id, full_name, email, password_hash FROM users WHERE email = $1",
      [String(email).toLowerCase()]
    );
    const user = rows[0];
    if (!user || !verifyPassword(password, user.password_hash))
      return Response.json({ error: "Invalid email or password" }, { status: 401 });
    await createSession(user.id);
    return Response.json({ user: { id: user.id, full_name: user.full_name, email: user.email } });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Login failed" }, { status: 500 });
  }
}
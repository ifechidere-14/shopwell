import { isAdminAuthenticated } from "@/lib/admin-auth";
import { pool } from "@/lib/db";

export async function GET() {
  if (!(await isAdminAuthenticated())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { rows } = await pool.query("SELECT c.*, COUNT(p.id)::int AS product_count FROM categories c LEFT JOIN products p ON p.category_id = c.id GROUP BY c.id ORDER BY c.name");
  return Response.json({ categories: rows });
}

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { name, slug, icon, description } = await req.json();
  if (!name || !slug) return Response.json({ error: "Name and slug required" }, { status: 400 });
  const { rows } = await pool.query("INSERT INTO categories (name, slug, icon, description) VALUES ($1,$2,$3,$4) RETURNING *", [name, slug, icon ?? null, description ?? null]);
  return Response.json({ category: rows[0] }, { status: 201 });
}

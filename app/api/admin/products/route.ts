import { isAdminAuthenticated } from "@/lib/admin-auth";
import { pool } from "@/lib/db";

async function guard() { return isAdminAuthenticated(); }

export async function POST(req: Request) {
  if (!(await guard())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  if (!body.name || !body.description || !body.categoryId || Number(body.price) < 0) return Response.json({ error: "Name, description, category, and valid price are required" }, { status: 400 });
  const { rows } = await pool.query(`INSERT INTO products (name, description, category_id, price, image, stock, featured, ingredients, usage_instructions) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`, [body.name, body.description, body.categoryId, body.price, body.image ?? null, body.stock ?? 0, Boolean(body.featured), body.ingredients ?? null, body.usageInstructions ?? null]);
  await pool.query(`INSERT INTO admin_activity (action, entity, entity_id) VALUES ('created', 'product', $1)`, [rows[0].id]);
  return Response.json({ product: rows[0] }, { status: 201 });
}

export async function PATCH(req: Request) {
  if (!(await guard())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  if (!body.id) return Response.json({ error: "Product id required" }, { status: 400 });
  const { rows } = await pool.query(`UPDATE products SET name = COALESCE($1,name), description = COALESCE($2,description), price = COALESCE($3,price), stock = COALESCE($4,stock), featured = COALESCE($5,featured), image = COALESCE($6,image), category_id = COALESCE($7,category_id) WHERE id = $8 RETURNING *`, [body.name, body.description, body.price, body.stock, body.featured, body.image, body.categoryId, body.id]);
  if (!rows[0]) return Response.json({ error: "Product not found" }, { status: 404 });
  await pool.query(`INSERT INTO admin_activity (action, entity, entity_id) VALUES ('updated', 'product', $1)`, [body.id]);
  return Response.json({ product: rows[0] });
}

export async function DELETE(req: Request) {
  if (!(await guard())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return Response.json({ error: "Product id required" }, { status: 400 });
  await pool.query("DELETE FROM products WHERE id = $1", [id]);
  return Response.json({ ok: true });
}

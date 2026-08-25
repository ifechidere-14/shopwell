import { pool } from "@/lib/db";

export async function GET(
  _req: Request,
  ctx: RouteContext<"/api/products/[id]">
) {
  const { id } = await ctx.params;
  try {
    const { rows } = await pool.query(
      `SELECT p.*, c.name AS category_name, c.slug AS category_slug
       FROM products p JOIN categories c ON c.id = p.category_id
       WHERE p.id = $1`,
      [id]
    );
    if (rows.length === 0)
      return Response.json({ error: "Product not found" }, { status: 404 });
    return Response.json({ product: rows[0] });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to load product" }, { status: 500 });
  }
}
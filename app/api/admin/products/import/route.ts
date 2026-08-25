import { isAdminAuthenticated } from "@/lib/admin-auth";
import { pool } from "@/lib/db";

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { csv } = await req.json();
  const lines = String(csv ?? "").trim().split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return Response.json({ error: "Add a CSV header and at least one product" }, { status: 400 });
  const headers = lines.shift()!.split(",").map((header: string) => header.trim().toLowerCase());
  const required = ["name", "description", "category_id", "price", "stock"];
  if (required.some((field) => !headers.includes(field))) return Response.json({ error: `CSV must include: ${required.join(", ")}` }, { status: 400 });
  let imported = 0;
  for (const line of lines) {
    const values = line.split(",");
    const row = Object.fromEntries(headers.map((header: string, index: number) => [header, values[index]?.trim() ?? ""]));
    if (!row.name || !row.description || !row.category_id || Number.isNaN(Number(row.price))) continue;
    await pool.query("INSERT INTO products (name, description, category_id, price, stock, image, featured, cost_price, supplier) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)", [row.name, row.description, Number(row.category_id), Number(row.price), Math.max(0, Number(row.stock) || 0), row.image || null, row.featured === "true", Math.max(0, Number(row.cost_price) || 0), row.supplier || null]);
    imported += 1;
  }
  return Response.json({ imported });
}
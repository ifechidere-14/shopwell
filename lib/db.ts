import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var __pool: Pool | undefined;
}

export const pool =
  global.__pool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes("localhost")
      ? false
      : { rejectUnauthorized: false },
  });

if (process.env.NODE_ENV !== "production") global.__pool = pool;

export type Product = {
  id: string;
  name: string;
  description: string;
  price: string;
  rating: string;
  image: string | null;
  stock: number;
  featured: boolean;
  category_id: number;
  category_name: string;
  category_slug: string;
  ingredients?: string | null;
  usage_instructions?: string | null;
  review_count?: string;
  low_stock_threshold?: number;
  video_url?: string | null;
  allergy_warnings?: string | null;
  skin_types?: string[];
  faqs?: unknown[];
};

export type ProductFilters = {
  category?: string;
  search?: string;
  sort?: "newest" | "price-asc" | "price-desc" | "rating";
};

export async function getProducts(categorySlug?: string, filters: ProductFilters = {}): Promise<Product[]> {
  const params: unknown[] = [];
  const conditions: string[] = [];
  const category = filters.category ?? categorySlug;
  if (category) {
    params.push(category);
    conditions.push(`c.slug = $${params.length}`);
  }
  if (filters.search) {
    params.push(`%${filters.search}%`);
    conditions.push(`(p.name ILIKE $${params.length} OR p.description ILIKE $${params.length})`);
  }
  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const order = {
    "price-asc": "p.price ASC",
    "price-desc": "p.price DESC",
    rating: "p.rating DESC, p.created_at DESC",
    newest: "p.created_at DESC",
  }[filters.sort ?? "newest"];
  const { rows } = await pool.query<Product>(
    `SELECT p.*, c.name AS category_name, c.slug AS category_slug
     FROM products p JOIN categories c ON c.id = p.category_id
     ${where}
     ORDER BY p.featured DESC, ${order}`,
    params
  );
  return rows;
}

export async function getProduct(id: string): Promise<Product | null> {
  const { rows } = await pool.query<Product>(
    `SELECT p.*, c.name AS category_name, c.slug AS category_slug,
      COALESCE((SELECT COUNT(*) FROM product_reviews r WHERE r.product_id = p.id), 0)::TEXT AS review_count
     FROM products p JOIN categories c ON c.id = p.category_id WHERE p.id = $1`,
    [id]
  );
  return rows[0] ?? null;
}

export async function getRelatedProducts(categorySlug: string, productId: string): Promise<Product[]> {
  const { rows } = await pool.query<Product>(
    `SELECT p.*, c.name AS category_name, c.slug AS category_slug
     FROM products p JOIN categories c ON c.id = p.category_id
     WHERE c.slug = $1 AND p.id <> $2 ORDER BY p.rating DESC, p.created_at DESC LIMIT 4`,
    [categorySlug, productId]
  );
  return rows;
}

export async function getCategories() {
  const { rows } = await pool.query(
    `SELECT c.*, COUNT(p.id) AS product_count
     FROM categories c LEFT JOIN products p ON p.category_id = c.id
     GROUP BY c.id ORDER BY c.id`
  );
  return rows;
}

export function formatNaira(value: string | number): string {
  return `₦${Number(value).toLocaleString("en-NG")}`;
}
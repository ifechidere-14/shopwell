// One-off script: applies schema.sql then db/seed.sql to the PostgreSQL
// database (Retool DB) in DATABASE_URL. Run with: node scripts/setup-db.mjs
import { readFileSync } from "fs";
import pg from "pg";

// Load env from .env.local manually (must happen BEFORE creating the pool)
try {
  for (const line of readFileSync(".env.local", "utf8").split("\n")) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
} catch {}

const ssl = /localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL ?? "")
  ? false
  : { rejectUnauthorized: false };

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl });

async function apply(file) {
  const sql = readFileSync(file, "utf8");
  console.log(`Applying ${file}...`);
  await pool.query(sql);
  console.log(`✔ ${file} applied`);
}

try {
  await apply("schema.sql");
  try {
    await apply("db/seed.sql");
  } catch (e) {
    // seed may partially fail on re-runs; report but continue
    console.error("Seed warning:", e.message);
  }
  const { rows } = await pool.query(
    `SELECT c.name AS category, COUNT(p.id) AS products
     FROM categories c LEFT JOIN products p ON p.category_id = c.id
     GROUP BY c.name ORDER BY c.name`
  );
  console.log("Database ready:");
  for (const r of rows) console.log(`  ${r.category}: ${r.products} products`);
} catch (e) {
  console.error("FAILED:", e.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
// Apply database tables and columns without reseeding data.
import { readFileSync } from "fs";
import pg from "pg";

try {
  for (const line of readFileSync(".env.local", "utf8").split("\n")) {
    const match = line.match(/^([A-Z_]+)=(.*)$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2];
  }
} catch {}

const ssl = /localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL ?? "")
  ? false
  : { rejectUnauthorized: false };
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl });

try {
  await pool.query(readFileSync("schema.sql", "utf8"));
  console.log("Database schema is up to date.");
} catch (error) {
  console.error("Database migration failed:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  await pool.end();
}

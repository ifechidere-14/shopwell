import { createHmac } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "ltm_admin";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin";
const SECRET = process.env.AUTH_SECRET ?? "dev-only-secret-change-me-in-production";

function sign(value: string): string {
  return createHmac("sha256", SECRET).update(value).digest("hex");
}

export function checkAdminCredentials(username: string, password: string): boolean {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

export async function createAdminSession() {
  const token = `admin.${sign("admin")}`;
  const jar = await cookies();
  jar.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  });
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE)?.value;
  if (!token) return false;
  const [name, sig] = token.split(".");
  return name === "admin" && sig === sign("admin");
}

export async function destroyAdminSession() {
  const jar = await cookies();
  jar.delete(ADMIN_COOKIE);
}
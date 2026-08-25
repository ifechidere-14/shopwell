import { checkAdminCredentials, createAdminSession } from "@/lib/admin-auth";

export async function POST(req: Request) {
  const { username, password } = await req.json();
  if (!checkAdminCredentials(String(username ?? ""), String(password ?? "")))
    return Response.json({ error: "Invalid admin credentials" }, { status: 401 });
  await createAdminSession();
  return Response.json({ ok: true });
}
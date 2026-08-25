import { getSessionUser } from "@/lib/auth";

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "Login required" }, { status: 401 });
  const { email, amount, reference } = await req.json();
  if (!email || !amount || !reference) return Response.json({ error: "Email, amount, and reference are required" }, { status: 400 });
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return Response.json({ error: "Online payment is not configured. Add PAYSTACK_SECRET_KEY to enable it." }, { status: 503 });
  const response = await fetch("https://api.paystack.co/transaction/initialize", { method: "POST", headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" }, body: JSON.stringify({ email, amount: Math.round(Number(amount) * 100), reference, callback_url: `${process.env.NEXT_PUBLIC_APP_URL ?? new URL(req.url).origin}/account` }) });
  const data = await response.json();
  return Response.json(data, { status: response.status });
}

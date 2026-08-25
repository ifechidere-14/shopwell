import { getSessionUser } from "@/lib/auth";

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "Login required" }, { status: 401 });
  const { email, name, phone, amount, reference } = await req.json();
  if (!email || !amount || !reference) return Response.json({ error: "Email, amount, and reference are required" }, { status: 400 });
  const key = process.env.FLUTTERWAVE_SECRET_KEY;
  if (!key) return Response.json({ error: "Flutterwave is not configured" }, { status: 503 });
  const response = await fetch("https://api.flutterwave.com/v3/payments", { method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" }, body: JSON.stringify({ tx_ref: reference, amount: Number(amount), currency: "NGN", redirect_url: `${process.env.NEXT_PUBLIC_APP_URL ?? new URL(req.url).origin}/account`, customer: { email, name, phonenumber: phone } }) });
  const data = await response.json();
  return Response.json(data, { status: response.status });
}

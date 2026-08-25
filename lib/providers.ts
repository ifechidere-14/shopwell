import { createHash, createHmac } from "crypto";

export async function sendEmail(input: { to: string; subject: string; html: string }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { configured: false, sent: false };
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: process.env.EMAIL_FROM ?? "LordTempsMart <onboarding@resend.dev>", ...input }),
  });
  if (!response.ok) throw new Error(`Email provider returned ${response.status}`);
  return { configured: true, sent: true };
}

export async function sendSms(to: string, body: string) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER;
  if (!sid || !token || !from) return { configured: false, sent: false };
  const encoded = new URLSearchParams({ To: to, From: from, Body: body });
  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: "POST",
    headers: { Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: encoded,
  });
  if (!response.ok) throw new Error(`SMS provider returned ${response.status}`);
  return { configured: true, sent: true };
}

export function cloudinarySignature(params: Record<string, string | number>) {
  const secret = process.env.CLOUDINARY_API_SECRET;
  if (!secret) return null;
  const payload = Object.entries(params).sort(([a], [b]) => a.localeCompare(b)).map(([key, value]) => `${key}=${value}`).join("&");
  return { signature: createHash("sha1").update(payload + secret).digest("hex"), timestamp: params.timestamp };
}

export function verifyPaystackSignature(rawBody: string, signature: string | null) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret || !signature) return false;
  const expected = createHmac("sha512", secret).update(rawBody).digest("hex");
  return expected === signature;
}

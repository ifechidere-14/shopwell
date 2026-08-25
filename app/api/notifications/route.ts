import { getSessionUser } from "@/lib/auth";
import { pool } from "@/lib/db";
import { sendEmail, sendSms } from "@/lib/providers";

export async function POST(req: Request) {
  if (!(await getSessionUser())) return Response.json({ error: "Login required" }, { status: 401 });
  const { to, phone, subject, body } = await req.json();
  if (!to || !subject || !body) return Response.json({ error: "Recipient, subject, and body are required" }, { status: 400 });
  const email = await sendEmail({ to, subject, html: `<p>${String(body).replaceAll("\n", "<br>")}</p>` });
  const sms = phone ? await sendSms(phone, body) : { configured: false, sent: false };
  await pool.query(`INSERT INTO notifications (channel, recipient, subject, body, sent_at) VALUES ('email', $1, $2, $3, CASE WHEN $4 THEN now() ELSE NULL END)`, [to, subject, body, email.sent]);
  return Response.json({ email, sms });
}

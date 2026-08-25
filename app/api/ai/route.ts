import { getSessionUser } from "@/lib/auth";

export async function POST(req: Request) {
  const { message, context } = await req.json();
  if (!message) return Response.json({ error: "Message required" }, { status: 400 });
  const key = process.env.OPENAI_API_KEY;
  if (!key) return Response.json({ error: "AI assistant is not configured. Add OPENAI_API_KEY." }, { status: 503 });
  const user = await getSessionUser();
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: process.env.OPENAI_MODEL ?? "gpt-4o-mini", messages: [{ role: "system", content: "You are the concise, helpful LordTempsMart shopping assistant. Recommend only products from the supplied context and never make medical claims." }, { role: "user", content: `Customer: ${message}\nCatalog context: ${JSON.stringify(context ?? [])}` }], user: user?.id }),
  });
  const data = await response.json();
  if (!response.ok) return Response.json({ error: "AI provider request failed" }, { status: response.status });
  return Response.json({ reply: data.choices?.[0]?.message?.content ?? "I could not find a recommendation." });
}

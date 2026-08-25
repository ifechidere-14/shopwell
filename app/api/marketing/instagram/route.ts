export async function GET() {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID;
  if (!token || !userId) return Response.json({ configured: false, posts: [] });
  const query = new URLSearchParams({ fields: "id,caption,media_type,media_url,permalink,timestamp", access_token: token, limit: "12" });
  const response = await fetch(`https://graph.instagram.com/${encodeURIComponent(userId)}/media?${query}`, { next: { revalidate: 900 } });
  if (!response.ok) return Response.json({ error: "Instagram feed unavailable" }, { status: response.status });
  const data = await response.json();
  return Response.json({ configured: true, posts: data.data ?? [] });
}

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { cloudinarySignature } from "@/lib/providers";

export async function POST() {
  if (!(await isAdminAuthenticated())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const cloud = process.env.CLOUDINARY_CLOUD_NAME;
  const key = process.env.CLOUDINARY_API_KEY;
  const timestamp = Math.floor(Date.now() / 1000);
  const signed = cloudinarySignature({ timestamp });
  if (!cloud || !key || !signed) return Response.json({ error: "Image uploads are not configured" }, { status: 503 });
  return Response.json({ cloudName: cloud, apiKey: key, timestamp, signature: signed.signature });
}

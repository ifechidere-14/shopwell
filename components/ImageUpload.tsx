"use client";

import { useState } from "react";

export default function ImageUpload({ onUploaded }: { onUploaded: (url: string) => void }) {
  const [status, setStatus] = useState("");
  async function upload(file: File) {
    setStatus("Preparing upload...");
    const signatureResponse = await fetch("/api/uploads/signature", { method: "POST" });
    const signature = await signatureResponse.json();
    if (!signatureResponse.ok) { setStatus(signature.error ?? "Uploads are unavailable."); return; }
    const body = new FormData();
    body.append("file", file);
    body.append("api_key", signature.apiKey);
    body.append("timestamp", String(signature.timestamp));
    body.append("signature", signature.signature);
    const response = await fetch(`https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`, { method: "POST", body });
    const data = await response.json();
    if (!response.ok) { setStatus(data.error?.message ?? "Upload failed."); return; }
    onUploaded(data.secure_url);
    setStatus("Image uploaded.");
  }
  return <div><label className="block text-sm font-semibold">Product image<input type="file" accept="image/*" onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(file); }} className="mt-1 block w-full text-sm" /></label>{status && <p className="mt-1 text-xs text-neutral-500">{status}</p>}</div>;
}

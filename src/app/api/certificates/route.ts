/* eslint-disable @typescript-eslint/no-explicit-any */
import { bucket } from "@/config/firebaseServer";

export async function GET() {
  try {
    const [files] = await bucket.getFiles({ prefix: "certificates/" });

    const fileList = files.map(file => ({
      name: file.name,
      publicUrl: `https://storage.googleapis.com/${bucket.name}/${file.name}`
    }));

    return Response.json({ ok: true, files: fileList });
  } catch (error: any) {
    console.error("Error fetching files:", error);
    return Response.json({ ok: false, message: error.message });
  }
}

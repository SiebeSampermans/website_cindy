import { mimeForName, readUpload } from "@/lib/media";

// Serveert geüploade afbeeldingen uit UPLOAD_DIR.
export async function GET(request, { params }) {
  const { name } = await params;
  const file = await readUpload(name);

  if (!file) {
    return new Response("Niet gevonden", { status: 404 });
  }

  return new Response(file, {
    headers: {
      "Content-Type": mimeForName(name),
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff"
    }
  });
}

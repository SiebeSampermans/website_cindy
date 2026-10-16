import { NextResponse } from "next/server";
import { requireAdmin, redirectTo } from "@/lib/admin-route";
import { saveUpload } from "@/lib/media";

export async function POST(request) {
  const wantsJson = request.headers.get("accept")?.includes("application/json");
  const { response } = await requireAdmin(request);

  if (response) {
    return wantsJson ? NextResponse.json({ error: "Niet ingelogd." }, { status: 401 }) : response;
  }

  const formData = await request.formData();
  const files = formData.getAll("files").filter((file) => typeof file === "object" && file.size > 0);
  const urls = [];
  const errors = [];

  for (const file of files) {
    try {
      urls.push(await saveUpload(file));
    } catch (error) {
      errors.push(error.message);
    }
  }

  if (wantsJson) {
    return urls.length
      ? NextResponse.json({ urls, errors })
      : NextResponse.json({ error: errors[0] || "Geen bestand gekozen." }, { status: 400 });
  }

  return redirectTo(request, "/admin/afbeeldingen", {
    uploaded: urls.length,
    error: errors.length ? errors.join(" ") : undefined
  });
}

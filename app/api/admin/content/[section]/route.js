import { requireAdmin, redirectTo } from "@/lib/admin-route";
import { getStoredContent, resetContentValues, saveContentValues } from "@/lib/cms";
import { getSection, parseFieldValue } from "@/lib/content-registry";

function isSame(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

export async function POST(request, { params }) {
  const { session, response } = await requireAdmin(request);
  if (response) return response;

  const { section: sectionId } = await params;
  const section = getSection(sectionId);

  if (!section) {
    return redirectTo(request, "/admin/teksten");
  }

  const pagePath = `/admin/teksten/${section.id}`;
  const formData = await request.formData();
  const resetKey = formData.get("reset");

  if (resetKey) {
    if (section.fields.some((item) => item.key === resetKey)) {
      await resetContentValues([resetKey]);
    }
    return redirectTo(request, pagePath, { status: "reset" });
  }

  const stored = await getStoredContent();
  const toSave = [];
  const toReset = [];
  let invalid = false;

  for (const item of section.fields) {
    if (!formData.has(item.key)) continue;

    const value = parseFieldValue(item, formData.get(item.key));

    if (value === undefined) {
      invalid = true;
      continue;
    }

    if (isSame(value, item.default)) {
      // Weer gelijk aan het origineel: dan hoeft er niets in de databank te staan.
      if (item.key in stored) toReset.push(item.key);
    } else if (!isSame(value, stored[item.key])) {
      toSave.push([item.key, value]);
    }
  }

  await saveContentValues(toSave, session.id);
  await resetContentValues(toReset);

  return redirectTo(request, pagePath, { status: invalid ? "invalid" : "saved" });
}

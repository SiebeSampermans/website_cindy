import { requireAdmin, redirectTo } from "@/lib/admin-route";
import { saveMailTemplateForm } from "@/lib/mail-template-form";
import { getMailTemplateDefinition } from "@/lib/mail-templates";

export async function POST(request, { params }) {
  const { response } = await requireAdmin(request);
  if (response) return response;

  const { key } = await params;
  const definition = getMailTemplateDefinition(key);

  if (!definition) {
    return redirectTo(request, "/admin/mail");
  }

  const status = await saveMailTemplateForm(definition, await request.formData());
  return redirectTo(request, `/admin/mail/${key}`, { status });
}

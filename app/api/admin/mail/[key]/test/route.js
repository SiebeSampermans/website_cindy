import { requireAdmin, redirectTo } from "@/lib/admin-route";
import { sendMail } from "@/lib/mailer";
import { saveMailTemplateForm } from "@/lib/mail-template-form";
import { getMailTemplate, getMailTemplateDefinition, renderMailTemplate } from "@/lib/mail-templates";

export async function POST(request, { params }) {
  const { session, response } = await requireAdmin(request);
  if (response) return response;

  const { key } = await params;
  const definition = getMailTemplateDefinition(key);

  if (!definition) {
    return redirectTo(request, "/admin/mail");
  }

  const status = await saveMailTemplateForm(definition, await request.formData());

  if (status === "invalid") {
    return redirectTo(request, `/admin/mail/${key}`, { status });
  }

  try {
    const template = await getMailTemplate(key);
    const rendered = renderMailTemplate(template, template.sample);
    await sendMail({ to: session.email, ...rendered, subject: `[TEST] ${rendered.subject}` });
    return redirectTo(request, `/admin/mail/${key}`, { status: "test-sent" });
  } catch {
    return redirectTo(request, `/admin/mail/${key}`, { status: "test-error" });
  }
}

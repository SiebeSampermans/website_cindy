import { formString } from "@/lib/admin-route";
import { deleteMailTemplate, saveMailTemplate } from "@/lib/cms";

// Gedeeld door de opslaan- en testroute. Geeft "saved", "reset" of "invalid".
export async function saveMailTemplateForm(definition, formData) {
  if (formData.get("reset") === "1") {
    await deleteMailTemplate(definition.key);
    return "reset";
  }

  const subject = formString(formData, "subject", 255);
  const body = formString(formData, "body", 10000);

  if (!subject || !body) {
    return "invalid";
  }

  await saveMailTemplate({
    key: definition.key,
    subject,
    body,
    enabled: definition.canDisable ? formData.get("enabled") === "1" : true
  });

  return "saved";
}

import { CMS_URL, type ApiEnvelope } from "@/lib/cms-client";

export async function submitForm(
  formKey: string,
  payload: { name: string; phone?: string; email?: string; property_type_interest?: string; message?: string }
): Promise<{ id: string; status: string }> {
  const res = await fetch(`${CMS_URL}/public/forms/${formKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = (await res.json()) as ApiEnvelope<{ id: string; status: string }>;
  if (!res.ok || !body.success || !body.data) {
    throw new Error(body.error?.message ?? "Could not submit the form — please try again.");
  }
  return body.data;
}

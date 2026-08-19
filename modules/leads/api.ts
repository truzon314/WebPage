import { cmsFetch } from "@/lib/cms-client";

export async function submitForm(
  formKey: string,
  payload: {
    name: string;
    phone?: string;
    email?: string;
    property_type_interest?: string;
    message?: string;
  }
): Promise<{ id: string; status: string }> {
  const envelope = await cmsFetch<{ id: string; status: string }>(
    `/public/forms/${formKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  if (!envelope.success || !envelope.data) {
    throw new Error(
      envelope.error?.message ??
        "Could not submit the form — please try again."
    );
  }

  return envelope.data;
}
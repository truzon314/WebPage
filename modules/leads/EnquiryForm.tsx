"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { PROPERTY_TYPE_OPTIONS } from "@/modules/properties/constants/hero-slides";
import { submitForm } from "@/modules/leads/api";

interface FormState {
  name: string;
  phone: string;
  email: string;
  propertyType: string;
}

export function EnquiryForm({ types }: { types?: string[] }) {
  const propertyTypes = types && types.length > 0 ? types : PROPERTY_TYPE_OPTIONS;
  const [form, setForm] = useState<FormState>(() => ({
    name: "",
    phone: "",
    email: "",
    propertyType: propertyTypes[0] ?? "Villas",
  }));
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function setField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      setError("Please add your name and phone number.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await submitForm("hero_quick_enquiry", {
        name: form.name,
        phone: form.phone,
        email: form.email || undefined,
        property_type_interest: form.propertyType,
      });
      setSubmitted(true);
    } catch {
      setError("Something went wrong — please try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full shrink-0 rounded-[14px] bg-white/97 p-7 shadow-[0_24px_60px_rgba(8,15,32,0.35)] sm:w-[340px]">
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="submitted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-5 text-center"
          >
            <CheckCircle2 size={38} strokeWidth={1.8} className="mx-auto mb-3.5 text-success" />
            <div className="mb-2 font-heading text-[17px] font-bold text-navy-900">Thank you, {form.name}!</div>
            <div className="text-[13px] leading-[1.6] text-text-body">
              We&apos;ll call {form.phone} within 24 hours.
            </div>
          </motion.div>
        ) : (
          <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit}>
            <div className="mb-1 font-heading text-[19px] font-bold text-navy-900">Quick Enquiry</div>
            <div className="mb-5 text-xs text-text-muted">Get a callback within 24 hours</div>
            <div className="flex flex-col gap-3.5">
              <input
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                placeholder="Your name"
                aria-label="Your name"
                className="rounded-md border-[1.5px] border-border px-3 py-2.5 text-[13.5px] outline-none focus:border-gold-400"
              />
              <input
                value={form.phone}
                onChange={(e) => setField("phone", e.target.value)}
                placeholder="Phone number"
                aria-label="Phone number"
                className="rounded-md border-[1.5px] border-border px-3 py-2.5 text-[13.5px] outline-none focus:border-gold-400"
              />
              <input
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                placeholder="Email address"
                aria-label="Email address"
                type="email"
                className="rounded-md border-[1.5px] border-border px-3 py-2.5 text-[13.5px] outline-none focus:border-gold-400"
              />
              <select
                value={form.propertyType}
                onChange={(e) => setField("propertyType", e.target.value)}
                aria-label="Property type"
                className="rounded-md border-[1.5px] border-border bg-white px-3 py-2.5 text-[13.5px] text-navy-900 outline-none focus:border-gold-400"
              >
                {propertyTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
                <option value="Not sure yet">Not sure yet</option>
              </select>
              {error ? <div className="text-xs text-error">{error}</div> : null}
              <button
                type="submit"
                disabled={submitting}
                className="mt-0.5 rounded-md bg-gold-400 px-[18px] py-3.5 text-[13px] font-bold tracking-[0.3px] text-navy-900 transition-all hover:-translate-y-0.5 hover:bg-gold-500 hover:shadow-[0_8px_20px_rgba(212,165,55,0.35)] cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "SENDING..." : "REQUEST CALLBACK"}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

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
  message: string;
}

const fieldClasses =
  "rounded-md border-[1.5px] border-border px-3.5 py-3 text-[13.5px] outline-none focus:border-gold-400";
const labelClasses = "mb-1.5 block text-[12.5px] font-semibold text-navy-900";

interface ContactFormProps {
  heading?: string;
  description?: string;
  types?: string[];
}

export function ContactForm({
  heading = "Request a Callback",
  description = "Fill this in and a property consultant will reach out to arrange your site visit.",
  types,
}: ContactFormProps) {
  const propertyTypes = types && types.length > 0 ? types : PROPERTY_TYPE_OPTIONS;
  const [form, setForm] = useState<FormState>(() => ({
    name: "",
    phone: "",
    email: "",
    propertyType: propertyTypes[0] ?? "Villas",
    message: "",
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
      await submitForm("contact_callback", {
        name: form.name,
        phone: form.phone,
        email: form.email || undefined,
        property_type_interest: form.propertyType,
        message: form.message || undefined,
      });
      setSubmitted(true);
    } catch {
      setError("Something went wrong — please try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div id="request-callback" className="scroll-mt-28 rounded-[10px] bg-surface p-8 shadow-[0_2px_18px_rgba(18,23,43,0.08)]">
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div key="submitted" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-6 text-center">
            <CheckCircle2 size={40} strokeWidth={1.8} className="mx-auto mb-4 text-success" />
            <div className="mb-2 font-heading text-lg font-bold text-navy-900">Thank you, {form.name}!</div>
            <p className="text-[13.5px] leading-[1.6] text-text-body">
              A property consultant will call {form.phone} within one business day to arrange your site visit.
            </p>
          </motion.div>
        ) : (
          <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit}>
            <h2 className="mb-2 font-heading text-xl font-bold text-navy-900">{heading}</h2>
            <p className="mb-6 text-[13.5px] leading-[1.6] text-text-body">{description}</p>

            <div className="mb-4">
              <label htmlFor="contact-name" className={labelClasses}>
                Full Name
              </label>
              <input
                id="contact-name"
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                placeholder="Your name"
                className={`${fieldClasses} w-full`}
              />
            </div>

            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="contact-phone" className={labelClasses}>
                  Phone Number
                </label>
                <input
                  id="contact-phone"
                  value={form.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                  placeholder="+91 90000 00000"
                  className={`${fieldClasses} w-full`}
                />
              </div>
              <div>
                <label htmlFor="contact-email" className={labelClasses}>
                  Email Address
                </label>
                <input
                  id="contact-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setField("email", e.target.value)}
                  placeholder="you@email.com"
                  className={`${fieldClasses} w-full`}
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="contact-type" className={labelClasses}>
                I&apos;m interested in
              </label>
              <select
                id="contact-type"
                value={form.propertyType}
                onChange={(e) => setField("propertyType", e.target.value)}
                className={`${fieldClasses} w-full bg-white text-navy-900`}
              >
                {propertyTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-5">
              <label htmlFor="contact-message" className={labelClasses}>
                Message (optional)
              </label>
              <textarea
                id="contact-message"
                value={form.message}
                onChange={(e) => setField("message", e.target.value)}
                placeholder="Tell us about your requirements..."
                rows={4}
                className={`${fieldClasses} w-full resize-none`}
              />
            </div>

            {error ? <div className="mb-4 text-xs text-error">{error}</div> : null}

            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-gold-400 px-7 py-3.5 text-[13px] font-bold tracking-[0.3px] text-navy-900 transition-all hover:-translate-y-0.5 hover:bg-gold-500 hover:shadow-[0_8px_20px_rgba(212,165,55,0.35)] cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "SUBMITTING..." : "SUBMIT REQUEST"}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

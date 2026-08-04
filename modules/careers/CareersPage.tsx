"use client";

import { useState } from "react";
import { CheckCircle2, Mail, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { submitForm } from "@/modules/leads/api";
import type { CmsCareer } from "@/modules/careers/api";

export function CareersPage({ careers }: { careers: CmsCareer[] }) {
  const [activeCareer, setActiveCareer] = useState<CmsCareer | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", message: "" });

  function openApply(career: CmsCareer) {
    setActiveCareer(career);
    setSubmitted(false);
    setError(null);
    setFormData({ name: "", phone: "", email: "", message: "" });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!activeCareer) return;
    setError(null);
    setSubmitting(true);
    try {
      await submitForm("career_application", {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        message: `Applying for: ${activeCareer.title}${formData.message ? `\n\n${formData.message}` : ""}`,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit — please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (careers.length === 0) {
    return (
      <Container className="py-20 text-center">
        <p className="text-[15px] text-text-body">
          No open positions right now — check back soon, or write to us at{" "}
          <a href="mailto:careers@truzonhomes.com" className="font-semibold text-gold-600">
            careers@truzonhomes.com
          </a>
          .
        </p>
      </Container>
    );
  }

  return (
    <>
      <Container className="flex flex-col gap-6 py-16 lg:py-[90px]">
        {careers.map((career) => (
          <div
            key={career.id}
            className="rounded-xl border border-border bg-surface p-7 shadow-[0_2px_10px_rgba(18,23,43,0.05)]"
          >
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <h2 className="font-heading text-xl font-bold text-navy-900">{career.title}</h2>
              {career.employment_type ? (
                <span className="rounded-full bg-gold-50 px-3 py-1 text-xs font-semibold text-gold-600">
                  {career.employment_type}
                </span>
              ) : null}
            </div>
            {career.department || career.location ? (
              <p className="mb-4 text-sm text-text-muted">
                {[career.department, career.location].filter(Boolean).join(" • ")}
              </p>
            ) : null}
            <p className="mb-5 whitespace-pre-line text-[15px] leading-[1.7] text-text-body">{career.description}</p>
            {career.apply_email ? (
              <Button onClick={() => openApply(career)} variant="gold">
                <Mail size={15} />
                Apply Now
              </Button>
            ) : null}
          </div>
        ))}
      </Container>

      {activeCareer ? (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-navy-950/75 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 text-navy-900 shadow-2xl sm:p-8">
            <button
              type="button"
              onClick={() => setActiveCareer(null)}
              aria-label="Close modal"
              className="absolute right-4 top-4 cursor-pointer text-gray-400 hover:text-navy-900"
            >
              <X size={20} />
            </button>

            {submitted ? (
              <div className="py-6 text-center">
                <CheckCircle2 size={48} className="mx-auto mb-3 text-success" />
                <h3 className="font-heading text-xl font-bold text-navy-900">Application Received!</h3>
                <p className="mt-2 text-sm text-text-body">
                  Thank you for applying to <span className="font-semibold">{activeCareer.title}</span>. Our team
                  will review your application and get in touch if there&apos;s a fit.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveCareer(null)}
                  className="mt-6 w-full cursor-pointer rounded-lg bg-navy-900 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-navy-800"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <div>
                <h3 className="font-heading text-xl font-bold text-navy-900">Apply for {activeCareer.title}</h3>
                <p className="mt-1 text-xs text-text-muted">
                  Share your details and we&apos;ll get back to you about this role.
                </p>

                <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-navy-900">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-navy-900 focus:border-gold-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-navy-900">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-navy-900 focus:border-gold-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-navy-900">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="rahul@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-navy-900 focus:border-gold-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-navy-900">Cover Message</label>
                    <textarea
                      rows={4}
                      placeholder="Tell us why you're a good fit for this role..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full resize-none rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-navy-900 focus:border-gold-500 focus:outline-none"
                    />
                  </div>
                  {error ? <p className="text-xs font-medium text-red-600">{error}</p> : null}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="mt-2 w-full cursor-pointer rounded-lg bg-gold-500 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-navy-950 shadow-md transition-all hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? "Submitting..." : "Submit Application"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}

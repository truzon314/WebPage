"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHero } from "@/modules/content/PageHero";
import { Container } from "@/components/ui/Container";
import { submitForm } from "@/modules/leads/api";
import { getStoredVisitorContact, setStoredVisitorContact } from "@/modules/leads/visitorContact";

/** `/sitemap` is a lead-capture gate, not a link directory — a visitor who
 * hasn't shared contact details anywhere on the site fills the same
 * name/phone/email form as "View Availability" here, then is sent to
 * /projects. A visitor who's already identified (from unlocking a
 * property's site layout, or from live chat) skips straight through. */
export function SitemapGate() {
  const router = useRouter();
  const [checkedStorage, setCheckedStorage] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (getStoredVisitorContact()) {
      router.replace("/projects");
      return;
    }
    setCheckedStorage(true);
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await submitForm("sitemap_gate", {
        name: formData.name,
        phone: formData.phone,
        email: formData.email || undefined,
      });
      setStoredVisitorContact({
        name: formData.name,
        phone: formData.phone,
        email: formData.email || undefined,
      });
      router.push("/projects");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit — please try again.");
      setSubmitting(false);
    }
  }

  // Avoid flashing the form for visitors already known — they're about to
  // be redirected by the effect above.
  if (!checkedStorage) return null;

  return (
    <>
      <PageHero
        title="Sitemap"
        subtitle="Share your details to continue to our full list of projects."
        crumbs={[{ label: "Home", href: "/" }, { label: "Sitemap" }]}
      />
      <section className="py-16 lg:py-[90px]">
        <Container size="narrow">
          <div className="mx-auto max-w-md rounded-2xl border border-divider bg-surface p-8 shadow-[0_2px_18px_rgba(18,23,43,0.08)]">
            <h2 className="mb-1.5 font-heading text-xl font-bold text-navy-900">Continue to Projects</h2>
            <p className="mb-6 text-[13.5px] text-text-muted">
              Enter your contact details once and we&apos;ll take you straight to our full project listings.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                <label className="mb-1 block text-xs font-semibold text-navy-900">Email Address</label>
                <input
                  type="email"
                  placeholder="rahul@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-navy-900 focus:border-gold-500 focus:outline-none"
                />
              </div>
              {error ? <p className="text-xs font-medium text-red-600">{error}</p> : null}
              <button
                type="submit"
                disabled={submitting}
                className="mt-2 w-full cursor-pointer rounded-lg bg-gold-500 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-navy-950 shadow-md transition-all hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "View Projects"}
              </button>
            </form>
          </div>
        </Container>
      </section>
    </>
  );
}

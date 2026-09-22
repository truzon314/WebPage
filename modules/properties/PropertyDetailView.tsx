"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Compass,
  Download,
  Eye,
  Heart,
  Lock,
  MapPin,
  MessageSquare,
  PhoneCall,
  Play,
  Share2,
  ShieldCheck,
  Sparkles,
  X,
  ZoomIn,
} from "lucide-react";

import { Container } from "@/components/ui/Container";
import { useFavorites } from "@/modules/properties/FavoritesContext";
import type { DetailedProperty } from "@/modules/properties/types";
import { cn } from "@/lib/utils";
import { submitForm } from "@/modules/leads/api";
import {
  getStoredVisitorContact,
  isMapUnlocked,
  setStoredVisitorContact,
} from "@/modules/leads/visitorContact";
import { useFloatingWidgets } from "@/modules/layout/FloatingWidgetsContext";

const PropertyLocationMap = dynamic(
  () =>
    import("@/modules/properties/PropertyLocationMap").then(
      (m) => m.PropertyLocationMap
    ),
  { ssr: false }
);

interface PropertyDetailViewProps {
  property: DetailedProperty;
}

type ModalType =
  | "callback"
  | "brochure"
  | "layout"
  | "tour"
  | "availability"
  | "map_unlock"
  | "master_plan_zoom"
  | "floor_plan_zoom"
  | "video_lightbox"
  | null;

export function PropertyDetailView({ property }: PropertyDetailViewProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeFloorPlanIndex, setActiveFloorPlanIndex] = useState(0);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  const [zoomedPlanImageUrl, setZoomedPlanImageUrl] = useState<string | null>(null);

  const { isFavorite, toggle: toggleFavorite } = useFavorites();
  const { setMapInView } = useFloatingWidgets();

  const saved = isFavorite(property.id);
  const [copied, setCopied] = useState(false);

  function handleShare() {
    const shareData = {
      title: property.name,
      text: `Check out ${property.name} on Truzon Homes!`,
      url: typeof window !== "undefined" ? window.location.href : "",
    };

    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share(shareData).catch(() => {});
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  const [modalType, setModalType] = useState<ModalType>(null);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const [mapUnlocked, setMapUnlocked] = useState(false);
  const [genericSubmitting, setGenericSubmitting] = useState(false);
  const [genericSubmitError, setGenericSubmitError] = useState<string | null>(null);

  const [knownContact, setKnownContact] = useState<{
    name: string;
    phone: string;
    email?: string;
  } | null>(null);

  useEffect(() => {
    setMapUnlocked(isMapUnlocked());
    setKnownContact(getStoredVisitorContact());
  }, []);

  const [downloadingBrochure, setDownloadingBrochure] = useState(false);

  const mapSectionRef = useRef<HTMLDivElement>(null);
  const aboutSectionRef = useRef<HTMLDivElement>(null);

  const activeImage = property.gallery[activeImageIndex] || property.image;

  useEffect(() => {
    const section = mapSectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setMapInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(section);
    return () => {
      observer.disconnect();
      setMapInView(false);
    };
  }, [setMapInView]);

  function handleOpenModal(type: ModalType) {
    setModalType(type);
    setSubmitted(false);
    setGenericSubmitError(null);

    if (knownContact) {
      setFormData({
        name: knownContact.name,
        phone: knownContact.phone,
        email: knownContact.email ?? "",
      });
    }
  }

  function handleCloseModal() {
    setModalType(null);
    setSubmitted(false);
    setGenericSubmitError(null);
  }

  function scrollToSection(ref: React.RefObject<HTMLDivElement | null>) {
    if (!ref.current) return;
    const header = document.querySelector("header");
    const headerHeight = header?.getBoundingClientRect().height ?? 0;
    const top = ref.current.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
    window.scrollTo({ top, behavior: "smooth" });
  }

  async function handleGenericSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGenericSubmitError(null);

    if (modalType === "brochure") {
      setGenericSubmitting(true);
      try {
        await submitForm("brochure_download", {
          name: formData.name,
          phone: formData.phone,
          email: formData.email || undefined,
        });

        const contact = {
          name: formData.name,
          phone: formData.phone,
          email: formData.email || undefined,
        };

        setStoredVisitorContact(contact);
        setKnownContact(contact);
        setSubmitted(true);
      } catch (err) {
        setGenericSubmitError(err instanceof Error ? err.message : "Could not submit — please try again.");
      } finally {
        setGenericSubmitting(false);
      }
      return;
    }

    if (formData.name && formData.phone) {
      const contact = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email || undefined,
      };
      setStoredVisitorContact(contact);
      setKnownContact(contact);
      setMapUnlocked(true);
    }
    setSubmitted(true);
  }

  async function handleDownloadBrochure() {
    if (!property.brochureUrl || downloadingBrochure) return;
    setDownloadingBrochure(true);
    try {
      const res = await fetch(property.brochureUrl);
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${property.name.replace(/\s+/g, "-")}-Brochure.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(property.brochureUrl, "_blank");
    } finally {
      setDownloadingBrochure(false);
    }
  }

  const whatsappMessage = encodeURIComponent(
    `Hi Truzon Homes, I would like to schedule a site visit / get more details for ${property.name} (${property.location}).`
  );
  const whatsappUrl = `https://wa.me/${(property.phone || "").replace(/[^0-9]/g, "") || "919000012345"}?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-surface-subtle/30 text-text-strong pb-24 sm:pb-28">
      {/* ─────────────────────────────────────────────────────────────────────
          SECTION 1 — FULL-SCREEN CINEMATIC HERO (90-100vh)
          ───────────────────────────────────────────────────────────────────── */}
      <section className="relative h-[85vh] min-h-[580px] md:h-[92vh] w-full overflow-hidden bg-navy-950">
        {property.heroMediaType === "video" && (property.desktopHeroVideoUrl || property.mobileHeroVideoUrl) ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            poster={property.posterImageUrl || undefined}
            className="absolute inset-0 h-full w-full object-cover"
          >
            {property.desktopHeroVideoUrl && <source src={property.desktopHeroVideoUrl} type="video/mp4" />}
            {property.mobileHeroVideoUrl && <source src={property.mobileHeroVideoUrl} type="video/mp4" />}
          </video>
        ) : (
          <Image
            src={property.desktopHeroImageUrl || property.image}
            alt={property.name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}

        {/* Dynamic Dark Gradient Overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/50 to-black/30"
          style={{ opacity: (property.heroOverlayStrength ?? 40) / 100 + 0.3 }}
        />

        {/* Top Breadcrumb & Share */}
        <div className="absolute top-6 left-0 right-0 z-20">
          <Container>
            <div className="flex items-center justify-between text-xs text-white/80 font-medium">
              <div className="flex items-center gap-2 backdrop-blur-md bg-black/30 px-3.5 sm:px-4 py-2 rounded-full border border-white/10 text-[11px] sm:text-xs">
                <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
                <span>/</span>
                <Link href="/projects" className="hover:text-amber-400 transition-colors">Projects</Link>
                <span>/</span>
                <span className="text-white font-semibold truncate max-w-[140px] sm:max-w-none">{property.name}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleShare}
                  className="flex items-center gap-1.5 backdrop-blur-md bg-black/40 hover:bg-black/60 text-white px-3.5 py-2 rounded-full border border-white/15 transition-all cursor-pointer"
                >
                  <Share2 size={14} />
                  <span className="hidden sm:inline">Share</span>
                  {copied && <span className="text-[11px] text-emerald-400 font-bold ml-1">Copied!</span>}
                </button>
                <button
                  type="button"
                  onClick={() => toggleFavorite(property.id)}
                  className="flex items-center gap-1.5 backdrop-blur-md bg-black/40 hover:bg-black/60 text-white px-3.5 py-2 rounded-full border border-white/15 transition-all cursor-pointer"
                >
                  <Heart size={14} className={saved ? "fill-red-500 text-red-500" : ""} />
                  <span className="hidden sm:inline">{saved ? "Saved" : "Save"}</span>
                </button>
              </div>
            </div>
          </Container>
        </div>

        {/* Hero Content */}
        <div className="absolute inset-0 z-10 flex items-end pb-16 md:pb-24">
          <Container>
            <div className="max-w-3xl text-white">
              {(property.tagText || property.statusText || property.approvalInfo) && (
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  {property.tagText && (
                    <span className="rounded-full bg-amber-500/90 text-navy-950 px-3.5 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                      {property.tagText}
                    </span>
                  )}
                  {(property.statusText || property.approvalInfo) && (
                    <span className="rounded-full bg-white/20 text-white px-3.5 py-1 text-xs font-semibold backdrop-blur-sm">
                      {property.statusText || property.approvalInfo}
                    </span>
                  )}
                </div>
              )}

              <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 text-white leading-tight">
                {property.heroHeading || property.name}
              </h1>

              {(property.heroSubheading || property.location) && (
                <p className="text-base sm:text-lg text-white/90 font-normal mb-6 max-w-2xl flex items-center gap-2">
                  <MapPin size={18} className="text-amber-400 shrink-0" />
                  {property.heroSubheading || property.location}
                </p>
              )}

              <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3.5 pt-2">
                <button
                  type="button"
                  onClick={() => handleOpenModal("tour")}
                  className="rounded-xl bg-amber-500 hover:bg-amber-400 text-navy-950 px-7 py-3.5 text-sm font-bold shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer text-center"
                >
                  SCHEDULE A SITE VISIT
                </button>

                {property.brochureUrl && (
                  <button
                    type="button"
                    onClick={() => handleOpenModal("brochure")}
                    className="flex items-center justify-center gap-2 rounded-xl backdrop-blur-md bg-white/15 hover:bg-white/25 text-white border border-white/30 px-6 py-3.5 text-sm font-semibold transition-all cursor-pointer"
                  >
                    <Download size={16} />
                    <span>DOWNLOAD BROCHURE</span>
                  </button>
                )}

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl backdrop-blur-md bg-emerald-600/90 hover:bg-emerald-500 text-white px-6 py-3.5 text-sm font-semibold transition-all cursor-pointer"
                >
                  <MessageSquare size={16} />
                  <span>WHATSAPP US</span>
                </a>
              </div>
            </div>
          </Container>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────
          FLOATING CONVERSION BAR (Mobile Fixed Bottom / Desktop Sticky Header)
          ───────────────────────────────────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-navy-950/95 backdrop-blur-md border-t border-white/10 p-3 md:py-4 md:px-6 text-white shadow-2xl">
        <Container>
          <div className="flex items-center justify-between gap-4">
            <div className="hidden lg:flex items-center gap-6">
              {property.price && (
                <div>
                  <span className="block text-[10px] uppercase font-bold text-amber-400 tracking-wider">Project Price</span>
                  <span className="font-heading text-lg font-bold">{property.price}</span>
                </div>
              )}
              {property.price && property.location && <div className="h-8 w-px bg-white/15" />}
              {property.location && (
                <div>
                  <span className="block text-[10px] uppercase font-bold text-white/60 tracking-wider">Location</span>
                  <span className="text-xs font-semibold text-white/90">{property.location}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between w-full lg:w-auto gap-2.5">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 lg:flex-none flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 sm:px-4 py-2.5 text-xs font-bold transition-all cursor-pointer"
              >
                <MessageSquare size={15} />
                <span>WhatsApp</span>
              </a>

              {property.phone && (
                <a
                  href={`tel:${property.phone}`}
                  className="flex-1 lg:flex-none flex items-center justify-center gap-2 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/20 px-3.5 sm:px-4 py-2.5 text-xs font-bold transition-all cursor-pointer"
                >
                  <PhoneCall size={15} />
                  <span>Call Now</span>
                </a>
              )}

              <button
                type="button"
                onClick={() => handleOpenModal("tour")}
                className="flex-1 lg:flex-none flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-navy-950 px-4 sm:px-5 py-2.5 text-xs font-bold transition-all cursor-pointer"
              >
                <CalendarClock size={15} />
                <span>Book Site Visit</span>
              </button>
            </div>
          </div>
        </Container>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────
          SECTION 2 — PROJECT INTRODUCTION & HIGH-IMPACT STATS
          ───────────────────────────────────────────────────────────────────── */}
      <section ref={aboutSectionRef} className="py-16 md:py-24 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto text-center mb-16">
            <span className="inline-block text-xs font-extrabold uppercase tracking-widest text-amber-600 mb-2">
              WELCOME TO {property.name}
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-navy-950 mb-6 leading-tight">
              {property.heroHeading || property.name}
            </h2>
            {property.description && (
              <p className="text-base sm:text-lg text-text-body leading-relaxed font-normal">
                {property.description}
              </p>
            )}
          </div>

          {/* High Impact Numbers Grid (rendered only for fields with values) */}
          {(property.specA || property.specB || property.price || property.possessionDate) && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {property.specA && (
                <div className="rounded-2xl bg-surface-subtle p-6 text-center border border-divider/60">
                  <span className="block text-2xl sm:text-3xl md:text-4xl font-extrabold text-navy-950 mb-1">
                    {property.specA}
                  </span>
                  <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Configuration</span>
                </div>
              )}

              {property.specB && (
                <div className="rounded-2xl bg-surface-subtle p-6 text-center border border-divider/60">
                  <span className="block text-2xl sm:text-3xl md:text-4xl font-extrabold text-navy-950 mb-1">
                    {property.specB}
                  </span>
                  <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Area / Plot Size</span>
                </div>
              )}

              {property.price && (
                <div className="rounded-2xl bg-surface-subtle p-6 text-center border border-divider/60">
                  <span className="block text-2xl sm:text-3xl md:text-4xl font-extrabold text-amber-600 mb-1">
                    {property.price}
                  </span>
                  <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Starting Price</span>
                </div>
              )}

              {property.possessionDate && (
                <div className="rounded-2xl bg-surface-subtle p-6 text-center border border-divider/60">
                  <span className="block text-2xl sm:text-3xl md:text-4xl font-extrabold text-navy-950 mb-1">
                    {property.possessionDate}
                  </span>
                  <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Possession</span>
                </div>
              )}
            </div>
          )}
        </Container>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────
          SECTION 3 — HIGHLIGHT BADGES
          ───────────────────────────────────────────────────────────────────── */}
      {property.highlights && property.highlights.length > 0 && (
        <section className="py-12 bg-navy-950 text-white">
          <Container>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
              {property.highlights
                .filter((h) => h.label || h.value)
                .map((h, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10">
                    {h.value && <span className="block text-2xl font-extrabold text-amber-400 mb-1">{h.value}</span>}
                    {h.label && <span className="text-xs font-semibold text-white/80">{h.label}</span>}
                  </div>
                ))}
            </div>
          </Container>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────────────
          SECTION 4 — CATEGORIZED VIDEO EXPERIENCE
          ───────────────────────────────────────────────────────────────────── */}
      {property.videoExperience && property.videoExperience.length > 0 && (
        <section className="py-16 md:py-24 bg-surface-subtle/50">
          <Container>
            <div className="mb-12 text-center">
              <span className="text-xs font-extrabold uppercase tracking-widest text-amber-600 mb-2 block">
                CINEMATIC TOUR
              </span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy-950">
                Experience {property.name} in Motion
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {property.videoExperience.map((vid, idx) => (
                <div
                  key={idx}
                  className="group relative overflow-hidden rounded-2xl bg-navy-950 shadow-lg cursor-pointer"
                  onClick={() => {
                    setActiveVideoUrl(vid.videoUrl);
                    handleOpenModal("video_lightbox");
                  }}
                >
                  <div className="relative h-60 w-full">
                    {vid.posterImageUrl ? (
                      <Image src={vid.posterImageUrl} alt={vid.title || "Video tour"} fill className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="h-full w-full bg-navy-900 flex items-center justify-center">
                        <Play size={40} className="text-amber-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-500 text-navy-950 shadow-xl group-hover:scale-110 transition-transform">
                        <Play size={24} className="fill-navy-950 ml-1" />
                      </div>
                    </div>

                    {vid.category && (
                      <div className="absolute top-3 left-3 rounded-md bg-black/60 px-3 py-1 text-[11px] font-bold text-white uppercase tracking-wider backdrop-blur-sm">
                        {vid.category}
                      </div>
                    )}

                    {vid.title && (
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="font-heading text-lg font-bold text-white leading-snug">{vid.title}</h3>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────────────
          SECTION 5 — MASTER PLAN (Rendered only if imageUrl or title exists)
          ───────────────────────────────────────────────────────────────────── */}
      {property.masterPlan && (property.masterPlan.imageUrl || property.masterPlan.title) && (
        <section className="py-16 md:py-24 bg-white border-t border-divider">
          <Container>
            <div className="max-w-3xl mx-auto text-center mb-12">
              <span className="text-xs font-extrabold uppercase tracking-widest text-amber-600 mb-2 block">
                COMMUNITY LAYOUT
              </span>
              {property.masterPlan.title && (
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy-950 mb-3">
                  {property.masterPlan.title}
                </h2>
              )}
              {property.masterPlan.description && (
                <p className="text-sm text-text-muted">{property.masterPlan.description}</p>
              )}
            </div>

            {property.masterPlan.imageUrl && (
              <div className="relative overflow-hidden rounded-2xl border border-divider shadow-xl bg-surface-subtle group">
                <Image
                  src={property.masterPlan.imageUrl}
                  alt={property.masterPlan.title || "Master Plan"}
                  width={1400}
                  height={900}
                  className="w-full h-auto object-contain max-h-[75vh]"
                />
                <div className="absolute bottom-4 right-4 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setZoomedPlanImageUrl(property.masterPlan?.imageUrl || null);
                      handleOpenModal("master_plan_zoom");
                    }}
                    className="flex items-center gap-2 rounded-xl bg-navy-900/90 hover:bg-navy-900 text-white px-4 py-2.5 text-xs font-bold backdrop-blur-sm transition-all cursor-pointer"
                  >
                    <ZoomIn size={16} />
                    <span>View High-Res Master Plan</span>
                  </button>
                </div>
              </div>
            )}
          </Container>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────────────
          SECTION 6 — INTERACTIVE FLOOR PLANS / PLOT PLANS
          ───────────────────────────────────────────────────────────────────── */}
      {property.floorPlans && property.floorPlans.length > 0 && (
        <section className="py-16 md:py-24 bg-surface-subtle/50 border-t border-divider">
          <Container>
            <div className="mb-12 text-center">
              <span className="text-xs font-extrabold uppercase tracking-widest text-amber-600 mb-2 block">
                ARCHITECTURAL PLANS
              </span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy-950">
                Floor Plans & Layout Configurations
              </h2>
            </div>

            {/* Plan Selector Tabs */}
            <div className="mb-8 flex flex-wrap justify-center gap-2">
              {property.floorPlans.map((plan, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveFloorPlanIndex(idx)}
                  className={cn(
                    "px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer",
                    activeFloorPlanIndex === idx
                      ? "bg-navy-900 text-white shadow-md"
                      : "bg-white text-text-strong hover:bg-neutral-100 border border-divider"
                  )}
                >
                  {plan.name || `Plan ${idx + 1}`}
                </button>
              ))}
            </div>

            {/* Active Plan Detail View */}
            {property.floorPlans[activeFloorPlanIndex] && (
              <div className="rounded-2xl border border-divider bg-white p-6 md:p-8 shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="flex flex-col gap-4">
                  <h3 className="font-heading text-2xl font-bold text-navy-950">
                    {property.floorPlans[activeFloorPlanIndex].name}
                  </h3>

                  <div className="grid grid-cols-2 gap-4 text-xs font-medium py-4 border-y border-divider">
                    {property.floorPlans[activeFloorPlanIndex].config && (
                      <div>
                        <span className="block font-bold text-text-muted uppercase tracking-wider">Configuration</span>
                        <span className="text-sm font-bold text-navy-900">{property.floorPlans[activeFloorPlanIndex].config}</span>
                      </div>
                    )}
                    {property.floorPlans[activeFloorPlanIndex].area && (
                      <div>
                        <span className="block font-bold text-text-muted uppercase tracking-wider">Area / Plot Size</span>
                        <span className="text-sm font-bold text-navy-900">{property.floorPlans[activeFloorPlanIndex].area}</span>
                      </div>
                    )}
                    {property.floorPlans[activeFloorPlanIndex].price && (
                      <div>
                        <span className="block font-bold text-text-muted uppercase tracking-wider">Starting Price</span>
                        <span className="text-sm font-bold text-amber-600">{property.floorPlans[activeFloorPlanIndex].price}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => handleOpenModal("tour")}
                      className="rounded-xl bg-navy-900 hover:bg-amber-600 text-white px-6 py-3 text-xs font-bold transition-colors cursor-pointer"
                    >
                      Enquire For This Plan
                    </button>
                  </div>
                </div>

                {property.floorPlans[activeFloorPlanIndex].imageUrl && (
                  <div
                    className="relative overflow-hidden rounded-xl border border-divider bg-surface-subtle p-2 group cursor-pointer"
                    onClick={() => {
                      setZoomedPlanImageUrl(property.floorPlans[activeFloorPlanIndex].imageUrl);
                      handleOpenModal("floor_plan_zoom");
                    }}
                  >
                    <Image
                      src={property.floorPlans[activeFloorPlanIndex].imageUrl}
                      alt={property.floorPlans[activeFloorPlanIndex].name}
                      width={800}
                      height={600}
                      className="w-full h-auto object-contain rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="rounded-lg bg-navy-950/90 text-white px-4 py-2 text-xs font-bold flex items-center gap-2 shadow-lg">
                        <ZoomIn size={16} /> Click to Expand
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Container>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────────────
          SECTION 7 — PROJECT GALLERY
          ───────────────────────────────────────────────────────────────────── */}
      {property.gallery && property.gallery.length > 0 && (
        <section className="py-16 md:py-24 bg-white border-t border-divider">
          <Container>
            <div className="mb-12 text-center">
              <span className="text-xs font-extrabold uppercase tracking-widest text-amber-600 mb-2 block">
                PHOTOGRAPHY & ELEVATIONS
              </span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy-950">
                Project Gallery
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {property.gallery.map((img, idx) => (
                <div
                  key={idx}
                  className="relative h-64 overflow-hidden rounded-2xl bg-surface-subtle group cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                  onClick={() => setActiveImageIndex(idx)}
                >
                  <Image src={img} alt={`${property.name} ${idx + 1}`} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────────────
          SECTION 8 — AMENITIES (PROMINENT & ENLARGED SIZING)
          ───────────────────────────────────────────────────────────────────── */}
      {property.amenities && property.amenities.length > 0 && (
        <section className="py-16 md:py-24 bg-surface-subtle/50 border-t border-divider">
          <Container>
            <div className="mb-14 text-center">
              <span className="text-xs font-extrabold uppercase tracking-widest text-amber-600 mb-3 block">
                WORLD-CLASS AMENITIES
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-navy-950">
                Designed for Elevated Living
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {property.amenities.map((amenity, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-5 sm:gap-6 rounded-3xl border border-divider bg-white p-6 sm:p-7 shadow-sm hover:shadow-xl hover:border-amber-400/50 transition-all duration-300"
                >
                  {amenity.image ? (
                    <div className="relative h-20 w-20 sm:h-24 sm:w-24 overflow-hidden rounded-2xl shrink-0 shadow-inner">
                      <Image src={amenity.image} alt={amenity.name} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 shrink-0">
                      <Sparkles size={32} />
                    </div>
                  )}
                  <div>
                    <span className="font-heading font-extrabold text-navy-950 text-lg sm:text-xl block leading-snug">
                      {amenity.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────────────
          SECTION 9 — LOCATION & CONNECTIVITY
          ───────────────────────────────────────────────────────────────────── */}
      {property.locationLandmarks && property.locationLandmarks.length > 0 && (
        <section className="py-16 md:py-24 bg-white border-t border-divider">
          <Container>
            <div className="mb-12 text-center">
              <span className="text-xs font-extrabold uppercase tracking-widest text-amber-600 mb-2 block">
                STRATEGIC LOCATION
              </span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy-950">
                Nearby Landmarks & Connectivity
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {property.locationLandmarks.map((lm, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-2xl border border-divider bg-surface-subtle p-5">
                  <div>
                    {lm.category && <span className="block text-[10px] font-bold uppercase tracking-wider text-amber-600">{lm.category}</span>}
                    <span className="font-bold text-navy-950 text-sm">{lm.name}</span>
                  </div>
                  {lm.distance && (
                    <span className="rounded-full bg-navy-900 text-white px-3 py-1 text-xs font-bold shrink-0 ml-2">
                      {lm.distance}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────────────
          SECTION 10 — ACTIVE OFFERS & CAMPAIGNS
          ───────────────────────────────────────────────────────────────────── */}
      {property.offers && property.offers.length > 0 && (
        <section className="py-16 bg-amber-500 text-navy-950">
          <Container>
            <div className="max-w-4xl mx-auto text-center">
              {property.offers.map((offer, idx) => (
                <div key={idx} className="flex flex-col items-center gap-4">
                  <span className="rounded-full bg-navy-950 text-amber-400 px-4 py-1 text-xs font-bold uppercase tracking-wider">
                    SPECIAL LIMITED TIME OFFER
                  </span>
                  <h2 className="font-heading text-3xl sm:text-4xl font-extrabold">{offer.title}</h2>
                  {offer.description && <p className="text-base font-semibold max-w-2xl">{offer.description}</p>}
                  {offer.validUntil && <p className="text-xs font-bold uppercase">Valid Until: {offer.validUntil}</p>}
                  <button
                    type="button"
                    onClick={() => handleOpenModal("tour")}
                    className="mt-2 rounded-xl bg-navy-950 hover:bg-navy-900 text-white px-8 py-3.5 text-sm font-bold shadow-xl transition-all cursor-pointer"
                  >
                    CLAIM OFFER & BOOK VISIT
                  </button>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────────────
          SECTION 11 — INTERACTIVE MAP LAYOUT (Isolated stacking context)
          ───────────────────────────────────────────────────────────────────── */}
      {property.mapProjectId && (
        <section ref={mapSectionRef} className="py-16 md:py-24 bg-white border-t border-divider relative z-0 isolate">
          <Container>
            <div className="mb-10 text-center">
              <span className="text-xs font-extrabold uppercase tracking-widest text-amber-600 mb-2 block">
                INTERACTIVE MASTER MAP
              </span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy-950">
                Explore Available Plots & Layout
              </h2>
            </div>

            <div className="relative z-0 isolate rounded-2xl border border-divider overflow-hidden shadow-lg h-[420px] sm:h-[500px] md:h-[580px]">
              <PropertyLocationMap projectId={property.mapProjectId} propertyName={property.name} />
            </div>
          </Container>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────────────
          SECTION 12 — LEGAL & COMPLIANCE (Only rendered if info exists)
          ───────────────────────────────────────────────────────────────────── */}
      {(property.reraNumber || property.approvalInfo || property.disclaimerText) && (
        <section className="py-12 bg-surface-subtle border-t border-divider text-xs text-text-muted">
          <Container>
            <div className="flex flex-col gap-4 max-w-4xl mx-auto">
              <div className="flex flex-wrap items-center gap-6 text-navy-900 font-bold">
                {property.reraNumber && <span>RERA Reg No: {property.reraNumber}</span>}
                {property.approvalInfo && <span>Approval: {property.approvalInfo}</span>}
              </div>
              {property.disclaimerText && <p>{property.disclaimerText}</p>}
            </div>
          </Container>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────────────
          MODALS
          ───────────────────────────────────────────────────────────────────── */}
      {modalType === "video_lightbox" && activeVideoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          <div className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
            <button
              type="button"
              onClick={handleCloseModal}
              className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
            <video src={activeVideoUrl} controls autoPlay className="h-full w-full object-contain" />
          </div>
        </div>
      )}

      {(modalType === "master_plan_zoom" || modalType === "floor_plan_zoom") && zoomedPlanImageUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          <div className="relative max-w-5xl max-h-[90vh] overflow-auto bg-white rounded-2xl p-4 shadow-2xl">
            <button
              type="button"
              onClick={handleCloseModal}
              className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-navy-950 text-white hover:bg-black transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
            <Image src={zoomedPlanImageUrl} alt="Plan View" width={1600} height={1200} className="w-full h-auto object-contain" />
          </div>
        </div>
      )}

      {(modalType === "tour" || modalType === "brochure" || modalType === "callback") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 md:p-8 shadow-2xl">
            <button
              type="button"
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-text-muted hover:text-navy-950 cursor-pointer"
            >
              <X size={20} />
            </button>

            {submitted ? (
              <div className="text-center py-6">
                <CheckCircle2 size={48} className="mx-auto text-emerald-600 mb-3" />
                <h3 className="font-heading text-2xl font-bold text-navy-950 mb-2">Thank You!</h3>
                <p className="text-sm text-text-muted mb-6">Our property expert will contact you shortly.</p>
                {modalType === "brochure" && property.brochureUrl && (
                  <button
                    type="button"
                    onClick={handleDownloadBrochure}
                    className="w-full rounded-xl bg-amber-500 hover:bg-amber-400 text-navy-950 py-3 text-xs font-bold transition-colors"
                  >
                    Download Brochure Now
                  </button>
                )}
              </div>
            ) : (
              <form onSubmit={handleGenericSubmit} className="flex flex-col gap-4">
                <h3 className="font-heading text-xl font-bold text-navy-950">
                  {modalType === "tour" ? "Schedule a Site Visit" : modalType === "brochure" ? "Download Brochure" : "Request Callback"}
                </h3>

                <input
                  type="text"
                  required
                  placeholder="Your Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  className="rounded-xl border border-divider px-4 py-3 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-navy-900"
                />

                <input
                  type="tel"
                  required
                  placeholder="Phone Number (+91)"
                  value={formData.phone}
                  onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                  className="rounded-xl border border-divider px-4 py-3 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-navy-900"
                />

                <input
                  type="email"
                  placeholder="Email Address (optional)"
                  value={formData.email}
                  onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                  className="rounded-xl border border-divider px-4 py-3 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-navy-900"
                />

                {genericSubmitError && <p className="text-xs font-semibold text-red-600">{genericSubmitError}</p>}

                <button
                  type="submit"
                  disabled={genericSubmitting}
                  className="rounded-xl bg-navy-900 hover:bg-amber-600 text-white py-3.5 text-xs font-bold transition-colors cursor-pointer"
                >
                  {genericSubmitting ? "Submitting…" : "Submit"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
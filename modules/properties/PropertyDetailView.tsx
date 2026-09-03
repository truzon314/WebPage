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
  X,
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

// Leaflet touches `window` at module load — must stay out of the SSR bundle.
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

// ─── Modal types ─────────────────────────────────────────────────────────────

type ModalType =
  | "callback"
  | "brochure"
  | "layout"
  | "tour"
  | "availability"
  | "map_unlock"
  | null;

export function PropertyDetailView({
  property,
}: PropertyDetailViewProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const { isFavorite, toggle: toggleFavorite } = useFavorites();
  const { setMapInView } = useFloatingWidgets();

  const saved = isFavorite(property.id);

  const [modalType, setModalType] = useState<ModalType>(null);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const [mapUnlocked, setMapUnlocked] = useState(() => {
    if (typeof window === "undefined") return false;
    return isMapUnlocked();
  });
  const [mapSubmitting, setMapSubmitting] = useState(false);
  const [mapSubmitError, setMapSubmitError] = useState<string | null>(null);

  const [genericSubmitting, setGenericSubmitting] = useState(false);
  const [genericSubmitError, setGenericSubmitError] =
    useState<string | null>(null);

  const [knownContact, setKnownContact] = useState<{
    name: string;
    phone: string;
    email?: string;
  } | null>(() => {
    if (typeof window === "undefined") return null;
    return getStoredVisitorContact();
  });

  const [downloadingBrochure, setDownloadingBrochure] = useState(false);

  const mapSectionRef = useRef<HTMLDivElement>(null);
  const aboutSectionRef = useRef<HTMLDivElement>(null);

  const activeImage =
    property.gallery[activeImageIndex] || property.image;

  // ─────────────────────────────────────────────────────────────────────────
  // MAP VISIBILITY / FLOATING WIDGETS
  // ─────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    const section = mapSectionRef.current;

    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setMapInView(entry.isIntersecting);
      },
      {
        threshold: 0.1,
      }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      setMapInView(false);
    };
  }, [setMapInView]);

  // ─────────────────────────────────────────────────────────────────────────
  // MODALS
  // ─────────────────────────────────────────────────────────────────────────

  function handleOpenModal(type: ModalType) {
    setModalType(type);
    setSubmitted(false);
    setMapSubmitError(null);
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
    setMapSubmitError(null);
    setGenericSubmitError(null);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SCROLL TO ABOUT
  // ─────────────────────────────────────────────────────────────────────────

  function scrollToAbout() {
    const section = aboutSectionRef.current;

    if (!section) return;

    const header = document.querySelector("header");

    const headerHeight =
      header?.getBoundingClientRect().height ?? 0;

    const top =
      section.getBoundingClientRect().top +
      window.scrollY -
      headerHeight -
      16;

    window.scrollTo({
      top,
      behavior: "smooth",
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SCROLL TO MAP / LAYOUT
  // ─────────────────────────────────────────────────────────────────────────

  function scrollToMapSection() {
    const section = mapSectionRef.current;

    if (!section) return;

    const header = document.querySelector("header");

    const headerHeight =
      header?.getBoundingClientRect().height ?? 0;

    const top =
      section.getBoundingClientRect().top +
      window.scrollY -
      headerHeight -
      16;

    window.scrollTo({
      top,
      behavior: "smooth",
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // LAYOUT
  //
  // Layout continues to use the interactive map.
  // ─────────────────────────────────────────────────────────────────────────

  function handleLayoutClick() {
    if (!property.mapProjectId) {
      handleOpenModal("layout");
      return;
    }

    if (mapUnlocked) {
      scrollToMapSection();
    } else {
      handleOpenModal("map_unlock");
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // FLOOR PLANS
  //
  // IMPORTANT:
  // Floor Plans does NOT scroll to the map.
  // It asks for contact details and then shows Coming Soon.
  // ─────────────────────────────────────────────────────────────────────────

  function handleFloorPlansClick() {
    handleOpenModal("availability");
  }

  // ─────────────────────────────────────────────────────────────────────────
  // GENERIC FORM SUBMISSION
  // ─────────────────────────────────────────────────────────────────────────

  async function handleGenericSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setGenericSubmitError(null);

    // ─────────────────────────────────────────────────────────────
    // BROCHURE
    // ─────────────────────────────────────────────────────────────

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
        setGenericSubmitError(
          err instanceof Error
            ? err.message
            : "Could not submit — please try again."
        );
      } finally {
        setGenericSubmitting(false);
      }

      return;
    }

    // ─────────────────────────────────────────────────────────────
    // FLOOR PLANS
    //
    // We collect the user's details.
    //
    // We deliberately DO NOT:
    // - unlock the map
    // - set mapUnlocked
    // - call scrollToMapSection()
    //
    // After submission, the modal simply shows "Coming Soon".
    // ─────────────────────────────────────────────────────────────

    if (modalType === "availability") {
      setGenericSubmitting(true);

      try {
        await submitForm("map_unlock", {
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

        // IMPORTANT:
        // Do NOT unlock the map.
        // Do NOT scroll.
        // Only show the Coming Soon state.
        setSubmitted(true);
      } catch (err) {
        setGenericSubmitError(
          err instanceof Error
            ? err.message
            : "Could not submit — please try again."
        );
      } finally {
        setGenericSubmitting(false);
      }

      return;
    }

    // ─────────────────────────────────────────────────────────────
    // OTHER REQUESTS
    // ─────────────────────────────────────────────────────────────

    setSubmitted(true);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // BROCHURE DOWNLOAD
  // ─────────────────────────────────────────────────────────────────────────

  async function handleDownloadBrochure() {
    if (!property.brochureUrl || downloadingBrochure) {
      return;
    }

    setDownloadingBrochure(true);

    try {
      const res = await fetch(property.brochureUrl);

      if (!res.ok) {
        throw new Error("Download failed");
      }

      const blob = await res.blob();

      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = blobUrl;

      link.download = `${property.name.replace(
        /\s+/g,
        "-"
      )}-Brochure.pdf`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(
        property.brochureUrl,
        "_blank",
        "noopener,noreferrer"
      );
    } finally {
      setDownloadingBrochure(false);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // MAP UNLOCK SUBMISSION
  //
  // This is ONLY used by the Layout button.
  // ─────────────────────────────────────────────────────────────────────────

  async function handleMapUnlockSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setMapSubmitError(null);
    setMapSubmitting(true);

    try {
      await submitForm("map_unlock", {
        name: formData.name,
        phone: formData.phone,
        email: formData.email || undefined,
      });

      setStoredVisitorContact({
        name: formData.name,
        phone: formData.phone,
        email: formData.email || undefined,
      });

      setKnownContact({
        name: formData.name,
        phone: formData.phone,
        email: formData.email || undefined,
      });

      setMapUnlocked(true);
      setModalType(null);

      requestAnimationFrame(scrollToMapSection);
    } catch (err) {
      setMapSubmitError(
        err instanceof Error
          ? err.message
          : "Could not submit the form — please try again."
      );
    } finally {
      setMapSubmitting(false);
    }
  }

  return (
    <div className="bg-white">
      {/* ─────────────────────────────────────────────────────────────────────
          TOP SECTION
      ───────────────────────────────────────────────────────────────────── */}

      <section className="border-b border-divider bg-white pb-12 pt-6 text-navy-900 sm:pb-16">
        <Container size="wide">

          {/* Breadcrumb */}

          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-text-muted"
          >
            <Link
              href="/"
              className="transition-colors hover:text-navy-900"
            >
              Home
            </Link>

            <ChevronRight size={12} />

            <Link
              href="/projects"
              className="transition-colors hover:text-navy-900"
            >
              Projects
            </Link>

            <ChevronRight size={12} />

            <span className="font-semibold text-gold-600">
              {property.name}
            </span>
          </nav>

          {/* Hero Grid */}

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">

            {/* ───────────────────────────────────────────────────────────────
                LEFT: GALLERY
            ─────────────────────────────────────────────────────────────── */}

            <div className="lg:col-span-7 xl:col-span-8">

              {/* Main Image */}

              <div className="group relative h-[320px] w-full overflow-hidden rounded-2xl border border-gray-200 bg-surface-subtle shadow-md sm:h-[440px]">
                {activeImage ? (
                  <Image
                    src={activeImage}
                    alt={`${property.name} photo ${
                      activeImageIndex + 1
                    }`}
                    fill
                    priority
                    sizes="(min-width: 1024px) 60vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center bg-surface-subtle p-6 text-center">
                    <p className="text-sm font-medium text-text-muted">
                      Drop the main photo of {property.name}
                    </p>
                  </div>
                )}

                <div className="absolute bottom-4 right-4 rounded-full border border-navy-800 bg-navy-900/85 px-3 py-1 text-xs font-semibold text-white shadow-sm backdrop-blur-md">
                  {activeImageIndex + 1} /{" "}
                  {property.gallery.length}
                </div>
              </div>

              {/* Thumbnails */}

              <div className="mt-4 grid grid-cols-4 gap-3">
                {property.gallery.slice(0, 4).map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={cn(
                      "group relative flex cursor-pointer flex-col items-center overflow-hidden rounded-xl border bg-surface-subtle p-1 transition-all",
                      activeImageIndex === idx
                        ? "border-gold-500 shadow-sm ring-2 ring-gold-500"
                        : "border-gray-200 opacity-90 hover:border-gray-400 hover:opacity-100"
                    )}
                  >
                    <div className="relative h-16 w-full overflow-hidden rounded-lg sm:h-20">
                      <Image
                        src={img}
                        alt={`Photo ${idx + 1}`}
                        fill
                        sizes="20vw"
                        className="object-cover"
                      />
                    </div>

                    <span className="mt-1 text-[11px] font-semibold text-navy-900">
                      Photo {idx + 1}
                    </span>
                  </button>
                ))}
              </div>

              {/* ─────────────────────────────────────────────────────────────
                  ACTION BUTTONS
              ───────────────────────────────────────────────────────────── */}

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">

                {/* ABOUT */}

                <button
                  type="button"
                  onClick={scrollToAbout}
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-3 text-xs font-bold text-navy-900 shadow-sm transition-all hover:border-gold-500 hover:bg-gold-50"
                >
                  <Compass
                    size={15}
                    className="text-gold-500"
                  />

                  <span>About</span>
                </button>

                {/* LAYOUT */}

                <button
                  type="button"
                  onClick={handleLayoutClick}
                  className={cn(
                    "flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-3 py-3 text-xs font-bold shadow-sm transition-all",
                    property.mapProjectId
                      ? "border-emerald-300 bg-emerald-50 text-emerald-800 hover:border-emerald-400 hover:bg-emerald-100"
                      : "border-gray-200 bg-white text-navy-900 hover:border-gold-500 hover:bg-gold-50"
                  )}
                >
                  <Compass
                    size={15}
                    className={
                      property.mapProjectId
                        ? "text-emerald-600"
                        : "text-gold-500"
                    }
                  />

                  <span>Layout</span>
                </button>

                {/* VIRTUAL TOUR */}

                <button
                  type="button"
                  onClick={() => handleOpenModal("tour")}
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-3 text-xs font-bold text-navy-900 shadow-sm transition-all hover:border-gold-500 hover:bg-gold-50"
                >
                  <Eye
                    size={15}
                    className="text-gold-500"
                  />

                  <span>Virtual Tour</span>
                </button>

                {/* FLOOR PLANS */}

                <button
                  type="button"
                  onClick={handleFloorPlansClick}
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-3 text-xs font-bold text-navy-900 shadow-sm transition-all hover:border-gold-500 hover:bg-gold-50"
                >
                  <CalendarClock
                    size={15}
                    className="text-gold-500"
                  />

                  <span>Floor Plans</span>
                </button>
              </div>

              {property.mapProjectId && (
                <p className="mt-3 flex items-center gap-1.5 text-[11px] text-emerald-700">
                  <CheckCircle2 size={11} />

                  Interactive floor plans available — click
                  Layout to explore.
                </p>
              )}
            </div>

            {/* ───────────────────────────────────────────────────────────────
                RIGHT: PROPERTY INFO CARD
            ─────────────────────────────────────────────────────────────── */}

            <div className="lg:col-span-5 xl:col-span-4">
              <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-6 text-navy-900 shadow-xl sm:p-8">

                {/* Badges & Save */}

                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">

                    <span
                      className="rounded px-3 py-1 text-xs font-bold uppercase tracking-wider text-white"
                      style={{
                        backgroundColor:
                          property.tagBg || "#5f9c3a",
                        color:
                          property.tagColor || "#ffffff",
                      }}
                    >
                      {property.tagText || "EXCLUSIVE"}
                    </span>

                    <span className="rounded bg-surface-muted px-3 py-1 text-xs font-semibold text-navy-900">
                      {property.statusText ||
                        "Ready to Move"}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      toggleFavorite(property.id)
                    }
                    aria-label={
                      saved
                        ? "Saved"
                        : "Save property"
                    }
                    className={cn(
                      "flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-all",
                      saved
                        ? "border-red-200 bg-red-50 text-red-600"
                        : "border-gray-300 text-gray-700 hover:border-gray-400"
                    )}
                  >
                    <Heart
                      size={14}
                      className={cn(
                        saved
                          ? "fill-red-600 text-red-600"
                          : "text-gray-500"
                      )}
                    />

                    <span>
                      {saved ? "Saved" : "Save"}
                    </span>
                  </button>
                </div>

                {/* Title */}

                <h1 className="mt-5 font-heading text-2xl font-bold text-navy-900 sm:text-3xl">
                  {property.name}
                </h1>

                {/* Location */}

                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-text-muted">
                  <MapPin
                    size={14}
                    className="shrink-0 text-gold-500"
                  />

                  <span>{property.location}</span>
                </div>

                {/* Price */}

                <div className="my-5">
                  <span className="font-heading text-3xl font-bold text-navy-900">
                    {property.price}
                  </span>
                </div>

                <hr className="my-4 border-divider" />

                {/* Specs */}

                <div className="grid grid-cols-2 gap-4 py-2">
                  <div>
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-text-muted">
                      TYPE
                    </span>

                    <span className="mt-0.5 block text-sm font-bold text-navy-900">
                      {property.specA ||
                        property.type}
                    </span>
                  </div>

                  <div>
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-text-muted">
                      AREA
                    </span>

                    <span className="mt-0.5 block text-sm font-bold text-navy-900">
                      {property.specB ||
                        `${property.areaSqft} Sq.Ft`}
                    </span>
                  </div>
                </div>

                {/* CTA BUTTONS */}

                <div className="mt-6 flex flex-col gap-3">

                  {/* CALLBACK */}

                  <button
                    type="button"
                    onClick={() =>
                      handleOpenModal("callback")
                    }
                    className="w-full cursor-pointer rounded-lg bg-gold-500 px-4 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-navy-950 shadow-md transition-all hover:bg-gold-400 active:scale-[0.99]"
                  >
                    REQUEST A CALLBACK
                  </button>

                  {/* DOWNLOAD BROCHURE */}

                  <button
                    type="button"
                    onClick={() =>
                      handleOpenModal("brochure")
                    }
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-navy-900 px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-navy-900 transition-all hover:bg-navy-900 hover:text-white"
                  >
                    <Download size={15} />

                    <span>
                      Download Brochure
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────
          ABOUT + AMENITIES
      ───────────────────────────────────────────────────────────────────── */}

      <section
        ref={aboutSectionRef}
        id="about"
        className="scroll-mt-24 bg-white py-14 sm:py-18"
      >
        <Container size="wide">
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-16">

            {/* ABOUT */}

            <div className="lg:col-span-7">
              <h2 className="font-heading text-2xl font-bold text-navy-900 sm:text-3xl">
                About this property
              </h2>

              <p className="mt-4 text-[15px] leading-relaxed text-text-body sm:text-base">
                {property.description}
              </p>
            </div>

            {/* AMENITIES */}

            <div className="lg:col-span-5">
              <h2 className="font-heading text-2xl font-bold text-navy-900 sm:text-3xl">
                Amenities
              </h2>

              <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {property.amenities.map(
                  (item, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2.5"
                    >
                      <CheckCircle2
                        size={18}
                        className="shrink-0 text-success"
                      />

                      <span className="text-sm font-medium text-navy-900">
                        {item.name}
                      </span>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────
          AMENITIES GRID
      ───────────────────────────────────────────────────────────────────── */}

      <section className="border-t border-divider bg-surface-subtle py-14 sm:py-18">
        <Container size="wide">
          <h2 className="font-heading text-2xl font-bold text-navy-900 sm:text-3xl">
            Amenities at {property.name}
          </h2>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {property.amenities.map(
              (item, idx) => (
                <div
                  key={idx}
                  className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
                >
                  <div className="relative h-[180px] w-full overflow-hidden bg-surface-subtle">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : null}
                  </div>

                  <div className="flex items-center gap-2.5 border-t border-gray-100 bg-white p-4">
                    <CheckCircle2
                      size={18}
                      className="shrink-0 text-success"
                    />

                    <span className="text-sm font-bold text-navy-900">
                      {item.name}
                    </span>
                  </div>
                </div>
              )
            )}
          </div>
        </Container>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────
          SITE LAYOUT / FLOOR PLANS
          
          This section is ONLY for the Layout button.
          
          Floor Plans button does NOT scroll here.
      ───────────────────────────────────────────────────────────────────── */}

      {property.mapProjectId && (
        <section
          ref={mapSectionRef}
          className="border-t border-divider bg-white py-14 sm:py-18"
        >
          <Container size="wide">
            <h2 className="font-heading text-2xl font-bold text-navy-900 sm:text-3xl">
              Floor Plans
            </h2>

            {mapUnlocked ? (
              <>
                <p className="mt-2 text-sm text-text-body">
                  Explore the floor plans and plot layout below —
                  click any plot for details.
                </p>

                <div className="mt-6">
                  <PropertyLocationMap
                    projectId={property.mapProjectId}
                  />
                </div>
              </>
            ) : (
              <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-surface-subtle px-6 py-16 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-navy-900/5">
                  <Lock
                    size={22}
                    className="text-navy-900"
                  />
                </div>

                <h3 className="mt-4 font-heading text-lg font-bold text-navy-900">
                  Unlock the floor plans
                </h3>

                <p className="mt-2 max-w-md text-sm text-text-body">
                  Share your contact details once to view
                  the interactive floor plans and unit
                  availability for{" "}
                  {property.name}.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    handleOpenModal("map_unlock")
                  }
                  className="mt-6 cursor-pointer rounded-lg bg-gold-500 px-6 py-3 text-xs font-bold uppercase tracking-wider text-navy-950 shadow-md transition-all hover:bg-gold-400"
                >
                  View Floor Plans
                </button>
              </div>
            )}
          </Container>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────────────
          LEAD FORM / MODALS
      ───────────────────────────────────────────────────────────────────── */}

      {modalType && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-navy-950/75 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 text-navy-900 shadow-2xl sm:p-8">

            {/* CLOSE */}

            <button
              type="button"
              onClick={handleCloseModal}
              aria-label="Close modal"
              className="absolute right-4 top-4 cursor-pointer text-gray-400 hover:text-navy-900"
            >
              <X size={20} />
            </button>

            {/* ───────────────────────────────────────────────────────────────
                MAP UNLOCK MODAL
            ─────────────────────────────────────────────────────────────── */}

            {modalType === "map_unlock" ? (
              <div>
                <h3 className="font-heading text-xl font-bold text-navy-900">
                  Unlock Floor Plans
                </h3>

                <p className="mt-1 text-xs text-text-muted">
                  Enter your contact details to view the
                  interactive floor plans for{" "}
                  <span className="font-semibold text-navy-900">
                    {property.name}
                  </span>
                  .
                </p>

                <form
                  onSubmit={handleMapUnlockSubmit}
                  className="mt-5 flex flex-col gap-4"
                >
                  {/* NAME */}

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-navy-900">
                      Full Name *
                    </label>

                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          name: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-navy-900 focus:border-gold-500 focus:outline-none"
                    />
                  </div>

                  {/* PHONE */}

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-navy-900">
                      Phone Number *
                    </label>

                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phone: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-navy-900 focus:border-gold-500 focus:outline-none"
                    />
                  </div>

                  {/* EMAIL */}

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-navy-900">
                      Email Address
                    </label>

                    <input
                      type="email"
                      placeholder="rahul@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          email: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-navy-900 focus:border-gold-500 focus:outline-none"
                    />
                  </div>

                  {mapSubmitError && (
                    <p className="text-xs font-medium text-red-600">
                      {mapSubmitError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={mapSubmitting}
                    className="mt-2 w-full cursor-pointer rounded-lg bg-gold-500 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-navy-950 shadow-md transition-all hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {mapSubmitting
                      ? "Submitting..."
                      : "View Floor Plans"}
                  </button>
                </form>
              </div>
            ) : (
              <>
                {/* ─────────────────────────────────────────────────────────
                    SUCCESS STATE
                ───────────────────────────────────────────────────────── */}

                {submitted ? (
                  <div className="py-6 text-center">
                    <CheckCircle2
                      size={48}
                      className="mx-auto mb-3 text-success"
                    />

                    <h3 className="font-heading text-xl font-bold text-navy-900">
                      {modalType === "availability" ||
                      modalType === "layout" ||
                      modalType === "tour"
                        ? "Coming Soon"
                        : modalType === "brochure"
                        ? "Your Brochure is Ready!"
                        : "Request Received!"}
                    </h3>

                    <p className="mt-2 text-sm text-text-body">
                      {modalType === "availability" ||
                      modalType === "layout" ||
                      modalType === "tour" ? (
                        <>
                          Thank you for your interest in{" "}
                          <span className="font-semibold">
                            {property.name}
                          </span>
                          . Our floor plan information is
                          currently being prepared and will be
                          available soon.
                        </>
                      ) : modalType === "brochure" ? (
                        <>
                          Thanks for your interest in{" "}
                          <span className="font-semibold">
                            {property.name}
                          </span>{" "}
                          — click below to download the
                          brochure.
                        </>
                      ) : (
                        <>
                          Thank you for your interest in{" "}
                          <span className="font-semibold">
                            {property.name}
                          </span>
                          . One of our Senior Consultants
                          will get in touch with you shortly.
                        </>
                      )}
                    </p>

                    {/* DOWNLOAD AFTER SUBMISSION */}

                    {modalType === "brochure" &&
                    property.brochureUrl ? (
                      <button
                        type="button"
                        onClick={handleDownloadBrochure}
                        disabled={downloadingBrochure}
                        className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-gold-500 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-navy-950 shadow-md transition-all hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Download size={15} />

                        {downloadingBrochure
                          ? "Preparing..."
                          : "Download Brochure"}
                      </button>
                    ) : null}

                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className={cn(
                        "w-full cursor-pointer rounded-lg bg-navy-900 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-navy-800",
                        modalType === "brochure" &&
                          property.brochureUrl
                          ? "mt-3"
                          : "mt-6"
                      )}
                    >
                      Close Window
                    </button>
                  </div>
                ) : (
                  /* ─────────────────────────────────────────────────────────
                      STANDARD MODAL
                  ───────────────────────────────────────────────────────── */

                  <div>
                    <h3 className="font-heading text-xl font-bold text-navy-900">
                      {modalType === "brochure" &&
                        "Download Brochure"}

                      {modalType === "layout" &&
                        "View Master Layout"}

                      {modalType === "tour" &&
                        "Request Virtual Tour"}

                      {modalType === "availability" &&
                        "Floor Plans"}

                      {modalType === "callback" &&
                        "Request a Callback"}
                    </h3>

                    <p className="mt-1 text-xs text-text-muted">
                      {modalType === "availability" ? (
                        <>
                          Enter your contact details to get
                          information about the floor plans for{" "}
                          <span className="font-semibold text-navy-900">
                            {property.name}
                          </span>
                          .
                        </>
                      ) : knownContact ? (
                        "We already have your contact details on file."
                      ) : (
                        <>
                          Enter your contact details to receive
                          instant access for{" "}
                          <span className="font-semibold text-navy-900">
                            {property.name}
                          </span>
                          .
                        </>
                      )}
                    </p>

                    <form
                      onSubmit={handleGenericSubmit}
                      className="mt-5 flex flex-col gap-4"
                    >
                      {knownContact ? (
                        <p className="rounded-lg bg-surface-muted px-3.5 py-3 text-xs text-text-body">
                          Sending as{" "}
                          <span className="font-semibold text-navy-900">
                            {knownContact.name}
                          </span>
                          , {knownContact.phone}.
                        </p>
                      ) : (
                        <>
                          {/* NAME */}

                          <div>
                            <label className="mb-1 block text-xs font-semibold text-navy-900">
                              Full Name *
                            </label>

                            <input
                              type="text"
                              required
                              placeholder="e.g. Rahul Sharma"
                              value={formData.name}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  name: e.target.value,
                                })
                              }
                              className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-navy-900 focus:border-gold-500 focus:outline-none"
                            />
                          </div>

                          {/* PHONE */}

                          <div>
                            <label className="mb-1 block text-xs font-semibold text-navy-900">
                              Phone Number *
                            </label>

                            <input
                              type="tel"
                              required
                              placeholder="+91 98765 43210"
                              value={formData.phone}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  phone: e.target.value,
                                })
                              }
                              className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-navy-900 focus:border-gold-500 focus:outline-none"
                            />
                          </div>

                          {/* EMAIL */}

                          <div>
                            <label className="mb-1 block text-xs font-semibold text-navy-900">
                              Email Address
                            </label>

                            <input
                              type="email"
                              placeholder="rahul@example.com"
                              value={formData.email}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  email: e.target.value,
                                })
                              }
                              className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-navy-900 focus:border-gold-500 focus:outline-none"
                            />
                          </div>
                        </>
                      )}

                      {genericSubmitError ? (
                        <p className="text-xs font-medium text-red-600">
                          {genericSubmitError}
                        </p>
                      ) : null}

                      <button
                        type="submit"
                        disabled={
                          (modalType === "brochure" ||
                            modalType === "availability") &&
                          genericSubmitting
                        }
                        className="mt-2 w-full cursor-pointer rounded-lg bg-gold-500 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-navy-950 shadow-md transition-all hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {genericSubmitting
                          ? "Submitting..."
                          : modalType === "brochure"
                          ? "Get Brochure"
                          : modalType === "availability"
                          ? "Submit Details"
                          : "Submit Request"}
                      </button>
                    </form>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { CONTACT_INFO } from "@/lib/constants/navigation";
import { useFloatingWidgets } from "@/modules/layout/FloatingWidgetsContext";
import { cn } from "@/lib/utils";

export function WhatsAppButton({
  whatsappHref,
}: {
  whatsappHref?: string;
}) {
  const { mapInView } = useFloatingWidgets();

  return (
    <motion.a
      href={whatsappHref ?? CONTACT_INFO.whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      aria-hidden={mapInView}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.96 }}
      className={cn(
        // Mobile: bottom-left corner, opposite the chat/message button.
        // Desktop: bottom-right corner.
        "fixed bottom-[calc(26px+env(safe-area-inset-bottom))] left-[26px] z-50 flex h-[54px] w-[54px] items-center justify-center rounded-full bg-whatsapp shadow-[0_6px_18px_rgba(0,0,0,0.25)] transition-opacity duration-200 lg:bottom-[26px] lg:left-auto lg:right-[26px]",
        mapInView
          ? "pointer-events-none opacity-0"
          : "opacity-100"
      )}
    >
      <Image
        src="/icons/whatsapp.svg"
        alt=""
        width={28}
        height={28}
        priority
      />
    </motion.a>
  );
}
"use client";

import { motion } from "framer-motion";
import { CONTACT_INFO } from "@/lib/constants/navigation";
import { useFloatingWidgets } from "@/modules/layout/FloatingWidgetsContext";
import { cn } from "@/lib/utils";

const WHATSAPP_PATH =
  "M12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.4A10 10 0 1 0 12 2zm0 18.2a8.1 8.1 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.7.8-.8 1-.1.2-.3.2-.5.1-1.3-.6-2.2-1.1-3.1-2.6-.2-.4.2-.4.6-1.2.1-.1 0-.3 0-.4-.1-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.2-1 1-1 2.3 0 1.4 1 2.7 1.1 2.9.1.2 2 3.1 4.9 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.1-1.2-.1-.1-.3-.2-.5-.3z";

export function WhatsAppButton({ whatsappHref }: { whatsappHref?: string }) {
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
        // Mobile: bottom-left corner, opposite the chat/message button
        // (LiveChatWidget.tsx), so the two read as separate actions
        // instead of stacked on the same side. Desktop keeps its
        // original bottom-right corner, untouched.
        "fixed bottom-[calc(26px+env(safe-area-inset-bottom))] left-[26px] z-50 flex h-[54px] w-[54px] items-center justify-center rounded-full bg-whatsapp shadow-[0_6px_18px_rgba(0,0,0,0.25)] transition-opacity duration-200 lg:bottom-[26px] lg:left-auto lg:right-[26px]",
        mapInView ? "pointer-events-none opacity-0" : "opacity-100"
      )}
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="#ffffff" aria-hidden="true">
        <path d={WHATSAPP_PATH} />
      </svg>
    </motion.a>
  );
}

"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Send, X } from "lucide-react";

/**
 * Reconstructed placeholder for the original site's `LiveChat` widget import
 * (not included in the Home page bundle). Provides the same fixed bubble
 * footprint (60x60, stacked above the WhatsApp button) with a lightweight,
 * non-functional chat panel UI.
 */
export function LiveChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-[98px] right-[26px] z-[60] flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-label="Live chat"
            className="w-[300px] overflow-hidden rounded-xl border border-divider bg-surface shadow-[0_20px_50px_rgba(10,18,36,0.3)]"
          >
            <div className="bg-navy-950 px-5 py-4 text-white">
              <div className="font-heading text-[15px] font-bold">Chat with Truzon Homes</div>
              <div className="text-xs text-white/70">Our team typically replies within minutes</div>
            </div>
            <div className="flex flex-col gap-2 px-5 py-4 text-sm text-text-body">
              <p>Hi there! How can we help with your property search today?</p>
            </div>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex items-center gap-2 border-t border-divider px-3 py-3"
            >
              <input
                type="text"
                placeholder="Type a message…"
                className="min-w-0 flex-1 rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-gold-400"
              />
              <button
                type="submit"
                aria-label="Send message"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-gold-400 text-navy-900 hover:bg-gold-500 cursor-pointer"
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close live chat" : "Open live chat"}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.96 }}
        className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-navy-800 text-white shadow-[0_6px_18px_rgba(0,0,0,0.25)] cursor-pointer"
      >
        {open ? <X size={26} /> : <MessageCircle size={26} />}
      </motion.button>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Send, X } from "lucide-react";
import { getMessages, postVisitorMessage, type VisitorContact } from "@/modules/chat/api";
import type { ChatMessage } from "@/modules/chat/types";
import { getStoredVisitorContact, setStoredVisitorContact } from "@/modules/leads/visitorContact";
import { useFloatingWidgets } from "@/modules/layout/FloatingWidgetsContext";
import { cn } from "@/lib/utils";

// Mirrors PropertyDetailView.tsx's `map_unlock_granted` pattern — a returning
// visitor resumes their same thread instead of starting a new conversation
// on every page load.
const CONVERSATION_ID_KEY = "chat_conversation_id";
const POLL_MS = 4_000;

export function LiveChatWidget() {
  const { mapInView } = useFloatingWidgets();
  const [open, setOpen] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactError, setContactError] = useState("");
  const [knownContact, setKnownContact] = useState<VisitorContact | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // No stored conversation yet AND no contact details captured elsewhere
  // (e.g. a property's "View Availability" unlock form) means this visitor
  // hasn't been identified — the pre-chat fields collect that once,
  // alongside their first message. A visitor who already gave their
  // details somewhere else on the site skips straight to chatting.
  const needsContactForm = !conversationId && !knownContact;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(CONVERSATION_ID_KEY);
    if (stored) setConversationId(stored);
    setKnownContact(getStoredVisitorContact());
  }, []);

  // The widget stays mounted for the whole session, so a visitor who
  // unlocks a property's site layout (and gets identified) *after* first
  // load needs a fresh read here — otherwise re-opening chat would still
  // show the now-redundant pre-chat form.
  useEffect(() => {
    if (open) setKnownContact(getStoredVisitorContact());
  }, [open]);

  useEffect(() => {
    if (!open || !conversationId) return;
    let cancelled = false;

    const poll = async () => {
      try {
        const latest = await getMessages(conversationId);
        if (!cancelled) setMessages(latest);
      } catch {
        // Transient network hiccups shouldn't surface as errors in a
        // background poll — the next tick will just retry.
      }
    };

    poll();
    const interval = window.setInterval(poll, POLL_MS);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [open, conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ block: "nearest" });
  }, [messages.length]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = input.trim();
    if (!body || sending) return;

    let contact: VisitorContact | undefined;
    let freshlyCaptured = false;
    if (!conversationId) {
      if (knownContact) {
        contact = knownContact;
      } else if (contactName.trim() && contactPhone.trim()) {
        contact = { name: contactName.trim(), phone: contactPhone.trim(), email: contactEmail.trim() || undefined };
        freshlyCaptured = true;
      } else {
        setContactError("Please add your name and phone number.");
        return;
      }
    }

    setContactError("");
    setSending(true);
    setInput("");
    try {
      const result = await postVisitorMessage(conversationId, body, contact);
      setMessages(result.messages);
      if (!conversationId) {
        setConversationId(result.conversationId);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(CONVERSATION_ID_KEY, result.conversationId);
        }
        if (contact && freshlyCaptured) {
          setStoredVisitorContact(contact);
          setKnownContact(contact);
        }
      }
    } catch {
      // Leave the visitor's typed text as-is on failure so they don't lose it.
      setInput(body);
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      aria-hidden={mapInView}
      className={cn(
        "fixed bottom-[calc(98px+env(safe-area-inset-bottom))] right-[26px] z-[60] flex flex-col items-end gap-3 transition-opacity duration-200 lg:bottom-[98px]",
        mapInView ? "pointer-events-none opacity-0" : "opacity-100"
      )}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-label="Live chat"
            className="flex w-[300px] flex-col overflow-hidden rounded-xl border border-divider bg-surface shadow-[0_20px_50px_rgba(10,18,36,0.3)]"
          >
            <div className="bg-navy-950 px-5 py-4 text-white">
              <div className="font-heading text-[15px] font-bold">Chat with Truzon Homes</div>
              <div className="text-xs text-white/70">Our team typically replies within minutes</div>
            </div>

            <div className="flex max-h-[320px] min-h-[80px] flex-col gap-2 overflow-y-auto px-5 py-4 text-sm text-text-body">
              {needsContactForm ? (
                <div className="flex flex-col gap-2.5">
                  <p>Hi there! Tell us a bit about you so we can help.</p>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Your name"
                    aria-label="Your name"
                    className="rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-gold-400"
                  />
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="Phone number"
                    aria-label="Phone number"
                    className="rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-gold-400"
                  />
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="Email address (optional)"
                    aria-label="Email address"
                    className="rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-gold-400"
                  />
                  {contactError ? <p className="text-xs text-error">{contactError}</p> : null}
                </div>
              ) : messages.length === 0 ? (
                <p>Hi there! How can we help with your property search today?</p>
              ) : (
                messages.map((m) => (
                  <div
                    key={m.id}
                    className={
                      m.sender === "visitor"
                        ? "self-end rounded-lg bg-gold-400/20 px-3 py-2 text-text-body"
                        : "self-start rounded-lg bg-navy-950/5 px-3 py-2 text-text-body"
                    }
                  >
                    {m.body}
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-divider px-3 py-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message…"
                className="min-w-0 flex-1 rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-gold-400"
              />
              <button
                type="submit"
                aria-label="Send message"
                disabled={sending || !input.trim()}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-gold-400 text-navy-900 hover:bg-gold-500 disabled:opacity-50 cursor-pointer"
              >
                <Send size={18} />
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

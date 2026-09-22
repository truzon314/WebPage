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
const CHAT_MESSAGES_KEY = "chat_local_messages";
const DEFAULT_AUTO_REPLY =
  "Thank you for reaching out to Truzon Homes! Our property consultants have received your message and will connect with you shortly.";


export function LiveChatWidget() {
  const { mapInView } = useFloatingWidgets();
  const [open, setOpen] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactError, setContactError] = useState("");
  const [knownContact, setKnownContact] = useState<VisitorContact | null>(null);

  useEffect(() => {
    try {
      const savedConv = window.localStorage.getItem(CONVERSATION_ID_KEY);
      if (savedConv) setConversationId(savedConv);
      const raw = window.localStorage.getItem(CHAT_MESSAGES_KEY);
      if (raw) setMessages(JSON.parse(raw));
      setKnownContact(getStoredVisitorContact());
    } catch {
      // safe fallback
    }
  }, []);
  const [prevOpen, setPrevOpen] = useState(open);
  if (prevOpen !== open) {
    setPrevOpen(open);
    if (open) {
      const latestContact = getStoredVisitorContact();
      if (latestContact !== knownContact) {
        setKnownContact(latestContact);
      }
    }
  }
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync messages to localStorage
  useEffect(() => {
    if (messages.length > 0 && typeof window !== "undefined") {
      try {
        window.localStorage.setItem(CHAT_MESSAGES_KEY, JSON.stringify(messages));
      } catch {
        // ignore
      }
    }
  }, [messages]);

  // No stored conversation yet AND no contact details captured elsewhere
  const needsContactForm = !conversationId && !knownContact && messages.length === 0;

  const resetStaleConversation = () => {
    setConversationId(null);
    setMessages([]);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(CONVERSATION_ID_KEY);
      window.localStorage.removeItem(CHAT_MESSAGES_KEY);
    }
  };

  useEffect(() => {
    if (!open || !conversationId) return;
    let cancelled = false;

    const poll = async () => {
      try {
        const latest = await getMessages(conversationId);
        if (!cancelled && latest.length > 0) {
          setMessages(latest);
        }
      } catch (err) {
        if (err instanceof Error && (err.message.includes("not found") || err.message.includes("404"))) {
          resetStaleConversation();
        }
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
  }, [messages.length, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = input.trim();
    if (!body || sending) return;

    let contact: VisitorContact | undefined;
    let freshlyCaptured = false;
    if (!conversationId && !knownContact) {
      if (contactName.trim() && contactPhone.trim()) {
        contact = { name: contactName.trim(), phone: contactPhone.trim(), email: contactEmail.trim() || undefined };
        freshlyCaptured = true;
      } else {
        setContactError("Please add your name and phone number.");
        return;
      }
    } else if (knownContact) {
      contact = knownContact;
    }

    setContactError("");
    setSending(true);
    setInput("");

    // Optimistically add user's message
    const userMessage: ChatMessage = {
      id: `local-${Date.now()}`,
      sender: "visitor",
      body,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    if (contact && freshlyCaptured) {
      setStoredVisitorContact(contact);
      setKnownContact(contact);
    }

    try {
      let result;
      try {
        result = await postVisitorMessage(conversationId, body, contact);
      } catch (err) {
        if (conversationId && err instanceof Error && err.message.includes("not found")) {
          // Stale conversation (e.g. deleted on backend) — clear local storage and retry creating a new thread
          resetStaleConversation();
          result = await postVisitorMessage(null, body, contact);
        } else {
          throw err;
        }
      }

      if (result.conversationId) {
        setConversationId(result.conversationId);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(CONVERSATION_ID_KEY, result.conversationId);
        }
      }
      setMessages(result.messages);
    } catch (err) {
      console.error("Failed to post message:", err);
    } finally {
      setIsTyping(false);
      setSending(false);
    }
  };


  return (
    <div
      aria-hidden={mapInView}
      className={cn(
        // Mobile: bottom-right corner (WhatsApp has swapped to bottom-left,
        // WhatsAppButton.tsx) — same right-side slot as desktop, just a
        // different bottom offset so it clears WhatsApp's own row.
        "fixed bottom-[calc(26px+env(safe-area-inset-bottom))] right-[26px] z-[60] flex flex-col items-end gap-3 transition-opacity duration-200 lg:bottom-[98px]",
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
            // min(300px, ...): caps at 300px like before on desktop, but
            // shrinks on narrow phones so the panel (opening from
            // right-[26px]) can't run off the left edge of the screen
            // (100vw-52px keeps a consistent 26px margin on both sides).
            className="flex w-[min(300px,calc(100vw-52px))] flex-col overflow-hidden rounded-xl border border-divider bg-surface shadow-[0_20px_50px_rgba(10,18,36,0.3)]"
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
              {isTyping && (
                <div className="self-start flex items-center gap-1.5 rounded-lg bg-navy-950/5 px-3 py-2 text-xs text-text-muted">
                  <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-navy-800" />
                  <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-navy-800 [animation-delay:0.2s]" />
                  <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-navy-800 [animation-delay:0.4s]" />
                  <span className="ml-1 text-[11px]">Truzon Advisor is typing...</span>
                </div>
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
        className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-gold-400 text-navy-900 shadow-[0_6px_18px_rgba(0,0,0,0.25)] hover:bg-gold-500 cursor-pointer"
      >
        {open ? <X size={26} /> : <MessageCircle size={26} />}
      </motion.button>
    </div>
  );
}

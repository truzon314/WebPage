import { CMS_URL, type ApiEnvelope } from "@/lib/cms-client";
import type { ChatMessage, ChatMessageSender } from "@/modules/chat/types";

interface WireChatMessage {
  id: string;
  conversation_id: string;
  sender: ChatMessageSender;
  body: string;
  created_at: string;
}

function toChatMessage(wire: WireChatMessage): ChatMessage {
  return { id: wire.id, sender: wire.sender, body: wire.body, createdAt: wire.created_at };
}

export interface VisitorContact {
  name: string;
  phone: string;
  email?: string;
}

export async function postVisitorMessage(
  conversationId: string | null,
  body: string,
  contact?: VisitorContact
): Promise<{ conversationId: string; messages: ChatMessage[] }> {
  const res = await fetch(`${CMS_URL}/public/chat/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      conversation_id: conversationId,
      body,
      visitor_name: contact?.name,
      visitor_phone: contact?.phone,
      visitor_email: contact?.email,
    }),
  });
  const envelope = (await res.json()) as ApiEnvelope<{ conversation_id: string; messages: WireChatMessage[] }>;
  if (!res.ok || !envelope.success || !envelope.data) {
    throw new Error(envelope.error?.message ?? "Could not send your message — please try again.");
  }
  return {
    conversationId: envelope.data.conversation_id,
    messages: envelope.data.messages.map(toChatMessage),
  };
}

export async function getMessages(conversationId: string): Promise<ChatMessage[]> {
  const res = await fetch(`${CMS_URL}/public/chat/conversations/${conversationId}/messages`, {
    cache: "no-store",
  });
  const envelope = (await res.json()) as ApiEnvelope<{ messages: WireChatMessage[] }>;
  if (!res.ok || !envelope.success || !envelope.data) {
    throw new Error(envelope.error?.message ?? "Could not load messages.");
  }
  return envelope.data.messages.map(toChatMessage);
}

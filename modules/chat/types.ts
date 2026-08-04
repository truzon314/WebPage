export type ChatMessageSender = "visitor" | "admin" | "auto";

export interface ChatMessage {
  id: string;
  sender: ChatMessageSender;
  body: string;
  createdAt: string;
}

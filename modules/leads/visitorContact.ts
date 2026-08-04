export interface StoredVisitorContact {
  name: string;
  phone: string;
  email?: string;
}

const VISITOR_CONTACT_KEY = "visitor_contact";
const MAP_UNLOCK_KEY = "map_unlock_granted";

/** Site-wide "we already know this visitor" store — filling in contact
 * details on ANY gated form (site layout unlock, live chat's pre-chat
 * fields, etc.) satisfies every other gate that needs those same details,
 * not just the one it was filled out on. */
export function getStoredVisitorContact(): StoredVisitorContact | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(VISITOR_CONTACT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredVisitorContact>;
    if (!parsed.name || !parsed.phone) return null;
    return { name: parsed.name, phone: parsed.phone, email: parsed.email };
  } catch {
    return null;
  }
}

export function setStoredVisitorContact(contact: StoredVisitorContact): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(VISITOR_CONTACT_KEY, JSON.stringify(contact));
  window.localStorage.setItem(MAP_UNLOCK_KEY, "1");
}

export function isMapUnlocked(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(MAP_UNLOCK_KEY) === "1";
}

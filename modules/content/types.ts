export interface FaqItem {
  q: string;
  a: string;
}

export interface StatEntry {
  value: string;
  label: string;
}

export interface FeatureItem {
  title: string;
  description: string;
  icon: "shield" | "handshake" | "location" | "award";
}

export interface ValueItem {
  title: string;
  description: string;
  icon: "integrity" | "craftsmanship" | "sustainability" | "clientFirst";
}

export interface Certification {
  label: string;
  icon: "dtcp" | "rera" | "igbc" | "iso";
}

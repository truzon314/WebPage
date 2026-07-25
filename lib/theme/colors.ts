/**
 * Central color theme for Truzon Homes.
 *
 * These hex values back the Tailwind tokens defined in `app/globals.css`
 * (`@theme inline`), which is where the actual `bg-*` / `text-*` / `border-*`
 * utility classes come from. This file exists for the rare cases that need a
 * raw hex string instead of a class — inline SVG `stroke`/`fill` attributes,
 * gradients built at runtime, etc. Keep the two in sync if a color changes.
 */
export const colors = {
  navy: {
    950: "#0f1c3a",
    900: "#12172b",
    800: "#16264d",
    700: "#1c2438",
    600: "#2a3452",
  },
  gold: {
    600: "#b8891f",
    500: "#c2941f",
    400: "#d4a537",
    300: "#e8c877",
    200: "#f2c869",
  },
  surface: {
    DEFAULT: "#ffffff",
    muted: "#eef1f8",
    subtle: "#f6f7fb",
  },
  border: "#e4e7ee",
  divider: "#eef0f5",
  text: {
    body: "#647087",
    muted: "#8a93a6",
    faint: "#9aa4b6",
    strong: "#5b6472",
    quote: "#3f4a5e",
  },
  success: "#5f9c3a",
  error: "#c0392b",
  whatsapp: "#25d366",
} as const;

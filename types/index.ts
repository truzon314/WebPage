// Cross-cutting types shared across domain modules (site nav/footer/header
// dropdown). Domain-specific types live with their owning module:
// modules/properties/types.ts, modules/blog/types.ts, modules/leads/types.ts,
// modules/content/types.ts.

export interface NavLink {
  label: string;
  href: string;
}

export interface FooterLinkColumn {
  title: string;
  links: NavLink[];
}

export interface GetInTouchItem {
  icon: "calendar" | "search" | "lifebuoy";
  title: string;
  description: string;
  href: string;
}

import type { CmsBlock } from "@/modules/content/api";
import { OurStory } from "@/modules/content/OurStory";
import { TeamSection } from "@/modules/content/TeamSection";
import { CTA } from "@/modules/content/CTA";
import { FAQ } from "@/modules/content/FAQ";
import { resolveMediaUrl } from "@/lib/cms-client";
import type { FaqItem } from "@/modules/content/types";
import type { JSX } from "react";

// ---------------------------------------------------------------------------
// Fallback defaults — match the per-page hardcoded defaults they replace.
// ---------------------------------------------------------------------------

const CTA_FALLBACK = {
  heading: "Ready to find your dream home?",
  description:
    "Our property consultants are available 24/7 to guide you through our exclusive inventory and investment plans.",
  button_label: "REQUEST A CALLBACK",
  button_href: "/contact",
};

// ---------------------------------------------------------------------------
// Per-type adapters — each receives a CmsBlock and returns a React element.
// Adapters are deliberately thin: they map CMS config → existing component
// props and nothing else.
// ---------------------------------------------------------------------------

type BlockAdapter = (block: CmsBlock) => JSX.Element;

function renderTextBlock(block: CmsBlock): JSX.Element {
  const { heading, body, image_url, featured_image_url, image } =
    block.config;

  const paragraphs: string[] | undefined = body
    ?.split("\n\n")
    .map((p: string) => p.trim())
    .filter(Boolean);

  const storyImage = resolveMediaUrl(
    image_url || featured_image_url || image
  );

  return <OurStory heading={heading} paragraphs={paragraphs} image={storyImage} />;
}

function renderTeamBlock(block: CmsBlock): JSX.Element {
  return (
    <TeamSection heading={block.config.heading} members={block.config.members} />
  );
}

function renderCtaBlock(block: CmsBlock): JSX.Element {
  const cta = { ...CTA_FALLBACK, ...block.config };
  return (
    <CTA
      title={cta.heading}
      description={cta.description}
      primaryLabel={cta.button_label}
      primaryHref={cta.button_href}
      showPhoneLink={false}
    />
  );
}

function renderFaqBlock(block: CmsBlock): JSX.Element {
  return (
    <FAQ
      heading={block.config.heading}
      items={block.config.items as FaqItem[] | undefined}
    />
  );
}

// ---------------------------------------------------------------------------
// Registry — add new CMS block types here as they get public components.
// ---------------------------------------------------------------------------

const BLOCK_RENDERERS: Record<string, BlockAdapter> = {
  text: renderTextBlock,
  team: renderTeamBlock,
  cta: renderCtaBlock,
  faq: renderFaqBlock,
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface CmsBlockRendererProps {
  blocks: CmsBlock[];
  /**
   * Optional overrides keyed by block.type.  When provided the override
   * replaces the default adapter for that type entirely.  This lets page-
   * specific code customise a single block (e.g. pass extra props like
   * `phoneDisplay` to CTA on the home page) without duplicating the whole
   * renderer.
   */
  overrides?: Record<string, BlockAdapter>;
}

/**
 * Iterates through CMS page blocks **in position order** and renders the
 * matching public component for each.  Unknown block types are reported via
 * a console warning _and_ a hidden HTML comment so they surface during
 * development without breaking production.
 */
export function CmsBlockRenderer({
  blocks,
  overrides,
}: CmsBlockRendererProps) {
  const sorted = [...blocks].sort((a, b) => a.position - b.position);

  return (
    <>
      {sorted.map((block) => {
        const adapter =
          overrides?.[block.type] ?? BLOCK_RENDERERS[block.type];

        if (!adapter) {
          if (process.env.NODE_ENV !== "production") {
            console.warn(
              `[CmsBlockRenderer] No renderer registered for block type "${block.type}" (id: ${block.id}). ` +
                `Register one in BLOCK_RENDERERS or pass an override.`
            );
          }

          return (
            <div
              key={block.id}
              data-cms-block-type={block.type}
              data-cms-block-id={block.id}
              hidden
            >
              {/* CMS block type "{block.type}" has no public renderer yet */}
            </div>
          );
        }

        return (
          <div key={block.id} data-cms-block-type={block.type}>
            {adapter(block)}
          </div>
        );
      })}
    </>
  );
}

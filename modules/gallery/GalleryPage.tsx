import Image from "next/image";
import { Container } from "@/components/ui/Container";
import type { CmsGalleryItem } from "@/modules/gallery/api";

export function GalleryPage({ items }: { items: CmsGalleryItem[] }) {
  if (items.length === 0) {
    return (
      <Container className="py-20 text-center">
        <p className="text-[15px] text-text-body">Photo and video tours of our completed projects are coming soon.</p>
      </Container>
    );
  }

  return (
    <Container className="py-16 lg:py-[90px]">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <figure
            key={item.id}
            className="overflow-hidden rounded-xl border border-border bg-surface shadow-[0_2px_10px_rgba(18,23,43,0.05)]"
          >
            <div className="relative aspect-[4/3] w-full bg-surface-muted">
              {item.image_url ? (
                <Image
                  src={item.image_url}
                  alt={item.caption ?? ""}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              ) : null}
            </div>
            {item.caption ? <figcaption className="px-4 py-3 text-sm text-text-body">{item.caption}</figcaption> : null}
          </figure>
        ))}
      </div>
    </Container>
  );
}

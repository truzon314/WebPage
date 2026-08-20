import Image from "next/image";
import { resolveMediaUrl } from "@/lib/cms-client";

interface TeamMember {
  name?: string;
  role?: string;
  photo_url?: string | null;
  photo_media_id?: string | null;
  bio?: string;
}

interface TeamSectionProps {
  heading?: string;
  members?: TeamMember[];
}

export function TeamSection({
  heading,
  members = [],
}: TeamSectionProps) {
  if (!members.length) {
    return null;
  }

  return (
    <section className="bg-surface-muted py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-[1400px] px-6 sm:px-10 lg:px-[60px]">
        {heading ? (
          <div className="mb-10 text-center lg:mb-14">
            <h2 className="font-heading text-3xl font-bold text-navy-900 sm:text-4xl lg:text-5xl">
              {heading}
            </h2>
          </div>
        ) : null}

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member, index) => {
            const imageUrl = resolveMediaUrl(member.photo_url);

            return (
              <article
                key={`${member.name || "member"}-${index}`}
                className="overflow-hidden rounded-2xl bg-white shadow-sm"
              >
                {imageUrl ? (
                  <div className="relative aspect-square w-full overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt={member.name || "Truzon Homes team member"}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                ) : null}

                <div className="p-6">
                  {member.name ? (
                    <h3 className="font-heading text-xl font-bold text-navy-900">
                      {member.name}
                    </h3>
                  ) : null}

                  {member.role ? (
                    <p className="mt-1 text-sm font-semibold text-gold-600">
                      {member.role}
                    </p>
                  ) : null}

                  {member.bio ? (
                    <p className="mt-4 text-sm leading-7 text-neutral-600">
                      {member.bio}
                    </p>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
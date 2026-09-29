import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { flyPhotoSrc, type FlyPhoto } from "@/lib/fly-photos";
import { cn } from "@/lib/utils";

export function FlyPhotoCredit({ photo, className }: { photo: FlyPhoto; className?: string }) {
  if (photo.source === "permission") {
    return (
      <p className={cn("text-[0.74rem] leading-snug text-muted-foreground", className)}>
        Photo © {photo.author}, used with permission
        {photo.sourceUrl ? (
          <>
            {" · "}
            <a href={photo.sourceUrl} target="_blank" rel="noreferrer" className="underline-offset-2 hover:underline">
              {photo.title}
            </a>
          </>
        ) : null}
      </p>
    );
  }
  return (
    <p className={cn("text-[0.74rem] leading-snug text-muted-foreground", className)}>
      {/^(cc0|public domain)/i.test(photo.license) ? photo.author : `© ${photo.author}`}
      {" · "}
      {photo.licenseUrl ? (
        <a href={photo.licenseUrl} target="_blank" rel="noreferrer license" className="underline-offset-2 hover:underline">
          {photo.license}
        </a>
      ) : (
        photo.license
      )}
      {" · "}
      <a href={photo.sourceUrl} target="_blank" rel="noreferrer" className="underline-offset-2 hover:underline">
        {photo.source === "wikimedia" ? "Wikimedia Commons" : "via Openverse"}
      </a>
    </p>
  );
}

/** Small thumbnail for cards when no product image exists. */
export function FlyReferenceThumb({ photo, alt, className }: { photo: FlyPhoto; alt: string; className?: string }) {
  return (
    <div className={cn("relative aspect-[4/3] overflow-hidden bg-muted", className)}>
      <Image src={flyPhotoSrc(photo, "thumb")} alt={`${alt} (reference photo)`} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
      <Badge variant="secondary" className="absolute left-2 top-2 text-[0.7rem]">
        Reference photo
      </Badge>
    </div>
  );
}

/** Detail-page card with the full disclaimer and credits. */
export function FlyReferenceCard({ photos, flyName }: { photos: FlyPhoto[]; flyName: string }) {
  if (!photos.length) return null;
  const [hero, ...rest] = photos;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">What the pattern looks like</CardTitle>
        <CardDescription>
          Reference photos of the {flyName} tied by others
          {photos.some((p) => p.source === "permission") ? ", shared by their photographers" : ", shared under Creative Commons"}. Not our flies; our
          own product photos replace these as they are shot.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <figure className="space-y-1">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-muted">
            <Image src={flyPhotoSrc(hero, "thumb")} alt={`${flyName} reference photo`} fill sizes="(min-width: 1024px) 640px, 100vw" className="object-cover" />
          </div>
          <figcaption>
            <FlyPhotoCredit photo={hero} />
          </figcaption>
        </figure>
        {rest.length ? (
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {rest.map((p) => (
              <li key={p.url} className="space-y-1">
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-muted">
                  <Image src={flyPhotoSrc(p, "thumb")} alt={`${flyName} reference photo`} fill sizes="200px" className="object-cover" />
                </div>
                <FlyPhotoCredit photo={p} className="line-clamp-2 text-[0.7rem]" />
              </li>
            ))}
          </ul>
        ) : null}
      </CardContent>
    </Card>
  );
}

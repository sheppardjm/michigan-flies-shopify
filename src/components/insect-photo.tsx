import Image from "next/image";
import { LICENSE_LABELS, photoUrl, type InatPhoto } from "@/lib/photos";
import { cn } from "@/lib/utils";

/** Attribution line required by CC BY and CC BY-SA; shown for CC0 too for consistency. */
export function PhotoCredit({ photo, className }: { photo: InatPhoto; className?: string }) {
  const lic = LICENSE_LABELS[photo.license];
  return (
    <p className={cn("text-[11px] leading-snug text-muted-foreground", className)}>
      {photo.license === "cc0" ? photo.observer : `© ${photo.observer}`}
      {" · "}
      <a href={lic.url} target="_blank" rel="noreferrer license" className="underline-offset-2 hover:underline">
        {lic.label}
      </a>
      {" · "}
      <a href={photo.observationUrl} target="_blank" rel="noreferrer" className="underline-offset-2 hover:underline">
        iNaturalist
      </a>
      {photo.place ? ` · ${shortPlace(photo.place)}` : ""}
      {photo.observedOn ? ` · ${photo.observedOn.slice(0, 4)}` : ""}
    </p>
  );
}

function shortPlace(place: string): string {
  // "Easy St, Newport, MI, US" → "Newport, MI"
  const parts = place.split(",").map((s) => s.trim()).filter(Boolean);
  const noCountry = parts.filter((p) => !/^(US|USA|United States|CA|Canada)$/i.test(p));
  return noCountry.slice(-2).join(", ");
}

/** Square thumbnail for cards. */
export function InsectThumb({ photo, alt, className, sizes = "160px" }: { photo: InatPhoto; alt: string; className?: string; sizes?: string }) {
  return (
    <div className={cn("relative aspect-square overflow-hidden rounded-lg bg-muted", className)}>
      <Image src={photoUrl(photo, "medium")} alt={alt} fill sizes={sizes} className="object-cover" />
    </div>
  );
}

/** Photo grid with credits for detail pages. */
export function InsectGallery({ photos, alt }: { photos: InatPhoto[]; alt: string }) {
  if (!photos.length) return null;
  const [hero, ...rest] = photos;
  return (
    <div className="space-y-3">
      <figure className="space-y-1">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-muted">
          <Image src={photoUrl(hero, "large")} alt={`${alt}${hero.lifeStage ? `, ${hero.lifeStage}` : ""}`} fill sizes="(min-width: 1024px) 640px, 100vw" className="object-cover" priority />
          {hero.lifeStage ? (
            <span className="absolute left-2 top-2 rounded-md bg-background/85 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide backdrop-blur">
              {hero.lifeStage}
            </span>
          ) : null}
        </div>
        <figcaption>
          <PhotoCredit photo={hero} />
        </figcaption>
      </figure>
      {rest.length ? (
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {rest.map((p) => (
            <li key={p.photoId} className="space-y-1">
              <div className="relative aspect-square overflow-hidden rounded-lg border border-border bg-muted">
                <Image src={photoUrl(p, "medium")} alt={`${alt}${p.lifeStage ? `, ${p.lifeStage}` : ""}`} fill sizes="(min-width: 640px) 128px, 33vw" className="object-cover" />
                {p.lifeStage ? (
                  <span className="absolute left-1 top-1 rounded bg-background/85 px-1 py-0.5 text-[9px] font-medium uppercase tracking-wide backdrop-blur">
                    {p.lifeStage}
                  </span>
                ) : null}
              </div>
              <PhotoCredit photo={p} className="line-clamp-2 text-[10px]" />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

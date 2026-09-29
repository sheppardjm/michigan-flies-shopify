import Image from "next/image";
import { PhotoCredit } from "@/components/insect-photo";
import { photoUrl, type InatPhoto } from "@/lib/photos";

/** Adult and juvenile photo columns with Creative Commons credits for a species page. */
export function FishPhotos({ name, adults, juveniles }: { name: string; adults: InatPhoto[]; juveniles: InatPhoto[] }) {
  if (!adults.length && !juveniles.length) return null;
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <StageColumn label="Adult" alt={`${name}, adult`} photos={adults} />
      <StageColumn label="Juvenile" alt={`${name}, juvenile`} photos={juveniles} />
    </div>
  );
}

function StageColumn({ label, alt, photos }: { label: string; alt: string; photos: InatPhoto[] }) {
  if (!photos.length) return null;
  const [hero, ...rest] = photos;
  return (
    <div className="space-y-3">
      <figure className="space-y-1">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-muted">
          <Image src={photoUrl(hero, "large")} alt={alt} fill sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw" className="object-cover" />
          <span className="absolute left-2 top-2 rounded-md bg-background/85 px-1.5 py-0.5 text-[0.7rem] font-medium uppercase tracking-wide backdrop-blur">{label}</span>
        </div>
        <figcaption>
          <PhotoCredit photo={hero} />
        </figcaption>
      </figure>
      {rest.length ? (
        <ul className="grid grid-cols-2 gap-2">
          {rest.map((p) => (
            <li key={p.photoId} className="space-y-1">
              <div className="relative aspect-square overflow-hidden rounded-lg border border-border bg-muted">
                <Image src={photoUrl(p, "medium")} alt={alt} fill sizes="(min-width: 640px) 160px, 50vw" className="object-cover" />
              </div>
              <PhotoCredit photo={p} className="line-clamp-2 text-[0.7rem]" />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

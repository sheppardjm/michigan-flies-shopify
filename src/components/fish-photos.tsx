import Image from "next/image";
import { LightboxGroup, LightboxTrigger } from "@/components/lightbox";
import { PhotoCredit, inatLightboxPhotos } from "@/components/insect-photo";
import { photoUrl, type InatPhoto } from "@/lib/photos";

/** Adult and juvenile photo columns with Creative Commons credits for a species page. Every photo opens larger, in one set. */
export function FishPhotos({ name, adults, juveniles }: { name: string; adults: InatPhoto[]; juveniles: InatPhoto[] }) {
  if (!adults.length && !juveniles.length) return null;
  const adultAlt = `${name}, adult`;
  const juvenileAlt = `${name}, juvenile`;
  const all = [...adults.map((p) => ({ p, alt: adultAlt })), ...juveniles.map((p) => ({ p, alt: juvenileAlt }))];
  const altById = new Map(all.map(({ p, alt }) => [p.photoId, alt]));
  return (
    <LightboxGroup photos={inatLightboxPhotos(all.map(({ p }) => p), (p) => altById.get(p.photoId) ?? name)}>
      <div className="grid gap-6 sm:grid-cols-2">
        <StageColumn label="Adult" alt={adultAlt} photos={adults} offset={0} />
        <StageColumn label="Juvenile" alt={juvenileAlt} photos={juveniles} offset={adults.length} />
      </div>
    </LightboxGroup>
  );
}

function StageColumn({ label, alt, photos, offset }: { label: string; alt: string; photos: InatPhoto[]; offset: number }) {
  if (!photos.length) return null;
  const [hero, ...rest] = photos;
  return (
    <div className="space-y-3">
      <figure className="space-y-1">
        <LightboxTrigger index={offset} label={`Open larger: ${alt}`} className="rounded-xl">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-muted">
            <Image src={photoUrl(hero, "large")} alt={alt} fill sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw" className="object-cover" />
            <span className="absolute left-2 top-2 rounded-md bg-background/85 px-1.5 py-0.5 text-[0.7rem] font-medium uppercase tracking-wide backdrop-blur">{label}</span>
          </div>
        </LightboxTrigger>
        <figcaption>
          <PhotoCredit photo={hero} />
        </figcaption>
      </figure>
      {rest.length ? (
        <ul className="grid grid-cols-2 gap-2">
          {rest.map((p, i) => (
            <li key={p.photoId} className="space-y-1">
              <LightboxTrigger index={offset + i + 1} label={`Open larger: ${alt}`} className="rounded-lg">
                <div className="relative aspect-square overflow-hidden rounded-lg border border-border bg-muted">
                  <Image src={photoUrl(p, "medium")} alt={alt} fill sizes="(min-width: 640px) 160px, 50vw" className="object-cover" />
                </div>
              </LightboxTrigger>
              <PhotoCredit photo={p} className="line-clamp-2 text-[0.7rem]" />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

import Image from "next/image";
import type { FieldPhoto } from "@/data/field-photos";
import { formatTakenOn } from "@/data/field-photos";
import { cn } from "@/lib/utils";

/**
 * One of our photographs, hung on the wall as a print: a cream matte, an ink
 * edge, a soft cast shadow, and a caption in the field-guide voice with the
 * date in mono. `tilt` lets a row of prints hang a degree or two off square.
 */
export function FieldPrint({
  photo,
  className,
  tilt = 0,
  sizes = "(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 70vw",
  priority = false,
  caption = true,
}: {
  photo: FieldPhoto;
  className?: string;
  tilt?: number;
  sizes?: string;
  priority?: boolean;
  caption?: boolean;
}) {
  return (
    <figure className={cn("field-print", className)} style={{ "--tilt": `${tilt}deg` } as React.CSSProperties}>
      <div className="field-print-matte">
        <div className="field-print-image" style={{ aspectRatio: `${photo.width} / ${photo.height}` }}>
          <Image src={photo.file} alt={photo.alt} fill sizes={sizes} priority={priority} className="object-cover" style={{ objectPosition: photo.focus }} />
        </div>
        {caption ? (
          <figcaption className="field-print-caption">
            <span className="block">{photo.caption.replace(/,\s*[A-Z][a-z]+ \d{1,2}, \d{4}\.$/, ".")}</span>
            <span className="live block text-ink/70">{formatTakenOn(photo.takenOn)}</span>
          </figcaption>
        ) : null}
      </div>
    </figure>
  );
}

/** A wide banner cropped from a photograph, for the top of a river or collection page. */
export function FieldBanner({ photo, className, children }: { photo: FieldPhoto; className?: string; children?: React.ReactNode }) {
  return (
    <figure className={cn("field-banner", className)}>
      <Image src={photo.file} alt={photo.alt} fill sizes="(min-width: 1152px) 1152px, 100vw" priority className="object-cover" style={{ objectPosition: photo.focus }} />
      <figcaption className="field-banner-caption">
        <span>{photo.caption}</span>
        <span className="opacity-80"> Photograph: {photo.credit}.</span>
      </figcaption>
      {children}
    </figure>
  );
}

import type { FieldPhoto } from "@/data/field-photos";
import { formatTakenOn } from "@/data/field-photos";
import { FieldPrint } from "@/components/field-print";
import { LightboxGroup, LightboxTrigger } from "@/components/lightbox";

/**
 * A row or grid of field prints that open into a lightbox holding the
 * photograph at full size with its caption, date and credit.
 */
export function FieldGallery({
  photos,
  tilts = [-1.2, 0.8, -0.6, 1.1, -0.9, 0.5],
  listClassName,
  itemClassName,
  sizes,
}: {
  photos: FieldPhoto[];
  tilts?: number[];
  listClassName?: string;
  itemClassName?: string;
  sizes?: string;
}) {
  return (
    <LightboxGroup
      photos={photos.map((p) => ({
        src: p.file,
        alt: p.alt,
        width: p.width,
        height: p.height,
        caption: (
          <p>
            <span>{p.caption.replace(/,\s*[A-Z][a-z]+ \d{1,2}, \d{4}\.$/, ".")}</span>{" "}
            <span className="live lightbox-date">{formatTakenOn(p.takenOn)}</span>
            <span className="lightbox-credit"> Photograph: {p.credit}.</span>
          </p>
        ),
      }))}
    >
      <ul className={listClassName}>
        {photos.map((p, i) => (
          <li key={p.id} className={itemClassName}>
            <LightboxTrigger index={i} label={`Open larger: ${p.caption}`} className="field-print-button">
              <FieldPrint photo={p} tilt={tilts[i % tilts.length]} sizes={sizes} />
            </LightboxTrigger>
          </li>
        ))}
      </ul>
    </LightboxGroup>
  );
}

"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { FieldPhoto } from "@/data/field-photos";
import { formatTakenOn } from "@/data/field-photos";
import { FieldPrint } from "@/components/field-print";

/**
 * A row or grid of field prints that open into a lightbox. Each print is a
 * button; the lightbox is a native <dialog> (focus trap, Escape, backdrop for
 * free) holding the photograph at full size with its caption, date and
 * credit, and previous/next controls that also answer the arrow keys.
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
  const [index, setIndex] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    dialogRef.current?.close();
  }, []);
  const step = useCallback(
    (delta: number) => {
      setLoaded(false);
      setIndex((i) => (i === null ? i : (i + delta + photos.length) % photos.length));
    },
    [photos.length],
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (index !== null && !dialog.open) dialog.showModal();
    if (index === null && dialog.open) dialog.close();
  }, [index]);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, step]);

  const photo = index === null ? null : photos[index];

  return (
    <>
      <ul className={listClassName}>
        {photos.map((p, i) => (
          <li key={p.id} className={itemClassName}>
            <button
              type="button"
              className="field-print-button block w-full text-left"
              onClick={(e) => {
                openerRef.current = e.currentTarget;
                setLoaded(false);
                setIndex(i);
              }}
              aria-label={`Open larger: ${p.caption}`}
            >
              <FieldPrint photo={p} tilt={tilts[i % tilts.length]} sizes={sizes} />
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        className="lightbox"
        aria-label={photo ? photo.caption : "Photograph"}
        onClose={() => {
          setIndex(null);
          openerRef.current?.focus();
        }}
        onClick={(e) => {
          // A click on the backdrop (the dialog element itself, not its children) closes it.
          if (e.target === e.currentTarget) close();
        }}
      >
        {photo ? (
          <div className="lightbox-frame">
            <div className="lightbox-stage" data-loaded={loaded ? "true" : "false"}>
              <div className="lightbox-picture" style={{ aspectRatio: `${photo.width} / ${photo.height}`, "--pw": photo.width, "--ph": photo.height } as React.CSSProperties}>
                <Image
                  key={photo.id}
                  src={photo.file}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 1024px) 80vw, 100vw"
                  priority
                  className="lightbox-image"
                  onLoad={() => setLoaded(true)}
                />
              </div>
            </div>
            <div className="lightbox-bar">
              <p className="lightbox-caption">
                <span>{photo.caption.replace(/,\s*[A-Z][a-z]+ \d{1,2}, \d{4}\.$/, ".")}</span>{" "}
                <span className="live lightbox-date">{formatTakenOn(photo.takenOn)}</span>
                <span className="lightbox-credit"> Photograph: {photo.credit}.</span>
              </p>
              <p className="lightbox-count live" aria-live="polite">
                {index! + 1} / {photos.length}
              </p>
            </div>
            {photos.length > 1 ? (
              <>
                <button type="button" className="lightbox-nav lightbox-prev" onClick={() => step(-1)} aria-label="Previous photograph">
                  <ChevronLeft className="size-6" aria-hidden />
                </button>
                <button type="button" className="lightbox-nav lightbox-next" onClick={() => step(1)} aria-label="Next photograph">
                  <ChevronRight className="size-6" aria-hidden />
                </button>
              </>
            ) : null}
            <button type="button" className="lightbox-close" onClick={close} aria-label="Close">
              <X className="size-5" aria-hidden />
            </button>
          </div>
        ) : null}
      </dialog>
    </>
  );
}

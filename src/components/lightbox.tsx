"use client";

import Image from "next/image";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LightboxPhoto {
  src: string;
  alt: string;
  /** Pixel size when known; otherwise the frame takes the file's own size once it loads. */
  width?: number | null;
  height?: number | null;
  /** The line under the photograph: caption, date, credit. May hold links. */
  caption: ReactNode;
}

const OpenContext = createContext<((index: number, opener: HTMLElement) => void) | null>(null);

/**
 * A set of photographs that open into one lightbox. Wrap the gallery markup
 * in <LightboxGroup> and each thumbnail in <LightboxTrigger>; the thumbnails
 * stay server-rendered. The lightbox is a native <dialog> (focus trap, Escape,
 * backdrop for free) with previous/next controls that also answer the arrow
 * keys, and focus goes back to the thumbnail that opened it.
 */
export function LightboxGroup({ photos, children }: { photos: LightboxPhoto[]; children: ReactNode }) {
  const [index, setIndex] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [natural, setNatural] = useState<Record<string, [number, number]>>({});
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const open = useCallback((i: number, opener: HTMLElement) => {
    openerRef.current = opener;
    setLoaded(false);
    setIndex(i);
  }, []);
  const close = useCallback(() => dialogRef.current?.close(), []);
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
    if (index !== null && !dialog.open) {
      dialog.showModal();
      // Start on Close, not on the first link in the credit line.
      closeRef.current?.focus();
    }
    if (index === null && dialog.open) dialog.close();
  }, [index]);

  useEffect(() => {
    if (index === null || photos.length < 2) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, step, photos.length]);

  const photo = index === null ? null : photos[index];
  const [pw, ph] = photo ? (photo.width && photo.height ? [photo.width, photo.height] : (natural[photo.src] ?? [4, 3])) : [4, 3];

  return (
    <OpenContext.Provider value={open}>
      {children}
      <dialog
        ref={dialogRef}
        className="lightbox"
        aria-label={photo ? photo.alt : "Photograph"}
        onClose={() => {
          setIndex(null);
          openerRef.current?.focus();
        }}
        onClick={(e) => {
          // The frame fills the viewport, so "the backdrop" is any empty space around the picture and caption.
          const t = e.target as HTMLElement;
          if (t === e.currentTarget || t.classList.contains("lightbox-frame") || t.classList.contains("lightbox-stage")) close();
        }}
      >
        {photo ? (
          <div className="lightbox-frame">
            <div className="lightbox-stage" data-loaded={loaded ? "true" : "false"}>
              <div className="lightbox-picture" style={{ aspectRatio: `${pw} / ${ph}`, "--pw": pw, "--ph": ph } as React.CSSProperties}>
                <Image
                  key={photo.src}
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 1024px) 80vw, 100vw"
                  priority
                  className="lightbox-image"
                  onLoad={(e) => {
                    const img = e.currentTarget;
                    if (!photo.width && img.naturalWidth) setNatural((n) => ({ ...n, [photo.src]: [img.naturalWidth, img.naturalHeight] }));
                    setLoaded(true);
                  }}
                />
              </div>
            </div>
            <div className="lightbox-bar">
              <div className="lightbox-caption">{photo.caption}</div>
              {photos.length > 1 ? (
                <p className="lightbox-count live" aria-live="polite">
                  {index! + 1} / {photos.length}
                </p>
              ) : null}
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
            <button ref={closeRef} type="button" className="lightbox-close" onClick={close} aria-label="Close">
              <X className="size-5" aria-hidden />
            </button>
          </div>
        ) : null}
      </dialog>
    </OpenContext.Provider>
  );
}

/** A thumbnail that opens photo `index` of the surrounding <LightboxGroup>. */
export function LightboxTrigger({ index, label, className, children }: { index: number; label: string; className?: string; children: ReactNode }) {
  const open = useContext(OpenContext);
  return (
    <button type="button" className={cn("zoom-trigger block w-full text-left", className)} onClick={(e) => open?.(index, e.currentTarget)} aria-label={label}>
      {children}
    </button>
  );
}

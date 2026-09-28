import Image from "next/image";
import { cn } from "@/lib/utils";

/** The shop logo: a leaping rainbow trout. Transparent, so it sits on the sign or the rail. */
export function TroutLogo({ className, title = "Leaping rainbow trout" }: { className?: string; title?: string }) {
  return (
    <Image
      src="/photos/illustration/trout-logo.svg"
      alt={title}
      width={1045}
      height={967}
      unoptimized
      className={cn("block h-auto w-full", className)}
    />
  );
}

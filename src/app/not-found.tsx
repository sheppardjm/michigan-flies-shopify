import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-4 px-4 py-24 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">Nothing rising here</h1>
      <p className="text-muted-foreground">That page does not exist. Try the fly finder or the river list.</p>
      <div className="flex gap-2">
        <Button asChild>
          <Link href="/quiz">Fly finder</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/rivers">Rivers</Link>
        </Button>
      </div>
    </div>
  );
}

import Link from "next/link";
import { Fish, Menu, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const NAV = [
  { href: "/quiz", label: "Fly finder" },
  { href: "/calendar", label: "Hatch calendar" },
  { href: "/rivers", label: "Rivers" },
  { href: "/hatches", label: "Hatches" },
  { href: "/flies", label: "Flies" },
  { href: "/species", label: "Fish" },
  { href: "/shop", label: "Shop" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <Fish className="size-5 text-primary" aria-hidden />
          <span>Michigan Flies</span>
        </Link>
        <nav className="ml-auto hidden items-center gap-1 md:flex" aria-label="Primary">
          {NAV.map((item) => (
            <Button key={item.href} asChild variant="ghost" size="sm">
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
          <Button asChild variant="outline" size="icon-sm" aria-label="Cart">
            <Link href="/cart">
              <ShoppingBag />
            </Link>
          </Button>
        </nav>
        <div className="ml-auto flex items-center gap-1 md:hidden">
          <Button asChild variant="outline" size="icon-sm" aria-label="Cart">
            <Link href="/cart">
              <ShoppingBag />
            </Link>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="Open menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle className="px-4 pt-4">Michigan Flies</SheetTitle>
              <nav className="flex flex-col gap-1 p-4" aria-label="Mobile">
                {NAV.map((item) => (
                  <Button key={item.href} asChild variant="ghost" className="justify-start">
                    <Link href={item.href}>{item.label}</Link>
                  </Button>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

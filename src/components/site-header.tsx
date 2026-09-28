import Link from "next/link";
import { Menu, ShoppingBag } from "lucide-react";
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
  { href: "/faq", label: "FAQ" },
] as const;

/** The top rail of the shop: wood trim, script wordmark, painted nav. */
export function SiteHeader() {
  return (
    <header className="rail sticky top-0 z-40">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-4 px-4">
        <Link href="/" className="rail-wordmark rounded-sm pr-2" aria-label="Michigan Flies home">
          Michigan Flies
        </Link>
        <nav className="rail-nav ml-auto hidden items-center gap-0.5 md:flex" aria-label="Primary">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
          <Link href="/cart" aria-label="Cart" className="ml-1 inline-flex items-center">
            <ShoppingBag className="size-4" />
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-1 md:hidden">
          <Button asChild variant="ghost" size="icon-sm" aria-label="Cart" className="text-trout-belly hover:bg-white/10 hover:text-trout-belly">
            <Link href="/cart">
              <ShoppingBag />
            </Link>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="Open menu" className="text-trout-belly hover:bg-white/10 hover:text-trout-belly">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-rail text-trout-belly">
              <SheetTitle className="script px-4 pt-4 text-3xl text-trout-belly">Michigan Flies</SheetTitle>
              <nav className="rail-nav flex flex-col gap-1 p-4" aria-label="Mobile">
                {NAV.map((item) => (
                  <Link key={item.href} href={item.href}>
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

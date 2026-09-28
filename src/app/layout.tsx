import type { Metadata } from "next";
import { Courier_Prime, Jost, Mr_Dafoe, Zilla_Slab } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { TooltipProvider } from "@/components/ui/tooltip";

// Each font registers its @font-face under its own family name; globals.css references those names literally.
const jost = Jost({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap", variable: "--font-jost" });
const zilla = Zilla_Slab({ subsets: ["latin"], weight: ["500", "600", "700"], display: "swap", variable: "--font-zilla" });
const dafoe = Mr_Dafoe({ subsets: ["latin"], weight: "400", display: "swap", variable: "--font-dafoe" });
const courier = Courier_Prime({ subsets: ["latin"], weight: ["400", "700"], display: "swap", variable: "--font-courier" });

export const metadata: Metadata = {
  metadataBase: new URL("https://michiganflies.com"),
  title: {
    default: "Michigan Flies: Hand-tied flies for the Great Lakes State salmon and steelhead rivers",
    template: "%s · Michigan Flies",
  },
  description:
    "Find the right fly for any Michigan river on any date. Hatch windows, egg drops, and forage tuned to the river's region, water temperature, and growing degree days. Hand-tied flies for trout, steelhead, and salmon.",
  // Link previews (iMessage, Slack, social) read these before the page title.
  openGraph: {
    type: "website",
    siteName: "Michigan Flies",
    title: "Michigan Flies: Hand-tied flies for the Great Lakes State salmon and steelhead rivers",
    description:
      "Find the right fly for any Michigan river on any date. Hatch windows, egg drops, and forage tuned to the river's region, water temperature, and growing degree days.",
    url: "/",
  },
  twitter: {
    card: "summary",
    title: "Michigan Flies: Hand-tied flies for the Great Lakes State salmon and steelhead rivers",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${jost.variable} ${zilla.variable} ${dafoe.variable} ${courier.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-background text-foreground font-sans">
        <TooltipProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </TooltipProvider>
      </body>
    </html>
  );
}

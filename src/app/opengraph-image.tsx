import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

/**
 * The link-preview card: the enamel sign from the home page, rendered at
 * 1200x630 for iMessage, Slack and social unfurls. Colors are the trout
 * palette flattened to hex because the OG renderer does not read oklch.
 * Fonts and the logo are read from disk and traced into the route (see src/assets/fonts).
 */
export const alt = "Michigan Flies: Hand-tied flies for the Great Lakes State salmon and steelhead rivers";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BELLY = "#f6f0e2";
const WALL = "#e6dcc8";
const INK = "#2b2824";
const BACK = "#4f5d33";
const DIRT = "#7a6350";

export default async function OpenGraphImage() {
  // Read from disk (traced into the function bundle via outputFileTracingIncludes in next.config.ts).
  const root = process.cwd();
  const [slab, script, logo] = await Promise.all([
    readFile(path.join(root, "src/assets/fonts/zilla-slab-600.woff")),
    readFile(path.join(root, "src/assets/fonts/mr-dafoe-400.woff")),
    readFile(path.join(root, "public/photos/illustration/trout-logo.svg")),
  ]);
  const logoSrc = `data:image/svg+xml;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: WALL,
          padding: 36,
        }}
      >
        {/* The enamel sign */}
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            background: BELLY,
            border: `4px solid ${INK}`,
            borderRadius: 18,
            padding: "36px 56px",
            boxShadow: "0 18px 40px -20px rgba(43, 40, 36, 0.55)",
          }}
        >
          <img src={logoSrc} alt="" width={400} height={370} style={{ width: 400, height: 370, flexShrink: 0 }} />
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", marginLeft: 32, width: 560 }}>
            <div style={{ display: "flex", fontFamily: "Mr Dafoe", fontSize: 96, lineHeight: 1, color: BACK, marginLeft: -4 }}>Michigan Flies</div>
            <div style={{ display: "flex", marginTop: 18, fontFamily: "Zilla Slab", fontWeight: 600, fontSize: 34, lineHeight: 1.22, color: INK, letterSpacing: -0.3, width: 560 }}>
              Hand-tied flies for the Great Lakes State salmon and steelhead rivers
            </div>
            <div style={{ display: "flex", marginTop: 24, fontFamily: "Zilla Slab", fontWeight: 600, fontSize: 20, letterSpacing: 5, textTransform: "uppercase", color: DIRT }}>
              michiganflies.com
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Zilla Slab", data: new Uint8Array(slab).buffer, weight: 600, style: "normal" },
        { name: "Mr Dafoe", data: new Uint8Array(script).buffer, weight: 400, style: "normal" },
      ],
    },
  );
}

import { mkdirSync, writeFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { PineStand } from "../src/components/wall/wilderness";

/**
 * Renders the engraved plates that appear on every page to static SVG files
 * under public/illustration, so the path data ships once and is cached
 * instead of being inlined into every HTML and RSC payload. Colors are baked
 * because a file cannot read currentColor: cream at 50% for the footer rail.
 */
mkdirSync("public/illustration", { recursive: true });
let pine = renderToStaticMarkup(createElement(PineStand));
pine = pine
  .replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg" color="oklch(0.965 0.018 85 / 0.5)"')
  .replace(/ class="[^"]*"/, "");
writeFileSync("public/illustration/pine-stand.svg", pine);
console.log("pine-stand.svg", pine.length, "bytes");

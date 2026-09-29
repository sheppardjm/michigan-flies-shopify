import { describe, expect, it } from "vitest";
import { normalize, searchSite } from "./search";

const hrefs = (q: string) => searchSite(q).map((r) => r.href);

describe("site search", () => {
  it("ignores empty and one-letter queries", () => {
    expect(searchSite("")).toEqual([]);
    expect(searchSite("h")).toEqual([]);
  });

  it("puts an exact name first", () => {
    expect(hrefs("hex")[0]).toBe("/hatches/hex");
    expect(hrefs("Pere Marquette")[0]).toBe("/rivers/pere-marquette");
    expect(hrefs("brown trout")[0]).toBe("/species/brown-trout");
  });

  it("matches word prefixes while typing, the hatch ahead of flies named for it", () => {
    expect(hrefs("hendr")[0]).toBe("/hatches/hendrickson");
    expect(hrefs("pere marq")).toContain("/rivers/pere-marquette");
  });

  it("folds apostrophes, case and plurals", () => {
    expect(normalize("Pat's Rubber Legs")).toBe("pats rubber legs");
    expect(hrefs("pats rubber")[0]).toBe("/flies/pats-rubber-legs");
    expect(hrefs("Hendricksons")).toContain("/hatches/hendrickson");
  });

  it("finds a hatch by its alias and flies by the hatch they imitate", () => {
    expect(hrefs("giant michigan mayfly")[0]).toBe("/hatches/hex");
    const hex = hrefs("hex");
    expect(hex).toContain("/flies/hex-spinner");
    expect(hex).toContain("/flies/hex-nymph");
  });

  it("finds flies by forage they imitate", () => {
    expect(searchSite("sculpin").some((r) => r.kind === "fly")).toBe(true);
  });

  it("requires every query word to match", () => {
    expect(searchSite("hex zzzz")).toEqual([]);
  });

  it("finds standalone pages", () => {
    expect(hrefs("calendar")[0]).toBe("/calendar");
    expect(hrefs("faq")).toContain("/faq");
  });
});

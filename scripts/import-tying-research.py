#!/usr/bin/env python3
"""
Turn the research agents' JSON (scratchpad/research-g*.json) into TypeScript
records appended to src/data/tying.ts. Validates shape and part references,
skips flies that already have a sheet, and prints what it added.
Usage: python3 scripts/import-tying-research.py <json files...>
"""
import json, re, sys

KINDS = {"hook","shank","line","thread","eyes","feather","fur","synthetic","flash","legs","adhesive","other"}
LICENSES = {"permission","published-sheet","own"}

def ts_str(s):
    return json.dumps(s, ensure_ascii=False)

def obj(d, keys):
    parts = []
    for k in keys:
        if k in d and d[k] not in (None, "", [], False):
            v = d[k]
            if isinstance(v, bool): parts.append(f"{k}: {'true' if v else 'false'}")
            elif isinstance(v, (int, float)): parts.append(f"{k}: {v}")
            elif isinstance(v, list): parts.append(f"{k}: [{', '.join(ts_str(x) for x in v)}]")
            else: parts.append(f"{k}: {ts_str(v)}")
    return "{ " + ", ".join(parts) + " }"

tying = open("src/data/tying.ts").read()
have = set(re.findall(r'flyId: "([a-z0-9-]+)"', tying))
fly_ids = set(re.findall(r'^\s+id: "([a-z0-9-]+)",', open("src/data/flies.ts").read(), flags=re.M))

out, added, problems = [], [], []
for path in sys.argv[1:]:
    for r in json.load(open(path)):
        fid = r.get("flyId")
        if fid not in fly_ids: problems.append(f"{path}: unknown fly {fid}"); continue
        if fid in have: problems.append(f"{fid}: already has a sheet, skipped"); continue
        parts = {m["part"] for m in r.get("materials", [])}
        bad = [b["item"] for b in r.get("bill", []) for p in b.get("usedFor", []) if p not in parts]
        if bad: problems.append(f"{fid}: bill items reference unknown parts: {bad}"); continue
        if any(b.get("kind") not in KINDS for b in r.get("bill", [])): problems.append(f"{fid}: bad bill kind"); continue
        if r.get("license") not in LICENSES: r["license"] = "own"
        if not r.get("steps") or not r.get("materials"): problems.append(f"{fid}: missing steps or materials"); continue
        src = r["source"]
        if not (isinstance(src, dict) and src.get("url", "").startswith("http")): problems.append(f"{fid}: bad source"); continue
        lines = ["  {", f"    flyId: {ts_str(fid)},"]
        if r.get("title"): lines.append(f"    title: {ts_str(r['title'])},")
        if r.get("summary"): lines.append(f"    summary: {ts_str(r['summary'])},")
        lines.append("    materials: [")
        for m in r["materials"]: lines.append("      " + obj(m, ["part","material","note","optional"]) + ",")
        lines.append("    ],")
        lines.append("    steps: [")
        for s in r["steps"]: lines.append(f"      {ts_str(s)},")
        lines.append("    ],")
        if r.get("comments"):
            lines.append("    comments: [")
            for c in r["comments"]: lines.append(f"      {ts_str(c)},")
            lines.append("    ],")
        if r.get("bill"):
            lines.append("    bill: [")
            for b in r["bill"]: lines.append("      " + obj(b, ["item","kind","quantity","variant","maker","usedFor","optional","note"]) + ",")
            lines.append("    ],")
        s = {k: src[k] for k in ("title","url","author","year") if src.get(k)}
        lines.append(f"    source: {obj(s, ['title','url','author','year'])},")
        extra = [e for e in r.get("extraSources", []) if isinstance(e, dict) and e.get("url","").startswith("http") and e.get("title")]
        if extra:
            lines.append("    moreSources: [")
            for e in extra: lines.append("      " + obj({k: e[k] for k in ("title","url","author","year") if e.get(k)}, ["title","url","author","year"]) + ",")
            lines.append("    ],")
        lines.append(f"    license: {ts_str(r['license'])},")
        note = r.get("transcriptionNote") or ""
        if r.get("uncertain"): note = (note + " Unconfirmed: " + r["uncertain"]).strip()
        if note: lines.append(f"    transcriptionNote: {ts_str(note)},")
        lines.append('    evidence: "A",')
        lines.append("  },")
        out.append("\n".join(lines)); added.append(fid); have.add(fid)

if out:
    idx = tying.rindex("\n];")
    tying = tying[:idx] + "\n" + "\n".join(out) + tying[idx:]
    open("src/data/tying.ts", "w").write(tying)
print(f"added {len(added)}: {', '.join(added)}")
for p in problems: print("SKIP", p)

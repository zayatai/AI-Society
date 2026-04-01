"""
merge.py — UAlbany AI Course Navigator
Merges PDF-scraped and web-scraped courses into a single public/courses.json.

Run from repo root after both scrapers:
    python scripts/scrape_web.py
    python scripts/scrape_pdf.py
    python scripts/merge.py
"""

import json
import os

WEB_PATH = "public/courses.json"       # output of scrape_web.py
PDF_PATH = "public/courses_pdf.json"   # output of scrape_pdf.py
OUT_PATH = "public/courses.json"       # final merged file


def load(path):
    if not os.path.exists(path):
        print(f"  ⚠️  Not found: {path} — skipping")
        return []
    with open(path) as f:
        return json.load(f)


def main():
    print("🔀 Merging course data...")

    web = load(WEB_PATH)
    pdf = load(PDF_PATH)

    print(f"  Web scraper: {len(web)} courses")
    print(f"  PDF scraper: {len(pdf)} courses")

    # Deduplicate by course code — web scraper takes priority (richer data)
    seen_codes = {c["code"]: True for c in web if c.get("code")}

    merged = list(web)
    added = 0
    for c in pdf:
        code = c.get("code", "")
        if code and code in seen_codes:
            print(f"  ⏩ Skipping duplicate: {code}")
            continue
        if code:
            seen_codes[code] = True
        merged.append(c)
        added += 1

    # Re-assign clean sequential IDs
    for i, c in enumerate(merged):
        c["id"] = i + 1

    with open(OUT_PATH, "w") as f:
        json.dump(merged, f, indent=2, ensure_ascii=False)

    print(f"\n✅ Merged {len(merged)} total courses ({len(web)} web + {added} new from PDF)")
    print(f"   Saved to {OUT_PATH}")
    print("\nNext: git add public/courses.json && git commit -m 'Update course data' && git push")


if __name__ == "__main__":
    main()

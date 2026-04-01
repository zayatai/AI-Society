"""
scrape_pdf.py — UAlbany AI Course Navigator
Scrapes Schedule of Classes PDFs for AI-related courses.
Outputs: public/courses_pdf.json (merged into public/courses.json by merge.py)

Run from repo root:
    python scripts/scrape_pdf.py
"""

import requests
import pdfplumber
import json
import io
import re
import os

# ── Keywords to identify AI-related courses ──
KEYWORDS = [
    "artificial intelligence",
    "machine learning",
    "deep learning",
    "neural network",
    "natural language processing",
]

# ── PDF URLs ──
PDFS = {
    "Fall 2026":   "https://www.albany.edu/docs/schedule_of_classes/pdf/socfall.pdf",
    "Summer 2026": "https://www.albany.edu/docs/schedule_of_classes/pdf/socsummer.pdf",
    "Spring 2026": "https://www.albany.edu/docs/schedule_of_classes/pdf/socspring.pdf",
}

# ── School mapping by course prefix ──
SCHOOL_MAP = {
    "ICSI": "College of Emergency Preparedness, Homeland Security and Cybersecurity (CEHC)",
    "CINF": "College of Emergency Preparedness, Homeland Security and Cybersecurity (CEHC)",
    "CYBR": "College of Emergency Preparedness, Homeland Security and Cybersecurity (CEHC)",
    "IECE": "College of Nanotechnology, Science, and Engineering (CNSE)",
    "IEGR": "College of Nanotechnology, Science, and Engineering (CNSE)",
    "BAIB": "Massry School of Business",
    "BITM": "Massry School of Business",
    "ISBA": "Massry School of Business",
    "BFOR": "College of Emergency Preparedness, Homeland Security and Cybersecurity (CEHC)",
    "RPAD": "Rockefeller College of Public Affairs & Policy",
    "ETAP": "School of Education",
    "EPSY": "School of Education",
    "AMAT": "College of Arts & Sciences",
    "AECO": "College of Arts & Sciences",
    "APHI": "College of Arts & Sciences",
    "UUNI": "College of Arts & Sciences",
    "RCRJ": "School of Criminal Justice",
    "RSSW": "School of Social Welfare",
}

def matches_keyword(text):
    t = text.lower()
    return any(k in t for k in KEYWORDS)

def extract_course_code(text):
    """Extract course code like ICSI 435 or ICSI435 from text."""
    m = re.search(r'\b([A-Z]{3,4})\s*(\d{3}[A-Z]?)\b', text)
    if m:
        return f"{m.group(1)} {m.group(2)}"
    return None

def extract_credits(text):
    """Extract credit hours like (3) or 3 cr."""
    m = re.search(r'\((\d)\)', text)
    if m:
        return int(m.group(1))
    m = re.search(r'(\d)\s*cr', text, re.IGNORECASE)
    if m:
        return int(m.group(1))
    return None

def extract_format(text):
    """Detect format from section info."""
    t = text.upper()
    if "ONLINE" in t or "WEB" in t or "DISTANCE" in t:
        return "Online"
    if "HYBRID" in t:
        return "Hybrid"
    return "In-Person"

def get_school(code):
    if not code:
        return "University at Albany"
    prefix = code.split()[0] if " " in code else code[:4]
    return SCHOOL_MAP.get(prefix, "University at Albany")

def get_level(code):
    if not code:
        return "Undergraduate"
    num_match = re.search(r'(\d{3})', code)
    if num_match:
        num = int(num_match.group(1))
        return "Graduate" if num >= 500 else "Undergraduate"
    return "Undergraduate"

def scrape_pdf(term, url):
    """Download and parse a Schedule of Classes PDF."""
    print(f"\n📄 Scraping {term}...")
    try:
        r = requests.get(url, timeout=30)
        r.raise_for_status()
    except Exception as e:
        print(f"  ❌ Failed to download: {e}")
        return []

    courses = []
    seen_codes = set()

    try:
        with pdfplumber.open(io.BytesIO(r.content)) as pdf:
            print(f"  Pages: {len(pdf.pages)}")

            # Accumulate all text, then process in blocks
            all_lines = []
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    all_lines.extend(text.split("\n"))

            # Slide a window over lines looking for AI keywords
            window = 8  # lines of context around a match
            for i, line in enumerate(all_lines):
                if not matches_keyword(line):
                    continue

                # Grab context window
                start = max(0, i - window)
                end = min(len(all_lines), i + window)
                block = all_lines[start:end]
                block_text = " ".join(block)

                # Try to find course code in block
                code = None
                for bl in block:
                    code = extract_course_code(bl)
                    if code:
                        break

                if not code:
                    continue

                # Deduplicate by code+term
                key = f"{code}_{term}"
                if key in seen_codes:
                    continue
                seen_codes.add(key)

                # Extract title — usually the line with the course code
                title = ""
                for bl in block:
                    if code.replace(" ", "") in bl.replace(" ", "") or code in bl:
                        # Remove code, credits, class numbers
                        title = re.sub(r'[A-Z]{3,4}\s*\d{3}[A-Z]?\s*', '', bl)
                        title = re.sub(r'\(\d\)', '', title)
                        title = re.sub(r'\d{4,}', '', title)  # remove class numbers
                        title = title.strip(" -–|")
                        break

                # Clean description — use the matching line and neighbors
                desc_lines = [l.strip() for l in block if l.strip() and not re.match(r'^\d{4,}', l.strip())]
                description = " ".join(desc_lines[:4])
                description = re.sub(r'\s+', ' ', description).strip()

                # Extract prereqs
                prereqs = "See course description"
                prereq_match = re.search(r'[Pp]rerequisite[s]?[:\s]+([^.]+\.)', block_text)
                if prereq_match:
                    prereqs = prereq_match.group(1).strip()

                course = {
                    "source": "Schedule of Classes PDF",
                    "credentialType": "Degree Course",
                    "level": get_level(code),
                    "code": code,
                    "title": title if title else f"{code} (AI-related course)",
                    "description": description[:500],
                    "term": term,
                    "format": extract_format(block_text),
                    "school": get_school(code),
                    "dept": get_school(code),
                    "credits": extract_credits(block_text),
                    "instructor": "See registrar",
                    "prereqs": prereqs[:200],
                    "sourceUrl": "https://www.albany.edu/registrar/schedule-classes",
                    "isFree": False,
                    "offeredBy": None,
                }
                courses.append(course)
                print(f"  ✅ Found: {code} — {title[:50]}")

    except Exception as e:
        print(f"  ❌ Parse error: {e}")

    return courses


def main():
    all_courses = []

    for term, url in PDFS.items():
        found = scrape_pdf(term, url)
        all_courses.extend(found)

    # Assign sequential IDs starting from 100 (web scraper uses 1-99)
    for i, c in enumerate(all_courses):
        c["id"] = 100 + i

    # Write to public/courses_pdf.json
    os.makedirs("public", exist_ok=True)
    out_path = "public/courses_pdf.json"
    with open(out_path, "w") as f:
        json.dump(all_courses, f, indent=2, ensure_ascii=False)

    print(f"\n✅ Saved {len(all_courses)} PDF courses to {out_path}")
    print("Next step: run scripts/merge.py to combine with web-scraped courses")


if __name__ == "__main__":
    main()

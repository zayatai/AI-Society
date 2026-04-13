"""
scrape_all.py
─────────────────────────────────────────────────────────────────────────────
Auto-crawling scraper for UAlbany AI Curriculum Navigator.

Strategy:
  1. Start from every undergraduate-bulletin school index page
  2. Discover all *-courses.php links automatically (no hardcoding)
  3. Fetch each course page and scan every course block
  4. Match keywords: "artificial intelligence", "machine learning", "deep learning"
     in TITLE or DESCRIPTION
  5. Save raw results to data/courses_raw_v2.json for manual review
─────────────────────────────────────────────────────────────────────────────
"""

import requests
from bs4 import BeautifulSoup
import json
import time
import re
import os

# ── Config ────────────────────────────────────────────────────────────────────
BASE = "https://www.albany.edu"
KEYWORDS = ["artificial intelligence", "machine learning", "deep learning"]
DELAY = 1.2  # seconds between requests — be polite to albany.edu

# ── All 9 school index pages (undergraduate bulletin) ─────────────────────────
SCHOOL_INDEXES = [
    ("https://www.albany.edu/undergraduate-bulletin/college-of-arts-sciences-index.php",
     "College of Arts & Sciences"),
    ("https://www.albany.edu/undergraduate-bulletin/college-emergency-preparedness-homeland-security-cybersecurity-index.php",
     "College of Emergency Preparedness, Homeland Security and Cybersecurity (CEHC)"),
    ("https://www.albany.edu/undergraduate-bulletin/college-of-integrated-health-sciences-index.php",
     "College of Integrated Health Sciences"),
    ("https://www.albany.edu/undergraduate-bulletin/college-nanotechnolgy-science-and-engineering-index.php",
     "College of Nanotechnology, Science, and Engineering (CNSE)"),
    ("https://www.albany.edu/undergraduate-bulletin/rockefeller-college-public-affairs-policy-index.php",
     "Rockefeller College of Public Affairs & Policy"),
    ("https://www.albany.edu/undergraduate-bulletin/massry-school-of-business-index.php",
     "Massry School of Business"),
    ("https://www.albany.edu/undergraduate-bulletin/school-criminal-justice-index.php",
     "School of Criminal Justice"),
    ("https://www.albany.edu/undergraduate-bulletin/school-of-education-index.php",
     "School of Education"),
    ("https://www.albany.edu/undergraduate-bulletin/school-of-social-welfare-index.php",
     "School of Social Welfare"),
]

# ── Additional pages not linked from UG indexes ───────────────────────────────
# (graduate bulletins, certificates, microcredentials)
EXTRA_PAGES = [
    # Graduate bulletin — all schools
    ("https://www.albany.edu/graduate-bulletin/computer-science-courses.php",
     "College of Arts & Sciences", "Computer Science"),
    ("https://www.albany.edu/graduate-bulletin/mathematics-statistics-courses.php",
     "College of Arts & Sciences", "Mathematics & Statistics"),
    ("https://www.albany.edu/graduate-bulletin/geography-courses.php",
     "College of Arts & Sciences", "Geography, Planning & Sustainability"),
    ("https://www.albany.edu/graduate-bulletin/machine-learning-certificate.php",
     "College of Arts & Sciences", "Mathematics & Statistics"),
    ("https://www.albany.edu/graduate-bulletin/geospatial-ai-big-data-analytics-certificate.php",
     "College of Arts & Sciences", "Geography, Planning & Sustainability"),
    ("https://www.albany.edu/graduate-bulletin/informatics-courses.php",
     "College of Emergency Preparedness, Homeland Security and Cybersecurity (CEHC)", "Information Sciences & Technology"),
    ("https://www.albany.edu/graduate-bulletin/cybersecurity-cehc-courses.php",
     "College of Emergency Preparedness, Homeland Security and Cybersecurity (CEHC)", "Cybersecurity"),
    ("https://www.albany.edu/graduate-bulletin/electrical-computer-engineering-courses.php",
     "College of Emergency Preparedness, Homeland Security and Cybersecurity (CEHC)", "Electrical & Computer Engineering"),
    ("https://www.albany.edu/graduate-bulletin/public-health-courses.php",
     "College of Integrated Health Sciences", "Public Health"),
    ("https://www.albany.edu/graduate-bulletin/epidemiology-biostatistics-courses.php",
     "College of Integrated Health Sciences", "Epidemiology & Biostatistics"),
    ("https://www.albany.edu/graduate-bulletin/health-policy-management-behavior-courses.php",
     "College of Integrated Health Sciences", "Health Policy, Management & Behavior"),
    ("https://www.albany.edu/graduate-bulletin/environmental-health-sciences-courses.php",
     "College of Integrated Health Sciences", "Environmental Health Sciences"),
    ("https://www.albany.edu/graduate-bulletin/nanoscale-engineering-courses.php",
     "College of Nanotechnology, Science, and Engineering (CNSE)", "Nanoscale Engineering"),
    ("https://www.albany.edu/graduate-bulletin/nanoscale-science-courses.php",
     "College of Nanotechnology, Science, and Engineering (CNSE)", "Nanoscale Science"),
    ("https://www.albany.edu/graduate-bulletin/public-administration-policy-courses.php",
     "Rockefeller College of Public Affairs & Policy", "Public Administration & Policy"),
    ("https://www.albany.edu/graduate-bulletin/political-science-courses.php",
     "Rockefeller College of Public Affairs & Policy", "Political Science"),
    ("https://www.albany.edu/graduate-bulletin/ai-business-courses.php",
     "Massry School of Business", "AI for Business"),
    ("https://www.albany.edu/graduate-bulletin/information-systems-business-analytics-courses.php",
     "Massry School of Business", "Information Systems & Business Analytics"),
    ("https://www.albany.edu/graduate-bulletin/accounting-courses.php",
     "Massry School of Business", "Accounting"),
    ("https://www.albany.edu/graduate-bulletin/cybersecurity-courses.php",
     "Massry School of Business", "Cybersecurity (Business)"),
    ("https://www.albany.edu/graduate-bulletin/criminal-justice-courses.php",
     "School of Criminal Justice", "Criminal Justice"),
    ("https://www.albany.edu/graduate-bulletin/educational-theory-practice-courses.php",
     "School of Education", "Educational Theory & Practice"),
    ("https://www.albany.edu/graduate-bulletin/educational-psychology-methodology-courses.php",
     "School of Education", "Educational Psychology & Methodology"),
    ("https://www.albany.edu/graduate-bulletin/educational-policy-leadership-courses.php",
     "School of Education", "Educational Policy & Leadership"),
    ("https://www.albany.edu/graduate-bulletin/literacy-teaching-learning-courses.php",
     "School of Education", "Literacy Teaching & Learning"),
    ("https://www.albany.edu/graduate-bulletin/counseling-psychology-courses.php",
     "School of Education", "Counseling Psychology"),
    ("https://www.albany.edu/graduate-bulletin/social-welfare-courses.php",
     "School of Social Welfare", "Social Work"),
    # Microcredentials
    ("https://www.albany.edu/academics/microcredentials/ai-plus-fundamentals",
     "College of Arts & Sciences", "PaCE / AI & Society College"),
    ("https://www.albany.edu/academics/microcredentials/ai-for-business",
     "Massry School of Business", "AI for Business"),
]


# ── Helpers ───────────────────────────────────────────────────────────────────

def matches(text):
    t = text.lower()
    return any(k in t for k in KEYWORDS)


def get_soup(url):
    try:
        r = requests.get(url, timeout=15)
        if r.status_code != 200:
            print(f"    HTTP {r.status_code} — skipping")
            return None
        return BeautifulSoup(r.text, "html.parser")
    except Exception as e:
        print(f"    Request error: {e}")
        return None


def discover_course_links(index_url, school):
    """
    Fetch a school index page and return all *-courses.php links
    found in the main content area, paired with their link text (dept name).
    """
    print(f"\n{'='*60}")
    print(f"INDEX: {school}")
    print(f"  {index_url}")
    soup = get_soup(index_url)
    if not soup:
        return []

    found = []
    seen_urls = set()
    main = soup.find("main") or soup.find("div", id="main-content") or soup.body

    for a in main.find_all("a", href=True):
        href = a["href"]
        # Normalise to absolute URL
        if href.startswith("/"):
            href = BASE + href
        elif not href.startswith("http"):
            continue

        # Only pick up *-courses.php links from the bulletin
        if "undergraduate-bulletin" in href and "courses" in href and href.endswith(".php"):
            if href not in seen_urls:
                seen_urls.add(href)
                # Use link text as dept hint, fallback to URL slug
                link_text = a.get_text(strip=True)
                dept = link_text if link_text and len(link_text) < 80 else href.split("/")[-1].replace("-courses.php", "").replace("-", " ").title()
                found.append((href, school, dept))
                print(f"  → {dept}: {href}")

    time.sleep(DELAY)
    return found


def extract_courses(url, school, dept):
    """
    Fetch a course listing page and extract all blocks that match keywords.
    Returns list of dicts.
    """
    soup = get_soup(url)
    if not soup:
        return []

    main = soup.find("main") or soup.find("div", id="main-content") or soup.body
    results = []

    # ── Strategy 1: h3/h4 title + following <p> description ──────────────────
    # This is the standard bulletin format:
    #   <h3>CSI 530 Artificial Intelligence (3)</h3>
    #   <p>Description text...</p>
    headings = main.find_all(["h2", "h3", "h4"])
    for h in headings:
        title = h.get_text(" ", strip=True)

        # Collect all following sibling <p> tags until next heading
        desc_parts = []
        for sib in h.next_siblings:
            if hasattr(sib, "name"):
                if sib.name in ["h2", "h3", "h4"]:
                    break
                if sib.name == "p":
                    desc_parts.append(sib.get_text(" ", strip=True))
        description = " ".join(desc_parts).strip()

        combined = f"{title} {description}"
        if matches(combined):
            code = extract_code(title)
            clean_title = clean_course_title(title)
            results.append(build_entry(code, clean_title, description, school, dept, url))
            print(f"    ✓ {code or '?'} — {clean_title[:65]}")

    # ── Strategy 2: fallback — scan all <p> tags directly ────────────────────
    # Some pages (microcredentials, certificates) don't use h3 structure
    if not results:
        for p in main.find_all("p"):
            text = p.get_text(" ", strip=True)
            if matches(text) and len(text) > 40:
                results.append(build_entry("", text[:80], text, school, dept, url))
                print(f"    ✓ (p-block) — {text[:65]}")

    return results


def extract_code(title):
    """Extract course code like 'CSI 530' or 'CYBR 420' from title string."""
    m = re.match(r"^([A-Za-z]{1,5}\s?\d{3,4}[A-Za-z]?)", title.strip())
    if m:
        return m.group(1).upper().strip()
    return ""


def clean_course_title(raw):
    """Remove credit counts like '(3)' from end of title."""
    return re.sub(r"\s*\(\d+\)\s*$", "", raw).strip()


def build_entry(code, title, description, school, dept, url):
    return {
        "code": code,
        "title": title,
        "description": description,
        "school": school,
        "dept": dept,
        "sourceUrl": url,
        "source": "Undergraduate/Graduate Bulletin",
        "verified": False,  # MUST be manually verified before adding to courses.json
    }


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    all_course_pages = []   # (url, school, dept)
    seen_page_urls = set()

    # Step 1: Auto-discover all course pages from school indexes
    print("\n" + "="*60)
    print("STEP 1: Discovering course pages from school indexes...")
    print("="*60)

    for index_url, school in SCHOOL_INDEXES:
        discovered = discover_course_links(index_url, school)
        for url, s, d in discovered:
            if url not in seen_page_urls:
                seen_page_urls.add(url)
                all_course_pages.append((url, s, d))

    # Step 2: Add extra pages (grad bulletin, certificates) not in UG indexes
    print("\n" + "="*60)
    print("STEP 2: Adding graduate bulletin + certificate pages...")
    print("="*60)
    for url, school, dept in EXTRA_PAGES:
        if url not in seen_page_urls:
            seen_page_urls.add(url)
            all_course_pages.append((url, school, dept))
            print(f"  + {school} / {dept}")

    print(f"\nTotal course pages to scrape: {len(all_course_pages)}")

    # Step 3: Scrape every course page
    print("\n" + "="*60)
    print("STEP 3: Scraping all course pages for AI keywords...")
    print("="*60)

    all_matches = []
    seen_entries = set()  # dedup by (code, title)

    for i, (url, school, dept) in enumerate(all_course_pages, 1):
        print(f"\n[{i}/{len(all_course_pages)}] {school} / {dept}")
        print(f"  {url}")

        entries = extract_courses(url, school, dept)

        for entry in entries:
            dedup_key = (entry["code"].lower(), entry["title"].lower()[:60])
            if dedup_key not in seen_entries:
                seen_entries.add(dedup_key)
                all_matches.append(entry)

        time.sleep(DELAY)

    # Step 4: Save results
    os.makedirs("data", exist_ok=True)
    out_path = "data/courses_raw_v2.json"
    with open(out_path, "w") as f:
        json.dump(all_matches, f, indent=2)

    # Step 5: Summary
    print("\n" + "="*60)
    print("COMPLETE")
    print("="*60)
    print(f"  Course pages scraped:   {len(all_course_pages)}")
    print(f"  AI-keyword matches:     {len(all_matches)}")
    print(f"  Saved to:               {out_path}")
    print()

    # Group by school for quick review
    from collections import Counter
    school_counts = Counter(e["school"] for e in all_matches)
    print("  Matches by school:")
    for school, count in sorted(school_counts.items()):
        print(f"    {count:3d}  {school}")

    print()
    print("⚠️  ALL entries marked verified=False.")
    print("   Open data/courses_raw_v2.json, review each entry,")
    print("   and manually add confirmed ones to courses.json.")
    print("="*60)


if __name__ == "__main__":
    main()

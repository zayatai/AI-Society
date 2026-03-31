import requests
from bs4 import BeautifulSoup
import json
import time

KEYWORDS = ["artificial intelligence", "machine learning", "deep learning"]

BULLETIN_PAGES = [
    ("https://www.albany.edu/undergraduate-bulletin/computer-science-courses.php", "Undergraduate"),
    ("https://www.albany.edu/undergraduate-bulletin/informatics-courses.php", "Undergraduate"),
    ("https://www.albany.edu/undergraduate-bulletin/electrical-computer-engineering-courses.php", "Undergraduate"),
    ("https://www.albany.edu/undergraduate-bulletin/mathematics-statistics-courses.php", "Undergraduate"),
    ("https://www.albany.edu/undergraduate-bulletin/public-administration-policy-courses.php", "Undergraduate"),
    ("https://www.albany.edu/graduate-bulletin/computer-science-courses.php", "Graduate"),
    ("https://www.albany.edu/graduate-bulletin/informatics-courses.php", "Graduate"),
    ("https://www.albany.edu/graduate-bulletin/mathematics-statistics-courses.php", "Graduate"),
    ("https://www.albany.edu/graduate-bulletin/public-administration-policy-courses.php", "Graduate"),
    ("https://www.albany.edu/academics/microcredentials/ai-plus-fundamentals", "Microcredential"),
    ("https://www.albany.edu/academics/microcredentials/ai-for-business", "Microcredential"),
    ("https://www.albany.edu/pace/programs", "Continuing Education"),
]

def matches(text):
    t = text.lower()
    return any(k in t for k in KEYWORDS)

courses = []

for url, level in BULLETIN_PAGES:
    print(f"Scraping {url}...")
    try:
        r = requests.get(url, timeout=10)
        soup = BeautifulSoup(r.text, "html.parser")
        main = soup.find("main") or soup.find("div", id="main-content") or soup.body
        paragraphs = main.find_all("p")
        for p in paragraphs:
            text = p.get_text(" ", strip=True)
            if matches(text):
                courses.append({
                    "source": "bulletin",
                    "level": level,
                    "description": text,
                    "url": url
                })
        time.sleep(1)
    except Exception as e:
        print(f"  Error: {e}")

print(f"\nFound {len(courses)} courses from web pages")

try:
    with open("data/courses_pdf.json") as f:
        pdf_courses = json.load(f)
except:
    pdf_courses = []

all_courses = pdf_courses + courses

with open("data/courses.json", "w") as f:
    json.dump(all_courses, f, indent=2)

print(f"Total courses saved: {len(all_courses)}")
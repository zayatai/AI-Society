import requests
import pdfplumber
import json
import io

KEYWORDS = ["artificial intelligence", "machine learning", "deep learning"]

PDFS = {
    "Fall 2026": "https://www.albany.edu/docs/schedule_of_classes/pdf/socfall.pdf",
    "Summer 2026": "https://www.albany.edu/docs/schedule_of_classes/pdf/socsummer.pdf",
    "Spring 2026": "https://www.albany.edu/docs/schedule_of_classes/pdf/socspring.pdf",
}

def matches(text):
    t = text.lower()
    return any(k in t for k in KEYWORDS)

courses = []

for term, url in PDFS.items():
    print(f"Downloading {term} PDF...")
    r = requests.get(url)
    with pdfplumber.open(io.BytesIO(r.content)) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            if not text:
                continue
            lines = text.split("\n")
            for i, line in enumerate(lines):
                if matches(line):
                    courses.append({
                        "term": term,
                        "line": line.strip(),
                        "context": " ".join(lines[max(0,i-1):i+3]).strip()
                    })
    print(f"Done. Found {len(courses)} matches so far.")

with open("data/courses.json", "w") as f:
    json.dump(courses, f, indent=2)

print(f"Saved {len(courses)} courses to data/courses.json")

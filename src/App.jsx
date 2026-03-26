import { useState, useMemo, useEffect } from "react";

/* ══════════════════════════════════════════════════
   VERIFIED COURSE DATA — 29 items, 0 fabricated
   Sources: SOC PDFs (Fall/Summer 2026), Bulletin,
   PaCE, News Center, SUNY-Google
══════════════════════════════════════════════════ */
const CATALOG = [
  // ── A. DEGREE PROGRAM ──
  { id:"A1", credentialType:"Degree Program", level:"Graduate", format:"In-Person / Online", term:"Fall 2026",
    school:"Massry School of Business", dept:"AI for Business",
    code:"", title:"M.S. in Artificial Intelligence for Business",
    description:"30-credit master\u2019s program combining technical AI proficiency with business acumen. Six concentration areas, both in-person and fully online tracks.",
    credits:30, instructor:"Dr. Sanjay Goel (Director)", prereqs:"Bachelor\u2019s degree; see admissions requirements",
    sourceUrl:"https://www.albany.edu/news-center/news/2025-ualbany-launches-masters-program-ai-business",
    source:"News Center (Dec 2025)", featured:true },

  // ── B. ACADEMIC MINOR ──
  { id:"B1", credentialType:"Academic Minor", level:"Undergraduate", format:"In-Person", term:"Fall 2026",
    school:"College of Arts & Sciences", dept:"Philosophy",
    code:"", title:"Ethics & Philosophy of Artificial Intelligence Minor",
    description:"18-credit interdisciplinary minor focused on ethics, law, philosophy, and social consequences of Artificial Intelligence.",
    credits:18, instructor:"Philosophy Department", prereqs:"None",
    sourceUrl:"https://www.albany.edu/news-center/news/2026-ualbany-launches-minor-ethics-and-philosophy-artificial-intelligence",
    source:"News Center (Jan 2026)", featured:true },

  // ── C. MICROCREDENTIALS ──
  { id:"C1", credentialType:"Microcredential", level:"Certificate", format:"Online", term:"Self-paced",
    school:"College of Arts & Sciences", dept:"PaCE / AI & Society College",
    code:"", title:"AI Plus Fundamentals",
    description:"For-credit undergraduate microcredential building foundational AI literacy across disciplines. Courses stack toward a degree.",
    credits:7, instructor:"Multiple faculty", prereqs:"Open to all UAlbany undergraduates",
    sourceUrl:"https://www.albany.edu/academics/microcredentials/ai-plus-fundamentals",
    source:"PaCE Website", featured:true },
  { id:"C2", credentialType:"Microcredential", level:"Certificate", format:"Online", term:"Self-paced",
    school:"Massry School of Business", dept:"Information Systems & Business Analytics",
    code:"", title:"Artificial Intelligence for Business",
    description:"For-credit graduate microcredential covering AI strategy, automation, and data-driven decision-making. Courses stack toward an MBA or relevant graduate degree.",
    credits:9, instructor:"Massry School faculty", prereqs:"Graduate standing or instructor permission",
    sourceUrl:"https://www.albany.edu/academics/microcredentials/ai-for-business",
    source:"PaCE Website", featured:true },

  // ── D. EXTERNAL CERTIFICATES ──
  { id:"D1", credentialType:"External Certificate", level:"Certificate", format:"Online", term:"Self-paced",
    school:"College of Arts & Sciences", dept:"Google",
    code:"", title:"Google AI Essentials",
    description:"Free, self-paced certificate introducing practical AI tools and responsible workflows. Available free to all SUNY students, faculty, and staff.",
    credits:null, instructor:"Google", prereqs:"SUNY affiliation required", isFree:true, offeredBy:"Google",
    sourceUrl:"https://www.suny.edu/google/ai-certificate/",
    source:"SUNY\u2013Google Partnership", featured:true },
  { id:"D2", credentialType:"External Certificate", level:"Certificate", format:"Online", term:"Self-paced",
    school:"College of Arts & Sciences", dept:"Google",
    code:"", title:"Google Career Certificate: Data Analytics with AI",
    description:"Free career certificate covering data analytics enhanced with AI-powered tools. Available free through the SUNY\u2013Google partnership.",
    credits:null, instructor:"Google", prereqs:"SUNY affiliation required", isFree:true, offeredBy:"Google",
    sourceUrl:"https://www.suny.edu/google/ai-certificate/",
    source:"SUNY\u2013Google Partnership", featured:true },

  // ── E. FALL 2026 COURSES (from SOC PDF) ──
  { id:"E1", credentialType:"Degree Course", level:"Undergraduate", format:"In-Person",
    term:"Fall 2026", school:"College of Emergency Preparedness, Homeland Security and Cybersecurity (CEHC)", dept:"Informatics",
    code:"CINF 135", title:"Concepts of Artificial Intelligence",
    description:"Foundational AI concepts including machine learning, NLP, computer vision, and ethical dimensions of AI deployment. No programming prerequisite.",
    credits:3, instructor:"Dr. M. Abdullah Canbaz", prereqs:"None",
    sourceUrl:"https://www.albany.edu/registrar/schedule-classes",
    source:"Schedule of Classes \u2014 Fall 2026", featured:false },
  { id:"E2", credentialType:"Degree Course", level:"Undergraduate", format:"In-Person",
    term:"Fall 2026", school:"College of Arts & Sciences", dept:"Philosophy",
    code:"APHI 213", title:"Ethics and Philosophy of AI",
    description:"Explores ethical, social, and philosophical questions raised by Artificial Intelligence, including bias, autonomy, surveillance, and accountability.",
    credits:3, instructor:"TBA", prereqs:"None",
    sourceUrl:"https://www.albany.edu/registrar/schedule-classes",
    source:"Schedule of Classes \u2014 Fall 2026", featured:false },
  { id:"E3", credentialType:"Degree Course", level:"Undergraduate", format:"In-Person",
    term:"Fall 2026", school:"College of Arts & Sciences", dept:"Economics",
    code:"AECO 372W", title:"AI for Business and Economics",
    description:"Applications of Artificial Intelligence in business and economic analysis, with emphasis on writing-intensive research.",
    credits:3, instructor:"Dr. Chun-Yu Ho", prereqs:"See department",
    sourceUrl:"https://www.albany.edu/registrar/schedule-classes",
    source:"Schedule of Classes \u2014 Fall 2026", featured:false },
  { id:"E4", credentialType:"Degree Course", level:"Graduate", format:"In-Person",
    term:"Fall 2026", school:"College of Arts & Sciences", dept:"Mathematics & Statistics",
    code:"AMAT 592", title:"Machine Learning",
    description:"Graduate-level machine learning covering supervised, unsupervised, and statistical learning methods. Restricted to DAT-MS and Mathematics students.",
    credits:3, instructor:"Dr. Jihun Han / Dr. Felix Ye", prereqs:"Graduate standing in DAT-MS or Math",
    sourceUrl:"https://www.albany.edu/registrar/schedule-classes",
    source:"Schedule of Classes \u2014 Fall 2026", featured:false },
  { id:"E5", credentialType:"Degree Course", level:"Graduate", format:"Online",
    term:"Fall 2026", school:"Massry School of Business", dept:"AI for Business",
    code:"BAIB 620", title:"Generative AI and Large Language Models",
    description:"Graduate course on generative AI systems, large language models, and their applications in business contexts.",
    credits:3, instructor:"TBA", prereqs:"Graduate standing",
    sourceUrl:"https://www.albany.edu/registrar/schedule-classes",
    source:"Schedule of Classes \u2014 Fall 2026", featured:false },
  { id:"E6", credentialType:"Degree Course", level:"Graduate", format:"In-Person",
    term:"Fall 2026", school:"Massry School of Business", dept:"AI for Business",
    code:"BAIB 630", title:"Swarm Intelligence",
    description:"Graduate course covering swarm intelligence algorithms, multi-agent systems, and collective AI behavior applied to business optimization.",
    credits:3, instructor:"TBA", prereqs:"Graduate standing",
    sourceUrl:"https://www.albany.edu/registrar/schedule-classes",
    source:"Schedule of Classes \u2014 Fall 2026", featured:false },
  { id:"E7", credentialType:"Degree Course", level:"Graduate", format:"Hybrid",
    term:"Fall 2026", school:"Massry School of Business", dept:"Digital Forensics",
    code:"BFOR 515", title:"Tools for AI and Data Analytics",
    description:"Graduate introduction to AI and data analytics tools, combining synchronous online and in-person instruction.",
    credits:3, instructor:"Srishti Gupta", prereqs:"Graduate standing",
    sourceUrl:"https://www.albany.edu/registrar/schedule-classes",
    source:"Schedule of Classes \u2014 Fall 2026", featured:false },
  { id:"E8", credentialType:"Degree Course", level:"Undergraduate", format:"Online",
    term:"Fall 2026", school:"College of Emergency Preparedness, Homeland Security and Cybersecurity (CEHC)", dept:"Informatics",
    code:"CINF 221", title:"AI Governance in Action",
    description:"Examines AI governance frameworks, policy implementation, and accountability structures in public and private sectors.",
    credits:3, instructor:"Emrah Tanyildizi", prereqs:"See department",
    sourceUrl:"https://www.albany.edu/registrar/schedule-classes",
    source:"Schedule of Classes \u2014 Fall 2026", featured:false },
  { id:"E9", credentialType:"Degree Course", level:"Undergraduate", format:"Online",
    term:"Fall 2026", school:"School of Education", dept:"Educational Theory & Practice",
    code:"ETAP 431", title:"AI in the Classroom",
    description:"How AI tools reshape teaching and learning \u2014 covering ethical use, algorithmic bias in EdTech, and classroom integration strategies.",
    credits:3, instructor:"Jason Vickers", prereqs:"See department",
    sourceUrl:"https://www.albany.edu/registrar/schedule-classes",
    source:"Schedule of Classes \u2014 Fall 2026", featured:false },
  { id:"E10", credentialType:"Degree Course", level:"Graduate", format:"Online",
    term:"Fall 2026", school:"School of Education", dept:"Educational Theory & Practice",
    code:"ETAP 531", title:"AI in the Classroom",
    description:"Graduate section. How AI tools reshape teaching and learning \u2014 covering ethical use, algorithmic bias in EdTech, and classroom integration strategies.",
    credits:3, instructor:"Jason Vickers", prereqs:"Graduate standing",
    sourceUrl:"https://www.albany.edu/registrar/schedule-classes",
    source:"Schedule of Classes \u2014 Fall 2026", featured:false },
  { id:"E11", credentialType:"Degree Course", level:"Undergraduate", format:"In-Person",
    term:"Fall 2026", school:"College of Nanotechnology, Science, and Engineering (CNSE)", dept:"Computer Science",
    code:"ICSI 235", title:"Artificial Intelligence",
    description:"Undergraduate introduction to AI: search, knowledge representation, reasoning, planning, and introductory machine learning.",
    credits:3, instructor:"Dr. Xin Li", prereqs:"ICSI 210 or equivalent",
    sourceUrl:"https://www.albany.edu/registrar/schedule-classes",
    source:"Schedule of Classes \u2014 Fall 2026", featured:false },
  { id:"E12", credentialType:"Degree Course", level:"Undergraduate", format:"In-Person",
    term:"Fall 2026", school:"College of Nanotechnology, Science, and Engineering (CNSE)", dept:"Computer Science",
    code:"ICSI 435", title:"Artificial Intelligence",
    description:"Upper-division AI covering advanced search, game playing, constraint satisfaction, probabilistic reasoning, and machine learning foundations.",
    credits:3, instructor:"Dr. Haoyu Wang", prereqs:"ICSI 235 or equivalent",
    sourceUrl:"https://www.albany.edu/registrar/schedule-classes",
    source:"Schedule of Classes \u2014 Fall 2026", featured:false },
  { id:"E13", credentialType:"Degree Course", level:"Graduate", format:"In-Person",
    term:"Fall 2026", school:"College of Nanotechnology, Science, and Engineering (CNSE)", dept:"Computer Science",
    code:"ICSI 535", title:"Artificial Intelligence",
    description:"Graduate section. Advanced AI covering search, game playing, constraint satisfaction, probabilistic reasoning, and machine learning.",
    credits:3, instructor:"Dr. Haoyu Wang", prereqs:"Graduate standing; ICSI 435 or equivalent",
    sourceUrl:"https://www.albany.edu/registrar/schedule-classes",
    source:"Schedule of Classes \u2014 Fall 2026", featured:false },
  { id:"E14", credentialType:"Degree Course", level:"Undergraduate", format:"In-Person",
    term:"Fall 2026", school:"College of Nanotechnology, Science, and Engineering (CNSE)", dept:"Computer Science",
    code:"ICSI 436", title:"Machine Learning",
    description:"Upper-division course on supervised and unsupervised learning, neural networks, model evaluation, and real-world ML applications.",
    credits:3, instructor:"Dr. Chong Liu", prereqs:"ICSI 235 or equivalent",
    sourceUrl:"https://www.albany.edu/registrar/schedule-classes",
    source:"Schedule of Classes \u2014 Fall 2026", featured:false },
  { id:"E15", credentialType:"Degree Course", level:"Graduate", format:"In-Person",
    term:"Fall 2026", school:"College of Nanotechnology, Science, and Engineering (CNSE)", dept:"Computer Science",
    code:"ICSI 536", title:"Machine Learning",
    description:"Graduate section. Supervised and unsupervised learning, neural networks, model evaluation, and real-world ML applications.",
    credits:3, instructor:"Dr. Chong Liu", prereqs:"Graduate standing",
    sourceUrl:"https://www.albany.edu/registrar/schedule-classes",
    source:"Schedule of Classes \u2014 Fall 2026", featured:false },
  { id:"E16", credentialType:"Degree Course", level:"Undergraduate", format:"In-Person",
    term:"Fall 2026", school:"College of Nanotechnology, Science, and Engineering (CNSE)", dept:"Electrical & Computer Engineering",
    code:"IECE 466", title:"Deep Learning",
    description:"Undergraduate deep learning covering neural network architectures, training methods, CNNs, RNNs, transformers, and applications.",
    credits:3, instructor:"Dr. Saurabh Sihag", prereqs:"See department",
    sourceUrl:"https://www.albany.edu/registrar/schedule-classes",
    source:"Schedule of Classes \u2014 Fall 2026", featured:false },
  { id:"E17", credentialType:"Degree Course", level:"Graduate", format:"In-Person",
    term:"Fall 2026", school:"College of Nanotechnology, Science, and Engineering (CNSE)", dept:"Electrical & Computer Engineering",
    code:"IECE 566", title:"Deep Learning",
    description:"Graduate section. Deep neural network architectures, training methods, CNNs, RNNs, transformers, and advanced applications.",
    credits:3, instructor:"Dr. Saurabh Sihag", prereqs:"Graduate standing",
    sourceUrl:"https://www.albany.edu/registrar/schedule-classes",
    source:"Schedule of Classes \u2014 Fall 2026", featured:false },

  // ── F. SUMMER 2026 COURSES ──
  { id:"F1", credentialType:"Degree Course", level:"Undergraduate", format:"Online",
    term:"Summer 2026", school:"College of Emergency Preparedness, Homeland Security and Cybersecurity (CEHC)", dept:"Informatics",
    code:"CINF 135", title:"Concepts of Artificial Intelligence",
    description:"Foundational AI concepts including machine learning, NLP, computer vision, and ethical dimensions. Online asynchronous format for summer session.",
    credits:3, instructor:"TBA", prereqs:"None",
    sourceUrl:"https://www.albany.edu/registrar/schedule-classes",
    source:"Schedule of Classes \u2014 Summer 2026", featured:false },
  { id:"F2", credentialType:"Degree Course", level:"Undergraduate", format:"Online",
    term:"Summer 2026", school:"College of Arts & Sciences", dept:"Philosophy",
    code:"APHI 213", title:"Ethics and Philosophy of AI",
    description:"Ethical, social, and philosophical questions raised by Artificial Intelligence. Online asynchronous format for summer session.",
    credits:3, instructor:"TBA", prereqs:"None",
    sourceUrl:"https://www.albany.edu/registrar/schedule-classes",
    source:"Schedule of Classes \u2014 Summer 2026", featured:false },
  { id:"F3", credentialType:"Degree Course", level:"Graduate", format:"Online",
    term:"Summer 2026", school:"College of Arts & Sciences", dept:"Mathematics & Statistics",
    code:"AMAT 592", title:"Machine Learning",
    description:"Graduate machine learning, online asynchronous format. Restricted to DAT-MS students for summer session.",
    credits:3, instructor:"Dr. Yunlong Feng", prereqs:"DAT-MS standing",
    sourceUrl:"https://www.albany.edu/registrar/schedule-classes",
    source:"Schedule of Classes \u2014 Summer 2026", featured:false },
  { id:"F4", credentialType:"Degree Course", level:"Graduate", format:"Online",
    term:"Summer 2026", school:"School of Education", dept:"Educational Theory & Practice",
    code:"ETAP 608", title:"AI Literacy and Ethics",
    description:"Graduate course on AI literacy for educators \u2014 covering responsible adoption, ethical frameworks, and instructional applications of AI tools.",
    credits:3, instructor:"Dr. Haesol Bae", prereqs:"Graduate standing",
    sourceUrl:"https://www.albany.edu/registrar/schedule-classes",
    source:"Schedule of Classes \u2014 Summer 2026", featured:false },

  // ── G. BULLETIN-ONLY (not scheduled 2026) ──
  { id:"G1", credentialType:"Degree Course", level:"Undergraduate", format:"In-Person",
    term:"Other", school:"College of Arts & Sciences", dept:"AI & Society College",
    code:"UUNI 118", title:"Introduction to Artificial Intelligence",
    description:"One-credit interdisciplinary course covering AI fundamentals, societal implications, and ethical considerations. Not currently scheduled for 2026.",
    credits:1, instructor:"AI & Society Dissertation Fellows", prereqs:"None",
    sourceUrl:"https://www.albany.edu/undergraduate-bulletin/faculty-initiated-interdisciplinary-courses.php",
    source:"Undergraduate Bulletin", featured:false },
  { id:"G2", credentialType:"Degree Course", level:"Undergraduate", format:"TBD",
    term:"Other", school:"College of Arts & Sciences", dept:"Philosophy",
    code:"APHI 380", title:"AI in Society: Ethical and Legal Issues",
    description:"Signature course of the new Ethics & Philosophy of AI minor. Covers ethical and legal dimensions of AI in society. Not yet scheduled; announced January 2026.",
    credits:3, instructor:"Philosophy Department", prereqs:"See department",
    sourceUrl:"https://www.albany.edu/news-center/news/2026-ualbany-launches-minor-ethics-and-philosophy-artificial-intelligence",
    source:"News Center (Jan 2026)", featured:false },
];

/* ── Filter options ── */
const CRED_TYPES = ["Degree Course","Degree Program","Academic Minor","Microcredential","External Certificate"];
const LEVELS = ["Undergraduate","Graduate","Certificate"];
const TERMS = ["Fall 2026","Summer 2026","Self-paced","Other"];
const FORMATS = ["In-Person","Online","Hybrid","Arranged","TBD"];
const ALL_SCHOOLS = [
  "College of Arts & Sciences",
  "College of Emergency Preparedness, Homeland Security and Cybersecurity (CEHC)",
  "College of Nanotechnology, Science, and Engineering (CNSE)",
  "Massry School of Business",
  "School of Education",
  "Rockefeller College of Public Affairs & Policy",
  "College of Integrated Health Sciences",
  "School of Criminal Justice",
  "School of Social Welfare",
];

/* ══════════════════════════════════════════════════
   STYLES
══════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,300;0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700;1,14..32,400&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

:root{
  --bg: #f7f5fb;
  --surface: #ffffff;
  --surface-muted: #f3eef8;
  --text: #1f1b24;
  --muted: #645b70;
  --border: #e3dceb;
  --primary: #46166b;
  --primary-soft: #efe7f6;
  --primary-hover: #5a1d8a;
  --gold: #C69214;
  --shadow: 0 10px 28px rgba(49,31,74,0.08);
  --shadow-sm: 0 2px 8px rgba(49,31,74,0.06);
  --radius: 18px;
  --radius-sm: 14px;
  --radius-pill: 999px;
  --container: 1120px;
  --font: 'Inter', system-ui, -apple-system, sans-serif;
}

html{scroll-behavior:smooth}
body{margin:0;font-family:var(--font);background:var(--bg);color:var(--text);line-height:1.6;-webkit-font-smoothing:antialiased}
button,select,input{font-family:var(--font)}
a{color:inherit;text-decoration:none}

.app{display:flex;flex-direction:column;min-height:100vh}

/* ─── HEADER ─── */
.site-header{
  position:sticky;top:0;z-index:20;
  background:rgba(247,245,251,0.92);
  backdrop-filter:blur(16px);
  -webkit-backdrop-filter:blur(16px);
  border-bottom:1px solid rgba(227,220,235,0.9);
}
.header-inner{
  width:min(var(--container),calc(100% - 2rem));
  margin:0 auto;
  display:flex;align-items:center;justify-content:space-between;
  gap:1.25rem;padding:0.85rem 0;
}
.brand{display:flex;align-items:center;gap:0.75rem;cursor:pointer;text-decoration:none}
.brand-icon{
  width:44px;height:44px;border-radius:12px;
  background:var(--primary);display:flex;align-items:center;justify-content:center;
  color:#fff;font-weight:800;font-size:1.1rem;flex-shrink:0;
}
.brand-copy{display:flex;flex-direction:column}
.brand-kicker{font-size:0.72rem;color:var(--primary);letter-spacing:0.06em;text-transform:uppercase;font-weight:700;line-height:1.3}
.brand-title{font-size:0.92rem;font-weight:600;color:var(--text);line-height:1.3}
.site-nav{display:flex;align-items:center;gap:0.3rem}
.nav-link{
  padding:0.6rem 1rem;border-radius:var(--radius-pill);
  color:var(--muted);font-size:0.9rem;font-weight:500;
  cursor:pointer;border:none;background:none;
  transition:all 0.18s ease;
}
.nav-link:hover{background:var(--primary-soft);color:var(--primary)}
.nav-link.active{background:var(--primary-soft);color:var(--primary);font-weight:600}

/* ─── PAGE HEADER ─── */
.page-header{padding:2.5rem 0 0.5rem}
.page-header .container{width:min(var(--container),calc(100% - 2rem));margin:0 auto}
.eyebrow{margin:0 0 0.5rem;color:var(--primary);text-transform:uppercase;letter-spacing:0.06em;font-size:0.78rem;font-weight:700}
.page-title{font-size:clamp(1.6rem,3vw,2.4rem);font-weight:700;line-height:1.15;margin:0 0 0.5rem;color:var(--text)}
.page-desc{color:var(--muted);font-size:0.95rem;margin:0 0 1.2rem;max-width:700px}

/* ─── SEARCH ─── */
.search-input{
  width:100%;border:1px solid var(--border);background:var(--surface);
  border-radius:var(--radius-sm);padding:0.85rem 1rem;
  font:inherit;font-size:0.92rem;color:var(--text);outline:none;
  transition:border-color 0.18s, box-shadow 0.18s;
}
.search-input:focus{border-color:rgba(70,22,107,0.45);box-shadow:0 0 0 4px rgba(70,22,107,0.08)}
.search-input::placeholder{color:#b0a8c0}

/* ─── CATALOG LAYOUT ─── */
.catalog-layout{
  width:min(var(--container),calc(100% - 2rem));margin:0 auto;
  display:grid;grid-template-columns:260px 1fr;gap:1.5rem;
  padding:1.5rem 0 3rem;align-items:start;
}

/* ─── SIDEBAR ─── */
.sidebar{
  background:var(--surface);border:1px solid var(--border);
  border-radius:var(--radius);box-shadow:var(--shadow-sm);
  position:sticky;top:76px;overflow:hidden;
}
.sidebar-header{
  padding:0.85rem 1.1rem;border-bottom:1px solid var(--border);
  display:flex;align-items:center;justify-content:space-between;
  background:var(--surface-muted);
}
.sidebar-label{font-size:0.72rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--muted)}
.sidebar-clear{background:none;border:none;font-size:0.78rem;font-weight:600;color:var(--primary);cursor:pointer;padding:0}
.sidebar-clear:hover{text-decoration:underline}

.filter-group{border-bottom:1px solid var(--border)}
.filter-group:last-child{border-bottom:none}
.fg-header{
  padding:0.7rem 1.1rem;display:flex;align-items:center;justify-content:space-between;
  cursor:pointer;user-select:none;transition:background 0.12s;
}
.fg-header:hover{background:var(--surface-muted)}
.fg-label{font-size:0.82rem;font-weight:600;color:var(--text)}
.fg-arrow{font-size:0.55rem;color:#b0a8c0;transition:transform 0.2s}
.fg-arrow.open{transform:rotate(180deg)}
.fg-options{padding:0.3rem 1.1rem 0.85rem;display:flex;flex-direction:column;gap:0.45rem}
.fg-opt{display:flex;align-items:flex-start;gap:0.5rem;cursor:pointer;font-size:0.82rem;color:var(--muted);line-height:1.4}
.fg-opt input{accent-color:var(--primary);cursor:pointer;margin-top:3px;flex-shrink:0}

/* ─── RESULTS ─── */
.results{display:flex;flex-direction:column;gap:0.85rem}
.results-bar{display:flex;align-items:center;justify-content:space-between;gap:0.75rem;margin-bottom:0.25rem}
.results-count{font-size:0.8rem;color:var(--muted);white-space:nowrap}

/* ─── CARDS ─── */
.card{
  background:var(--surface);border:1px solid var(--border);
  border-radius:var(--radius);box-shadow:var(--shadow);
  overflow:hidden;transition:transform 0.18s ease, border-color 0.18s ease;
  cursor:pointer;
}
.card:hover{transform:translateY(-2px);border-color:rgba(70,22,107,0.26)}
.card-body{padding:1.15rem 1.25rem}
.card-topline{display:flex;gap:0.4rem;flex-wrap:wrap;margin-bottom:0.55rem}
.badge{
  display:inline-flex;align-items:center;
  background:var(--primary-soft);color:var(--primary);
  padding:0.28rem 0.6rem;border-radius:var(--radius-pill);
  font-size:0.72rem;font-weight:700;white-space:nowrap;
}
.badge.free{background:#d2f4e3;color:#0b5e31;border:1px solid #9de3bf}
.badge.provider{background:#e8f0fe;color:#1a47b0}
.card-title{font-size:1rem;font-weight:600;color:var(--text);line-height:1.3;margin-bottom:0.15rem}
.card-code{font-size:0.72rem;font-weight:700;color:var(--primary);letter-spacing:0.05em;text-transform:uppercase;margin-bottom:0.2rem}
.card-meta{
  display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;
  margin:0.65rem 0;font-size:0.8rem;color:var(--muted);
}
.card-meta p{margin:0}
.meta-label{display:block;font-size:0.7rem;font-weight:700;color:var(--text);margin-bottom:0.1rem}
.card-desc{font-size:0.84rem;color:var(--muted);line-height:1.6;margin-bottom:0.65rem}
.card-footer{
  padding:0.75rem 1.25rem;border-top:1px solid var(--border);
  display:flex;align-items:center;justify-content:space-between;gap:0.5rem;
  background:var(--surface-muted);
}
.card-source{font-size:0.68rem;color:#b0a8c0}
.text-link{color:var(--primary);font-weight:600;font-size:0.82rem;text-decoration:none;transition:color 0.15s}
.text-link:hover{text-decoration:underline;color:var(--primary-hover)}

/* ─── MODAL ─── */
.overlay{
  position:fixed;inset:0;background:rgba(31,27,36,0.55);z-index:100;
  display:flex;align-items:flex-start;justify-content:center;
  padding:3rem 1.5rem;overflow-y:auto;
  backdrop-filter:blur(6px);animation:fadeIn 0.15s ease;
}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
.modal{
  background:var(--surface);border-radius:var(--radius);
  max-width:720px;width:100%;box-shadow:0 24px 64px rgba(49,31,74,0.2);
  overflow:hidden;animation:slideUp 0.2s cubic-bezier(0.16,1,0.3,1);
}
@keyframes slideUp{from{transform:translateY(16px);opacity:0}to{transform:translateY(0);opacity:1}}
.modal-header{
  background:var(--primary);padding:1.5rem 1.75rem 1.3rem;position:relative;
}
.modal-close{
  position:absolute;top:0.85rem;right:0.85rem;
  background:rgba(255,255,255,0.15);border:none;color:#fff;
  width:30px;height:30px;border-radius:50%;cursor:pointer;font-size:0.85rem;
  display:flex;align-items:center;justify-content:center;transition:background 0.15s;
}
.modal-close:hover{background:rgba(255,255,255,0.28)}
.modal-badges{display:flex;gap:0.4rem;flex-wrap:wrap;margin-bottom:0.5rem}
.modal-badges .badge{background:rgba(255,255,255,0.18);color:#fff}
.modal-badges .badge.free{background:#d2f4e3;color:#0b5e31}
.modal-title{font-size:1.35rem;font-weight:700;color:#fff;line-height:1.2}
.modal-body{padding:1.5rem 1.75rem}
.modal-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.85rem 1.5rem;margin-bottom:1.2rem}
.modal-field-label{font-size:0.65rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--muted);margin-bottom:0.2rem}
.modal-field-value{font-size:0.88rem;color:var(--text);line-height:1.55}
.modal-section{margin-bottom:1rem}
.modal-footer{
  padding:1rem 1.75rem;border-top:1px solid var(--border);
  display:flex;align-items:center;justify-content:space-between;gap:0.75rem;flex-wrap:wrap;
}
.btn{
  display:inline-flex;align-items:center;gap:0.3rem;
  padding:0.55rem 1rem;border-radius:var(--radius-sm);
  font-size:0.82rem;font-weight:600;cursor:pointer;border:none;
  transition:all 0.15s;text-decoration:none;white-space:nowrap;
}
.btn-primary{background:var(--primary);color:#fff}
.btn-primary:hover{background:var(--primary-hover)}
.btn-ghost{background:transparent;color:var(--text);border:1px solid var(--border)}
.btn-ghost:hover{border-color:var(--primary);color:var(--primary)}
.btn-free{background:#14653c;color:#fff}
.btn-free:hover{background:#0d5230}


/* ─── ABOUT PAGE ─── */
.about-page{min-height:calc(100vh - 180px)}

/* Hero */
.about-hero{
  background:var(--primary);padding:2.5rem 1.5rem 2rem;position:relative;overflow:hidden;
}
.about-hero::after{
  content:'';position:absolute;bottom:0;left:0;right:0;height:3px;
  background:linear-gradient(90deg,transparent,#C69214 35%,#dba830 65%,transparent);
}
.about-hero-inner{max-width:760px;margin:0 auto;position:relative}
.about-hero-kicker{
  display:block;font-size:0.82rem;font-weight:700;color:#C69214;
  letter-spacing:0.05em;margin-bottom:0.4rem;text-transform:uppercase;
}
.about-hero-title{
  font-size:clamp(1.6rem,3vw,2.2rem);font-weight:700;color:#fff;
  line-height:1.15;margin:0 0 0.5rem;
}
.about-hero-sub{
  font-size:0.88rem;color:rgba(255,255,255,0.5);line-height:1.65;
  max-width:520px;margin:0;
}

/* Sub-tab bar */
.about-tabs-bar{
  background:var(--surface);border-bottom:1px solid var(--border);
  position:sticky;top:60px;z-index:10;
}
.about-tabs-inner{
  max-width:760px;margin:0 auto;padding:0 1.5rem;
  display:flex;gap:0;overflow-x:auto;
}
.about-tab{
  background:none;border:none;border-bottom:2px solid transparent;
  padding:0.7rem 0.95rem;margin-bottom:-1px;
  font-size:0.84rem;font-weight:500;color:var(--muted);
  cursor:pointer;white-space:nowrap;transition:all 0.15s;
}
.about-tab:hover{color:var(--text)}
.about-tab.active{color:var(--primary);border-bottom-color:var(--primary);font-weight:600}

/* Content area */
.about-content{
  max-width:760px;margin:0 auto;padding:1.75rem 1.5rem 3rem;
}

/* Section blocks */
.about-section{margin-bottom:1.75rem}
.about-sh{font-size:1.1rem;font-weight:700;color:var(--text);margin:0 0 0.75rem}
.about-p{font-size:0.88rem;color:var(--muted);line-height:1.8;margin:0 0 0.6rem}
.about-p a{color:var(--primary);font-weight:600}
.about-p a:hover{text-decoration:underline}
.about-p strong{color:var(--text)}

/* Info callout */
.about-callout{
  background:var(--surface-muted);border:1px solid var(--border);
  border-radius:var(--radius-sm);padding:1rem 1.25rem;margin-bottom:1.5rem;
}
.about-callout p{font-size:0.84rem;color:var(--muted);line-height:1.7;margin:0 0 0.4rem}
.about-callout p:last-child{margin-bottom:0}
.about-callout a{color:var(--primary);font-weight:600}

/* Person card (used in Leadership, Fellows) */
.person-grid{display:grid;grid-template-columns:1fr;gap:0.7rem}
.person-card{
  display:flex;gap:0.85rem;align-items:flex-start;
  background:var(--surface);border:1px solid var(--border);
  border-radius:var(--radius-sm);padding:1rem 1.15rem;
  transition:border-color 0.15s;
}
.person-card:hover{border-color:rgba(70,22,107,0.25)}
.person-av{
  width:40px;height:40px;border-radius:50%;flex-shrink:0;
  background:var(--primary);color:#fff;font-weight:700;font-size:0.78rem;
  display:flex;align-items:center;justify-content:center;
}
.person-av.grad{background:linear-gradient(135deg,var(--primary),#8a3cc0)}
.person-name{font-size:0.9rem;font-weight:600;color:var(--text)}
.person-role{font-size:0.78rem;color:var(--primary);font-weight:600;margin-top:1px}
.person-dept{font-size:0.76rem;color:var(--muted);margin-top:2px;line-height:1.45}
.person-bio{font-size:0.8rem;color:var(--muted);line-height:1.65;margin-top:0.4rem}

/* Opportunity / Fellowship type cards */
.opp-card{
  background:var(--surface);border:1px solid var(--border);
  border-radius:var(--radius-sm);padding:1rem 1.15rem;margin-bottom:0.65rem;
}
.opp-card h3{font-size:0.9rem;font-weight:600;color:var(--text);margin:0 0 0.35rem}
.opp-card p{font-size:0.82rem;color:var(--muted);line-height:1.65;margin:0}

/* Placeholder block */
.placeholder-block{
  background:var(--surface-muted);border:1px dashed var(--border);
  border-radius:var(--radius-sm);padding:2rem 1.5rem;text-align:center;
  color:var(--muted);font-size:0.85rem;
}

@media(max-width:640px){
  .about-hero{padding:2rem 1rem 1.5rem}
  .about-content{padding:1.25rem 1rem 2.5rem}
  .about-tabs-inner{padding:0 0.75rem}
  .about-tab{padding:0.6rem 0.7rem;font-size:0.78rem}
  .person-card{flex-direction:column;gap:0.5rem}
}

/* ─── FOOTER ─── */
.site-footer{
  border-top:1px solid var(--border);background:#f3eff8;margin-top:auto;
}
.footer-inner{
  width:min(var(--container),calc(100% - 2rem));margin:0 auto;
  display:flex;justify-content:space-between;align-items:center;
  gap:1rem;padding:1rem 0;font-size:0.8rem;color:var(--muted);
}
.footer-inner a{color:var(--primary);font-weight:600}

/* ─── EMPTY ─── */
.empty{text-align:center;padding:3rem 1.5rem;color:var(--muted)}
.empty-icon{font-size:2rem;margin-bottom:0.75rem}
.empty p{font-size:0.9rem;max-width:340px;margin:0 auto}

/* ─── RESPONSIVE ─── */
@media(max-width:960px){
  .catalog-layout{grid-template-columns:1fr}
  .sidebar{position:static}
  .header-inner{flex-direction:column;align-items:flex-start}
  .site-nav{width:100%;justify-content:flex-start}
  .card-meta{grid-template-columns:1fr}
  .modal-grid{grid-template-columns:1fr}
  .footer-inner{flex-direction:column;align-items:flex-start}
}
`;

/* ── Filter Group Component ── */
function FilterGroup({ label, options, selected, onChange }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="filter-group">
      <div className="fg-header" onClick={() => setOpen(o => !o)}>
        <span className="fg-label">{label}</span>
        <span className={`fg-arrow${open ? " open" : ""}`}>▾</span>
      </div>
      {open && (
        <div className="fg-options">
          {options.map(opt => (
            <label key={opt} className="fg-opt">
              <input
                type="checkbox"
                checked={selected.includes(opt)}
                onChange={() => onChange(selected.includes(opt) ? selected.filter(x => x !== opt) : [...selected, opt])}
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Detail Modal ── */
function DetailModal({ item, onClose }) {
  useEffect(() => {
    const h = e => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  const related = CATALOG.filter(c => c.id !== item.id && c.school === item.school).slice(0, 3);

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <button className="modal-close" onClick={onClose}>✕</button>
          <div className="modal-badges">
            <span className="badge">{item.credentialType}</span>
            <span className="badge">{item.level}</span>
            {item.isFree && <span className="badge free">Free</span>}
            {item.offeredBy && <span className="badge provider">by {item.offeredBy}</span>}
          </div>
          <div className="modal-title">{item.code ? `${item.code}: ` : ""}{item.title}</div>
        </div>
        <div className="modal-body">
          <div className="modal-grid">
            <div><div className="modal-field-label">Term</div><div className="modal-field-value">{item.term}</div></div>
            <div><div className="modal-field-label">Format</div><div className="modal-field-value">{item.format}</div></div>
            <div><div className="modal-field-label">Level</div><div className="modal-field-value">{item.level}</div></div>
            <div><div className="modal-field-label">School</div><div className="modal-field-value">{item.school}</div></div>
            {item.code && <div><div className="modal-field-label">Course Code</div><div className="modal-field-value">{item.code}</div></div>}
            {item.credits && <div><div className="modal-field-label">Credits</div><div className="modal-field-value">{item.credits}</div></div>}
            <div><div className="modal-field-label">Instructor</div><div className="modal-field-value">{item.instructor}</div></div>
            <div style={{gridColumn:"1/-1"}}><div className="modal-field-label">Prerequisites</div><div className="modal-field-value">{item.prereqs}</div></div>
          </div>
          <div className="modal-section">
            <div className="modal-field-label">Description</div>
            <div className="modal-field-value" style={{marginTop:4}}>{item.description}</div>
          </div>
          {related.length > 0 && (
            <div className="modal-section">
              <div className="modal-field-label" style={{marginBottom:8}}>Other offerings from {item.school}</div>
              {related.map(r => (
                <div key={r.id} style={{background:"var(--surface-muted)",borderRadius:8,padding:"0.6rem 0.85rem",marginBottom:6,fontSize:"0.82rem",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span><strong>{r.code ? `${r.code}: ` : ""}{r.title}</strong></span>
                  <span className="badge" style={{fontSize:"0.68rem"}}>{r.credentialType}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="modal-footer">
          <span style={{fontSize:"0.7rem",color:"#b0a8c0"}}>Source: {item.source}</span>
          <a className={`btn ${item.isFree ? "btn-free" : "btn-primary"}`} href={item.sourceUrl} target="_blank" rel="noopener noreferrer">
            {item.isFree ? "Enroll Free \u2192" : "Official Listing \u2192"}
          </a>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   COURSES PAGE
══════════════════════════════════════════════════ */
function CoursesPage() {
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState(null);
  const [filters, setFilters] = useState({ cred: [], level: [], term: [], format: [], school: [] });
  const setF = (key, val) => setFilters(prev => ({ ...prev, [key]: val }));
  const clearAll = () => setFilters({ cred: [], level: [], term: [], format: [], school: [] });
  const activeCount = Object.values(filters).flat().length;

  const filtered = useMemo(() => {
    return CATALOG.filter(c => {
      const lo = q.toLowerCase();
      const matchQ = !q || c.title.toLowerCase().includes(lo) || c.code.toLowerCase().includes(lo) ||
        c.description.toLowerCase().includes(lo) || c.dept.toLowerCase().includes(lo) || c.school.toLowerCase().includes(lo);
      const matchCred = !filters.cred.length || filters.cred.includes(c.credentialType);
      const matchLevel = !filters.level.length || filters.level.includes(c.level);
      const matchTerm = !filters.term.length || filters.term.includes(c.term);
      const matchFormat = !filters.format.length || filters.format.some(f => c.format.includes(f));
      const matchSchool = !filters.school.length || filters.school.includes(c.school);
      return matchQ && matchCred && matchLevel && matchTerm && matchFormat && matchSchool;
    });
  }, [q, filters]);

  return (
    <>
      <div className="page-header">
        <div className="container">
          <p className="eyebrow">Courses & Programs</p>
          <h1 className="page-title">Artificial Intelligence courses and programs at University at Albany</h1>
          <p className="page-desc">Browse degree courses, microcredentials, certificates, and programs across all nine schools and colleges.</p>
          <input
            className="search-input"
            placeholder="Search by title, code, school, or keyword\u2026"
            value={q}
            onChange={e => setQ(e.target.value)}
            aria-label="Search courses"
          />
        </div>
      </div>

      <div className="catalog-layout">
        <aside className="sidebar">
          <div className="sidebar-header">
            <span className="sidebar-label">Filters{activeCount > 0 ? ` (${activeCount})` : ""}</span>
            {activeCount > 0 && <button className="sidebar-clear" onClick={clearAll}>Clear all</button>}
          </div>
          <FilterGroup label="Credential Type" options={CRED_TYPES} selected={filters.cred} onChange={v => setF("cred", v)} />
          <FilterGroup label="Level" options={LEVELS} selected={filters.level} onChange={v => setF("level", v)} />
          <FilterGroup label="Term" options={TERMS} selected={filters.term} onChange={v => setF("term", v)} />
          <FilterGroup label="Format" options={FORMATS} selected={filters.format} onChange={v => setF("format", v)} />
          <FilterGroup label="School" options={ALL_SCHOOLS} selected={filters.school} onChange={v => setF("school", v)} />
        </aside>

        <main className="results">
          <div className="results-bar">
            <span className="results-count">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
          </div>

          {filtered.length === 0 && (
            <div className="empty">
              <div className="empty-icon">🔍</div>
              <p>No results match your filters.</p>
            </div>
          )}

          {filtered.map(c => (
            <div key={c.id} className="card" onClick={() => setSelected(c)}>
              <div className="card-body">
                <div className="card-topline">
                  <span className="badge">{c.credentialType}</span>
                  <span className="badge">{c.level}</span>
                  {c.isFree && <span className="badge free">Free</span>}
                  {c.offeredBy && <span className="badge provider">by {c.offeredBy}</span>}
                </div>
                {c.code && <div className="card-code">{c.code}</div>}
                <div className="card-title">{c.title}</div>
                <div className="card-meta">
                  <p><span className="meta-label">School</span>{c.school}</p>
                  {c.credits && <p><span className="meta-label">Credits</span>{c.credits}</p>}
                  <p><span className="meta-label">Format</span>{c.format}</p>
                  <p><span className="meta-label">Instructor</span>{c.instructor}</p>
                </div>
                <p className="card-desc">{c.description}</p>
              </div>
              <div className="card-footer">
                <span className="card-source">{c.source}</span>
                <a className="text-link" href={c.sourceUrl} target="_blank" rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}>
                  {c.isFree ? "Enroll Free \u2192" : "View source \u2192"}
                </a>
              </div>
            </div>
          ))}
        </main>
      </div>

      {selected && <DetailModal item={selected} onClose={() => setSelected(null)} />}
    </>
  );
}


/* ══════════════════════════════════════════════════
   ABOUT PAGE — clean sub-tab interface
══════════════════════════════════════════════════ */
const ABOUT_TABS = ["About","Leadership","Advisory Board","Fellowships","Opportunities"];

function AboutPage({ goTo }) {
  const [tab, setTab] = useState("About");

  return (
    <div className="about-page">
      <div className="about-hero">
        <div className="about-hero-inner">
          <span className="about-hero-kicker">AI &amp; Society College</span>
          <h1 className="about-hero-title">Artificial Intelligence UAlbany</h1>
          <p className="about-hero-sub">
            Preparing students, faculty and staff for a world shaped by AI &mdash; with emphasis
            on trustworthiness, equity, privacy and accountability.
          </p>
        </div>
      </div>

      <div className="about-tabs-bar">
        <div className="about-tabs-inner">
          {ABOUT_TABS.map(t => (
            <button key={t} className={`about-tab${tab === t ? " active" : ""}`} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>
      </div>

      <div className="about-content">

        {/* ═══ ABOUT ═══ */}
        {tab === "About" && (
          <>
            <div className="about-callout">
              <p>
                This portal aggregates data from the UAlbany Registrar, school and department
                websites, and the PaCE microcredential catalog. Each listing links to its
                authoritative source.
              </p>
            </div>

            <section className="about-section">
              <h2 className="about-sh">About the College</h2>
              <p className="about-p">
                Founded in Spring 2025 with a <strong>$2.4 million investment from SUNY</strong>, the
                AI &amp; Society College prepares undergraduate and graduate students, faculty and staff
                for a world shaped by artificial intelligence.
              </p>
              <p className="about-p">
                The College serves as a catalyst integrating AI education across all nine schools and
                colleges at the University at Albany. Every student &mdash; whether pursuing a degree in
                STEM, business, social sciences or the arts &mdash; has access to AI-infused learning
                through cross-disciplinary courses, microcredentials and teaching initiatives.
              </p>
            </section>

            <section className="about-section">
              <h2 className="about-sh">Physical Space &amp; AI Makerspace</h2>
              <p className="about-p">
                The College will be housed in <strong>Lecture Center 30 &amp; 31</strong>, featuring
                individual and group workspaces, an AI-enabled meeting room, a lounge for networking,
                and GPU workstations in the AI Makerspace.
              </p>
              <p className="about-p">
                The Makerspace will be open to all UAlbany community members, supporting hands-on
                exploration of generative, predictive and automated AI.
              </p>
            </section>

            <section className="about-section">
              <h2 className="about-sh">Contact</h2>
              <p className="about-p">
                Email: <a href="mailto:aisocietycollege@albany.edu">aisocietycollege@albany.edu</a>
              </p>
              <p className="about-p">
                <a href="https://www.albany.edu/ai-plus/ai-society-college" target="_blank" rel="noopener noreferrer">
                  Visit official AI &amp; Society College page &rarr;
                </a>
              </p>
              <p className="about-p">
                <a href="https://www.linkedin.com/showcase/ai-society-ualbany/posts/?feedView=all" target="_blank" rel="noopener noreferrer">
                  Follow on LinkedIn &rarr;
                </a>
              </p>
            </section>
          </>
        )}

        {/* ═══ LEADERSHIP ═══ */}
        {tab === "Leadership" && (
          <>
            <section className="about-section">
              <h2 className="about-sh">College Leadership</h2>
              <div className="person-grid">
                <div className="person-card">
                  <div className="person-av">HE</div>
                  <div>
                    <div className="person-name">Hany Elgala</div>
                    <div className="person-role">Acting Director, AI &amp; Society College</div>
                    <div className="person-dept">Associate Professor, Electrical &amp; Computer Engineering, CNSE</div>
                    <p className="person-bio">
                      Director of the Signals and Networks Lab (SINE Lab). Research focuses on visible
                      light communications, LiFi networks, and AI in wireless communications.
                    </p>
                    <a className="text-link" style={{fontSize:"0.78rem"}} href="https://www.albany.edu/ece/faculty/hany-elgala" target="_blank" rel="noopener noreferrer">View profile &rarr;</a>
                  </div>
                </div>
                <div className="person-card">
                  <div className="person-av">MG</div>
                  <div>
                    <div className="person-name">Mila Gasc&oacute;-Hernandez</div>
                    <div className="person-role">Acting Associate Director</div>
                    <div className="person-dept">Associate Professor, Public Administration &amp; Policy, Rockefeller College</div>
                    <p className="person-bio">
                      Research focuses on digital government, AI governance, and technology policy.
                      Leads the AI for Public Good initiative across SUNY institutions.
                    </p>
                    <a className="text-link" style={{fontSize:"0.78rem"}} href="https://www.albany.edu/rockefeller/faculty/mila-gasco-hernandez" target="_blank" rel="noopener noreferrer">View profile &rarr;</a>
                  </div>
                </div>
              </div>
            </section>

            <section className="about-section">
              <h2 className="about-sh">Founding Context</h2>
              <p className="about-p">
                Part of UAlbany&rsquo;s <strong>AI Plus</strong> initiative (launched 2022), which includes
                the largest cluster hire of AI-focused faculty in university history &mdash; 27 new faculty
                across every school and college. Infrastructure includes a $37M supercomputer with
                24 NVIDIA DGX systems and the world&rsquo;s first IBM AI Unit cluster.
              </p>
            </section>
          </>
        )}

        {/* ═══ ADVISORY BOARD ═══ */}
        {tab === "Advisory Board" && (
          <>
            <section className="about-section">
              <h2 className="about-sh">Advisory Board</h2>
              <p className="about-p">
                The College&rsquo;s advisory board includes faculty and student representatives who
                provide strategic guidance on curriculum, partnerships, and ethical AI education.
              </p>
            </section>

            <section className="about-section">
              <h2 className="about-sh">Faculty Representatives</h2>
              <div className="person-grid">
                {[
                  {n:"Marcie Newton",r:"Assistant Director & Lecturer II",d:"Writing & Critical Inquiry Program",u:"https://www.albany.edu/writing-critical-inquiry/staff-directory/marcie-newton"},
                  {n:"Rita Biswas",r:"Ackner-Newman Endowed Professor, Finance",d:"Massry School of Business",u:"https://www.albany.edu/business/faculty/rita-biswas"},
                  {n:"Alessandra Buccella",r:"Assistant Professor",d:"Department of Philosophy",u:"https://www.albany.edu/philosophy/faculty/alessandra-buccella"},
                  {n:"M. Abdullah Canbaz",r:"Assistant Professor, Information Sciences & Technology",d:"CEHC",u:"https://www.albany.edu/cehc/faculty/m-abdullah-canbaz"},
                  {n:"Ming-Ching Chang",r:"Associate Professor",d:"Computer Science & ECE, CNSE",u:"https://www.albany.edu/computer-science/faculty/ming-ching-chang"},
                  {n:"Daniel Goodwin",r:"Professor & Department Chair",d:"Art & Art History",u:"https://www.albany.edu/art/faculty/daniel-goodwin"},
                  {n:"Cecilia Levy",r:"Associate Professor",d:"Department of Physics",u:"https://www.albany.edu/physics/faculty/cecilia-levy"},
                  {n:"Mary Valentis",r:"Visiting Associate Professor; CHATS Director",d:"Department of English",u:"https://www.albany.edu/english/faculty/mary-valentis"},
                  {n:"Xin Wang",r:"Assistant Professor",d:"Epidemiology & Biostatistics, Integrated Health Sciences",u:"https://www.albany.edu/cihs/faculty/xin-wang"},
                  {n:"Jianwei Zhang",r:"Professor",d:"Educational Theory & Practice, School of Education",u:"https://www.albany.edu/education/faculty/jianwei-zhang"},
                ].map((f,i) => (
                  <div key={i} className="person-card">
                    <div className="person-av">{f.n.split(" ").map(w=>w[0]).join("").slice(0,2)}</div>
                    <div>
                      <div className="person-name">{f.n}</div>
                      <div className="person-role">{f.r}</div>
                      <div className="person-dept">{f.d}</div>
                      <a className="text-link" style={{fontSize:"0.75rem"}} href={f.u} target="_blank" rel="noopener noreferrer">Profile &rarr;</a>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="about-section">
              <h2 className="about-sh">Student Representatives</h2>
              <div className="person-grid">
                <div className="person-card">
                  <div className="person-av grad">AB</div>
                  <div>
                    <div className="person-name">Alana Borrero</div>
                    <div className="person-role">Undergraduate Student</div>
                  </div>
                </div>
                <div className="person-card">
                  <div className="person-av grad">SS</div>
                  <div>
                    <div className="person-name">Shannon Sutorius</div>
                    <div className="person-role">Graduate Student</div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {/* ═══ FELLOWSHIPS ═══ */}
        {tab === "Fellowships" && (
          <>
            <section className="about-section">
              <h2 className="about-sh">Fellowship Programs</h2>
              <div className="opp-card">
                <h3>Faculty Innovation Fellowship</h3>
                <p>Funds faculty-led initiatives that expand UAlbany&rsquo;s AI curriculum, including student engagement, critical inquiry, and creative projects.</p>
              </div>
              <div className="opp-card">
                <h3>Dissertation Fellowship</h3>
                <p>Supports PhD research at the intersection of AI and society, including philosophical, artistic, and critical analysis of AI.</p>
              </div>
              <div className="opp-card">
                <h3>Master&rsquo;s Experiential Learning Fellowship</h3>
                <p>Emphasizes hands-on learning, with fellows supporting the work of the AI &amp; Society College.</p>
              </div>
              <div className="about-callout" style={{marginTop:"1rem"}}>
                <p style={{marginBottom:0}}><strong>2026&ndash;2027 fellowship applications are now open.</strong> See the Opportunities tab for details.</p>
              </div>
            </section>

            <section className="about-section">
              <h2 className="about-sh">Faculty Innovation Fellows (2025&ndash;2026)</h2>
              <div className="person-grid">
                {[
                  {n:"Cecilia Bibb\u00F2",r:"Visiting Asst. Professor",d:"Educational Policy & Leadership, School of Education",u:"https://www.albany.edu/education/faculty/cecilia-bibbo"},
                  {n:"Sukwoong Choi",r:"Asst. Professor, ISBA",d:"Massry School of Business",u:"https://www.albany.edu/business/faculty/sukwoong-choi"},
                  {n:"Jared R. Enriquez",r:"Asst. Professor",d:"Geography, Planning, and Sustainability",u:"https://www.albany.edu/geographyplanning/faculty/jared-r-enriquez"},
                  {n:"Rey Koslowski",r:"Professor; Director, MIA Program",d:"Political Science, Rockefeller College",u:"https://www.albany.edu/rockefeller/faculty/rey-koslowski"},
                  {n:"Luis Felipe Luna-Reyes",r:"Chair & Professor",d:"Public Admin & Policy, Rockefeller College",u:"https://www.albany.edu/rockefeller/faculty/luis-felipe-luna-reyes"},
                  {n:"Sweta Vangaveti",r:"Research Scientist",d:"The RNA Institute",u:"https://www.albany.edu/rna/faculty/sweta-vangaveti"},
                  {n:"Jianwei Zhang",r:"Professor",d:"Educational Theory & Practice, School of Education",u:"https://www.albany.edu/education/faculty/jianwei-zhang"},
                ].map((f,i) => (
                  <div key={i} className="person-card">
                    <div className="person-av">{f.n.split(" ").map(w=>w[0]).join("").slice(0,2)}</div>
                    <div>
                      <div className="person-name">{f.n}</div>
                      <div className="person-role">{f.r}</div>
                      <div className="person-dept">{f.d}</div>
                      <a className="text-link" style={{fontSize:"0.75rem"}} href={f.u} target="_blank" rel="noopener noreferrer">Profile &rarr;</a>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="about-section">
              <h2 className="about-sh">Dissertation Fellows (2025&ndash;2026)</h2>
              <div className="person-grid">
                {[
                  {n:"Rawan Abdelaal",r:"PhD, Curriculum & Instruction",d:"AI and computational thinking in K\u201312 science education"},
                  {n:"Karan Bhasin",r:"PhD, Economics",d:"NLP techniques to identify monetary policy shocks; LLMs for causal inference"},
                  {n:"Anastasios Karnazes",r:"PhD, English Studies",d:"Material transformation from book technologies to AI systems"},
                  {n:"Iris Aleida Pinz\u00F3n Arteaga",r:"PhD, Sociology",d:"Generative AI adoption among young users; digital inequality"},
                ].map((f,i) => (
                  <div key={i} className="person-card">
                    <div className="person-av grad">{f.n.split(" ").map(w=>w[0]).join("").slice(0,2)}</div>
                    <div>
                      <div className="person-name">{f.n}</div>
                      <div className="person-role">{f.r}</div>
                      <div className="person-dept">{f.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="about-section">
              <h2 className="about-sh">Master&rsquo;s Fellows (Spring 2026)</h2>
              <div className="person-grid">
                {[
                  {n:"Batzaya (Zaya) Byambasambuu",r:"MPA, Public Administration & Policy",d:"Developing an AI Curriculum Navigator for UAlbany"},
                  {n:"Kathleen Boyle",r:"MS, Curriculum Development & Instructional Technology",d:"Working on a handbook about AI for teaching to support UAlbany faculty"},
                  {n:"Ayotokunbo Egbontan",r:"MS, Environmental Health Science",d:"Reviewing literature on AI in teaching and learning in higher education"},
                  {n:"Prakash R. Kota",r:"MBA, Business Administration",d:"Developing an AI agent that could be used in the classroom"},
                  {n:"Jayanth Reddy Lethakula",r:"MS, Data Science",d:"Configuring AI workstations at the Makerspace; developing an AI-guided Project Development System"},
                  {n:"Robert Manning",r:"MA, Philosophy",d:"Boosting visibility of the AI & Society College with fellows and leadership"},
                  {n:"Kalonji Samuel",r:"MS, Information Science",d:"Developing an AI-integrated syllabus generator for faculty"},
                  {n:"Gayathri Gupta Samudrala",r:"MS, Educational Psychology & Methodology",d:"Interviewing faculty on AI use in the classroom to understand needs"},
                ].map((f,i) => (
                  <div key={i} className="person-card">
                    <div className="person-av grad">{f.n.split(" ").map(w=>w[0]).join("").slice(0,2)}</div>
                    <div>
                      <div className="person-name">{f.n}</div>
                      <div className="person-role">{f.r}</div>
                      <div className="person-dept">{f.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* ═══ OPPORTUNITIES ═══ */}
        {tab === "Opportunities" && (
          <>
            <section className="about-section">
              <h2 className="about-sh">Call for Faculty Partners</h2>
              <p className="about-p">
                The <a href="https://www.albany.edu/news-center/news/2026-ualbany-lead-empire-ai-suny-partnerships-advancing-ai-public-good" target="_blank" rel="noopener noreferrer">AI for Public Good initiative</a> is
                a partnership between UAlbany, SUNY Oneonta, SUNY Cobleskill and Hudson Valley
                Community College to strengthen AI teaching and research across the region.
              </p>
            </section>

            <section className="about-section">
              <h2 className="about-sh">Projects</h2>
              <div className="opp-card">
                <h3>AI Preparedness Academy &amp; Faculty Learning Community</h3>
                <p>Building institutional capacity for AI by equipping faculty with tools and frameworks to teach about and with AI.</p>
              </div>
              <div className="opp-card">
                <h3>Visiting &amp; Affiliated Faculty Program</h3>
                <p>Supporting faculty in co-developing AI-infused microcredentials, courses and instructional materials across institutions.</p>
              </div>
              <div className="opp-card">
                <h3>&ldquo;AI for Good&rdquo; Challenge</h3>
                <p>Annual cross-campus hackathon bringing together interdisciplinary teams to develop AI-powered solutions to community challenges.</p>
              </div>
            </section>

            <section className="about-section">
              <h2 className="about-sh">Faculty Opportunities</h2>
              <p className="about-p">
                Faculty can participate in the Visiting &amp; Affiliated Faculty Program (co-developing
                courses) or the &ldquo;AI for Good&rdquo; Challenge (mentoring student teams). Both projects
                run April&ndash;June 2026. <strong>All participating faculty receive a stipend.</strong>
              </p>
            </section>

            <section className="about-section">
              <h2 className="about-sh">How to Apply</h2>
              <div className="about-callout">
                <p><strong>Deadline: 11:59 PM, Wednesday, April 1, 2026</strong></p>
                <p>
                  Send an expression of interest (project selection, motivation, relevant experience,
                  and 1&ndash;2 implementation ideas) to Professor Mila Gasc&oacute;-Hernandez
                  at <a href="mailto:mgasco@albany.edu">mgasco@albany.edu</a>.
                </p>
              </div>
            </section>

            <section className="about-section">
              <h2 className="about-sh">Fellowship Applications</h2>
              <p className="about-p">
                2026&ndash;2027 applications are open for Faculty Innovation, Dissertation, and
                Master&rsquo;s Experiential Learning Fellowships. See the Fellowships tab for
                program details, or contact{" "}
                <a href="mailto:helgala@albany.edu">helgala@albany.edu</a> or{" "}
                <a href="mailto:mgasco@albany.edu">mgasco@albany.edu</a>.
              </p>
            </section>
          </>
        )}

        <div style={{paddingTop:"0.75rem",display:"flex",gap:8}}>
          <button className="btn btn-ghost" onClick={() => goTo("courses")}>&larr; Browse courses</button>
          <a className="btn btn-primary" href="https://www.albany.edu/ai-plus/ai-society-college" target="_blank" rel="noopener noreferrer">
            Official site &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   APP ROOT
══════════════════════════════════════════════════ */
export default function App() {
  const [page, setPage] = useState("courses");

  function goTo(p) {
    setPage(p);
    try { window.scrollTo(0, 0); } catch (_) {}
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="app">
        <header className="site-header">
          <div className="header-inner">
            <div className="brand" onClick={() => goTo("courses")}>
              <div className="brand-icon">A</div>
              <div className="brand-copy">
                <span className="brand-kicker">AI & Society College</span>
                <span className="brand-title">University at Albany</span>
              </div>
            </div>
            <nav className="site-nav">
              <button className={`nav-link${page === "courses" ? " active" : ""}`} onClick={() => goTo("courses")}>Courses</button>
              <button className={`nav-link${page === "about" ? " active" : ""}`} onClick={() => goTo("about")}>About</button>
            </nav>
          </div>
        </header>

        <main style={{flex:1}}>
          {page === "courses" && <CoursesPage />}
          {page === "about" && <AboutPage goTo={goTo} />}
        </main>

        <footer className="site-footer">
          <div className="footer-inner">
            <span>AI & Society College \u00B7 University at Albany, SUNY</span>
            <a href="mailto:aisocietycollege@albany.edu">aisocietycollege@albany.edu</a>
          </div>
        </footer>
      </div>
    </>
  );
}

import { useState, useMemo, useEffect } from "react";

const CRED_TYPES = ["Degree Course","Degree Program","Academic Minor","Microcredential","External Certificate"];
const LEVELS = ["Undergraduate","Graduate","Certificate"];
const TERMS = ["Fall","Spring","Summer","Self-paced","Other"];
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

const TOPIC_CHIPS = [
  { label:"Machine Learning",            cls:"chip-ml"   },
  { label:"Generative AI",               cls:"chip-gen"  },
  { label:"AI Ethics & Policy",          cls:"chip-eth"  },
  { label:"Data Science",                cls:"chip-data" },
  { label:"Health AI",                   cls:"chip-hlt"  },
  { label:"Cybersecurity / AI Security", cls:"chip-sec"  },
];

/* ── Fellow bio data ── */
const FELLOW_BIOS = {
  "Batzaya (Zaya) Byambasambuu": {
    role:"MPA, Public Administration & Policy",
    photo:"Batzaya%20%28Zaya%29%20Byambasambuu.jpeg?h=7ea24003&itok=07vrGXt9",
    bio:"Batzaya (Zaya) Byambasambuu is a Fulbright Scholar and Master of Public Administration (MPA) student at UAlbany's Rockefeller College of Public Affairs and Policy, concentrating in information technology management. Her interests focus on the intersection of technology, governance and public policy, particularly how digital systems shape public institutions and child protection.\n\nBefore starting her graduate studies, Zaya worked on national initiatives tackling human trafficking and child protection in Mongolia. At The Asia Foundation, she contributed to a U.S. Department of State-funded Child Protection Compact project aimed at strengthening the investigation and prosecution of child trafficking cases and enhancing victim-centered responses within the justice system. She also co-founded the Anti-bullying Initiative Mongolia, leading programs focused on cyberbullying prevention and public awareness campaigns.\n\nAs a Master's Experiential Learning Fellow, Zaya is developing an AI Curriculum Navigator for UAlbany."
  },
  "Kathleen Boyle": {
    role:"MS, Curriculum Development & Instructional Technology",
    photo:"Kathleen-Boyle.jpg?h=5e69b338&itok=c9LtT663",
    bio:"Kathleen Boyle is a marketing strategist, educator, and learning and development specialist with more than 20 years of experience in the marketing communications industry and over 15 years in higher education.\n\nShe has held leadership and strategy roles at global agencies including OgilvyOne Worldwide and Wunderman Cato Johnson, working with major clients such as IBM, DuPont, DHL, and SAP. In academia, she has developed innovative marketing and communications curricula, created new academic programs, and coached award-winning student teams in national competitions.\n\nAs a Master's Experiential Learning Fellow, Kathy is working on a handbook about AI for teaching that will support UAlbany faculty members using AI in the classroom."
  },
  "Ayotokunbo Egbontan": {
    role:"MS, Environmental Health Science",
    photo:"Ayotokunbo%20Egbontan.png?h=4efb6df5&itok=5gvNQQzu",
    bio:"Ayotokunbo Egbontan is a master's student in UAlbany's Environmental Health Science program. His research focuses on the comparative environmental and economic performance of conventional solar photovoltaic systems and integrated agrivoltaics systems — using AI to model environmental impacts more precisely by learning from large datasets.\n\nAs a Master's Experiential Learning Fellow, Ayo has been reviewing the literature on the use of AI in teaching and learning processes in higher education."
  },
  "Prakash R. Kota": {
    role:"MBA, Business Administration",
    photo:"Prakash-Kota.jpg?h=b044a8f9&itok=I7rey-Gt",
    bio:"Prakash R. Kota is a student in the Part-Time Weekend Master of Business Administration (MBA) for Executives program and an adjunct instructor teaching AECO 466W: Financial Economics at UAlbany's Massry School of Business. He is also the founder of MLPowersAI, Inc., an early-stage venture focused on building machine learning models, agentic AI systems and scalable AI architectures.\n\nPrakash holds a PhD in Chemical Engineering and has a background in computational modeling and engineering systems. His projects span financial forecasting, semiconductor process optimization, healthcare diagnostics, and environmental markets.\n\nAs a Master's Experiential Learning Fellow, Prakash is developing an AI agent that could be used in the classroom."
  },
  "Jayanth Reddy Lethakula": {
    role:"MS, Data Science",
    photo:"Jayanth%20Reddy%20Lethakula.jpg?h=7d892785&itok=qKTDXJVT",
    bio:"Jayanth Reddy Lethakula is a master's student in Data Science at UAlbany. His interests include artificial intelligence, machine learning and data-driven systems for solving real-world problems.\n\nAs a Master's Experiential Learning Fellow, Jayanth is configuring and maintaining AI workstations at the AI Makerspace, supporting AI-related activities and events, and developing an AI-guided Project Development System designed to help students transform project ideas into feasible implementations using Makerspace tools and resources."
  },
  "Robert Manning": {
    role:"MA, Philosophy",
    photo:"Robert%20Manning.png?h=d9227cf5&itok=K30aBrjA",
    bio:"Robert Manning is a graduate student in philosophy at UAlbany currently researching privacy as it relates to brain-implant technology, Large Language Model (LLM) technology and AI.\n\nAs a Master's Experiential Learning Fellow, Robert has been working with dissertation fellows, faculty innovation fellows and College leadership to boost the visibility of the AI & Society College."
  },
  "Kalonji Samuel": {
    role:"MS, Information Science",
    photo:"Kalonji%20Samuel.jpg?h=ad6374a7&itok=LDYhwzho",
    bio:"Kalonji Samuel is completing UAlbany's MS in Information Science program, with a concentration in Artificial Intelligence and Data Analytics. As a former U.S. Army Officer, U.S. Diplomat and Senior Federal Controller, Kalonji brings over 20 years of leadership experience managing billion-dollar global portfolios and leading financial governance across high-stakes, regulated environments.\n\nKalonji is a graduate of the Microsoft Software & Systems Academy (MSSA) and specializes in the intersection of cloud governance, risk transformation, and responsible AI adoption.\n\nAs a Master's Experiential Learning Fellow, Kalonji is developing an AI-integrated syllabus generator that is designed to help faculty align curricula with University-wide AI policies while maintaining pedagogical flexibility."
  },
  "Gayathri Gupta Samudrala": {
    role:"MS, Educational Psychology & Methodology",
    photo:"Gayathri-Gupta-Samudrala.jpg?h=0e903c36&itok=dWVgD9MH",
    bio:"Gayathri is a master's student in the Educational Psychology and Methodology program at UAlbany. She has a bachelor's degree in psychology, economics, and public administration from Hyderabad, India. Her research interests include developmental psychology and the intersection of AI, technology and human development.\n\nAs a Master's Experiential Learning Fellow, Gayathri is interviewing faculty to understand their use of AI in the classroom environment and how the AI & Society College can help address their needs."
  },
  "Rawan Abdelaal": {
    role:"Doctoral Student, Curriculum and Instruction",
    photo:"rawan.jpeg?h=fbfd6560&itok=vyupWg-X",
    bio:"Rawan Abdelaal is a PhD student in curriculum and instruction at the University at Albany. She holds a bachelor's degree in biotechnology from the City College of New York and a master's degree in curriculum development and instructional technology from UAlbany.\n\nHer research explores the relationship between artificial intelligence (AI) and computational thinking (CT) at the intersection of science education. With the rapid advancement of AI, she seeks to investigate and develop methods that promote ethical, critical and effective uses of AI in K–12 classrooms, empowering educators and students to engage thoughtfully and responsibly with intelligent technologies."
  },
  "Karan Bhasin": {
    role:"Doctoral Student, Economics",
    photo:"KB_Headshot.jpg?h=f329a4ed&itok=3gpPKhoM",
    bio:"Karan Bhasin is a PhD candidate in Quantitative Economics and Econometrics at the University at Albany, SUNY. His research lies at the intersection of monetary economics and applied econometrics, with a focus on how economic agents process information and update their expectations.\n\nKaran's work has been featured in The Economist and The Wall Street Journal and has appeared in leading policy platforms such as the Brookings Institution, VoxEU and Econofact. He has held research and policy roles at the International Monetary Fund, World Bank, Empire State Development, and MyGov, Government of India.\n\nCurrently, Karan is exploring the use of natural language processing (NLP) techniques to identify and quantify policy shocks, leveraging textual data to uncover latent signals in economic policymaking."
  },
  "Anastasios Karnazes": {
    role:"Doctoral Student, English",
    photo:"",
    bio:"Anastasios Karnazes is a PhD candidate in English Studies at UAlbany, researching the material transformation from book technologies to artificial intelligence systems and its effects on aesthetic production.\n\nHe is the author of Rainbow Sonnets 20, published by The Song Cave, and founder of Theaphora, an experimental book and game publisher. His work has been covered in Artforum, ARTnews, Spike Magazine, and Forbes.\n\nHis dissertation positions artificial intelligence as the exhaustion point of book logic — the moment when Enlightenment systems of knowledge production, replication, and distribution culminate in computational infrastructure."
  },
  "Iris Aleida Pinzón Arteaga": {
    role:"Doctoral Student, Sociology",
    photo:"",
    bio:"Iris Aleida Pinzón Arteaga is a PhD candidate in the Department of Sociology at the University at Albany and member of the AI & Society Research Center. Her research examines how young users adopt generative AI technologies for academic and non-academic purposes, with particular attention to patterns of digital inequality.\n\nAn interdisciplinary scholar with a background in psychology and social research, she helped co-design the AI for Social Change Lab with Professor Angie Chung, one of the first courses in the Department of Sociology to promote critical reflection on AI technologies.\n\nHer dissertation examines how young people engage with generative AI chatbots in educational settings and how these engagements reflect broader digital inequalities."
  },
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:ital,opsz,wght@0,14..32,300;0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700;1,14..32,400&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --ch:#2e2e2e;--ch2:#1a1a1a;
  --pu:#46166b;--pud:#3a1259;--pul:#ede5f8;--puxl:#f8f5fd;
  --go:#C69214;--gol:#d4a020;--gop:#fdf6de;
  --grn:#14653c;
  --bg:#f7f5fb;--surface:#ffffff;--surface-muted:#f3eef8;
  --text:#1f1b24;--muted:#645b70;--border:#e3dceb;
  --shadow:0 10px 28px rgba(49,31,74,0.08);
  --shadow-sm:0 2px 8px rgba(49,31,74,0.06);
  --radius:18px;--radius-sm:14px;
  --container:1120px;
  --ds:'DM Serif Display',Georgia,serif;
  --font:'Inter',system-ui,-apple-system,sans-serif;
}
html{scroll-behavior:smooth;font-size:17px}
body{margin:0;font-family:var(--font);background:var(--bg);color:var(--text);line-height:1.65;-webkit-font-smoothing:antialiased}
button,select,input{font-family:var(--font)}
a{color:inherit;text-decoration:none}
.app{display:flex;flex-direction:column;min-height:100vh}

.site-header{position:sticky;top:0;z-index:20;background:var(--ch);border-bottom:3px solid var(--go)}
.header-inner{width:min(var(--container),calc(100% - 2rem));margin:0 auto;display:flex;align-items:stretch;height:58px}
.site-nav{display:flex;align-items:stretch;gap:0}
.nav-link{padding:0 1.1rem;display:flex;align-items:center;color:rgba(255,255,255,.52);font-size:0.88rem;font-weight:500;cursor:pointer;border:none;background:none;border-bottom:3px solid transparent;margin-bottom:-3px;transition:all 0.15s;white-space:nowrap;letter-spacing:.01em}
.nav-link:hover{color:rgba(255,255,255,.88);background:rgba(255,255,255,.05)}
.nav-link.active{color:#fff;border-bottom-color:var(--go)}

.page-header{background:var(--ch2);padding:2.75rem 0 2.25rem;position:relative}
.page-header::after{content:'';position:absolute;bottom:0;left:calc((100% - min(var(--container),calc(100% - 2rem)))/2);width:56px;height:2px;background:var(--go)}
.page-header .container{width:min(var(--container),calc(100% - 2rem));margin:0 auto}
.eyebrow{display:block;margin:0 0 0.65rem;color:var(--go);text-transform:uppercase;letter-spacing:.16em;font-size:0.72rem;font-weight:700}
.page-title{font-family:var(--ds);font-size:clamp(2rem,4vw,3rem);font-weight:400;line-height:1.1;margin:0 0 0.3rem;color:#fff;letter-spacing:-.02em}
.page-subtitle{font-size:1rem;color:rgba(255,255,255,.42);margin:0;font-weight:300}
.page-tagline{font-size:0.92rem;color:rgba(255,255,255,.32);margin:0.4rem 0 1.75rem;font-weight:300}
.search-input{width:100%;max-width:500px;border:1px solid rgba(198,146,20,.38);background:rgba(255,255,255,.07);border-radius:4px;padding:0.75rem 1rem;font:inherit;font-size:0.95rem;color:#fff;outline:none;transition:border-color 0.18s,box-shadow 0.18s}
.search-input:focus{border-color:var(--go);box-shadow:0 0 0 3px rgba(198,146,20,.14)}
.search-input::placeholder{color:rgba(255,255,255,.26)}

.tbar{background:var(--surface-muted);border-bottom:1px solid var(--border);padding:0.45rem 0}
.tbar-inner{width:min(var(--container),calc(100% - 2rem));margin:0 auto;display:flex;align-items:center;justify-content:flex-end;gap:1.25rem;font-size:0.75rem;color:var(--muted)}
.tbar-btn{background:none;border:none;font-size:0.75rem;color:var(--pu);cursor:pointer;text-decoration:underline}

.chips-wrap{background:var(--bg);border-bottom:1px solid var(--border);padding:0.9rem 0}
.chips-row{width:min(var(--container),calc(100% - 2rem));margin:0 auto;display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.chips-label{font-size:.78rem;font-weight:600;color:var(--muted);letter-spacing:.03em;margin-right:4px;white-space:nowrap}
.chip{display:inline-flex;align-items:center;padding:6px 14px;border-radius:20px;font-size:.78rem;font-weight:600;border:1.5px solid transparent;cursor:pointer;transition:all .15s;white-space:nowrap}
.chip-ml  {background:#ede5f8;color:#46166b;border-color:#d4c2f0}.chip-ml.on,.chip-ml:hover{background:#46166b;color:#fff;border-color:#46166b}
.chip-gen {background:#e3ebf9;color:#1540a8;border-color:#b8cdf0}.chip-gen.on,.chip-gen:hover{background:#1540a8;color:#fff;border-color:#1540a8}
.chip-eth {background:#fdf6de;color:#8a6508;border-color:#f0d98a}.chip-eth.on,.chip-eth:hover{background:#C69214;color:#fff;border-color:#C69214}
.chip-data{background:#e3f2eb;color:#14653c;border-color:#9fd4b8}.chip-data.on,.chip-data:hover{background:#14653c;color:#fff;border-color:#14653c}
.chip-hlt {background:#fde8e8;color:#a32d2d;border-color:#f0b8b8}.chip-hlt.on,.chip-hlt:hover{background:#a32d2d;color:#fff;border-color:#a32d2d}
.chip-sec {background:#fff3e0;color:#a05010;border-color:#f0c88a}.chip-sec.on,.chip-sec:hover{background:#a05010;color:#fff;border-color:#a05010}

.catalog-layout{width:min(var(--container),calc(100% - 2rem));margin:0 auto;display:grid;grid-template-columns:260px 1fr;gap:1.5rem;padding:1.5rem 0 3rem;align-items:start}
.sidebar{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm);box-shadow:var(--shadow-sm);position:sticky;top:70px;overflow:hidden}
.sidebar-header{padding:0.7rem 1rem;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;background:var(--ch)}
.sidebar-label{font-size:0.68rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.6)}
.sidebar-clear{background:none;border:none;font-size:0.75rem;font-weight:600;color:var(--go);cursor:pointer;padding:0}
.filter-group{border-bottom:1px solid var(--border)}
.filter-group:last-child{border-bottom:none}
.fg-header{padding:0.7rem 1rem;display:flex;align-items:center;justify-content:space-between;cursor:pointer;user-select:none;transition:background 0.12s}
.fg-header:hover{background:var(--surface-muted)}
.fg-label{font-size:0.88rem;font-weight:600;color:var(--text)}
.fg-arrow{font-size:0.55rem;color:#b0a8c0;transition:transform 0.2s}
.fg-arrow.open{transform:rotate(180deg)}
.fg-options{padding:0.25rem 1rem 0.85rem;display:flex;flex-direction:column;gap:0.45rem}
.fg-opt{display:flex;align-items:flex-start;gap:0.5rem;cursor:pointer;font-size:0.85rem;color:var(--muted);line-height:1.4}
.fg-opt input{accent-color:var(--pu);cursor:pointer;margin-top:3px;flex-shrink:0}

.results{display:flex;flex-direction:column;gap:0.75rem}
.results-bar{display:flex;align-items:center;gap:0.75rem;margin-bottom:0.2rem;flex-wrap:wrap}
.results-count{font-size:0.85rem;color:var(--muted);white-space:nowrap}
.v-tog{display:flex;border:1px solid var(--border);border-radius:6px;overflow:hidden}
.v-btn{background:none;border:none;padding:7px 11px;cursor:pointer;font-size:0.88rem;color:var(--muted);transition:all .15s}
.v-btn.on{background:var(--pu);color:#fff}

.badge{display:inline-flex;align-items:center;padding:3px 10px;border-radius:20px;font-size:0.75rem;font-weight:600;white-space:nowrap;letter-spacing:.01em}
.badge-dc{background:#ede5f8;color:#46166b}.badge-mc{background:#fdf6de;color:#8a6508}.badge-ec{background:#e3f2eb;color:#14653c}
.badge-cert{background:#e8f0fe;color:#1a47b0}.badge-ug{background:#e3ebf9;color:#1540a8}.badge-gr{background:#ede5f8;color:#46166b}
.badge-free{background:#d2f4e3;color:#0b5e31;border:1px solid #9de3bf}.badge-prov{background:#e8f0fe;color:#1a47b0}
.badge-inp{background:#e3f2eb;color:#14653c}.badge-onl{background:#e3ebf9;color:#1540a8}.badge-hyb{background:#fff3e0;color:#a05010}
.badge-def{background:#eeedf4;color:#5a5475}

.card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm);overflow:hidden;transition:all 0.18s ease;cursor:pointer}
.card:hover{transform:translateY(-2px);border-color:rgba(198,146,20,.4);box-shadow:var(--shadow-sm)}
.card-body{padding:1.1rem 1.2rem}
.card-topline{display:flex;gap:5px;flex-wrap:wrap;margin-bottom:0.5rem}
.card-code{font-size:0.73rem;font-weight:700;color:var(--go);letter-spacing:.08em;text-transform:uppercase;margin-bottom:0.15rem}
.card-title{font-size:1.05rem;font-weight:600;color:var(--text);line-height:1.3;margin-bottom:0.15rem}
.card-school{font-size:0.82rem;color:var(--muted);margin-bottom:0.6rem}
.card-desc{font-size:0.88rem;color:var(--muted);line-height:1.65;margin-bottom:0.6rem}
.card-footer{padding:0.7rem 1.2rem;border-top:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;gap:0.5rem;background:var(--surface-muted)}
.card-source{font-size:0.72rem;color:#b0a8c0}
.text-link{color:var(--pu);font-weight:600;font-size:0.88rem;text-decoration:none;transition:color 0.15s}
.text-link:hover{text-decoration:underline}

.gc-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:0.75rem}
.gc{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm);overflow:hidden;cursor:pointer;transition:all 0.18s;display:flex;flex-direction:column}
.gc:hover{transform:translateY(-2px);border-color:rgba(198,146,20,.4);box-shadow:var(--shadow-sm)}
.gc-top{height:3px}
.gc-body{padding:1rem 1.1rem;flex:1}
.gc-code{font-size:0.7rem;font-weight:700;color:var(--go);letter-spacing:.08em;text-transform:uppercase;margin-bottom:0.15rem}
.gc-title{font-size:0.95rem;font-weight:600;color:var(--text);line-height:1.3;margin-bottom:0.15rem}
.gc-school{font-size:0.76rem;color:var(--muted);margin-bottom:0.5rem}
.gc-desc{font-size:0.84rem;color:var(--muted);line-height:1.58}
.gc-badges{padding:0 1.1rem 0.7rem;display:flex;flex-wrap:wrap;gap:4px}
.gc-footer{padding:0.65rem 1.1rem;border-top:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;background:var(--surface-muted);margin-top:auto}

.overlay{position:fixed;inset:0;background:rgba(0,0,0,.58);z-index:100;display:flex;align-items:flex-start;justify-content:center;padding:3rem 1.5rem;overflow-y:auto;backdrop-filter:blur(5px);animation:fadeIn 0.15s ease}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
.modal{background:var(--surface);border-radius:var(--radius);max-width:720px;width:100%;box-shadow:0 24px 64px rgba(49,31,74,0.22);overflow:hidden;border-top:3px solid var(--go);animation:slideUp 0.2s cubic-bezier(0.16,1,0.3,1)}
@keyframes slideUp{from{transform:translateY(14px);opacity:0}to{transform:translateY(0);opacity:1}}
.modal-header{background:var(--ch);padding:1.5rem 1.75rem 1.3rem;position:relative}
.modal-close{position:absolute;top:0.85rem;right:0.85rem;background:rgba(255,255,255,.12);border:none;color:#fff;width:32px;height:32px;border-radius:50%;cursor:pointer;font-size:0.9rem;display:flex;align-items:center;justify-content:center;transition:background 0.15s}
.modal-close:hover{background:rgba(255,255,255,.24)}
.modal-badges{display:flex;gap:5px;flex-wrap:wrap;margin-bottom:0.5rem}
.modal-title{font-family:var(--ds);font-size:1.5rem;font-weight:400;color:#fff;line-height:1.2;letter-spacing:-.01em}
.modal-body{padding:1.5rem 1.75rem}
.modal-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.85rem 1.5rem;margin-bottom:1.25rem}
.modal-field-label{font-size:0.68rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-bottom:0.2rem}
.modal-field-value{font-size:0.92rem;color:var(--text);line-height:1.55}
.modal-section{margin-bottom:1rem}
.modal-footer{padding:1rem 1.75rem;border-top:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;gap:0.75rem;flex-wrap:wrap}

/* BIO MODAL */
.bio-modal{background:var(--surface);border-radius:var(--radius);max-width:640px;width:100%;box-shadow:0 24px 64px rgba(49,31,74,0.22);overflow:hidden;border-top:3px solid var(--pu);animation:slideUp 0.2s cubic-bezier(0.16,1,0.3,1)}
.bio-modal-header{background:var(--ch);padding:1.25rem 1.5rem;position:relative;display:flex;gap:1rem;align-items:center}
.bio-modal-photo{width:64px;height:64px;border-radius:50%;object-fit:cover;object-position:top;flex-shrink:0;border:2px solid rgba(255,255,255,.2)}
.bio-modal-photo-placeholder{width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,var(--pu),#8a3cc0);display:flex;align-items:center;justify-content:center;font-size:1.1rem;font-weight:700;color:#fff;flex-shrink:0}
.bio-modal-name{font-family:var(--ds);font-size:1.25rem;color:#fff;line-height:1.2}
.bio-modal-role{font-size:0.82rem;color:rgba(255,255,255,.55);margin-top:2px}
.bio-modal-body{padding:1.5rem;font-size:0.95rem;color:var(--muted);line-height:1.82}
.bio-modal-body p{margin-bottom:0.85rem}
.bio-modal-body p:last-child{margin-bottom:0}
.bio-modal-footer{padding:0.85rem 1.5rem;border-top:1px solid var(--border);display:flex;justify-content:flex-end}

.btn{display:inline-flex;align-items:center;gap:0.3rem;padding:0.55rem 1rem;border-radius:var(--radius-sm);font-size:0.88rem;font-weight:600;cursor:pointer;border:none;transition:all 0.15s;text-decoration:none;white-space:nowrap}
.btn-primary{background:var(--pu);color:#fff}.btn-primary:hover{background:var(--pud)}
.btn-gold{background:var(--go);color:#1a1a1a}.btn-gold:hover{background:var(--gol)}
.btn-ghost{background:transparent;color:var(--text);border:1px solid var(--border)}.btn-ghost:hover{border-color:var(--pu);color:var(--pu)}
.btn-free{background:var(--grn);color:#fff}.btn-free:hover{background:#0d5230}
.btn-li{background:#0077b5;color:#fff}.btn-li:hover{background:#005e8e}

/* POLICY PAGE */
.policy-wrap{width:min(var(--container),calc(100% - 2rem));margin:0 auto;padding:2rem 0 3rem}
.policy-tool-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm);border-left:4px solid var(--pu);padding:1.5rem 1.75rem;display:flex;align-items:flex-start;gap:1.25rem;margin-bottom:2.5rem;box-shadow:var(--shadow-sm)}
.policy-tool-icon{font-size:2rem;flex-shrink:0;margin-top:2px}
.policy-tool-title{font-size:1.1rem;font-weight:700;color:var(--text);margin-bottom:0.35rem}
.policy-tool-desc{font-size:0.92rem;color:var(--muted);line-height:1.72;margin-bottom:1rem}
.policy-tool-by{font-size:0.78rem;color:var(--pu);font-weight:600;margin-bottom:0.85rem}
.policy-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:1.25rem}
.policy-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm);padding:1.4rem 1.5rem 1.4rem 1.75rem;transition:all 0.18s;box-shadow:var(--shadow-sm);display:flex;flex-direction:column;gap:0.5rem;border-left-width:4px}
.policy-card:hover{box-shadow:var(--shadow);transform:translateY(-2px)}
.pc-purple{border-left-color:#46166b}.pc-gold{border-left-color:#C69214}.pc-green{border-left-color:#14653c}
.pc-blue{border-left-color:#1540a8}.pc-red{border-left-color:#a32d2d}.pc-teal{border-left-color:#0e7490}
.policy-card-icon{font-size:1.4rem}
.policy-card-title{font-size:1rem;font-weight:700;color:var(--text)}
.policy-card-desc{font-size:0.88rem;color:var(--muted);line-height:1.65;flex:1}
.policy-card-meta{font-size:0.73rem;color:#b0a8c0}

/* ABOUT PAGE */
.about-page{min-height:calc(100vh - 180px)}
.about-hero{background:var(--ch2);padding:2.75rem 1.5rem 2.25rem;position:relative}
.about-hero::after{content:'';position:absolute;bottom:0;left:1.5rem;width:56px;height:2px;background:var(--go)}
.about-hero-inner{max-width:900px;margin:0 auto}
.about-hero-kicker{display:block;font-size:0.72rem;font-weight:700;color:var(--go);letter-spacing:.16em;margin-bottom:0.5rem;text-transform:uppercase}
.about-hero-title{font-family:var(--ds);font-size:clamp(1.7rem,3vw,2.4rem);font-weight:400;color:#fff;line-height:1.12;margin:0 0 0.4rem;letter-spacing:-.02em}
.about-hero-sub{font-size:0.92rem;color:rgba(255,255,255,.38);line-height:1.65;max-width:520px;margin:0;font-weight:300}
.about-tabs-bar{background:var(--surface);border-bottom:1px solid var(--border);position:sticky;top:58px;z-index:10}
.about-tabs-inner{max-width:900px;margin:0 auto;padding:0 1.5rem;display:flex;gap:0;overflow-x:auto}
.about-tab{background:none;border:none;border-bottom:2px solid transparent;padding:0.75rem 1.1rem;margin-bottom:-1px;font-size:0.9rem;font-weight:500;color:var(--muted);cursor:pointer;white-space:nowrap;transition:all 0.15s}
.about-tab:hover{color:var(--text)}
.about-tab.active{color:var(--pu);border-bottom-color:var(--go);font-weight:600}
.about-content{max-width:900px;margin:0 auto;padding:2rem 1.5rem 3rem}
.about-section{margin-bottom:2rem}
.about-sh{font-family:var(--ds);font-size:1.3rem;color:var(--text);margin:0 0 0.75rem;letter-spacing:-.01em}
.about-p{font-size:0.95rem;color:var(--muted);line-height:1.85;margin:0 0 0.65rem}
.about-p a{color:var(--pu);font-weight:600}.about-p a:hover{text-decoration:underline}
.about-photo{width:100%;border-radius:var(--radius-sm);object-fit:cover;display:block;margin:1rem 0 1.5rem;max-height:280px}

.section-label{font-size:0.68rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--go);margin:0 0 0.75rem;display:block}
.person-grid-2{display:grid;grid-template-columns:repeat(2,1fr);gap:1rem;margin-bottom:1.5rem}
.person-grid-5{display:grid;grid-template-columns:repeat(5,1fr);gap:0.85rem;margin-bottom:1.5rem}
.person-grid-4{display:grid;grid-template-columns:repeat(4,1fr);gap:0.85rem;margin-bottom:1.5rem}
.pcard{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm);overflow:hidden;transition:all 0.15s;display:flex;flex-direction:column}
.pcard:hover{border-color:rgba(70,22,107,0.3);box-shadow:var(--shadow-sm)}
.pcard.clickable{cursor:pointer}
.pcard.clickable:hover{transform:translateY(-2px)}
.pcard-photo{width:100%;aspect-ratio:1/1;object-fit:cover;object-position:top;display:block;background:var(--pul)}
.pcard-photo-placeholder{width:100%;aspect-ratio:1/1;background:linear-gradient(135deg,var(--pu),#8a3cc0);display:flex;align-items:center;justify-content:center;font-size:1.4rem;font-weight:700;color:#fff}
.pcard-body{padding:0.8rem 0.9rem;flex:1;display:flex;flex-direction:column;gap:0.15rem}
.pcard-name{font-size:0.88rem;font-weight:700;color:var(--text);line-height:1.3}
.pcard-role{font-size:0.76rem;color:var(--pu);font-weight:600;line-height:1.3}
.pcard-dept{font-size:0.72rem;color:var(--muted);line-height:1.4;margin-top:0.1rem}
.pcard-bio{font-size:0.76rem;color:var(--muted);line-height:1.55;margin-top:0.35rem}
.pcard-link{font-size:0.76rem;color:var(--pu);font-weight:600;margin-top:auto;padding-top:0.4rem;text-decoration:none}
.pcard-link:hover{text-decoration:underline}
.pcard-hint{font-size:0.68rem;color:#b0a8c0;margin-top:auto;padding-top:0.4rem;font-style:italic}

.fellow-divider{border:none;border-top:1px solid var(--border);margin:1.5rem 0}

.site-footer{border-top:2px solid var(--go);background:var(--ch2);margin-top:auto}
.footer-inner{width:min(var(--container),calc(100% - 2rem));margin:0 auto;display:flex;justify-content:space-between;align-items:center;gap:1rem;padding:0.9rem 0;font-size:0.78rem;color:rgba(255,255,255,.3);flex-wrap:wrap}
.footer-inner a{color:rgba(255,255,255,.45);font-weight:600}
.footer-credit{padding-bottom:0.5rem;font-size:0.68rem;color:rgba(255,255,255,.22)}

.empty{text-align:center;padding:3rem 1.5rem;color:var(--muted)}
.empty-icon{font-size:2rem;margin-bottom:0.75rem}
.empty p{font-size:0.95rem;max-width:340px;margin:0 auto;line-height:1.65}

@media(max-width:960px){
  .catalog-layout{grid-template-columns:1fr}.sidebar{position:static}
  .gc-grid,.policy-grid{grid-template-columns:1fr}
  .modal-grid{grid-template-columns:1fr}
  .person-grid-5,.person-grid-4{grid-template-columns:repeat(2,1fr)}
  .person-grid-2{grid-template-columns:1fr}
  .footer-inner{flex-direction:column;align-items:flex-start}
  .policy-tool-card{flex-direction:column}
}
`;

const credBadge = t => ({"Degree Course":"badge-dc","Microcredential":"badge-mc","External Certificate":"badge-ec","Degree Program":"badge-cert","Academic Minor":"badge-def"}[t]||"badge-def");
const levelBadge = l => ({"Undergraduate":"badge-ug","Graduate":"badge-gr","Certificate":"badge-cert"}[l]||"badge-def");
const fmtBadge  = f => ({"In-Person":"badge-inp","Online":"badge-onl","Hybrid":"badge-hyb"}[f]||"badge-def");
const topColor  = t => ({"Degree Course":"var(--pu)","Microcredential":"var(--go)","External Certificate":"var(--grn)","Degree Program":"#1540a8","Academic Minor":"#a05010"}[t]||"var(--border)");
const BASE = "https://www.albany.edu/sites/default/files/styles/person_list/public/";

/* ── Bio Modal ── */
function BioModal({ person, onClose }) {
  useEffect(() => {
    const h = e => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);
  const [imgErr, setImgErr] = useState(false);
  const initials = person.name.split(" ").map(w=>w[0]).join("").slice(0,2);
  const photoUrl = person.photo ? BASE + person.photo : "";
  const paragraphs = person.bio.split("\n\n").filter(Boolean);
  return (
    <div className="overlay" onClick={onClose}>
      <div className="bio-modal" onClick={e => e.stopPropagation()}>
        <div className="bio-modal-header">
          {photoUrl && !imgErr
            ? <img className="bio-modal-photo" src={photoUrl} alt={person.name} onError={() => setImgErr(true)} />
            : <div className="bio-modal-photo-placeholder">{initials}</div>
          }
          <div>
            <div className="bio-modal-name">{person.name}</div>
            <div className="bio-modal-role">{person.role}</div>
          </div>
          <button className="modal-close" onClick={onClose} style={{position:"absolute",top:"0.85rem",right:"0.85rem"}}>&#10005;</button>
        </div>
        <div className="bio-modal-body">
          {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
        </div>
        <div className="bio-modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

/* ── Filter Group ── */
function FilterGroup({ label, options, selected, onChange }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="filter-group">
      <div className="fg-header" onClick={() => setOpen(o => !o)}>
        <span className="fg-label">{label}</span>
        <span className={`fg-arrow${open ? " open" : ""}`}>&#9660;</span>
      </div>
      {open && (
        <div className="fg-options">
          {options.map(opt => (
            <label key={opt} className="fg-opt">
              <input type="checkbox" checked={selected.includes(opt)}
                onChange={() => onChange(selected.includes(opt) ? selected.filter(x => x !== opt) : [...selected, opt])} />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Course Detail Modal ── */
function DetailModal({ item, onClose, catalog }) {
  useEffect(() => {
    const h = e => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);
  const related = catalog.filter(c => c.id !== item.id && c.school === item.school).slice(0, 3);
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <button className="modal-close" onClick={onClose}>&#10005;</button>
          <div className="modal-badges">
            <span className={`badge ${credBadge(item.credentialType)}`}>{item.credentialType}</span>
            <span className={`badge ${levelBadge(item.level)}`}>{item.level}</span>
            {item.isFree && <span className="badge badge-free">Free</span>}
            {item.offeredBy && <span className="badge badge-prov">by {item.offeredBy}</span>}
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
                <div key={r.id} style={{background:"var(--surface-muted)",borderRadius:8,padding:"0.6rem 0.9rem",marginBottom:6,fontSize:"0.88rem",display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}}>
                  <span style={{color:"var(--text)",fontWeight:600}}>{r.code ? `${r.code}: ` : ""}{r.title}</span>
                  <span className={`badge ${credBadge(r.credentialType)}`} style={{flexShrink:0,fontSize:"0.7rem"}}>{r.credentialType}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="modal-footer">
          <span style={{fontSize:"0.73rem",color:"#b0a8c0"}}>Source: {item.source}</span>
          <a className={`btn ${item.isFree ? "btn-free" : "btn-gold"}`} href={item.sourceUrl} target="_blank" rel="noopener noreferrer">
            {item.isFree ? "Enroll Free \u2192" : "Official Listing \u2192"}
          </a>
        </div>
      </div>
    </div>
  );
}

/* ── Person Card ── */
function PersonCard({ name, role, dept, photo, url, bio, clickable }) {
  const [imgErr, setImgErr] = useState(false);
  const initials = name.split(" ").map(w=>w[0]).join("").slice(0,2);
  return (
    <div className={`pcard${clickable ? " clickable" : ""}`}>
      {photo && !imgErr
        ? <img className="pcard-photo" src={photo} alt={name} onError={() => setImgErr(true)} />
        : <div className="pcard-photo-placeholder">{initials}</div>
      }
      <div className="pcard-body">
        <div className="pcard-name">{name}</div>
        <div className="pcard-role">{role}</div>
        {dept && <div className="pcard-dept">{dept}</div>}
        {bio && <div className="pcard-bio">{bio}</div>}
        {url && <a className="pcard-link" href={url} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()}>Profile &#8594;</a>}
        {clickable && <div className="pcard-hint">Click to read bio</div>}
      </div>
    </div>
  );
}

/* ── Fellow Card (clickable, opens bio modal) ── */
function FellowCard({ name }) {
  const [open, setOpen] = useState(false);
  const data = FELLOW_BIOS[name];
  if (!data) return null;
  return (
    <>
      <div onClick={() => setOpen(true)}>
        <PersonCard
          name={name}
          role={data.role}
          photo={data.photo ? BASE + data.photo : ""}
          clickable={true}
        />
      </div>
      {open && <BioModal person={{name, role:data.role, photo:data.photo, bio:data.bio}} onClose={() => setOpen(false)} />}
    </>
  );
}

/* ══ COURSES PAGE ══ */
function CoursesPage({ catalog }) {
  const [q, setQ] = useState("");
  const [view, setView] = useState("grid");
  const [activeChip, setActiveChip] = useState(null);
  const [selected, setSelected] = useState(null);
  const [filters, setFilters] = useState({ cred:[],level:[],term:[],format:[],school:[],topic:[] });
  const setF = (key, val) => setFilters(prev => ({ ...prev, [key]: val }));
  const clearAll = () => { setFilters({ cred:[],level:[],term:[],format:[],school:[],topic:[] }); setActiveChip(null); setQ(""); };
  const activeCount = Object.values(filters).flat().length;

  function handleChip(label) {
    if (activeChip === label) { setActiveChip(null); setFilters(prev=>({...prev,topic:[]})); }
    else { setActiveChip(label); setFilters(prev => ({ ...prev, topic: [label] })); }
  }

  const filtered = useMemo(() => catalog.filter(c => {
    const lo = q.toLowerCase();
    const matchQ = !q || c.title.toLowerCase().includes(lo) || c.code.toLowerCase().includes(lo) ||
      c.description.toLowerCase().includes(lo) || (c.dept||"").toLowerCase().includes(lo) || c.school.toLowerCase().includes(lo);
    const matchCred   = !filters.cred.length   || filters.cred.includes(c.credentialType);
    const matchLevel  = !filters.level.length  || filters.level.includes(c.level);
    const matchTerm   = !filters.term.length   || filters.term.includes(c.term);
    const matchFormat = !filters.format.length || filters.format.some(f => (c.format||"").includes(f));
    const matchSchool = !filters.school.length || filters.school.includes(c.school);
    const matchTopic  = !filters.topic.length  || (c.tags||[]).some(t => filters.topic.includes(t));
    return matchQ && matchCred && matchLevel && matchTerm && matchFormat && matchSchool && matchTopic;
  }), [q, filters, catalog]);

  return (
    <>
      <div className="page-header">
        <div className="container">
          <span className="eyebrow">AI &amp; Society College &middot; University at Albany</span>
          <h1 className="page-title">AI Curriculum Navigator</h1>
          <p className="page-tagline">A Centralized Discovery Portal for AI Education</p>
          <input className="search-input" placeholder="Search by title, code, school, or keyword..."
            value={q} onChange={e => { setQ(e.target.value); setActiveChip(null); }} aria-label="Search courses" />
        </div>
      </div>
      <div className="tbar">
        <div className="tbar-inner">
          <span>31 verified listings &middot; Last updated April 2026</span>
          <button className="tbar-btn">Suggest an update</button>
        </div>
      </div>
      <div className="chips-wrap">
        <div className="chips-row">
          <span className="chips-label">Popular:</span>
          {TOPIC_CHIPS.map(({ label, cls }) => (
            <button key={label} className={`chip ${cls}${activeChip === label ? " on" : ""}`} onClick={() => handleChip(label)}>{label}</button>
          ))}
        </div>
      </div>
      <div className="catalog-layout">
        <aside className="sidebar">
          <div className="sidebar-header">
            <span className="sidebar-label">Filters{activeCount > 0 ? ` (${activeCount})` : ""}</span>
            {activeCount > 0 && <button className="sidebar-clear" onClick={clearAll}>Clear all</button>}
          </div>
          <FilterGroup label="Credential Type" options={CRED_TYPES}  selected={filters.cred}   onChange={v => setF("cred", v)} />
          <FilterGroup label="Level"           options={LEVELS}      selected={filters.level}  onChange={v => setF("level", v)} />
          <FilterGroup label="Term"            options={TERMS}       selected={filters.term}   onChange={v => setF("term", v)} />
          <FilterGroup label="Format"          options={FORMATS}     selected={filters.format} onChange={v => setF("format", v)} />
          <FilterGroup label="School"          options={ALL_SCHOOLS} selected={filters.school} onChange={v => setF("school", v)} />
        </aside>
        <main className="results">
          <div className="results-bar">
            <span className="results-count">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
            <div className="v-tog" style={{marginLeft:"auto"}}>
              <button className={`v-btn${view === "list" ? " on" : ""}`} onClick={() => setView("list")} title="List">&#9776;</button>
              <button className={`v-btn${view === "grid" ? " on" : ""}`} onClick={() => setView("grid")} title="Grid">&#8862;</button>
            </div>
          </div>
          {filtered.length === 0 && <div className="empty"><div className="empty-icon">&#128269;</div><p>No results match your filters.</p></div>}
          {view === "list" && filtered.map(c => (
            <div key={c.id} className="card" onClick={() => setSelected(c)}>
              <div className="card-body">
                <div className="card-topline">
                  <span className={`badge ${credBadge(c.credentialType)}`}>{c.credentialType}</span>
                  <span className={`badge ${levelBadge(c.level)}`}>{c.level}</span>
                  <span className={`badge ${fmtBadge(c.format)}`}>{c.format}</span>
                  {c.isFree && <span className="badge badge-free">Free</span>}
                  {c.offeredBy && <span className="badge badge-prov">by {c.offeredBy}</span>}
                </div>
                {c.code && <div className="card-code">{c.code}</div>}
                <div className="card-title">{c.title}</div>
                <div className="card-school">{c.school}</div>
                <p className="card-desc">{c.description}</p>
              </div>
              <div className="card-footer">
                <span className="card-source">{c.source}</span>
                <a className="text-link" href={c.sourceUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
                  {c.isFree ? "Enroll Free \u2192" : "View source \u2192"}
                </a>
              </div>
            </div>
          ))}
          {view === "grid" && (
            <div className="gc-grid">
              {filtered.map(c => (
                <div key={c.id} className="gc" onClick={() => setSelected(c)}>
                  <div className="gc-top" style={{background: topColor(c.credentialType)}} />
                  <div className="gc-body">
                    {c.code && <div className="gc-code">{c.code}</div>}
                    <div className="gc-title">{c.title}</div>
                    <div className="gc-school">{c.school}</div>
                    <p className="gc-desc">{c.description}</p>
                  </div>
                  <div className="gc-badges">
                    <span className={`badge ${credBadge(c.credentialType)}`}>{c.credentialType}</span>
                    <span className={`badge ${levelBadge(c.level)}`}>{c.level}</span>
                    {c.isFree && <span className="badge badge-free">Free</span>}
                  </div>
                  <div className="gc-footer">
                    <span style={{fontSize:"0.7rem",color:"#b0a8c0"}}>{c.term}</span>
                    <button className="btn btn-primary" style={{padding:"0.32rem 0.8rem",fontSize:"0.78rem"}} onClick={() => setSelected(c)}>Details &#8594;</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
      {selected && <DetailModal item={selected} onClose={() => setSelected(null)} catalog={catalog} />}
    </>
  );
}

/* ══ AI POLICY PAGE ══ */
function PolicyPage() {
  const policies = [
    { icon:"📋", title:"Academic Integrity & AI Use Policy", desc:"Official UAlbany guidance on using AI tools in coursework, assessments, and research — covering citation, disclosure, and clear boundaries for students and instructors.", updated:"Aug 2025", source:"Office of Academic Affairs", url:"https://libguides.library.albany.edu/academicintegrityai", color:"pc-purple" },
    { icon:"🛠", title:"CATLOE Teaching Resources for AI", desc:"Practical guides from the Center for Advancement of Teaching, Learning & Online Education for instructors at every level of AI familiarity.", updated:"Sep 2025", source:"CATLOE", url:"https://www.albany.edu/teaching-and-learning/teaching-resources", color:"pc-gold" },
    { icon:"📚", title:"University Libraries: Generative AI Guide", desc:"Curated research guide on generative AI and academic integrity, plus citation tools, AI literacy resources, and library support.", updated:"Aug 2025", source:"University Libraries", url:"https://libguides.library.albany.edu/academicintegrityai", color:"pc-green" },
    { icon:"🔒", title:"Data Privacy & AI Platforms", desc:"Requirements for data handling when using AI tools — FERPA compliance, prohibited data categories, approved vendor list, and reporting obligations.", updated:"Jul 2025", source:"Information Security Office", url:"https://wiki.albany.edu/display/public/askit/Internet+Privacy+Policy", color:"pc-blue" },
    { icon:"⚖️", title:"UAlbany Responsible AI Principles", desc:"Institutional framework for ethical, transparent, and equitable AI — covering trustworthiness, accountability, and inclusive design commitments.", updated:"Jun 2025", source:"Provost's Office", url:"https://www.albany.edu/provost", color:"pc-red" },
    { icon:"🎓", title:"Student FAQ: AI in the Classroom", desc:"Can I use ChatGPT? How do I cite AI? What are the academic integrity consequences? Answers to the most common student questions.", updated:"Sep 2025", source:"Dean of Students", url:"https://www.albany.edu/dean-of-students", color:"pc-teal" },
  ];

  return (
    <>
      <div className="page-header">
        <div className="container">
          <span className="eyebrow">AI &amp; Society College &middot; University at Albany</span>
          <h1 className="page-title">AI Policy &amp; Resources</h1>
          <p className="page-subtitle">Official UAlbany guidelines, governance frameworks, and tools for AI use across campus</p>
        </div>
      </div>
      <div className="tbar">
        <div className="tbar-inner">
          <span>Last updated April 2026</span>
          <button className="tbar-btn">Suggest an update</button>
        </div>
      </div>
      <div className="policy-wrap">
        <div className="policy-tool-card">
          <div className="policy-tool-icon">🤖</div>
          <div>
            <div className="policy-tool-title">AI Syllabus Engine</div>
            <div className="policy-tool-by">Developed by Kalonji Samuel &middot; MS Information Science, AI &amp; Society Fellow</div>
            <div className="policy-tool-desc">This tool helps faculty generate AI-aligned syllabi and policy language tailored to the University at Albany's institutional guidelines. Free to use for all UAlbany community members.</div>
            <a className="btn btn-primary" href="https://kalonjis914.github.io/AI-Syllabus-Engine/" target="_blank" rel="noopener noreferrer">
              Launch AI Syllabus Engine &#8594;
            </a>
          </div>
        </div>

        <div className="policy-grid">
          {policies.map((p, i) => (
            <div key={i} className={`policy-card ${p.color}`}>
              <div className="policy-card-icon">{p.icon}</div>
              <div className="policy-card-title">{p.title}</div>
              <p className="policy-card-desc">{p.desc}</p>
              <div className="policy-card-meta">Source: {p.source} &middot; Updated: {p.updated}</div>
              <div style={{marginTop:"0.75rem"}}>
                <a className="btn btn-ghost" href={p.url} target="_blank" rel="noopener noreferrer" style={{fontSize:"0.82rem",padding:"0.42rem 0.9rem"}}>
                  Read policy &#8594;
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ══ ABOUT PAGE ══ */
const ABOUT_TABS = ["About","Leadership","Fellowships"];

function AboutPage() {
  const [tab, setTab] = useState("About");

  return (
    <div className="about-page">
      <div className="about-hero">
        <div className="about-hero-inner">
          <span className="about-hero-kicker">AI &amp; Society College &middot; University at Albany</span>
          <h1 className="about-hero-title">AI &amp; Society College</h1>
          <p className="about-hero-sub">Founded Spring 2025 &middot; Preparing students, faculty, and staff for a world shaped by AI</p>
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

        {tab === "About" && (<>
          <div className="about-section">
            <h2 className="about-sh">About the College</h2>
            <img className="about-photo" src="https://www.albany.edu/sites/default/files/styles/thin_hero/public/ai-teaching-3.jpg" alt="UAlbany AI teaching" />
            <p className="about-p">Founded in Spring 2025 with a $2.4 million investment from the State University of New York (SUNY), the AI &amp; Society College prepares undergraduate and graduate students, faculty and staff for a world shaped by artificial intelligence.</p>
            <p className="about-p">With a strong emphasis on trustworthiness, equity, privacy and accountability, the College serves as a catalyst integrating AI education across all nine schools and colleges at the University at Albany.</p>
            <p className="about-p">The College ensures that every student — whether pursuing a degree in STEM, business, social sciences or the arts — has access to AI-infused learning through cross-disciplinary courses, microcredentials and teaching initiatives.</p>
          </div>

          <div className="about-section">
            <h2 className="about-sh">Physical Space &amp; AI Makerspace</h2>
            <img className="about-photo" src="https://www.albany.edu/sites/default/files/styles/thin_hero/public/ai-teaching.jpg" alt="UAlbany AI classroom" />
            <p className="about-p">The College will be housed in Lecture Center (LC) 30 and LC 31, designed for collaboration and innovation. Features include individual and group workspaces for fellows, an AI-enabled meeting room for hybrid events, a lounge for informal exchange, and GPU workstations in the AI Makerspace open to all UAlbany community members.</p>
            <p className="about-p">Stay tuned for the Spring 2026 ribbon cutting ceremony!</p>
          </div>

          <div className="about-section">
            <h2 className="about-sh">Contact the College</h2>
            <p className="about-p">Campus Community: Faculty, staff and students are invited to co-create innovative teaching, learning experiences, interdisciplinary programs and ways to promote ethical AI use.</p>
            <p className="about-p">Partners Beyond Campus: The AI &amp; Society College welcomes partnerships with industry, nonprofits, government and philanthropists.</p>
            <p className="about-p">Contact us at <a href="mailto:aisocietycollege@albany.edu">aisocietycollege@albany.edu</a> or <a href="https://www.linkedin.com/showcase/ai-society-ualbany/" target="_blank" rel="noopener noreferrer">follow us on LinkedIn</a>.</p>
            <div style={{display:"flex",gap:"0.75rem",flexWrap:"wrap",marginTop:"1rem"}}>
              <a className="btn btn-primary" href="https://www.albany.edu/ai-plus/ai-society-college" target="_blank" rel="noopener noreferrer">Official College Page &#8594;</a>
              <a className="btn btn-li" href="https://www.linkedin.com/showcase/ai-society-ualbany/" target="_blank" rel="noopener noreferrer">Follow on LinkedIn</a>
            </div>
          </div>
        </>)}

        {tab === "Leadership" && (<>
          <div className="about-section">
            <span className="section-label">Directors</span>
            <div className="person-grid-5">
              <PersonCard name="Hany Elgala" role="Acting Director, AI & Society College" dept="Associate Professor, Electrical & Computer Engineering, CNSE"
                photo={BASE+"2024-09/20240904_Hany_Elgala_IMG_0359.JPG?h=b11ddda9&itok=Q9psqyiw"}
                url="https://www.albany.edu/ece/faculty/hany-elgala"
                bio="Research on visible light communications, LiFi networks, and AI in wireless communications." />
              <PersonCard name="Mila Gascó-Hernandez" role="Acting Associate Director" dept="Associate Professor, Center for Technology in Government, Rockefeller College"
                photo={BASE+"2025-12/Foto%20Mila%20Gasco%20%289%29%20-%20UAlbany.jpg?h=6e0df202&itok=dA0YqEMI"}
                url="https://www.albany.edu/rockefeller/faculty/mila-gasco-hernandez"
                bio="Research on digital government, AI governance, and technology policy." />
            </div>
          </div>

          <div className="about-section">
            <span className="section-label">Advisory Board — Faculty Representatives</span>
            <div className="person-grid-5">
              <PersonCard name="Marcie Newton" role="Assistant Director & Lecturer II" dept="Writing & Critical Inquiry Program" photo={BASE+"2023-06/Marcie%20Newton.jpg?h=1114f690&itok=i9pTo0Tr"} url="https://www.albany.edu/writing-critical-inquiry/staff-directory/marcie-newton" />
              <PersonCard name="Rita Biswas" role="Ackner-Newman Endowed Professor, Finance" dept="Massry School of Business" photo={BASE+"2019-10/rita-biswas.jpg?h=4693a17a&itok=i0rqIvoS"} url="https://www.albany.edu/business/faculty/rita-biswas" />
              <PersonCard name="Alessandra Buccella" role="Assistant Professor" dept="Department of Philosophy" photo={BASE+"2024-09/20240828_Alessandra_Buccella_IMG_0457.JPG?h=d9227b67&itok=RYxbdoAD"} url="https://www.albany.edu/philosophy/faculty/alessandra-buccella" />
              <PersonCard name="M. Abdullah Canbaz" role="Assistant Professor, IST" dept="CEHC" photo={BASE+"2022-06/M.%20Abdullah-Canbaz.jpg?h=d8638c13&itok=jjGIeqKo"} url="https://www.albany.edu/cehc/faculty/m-abdullah-canbaz" />
              <PersonCard name="Ming-Ching Chang" role="Associate Professor" dept="Computer Science & ECE, CNSE" photo={BASE+"2016_10_25_Ming-Ching%20Chang_19.jpg?h=82f92a78&itok=aMg_DXr2"} url="https://www.albany.edu/computer-science/faculty/ming-ching-chang" />
              <PersonCard name="Daniel Goodwin" role="Professor & Department Chair" dept="Art & Art History" photo={BASE+"2023-09/daniel-goodwin.jpg?h=a7e6d17b&itok=hiSzKxk7"} url="https://www.albany.edu/art/faculty/daniel-goodwin" />
              <PersonCard name="Cecilia Levy" role="Associate Professor" dept="Department of Physics" photo={BASE+"2024-09/20240828_Cecilia_Levy_IMG_0274.JPG?h=0c848498&itok=Jyr-KILx"} url="https://www.albany.edu/physics/faculty/cecilia-levy" />
              <PersonCard name="Mary Valentis" role="Visiting Associate Professor; CHATS Director" dept="Department of English" photo={BASE+"2023-09/mary-valentis.jpg?h=a7e6d17b&itok=5-4U0YSb"} url="https://www.albany.edu/english/faculty/mary-valentis" />
              <PersonCard name="Xin Wang" role="Assistant Professor" dept="Epidemiology & Biostatistics, CIHS" photo={BASE+"2023-07/xin_wang.png?h=f1fd4c30&itok=M9MfE9Bz"} url="https://www.albany.edu/cihs/faculty/xin-wang" />
              <PersonCard name="Jianwei Zhang" role="Professor" dept="Educational Theory & Practice, School of Education" photo={BASE+"2022-08/Zhang-Jianwei.jpg?h=a7052f9c&itok=mLphmk2R"} url="https://www.albany.edu/education/faculty/jianwei-zhang" />
            </div>
          </div>

          <div className="about-section">
            <span className="section-label">Student Representatives</span>
            <div className="person-grid-5">
              <PersonCard name="Alana Borrero" role="Undergraduate Student Representative" photo={BASE+"Alana%20Borrero.jpeg?h=cb4297e8&itok=Jbui5LPG"} />
              <PersonCard name="Shannon Sutorius" role="Graduate Student Representative" photo={BASE+"Shannon%20Sutorius.JPG?h=d5b9011c&itok=EXkyG39J"} />
            </div>
          </div>
        </>)}

        {tab === "Fellowships" && (<>
          <div className="about-section">
            <h2 className="about-sh">Fellowship Programs</h2>
            <p className="about-p">Through fellowships, faculty and students join the College's interdisciplinary network dedicated to exploring AI's societal impact — from ethical frameworks to creative applications.</p>
            <p className="about-p"><strong>Faculty Innovation Fellowship</strong> — Funds faculty-led initiatives that expand UAlbany's AI curriculum, including student engagement, critical inquiry, and creative works that deploy or critique AI.</p>
            <p className="about-p"><strong>Dissertation Fellowship</strong> — Supports PhD research at the intersection of AI and society, including philosophical, artistic, and critical analysis of AI's role in creative and civic life.</p>
            <p className="about-p"><strong>Master's Experiential Learning Fellowship</strong> — Emphasizes hands-on, practical learning with fellows supporting the work of the AI &amp; Society College.</p>
            <p className="about-p" style={{color:"var(--pu)",fontWeight:600}}>Applications for 2026–2027 fellowships are now open. Contact <a href="mailto:helgala@albany.edu">helgala@albany.edu</a> or <a href="mailto:mgasco@albany.edu">mgasco@albany.edu</a>.</p>
          </div>

          <hr className="fellow-divider" />

          <div className="about-section">
            <h2 className="about-sh">2025–2026 Faculty Innovation Fellows</h2>
            <div className="person-grid-4">
              <PersonCard name="Cecilia Bibbò" role="Visiting Asst. Professor" dept="Educational Policy & Leadership, School of Education" photo={BASE+"2024-08/EDU_BibboCecilia.jpg?h=d25d6a3e&itok=DimiBC27"} url="https://www.albany.edu/education/faculty/cecilia-bibbo" />
              <PersonCard name="Sukwoong Choi" role="Asst. Professor, ISBA" dept="Massry School of Business" photo={BASE+"2023-09/Choi-Sukwoong-bio.jpg?h=923e616e&itok=P_Q3sx4S"} url="https://www.albany.edu/business/faculty/sukwoong-choi" />
              <PersonCard name="Jared R. Enriquez" role="Assistant Professor" dept="Geography, Planning, and Sustainability" photo={BASE+"2020-08/Jared-Enriquez-Bio_Photo.jpg?h=89d62fa1&itok=Tjb-Puf6"} url="https://www.albany.edu/geographyplanning/faculty/jared-r-enriquez" />
              <PersonCard name="Rey Koslowski" role="Professor; Director, MIA Program" dept="Political Science, Rockefeller College" photo={BASE+"Koslowski%2C%20Rey_9406-XL.jpg?h=50844e28&itok=UEQfMrzt"} url="https://www.albany.edu/rockefeller/faculty/rey-koslowski" />
              <PersonCard name="Luis Felipe Luna-Reyes" role="Chair & Professor" dept="Public Admin & Policy, Rockefeller College" photo={BASE+"2025-09/Luis_Luna_Reyes.jpg?h=2efb7f0c&itok=U2ZU4LVS"} url="https://www.albany.edu/rockefeller/faculty/luis-felipe-luna-reyes" />
              <PersonCard name="Sweta Vangaveti" role="Research Scientist" dept="The RNA Institute" photo={BASE+"2020-10/Sweta-Vangaveti.jpeg?h=6c83441f&itok=mMVFeaHm"} url="https://www.albany.edu/rna/faculty/sweta-vangaveti" />
              <PersonCard name="Jianwei Zhang" role="Professor" dept="Educational Theory & Practice, School of Education" photo={BASE+"2022-08/Zhang-Jianwei.jpg?h=a7052f9c&itok=mLphmk2R"} url="https://www.albany.edu/education/faculty/jianwei-zhang" />
            </div>
          </div>

          <hr className="fellow-divider" />

          <div className="about-section">
            <h2 className="about-sh">2025–2026 Dissertation Fellows</h2>
            <p className="about-p" style={{fontSize:"0.85rem",color:"var(--muted)",marginBottom:"1rem"}}>Click any card to read full bio.</p>
            <div className="person-grid-4">
              {["Rawan Abdelaal","Karan Bhasin","Anastasios Karnazes","Iris Aleida Pinzón Arteaga"].map(name => (
                <FellowCard key={name} name={name} />
              ))}
            </div>
          </div>

          <hr className="fellow-divider" />

          <div className="about-section">
            <h2 className="about-sh">Spring 2026 Master's Experiential Learning Fellows</h2>
            <p className="about-p" style={{fontSize:"0.85rem",color:"var(--muted)",marginBottom:"1rem"}}>Click any card to read full bio.</p>
            <div className="person-grid-4">
              {["Batzaya (Zaya) Byambasambuu","Kathleen Boyle","Ayotokunbo Egbontan","Prakash R. Kota","Jayanth Reddy Lethakula","Robert Manning","Kalonji Samuel","Gayathri Gupta Samudrala"].map(name => (
                <FellowCard key={name} name={name} />
              ))}
            </div>
          </div>
        </>)}

      </div>
    </div>
  );
}

/* ══ APP ROOT ══ */
export default function App() {
  const [page, setPage] = useState("courses");
  const [catalog, setCatalog] = useState([]);

  useEffect(() => {
    fetch("/courses.json")
      .then(r => r.json())
      .then(data => setCatalog(data))
      .catch(err => console.error("Failed to load courses.json:", err));
  }, []);

  function goTo(p) { setPage(p); try { window.scrollTo(0, 0); } catch (_) {} }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="app">
        <header className="site-header">
          <div className="header-inner">
            <nav className="site-nav">
              <button className={`nav-link${page === "courses" ? " active" : ""}`} onClick={() => goTo("courses")}>Courses &amp; Programs</button>
              <button className={`nav-link${page === "policy"  ? " active" : ""}`} onClick={() => goTo("policy")}>AI Policy</button>
              <button className={`nav-link${page === "about"   ? " active" : ""}`} onClick={() => goTo("about")}>About</button>
            </nav>
          </div>
        </header>

        <main style={{flex:1}}>
          {page === "courses" && <CoursesPage catalog={catalog} />}
          {page === "policy"  && <PolicyPage />}
          {page === "about"   && <AboutPage />}
        </main>

        <footer className="site-footer">
          <div className="footer-inner">
            <span>&#169; 2026 University at Albany, SUNY &middot; AI Curriculum Navigator</span>
            <span>Data: Registrar &middot; Undergraduate &amp; Graduate Bulletins &middot; PaCE &middot; <a href="https://www.suny.edu/google/ai-certificate/" target="_blank" rel="noopener noreferrer">SUNY&ndash;Google Partnership</a></span>
            <span><a href="mailto:aisocietycollege@albany.edu">Contact</a></span>
          </div>
          <div className="footer-inner footer-credit">
            <span>Developed by Batzaya (Zaya) Byambasambuu &middot; AI &amp; Society Experiential Learning Fellow &middot; 2025&ndash;2026</span>
          </div>
        </footer>
      </div>
    </>
  );
}
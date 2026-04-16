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
html{scroll-behavior:smooth}
body{margin:0;font-family:var(--font);background:var(--bg);color:var(--text);line-height:1.6;-webkit-font-smoothing:antialiased}
button,select,input{font-family:var(--font)}
a{color:inherit;text-decoration:none}
.app{display:flex;flex-direction:column;min-height:100vh}

.site-header{position:sticky;top:0;z-index:20;background:var(--ch);border-bottom:3px solid var(--go)}
.header-inner{width:min(var(--container),calc(100% - 2rem));margin:0 auto;display:flex;align-items:stretch;height:56px}
.site-nav{display:flex;align-items:stretch;gap:0}
.nav-link{padding:0 1.1rem;display:flex;align-items:center;color:rgba(255,255,255,.52);font-size:0.82rem;font-weight:500;cursor:pointer;border:none;background:none;border-bottom:3px solid transparent;margin-bottom:-3px;transition:all 0.15s;white-space:nowrap;letter-spacing:.01em}
.nav-link:hover{color:rgba(255,255,255,.88);background:rgba(255,255,255,.05)}
.nav-link.active{color:#fff;border-bottom-color:var(--go)}

.page-header{background:var(--ch2);padding:2.75rem 0 2.25rem;position:relative}
.page-header::after{content:'';position:absolute;bottom:0;left:calc((100% - min(var(--container),calc(100% - 2rem)))/2);width:56px;height:2px;background:var(--go)}
.page-header .container{width:min(var(--container),calc(100% - 2rem));margin:0 auto}
.eyebrow{display:block;margin:0 0 0.65rem;color:var(--go);text-transform:uppercase;letter-spacing:.16em;font-size:0.68rem;font-weight:700}
.page-title{font-family:var(--ds);font-size:clamp(2rem,4vw,3rem);font-weight:400;line-height:1.1;margin:0 0 0.3rem;color:#fff;letter-spacing:-.02em}
.page-subtitle{font-size:0.9rem;color:rgba(255,255,255,.42);margin:0;font-weight:300}
.page-tagline{font-size:0.85rem;color:rgba(255,255,255,.32);margin:0.4rem 0 1.75rem;font-weight:300;letter-spacing:.01em}
.search-input{width:100%;max-width:500px;border:1px solid rgba(198,146,20,.38);background:rgba(255,255,255,.07);border-radius:4px;padding:0.72rem 1rem;font:inherit;font-size:0.88rem;color:#fff;outline:none;transition:border-color 0.18s,box-shadow 0.18s}
.search-input:focus{border-color:var(--go);box-shadow:0 0 0 3px rgba(198,146,20,.14)}
.search-input::placeholder{color:rgba(255,255,255,.26)}

.tbar{background:var(--surface-muted);border-bottom:1px solid var(--border);padding:0.45rem 0}
.tbar-inner{width:min(var(--container),calc(100% - 2rem));margin:0 auto;display:flex;align-items:center;justify-content:flex-end;gap:1.25rem;font-size:0.68rem;color:var(--muted)}
.tbar-btn{background:none;border:none;font-size:0.68rem;color:var(--pu);cursor:pointer;text-decoration:underline}

.chips-wrap{background:var(--bg);border-bottom:1px solid var(--border);padding:0.9rem 0}
.chips-row{width:min(var(--container),calc(100% - 2rem));margin:0 auto;display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.chips-label{font-size:.72rem;font-weight:600;color:var(--muted);letter-spacing:.03em;margin-right:4px;white-space:nowrap}
.chip{display:inline-flex;align-items:center;padding:5px 13px;border-radius:20px;font-size:.73rem;font-weight:600;border:1.5px solid transparent;cursor:pointer;transition:all .15s;white-space:nowrap}
.chip-ml  {background:#ede5f8;color:#46166b;border-color:#d4c2f0}.chip-ml.on,.chip-ml:hover{background:#46166b;color:#fff;border-color:#46166b}
.chip-gen {background:#e3ebf9;color:#1540a8;border-color:#b8cdf0}.chip-gen.on,.chip-gen:hover{background:#1540a8;color:#fff;border-color:#1540a8}
.chip-eth {background:#fdf6de;color:#8a6508;border-color:#f0d98a}.chip-eth.on,.chip-eth:hover{background:#C69214;color:#fff;border-color:#C69214}
.chip-data{background:#e3f2eb;color:#14653c;border-color:#9fd4b8}.chip-data.on,.chip-data:hover{background:#14653c;color:#fff;border-color:#14653c}
.chip-hlt {background:#fde8e8;color:#a32d2d;border-color:#f0b8b8}.chip-hlt.on,.chip-hlt:hover{background:#a32d2d;color:#fff;border-color:#a32d2d}
.chip-sec {background:#fff3e0;color:#a05010;border-color:#f0c88a}.chip-sec.on,.chip-sec:hover{background:#a05010;color:#fff;border-color:#a05010}

.catalog-layout{width:min(var(--container),calc(100% - 2rem));margin:0 auto;display:grid;grid-template-columns:252px 1fr;gap:1.5rem;padding:1.5rem 0 3rem;align-items:start}
.sidebar{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm);box-shadow:var(--shadow-sm);position:sticky;top:68px;overflow:hidden}
.sidebar-header{padding:0.7rem 1rem;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;background:var(--ch)}
.sidebar-label{font-size:0.62rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.6)}
.sidebar-clear{background:none;border:none;font-size:0.72rem;font-weight:600;color:var(--go);cursor:pointer;padding:0}
.sidebar-clear:hover{text-decoration:underline}
.filter-group{border-bottom:1px solid var(--border)}
.filter-group:last-child{border-bottom:none}
.fg-header{padding:0.65rem 1rem;display:flex;align-items:center;justify-content:space-between;cursor:pointer;user-select:none;transition:background 0.12s}
.fg-header:hover{background:var(--surface-muted)}
.fg-label{font-size:0.8rem;font-weight:600;color:var(--text)}
.fg-arrow{font-size:0.55rem;color:#b0a8c0;transition:transform 0.2s}
.fg-arrow.open{transform:rotate(180deg)}
.fg-options{padding:0.25rem 1rem 0.8rem;display:flex;flex-direction:column;gap:0.42rem}
.fg-opt{display:flex;align-items:flex-start;gap:0.5rem;cursor:pointer;font-size:0.8rem;color:var(--muted);line-height:1.4}
.fg-opt input{accent-color:var(--pu);cursor:pointer;margin-top:3px;flex-shrink:0}

.results{display:flex;flex-direction:column;gap:0.75rem}
.results-bar{display:flex;align-items:center;gap:0.75rem;margin-bottom:0.2rem;flex-wrap:wrap}
.results-count{font-size:0.78rem;color:var(--muted);white-space:nowrap}
.v-tog{display:flex;border:1px solid var(--border);border-radius:6px;overflow:hidden}
.v-btn{background:none;border:none;padding:6px 10px;cursor:pointer;font-size:0.82rem;color:var(--muted);transition:all .15s}
.v-btn.on{background:var(--pu);color:#fff}

.badge{display:inline-flex;align-items:center;padding:3px 10px;border-radius:20px;font-size:0.7rem;font-weight:600;white-space:nowrap;letter-spacing:.01em}
.badge-dc{background:#ede5f8;color:#46166b}.badge-mc{background:#fdf6de;color:#8a6508}.badge-ec{background:#e3f2eb;color:#14653c}
.badge-cert{background:#e8f0fe;color:#1a47b0}.badge-ug{background:#e3ebf9;color:#1540a8}.badge-gr{background:#ede5f8;color:#46166b}
.badge-free{background:#d2f4e3;color:#0b5e31;border:1px solid #9de3bf}.badge-prov{background:#e8f0fe;color:#1a47b0}
.badge-inp{background:#e3f2eb;color:#14653c}.badge-onl{background:#e3ebf9;color:#1540a8}.badge-hyb{background:#fff3e0;color:#a05010}
.badge-def{background:#eeedf4;color:#5a5475}

.card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm);overflow:hidden;transition:all 0.18s ease;cursor:pointer}
.card:hover{transform:translateY(-2px);border-color:rgba(198,146,20,.4);box-shadow:var(--shadow-sm)}
.card-body{padding:1.1rem 1.2rem}
.card-topline{display:flex;gap:5px;flex-wrap:wrap;margin-bottom:0.5rem}
.card-code{font-size:0.68rem;font-weight:700;color:var(--go);letter-spacing:.08em;text-transform:uppercase;margin-bottom:0.15rem}
.card-title{font-size:0.97rem;font-weight:600;color:var(--text);line-height:1.3;margin-bottom:0.15rem}
.card-school{font-size:0.75rem;color:var(--muted);margin-bottom:0.6rem}
.card-desc{font-size:0.82rem;color:var(--muted);line-height:1.62;margin-bottom:0.6rem}
.card-footer{padding:0.65rem 1.2rem;border-top:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;gap:0.5rem;background:var(--surface-muted)}
.card-source{font-size:0.66rem;color:#b0a8c0}
.text-link{color:var(--pu);font-weight:600;font-size:0.8rem;text-decoration:none;transition:color 0.15s}
.text-link:hover{text-decoration:underline}

.gc-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:0.75rem}
.gc{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm);overflow:hidden;cursor:pointer;transition:all 0.18s;display:flex;flex-direction:column}
.gc:hover{transform:translateY(-2px);border-color:rgba(198,146,20,.4);box-shadow:var(--shadow-sm)}
.gc-top{height:3px}
.gc-body{padding:0.95rem 1.1rem;flex:1}
.gc-code{font-size:0.65rem;font-weight:700;color:var(--go);letter-spacing:.08em;text-transform:uppercase;margin-bottom:0.15rem}
.gc-title{font-size:0.88rem;font-weight:600;color:var(--text);line-height:1.3;margin-bottom:0.15rem}
.gc-school{font-size:0.7rem;color:var(--muted);margin-bottom:0.5rem}
.gc-desc{font-size:0.78rem;color:var(--muted);line-height:1.55}
.gc-badges{padding:0 1.1rem 0.65rem;display:flex;flex-wrap:wrap;gap:4px}
.gc-footer{padding:0.6rem 1.1rem;border-top:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;background:var(--surface-muted);margin-top:auto}

.overlay{position:fixed;inset:0;background:rgba(0,0,0,.58);z-index:100;display:flex;align-items:flex-start;justify-content:center;padding:3rem 1.5rem;overflow-y:auto;backdrop-filter:blur(5px);animation:fadeIn 0.15s ease}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
.modal{background:var(--surface);border-radius:var(--radius);max-width:720px;width:100%;box-shadow:0 24px 64px rgba(49,31,74,0.22);overflow:hidden;border-top:3px solid var(--go);animation:slideUp 0.2s cubic-bezier(0.16,1,0.3,1)}
@keyframes slideUp{from{transform:translateY(14px);opacity:0}to{transform:translateY(0);opacity:1}}
.modal-header{background:var(--ch);padding:1.5rem 1.75rem 1.3rem;position:relative}
.modal-close{position:absolute;top:0.85rem;right:0.85rem;background:rgba(255,255,255,.12);border:none;color:#fff;width:30px;height:30px;border-radius:50%;cursor:pointer;font-size:0.85rem;display:flex;align-items:center;justify-content:center;transition:background 0.15s}
.modal-close:hover{background:rgba(255,255,255,.24)}
.modal-badges{display:flex;gap:5px;flex-wrap:wrap;margin-bottom:0.5rem}
.modal-title{font-family:var(--ds);font-size:1.4rem;font-weight:400;color:#fff;line-height:1.2;letter-spacing:-.01em}
.modal-body{padding:1.5rem 1.75rem}
.modal-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.85rem 1.5rem;margin-bottom:1.25rem}
.modal-field-label{font-size:0.62rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-bottom:0.2rem}
.modal-field-value{font-size:0.86rem;color:var(--text);line-height:1.55}
.modal-section{margin-bottom:1rem}
.modal-footer{padding:1rem 1.75rem;border-top:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;gap:0.75rem;flex-wrap:wrap}

.btn{display:inline-flex;align-items:center;gap:0.3rem;padding:0.52rem 1rem;border-radius:var(--radius-sm);font-size:0.8rem;font-weight:600;cursor:pointer;border:none;transition:all 0.15s;text-decoration:none;white-space:nowrap}
.btn-primary{background:var(--pu);color:#fff}.btn-primary:hover{background:var(--pud)}
.btn-gold{background:var(--go);color:#1a1a1a}.btn-gold:hover{background:var(--gol)}
.btn-ghost{background:transparent;color:var(--text);border:1px solid var(--border)}.btn-ghost:hover{border-color:var(--pu);color:var(--pu)}
.btn-free{background:var(--grn);color:#fff}.btn-free:hover{background:#0d5230}
.btn-li{background:#0077b5;color:#fff}.btn-li:hover{background:#005e8e}

/* POLICY PAGE */
.policy-wrap{width:min(var(--container),calc(100% - 2rem));margin:0 auto;padding:2rem 0 3rem}
.policy-tool-frame{border-radius:var(--radius-sm);overflow:hidden;border:1px solid var(--border);box-shadow:var(--shadow);margin-bottom:2.5rem;background:var(--surface)}
.policy-tool-label{padding:0.6rem 1rem;background:var(--pud);font-size:0.68rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.7);display:flex;align-items:center;justify-content:space-between}
.policy-tool-label a{color:var(--go);font-size:0.7rem;font-weight:600;text-decoration:underline}
.policy-tool-frame iframe{width:100%;height:520px;border:none;display:block}
.policy-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:1.25rem}
.policy-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm);padding:1.4rem 1.5rem 1.4rem 1.75rem;transition:all 0.18s;box-shadow:var(--shadow-sm);display:flex;flex-direction:column;gap:0.5rem;border-left-width:4px}
.policy-card:hover{box-shadow:var(--shadow);transform:translateY(-2px)}
.pc-purple{border-left-color:#46166b}
.pc-gold  {border-left-color:#C69214}
.pc-green {border-left-color:#14653c}
.pc-blue  {border-left-color:#1540a8}
.pc-red   {border-left-color:#a32d2d}
.pc-teal  {border-left-color:#0e7490}
.policy-card-icon{font-size:1.4rem}
.policy-card-title{font-size:0.95rem;font-weight:700;color:var(--text)}
.policy-card-desc{font-size:0.82rem;color:var(--muted);line-height:1.65;flex:1}
.policy-card-meta{font-size:0.68rem;color:#b0a8c0}

/* ABOUT PAGE */
.about-page{min-height:calc(100vh - 180px)}
.about-hero{background:var(--ch2);padding:2.75rem 1.5rem 2.25rem;position:relative}
.about-hero::after{content:'';position:absolute;bottom:0;left:1.5rem;width:56px;height:2px;background:var(--go)}
.about-hero-inner{max-width:900px;margin:0 auto}
.about-hero-kicker{display:block;font-size:0.68rem;font-weight:700;color:var(--go);letter-spacing:.16em;margin-bottom:0.5rem;text-transform:uppercase}
.about-hero-title{font-family:var(--ds);font-size:clamp(1.7rem,3vw,2.4rem);font-weight:400;color:#fff;line-height:1.12;margin:0 0 0.4rem;letter-spacing:-.02em}
.about-hero-sub{font-size:0.86rem;color:rgba(255,255,255,.38);line-height:1.65;max-width:520px;margin:0;font-weight:300}
.about-tabs-bar{background:var(--surface);border-bottom:1px solid var(--border);position:sticky;top:56px;z-index:10}
.about-tabs-inner{max-width:900px;margin:0 auto;padding:0 1.5rem;display:flex;gap:0;overflow-x:auto}
.about-tab{background:none;border:none;border-bottom:2px solid transparent;padding:0.7rem 1rem;margin-bottom:-1px;font-size:0.82rem;font-weight:500;color:var(--muted);cursor:pointer;white-space:nowrap;transition:all 0.15s}
.about-tab:hover{color:var(--text)}
.about-tab.active{color:var(--pu);border-bottom-color:var(--go);font-weight:600}
.about-content{max-width:900px;margin:0 auto;padding:2rem 1.5rem 3rem}
.about-section{margin-bottom:2rem}
.about-sh{font-family:var(--ds);font-size:1.2rem;color:var(--text);margin:0 0 0.75rem;letter-spacing:-.01em}
.about-p{font-size:0.88rem;color:var(--muted);line-height:1.82;margin:0 0 0.6rem}
.about-p a{color:var(--pu);font-weight:600}.about-p a:hover{text-decoration:underline}
.about-p strong{color:var(--text)}
.about-photo{width:100%;border-radius:var(--radius-sm);object-fit:cover;display:block;margin:1rem 0 1.5rem;max-height:280px}

/* PERSON GRID */
.section-label{font-size:0.65rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--go);margin:0 0 0.75rem;display:block}
.person-grid-2{display:grid;grid-template-columns:repeat(2,1fr);gap:1rem;margin-bottom:1.5rem}
.person-grid-5{display:grid;grid-template-columns:repeat(5,1fr);gap:0.85rem;margin-bottom:1.5rem}
.person-grid-4{display:grid;grid-template-columns:repeat(4,1fr);gap:0.85rem;margin-bottom:1.5rem}
.pcard{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm);overflow:hidden;transition:border-color 0.15s;display:flex;flex-direction:column}
.pcard:hover{border-color:rgba(70,22,107,0.3);box-shadow:var(--shadow-sm)}
.pcard-photo{width:100%;aspect-ratio:1/1;object-fit:cover;object-position:top;display:block;background:var(--pul)}
.pcard-photo-placeholder{width:100%;aspect-ratio:1/1;background:linear-gradient(135deg,var(--pu),#8a3cc0);display:flex;align-items:center;justify-content:center;font-size:1.4rem;font-weight:700;color:#fff}
.pcard-body{padding:0.75rem 0.85rem;flex:1;display:flex;flex-direction:column;gap:0.15rem}
.pcard-name{font-size:0.82rem;font-weight:700;color:var(--text);line-height:1.3}
.pcard-role{font-size:0.72rem;color:var(--pu);font-weight:600;line-height:1.3}
.pcard-dept{font-size:0.68rem;color:var(--muted);line-height:1.4;margin-top:0.1rem}
.pcard-bio{font-size:0.72rem;color:var(--muted);line-height:1.55;margin-top:0.35rem}
.pcard-link{font-size:0.72rem;color:var(--pu);font-weight:600;margin-top:auto;padding-top:0.4rem;text-decoration:none}
.pcard-link:hover{text-decoration:underline}

/* FELLOWSHIP CLEAN TEXT */
.fellow-type{margin-bottom:1.75rem}
.fellow-type-title{font-family:var(--ds);font-size:1.05rem;color:var(--text);margin:0 0 0.2rem}
.fellow-type-desc{font-size:0.84rem;color:var(--muted);line-height:1.75;margin:0 0 1rem}
.fellow-divider{border:none;border-top:1px solid var(--border);margin:1.5rem 0}

/* FOOTER */
.site-footer{border-top:2px solid var(--go);background:var(--ch2);margin-top:auto}
.footer-inner{width:min(var(--container),calc(100% - 2rem));margin:0 auto;display:flex;justify-content:space-between;align-items:center;gap:1rem;padding:0.9rem 0;font-size:0.72rem;color:rgba(255,255,255,.3);flex-wrap:wrap}
.footer-inner a{color:rgba(255,255,255,.45);font-weight:600}
.footer-credit{padding-bottom:0.5rem;font-size:0.63rem;color:rgba(255,255,255,.22)}

.empty{text-align:center;padding:3rem 1.5rem;color:var(--muted)}
.empty-icon{font-size:2rem;margin-bottom:0.75rem}
.empty p{font-size:0.88rem;max-width:340px;margin:0 auto;line-height:1.65}

@media(max-width:960px){
  .catalog-layout{grid-template-columns:1fr}.sidebar{position:static}
  .gc-grid,.policy-grid{grid-template-columns:1fr}
  .modal-grid{grid-template-columns:1fr}
  .person-grid-5,.person-grid-4{grid-template-columns:repeat(2,1fr)}
  .person-grid-2{grid-template-columns:1fr}
  .footer-inner{flex-direction:column;align-items:flex-start}
}
`;

const credBadge = t => ({"Degree Course":"badge-dc","Microcredential":"badge-mc","External Certificate":"badge-ec","Degree Program":"badge-cert","Academic Minor":"badge-def"}[t]||"badge-def");
const levelBadge = l => ({"Undergraduate":"badge-ug","Graduate":"badge-gr","Certificate":"badge-cert"}[l]||"badge-def");
const fmtBadge  = f => ({"In-Person":"badge-inp","Online":"badge-onl","Hybrid":"badge-hyb"}[f]||"badge-def");
const topColor  = t => ({"Degree Course":"var(--pu)","Microcredential":"var(--go)","External Certificate":"var(--grn)","Degree Program":"#1540a8","Academic Minor":"#a05010"}[t]||"var(--border)");

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
                <div key={r.id} style={{background:"var(--surface-muted)",borderRadius:8,padding:"0.55rem 0.85rem",marginBottom:6,fontSize:"0.8rem",display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}}>
                  <span style={{color:"var(--text)",fontWeight:600}}>{r.code ? `${r.code}: ` : ""}{r.title}</span>
                  <span className={`badge ${credBadge(r.credentialType)}`} style={{flexShrink:0,fontSize:"0.66rem"}}>{r.credentialType}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="modal-footer">
          <span style={{fontSize:"0.68rem",color:"#b0a8c0"}}>Source: {item.source}</span>
          <a className={`btn ${item.isFree ? "btn-free" : "btn-gold"}`} href={item.sourceUrl} target="_blank" rel="noopener noreferrer">
            {item.isFree ? "Enroll Free \u2192" : "Official Listing \u2192"}
          </a>
        </div>
      </div>
    </div>
  );
}

/* ══ COURSES PAGE — untouched ══ */
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
                    <span style={{fontSize:"0.65rem",color:"#b0a8c0"}}>{c.term}</span>
                    <button className="btn btn-primary" style={{padding:"0.3rem 0.75rem",fontSize:"0.72rem"}} onClick={() => setSelected(c)}>Details &#8594;</button>
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
    { icon:"📋", title:"Academic Integrity & AI Use Policy",
      desc:"Official UAlbany guidance on using AI tools in coursework, assessments, and research — covering citation, disclosure, and clear boundaries for students and instructors.",
      updated:"Aug 2025", source:"Office of Academic Affairs",
      url:"https://libguides.library.albany.edu/academicintegrityai", color:"pc-purple" },
    { icon:"🛠", title:"CATLOE Teaching Resources for AI",
      desc:"Practical guides from the Center for Advancement of Teaching, Learning & Online Education for instructors at every level of AI familiarity.",
      updated:"Sep 2025", source:"CATLOE",
      url:"https://www.albany.edu/teaching-and-learning/teaching-resources", color:"pc-gold" },
    { icon:"📚", title:"University Libraries: Generative AI Guide",
      desc:"Curated research guide on generative AI and academic integrity, plus citation tools, AI literacy resources, and library support.",
      updated:"Aug 2025", source:"University Libraries",
      url:"https://libguides.library.albany.edu/academicintegrityai", color:"pc-green" },
    { icon:"🔒", title:"Data Privacy & AI Platforms",
      desc:"Requirements for data handling when using AI tools — FERPA compliance, prohibited data categories, approved vendor list, and reporting obligations.",
      updated:"Jul 2025", source:"Information Security Office",
      url:"https://wiki.albany.edu/display/public/askit/Internet+Privacy+Policy", color:"pc-blue" },
    { icon:"⚖️", title:"UAlbany Responsible AI Principles",
      desc:"Institutional framework for ethical, transparent, and equitable AI — covering trustworthiness, accountability, and inclusive design commitments.",
      updated:"Jun 2025", source:"Provost's Office",
      url:"https://www.albany.edu/provost", color:"pc-red" },
    { icon:"🎓", title:"Student FAQ: AI in the Classroom",
      desc:"Can I use ChatGPT? How do I cite AI? What are the academic integrity consequences? Answers to the most common student questions.",
      updated:"Sep 2025", source:"Dean of Students",
      url:"https://www.albany.edu/dean-of-students", color:"pc-teal" },
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
        {/* Kalonji's tool embedded as iframe */}
        <div className="policy-tool-frame">
          <div className="policy-tool-label">
            <span>🤖 AI Syllabus &amp; Policy Generator — Built by Kalonji Samuel, AI &amp; Society Fellow</span>
            <a href="https://kalonjis914.github.io/AI-Syllabus-Engine/" target="_blank" rel="noopener noreferrer">Open in new tab ↗</a>
          </div>
          <iframe
            src="https://kalonjis914.github.io/AI-Syllabus-Engine/"
            title="AI Syllabus Engine"
            allow="clipboard-write"
          />
        </div>

        {/* Policy cards */}
        <div className="policy-grid">
          {policies.map((p, i) => (
            <div key={i} className={`policy-card ${p.color}`}>
              <div className="policy-card-icon">{p.icon}</div>
              <div className="policy-card-title">{p.title}</div>
              <p className="policy-card-desc">{p.desc}</p>
              <div className="policy-card-meta">Source: {p.source} &middot; Updated: {p.updated}</div>
              <div style={{marginTop:"0.75rem"}}>
                <a className="btn btn-ghost" href={p.url} target="_blank" rel="noopener noreferrer"
                  style={{fontSize:"0.76rem",padding:"0.4rem 0.85rem"}}>
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

/* ══ PERSON CARD ══ */
function PersonCard({ name, role, dept, photo, url, bio }) {
  const [imgErr, setImgErr] = useState(false);
  const initials = name.split(" ").map(w=>w[0]).join("").slice(0,2);
  return (
    <div className="pcard">
      {photo && !imgErr
        ? <img className="pcard-photo" src={photo} alt={name} onError={() => setImgErr(true)} />
        : <div className="pcard-photo-placeholder">{initials}</div>
      }
      <div className="pcard-body">
        <div className="pcard-name">{name}</div>
        <div className="pcard-role">{role}</div>
        {dept && <div className="pcard-dept">{dept}</div>}
        {bio && <div className="pcard-bio">{bio}</div>}
        {url && <a className="pcard-link" href={url} target="_blank" rel="noopener noreferrer">Profile &#8594;</a>}
      </div>
    </div>
  );
}

/* ══ ABOUT PAGE ══ */
const ABOUT_TABS = ["About","Leadership","Fellowships"];
const BASE = "https://www.albany.edu/sites/default/files/styles/person_list/public/";

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

        {/* ── ABOUT TAB ── */}
        {tab === "About" && (<>
          <div className="about-section">
            <h2 className="about-sh">About the College</h2>
            <img className="about-photo" src="https://www.albany.edu/sites/default/files/styles/thin_hero/public/ai-teaching-3.jpg" alt="UAlbany AI teaching" />
            <p className="about-p">Founded in Spring 2025 with a <strong>$2.4 million investment from the State University of New York (SUNY)</strong>, the AI &amp; Society College prepares undergraduate and graduate students, faculty and staff for a world shaped by artificial intelligence.</p>
            <p className="about-p">With a strong emphasis on trustworthiness, equity, privacy and accountability, the College serves as a catalyst integrating AI education across all nine schools and colleges at the University at Albany.</p>
            <p className="about-p">The College ensures that every student — whether pursuing a degree in STEM, business, social sciences or the arts — has access to AI-infused learning through cross-disciplinary courses, microcredentials and teaching initiatives.</p>
          </div>

          <div className="about-section">
            <h2 className="about-sh">Physical Space &amp; AI Makerspace</h2>
            <img className="about-photo" src="https://www.albany.edu/sites/default/files/styles/thin_hero/public/ai-teaching.jpg" alt="UAlbany AI classroom" />
            <p className="about-p">The College will be housed in <strong>Lecture Center (LC) 30 and LC 31</strong>, designed for collaboration and innovation. Features include individual and group workspaces for fellows, an AI-enabled meeting room for hybrid events, a lounge for informal exchange, and <strong>GPU workstations in the AI Makerspace</strong> open to all UAlbany community members.</p>
            <p className="about-p">Stay tuned for the <strong>Spring 2026 ribbon cutting ceremony!</strong></p>
          </div>

          <div className="about-section">
            <h2 className="about-sh">Contact the College</h2>
            <p className="about-p"><strong>Campus Community:</strong> Faculty, staff and students are invited to co-create innovative teaching, learning experiences, interdisciplinary programs and ways to promote ethical AI use.</p>
            <p className="about-p"><strong>Partners Beyond Campus:</strong> The AI &amp; Society College welcomes partnerships with industry, nonprofits, government and philanthropists.</p>
            <p className="about-p">Contact us at <a href="mailto:aisocietycollege@albany.edu">aisocietycollege@albany.edu</a> or <a href="https://www.linkedin.com/showcase/ai-society-ualbany/" target="_blank" rel="noopener noreferrer">follow us on LinkedIn</a>.</p>
            <div style={{display:"flex",gap:"0.75rem",flexWrap:"wrap",marginTop:"1rem"}}>
              <a className="btn btn-primary" href="https://www.albany.edu/ai-plus/ai-society-college" target="_blank" rel="noopener noreferrer">Official College Page &#8594;</a>
              <a className="btn btn-li" href="https://www.linkedin.com/showcase/ai-society-ualbany/" target="_blank" rel="noopener noreferrer">Follow on LinkedIn</a>
            </div>
          </div>
        </>)}

        {/* ── LEADERSHIP TAB ── */}
        {tab === "Leadership" && (<>
          <div className="about-section">
            <span className="section-label">Directors</span>
            <div className="person-grid-2">
              <PersonCard name="Hany Elgala" role="Acting Director, AI & Society College"
                dept="Associate Professor, Electrical & Computer Engineering, CNSE"
                photo={BASE+"2024-09/20240904_Hany_Elgala_IMG_0359.JPG?h=b11ddda9&itok=Q9psqyiw"}
                url="https://www.albany.edu/ece/faculty/hany-elgala"
                bio="Research focuses on visible light communications, LiFi networks, and AI in wireless communications." />
              <PersonCard name="Mila Gascó-Hernandez" role="Acting Associate Director"
                dept="Associate Professor & Research Director, Center for Technology in Government, Rockefeller College"
                photo={BASE+"2025-12/Foto%20Mila%20Gasco%20%289%29%20-%20UAlbany.jpg?h=6e0df202&itok=dA0YqEMI"}
                url="https://www.albany.edu/rockefeller/faculty/mila-gasco-hernandez"
                bio="Research focuses on digital government, AI governance, and technology policy." />
            </div>
          </div>

          <div className="about-section">
            <span className="section-label">Advisory Board — Faculty Representatives (1 of 2)</span>
            <div className="person-grid-5">
              <PersonCard name="Marcie Newton" role="Assistant Director & Lecturer II" dept="Writing & Critical Inquiry Program" photo={BASE+"2023-06/Marcie%20Newton.jpg?h=1114f690&itok=i9pTo0Tr"} url="https://www.albany.edu/writing-critical-inquiry/staff-directory/marcie-newton" />
              <PersonCard name="Rita Biswas" role="Ackner-Newman Endowed Professor, Finance" dept="Massry School of Business" photo={BASE+"2019-10/rita-biswas.jpg?h=4693a17a&itok=i0rqIvoS"} url="https://www.albany.edu/business/faculty/rita-biswas" />
              <PersonCard name="Alessandra Buccella" role="Assistant Professor" dept="Department of Philosophy" photo={BASE+"2024-09/20240828_Alessandra_Buccella_IMG_0457.JPG?h=d9227b67&itok=RYxbdoAD"} url="https://www.albany.edu/philosophy/faculty/alessandra-buccella" />
              <PersonCard name="M. Abdullah Canbaz" role="Assistant Professor, IST" dept="CEHC" photo={BASE+"2022-06/M.%20Abdullah-Canbaz.jpg?h=d8638c13&itok=jjGIeqKo"} url="https://www.albany.edu/cehc/faculty/m-abdullah-canbaz" />
              <PersonCard name="Ming-Ching Chang" role="Associate Professor" dept="Computer Science & ECE, CNSE" photo={BASE+"2016_10_25_Ming-Ching%20Chang_19.jpg?h=82f92a78&itok=aMg_DXr2"} url="https://www.albany.edu/computer-science/faculty/ming-ching-chang" />
            </div>
          </div>

          <div className="about-section">
            <span className="section-label">Advisory Board — Faculty Representatives (2 of 2)</span>
            <div className="person-grid-5">
              <PersonCard name="Daniel Goodwin" role="Professor & Department Chair" dept="Art & Art History" photo={BASE+"2023-09/daniel-goodwin.jpg?h=a7e6d17b&itok=hiSzKxk7"} url="https://www.albany.edu/art/faculty/daniel-goodwin" />
              <PersonCard name="Cecilia Levy" role="Associate Professor" dept="Department of Physics" photo={BASE+"2024-09/20240828_Cecilia_Levy_IMG_0274.JPG?h=0c848498&itok=Jyr-KILx"} url="https://www.albany.edu/physics/faculty/cecilia-levy" />
              <PersonCard name="Mary Valentis" role="Visiting Associate Professor; CHATS Director" dept="Department of English" photo={BASE+"2023-09/mary-valentis.jpg?h=a7e6d17b&itok=5-4U0YSb"} url="https://www.albany.edu/english/faculty/mary-valentis" />
              <PersonCard name="Xin Wang" role="Assistant Professor" dept="Epidemiology & Biostatistics, CIHS" photo={BASE+"2023-07/xin_wang.png?h=f1fd4c30&itok=M9MfE9Bz"} url="https://www.albany.edu/cihs/faculty/xin-wang" />
              <PersonCard name="Jianwei Zhang" role="Professor" dept="Educational Theory & Practice, School of Education" photo={BASE+"2022-08/Zhang-Jianwei.jpg?h=a7052f9c&itok=mLphmk2R"} url="https://www.albany.edu/education/faculty/jianwei-zhang" />
            </div>
          </div>

          <div className="about-section">
            <span className="section-label">Student Representatives</span>
            <div className="person-grid-2">
              <PersonCard name="Alana Borrero" role="Undergraduate Student Representative" photo={BASE+"Alana%20Borrero.jpeg?h=cb4297e8&itok=Jbui5LPG"} />
              <PersonCard name="Shannon Sutorius" role="Graduate Student Representative" photo={BASE+"Shannon%20Sutorius.JPG?h=d5b9011c&itok=EXkyG39J"} />
            </div>
          </div>
        </>)}

        {/* ── FELLOWSHIPS TAB ── */}
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
            <div className="person-grid-4">
              <PersonCard name="Rawan Abdelaal" role="Doctoral Student, Curriculum and Instruction" photo={BASE+"rawan.jpeg?h=fbfd6560&itok=vyupWg-X"} />
              <PersonCard name="Karan Bhasin" role="Doctoral Student, Economics" photo={BASE+"KB_Headshot.jpg?h=f329a4ed&itok=3gpPKhoM"} />
              <PersonCard name="Anastasios Karnazes" role="Doctoral Student, English" photo="" />
              <PersonCard name="Iris Aleida Pinzón Arteaga" role="Doctoral Student, Sociology" photo="" />
            </div>
          </div>

          <hr className="fellow-divider" />

          <div className="about-section">
            <h2 className="about-sh">Spring 2026 Master's Experiential Learning Fellows</h2>
            <div className="person-grid-4">
              <PersonCard name="Batzaya (Zaya) Byambasambuu" role="MPA, Public Administration & Policy" photo={BASE+"Batzaya%20%28Zaya%29%20Byambasambuu.jpeg?h=7ea24003&itok=07vrGXt9"} />
              <PersonCard name="Kathleen Boyle" role="MS, Curriculum Development & Instructional Technology" photo={BASE+"Kathleen-Boyle.jpg?h=5e69b338&itok=c9LtT663"} />
              <PersonCard name="Ayotokunbo Egbontan" role="MS, Environmental Health Science" photo={BASE+"Ayotokunbo%20Egbontan.png?h=4efb6df5&itok=5gvNQQzu"} />
              <PersonCard name="Prakash R. Kota" role="MBA, Business Administration" photo={BASE+"Prakash-Kota.jpg?h=b044a8f9&itok=I7rey-Gt"} />
              <PersonCard name="Jayanth Reddy Lethakula" role="MS, Data Science" photo={BASE+"Jayanth%20Reddy%20Lethakula.jpg?h=7d892785&itok=qKTDXJVT"} />
              <PersonCard name="Robert Manning" role="MA, Philosophy" photo={BASE+"Robert%20Manning.png?h=d9227cf5&itok=K30aBrjA"} />
              <PersonCard name="Kalonji Samuel" role="MS, Information Science" photo={BASE+"Kalonji%20Samuel.jpg?h=ad6374a7&itok=LDYhwzho"} />
              <PersonCard name="Gayathri Gupta Samudrala" role="MS, Educational Psychology & Methodology" photo={BASE+"Gayathri-Gupta-Samudrala.jpg?h=0e903c36&itok=dWVgD9MH"} />
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
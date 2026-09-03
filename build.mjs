/**
 * The designed half: header, project cards, toolkit, timeline, section rules.
 *
 * Run by hand when the work changes. Kept separate from refresh.mjs because
 * this reads private repositories too, which the token inside Actions cannot.
 */
import { writeFileSync } from 'fs';
import {
  OUT, INK, SURFACE, RAISED, LINE, TEXT, MUTE, FAINT,
  INDIGO, MINT, CORAL, AMBER, VIOLET,
  MONO, DISPLAY, esc, card, gql,
} from './lib.mjs';

const SITE = 'xtsy.is-a.dev';

/* -------------------------------------------------------------------- header */

const header = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="272" viewBox="0 0 1200 272" fill="none" role="img" aria-label="xtsy — full-stack developer and UI designer">
  <defs>
    <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${INDIGO}" stop-opacity="0"/>
      <stop offset="30%" stop-color="${INDIGO}" stop-opacity="0.9"/>
      <stop offset="58%" stop-color="${MINT}" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="${MINT}" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="glow" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${INDIGO}" stop-opacity="0.10"/>
      <stop offset="100%" stop-color="${INDIGO}" stop-opacity="0"/>
    </linearGradient>
    <pattern id="mesh" width="26" height="26" patternUnits="userSpaceOnUse">
      <path d="M26 0 L0 0 0 26" fill="none" stroke="#1B2027" stroke-width="1"/>
    </pattern>
    <clipPath id="hc"><rect x="1" y="1" width="1198" height="270" rx="18"/></clipPath>
  </defs>

  <g clip-path="url(#hc)">
    <rect x="1" y="1" width="1198" height="270" fill="${INK}"/>
    <rect x="1" y="1" width="1198" height="270" fill="url(#mesh)"/>
    <rect x="1" y="1" width="1198" height="150" fill="url(#glow)"/>
    <rect x="1" y="1" width="1198" height="2" fill="url(#sheen)"/>

    <text x="60" y="150" font-family="${DISPLAY}" font-size="118" font-weight="800" letter-spacing="-5.5" fill="${TEXT}">xtsy</text>
    <rect x="318" y="66" width="7" height="94" fill="${INDIGO}">
      <animate attributeName="opacity" values="1;1;0;0;1" dur="1.4s" repeatCount="indefinite"/>
    </rect>

    <text x="64" y="188" font-family="${MONO}" font-size="14.5" font-weight="600" letter-spacing="4.6" fill="${MUTE}">FULL-STACK DEVELOPER &#183; UI DESIGNER</text>

    <line x1="60" y1="216" x2="1140" y2="216" stroke="${LINE}" stroke-width="1.5"/>

    <g font-family="${MONO}" font-size="12" letter-spacing="2.2" fill="${FAINT}">
      <text x="60" y="244">SEATTLE, WA</text>
      <text x="212" y="244" fill="#2C333C">/</text>
      <text x="238" y="244">SHIPPING SINCE 2021</text>
      <text x="470" y="244" fill="#2C333C">/</text>
      <text x="496" y="244">AGE 17</text>
    </g>

    <g transform="translate(956,228)">
      <rect width="184" height="30" rx="15" fill="${RAISED}" stroke="${LINE}" stroke-width="1.5"/>
      <circle cx="20" cy="15" r="4" fill="${MINT}">
        <animate attributeName="opacity" values="1;0.2;1" dur="2.4s" repeatCount="indefinite"/>
      </circle>
      <text x="36" y="19.5" font-family="${MONO}" font-size="11" font-weight="600" letter-spacing="2" fill="${MINT}">OPEN TO WORK</text>
    </g>

    <!-- lens profile: the bulge my portfolio bends its thumbnails through -->
    <g stroke-linecap="round" stroke-width="2" opacity="0.85">
      ${[[820,26],[848,52],[876,76],[904,96],[932,110],[960,118],[988,120],[1016,118],[1044,110],[1072,96],[1100,76],[1128,52]]
        .map(([x, hh], i) => {
          const c = i < 4 ? '#232A33' : i < 6 ? '#2C3A46' : i < 8 ? INDIGO : '#2C3A46';
          const op = i >= 6 && i <= 7 ? 0.7 : 0.55;
          return `<line x1="${x}" y1="${118 - hh / 2}" x2="${x}" y2="${118 + hh / 2}" stroke="${c}" opacity="${op}"/>`;
        }).join('\n      ')}
    </g>
  </g>

  <rect x="1" y="1" width="1198" height="270" rx="18" fill="none" stroke="${LINE}" stroke-width="1.5"/>
</svg>
`;
writeFileSync(`${OUT}/header.svg`, header);

/* ---------------------------------------------------------------- the call */

/**
 * The single high-contrast element on the page.
 *
 * Everything else is graphite, so the one thing worth clicking is the one
 * thing that inverts. The marquee is two copies of the strip offset by exactly
 * one strip width, so the loop seam never lands on screen.
 */
const TICKER = 'SEE THE WORK';
const unit = `${TICKER}   ·   `;
const unitW = Math.round(unit.length * 9.65);
const reps = Math.ceil(1500 / unitW) + 1;
const strip = unit.repeat(reps);
const stripW = unitW * reps;
const CTAH = 176;

writeFileSync(`${OUT}/cta.svg`, `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="${CTAH}" viewBox="0 0 1200 ${CTAH}" fill="none" role="img" aria-label="See the work at ${SITE}">
  <defs>
    <clipPath id="cc"><rect x="1" y="1" width="1198" height="${CTAH - 2}" rx="18"/></clipPath>
    <clipPath id="cb"><rect x="1" y="${CTAH - 39}" width="1198" height="38"/></clipPath>
    <linearGradient id="cg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#EEF1EE"/>
      <stop offset="100%" stop-color="#D9DEDA"/>
    </linearGradient>
  </defs>
  <g clip-path="url(#cc)">
    <rect x="1" y="1" width="1198" height="${CTAH - 2}" fill="url(#cg)"/>

    <text x="52" y="86" font-family="${DISPLAY}" font-size="54" font-weight="800" letter-spacing="-2" fill="${INK}">See the work</text>
    <text x="55" y="116" font-family="${MONO}" font-size="14.5" font-weight="600" letter-spacing="2.4" fill="#4A5159">${SITE}</text>

    <g transform="translate(1092,74)">
      <circle r="44" fill="${INK}"/>
      <g stroke="${TEXT}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none">
        <path d="M-14,14 L14,-14 M-5,-14 L14,-14 L14,5"/>
        <animateTransform attributeName="transform" type="translate"
          values="0,0; 6,-6; 0,0" dur="2.4s" repeatCount="indefinite"
          calcMode="spline" keySplines="0.4 0 0.2 1;0.4 0 0.2 1" keyTimes="0;0.5;1"/>
      </g>
    </g>

    <rect x="1" y="${CTAH - 39}" width="1198" height="38" fill="${INK}"/>
    <g clip-path="url(#cb)">
      <g font-family="${MONO}" font-size="12.5" font-weight="600" letter-spacing="3.4" fill="${MUTE}">
        <text x="0" y="${CTAH - 14}">${strip}</text>
        <text x="${stripW}" y="${CTAH - 14}">${strip}</text>
        <animateTransform attributeName="transform" type="translate"
          values="0,0; -${stripW},0" dur="${(stripW / 55).toFixed(1)}s" repeatCount="indefinite"/>
      </g>
    </g>
  </g>
  <rect x="1" y="1" width="1198" height="${CTAH - 2}" rx="18" fill="none" stroke="#C9CFCA" stroke-width="1.5"/>
</svg>
`);

/* ---------------------------------------------------------------- work cards */

const cards = [
  { id: 'trace', n: '01', title: 'Trace', accent: AMBER,
    lines: ['Your screen, used as a physical', 'lightbox. Place it, lock it, trace.'],
    note: 'No framework. No build step.', tech: 'VANILLA JS · CANVAS · INDEXEDDB' },

  { id: 'spoofer', n: '02', title: 'iPhone Spoofer', accent: INDIGO,
    lines: ['Drives a real iPhone’s GPS from a', 'map, over USB. Routes and GPX.'],
    note: 'Tauri shell, Python sidecar.', tech: 'PYTHON · RUST · TAURI' },

  { id: 'coreplus', n: '03', title: 'Core+', accent: CORAL,
    lines: ['Membership hub for a six-person', 'streamer collective. One board.'],
    note: 'Cuts, drops, the whole crew.', tech: 'TYPESCRIPT · NEXT.JS · TAILWIND' },

  { id: 'portfolio', n: '04', title: 'Portfolio', accent: VIOLET,
    lines: ['Eight case studies behind a', 'horizontal, scroll-driven view.'],
    note: 'A WebGL lens bends the grid.', tech: 'TYPESCRIPT · REACT · THREE.JS' },

  { id: 'cryptonix', n: '05', title: 'CRYPTONIX', accent: MINT,
    lines: ['Solana wallet tracker. Live buy', 'detection and FIFO PnL.'],
    note: 'Discontinued, source left up.', tech: 'TYPESCRIPT · POSTGRES' },

  { id: 'dispatch', n: '06', title: 'DISPATCH', accent: '#9BA6B2',
    lines: ['One-click installer for LSPDFR.', 'An afternoon down to one run.'],
    note: 'Mod wrangling, automated.', tech: 'C# · POWERSHELL' },
];

const W = 400, H = 244;
for (const c of cards) {
  const inner = `    <rect x="1" y="1" width="${W - 2}" height="3" fill="${c.accent}"/>
    <text x="24" y="44" font-family="${MONO}" font-size="12" font-weight="700" letter-spacing="2.4" fill="${c.accent}">${c.n}</text>
    <g transform="translate(${W - 40},38)">
      <circle r="16" fill="${RAISED}" stroke="${LINE}" stroke-width="1.5"/>
      <path d="M-5,5 L5,-5 M-1.5,-5 L5,-5 L5,1.5" stroke="${MUTE}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    </g>
    <text x="24" y="98" font-family="${DISPLAY}" font-size="36" font-weight="800" letter-spacing="-1.2" fill="${TEXT}">${esc(c.title)}</text>
    <text x="24" y="132" font-family="${MONO}" font-size="12" fill="${MUTE}">${esc(c.lines[0])}</text>
    <text x="24" y="150" font-family="${MONO}" font-size="12" fill="${MUTE}">${esc(c.lines[1])}</text>
    <text x="24" y="180" font-family="${MONO}" font-size="12" font-weight="600" fill="${TEXT}">${esc(c.note)}</text>
    <line x1="24" y1="198" x2="${W - 24}" y2="198" stroke="${LINE}" stroke-width="1.5"/>
    <text x="24" y="220" font-family="${MONO}" font-size="10" font-weight="600" letter-spacing="1.6" fill="${FAINT}">${esc(c.tech)}</text>\n`;
  writeFileSync(`${OUT}/card-${c.id}.svg`, card(W, H, inner, { id: c.id, accent: c.accent }));
}

/* ------------------------------------------------------------------ sections */

function sectionBar(num, title, meta, accent) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="52" viewBox="0 0 1200 52" fill="none" role="img" aria-label="${esc(num)} ${esc(title)}">
  <line x1="0" y1="26" x2="1200" y2="26" stroke="${LINE}" stroke-width="1.5"/>
  <rect x="0" y="14" width="316" height="24" fill="${INK}"/>
  <text x="2" y="31" font-family="${MONO}" font-size="12" font-weight="700" letter-spacing="2" fill="${accent}">${esc(num)}</text>
  <text x="36" y="31" font-family="${MONO}" font-size="12" font-weight="700" letter-spacing="3.2" fill="${TEXT}">${esc(title)}</text>
  <rect x="${1200 - (meta.length * 7.1 + 22)}" y="14" width="${meta.length * 7.1 + 22}" height="24" fill="${INK}"/>
  <text x="1198" y="31" text-anchor="end" font-family="${MONO}" font-size="11" letter-spacing="1.6" fill="${FAINT}">${esc(meta)}</text>
</svg>
`;
}

const SECTIONS = [
  ['sec-numbers', '01', 'THE NUMBERS',   'REBUILT EVERY MORNING BY WORKFLOW',  MINT],
  ['sec-work',    '02', 'SELECTED WORK', 'SIX SHIPPED · EVERY CARD IS A LINK', AMBER],
  ['sec-run',     '03', 'THE 2026 RUN',  'REAL DATES, FROM THE API',           INDIGO],
  ['sec-stack',   '04', 'THE STACK',     'WHAT I REACH FOR, AND WHAT I WROTE', CORAL],
];
for (const [id, num, title, meta, accent] of SECTIONS) {
  writeFileSync(`${OUT}/${id}.svg`, sectionBar(num, title, meta, accent));
}

/* ------------------------------------------------------------------- toolkit */

/**
 * Real brand marks, inlined.
 *
 * GitHub proxies README images through camo, and an <image href> pointing off
 * to a CDN inside an SVG never loads. So the paths are pulled from Simple Icons
 * at build time and written into the file — geometry in the file, no request at
 * view time and nothing to rot.
 */
const ICONS = 'https://cdn.jsdelivr.net/npm/simple-icons@13/icons';

const rows = [
  { label: 'LANGUAGES', items: [
    ['TypeScript', 'typescript', '#6C9BEE'], ['JavaScript', 'javascript', '#E8D44D'],
    ['Python', 'python', '#6FA8DC'], ['C#', null, VIOLET], ['Rust', 'rust', '#D9A38A'], ['SQL', null, MINT] ] },
  { label: 'INTERFACE', items: [
    ['React', 'react', '#61DAFB'], ['Next.js', 'nextdotjs', '#E6E9E6'], ['Tailwind', 'tailwindcss', '#38BDF8'],
    ['Three.js', 'threedotjs', '#E6E9E6'], ['GSAP', null, MINT], ['GLSL', null, INDIGO] ] },
  { label: 'BEHIND IT', items: [
    ['Node', 'nodedotjs', '#7DC46B'], ['FastAPI', 'fastapi', '#2CC5A8'], ['Postgres', 'postgresql', '#7AA2E3'],
    ['Tauri', 'tauri', '#4FD3E0'], ['IndexedDB', null, VIOLET] ] },
  { label: 'DAY TO DAY', items: [
    ['Git', 'git', '#F0704F'], ['Vercel', 'vercel', '#E6E9E6'], ['Vite', 'vite', '#9B8CFF'],
    ['Figma', 'figma', '#FF8A65'], ['Playwright', null, MINT] ] },
];

const slugs = [...new Set(rows.flatMap((r) => r.items.map((i) => i[1]).filter(Boolean)))];
const paths = Object.fromEntries(await Promise.all(slugs.map(async (s) => {
  const res = await fetch(`${ICONS}/${s}.svg`);
  if (!res.ok) throw new Error(`icon ${s}: HTTP ${res.status}`);
  const d = (await res.text()).match(/<path[^>]*\sd="([^"]+)"/)?.[1];
  if (!d) throw new Error(`icon ${s}: no path`);
  return [s, d];
})));

const PAD = 34, CHW = 7.2, GAP = 9, ROWGAP = 72, PH = 36;
let ty = 70, tbody = '';
for (const row of rows) {
  tbody += `    <text x="${PAD}" y="${ty}" font-family="${MONO}" font-size="10.5" font-weight="700" letter-spacing="2.6" fill="${FAINT}">${row.label}</text>\n`;
  let x = PAD;
  const py = ty + 10;
  for (const [name, slug, hex] of row.items) {
    const glyph = slug
      ? `      <g transform="translate(16,${PH / 2 - 8}) scale(0.67)"><path d="${paths[slug]}" fill="${hex}"/></g>`
      : `      <circle cx="23" cy="${PH / 2}" r="5" fill="${hex}"/>`;
    const textX = slug ? 40 : 36;
    const w = Math.round(textX + name.length * CHW + 20);
    tbody += `    <g transform="translate(${x},${py})">
      <rect width="${w}" height="${PH}" rx="18" fill="${RAISED}" stroke="${LINE}" stroke-width="1.5"/>
${glyph}
      <text x="${textX}" y="${PH / 2 + 4}" font-family="${MONO}" font-size="12.5" font-weight="600" fill="${TEXT}">${esc(name)}</text>
    </g>\n`;
    x += w + GAP;
  }
  ty += ROWGAP;
}
const TH = ty - 20;
writeFileSync(`${OUT}/toolkit.svg`, card(1200, TH,
  `    <text x="${PAD}" y="38" font-family="${MONO}" font-size="11.5" font-weight="700" letter-spacing="3" fill="${TEXT}">THE TOOLKIT</text>\n` + tbody,
  { id: 'tk', accent: CORAL }));

/* ----------------------------------------------------------------- languages */

const repoLangs = gql(`query {
  user(login: "Jackmod") {
    repositories(first: 100, ownerAffiliations: OWNER, isFork: false) {
      totalCount
      nodes { languages(first: 12) { edges { size node { name } } } }
    }
  }
}`).user.repositories;

const totals = new Map();
for (const r of repoLangs.nodes) {
  for (const e of r.languages.edges) totals.set(e.node.name, (totals.get(e.node.name) ?? 0) + e.size);
}
const grand = [...totals.values()].reduce((a, b) => a + b, 0);
const ranked = [...totals.entries()].sort((a, b) => b[1] - a[1]);
const MAJOR = ranked.filter(([, v]) => v / grand >= 0.01);
const restPct = 100 - MAJOR.reduce((s, [, v]) => s + (v / grand) * 100, 0);

const HUE = { JavaScript: '#E8D44D', CSS: VIOLET, TypeScript: INDIGO, 'C#': MINT, Python: '#6FA8DC', HTML: CORAL };
const hue = (n, i) => HUE[n] ?? [FAINT, '#6E7783', '#4C545E'][i % 3];

const LW = 1132, LX = 34;
let segs = '', lgd = '', cur = 0, lgx = LX;
MAJOR.forEach(([name, v], i) => {
  const pct = (v / grand) * 100;
  const w = Math.round((pct / 100) * LW);
  segs += `      <rect x="${cur}" y="56" width="${Math.max(w - 2, 2)}" height="14" rx="7" fill="${hue(name, i)}"/>\n`;
  cur += w;
  const t = `${name} ${pct.toFixed(1)}%`;
  lgd += `    <circle cx="${lgx + 5}" cy="${102}" r="5" fill="${hue(name, i)}"/>
    <text x="${lgx + 18}" y="106" font-family="${MONO}" font-size="12" font-weight="600" fill="${MUTE}">${esc(t)}</text>\n`;
  lgx += 30 + t.length * 7.3;
});
if (restPct > 0.05) {
  segs += `      <rect x="${cur}" y="56" width="${Math.max(LW - cur - 2, 2)}" height="14" rx="7" fill="${FAINT}"/>\n`;
  lgd += `    <circle cx="${lgx + 5}" cy="102" r="5" fill="${FAINT}"/>
    <text x="${lgx + 18}" y="106" font-family="${MONO}" font-size="12" font-weight="600" fill="${MUTE}">the rest ${restPct.toFixed(1)}%</text>\n`;
}

writeFileSync(`${OUT}/languages.svg`, card(1200, 152,
  `    <text x="${LX}" y="36" font-family="${MONO}" font-size="11.5" font-weight="700" letter-spacing="3" fill="${TEXT}">WHAT THE BYTES SAY</text>
    <text x="1166" y="36" text-anchor="end" font-family="${MONO}" font-size="11" letter-spacing="1.6" fill="${FAINT}">${repoLangs.totalCount} REPOSITORIES · ${(grand / 1048576).toFixed(1)} MB COUNTED</text>
    <rect x="${LX}" y="56" width="${LW}" height="14" rx="7" fill="${RAISED}"/>
    <g transform="translate(${LX},0)">
${segs}    </g>
${lgd}    <text x="${LX}" y="134" font-family="${MONO}" font-size="10.5" fill="${FAINT}">Bytes reward whoever ships the most files, so this is honest rather than flattering. What I reach for is above.</text>\n`,
  { id: 'lg', accent: CORAL }));

/* ------------------------------------------------------------------ timeline */

const ships = [
  { date: '2026-04-04', name: 'torusdata',      note: 'data platform',       c: VIOLET },
  { date: '2026-06-30', name: 'Auto Clicker',   note: 'desktop automation',  c: MINT },
  { date: '2026-07-20', name: 'DISPATCH',       note: 'one-click installer', c: '#9BA6B2' },
  { date: '2026-07-27', name: 'Portfolio',      note: 'eight case studies',  c: VIOLET },
  { date: '2026-08-02', name: 'Core+',          note: 'membership hub',      c: CORAL },
  { date: '2026-08-08', name: 'iPhone Spoofer', note: 'GPS over USB',        c: INDIGO },
  { date: '2026-08-16', name: 'Trace',          note: 'screen as lightbox',  c: AMBER },
  { date: '2026-08-31', name: 'CRYPTONIX',      note: 'wallet tracker',      c: MINT },
  { date: '2026-09-02', name: 'verbatim',       note: 'transcription',       c: INDIGO },
];

const t0 = Date.parse('2026-03-25'), t1 = Date.parse('2026-09-10');
const TLL = 80, TLR = 1120, AX = 168, TLH = 300;
const tx = (d) => TLL + ((Date.parse(d) - t0) / (t1 - t0)) * (TLR - TLL);

let ticks = '';
for (const [m, lbl] of [['2026-04-01','APR'],['2026-05-01','MAY'],['2026-06-01','JUN'],['2026-07-01','JUL'],['2026-08-01','AUG'],['2026-09-01','SEP']]) {
  ticks += `    <line x1="${tx(m).toFixed(1)}" y1="${AX - 6}" x2="${tx(m).toFixed(1)}" y2="${AX + 6}" stroke="${LINE}" stroke-width="1.5"/>
    <text x="${tx(m).toFixed(1)}" y="${AX + 26}" text-anchor="middle" font-family="${MONO}" font-size="10.5" font-weight="600" letter-spacing="1.6" fill="${FAINT}">${lbl}</text>\n`;
}

// Four lanes, claimed greedily: August alone holds four ships and the labels
// would otherwise print straight through each other.
const LANES = [
  { name: AX - 38, note: AX - 54, stem: AX - 24, end: -1e9 },
  { name: AX + 54, note: AX + 70, stem: AX + 40, end: -1e9 },
  { name: AX - 78, note: AX - 94, stem: AX - 64, end: -1e9 },
  { name: AX + 94, note: AX + 110, stem: AX + 80, end: -1e9 },
];
let marks = '';
for (const s of ships) {
  const x = tx(s.date);
  const w = Math.max(s.name.length, s.note.length) * 6.4 + 14;
  const lane = LANES.find((l) => x - w / 2 > l.end) ?? LANES[LANES.length - 1];
  lane.end = x + w / 2;
  marks += `    <line x1="${x.toFixed(1)}" y1="${AX}" x2="${x.toFixed(1)}" y2="${lane.stem}" stroke="${LINE}" stroke-width="1.5"/>
    <circle cx="${x.toFixed(1)}" cy="${AX}" r="6" fill="${s.c}"/>
    <circle cx="${x.toFixed(1)}" cy="${AX}" r="11" fill="none" stroke="${s.c}" stroke-opacity="0.25" stroke-width="1.5"/>
    <text x="${x.toFixed(1)}" y="${lane.name}" text-anchor="middle" font-family="${MONO}" font-size="12" font-weight="600" fill="${TEXT}" stroke="${SURFACE}" stroke-width="5" paint-order="stroke">${esc(s.name)}</text>
    <text x="${x.toFixed(1)}" y="${lane.note}" text-anchor="middle" font-family="${MONO}" font-size="10" fill="${FAINT}" stroke="${SURFACE}" stroke-width="4" paint-order="stroke">${esc(s.note)}</text>\n`;
}

writeFileSync(`${OUT}/timeline.svg`, card(1200, TLH,
  `    <text x="34" y="38" font-family="${MONO}" font-size="11.5" font-weight="700" letter-spacing="3" fill="${TEXT}">THE 2026 RUN &#183; NINE THINGS SHIPPED</text>
    <text x="1166" y="38" text-anchor="end" font-family="${MONO}" font-size="11" letter-spacing="1.6" fill="${FAINT}">APR &#8594; SEP</text>
    <line x1="46" y1="${AX}" x2="1154" y2="${AX}" stroke="${LINE}" stroke-width="1.5"/>\n` + ticks + marks,
  { id: 'tl', accent: INDIGO }));

console.log(`header, cta, ${cards.length} cards, ${SECTIONS.length} rules, toolkit(${TH}), languages, timeline`);
console.log(`inlined ${slugs.length} brand marks · ${MAJOR.length} languages over 1% across ${repoLangs.totalCount} repos`);

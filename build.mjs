/**
 * The designed half: project cards and the toolkit.
 *
 * Run by hand when the work changes. Kept separate from refresh.mjs because
 * this reads private repositories too, which the token inside Actions cannot.
 */
import { writeFileSync } from 'fs';
import { OUT, INK, CREAM, MONO, DISPLAY, esc, card } from './lib.mjs';

/* ---------------------------------------------------------------- project cards */

const cards = [
  { id: 'trace', n: '01', title: 'Trace', bg: '#ffc400', fg: INK,
    lines: ['Your screen, used as a physical', 'lightbox. Place it, lock it, trace.'],
    note: 'No framework. No build step.',
    tech: 'VANILLA JS / CANVAS / INDEXEDDB' },

  { id: 'spoofer', n: '02', title: 'iPhone Spoofer', bg: '#2f9bff', fg: CREAM,
    lines: ['Drives a real iPhone’s GPS from a', 'map, over USB. Routes and GPX.'],
    note: 'Tauri shell, Python sidecar.',
    tech: 'PYTHON / RUST / TAURI' },

  { id: 'coreplus', n: '03', title: 'Core+', bg: '#ff3b30', fg: CREAM,
    lines: ['Membership hub for a six-person', 'streamer collective. One board.'],
    note: 'Cuts, drops, the whole crew.',
    tech: 'TYPESCRIPT / NEXT.JS / TAILWIND' },

  { id: 'portfolio', n: '04', title: 'Portfolio', bg: '#a855f7', fg: CREAM,
    lines: ['Eight case studies behind a', 'horizontal, scroll-driven view.'],
    note: 'A WebGL lens bends the grid.',
    tech: 'TYPESCRIPT / REACT / THREE.JS' },

  { id: 'cryptonix', n: '05', title: 'CRYPTONIX', bg: '#3ddc84', fg: INK,
    lines: ['Solana wallet tracker. Live buy', 'detection and FIFO PnL.'],
    note: 'Discontinued, source left up.',
    tech: 'TYPESCRIPT / POSTGRES' },

  { id: 'dispatch', n: '06', title: 'DISPATCH', bg: CREAM, fg: INK,
    lines: ['One-click installer for LSPDFR.', 'An afternoon down to one run.'],
    note: 'Mod wrangling, automated.',
    tech: 'C# / POWERSHELL' },
];

const W = 400, H = 250, CW = 388, CH = 238;

for (const c of cards) {
  const dim = 'opacity="0.62"';
  writeFileSync(`${OUT}/card-${c.id}.svg`, `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none" role="img" aria-label="${esc(c.title)}">
  <rect x="10" y="11" width="${CW}" height="${CH}" rx="22" fill="${INK}"/>
  <rect x="2" y="2" width="${CW}" height="${CH}" rx="22" fill="${c.bg}" stroke="${INK}" stroke-width="5"/>
  <text x="26" y="46" font-family="${MONO}" font-size="13" font-weight="700" letter-spacing="2" fill="${c.fg}" ${dim}>${c.n}</text>
  <g transform="translate(${CW - 26},38)">
    <circle r="19" fill="${c.fg === CREAM ? CREAM : INK}"/>
    <path d="M-6,6 L6,-6 M-2,-6 L6,-6 L6,2" stroke="${c.fg === CREAM ? INK : CREAM}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  </g>
  <text x="26" y="104" font-family="${DISPLAY}" font-size="42" font-weight="800" letter-spacing="-1.6" fill="${c.fg}">${esc(c.title)}</text>
  <text x="26" y="140" font-family="${MONO}" font-size="12.5" fill="${c.fg}" ${dim}>${esc(c.lines[0])}</text>
  <text x="26" y="160" font-family="${MONO}" font-size="12.5" fill="${c.fg}" ${dim}>${esc(c.lines[1])}</text>
  <text x="26" y="190" font-family="${MONO}" font-size="12.5" font-weight="700" fill="${c.fg}">${esc(c.note)}</text>
  <line x1="26" y1="204" x2="${CW - 22}" y2="204" stroke="${c.fg}" stroke-opacity="0.28" stroke-width="2"/>
  <text x="26" y="224" font-family="${MONO}" font-size="10.5" font-weight="700" letter-spacing="1.6" fill="${c.fg}" ${dim}>${esc(c.tech)}</text>
</svg>
`);
}

/* ------------------------------------------------------------------- toolkit */

/**
 * Real brand marks, inlined.
 *
 * GitHub proxies README images through camo, and an <image href> pointing off
 * to a CDN inside an SVG never loads. So the paths are pulled from Simple Icons
 * at build time and written into the file — the marks render as geometry, with
 * no request at view time and nothing to rot.
 */
const ICONS = 'https://cdn.jsdelivr.net/npm/simple-icons@13/icons';

const rows = [
  { label: 'LANGUAGES', items: [
    ['TypeScript', 'typescript', '#3178C6'],
    ['JavaScript', 'javascript', '#E5C707'],
    ['Python', 'python', '#3776AB'],
    ['C#', null, '#512BD4'],
    ['Rust', 'rust', '#12100c'],
    ['SQL', null, '#3ddc84'],
  ] },
  { label: 'INTERFACE', items: [
    ['React', 'react', '#0d9dc7'],
    ['Next.js', 'nextdotjs', '#12100c'],
    ['Tailwind', 'tailwindcss', '#06B6D4'],
    ['Three.js', 'threedotjs', '#12100c'],
    ['GSAP', null, '#0AE448'],
    ['GLSL', null, '#5586A4'],
  ] },
  { label: 'BEHIND IT', items: [
    ['Node', 'nodedotjs', '#5FA04E'],
    ['FastAPI', 'fastapi', '#009688'],
    ['Postgres', 'postgresql', '#4169E1'],
    ['Tauri', 'tauri', '#1a9fb0'],
    ['IndexedDB', null, '#a855f7'],
  ] },
  { label: 'DAY TO DAY', items: [
    ['Git', 'git', '#F05032'],
    ['Vercel', 'vercel', '#12100c'],
    ['Vite', 'vite', '#646CFF'],
    ['Figma', 'figma', '#F24E1E'],
    ['Playwright', null, '#2f9bff'],
  ] },
];

const slugs = [...new Set(rows.flatMap((r) => r.items.map((i) => i[1]).filter(Boolean)))];
const paths = Object.fromEntries(await Promise.all(slugs.map(async (s) => {
  const res = await fetch(`${ICONS}/${s}.svg`);
  if (!res.ok) throw new Error(`icon ${s}: HTTP ${res.status}`);
  const d = (await res.text()).match(/<path[^>]*\sd="([^"]+)"/)?.[1];
  if (!d) throw new Error(`icon ${s}: no path`);
  return [s, d];
})));
console.log(`inlined ${slugs.length} brand marks`);

const PAD = 42, CHW = 7.35, GAP = 11, ROWGAP = 80, PH = 40;
let y = 78, body = '';

for (const row of rows) {
  body += `    <text x="${PAD}" y="${y}" font-family="${MONO}" font-size="11.5" font-weight="700" letter-spacing="2.8" fill="${INK}" opacity="0.5">${row.label}</text>\n`;
  let x = PAD;
  const py = y + 12;
  for (const [name, slug, hex] of row.items) {
    const glyph = slug
      ? `      <g transform="translate(20,${PH / 2 - 9}) scale(0.75)"><path d="${paths[slug]}" fill="${hex}"/></g>`
      : `      <circle cx="27" cy="${PH / 2}" r="6" fill="${hex}" stroke="${INK}" stroke-width="2"/>`;
    const textX = slug ? 46 : 42;
    const w = Math.round(textX + name.length * CHW + 24);
    body += `    <g transform="translate(${x},${py})">
      <rect x="4" y="5" width="${w}" height="${PH}" rx="20" fill="${INK}"/>
      <rect width="${w}" height="${PH}" rx="20" fill="${CREAM}" stroke="${INK}" stroke-width="3.5"/>
${glyph}
      <text x="${textX}" y="${PH / 2 + 4.5}" font-family="${MONO}" font-size="13.5" font-weight="700" fill="${INK}">${esc(name)}</text>
    </g>\n`;
    x += w + GAP;
  }
  y += ROWGAP;
}

const TH = y + 6;
const head = `    <text x="${PAD}" y="44" font-family="${MONO}" font-size="12.5" font-weight="700" letter-spacing="3" fill="${INK}">THE TOOLKIT</text>\n`;
writeFileSync(`${OUT}/toolkit.svg`, card(1200, TH, head + body, { id: 't' }));

console.log(`wrote ${cards.length} cards + toolkit.svg (h=${TH})`);

/* ------------------------------------------------------------------ timeline */

/**
 * Six months of shipping, on a real date axis.
 *
 * Dates are the repository creation dates from the API, not a story told
 * afterwards. Labels alternate above and below the rule because at this
 * density they would otherwise collide.
 */
const ships = [
  { date: '2026-04-04', name: 'torusdata',      note: 'data platform',      c: '#a855f7' },
  { date: '2026-06-30', name: 'Auto Clicker',   note: 'desktop automation', c: '#3ddc84' },
  { date: '2026-07-20', name: 'DISPATCH',       note: 'one-click installer', c: '#ffc400' },
  { date: '2026-07-27', name: 'Portfolio',      note: 'eight case studies', c: '#2f9bff' },
  { date: '2026-08-02', name: 'Core+',          note: 'membership hub',     c: '#ff3b30' },
  { date: '2026-08-08', name: 'iPhone Spoofer', note: 'GPS over USB',       c: '#a855f7' },
  { date: '2026-08-16', name: 'Trace',          note: 'screen as lightbox', c: '#ffc400' },
  { date: '2026-08-31', name: 'CRYPTONIX',      note: 'wallet tracker',     c: '#3ddc84' },
  { date: '2026-09-02', name: 'verbatim',       note: 'transcription',      c: '#2f9bff' },
];

const t0 = Date.parse('2026-03-25'), t1 = Date.parse('2026-09-10');
const TL = 92, TR = 1120, TAXIS = 172, TLH = 320;
const tx = (d) => TL + ((Date.parse(d) - t0) / (t1 - t0)) * (TR - TL);

let ticks = '';
for (const [m, lbl] of [['2026-04-01','APR'],['2026-05-01','MAY'],['2026-06-01','JUN'],['2026-07-01','JUL'],['2026-08-01','AUG'],['2026-09-01','SEP']]) {
  ticks += `    <line x1="${tx(m).toFixed(1)}" y1="${TAXIS - 8}" x2="${tx(m).toFixed(1)}" y2="${TAXIS + 8}" stroke="${INK}" stroke-width="2.5" opacity="0.35"/>
    <text x="${tx(m).toFixed(1)}" y="${TAXIS + 30}" text-anchor="middle" font-family="${MONO}" font-size="11" font-weight="700" letter-spacing="1.6" fill="${INK}" opacity="0.45">${lbl}</text>\n`;
}

/**
 * Lane packing.
 *
 * Nine ships inside six months put labels on top of each other — August alone
 * has four. Each label claims the first lane whose last occupant has already
 * ended, alternating above and below the rule so the axis stays balanced.
 */
const LANES = [
  { dir: -1, name: TAXIS - 42, note: TAXIS - 58, stem: TAXIS - 26, end: -1e9 },
  { dir: 1,  name: TAXIS + 56, note: TAXIS + 72, stem: TAXIS + 40, end: -1e9 },
  { dir: -1, name: TAXIS - 82, note: TAXIS - 98, stem: TAXIS - 66, end: -1e9 },
  { dir: 1,  name: TAXIS + 96, note: TAXIS + 112, stem: TAXIS + 80, end: -1e9 },
];

let marks = '';
for (const s of ships) {
  const x = tx(s.date);
  const w = Math.max(s.name.length, s.note.length) * 6.6 + 14;
  const lane = LANES.find((l) => x - w / 2 > l.end) ?? LANES[LANES.length - 1];
  lane.end = x + w / 2;

  marks += `    <line x1="${x.toFixed(1)}" y1="${TAXIS}" x2="${x.toFixed(1)}" y2="${lane.stem}" stroke="${INK}" stroke-width="3"/>
    <circle cx="${x.toFixed(1)}" cy="${TAXIS}" r="9" fill="${s.c}" stroke="${INK}" stroke-width="3.5"/>
    <text x="${x.toFixed(1)}" y="${lane.name}" text-anchor="middle" font-family="${MONO}" font-size="12.5" font-weight="700" fill="${INK}">${esc(s.name)}</text>
    <text x="${x.toFixed(1)}" y="${lane.note}" text-anchor="middle" font-family="${MONO}" font-size="10" letter-spacing="0.6" fill="${INK}" opacity="0.5">${esc(s.note)}</text>\n`;
}

const thead = `    <text x="42" y="44" font-family="${MONO}" font-size="12.5" font-weight="700" letter-spacing="3" fill="${INK}">THE 2026 RUN &#183; NINE THINGS SHIPPED</text>
    <text x="1150" y="44" text-anchor="end" font-family="${MONO}" font-size="12.5" font-weight="700" letter-spacing="1.6" fill="${INK}" opacity="0.55">APR &#8594; SEP</text>
    <line x1="${TL - 34}" y1="${TAXIS}" x2="${TR + 34}" y2="${TAXIS}" stroke="${INK}" stroke-width="4"/>\n`;

writeFileSync(`${OUT}/timeline.svg`, card(1200, TLH, thead + ticks + marks, { id: 'l' }));
console.log('wrote timeline.svg');

/* ----------------------------------------------------------------- the call */

/**
 * The one thing the page is actually asking you to do.
 *
 * The marquee is two copies of the same strip translated by exactly one strip
 * width: when the animation loops the second copy is sitting where the first
 * began, so the seam never lands anywhere visible.
 */
const URL_TEXT = 'xtsy-portfolio.vercel.app';
const TICKER = 'SEE THE WORK';
const DIAMOND = (x, y, c) => `<rect x="${x - 5}" y="${y - 5}" width="10" height="10" rx="2" transform="rotate(45 ${x} ${y})" fill="${c}"/>`;

const CH2 = 9.65;                       // mono advance at 16px
const unit = `${TICKER}   ◆   `;
const unitW = Math.round(unit.length * CH2);
const reps = Math.ceil(1400 / unitW) + 1;
const strip = unit.repeat(reps);
const stripW = unitW * reps;

const CTAH = 210;
const cta = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="${CTAH}" viewBox="0 0 1200 ${CTAH}" fill="none" role="img" aria-label="See the work at ${URL_TEXT}">
  <defs>
    <clipPath id="cta"><rect x="8" y="6" width="1176" height="${CTAH - 22}" rx="24"/></clipPath>
    <clipPath id="band"><rect x="8" y="${CTAH - 58}" width="1176" height="42"/></clipPath>
  </defs>

  <rect x="16" y="18" width="1176" height="${CTAH - 22}" rx="24" fill="${INK}"/>

  <g clip-path="url(#cta)">
    <rect x="8" y="6" width="1176" height="${CTAH - 22}" fill="${INK}"/>

    ${DIAMOND(560, 44, '#ffc400')}
    ${DIAMOND(600, 96, '#ff3b30')}
    ${DIAMOND(524, 118, '#2f9bff')}

    <text x="46" y="86" font-family="${DISPLAY}" font-size="62" font-weight="800" letter-spacing="-2.4" fill="${CREAM}">See the work</text>
    <text x="50" y="120" font-family="${MONO}" font-size="15" font-weight="700" letter-spacing="2" fill="#ffc400">${URL_TEXT}</text>

    <g transform="translate(1064,84)">
      <circle r="52" fill="#ffc400" stroke="${CREAM}" stroke-width="4"/>
      <g stroke="${INK}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none">
        <path d="M-16,16 L16,-16 M-6,-16 L16,-16 L16,6"/>
        <animateTransform attributeName="transform" type="translate"
          values="0,0; 7,-7; 0,0" dur="2.4s" repeatCount="indefinite"
          calcMode="spline" keySplines="0.4 0 0.2 1;0.4 0 0.2 1" keyTimes="0;0.5;1"/>
      </g>
    </g>

    <rect x="8" y="${CTAH - 58}" width="1176" height="42" fill="#ffc400"/>
    <g clip-path="url(#band)">
      <g font-family="${MONO}" font-size="16" font-weight="700" letter-spacing="3" fill="${INK}">
        <text x="0" y="${CTAH - 30}">${strip}</text>
        <text x="${stripW}" y="${CTAH - 30}">${strip}</text>
        <animateTransform attributeName="transform" type="translate"
          values="0,0; -${stripW},0" dur="${(stripW / 58).toFixed(1)}s" repeatCount="indefinite"/>
      </g>
    </g>
  </g>

  <rect x="8" y="6" width="1176" height="${CTAH - 22}" rx="24" fill="none" stroke="${CREAM}" stroke-width="5"/>
</svg>
`;
writeFileSync(`${OUT}/cta.svg`, cta);
console.log('wrote cta.svg');

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

import { writeFileSync, mkdirSync } from 'fs';

const OUT = 'C:/Users/jackb/AppData/Local/Temp/gh-profile/assets';
mkdirSync(OUT, { recursive: true });

const INK = '#12100c';
const CREAM = '#fbf4e2';
const MONO = "ui-monospace,'SF Mono',Menlo,Consolas,monospace";
const DISPLAY = "'Archivo','Helvetica Neue',Helvetica,Arial,sans-serif";

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* ---------------------------------------------------------------- project cards */

const cards = [
  { id: 'trace', n: '01', title: 'Trace', bg: '#ffc400', fg: INK,
    lines: ['Your screen, used as a physical', 'lightbox. Place it, lock it, trace.'],
    note: 'No framework. No build step.',
    tech: 'VANILLA JS / CANVAS / INDEXEDDB' },

  { id: 'spoofer', n: '02', title: 'iPhone Spoofer', bg: '#2f9bff', fg: CREAM,
    lines: ['Drives a real iPhone\u2019s GPS from a', 'map, over USB. Routes and GPX.'],
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
  const dim = c.fg === CREAM ? 'opacity="0.62"' : 'opacity="0.6"';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none" role="img" aria-label="${esc(c.title)}">
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
`;
  writeFileSync(`${OUT}/card-${c.id}.svg`, svg);
}

/* ------------------------------------------------------------------- toolkit */

const rows = [
  { label: 'LANGUAGES', items: [
    ['TypeScript', '#3178c6', CREAM], ['JavaScript', '#f7df1e', INK], ['Python', '#4b8bbe', CREAM],
    ['C#', '#a855f7', CREAM], ['Rust', '#ff3b30', CREAM], ['SQL', '#3ddc84', INK]] },
  { label: 'INTERFACE', items: [
    ['React', '#2f9bff', CREAM], ['Next.js', '#12100c', CREAM], ['Tailwind', '#3ddc84', INK],
    ['Three.js', '#12100c', CREAM], ['GLSL', '#ffc400', INK], ['Motion', '#a855f7', CREAM]] },
  { label: 'BEHIND IT', items: [
    ['Node', '#3ddc84', INK], ['FastAPI', '#2f9bff', CREAM], ['Postgres', '#3178c6', CREAM],
    ['Tauri', '#ffc400', INK], ['IndexedDB', '#a855f7', CREAM]] },
  { label: 'DAY TO DAY', items: [
    ['Git', '#ff3b30', CREAM], ['Vercel', '#12100c', CREAM], ['Vite', '#a855f7', CREAM],
    ['Playwright', '#3ddc84', INK], ['Figma', '#ffc400', INK]] },
];

const TW = 1200, PAD = 42;
let y = 78;
let body = '';
const CHW = 7.35, PILLPAD = 26, GAP = 11, ROWGAP = 80;

for (const row of rows) {
  body += `  <text x="${PAD}" y="${y}" font-family="${MONO}" font-size="11.5" font-weight="700" letter-spacing="2.8" fill="${INK}" opacity="0.5">${row.label}</text>\n`;
  let x = PAD;
  const py = y + 12;
  for (const [name, bg, fg] of row.items) {
    const w = Math.round(name.length * CHW + PILLPAD * 2);
    body += `  <g transform="translate(${x},${py})">
    <rect x="4" y="5" width="${w}" height="38" rx="19" fill="${INK}"/>
    <rect width="${w}" height="38" rx="19" fill="${bg}" stroke="${INK}" stroke-width="3.5"/>
    <text x="${w / 2}" y="25" text-anchor="middle" font-family="${MONO}" font-size="13.5" font-weight="700" fill="${fg}">${esc(name)}</text>
  </g>\n`;
    x += w + GAP;
  }
  y += ROWGAP;
}

const TH = y + 6;
const toolkit = `<svg xmlns="http://www.w3.org/2000/svg" width="${TW}" height="${TH}" viewBox="0 0 ${TW} ${TH}" fill="none" role="img" aria-label="Toolkit">
  <defs><pattern id="g" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.8" fill="#e3d9bf"/></pattern>
  <clipPath id="c"><rect x="8" y="6" width="1176" height="${TH - 22}" rx="22"/></clipPath></defs>
  <rect x="16" y="18" width="1176" height="${TH - 22}" rx="22" fill="${INK}"/>
  <g clip-path="url(#c)">
    <rect x="8" y="6" width="1176" height="${TH - 22}" fill="${CREAM}"/>
    <rect x="8" y="6" width="1176" height="${TH - 22}" fill="url(#g)"/>
    <text x="${PAD}" y="44" font-family="${MONO}" font-size="12.5" font-weight="700" letter-spacing="3" fill="${INK}">THE TOOLKIT</text>
${body}  </g>
  <rect x="8" y="6" width="1176" height="${TH - 22}" rx="22" fill="none" stroke="${INK}" stroke-width="5"/>
</svg>
`;
writeFileSync(`${OUT}/toolkit.svg`, toolkit);

console.log('wrote 6 cards + toolkit.svg (h=' + TH + ')');

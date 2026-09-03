import { execFileSync } from 'child_process';

export const OUT = new URL('./assets/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');

/**
 * Graphite and a narrow accent set.
 *
 * The previous palette was cream and primaries with hard offset shadows — loud,
 * and it read as a sticker sheet. This is the same information at a lower
 * volume: near-black surfaces, hairline borders, one accent per idea. Dark
 * panels also sit correctly on GitHub in either theme, where a cream card
 * always looked like a cut-out pasted onto the page.
 */
export const INK = '#0B0D10';      // page-level black
export const SURFACE = '#14171C';  // card fill
export const RAISED = '#1A1E25';   // inner wells
export const LINE = '#272D36';     // hairlines
export const TEXT = '#F3F5F4';     // primary type
export const MUTE = '#8A939E';     // secondary type
export const FAINT = '#5A626C';    // tertiary type

export const INDIGO = '#6C8BFF';
export const MINT = '#35D6A4';
export const CORAL = '#FF7A5C';
export const AMBER = '#F2C14E';
export const VIOLET = '#A78BFA';

export const MONO = "ui-monospace,'SF Mono',Menlo,Consolas,monospace";
export const DISPLAY = "'Archivo','Helvetica Neue',Helvetica,Arial,sans-serif";

export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * GraphQL through the gh CLI rather than a bare fetch: it already holds the
 * credential locally and reads GH_TOKEN inside Actions, so the same script runs
 * in both places without a second auth path to keep working.
 */
export function gql(query) {
  const raw = execFileSync('gh', ['api', 'graphql', '-f', `query=${query}`], {
    maxBuffer: 1 << 26,
    env: process.env,
  }).toString();
  const json = JSON.parse(raw);
  if (json.errors) throw new Error('GraphQL: ' + JSON.stringify(json.errors));
  return json.data;
}

/**
 * The shared panel: a graphite surface, a hairline, and a single lit edge along
 * the top so the card reads as raised without a drop shadow doing the shouting.
 */
export function card(w, h, inner, { id = 'c', accent = INDIGO } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" role="img">
  <defs>
    <linearGradient id="lit-${id}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0"/>
      <stop offset="22%" stop-color="${accent}" stop-opacity="0.85"/>
      <stop offset="70%" stop-color="${accent}" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
    </linearGradient>
    <clipPath id="clip-${id}"><rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="16"/></clipPath>
  </defs>
  <g clip-path="url(#clip-${id})">
    <rect x="1" y="1" width="${w - 2}" height="${h - 2}" fill="${SURFACE}"/>
    <rect x="1" y="1" width="${w - 2}" height="1.5" fill="url(#lit-${id})"/>
${inner}  </g>
  <rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="16" fill="none" stroke="${LINE}" stroke-width="1.5"/>
</svg>
`;
}

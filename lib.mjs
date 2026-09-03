import { execFileSync } from 'child_process';

export const OUT = new URL('./assets/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');

export const INK = '#12100c';
export const CREAM = '#fbf4e2';
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

/** The dotted cream ground + hard offset shadow every card shares. */
export function card(w, h, inner, { id = 'c' } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" role="img">
  <defs>
    <pattern id="dots-${id}" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.8" fill="#e3d9bf"/></pattern>
    <clipPath id="clip-${id}"><rect x="8" y="6" width="${w - 24}" height="${h - 22}" rx="22"/></clipPath>
  </defs>
  <rect x="16" y="18" width="${w - 24}" height="${h - 22}" rx="22" fill="${INK}"/>
  <g clip-path="url(#clip-${id})">
    <rect x="8" y="6" width="${w - 24}" height="${h - 22}" fill="${CREAM}"/>
    <rect x="8" y="6" width="${w - 24}" height="${h - 22}" fill="url(#dots-${id})"/>
${inner}  </g>
  <rect x="8" y="6" width="${w - 24}" height="${h - 22}" rx="22" fill="none" stroke="${INK}" stroke-width="5"/>
</svg>
`;
}

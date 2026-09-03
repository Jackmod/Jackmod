/**
 * Live cards: the contribution heatmap and the headline metrics.
 *
 * Kept apart from build.mjs on purpose. This half reads only public data, so
 * the token GitHub Actions hands a workflow is enough to run it on a schedule;
 * the design half needs a token that can see private repositories and would
 * quietly produce different numbers in CI.
 */
import { writeFileSync } from 'fs';
import { OUT, INK, CREAM, MONO, DISPLAY, gql, card } from './lib.mjs';

const USER = 'Jackmod';

/* ------------------------------------------------------------------ fetch */

const years = gql(`query { user(login: "${USER}") { contributionsCollection { contributionYears } } }`)
  .user.contributionsCollection.contributionYears;

// One aliased block per year, so all-time contributions cost a single request.
const spans = years
  .map((y) => `y${y}: contributionsCollection(from: "${y}-01-01T00:00:00Z", to: "${y}-12-31T23:59:59Z") { contributionCalendar { totalContributions } }`)
  .join('\n      ');

const data = gql(`query {
  user(login: "${USER}") {
    ${spans}
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks { firstDay contributionDays { date contributionCount weekday } }
      }
    }
    repositories(first: 100, ownerAffiliations: OWNER, isFork: false, privacy: PUBLIC) {
      totalCount
      nodes { stargazerCount }
    }
  }
}`).user;

const allTime = years.reduce((sum, y) => sum + data[`y${y}`].contributionCalendar.totalContributions, 0);
const cal = data.contributionsCollection.contributionCalendar;
const weeks = cal.weeks;
const days = weeks.flatMap((w) => w.contributionDays);
const activeDays = days.filter((d) => d.contributionCount > 0).length;
const busiest = Math.max(...days.map((d) => d.contributionCount));
const repos = data.repositories.totalCount;
const stars = data.repositories.nodes.reduce((s, r) => s + r.stargazerCount, 0);
const since = Math.min(...years);

/* ---------------------------------------------------------------- heatmap */

const RAMP = ['#e6dcc4', '#ffe27a', '#ffc400', '#ff8a1f', '#ff3b30'];
const level = (n) => (n === 0 ? 0 : n <= 2 ? 1 : n <= 6 ? 2 : n <= 15 ? 3 : 4);

const CELL = 16, STEP = 20, LEFT = 88, TOP = 92;
const HH = TOP + 7 * STEP + 66;

let cells = '', months = '', lastMonth = -1, lastX = -999;

weeks.forEach((wk, wi) => {
  const x = LEFT + wi * STEP;
  for (const d of wk.contributionDays) {
    const l = level(d.contributionCount);
    cells += `    <rect x="${x}" y="${TOP + d.weekday * STEP}" width="${CELL}" height="${CELL}" rx="4" fill="${RAMP[l]}"${l ? ` stroke="${INK}" stroke-width="1.5"` : ''}><title>${d.date}: ${d.contributionCount}</title></rect>\n`;
  }
  const m = new Date(wk.firstDay + 'T00:00:00Z').getUTCMonth();
  // Two month starts inside a few pixels of each other overprint as one blob.
  if (m !== lastMonth && wi < weeks.length - 1 && x - lastX >= 40) {
    lastMonth = m; lastX = x;
    const name = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'][m];
    months += `    <text x="${x}" y="${TOP - 12}" font-family="${MONO}" font-size="10.5" font-weight="700" letter-spacing="1.4" fill="${INK}" opacity="0.45">${name}</text>\n`;
  }
});

let labels = '';
for (const [lbl, i] of [['Mon', 1], ['Wed', 3], ['Fri', 5]]) {
  labels += `    <text x="${LEFT - 14}" y="${TOP + i * STEP + 11.5}" text-anchor="end" font-family="${MONO}" font-size="10.5" font-weight="700" fill="${INK}" opacity="0.45">${lbl}</text>\n`;
}

const lx = LEFT + weeks.length * STEP - 196;
let legend = `    <text x="${lx}" y="${HH - 34}" font-family="${MONO}" font-size="10.5" font-weight="700" letter-spacing="1.4" fill="${INK}" opacity="0.45">LESS</text>\n`;
RAMP.forEach((c, i) => {
  legend += `    <rect x="${lx + 44 + i * 21}" y="${HH - 45}" width="15" height="15" rx="4" fill="${c}"${i ? ` stroke="${INK}" stroke-width="1.5"` : ''}/>\n`;
});
legend += `    <text x="${lx + 158}" y="${HH - 34}" font-family="${MONO}" font-size="10.5" font-weight="700" letter-spacing="1.4" fill="${INK}" opacity="0.45">MORE</text>\n`;

const stamp = new Date().toISOString().slice(0, 10);
const head = `    <text x="42" y="48" font-family="${MONO}" font-size="12.5" font-weight="700" letter-spacing="3" fill="${INK}">STILL SHIPPING &#183; LAST 12 MONTHS</text>
    <text x="1150" y="48" text-anchor="end" font-family="${MONO}" font-size="12.5" font-weight="700" letter-spacing="1.6" fill="${INK}" opacity="0.55">${cal.totalContributions} CONTRIBUTIONS &#183; ${activeDays} ACTIVE DAYS &#183; ${busiest} IN A DAY</text>
    <text x="42" y="${HH - 34}" font-family="${MONO}" font-size="10" letter-spacing="1.2" fill="${INK}" opacity="0.3">REBUILT ${stamp} &#183; DAILY, BY WORKFLOW</text>\n`;

writeFileSync(`${OUT}/heatmap.svg`, card(1200, HH, head + months + labels + cells + legend, { id: 'h' }));

/* ------------------------------------------------------------------ stats */

const tiles = [
  { n: allTime.toLocaleString(), label: 'CONTRIBUTIONS', sub: `SINCE ${since}`, bg: '#ff3b30', fg: CREAM },
  { n: String(repos), label: 'PUBLIC REPOS', sub: `${stars} STARS EARNED`, bg: '#ffc400', fg: INK },
  { n: '4', label: 'THINGS YOU CAN USE', sub: 'SHIPPED, NOT SHELVED', bg: '#2f9bff', fg: CREAM },
  { n: String(busiest), label: 'BUSIEST DAY', sub: `${activeDays} ACTIVE DAYS`, bg: '#3ddc84', fg: INK },
];

const TW = 1200, GAP = 20;
const CWID = Math.floor((TW - 16 - GAP * 3) / 4);
let s = '';
tiles.forEach((t, i) => {
  const x = 8 + i * (CWID + GAP);
  s += `  <rect x="${x + 6}" y="18" width="${CWID}" height="126" rx="20" fill="${INK}"/>
  <clipPath id="t${i}"><rect x="${x}" y="6" width="${CWID}" height="126" rx="20"/></clipPath>
  <g clip-path="url(#t${i})">
    <rect x="${x}" y="6" width="${CWID}" height="126" fill="${t.bg}"/>
    <circle cx="${x + CWID - 18}" cy="24" r="42" fill="#ffffff" opacity="0.16"/>
  </g>
  <rect x="${x}" y="6" width="${CWID}" height="126" rx="20" fill="none" stroke="${INK}" stroke-width="5"/>
  <text x="${x + 26}" y="76" font-family="${DISPLAY}" font-size="46" font-weight="800" letter-spacing="-1.8" fill="${t.fg}">${t.n}</text>
  <text x="${x + 26}" y="100" font-family="${MONO}" font-size="11.5" font-weight="700" letter-spacing="2" fill="${t.fg}" opacity="0.9">${t.label}</text>
  <text x="${x + 26}" y="118" font-family="${MONO}" font-size="10" font-weight="700" letter-spacing="1.4" fill="${t.fg}" opacity="0.6">${t.sub}</text>\n`;
});

writeFileSync(`${OUT}/stats.svg`, `<svg xmlns="http://www.w3.org/2000/svg" width="${TW}" height="150" viewBox="0 0 ${TW} 150" fill="none" role="img" aria-label="${allTime} contributions since ${since}, ${repos} public repos, ${stars} stars, busiest day ${busiest}">
${s}</svg>
`);

console.log(`heatmap: ${cal.totalContributions} in last year, ${activeDays} active, peak ${busiest}`);
console.log(`stats:   ${allTime} all-time since ${since}, ${repos} public repos, ${stars} stars`);

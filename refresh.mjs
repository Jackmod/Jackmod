/**
 * Live cards: the contribution heatmap and the headline metrics.
 *
 * Kept apart from build.mjs on purpose. This half reads only public data, so
 * the token GitHub Actions hands a workflow is enough to run it on a schedule;
 * the design half needs a token that can see private repositories and would
 * quietly produce different numbers in CI.
 */
import { writeFileSync } from 'fs';
import { OUT, INK, SURFACE, RAISED, LINE, TEXT, MUTE, FAINT, INDIGO, MINT, CORAL, AMBER, MONO, DISPLAY, gql, card } from './lib.mjs';

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

const RAMP = ['#1B2027', '#1E4A3B', '#238A63', '#2CB683', MINT];
const level = (n) => (n === 0 ? 0 : n <= 2 ? 1 : n <= 6 ? 2 : n <= 15 ? 3 : 4);

const CELL = 16, STEP = 20, LEFT = 88, TOP = 92;
const HH = TOP + 7 * STEP + 66;

let cells = '', months = '', lastMonth = -1, lastX = -999;

weeks.forEach((wk, wi) => {
  const x = LEFT + wi * STEP;
  for (const d of wk.contributionDays) {
    const l = level(d.contributionCount);
    cells += `    <rect x="${x}" y="${TOP + d.weekday * STEP}" width="${CELL}" height="${CELL}" rx="4" fill="${RAMP[l]}"${l ? ` stroke="#0E1116" stroke-width="1"` : ''}><title>${d.date}: ${d.contributionCount}</title></rect>\n`;
  }
  const m = new Date(wk.firstDay + 'T00:00:00Z').getUTCMonth();
  // Two month starts inside a few pixels of each other overprint as one blob.
  if (m !== lastMonth && wi < weeks.length - 1 && x - lastX >= 40) {
    lastMonth = m; lastX = x;
    const name = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'][m];
    months += `    <text x="${x}" y="${TOP - 12}" font-family="${MONO}" font-size="10.5" font-weight="700" letter-spacing="1.4" fill="${FAINT}">${name}</text>\n`;
  }
});

let labels = '';
for (const [lbl, i] of [['Mon', 1], ['Wed', 3], ['Fri', 5]]) {
  labels += `    <text x="${LEFT - 14}" y="${TOP + i * STEP + 11.5}" text-anchor="end" font-family="${MONO}" font-size="10.5" font-weight="700" fill="${FAINT}">${lbl}</text>\n`;
}

const lx = LEFT + weeks.length * STEP - 196;
let legend = `    <text x="${lx}" y="${HH - 34}" font-family="${MONO}" font-size="10.5" font-weight="700" letter-spacing="1.4" fill="${FAINT}">LESS</text>\n`;
RAMP.forEach((c, i) => {
  legend += `    <rect x="${lx + 44 + i * 21}" y="${HH - 45}" width="15" height="15" rx="4" fill="${c}"${i ? ` stroke="#0E1116" stroke-width="1"` : ''}/>\n`;
});
legend += `    <text x="${lx + 158}" y="${HH - 34}" font-family="${MONO}" font-size="10.5" font-weight="700" letter-spacing="1.4" fill="${FAINT}">MORE</text>\n`;

// Minute-level, not just the date: a card that says when it was drawn can be
// checked. One that only says the day hides up to twenty-four hours of drift.
const stamp = new Date().toISOString().slice(0, 16).replace('T', ' ');
const head = `    <text x="42" y="48" font-family="${MONO}" font-size="12.5" font-weight="700" letter-spacing="3" fill="${TEXT}">STILL SHIPPING &#183; LAST 12 MONTHS</text>
    <text x="1150" y="48" text-anchor="end" font-family="${MONO}" font-size="12.5" font-weight="700" letter-spacing="1.6" fill="${MUTE}">${cal.totalContributions} CONTRIBUTIONS &#183; ${activeDays} ACTIVE DAYS &#183; ${busiest} IN A DAY</text>
    <text x="42" y="${HH - 34}" font-family="${MONO}" font-size="10" letter-spacing="1.2" fill="#3A424C">REBUILT ${stamp} UTC &#183; EVERY 4 HOURS, BY WORKFLOW</text>\n`;

writeFileSync(`${OUT}/heatmap.svg`, card(1200, HH, head + months + labels + cells + legend, { id: 'h' }));

/* ------------------------------------------------------------------ stats */

const tiles = [
  { n: allTime.toLocaleString(), label: 'CONTRIBUTIONS', sub: `SINCE ${since}`, accent: MINT },
  { n: String(repos), label: 'PUBLIC REPOS', sub: `${stars} STARS EARNED`, accent: INDIGO },
  { n: '4', label: 'THINGS YOU CAN USE', sub: 'SHIPPED, NOT SHELVED', accent: AMBER },
  { n: String(busiest), label: 'BUSIEST DAY', sub: `${activeDays} ACTIVE DAYS`, accent: CORAL },
];

const TW = 1200, GAP = 16;
const CWID = Math.floor((TW - GAP * 3) / 4);
let s = '';
tiles.forEach((t, i) => {
  const x = i * (CWID + GAP);
  s += `  <rect x="${x + 1}" y="1" width="${CWID - 2}" height="118" rx="16" fill="${SURFACE}" stroke="${LINE}" stroke-width="1.5"/>
  <rect x="${x + 22}" y="30" width="3" height="26" rx="1.5" fill="${t.accent}"/>
  <text x="${x + 38}" y="54" font-family="${DISPLAY}" font-size="40" font-weight="800" letter-spacing="-1.6" fill="${TEXT}">${t.n}</text>
  <text x="${x + 22}" y="82" font-family="${MONO}" font-size="11" font-weight="600" letter-spacing="2" fill="${t.accent}">${t.label}</text>
  <text x="${x + 22}" y="100" font-family="${MONO}" font-size="10" letter-spacing="1.4" fill="${FAINT}">${t.sub}</text>\n`;
});

writeFileSync(`${OUT}/stats.svg`, `<svg xmlns="http://www.w3.org/2000/svg" width="${TW}" height="120" viewBox="0 0 ${TW} 120" fill="none" role="img" aria-label="${allTime} contributions since ${since}, ${repos} public repos, ${stars} stars, busiest day ${busiest}">
${s}</svg>
`);

/* --------------------------------------------------------------- activity */

/**
 * The heatmap answers "how often"; this answers "how much, and when".
 * Same twelve months, aggregated into bars, so a reader gets the shape of the
 * year without counting squares.
 */
const byMonth = new Map();
for (const d of days) {
  const key = d.date.slice(0, 7);
  byMonth.set(key, (byMonth.get(key) ?? 0) + d.contributionCount);
}
// Drop the partial month at each end so no bar is unfairly short.
const monthKeys = [...byMonth.keys()].sort().slice(-12);
const peakMonth = Math.max(...monthKeys.map((k) => byMonth.get(k)));

const AW = 1200, AH = 250, AL = 60, AR = 60, ABASE = 196, ATOP = 74;
const slot = (AW - AL - AR) / monthKeys.length;
const barW = Math.min(64, slot - 14);

let bars = '';
monthKeys.forEach((k, i) => {
  const v = byMonth.get(k);
  const h = peakMonth ? Math.round(((ABASE - ATOP) * v) / peakMonth) : 0;
  const x = Math.round(AL + i * slot + (slot - barW) / 2);
  const y = ABASE - h;
  const [yy, mm] = k.split('-');
  const label = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'][+mm - 1];
  const fill = v === 0 ? '#1B2027' : v >= peakMonth * 0.75 ? MINT : v >= peakMonth * 0.4 ? INDIGO : '#3E5A7A';
  if (h > 3) {
    bars += `    <rect x="${x}" y="${y}" width="${barW}" height="${h}" rx="7" fill="${fill}"/>\n`;
    bars += `    <rect x="${x}" y="${y}" width="${barW}" height="2.5" rx="1.2" fill="${TEXT}" opacity="0.5"/>\n`;
    bars += `    <text x="${x + barW / 2}" y="${y - 12}" text-anchor="middle" font-family="${MONO}" font-size="12.5" font-weight="600" fill="${TEXT}">${v}</text>\n`;
  } else {
    bars += `    <rect x="${x}" y="${ABASE - 3}" width="${barW}" height="3" rx="1.5" fill="#1B2027"/>\n`;
  }
  bars += `    <text x="${x + barW / 2}" y="${ABASE + 24}" text-anchor="middle" font-family="${MONO}" font-size="10.5" font-weight="600" letter-spacing="1.2" fill="${v ? MUTE : FAINT}">${label}</text>\n`;
  if (label === 'JAN' || i === 0) {
    bars += `    <text x="${x + barW / 2}" y="${ABASE + 40}" text-anchor="middle" font-family="${MONO}" font-size="9.5" font-weight="600" letter-spacing="1" fill="${FAINT}">${yy}</text>\n`;
  }
});

const busiestMonth = monthKeys.reduce((a, b) => (byMonth.get(b) > byMonth.get(a) ? b : a));
const ahead = `    <text x="42" y="44" font-family="${MONO}" font-size="12.5" font-weight="700" letter-spacing="3" fill="${TEXT}">THE SHAPE OF THE YEAR</text>
    <text x="1150" y="44" text-anchor="end" font-family="${MONO}" font-size="12.5" font-weight="700" letter-spacing="1.6" fill="${MUTE}">BUSIEST MONTH &#183; ${busiestMonth} &#183; ${peakMonth} CONTRIBUTIONS</text>
    <line x1="34" y1="${ABASE}" x2="1166" y2="${ABASE}" stroke="${LINE}" stroke-width="1.5"/>\n`;

writeFileSync(`${OUT}/activity.svg`, card(AW, AH, ahead + bars, { id: 'a' }));

console.log(`activity: peak ${peakMonth} in ${busiestMonth}`);
console.log(`heatmap: ${cal.totalContributions} in last year, ${activeDays} active, peak ${busiest}`);
console.log(`stats:   ${allTime} all-time since ${since}, ${repos} public repos, ${stars} stars`);

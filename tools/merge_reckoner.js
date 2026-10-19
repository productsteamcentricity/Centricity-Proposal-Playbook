// MONTHLY: refresh window.CENTRICITY_SELECT from Monthly Investment Reckoner - <Month Year>.pptx
//
//   node tools/merge_reckoner.js "<pptx>" --html site/index.html [--accept-drops <n>] [--apply]
//
// Drop gates (KNOWN_ISSUES A4, D71). A join failure looks like an editorial change: the deck still
// recommends a fund under a spelling resolve() cannot place, so its Select entry drops while the
// deck name lands in NO MASTER MATCH. The run is refused when (1) a dropped entry's category also
// holds a deck name that matched nothing, (2) more than 5% of the current list drops, or (3) a
// category is emptied. --accept-drops <n> waives (2) and (3) once the owner has read the DROPPED
// list, and only if this run drops exactly n; (1) is never waived — pin the name (PIN), add the
// fund (add_reckoner_funds.js) or record it in NO_MASTER_NOTE, then re-run. A fourth gate, also
// never waived, refuses a dropped entry that the deck still lists under a heading GRID does not map
// (a renamed heading such as "Focused Fund" for "Focused Funds"): map the heading, then re-run.
//
// Membership comes from the deck. The dashboard's own category structure is preserved: a deck
// heading maps to an existing `sheet`/`category` pair, and headings the dashboard has no Select
// bucket for are reported, not invented (putting a Select badge on a liquid fund or a plain index
// tracker is a house recommendation, not a data refresh).
//
// Retained funds keep their rationale, risk ratios and details. New PMS/AIF/Unlisted/Gift entries
// take their rationale and details from their own narrative slide. New MF entries have no source
// for either — the deck's MF pages are performance grids only — so they are listed at the end.
const B = require('./lib/blocklib');
const R = require('./lib/reck_parse');
const N = require('./lib/reck_narrative');

const USAGE = 'Usage: node tools/merge_reckoner.js "<pptx>" --html site/index.html [--accept-drops <n>] [--apply]';
const usage = msg => { if (msg) console.error(msg); console.error(USAGE); process.exit(2); };
const argv = process.argv.slice(2);
let APPLY = false, HTML = null, ACCEPT = null, SRC = null;
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === '--apply') APPLY = true;
  else if (a === '--html' || a === '--accept-drops') {
    const v = argv[++i];
    if (v == null || v.startsWith('--')) usage(a + ' needs a value');
    if (a === '--html') HTML = v; else ACCEPT = v;
  } else if (a.startsWith('--')) usage('unknown flag: ' + a);
  else if (SRC === null) SRC = a;
  else usage('unexpected extra argument: ' + a);
}
if (!SRC || !HTML) usage();
if (ACCEPT !== null && !/^\d+$/.test(ACCEPT)) usage('*** --accept-drops takes the number of dropped funds the owner reviewed');

// Pin maps: tools/data/pins.json, shared with merge_pms_performance.js, pin_pms_alias.js and
// merge_aif_performance.js (KNOWN_ISSUES A18). Its names are byte-exact; a deliberate trailing
// space that went missing, or a stray one, stops the run (A25).
function loadPins() {
  const P = require('./data/pins.json');
  const names = { pms_alias: Object.entries(P.pms_alias).flatMap(([k, e]) => [k, e.key]), reckoner: Object.entries(P.reckoner).flat() };
  for (const sec of Object.keys(names)) {
    const got = [...new Set(names[sec].filter(s => s !== s.trim()))].sort(), want = (P.trailing_space[sec] || []).slice().sort();
    if (JSON.stringify(got) !== JSON.stringify(want)) {
      console.error('*** tools/data/pins.json ' + sec + ': names with an edge space are ' + JSON.stringify(got) + ', trailing_space expects ' +
        JSON.stringify(want) + ' — a deliberate space was lost or a stray one added (KNOWN_ISSUES A25)');
      process.exit(1);
    }
  }
  return P;
}

// ---------- deck heading -> dashboard bucket ----------
const GRID = {
  'Large Cap Funds':                           ['Large Cap Funds', 'LARGE CAP FUNDS', 'mf'],
  'Large & Mid Cap Funds':                     ['Large&Mid and Flexi', 'DIVERSIFIED EQUITY FUNDS', 'mf'],
  'Flexi Cap Funds':                           ['Large&Mid and Flexi', 'DIVERSIFIED EQUITY FUNDS', 'mf'],
  'Multi Cap Funds':                           ['Multi Cap and Focused', 'DIVERSIFIED EQUITY FUNDS', 'mf'],
  'Focused Funds':                             ['Multi Cap and Focused', 'DIVERSIFIED EQUITY FUNDS', 'mf'],
  'Midcap Fund':                               ['Mid Cap Funds', 'MID CAP FUNDS', 'mf'],
  'Small Cap Funds':                           ['Small Cap Funds', 'SMALL CAP FUNDS', 'mf'],
  'ELSS Funds':                                ['ELSS', 'ELSS FUNDS', 'mf'],
  'Sectoral':                                  ['@SECTORAL_SPLIT', null, 'mf'],
  'Index Funds':                               ['@SMART_BETA', null, 'mf'],
  'Ultra Short Duration Fund':                 ['Debt Ultra Short Duration Funds', 'ULTRA-SHORT DURATION FUNDS', 'mf'],
  'Low Duration Fund':                         ['Debt Low Duration Funds', 'LOW DURATION FUNDS', 'mf'],
  'Money Market Fund':                         ['Debt Money Market Funds', 'MONEY MARKET FUNDS', 'mf'],
  'Short Duration Fund':                       ['Debt Short Duration Funds', 'SHORT DURATION BONDS', 'mf'],
  'Banking and PSU Fund':                      ['Debt Banking & PSU Funds', 'BANKING & PSU FUNDS', 'mf'],
  'Corporate Bond Fund':                       ['Debt Corporate Bond Fund', 'CORPORATE BOND FUNDS', 'mf'],
  'Medium Duration Fund':                      ['Debt Medium Duration Funds', 'MEDIUM DURATION FUNDS', 'mf'],
  'Long Duration':                             ['Debt Long Duration Funds', 'INCOME/LONG DURATION FUNDS', 'mf'],
  'Dynamic Bond Fund':                         ['Debt Dynamic Bond Funds', 'DYNAMIC BOND FUNDS', 'mf'],
  'Credit Risk Fund':                          ['Debt Credit Risk Funds', 'CREDIT RISK FUNDS', 'mf'],
  'Gilt Fund with 10 Years Constant Maturity': ['Debt Gilt Funds', 'GILT FUNDS', 'mf'],
  'Balanced Advantage':                        ['BAF', 'BALANCED ADVANTAGE FUNDS', 'mf'],
  'Arbitrage Fund':                            ['Arbitrage', 'ARBITRAGE FUNDS', 'mf'],
  'Multi Asset- Equity':                       ['Multi Asset Fund', 'MULTI ASSET ALLOCATION FUNDS', 'mf'],
  'Multi Asset Fund- Debt':                    ['Multi Asset Fund', 'MULTI ASSET ALLOCATION FUNDS', 'mf'],
  'GOLD':                                      ['Commodities', 'COMMODITIES', 'mf'],
  'SILVER':                                    ['Commodities', 'COMMODITIES', 'mf'],
  'Large Cap Fund':                            ['Equity Large & Multi Cap PMS', 'LARGE & MULTI CAP PMS', 'pms'],
  'Multi Cap Fund':                            ['Equity Multi Cap PMS', 'MULTI CAP PMS', 'pms'],
  'Mid & Small Cap':                           ['Equity Mid & Small Cap PMS', 'MID & SMALL CAP PMS', 'pms'],
  'AIF (CAT III) - Listed Equity':             ['EQUITY AIFs- Listed Equities', 'EQUITY AIFs- Listed Equities', 'aif'],
};
// Deck buckets with no Select category in the dashboard — reported, never auto-added.
const OUT_OF_SCOPE = ['Overnight Fund', 'Liquid Fund', 'Floater Fund', 'Fund of Funds', 'ETF',
  'International', 'Aggressive Hybrid', 'Equity Saving', 'Conservative Hybrid', 'Dynamic Asset Allocation Fund'];
// Smart beta = a factor tilt, not a cap-weighted tracker.
const SMART_BETA = /(momentum|low\s*vol|value\s*20|alpha\s*50|equal\s*weight|quality)/i;

// Products that live on their own narrative slide instead of a performance grid; taken from the
// deck's own index pages (slides 2-4). Names here are MASTER names.
//
// TRAILING SPACES ARE DATA (KNOWN_ISSUES A25) — keep them byte-exact, never trim:
//   sheet keys 'DEBT AIF ' and 'Unlisted Equity ' match the `sheet` of the live CENTRICITY_SELECT
//   entries; 'Vivriti Short Term Debt Fund ', 'InCred Credit Opportunities Fund III ',
//   '360 0ne Early-Stage Fund Series I ', 'Campus Fund III ' and 'ValueQuest S.C.A.L.E. Fund II '
//   are MASTER names that end in a space.
const NARRATIVE = {
  'Income Plus Arbitrage': { cat: 'INCOME PLUS ARBITRAGE', kind: 'mf', names: [
    'HDFC Income Plus Arbitrage Active FOF-Reg(G)', 'Bandhan Income Plus Arbitrage Active FOF-Reg(G)',
    'Kotak Income Plus Arbitrage Omni FOF-Reg(G)', 'ICICI Pru Income plus Arbitrage Omni FOF(G)'] },
  'Debt PMS': { cat: 'DEBT PMS', kind: 'pms', names: [
    'Neo Yield Enhancer', 'Phillip Conservative Credit Portfolio', 'Sundaram F.I.R.S.T. Debt PMS'] },
  'DEBT AIF ': { cat: 'DEBT AIFs', kind: 'aif', names: [
    'Northern Arc Money Market Alpha Fund', 'Vivriti Short Term Debt Fund ', 'Mosaic Multiyield Fund Series I',
    'UTI Structured Debt Fund IV', 'Neo Infra Income Opportunities Fund II', 'InCred Credit Opportunities Fund III ',
    // Sep-2026 moved this under a new "Long - Short AIF" index heading, which the dashboard has no
    // Select bucket for. MASTER files it Debt / AIF / Debt AIF, so it stays in DEBT AIFs — deck
    // headings move, the dashboard's categories do not.
    'Inquant Debt Plus Fund'] },
  // The deck renamed this heading to "Private Equity/ Venture Capital Fund" in Sep-2026; same
  // bucket, same members plus Carnelian, whose MASTER class is AIF CAT II - Unlisted Equity.
  'EQUITY AIFs- Unlisted Equities': { cat: 'EQUITY AIFs- Unlisted Equities', kind: 'aif', names: [
    'InCred Growth Partners Fund II', '360 0ne Early-Stage Fund Series I ', 'Campus Fund III ',
    'ValueQuest S.C.A.L.E. Fund II ', 'Carnelian Private Growth & Innovation Fund'] },
  'Unlisted Equity ': { cat: 'UNLISTED EQUITIES', kind: 'unlisted', names: [
    'Orbis', 'Parag Parikh Financial Advisory Services', 'Goodluck Defence & Aerospace', 'ESDS Software Solution'] },
  'Gift City Funds': { cat: 'GIFT CITY FUNDS', kind: 'gift', names: [
    'Mirae Asset Global Asset Allocation Fund (Outbound)', 'Ashoka Whiteoak Emerging Fund (Outbound)',
    'DSP Global Equity Fund (Outbound)', 'Alchemy India Long Term Fund (Inbound)'] },
};
// Deck name -> MASTER name, where normalisation cannot bridge the gap on its own. Maintained in
// tools/data/pins.json (section `reckoner`, with the reason for each pin in `reckoner_notes`);
// merge_aif_performance.js reads three of the same pins from there.
const PIN = loadPins().reckoner;
// In the deck but with no MASTER instrument to hang the badge on. Adding one is a universe
// change — run add_reckoner_funds.js, do not let this script invent records.
const NO_MASTER_NOTE = {};

// ---------- resolve deck names against MASTER ----------
const norm = s => String(s).toLowerCase()
  .replace(/[‘’“”`']/g, '').replace(/\s*[-–—]\s*/g, ' ')
  .replace(/[().,&*]/g, ' ').replace(/\bwhiteoak\b|\bwoc\b/g, 'woc')
  .replace(/\breg\b|\bdir\b|\bg\b|\bidcw\b|\bgrowth\b|\bfund\b|\bfunds\b|\bthe\b/g, ' ')
  .replace(/\s+/g, ' ').trim();

const S0 = B.read(HTML, 'window.CENTRICITY_SELECT = ').value;
const MASTER = B.read(HTML, 'window.MASTER = ').value;
const exact = new Set(MASTER.map(r => r.name));
const byNorm = new Map();
for (const r of MASTER) { const k = norm(r.name); if (!byNorm.has(k)) byNorm.set(k, []); byNorm.get(k).push(r.name); }
const subOf = new Map(MASTER.map(r => [r.name, r.sub_category]));

// The deck lags the SEBI renames: Sep-2026 still wrote "Kotak Multicap Fund-Reg(G)",
// "ICICI Pru Banking & PSU Debt Fund(G)" and ten more under their pre-rename spellings. Those are
// exactly the names rename_schemes.js stamped onto the record as `prev_name`, so the join is exact
// — no fuzzy matching. Without this tier the deck name reads as an unknown fund, the existing
// Select entry is dropped, and a house recommendation silently disappears from the pick list.
// A LIVE name always wins over a prev_name, mirroring H.buildFundIndex's second pass.
const byPrev = new Map(), byNormPrev = new Map();
for (const r of MASTER) {
  if (!r.prev_name) continue;
  if (!byPrev.has(r.prev_name)) byPrev.set(r.prev_name, r.name);
  const k = norm(r.prev_name);
  if (!byNormPrev.has(k)) byNormPrev.set(k, []);
  byNormPrev.get(k).push(r.name);
}

const unresolved = [];
const viaPrev = [];
function resolve(name) {
  if (PIN[name]) {
    if (exact.has(PIN[name])) return PIN[name];
    // A pin written before Aug-2026 can point at a name that has itself since been renamed.
    if (byPrev.has(PIN[name])) { viaPrev.push(name + '  -> ' + byPrev.get(PIN[name]) + '  (pin target renamed)'); return byPrev.get(PIN[name]); }
  }
  if (exact.has(name)) return name;
  if (byPrev.has(name)) { viaPrev.push(name + '  -> ' + byPrev.get(name)); return byPrev.get(name); }
  const c = byNorm.get(norm(name)) || [];
  if (c.length === 1) return c[0];
  const cp = byNormPrev.get(norm(name)) || [];
  if (!c.length && cp.length === 1) { viaPrev.push(name + '  -> ' + cp[0] + '  (normalised)'); return cp[0]; }
  unresolved.push(name + (c.length ? '  (ambiguous x' + c.length + ')' : '  (no MASTER record)'));
  return null;
}

// ---------- build the new membership ----------
const rows = R.parse(SRC);
const next = new Map();
const skipped = new Map();
const note = (k, v) => { if (!skipped.has(k)) skipped.set(k, []); skipped.get(k).push(v); };
// Deck names that matched nothing, with the Select categories they would have filled (for the
// drop gates). A deck name the owner has recorded in NO_MASTER_NOTE (exact key, so a short or empty
// key cannot exempt everything) is a known gap, not a join failure.
const missed = [];
const unmapped = [];   // { h, name } for every deck row under a heading GRID does not map
const miss = (name, cats) => { if (!Object.prototype.hasOwnProperty.call(NO_MASTER_NOTE, name)) missed.push({ name: name, cats: cats }); };

for (const r of rows) {
  const h = r.heading || '';
  if (OUT_OF_SCOPE.includes(h)) { note(h, r.name); continue; }
  const g = GRID[h];
  if (!g) { note('(unmapped) ' + h, r.name); unmapped.push({ h, name: r.name }); continue; }
  const m = resolve(r.name);
  if (!m) {
    miss(r.name, g[0] === '@SECTORAL_SPLIT' ? ['SECTORAL FUNDS', 'THEMATIC FUNDS']
      : g[0] === '@SMART_BETA' ? (SMART_BETA.test(r.name) ? ['SMART BETA FUNDS'] : [])
      : [g[1]]);
    continue;
  }
  let sheet = g[0], cat = g[1];
  const kind = g[2];
  if (sheet === '@SECTORAL_SPLIT') {
    const thematic = subOf.get(m) === 'Thematic';
    sheet = thematic ? 'Thematic Funds' : 'Sectoral Funds';
    cat = thematic ? 'THEMATIC FUNDS' : 'SECTORAL FUNDS';
  } else if (sheet === '@SMART_BETA') {
    if (!SMART_BETA.test(r.name)) { note('Index Funds (cap-weighted trackers)', r.name); continue; }
    sheet = 'Smart Beta Funds'; cat = 'SMART BETA FUNDS';
  }
  if (!next.has(m)) next.set(m, { sheet: sheet, category: cat, kind: kind, deckName: r.name });
}
for (const sheet of Object.keys(NARRATIVE)) {
  const spec = NARRATIVE[sheet];
  for (const n of spec.names) {
    const m = resolve(n);
    if (!m) { miss(n, [spec.cat]); continue; }
    if (!next.has(m)) next.set(m, { sheet: sheet, category: spec.cat, kind: spec.kind, deckName: n });
  }
}

// ---------- narrative slides supply rationale + details for the non-MF entries ----------
const sl = N.slides(SRC);
function findSlide(deckName) {
  const toks = norm(deckName).split(' ').filter(t => t.length > 3);
  if (toks.length < 2) return null;
  let best = null, bestScore = 0;
  for (const s of sl) {
    const head = norm(s.body.slice(0, 6).join(' '));
    const hit = toks.filter(t => head.includes(t)).length;
    if (hit > bestScore) { bestScore = hit; best = s; }
  }
  return bestScore / toks.length >= 0.6 ? best : null;
}

// ---------- assemble ----------
const out = {};
const kept = [], added = [], dropped = [], noRationale = [];
for (const entry of next) {
  const m = entry[0], spec = entry[1];
  const prev = S0[m];
  if (prev) {
    out[m] = Object.assign({}, prev, { category: spec.category, sheet: spec.sheet });
    kept.push(m);
  } else {
    const e = { reckonerName: spec.deckName, category: spec.category, sheet: spec.sheet, kind: spec.kind };
    if (spec.kind !== 'mf') {
      const s = findSlide(spec.deckName);
      if (s) {
        const a = N.about(s); if (a) e.rationale = a;
        const d = N.details(s); if (d.length) e.details = d;
      }
    }
    if (!e.rationale) noRationale.push(m + '   [' + spec.category + ']');
    out[m] = e;
    added.push(m + '   [' + spec.category + ']');
  }
}
for (const k of Object.keys(S0)) if (!next.has(k)) dropped.push(k + '   [' + S0[k].category + ']');

// ---------- report ----------
console.log('CENTRICITY_SELECT ' + Object.keys(S0).length + ' -> ' + Object.keys(out).length +
  '   (+' + added.length + ' added, -' + dropped.length + ' dropped, ' + kept.length + ' retained)');
const badKeys = Object.keys(out).filter(k => !exact.has(k));
console.log('\nGATE every key exists in MASTER: ' + (badKeys.length ? '*** ' + badKeys.join(' | ') : 'PASS'));
console.log('GATE rationale present: ' + Object.values(out).filter(v => v.rationale).length + '/' + Object.keys(out).length);
const cats = {}; Object.values(out).forEach(v => { cats[v.category] = (cats[v.category] || 0) + 1; });
console.log('GATE categories: ' + Object.keys(cats).length + ' (was ' + new Set(Object.values(S0).map(v => v.category)).size + ')');

// ---------- drop gates (see the header; KNOWN_ISSUES A4, D71) ----------
// Sep-2026, before resolve() learnt prev_name, went 178 -> 160 this way — 20 funds and two whole
// categories — with every gate above passing.
const missByCat = new Map();
for (const u of missed) for (const c of u.cats) { if (!missByCat.has(c)) missByCat.set(c, new Set()); missByCat.get(c).add(u.name); }
const mirror = Object.keys(S0).filter(k => !next.has(k) && missByCat.has(S0[k].category));
const n0 = Object.keys(S0).length, DROP_LIMIT = Math.floor(n0 * 0.05);
const lostCats = [...new Set(Object.values(S0).map(v => v.category))].filter(c => !cats[c]).sort();
const accepted = ACCEPT !== null && Number(ACCEPT) === dropped.length;
console.log('GATE dropped vs NO MASTER MATCH in the same category: ' + (mirror.length
  ? '*** FAIL — ' + mirror.length + ' Select fund(s) drop where the deck lists a name that matched nothing (a join failure, not an editorial change)'
  : 'PASS'));
mirror.sort().forEach(k => console.log('     - ' + k + '   [' + S0[k].category + ']   deck: ' + [...missByCat.get(S0[k].category)].join(' | ')));
console.log('GATE drops within ' + DROP_LIMIT + ' (5% of ' + n0 + '): ' + dropped.length + ' — ' +
  (dropped.length <= DROP_LIMIT ? 'PASS' : accepted ? 'ACCEPTED (--accept-drops ' + ACCEPT + ')' : '*** FAIL'));
console.log('GATE no Select category emptied: ' + (!lostCats.length ? 'PASS'
  : (accepted ? 'ACCEPTED (--accept-drops ' + ACCEPT + ') — ' : '*** FAIL — ') + lostCats.join(' | ')));
if (ACCEPT !== null && !accepted) console.log('*** --accept-drops ' + ACCEPT + ' does not match the ' + dropped.length + ' funds this run drops — re-read the DROPPED list');
// (4) A dropped entry the deck still lists under a heading GRID does not map (a renamed heading such
// as "Focused Fund" for "Focused Funds") is a mapping failure, not an editorial drop. Rows under an
// unmapped heading never reach resolve(), so gate (1) cannot see them. Same normalised name
// (ignoring spaces), or 80% of the normalised words shared, counts as the same fund. Never waived.
const squash = t => norm(t).replace(/ /g, '');
const words = t => new Set(norm(t).split(' ').filter(w => w.length > 1));
const share = (x, y) => { const X = words(x), Y = words(y), i = [...X].filter(w => Y.has(w)).length; return i / ((X.size + Y.size - i) || 1); };
const underUnmapped = [];
for (const k of Object.keys(S0)) {
  if (next.has(k)) continue;
  for (const u of unmapped) if (squash(k) === squash(u.name) || share(k, u.name) >= 0.8) underUnmapped.push(k + '  <->  "' + u.h + '": ' + u.name);
}
console.log('GATE no DROPPED entry still listed under an unmapped deck heading: ' + (underUnmapped.length
  ? '*** FAIL ' + underUnmapped.length + ' — map the heading in GRID (--accept-drops does not waive this)'
  : 'PASS'));
underUnmapped.forEach(p => console.log('     - ' + p));
const fail = badKeys.length > 0 || mirror.length > 0 || underUnmapped.length > 0 || (ACCEPT !== null && !accepted) ||
  (!accepted && (dropped.length > DROP_LIMIT || lostCats.length > 0));

if (viaPrev.length) {
  console.log('\n===== RESOLVED VIA prev_name (deck still on the pre-rename spelling) =====');
  [...new Set(viaPrev)].sort().forEach(v => console.log('  ~ ' + v));
}

console.log('\n================ ADDED ================');
added.sort().forEach(a => console.log('  + ' + a));
console.log('\n================ DROPPED (not in this deck) ================');
dropped.sort().forEach(d => console.log('  - ' + d));
if (unresolved.length) {
  console.log('\n================ DECK NAMES WITH NO MASTER MATCH ================');
  [...new Set(unresolved)].forEach(u => {
    console.log('  ! ' + u);
    const n = Object.keys(NO_MASTER_NOTE).find(k => u.indexOf(k) === 0);
    if (n) console.log('      ' + NO_MASTER_NOTE[n]);
  });
}
console.log('\n================ NEW ENTRIES WITH NO RATIONALE ================');
noRationale.sort().forEach(n => console.log('  ? ' + n));
console.log('\n================ DECK BUCKETS THE DASHBOARD HAS NO SELECT CATEGORY FOR ================');
for (const pair of skipped) console.log('  [' + pair[0] + ']  ' + pair[1].length + ': ' + pair[1].slice(0, 4).join(', ') + (pair[1].length > 4 ? ', …' : ''));
console.log('\ncounts per category:');
Object.keys(cats).sort().forEach(c => console.log('   ' + String(cats[c]).padStart(3) + '  ' + c));

if (!APPLY) {
  console.log('\n[dry run] pass --apply to write');
  if (fail) console.error('*** a gate failed — --apply would refuse');
  process.exit(fail ? 1 : 0);
}
if (fail) { console.error('\n*** gate failed — refusing to write'); process.exit(1); }
const bytes = B.writeBlocks(HTML, [{ prefix: 'window.CENTRICITY_SELECT = ', value: out }]);
console.log('\nWROTE ' + HTML + ' — ' + bytes + ' bytes');

// SEBI scheme-name standardisation (first seen in the Aug-2026 Monitor): AMCs renamed ~210
// existing schemes — "Flexicap"→"Flexi Cap", "Low Duration"→"Ultra Short to Short Term",
// "Dynamic Bond"→"Dynamic Term", "Equity & Debt"→"Aggressive Hybrid", and so on.
//
// RUN THIS BEFORE bake_month.js. The bake matches by name, so on a renamed scheme it would
// append a SECOND record under the new name and leave the old one behind carrying last month's
// returns — ~210 duplicate funds in a client-facing pick list, half of them stale.
//
// Identity is INCEPTION DATE + AMC, never the scheme name — the name is exactly what changed.
// A tie (same AMC, same inception, two schemes) is broken by the monitor sheet's own taxonomy
// against the record's sub_category; anything still ambiguous is REPORTED, never guessed.
//
//   node tools/rename_schemes.js --monitor "<Daily MF Monitor ....xlsx>" [--html site/index.html] [--apply]
//
// Renames every store keyed by fund name: MASTER, EQUITY/HYBRID/DEBT_ANALYTICS, DIRECT_PERF,
// RISK_MATRIX and CENTRICITY_SELECT, plus the IRR map in Centricity_IRR_Offshore.js. Re-running
// is a no-op (the old names are gone by then); only blocks that change are written, and the page
// and the sibling are written together (validated first, then both).
//
// Merge policy (KNOWN_ISSUES A5): when an old name's live name already has an entry in a store,
// the live-name entry wins and the stale old-name entry is DROPPED and reported. A record renamed
// a second time keeps `prev_name` = its immediate old name (the page and the tools read it) and
// gains `prev_names` = every earlier name, oldest first.
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const blocklib = require('./lib/blocklib.js');
const { isoDay } = require('./lib/dates.js');

const USAGE = 'Usage: node tools/rename_schemes.js --monitor "<Daily MF Monitor ....xlsx>" [--html site/index.html] [--apply]';
const argv = process.argv.slice(2);
const unknown = argv.filter(a => a.startsWith('--') && !['--monitor', '--html', '--apply'].includes(a));
if (unknown.length) { console.error(`unknown option(s): ${unknown.join(' ')}\n${USAGE}`); process.exit(2); }
// A value flag needs a value, and a word that belongs to no flag is a mistake, not something to ignore.
const VALUED = ['--monitor', '--html'];
for (const f of VALUED) { const i = argv.indexOf(f); if (i >= 0 && (argv[i + 1] == null || argv[i + 1].startsWith('--'))) { console.error(`${f} needs a value\n${USAGE}`); process.exit(2); } }
const stray = argv.filter((a, i) => !a.startsWith('--') && !VALUED.includes(argv[i - 1]));
if (stray.length) { console.error(`unexpected argument(s): ${stray.join(' ')}\n${USAGE}`); process.exit(2); }
const flag = n => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : null; };
const APPLY = argv.includes('--apply');
const MON = flag('--monitor');
const HTML = flag('--html') || path.join(__dirname, '..', 'site', 'index.html');
if (!MON || !fs.existsSync(MON)) {
  console.error(USAGE);
  process.exit(2);
}
if (!fs.existsSync(HTML)) { console.error('*** page not found: ' + HTML); console.error(USAGE); process.exit(2); }

// ---------- the monitor's own taxonomy, mirrored from index.html's SHEET_MAP ----------
// Only the sub-category is needed here (the tie-break), so this is the third element alone.
// The page's four REFRESH_ONLY_SHEETS (Debt Oriented34, the two Solution Oriented sheets, Hybrid) are
// left out ON PURPOSE: they mix classes, and giving them a sub-category switches on the tier-3 pairing
// below, which then invents a rename (SBI CPSE Bond Plus SDL Sep 2026 -> SBI CRISIL-IBX SDL June 2034).
const SHEET_SUB = {
  'Large Cap Fund': 'Large Cap', 'Large & Mid Cap': 'Large & Mid Cap', 'Flexi Cap Fund': 'Flexi Cap',
  'Multi Cap Fund': 'Multi Cap', 'Focused Fund': 'Focused', 'Mid Cap Fund': 'Mid Cap',
  'Small cap Fund': 'Small Cap', 'Value Fund': 'Value / Contra', 'Thematic Fund': 'Thematic',
  'Contra': 'Value / Contra', 'Dividend Yield': 'Dividend Yield', 'Sector': 'Sectoral',
  'Equity Linked Savings Scheme': 'ELSS', 'Index': 'Index Fund', 'Equity Oriented': 'Equity ETF',
  'Global': 'International', 'Overnight Fund': 'Overnight', 'Liquid': 'Liquid',
  'Ultra Short Duration': 'Ultra Short Duration', 'Low Duration': 'Low Duration',
  'Money Market': 'Money Market', 'Short Duration': 'Short Duration',
  'Banking and PSU Fund': 'Banking & PSU', 'Corporate Bond': 'Corporate Bond',
  'Dynamic Bond': 'Dynamic Bond', 'Floating Rate': 'Floating Rate', 'Short & Mid Term': 'Short & Mid Term',
  'Medium Duration': 'Medium Duration', 'Medium to Long Duration': 'Medium to Long Duration',
  'Long Duration': 'Long Duration', 'Credit Risk Fund': 'Credit Risk',
  'Gilt Fund with 10 year constan': 'Gilt 10Y', 'Debt Oriented': 'Debt ETF', 'Debt': 'Gilt',
  'Arbitrage Fund': 'Arbitrage', 'Equity Savings': 'Equity Savings',
  'Conservative Hybrid Fund': 'Conservative Hybrid', 'Balanced Advantage': 'Balanced Advantage',
  'Dynamic Asset Allocation': 'Dynamic Asset Allocation', 'Multi Asset Allocation': 'Multi Asset Allocation',
  'Aggressive Hybrid Fund': 'Aggressive Hybrid', 'Silver': 'Silver', 'Gold': 'Gold',
};

// ---------- read the monitor ----------
const wb = XLSX.readFile(MON, { cellDates: true });
const cv = (sh, r, c) => { const x = sh[XLSX.utils.encode_cell({ r, c })]; return x ? x.v : null; };
const mon = [];
for (const sn of wb.SheetNames) {
  const sh = wb.Sheets[sn]; if (!sh || !sh['!ref']) continue;
  const rg = XLSX.utils.decode_range(sh['!ref']);
  let HR = -1;
  for (let rr = rg.s.r; rr <= Math.min(rg.s.r + 25, rg.e.r); rr++) {
    const c0 = cv(sh, rr, 0);
    if (c0 && String(c0).trim().toLowerCase() === 'scheme name') { HR = rr; break; }
  }
  if (HR < 0) continue;                       // benchmark-only or nav sheet
  const hdr = [];
  for (let c = rg.s.c; c <= rg.e.c; c++) { const v = cv(sh, HR, c); hdr.push(v != null ? String(v).trim() : ''); }
  const ic = hdr.indexOf('Inception Date');
  for (let r = HR + 1; r <= rg.e.r; r++) {
    const raw = cv(sh, r, 0); if (raw == null || raw === '') continue;
    const nm = String(raw).trim(), low = nm.toLowerCase();
    if (low === 'average' || low.startsWith('benchmark')) break;
    const aum = cv(sh, r, 1); if (aum == null || aum === '' || isNaN(Number(aum))) continue;
    let inc = null;
    // The true calendar day of the cell (A6): toISOString() read it one day early east of UTC.
    if (ic >= 0) { const v = cv(sh, r, ic); if (v instanceof Date && !isNaN(v)) inc = isoDay(v); else if (v) inc = String(v).slice(0, 10); }
    mon.push({ name: nm, sheet: sn, sub: SHEET_SUB[sn] || null, inception: inc });
  }
}
console.log(`monitor        : ${path.basename(MON)}  (${mon.length} fund rows)`);

// ---------- name normalisation that survives the tidy-up ----------
// Drops plan suffixes and treats "&" / the word "and" as nothing, so "Large and Mid Cap",
// "Large & Midcap" and "Large & Mid Cap" all collapse to the same key.
const PLAN = /(\(g\)|\(idcw\)|\(d\)|\(growth\)|\(dividend\)|-reg\b|-dir\b|-direct plan|direct plan)/g;
const norm = s => String(s || '').toLowerCase().replace(/\u00A0/g, ' ').replace(PLAN, ' ')
  .replace(/&/g, ' ').replace(/\band\b/g, ' ').replace(/[^a-z0-9]+/g, '');

// AMC = the leading brand words. Multi-word houses are listed; everything else is its first
// word. A wrong guess here can only make a pair ambiguous or unmatched — never mis-joined.
const MULTI = ['aditya birla sl', 'bank of india', 'baroda bnp paribas', 'canara rob', 'franklin india',
  'invesco india', 'lic mf', 'mahindra manulife', 'mirae asset', 'nippon india', 'motilal oswal',
  'icici pru', 'the wealth company', 'bajaj finserv', '360 one', 'pgim india', 'whiteoak capital'];
function amc(nameRaw) {
  const s = String(nameRaw || '').toLowerCase().replace(/\u00A0/g, ' ').replace(/\s+/g, ' ').trim();
  for (const m of MULTI) if (s.startsWith(m)) return m.replace(/[^a-z0-9]/g, '');
  return s.split(' ')[0].replace(/[^a-z0-9]/g, '');
}

// ---------- load the page's blocks ----------
const html = fs.readFileSync(HTML, 'utf8');
const master = blocklib.locate(html, 'window.MASTER = ').value;
const MF = f => /Mutual Fund|ETF|Index Fund/i.test(f.product_class || '');
const mfRecs = master.filter(MF);
const masterNames = new Set(master.map(f => f.name));
const monNames = new Set(mon.map(m => m.name));

const byNorm = new Map(), byInc = new Map();
for (const f of mfRecs) {
  const k = norm(f.name); if (!byNorm.has(k)) byNorm.set(k, []); byNorm.get(k).push(f);
  if (!f.inception) continue;
  const i = String(f.inception).slice(0, 10);
  if (!byInc.has(i)) byInc.set(i, []); byInc.get(i).push(f);
}

// Inception is compared on the exact calendar day. A one-day allowance for MASTER dates baked a day
// early (A6) was used until the corrected dates went live on 19-Oct-2026 (PR #13); since then 2,070
// of the 2,072 Sep-2026 Monitor rows found in MASTER carry the Monitor's exact date.

// ---------- build the map ----------
// A MASTER record still present in the monitor under its own name is never a rename target.
const claimed = new Set(), seen = new Set();
const renames = [], ambiguous = [], fresh = [], leftover = [];
for (const m of mon) {
  if (seen.has(m.name)) continue; seen.add(m.name);
  if (masterNames.has(m.name)) continue;                    // unchanged this month
  const free = f => !monNames.has(f.name) && !claimed.has(f.name);

  const nh = (byNorm.get(norm(m.name)) || []).filter(free);
  if (nh.length === 1) { renames.push({ from: nh[0].name, to: m.name, how: 'name', sub: nh[0].sub_category }); claimed.add(nh[0].name); continue; }

  let cands = (byInc.get(m.inception) || []).filter(f => free(f) && amc(f.name) === amc(m.name));
  if (cands.length > 1 && m.sub) {
    // Two schemes of one AMC launched the same day: the monitor sheet says which is which.
    const narrowed = cands.filter(f => f.sub_category === m.sub);
    if (narrowed.length === 1) cands = narrowed;
  }
  if (cands.length === 1) {
    renames.push({ from: cands[0].name, to: m.name, how: 'inception', sub: cands[0].sub_category });
    claimed.add(cands[0].name);
  }
  else if (cands.length > 1) ambiguous.push({ to: m.name, inception: m.inception, sheet: m.sheet, from: cands.map(c => c.name) });
  else leftover.push(m);
}

// ---- tier 3: one-to-one inside an (AMC, category) cell ----------------------------------
// Aug-2026: JioBlackRock renamed "Low Duration" -> "Ultra Short to Short Term" AND moved from
// direct-only to a Regular plan in the same month, so the name matched nothing and the monitor's
// inception (the Regular plan's launch, 2026-08-16) matched nothing either. But the AMC had
// exactly one unmatched scheme in that category on each side, which settles it.
// Deliberately strict: it fires only on 1-to-1, so a house launching a second fund in a category
// it also renamed falls through to "new" rather than being paired off by guesswork.
const cell = (a, s) => a + '\u0000' + s;
const freeOld = mfRecs.filter(f => !monNames.has(f.name) && !claimed.has(f.name));
const oldByCell = new Map(), newByCell = new Map();
for (const f of freeOld) { const k = cell(amc(f.name), f.sub_category); if (!oldByCell.has(k)) oldByCell.set(k, []); oldByCell.get(k).push(f); }
for (const m of leftover) { if (!m.sub) continue; const k = cell(amc(m.name), m.sub); if (!newByCell.has(k)) newByCell.set(k, []); newByCell.get(k).push(m); }
const pairedByCell = new Set();
for (const [k, news] of newByCell) {
  const olds = oldByCell.get(k);
  if (!olds || olds.length !== 1 || news.length !== 1) continue;
  renames.push({ from: olds[0].name, to: news[0].name, how: 'category', sub: olds[0].sub_category });
  claimed.add(olds[0].name);
  pairedByCell.add(news[0].name);
}
for (const m of leftover) if (!pairedByCell.has(m.name)) fresh.push(m);

// Renames already applied in an earlier run are recoverable from `prev_name` (and `prev_names`
// after a second rename), so a second run still reaches anything the first one missed (a sibling
// added later, say) instead of finding the old names gone and quietly doing nothing.
const historyOf = f => [...new Set([...(Array.isArray(f.prev_names) ? f.prev_names : []), ...(f.prev_name ? [f.prev_name] : [])])]
  .filter(h => h !== f.name);
const priorMap = new Map(), priorClash = new Set();
for (const f of master) for (const h of historyOf(f)) {
  if (priorMap.has(h) && priorMap.get(h) !== f.name) priorClash.add(h);
  priorMap.set(h, f.name);
}
if (priorMap.size) console.log(`already renamed: ${priorMap.size} (from prev_name — will be re-applied to the siblings)`);

const incRenames = renames.filter(r => r.how === 'inception');
console.log(`renames        : ${renames.length}  (${renames.filter(r => r.how === 'name').length} by name, ${incRenames.length} by inception+AMC, ${renames.filter(r => r.how === 'category').length} by AMC+category 1-to-1)`);
console.log(`ambiguous      : ${ambiguous.length}`);
console.log(`new to MASTER  : ${fresh.length}   (left for bake_month.js to add)\n`);
for (const r of renames) console.log(`   ${r.from}   ->   ${r.to}      [${r.sub} · ${r.how}]`);
if (ambiguous.length) {
  console.log('\n*** AMBIGUOUS — not renamed, resolve by hand: ***');
  for (const a of ambiguous) console.log(`   ${a.to}  [inc ${a.inception} · ${a.sheet}]  <-  ${JSON.stringify(a.from)}`);
}
if (priorClash.size) {
  console.log('\n*** an earlier name is claimed by more than one MASTER record — not used for the stores, resolve by hand: ***');
  for (const h of priorClash) console.log(`   ${h}  <-  ${JSON.stringify(master.filter(f => historyOf(f).includes(h)).map(f => f.name))}`);
}

// ---------- gates ----------
const fromSet = new Set(renames.map(r => r.from));
const toSet = new Set(renames.map(r => r.to));
if (fromSet.size !== renames.length) { console.error('\n*** a MASTER name is renamed twice — aborting'); process.exit(1); }
if (toSet.size !== renames.length) { console.error('\n*** two MASTER names map to one new name — aborting'); process.exit(1); }
for (const r of renames) {
  if (masterNames.has(r.to)) { console.error(`\n*** "${r.to}" already exists in MASTER — renaming "${r.from}" onto it would collide. Aborting.`); process.exit(1); }
}
console.log('\nGATE unique from/to: PASS');
console.log(`GATE no collision with an existing MASTER name: PASS`);

if (!renames.length && !priorMap.size) { console.log('\nnothing to rename.'); process.exit(0); }

// ---------- apply ----------
// MASTER takes only this run's renames. `prev_name` keeps the pre-SEBI name resolvable: an
// allocation sheet saved last month, or a hand-typed name off an older proposal, still lands on
// the right instrument. H.buildFundIndex indexes it behind the live name, so a current name always
// wins. A record renamed before keeps that history in `prev_names` (oldest first).
const rmap = new Map(renames.map(r => [r.from, r.to]));
const hits = { MASTER: 0 };
let chained = 0;
for (const f of master) {
  const t = rmap.get(f.name);
  if (!t) continue;
  const hist = historyOf(f);
  if (hist.length) { f.prev_names = [...hist, f.name]; chained++; }
  f.prev_name = f.name; f.name = t; hits.MASTER++;
}
if (chained) console.log(`\nrenamed again (prev_names now carries the full history): ${chained}`);

// The store map: every earlier name of a record -> its live name after this run, so an entry
// still under a name from two renames ago lands on the live name, not on the middle one. A name
// that is live in MASTER is never mapped away (a live name always wins over history).
const live = new Set(master.map(f => f.name));
const map = new Map();
for (const [h, cur] of priorMap) {
  if (priorClash.has(h)) continue;
  const t = rmap.get(cur) || cur;
  if (t !== h && !live.has(h)) map.set(h, t);
}
for (const [from, to] of rmap) if (!live.has(from)) map.set(from, to);

// Recency of an old name for a live name: its position in the record's history (newest last).
const histByLive = new Map(master.map(f => [f.name, historyOf(f)]));
const recency = (t, k) => (histByLive.get(t) || []).lastIndexOf(k);
const has = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
const dropped = [];

// Re-key one name-keyed store. An old-name key whose live name already has an entry is stale: the
// live-name entry wins and the old one is dropped (and reported). If several old names of one
// fund have entries and the live name has none, the most recent old name's entry moves and the
// older ones are dropped.
function rekey(label, store) {
  const winner = new Map();
  for (const k of Object.keys(store)) {
    const t = map.get(k);
    if (t === undefined || has(store, t)) continue;
    const w = winner.get(t);
    if (w === undefined || recency(t, k) > recency(t, w)) winner.set(t, k);
  }
  const out = {};
  let n = 0, d = 0;
  for (const k of Object.keys(store)) {
    const t = map.get(k);
    if (t === undefined) { out[k] = store[k]; continue; }
    if (winner.get(t) === k) { out[t] = store[k]; n++; continue; }
    dropped.push(`${label}  "${k}"  (live name "${t}" ${has(store, t) ? 'already has an entry' : 'took a more recent old name\'s entry'})`);
    d++;
  }
  return { out, n, d };
}

const updates = [];
const unreadable = [];
for (const prefix of ['window.EQUITY_ANALYTICS = ', 'window.HYBRID_ANALYTICS = ', 'window.DEBT_ANALYTICS = ',
                      'window.DIRECT_PERF = ', 'window.RISK_MATRIX = ', 'window.CENTRICITY_SELECT = ']) {
  let store;
  try { store = blocklib.locate(html, prefix).value; }
  catch (e) {
    console.log(`   (skipped ${prefix.trim()} — ${e.message})`);
    unreadable.push(prefix.trim() + ': ' + e.message);           // missing counts too: its keys would not be renamed
    continue;
  }
  const label = prefix.replace('window.', '').replace(' = ', '');
  const r = rekey(label, store);
  hits[label] = r.n;
  if (r.n || r.d) updates.push({ prefix, value: r.out });
}
if (hits.MASTER) updates.unshift({ prefix: 'window.MASTER = ', value: master });
console.log('\nkeys renamed per store:', JSON.stringify(hits));

const dupes = master.map(f => f.name).filter((n, i, a) => a.indexOf(n) !== i);
console.log(`GATE duplicate MASTER names after rename: ${dupes.length ? '*** FAIL ' + JSON.stringify(dupes.slice(0, 8)) : 'PASS (0)'}`);
if (dupes.length) process.exit(1);

// ---------- the siblings ----------
// These re-apply themselves on EVERY page load, keyed by exact MASTER name. Left un-renamed,
// Centricity_IRR_Offshore.js would silently stop matching 215 funds and they would lose their
// Expected-IRR band — which drives the proposal's future-value projection.
const SIBLINGS = [
  { file: 'Centricity_IRR_Offshore.js', prefix: 'var IRR = ' },
];
const outputs = [];
for (const s of SIBLINGS) {
  const p = path.join(path.dirname(HTML), s.file);
  if (!fs.existsSync(p)) { console.log(`   (skipped ${s.file} — not found)`); unreadable.push(s.file + ': file not found'); continue; }
  const text = fs.readFileSync(p, 'utf8');
  let store;
  try { store = blocklib.locate(text, s.prefix).value; }
  catch (e) {
    console.log(`   (skipped ${s.file} — ${e.message})`);
    unreadable.push(s.file + ': ' + e.message);
    continue;
  }
  const r = rekey(s.file, store);
  console.log(`${s.file} :: ${s.prefix.trim()} — ${r.n} key(s) renamed of ${Object.keys(store).length}`);
  if (r.n || r.d) outputs.push({ file: p, content: blocklib.spliceBlocks(text, [{ prefix: s.prefix, value: r.out }]) });
}

console.log(`\nstale old-name keys dropped (the live name already has an entry): ${dropped.length}`);
for (const x of dropped) console.log(`   - ${x}`);
console.log(`GATE every name-keyed store readable: ${unreadable.length ? '*** FAIL ' + unreadable.join(' | ') : 'PASS'}`);
if (unreadable.length) { console.error('\n*** a store could not be read — refusing to rename the others without it'); process.exit(1); }

if (updates.length) outputs.unshift({ file: HTML, content: blocklib.spliceBlocks(html, updates) });
const changed = outputs.map(o => path.basename(o.file));
if (!APPLY) {
  console.log(`\nfiles that would change: ${changed.length ? changed.join(', ') : 'none'}`);
  console.log('[dry run] pass --apply to write ' + path.basename(HTML) + ' + siblings');
  process.exit(0);
}
if (!outputs.length) { console.log('\nnothing changed — no file written'); process.exit(0); }
blocklib.writeFilesAtomic(outputs);
console.log('');
for (const o of outputs) console.log(`wrote ${path.basename(o.file)} (${o.content.length} bytes)`);

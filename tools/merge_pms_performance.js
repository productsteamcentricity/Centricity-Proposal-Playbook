// MONTHLY: rebuild window.PMS_PERFORMANCE.pms from PMS_Scheme_Performance_<Month Year>.xlsx.
// aif + benchmarks are carried forward verbatim — this file is PMS-only.
//
//   node tools/merge_pms_performance.js "<PMS_Scheme_Performance_<Month Year>.xlsx>" --as-on "31st October 2026" --html site/index.html [--apply]
//
// The dry run exits 1 when any gate failed, and --apply refuses on the same condition. --as-on must
// be a plain label ("31st October 2026"); it is written to DATA_DATES.pms and nowhere else.
//
// The July-2026 file arrived under a wholesale vendor rename ("ICICI - Value Strategy" became
// "ICICI Prudential - Value Portfolio" and so on), which silently broke 9 of the 16 alias pins.
// The `repin` entries of tools/data/pins.json re-point them by hand (the same file holds the
// pin_pms_alias.js pins, so a pin both tools share cannot drift apart). The map is maintained,
// not guessed, because a wrong pin puts another manager's numbers on a client's fund.
const fs = require('fs');
const XLSX = require('xlsx');
const B = require('./lib/blocklib');

const USAGE = 'Usage: node tools/merge_pms_performance.js "<PMS_Scheme_Performance_<Month Year>.xlsx>" --as-on "31st October 2026" --html site/index.html [--apply]';
const usage = msg => { if (msg) console.error(msg); console.error(USAGE); process.exit(2); };
const argv = process.argv.slice(2);
let APPLY = false, ASON = null, HTML = null, SRC = null;
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === '--apply') APPLY = true;
  else if (a === '--as-on' || a === '--html') {
    const v = argv[++i];
    if (v == null || v.startsWith('--')) usage(a + ' needs a value');
    if (a === '--as-on') ASON = v; else HTML = v;
  } else if (a.startsWith('--')) usage('unknown flag: ' + a);
  else if (SRC === null) SRC = a;
  else usage('unexpected extra argument: ' + a);
}
if (!SRC || !ASON || !HTML) usage();
try { B.checkAsOn(ASON, 'long'); } catch (e) { usage('*** ' + e.message); }

// Pin maps: tools/data/pins.json, shared with pin_pms_alias.js, merge_reckoner.js and
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
// MASTER PMS fund name -> exact scheme key in THIS month's file.
const REPIN = Object.fromEntries(Object.entries(loadPins().pms_alias).filter(([, e]) => e.repin).map(([m, e]) => [m, e.key]));

const MISSING = /^(|-|--|na|n\.?a\.?|#n\/a|undis\.?|nil\.?)$/i;
const raw = v => (v == null ? '' : String(v).trim());
function num(v) { const t = raw(v); if (MISSING.test(t)) return null; const n = parseFloat(t.replace(/,/g, '')); return isFinite(n) ? n : null; }
const pct = v => { const n = num(v); return n == null ? null : +(n / 100).toFixed(6); };
const plain = v => num(v);

const fmtRate = r => String(+r.toFixed(2)).replace(/\.0+$/, '');
const ord = i => i === 2 ? '2nd' : i === 3 ? '3rd' : i + 'th';
function mergeExitLoad(a, b, c) {
  if (a == null && b == null && c == null) return null;
  const r = [a, b, c].map(v => (v == null ? 0 : v));
  if (r.every(v => v === 0)) return 'Nil';
  let last = 2; while (last >= 0 && r[last] === 0) last--;
  const seg = []; let i = 0;
  while (i <= last) {
    let j = i; while (j + 1 <= last && r[j + 1] === r[i]) j++;
    let span;
    if (i === 0 && j === 0) span = 'for 1 year';
    else if (i === 0) span = 'for ' + (j + 1) + ' years';
    else if (i === j) span = 'for ' + ord(i + 1) + ' year';
    else span = 'for ' + ord(i + 1) + ' year & ' + ord(j + 1) + ' year';
    seg.push(fmtRate(r[i]) + '% ' + span);
    i = j + 1;
  }
  return seg.join(', ') + ', Nil thereafter';
}
// The year digit must stand alone: not part of a longer number ("12 months: 1%" used to read as
// "year 1: 2%") and not the decimals of a rate ("0.25%" used to read as "year 2: 5%"). Text where
// the digit stands alone ("1 Year: 3%", "Year 1 - 3%", "1yr:3%") parses exactly as before.
function parseExitLoadText(txt) {
  const t = raw(txt);
  if (!t || MISSING.test(t)) return null;
  const get = yr => { const m = t.match(new RegExp('(?<![0-9.])' + yr + '(?![0-9])\\s*(?:year|yr)?\\s*[:\\-]?\\s*([0-9]+(?:\\.[0-9]+)?)\\s*%?', 'i')); return m ? parseFloat(m[1]) : null; };
  const a = get('1'), b = get('2'), c = get('3');
  return (a == null && b == null && c == null) ? null : mergeExitLoad(a, b, c);
}

// Find the performance sheet by its HEADER, not its name. The vendor ships the same 33-column
// layout under different tab names — "PMS Performance" in one month's file, a bare "Sheet1" in
// the next. Keying on the name silently yielded zero schemes.
function pickSheet(wb) {
  for (const name of wb.SheetNames) {
    const r = XLSX.utils.sheet_to_json(wb.Sheets[name], { defval: null, raw: false });
    if (r.length && 'Scheme Name' in r[0] && 'Scheme Return 1 Year' in r[0]) {
      if (name !== 'PMS Performance') console.log('performance sheet found as "' + name + '" (not "PMS Performance")');
      return r;
    }
  }
  console.error('*** no sheet with a "Scheme Name" + "Scheme Return 1 Year" header — layout changed, aborting');
  process.exit(1);
}
const rows = pickSheet(XLSX.readFile(SRC));
const C = { name: 'Scheme Name', aum: 'AUM', pe: 'P/E Ratio', L: 'Large Cap', M: 'Mid Cap', S: 'Small Cap', el: 'Exit Load',
  r1m: 'Scheme Return 1 Month', r3m: 'Scheme Return 3 Month', r6m: 'Scheme Return 6 Month', r1y: 'Scheme Return 1 Year',
  r2y: 'Scheme Return 2 Year', r3y: 'Scheme Return 3 Year', r5y: 'Scheme Return 5 Year', si: 'Scheme Return Since Inception',
  sd1y: 'Standard Deviation 1 Year', sd3y: 'Standard Deviation 3 Year', sharpe1y: 'Sharpe Ratio 1 Year', sharpe3y: 'Sharpe Ratio 3 Year',
  sortino1y: 'Sortino Ratio 1 Year', sortino3y: 'Sortino Ratio 3 Year', alpha1y: 'Alpha 1 Year', alpha3y: 'Alpha 3 Year',
  beta1y: 'Beta 1 Year', beta3y: 'Beta 3 Year' };
for (const h of Object.values(C)) if (!(h in rows[0])) { console.error('*** column missing: ' + h); process.exit(1); }

// AUM units are decided for the COLUMN, not per row: the old per-row ">10 lakh" rule turned a
// genuine 7-lakh-rupee scheme into 700000 Cr.
const aums = rows.map(r => num(r[C.aum])).filter(v => v != null);
const inRupees = Math.max(...aums) > 1e8;
console.log(`AUM column treated as ${inRupees ? 'rupees (all / 1e7)' : 'crore (as-is)'} — max raw ${Math.max(...aums).toLocaleString('en-IN')}`);

const pms = {};
let empties = 0;
const dupeNames = [];
for (const r of rows) {
  const name = raw(r[C.name]); if (!name) continue;
  const rec = {}; const set = (k, v) => { if (v != null) rec[k] = v; };
  const a = num(r[C.aum]);
  if (a != null) set('aum', +(inRupees ? a / 1e7 : a).toFixed(2));
  const el = parseExitLoadText(r[C.el]); if (el) set('exit_load', el);
  for (const k of ['r1m','r3m','r6m','r1y','r2y','r3y','r5y','si','sd1y','sd3y','alpha1y','alpha3y']) set(k, pct(r[C[k]]));
  for (const k of ['sharpe1y','sharpe3y','sortino1y','sortino3y','beta1y','beta3y']) set(k, plain(r[C[k]]));
  set('pe', plain(r[C.pe]));
  const L = pct(r[C.L]), Mi = pct(r[C.M]), S = pct(r[C.S]);
  if (L != null && Mi != null && S != null) { set('mcap_large', L); set('mcap_mid', Mi); set('mcap_small', S); set('mcap_other', +Math.max(0, 1 - (L + Mi + S)).toFixed(6)); }
  if (!Object.keys(rec).length) { empties++; continue; }
  // A scheme can appear twice: once complete, once as a stub carrying a different AUM and no
  // returns (Axis Pure Contra Portfolio in the 03-Sep file). Plain last-wins let the stub blank
  // out real performance, so keep whichever row actually carries more data.
  const prev = pms[name];
  if (prev) {
    const fields = o => Object.keys(o).length;
    dupeNames.push(name + '  ' + fields(prev) + ' vs ' + fields(rec) + ' fields — kept the ' +
      (fields(rec) > fields(prev) ? 'later' : 'earlier'));
    if (fields(rec) <= fields(prev)) continue;
  }
  pms[name] = rec;
}
if (dupeNames.length) {
  console.log('\nduplicate scheme rows resolved by field count: ' + dupeNames.length);
  dupeNames.forEach(d => console.log('   ' + d));
}

const html = fs.readFileSync(HTML, 'utf8');
const cur = B.locate(html, 'window.PMS_PERFORMANCE = ').value;
const alias = B.locate(html, 'window.PMS_PERF_ALIAS = ').value;
const master = B.locate(html, 'window.MASTER = ').value;
const nextAlias = Object.assign({}, alias);
let repinned = 0;
for (const [m, k] of Object.entries(REPIN)) {
  if (!(m in alias)) { console.error(`*** REPIN target not in the alias map: "${m}"`); process.exit(1); }
  if (!pms[k]) { console.error(`*** REPIN key not in this file: "${k}"  (edit pms_alias in tools/data/pins.json with the owner)`); process.exit(1); }
  nextAlias[m] = k; repinned++;
}

console.log(`schemes: ${Object.keys(pms).length}  (name-only rows skipped: ${empties})`);
console.log(`pms ${Object.keys(cur.pms).length} -> ${Object.keys(pms).length}`);
console.log(`alias pins re-pointed: ${repinned}`);

const pmsFunds = master.filter(r => r.product_class === 'PMS');
const before = pmsFunds.filter(f => alias[f.name] && cur.pms[alias[f.name]]).length;
const after = pmsFunds.filter(f => nextAlias[f.name] && pms[nextAlias[f.name]]).length;
let fail = after < before;
console.log(`\nGATE MASTER PMS funds with performance: ${before} -> ${after} (of ${pmsFunds.length}): ${fail ? '*** FAIL fewer funds would have performance' : 'PASS'}`);
const bad = [];
for (const [k, v] of Object.entries(pms)) {
  for (const f of ['r1m','r3m','r6m','r1y','r2y','r3y','r5y','si','sd1y','sd3y','alpha1y','alpha3y'])
    if (v[f] != null && Math.abs(v[f]) > 10) bad.push(`${k}.${f}=${v[f]}`);
  if (v.aum != null && (v.aum < 0 || v.aum > 2e5)) bad.push(`${k}.aum=${v.aum}`);
}
console.log(`GATE values in range: ${bad.length ? '*** ' + bad.slice(0, 4).join(' | ') : 'PASS'}`);
if (bad.length) fail = true;
console.log(`GATE aif untouched: ${Object.keys(cur.aif).length} | benchmarks untouched: ${Object.keys(cur.benchmarks).length}`);

// Build the page in memory now, so a DATA_DATES problem shows in the dry run, not half-way
// through a write. setDataDate touches only the `pms` key inside window.DATA_DATES.
let out = null;
try {
  out = B.spliceBlocks(html, [
    { prefix: 'window.PMS_PERFORMANCE = ', value: { pms, aif: cur.aif, benchmarks: cur.benchmarks } },
    { prefix: 'window.PMS_PERF_ALIAS = ', value: nextAlias },
  ]);
  out = B.setDataDate(out, 'pms', ASON);
  console.log(`GATE DATA_DATES.pms set to "${ASON}": PASS`);
} catch (e) { console.log('GATE DATA_DATES.pms set: *** FAIL ' + e.message); fail = true; }

console.log('\nre-pointed pins now resolve to:');
for (const [m, k] of Object.entries(REPIN)) {
  const v = pms[k];
  console.log(`   ${m.padEnd(46)} 1Y ${v.r1y != null ? (v.r1y * 100).toFixed(2) + '%' : '—'}  AUM ${v.aum != null ? v.aum.toLocaleString('en-IN') + ' Cr' : '—'}`);
}
// Read from the alias map as it will be written, so the list can never go stale (KNOWN_ISSUES A18).
// The "file offers" names are hints for the owner, never applied: a null pin changes only by hand.
const words = s => String(s).toLowerCase().split(/[^a-z0-9]+/).filter(w => w.length >= 4 &&
  !['portfolio', 'fund', 'capital', 'strategy', 'management', 'advisors', 'investments', 'approach', 'scheme', 'plan'].includes(w));
const stillNull = Object.keys(nextAlias).filter(m => nextAlias[m] === null);
console.log('\nstill pinned null (' + stillNull.length + ', from PMS_PERF_ALIAS) — confirm with the owner before pinning any of these:');
for (const m of stillNull) {
  const w = words(m), need = Math.min(2, w.length);
  const offers = Object.keys(pms).map(k => [k, words(k).filter(x => w.includes(x)).length])
    .filter(([, n]) => need && n >= need).sort((x, y) => y[1] - x[1]).slice(0, 3).map(([k]) => '"' + k + '"');
  console.log(`   ${m}\n      ${offers.length ? 'file offers ' + offers.join(', ') : 'no clear counterpart in this file'}`);
}

if (!APPLY) { console.log('\n[dry run] pass --apply to write'); process.exit(fail ? 1 : 0); }
if (fail) { console.error('\n*** gate failed — refusing to write'); process.exit(1); }
B.writeFilesAtomic([{ file: HTML, content: out }]);
console.log(`\nWROTE ${HTML} — ${out.length} bytes; DATA_DATES.pms = "${ASON}"`);

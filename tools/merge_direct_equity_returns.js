// MONTHLY: join Listed Direct Equity returns onto the Direct Equity records in window.MASTER.
//
// Source is the RETURNS workbook ("Listed Direct equity_<date>.xlsx", ~8,400 rows, columns
// BRetSimplebse_<date>_3M/6M/1Y/2Y_CAGR/3Y_CAGR/5Y_CAGR) — NOT the sector/mcap workbook of a
// similar name in the Analytics folder, which has no returns in it at all.
//
// Source returns are in PERCENT units; MASTER stores decimals, so everything is /100.
// Join key is ISIN (MASTER carries `isin`), falling back to a normalised company name. Rows that
// repeat an ISIN or a name: the first row wins, and the repeats are counted and reported.
// For every matched stock the six tenors are replaced as a set: a tenor the file lacks is deleted.
//
// Usage:
//   node tools/merge_direct_equity_returns.js "<returns-workbook.xlsx>"           # dry run
//   node tools/merge_direct_equity_returns.js "<returns-workbook.xlsx>" --apply   # writes index.html
//   ... [--html <path to index.html>]   defaults to site/index.html (the dashboard)
//   ... [--allow-coverage-drop]         let --apply through a failed tenor-coverage gate (owner's call)
//
// The dry run prints the join statistics and the regression gates; always read it before
// passing --apply. A failed gate exits 1 (dry run or --apply), and --apply then writes nothing.
//
// Requires SheetJS: npm install xlsx@0.18.5
// Back up index.html first. The script refuses to write if the top-10-by-mktcap "Large Cap"
// regression gate fails, or if more than 5% of the matched stocks carrying any one tenor would
// lose it (unless --allow-coverage-drop), or if the output does not end with </html>.
// Baseline 30-Jun-2026: 5,257 Direct Equity records, 4,259 matched by ISIN + 271 by name,
// 727 unmatched (thinly traded small caps absent from the returns file — they show no
// return pills, which is correct).
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const B = require('./lib/blocklib.js');

const MAX_TENOR_DROP = 0.05;   // tenor-coverage gate: refuse when more than 5% of the matched stocks carrying a tenor lose it

function usage(msg) {
  if (msg) console.error(msg);
  console.error('Usage: node tools/merge_direct_equity_returns.js "<returns-workbook.xlsx>" [--apply] [--html <index.html>] [--allow-coverage-drop]');
  console.error('  The returns workbook is "Listed Direct equity_<date>.xlsx" — the ~8,400-row one,');
  console.error('  NOT the sector/mcap file of a similar name in the Analytics folder.');
  process.exit(2);
}
const argv = process.argv.slice(2);
let APPLY = false, SRC = null, HTML = null, ALLOW_DROP = false;
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === '--apply') { APPLY = true; continue; }
  if (a === '--allow-coverage-drop') { ALLOW_DROP = true; continue; }
  if (a === '--html') { HTML = argv[++i] || usage('--html needs a path'); continue; }
  if (a.startsWith('--')) usage(`unknown flag: ${a}`);
  if (SRC !== null) usage(`unexpected argument: ${a}`);
  SRC = a;
}
HTML = HTML || path.join(__dirname, '..', 'site', 'index.html');

if (!SRC) usage();
for (const [label, p] of [['returns workbook', SRC], ['index.html', HTML]]) {
  if (!fs.existsSync(p)) usage(`*** ${label} not found: ${p}`);
}
console.log(`returns workbook: ${SRC}`);
console.log(`target          : ${HTML}\n`);

// --- data hygiene: NBSP + doubled internal spaces are endemic in these source files ---
const clean = s => String(s == null ? '' : s)
  .replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
const normName = s => clean(s).toLowerCase()
  .replace(/[.,]/g, '').replace(/\s+(ltd|limited|inc|corp)\b/g, ' ltd').trim();

// --- 1. read the returns workbook ---
const wb = XLSX.readFile(SRC, { cellDates: false });
const ws = wb.Sheets[wb.SheetNames[0]];
// The 30-Sep-2026 file put three blank rows above the header, so find the header by content
// rather than assuming row 1 (which made every column "__EMPTY" and aborted the run).
const HDR = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' })
  .findIndex(r => r.some(c => /company\s*name/i.test(clean(c))));
if (HDR < 0) { console.error('*** no "Company Name" header row found'); process.exit(1); }
// The grid starts at the sheet's first used row; `range` takes an absolute row number.
const rows = XLSX.utils.sheet_to_json(ws, { defval: null, range: XLSX.utils.decode_range(ws['!ref']).s.r + HDR });
console.log(`source rows: ${rows.length}`);
console.log(`source columns: ${Object.keys(rows[0] || {}).slice(0, 12).join(' | ')}`);

// map the BRetSimplebse_<date>_<tenor> headers onto MASTER field names
const HEADERS = Object.keys(rows[0] || {});
const findCol = (suffix) => HEADERS.find(h =>
  new RegExp(`_${suffix}$`, 'i').test(h.replace(/\s+/g, '')));
const COLMAP = [
  ['r3m', findCol('3M')],
  ['r6m', findCol('6M')],
  ['r1y', findCol('1Y')],
  ['r2y', findCol('2Y_CAGR')],
  ['r3y', findCol('3Y_CAGR')],
  ['r5y', findCol('5Y_CAGR')],
];
const ISIN_COL = HEADERS.find(h => /isin/i.test(h));
const NAME_COL = HEADERS.find(h => /company\s*name/i.test(h));
console.log('column map:', COLMAP.map(([k, v]) => `${k}<-${v}`).join(', '));
console.log(`isin col: ${ISIN_COL} | name col: ${NAME_COL}`);
if (COLMAP.some(([, v]) => !v) || !ISIN_COL || !NAME_COL) {
  console.error('\n*** Column layout changed — aborting. Verify headers each month.');
  process.exit(1);
}

const num = v => {
  if (v == null || v === '') return null;
  const n = typeof v === 'number' ? v : parseFloat(String(v).replace(/[, %]/g, ''));
  if (!isFinite(n)) return null;
  return n;
};

const byIsin = new Map(), byName = new Map();
let srcWithAny = 0, outOfRange = 0;
const dupIsin = [], dupName = [];
for (const r of rows) {
  const rec = {};
  let any = false;
  for (const [field, col] of COLMAP) {
    const n = num(r[col]);
    if (n == null) continue;
    // sanity gate: a stock return outside -100%..+2000% is a source error, not a datapoint
    if (n < -100 || n > 2000) { outOfRange++; continue; }
    rec[field] = +(n / 100).toFixed(6);
    any = true;
  }
  if (!any) continue;
  srcWithAny++;
  // One policy for both keys: the first row carrying returns wins; repeats are reported.
  const isin = clean(r[ISIN_COL]).toUpperCase();
  if (isin) { if (byIsin.has(isin)) dupIsin.push(isin); else byIsin.set(isin, rec); }
  const nn = normName(r[NAME_COL]);
  if (nn) { if (byName.has(nn)) dupName.push(clean(r[NAME_COL])); else byName.set(nn, rec); }
}
console.log(`rows with >=1 return: ${srcWithAny}  (values rejected as out-of-range: ${outOfRange})`);
// A wholly empty return column means the vendor ran that tenor wrong (the first 30-Sep-2026 file
// dated its 5Y column 30Oct2026, a future date, and carried no 5Y at all). The join below deletes
// any field the file lacks, so writing it would wipe that return from every stock. Refuse instead.
// (A partly empty column is caught by the tenor-coverage gate further down.)
const emptyCols = COLMAP.filter(([, col]) => !rows.some(r => num(r[col]) != null)).map(([f, col]) => `${f} (${col})`);
if (emptyCols.length) {
  console.error(`\n*** return column(s) completely empty: ${emptyCols.join(', ')} — re-request the file; refusing to run.`);
  process.exit(1);
}
console.log(`unique ISINs: ${byIsin.size} | unique names: ${byName.size}`);
console.log(`repeated rows (first row kept): ISIN ${dupIsin.length} | name ${dupName.length}`);
if (dupIsin.length) console.log(`  repeated ISINs: ${dupIsin.slice(0, 6).join(' | ')}`);
if (dupName.length) console.log(`  repeated names: ${dupName.slice(0, 6).join(' | ')}`);

// --- 2. locate and parse the MASTER block ---
const html = fs.readFileSync(HTML, 'utf8');
const mB = B.locate(html, 'window.MASTER = ');
const master = mB.value;
console.log(`\nMASTER line ${html.slice(0, mB.s).split('\n').length}: ${master.length} records`);

// --- 3. join ---
let viaIsin = 0, viaName = 0, unmatched = 0, de = 0;
const misses = [];
const covBefore = {}, covAfter = {}, covLost = {};
for (const [field] of COLMAP) { covBefore[field] = 0; covAfter[field] = 0; covLost[field] = 0; }
for (const rec of master) {
  if (rec.product_class !== 'Direct Equity') continue;
  de++;
  let hit = null;
  const isin = clean(rec.isin).toUpperCase();
  if (isin && byIsin.has(isin)) { hit = byIsin.get(isin); viaIsin++; }
  else {
    const nn = normName(rec.name);
    if (byName.has(nn)) { hit = byName.get(nn); viaName++; }
  }
  if (!hit) { unmatched++; if (misses.length < 12) misses.push(rec.name); continue; }
  for (const [field] of COLMAP) {
    if (rec[field] != null) covBefore[field]++;
    if (hit[field] != null) covAfter[field]++;
    if (rec[field] != null && hit[field] == null) covLost[field]++;   // a return this join deletes
    if (hit[field] == null) delete rec[field];
    else rec[field] = hit[field];
  }
}
console.log(`Direct Equity records: ${de}`);
console.log(`  matched by ISIN : ${viaIsin}`);
console.log(`  matched by name : ${viaName}`);
console.log(`  unmatched       : ${unmatched}`);
if (misses.length) console.log(`  sample unmatched: ${misses.join(' | ')}`);

// --- 4. regression gates ---
let fail = false;
const deRecs = master.filter(r => r.product_class === 'Direct Equity');
const top10 = deRecs.filter(r => r.mktcap != null).sort((x, y) => y.mktcap - x.mktcap).slice(0, 10);
const mcapOk = top10.every(r => /large/i.test(String(r.sebi_mcap || '')));
console.log(`\nGATE top-10 by mktcap all "Large Cap": ${mcapOk ? 'PASS' : '*** FAIL ***'}`);
if (!mcapOk) { console.log('  ' + top10.map(r => `${r.name}=${r.sebi_mcap}`).join('\n  ')); fail = true; }

// Tenor coverage among the matched stocks, current block versus after this join. A partly
// populated tenor column (a vendor glitch) would otherwise blank that return for many stocks.
// The gate counts the stocks that LOSE a tenor, not the net change, so stocks gaining a tenor
// this month cannot hide the ones losing it.
const drops = [];
const covRows = COLMAP.map(([field]) => {
  const b = covBefore[field], a = covAfter[field], lost = covLost[field];
  const chg = b ? (a - b) / b : 0;
  if (b && lost / b > MAX_TENOR_DROP) drops.push(`${field} loses ${lost} of ${b} (${(lost / b * 100).toFixed(2)}%)`);
  return `    ${field.padEnd(5)} ${String(b).padStart(7)} ${String(a).padStart(7)}   ${((chg >= 0 ? '+' : '') + (chg * 100).toFixed(2) + '%').padStart(7)} ${String(lost).padStart(6)}`;
});
const covVerdict = !drops.length ? 'PASS'
  : ALLOW_DROP ? `OVERRIDDEN by --allow-coverage-drop — ${drops.join(', ')}`
  : `*** FAIL — ${drops.join(', ')} (re-request the file, or --allow-coverage-drop if the owner accepts it)`;
console.log(`GATE tenor coverage among matched stocks (max ${MAX_TENOR_DROP * 100}% losing a tenor): ${covVerdict}`);
console.log('    tenor  before   after    change   lost');
covRows.forEach(l => console.log(l));
if (drops.length && !ALLOW_DROP) fail = true;

const withRet = deRecs.filter(r => r.r1y != null || r.r3y != null).length;
console.log(`GATE Direct Equity with returns: ${withRet}`);
const sample = deRecs.find(r => r.name.startsWith('20 Microns'));
console.log('SAMPLE 20 Microns Ltd.:', JSON.stringify(sample));
// min/max by loop: spreading ~30k values into Math.min/max fails on large arrays.
let lo = Infinity, hi = -Infinity;
for (const r of deRecs) for (const [f] of COLMAP) { const v = r[f]; if (v != null) { if (v < lo) lo = v; if (v > hi) hi = v; } }
console.log(`GATE return range: min=${lo.toFixed(4)} max=${hi.toFixed(4)} (decimals)`);

// non-Direct-Equity records must be untouched
const mfSample = master.find(r => r.product_class === 'Mutual Fund');
console.log('CHECK an MF record still intact:', mfSample.name, JSON.stringify({ r1y: mfSample.r1y, r3y: mfSample.r3y }));

// --- 5. write ---
if (fail) { console.error(`\n*** regression gate failed — ${APPLY ? 'refusing to write' : 'dry run; --apply would refuse'}`); process.exit(1); }
if (!APPLY) { console.log('\n[dry run] pass --apply to write index.html'); process.exit(0); }
const size = B.writeBlocks(HTML, [{ prefix: 'window.MASTER = ', value: master }]);
console.log(`\nWROTE ${HTML} — ${size} bytes (was ${html.length})`);

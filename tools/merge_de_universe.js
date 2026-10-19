// MONTHLY: refresh the Direct Equity universe (sector / market cap / SEBI mcap bucket) in
// window.MASTER from "Listed Direct Equity_<Month>.xlsx" — the ~5,300-row Analytics file, NOT the
// returns file.
//
// sebi_mcap MUST be joined BY COMPANY NAME. Joining by row position shipped for ~8 months and
// mislabelled large caps as small caps in client-facing analytics. The regression gate below
// (top 10 by market cap must all read "Large Cap") exists to catch a repeat.
//
// Columns (matched by exact name, ignoring case and spaces; the header row is found by content in
// the first 30 rows): Company Name -> join key, CD_Sector -> sub_category,
// SC_Latest Market Cap -> mktcap, Mcap Allocation -> sebi_mcap. The file's industry column is not
// read: MASTER has no industry field. Companies in the file but not in MASTER are appended as new
// Direct Equity records; records missing from the file are left as they are.
//
// The join is by normalised company name only (the file has no ISIN), and this tool never renames
// a record. A renamed company therefore arrives as a "new listing" while its old record stays:
// set the two lists side by side and rename by hand under D26 (in place, stamping prev_name, only
// on strong evidence). A new listing that is an existing record's prev_name is flagged.
//
//   node tools/merge_de_universe.js "<Listed Direct Equity_<Month>.xlsx>" [--apply] [--html <index.html>]
//
// Dry run by default. A failed gate exits 1 (dry run or --apply), and --apply then writes nothing.
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const B = require('./lib/blocklib.js');

const USAGE = 'Usage: node tools/merge_de_universe.js "<Listed Direct Equity_<Month>.xlsx>" [--apply] [--html <index.html>]';
const usage = msg => { if (msg) console.error(msg); console.error(USAGE); process.exit(2); };
const argv = process.argv.slice(2);
let APPLY = false, SRC = null, HTML = null;
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === '--apply') { APPLY = true; continue; }
  if (a === '--html') { HTML = argv[++i] || usage('--html needs a path'); continue; }
  if (a.startsWith('--')) usage('unknown flag: ' + a);
  if (SRC !== null) usage('unexpected argument: ' + a);
  SRC = a;
}
HTML = HTML || path.join(__dirname, '..', 'site', 'index.html');
if (!SRC || !fs.existsSync(SRC)) usage(SRC ? '*** workbook not found: ' + SRC : null);
if (!fs.existsSync(HTML)) usage('*** index.html not found: ' + HTML);

const NBSP = String.fromCharCode(160);
const clean = s => String(s == null ? '' : s).split(NBSP).join(' ').replace(/\s+/g, ' ').trim();
const key = s => clean(s).toLowerCase().replace(/[.,]/g, '').replace(/\s+/g, ' ').trim();
const hkey = s => clean(s).toLowerCase().replace(/\s+/g, '');   // header names: ignore case and spaces

// ---- read the workbook once; find the header row by its column names ----
const COLS = { name: 'Company Name', sector: 'CD_Sector', mcap: 'SC_Latest Market Cap', bucket: 'Mcap Allocation' };
const wb = XLSX.readFile(SRC);
const ws = wb.Sheets[wb.SheetNames[0]];
const grid = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null, blankrows: true });
const want = Object.values(COLS).map(hkey);
const hdrAt = grid.slice(0, 30).findIndex(r => want.every(w => (r || []).some(c => hkey(c) === w)));
if (hdrAt < 0) {
  console.error(`*** no header row with ${Object.values(COLS).map(c => `"${c}"`).join(', ')} in the first 30 rows — column layout changed, aborting`);
  process.exit(1);
}
const hdrRow = XLSX.utils.decode_range(ws['!ref']).s.r + hdrAt;     // absolute sheet row
const rows = XLSX.utils.sheet_to_json(ws, { defval: null, range: hdrRow });
if (!rows.length) { console.error(`*** header on sheet row ${hdrRow + 1} but no data rows below it — aborting`); process.exit(1); }
const H = Object.keys(rows[0]);
const col = {};
for (const [k, name] of Object.entries(COLS)) {
  // Count in the raw header row too: SheetJS renames an exact repeat to "<name>_1", which H alone would miss.
  const n = Math.max(grid[hdrAt].filter(c => hkey(c) === hkey(name)).length, H.filter(h => hkey(h) === hkey(name)).length);
  if (n !== 1) { console.error(`*** column "${name}" found ${n} times in the header row — aborting`); process.exit(1); }
  col[k] = H.find(h => hkey(h) === hkey(name));
}
console.log(`source rows: ${rows.length}  (header on sheet row ${hdrRow + 1})`);
console.log(`columns: name=${col.name} | sector=${col.sector} | mktcap=${col.mcap} | bucket=${col.bucket}`);

const byName = new Map();
let dupSrc = 0;
for (const r of rows) {
  const n = clean(r[col.name]); if (!n) continue;
  const k = key(n);
  if (byName.has(k)) { dupSrc++; continue; }
  const mc = typeof r[col.mcap] === 'number' ? r[col.mcap] : parseFloat(String(r[col.mcap] || '').replace(/,/g, ''));
  byName.set(k, {
    name: n,
    sector: clean(r[col.sector]) || null,
    mktcap: isFinite(mc) ? mc : null,
    bucket: clean(r[col.bucket]) || null,
  });
}
console.log(`unique companies: ${byName.size}${dupSrc ? `  (${dupSrc} duplicate source row(s) ignored)` : ''}`);

const html = fs.readFileSync(HTML, 'utf8');
const master = B.locate(html, 'window.MASTER = ').value;
const de = master.filter(r => r.product_class === 'Direct Equity');
console.log(`\nMASTER ${master.length}; Direct Equity ${de.length}`);

let upSector = 0, upMcap = 0, upBucket = 0, matched = 0;
const missing = [];
for (const rec of de) {
  const hit = byName.get(key(rec.name));
  if (!hit) { missing.push(rec.name); continue; }
  matched++;
  if (hit.sector && hit.sector !== rec.sub_category) { rec.sub_category = hit.sector; upSector++; }
  if (hit.mktcap != null && hit.mktcap !== rec.mktcap) { rec.mktcap = hit.mktcap; upMcap++; }
  if (hit.bucket && hit.bucket !== rec.sebi_mcap) { rec.sebi_mcap = hit.bucket; upBucket++; }
}
console.log(`  matched by name : ${matched}`);
console.log(`  sector changed  : ${upSector}`);
console.log(`  mktcap changed  : ${upMcap}`);
console.log(`  mcap bucket chg : ${upBucket}`);
console.log(`  in MASTER but not in this month's file: ${missing.length} (left as-is, not deleted)`);
if (missing.length) console.log(`    sample: ${missing.slice(0, 6).join(' | ')}`);

// new listings
const haveKeys = new Set(de.map(r => key(r.name)));
const fresh = [...byName.values()].filter(v => !haveKeys.has(key(v.name)));
console.log(`  new listings in the file but not in MASTER: ${fresh.length}`);
if (fresh.length) console.log(`    sample: ${fresh.slice(0, 6).map(f => f.name).join(' | ')}`);
// A "new listing" that is a Direct Equity record's prev_name is a renamed company coming back under
// its old name: it would be added beside the renamed record. Reported for the owner (D26), not resolved.
const prevOf = new Map(de.filter(r => r.prev_name).map(r => [key(r.prev_name), r.name]));
const oldNames = fresh.filter(v => prevOf.has(key(v.name)));
if (oldNames.length) {
  console.log(`  ! new listings that are a renamed record's prev_name: ${oldNames.length} — check before --apply`);
  oldNames.slice(0, 6).forEach(v => console.log(`      ${v.name}  (now "${prevOf.get(key(v.name))}")`));
}
const lastDe = master.map(r => r.product_class).lastIndexOf('Direct Equity');
const built = fresh.map(v => ({
  name: v.name, asset_class: 'Equity', product_class: 'Direct Equity',
  sub_category: v.sector || 'Others', sebi_mcap: v.bucket || null, mktcap: v.mktcap, isin: null,
}));
const next = master.slice(0, lastDe + 1).concat(built, master.slice(lastDe + 1));

// ---- gates ----
let fail = false;
const deNext = next.filter(r => r.product_class === 'Direct Equity');
const top10 = deNext.filter(r => r.mktcap != null).sort((a, b) => b.mktcap - a.mktcap).slice(0, 10);
const ok = top10.every(r => /large/i.test(String(r.sebi_mcap || '')));
console.log(`\nGATE top-10 by market cap all "Large Cap": ${ok ? 'PASS' : '*** FAIL'}`);
top10.slice(0, 5).forEach(r => console.log(`    ${String(r.sebi_mcap).padEnd(10)} ${Math.round(r.mktcap).toLocaleString('en-IN').padStart(12)}  ${r.name}`));
if (!ok) fail = true;
const names = next.map(r => r.name);
const dupes = [...new Set(names.filter((n, k2) => names.indexOf(n) !== k2))];
console.log(`GATE duplicate names: ${dupes.length ? '*** FAIL ' + dupes.slice(0, 5).join(' | ') : 'PASS (0)'}`);
if (dupes.length) fail = true;
const buckets = {}; deNext.forEach(r => buckets[r.sebi_mcap] = (buckets[r.sebi_mcap] || 0) + 1);
console.log(`GATE mcap buckets: ${JSON.stringify(buckets)}`);
console.log(`GATE Direct Equity ${de.length} -> ${deNext.length};  MASTER ${master.length} -> ${next.length}`);

if (fail) { console.error(`\n*** gate failed — ${APPLY ? 'refusing to write' : 'dry run; --apply would refuse'}`); process.exit(1); }
if (!APPLY) { console.log('\n[dry run] pass --apply to write index.html'); process.exit(0); }
const size = B.writeBlocks(HTML, [{ prefix: 'window.MASTER = ', value: next }]);
console.log(`\nWROTE ${HTML} — ${size} bytes (was ${html.length})`);

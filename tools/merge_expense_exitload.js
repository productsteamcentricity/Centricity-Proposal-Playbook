// MONTHLY: refresh expense ratio and exit load.
//
// Expense workbook columns: Scheme Name | Base Expratio | Direct Plan Base Expratio |
// Direct Plan Ratio | Ratio.  "Ratio" is the total TER and is what MASTER.expense holds
// (verified: Aditya Birla SL Large Cap Fund-Reg(G) Ratio 1.68 == embedded expense 0.0168).
// The REGULAR row also carries "Direct Plan Ratio", so one row feeds both plans:
//   MASTER.expense        <- Ratio / 100
//   DIRECT_PERF[].expense <- Direct Plan Ratio / 100
// Exit Load workbook: Scheme Name | Remark (prose).
//
//   node tools/merge_expense_exitload.js --expense <x.xlsx> --exitload <y.xlsx> [--apply] [--html <index.html>]
//
// Either workbook may be left out, not both. Dry run by default. A failed gate exits 1 (dry run or
// --apply), and --apply then writes nothing. MASTER and DIRECT_PERF are written in one atomic write.
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const B = require('./lib/blocklib.js');

const USAGE = 'Usage: node tools/merge_expense_exitload.js --expense <x.xlsx> --exitload <y.xlsx> [--apply] [--html <index.html>]';
const usage = msg => { if (msg) console.error(msg); console.error(USAGE); process.exit(2); };
const argv = process.argv.slice(2);
let APPLY = false, EXP = null, EXIT = null, HTML = null;
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === '--apply') { APPLY = true; continue; }
  if (a === '--expense') { EXP = argv[++i] || usage('--expense needs a path'); continue; }
  if (a === '--exitload') { EXIT = argv[++i] || usage('--exitload needs a path'); continue; }
  if (a === '--html') { HTML = argv[++i] || usage('--html needs a path'); continue; }
  usage(a.startsWith('--') ? 'unknown flag: ' + a : 'unexpected argument: ' + a);
}
HTML = HTML || path.join(__dirname, '..', 'site', 'index.html');
if ((!EXP && !EXIT) || (EXP && !fs.existsSync(EXP)) || (EXIT && !fs.existsSync(EXIT))) usage();
if (!fs.existsSync(HTML)) usage('*** index.html not found: ' + HTML);

const NBSP = String.fromCharCode(160);
const tidy = s => String(s == null ? '' : s).split(NBSP).join(' ').replace(/\s+/g, ' ').trim();
const num = v => { if (v == null || v === '') return null; const n = typeof v === 'number' ? v : parseFloat(String(v).replace(/[,%\s]/g, '')); return isFinite(n) ? n : null; };
// "Nil" is a real answer (no exit load). ".", "NA", "No Option" and friends mean MISSING and
// must not overwrite good data with a placeholder.
const isMissing = s => { const t = tidy(s); return t === '' || /^(\.|-|--|na|n\.a\.?|n\/a|no option|not applicable)$/i.test(t); };

// Sep-2026 started shipping both workbooks with a " >>CTB Output" banner above the header, so
// the header row is found by content, not assumed to be row 1. Reading row 1 as the header made
// every 'Scheme Name' lookup undefined and the merge a silent no-op.
function readRows(file) {
  const wb = XLSX.readFile(file);
  const ws = wb.Sheets['Sheet1'] || wb.Sheets[wb.SheetNames[0]];
  const grid = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null });
  const hdr = grid.findIndex(r => (r || []).some(c => tidy(c) === 'Scheme Name'));
  if (hdr < 0) { console.error(`*** no "Scheme Name" header row in ${path.basename(file)}`); process.exit(1); }
  // The grid starts at the sheet's first used row; `range` takes an absolute row number.
  return XLSX.utils.sheet_to_json(ws, { defval: null, range: XLSX.utils.decode_range(ws['!ref']).s.r + hdr })
    .map(r => { const o = {}; for (const k of Object.keys(r)) o[tidy(k)] = r[k]; return o; });
}
let joined = 0;

const html = fs.readFileSync(HTML, 'utf8');
const mB = B.locate(html, 'window.MASTER = ');
const dB = B.locate(html, 'window.DIRECT_PERF = ');
const master = mB.value, direct = dB.value;
const MASTER_COUNT_BEFORE = master.length;     // read before anything below can touch the array
console.log(`MASTER ${master.length}; DIRECT_PERF ${Object.keys(direct).length}`);

const byName = new Map(master.map(r => [tidy(r.name), r]));
let expReg = 0, expDir = 0, expUnchanged = 0, expDirUnchanged = 0, xl = 0, xlSkipped = 0;
const badExp = [], badDir = [];

if (EXP) {
  const rows = readRows(EXP);
  console.log(`\nexpense rows: ${rows.length}`);
  for (const r of rows) {
    const nm = tidy(r['Scheme Name']);
    const rec = byName.get(nm);
    if (!rec) continue;
    joined++;
    const total = num(r['Ratio']);
    if (total != null) {
      // SEBI caps a plain equity MF around 2.25%, but SIF / long-short schemes in this universe
      // genuinely run 4-6%+, so the sanity bound is deliberately loose — it is here to catch a
      // unit error (a raw 168 instead of 1.68), not to second-guess the AMC.
      if (total < 0 || total > 8) { badExp.push(`${nm}=${total}`); }
      else {
        const v = +(total / 100).toFixed(6);
        if (rec.expense !== v) { rec.expense = v; expReg++; } else expUnchanged++;
      }
    }
    const dr = num(r['Direct Plan Ratio']);
    if (dr != null && (dr < 0 || dr > 8)) badDir.push(`${nm}=${dr}`);
    else if (dr != null && direct[rec.name]) {
      const v = +(dr / 100).toFixed(6);
      if (direct[rec.name].expense !== v) { direct[rec.name].expense = v; expDir++; } else expDirUnchanged++;
    }
  }
  const covered = master.filter(r => ['Mutual Fund', 'Index Fund', 'ETF'].includes(r.product_class));
  const withExp = covered.filter(r => r.expense != null).length;
  console.log(`  MASTER.expense updated      : ${expReg}  (unchanged ${expUnchanged})`);
  console.log(`  DIRECT_PERF.expense updated : ${expDir}  (unchanged ${expDirUnchanged})`);
  console.log(`  MF/Index/ETF carrying expense: ${withExp} / ${covered.length}`);
  if (badExp.length) console.log(`  ! rejected out-of-range (outside 0-8%): ${badExp.length} — ${badExp.slice(0, 4).join(', ')}`);
  if (badDir.length) console.log(`  ! Direct Plan Ratio rejected (outside 0-8%): ${badDir.length} — ${badDir.slice(0, 4).join(', ')}`);
}

if (EXIT) {
  const rows = readRows(EXIT);
  console.log(`\nexit-load rows: ${rows.length}`);
  const RCOL = Object.keys(rows[0] || {}).find(k => /remark/i.test(k)) || 'Remark';
  for (const r of rows) {
    const nm = tidy(r['Scheme Name']);
    const rec = byName.get(nm);
    if (!rec) continue;
    joined++;
    const raw = r[RCOL];
    if (isMissing(raw)) { xlSkipped++; continue; }   // placeholder, not data
    const v = tidy(raw);
    if (rec.exit_load !== v) { rec.exit_load = v; xl++; }
  }
  const covered = master.filter(r => ['Mutual Fund', 'Index Fund', 'ETF'].includes(r.product_class));
  console.log(`  MASTER.exit_load updated : ${xl}`);
  console.log(`  placeholder cells skipped: ${xlSkipped}  (".", "NA", "No Option" mean missing, not zero)`);
  console.log(`  MF/Index/ETF carrying exit load: ${covered.filter(r => r.exit_load).length} / ${covered.length}`);
}

// ---- gates ----
let fail = false;
let lo = Infinity, top = -Infinity;
for (const r of master) if (r.expense != null) { if (r.expense < lo) lo = r.expense; if (r.expense > top) top = r.expense; }
const hi = master.filter(r => r.expense > 0.04).map(r => `${r.name}=${(r.expense * 100).toFixed(2)}%`);
console.log(`\nGATE expense range: ${lo} .. ${top} (decimals)`);
if (top > 0.08) { console.log('  *** FAIL: an expense above 8% — likely a unit error'); fail = true; }
else console.log(`  above 4% (SIF / long-short, expected): ${hi.length}${hi.length ? ' — ' + hi.slice(0, 3).join(', ') : ''}`);
const names = master.map(r => r.name);
const dupes = names.filter((n, i) => names.indexOf(n) !== i);
console.log(`GATE duplicate names: ${dupes.length ? '*** FAIL' : 'PASS (0)'}`);
if (dupes.length) fail = true;
const countOk = master.length === MASTER_COUNT_BEFORE;
console.log(`GATE MASTER count unchanged: ${countOk ? 'PASS' : `*** FAIL (${MASTER_COUNT_BEFORE} -> ${master.length})`}`);
if (!countOk) fail = true;
console.log(`GATE source rows joined to MASTER: ${joined ? 'PASS (' + joined + ')' : '*** FAIL (0) — header or naming changed'}`);
if (!joined) fail = true;
const SAMPLE = 'Aditya Birla SL Large Cap Fund-Reg(G)';
const sample = master.find(r => r.name === SAMPLE);
if (sample) console.log(`SAMPLE ${sample.name}: expense=${sample.expense} exit_load="${sample.exit_load}" | Direct expense=${(direct[sample.name] || {}).expense}`);
else console.log(`SAMPLE skipped: ${SAMPLE} is not in MASTER`);

if (fail) { console.error(`\n*** gate failed — ${APPLY ? 'refusing to write' : 'dry run; --apply would refuse'}`); process.exit(1); }
if (!APPLY) { console.log('\n[dry run] pass --apply to write index.html'); process.exit(0); }
// Both blocks in one splice and one atomic write (blocklib splices from the end of the file backwards).
const size = B.writeBlocks(HTML, [
  { prefix: 'window.MASTER = ', value: master },
  { prefix: 'window.DIRECT_PERF = ', value: direct },
]);
console.log(`\nWROTE ${HTML} — ${size} bytes (was ${html.length})`);

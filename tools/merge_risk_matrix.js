// MONTHLY: refresh the Portfolio Matrix tab (window.RISK_MATRIX) from the pre-computed
// "Fund Risk Ratios & 3Y Rolling - All Funds (as on <date>).xlsx" workbook.
//
// There are two routes into RISK_MATRIX. This one ingests the vendor's pre-computed ratios and has
// been the production route since the Aug-2026 data (DECISIONS D43). The other, build_risk_matrix.py,
// derives everything from the raw NAV Data workbook and also emits `c` (3Y CAGR) and
// RISK_MATRIX_BENCH_SD, but it is not yet validated for production (KNOWN_ISSUES A22). This tool
// was written because the outgoing desk machine had no Python, and because the risk-ratios workbook
// now ships the full 1,088-fund universe rather than the sample it used to be.
//
// What this tool CAN and CANNOT set:
//   sets  -> be sd al so sh co ir dc rr   (every field the tab and the PPT slide actually render)
//   keeps -> bm                            (benchmark: the Data Flags sheet names it, else carried forward)
//   adds  -> fl                            (source reliability flag, only on flagged funds; see below)
//   drops -> c                             (3Y CAGR; absent from this workbook and read by nothing)
//
// `c` is deliberately NOT carried forward. It is unreferenced by any renderer (verified: the tab's
// COLS and the export's MCOLS are the same nine keys), so keeping last month's CAGR under this
// month's as-on date would be stale data wearing a fresh label for no benefit at all.
//
// `fl` (KNOWN_ISSUES C3) carries the Data Flags sheet's reliability warning onto the record:
//   "split"   the sheet reports a NAV split that makes the RISK STATS unreliable
//             ("split in NAV (3Y) — risk stats unreliable")
//   "lowcorr" the sheet reports low correlation to the mapped benchmark (beta < 0.30), which makes
//             the benchmark-relative ratios unreliable
// A fund flagged for both gets "split". NOT carried: a split flagged only as "Max Drawdown
// unreliable" (the page never shows Max Drawdown; Sep-2026 had 12 such funds) and short-history
// flags ("<250 days"), whose funds already show "—" for the stats they lack. Unflagged records get no `fl` key at all, so a
// month without flags writes byte-for-byte what the tool wrote before `fl` existed.
//
//   node tools/merge_risk_matrix.js "<Fund Risk Ratios & 3Y Rolling ....xlsx>" --as-on "31 Aug 2026" [--html site/index.html]
//   ... add --apply to write. Dry run prints the join tiers and the gates; always read them.
//   --as-on must be a plain short label ("31 Oct 2026"). Unknown flags are refused (exit 2).
//
// Requires: npm ci (xlsx 0.18.5)
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const blocklib = require('./lib/blocklib.js');

const USAGE = 'Usage: node tools/merge_risk_matrix.js "<Fund Risk Ratios ....xlsx>" --as-on "31 Aug 2026" [--html site/index.html] [--apply]';
const usage = msg => { if (msg) console.error('*** ' + msg); console.error(USAGE); process.exit(2); };

// Strict CLI: one positional source, the value flags below, and --apply. Anything else is refused.
const VALUE_FLAGS = ['--as-on', '--html'], BOOL_FLAGS = ['--apply'];
const opts = {}, positional = [];
{
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (VALUE_FLAGS.includes(a)) {
      if (i + 1 >= argv.length || argv[i + 1].startsWith('--')) usage(a + ' needs a value');
      if (a in opts) usage(a + ' given twice');
      opts[a] = argv[++i];
    } else if (BOOL_FLAGS.includes(a)) opts[a] = true;
    else if (a.startsWith('--')) usage('unknown flag ' + a);
    else positional.push(a);
  }
}
if (positional.length !== 1) usage(positional.length ? 'expected one source workbook, got ' + positional.length + ' positional arguments' : null);
const APPLY = !!opts['--apply'];
const HTML = opts['--html'] || path.join(__dirname, '..', 'site', 'index.html');
const SRC = positional[0];
if (!opts['--as-on']) usage('--as-on is required (e.g. --as-on "30 Sep 2026")');
let ASON;
// The label goes into a JavaScript string literal, so only a plain short date is accepted (A9).
try { ASON = blocklib.checkAsOn(opts['--as-on'], 'short'); } catch (e) { usage(e.message); }
if (!fs.existsSync(SRC)) { console.error('*** source not found: ' + SRC); process.exit(2); }
if (!fs.existsSync(HTML)) usage('page not found: ' + HTML);

// ---------- read the workbook ----------
const wb = XLSX.readFile(SRC);
const SHEET = wb.SheetNames.find(s => /risk\s*ratios/i.test(s));
if (!SHEET) { console.error('*** no "Risk Ratios" sheet; found: ' + wb.SheetNames.join(' | ')); process.exit(1); }

// Header sits below a title + methodology note; find it rather than pinning a row index.
const raw = XLSX.utils.sheet_to_json(wb.Sheets[SHEET], { header: 1, defval: null });
const hRow = raw.findIndex(r => r && String(r[0] || '').trim().toLowerCase() === 'fund name');
if (hRow < 0) { console.error('*** no "Fund Name" header row'); process.exit(1); }
const hdr = raw[hRow].map(h => String(h == null ? '' : h).trim());
const col = re => hdr.findIndex(h => re.test(h));

// Workbook column -> RISK_MATRIX key. CMV / Wt % / Rationale are portfolio-specific and ship blank.
const MAP = [
  ['be', /^beta$/i], ['sd', /^sd\b|std\s*dev/i], ['al', /^alpha$/i],
  ['so', /^sortino$/i], ['sh', /^sharpe$/i], ['co', /^corr/i],
  ['ir', /^info/i], ['dc', /^down\s*cap/i], ['rr', /^3y\s*rolling/i],
];
const idx = {};
for (const [k, re] of MAP) {
  const i = col(re);
  if (i < 0) { console.error(`*** column for "${k}" not found in: ${hdr.join(' | ')}`); process.exit(1); }
  idx[k] = i;
}
console.log(`sheet     : ${SHEET}`);
console.log(`columns   : ${MAP.map(([k]) => k + '=' + hdr[idx[k]]).join('  ')}`);

// A dash means "fewer than 250 NAV days in the window" — missing, not zero.
const num = v => {
  if (v == null || v === '' || v === '-' || v === '—') return null;
  const n = Number(v);
  return isFinite(n) ? n : null;
};

// Accord's methodology paragraph sits in the name column below the data; skip prose.
const rows = raw.slice(hRow + 1)
  .filter(r => r && r[0] != null && String(r[0]).trim() !== '' && String(r[0]).trim().length <= 120);
console.log(`data rows : ${rows.length}`);

// Benchmark and data flag per fund, where the Data Flags tab names them.
const flagSheet = wb.SheetNames.find(s => /data\s*flags/i.test(s));
const bmFromFlags = new Map(), flagOf = new Map();
if (flagSheet) {
  const fr = XLSX.utils.sheet_to_json(wb.Sheets[flagSheet], { header: 1, defval: null });
  const fh = fr.findIndex(r => r && String(r[0] || '').trim().toLowerCase() === 'fund name');
  if (fh >= 0) {
    const fhdr = fr[fh].map(h => String(h == null ? '' : h).trim());
    const ci = { bm: fhdr.findIndex(h => /benchmark/i.test(h)), fl: fhdr.findIndex(h => /flag/i.test(h)) };
    for (const r of fr.slice(fh + 1)) {
      if (!r || !r[0]) continue;
      const n = String(r[0]).trim();
      if (ci.bm >= 0 && r[ci.bm]) bmFromFlags.set(n, String(r[ci.bm]).trim());
      if (ci.fl >= 0 && r[ci.fl]) flagOf.set(n, String(r[ci.fl]).trim());
    }
  } else console.log('WARN "Data Flags" sheet has no "Fund Name" header row: no flags or benchmarks read from it');
} else console.log('WARN no "Data Flags" sheet: no reliability flags carried; benchmarks come from the existing block');
console.log(`data flags: ${flagOf.size} fund(s) flagged`);

// Reliability flag carried onto RISK_MATRIX as `fl` (C3). A split outranks low correlation; a split
// that only affects Max Drawdown (not shown on the page) and a short-history flag are not carried.
const reliability = text =>
  /\bsplit\b[^;]*\brisk stats unreliable\b/i.test(text) ? 'split'
    : (/\blow\s*correlation\b/i.test(text) ? 'lowcorr' : null);
const mddOnly = [...flagOf.values()].filter(t => /\bsplit\b/i.test(t) && !reliability(t)).length;
const relOf = new Map();
for (const [n, t] of flagOf) { const r = reliability(t); if (r) relOf.set(n, r); }
const relCount = k => [...relOf.values()].filter(v => v === k).length;
console.log(`  reliability: split=${relCount('split')}  lowcorr=${relCount('lowcorr')}  (not carried: ${mddOnly} split affecting Max Drawdown only, which the page does not show; ${flagOf.size - relOf.size - mddOnly} other, e.g. short history)`);

// ---------- join to MASTER ----------
const PAGE = fs.readFileSync(HTML, 'utf8');
const MASTER = blocklib.locate(PAGE, 'window.MASTER = ').value;
const OLD = blocklib.locate(PAGE, 'window.RISK_MATRIX = ').value;
const liveName = new Set(MASTER.map(f => f.name));
const byPrev = new Map();
for (const f of MASTER) if (f.prev_name && !byPrev.has(f.prev_name)) byPrev.set(f.prev_name, f.name);

// Plan/option suffix whitelist ONLY (A15). The parenthetical markers stripped are exactly "(G)",
// "(D)" (the Monitor's old dividend marker), "(Growth)", "(IDCW…)" and "(Dividend…)", e.g.
// "(IDCW Payout)". Anything else — "(Debt)", "(Delhi)", "(Gujarat)", "(Inbound)", "(OneDigital)",
// "(Lock in)" — distinguishes a genuinely different instrument and must survive.
const baseName = s => String(s || '')
  .replace(/\u00a0/g, ' ')
  .replace(/\((?:G|D|Growth|IDCW\b[^()]*|Dividend\b[^()]*)\)/gi, '')
  .replace(/-\s*(?:Reg|Dir|Direct)(?:ular)?\s*Plan\b/gi, '')
  .replace(/-\s*(?:Reg|Dir)\b/gi, '')
  .replace(/\bDirect\s*Plan\b/gi, '')
  .replace(/\s+/g, ' ').trim().toLowerCase();

// Base name -> live MASTER names, preferring a Growth/Regular row when several options exist.
const byBase = new Map();
for (const f of MASTER) {
  const b = baseName(f.name);
  if (!b) continue;
  if (!byBase.has(b)) byBase.set(b, []);
  byBase.get(b).push(f.name);
  const p = f.prev_name && baseName(f.prev_name);
  if (p && p !== b) { if (!byBase.has(p)) byBase.set(p, []); byBase.get(p).push(f.name); }
}
const preferGrowthReg = names => {
  const uniq = [...new Set(names)];
  if (uniq.length === 1) return uniq;
  const g = uniq.filter(n => /\(G\)/i.test(n));
  const gr = g.filter(n => /-Reg\(G\)|^(?!.*Direct)/i.test(n));
  return (gr.length ? gr : (g.length ? g : uniq));
};

const tiers = { exact: 0, prev: 0, base: 0 };
const NEW = {};
const unmatched = [], ambiguous = [], collisions = [];

for (const r of rows) {
  const nm = String(r[0]).trim();
  let target = null;
  if (liveName.has(nm)) { target = nm; tiers.exact++; }
  else if (byPrev.has(nm)) { target = byPrev.get(nm); tiers.prev++; }
  else {
    const cands = preferGrowthReg(byBase.get(baseName(nm)) || []);
    if (cands.length === 1) { target = cands[0]; tiers.base++; }
    else if (cands.length > 1) { ambiguous.push(nm + '  -> ' + cands.slice(0, 3).join(' | ')); continue; }
    else { unmatched.push(nm); continue; }
  }

  const rec = {};
  for (const [k] of MAP) { const v = num(r[idx[k]]); if (v != null) rec[k] = v; }
  // Benchmark: the flags tab names it for flagged funds; otherwise it is a per-category constant
  // that has not changed, so the existing block is a safe carry-forward.
  const bm = bmFromFlags.get(nm) || (OLD[target] && OLD[target].bm) || null;
  if (bm) rec.bm = bm;
  // Reliability flag, joined through the same workbook row (so the same tier) as the metrics.
  const fl = relOf.get(nm);
  if (fl) rec.fl = fl;

  if (NEW[target]) { collisions.push(nm + ' -> ' + target); continue; }
  NEW[target] = rec;
}

const withMetrics = Object.values(NEW).filter(v => v.be != null).length;
const withRolling = Object.values(NEW).filter(v => v.rr != null).length;
const withBm = Object.values(NEW).filter(v => v.bm).length;

console.log(`\njoin tiers: exact=${tiers.exact}  prev_name=${tiers.prev}  plan-base=${tiers.base}`);
console.log(`unmatched : ${unmatched.length}${unmatched.length ? '  ' + unmatched.slice(0, 8).join(' | ') : ''}`);
console.log(`ambiguous : ${ambiguous.length}  (reported, never guessed)`);
ambiguous.slice(0, 8).forEach(a => console.log('   ? ' + a));
console.log(`collisions: ${collisions.length}${collisions.length ? '  ' + collisions.slice(0, 5).join(' | ') : ''}`);

const oldVals = Object.values(OLD);
const flCount = (vals, k) => vals.filter(v => v.fl === k).length;
console.log(`\nRISK_MATRIX : ${Object.keys(OLD).length} -> ${Object.keys(NEW).length}`);
console.log(`  with metrics (be): ${oldVals.filter(v => v.be != null).length} -> ${withMetrics}`);
console.log(`  with rolling (rr): ${oldVals.filter(v => v.rr != null).length} -> ${withRolling}`);
console.log(`  with benchmark   : ${oldVals.filter(v => v.bm).length} -> ${withBm}`);
console.log(`  flagged split    : ${flCount(oldVals, 'split')} -> ${flCount(Object.values(NEW), 'split')}`);
console.log(`  flagged lowcorr  : ${flCount(oldVals, 'lowcorr')} -> ${flCount(Object.values(NEW), 'lowcorr')}`);
console.log(`  dropped 'c' (3Y CAGR, unread): ${oldVals.filter(v => v.c != null).length} -> 0`);
// A reliability flag that did not reach a record: its fund has no row on the ratios sheet, or the
// row was unmatched, ambiguous or a collision (each reported above).
const flagLost = [...relOf.keys()].filter(n => !rows.some(r => String(r[0]).trim() === n) ||
  unmatched.includes(n) || ambiguous.some(a => a.startsWith(n + '  -> ')) || collisions.some(c => c.startsWith(n + ' -> ')));
console.log(`  reliability flags not carried (fund not joined): ${flagLost.length}${flagLost.length ? '  ' + flagLost.slice(0, 5).join(' | ') : ''}`);

// ---------- build the new page in memory ----------
// `riskMatrix` is NOT a key of the pretty-printed `window.DATA_DATES = {…}` object near the top of
// the page — it is assigned on its own line just after the matrix block, which is why this is a
// targeted line rewrite rather than a blocklib splice. (blocklib parses JSON; that object is
// hand-formatted and would not round-trip.) The rewrite is anchored to the start of that line and
// must match exactly once in the whole page (A9); the label was validated above, so it cannot
// break out of the string literal.
let html = blocklib.spliceBlocks(PAGE, [{ prefix: 'window.RISK_MATRIX = ', value: NEW }]);
const DATE_RE = /^window\.DATA_DATES\.riskMatrix = (['"])([^'"\n]*)\1;/m;
const dateHits = (html.match(new RegExp(DATE_RE.source, 'gm')) || []).length;
const was = dateHits === 1 ? DATE_RE.exec(html)[2] : null;
if (dateHits === 1) html = blocklib.replaceOnce(html, DATE_RE, `window.DATA_DATES.riskMatrix = '${ASON}';`, 'DATA_DATES.riskMatrix line');

// ---------- gates ----------
const notInMaster = Object.keys(NEW).filter(k => !liveName.has(k));
const gates = [
  ['every key exists in MASTER', notInMaster.length === 0, notInMaster.slice(0, 5).join(' | ')],
  ['no ambiguous joins', ambiguous.length === 0, ambiguous.length + ' ambiguous'],
  ['no join collisions', collisions.length === 0, collisions.length + ' collisions'],
  ['fund count did not shrink', Object.keys(NEW).length >= Object.keys(OLD).length, ''],
  ['funds with metrics did not shrink', withMetrics >= oldVals.filter(v => v.be != null).length, ''],
  ['benchmark coverage complete', withBm === Object.keys(NEW).length, (Object.keys(NEW).length - withBm) + ' missing bm'],
  ['DATA_DATES.riskMatrix line found exactly once', dateHits === 1, dateHits + ' matches'],
  ['page still ends with </html>', html.trimEnd().endsWith('</html>'), ''],
];
console.log('');
let pass = true;
for (const [label, ok, detail] of gates) {
  console.log(`GATE ${label}: ${ok ? 'PASS' : '*** FAIL'}${ok || !detail ? '' : '  ' + detail}`);
  if (!ok) pass = false;
}
if (!pass) { console.error('\n*** gates failed — not writing'); process.exit(1); }

if (!APPLY) { console.log(`\n[dry run] DATA_DATES.riskMatrix would go "${was}" -> "${ASON}"; pass --apply to write ` + path.basename(HTML)); process.exit(0); }

// One atomic write: the matrix and its date land together or not at all (A8).
blocklib.writeFilesAtomic([{ file: HTML, content: html }]);
console.log(`\nwrote ${path.basename(HTML)} (${html.length} bytes)`);
console.log(`DATA_DATES.riskMatrix: "${was}" -> "${ASON}"`);

// Monthly bake: run index.html's OWN parsers over this month's workbooks in a Node vm sandbox,
// then write the resulting globals back into the embedded blocks. Reusing the page's parsers
// means the baked analytics and MASTER data are identical to what the Section 7 uploader would
// produce. DIRECT_PERF is the exception: it comes from the shared tool builder in
// tools/lib/direct_perf.js (KNOWN_ISSUES A7), which rebuild_directperf.js also uses.
//
// The five sibling override files are deliberately NOT executed: they mutate MASTER at runtime
// on every page load, so the baseline block must stay pre-sibling or their edits would be
// baked in and then re-applied on top.
//
//   node tools/bake_month.js --dir "<month folder>" --as-on "31st July 2026" [--as-on-analytics "..."] [--html site/index.html] [--apply]
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const XLSX = require('xlsx');
const B = require('./lib/blocklib');
const { buildDirectPerf } = require('./lib/direct_perf');

const USAGE = 'Usage: node tools/bake_month.js --dir "<month folder>" --as-on "31st July 2026" [--as-on-analytics "..."] [--html site/index.html] [--apply]';
const argv = process.argv.slice(2);
const unknown = argv.filter(a => a.startsWith('--') && !['--dir', '--as-on', '--as-on-analytics', '--html', '--apply'].includes(a));
if (unknown.length) { console.error(`unknown option(s): ${unknown.join(' ')}\n${USAGE}`); process.exit(2); }
// A value flag needs a value, and a word that belongs to no flag is a mistake, not something to ignore.
const VALUED = ['--dir', '--as-on', '--as-on-analytics', '--html'];
for (const f of VALUED) { const i = argv.indexOf(f); if (i >= 0 && (argv[i + 1] == null || argv[i + 1].startsWith('--'))) { console.error(`${f} needs a value\n${USAGE}`); process.exit(2); } }
const stray = argv.filter((a, i) => !a.startsWith('--') && !VALUED.includes(argv[i - 1]));
if (stray.length) { console.error(`unexpected argument(s): ${stray.join(' ')}\n${USAGE}`); process.exit(2); }
const flag = n => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : null; };
const APPLY = argv.includes('--apply');
const DIR = flag('--dir');            // month folder
const ASON = flag('--as-on');         // e.g. "31st July 2026"
const ASON_AN = flag('--as-on-analytics') || ASON;
const HTML = flag('--html') || path.join(__dirname, '..', 'site', 'index.html');
if (!DIR || !ASON) { console.error(USAGE); process.exit(2); }
// Both labels are pasted into DATA_DATES string literals: plain dates only (A9).
for (const [label, flagName] of [[ASON, '--as-on'], [ASON_AN, '--as-on-analytics']]) {
  try { B.checkAsOn(label, 'long'); } catch (e) { console.error('*** ' + e.message.replace(/^--as-on /, flagName + ' ')); process.exit(2); }
}

// One file per stem. A duplicate download such as "… (1).xlsx" must never be baked silently, and
// a missing folder is an input error, not a crash (A17).
function pickOne(dir, test, key) {
  let names;
  try { names = fs.readdirSync(dir); }
  catch (e) { console.error(`*** cannot read the folder for "${key}": ${dir} (${e.code || e.message})`); process.exit(2); }
  const hits = names.filter(test);
  if (hits.length > 1) {
    console.error(`*** ${hits.length} files match "${key}" in ${dir} — keep exactly one:`);
    hits.forEach(h => console.error(`      ${h}`));
    process.exit(2);
  }
  return hits.length ? path.join(dir, hits[0]) : '';
}
const AN = path.join(DIR, 'Analytics');
const P = {
  eq:   pickOne(AN, f => /^Equity Analytics_/i.test(f), 'eq'),
  hy:   pickOne(AN, f => /^Hybrid Analytics_/i.test(f), 'hy'),
  db:   pickOne(AN, f => /^Debt Analytics_/i.test(f), 'db'),
  // Regular monitor = anything but the Direct one. The file name drifts month to month
  // ("Daily MF monitor_30th June 2026", "Daily MF Monitor as on 31st August 2026"), so match
  // the stem and exclude "_Direct" rather than pinning a separator. Not \b: "_" is a word
  // character, so "monitor_30th" has no boundary after "monitor" (Sep-2026 silently missed it).
  reg:  pickOne(DIR, f => /^Daily MF ?monitor(?![a-z])/i.test(f) && !/_Direct/i.test(f), 'reg'),
  dir:  pickOne(DIR, f => /^Daily MF Monitor_Direct/i.test(f), 'dir'),
};
for (const [k, v] of Object.entries(P)) {
  if (!v || !fs.existsSync(v) || !fs.statSync(v).isFile()) { console.error(`*** missing source for "${k}": ${v || 'no matching file in ' + (k === 'reg' || k === 'dir' ? DIR : AN)}`); process.exit(2); }
  console.log(`${k.padEnd(5)} <- ${path.basename(v)}`);
}
console.log('');

// ---------- sandbox: run the baseline data + helper + parser blocks ----------
const html = fs.readFileSync(HTML, 'utf8');
const blocks = [];
{
  const re = /<script\b([^>]*)>/gi; let m;
  while ((m = re.exec(html)) !== null) {
    const src = /\bsrc\s*=\s*"([^"]+)"/i.exec(m[1]);
    const s = m.index + m[0].length;
    const c = html.indexOf('</script>', s);
    const e = c === -1 ? html.length : c;
    blocks.push({ src: src ? src[1] : null, body: src ? '' : html.slice(s, e) });
    re.lastIndex = e;
  }
}
const sandbox = {
  console, JSON, Math, Object, Array, String, Number, Boolean, Date, RegExp, Map, Set, Promise,
  parseFloat, parseInt, isNaN, isFinite, XLSX, Error, TypeError, Symbol, ArrayBuffer, Uint8Array,
  setTimeout, clearTimeout,
  document: { getElementById: () => null, querySelector: () => null, querySelectorAll: () => [],
    createElement: () => ({ style: {}, appendChild() {}, setAttribute() {} }), addEventListener() {},
    head: { appendChild() {} }, body: { appendChild() {} } },
};
sandbox.window = {}; sandbox.globalThis = sandbox; sandbox.window.document = sandbox.document;
vm.createContext(sandbox);
// The UI blocks stop at the first use of a CDN library the sandbox does not load; that is expected.
// Any OTHER error means a data or parser block did not run, so the bake would work on a partial
// page: it is reported and fails the sandbox gate (A23).
const CDN_GLOBAL = /^(React|ReactDOM|Chart|XLSX|PptxGenJS) is not defined$/;
const blockErrors = [];
let ran = 0, skipped = 0;
for (const b of blocks) {
  if (b.src) { skipped++; continue; }                                  // CDN + the five siblings
  if (/ReactDOM\.createRoot/.test(b.body)) { skipped++; continue; }
  try { vm.runInContext(b.body, sandbox, { timeout: 120000 }); ran++; }
  catch (e) {
    skipped++;
    if (!CDN_GLOBAL.test(e.message)) { blockErrors.push(e.message); console.log(`  *** inline block error: ${e.message.slice(0, 160)}`); }
  }
}
const W = sandbox.window;
console.log(`sandbox: ran ${ran} inline blocks, skipped ${skipped} (siblings + UI)\n`);
if (!W.REFRESH) { console.error('*** window.REFRESH not available'); process.exit(1); }

const fileOf = p => ({ name: path.basename(p), arrayBuffer: async () => fs.readFileSync(p) });
const snap = () => ({
  MASTER: W.MASTER.length, EQ: Object.keys(W.EQUITY_ANALYTICS).length,
  HY: Object.keys(W.HYBRID_ANALYTICS).length, DB: Object.keys(W.DEBT_ANALYTICS).length,
  DP: Object.keys(W.DIRECT_PERF || {}).length, BM: Object.keys(W.MF_BENCHMARK_PERF || {}).length,
});
const before = snap();
console.log('BEFORE:', JSON.stringify(before));

(async () => {
  // ---------- 1. analytics ----------
  const eqBefore = new Set(Object.keys(W.EQUITY_ANALYTICS));
  for (const [kind, p] of [['equity', P.eq], ['hybrid', P.hy], ['debt', P.db]]) {
    const r = await W.REFRESH.parseAnalytics(fileOf(p), kind);
    console.log(`  parseAnalytics(${kind}): ${r.ok ? r.message : 'FAILED ' + r.error}`);
    if (!r.ok) process.exit(1);
  }
  // parseAnalytics MERGES, so a scheme present last month but absent from this month's workbook
  // keeps last month's holdings under this month's label. Surface those explicitly, split by
  // whether the MF analytics workbook is even supposed to cover them (PMS/AIF come from a
  // separate file).
  const monthSchemes = schemeNames(P.eq);
  const pcByName = new Map(W.MASTER.map(r => [r.name, r.product_class]));
  const notInMonth = [...eqBefore].filter(k => !monthSchemes.has(k));
  const mfStale = notInMonth.filter(k => ['Mutual Fund', 'Index Fund', 'ETF'].includes(pcByName.get(k)));
  const otherStale = notInMonth.filter(k => !mfStale.includes(k));
  console.log(`  equity analytics: ${before.EQ} -> ${Object.keys(W.EQUITY_ANALYTICS).length}  (this month's file covered ${monthSchemes.size} schemes)`);
  console.log(`    not in this month's workbook: ${notInMonth.length}  =  ${mfStale.length} MF/Index/ETF (STALE - still last month's holdings) + ${otherStale.length} PMS/AIF/other (expected; different source file)`);
  if (mfStale.length) mfStale.slice(0, 12).forEach(n => console.log(`      ! ${n}`));

  // ---------- 2. MF Monitor — Regular ----------
  const mBefore = new Set(W.MASTER.map(r => r.name));
  const r1 = await W.REFRESH.parseMfMonitor(fileOf(P.reg), { asOn: ASON });
  console.log(`  parseMfMonitor(Regular): ${r1.ok ? r1.message : 'FAILED ' + r1.error}`);
  if (!r1.ok) process.exit(1);
  const added = W.MASTER.filter(r => !mBefore.has(r.name)).map(r => r.name);
  if (added.length) { console.log(`  NEW funds added to MASTER (${added.length}):`); added.forEach(n => console.log(`      + ${n}`)); }
  // The parser alone knows which sheets are mapped and which only refresh (KNOWN_ISSUES C19, D80);
  // this tool reads what it reports and never keeps a second copy of the sheet lists.
  const skippedRows = Array.isArray(r1.skipped) ? r1.skipped : [];
  if (skippedRows.length) {
    console.log(`  refresh-only rows not merged (${skippedRows.length}) — a new fund or a pending rename is added to MASTER by hand, never from these sheets:`);
    skippedRows.forEach(s => console.log(`      ~ [${s.sheet.trim()}] ${s.name}   (${s.reason})`));
  }
  (Array.isArray(r1.emptySheets) ? r1.emptySheets : []).forEach(s =>
    console.log(`  WARN expected Monitor sheet missing or with no fund rows: "${s}" — renamed by the desk, or its header moved?`));
  // Funds in MASTER that this Monitor does not list at all keep last month's figures (C19's symptom).
  if (Array.isArray(r1.monitorNames)) {
    const onMonitor = new Set(r1.monitorNames);
    const MF_CLASSES = new Set(['Mutual Fund', 'Mutual Funds', 'ETF', 'Index Fund']);
    const notListed = W.MASTER.filter(r => MF_CLASSES.has(r.product_class) && !onMonitor.has(r.name));
    console.log(`  CHECK MASTER MF/ETF funds on no sheet of this Monitor (kept as they are): ${notListed.length}`);
    notListed.slice(0, 12).forEach(r => console.log(`      - ${r.name}   [${r.product_class} / ${r.sub_category}]`));
    if (notListed.length > 12) console.log(`      ... +${notListed.length - 12} more`);
  }

  // ---------- 3. MF Monitor — Direct -> DIRECT_PERF (a new store, never merged) ----------
  const dpBefore = new Set(Object.keys(W.DIRECT_PERF || {}));
  const rd = buildDirectPerf(P.dir, W.MASTER);
  W.DIRECT_PERF = rd.store;
  const dpAfter = new Set(Object.keys(W.DIRECT_PERF));
  const lostDp = [...dpBefore].filter(k => !dpAfter.has(k));
  console.log(`  DIRECT_PERF: ${before.DP} -> ${Object.keys(W.DIRECT_PERF).length}  (matched ${rd.matched}, unmatched ${rd.unmatched})`);
  if (rd.sampleUnmatched.length) console.log(`    sample unmatched: ${rd.sampleUnmatched.slice(0, 6).join(' | ')}`);
  if (lostDp.length) {
    console.log(`    lose their Direct overlay (${lostDp.length}) -> these fall back to Regular values:`);
    lostDp.slice(0, 12).forEach(n => console.log(`      - ${n}`));
    if (lostDp.length > 12) console.log(`      ... +${lostDp.length - 12} more`);
  }

  // ---------- 4. dates ----------
  W.DATA_DATES.performance = ASON;
  W.DATA_DATES.analytics = ASON_AN;

  const after = snap();
  console.log('AFTER :', JSON.stringify(after));

  // ---------- gates ----------
  let fail = false;
  console.log(`\nGATE sandbox inline blocks: ${blockErrors.length ? `*** FAIL (${blockErrors.length} error(s) other than a missing CDN library — see above)` : 'PASS'}`);
  if (blockErrors.length) fail = true;
  const names = W.MASTER.map(r => r.name);
  const dupes = names.filter((n, i) => names.indexOf(n) !== i);
  console.log(`GATE duplicate names: ${dupes.length ? '*** FAIL ' + [...new Set(dupes)].slice(0, 5).join(' | ') : 'PASS (0)'}`);
  if (dupes.length) fail = true;
  let shrank = false;
  for (const [k, lo] of [['MASTER', before.MASTER], ['EQ', before.EQ], ['HY', before.HY], ['DB', before.DB]]) {
    if (after[k] < lo) { console.log(`GATE ${k} did not shrink: *** FAIL (${lo} -> ${after[k]})`); shrank = true; }
  }
  // DIRECT_PERF is rebuilt from scratch each month, so it may move a little either way. Refuse a
  // collapse relative to the current block (A17) — and an empty build — not a fixed floor.
  if (after.DP < before.DP * 0.95 || !rd.matched) {
    console.log(`GATE DP within 95% of the current block: *** FAIL (${before.DP} -> ${after.DP}; matched ${rd.matched} Direct rows)`);
    shrank = true;
  }
  if (shrank) fail = true;
  else console.log('GATE no block shrank: PASS');
  // A fund sheet the parser does not recognise is skipped whole; four went unnoticed from July to
  // October 2026 (C19). A page without the C19 fix reports nothing, which must not read as a pass.
  const uncl = r1.unclassified;
  const unclKnown = uncl && typeof uncl === 'object' && !Array.isArray(uncl);
  const unclRows = unclKnown ? Object.values(uncl).reduce((a, b) => a + b, 0) : 0;
  console.log(`GATE fund rows on unrecognised Monitor sheets: ${!unclKnown
    ? '*** FAIL (this index.html predates the C19 parser fix and does not report them)'
    : unclRows ? `*** FAIL ${Object.entries(uncl).map(([s, n]) => `"${s}": ${n}`).join(', ')} — add each sheet to SHEET_MAP or REFRESH_ONLY_SHEETS in site/index.html` : 'PASS (0)'}`);
  if (!unclKnown || unclRows) fail = true;
  const withR1y = W.MASTER.filter(r => r.r1y != null).length;
  console.log(`GATE MASTER records carrying r1y: ${withR1y}`);
  console.log(`GATE DATA_DATES: ${JSON.stringify(W.DATA_DATES)}`);

  if (!APPLY) { console.log('\n[dry run] pass --apply to write index.html'); process.exit(fail ? 1 : 0); }
  if (fail) { console.error('\n*** gate failed — refusing to write'); process.exit(1); }

  // ---------- write back: every block and both dates in memory, then one atomic write ----------
  const writes = [
    ['window.DIRECT_PERF = ', W.DIRECT_PERF],
    ['window.MASTER = ', W.MASTER],
    ['window.EQUITY_ANALYTICS = ', W.EQUITY_ANALYTICS],
    ['window.HYBRID_ANALYTICS = ', W.HYBRID_ANALYTICS],
    ['window.DEBT_ANALYTICS = ', W.DEBT_ANALYTICS],
    ['window.MF_BENCHMARK_PERF = ', W.MF_BENCHMARK_PERF],
  ];
  let out;
  try {
    out = B.spliceBlocks(html, writes.map(([prefix, value]) => ({ prefix, value })));
    out = B.setDataDate(out, 'performance', ASON);
    out = B.setDataDate(out, 'analytics', ASON_AN);
    for (const [prefix, value] of writes) console.log(`  wrote ${prefix.trim()} (${JSON.stringify(value).length} bytes)`);
    B.writeFilesAtomic([{ file: HTML, content: out }]);
  } catch (e) { console.error(`*** ${e.message} — nothing written`); process.exit(1); }
  console.log(`\nWROTE ${HTML} — ${out.length} bytes (was ${html.length})`);
})();

// Distinct "Scheme Name" values in an analytics workbook (column A under the header row).
function schemeNames(src) {
  const wb = XLSX.readFile(src, { cellDates: false });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rg = XLSX.utils.decode_range(ws['!ref']);
  const cell = (r, c) => { const x = ws[XLSX.utils.encode_cell({ r, c })]; return x ? x.v : null; };
  let hdr = -1, col = 0;
  outer: for (let r = 0; r <= Math.min(25, rg.e.r); r++) {
    for (let c = 0; c <= Math.min(3, rg.e.c); c++) {
      const v = cell(r, c);
      if (v && String(v).trim().toLowerCase() === 'scheme name') { hdr = r; col = c; break outer; }
    }
  }
  const out = new Set();
  if (hdr < 0) return out;
  for (let r = hdr + 1; r <= rg.e.r; r++) { const v = cell(r, col); if (v) out.add(String(v).trim()); }
  return out;
}

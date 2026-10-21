// Rebuild the embedded window.DIRECT_PERF from a Direct-plan MF Monitor, with the SAME builder
// bake_month.js uses (tools/lib/direct_perf.js, KNOWN_ISSUES A7), so a Direct-only rebuild and the
// monthly bake give identical data. The result is a new store: funds the workbook does not cover
// are dropped, not carried forward.
//
//   node tools/rebuild_directperf.js "<Daily MF Monitor_Direct_<date>.xlsx>" [--html site/index.html] [--apply]
//
// Note: the page's Section 7 Direct uploader (REFRESH.parseMfMonitorDirect) is a different parser
// and MERGES into the store; see KNOWN_ISSUES A7 for where the two differ.
const fs = require('fs');
const path = require('path');
const B = require('./lib/blocklib');
const { buildDirectPerf } = require('./lib/direct_perf');

const USAGE = 'Usage: node tools/rebuild_directperf.js "<Direct monitor.xlsx>" [--html site/index.html] [--apply]';
const argv = process.argv.slice(2);
const unknown = argv.filter(a => a.startsWith('--') && !['--html', '--apply'].includes(a));
if (unknown.length) { console.error(`unknown option(s): ${unknown.join(' ')}\n${USAGE}`); process.exit(2); }
// A value flag needs a value, and a word that belongs to no flag is a mistake, not something to ignore.
const VALUED = ['--html'];
for (const f of VALUED) { const i = argv.indexOf(f); if (i >= 0 && (argv[i + 1] == null || argv[i + 1].startsWith('--'))) { console.error(`${f} needs a value\n${USAGE}`); process.exit(2); } }
const stray = argv.filter((a, i) => !a.startsWith('--') && !VALUED.includes(argv[i - 1])).slice(1);
if (stray.length) { console.error(`unexpected argument(s): ${stray.join(' ')}\n${USAGE}`); process.exit(2); }
const flag = n => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : null; };
const APPLY = argv.includes('--apply');
const SRC = argv.find((a, i) => !a.startsWith('--') && argv[i - 1] !== '--html');
const HTML = flag('--html') || path.join(__dirname, '..', 'site', 'index.html');
if (!SRC || !fs.existsSync(SRC)) { console.error(USAGE); process.exit(2); }
if (!fs.existsSync(HTML)) { console.error('*** page not found: ' + HTML); console.error(USAGE); process.exit(2); }

const html = fs.readFileSync(HTML, 'utf8');
// Both blocks must be found exactly once and parse, or nothing is read, built or written (A7).
let MASTER, oldDP;
try {
  MASTER = B.locate(html, 'window.MASTER = ').value;               // the baseline block, pre-sibling
  oldDP = B.locate(html, 'window.DIRECT_PERF = ').value;
} catch (e) { console.error(`*** ${path.basename(HTML)}: ${e.message} — nothing written`); process.exit(1); }
const oldExpense = new Map(Object.entries(oldDP).filter(([, v]) => v.expense != null).map(([k, v]) => [k, v.expense]));
console.log(`before: ${Object.keys(oldDP).length} funds, ${oldExpense.size} with expense`);

const rd = buildDirectPerf(SRC, MASTER);
const DP = rd.store;
console.log(`Direct monitor ${path.basename(SRC)}: ${rd.matched} scheme row(s) matched, ${Object.keys(DP).length} funds with Direct data, ${rd.unmatched} unmatched` +
  (rd.sampleUnmatched.length ? ` (${rd.sampleUnmatched.slice(0, 2).join(' | ')}…)` : ''));

// ---- gates: every field must sit on the same scale as MASTER ----
const M = new Map(MASTER.map(r => [r.name, r]));
const stats = {};
const bump = (k, ok) => { stats[k] = stats[k] || { n: 0, bad: 0 }; stats[k].n++; if (!ok) stats[k].bad++; };
const worst = {};
for (const [name, v] of Object.entries(DP)) {
  const m = M.get(name); if (!m) continue;
  for (const k of ['mcap_large', 'mcap_mid', 'mcap_small', 'mcap_other', 'ytm', 'expense']) {
    if (v[k] == null) continue;
    const ok = v[k] >= -0.5 && v[k] <= 1.5;                     // decimals, never percentages
    bump(k, ok);
    if (!ok && !worst[k]) worst[k] = `${name}=${v[k]}`;
  }
  if (v.mcap_large != null) {
    const sum = (v.mcap_large || 0) + (v.mcap_mid || 0) + (v.mcap_small || 0) + (v.mcap_other || 0);
    bump('mcap_sum~1', Math.abs(sum - 1) < 0.05);
    if (Math.abs(sum - 1) >= 0.05 && !worst['mcap_sum~1']) worst['mcap_sum~1'] = `${name} sums to ${sum.toFixed(3)}`;
  }
}
let fail = false;
console.log('\nGATES (values must be decimals on MASTER\'s scale):');
for (const [k, s] of Object.entries(stats)) {
  const bad = s.bad > 0;
  if (bad) fail = true;
  console.log(`  ${k.padEnd(12)} ${String(s.n).padStart(5)} checked  ${bad ? '*** ' + s.bad + ' BAD  e.g. ' + worst[k] : 'PASS'}`);
}
// The store is replaced, so refuse a collapse relative to the current block (and an empty build).
const nOld = Object.keys(oldDP).length, nNew = Object.keys(DP).length;
const shrank = nNew < nOld * 0.95 || !rd.matched;
console.log(`GATE DIRECT_PERF within 95% of the current block: ${shrank ? '*** FAIL' : 'PASS'} (${nOld} -> ${nNew})`);
if (shrank) fail = true;
const keptExpense = [...oldExpense.keys()].filter(k => DP[k] && DP[k].expense != null).length;
console.log(`\nexpense present after rebuild: ${Object.values(DP).filter(v => v.expense != null).length} (was ${oldExpense.size}; ${keptExpense} of the old ones still covered)`);

// side-by-side against MASTER for one fund
const probe = 'Bandhan Large & Mid Cap Fund-Reg(G)';
const pm = M.get(probe), pd = DP[probe];
if (pm && pd) {
  console.log(`\nSAMPLE ${probe}`);
  for (const k of ['mcap_large', 'mcap_mid', 'mcap_small', 'mcap_other', 'expense', 'r3y']) {
    console.log(`  ${k.padEnd(12)} master=${String(pm[k]).slice(0, 10).padEnd(12)} direct=${String(pd[k]).slice(0, 10)}`);
  }
}
console.log(`\nDIRECT_PERF ${nOld} -> ${nNew}`);

if (!APPLY) { console.log('\n[dry run] pass --apply to write index.html'); process.exit(fail ? 1 : 0); }
if (fail) { console.error('\n*** a gate failed — refusing to write'); process.exit(1); }
let out;
try {
  out = B.spliceBlocks(html, [{ prefix: 'window.DIRECT_PERF = ', value: DP }]);
  B.writeFilesAtomic([{ file: HTML, content: out }]);
} catch (e) { console.error(`*** ${e.message} — nothing written`); process.exit(1); }
console.log(`\nWROTE ${HTML} — ${out.length} bytes (was ${html.length})`);

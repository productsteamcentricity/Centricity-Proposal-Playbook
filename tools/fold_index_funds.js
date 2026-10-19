// ONE-OFF: make Index Fund a sub-category of Mutual Fund rather than its own product class,
// the same way Flexi Cap / Mid Cap / ELSS are.
//
//   node tools/fold_index_funds.js [--html <p>] [--apply]
//
// Every affected record keeps sub_category "Index Fund"; only product_class moves. The code half
// of the change is in index.html itself (SHEET_MAP, fofUnderlyingName, PC_ORDER, displayPC) —
// this script only rewrites MASTER and re-checks the invariants.
//
// It also REPORTS (never fixes) a product_class "Index Fund" that the data siblings bring back at
// page load: the browser sees MASTER only after Centricity_June_Refresh.js, Centricity_IRR_Offshore.js
// and Centricity_SIF_Refresh.js have run, and a row a sibling adds has to be fixed in that sibling
// (PRD §11.5), not in the embedded block.
//
// Re-running is a no-op once the fold is done. Exit codes: 0 = nothing to do or all gates passed;
// 1 = a gate failed (nothing written); 2 = usage error.
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const B = require('./lib/blocklib');

const USAGE = 'Usage: node tools/fold_index_funds.js [--html <index.html>] [--apply]';
const usage = msg => { if (msg) console.error(msg); console.error(USAGE); process.exit(2); };
const argv = process.argv.slice(2);
let APPLY = false, HTML = null;
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === '--apply') { APPLY = true; continue; }
  if (a === '--html') { HTML = argv[++i]; if (HTML == null || HTML.startsWith('--')) usage('missing value for --html'); continue; }
  usage(a.startsWith('--') ? 'unknown flag: ' + a : 'unexpected argument: ' + a);
}
HTML = HTML || path.join(__dirname, '..', 'site', 'index.html');
if (!fs.existsSync(HTML)) usage('*** index.html not found: ' + HTML);

const MASTER = B.read(HTML, 'window.MASTER = ').value;
const targets = MASTER.filter(r => r.product_class === 'Index Fund');
console.log('records with product_class "Index Fund": ' + targets.length);

// ---------- report: what the browser sees after the siblings run ----------
// Run on the block as it will be after this tool (folded, or as-is when there is nothing to fold),
// so every hit is one a SIBLING brings back. The siblings run on a deep COPY: they mutate MASTER
// rows in place, and none of that may leak into the block this tool writes.
function reportEffective(block) {
  const sandbox = {
    console: { log() {}, warn() {}, error() {} }, JSON, Math, Object, Array, String, Number, Boolean,
    Date, RegExp, Map, Set, Promise, parseFloat, parseInt, isNaN, isFinite, Error, TypeError,
    setTimeout() {}, clearTimeout() {},
    document: { getElementById: () => null, querySelector: () => null, querySelectorAll: () => [],
      createElement: () => ({ style: {}, appendChild() {}, setAttribute() {} }), addEventListener() {},
      head: { appendChild() {} }, body: { appendChild() {} } },
  };
  sandbox.window = sandbox; sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  sandbox.MASTER = JSON.parse(JSON.stringify(block));
  sandbox.EQUITY_ANALYTICS = {}; sandbox.HYBRID_ANALYTICS = {}; sandbox.DEBT_ANALYTICS = {};
  sandbox.DATA_DATES = {}; sandbox.BENCHMARKS = {}; sandbox.RATIONALE = {}; sandbox.LIQUIDITY_MAP = {};
  sandbox.REFRESH = {};
  // Same order as the <script src> tags in index.html: June -> IRR/Offshore -> SIF.
  for (const f of ['Centricity_June_Refresh.js', 'Centricity_IRR_Offshore.js', 'Centricity_SIF_Refresh.js']) {
    const p = path.join(path.dirname(HTML), f);
    if (!fs.existsSync(p)) { console.log('*** effective MASTER not checked: ' + f + ' not found next to ' + path.basename(HTML)); return; }
    try { vm.runInContext(fs.readFileSync(p, 'utf8'), sandbox, { filename: f }); }
    catch (e) { console.log('*** effective MASTER not checked: ' + f + ' — ' + e.message); return; }
  }
  const eff = Array.isArray(sandbox.MASTER) ? sandbox.MASTER : [];
  const hits = eff.filter(r => r.product_class === 'Index Fund');
  console.log((block === MASTER ? '' : '(after this fold) ') + 'effective MASTER after the siblings run: ' + eff.length + ' records; product_class "Index Fund": ' + hits.length +
    (hits.length ? '   *** a sibling brings them back — fix that sibling, not this block (report only)' : ''));
  hits.slice(0, 10).forEach(r => console.log('     ' + r.name));
  if (hits.length > 10) console.log('     … and ' + (hits.length - 10) + ' more');
}

if (!targets.length) { reportEffective(MASTER); console.log('nothing to fold — already done'); process.exit(0); }

const subs = {};
targets.forEach(r => { const k = r.asset_class + ' > ' + r.sub_category; subs[k] = (subs[k] || 0) + 1; });
console.log('  they sit in: ' + Object.entries(subs).map(([k, n]) => k + ' (' + n + ')').join(', '));
const odd = Object.keys(subs).filter(k => !/> Index Fund$/.test(k));
if (odd.length) { console.error('*** unexpected sub_category among them: ' + odd.join(' | ') + ' — aborting'); process.exit(1); }

const next = MASTER.map(r => r.product_class === 'Index Fund'
  ? Object.assign({}, r, { product_class: 'Mutual Fund' })   // sub_category deliberately untouched
  : r);
reportEffective(next);

// ---------- gates ----------
console.log('\n---------------- gates ----------------');
const names = next.map(r => r.name);
const dupes = names.filter((x, i) => names.indexOf(x) !== i);
console.log('GATE no duplicate names introduced: ' + (dupes.length ? '*** FAIL: ' + dupes.slice(0, 3).join(' | ') : 'PASS'));
let fail = dupes.length > 0;

console.log('GATE record count unchanged: ' + MASTER.length + ' -> ' + next.length +
  (MASTER.length === next.length ? '  PASS' : '  *** FAIL (changed)'));
if (MASTER.length !== next.length) fail = true;

const onlyPc = next.every((r, i) => {
  const o = MASTER[i];
  return Object.keys(r).every(k => k === 'product_class' || JSON.stringify(r[k]) === JSON.stringify(o[k]));
});
console.log('GATE only product_class changed on any record: ' + (onlyPc ? 'PASS' : '*** FAIL: other fields moved'));
if (!onlyPc) fail = true;

const subKept = next.filter(r => r.sub_category === 'Index Fund').length;
console.log('GATE sub_category "Index Fund" preserved: ' + subKept + ' (was ' + targets.length + ')' +
  (subKept === targets.length ? '  PASS' : '  *** FAIL (lost)'));
if (subKept !== targets.length) fail = true;

const before = {}, after = {};
MASTER.forEach(r => { before[r.product_class] = (before[r.product_class] || 0) + 1; });
next.forEach(r => { after[r.product_class] = (after[r.product_class] || 0) + 1; });
console.log('\nproduct_class before -> after:');
[...new Set([...Object.keys(before), ...Object.keys(after)])].sort().forEach(k =>
  console.log('   ' + k.padEnd(18) + String(before[k] || 0).padStart(6) + ' -> ' + String(after[k] || 0).padStart(6) +
    (before[k] !== after[k] ? '   <—' : '')));

console.log('\nEquity sub-categories under Mutual Fund after the fold:');
const eq = {};
next.filter(r => r.product_class === 'Mutual Fund' && r.asset_class === 'Equity')
  .forEach(r => { eq[r.sub_category] = (eq[r.sub_category] || 0) + 1; });
Object.entries(eq).sort((a, b) => b[1] - a[1]).forEach(([k, n]) =>
  console.log('   ' + String(n).padStart(4) + '  ' + k + (k === 'Index Fund' ? '   <— folded in' : '')));

if (!APPLY) { console.log('\n[dry run] ' + (fail ? '*** a gate failed — an --apply would refuse' : 'pass --apply to write')); process.exit(fail ? 1 : 0); }
if (fail) { console.error('\n*** gate failed — refusing to write'); process.exit(1); }
const bytes = B.writeBlocks(HTML, [{ prefix: 'window.MASTER = ', value: next }]);
console.log('\nWROTE ' + HTML + ' — ' + bytes + ' bytes');

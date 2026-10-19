// Re-key SIF analytics entries from the workbook's scheme name to the MASTER fund name.
//
//   node tools/rekey_sif_analytics.js [--html site/index.html] [--allow-shrink] [--apply]
//
// The analytics workbooks name a SIF by its scheme alone — "Altiva Hybrid Long-Short Fund-Reg(G)"
// — while MASTER names it with the AMC in front: "Edelweiss Altiva Hybrid Long-Short Fund". The
// analytics stores are keyed by MASTER name everywhere else, so the holdings load fine and are
// then simply unreachable: the fund shows no sectors, no stocks, no credit profile, and
// H.hasEqHoldings / H.hasDbHoldings drop it from the analytics and overlap sections entirely.
//
// No fuzzy matching is needed. Centricity_SIF_Refresh.js already records the workbook name on
// each record as `sif_raw`, so the join is exact.
//
// RUN THIS AFTER EVERY ANALYTICS BAKE — parseAnalytics re-creates the workbook-named keys, the
// same way fill_variant_analytics.js has to be re-run.
//
// A store must never lose a fund. The one way it can is a SIF whose analytics class changed
// between months (its old-class entry is deleted below); the size gate then FAILS and lists the
// lost keys, and --allow-shrink accepts that after review.
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const B = require('./lib/blocklib');

const USAGE = 'Usage: node tools/rekey_sif_analytics.js [--html site/index.html] [--allow-shrink] [--apply]';
const argv = process.argv.slice(2);
const unknown = argv.filter(a => a.startsWith('--') && !['--html', '--allow-shrink', '--apply'].includes(a));
if (unknown.length) { console.error(`unknown option(s): ${unknown.join(' ')}\n${USAGE}`); process.exit(2); }
// A value flag needs a value, and a word that belongs to no flag is a mistake, not something to ignore.
const VALUED = ['--html'];
for (const f of VALUED) { const i = argv.indexOf(f); if (i >= 0 && (argv[i + 1] == null || argv[i + 1].startsWith('--'))) { console.error(`${f} needs a value\n${USAGE}`); process.exit(2); } }
const stray = argv.filter((a, i) => !a.startsWith('--') && !VALUED.includes(argv[i - 1]));
if (stray.length) { console.error(`unexpected argument(s): ${stray.join(' ')}\n${USAGE}`); process.exit(2); }
const flag = n => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : null; };
const APPLY = argv.includes('--apply');
const ALLOW_SHRINK = argv.includes('--allow-shrink');
const HTML = flag('--html') || path.join(__dirname, '..', 'site', 'index.html');
const DIR = path.dirname(HTML);

// ---------- the analytics blocks, straight from the file (baseline, pre-sibling) ----------
const STORES = [
  { g: 'EQUITY_ANALYTICS', prefix: 'window.EQUITY_ANALYTICS = ' },
  { g: 'HYBRID_ANALYTICS', prefix: 'window.HYBRID_ANALYTICS = ' },
  { g: 'DEBT_ANALYTICS',   prefix: 'window.DEBT_ANALYTICS = ' },
];
for (const s of STORES) { s.value = B.read(HTML, s.prefix).value; s.before = new Set(Object.keys(s.value)); }

// ---------- sif_raw -> MASTER name, by running the siblings that build the SIF bucket ----------
// Only MASTER is read back out. The analytics globals are deliberately NOT taken from the sandbox:
// sibling #3 mutates EQUITY_ANALYTICS, and baking that in would re-apply it on every page load.
// The siblings' own console.log chatter stays muted, but their warnings and errors are shown: each
// sibling catches its own failure and reports it with console.error, so a muted console would hide
// a sibling that did not build the SIF bucket (A23).
const sibMsgs = [];
const fmtArgs = a => a.map(x => (x && typeof x === 'object' && 'message' in x) ? x.message : String(x)).join(' ');
const sandbox = {
  console: { log() {}, info() {}, warn: (...a) => sibMsgs.push(['warn', fmtArgs(a)]), error: (...a) => sibMsgs.push(['error', fmtArgs(a)]) },
  JSON, Math, Object, Array, String, Number, Boolean,
  Date, RegExp, Map, Set, Promise, parseFloat, parseInt, isNaN, isFinite, Error, TypeError,
  setTimeout() {}, clearTimeout() {},
  document: { getElementById: () => null, querySelector: () => null, querySelectorAll: () => [],
    createElement: () => ({ style: {}, appendChild() {}, setAttribute() {} }), addEventListener() {},
    head: { appendChild() {} }, body: { appendChild() {} } },
};
sandbox.window = sandbox; sandbox.globalThis = sandbox;
vm.createContext(sandbox);
sandbox.MASTER = B.read(HTML, 'window.MASTER = ').value;
sandbox.EQUITY_ANALYTICS = {}; sandbox.HYBRID_ANALYTICS = {}; sandbox.DEBT_ANALYTICS = {};
sandbox.DATA_DATES = {}; sandbox.BENCHMARKS = {}; sandbox.RATIONALE = {}; sandbox.LIQUIDITY_MAP = {};
sandbox.REFRESH = {};
for (const f of ['Centricity_June_Refresh.js', 'Centricity_IRR_Offshore.js', 'Centricity_SIF_Refresh.js']) {
  const p = path.join(DIR, f);
  if (!fs.existsSync(p)) { console.error('*** missing sibling: ' + f); process.exit(1); }
  const n0 = sibMsgs.length;
  try { vm.runInContext(fs.readFileSync(p, 'utf8'), sandbox, { filename: f }); }
  catch (e) { console.error('*** ' + f + ': ' + e.message); process.exit(1); }
  for (const [lvl, msg] of sibMsgs.slice(n0)) console.log(`  [${f} console.${lvl}] ${msg.slice(0, 200)}`);
}
const sibErrors = sibMsgs.filter(([lvl]) => lvl === 'error').length;
// "Equity SIF" and "Hybrid SIF" since the strategy split; "SIF" for anything predating it.
const sif = sandbox.MASTER.filter(r => /SIF$/.test(r.product_class || ''));
console.log('SIF funds after the siblings run: ' + sif.length +
  '   (carrying sif_raw: ' + sif.filter(r => r.sif_raw).length + ')\n');

// ---------- re-key ----------
const moved = [], already = [], missing = [], replaced = [];
for (const r of sif) {
  if (!r.sif_raw) { missing.push(r.name + '   (no sif_raw on the record)'); continue; }
  // Workbook name already equals the MASTER name: nothing to move (moving would delete the entry).
  if (r.sif_raw === r.name) {
    const own = STORES.find(s => s.value[r.name]);
    if (own) already.push(own.g + '  ' + r.name); else missing.push(r.name + '   (not in any analytics store)');
    continue;
  }
  const hit = STORES.find(s => s.value[r.sif_raw]);
  const under = STORES.find(s => s.value[r.name]);
  if (under && !hit) { already.push(under.g + '  ' + r.name); continue; }
  if (!hit) { missing.push(r.name + '   (workbook name "' + r.sif_raw + '" not in any analytics store)'); continue; }
  // Both keys present means a bake ran after the last re-key: parseAnalytics merged this month's
  // rows back in under the workbook name, while the MASTER-named copy is last month's. The
  // workbook-named one is the fresher of the two, so it wins.
  if (under) {
    if (under !== hit) delete under.value[r.name];      // class changed between months: the size gate reports it
    replaced.push(hit.g.slice(0, 2).toLowerCase() + '  ' + r.name + '   (refreshed from "' + r.sif_raw + '")');
  } else {
    moved.push(hit.g.slice(0, 2).toLowerCase() + '  ' + r.sif_raw + '   ->   ' + r.name);
  }
  hit.value[r.name] = hit.value[r.sif_raw];
  delete hit.value[r.sif_raw];
}

console.log('re-keyed: ' + moved.length);
moved.forEach(m => console.log('   ' + m));
if (replaced.length) { console.log('\nrefreshed from a newer bake: ' + replaced.length); replaced.forEach(r => console.log('   ' + r)); }
if (already.length) { console.log('\nalready keyed by MASTER name: ' + already.length); already.forEach(a => console.log('   ' + a)); }
if (missing.length) {
  console.log('\nno analytics anywhere for ' + missing.length + ' SIF fund' + (missing.length === 1 ? '' : 's') +
    ' — absent from the source workbooks, chase upstream:');
  missing.forEach(m => console.log('   ! ' + m));
}

// ---------- gates ----------
console.log('\n---------------- gates ----------------');
let fail = false;
console.log(`GATE siblings ran without a console error: ${sibErrors ? `*** FAIL (${sibErrors} — see the sibling lines above)` : 'PASS'}`);
if (sibErrors) fail = true;
// A key gone from a store is a LOST fund unless it was a workbook name whose fund now sits under
// its MASTER name in that same store (a move, or this month's copy replacing last month's).
const masterNameOfRaw = new Map(sif.filter(r => r.sif_raw).map(r => [r.sif_raw, r.name]));
const sizes = [], lost = [];
for (const s of STORES) {
  const now = new Set(Object.keys(s.value));
  sizes.push(`${s.g} ${s.before.size} -> ${now.size}`);
  for (const k of s.before) {
    if (now.has(k)) continue;
    const m = masterNameOfRaw.get(k);
    if (m !== undefined && now.has(m)) continue;
    lost.push(`${s.g}  ${k}`);
  }
}
const shrinkFail = lost.length > 0 && !ALLOW_SHRINK;
console.log(`GATE store sizes (a store never loses a fund): ${!lost.length ? 'PASS' : shrinkFail ? '*** FAIL' : 'PASS (allowed by --allow-shrink)'}   ${sizes.join(' | ')}`);
lost.forEach(l => console.log(`     lost: ${l}`));
if (shrinkFail) { console.log('     (re-run with --allow-shrink once you have checked the fund changed analytics class)'); fail = true; }
const nowReachable = sif.filter(r => STORES.some(s => s.value[r.name])).length;
console.log('GATE SIF funds with reachable analytics: ' + nowReachable + ' of ' + sif.length);
const leftovers = STORES.flatMap(s => Object.keys(s.value).filter(k => sif.some(r => r.sif_raw === k && r.sif_raw !== r.name)));
console.log('GATE no workbook-named SIF keys left behind: ' + (leftovers.length ? '*** ' + leftovers.join(' | ') : 'PASS'));
if (leftovers.length) fail = true;

if (!moved.length && !replaced.length) { console.log('\nnothing to do — already re-keyed'); process.exit(fail ? 1 : 0); }
if (!APPLY) { console.log('\n[dry run] pass --apply to write'); process.exit(fail ? 1 : 0); }
if (fail) { console.error('\n*** gate failed — refusing to write'); process.exit(1); }
const bytes = B.writeBlocks(HTML, STORES.map(s => ({ prefix: s.prefix, value: s.value })));
console.log('\nWROTE ' + HTML + ' — ' + bytes + ' bytes');

// A fund whose Growth record has no entry in this month's analytics workbook often IS in the
// workbook under another option of the SAME scheme (IDCW / IDCW Reinvest / Direct). The holdings
// are identical across options — it is one portfolio — so the sibling row is a valid source.
//
// This runs index.html's own parseAnalytics into an EMPTY store to get exactly this month's
// output keyed by this month's names, then gives every eligible MASTER fund that this month's
// workbook does not cover under its own name the entry of its plan-variant sibling. An entry the
// fund already has is REPLACED: it is last month's holdings (the bake merges, it never deletes).
// When several siblings rank equally best, the fund is listed as ambiguous and not filled.
//
//   node tools/fill_variant_analytics.js --dir "<Month folder>" [--html site/index.html] [--apply]
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const XLSX = require('xlsx');
const B = require('./lib/blocklib');

const USAGE = 'Usage: node tools/fill_variant_analytics.js --dir "<Month folder>" [--html site/index.html] [--apply]';
const argv = process.argv.slice(2);
const unknown = argv.filter(a => a.startsWith('--') && !['--dir', '--html', '--apply'].includes(a));
if (unknown.length) { console.error(`unknown option(s): ${unknown.join(' ')}\n${USAGE}`); process.exit(2); }
// A value flag needs a value, and a word that belongs to no flag is a mistake, not something to ignore.
const VALUED = ['--dir', '--html'];
for (const f of VALUED) { const i = argv.indexOf(f); if (i >= 0 && (argv[i + 1] == null || argv[i + 1].startsWith('--'))) { console.error(`${f} needs a value\n${USAGE}`); process.exit(2); } }
const stray = argv.filter((a, i) => !a.startsWith('--') && !VALUED.includes(argv[i - 1]));
if (stray.length) { console.error(`unexpected argument(s): ${stray.join(' ')}\n${USAGE}`); process.exit(2); }
const flag = n => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : null; };
const APPLY = argv.includes('--apply');
const DIR = flag('--dir');
const HTML = flag('--html') || path.join(__dirname, '..', 'site', 'index.html');
if (!DIR) { console.error(USAGE); process.exit(2); }
const AN = path.join(DIR, 'Analytics');
if (!fs.existsSync(AN) || !fs.statSync(AN).isDirectory()) { console.error(`*** no Analytics folder in ${DIR}`); process.exit(2); }
// Exactly one workbook per class: a duplicate download such as "… (1).xlsx" is refused (A17).
const pick = (re, kind) => {
  const hits = fs.readdirSync(AN).filter(f => re.test(f));
  if (hits.length > 1) {
    console.error(`*** ${hits.length} files match the ${kind} analytics workbook in ${AN} — keep exactly one:`);
    hits.forEach(h => console.error(`      ${h}`));
    process.exit(2);
  }
  const p = hits.length ? path.join(AN, hits[0]) : null;
  if (!p || !fs.statSync(p).isFile()) { console.error(`*** missing the ${kind} analytics workbook in ${AN} (expected a file matching ${re})`); process.exit(2); }
  return p;
};
const SRC = { equity: pick(/^Equity Analytics_/i, 'equity'), hybrid: pick(/^Hybrid Analytics_/i, 'hybrid'), debt: pick(/^Debt Analytics_/i, 'debt') };

// ---- sandbox with the page's parsers ----
const html = fs.readFileSync(HTML, 'utf8');
const blocks = [];
{
  const re = /<script\b([^>]*)>/gi; let m;
  while ((m = re.exec(html)) !== null) {
    const s0 = /\bsrc\s*=\s*"([^"]+)"/i.exec(m[1]);
    const s = m.index + m[0].length, c = html.indexOf('</script>', s), e = c === -1 ? html.length : c;
    blocks.push({ src: s0 ? s0[1] : null, body: s0 ? '' : html.slice(s, e) });
    re.lastIndex = e;
  }
}
const sandbox = { console, JSON, Math, Object, Array, String, Number, Boolean, Date, RegExp, Map, Set, Promise,
  parseFloat, parseInt, isNaN, isFinite, XLSX, Error, TypeError, Symbol, ArrayBuffer, Uint8Array, setTimeout, clearTimeout,
  document: { getElementById: () => null, querySelector: () => null, querySelectorAll: () => [],
    createElement: () => ({ style: {}, appendChild() {}, setAttribute() {} }), addEventListener() {}, head: { appendChild() {} }, body: { appendChild() {} } } };
sandbox.window = {}; sandbox.globalThis = sandbox; sandbox.window.document = sandbox.document;
vm.createContext(sandbox);
// The UI blocks stop at the first CDN library the sandbox does not load (expected). Any other
// error means a data or parser block did not run: report it and fail the gate (A23).
const CDN_GLOBAL = /^(React|ReactDOM|Chart|XLSX|PptxGenJS) is not defined$/;
const blockErrors = [];
for (const b of blocks) {
  if (b.src || /ReactDOM\.createRoot/.test(b.body)) continue;
  try { vm.runInContext(b.body, sandbox, { timeout: 120000 }); }
  catch (e) { if (!CDN_GLOBAL.test(e.message)) { blockErrors.push(e.message); console.log(`  *** inline block error: ${e.message.slice(0, 160)}`); } }
}
const W = sandbox.window;
const MASTER = W.MASTER;
const fileOf = p => ({ name: path.basename(p), arrayBuffer: async () => fs.readFileSync(p) });

// Plan / option markers only. Never strip a distinguishing tag such as (Inbound) or (Invictus).
const NBSP = String.fromCharCode(160);
const tidy = s => String(s == null ? '' : s).split(NBSP).join(' ').replace(/\s+/g, ' ').trim();
function planBase(s) {
  let t = tidy(s).toLowerCase();
  for (let i = 0; i < 6; i++) {
    const prev = t;
    t = t.replace(/\s*\(\s*adjusted\s*\)\s*$/i, '')
         .replace(/\s*[-–—]?\s*direct\s*plan\s*$/i, '')
         .replace(/\s*\(\s*(?:g|growth|idcw(?:\s*(?:reinvest|payout|re-?invest)?)?|d|div|dividend|b|bonus|adr|q|m|h|w|a)\s*\)\s*$/i, '')
         .replace(/\s*[-–—]\s*(?:reg|regular|dir|direct)\s*$/i, '')
         .replace(/\s*[-–—]+\s*$/, '').trim();
    if (t === prev) break;
  }
  return t;
}
// Prefer a Growth + Regular sibling when several options exist.
function rank(n) {
  let r = 0;
  if (/\(\s*g\s*\)|\(growth\)/i.test(n)) r -= 4;
  if (/idcw|dividend/i.test(n)) r += 3;
  if (/reinvest/i.test(n)) r += 1;
  if (/direct/i.test(n)) r += 2;
  return r;
}

(async () => {
  const KINDS = [
    { kind: 'equity', store: 'EQUITY_ANALYTICS', ok: f => f.asset_class === 'Equity' && ['Mutual Fund', 'Index Fund', 'ETF'].includes(f.product_class) },
    { kind: 'hybrid', store: 'HYBRID_ANALYTICS', ok: f => f.asset_class === 'Hybrid' && ['Mutual Fund', 'Index Fund', 'ETF'].includes(f.product_class) },
    { kind: 'debt',   store: 'DEBT_ANALYTICS',   ok: f => f.asset_class === 'Debt' && ['Mutual Fund', 'Index Fund', 'ETF'].includes(f.product_class) },
  ];
  const patch = {};   // store -> { masterName: entry }
  for (const K of KINDS) {
    // parse this month's file into an EMPTY store so we see exactly what it covers
    const keep = W[K.store];
    W[K.store] = {};
    const r = await W.REFRESH.parseAnalytics(fileOf(SRC[K.kind]), K.kind);
    const monthOut = W[K.store];
    W[K.store] = keep;
    if (!r.ok) { console.error(`  parseAnalytics(${K.kind}) failed: ${r.error}`); process.exit(1); }

    const byBase = new Map();
    for (const n of Object.keys(monthOut)) {
      const b = planBase(n); if (!b) continue;
      if (!byBase.has(b)) byBase.set(b, []);
      byBase.get(b).push(n);
    }
    const eligible = MASTER.filter(K.ok);
    const missing = eligible.filter(f => !Object.prototype.hasOwnProperty.call(monthOut, f.name));
    const filled = [], stillMissing = [], ambiguous = [];
    for (const f of missing) {
      const cands = byBase.get(planBase(f.name));
      if (!cands || !cands.length) { stillMissing.push(f.name); continue; }
      // The best-ranked sibling only; a tie for best is reported, never broken by guesswork (A17).
      const sorted = cands.slice().sort((a, b) => rank(a) - rank(b));
      const tied = sorted.filter(n => rank(n) === rank(sorted[0]));
      if (tied.length > 1) { ambiguous.push(`${f.name}  <-  ${JSON.stringify(tied)}`); continue; }
      const best = sorted[0];
      patch[K.store] = patch[K.store] || {};
      patch[K.store][f.name] = { from: best, entry: monthOut[best] };
      filled.push(`${f.name}  <-  ${best}`);
    }
    console.log(`\n${K.kind.toUpperCase()}  eligible ${eligible.length} | covered by name ${eligible.length - missing.length} | missing ${missing.length}`);
    console.log(`  filled from a plan-variant sibling: ${filled.length}`);
    filled.slice(0, 30).forEach(x => console.log(`    ${x}`));
    if (filled.length > 30) console.log(`    ... +${filled.length - 30} more`);
    console.log(`  ambiguous (several equally ranked siblings — not filled, resolve by hand): ${ambiguous.length}`);
    ambiguous.forEach(x => console.log(`    ? ${x}`));
    console.log(`  still no entry anywhere in the ${K.kind} workbook: ${stillMissing.length}`);
    stillMissing.slice(0, 10).forEach(x => console.log(`    ! ${x}`));
  }

  // ---- gates + apply ----
  const fail = blockErrors.length > 0;
  console.log(`\nGATE sandbox inline blocks: ${fail ? `*** FAIL (${blockErrors.length} error(s) other than a missing CDN library — see above)` : 'PASS'}`);
  const total = Object.values(patch).reduce((a, o) => a + Object.keys(o).length, 0);
  console.log(`\nTOTAL entries to add: ${total}`);
  if (!APPLY) { console.log('[dry run] pass --apply to write index.html'); process.exit(fail ? 1 : 0); }
  if (fail) { console.error('*** gate failed — refusing to write'); process.exit(1); }
  if (!total) { console.log('nothing to do'); return; }

  // Splice order (and the log order) runs from the end of the file, as before.
  const targets = Object.keys(patch).map(store => {
    const prefix = `window.${store} = `;
    const loc = B.locate(html, prefix);
    return { store, prefix, s: loc.s, obj: loc.value };
  }).sort((a, b) => b.s - a.s);
  for (const t of targets) {
    // Every name in the patch is a fund this month's workbook does NOT cover under its own name,
    // so whatever is currently stored for it is last month's holdings. Replacing it with a
    // same-scheme sibling row from THIS month is the whole point — an existing entry is the
    // stale case, not a reason to skip.
    let added = 0, replaced = 0;
    for (const [name, v] of Object.entries(patch[t.store])) {
      if (Object.prototype.hasOwnProperty.call(t.obj, name)) replaced++; else added++;
      t.obj[name] = v.entry;
    }
    console.log(`  ${t.store}: ${added} added + ${replaced} refreshed (were last month's) -> ${Object.keys(t.obj).length}`);
  }
  let out;
  try {
    out = B.spliceBlocks(html, targets.map(t => ({ prefix: t.prefix, value: t.obj })));
    B.writeFilesAtomic([{ file: HTML, content: out }]);
  } catch (e) { console.error(`*** ${e.message} — nothing written`); process.exit(1); }
  console.log(`\nWROTE ${HTML} — ${out.length} bytes (was ${html.length})`);
})();

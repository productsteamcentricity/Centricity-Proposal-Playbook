// MONTHLY: bake the SIF Monitor into Centricity_SIF_Refresh.js's embedded `var SIF` block, so
// the dashboard ships with SIF returns already filled instead of the blanks it carried while
// DATA_DATES.sif read "—".
//
// Runs the sibling's OWN REFRESH.parseSif over the workbook inside a Node vm sandbox — the same
// trick bake_month.js uses — so what is baked in is byte-for-byte what the Section 7 "SIF
// Monitor" card would produce from the same file. There is no second parser to drift.
//
//   node tools/merge_sif_monitor.js "<SIF Monitor_<date>.xlsx>" --as-on "31st August 2026" [--sibling site/Centricity_SIF_Refresh.js] [--apply]
//
// --as-on is required and must be a plain long label ("31st August 2026"), so new SIF numbers can
// never sit under last month's date (KNOWN_ISSUES A16). Unknown flags are refused (exit 2).
//
// Also stamps the as-on date into the sibling's DATA_DATES.sif fallback, which is what the page
// shows before anyone uploads anything. The SIF block and that date line are built in memory and
// land in ONE atomic write, only after every gate has passed.
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const XLSX = require('xlsx');
const blocklib = require('./lib/blocklib.js');

const USAGE = 'Usage: node tools/merge_sif_monitor.js "<SIF Monitor_<date>.xlsx>" --as-on "31st August 2026" [--sibling site/Centricity_SIF_Refresh.js] [--apply]';
const usage = msg => { if (msg) console.error('*** ' + msg); console.error(USAGE); process.exit(2); };

// Strict CLI: one positional source, the value flags below, and --apply. Anything else (for
// example a stray `--html site/index.html`) is refused instead of being mistaken for the source.
const VALUE_FLAGS = ['--as-on', '--sibling'], BOOL_FLAGS = ['--apply'];
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
if (positional.length !== 1) usage(positional.length ? 'expected one SIF Monitor workbook, got ' + positional.length + ' positional arguments' : null);
const APPLY = !!opts['--apply'];
const SIB = opts['--sibling'] || path.join(__dirname, '..', 'site', 'Centricity_SIF_Refresh.js');
const SRC = positional[0];
if (!opts['--as-on']) usage('--as-on is required (e.g. --as-on "31st August 2026")');
let ASON;
try { ASON = blocklib.checkAsOn(opts['--as-on'], 'long'); } catch (e) { usage(e.message); }
if (!fs.existsSync(SRC)) usage('source not found: ' + SRC);
if (!fs.existsSync(SIB)) usage('sibling not found: ' + SIB);
// The file name is written into a `//` comment in the sibling; a line break would end the comment.
if (/[\r\n\u2028\u2029]/.test(path.basename(SRC))) usage('source file name contains a line break');
console.log(`monitor : ${path.basename(SRC)}`);
console.log(`sibling : ${path.basename(SIB)}\n`);

const sibSrc = fs.readFileSync(SIB, 'utf8');
const before = blocklib.locate(sibSrc, 'var SIF = ').value;

// ---------- sandbox ----------
// The sibling filters window.MASTER and concats its own SIF rows, then registers parseSif. An
// empty MASTER is enough: the sibling appends its own rows, and parseSif reads MASTER, not the page.
const sandbox = {
  console,
  XLSX,
  window: {
    MASTER: [],
    DATA_DATES: {},
    RATIONALE: {}, BENCHMARKS: {}, LIQUIDITY_MAP: {},
  },
};
sandbox.window.window = sandbox.window;
vm.createContext(sandbox);
vm.runInContext(sibSrc, sandbox, { filename: path.basename(SIB) });

const applied = sandbox.window.__SIF_REFRESH_APPLIED || {};
console.log(`sandbox : sibling installed ${applied.added} SIF rows`);
if (typeof sandbox.window.REFRESH?.parseSif !== 'function') { console.error('*** REFRESH.parseSif not registered — aborting'); process.exit(1); }

// A File-alike with the two members parseSif actually touches.
const buf = fs.readFileSync(SRC);
const fileLike = { name: path.basename(SRC), arrayBuffer: async () => buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) };

(async () => {
  // Clear the date the sibling stamped on load, so a date parseSif failed to set can never be
  // mistaken for this month's (A16).
  delete sandbox.window.DATA_DATES.sif;
  const res = await sandbox.window.REFRESH.parseSif(fileLike, { asOn: ASON });
  if (!res || !res.ok) { console.error('*** parseSif failed: ' + (res && res.error)); process.exit(1); }
  console.log(`parseSif: ${res.message}\n`);

  const after = sandbox.window.MASTER.filter(f => /SIF$/.test(f.product_class || ''));
  const asOn = sandbox.window.DATA_DATES.sif;

  // ---------- what changed ----------
  const byName = new Map(before.map(r => [r.name, r]));
  const FIELDS = ['aum', 'r1m', 'r3m', 'r6m', 'r1y', 'r2y', 'r3y', 'r5y', 'si', 'inception', 'exit_load'];
  let filled = 0, changed = 0;
  const fresh = [];
  for (const r of after) {
    const b = byName.get(r.name);
    if (!b) { fresh.push(r); continue; }
    for (const k of FIELDS) {
      const o = b[k] == null ? null : b[k], n = r[k] == null ? null : r[k];
      if (o === n) continue;
      if (o === null) filled++; else changed++;
    }
  }
  const cover = k => after.filter(r => r[k] != null).length;
  console.log(`SIF rows          : ${before.length} -> ${after.length}`);
  console.log(`values filled     : ${filled} (were blank)`);
  console.log(`values changed    : ${changed}`);
  console.log(`carrying AUM      : ${cover('aum')} of ${after.length}`);
  console.log(`carrying 1M / SI  : ${cover('r1m')} / ${cover('si')}`);
  console.log(`carrying inception: ${cover('inception')}`);
  console.log(`DATA_DATES.sif    : ${asOn}`);
  if (fresh.length) {
    console.log(`\nNEW schemes added (no AMC prefix or IRR band — the workbook carries neither):`);
    for (const r of fresh) console.log(`   + ${r.name}   [${r.product_class} | AUM ${r.aum} | inc ${r.inception}]`);
  }

  // ---------- build the new sibling in memory ----------
  // The fallback the page shows before anyone uploads: "—" until a monitor has been baked in.
  // Exactly one such line must exist, and it is rewritten with a literal (no `$` expansion).
  const DATE_LINE = 'if (window.DATA_DATES) window.DATA_DATES.sif = ';
  const DATE_RE = /if \(window\.DATA_DATES\) window\.DATA_DATES\.sif = "[^"]*";([^\n]*)/;
  const dateHits = (sibSrc.match(new RegExp(DATE_RE.source, 'g')) || []).length;
  let out = null, buildErr = null;
  try {
    out = blocklib.spliceBlocks(sibSrc, [{ prefix: 'var SIF = ', value: after }]);
    out = blocklib.replaceOnce(out, DATE_RE, `${DATE_LINE}${JSON.stringify(asOn)};  // baked from ${path.basename(SRC)}`, 'DATA_DATES.sif fallback line');
  } catch (e) { buildErr = e.message; out = null; }

  // ---------- gates ----------
  const bad = after.filter(r => ['r1m', 'r3m', 'r6m', 'r1y', 'r3y', 'r5y', 'si'].some(k => r[k] != null && Math.abs(r[k]) > 3));
  const noPerf = after.filter(r => r.si == null && r.r1m == null);
  const dupes = after.map(r => r.name).filter((n, i, a) => a.indexOf(n) !== i);
  let fail = false;
  const gate = (label, ok, detail) => { console.log(`GATE ${label}: ${ok ? 'PASS' : '*** FAIL ' + detail}`); if (!ok) fail = true; };
  console.log('');
  gate('returns within +-300% (decimals)', !bad.length, bad.map(b => b.name).join(', '));
  console.log(`GATE every SIF row has at least one return: ${noPerf.length ? 'WARN — ' + noPerf.map(n => n.name).join(', ') : 'PASS'}`);
  console.log(`GATE duplicate SIF names: ${dupes.length ? '*** FAIL ' + dupes.join(', ') : 'PASS (0)'}`);
  if (dupes.length) fail = true;
  gate('SIF block did not shrink', after.length >= before.length, `(${before.length} -> ${after.length})`);
  gate('DATA_DATES.sif equals --as-on', asOn === ASON, `(parseSif stamped ${JSON.stringify(asOn)}, expected ${JSON.stringify(ASON)})`);
  gate('DATA_DATES.sif fallback line found exactly once', dateHits === 1, `(${dateHits} matches)`);
  gate('new sibling built in memory', !!out, buildErr || '');
  if (fail) { console.error('\n*** gates failed — not writing'); process.exit(1); }

  if (!APPLY) { console.log('\n[dry run] pass --apply to write ' + path.basename(SIB)); return; }

  // One atomic write: the SIF block and its date land together or not at all (A8).
  blocklib.writeFilesAtomic([{ file: SIB, content: out }]);
  console.log(`\nwrote ${path.basename(SIB)} (${out.length} bytes; SIF block ${JSON.stringify(after).length} bytes)`);
  console.log(`DATA_DATES.sif fallback set to "${asOn}"`);
})();

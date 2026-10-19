// Re-point the PMS_PERF_ALIAS entries marked `pin` in tools/data/pins.json (pms_alias). Each pin
// was corroborated by two sources when it was set: the Reckoner deck names the strategy Centricity
// actually recommends, and the PMS performance file carries exactly one scheme matching it. The
// tool checks each key against the PMS block ON DISK, so run it straight after
// merge_pms_performance.js --apply.
//
//   node tools/pin_pms_alias.js --html site/index.html [--apply]
//
// The dry run exits 1 when any check failed, and --apply refuses on the same condition.
const fs = require('fs');
const B = require('./lib/blocklib');

const USAGE = 'Usage: node tools/pin_pms_alias.js --html site/index.html [--apply]';
const usage = msg => { if (msg) console.error(msg); console.error(USAGE); process.exit(2); };
const argv = process.argv.slice(2);
let APPLY = false, HTML = null;
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === '--apply') APPLY = true;
  else if (a === '--html') {
    const v = argv[++i];
    if (v == null || v.startsWith('--')) usage(a + ' needs a value');
    HTML = v;
  } else if (a.startsWith('--')) usage('unknown flag: ' + a);
  else usage('unexpected argument: ' + a);
}
if (!HTML) usage();

// Pin maps: tools/data/pins.json, shared with merge_pms_performance.js, merge_reckoner.js and
// merge_aif_performance.js (KNOWN_ISSUES A18). Its names are byte-exact; a deliberate trailing
// space that went missing, or a stray one, stops the run (A25). The pms_alias key
// 'Karma Capital Wealth Builder ' ends in a space because the MASTER record does.
function loadPins() {
  const P = require('./data/pins.json');
  const names = { pms_alias: Object.entries(P.pms_alias).flatMap(([k, e]) => [k, e.key]), reckoner: Object.entries(P.reckoner).flat() };
  for (const sec of Object.keys(names)) {
    const got = [...new Set(names[sec].filter(s => s !== s.trim()))].sort(), want = (P.trailing_space[sec] || []).slice().sort();
    if (JSON.stringify(got) !== JSON.stringify(want)) {
      console.error('*** tools/data/pins.json ' + sec + ': names with an edge space are ' + JSON.stringify(got) + ', trailing_space expects ' +
        JSON.stringify(want) + ' — a deliberate space was lost or a stray one added (KNOWN_ISSUES A25)');
      process.exit(1);
    }
  }
  return P;
}
// MASTER PMS fund name -> [exact PMS_PERFORMANCE.pms key, why it is right]
const PINS = Object.fromEntries(Object.entries(loadPins().pms_alias).filter(([, e]) => e.pin).map(([m, e]) => [m, [e.key, e.why]]));

const html = fs.readFileSync(HTML, 'utf8');
const alias = B.locate(html, 'window.PMS_PERF_ALIAS = ').value;
const perf = B.locate(html, 'window.PMS_PERFORMANCE = ').value;
const master = B.locate(html, 'window.MASTER = ').value;
const next = Object.assign({}, alias);

let fail = false;
for (const m of Object.keys(PINS)) {
  const key = PINS[m][0];
  if (!(m in alias)) { console.error('*** not in the alias map: "' + m + '"'); fail = true; continue; }
  if (!perf.pms[key]) { console.error('*** key not in PMS_PERFORMANCE.pms: "' + key + '"'); fail = true; continue; }
  const v = perf.pms[key];
  console.log('  ' + m);
  console.log('      -> ' + key);
  console.log('         ' + PINS[m][1]);
  console.log('         1Y ' + (v.r1y != null ? (v.r1y * 100).toFixed(2) + '%' : '—') +
              '   3Y ' + (v.r3y != null ? (v.r3y * 100).toFixed(2) + '%' : '—') +
              '   AUM ' + (v.aum != null ? v.aum.toLocaleString('en-IN') + ' Cr' : '—'));
  next[m] = key;
}

const pinFail = fail;
const pmsFunds = master.filter(r => r.product_class === 'PMS');
const before = pmsFunds.filter(f => alias[f.name] && perf.pms[alias[f.name]]).length;
const after = pmsFunds.filter(f => next[f.name] && perf.pms[next[f.name]]).length;
console.log('\nGATE MASTER PMS funds with performance: ' + before + ' -> ' + after + ' (of ' + pmsFunds.length + '): ' +
  (after < before ? '*** FAIL fewer funds would have performance' : 'PASS'));
console.log('GATE still pinned null: ' + Object.keys(next).filter(k => next[k] === null).join(' | '));
if (after < before) fail = true;
console.log('GATE every pin resolves against the PMS block on disk: ' + (pinFail ? '*** FAIL (see the *** lines above)' : 'PASS'));

if (!APPLY) { console.log('\n[dry run] pass --apply to write'); process.exit(fail ? 1 : 0); }
if (fail) { console.error('\n*** gate failed — refusing to write'); process.exit(1); }
const bytes = B.writeBlocks(HTML, [{ prefix: 'window.PMS_PERF_ALIAS = ', value: next }]);
console.log('\nWROTE ' + HTML + ' — ' + bytes + ' bytes');

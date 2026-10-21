// Every tool exits 2 with its usage line, and no stack trace, when an input path does not exist (D72).
// Exit 1 must mean only a failed gate. No workbooks needed: a missing source is a path that does not
// exist, and a bad --html is tried with a source that exists (package.json), so the page check is hit.
//   node tools/test/tool_inputs.test.js     (also run by `npm test` and by CI). Never passes --apply.
const fs = require('fs'), os = require('os'), path = require('path'), cp = require('child_process');

const ROOT = path.join(__dirname, '..', '..');
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'tool-inputs-'));
const NOPE = path.join(TMP, 'missing.xlsx'), NOPE_PPT = path.join(TMP, 'missing.pptx');
const NOPE_DIR = path.join(TMP, 'no-such-folder'), BAD = path.join(TMP, 'no-such-folder', 'index.html');
const ANY = path.join(ROOT, 'package.json');
const LONG = '30th September 2026';

const CASES = [
  ['merge_pms_performance', 'missing source', [NOPE, '--as-on', LONG, '--html', 'site/index.html']],
  ['merge_pms_performance', 'bad --html', [ANY, '--as-on', LONG, '--html', BAD]],
  ['merge_pms_aif_analytics', 'missing source', [NOPE, '--as-on', LONG]],
  ['merge_pms_aif_analytics', 'bad --html', [ANY, '--as-on', LONG, '--html', BAD]],
  ['merge_reckoner', 'missing source', [NOPE_PPT, '--html', 'site/index.html']],
  ['merge_reckoner', 'bad --html', [ANY, '--html', BAD]],
  ['merge_aif_performance', 'missing source', [NOPE_PPT]],
  ['merge_aif_performance', 'bad --html', [ANY, '--html', BAD]],
  ['add_reckoner_funds', 'missing source', [NOPE_PPT]],
  ['add_reckoner_funds', 'bad --html', [ANY, '--html', BAD]],
  ['bake_month', 'missing source', ['--dir', NOPE_DIR, '--as-on', LONG]],
  ['bake_month', 'bad --html', ['--dir', NOPE_DIR, '--as-on', LONG, '--html', BAD]],
  ['fill_variant_analytics', 'missing source', ['--dir', NOPE_DIR]],
  ['fill_variant_analytics', 'bad --html', ['--dir', NOPE_DIR, '--html', BAD]],
  ['fold_duplicate_names', 'missing source', ['--monitor', NOPE]],
  ['fold_duplicate_names', 'bad --html', ['--monitor', ANY, '--html', BAD]],
  ['rename_schemes', 'missing source', ['--monitor', NOPE]],
  ['rename_schemes', 'bad --html', ['--monitor', ANY, '--html', BAD]],
  ['rebuild_directperf', 'missing source', [NOPE]],
  ['rebuild_directperf', 'bad --html', [ANY, '--html', BAD]],
  ['pin_pms_alias', 'bad --html', ['--html', BAD]],
  ['rekey_sif_analytics', 'bad --html', ['--html', BAD]],
  ['fold_index_funds', 'bad --html', ['--html', BAD]],
  ['split_sif_add_mld', 'bad --html', ['--html', BAD]],
  ['merge_analytics', 'missing source', ['--hybrid', NOPE, '--as-on', LONG]],
  ['merge_analytics', 'bad --html', ['--hybrid', ANY, '--as-on', LONG, '--html', BAD]],
  ['merge_bond_list', 'missing source', [NOPE, '--desk', 'Invictus']],
  ['merge_bond_list', 'bad --html', [ANY, '--desk', 'Invictus', '--html', BAD]],
  ['merge_de_universe', 'missing source', [NOPE]],
  ['merge_de_universe', 'bad --html', [ANY, '--html', BAD]],
  ['merge_direct_equity_returns', 'missing source', [NOPE]],
  ['merge_direct_equity_returns', 'bad --html', [ANY, '--html', BAD]],
  ['merge_expense_exitload', 'missing source', ['--expense', NOPE]],
  ['merge_expense_exitload', 'bad --html', ['--expense', ANY, '--html', BAD]],
  ['merge_fund_managers', 'missing source', [NOPE]],
  ['merge_fund_managers', 'bad --html', [ANY, '--html', BAD]],
  ['merge_risk_matrix', 'missing source', [NOPE, '--as-on', '30 Sep 2026']],
  ['merge_risk_matrix', 'bad --html', [ANY, '--as-on', '30 Sep 2026', '--html', BAD]],
  ['merge_sif_monitor', 'missing source', [NOPE, '--as-on', LONG]],
  ['merge_sif_monitor', 'bad --sibling', [ANY, '--as-on', LONG, '--sibling', path.join(NOPE_DIR, 'sib.js')]],
  ['update_closing_slides', 'missing folder', ['--dir', NOPE_DIR]],
  ['update_market_slides', 'missing folder', ['--slides', NOPE_DIR]],
  ['verify_page', 'bad folder', [NOPE_DIR]],
];

let pass = 0, fail = 0;
const covered = new Set(CASES.map(c => c[0]));
const tools = fs.readdirSync(path.join(ROOT, 'tools')).filter(f => f.endsWith('.js')).map(f => f.slice(0, -3));
for (const t of tools) {
  if (covered.has(t)) continue;
  fail++; console.log('FAIL ' + t + ': no case in tool_inputs.test.js — add one');
}
for (const [tool, kind, args] of CASES) {
  const r = cp.spawnSync(process.execPath, [path.join('tools', tool + '.js'), ...args], { cwd: ROOT, encoding: 'utf8', timeout: 120000 });
  const out = (r.stderr || '') + (r.stdout || '');
  const why = r.status !== 2 ? 'exit ' + r.status
    : /\n\s+at .+:\d+:\d+\)?|node:(internal|fs)|Error: E[A-Z]+:/.test(out) ? 'stack trace'
    : !/Usage: node tools\//.test(r.stderr) ? 'no usage line' : null;
  if (why) { fail++; console.log(`FAIL ${tool} ${kind}: ${why}\n${out.split('\n').slice(0, 6).join('\n')}`); }
  else { pass++; console.log(`ok   ${tool} ${kind}`); }
}
fs.rmSync(TMP, { recursive: true, force: true });
console.log(`${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);

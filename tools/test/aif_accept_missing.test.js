// Tests for merge_aif_performance.js: the name-based coverage gate and --accept-missing <n> (October 2026
// Reckoner run, TASK-020). No deck and no page needed.   node tools/test/aif_accept_missing.test.js
const path = require('path'), cp = require('child_process'), os = require('os');
const TOOL = path.join(__dirname, '..', 'merge_aif_performance.js');
const { coverageGate } = require(TOOL);
let pass = 0, fail = 0;
const t = (name, fn) => {
  try { fn(); pass++; console.log('ok   ' + name); }
  catch (e) { fail++; console.log('FAIL ' + name + ': ' + e.message); }
};
const eq = (a, b, what) => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(what + ': ' + JSON.stringify(a) + ' != ' + JSON.stringify(b)); };

t('no fund loses its row: PASS without the flag', () => {
  const g = coverageGate(['A', 'B'], ['A', 'B', 'C'], null);
  eq([g.pass, g.lost], [true, []], 'gate');
});
t('a loss without the flag FAILS and names the fund', () => {
  const g = coverageGate(['A', 'B', 'K'], ['A', 'B'], null);
  eq([g.pass, g.lost], [false, ['K']], 'gate');
});
t('--accept-missing with the right number PASSES and lists the names', () => {
  const g = coverageGate(['A', 'Kotak', 'ICICI', 'Karma'], ['A', 'New'], 3);
  eq([g.pass, g.accepted, g.mismatch, g.lost], [true, true, false, ['ICICI', 'Karma', 'Kotak']], 'gate');
});
t('--accept-missing with a wrong number FAILS (mismatch)', () => {
  const g = coverageGate(['A', 'B', 'C'], ['A'], 1);
  eq([g.pass, g.mismatch, g.lost.length], [false, true, 2], 'gate');
});
t('a new row cannot hide a loss (12 -> 12 by count, one fund lost)', () => {
  const g = coverageGate(['A', 'B'], ['A', 'C'], null);
  eq([g.pass, g.lost], [false, ['B']], 'gate');
});
t('--accept-missing given when nothing is lost is a mismatch', () => {
  const g = coverageGate(['A'], ['A'], 2);
  eq([g.mismatch], [true], 'gate');
});
// The source argument is this test file and --html names a page that does not exist, so even a parser regression
// can never reach the real site/index.html.
const NO_PAGE = path.join(os.tmpdir(), 'aif-accept-missing-no-such-dir', 'index.html');
const run = args => cp.spawnSync(process.execPath, [TOOL, __filename, '--html', NO_PAGE].concat(args), { encoding: 'utf8' });
for (const bad of ['abc', '1.5', '-1']) {
  t('--accept-missing ' + bad + ' exits 2', () => {
    const r = run(['--accept-missing', bad]);
    if (r.status !== 2) throw new Error('exit ' + r.status);
  });
}
t('--accept-missing without a value exits 2', () => {
  const r = run(['--accept-missing']);
  if (r.status !== 2) throw new Error('exit ' + r.status);
});
t('--accept-missing followed by a flag exits 2', () => {
  const r = run(['--accept-missing', '--apply']);
  if (r.status !== 2) throw new Error('exit ' + r.status);
});

console.log('\n' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);

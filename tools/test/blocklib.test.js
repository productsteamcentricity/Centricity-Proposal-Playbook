// Unit tests for tools/lib/blocklib.js against the real site/index.html. No dependencies.
//   node tools/test/blocklib.test.js        (also run by `npm test` and by CI)
const B = require('../lib/blocklib');
const fs = require('fs'), os = require('os'), path = require('path');

const html = fs.readFileSync(path.join(__dirname, '..', '..', 'site', 'index.html'), 'utf8');
let pass = 0, fail = 0;
const t = (name, fn) => {
  try { fn(); pass++; console.log('ok   ' + name); }
  catch (e) { fail++; console.log('FAIL ' + name + ': ' + e.message); }
};
const expectThrow = (fn, re) => {
  try { fn(); } catch (e) { if (re.test(e.message)) return; throw new Error('wrong error: ' + e.message); }
  throw new Error('did not throw');
};

for (const p of ['window.MASTER = ', 'window.EQUITY_ANALYTICS = ', 'window.HYBRID_ANALYTICS = ', 'window.DEBT_ANALYTICS = ',
  'window.DIRECT_PERF = ', 'window.CENTRICITY_SELECT = ', 'window.MF_BENCHMARK_PERF = ', 'window.PMS_PERFORMANCE = ',
  'window.PMS_PERF_ALIAS = ', 'window.RISK_MATRIX = ']) {
  t('locate ' + p.trim() + ' (exactly one literal)', () => { if (!B.locate(html, p).value) throw new Error('no value'); });
}
t('a second literal with the same prefix is refused', () =>
  expectThrow(() => B.locate('window.X = {"a":1};\nwindow.X = {"b":2};', 'window.X = '), /2 literal occurrences/));
t('splicing a block back unchanged is byte-identical', () => {
  const m = B.locate(html, 'window.MASTER = ');
  if (B.spliceBlocks(html, [{ prefix: 'window.MASTER = ', value: m.value }]) !== html) throw new Error('bytes changed');
});
t('duplicate prefix in one write is refused', () =>
  expectThrow(() => B.spliceBlocks(html, [{ prefix: 'window.RISK_MATRIX = ', value: {} }, { prefix: 'window.RISK_MATRIX = ', value: {} }]), /duplicate prefix/));
t('checkAsOn accepts "31st October 2026"', () => B.checkAsOn('31st October 2026'));
t('checkAsOn short accepts "31 Oct 2026"', () => B.checkAsOn('31 Oct 2026', 'short'));
for (const bad of ['31st Octobr 2026', '31st October 2026"', '30th Sep 2026', '$& 2026', '31 October 2026', '']) {
  t('checkAsOn rejects ' + JSON.stringify(bad), () => expectThrow(() => B.checkAsOn(bad), /not a plain date label/));
}
t('checkAsOn short rejects the long style', () => expectThrow(() => B.checkAsOn('31st October 2026', 'short'), /not a plain/));
t('setDataDate changes exactly one line and is reversible', () => {
  const out = B.setDataDate(html, 'analytics', '31st October 2026');
  const a = html.split('\n'), b = out.split('\n');
  const d = a.map((l, i) => (l === b[i] ? null : i)).filter(x => x !== null);
  if (d.length !== 1 || !/analytics:\s+"31st October 2026",/.test(b[d[0]])) throw new Error('unexpected diff');
  if (B.setDataDate(out, 'analytics', '30th September 2026') !== html) throw new Error('not reversible');
});
t('setDataDate refuses an unknown key', () => expectThrow(() => B.setDataDate(html, 'nokey', '31st October 2026'), /found 0/));
t('replaceOnce treats $ literally', () => { if (B.replaceOnce('a "x" b', /"x"/, '"$&"') !== 'a "$&" b') throw new Error('$ interpreted'); });
t('replaceOnce refuses two matches', () => expectThrow(() => B.replaceOnce('x x', /x/, 'y'), /found 2/));

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'blocklib-'));
t('writeFileAtomic writes and leaves no temp file', () => {
  const f = path.join(dir, 'a.html'); fs.writeFileSync(f, 'old</html>');
  B.writeFileAtomic(f, 'new</html>');
  if (fs.readFileSync(f, 'utf8') !== 'new</html>' || fs.readdirSync(dir).length !== 1) throw new Error('bad state');
});
t('writeFilesAtomic validates every output before writing any', () => {
  const f = path.join(dir, 'a.html'), g = path.join(dir, 'b.js'); fs.writeFileSync(g, 'B');
  expectThrow(() => B.writeFilesAtomic([{ file: g, content: 'B2' }, { file: f, content: 'cut' }]), /does not end with/);
  if (fs.readFileSync(g, 'utf8') !== 'B') throw new Error('wrote the first file anyway');
});

// A OneDrive sync can block the rename for a moment (KNOWN_ISSUES R6). fs.renameSync / writeFileSync
// are replaced for one call to simulate it; the console note of each retry is silenced.
const fsErr = code => Object.assign(new Error(code + ': simulated'), { code });
function withFs(name, fake, fn) {
  const real = fs[name], realErr = console.error;
  fs[name] = fake(real); console.error = () => {};
  try { return fn(); } finally { fs[name] = real; console.error = realErr; }
}
const failFirst = (codes, calls) => real => (a, b) => { calls.push(a); if (calls.length <= codes.length) throw fsErr(codes[calls.length - 1]); return real(a, b); };
const onlyTarget = () => { const left = fs.readdirSync(dir).filter(n => n.endsWith('.tmp')); if (left.length) throw new Error('temp file left: ' + left); };
t('writeFileAtomic retries a rename blocked by EPERM, then writes', () => {
  const f = path.join(dir, 'r.html'); fs.writeFileSync(f, 'old</html>');
  const calls = [];
  withFs('renameSync', failFirst(['EPERM', 'EPERM'], calls), () => B.writeFileAtomic(f, 'new</html>', [1, 1, 1]));
  if (calls.length !== 3 || fs.readFileSync(f, 'utf8') !== 'new</html>') throw new Error(calls.length + ' attempts, content ' + fs.readFileSync(f, 'utf8'));
  onlyTarget();
});
t('writeFileAtomic retries EBUSY and EACCES too', () => {
  const f = path.join(dir, 'r.html'); const calls = [];
  withFs('renameSync', failFirst(['EBUSY', 'EACCES'], calls), () => B.writeFileAtomic(f, 'v2</html>', [1, 1, 1]));
  if (calls.length !== 3 || fs.readFileSync(f, 'utf8') !== 'v2</html>') throw new Error('not written after retries');
  onlyTarget();
});
t('writeFileAtomic waits between retries (doubling pauses)', () => {
  const f = path.join(dir, 'r.html'); const calls = []; const t0 = Date.now();
  withFs('renameSync', failFirst(['EPERM', 'EPERM'], calls), () => B.writeFileAtomic(f, 'v3</html>', [40, 80, 160]));
  const ms = Date.now() - t0;
  if (ms < 115) throw new Error('waited only ' + ms + ' ms for 40 + 80');
});
t('writeFileAtomic gives up after the last retry: throws, target unchanged, no temp file', () => {
  const f = path.join(dir, 'r.html'); fs.writeFileSync(f, 'keep</html>'); const calls = [];
  expectThrow(() => withFs('renameSync', failFirst(Array(9).fill('EPERM'), calls), () => B.writeFileAtomic(f, 'lost</html>', [1, 1, 1])), /EPERM/);
  if (calls.length !== 4) throw new Error(calls.length + ' attempts, expected 1 + 3 retries');
  if (fs.readFileSync(f, 'utf8') !== 'keep</html>') throw new Error('target changed');
  onlyTarget();
});
t('writeFileAtomic does not retry other errors (EXDEV) and removes the temp file', () => {
  const f = path.join(dir, 'r.html'); const calls = [];
  expectThrow(() => withFs('renameSync', failFirst(['EXDEV'], calls), () => B.writeFileAtomic(f, 'x</html>', [1, 1, 1])), /EXDEV/);
  if (calls.length !== 1) throw new Error(calls.length + ' attempts');
  if (fs.readFileSync(f, 'utf8') !== 'keep</html>') throw new Error('target changed');
  onlyTarget();
});
t('writeFileAtomic removes a half-written temp file when the write itself fails', () => {
  const f = path.join(dir, 'r.html');
  const halfWrite = real => (p, c) => { real(p, String(c).slice(0, 3)); throw fsErr('ENOSPC'); };
  expectThrow(() => withFs('writeFileSync', halfWrite, () => B.writeFileAtomic(f, 'full</html>')), /ENOSPC/);
  if (fs.readFileSync(f, 'utf8') !== 'keep</html>') throw new Error('target changed');
  onlyTarget();
});
fs.rmSync(dir, { recursive: true });

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);

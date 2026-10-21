// Rehearse a tool chain with --apply on two disposable copies of site/ — one with an OLD version
// of the tools, one with the NEW — and report exactly what each wrote and how they differ.
// Nothing under the real site/ is touched. Use it to prove a tool change is behaviour-preserving
// (or that its only effect is the intended one).
//
//   node tools/dev/rehearse.js --old <old repo root> [--old-site <dir>] [--new <new repo root>] [--case a,b] [--list] [--keep]
//   node tools/dev/rehearse.js --old-site <dir> [...]      (old side = these tools on another site/)
//
// The old root is usually a worktree of main:  git worktree add --detach <short path> main
// Both sides start from <new root>/site and read inputs from <new root>/monthly-updates, unless
// --old-site seeds the old side from another site folder (e.g. <old root>/site): that compares a
// page-code change, since the vm tools run the parsers of the page they are given (KNOWN_ISSUES A27).
// Without --old, --old-site runs this checkout's tools on both sides.
const fs = require('fs'), os = require('os'), path = require('path'), cp = require('child_process'), vm = require('vm');
const CASES = require('./rehearsal_cases');

const argv = process.argv.slice(2);
const flag = n => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : null; };
const NEW = path.resolve(flag('--new') || path.join(__dirname, '..', '..'));
const OLD_SITE = flag('--old-site') && path.resolve(flag('--old-site'));
const OLD = flag('--old') ? path.resolve(flag('--old')) : OLD_SITE ? NEW : null;
if (argv.includes('--list')) { for (const c of CASES) console.log(c.name.padEnd(26) + c.desc); process.exit(0); }
const USAGE = 'Usage: node tools/dev/rehearse.js --old <old repo root> [--old-site <dir>] [--new <root>] [--case a,b] [--list] [--keep]' +
  '  (--old-site alone: this checkout\'s tools on both sides, the old side seeded from <dir>)';
if (!OLD) { console.error(USAGE); process.exit(2); }
const pick = flag('--case') ? flag('--case').split(',') : CASES.map(c => c.name);
const MU = path.join(NEW, 'monthly-updates');
const SITE_FILES = fs.readdirSync(path.join(NEW, 'site')).filter(f => !f.startsWith('.'));
const SEED = { old: OLD_SITE || path.join(NEW, 'site'), new: path.join(NEW, 'site') };
if (OLD_SITE) {
  const missing = SITE_FILES.filter(f => !fs.existsSync(path.join(OLD_SITE, f)));
  if (missing.length) { console.error('*** --old-site ' + OLD_SITE + ' lacks: ' + missing.join(', ')); console.error(USAGE); process.exit(2); }
}
const PREFIXES = ['MASTER', 'EQUITY_ANALYTICS', 'HYBRID_ANALYTICS', 'DEBT_ANALYTICS', 'DIRECT_PERF', 'CENTRICITY_SELECT',
  'MF_BENCHMARK_PERF', 'PMS_PERFORMANCE', 'PMS_PERF_ALIAS', 'RISK_MATRIX'].map(k => 'window.' + k + ' = ');
const B = require(path.join(NEW, 'tools', 'lib', 'blocklib'));

function decodeSlides(siteDir, out) {
  const sb = {}; sb.window = sb; vm.createContext(sb);
  vm.runInContext(fs.readFileSync(path.join(siteDir, 'Centricity_ExtraSlides.js'), 'utf8'), sb);
  const dec = u => { const m = /^data:image\/(\w+);base64,(.*)$/s.exec(u); return { ext: m[1] === 'jpeg' ? 'jpg' : m[1], buf: Buffer.from(m[2], 'base64') }; };
  fs.mkdirSync(path.join(out, 'market'), { recursive: true }); fs.mkdirSync(path.join(out, 'closing'), { recursive: true });
  sb.EXTRA_SLIDES.market.forEach((u, i) => { const d = dec(u); fs.writeFileSync(path.join(out, 'market', `slide${i + 1}.${d.ext}`), d.buf); });
  for (const k of ['disclaimer', 'thankyou']) { const d = dec(sb.EXTRA_SLIDES[k]); fs.writeFileSync(path.join(out, 'closing', `${k}.${d.ext}`), d.buf); }
}

function fill(a, ctx) { return a.replace(/\{(\w+)\}/g, (m, k) => (k in ctx ? ctx[k] : m)); }

function runSide(root, c, label, work) {
  const site = path.join(work, label, 'site'); fs.mkdirSync(site, { recursive: true });
  for (const f of SITE_FILES) fs.copyFileSync(path.join(SEED[label], f), path.join(site, f));
  const slides = path.join(work, label, 'slides'); decodeSlides(site, slides);
  const ctx = { SITE: site, HTML: path.join(site, 'index.html'), MU, SLIDES: slides };
  const log = [];
  for (const st of c.steps) {
    const args = (label === 'old' ? (st.oldArgs || st.args) : (st.newArgs || st.args)).map(a => fill(a, ctx));
    if (st.apply !== false) args.push('--apply');
    const r = cp.spawnSync(process.execPath, [path.join(root, 'tools', st.tool), ...args],
      { cwd: NEW, encoding: 'utf8', env: { ...process.env, NODE_PATH: path.join(NEW, 'node_modules') }, maxBuffer: 1 << 28 });
    log.push({ tool: st.tool, exit: r.status, out: (r.stdout || '') + (r.stderr || '') + (r.error ? '\n*** spawn failed: ' + r.error.message : '') });
    if (r.status !== 0) break;
  }
  return { site, log };
}

function masterDiff(a, b) {
  const A = new Map(a.map(r => [r.name, r])), Bm = new Map(b.map(r => [r.name, r]));
  const fields = {}; let changed = 0;
  for (const [n, r] of A) {
    const s = Bm.get(n); if (!s) continue;
    let any = false;
    for (const k of new Set([...Object.keys(r), ...Object.keys(s)])) {
      if (JSON.stringify(r[k]) !== JSON.stringify(s[k])) { fields[k] = (fields[k] || 0) + 1; any = true; }
    }
    if (any) changed++;
  }
  return { onlyInA: [...A.keys()].filter(n => !Bm.has(n)).length, onlyInB: [...Bm.keys()].filter(n => !A.has(n)).length, changedRecords: changed, fields };
}

function storeDiff(a, b) {
  const ka = Object.keys(a), kb = Object.keys(b);
  const changed = ka.filter(k => k in b && JSON.stringify(a[k]) !== JSON.stringify(b[k])).length;
  return { onlyInA: ka.filter(k => !(k in b)).length, onlyInB: kb.filter(k => !(k in a)).length, changedKeys: changed };
}

// index.html with every data block emptied and DATA_DATES removed: the page code a tool must not change.
function codeOf(html) {
  let r = html;
  for (const p of PREFIXES) { try { const l = B.locate(r, p); r = r.slice(0, l.s) + '{}' + r.slice(l.e + 1); } catch (e) { /* reported by compareSites */ } }
  return r.replace(/window\.DATA_DATES = \{[\s\S]*?\};/, '').replace(/window\.DATA_DATES\.riskMatrix = [^\n]*/, '');
}

// With --old-site the two sides start from different files, so OLD vs NEW differs in code by design.
// The data verdict ignores exactly that: index.html may differ outside its blocks and dates only if
// each side's code is still its seed's code, and a sibling may differ only if neither side wrote it.
function dataVerdict(oldVsNew, oldSite, newSite) {
  const left = [];
  for (const it of oldVsNew) {
    const out = side => fs.readFileSync(path.join(side === 'old' ? oldSite : newSite, it.file), 'utf8');
    const seed = side => fs.readFileSync(path.join(SEED[side], it.file), 'utf8');
    if (it.file === 'index.html') {
      const sameCode = codeOf(out('old')) === codeOf(seed('old')) && codeOf(out('new')) === codeOf(seed('new'));
      if (Object.keys(it.blocks).length || it.dataDates || (it.otherCodeDiffers && !sameCode)) left.push(it);
    } else if (out('old') !== seed('old') || out('new') !== seed('new')) left.push(it);
  }
  return left;
}

function compareSites(dirA, dirB) {
  const out = [];
  for (const f of SITE_FILES) {
    const a = fs.readFileSync(path.join(dirA, f), 'utf8'), b = fs.readFileSync(path.join(dirB, f), 'utf8');
    if (a === b) continue;
    const item = { file: f, bytesA: a.length, bytesB: b.length };
    if (f === 'index.html') {
      item.blocks = {};
      for (const p of PREFIXES) {
        let va, vb; try { va = B.locate(a, p).value; vb = B.locate(b, p).value; } catch (e) { item.blocks[p.trim()] = 'unreadable: ' + e.message; continue; }
        if (JSON.stringify(va) === JSON.stringify(vb)) continue;
        item.blocks[p.trim()] = Array.isArray(va) ? masterDiff(va, vb) : storeDiff(va, vb);
      }
      const dd = s => (s.match(/window\.DATA_DATES = \{[\s\S]*?\};/) || [''])[0] + ((s.match(/window\.DATA_DATES\.riskMatrix = [^\n]*/) || [''])[0]);
      if (dd(a) !== dd(b)) item.dataDates = { a: dd(a).replace(/\s+/g, ' ').slice(0, 400), b: dd(b).replace(/\s+/g, ' ').slice(0, 400) };
      // anything outside the known blocks and dates?
      if (codeOf(a) !== codeOf(b)) item.otherCodeDiffers = true;
    }
    out.push(item);
  }
  return out;
}

const work = fs.mkdtempSync(path.join(os.tmpdir(), 'rehearse-'));
const report = [];
for (const name of pick) {
  const c = CASES.find(x => x.name === name);
  if (!c) { console.error('unknown case: ' + name); process.exit(2); }
  const caseDir = path.join(work, name);
  const o = runSide(OLD, c, 'old', caseDir), n = runSide(NEW, c, 'new', caseDir);
  const base = path.join(NEW, 'site');
  const r = {
    case: name, desc: c.desc,
    exits: { old: o.log.map(l => `${l.tool}=${l.exit}`).join(' '), new: n.log.map(l => `${l.tool}=${l.exit}`).join(' ') },
    oldVsBaseline: compareSites(SEED.old, o.site).map(x => x.file),
    newVsBaseline: compareSites(base, n.site).map(x => x.file),
    oldVsNew: compareSites(o.site, n.site),
  };
  r.identical = r.oldVsNew.length === 0;
  if (OLD_SITE) { r.dataDiffers = dataVerdict(r.oldVsNew, o.site, n.site); r.dataIdentical = r.dataDiffers.length === 0; }
  report.push(r);
  fs.writeFileSync(path.join(caseDir, 'logs.json'), JSON.stringify({ old: o.log, new: n.log }, null, 1));
  console.log(`\n=== ${name} — ${c.desc}`);
  console.log(`  exits  old: ${r.exits.old}\n         new: ${r.exits.new}`);
  console.log(`  files changed vs ${OLD_SITE ? 'own seed' : 'live'}  old: [${r.oldVsBaseline.join(', ')}]  new: [${r.newVsBaseline.join(', ')}]`);
  if (OLD_SITE && r.dataIdentical) console.log('  OLD and NEW data: IDENTICAL' + (r.identical ? '' : ' (the files differ only in the page code the two seeds already differ in)'));
  else if (OLD_SITE) console.log('  OLD and NEW data DIFFER:\n' + JSON.stringify(r.dataDiffers, null, 1).replace(/^/gm, '    '));
  else console.log(r.identical ? '  OLD and NEW outputs: IDENTICAL' : '  OLD and NEW outputs DIFFER:\n' + JSON.stringify(r.oldVsNew, null, 1).replace(/^/gm, '    '));
  console.log(`  logs: ${path.join(caseDir, 'logs.json')}`);
}
fs.writeFileSync(path.join(work, 'report.json'), JSON.stringify(report, null, 1));
console.log(`\nreport: ${path.join(work, 'report.json')}`);
if (!argv.includes('--keep')) for (const r of report) for (const s of ['old', 'new']) fs.rmSync(path.join(work, r.case, s), { recursive: true, force: true });

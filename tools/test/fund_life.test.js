// Unit tests for the young-fund rule (TASK-067; D94, D103): tools/lib/fund_life.js, the rule inside
// tools/lib/direct_perf.js (a small synthetic Direct workbook, no monthly or client data), and the
// exit-2 cases of the --nav-date flags of bake_month.js and rebuild_directperf.js (dry runs that stop
// before reading any workbook). Needs the xlsx package (npm ci).   node tools/test/fund_life.test.js
const fs = require('fs'), os = require('os'), path = require('path'), cp = require('child_process');
const XLSX = require('xlsx');
const FL = require('../lib/fund_life');
const { buildDirectPerf } = require('../lib/direct_perf');

let pass = 0, fail = 0;
const t = (name, fn) => {
  try { fn(); pass++; console.log('ok   ' + name); }
  catch (e) { fail++; console.log('FAIL ' + name + ': ' + e.message); }
};
const eq = (a, b) => { const x = JSON.stringify(a), y = JSON.stringify(b); if (x !== y) throw new Error(`${x} !== ${y}`); };
const near = (a, b) => { if (typeof a !== 'number' || Math.abs(a - b) > 1e-9 * Math.max(1, Math.abs(b))) throw new Error(`${a} is not ${b}`); };
const throws = (fn, re) => { try { fn(); } catch (e) { if (re && !re.test(e.message)) throw new Error('wrong error: ' + e.message); return; } throw new Error('did not throw'); };

// ---------- constants ----------
t('MF class set includes the plural "Mutual Funds"', () => eq(['Mutual Fund', 'Mutual Funds', 'ETF', 'Index Fund'].every(c => FL.MF_CLASSES.has(c)) && FL.MF_CLASSES.size === 4, true));
t('bound is 3.0 (300% as a decimal)', () => eq(FL.BOUND, 3));
t('return keys are mtd..r10y and si', () => eq(FL.RETURN_KEYS, ['mtd', 'r1m', 'r3m', 'r6m', 'r1y', 'r2y', 'r3y', 'r5y', 'r10y', 'si']));

// ---------- ISO dates ----------
t('isIsoDate: real dates', () => eq(['2026-09-30', '2028-02-29', '2026-12-31'].map(FL.isIsoDate), [true, true, true]));
t('isIsoDate: impossible or badly written dates', () => eq(['2026-02-30', '2027-02-29', '2026-11-2', '2026-13-01', '2026-00-10', '', null, '30-09-2026'].map(FL.isIsoDate), [false, false, false, false, false, false, false, false]));

// ---------- period starts (the date rule) ----------
const S = nav => Object.fromEntries(FL.PERIODS.map(([k, n]) => [k, FL.periodStart(nav, n)]));
t('month-end NAV 2026-09-30', () => eq(S('2026-09-30'), { mtd: '2026-08-31', r1m: '2026-08-30', r3m: '2026-06-30', r6m: '2026-03-30', r1y: '2025-09-30', r2y: '2024-09-30', r3y: '2023-09-30', r5y: '2021-09-30', r10y: '2016-09-30' }));
t('31-Mar minus 1 month is 28-Feb', () => eq(FL.periodStart('2026-03-31', 1), '2026-02-28'));
t('31-Mar-2028 minus 1 month is 29-Feb (leap year)', () => eq(FL.periodStart('2028-03-31', 1), '2028-02-29'));
t('29-Feb-2028 minus 1 year is 28-Feb-2027', () => eq(FL.periodStart('2028-02-29', 12), '2027-02-28'));
t('31-Aug minus 6 months is 28-Feb', () => eq(FL.periodStart('2026-08-31', 6), '2026-02-28'));
t('NAV 2026-11-02 (D99): mtd, r1m, r3m, r1y starts', () => eq([0, 1, 3, 12].map(n => FL.periodStart('2026-11-02', n)), ['2026-10-31', '2026-10-02', '2026-08-02', '2025-11-02']));
t('January NAV: mtd starts 31-Dec of the year before', () => eq(FL.periodStart('2026-01-15', 0), '2025-12-31'));
t('January NAV minus 3 months crosses the year', () => eq(FL.periodStart('2026-01-31', 3), '2025-10-31'));
t('periodStart refuses a bad NAV date', () => throws(() => FL.periodStart('2026-02-30', 1), /NAV date/));

// ---------- --as-on label to ISO ----------
t('asOnToIso: house-style labels', () => eq(['30th September 2026', '31st October 2026', '2nd November 2026', '1st January 2027'].map(FL.asOnToIso), ['2026-09-30', '2026-10-31', '2026-11-02', '2027-01-01']));
t('asOnToIso: impossible or other-style labels give null', () => eq(['31st February 2026', '31st September 2026', '30 Sep 2026', '30th Sept 2026', ''].map(FL.asOnToIso), [null, null, null, null, null]));

// ---------- NAV date window (+-7 days of the as-on date) ----------
t('checkNavDate: 24-Oct and 7-Nov accepted for 31-Oct-2026', () => eq([FL.checkNavDate('2026-10-24', '2026-10-31'), FL.checkNavDate('2026-11-07', '2026-10-31'), FL.checkNavDate('2026-11-02', '2026-10-31')], [null, null, null]));
t('checkNavDate: 23-Oct and 8-Nov refused for 31-Oct-2026', () => eq([FL.checkNavDate('2026-10-23', '2026-10-31'), FL.checkNavDate('2026-11-08', '2026-10-31')].map(m => /8 days/.test(m)), [true, true]));
t('checkNavDate: an impossible date is refused', () => eq(/not a real date/.test(FL.checkNavDate('2026-02-30', '2026-02-28')), true));

// ---------- the rule (D94 periods, D103 si) ----------
// A JioBlackRock Regular plan launched 17-Aug-2026 carrying the older Direct plan's r3m/r6m/r1y (C20).
const jioLiquid = () => ({ name: 'JioBlackRock Liquid Fund-Reg(G)', r1m: 0.00495, r3m: 0.016876, r6m: 0.034312, r1y: 0.064583, r2y: null, r3y: null, si: 0.056894, inception: '2026-08-17' });
t('C20: periods older than the plan are cleared, r1m and si kept', () => eq(FL.lifeClears(jioLiquid(), '2026-08-17', '2026-09-30'), ['r3m', 'r6m', 'r1y']));
t('C20 at the October NAV 2026-11-02: r3m still cleared, mtd and r1m kept', () => eq(FL.lifeClears({ mtd: 0.001, r1m: 0.005, r3m: 0.0169, si: 0.05 }, '2026-08-17', '2026-11-02'), ['r3m']));
t('C20 at the November month end: r3m is kept once the fund is three months old', () => eq(FL.lifeClears({ r3m: 0.0169 }, '2026-08-17', '2026-11-30'), []));
t('inception equal to the period start is kept (1-year boundary)', () => eq(FL.lifeClears({ r1y: -0.01413, si: -0.01413 }, '2025-09-30', '2026-09-30'), []));
t('a fund with inception exactly one year back is not young', () => eq(FL.isYoung('2025-09-30', '2026-09-30'), false));
t('one day younger: r1y cleared, an in-bound si kept', () => eq(FL.lifeClears({ r1y: -0.01413, si: -0.01413 }, '2025-10-01', '2026-09-30'), ['r1y']));
t('C43: a 15-day-old fund with si 2977.646 has si cleared', () => eq(FL.lifeClears({ si: 2977.646195 }, '2026-09-15', '2026-09-30'), ['si']));
t('D103: young fund si within +-300% is kept (107%, -69%, -45%)', () => eq([1.072061, -0.689411, -0.453509].map(si => FL.lifeClears({ si }, '2026-09-28', '2026-09-30')), [[], [], []]));
t('D103: si exactly 3.0 kept, just above cleared, -3.5 cleared', () => eq([3.0, 3.0000001, -3.5].map(si => FL.lifeClears({ si }, '2026-06-01', '2026-09-30')), [[], ['si'], ['si']]));
t('D103: an old fund keeps an extreme si (the gate reports it instead)', () => { eq(FL.lifeClears({ si: 3.5 }, '2020-01-01', '2026-09-30'), []); eq(FL.outlierKeys({ si: 3.5, r1y: 0.1 }), ['si']); });
t('a 2-day-old fund: mtd and r1m cleared, si within bound kept', () => eq(FL.lifeClears({ mtd: 0.01, r1m: 0.01, si: 1.072 }, '2026-09-28', '2026-09-30'), ['mtd', 'r1m']));
t('null and absent fields are never reported', () => eq(FL.lifeClears({ r3m: null, si: null }, '2026-09-28', '2026-09-30'), []));
t('the rule does not change the record or its scale', () => { const r = jioLiquid(); const before = JSON.stringify(r); FL.lifeClears(r, r.inception, '2026-09-30'); eq(JSON.stringify(r), before); });
t('lifeClears refuses a non-ISO inception', () => throws(() => FL.lifeClears({ r1y: 0.1 }, '17-Aug-2026', '2026-09-30'), /inception/));
const apply = (r, nav) => { for (const k of FL.lifeClears(r, r.inception, nav)) r[k] = null; return r; };
t('idempotent: applying the rule twice gives the same record', () => { const a = apply(jioLiquid(), '2026-09-30'); const b = apply(apply(jioLiquid(), '2026-09-30'), '2026-09-30'); eq(a, b); eq([a.r3m, a.r6m, a.r1y, a.r1m], [null, null, null, 0.00495]); });
t('hasReturn and outlierKeys', () => { eq([FL.hasReturn({ si: 0 }), FL.hasReturn({ aum: 5, r1y: null })], [true, false]); eq(FL.outlierKeys({ r1m: -3.2, r1y: 0.1, si: 2977 }), ['r1m', 'si']); });

// ---------- the rule inside buildDirectPerf ----------
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'fund-life-'));
// Removed on any exit, including a crash outside t() (the synthetic workbook never outlives the run).
process.on('exit', () => fs.rmSync(TMP, { recursive: true, force: true }));
const serial = iso => { const [y, m, d] = iso.split('-').map(Number); return (Date.UTC(y, m - 1, d) - Date.UTC(1899, 11, 30)) / 86400000; };
const HEAD = ['Scheme Name', 'AUM (Cr.)', 'MTD', '1 Month', '3 Months', '6 Months', '1 Year', 'SINCE INCEPTION', 'Inception Date'];
function sheet(rows) {   // rows: [name, mtd, r1m, r3m, r6m, r1y, si, inceptionIso|text|null]; returns in percent
  const aoa = [['Daily MF Monitor'], [], HEAD].concat(rows.map(([n, mtd, r1m, r3m, r6m, r1y, si]) => [n, 100, mtd, r1m, r3m, r6m, r1y, si, null]));
  const ws = XLSX.utils.aoa_to_sheet(aoa);
  rows.forEach((row, i) => {
    const inc = row[7], addr = XLSX.utils.encode_cell({ r: 3 + i, c: 8 });
    if (inc == null) delete ws[addr];
    else if (/^\d{4}-\d{2}-\d{2}$/.test(inc)) ws[addr] = { t: 'n', v: serial(inc), z: 'dd-mmm-yyyy' };
    else ws[addr] = { t: 's', v: inc };
  });
  return ws;
}
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, sheet([
  ['Old Fund(G)-Direct Plan', 0.5, 1.0, 1.6, 3.4, 6.5, 6.2, '2025-08-18'],
  ['Renamed Fund(G)-Direct Plan', 0.5, 0.5, 1.6, 3.3, 6.4, 5.6, '2026-08-17'],
  ['Extreme ETF(G)-Direct Plan', null, null, null, null, null, 297764.6, '2026-09-15'],
  ['Young FOF(G)-Direct Plan', null, null, null, null, null, 107.2, '2026-09-28'],
  ['Collapse Fund(G)-Direct Plan', 0.4, 0.5, 2.0, null, null, 4.0, '2026-08-17'],
  ['Clash Fund(G)-Direct Plan', 0.4, 0.5, 2.0, null, null, 4.0, '2026-08-17'],
  ['NoDate Fund(G)-Direct Plan', 0.4, 0.5, 2.0, null, null, 4.0, null],
  ['Blank Fund(G)-Direct Plan', null, null, null, null, null, null, null],
  ['Future Fund(G)-Direct Plan', 0.1, null, null, null, null, 0.1, '2026-10-05'],
  ['Prelaunch Fund(G)-Direct Plan', null, null, null, null, null, null, '2026-10-05'],
  ['Text Date Fund(G)-Direct Plan', 0.4, null, null, null, null, 4.0, '17-Aug-2026'],
]), 'Index');
XLSX.utils.book_append_sheet(wb, sheet([
  ['Collapse Fund(G)-Direct Plan', 0.4, 0.5, 2.1, null, null, 4.1, '2026-08-17'],
  ['Clash Fund(G)-Direct Plan(Adjusted)', 0.4, 0.5, 2.0, null, null, 4.0, '2025-01-01'],
]), 'Debt');
const SRC = path.join(TMP, 'direct.xlsx');
XLSX.writeFile(wb, SRC);
const NAMES = ['Old', 'Renamed', 'Extreme ETF', 'Young FOF', 'Collapse', 'Clash', 'NoDate', 'Blank', 'Future', 'Prelaunch', 'Text Date'];
const master = NAMES.map(n => ({ name: /ETF|FOF/.test(n) ? `${n}-Reg(G)` : `${n} Fund-Reg(G)` }));
const KEY = n => master.find(m => m.name.startsWith(n)).name;

t('buildDirectPerf throws without opts.navDate', () => throws(() => buildDirectPerf(SRC, master), /navDate/));
t('buildDirectPerf throws on an impossible navDate', () => throws(() => buildDirectPerf(SRC, master, { navDate: '2026-02-30' }), /navDate/));
const rd = buildDirectPerf(SRC, master, { navDate: '2026-09-30' });
const DP = rd.store;
const clearedOf = n => rd.cleared.filter(c => c.key === KEY(n)).map(c => c.field);
t('Direct: every Direct row paired', () => eq([rd.matched, rd.unmatched], [13, 0]));
t('Direct: an old plan keeps every return, on MASTER scale (decimals)', () => { eq(clearedOf('Old'), []); eq([DP[KEY('Old')].r1y, DP[KEY('Old')].si], [0.065, 0.062]); });
t('Direct: periods longer than the life are DELETED, not set to null', () => { eq(clearedOf('Renamed'), ['r3m', 'r6m', 'r1y']); eq(['r3m', 'r6m', 'r1y'].map(k => k in DP[KEY('Renamed')]), [false, false, false]); eq(DP[KEY('Renamed')].r1m, 0.005); });
t('Direct: an extreme young si is deleted (C43 pattern)', () => { eq(clearedOf('Extreme ETF'), ['si']); eq('si' in DP[KEY('Extreme ETF')], false); });
t('Direct: a young si within +-300% is kept (D103)', () => { eq(clearedOf('Young FOF'), []); eq(DP[KEY('Young FOF')].si, 1.072); });
t('Direct: two rows collapsing to one key are ruled once, after the merge', () => { eq(clearedOf('Collapse'), ['r3m']); eq('r3m' in DP[KEY('Collapse')], false); near(DP[KEY('Collapse')].si, 0.041); });
const fails = rd.inceptionIssues.fail, warns = rd.inceptionIssues.warn;
const failOf = n => fails.filter(i => i.key === KEY(n)).map(i => i.reason);
t('Direct: rows of one key that disagree on inception FAIL and are not ruled', () => { eq(failOf('Clash').length === 1 && /disagree/.test(failOf('Clash')[0]), true); eq(DP[KEY('Clash')].r3m, 0.02); });
t('Direct: a missing inception on a row with returns FAILs', () => eq(/missing/.test(failOf('NoDate')[0]), true));
t('Direct: a non-ISO inception text on a row with returns FAILs', () => eq(/non-ISO/.test(failOf('Text Date')[0]), true));
t('Direct: a missing inception on a row without returns is a WARN only', () => { eq(failOf('Blank'), []); eq(warns.some(w => w.key === KEY('Blank') && /missing/.test(w.reason)), true); });
t('Direct: a future inception without any return (listed before allotment) is a WARN only', () => { eq(failOf('Prelaunch'), []); eq(warns.some(w => w.key === KEY('Prelaunch') && /before allotment/.test(w.reason)), true); eq(warns.length, 2); });
t('Direct: an inception after the NAV date on a row with a return FAILs and is not ruled', () => { eq(/after the NAV date/.test(failOf('Future')[0]), true); eq(DP[KEY('Future')].mtd, 0.001); });
t('Direct: inception is not stored in DIRECT_PERF', () => eq(Object.values(DP).some(v => 'inception' in v), false));
t('Direct: cleared entries carry the old value and the inception', () => { const c = rd.cleared.find(x => x.key === KEY('Extreme ETF')); eq([c.field, c.inception], ['si', '2026-09-15']); near(c.value, 2977.646); });

// ---------- CLI: --nav-date / --nav-date-direct exit 2 (no workbook is read) ----------
const ROOT = path.join(__dirname, '..', '..');
const EMPTY = fs.mkdtempSync(path.join(os.tmpdir(), 'fund-life-dir-'));   // a month folder with no inputs
process.on('exit', () => fs.rmSync(EMPTY, { recursive: true, force: true }));
const run = (tool, args) => { const r = cp.spawnSync(process.execPath, [path.join('tools', tool + '.js'), ...args], { cwd: ROOT, encoding: 'utf8', timeout: 120000 }); return { code: r.status, err: r.stderr || '', out: (r.stderr || '') + (r.stdout || '') }; };
const usage2 = (r, re) => { if (r.code !== 2) throw new Error('exit ' + r.code); if (!/Usage: node tools\//.test(r.err)) throw new Error('no usage line'); if (/\n\s+at .+:\d+:\d+\)?/.test(r.out)) throw new Error('stack trace'); if (re && !re.test(r.err)) throw new Error('unexpected message: ' + r.err.split('\n')[0]); };
const BAKE = ['--dir', EMPTY, '--as-on', '31st October 2026', '--html', 'site/index.html'];
const passedNav = r => { if (r.code !== 2 || /nav-date/.test(r.err) || !/cannot read the folder|missing source/.test(r.err)) throw new Error(`exit ${r.code}: ${r.err.split('\n')[0]}`); };
t('bake_month: --nav-date 2026-02-30 exits 2', () => usage2(run('bake_month', [...BAKE, '--nav-date', '2026-02-30']), /--nav-date .*not a real date/));
t('bake_month: --nav-date 2026-11-2 exits 2', () => usage2(run('bake_month', [...BAKE, '--nav-date', '2026-11-2']), /--nav-date/));
t('bake_month: --nav-date 8 days after the as-on date exits 2', () => usage2(run('bake_month', [...BAKE, '--nav-date', '2026-11-08']), /8 days/));
t('bake_month: --nav-date 8 days before the as-on date exits 2', () => usage2(run('bake_month', [...BAKE, '--nav-date', '2026-10-23']), /8 days/));
t('bake_month: --nav-date-direct out of range exits 2', () => usage2(run('bake_month', [...BAKE, '--nav-date-direct', '2026-11-09']), /--nav-date-direct/));
t('bake_month: --nav-date without a value exits 2', () => usage2(run('bake_month', [...BAKE, '--nav-date']), /needs a value/));
t('bake_month: an impossible --as-on date exits 2', () => usage2(run('bake_month', ['--dir', EMPTY, '--as-on', '31st February 2026', '--html', 'site/index.html']), /real calendar date/));
t('bake_month: --nav-date 2026-11-07 (7 days) is accepted', () => passedNav(run('bake_month', [...BAKE, '--nav-date', '2026-11-07'])));
t('bake_month: --nav-date 2026-10-24 and the D99 pair are accepted', () => { passedNav(run('bake_month', [...BAKE, '--nav-date', '2026-10-24'])); passedNav(run('bake_month', [...BAKE, '--nav-date', '2026-11-02', '--nav-date-direct', '2026-10-30'])); });
t('bake_month: no --nav-date defaults to the as-on date', () => passedNav(run('bake_month', BAKE)));
const ANY = path.join(ROOT, 'package.json');
t('rebuild_directperf: a missing --nav-date exits 2', () => usage2(run('rebuild_directperf', [ANY, '--html', 'site/index.html']), /--nav-date is required/));
t('rebuild_directperf: --nav-date 2026-02-30 exits 2', () => usage2(run('rebuild_directperf', [ANY, '--nav-date', '2026-02-30', '--html', 'site/index.html']), /not a real date/));
t('rebuild_directperf: a missing source is still reported before the NAV date', () => usage2(run('rebuild_directperf', [path.join(EMPTY, 'missing.xlsx')]), /^Usage/));
t('rebuild_directperf: the NAV date value is not taken as the source', () => usage2(run('rebuild_directperf', ['--nav-date', '2026-08-31', path.join(EMPTY, 'missing.xlsx')]), /^Usage/));

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);

// Regression test for D112 / D114 (TASK-087): "never blank" expected 1Y/3Y/5Y figures and one weighting rule (C59).
// Runs site/index.html's scripts in a vm (as tools/verify_page.js does). Every rule case uses a synthetic record
// (added to MASTER for the test, then removed), so the monthly data can change underneath:
//   - H.weightedReturns weights 1Y/3Y/5Y through H.effectiveReturn (the band mid-point when a period is missing);
//   - the Excel "Investment Proposal" sheet holds H.effectiveReturn in every 1Y/3Y/5Y cell that has a figure, as a
//     number; an expected figure (H.isExpectedReturn, D83) carries the number format General"*"; a published figure
//     and a user's override carry none; a period with no figure and no band stays empty; a note row explains "*";
//   - the "Equity Analytics" sheet labels the market-cap bucket "Others (cash, unlisted, foreign, REITs)" (D112 a).
//   node tools/test/expected_returns.test.js [site folder]
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const XLSX = require('xlsx');

let passed = 0, failed = 0;
const check = (name, ok, detail) => { if (ok) passed++; else { failed++; console.log(`  FAIL ${name}${detail ? ' - ' + detail : ''}`); } };

const DIR = process.argv[2] || path.join(__dirname, '..', '..', 'site');
const html = fs.readFileSync(path.join(DIR, 'index.html'), 'utf8');
const noop = () => {};
const el = () => new Proxy({ style: {}, classList: { add: noop, remove: noop, toggle: noop, contains: () => false },
  appendChild: noop, setAttribute: noop, addEventListener: noop, getBoundingClientRect: () => ({ top: 0, height: 0 }),
  querySelector: () => null, querySelectorAll: () => [] }, { get: (t, k) => (k in t ? t[k] : noop) });
const sandbox = { console: { log: noop, info: noop, warn: noop, error: noop }, setTimeout, clearTimeout, requestAnimationFrame: noop,
  document: { createElement: el, getElementById: () => null, querySelector: () => null, querySelectorAll: () => [],
    addEventListener: noop, head: el(), body: el(), hidden: false, visibilityState: 'visible' },
  navigator: { userAgent: 'node' }, location: { href: 'http://localhost/' }, fetch: noop, alert: noop };
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
let m, n = 0;
while ((m = re.exec(html))) {
  const src = ((m[1] || '').match(/\bsrc\s*=\s*["']([^"']+)["']/i) || [])[1];
  n++;
  try {
    if (src) { if (!/^https?:/i.test(src)) vm.runInContext(fs.readFileSync(path.join(DIR, src), 'utf8'), sandbox, { filename: src }); }
    else vm.runInContext(m[2], sandbox, { filename: `inline #${n}` });
  } catch (e) { /* the CDN globals (React, Chart, XLSX) are absent; verify_page reports script errors */ }
}
const W = sandbox, H = W.H;
const close = (a, b) => (a == null && b == null) || (a != null && b != null && Math.abs(a - b) < 1e-12);
const KEYS = ['r1y', 'r3y', 'r5y'];
const STAR = 'General"*"';

// ---- synthetic records, one per rule case ----
const base = { r1m: null, r3m: null, r6m: null, r2y: null, r10y: null, si: null, exit_load: '', aum: null };
const R = (name, ac, pc, sc, band, r1y, r3y, r5y, extra) => Object.assign({}, base,
  { name: 'ZZ TEST ' + name, asset_class: ac, product_class: pc, sub_category: sc,
    irr_low: band ? band[0] : null, irr_high: band ? band[1] : null, r1y, r3y, r5y }, extra || {});
const SYN = {
  published: R('Published Equity MF', 'Equity', 'Mutual Fund', 'Large Cap', [0.11, 0.13], 0.051, 0.122, 0.143, { r3m: 0.01 }),
  pmsGap: R('PMS One Period Missing', 'Equity', 'PMS', 'Multi Cap', [0.15, 0.17], -0.02, 0.141, null, { r3m: 0.02 }),
  aif: R('AIF No Returns', 'Equity', 'AIF', 'AIF CAT III - Listed Equity', [0.17, 0.19], null, null, null),
  sif: R('SIF No Returns', 'Hybrid', 'Hybrid SIF', 'Hybrid Long-Short', [0.09, 0.11], null, null, null),
  youngMF: R('Young MF No Returns', 'Equity', 'Mutual Fund', 'Large Cap', [0.11, 0.13], null, null, null),
  bond: R('Bond Stored Yield', 'Debt', 'Bonds', 'Corporate Bonds', null, 0.0995, 0.0995, 0.0995),
  noBand: R('MF No Band', 'Equity', 'Mutual Fund', 'Large Cap', null, 0.08, 0.09, null, { r3m: 0.01 })
};
// expected star per key: [r1y, r3y, r5y]; null = empty cell
const WANT = {
  published: [false, false, false], pmsGap: [false, false, true], aif: [true, true, true], sif: [true, true, true],
  youngMF: [true, true, true], bond: [true, true, true], noBand: [false, false, null]
};
const M = W.MASTER;
const added = Object.values(SYN);
added.forEach(r => M.push(r));
try {
  // ---- one weighting rule (C59) ----
  const entries = added.map((f, i) => ({ fund: f, pct: [25, 15, 15, 15, 10, 10, 10][i] }));
  const wr = H.weightedReturns(entries);
  for (const k of KEYS) {
    let a = 0, w = 0;
    for (const e of entries) { const v = H.effectiveReturn(e.fund, k); if (v != null && !isNaN(v) && e.pct > 0) { a += v * e.pct; w += e.pct; } }
    check(`weightedReturns.${k} weights H.effectiveReturn (mid-points included)`, close(wr[k], w ? a / w : null), wr[k] + ' vs ' + (w ? a / w : null));
  }

  // ---- Excel ----
  W.XLSX = XLSX;
  const workbook = sel => {
    let wb = null;
    const keep = XLSX.writeFile; XLSX.writeFile = b => { wb = b; };
    try { W.EXPORTS.exportXlsx(sel, 100, M); } finally { XLSX.writeFile = keep; }
    return wb;
  };
  const sheetRows = (wb, name) => XLSX.utils.sheet_to_json(wb.Sheets[name], { header: 1, raw: true, defval: null });
  const wb = workbook(entries);
  check('exportXlsx builds a workbook', !!wb);
  if (wb) {
    const ws = wb.Sheets['Investment Proposal'];
    const rows = sheetRows(wb, 'Investment Proposal');
    for (const [key, f] of Object.entries(SYN)) {
      const r = rows.findIndex(x => x[0] === '   ' + f.name);
      check(`Excel row for ${key}`, r >= 0);
      if (r < 0) continue;
      KEYS.forEach((k, j) => {
        const cell = ws[XLSX.utils.encode_cell({ r, c: 4 + j })];
        const want = WANT[key][j];
        if (want === null) { check(`${key} ${k}: no figure and no band -> empty cell`, !cell || cell.v == null || cell.v === ''); return; }
        check(`${key} ${k}: the cell holds H.effectiveReturn as a number`, !!cell && cell.t === 'n' && close(cell.v, H.effectiveReturn(f, k)), cell && cell.v);
        check(`${key} ${k}: ${want ? 'starred' : 'not starred'}`, !!(cell && cell.z === STAR) === want, cell && cell.z);
      });
    }
    check('a note row explains the star', rows.some(x => typeof x[0] === 'string' && x[0].startsWith('* No return is published for this period')));
    // A user's override is shown as entered, unstarred.
    const wb2 = workbook(H.applyOverrides([{ fund: SYN.aif, pct: 100, r3yOv: 0.2 }]));
    const r2 = wb2 ? sheetRows(wb2, 'Investment Proposal').findIndex(x => x[0] === '   ' + SYN.aif.name) : -1;
    const c2 = r2 >= 0 ? wb2.Sheets['Investment Proposal'][XLSX.utils.encode_cell({ r: r2, c: 5 })] : null;
    check('an override is shown as entered, unstarred', !!c2 && close(c2.v, 0.2) && c2.z !== STAR, c2 && (c2.v + ' ' + c2.z));
    // Nothing expected -> no note row.
    const wb3 = workbook([{ fund: SYN.published, pct: 100 }]);
    check('no note row when nothing is starred', !!wb3 && !sheetRows(wb3, 'Investment Proposal').some(x => typeof x[0] === 'string' && x[0].startsWith('* No return')));
    // D112 (a): the market-cap bucket label (only the market-cap block: a sector may also be called "Others").
    const eq = sheetRows(wb, 'Equity Analytics');
    const a = eq.findIndex(x => x[0] === 'Market Cap Allocation'), b = eq.findIndex(x => x[0] === 'Top 10 Sectors');
    const block = a >= 0 && b > a ? eq.slice(a, b) : [];
    check('Equity Analytics labels the bucket "Others (cash, unlisted, foreign, REITs)"', block.some(x => x[0] === 'Others (cash, unlisted, foreign, REITs)'));
    check('Equity Analytics market-cap block has no bare "Others" row', block.length > 0 && !block.some(x => x[0] === 'Others'));
  }
} finally {
  for (const r of added) { const i = M.indexOf(r); if (i >= 0) M.splice(i, 1); }
}
check('synthetic records removed from MASTER again', !M.some(r => String(r.name).startsWith('ZZ TEST ')));

console.log(`  ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);

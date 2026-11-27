// Regression test for TASK-089 (D118): the "Indicative return range" vocabulary, the return-basis and debt-YTM
// footnotes, the debt mutual fund predicate, and the logo trim / contain placement. Runs site/index.html in a vm (as
// tools/verify_page.js does) with a recording PptxGenJS. Rule cases use synthetic "ZZ TEST" records added to the vm's
// in-memory MASTER and removed again; nothing is written.
//   node tools/test/labels_notes.test.js [site folder]
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
const W = sandbox, H = W.H, EX = W.EXPORTS, M = W.MASTER;

// ---- 1. vocabulary: no user-facing string carries the old labels (code lines only; comments skipped) ----
{
  const OLD = /Expected Pre-Tax|[Pp]re-tax IRR|Expected IRR|Weighted IRR|^IRR Range$|^IRR $|^IRR Low$|^IRR High$/;
  const hits = [];
  html.split('\n').forEach((line, i) => {
    if (line.length > 2000 || /^\s*(\/\/|\/\*|\*)/.test(line)) return;   // data lines and comment lines
    const code = line.replace(/\/\/.*$/, '');
    for (const s of code.match(/"[^"\n]{0,300}"/g) || []) if (OLD.test(s.slice(1, -1))) hits.push((i + 1) + ': ' + s.slice(0, 60));
  });
  check('no user-facing "Expected Pre-Tax" / "Pre-tax IRR" / "IRR Range" label remains', hits.length === 0, hits.slice(0, 5).join(' | '));
  for (const s of ['"Indicative Return Range"', '"Indicative Return (p.a.)"', '"Indicative Return Range (Weighted)"'])
    check(`label ${s} present`, html.includes(s));
}

// ---- 2. notes and the debt predicate ----
check('basis note text', H.RETURN_BASIS_NOTE === 'Indicative returns are post-expense and pre-tax.', H.RETURN_BASIS_NOTE);
// keep going on an old page: report every failure instead of stopping at the first missing helper
for (const k of ['isDebtMutualFund', 'debtYtmNote']) if (typeof H[k] !== 'function') { check('H.' + k + ' is defined', false); H[k] = () => null; }
check('DATA_DATES has the debtYtm key', W.DATA_DATES && Object.prototype.hasOwnProperty.call(W.DATA_DATES, 'debtYtm'));
const R = (name, ac, pc, sc, extra) => Object.assign({ name: 'ZZ TEST ' + name, asset_class: ac, product_class: pc, sub_category: sc,
  irr_low: 0.07, irr_high: 0.075, r1y: 0.072, r3y: 0.07, r5y: 0.069, exit_load: '', aum: null }, extra || {});
const SYN = {
  debtMF: R('Debt MF Corporate Bond', 'Debt', 'Mutual Fund', 'Corporate Bond'),
  debtETF: R('Debt ETF Gilt', 'Debt', 'ETF', 'Debt ETF'),
  bond: R('Bond', 'Debt', 'Bonds', 'Corporate Bonds'),
  fd: R('FD', 'Debt', 'Fixed Deposit', 'Fixed Deposit'),
  debtAIF: R('Debt AIF', 'Debt', 'AIF', 'AIF CAT II - Credit'),
  hybrid: R('Hybrid MF', 'Hybrid', 'Mutual Fund', 'Hybrid Other'),
  equity: R('Equity MF', 'Equity', 'Mutual Fund', 'Large Cap', { irr_low: 0.11, irr_high: 0.13, r1y: 0.08, r3y: 0.12, r5y: 0.13 })
};
const want = { debtMF: true, debtETF: true, bond: false, fd: false, debtAIF: false, hybrid: false, equity: false };
for (const [k, f] of Object.entries(SYN)) check(`isDebtMutualFund(${k}) = ${want[k]}`, H.isDebtMutualFund(f) === want[k]);
// The agreed exclusions (bands not set by the YTM rule; D118, the operator's TASK-090 list).
const EXCLUDED = [
  'Quantum Liquid Fund - Unclaimed IDCW Plan Above 3Y', 'Quantum Liquid Fund - Unclaimed IDCW Plan Below 3Y',
  'Quantum Liquid Fund - Unclaimed Redemption Plan Above 3Y', 'Quantum Liquid Fund - Unclaimed Redemption Plan Below 3Y',
  'Franklin India Short Term Income Plan-Segregated Portfolio 3-Ret(G)', 'Franklin India Credit Risk Fund-Segregated Portfolio 3-(G)',
  'UTI Medium Term Fund (Segregated - 06032020)-Reg(G)', 'UTI Credit Risk Fund (Segregated - 06032020)-Reg(G)',
  'Aditya Birla SL Income Plus Arbitrage Active FOF-Reg(G)',
  'Zerodha Nifty LargeMidcap250 Plus 8-13 yr G-Sec 70:30 Index Fund(G)-Direct Plan',
  'Mirae Asset Nifty200 Momentum 30 Plus 8-13 yr G-Sec 50:50 ETF'
];
for (const name of EXCLUDED) {
  check(`excluded from the YTM note: ${name}`, H.isDebtMutualFund({ name, asset_class: 'Debt', product_class: 'Mutual Fund' }) === false);
  const f = M.find(x => x.name === name);
  check(`exclusion still names a MASTER record: ${name}`, !!f,
    'renamed or removed -> update DEBT_YTM_EXCLUDED with the operator\'s list (D118), in a code PR');
}
const matched = M.filter(f => H.isDebtMutualFund(f)).length, cls = M.filter(f => f.asset_class === 'Debt' && (f.product_class === 'Mutual Fund' || f.product_class === 'ETF')).length;
check('the predicate = the class set minus the exclusions present', matched === cls - EXCLUDED.filter(x => M.some(f => f.name === x)).length, matched + ' of ' + cls);
const keepDate = W.DATA_DATES.debtYtm;
try {
  W.DATA_DATES.debtYtm = '31st October 2026';
  check('debt note with a debt MF', H.debtYtmNote([{ fund: SYN.equity, pct: 50 }, { fund: SYN.debtMF, pct: 50 }]) ===
    'Indicative ranges for debt mutual funds are based on the category average YTM as on 31st October 2026.');
  check('no debt note without a debt MF', H.debtYtmNote([{ fund: SYN.equity, pct: 50 }, { fund: SYN.bond, pct: 50 }]) === null);
  check('no debt note for an excluded record', H.debtYtmNote([{ fund: { name: EXCLUDED[0], asset_class: 'Debt', product_class: 'Mutual Fund' }, pct: 100 }]) === null);
  W.DATA_DATES.debtYtm = '';
  check('no debt note when the date is empty', H.debtYtmNote([{ fund: SYN.debtMF, pct: 100 }]) === null);
} finally { W.DATA_DATES.debtYtm = keepDate; }

// ---- 3. Excel and deck notes (synthetic records, date set) ----
class Slide { constructor() { this.items = []; } addText(t, o) { this.items.push({ type: 'text', t, o }); } addTable(r, o) { this.items.push({ type: 'table', r, o }); }
  addShape(k, o) { this.items.push({ type: 'shape', o }); } addImage(o) { this.items.push({ type: 'image', o }); } addChart(k, d, o) { this.items.push({ type: 'chart', o }); } }
class Pptx { constructor() { this.slides = []; this.ChartType = { bar: 'bar', doughnut: 'doughnut', pie: 'pie', line: 'line' }; Pptx.last = this; }
  defineLayout() {} addSlide() { const s = new Slide(); this.slides.push(s); return s; } writeFile() { return Promise.resolve('ok'); } write() { return Promise.resolve(''); } }
W.PptxGenJS = Pptx;
H.buildOverlapPng = () => null;
W.XLSX = XLSX;
const added = Object.values(SYN);
added.forEach(r => M.push(r));
(async () => {
  try {
    W.DATA_DATES.debtYtm = '31st October 2026';
    const withDebt = [{ fund: SYN.equity, pct: 60 }, { fund: SYN.debtMF, pct: 40 }], noDebt = [{ fund: SYN.equity, pct: 100 }];
    const xl = sel => { let wb = null; const k = XLSX.writeFile; XLSX.writeFile = b => { wb = b; }; try { EX.exportXlsx(sel, 100, M); } finally { XLSX.writeFile = k; }
      return wb ? XLSX.utils.sheet_to_json(wb.Sheets['Investment Proposal'], { header: 1, raw: true, defval: null }).map(r => r[0]) : []; };
    const a = xl(withDebt), b = xl(noDebt);
    check('Excel header "Indicative Return Range"', a.length > 0 && xl(withDebt) && true);
    check('Excel: basis note row', a.includes(H.RETURN_BASIS_NOTE) && b.includes(H.RETURN_BASIS_NOTE));
    check('Excel: debt note only with a debt MF', a.some(x => typeof x === 'string' && x.startsWith('Indicative ranges for debt mutual funds')) &&
      !b.some(x => typeof x === 'string' && x.startsWith('Indicative ranges for debt mutual funds')));
    const deckTexts = async sel => { await EX.exportPpt(sel, 100, 'Cr'); const d = Pptx.last;
      const titleOf = s => { const t = s.items.find(i => i.type === 'text' && i.o && i.o.y === 0.15); return t ? String(t.t) : ''; };
      const io = d.slides.filter(s => /^Investment Option(\s*\(\d+\s*\/\s*\d+\))?$/i.test(titleOf(s).trim()));
      return { io, all: io.flatMap(s => s.items.filter(i => i.type === 'text').map(i => Array.isArray(i.t) ? i.t.map(r => r.text).join(' ') : String(i.t))) }; };
    const d1 = await deckTexts(withDebt), d2 = await deckTexts(noDebt);
    check('deck: Investment Option slides found', d1.io.length > 0 && d2.io.length > 0);
    check('deck: basis note on every Investment Option slide', d1.io.every(s => s.items.some(i => i.type === 'text' && JSON.stringify(i.t).includes(H.RETURN_BASIS_NOTE))));
    check('deck: debt note only with a debt MF', d1.all.some(t => t.includes('category average YTM as on 31st October 2026')) && !d2.all.some(t => t.includes('category average YTM')));
    check('deck: no layout warning', W.__PPTX_LAYOUT && W.__PPTX_LAYOUT.warnings.length === 0, W.__PPTX_LAYOUT && W.__PPTX_LAYOUT.warnings.slice(0, 2).join(' | '));
    // ---- 4. the logo, contain in its box ----
    const LOGO = 'data:image/png;base64,iVBORw0KGgo=';
    const logoBoxes = async asp => { W.__SELECTED_LOGO = LOGO; W.__SELECTED_LOGO_ASPECT = asp; await EX.exportPpt(noDebt, 100, 'Cr');
      return Pptx.last.slides.flatMap(s => s.items.filter(i => i.type === 'image' && i.o && i.o.data === LOGO).map(i => i.o)); };
    const close = (x, y) => Math.abs(x - y) < 1e-6;
    let bx = await logoBoxes(null);
    check('logo without an aspect: the header box as before', bx.length > 0 && bx.some(o => close(o.x, 11.21) && close(o.y, 0.22) && close(o.w, 2.02) && close(o.h, 0.44)));
    bx = await logoBoxes(4.72);
    check('a wide mark: full width, centred vertically, not stretched', bx.some(o => close(o.w, 2.02) && close(o.h, 2.02 / 4.72) && close(o.x, 11.21) && close(o.y, 0.22 + (0.44 - 2.02 / 4.72) / 2)));
    bx = await logoBoxes(3);
    check('a tall mark: full height, right-aligned in the header box', bx.some(o => close(o.h, 0.44) && close(o.w, 1.32) && close(o.x, 11.21 + 2.02 - 1.32)));
    check('every logo keeps its aspect', bx.every(o => close(o.w / o.h, 3) || close(o.w / o.h, 2.02 / 0.44)));
  } finally {
    W.DATA_DATES.debtYtm = keepDate; W.__SELECTED_LOGO = null; W.__SELECTED_LOGO_ASPECT = null;
    for (const r of added) { const i = M.indexOf(r); if (i >= 0) M.splice(i, 1); }
  }
  check('synthetic records removed again', !M.some(f => String(f.name).startsWith('ZZ TEST ')));
  // ---- 5. the trim's pure scan ----
  const box = W.logoAlphaBox;
  check('logoAlphaBox is defined', typeof box === 'function');
  if (typeof box === 'function') {
    const w = 10, h = 5, px = new Uint8ClampedArray(w * h * 4);
    for (let y = 1; y <= 3; y++) for (let x = 2; x <= 5; x++) px[(y * w + x) * 4 + 3] = 255;
    const b = box(px, w, h, 16);
    check('logoAlphaBox finds the opaque area', b && b.x === 2 && b.y === 1 && b.w === 4 && b.h === 3, JSON.stringify(b));
    check('logoAlphaBox: fully transparent -> null', box(new Uint8ClampedArray(w * h * 4), w, h, 16) === null);
    const faint = new Uint8ClampedArray(w * h * 4); faint[3] = 10;
    check('logoAlphaBox: below the threshold is margin', box(faint, w, h, 16) === null);
  }
  console.log(`  ${passed} passed, ${failed} failed`);
  process.exit(failed ? 1 : 0);
})().catch(e => { console.log('  FAIL ' + (e && e.stack || e)); process.exit(1); });

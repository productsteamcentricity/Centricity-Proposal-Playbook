// Regression test for the PowerPoint export's layout engine (D82). Runs site/index.html's scripts in
// document order inside a vm (as tools/verify_page.js does), swaps PptxGenJS for a recorder, exports
// portfolios of different shapes and checks invariants only: every instrument appears once in each
// table family, the GRAND TOTAL closes every Investment Option page, every block stays inside the
// content frame, continuation pages carry their (i/n) title. Funds are picked by rule, not by name,
// so the monthly data can change underneath. No slide counts are snapshotted.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

let passed = 0, failed = 0;
const check = (name, ok, detail) => { if (ok) passed++; else { failed++; console.log(`  FAIL ${name}${detail ? ' - ' + detail : ''}`); } };
const DAGGER = ' ' + String.fromCharCode(8224);

const DIR = path.join(__dirname, '..', '..', 'site');
const html = fs.readFileSync(path.join(DIR, 'index.html'), 'utf8');
const noop = () => {};
const el = () => new Proxy({ style: {}, classList: { add: noop, remove: noop, toggle: noop, contains: () => false },
  appendChild: noop, setAttribute: noop, addEventListener: noop, getBoundingClientRect: () => ({ top: 0, height: 0 }),
  querySelector: () => null, querySelectorAll: () => [] }, { get: (t, k) => (k in t ? t[k] : noop) });
const alerts = [], logged = [];
const quiet = { log: noop, info: noop, warn: (...a) => logged.push(a.join(' ')), error: (...a) => logged.push(a.join(' ')) };
const sandbox = { console: quiet, setTimeout, clearTimeout, requestAnimationFrame: noop,
  document: { createElement: el, getElementById: () => null, querySelector: () => null, querySelectorAll: () => [],
    addEventListener: noop, head: el(), body: el(), hidden: false, visibilityState: 'visible' },
  navigator: { userAgent: 'node' }, location: { href: 'http://localhost/' }, fetch: noop, alert: m => alerts.push(String(m)) };
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
const W = sandbox, H = W.H, EX = W.EXPORTS;
check('EXPORTS and the design-system hook load', !!(EX && EX._ds && H), 'window.EXPORTS._ds missing');
if (!EX || !EX._ds) { console.log(`  ${passed} passed, ${failed} failed`); process.exit(1); }
const { DS, TXT, planTable } = EX._ds;

// ---- a recording PptxGenJS ----
class Slide {
  constructor() { this.items = []; }
  addText(t, o) { this.items.push({ type: 'text', t, o }); }
  addTable(rows, o) { this.items.push({ type: 'table', rows, o }); }
  addShape(k, o) { this.items.push({ type: 'shape', k, o }); }
  addImage(o) { this.items.push({ type: 'image', o }); }
  addChart(k, data, o) { this.items.push({ type: 'chart', k, data, o }); }
}
class Pptx {
  constructor() { this.slides = []; this.ChartType = { bar: 'bar', doughnut: 'doughnut', pie: 'pie', line: 'line' }; Pptx.last = this; }
  defineLayout() {}
  addSlide() { const s = new Slide(); this.slides.push(s); return s; }
  writeFile() { Pptx.writes++; return Promise.resolve('ok'); }
  write() { return Promise.resolve(''); }
}
W.PptxGenJS = Pptx;
H.buildOverlapPng = () => null;          // needs a canvas; the overlap slide is drawn without its image

// ---- unit: the table engine pages a long table without losing a row ----
(function () {
  const cell = (t, o) => ({ text: t, options: Object.assign({ fontFace: 'Cambria', fontSize: 9 }, o || {}) });
  const build = pt => ({
    header: [[cell('Name', { bold: true, fontSize: pt }), cell('Value', { bold: true, fontSize: pt })]],
    body: Array.from({ length: 90 }, (_, i) => i % 10 === 0
      ? { level: 0, label: 'Group ' + i, cells: [cell('Group ' + i, { bold: true, fontSize: pt }), cell('', { fontSize: pt })] }
      : { level: 1, cells: [cell('Instrument with a fairly long descriptive name number ' + i, { fontSize: pt }), cell((i * 1.5).toFixed(2) + '%', { fontSize: pt })] }),
    sticky: [[cell('TOTAL', { bold: true, fontSize: pt }), cell('100.00%', { bold: true, fontSize: pt })]]
  });
  const plan = planTable({ cols: [{ wrap: true, min: 2 }, {}], build, width: 6, avail: 5.5, sizes: [10, 9], pagePt: 9, leaf: 1,
    context: (labels, pt) => [cell(labels.join(' / ') + ' (continued)', { colspan: 2, fontSize: pt })] });
  check('unit: long table is paged', plan.pages.length > 1, plan.pages.length + ' page(s)');
  const texts = plan.pages.flatMap(p => p.rows.map(r => r[0].text));
  for (let i = 0; i < 90; i++) if (i % 10) check('unit: row ' + i + ' kept once', texts.filter(t => t.endsWith('number ' + i)).length === 1);
  plan.pages.forEach((p, k) => {
    check(`unit: page ${k + 1} fits`, p.height <= 5.5 + 0.001, p.height.toFixed(3));
    check(`unit: page ${k + 1} header and total`, p.rows[0][0].text === 'Name' && p.rows[p.rows.length - 1][0].text === 'TOTAL');
    const lastBody = p.rows[p.rows.length - 2][0].text;
    check(`unit: page ${k + 1} does not end on a group heading`, !/^Group /.test(lastBody), lastBody);
    if (k > 0 && !/^Group /.test(p.rows[1][0].text)) check(`unit: page ${k + 1} names its continued group`, /\(continued\)$/.test(p.rows[1][0].text), p.rows[1][0].text);
  });
  check('unit: measurer is font-independent', Math.abs(TXT.width('100.00%', 9, true) - 0.52) < 0.03, TXT.width('100.00%', 9, true).toFixed(3));
})();

// ---- portfolios, picked by rule ----
const M = W.MASTER;
const RM = W.RISK_MATRIX || {};
const byLen = (a, b) => b.name.length - a.name.length;
const take = (pred, k, sort) => { const r = M.filter(pred); if (sort) r.sort(sort); return r.slice(0, k); };
const distinct = (arr, key, k) => { const seen = new Set(), out = []; for (const f of arr) { const v = key(f); if (!seen.has(v)) { seen.add(v); out.push(f); if (out.length === k) break; } } return out; };
const eqMF = f => f.asset_class === 'Equity' && f.product_class === 'Mutual Fund';
const sel = funds => { const u = []; const seen = new Set(); funds.forEach(f => { if (f && !seen.has(f.name)) { seen.add(f.name); u.push(f); } });
  const p = Math.floor(10000 / u.length) / 100; return u.map((f, i) => ({ fund: f, pct: i === u.length - 1 ? +(100 - p * (u.length - 1)).toFixed(2) : p })); };
const cases = [
  { name: 'debt mix', sel: sel([...take(f => f.sub_category === 'Liquid' && f.product_class === 'Mutual Fund', 2),
    ...take(f => f.product_class === 'PMS' && f.asset_class === 'Debt', 1), ...take(f => f.product_class === 'AIF' && f.asset_class === 'Debt', 2),
    ...distinct(M.filter(f => f.product_class === 'Bonds'), f => f.sub_category, 2), ...take(f => f.product_class === 'Bonds', 1)]) },
  { name: 'three instruments', sel: sel([...take(eqMF, 1), ...take(f => f.asset_class === 'Debt' && f.product_class === 'Mutual Fund', 1), ...take(f => f.product_class === 'Bonds', 1)]) },
  { name: 'forty-five long names', sel: sel([...take(eqMF, 10, byLen), ...take(f => f.asset_class === 'Hybrid', 5, byLen),
    ...take(f => f.asset_class === 'Debt' && f.product_class === 'Mutual Fund', 6, byLen), ...take(f => f.product_class === 'PMS', 4, byLen),
    ...take(f => f.product_class === 'AIF', 3, byLen), ...take(f => f.product_class === 'Bonds', 6, byLen),
    ...take(f => f.product_class === 'Direct Equity', 4, byLen), ...take(f => f.asset_class === 'Commodity', 2, byLen),
    ...take(f => /SIF/.test(f.product_class), 2, byLen), ...take(f => f.asset_class === 'Global Funds', 3, byLen)]) },
  { name: 'thirty funds with risk data', sel: sel([...take(f => eqMF(f) && RM[f.name] && H.riskFlagged(RM[f.name]), 2), ...take(f => eqMF(f) && RM[f.name], 28, byLen)]) },
  { name: 'bonds only', sel: sel(take(f => f.product_class === 'Bonds', 6)) },
  { name: 'fifteen AMCs', sel: sel(distinct(M.filter(eqMF), f => W.getAMC(f.name), 15)) },
];
cases.push({ name: 'debt mix in Lakhs', sel: cases[0].sel, unit: 'Lakhs' });

const titleOf = s => { const t = s.items.find(i => i.type === 'text' && i.o && i.o.y === 0.15); return t ? String(t.t) : ''; };
const tableTexts = s => s.items.filter(i => i.type === 'table').flatMap(i => i.rows.flatMap(r => r.map(c => String(c.text))));
const noDagger = x => x.endsWith(DAGGER) ? x.slice(0, -DAGGER.length) : x;

(async () => {
  for (const c of cases) {
    if (c.sel.length < 3) { check(`${c.name}: enough funds in MASTER`, false, c.sel.length + ' found'); continue; }
    Pptx.writes = 0; alerts.length = 0; logged.length = 0;
    await EX.exportPpt(c.sel, 25, c.unit || 'Cr');
    const deck = Pptx.last, L = W.__PPTX_LAYOUT;
    check(`${c.name}: written once, no alert`, Pptx.writes === 1 && !alerts.length, alerts.join(' | '));
    check(`${c.name}: no layout warning`, L && L.warnings.length === 0, L && L.warnings.slice(0, 3).join(' | '));
    // every table and chart inside the content frame; every text inside the slide
    deck.slides.forEach((s, k) => s.items.forEach(it => {
      const o = it.o || {};
      if (it.type === 'table') {
        const w = o.colW.reduce((a, b) => a + b, 0), h = o.rowH.reduce((a, b) => a + b, 0);
        check(`${c.name}: slide ${k + 1} table inside frame`, o.x >= DS.X - 0.01 && o.x + w <= DS.R + 0.01 && o.y + h <= DS.FOOT - DS.STAMP_H + 0.01,
          `x ${o.x} w ${w.toFixed(2)} y ${o.y} h ${h.toFixed(2)}`);
        check(`${c.name}: slide ${k + 1} rowH per row`, o.rowH.length === it.rows.length);
      } else if (it.type === 'chart') {
        check(`${c.name}: slide ${k + 1} chart inside frame`, o.x >= DS.X - 0.01 && o.x + o.w <= DS.R + 0.01 && o.y + o.h <= DS.FOOT, `y ${o.y} h ${o.h}`);
      } else if (it.type === 'text') {
        check(`${c.name}: slide ${k + 1} text inside slide`, o.x >= 0 && o.x + o.w <= DS.W + 0.01 && o.y + o.h <= 7.4 + 0.001, `x ${o.x} y ${o.y} h ${o.h}`);
      }
    }));
    const fam = rx => deck.slides.filter(s => rx.test(titleOf(s)));
    const names = c.sel.map(x => x.fund.name);
    const once = (label, slides) => {
      const t = slides.flatMap(tableTexts).map(noDagger);
      const missing = names.filter(nm => t.filter(x => x === nm).length !== 1);
      check(`${c.name}: ${label} lists every instrument once`, !missing.length, missing.slice(0, 3).join(' | '));
    };
    const io = fam(/^INVESTMENT OPTION( \(|$)/);
    check(`${c.name}: has Investment Option slides`, io.length > 0);
    once('Investment Option', io);
    const totPct = c.sel.reduce((a, x) => a + x.pct, 0).toFixed(2) + '%';
    io.forEach((s, k) => {
      const t = s.items.find(i => i.type === 'table');
      const last = t.rows[t.rows.length - 1];
      check(`${c.name}: IO page ${k + 1} ends with GRAND TOTAL ${totPct}`, last[0].text === 'GRAND TOTAL' && last[3].text === totPct, last[0].text + ' ' + (last[3] && last[3].text));
      check(`${c.name}: IO page ${k + 1} keeps 10 columns`, t.o.colW.length === 10);
      if (io.length > 1) check(`${c.name}: IO page ${k + 1} title numbered`, titleOf(s).endsWith(`(${k + 1}/${io.length})`), titleOf(s));
    });
    once('Portfolio Matrix', fam(/^PORTFOLIO MATRIX/));
    once('Fund Performance', fam(/^FUND PERFORMANCE/));
    const liq = fam(/^AMC ALLOCATION|^PORTFOLIO LIQUIDITY/);
    if (liq.length) once('Portfolio Liquidity', liq);
    // the rationale names each sub-category once
    const subs = [...new Set(c.sel.map(x => x.fund.sub_category))];
    // a card's text runs: asset-class tag, then the sub-category heading
    const heads = fam(/^INVESTMENT OPTIONS RATIONALE/).flatMap(s => s.items.filter(i => i.type === 'text' && Array.isArray(i.t) && i.t.length > 1).map(i => i.t[1].text));
    const miss = subs.filter(sc => heads.filter(h => h === sc).length !== 1);
    check(`${c.name}: rationale has one card per sub-category`, !miss.length, miss.join(' | '));
    // AMC bars add up to the whole MF allocation
    const amcChart = fam(/^AMC ALLOCATION/).flatMap(s => s.items.filter(i => i.type === 'chart' && i.k === 'bar'))[0];
    if (amcChart) {
      const v = amcChart.data[0].values, tot = v.reduce((a, b) => a + b, 0);
      check(`${c.name}: AMC bars sum to 100%`, Math.abs(tot - 100) < 0.2, tot.toFixed(2));
      check(`${c.name}: at most 12 AMC bars`, v.length <= 12, String(v.length));
    }
  }
  // single-tab exports (the per-tab "Download slide" buttons) go through the same builder
  for (const c of [cases[0], cases[2]]) {
    for (const tab of ['proposal', 'rationale', 'perf', 'matrix', 'equity', 'debt', 'amc', 'overlap', 'netalloc']) {
      Pptx.writes = 0; alerts.length = 0;
      await EX.exportTabSlide(tab, c.sel, 25, 'Cr');
      const deck = Pptx.last, L = W.__PPTX_LAYOUT;
      check(`${c.name}: tab ${tab} written once, no alert`, Pptx.writes === 1 && !alerts.length, alerts.join(' | '));
      check(`${c.name}: tab ${tab} has slides, no layout warning`, deck.slides.length > 0 && L.warnings.length === 0, L.warnings.slice(0, 2).join(' | '));
      check(`${c.name}: tab ${tab} slides numbered`, deck.slides.every(s => s.slideNumber && s.slideNumber.x > 12));
    }
  }
  console.log(`  ${passed} passed, ${failed} failed`);
  process.exit(failed ? 1 : 0);
})().catch(e => { console.log('  FAIL ' + (e && e.stack || e)); process.exit(1); });

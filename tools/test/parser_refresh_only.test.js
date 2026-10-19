// Regression test for the page's MF Monitor parser and its refresh-only sheets (KNOWN_ISSUES C19, D80).
// Loads the REFRESH block of site/index.html in a vm (as tools/bake_month.js does) and feeds it small
// synthetic workbooks — no monthly or client data.
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const XLSX = require('xlsx');

let passed = 0, failed = 0;
const check = (name, ok, detail) => { if (ok) passed++; else { failed++; console.log(`  FAIL ${name}${detail ? ' — ' + detail : ''}`); } };

const html = fs.readFileSync(path.join(__dirname, '..', '..', 'site', 'index.html'), 'utf8');
const start = html.indexOf('<script>// ===== In-browser xlsx parsers');
if (start < 0) { console.log('  FAIL REFRESH block not found in site/index.html'); process.exit(1); }
const body = html.slice(start + '<script>'.length, html.indexOf('</script>', start));

function load(master) {
  const sandbox = { console, JSON, Math, Object, Array, String, Number, Boolean, Date, RegExp, Map, Set, Promise,
    parseFloat, parseInt, isNaN, isFinite, XLSX, Error, TypeError, Symbol, ArrayBuffer, Uint8Array, setTimeout, clearTimeout };
  sandbox.window = { MASTER: master, DATA_DATES: {} };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(body, sandbox);
  return sandbox.window;
}

// One Monitor sheet: banner rows, the "Scheme Name" header on row 12, fund rows, then BenchMark.
const HDR = ['Scheme Name', 'AUM (Cr.)', 'MTD', '1 Month', '3 Months', '6 Months', '1 Year', 'Ratio', 'Large Cap', 'Mid Cap', 'Small Cap', 'Others'];
const DEBT_HDR = ['Scheme Name', 'AUM (Cr.)', 'MTD', '1 Month', '3 Months', '6 Months', '1 Year', 'Ratio', 'YTM (%)', 'Average Maturity Years', 'Modified Duration Years'];
function sheet(header, rows) {
  const aoa = [];
  for (let i = 0; i < 11; i++) aoa.push(i === 2 ? ['as on 30th September 2026'] : []);
  aoa.push(header);
  rows.forEach(r => aoa.push(r));
  aoa.push(['BenchMark']);
  aoa.push(['Nifty 50 TRI', null, 0.5, 1.0]);
  return XLSX.utils.aoa_to_sheet(aoa);
}
function workbook(sheets) {
  const wb = XLSX.utils.book_new();
  for (const [name, ws] of sheets) XLSX.utils.book_append_sheet(wb, ws, name);
  const buf = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
  return { name: 'Daily MF monitor_30th Sep 2026.xlsx', arrayBuffer: async () => buf };
}
const rec = (name, extra) => Object.assign({ name, asset_class: 'Hybrid', product_class: 'Mutual Fund', sub_category: 'Hybrid Other', r1m: 0.99, aum: 1 }, extra);

(async () => {
  // 1. A refresh-only row refreshes an existing record and keeps its taxonomy; a name not in MASTER
  //    is reported and never created.
  {
    const W = load([rec('Alpha Hybrid FoF-Reg(G)', { sub_category: 'International', asset_class: 'Global Funds', product_class: 'Mutual Funds' })]);
    const r = await W.REFRESH.parseMfMonitor(workbook([
      ['Hybrid', sheet(HDR, [['Alpha Hybrid FoF-Reg(G)', 120, 0.2, 1.5, 3, 6, 12, 1.1, 60, 20, 10, 10], ['Brand New FoF-Reg(G)', 50, 0.1, 1, 2, 3, 4, 1, 50, 25, 15, 10]])],
    ]), {});
    const a = W.MASTER.find(f => f.name === 'Alpha Hybrid FoF-Reg(G)');
    check('refresh-only: ok', r.ok, r.error);
    check('refresh-only: r1m refreshed as percent / 100', a && Math.abs(a.r1m - 0.015) < 1e-12, a && a.r1m);
    check('refresh-only: aum refreshed', a && a.aum === 120);
    check('refresh-only: taxonomy kept', a && a.sub_category === 'International' && a.product_class === 'Mutual Funds');
    check('refresh-only: no record created', W.MASTER.length === 1 && r.newFunds === 0, 'MASTER ' + W.MASTER.length);
    check('refresh-only: unmatched row reported', r.skipped.length === 1 && r.skipped[0].reason === 'not in MASTER' && r.skipped[0].name === 'Brand New FoF-Reg(G)', JSON.stringify(r.skipped));
    check('refresh-only: nothing unclassified', Object.keys(r.unclassified).length === 0);
  }
  // 2. A fund on a mapped sheet keeps that sheet's figures, even when the mapped sheet comes AFTER
  //    the refresh-only sheet.
  {
    const W = load([rec('Beta Arbitrage FoF-Reg(G)')]);
    const r = await W.REFRESH.parseMfMonitor(workbook([
      ['Hybrid', sheet(HDR, [['Beta Arbitrage FoF-Reg(G)', 10, 0, 9.9, 0, 0, 0, 1, 0, 0, 0, 100]])],
      ['Arbitrage Fund', sheet(HDR, [['Beta Arbitrage FoF-Reg(G)', 10, 0, 0.6, 0, 0, 0, 1, 0, 0, 0, 100]])],
    ]), {});
    const b = W.MASTER.find(f => f.name === 'Beta Arbitrage FoF-Reg(G)');
    check('mapped wins: value from the mapped sheet', b && Math.abs(b.r1m - 0.006) < 1e-12, b && b.r1m);
    check('mapped wins: refresh-only row reported', r.skipped.some(s => s.reason === 'listed on a mapped sheet'), JSON.stringify(r.skipped));
  }
  // 3. A fund sheet in neither list is counted as unclassified and never merged; a missing expected
  //    sheet is listed.
  {
    const W = load([rec('Gamma Gold ETF')]);
    const r = await W.REFRESH.parseMfMonitor(workbook([
      ['Gold ETF', sheet(HDR, [['Gamma Gold ETF', 5, 0, 2, 0, 0, 0, 0.5, 0, 0, 0, 100]])],
      ['Solution Oriented - Childrens', sheet(HDR, [['Gamma Gold ETF', 5, 0, 3, 0, 0, 0, 0.5, 0, 0, 0, 100]])],  // trailing space lost
    ]), {});
    const g = W.MASTER.find(f => f.name === 'Gamma Gold ETF');
    check('unclassified: counted per sheet', r.unclassified['Gold ETF'] === 1 && r.unclassified['Solution Oriented - Childrens'] === 1, JSON.stringify(r.unclassified));
    check('unclassified: not merged', g && g.r1m === 0.99);
    check('unclassified: message says so', /2 rows on unrecognised sheets/.test(r.message), r.message);
    check('missing sheets: "Gold" and "Solution Oriented - Childrens " listed', r.emptySheets.includes('Gold') && r.emptySheets.includes('Solution Oriented - Childrens '));
  }
  // 4. Debt Oriented34 is read as a debt sheet (YTM, maturity, duration; no market-cap split).
  {
    const W = load([rec('Delta SDL Apr 2027 Index Fund-Reg(G)', { asset_class: 'Debt', product_class: 'ETF', sub_category: 'Debt ETF' })]);
    await W.REFRESH.parseMfMonitor(workbook([
      ['Debt Oriented34', sheet(DEBT_HDR, [['Delta SDL Apr 2027 Index Fund-Reg(G)', 300, 0.1, 0.5, 1.6, 3.2, 7.1, 0.2, 6.47, 1.47, 1.38]])],
    ]), {});
    const d = W.MASTER.find(f => f.name === 'Delta SDL Apr 2027 Index Fund-Reg(G)');
    check('debt sheet: ytm percent / 100', d && Math.abs(d.ytm - 0.0647) < 1e-12, d && d.ytm);
    check('debt sheet: maturity and duration not scaled', d && d.avg_maturity === 1.47 && d.mod_duration === 1.38);
    check('debt sheet: no market-cap split', d && d.mcap_large === undefined);
  }
  // 5. An empty refresh-only sheet and a mapped sheet still behave as before (a new mapped-sheet fund
  //    is created with the sheet's taxonomy).
  {
    const W = load([]);
    const r = await W.REFRESH.parseMfMonitor(workbook([
      ['Hybrid', sheet(HDR, [])],
      ['Large Cap Fund', sheet(HDR, [['Epsilon Large Cap Fund-Reg(G)', 900, 0.3, 1.2, 0, 0, 0, 1.6, 80, 15, 5, 0]])],
    ]), {});
    const e = W.MASTER.find(f => f.name === 'Epsilon Large Cap Fund-Reg(G)');
    check('mapped sheet: new fund created as before', e && e.sub_category === 'Large Cap' && r.newFunds === 1);
    check('empty refresh-only sheet: no error, listed as empty', r.ok && r.emptySheets.includes('Hybrid'));
  }

  console.log(`  ${passed} passed, ${failed} failed`);
  process.exit(failed ? 1 : 0);
})().catch(e => { console.log('  FAIL ' + (e && e.stack || e)); process.exit(1); });

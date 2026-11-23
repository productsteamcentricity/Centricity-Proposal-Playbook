// Regression test for the look-through helpers (KNOWN_ISSUES C72, C74; D110). Runs site/index.html's
// scripts in a vm (as tools/verify_page.js does) and checks rules, not snapshots, so the monthly data
// can change underneath:
//   C74  H.isNonStockName is the one non-stock test; the equity look-through's stock list carries no
//        non-stock row; m-cap, sector and exposure are unchanged by the filter; the Overlap Matrix
//        filters exactly as before.
//   C72  H.fofUnderlyingName resolves only by the strict rule or an owner pin (H.FOF_UNDERLYING);
//        every pin points at a MASTER record with holdings; synthetic cases for each rule.
//   node tools/test/lookthrough.test.js [site folder]
const fs = require('fs');
const path = require('path');
const vm = require('vm');

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
const W = sandbox, H = W.H, M = W.MASTER;
const close = (a, b) => Math.abs(a - b) < 1e-9;

// ---------------- C74: one non-stock predicate ----------------
check('H.isNonStockName is exposed', typeof H.isNonStockName === 'function');
if (typeof H.isNonStockName !== 'function') H.isNonStockName = () => false;   // keep going: report every failure
const NON_STOCK = ['Tri-Party Repo (TREPS)', 'TREPS', 'Net Current Asset', 'Net Current Assets', 'Other Assets',
  'Cash & Cash Equivalent', 'Cash & Equivalents', 'Clearing Corporation Of India Ltd.', 'Repo Instruments', 'Reverse Repo',
  'Call Money', '91 Days Treasury Bill - 24-Dec-2026', '06.75% GOI - 23-Dec-2029', 'Nifty 50', 'Nifty Bank',
  'Nifty 50 Index - 22500 Put', 'Swiggy Ltd. - 290 Call', 'HDFC Bank Ltd. - Put',
  // D111 additions
  'Others', 'Other Derivaties', 'Other Derivatives', '07.56% Karnataka SDL - 11-Feb-2036', 'Axis Money Market Fund(G)-Direct Plan'];
const STOCK = ['ICICI Bank Ltd.', 'BSE Ltd.', 'Central Depository Services (India) Ltd.', 'National Securities Depository Ltd.',
  'Radiant Cash Management Services Ltd.', 'Quadrant Future Tek Ltd.', 'Crowdstrike Holdings Inc', 'Tata Nifty India Digital ETF',
  'Embassy Office Parks REIT', 'Larsen & Toubro Ltd.',
  // D111: liquid-fund units are kept (the owner's choice), unlike money-market fund units (NON_STOCK above)
  'Kotak Liquid Fund(G)-Direct Plan'];
// When data the checks below depend on has moved (a rename, a dropped scheme, a new workbook spelling), the
// refresh is no longer routine: stop, and change the pin or the pattern with the owner in a code PR (D111, C88).
const REMEDY = ' -> the data moved under a D111 rule: the refresh is NOT routine; stop and fix H.FOF_UNDERLYING or _OTHER_NONSTOCK_RE with the owner in a code PR (KNOWN_ISSUES C88)';
for (const s of NON_STOCK) check(`isNonStockName("${s}")`, H.isNonStockName(s) === true);
for (const s of STOCK) check(`!isNonStockName("${s}")`, H.isNonStockName(s) === false);
check('isNonStockName(undefined) is false', H.isNonStockName(undefined) === false);
// D111: money-market fund units go, liquid-fund units stay (the owner's answer of 23-Nov-2026).
for (const s of ['Kotak Liquid Fund(G)-Direct Plan', 'TRUSTMF Liquid Fund(G)-Direct Plan']) check(`liquid-fund units are kept: "${s}"`, H.isNonStockName(s) === false);
{
  const liq = Object.entries(W.EQUITY_ANALYTICS).find(([, v]) => (v.stocks || []).some(r => /\bliquid\s*fund\b/i.test(r.name)));
  if (liq) {
    const f = M.find(x => x.name === liq[0]);
    const rowName = liq[1].stocks.find(r => /\bliquid\s*fund\b/i.test(r.name)).name;
    if (f) check(`a liquid-fund row stays in the look-through stock list (${f.name})`,
      H.aggEquityScoped([{ fund: f, pct: 100 }], 100, new Set()).stocks.some(([n]) => n === rowName));
  }
}

// Equity look-through on single-fund proposals: no non-stock row in the stock list; every stock keeps
// its weight (as % of the fund's equity exposure); m-cap, sector and exposure match the unfiltered sums.
function refEquity(rec, hybrid) {   // the shares the aggregator must produce for a 100-crore single fund
  const mc = hybrid ? rec.eq_mcap : rec.mcap, sec = hybrid ? rec.eq_sector : rec.sector, tot = hybrid ? rec.eq_total : rec.total;
  const st = hybrid ? rec.eq_stocks : rec.stocks;
  const exp = tot / 100 * 100;
  const out = { exp, mcap: {}, sector: {}, stocks: {} };
  for (const k of ['Large', 'Mid', 'Small', 'Others']) out.mcap[k] = exp > 0 ? (mc[k] || 0) / 100 * 100 / exp * 100 : 0;
  for (const [k, v] of Object.entries(sec)) out.sector[k] = (out.sector[k] || 0) + v / 100 * 100;
  for (const k of Object.keys(out.sector)) out.sector[k] = exp > 0 ? out.sector[k] / exp * 100 : 0;
  for (const s of st) if (!H.isNonStockName(s.name)) out.stocks[s.name] = (out.stocks[s.name] || 0) + s.pct / 100 * 100;
  for (const k of Object.keys(out.stocks)) out.stocks[k] = exp > 0 ? out.stocks[k] / exp * 100 : 0;
  return out;
}
let singles = 0, stockRows = 0, badRows = 0, badShares = 0;
for (const f of M) {
  if (H.isFof(f)) continue;
  const eqA = W.EQUITY_ANALYTICS[f.name], hyA = W.HYBRID_ANALYTICS[f.name];
  const hybrid = H.isHybridScheme(f) && !!hyA;
  const equity = f.asset_class === 'Equity' && ['Mutual Fund', 'ETF', 'PMS'].includes(f.product_class) && !!eqA;
  if (!hybrid && !equity) continue;
  const rec = hybrid ? hyA : eqA;
  if (!(hybrid ? rec.eq_total : rec.total)) continue;
  const got = H.aggEquityScoped([{ fund: f, pct: 100 }], 100, new Set());
  const ref = refEquity(rec, hybrid);
  singles++;
  for (const [nm] of got.stocks) { stockRows++; if (H.isNonStockName(nm)) badRows++; }
  let ok = close(got.exposure_cr, ref.exp) && got.stocks.length === Object.keys(ref.stocks).length;
  for (const k of ['Large', 'Mid', 'Small', 'Others']) ok = ok && close(got.mcap[k], ref.mcap[k]);
  for (const [k, v] of got.sectors) ok = ok && close(v, ref.sector[k]);
  for (const [k, v] of got.stocks) ok = ok && close(v, ref.stocks[k]);
  if (!ok) { badShares++; if (badShares <= 3) check(`look-through shares for ${f.name}`, false); }
}
check('single-fund look-throughs exercised (> 1000)', singles > 1000, String(singles));
check('no non-stock row in any single-fund stock list', badRows === 0, badRows + ' of ' + stockRows);
check('m-cap / sector / exposure / stock weights match the reference', badShares === 0, badShares + ' funds differ');

// A mixed proposal: the top-20 (screen, Excel sheet 9, deck) holds no non-stock row.
{
  const pick = M.filter(f => !H.isFof(f) && f.asset_class === 'Equity' && f.product_class === 'Mutual Fund' && W.EQUITY_ANALYTICS[f.name]
    && W.EQUITY_ANALYTICS[f.name].stocks.some(s => H.isNonStockName(s.name))).slice(0, 6);
  const sel = pick.map(f => ({ fund: f, pct: 100 / pick.length }));
  const eq = H.aggEquityScoped(sel, 100, new Set());
  check('mixed proposal: 6 funds with cash rows', pick.length === 6, String(pick.length));
  check('mixed proposal: top-20 has no non-stock row', eq.stocks.slice(0, 20).every(([nm]) => !H.isNonStockName(nm)));
}

// The Overlap Matrix filters as before (the three patterns, now behind H.isNonStockName) plus only the
// four D111 labels: on every holding name the new predicate differs from the old filter exactly where
// a D111 label matches.
{
  const D111 = /^others?$|^other\s*derivat|^\d[\d.]*\s*%\s*[a-z][a-z ]*\bsdl\b|\bmoney\s*market\s*fund\b/i;
  const OLD_CASH = /^(treps|tri.party.repo|cblo|clearing.corp|ccil|cash|net.receivable|repo|reverse.repo|liquid.bees|overnight)/i;
  const OLD_NONSTOCK = /^(net\s*(current\s*)?assets?\b|other\s*(current\s*)?assets?\b|\d+\s*days?\s*treasury\s*bill|treasury\s*bill|t[-\s]?bills?\b|\d[\d.]*\s*%?\s*goi\b|goi\b|g[-\s]?sec\b|state\s*development\s*loan|corporate\s*debt\s*repo)/i;
  const OLD_DERIV = /^(nifty|midcpnifty|sensex|bank\s*nifty)\b|^call\s*money\b|[-\u2013]\s*\d*\s*(calls?|puts?|fut(ures?)?)\s*$/i;
  const oldNS = s => OLD_CASH.test(s) || OLD_NONSTOCK.test(s) || OLD_DERIV.test(s) || D111.test(s);
  let names = 0, diff = [];
  const seen = new Set();
  for (const v of Object.values(W.EQUITY_ANALYTICS)) for (const s of v.stocks) seen.add(s.name);
  for (const v of Object.values(W.HYBRID_ANALYTICS)) for (const s of v.eq_stocks) seen.add(s.name);
  for (const s of seen) { names++; if (oldNS(s) !== H.isNonStockName(s)) diff.push(s); }
  check('isNonStockName = the old Overlap Matrix filter + the D111 labels, on every holding name', diff.length === 0, diff.slice(0, 5).join(' | '));
  check('the D111 labels still occur in the data', [...seen].some(s => D111.test(s) && !(OLD_CASH.test(s) || OLD_NONSTOCK.test(s) || OLD_DERIV.test(s))),
    'no holding name matches the D111 labels any more' + REMEDY);
  check('holding names exercised (> 1000)', names > 1000, String(names));
}

// ---------------- C72: strict FoF matching + owner pins ----------------
check('H.FOF_UNDERLYING is an object', !!H.FOF_UNDERLYING && typeof H.FOF_UNDERLYING === 'object');
const PINS = H.FOF_UNDERLYING || {};
const byName = new Map(M.map(f => [f.name, f]));
const hasHold = nm => !!(W.EQUITY_ANALYTICS[nm] || W.DEBT_ANALYTICS[nm] || W.HYBRID_ANALYTICS[nm]);
for (const [k, v] of Object.entries(PINS)) {
  check(`pin key is a FoF in MASTER: ${k}`, byName.has(k) && H.isFof(byName.get(k)), 'renamed or removed from MASTER' + REMEDY);
  check(`pin target is in MASTER with holdings: ${v}`, v === null || (byName.has(v) && hasHold(v) && !H.isFof(byName.get(v))),
    (byName.has(v) ? 'no holdings in the analytics stores' : 'renamed or removed from MASTER') + REMEDY);
  check(`pin resolves: ${k}`, H.fofUnderlyingName(byName.get(k) || { name: k }) === v, 'the pin no longer applies' + REMEDY);
}
// An independent copy of the strict rule.
const NOISE = new Set(['etf', 'fof', 'fofs', 'reg', 'g', 'idcw', 'pru', 'passive', 'active', 'fund', 'of', 'funds', 'plan', 'direct',
  'growth', 'dividend', 'div', 'reinvestment', 'reinv', 'option', 'scheme']);
const toks = s => new Set(String(s || '').replace(/([A-Za-z])(\d)/g, '$1 $2').replace(/(\d)([A-Za-z])/g, '$1 $2').toLowerCase()
  .replace(/[^a-z0-9]+/g, ' ').split(' ').filter(t => t.length > 0 && !NOISE.has(t)));   // short tokens count ("50", "IT")
const amc = s => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().split(' ')[0];
function strictRef(fund) {
  const ft = toks(fund.name), a = amc(fund.name);
  let best = [], bestN = 0;
  for (const c of M) {
    if (!(c.product_class === 'ETF' || c.sub_category === 'Index Fund') || H.isFof(c) || c.name === fund.name) continue;
    if (c.asset_class !== fund.asset_class || amc(c.name) !== a) continue;
    const ct = toks(c.name);
    if (ct.size < 2 || ![...ct].every(t => ft.has(t))) continue;
    if (ct.size > bestN) { bestN = ct.size; best = [c]; } else if (ct.size === bestN) best.push(c);
  }
  return best.length === 1 ? best[0].name : null;
}
let fofs = 0, resolved = 0, mismatch = [], crossClass = [];
for (const f of M) {
  if (!H.isFof(f)) continue;
  fofs++;
  const u = H.fofUnderlyingName(f);
  if (u) resolved++;
  const want = Object.prototype.hasOwnProperty.call(PINS, f.name) ? PINS[f.name] : strictRef(f);
  if (u !== want) mismatch.push(f.name + ' -> ' + u + ' (want ' + want + ')');
  if (u && !Object.prototype.hasOwnProperty.call(PINS, f.name) && byName.get(u).asset_class !== f.asset_class) crossClass.push(f.name);
  // the scope gates read the same resolution
  check(`holdingsLookupName agrees: ${f.name}`, H.holdingsLookupName(f) === (u || f.name));
}
check('FoFs exercised (> 100)', fofs > 100, String(fofs));
check('every FoF resolves by the strict rule or its pin', mismatch.length === 0, mismatch.slice(0, 5).join(' | '));
check('no unpinned FoF resolves to another asset class (a hybrid FoF never counts as an equity ETF)', crossClass.length === 0, crossClass.join(' | '));

// Named regressions: FoFs today's matcher sent to an unrelated fund resolve to nothing (or their pin).
for (const [nm, want] of [['Mirae Asset Hang Seng TECH ETF FoF-Reg(G)', null], ['Aditya Birla SL Conservative Hybrid Active FOF(G)', null],
  ['Nippon India Diversified Equity Flexicap Passive FoF-Reg(G)', null]]) {
  if (byName.has(nm)) check(`regression: ${nm} -> ${want}`, H.fofUnderlyingName(byName.get(nm)) === want);
}
// Synthetic cases (MASTER swapped for the duration of the call).
function withMaster(list, fn) { const keep = W.MASTER; W.MASTER = list; try { return fn(); } finally { W.MASTER = keep; } }
const R = (name, ac, pc, sc) => ({ name, asset_class: ac, product_class: pc, sub_category: sc });
const FOF = R('Alpha Nifty 200 Quality 30 ETF FoF-Reg(G)', 'Equity', 'ETF', 'Equity ETF');
const ETF = R('Alpha Nifty 200 Quality 30 ETF', 'Equity', 'ETF', 'Equity ETF');
check('synthetic: exact match resolves', withMaster([FOF, ETF], () => H.fofUnderlyingName(FOF)) === ETF.name);
check('synthetic: "Nifty200" equals "Nifty 200"', withMaster([FOF, R('Alpha Nifty200 Quality 30 ETF', 'Equity', 'ETF', 'Equity ETF')], () => H.fofUnderlyingName(FOF)) === 'Alpha Nifty200 Quality 30 ETF');
{
  const IFOF = R('Alpha Nifty 200 Quality 30 Index FoF-Reg(G)', 'Equity', 'ETF', 'Equity ETF');
  check('synthetic: index fund (sub_category) resolves', withMaster([IFOF, R('Alpha Nifty 200 Quality 30 Index Fund-Reg(G)', 'Equity', 'Mutual Fund', 'Index Fund')], () => H.fofUnderlyingName(IFOF)) === 'Alpha Nifty 200 Quality 30 Index Fund-Reg(G)');
}
check('synthetic: another AMC is never used', withMaster([FOF, R('Beta Nifty 200 Quality 30 ETF', 'Equity', 'ETF', 'Equity ETF')], () => H.fofUnderlyingName(FOF)) === null);
check('synthetic: a candidate token outside the FoF name rejects it', withMaster([FOF, R('Alpha Nifty 200 Value 30 ETF', 'Equity', 'ETF', 'Equity ETF')], () => H.fofUnderlyingName(FOF)) === null);
// The AMC word counts as a token: "Alpha Gold ETF" (alpha, gold) is enough, "Alpha ETF" (alpha) is not.
check('synthetic: two tokens (AMC + one) resolve', withMaster([R('Alpha Gold FoF-Reg(G)', 'Commodity', 'ETF', 'Gold'), R('Alpha Gold ETF', 'Commodity', 'ETF', 'Gold')], () => H.fofUnderlyingName(R('Alpha Gold FoF-Reg(G)', 'Commodity', 'ETF', 'Gold'))) === 'Alpha Gold ETF');
check('synthetic: one shared token is not enough', withMaster([R('Alpha Gold FoF-Reg(G)', 'Commodity', 'ETF', 'Gold'), R('Alpha ETF', 'Commodity', 'ETF', 'Gold')], () => H.fofUnderlyingName(R('Alpha Gold FoF-Reg(G)', 'Commodity', 'ETF', 'Gold'))) === null);
check('synthetic: another asset class is never used (no fallback)', withMaster([R('Alpha Multi Asset Nifty 50 FoF-Reg(G)', 'Hybrid', 'Mutual Fund', 'Solution Oriented'), R('Alpha Nifty 50 ETF', 'Equity', 'ETF', 'Equity ETF')], () => H.fofUnderlyingName(R('Alpha Multi Asset Nifty 50 FoF-Reg(G)', 'Hybrid', 'Mutual Fund', 'Solution Oriented'))) === null);
check('synthetic: the most specific candidate wins', withMaster([FOF, ETF, R('Alpha Nifty 200 ETF', 'Equity', 'ETF', 'Equity ETF')], () => H.fofUnderlyingName(FOF)) === ETF.name);
check('synthetic: a tie at the top returns null', withMaster([FOF, ETF, R('Alpha Nifty 200 Quality 30 Fund ETF', 'Equity', 'ETF', 'Equity ETF')], () => H.fofUnderlyingName(FOF)) === null);
// Short tokens count (Gate B of TASK-086): a number or a two-letter word the FoF does not carry rejects a candidate.
check('synthetic: "Quality 30" FoF never takes a "Quality 50" ETF', withMaster([FOF, R('Alpha Nifty 200 Quality 50 ETF', 'Equity', 'ETF', 'Equity ETF')], () => H.fofUnderlyingName(FOF)) === null);
{
  const DEF = R('Alpha Nifty India Defence ETF FoF-Reg(G)', 'Equity', 'ETF', 'Equity ETF');
  check('synthetic: a Defence FoF never takes a "Nifty 50" ETF', withMaster([DEF, R('Alpha Nifty 50 ETF', 'Equity', 'ETF', 'Equity ETF')], () => H.fofUnderlyingName(DEF)) === null);
  const N50 = R('Alpha Nifty 50 ETF FoF-Reg(G)', 'Equity', 'ETF', 'Equity ETF');
  check('synthetic: a matching number resolves ("Nifty 50" FoF -> "Nifty 50" ETF, not "Nifty Next 50")',
    withMaster([N50, R('Alpha Nifty 50 ETF', 'Equity', 'ETF', 'Equity ETF'), R('Alpha Nifty Next 50 ETF', 'Equity', 'ETF', 'Equity ETF')], () => H.fofUnderlyingName(N50)) === 'Alpha Nifty 50 ETF');
  const FLEXI = R('Alpha Diversified Equity Flexicap FoF-Reg(G)', 'Equity', 'ETF', 'Equity ETF');
  check('synthetic: a two-letter token counts (a flexicap FoF never takes a "Nifty IT" ETF)', withMaster([FLEXI, R('Alpha ETF Nifty IT', 'Equity', 'ETF', 'Equity ETF')], () => H.fofUnderlyingName(FLEXI)) === null);
}
check('synthetic: a FoF is never an underlying', withMaster([FOF, R('Alpha Nifty 200 Quality 30 ETF FoF-Dir(G)', 'Equity', 'ETF', 'Equity ETF')], () => H.fofUnderlyingName(FOF)) === null);
check('synthetic: not a FoF returns null', withMaster([ETF], () => H.fofUnderlyingName(ETF)) === null);
{
  const keep = H.FOF_UNDERLYING;
  H.FOF_UNDERLYING = Object.assign({}, keep || {}, { [FOF.name]: 'Gamma Missing ETF' });
  check('synthetic: a pin to a name not in MASTER returns null', withMaster([FOF, ETF], () => H.fofUnderlyingName(FOF)) === null);
  H.FOF_UNDERLYING = Object.assign({}, keep || {}, { [FOF.name]: null });
  check('synthetic: a null pin returns null', withMaster([FOF, ETF], () => H.fofUnderlyingName(FOF)) === null);
  H.FOF_UNDERLYING = keep;
}

console.log(`  ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);

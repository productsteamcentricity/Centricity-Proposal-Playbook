// PERIODIC: replace one Bonds desk sub-list in window.MASTER from a Bond List workbook.
// --desk names the sub_category being refreshed ("Invictus" / "OneDigital"); every other desk is
// left byte-for-byte alone and a gate enforces that.
//
//   node tools/merge_bond_list.js "<Bond List_<date>.xlsx>" --desk Invictus            # dry run
//   node tools/merge_bond_list.js "<Bond List_<date>.xlsx>" --desk Invictus --apply    # writes index.html
//   ... [--sheet "<tab name>"] [--html <path>]   --html defaults to ../site/index.html (the dashboard)
//
// Which sheet: --sheet if given; else the workbook's only sheet; else the one sheet whose tab name
// contains the desk ("Invictus Bonds Options"). Anything else is refused as ambiguous, and so is a
// tab whose name contains a different desk. The Jun-2026 workbook carries both desks, OneDigital
// first; this tool used to load whichever sheet came first and label it Invictus.
//
// Expected sheet layout (row 1-2 are a two-tier merged header, data from row 3):
//   B Issuer | C Rating | D/E Expected Pre Tax IRR (low/high) | F Maturity Date | H Residual Tenor
//
// Things this handles, because the source has done all of them:
//  - The maturity CELL has a recurring century typo (2030 stored as 1930). The date embedded in
//    the issuer NAME wins; any disagreement between the two is reported.
//  - The same bond is listed twice in different formats ("7.7942 L&T FINANCE LIMITED 27JUN2031"
//    and "7.7942% L& T Finance 2031"), sometimes with the coupon omitted entirely
//    ("NAVI FINSERV 31.08.2029"). Rows are deduped on issuer + maturity, and the best-formed
//    name is kept. Same issuer and maturity but genuinely different coupons stay separate.
//  - Ratings arrive as "Sov" or "SOV"; both normalise to "SOV", which is what DEBT_ANALYTICS
//    holdings use, so the credit-quality chart does not split into two sovereign slices.
//
// Requires SheetJS: npm install xlsx@0.18.5. Back up index.html first (the write itself is atomic).
// 06-Aug-2026 run: 39 rows -> 36 unique bonds, Invictus 14 -> 36, MASTER 7452 -> 7474.
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const B = require('./lib/blocklib');

const USAGE = 'Usage: node tools/merge_bond_list.js "<Bond List.xlsx>" --desk <Invictus|OneDigital> [--sheet "<tab name>"] [--apply] [--html <index.html>]';
const usage = msg => { if (msg) console.error(msg); console.error(USAGE); process.exit(2); };
const argv = process.argv.slice(2);
let APPLY = false, SRC = null, HTML = null, SHEET = null, DESK_ARG = null;
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  const val = () => { const v = argv[++i]; if (v == null || v.startsWith('--')) usage('missing value for ' + a); return v; };
  if (a === '--apply') { APPLY = true; continue; }
  if (a === '--html') { HTML = val(); continue; }
  if (a === '--sheet') { SHEET = val(); continue; }
  if (a === '--desk') { DESK_ARG = val(); continue; }
  if (a.startsWith('--')) usage('unknown flag: ' + a);
  if (SRC !== null) usage('unexpected extra argument: ' + a);
  SRC = a;
}
HTML = HTML || path.join(__dirname, '..', 'site', 'index.html');
if (!SRC || !fs.existsSync(SRC)) usage(SRC ? '*** workbook not found: ' + SRC : null);
if (!fs.existsSync(HTML)) usage('*** index.html not found: ' + HTML);

const MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const clean = s => String(s == null ? '' : s).replace(/\u00A0/g, ' ').replace(/\s+/g, ' ').trim();
const serialToDate = n => new Date(Date.UTC(1899, 11, 30) + Number(n) * 86400000);
const fmtDate = d => `${d.getUTCDate()}-${MON[d.getUTCMonth()]}-${d.getUTCFullYear()}`;

// --- MASTER (read first: the desks that exist decide what --desk may name) ---
// blocklib: brace-matched, and refuses a prefix that occurs more than once.
const PREFIX = 'window.MASTER = ';
const html = fs.readFileSync(HTML, 'utf8');
const loc = B.locate(html, PREFIX);
const master = loc.value;

// --- which desk, which sheet: stated, never assumed ---
const DESKS = [...new Set(master.filter(r => r.product_class === 'Bonds').map(r => r.sub_category))];
const DESK = DESKS.find(d => DESK_ARG && d.toLowerCase() === DESK_ARG.toLowerCase());
if (!DESK) {
  console.error(DESK_ARG ? `*** --desk "${DESK_ARG}" is not a Bonds desk in MASTER` : '*** --desk is required');
  console.error(`    Bonds desks in MASTER: ${DESKS.join(', ')}\n${USAGE}`);
  process.exit(2);
}
const wb = XLSX.readFile(SRC, { cellDates: false });
const desksIn = tab => DESKS.filter(d => tab.toLowerCase().includes(d.toLowerCase()));
let sheetName = null;
if (SHEET !== null) sheetName = wb.SheetNames.includes(SHEET) ? SHEET : null;
else if (wb.SheetNames.length === 1) sheetName = wb.SheetNames[0];
else {
  const m = wb.SheetNames.filter(n => desksIn(n).includes(DESK));
  if (m.length === 1) sheetName = m[0];
}
if (!sheetName) {
  console.error(SHEET !== null ? `*** no sheet named "${SHEET}" in ${path.basename(SRC)}`
    : `*** ${path.basename(SRC)} has ${wb.SheetNames.length} sheets and no single one is named for ${DESK} — pass --sheet`);
  console.error('    sheets: ' + wb.SheetNames.map(n => `"${n}"`).join(', '));
  process.exit(2);
}
const named = desksIn(sheetName);
if (named.length && !(named.length === 1 && named[0] === DESK)) {
  console.error(`*** sheet "${sheetName}" is named for ${named.join(' / ')}, but --desk is ${DESK} — refusing`);
  process.exit(2);
}
console.log(`desk ${DESK}   sheet "${sheetName}" (${wb.SheetNames.length} in workbook)`);

// --- read ---
const ws = wb.Sheets[sheetName];
const aoa = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null, raw: true });
const C = { NAME: 1, RATING: 2, IRR_LO: 3, IRR_HI: 4, MAT: 5, TENOR: 7 };
const hdr = (aoa[0] || []).map(clean);
if (!(/^issuer$/i.test(hdr[C.NAME]) && /^rating$/i.test(hdr[C.RATING]) && /irr/i.test(hdr[C.IRR_LO]) && /^maturity/i.test(hdr[C.MAT]))) {
  console.error(`*** sheet "${sheetName}" row 1 is not the Bond List header (B Issuer, C Rating, D Expected Pre Tax IRR, F Maturity Date) — layout changed, aborting`);
  console.error('    row 1: ' + JSON.stringify(aoa[0] || []));
  process.exit(1);
}

const rows = [];
for (let i = 2; i < aoa.length; i++) {
  const r = aoa[i] || [];
  const nm = clean(r[C.NAME]);
  if (!nm) continue;
  if (/^(issuer|structure|total|grand total)$/i.test(nm)) continue;
  const lo = Number(r[C.IRR_LO]), hi = Number(r[C.IRR_HI]);
  if (!isFinite(lo)) { console.log(`  ! row ${i + 1} has no IRR, skipped: ${nm}`); continue; }
  rows.push({ excelRow: i + 1, name: nm, rating: clean(r[C.RATING]), lo, hi: isFinite(hi) ? hi : lo, mat: r[C.MAT], tenor: r[C.TENOR] });
}
console.log(`parsed ${rows.length} bond rows from ${path.basename(SRC)} [${sheetName}]\n`);

// --- maturity: prefer the date embedded in the NAME (the source's date cell has a history of a
//     century typo, 2030 stored as 1930). Cross-check the two and report any disagreement. ---
function dateFromName(nm) {
  let m = nm.match(/(\d{1,2})\s*([A-Za-z]{3})\s*(\d{4})/);                       // 14JUN2027
  if (m) { const mo = MON.findIndex(x => x.toLowerCase() === m[2].toLowerCase()); if (mo >= 0) return new Date(Date.UTC(+m[3], mo, +m[1])); }
  m = nm.match(/(\d{1,2})[.\-\/](\d{1,2})[.\-\/](\d{4})/);                       // 31.08.2029
  if (m) return new Date(Date.UTC(+m[3], +m[2] - 1, +m[1]));
  return null;
}
let typoFixed = 0, mismatches = 0;
for (const b of rows) {
  const fromName = dateFromName(b.name);
  const fromCell = (b.mat != null && isFinite(Number(b.mat))) ? serialToDate(b.mat) : null;
  if (fromName && fromCell && fromName.getUTCFullYear() !== fromCell.getUTCFullYear()) {
    mismatches++;
    if (fromCell.getUTCFullYear() < 2000) typoFixed++;
    console.log(`  ~ row ${b.excelRow}: name says ${fromName.getUTCFullYear()}, cell says ${fromCell.getUTCFullYear()} -> using name  [${b.name}]`);
  }
  b.date = fromName || fromCell;
  if (!b.date) console.log(`  ! row ${b.excelRow}: no parseable maturity: ${b.name}`);
}
console.log(`name/cell year mismatches: ${mismatches} (of which century typos: ${typoFixed})\n`);

// --- dedupe: the workbook lists some bonds twice in different formats. Same coupon + issuer +
//     maturity = same instrument. Prefer the row whose NAME carries an explicit day-month-year. ---
const couponOf = nm => { const m = clean(nm).match(/^(\d+(?:\.\d+)?)\s*%?\s+/); return m ? parseFloat(m[1]).toFixed(4) : null; };
const issuerKey = nm => clean(nm).toLowerCase()
  .replace(/^\d+(\.\d+)?\s*%?\s*/, '')
  .replace(/\d{1,2}\s*[a-z]{3}\s*\d{4}|\d{1,2}[.\-\/]\d{1,2}[.\-\/]\d{4}|\b(19|20)\d{2}\b/g, '')
  .replace(/\((secured|unsecured)\)/g, '')
  .replace(/\b(limited|ltd|private|pvt)\b/g, '')
  .replace(/[^a-z0-9]+/g, '');
// Group on issuer + maturity first; a row that omits the coupon ("NAVI FINSERV 31.08.2029")
// is the same instrument as one that states it, so an absent coupon must not split the group.
const groups = new Map();
for (const b of rows) {
  const k = `${issuerKey(b.name)}|${b.date ? b.date.toISOString().slice(0, 10) : '?'}`;
  if (!groups.has(k)) groups.set(k, []);
  groups.get(k).push(b);
}
// Prefer the best-formed name: explicit coupon, then a DDMMMYYYY date, then first-listed.
const quality = x => (couponOf(x.name) ? 2 : 0) + (/\d{1,2}\s*[A-Za-z]{3}\s*\d{4}/.test(x.name) ? 1 : 0);
const picked = [];
for (const [, list] of groups) {
  // Same issuer + maturity but genuinely different coupons = different instruments; keep both.
  const byCoupon = new Map();
  for (const x of list) {
    const c = couponOf(x.name);
    const key = c === null ? '?' : c;
    if (!byCoupon.has(key)) byCoupon.set(key, []);
    byCoupon.get(key).push(x);
  }
  const known = [...byCoupon.keys()].filter(k => k !== '?');
  let buckets;
  if (known.length <= 1) buckets = [list];                       // one coupon (or none stated)
  else {
    buckets = known.map(k => byCoupon.get(k));
    const unknown = byCoupon.get('?') || [];
    if (unknown.length) { console.log(`  ! coupon-less row(s) beside ${known.length} distinct coupons, kept separately: ${unknown.map(x => 'r' + x.excelRow).join(', ')}`); buckets.push(unknown); }
  }
  for (const b of buckets) {
    if (b.length > 1) {
      console.log(`  = duplicate (${b.length}): ${b.map(x => `r${x.excelRow} "${x.name}"`).join('  ||  ')}`);
      const irrs = new Set(b.map(x => x.hi));
      if (irrs.size > 1) console.log(`      *** differing IRR across duplicates: ${[...irrs].join(', ')} — keeping the best-formed row`);
      const rts = new Set(b.map(x => clean(x.rating).toUpperCase()));
      if (rts.size > 1) console.log(`      *** differing rating across duplicates: ${[...rts].join(', ')}`);
    }
    picked.push(b.slice().sort((x, y) => quality(y) - quality(x) || x.excelRow - y.excelRow)[0]);
  }
}
console.log(`\n${rows.length} rows -> ${picked.length} unique bonds (${rows.length - picked.length} duplicate row(s) dropped)\n`);

// --- build records in the shape the existing desk rows use ---
const normRating = r => { const v = clean(r); return /^sov$/i.test(v) ? 'SOV' : v.toUpperCase(); };
const built = picked.map(b => {
  const nm = `${b.name} (${DESK})`;
  return {
    name: nm, asset_class: 'Debt', product_class: 'Bonds', sub_category: DESK,
    irr_low: b.lo, irr_high: b.hi, aum: null,
    r1m: null, r3m: null, r6m: null, r1y: b.hi, r2y: null, r3y: b.hi, r5y: b.hi, r10y: null, si: null,
    expense: null, inception: null, fund_mgr: null,
    exit_load: b.date ? `Hold-to-maturity (${fmtDate(b.date)})` : 'Hold-to-maturity',
    mcap_large: null, mcap_mid: null, mcap_small: null, mcap_other: null,
    ytm: null, avg_maturity: null, mod_duration: null,
    bond_issuer: clean(b.name)
      .replace(/^\d+(\.\d+)?\s*%?\s+/, '')                              // leading coupon
      .replace(/\s*\d{1,2}\s*[A-Za-z]{3}\s*\d{4}\s*$/, '')              // trailing 14JUN2027
      .replace(/\s*\d{1,2}[.\-\/]\d{1,2}[.\-\/]\d{4}\s*$/, '')          // trailing 31.08.2029
      .replace(/\s*\((secured|unsecured)\)\s*$/i, '')
      .replace(/\s*\b(19|20)\d{2}\b\s*$/, '')                           // trailing bare year
      .trim(),
    bond_rating: normRating(b.rating),
  };
});

// --- splice into the MASTER block (read at the top) ---
const before = master.filter(r => r.product_class === 'Bonds');
const oldInv = before.filter(r => r.sub_category === DESK);
const oneDigitalBefore = before.filter(r => r.sub_category !== DESK).map(r => r.name);
console.log(`MASTER baseline ${master.length}; Bonds ${before.length} (${DESK} ${oldInv.length}, other ${before.length - oldInv.length})`);

const firstIdx = master.findIndex(r => r.product_class === 'Bonds' && r.sub_category === DESK);
const kept = master.filter(r => !(r.product_class === 'Bonds' && r.sub_category === DESK));
const at = firstIdx >= 0 ? Math.min(firstIdx, kept.length) : kept.length;
const next = kept.slice(0, at).concat(built, kept.slice(at));

// --- gates ---
let fail = false;
console.log(`\nGATE at least one bond parsed: ${built.length ? 'PASS (' + built.length + ')' : '*** FAIL: the sheet gave no bonds — refusing to empty the ' + DESK + ' desk'}`);
if (!built.length) fail = true;

// A1's failure mode was another desk's list written under this desk's label. Both desks can offer
// the same bonds (the 08-Jun-2026 workbook's two sheets list the same 14), so overlap is REPORTED,
// never blocking: when another desk already carries every bond, confirm with the desk that this
// really is this desk's list before applying.
const squash = t => t.toLowerCase().replace(/[^a-z0-9]/g, '');
const baseOf = r => { const sfx = ' (' + r.sub_category + ')'; return squash(r.name.endsWith(sfx) ? r.name.slice(0, -sfx.length) : r.name); };
const otherDesks = new Map();
for (const r of before.filter(x => x.sub_category !== DESK)) {
  if (!otherDesks.has(r.sub_category)) otherDesks.set(r.sub_category, new Set());
  otherDesks.get(r.sub_category).add(baseOf(r));
}
for (const [d, names] of otherDesks) {
  const hit = picked.filter(b => names.has(squash(b.name))).length;
  console.log(`CHECK new ${DESK} bonds already listed under ${d}: ${hit} of ${picked.length}` +
    (picked.length && hit === picked.length ? `  *** every bond — confirm with the desk that this is the ${DESK} list, not the ${d} one` : ''));
}

const dup = {}; next.forEach(r => dup[r.name] = (dup[r.name] || 0) + 1);
const dupes = Object.entries(dup).filter(([, c]) => c > 1);
console.log(`GATE duplicate names in MASTER: ${dupes.length ? '*** FAIL: ' + dupes.map(d => d[0]).join(' | ') : 'PASS (0)'}`);
if (dupes.length) fail = true;

const od = next.filter(r => r.product_class === 'Bonds' && r.sub_category !== DESK).map(r => r.name);
const odSame = od.length === oneDigitalBefore.length && od.every((n, i) => n === oneDigitalBefore[i]);
console.log(`GATE other bond desks untouched: ${odSame ? 'PASS (' + od.length + ' rows)' : '*** FAIL'}`);
if (!odSame) fail = true;

console.log(`GATE MASTER count: ${master.length} -> ${next.length}  (${DESK} ${oldInv.length} -> ${built.length})`);
const badIrr = built.filter(r => !(r.irr_low > 0 && r.irr_low < 0.30 && r.irr_high >= r.irr_low && r.irr_high < 0.30));
console.log(`GATE IRR sane (0-30%, high>=low): ${badIrr.length ? '*** FAIL: ' + badIrr.map(r => r.name).join(' | ') : 'PASS'}`);
if (badIrr.length) fail = true;
// Every bond must carry a maturity, and it must be after today — a past date means the century
// typo slipped through or the row is stale. (built[i] is picked[i], so picked[i].date is its date.)
const now = new Date(), today = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
const yearOf = r => { const m = r.exit_load.match(/-(\d{4})\)$/); return m ? +m[1] : null; };
const badDate = built.filter((r, i) => !picked[i].date || picked[i].date < today);
console.log(`GATE maturity present and not before today (${fmtDate(today)}): ${badDate.length ? '*** FAIL: ' + badDate.map(r => `${r.name} [${r.exit_load}]`).join(' | ') : 'PASS'}`);
if (badDate.length) fail = true;
const yrs = built.map(yearOf).filter(Boolean);
console.log(`GATE maturity range: ${yrs.length ? Math.min(...yrs) + ' .. ' + Math.max(...yrs) : 'n/a (no dated bonds)'}`);
console.log(`GATE ratings: ${[...new Set(built.map(r => r.bond_rating))].join(', ')}`);

// --- splice, then re-read what would be written ---
const isDesk = r => r.product_class === 'Bonds' && r.sub_category === DESK;
const out = B.spliceBlocks(html, [{ prefix: PREFIX, value: next }]);
const reLoc = B.locate(out, PREFIX);
const outsideSame = out.slice(0, reLoc.s) === html.slice(0, loc.s) && out.slice(reLoc.e + 1) === html.slice(loc.e + 1);
const keptSame = JSON.stringify(reLoc.value.filter(r => !isDesk(r))) === JSON.stringify(master.filter(r => !isDesk(r)));
const deskSame = JSON.stringify(reLoc.value.filter(isDesk)) === JSON.stringify(built);
console.log(`GATE written MASTER re-reads: ${keptSame && deskSame && outsideSame
  ? `PASS (${reLoc.value.length - built.length} other records identical, ${built.length} ${DESK} rows as listed, bytes outside MASTER unchanged)`
  : '*** FAIL:' + (keptSame ? '' : ' other records changed;') + (deskSame ? '' : ' desk rows differ from the list;') + (outsideSame ? '' : ' bytes outside MASTER changed')}`);
if (!(keptSame && deskSame && outsideSame)) fail = true;

console.log(`\n--- new ${DESK} list ---`);
built.forEach((r, i) => console.log(`  ${String(i + 1).padStart(2)}. ${r.bond_rating.padEnd(4)} ${(r.irr_high * 100).toFixed(2).padStart(6)}%  ${r.exit_load.replace(/^Hold-to-maturity \(?|\)$/g, '').padEnd(12)}  ${r.name}`));

if (!APPLY) {
  console.log('\n[dry run] pass --apply to write index.html');
  if (fail) console.error('*** a gate failed — --apply would refuse');
  process.exit(fail ? 1 : 0);
}
if (fail) { console.error('\n*** a gate failed — refusing to write'); process.exit(1); }
if (!out.trimEnd().endsWith('</html>')) { console.error('*** output does not end with </html> — refusing'); process.exit(1); }
B.writeFilesAtomic([{ file: HTML, content: out }]);   // temp file, then rename
console.log(`\nWROTE ${HTML} — ${out.length} bytes (was ${html.length})`);

// MONTHLY: refresh MASTER.fund_mgr from "Fund Manager Data_<date>.xlsx".
//
// The Daily MF Monitor already fills fund_mgr, but only from its "[Fund Manager 1]" column —
// one name, even where a scheme is run by three or four people. This workbook is one row per
// manager per stint (Scheme Name | Inception Date | Fund Manager | From Date | To Date), so it
// can name the whole current team.
//
//   node tools/merge_fund_managers.js "<Fund Manager Data_<date>.xlsx>" [--html <index.html>] [--apply]
//
// Dry run by default. A failed gate exits 1 (dry run or --apply), and --apply then writes nothing.
// The header row is found by its column names in the first 30 rows. Dates are read as calendar
// days (tools/lib/dates.js), so the printed dates are the workbook's own.
//
// Join: exact name, then prev_name (a live name always wins), then a normalised name. A
// normalised name or prev_name that fits two or more MASTER records is reported and not written.
//
// "Current" is decided PER SCHEME, not against one global date: AMCs report to different
// month-ends in the same file (Aug-2026 had 1,123 rows at 31-Aug and 3,317 at 31-Jul). A
// manager is current when their To Date is the latest To Date that scheme has — provided that
// date is recent enough to trust (within RECENT_DAYS of the file's own latest). A scheme whose
// roster stopped updating long ago keeps whatever the Monitor gave it rather than being
// credited to whoever happened to be there last.
//
// fund_mgr is internal — the Master Editor column and the Section 3 search box. It is not shown
// to clients, so a multi-name string is safe here.
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const blocklib = require('./lib/blocklib.js');
const { isoDay } = require('./lib/dates.js');

const RECENT_DAYS = 90;

const USAGE = 'Usage: node tools/merge_fund_managers.js "<Fund Manager Data_<date>.xlsx>" [--html <index.html>] [--apply]';
const usage = msg => { if (msg) console.error(msg); console.error(USAGE); process.exit(2); };
const argv = process.argv.slice(2);
let APPLY = false, SRC = null, HTML = null;
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === '--apply') { APPLY = true; continue; }
  if (a === '--html') { HTML = argv[++i] || usage('--html needs a path'); continue; }
  if (a.startsWith('--')) usage('unknown flag: ' + a);
  if (SRC !== null) usage('unexpected argument: ' + a);
  SRC = a;
}
HTML = HTML || path.join(__dirname, '..', 'site', 'index.html');
if (!SRC || !fs.existsSync(SRC)) usage(SRC ? '*** workbook not found: ' + SRC : null);
if (!fs.existsSync(HTML)) usage('*** index.html not found: ' + HTML);
console.log(`source : ${path.basename(SRC)}`);

// Header row: the first of the first 30 rows that names Scheme Name, Fund Manager and To Date
// (exact names, ignoring case and spaces). From Date is optional; it only orders the team.
const hkey = s => String(s == null ? '' : s).toLowerCase().replace(/\s+/g, '');   // \s includes NBSP
const wb = XLSX.readFile(SRC, { cellDates: true });
const ws = wb.Sheets[wb.SheetNames[0]];
const grid = ws && ws['!ref'] ? XLSX.utils.sheet_to_json(ws, { header: 1, defval: null, blankrows: true }) : [];
const NEED = ['Scheme Name', 'Fund Manager', 'To Date'];
const hdrAt = grid.slice(0, 30).findIndex(r => NEED.every(n => (r || []).some(c => hkey(c) === hkey(n))));
if (hdrAt < 0) {
  console.error(`*** no header row with ${NEED.map(n => `"${n}"`).join(', ')} in the first 30 rows — column layout changed, aborting`);
  process.exit(1);
}
const rows = XLSX.utils.sheet_to_json(ws, { defval: null, range: XLSX.utils.decode_range(ws['!ref']).s.r + hdrAt });
const H = Object.keys(rows[0] || {});
const find = name => {
  // Count in the raw header row too: SheetJS renames an exact repeat to "<name>_1", which H alone would miss.
  const n = Math.max(grid[hdrAt].filter(c => hkey(c) === hkey(name)).length, H.filter(h => hkey(h) === hkey(name)).length);
  if (n > 1) { console.error(`*** column "${name}" appears ${n} times — aborting`); process.exit(1); }
  return H.find(h => hkey(h) === hkey(name));
};
const cScheme = find('Scheme Name'), cMgr = find('Fund Manager'),
      cFrom = find('From Date'), cTo = find('To Date');
if (!cScheme || !cMgr || !cTo) { console.error(`*** column layout changed (${H.join(' | ')}) — aborting`); process.exit(1); }

const iso = isoDay;   // calendar day of an Excel date cell (KNOWN_ISSUES A6), or null
const data = rows.filter(r => r[cMgr] && String(r[cMgr]).trim() && iso(r[cTo]));
console.log(`rows   : ${rows.length} (${data.length} with a manager and a To Date)`);
if (!data.length) { console.error('*** no row has a manager and a To Date (date cells unreadable or layout changed) — aborting'); process.exit(1); }

// The file's own latest To Date is the yardstick for "recent".
let fileMax = '';
for (const r of data) { const d = iso(r[cTo]); if (d > fileMax) fileMax = d; }
const cutoff = new Date(new Date(fileMax + 'T00:00:00Z').getTime() - RECENT_DAYS * 86400000).toISOString().slice(0, 10);
console.log(`latest To Date in file: ${fileMax}   (a scheme is "live" if its own latest is >= ${cutoff})\n`);

// ---------- per-scheme current roster ----------
const bySch = new Map();
for (const r of data) {
  const s = String(r[cScheme]).trim();
  if (!bySch.has(s)) bySch.set(s, []);
  bySch.get(s).push({ mgr: String(r[cMgr]).trim(), from: iso(r[cFrom]) || '', to: iso(r[cTo]) });
}
const roster = new Map();
let stale = 0;
for (const [s, list] of bySch) {
  const max = list.reduce((a, b) => (b.to > a ? b.to : a), '');
  if (max < cutoff) { stale++; continue; }
  const cur = list.filter(x => x.to === max);
  // Longest-serving first, so the lead manager reads first; de-duped, a manager can have two stints.
  cur.sort((a, b) => (a.from || '9999').localeCompare(b.from || '9999'));
  const names = [];
  for (const c of cur) if (!names.includes(c.mgr)) names.push(c.mgr);
  if (names.length) roster.set(s, names.join(', '));
}
console.log(`schemes in file       : ${bySch.size}`);
console.log(`with a current roster : ${roster.size}`);
console.log(`roster too stale      : ${stale}  (left on the Monitor's value)\n`);

// ---------- join ----------
const html = fs.readFileSync(HTML, 'utf8');
const master = blocklib.locate(html, 'window.MASTER = ').value;
const norm = s => String(s || '').toLowerCase().replace(/\u00A0/g, ' ').replace(/[^a-z0-9]+/g, '');
// Live names first, then prev_name (survives the SEBI rename either way) where no live name has it.
// A prev_name shared by two records, or a normalised name shared by two records, is ambiguous:
// a roster scheme that reaches it is reported and left alone, never credited to the first record.
const byName = new Map(), byPrev = new Map(), byNorm = new Map();
for (const f of master) byName.set(f.name, f);
for (const f of master) {
  if (f.prev_name && !byName.has(f.prev_name)) byPrev.set(f.prev_name, (byPrev.get(f.prev_name) || []).concat(f));
  const k = norm(f.name); byNorm.set(k, (byNorm.get(k) || []).concat(f));
}
const normCollisions = [...byNorm.values()].filter(v => v.length > 1).length;
const prevCollisions = [...byPrev.values()].filter(v => v.length > 1).length;

let exact = 0, viaPrev = 0, viaNorm = 0, unmatched = 0, ambiguous = 0, changed = 0, same = 0, enriched = 0;
const misses = [], samples = [], ambig = [];
for (const [s, names] of roster) {
  let f = byName.get(s), cands = null;
  if (f) exact++;
  else if (byPrev.has(s)) {
    cands = byPrev.get(s);
    if (cands.length === 1) { f = cands[0]; exact++; viaPrev++; }
  } else {
    cands = byNorm.get(norm(s)) || [];
    if (cands.length === 1) { f = cands[0]; viaNorm++; }
  }
  if (!f && cands && cands.length > 1) {
    ambiguous++;
    if (ambig.length < 10) ambig.push(`${s}  ->  ${cands.map(c => c.name).join('  /  ')}`);
    continue;
  }
  if (!f) { unmatched++; if (misses.length < 10) misses.push(s); continue; }
  const before = f.fund_mgr || null;
  if (before === names) { same++; continue; }
  if (before && names.includes(before)) enriched++;      // Monitor's single name, now the full team
  changed++;
  if (samples.length < 8) samples.push(`${f.name}\n       was: ${before || '(none)'}\n       now: ${names}`);
  f.fund_mgr = names;
}
console.log(`matched exactly       : ${exact}${viaPrev ? `  (${viaPrev} through prev_name)` : ''}`);
console.log(`matched normalised    : ${viaNorm}`);
console.log(`unmatched             : ${unmatched}${misses.length ? '   e.g. ' + misses.slice(0, 4).join(' | ') : ''}`);
console.log(`ambiguous, not written: ${ambiguous}   (MASTER names sharing a normalised form: ${normCollisions}; shared prev_names: ${prevCollisions})`);
ambig.forEach(a => console.log('   ! ' + a));
console.log(`\nfund_mgr unchanged    : ${same}`);
console.log(`fund_mgr rewritten    : ${changed}  (of which ${enriched} just gained the rest of the team)`);
console.log('\nsamples:');
samples.forEach(s => console.log('   ' + s));

// ---------- gates ----------
let fail = false;
const MF = f => /Mutual Fund|ETF|Index Fund/i.test(f.product_class || '');
const mf = master.filter(MF);
const cover = mf.filter(f => f.fund_mgr).length;
console.log(`\nGATE MF/ETF/Index carrying fund_mgr: ${cover} of ${mf.length}`);
const empty = master.filter(f => f.fund_mgr != null && String(f.fund_mgr).trim() === '');
console.log(`GATE no blank fund_mgr written: ${empty.length ? '*** FAIL ' + empty.length : 'PASS'}`);
if (empty.length) fail = true;
const longest = master.reduce((a, f) => (f.fund_mgr && f.fund_mgr.length > (a.fund_mgr || '').length ? f : a), {});
console.log(`GATE longest fund_mgr: ${(longest.fund_mgr || '').length} chars — "${longest.fund_mgr}"`);
const dupes = master.map(f => f.name).filter((n, i, a) => a.indexOf(n) !== i);
console.log(`GATE duplicate MASTER names: ${dupes.length ? '*** FAIL' : 'PASS (0)'}`);
if (dupes.length) fail = true;

if (fail) { console.error(`\n*** gate failed — ${APPLY ? 'refusing to write' : 'dry run; --apply would refuse'}`); process.exit(1); }
if (!APPLY) { console.log('\n[dry run] pass --apply to write ' + path.basename(HTML)); process.exit(0); }
const size = blocklib.writeBlocks(HTML, [{ prefix: 'window.MASTER = ', value: master }]);
console.log(`\nwrote ${path.basename(HTML)} (${size} bytes)`);

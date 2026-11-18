// The young-fund rule of the monthly MF bake (TASK-067; owner decisions D94 and D103).
//
// D94:  a return for a period longer than the fund's life is cleared. The Monitor itself leaves such
//       cells blank; the old values come from the page parser's non-null merge (a blank cell never
//       overwrites a stored value, D81), e.g. a Regular plan renamed from its older Direct plan (C20).
// D103: for a fund younger than one year, the since-inception return `si` is cleared only when it is
//       beyond +-300% (BOUND = 3.0 as a decimal); every other young-fund `si` stays.
//
// Date rule. For an ISO NAV date Y-M-D, the start of an N-month period is month M-N (across years),
// on day min(D, last day of that month); `mtd` starts on the last day of the month before M.
// A non-null field is cleared when inception > start (ISO strings compare as dates); an inception
// equal to the start is kept. A fund is "young" when inception > start(12).
//
// Values are MASTER decimals (0.12 = 12%); nothing here rescales a value (CLAUDE.md rule 4).
// Used by tools/bake_month.js (MASTER) and tools/lib/direct_perf.js (DIRECT_PERF).

// The MASTER product classes the MF Monitor refreshes ('Mutual Funds' is the deliberate plural of
// the Global / International records, CLAUDE.md rule 8).
const MF_CLASSES = new Set(['Mutual Fund', 'Mutual Funds', 'ETF', 'Index Fund']);
const BOUND = 3.0;
const PERIODS = [['mtd', 0], ['r1m', 1], ['r3m', 3], ['r6m', 6], ['r1y', 12], ['r2y', 24],
  ['r3y', 36], ['r5y', 60], ['r10y', 120]];
const RETURN_KEYS = PERIODS.map(p => p[0]).concat(['si']);
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'];

const pad = n => String(n).padStart(2, '0');
const iso = (y, m, d) => y + '-' + pad(m) + '-' + pad(d);
const daysInMonth = (y, m) => new Date(Date.UTC(y, m, 0)).getUTCDate();   // m is 1-12

// A real calendar date written YYYY-MM-DD (2026-02-30 and 2026-11-2 are not).
function isIsoDate(s) {
  if (typeof s !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const [y, m, d] = s.split('-').map(Number);
  return m >= 1 && m <= 12 && d >= 1 && d <= daysInMonth(y, m);
}

// Start of the period that ends on navIso. months = 0 means month-to-date.
function periodStart(navIso, months) {
  if (!isIsoDate(navIso)) throw new Error(`NAV date "${navIso}" is not a YYYY-MM-DD date`);
  const [y, m, d] = navIso.split('-').map(Number);
  if (months === 0) return m === 1 ? iso(y - 1, 12, 31) : iso(y, m - 1, daysInMonth(y, m - 1));
  const t = y * 12 + (m - 1) - months;
  const ty = Math.floor(t / 12), tm = t % 12 + 1;
  return iso(ty, tm, Math.min(d, daysInMonth(ty, tm)));
}

// "30th September 2026" -> "2026-09-30"; null when the label is not a real date in that style.
function asOnToIso(label) {
  const m = /^([1-9]|[12][0-9]|3[01])(st|nd|rd|th) ([A-Z][a-z]+) (20[0-9]{2})$/.exec(String(label || '').trim());
  if (!m) return null;
  const mo = MONTHS.indexOf(m[3]) + 1;
  if (!mo) return null;
  const out = iso(+m[4], mo, +m[1]);
  return isIsoDate(out) ? out : null;
}

const dayNumber = s => { const [y, m, d] = s.split('-').map(Number); return Date.UTC(y, m - 1, d) / 86400000; };

// A NAV date must be a real date within maxDays of the as-on date (D91, D99: the label is the month
// end, the NAV date the last working day on or before it, or 2-Nov for October 2026). Returns an
// error message, or null when the date is acceptable.
function checkNavDate(navIso, asOnIso, maxDays = 7) {
  if (!isIsoDate(navIso)) return `"${navIso}" is not a real date written YYYY-MM-DD`;
  if (!isIsoDate(asOnIso)) return `the as-on date "${asOnIso}" is not a real date`;
  const gap = dayNumber(navIso) - dayNumber(asOnIso);
  if (Math.abs(gap) > maxDays) return `${navIso} is ${Math.abs(gap)} days from the as-on date ${asOnIso} (at most ${maxDays})`;
  return null;
}

function isYoung(inception, navIso) { return inception > periodStart(navIso, 12); }

// The fields of `rec` the rule clears (the record is not changed). Both dates must be ISO dates.
function lifeClears(rec, inception, navIso) {
  if (!isIsoDate(inception)) throw new Error(`inception "${inception}" is not a YYYY-MM-DD date`);
  if (!isIsoDate(navIso)) throw new Error(`NAV date "${navIso}" is not a YYYY-MM-DD date`);
  const out = [];
  for (const [k, months] of PERIODS) if (rec[k] != null && inception > periodStart(navIso, months)) out.push(k);
  if (rec.si != null && isYoung(inception, navIso) && Math.abs(Number(rec.si)) > BOUND) out.push('si');
  return out;
}

const hasReturn = rec => RETURN_KEYS.some(k => rec[k] != null);
const outlierKeys = rec => RETURN_KEYS.filter(k => rec[k] != null && Math.abs(Number(rec[k])) > BOUND);

module.exports = {
  MF_CLASSES, BOUND, PERIODS, RETURN_KEYS,
  isIsoDate, periodStart, asOnToIso, checkNavDate, isYoung, lifeClears, hasReturn, outlierKeys,
};

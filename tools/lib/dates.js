// Calendar dates from Excel cells (KNOWN_ISSUES A6).
//
// SheetJS 0.18.5 with { cellDates: true } returns a Date a few seconds before local midnight of the
// PREVIOUS day on machines east of UTC (for example 30-Aug-2026 comes back as
// 2026-08-29 23:59:50 IST), so `toISOString().slice(0, 10)` is one day early. Excel dates carry no
// time zone: round to the nearest local calendar day and format that. The same rule is used by the
// page's own parsers in site/index.html, so tools and browser uploads agree.
function isoDay(v) {
  if (!(v instanceof Date) || isNaN(v)) return null;
  const t = new Date(v.getTime() + 12 * 3600 * 1000);
  return t.getFullYear() + '-' + String(t.getMonth() + 1).padStart(2, '0') + '-' + String(t.getDate()).padStart(2, '0');
}

// The same, from a raw Excel serial number (cellDates: false), via SheetJS's own decoder.
function isoDayFromSerial(XLSX, n) {
  if (typeof n !== 'number' || !isFinite(n)) return null;
  const d = XLSX.SSF.parse_date_code(n);
  if (!d) return null;
  return d.y + '-' + String(d.m).padStart(2, '0') + '-' + String(d.d).padStart(2, '0');
}

module.exports = { isoDay, isoDayFromSerial };

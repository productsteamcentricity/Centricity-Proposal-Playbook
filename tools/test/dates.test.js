// Unit tests for tools/lib/dates.js (KNOWN_ISSUES A6). Needs the xlsx package (npm ci).
const XLSX = require('xlsx');
const { isoDay, isoDayFromSerial } = require('../lib/dates');

let pass = 0, fail = 0;
const t = (name, fn) => {
  try { fn(); pass++; console.log('ok   ' + name); }
  catch (e) { fail++; console.log('FAIL ' + name + ': ' + e.message); }
};
const eq = (a, b) => { if (a !== b) throw new Error(`${JSON.stringify(a)} !== ${JSON.stringify(b)}`); };

// Round-trip real serials through an .xlsx exactly as the tools read them.
function cellDate(serial) {
  const wb = { SheetNames: ['s'], Sheets: { s: { A1: { t: 'n', v: serial, z: 'dd-mmm-yyyy' }, '!ref': 'A1' } } };
  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  return XLSX.read(buf, { cellDates: true }).Sheets.s.A1.v;
}
for (const serial of [46264, 45658, 36526, 46022, 45716, 46387]) {
  const truth = isoDayFromSerial(XLSX, serial);
  t(`serial ${serial} (${truth}) via cellDates`, () => eq(isoDay(cellDate(serial)), truth));
}
t('30-Aug-2026 is serial 46264', () => eq(isoDayFromSerial(XLSX, 46264), '2026-08-30'));
t('midnight local Date', () => eq(isoDay(new Date(2026, 7, 30)), '2026-08-30'));
t('late-evening Date rounds to the next day', () => eq(isoDay(new Date(2026, 7, 29, 23, 59, 50)), '2026-08-30'));
t('non-date gives null', () => { eq(isoDay('2026-08-30'), null); eq(isoDay(new Date('x')), null); eq(isoDayFromSerial(XLSX, 'a'), null); });

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);

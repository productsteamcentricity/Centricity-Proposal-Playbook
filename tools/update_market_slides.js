// Replace EXTRA_SLIDES.market with this month's rendered Market Update slides.
// The dividers, the disclaimer and the thank-you slide are left untouched, and so is every byte of
// Centricity_ExtraSlides.js outside the EXTRA_SLIDES literal; gates re-read the result to prove it.
//
//   node tools/update_market_slides.js --slides <dir of slide1..N.jpg> [--js <Centricity_ExtraSlides.js>] [--apply]
//
// Every slide must be 2001 x 1125, the size every image in EXTRA_SLIDES uses (the PowerPoint
// export call is in update_closing_slides.js). Exit codes: 0 = all gates passed; 1 = a gate failed
// (nothing written); 2 = usage error.
const fs = require('fs');
const path = require('path');
const B = require('./lib/blocklib');

const USAGE = 'Usage: node tools/update_market_slides.js --slides <dir> [--js <Centricity_ExtraSlides.js>] [--apply]';
const usage = msg => { if (msg) console.error(msg); console.error(USAGE); process.exit(2); };
const argv = process.argv.slice(2);
const opt = {};
let APPLY = false;
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === '--apply') { APPLY = true; continue; }
  if (a === '--slides' || a === '--js') {
    const v = argv[++i];
    if (v == null || v.startsWith('--')) usage('missing value for ' + a);
    opt[a] = v; continue;
  }
  usage(a.startsWith('--') ? 'unknown flag: ' + a : 'unexpected argument: ' + a);
}
const SLIDES = opt['--slides'];
const JS = opt['--js'] || path.join(__dirname, '..', 'site', 'Centricity_ExtraSlides.js');
if (!SLIDES || !fs.existsSync(SLIDES)) usage(SLIDES ? '*** slides folder not found: ' + SLIDES : null);
if (!fs.existsSync(JS)) usage('*** sibling not found: ' + JS);

const WANT_W = 2001, WANT_H = 1125;
const PREFIX = 'window.EXTRA_SLIDES = ';

const files = fs.readdirSync(SLIDES)
  .filter(f => /^slide\d+\.(jpe?g|png)$/i.test(f))
  .sort((a, b) => (+a.match(/\d+/)[0]) - (+b.match(/\d+/)[0]));
if (!files.length) { console.error('*** no slideN.jpg files in ' + SLIDES); process.exit(1); }

// JPEG/PNG dimensions, so a mis-exported slide cannot slip in silently.
function dims(buf) {
  if (buf.length >= 24 && buf[0] === 0x89 && buf[1] === 0x50) return { type: 'png', w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  if (buf[0] === 0xFF && buf[1] === 0xD8) {
    for (let j = 2; j < buf.length - 9;) {
      if (buf[j] !== 0xFF) { j++; continue; }
      const m = buf[j + 1];
      if (m >= 0xC0 && m <= 0xCF && m !== 0xC4 && m !== 0xC8 && m !== 0xCC)
        return { type: 'jpeg', h: buf.readUInt16BE(j + 5), w: buf.readUInt16BE(j + 7) };
      j += 2 + buf.readUInt16BE(j + 2);
    }
  }
  return { type: '?', w: 0, h: 0 };
}

// Read the literal itself (brace-matched JSON); the sibling is not executed.
const src = fs.readFileSync(JS, 'utf8');
const loc = B.locate(src, PREFIX);
const ES = loc.value;
if (!ES || !Array.isArray(ES.market)) { console.error('*** EXTRA_SLIDES.market not found'); process.exit(1); }

const oldMarket = ES.market;
const oldDims = oldMarket.length ? dims(Buffer.from(oldMarket[0].slice(oldMarket[0].indexOf(',') + 1), 'base64')) : { type: '-', w: 0, h: 0 };
console.log(`current market slides : ${oldMarket.length}  (${oldDims.w}x${oldDims.h} ${oldDims.type})`);

const built = [];
let bytes = 0, badDims = 0;
for (const f of files) {
  const buf = fs.readFileSync(path.join(SLIDES, f));
  const d = dims(buf);
  const ok = d.type !== '?' && d.w === WANT_W && d.h === WANT_H;
  if (!ok) badDims++;
  console.log(`  ${f.padEnd(12)} ${d.type} ${d.w}x${d.h}  ${String(Math.round(buf.length / 1024)).padStart(4)} KB  ${ok ? '' : `*** not a ${WANT_W}x${WANT_H} JPEG/PNG`}`);
  built.push(`data:image/${d.type};base64,` + buf.toString('base64'));
  bytes += buf.length;
}
console.log(`new market slides     : ${built.length}  (${Math.round(bytes / 1024)} KB raw)`);

// ---- splice, then re-read what would be written ----
const next = Object.assign({}, ES, { market: built });          // key order kept: market stays in place
const out = B.spliceBlocks(src, [{ prefix: PREFIX, value: next }]);
const after = B.locate(out, PREFIX);
const AV = after.value;

// ---- gates ----
let fail = false;
const gate = (ok, msg) => { console.log(`GATE ${msg}: ${ok ? 'PASS' : '*** FAIL'}`); if (!ok) fail = true; };
console.log(`\nGATE slide count ${oldMarket.length} -> ${built.length}${built.length === oldMarket.length ? '  (unchanged)' : '  *** CHANGED — confirm this is intended'}`);
gate(badDims === 0, `every slide is ${WANT_W}x${WANT_H}${badDims ? ` (${badDims} of ${built.length} are not)` : ''}`);
const small = built.filter(s => s.length < 5000).length;
gate(small === 0, `no slide suspiciously small (< 5000 chars)${small ? ` (${small})` : ''}`);
const otherKeys = Object.keys(ES).filter(k => k !== 'market');
const keysSame = Object.keys(AV).join('\n') === Object.keys(ES).join('\n');
const changedKeys = otherKeys.filter(k => JSON.stringify(AV[k]) !== JSON.stringify(ES[k]));
gate(keysSame && !changedKeys.length, `untouched keys byte-identical (${otherKeys.join(', ')})${changedKeys.length ? ' — changed: ' + changedKeys.join(', ') : ''}${keysSame ? '' : ' — key set/order changed'}`);
const marketOk = Array.isArray(AV.market) && AV.market.length === built.length && AV.market.every((s, i) => s === built[i]);
gate(marketOk, `written market = the ${built.length} new slides`);
const outsideSame = out.slice(0, after.s) === src.slice(0, loc.s) && out.slice(after.e + 1) === src.slice(loc.e + 1);
gate(outsideSame, 'bytes outside EXTRA_SLIDES unchanged');

console.log(`\nfile ${src.length} -> ${out.length} bytes (${out.length > src.length ? '+' : ''}${Math.round((out.length - src.length) / 1024)} KB)`);

if (!APPLY) { console.log(`\n[dry run] ${fail ? '*** a gate failed — an --apply would refuse' : 'pass --apply to write'}`); process.exit(fail ? 1 : 0); }
if (fail) { console.error('\n*** a gate failed — refusing to write'); process.exit(1); }
B.writeFilesAtomic([{ file: JS, content: out }]);
console.log(`WROTE ${JS}`);

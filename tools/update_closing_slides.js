// Replace the Disclaimer / Thank You slides in EXTRA_SLIDES from rendered images.
//
//   node tools/update_closing_slides.js --dir "<dir with disclaimer.png and thankyou.jpg>" [--sibling <Centricity_ExtraSlides.js>] [--apply]
//
// The deck's slides are native PowerPoint shapes — ppt/media is empty — so they have to be
// RENDERED, not extracted. PowerPoint COM does it; there is no LibreOffice on this machine:
//
//   $pres.Slides.Item($i).Export($path, "PNG", 2001, 1125)
//
// 2001 x 1125 is the size every other image in EXTRA_SLIDES uses; the gate below enforces it.
// Delete the logo picture shape BEFORE exporting — the deck no longer carries a baked-in logo,
// because the export overlays whichever logo the user picked in the header switcher.
//
// The file names are fixed: disclaimer.png (a PNG) and thankyou.jpg (a JPEG). Only those two keys
// change; the gates re-read the spliced file and check that every other key, and every byte of the
// sibling outside the EXTRA_SLIDES literal, is unchanged. Exit codes: 0 = all gates passed;
// 1 = a gate failed (nothing written); 2 = usage error.
const fs = require('fs');
const path = require('path');
const B = require('./lib/blocklib');

const USAGE = 'Usage: node tools/update_closing_slides.js --dir "<render dir>" [--sibling <Centricity_ExtraSlides.js>] [--apply]';
const usage = msg => { if (msg) console.error(msg); console.error(USAGE); process.exit(2); };
const argv = process.argv.slice(2);
const opt = {};
let APPLY = false;
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === '--apply') { APPLY = true; continue; }
  if (a === '--dir' || a === '--sibling') {
    const v = argv[++i];
    if (v == null || v.startsWith('--')) usage('missing value for ' + a);
    opt[a] = v; continue;
  }
  usage(a.startsWith('--') ? 'unknown flag: ' + a : 'unexpected argument: ' + a);
}
const DIR = opt['--dir'];
const SIB = opt['--sibling'] || path.join(__dirname, '..', 'site', 'Centricity_ExtraSlides.js');
if (!DIR) usage();
if (!fs.existsSync(DIR) || !fs.statSync(DIR).isDirectory()) usage('*** render folder not found: ' + DIR);
if (!fs.existsSync(SIB)) usage('*** sibling not found: ' + SIB);
const PREFIX = 'window.EXTRA_SLIDES = ';

// PNG for the text-heavy disclaimer (crisper and, here, smaller than JPEG); JPEG for the
// photographic thank-you.
const WANT = [
  { key: 'disclaimer', file: 'disclaimer.png', mime: 'image/png' },
  { key: 'thankyou',   file: 'thankyou.jpg',   mime: 'image/jpeg' },
];

// Minimal PNG/JPEG dimension readers so the size gate does not need a decoder.
function dims(buf) {
  if (buf.length >= 24 && buf[0] === 0x89 && buf[1] === 0x50) return { mime: 'image/png', w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  if (buf[0] === 0xFF && buf[1] === 0xD8) {
    let i = 2;
    while (i < buf.length - 9) {
      if (buf[i] !== 0xFF) { i++; continue; }
      const m = buf[i + 1];
      if (m >= 0xC0 && m <= 0xCF && m !== 0xC4 && m !== 0xC8 && m !== 0xCC)
        return { mime: 'image/jpeg', h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) };
      i += 2 + buf.readUInt16BE(i + 2);
    }
  }
  return null;
}

const src = fs.readFileSync(SIB, 'utf8');
const loc = B.locate(src, PREFIX);
const ES = loc.value;
console.log('EXTRA_SLIDES today: ' + Object.keys(ES).map(k => k + (Array.isArray(ES[k]) ? '[' + ES[k].length + ']' : '')).join(', '));

const next = Object.assign({}, ES);
let fail = false;
for (const w of WANT) {
  const p = path.join(DIR, w.file);
  if (!fs.existsSync(p)) { console.error('*** missing render: ' + p); fail = true; continue; }
  const buf = fs.readFileSync(p);
  const d = dims(buf);
  const ok = d && d.w === 2001 && d.h === 1125 && d.mime === w.mime;
  const before = ES[w.key] ? Math.round(String(ES[w.key]).length / 1024) + ' KB' : 'absent';
  console.log('  ' + w.key.padEnd(12) + w.file.padEnd(18) +
    (d ? d.w + 'x' + d.h : '??').padEnd(12) +
    (ok ? 'OK' : '*** expected a 2001x1125 ' + w.mime.slice(6).toUpperCase() + (d && d.mime !== w.mime ? ' (file is ' + d.mime + ')' : '')) +
    '   ' + before + ' -> ' + Math.round(buf.length * 1.37 / 1024) + ' KB');
  if (!ok) { fail = true; continue; }
  next[w.key] = 'data:' + w.mime + ';base64,' + buf.toString('base64');
}

// ---- splice, then re-read what would be written ----
const out = B.spliceBlocks(src, [{ prefix: PREFIX, value: next }]);
const after = B.locate(out, PREFIX);
const AV = after.value;

console.log('\n---------------- gates ----------------');
const gate = (ok, msg) => { console.log('GATE ' + msg + ': ' + (ok ? 'PASS' : '*** FAIL')); if (!ok) fail = true; };
gate(!fail, 'renders are 2001x1125 in the expected format');
// The other keys must survive — this tool only ever touches disclaimer + thankyou.
const keep = Object.keys(ES).filter(k => !WANT.some(w => w.key === k));
const changed = keep.filter(k => JSON.stringify(AV[k]) !== JSON.stringify(ES[k]));
const keysSame = Object.keys(AV).filter(k => !WANT.some(w => w.key === k)).join('\n') === keep.join('\n');
gate(!changed.length && keysSame, 'untouched keys byte-identical (' + keep.join(', ') + ')' +
  (changed.length ? ' — changed: ' + changed.join(', ') : '') + (keysSame ? '' : ' — key set/order changed'));
const mkt = AV.market || [], oldMkt = ES.market || [];
gate(mkt.length === oldMkt.length && mkt.every((s, i) => s === oldMkt[i]), 'market slides still the same ' + oldMkt.length + ' images');
gate(WANT.every(w => AV[w.key] === next[w.key]), 'written disclaimer/thankyou = the renders' + (fail ? ' (unchanged where a render failed)' : ''));
gate(out.slice(0, after.s) === src.slice(0, loc.s) && out.slice(after.e + 1) === src.slice(loc.e + 1), 'bytes outside EXTRA_SLIDES unchanged');
const total = Object.values(AV).flat().reduce((a, v) => a + String(v).length, 0);
console.log('GATE sibling payload: ' + Math.round(total / 1024 / 1024 * 10) / 10 + ' MB');

if (!APPLY) { console.log('\n[dry run] ' + (fail ? '*** a gate failed — an --apply would refuse' : 'pass --apply to write')); process.exit(fail ? 1 : 0); }
if (fail) { console.error('\n*** gate failed — refusing to write'); process.exit(1); }
B.writeFilesAtomic([{ file: SIB, content: out }]);
console.log('\nWROTE ' + SIB + ' — ' + out.length + ' bytes');

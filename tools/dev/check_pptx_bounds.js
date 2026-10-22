// Checks the PowerPoint-laid-out boxes written by tools/dev/render_pptx.ps1 (D82):
//   - any shape outside the 13.333 x 7.5 canvas (the cover's divider ellipses and gold rule run past
//     the edge on purpose; everything else is overflow)
//   - a table whose real bottom (PowerPoint's own row heights) is below 7.08", the top of the footer
//     line, or that runs into a note or stamp beneath it
//   - a text box whose laid-out text is taller than the box (not on full-bleed image slides)
//   node tools/dev/check_pptx_bounds.js <bounds.jsonl>      exit 1 when a problem is found, 2 on bad input
const fs = require('fs');
const file = process.argv[2];
if (!file || process.argv.length > 3 || !fs.existsSync(file)) {
  console.error('Usage: node tools/dev/check_pptx_bounds.js <bounds.jsonl written by tools/dev/render_pptx.ps1>');
  process.exit(2);
}
const L = fs.readFileSync(file, 'utf8').replace(/^[^{]*/, '').trim().split(/\r?\n/).map(l => JSON.parse(l));
const head = L.shift();
const bySlide = {};
L.forEach(s => (bySlide[s.slide] = bySlide[s.slide] || []).push(s));
const FOOT = 7.08;
const issues = [], decoration = [];
let tables = 0, deepest = 0;
for (const [n, shapes] of Object.entries(bySlide)) {
  const fullBleed = shapes.some(s => s.type === 13 && s.x <= 0.01 && s.y <= 0.01 && s.w >= 13.3 && s.h >= 7.49);
  const divider = shapes.some(s => s.type === 1 && s.x < -1);          // the cover / divider master
  const rule = shapes.find(s => s.type === 1 && Math.abs(s.y - 7.4) < 0.01 && s.h < 0.06);   // native slides' gold footer rule
  for (const s of shapes) {
    const bottom = s.rows ? s.y + s.rows.reduce((a, b) => a + b, 0) : s.y + s.h;
    if (s.x < -0.01 || s.y < -0.01 || s.x + s.w > head.w + 0.01 || bottom > head.h + 0.01) {
      const msg = `slide ${n} shape ${s.shape} outside the canvas: x ${s.x} y ${s.y} w ${s.w} bottom ${bottom.toFixed(3)}`;
      (divider && s.type === 1 ? decoration : issues).push(msg);
    }
    if (s.rows) {
      tables++; deepest = Math.max(deepest, bottom);
      if (bottom > FOOT + 0.005) issues.push(`slide ${n} table ends at ${bottom.toFixed(3)}, below the footer line ${FOOT}`);
      for (const t of shapes) if (t.text != null && t.y > s.y && t.y < bottom - 0.005 && t.x < s.x + s.w && t.x + t.w > s.x)
        issues.push(`slide ${n} table (bottom ${bottom.toFixed(3)}) runs into text "${t.text}" at y ${t.y}`);
    }
    if (s.text != null && s.textH > s.h + 0.02 && !fullBleed) issues.push(`slide ${n} text "${s.text}" needs ${s.textH}" in a ${s.h}" box`);
    if (rule && s.text != null && s.y + s.h > rule.y + 0.005) issues.push(`slide ${n} text "${s.text}" runs into the footer rule (bottom ${(s.y + s.h).toFixed(3)})`);
  }
}
console.log(`${head.slides} slides, ${tables} tables, deepest table bottom ${deepest.toFixed(3)}"; ${decoration.length} intended decoration shape(s) past the edge`);
issues.forEach(x => console.log('  *** ' + x));
console.log(issues.length ? `${issues.length} problem(s)` : 'no problem found');
process.exit(issues.length ? 1 : 0);

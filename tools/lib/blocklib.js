// Locate and parse a `window.X = {...}` / `[...]` literal inside index.html, and splice a new
// value back in. Brace-matching respects strings and escapes, so a name containing a bracket
// cannot end the scan early.
//
// Also the shared write/label helpers every tool uses (KNOWN_ISSUES A8, A9, A24):
//   writeFileAtomic   temp file + rename, so a crash or sync clash never leaves a half-written file;
//                     a rename blocked by a OneDrive sync (EPERM/EBUSY/EACCES) is retried (R6)
//   writeFilesAtomic  validate every output first, then write them one after another
//   checkAsOn         strict as-on label validation (no quotes, backslashes or `$` reach a literal)
//   replaceOnce       replace exactly one regex match, or throw
//   setDataDate       set one key inside the `window.DATA_DATES = { … }` block only
const fs = require('fs');
const path = require('path');

function matchEnd(s, start) {
  const open = s[start], close = open === '{' ? '}' : ']';
  let depth = 0, inStr = false, esc = false;
  for (let i = start; i < s.length; i++) {
    const ch = s[i];
    if (inStr) {
      if (esc) esc = false;
      else if (ch === '\\') esc = true;
      else if (ch === '"') inStr = false;
      continue;
    }
    if (ch === '"') { inStr = true; continue; }
    if (ch === open) depth++;
    else if (ch === close) { depth--; if (depth === 0) return i; }
  }
  throw new Error('unbalanced literal from offset ' + start);
}

// Every offset where `prefix` is immediately followed by an object/array literal.
function literalOffsets(html, prefix) {
  const out = [];
  for (let i = html.indexOf(prefix); i >= 0; i = html.indexOf(prefix, i + 1)) {
    const c = html[i + prefix.length];
    if (c === '{' || c === '[') out.push(i);
  }
  return out;
}

function locate(html, prefix) {
  const i = html.indexOf(prefix);
  if (i < 0) throw new Error('not found: ' + prefix);
  const s = i + prefix.length;
  const open = html[s];
  if (open !== '{' && open !== '[') throw new Error(prefix + ' is not followed by a literal');
  // The baseline literal must be the only literal assigned with this prefix; a second one (for
  // example a pasted copy higher up) would make "first occurrence" target the wrong block.
  const lits = literalOffsets(html, prefix);
  if (lits.length !== 1) throw new Error(`${prefix.trim()} has ${lits.length} literal occurrences — refusing to guess which block to use`);
  const e = matchEnd(html, s);
  return { s, e, value: JSON.parse(html.slice(s, e + 1)) };
}

function read(file, prefix) { return locate(fs.readFileSync(file, 'utf8'), prefix); }

// OneDrive (or an antivirus scan) can hold the target open for a moment while it syncs, and the
// rename then fails with EPERM, EBUSY or EACCES (KNOWN_ISSUES R6). Those are retried after a short,
// doubling pause, 6.3 s in all; any other error, or the last failure, is thrown.
const RENAME_RETRY_CODES = new Set(['EPERM', 'EBUSY', 'EACCES']);
const RENAME_WAITS_MS = [100, 200, 400, 800, 1600, 3200];
const sleepSync = ms => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);

function renameWithRetry(from, to, waits) {
  for (let attempt = 0; ; attempt++) {
    try { fs.renameSync(from, to); return attempt; }
    catch (e) {
      if (!RENAME_RETRY_CODES.has(e.code) || attempt >= waits.length) throw e;
      console.error(`  (rename of ${path.basename(to)} blocked: ${e.code}; retry ${attempt + 1} of ${waits.length} in ${waits[attempt]} ms; OneDrive sync? KNOWN_ISSUES R6)`);
      sleepSync(waits[attempt]);
    }
  }
}

// Write through a temp file in the same folder, then rename over the target. The temp name ends
// in .tmp, which .gitignore excludes, and lives beside the target so the rename never crosses a volume.
// The temp file is removed whenever the write or the rename fails. `waitsMs` is for tests only.
function writeFileAtomic(file, content, waitsMs = RENAME_WAITS_MS) {
  const tmp = path.join(path.dirname(file), '.' + path.basename(file) + '.' + process.pid + '.tmp');
  try {
    fs.writeFileSync(tmp, content, 'utf8');
    renameWithRetry(tmp, file, waitsMs);
  } catch (e) {
    try { fs.unlinkSync(tmp); } catch (_) { /* never created, or already gone */ }
    throw e;
  }
  return content.length;
}

// Check every output before writing any of them, so a failure cannot leave index.html and a
// sibling disagreeing. `outputs` is [{ file, content }]. Each file that ended with </html> must
// still end with it, and no output may be empty.
function writeFilesAtomic(outputs) {
  for (const o of outputs) {
    if (typeof o.content !== 'string' || !o.content.length) throw new Error('empty output for ' + o.file);
    const before = fs.existsSync(o.file) ? fs.readFileSync(o.file, 'utf8') : '';
    if (before.trimEnd().endsWith('</html>') && !o.content.trimEnd().endsWith('</html>')) {
      throw new Error('output for ' + path.basename(o.file) + ' does not end with </html>');
    }
  }
  for (const o of outputs) writeFileAtomic(o.file, o.content);
  return outputs.length;
}

// Splice several blocks into a string; writes from the end backwards so earlier offsets stay valid.
function spliceBlocks(html, updates) {
  const seen = new Set();
  for (const u of updates) {
    if (seen.has(u.prefix)) throw new Error('duplicate prefix in one write: ' + u.prefix);
    seen.add(u.prefix);
  }
  const spots = updates.map(u => ({ ...locate(html, u.prefix), value: u.value, prefix: u.prefix }));
  spots.sort((a, b) => b.s - a.s);
  for (let k = 1; k < spots.length; k++) {
    if (spots[k].e >= spots[k - 1].s) throw new Error('overlapping blocks: ' + spots[k].prefix + ' / ' + spots[k - 1].prefix);
  }
  for (const sp of spots) html = html.slice(0, sp.s) + JSON.stringify(sp.value) + html.slice(sp.e + 1);
  return html;
}

// Splice several blocks in one pass and write the file atomically.
function writeBlocks(file, updates) {
  const before = fs.readFileSync(file, 'utf8');
  // The </html> check is the standing guarantee for index.html, but the sibling override files
  // are plain .js. Derive the expectation from the INPUT rather than assuming HTML, so index.html
  // keeps the guard and no caller can forget to ask for it.
  const wasHtml = before.trimEnd().endsWith('</html>');
  const html = spliceBlocks(before, updates);
  if (wasHtml && !html.trimEnd().endsWith('</html>')) throw new Error('output does not end with </html>');
  writeFileAtomic(file, html);
  return html.length;
}

// As-on labels are pasted into JavaScript string literals, so only plain dates are allowed:
//   "long"  — the house style for DATA_DATES.performance / analytics / pms / sif: "31st October 2026"
//   "short" — the risk-matrix style: "31 Oct 2026"
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
function checkAsOn(label, style = 'long') {
  const s = String(label || '').trim();
  const long = /^([1-9]|[12][0-9]|3[01])(st|nd|rd|th) ([A-Z][a-z]+) (20[0-9]{2})$/;
  const short = /^([1-9]|[12][0-9]|3[01]) ([A-Z][a-z]{2}) (20[0-9]{2})$/;
  const m = (style === 'short' ? short : long).exec(s);
  const ok = m && (style === 'short' ? MONTHS.some(x => x.slice(0, 3) === m[2]) : MONTHS.includes(m[3]));
  if (!ok) {
    throw new Error(`--as-on "${s}" is not a plain date label (expected e.g. ${style === 'short' ? '"31 Oct 2026"' : '"31st October 2026"'})`);
  }
  return s;
}

// Replace exactly one match of `re` (which must not be global) or throw.
function replaceOnce(text, re, replacement, what) {
  const g = new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g');
  const n = (text.match(g) || []).length;
  if (n !== 1) throw new Error(`${what || re}: expected exactly 1 match, found ${n}`);
  return text.replace(re, () => replacement);
}

// Set one key of the `window.DATA_DATES = { … }` literal (the block near the top of index.html),
// leaving any trailing comment on that line intact. The search never leaves that block.
function setDataDate(html, key, label) {
  const prefix = 'window.DATA_DATES = {';
  const i = html.indexOf(prefix);
  if (i < 0 || html.indexOf(prefix, i + 1) >= 0) throw new Error('window.DATA_DATES block not found exactly once');
  const s = i + prefix.length - 1;
  const e = html.indexOf('};', s);
  if (e < 0) throw new Error('window.DATA_DATES block has no end');
  const block = html.slice(s, e + 1);
  const re = new RegExp('(\\b' + key + '\\s*:\\s*)"[^"\\n]*"', 'g');
  const n = (block.match(re) || []).length;
  if (n !== 1) throw new Error(`DATA_DATES.${key}: expected exactly 1 match, found ${n}`);
  const next = block.replace(re, (m, lead) => lead + JSON.stringify(label));
  return html.slice(0, s) + next + html.slice(e + 1);
}

module.exports = {
  locate, read, writeBlocks, spliceBlocks, matchEnd, literalOffsets,
  writeFileAtomic, writeFilesAtomic, checkAsOn, replaceOnce, setDataDate,
};

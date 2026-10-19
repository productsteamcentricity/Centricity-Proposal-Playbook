// The one DIRECT_PERF builder (KNOWN_ISSUES A7). Both routes use it: bake_month.js (the monthly
// bake, which produced the live block) and rebuild_directperf.js (a Direct-only rebuild). Moved here
// verbatim from bake_month.js; only the interface changed (it takes the MASTER array and returns the
// new store instead of writing W.DIRECT_PERF), and the literal no-break space in the row-name
// regex became the \u00A0 escape (A25, same behaviour).
//
// The page's Section 7 uploader (REFRESH.parseMfMonitorDirect in site/index.html) is a separate
// parser and still differs from this one; see KNOWN_ISSUES A7 before relying on an upload.
const XLSX = require('xlsx');

// Build DIRECT_PERF keyed by the REGULAR fund name, from the Direct monitor workbook.
// Direct names read "X Fund(G)-Direct Plan"; MASTER reads "X Fund-Reg(G)". Both reduce to the
// same plan-base, which is how the two plans are paired. `master` is the MASTER array the Direct
// rows are paired against. Returns a NEW store (never merged into the old one) plus the counts.
function buildDirectPerf(src, master) {
  const wb = XLSX.readFile(src, { cellDates: true });
  const NUM = [['mtd', 'MTD'], ['r1m', '1 Month'], ['r3m', '3 Months'], ['r6m', '6 Months'],
    ['r1y', '1 Year'], ['r2y', '2 Years'], ['r3y', '3 Years'], ['r5y', '5 Years'],
    ['r10y', '10 Years'], ['si', 'SINCE INCEPTION']];
  // Scales MUST match what parseMfMonitor writes onto MASTER, or the Regular/Direct toggle swaps
  // a decimal for a percentage (a 39% m-cap slice rendering as 3935%). Percentage columns are
  // divided by 100; AUM and the maturity figures are raw.  NOTE the exact header spellings —
  // the Direct workbook says "YTM (%)", "Average Maturity Years", "Modified Duration Years" and
  // carries the expense ratio in a column called "Ratio".
  const PCT_COLS = [['mcap_large', 'Large Cap'], ['mcap_mid', 'Mid Cap'],
    ['mcap_small', 'Small Cap'], ['mcap_other', 'Others'], ['expense', 'Ratio'],
    ['ytm', 'YTM (%)']];
  const RAW_COLS = [['aum', 'AUM (Cr.)'],
    ['avg_maturity', 'Average Maturity Years'], ['mod_duration', 'Modified Duration Years']];
  // "X Fund(G)-Direct Plan", "X Fund(G)-Direct Plan(Adjusted)" and "X Fund-Reg(G)" must all
  // reduce to the same base. "(Adjusted)" marks a restated series, not a different scheme.
  const NBSP = String.fromCharCode(160);
  const base = s => {
    let t = String(s || "").split(NBSP).join(" ").replace(/\s+/g, " ").trim().toLowerCase();
    for (let k = 0; k < 5; k++) {
      const prev = t;
      t = t.replace(/\s*\(\s*adjusted\s*\)\s*$/i, "")
           .replace(/\s*[-\u2013\u2014]?\s*direct\s*plan\s*$/i, "")
           .replace(/\s*[-\u2013\u2014]\s*(dir|direct|reg|regular)\s*$/i, "")
           .replace(/\s*\(\s*(?:g|growth|idcw|d|div|dividend)\s*\)\s*$/i, "")
           .replace(/\s*[-\u2013\u2014]+\s*$/, "").trim();
      if (t === prev) break;
    }
    return t;
  };

  const regByBase = new Map();
  for (const f of master) { const b = base(f.name); if (b && !regByBase.has(b)) regByBase.set(b, f.name); }

  const pct = v => { if (v == null || v === '') return null; const n = typeof v === 'number' ? v : parseFloat(String(v).replace(/[,%\s]/g, '')); return isFinite(n) ? n / 100 : null; };
  const num = v => { if (v == null || v === '') return null; const n = typeof v === 'number' ? v : parseFloat(String(v).replace(/[,\s]/g, '')); return isFinite(n) ? n : null; };
  const cell = (ws, r, c) => { const x = ws[XLSX.utils.encode_cell({ r, c })]; return x ? x.v : null; };

  const out = {}; let matched = 0, unmatched = 0; const sampleUnmatched = [];
  for (const sn of wb.SheetNames) {
    const ws = wb.Sheets[sn]; if (!ws || !ws['!ref']) continue;
    const rg = XLSX.utils.decode_range(ws['!ref']);
    let hdr = -1;
    for (let r = rg.s.r; r <= Math.min(rg.s.r + 25, rg.e.r); r++) {
      const v = cell(ws, r, 0);
      if (v && String(v).trim().toLowerCase() === 'scheme name') { hdr = r; break; }
    }
    if (hdr < 0) continue;
    const heads = [];
    for (let c = rg.s.c; c <= rg.e.c; c++) { const v = cell(ws, hdr, c); heads.push(v != null ? String(v).trim() : ''); }
    for (let r = hdr + 1; r <= rg.e.r; r++) {
      const raw = cell(ws, r, 0);
      if (!raw) continue;
      const nm = String(raw).replace(/\u00A0/g, ' ').replace(/\s+/g, ' ').trim();
      if (!nm || /^(average|benchmark|bench mark)$/i.test(nm)) continue;   // footer rows
      if (!/direct/i.test(nm)) continue;                                    // only Direct rows
      const reg = regByBase.get(base(nm));
      if (!reg) { unmatched++; if (sampleUnmatched.length < 12) sampleUnmatched.push(nm); continue; }
      const rec = out[reg] || (out[reg] = {});
      for (const [k, h] of NUM) { const i = heads.indexOf(h); if (i >= 0) { const v = pct(cell(ws, r, i)); if (v != null) rec[k] = v; } }
      // Only take the m-cap split on equity-style sheets and the debt stats on pure debt sheets,
      // matching parseMfMonitor — hybrid sheets carry both column sets but are treated as equity
      // there, and the two plans must agree.
      const isEquityStyle = heads.indexOf('Large Cap') >= 0;
      for (const [k, h] of PCT_COLS) {
        if (/^mcap_/.test(k)) continue;                 // handled atomically below
        if (k === 'ytm' && isEquityStyle) continue;
        const i = heads.indexOf(h); if (i < 0) continue;
        const v = pct(cell(ws, r, i)); if (v != null) rec[k] = v;
      }
      // The four m-cap buckets are one split: take them together, treating a blank as zero.
      // Merging a partial Direct split onto the Regular one produced a set summing to 108%.
      if (isEquityStyle) {
        const q = [['mcap_large', 'Large Cap'], ['mcap_mid', 'Mid Cap'],
                   ['mcap_small', 'Small Cap'], ['mcap_other', 'Others']]
          .map(([k, h]) => { const i = heads.indexOf(h); return [k, i >= 0 ? pct(cell(ws, r, i)) : null]; });
        if (q.some(([, v]) => v != null)) for (const [k, v] of q) rec[k] = (v == null ? 0 : v);
      }
      for (const [k, h] of RAW_COLS) {
        if (/^(avg_maturity|mod_duration)$/.test(k) && isEquityStyle) continue;
        const i = heads.indexOf(h); if (i < 0) continue;
        const v = num(cell(ws, r, i)); if (v != null) rec[k] = v;
      }
      matched++;
    }
  }
  return { store: out, matched, unmatched, sampleUnmatched };
}

module.exports = { buildDirectPerf };

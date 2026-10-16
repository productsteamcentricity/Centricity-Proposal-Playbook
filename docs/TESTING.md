# Testing and verification

There is no unit-test suite; the project is verified at three levels. All three were run for the
baseline on 16-Oct-2026 (results in [`REPLICATION_REPORT.md`](REPLICATION_REPORT.md)).

## 1. Parity counts — `tools/verify_page.js` (seconds; run after every change)

```bash
node tools/verify_page.js site
```

Runs every `<script>` of `site/index.html` in document order inside a Node `vm` (CDN scripts skipped,
the five siblings loaded from disk) and prints the true in-browser state. Baseline output
(30-Sep-2026 data):

```
MASTER effective          7682
CENTRICITY_SELECT         178   (keys present in MASTER: 178)
  with rationale          133
  with risk ratios        46
  with details            51
PMS_PERFORMANCE.pms       692
PMS_PERFORMANCE.aif       12
PMS_PERFORMANCE.benchmark 4
PMS_PERF_ALIAS            27   (null pins: 4)
EQUITY_ANALYTICS          1205
RISK_MATRIX               1088
PMS_AIF_TERMS             73
EXTRA_SLIDES              6
DATA_DATES                {"performance":"30th September 2026","analytics":"30th September 2026","pms":"31st August 2026","sif":"30th September 2026","riskMatrix":"30 Sep 2026"}
duplicate MASTER names    0
file ends </html>         yes
MASTER PMS with perf      23 of 27

script errors (excluding the CDN globals): 0
```

**Hard failures** (also enforced by CI): `MISSING SIBLING`, duplicate names > 0, file not ending
`</html>`, script errors > 0, Select keys in MASTER ≠ total. Every other count may legitimately move
in a refresh, but each move must be explained in the update log. Caveat: the script exits 0 even on
failed checks, and its error filter hides any `… is not defined` error (`KNOWN_ISSUES.md` A23), so
read the output; CI parses it.

## 2. Tool regression — dry-run comparison (minutes; run when tools change)

Every tool is dry-run by default, so the whole suite can be run safely against a month's inputs and
its output compared before/after a code change. Used for the transfer: all 25 tool invocations
produced identical output before and after the reorganisation. To repeat, run each command of
`tools/README.md` §2 without `--apply` against `monthly-updates/2026-09_Sep-2026/`, save the outputs,
make the change, re-run, diff. Re-running a month's own inputs on its baseline should report no
changes (Sep-2026: 0 renames, 0 SIF values changed, risk matrix 1,088 → 1,088, 0 expense changes).
Confirm afterwards that `git status` shows no modified files under `site/`.

## 3. Browser checks (10 minutes; after every refresh or UI change)

Run with the `/verify-dashboard` skill (or the `qa-verifier` agent) against `node .claude/serve.js`
(http://127.0.0.1:8080/), then against the live URL after publishing.

| # | Check | Expected |
|---|---|---|
| 1 | Load | Console clean (only the browser's `favicon.ico` 404); header + logo; `Universe — N instruments.` with N = MASTER effective; footer "Performance as on … & Analytics as on …" = `DATA_DATES` |
| 2 | Rail and nav | Left rail collapses and reopens; nav links scroll each section to 84 px from the top |
| 3 | Add funds | Build the 4-fund selection used in checks 4–8: `HDFC Large Cap Fund(G)`, `HDFC Ultra Short Term Fund-Reg(G)`, `ICICI Pru Arbitrage Fund(G)` (5% each on add) and `Abakkus All Cap PMS` (raised to its ₹50 L minimum = 10% of ₹5 Cr). Separately confirm a bond and a Direct Equity stock can be added. Select popover shows Sharpe/Sortino/Beta/Std Dev/Alpha + benchmark + rationale |
| 4 | Allocate 100% | Status "✓ 100.00% allocated — downloads ready"; Section 4 "✓ Ready to export" |
| 5 | Regular/Direct | Returns change, IRR band does not; switching back restores |
| 6 | Excel | `Centricity_Investment_Proposal.xlsx`, 13 sheets: Investment Proposal, Rationale, Equity MF, Hybrid MF, Debt MF, PMS, AIF, Listed Direct Equity, Other, Equity Analytics, Debt Analytics, AMC & Liquidity, Overlap Matrix; corpus in B2 |
| 7 | PowerPoint | 25 slides for the 4-fund selection above; logo on every slide; switching the logo to Invictus stamps Invictus on every slide |
| 8 | Allocation Sheet | Download → Clear All → upload restores the same funds and % ("Loaded 4 instrument(s) — 100.00% allocated") |
| 9 | Live Output tabs | All 9 render; "⬇ Download slide" works per tab (Performance Sheet = 4 slides, others 1) |
| 10 | Credit rating | Debt Analytics doughnut sums to 100%, colours fixed per bucket (`H.CREDIT_COLORS`), same colours in the PPT |
| 11 | MF Monitor upload | Section 7 card accepts the current monitor: "Updated N schemes · as on …" (session only) |

### How to drive exports without downloading files (in-page JavaScript)

- **Excel:** temporarily replace `XLSX.writeFile` with a function that records `wb.SheetNames`, click
  "⬇ Excel Proposal", restore.
- **PowerPoint:** subclass `window.PptxGenJS` so `addSlide` counts slides (and wraps
  `slide.addImage` to detect the logo at x 11.21 / y 0.22, or 8.47 / 4.33 on the closing slide) and
  `writeFile` records instead of saving; click "⬇ PowerPoint"; restore. Do not use
  `write('base64')` — it stalls on a hidden page.
- **Steppers:** set the input value with the native setter + `input` event, then dispatch an
  `Enter` keydown (a background browser pane may not fire `blur`).
- **Upload:** build a `File` and assign it to the hidden input through a `DataTransfer`.

Useful selectors (verified 16-Oct-2026): fund search `#sec-3 input.fund-search`; result rows
`#sec-3 .fund-row` (name in `span.name`, add button `button.btn-add` — scope to the row, the Add Fund
form shares the class); selected rows `#sec-4 table.sel-table tbody tr` (name in `td b`, stepper
`span.stepper input`); download bar `#sec-4 .dl-bar` (buttons by text "⬇ Excel Proposal",
"⬇ PowerPoint", "⬇ Allocation Sheet", "Clear All"; upload = the bar's `input[type=file]`; status
`.refresh-status`); tabs `#sec-6 .tabs > button.tab`; tab band `#sec-6 .tab-band` ("⬇ Download
slide", "Regular"/"Direct"); rail toggle `aside.side-left .side-rail-head button.side-toggle`; nav
`nav.side-right button.nav-link[title="…"]`; Data Refresh inputs `aside.side-left input[type=file]`
(MF Monitor, PMS/AIF SOA, SIF Monitor). A URL hash `#p=…` opens a read-only shared view — avoid it
for testing unless that view is the subject.

## 4. Continuous integration

`.github/workflows/pages.yml` runs on every pull request, every push to `main` and every manual run: checks the six deploy files exist
and parses `verify_page.js` output for the hard failures above. A failing `verify` job blocks
publishing. It does not run the browser checks — those remain manual (Claude) per release.

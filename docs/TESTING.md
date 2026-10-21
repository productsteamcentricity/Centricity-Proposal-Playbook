# Testing and verification

The project is verified at four levels: parity counts (§1), tool regression — unit tests, dry-run
comparison and the rehearsal harness (§2), browser checks (§3) and CI (§4). The first three were run
for the baseline on 16-Oct-2026 (results in [`REPLICATION_REPORT.md`](REPLICATION_REPORT.md)); the
unit tests and the rehearsal harness date from 16–19-Oct-2026 (PRs #3, #7).

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
`</html>`, script errors > 0, Select keys in MASTER ≠ total. On any of them the script prints
`*** VERIFY FAILED` and exits 1 (since PR #3). Its error filter hides only the five CDN globals'
exact "X is not defined" messages, so a typo's ReferenceError counts. Every other count may
legitimately move in a refresh, but each move must be explained in the update log; the script
compares no counts (`KNOWN_ISSUES.md` A23), so compare them with `PROJECT_STATE.md` yourself.

## 2. Tool regression (run when tools change)

### 2.1 Unit tests (seconds)

```bash
npm test                     # = node tools/test/run.js
```

Runs every `tools/test/*.test.js` file and exits 1 if any fails. Today:

- `blocklib.test.js` (34 checks: locate, atomic writes, the rename retry on `EPERM`/`EBUSY`/`EACCES`
  with a simulated `fs.renameSync` (R6), temp-file clean-up, as-on labels, `setDataDate`, `replaceOnce`);
- `dates.test.js` (10 checks: `isoDay`, `isoDayFromSerial`);
- `parser_refresh_only.test.js` (18 checks, added 19-Oct-2026 with the C19 change, D80). It tests
  page code: it loads the `REFRESH` block of `site/index.html` in a vm and feeds `parseMfMonitor`
  small synthetic workbooks (no monthly or client data). It covers a refresh-only row refreshing an
  existing record without creating one or changing its class (an unmatched row is reported); a
  mapped sheet winning even when it comes after the refresh-only sheet; a sheet in neither list
  counted and never merged; missing or empty expected sheets listed; `Debt Oriented34` read
  debt-style; and a mapped sheet still creating a new fund. It fails on `main`'s parser from before
  the change.
- `tool_inputs.test.js` (43 checks, added 21-Oct-2026, D72). Runs every tool at the top of `tools/`
  (dry run, no workbooks) with a source path that does not exist and with an `--html` page that does
  not exist: each must exit 2 with its usage line and no stack trace. A tool added without a case
  fails the test.

CI runs `npm ci` and then the tests on every PR. Add a `<name>.test.js` file beside them for any new
library function or parser rule.

### 2.2 Dry-run comparison (minutes)

Every tool is dry-run by default, so the whole suite can be run safely against a month's inputs and
its output compared before/after a code change. Used for the transfer: all 25 tool invocations
produced identical output before and after the reorganisation. To repeat, run each command of
`tools/README.md` §2 without `--apply` against `monthly-updates/2026-09_Sep-2026/`, save the outputs,
make the change, re-run, diff. The exit code is part of the result (0 pass, 1 gate failed, 2 usage;
D72). Re-running a month's own inputs on its baseline should report no data changes (Sep-2026 on
`main` `cd6317c`: risk matrix 1,088 → 1,088 with 28 + 5 flags unchanged; SIF 0 values changed;
`rename_schemes` lists the 8 pending renames, which wait for the owner). Exception until the C19
September re-run is published: the bake on today's page refreshes 215 MASTER records (records
carrying r1y 6,339 → 6,348; `KNOWN_ISSUES.md` C19). Confirm afterwards that `git status` shows no
modified files under `site/`.

### 2.3 Rehearsal harness — old versus new tools with `--apply` (minutes; needs `monthly-updates/`)

```bash
git worktree add --detach C:/t/cpp-old main          # the OLD tools: a short path outside OneDrive
npm run rehearse -- --old C:/t/cpp-old               # all cases
npm run rehearse -- --old C:/t/cpp-old --case mf-chain-sep,slides --keep
npm run rehearse -- --list                           # the cases (no --old needed)
git worktree remove C:/t/cpp-old
```

`tools/dev/rehearse.js` copies the live `site/` twice into a new `rehearse-*` folder in the OS temp
directory and runs each case's tool chain with `--apply` on both copies: one with the tools under
`--old`, one with the tools of this checkout (or `--new <root>`). Both sides read the inputs from
`<new root>/monthly-updates/`. It then compares the two results block by block (MASTER per field,
each name-keyed store, `DATA_DATES`, the siblings, and any code outside the blocks) and prints
`IDENTICAL` or the differences, plus each step's exit code and the files changed against live. It
writes `report.json` and per-case `logs.json`; `--keep` keeps the two site copies. The real `site/`
is never touched. The 12 cases are in `tools/dev/rehearsal_cases.js` (MF chain Sep and Aug,
analytics one class, Direct rebuild, fund managers, Reckoner, alias pins, PMS/AIF look-through,
`add_reckoner_funds`, Bond List, slides, one-off tools); a case can pass flags to one side only
(`oldArgs` / `newArgs`). A change is behaviour-preserving when every case is `IDENTICAL`, or when
every difference is the intended one, counted. The harness reports; it does not fail on a
difference (exit 2 only for a missing `--old` or an unknown case).

**Limit: page-code changes (`KNOWN_ISSUES.md` A27).** Both sides start from the new `site/`, and the
vm tools run the parsers of the page they are given, so a change to `site/index.html` code shows as
`IDENTICAL`. For a parser change, run the chain by hand with `--html` on two scratch copies of the
six files, one holding `main`'s `index.html`, and compare the blocks. Done for C19 on 19-Oct-2026
(September chain: bake → `fill_variant_analytics` → `rekey_sif_analytics` →
`merge_expense_exitload`): `main`'s chain reproduced the live site byte for byte; the fixed chain
changed exactly 215 MASTER records and left every other block, `DATA_DATES` and the five siblings
identical.

## 3. Browser checks (10 minutes; after every refresh or UI change)

Run with the `/verify-dashboard` skill (or the `qa-verifier` agent) against `node .claude/serve.js`
(http://127.0.0.1:8080/), then against the live URL after publishing.

| # | Check | Expected |
|---|---|---|
| 1 | Load | Console clean (no CDN integrity error; a `/favicon.ico` 404 can still appear despite the PR #12 data-URI icon and is harmless, F3); header + logo; `Universe — N instruments.` with N = MASTER effective; footer "Performance as on … & Analytics as on …" = `DATA_DATES` |
| 2 | Rail and nav | Left rail collapses and reopens; nav links scroll each section to 84 px from the top |
| 3 | Add funds | Build the 4-fund selection used in checks 4–8: `HDFC Large Cap Fund(G)`, `HDFC Ultra Short Term Fund-Reg(G)`, `ICICI Pru Arbitrage Fund(G)` (5% each on add) and `Abakkus All Cap PMS` (raised to its ₹50 L minimum = 10% of ₹5 Cr). Separately confirm a bond and a Direct Equity stock can be added. Select popover shows Sharpe/Sortino/Beta/Std Dev/Alpha + benchmark + rationale |
| 4 | Allocate 100% | Status "✓ 100.00% allocated — downloads ready"; Section 4 "✓ Ready to export" |
| 5 | Regular/Direct | Returns change, IRR band does not; switching back restores |
| 6 | Excel | `Centricity_Investment_Proposal.xlsx`, 13 sheets: Investment Proposal, Rationale, Equity MF, Hybrid MF, Debt MF, PMS, AIF, Listed Direct Equity, Other, Equity Analytics, Debt Analytics, AMC & Liquidity, Overlap Matrix; corpus in B2 |
| 7 | PowerPoint | 25 slides for the 4-fund selection above; logo on every slide; switching the logo to Invictus stamps Invictus on every slide |
| 8 | Allocation Sheet | Download → Clear All → upload restores the same funds and % ("Loaded 4 instrument(s) — 100.00% allocated") |
| 9 | Live Output tabs | All 9 render; "⬇ Download slide" works per tab (Performance Sheet = 4 slides, others 1) |
| 10 | Credit rating | Debt Analytics doughnut sums to 100%, colours fixed per bucket (`H.CREDIT_COLORS`), same colours in the PPT |
| 11 | MF Monitor upload | Section 7 card accepts the current monitor: "Updated N schemes · as on …" (session only); since the C19 change it may add "· N rows not merged" (the Sep-2026 Monitor gives 19 in the bake) and must never add "· N rows on unrecognised sheets" |

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

`.github/workflows/pages.yml` runs on every pull request, every push to `main` and every manual run: checks the six deploy files exist,
runs `npm ci` and the unit tests (§2.1), then parses `verify_page.js` output for the hard failures above. A failing `verify` job blocks
publishing. It does not run the browser checks — those remain manual (Claude) per release.

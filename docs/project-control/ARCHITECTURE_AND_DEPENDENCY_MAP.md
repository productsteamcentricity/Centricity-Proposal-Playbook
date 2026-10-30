# Architecture and dependency map

| Field | Value |
|---|---|
| Version | 1 |
| Date | 28-Oct-2026 |
| Author chat | MOD-01 (package writer W-architecture) |
| Status | Authoritative for the dependency, ownership and blast-radius view of the code at `2b2a397`. The narrative overview stays in [`docs/ARCHITECTURE.md`](../ARCHITECTURE.md); field-level contracts are in [`INTERFACE_CONTRACTS.md`](INTERFACE_CONTRACTS.md). |
| Supersedes | nothing (first version) |
| Next review | when MOD-02 validates the package (TASK-016); after that, in the same PR as any change to the deploy set, a sibling script, a data block's writer, `tools/lib/`, `tools/verify_page.js` or `.github/workflows/pages.yml` |

## 0. Read this first

- **Purpose.** Before any change, this map answers: what else does it touch, who writes and reads the
  same data, what breaks if it is wrong, and which test or gate catches it. Section 9 is the procedure
  for a change-impact review. The Guardian (ARC-01, `.claude/agents/integration-guardian.md`) uses this
  file together with [`INTERFACE_CONTRACTS.md`](INTERFACE_CONTRACTS.md),
  [`ACTIVE_CHANGE_REGISTER.md`](ACTIVE_CHANGE_REGISTER.md) and
  [`INTEGRATION_AND_REGRESSION_LOG.md`](INTEGRATION_AND_REGRESSION_LOG.md).
- **Baseline.** `2b2a397` = `origin/main` = PR #28 merge (27-Oct-2026, docs only). `site/` last changed in
  `5d39821` (PR #26, 22-Oct-2026). Code and git win over documents; section 8 lists the disagreements found.
- **Line numbers drift.** Every `Lnnnn` for `site/index.html` is as of `2b2a397`. Each table gives a grep
  anchor: re-derive with `Grep -n -o "<anchor>" site/index.html` before citing. Never Read the file whole
  (12.8 MB, single lines of up to 5.8 MB; CLAUDE.md rule 2).
- **Labels.** VERIFIED = checked in code, git or by a command on 28-Oct-2026; INFERRED = reasoned from the
  cited code; UNCERTAIN; UNKNOWN.
- **Evidence for this version (28-Oct-2026, all read-only).** The investigator ran a script-by-script vm
  load trace of the page, `blocklib.locate` over every block prefix, and a static extraction of every
  tool's writes. The writer re-checked: `node tools/verify_page.js site` exit 0 with the CLAUDE.md headline
  counts (MASTER 7,682; Select 178 of 178 in MASTER; PMS 692 / AIF 12 / benchmarks 4; EQUITY_ANALYTICS
  1,205; RISK_MATRIX 1,088; 0 duplicates; 0 script errors); `node tools/test/run.js` 5 of 5 files, 903
  checks, 0 failed; greps of the script tags, block prefixes, predicate definitions, the
  `pmsBenchmarkPerfFor` readers, the three sibling sources, the `blocklib` exports, `verify_page.js:90-96`
  and `pages.yml`. MOD-01 VERIFIED the app starting in a browser on 28-Oct-2026 (~08:55 UTC; in-browser
  MASTER 7,682, `window.H` / `REFRESH` / `EXPORTS` present, all three sibling markers set, 0 console
  errors). **Not run** for this version: building a proposal and exporting in the browser, a PowerPoint
  COM render (TASK-064 is the full acceptance pass).

---

## 1. Component inventory

### 1.1 The deploy set (`site/`, published to GitHub Pages from `main`)

| # | File | Size at `2b2a397` | Loaded at (anchor `<script src="Centricity_`) | Owns | Changed through |
|---|---|---|---|---|---|
| - | `index.html` | 12,864,963 B; 9,575 split lines; ends `</body></html>` | - | page shell, CSS, every inline data block, `window.H`, `window.REFRESH`, `window.EXPORTS`, the React UI (precompiled `React.createElement`, no JSX at runtime) | data: tools through `tools/lib/blocklib.js`; code: hand edits |
| 1 | `Centricity_ExtraSlides.js` | 2,617,988 B, 2 lines | ~L1232 (`<head>`) | `window.EXTRA_SLIDES` (3 dividers, 6 market slides, disclaimer, thank-you; data-URI images 2001x1125) | `update_market_slides.js` (market), `update_closing_slides.js` (disclaimer, thankyou) |
| 2 | `Centricity_PMS_AIF_Terms.js` | 6,054 B, 6 lines | ~L1233 (`<head>`) | `window.PMS_AIF_TERMS` (73: exit load + IRR band for new PMS/AIF rows from a Section 7 SOA upload) | hand edit only (P4 workbook, PMS & AIF sheet) |
| 3 | `Centricity_June_Refresh.js` | 54,408 B, 20 lines | ~L5525 | the whole GIFT City bucket (`var NEW_GIFT`, 58); 12 PMS/AIF look-throughs (`var EQ`) | `add_reckoner_funds.js` (NEW_GIFT), `merge_pms_aif_analytics.js` (EQ), hand edit (P2) |
| 4 | `Centricity_IRR_Offshore.js` | 110,356 B, 32 lines | ~L5526 | expected-IRR bands of 2,065 named funds (`var IRR`); 4 Offshore Funds (`var OFFSHORE`, `OFF_BASE`); "Offshore Funds" RATIONALE / BENCHMARKS / LIQUIDITY_MAP entries | `rename_schemes.js`, `fold_duplicate_names.js` (re-key IRR); hand edit (P4 MF bands, P2 Off Shore) |
| 5 | `Centricity_SIF_Refresh.js` | 35,735 B, 263 lines | ~L5527 | all 30 SIF rows (`var SIF`: Equity SIF 16, Hybrid SIF 14); effective `DATA_DATES.sif`; `REFRESH.parseSif` | `merge_sif_monitor.js` (`var SIF` + the `DATA_DATES.sif` line), `split_sif_add_mld.js`; hand edit (P3) |
| - | `robots.txt` | 156 B | - | `Disallow: /` | hand edit |

VERIFIED: sizes and script tags (`wc -c`, grep, 28-Oct-2026); the seven published files are SHA-256
identical to `site/` on 28-Oct-2026; the archived `docs/archive/Centricity_Risk_Matrix_2026-06-30.js` is
loaded by no script tag and returns 404 on the live site (D78). CI refuses any PR or push where one of the
six deploy files is missing or empty (`robots.txt` is not checked).

### 1.2 Regions of `site/index.html` and who depends on them

The complete line map is [`docs/ARCHITECTURE.md`](../ARCHITECTURE.md) section 3 (accurate at `2b2a397`,
VERIFIED). This table adds the grep anchor and the dependants.

| Region | Lines | Grep anchor | Depended on by |
|---|---|---|---|
| CDN libraries: React and ReactDOM 18.3.1 (unpkg), Chart.js 4.4.0, xlsx 0.18.5, pptxgenjs 3.12.0 (jsDelivr), each with SRI | L1224-1228 | `<script src="https://` | UI, exports; absent in every Node vm (verify_page, tests, bake) |
| `CENTRICITY_LOGO`, `DIRECT_PERF` (1,689), `LOGO_PRESETS` | L1229-1231 | `^window\.DIRECT_PERF = ` | `H.toDirect`, logo loader, Direct-plan switch |
| Siblings 1-2 | L1232-1233 | `<script src="Centricity_` | `buildDeck` (EXTRA_SLIDES), `parsePMSHoldings` (PMS_AIF_TERMS) |
| Config literals: dead `BENCHMARKS` map (L1238), `RATIONALE`, `LIQUIDITY_MAP` (15), `AMC_PREFIXES` (41), `getAMC` | L1234-1433 | `^window\.RATIONALE = ` | UI, exports; siblings 4-5 add keys |
| `MASTER` baseline: 7,672 records on one 2.86 MB line | L1434 | `window\.MASTER = \[` (the line starts with `<script>`) | every section, KPI and export; most tools |
| `EQUITY_ANALYTICS` (1,203), `HYBRID_ANALYTICS` (264), `DEBT_ANALYTICS` (511), empty `BONDS` / `PMS_HOLDINGS`, `CENTRICITY_SELECT` (178) | L1435-1440 | `window\.EQUITY_ANALYTICS = ` | look-through, overlap, Select popover, `verify_page` |
| `MF_BENCHMARK_PERF` (47 Monitor sheets) | L1444 | `^window\.MF_BENCHMARK_PERF = ` | `mfBenchmarkPerfFor` (screen, Excel, deck) |
| `DATA_DATES`, `dataAsOf`, `linkIdcwToGrowth()` **run at load** | L1446-1474 | `^window\.DATA_DATES = \{`, `linkIdcwToGrowth();` | every "as on" label |
| Core `window.H` (22 keys) | L1476-1905 | `window\.H = \{` | UI, exports |
| `H` extensions (47 more, 69 keys in all): returns, predicates, credit, scope, name resolution, plan switch, charts | L1907-2928 | `H\.isHybridScheme = ` | UI, exports, `pptx_layout.test.js` |
| Config + PMS overlay: `RISK_PROFILES`, live `BENCHMARKS` (L2960), `PMS_PERFORMANCE`, `PMS_PERF_ALIAS`, `applyPmsPerformance()` **run at load** (L3054), static `PMS_BENCHMARK_PERF` (L3057), `MF_BM_FOR_SUB`, `MF_BM_PREFERRED` | L2930-3176 | `^window\.PMS_PERFORMANCE = `, `applyPmsPerformance()` | MASTER PMS/AIF fields; benchmark rows on screen, in Excel and in the deck |
| `window.REFRESH` parsers; closure-private `SHEET_MAP` (43), `DEBT_STYLE_SHEETS`, `REFRESH_ONLY_SHEETS` (4) | L3177-3944 | `<script>// ===== In-browser xlsx parsers`, `window\.REFRESH = REFRESH` | Section 7 uploads **and**, offline, `bake_month`, `merge_analytics`, `fill_variant_analytics` |
| `window.EXPORTS`: Excel, master export, PowerPoint with the measured design system (D82) | L3945-5521 | `const DS = \{`, `function buildDeck`, `window\.EXPORTS = \{` | App buttons; `pptx_layout.test.js` |
| `#root`, siblings 3-5 | L5524-5527 | `<script src="Centricity_` | - |
| `RISK_MATRIX` (1,088), `DATA_DATES.riskMatrix`, `RISK_MATRIX_BENCH_SD` (no reader, C10) | L5528-5537 | `^window\.RISK_MATRIX = ` | Portfolio Matrix tab, deck matrix slide, Select popover risk flag |
| UI block 1: shared primitives, Sections 1-3, Section 7 rail (`DataRefreshPanel`) | L5538-7370 | `function DataRefreshPanel` | - |
| UI block 2: Section 4 tabs, Master Editor | L7371-8885 | `function PortfolioMatrixTab` | - |
| UI block 3: `loadFromHash` (share link), `App`, `ReactDOM.createRoot` | L8886-9573 | `function App`, `ReactDOM\.createRoot` | - |

The page makes no `fetch` or XHR and uses no `localStorage` / `sessionStorage`: a user's work lives in
memory plus the optional `#p=` share hash (VERIFIED by grep, investigator).

### 1.3 Tools, libraries, tests, CI and preview

Usage, flags and per-tool traps are authoritative in [`tools/README.md`](../../tools/README.md). The
dependency facts that matter for impact review:

| Group | Files | Dependency facts (VERIFIED in code) |
|---|---|---|
| Monthly MF cycle, steps 1-11 | `rename_schemes`, `bake_month`, `fill_variant_analytics`, `rekey_sif_analytics`, `merge_de_universe`, `merge_direct_equity_returns`, `merge_expense_exitload`, `merge_sif_monitor`, `merge_fund_managers`, `merge_risk_matrix`, `update_market_slides` | `bake_month` and `fill_variant_analytics` execute the page's inline scripts in a vm; `merge_sif_monitor` executes the SIF sibling; `rekey_sif_analytics` executes siblings 3-5. `rename_schemes` must run first every month (D46, CLAUDE.md rule 7). |
| Reckoner cycle, steps 12-16 | `merge_pms_performance`, `pin_pms_alias`, `merge_reckoner`, `add_reckoner_funds` (on demand), `merge_aif_performance`, `merge_pms_aif_analytics` | The first three have no default `--html` and exit 2 without it. `merge_pms_performance`, `pin_pms_alias`, `merge_reckoner`, `merge_aif_performance` each load `tools/data/pins.json` with their own copy of `loadPins()`. `add_reckoner_funds` and `merge_pms_aif_analytics` also write a sibling. |
| Periodic, alternative, one-off | `merge_bond_list`, `update_closing_slides`, `merge_analytics`, `rebuild_directperf`, `build_risk_matrix.py`, `fold_duplicate_names`, `fold_index_funds`, `split_sif_add_mld` | `merge_analytics` executes page code; `build_risk_matrix.py` refuses an output inside `site/` and is not validated (A22); the one-offs are idempotent (A26). |
| Verification | `tools/verify_page.js` | The only Node tool that does not use `blocklib`; never writes; runs every page script plus the five siblings. |
| Libraries and data | `tools/lib/blocklib.js` (every write), `dates.js`, `direct_perf.js`, `pptx.js`, `reck_parse.js`, `reck_narrative.js`; `tools/data/pins.json` | APIs in [`INTERFACE_CONTRACTS.md`](INTERFACE_CONTRACTS.md) section 3. |
| Tests | `tools/test/run.js` + `blocklib`, `dates`, `parser_refresh_only`, `pptx_layout`, `tool_inputs` (903 checks) | `pptx_layout.test` runs the whole page and siblings with a recording PptxGenJS; `parser_refresh_only.test` slices REFRESH by its marker comment; `tool_inputs.test` fails if a new top-level tool has no case. |
| Dev | `tools/dev/rehearse.js` (+ `rehearsal_cases.js`), `render_pptx.ps1`, `check_pptx_bounds.js` | `rehearse.js --old-site` is the only way to compare tool output across a page-code change (A27); `check_pptx_bounds.js` hard-codes `FOOT = 7.08` (= `DS.FOOT - DS.STAMP_H`). |
| CI/CD | `.github/workflows/pages.yml` | `verify` job on every PR, push to `main` and manual run; `publish` job for any non-PR run on `main` (a push or a manual run). Details: [`INTERFACE_CONTRACTS.md`](INTERFACE_CONTRACTS.md) section 6. |
| Preview | `.claude/serve.js`, `.claude/launch.json` (config `playbook`) | serves only `site/` on 127.0.0.1:8080 with `Cache-Control: no-store` (D66). |
| Process | `.claude/agents/` (9 specialists, including `integration-guardian`, which this package added), `.claude/skills/monthly-update`, `.claude/skills/verify-dashboard` | - |

### 1.4 Outside the deploy set

- Local-only, gitignored, never committed: `monthly-updates/` (inputs per data month), `backups/`
  (pre-refresh snapshots of the six files), `handover-archive/` (the outgoing owner's export).
- Three extra git worktrees are registered on merged commits (two under `.claude/worktrees/`). Their files
  are older copies of the repo and show up in a Grep of `.claude/`: exclude `.claude/worktrees/` when
  searching for consumers. State: [`REPOSITORY_AND_ENVIRONMENT_STATE.md`](REPOSITORY_AND_ENVIRONMENT_STATE.md).
- The repository lives inside OneDrive (R6, DEC-OPEN-19). Never `git checkout` / `git switch` in the main
  checkout (CLAUDE.md "Project control").

---

## 2. Data flow

### 2.1 End to end

```
desk / vendor workbooks and decks   (monthly-updates/<YYYY-MM_Mon-YYYY>/, local only)
   |
   v  tools/*.js: dry run -> read every GATE line -> back up the six files -> --apply
   |     - "bake = upload": bake_month / merge_analytics / fill_variant_analytics run the PAGE's own
   |       REFRESH.parseMfMonitor / parseAnalytics in a Node vm (this also runs linkIdcwToGrowth and
   |       applyPmsPerformance); merge_sif_monitor runs the SIF sibling's REFRESH.parseSif
   |     - the other tools parse the workbook with their own code
   |     - every write: tools/lib/blocklib.js (locate -> splice -> validate -> atomic rename)
   v
site/index.html data blocks   and/or   sibling literals (NEW_GIFT, EQ, IRR, SIF, EXTRA_SLIDES)
   |  branch -> PR -> CI verify (six files, npm ci + unit tests, verify_page + greps) -> merge -> publish
   v
GitHub Pages: https://productsteamcentricity.github.io/Centricity-Proposal-Playbook/  (site/ of main)
   |  desktop Chrome / Edge
   v
CDN libs -> logo + DIRECT_PERF -> siblings 1-2 -> config -> MASTER / analytics / Select -> MF_BENCHMARK_PERF
 -> DATA_DATES + linkIdcwToGrowth() -> window.H -> config + applyPmsPerformance() -> window.REFRESH
 -> window.EXPORTS -> #root -> sibling 3 (June) -> sibling 4 (IRR/Offshore) -> sibling 5 (SIF)
 -> RISK_MATRIX + DATA_DATES.riskMatrix -> React UI (createRoot)
   |  user picks funds and allocates a corpus in memory (optional session-only uploads in the Section 7 rail)
   v
EXPORTS.exportXlsx (SheetJS) | exportPpt / exportTabSlide (PptxGenJS, design system D82) | exportMaster
   - all generated in the browser
```

### 2.2 Monthly sources, tools and destinations

Source numbers follow [`docs/INPUT_FILES.md`](../INPUT_FILES.md) section 1. A destination in **bold** is a
sibling: that data cannot be changed in `index.html` (section 3).

| # | Source | Tool | Parser | Destination |
|---|---|---|---|---|
| 1 | Daily MF Monitor (Regular) | `rename_schemes.js` first, then `bake_month.js` (`fold_duplicate_names.js` as a check) | rename: own (`SHEET_SUB` mirror of `SHEET_MAP`); bake: page `REFRESH.parseMfMonitor` | MASTER, MF_BENCHMARK_PERF, DATA_DATES.performance; rename also re-keys six name-keyed stores and **IRR `var IRR`** |
| 2 | Daily MF Monitor (Direct) | `bake_month.js` or `rebuild_directperf.js` | `tools/lib/direct_perf.js` (not the page's `parseMfMonitorDirect`, A7) | DIRECT_PERF, rebuilt in full |
| 3-5 | Equity / Hybrid / Debt Analytics | `bake_month.js`, `fill_variant_analytics.js`, `rekey_sif_analytics.js` (`merge_analytics.js` for one class) | page `REFRESH.parseAnalytics` | EQUITY / HYBRID / DEBT_ANALYTICS, DATA_DATES.analytics |
| 6 | Listed Direct Equity (universe) | `merge_de_universe.js` | own | MASTER Direct Equity (sector, mktcap, sebi_mcap) |
| 7 | Listed Direct Equity (returns) | `merge_direct_equity_returns.js` | own | MASTER Direct Equity returns |
| 8-9 | Expense Ratio, Exit Load | `merge_expense_exitload.js` | own | MASTER expense / exit_load, DIRECT_PERF expense |
| 10 | SIF Monitor | `merge_sif_monitor.js` | sibling `REFRESH.parseSif` | **SIF `var SIF` + the `DATA_DATES.sif` line** |
| 11 | Fund Manager Data | `merge_fund_managers.js` | own | MASTER fund_mgr |
| 12 | Fund Risk Ratios & 3Y Rolling (made in-house; no producer today, B8) | `merge_risk_matrix.js` | own | RISK_MATRIX + the `DATA_DATES.riskMatrix` line |
| 13 | Market Update deck | PowerPoint COM render, then `update_market_slides.js` | - | **ExtraSlides `EXTRA_SLIDES.market`** |
| 14 | PMS_Scheme_Performance | `merge_pms_performance.js`, then `pin_pms_alias.js` | own | PMS_PERFORMANCE.pms, PMS_PERF_ALIAS, DATA_DATES.pms |
| 15 | Monthly Investment Reckoner deck | `merge_reckoner.js`, `merge_aif_performance.js`, `add_reckoner_funds.js` | `tools/lib/reck_parse`, `reck_narrative`, `pptx` | CENTRICITY_SELECT; PMS_PERFORMANCE.aif and .benchmarks; MASTER + Select + ALIAS + **June `NEW_GIFT`** |
| 16 | PMS & AIF Analytics | `merge_pms_aif_analytics.js` | own (not the page's `parsePMSHoldings`, A29) | EQUITY_ANALYTICS + **June `var EQ`** |
| 17 | NAV Data (optional, in-house) | `build_risk_matrix.py` | own (pandas) | a `.js` outside `site/`, never the deploy set |
| P1 | Bond List | `merge_bond_list.js --desk` | own | MASTER Bonds of one desk |
| P2 | Gift City Master List | hand edit | - | **June `NEW_GIFT`** and the MASTER block (D24); Off Shore rows -> **IRR `var OFFSHORE`** |
| P3 | SIF Master List | hand edit | - | **SIF `var SIF`** |
| P4 | Exit Load & Expected IRR Return Range | hand edit | - | **IRR `var IRR`** (MF bands); **`PMS_AIF_TERMS`** (PMS & AIF sheet) |
| P5 | Disclaimer / Thank You slides | COM render, then `update_closing_slides.js` | - | **ExtraSlides** disclaimer / thankyou |

### 2.3 Page load, script by script (baseline -> effective)

Tools read and write the **baseline** literals; the browser shows the **effective** state after the
load-time code and siblings 3-5 run. VERIFIED by a vm trace with the same shim as `verify_page.js`.

| Step | Script | MASTER | EQUITY_ANALYTICS | GIFT City | Offshore | SIF / Equity SIF / Hybrid SIF | Other effect |
|---|---|---|---|---|---|---|---|
| 1 | L1434 MASTER | 7,672 | - | 54 | 0 | 12 / 0 / 0 | baseline already carries `_pms_source` on 35 records (section 5.3) |
| 2 | L1435 analytics + Select | | 1,203 | | | | |
| 3 | L1446 DATA_DATES + core H | | | | | | `linkIdcwToGrowth()` runs (adds 0 keys today) |
| 4 | L2930 config | | | | | | `applyPmsPerformance()` matches 35 PMS/AIF records (no count change) |
| 5 | June sibling | 7,676 | 1,205 | 58 | 0 | 12 / 0 / 0 | NEW_GIFT = the baseline 54 + 4 "(Outbound)" rows; EQ adds 2 keys, 10 identical to baked entries |
| 6 | IRR/Offshore sibling | 7,676 | | 54 | 4 | | removes the 4 "(Outbound)" rows, adds 4 Offshore; of 2,065 IRR keys, 26 bands differ from the baked MASTER |
| 7 | SIF sibling | **7,682** | | | | 0 / 16 / 14 | removes 24 (12 legacy SIF + 12 MF-filed SIF duplicates), adds 30; `DATA_DATES.sif` = "30th September 2026"; registers `REFRESH.parseSif` |
| 8 | L5528 risk matrix | | | | | | `DATA_DATES.riskMatrix` = "30 Sep 2026" |
| 9 | UI blocks | | | | | | need React: they fail in a vm and run only in a browser |

Running siblings 3-5 a second time changes nothing: idempotence comes from filter-then-concat and plain
assignment, not from the `__*_APPLIED` markers (section 3.4).

### 2.4 Exports

- **Excel** `exportXlsx(selected, corpus, master)` via SheetJS: 13 sheets (Investment Proposal, Rationale,
  seven performance-bucket sheets, Equity Analytics, Debt Analytics, AMC & Liquidity, Overlap Matrix); performance rows include MF
  benchmark rows (`mfBenchmarkPerfFor`) and PMS benchmark rows (`pmsBenchmarkPerfFor`, ~L4099).
- **PowerPoint** `exportPpt` (full deck) and `exportTabSlide` (one Section 6 tab) both call
  `buildDeck(selected, corpus, unit, only)`; every native slide goes through the design system (`DS`,
  `TXT`, `applyMaster`, footer block, `planTable` / `drawTable`; D82). Images come from `EXTRA_SLIDES`; the
  logo from `window.__SELECTED_LOGO`; analytics exclusions from `window.__EQ_EXCLUDE` / `__DB_EXCLUDE`;
  layout bounds are recorded in `window.__PPTX_LAYOUT`.
- **Master export** `exportMaster(master)`.
- Inputs and outputs: [`INTERFACE_CONTRACTS.md`](INTERFACE_CONTRACTS.md) sections 4.3 and 7.

---

## 3. Sibling load order and data ownership

### 3.1 Why the order is June -> IRR/Offshore -> SIF, after everything else

| Constraint | Reason in code | Load-bearing today? |
|---|---|---|
| Siblings 3-5 load after L1434-L3942 | they mutate MASTER and EQUITY_ANALYTICS, write into the **live** `BENCHMARKS` (re-assigned at L2960) and extend `REFRESH` (replaced at L3942); loaded earlier, those assignments would wipe their entries and `parseSif` | yes (order VERIFIED; consequence INFERRED) |
| IRR (#4) after June (#3) | `NEW_GIFT` contains the 4 "(Outbound)" offshore rows that #4 removes by base name; run the other way round, #3 would re-add them beside the 4 Offshore records | yes (VERIFIED: the 4 rows are listed) |
| SIF (#5) after IRR (#4) | documented as avoiding a "fund-name collision" | UNCERTAIN: today 0 IRR keys are SIF names and `OFF_BASE` matches no SIF, so swapping would change nothing (INFERRED). Keep the order. |
| Siblings 1-2 in `<head>` | read only at user action (`parsePMSHoldings`, `buildDeck`) | no hard constraint (INFERRED) |

Tools that execute siblings use the same order: `verify_page` and `pptx_layout.test` (all five),
`rekey_sif_analytics` and `fold_index_funds` (3-5), `merge_sif_monitor` (SIF only, with an empty MASTER).
`bake_month` deliberately runs **none** (`tools/bake_month.js:7-9`), so the baseline stays pre-sibling.

### 3.2 Data each sibling owns (change it in the sibling, not in `index.html`)

| Data | Owner | Why the embedded block cannot hold it | Evidence (VERIFIED) |
|---|---|---|---|
| The whole GIFT City bucket (54 effective, plus the 4 Outbound rows #4 removes) | June `NEW_GIFT` | every load drops each `product_class === "GIFT City"` MASTER row, then appends NEW_GIFT | `Centricity_June_Refresh.js:9` |
| Look-through of 12 PMS/AIF schemes (2 exist only in the sibling) | June `var EQ` | `EQUITY_ANALYTICS[k] = EQ[k]` on every load | `Centricity_June_Refresh.js:12-13` |
| Expected-IRR band of 2,065 named funds | IRR `var IRR` | overwrites `irr_low` / `irr_high` by exact name on every load | `Centricity_IRR_Offshore.js:9, 15-18` |
| The 4 Offshore Funds records and their removal from GIFT City | IRR `OFFSHORE`, `OFF_BASE` | filtered and re-appended on every load | `Centricity_IRR_Offshore.js:10-11, 20-24` |
| RATIONALE / BENCHMARKS / LIQUIDITY_MAP entry "Offshore Funds" | IRR sibling | assigned on every load (BENCHMARKS gets a string, see INTERFACE_CONTRACTS 2.3) | `Centricity_IRR_Offshore.js:28-30` |
| All 30 SIF rows, their split, AMC prefix, IRR band and performance | SIF `var SIF` | deletes every `SIF` / `Equity SIF` / `Hybrid SIF` row and every normalised-name match, then appends | `Centricity_SIF_Refresh.js:28, 43-53` |
| Effective `DATA_DATES.sif` | SIF sibling | the block's `sif` value is a dash placeholder that the sibling overwrites unconditionally (`index.html` ~L1452) | `Centricity_SIF_Refresh.js:61` |
| RATIONALE / BENCHMARKS "Hybrid SIF", LIQUIDITY_MAP "SIF" | SIF sibling, only if missing | - | `Centricity_SIF_Refresh.js:62-65` |
| `REFRESH.parseSif` (Section 7 SIF card and the bake) | SIF sibling | the page has no SIF parser | `Centricity_SIF_Refresh.js:82-83` |
| PMS/AIF exit load + IRR reference for new SOA uploads (73) | PMS_AIF_Terms sibling | - | read at ~L3877 |
| Deck images | ExtraSlides sibling | - | read at ~L4652 |

### 3.3 Rules that follow

- The 12 legacy `product_class: "SIF"` rows in the MASTER block stay as they are; reclassifying them would
  let them escape the sibling's class filter (OPERATING_MANUAL Traps; CLAUDE.md rule 8). VERIFIED filter.
- A GIFT City addition goes into `NEW_GIFT` (`add_reckoner_funds.js` writes both places; D24).
- The look-through of the 12 schemes is written twice, block and `var EQ` (`merge_pms_aif_analytics.js`
  does both; D49).
- A scheme rename is not applied to `var SIF`, `NEW_GIFT`, `OFFSHORE`, `var EQ`, PMS keys or `pins.json`
  by `rename_schemes.js` (INTERFACE_CONTRACTS ripple list).
- Folding siblings 3-5 into the page (C1, D2, TASK-045) is a separate, owner-approved change and never part
  of a data refresh.

### 3.4 Markers, not guards; failures are silent

- `__JUNE_REFRESH_APPLIED`, `__IRR_OFFSHORE_APPLIED`, `__SIF_REFRESH_APPLIED` are set but never read before
  applying; only `tools/merge_sif_monitor.js:76` reads the SIF one, for a printout (VERIFIED by grep). The
  docs that call the siblings "idempotent-guarded" are wrong about the mechanism (E6).
- Each sibling wraps its body in `try/catch` and only calls `console.error`. A broken sibling is therefore
  **not** a script error for `verify_page` or CI, and a deploy could silently fall back to the baseline
  for sibling-owned data (A30, TASK-042). `rekey_sif_analytics.js` does surface the siblings'
  `console.error` output and fails its gate (`:55-80`, `:126-127`), but it runs only in the monthly cycle.

---

## 4. Tools x data blocks

W = writes (only with `--apply`), R = reads, X = executes the code in a Node vm. "Page inline" = all
inline `<script>` blocks of `site/index.html` except the `createRoot` one. VERIFIED by static extraction
of each tool's `locate` / splice / write calls.

### 4.1 Blocks in `site/index.html`

| Tool | MASTER | EQ / HY / DB analytics | DIRECT_PERF | SELECT | MF_BM_PERF | PMS_PERF | PMS_ALIAS | RISK_MATRIX | DATA_DATES | Page code executed |
|---|---|---|---|---|---|---|---|---|---|---|
| `rename_schemes` | W (name, prev_name, prev_names) | W (keys) | W (keys) | W (keys) | - | - | - | W (keys) | - | none (own `SHEET_SUB` mirror) |
| `bake_month` | W | W (all 3) | W (via `lib/direct_perf`) | - | W | R (by `applyPmsPerformance` in the vm) | R | - | W performance, analytics | X page inline: `parseAnalytics` x3, `parseMfMonitor`; implicitly `linkIdcwToGrowth`, `applyPmsPerformance` |
| `fill_variant_analytics` | R | W (all 3) | - | - | - | - | - | - | - | X page inline: `parseAnalytics` |
| `rekey_sif_analytics` | R | W (all 3) | - | - | - | - | - | - | - | X siblings 3-5 on the baseline MASTER (for `sif_raw`) |
| `merge_de_universe` | W (Direct Equity) | - | - | - | - | - | - | - | - | none |
| `merge_direct_equity_returns` | W (DE returns) | - | - | - | - | - | - | - | - | none |
| `merge_expense_exitload` | W (expense, exit_load) | - | W (expense) | - | - | - | - | - | - | none |
| `merge_fund_managers` | W (fund_mgr) | - | - | - | - | - | - | - | - | none |
| `merge_risk_matrix` | R (names, prev_name) of the **baseline** | - | - | - | - | - | - | W (full replace; `bm` kept, `c` dropped, `fl` added) | W riskMatrix line | none |
| `merge_pms_performance` | R | - | - | - | - | W `.pms` (aif, benchmarks carried) | W (repins) | - | W pms | none |
| `pin_pms_alias` | R | - | - | - | - | R | W | - | - | none |
| `merge_reckoner` | R (name, prev_name, sub_category) | - | - | W | - | - | - | - | - | none (mirrors `H.buildFundIndex`'s second pass, `merge_reckoner.js:164`) |
| `merge_aif_performance` | R (AIF) | - | - | - | - | W `.aif` + `.benchmarks` (pms carried) | - | - | - | none |
| `merge_pms_aif_analytics` | R | W EQUITY (+ June `var EQ`) | - | - | - | - | - | - | none (as-on printed only, D70) | none (own parser) |
| `add_reckoner_funds` | W (new records) | - | - | W | - | R | W | - | - | none |
| `merge_bond_list` | W (one Bonds desk) | - | - | - | - | - | - | - | - | none |
| `merge_analytics` | - | W (classes given) | - | - | - | - | - | - | W analytics | X page inline: `parseAnalytics` |
| `rebuild_directperf` | R | - | W (full replace) | - | - | - | - | - | - | none (`lib/direct_perf`) |
| `fold_duplicate_names` | W | W (keys) | W (keys) | W (keys) | - | - | - | W (keys) | - | none |
| `fold_index_funds` | W (product_class) | - | - | - | - | - | - | - | - | X siblings 3-5 for a report only |
| `split_sif_add_mld` | W (MLD record) | - | - | - | - | - | - | - | - | none |
| `build_risk_matrix.py` | R (regex of the page) | - | - | - | - | - | - | writes a separate `.js` outside `site/` | (in that `.js`) | none |
| `verify_page` | R | R | R | R | R | R | R | R | R | X everything (inline + 5 siblings) |

### 4.2 Sibling blocks

| Tool | June `NEW_GIFT` | June `var EQ` | IRR `var IRR` | IRR `var OFFSHORE` | SIF `var SIF` + `DATA_DATES.sif` line | `EXTRA_SLIDES` |
|---|---|---|---|---|---|---|
| `rename_schemes` | - | - | W (keys) | - | - | - |
| `fold_duplicate_names` | - | - | W (keys; exits 1 if the sibling is missing) | - | - | - |
| `add_reckoner_funds` | W (append GIFT City adds) | - | - | - | - | - |
| `merge_pms_aif_analytics` | - | W (schemes it shares) | - | - | - | - |
| `merge_sif_monitor` | - | - | - | - | W both in one atomic write; X the sibling with `MASTER: []` | - |
| `split_sif_add_mld` | - | - | - | - | W `var SIF` | - |
| `update_market_slides` | - | - | - | - | - | W `.market` |
| `update_closing_slides` | - | - | - | - | - | W `.disclaimer`, `.thankyou` |
| `rekey_sif_analytics`, `fold_index_funds` | X | X | X | X | X | - |
| hand edit only | Gift City Master List | - | Expected IRR ranges | Off Shore list | SIF Master List | - |

### 4.3 Blocks no tool writes (hand edits only, reviewed like code)

`PMS_AIF_TERMS`, `PMS_BENCHMARK_PERF`, `PMS_BM_FOR_SUB`, `RISK_MATRIX_BENCH_SD` (only the Python route
produces one), `BENCHMARKS` (two literals with that prefix, so `blocklib.locate` refuses it),
`RATIONALE`, `LIQUIDITY_MAP`, `AMC_PREFIXES`, `MF_BM_FOR_SUB`, `MF_BM_PREFERRED`, `LOGO_PRESETS`,
`RISK_PROFILES`, `STRATEGY_OPTIONS`, `DEFAULT_STRATEGIES`, `var OFFSHORE` / `OFF_BASE`. VERIFIED: no tool
contains those prefixes. Consequence: `PMS_BENCHMARK_PERF` has not changed since 20-May-2026 (C41).

### 4.4 Coupling rule: the vm tools run whatever page they are given

`bake_month`, `merge_analytics` and `fill_variant_analytics` execute the inline scripts of the
`index.html` they are pointed at, and `merge_sif_monitor` executes the SIF sibling. A change to the
`REFRESH` parsers, to `parseSif`, or to the load-time code (`linkIdcwToGrowth`, `applyPmsPerformance`)
therefore changes what the next monthly bake writes. Rehearse such a change with
`node tools/dev/rehearse.js --old-site <old site/ dir>` (A27) and treat it as a data-affecting change.
VERIFIED: `bake_month.js:76-111`, `merge_analytics.js:75-77`, `fill_variant_analytics.js:72-73`,
`merge_sif_monitor.js:62-73`.

---

## 5. Cross-module dependencies and shared logic

### 5.1 Single predicates (CLAUDE.md rule 8; VERIFIED by grep of `site/` and `tools/`)

| Predicate | Defined (anchor) | Used by | Copies elsewhere |
|---|---|---|---|
| `H.isHybridScheme` (asset_class Hybrid and product_class Mutual Fund / Hybrid SIF / SIF) | ~L2253 `H\.isHybridScheme = ` | `inEquityScope`, `inDebtScope`, `aggEquityScoped`, `aggDebtScoped` | none in the scope gates or aggregators; not used by any sibling or tool |
| `H.isEquitySIF` | ~L2259 | `inEquityScope`, `aggEquityScoped` | none |
| `H.isSelfDescribingDebt` (Bonds or MLD) | ~L2232 | `hasDbHoldings`, `inDebtScope`, `aggDebtScoped` | `product_class === 'MLD'` again at ~L2440 only to choose the MLD sector bucket / Unrated default (intended) |
| `H.creditBucket` (7 fixed buckets, `CREDIT_BUCKETS`) | ~L2168 | `fundRatingBuckets`, `aggDebtScoped`, legacy `aggDebt` | none |

Asset-class tests deliberately not routed through the predicates: `H.netAllocation` (`asset_class ===
'Hybrid'`) and the three performance-bucket functions (5.2).

### 5.2 Duplicated logic (each copy is a drift risk)

| Logic | Copies | Tracked |
|---|---|---|
| Performance buckets (Equity MF / PMS / AIF / Hybrid MF / Debt MF / Direct Equity) | screen `function bucketOf` ~L7705; Excel `function bof` ~L4114; PowerPoint split in `buildDeck` ~L5126 | C29 (they disagree on Debt PMS); TASK-046 |
| Direct-plan Monitor parser | page `REFRESH.parseMfMonitorDirect` (Section 7 upload, merges) vs `tools/lib/direct_perf.js` (bake and rebuild, replaces) | A7 (partly fixed); TASK-039 |
| PMS/AIF holdings parser | page `REFRESH.parsePMSHoldings` (SOA upload; creates MASTER rows with IRR mid-point returns from `PMS_AIF_TERMS`) vs `tools/merge_pms_aif_analytics.js:95-140` (own parser, pins, never creates rows) | A29; whether outputs agree is UNKNOWN / NEEDS INVESTIGATION; TASK-068 |
| Monitor sheet taxonomy | page `SHEET_MAP` (43) vs `rename_schemes.js` `SHEET_SUB` (43; omits the 4 refresh-only sheets) | documented mirror (D80); in sync on 28-Oct-2026 (VERIFIED: 0 sub-category mismatches) |
| Fund-name index (live name beats `prev_name`) | `H.buildFundIndex` vs `merge_reckoner.js` (`:164`) and `rename_schemes.js` (`:231`) | INFERRED duplicate, not separately logged |
| Workbook date to calendar day | page `isoDay` (~L3288), SIF sibling `isoDayLite`, `tools/lib/dates.js` | A6 / D73 ("same rule" in three places) |
| Expected returns written as track record | `merge_bond_list.js`, `add_reckoner_funds.js`, page `parseBonds` / `parsePMSHoldings`, `applyPmsPerformance` keeps stored mid-points | C28, C37; the deck marks them `*` (D83, `H.isExpectedReturn`) |
| SIF name normaliser | sibling `_normSif` (used by the delete filter and `parseSif`) | single copy inside the sibling |

### 5.3 Load-time mutations the bake captures

`bake_month.js` runs every inline block, including `linkIdcwToGrowth()` (~L1474) and
`applyPmsPerformance()` (~L3054), then writes MASTER and the analytics stores back. The baseline MASTER
therefore already carries the PMS/AIF overlay: 35 records have `_pms_source`, exactly the set the overlay
re-creates on a stripped copy (VERIFIED counts; that the bake wrote them is INFERRED, because
`add_reckoner_funds.js` also sets `_pms_source`). Harmless today because the overlay re-applies on every
load; a field the PMS source later leaves blank keeps the baked value (consistent with C28). Not described
in `docs/ARCHITECTURE.md` (E15).

### 5.4 Load-bearing globals between modules

| Global | Producer | Consumers |
|---|---|---|
| `window.__SELECTED_LOGO`, `__EQ_EXCLUDE`, `__DB_EXCLUDE` | `App` (~L9131-9133) | logo loader, `aggEquityScoped` / `aggDebtScoped` defaults, so slides honour on-screen toggles |
| `window.__PPTX_LAYOUT`, `EXPORTS._ds` | `buildDeck` / EXPORTS | `pptx_layout.test.js`; manual browser check |
| `window.DATA_DATES` | block ~L1448 -> SIF sibling -> ~L5535 | footer `dataAsOf`, every export stamp, `verify_page` |
| `window.REFRESH` | page ~L3942, extended by the SIF sibling | Section 7 rail, `merge_sif_monitor.js` |
| `window.BENCHMARKS` (live map ~L2960) | page, extended by siblings 4-5 | `benchmarksFor` -> screen, Excel, deck |

### 5.5 Dead code kept for parity (do not remove during data work)

`PortfolioRollup` (~L6381), `SharePanel_REMOVED` (~L7298), two `false &&` Section 7 cards (~L9529,
~L9535), the dead `BENCHMARKS` description map (~L1238), legacy `aggEquity` / `aggDebt`, empty `BONDS` /
`PMS_HOLDINGS`, `REFRESH.parseBonds` (its rail card is unreachable). `REFRESH.parseAnalytics` is **not**
dead: three tools run it (C12). VERIFIED unreferenced (investigator).

---

## 6. High-risk areas ranked by blast radius

Single-writer rule (package operating model; [`FILE_OWNERSHIP_AND_CHANGE_CONTROL.md`](FILE_OWNERSHIP_AND_CHANGE_CONTROL.md)):
at most one active task may modify `site/index.html`, at most one each sibling and each `tools/lib/` file,
and a monthly refresh owns all six deploy files for its whole duration.

| Rank | Area | Blast radius if it goes wrong | Past incidents | Guard today | Gap (tracked) |
|---|---|---|---|---|---|
| 1 | Siblings 3-5 and the six-file deploy rule | Silent revert of GIFT City (54), 2,065 IRR bands, 30 SIF rows, 12 look-throughs and `DATA_DATES.sif` on the live client-facing page, with no error | The June sibling's `DATA_DATES.analytics` stamp reverted every later bake until 13-Aug-2026; SIF split and PMS/AIF look-through had to be done in the sibling | CI six-file check and `MISSING SIBLING`; `verify_page` effective counts (printed); Select-in-MASTER canary | counts not compared to an expected baseline (A23); a sibling's `console.error` is not a failure (A30); TASK-042 |
| 2 | `MASTER` block (one 2.86 MB line) and the bake path (`bake_month` + `REFRESH.parseMfMonitor`) | Every section, KPI and both exports; the fund name is the join key for every store | 217 SEBI renames (Aug-2026) would have duplicated funds; 5 two-spelling pairs folded 17-Sep-2026; 215 funds kept June figures under the Sep label (C19, fixed 19/21-Oct-2026); C20 open | rename-first rule; duplicate-name gates (tools, `verify_page`, CI); unrecognised-sheet gate; shrink gates | no `si` bound in the MF bake (C43, P1, TASK-067); RISK_MATRIX keys checked against the baseline (C42, TASK-066) |
| 3 | `window.REFRESH` parsers (~L3177-3944) | Section 7 uploads **and** three offline tools; scale rules (Monitor percent / 100) live here | SIF parser auto-detected scale and showed returns 100x; IST date off-by-one (A6) | `parser_refresh_only.test.js`; `rehearse.js --old-site` (A27) | rehearsal is manual |
| 4 | `window.EXPORTS` (~L3945-5521) | Client deliverables (deck, workbook) | Portfolio Matrix slide overran notes/footer (C17, C22, closed); expected returns shown as track record (C28, marked `*` since D83) | `pptx_layout.test.js` (798 checks); manual COM render + `check_pptx_bounds.js` | two fixed-geometry tables (C44); `listTable` draws only page 1 (C45); static PMS benchmarks (C41); TASK-069 |
| 5 | `window.H` predicates, look-through, credit (~L1907-2928) | Analytics, credit chart, overlap, net allocation on screen and in decks | SIF funds silently excluded until `isHybridScheme` was shared; rating chart used only top-20 holdings (C9, fixed); an invented 80% AAA fallback removed | single predicates; no fabricated fallback (CLAUDE.md rule 6) | review only, no automated guard |
| 6 | `tools/lib/blocklib.js` | Every tool write; a defect corrupts `index.html` or a sibling | non-atomic writes (A8), unescaped labels (A9), line-number finds (A10): fixed; OneDrive rename EPERM retried since PR #20 (R6 itself stays open) | `blocklib.test.js` (34); `</html>` guard; `writeFilesAtomic` validates every output first | two-file writes are two renames, not one transaction: back up first |
| 7 | Name-join tables: `tools/data/pins.json`, `PMS_PERF_ALIAS`, Reckoner joins | Another manager's numbers shown on a client fund | Jul-2026 vendor rename broke 9 of 16 PMS pins; Reckoner drops looked like editorial changes (A4, D71, D76) | byte-exact names + `trailing_space` list; drop gates; repin checks | pins changed only with the owner (D75) |
| 8 | Direct Equity joins (`merge_de_universe`, `merge_direct_equity_returns`) | 5,380 records; market-cap buckets drive equity analytics | `sebi_mcap` joined by row position for ~8 months (large caps shown as small caps; fixed 28-Jul-2026) | top-10-by-mktcap "Large Cap" gate inside the tools | not in `verify_page` / CI (A31) |
| 9 | `.github/workflows/pages.yml` | The only automated gate; any merge to `main` publishes within minutes | - | actions pinned to SHAs; read-only token except publish | no branch protection (R9, DEC-OPEN-17); greps depend on `verify_page` label padding |
| 10 | Repository inside OneDrive | Dehydrated `.git` packs; a checkout truncated tracked files on 25-Oct-2026 | R6 (open) | rename retry in blocklib; never checkout/switch in the main checkout | TASK-017 (owner restores OneDrive), DEC-OPEN-19 |
| 11 | Static `PMS_BENCHMARK_PERF` (~L3057) | PMS/AIF benchmark rows on screen, in Excel and in the deck show values unchanged since 20-May-2026 under current "as on" stamps | undocumented until 28-Oct-2026 | none | C41, DEC-OPEN-27, TASK-065 |
| 12 | `Centricity_ExtraSlides.js` (2.6 MB of images) | Deck visuals only | closing-slide gates weaker than documented (A21, closed) | slide-size gates (2001x1125) | - |

---

## 7. External dependencies and pinned versions

Never upgrade a CDN library or `xlsx` without the owner's explicit instruction (CLAUDE.md "Never"; R4,
TASK-058). The browser `xlsx` and the Node `xlsx` must stay the same version, because the tools run the
page's parsers.

| Dependency | Version / pin | Where | Notes |
|---|---|---|---|
| React, ReactDOM (UMD production) | 18.3.1, unpkg, SRI sha384 + `crossorigin` | `site/index.html:1224-1225` | UI is precompiled `React.createElement` (VERIFIED) |
| Chart.js | 4.4.0 `dist/chart.umd.js`, jsDelivr, SRI | `:1226` | PRD 3.2 still shows the old form (E2) |
| SheetJS xlsx (browser) | 0.18.5 `dist/xlsx.full.min.js`, jsDelivr, SRI | `:1227` | must equal the Node copy |
| PptxGenJS | 3.12.0 `dist/pptxgen.bundle.js`, jsDelivr, SRI | `:1228` | replaced by a recorder in `pptx_layout.test.js` |
| xlsx (Node) | `"xlsx": "0.18.5"` exact; `package-lock.json`; `npm ci` in CI | `package.json` | two high-severity advisories accepted (R4) |
| Node.js | `engines >=18`; CI `node-version: 24`; local v24.21.0 | `package.json`, `pages.yml` | - |
| Python 3 + pandas, numpy, python-dateutil | unpinned | `tools/build_risk_matrix.py` | optional, not validated (A22); run with `python -I` |
| Microsoft PowerPoint (COM) + Windows PowerShell 5.1 | - | `tools/dev/render_pptx.ps1`; slide refresh (`tools/README.md` section 4) | paths under 255 characters; renders never inside tracked folders |
| GitHub Actions | `checkout` v7, `setup-node` v7, `configure-pages` v6, `upload-pages-artifact` v5, `deploy-pages` v5, each pinned to a full SHA | `.github/workflows/pages.yml` | `contents: read`; publish job adds `pages: write`, `id-token: write`; environment `github-pages`, `main` only |
| GitHub Pages | Actions build type, `site/` of `main`; public (D60) | [`docs/DEPLOYMENT.md`](../DEPLOYMENT.md) | live = `site/` on 28-Oct-2026 (VERIFIED) |
| gh CLI | 2.102.0 locally | PRs, runs, release checks | `gh repo set-default` must be `origin` |
| Browser | desktop Chrome / Edge; `viewport width=1280` | `site/index.html:3` | system font Cambria; no network fetch besides the CDN scripts |

---

## 8. Where documents and code disagree (code wins)

Row numbers below are local to this table, not register IDs. The "Tracked in" column says where the fix is
owned; `docs/KNOWN_ISSUES.md` is authoritative for each entry.

| # | Document claim | Code fact (VERIFIED unless marked) | Tracked in |
|---|---|---|---|
| 1 | `docs/ARCHITECTURE.md` section 2, `docs/OPERATING_MANUAL.md` "one rule", `docs/PRD.md`: each sibling is "idempotent-guarded (`window.__JUNE_REFRESH_APPLIED` etc.)" | the markers are never read before applying; idempotence comes from filter-then-concat | E6 |
| 2 | `docs/ARCHITECTURE.md` section 1 region ranges (H "~L1446-2906", REFRESH "~L3154-3921") and section 2 (siblings "L5167-5169", risk matrix "L5175") | H ~L1446-2928, REFRESH ~L3177-3944, siblings ~L5525-5527, RISK_MATRIX ~L5533; the same document's section 3 line map is correct | E15 |
| 3 | `docs/ARCHITECTURE.md` does not say that the bake captures the `applyPmsPerformance` / `linkIdcwToGrowth` load-time mutations | 35 baseline records carry `_pms_source` (section 5.3; mechanism INFERRED) | E15 |
| 4 | `docs/OPERATING_MANUAL.md` top sections: siblings at L836/L837/L4189-4191, MASTER L1031, counts 7452 -> 7460, SIF 12 -> 28, June mutates `DATA_DATES` | siblings ~L1232-1233 / ~L5525-5527, MASTER ~L1434, 7,672 -> 7,682, SIF 30, June no longer touches `DATA_DATES` | E1 (manual kept as history; its Errata correct it) |
| 5 | `docs/OPERATING_MANUAL.md` Traps: "Equity SIF (15)", "Hybrid SIF (13)", "array of 28"; "fixed six-bucket vocabulary" (then lists seven); the sibling's delete filter matches `/SIF$/` | 16 / 14 / 30; 7 credit buckets; the delete filter uses the three exact classes plus a normalised-name match (only `parseSif` and `rekey_sif_analytics.js` use `/SIF$/`; same effect today) | E1 (not separately logged) |
| 6 | `docs/OPERATING_MANUAL.md`: "#5 must load after #4, otherwise a fund-name collision" | no IRR-owned name is a SIF name today | UNCERTAIN; keep the order (section 3.1) |
| 7 | `docs/PRD.md` 6.1, `tools/README.md` and the `merge_aif_performance.js` header imply PMS benchmark rows are refreshed monthly (`PMS_PERFORMANCE.benchmarks`) | nothing in the page reads `PMS_PERFORMANCE.benchmarks`; screen (~L7934), Excel (~L4099) and deck (~L5200) read the static `PMS_BENCHMARK_PERF` (~L3057) through `pmsBenchmarkPerfFor` (~L3069). Example: NIFTY 50 TRI 1M 0.075 static vs -0.011 in the monthly block | C41 (EXISTING DEFECT, client-facing); DEC-OPEN-27; TASK-065 |
| 8 | `CLAUDE.md` invariants "top-10 Direct Equity by market cap are Large Cap" and "`DATA_DATES.sif` is not -" | neither is checked by `verify_page.js` (hard failures `:90-96`) or `pages.yml`; only inside `merge_de_universe.js:135-137`, `merge_direct_equity_returns.js:185-188` and `merge_sif_monitor.js` gates. Both hold on 28-Oct-2026 | A31; TASK-042 |
| 9 | `docs/DEPLOYMENT.md` diagram: verify = "six files present + verify_page parity gate"; live-check loop hashes 6 files | verify also runs `npm ci` + `node tools/test/run.js` (`pages.yml:43-46`); 7 files are published (incl. `robots.txt`) | E14 |
| 10 | `docs/KNOWN_ISSUES.md` C1 / R5 cite `site/index.html:5083-5085`; C10 `:5091-5094`; C12 `:9052`, `:9058`, `:6796-6807`, `:6848`, `:6700` | now ~L5525-5527; ~L5533-5536; ~L9529, ~L9535, ~L7246-7294, ~L7145-7146 | KNOWN_ISSUES corrections dated 28-Oct-2026 (package) |
| 11 | `docs/PRD.md` RISK_MATRIX shape `{be, sd, al, so, sh, co, ir, dc, rr, bm}` | also `fl` on 33 entries (D74) | E2 (correction added 28-Oct-2026) |
| 12 | `docs/PRD.md` 3.1: `index.html` 12,827,311 bytes, 9,097 lines | 12,864,963 bytes, 9,575 split lines | expected drift since the baseline; no entry |
| 13 | `docs/DECISIONS.md` D80 and D72 source line references | `SHEET_MAP` ~L3185-3232, `REFRESH_ONLY_SHEETS` ~L3248-3250; blocklib write helpers `:59-105`, label helpers `:136-175` | line drift; no entry (decision text is still correct) |
| 14 | `KNOWN_ISSUES.md` has no entry for the two PMS/AIF holdings parsers | page `parsePMSHoldings` vs `merge_pms_aif_analytics.js` | A29; TASK-068 |
| 15 | `CLAUDE.md`: tag `handover-baseline` "= upstream `72e1f1e`" | the tag points to local `862e40b`, the sanitised equivalent (D64) | consistent when read as "equivalent of"; no entry |

Checked and found **accurate** (investigator, 28-Oct-2026): `docs/ARCHITECTURE.md` section 3 line map;
MASTER runtime re-assignments (~L3469, ~L3803, ~L3923, ~L9266-9267, ~L9302-9303); "baseline 7,672 ->
effective 7,682"; `tools/README.md` "every Node tool except verify_page.js uses blocklib"; "18 tools default
to site/index.html, three need --html"; PRD 6.2 effective taxonomy counts; the KNOWN_ISSUES C12 list of
dead code; the Section 7 rail shows three cards; `SHEET_SUB` mirrors `SHEET_MAP`.

---

## 9. How to use this map for a change-impact review

Use this before any material or high-risk change (anything in section 6, any shared interface, any data
change) and record the answers in the change-impact contract that the task's PR description and its
[`ACTIVE_CHANGE_REGISTER.md`](ACTIVE_CHANGE_REGISTER.md) row carry (Gate A; template and gates in
[`FILE_OWNERSHIP_AND_CHANGE_CONTROL.md`](FILE_OWNERSHIP_AND_CHANGE_CONTROL.md)).

1. **List the files and blocks the change touches.** Find each in section 1 (component) and section 4
   (which tools write and read the same block). For `site/index.html`, name the region and its grep anchor.
2. **Check sibling ownership.** If the data is in section 3.2, the change goes in the sibling, and the
   tools in section 4.2 that write it are affected too.
3. **Find every consumer.** Use the consumer columns in [`INTERFACE_CONTRACTS.md`](INTERFACE_CONTRACTS.md)
   and its ripple list (section 8), then confirm with a fresh grep of `site/`, `tools/`, `.github/` and
   `docs/` (exclude `.claude/worktrees/`). Remember that the vm tools execute page code (section 4.4): a
   parser or load-time edit is a data change.
4. **Check duplicated logic** (section 5.2). If the change alters one copy, either change every copy in the
   same PR or record why not.
5. **Read the risk rank** (section 6). A change in ranks 1-6, or to any contract in
   [`INTERFACE_CONTRACTS.md`](INTERFACE_CONTRACTS.md), needs a Guardian pre-check (Gate B) before
   implementation and a Guardian diff review after. Any change that touches data, scale or a financial
   calculation also goes to `financial-data-reviewer` (CLAUDE.md "How every change is made", step 1).
6. **Check ownership.** Look in [`ACTIVE_CHANGE_REGISTER.md`](ACTIVE_CHANGE_REGISTER.md) for any active
   task holding the same file, sibling, `tools/lib/` file or interface. If one does, the Moderator
   sequences the work or assigns a single owner before anyone edits.
7. **Pick the tests (Gate C).** Always `node tools/verify_page.js site` and `npm test`. Add, by area:

| If the change touches | Also run |
|---|---|
| `REFRESH` parsers, `parseSif`, `linkIdcwToGrowth`, `applyPmsPerformance` | `parser_refresh_only.test` (in `npm test`); `node tools/dev/rehearse.js --old-site <old site/>`; a dry run of the affected tools on the last month's inputs; `financial-data-reviewer` |
| A data block or a sibling | the producing tool's dry run and every `GATE` line; backup of the six files before `--apply`; compare `verify_page` counts before and after; `financial-data-reviewer` |
| `EXPORTS` / the deck | `pptx_layout.test` (in `npm test`); a PowerPoint COM render (`tools/dev/render_pptx.ps1`) + `node tools/dev/check_pptx_bounds.js`; in the browser `window.__PPTX_LAYOUT.warnings` empty after a real export |
| `window.H` predicates or aggregators | the `verify-dashboard` skill in the browser (analytics, credit, overlap tabs) plus a deck export |
| `tools/lib/blocklib.js` | `blocklib.test` (in `npm test`); a dry run and `--apply` of one tool on a disposable copy of `site/` |
| A tool's CLI or exit codes | `tool_inputs.test` (in `npm test`); update `tools/README.md` section 3 |
| `verify_page.js` output or `pages.yml` | both in the same PR; a PR run of the `verify` job must pass |
| UI only | the `verify-dashboard` skill (`qa-verifier`), browser console clean |

8. **Plan the rollback.** Code: revert the merge commit in a new PR (never force-push). Data: restore the
   six files from `backups/<date>_<tag>/`. Record either in
   [`INTEGRATION_AND_REGRESSION_LOG.md`](INTEGRATION_AND_REGRESSION_LOG.md).
9. **Update the records in the same PR.** This map (if a dependency, writer, reader or risk changed),
   [`INTERFACE_CONTRACTS.md`](INTERFACE_CONTRACTS.md) (if a contract changed), and the docs CLAUDE.md
   step 5 names.

---

## 10. Change history

| Version | Date | Chat | Change | Code baseline |
|---|---|---|---|---|
| 1 | 28-Oct-2026 | MOD-01 | First version, built from the 28-Oct-2026 architecture investigation and re-checked by the writer (section 0) | `2b2a397` |

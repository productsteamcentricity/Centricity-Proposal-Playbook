# Interface contracts

| Field | Value |
|---|---|
| Version | 1 |
| Date | 28-Oct-2026 |
| Author chat | MOD-01 (package writer W-architecture) |
| Status | Authoritative for the shared interfaces of the code at `2b2a397` (data blocks, `blocklib`, page APIs, tool CLI, `verify_page`/CI, the PowerPoint design system). Narrative overview: [`docs/ARCHITECTURE.md`](../ARCHITECTURE.md). Dependencies and blast radius: [`ARCHITECTURE_AND_DEPENDENCY_MAP.md`](ARCHITECTURE_AND_DEPENDENCY_MAP.md). |
| Supersedes | nothing (first version) |
| Next review | when MOD-02 validates the package (TASK-016); after that, in the same PR as any change to a contract below (section 1, step 7) |

## 0. How to read this file

- A **shared interface** is any shape or behaviour that more than one component relies on: a data block's
  name, literal form, fields, scale or key set; a function's signature or return shape; a sibling's load
  order or the data it owns; a tool's flags, exit codes or gate lines; the labels `verify_page.js` prints
  and CI greps; the PowerPoint design-system constants; the share-link payload; the allocation sheet.
- For each contract the tables give: where it is defined (with a grep anchor), shape, scale, invariants,
  producers (writers), consumers (readers) and the guard that catches a break. Section 8 is the ripple
  list (what must change together).
- **Baseline vs effective.** Tools read and write the **baseline** literals in the files. The browser sees
  the **effective** state after the load-time code and siblings 3-5 run (MASTER 7,672 -> 7,682). A
  contract that says "in MASTER" must say which.
- Line numbers in `site/index.html` are as of `2b2a397` and drift: re-derive with
  `Grep -n -o "<anchor>" site/index.html`. Never Read the file whole. Code and git win over documents.
- Labels: VERIFIED (checked on 28-Oct-2026; source cited) / INFERRED / UNCERTAIN / UNKNOWN.
- Evidence (28-Oct-2026, read-only): the interface investigation (vm runs of the page and siblings,
  `blocklib.locate` on every prefix, `SHEET_MAP` vs `SHEET_SUB` diff, value-range scans, live-file
  hashes); the writer re-ran `node tools/verify_page.js site` (exit 0, output in section 6) and
  `node tools/test/run.js` (5 of 5 files, 903 checks, 0 failed: blocklib 34, dates 10,
  parser_refresh_only 18, pptx_layout 798, tool_inputs 43) and grepped the anchors cited. Not run: a
  browser export, a PowerPoint COM render, tool dry runs on real monthly workbooks.

---

## 1. The rule for changing a shared interface

Applies to every chat, including the Moderator. The source of the rule is section 12 ("Control shared
interfaces") of the owner's handover master prompt of 27/28-Oct-2026; this is how it works in this
repository.

1. **Identify the contract and every consumer.** Start from the consumer columns below and the ripple
   list (section 8), then confirm with a fresh grep of `site/`, `tools/`, `.github/`, `.claude/skills/`
   and `docs/` (exclude `.claude/worktrees/`, which hold old copies of the repo).
2. **Declare it before editing.** The task's change-impact contract (template and gates in
   [`FILE_OWNERSHIP_AND_CHANGE_CONTROL.md`](FILE_OWNERSHIP_AND_CHANGE_CONTROL.md)) names the interface,
   the intended change and every consumer. The task's row in
   [`ACTIVE_CHANGE_REGISTER.md`](ACTIVE_CHANGE_REGISTER.md) lists it under "shared interfaces affected".
3. **Coordinate through the Moderator and the Guardian.** The Moderator checks
   `ACTIVE_CHANGE_REGISTER.md` for any active task that edits a consumer or builds against the contract.
   The Guardian (ARC-01, subagent `.claude/agents/integration-guardian.md`) reviews the change-impact
   contract before implementation (Gate B pre-check) and the diff after (Gate B).
4. **Never change an interface while another active task builds against its old definition.** The
   Moderator either sequences the work (one task merges first; the other rebases on the new `origin/main`
   and re-runs its tests) or gives both changes to one owner. A chat that finds mid-task that it must
   change a contract stops, updates its change-impact contract and asks the Moderator before touching
   another task's files.
5. **Change the producer and every consumer in one PR**, and keep backward compatibility where old data
   lives outside the repo: share links already sent to clients (`#p=` payload), workbooks already filed in
   `monthly-updates/` that the tools must still read, allocation sheets users have saved.
6. **Verify (Gate C)** with the guards named in the contract's table, plus always
   `node tools/verify_page.js site` and `npm test`. The Guardian compares the diff with this file.
7. **Record in the same PR:** update the contract text here and add a row to section 10. If a decision in
   [`docs/DECISIONS.md`](../DECISIONS.md) fixes the contract (for example D42 bake = upload, D72 tool
   contract, D80 Monitor sheets, D82 design system), the change needs the owner's approval and a new
   decision number there (next free: D84).
8. **If compatibility cannot be established, do not merge.** Record the problem in
   [`INTEGRATION_AND_REGRESSION_LOG.md`](INTEGRATION_AND_REGRESSION_LOG.md) and investigate.

Owner-only contracts: the CDN library versions and `xlsx` (CLAUDE.md "Never"; R4); anything that changes
the financial meaning or scale of a number a client sees (owner decides; `financial-data-reviewer`
reviews).

---

## 2. Embedded data blocks

### 2.1 Literal form (what `blocklib` requires)

- A tool-written block is `window.<NAME> = ` followed by **strict JSON** (one object or array literal),
  and exactly **one** literal in the file uses that prefix. Runtime re-assignments such as
  `window.MASTER = (window.MASTER || []).concat(...)` do not count as literals. Blocks are stored as
  compact `JSON.stringify` output, so splicing an unchanged value back is byte-identical (VERIFIED,
  `tools/test/blocklib.test.js:17-26`).
- Found exactly once by `blocklib.locate` (VERIFIED): in `index.html` MASTER, EQUITY_ANALYTICS,
  HYBRID_ANALYTICS, DEBT_ANALYTICS, DIRECT_PERF, CENTRICITY_SELECT, MF_BENCHMARK_PERF, PMS_PERFORMANCE,
  PMS_PERF_ALIAS, RISK_MATRIX; in siblings `var NEW_GIFT`, `var EQ`, `var IRR`, `var SIF`, `EXTRA_SLIDES`
  (tool-written) and `PMS_AIF_TERMS` (locatable, but hand-edited: no tool writes it).
- `BENCHMARKS` has two literals (a dead map at ~L1238 and the live map at ~L2960), so `locate` refuses it.
- `DATA_DATES` is a JS object with unquoted keys and comments, not JSON: change it only with
  `blocklib.setDataDate` (keys `performance`, `analytics`, `pms`) or the two anchored one-line
  assignments (`riskMatrix` in `index.html`, `sif` in the SIF sibling), never by hand-splicing.
- Never add a second literal with an existing prefix. A new baseline literal must sit before any runtime
  re-assignment of the same global.

### 2.2 Store keys against baseline and effective MASTER (VERIFIED 28-Oct-2026)

| Store | Keys | In baseline MASTER | In effective MASTER | Note |
|---|---|---|---|---|
| CENTRICITY_SELECT | 178 | 178 | 178 | the CI "rename canary" |
| RISK_MATRIX | 1,088 | 1,088 | 1,076 | 12 keys name rows the SIF sibling removes at load; 0 of the 30 effective SIFs has a row (C42) |
| EQUITY_ANALYTICS | 1,203 | 1,145 | 1,157 | 12 keys match only effective names (re-keyed SIF entries) |
| HYBRID_ANALYTICS | 264 | 213 | 226 | 13 keys match only effective names |
| DEBT_ANALYTICS | 511 | 490 | 490 | |
| DIRECT_PERF | 1,689 | 1,689 | 1,689 | keyed by the Regular name |
| PMS_PERF_ALIAS | 27 | 27 | 27 | |
| IRR sibling `var IRR` | 2,065 | 2,065 | 2,051 | all 2,065 apply, because IRR runs before the SIF sibling removes 14 of those names |
| PMS_AIF_TERMS | 73 | 55 exact | 50 exact | normalised match at use (~L3878-3881) |

Analytics stores are keyed by fund names that need not be in MASTER (IDCW aliases, re-keyed SIF names,
PMS/AIF schemes), so "every key in MASTER" is not an invariant for them.

### 2.3 Block catalogue

**(a) Tool-written blocks in `site/index.html`**

| Block (anchor) | Shape | Scale and units | Size baseline -> effective | Writers | Main readers |
|---|---|---|---|---|---|
| `MASTER` (`window\.MASTER = \[`, ~L1434; the line starts with `<script>`) | Array of records. Fields: `name, asset_class, product_class, sub_category, irr_low, irr_high, aum, mtd, r1m, r3m, r6m, r1y, r2y, r3y, r5y, r10y, si, expense, inception, fund_mgr, exit_load, mcap_large, mcap_mid, mcap_small, mcap_other, ytm, avg_maturity, mod_duration, bond_issuer, bond_rating, prev_name, _pms_source, pe, sd1y, sd3y, sharpe1y, sharpe3y, sortino1y, sortino3y, alpha1y, alpha3y, beta1y, beta3y, top_sector_pct, sebi_mcap, mktcap, isin`. SIF rows add `sif_raw`, `sif_amc`. Direct Equity rows are slim (`name, asset_class, product_class, sub_category` = sector, `sebi_mcap, mktcap, isin, r3m..r5y`). `prev_names` (array) is supported by readers; 0 records carry it today. | **Decimals** for returns, `irr_low/high`, `expense`, `ytm`, `mcap_*` (0.12 = 12%). `aum` INR crore. `avg_maturity`, `mod_duration` in years. `inception` ISO `YYYY-MM-DD`. Known outlier: one ETF `si` = 2977.6 (C43). | 7,672 -> 7,682 | `bake_month`, `rename_schemes`, `fold_duplicate_names`, `fold_index_funds`, `merge_bond_list`, `merge_de_universe`, `merge_direct_equity_returns`, `merge_expense_exitload`, `merge_fund_managers`, `add_reckoner_funds`, `split_sif_add_mld`. Runtime: `parseMfMonitor`, `parseBonds`, `parsePMSHoldings`, `parseSif`, siblings 3-5, `applyPmsPerformance` (in place) | every UI section; `H.buildTree`, `H.buildFundIndex`, `H.isExpectedReturn`; `exportXlsx`, `exportMaster`; `verify_page`; `pptx_layout.test` |
| `EQUITY_ANALYTICS` (`window\.EQUITY_ANALYTICS = `, ~L1435) | `{name: {mcap:{Large,Mid,Small,Others}, sector:{name: pct}, stocks:[{name,pct}], total}}` | **Percent** weights (total ~100); readers divide by 100 | 1,203 -> 1,205 (+2 June `var EQ` keys) | `bake_month` (via `parseAnalytics`), `merge_analytics`, `fill_variant_analytics`, `rekey_sif_analytics`, `rename_schemes`, `fold_duplicate_names`, `merge_pms_aif_analytics`; runtime `parseAnalytics`, `parsePMSHoldings`; June `var EQ` | `H.hasEqHoldings`, `aggEquity`, `H.aggEquityScoped`, overlap, `linkIdcwToGrowth` |
| `HYBRID_ANALYTICS` (~L1436) | `{eq_mcap, eq_sector, eq_stocks:[{name,pct}], eq_total, db_sector, db_holdings:[{issuer,rating,pct}] (top 20), db_rating, db_total}` | Percent | 264 | as EQUITY, without the PMS tools | `H.hasEqHoldings`, `H.hasDbHoldings`, scoped aggregators, `H.equityFraction`, overlap |
| `DEBT_ANALYTICS` (~L1437) | `{sector:{}, holdings:[{issuer,rating,pct}] (up to 20), rating:{raw: pct}}` | Percent; `rating` is the full map, `holdings` top 20 only | 511 | as HYBRID | `H.hasDbHoldings`, `H.aggDebtScoped`, `H.fundRatingBuckets` (reads `rating`) |
| `CENTRICITY_SELECT` (~L1440) | `{MASTER name: {reckonerName, category, sheet, kind, rationale?, alpha?, beta?, sharpe?, sortino?, stdDev?, benchmark?, details?:[{label,value}]}}`; `kind` in mf, pms, aif, unlisted, gift | ratios as stored (alpha unit unclear, C23; ratios are May-2026 values, C36) | 178 | `merge_reckoner`, `add_reckoner_funds`, `rename_schemes`, `fold_duplicate_names` | Select popover and badges; `verify_page` join |
| `MF_BENCHMARK_PERF` (~L1444) | `{Monitor sheet: [{name, mtd, r1m..r10y, si?}]}` | Decimals | 47 sheets, 334 rows | `bake_month` via `parseMfMonitor` (a sheet is replaced only when benchmark rows were found) | `mfBenchmarkPerfFor` (through `MF_BM_FOR_SUB`, `MF_BM_PREFERRED`) |
| `DIRECT_PERF` (`^window\.DIRECT_PERF = `, ~L1230) | `{Regular MASTER name: {mtd, r1m..r10y, si, expense, mcap_large/mid/small/other, aum, ytm, avg_maturity, mod_duration}}` | Must equal MASTER's scale (decimals; `aum`, maturity, duration raw) | 1,689 | `bake_month` (full rebuild by `tools/lib/direct_perf.js`), `rebuild_directperf`, `merge_expense_exitload` (expense), `rename_schemes`, `fold_duplicate_names`; runtime `parseMfMonitorDirect` (merges) | `H.toDirect` (its 19-key list is the field contract) |
| `PMS_PERFORMANCE` (`^window\.PMS_PERFORMANCE = `, ~L2966) | `{pms:{scheme:{aum, exit_load, r1m..r5y, si, sd1y, sd3y, alpha1y, alpha3y, sharpe1y, sharpe3y, sortino1y, sortino3y, beta1y, beta3y, pe, mcap_*?, top_sector_pct?}}, aif:{name:{inception, inception_full, aum, r1m..r5y, si, mcap_*}}, benchmarks:{index:{r1m..r5y, si}}}` | Returns, SD, alpha decimals; sharpe, sortino, beta, pe plain ratios; aum INR crore | pms 692, aif 12, benchmarks 4 | `merge_pms_performance` (`pms` replaced whole; `aif`, `benchmarks` carried), `merge_aif_performance` (`aif` rebuilt; `benchmarks` when the count matches; `pms` carried) | `applyPmsPerformance` (copies onto MASTER PMS/AIF records, sets `_pms_source`), `H.isExpectedReturn`, `verify_page`. **`.benchmarks` has no reader in the page** (C41) |
| `PMS_PERF_ALIAS` (~L2972) | `{MASTER PMS/AIF name: PMS_PERFORMANCE key or null}`; `null` blocks the fuzzy match | - | 27 (4 null) | `merge_pms_performance` (repins), `pin_pms_alias` (pins), `add_reckoner_funds`; pin lists from `tools/data/pins.json` | `applyPmsPerformance`; `verify_page` "MASTER PMS with perf 23 of 27" |
| `RISK_MATRIX` (`^window\.RISK_MATRIX = `, ~L5533) | `{exact MASTER name: {be, sd, al, so, sh, co, ir, dc, rr?, bm, fl?}}`; `fl` in `split`, `lowcorr` (D74) | **Percent points** for `sd`, `al`, `dc`, `rr` (shown raw with "%"); `be`, `so`, `sh`, `co`, `ir` plain ratios. Not decimals. | 1,088 (966 with metrics, 433 with `rr`, 33 with `fl`) | `merge_risk_matrix` (full replace; `bm` kept, `c` dropped, `fl` added), `rename_schemes`, `fold_duplicate_names`. `build_risk_matrix.py` writes a separate `.js` outside `site/` | `PortfolioMatrixTab`, deck matrix slide, Select popover flag, `H.riskFlagged` |
| `DATA_DATES` (`^window\.DATA_DATES = \{` ~L1448; `window.DATA_DATES.riskMatrix = ` ~L5535; SIF sibling `:61`) | keys `performance`, `analytics`, `pms`, `sif`, `riskMatrix` | Long labels "30th September 2026" for performance, analytics, pms, sif; short "30 Sep 2026" for riskMatrix (`blocklib.checkAsOn`) | effective 28-Oct-2026: performance / analytics / sif "30th September 2026", pms "31st August 2026" (over 31-Jul data, B1), riskMatrix "30 Sep 2026"; the block's `sif` is a dash placeholder | `bake_month` (performance, analytics), `merge_analytics` (analytics), `merge_pms_performance` (pms), `merge_risk_matrix` (riskMatrix line), `merge_sif_monitor` (sif line); runtime `parseMfMonitor`, `parseMfMonitorDirect` (performance), `parseSif` (sif). Never `merge_pms_aif_analytics` (D70). | 29 references: `dataAsOf`, every export stamp, UI labels; `verify_page` prints it |

**(b) Hand-edited and config blocks in `site/index.html` (no tool writes them)**

| Block (line) | Shape | Readers | Contract notes |
|---|---|---|---|
| live `BENCHMARKS` (~L2960; dead map ~L1238) | `{sub_category: [index names]}` | `benchmarksFor` -> Excel, deck, screen | The IRR sibling sets `"Offshore Funds"` to a description **string**, not an array; all three readers wrap a non-array in an array (~L4093, ~L5193, ~L7923). Tolerated, VERIFIED. The SIF sibling adds `"Hybrid SIF": ["NIFTY 50 - TRI"]` if missing. Effective 61 keys. |
| `RATIONALE` (~L1290) | `{sub_category: text}` (JS, not JSON) | Excel, deck rationale cards, UI | siblings 4-5 add "Offshore Funds", "Hybrid SIF" |
| `LIQUIDITY_MAP` (~L1365) | `{product_class: [Open/Close Ended, note]}` (15 keys) | `classifyLiquidity` | IRR sibling adds "Offshore Funds"; SIF sibling "SIF" if missing |
| `AMC_PREFIXES` (~L1383) | `[[prefix, AMC]]` (41) | `getAMC` (fallback: first word of the name, C31) | - |
| `RISK_PROFILES`, `STRATEGY_OPTIONS`, `DEFAULT_STRATEGIES` (~L2932-2942) | JS config; equity bands in percent (`eq_min`, `eq_max`) | `H.computeRiskProfile`, `H.defaultStrategy` | - |
| `PMS_BENCHMARK_PERF`, `PMS_BM_FOR_SUB` (~L3057, ~L3060) | `{index: {r1m..r5y, si}}`; `{sub_category: [index]}` | `pmsBenchmarkPerfFor` (~L3069) -> screen ~L7934, Excel ~L4099, deck ~L5200 | Values unchanged since 20-May-2026 while the tools refresh `PMS_PERFORMANCE.benchmarks` instead (C41, DEC-OPEN-27). |
| `MF_BM_FOR_SUB`, `MF_BM_PREFERRED` (~L3076, ~L3128) | `{sub_category: Monitor sheet}`; `{sub_category: [preferred index names]}` | `mfBenchmarkPerfFor` | - |
| `RISK_MATRIX_BENCH_SD` (~L5536) | `{index: SD}` percent points (4) | **no reader** | stale (C10, TASK-053) |
| `CENTRICITY_LOGO` (~L1229), `LOGO_PRESETS` (~L1231) | data-URI PNG; `{Invictus, OneDigital}` | `loadLogoData` (after `__SELECTED_LOGO`), logo switcher | - |
| `BONDS`, `PMS_HOLDINGS` (~L1438-1439) | `{}` | none | dead, kept for parity (C12) |

**(c) Sibling blocks**

| Block (file:line) | Shape | Scale | Size | Writers | Applied by |
|---|---|---|---|---|---|
| `EXTRA_SLIDES` (`Centricity_ExtraSlides.js:2`) | `{marketDivider, portfolioDivider, annexureDivider, market:[6], thankyou, disclaimer}` data URIs, every image 2001x1125 | - | 6 keys | `update_market_slides` (`market`), `update_closing_slides` (`disclaimer`, `thankyou`) | read by `buildDeck` (~L4652) |
| `PMS_AIF_TERMS` (`Centricity_PMS_AIF_Terms.js:6`) | `{scheme: [exit_load text, irr_low, irr_high]}` | IRR decimals | 73 | none (hand edit) | read by `parsePMSHoldings` for new PMS/AIF rows only |
| `var NEW_GIFT` (`Centricity_June_Refresh.js:8`) | MASTER-shaped records, `product_class` "GIFT City" | MASTER scale; house band 0.10-0.12 | 58 | `add_reckoner_funds`; hand edit | `:9` replaces every GIFT City row at load |
| `var EQ` (`Centricity_June_Refresh.js:12`) | EQUITY_ANALYTICS-shaped | percent | 12 (10 identical to the block, 2 sibling-only) | `merge_pms_aif_analytics` (shared keys) | `:13` assigns into EQUITY_ANALYTICS at every load |
| `var IRR` (`Centricity_IRR_Offshore.js:9`) | `{exact MASTER name: [irr_low, irr_high]}` | decimals | 2,065 | `rename_schemes`, `fold_duplicate_names` (re-key); hand edit | `:15-18` sets the band by exact name at load |
| `var OFFSHORE`, `var OFF_BASE` (`Centricity_IRR_Offshore.js:10-11`) | 4 MASTER-shaped records; 4 base names | MASTER scale | 4; 4 | none (hand edit) | `:20-24` moves 4 funds from GIFT City to Offshore Funds |
| `var SIF` (`Centricity_SIF_Refresh.js:28`) | MASTER-shaped + `sif_amc`, `sif_raw` (workbook name; the join key for analytics) | decimals; irr null on 2 new schemes | 30 (Equity SIF 16, Hybrid SIF 14) | `merge_sif_monitor` (with the `DATA_DATES.sif` line), `split_sif_add_mld`; hand edit | `:38-54` replaces every SIF row at load; `parseSif`; `rekey_sif_analytics` (via `sif_raw`) |

### 2.4 Scale conventions (shared by every writer and reader; CLAUDE.md rule 4)

| Data | Scale | Where converted | Status |
|---|---|---|---|
| MASTER returns, IRR, expense, YTM, m-cap split | decimal (0.12 = 12%) | page `pctToDec` / `mcapDec` divide by 100 unconditionally (~L3261-3274); `H.fmtPct` and exports multiply by 100 | VERIFIED |
| MF Monitor values (Regular and Direct) | always percent -> divide by 100, never auto-detected | `parseMfMonitor`, `parseMfMonitorDirect`, `tools/lib/direct_perf.js` | VERIFIED |
| SIF Monitor returns | always percent -> divide by 100; beyond +-1000% rejected as a mis-mapped column | `Centricity_SIF_Refresh.js:97-103` | VERIFIED |
| PMS performance file | percent -> divide by 100 | `tools/merge_pms_performance.js:60` | VERIFIED |
| Direct Equity returns file | percent -> divide by 100 | `tools/merge_direct_equity_returns.js` | VERIFIED from `tools/README.md`; code not re-read line by line |
| Analytics stores (MF, PMS/AIF) | percent weights | aggregators divide by 100 (~L2334-2342) | VERIFIED |
| RISK_MATRIX | percent points (`sd`, `al`, `dc`, `rr`); ratios plain | shown raw with "%" (~L7637-7648) | VERIFIED |
| AUM | INR crore | - | VERIFIED |
| Dates | MASTER `inception` ISO day; workbook dates read as the nearest local calendar day, same rule in three places | `tools/lib/dates.js`, page `isoDay` (~L3288), SIF sibling `isoDayLite` | VERIFIED (D73) |

### 2.5 Invariants

| Invariant | Value 28-Oct-2026 | Enforced by | Not enforced by |
|---|---|---|---|
| 0 duplicate MASTER names (effective) | 0 | `verify_page.js` (exit 1); CI grep; tool gates (`bake_month`, `rename_schemes`, `merge_de_universe`, `merge_expense_exitload`, `merge_fund_managers`, `merge_bond_list`, `add_reckoner_funds`, `merge_sif_monitor` for SIF names) | - |
| Every Centricity Select key in MASTER (rename canary) | 178 of 178 | `verify_page.js`; CI; `merge_reckoner` write gate (baseline MASTER) | - |
| Top-10 Direct Equity by `mktcap` are `sebi_mcap` "Large Cap" | 10 of 10 | `merge_de_universe.js:135-137`, `merge_direct_equity_returns.js:185-188` | `verify_page`, CI (A31) |
| `DATA_DATES.sif` is not a dash | "30th September 2026" | `merge_sif_monitor.js` gates | `verify_page` (prints only), CI (A31) |
| `index.html` ends with `</html>` | yes | `verify_page`; CI; `blocklib.writeBlocks` / `writeFilesAtomic`; `merge_risk_matrix` gate | - |
| Six deploy files present and non-empty | yes | CI step `test -s`; `verify_page` "MISSING SIBLING" | `robots.txt` is not checked |
| No script error other than the five CDN globals | 0 | `verify_page`; CI; `bake_month` sandbox gate | a sibling's `try/catch` swallows its own errors (A30) |
| Each tool-written literal occurs once | yes | `blocklib.locate` refuses otherwise | - |

---

## 3. `tools/lib/blocklib.js` and the other shared libraries

### 3.1 `blocklib` public API (`module.exports`, `tools/lib/blocklib.js:177-180`; VERIFIED)

| Function | Signature | Contract | Throws |
|---|---|---|---|
| `matchEnd` | `(s, start) -> index` | index of the bracket closing the `{` or `[` at `start`; skips double-quoted strings and escapes; single quotes and template literals are not understood (blocks must be JSON) | `unbalanced literal from offset N` |
| `literalOffsets` | `(html, prefix) -> number[]` | every offset where `prefix` is immediately followed by `{` or `[` | - |
| `locate` | `(html, prefix) -> {s, e, value}` | refuses unless exactly one literal uses `prefix`; `value = JSON.parse(...)` (strict JSON); `s` / `e` are the literal's first and last character | not found; not followed by a literal; `N literal occurrences - refusing to guess`; JSON parse error |
| `read` | `(file, prefix)` | `locate` on the file's text | as `locate` |
| `writeFileAtomic` | `(file, content, waitsMs = [100,200,400,800,1600,3200]) -> content.length` | writes `.<basename>.<pid>.tmp` beside the target, then renames over it; a rename failing with `EPERM` / `EBUSY` / `EACCES` (OneDrive, antivirus; R6) is retried with doubling pauses (6.3 s in all); the temp file is removed on any failure; `waitsMs` is for tests only | the underlying fs error |
| `writeFilesAtomic` | `(outputs: [{file, content}]) -> n` | validates every output first (non-empty; a file that ends with `</html>` must still end with it), then writes each atomically, one after another. **Not one transaction**: a failure after the first rename leaves earlier files written, hence the backup rule | `empty output for ...`; `output for X does not end with </html>` |
| `spliceBlocks` | `(html, [{prefix, value}]) -> string` | locates each prefix (unique), refuses a prefix repeated in one call and overlapping blocks, replaces each literal with `JSON.stringify(value)` from the end backwards | duplicate prefix; overlapping blocks; `locate` errors |
| `writeBlocks` | `(file, [{prefix, value}]) -> length` | `spliceBlocks` then `writeFileAtomic`; the `</html>` guard is derived from the input, so it protects `index.html` and still works on `.js` siblings (never make it a caller flag) | as above; output does not end with `</html>` |
| `checkAsOn` | `(label, style = 'long' or 'short') -> trimmed label` | plain date label only (no quote, backslash or `$`); long "31st October 2026", short "31 Oct 2026" with real month names; does not check the ordinal suffix against the day (INFERRED from the regex) | `--as-on "..." is not a plain date label` |
| `replaceOnce` | `(text, re, replacement, what) -> string` | exactly one match or throw; `$` in the replacement is literal | `<what>: expected exactly 1 match, found N` |
| `setDataDate` | `(html, key, label) -> string` | finds `window.DATA_DATES = {` exactly once, searches only to its first `};`, requires exactly one `key: "..."`, writes `JSON.stringify(label)`, keeps a trailing comment | block not found exactly once; `DATA_DATES.<key>: expected exactly 1 match` |

Callers (VERIFIED by grep of `tools/`): `writeBlocks` in 9 tools (`fold_index_funds`,
`merge_aif_performance`, `merge_de_universe`, `merge_direct_equity_returns`, `merge_expense_exitload`,
`merge_fund_managers`, `merge_reckoner`, `pin_pms_alias`, `rekey_sif_analytics`); `spliceBlocks` +
`writeFilesAtomic` in the other 15 writing tools (two-file writes: `add_reckoner_funds`,
`fold_duplicate_names`, `merge_pms_aif_analytics`, `rename_schemes`, `split_sif_add_mld`); `setDataDate`
in `bake_month`, `merge_analytics`, `merge_pms_performance`; `replaceOnce` in `merge_risk_matrix`
(`/^window\.DATA_DATES\.riskMatrix = (['"])([^'"\n]*)\1;/m`) and `merge_sif_monitor`
(`/if \(window\.DATA_DATES\) window\.DATA_DATES\.sif = "[^"]*";([^\n]*)/`); `checkAsOn` in `bake_month`,
`merge_analytics`, `merge_pms_aif_analytics`, `merge_pms_performance`, `merge_sif_monitor` (long) and
`merge_risk_matrix` (short); `locate` read-only in `tools/dev/rehearse.js`. Test: `blocklib.test.js` (34).

### 3.2 Other shared libraries and data

| Module | API | Contract | Users |
|---|---|---|---|
| `tools/lib/dates.js` | `isoDay(date)`, `isoDayFromSerial(XLSX, n)` | nearest local calendar day `YYYY-MM-DD`; `null` otherwise | `rename_schemes`, `fold_duplicate_names`, `merge_fund_managers`, `dates.test`; mirrored in the page and the SIF sibling |
| `tools/lib/direct_perf.js` | `buildDirectPerf(src, master) -> {store, matched, unmatched, sampleUnmatched}` | builds a new DIRECT_PERF keyed by the Regular name; never merges | `bake_month`, `rebuild_directperf` (the page's `parseMfMonitorDirect` is a second, different builder: A7) |
| `tools/lib/pptx.js` | `entries(file)`, `slideText(xml)`, `slideTables(xml)` | dependency-free `.pptx` reader (A28 open) | `merge_aif_performance` directly; `reck_parse.js` and `reck_narrative.js` (so every Reckoner tool) |
| `tools/lib/reck_parse.js` | `parse(pptx)` | Reckoner performance grids in order; as a command it always writes its second argument | `merge_reckoner` |
| `tools/lib/reck_narrative.js` | `slides(pptx)`, `about(slide)`, `details(slide)` | narrative slides | `merge_reckoner`, `add_reckoner_funds` |
| `tools/data/pins.json` | `_about`, `trailing_space`, `pms_alias` (16), `reckoner` (12), `reckoner_notes` (10), `aif_performance` (3) | byte-exact names; each loader exits 1 if names with an edge space differ from `trailing_space` (A25); pins change only with the owner (D75) | `loadPins()` copied in `merge_pms_performance`, `pin_pms_alias`, `merge_reckoner`, `merge_aif_performance` |

---

## 4. Page APIs

### 4.1 `window.H` (69 keys; core object ~L1898, extensions from ~L1907; VERIFIED by vm)

| Group | Members | Contract | Consumers |
|---|---|---|---|
| Formatters | `fmtPct`, `fmtPctRaw`, `fmtCr`, `fmtNum` | `fmtPct(decimal)` x100 with "%"; `fmtPctRaw(percent)` as is; a dash for null | UI |
| Taxonomy | `AC_ORDER`, `PC_ORDER`, `acIdx`, `pcIdx` (unknown -> 99), `sortFundsByTaxonomy`, `buildTree`, `displayPC` | `PC_ORDER` has no "Index Fund" and no "Offshore Funds" (sorts last) | Section 3 tree, exports |
| KPIs | `computeKPIs(selected, corpus)` | `{totalPct, allocatedCr, irrLow, irrHigh, irrMid, r3y, r5y}`; a missing IRR counts as 0 (C24, DEC-OPEN-15) | `App` |
| Returns | `effectiveReturn(fund, key)`, `isFallbackReturn`, `isExpectedReturn(fund, key, entry)` (D83), `weightedReturns`, `rollupReturns` | `isExpectedReturn` reads the stored MASTER record (cached index), PMS_PERFORMANCE and `_pms_source`; an entry override (`<key>Ov`) is never marked | deck `star()`, UI |
| Minimums | `minInvestment`, `fmtMinInv`, `minInvBreaches` | INR crore floors (PMS 0.50, AIF 1.00, two name overrides) | UI |
| FoF | `isFof`, `fofUnderlyingName`, `holdingsLookupName` | a FoF resolves to its underlying instrument's analytics | scope gates, aggregators |
| **Single predicates** | `isHybridScheme`, `isEquitySIF`, `isSelfDescribingDebt`, `creditBucket` (7 buckets in `CREDIT_BUCKETS`; blank -> Unrated; non-ratings -> Others) | the only gates for these tests; never re-inline (CLAUDE.md rule 8) | scope gates and scoped aggregators (lines in the map, section 5.1) |
| Credit | `fundRatingBuckets(rec, hybrid)`, `normaliseRatings` (sums to exactly 100), `CREDIT_COLORS` | reads the full rating map; top-20 holdings only as a fallback | exports, UI |
| Scope / look-through | `hasEqHoldings`, `hasDbHoldings`, `inEquityScope`, `inDebtScope`, `analyticsGroupLabel`, `aggEquityScoped(selected, corpus, exclude?)`, `aggDebtScoped`; legacy `aggEquity`, `aggDebt` | `exclude` defaults to `window.__EQ_EXCLUDE` / `__DB_EXCLUDE` (set by `App`), so slides honour on-screen toggles | exports, UI |
| Other aggregates | `aggAMC`, `aggLiquidity`, `classifyLiquidity`, `parseIssuer`, `normCo`, `eligibleOverlapFunds`, `computeOverlap`, `overlapClass`, `overlapClassCentricity`, `buildOverlapPng(funds, threshold)` (needs a canvas; the layout test stubs it) | - | exports, UI |
| Risk flags | `riskFlagged(entry)` (`fl` in split, lowcorr; takes the RISK_MATRIX entry, not a name), `RISK_FLAG_NOTE` | - | matrix tab, deck, Select popover, layout test |
| Name resolution | `planBaseName`, `buildFundIndex(master)` (`{exact, lower, base, master}`; `prev_name` / `prev_names` indexed second, only where the key is free), `resolveFundName(raw, idx)` -> `{fund, how}` with `how` in exact, plan, prefix, close, or `{fund: null, reason}` with `reason` in empty, ambiguous, no match | never guesses: "close" needs Dice >= 0.75 and a 0.05 lead | allocation upload, share-link loader; mirrored by `merge_reckoner.js:164`, `rename_schemes.js:231` |
| Plan switch | `toDirect(fund)` (overlays 19 DIRECT_PERF keys, sets `__plan`), `applyPlanSelected(selected, plan)`, `applyOverrides(selected)` (`irrLow`, `irrHigh`, `r1yOv`, `r3yOv`, `r5yOv`, decimals) | order matters: plan first, then overrides | `App` |
| Allocation | `orderSelected`, `equityFraction`, `netAllocation(selected, corpus)`, `tenureFor(fund)`, `defaultStrategy`, `computeRiskProfile` | - | deck, UI |
| Charts | `chartDefaults`, `dataLabelPlugin` | - | UI |

Tools do not call `H`; they run the page's parsers and blocks. Only `tools/test/pptx_layout.test.js` uses
`H` directly (`riskFlagged`, and it overrides `buildOverlapPng`). VERIFIED.

### 4.2 `window.REFRESH` (in-browser parsers, reused by the tools)

Defined in the IIFE starting at the marker `<script>// ===== In-browser xlsx parsers` (~L3177);
`window.REFRESH = REFRESH` (~L3942) **replaces** the object, so anything that extends `REFRESH` must load
after it. The SIF sibling adds `parseSif` (`window.REFRESH = window.REFRESH || {}`). Effective keys:
`parseMfMonitor, parseMfMonitorDirect, parseAnalytics, parseBonds, parsePMSHoldings, parseSif`.

| Parser | Signature | Returns | Side effects | Consumers |
|---|---|---|---|---|
| `parseMfMonitor` (~L3312) | `async (file, opts?)`; `file` = `{name, arrayBuffer()}`; `opts.asOn` | `{ok:true, updated, newFunds, asOn, skipped:[{sheet,name,reason}], unclassified:{sheet:n}, emptySheets:[sheet], sheetRows:{sheet:n}, monitorNames:[name], message}` or `{ok:false, error}` | non-null merge into MASTER by exact name (a blank cell never clears a value); new funds only from `SHEET_MAP` sheets; refresh-only sheets update existing records only and never override a mapped sheet's row; replaces `MF_BENCHMARK_PERF[sheet]` when benchmark rows are found; sets `DATA_DATES.performance` (picker > file name > in-file date) | UI upload; `bake_month.js:149-171` reads `skipped`, `unclassified`, `emptySheets`, `monitorNames` and FAILS if `unclassified` is absent or non-zero; `parser_refresh_only.test` (18) |
| `parseMfMonitorDirect` (~L3517) | `async (file, opts?)` | `{ok, message}` or `{ok:false, error}` (also when 0 rows match) | merges into DIRECT_PERF by Regular name; m-cap split taken whole (blank = 0); sets `DATA_DATES.performance` | UI only; tools use `tools/lib/direct_perf.js` (A7) |
| `parseAnalytics` (~L3629) | `async (file, kind)`, `kind` in equity, hybrid, debt | `{ok, count, asOn, message}` | merges: replaces per scheme, keeps schemes absent this month (they go stale; the bake lists them) | UI card (unreachable, C12); `bake_month`, `merge_analytics`, `fill_variant_analytics`: **do not delete** |
| `parseBonds` (~L3779) | `async (file)` | `{ok, updated, newBonds, asOn, message}` | pushes new Bonds rows with a hard-coded 0.085-0.095 band | UI only (card unreachable, C12) |
| `parsePMSHoldings` (~L3824) | `async (file, opts?)`, `opts.productClass` in PMS, AIF | `{ok, updated, newPMS, asOn, message}` | writes EQUITY_ANALYTICS; adds unmatched schemes to MASTER with `PMS_AIF_TERMS` terms or defaults | UI SOA upload (a second parser exists in the tools: A29) |
| `parseSif` (`Centricity_SIF_Refresh.js:83`) | `async (file, opts?)`, `opts.asOn` | `{ok, message}` or `{ok:false, error}` | merges into SIF rows by normalised name; appends a new scheme only with numeric AUM and Asset Type Equity/Hybrid, with no invented AMC prefix or IRR band; returns always / 100; sets `DATA_DATES.sif` | UI SIF card; `merge_sif_monitor.js:78-88` (bake = upload) |

Closure-private sheet lists (not on `window.REFRESH`): `SHEET_MAP` (~L3185, 43 sheets -> `[asset_class,
product_class, sub_category]`), `DEBT_STYLE_SHEETS` (~L3234; read YTM / maturity / duration instead of the
m-cap split), `REFRESH_ONLY_SHEETS` (~L3248; 4 sheets, one with a trailing space: refresh, never create;
D80). `bake_month.js` keeps no copy of them; `rename_schemes.js` `SHEET_SUB` mirrors `SHEET_MAP`'s
sub-categories (43 = 43, 0 mismatches on 28-Oct-2026) and omits the refresh-only sheets.

How the tools load the parsers: `bake_month`, `merge_analytics` and `fill_variant_analytics` run every
inline `<script>` in a vm with `window = {}` and the real `XLSX`, skipping `src` scripts (CDN and all five
siblings) and the `createRoot` block; any error other than the five CDN "X is not defined" messages fails
the sandbox gate. `parser_refresh_only.test.js:13-15` finds the REFRESH block by the marker comment above:
renaming that comment breaks the test.

### 4.3 `window.EXPORTS` (~L5519)

`window.EXPORTS = { exportXlsx, exportPpt, exportMaster, exportTabSlide, _ds: { DS, TXT, planTable,
columnWidths, rowHeights } }`. VERIFIED: `_ds` and the design system were added by PR #26; the transfer
baseline exposed only the four functions.

| Member | Signature | Output | Caller |
|---|---|---|---|
| `exportXlsx` | `(selected, corpus, master)` | `Centricity_Investment_Proposal.xlsx`, 13 sheets: Investment Proposal, Rationale, seven performance buckets (Equity MF, Hybrid MF, Debt MF, PMS, AIF, Listed Direct Equity, Other), Equity Analytics, Debt Analytics, AMC & Liquidity, Overlap Matrix | `App` (with the plan-switched selection and master) |
| `exportMaster` | `(master)` | `Centricity_Master_Data.xlsx` (sheet Master Data) | `App` |
| `exportPpt` | `(selected, corpus, corpusUnit)` -> `buildDeck(..., null)` | `Centricity_Investment_Proposal.pptx` | `App`; `pptx_layout.test.js` |
| `exportTabSlide` | `(tabId, selected, corpus, corpusUnit)`, `tabId` in proposal, rationale, perf, matrix, equity, debt, amc, overlap, netalloc | `Centricity_<Investment_Proposal / Category_Rationale / Performance_Sheet / Portfolio_Matrix / Equity_Analytics / Debt_Analytics / AMC_Liquidity / Overlap_Matrix / Net_Asset_Allocation>.pptx` | Section 6 tab buttons; layout test |
| `_ds` | read-only test hook | design-system objects (section 7) | `pptx_layout.test.js:43` |

Inputs the exports read: `DATA_DATES`, `RATIONALE`, `RISK_MATRIX`, `EXTRA_SLIDES`, `__SELECTED_LOGO`
(fallback `CENTRICITY_LOGO`), `benchmarksFor`, `mfBenchmarkPerfFor`, `pmsBenchmarkPerfFor` and the `H`
members `aggEquityScoped`, `aggDebtScoped`, `aggAMC`, `aggLiquidity`, `computeOverlap`,
`eligibleOverlapFunds`, `isExpectedReturn`, `riskFlagged`, `netAllocation`, `tenureFor`, `orderSelected`,
`rollupReturns`, `effectiveReturn`, `buildOverlapPng`, `sortFundsByTaxonomy`, `defaultStrategy`, `acIdx`.
Amounts follow `corpusUnit` (Cr, or Lakhs = x100); fund AUM stays in crore. Side output after every deck
build: `window.__PPTX_LAYOUT = {slides, blocks, warnings}`.

### 4.4 Sibling hooks (load-time contracts)

| Sibling (tag in `index.html`) | Requires before it | Mutates / registers | Order | Writers |
|---|---|---|---|---|
| `Centricity_ExtraSlides.js` (~L1232) | nothing | `window.EXTRA_SLIDES` | independent | `update_market_slides`, `update_closing_slides` |
| `Centricity_PMS_AIF_Terms.js` (~L1233) | nothing | `window.PMS_AIF_TERMS` | read lazily by `parsePMSHoldings` | hand edit |
| `Centricity_June_Refresh.js` (~L5525) | `MASTER`, `EQUITY_ANALYTICS` | MASTER: drops every "GIFT City" row and appends `NEW_GIFT` (58); EQUITY_ANALYTICS: assigns the 12 `EQ` entries; sets the marker `__JUNE_REFRESH_APPLIED = true`. No longer stamps `DATA_DATES`. | before IRR | `add_reckoner_funds`, `merge_pms_aif_analytics` |
| `Centricity_IRR_Offshore.js` (~L5526) | MASTER after June | sets `irr_low/high` from `IRR` by exact name; removes the 4 `OFF_BASE` funds (name minus "(Inbound)/(Outbound)") and appends `OFFSHORE`; adds "Offshore Funds" to RATIONALE, BENCHMARKS (a string), LIQUIDITY_MAP; marker `__IRR_OFFSHORE_APPLIED = {irr, offshore}` | after June, before SIF | `rename_schemes`, `fold_duplicate_names`; hand edit |
| `Centricity_SIF_Refresh.js` (~L5527) | MASTER after IRR; `window.REFRESH` already assigned | removes every `SIF` / `Equity SIF` / `Hybrid SIF` row and every row whose normalised name (`_normSif`) matches a SIF, appends `SIF` (30); sets `DATA_DATES.sif` **unconditionally**; adds RATIONALE / BENCHMARKS "Hybrid SIF" and LIQUIDITY_MAP "SIF" only if missing; registers `REFRESH.parseSif`; marker `__SIF_REFRESH_APPLIED = {removed, dupRemoved, dupNames, added, total}` | last | `merge_sif_monitor`, `split_sif_add_mld`; hand edit |

Contract points (VERIFIED): the markers are not guards (E6); idempotence comes from filter-then-concat.
Each sibling body is wrapped in `try/catch` and reports a failure only with `console.error`, so
`verify_page` and CI do not see it (A30); `rekey_sif_analytics.js` does fail its gate on such a message.
Tools that execute siblings: `verify_page` and `pptx_layout.test` (all five), `rekey_sif_analytics`
(3-5; reads MASTER back), `fold_index_funds` (3-5, report only), `merge_sif_monitor` (SIF only, with an
empty MASTER). `bake_month` runs none.

### 4.5 Other cross-component contracts

| Contract | Definition | Consumers | Compatibility rule |
|---|---|---|---|
| `applyPmsPerformance()` | defined ~L2975, run ~L3054: for PMS/AIF records, alias (pinned or `null`) else fuzzy match (3 or more shared tokens); copies non-null perf fields onto the record and sets `_pms_source` | page at load; captured by `bake_month` into the baseline; `H.isExpectedReturn` reads `_pms_source` | a change alters both the page and the next bake (section 8) |
| `linkIdcwToGrowth()` | defined ~L1462, run ~L1474: aliases IDCW analytics keys to their `(G)` name when missing | page at load; adds 0 today: every IDCW key's `(G)` name already exists (28 equity and 3 hybrid are identical baked copies; the 3 debt `(G)` entries hold their own data) | as above |
| UI -> helper globals | `__SELECTED_LOGO`, `__EQ_EXCLUDE`, `__DB_EXCLUDE` set by `App` (~L9131-9133) | `loadLogoData`, scoped aggregator defaults | rename all producers and consumers together |
| Upload status | rail handlers treat `{ok, message}` / `{ok:false, error}` and then call `onDataChanged`, which slices `window.MASTER` back into React state | every REFRESH parser | a parser must keep the `ok` / `message` / `error` keys |
| Share link `#p=` | `base64url(JSON {c: corpus, u: unit, r: riskProfile, s: [{n: fund name, p: pct, st?: strategy}]})`; encoder in UI block 1 (~L7306-7320), decoder `loadFromHash` (~L8894); names resolved through `H.resolveFundName` | anyone opening a link | **links already sent must keep decoding**: never rename or drop a key; add keys only as optional |
| Allocation sheet | download: sheet "Allocation", headers `Asset Class, Product Class, Instrument Name, % Total, Amount (Cr.)` plus a TOTAL row; upload: tolerant header match, names via `H.resolveFundName` (~L6604-6660) | owner round-trip | keep the headers readable by the upload |
| Preview server | `.claude/serve.js`: only `site/`, host 127.0.0.1, port `PORT` or 8080; `.claude/launch.json` config "playbook" | `verify-dashboard` skill, browser checks | never serve the repo root (D66) |

---

## 5. Tool CLI contract (D72)

### 5.1 Rules every tool follows (VERIFIED in code and by `tool_inputs.test.js`)

| Rule | Detail |
|---|---|
| Dry run by default | writes only with `--apply`. Exceptions: `verify_page.js` never writes; `build_risk_matrix.py` always writes its fourth argument (a `.js` outside `site/`, else exit 2); `tools/lib/reck_parse.js` run as a command always writes its second argument |
| Exit 0 | every gate passed (a dry run would write; `--apply` wrote) |
| Exit 1 | a gate failed, in the dry run too; `--apply` then writes nothing |
| Exit 2 | usage or input error: unknown flag, stray word, value flag without a value, bad `--as-on`, missing or duplicate input, missing `--html` (or `--sibling` / `--js` / `--dir`); checked before anything is read; prints the `Usage: node tools/...` line. 43 cases in `tools/test/tool_inputs.test.js`; the test also fails when a new top-level tool has no case |
| Gate lines | `GATE <name>: PASS` or `GATE <name>: *** FAIL ...`; `CHECK`, `WARN` and count lines never fail a run. Exceptions: `fold_duplicate_names` omits the `GATE` prefix; a few checks only print (e.g. `merge_pms_aif_analytics.js:191-192` prints `*** unresolved` without failing) |
| Writes | built in memory, written once through `blocklib` (atomic per file; a two-file write is two renames) |
| Owner-only overrides | `--accept-drops <n>` (`merge_reckoner`), `--allow-coverage-drop` (`merge_direct_equity_returns`), `--allow-shrink` (`rekey_sif_analytics`), `--allow-layout-change` (`merge_aif_performance`) |
| Backups | before the first `--apply` of a run, copy the six deploy files to `backups/<YYYY-MM-DD>_pre-<YYYY-MM>-refresh/`; no tool makes the backup itself (`tools/README.md` section 1) |
| Default target | 18 tools default `--html` to `site/index.html` and find siblings beside it; `merge_sif_monitor` (`--sibling`), `update_market_slides` (`--js`), `update_closing_slides` (`--sibling`) default their sibling; **`merge_pms_performance`, `pin_pms_alias`, `merge_reckoner` have no default and exit 2 without `--html`** |
| `--as-on` style | long ("30th September 2026") for performance, analytics, pms, sif, look-through; short ("30 Sep 2026") for riskMatrix and `build_risk_matrix.py` |

Consumers of this contract: the `monthly-update` skill, `docs/MONTHLY_UPDATE_PROCESS.md`, `tools/README.md`
section 3, and every chat that reads gate lines.

### 5.2 Per-tool CLI and writes (USAGE lines read from code, 28-Oct-2026)

| Tool | CLI (`[...]` optional) | Writes with `--apply` |
|---|---|---|
| `rename_schemes.js` | `--monitor "<Regular monitor>.xlsx" [--html p] [--apply]` | MASTER names, six name-keyed stores, `var IRR` |
| `bake_month.js` | `--dir "<month folder>" --as-on "<long>" [--as-on-analytics "<long>"] [--html p] [--apply]` | DIRECT_PERF, MASTER, three analytics stores, MF_BENCHMARK_PERF, DATA_DATES performance + analytics |
| `fill_variant_analytics.js` | `--dir "<month folder>" [--html p] [--apply]` | three analytics stores |
| `rekey_sif_analytics.js` | `[--html p] [--allow-shrink] [--apply]` | three analytics stores |
| `merge_de_universe.js` | `"<Listed Direct Equity_<Month>.xlsx>" [--apply] [--html p]` | MASTER Direct Equity |
| `merge_direct_equity_returns.js` | `"<returns workbook>" [--apply] [--html p] [--allow-coverage-drop]` | MASTER DE `r3m..r5y` |
| `merge_expense_exitload.js` | `--expense x.xlsx --exitload y.xlsx [--apply] [--html p]` (either suffices) | MASTER expense, exit_load; DIRECT_PERF expense |
| `merge_sif_monitor.js` | `"<SIF Monitor_<date>.xlsx>" --as-on "<long>" [--sibling p] [--apply]` | `var SIF` + `DATA_DATES.sif` line |
| `merge_fund_managers.js` | `"<Fund Manager Data_<date>.xlsx>" [--html p] [--apply]` | MASTER fund_mgr |
| `merge_risk_matrix.js` | `"<Fund Risk Ratios ... .xlsx>" --as-on "<short>" [--html p] [--apply]` | RISK_MATRIX (full) + riskMatrix line |
| `update_market_slides.js` | `--slides <dir> [--js p] [--apply]` | `EXTRA_SLIDES.market` |
| `merge_pms_performance.js` | `"<PMS_Scheme_Performance_<Month Year>.xlsx>" --as-on "<long>" --html site/index.html [--apply]` | PMS_PERFORMANCE.pms, PMS_PERF_ALIAS repins, DATA_DATES.pms |
| `pin_pms_alias.js` | `--html site/index.html [--apply]` | PMS_PERF_ALIAS pins |
| `merge_reckoner.js` | `"<Reckoner .pptx>" --html site/index.html [--accept-drops n] [--apply]` | CENTRICITY_SELECT |
| `add_reckoner_funds.js` | `"<Reckoner .pptx>" [--html p] [--usd-inr 88] [--apply]` | MASTER, CENTRICITY_SELECT, PMS_PERF_ALIAS, `var NEW_GIFT` |
| `merge_aif_performance.js` | `"<Reckoner .pptx>" [--html p] [--allow-layout-change] [--apply]` | PMS_PERFORMANCE.aif (+ .benchmarks) |
| `merge_pms_aif_analytics.js` | `"<PMS & AIF Analytics <Month Year>.xlsx>" --as-on "<long>" [--html p] [--sheet name] [--apply]` | EQUITY_ANALYTICS, `var EQ`; never DATA_DATES |
| `merge_bond_list.js` | `"<Bond List.xlsx>" --desk <Invictus or OneDigital> [--sheet "<tab>"] [--apply] [--html p]` | MASTER Bonds of that desk |
| `update_closing_slides.js` | `--dir "<render dir>" [--sibling p] [--apply]` | `EXTRA_SLIDES.disclaimer`, `.thankyou` |
| `merge_analytics.js` | `--hybrid "<xlsx>" --as-on "<long>" [--equity x] [--debt x] [--html p] [--apply]` (any one workbook) | given stores + DATA_DATES.analytics |
| `rebuild_directperf.js` | `"<Direct monitor.xlsx>" [--html p] [--apply]` | DIRECT_PERF (full) |
| `fold_duplicate_names.js` | `--monitor "<monitor>.xlsx" [--html p] [--apply]` | MASTER, six stores, `var IRR` (only when a fold exists) |
| `fold_index_funds.js` | `[--html p] [--apply]` | MASTER |
| `split_sif_add_mld.js` | `[--html p] [--apply]` | MASTER (MLD record if missing), `var SIF` |
| `verify_page.js` | `[site folder]` (no flags) | nothing |
| `build_risk_matrix.py` | `<NAV workbook> <page> "<short label>" <out.js outside site/> [--rf decimal]` | the named `.js` (always) |
| `tools/dev/rehearse.js` | `--old <root> [--old-site dir] [--new root] [--case a,b] [--list] [--keep]` | disposable copies only |
| `tools/dev/render_pptx.ps1` | `-Deck <pptx> -OutDir <dir> [-Width 1600] [-Height 900]`; exit 2 if the deck is missing, the path is 255 characters or more, or OutDir is inside the repo outside `_testdata\` | PNGs + `bounds.jsonl` |
| `tools/dev/check_pptx_bounds.js` | `<bounds.jsonl>`; exit 1 on a problem, 2 on bad input | nothing |

---

## 6. `verify_page.js` output and CI expectations

Output of `node tools/verify_page.js site` on 28-Oct-2026 (exit 0; re-run by the writer, identical to the
CLAUDE.md headline):

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

| Aspect | Contract (VERIFIED, `tools/verify_page.js`) |
|---|---|
| Method | runs every `<script>` of `<dir>/index.html` in document order in a vm with a `window` / `document` shim; local `src` scripts read from disk; CDN (`https?:`) scripts skipped |
| Error filter | hides only `: (React or ReactDOM or Chart or XLSX or PptxGenJS) is not defined` at the end of a message (A23) |
| Exit 1 (`*** VERIFY FAILED: ...`) | `MISSING SIBLING`; duplicate MASTER names; file not ending `</html>`; any other script error; Select keys missing from MASTER (`:90-96`) |
| Exit 2 | the folder has no `index.html` |
| Not checked | any count against an expected value; `DATA_DATES` freshness or `sif` not a dash; top-10 Large Cap; scale or outliers; HYBRID / DEBT / DIRECT_PERF counts (not printed); a sibling's swallowed error (A23, A30, A31; TASK-042) |

CI (`.github/workflows/pages.yml`; VERIFIED): runs on every pull request, every push to `main` and on
manual dispatch; `permissions: contents: read`; actions pinned to full SHAs; `persist-credentials: false`.

| Job / step | Requirement |
|---|---|
| `verify` / Six-file deploy set is present | `test -s site/<f>` for `index.html` and the five siblings |
| `verify` / Unit tests | Node 24; `npm ci --no-audit --no-fund`; `node tools/test/run.js` exits 0 |
| `verify` / Parity gate | `node tools/verify_page.js site` with `pipefail`, then exact-line greps: no `MISSING SIBLING`; `duplicate MASTER names    0`; `file ends </html>         yes`; `script errors (excluding the CDN globals): 0`; the `CENTRICITY_SELECT` line's second field equals the number after `MASTER: ` |
| `publish` | `needs: verify`; only when the event is not a PR and the ref is `refs/heads/main` (a push to `main` or a manual run on `main`); uploads `site/` and deploys to the `github-pages` environment. Merge = publish within minutes; `main` has no branch protection (R9) |

Coupling: the greps match `verify_page.js` labels **including their padding** (four spaces after
"duplicate MASTER names", nine after "file ends </html>"). Any change to those `console.log` labels must
change `pages.yml` in the same PR, or the gate fails (INFERRED from the patterns). Expected values for a
healthy build are the headline counts in CLAUDE.md and `docs/PROJECT_STATE.md`; after a data refresh they
change and are recorded in the update log.

---

## 7. PowerPoint export design system (D82)

Added by PR #26 (`625fdd5`, merge `5d39821`, 22-Oct-2026); VERIFIED absent at the transfer baseline.
Lives inside the EXPORTS IIFE (`const DS = {` ~L4290; `function buildDeck` ~L4615). Rules for callers are
also in [`docs/OPERATING_MANUAL.md`](../OPERATING_MANUAL.md), section "The deck is laid out by
measurement".

### 7.1 The measured-layout API

| Element | Contract |
|---|---|
| `DS` (~L4290) | `W 13.333`, `H 7.5` (LAYOUT_WIDE, inches); content edges `X 0.25`, `R 13.083`, `CW = R - X`; `TOP 1.08` (first content y below the header band and gold strip); `FOOT 7.34` (bottom of the footer zone; gold rule at 7.40); `STAMP_H 0.26`, `GAP 0.14`, `LINE 1.2` (line height = 1.2 x font size), `STAMP_W 3.7`, `PNUM_W 0.45`, `TITLE_W 11.0`; type scale `pt {title 22, titleMin 16, h2 13, note 8.5, stamp 10, pnum 9}`; `CELL_M [0.04, 0.07, 0.04, 0.07]` inches; `BORDER` 0.5 pt BFBFBF |
| `TXT` (~L4310) | `width(s, pt, bold)` in inches from one fixed Cambria advance-width table (unknown characters err wide); `lines(s, w, pt, bold)` greedy word wrap with `SLACK 0.97`, memoised; `longestWord`. Font-independent, so Node tests and the browser agree |
| `applyMaster(slide, title, logoData)` (~L4369) | header band, gold strip, title upper-cased and shrunk a point at a time (not below 16) to fit `TITLE_W`, logo on every slide, gold footer rule, slide number |
| `footerBlock(notes, stamp)` / `drawFooter(slide, fb)` (~L4389-4412) | notes wrap to the width left of the stamp and grow upward from the footer line; the "as on" stamp sits bottom right; returns `bottom`, the lowest y content may reach |
| `contentSlide(title, notes, stamp)` (~L4663, inside `buildDeck`) | the only sanctioned way to start a native content slide; returns `{s, bottom}` |
| `columnWidths(cols, rows, width)` (~L4468) | `cols = [{wrap, min, prefer}]`; returns widths, or `null` when the columns cannot fit at their minimum |
| `rowHeights(rows, colW)` (~L4445) | per-row heights from `TXT.lines` and each cell's margin (default `DS.CELL_M`), honouring spans |
| `planTable(spec)` (~L4538) | `spec = {cols, build(pt) -> {header, body:[{cells, level, label}], sticky}, width, avail, sizes:[pt...], pagePt, leaf, context?, balance?}` -> `{pt, colW, pages:[{rows, heights, height}]}`: the largest size at which the whole table fits `avail`; otherwise pages at `pagePt` with the header repeated, sticky (total) rows on every page, no page ending on a group heading, a "(continued)" row. Never drops a row, column or total |
| `drawTable(slide, page, colW, x, y)` (~L4594) | writes `DS.CELL_M` into every cell without a margin; `rowH = page.heights`; `w = sum(colW)`; `autoPage: false` |
| Layout log `place(slide, kind, x, y, w, h, limit = DS.FOOT)` (~L4633) | a block outside `X..R`, above `TOP` or below its limit is a warning (`console.warn('[pptx layout] ...')`) kept in `window.__PPTX_LAYOUT.warnings` |

### 7.2 What callers may and may not do

| May | May not |
|---|---|
| build rows with `build(pt)`, pass them to `planTable`, draw each page with `drawTable` on a `contentSlide` | fix rows per slide, row heights or note positions |
| place content between `DS.TOP` and the `bottom` that `contentSlide` returns, and log it with `place()` | use pptxgenjs `autoPage` (its slides skip `applyMaster`) or rely on `fit: 'shrink'` |
| continue a table on numbered "(i/n)" slides | draw a table cell without a margin outside `drawTable` (pptxgenjs then adds its own margins and rows outgrow the plan) |
| use `TXT` for any text that must fit | assume table width = `w` (it is `sum(colW)`); note cell `margin` is inches but a text box `margin` is points |
| keep the slide order of PRD 9.2 and the GRAND TOTAL on every Investment Option page | add a seventh deploy file or a new library |

Known deviations (do not copy them): the Construct and Net Asset Allocation tables are drawn with
`slide.addTable` at fixed positions without cell margins (C44); `listTable` analytics tables draw only
`pages[0]`, so a second page would vanish without a warning (C45). TASK-069 fixes both.

### 7.3 Guards

| Guard | Checks | Where | Status 28-Oct-2026 |
|---|---|---|---|
| `tools/test/pptx_layout.test.js` | runs the page and siblings with a recording PptxGenJS; unit test of `planTable` (90-row table paged, header and TOTAL on each page, no orphan heading, "(continued)" rows); `TXT.width` sanity; 7 rule-picked portfolios: no alert, `__PPTX_LAYOUT.warnings` empty, tables and charts inside the frame (table bottom <= `FOOT - STAMP_H` = 7.08), text boxes inside 7.40, each instrument once per table family, GRAND TOTAL on every Investment Option page, numbered continuation titles; every single-tab export for two portfolios | `npm test`, CI | 798 passed, 0 failed (VERIFIED, writer re-run) |
| `tools/dev/render_pptx.ps1` + `check_pptx_bounds.js` | PowerPoint's own layout via COM: off-canvas shapes, a table whose real bottom passes 7.08, text taller than its box | manual, Windows + PowerPoint; renders outside the repo or under `_testdata\` | not run for this package |
| `window.__PPTX_LAYOUT.warnings` | empty after a real export in the browser | manual ([`docs/TESTING.md`](../TESTING.md) section 3) | not run for this package (TASK-064) |

`check_pptx_bounds.js:18` hard-codes `FOOT = 7.08`, which equals `DS.FOOT - DS.STAMP_H`: change both
together (VERIFIED).

---

## 8. Ripple list (what must change together)

| If this changes | Change these in the same PR | Guard that catches a miss |
|---|---|---|
| A block's prefix or literal form | every tool that locates or splices it (section 3.1 callers), `tools/dev/rehearse.js` (compares ten prefixes), `tools/test/blocklib.test.js`, `verify_page.js` if printed | `blocklib.locate` throws; blocklib test |
| MASTER field names or scale | `parseMfMonitor`, `parseMfMonitorDirect`, `tools/lib/direct_perf.js`, the `H.toDirect` key list, the `applyPmsPerformance` field list, `H.isExpectedReturn`, every merge tool that writes the field, export formatting (x100), `parseSif` / `var SIF` rows, `NEW_GIFT` / `OFFSHORE` record shapes | none beyond counts; `financial-data-reviewer` |
| DIRECT_PERF field set or scale | `tools/lib/direct_perf.js`, page `parseMfMonitorDirect`, `merge_expense_exitload`, `H.toDirect` | `rebuild_directperf` scale gates |
| Analytics record shape | `parseAnalytics`, `parsePMSHoldings`, `merge_pms_aif_analytics`, June `var EQ`, `H.hasEqHoldings` / `hasDbHoldings`, the aggregators, `fundRatingBuckets`, overlap, `equityFraction`, `rekey_sif_analytics`, `fill_variant_analytics` | layout test (indirectly) |
| A fund's name (rename) | MASTER `name` / `prev_name` / `prev_names`, the six name-keyed stores and `var IRR` (all via `rename_schemes.js`). **Not covered by `rename_schemes`:** PMS_PERFORMANCE / PMS_PERF_ALIAS keys, PMS_AIF_TERMS, `var SIF`, `NEW_GIFT`, `OFFSHORE`, `var EQ`, `pins.json` | Select canary in `verify_page` / CI; `rename_schemes` gates |
| The Monitor sheet set | `SHEET_MAP` or `REFRESH_ONLY_SHEETS` (and `DEBT_STYLE_SHEETS` if debt-style) in `site/index.html`; `rename_schemes.js` `SHEET_SUB` for a mapped sheet; `parser_refresh_only.test.js` if behaviour changes | `bake_month` "fund rows on unrecognised Monitor sheets" gate |
| `REFRESH` return shape | `bake_month.js:156-171, 216-222`; UI handlers (`ok` / `message` / `error`) | `parser_refresh_only.test`; the bake FAILS if `unclassified` is missing |
| Parser code or load-time code in `index.html` | rehearse with `--old-site` (A27); treat as a data change; keep the marker comment used by `parser_refresh_only.test.js` | tests; rehearsal |
| Sibling order or script tags | keep June -> IRR -> SIF, all after `window.REFRESH = REFRESH` and MASTER; `verify_page`, `pptx_layout.test`, `rekey_sif_analytics`, `fold_index_funds` assume this order; CI six-file list | CI six-file step; `MISSING SIBLING` |
| Folding a sibling into `index.html` (C1, TASK-045) | every tool that reads or writes that sibling (`rename_schemes`, `fold_duplicate_names`, `rekey_sif_analytics`, `merge_sif_monitor`, `merge_pms_aif_analytics`, `add_reckoner_funds`, `split_sif_add_mld`), the 12 legacy SIF rows, the CI file list, `verify_page`, docs | CI |
| `DATA_DATES` key or label style | `blocklib.setDataDate` / `checkAsOn`, the two anchored lines and their regexes (`merge_risk_matrix.js:241`, `merge_sif_monitor.js:125-126`), the 29 page readers, `dataAsOf` | blocklib test; tool gates |
| `verify_page.js` printed labels | `.github/workflows/pages.yml` greps; `docs/TESTING.md` section 1; `docs/PROJECT_STATE.md` | CI fails |
| Tool flags or exit behaviour | `tools/test/tool_inputs.test.js` cases; `tools/README.md` section 3; `docs/MONTHLY_UPDATE_PROCESS.md`; the `monthly-update` skill | `tool_inputs.test` (also fails when a tool has no case) |
| `blocklib` write semantics | all 24 writing tools; `blocklib.test.js`; the backup rule | blocklib test |
| Design-system constants (`DS`, the `TXT` table) | every `buildDeck` slide; `pptx_layout.test.js` frame checks (`DS.X`, `DS.R`, `DS.FOOT`, `DS.STAMP_H`); `check_pptx_bounds.js` `FOOT = 7.08` | layout test; manual render |
| An `H` single predicate | the predicate only; never re-inline it at a consumer | review only (no automated guard) |
| `pins.json` names | all four loaders; the `trailing_space` lists | loaders exit 1 on an edge-space mismatch |
| `EXPORTS` signatures | `App` callers; `pptx_layout.test.js` (`exportPpt`, `exportTabSlide`, `_ds`) | layout test |
| Share-link payload keys (`c, u, r, s[n, p, st]`) | encoder and `loadFromHash` together, plus decoding of links already sent | none |
| CDN versions | forbidden without the owner; `xlsx` must equal `package.json` 0.18.5; SRI hashes on the script tags | none |
| `PMS_BENCHMARK_PERF` source (C41) | whichever source DEC-OPEN-27 picks: `pmsBenchmarkPerfFor` and its three readers, or a tool that writes the static literal; `merge_aif_performance` / `merge_pms_performance` if `.benchmarks` becomes the source | none today |

---

## 9. Open problems in the contracts (tracked elsewhere; do not fix during unrelated work)

| Problem | Contract affected | Tracked in |
|---|---|---|
| PMS/AIF benchmark rows read a static literal no tool writes; `PMS_PERFORMANCE.benchmarks` is write-only | 2.3 (a), (b) | C41; DEC-OPEN-27; TASK-065 |
| 12 RISK_MATRIX keys are unreachable after the SIF sibling runs; `merge_risk_matrix.js` checks keys against the baseline MASTER | 2.2, 2.3 (a) | C42; TASK-066 |
| No `si` bound in the MF bake; one ETF carries 297,765% since inception | 2.3 (a), 2.5 | C43 (P1); TASK-067; DEC-OPEN-07 |
| Two PMS/AIF holdings parsers (page and tool) | 4.2 | A29; TASK-068 |
| A sibling's error is swallowed; CI cannot see it | 2.5, 4.4, 6 | A30; TASK-042 |
| Two CLAUDE.md invariants not enforced by `verify_page` / CI | 2.5, 6 | A31; TASK-042 |
| Two deck tables bypass `drawTable`; `listTable` draws only page 1 | 7.2 | C44, C45; TASK-069 |
| Two Direct-plan builders (page and tool) | 3.2, 4.2 | A7; TASK-039 |
| Performance buckets defined three times | exports, UI | C29; TASK-046 |
| `RISK_MATRIX_BENCH_SD` has no reader; `c` dropped | 2.3 (b) | C10; TASK-053 |
| Sibling markers described as guards in the docs | 4.4 | E6 |

---

## 10. Change history

Add one row per interface change, in the same PR as the change. Rows before version 1 of this file are
reconstructed from git (VERIFIED commits) so the successor knows which contracts are recent.

| Date | Interface | Change | PR / commit | Chat | Consumers updated in the same PR | Evidence |
|---|---|---|---|---|---|---|
| 16-Oct-2026 | `blocklib` API; `verify_page` exit codes | `locate` refuses more than one literal; added `literalOffsets`, `spliceBlocks`, `writeFileAtomic`, `writeFilesAtomic`, `checkAsOn`, `replaceOnce`, `setDataDate` (the handover baseline exported only `locate`, `read`, `writeBlocks`, `matchEnd`); `verify_page` exits 1 on a hard failure | PR #3, `32943e8` | MOD-01 | writing tools; unit tests added | `blocklib.test.js` |
| 19-Oct-2026 | CDN script tags | SRI `integrity` + `crossorigin` on all five | PR #12, merge `792692d` | MOD-01 | - | D77 |
| 19-Oct-2026 | Share-link decoding | names resolved through `H.resolveFundName` (payload unchanged) | PR #12, merge `792692d` | MOD-01 | `loadFromHash` | C14 |
| 19-Oct-2026 | `REFRESH` sheet lists and return shape | `REFRESH_ONLY_SHEETS` (4) added; unknown sheets reported and fail the bake | PR #17, merge `8e187ae` | MOD-01 | `bake_month.js`; `parser_refresh_only.test.js` | D80 |
| 21-Oct-2026 | Tool CLI exit codes | every tool exits 2 on a missing input or `--html` path | PR #19, merge `699978b` | NB-02 | `tool_inputs.test.js` (43 cases) | D72 |
| 21-Oct-2026 | `blocklib.writeFileAtomic` | rename retried on `EPERM` / `EBUSY` / `EACCES`; temp file always removed | PR #20, `5eaf8db` | NB-02 | all writing tools (no API change) | `blocklib.test.js`; R6 |
| 21-Oct-2026 | `tools/dev/rehearse.js` CLI | `--old-site <dir>` seeds the old side from another `site/` | PR #23 (code inside merge commit `18abff3`) | NB-02 | `docs/TESTING.md` | A27 |
| 22-Oct-2026 | `EXPORTS`, deck layout | design system `DS` / `TXT` / `planTable` / `drawTable` / `contentSlide`; `_ds` test hook; `window.__PPTX_LAYOUT`; `*` marker via `H.isExpectedReturn` | PR #26, `625fdd5`, merge `5d39821` | NB-03 | `pptx_layout.test.js`; `check_pptx_bounds.js`; OPERATING_MANUAL | D82, D83 |
| 28-Oct-2026 | (this file) | Version 1 written; no interface changed | merge of `handover/mod-01-to-mod-02-20261028` | MOD-01 | - | baseline `2b2a397` |

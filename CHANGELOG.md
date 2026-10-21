# Changelog

This file lists the notable changes to the Centricity Proposal Playbook: the dashboard in `site/` and its
monthly tools in `tools/`. The newest changes come first. The format loosely follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) (Added, Changed, Removed, Fixed, Security).
Dates are commit dates in IST.

- **New entries.** Each published data update gets a dated entry at the top, for example
  `## 2026-11-14 — Oct-2026 data (data/2026-10)`. The full record for each month (input files, SHA-256
  hashes, tool output) goes in `docs/update-log/<YYYY-MM>_<Mon-YYYY>.md` (e.g. `2026-09_Sep-2026.md`).
- **SHAs.** Entries before the transfer cite the original SHA, labelled "upstream". Our SHAs are different
  because the history was migrated in sanitised form: client names were redacted, and authors, dates and
  messages were kept (see `docs/REPLICATION_REPORT.md`). Both histories hold 74 commits in the same order,
  so the Nth upstream commit is our Nth commit. Run `git log --reverse --oneline handover-baseline` to see
  ours. Every web upload has the subject "Add files via upload", so match those by date and position.
- **Paths.** Entries before the transfer use the paths of their time, when every file sat at the repo
  root. The path map is under the transfer entry below.

---

## 2026-10-21 — Atomic writes ride out a OneDrive lock (PR #20, fix/atomic-rename-retry)

Tool library fix only: no file in `site/` changed.

### Fixed
- `tools/lib/blocklib.js` `writeFileAtomic` (KNOWN_ISSUES R6): a rename of the temp file that fails
  with `EPERM`, `EBUSY` or `EACCES` (OneDrive or an antivirus scan holding the target) is retried
  six times after 100, 200, 400, 800, 1,600 and 3,200 ms, with one `(rename of … blocked …)` line on
  stderr per retry; any other error, or the last failure, is thrown as before. The temp file is now
  also removed when the temp write itself fails (it was left behind).

### Added
- `tools/test/blocklib.test.js`: 6 cases with a simulated `fs.renameSync` / `writeFileSync`
  (recovery after EPERM, EBUSY and EACCES; the pauses are waited; giving up leaves the target and no
  temp file; EXDEV is not retried; a failed temp write is cleaned up). 34 checks; 5 of the new ones
  fail on `main`.

Verification (21-Oct-2026): a real lock (PowerShell holding `index.html` with no sharing for 1.5 s)
gives `EPERM`; the write succeeds after four retries in 1.6 s with no temp file left; `main`'s
`blocklib` throws after 18 ms. `npm test` 4 of 4; `verify_page.js` counts unchanged.

## 2026-10-21 — A missing input or `--html` path exits 2 in every tool (PR #19, fix/missing-input-exit-2)

Tool fix only: no file in `site/` changed.

### Fixed
- The last `ENOENT` crashes (D72). `merge_pms_performance`, `merge_pms_aif_analytics`,
  `merge_reckoner`, `merge_aif_performance` and `add_reckoner_funds` crashed with a stack trace and
  exit 1 on a missing source; `bake_month`, `fill_variant_analytics`, `fold_duplicate_names`,
  `rename_schemes`, `rebuild_directperf`, `pin_pms_alias`, `rekey_sif_analytics` and
  `merge_analytics` did the same on a wrong `--html`. Each now checks its paths before reading and
  exits 2 with `*** source not found` / `*** page not found` and its usage line, so exit 1 means only
  a failed gate. Also `update_closing_slides` (missing `--dir`: exit 1 → 2), `bake_month` (missing
  `--dir`: one clear line instead of the per-file folder error) and `verify_page` (a folder with no
  `index.html`: exit 2 instead of a crash). `merge_direct_equity_returns`, `merge_risk_matrix`,
  `merge_bond_list`, `merge_analytics` and `fill_variant_analytics` now print the usage line with
  their existing exit-2 messages.

### Added
- `tools/test/tool_inputs.test.js`: every tool at the top of `tools/` with a missing source and a bad
  `--html` (43 cases) must exit 2 with a usage line and no stack trace; a new tool without a case
  fails the test. `npm test` now runs 4 files.

### Changed
- Docs: D72, `tools/README.md` §1 items 3 and 9, `docs/MONTHLY_UPDATE_PROCESS.md`,
  `docs/DEVELOPMENT_SETUP.md`, `docs/OPERATING_MANUAL.md` erratum 43, KNOWN_ISSUES "Before the next
  refresh" item 3: the ENOENT exception is gone.

Verification (21-Oct-2026): 43 of 43 input cases exit 2 (23 of 43 on `main`); real dry runs of 14
changed tools on the Sep-2026 inputs (bake, rename, analytics, risk matrix, DE returns, Reckoner
deck) print the same output and exit code as `main`'s tools; `npm test` 4 of 4; `verify_page.js`
counts unchanged.

## 2026-10-21 — Sep-2026 Run 3: September figures for the 214 skipped funds (PR #18, data/2026-09-c19-refresh)

Published on the owner's approval (D81). MASTER only; every other block, `DATA_DATES` and the five
siblings are byte-identical. Record: `docs/update-log/2026-09_Sep-2026.md`, Run 3.

### Fixed
- 214 MASTER funds on the four refresh-only Monitor sheets move from 30-Jun-2026 (one fund: 31-Jul)
  to 30-Sep-2026 figures: Debt ETF 94, International 51, Hybrid Other 44, Solution Oriented 25,
  including the four Income Plus Arbitrage FoFs in Centricity Select (`docs/KNOWN_ISSUES.md` C19).
- `fund_mgr` from the Monitor on 129 of them (10 are new managers after the old one's tenure ended);
  DSP World Gold inception +1 day; Quantum Multi Asset Active FoF expense 0.51% → 0.50%.

### Not changed
- JioBlackRock Nifty 8-13 yr G-Sec Index Fund held at its earlier values until the owner decides C20.
- 12 Debt ETF durations / maturities kept where the Monitor cell is blank (existing rule; D81).

### Verification
- Bake → `fill_variant_analytics` → `rekey_sif_analytics` → `merge_expense_exitload`, every gate PASS;
  `verify_page` counts unchanged. Financial-data review: 3,758 field checks against the Monitor, 0
  mismatches.

## 2026-10-19 — Monitor parser refreshes the four unmapped sheets (C19 code fix; PR #17)

Page code and tools; no data block changed. The September re-run that uses this fix was published on
21-Oct-2026 (PR #18, entry above).

### Fixed
- `site/index.html` `parseMfMonitor` (C19, D80): new `REFRESH_ONLY_SHEETS` (`Debt Oriented34`,
  `Solution Oriented,ETFs,FOFs`, `Solution Oriented - Childrens `, `Hybrid`). Their rows refresh
  existing MASTER records by exact name and never create a record or change taxonomy, name,
  `prev_name` or IRR bands; a name also on a mapped sheet keeps the mapped figures; unmatched rows
  are returned in `skipped`. `Debt Oriented34` is read debt-style. The parser also returns
  `unclassified`, `emptySheets`, `sheetRows` and `monitorNames`, and its message adds
  `· N rows not merged` / `· N rows on unrecognised sheets`. The Section-7 upload shares the parser.

### Added
- `tools/bake_month.js`: the `refresh-only rows not merged` list, a `WARN` per missing or empty
  expected sheet, `CHECK MASTER MF/ETF funds on no sheet of this Monitor` (Sep-2026: 42, report
  only), and `GATE fund rows on unrecognised Monitor sheets`, which also fails on a page without this
  fix.
- `tools/test/parser_refresh_only.test.js`: 18 synthetic checks on the page parser (they fail on
  `main`'s parser); `npm test` now runs 3 files.

### Changed
- `tools/rename_schemes.js`: comment only. The four sheets stay out of `SHEET_SUB` on purpose (tier 3
  would invent a rename).
- Docs: KNOWN_ISSUES C19 restated in distinct funds (215, not 225) with the verification; C15
  widened; C16 rewritten (not a source conflict); new C20 (owner decision), C21, A27; D80.

Verification (19-Oct-2026): byte control of the September chain on scratch copies (`main`'s chain
reproduces the live site byte for byte; the fixed chain changes exactly 215 MASTER records and
nothing else), the six Monitors of 15-May to 30-Sep-2026 through the parser (0 taxonomy or IRR
changes, 0 unclassified rows), `npm test` 3 of 3, `verify_page.js` counts unchanged, browser load
clean. Detail: `docs/KNOWN_ISSUES.md` C19.

## 2026-10-19 — Strict command lines finished; invisible characters (PR #15, fix/tools-cli-cleanup)

Tool fix only: no file in `site/` changed.

### Fixed
- `tools/rename_schemes.js`, `bake_month.js`, `fill_variant_analytics.js`, `merge_analytics.js`,
  `rebuild_directperf.js`, `rekey_sif_analytics.js` (`184939e`, merge `1e48781`): a stray word (an
  unquoted `--as-on 30th September 2026` left `September 2026` behind) or a value flag with no value
  now exits 2 with the usage line, like every other tool (D72).
- The last two literal no-break spaces in tool regexes (`merge_fund_managers.js`,
  `merge_pms_aif_analytics.js`) become `\u00A0` escapes; same behaviour (A25).
- `merge_reckoner.js` no longer requires `fs`, which it never used (F2).

## 2026-10-19 — Rename tool compares the exact inception day (PR #14, fix/rename-exact-inception)

### Changed
- `tools/rename_schemes.js` (`bc37922`, merge `cd6317c`): the one-day inception allowance used during
  the A6 transition is removed; tier 2 compares the exact calendar day (D73). Since PR #13, 2,070 of
  the 2,072 Sep-2026 Monitor rows in MASTER carry the exact inception; the exceptions are
  `docs/KNOWN_ISSUES.md` C16 and one legacy "Mutual Funds" record. Sep dry run unchanged: 8 renames,
  all on the exact day, not applied (owner decision pending).

## 2026-10-19 — Sep-2026 data corrections (PR #13, data/2026-09-corrections)

### Fixed
- `site/index.html`, `site/Centricity_SIF_Refresh.js` (`874cebc`, merge `10cb44c`): the September
  inputs re-applied with the hardened tools and the corrected page parser.
  - MASTER `inception`: 1,851 records +1 day to the true date (Mutual Fund 1,689, Mutual Funds 12,
    ETF 150); SIF sibling: 30 of 30 +1 day (`KNOWN_ISSUES.md` A6).
  - RISK_MATRIX: 33 entries carry `fl` (28 `split`, 5 `lowcorr`), so the page marks their risk
    statistics as unreliable (C3, D74).
  - Everything else byte-identical; `verify_page.js` counts unchanged. Inputs, gates and hashes:
    `docs/update-log/2026-09_Sep-2026.md`, Run 2.

## 2026-10-19 — Page: correct workbook dates, mark unreliable risk stats, pin the CDN (PR #12, fix/page-dates-riskflags-sri)

Page code only; no data block changed. Live files equal `site/` (SHA-256, 19-Oct-2026).

### Fixed
- `site/index.html`, `site/Centricity_SIF_Refresh.js` (`3a75afb`, merge `792692d`):
  - A6: `parseMfMonitor` and the SIF sibling's `parseSif` read Excel dates with `isoDay`, so an
    upload no longer stores inception a day early.
  - C3: `H.riskFlagged(entry)` and `H.RISK_FLAG_NOTE` put a dagger and a footnote on flagged funds in
    the Portfolio Matrix tab and its slide (D74).
  - C14: a shared `#p=` link resolves old names, folds duplicates, and lists in a banner the names it
    could not find and the ones it matched only to a similar name.
  - A5: `H.buildFundIndex` also indexes `prev_names`.
  - E4 comments; "Master Data Editor" heading; Live Output tabs numbered 6.1–6.9 (C13).

### Security
- R3: `integrity` (SHA-384) and `crossorigin="anonymous"` on the five CDN scripts; Chart.js 4.4.0
  from `dist/chart.umd.js`. R2/F3: `noindex, nofollow` meta and a data-URI favicon (D77).

### Removed
- R5: the unused 30-Jun `site/Centricity_Risk_Matrix.js` moved to
  `docs/archive/Centricity_Risk_Matrix_2026-06-30.js` (D78, supersedes D69). The deploy set is still
  six files.

## 2026-10-19 — Monthly tools hardened (PRs #7–#11)

Tool fixes only: no file in `site/` changed. Every tool now follows one contract (D72): exit 0 when
all gates pass, 1 when a gate failed (dry run too; `--apply` then writes nothing), 2 on a usage or
input error (except a missing file in the six PMS/AIF/Reckoner tools, or a mistyped `--html` page in
several others: Node's ENOENT stack trace, exit 1); unknown flags exit 2 (most tools also refuse an
extra argument; the rest followed in PR #15); outputs are built in memory and written atomically
through `tools/lib/blocklib.js`; MASTER is found with `B.locate`; usage strings read
`node tools/<tool>.js`. Issue IDs are in `docs/KNOWN_ISSUES.md`.

### Added
- `tools/lib/dates.js` (`isoDay`, `isoDayFromSerial`; A6), `tools/lib/direct_perf.js` (the one
  DIRECT_PERF builder; A7), `tools/data/pins.json` (the pins shared by `merge_pms_performance.js`,
  `pin_pms_alias.js`, `merge_reckoner.js` and `merge_aif_performance.js`; A18, D75),
  `tools/test/dates.test.js`; `tools/test/run.js` runs every `tools/test/*.test.js` (`npm test`), and
  CI runs `npm ci` and the tests before the parity gate.

### Changed
- **PR #7, package A, MF chain** (`11464c2`, merge `0d4fca3`):
  - `rename_schemes.js`: dates via `isoDay`; `prev_names` history; stale old-name keys dropped and
    listed (A5, D79); only changed blocks written; a temporary one-day inception allowance (removed in
    PR #14).
  - `bake_month.js`, `rebuild_directperf.js`: shared DIRECT_PERF builder; relative gate (95% of the
    current block).
  - `fill_variant_analytics.js`, `merge_analytics.js`, `rekey_sif_analytics.js`: ties listed as
    ambiguous; one file per stem; inline-script errors fail a gate; `--allow-shrink` (A17, A23).
- **PR #8, package B, equity / expense / fund managers** (`e697efe`, merge `455a573`):
  - `merge_direct_equity_returns.js`: per-tenor "lost" gate (fails above 5%), `--allow-coverage-drop`;
    first row wins on a repeated ISIN or name (A10, A11).
  - `merge_expense_exitload.js`: header by content and from the used range; sample fund optional;
    Direct count changed-only (A12).
  - `merge_de_universe.js`, `merge_fund_managers.js`: header found by exact names in the first 30
    rows; fund-manager dates via `isoDay`; ambiguous `prev_name` / normalised names not written (A13,
    A14).
- **PR #9, package C, risk / SIF / Python** (`9658e8e`, merge `71ecbe2`):
  - `merge_risk_matrix.js`: carries `fl` (`split` | `lowcorr`; Sep has 28 + 5; the 12
    Max-Drawdown-only notes are not carried); exact plan-marker list; line-anchored date (C3, A15).
  - `merge_sif_monitor.js`: `--as-on` required; date checked before the single write (A16).
  - `build_risk_matrix.py`: argparse, `--rf`, output only outside `site/`, `prev_name` tier, data
    guards (A22).
- **PR #10, package D, PMS / AIF / Reckoner** (`807cbf1`, merge `79e9759`):
  - Pins moved to `tools/data/pins.json`, read by `merge_pms_performance.js`, `pin_pms_alias.js`,
    `merge_reckoner.js` and `merge_aif_performance.js`; trailing spaces checked (A18, A25).
  - `merge_reckoner.js`: D71's gates and `--accept-drops <n>` kept, plus a fourth, never-waived gate:
    a dropped entry still listed under a deck heading `GRID` does not map (D76).
  - `merge_pms_aif_analytics.js`: still writes no date (D70); sheet found by header (`--sheet`);
    stale look-through listed; page and June sibling written together.
  - `merge_pms_performance.js`: strict `--as-on`; live "still pinned null" list; exit-load year digit
    must stand alone.
  - `merge_aif_performance.js`: layout gate with `--allow-layout-change` (A19).
  - `add_reckoner_funds.js`: each `ADD` slide must name its fund; `--usd-inr`; `--pms` deprecated;
    `NEW_GIFT` only while the deck lists the fund (A20).
- **PR #11, package E, bonds / slides / one-offs** (`f55bac2`, merge `d260cdf`):
  - `merge_bond_list.js`: PR #4's `--desk` / `--sheet` kept; blocklib atomic write with a re-read
    gate; empty sheet refused; cross-desk overlap `CHECK` (report only); `irr_high` < 30%.
  - `update_market_slides.js`, `update_closing_slides.js`: fixed 2001×1125 check; blocklib splice;
    real before/after gates (A21).
  - `split_sif_add_mld.js` (insert MLD only when missing), `fold_duplicate_names.js` (IRR sibling
    required; risk-matrix file optional), `fold_index_funds.js` (reports sibling-borne "Index Fund"
    rows) (A26).

### Evidence
- Every package was rehearsed with `--apply` on disposable copies of `site/`
  (`tools/dev/rehearse.js`, old tools from a `main` worktree) and reviewed independently; outputs
  were identical except for the intended changes (the 8 renames, `fl`, property order in
  DIRECT_PERF). `node tools/verify_page.js site` unchanged after each merge.

## 2026-10-16 — Reckoner merge refuses join failures and mass drops (fix/reckoner-drop-gates)

Tool fix only: no file in `site/` changed, and `node tools/verify_page.js site` prints the same output
as before.

### Fixed
- `tools/merge_reckoner.js` (`2ad7f61`; `docs/KNOWN_ISSUES.md` A4, now closed; decision D71, which
  amends D56). Its only write gate was "every key in MASTER", so a join failure that dropped Select
  funds was written silently (Sep-2026, before the `prev_name` tier: 178 -> 160). New refusal gates,
  which also make the dry run exit 1:
  - a dropped Select entry whose category also holds a deck name that matched nothing (never waived);
  - more than 5% of the current list dropped (8 of 178);
  - a Select category emptied.
  - `--accept-drops <n>` waives the last two only when the run drops exactly n, after the owner has
    read the DROPPED list. `NO_MASTER_NOTE` names count as known gaps. The DROPPED banner no longer
    names the August deck.
- Evidence (August-2026 deck, `monthly-updates/2026-07_Jul-2026/`):
  - Real run on the live site (2 editorial drops): all gates PASS; `tools/dev/rehearse.js` case
    `reckoner-jul` gives identical output with the old and new tools.
  - Join failure simulated by stripping `prev_name` from a copy of the page: the old tool wrote
    178 -> 151 (28 dropped, 5 categories emptied) with exit 0; the new tool refuses on all three
    gates, even with `--accept-drops 28`, and leaves the copy unchanged.
  - Ten extra Select entries the deck lacks (12 drops): refused; accepted with `--accept-drops 12`;
    refused with `--accept-drops 11`. A category the deck no longer fills: refused; accepted with the
    matching count.

## 2026-10-16 — PMS/AIF look-through tool leaves the MF analytics date alone (fix/pms-aif-analytics-date)

Tool fix only: no file in `site/` changed, and `node tools/verify_page.js site` prints the same output
as before.

### Fixed
- `tools/merge_pms_aif_analytics.js` (`71fa58a`; `docs/KNOWN_ISSUES.md` A3, now closed; decision D70).
  It wrote its `--as-on` into `DATA_DATES.analytics`, the "Analytics as on" label of the MF analytics
  shown in the footer, the analytics tabs and both exports. It now writes EQUITY_ANALYTICS and the
  June sibling's `EQ` only. `--as-on` is still required; it is printed for the update log next to
  the unchanged MF analytics date.
  - Rehearsed with `--apply` on copies of `site/` (`tools/dev/rehearse.js`, case
    `pms-aif-analytics-jul`, July-2026 workbook): the old tool's only change to the page was the
    label, 30th September -> 31st July 2026; the new tool leaves all eight files identical.

## 2026-10-16 — Bond List tool names its desk and sheet (fix/bond-list-sheet-desk)

Tool fix only: no file in `site/` changed, and `node tools/verify_page.js site` prints the same output
as before.

### Fixed
- `tools/merge_bond_list.js` (`d48620e`; `docs/KNOWN_ISSUES.md` A1, now closed). It read only the first
  worksheet and labelled every row Invictus from a constant; the Jun-2026 workbook has the OneDigital
  sheet first, and no gate would have caught the swap.
  - `--desk Invictus|OneDigital` is required and must be a Bonds desk already in MASTER.
  - The sheet is `--sheet`, else the only sheet, else the one tab named for the desk. An ambiguous
    workbook, a missing tab, or a tab named for the other desk is refused (exit 2).
  - Row 1 must be the Bond List header; the maturity gate compares with today instead of the year
    2026; the dry run exits 1 when a gate failed.
  - Dry runs on `Bond List_08th June 2026.xlsx`: before, the OneDigital sheet loaded as Invictus
    (Invictus 36 -> 14, all gates PASS). After, no `--desk` is refused; `--desk Invictus` takes
    `Invictus Bonds Options`; `--desk OneDigital` reproduces today's 14 OneDigital rows (two `irr_low`
    values differ only by float noise).

## 2026-10-16 — Shared library, verifier, unit tests and rehearsal harness (PR #3, fix/foundation-blocklib-verify)

Tool fix only: no file in `site/` changed.

### Changed
- `tools/lib/blocklib.js` (`32943e8`, merge `3f3e4b5`): `writeFileAtomic` (temp file + rename) and
  `writeFilesAtomic` (check every output, then write); `locate` refuses a prefix with more than one
  literal; `spliceBlocks` refuses duplicate or overlapping prefixes; new `checkAsOn`, `replaceOnce`
  and `setDataDate` (`docs/KNOWN_ISSUES.md` A8, A9, A24).
- `tools/verify_page.js`: hides only the five CDN globals' exact "is not defined" errors, defaults to
  `site/`, and exits 1 on a hard failure (A23).

### Added
- `tools/test/blocklib.test.js` (28 checks) run by CI; `tools/dev/rehearse.js` and
  `tools/dev/rehearsal_cases.js`, which run a tool chain with `--apply` on two disposable copies of
  `site/` (old and new tools) and diff the results block by block (`docs/TESTING.md`).

## 2026-10-16 — First publish from the new repository

- PR #1 merged as `25e71a3`; Actions run 38866042211 (`verify` + `publish`) succeeded. The live site
  https://productsteamcentricity.github.io/Centricity-Proposal-Playbook/ serves files byte-identical
  to `site/` (SHA-256 of all eight checked) and passes the browser checks.
- Docs (PR #2): publish evidence recorded in `docs/REPLICATION_REPORT.md` §7 and
  `docs/PROJECT_STATE.md`; `docs/KNOWN_ISSUES.md` R7 narrowed to "old site still live".

## 2026-10-16 — Transfer to new owner (setup, no dashboard change)

The repository passed from the outgoing owner to the owner (Centricity Products team, GitHub account
`productsteamcentricity`). The work is on branch `setup/transfer-baseline`: cd05c97, 0f33137, 4600f82,
c71b8e6 and 0afaf69, merged by PR #1 as `25e71a3`. The dashboard did not change. All eight files in `site/` are the same git
blobs as at upstream 72e1f1e, so `node tools/verify_page.js site` prints the same output as the baseline
below. Decisions D60–D69 are recorded in `docs/DECISIONS.md`.

### Added
- (PR #1) Documentation:
  - At the root: `README.md`, a new short `CLAUDE.md` and this `CHANGELOG.md`.
  - In `docs/`: `README.md` (doc map), `PRD.md` (the handover PRD), `ARCHITECTURE.md`,
    `MONTHLY_UPDATE_PROCESS.md`, `INPUT_FILES.md`, `DEVELOPMENT_SETUP.md`, `TESTING.md`, `DEPLOYMENT.md`,
    `DECISIONS.md`, `PROJECT_STATE.md`, `KNOWN_ISSUES.md`, `HANDOVER.md`, `REPLICATION_REPORT.md` and
    `update-log/`.
- (PR #1) Claude Code configuration:
  - `.claude/agents/` holds 8 specialist agents: docs-keeper, financial-data-reviewer,
    implementation-engineer, principal-architect, qa-verifier, release-manager, repo-archaeologist and
    security-reviewer.
  - `.claude/skills/` holds two skills: `monthly-update` and `verify-dashboard`.
- 16-Oct-2026 (4600f82): `.github/workflows/pages.yml`, with two jobs (D63).
  - `verify` runs on every push to `main`, every pull request and every manual run. It first checks
    that the six deploy files exist and are not empty. It then runs the parity gate,
    `tools/verify_page.js site`, which fails on any of these: a missing sibling, a duplicate MASTER
    name, an `index.html` that does not end with `</html>`, a script error, or a Centricity Select key that is missing from MASTER (the rename canary).
  - `publish` runs only after `verify` passes, on a push to `main` or a manual run from `main` (never
    for a pull request). It uploads `site/` with the official Pages actions.
- 16-Oct-2026 (0f33137): workspace scaffolding.
  - Preview server: `.claude/serve.js` and `launch.json`. It serves only `site/`, on 127.0.0.1:8080
    (D66).
  - `package.json` and `package-lock.json` pin `xlsx` 0.18.5, which must match the SheetJS version in the
    page. They also add `npm run verify` and `npm run serve` (D67).
  - `.gitattributes` keeps every text file LF. It also forces textual diffs for
    `tools/rename_schemes.js`, which contains a literal NUL byte.
  - Three local-only folders, gitignored except for their READMEs (D65):
    - `monthly-updates/`, with the inbox `00_INBOX/` and one folder per data month;
    - `backups/`;
    - `handover-archive/`.

### Changed
- 16-Oct-2026 (cd05c97): the repository is reorganised into `site/`, `tools/`, `tools/lib/` and `docs/`
  (D62). Every file move is a git rename.

  | Was (repo root) | Now |
  |---|---|
  | `index.html`, the six `Centricity_*.js` files, `robots.txt` | `site/` |
  | the 25 `*.js` tools, `build_risk_matrix.py` | `tools/` |
  | `blocklib.js`, `pptx.js`, `reck_parse.js`, `reck_narrative.js` | `tools/lib/` |
  | `CLAUDE.md` | `docs/OPERATING_MANUAL.md` (byte-identical at the move; edited in PR #1, see below) |
  | `README.md` (stale since May) | `docs/archive/README_original_2026-05.md` |
  | `Risk_Matrix_Update_Prompt.md`, `PMS_Performance_Update_Prompt.md` | `docs/runbooks/` |
  | `Equity_Debt_Analytics_Build_Prompt.md`, `Portfolio_Review_Build_Prompt.md` | `docs/specs/` |
  | `Issuer_Normalisation_Fix_Prompt.md` (already applied) | `docs/archive/` |

  - The move needed 43 mechanical line edits in 24 tool files. Default targets now resolve to `../site/`
    instead of "beside the script", and library `require`s point at `./lib/`.
  - `index.html` needed no edit, because it loads its siblings by bare relative name.
  - The commit message records that all 25 tools printed identical dry-run output on the Sep-2026 inputs,
    before and after the move.
- (PR #1) `docs/OPERATING_MANUAL.md` gains an "About this file" note at the top, its commands and file
  references now use the new layout, changed owner and location facts are marked "(updated 16-Oct-2026)",
  and a closing *Errata (16-Oct-2026)* section corrects statements known to be stale.
- Hosting (D60, D63):
  - The repository is now `productsteamcentricity/Centricity-Proposal-Playbook` (public).
  - GitHub Pages is built by GitHub Actions from `site/`. Before, it was a branch deploy from `main`,
    root folder. The URL is https://productsteamcentricity.github.io/Centricity-Proposal-Playbook/.
  - The outgoing owner's repository is now the `upstream` remote. It can be fetched but not pushed to.
- Process (D61, D68):
  - Every change goes through branch → PR → `verify` check → merge. A merge to `main` publishes the site.
  - Branch names are `data/<YYYY-MM>`, `feat/`, `fix/`, `docs/` and `chore/`.
  - A monthly update publishes on its own once every automated and manual check passes.
  - Claude still stops and asks on any judgement call: an ambiguous rename, a PMS pin, a Reckoner name
    mismatch, or an input that cannot be identified, competes for a slot, is out of date or from another
    month. An absent input is only reported: its domain keeps its previous date.
- `Centricity_Risk_Matrix.js` stays in `site/` even though nothing loads it (D69). Its content is from
  30-Jun-2026. It is listed in `docs/KNOWN_ISSUES.md`.

### Fixed
- (PR #1) Documentation:
  - Corrected the in-force fund-manager state: the Sep-2026 bake had replaced the 31-Aug roster with the
    Monitor's first-named manager (PRD §11.3 said 31-Aug).
  - Replaced the sample-portfolio figures in `docs/specs/Portfolio_Review_Build_Prompt.md` with
    placeholders (privacy). Earlier commits keep the de-identified figures (names redacted, D64).

### Security
- Sanitised history migration (D64). All 74 upstream commits were rewritten with `git filter-branch`.
  - In every commit, two client names and one sample file name were redacted from
    `Portfolio_Review_Build_Prompt.md` (now in `docs/specs/`).
  - Authors, dates and messages did not change.
  - Every SHA changed. The signatures on GitHub web uploads cannot survive a rewrite.
  - Upstream tip 72e1f1e is our 862e40b, tagged `handover-baseline`.
- The preview server binds to 127.0.0.1 and serves only `site/`, so the workbooks in `monthly-updates/`
  can never be reached over the network. The PRD's version served the whole folder on all interfaces
  (D66).
- `.gitignore` now also excludes `*.zip` and `*.7z`. Source workbooks (`*.xlsx` and similar) were
  already excluded.

---

## Baseline — data as on 30-Sep-2026 (handover-baseline, upstream 72e1f1e / ours 862e40b)

`node tools/verify_page.js site`, run on 16-Oct-2026, reports these counts after all five siblings have
run (the `index.html` size is the file size; `verify_page.js` does not print it):

| Check | Result |
|---|---|
| MASTER (effective records) | 7,682 |
| CENTRICITY_SELECT | 178. All 178 keys are in MASTER; 133 have a rationale, 46 have risk ratios, 51 have details |
| PMS_PERFORMANCE | 692 PMS, 12 AIF, 4 benchmarks |
| PMS_PERF_ALIAS | 27 pins, of which 4 are null |
| MASTER PMS funds with performance | 23 of 27 |
| EQUITY_ANALYTICS | 1,205 |
| RISK_MATRIX | 1,088 |
| PMS_AIF_TERMS | 73 |
| EXTRA_SLIDES | 6 keys |
| Duplicate MASTER names | 0 |
| `index.html` | 12,827,311 B; ends with `</html>` |
| Script errors | 0 |

`DATA_DATES` holds these values:

| Key | Value |
|---|---|
| `performance` | 30th September 2026 |
| `analytics` | 30th September 2026 |
| `sif` | 30th September 2026 |
| `pms` | 31st August 2026 |
| `riskMatrix` | 30 Sep 2026 |

Other inputs in force, taken from the commits below:

| Data | As on | Source commit |
|---|---|---|
| Centricity Select | the September 2026 Reckoner | upstream b00cb2d |
| AIF performance and benchmarks | 31-Aug-2026 | upstream ac4347b |
| Listed Direct Equity returns | 30-Sep-2026 | upstream 261cd07 |
| Market Update | the re-issued October 2026 deck | upstream 140257c |
| PMS/AIF look-through | 31-Jul-2026 | upstream b954ffc |
| Bonds > Invictus | 06-Aug-2026 | upstream 6c0a751 |

The *Refresh workflows* table in `docs/OPERATING_MANUAL.md` lists the rest. One example: the SIF
look-through analytics are still as on 31-Aug-2026, because the September workbooks carry no SIFs.

---

## October 2026 (upstream, 6 commits)

### Changed
- 14-Oct-2026 (upstream 261cd07): Listed Direct Equity returns (3M to 5Y) are now as on 30-Sep-2026, from
  a re-issued returns file. 4,615 of 5,380 stocks matched: 4,263 by ISIN and 352 by name.
- 13-Oct-2026 (upstream 140257c): the Market Update now uses the re-issued October 2026 deck. That deck
  rewrites the "Overall Market Update" slide with the September outlook. Slides 1 to 5 did not change.
- 13-Oct-2026 (upstream 828d51e): RISK_MATRIX is now as on 30-Sep-2026. This refresh had been built
  earlier but never pushed.
- 13-Oct-2026 (upstream ba8baa5): `CLAUDE.md` records the push route. It also notes that the two
  pre-push blockers are resolved.
- 13-Oct-2026 (upstream 489ee33): the September 2026 refresh.
  - Performance, the Direct overlay, analytics and SIF are now as on 30-Sep-2026.
  - The universe grew from 7,652 to 7,682: 19 MF launches, 10 new listed stocks and 1 new SIF.
  - Three listed-company renames were folded in place, with `prev_name` kept.
  - The Market Update now has 6 slides from the October 2026 deck.

### Fixed
- 14-Oct-2026 (upstream 72e1f1e): the Credit Rating Distribution chart.
  - It used to bucket only each fund's top-20 holdings, so a diversified fund summed to about 43%. It now
    reads the full per-fund rating map (`DEBT_ANALYTICS.rating` and `HYBRID_ANALYTICS.db_rating`) and
    normalises to exactly 100%.
  - Each bucket has a fixed colour, on screen and in the PPT.
  - A2+(SO) now lands in AA & Below, not Others.
- 14-Oct-2026 (upstream 261cd07): `merge_direct_equity_returns.js` now finds the header row under the
  blank banner rows. It also refuses to write when a return column is completely empty. The first copy of
  that month's file had a blank 5Y column.
- 13-Oct-2026 (upstream 828d51e): `parseSif` treated any return below 1 as a decimal already, so SIF
  returns between -1% and +1% showed 100 times too large. It now always divides Monitor percents by 100.
  19 values were corrected.
- 13-Oct-2026 (upstream 489ee33): two tools now find their input more reliably.
  - `bake_month.js` matches "Daily MF monitor_<date>" and requires a real file.
  - `merge_expense_exitload.js` finds the header row under the banner rows, and refuses to write when
    nothing joins.

## September 2026 (upstream, 8 commits)

### Added
- 18-Sep-2026 (upstream 8e49d3a): `merge_risk_matrix.js`, a second route into RISK_MATRIX.
  - It reads the ready-made "Fund Risk Ratios & 3Y Rolling" workbook.
  - It was added because the machine had no Python. `build_risk_matrix.py` is still the authority.
- 17-Sep-2026 (upstream 1ce60e9): four tools and a new card.
  - `rename_schemes.js` was added after SEBI renamed 217 schemes. It identifies a scheme by inception date
    and AMC, then re-keys every name-keyed store, including the IRR sibling.
  - `merge_sif_monitor.js`, `merge_fund_managers.js` and `fold_duplicate_names.js`.
  - A SIF Monitor card in Section 7, with an as-on picker.

### Changed
- 28-Sep-2026 (upstream b00cb2d): Centricity Select was rebuilt from the September 2026 Reckoner. It
  still has 178 entries (2 added, 2 removed). The NARRATIVE was re-read from the deck.
- 28-Sep-2026 (upstream ac4347b): PMS performance (692 schemes) and AIF performance and benchmarks (12 and
  4) are now as on 31-Aug-2026. A Reckoner deck is named for the month it ships in, not the month it
  reports.
- 18-Sep-2026 (upstream 8e49d3a): RISK_MATRIX is now as on 31-Aug-2026. It covers 1,088 funds, and the
  number with metrics rose from 917 to 958.
- 17-Sep-2026 (upstream 1ce60e9): the August 2026 refresh.
  - The universe grew from 7,608 to 7,652.
  - SIF performance is baked into the SIF sibling, so `DATA_DATES.sif` shows a real date for the first
    time.
  - `bake_month.js` matches the monitor file on the stem of its name.
  - The Market Update is now the September 2026 edition (5 slides).
  - `Centricity_IRR_Offshore.js` was re-keyed by the rename. This is the only time it has changed since it
    was added.
- 03-Sep-2026 (upstream bc76e4c): credit ratings now use seven buckets. "Others" (equity, derivatives,
  REITs/InvITs) is split out of "Unrated".
- 03-Sep-2026 (upstream 2f74506): a fixed six-bucket credit-rating vocabulary (`H.creditBucket`). Each of
  the 27 raw rating strings maps to exactly one bucket.
- 03-Sep-2026 (upstream 7be34c7): PMS performance now comes from the 03-Sep workbook, and the scheme count
  rose from 690 to 692. One alias pin (Emkay) was re-pointed.

### Removed
- 18-Sep-2026 (upstream 8e49d3a): the RISK_MATRIX field `c` (3Y CAGR). The new workbook does not have it
  and nothing reads it, so it was dropped rather than kept with a stale value.

### Fixed
- 28-Sep-2026 (upstream b00cb2d): in `merge_reckoner.js`, `resolve()` now checks `prev_name`. Without that
  check the run had reported a drop from 178 to 160. It also handles PIN targets that were themselves
  renamed.
- 28-Sep-2026 (upstream ac4347b): the Emkay pin in `pin_pms_alias.js`. The tool's `fail` flag is sticky,
  so one stale pin had been blocking all five pins.
- 08-Sep-2026 (upstream d1eaa04): the overlap matrix.
  - It is now symmetric: 0 asymmetric pairs out of 124,750.
  - It drops rows that are not stocks, such as net current assets, T-bills, gilts and options.
  - It is capped at 100%.
- 03-Sep-2026 (upstream 7be34c7): `merge_pms_performance.js` now finds the PMS sheet by its header, not by
  its tab name. A renamed tab had made it read zero schemes. When a scheme appears twice, it now keeps the
  richer row.

## August 2026 (upstream, 17 commits)

### Added
- 25-Aug-2026 (upstream 6a95017): new closing slides and logo branding.
  - A Disclaimer slide, and a replacement Thank You slide.
  - `stampLogo()`, with `LOGO_HEADER` and `LOGO_CLOSING`, so the selected logo appears on every slide.
  - `update_closing_slides.js`.
- 25-Aug-2026 (upstream 1260ce6): `H.isSelfDescribingDebt`. MLDs get their own "MLD" sector bucket and
  default to the rating "Unrated".
- 25-Aug-2026 (upstream c2b9ad1): a new MLD product class under Debt, with its first instrument, and
  `split_sif_add_mld.js`. The universe grew from 7,607 to 7,608.
- 25-Aug-2026 (upstream b1ba035): `fold_index_funds.js`.
- 21-Aug-2026 (upstream d969b3f): `build_risk_matrix.py` and the five `*_Prompt.md` runbooks and specs.
  They are now in `docs/runbooks/`, `docs/specs/` and `docs/archive/`. `Dashboard_Build_Prompt.md` was
  left out on purpose.
- 21-Aug-2026 (upstream 2cbaf13): `merge_aif_performance.js`, which parses AIF performance from the AIF
  slide of the Reckoner deck. The AIF count rose from 11 to 12, and the benchmarks gained a 2Y column.
- 20-Aug-2026 (upstream 6f30601): `merge_pms_aif_analytics.js`.
- 20-Aug-2026 (upstream d55acea): new tools, libraries and instruments.
  - Tools: `merge_reckoner.js`, `merge_pms_performance.js`, `pin_pms_alias.js`, `add_reckoner_funds.js`,
    `merge_analytics.js`, `rekey_sif_analytics.js` and `verify_page.js`.
  - Libraries: `blocklib.js`, `reck_parse.js`, `reck_narrative.js` and `pptx.js`.
  - Four instruments that the Reckoner recommends but MASTER did not have.
- 18-Aug-2026 (upstream 05c88ec): the 1Y, 3Y and 5Y returns in Section 4 can now be edited. An edit is
  stored on the selection as `r1yOv`, `r3yOv` or `r5yOv`, and never on MASTER.
- 13-Aug-2026 (upstream 351cd6a): `update_market_slides.js`.
- 13-Aug-2026 (upstream 43124a7): `rebuild_directperf.js`.
- 13-Aug-2026 (upstream 4e67438): a Regular/Direct selector on the MF Monitor card
  (`REFRESH.parseMfMonitorDirect`). Also the tools `bake_month.js`, `fill_variant_analytics.js`,
  `merge_de_universe.js` and `merge_expense_exitload.js`.
- 06-Aug-2026 (upstream 6c0a751): `merge_bond_list.js`. It runs as a dry run by default and refuses to
  write unless its checks pass.

### Changed
- 25-Aug-2026 (upstream c2b9ad1): SIF splits into Equity SIF (15) and Hybrid SIF (13).
  - The split is written only into `Centricity_SIF_Refresh.js`.
  - The 12 legacy "SIF" rows in `index.html` were left in place on purpose, because the sibling's delete
    filter finds them by that product class.
  - Adds `H.isEquitySIF`. SIF matching becomes `/SIF$/`.
- 25-Aug-2026 (upstream b1ba035): Index Fund becomes a sub-category of Mutual Fund.
  - 522 records moved, and Mutual Fund grew from 1,222 to 1,744.
  - `SHEET_MAP['Index']`, `H.fofUnderlyingName` and `PC_ORDER` were updated.
  - `displayPC` is now a plain accessor.
- 21-Aug-2026 (upstream d969b3f): `Centricity_Risk_Matrix.js` was refreshed. This was housekeeping only,
  because nothing loads the file.
- 21-Aug-2026 (upstream 2cbaf13): AIF performance is now as on 31-Jul-2026. The analytics fund list is
  now a collapsed drop box.
- 20-Aug-2026 (upstream b954ffc): the PMS/AIF look-through was re-run on the re-issued July workbook (15
  schemes). Coverage rose from 16 to 17 of 55.
- 20-Aug-2026 (upstream 6f30601): the PMS/AIF equity look-through is now as on 31-Jul-2026, and coverage
  rose from 13 to 16 of 55. It is written to both `index.html` and `Centricity_June_Refresh.js`, because
  the sibling re-assigns its own records on every page load.
- 20-Aug-2026 (upstream d55acea): Centricity Select was rebuilt from the August 2026 Reckoner, growing from
  149 to 178 entries. `PMS_PERFORMANCE.pms` rose from 314 to 690, as on 31-Jul-2026. The hybrid analytics
  were re-baked.
- 19-Aug-2026 (upstream 4a3e71f): a three-column workspace.
  - A collapsible left rail holds Data Refresh.
  - A navigator on the right jumps between sections.
  - A liquid-glass surface. No palette token changed.
- 13-Aug-2026 (upstream 351cd6a): the Market Update moved to the August 2026 edition: 5 slides,
  re-encoded at JPEG quality 82. The source deck was renamed upstream to
  "Market Update Slide_<Month Year>.pptx".
- 13-Aug-2026 (upstream 4e67438): the July 2026 data was baked in.
  - The universe grew from 7,482 to 7,603.
  - Analytics counts are 1,153 equity, 246 hybrid and 495 debt.
  - `DIRECT_PERF` holds 1,676 records.
- 06-Aug-2026 (upstream 6c0a751): Bonds > Invictus was refreshed from the 06-Aug-2026 Bond List. It grew
  from 14 to 36 bonds, and the universe grew from 7,460 to 7,482.

### Removed
- 13-Aug-2026 (upstream 4e67438): the `DATA_DATES.analytics = "30th June 2026"` stamp in
  `Centricity_June_Refresh.js`. It had been reverting every analytics bake on page load.

### Fixed
- 27-Aug-2026 (upstream ac8bde2): the taxonomy filter returned nothing for names that contain "/", such as
  REIT/InvIT and Value / Contra.
- 25-Aug-2026 (upstream 6a95017): `(ES.market||[]).forEach(imgSlide)` passed the array index in as the
  logo box. As a result, market slides 2 to 5 lost the logo.
- 20-Aug-2026 (upstream 6f30601): `blocklib.writeBlocks` now derives its `</html>` guard from the input
  file, so it also works on the `.js` siblings.
- 20-Aug-2026 (upstream d55acea): SIF funds were missing from analytics. The fix is `H.isHybridScheme`
  plus re-keying through `sif_raw`.
- 19-Aug-2026 (upstream 4a3e71f): layout and SIF fixes.
  - Layout: the Live Output tabs overlapped; the grid broke when the rail was collapsed; the reopen tab had
    no gutter; and a `.shared-ba` selector was truncated.
  - SIF: "Since Inception" showed epoch milliseconds, because an "Inception Date" column had been mapped
    as a return.
- 18-Aug-2026 (upstream 05c88ec): the evaluation order is now `applyOverrides(applyPlanSelected(...))`, so
  a hand-edited return is kept when the plan is switched to Direct.
- 13-Aug-2026 (upstream b61f115): debt issuer names now collapse properly, including T-Bills and SDLs.
  2,617 raw strings became 555 issuers.
- 13-Aug-2026 (upstream 43124a7): Direct-plan fixes.
  - Market-cap values in Direct mode showed 100 times too large.
  - The Direct parser used the wrong column names. YTM coverage went from 0 to 432 funds once this was
    fixed.
  - The parser never read the "Others" bucket.
  - It merged the market-cap split non-atomically.
- 06-Aug-2026 (upstream 6c0a751): bond fixes.
  - Duplicate bonds are now deduped on issuer plus maturity.
  - The 1930/2030 century typo is handled.
  - Sov and SOV are normalised to one value.

## July 2026 (upstream, 9 commits)

### Added
- 31-Jul-2026 (upstream be01d9f): `CLAUDE.md` (now `docs/OPERATING_MANUAL.md`) and
  `merge_direct_equity_returns.js`. The tool has a dry-run mode, a top-10 "Large Cap" regression gate and
  a `</html>` guard.
- 31-Jul-2026 (upstream c308f8d): the missing SIF sibling and three features.
  - `Centricity_SIF_Refresh.js`, which `index.html` had referenced since 15-Jul but which was never
    committed. Until then the live site got a 404 for it and silently fell back to 12 legacy SIF rows
    instead of 28.
  - An "as on" date picker on the MF Monitor card.
  - Direct Equity returns from 3M to 5Y, joined by ISIN with a fallback on name. A new "Listed Direct
    Equity" bucket shows them in the Performance Sheet.
  - A round-trip for the Allocation: download it, edit it, upload it back.
- 16-Jul-2026 (upstream cfeec6e): `Centricity_Risk_Matrix.js` and its script tag.
- 15-Jul-2026 (upstream 47699c4): "June Updates" (`index.html` grew by 255 KB). This commit also added a
  script tag for `Centricity_SIF_Refresh.js`, but the file itself was not committed until 31-Jul.

### Changed
- 31-Jul-2026 (upstream 174ba4e): `merge_direct_equity_returns.js` takes the workbook as its first
  argument. `--html` overrides the target. A bad path exits with code 2.
- 31-Jul-2026 (upstream c308f8d): the analytics drop funds that have no holdings, and list the excluded
  names under the fund chips.
- 28-Jul-2026 (upstream f41000d, 7c66859): two updates whose subjects are only "updatessss" and "updated
  extraaa". `Centricity_ExtraSlides.js` grew to 1,765,325 B.
- 24-Jul-2026 (upstream 33819cc): RISK_MATRIX, RISK_MATRIX_BENCH_SD and PMS_PERF_ALIAS were baked inline
  into `index.html`. The script tag for `Centricity_Risk_Matrix.js` was removed. The file is still tracked
  but has not been loaded since.
- 16-Jul-2026 (upstream 088d4b4): an update to `index.html` whose subject is only "updateddd".

### Removed
- 31-Jul-2026 (upstream c308f8d): two analytics fallbacks that invented figures. One was a fund-level
  market-cap guess. The other was a flat 80% AAA / 20% SOV credit profile.

### Fixed
- 31-Jul-2026 (upstream 174ba4e): `be01d9f` had hard-coded absolute paths from the admin's machine, which
  were then published in a public repo. They are replaced by arguments.
- 31-Jul-2026 (upstream c308f8d): `.gitignore`. The `*.bak` pattern missed about 48 dated snapshots
  (roughly 250 MB). New patterns: `*.bak_*`, `*.bak[0-9]*`, `*.broken*`, `.claude/`, `node_modules/` and
  `_testdata/`.

## June 2026 (upstream, 19 commits: 18 GitHub web uploads, then the first local commit)

### Added
- 24-Jun-2026 (upstream e8fd61c): `Centricity_June_Refresh.js` and `Centricity_PMS_AIF_Terms.js`.
  `Centricity_PMS_AIF_Terms.js` has not been modified since. This was the last web-UI upload.
- 23-Jun-2026 (upstream d05a7aa): `Centricity_IRR_Offshore.js`.
- 23-Jun-2026 (upstream e6f2fce, 6cce3b2): script tags for `Centricity_PMS_AIF_Terms.js`,
  `Centricity_June_Refresh.js` and `Centricity_IRR_Offshore.js`. The tags were committed before the files.
- 01-Jun-2026 (upstream 2730ed4): `Centricity_ExtraSlides.js` (1,670,306 B).

### Changed
- 26-Jun-2026 (upstream 95ef3db): "Overlap matrix v2", the first local (CLI) commit.
  - `index.html` grew by 2.99 MB: `EQUITY_ANALYTICS` by 2.37 MB and `HYBRID_ANALYTICS` by 609 KB.
  - `Centricity_June_Refresh.js` grew from 44,416 to 51,944 B.
- 22-Jun-2026 (upstream 32de608): "Liquidity Updated".
- 18–19-Jun-2026 (upstream 12c4f12, ee06ec4, 37e2e85): updates, including "updated PMS & AIF_June".
- 17-Jun-2026 (upstream 9bd9ccb): `Centricity_ExtraSlides.js` shrank from 1,702,394 to 1,351,522 B. No
  reason was recorded.
- 12-Jun-2026 (upstream 81b9c78): "Monthly Updates".
  - Smaller blocks: `MASTER` by 115 KB and `DIRECT_PERF` by 41 KB.
  - Larger blocks: `EQUITY_ANALYTICS` by 27 KB and `HYBRID_ANALYTICS` by 14 KB.
- 09-Jun-2026 (upstream cef8142): "GIFT CITY Updated & Bond List Updated".
- 01–02-Jun-2026 (upstream 427540e, 515b5f7, 8f5c97e): the bond list update of 01-Jun, and allocation
  updates.
- 01-Jun-2026 (upstream e75fbd9, 53c213f): slide updates. `Centricity_ExtraSlides.js` grew to
  1,702,394 B.
- 01-Jun-2026 (upstream 7bcd9a1): "Market Slides Update". This is an empty commit: its tree is the same as
  its parent's.

## May 2026 (upstream, 15 commits, all GitHub web uploads)

### Added
- 31-May-2026 (upstream da5023f): the first `<script src="Centricity_ExtraSlides.js">` tag. The file
  itself arrived the next day.
- 31-May-2026 (upstream 64f738a): `window.DIRECT_PERF` and `window.LOGO_PRESETS`.
- 20-May-2026 (upstream 981ff6d): "Updated Write Ups". This is the first version with
  `window.DATA_DATES`.
- 19-May-2026 (upstream 8e7a72f): `.gitignore`.
- 19-May-2026 (upstream 89d94a9): the first upload: `README.md`, `index.html` (5,429,733 B) and
  `robots.txt`. The CDN libraries have not changed since (`site/index.html:1224-1228`):
  - React and ReactDOM 18.3.1, from unpkg;
  - Chart.js 4.4.0, xlsx 0.18.5 and pptxgenjs 3.12.0, from jsdelivr.

### Changed
All of these changed `index.html` only.
- 22-May-2026 (upstream 28b1238): "Direct Equity Uploaded April". `MASTER` grew by 1.06 MB.
- 21-May-2026 (upstream f5e05fe): "Global Funds Update April". `MASTER` shrank by 36.6 KB.
- 20-May-2026 (upstream 3cf359a): "Name Matching".
- 20-May-2026 (upstream 597071b): the bond list update of 20-May-2026.
- 20-May-2026 (upstream 03dd192): "Index Funds included in analytics".
- 19–20-May-2026 (upstream 978ff2d, 4382cdc, 6271400, 23f40e5): the April PMS analytics, and the PMS & AIF
  performance. The last of these commits shrank `index.html` by 137,373 B, and the single-line
  `PMS_PERFORMANCE` block disappeared. The block was probably restructured; this is an inference, not a
  recorded fact.
- 19-May-2026 (upstream 28b3ec4): an upload with no description.

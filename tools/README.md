# tools/ — operator's index

Every tool that changes or checks the dashboard data: what it reads, what it writes, what to read
before you let it write, and the exact command. Checked against the code in `tools/` on 19-Oct-2026
(`main` `1e48781`, after the tool fixes of PRs #3–#15); `bake_month.js`, `rename_schemes.js` and the
tests re-checked the same day with the C19 parser change (refresh-only Monitor sheets, D80).

- The full monthly procedure, with the checks around the tools: `docs/MONTHLY_UPDATE_PROCESS.md`.
- What each input file looks like: `docs/INPUT_FILES.md`.
- Background and history behind each rule: `docs/OPERATING_MANUAL.md`.
- Defects in the tools themselves: [`docs/KNOWN_ISSUES.md`](../docs/KNOWN_ISSUES.md).

---

## 1. Rules that apply to every tool

1. **Run from the repository root.** Every path you pass is resolved against the current directory:
   a workbook, `--dir`, `--html site/index.html`, and `site` for `verify_page.js`. Install the one
   dependency once per machine with `npm ci`. It puts SheetJS `xlsx` 0.18.5 into the root
   `node_modules/`, and the tools find it from `tools/`. You need Node 18 or later (`package.json`);
   CI uses Node 24.
2. **Dry run is the default.** A tool writes only when `--apply` is on the command line. There are
   three exceptions:
   - `verify_page.js` never writes.
   - `build_risk_matrix.py` has no dry run. It always writes the file named by its 4th argument,
     which must be a `.js` path outside `site/` (it refuses anything else, exit 2).
   - `tools/lib/reck_parse.js`, run as a command, always writes its 2nd argument.
3. **Exit codes (D72).** Every tool exits:
   - **0** — every gate passed (a dry run would write; `--apply` wrote);
   - **1** — a gate failed. This holds for the dry run too, and `--apply` then writes nothing.
     **A dry run that exits 1 means stop and read the gates;**
   - **2** — a usage or input error: an unknown flag, an extra argument, a missing value, a bad
     `--as-on` label, two files competing for one input, a missing input file or folder, or a
     missing `--html` page (or `--sibling` / `--js` file).

   Every tool checks its input paths before it reads anything, so a typo or an invisible character
   in a path prints `*** source not found: …` or `*** page not found: …` and the usage line, and
   exits 2 (since 21-Oct-2026, PR #19; before that, a missing input in the Reckoner-cycle tools and
   a missing `--html` page in several others crashed with `ENOENT` and exited 1).

   Gate lines read `GATE <name>: PASS` or `GATE <name>: *** FAIL …` (a few print `***` and a reason
   without the word FAIL). Lines marked `CHECK` or `WARN`, and gates that only print counts, never
   fail a run, so read the whole dry run even when it exits 0. Any `*** AMBIGUOUS` is a stop for the
   owner. Override flags exist for owner decisions only: `--accept-drops <n>` (Reckoner),
   `--allow-coverage-drop` (DE returns), `--allow-shrink` (SIF re-key), `--allow-layout-change` (AIF).
4. **Back up the six deploy files before the first `--apply` of a run.** They go to
   `backups/<YYYY-MM-DD>_pre-<YYYY-MM>-refresh/` (§2 step 0; `backups/README.md`). Every write to the
   deploy files goes through `tools/lib/blocklib.js`: a temp file beside the target, then a rename,
   so a crash cannot truncate a file. A tool that writes two files (`rename_schemes`, `fold_duplicate_names`,
   `split_sif_add_mld`, `add_reckoner_funds`, `merge_pms_aif_analytics`) checks both outputs first
   and then renames one after the other; that is not one transaction. A rename blocked by a OneDrive
   sync is retried for up to 6.3 s. If a write still fails (for example `EPERM` while OneDrive syncs, `docs/KNOWN_ISSUES.md` R6), check the files against the backup and
   re-run the step; to undo, `cp backups/<snapshot>/* site/`. Do not patch forward.
5. **Default targets are in `site/`.**
   - 18 tools default `--html` to `site/index.html` (`path.join(__dirname,'..','site','index.html')`)
     and find the sibling files they touch beside it.
   - Three tools default their own file in `site/`: `merge_sif_monitor.js` (`--sibling`),
     `update_market_slides.js` (`--js`) and `update_closing_slides.js` (`--sibling`).
   - **Three tools have no default and must be given `--html site/index.html`:**
     `merge_pms_performance.js`, `pin_pms_alias.js` and `merge_reckoner.js`.
6. **Verify with `node tools/verify_page.js site`** (or `npm run verify`). Run it at the end of
   every run, and after any single `--apply` you are unsure of. It exits 1 (`*** VERIFY FAILED`) on
   any of the hard checks below except the dates; it compares no counts, so read its output:
   - `duplicate MASTER names    0`
   - `file ends </html>         yes`
   - `script errors (excluding the CDN globals): 0`
   - no `MISSING SIBLING` line
   - `CENTRICITY_SELECT  N   (keys present in MASTER: N)`, with both numbers equal (the rename canary)
   - `DATA_DATES` showing this month's dates

   Explain every count that moved. The GitHub Actions `verify` job enforces every check above
   except the dates before it publishes (`.github/workflows/pages.yml`).
7. **`--as-on` labels must be plain dates** (`blocklib.checkAsOn`); anything else exits 2:
   - `31st October 2026` for performance, analytics, pms, sif and the PMS/AIF look-through;
   - `31 Oct 2026` for riskMatrix (and `build_risk_matrix.py`).

   `merge_sif_monitor.js` requires `--as-on`. Dates are set only inside `window.DATA_DATES = {…}`
   (or on the anchored `DATA_DATES.riskMatrix` / `DATA_DATES.sif` line), exactly once.
8. **Stop and ask the owner (D61)** when you meet:
   - an ambiguous rename, or a rename that is not obviously the same fund;
   - a PMS pin (performance and Reckoner pins are edited only in `tools/data/pins.json`; the
     look-through name map is `PIN` in `merge_pms_aif_analytics.js`);
   - a Reckoner mismatch;
   - a universe change (for example `add_reckoner_funds.js`);
   - an input that cannot be identified, competes with another file for one slot, is older than
     the live data or belongs to another month;
   - any gate failure (a dry run that exits 1), or a reason to use an override flag.

   Never `--apply` past one. An input that is simply absent is not a stop: skip its steps, its
   domain keeps its previous date, and the report lists it. Everything else is published
   automatically once all checks pass, through the `data/<YYYY-MM>` branch, then a PR, the
   `verify` check and a merge (D68, `docs/DEPLOYMENT.md`).
9. **Strict command lines.** Every tool at the top of `tools/` except `verify_page.js` refuses an
   unknown flag, an extra positional argument and a value flag given no value (exit 2), so a typo
   such as `--aply` can no longer turn into a silent dry run. PR #15 added the last two checks to
   `rename_schemes`, `bake_month`, `fill_variant_analytics`, `merge_analytics`, `rebuild_directperf`
   and `rekey_sif_analytics`. `verify_page.js` takes one optional folder and checks only that it
   holds an `index.html` (`--bogus` is read as a folder: `*** page not found`, exit 2). An exit 2 prints the usage text
   (`node tools/<tool>.js …`) or a `***` reason. `merge_analytics` and `merge_expense_exitload`
   need only one of their workbook flags, whatever their usage line suggests.
10. **To rehearse an `--apply` without touching `site/`,** copy the six deploy files to a scratch
    folder and pass `--html <scratch>/index.html`. The tools find the siblings beside it. Three
    tools take a different flag: `merge_sif_monitor.js` (`--sibling`), `update_market_slides.js`
    (`--js`) and `update_closing_slides.js` (`--sibling`). To compare a tool change old against
    new on whole chains, use `npm run rehearse` (`docs/TESTING.md` §2). For a change to page code
    (a parser in `site/index.html`), add `--old-site <old checkout>/site` so the old side starts
    from the old page (`docs/KNOWN_ISSUES.md` A27, closed).

---

## 2. Standard monthly order

Paths follow `monthly-updates/README.md`:

- There is one folder per **data** month, named `YYYY-MM_Mon-YYYY`.
- The monitors and most workbooks sit at the top of that folder.
- The Equity, Hybrid and Debt Analytics workbooks and the Direct Equity universe sit in `Analytics/`.

The values below are examples for the Oct-2026 data month; replace them. File names drift every
month, so match the stem and copy the real name from the folder listing. **Set the folder in the
same command as each tool call.** Claude Code's Bash and PowerShell tools do not keep variables or
functions between calls, so an `M` set in an earlier call is empty in the next one. With `M` set in
the same command, every command below works the same in Git Bash and PowerShell:

```bash
M="monthly-updates/2026-10_Oct-2026"; node tools/…        # Git Bash
```
```powershell
$M = "monthly-updates/2026-10_Oct-2026"; node tools/…      # PowerShell
```

**Run each step as shown, which is a dry run. Read the gates listed for it in §3 and §6. Then run
the same line again with `--apply` added. Apply each step before you dry-run the next one, because
later steps read what earlier steps wrote.** Keep the dry-run printouts in `$M/_review/`.

These step numbers are the canonical monthly order. `docs/MONTHLY_UPDATE_PROCESS.md` B4 uses the
same numbering, so "step 12" means the same tool in both.

0. **Prepare.**
   - Move the files from `monthly-updates/00_INBOX/` into `$M` (see `monthly-updates/README.md`).
   - Work on branch `data/2026-10`.
   - Back up the six deploy files to `backups/<YYYY-MM-DD>_pre-<YYYY-MM>-refresh/`:

     ```bash
     B="backups/$(date +%F)_pre-2026-10-refresh"; mkdir -p "$B"; cp site/index.html site/Centricity_ExtraSlides.js site/Centricity_PMS_AIF_Terms.js site/Centricity_June_Refresh.js site/Centricity_IRR_Offshore.js site/Centricity_SIF_Refresh.js "$B/"
     ```
     ```powershell
     $B = "backups/$(Get-Date -Format yyyy-MM-dd)_pre-2026-10-refresh"; New-Item -ItemType Directory -Force $B | Out-Null; Copy-Item site/index.html, site/Centricity_ExtraSlides.js, site/Centricity_PMS_AIF_Terms.js, site/Centricity_June_Refresh.js, site/Centricity_IRR_Offshore.js, site/Centricity_SIF_Refresh.js $B
     ```

**MF cycle (after month-end):**

1. **Renames: always first.** If you bake without this step, about 200 renamed schemes are
   duplicated. Inception is compared on the exact day. Until the owner decides, 8 renames are
   pending (`docs/PROJECT_STATE.md`): never `--apply` them without that decision.
   `node tools/rename_schemes.js --monitor "$M/Daily MF monitor_<date>.xlsx"`
2. **Bake.** This step needs the Regular and Direct monitors at the top of `$M` and the three
   Analytics workbooks in `$M/Analytics/`.
   `node tools/bake_month.js --dir "$M" --as-on "31st October 2026"`
3. **Fill the variant analytics.** Run this after every bake.
   `node tools/fill_variant_analytics.js --dir "$M"`
4. **Re-key the SIF analytics.** Run this after every bake. If its store-size gate fails because a
   SIF changed analytics class, re-run with `--allow-shrink` only after checking that fund.
   `node tools/rekey_sif_analytics.js`
5. **Refresh the Direct Equity universe** (sector, market cap and SEBI market-cap bucket).
   `node tools/merge_de_universe.js "$M/Analytics/Listed Direct Equity_<Month>.xlsx"`
6. **Refresh the Direct Equity returns.** Use the returns file at the top of `$M`, not the
   `Analytics/` file. If the tenor-coverage gate fails, re-request the file; `--allow-coverage-drop`
   only if the owner accepts the loss.
   `node tools/merge_direct_equity_returns.js "$M/Listed Direct Equity_<date>.xlsx"`
7. **Refresh the expense ratio and exit load.**
   `node tools/merge_expense_exitload.js --expense "$M/Expense Ratio_<Month>.xlsx" --exitload "$M/Exit Load_<Month>.xlsx"`
8. **Bake the SIF performance** into `site/Centricity_SIF_Refresh.js`. `--as-on` is required. If
   the run prints `NEW schemes added`, run step 4 again afterwards. Step 4 is idempotent, and new rows
   carry `sif_raw`.
   `node tools/merge_sif_monitor.js "$M/SIF Monitor_<date>.xlsx" --as-on "31st October 2026"`
9. **Refresh the fund managers.** This must come after step 2, because the bake overwrites
   `fund_mgr`.
   `node tools/merge_fund_managers.js "$M/Fund Manager Data_<date>.xlsx"`
10. **Refresh the risk matrix** (Node route). For the Python alternative, see §5.
    `node tools/merge_risk_matrix.js "$M/Fund Risk Ratios & 3Y Rolling - All Funds (as on <date>).xlsx" --as-on "31 Oct 2026"`
11. **Refresh the Market Update slides.** Render the deck first (§4).
    `node tools/update_market_slides.js --slides "C:/t/q82"`

**Reckoner cycle (usually mid-month, when the Reckoner and PMS files arrive).** If you run it as a
separate session, take a fresh backup first. The deck is named for the month it *ships*: the
November 2026 deck carries October data. Read the as-on date off the deck's "Performance as on …"
line, never off the file name.

12. **PMS performance.** A vendor rename stops the run (`*** REPIN key not in this file`): fix the
    pin in `tools/data/pins.json` (`pms_alias`) with the owner. This tool has no override flag.
    `node tools/merge_pms_performance.js "$M/PMS_Scheme_Performance_<Month Year>.xlsx" --as-on "31st October 2026" --html site/index.html`
13. **PMS alias pins.** Apply step 12 first: this tool checks the `pin` entries of
    `tools/data/pins.json` against the PMS block already written into the page.
    `node tools/pin_pms_alias.js --html site/index.html`
14. **Centricity Select.**
    `node tools/merge_reckoner.js "$M/Monthly Investment Reckoner - <Month Year>.pptx" --html site/index.html`
    If a drop gate fails because of the count or an emptied category, and the owner confirms the
    DROPPED list is the desk's own change, re-run with `--accept-drops <that many>`. Never waived: a
    dropped fund whose category also lists an unmatched deck name (pin it in `tools/data/pins.json`
    `reckoner`, or use step 14a), and a dropped fund still listed under a deck heading `GRID` does
    not map (map the heading in `merge_reckoner.js`, a reviewed code change).
    - **14a. `add_reckoner_funds.js` (on demand).** Only if step 14 lists deck funds with no MASTER
      record (`DECK NAMES WITH NO MASTER MATCH`). This is a universe change, so confirm with the
      owner first. The funds it adds are the ones hard-coded in its `ADD` list (§6). A fact-card AUM
      in USD mn is converted at `--usd-inr` (default 88).
      `node tools/add_reckoner_funds.js "$M/Monthly Investment Reckoner - <Month Year>.pptx"`
15. **AIF performance and benchmarks.** This uses the same deck as step 14. If the layout gate fails,
    check the slides by hand; `--allow-layout-change` only with the owner.
    `node tools/merge_aif_performance.js "$M/Monthly Investment Reckoner - <Month Year>.pptx"`
16. **PMS/AIF look-through** (only when the file is supplied). Record the `look-through as on` line
    in the update log; the page has no label for it (D70). If two sheets carry the holdings header,
    name one with `--sheet "<name>"`.
    `node tools/merge_pms_aif_analytics.js "$M/PMS & AIF Analytics <Month Year>.xlsx" --as-on "<that file's as-on>"`

**Finish:**

17. `node tools/verify_page.js site`, and check it against rule 6. Then run the browser checks in
    `docs/TESTING.md` with `npm run serve`, which serves http://127.0.0.1:8080/.

Not in the monthly order are the tools that run only when the desk sends a file: Bond List, closing
slides, and the hand-edited GIFT City, SIF universe and IRR lists. They are listed under *Periodic*
in §3.

---

## 3. Every tool, by cadence

All commands are dry runs; add `--apply` to write. `<…>` marks a placeholder. Each tool listed as
writing `site/index.html` writes only the blocks named.

### Monthly core

| Tool | Reads | Writes (only with `--apply`) | Gates to read in the dry run | CLI |
|---|---|---|---|---|
| `rename_schemes.js` | The Regular Daily MF Monitor: every sheet that has `Scheme Name` in column A (dates read with `isoDay`). Also MASTER, the six name-keyed stores, and `var IRR` in `site/Centricity_IRR_Offshore.js`. | Only the blocks that change, in one `writeFilesAtomic` call: MASTER (`name`, `prev_name`, `prev_names`), EQUITY/HYBRID/DEBT_ANALYTICS, DIRECT_PERF, RISK_MATRIX, CENTRICITY_SELECT, and `var IRR` in `Centricity_IRR_Offshore.js`. Nothing new: nothing written. | Every `old -> new [… · how]` line: check each `inception` and `category` pairing (inception must match on the exact day). The `*** AMBIGUOUS — not renamed` list. `new to MASTER`, where a jump means renames were missed. It counts every Monitor row not in MASTER and not renamed, including rows the bake never adds: rows on the four refresh-only sheets (C19, D80) and segregated / unclaimed rows the parser filters out (Sep-2026 Monitor against today's MASTER: 14 = 5 + 9; the bake adds none). `stale old-name keys dropped`. Gates (exit 1): unique from/to, no collision, no duplicate names, every name-keyed store readable. | `node tools/rename_schemes.js --monitor "<Regular monitor>.xlsx" [--html <p>] [--apply]` |
| `bake_month.js` | In `--dir`: exactly one Regular monitor (`Daily MF monitor…`, not `_Direct`) and one `Daily MF Monitor_Direct…`. In `--dir/Analytics/`: one each of `Equity Analytics_…`, `Hybrid Analytics_…`, `Debt Analytics_…` (a duplicate or a missing file exits 2). It parses them with the page's own `REFRESH` parsers; DIRECT_PERF comes from `tools/lib/direct_perf.js`. | `site/index.html`: MASTER, EQUITY/HYBRID/DEBT_ANALYTICS, MF_BENCHMARK_PERF, DIRECT_PERF (replaced in full), `DATA_DATES.performance` and `.analytics`. | The five `<- file` lines. `NEW funds added to MASTER`: about 200 means step 1 was skipped. The STALE list: these funds keep last month's holdings. `refresh-only rows not merged` (Sep-2026: 19): each is a pending rename, a new fund (added by hand with the owner, never by the bake) or a fund also on a mapped sheet (§6). Any `WARN expected Monitor sheet missing or with no fund rows`. `CHECK MASTER MF/ETF funds on no sheet of this Monitor` (report only; Sep-2026: 42). DIRECT_PERF matched/unmatched. Gates (exit 1): sandbox inline blocks, duplicate names, no block shrank, DIRECT_PERF within 95% of the current block, fund rows on unrecognised Monitor sheets (also FAILs when `index.html` predates the C19 fix). | `node tools/bake_month.js --dir "<month folder>" --as-on "<label>" [--as-on-analytics "<label>"] [--html <p>] [--apply]` |
| `fill_variant_analytics.js` | The three `Analytics/` workbooks (exactly one each, else exit 2), through `REFRESH.parseAnalytics`, and MASTER's Equity/Hybrid/Debt Mutual Fund, Index Fund and ETF records. | EQUITY/HYBRID/DEBT_ANALYTICS. It adds missing names **and replaces** last month's entries. | `eligible · covered by name · missing` per class. Each `name <- sibling` pair must be the same scheme. `ambiguous … not filled` (equally ranked siblings: resolve by hand). `still no entry anywhere`. Gate (exit 1): sandbox inline blocks. | `node tools/fill_variant_analytics.js --dir "<month folder>" [--html <p>] [--apply]` |
| `rekey_sif_analytics.js` | The three analytics stores. MASTER after the June, IRR and SIF siblings have run in a vm (for the `sif_raw` join key); the siblings' warnings and errors are shown. | The three analytics stores, with SIF keys moved from `sif_raw` to the MASTER name. | The `re-keyed` list. `no analytics anywhere … chase upstream`. Gates (exit 1): siblings ran without a console error; store sizes (a store never loses a fund; lost keys are listed), which `--allow-shrink` overrides after you check the fund changed class; no workbook-named SIF keys left behind. | `node tools/rekey_sif_analytics.js [--html <p>] [--allow-shrink] [--apply]` |
| `merge_de_universe.js` | `Analytics/Listed Direct Equity_<Month>.xlsx`, about 5,300 rows: first sheet. The header row is found by its exact column names (`Company Name`, `CD_Sector`, `SC_Latest Market Cap`, `Mcap Allocation`) in the first 30 rows; a repeated column exits 1. | MASTER Direct Equity: `sub_category` (= sector), `mktcap`, `sebi_mcap`. It appends new listings. | `! new listings that are a renamed record's prev_name` (check before `--apply`). Reconcile `in MASTER but not in this month's file` against `new listings`. Gates (exit 1): `top-10 … Large Cap`, duplicate names. | `node tools/merge_de_universe.js "<Analytics/Listed Direct Equity_<Month>.xlsx>" [--html <p>] [--apply]` |
| `merge_direct_equity_returns.js` | `Listed Direct Equity_<date>.xlsx` (returns, about 8,400 rows). It finds the header row by `Company Name`. Values are percent and are divided by 100. | MASTER Direct Equity `r3m r6m r1y r2y r3y r5y`. Each is set, or **deleted** when the file lacks it. | A wholly empty return column stops the run (exit 1): never force it, re-request the file. Matched by ISIN / by name / unmatched, and repeated ISINs or names (first row wins). The tenor table's `lost` column. The return min/max must look like decimals. Gates (exit 1): top-10 Large Cap; tenor coverage (more than 5% of the matched stocks carrying a tenor would lose it), which `--allow-coverage-drop` overrides on the owner's call. | `node tools/merge_direct_equity_returns.js "<Listed Direct Equity_<date>.xlsx>" [--html <p>] [--allow-coverage-drop] [--apply]` |
| `merge_expense_exitload.js` | `Expense Ratio_…` and `Exit Load_…`: `Sheet1`, or else the first sheet. It finds the `Scheme Name` header below any banner, reading from the sheet's used range. | MASTER `expense` (`Ratio`/100) and `exit_load` (`Remark` text). DIRECT_PERF `expense` (`Direct Plan Ratio`/100), for existing names only. One atomic write. | `updated N (unchanged M)` counts, values outside 0-8% (rejected and listed) and `placeholder cells skipped`. Gates (exit 1): expense above 8%, duplicate names, MASTER count unchanged, `source rows joined to MASTER` (fails at 0). | `node tools/merge_expense_exitload.js --expense "<xlsx>" --exitload "<xlsx>" [--html <p>] [--apply]` (at least one of the two) |
| `merge_sif_monitor.js` | The SIF Monitor, parsed by the sibling's own `REFRESH.parseSif` in a vm, and `site/Centricity_SIF_Refresh.js`. | `site/Centricity_SIF_Refresh.js` only: the `var SIF` block and the `DATA_DATES.sif` line, in one atomic write. | Coverage, `NEW schemes added`, and a `WARN` for a row with no return. Gates (exit 1): returns within ±300%, duplicate names, SIF block did not shrink, `DATA_DATES.sif equals --as-on`, fallback line found exactly once. | `node tools/merge_sif_monitor.js "<SIF Monitor_<date>.xlsx>" --as-on "<label>" [--sibling <p>] [--apply]` (`--as-on` required; one workbook only) |
| `merge_fund_managers.js` | `Fund Manager Data_<date>.xlsx`: first sheet; the header row is found by its column names in the first 30 rows; one row per manager stint; dates read with `isoDay`. | MASTER `fund_mgr` (the full current team, longest-serving first). | The latest To Date and the cutoff. Rosters that are too stale. Matched exact / prev_name / normalised / unmatched, and `ambiguous, not written`. The `was/now` samples. Gates (exit 1): no blank `fund_mgr`, duplicate names. | `node tools/merge_fund_managers.js "<Fund Manager Data_<date>.xlsx>" [--html <p>] [--apply]` |
| `merge_risk_matrix.js` | `Fund Risk Ratios & 3Y Rolling - All Funds (as on <date>).xlsx`: the `Risk Ratios` sheet, plus the optional `Data Flags` sheet (benchmarks and reliability notes; `WARN` if absent). Also MASTER (`prev_name`) and the current RISK_MATRIX (for `bm`). | RISK_MATRIX, replaced in full (`c` dropped, `bm` kept, `fl` on flagged funds), and the `window.DATA_DATES.riskMatrix = '…';` line, in one atomic write. It does not touch RISK_MATRIX_BENCH_SD. | The join tiers (exact / prev_name / plan-base) and the unmatched list. `reliability: split=… lowcorr=…` and `flagged … -> …` (Sep-2026: 28 + 5; the 12 Max-Drawdown-only notes are not carried). Gates (exit 1): every key in MASTER, no ambiguous joins, no collisions, no shrink (funds, metrics), benchmark coverage, date line found exactly once, page ends `</html>`. | `node tools/merge_risk_matrix.js "<Fund Risk Ratios … .xlsx>" --as-on "<short label>" [--html <p>] [--apply]` |
| `update_market_slides.js` | `slide<N>.jpg` or `.png` in `--slides`, sorted by N. Also the `EXTRA_SLIDES` literal (read with blocklib, not run). | `site/Centricity_ExtraSlides.js`: `EXTRA_SLIDES.market` only (blocklib splice; every other byte is kept). | `GATE slide count … *** CHANGED` is not a failure: confirm it. Gates (exit 1): every slide 2001×1125, untouched keys byte-identical, written market equals the new slides, bytes outside `EXTRA_SLIDES` unchanged. | `node tools/update_market_slides.js --slides "<dir>" [--js <p>] [--apply]` |

### Reckoner cycle

| Tool | Reads | Writes (only with `--apply`) | Gates to read in the dry run | CLI |
|---|---|---|---|---|
| `merge_pms_performance.js` | `PMS_Scheme_Performance_<Month Year>.xlsx`. The sheet is found by its header (`Scheme Name` + `Scheme Return 1 Year`), and 25 columns are required. Also PMS_PERFORMANCE, PMS_PERF_ALIAS, MASTER and the `pms_alias` entries marked `repin` in `tools/data/pins.json`. | `PMS_PERFORMANCE.pms`, **replaced wholesale** (`aif` and `benchmarks` are carried over). The `repin` entries in PMS_PERF_ALIAS. `DATA_DATES.pms`. One atomic write. | `AUM column treated as …` (rupees or crore). The duplicate-row list. `pms N -> M`. A `repin` key missing from the file stops the run (exit 1). The re-pointed pins table: check each 1Y/AUM. `still pinned null` (from the live alias map; its "file offers" names are hints, never applied). Gates (exit 1): MASTER PMS funds with performance must not fall, values in range, `DATA_DATES.pms` set. No override flag. | `node tools/merge_pms_performance.js "<PMS_Scheme_Performance_<Month Year>.xlsx>" --as-on "<label>" --html site/index.html [--apply]` |
| `pin_pms_alias.js` | PMS_PERF_ALIAS, `PMS_PERFORMANCE.pms` as baked, the MASTER PMS records, and the `pms_alias` entries marked `pin` in `tools/data/pins.json`. | PMS_PERF_ALIAS. | Any `*** not in the alias map` or `*** key not in PMS_PERFORMANCE.pms` line: one blocks **all** pins. The per-pin 1Y/3Y/AUM lines. `GATE still pinned null`. Gates (exit 1): every pin resolves against the PMS block on disk; MASTER PMS funds with performance must not fall. | `node tools/pin_pms_alias.js --html site/index.html [--apply]` |
| `merge_reckoner.js` | The Reckoner `.pptx`: its performance grids (8+ columns, presentation order) and its narrative slides. Also CENTRICITY_SELECT, MASTER (`name`, `prev_name`, `sub_category`) and the `reckoner` pins in `tools/data/pins.json`. | CENTRICITY_SELECT. | `N -> M (+added, -dropped)`. `GATE categories` must be 33. `RESOLVED VIA prev_name`. `NEW ENTRIES WITH NO RATIONALE`. Write gates (exit 1): every key in MASTER; no dropped fund whose category also holds an unmatched deck name; at most 5% dropped; no category emptied (D71); no dropped fund still listed under a deck heading `GRID` does not map (D76). `--accept-drops <n>` waives only the 5% and emptied-category gates, and only when the run drops exactly n. | `node tools/merge_reckoner.js "<Monthly Investment Reckoner - <Month Year>.pptx>" --html site/index.html [--accept-drops <n>] [--apply]` |
| `merge_aif_performance.js` | Two grids in the same `.pptx`: the `AIF PERFORMANCE` grid, and the `PMS – EQUITY` grid (benchmarks with 2Y). Also PMS_PERFORMANCE, the MASTER AIF records and the `aif_performance` pins in `tools/data/pins.json`. | `PMS_PERFORMANCE.aif`, rebuilt wholesale. `.benchmarks`, only if the count matches (benchmark SI is set to null). `pms` is left untouched. | The benchmark slide. The per-fund old→new table. `deck rows with no MASTER AIF record`. Gates (exit 1): returns within ±100%, m-cap sum ≤ 102% (under 98% is only noted), AIF coverage must not fall, deck layout as expected (m-cap sub-header in the last four columns, a PMS – EQUITY grid with 2Y, the stored benchmark count), which `--allow-layout-change` overrides after a hand check. | `node tools/merge_aif_performance.js "<Reckoner .pptx>" [--html <p>] [--allow-layout-change] [--apply]` |
| `merge_pms_aif_analytics.js` | `PMS & AIF Analytics <Month Year>.xlsx`: the sheet whose header carries the look-through columns (two such sheets need `--sheet`); `Holding(%)` is a fraction. Also MASTER, EQUITY_ANALYTICS and `var EQ` in `site/Centricity_June_Refresh.js`. | EQUITY_ANALYTICS (the schemes it builds are replaced). Also `var EQ` in `Centricity_June_Refresh.js`, for shared keys; both in one `writeFilesAtomic` call. Never `DATA_DATES` (D70). | The `mapped N of M` table (total %). `no MASTER instrument — holdings skipped`. `stale look-through` (listed, kept). The `look-through as on` line, for the update log. Gates (exit 1): totals ~100 and reconcile, MASTER PMS/AIF with look-through must not fall. | `node tools/merge_pms_aif_analytics.js "<PMS & AIF Analytics <Month Year>.xlsx>" --as-on "<label>" [--sheet "<name>"] [--html <p>] [--apply]` |
| `add_reckoner_funds.js` (on demand) | The Reckoner `.pptx`, at the slide numbers hard-coded in `ADD`; the slide of each fund not yet in MASTER must name it or the run refuses. Also MASTER, CENTRICITY_SELECT, PMS_PERF_ALIAS, PMS_PERFORMANCE, and `NEW_GIFT` in the June sibling. | MASTER (new records), CENTRICITY_SELECT, PMS_PERF_ALIAS. A GIFT City add also goes into `NEW_GIFT` in `Centricity_June_Refresh.js`, only while this deck names the fund; both files in one `writeFilesAtomic` call. | `already in MASTER — skipping` (all four today; a skipped fund gets no slide check). `slide N names the fund: PASS`. Each `=== <fund> ===` block: IRR band and peers, AUM conversion (the USD/INR line), rationale. `MASTER baseline N -> M`. Gates (exit 1): no duplicate names, full field set, IRR bands sane, `NEW_GIFT` readable. | `node tools/add_reckoner_funds.js "<Reckoner .pptx>" [--html <p>] [--usd-inr 88] [--apply]` (`--pms` is accepted and ignored) |

### Periodic and alternative routes

| Tool | Reads | Writes (only with `--apply`) | Gates to read in the dry run | CLI |
|---|---|---|---|---|
| `merge_bond_list.js` | `Bond List_<date>.xlsx`: one sheet, chosen by `--sheet`, else the only sheet, else the one tab named for the desk; fixed columns B–F and H (row 1 checked), data from row 3. Also MASTER (`B.locate`). | MASTER Bonds rows of the `--desk` named (`Invictus` or `OneDigital`); every other desk is left as it is. One atomic write. | The `desk … sheet …` line. `! row N has no IRR`, name-vs-cell year mismatches, duplicate blocks with differing IRR or rating, the maturity range, and the full new list. `CHECK new <desk> bonds already listed under <other desk>` (report only; `*** every bond` means confirm with the desk). Gates (exit 1): at least one bond parsed, duplicate names, other desks untouched, IRR 0–30% with high ≥ low, maturity present and not before today, written MASTER re-reads. | `node tools/merge_bond_list.js "<Bond List_<date>.xlsx>" --desk <Invictus\|OneDigital> [--sheet "<tab>"] [--html <p>] [--apply]` |
| `update_closing_slides.js` | `<dir>/disclaimer.png` (a PNG) and `<dir>/thankyou.jpg` (a JPEG), both 2001×1125. Also `EXTRA_SLIDES`. | `site/Centricity_ExtraSlides.js`: the `disclaimer` and `thankyou` keys only (blocklib splice). | The per-key dimension lines, old KB → new KB, and the payload size. Gates (exit 1): renders 2001×1125 in the expected format; other keys and every byte outside `EXTRA_SLIDES` unchanged. | `node tools/update_closing_slides.js --dir "<render dir>" [--sibling <p>] [--apply]` |
| `merge_analytics.js` | One to three Analytics workbooks, through `REFRESH.parseAnalytics`. | The given analytics stores and `DATA_DATES.analytics` (one label for all three classes). | `before -> after`, refreshed/added, the STALE list, and `refreshed nothing — wrong file or wrong kind?`. Gates (exit 1): sandbox inline blocks, holdings total in 30–130%. | `node tools/merge_analytics.js [--equity "<xlsx>"] [--hybrid "<xlsx>"] [--debt "<xlsx>"] --as-on "<label>" [--html <p>] [--apply]` |
| `rebuild_directperf.js` | The Direct monitor, through `tools/lib/direct_perf.js` (the same builder as `bake_month.js`). MASTER and DIRECT_PERF are read with `B.locate`; either missing or duplicated stops the run. | DIRECT_PERF, replaced in full. | `expense present after rebuild`. `DIRECT_PERF old -> new`. Gates (exit 1): every scale line (decimals; m-cap sums to 1 ± 0.05), DIRECT_PERF within 95% of the current block. | `node tools/rebuild_directperf.js "<Daily MF Monitor_Direct_<date>.xlsx>" [--html <p>] [--apply]` |
| `build_risk_matrix.py` | `NAV Data as on <date>.xlsx` (three sheets) and the MASTER in the page (read only). | The `.js` you name, **always** (it has no dry run); only outside `site/`, through a temp file. | `joined … unjoined` (explain each unjoined fund), the join tiers, records with metrics and with `rr`. | See §5 |

Some inputs have no tool and are edited by hand, each through a PR:

| Input | Where to edit |
|---|---|
| SIF Master List | `var SIF` in `site/Centricity_SIF_Refresh.js` |
| Gift City Master List | `NEW_GIFT` in `site/Centricity_June_Refresh.js` **and** the embedded MASTER block (D24; the block only through `tools/lib/blocklib.js`); Off Shore funds (`var OFFSHORE`) in `site/Centricity_IRR_Offshore.js` |
| Expected IRR ranges | `var IRR` in `site/Centricity_IRR_Offshore.js`, keyed by exact MASTER name |

### One-off / idempotent (all already applied; a dry run today reports nothing to do)

| Tool | Reads | Writes (only with `--apply`) | Gates to read in the dry run | CLI |
|---|---|---|---|---|
| `fold_duplicate_names.js` | The Regular monitor (dates read with `isoDay`) and the five hand-listed `PAIRS`. MASTER, the six stores and the IRR sibling (required: missing or unparsable exits 1). `Centricity_Risk_Matrix.js` beside the page, if present, for a note only (archived since 19-Oct-2026, so the check is skipped). | Only when a fold exists: MASTER, the six stores and `var IRR`, in one `writeFilesAtomic` call. | Today: `already folded` ×5, then `nothing to fold`. | `node tools/fold_duplicate_names.js --monitor "<Regular monitor>.xlsx" [--html <p>] [--apply]` |
| `fold_index_funds.js` | MASTER; and, for a report only, the effective MASTER after the June → IRR → SIF siblings run in a vm. | MASTER: `product_class` `Index Fund` becomes `Mutual Fund`. | Today: `effective MASTER after the siblings run: 7682 records; product_class "Index Fund": 0`, then `nothing to fold — already done`. A hit there comes from a sibling: fix it in that sibling. | `node tools/fold_index_funds.js [--html <p>] [--apply]` |
| `split_sif_add_mld.js` | MASTER and `var SIF` in the SIF sibling (missing exits 2). | MASTER (the MLD record, inserted only when missing) and `var SIF` (SIF split by strategy), in one `writeFilesAtomic` call. | `*** FAIL` on an unrecognised strategy. A reported MLD difference: the existing record is kept. | `node tools/split_sif_add_mld.js [--html <p>] [--apply]` |

### Verification

| Tool | Reads | Writes | What to read | CLI |
|---|---|---|---|---|
| `verify_page.js` | `<dir>/index.html` (default `site/`) and the five local `<script src>` siblings, in document order, in a vm. It skips the CDN scripts. | Nothing. | Rule 6 in §1. Exit 1 on a hard failure. | `node tools/verify_page.js site` or `npm run verify` |
| `.claude/serve.js` (not in `tools/`) | `site/` only, on 127.0.0.1 only. | Nothing. | The browser checks in `docs/TESTING.md`. | `npm run serve` (http://127.0.0.1:8080/) |
| `tools/test/run.js` | Every `tools/test/*.test.js` (today `blocklib.test.js`, 34 checks; `dates.test.js`, 10; `parser_refresh_only.test.js`, 18, on the page's own `REFRESH` block with synthetic workbooks; `tool_inputs.test.js`, 43, every tool with a missing source and a bad `--html`). | Nothing. | `PASS`/`FAIL` per file; exit 1 if any fails. CI runs it after `npm ci`. | `npm test` |
| `tools/dev/rehearse.js` | `tools/dev/rehearsal_cases.js` (12 cases), the inputs in `monthly-updates/`, and two tool trees. | Disposable copies of `site/` in the OS temp folder, plus `report.json`. Never the real `site/`. | Old-versus-new differences, block by block; with `--old-site`, a data verdict that ignores the seeded page-code difference (see `docs/TESTING.md` §2). | `npm run rehearse -- --old <old repo root> [--old-site <dir>] [--new <root>] [--case a,b] [--list] [--keep]`; `--old-site <dir>` alone runs this checkout's tools on both sides |

### Libraries (`tools/lib/`) and data (`tools/data/`)

| Library | Reads | Writes | Fails on | API |
|---|---|---|---|---|
| `blocklib.js` | The file the caller names. `locate` finds a prefix such as `window.MASTER = ` and parses the JSON literal after it, and refuses when the prefix has more than one literal assignment. Every Node tool except `verify_page.js` uses it. | `writeFileAtomic`: a `.tmp` file beside the target, then a rename; a rename that fails with `EPERM`, `EBUSY` or `EACCES` (a OneDrive sync, R6) is retried six times over 6.3 s, and the temp file is removed on any failure. `writeFilesAtomic`: checks every output (non-empty; `</html>` kept if the input had it), then writes each atomically. `writeBlocks`: one splice and one atomic write. | `not found`, `is not followed by a literal`, `N literal occurrences`, `unbalanced literal`, a JSON parse error, duplicate or overlapping prefixes in one splice, a lost `</html>`, a bad as-on label, and a replacement that does not match exactly once. | `locate`, `read`, `spliceBlocks`, `writeBlocks`, `writeFileAtomic`, `writeFilesAtomic`, `checkAsOn(label,'long'\|'short')`, `replaceOnce`, `setDataDate(html,key,label)`, `matchEnd`, `literalOffsets` |
| `dates.js` | A Date from a SheetJS cell, or a raw Excel serial. | Nothing. | Returns `null` for anything else. | `isoDay(date)`: the nearest local calendar day as `YYYY-MM-DD` (SheetJS 0.18.5 returns 23:59:50 of the previous day in IST; A6). `isoDayFromSerial(XLSX, n)` |
| `direct_perf.js` | The Direct-plan Monitor, and the MASTER array it pairs against. | Nothing; returns a new store. | — | `buildDirectPerf(src, master)` → `{ store, matched, unmatched, … }`; used by `bake_month.js` and `rebuild_directperf.js` |
| `data/pins.json` | — (a data file) | Edited by hand, through a reviewed PR, with the owner (D61, D75). | The four tools that load it exit 1 when a name's edge spaces disagree with `trailing_space`. | `pms_alias` (MASTER PMS name → `key`; `repin` read by `merge_pms_performance.js`, `pin` by `pin_pms_alias.js`), `reckoner` (deck name → MASTER name, `merge_reckoner.js`), `aif_performance` (deck names `merge_aif_performance.js` looks up in `reckoner`), `reckoner_notes`, `trailing_space`, `_about` |
| `pptx.js` | A `.pptx` (zip) file, with no dependencies. | Nothing. | A missing entry throws. | `entries(file)`, `slideText(xml)`, `slideTables(xml)` |
| `reck_parse.js` | The Reckoner's performance grids, in presentation order. Benchmark rows are skipped. | As a library, nothing. Run as a command, it writes `<out.json>` unconditionally. | Nothing; it only filters by structure. | `parse(pptx)`. Debug: `node tools/lib/reck_parse.js "<Reckoner .pptx>" <out.json>` |
| `reck_narrative.js` | The narrative slides: the "About" paragraph and the `Particulars` fact table. | Nothing. | Nothing; it relies on heuristics. | `slides(pptx)`, `about(slide)`, `details(slide)` |

---

## 4. Slide refresh via PowerPoint COM (PRD §11.6)

The Market Update deck and the closing-slides deck are native PowerPoint shapes. `ppt/media` has
nothing to extract, so the slides must be **rendered**. PowerPoint 16 COM is registered on this
machine (`PowerPoint.Application.16`, checked 16-Oct-2026).

- Every image in `EXTRA_SLIDES` is **2001×1125**.
- Export to a **short** path such as `C:\t`, because `Slide.Export` fails on long paths such as the
  scratchpad or the OneDrive folder.

The script below combines PRD §11.6 with the operating manual's logo and placeholder rule. The
re-encode and decode checks were run on 16-Oct-2026. The COM loop itself was **not** run during the
transfer.

**1. Render (Windows PowerShell).** First take whichever 5- or 6-slide market deck is in `$M`. Its
name flips between `Monthly Outlook Pagers…` and `Market Update Slide_…`. A re-issued deck keeps
the same name, so check `LastWriteTime`.

```powershell
$M = "monthly-updates/2026-10_Oct-2026"   # set in this same block: variables do not survive between calls
function Clear-Slide($s) {   # remove baked-in logos and slide numbers (the page stamps its own logo)
  for ($i = $s.Shapes.Count; $i -ge 1; $i--) {
    $sh = $s.Shapes.Item($i)
    if ($sh.Type -eq 13 -and $sh.Width -lt 400) { $sh.Delete() }                     # picture < 400pt wide = logo
    elseif ($sh.Type -eq 14 -and $sh.PlaceholderFormat.Type -eq 13) { $sh.Delete() } # slide-number placeholder
  }
}
Remove-Item C:\t -Recurse -Force -ErrorAction SilentlyContinue   # start empty: stale slideN.jpg files would be baked
New-Item -ItemType Directory -Force C:\t\q82 | Out-Null
$app  = New-Object -ComObject PowerPoint.Application
$pres = $app.Presentations.Open((Resolve-Path -LiteralPath "$M/<market deck>.pptx").Path, -1, 0, 0)  # read-only, no window
foreach ($s in $pres.Slides) { Clear-Slide $s; $s.Export("C:\t\slide$($s.SlideIndex).jpg", "JPG", 2001, 1125) }
$pres.Close(); $app.Quit()
```

**2. Re-encode the JPEGs at quality 82.** PowerPoint's own JPEGs are heavy: 1,743 KB for five
slides in Aug-2026, against 1,284 KB at q82.

```powershell
Add-Type -AssemblyName System.Drawing
$jpeg = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$ep = New-Object System.Drawing.Imaging.EncoderParameters 1
$ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]82)
Get-ChildItem C:\t\slide*.jpg | ForEach-Object { $img = [System.Drawing.Image]::FromFile($_.FullName); $img.Save("C:\t\q82\$($_.Name)", $jpeg, $ep); $img.Dispose() }
```

Then check the renders by eye:

- Look at the densest slide after re-encoding; it is a second lossy pass.
- Confirm that no content picture narrower than 400pt was removed as a "logo".
- Confirm that no logo or slide number remains. The page stamps its own logo, so a baked-in one
  shows twice.

**3. Bake.**
`node tools/update_market_slides.js --slides "C:/t/q82"`, read the gates, then add `--apply`. Only
`market` is replaced.

**Closing slides** (only when the source deck `Topic Slides, Disclaimer & Thank You Slide.pptx`
changes). Paste the `Clear-Slide` function from step 1 at the top of this same PowerShell block (a
function defined in an earlier call no longer exists), then export the two slides by their number
in that deck. Export the Disclaimer as **PNG** (text: crisper and smaller) and the Thank You as
**JPEG** (photographic). The tool accepts exactly these two file names.

```powershell
# <paste the whole Clear-Slide function from step 1 here>
New-Item -ItemType Directory -Force C:\t\closing | Out-Null
$app  = New-Object -ComObject PowerPoint.Application
$pres = $app.Presentations.Open((Resolve-Path -LiteralPath "<closing deck>.pptx").Path, -1, 0, 0)
$d = $pres.Slides.Item(<disclaimer slide no>); Clear-Slide $d; $d.Export("C:\t\closing\disclaimer.png", "PNG", 2001, 1125)
$t = $pres.Slides.Item(<thank-you slide no>);  Clear-Slide $t; $t.Export("C:\t\closing\thankyou.jpg",  "JPG", 2001, 1125)
$pres.Close(); $app.Quit()
```

Then run `node tools/update_closing_slides.js --dir "C:/t/closing"`, read the output, and add
`--apply`.

**4. Check by decoding every image**, not by file size. With `npm run serve` running, paste this
into the browser console at http://127.0.0.1:8080/. Every line should read `2001x1125`:

```js
Promise.all(Object.entries(EXTRA_SLIDES).flatMap(([k, v]) => [].concat(v).map((u, i) => new Promise(r => { const im = new Image(); im.onload = () => r(`${k}[${i}] ${im.naturalWidth}x${im.naturalHeight}`); im.onerror = () => r(`${k}[${i}] *** BROKEN`); im.src = u; })))).then(a => console.log(a.join('\n')))
```

Delete `C:\t` afterwards.

---

## 5. Risk matrix, Python route (not validated for production)

`build_risk_matrix.py` derives every metric from the raw `NAV Data as on <date>.xlsx`. It is the only
route that produces `c` (3Y CAGR) and `RISK_MATRIX_BENCH_SD`, but the UI reads neither, and it does
not produce the `fl` reliability flag. The production route is the Node one (`merge_risk_matrix.js`,
step 10; D43). Use **one** route per month.

**Status, 19-Oct-2026.** This machine has Python 3.14.4 with pandas 3.0.2, numpy 2.4.4, openpyxl
3.1.5 and python-dateutil. Since PR #9 the script is guarded (`KNOWN_ISSUES.md` A22). A run on the
Sep-2026 NAV workbook joined 1,086 of 1,088 funds (exact 1,027, prev_name 32, IDCW→(G) 24, base 3)
and agrees with the live matrix on most fields, but it is not validated for production.

1. **Generate.** There is no dry run: the 4th argument is always written.

   ```bash
   M="monthly-updates/2026-10_Oct-2026"   # in the same call: variables do not survive between calls
   mkdir -p "$M/_review"
   python -I tools/build_risk_matrix.py "$M/NAV Data as on <date>.xlsx" site/index.html "31 Oct 2026" "$M/_review/Centricity_Risk_Matrix.js"
   ```

   - The arguments are, in order: NAV workbook, page (read only), label, output. `--rf <decimal>`
     sets the risk-free rate (default 0.045 = 4.5%; D58, C11). Any misuse exits 2 before anything
     is read.
   - The output must be a `.js` path outside `site/`, in a folder that exists, and not one of the
     inputs; anything else is refused (exit 2). It is written to a temp file and renamed.
   - The label must be a plain short date (`31 Oct 2026`).
   - It stops (exit 1) on two `window.MASTER` literals, duplicate dates, a missing benchmark column,
     or less than 5 years of NAV history.
   - `-I` stops Python importing modules from the current folder and also ignores user
     site-packages. Install pandas, numpy, openpyxl and python-dateutil for all users (not
     `pip install --user`), or the import fails.
2. **Read the printout.**
   - `joined … unjoined`: explain every unjoined fund (Sep-2026: 2 ELSS IDCW names that the Node
     route joins by plan-base). The script prints the first 20.
   - The join tiers: exact, `prev_name`, `IDCW` → `(G)`, then a unique base name.
   - Check `records with metrics` and `with rr`, and `fields omitted as non-finite`.
3. **Bake it into `site/index.html`.** Back up first; no tool does this step.
   - The output is six lines: a two-line header comment, `window.RISK_MATRIX = …;`,
     `window.DATA_DATES = …;`, `window.DATA_DATES.riskMatrix = '…';` and
     `window.RISK_MATRIX_BENCH_SD = …;`. Only the last four go into the page; the page keeps its
     own comment above them.
   - The lines are megabytes long, so do it with Node in Git Bash, from the repository root, not an
     editor. This snippet refuses if the block has moved and writes atomically through blocklib. It
     accepts LF or CRLF output. It was tested on a scratch copy of `site/` on 19-Oct-2026:

   ```bash
   M="monthly-updates/2026-10_Oct-2026"   # in the same call, as above
   node - site/index.html "$M/_review/Centricity_Risk_Matrix.js" <<'EOF'
   const fs = require('fs');
   const B = require('./tools/lib/blocklib');
   const [htmlPath, jsPath] = process.argv.slice(2);
   const html = fs.readFileSync(htmlPath, 'utf8').split('\n');
   const gen = fs.readFileSync(jsPath, 'utf8').replace(/\r\n/g, '\n').replace(/\n$/, '').split('\n').slice(-4);
   const at = html.map((l, i) => l.startsWith('window.RISK_MATRIX = ') ? i : -1).filter(i => i >= 0);
   const ok = gen.length === 4 && gen[0].startsWith('window.RISK_MATRIX = ') && gen[3].startsWith('window.RISK_MATRIX_BENCH_SD = ')
     && at.length === 1 && (html[at[0] + 3] || '').startsWith('window.RISK_MATRIX_BENCH_SD = ');
   if (!ok) { console.error('*** block layout changed - stop'); process.exit(1); }
   html.splice(at[0], 4, ...gen);
   const out = html.join('\n');
   if (!out.trimEnd().endsWith('</html>')) { console.error('*** output does not end with </html>'); process.exit(1); }
   B.writeFileAtomic(htmlPath, out);
   console.log('baked lines ' + (at[0] + 1) + '-' + (at[0] + 4));
   EOF
   ```

   - A Python-route matrix carries no `fl`, so the page shows no reliability marks that month.
4. **Verify.**
   - Run `node tools/verify_page.js site`. Check the `RISK_MATRIX` count, the new
     `DATA_DATES.riskMatrix` and 0 script errors.
   - Spot-check two funds against the workbook, and confirm Rf = 4.5% is still the desk convention
     (D58). The runbook `docs/runbooks/Risk_Matrix_Update_Prompt.md` is out of date (E3): use it for
     its verification ideas only.

**Parity run (suggested; not yet done).**

1. Run step 1 on `monthly-updates/2026-06_Jun-2026/NAV Data as on 30th June 2026.xlsx` with the
   label `30 Jun 2026`, into a scratch file.
2. Compare the values with `docs/archive/Centricity_Risk_Matrix_2026-06-30.js`, which is this
   script's 30-Jun output from the outgoing owner's machine (archived from `site/` on 19-Oct-2026,
   D78).

The 30-Jun output is keyed by the names of that time: compare renamed funds through `prev_name`.
Every fund should match to the stored rounding.

---

## 6. Per-tool traps

Only what an operator must know before running each tool. Line references are to the files in
`tools/`. Defects are tracked in [`docs/KNOWN_ISSUES.md`](../docs/KNOWN_ISSUES.md).

**rename_schemes.js**
- It renames only what it can prove: inception date + AMC (the exact calendar day since PR #14),
  then a 1-to-1 match inside an (AMC, category) cell. Ambiguous pairs are listed and never applied,
  so resolve them by hand (a D61 stop). Every run re-applies earlier renames from `prev_name` and
  `prev_names`, but writes only the blocks that change.
- A stale old-name entry is dropped and listed when the live name already has one (D79); about 15
  per run, most of them re-created by the bake under old workbook names. Harmless.
- The 8 renames it finds in the Sep-2026 Monitor are not applied and wait for the owner
  (`docs/PROJECT_STATE.md`).
- The four refresh-only Monitor sheets are left out of `SHEET_SUB` on purpose (`:50-52`): they mix
  classes, and giving them a sub-category lets tier 3 invent a rename. Do not add them.
- The NUL key separator is now the `'\u0000'` escape; `.gitattributes` still forces textual diffs
  for the file, which does no harm.

**bake_month.js**
- Exactly one file per input: a second copy (`… (1).xlsx`) or a missing file exits 2 and lists the
  names.
- It rewrites `fund_mgr` with the Monitor's single name, so step 9 must follow it. Funds missing
  from this month's analytics keep last month's holdings; they are listed as STALE.
- It also rewrites expense ratios and exit loads from the Monitor; step 7 restores them in the same
  run.
- Four Monitor sheets are **refresh-only** (`REFRESH_ONLY_SHEETS` in `site/index.html`; C19, D80):
  `Debt Oriented34`, `Solution Oriented,ETFs,FOFs`, `Solution Oriented - Childrens ` and `Hybrid`.
  Their rows refresh existing records by exact name and never create one or change a class. Read
  `refresh-only rows not merged`:
  - `(not in MASTER)` is a pending rename (it refreshes once the rename is applied) or a new fund.
    A new fund is added to MASTER by hand with the owner, with a class the owner confirms; never
    by moving the sheet into `SHEET_MAP`.
  - `(listed on a mapped sheet)` is expected: the mapped sheet's figures win.
- `GATE fund rows on unrecognised Monitor sheets` FAILs when the desk adds or renames a fund sheet,
  or when the `index.html` predates the C19 fix. Classify the sheet in `SHEET_MAP` or
  `REFRESH_ONLY_SHEETS` in `site/index.html` (a reviewed code change, D80); there is no override.
  A `WARN expected Monitor sheet missing or with no fund rows` is the reverse case: an expected
  sheet was renamed or lost its header; check the Monitor before applying.
- `CHECK MASTER MF/ETF funds on no sheet of this Monitor` is report only. It includes records whose
  Monitor rows the parser filters (segregated / unclaimed plans) and funds absent from the Monitor
  (Sep-2026: 42, with 11 Debt ETFs, 7 of them matured); they keep their figures. A jump from last
  month means a block of funds was missed.
- A blank Monitor cell never overwrites a stored value, so a return period or debt statistic the
  Monitor leaves blank keeps an older value (C19, C20).

**fill_variant_analytics.js**
- It replaces existing entries (last month's holdings) for funds the workbook does not cover by
  name. Check every `name <- sibling` pair, and resolve every `ambiguous` line by hand.

**rekey_sif_analytics.js**
- A store that would lose a fund fails the run and lists it. That happens only when a SIF changes
  analytics class between months; check it, then re-run with `--allow-shrink`.
- SIF funds under `no analytics anywhere` are absent from the source workbooks. Chase the desk; do
  not invent holdings.

**merge_de_universe.js**
- It joins by company name only (there is no ISIN). A renamed company therefore appears once in
  each of the two lists, and a new listing equal to an existing record's `prev_name` is flagged with
  `!`. Rename it in place, with `prev_name`, only when the sector matches, the market cap is within
  3% and the old name is contained in the new one (D26). Otherwise report it.

**merge_direct_equity_returns.js**
- It deletes every return the file lacks, for every matched stock. A wholly empty column stops the
  run; a partly empty one fails the tenor-coverage gate above 5% lost. Never use the `Analytics/`
  universe file here, and never pass `--allow-coverage-drop` without the owner.

**merge_expense_exitload.js**
- It joins by exact name, so it must run after `rename_schemes.js`.
- The gate that matters is `GATE source rows joined to MASTER`. The `Aditya Birla SL Large Cap`
  sample line is skipped if that fund is absent.

**merge_sif_monitor.js**
- `--as-on` is required and must equal the date `parseSif` stamps, or the run fails. It does not
  check the month in the file name, so type the date carefully.
- The ±300% gate cannot catch a missed ÷100, so spot-check returns between −1% and +1% against the
  workbook. Appended schemes have no AMC prefix and no IRR band.

**merge_fund_managers.js**
- Run it after `bake_month.js`.
- A scheme whose latest To Date is more than 90 days older than the file's latest keeps its
  current value.

**merge_risk_matrix.js**
- The workbook uses names from before the renames, and joins through `prev_name`. Step 1 must
  therefore be applied first.
- It carries the Data Flags as `fl` (`split`, `lowcorr`); the page marks those funds (D74). Read the
  `reliability` line: a big change in the counts means the sheet's wording changed.
- The matrix and its date are written together or not at all.

**update_market_slides.js**
- Only `EXTRA_SLIDES.market` changes; every other byte of `site/Centricity_ExtraSlides.js` is kept.
- A change in the slide count is only flagged, so confirm it.

**update_closing_slides.js**
- It accepts only `disclaimer.png` (a PNG) and `thankyou.jpg` (a JPEG), both 2001×1125.

**merge_pms_performance.js**
- Every `repin` entry in `tools/data/pins.json` must be in the alias map and point to a scheme in
  *this* file, or the run exits 1. When the vendor renames a scheme, edit that entry (the same entry
  serves `pin_pms_alias.js` when it is also marked `pin`). Pins are never guessed (a D61 stop).
- `pms` is replaced wholesale. There is no drop or category gate and no override flag: compare
  `pms N -> M` with last month yourself.
- The exit-load parser reads a year digit only when it stands alone (since PR #10). The file has
  not been seen since (B1), so read the `exit_load` changes on the next run.

**pin_pms_alias.js**
- Apply step 12 first. One bad pin blocks every pin.
- The `pms_alias` key `'Karma Capital Wealth Builder '` ends with a space on purpose; it is listed in
  `trailing_space`, and the tools refuse to run if it is lost.

**merge_reckoner.js**
- A join failure (the deck still lists a fund under a spelling `resolve()` cannot place) drops its
  Select entry and puts the deck name under `DECK NAMES WITH NO MASTER MATCH`; in Sep-2026 it took
  the list from 178 to 160. The tool refuses when a dropped entry's category also holds an
  unmatched deck name, when more than 5% of the list drops, when a category is emptied (D71), or
  when a dropped entry is still listed under a deck heading `GRID` does not map (D76).
- `--accept-drops <n>` waives only the 5% and emptied-category gates, and only when the run drops
  exactly n: use it after the owner has read the DROPPED list. The mirror gate is never waived; fix
  it with a `reckoner` pin in `tools/data/pins.json`, `add_reckoner_funds.js`, or a `NO_MASTER_NOTE`
  entry (exact deck name) for a fund the owner has decided not to add. The unmapped-heading gate is
  never waived either: map the heading in `GRID` (`:63`).
- Both gates pair names heuristically. Still read DROPPED against `DECK NAMES WITH NO MASTER MATCH`
  yourself: a renamed fund filed under a different heading can pass. The tool does not check that
  the deck is newer than the live Select list.
- `NARRATIVE` (`:110`) is hand-copied from the deck's index slides 2–4 and must be re-read every
  month. The trailing spaces in `'DEBT AIF '` and `'Unlisted Equity '` are deliberate.

**merge_aif_performance.js**
- No as-on date is stored for AIF anywhere. Read it off the slide and record it in
  `docs/update-log/<YYYY-MM>_<Mon-YYYY>.md`.
- It scans slides by XML file number, not by deck order. A layout change fails the run; use
  `--allow-layout-change` only after checking the slides. If the issue was the benchmark grid or its
  count, the stored benchmarks are kept. Never run it at the same time as `merge_pms_performance.js`,
  because both rewrite PMS_PERFORMANCE.

**merge_pms_aif_analytics.js**
- It never writes `DATA_DATES.analytics` (the MF analytics label; D70). `--as-on` is still
  required: it is printed for the update log, since no page label shows the look-through date.
- It also writes `var EQ` in the June sibling. Schemes that are absent keep their old look-through
  and are listed as stale. The desk re-issues this file mid-cycle, so re-check the scheme count.

**add_reckoner_funds.js**
- Its data lives in the code. The `ADD` list (`:57`) carries slide numbers from the Aug-2026 deck;
  the slide of a fund not yet in MASTER must name that fund, or the run refuses. Adding a fund from
  a newer deck means updating its slide in `ADD` (a `feat/` PR). Today all four funds are already
  in MASTER and are skipped before the slide check.
- `--pms` is ignored. The PMS figures come from the PMS_PERFORMANCE already in the page, so apply
  step 12 first. A GIFT City fund goes back into `NEW_GIFT` only while the deck still names it.

**merge_bond_list.js**
- `--desk` is required: it names the desk whose rows are replaced and the `(<desk>)` suffix on each
  name. The June-2026 workbook has both desks, OneDigital first. With `--desk` alone the tool takes
  the one tab named for that desk; it refuses a workbook where that is ambiguous (pass `--sheet`),
  and a tab named for the other desk. Confirm with the owner which sheet is which desk anyway.
- The `CHECK … already listed under <other desk>` line never fails. In the June-2026 file the two
  sheets hold the same 14 bonds; applying the Invictus sheet would replace today's 36 Invictus
  bonds, which came from the newer 06-Aug-2026 list.

**merge_analytics.js**
- One `DATA_DATES.analytics` label covers all three classes, so re-baking one class re-dates the
  other two.
- Follow it with steps 3 and 4.

**rebuild_directperf.js**
- It replaces DIRECT_PERF in full with the same builder as step 2. The page's Section 7 Direct
  uploader is a different parser (`KNOWN_ISSUES.md` A7). Prefer step 2 in the normal cycle.

**fold_duplicate_names.js, fold_index_funds.js, split_sif_add_mld.js**
- All three are already applied and are no-ops today. `split_sif_add_mld.js` never overwrites an
  existing MLD record. A stray "Index Fund" that a sibling brings back is reported by
  `fold_index_funds.js`; fix it in that sibling.

**verify_page.js**
- It defaults to `site/`. It hides only the CDN globals' exact "is not defined" errors, so a real
  ReferenceError counts. It compares no counts: compare with `docs/PROJECT_STATE.md` yourself, and
  load the page in the browser as well.

**lib/ and data/**
- `blocklib` refuses a prefix that has two literal assignments. Never add code containing
  `window.MASTER = {` or `window.MASTER = [` anywhere in the page.
- `reck_parse.js` run as a command overwrites its second argument without asking.
- `data/pins.json` is data: edit it only with the owner, and never trim or re-space a name.

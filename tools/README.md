# tools/ — operator's index

Every tool that changes or checks the dashboard data: what it reads, what it writes, what to read
before you let it write, and the exact command. Checked against the code in `tools/` on 16-Oct-2026,
after the move out of the repository root.

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
   - `build_risk_matrix.py` has no dry run. It always writes the file named by its 4th argument.
   - `tools/lib/reck_parse.js`, run as a command, always writes its 2nd argument.
3. **Read the gates, not the exit code.** Eight tools exit 0 from a dry run even when a gate failed,
   because they enforce their gates only under `--apply`:
   - `bake_month`, `merge_de_universe`, `merge_direct_equity_returns`, `merge_expense_exitload`
   - `rebuild_directperf`
   - `merge_pms_performance`, `pin_pms_alias`
   - `update_market_slides`

   `fill_variant_analytics` has no gates at all. The other tools exit 1 from the dry run when a
   gate fails. Any `FAIL`, `***` or `AMBIGUOUS` line means stop.
4. **Back up the six deploy files before the first `--apply` of a run.** They go to
   `backups/<YYYY-MM-DD>_pre-<YYYY-MM>-refresh/` (§2 step 0; `backups/README.md`). Nine tools
   write two files, or the same file twice, with no transaction:
   - two files: `rename_schemes`, `fold_duplicate_names`, `split_sif_add_mld`, `add_reckoner_funds`,
     `merge_pms_aif_analytics`
   - the same file twice: `merge_analytics`, `merge_pms_performance`, `merge_risk_matrix`,
     `merge_sif_monitor`

   A failure halfway therefore leaves a half-applied state. Restore with
   `cp backups/<snapshot>/* site/` and run the step again. Do not patch forward.
5. **Default targets are in `site/`.**
   - 18 tools default `--html` to `site/index.html` (`path.join(__dirname,'..','site','index.html')`)
     and find the sibling files they touch beside it.
   - Three tools default their own file in `site/`: `merge_sif_monitor.js` (`--sibling`),
     `update_market_slides.js` (`--js`) and `update_closing_slides.js` (`--sibling`).
   - **Three tools have no default and must be given `--html site/index.html`:**
     `merge_pms_performance.js`, `pin_pms_alias.js` and `merge_reckoner.js`.
6. **Verify with `node tools/verify_page.js site`** (or `npm run verify`). Run it at the end of
   every run, and after any single `--apply` you are unsure of. It always exits 0, so read its
   output:
   - `duplicate MASTER names    0`
   - `file ends </html>         yes`
   - `script errors (excluding the CDN globals): 0`
   - no `MISSING SIBLING` line
   - `CENTRICITY_SELECT  N   (keys present in MASTER: N)`, with both numbers equal (the rename canary)
   - `DATA_DATES` showing this month's dates

   Explain every count that moved. The GitHub Actions `verify` job enforces every check above
   except the dates before it publishes (`.github/workflows/pages.yml`).
7. **`--as-on` labels are pasted verbatim into JavaScript strings.** Never put `"`, `'`, `\` or `$`
   in one. Keep the styles already on the page:
   - `31st October 2026` for performance, analytics, pms and sif;
   - `31 Oct 2026` for riskMatrix.
8. **Stop and ask the owner (D61)** when you meet:
   - an ambiguous rename;
   - a PMS pin;
   - a Reckoner mismatch;
   - a universe change (for example `add_reckoner_funds.js`);
   - an input that cannot be identified, competes with another file for one slot, is older than
     the live data or belongs to another month;
   - any gate failure.

   Never `--apply` past one. An input that is simply absent is not a stop: skip its steps, its
   domain keeps its previous date, and the report lists it. Everything else is published
   automatically once all checks pass, through the `data/<YYYY-MM>` branch, then a PR, the
   `verify` check and a merge (D68, `docs/DEPLOYMENT.md`).
9. **The usage text each tool prints is from before the move.** It says `node <tool>.js …`, and
   `merge_pms_performance.js` even says `pms_final.js`. Use the commands in this file instead.
10. **To rehearse an `--apply` without touching `site/`,** copy the six deploy files to a scratch
    folder and pass `--html <scratch>/index.html`. The tools find the siblings beside it. Three
    tools take a different flag: `merge_sif_monitor.js` (`--sibling`), `update_market_slides.js`
    (`--js`) and `update_closing_slides.js` (`--sibling`).

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
   duplicated.
   `node tools/rename_schemes.js --monitor "$M/Daily MF monitor_<date>.xlsx"`
2. **Bake.** This step needs the Regular and Direct monitors at the top of `$M` and the three
   Analytics workbooks in `$M/Analytics/`.
   `node tools/bake_month.js --dir "$M" --as-on "31st October 2026"`
3. **Fill the variant analytics.** Run this after every bake.
   `node tools/fill_variant_analytics.js --dir "$M"`
4. **Re-key the SIF analytics.** Run this after every bake.
   `node tools/rekey_sif_analytics.js`
5. **Refresh the Direct Equity universe** (sector, market cap and SEBI market-cap bucket).
   `node tools/merge_de_universe.js "$M/Analytics/Listed Direct Equity_<Month>.xlsx"`
6. **Refresh the Direct Equity returns.** Use the returns file at the top of `$M`, not the
   `Analytics/` file.
   `node tools/merge_direct_equity_returns.js "$M/Listed Direct Equity_<date>.xlsx"`
7. **Refresh the expense ratio and exit load.**
   `node tools/merge_expense_exitload.js --expense "$M/Expense Ratio_<Month>.xlsx" --exitload "$M/Exit Load_<Month>.xlsx"`
8. **Bake the SIF performance** into `site/Centricity_SIF_Refresh.js`. If the run prints
   `NEW schemes added`, run step 4 again afterwards. Step 4 is idempotent, and new rows carry
   `sif_raw` (`site/Centricity_SIF_Refresh.js:201`).
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

12. **PMS performance.**
    `node tools/merge_pms_performance.js "$M/PMS_Scheme_Performance_<Month Year>.xlsx" --as-on "31st October 2026" --html site/index.html`
13. **PMS alias pins.** Apply step 12 first: this tool checks the pins against the PMS block
    already written into the page.
    `node tools/pin_pms_alias.js --html site/index.html`
14. **Centricity Select.**
    `node tools/merge_reckoner.js "$M/Monthly Investment Reckoner - <Month Year>.pptx" --html site/index.html`
    If a drop gate fails because of the count or an emptied category, and the owner confirms the
    DROPPED list is the desk's own change, re-run with `--accept-drops <that many>`. A dropped fund
    whose category also lists an unmatched deck name is never accepted: pin it or use step 14a.
    - **14a. `add_reckoner_funds.js` (on demand).** Only if step 14 lists deck funds with no MASTER
      record (`DECK NAMES WITH NO MASTER MATCH`). This is a universe change, so confirm with the
      owner first. The funds it adds are the ones hard-coded in its `ADD` list (§6).
      `node tools/add_reckoner_funds.js "$M/Monthly Investment Reckoner - <Month Year>.pptx"`
15. **AIF performance and benchmarks.** This uses the same deck as step 14.
    `node tools/merge_aif_performance.js "$M/Monthly Investment Reckoner - <Month Year>.pptx"`
16. **PMS/AIF look-through** (only when the file is supplied). Record the `look-through as on` line
    in the update log; the page has no label for it (D70).
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
| `rename_schemes.js` | The Regular Daily MF Monitor: every sheet that has `Scheme Name` in column A. Also MASTER, the six name-keyed stores, and `var IRR` in `site/Centricity_IRR_Offshore.js`. | `site/index.html`: MASTER (`name`, `prev_name`), EQUITY/HYBRID/DEBT_ANALYTICS, DIRECT_PERF, RISK_MATRIX, CENTRICITY_SELECT. Also `var IRR` in `Centricity_IRR_Offshore.js`. | Every `old -> new [… · how]` line: check each `inception` and `category` pairing. The `*** AMBIGUOUS — not renamed` list. `new to MASTER`, where a jump means renames were missed. Any `(skipped …)` line. The hard gates exit 1 in the dry run. | `node tools/rename_schemes.js --monitor "<Regular monitor>.xlsx" [--html <p>]` |
| `bake_month.js` | In `--dir`: the Regular monitor (`Daily MF monitor…`, not `_Direct`) and `Daily MF Monitor_Direct…`. In `--dir/Analytics/`: `Equity Analytics_…`, `Hybrid Analytics_…`, `Debt Analytics_…`. It parses them with the page's own `REFRESH` parsers, except DIRECT_PERF, which has its own parser. | `site/index.html`: MASTER, EQUITY/HYBRID/DEBT_ANALYTICS, MF_BENCHMARK_PERF, DIRECT_PERF (replaced in full), `DATA_DATES.performance` and `.analytics`. | The five source files it picked. `NEW funds added to MASTER`: about 200 means step 1 was skipped. The STALE list: these funds keep last month's holdings. DIRECT_PERF matched/unmatched and `lose their Direct overlay`. The duplicate and no-shrink gates are enforced only under `--apply`. | `node tools/bake_month.js --dir "<month folder>" --as-on "<label>" [--as-on-analytics "<label>"] [--html <p>]` |
| `fill_variant_analytics.js` | The three `Analytics/` workbooks, through `REFRESH.parseAnalytics`, and MASTER's Equity/Hybrid/Debt Mutual Fund, Index Fund and ETF records. | EQUITY/HYBRID/DEBT_ANALYTICS. It adds missing names **and replaces** last month's entries. | `eligible · covered by name · missing` per class. Each `name <- sibling` pair must be the same scheme. Read `still no entry anywhere`. There are no gates. | `node tools/fill_variant_analytics.js --dir "<month folder>" [--html <p>]` |
| `rekey_sif_analytics.js` | The three analytics stores. MASTER after the June, IRR and SIF siblings have run in a vm (for the `sif_raw` join key). | The three analytics stores, with SIF keys moved from `sif_raw` to the MASTER name. | `GATE no workbook-named SIF keys left behind` (enforced). The `re-keyed` list. `no analytics anywhere … chase upstream`. `GATE store sizes unchanged` only prints. | `node tools/rekey_sif_analytics.js [--html <p>]` |
| `merge_de_universe.js` | `Analytics/Listed Direct Equity_<Month>.xlsx`, about 5,300 rows: first sheet, header in row 1. | MASTER Direct Equity: `sub_category` (= sector), `mktcap`, `sebi_mcap`. It appends new listings. | `GATE top-10 … Large Cap` and `GATE duplicate names` (both only under `--apply`). Reconcile `in MASTER but not in this month's file` against `new listings`. | `node tools/merge_de_universe.js "<Analytics/Listed Direct Equity_<Month>.xlsx>" [--html <p>]` |
| `merge_direct_equity_returns.js` | `Listed Direct Equity_<date>.xlsx` (returns, about 8,400 rows). It finds the header row by `Company Name`. Values are percent and are divided by 100. | MASTER Direct Equity `r3m r6m r1y r2y r3y r5y`. Each is set, or **deleted** when the file lacks it. | It refuses when a return column is wholly empty: never force it. Check matched by ISIN / by name / unmatched. The return min/max must look like decimals. The top-10 Large Cap gate is enforced only under `--apply`. | `node tools/merge_direct_equity_returns.js "<Listed Direct Equity_<date>.xlsx>" [--html <p>]` |
| `merge_expense_exitload.js` | `Expense Ratio_…` and `Exit Load_…`: `Sheet1`, or else the first sheet. It finds the `Scheme Name` header below any banner. | MASTER `expense` (`Ratio`/100) and `exit_load` (`Remark` text). DIRECT_PERF `expense` (`Direct Plan Ratio`/100), for existing names only. | `GATE expense range` (fails above 8%), `GATE duplicate names` and `GATE source rows joined to MASTER` (fails at 0) (all only under `--apply`). Also `rejected out-of-range` and `placeholder cells skipped`. | `node tools/merge_expense_exitload.js --expense "<xlsx>" --exitload "<xlsx>" [--html <p>]` (at least one of the two) |
| `merge_sif_monitor.js` | The SIF Monitor, parsed by the sibling's own `REFRESH.parseSif` in a vm, and `site/Centricity_SIF_Refresh.js`. | `site/Centricity_SIF_Refresh.js` only: the `var SIF` block and the `DATA_DATES.sif` line. | Returns within ±300%, duplicate names and a shrinking SIF block (all exit 1 in the dry run). Coverage. The `DATA_DATES.sif` value. `NEW schemes added`. | `node tools/merge_sif_monitor.js "<SIF Monitor_<date>.xlsx>" --as-on "<label>" [--sibling <p>]` |
| `merge_fund_managers.js` | `Fund Manager Data_<date>.xlsx`: first sheet, header in row 1, one row per manager stint. | MASTER `fund_mgr` (the full current team, longest-serving first). | The latest To Date and the cutoff. Rosters that are too stale. Matched exact / normalised / unmatched. The `was/now` samples. Blank-`fund_mgr` and duplicate gates exit 1 in the dry run. | `node tools/merge_fund_managers.js "<Fund Manager Data_<date>.xlsx>" [--html <p>]` |
| `merge_risk_matrix.js` | `Fund Risk Ratios & 3Y Rolling - All Funds (as on <date>).xlsx`: the `Risk Ratios` sheet, plus an optional `Data Flags` sheet. Also MASTER (`prev_name`) and the current RISK_MATRIX (for `bm`). | RISK_MATRIX, replaced in full (`c` dropped, `bm` kept), and the `window.DATA_DATES.riskMatrix = '…';` line. It does not touch RISK_MATRIX_BENCH_SD or `site/Centricity_Risk_Matrix.js`. | Six gates, enforced in the dry run: every key is in MASTER, no ambiguous joins, no collisions, no shrink (funds, metrics), benchmark coverage. Check the join tiers (exact / prev_name / plan-base) and the unmatched list. | `node tools/merge_risk_matrix.js "<Fund Risk Ratios … .xlsx>" --as-on "<label>" [--html <p>]` |
| `update_market_slides.js` | `slide<N>.jpg` or `.png` in `--slides`, sorted by N. Also the current `EXTRA_SLIDES` (the sibling is executed in a vm). | `site/Centricity_ExtraSlides.js`, **rewritten whole**, with `EXTRA_SLIDES.market` replaced. | Every slide must match the current `market[0]` size (2001×1125). Check the `GATE slide count … *** CHANGED` line (confirm it; it is not a failure) and the list of untouched keys. The dry run exits 0 on failure. | `node tools/update_market_slides.js --slides "<dir>" [--js <p>]` |

### Reckoner cycle

| Tool | Reads | Writes (only with `--apply`) | Gates to read in the dry run | CLI |
|---|---|---|---|---|
| `merge_pms_performance.js` | `PMS_Scheme_Performance_<Month Year>.xlsx`. The sheet is found by its header (`Scheme Name` + `Scheme Return 1 Year`), and 25 columns are required. Also PMS_PERFORMANCE, PMS_PERF_ALIAS and MASTER. | `PMS_PERFORMANCE.pms`, **replaced wholesale** (`aif` and `benchmarks` are carried over). The `REPIN` entries in PMS_PERF_ALIAS. `DATA_DATES.pms`. | `AUM column treated as …` (rupees or crore). The duplicate-row list. `pms N -> M`. The coverage and range GATE lines. The re-pointed pins table: check each 1Y/AUM. The dry run exits 0 on failure. | `node tools/merge_pms_performance.js "<PMS_Scheme_Performance_<Month Year>.xlsx>" --as-on "<label>" --html site/index.html` |
| `pin_pms_alias.js` | PMS_PERF_ALIAS, `PMS_PERFORMANCE.pms` as baked, and the MASTER PMS records. The pins are hard-coded in `PINS`. | PMS_PERF_ALIAS. | Any `*** not in the alias map` or `*** key not in PMS_PERFORMANCE.pms` line: one blocks **all** pins. The per-pin 1Y/3Y/AUM lines. `GATE still pinned null`. The dry run exits 0 on failure. | `node tools/pin_pms_alias.js --html site/index.html` |
| `merge_reckoner.js` | The Reckoner `.pptx`: its performance grids (8+ columns, presentation order) and its narrative slides. Also CENTRICITY_SELECT, and MASTER (`name`, `prev_name`, `sub_category`). | CENTRICITY_SELECT. | `N -> M (+added, -dropped)`. `GATE categories` must be 33. `RESOLVED VIA prev_name`. `NEW ENTRIES WITH NO RATIONALE`. Write gates (the dry run exits 1 on any): every key in MASTER; no dropped fund whose category also holds an unmatched deck name; at most 5% dropped; no category emptied (D71). | `node tools/merge_reckoner.js "<Monthly Investment Reckoner - <Month Year>.pptx>" --html site/index.html [--accept-drops <n>]` |
| `merge_aif_performance.js` | Two grids in the same `.pptx`: the `AIF PERFORMANCE` grid, and the `PMS – EQUITY` grid (benchmarks with 2Y). Also PMS_PERFORMANCE and the MASTER AIF records. | `PMS_PERFORMANCE.aif`, rebuilt wholesale. `.benchmarks`, only if the count matches. `pms` is left untouched. | The benchmark slide, or `(none — 2Y will be dropped)`. The m-cap sub-header note. The per-fund old→new table. `deck rows with no MASTER AIF record`. Gates: returns within ±100%, m-cap sum ≤ 102%, AIF coverage must not fall. | `node tools/merge_aif_performance.js "<Reckoner .pptx>" [--html <p>]` |
| `merge_pms_aif_analytics.js` | `PMS & AIF Analytics <Month Year>.xlsx`: first sheet only; `Holding(%)` is a fraction. Also MASTER, EQUITY_ANALYTICS and `var EQ` in `site/Centricity_June_Refresh.js`. | EQUITY_ANALYTICS (the schemes it builds are replaced). Also `var EQ` in `Centricity_June_Refresh.js`, for shared keys. Never `DATA_DATES` (D70). | The `mapped N of M` table (total %). `no MASTER instrument — holdings skipped`. The sibling EQ keys it refreshes. Totals must be 95–105. The coverage gate. The `look-through as on` line, for the update log. | `node tools/merge_pms_aif_analytics.js "<PMS & AIF Analytics <Month Year>.xlsx>" --as-on "<label>" [--html <p>]` |
| `add_reckoner_funds.js` (on demand) | The Reckoner `.pptx`, at the slide numbers hard-coded in `ADD`. Also MASTER, CENTRICITY_SELECT, PMS_PERF_ALIAS, PMS_PERFORMANCE, and `NEW_GIFT` in the June sibling. | MASTER (new records), CENTRICITY_SELECT, PMS_PERF_ALIAS. GIFT City adds also go into `NEW_GIFT` in `Centricity_June_Refresh.js`. | `already in MASTER — skipping` (all four today). Each `=== <fund> ===` block: IRR band and peers, AUM conversion, rationale. `MASTER baseline N -> M`. The dry run exits 1 on failure. | `node tools/add_reckoner_funds.js "<Reckoner .pptx>" [--html <p>]` |

### Periodic and alternative routes

| Tool | Reads | Writes (only with `--apply`) | Gates to read in the dry run | CLI |
|---|---|---|---|---|
| `merge_bond_list.js` | `Bond List_<date>.xlsx`: one sheet, chosen by `--sheet`, else the only sheet, else the one tab named for the desk; fixed columns B–F and H (row 1 checked), data from row 3. Also the MASTER line. | MASTER Bonds rows of the `--desk` named (`Invictus` or `OneDigital`); every other desk is left as it is. | The `desk … sheet …` line. `! row N has no IRR`, name-vs-cell year mismatches, duplicate blocks with differing IRR or rating, the maturity gate (after today), the maturity range, and the full new list. The dry run exits 1 on failure. | `node tools/merge_bond_list.js "<Bond List_<date>.xlsx>" --desk <Invictus\|OneDigital> [--sheet "<tab>"] [--html <p>]` |
| `update_closing_slides.js` | `<dir>/disclaimer.png` and `<dir>/thankyou.jpg`, both 2001×1125. Also `EXTRA_SLIDES`. | `site/Centricity_ExtraSlides.js`: the `disclaimer` and `thankyou` keys only (blocklib splice). | The per-key dimensions and `OK` lines, old KB → new KB, and the payload size. | `node tools/update_closing_slides.js --dir "<render dir>" [--sibling <p>]` |
| `merge_analytics.js` | One to three Analytics workbooks, through `REFRESH.parseAnalytics`. | The given analytics stores and `DATA_DATES.analytics`. | `before -> after`, refreshed/added, the STALE list, the holdings-total gate (30–130%), and `refreshed nothing — wrong file or wrong kind?`. The dry run exits 1 on failure. | `node tools/merge_analytics.js [--equity "<xlsx>"] [--hybrid "<xlsx>"] [--debt "<xlsx>"] --as-on "<label>" [--html <p>]` |
| `rebuild_directperf.js` | The Direct monitor, through the page's `REFRESH.parseMfMonitorDirect`. | DIRECT_PERF, replaced in full. | The scale GATE lines (decimals; m-cap sums to 1 ± 0.05). `expense present after rebuild`. `DIRECT_PERF old -> new`: a drop means lost overlays, which are not listed. The dry run exits 0. | `node tools/rebuild_directperf.js "<Daily MF Monitor_Direct_<date>.xlsx>" [--html <p>]` |
| `build_risk_matrix.py` | `NAV Data as on <date>.xlsx` (three sheets) and the MASTER in the page. | The `out.js` you name, **always**. It has no dry run. | `unjoined` must be 0. Records with metrics, and records with `rr`. | See §5 |

Some inputs have no tool and are edited by hand, each through a PR:

| Input | Where to edit |
|---|---|
| SIF Master List | `var SIF` in `site/Centricity_SIF_Refresh.js` |
| Gift City Master List | `NEW_GIFT` in `site/Centricity_June_Refresh.js` **and** the embedded MASTER block (D24; the block only through `tools/lib/blocklib.js`); Off Shore funds (`var OFFSHORE`) in `site/Centricity_IRR_Offshore.js` |
| Expected IRR ranges | `var IRR` in `site/Centricity_IRR_Offshore.js`, keyed by exact MASTER name |

### One-off / idempotent (all already applied; a dry run today reports nothing to do)

| Tool | Reads | Writes (only with `--apply`) | Gates to read in the dry run | CLI |
|---|---|---|---|---|
| `fold_duplicate_names.js` | The Regular monitor and the five hand-listed `PAIRS`. MASTER, the six stores and the IRR sibling. `site/Centricity_Risk_Matrix.js`, for a note only. | Only when a fold exists: MASTER, the six stores and `var IRR`. | Today: `already folded` ×5, then `nothing to fold`. | `node tools/fold_duplicate_names.js --monitor "<Regular monitor>.xlsx" [--html <p>]` |
| `fold_index_funds.js` | MASTER. | MASTER: `product_class` `Index Fund` becomes `Mutual Fund`. | Today: `nothing to fold — already done`. Re-run it only if a stray `Index Fund` record appears. | `node tools/fold_index_funds.js [--html <p>]` |
| `split_sif_add_mld.js` | MASTER and `var SIF` in the SIF sibling. | MASTER (MLD upsert) and `var SIF` (SIF split by strategy). Both are rewritten on every `--apply`. | `*** strategy not recognised`. An MLD `updating field old->new` line means the run would overwrite a hand edit. | `node tools/split_sif_add_mld.js [--html <p>]` |

### Verification

| Tool | Reads | Writes | What to read | CLI |
|---|---|---|---|---|
| `verify_page.js` | `<dir>/index.html` and the five local `<script src>` siblings, in document order, in a vm. It skips the CDN scripts. | Nothing. | Rule 6 in §1. | `node tools/verify_page.js site` or `npm run verify` |
| `.claude/serve.js` (not in `tools/`) | `site/` only, on 127.0.0.1 only. | Nothing. | The browser checks in `docs/TESTING.md`. | `npm run serve` (http://127.0.0.1:8080/) |

### Libraries (`tools/lib/`)

| Library | Reads | Writes | Fails on | API |
|---|---|---|---|---|
| `blocklib.js` | The file the caller names. It finds the **first** occurrence of a prefix such as `window.MASTER = ` and parses the JSON literal after it. 16 tools use it. | `writeBlocks` overwrites the whole file in place, with no temp file. It keeps the `</html>` guard when the input ended with `</html>`. | `not found`, `is not followed by a literal`, `unbalanced literal`, a JSON parse error, and a lost `</html>`. | `locate(str,prefix)`, `read(file,prefix)`, `writeBlocks(file,[{prefix,value}])`, `matchEnd(str,i)` |
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

## 5. Risk matrix, Python route (unvalidated on pandas 3)

`build_risk_matrix.py` is the canonical generator. It derives every metric from the raw
`NAV Data as on <date>.xlsx`. It is the only route that produces `c` (3Y CAGR) and
`RISK_MATRIX_BENCH_SD`, but the UI reads neither. The monthly default is the Node route
(`merge_risk_matrix.js`, step 10). Use **one** route per month.

**Status, 16-Oct-2026.** This machine has Python 3.14.4 with pandas 3.0.2, numpy 2.4.4, openpyxl
3.1.5 and python-dateutil. The script has never been run on pandas 3.x, so treat its output as
unvalidated until a parity run passes (see the end of this section).

1. **Generate.** There is no dry run: the 4th argument is always overwritten.

   ```bash
   M="monthly-updates/2026-10_Oct-2026"   # in the same call: variables do not survive between calls
   mkdir -p "$M/_review"
   python -I tools/build_risk_matrix.py "$M/NAV Data as on <date>.xlsx" site/index.html "31 Oct 2026" "$M/_review/Centricity_Risk_Matrix.js"
   ```

   - The arguments are, in order: NAV workbook, page (read only), label, output.
   - **Never pass `site/index.html` or any other deploy file as the 4th argument.** It would be
     overwritten without a prompt.
   - Keep the output outside `site/`. `site/Centricity_Risk_Matrix.js` is the stale 30-Jun output.
     The page does not load it, and it stays only for parity (D69).
   - The label must not contain an apostrophe; it is written inside single quotes.
   - `-I` stops Python importing modules from the current folder and also ignores user
     site-packages. Install pandas, numpy, openpyxl and python-dateutil for all users (not
     `pip install --user`), or the import fails.
2. **Read the printout.**
   - `unjoined` must be 0. The script prints the first 20 unjoined names.
   - Check `records with metrics` and `with rr`.
   - The join has **no `prev_name` tier**. It tries exact, then `IDCW` → `(G)`, then a share-class
     strip. NAV names that predate a SEBI rename therefore stay unjoined; investigate each one.
3. **Bake it into `site/index.html`.** Back up first; no tool does this step.
   - The output is six lines: a two-line header comment, `window.RISK_MATRIX = …;`,
     `window.DATA_DATES = …;`, `window.DATA_DATES.riskMatrix = '…';` and
     `window.RISK_MATRIX_BENCH_SD = …;`.
   - They replace the same six lines inside the page's inline Risk Matrix `<script>` (L5089–L5094
     on 16-Oct-2026).
   - The lines are megabytes long, so do it with Node in Git Bash, not an editor. This snippet
     refuses if the block has moved. Python on Windows writes CRLF line endings, so the snippet
     turns them back into LF. It was tested on a scratch copy of `site/` on 16-Oct-2026 with LF
     and CRLF input:

   ```bash
   M="monthly-updates/2026-10_Oct-2026"   # in the same call, as above
   node - site/index.html "$M/_review/Centricity_Risk_Matrix.js" <<'EOF'
   const fs = require('fs');
   const [htmlPath, jsPath] = process.argv.slice(2);
   const html = fs.readFileSync(htmlPath, 'utf8').split('\n');
   const gen = fs.readFileSync(jsPath, 'utf8').replace(/\r\n/g, '\n').replace(/\n$/, '').split('\n');
   const start = html.findIndex(l => l.startsWith('/* Centricity_Risk_Matrix.js'));
   const end = html.findIndex(l => l.startsWith('window.RISK_MATRIX_BENCH_SD = '));
   if (gen.length !== 6 || start < 0 || end !== start + 5) { console.error('*** block layout changed - stop'); process.exit(1); }
   html.splice(start, 6, ...gen);
   const out = html.join('\n');
   if (!out.trimEnd().endsWith('</html>')) { console.error('*** output does not end with </html>'); process.exit(1); }
   fs.writeFileSync(htmlPath, out, 'utf8');
   console.log('baked lines ' + (start + 1) + '-' + (end + 1));
   EOF
   ```
4. **Verify.**
   - Run `node tools/verify_page.js site`. Check the `RISK_MATRIX` count, the new
     `DATA_DATES.riskMatrix` and 0 script errors.
   - Then run the checks in `docs/runbooks/Risk_Matrix_Update_Prompt.md` ("Verify before
     deploying"). Spot-check two funds against the workbook, and confirm Rf = 4.5% is still the
     desk convention (D58).

**Parity run (suggested; not yet done).**

1. Run step 1 on `monthly-updates/2026-06_Jun-2026/NAV Data as on 30th June 2026.xlsx` with the
   label `30 Jun 2026`, into a scratch file.
2. Compare the values with `site/Centricity_Risk_Matrix.js`, which is this script's 30-Jun output
   from the outgoing owner's machine.

Funds renamed since Aug-2026 will not join, because the run uses today's MASTER names. Every other
fund should match to the stored rounding.

---

## 6. Per-tool traps

Only what an operator must know before running each tool. Line references are to the files in
`tools/`. Defects are tracked in [`docs/KNOWN_ISSUES.md`](../docs/KNOWN_ISSUES.md).

**rename_schemes.js**
- It renames only what it can prove: inception date + AMC, then a 1-to-1 match inside an
  (AMC, category) cell. Ambiguous pairs are listed and never applied, so resolve them by hand
  (a D61 stop). Every run re-applies earlier renames from `prev_name`, so `--apply` always rewrites
  seven blocks, even when nothing is new.
- The source contains a literal NUL byte (`rename_schemes.js:146`). Git would treat the file as
  binary, so `.gitattributes` forces textual diffs for it (`tools/rename_schemes.js diff`). Never
  re-save it in an editor that strips control characters.

**bake_month.js**
- The dry run exits 0 even when a gate failed (`:146` returns before `:147`).
- It takes the first file in the folder whose name matches. A second copy (`… (1).xlsx`) or an old
  monitor left in `$M` is picked silently, so keep one file per input.
- It rewrites `fund_mgr` with the Monitor's single name, so step 9 must follow it. Funds missing
  from this month's analytics keep last month's holdings; they are listed as STALE.

**fill_variant_analytics.js**
- It crashes with a TypeError, and no friendly message, if any of the three Analytics workbooks is
  missing.
- It also replaces existing entries, whatever its header comment says. There is no ambiguity
  report, so check every `name <- sibling` pair.

**rekey_sif_analytics.js**
- `GATE store sizes unchanged` only prints. The enforced gate is
  `no workbook-named SIF keys left behind`.
- SIF funds under `no analytics anywhere` are absent from the source workbooks. Chase the desk; do
  not invent holdings.

**merge_de_universe.js**
- The header must be in row 1; a banner row aborts the run with `column layout changed`.
- It joins by company name only (there is no ISIN). A renamed company therefore appears once in
  each of the two lists. Rename it in place, with `prev_name`, only when the sector matches, the
  market cap is within 3% and the old name is contained in the new one (D26). Otherwise report it.
- `industry` is read but never written.

**merge_direct_equity_returns.js**
- It deletes every return the file lacks, for every matched stock. The empty-column refusal catches
  only a *wholly* empty column. Never use the `Analytics/` universe file here.
- It finds MASTER by physical line: a line starting `<script>window.MASTER = `. `merge_bond_list.js`
  does the same. Never reformat that line of `site/index.html`.

**merge_expense_exitload.js**
- It joins by exact name, so it must run after `rename_schemes.js`.
- It throws before writing if its hard-coded sample fund `Aditya Birla SL Large Cap Fund-Reg(G)`
  (`:131`) is ever renamed or removed. Fix the sample through a `fix/` PR.
- `GATE MASTER count unchanged` can never fail; the gate that matters is
  `GATE source rows joined to MASTER`.

**merge_sif_monitor.js**
- Always pass `--as-on`. Without it the date comes from the file name or the workbook. If neither
  parses, the old `DATA_DATES.sif` is re-stamped with a fresh "baked from" comment.
- The ±300% gate cannot catch a missed ÷100, so spot-check returns between −1% and +1% against the
  workbook. Appended schemes have no AMC prefix and no IRR band.

**merge_fund_managers.js**
- Run it after `bake_month.js`.
- The header must be in row 1.
- A scheme whose latest To Date is more than 90 days older than the file's latest keeps its
  current value.

**merge_risk_matrix.js**
- The workbook uses names from before the renames, and joins through `prev_name`. Step 1 must
  therefore be applied first.
- `Data Flags` are counted, not shown: funds the source calls unreliable still display numbers.
- If it exits with `matrix written, date NOT stamped`, restore the backup.

**update_market_slides.js**
- It rewrites `site/Centricity_ExtraSlides.js` whole: line 1 plus the `EXTRA_SLIDES` assignment.
  Anything else in that file is lost.
- The size reference is the current `market[0]`. A change in the slide count is only flagged, so
  confirm it. The dry run exits 0 on a dimension failure.

**update_closing_slides.js**
- It accepts only `disclaimer.png` and `thankyou.jpg`. Its "untouched keys" and "market count"
  gates cannot fail, so read the dimension lines.

**merge_pms_performance.js**
- Every `REPIN` key (`:21`) must be in the alias map, and must point to a scheme in *this* file,
  or the run exits 1. When the vendor renames a scheme, edit `REPIN` and `PINS`
  (`pin_pms_alias.js:13`) together. Pins are never guessed (a D61 stop).
- `pms` is replaced wholesale, and the dry run exits 0 on a failed gate. The `still pinned null`
  list it prints is a static note (`:39`); `verify_page.js` prints the real null-pin count.

**pin_pms_alias.js**
- Apply step 12 first. One bad pin blocks every pin.
- The key `'Karma Capital Wealth Builder '` ends with a space on purpose; never trim it.

**merge_reckoner.js**
- A join failure (the deck still lists a fund under a spelling `resolve()` cannot place) drops its
  Select entry and puts the deck name under `DECK NAMES WITH NO MASTER MATCH`; in Sep-2026 it took
  the list from 178 to 160. The tool now refuses when a dropped entry's category also holds an
  unmatched deck name, when more than 5% of the list drops, or when a category is emptied (D71).
- `--accept-drops <n>` waives only the 5% and emptied-category gates, and only when the run drops
  exactly n: use it after the owner has read the DROPPED list. The mirror gate is never waived; fix
  it with a `PIN`, `add_reckoner_funds.js`, or a `NO_MASTER_NOTE` entry for a fund the owner has
  decided not to add.
- `NARRATIVE` (`:77`) is hand-copied from the deck's index slides 2–4 and must be re-read every
  month. `PIN` (`:102`) holds hand pins. The trailing spaces in `'DEBT AIF '` and
  `'Unlisted Equity '` are deliberate.

**merge_aif_performance.js**
- No as-on date is stored for AIF anywhere. Read it off the slide and record it in
  `docs/update-log/<YYYY-MM>_<Mon-YYYY>.md`.
- It scans slides by XML file number, not by deck order. The m-cap columns are assumed to be the
  last four. Benchmarks are replaced only when the count matches; otherwise they are carried over
  silently. Never run it at the same time as `merge_pms_performance.js`, because both rewrite
  PMS_PERFORMANCE.

**merge_pms_aif_analytics.js**
- It never writes `DATA_DATES.analytics` (the MF analytics label; D70, `KNOWN_ISSUES.md` A3 closed).
  `--as-on` is still required: it is printed for the update log, since no page label shows the
  look-through date.
- It reads the first sheet only. It also writes `var EQ` in the June sibling. Schemes that are
  absent keep their old look-through. The desk re-issues this file mid-cycle, so re-check the
  scheme count.

**add_reckoner_funds.js**
- Its data lives in the code. The `ADD` list (`:25`) carries slide numbers from the Aug-2026 deck,
  so adding a fund is a code change (a `feat/` PR). Today all four funds are already in MASTER.
- `--pms` is ignored. The PMS figures come from the PMS_PERFORMANCE already in the page, so apply
  step 12 first. Every `--apply` puts `Motilal Oswal Alternative Investment (Inbound)` back into
  `NEW_GIFT` if it is missing, so deleting it from the sibling by hand does not stick.

**merge_bond_list.js**
- `--desk` is required: it names the desk whose rows are replaced and the `(<desk>)` suffix on each
  name. The June-2026 workbook has both desks, OneDigital first. With `--desk` alone the tool takes
  the one tab named for that desk; it refuses a workbook where that is ambiguous (pass `--sheet`),
  and a tab named for the other desk. Confirm with the owner which sheet is which desk anyway.
- Run on the June-2026 file, `--desk OneDigital` reproduces today's 14 OneDigital rows (two
  `irr_low` values differ only by float noise, `0.085` vs `0.08499999999999999`). The June
  Invictus sheet holds the same 14 bonds; applying it would replace today's 36 Invictus bonds,
  which came from the newer 06-Aug-2026 list.

**merge_analytics.js**
- One `DATA_DATES.analytics` label covers all three classes, so re-baking one class re-dates the
  other two.
- Follow it with steps 3 and 4.

**rebuild_directperf.js**
- It replaces DIRECT_PERF in full, using the page's parser, not `bake_month.js`'s private one, so
  results can differ. Lost overlays show only as a count. Prefer step 2 in the normal cycle.

**fold_duplicate_names.js, fold_index_funds.js, split_sif_add_mld.js**
- All three are already applied. `split_sif_add_mld.js --apply` writes its hard-coded Neo MLD
  record back over any later hand edit, so do not run it for a no-op.

**verify_page.js**
- It needs the folder argument (`site`); without one it throws.
- It hides every error containing ` is not defined`, to skip the CDN globals, so a genuine
  ReferenceError from a typo is hidden too. Always load the page in the browser as well.

**lib/**
- `blocklib` targets the **first** occurrence of each prefix. Never add code containing
  `window.MASTER = {` or `window.MASTER = [` above the data blocks.
- `reck_parse.js` run as a command overwrites its second argument without asking.

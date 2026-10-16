# Known issues

This is the single register of confirmed defects, risks and gaps that the owner (Centricity Products
team, GitHub account `productsteamcentricity`) inherited at handover on 16-Oct-2026. **Apart from C2
(the stale README, replaced by the transfer's docs), none of them was fixed during the transfer.** Fix
each one as its own task on a `fix/…` branch (D68), never inside a data refresh.

**How to use this file**

- Before every monthly refresh, read the items whose *Next refresh* column says **Blocks** or
  **Affects** (summary table below).
- Issue IDs are a group letter and a number (A, B, C, R, E, F). `D<n>` always means a decision in
  `docs/DECISIONS.md`; the repository, security and hosting issues were numbered D1–D7 before
  16-Oct-2026 and are now R1–R7.
- New defect: add a row and a section, using the next free ID in its group. Fixed: set *Status* to
  `Closed <date> (<commit>)`, keep the section and add one line saying what changed.
- Line numbers were checked on 16-Oct-2026 against the files as they are now (`site/`, `tools/`).
  The reorganisation commit `cd05c97` edited tool lines in place, so tool line numbers match the
  pre-move audit. Re-find a line with Grep before editing; never Read `site/index.html` whole.
- **[inference]** marks a claim that was reasoned from code, not tested.

**Severity:** **P1** data-integrity risk (wrong or misleading data could reach a client-facing page,
deck or workbook) · **P2** operational (a step can fail, be blocked or need manual care; or a latent
defect) · **P3** cosmetic or documentation only.

**Next refresh** means the Oct-2026 data cycle (as on 31-Oct-2026), including the PMS and Reckoner
catch-up (`docs/PRD.md` §11.3). **Blocks**: a step cannot be completed until the item is handled.
**Affects**: the step runs, but needs the workaround. **—**: not involved.

## Before the next refresh

1. Ask the desk for the missing inputs: the PMS performance file (B1), the October Reckoner deck
   (B2), the final issue of the market deck (B3), analytics workbooks that include SIFs (B4), Fund
   Manager Data (B5, C15) and PMS & AIF Analytics (B6).
2. Read every `GATE` line yourself. A dry run's exit code is not a verdict (A2), and
   `verify_page.js` hides some script errors (A23).
3. Start from a clean git tree, snapshot the six deploy files into `backups/`, and keep OneDrive from
   syncing mid-run (A8, R6).
4. Do not run `merge_bond_list.js` until A1 is handled.
5. If a PMS & AIF Analytics file arrives, mind the analytics date (A3).
6. Reckoner cycle: compare the DROPPED and NO-MASTER-MATCH lists by hand (A4), and expect to edit the
   pin maps (A18). Decide the Mosaic and Motilal GIFT City items with the desk (C4, C5).

## Summary

| ID | Title | Area | Sev | Status | Next refresh | Where |
|---|---|---|---|---|---|---|
| A1 | Bond List tool loads the first sheet and labels it Invictus | Tools: bonds | P1 | Open | **Blocks** a Bond List run | `tools/merge_bond_list.js:42`, `:50` |
| A2 | Ten tools exit 0 from a dry run when a gate failed | Tools | P2 | Open | **Affects** | `tools/bake_month.js:146` and 9 more |
| A3 | PMS/AIF look-through tool re-dates the MF analytics | Tools: PMS/AIF | P1 | Open | **Affects** | `tools/merge_pms_aif_analytics.js:160` |
| A4 | Reckoner merge has no gate against dropped funds | Tools: Reckoner | P1 | Open | **Affects** | `tools/merge_reckoner.js:275-276` |
| A5 | Rename tool keeps orphan keys and loses earliest names | Tools: rename | P2 | Open | **Affects** | `tools/rename_schemes.js:198`, `:211-213` |
| A6 | Excel dates read one day early on an IST machine | Tools + page | P2 | Open | — | `tools/rename_schemes.js:76`; `site/index.html:3349` |
| A7 | Two DIRECT_PERF builders; unchecked splice in `rebuild_directperf.js` | Tools: Direct | P2 | Open | — | `tools/bake_month.js:217-306`; `tools/rebuild_directperf.js:92-98` |
| A8 | Writes are in place, non-atomic and without backup | Tools | P2 | Open | **Affects** | `tools/lib/blocklib.js:47` |
| A9 | Date labels spliced in unescaped, by first match | Tools | P2 | Open | **Affects** | `tools/bake_month.js:169-170` |
| A10 | Two tools find MASTER by physical line | Tools | P2 | Open | — | `tools/merge_direct_equity_returns.js:131`; `tools/merge_bond_list.js:165` |
| A11 | DE returns join deletes returns the file lacks | Tools: DE | P2 | Open | **Affects** | `tools/merge_direct_equity_returns.js:152-155` |
| A12 | Expense tool: hard-coded sample fund, gate that cannot fail | Tools: expense | P2 | Open | **Affects** | `tools/merge_expense_exitload.js:128-132` |
| A13 | Header assumed on row 1 (DE universe, fund managers) | Tools | P2 | Open | **Affects** | `tools/merge_de_universe.js:29`; `tools/merge_fund_managers.js:38` |
| A14 | DE universe joins by name only; industry never written | Tools: DE | P2 | Open | **Affects** | `tools/merge_de_universe.js:32`, `:66-73` |
| A15 | Risk-matrix name normaliser strips "(Debt)" and similar | Tools: risk | P2 | Open | — | `tools/merge_risk_matrix.js:107-113` |
| A16 | SIF Monitor merge can keep an old as-on date | Tools: SIF | P2 | Open | **Affects** | `tools/merge_sif_monitor.js:24`, `:108-113` |
| A17 | Post-bake analytics tools: heuristic fill, weak gates, file picking | Tools: analytics | P2 | Open | **Affects** | `tools/fill_variant_analytics.js:105`; `tools/rekey_sif_analytics.js:96-97` |
| A18 | PMS/Reckoner pin maps duplicated and partly stale | Tools: PMS | P2 | Open | **Affects** (may block) | `tools/merge_pms_performance.js:20-50`, `:153-154` |
| A19 | AIF performance merge carries data forward silently | Tools: AIF | P2 | Open | **Affects** | `tools/merge_aif_performance.js:88-91`, `:139-141` |
| A20 | `add_reckoner_funds.js`: hard-coded deck facts; re-adds a dropped GIFT City fund | Tools: Reckoner | P2 | Open | **Affects** (universe change only) | `tools/add_reckoner_funds.js:20`, `:199-234` |
| A21 | Slide tools' gates are weaker than documented | Tools: slides | P2 | Open | **Affects** | `tools/update_market_slides.js:41`, `:65`; `tools/update_closing_slides.js:69-74` |
| A22 | Python risk-matrix route unvalidated and unguarded | Tools: risk | P2 | Open | — | `tools/build_risk_matrix.py:16-25`, `:152` |
| A23 | `verify_page.js` and the vm tools hide real errors | Verification | P2 | Open | **Affects** | `tools/verify_page.js:78` |
| A24 | Shared libraries: latent parsing hazards | `tools/lib` | P2 | Open | — | `tools/lib/reck_parse.js:45-47`; `tools/lib/blocklib.js:25` |
| A25 | Invisible characters that must survive any edit | Tools | P2 | Open | — | `tools/rename_schemes.js:146` |
| A26 | One-off tools are not safe to re-run blindly | Tools | P3 | Open | — | `tools/split_sif_add_mld.js:86-93` |
| B1 | No PMS performance file transferred; PMS at 31-Aug-2026 | Inputs | P2 | Open (desk) | **Blocks** PMS step | `site/index.html:1451` |
| B2 | Live Sep-2026 Reckoner deck not in the pack | Inputs | P2 | Open (desk) | **Blocks** Reckoner and AIF steps | `monthly-updates/2026-07_Jul-2026/` |
| B3 | Sep market deck in the pack is the superseded first issue | Inputs | P2 | Open (desk) | **Affects** | `monthly-updates/2026-09_Sep-2026/` |
| B4 | Sep analytics workbooks carry no SIF holdings | Inputs | P2 | Open (desk) | **Affects** | `monthly-updates/2026-09_Sep-2026/Analytics/` |
| B5 | Fund-manager data stops at 31-Aug-2026 | Inputs | P2 | Open (desk) | **Affects** | `monthly-updates/2026-08_Aug-2026/` |
| B6 | PMS/AIF look-through stops at 31-Jul-2026 | Inputs | P2 | Open (desk) | **Affects** | `monthly-updates/2026-07_Jul-2026/Analytics/` |
| B7 | Periodic inputs missing from the pack | Inputs | P3 | Open (desk) | — | `monthly-updates/` |
| C1 | Siblings 3–5 not folded into the page (six-file deploy) | Architecture | P2 | Open | — | `site/index.html:5083-5085` |
| C2 | README stale | Docs | — | Closed 16-Oct-2026 | — | `docs/archive/README_original_2026-05.md` |
| C3 | Risk stats flagged unreliable by the source are shown as normal | UI/data | P1 | Open (feature) | — | `tools/merge_risk_matrix.js:88-96` |
| C4 | Mosaic Multiyield Series I keeps a Select badge | Data | P2 | Open (desk) | **Affects** | `CENTRICITY_SELECT` |
| C5 | Motilal Oswal Gift City India Equity Fund – Inbound not in MASTER | Data | P2 | Open (desk) | **Affects** | MASTER; `site/Centricity_June_Refresh.js` |
| C6 | Prism Hybrid Long-Short Fund has no AMC prefix | Data | P3 | Open | — | `site/Centricity_SIF_Refresh.js` |
| C7 | 360 ONE Balanced Hybrid Fund not in MASTER | Data | P3 | Open (upstream) | — | — |
| C8 | Five SIFs have no look-through (PRD list corrected) | Data | P2 | Open (desk) | **Affects** | analytics stores |
| C9 | Debt rating chart covered only the top 20 holdings | UI | — | Closed 14-Oct-2026 (`862e40b`) | — | — |
| C10 | `RISK_MATRIX` has no `c`; `RISK_MATRIX_BENCH_SD` stale | Data | P3 | Open | — | `site/index.html:5091-5094` |
| C11 | Rf = 4.5% to re-confirm with the desk | Data | P2 | Open (desk) | — | `tools/build_risk_matrix.py:17` |
| C12 | Dead code kept for parity (`parseAnalytics` is not dead) | Code | P3 | Accepted | — | `site/index.html:6700`, `:6796-6807` |
| C13 | Cosmetic UI inconsistencies kept for parity | UI | P3 | Accepted | — | `site/index.html:8335`, `:8867`, `:8874` |
| C14 | Shared links drop funds renamed since the link was made | UI | P2 | Open | — | `site/index.html:8695-8706` |
| C15 | Fund-manager roster overwritten by the Sep bake | Data | P2 | Open (desk) | **Affects** | MASTER `fund_mgr`; `tools/merge_fund_managers.js` |
| R1 | Client PII still public in the outgoing owner's repo and site | Security | P1 | Open (outgoing owner) | — | upstream `Portfolio_Review_Build_Prompt.md` |
| R2 | Public repo and site; `robots.txt` ineffective | Security | P2 | Accepted (D60) | — | `site/robots.txt` |
| R3 | CDN scripts load without integrity (SRI) | Security | P2 | Open | — | `site/index.html:1224-1228` |
| R4 | `xlsx` 0.18.5 has two high-severity advisories | Security | P2 | Accepted | — | `package.json`; `site/index.html:1227` |
| R5 | Stale `Centricity_Risk_Matrix.js` is published | Hosting | P3 | Accepted (D69) | — | `site/Centricity_Risk_Matrix.js` |
| R6 | The git repository lives inside OneDrive | Repo | P2 | Open (owner decision) | **Affects** | repo root |
| R7 | Old site still live alongside the new one | Hosting | P2 | Open (outgoing owner) | — | old Pages site |
| E1 | Operating manual keeps stale statements as history | Docs | P3 | Accepted | — | `docs/OPERATING_MANUAL.md` → Errata |
| E2 | PRD contains wrong tool and hosting facts | Docs | P3 | Open | — | `docs/PRD.md` §2, §5, §11, §13, §14 |
| E3 | Runbooks and specs are out of date | Docs | P2 | Open | **Affects** (if followed) | `docs/runbooks/`, `docs/specs/` |
| E4 | Stale comments inside the deploy files | Docs/code | P3 | Open | — | `site/index.html:2928-2931`, `:5087-5090`, `:7184` |
| E5 | Tool comments that contradict the code | Docs/code | P3 | Open | — | `tools/fill_variant_analytics.js:6-7` and others |
| F1 | Usage text shows pre-move commands | Tools | P3 | Open | — | every tool's usage string |
| F2 | Unused code in tools | Tools | P3 | Open | — | see F2 |
| F3 | Browser request for `favicon.ico` returns 404 | Site | P3 | Open | — | `site/index.html:1-3` |

---

## A. Data-integrity risks in tools

### A1. `merge_bond_list.js` loads the first sheet and labels it Invictus
**P1 · Open · Blocks a Bond List run**

- **What:** The tool reads only the first worksheet and names every bond `<name> (Invictus)` with
  `sub_category` Invictus. The desk is a hard-coded constant, not a flag.
- **Evidence:** `tools/merge_bond_list.js:42` (`const DESK = 'Invictus'`), `:50` (first sheet),
  `:52` (fixed column positions), `:142-144` (name and `sub_category`). The only Bond List in the
  handover set, `monthly-updates/2026-06_Jun-2026/Bond List_08th June 2026.xlsx`, has two sheets:
  `OneDigital Bonds Options` first, `Invictus Bonds Options` second (checked 16-Oct-2026). The
  06-Aug-2026 file the tool was last run on (`:23`) was not transferred, so its layout is unknown.
- **Impact:** On a two-sheet workbook it would replace the Invictus bonds with the OneDigital bonds,
  labelled Invictus. No gate catches this: the IRR range, maturity, duplicate and "other desk
  untouched" gates all pass. Also, the "maturity not in the past" gate compares with the literal
  year 2026 (`:200`), so from 2027 it lets bonds that matured in 2026 through. Bond returns are
  synthetic by design: r1y = r3y = r5y = `irr_high` (`:146`).
- **Workaround:** Before any run, list the sheet names. If there is more than one, save the Invictus
  sheet alone as a one-sheet copy, run on that, and confirm with the owner which desk it is. Check
  the dry-run bond list against the desk's sheet.
- **Suggested fix:** Required `--sheet` and `--desk` flags; refuse a multi-sheet workbook without
  `--sheet`; compare maturities with today's date.

### A2. Ten tools exit 0 from a dry run when a gate failed
**P2 · Open · Affects every refresh**

- **What:** In a dry run these tools exit 0 before they check the failure flag, so a failed gate
  appears only as text.
- **Evidence:** the dry-run exit and the refusal on the next line: `tools/bake_month.js:146-147`,
  `merge_de_universe.js:109-110`, `merge_direct_equity_returns.js:182-183`,
  `merge_expense_exitload.js:134-135`, `merge_pms_performance.js:185-186`, `pin_pms_alias.js:60-61`,
  `merge_reckoner.js:275-276`, `merge_bond_list.js:210-211`, `rebuild_directperf.js:89-90`,
  `update_market_slides.js:68-69`. `verify_page.js` never exits non-zero on a failed check. By contrast,
  `merge_analytics.js:132`, `merge_risk_matrix.js:193` and `merge_aif_performance.js:183` do exit 1
  from a failed dry run.
- **Impact:** The `--apply` run still refuses, so nothing bad is written. But a reviewer or script
  that trusts exit codes would wrongly approve the step. This matters under D61 (automatic publish
  once every check passes).
- **Workaround:** Read every `GATE` line. Search each dry-run log for `***` and `FAIL` before
  applying.
- **Suggested fix:** Exit 1 from the dry run when any gate failed (one line per tool). Then let the
  monthly skill check exit codes.

### A3. `merge_pms_aif_analytics.js` re-dates the MF analytics
**P1 · Open · Affects the refresh when a PMS & AIF Analytics file arrives**

- **What:** The tool writes its `--as-on` into `DATA_DATES.analytics`. That key is the as-on date of
  the Equity, Hybrid and Debt **MF** analytics, shown on the page as "Analytics as on …".
- **Evidence:** `tools/merge_pms_aif_analytics.js:160` (first-match replace of `analytics: "…"`);
  `site/index.html:1450` (the key's own comment). The page shows the key in the footer (`:9094`), the
  analytics tabs (`:8876`, `:8883`), the Excel export (`:4037`, `:4059`) and the deck (`:4682`,
  `:5041`). `merge_analytics.js:138` does the same when it re-bakes a single class, re-dating all
  three.
- **Impact:** The look-through is overdue (B6). Run after the bake with the workbook's own date, the
  tool relabels the MF analytics date on the page and in both exports. The client-facing as-on date
  is then wrong. Whichever tool writes last wins.
- **Also in this tool:** it reads only the first sheet (`:55`). The merge is additive, so a scheme
  missing from a month keeps its old look-through indefinitely; sibling `EQ` keys not in the
  workbook keep May-2026 data (`:10-14`). An empty sheet crashes at `:58` (before any write). It
  makes three separate writes (`:158`, `:161`, `:167`).
- **Workaround:** Run it **before** `bake_month.js` in the same cycle. The bake then re-stamps
  `analytics`, and `parseAnalytics` merges, so the PMS/AIF entries survive [inference, not tested].
  Otherwise, pass `--as-on` equal to the current `DATA_DATES.analytics` and record the workbook's
  real as-on date in the update log. Either way, check the footer afterwards.
- **Suggested fix:** Give the look-through its own key (for example `DATA_DATES.pmsAnalytics`) and
  stop this tool touching `analytics`.

### A4. `merge_reckoner.js` has no gate against dropped funds
**P1 · Open · Affects the Reckoner step**

- **What:** Only one gate (`badKeys`) can block the write. Dropped funds and lost categories are
  printed, never checked, and the dry run exits 0.
- **Evidence:** `tools/merge_reckoner.js:255-276`. `NARRATIVE` (`:67-90`) and `PIN` (`:92-117`) are
  hand-maintained. The DROPPED banner hard-codes "not in the August Reckoner" (`:258`). Retained
  entries take category and sheet from the deck mapping (`:224`), and the first heading wins
  (`:192`). Rationale text is attached by fuzzy slide matching [inference].
- **Impact:** A join failure (renamed funds, a new deck layout) that drops many funds or whole
  categories would be written to `CENTRICITY_SELECT`. Select badges and rationale would disappear
  from client proposals. The CI rename canary does not catch this: it checks only that the
  remaining keys resolve to MASTER funds.
- **Workaround:** Refresh `NARRATIVE` from the deck's index slides first. In the dry run, compare
  DROPPED with "DECK NAMES WITH NO MASTER MATCH"; if they mirror each other, stop (a join failure,
  not an editorial change). Compare per-category counts with last month and read the ADDED
  rationale text. Stop for the owner on anything unexpected (D61).
- **Suggested fix:** Gates on the number of drops and on lost categories, relative to the current
  block; refuse when DROPPED and NO-MASTER-MATCH overlap by normalised name.

### A5. `rename_schemes.js` keeps orphan keys and loses earliest names
**P2 · Open · Affects step 1 of every refresh**

- **What:** (1) When a rename target already has an entry in a store, the old-name entry is
  **kept**, although the comment says it is dropped. (2) On a chain rename (A→B earlier, B→C now)
  `prev_name` is overwritten with B, so A is lost [inference]. (3) The page and the IRR sibling are
  written separately.
- **Evidence:** `tools/rename_schemes.js:211-213` (comment versus the `else out[k] = store[k]`
  branch); the same logic for the IRR map at `:239-241`; `:198` (`prev_name = name`); writes at
  `:248` then `:250`. Every run with `prev_name` history (225 records today) re-serialises all
  seven blocks under `--apply`, even with no change.
- **Impact:** Orphan analytics and IRR entries pile up under old names, unreachable by the live
  name. A new fund that later takes an old name would inherit them [inference]. Typed names and
  allocation sheets naming A stop resolving after a chain rename. If the second write fails, the
  page and the IRR map disagree until a re-run repairs it (through the `prev_name` map, `:164-166`).
- **Workaround:** In the dry run, compare "keys renamed per store" with the rename count and
  investigate any gap.
- **Suggested fix:** Decide the merge policy (drop and report the stale key); keep `prev_name` as a
  history list.

### A6. Excel dates read one day early on an IST machine
**P2 · Open · —**

- **What:** SheetJS 0.18.5 with `cellDates` returns 23:59:50 local time on the previous day. The
  tools and the page then take `toISOString().slice(0,10)`.
- **Evidence:** Reproduced on 16-Oct-2026 (IST): serial 46264, which `XLSX.SSF` decodes as
  30-Aug-2026, came back as `2026-08-29T18:29:50Z`. The same conversion is used at
  `tools/rename_schemes.js:76` (tier-2 inception join), `tools/merge_fund_managers.js:45` and
  `site/index.html:3349` (`parseMfMonitor`, which writes `MASTER.inception`).
- **Impact:** Baked `inception` dates are probably one day early [inference]. Tier-2 rename joins
  work only while the bake and the rename run in the same timezone. Running the tools on a UTC
  machine (for example a cloud runner) against IST-baked data could break them [inference].
  Fund-manager cut-offs shift consistently, so roster selection is unaffected.
- **Workaround:** Run all tools on the IST desktop. Read dates with `XLSX.SSF` when you need the true
  date.
- **Suggested fix:** One coordinated change to the page parsers and the tools, converting serials
  with `XLSX.SSF.parse_date_code`; then re-bake and expect every inception date to move by a day.

### A7. Two DIRECT_PERF builders; unchecked splice in `rebuild_directperf.js`
**P2 · Open · —**

- **What:** `bake_month.js` builds `DIRECT_PERF` with its own private parser. `rebuild_directperf.js`
  and the page's Direct-plan upload use the page's `REFRESH.parseMfMonitorDirect`. They disagree.
- **Evidence:** `tools/bake_month.js:217-306`: it strips `%` and commas from text cells, takes the
  maturity fields on any non-equity sheet, and replaces the whole store (`:304`). The page parser
  uses `Number()` (so text such as "12%" is skipped), takes maturity only when a `YTM (%)` column
  exists, and merges into the store (around `site/index.html:3412-3520`, merge at `:3442`).
  `tools/rebuild_directperf.js:92` does not check that the prefix was found. If the braces never
  balance, `end` stays -1 and `:98` appends the whole document again; the `</html>` check at `:99`
  still passes.
- **Impact:** The same Direct monitor can give different Direct-plan figures depending on the route.
  A malformed literal could corrupt `index.html` through `rebuild_directperf.js` (latent; the
  prefix exists today at `site/index.html:1230`).
- **Workaround:** Use `bake_month.js` only, as in the standard order. If you must use
  `rebuild_directperf.js`, compare file sizes before and after and run `verify_page.js`.
- **Suggested fix:** Make the bake call `parseMfMonitorDirect` into an emptied store, diff one
  month's output, and retire the private parser. Move `rebuild_directperf.js` to
  `blocklib.writeBlocks`.

### A8. Writes are in place, non-atomic and without backup
**P2 · Open · Affects every refresh**

- **What:** Every tool overwrites files in place with `fs.writeFileSync`: no temporary file and
  rename, and no backup. Several tools write two or three times per run.
- **Evidence:** `tools/lib/blocklib.js:47`. Multi-step writes: `rename_schemes.js:248,250`;
  `merge_analytics.js:136,139`; `merge_pms_performance.js:187-193`;
  `merge_pms_aif_analytics.js:158,161,167`; `merge_risk_matrix.js:197` then `:203-210` (if the
  `riskMatrix` line is missing it exits after writing the new matrix under the old date, `:206`);
  `merge_sif_monitor.js:108` then `:110-114` (same pattern for `DATA_DATES.sif`);
  `add_reckoner_funds.js:216,233`; `fold_duplicate_names.js:265,267`. `merge_bond_list.js:22` and the
  runbooks ask for a manual backup, but no tool makes one. blocklib's `</html>` guard applies only
  to HTML input (`:42`, `:46`), so writes to the sibling `.js` files have no end-of-file check.
- **Impact:** A crash, a full disk or a OneDrive sync clash mid-write can truncate the 12.8 MB page,
  or leave `index.html` and a sibling disagreeing.
- **Workaround:** Start each refresh from a clean tree and snapshot the six deploy files into
  `backups/` (`docs/MONTHLY_UPDATE_PROCESS.md` B3). Run `verify_page.js` after every `--apply`. Roll
  back with `git restore site/`.
- **Suggested fix:** Temp-file-and-rename in blocklib; gather a tool's writes before touching disk;
  have each tool snapshot what it changes.

### A9. Date labels spliced in unescaped, by first match
**P2 · Open · Affects every `--as-on`**

- **What:** `--as-on` values go into regex replacements and JS string literals without validation.
  The regexes take the first match anywhere in the 12.8 MB file.
- **Evidence:** `tools/bake_month.js:169-170`; `merge_analytics.js:138`; `merge_pms_performance.js:192`;
  `merge_pms_aif_analytics.js:160`. The last three do not check that the pattern matched, and log
  success regardless. `merge_risk_matrix.js:208` escapes only single quotes.
  `build_risk_matrix.py:150` puts the label inside single quotes unescaped. Today each pattern
  matches exactly once (`site/index.html:1449-1451`).
- **Impact:** A `"`, `$&`, `$1`, backslash or apostrophe in a label corrupts a literal. CI's
  script-error check should then catch the broken page. If a `performance: "…"`, `analytics: "…"` or
  `pms: "…"` string ever appears earlier in the file, it would be rewritten instead of `DATA_DATES`,
  silently.
- **Workaround:** Use plain labels in the house style ("31st October 2026"; "31 Oct 2026" for the
  risk matrix). Check the `DATA_DATES` line of `verify_page.js` after each step.
- **Suggested fix:** Validate `--as-on` against a strict pattern; anchor the replacement inside the
  `DATA_DATES` block; assert exactly one match.

### A10. Two tools find MASTER by physical line
**P2 · Open · —**

- **What and evidence:** `tools/merge_direct_equity_returns.js:131-135`, `:184` and
  `tools/merge_bond_list.js:165-168`, `:212` look for a line starting `<script>window.MASTER = ` and
  slice from its first `[` to its last `]`. That holds today (`site/index.html:1434`).
- **Impact:** Reformatting `index.html` (MASTER no longer on its own line, or anything containing `]`
  after the array on that line) breaks these tools or corrupts MASTER.
- **Workaround:** Never reformat or pretty-print `index.html`.
- **Suggested fix:** Use `blocklib.read` and `writeBlocks`, like the other tools.

### A11. DE returns join deletes returns the file lacks
**P2 · Open · Affects the Direct Equity step**

- **What:** For every matched stock, any return the file lacks is deleted from MASTER.
- **Evidence:** `tools/merge_direct_equity_returns.js:152-155`. The refusal at `:118-125` catches
  only a wholly empty column. Duplicates are handled inconsistently: the ISIN map keeps the last
  row (`:113`), the name map the first (`:115`). Only the top-10 Large Cap gate can block the write
  (`:183`).
- **Impact:** A partly populated tenor column (a vendor glitch) silently blanks that return for many
  stocks in proposals.
- **Workaround:** In the dry run, compare "Direct Equity with returns" and the return range with
  last month; re-request the file if coverage drops. Never force a refusal.
- **Suggested fix:** A per-tenor coverage gate relative to the current block.

### A12. Expense tool: hard-coded sample fund, gate that cannot fail
**P2 · Open · Affects the expense/exit-load step**

- **What:** The tool looks up one named fund for a sample line and dereferences it unguarded. Its
  "MASTER count unchanged" gate compares an array with itself.
- **Evidence:** `tools/merge_expense_exitload.js:131-132` (`Aditya Birla SL Large Cap Fund-Reg(G)`,
  present in MASTER today); `:128` compares `master.length` with `mB.value.length`, the same array
  (`:57`). The log says "(>4%)" (`:94`) but the bound is 8% (`:77`). The `MISSING` regex (`:31`) is
  never used. "DIRECT_PERF.expense updated" (`:92`) counts every write, changed or not (`:84-86`);
  only the MASTER count separates unchanged values (`:80`).
- **Impact:** If SEBI renames that fund or it leaves MASTER, the tool throws a TypeError before
  writing. The step is blocked until the code is edited. The Direct-plan count overstates the
  changes, even on a re-run with the same file.
- **Workaround:** If it throws at `SAMPLE`, change the name to a fund that exists, in a small reviewed
  change.
- **Suggested fix:** Skip the sample when absent; compare the count with the pre-run value; count
  Direct-plan writes only when the value changes.

### A13. Header assumed on row 1 (DE universe, fund managers)
**P2 · Open · Affects the DE universe and fund-manager steps**

- **What:** Two tools read the first row as the header. In Sep-2026 the expense and exit-load files
  arrived with a "CTB Output" banner above the header, and the DE returns file with three blank rows
  above it (`tools/merge_expense_exitload.js:34`, `tools/merge_direct_equity_returns.js:60`).
  Those tools were changed to search for the header (for example
  `tools/merge_direct_equity_returns.js:60-64`); these two were not.
- **Evidence:** `tools/merge_de_universe.js:29-36`; `tools/merge_fund_managers.js:38-43`.
- **Impact:** A banner row aborts the run with "column layout changed". The failure is safe, but it
  blocks the step.
- **Also:** `merge_fund_managers.js` must run after `bake_month.js`, which rewrites `fund_mgr` from
  the Monitor (see C15). Its normalised-name map keeps the first match (`:86`), so two MASTER names that
  normalise alike could share one roster [inference].
- **Workaround:** Delete the banner rows in a copy of the workbook, keep the original, and note it in
  the update log.
- **Suggested fix:** Find the header by content in both tools.

### A14. DE universe joins by name only; industry never written
**P2 · Open · Affects the DE universe step**

- **What and evidence:** `tools/merge_de_universe.js` joins on a normalised company name only
  (`:26-27`, `:67`), with no ISIN and no `prev_name`. It parses `industry` (`:32`, `:48`) but never
  writes it (`:66-73`), although its header (`:1`) says it does. The first header matching
  `/sector/` or `/market cap/` wins (`:31-33`). It reads the workbook twice (`:29`).
- **Impact:** A company rename arrives as a new listing plus a stale old record unless reconciled by
  hand. A new column such as "Sector Code" placed earlier would be used silently.
- **Workaround:** Reconcile "in MASTER but not in this month's file" against "new listings"
  (`docs/OPERATING_MANUAL.md` → Data-hygiene traps).
- **Suggested fix:** Join on ISIN if the desk adds it to this file; stamp `prev_name`; match exact
  header names; drop or wire `industry`.

### A15. Risk-matrix name normaliser strips "(Debt)" and similar
**P2 · Open · —**

- **What and evidence:** `baseName` in `tools/merge_risk_matrix.js:107-113` removes any parenthetical
  that starts with G or D, such as "(Debt)", "(Delhi)" or "(Gujarat)". This contradicts its own
  "whitelist ONLY" comment (`:105-106`). The archaeology pass found four MASTER names affected and
  no collisions today.
- **Impact:** Two future funds that differ only by such a parenthetical could be joined to the wrong
  risk stats [inference].
- **Workaround:** Read the tier-3 joins in the dry run.
- **Suggested fix:** Match the real plan markers exactly.

### A16. SIF Monitor merge can keep an old as-on date
**P2 · Open · Affects the SIF step**

- **What and evidence:** The source is the first argument that is neither `--as-on` nor `--sibling`
  (`tools/merge_sif_monitor.js:24`), so an unsupported flag such as `--html site/index.html` placed
  before the workbook makes `index.html` the "source". The date comes from the parser (`:61`, `:66`):
  `--as-on`, else a date in the file name, else the workbook's own "as on" cell. If none is found,
  `parseSif` leaves the previous `DATA_DATES.sif` in place (`site/Centricity_SIF_Refresh.js:231-243`)
  and the tool re-stamps it with a fresh "baked from <new file>" comment (`:113`). The
  SIF block is written (`:108`) before the date line is checked (`:112`).
- **Impact:** New SIF numbers can sit under an old as-on date.
- **Workaround:** Always pass `--as-on`; check the "DATA_DATES.sif" line in the dry run.
- **Suggested fix:** Require `--as-on`; check the date line before writing.

### A17. Post-bake analytics tools: heuristic fill, weak gates, file picking
**P2 · Open · Affects the analytics steps**

- **`fill_variant_analytics.js`:** picks a plan-variant sibling by rank, then by shortest name
  (`:105`), with no ambiguity report. It crashes with a TypeError if one of the three analytics files
  is missing (`:22`). It replaces last month's entries (`:136-146`) although its header says nothing
  is overwritten (`:6-7`). It swallows inline-script errors (`:45`).
- **`rekey_sif_analytics.js`:** "GATE store sizes unchanged" only prints counts (`:96-97`), while
  `:75` can delete an entry. It needs `sif_raw` on every SIF record (`:66`), so SIFs added by
  `merge_sif_monitor.js` need it too. The sandbox console is muted (`:39`).
- **File picking:** `bake_month.js:23-31` and `fill_variant_analytics.js:22-23` take the first file
  whose name matches, so a duplicate download such as "… (1).xlsx" can be used silently. A missing
  `Analytics/` folder throws an uncaught ENOENT. The `DIRECT_PERF` shrink gate is an absolute floor
  of 1,000 (`bake_month.js:138`), not relative to the current count.
- **Impact:** Two different schemes sharing a plan base could share a look-through [inference]; the
  wrong file can be baked when duplicates sit in the folder.
- **Workaround:** Keep exactly one file per stem in the month folder. Read the five "<- file" lines
  of the bake's dry run, the "filled from a plan-variant sibling" list, and the SIFs reported with no
  analytics.
- **Suggested fix:** Ambiguity reports; refuse duplicate matches; relative shrink gates.

### A18. PMS/Reckoner pin maps duplicated and partly stale
**P2 · Open · Affects the PMS step (may block it)**

- **What and evidence:** `REPIN` in `tools/merge_pms_performance.js:20-37` and `PINS` in
  `tools/pin_pms_alias.js:13-31` both pin Emkay and must change together. Every `REPIN` key must
  exist in the new file or the run stops (`:153-154`). `STILL_NULL_NOTES` (`:39-50`) is static and
  stale: it is printed as "still pinned null" whatever the live state, and Emkay is in both `REPIN`
  (`:36`) and the notes (`:43`). The PMS block is replaced wholesale (`:188`), guarded only by the
  MASTER-coverage gate (`:164-166`). The exit-load regex has no word boundary (`:81`)
  [inference: "12 months: 1%" could read as year 2]. `PIN` in `tools/merge_aif_performance.js:26-30`
  duplicates three `merge_reckoner.js` pins. `pin_pms_alias.js` validates against whatever PMS block
  is on disk, so it must run straight after `merge_pms_performance.js --apply`. `PINS` has a
  deliberate trailing space in `'Karma Capital Wealth Builder '` (`:20`); see A25.
- **Impact:** A vendor rename blocks the PMS step until the code is edited. A stale note can mislead
  the reviewer. A wrong pin puts another manager's numbers on a fund (`docs/PRD.md` §12).
- **Workaround:** Expect to edit `REPIN` and `PINS` together each PMS cycle; stop for the owner on
  every pin (D61). Ignore `STILL_NULL_NOTES`; read the "GATE still pinned null" line of
  `pin_pms_alias.js` (`:57`).
- **Suggested fix:** One shared data file for `REPIN`, `PINS` and `PIN`; build the null report from
  live data.

### A19. AIF performance merge carries data forward silently
**P2 · Open · Affects the Reckoner step**

- **What and evidence:** In `tools/merge_aif_performance.js`, benchmarks are replaced only if their
  count matches; otherwise the old block is kept with a note (`:139-141`). Benchmark SI is forced to
  null (`:136`). The market-cap columns are the last four by position; a mismatch only prints a note
  (`:88-91`). Slides are scanned by XML file number 1–200, not visible order (`:63-64`). The AIF
  block is rebuilt wholesale and no AIF as-on date is stored, so the UI cannot show one. The tool
  rewrites `PMS_PERFORMANCE`, carrying the PMS half from disk (`:185-187`); `merge_pms_performance.js`
  does the reverse (`:187-190`).
- **Impact:** Stale benchmarks or misplaced market-cap splits without a failure. Running the two
  `PMS_PERFORMANCE` writers at the same time would lose one half.
- **Workaround:** Read the "benchmark count differs" and market-allocation notes. Run the two writers
  one after the other.
- **Suggested fix:** Fail on layout notes; record an AIF as-on date.

### A20. `add_reckoner_funds.js`: hard-coded deck facts; re-adds a dropped GIFT City fund
**P2 · Open · Affects the refresh only if the deck adds funds (see C4, C5)**

- **What and evidence:** `ADD` hard-codes slide numbers per fund (`:30`, `:41`, `:51`, `:65`).
  `--pms` is parsed (`:20`) but never used: the data comes from the baked PMS block. PMS additions get
  non-schema keys (`pe`, `sd*`, `sharpe*`, `sortino*`, `alpha*`, `beta*`, `_pms_source`; `:134-139`)
  despite the "same shape" comment (`:79`). USD mn are converted at a fixed 88 per USD (`:159`). Every
  `--apply` re-adds each GIFT City `ADD` entry to `NEW_GIFT` in `site/Centricity_June_Refresh.js` if
  it is missing (`:199-200`, `:223-234`). One of them, `Motilal Oswal Alternative Investment
  (Inbound)`, was dropped by the Sep-2026 deck; it is still in MASTER and `NEW_GIFT` but is no longer
  a Select key. `NEW_GIFT` is spliced with `indexOf('}];')` (`:206`, `:226`) and the
  "already present" test is a substring match (`:227`). The page is written before the sibling
  (`:216`, `:233`).
- **Impact:** Removing the dropped fund by hand would be undone by the next `--apply`. An `ADD` entry
  copied for a new deck would read the wrong slide.
- **Workaround:** Before any run, update `ADD` for the current deck and remove entries the deck
  dropped. This is a universe change: always confirm with the owner.
- **Suggested fix:** Find slides from the deck index; remove the dead flag; schema-check new records;
  make the FX rate an input.

### A21. Slide tools' gates are weaker than documented
**P2 · Open · Affects the market-slide step**

- **`update_market_slides.js`:** rewrites the whole sibling as line 1 plus
  `window.EXTRA_SLIDES = …` (`:65`), discarding anything else in the file. The reference size is the
  current first market image (`:41`), not 2001×1125. "GATE untouched keys" only prints (`:60-61`).
  The dry run exits 0 on failure (`:68`). It executes the sibling in a vm (`:36`).
- **`update_closing_slides.js`:** the "untouched keys" and "market still N images" gates cannot fail,
  because `next` starts as a copy of the store (`:50`, `:69-74`). File names are fixed
  (`disclaimer.png`, `thankyou.jpg`).
- **Impact:** A wrong-size render passes if the current images are also wrong. A hand edit in
  `Centricity_ExtraSlides.js` outside `EXTRA_SLIDES` is lost.
- **Workaround:** Render at 2001×1125 as documented; look at every slide in the preview.
- **Suggested fix:** Fixed expected dimensions; real before/after comparisons; splice with blocklib.

### A22. Python risk-matrix route unvalidated and unguarded
**P2 · Open · —**

- **What and evidence:** `tools/build_risk_matrix.py` has no dry run and writes its fourth argument
  unconditionally (`:16`, `:152`), so swapped arguments could overwrite `site/index.html`. The label
  is quoted unescaped (`:150`). Rf is hard-coded at 4.5% (`:17`, see C11). `raw.iloc[1:]` drops the
  first data row (`:25`), which assumes a second header row [inference]. The name join has exact,
  IDCW→(G) and single-base tiers (`:108-114`) but no `prev_name` tier; per the operating manual, 32
  funds joined only through `prev_name` in Sep (via `merge_risk_matrix.js`). It reads only the
  baseline MASTER (`:96`). Edge data (zero tracking error, no down days) can crash it. It has never
  run against pandas 3.x, which is what is installed.
- **Workaround:** Keep using `merge_risk_matrix.js`, the route used for Aug and Sep. To try Python,
  write the output to a scratch path, never into `site/`.
- **Suggested fix:** A validated run, argument checks and a `prev_name` tier.

### A23. `verify_page.js` and the vm tools hide real errors
**P2 · Open · Affects every verification**

- **What and evidence:** `tools/verify_page.js:78` drops every error whose message contains
  " is not defined", or mentions React, ReactDOM, Chart, XLSX or PptxGenJS. The script never exits
  non-zero on a failed check (CI greps its output instead). It has no default folder (`:7-8`: no argument gives a TypeError). Only `/^https?:/` counts
  as a CDN (`:37`), so a protocol-relative `src` would show as a missing sibling. The script regex is
  lazy (`:30`). In the bake tools, `bake_month.js:69` logs and ignores inline-block errors,
  `fill_variant_analytics.js:45` swallows them, and `rekey_sif_analytics.js:39` mutes the sibling
  console.
- **Impact:** CI's parity gate (`.github/workflows/pages.yml`) would pass a page with a genuine
  ReferenceError from a typo, and automatic publishing (D61) would ship it. The gate checks
  structure (siblings present, duplicates, `</html>`, script errors, Select canary), not counts, so
  data regressions rely on the tool gates and human review.
- **Workaround:** After every change, load the page with `npm run serve` and check the console
  (`docs/TESTING.md`). Compare the counts with `docs/PROJECT_STATE.md`.
- **Suggested fix:** Filter only the exact "React is not defined" family of messages; exit non-zero
  on failure; compare counts against a committed baseline.

### A24. Shared libraries: latent parsing hazards
**P2 · Open · —**

- **`tools/lib/blocklib.js`:** finds the first occurrence of a prefix (`:25`). A JSON-looking literal
  inserted above a data block would be targeted silently. Overlapping prefixes in one call are not
  detected (`:43-45`).
- **`tools/lib/pptx.js`:** scans the whole file for central-directory signatures (`:8`) and estimates
  compressed sizes when the local header has none (`:18-24`) [inference: a false signature or a
  zip64 descriptor could mis-read an entry]. It decodes only decimal entities (`:39`).
- **`tools/lib/reck_parse.js`:** run directly, it writes to `argv[3]` with no guard (`:45-47`), so a
  mistyped `site/index.html` would be overwritten. The `BENCH` regex (`:8`) skips any row named like
  a benchmark (for example one ending in "Index").
- **`tools/lib/reck_narrative.js`:** `details()` returns only the first qualifying table (`:60`).
- **Workaround:** Never run `reck_parse.js` with an output path inside `site/`; read the ADDED
  rationale in Reckoner dry runs.
- **Suggested fix:** As listed; low priority.

### A25. Invisible characters that must survive any edit
**P2 · Open · —**

- **What and evidence:** A NUL byte is the tier-3 key separator in `tools/rename_schemes.js:146`.
  Literal no-break spaces (U+00A0) sit inside regexes at `rename_schemes.js:86`, `:95`,
  `bake_month.js:271`, `merge_risk_matrix.js:108`, `merge_pms_aif_analytics.js:50` and
  `merge_bond_list.js:44`. Trailing spaces are deliberate in keys that match live data:
  `pin_pms_alias.js:20` (`'Karma Capital Wealth Builder '`), `merge_reckoner.js:73` (`'DEBT AIF '`),
  `:85` (`'Unlisted Equity '`), `add_reckoner_funds.js:57-58`. `.gitattributes` forces text diffs for
  `rename_schemes.js`, which git would otherwise treat as binary.
- **Impact:** An editor, formatter or "trim trailing whitespace" setting silently changes join keys,
  so renames, pins and Select sheets stop matching.
- **Workaround:** Edit these files with a tool that preserves bytes; check that `git diff` shows only
  the intended change.
- **Suggested fix:** Replace NUL and NBSP with `\u0000` and ` ` escapes (same behaviour);
  comment the trailing-space keys, which are data.

### A26. One-off tools are not safe to re-run blindly
**P3 · Open · —**

- `tools/split_sif_add_mld.js` upserts the Neo MLD record from hard-coded values on every `--apply`
  (`:86-93`), reverting later desk edits to it. Its comments say 28 SIFs (`:13`, `:75`); the sibling
  has 30. The 12 legacy `SIF` rows are still in the embedded MASTER, so folding the SIF sibling (C1)
  must handle them.
- `tools/fold_duplicate_names.js` skips the IRR sibling, and its gates, with only a log line if the
  file is missing or unparsable (`:220-222`).
- `tools/fold_index_funds.js` inspects only the embedded MASTER, not what siblings add at load
  [inference].
- All three are already applied and are no-ops today. Run them only for the problem they fix
  (`docs/OPERATING_MANUAL.md` → Traps), dry run first.

---

## B. Monthly-cycle gaps at handover

### B1. No PMS performance file transferred; PMS at 31-Aug-2026
**P2 · Open (desk) · Blocks the PMS step**

- **Evidence:** No `PMS_Scheme_Performance_*` file is in any `monthly-updates/` folder. The
  "PMS & AIF Performance <Month>" files of Apr and May are a different format and are not
  substitutes. `site/index.html:1451` has `pms: "31st August 2026"`; `docs/PRD.md` §11.3 marks PMS as
  one cycle behind. The template named in `docs/runbooks/PMS_Performance_Update_Prompt.md:3` is also
  absent.
- **Impact:** `merge_pms_performance.js` and `pin_pms_alias.js` cannot run; PMS returns stay at
  31-Aug-2026.
- **Action:** Ask the desk for the Sep-2026 and Oct-2026 files and file them in the month folders.

### B2. Live Sep-2026 Reckoner deck not in the pack
**P2 · Open (desk) · Blocks the Reckoner and AIF steps**

- **Evidence:** Only `monthly-updates/2026-07_Jul-2026/Monthly Investment Reckoner - August 2026.pptx`
  (as on 31-Jul) was transferred. The Sep-2026 deck (as on 31-Aug), which produced today's
  `CENTRICITY_SELECT` and AIF performance, stayed on the outgoing owner's Desktop.
- **Impact:** The Reckoner steps need the Oct-2026 deck (as on 30-Sep). Today's Select block cannot
  be reproduced from archived inputs.
- **Action:** Request the Oct-2026 deck. Ask the outgoing owner for the Sep-2026 deck for the archive.

### B3. Sep market deck in the pack is the superseded first issue
**P2 · Open (desk) · Affects the market-slide step**

- **Evidence:** `monthly-updates/2026-09_Sep-2026/Monthly Outlook Pagers_Oct 2026.pptx` was saved at
  11:28 IST on 13-Oct-2026, and its slide 6 is titled "OVERALL MARKET UPDATE – August 2026". The six
  live `EXTRA_SLIDES.market` images came from the 17:14 re-issue (`docs/OPERATING_MANUAL.md` →
  Refreshing the Market Update slides), which is not in the pack.
- **Impact:** Re-rendering from this copy would publish outdated slides.
- **Action:** Do not render from it. Ask for the final issue every month; re-issues keep the same
  file name.

### B4. Sep analytics workbooks carry no SIF holdings
**P2 · Open (desk) · Affects the analytics step**

- **Evidence:** Checked on 16-Oct-2026: none of the 30 SIF workbook names (`sif_raw`) appears in the
  Sep Equity or Hybrid Analytics. The Aug workbooks carry 13 and 13 by exact name (the archaeology
  pass counted 16 equity and 13 hybrid). `DATA_DATES.analytics` still reads 30th September 2026.
- **Impact:** SIF look-through is Aug data under a 30-Sep label, and it ages every month the desk
  leaves SIFs out. See also C8.
- **Action:** Ask the desk to keep SIF schemes in the analytics workbooks.

### B5. Fund-manager data stops at 31-Aug-2026
**P2 · Open (desk) · Affects the fund-manager step**

- **Evidence:** No Fund Manager Data file in the Sep folder. The newest is
  `monthly-updates/2026-08_Aug-2026/Fund Manager Data_31st Aug 2026.xlsx` (`docs/PRD.md` §11.3).
  The live `fund_mgr` values are no longer that roster (C15).
- **Action:** Request Fund Manager Data, in the stints layout, every month.

### B6. PMS/AIF look-through stops at 31-Jul-2026
**P2 · Open (desk) · Affects the refresh when the file arrives**

- **Evidence:** The newest look-through workbook is
  `monthly-updates/2026-07_Jul-2026/Analytics/PMS & AIF Analytics July 2026.xlsx`; none exists for Aug
  or Sep.
- **Action:** Request it. When it arrives, see A3.

### B7. Periodic inputs missing from the pack
**P3 · Open (desk) · —**

- Never transferred: `Topic Slides, Disclaimer & Thank You Slide.pptx`; the Bond List of 06-Aug-2026
  (only 08-Jun is present; see A1); `SIF Master List_Jul 2026` (only June, with 28 schemes; the live
  sibling has 30).
- `Exit Load & Expected IRR Return Range.xlsx` exists only as the April copy. It is the source of the
  hand-maintained IRR map in `site/Centricity_IRR_Offshore.js`, and `docs/PRD.md` §11.1 omits it
  from the monthly inputs.
- Until the desk resends them, these refreshes cannot be repeated or audited.

---

## C. Product and UI known gaps (`docs/PRD.md` §14)

C1–C13 are PRD §14 items 1–13, re-checked on 16-Oct-2026. C14 and C15 are not in the PRD.

### C1. Siblings 3–5 not folded into the page
**P2 · Open · —**

The page still loads `Centricity_June_Refresh.js`, `Centricity_IRR_Offshore.js` and
`Centricity_SIF_Refresh.js` (`site/index.html:5083-5085`), which re-apply their data on every load.
Deploys therefore need all six files (CI checks they are present). This is standing intent, not
urgent. Folding them touches every tool that reads or writes a sibling (`rename_schemes`,
`rekey_sif_analytics`, `merge_sif_monitor`, `merge_pms_aif_analytics`, `add_reckoner_funds`,
`fold_duplicate_names`, `split_sif_add_mld`) and the 12 legacy SIF rows (A26).

### C2. README stale
**Closed 16-Oct-2026**

The original README is archived as `docs/archive/README_original_2026-05.md`; the transfer's docs
commit adds a new root `README.md`.

### C3. Risk stats flagged unreliable by the source are shown as normal
**P1 · Open (feature) · —**

- **What:** The risk workbook's `Data Flags` sheet marks funds whose figures need care. The flags
  never reach the page.
- **Evidence:** In the 30-Sep-2026 workbook, 45 rows carry a reliability warning: 40 "split in NAV"
  (Max Drawdown and/or risk stats unreliable) and 5 "low correlation to mapped benchmark (β<0.30)".
  A further 122 are flagged for a short NAV history. `tools/merge_risk_matrix.js` reads the flags
  (`:88-93`) but only counts them (`:96`); `RISK_MATRIX` carries no flag.
- **Impact:** Client-facing Portfolio Matrix figures look ordinary for funds their own source calls
  unreliable.
- **Workaround:** When a proposal includes a fund listed on the `Data Flags` sheet, tell the desk.
- **Suggested fix:** Carry the flag onto `RISK_MATRIX` records, then mark it in the tab and in the
  PPT/Excel exports with a footnote.

### C4. Mosaic Multiyield Series I keeps a Select badge
**P2 · Open (desk) · Affects the Reckoner step**

MASTER has `Mosaic Multiyield Fund Series I`, which is a `CENTRICITY_SELECT` key; Series II, which
the Sep-2026 deck recommends, is not in MASTER (checked 16-Oct-2026). The badge therefore sits on an
instrument the deck no longer recommends. Adding Series II is a universe change
(`add_reckoner_funds.js`, A20) and needs a desk call on whether Series I is retired or only closed to
new money.

### C5. Motilal Oswal Gift City India Equity Fund – Inbound not in MASTER
**P2 · Open (desk) · Affects the Reckoner step**

The Sep-2026 deck's replacement fund appears nowhere in `site/index.html` or the siblings. The fund
it replaced, `Motilal Oswal Alternative Investment (Inbound)`, is still in MASTER and in `NEW_GIFT`,
but is no longer a Select key. The GIFT City bucket is one fund short of the deck. Note that
`add_reckoner_funds.js` re-adds the dropped fund to `NEW_GIFT` (A20).

### C6. Prism Hybrid Long-Short Fund has no AMC prefix
**P3 · Open · —**

The record exists only in `site/Centricity_SIF_Refresh.js`; the Monitor gives no AMC. New SIFs
appended by `merge_sif_monitor.js` arrive without an AMC prefix or IRR band
(`tools/merge_sif_monitor.js:91`). Add the AMC when the desk confirms it.

### C7. 360 ONE Balanced Hybrid Fund not in MASTER
**P3 · Open (upstream) · —**

`360 ONE Balanced Hybrid Fund-Reg(G)` has an analytics entry but no MASTER record, because it is in
no Monitor. This is an upstream gap that pre-dates the handover.

### C8. Five SIFs have no look-through
**P2 · Open (desk) · Affects the analytics step**

Checked 16-Oct-2026 against the analytics stores, by name and by `sif_raw`. The five without any
entry are Kotak Infinity Hybrid, Quants Qsif Sector Rotation, Franklin Sapphire Equity, Tata Titanium
Equity and SBI Magnum Equity Ex-Top 100 Long-Short. The PRD's list is stale: Mirae Asset Platinum
Hybrid now has a `HYBRID_ANALYTICS` entry. The Sep workbooks carry no SIFs at all (B4).

### C9. Debt rating chart covered only the top 20 holdings
**Closed 14-Oct-2026** (upstream `72e1f1e`, which is our `862e40b`)

By design, debt holdings are still capped at the top 20 per fund in the parser
(`site/index.html:3636`, `:3646`), and the Top 20 Issuers table stays top-20.

### C10. `RISK_MATRIX` has no `c`; `RISK_MATRIX_BENCH_SD` stale
**P3 · Open · —**

Only `build_risk_matrix.py` produces them, and the UI reads neither. Python is now installed; see
A22 for the remaining validation.

### C11. Rf = 4.5% to re-confirm with the desk
**P2 · Open (desk) · —**

Hard-coded at `tools/build_risk_matrix.py:17`. It matters only for the Python route;
`merge_risk_matrix.js` takes the vendor's ratios as given [inference].

### C12. Dead code kept for parity
**P3 · Accepted · —**

`PortfolioRollup`, `SharePanel_REMOVED`, the `false &&` Section 7 cards (`site/index.html:9052`,
`:9058`), the dead `BENCHMARKS` description map (`:1238`), legacy `aggEquity`/`aggDebt`, and the
empty `BONDS`/`PMS_HOLDINGS` globals. **Correction to the PRD:** `parseAnalytics` is not dead.
`bake_month.js`, `merge_analytics.js` and `fill_variant_analytics.js` run it offline. Only its upload
card is gone: the rail renders the MF Monitor card plus the PMS/AIF holdings and SIF Monitor cards
(`:6796-6807`, `:6848`), so the analytics and bonds branches of the upload handler (`:6700`) are
unreachable. Do not delete `parseAnalytics`.

### C13. Cosmetic UI inconsistencies kept for parity
**P3 · Accepted · —**

The Master Editor heading reads "Section 6 · Master Data Editor" (`site/index.html:8335`). Portfolio
Matrix and Equity Analytics share tab number 6.4 (`:8867`, `:8874`); the number is not rendered.
The frozen-pane classes (`frozen-pane`, `frozen-lock`, `frozen-title`, `frozen-sub`) have no CSS
rule (checked 16-Oct-2026).

### C14. Shared links drop funds renamed since the link was made
**P2 · Open · —**

- **What and evidence:** The `#p=` share-link loader matches fund names exactly against MASTER and
  silently drops any it cannot find (`site/index.html:8695-8706`). It does not consult `prev_name`.
- **Impact:** After a SEBI rename, an older shared link opens with that fund missing. The allocation
  no longer sums to 100% and downloads stay blocked, so the loss is visible but unexplained.
- **Workaround:** Rebuild old proposals from their allocation sheet; that upload path resolves
  through `prev_name`.
- **Suggested fix:** Resolve hash names through `H.resolveFundName`, and report any that fail.

### C15. Fund-manager roster overwritten by the Sep bake
**P2 · Open (desk) · Affects the fund-manager step**

- **What:** The Sep-2026 bake (`52217ec`) rewrote MASTER `fund_mgr` from the 30-Sep Monitor's
  `[Fund Manager 1]` column, which gives only the first-named manager. `merge_fund_managers.js` was
  not re-run afterwards, so the 31-Aug full-team roster is gone from MASTER. `docs/PRD.md` §11.3
  still dates fund managers 31-Aug-2026.
- **Evidence:** A dry run on 16-Oct-2026 of `tools/merge_fund_managers.js` with
  `monthly-updates/2026-08_Aug-2026/Fund Manager Data_31st Aug 2026.xlsx` reports "fund_mgr
  rewritten: 1310 (of which 1278 just gained the rest of the team)" (`:107`). The tool's header
  (`:3-4`) explains why: the Monitor names one manager per scheme.
- **Impact:** Internal only: `fund_mgr` feeds the search box and the Master Editor, not
  client-facing output. A search for a co-manager misses every scheme where that person is not
  named first.
- **Fix:** In the next MF cycle, run `merge_fund_managers.js` after the bake (process step 9). It
  needs Fund Manager Data as on the same month-end (B5).

---

## R. Repository, security and hosting

### R1. Client PII still public in the outgoing owner's repo and site
**P1 · Open (outgoing owner) · —**

- **What:** The Portfolio Review build spec originally named two clients and gave their portfolio
  values. Our history was rewritten to redact the two names and the sample file name, in every
  commit (D64). The sample portfolio's figures (per-client CMV totals and one holding's value and
  weight) were kept in that history, de-identified. On 16-Oct-2026 they were replaced with
  placeholders in the current `docs/specs/Portfolio_Review_Build_Prompt.md`; that is a forward edit,
  so pushed history still holds them. The outgoing owner's public repository and its Pages site,
  which serves the repository root, still carry the names and the figures together.
- **Evidence:** Checked on 16-Oct-2026 by count, without printing the text: the names are present in
  `upstream/main:Portfolio_Review_Build_Prompt.md` and absent from `handover-baseline` and
  `docs/specs/Portfolio_Review_Build_Prompt.md`. The old Pages site returned HTTP 200 for
  `/Centricity-Proposal-Playbook/Portfolio_Review_Build_Prompt.md` and its rendered `.html` (status
  code only; content not fetched). This local clone also holds the original objects through the
  `upstream/main` remote-tracking ref.
- **Impact:** Client personal and financial data stays publicly readable, and indexable, under the
  outgoing owner's account. While it does, the de-identified figures in our history can be linked
  back to the names.
- **Action:** The owner asks the outgoing owner to (1) make the old repository private, or delete
  it, or remove the file and purge it from its history; (2) retire the old Pages site (with R7);
  (3) ask GitHub Support to clear cached views. The owner decides with compliance whether any
  notification is needed and, optionally, whether the spec needs anything more. Locally, never
  `git push --mirror` and never push `refs/remotes/upstream/*` to `origin`. After the purge, remove
  or re-fetch the `upstream` remote.

### R2. Public repo and site; `robots.txt` ineffective
**P2 · Accepted (D60) · —**

- Everything in `site/` is public at the Pages URL, including the whole fund universe and the unused
  `Centricity_Risk_Matrix.js`. The repository itself is public on GitHub.
- `site/robots.txt` is served under the project path, but crawlers read `robots.txt` only at the host
  root. On the old site (16-Oct-2026) the host-root `/robots.txt` returned 404 and the project-path
  copy 200. `site/index.html:1-3` has no `<meta name="robots">`. The archived README's claim that the
  URL stays "effectively private" is false.
- Option for later (changes page bytes): add `<meta name="robots" content="noindex">`, or move to
  hosting with access control.

### R3. CDN scripts load without integrity (SRI)
**P2 · Open · —**

`site/index.html:1224-1228` load React, ReactDOM, Chart.js, SheetJS and PptxGenJS from unpkg and
jsDelivr, pinned to exact versions, with no `integrity` attribute; `crossorigin` is set only on the
two unpkg scripts. A compromised or hijacked CDN response would run arbitrary code in every user's
page, which handles client allocations and exports. **Suggested fix:** add `integrity` hashes and
`crossorigin="anonymous"`, or vendor the five libraries into `site/`. Either changes deploy bytes, so
test in a browser.

### R4. `xlsx` 0.18.5 has two high-severity advisories
**P2 · Accepted · —**

- `npm audit` on 16-Oct-2026 reported one high-severity package: `xlsx`, with GHSA-4r6h-8v6p-xvw6
  (prototype pollution, fixed in 0.19.3) and GHSA-5pgg-2g8v-p4x9 (ReDoS, fixed in 0.20.2). No fix is
  available on the npm registry; SheetJS publishes newer versions only on its own CDN.
- **Accepted because** the tools run the page's own parsers and must use the same SheetJS as the page
  (`site/index.html:1227` loads `xlsx@0.18.5`), and all inputs are trusted desk workbooks. The
  in-browser copy parses workbooks that users upload in the rail, under the same trust assumption.
- **Suggested fix:** Upgrade the page and the tools together to SheetJS 0.20.2 or later from
  `cdn.sheetjs.com`, then re-verify the parsers and date handling (A6) on a full month.

### R5. Stale `Centricity_Risk_Matrix.js` is published
**P3 · Accepted (D69) · —**

`site/Centricity_Risk_Matrix.js` is as on 30-Jun-2026 (its line 1) and carries `c` on 917 records.
The page does not load it (its sibling `<script src>` tags are only at `site/index.html:1232-1233`
and `:5083-5085`); the live matrix is inline (`:5086-5094`, 30-Sep-2026). The file is still
downloadable from the Pages site, and the comment at `site/index.html:7184` wrongly says the tab
reads it. It stays for parity: `fold_duplicate_names.js:255-262` checks it and `build_risk_matrix.py`
writes it. **Suggested fix:** move it out of `site/` (updating the Risk runbook and that note), or
regenerate it outside `site/`.

### R6. The git repository lives inside OneDrive
**P2 · Open (owner decision) · Affects every refresh**

- The repo sits under `OneDrive - CENTRICITY FINANCIAL DISTRIBUTION PRIVATE LIMITED\Desktop`, so
  `.git`, `node_modules/` and the 12.8 MB `index.html` sync continuously, and the tools overwrite in
  place (A8).
- Risks: sync-conflict copies or a half-synced file during a tool run; Files-On-Demand placeholders;
  a bash-side view of large files that lags the real file (`docs/OPERATING_MANUAL.md` → Traps,
  "OneDrive / bash-mount staleness"); damage to `.git` if OneDrive restores an older version of its
  files [inference].
- **Workaround:** Set the folder to "Always keep on this device"; pause OneDrive sync during tool runs
  and git operations; verify with Node on the real Windows path. GitHub (`origin`) is the real backup.
- **Suggested fix (owner decision):** Move the clone outside OneDrive and keep only the
  `monthly-updates/` inputs there.

### R7. Old site still live alongside the new one
**P2 · Open (outgoing owner) · —**

- The new site went live on 16-Oct-2026 (PR #1, merge `25e71a3`, Actions run 38866042211); all eight
  files at `https://productsteamcentricity.github.io/Centricity-Proposal-Playbook/` are byte-identical
  to `site/`. The outgoing owner's site still serves the same baseline.
- The old site will not receive monthly updates, and users' bookmarks and shared `#p=` links point to
  it.
- **Action:** Give users the new URL now. Ask the outgoing owner to replace the old site with a
  notice or redirect (together with R1).

---

## E. Documentation drift

### E1. Operating manual keeps stale statements as history
**P3 · Accepted · —**

`docs/OPERATING_MANUAL.md` (the old `CLAUDE.md`) had its commands and paths rewritten on
16-Oct-2026. Other stale statements are deliberately left as written and corrected in its *Errata
(16-Oct-2026)* table (counts, line numbers, file names, SIF 28 versus 30, the blocklib claim, the
no-Python claim, `robots.txt` and more). Trust `node tools/verify_page.js site` and the code over any
number there.

### E2. PRD contains wrong tool and hosting facts
**P3 · Open · —**

`docs/PRD.md` is the handover PRD verbatim, under a header note about the new locations. Still
wrong: "`merge_*.js` (15 scripts)" (there are 12); tools "all default to `index.html` beside the
script" (§11.2, §13: 18 tools default to `../site/index.html`, three require `--html`, and
`verify_page.js` needs the folder); Pages from "main / (root)" (§5; superseded by D63); §11.1 omits
the Exit Load & Expected IRR file (B7); §13 lists `add_reckoner_funds.js --pms`, a dead flag (A20);
§14 item 8 (C8) and item 12 (C12).

### E3. Runbooks and specs are out of date
**P2 · Open · Affects anyone who follows them**

- `docs/runbooks/Risk_Matrix_Update_Prompt.md`: describes only the Python route and omits
  `merge_risk_matrix.js`, which was used in Aug and Sep. Its command uses bare relative paths (`:15`)
  and its counts and dates are old.
- `docs/runbooks/PMS_Performance_Update_Prompt.md`: a pre-tool manual flow. It gives a per-row AUM
  rule (the tool decides per column, `tools/merge_pms_performance.js:109-113`), three exit-load
  columns (the tool needs one), and a Top Sector field (not parsed). It says to deploy by uploading
  `index.html` to the old repository (`:52`) and names a template that is missing (`:3`).
- `docs/specs/Equity_Debt_Analytics_Build_Prompt.md`: the engine has since diverged (fallbacks
  removed, seven rating buckets, wider scope, overlap rules, issuer parser, holdings caps).
- `docs/specs/Portfolio_Review_Build_Prompt.md`: describes this dashboard's matcher, overlap and
  issuer parser as they used to be.
- Follow `docs/MONTHLY_UPDATE_PROCESS.md`; use the runbooks only as reference (units, exit-load
  grammar).

### E4. Stale comments inside the deploy files
**P3 · Open · —**

`site/index.html:1235` and `:1442` say "15-Jun-2026". `:2928-2931` say PMS data is "as on 30th June
2026", with 314 schemes (it is 692, as on 31-Aug), and AIF data "as on 31st May 2026". `:5087-5090`
say the risk matrix is "as on 30 Jun 2026" and generated by `build_risk_matrix.py`, while `:5093`
sets `'30 Sep 2026'` (written by `merge_risk_matrix.js`). `:7184` says the tab reads
`Centricity_Risk_Matrix.js`. `site/Centricity_SIF_Refresh.js:3-4` name the June list and the Aug
monitor, `:13` says 29 rows and `:39` says 28 names, while there are 30 rows and the data is
30-Sep (`:61`). Fixing these changes deploy bytes, so do it in a deliberate code change, not a data
refresh.

### E5. Tool comments that contradict the code
**P3 · Open · —**

`tools/fill_variant_analytics.js:6-7` ("nothing … overwritten"; see A17); `merge_de_universe.js:1`
("industry"; A14); `rename_schemes.js:211-212` (A5); `merge_expense_exitload.js:94` (">4%" versus
8%) and `:136`; `pin_pms_alias.js:1` ("August Reckoner and the July PMS file");
`merge_reckoner.js:258` ("August Reckoner"); `split_sif_add_mld.js:13`, `:75` (28 versus 30);
`fold_duplicate_names.js:211-214` (historical since the fold); `rekey_sif_analytics.js:97` (a "GATE"
that only prints).

---

## F. Cosmetic

### F1. Usage text shows pre-move commands
**P3 · Open · —**

Every tool's usage string and header example still reads `node <tool>.js …`, for example
`tools/rename_schemes.js:13`, `:28`, `bake_month.js:20` and `merge_sif_monitor.js:9`, `:26`.
`merge_pms_performance.js:18` even names `pms_final.js`, and `site/Centricity_SIF_Refresh.js:17` shows
`node merge_sif_monitor.js`. The correct forms are `node tools/<tool>.js …`, with
`--html site/index.html` for the three tools that require it (`merge_pms_performance.js`,
`pin_pms_alias.js`, `merge_reckoner.js`).

### F2. Unused code in tools
**P3 · Open · —**

Unused requires: `path` in `merge_pms_performance.js:9`, and `fs` in `merge_reckoner.js:13`,
`merge_aif_performance.js:13` and `fold_index_funds.js:11`. Also: the dead `MISSING` regex
(`merge_expense_exitload.js:31`); the dead `--pms` flag (`add_reckoner_funds.js:20`); a hard-coded
"WROTE index.html" log whatever `--html` says (`merge_direct_equity_returns.js:188`);
`Math.min/max(...)` over about 30k values (`merge_direct_equity_returns.js:175`, which fails above
roughly 100k); a tenor column read but unused, and `Infinity` printed on an empty list
(`merge_bond_list.js:62`, `:204`); an ambiguous `clen` that holds the file-comment length, not a compressed length
(`tools/lib/pptx.js:9`).

### F3. Browser request for `favicon.ico` returns 404
**P3 · Open · —**

`site/index.html` has no `<link rel="icon">`, so browsers request `/favicon.ico`. On the old site
(16-Oct-2026) both the project-path and the host-root requests returned 404. The only effect is a
console 404. Adding an icon changes page bytes.

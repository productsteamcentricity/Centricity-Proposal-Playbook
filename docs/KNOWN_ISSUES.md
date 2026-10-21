# Known issues

This is the single register of confirmed defects, risks and gaps that the owner (Centricity Products
team, GitHub account `productsteamcentricity`) inherited at handover on 16-Oct-2026. **Apart from C2
(the stale README, replaced by the transfer's docs), none of them was fixed during the transfer.** Fix
each one as its own task on a `fix/…` branch (D68), never inside a data refresh. The tool, page and
data fixes of 16–19-Oct-2026 (PRs #3–#15) and the small fixes of 21-Oct-2026 (PRs #19–#23)
closed or narrowed most A, C, R, E and F items; each item's
status and section say which PR and what is left.

**How to use this file**

- Before every monthly refresh, read the items whose *Next refresh* column says **Blocks** or
  **Affects** (summary table below).
- Issue IDs are a group letter and a number (A, B, C, R, E, F). `D<n>` always means a decision in
  `docs/DECISIONS.md`; the repository, security and hosting issues were numbered D1–D7 before
  16-Oct-2026 and are now R1–R7.
- New defect: add a row and a section, using the next free ID in its group. Fixed: set *Status* to
  `Closed <date> (<commit or PR>)`, keep the section and add one line saying what changed. Partly
  fixed: `Partly fixed <date> (<PR>)`, with a line saying what is left.
- Line numbers were checked on 16-Oct-2026 against the files as they were then (`site/`, `tools/`).
  The reorganisation commit `cd05c97` edited tool lines in place, so tool line numbers match the
  pre-move audit. For items fixed or partly fixed since, the evidence lines describe the code
  **before** the fix; the dated *Fixed* line gives the current state. Re-find a line with Grep before
  editing; never Read `site/index.html` whole.
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
   Manager Data (B5, C15) and PMS & AIF Analytics (B6); and why four unmatured Debt ETFs are absent
   from the Sep-2026 Monitor (C19).
2. **Owner decision before the next MF cycle's rename `--apply`:** with dates now read correctly
   (A6), `rename_schemes.js` finds 8 renames in the Sep-2026 (and Aug-2026) Monitor that it used to
   miss: HDFC Retirement Savings Fund-Hybrid-Debt Plan → HDFC Retirement Fund-Hybrid-Debt Plan; four
   Kotak overseas FoFs, Omni → Active; two Axis FoFs, Active → Omni; and Motilal Oswal Asset
   Allocation Passive FoF-Aggressive → Motilal Oswal Multi Asset Passive FoF. All 8 match on the exact
   inception date. The Motilal one looks suspicious (MASTER files it as Equity ETF, the Monitor lists
   it on its Hybrid sheet, and the name changes more than a rename usually does): confirm it with the
   owner. None is applied yet. The new names sit on two of the four refresh-only Monitor sheets
   (`Solution Oriented,ETFs,FOFs` and `Hybrid`; C19, D80), so the bake lists these 8 rows as `not in
   MASTER` and leaves the old-name records with older figures. With the C19 parser fix, once a rename
   is approved and applied, the next bake refreshes that record by exact name (its class stays as
   MASTER has it: the refresh-only path never changes taxonomy). The list is also in
   `docs/update-log/2026-09_Sep-2026.md` (Run 2, corrected 19-Oct-2026).
3. A dry run that **exits 1 failed a gate**: stop and read the `GATE` lines. Exit 2 is a usage or
   input error (unknown flag, extra argument, bad `--as-on`, a duplicate input file, a missing source
   or a wrong `--html` path; the last two in every tool since PR #19); every tool except
   `verify_page.js` refuses an unknown flag or an extra argument (PR #15). Exit 0 still needs a read: count, `CHECK` and `WARN` lines
   never fail a run (A2, closed). Override flags (`--accept-drops`, `--allow-coverage-drop`,
   `--allow-shrink`, `--allow-layout-change`) are owner decisions.
4. Start from a clean git tree, snapshot the six deploy files into `backups/`, and keep OneDrive from
   syncing mid-run (R6). Writes are atomic now (A8) and a rename blocked by a sync is retried for
   about 6 s (PR #20), but a multi-file write is not one transaction.
5. A Bond List run names its desk (`--desk Invictus` or `--desk OneDigital`); the tool refuses an
   ambiguous sheet (A1, closed).
6. If a PMS & AIF Analytics file arrives, record the look-through as-on the tool prints in the update
   log; it never changes the MF analytics date (A3, closed).
7. Reckoner cycle: the tool refuses a DROPPED list that mirrors NO MASTER MATCH, more than 5% of the
   list dropped, an emptied category, or a dropped fund still listed under a deck heading `GRID`
   does not map (A4, closed); `--accept-drops <n>` waives only the 5% and emptied-category gates,
   after the owner has read the DROPPED list. PMS alias and Reckoner pins are edited in
   `tools/data/pins.json` only, with the owner (A18). Decide the Mosaic and Motilal GIFT City items
   with the desk (C4, C5).
8. **Owner decision C20 still open.** The C19 fix is complete: the parser (PR #17) and the
   September re-run (Run 3, PR #18, published 21-Oct-2026 on the owner's approval) give 214 of the
   215 stale funds their 30-Sep-2026 figures. The owner kept values from blank Monitor cells under the
   existing rule (D81) and held the JioBlackRock G-Sec record (C16) at its earlier values. Still to
   decide: how to treat returns quoted for periods longer than a fund has existed (C20, 13 records);
   apply the decision to all 13 together and release the held record in the same change.
9. The bake (step 2) has new lines to read every month (C19, D80): `refresh-only rows not merged`,
   `WARN expected Monitor sheet missing or with no fund rows`, `CHECK MASTER MF/ETF funds on no sheet
   of this Monitor` (Sep-2026: 19 rows, no WARN, 42), and a FAIL gate for fund rows on unrecognised
   sheets. A new fund on a refresh-only sheet is added to MASTER by hand with the owner, never by the
   bake. What to do with each line: `tools/README.md` §6.

## Summary

| ID | Title | Area | Sev | Status | Next refresh | Where |
|---|---|---|---|---|---|---|
| A1 | Bond List tool loads the first sheet and labels it Invictus | Tools: bonds | P1 | Closed 16-Oct-2026 (`d48620e`); more gates 19-Oct-2026 (PR #11) | — | `tools/merge_bond_list.js:66-92` |
| A2 | Eight tools exit 0 from a dry run when a gate failed | Tools | P2 | Closed 19-Oct-2026 (PRs #3, #7–#11) | — | every tool's `process.exit(fail ? 1 : 0)` |
| A3 | PMS/AIF look-through tool re-dates the MF analytics | Tools: PMS/AIF | P1 | Closed 16-Oct-2026 (`71fa58a`); hardened 19-Oct-2026 (PR #10) | — | `tools/merge_pms_aif_analytics.js:200-205` |
| A4 | Reckoner merge has no gate against dropped funds | Tools: Reckoner | P1 | Closed 16-Oct-2026 (`2ad7f61`); fourth gate 19-Oct-2026 (PR #10) | — | `tools/merge_reckoner.js:283-317` |
| A5 | Rename tool keeps orphan keys and loses earliest names | Tools: rename | P2 | Closed 19-Oct-2026 (PR #7; page lookup PR #12) | — | `tools/rename_schemes.js:225-281` |
| A6 | Excel dates read one day early on an IST machine | Tools + page | P2 | Closed 19-Oct-2026 (PRs #7, #8, #11, #12, #13, #14) | **Affects** (8 renames await the owner) | `tools/lib/dates.js`; `isoDay` in `site/index.html` |
| A7 | Two DIRECT_PERF builders; unchecked splice in `rebuild_directperf.js` | Tools: Direct | P2 | Partly fixed 19-Oct-2026 (PR #7) | — | `tools/lib/direct_perf.js`; `REFRESH.parseMfMonitorDirect` in `site/index.html` |
| A8 | Writes are in place, non-atomic and without backup | Tools | P2 | Closed 19-Oct-2026 (PRs #3, #7–#11) | — | `tools/lib/blocklib.js:60-82` |
| A9 | Date labels spliced in unescaped, by first match | Tools | P2 | Closed 19-Oct-2026 (PRs #3, #7, #9, #10) | — | `tools/lib/blocklib.js:115-151` |
| A10 | Two tools find MASTER by physical line | Tools | P2 | Closed 19-Oct-2026 (PRs #8, #11) | — | `B.locate` in both tools |
| A11 | DE returns join deletes returns the file lacks | Tools: DE | P2 | Closed 19-Oct-2026 (PR #8) | — | `tools/merge_direct_equity_returns.js:189-205` |
| A12 | Expense tool: hard-coded sample fund, gate that cannot fail | Tools: expense | P2 | Closed 19-Oct-2026 (PR #8) | — | `tools/merge_expense_exitload.js:129-146` |
| A13 | Header assumed on row 1 (DE universe, fund managers) | Tools | P2 | Closed 19-Oct-2026 (PR #8) | — | `tools/merge_de_universe.js:50-69`; `tools/merge_fund_managers.js:51-73` |
| A14 | DE universe joins by name only; industry never written | Tools: DE | P2 | Partly fixed 19-Oct-2026 (PR #8) | **Affects** (name-only join) | `tools/merge_de_universe.js:115-122` |
| A15 | Risk-matrix name normaliser strips "(Debt)" and similar | Tools: risk | P2 | Closed 19-Oct-2026 (PR #9) | — | `tools/merge_risk_matrix.js` `baseName` |
| A16 | SIF Monitor merge can keep an old as-on date | Tools: SIF | P2 | Closed 19-Oct-2026 (PR #9) | — | `tools/merge_sif_monitor.js:27-49`, `:125-149` |
| A17 | Post-bake analytics tools: heuristic fill, weak gates, file picking | Tools: analytics | P2 | Closed 19-Oct-2026 (PR #7) | — | `tools/fill_variant_analytics.js:33-46`, `:136`; `tools/rekey_sif_analytics.js:142` |
| A18 | PMS/Reckoner pin maps duplicated and partly stale | Tools: PMS | P2 | Closed 19-Oct-2026 (PR #10) | **Affects** (pins still by hand) | `tools/data/pins.json` |
| A19 | AIF performance merge carries data forward silently | Tools: AIF | P2 | Partly fixed 19-Oct-2026 (PR #10) | **Affects** | `tools/merge_aif_performance.js:227-229` |
| A20 | `add_reckoner_funds.js`: hard-coded deck facts; re-adds a dropped GIFT City fund | Tools: Reckoner | P2 | Partly fixed 19-Oct-2026 (PR #10) | **Affects** (universe change only) | `tools/add_reckoner_funds.js:57-105`, `:150-161` |
| A21 | Slide tools' gates are weaker than documented | Tools: slides | P2 | Closed 19-Oct-2026 (PR #11) | — | `tools/update_market_slides.js:34`, `:82-104` |
| A22 | Python risk-matrix route unvalidated and unguarded | Tools: risk | P2 | Partly fixed 19-Oct-2026 (PR #9) | — | `tools/build_risk_matrix.py:21-49` |
| A23 | `verify_page.js` and the vm tools hide real errors | Verification | P2 | Partly fixed 19-Oct-2026 (PRs #3, #7) | — | `tools/verify_page.js:83-94` |
| A24 | Shared libraries: latent parsing hazards | `tools/lib` | P2 | Partly fixed 16-Oct-2026 (PR #3) | — | `tools/lib/reck_parse.js:45-47`; `tools/lib/pptx.js:8-24` |
| A25 | Invisible characters that must survive any edit | Tools | P2 | Partly fixed 19-Oct-2026 (PRs #7, #9–#11, #15) | — | `.gitattributes` |
| A26 | One-off tools are not safe to re-run blindly | Tools | P3 | Closed 19-Oct-2026 (PR #11) | — | `tools/split_sif_add_mld.js`, `fold_duplicate_names.js`, `fold_index_funds.js` |
| A27 | Rehearsal harness cannot compare page-code changes | Tools: rehearsal | P3 | Closed 21-Oct-2026 (PR #23) | — | `tools/dev/rehearse.js` `--old-site` |
| B1 | No PMS performance file transferred; PMS at 31-Aug-2026 | Inputs | P2 | Open (desk) | **Blocks** PMS step | `site/index.html:1451` |
| B2 | Live Sep-2026 Reckoner deck not in the pack | Inputs | P2 | Open (desk) | **Blocks** Reckoner and AIF steps | `monthly-updates/2026-07_Jul-2026/` |
| B3 | Sep market deck in the pack is the superseded first issue | Inputs | P2 | Open (desk) | **Affects** | `monthly-updates/2026-09_Sep-2026/` |
| B4 | Sep analytics workbooks carry no SIF holdings | Inputs | P2 | Open (desk) | **Affects** | `monthly-updates/2026-09_Sep-2026/Analytics/` |
| B5 | Fund-manager data stops at 31-Aug-2026 | Inputs | P2 | Open (desk) | **Affects** | `monthly-updates/2026-08_Aug-2026/` |
| B6 | PMS/AIF look-through stops at 31-Jul-2026 | Inputs | P2 | Open (desk) | **Affects** | `monthly-updates/2026-07_Jul-2026/Analytics/` |
| B7 | Periodic inputs missing from the pack | Inputs | P3 | Open (desk) | — | `monthly-updates/` |
| C1 | Siblings 3–5 not folded into the page (six-file deploy) | Architecture | P2 | Open | — | `site/index.html:5083-5085` |
| C2 | README stale | Docs | — | Closed 16-Oct-2026 | — | `docs/archive/README_original_2026-05.md` |
| C3 | Risk stats flagged unreliable by the source are shown as normal | UI/data | P1 | Closed 19-Oct-2026 (PRs #9, #12, #13) | — | `tools/merge_risk_matrix.js:129-136`; `H.riskFlagged` |
| C4 | Mosaic Multiyield Series I keeps a Select badge | Data | P2 | Open (desk) | **Affects** | `CENTRICITY_SELECT` |
| C5 | Motilal Oswal Gift City India Equity Fund – Inbound not in MASTER | Data | P2 | Open (desk) | **Affects** | MASTER; `site/Centricity_June_Refresh.js` |
| C6 | Prism Hybrid Long-Short Fund has no AMC prefix | Data | P3 | Open | — | `site/Centricity_SIF_Refresh.js` |
| C7 | 360 ONE Balanced Hybrid Fund not in MASTER | Data | P3 | Open (upstream) | — | — |
| C8 | Five SIFs have no look-through (PRD list corrected) | Data | P2 | Open (desk) | **Affects** | analytics stores |
| C9 | Debt rating chart covered only the top 20 holdings | UI | — | Closed 14-Oct-2026 (`862e40b`) | — | — |
| C10 | `RISK_MATRIX` has no `c`; `RISK_MATRIX_BENCH_SD` stale | Data | P3 | Open | — | `site/index.html:5091-5094` |
| C11 | Rf = 4.5% to re-confirm with the desk | Data | P2 | Open (desk) | — | `tools/build_risk_matrix.py:28` (`--rf`, default 0.045) |
| C12 | Dead code kept for parity (`parseAnalytics` is not dead) | Code | P3 | Accepted | — | `site/index.html:6700`, `:6796-6807` |
| C13 | Cosmetic UI inconsistencies kept for parity | UI | P3 | Closed 19-Oct-2026 (PR #12), frozen-pane classes kept | — | `site/index.html` Master Editor heading; tab `num` 6.1–6.9 |
| C14 | Shared links drop funds renamed since the link was made | UI | P2 | Closed 19-Oct-2026 (PR #12) | — | `hashPick` in `site/index.html` |
| C15 | Fund-manager roster overwritten by the Sep bake | Data | P2 | Open (desk) | **Affects** | MASTER `fund_mgr`; `tools/merge_fund_managers.js` |
| C16 | JioBlackRock Nifty 8-13 yr G-Sec Index Fund: the Regular record carries the Direct plan's inception | Data | P3 | Open (decided with C20) | — | MASTER `inception`, `prev_name`; Sep-2026 Monitor |
| C17 | Risk-flag footnote overlaps a long Portfolio Matrix slide | UI | P3 | Closed 21-Oct-2026 (PR #21) | — | `NOTE_Y`, `mk` in the matrix slide, `site/index.html` |
| C18 | Select popover ratios are never marked unreliable | UI | P3 | Closed 21-Oct-2026 (PR #22) | — | `CentricitySelectPopover`, `site/index.html` |
| C19 | 215 funds on four unmapped Monitor sheets carry pre-September performance | Data | P1 | Fixed: code 19-Oct-2026 (PR #17), data 21-Oct-2026 (PR #18, 214 funds; 1 held for C20) | **Affects** (read the new bake lines) | `REFRESH_ONLY_SHEETS`, `site/index.html:3225-3227`, `:3397-3403`; `tools/bake_month.js:152-169`, `:212-220` |
| C20 | JioBlackRock Regular records show Direct-plan returns from before their launch | Data | P1 | Open (owner decision); G-Sec record held | — | MASTER returns; non-null merge `site/index.html:3414-3415` |
| C21 | Taxonomy oddities on the Monitor's ETF and FoF sheets | Data | P3 | Open | — | `SHEET_MAP['Debt Oriented']`, `site/index.html:3198`; MASTER |
| C22 | A long Portfolio Matrix slide without a flagged fund runs past its notes and the slide | UI | P3 | Open | — | matrix slide `rowH:0.24*mk`, `site/index.html` |
| C23 | Select popover Alpha shown 100 times too large [inference] | UI/data | P2 | Open (desk: confirm the unit) | — | `fmtPctRaw(info.alpha)` in `CentricitySelectPopover`; `CENTRICITY_SELECT[].alpha` |
| C24 | Headline weighted IRR counts instruments with no IRR band as 0% | UI/data | P2 | Open (owner decision) | — | `computeKPIs`, `site/index.html:1609-1626` |
| C25 | Debt Analytics fund picker and its hint disagree | UI | P3 | Open | — | Debt Analytics picker |
| C26 | Centricity Select popover gaps (empty HDFC FoF entry; PMS popover dates differ) | Data | P3 | Open (desk) | — | `CENTRICITY_SELECT` |
| C27 | BHARAT Bond FoF Apr-2030: Direct figures equal Regular | Data | P3 | Open (desk) | — | `DIRECT_PERF` |
| R1 | Client PII still public in the outgoing owner's repo and site | Security | P1 | Open (outgoing owner) | — | upstream `Portfolio_Review_Build_Prompt.md` |
| R2 | Public repo and site; `robots.txt` ineffective | Security | P2 | Accepted (D60); `noindex` meta added 19-Oct-2026 (PR #12, D77) | — | `site/robots.txt`; `site/index.html:3` |
| R3 | CDN scripts load without integrity (SRI) | Security | P2 | Closed 19-Oct-2026 (PR #12, D77) | — | `site/index.html:1224-1228` |
| R4 | `xlsx` 0.18.5 has two high-severity advisories | Security | P2 | Accepted | — | `package.json`; `site/index.html:1227` |
| R5 | Stale `Centricity_Risk_Matrix.js` is published | Hosting | P3 | Closed 19-Oct-2026 (PR #12, D78) | — | `docs/archive/Centricity_Risk_Matrix_2026-06-30.js` |
| R6 | The git repository lives inside OneDrive | Repo | P2 | Open (owner decision); blocked rename retried since 21-Oct-2026 (PR #20) | **Affects** | repo root |
| R7 | Old site still live alongside the new one | Hosting | P2 | Open (outgoing owner) | — | old Pages site |
| E1 | Operating manual keeps stale statements as history | Docs | P3 | Accepted | — | `docs/OPERATING_MANUAL.md` → Errata |
| E2 | PRD contains wrong tool and hosting facts | Docs | P3 | Open | — | `docs/PRD.md` §2, §5, §11, §13, §14 |
| E3 | Runbooks and specs are out of date | Docs | P2 | Open | **Affects** (if followed) | `docs/runbooks/`, `docs/specs/` |
| E4 | Stale comments inside the deploy files | Docs/code | P3 | Closed 19-Oct-2026 (PR #12) | — | — |
| E5 | Tool comments that contradict the code | Docs/code | P3 | Closed 19-Oct-2026 (PRs #7–#11) | — | — |
| F1 | Usage text shows pre-move commands | Tools | P3 | Closed 19-Oct-2026 (PRs #7–#12) | — | every tool's usage string |
| F2 | Unused code in tools | Tools | P3 | Partly fixed 19-Oct-2026 (PRs #8, #10, #11, #15) | — | `tools/merge_bond_list.js:114`; `tools/lib/pptx.js:9` |
| F3 | Browser request for `favicon.ico` returns 404 | Site | P3 | Partly fixed 19-Oct-2026 (PR #12, D77) | — | `site/index.html:3` |

---

## A. Data-integrity risks in tools

### A1. `merge_bond_list.js` loads the first sheet and labels it Invictus
**P1 · Closed 16-Oct-2026 (`d48620e`); more gates 19-Oct-2026 (PR #11) · —**

- **Fixed:** `--desk` is required and must be a Bonds desk already in MASTER; the sheet is `--sheet`,
  else the only sheet, else the one tab named for the desk, and anything else (or a tab named for
  the other desk) is refused. Row 1 must be the Bond List header, the maturity gate compares with
  today, and a dry run exits 1 on a failed gate. The evidence below is the code before the fix.
- **Fixed 19-Oct-2026 (PR #11), on top of that:** MASTER is found with `B.locate` and written
  atomically after a re-read gate (other records and every byte outside MASTER unchanged); an empty
  sheet is refused ("at least one bond parsed") instead of emptying the desk; the IRR gate also
  requires `irr_high` < 30%; bonds another desk already lists are printed as a `CHECK` (report only;
  the June workbook's two sheets overlap 14 of 14); unknown flags and extra arguments exit 2.

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

### A2. Eight tools exit 0 from a dry run when a gate failed
**P2 · Closed 19-Oct-2026 (PRs #3, #7–#11) · —**

- **Fixed 19-Oct-2026:** every tool now exits 1 from a dry run when a gate failed and refuses
  `--apply` on the same condition (for example `bake_month.js:198`, `rebuild_directperf.js:90`,
  `merge_de_universe.js:148`, `merge_direct_equity_returns.js:223`, `merge_expense_exitload.js:146`,
  `merge_pms_performance.js:214`, `pin_pms_alias.js:80`, `update_market_slides.js:104`).
  `verify_page.js` exits 1 on a hard failure (PR #3). Exit 2 means a usage or input error (a
  missing source still crashes with exit 1 in five PMS, AIF and Reckoner tools: *Before the next
  refresh*, item 3). Lines marked `CHECK`, `WARN` or carrying only counts never fail a run, so the
  dry run is still read. The evidence below is the code before the fix.

- **What:** In a dry run these tools exit 0 before they check the failure flag, so a failed gate
  appears only as text.
- **Evidence:** the dry-run exit and the refusal on the next line: `tools/bake_month.js:146-147`,
  `merge_de_universe.js:109-110`, `merge_direct_equity_returns.js:182-183`,
  `merge_expense_exitload.js:134-135`, `merge_pms_performance.js:185-186`, `pin_pms_alias.js:60-61`,
  `rebuild_directperf.js:89-90`,
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
**P1 · Closed 16-Oct-2026 (`71fa58a`); hardened 19-Oct-2026 (PR #10) · —**

- **Fixed:** the tool no longer writes `DATA_DATES.analytics`; it writes EQUITY_ANALYTICS and the
  sibling `EQ` only. `--as-on` stays required and is printed, with the unchanged MF analytics date,
  for the update log (D70). Rehearsed with `--apply` on the July workbook: the old tool's only page
  change was the label (30th September -> 31st July 2026); the new one leaves all files identical.
  Not changed: `merge_analytics.js:138` still re-dates all three classes when it re-bakes one, and
  the "Also in this tool" points below stand. The evidence below is the code before the fix.
- **Fixed 19-Oct-2026 (PR #10), the "Also in this tool" points:** the holdings sheet is found by its
  header (`--sheet` picks one when several qualify; an empty or notes sheet first no longer crashes);
  stale look-through entries are listed, never deleted; the page and the June sibling are written in
  one `writeFilesAtomic` call after every gate passed; `--as-on` must be a plain label. Still no date
  is written (D70).

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
**P1 · Closed 16-Oct-2026 (`2ad7f61`); fourth gate 19-Oct-2026 (PR #10) · —**

- **Fixed:** three refusal gates before any write (D71): a dropped Select entry whose category also
  holds a deck name that matched nothing (never waived); more than 5% of the current list dropped;
  a Select category emptied. `--accept-drops <n>` waives the last two only when the run drops exactly
  n. `NO_MASTER_NOTE` names (exact) count as known gaps; the gate pairs within one category only. The dry run exits 1 on a failed gate, and the DROPPED
  banner no longer names the August deck. On the Aug-2026 deck with `prev_name` stripped (the
  Sep-2026 failure mode) the old tool wrote 178 -> 151 with every gate passing; the new one refuses.
  On the real deck both write identical output. The evidence below is the code before the fix.
- **Fixed 19-Oct-2026 (PR #10), a fourth gate (D76):** a dropped entry the deck still lists under a
  heading `GRID` does not map (a renamed heading such as "Focused Fund" for "Focused Funds") fails,
  and `--accept-drops` does not waive it. Rows under an unmapped heading never reach `resolve()`, so
  gate (1) could not see them. Pairing is heuristic: the same normalised name ignoring spaces, or at
  least 80% of words shared; a rename sharing less is not caught. `PIN` moved to
  `tools/data/pins.json` (A18). Not built: a check that the deck is newer than the live Select data
  (an older deck applied over a newer list passes every gate).

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
**P2 · Closed 19-Oct-2026 (PR #7; page lookup PR #12) · —**

- **Fixed 19-Oct-2026 (PR #7, D79):** when the live name already has an entry in a store, the stale
  old-name entry is dropped and listed; a record renamed again keeps `prev_name` (the immediate old
  name) and gains `prev_names` (every earlier name, oldest first); a key from two renames ago moves
  to the live name; a name live in MASTER is never mapped away. Only changed blocks are written, page
  and IRR sibling in one `writeFilesAtomic` call, and a re-run with nothing new writes nothing. A
  missing or unreadable store fails a gate. PR #12: `H.buildFundIndex` indexes `prev_names` too, so
  a name from two renames ago resolves in the page. Each Sep/Aug run reports about 15 dropped stale
  keys; most are re-created by the bake and dropped again next month (harmless). The evidence below
  is the code before the fix.

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
**P2 · Closed 19-Oct-2026 (PRs #7, #8, #11, #12, #13, #14) · Affects the next rename step (8 renames await the owner)**

- **Fixed 19-Oct-2026 (D73):**
  - Tools: `tools/lib/dates.js` `isoDay` (round to the nearest local day) is used by
    `rename_schemes.js` (PR #7), `merge_fund_managers.js` (PR #8) and `fold_duplicate_names.js`
    (PR #11).
  - Page: `isoDay` in `parseMfMonitor` and `isoDayLite` in the SIF sibling's `parseSif` (PR #12).
  - Data (PR #13): MASTER `inception` +1 day on 1,851 records (Mutual Fund 1,689, Mutual Funds 12,
    ETF 150); SIF sibling 30 of 30 +1 day. Detail: `docs/update-log/2026-09_Sep-2026.md`, Run 2.
  - PR #14 removed the temporary one-day allowance from `rename_schemes.js`: inception is compared
    on the exact day. Since PR #13, 2,070 of the 2,072 Sep-2026 Monitor rows found in MASTER carry
    the Monitor's exact inception (219 before). The two exceptions: JioBlackRock Nifty 8-13 yr G-Sec
    Index Fund-Reg(G), a 364-day source conflict (C16), and DSP World Gold Mining Overseas Equity
    Omni FoF-Reg(G), a legacy "Mutual Funds" record the bake does not refresh, still one day early.
  - Side effect: reading the Monitor's true date, `rename_schemes.js` now finds 8 renames it used
    to miss, all on the exact inception date. They are not applied and wait for the owner ("Before
    the next refresh", item 2).
  - Left as is: `fold_duplicate_names.js` still labels a one-day difference "matches monitor
    (MASTER one day early, A6)" in an informational note (no data effect). The page's
    `parseMfMonitor` fallback as-on label uses local date getters on a SheetJS date; today's
    Monitors never reach it.
  - The evidence below is the code before the fix.

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
**P2 · Partly fixed 19-Oct-2026 (PR #7) · —**

- **Fixed 19-Oct-2026 (PR #7):** the bake's builder moved verbatim into `tools/lib/direct_perf.js`
  and both `bake_month.js` and `rebuild_directperf.js` use it (Aug Direct monitor: 0 value
  differences, property order only). `rebuild_directperf.js` reads MASTER and DIRECT_PERF with
  `B.locate` and stops with nothing written if either is missing, duplicated or unbalanced; both
  tools refuse a DIRECT_PERF below 95% of the current block. **Still open:** the page's Section 7
  Direct uploader (`REFRESH.parseMfMonitorDirect`) is a separate parser and still differs (merges
  into the session store; `Number()` conversion; maturity only with a `YTM (%)` column). On the Aug
  and Sep files both give identical values. The evidence below is the code before the fix.

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
**P2 · Closed 19-Oct-2026 (PRs #3, #7–#11) · —**

- **Fixed (D72):** `blocklib.writeFileAtomic` writes a `.tmp` file beside the target and renames it
  over the target (PR #3); `writeFilesAtomic` checks every output (non-empty, `</html>` kept) before
  writing any. Every tool now builds its outputs in memory and writes once, after every gate passed
  (PRs #7–#11); no tool calls `fs.writeFileSync` on a site file. `build_risk_matrix.py` writes a temp
  file and renames it. **Left as is:** a two-file write is two renames, not one transaction; tools
  make no backup (the process does, `docs/MONTHLY_UPDATE_PROCESS.md` B3); `tools/lib/reck_parse.js`
  run as a command still writes its argument directly (A24). Since 21-Oct-2026 (PR #20) a rename
  blocked by a OneDrive sync is retried for up to 6.3 s, and the temp file is also removed when the
  temp write itself fails (R6). The evidence below is the code before
  the fix.

- **What:** Every tool overwrites files in place with `fs.writeFileSync`: no temporary file and
  rename, and no backup. Several tools write two or three times per run.
- **Evidence:** `tools/lib/blocklib.js:47`. Multi-step writes: `rename_schemes.js:248,250`;
  `merge_analytics.js:136,139`; `merge_pms_performance.js:187-193`;
  `merge_pms_aif_analytics.js:168,174`; `merge_risk_matrix.js:197` then `:203-210` (if the
  `riskMatrix` line is missing it exits after writing the new matrix under the old date, `:206`);
  `merge_sif_monitor.js:108` then `:110-114` (same pattern for `DATA_DATES.sif`);
  `add_reckoner_funds.js:216,233`; `fold_duplicate_names.js:265,267`. `merge_bond_list.js:27` and the
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
**P2 · Closed 19-Oct-2026 (PRs #3, #7, #9, #10) · —**

- **Fixed:** `blocklib.checkAsOn` accepts only "31st October 2026" (long) or "31 Oct 2026" (short)
  and every other label exits 2; `setDataDate` changes one key inside `window.DATA_DATES = {…}` only
  and refuses unless it matches exactly once; `replaceOnce` refuses zero or several matches and
  treats `$` literally (PR #3). Used by `bake_month.js`, `merge_analytics.js` (PR #7),
  `merge_risk_matrix.js` (line-anchored `DATA_DATES.riskMatrix`), `merge_sif_monitor.js` (PR #9) and
  `merge_pms_performance.js` (PR #10). `build_risk_matrix.py` applies the same short-label rule. The
  evidence below is the code before the fix.

- **What:** `--as-on` values go into regex replacements and JS string literals without validation.
  The regexes take the first match anywhere in the 12.8 MB file.
- **Evidence:** `tools/bake_month.js:169-170`; `merge_analytics.js:138`; `merge_pms_performance.js:192`.
  The last two do not check that the pattern matched, and log
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
**P2 · Closed 19-Oct-2026 (PRs #8, #11) · —**

- **Fixed:** both tools find MASTER with `B.locate`, which refuses a second `window.MASTER = [`
  literal, and write it with blocklib (`merge_direct_equity_returns.js`, PR #8;
  `merge_bond_list.js`, PR #11, with a re-read gate). The evidence below is the code before the fix.

- **What and evidence:** `tools/merge_direct_equity_returns.js:131-135`, `:184` and
  `tools/merge_bond_list.js:56-61`, `:259` look for a line starting `<script>window.MASTER = ` and
  slice from its first `[` to its last `]`. That holds today (`site/index.html:1434`).
- **Impact:** Reformatting `index.html` (MASTER no longer on its own line, or anything containing `]`
  after the array on that line) breaks these tools or corrupts MASTER.
- **Workaround:** Never reformat or pretty-print `index.html`.
- **Suggested fix:** Use `blocklib.read` and `writeBlocks`, like the other tools.

### A11. DE returns join deletes returns the file lacks
**P2 · Closed 19-Oct-2026 (PR #8) · —**

- **Fixed:** a per-tenor coverage gate counts, among matched stocks carrying a tenor, the ones that
  would **lose** it (gains elsewhere cannot hide losses) and fails above 5%, printing a before /
  after / lost table (`merge_direct_equity_returns.js:189-205`). `--allow-coverage-drop` lets
  `--apply` through after the owner accepts it. Repeated ISINs and names: the first row wins for
  both, and repeats are reported. Up to 5% of a tenor can still be lost with exit 0, by design; read
  the `lost` column. The evidence below is the code before the fix.

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
**P2 · Closed 19-Oct-2026 (PR #8) · —**

- **Fixed:** a missing sample fund prints "SAMPLE skipped"; the count gate compares with the count
  read before the run; Direct-plan writes are counted only when the value changes ("updated N
  (unchanged M)"); the text says "outside 0-8%"; the unused `MISSING` regex is gone. MASTER and
  DIRECT_PERF are written in one atomic write. The read range starts at the sheet's used range, so a
  sheet that does not start at A1 is read correctly. The evidence below is the code before the fix.

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
**P2 · Closed 19-Oct-2026 (PR #8) · —**

- **Fixed:** both tools find the header row by its exact column names (case and spaces ignored)
  within the first 30 rows, and refuse a column that appears twice. `merge_fund_managers.js` joins
  exact name, then `prev_name` (a live name always wins), then normalised name; a `prev_name` or
  normalised name shared by two records is reported as ambiguous and not written. The evidence below
  is the code before the fix.

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
**P2 · Partly fixed 19-Oct-2026 (PR #8) · Affects the DE universe step**

- **Fixed:** exact header names (a new "Sector Code" column can no longer be picked up), the workbook
  is read once, and the dead industry parsing and its header claim are gone (MASTER has no industry
  field). A new listing that equals an existing record's `prev_name` is flagged with `!` before
  `--apply`. **Still open:** the join is by normalised name only (the file has no ISIN), the tool
  never renames or stamps `prev_name`, and the `prev_name` warning does not fail the run. Keep the
  workaround below. The evidence below is the code before the fix.

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
**P2 · Closed 19-Oct-2026 (PR #9) · —**

- **Fixed:** `baseName` strips exactly `(G)`, `(D)`, `(Growth)`, `(IDCW…)` and `(Dividend…)`. Only
  the four MASTER names with `(Debt)`, `(Delhi)` or `(Gujarat)` change base name; Sep join tiers are
  unchanged (exact 1,027 / prev_name 32 / plan-base 29). The evidence below is the code before the fix.

- **What and evidence:** `baseName` in `tools/merge_risk_matrix.js:107-113` removes any parenthetical
  that starts with G or D, such as "(Debt)", "(Delhi)" or "(Gujarat)". This contradicts its own
  "whitelist ONLY" comment (`:105-106`). The archaeology pass found four MASTER names affected and
  no collisions today.
- **Impact:** Two future funds that differ only by such a parenthetical could be joined to the wrong
  risk stats [inference].
- **Workaround:** Read the tier-3 joins in the dry run.
- **Suggested fix:** Match the real plan markers exactly.

### A16. SIF Monitor merge can keep an old as-on date
**P2 · Closed 19-Oct-2026 (PR #9) · —**

- **Fixed:** `--as-on` is required (missing → exit 2) and must be a long label; exactly one
  positional workbook, and an unknown flag such as `--html` exits 2. The date the sibling stamps on
  load is cleared before parsing; new gates check that `DATA_DATES.sif` equals `--as-on` and that the
  fallback line exists exactly once. The SIF block and its date land in one atomic write after every
  gate passed. Not checked: that `--as-on` matches the month in the file name. The evidence below is
  the code before the fix.

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
**P2 · Closed 19-Oct-2026 (PR #7) · —**

- **Fixed:** `fill_variant_analytics.js` lists a tie for best sibling as ambiguous and does not fill
  it (no ties in the Sep or Aug workbooks); its header now says entries are replaced. `bake_month.js`
  and `fill_variant_analytics.js` refuse two files for one stem or a missing file or folder (exit 2).
  The DIRECT_PERF gate is relative: below 95% of the current block, or 0 matched, fails (bake and
  rebuild). `rekey_sif_analytics.js` fails and lists any key a store would lose unless
  `--allow-shrink`, skips a SIF whose `sif_raw` equals its name, and shows the siblings' console
  (an error fails the run). `bake_month.js` and `fill_variant_analytics.js` (and `merge_analytics.js`)
  fail a gate on an inline-script error (A23). The evidence below is the code before the fix.

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
**P2 · Closed 19-Oct-2026 (PR #10) · Affects the PMS step (pins are still set by hand)**

- **Fixed (D75):** `tools/data/pins.json` holds the PMS alias, Reckoner and AIF-performance pins
  (`merge_pms_aif_analytics.js` keeps its own look-through `PIN` map and `add_reckoner_funds.js` its
  `ADD` list, both edited in code with the owner): `pms_alias` (MASTER PMS name →
  scheme key; `repin` entries are re-pointed by `merge_pms_performance.js`, `pin` entries by
  `pin_pms_alias.js`), `reckoner` (deck name → MASTER name, read by `merge_reckoner.js`), and
  `aif_performance` (deck names `merge_aif_performance.js` looks up in `reckoner`). The four maps
  were moved unchanged (12 repin, 5 pin, 12 reckoner, 3 AIF). `trailing_space` lists the names that
  end in a space on purpose; all four tools exit 1 if that list and the data disagree (A25).
  "Still pinned null" is built from the live alias map (4 today). The exit-load year digit must
  stand alone (`(?<![0-9.])1(?![0-9])`), so "12 months: 1%" no longer reads as year 1 or 2.
  **Left as is:** the PMS block is still replaced wholesale, guarded by the MASTER-coverage and
  value-range gates only (there is no drop or category gate and no override flag); the exit-load
  change could not be checked against a real PMS file (B1), so read the `exit_load` changes on the
  next PMS run. The evidence below is the code before the fix.

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
**P2 · Partly fixed 19-Oct-2026 (PR #10) · Affects the Reckoner step**

- **Fixed:** "GATE deck layout as expected" fails when the market-cap sub-header is not in the last
  four columns, when no PMS – EQUITY grid with a 2Y column is found, or when the benchmark count
  differs from the stored block. `--allow-layout-change` accepts it after the slides were checked by
  hand; the stored benchmarks are then carried forward. The run prints that benchmark SI is set to
  null. **Still open:** slides are scanned by XML file number, not deck order; no AIF as-on date is
  stored; "GATE every key is a MASTER AIF record" prints but cannot fail. The evidence below is the
  code before the fix.

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
**P2 · Partly fixed 19-Oct-2026 (PR #10) · Affects the refresh only if the deck adds funds (see C4, C5)**

- **Fixed:** before an `ADD` slide number is used, that slide must name the fund, or the run
  refuses and says which slides do; a GIFT City fund is written to `NEW_GIFT` only while this deck
  still names it, with an exact-name presence test; the page and the June sibling are written in one
  `writeFilesAtomic` call after every gate; `--usd-inr` (default 88) sets the USD mn → ₹ crore rate;
  `--pms` is accepted, ignored and reported as deprecated; the dry run exits 1 on a failed gate.
  **Still open:** `ADD` is still hard-coded (slides are not found from the deck index), and PMS
  additions keep their non-schema keys (not removed, to avoid a data change). The evidence below is
  the code before the fix.

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
**P2 · Closed 19-Oct-2026 (PR #11) · —**

- **Fixed:** every slide must be 2001×1125 (a fixed size, not the current first image); the
  `EXTRA_SLIDES` literal is found and spliced with blocklib, with no vm; gates re-read the result
  (untouched keys byte-identical, market equals the new slides, every byte outside `EXTRA_SLIDES`
  unchanged). The closing tool also checks that `disclaimer.png` is a PNG and `thankyou.jpg` a JPEG.
  The re-read gates catch splice faults only, which is what was asked. The evidence below is the code
  before the fix.

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
**P2 · Partly fixed 19-Oct-2026 (PR #9) · —**

- **Fixed:** argparse takes exactly four positionals plus `--rf` (decimal, default 0.045); any misuse
  exits 2 before anything is read. The output must be a `.js` path outside `site/`, not one of the
  inputs, in an existing folder; it is written to a temp file and renamed. The label must be a plain
  short date. A `prev_name` tier joins renamed funds. NAV and benchmark values ≤ 0 count as missing,
  near-zero dispersions are guarded, non-finite values are dropped, and the run stops (exit 1) on two
  MASTER literals, duplicate dates, a missing benchmark column or less than 5 years of history.
  Sep-2026 run (scratch output): 1,086 of 1,088 joined. **Still open:** not validated for
  production (it agrees with the live matrix on most fields, `co` least); Rf to confirm (C11); it
  reads only the inline MASTER. The evidence below is the code before the fix.

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
**P2 · Partly fixed 19-Oct-2026 (PRs #3, #7) · —**

- **Fixed:** `verify_page.js` hides only the exact "React / ReactDOM / Chart / XLSX / PptxGenJS is
  not defined" messages, so a typo's ReferenceError counts; it defaults to `site/` and exits 1 on a
  missing sibling, duplicate names, a page not ending `</html>`, a script error or a Select key
  missing from MASTER (PR #3). `bake_month.js`, `fill_variant_analytics.js` and `merge_analytics.js`
  fail "GATE sandbox inline blocks" on any other inline-script error; `rekey_sif_analytics.js` shows
  the siblings' warnings and errors and fails on an error (PR #7). **Still open:** no count is
  compared with a baseline (compare with `docs/PROJECT_STATE.md` by hand); a protocol-relative
  `src` would still count as a missing sibling; the script regex is still lazy. The evidence below
  is the code before the fix.

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
**P2 · Partly fixed 16-Oct-2026 (PR #3) · —**

- **Fixed (blocklib):** `locate` refuses a prefix with more than one literal assignment, and
  `spliceBlocks` refuses duplicate or overlapping prefixes in one write. **Still open:** the
  `pptx.js`, `reck_parse.js` and `reck_narrative.js` points below are unchanged. The evidence below
  is the code before the fix.

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
**P2 · Partly fixed 19-Oct-2026 (PRs #7, #9–#11, #15) · —**

- **Fixed:** the NUL separator in `rename_schemes.js` is now `'\u0000'`, and the no-break spaces in
  `rename_schemes.js`, `tools/lib/direct_perf.js` (the bake's old parser), `merge_risk_matrix.js` and
  `merge_bond_list.js` are `\u00A0` escapes. The trailing-space pin names moved to
  `tools/data/pins.json`, whose `trailing_space` list the four pin tools check (A18). `'DEBT AIF '`
  and `'Unlisted Equity '` stay in `merge_reckoner.js`, commented as data. PR #15 replaced the last
  two literal no-break spaces (`tools/merge_fund_managers.js:112`,
  `tools/merge_pms_aif_analytics.js:70`) with escapes; no literal U+00A0 or NUL is left in `tools/`.
  **Still open:** the `.gitattributes` comment still says `rename_schemes.js` holds a NUL (harmless).
  The evidence below is the code before the fix.

- **What and evidence:** A NUL byte is the tier-3 key separator in `tools/rename_schemes.js:146`.
  Literal no-break spaces (U+00A0) sit inside regexes at `rename_schemes.js:86`, `:95`,
  `bake_month.js:271`, `merge_risk_matrix.js:108`, `merge_pms_aif_analytics.js:53` and
  `merge_bond_list.js:50`. Trailing spaces are deliberate in keys that match live data:
  `pin_pms_alias.js:20` (`'Karma Capital Wealth Builder '`), `merge_reckoner.js:83` (`'DEBT AIF '`),
  `:95` (`'Unlisted Equity '`), `add_reckoner_funds.js:57-58`. `.gitattributes` forces text diffs for
  `rename_schemes.js`, which git would otherwise treat as binary.
- **Impact:** An editor, formatter or "trim trailing whitespace" setting silently changes join keys,
  so renames, pins and Select sheets stop matching.
- **Workaround:** Edit these files with a tool that preserves bytes; check that `git diff` shows only
  the intended change.
- **Suggested fix:** Replace NUL and NBSP with `\u0000` and `\u00A0` escapes (same behaviour);
  comment the trailing-space keys, which are data.

### A26. One-off tools are not safe to re-run blindly
**P3 · Closed 19-Oct-2026 (PR #11) · —**

- **Fixed:** `split_sif_add_mld.js` inserts the MLD record only when it is missing and reports any
  difference from its values (comments now say 30 SIFs); `fold_duplicate_names.js` stops (exit 1)
  when the IRR sibling is missing or does not parse, and treats `Centricity_Risk_Matrix.js` as
  optional (R5); `fold_index_funds.js` reports, never fixes, a product_class "Index Fund" that a
  sibling brings back at load (live: 7,682 records, 0). The 12 legacy SIF rows remain for C1. The
  evidence below is the code before the fix.

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

### A27. Rehearsal harness cannot compare page-code changes
**P3 · Closed 21-Oct-2026 (PR #23) · —**

- **Fixed:** `--old-site <dir>` seeds the old side from another site folder (normally the old
  checkout's `site/`); without `--old`, this checkout's tools run on both sides. Because the two
  outputs then always differ in the seeded page code, the harness prints a data verdict (`OLD and
  NEW data: IDENTICAL` / `DIFFER`): blocks and `DATA_DATES` compared, page code outside the blocks
  required to equal each side's seed, siblings required unwritten or equal. A step that cannot start
  now logs `*** spawn failed` instead of a bare `exit=null`. Checked (21-Oct-2026): a page-code-only change (C17/C18) gives data IDENTICAL on three cases;
  the C19 parser change gives MASTER only, 223 records (the 215 plus the 8 pending renames the case
  applies first; `docs/TESTING.md` §2.3). The evidence below is the state before the fix.

- **What and evidence:** `tools/dev/rehearse.js` seeds both the old and the new side from
  `<new root>/site` (`:9`, `:21`, `:38-39`). `bake_month.js` and the other vm tools run the parsers
  of the `index.html` they are given, so both sides run the **new** page parser, and a change to
  page code (such as the C19 parser fix) shows as `IDENTICAL`.
- **Impact:** a page-parser change cannot be proven behaviour-preserving with `npm run rehearse`.
  The C19 change was checked by hand instead: the September chain run on two scratch copies, one
  with `main`'s `index.html` (C19, *Verification*).
- **Suggested fix:** an `--old-site <dir>` option that seeds the old side from the old checkout's
  `site/`.

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

C1–C13 are PRD §14 items 1–13, re-checked on 16-Oct-2026. C14–C18 are not in the PRD.

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
**P1 · Closed 19-Oct-2026 (PRs #9, #12, #13) · —**

- **Fixed (D74):** `merge_risk_matrix.js` carries the source's reliability flag as `fl` on the
  RISK_MATRIX entry: `split` when the note says the risk stats are unreliable after a NAV split
  (split outranks low correlation), `lowcorr` for low correlation to the benchmark (PR #9). Not
  carried: the 12 Sep-2026 notes that a split affects Max Drawdown only (the page never shows it)
  and the 122 short-history flags (those funds already show "—"). `H.riskFlagged(entry)` (it takes a
  RISK_MATRIX entry, not a name) puts a dagger on the fund and adds `H.RISK_FLAG_NOTE` as a footnote
  on the Portfolio Matrix tab and its PowerPoint slide; the Excel export has no RISK_MATRIX sheet
  (PR #12). The Sep-2026 data carries 33 flags: 28 `split`, 5 `lowcorr` (PR #13). Follow-ups: C17,
  C18. The evidence below is the state before the fix.

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

Since 19-Oct-2026 (PR #9) it is the `--rf` argument of `tools/build_risk_matrix.py` (default 0.045,
printed on every run). It matters only for the Python route; `merge_risk_matrix.js` takes the
vendor's ratios as given [inference].

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
**P3 · Closed 19-Oct-2026 (PR #12), except the frozen-pane classes · —**

- **Fixed:** the heading reads "Master Data Editor", and the Live Output tab numbers run 6.1–6.9
  with no repeat (they are not displayed). The frozen-pane classes still have no CSS and are left
  alone: there is no design to apply. The text below is the state before the fix.

The Master Editor heading reads "Section 6 · Master Data Editor" (`site/index.html:8335`). Portfolio
Matrix and Equity Analytics share tab number 6.4 (`:8867`, `:8874`); the number is not rendered.
The frozen-pane classes (`frozen-pane`, `frozen-lock`, `frozen-title`, `frozen-sub`) have no CSS
rule (checked 16-Oct-2026).

### C14. Shared links drop funds renamed since the link was made
**P2 · Closed 19-Oct-2026 (PR #12) · —**

- **Fixed:** the `#p=` loader (`hashPick`) resolves each name not in MASTER verbatim through
  `H.resolveFundName`, so an old (`prev_name` / `prev_names`) name loads the live fund and an old and
  current name for one fund are folded together. A banner lists the names it could not find
  (unknown, empty or ambiguous), and a second line lists names matched only to a similar name (plan,
  prefix or close tier: "check before exporting"). The banner has no dismiss control. More funds now
  load than before: the old loader dropped every non-exact name silently, renamed or similar. The
  evidence below is the code before the fix.

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
- **Widened by the C19 fix (19-Oct-2026):** the bake now also writes `fund_mgr` for the 215 funds on
  the refresh-only sheets. In the published September re-run (Run 3, PR #18; the held C16 record
  excluded) 129 change: 119 shorten a roster to one name already on it (in 36 of them not the
  first-listed name), and 10 name a different person. For
  those 10 the Aug-2026 Fund Manager Data shows the previous managers' tenures ending 31-Jul or
  31-Aug-2026 (e.g. Aditya Birla SL Aggressive Hybrid Omni FOF: Vinod Narayan Bhat → Kartikeya
  Singh), so they are real updates. Step 9 still restores the full teams.

### C16. JioBlackRock Nifty 8-13 yr G-Sec Index Fund: the Regular record carries the Direct plan's inception
**P3 · Open (decided with C20) · —**

- **Corrected 19-Oct-2026 (financial-data review): not a source conflict.** MASTER gives
  `JioBlackRock Nifty 8-13 yr G-Sec Index Fund-Reg(G)` an inception of 2025-08-18; the 30-Sep-2026
  Monitor says 2026-08-17. The May–Jul-2026 Monitors list only the fund's `(G)-Direct Plan` row
  (inception 2025-08-18); from Aug-2026 they list the `-Reg(G)` row (inception 2026-08-17). The
  MASTER record was renamed from the Direct-plan name (its `prev_name`), so the Monitor's 2026-08-17
  is right for the Regular record and MASTER's date is the Direct plan's launch. It is one of two Sep
  Monitor rows in MASTER whose inception differs (2,070 of 2,072 agree; the other is the A6 "Mutual
  Funds" leftover). It sits on `Debt Oriented34`, so no bake refreshed it (C19).
- **Held in the C19 re-run (Run 3, PR #18, owner 21-Oct-2026):** refreshed alone, the record would
  get the Regular inception, r1m and since-inception (−12.77% over 44 days) but keep r3m 3.476% and
  r6m 2.4055% — the Direct plan's June figures from before the Regular plan existed, because a blank
  Monitor cell never overwrites a value. So it was restored to its live values after the bake and
  still carries the Direct plan's inception and June figures. Release it together with the C20
  decision. `rename_schemes.js` has nothing to rename here.

### C17. Risk-flag footnote overlaps a long Portfolio Matrix slide
**P3 · Closed 21-Oct-2026 (PR #21) · —**

- **Fixed:** when a selected fund is flagged, the slide estimates the table height (header, average
  row and one row per fund; a name wraps in the 3.0" column at about 0.5 em a character) and shrinks
  row height, fonts and cell margins by one factor `mk` (steps of 0.02, floor 0.6) until the table
  ends above the footnote at `NOTE_Y` 6.72. Without a flagged fund `mk` is 1 and the slide is byte
  for byte as before (checked: 25 funds unflagged and 10 funds flagged give the same `slide1.xml`
  as `main`). Measured in PowerPoint (rendered row heights, through COM), with a simulated
  `RISK_MATRIX[name].fl = 'split'`: 25 funds including the three longest names, `main` table
  bottom 7.87" (footnote overlapped by 1.15"), now 6.64" (`mk` 0.82, fonts 7.4 / 6.6 pt); 22 funds
  6.65"; 35 funds 6.51" (`mk` 0.62). The unflagged overflow is C22. The text below is the state
  before the fix.

The C3 footnote on the Portfolio Matrix slide is placed at y 6.72 (`site/index.html:5029`). With
about 22 or more selected funds the matrix table reaches that height and the footnote overlaps it
(QA, 19-Oct-2026; without a flagged fund the slide is unchanged). Suggested fix: move the footnote
below the table's computed height, or shrink the table font when a flagged fund is present.

### C18. Select popover ratios are never marked unreliable
**P3 · Closed 21-Oct-2026 (PR #22) · —**

- **Fixed:** for an MF fund the popover looks up `RISK_MATRIX[fund.name]`; when `H.riskFlagged` is
  true it adds the dagger after the fund name in the header and `H.RISK_FLAG_NOTE` (italic) under
  the ratio tiles. The ratios themselves still come from `CENTRICITY_SELECT`. Checked in the browser
  (21-Oct-2026): the one flagged Select fund in the data (ICICI Pru Nifty 100 Low Volatility 30 ETF)
  shows both; HDFC Large Cap Fund(G) with a simulated `fl = 'split'` shows both, and neither once
  the flag is removed; ICICI Pru Large Cap Fund(G), unflagged, shows neither. The text below is the
  state before the fix.

The Centricity Select popover shows Sharpe, Sortino, Beta, Std Dev and Alpha from the
`CENTRICITY_SELECT` entry (`CentricitySelectPopover`, `site/index.html:5383-5399`), not from
RISK_MATRIX, and it has no dagger: a fund flagged under C3 shows plain numbers there (QA,
19-Oct-2026). Suggested fix: look the fund up in RISK_MATRIX and add the same dagger and note when
`H.riskFlagged` is true.

### C19. 215 funds on four unmapped Monitor sheets carry pre-September performance
**P1 · Fixed: code 19-Oct-2026 (PR #17), data 21-Oct-2026 (PR #18) · Affects every MF cycle (read
the new bake lines)**

- **Fixed (data, PR #18, Sep-2026 Run 3, owner's approval 21-Oct-2026):** 214 of the 215 funds now
  carry 30-Sep-2026 figures (Debt ETF 94, International 51, Hybrid Other 44, Solution Oriented 25).
  Fields changed: aum / mtd / r1m / r3m / si 214 · r6m 208 · r1y 198 · r2y 168 · r3y 158 · r5y 80 ·
  r10y 52 · fund_mgr 129 (C15) · avg_maturity 87 · ytm 86 · mod_duration 78 · mcap_large / mid /
  small 21 · mcap_other 105 · inception 1 (DSP World Gold) · expense 1 (Quantum). The JioBlackRock
  G-Sec record (C16) was held at its live values for C20. Every other block, `DATA_DATES` and the five
  siblings are byte-identical; financial-data review: 3,758 field checks against the Monitor, 0
  mismatches. Record: `docs/update-log/2026-09_Sep-2026.md`, Run 3.
- **Fixed (code, PR #17; D80):** `parseMfMonitor` treats the four sheets as **refresh-only**
  (`REFRESH_ONLY_SHEETS`, `site/index.html:3225-3227`; row rule `:3397-3403`). A row there refreshes
  an existing MASTER record by exact name, with the same fields as a mapped sheet, and never creates
  a record or changes `asset_class`, `product_class`, `sub_category`, `name`, `prev_name` or the IRR
  bands. A name also on a mapped sheet keeps the mapped sheet's figures, whatever the sheet order
  (pre-pass `:3304-3329`); between refresh-only sheets the last row wins. Rows not in MASTER or on a
  mapped sheet come back in `skipped` with a reason. `Debt Oriented34` is read debt-style (`:3215`:
  YTM, maturity, duration; no m-cap split). The parser also returns `unclassified`, `emptySheets`,
  `sheetRows` and `monitorNames` (`:3464-3480`), and its message adds `· N rows not merged` and
  `· N rows on unrecognised sheets`. `bake_month.js` prints the not-merged list (`:152-158`), a WARN
  per missing or empty expected sheet (`:159-160`) and a CHECK of MASTER MF/ETF funds on no sheet
  (`:161-169`), and FAILs on any fund row on an unrecognised sheet, or on a page without this fix
  (`:212-220`). The Section-7 upload uses the same parser.
- **Verification of the code (19-Oct-2026; counts before the G-Sec hold):**
  - `npm test`: `tools/test/parser_refresh_only.test.js`, 18 synthetic checks; it fails on `main`'s
    parser.
  - Byte control on scratch copies, September chain (bake → `fill_variant_analytics` →
    `rekey_sif_analytics` → `merge_expense_exitload`): `main`'s chain reproduces the live site byte for
    byte, every block and sibling; the fixed chain changes exactly 215 MASTER records (same order,
    7,672 records), and every other block, `DATA_DATES` and all five siblings are identical.
  - Fields changed: aum / mtd / r1m / si 215 · r3m 214 · r6m 208 · r1y 198 (records carrying r1y
    6,339 → 6,348) · r2y 168 · r3y 158 · r5y 80 · r10y 52 · fund_mgr 130 (C15) · ytm 87 ·
    avg_maturity 87 · mod_duration 79 · mcap_large / mid / small 21 · mcap_other 105 · inception 2 ·
    expense 1 (after step 7).
  - The six Monitors dated 15-May to 30-Sep-2026 through the parser in a vm: only names on the four
    sheets change; 0 taxonomy or IRR changes; 0 unclassified rows; 0 empty expected sheets. Rows not
    merged per month: 7, 7, 8, 9, 15, 19.
  - Sep not-merged list (19): 13 not in MASTER (8 pending renames, 5 new launches) and 6 also listed
    on the mapped `Debt Oriented` sheet. Bake dry run: `GATE fund rows on unrecognised Monitor
    sheets: PASS (0)`, no WARN, CHECK 42 (report only). `verify_page.js` counts unchanged; browser
    load clean.
- **What (the code before the fix):** the Regular MF Monitor has four fund sheets that `SHEET_MAP`
  (`site/index.html:3162-3209`) does not list: `Debt Oriented34` (97 rows), `Solution
  Oriented,ETFs,FOFs` (87), `Solution Oriented - Childrens ` (12, trailing space) and `Hybrid` (50).
  `parseMfMonitor` skipped every row on them (`if (!map) continue;`, `main` `site/index.html:3350`),
  so `bake_month.js` never refreshed those funds.
- **Impact (measured 19-Oct-2026 against the 30-Sep-2026 Monitor, counts corrected by the
  financial-data review):** the 246 rows are 234 distinct names. 221 are in MASTER; 6 of those are also
  on the mapped `Debt Oriented` sheet and are refreshed there, so **215 funds are stale**: Debt ETF 95
  (target-maturity index funds), International 51, Hybrid Other 44, Solution Oriented 25. 214 carry
  the 30-Jun-2026 Monitor's values (one through its pre-rename Direct-plan row) and 1 July's (DSP
  World Gold). The page labels all performance "30th September 2026", so these funds show
  three-month-old returns under a current date in the app, the Excel and the deck. 13 names have no
  MASTER record. (The first count, 225 of 233, counted rows, not funds.) Control: on mapped sheets
  1,880 of 1,906 MASTER funds equal September's figure.
- **Blank cells keep old values** (non-null merge, `:3414-3415`; mapped debt sheets already do this:
  Sep-2026 kept 43 `mod_duration`, 13 `avg_maturity` and 1 `ytm`). After the re-run, 10
  `mod_duration` values (7 Edelweiss and 3 Tata Debt ETFs), 2 `avg_maturity` values (DSP SDL Plus
  G-Sec Jun 2028 and Sep 2027) and the C16 fund's r3m / r6m stay at pre-September values, and 7
  records show `mod_duration` above `avg_maturity` (e.g. Tata Nifty G-Sec Dec 2026: Avg M 0.14, Mod D
  0.44; across MASTER such records go from 17 to 24). They are not September figures. The owner kept
  them under the existing rule on 21-Oct-2026 (D81); the G-Sec fund's r3m / r6m are covered by its
  hold (C16, C20).
- **Debt ETFs absent from the Sep Monitor** (in the bake's CHECK, kept as they are): 7 matured by
  their name date (Jul / Sep 2026); 4 are absent though not matured: Baroda BNP Paribas NIFTY SDL
  Dec 2026, Axis NBFC-HFC Jun 2027, Axis Fin Svcs Sep 2027, Bandhan 10:90 Gilt+SDL Dec 2029. Ask the
  desk about the four.
- **Why June:** the figures stopped moving after the 30-Jun-2026 data; from July the bakes ran the
  page's own parser through `bake_month.js` [inference from the dates; the earlier Python route is in
  the outgoing owner's export — `docs/handover/DATA_EXTRACTION_PROMPT.md`].
- **Left to do:** read the bake's new lines every month (`docs/MONTHLY_UPDATE_PROCESS.md` B4); ask
  the desk about the four absent Debt ETFs; release the held G-Sec record with the C20 decision.

### C20. JioBlackRock Regular records show Direct-plan returns from before their launch
**P1 · Open (owner decision) · —** (on 21-Oct-2026 the owner published the C19 re-run without
waiting for this decision and held the G-Sec record instead)

- **What:** 12 JioBlackRock `-Reg(G)` records on mapped sheets were renamed from Direct-plan names in
  Aug-2026 (`prev_name` = the `(G)-Direct Plan` name). Their Regular plans launched in Aug-2026
  (inception 2026-08-17 for 11 of them, 2026-08-27 for Short Duration), but they still carry the
  Direct plan's r3m / r6m / r1y from before that launch, because a blank Monitor cell never overwrites
  a value (non-null merge, `site/index.html:3414-3415`). Live today, e.g. JioBlackRock Liquid
  Fund-Reg(G) r1y 6.458%, Overnight r1y 5.334%, Nifty Smallcap 250 r6m 13.969% (checked in the
  embedded MASTER, 19-Oct-2026).
- The bake also stores the Monitor's annualised since-inception return for funds about six weeks old
  (JioBlackRock Large Cap si −45.35%).
- The C16 G-Sec fund would join the same pattern once refreshed, so it is held at its earlier values
  (Run 3) until this is decided. The C19 blank-cell debt values raised a similar question; the owner
  kept them under the existing rule (D81).
- **Impact:** client-facing pages, the Excel and the deck quote a period return for a plan that did
  not exist for that period, which conflicts with `CLAUDE.md` rule 6 (no fabricated data).
- **Options for the owner:** clear every return period longer than the fund's life; or keep the
  values, labelled. Apply the decision to all 13 records in one reviewed change and release the held
  G-Sec record with it.

### C21. Taxonomy oddities on the Monitor's ETF and FoF sheets
**P3 · Open · —**

- `Mirae Asset Hang Seng TECH ETF` and `Nippon India ETF Hang Seng BeES` are filed in MASTER as Debt /
  ETF / Debt ETF. Both are listed on the mapped `Debt Oriented` sheet (and on `Solution
  Oriented,ETFs,FOFs`).
- The mapped `Debt Oriented` sheet is really an FoF / ETF sheet, but `SHEET_MAP` files it as Debt /
  ETF / Debt ETF (`site/index.html:3198`) and reads it debt-style (`:3211-3216`), so a new fund there
  is created as a Debt ETF unless its name matches the international pattern (`INTL_RE`, `:3336`,
  `:3409`).
- 27 Hybrid Other / Solution Oriented records on the refresh-only sheets carry `ytm`,
  `avg_maturity` and `mod_duration` (29 carry at least one) that no sheet refreshes, because those
  sheets are not read debt-style. The values only age.
- **Suggested fix:** reclassify the two ETFs and decide what to do with the 27 records' debt stats,
  with the owner, through a reviewed data change.

### C22. A long Portfolio Matrix slide without a flagged fund runs past its notes and the slide
**P3 · Open · —**

- The matrix table starts at y 1.0 with rows of 0.24" (taller when a name wraps). With no flagged
  fund, about 24 or more selected funds reach the notes at y 7.02 ("Portfolio Average …", "Risk
  data as on …"), and more run off the 7.5" slide: 25 funds including three long names end at
  7.87" when rendered in PowerPoint (21-Oct-2026). The C17 fix shrinks the table only when a fund is
  flagged, so this case is unchanged on purpose (parity). The Performance Sheet slide uses the same
  fixed 0.24" rows from y 1.0 [inference].
- **Suggested fix:** apply the C17 fit (`mk`) to every matrix slide with the notes' y as the limit,
  or continue a long table on a second slide; decide with the owner, since it changes slides that
  have no flag.

### C23. Select popover Alpha shown 100 times too large [inference]
**P2 · Open (desk: confirm the unit) · —**

- The popover formats `CENTRICITY_SELECT[].alpha` with `fmtPctRaw` (value × 100, then `%`). The
  stored values look like percentages already: 37 entries range from -0.447 to 1.2644, so the
  popover shows ICICI Pru Large Cap Fund(G) at 25.18% (stored 0.2518), Nippon India Large Cap
  Fund(G) at 37.40% and one fund at 126.44%. For the same funds RISK_MATRIX's Jensen alpha (`al`,
  percent) is 1.47 and 1.05. Sharpe and Beta in the two stores agree in scale (0.30 vs 0.41; 0.92 vs
  0.90). Seen 21-Oct-2026 while fixing C18.
- Alpha is used only in this popover (internal UI); no export reads it. No tool writes it: the
  Reckoner merge keeps a retained fund's risk ratios (`tools/merge_reckoner.js`).
- **Suggested fix:** confirm with the desk what unit and period the source alpha has (percent, and
  monthly or annual), then either show it as stored with `%` or convert it once in the data; never
  auto-detect the scale (CLAUDE.md rule 4).

### C24. Headline weighted IRR counts instruments with no IRR band as 0%
**P2 · Open (owner decision) · —**

- **What:** `computeKPIs` (`site/index.html:1609-1626`) weights every selected instrument by its IRR
  band, using `(irr_low || 0)` and `(irr_high || 0)`, and divides by the total allocation. An
  instrument with no band (Direct Equity, for example) therefore counts as 0% and pulls the result
  down. The Section 4 table's GRAND TOTAL leaves such instruments out. Found by the live acceptance
  check on 21-Oct-2026: with a Direct Equity stock in a 7-instrument proposal, the Section 1 tile and
  the Live Output GRAND TOTAL showed 9.51–11.13% while Section 4 showed 10.57–12.37%.
- **Impact:** client-facing. The tile feeds Future Value and the PowerPoint's "Expected Pre-Tax
  Return". The code is the same at `handover-baseline`, so this is inherited, not a regression.
- **Decision needed (owner):** exclude instruments without a band from the weighting (and say so on
  the slide), or give them an expected return. Then make every table use the same rule.

### C25. Debt Analytics fund picker and its hint disagree
**P3 · Open · —**

In the live acceptance check (21-Oct-2026) the Debt Analytics picker showed "2 of 2 included" with
HDFC Income Plus Arbitrage FoF ticked, while the hint below it said that fund is not included (no
holdings); BHARAT Bond FoF Apr-2030 was missing from the picker. Analytics view only; not exported
as such. Investigate the picker's inclusion rule against `H.hasDbHoldings`.

### C26. Centricity Select popover gaps
**P3 · Open (desk / data) · —**

From the same check: the popover for HDFC Income Plus Arbitrage Active FoF (a Select fund) shows "—"
for every ratio and the rationale (its `CENTRICITY_SELECT` entry has none); the Abakkus All Cap PMS
popover (1Y 13.33%, 3Y 18.33%, AUM about 7,541 Cr) disagrees with its fund row (8.42%, 12.68%,
7,768.91 Cr) because the two come from sources of different dates (B1, B2). Both refresh with the next
Reckoner deck and PMS file; fill the rationale gap with the desk.

### C27. BHARAT Bond FoF Apr-2030: Direct figures equal Regular
**P3 · Open (desk) · —**

`DIRECT_PERF` holds the same returns and the same 0.04% expense for the Direct plan as MASTER has for
the Regular plan (live check, 21-Oct-2026). Possibly true for this fund; ask the desk to confirm.

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
**P2 · Accepted (D60); `noindex` meta added 19-Oct-2026 (PR #12, D77) · —**

- **19-Oct-2026 (PR #12, D77):** `site/index.html:3` now carries
  `<meta name="robots" content="noindex, nofollow">`, which asks crawlers not to index the page. The
  site and repository stay public (D60); the text below is the state before that change.

- Everything in `site/` is public at the Pages URL, including the whole fund universe and the unused
  `Centricity_Risk_Matrix.js`. The repository itself is public on GitHub.
- `site/robots.txt` is served under the project path, but crawlers read `robots.txt` only at the host
  root. On the old site (16-Oct-2026) the host-root `/robots.txt` returned 404 and the project-path
  copy 200. `site/index.html:1-3` has no `<meta name="robots">`. The archived README's claim that the
  URL stays "effectively private" is false.
- Option for later (changes page bytes): add `<meta name="robots" content="noindex">`, or move to
  hosting with access control.

### R3. CDN scripts load without integrity (SRI)
**P2 · Closed 19-Oct-2026 (PR #12, D77) · —**

- **Fixed:** all five CDN tags carry `integrity="sha384-…"` and `crossorigin="anonymous"`; each hash
  was computed from the served file and all five CDNs allow cross-origin loading. Chart.js now loads
  `dist/chart.umd.js` (same 4.4.0): jsDelivr's `chart.umd.min.js` is generated on the fly and says
  not to use SRI with it. Versions are unchanged. The text below is the state before the fix.

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
**P3 · Closed 19-Oct-2026 (PR #12, D78) · —**

- **Fixed:** the file moved, unchanged, to `docs/archive/Centricity_Risk_Matrix_2026-06-30.js`, so it
  is no longer published (the live URL returned 404 on 19-Oct-2026). The page never loaded it, so the
  six-file deploy set is unchanged. `fold_duplicate_names.js` skips its check when the file is not
  beside `index.html`, `build_risk_matrix.py` refuses to write into `site/`, and the comment that said
  the tab reads it is gone. D78 supersedes D69. The text below is the state before the fix.

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
  `.git`, `node_modules/` and the 12.8 MB `index.html` sync continuously. Tool writes are atomic since 19-Oct-2026 (A8), but a sync can still
  block a rename or leave a conflict copy.
- Risks: sync-conflict copies or a half-synced file during a tool run; Files-On-Demand placeholders;
  a bash-side view of large files that lags the real file (`docs/OPERATING_MANUAL.md` → Traps,
  "OneDrive / bash-mount staleness"); damage to `.git` if OneDrive restores an older version of its
  files [inference].
- **Seen 19-Oct-2026:** in the Sep-2026 corrections run (PR #13), the first
  `merge_risk_matrix.js --apply` failed after its gates with `EPERM` on the rename of its temp file,
  because OneDrive was syncing `index.html`. The atomic write (A8) left the page untouched and the
  retry wrote (`docs/update-log/2026-09_Sep-2026.md`, Run 2).
- **Mitigated 21-Oct-2026 (PR #20):** `writeFileAtomic` retries a rename that fails with `EPERM`,
  `EBUSY` or `EACCES` six times, after 100, 200, 400, 800, 1,600 and 3,200 ms (6.3 s in all), printing
  one `(rename of … blocked …)` line per retry, and removes its temp file on any failure. Checked
  with a real lock: a process holding `index.html` open without sharing for 1.5 s gives `EPERM`;
  the write succeeds after four retries (`main` before the change threw after 18 ms). A sync that
  holds the file longer still fails the write, leaving the target untouched. The folder itself stays
  in OneDrive (owner decision below).
- **Workaround:** Set the folder to "Always keep on this device"; pause OneDrive sync during tool runs
  and git operations; verify with Node on the real Windows path. If a write still fails with `EPERM`
  after its retries, check the file is unchanged and re-run the step. GitHub (`origin`) is the real backup.
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
§14 item 8 (C8) and item 12 (C12). Since 19-Oct-2026 the PRD's tool facts have also moved on (exit
codes, `--as-on` required for the SIF tool, the new override flags, `tools/data/pins.json`, the
archived risk-matrix file); the header note lists the corrections and the §13 CLI table and §11.4
pin advice were updated in place. `tools/README.md` is the current CLI reference.

### E3. Runbooks and specs are out of date
**P2 · Open · Affects anyone who follows them**

- `docs/runbooks/Risk_Matrix_Update_Prompt.md`: describes only the Python route and omits
  `merge_risk_matrix.js`, which was used in Aug and Sep. Its command uses bare relative paths (`:15`)
  and its counts and dates are old. Since 19-Oct-2026 its command (`:20`, output
  `Centricity_Risk_Matrix.js` beside the page) is refused: `build_risk_matrix.py` writes only a `.js`
  outside `site/` (exit 2 otherwise), and the old output is archived (R5). Run it as
  `python -I tools/build_risk_matrix.py …` (`tools/README.md` §5).
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
**P3 · Closed 19-Oct-2026 (PR #12) · —**

- **Fixed:** the comments now point to `DATA_DATES` instead of naming dates and counts, the risk-matrix
  comment no longer says the tab reads `Centricity_Risk_Matrix.js`, and the SIF sibling's header
  gives the current `node tools/merge_sif_monitor.js … --as-on "<date>" --apply` command. The code
  fallback `"30 Jun 2026"` is code, not a comment, and stays. The text below is the state before the
  fix.

`site/index.html:1235` and `:1442` say "15-Jun-2026". `:2928-2931` say PMS data is "as on 30th June
2026", with 314 schemes (it is 692, as on 31-Aug), and AIF data "as on 31st May 2026". `:5087-5090`
say the risk matrix is "as on 30 Jun 2026" and generated by `build_risk_matrix.py`, while `:5093`
sets `'30 Sep 2026'` (written by `merge_risk_matrix.js`). `:7184` says the tab reads
`Centricity_Risk_Matrix.js`. `site/Centricity_SIF_Refresh.js:3-4` name the June list and the Aug
monitor, `:13` says 29 rows and `:39` says 28 names, while there are 30 rows and the data is
30-Sep (`:61`). Fixing these changes deploy bytes, so do it in a deliberate code change, not a data
refresh.

### E5. Tool comments that contradict the code
**P3 · Closed 19-Oct-2026 (PRs #7–#11) · —**

- **Fixed:** every comment listed below was corrected with its tool, and the `merge_risk_matrix.js`
  header now names the Node route as production (D43) and the Python route as not validated. The
  text below is the state before the fix.

`tools/fill_variant_analytics.js:6-7` ("nothing … overwritten"; see A17); `merge_de_universe.js:1`
("industry"; A14); `rename_schemes.js:211-212` (A5); `merge_expense_exitload.js:94` (">4%" versus
8%) and `:136`; `pin_pms_alias.js:1` ("August Reckoner and the July PMS file");
`split_sif_add_mld.js:13`, `:75` (28 versus 30);
`fold_duplicate_names.js:211-214` (historical since the fold); `rekey_sif_analytics.js:97` (a "GATE"
that only prints).

---

## F. Cosmetic

### F1. Usage text shows pre-move commands
**P3 · Closed 19-Oct-2026 (PRs #7–#12) · —**

- **Fixed:** every tool's usage string and header example reads `node tools/<tool>.js …` (with
  `--html site/index.html` where required), or `python -I tools/build_risk_matrix.py …`; the SIF
  sibling's comment was fixed in PR #12. The text below is the state before the fix.

Every tool's usage string and header example still reads `node <tool>.js …` (except
`merge_bond_list.js` and `merge_reckoner.js`, rewritten with A1 and A4), for example
`tools/rename_schemes.js:13`, `:28`, `bake_month.js:20` and `merge_sif_monitor.js:9`, `:26`.
`merge_pms_performance.js:18` even names `pms_final.js`, and `site/Centricity_SIF_Refresh.js:17` shows
`node merge_sif_monitor.js`. The correct forms are `node tools/<tool>.js …`, with
`--html site/index.html` for the three tools that require it (`merge_pms_performance.js`,
`pin_pms_alias.js`, `merge_reckoner.js`).

### F2. Unused code in tools
**P3 · Partly fixed 19-Oct-2026 (PRs #8, #10, #11, #15) · —**

- **Fixed:** the unused requires in `merge_pms_performance.js`, `merge_aif_performance.js`,
  `merge_reckoner.js` (PR #15) and `fold_index_funds.js` (now uses `fs`), the `MISSING` regex, the
  hard-coded WROTE log, the `Math.min/max(...)` spreads in the DE returns and expense tools, and the
  bond tool's `Infinity` on an empty list. `--pms` is accepted and reported as deprecated (A20).
  **Still open:** the tenor column read but unused (`tools/merge_bond_list.js:114`), and `clen` in
  `tools/lib/pptx.js:9`. The text below is the state before the fix.

Unused requires: `path` in `merge_pms_performance.js:9`, and `fs` in `merge_reckoner.js:21`,
`merge_aif_performance.js:13` and `fold_index_funds.js:11`. Also: the dead `MISSING` regex
(`merge_expense_exitload.js:31`); the dead `--pms` flag (`add_reckoner_funds.js:20`); a hard-coded
"WROTE index.html" log whatever `--html` says (`merge_direct_equity_returns.js:188`);
`Math.min/max(...)` over about 30k values (`merge_direct_equity_returns.js:175`, which fails above
roughly 100k); a tenor column read but unused, and `Infinity` printed on an empty list
(`merge_bond_list.js:112`, `:247`); an ambiguous `clen` that holds the file-comment length, not a compressed length
(`tools/lib/pptx.js:9`).

### F3. Browser request for `favicon.ico` returns 404
**P3 · Partly fixed 19-Oct-2026 (PR #12, D77) · —**

- **Fixed:** `site/index.html:3` has `<link rel="icon" href="data:,">` and the page console is clean.
  **Not proven:** in review the in-app browser still requested `/favicon.ico` on 5 of 10 loads (its
  own tab-icon fetch). A 1×1 PNG data URI would probably stop it. The text below is the state before
  the fix.

`site/index.html` has no `<link rel="icon">`, so browsers request `/favicon.ico`. On the old site
(16-Oct-2026) both the project-path and the host-root requests returned 404. The only effect is a
console 404. Adding an icon changes page bytes.

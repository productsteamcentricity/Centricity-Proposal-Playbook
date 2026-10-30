# Known issues

This is the single register of confirmed defects, risks and gaps that the owner (Centricity Products
team, GitHub account `productsteamcentricity`) inherited at handover on 16-Oct-2026. **Apart from C2
(the stale README, replaced by the transfer's docs), none of them was fixed during the transfer.** Fix
each one as its own task on a `fix/…` branch (D68), never inside a data refresh. The tool, page and
data fixes of 16–19-Oct-2026 (PRs #3–#15) and the small fixes of 21-Oct-2026 (PRs #19–#23)
closed or narrowed most A, C, R, E and F items; each item's
status and section say which PR and what is left. A29–A31, C41–C45, R9–R11 and E6–E16 were found on
28-Oct-2026 during the MOD-01 handover reconstruction (fact sheets checked against the code at
`2b2a397`, re-checked 30-Oct-2026); the same pass corrected several older entries, each change marked
"corrected 28-Oct-2026".

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
   (B2), analytics workbooks that include SIFs (B4), Fund Manager Data (B5, C15) and PMS & AIF
   Analytics (B6); and why four unmatured Debt ETFs are absent from the Sep-2026 Monitor (C19).
2. **Owner decision before the next MF cycle's rename `--apply`:** with dates now read correctly
   (A6), `rename_schemes.js` finds 8 renames in the Sep-2026 (and Aug-2026) Monitor that it used to
   miss: HDFC Retirement Savings Fund-Hybrid-Debt Plan → HDFC Retirement Fund-Hybrid-Debt Plan; four
   Kotak overseas FoFs, Omni → Active; two Axis FoFs, Active → Omni; and Motilal Oswal Asset
   Allocation Passive FoF-Aggressive → Motilal Oswal Multi Asset Passive FoF. All 8 match on the exact
   inception date. The Motilal one looks suspicious (MASTER files it as Equity ETF, the Monitor lists
   it on its Hybrid sheet, and the name changes more than a rename usually does): confirm it with the
   owner. The handover export found no AMC notice. Its new name first appears on the 30-Jun Monitor,
   and the record has carried the 15-Jun-2026 figures since then, longer than the other seven. Its
   Conservative sister plan, with the same inception, kept its name. None is applied yet. The new names sit on two of the four refresh-only Monitor sheets
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
   about 6 s (PR #20), but a multi-file write is not one transaction. Never `git checkout` or
   `git switch` in this folder while `.git` files are cloud-only (R6); the skill's `git switch` steps
   are stale (E7): create the branch with `git branch <new> origin/main` and work in a worktree
   (CLAUDE.md, "Project control"). (Added 28-Oct-2026.)
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
10. **From the outgoing owner's handover export (ingested 25-Oct-2026,
    `docs/update-log/2026-10-23_handover-export.md`):**
    - Owner decisions:
      - the PMS label (B1: 31-Jul data under "31st August 2026");
      - who builds NAV Data and Fund Risk Ratios from October (B8; this blocks the Oct-2026 Portfolio Matrix);
      - the held April monitor (B9);
      - the client items found in the export (R8, with compliance);
      - the Sortino definition (C35);
      - the bond 3Y/5Y rule (C37);
      - the segregated side-pocket records (C39).
    - Desk requests: a current Exit Load & Expected IRR file (C24: 99 records have no band); the
      Reckoner label for the Motilal GIFT City fund (C5); the AMCs of Prism and of the Magnum Equity
      Ex-Top 100 SIF (C6, C38); the unit and period of the Select alpha (C23); and the Rf house rate
      (C11).
11. **From the MOD-01 handover reconstruction (28-Oct-2026):**
    - after the MF bake, scan `si` for outliers: the bake has no bound, and one ETF shows 297,765%
      (C43, P1; decide with C20);
    - check by hand the two invariants that `verify_page.js` and CI do not enforce: the top-10 Direct
      Equity by market cap are "Large Cap", and `DATA_DATES.sif` is not "—" (A31);
    - after any change to a sibling, load the page and check the console for "override failed": a
      failing sibling does not fail `verify_page.js` or CI (A30);
    - do not ask the desk for Fund Risk Ratios (#12) or NAV Data (#17), whatever `docs/HANDOVER.md`
      and the inbox README say (E8, B8);
    - the AIF step's benchmark refresh reaches no page: PMS/AIF benchmark rows stay static until the
      owner decides their source (C41).

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
| A28 | `tools/lib/pptx.js` fails on some decks (data-descriptor entries; a truncated zip reads as 0 slides) | `tools/lib` | P3 | Open | — | `tools/lib/pptx.js:19-26` |
| A29 | Two PMS/AIF holdings parsers (the page's Section 7 upload and the look-through tool); whether they agree is unknown | Tools: PMS/AIF | P2 | Open (needs investigation) | — | `REFRESH.parsePMSHoldings`, `site/index.html:3824`; `tools/merge_pms_aif_analytics.js:95-140` |
| A30 | A sibling that fails is invisible to `verify_page.js` and CI (try/catch with `console.error` only) | Verification | P2 | Open | **Affects** (check the console when a sibling changes) | sibling `try`/`catch`; `tools/verify_page.js:28-32`, `:90-96` |
| A31 | Two CLAUDE.md invariants (top-10 Direct Equity "Large Cap"; `DATA_DATES.sif` not "—") are not enforced by `verify_page.js` or CI | Verification | P2 | Open | **Affects** (check both by hand) | `tools/verify_page.js:90-96`; `.github/workflows/pages.yml:47-61` |
| B1 | No PMS performance file transferred; PMS is 31-Jul-2026 data under a 31-Aug-2026 label | Inputs | P2 | Open (desk) | **Blocks** PMS step | `site/index.html:1451` |
| B2 | Live Sep-2026 Reckoner deck not in the pack | Inputs | P2 | Partly fixed 25-Oct-2026 (handover export: archive copy filed); Oct-2026 deck open (desk) | **Blocks** Reckoner and AIF steps | `monthly-updates/2026-08_Aug-2026/` |
| B3 | Sep market deck in the pack is the superseded first issue | Inputs | P2 | Closed 25-Oct-2026 (handover export: final issue filed) | — | `monthly-updates/2026-09_Sep-2026/` |
| B4 | Sep analytics workbooks carry no SIF holdings | Inputs | P2 | Open (desk) | **Affects** | `monthly-updates/2026-09_Sep-2026/Analytics/` |
| B5 | Fund-manager data stops at 31-Aug-2026 | Inputs | P2 | Open (desk) | **Affects** | `monthly-updates/2026-08_Aug-2026/` |
| B6 | PMS/AIF look-through stops at 31-Jul-2026 | Inputs | P2 | Open (desk) | **Affects** | `monthly-updates/2026-07_Jul-2026/Analytics/` |
| B7 | Periodic inputs missing from the pack | Inputs | P3 | Partly fixed 25-Oct-2026 (handover export: 06-Aug Bond List filed); rest open (desk) | — | `monthly-updates/` |
| B8 | NAV Data (#17) and Fund Risk Ratios (#12) were made in-house; nobody builds them now | Inputs | P1 | Open (owner decision) | **Blocks** the Oct-2026 Portfolio Matrix | `docs/INPUT_FILES.md` #12, #17; export `_nav_risk_toolchain/` |
| B9 | April folder holds a mid-May monitor; a true 30-Apr monitor is held | Inputs | P3 | Open (owner decision) | — | `monthly-updates/2026-04_Apr-2026/` |
| C1 | Siblings 3–5 not folded into the page (six-file deploy) | Architecture | P2 | Open | — | `site/index.html:5525-5527` (was `:5083-5085`; corrected 28-Oct-2026) |
| C2 | README stale | Docs | — | Closed 16-Oct-2026 | — | `docs/archive/README_original_2026-05.md` |
| C3 | Risk stats flagged unreliable by the source are shown as normal | UI/data | P1 | Closed 19-Oct-2026 (PRs #9, #12, #13) | — | `tools/merge_risk_matrix.js:129-136`; `H.riskFlagged` |
| C4 | Mosaic Multiyield Series I keeps a Select badge | Data | P2 | Open (desk) | **Affects** | `CENTRICITY_SELECT` |
| C5 | Motilal Oswal Gift City India Equity Fund – Inbound: very likely our existing record under a new deck label | Data | P2 | Open (desk to confirm, then a pin) | **Affects** | `tools/data/pins.json`; `CENTRICITY_SELECT` |
| C6 | Prism Hybrid Long-Short Fund has no AMC prefix | Data | P3 | Open | — | `site/Centricity_SIF_Refresh.js` |
| C7 | 360 ONE Balanced Hybrid Fund not in MASTER | Data | P3 | Open (upstream) | — | — |
| C8 | Five SIFs have no look-through (PRD list corrected) | Data | P2 | Open (desk) | **Affects** | analytics stores |
| C9 | Debt rating chart covered only the top 20 holdings | UI | — | Closed 14-Oct-2026 (`862e40b`) | — | — |
| C10 | `RISK_MATRIX` has no `c`; `RISK_MATRIX_BENCH_SD` stale | Data | P3 | Open | — | `site/index.html:5533-5536` (was `:5091-5094`; corrected 28-Oct-2026) |
| C11 | Rf = 4.5% to re-confirm with the desk; it drives the live risk matrix | Data | P2 | Open (desk) | — | export `_nav_risk_toolchain/navwork/Metrics.cs:27`; `tools/build_risk_matrix.py:28` |
| C12 | Dead code kept for parity (`parseAnalytics` is not dead) | Code | P3 | Accepted | — | `site/index.html:7145-7146`, `:7246-7294` (was `:6700`, `:6796-6807`; corrected 28-Oct-2026) |
| C13 | Cosmetic UI inconsistencies kept for parity | UI | P3 | Closed 19-Oct-2026 (PR #12), frozen-pane classes kept | — | `site/index.html` Master Editor heading; tab `num` 6.1–6.9 |
| C14 | Shared links drop funds renamed since the link was made | UI | P2 | Closed 19-Oct-2026 (PR #12) | — | `hashPick` in `site/index.html` |
| C15 | Fund-manager roster overwritten by the Sep bake | Data | P2 | Open (desk) | **Affects** | MASTER `fund_mgr`; `tools/merge_fund_managers.js` |
| C16 | JioBlackRock Nifty 8-13 yr G-Sec Index Fund: the Regular record carries the Direct plan's inception | Data | P3 | Open (decided with C20) | — | MASTER `inception`, `prev_name`; Sep-2026 Monitor |
| C17 | Risk-flag footnote overlaps a long Portfolio Matrix slide | UI | P3 | Closed 21-Oct-2026 (PR #21) | — | `planTable` / `footerBlock` in `buildDeck`, `site/index.html` (corrected 28-Oct-2026: `NOTE_Y` and `mk` were removed by PR #26) |
| C18 | Select popover ratios are never marked unreliable | UI | P3 | Closed 21-Oct-2026 (PR #22) | — | `CentricitySelectPopover`, `site/index.html` |
| C19 | 215 funds on four unmapped Monitor sheets carry pre-September performance | Data | P1 | Fixed: code 19-Oct-2026 (PR #17), data 21-Oct-2026 (PR #18, 214 funds; 1 held for C20) | **Affects** (read the new bake lines) | `REFRESH_ONLY_SHEETS`, `site/index.html:3248-3250`, `:3420-3426`; `tools/bake_month.js:152-169`, `:212-220` |
| C20 | JioBlackRock Regular records show Direct-plan returns from before their launch | Data | P1 | Open (owner decision); G-Sec record held | — | MASTER returns; non-null merge `site/index.html:3437-3438` |
| C21 | Taxonomy oddities on the Monitor's ETF and FoF sheets | Data | P3 | Open | — | `SHEET_MAP['Debt Oriented']`, `site/index.html:3198`; MASTER |
| C22 | A long Portfolio Matrix slide without a flagged fund runs past its notes and the slide | UI | P3 | Closed 22-Oct-2026 (PR #26, D82) | — | `planTable` in `buildDeck`, `site/index.html` |
| C23 | Select popover Alpha shown 100 times too large (source-confirmed) | UI/data | P2 | Open (desk: confirm the period) | — | `fmtPctRaw(info.alpha)` in `CentricitySelectPopover`; `CENTRICITY_SELECT[].alpha` |
| C24 | Headline weighted IRR counts instruments with no IRR band as 0% (Direct Equity and 99 MF/ETF/SIF records) | UI/data | P2 | Open (owner decision; desk: a current IRR file) | — | `computeKPIs`, `site/index.html:1609-1626`; `ProposalTab` `:7435` (corrected 28-Oct-2026) |
| C25 | Debt Analytics fund picker and its hint disagree | UI | P3 | Open | — | Debt Analytics picker |
| C26 | Centricity Select popover gaps (empty HDFC FoF entry; PMS popover dates differ) | Data | P3 | Open (desk) | — | `CENTRICITY_SELECT` |
| C27 | BHARAT Bond FoF Apr-2030: Direct figures equal Regular | Data | P3 | Open (desk) | — | `DIRECT_PERF` |
| C28 | Expected returns are stored as track record (bond yields, AIF/PMS band mid-points) | Data | P2 | Open (owner/desk); marked `*` in the deck since 22-Oct-2026 (PR #26, D83) | — | MASTER r1y/r3y/r5y; `tools/merge_bond_list.js:198`; `tools/add_reckoner_funds.js:197`; `H.isExpectedReturn` |
| C29 | Performance buckets are defined three times and disagree on Debt PMS | Code | P3 | Open | — | `bucketOf` (screen), `bof` (Excel), `buildDeck` (PowerPoint) in `site/index.html` |
| C30 | The screen's Performance tab dates PMS/AIF figures with the MF date | UI | P3 | Open | — | `PerformanceTab` `asOn`, `site/index.html` |
| C31 | AMC name falls back to the scheme name's first word for 354 MF/ETF records | Data | P3 | Open | — | `window.getAMC`, `site/index.html:1427` |
| C32 | Debt look-through: an issuer's bucket is set by the first instrument seen; an unrated bond would default to "AAA & Equiv" | UI/data | P3 | Open | — | `H.aggDebtScoped`, `site/index.html` |
| C33 | Commodity ETFs carry a market-cap split of about 100% "Others" | Data | P3 | Open (desk) | — | MASTER `mcap_other` |
| C34 | Disclaimer slide image: text block in the top half, header line in another colour | UI | P3 | Open (desk: source slide, B7) | — | `EXTRA_SLIDES.disclaimer`; `tools/update_closing_slides.js` |
| C35 | Sortino has two definitions: June workbook semi-deviation, Aug/Sep textbook (never approved) | Data | P2 | Open (owner/desk) | **Affects** the next risk build | export `Metrics.cs:168-174`; `tools/build_risk_matrix.py:117-118` |
| C36 | Select popover ratios are May-2026 values and carry no date | UI/data | P3 | Open (owner) | — | `CENTRICITY_SELECT[].sharpe/sortino/beta/sd/alpha` |
| C37 | Bonds store the top of the IRR band as 1Y/3Y/5Y; the owner asked for the band average (20-May) | Data | P2 | Open (owner decision) | — | `tools/merge_bond_list.js:198`; MASTER OneDigital bonds |
| C38 | The "SBI" AMC of the Magnum Equity Ex-Top 100 SIF was inferred, not sourced | Data | P3 | Open (desk) | — | `site/Centricity_SIF_Refresh.js` |
| C39 | Four segregated side-pocket records are live and pickable; two UTI rows pass the parser's skip | Data | P3 | Open (owner) | — | MASTER; `site/index.html:3347`, `:3415` segregated skip (two places; corrected 28-Oct-2026) |
| C40 | `rename_schemes.js` "new to MASTER" counts rows the bake never adds | Tools | P3 | Open | — | `tools/rename_schemes.js` (count line) |
| C41 | PMS/AIF benchmark rows (screen, Excel, deck) show static values held since 20-May-2026; the monthly `PMS_PERFORMANCE.benchmarks` is never read | UI/data | P2 | Open (owner decision: source and refresh) | **Affects** (the AIF step's benchmark refresh reaches no page) | `window.PMS_BENCHMARK_PERF`, `site/index.html:3057`; `pmsBenchmarkPerfFor` `:3069`; readers `:4099`, `:5200`, `:7934` |
| C42 | 12 RISK_MATRIX keys name rows the SIF sibling removes at load; no effective SIF has a risk row | Data | P2 | Open | **Affects** the next risk build (B8) | `tools/merge_risk_matrix.js:141-143`; `site/Centricity_SIF_Refresh.js:27-54` |
| C43 | `UTI BSE India Sector Leaders ETF` shows a since-inception return of 297,765% (`si` 2977.646); the MF bake has no `si` bound | Data | P1 | Open (owner decision, with C20) | **Affects** (scan `si` after the bake) | MASTER `si`; `tools/bake_month.js:194-228`; readers `site/index.html:4063-4072`, `:5151-5154`, `:7844` |
| C44 | Construct and Net Asset Allocation slides draw their tables with `slide.addTable` at fixed positions, not `drawTable` | UI | P3 | Open | — | `buildDeck`, `site/index.html:4720-4773`, `:4784-4825` |
| C45 | Analytics `listTable` tables (Top Underlying Holdings, Top Issuers) draw only their first page | UI | P2 | Open (latent) | — | `buildDeck`, `site/index.html:5055-5057`, `:5102-5104` |
| R1 | Client PII still public in the outgoing owner's repo and site | Security | P1 | Open (outgoing owner) | — | upstream `Portfolio_Review_Build_Prompt.md` |
| R2 | Public repo and site; `robots.txt` ineffective | Security | P2 | Accepted (D60); `noindex` meta added 19-Oct-2026 (PR #12, D77) | — | `site/robots.txt`; `site/index.html:3` |
| R3 | CDN scripts load without integrity (SRI) | Security | P2 | Closed 19-Oct-2026 (PR #12, D77) | — | `site/index.html:1224-1228` |
| R4 | `xlsx` 0.18.5 has two high-severity advisories | Security | P2 | Accepted | — | `package.json`; `site/index.html:1227` |
| R5 | Stale `Centricity_Risk_Matrix.js` is published | Hosting | P3 | Closed 19-Oct-2026 (PR #12, D78) | — | `docs/archive/Centricity_Risk_Matrix_2026-06-30.js` |
| R6 | The git repository lives inside OneDrive | Repo | P2 | Open (owner decision); blocked rename retried since 21-Oct-2026 (PR #20) | **Affects** | repo root |
| R7 | Old site still live alongside the new one | Hosting | P2 | Open (owner: retire only after full testing of the new build; then outgoing owner; corrected 28-Oct-2026) | — | old Pages site |
| R8 | The handover export shipped two client items despite its README | Security | P1 | Open (owner + compliance) | — | `handover-archive/export_20261023/extracted/` (local, git-ignored) |
| R9 | `main` has no branch protection and no rulesets; "merge only after verify" is a convention | Repo | P2 | Open (owner decision) | — | GitHub settings (`gh api .../branches/main`: `protected` false) |
| R10 | A likely copy of the client reference deck sits in `%TEMP%\x\ref.pptx`, outside the repo | Security | P2 | Open (owner decision) | — | `%USERPROFILE%\AppData\Local\Temp\x\ref.pptx` (local only) |
| R11 | Single local copies with unknown cloud backup (B8 toolchain, deck evidence, `monthly-updates/`, `backups/`) | Repo | P2 | Open (owner) | — | `handover-archive/`, `_testdata/`, `%TEMP%\x\`, `monthly-updates/`, `backups/` |
| E1 | Operating manual keeps stale statements as history | Docs | P3 | Accepted | — | `docs/OPERATING_MANUAL.md` → Errata |
| E2 | PRD contains wrong tool and hosting facts | Docs | P3 | Open | — | `docs/PRD.md` §2, §5, §11, §13, §14 |
| E3 | Runbooks and specs are out of date | Docs | P2 | Open | **Affects** (if followed) | `docs/runbooks/`, `docs/specs/` |
| E4 | Stale comments inside the deploy files | Docs/code | P3 | Closed 19-Oct-2026 (PR #12) | — | — |
| E5 | Tool comments that contradict the code | Docs/code | P3 | Closed 19-Oct-2026 (PRs #7–#11) | — | — |
| E6 | Docs call the siblings "idempotent-guarded" by `__…_APPLIED` flags that nothing reads | Docs | P3 | Open | — | `docs/ARCHITECTURE.md:48`; `docs/OPERATING_MANUAL.md:72`; `docs/PRD.md:221` |
| E7 | The monthly skill and process doc still say `git switch` (R6 hazard) | Docs | P2 | Open | **Affects** (do not follow the `git switch` steps) | `.claude/skills/monthly-update/SKILL.md:20`, `:31`; `docs/MONTHLY_UPDATE_PROCESS.md:145`, `:171` |
| E8 | `docs/HANDOVER.md` (risk ratios) and the inbox README (Fund Risk Ratios, NAV Data) still list in-house files as files to send (B8) | Docs | P2 | Open | **Affects** (do not ask the desk for #12/#17) | `docs/HANDOVER.md` §5; `monthly-updates/00_INBOX/README.md:58`, `:60` |
| E9 | The skill says Reckoner-cycle tools exit 1 on a missing file; every tool exits 2 | Docs | P3 | Open | — | `.claude/skills/monthly-update/SKILL.md:39-40` |
| E10 | OneDrive guidance assumes "Always keep on this device" with OneDrive running, and omits the checkout hazard | Docs | P3 | Open | — | `docs/DEVELOPMENT_SETUP.md:46`; `docs/MONTHLY_UPDATE_PROCESS.md:28`; `docs/HANDOVER.md` §8 |
| E11 | `docs/TESTING.md` names the rehearsal worktree `C:/t/cpp-old`; the real leftover is in `%TEMP%` | Docs | P3 | Open | — | `docs/TESTING.md:100-110` |
| E12 | Release docs prescribe `gh pr merge --delete-branch`; no merge since PR #7 used it | Docs | P3 | Open (owner decision) | — | `.claude/agents/release-manager.md:24`; `SKILL.md:69`; `docs/MONTHLY_UPDATE_PROCESS.md:246` |
| E13 | Stale records in `docs/PROJECT_STATE.md` (PR #23 merge, latest merge, verification date, C24 and C28 wording) | Docs | P3 | Open | — | `docs/PROJECT_STATE.md` at `2b2a397`: `:48`, `:119`, `:170`, `:240-246` |
| E14 | `docs/DEPLOYMENT.md`: live check hashes 6 of the 7 published files; diagram omits the unit tests; retirement condition missing | Docs | P3 | Open | — | `docs/DEPLOYMENT.md:10`, `:14-24`, `:44-49` |
| E15 | `docs/ARCHITECTURE.md`: stale line references; the bake's capture of load-time mutations is not described | Docs | P3 | Open | — | `docs/ARCHITECTURE.md:31-32`, `:44-49` |
| E16 | Project knowledge held only outside the repo (memory notes, desktop-app side-session notes) | Docs | P2 | Open | — | `%USERPROFILE%\.claude\projects\<slug>\memory\`; side-session notes |
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
  `verify_page.js` exits 1 on a hard failure (PR #3). Exit 2 means a usage or input error
  (corrected 28-Oct-2026: since PR #19, `699978b`, 21-Oct-2026, every tool exits 2 on a missing
  source or a wrong `--html` path; this sentence said until then that a missing source still
  crashed with exit 1 in five PMS, AIF and Reckoner tools). Lines marked `CHECK`, `WARN` or carrying only counts never fail a run, so the
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

### A28. `tools/lib/pptx.js` fails on some decks
**P3 · Open · —**

- **What (found 25-Oct-2026 while filing the handover export):** for an entry stored with a data
  descriptor, `entries().get()` estimates the compressed size from the next local header
  (`tools/lib/pptx.js:19-26`). On the Oct-2026 and June-2026 market-pager decks this throws
  `Z_DATA_ERROR` on media and chart entries. A reader that takes sizes from the central directory
  works. Separately, a truncated download (the 17-Sep copy of the September Reckoner has no zip
  central directory) reads as 0 slides instead of failing loudly.
- **Impact:** none found in production. Slide XML reads, which `merge_reckoner.js` and
  `merge_aif_performance.js` use, worked on every deck tested. A truncated deck would give a dry run
  with 0 rows rather than a clear refusal.
- **Suggested fix:** read sizes from the central directory, and refuse a file without one.

### A29. Two PMS/AIF holdings parsers: the page's Section 7 upload and `merge_pms_aif_analytics.js`
**P2 · Open (needs investigation) · —**

- **What (found 28-Oct-2026 during the MOD-01 handover reconstruction):** PMS/AIF holdings are parsed
  by two independent pieces of code.
  - `REFRESH.parsePMSHoldings` (`site/index.html:3824`, grep `parsePMSHoldings = async`) runs when a
    user uploads a statement in Section 7 (`:7146`, `:7172`). It matches schemes within the chosen
    product class, and for a scheme it cannot match it creates a new MASTER PMS/AIF row: the IRR band
    comes from `PMS_AIF_TERMS`, else a default of 15–17% (PMS) or 16–18% (AIF), and 1Y = 3Y = 5Y =
    the band mid-point (`:3911-3923`).
  - `tools/merge_pms_aif_analytics.js:95-140` has its own parser for the monthly "PMS & AIF
    Analytics" workbook: it resolves names through its own `PIN` map, never creates MASTER rows
    (unmatched schemes are only listed), scales the fraction column by 100 and rounds with `r2`.
- **Evidence:** both read on 30-Oct-2026 at `2b2a397`. No entry named `parsePMSHoldings` before this
  one. Nobody has run both on the same workbook, so whether they give the same look-through (or
  even accept the same layout) is **unknown: needs investigation**.
- **Impact:** latent drift. A fix or a format change made in one parser does not reach the other, so a
  session upload and the monthly tool can disagree on a fund's holdings. The upload path also writes
  expected returns as track record (C28), for the session only.
- **Who sees it:** the Products team (Equity Analytics look-through of an uploaded PMS/AIF); clients
  only if such a proposal is exported in that session.
- **Suggested fix:** run both on one month's file (the July-2026 workbook, B6) and compare; then keep
  one parser (the tool could run the page's, as the bake does for the MF Monitor) or document why
  they differ.
- **Related:** A3, B6, C28, D49; TASK-068 (`docs/project-control/TASK_REGISTER.md`).

### A30. A sibling that fails is invisible to `verify_page.js` and CI
**P2 · Open · Affects any refresh that changes a sibling**

- **What (found 28-Oct-2026 during the MOD-01 handover reconstruction):** siblings 3–5 wrap their
  whole body in `try { … } catch (e) { console.error(…) }`: `site/Centricity_June_Refresh.js:6`,
  `:19`; `site/Centricity_IRR_Offshore.js:8`, `:31`; `site/Centricity_SIF_Refresh.js:27`, `:260-261`.
  An exception inside a sibling is caught and logged, never thrown. `tools/verify_page.js` counts
  only thrown errors (`:28-32`) and fails only on a missing sibling, duplicate names, a missing
  `</html>`, a thrown script error or a Select key missing from MASTER (`:90-96`); the CI parity gate
  greps the same output (`.github/workflows/pages.yml:47-61`).
- **Evidence:** code read on 30-Oct-2026. Not reproduced with a deliberately broken sibling
  [inference from code].
- **Impact:** a deploy whose sibling throws part-way would pass CI and publish automatically (D61)
  while the page silently loses sibling-owned data: the GIFT City bucket and 12 PMS/AIF
  look-throughs (June), the IRR bands and offshore funds (IRR/Offshore), the 30 SIF rows and
  `DATA_DATES.sif` (SIF). Only the counts `verify_page.js` prints would change, and nothing compares
  them with a baseline (A23). The one tool that surfaces a sibling's `console.error` and fails is
  `tools/rekey_sif_analytics.js` (`:52-80`, `:126`).
- **Who sees it:** every user of the live site and every client deck or workbook exported from it,
  until someone notices the missing data.
- **Workaround:** after any change to a sibling, compare the `verify_page.js` counts with
  `docs/PROJECT_STATE.md` (MASTER effective 7,682; `DATA_DATES.sif`) and load the page to check the
  console for "override failed".
- **Suggested fix:** let `verify_page.js` capture `console.error` from the sibling scripts (or have
  each sibling set a failure flag) and fail on it; change the `pages.yml` greps in the same PR.
- **Related:** A23, A31, C1, D57, D61, D63; TASK-042.

### A31. Two CLAUDE.md invariants are not enforced by `verify_page.js` or CI
**P2 · Open · Affects every refresh (check both by hand)**

- **What (found 28-Oct-2026 during the MOD-01 handover reconstruction):** CLAUDE.md rule 9 names four
  invariants. `verify_page.js` and the CI parity gate enforce two of them: 0 duplicate MASTER names
  and every Centricity Select key in MASTER (`tools/verify_page.js:90-96`;
  `.github/workflows/pages.yml:47-61`). The other two are checked only inside single tools:
  - "the top-10 Direct Equity by market cap are Large Cap": `tools/merge_de_universe.js:134-139` and
    `tools/merge_direct_equity_returns.js:185-188` (exit 1);
  - "`DATA_DATES.sif` is not —": the `tools/merge_sif_monitor.js` gates (`:146-147`).
  `verify_page.js` only prints `DATA_DATES` (`:72`).
- **Evidence:** code read on 30-Oct-2026. Both invariants hold today: the 10 largest Direct Equity
  rows by `mktcap` are "Large Cap" and the effective `DATA_DATES.sif` is "30th September 2026"
  (`verify_page.js`, 28-Oct-2026).
- **Impact:** a hand edit, a failing sibling (A30) or a run that skips those tools could break either
  invariant and still pass CI and publish (D61). A mislabelled top-10 misstates the market-cap split
  of proposals holding those stocks. The page reads `DATA_DATES.sif` only in the SIF upload card's
  hint (`site/index.html:7232`), so "—" there is mainly a sign that the SIF sibling did not apply.
- **Who sees it:** clients and the Products team, only if a break happens.
- **Workaround:** after every refresh, read `DATA_DATES` in the `verify_page.js` output and check the
  top-10 Direct Equity by `mktcap` with a short Node query.
- **Suggested fix:** add both checks to the `verify_page.js` hard failures and the matching
  `pages.yml` greps in one PR.
- **Related:** A23, A30, D57, D63; TASK-042.

---

## B. Monthly-cycle gaps at handover

### B1. No PMS performance file transferred; PMS is 31-Jul-2026 data under a 31-Aug-2026 label
**P2 · Open (desk) · Blocks the PMS step**

- **Evidence:** No `PMS_Scheme_Performance_*` file is in any `monthly-updates/` folder. The
  "PMS & AIF Performance <Month>" files of Apr and May are a different format and are not
  substitutes. `site/index.html:1451` has `pms: "31st August 2026"`; `docs/PRD.md` §11.3 marks PMS as
  one cycle behind. The template named in `docs/runbooks/PMS_Performance_Update_Prompt.md:3` is also
  absent.
- **25-Oct-2026 (handover export):** the export's earlier `PMS_Scheme_Performance` files are now
  filed in the month folders (`docs/update-log/2026-10-23_handover-export.md`); none holds 31-Aug or
  later data. The live block equals `2026-07_Jul-2026/PMS_Scheme_Performance_31st August 2026.xlsx`,
  whose content is **31-Jul-2026** data: its newest Risk Ratios Date is 31-Jul, and its returns match
  the August-2026 Reckoner ("as on July 31st"), not the September deck. Commit `ac4347b` (28-Sep-2026)
  moved the label from "31st July 2026". AIF performance (from the September deck) really is 31-Aug.
  Relabelling `DATA_DATES.pms` is a data change for the owner.
- **Impact:** `merge_pms_performance.js` and `pin_pms_alias.js` cannot run; PMS returns stay at
  31-Jul-2026 data.
- **Action:** Ask the desk for the Sep-2026 and Oct-2026 files and file them in the month folders.
- **Severity (corrected 28-Oct-2026):** P2, as here; this register is authoritative for severity.
  `docs/PROJECT_STATE.md` lists B1 under "Owner decisions from the handover export (P1)"; there the
  "(P1)" reads as the urgency of that group of decisions, not B1's severity [inference]. The owner
  may raise it.

### B2. Live Sep-2026 Reckoner deck not in the pack
**P2 · Partly fixed 25-Oct-2026 (handover export) · Open (desk) for the Oct-2026 deck · Blocks the Reckoner and AIF steps**

- **Evidence:** Only `monthly-updates/2026-07_Jul-2026/Monthly Investment Reckoner - August 2026.pptx`
  (as on 31-Jul) was transferred. The Sep-2026 deck (as on 31-Aug), which produced today's
  `CENTRICITY_SELECT` and AIF performance, stayed on the outgoing owner's Desktop.
- **Impact:** The Reckoner steps need the Oct-2026 deck (as on 30-Sep). Today's Select block cannot
  be reproduced from archived inputs.
- **Action:** Request the Oct-2026 deck. Ask the outgoing owner for the Sep-2026 deck for the archive.
- **Partly fixed 25-Oct-2026:** the Sep-2026 deck (31-Aug data) came with the handover export and is
  filed as `monthly-updates/2026-08_Aug-2026/Monthly Investment Reckoner - September 2026 (re-issue
  2026-10-08 1652).pptx`. Dry runs on a scratch copy reproduce the live AIF block (12 → 12, values
  unchanged) and the Select membership (178 → 178, 33 categories); retained entries keep their text by
  design, so this is not a field-by-field match. The Oct-2026 deck is still missing.

### B3. Sep market deck in the pack is the superseded first issue
**P2 · Closed 25-Oct-2026 (handover export) · —**

- **Evidence:** `monthly-updates/2026-09_Sep-2026/Monthly Outlook Pagers_Oct 2026.pptx` was saved at
  11:28 IST on 13-Oct-2026, and its slide 6 is titled "OVERALL MARKET UPDATE – August 2026". The six
  live `EXTRA_SLIDES.market` images came from the 17:14 re-issue (`docs/OPERATING_MANUAL.md` →
  Refreshing the Market Update slides), which is not in the pack.
- **Impact:** Re-rendering from this copy would publish outdated slides.
- **Action:** Do not render from it. Ask for the final issue every month; re-issues keep the same
  file name.
- **Closed 25-Oct-2026:** the 17:14 re-issue came with the handover export and is filed as
  `monthly-updates/2026-09_Sep-2026/Monthly Outlook Pagers_Oct 2026 (re-issue 2026-10-13 1714).pptx`
  (slide 6 "– September 2026"; the export's renders of it equal the six live images). The 11:28 first
  issue moved to `2026-09_Sep-2026/_superseded/`.

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
**P3 · Partly fixed 25-Oct-2026 (handover export) · Open (desk) · —**

- Never transferred: `Topic Slides, Disclaimer & Thank You Slide.pptx`; the Bond List of 06-Aug-2026
  (only 08-Jun is present; see A1); `SIF Master List_Jul 2026` (only June, with 28 schemes; the live
  sibling has 30).
- `Exit Load & Expected IRR Return Range.xlsx` exists only as the April copy. It is the source of the
  hand-maintained IRR map in `site/Centricity_IRR_Offshore.js`, and `docs/PRD.md` §11.1 omits it
  from the monthly inputs.
- Until the desk resends them, these refreshes cannot be repeated or audited.
- **Partly fixed 25-Oct-2026:** the Bond List of 06-Aug-2026 came with the handover export and is
  filed in `monthly-updates/2026-08_Aug-2026/` (a dry run reproduces the 36 live Invictus bonds). The
  closing-slides decks are in the export (`04_slides/source_decks/`) but are not filed until the
  owner decides (`docs/INPUT_FILES.md` P5). The April-folder IRR file is not an April issue: it is the
  23-Jun-2026 file, the source of the live IRR map. Still missing: a SIF Master List after June and a
  current IRR file.

### B8. NAV Data and Fund Risk Ratios were made in-house; nobody builds them now
**P1 · Open (owner decision) · Blocks the Oct-2026 Portfolio Matrix refresh**

- **What:** `docs/INPUT_FILES.md` lists #12 (`Fund Risk Ratios & 3Y Rolling`) and #17 (`NAV Data`)
  as desk or vendor files (corrected 28-Oct-2026: it did until `11d5c0a`, PR #28, which now marks
  both "made in-house"). The handover export shows the outgoing owner made both with Claude. The
  toolchain is in `05_project_working_folder/_nav_risk_toolchain/` (PowerShell + C#):
  - `AmfiFetch.ps1` downloads AMFI NAV history;
  - five Nifty index files are downloaded by hand from niftyindices.com;
  - `Calc.cs` / `Metrics.cs` and the month scripts write both workbooks.

  Its outputs are byte-identical to the Aug and Sep workbooks we hold.
- **Impact:** the desk will not send these files, so the Oct-2026 risk matrix has no producer.
  The repo's only alternative, `tools/build_risk_matrix.py`, is unvalidated (A22), and it differs on
  Sortino (C35) and on the start of the 3-year window. Rf 4.5% is hard-coded in both (C11).
- **Options (owner):**
  - port the core of the toolchain (about 12 scripts) to Node in `tools/`, with a Sep-2026 regression
    test that must reproduce the live workbook;
  - validate and align `build_risk_matrix.py` instead;
  - or ask the desk to take it on.

  Decide C35 and C11 first.
- Also correct `docs/INPUT_FILES.md` (#12, #17) and `docs/MONTHLY_UPDATE_PROCESS.md`, which still
  list both among the desk's files. **Corrected 28-Oct-2026:** both were corrected in `11d5c0a`
  (PR #28). The stale lists that remain are `docs/HANDOVER.md` §5 and
  `monthly-updates/00_INBOX/README.md` rows 12 and 17 (E8); the same stale sentence is in
  `docs/update-log/2026-10-23_handover-export.md:207-209`.

### B9. April folder holds a mid-May monitor; a true 30-Apr monitor is held
**P3 · Open (owner decision) · —**

`monthly-updates/2026-04_Apr-2026/` holds `Daily MF monitor_15th May 2026.xlsx` as the April
Regular monitor (returns as on 17-May). The handover export has a true month-end
`MF Monitor_30th April 2026.xlsx` (A3 and B12 read 30-Apr; 2,079 fund rows). It was **held**, not
filed. Decide whether it becomes the April file, with the 15-May copy moved to `_superseded/`.
History only: no live data depends on April.

---

## C. Product and UI known gaps (`docs/PRD.md` §14)

C1–C13 are PRD §14 items 1–13, re-checked on 16-Oct-2026. C14–C18 are not in the PRD.

### C1. Siblings 3–5 not folded into the page
**P2 · Open · —**

The page still loads `Centricity_June_Refresh.js`, `Centricity_IRR_Offshore.js` and
`Centricity_SIF_Refresh.js` (`site/index.html:5083-5085` on 16-Oct; `:5525-5527` at `2b2a397`,
corrected 28-Oct-2026), which re-apply their data on every load.
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

### C5. Motilal Oswal Gift City India Equity Fund – Inbound: very likely our existing record under a new deck label
**P2 · Open (desk to confirm, then a pin) · Affects the Reckoner step**

The Sep-2026 deck's replacement fund appears nowhere in `site/index.html` or the siblings. The fund
it replaced, `Motilal Oswal Alternative Investment (Inbound)`, is still in MASTER and in `NEW_GIFT`,
but is no longer a Select key. The GIFT City bucket is one fund short of the deck. Note that
`add_reckoner_funds.js` re-adds the dropped fund to `NEW_GIFT` (A20).

**Corrected 25-Oct-2026 (handover export):** this is very likely one product under two labels, not
a missing fund [inference, strong].
- `tools/add_reckoner_funds.js:97-100` created our record from deck slide 105 with the Reckoner
  name `Motilal Oswal Gift City India Equity Fund`.
- Both the August deck and the September re-issue index `Motilal Oswal Gift City India Equity Fund
  – Inbound | 105`. Slide 105 is titled "Gift City AIF – Inbound | Motilal Oswal Alternative
  Investment".
- `tools/data/pins.json` maps only the old deck label, which is why the record lost its badge.

Once the desk confirms, add a Reckoner pin and re-run the Reckoner step. That restores the badge
without adding a fund.

### C6. Prism Hybrid Long-Short Fund has no AMC prefix
**P3 · Open · —**

The record exists only in `site/Centricity_SIF_Refresh.js`; the Monitor gives no AMC. New SIFs
appended by `merge_sif_monitor.js` arrive without an AMC prefix or IRR band
(`tools/merge_sif_monitor.js:91`). Add the AMC when the desk confirms it. The handover export
(25-Oct-2026) confirms that no desk answer exists anywhere. The record also has no IRR band (C24);
ask for both, together with C38.

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
A22 for the remaining validation. (Corrected 28-Oct-2026: the RISK_MATRIX block and
`RISK_MATRIX_BENCH_SD` are at `site/index.html:5533-5536` at `2b2a397`; the summary cited
`:5091-5094`.)

### C11. Rf = 4.5% to re-confirm with the desk
**P2 · Open (desk) · —**

Since 19-Oct-2026 (PR #9) it is the `--rf` argument of `tools/build_risk_matrix.py` (default 0.045,
printed on every run). **Corrected 25-Oct-2026 (handover export):** it does not matter only for the
Python route. There is no vendor: the live `Fund Risk Ratios & 3Y Rolling` workbook is computed
in-house (B8), and Rf = 0.045 is hard-coded there too (export `Metrics.cs:27`, `Calc.cs:21`). It feeds
Sharpe, Sortino, Treynor and Jensen alpha, so Rf shapes the live RISK_MATRIX. The outgoing owner's
notes call it a "standing desk convention", not taken from any file; its source is unverified.
Re-ask the desk for the house rate before the next risk build.

### C12. Dead code kept for parity
**P3 · Accepted · —**

`PortfolioRollup`, `SharePanel_REMOVED`, the `false &&` Section 7 cards (`site/index.html:9052`,
`:9058`), the dead `BENCHMARKS` description map (`:1238`), legacy `aggEquity`/`aggDebt`, and the
empty `BONDS`/`PMS_HOLDINGS` globals. **Correction to the PRD:** `parseAnalytics` is not dead.
`bake_month.js`, `merge_analytics.js` and `fill_variant_analytics.js` run it offline. Only its upload
card is gone: the rail renders the MF Monitor card plus the PMS/AIF holdings and SIF Monitor cards
(`:6796-6807`, `:6848`), so the analytics and bonds branches of the upload handler (`:6700`) are
unreachable. Do not delete `parseAnalytics`.

**Line references (corrected 28-Oct-2026):** the lines above are as on 16-Oct-2026. At `2b2a397`
the Section 7 cards are at `site/index.html:9529` and `:9535` (grep `false && /*#__PURE__*/`), the
rail cards at ~L7246-7294 and the upload handler's analytics and bonds branches at ~L7145-7146
(grep `kind === 'equity'`).

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
- **22-Oct-2026 (PR #26, D82):** the `mk` shrink and `NOTE_Y` are gone. Every matrix slide, flagged
  or not, now goes through the design system's table engine: the largest type that fits above the
  footer block, else continuation slides; the dagger note is a paragraph of that block.

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
- **Related (added 28-Oct-2026):** C43 is the same young-fund family: `UTI BSE India Sector Leaders
  ETF`, launched 15-Sep-2026, shows a since-inception return of 297,765%. Decide it with this item.

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
**P3 · Closed 22-Oct-2026 (PR #26, D82) · —**

- **Fixed:** the matrix table is measured and fitted like every table in the deck (D82): the largest
  size from 11pt down to 8pt that fits above the notes, otherwise continuation slides at 9pt with the
  header and the PORTFOLIO AVERAGE row on each page. Rendered in PowerPoint (22-Oct-2026): 30 funds
  with risk data, two of them flagged, give two matrix slides, table bottoms 6.80" and above; 45
  instruments give three. The text below is the state before the fix.

- The matrix table starts at y 1.0 with rows of 0.24" (taller when a name wraps). With no flagged
  fund, about 24 or more selected funds reach the notes at y 7.02 ("Portfolio Average …", "Risk
  data as on …"), and more run off the 7.5" slide: 25 funds including three long names end at
  7.87" when rendered in PowerPoint (21-Oct-2026). The C17 fix shrinks the table only when a fund is
  flagged, so this case is unchanged on purpose (parity). The Performance Sheet slide uses the same
  fixed 0.24" rows from y 1.0 [inference].
- **Suggested fix:** apply the C17 fit (`mk`) to every matrix slide with the notes' y as the limit,
  or continue a long table on a second slide; decide with the owner, since it changes slides that
  have no flag.

### C23. Select popover Alpha shown 100 times too large (source-confirmed)
**P2 · Open (desk: confirm the period) · —**

- **Confirmed 25-Oct-2026 (handover export):** the source workbook, `OneDigital Reckoner_May
  2026.xlsx`, labels the row `Alpha (%) (3 Yrs)`, next to `SD (%) (3 Yrs)`. So the stored alpha is
  in percent units. Live has **46** Select entries with alpha, not 37. In the popover, 34 of them show
  |alpha| ≥ 10%. Still unknown: whether the alpha is monthly or annual. The ratios themselves are
  May-2026 values (C36).
- The popover formats `CENTRICITY_SELECT[].alpha` with `fmtPctRaw` (value × 100, then `%`). The
  stored values look like percentages already: entries range from -0.447 to 1.2644, so the
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
- **Impact:** client-facing. The tile feeds Future Value (corrected 28-Oct-2026: not the
  PowerPoint; this sentence said until then that it also fed the PowerPoint's "Expected Pre-Tax
  Return", which the export does not contain). The code is the same at `handover-baseline`, so this
  is inherited, not a regression.
- **Corrected 28-Oct-2026 (MOD-01 handover reconstruction), where the rule applies:**
  - counts no-band instruments as 0%: the Section 1 tile (`computeKPIs`, `site/index.html:1609-1632`,
    `(irr_low || 0)` at `:1617`); Section 5 Future Value, which takes the tile's mid-point (`:7052`)
    and is labelled "Expected Pre-Tax Return (p.a.)" (`:7090`, the only occurrence of that phrase in
    the page); the Section 6.1 Live Output Proposal tab (`ProposalTab`, its own
    `(s.fund.irr_low || 0)` weighting at `:7435`, totals `:7418-7464`);
  - leaves them out: the Section 4 table (`H.weightedReturns`, `:6900`) and the PowerPoint
    Investment Option GRAND TOTAL (`H.rollupReturns` → `H.weightedReturns`, `:4925`, `:2078-2097`).

  The decision below must name these five places; `docs/PROJECT_STATE.md` step 3a repeated the
  PowerPoint error (E13).
- **Wider than Direct Equity (25-Oct-2026, handover export):** live MASTER has **99** MF/ETF/SIF
  records with no band, all treated the same way:
  - Equity MF 64, Debt MF 11, Hybrid MF 7, Equity ETF 7, Commodity ETF 5, Debt ETF 3, SIF 2.
  - 95 are 2026 launches (the last IRR file is the 23-Jun-2026 one, B7).
  - 4 are older: two Quantum gold funds, and the two UTI side pockets of C39.
- **Decision needed (owner):** exclude instruments without a band from the weighting (and say so on
  the slide), or give them an expected return. Then make every table use the same rule. **Desk:** a
  current `Exit Load & Expected IRR Return Range` file would give most of the 99 a band.

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

The items C28–C34 were found by the PowerPoint format audit of 22-Oct-2026
(`docs/proposal-output-format-audit.md`), with a financial-data review of the display rules.

### C28. Expected returns are stored as track record (bond yields, AIF/PMS band mid-points)
**P2 · Open (owner/desk); marked in the deck since 22-Oct-2026 (PR #26, D83) · —**

- **What:** `tools/merge_bond_list.js:198` writes every desk bond with r1y = r3y = r5y = its yield, and
  `tools/add_reckoner_funds.js:197` writes AIF/PMS peers that publish no return series with r1y = r3y
  = r5y = the IRR band mid-point. For a PMS/AIF matched to a performance record, a period the source
  leaves blank keeps the stored mid-point (`applyPmsPerformance`, D55). The screen, the Excel and the
  deck then show these as past performance: e.g. Inquant Debt Plus Fund, launched January 2024, at
  12.50% for 3Y and 5Y; Neo Yield Enhancer's real 1Y next to a mid-point 3Y/5Y. 83 records carry the
  "1Y = 3Y = 5Y, no other series" pattern (50 bonds, 16 AIF, 6 FD, 5 unlisted equity, 4 PMS, 1 REIT,
  1 GIFT City) and 31 cells on 16 PMS/AIF records come from blank source periods.
- **Bonds (25-Oct-2026):** the "yield" stored for desk bonds is the top of the IRR band, while the
  owner asked on 20-May for the band average (C37).
- **Also:** 14 AIF mid-points no longer match the fund's current band, because a later band change
  did not touch the returns. Examples: InCred Growth Partners II at 27.50% against 22–25%; Neo Infra
  Income Opportunities Fund II at 16.00% against 14–16%.

  This entry first counted 12. The handover export (25-Oct-2026) found two more:
  - Vedartha India Opportunities – Series 1, at 18% against 16–18;
  - Emkay Emerging Stars, at 21% against 16–18.

  Both have performance records with no 1Y/3Y/5Y, so the old mid-points stay. Alchemy Long Term Ventures (inception
  1-Feb-2026) shows an 18.30% 1Y the source no longer publishes: stale, not an expected figure.
- **Now (D83):** the deck marks such a figure `*` with a note saying it is the expected return held in
  the data (`H.isExpectedReturn`), on the Investment Option and Fund Performance slides. The screen
  still marks only the runtime fallback (`H.isFallbackReturn`); the Excel marks nothing.
- **Suggested fix (owner/desk):** carry the basis in the data (e.g. a per-period `ret_basis` of
  "expected"), or clear the periods a fund has no history for, and let the screen and Excel use
  `H.isExpectedReturn` too. Decide what to do with the 14 stale mid-points (corrected 28-Oct-2026:
  this sentence said 12; the entry counts 14 since 25-Oct) and the Alchemy 1Y.

### C29. Performance buckets are defined three times and disagree on Debt PMS
**P3 · Open · —**

The screen (`bucketOf`), the Excel export (`bof` in sheet 6) and the PowerPoint export each define the
Fund Performance buckets. Screen and Excel put a Debt PMS under "Other" (shown with the equity column
set, so its 1M and 2Y returns are not shown); the deck shows it under "PMS — Debt" with the PMS
columns (D82; before, under "PMS — Equity"). Suggested fix: one shared bucket function in `H`.

### C30. The screen's Performance tab dates PMS/AIF figures with the MF date
**P3 · Open · —**

`PerformanceTab` heads every bucket "Performance as on" `DATA_DATES.performance` (30-Sep-2026), while
the PMS and AIF figures are as on `DATA_DATES.pms` (31-Aug-2026). The deck dates each table by its own
source since PR #26 (D82). Suggested fix: the same per-bucket date on the screen.

### C31. AMC name falls back to the scheme name's first word for 354 MF/ETF records
**P3 · Open · —**

`window.getAMC` (`site/index.html:1427`) returns the first word of the scheme name when no AMC prefix
matches: 354 of 2,029 MF/ETF records (financial review, 22-Oct-2026), e.g. "Bank of India Large Cap
Fund" counts under "Bank". The AMC chart, its "Other AMCs (n)" count and the Excel AMC sheet use these
labels. Suggested fix: complete the AMC prefix list with the desk.

### C32. Debt look-through: issuer bucket set by the first instrument seen; unrated-bond default
**P3 · Open · —**

In `H.aggDebtScoped` an issuer's rating bucket is taken from the first holding seen, so for the 49 of
571 issuers whose holdings sit in more than one bucket the issuer table can depend on the order of
the selection. A direct bond with no `bond_rating` would be bucketed "AAA & Equiv" (no live effect:
all 50 bonds are rated); an MLD already defaults to "Unrated". The issuer table's "Rating" column
shows the bucket, not the bond's own grade (deliberate: one vocabulary with the doughnut).

### C33. Commodity ETFs carry a market-cap split of about 100% "Others"
**P3 · Open (desk) · —**

Commodity ETFs hold `mcap_other` of about 0.95–1.002, some above 100%. Since PR #26 the deck shows
market-cap columns only where the bucket's data carry a split, so an "Other" bucket with a commodity
ETF shows them. Suggested fix: clear the market-cap split for commodity funds with the desk.

### C34. Disclaimer slide image: text block in the top half, header line in another colour
**P3 · Open (desk: source slide, B7) · —**

The Disclaimer slide is a full-slide image (`EXTRA_SLIDES.disclaimer`, made by
`tools/update_closing_slides.js` from the desk's "Topic Slides, Disclaimer & Thank You" deck, which
did not come with the handover, B7). Its text block fills the top half and its header rule is a
different colour from the native slides. The wording is compliance text, so the deck does not crop or
re-set it. Suggested fix: re-lay the source slide (text vertically balanced, gold rule), render it and
run `update_closing_slides.js`. The source decks did arrive with the handover export on
25-Oct-2026 (`04_slides/source_decks/`, archive only until the owner decides P5).

### C35. Sortino has two definitions in the live history, and a third route uses another
**P2 · Open (owner/desk) · Affects the next risk build (B8)**

Checked 25-Oct-2026 by recomputing both definitions from our NAV Data files and matching to 2 dp:
- **June 2026 workbook:** semi-deviation (standard deviation of negative excess returns), matching
  917 of 917 funds.
- **August 2026:** the textbook form (root-mean-square of negative excess over all days), matching
  958 of 958.
- **Live September RISK_MATRIX:** the textbook form, matching 908 of 908.

The in-house calculator says "Sortino: textbook definition" (export `Metrics.cs:168-174`). The
desk never approved the change (export KT-4; no approval found in the owner's messages). On
September data the two forms differ by 0.04 on average and 0.27 at most.

`tools/build_risk_matrix.py` implements the June form (`:117-118`). It also starts the 3-year window
at the last trading day on or before AS_ON − 3Y (`:101`), where the in-house build starts on or after.
In September that changes SD at 2 dp for 477 of 908 funds. So A22's "agrees with the live matrix on
most fields" does not hold for Sortino, or for SD in such months.

**Decision (owner/desk):** accept the textbook Sortino or return to June's. Align whichever builder
is adopted (B8) before it is used.

### C36. Select popover ratios are May-2026 values and carry no date
**P3 · Open (owner) · —**

All 46 Centricity Select entries that carry ratios equal the May-2026 `OneDigital Reckoner_May
2026.xlsx` exactly (Sharpe, SD, alpha; 46 of 46). `tools/merge_reckoner.js` keeps a retained fund's
ratios and gives a new MF entry none, because the decks carry no ratio columns. The popover shows
them beside 30-Sep Portfolio Matrix figures with no as-on date. `docs/INPUT_FILES.md` calls that
workbook superseded, but it is still the only source of these ratios.

**Decision (owner):** date them "as on 31-May-2026", replace them with RISK_MATRIX values, or hide
them. C23 (the alpha unit) is part of the same decision.

### C37. Bonds store the top of the IRR band as 1Y/3Y/5Y; the owner asked for the band average
**P2 · Open (owner decision) · —**

On 20-May-2026 the owner asked that the 3Y and 5Y past performance used for bonds in a proposal be
"the average of the expected pre tax irr range" (owner message in the export's Cowork audit log).
`tools/merge_bond_list.js:198` writes r1y = r3y = r5y = `irr_high`. All 14 live OneDigital bonds
hold the top of their band, e.g. OXYZO 9.95% where 9.75–9.95 averages 9.85%. The 36 Invictus bonds
have `irr_low = irr_high`, so they are unaffected today.

**Decision (owner):** confirm the average. If confirmed, change the tool and the 14 records in a
reviewed data change, and record it in DECISIONS. Related: C28.

### C38. The "SBI" AMC of the Magnum Equity Ex-Top 100 SIF was inferred, not sourced
**P3 · Open (desk) · —**

The SIF Monitor's raw name is `Magnum Equity Ex-Top 100 Long-Short Fund-Reg(G)`, with no AMC. The
outgoing owner's Claude chose `sif_amc` "SBI" from the Magnum brand (export KT-3.8). That is plausible,
since SBI Magnum Hybrid Long-Short is an SBI SIF in the same sibling, but unconfirmed. The record also
has no IRR band (C24). Confirm the AMC with the desk, together with C6.

### C39. Four segregated side-pocket records are live and pickable
**P3 · Open (owner) · —**

MASTER holds four segregated portfolios, all with AUM 0 (or 9e-9), no returns and no IRR band, and
each can be picked into a proposal:
- Franklin India Short Term Income Plan-Segregated Portfolio 3;
- Franklin India Credit Risk Fund-Segregated Portfolio 3;
- UTI Medium Term Fund (Segregated - 06032020);
- UTI Credit Risk Fund (Segregated - 06032020).

The parser skips only names containing "segregated portfolio" (`site/index.html:3415`), so the two
UTI rows are parsed every month. The outgoing owner's notes flagged this trap. (Corrected
28-Oct-2026: the same test sits at two places in `REFRESH.parseMfMonitor`, `site/index.html:3347`
and `:3415`; a fix must change both.)

**Decision (owner):** drop the four records, and tighten the skip to any "segregated" name (at both
places), in a `fix/` branch.

### C40. `rename_schemes.js` "new to MASTER" counts rows the bake never adds
**P3 · Open · —**

The Sep-2026 dry run (25-Oct-2026) prints `new to MASTER: 14 (left for bake_month.js to add)`. None
of the 14 is added by the bake:
- 5 are new launches on the refresh-only sheets. The bake lists them as `not merged`, and they are
  added by hand with the owner (D80).
- 9 are segregated or unclaimed rows that the page parser filters out.

The count overstates what the bake will do. Suggested fix: split the count into "added by the bake",
"refresh-only (add by hand)" and "filtered by the parser", or drop the hint.

The items C41–C45 were found on 28-Oct-2026 during the MOD-01 handover reconstruction (fact sheets
checked against the code at `2b2a397`; re-checked 30-Oct-2026). `site/index.html` line numbers are
as at `2b2a397`; re-find them with the grep pattern given.

### C41. PMS/AIF benchmark rows show static values; the monthly benchmark refresh reaches no page
**P2 · Open (owner decision: source and refresh) · Affects the AIF step (its benchmark refresh is never shown)**

- **What (found 28-Oct-2026 during the MOD-01 handover reconstruction):** the benchmark rows under the
  PMS and AIF buckets on the screen's Performance tab (`site/index.html:7934`), in the Excel export
  (`:4099`) and on the PowerPoint Fund Performance slides (`:5200`) come from
  `window.pmsBenchmarkPerfFor` (`:3069-3072`), which reads the literal `window.PMS_BENCHMARK_PERF`
  (`:3057`; grep `PMS_BENCHMARK_PERF = `). No tool writes that literal. The monthly tools write
  `PMS_PERFORMANCE.benchmarks` instead (`tools/merge_aif_performance.js:168-189`, `:237`; carried by
  `tools/merge_pms_performance.js:184`, `:191`), and nothing in the page reads it: only
  `tools/verify_page.js:66` counts it.
- **Evidence (re-checked 30-Oct-2026):** both stores hold the same four indices with different values,
  e.g. NIFTY 50 - TRI 1M 7.5% static against -1.1% in the block, 3Y 11.2% against 9.0%; Nifty Midcap
  150 - TRI 1M 13.2% against 1.8%. The literal is identical at `handover-baseline` and `main`.
  Extracted commit by commit from the upstream history, it has held these values since upstream
  `23f40e5` (20-May-2026). (The handover fact sheets date its last change to 02-Jun-2026, upstream
  `8f5c97e`; `8f5c97e` holds the same literal as its parent.) Which month the values describe is not
  recorded [inference: about April or May 2026].
- **Impact:** client-facing. Every PMS/AIF benchmark row on the screen, in the Excel and in the deck
  shows figures about five months old under the tables' current as-on labels, so a PMS or AIF is
  compared with the wrong benchmark returns. The AIF step's monthly benchmark refresh is lost.
- **Who sees it:** clients (deck and Excel) and the Products team (screen), for any proposal with a
  PMS or AIF.
- **Decision (owner):** which source the rows should use (read `PMS_PERFORMANCE.benchmarks`, whose
  four index names match, or keep a separately refreshed literal) and with what as-on date; then one
  reviewed change. Both stores are decimals today; never auto-detect the scale (CLAUDE.md rule 4).
- **Related:** A19, B1, B2, D55; DEC-OPEN-27, TASK-065 (`docs/project-control/`).

### C42. 12 RISK_MATRIX keys are unreachable, and no SIF has a risk row
**P2 · Open · Affects the next risk build (B8)**

- **What (found 28-Oct-2026 during the MOD-01 handover reconstruction):** 12 of the 1,088
  RISK_MATRIX keys name MASTER records that the SIF sibling removes at load:
  - 9 Mutual Fund rows that are really SIFs (6 Large Cap, 3 Mid Cap), dropped by the sibling's
    normalised-name duplicate filter (`site/Centricity_SIF_Refresh.js:27-54`);
  - 3 legacy `SIF` rows (A26).

  In the effective MASTER 1,076 keys are reachable, and none of the 30 effective SIF funds has a
  RISK_MATRIX entry under its effective name. `tools/merge_risk_matrix.js:141-143` matches keys
  against the embedded (baseline) MASTER, so its "every key in MASTER" gate passes.
- **Evidence (re-checked 30-Oct-2026):** a read-only vm probe that runs June → IRR/Offshore → SIF on
  a copy of the baseline MASTER: "RISK_MATRIX keys 1088: in baseline MASTER 1088, in effective 1076
  … removed at load 12"; "effective SIF funds with a RISK_MATRIX entry under their effective name: 0".
- **Impact:** a SIF in a proposal has no Portfolio Matrix figures on the screen or in the deck
  [inference: shown as missing], although the risk workbook carries 9 of them under their old Mutual
  Fund names. Whether the workbook has the other SIFs under other names is not known.
- **Who sees it:** clients (Portfolio Matrix slide) and the Products team, for any proposal with a
  SIF.
- **Suggested fix:** check keys against the effective (post-sibling) MASTER in
  `merge_risk_matrix.js`, and decide with the owner how SIF risk rows are keyed; coordinate with the
  B8 producer.
- **Related:** A15, A26, B8, C1, D43, D74; TASK-066.

### C43. A two-week-old ETF shows a since-inception return of 297,765%
**P1 · Open (owner decision, with C20) · Affects every MF bake (scan `si` for outliers)**

- **What (found 28-Oct-2026 during the MOD-01 handover reconstruction):** the MASTER record
  `UTI BSE India Sector Leaders ETF` (Mutual Fund / Index Fund, inception 15-Sep-2026) carries
  `si` = 2977.646195, that is 297,765% (MASTER returns are decimals). It is the only record outside
  Direct Equity with |`si`| above 300%. The MF bake has no bound on `si` (its gates,
  `tools/bake_month.js:194-228`: sandbox errors, duplicates, shrinking blocks, Direct coverage,
  unrecognised sheets), while the SIF Monitor merge refuses any return beyond ±300%
  (`tools/merge_sif_monitor.js:135`, `:141`).
- **Evidence (re-checked 30-Oct-2026):** a read-only scan of the baseline MASTER for |`si`| > 3
  outside Direct Equity finds this one record. `si` is printed on the screen's Performance tab
  (`site/index.html:7844`, `:7945-7948`), in the Excel performance sheets (`:4063-4072`) and in the
  deck's Fund Performance tables (`:5151-5154`).
- **Impact:** client-facing: an absurd since-inception figure on the screen, in the Excel and in the
  deck for any proposal with this ETF. It is the C20 pattern: the Monitor's annualised
  since-inception return for a fund a few weeks old.
- **Who sees it:** clients (deck, Excel) and the Products team (screen).
- **Workaround:** keep this ETF out of client proposals until it is fixed; after every MF bake, scan
  `si` for outliers.
- **Decision (owner) and fix:** treat very young funds' since-inception values with the C20 rule
  (DEC-OPEN-07), then add an `si` bound to the MF bake's gates.
- **Related:** C16, C20, D81; DEC-OPEN-07, TASK-067.

### C44. Construct and Net Asset Allocation slides draw their tables outside the design system
**P3 · Open · —**

- **What (found 28-Oct-2026 during the MOD-01 handover reconstruction):** D82 and
  `docs/OPERATING_MANUAL.md:520` ("draw tables only with it") send every deck table through
  `planTable` / `drawTable`. Two tables in `buildDeck` do not:
  - the Asset Allocation Summary on the Construct slide (`site/index.html:4720-4773`; fixed
    `tableTopY = 4.05`; `s.addTable` at `:4769`);
  - the breakdown table on the Net Asset Allocation slide (`:4784-4825`; cards at y 1.2, table at
    x 0.4, y 3.8; `s.addTable` at `:4824`).

  Their rows are sized with `rowHeights` and floored (Net Asset Allocation at 0.34"; Construct at
  0.34" or the space left), and both are logged with `place`. The Net Asset Allocation cells set no
  `margin`, so pptxgenjs adds its default margins, which the row measurement does not assume (the
  trap `drawTable` exists to avoid, `:4592-4593`); the Construct cells set their own margin.
- **Evidence:** code read on 30-Oct-2026. `npm test` (28-Oct-2026, `pptx_layout`) and the 22-Oct
  PowerPoint renders show no overflow.
- **Impact:** none visible today. Latent: a long label could make a row taller than measured, and
  neither table can continue onto another slide.
- **Who sees it:** clients, only if the latent case occurs.
- **Suggested fix:** draw both tables through `planTable` / `drawTable` (or at least give the Net
  Asset Allocation cells `DS.CELL_M`); re-render and run `tools/dev/check_pptx_bounds.js`.
- **Related:** C22, C45, D82; REQ-PPT-99; TASK-069.

### C45. Analytics list tables draw only their first page
**P2 · Open (latent) · —**

- **What (found 28-Oct-2026 during the MOD-01 handover reconstruction):** the Top Underlying Holdings
  and Top Issuers tables on the analytics slides are planned with `listTable`
  (`site/index.html:5020-5021`, a `planTable` wrapper that can split a table into pages), but both
  callers draw and log only `tp.pages[0]` (`:5055-5057`, `:5102-5104`; grep `tp.pages[0]`). The
  layout log (`place`, `window.__PPTX_LAYOUT.warnings`) records only that page, so a second page
  would be dropped from the deck without a warning.
- **Evidence:** code read on 30-Oct-2026. Today the inputs are capped (top 20 holdings, top 18
  issuers) and fit; the layout tests pass. The drop is latent, not observed.
- **Impact:** if a table ever needs a second page (longer names, a long "not in the look-through"
  note), rows vanish from a client deck, against D82's rule that the engine never drops a row.
- **Who sees it:** clients, only in that case.
- **Suggested fix:** draw every page (a continuation slide, as the other tables do) or fail loudly
  when `pages.length > 1`.
- **Related:** C44, D82; REQ-PPT-110, REQ-PPT-120; TASK-069.

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
- **25-Oct-2026:** the same unredacted file also reached us inside the handover export, in a clone's
  git pack (R8). The repo zip at the root of `handover-archive/`, received 14-Oct, is the unredacted
  GitHub download too. Both are local and git-ignored. Whether to delete them from this machine is the
  owner's call, with compliance (R8).

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
and `:5083-5085`; `:5525-5527` at `2b2a397`, corrected 28-Oct-2026); the live matrix is inline (`:5086-5094`, 30-Sep-2026). The file is still
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
- **Seen 25–27-Oct-2026:** switching branches with `git checkout` aborted with "fatal: mmap failed:
  Invalid argument" and left tracked files truncated or deleted. They were restored from git, and
  nothing was lost. The cause: several files in `.git/objects/pack/` had become OneDrive cloud-only
  placeholders (attributes Offline + RecallOnDataAccess) while OneDrive was **not running**, so
  Windows could not recall them (`Permission denied` on read). Git memory-maps pack files, which
  fails on a placeholder. `git fsck --connectivity-only` still passed, and everything committed is on
  `origin`. Branch switches in this folder were then done without `checkout` (rewrite the files from
  `git cat-file`; `git update-ref` + `git symbolic-ref`).
- **Seen again 28-Oct-2026 (corrected 28-Oct-2026; unchanged on 30-Oct-2026):** OneDrive.exe is not
  running and the repo folder is not pinned ("Always keep on this device" not set); 229 of the 519
  files under `.git` are cloud-only, 8 of them in `.git/objects/pack/` (4 `.pack` + 4 `.rev`). In
  git the failure shows as `fatal: mmap failed: Invalid argument`: reading historical blobs and the
  stash's blobs with `git cat-file` fails, while reads of the current tree and
  `git fsck --connectivity-only` work, and `git stash show -p --include-untracked stash@{0}` still
  exports the whole stash. Until OneDrive is running and the folder is pinned,
  never `git checkout` or `git switch` here (CLAUDE.md, "Project control"; E7, E10).
- **Workaround:** Keep OneDrive running. Set the folder to "Always keep on this device"; pause OneDrive sync during tool runs
  and git operations; verify with Node on the real Windows path. If a write still fails with `EPERM`
  after its retries, check the file is unchanged and re-run the step. GitHub (`origin`) is the real backup.
- **Suggested fix (owner decision):** Move the clone outside OneDrive and keep only the
  `monthly-updates/` inputs there.

### R7. Old site still live alongside the new one
**P2 · Open (owner: retire only after full testing of the new build; then outgoing owner; corrected 28-Oct-2026) · —**

- The new site went live on 16-Oct-2026 (PR #1, merge `25e71a3`, Actions run 38866042211); all eight
  files at `https://productsteamcentricity.github.io/Centricity-Proposal-Playbook/` are byte-identical
  to `site/`. The outgoing owner's site still serves the same baseline.
- The old site will not receive monthly updates, and users' bookmarks and shared `#p=` links point to
  it.
- **Action:** Give users the new URL now. Ask the outgoing owner to replace the old site with a
  notice or redirect (together with R1).
- **Corrected 28-Oct-2026 (MOD-01 handover reconstruction):**
  - the owner's condition, given on 16-Oct-2026 and until now recorded in no repo document: the old
    site is retired only after full testing of the new build. What "full testing" means is still to
    be agreed (DEC-OPEN-24); the retirement itself is the owner's call (DEC-OPEN-14), and the
    outgoing owner then replaces the site;
  - "all eight files" was right on 16-Oct-2026; since PR #12 (D78) seven files are published (the
    six deploy files and `robots.txt`), all byte-identical to `site/` on 28-Oct-2026;
  - the old site (HTTP 200 on 30-Oct-2026) still serves the handover baseline, while the new site is
    seven site-changing merges ahead.

### R8. The handover export shipped two client items despite its README
**P1 · Open (owner + compliance) · —**

- **What (found 24-Oct-2026 by an independent scan):** the export's README says every client file
  was withheld. Two client items reached part02 nonetheless:
  - a PDF byte-identical to a withheld client review PDF, saved under a temp-file name at
    `06_claude_knowledge/cowork/sessions/2026-05-21_Portfolio_Review_Dashboard_Project_Setup_d96341ac/outputs/lu477p5yg.tmp`;
  - a clone's `.git` at `05_project_working_folder/_scratch_scripts/ovl/push/repo/.git/`, whose pack
    holds the unredacted Portfolio Review build prompt (the same content as R1).

  In addition, `01_manifest/manifest.csv` (2 rows) and `manifest.json` name the client family in
  the file names of two withheld uploads. The outgoing owner's screen read files by extension and
  skipped git packs. No secrets were found.
- **Where it is:** only under `handover-archive/export_20261023/` (and the zips beside it), which
  is git-ignored. Nothing was copied into `monthly-updates/` or the repo, and nothing was deleted.
- **Action (owner + compliance):**
  - decide whether to delete these items (and the repo zip of R1) from this machine;
  - tell the outgoing owner, so their own copies and any other recipient get the same treatment;
  - never push `refs/remotes/upstream/*`, and never push with `--mirror`.
- Record: `docs/update-log/2026-10-23_handover-export.md`.

### R9. `main` has no branch protection and no rulesets
**P2 · Open (owner decision) · —**

- **What (found 28-Oct-2026 during the MOD-01 handover reconstruction):**
  `gh api repos/productsteamcentricity/Centricity-Proposal-Playbook/branches/main` returns
  `protected: false`, and the repository has 0 rulesets (re-checked 30-Oct-2026). "Merge only after
  `verify` passes" (D68) is a convention. The `publish` job needs `verify` and re-runs it on every
  push to `main` (`.github/workflows/pages.yml:63-83`), so a failing gate blocks the publish; but
  nothing stops the merge of a PR whose `verify` failed or never ran, or a direct push, and `main`
  then holds the change.
- **Impact:** with D61, refreshes merge and publish without a human step; whatever passes the gate's
  narrow checks (A23, A30, A31) is live within minutes, and a change that fails it still lands on
  `main` unpublished.
- **Who sees it:** every user of the live site.
- **Decision (owner):** require the `verify` check on `main` (`docs/DEPLOYMENT.md:60-61` lists it as
  a recommended follow-up). It is a repository-settings change: only on the owner's explicit
  instruction.
- **Related:** A23, A30, A31, E12, D61, D63, D68; DEC-OPEN-17, TASK-036.

### R10. A likely copy of the client reference deck sits in `%TEMP%\x\`
**P2 · Open (owner decision) · —**

- **What (found 28-Oct-2026 during the MOD-01 handover reconstruction):**
  `%USERPROFILE%\AppData\Local\Temp\x\ref.pptx` (12,479,153 bytes, 22-Oct-2026 16:02 IST) is
  INFERRED to be a copy of the client reference deck used for the PowerPoint work of 22-Oct (PR #26)
  [inference from its name, date and folder; the file was not opened]. It is outside the
  repository, so no ignore rule applies to it, and it sits in a temp folder Windows may clean at any
  time.
- **Impact:** possible client data held outside any controlled location. It must never be committed,
  quoted or uploaded.
- **Who sees it:** nobody today (local only).
- **Decision (owner):** keep it in a controlled local place or delete it; deletion is the owner's own
  act.
- **Related:** R8, R11; TASK-070.

### R11. Single local copies with unknown cloud backup
**P2 · Open (owner) · —**

- **What (found 28-Oct-2026 during the MOD-01 handover reconstruction):** these exist only on this
  machine, outside git, and whether OneDrive holds cloud copies is unknown while OneDrive.exe is not
  running (R6):
  - `handover-archive/export_20261023/extracted/05_project_working_folder/_nav_risk_toolchain/`
    (221 files): the only source for a B8 port;
  - `_testdata/pptx-design-system/` (the renders and sample deck of PR #26) and `%TEMP%\x\` (82 files:
    the raw PowerPoint bounds files, the deck authoring source `pptx_section.js`, and R10);
  - the stash snapshot `wt_snapshot` in session `7628c9ae`'s scratchpad under `%TEMP%\claude\`;
  - `monthly-updates/` (about 447 MB of desk inputs) and `backups/`.
- **Evidence:** listings on 30-Oct-2026. `handover-archive/*`, `monthly-updates/*`, `backups/*` and
  `_testdata/` are git-ignored (only the README files of the first three are tracked); `%TEMP%` is
  outside the repo.
- **Impact:** a disk failure, a temp clean-up or a profile reset would lose the B8 toolchain and the
  deck evidence; `monthly-updates/` holds the only archive of past inputs.
- **Who sees it:** the owner and maintainers.
- **Suggested fix:** once OneDrive runs (TASK-017), confirm the cloud copies; otherwise copy the B8
  toolchain and the deck evidence to a controlled, backed-up place (never into git: they may hold
  client or vendor data).
- **Related:** B8, R6, R8, R10; TASK-070.

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
pin advice were updated in place. `tools/README.md` is the current CLI reference. Also wrong
(corrected 28-Oct-2026, this list was incomplete): `docs/PRD.md:405` gives the RISK_MATRIX shape as
`{be, sd, al, so, sh, co, ir, dc, rr, bm}`, without `fl`, the reliability flag added by D74 (33
entries carry it).

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

E6–E16 were found on 28-Oct-2026 during the MOD-01 handover reconstruction (re-checked 30-Oct-2026).
Most are for one docs-consistency change (TASK-018 in `docs/project-control/TASK_REGISTER.md`).

### E6. Docs call the siblings "idempotent-guarded" by flags that nothing reads
**P3 · Open · —**

- **What (found 28-Oct-2026 during the MOD-01 handover reconstruction):** `docs/ARCHITECTURE.md:48`,
  `docs/OPERATING_MANUAL.md:72` and `docs/PRD.md:221` say each sibling is "idempotent-guarded
  (`window.__JUNE_REFRESH_APPLIED` etc.)". The three flags are set
  (`site/Centricity_June_Refresh.js:18`, `site/Centricity_IRR_Offshore.js:25`,
  `site/Centricity_SIF_Refresh.js:54`) but no page code reads them; the only reader is
  `tools/merge_sif_monitor.js:76`, for a printout. Re-running a sibling is harmless because each one
  filters, then concatenates or assigns.
- **Impact:** a maintainer may rely on a guard that does not exist, for example when folding the
  siblings (C1).
- **Who sees it:** maintainers only.
- **Suggested fix:** reword the three docs: re-running is harmless by construction; the flags are
  markers.
- **Related:** C1, E1, E2, A30.

### E7. The monthly skill and process doc still tell the operator to `git switch`
**P2 · Open · Affects the next refresh (do not follow those steps)**

- **What (found 28-Oct-2026 during the MOD-01 handover reconstruction):**
  `.claude/skills/monthly-update/SKILL.md:20` (`git switch main`) and `:31`
  (`git switch -c data/<YYYY-MM>`), and `docs/MONTHLY_UPDATE_PROCESS.md:145` and `:171` (the same),
  still prescribe branch switches in the main checkout. On 25-Oct-2026 a `git checkout` there aborted
  with "mmap failed" and truncated tracked files (R6), and 229 `.git` files are still cloud-only.
- **Impact:** an operator or a Claude session that follows the skill could damage the working tree
  in the middle of a refresh.
- **Who sees it:** whoever runs the refresh.
- **Workaround:** CLAUDE.md "Project control" (added by the handover package) overrides these steps:
  create branches with `git branch <new> origin/main`, commit through a temporary index or work in a
  worktree; never `checkout` or `switch` in the OneDrive folder.
- **Suggested fix:** rewrite both docs with the OneDrive-safe branch procedure; decide again once
  OneDrive is healthy (TASK-017).
- **Related:** R6, E10; TASK-017.

### E8. `docs/HANDOVER.md` and the inbox README still list Fund Risk Ratios and NAV Data as files to send
**P2 · Open · Affects the next desk request**

- **What (found 28-Oct-2026 during the MOD-01 handover reconstruction):** `docs/HANDOVER.md` §5
  (`:44`; the file is unchanged since `0afaf69`, 16-Oct-2026) lists "risk ratios" among the desk or
  vendor workbooks. `monthly-updates/00_INBOX/README.md:58` (row 12, `Fund Risk Ratios & 3Y
  Rolling`) and `:60` (row 17, `NAV Data`, optional) list both as files to drop, with no B8 caveat.
  B8 found that both were made in-house and now have no producer; `docs/INPUT_FILES.md` and
  `docs/MONTHLY_UPDATE_PROCESS.md` were corrected in `11d5c0a` (PR #28).
- **Impact:** the owner or a new maintainer could ask the desk for files the desk never made, and miss
  that the October risk matrix has no producer.
- **Who sees it:** the owner, maintainers and the desk.
- **Suggested fix:** mark rows 12 and 17 "made in-house; no producer (B8)" in both files, and leave
  them out of desk requests.
- **Related:** B8, C11, C35.

### E9. The skill says Reckoner-cycle tools exit 1 on a missing file
**P3 · Open · —**

- **What (found 28-Oct-2026 during the MOD-01 handover reconstruction):**
  `.claude/skills/monthly-update/SKILL.md:39-40` says the Reckoner-cycle tools "crash with exit 1 on
  a missing file". Since PR #19 (`699978b`, 21-Oct-2026) every tool exits 2 on a missing source or
  `--html` path (`tools/merge_reckoner.js:29`, `:45-46`); re-run on 30-Oct-2026 with a missing deck:
  exit 2.
- **Impact:** an operator could read an exit 1 (a failed gate) as a missing file, or look for a
  `GATE` line after an exit 2.
- **Who sees it:** whoever runs the refresh.
- **Suggested fix:** a one-line correction in SKILL.md.
- **Related:** A2, D72.

### E10. OneDrive guidance assumes a state that does not hold, and omits the checkout hazard
**P3 · Open · —**

- **What (found 28-Oct-2026 during the MOD-01 handover reconstruction):**
  `docs/DEVELOPMENT_SETUP.md:46`, `docs/MONTHLY_UPDATE_PROCESS.md:28`, `docs/HANDOVER.md` §8 (`:70`)
  and `docs/PROJECT_STATE.md:234` (at `2b2a397`) present "Always keep on this device", with OneDrive
  running, as the working state. On 28-Oct and 30-Oct-2026 OneDrive.exe was not running, the folder
  was not pinned and 229 `.git` files were cloud-only (R6). None of these pages says that a
  `git checkout` can truncate tracked files.
- **Impact:** a reader assumes the folder is safe for git and tool runs.
- **Who sees it:** the owner and maintainers.
- **Suggested fix:** state the precondition (OneDrive running, folder pinned, no offline `.git`
  files) and the no-checkout rule, and check it before every refresh (TASK-017).
- **Related:** R6, R11, E7.

### E11. `docs/TESTING.md` names the rehearsal worktree `C:/t/cpp-old`; the real one is in `%TEMP%`
**P3 · Open · —**

- **What (found 28-Oct-2026 during the MOD-01 handover reconstruction):** `docs/TESTING.md:100-110`
  documents `git worktree add --detach C:/t/cpp-old main` and its removal. The worktree actually left
  registered is `%USERPROFILE%\AppData\Local\Temp\cpp-old` (detached at `bf20c08`, created
  16-Oct-2026 for the PR #3 rehearsal; `git worktree list`, 30-Oct-2026).
- **Impact:** a maintainer following the doc removes a path that does not exist and leaves the real
  worktree behind.
- **Who sees it:** maintainers.
- **Suggested fix:** remove the real worktree with `git worktree remove` and `git worktree prune`
  (never `checkout`/`switch`); make TESTING.md tell the reader to note the path used.
- **Related:** E12; DEC-OPEN-22, TASK-061.

### E12. Release docs prescribe `gh pr merge --delete-branch`; practice since PR #7 does not use it
**P3 · Open (owner decision) · —**

- **What (found 28-Oct-2026 during the MOD-01 handover reconstruction):**
  `.claude/agents/release-manager.md:24`, `.claude/skills/monthly-update/SKILL.md:69` and
  `docs/MONTHLY_UPDATE_PROCESS.md:246` say `gh pr merge <PR> --merge --delete-branch`. Only PRs
  #1–#3 were merged with it (PR #7 passed `--delete-branch=false`; later merges passed nothing;
  checked in the session transcripts), and the repository's `delete_branch_on_merge` is false, so
  the 25 merged feature branches remain on `origin` (26 branches with `main`, `gh api`,
  30-Oct-2026).
- **Impact:** docs and practice disagree; the branch list keeps growing.
- **Who sees it:** maintainers.
- **Decision (owner):** which is the rule from now on, and whether to delete the 25 (DEC-OPEN-22).
  Changing `delete_branch_on_merge` is a repository setting: only on the owner's explicit
  instruction.
- **Related:** R9, D68; DEC-OPEN-22, TASK-059.

### E13. Stale records in `docs/PROJECT_STATE.md`
**P3 · Open · —**

- **What (found 28-Oct-2026 during the MOD-01 handover reconstruction), at `2b2a397`:**
  - the PR #23 row gives its merge as "—" (`:170`); it is `1523bbc`;
  - "Latest merge: PR #26" (`:119`); the latest is PR #28, `2b2a397` (docs only);
  - the "Latest verification" lead is dated 21-Oct-2026 (`:48`); `verify_page.js` and `npm test` were
    re-run on 28-Oct-2026 with the same counts;
  - step 3a says no-band instruments count as 0% "in the tile, Future Value and the deck"
    (`:240-242`); the deck leaves them out (C24, corrected);
  - step 3c says "the 12 stale mid-points" (`:246`); C28 counts 14.

  The handover package's own edit of `docs/PROJECT_STATE.md` rewrites step 3a; the others remain.
- **Impact:** a successor reads a wrong state.
- **Who sees it:** the owner, MOD-02 and maintainers.
- **Suggested fix:** correct them in the docs-consistency change.
- **Related:** A27, C24, C28.

### E14. `docs/DEPLOYMENT.md`: the live check covers 6 of the 7 published files; other gaps
**P3 · Open · —**

- **What (found 28-Oct-2026 during the MOD-01 handover reconstruction):**
  - the live-check loop (`docs/DEPLOYMENT.md:44-49`) hashes the six deploy files, but seven are
    published (`robots.txt` too; `publish` uploads all of `site/`);
  - the release diagram (`:14-24`) shows `verify` as "six files present + verify_page parity gate";
    the job also runs `npm ci` and the unit tests (`.github/workflows/pages.yml:43-46`);
  - `:10` frames the old site's retirement as the outgoing owner's act and omits the owner's
    condition: retire it only after full testing of the new build (R7).
- **Impact:** a release can be "confirmed" with `robots.txt` unchecked; a reader underestimates the
  gate; the retirement condition is in no deployment document.
- **Who sees it:** whoever releases; the owner.
- **Suggested fix:** add `robots.txt` to the loop, complete the diagram, and record the retirement
  condition (with R7 and DEC-OPEN-24).
- **Related:** R7, D63, D78; TASK-074.

### E15. `docs/ARCHITECTURE.md`: stale line references; the bake's capture of load-time mutations is not described
**P3 · Open · —**

- **What (found 28-Oct-2026 during the MOD-01 handover reconstruction):**
  - `docs/ARCHITECTURE.md:44-46` place siblings 3–5 at L5167–5169 (now `site/index.html:5525-5527`)
    and `:49` the risk matrix at L5175 (now `:5533`); the region table (`:31-32`) gives `window.H` as
    ~L1446–2906 and `window.REFRESH` as ~L3154–3921 (now ~L1446–2928 and ~L3177–3944; the same
    document's line map at `:66-68` is right);
  - the document does not say that `tools/bake_month.js` runs every inline block, including
    `linkIdcwToGrowth()` and `applyPmsPerformance()`, and writes the resulting MASTER back, so 35
    baseline MASTER records carry `_pms_source` [inference, strong: the counts were re-checked on
    30-Oct-2026].
- **Impact:** navigation errors; a maintainer may not expect PMS/AIF overlay fields inside the baked
  MASTER.
- **Who sees it:** maintainers.
- **Suggested fix:** refresh the line references (with grep patterns) and add a short "what the bake
  captures" note.
- **Related:** C1, C28, E1, D55.

### E16. Project knowledge held only outside the repository
**P2 · Open · —**

- **What (found 28-Oct-2026 during the MOD-01 handover reconstruction):** procedures and traps that
  sessions relied on are recorded only outside the repo:
  - the Claude Code memory notes (`%USERPROFILE%\.claude\projects\<project slug>\memory\`, 5 files):
    the temporary-index commit method (`GIT_INDEX_FILE`), writing scripts to files instead of passing
    escapes through heredocs or `node -e`, `gh repo set-default` to `origin`, and "fetch first and
    list the sessions";
  - the desktop app's side-session notes for MOD-01
    (`%USERPROFILE%\AppData\Local\Claude-Data\<profile>\side-session-notes\local_11e29451-...\`,
    3 files): `tools/dev/rehearse.js` needs a root path shorter than 260 characters or every step
    returns `exit=null`; the deck code of PR #26 was written in `%TEMP%\x\pptx_section.js` and spliced
    in with `%TEMP%\x\splice.js`; a localhost receiver (`%TEMP%\x\receiver.js`, port 8099) got
    exported decks out of the browser pane.
- **Evidence:** file listings on 30-Oct-2026; on 28-Oct-2026 `git grep` found no `GIT_INDEX_FILE`,
  `set-default` or `8099` in the repo (the handover package now covers part of this).
- **Impact:** a new chat or maintainer without this Windows profile loses the procedures. Moving the
  clone out of OneDrive (DEC-OPEN-19) would also orphan the memory folder, which is keyed to the
  project path [inference].
- **Who sees it:** future chats and maintainers.
- **Suggested fix:** move the procedures into the repo docs (OPERATING_MANUAL, TESTING,
  DEVELOPMENT_SETUP).
- **Related:** E10, R6, R11; DEC-OPEN-19, TASK-071, TASK-037.

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

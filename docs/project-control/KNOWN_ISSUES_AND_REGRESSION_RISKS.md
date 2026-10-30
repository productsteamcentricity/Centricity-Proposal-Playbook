# Known issues and regression risks

| Field | Value |
|---|---|
| Version | 1 |
| Date | 28-Oct-2026 |
| Author chat | MOD-01 (for MOD-02 and ARC-01) |
| Status | Sections 1-3: Historical snapshot (index of `docs/KNOWN_ISSUES.md` at `2b2a397`); section 4: Authoritative (regression-risk catalogue) |
| Supersedes | none (first version) |
| Next review | after the merge of `handover/mod-01-to-mod-02-20261028` (re-count section 1); then after every merge that adds or closes a KNOWN_ISSUES item or changes a gate or test |

**Which file is authoritative for what.** [`../KNOWN_ISSUES.md`](../KNOWN_ISSUES.md) is the single register of
defects: IDs, severity, status, evidence and fixes live there and only there. Sections 1-3 below are a dated index
into it, so a reader can find the open items quickly; when they disagree, `KNOWN_ISSUES.md` wins. Section 4, the
regression-risk catalogue, has no other home: it is authoritative here. The Guardian (ARC-01) uses it in every
review ([`../handover/CODEBASE_GUARDIAN_HANDOVER_2026-10-28_v1.md`](../handover/CODEBASE_GUARDIAN_HANDOVER_2026-10-28_v1.md)).

Severity (from `KNOWN_ISSUES.md`): **P1** wrong or misleading data could reach a client-facing page, deck or
workbook; **P2** operational (a step can fail, be blocked or need manual care) or latent; **P3** cosmetic or
documentation only.

---

## 1. Snapshot of `docs/KNOWN_ISSUES.md` at `2b2a397` (28-Oct-2026)

VERIFIED: a Node parse of the Summary table (93 rows) on 28-Oct-2026, matching two independent counts in the
handover fact sheets. Re-count the rows with `grep -c '^| [A-Z][0-9]* |' docs/KNOWN_ISSUES.md` (93 at `2b2a397`).

| Status (as written in the Summary table) | P1 | P2 | P3 | no severity | Total |
|---|---|---|---|---|---|
| Open (incl. "Open (desk)", "Open (owner decision)", "Open (outgoing owner)", "Open (owner + compliance)") | 4 | 18 | 21 | 0 | **43** |
| Partly fixed | 0 | 9 | 3 | 0 | **12** |
| Fixed (C19: code and data; follow-ups remain) | 1 | 0 | 0 | 0 | **1** |
| Accepted (C12, R2, R4, E1) | 0 | 2 | 2 | 0 | **4** |
| Closed | 4 | 17 | 10 | 2 | **33** |
| **Total** | **9** | **46** | **36** | **2** | **93** |

By group (Open / Partly fixed / Accepted / Fixed / Closed): A tools 1/8/0/0/19 - B inputs 6/2/0/0/1 - C data, UI, code
30/0/1/1/8 - R repo, security, hosting 4/0/2/0/2 - E docs 2/0/1/0/2 - F small leftovers 0/2/0/0/1. Highest IDs at
`2b2a397`: A28, B9, C40, R8, E5, F3.

### 1.1 Entries added by this package (28-Oct-2026)

The handover package adds 22 entries to `KNOWN_ISSUES.md` (all new on 28-Oct-2026, status Open) and dated corrections
to C24, C17, B8, B1, R6, R7, A2, C39, C28, C1, R5, C10, C12, E2 and C20. Their sections are written in
`KNOWN_ISSUES.md`; find each with `grep -n "^### <ID>\." docs/KNOWN_ISSUES.md`.

| ID | Sev | One line |
|---|---|---|
| A29 | P2 | Two PMS/AIF holdings parsers (page `REFRESH.parsePMSHoldings` and `tools/merge_pms_aif_analytics.js`); whether their outputs agree is UNKNOWN |
| A30 | P2 | A sibling that fails inside its try/catch only logs `console.error`: `verify_page` and CI count no script error |
| A31 | P2 | Two CLAUDE.md invariants (top-10 Direct Equity "Large Cap"; `DATA_DATES.sif` not "-") are not enforced by `verify_page` or CI |
| C41 | P2 | PMS/AIF benchmark rows (screen, Excel, deck) read the static `PMS_BENCHMARK_PERF` (last changed 20-May-2026); the monthly `PMS_PERFORMANCE.benchmarks` is never read |
| C42 | P2 | 12 RISK_MATRIX keys are unreachable (rows the SIF sibling removes); 0 of 30 effective SIFs has a risk row; the tool checks keys against the baseline MASTER |
| C43 | P1 | `UTI BSE India Sector Leaders ETF` carries `si` = 2977.646 (297,765%); the MF bake has no `si` bound; shown on screen, in Excel and in the deck |
| C44 | P3 | Construct and Net Asset Allocation slides draw tables with `slide.addTable` at fixed geometry instead of `drawTable` |
| C45 | P2 | `listTable` analytics tables draw only `pages[0]`; a second page would vanish without a layout warning (latent) |
| E6 | P3 | Docs call the siblings "idempotent-guarded" by the `__..._APPLIED` flags; the flags are write-only markers |
| E7 | P2 | The `monthly-update` skill and `MONTHLY_UPDATE_PROCESS.md` still say `git switch` (R6 hazard) |
| E8 | P2 | `docs/HANDOVER.md` section 5 (risk ratios) and the inbox README (Fund Risk Ratios, NAV Data) still list in-house files as desk files (B8) |
| E9 | P3 | The skill says Reckoner tools exit 1 on a missing file; every tool exits 2 since PR #19 |
| E10 | P3 | OneDrive guidance presents "Always keep on this device + OneDrive running" as the working state; neither holds on 28-Oct |
| E11 | P3 | `docs/TESTING.md` documents the rehearsal worktree at `C:/t/cpp-old`; the real leftover is `%USERPROFILE%\AppData\Local\Temp\cpp-old` |
| E12 | P3 | Release docs prescribe `gh pr merge --delete-branch`; no merge since PR #7 used it |
| E13 | P3 | Stale records in `docs/PROJECT_STATE.md` (PR #23 merge, "latest merge", verification lead, C24 wording, mid-point count) |
| E14 | P3 | `docs/DEPLOYMENT.md`: live check hashes 6 files (7 are published); diagram omits the unit tests; retirement condition missing |
| E15 | P3 | `docs/ARCHITECTURE.md` stale line references; no mention that the bake captures load-time mutations |
| E16 | P2 | Project knowledge held only outside the repo (memory notes, desktop-app side-session notes) |
| R9 | P2 | `main` has no branch protection and no rulesets; any merge publishes |
| R10 | P2 | `%TEMP%\x\ref.pptx` is INFERRED to be a copy of the client reference deck; local, outside the repo; the owner decides |
| R11 | P2 | Single local copies with UNKNOWN cloud backup (B8 toolchain, `_testdata/`, `%TEMP%\x\`, `monthly-updates/`, `backups/`) |

Expected counts after the package merge (INFERRED: assumes all 22 rows are added as Open): 115 rows; Open 65
(P1 5, P2 30, P3 30). MOD-02 re-counts in TASK-016 and corrects this line if it differs.

---

## 2. Open P1 items (one line each)

| ID | One line | Status | Covered by | Section |
|---|---|---|---|---|
| B8 | NAV Data (#17) and Fund Risk Ratios & 3Y Rolling (#12) were made in-house; nobody builds them now; **blocks the Oct-2026 Portfolio Matrix** | Open (owner decision) | DEC-OPEN-01, -02, -03; TASK-022 | [B8](../KNOWN_ISSUES.md#b8-nav-data-and-fund-risk-ratios-were-made-in-house-nobody-builds-them-now) |
| C20 | 12 JioBlackRock Regular records show Direct-plan returns from before their launch (13 with the held G-Sec record, C16) | Open (owner decision) | DEC-OPEN-07; TASK-023 | [C20](../KNOWN_ISSUES.md#c20-jioblackrock-regular-records-show-direct-plan-returns-from-before-their-launch) |
| R1 | Client personal data still public in the outgoing owner's repository history and old site | Open (outgoing owner) | DEC-OPEN-13; TASK-033 | [R1](../KNOWN_ISSUES.md#r1-client-pii-still-public-in-the-outgoing-owners-repo-and-site) |
| R8 | The outgoing owner's export shipped two client items (kept local, git-ignored) | Open (owner + compliance) | DEC-OPEN-05; TASK-032 | [R8](../KNOWN_ISSUES.md#r8-the-handover-export-shipped-two-client-items-despite-its-readme) |
| C43 | Since-inception outlier `si` = 2977.646 on one young ETF (new 28-Oct) | Open | TASK-067 | `grep -n "^### C43\." docs/KNOWN_ISSUES.md` |

Also P1 but Fixed with follow-ups: [C19](../KNOWN_ISSUES.md#c19-215-funds-on-four-unmapped-monitor-sheets-carry-pre-september-performance)
(215 funds on four unmapped Monitor sheets; code PR #17, data PR #18; one record held for C20; read the new bake lines
every refresh).

---

## 3. Open and partly fixed P2 items (one line each)

### 3.1 Open P2 (18 at `2b2a397`; the 12 new P2 entries are in section 1.1)

| ID | One line | Status | Covered by | Section |
|---|---|---|---|---|
| B1 | PMS performance is 31-Jul-2026 data under the "31st August 2026" label; **blocks the PMS step** | Open (desk) | DEC-OPEN-04; DESK-01; TASK-025, TASK-020 | [B1](../KNOWN_ISSUES.md#b1-no-pms-performance-file-transferred-pms-is-31-jul-2026-data-under-a-31-aug-2026-label) |
| B4 | Sep-2026 analytics workbooks carry no SIF holdings | Open (desk) | DESK-05 | [B4](../KNOWN_ISSUES.md#b4-sep-analytics-workbooks-carry-no-sif-holdings) |
| B5 | Fund-manager data stops at 31-Aug-2026 | Open (desk) | DESK-03 | [B5](../KNOWN_ISSUES.md#b5-fund-manager-data-stops-at-31-aug-2026) |
| B6 | PMS/AIF look-through stops at 31-Jul-2026 | Open (desk) | DESK-04 | [B6](../KNOWN_ISSUES.md#b6-pmsaif-look-through-stops-at-31-jul-2026) |
| C1 | Siblings 3-5 not folded into the page (six-file deploy; = DECISIONS D2 Open) | Open | TASK-045 | [C1](../KNOWN_ISSUES.md#c1-siblings-35-not-folded-into-the-page) |
| C4 | Mosaic Multiyield Series I keeps a Select badge; Series II not in MASTER | Open (desk) | DESK-12; DEC-OPEN-11; TASK-029 | [C4](../KNOWN_ISSUES.md#c4-mosaic-multiyield-series-i-keeps-a-select-badge) |
| C5 | Motilal Oswal Gift City India Equity Fund - Inbound is very likely an existing record under a new deck label | Open (desk, then a pin) | DESK-11; DEC-OPEN-11; TASK-029 | [C5](../KNOWN_ISSUES.md#c5-motilal-oswal-gift-city-india-equity-fund--inbound-very-likely-our-existing-record-under-a-new-deck-label) |
| C8 | Five SIFs have no look-through | Open (desk) | DESK-05 | [C8](../KNOWN_ISSUES.md#c8-five-sifs-have-no-look-through) |
| C11 | Rf = 4.5% unconfirmed; it drives the live risk matrix (= DECISIONS D58 Open) | Open (desk) | DEC-OPEN-02; DESK-15 | [C11](../KNOWN_ISSUES.md#c11-rf--45-to-re-confirm-with-the-desk) |
| C15 | Fund-manager roster overwritten by the Sep bake (first-named manager only) | Open (desk) | DESK-03 | [C15](../KNOWN_ISSUES.md#c15-fund-manager-roster-overwritten-by-the-sep-bake) |
| C23 | Select popover Alpha shown 100 times too large | Open (desk: period) | DESK-14; DEC-OPEN-12; TASK-030 | [C23](../KNOWN_ISSUES.md#c23-select-popover-alpha-shown-100-times-too-large-source-confirmed) |
| C24 | Headline weighted IRR counts instruments with no IRR band as 0% (three screen paths; Section 4 and the deck GRAND TOTAL exclude them, per the 28-Oct correction) | Open (owner; desk IRR file) | DEC-OPEN-15; DESK-06; TASK-026 | [C24](../KNOWN_ISSUES.md#c24-headline-weighted-irr-counts-instruments-with-no-irr-band-as-0) |
| C28 | Expected returns stored as track record (bond yields, AIF/PMS band mid-points; 14 stale mid-points); deck marks them `*` (D83) | Open (owner/desk) | DEC-OPEN-16; TASK-031 | [C28](../KNOWN_ISSUES.md#c28-expected-returns-are-stored-as-track-record-bond-yields-aifpms-band-mid-points) |
| C35 | Sortino has two definitions in the live history (June semi-deviation; Aug/Sep textbook) | Open (owner/desk) | DEC-OPEN-03; DESK-16; TASK-022 | [C35](../KNOWN_ISSUES.md#c35-sortino-has-two-definitions-in-the-live-history-and-a-third-route-uses-another) |
| C37 | Bonds store the top of the IRR band as 1Y/3Y/5Y; the owner asked for the band average | Open (owner decision) | DEC-OPEN-09; TASK-027 | [C37](../KNOWN_ISSUES.md#c37-bonds-store-the-top-of-the-irr-band-as-1y3y5y-the-owner-asked-for-the-band-average) |
| R6 | The git repository lives inside OneDrive (cloud-only `.git` files; checkout hazard; EPERM on rename) | Open (owner decision) | TASK-017; DEC-OPEN-19; TASK-037 | [R6](../KNOWN_ISSUES.md#r6-the-git-repository-lives-inside-onedrive) |
| R7 | Old site still live alongside the new one (retire only after full testing of the new build) | Open (outgoing owner) | DEC-OPEN-14, DEC-OPEN-24; TASK-034 | [R7](../KNOWN_ISSUES.md#r7-old-site-still-live-alongside-the-new-one) |
| E3 | Runbooks and specs are out of date | Open | TASK-054 | [E3](../KNOWN_ISSUES.md#e3-runbooks-and-specs-are-out-of-date) |

### 3.2 Partly fixed P2 (9)

| ID | What is left | Covered by | Section |
|---|---|---|---|
| A7 | Two DIRECT_PERF builders (page Section 7 Direct uploader vs `tools/lib/direct_perf.js`) | TASK-039 | [A7](../KNOWN_ISSUES.md#a7-two-direct_perf-builders-unchecked-splice-in-rebuild_directperfjs) |
| A14 | Direct Equity universe joins by name only; no `prev_name` stamp; warning does not fail | TASK-044; DESK-24 | [A14](../KNOWN_ISSUES.md#a14-de-universe-joins-by-name-only-industry-never-written) |
| A19 | AIF merge: deck-order scan, no AIF as-on date, MASTER-AIF gate cannot fail | TASK-040 | [A19](../KNOWN_ISSUES.md#a19-aif-performance-merge-carries-data-forward-silently) |
| A20 | `add_reckoner_funds.js` `ADD` list hard-coded; PMS additions keep non-schema keys | TASK-041 | [A20](../KNOWN_ISSUES.md#a20-add_reckoner_fundsjs-hard-coded-deck-facts-re-adds-a-dropped-gift-city-fund) |
| A22 | Python risk-matrix route not validated for production | TASK-057; DEC-OPEN-01 | [A22](../KNOWN_ISSUES.md#a22-python-risk-matrix-route-unvalidated-and-unguarded) |
| A23 | `verify_page.js` compares no counts with a baseline; protocol-relative `src`; lazy script regex | TASK-042 | [A23](../KNOWN_ISSUES.md#a23-verify_pagejs-and-the-vm-tools-hide-real-errors) |
| A24 | `tools/lib` parsing hazards (`pptx.js`, `reck_parse.js` unguarded write, `reck_narrative.js`) | TASK-043 | [A24](../KNOWN_ISSUES.md#a24-shared-libraries-latent-parsing-hazards) |
| A25 | Invisible characters that must survive any edit; stale `.gitattributes` comment | TASK-056 | [A25](../KNOWN_ISSUES.md#a25-invisible-characters-that-must-survive-any-edit) |
| B2 | Sep-2026 Reckoner deck filed (archive copy); "October 2026" deck still missing; **blocks the Reckoner and AIF steps** | DESK-02; TASK-020 | [B2](../KNOWN_ISSUES.md#b2-live-sep-2026-reckoner-deck-not-in-the-pack) |

### 3.3 Accepted P2 (2)

[R2](../KNOWN_ISSUES.md#r2-public-repo-and-site-robotstxt-ineffective) public repository and site (D60; `noindex`
added; DEC-OPEN-18) - [R4](../KNOWN_ISSUES.md#r4-xlsx-0185-has-two-high-severity-advisories) `xlsx` 0.18.5 advisories
(pinned for parity; upgrade only on the owner's instruction, TASK-058).

### 3.4 Items marked for the next refresh

- **Blocks:** B1 (PMS step), B2 (Reckoner and AIF steps), B8 (Oct-2026 Portfolio Matrix).
- **Affects:** A6 (8 renames await the owner, DEC-OPEN-08), A14, A18 (pins still by hand), A19, A20, B4, B5, B6, C4,
  C5, C8, C15, C19 (read the new bake lines), C35, R6, E3.

---

## 4. Regression-risk catalogue (authoritative)

How to read it: for each area, what a change could break, how the break would show, which gate or test catches it
today, what no gate catches (the coverage gap), and what to do about it. "CI" = the `verify` job of
`.github/workflows/pages.yml` (six-file presence check, `npm ci` + `node tools/test/run.js`, `node tools/verify_page.js
site` with exact-line greps). Gates and test counts are as of `2b2a397` (VERIFIED by the handover fact sheets and by
reading `tools/verify_page.js:90-96` and `pages.yml:37-61`). `site/index.html` lines are `~` values that drift.

| # | Area | What can regress | How it would show | Gate or test that catches it today | Coverage gap | Mitigation |
|---|---|---|---|---|---|---|
| 1 | Six-file deploy and sibling load order | `index.html` changed or deployed without its siblings; data a sibling owns changed in the block instead of the sibling; script tags reordered (June -> IRR/Offshore -> SIF) or a sibling loaded before `window.REFRESH` (~L3942) | GIFT City, IRR bands, SIF rows, 12 PMS/AIF look-throughs or `DATA_DATES.sif` silently revert at load; MASTER effective count moves from 7,682; Section 7 SIF card loses its parser | CI "Six-file deploy set is present" (`test -s` on 6 files); `verify_page` `MISSING SIBLING` (exit 1) and effective counts; the publish job uploads the whole `site/` from `main`, so a partial deploy through CI is impossible | no check of script order; effective counts are not compared with a baseline (A23); a sibling failing inside its try/catch is invisible to `verify_page` and CI (A30); a change made in the block instead of the owning sibling passes every gate | CLAUDE.md rule 1; D1; ARC-01 checks the owning sibling was edited; browser console check (TESTING.md section 3 check 1); TASK-042 (A23, A30); TASK-045 (fold siblings, C1; never inside a refresh) |
| 2 | Data blocks and `blocklib` writes | a second literal with a tool-written prefix; a non-JSON or hand-broken literal; a write that bypasses `blocklib`; a partial two-file write; `index.html` no longer ending `</html>` | a tool refuses (`locate`: "N literal occurrences - refusing to guess"); page fails to load; `verify_page` script error or `file ends </html> no` | `blocklib.locate` uniqueness and strict JSON; `writeBlocks` / `writeFilesAtomic` `</html>` guard; `blocklib.test.js` (34 checks, incl. byte-identical splice and the OneDrive retry); `verify_page` and CI `</html>` and script-error greps | two-file writes are two renames, not one transaction; hand-edited blocks (`BENCHMARKS`, `RATIONALE`, `LIQUIDITY_MAP`, `AMC_PREFIXES`, `PMS_AIF_TERMS`, `var OFFSHORE`, `PMS_BENCHMARK_PERF`) have no gate beyond the page loading | back up the six files to `backups/<date>_<tag>/` before any `--apply`; restore from the backup to undo; all data writes through `tools/lib/blocklib.js` (CLAUDE.md rule 2); ARC-01 flags any write that does not use it |
| 3 | Scale conventions | percent stored where a decimal is expected (or the reverse); scale auto-detected; DIRECT_PERF off MASTER's scale; RISK_MATRIX percent points read as decimals | returns or ratios 100 times too large or small on screen, in Excel and in the deck (precedents: SIF parser showed 100x before the fixed /100 rule; C23 alpha) | page parsers divide Monitor and SIF values by 100 unconditionally; SIF parser rejects results beyond +-1000%; SIF bake +-300% bound; `rebuild_directperf` scale gates; `financial-data-reviewer` (manual) | no value-range check in `verify_page` or CI; the MF bake has no `si` bound (C43: 2977.646 live); PMS/AIF holdings `Holding(%)` heuristic in `parsePMSHoldings` | CLAUDE.md rule 4 (MASTER decimals; analytics percent; Monitor and SIF Monitor always /100, never auto-detect); `financial-data-reviewer` on every data change; TASK-067 (an `si` gate) |
| 4 | Renames and identity matching | renames applied after the bake; a rename that misses a store; identity (inception + AMC, D46) misjudged; shared links to renamed funds | duplicate MASTER names; Centricity Select keys missing from MASTER; analytics, risk or IRR band lost for a renamed fund; orphan keys | `verify_page` 0 duplicates and the Select-in-MASTER canary (both CI hard gates); `rename_schemes.js` gates; bake duplicate-name gate; `H.resolveFundName` for links (C14 closed) | `rename_schemes.js` does not re-key `PMS_PERFORMANCE`, `PMS_PERF_ALIAS`, `PMS_AIF_TERMS`, `var SIF`, `NEW_GIFT`, `OFFSHORE`, `var EQ` or `tools/data/pins.json` (INFERRED from the interfaces ripple list); RISK_MATRIX keys are checked against the baseline, not the effective MASTER (C42); 8 renames pending | rename before every bake (CLAUDE.md rule 7); ambiguous renames go to the owner (rule 5; DEC-OPEN-08, TASK-024); a manual plan for the stores above; TASK-066 |
| 5 | Reckoner and PMS pins, name joins | a pin pointing at the wrong scheme; a trailing-space mismatch; a vendor rename breaking pins; Reckoner deck drops; an unmapped deck heading | another manager's numbers on a client fund; a Select badge lost; "MASTER PMS with perf 23 of 27" falls | `merge_reckoner.js` drop gates (D71, D76; `--accept-drops` only by the owner); pins loaders exit 1 on an edge-space mismatch; byte-exact names; `verify_page` prints PMS-with-perf (not a hard gate) | PMS-with-perf count not gated in CI; `merge_pms_aif_analytics.js` "every mapped key is a MASTER PMS/AIF record" only prints; A19 MASTER-AIF gate cannot fail; A20 hard-coded `ADD`; two PMS/AIF holdings parsers (A29); C5 pin pending | report, never guess (CLAUDE.md rule 5); pins only with the owner (D75); TASK-040, TASK-041, TASK-068, TASK-029 |
| 6 | Risk matrix, Sortino and Rf | Rf changed silently; Sortino definition switched; risk route switched (Python vs Node, D43); `fl` flags lost; `DATA_DATES.riskMatrix` not advanced; keys unreachable | Portfolio Matrix values shift on screen and in the deck; dagger notes missing; the matrix note "rf 4.5%" no longer true; the Oct matrix keeps "30 Sep 2026" | `merge_risk_matrix.js` gates (keys in baseline MASTER, `fl` added, short `--as-on` label via `checkAsOn`, `</html>`); rehearsal case `mf-chain-sep` includes `merge_risk_matrix.js` (local only) | no producer for the input workbooks (B8, P1); Rf 4.5% unconfirmed (C11, D58); two Sortino definitions (C35); Python route unvalidated (A22); 12 unreachable keys and 0 SIF risk rows (C42); `RISK_MATRIX_BENCH_SD` stale (C10); no test reproduces the live RISK_MATRIX from its inputs | decide DEC-OPEN-02 and -03, then -01, before any port; TASK-022 with a Sep-2026 regression test; TASK-066; `financial-data-reviewer` |
| 7 | PowerPoint design system (D82) | fixed rows, row heights or note positions reintroduced; a table past the footer; a row, column or GRAND TOTAL dropped; `autoPage` used; cells drawn without margins; `DS` constants changed without `check_pptx_bounds.js` | content past the 7.08 in footer line; clipped tables; missing totals or page numbers; `[pptx layout]` console warnings | `pptx_layout.test.js` (798 checks in CI: 7 rule-picked portfolios, every instrument once, GRAND TOTAL on every Investment Option page, frame bounds); `window.__PPTX_LAYOUT.warnings` after a browser export (manual); `tools/dev/render_pptx.ps1` + `check_pptx_bounds.js` (manual, Windows + PowerPoint) | CI checks the geometry the export requested, not PowerPoint's own wrap; `listTable` draws only `pages[0]` (C45); Construct and Net Asset Allocation bypass `drawTable` (C44); chart internals (label overlap) unchecked; low-density slides keep blank areas (REQ-PPT-04, -62) | OPERATING_MANUAL "The deck is laid out by measurement"; CLAUDE.md rule 10; render and bounds-check before merge for any visible change; `check_pptx_bounds.js:18` `FOOT = 7.08` changes with `DS.FOOT - DS.STAMP_H`; TASK-069 |
| 8 | Excel export | a sheet missing or renamed; rows in the wrong performance bucket; benchmark rows; dates or percent formats | fewer than 13 sheets; wrong values; Excel offers to repair the file | none automated; manual browser check (TESTING.md section 3 check 6: 13 sheets, corpus in B2) through an in-page `XLSX.writeFile` intercept | no test calls `exportXlsx` (VERIFIED: no reference under `tools/test/`); the workbook has never been opened in Microsoft Excel (REQ-019); Excel buckets differ from screen and deck (C29); benchmark rows static (C41); `xlsx` 0.18.5 advisories (R4) | browser Excel export for every change near `exportXlsx` / `perfRows`; TASK-064 (open it in Excel); no task covers an automated Excel test yet (next free ID TASK-075 if the Moderator registers one) |
| 9 | `REFRESH` parsers and bake = upload coupling | a page parser edit silently changes the next bake; a new or renamed Monitor sheet; refresh-only sheets; IST date off by one | current-dated labels over stale figures (C19 precedent: 215 funds on four unmapped sheets); bake counts change | `parser_refresh_only.test.js` (18, CI); `bake_month.js` "fund rows on unrecognised Monitor sheets" gate (exit 1); `dates.test.js`; `rehearse.js --old-site` (manual, A27) | the rehearsal is local only (needs `monthly-updates/` and a root path shorter than 260 characters, E16) and not in CI; `SHEET_MAP` and `rename_schemes.js` `SHEET_SUB` must be kept equal by hand (43 = 43 on 28-Oct) | ARC-01 requires rehearsal evidence for any parser or load-time code change (TESTING.md section 2.3); D80 |
| 10 | Single predicates and duplicated logic | a re-inlined hybrid, SIF or debt test; a new copy of the performance buckets, a parser, the name index or the expected-return rule | SIF funds silently missing from analytics (precedent before `H.isHybridScheme` was shared); totals that differ between screen, Excel and deck (C24, C29) | none automated (review only) | C24 (one headline return computed two ways in five places); C29 (buckets x3); A7 (two Direct-plan parsers); A29 (two PMS/AIF holdings parsers); `merge_reckoner.js` mirrors `H.buildFundIndex` | CLAUDE.md rule 8; ARC-01 greps for re-inlined tests; TASK-026 (after DEC-OPEN-15), TASK-046, TASK-039, TASK-068 |
| 11 | `DATA_DATES` labels and "as on" stamps | a label advanced without the data (or the reverse); wrong long/short style; `DATA_DATES.sif` left as "-"; PMS label ahead of its data | wrong "as on" on screen, Excel sheets and deck footers | `blocklib.checkAsOn`; `setDataDate` exactly-one-match; `merge_sif_monitor.js` date gates; `merge_risk_matrix.js` `replaceOnce`; `verify_page` prints `DATA_DATES` (no gate) | `DATA_DATES.sif` not "-" is not enforced in CI (A31); no freshness check; B1 (31-Jul data under "31st August 2026") | TASK-042 (A31); TASK-025 (B1, DEC-OPEN-04) |
| 12 | Client-facing values with no writer | static literals going stale while the page says "as on" a current date | PMS/AIF benchmark rows on screen, in Excel and in the deck show old values (C41: NIFTY 50 TRI 1M 0.075 static vs -0.011 in the monthly block) | none | `PMS_BENCHMARK_PERF` and `PMS_BM_FOR_SUB` (no tool writes them; last changed 20-May-2026); `RISK_MATRIX_BENCH_SD` (C10) | DEC-OPEN-27; TASK-065; a refresh must not claim these were updated |
| 13 | `verify_page.js` and CI | a `verify_page` label or padding changed without `pages.yml`; a hard failure removed; workflow permissions widened; action pins changed; a merge without a green run | CI red for the wrong reason, or a defect passing a vacuous grep | CI itself; `tool_inputs.test.js` fails when a new tool has no case; actions pinned to SHAs; `contents: read` | no count baseline (A23); silent sibling failure (A30); invariants unenforced (A31); HYBRID, DEBT and DIRECT_PERF counts not printed; `robots.txt` not in the presence check; browser checks not in CI; `main` unprotected, so a merge can bypass CI (R9) | change labels and `pages.yml` in the same PR; `security-reviewer` for workflow edits; Moderator merges only after `gh pr checks` is green; TASK-042; DEC-OPEN-17 / TASK-036 |
| 14 | OneDrive and git (mmap, EPERM) | `git checkout` / `switch` aborting and truncating tracked files; historical or stash blob reads failing; a tool's atomic rename hitting EPERM; `git worktree remove`, `fetch` or `stash -u` hitting "Permission denied" | `fatal: mmap failed: Invalid argument`; tracked files at 0 bytes or deleted (25-Oct-2026 precedent, INC-16); tool stderr retry lines | `blocklib.writeFileAtomic` retries EPERM/EBUSY/EACCES for 6.3 s and removes its temp file (`blocklib.test.js`); atomic writes left the page intact on 19-Oct (INC-01); `git fsck --connectivity-only` passes | on 28-Oct 229 of 519 `.git` files were cloud-only (8 in `objects/pack`), OneDrive.exe was not running and the folder was not pinned; the skill and process doc still say `git switch` (E7); OneDrive guidance outdated (E10) | never `checkout` / `switch` in the main checkout (CLAUDE.md "Project control"); create branches with `git branch <new> origin/main`, commit through a temporary index or work in a worktree; read unreadable blobs with `gh api .../git/blobs/<sha>` and check with `git hash-object`; TASK-017 (owner: OneDrive running, folder pinned), TASK-018 (E7), DEC-OPEN-19 / TASK-037 |
| 15 | CDN libraries and `xlsx` pinning | a CDN version or SRI hash changed; the page's SheetJS differing from the Node `xlsx`; a CDN outage | integrity error in the console and an empty page; tools bake differently from the in-browser upload | SRI on all five CDN tags (the browser refuses changed bytes); `package.json` `xlsx` exact `0.18.5` + lockfile + `npm ci` | no automated check that the page's SheetJS version equals `package.json`; `verify_page` skips CDN scripts; availability depends on unpkg and jsDelivr | CLAUDE.md "Never" (no upgrades without the owner); D67, D77; R4; TASK-058 only on the owner's instruction |
| 16 | Release and live parity (GitHub Pages) | published files differ from `site/`; the archived risk-matrix file reappears; a publish from a branch other than `main` | live SHA-256 differs from `site/`; `Centricity_Risk_Matrix.js` no longer 404 | publish job uploads `site/` from `main` only (environment `github-pages`, branch policy `main`); `release-manager` 7-file SHA-256 check after every merge (manual) | the live check is manual; `docs/DEPLOYMENT.md` loop hashes 6 files, not 7 (E14) | `release-manager` after every Gate D; record the result in the integration log |
| 17 | Share links and the Allocation sheet | `#p=` payload keys (`c, u, r, s[n, p, st]`) changed; Allocation sheet headers changed | links already sent to clients open empty or drop funds; re-upload fails | manual TESTING.md section 3 check 8 (Allocation sheet round trip) | no test decodes an old share link | INTERFACE_CONTRACTS: keep backward decoding; ARC-01 stops a payload change without it |
| 18 | Section 7 in-browser uploads (session only) | an upload parser diverging from the tool that bakes the same file | different numbers after an upload than after the monthly bake | `parser_refresh_only.test.js` (MF Monitor); TESTING.md section 3 check 11 (manual) | Direct plan: page `parseMfMonitorDirect` vs `tools/lib/direct_perf.js` (A7); PMS/AIF holdings: `parsePMSHoldings` vs `merge_pms_aif_analytics.js` (A29) | TASK-039, TASK-068 |

### 4.1 Coverage gaps and the task that would close each

| Gap | Task | Status |
|---|---|---|
| Count baseline, silent sibling failure, two unenforced invariants (A23, A30, A31) | TASK-042 | NOT STARTED |
| Full browser acceptance on S7, Excel opened in Excel, full-test checklist for the owner | TASK-064 | PLANNED |
| Deck tables outside `drawTable`; `listTable` page 2 (C44, C45) | TASK-069 | NOT STARTED |
| `si` bound in the MF bake (C43) | TASK-067 | NOT STARTED |
| RISK_MATRIX keys against the effective MASTER (C42) | TASK-066 | NOT STARTED |
| A producer and a regression test for the risk matrix (B8, C11, C35, A22) | TASK-022, TASK-057 | BLOCKED (DEC-OPEN-01, -02, -03) |
| Static PMS/AIF benchmark rows (C41) | TASK-065 | BLOCKED (DEC-OPEN-27) |
| Branch protection (R9) | TASK-036 | BLOCKED (DEC-OPEN-17) |
| OneDrive health; docs still saying `git switch` (R6, E7, E10) | TASK-017, TASK-018 | NOT STARTED |
| Automated Excel export test | none registered | - |
| Old share links decoding test | none registered | - |

---

## 5. How to maintain this file

- When `KNOWN_ISSUES.md` gains, closes or re-grades an item, update sections 1-3 in the same PR (or mark this file's
  snapshot date as stale). Never record a defect only here.
- When a gate, test or CI step is added, removed or changed, update the "Gate or test" and "Coverage gap" cells of
  section 4 in the same PR, and section 4.1.
- When a regression happens, add the incident to
  [`INTEGRATION_AND_REGRESSION_LOG.md`](INTEGRATION_AND_REGRESSION_LOG.md) and the missing guard to section 4.
- Keep the header's Date and Version current; a large rewrite becomes version 2 with this version kept in git history.

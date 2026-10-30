# New build and monthly operations handover (Workstream B, prefix NB; track OPS) - 28-Oct-2026, v1

| Field | Value |
|---|---|
| Version | 1 |
| Date | 28-Oct-2026 |
| Author chat | MOD-01 (retiring Moderator) |
| For | MOD-02 (next Moderator) and the NB / OPS sub-chats it starts (next free IDs: NB-04, OPS-01) |
| Status | Authoritative for Workstream B and track OPS as of `main` = `2b2a397` (PR #28 merge, 27-Oct-2026) |
| Supersedes | nothing (first workstream handover) |
| Next review | when MOD-02 validates the package (TASK-016); OPS part again after the next refresh run |

This document is a snapshot, not proof of the current state: re-check with git, `gh`,
`node tools/verify_page.js site` and `npm test` before acting on it. Where it and the code disagree, the
code wins. Labels: **VERIFIED** (a command or file shows it; source named), **INFERRED**, **UNCERTAIN**,
**UNKNOWN**. Status words are the package's nine: VERIFIED COMPLETE, IMPLEMENTED NOT FULLY VERIFIED,
IN PROGRESS, PLANNED, BLOCKED, NOT STARTED, EXISTING DEFECT, UNKNOWN / NEEDS INVESTIGATION, SUPERSEDED.
`Knn` labels (key numbers) and `S0`-`S7` (site states) are defined in Appendix A of
[`REPOSITORY_AND_ENVIRONMENT_STATE.md`](../project-control/REPOSITORY_AND_ENVIRONMENT_STATE.md). "Fact
sheet" sources are MOD-01's working notes of 28-Oct-2026, which are not in the repository: re-check each
such fact with the command or file named beside it.

Companion files: [`EXISTING_DASHBOARD_HANDOVER_2026-10-28_v1.md`](EXISTING_DASHBOARD_HANDOVER_2026-10-28_v1.md)
(Workstream A, which comes first in the required sequence) and
[`MASTER_HANDOVER_2026-10-28_v1.md`](MASTER_HANDOVER_2026-10-28_v1.md) (project-wide).

---

## 0. The short version

- **What the new build is:** the owner's repository
  https://github.com/productsteamcentricity/Centricity-Proposal-Playbook (public, D60), published at
  https://productsteamcentricity.github.io/Centricity-Proposal-Playbook/. It is the handed-over dashboard
  (tag `handover-baseline` -> `862e40b`) plus 26 merged pull requests after the transfer (#3-#28): tool
  hardening, page fixes, two September data corrections, a PowerPoint design system and their records.
- **State:** `main` = `origin/main` = `2b2a397`; live site = `site/` (7 of 7 files, SHA-256, VERIFIED
  28-Oct-2026); `verify_page` exit 0 with MASTER 7,682 and 0 script errors; `npm test` 903 checks, 0
  failures (VERIFIED 28-Oct-2026). 0 open PRs, 0 reverts, 58 of 58 CI runs green. Nothing is in flight.
- **Implementation is frozen** since 27-Oct-2026 by the owner's handover instruction (REQ-063). MOD-02
  resumes work only after validating the package (TASK-016). NB implementation follows the required
  sequence, existing-dashboard verification (TASK-064) first. An OPS refresh needs TASK-017 and the desk
  files; whether it may run before TASK-064 completes is MOD-02's call with the owner (INFERRED: the
  master prompt's sequence does not place OPS).
- **The most urgent open item** is B8 (P1): nobody now produces the Fund Risk Ratios (#12) and NAV Data
  (#17) workbooks, so the Oct-2026 Portfolio Matrix cannot be refreshed. The owner has not answered MOD-01's
  question of 27-Oct-2026 ("Should I rebuild the risk-ratio and NAV workbook tools in-house?"). Decisions
  DEC-OPEN-02 and -03, then -01, are needed well before ~13-Nov-2026.
- **OPS:** no monthly refresh has yet run end to end on the new build (the two September runs were
  corrections). The Sep-2026 Reckoner catch-up is due now but BLOCKED (the inbox is empty); the Oct-2026
  MF cycle is PLANNED for ~13-17-Nov-2026.

---

## Part 1 - New build (Workstream B, NB)

## 1. Baseline chain and current build

| Item | Value | Label |
|---|---|---|
| Handover baseline | tag `handover-baseline` -> `862e40b` (sanitised equivalent of upstream `72e1f1e`) | VERIFIED (K02) |
| Transfer baseline | `25e71a3` = PR #1 merge, 16-Oct-2026; `site/` bytes = baseline | VERIFIED (K03) |
| Current `main` | `2b2a397` = PR #28 merge, 27-Oct-2026 (docs only); 143 commits, 69 since `862e40b` (38 non-merge + 28 PR merges + 3 other merges) | VERIFIED (K04, K08) |
| Last site-changing merge | `5d39821` (PR #26, 22-Oct-2026) = content state S7; `index.html` SHA-256 `916f2455eeba...` (12,864,963 B) live and local | VERIFIED (K05) |
| Last full browser acceptance | S6 (21-Oct-2026, 7 areas PASS); after PR #26 only a live 4-fund deck export (23 slides, no layout warning) | VERIFIED doc record (K06) |
| App startup | 28-Oct-2026: React root rendered, in-browser MASTER 7,682, `window.H` / `REFRESH` / `EXPORTS` present, 3 sibling flags set, 0 console errors; no proposal built, no export | VERIFIED (K07) |
| Toolchain | Node v24.21.0, npm 11.19.0, git 2.56, gh 2.102, Python 3.14.4; `xlsx` 0.18.5 (Node and page); CDN React/ReactDOM 18.3.1, Chart.js 4.4.0, pptxgenjs 3.12.0, all with SRI. Never upgrade without the owner (CLAUDE.md "Never") | VERIFIED (K30) |

Content states S0-S7 and their merges: existing-dashboard handover section 1.3.

## 2. Improvements implemented since the baseline (by PR batch)

Every PR below is merged, passed `verify` on the PR and `verify` + `publish` on the push to `main`, and
was published (VERIFIED, integration fact sheet section 2, `gh run view` of all 28 push runs). No
production regression from a new-build PR has been found (0 reverts). The page changes of S1-S6 were
covered by the 21-Oct-2026 live acceptance check.

| Batch | PRs (merge) | Date | Chat | What changed | Issues / decisions | Status | Evidence beyond CI |
|---|---|---|---|---|---|---|---|
| Foundation (TASK-002) | #3 (`3f3e4b5`) | 16-Oct | MOD-01 | `tools/lib/blocklib.js` atomic writes and label helpers; `verify_page.js` exits 1 on a hard failure; unit tests; rehearsal harness `tools/dev/rehearse.js` | A8, A9, A23, A24 (part) | VERIFIED COMPLETE | `blocklib.test.js` |
| P1 tool risks (TASK-003) | #4 (`1e4b2fc`), #5 (`4fbbad6`), #6 (`c93e55c`) | 16-Oct | NB-01 | Bond List needs `--desk` and an explicit sheet (A1); PMS/AIF look-through stops re-dating MF analytics (A3); Reckoner drop gates, `--accept-drops <n>` (A4) | A1, A3, A4; D70, D71 | VERIFIED COMPLETE | security-review fixes before #6 merged |
| Tool hardening packages A-E (TASK-004) | #7 (`0d4fca3`), #8 (`455a573`), #9 (`71ecbe2`), #10 (`79e9759`), #11 (`d260cdf`), #14 (`cd6317c`), #15 (`1e48781`) | 19-Oct | MOD-01 | MF chain: `isoDay` dates, `prev_names`, shared DIRECT_PERF builder, `npm test` in CI; DE universe/returns, expense, fund managers; risk matrix `fl` flags, SIF `--as-on` required, Python guards; `tools/data/pins.json`, Reckoner 4th gate; bond, slide and one-off tools; exact-inception rename; strict CLI | A2, A5-A7, A10-A22, A25, A26, F2; D72-D76, D79 | VERIFIED COMPLETE | `dates.test.js`. PR #10's body still claims two flags that do not exist on those tools (INC-03); re-check any PR-body claim against code |
| Page fixes (TASK-005) | #12 (`792692d`) | 19-Oct | MOD-01 | true workbook dates in the page, risk dagger and footnote, shared-link banner, SRI on 5 CDN scripts, `noindex`, inline favicon; legacy risk-matrix file archived | C3, C13, C14, R3, R5, E4, F3 (part); D77, D78 | VERIFIED COMPLETE | in-browser check (Excel 13, PPT 25, 9 tabs); covered by 21-Oct acceptance |
| C19 parser (TASK-009) | #17 (`8e187ae`) | 19-Oct | MOD-01 | `parseMfMonitor` refreshes four refresh-only Monitor sheets; an unknown sheet fails the bake; bake not-merged list, WARN and CHECK lines | C19 (code); D80 | VERIFIED COMPLETE | `parser_refresh_only.test.js` (fails on the old parser); byte control on scratch copies (exactly 215 records change) |
| Five P3 follow-ups (TASK-011) | #19 (`699978b`), #20 (`0cb7e95`), #21 (`75538de`), #22 (`fb9cbd6`), #23 (`1523bbc`) | 21-Oct | NB-02 | every tool exits 2 on a missing input or `--html` (D72); `writeFileAtomic` retries an OneDrive-blocked rename (R6 mitigated); C17 matrix footnote; C18 Select popover dagger; A27 `rehearse.js --old-site` | D72, R6, C17, C18, A27 | VERIFIED COMPLETE | `tool_inputs.test.js` 43/43; real-lock retry test; COM measurement (7.87" -> 6.64"); browser check of the dagger; C19 retro-check (223 records). **PR #23's code sits only in merge commit `18abff3`**: audits must use `git log -m` or `git diff 18abff3^1 18abff3` |
| PowerPoint design system (TASK-013) | #26 (`5d39821`), #27 (`5bcce88`, release record) | 22-Oct | NB-03 | every native slide laid out by measurement (D82); `*` on expected 1Y/3Y/5Y figures (D83); see section 3 | D82, D83; C22 closed; C28-C34 opened | IMPLEMENTED NOT FULLY VERIFIED | `pptx_layout.test.js` 798 checks in CI; six decks rendered in PowerPoint and bounds-checked before merge; owner go-ahead 22-Oct 15:36:58 UTC after the montage and sample deck were sent; live 7/7 after merge. Residual spec items: section 3.3; full browser acceptance on S7: TASK-064 |

Data and docs PRs are not NB work: #13 and #18 (OPS, Part 2), #2, #16, #24, #25, #27, #28 (EX/GOV). Only #18
and #26 waited for the owner's explicit approval; the rest merged on green CI (K09). No PR has a GitHub
review recorded; reviews by the specialist agents are recorded in PR bodies and transcripts only.

Overall status of the owner's fix programme ("Start fixing all the issues that you have identified",
16-Oct-2026, REQ-045): **IN PROGRESS**. `docs/KNOWN_ISSUES.md` has 93 rows: 43 Open, 12 Partly fixed, 1
Fixed (C19), 4 Accepted, 33 Closed; open P1: B8, C20, R1, R8 (VERIFIED 28-Oct, K19). The package adds new
entries A29-A31, C41-C45, E6-E16 and R9-R11.

## 3. The PowerPoint design system (D82, D83)

### 3.1 What it is and where it lives

The proposal deck is built in the browser by pptxgenjs 3.12.0 inside `site/index.html` (the `EXPORTS`
block; no sibling, no seventh deploy file). Line numbers drift; re-find them with Grep.

| Piece | Grep pattern | Line at `2b2a397` |
|---|---|---|
| Palette, chart options, logo stamp, `DS` measures, `TXT` Cambria text measurement | `const COL =`, `const PPT_CHART_OPTS =`, `const DS =`, `const TXT =` | 4253, 4261, 4290, 4310 |
| Frame: band, fitted title, logo, gold rule, page number | `function applyMaster` | 4369 |
| Footer and notes block | `function footerBlock` | 4389 |
| Table engine (fits at 11pt, floor 8pt, else continues with repeated headers, "(continued)" rows, GRAND TOTAL on every Investment Option page) | `function planTable`, `function drawTable` | 4538, 4594 |
| Slide builders in portal order (cover, market, construct, net allocation, rationale cards, investment option, analytics, annexure, fund performance, portfolio matrix, AMC + liquidity, overlap, disclaimer, thank you) | `function buildDeck` | 4615-5506 |
| Layout log and warnings | `window.__PPTX_LAYOUT =` | 5492 |
| Expected-return marker (D83) | `H.isExpectedReturn = function` | 1955 |

Rules for anyone changing the deck (CLAUDE.md rule 10; `docs/OPERATING_MANUAL.md` "The deck is laid out by
measurement, never by fixed positions"): no fixed rows per slide, row heights or note positions; draw
tables only through `drawTable`; check a change with `npm test` and a PowerPoint render
(`tools/dev/render_pptx.ps1` + `node tools/dev/check_pptx_bounds.js <bounds.jsonl>`; Windows + PowerPoint
only; manual, not in CI). Rejected approaches (pptxgenjs `autoPage`, `fit:'shrink'`, canvas `measureText`,
a seventh deploy file, re-laying the disclaimer image) are listed in `docs/DECISIONS.md` D82. Audit and
validation record: `docs/proposal-output-format-audit.md`.

### 3.2 Tests and evidence

| Check | State | Label |
|---|---|---|
| `tools/test/pptx_layout.test.js` (rule-picked portfolios of 3-45 instruments, 15 AMCs, Lakhs; every table and chart inside the frame; every instrument once; GRAND TOTAL on every page; 10 IO columns; nine single-tab exports) | 798 of 798 pass, in CI | VERIFIED 28-Oct (K12) |
| 4-fund check (TESTING.md check 7) and a 2-instrument proposal, in a Node vm | 23 and 21 slides, 0 layout warnings | VERIFIED 28-Oct (pptx fact sheet) |
| PowerPoint COM renders of six decks (22-Oct) re-checked with `check_pptx_bounds.js` | the 8 final `b_*.jsonl` files in `%TEMP%\x\`: 8 of 8 "no problem found" (4 earlier-iteration files there, 2 reporting problems, predate them); deepest table 6.945" (< 7.08") | VERIFIED 28-Oct and 30-Oct on the kept files |
| Live export after merge | 4-fund deck 23 slides, no layout warning, console clean (22-Oct) | VERIFIED doc record |
| Render artefacts | `_testdata/pptx-design-system/` (git-ignored) and `%TEMP%\x\` (raw COM files, deck authoring source `pptx_section.js`); single local copies (R11) | VERIFIED exist; backup UNKNOWN |

`site/` has not changed since `5d39821`, so the 22-Oct renders still describe the current code (VERIFIED,
`git diff --stat 5d39821 2b2a397 -- site/` empty).

### 3.3 Status of the specification items (REQ-PPT-01..153)

Totals: **118 VERIFIED COMPLETE, 34 IMPLEMENTED NOT FULLY VERIFIED, 1 BLOCKED** (K21). Item-by-item table:
`docs/project-control/REQUIREMENTS_AND_CHANGE_REGISTER.md`. The 35 not complete, grouped by what is missing:

| Group | Items | What would complete them |
|---|---|---|
| Client-readiness is the owner's judgement | REQ-PPT-02 | owner review of a real proposal deck (part of DEC-OPEN-24) |
| Blank space on low-density slides (e.g. single-bucket Fund Performance, Direct Bonds ~55% blank, 5 rationale cards, AMC chart with 2 AMCs) | REQ-PPT-04, -40, -48, -62, -76, -82, -148 | density-based layout variants; no task yet (raise with the owner) |
| Chart internals not measured (label truncation, margins, long AMC names) | REQ-PPT-47, -78, -79, -146 | a chart check; C31 for AMC names |
| Figures not re-compared with the source after the change | REQ-PPT-07, -52, -123, -130, -144 | a data-validation pass deck vs portal (needs both decks) |
| "Unavailable", "not applicable" and "mapping defect" all print "-" | REQ-PPT-67, -69, -71 | a distinct marker; owner wording |
| Helpers not reusable as functions (charts, cards) | REQ-PPT-108, -109 | refactor only on request |
| Evidence not kept (reproduction deck, per-slide renders, final summary form) | REQ-PPT-11, -126, -128, -129, -137, -151, -152 | re-render on the next deck change; COM check stays manual |
| A negative that cannot be proven / latent drop | REQ-PPT-116, -120, -143 | C45 fix (TASK-069) closes the latent part |
| Fixed geometry remains on two slides | REQ-PPT-124 | C44 fix (TASK-069) |
| Remaining templates | REQ-PPT-127 | fund-specific pages (DEC-OPEN-23) and the disclaimer (below) |
| Disclaimer slide layout | REQ-PPT-93 - **BLOCKED** | the desk's source slide (DESK-10), DEC-OPEN-21, TASK-038 |

### 3.4 Deck-related open issues (authoritative text in `docs/KNOWN_ISSUES.md`)

| ID | Effect on the deck |
|---|---|
| C44 (new, P3) | Construct and Net Asset Allocation slides keep fixed geometry and call pptxgenjs `addTable` directly (`s.addTable`, ~L4769, ~L4824) instead of `drawTable`, against D82; no visible effect today |
| C45 (new, P2 latent) | `listTable` analytics tables (Top Underlying Holdings, Top Issuers) draw only page 1; a second page would vanish without a warning |
| C24 (correction 28-Oct) | the deck's Investment Option GRAND TOTAL **excludes** instruments with no IRR band, like Section 4; the Section 1 tile, Section 5 Future Value and Section 6.1 Live Output count them as 0%. The export has no "Expected Pre-Tax Return" text |
| C28 / D83 | expected returns stored as track record; the deck marks them `*`, the screen and Excel do not |
| B1 | every PMS table is stamped "31st August 2026" over 31-Jul data |
| C41 (new, P2) | PMS/AIF benchmark rows (screen, Excel, deck) read a static literal last changed 20-May-2026; the monthly benchmark data is never read |
| C43 (new, P1) | one ETF incepted 15-Sep-2026 shows a since-inception figure of about 297,765% in Fund Performance tables, Excel and screen |
| C20 (P1) | 12 JioBlackRock Regular records show returns from before their launch |
| C29, C31, C32, C33, C34, C11, C35 | bucket definitions, AMC name fallback, issuer bucket, commodity ETF market cap, disclaimer image, Rf 4.5% and Sortino in the matrix note |

Residual risks with no defect yet (pptx fact sheet section 7): no automated chart-overlap check; the
COM bounds check is manual and Windows-only, so a PowerPoint-only wrap difference could pass CI; a single
rationale card taller than the frame cannot be split (it warns, it does not clip).

## 4. Improvements the owner asked for that are not yet done

| Request (owner's words or source) | When | Status | Blocked by / next | IDs |
|---|---|---|---|---|
| "Start fixing all the issues that you have identified and tell me the impact of that pre and post fixing" | 16-Oct-2026 | IN PROGRESS | 43 Open + 12 Partly fixed issues; most open ones wait for an owner or desk decision. `docs/PROJECT_STATE.md` step 7 calls the remaining engineering backlog "only on request": MOD-02 should confirm with the owner which backlog items to schedule | REQ-045; TASK-039..TASK-069 |
| Fix and standardise the PowerPoint output (22-Oct spec) | 22-Oct-2026 | IMPLEMENTED NOT FULLY VERIFIED | 34 items partly evidenced, disclaimer BLOCKED (section 3.3) | REQ-057, REQ-PPT-nn; TASK-013 |
| Fund-specific pages like the reference deck (fund narrative, alpha avenues, fee slabs) | 22-Oct-2026 spec (reference deck) | NOT STARTED | the portal does not hold that content for every fund; owner decides whether wanted | DEC-OPEN-23; REQ-PPT-127 |
| Disclaimer slide laid out cleanly | 22-Oct-2026 spec | BLOCKED | desk source slide; which closing-slides deck to file | REQ-PPT-93; DEC-OPEN-21; TASK-038; C34 |
| Expected figures not presented as past performance on screen and in Excel (the deck does it) | 22-Oct-2026 spec, Phase 4 | BLOCKED | how the data records the return basis | DEC-OPEN-16; TASK-031; C28 |
| Bond 3Y/5Y = average of the expected pre-tax IRR band (requested on 20-May-2026 per the export's work log; KNOWN_ISSUES C37 records it as the owner's request; inherited) | 20-May-2026 | BLOCKED | owner confirms | DEC-OPEN-09; TASK-027; C37 |
| Maintainable architecture after the baseline (fold siblings, one Direct parser, one bucket function) | 15-Oct-2026 master prompt | IMPLEMENTED NOT FULLY VERIFIED | C1 deferred on purpose (never inside a refresh); A7, C29 open | REQ-025; TASK-045, TASK-039, TASK-046 |
| Prioritised backlog in the owner's four categories (urgent, required, optional, future) | 15-Oct-2026 master prompt | IMPLEMENTED NOT FULLY VERIFIED | the backlog is ordered by severity P1-P3, not by those categories | REQ-032 |
| Clean setup reproducible by a new maintainer | 15-Oct-2026 master prompt | IMPLEMENTED NOT FULLY VERIFIED | no fresh-clone test | REQ-034; TASK-072 |
| Monthly updates publish automatically once every check passes | 16-Oct-2026 (D61) | IMPLEMENTED NOT FULLY VERIFIED | never exercised on a real monthly run (Part 2) | REQ-044 |
| "Keep populating/pushing things to GitHub ... the data for whatever changes are requested" | 15-Oct-2026 | VERIFIED COMPLETE as interpreted | read as change records (update logs), not workbooks (D65, CLAUDE.md "Never commit .xlsx"); interpretation never confirmed with the owner | REQ-042 |
| Retire the old dashboard after full testing | 16-Oct-2026 | PLANNED | Workstream A | REQ-049; existing-dashboard handover |

## 5. Open NB tasks and decisions, in dependency order

Rules for all of them: a change-impact contract and an `integration-guardian` (ARC-01) review before
material or high-risk work and after the diff; own worktree and task branch from current `origin/main`;
claim files in `docs/project-control/ACTIVE_CHANGE_REGISTER.md` first; gates A-E in
`docs/project-control/FILE_OWNERSHIP_AND_CHANGE_CONTROL.md`; no NB merge to `site/` or `tools/` while an
OPS refresh owns the deploy files (section 9).

### 5.1 Before any NB work

| Order | ID | Item | Status |
|---|---|---|---|
| 1 | TASK-016 | MOD-02 validates the package (git, counts, tests, registers) | PLANNED |
| 2 | TASK-017 | OneDrive health (owner action); needed before any worktree or branch | NOT STARTED |
| 3 | TASK-064 | Full browser acceptance on S7 (Workstream A). NB work may be planned and investigated in parallel, but nothing that depends on an unverified baseline counts as accepted | PLANNED |

### 5.2 B8 - the risk-ratio and NAV workbooks (P1; blocks the Oct-2026 Portfolio Matrix)

The outgoing owner produced Fund Risk Ratios & 3Y Rolling (#12) and NAV Data (#17) in-house with a
PowerShell + C# toolchain (AMFI NAV download, five Nifty index files downloaded by hand from
niftyindices.com, `Calc.cs` / `Metrics.cs` and month scripts; outputs byte-identical to the Aug and Sep
workbooks we hold). The toolchain exists only in
`handover-archive/export_20261023/extracted/05_project_working_folder/_nav_risk_toolchain/` (221 files,
18 `.cs`, 79 `.ps1`; about 12 core scripts), local and git-ignored (R11). `docs/KNOWN_ISSUES.md` B8 is
authoritative.

| Order | ID | Item | Status | Depends on |
|---|---|---|---|---|
| 1 | DEC-OPEN-02 | Risk-free rate (4.5% hard-coded, unconfirmed; = C11, D58 Open) | BLOCKED (owner + desk, DESK-15) | - |
| 2 | DEC-OPEN-03 | Sortino definition (June semi-deviation vs Aug/Sep textbook; = C35) | BLOCKED (owner + desk, DESK-16) | - |
| 3 | DEC-OPEN-01 | Who produces #12 / #17 from October: port the toolchain to Node, validate the Python tool, or the desk | BLOCKED (owner) | -02, -03 |
| 4 | TASK-070 | Inventory and secure the local-only toolchain copy (and other single copies) | NOT STARTED | TASK-017 |
| 5 | TASK-022 | Build the producer (if the port is chosen) | BLOCKED | DEC-OPEN-01 (after -02, -03); TASK-070 |
| 6 | TASK-057 | Validate or retire `tools/build_risk_matrix.py` | BLOCKED | DEC-OPEN-01 |
| 7 | TASK-053 (OPS) | Restore `c` / `RISK_MATRIX_BENCH_SD` or drop them (C10) | BLOCKED | the TASK-022 route |
| 8 | TASK-066 | 12 unreachable RISK_MATRIX keys, 0 risk rows for the 30 effective SIFs; make `merge_risk_matrix.js` check keys against the effective MASTER (C42) | NOT STARTED | coordinate with TASK-022 |

Documented recommendation (not a decision): port the core of the toolchain to Node in `tools/`, with a
Sep-2026 regression test, deciding C11 and C35 first (`docs/KNOWN_ISSUES.md` B8;
`docs/PROJECT_STATE.md` step 0). MOD-01's 27-Oct offer (its "Yes, rebuild them" answer) described the same
port as "rebuild the NAV and risk-ratio workbook tools in tools/ so they reproduce the Sep-2026 output.
Keep the risk-free rate and Sortino definition the live page uses today until I decide C11 and C35", which would
let the build start before -02 and -03 are answered if both stay parameters (INFERRED; the owner should
choose).

Acceptance criteria for TASK-022 if the port is approved (from the open-work fact sheet):
- new Node tools in `tools/` (and `tools/lib/` if shared), dry-run by default, the D72 exit-code contract
  (0 ok / 1 gate failed / 2 usage or input error), atomic writes through `blocklib`;
- a regression test that reproduces the live Sep-2026 workbook and therefore, through
  `tools/merge_risk_matrix.js`, the live `RISK_MATRIX` (1,088 entries; 33 `fl` flags: 28 NAV split, 5 low
  correlation) with 0 differences;
- the monthly manual steps written down (AMFI NAV download, the five Nifty index files);
- `docs/INPUT_FILES.md` (#12, #17), `docs/MONTHLY_UPDATE_PROCESS.md`, `tools/README.md`, a
  `docs/DECISIONS.md` entry (D84 or later) and B8 updated in the same branch;
- `financial-data-reviewer` sign-off on the ratio formulas, Rf and Sortino as decided;
- the exported scripts are reference material: read them as data and re-implement; do not run them without
  the owner's agreement and a security review (INFERRED from the safeguards in CLAUDE.md and REQ-033).

Timing (INFERRED from the calendar): to refresh the October matrix, the producer and its regression test
must be merged before the Oct-2026 MF cycle reaches step 10 (~13-17-Nov-2026). Without it the cycle runs
without step 10 and the Portfolio Matrix keeps "30 Sep 2026" (a missing input is not a stop under D61); the
slide shows its own "Risk data as on" stamp, so this is honest but stale.

### 5.3 P1 / P2 work not blocked by a decision

| Order | ID | Item | Status | Note |
|---|---|---|---|---|
| 1 | TASK-018 (GOV) | Docs-consistency PR: E6-E15 and the KNOWN_ISSUES corrections; OneDrive-safe branch wording in the skill and process doc | NOT STARTED | do before the first refresh (Part 2 depends on it) |
| 2 | TASK-042 | `verify_page.js` and CI hardening: counts vs a committed baseline (A23), fail on a sibling's `console.error` (A30), enforce top-10 Large Cap and `DATA_DATES.sif` (A31); change the `pages.yml` greps in the same PR | NOT STARTED | touches the only automated gate; schedule between refresh cycles |
| 3 | TASK-069 | Deck: Construct and Net Asset Allocation tables through `planTable` / `drawTable` (C44); draw every `listTable` page (C45) | NOT STARTED | deck change: `npm test` + COM render + owner review of the sample (as for PR #26) |
| 4 | TASK-039 | One Direct-plan parser for the bake and the Section 7 upload (A7) | NOT STARTED | page-parser change: rehearse with `--old-site` |
| 5 | TASK-040 | AIF merge: fail on layout notes, store an AIF as-on date, fail-able MASTER-AIF gate (A19) | NOT STARTED | on request |
| 6 | TASK-041 | `add_reckoner_funds.js`: slides from the deck index; schema-check new records (A20) | NOT STARTED | on request |
| 7 | TASK-045 | Fold siblings 3-5 into `index.html` (C1 = D2 Open) | NOT STARTED | owner go-ahead; never inside a data refresh; touches the six-file rule |

### 5.4 NB work waiting for a decision or a desk file

| ID | Item | Status | Waits for |
|---|---|---|---|
| TASK-067 (OPS/NB, P1) | `si` bound / gate in the MF bake; treat the young ETF's since-inception value (C43) | NOT STARTED | DEC-OPEN-07 (treatment of very young funds) |
| TASK-026 (P2) | One rule for the headline expected return in all five places (Section 1 tile, Section 5 Future Value, Section 6.1 Live Output, Section 4 table, deck GRAND TOTAL); slide note if instruments are excluded; test | BLOCKED | DEC-OPEN-15; DESK-06 |
| TASK-030 (P2) | Select popover alpha in its true unit, never auto-detected; ratios dated, replaced or hidden (C23, C36) | BLOCKED | DEC-OPEN-12; DESK-14 |
| TASK-031 (OPS/NB, P2) | Carry the return basis in the data; screen and Excel use `H.isExpectedReturn`; the 14 stale AIF mid-points and the Alchemy 1Y (C28, C37) | BLOCKED | DEC-OPEN-16 |
| TASK-065 (P2) | PMS/AIF benchmark rows from the decided source (C41) | BLOCKED | DEC-OPEN-27 |
| TASK-028 (OPS/NB, P3) | Remove the 4 segregated side-pocket records; widen the parser skip at both sites (~L3347, ~L3415); MASTER 7,682 -> 7,678 expected (C39) | BLOCKED | DEC-OPEN-10 |
| TASK-052 (P3) | Complete the AMC prefix list (C31) | BLOCKED | DESK-22 |
| - | Fund-specific pages | NOT STARTED | DEC-OPEN-23 |

### 5.5 P3 backlog (only on request)

TASK-043 (`tools/lib` hazards: A24, A28, F2), TASK-044 (DE universe ISIN join, A14; needs DESK-24),
TASK-046 (one bucket function, C29), TASK-047 (per-bucket date on the Performance tab, C30), TASK-048 (Debt
Analytics picker vs hint, C25), TASK-049 (deterministic issuer bucket, C32), TASK-050 (split the
`rename_schemes.js` count, C40), TASK-055 (favicon F3, tenor column F2), TASK-068 (compare the two PMS/AIF
holdings parsers, A29), TASK-058 (SheetJS upgrade: only on the owner's explicit instruction, R4).

## 6. NB risks

| Risk | Mitigation |
|---|---|
| A page-parser or load-time code change silently changes what the monthly tools bake (A27) | `rehearse.js --old-site` with a data verdict; Guardian review; never during a refresh |
| A broken sibling fails silently: siblings catch their own errors and only log, so `verify_page` and CI count no script error (A30) | TASK-042; check the browser console after any sibling change |
| `index.html` alone deployed or a sibling edited in `index.html` reverts sibling-owned data | CLAUDE.md rule 1; CI six-file check; change sibling-owned data in the sibling |
| `main` is not protected; any merge publishes within minutes (R9) | one PR at a time, `verify` green, `release-manager` live check; DEC-OPEN-17 |
| OneDrive cloud-only `.git` files make checkout unsafe (R6; 25-Oct incident when NB-03 left the shared checkout on its branch) | TASK-017; sub-chats in their own worktree; never `checkout`/`switch` in the main checkout while any `.git` file is cloud-only (CLAUDE.md "Project control") |
| Single local copies of the B8 toolchain and the PowerPoint renders | TASK-070 |
| Memory-only procedures (temporary-index commit, escape-mangling rule, `gh repo set-default`) | TASK-071; Node scripts with escapes are written to files, never piped or passed through heredocs |

---

## Part 2 - Monthly data operations (track OPS)

## 7. How a monthly refresh runs

| What | Where (authoritative) |
|---|---|
| The procedure, step by step (Part A for the owner, Part B for the operator) | [`../MONTHLY_UPDATE_PROCESS.md`](../MONTHLY_UPDATE_PROCESS.md) |
| The skill the owner starts with `/monthly-update <Month YYYY>` (the data month) | [`../../.claude/skills/monthly-update/SKILL.md`](../../.claude/skills/monthly-update/SKILL.md) (73 lines; a summary of Part B) |
| How to recognise every input file | [`../INPUT_FILES.md`](../INPUT_FILES.md) |
| Tool commands and gates | [`../../tools/README.md`](../../tools/README.md) |
| Traps | [`../OPERATING_MANUAL.md`](../OPERATING_MANUAL.md) "Traps"; [`../KNOWN_ISSUES.md`](../KNOWN_ISSUES.md) "Before the next refresh" |
| Run records | `docs/update-log/<YYYY-MM>_<Mon-YYYY>.md` |

The flow: the owner drops the desk files into `monthly-updates/00_INBOX/` (local only) and types
`/monthly-update <Month YYYY>`. The operator then runs B0 resume check, B1 preflight (`verify_page` must
equal `docs/PROJECT_STATE.md` "Latest verification"), B2 intake (identify each file by content, read its
as-on date from inside, hash it; stop on a wrong month, an unidentifiable file, two competing files or a
file older than the live data), B3 file into `monthly-updates/<YYYY-MM_Mon-YYYY>/`, back up the six deploy
files to `backups/<date>_pre-<YYYY-MM>-refresh/`, branch `data/<YYYY-MM>`, B4 the tools in order (steps
1-17, rename first, each dry-run -> read every gate -> `--apply`), B5 market slides, B6 verify
(`verify_page`, `financial-data-reviewer` spot checks, `verify-dashboard` in a browser), B7 update log and
state docs, B8 publish, B9 close.

**D61 (owner, 16-Oct-2026):** a monthly refresh is merged and published automatically when every
automated and manual check passes and no judgement call is open. The stop list (renames, new funds on
refresh-only sheets, ambiguous joins, failed gates, unexplained count moves, override flags such as
`--accept-drops`) still applies, and override flags are always the owner's call. Data corrections are not
covered: Sep Run 3 was held for the owner because the architect review ruled D61 does not cover it (D81
context); Run 2 (PR #13) merged on green CI. D61 has never been exercised (REQ-044).

**Known defects in the run documents (fix in TASK-018 before the first run):**

| ID | Defect | Until fixed |
|---|---|---|
| E7 | the skill (`:20`, `:31`) and the process doc (`:145`, `:171`) say `git switch main` / `git switch -c data/<YYYY-MM>` | CLAUDE.md "Project control" overrides them: no `checkout`/`switch` in the main checkout while any `.git` file is cloud-only. How a refresh branches and commits under that rule has not been exercised (UNKNOWN / NEEDS INVESTIGATION). Options: create the branch with `git branch data/<YYYY-MM> origin/main` and commit through a temporary index, leaving the main checkout on `main` (CLAUDE.md says it stays on `main`, so even after TASK-017 the documented switch flow needs that rule changed first); or the OPS chat works in its own worktree, passing absolute paths to the main checkout's `monthly-updates/` and `backups/` (their contents are git-ignored, so a worktree holds only their READMEs). Decide and document in TASK-018 |
| E9 | the skill says the Reckoner-cycle tools "crash with exit 1 on a missing file" | every tool exits 2 on a missing input since PR #19 |
| E12 | the skill, process doc and `release-manager` say `gh pr merge --merge --delete-branch`; only PRs #1-#3 used it (their branches are gone, those of #4-#28 remain on origin) and `delete_branch_on_merge` is false | DEC-OPEN-22 decides the rule |
| E8 | `monthly-updates/00_INBOX/README.md` rows 12 and 17 and `docs/HANDOVER.md` section 5 still list the two in-house workbooks as files to send | do not ask the desk for #12 / #17 (B8) |

## 8. Data in force (as on 28-Oct-2026)

Page labels are VERIFIED (`verify_page`, K11/K17); content dates are as recorded in
`docs/PROJECT_STATE.md` "Data in force" (authoritative; INFERRED from docs, not re-derived).

| Domain | As on | Next due |
|---|---|---|
| MF performance (Regular + Direct), MF benchmarks | 30-Sep-2026 (label "30th September 2026"); the 214 refresh-only-sheet funds since Run 3 (21-Oct). Exceptions: JioBlackRock G-Sec record held (C16, C20); 12 Debt ETF blank cells kept (D81); 42 funds absent from the Monitor | Oct-2026 MF cycle |
| Equity / Hybrid / Debt analytics | 30-Sep-2026 (SIF look-through from Aug, B4) | Oct-2026 MF cycle |
| Listed Direct Equity universe and returns; expense ratio and exit load | 30-Sep-2026; Sep-2026 | Oct-2026 MF cycle |
| SIF performance | 30-Sep-2026 (label set by the SIF sibling) | Oct-2026 MF cycle |
| Portfolio Matrix (risk ratios) | label "30 Sep 2026"; 33 funds flagged (28 NAV split, 5 low correlation) | Oct-2026 MF cycle, **only if B8 is resolved** |
| Market Update slides | October-2026 deck (September outlook) | next Outlook deck |
| Fund managers | 30-Sep Monitor, first-named manager only (C15) | behind: Fund Manager Data 30-Sep or later (DESK-03) |
| AIF performance, Centricity Select | 31-Aug-2026 (September-2026 Reckoner) | behind: "October 2026" Reckoner (DESK-02) |
| PMS performance | 31-Jul-2026 data under the label "31st August 2026" (B1) | behind two cycles: DESK-01 |
| PMS/AIF look-through | 31-Jul-2026 (no page label, D70) | DESK-04 |
| Invictus bonds / GIFT City and Offshore / SIF universe | 6-Aug-2026 / Jun-Jul-2026 / June list (28 schemes; 30 live) | only when the desk sends new lists |

## 9. How OPS and NB work together

- **A refresh owns all six deploy files for its whole run**: from B3 (backup and branch) until the merge
  and the live SHA-256 check. The OPS chat claims them in `docs/project-control/ACTIVE_CHANGE_REGISTER.md`
  before B3 and releases them after the live check.
- **NB changes to `site/` wait or rebase.** No NB merge that touches `site/` during a refresh. After the
  refresh merges, an open NB branch that touches `site/` merges `origin/main` into itself (as PR #22 did)
  and re-runs `verify_page` and `npm test` before its own merge (lesson INC-17: three PRs once merged one
  merge behind `main`).
- **Freeze tool and parser changes during a refresh** (recommended rule, INFERRED from A27 and the
  coupling in `docs/project-control/ARCHITECTURE_AND_DEPENDENCY_MAP.md`): the vm tools run the parsers of
  the page they are given, so a merge to `site/index.html` page code, to `tools/` or to `tools/lib/` between
  a refresh's first dry run and its merge makes that run's evidence stale. Re-run the affected dry runs if
  it happens.
- **Data a sibling owns is changed in the sibling** (GIFT City bucket, IRR bands, the Offshore records, all
  SIF rows, `DATA_DATES.sif`, 12 PMS/AIF look-throughs). Folding the siblings (TASK-045) never happens inside
  a refresh.
- **B8 hand-off:** the NB producer (TASK-022) must be merged, with its regression test green, before the OPS
  run reaches step 10; otherwise the run skips step 10 and says so in its report.
- **Recovery:** if a refresh breaks the live site, stop dependent merges, keep the evidence, restore the six
  files from `backups/<date>_pre-<YYYY-MM>-refresh/` (data) or `git revert -m 1 <merge>` in a new PR (code);
  never force-push; record it in `docs/project-control/INTEGRATION_AND_REGRESSION_LOG.md`.

## 10. Calendar

Cadence (`docs/MONTHLY_UPDATE_PROCESS.md` Part A): the MF cycle runs on the 13th-17th of the next month;
the Reckoner cycle on the 20th-28th, with a deck titled one month ahead. Both are named for the data month.
History: Aug data applied 17-Sep, Sep data 13-Oct; Reckoner runs 20-Aug and 28-Sep.

| Run | Data as on | Command | Window | State (28-Oct) | Needs |
|---|---|---|---|---|---|
| Sep-2026 Reckoner catch-up ("October 2026" deck) - TASK-020 | 30-Sep-2026 (Select, AIF, PMS) | `/monthly-update September 2026` | due now | **BLOCKED**: inbox empty (VERIFIED); whether the deck is released is UNKNOWN | DESK-01, -02, -03, -04; TASK-017; TASK-018 advisable; DEC-OPEN-04 if no PMS file; DEC-OPEN-11 (C5 pin, C4) before steps 14 / 14a |
| Oct-2026 MF cycle - TASK-021 | 31-Oct-2026 | `/monthly-update October 2026` | ~13-17-Nov-2026 | PLANNED | DESK-23 (+ DESK-05, DESK-03 as on 31-Oct); **DEC-OPEN-08 before step 1 `--apply`** (TASK-024: 8 pending renames, listed in `docs/update-log/2026-09_Sep-2026.md` Run 2); **TASK-022 for step 10**; TASK-017 |
| Oct-2026 Reckoner cycle ("November 2026" deck) | 31-Oct-2026 | `/monthly-update October 2026` (second run) | ~20-28-Nov-2026 | PLANNED | #14 as on 31-Oct, #15 "November 2026", #16 |
| Nov-2026 MF cycle | 30-Nov-2026 | `/monthly-update November 2026` | ~13-17-Dec-2026 (INFERRED) | NOT STARTED | as the Oct MF cycle |

Implied decision deadline (INFERRED): DEC-OPEN-08 and DEC-OPEN-01 / -02 / -03 by ~13-Nov-2026, and for
DEC-OPEN-01 earlier, so the build can finish.

## 11. Desk requests outstanding

Only the owner contacts the desk (TASK-019). No record shows that any of these was sent (UNKNOWN). Full
list with senders by role: `docs/project-control/TASK_REGISTER.md` and `docs/INPUT_FILES.md` section 1.

| ID | Request | Blocks / affects |
|---|---|---|
| DESK-01 | `PMS_Scheme_Performance` as on 31-Aug and 30-Sep-2026 (#14) | blocks PMS steps 12-13 (B1) |
| DESK-02 | "October 2026" Monthly Investment Reckoner deck (#15, final issue) | blocks steps 14, 14a, 15 (B2) |
| DESK-03 | Fund Manager Data as on 30-Sep (then 31-Oct) (#11) | step 9 (B5, C15) |
| DESK-04 | Latest PMS & AIF Analytics (#16) | step 16 (B6) |
| DESK-05 | Equity and Hybrid Analytics including SIF / long-short schemes (#3-#4) | B4, C8 |
| DESK-06 | Current Exit Load & Expected IRR Return Range (P4) | C24 (99 records with no band), C6, C38, B7 |
| DESK-07 / -08 / -09 | SIF Master List (P3); Bond List naming its desk (P1); GIFT City list (P2) | B7; A1 gate inputs |
| DESK-10 | Closing-slides source (P5) and a balanced Disclaimer layout | C34, B7; DEC-OPEN-21 |
| DESK-11 / -12 / -13 | Motilal GIFT City label; Mosaic Series I/II; AMCs of Prism and Magnum Ex-Top 100 SIF (+ IRR bands) | C5, C4, C6, C38 (DEC-OPEN-11) |
| DESK-14 / -15 / -16 | Select alpha unit and period; Rf house rate; Sortino definition | C23; C11; C35 (B8 route) |
| DESK-17 / -18 / -19 / -20 / -21 / -22 | two Mirae FoFs' September returns; 4 Debt ETFs absent from the Sep Monitor; BHARAT Bond FoF Direct = Regular; HDFC FoF Select rationale; commodity ETF market cap; complete AMC prefix list | before client decks use them; C19 follow-up; C27; C26; C33; C31 |
| DESK-23 | Oct-2026 MF-cycle inputs #1-#11 and #13 (final issues; do **not** ask for #12 / #17) | TASK-021 |
| DESK-24 (optional) | ISIN in the Listed Direct Equity universe file | A14, TASK-044 |

## 12. Open OPS tasks and decisions

| ID | Item | Status | Waits for |
|---|---|---|---|
| TASK-017 | OneDrive health before any git or tool run | NOT STARTED | owner |
| TASK-019 | Send the desk pack; record replies | UNKNOWN / NEEDS INVESTIGATION | owner |
| TASK-020 | Sep-2026 Reckoner catch-up | BLOCKED | DESK-01..04 |
| TASK-021 | Oct-2026 MF cycle | PLANNED | DESK-23; TASK-024; TASK-022 for step 10 |
| TASK-024 | Apply or reject the 8 renames (in TASK-021 step 1) | BLOCKED | DEC-OPEN-08 |
| TASK-023 | Apply the C20 decision to all 13 JioBlackRock Regular records; release the held G-Sec record | BLOCKED | DEC-OPEN-07 |
| TASK-025 | PMS label (B1): relabel in a reviewed data PR, or close through TASK-020 | BLOCKED | DEC-OPEN-04 |
| TASK-027 | Bond 3Y/5Y = band average (`tools/merge_bond_list.js`, 14 OneDigital records) | BLOCKED | DEC-OPEN-09 |
| TASK-029 | Labels and AMCs: C5 Reckoner pin, C6/C38 AMC prefixes, C4 Mosaic | BLOCKED | DEC-OPEN-11; DESK-11..13 |
| TASK-035 | File the held 30-Apr Monitor (B9) | BLOCKED | DEC-OPEN-06 |
| TASK-038 | Closing slides: file the chosen source deck; re-lay the Disclaimer | BLOCKED | DEC-OPEN-21; DESK-10 |
| TASK-051 | Reclassify the 2 Hang Seng ETFs; the 27 records' ageing debt stats (C21) | BLOCKED | DEC-OPEN-20 |
| TASK-053 | `c` / `RISK_MATRIX_BENCH_SD` (C10) | BLOCKED | TASK-022 route |
| TASK-067, TASK-028, TASK-031 | shared with NB (section 5.4) | see 5.4 | DEC-OPEN-07, -10, -16 |
| TASK-063 (GOV) | Retention rule for `backups/` (two 19-Oct snapshots only) | UNKNOWN / NEEDS INVESTIGATION | - |

Decisions that gate OPS, in the order to ask: DEC-OPEN-02 and -03, then -01; DEC-OPEN-08; DEC-OPEN-04;
DEC-OPEN-07; DEC-OPEN-11; then DEC-OPEN-09, -10, -06, -20, -21. Plain-language write-ups and documented
recommendations: `docs/project-control/DECISION_LOG.md`.

## 13. OPS risks

| Risk | Mitigation |
|---|---|
| First real run of the documented process and of D61 auto-publish on the new build | run the Sep catch-up as the rehearsal: read every gate, do not waive anything without the owner, verify live before reporting "published" |
| Checkout hazard in the OneDrive folder (R6) during B1 / B3 | TASK-017 first; branch method decided in TASK-018 |
| Client-facing outliers baked without a bound: a since-inception value of ~297,765% (C43) and the JioBlackRock pre-launch returns (C20) | read young funds' `si` values in the bake output; TASK-067 and DEC-OPEN-07 |
| Rename `--apply` without the owner's answer would merge or orphan 8 funds | DEC-OPEN-08 before step 1 `--apply` |
| PMS refresh does not refresh the PMS/AIF benchmark rows (static since 20-May-2026, C41) | say so in the run report; TASK-065 after DEC-OPEN-27 |
| A missing input is not a stop, so a run can publish with some domains still behind | the report lists every domain's as-on date; `docs/PROJECT_STATE.md` "Data in force" updated in B7 |
| `monthly-updates/` (~446 MB) and `backups/` are local only; cloud backup UNKNOWN while OneDrive.exe is not running | TASK-017, TASK-070 |

---

## 14. Exact next steps (in order) with acceptance criteria

1. **TASK-016 (MOD-02).** Accept when `origin/main` is the merge of `handover/mod-01-to-mod-02-20261028`
   or newer, 0 open PRs, `verify_page` prints the K11 block, `npm test` 5 of 5 files (903 checks), live 7
   of 7 = `site/`, recorded in the integration log.
2. **TASK-017 (owner; MOD-02 verifies).** Accept when OneDrive.exe runs, 0 Offline files under the repo
   including `.git/objects/pack/`, `git fsck --connectivity-only` exits 0, and a historical blob read (e.g.
   `git show 792692d:site/index.html > /dev/null`) exits 0.
3. **TASK-064 (Workstream A).** Full browser acceptance on S7; acceptance criteria in the existing-dashboard
   handover section 9 step 3.
4. **Owner decision session for B8 (MOD-02 explains in plain language):** DEC-OPEN-02, DEC-OPEN-03, then
   DEC-OPEN-01; also DEC-OPEN-08. Accept when each answer is recorded in `docs/DECISIONS.md` (from D84) and
   in `docs/project-control/DECISION_LOG.md`, and the originating task is unblocked or closed.
5. **TASK-018 (docs only).** Accept when E6-E15 and the 28-Oct KNOWN_ISSUES corrections are fixed, the
   refresh branch method is written in the skill and the process doc and agrees with CLAUDE.md "Project
   control", the PR merges with `verify` green, and `site/` is unchanged.
6. **TASK-019 (owner).** Accept when the owner confirms which DESK requests were sent (dates) and MOD-02
   records them; replies are tracked against section 11.
7. **TASK-020 Sep-2026 Reckoner catch-up (OPS-01), when DESK-01 / -02 arrive.** Accept when every gate
   passes or an override was approved by the owner; `DATA_DATES.pms` matches the file content (B1 closed);
   Centricity Select keys in MASTER = total; `fund_mgr` full teams restored (C15) if DESK-03 came; update log,
   `docs/PROJECT_STATE.md`, `CHANGELOG.md` and the CLAUDE.md headline updated; published under D61; live 7 of
   7 = `site/`.
8. **TASK-070 then TASK-022 (NB-04), if the port is approved.** Change-impact contract and ARC-01 pre-check
   first. Accept on the criteria in section 5.2, merged before the Oct MF cycle reaches step 10.
9. **TASK-023 (after DEC-OPEN-07), before or with the October bake.** Accept when one reviewed data PR
   treats all 13 records per the decision, the held G-Sec record is released consistently, MASTER stays
   7,682, `financial-data-reviewer` signs off, and C16 / C20 are closed.
10. **TASK-021 Oct-2026 MF cycle (~13-17-Nov) with TASK-024.** Accept when renames are applied or rejected
    per the owner; the bake lines are read (not-merged list, WARN, CHECK about 42, unrecognised-sheet gate);
    step 9 runs after the bake; step 10 runs only with TASK-022 merged; SIF analytics included or the gap
    logged; update log `docs/update-log/2026-10_Oct-2026.md`; live check passes.
11. **Oct-2026 Reckoner cycle (~20-28-Nov).**
12. **NB P2 work between cycles:** TASK-042, then TASK-069 (with owner review of a rendered sample), then
    the decision-gated tasks of section 5.4 as decisions land; section 5.5 only on request.

## 15. Where the detail lives

| Subject | File |
|---|---|
| Current state, data in force, latest verification, next steps | [`../PROJECT_STATE.md`](../PROJECT_STATE.md) |
| Every PR, merge SHA, CI run, incident; last verified baseline | [`../project-control/INTEGRATION_AND_REGRESSION_LOG.md`](../project-control/INTEGRATION_AND_REGRESSION_LOG.md) |
| Tasks, requirements, open decisions | [`../project-control/TASK_REGISTER.md`](../project-control/TASK_REGISTER.md), [`../project-control/REQUIREMENTS_AND_CHANGE_REGISTER.md`](../project-control/REQUIREMENTS_AND_CHANGE_REGISTER.md), [`../project-control/DECISION_LOG.md`](../project-control/DECISION_LOG.md) |
| Approved decisions (D61, D72, D80-D83 matter most here) | [`../DECISIONS.md`](../DECISIONS.md) |
| Defects (authoritative) and regression-risk catalogue | [`../KNOWN_ISSUES.md`](../KNOWN_ISSUES.md), [`../project-control/KNOWN_ISSUES_AND_REGRESSION_RISKS.md`](../project-control/KNOWN_ISSUES_AND_REGRESSION_RISKS.md) |
| Ownership, single-writer rule, gates A-E, change-impact contract | [`../project-control/FILE_OWNERSHIP_AND_CHANGE_CONTROL.md`](../project-control/FILE_OWNERSHIP_AND_CHANGE_CONTROL.md), [`../project-control/ACTIVE_CHANGE_REGISTER.md`](../project-control/ACTIVE_CHANGE_REGISTER.md) |
| Data blocks, `window.H` / `REFRESH` / `EXPORTS`, tool CLI contract, ripple lists | [`../project-control/INTERFACE_CONTRACTS.md`](../project-control/INTERFACE_CONTRACTS.md) |
| Dependency and blast-radius map | [`../project-control/ARCHITECTURE_AND_DEPENDENCY_MAP.md`](../project-control/ARCHITECTURE_AND_DEPENDENCY_MAP.md) |
| PowerPoint audit and validation | [`../proposal-output-format-audit.md`](../proposal-output-format-audit.md) |
| Tests, browser checks, rehearsal harness | [`../TESTING.md`](../TESTING.md) |
| Branches, worktrees, stash, OneDrive state | [`../project-control/REPOSITORY_AND_ENVIRONMENT_STATE.md`](../project-control/REPOSITORY_AND_ENVIRONMENT_STATE.md) |

## 16. What this handover could not establish

| Item | What is missing | Who can close it |
|---|---|---|
| Whether any desk request was sent; whether the "October 2026" Reckoner deck is released | no record | owner (TASK-019) |
| How a refresh branches and commits under the no-checkout rule, or from a worktree | never exercised | TASK-018, then the first run |
| Whether D61 auto-publish works end to end | never exercised | the Sep catch-up |
| Whether the deck's figures still equal the portal's after PR #26 beyond the 73-row comparison recorded on 22-Oct | not re-run | a data-validation pass (REQ-PPT-130) |
| Whether the outgoing owner's toolchain runs and reproduces Sep-2026 here | never run (and not to be run without agreement) | TASK-022 regression test |
| Whether the two PMS/AIF holdings parsers agree | not compared | TASK-068 |
| Cloud backup of the local-only artefacts | OneDrive.exe not running | TASK-017, TASK-070 |

# Codebase Guardian handover (ARC-01) - 28-Oct-2026, v1

| Field | Value |
|---|---|
| Version | 1 |
| Date | 28-Oct-2026 |
| Author chat | MOD-01 (written for MOD-02 and for every ARC-01 invocation) |
| Status | Authoritative (current Guardian handover; [`README.md`](README.md) names the current version) |
| Supersedes | none (first Guardian handover) |
| Next review | when MOD-02 validates the package (TASK-016); then after every material merge, and whenever ARC-01 hands over |
| Code and data baseline | `origin/main` = `2b2a397` (PR #28 merge, 27-Oct-2026, docs only); site content state S7 since `5d39821` (PR #26) |

This is a dated snapshot. It is not proof of the current working tree, branch or integration state:
re-check with `git` and `gh` before relying on any state claim. Code and git win over this document.
Labels: VERIFIED (a command or file read is cited), INFERRED (reasoned from cited evidence), UNKNOWN.

---

## 1. Who ARC-01 is

Registry line: `ARC-01 | Project-Wide | Codebase Integrity & Integration Guardian | QUEUED`
(no review has run yet; see [`../project-control/CHAT_REGISTRY.md`](../project-control/CHAT_REGISTRY.md)).

ARC-01 is the independent technical control layer of the project. It reports to the Moderator
(MOD-02 after this handover) and to no one else.

| ARC-01 does | ARC-01 does not |
|---|---|
| Review change-impact contracts before material or high-risk work starts (Gate B pre-check) | Implement features, fixes or data changes, or edit any file |
| Review the actual diff and the current source after implementation (Gate B) | Make product, financial or data decisions (owner, through the Moderator) |
| Check file ownership and overlap with concurrent tasks | Approve or perform merges (Moderator, Gate D, with `release-manager`) |
| Check interface and schema compatibility, duplicated business logic, ripple effects | Replace independent verification (Gate C: `qa-verifier`, `verify-dashboard`, `financial-data-reviewer`) |
| Name the regression tests a change needs and the docs it makes stale | Talk to the owner, the desk or sub-chats directly |
| Assess integration and recovery risk; review recovery PRs after a failed integration | Run any tool with `--apply`, or any git command that changes state |

How it fits with the other specialists in `.claude/agents/` (9 files in all; `integration-guardian` is the 9th, added
by this package):

| Agent | Role | Relation to ARC-01 |
|---|---|---|
| `principal-architect` | Options and the simplest approach for a proposed change | ARC-01 reviews the chosen plan's contract, not the options |
| `repo-archaeologist` | Traces how something works today | ARC-01 may ask the Moderator for one when evidence is missing |
| `financial-data-reviewer` | Scale, provenance, matching, plausibility of financial data and logic | ARC-01 says when it is required; it does not do that review itself |
| `qa-verifier` / `verify-dashboard` skill | Gate C: parity counts, browser flows, exports | ARC-01 lists the tests; Gate C runs them |
| `security-reviewer` | Pre-push secrets and data-exposure review | required before every push; ARC-01 checks it is planned |
| `release-manager` | Gate D: PR, merge, live SHA-256 check | ARC-01 reviews before Gate D, never after it in place of it |
| `implementation-engineer`, `docs-keeper` | Implement; keep docs true | ARC-01 reviews their output |

Memory: a subagent keeps nothing between calls. ARC-01's durable memory is this handover plus
[`../project-control/ARCHITECTURE_AND_DEPENDENCY_MAP.md`](../project-control/ARCHITECTURE_AND_DEPENDENCY_MAP.md),
[`../project-control/INTERFACE_CONTRACTS.md`](../project-control/INTERFACE_CONTRACTS.md),
[`../project-control/ACTIVE_CHANGE_REGISTER.md`](../project-control/ACTIVE_CHANGE_REGISTER.md),
[`../project-control/INTEGRATION_AND_REGRESSION_LOG.md`](../project-control/INTEGRATION_AND_REGRESSION_LOG.md) and
[`../project-control/KNOWN_ISSUES_AND_REGRESSION_RISKS.md`](../project-control/KNOWN_ISSUES_AND_REGRESSION_RISKS.md).
Anything ARC-01 learns that a later review needs must be written into one of those files by the
Moderator (ARC-01 itself is read-only).

---

## 2. How the Moderator invokes ARC-01

### 2.1 Default: the subagent

Call the Agent tool with subagent type `integration-guardian` (definition:
[`../../.claude/agents/integration-guardian.md`](../../.claude/agents/integration-guardian.md), tools Read, Grep,
Glob, Bash, read-only use). Before the call, the Moderator runs `git fetch origin` in the main checkout (ARC-01
does not fetch). The prompt must give:

1. Mode: `PRE-CHECK` (contract, before implementation), `DIFF REVIEW` (after implementation) or
   `INTEGRATION CHECK` (before merging concurrent or overlapping changes, or after a failed integration).
2. Task and requirement IDs (TASK-nnn, REQ-nnn) and the chat that owns the task.
3. Where the change-impact contract is (file path or pasted text; master prompt section 11 lists its 12 items;
   the template is in [`../project-control/FILE_OWNERSHIP_AND_CHANGE_CONTROL.md`](../project-control/FILE_OWNERSHIP_AND_CHANGE_CONTROL.md)).
4. For a diff: branch, worktree path, PR number if any, base SHA and head SHA.
5. Which other tasks are active (from ACTIVE_CHANGE_REGISTER) and the question the Moderator wants answered.

If an item is missing, ARC-01 says so in its report and reviews only what it can see. It never guesses scope.

### 2.2 Long reviews: a dedicated ARC-01 session

For a review too large for one subagent call (for example folding siblings 3-5, C1 / TASK-045; the B8 risk
toolchain port, TASK-022; the first monthly refresh on the new build), the Moderator may start a separate
session named ARC-01. In the Claude desktop app's Code tab this is `start_session` (fresh context; the owner may
have to click a card); the brief is this handover plus the review request. A read-only review may share the
main checkout, but it must never run `git checkout` / `git switch` there (KNOWN_ISSUES R6). Outside the desktop
app the owner pastes the same brief into a new chat. Record the session in CHAT_REGISTRY when it starts
(statuses: ACTIVE, WAITING, COMPLETED, ...). Nothing depends on chat-to-chat messaging: the report reaches the
Moderator as the session's output, and the Moderator files what matters.

### 2.3 When the Moderator must call it

| Trigger | Gate | Mode |
|---|---|---|
| A material or high-risk task (section 2.4) is about to start | Gate B pre-check | PRE-CHECK of the contract |
| The contract's scope grows during implementation (new files, another chat's files) | Gate B pre-check (again) | PRE-CHECK of the updated contract |
| Implementation finished, Gate A report received (PR description + ACTIVE_CHANGE_REGISTER row) | Gate B | DIFF REVIEW of the branch or PR |
| Two or more open branches touch overlapping files or interfaces, or a branch is behind `origin/main` | before Gate D | INTEGRATION CHECK |
| A merge broke the live site or a gate | recovery | INTEGRATION CHECK of the evidence and the recovery PR |
| An entry in INTERFACE_CONTRACTS is to change | Gate B pre-check | PRE-CHECK listing every consumer |

A monthly refresh is HIGH risk by section 2.4. D61 lets it publish once every check passes. Recommendation
(not a decision): treat a short ARC-01 DIFF REVIEW of the block-level changes as one of those checks.

### 2.4 Risk classification used by ARC-01

If [`../project-control/FILE_OWNERSHIP_AND_CHANGE_CONTROL.md`](../project-control/FILE_OWNERSHIP_AND_CHANGE_CONTROL.md)
defines "material" differently, that file wins.

| Level | A change is at this level if it touches ... |
|---|---|
| HIGH | any sibling or the six-file deploy set; `MASTER` or any other data block; `window.REFRESH` parsers or inline load-time code (`linkIdcwToGrowth`, `applyPmsPerformance`); `window.EXPORTS` (deck or Excel); `window.H` predicates, aggregators or name resolution; `tools/lib/*`; pins and name joins (`tools/data/pins.json`, `PMS_PERF_ALIAS`, Reckoner joins); `tools/verify_page.js` or `.github/workflows/pages.yml`; CDN script tags or `package.json`; any client-facing number, label or "as on" date; any data refresh or data correction |
| MEDIUM | a top-level tool outside `tools/lib` (CLI, gates, writes); UI-only change with no data or export effect; tests only; docs that change an operating rule (`CLAUDE.md`, skills, agent files, process docs) |
| LOW | docs-only text that changes no rule; comments |

---

## 3. Dependency map summary and high-risk files

Authoritative detail: [`../project-control/ARCHITECTURE_AND_DEPENDENCY_MAP.md`](../project-control/ARCHITECTURE_AND_DEPENDENCY_MAP.md)
(dependency and blast-radius view) and [`../ARCHITECTURE.md`](../ARCHITECTURE.md) (overview). Line numbers below are
`site/index.html` at `2b2a397`; they drift with every edit, so re-find them with the grep pattern given.

The system in one paragraph (VERIFIED, architecture fact sheet): a static, build-less React 18 page,
`site/index.html` (12,864,963 B, 9,575 lines; `wc -l` prints 9,574 because there is no final newline; ends `</body></html>`), with every data set embedded as a
`window.X = <JSON>` literal, five sibling scripts that mutate those globals at load, and Node tools in `tools/`
that splice new data into the literals through `tools/lib/blocklib.js`. Load order: CDN libraries -> siblings 1-2
(`Centricity_ExtraSlides.js`, `Centricity_PMS_AIF_Terms.js`, ~L1232-1233) -> config -> `MASTER` (~L1434, 7,672
baseline records) -> analytics and Select -> `DATA_DATES` + `linkIdcwToGrowth()` -> `window.H` -> config +
`applyPmsPerformance()` (~L3054) -> `window.REFRESH` (~L3942) -> `window.EXPORTS` (~L5519) -> siblings 3-5
(June -> IRR/Offshore -> SIF, ~L5525-5527; grep `Centricity_June_Refresh`) -> `RISK_MATRIX` (~L5533) -> React UI.
The browser sees the effective state (MASTER 7,682); tools read and write the baseline literals.

High-risk areas, ranked by blast radius (from the architecture fact sheet, section 6):

| Rank | Area | Why it is high risk | Guard today |
|---|---|---|---|
| 1 | Siblings 3-5 and the six-file deploy | They re-apply on every load and silently override the block: deploying `index.html` alone reverts GIFT City, IRR bands, SIF rows, 12 PMS/AIF look-throughs and `DATA_DATES.sif` with no error | CI six-file presence check; `verify_page` `MISSING SIBLING` and effective counts |
| 2 | `MASTER` (~L1434, one 2.86 MB line) and the bake path (`tools/bake_month.js` + `REFRESH.parseMfMonitor`) | Every section, KPI and export reads MASTER; name identity drives every join | rename-first rule; duplicate-name gate; unrecognised-sheet gate; `verify_page` 0 duplicates |
| 3 | `window.REFRESH` parsers (~L3177-3944; grep `window.REFRESH = REFRESH`) | Used by the Section 7 uploads and by three tools offline: a page edit changes the next bake (A27); the Monitor /100 scale rule lives here | `parser_refresh_only.test.js`; `tools/dev/rehearse.js --old-site` (manual) |
| 4 | `window.EXPORTS` deck and Excel (~L3945-5521) | Client-facing deliverables; one measured design system lays out every native slide (D82) | `pptx_layout.test.js` (798 checks); manual PowerPoint render + `check_pptx_bounds.js`; Excel: manual only |
| 5 | `window.H` predicates, look-through and credit helpers (~L1907-2928) | Analytics, credit chart, overlap and net allocation on screen and in decks | single predicates (CLAUDE.md rule 8); review only |
| 6 | `tools/lib/blocklib.js` | Every tool write goes through it | `blocklib.test.js` (34); `</html>` guard; validate-all-then-write |
| 7 | Name-join tables (`tools/data/pins.json`, `PMS_PERF_ALIAS`, Reckoner joins) | A wrong pin shows another manager's numbers on a client fund | byte-exact names; trailing-space list; Reckoner drop gates (D71, D76) |
| 8 | Direct Equity joins (`merge_de_universe.js`, `merge_direct_equity_returns.js`) | 5,380 records; market-cap buckets drive equity analytics | top-10 "Large Cap" gate inside the tools only (A31) |
| 9 | `.github/workflows/pages.yml` | The only automated gate; a merge to `main` publishes within minutes | SHA-pinned actions; no branch protection (R9) |
| 10 | The repository inside OneDrive | Cloud-only `.git` packs; a checkout once truncated tracked files | rename retry in blocklib; no-checkout rule |
| 11 | Static `PMS_BENCHMARK_PERF` (~L3057) | PMS/AIF benchmark rows on screen, Excel and deck come from a literal no tool updates (C41) | none |
| 12 | `Centricity_ExtraSlides.js` | 2.6 MB of deck images | slide-size gates in the slide tools |

Coupling rules a reviewer must apply (VERIFIED in code by the architecture and interfaces fact sheets):

- Data a sibling owns must be changed in the sibling (D1; `docs/PRD.md` section 11.5): GIFT City bucket (June
  `NEW_GIFT`), 12 look-throughs (June `var EQ`), IRR bands of 2,065 funds and the 4 Offshore records (IRR sibling),
  all 30 SIF rows and `DATA_DATES.sif` (SIF sibling). The 12 legacy `product_class: "SIF"` rows in MASTER stay as
  they are.
- The vm tools (`bake_month`, `merge_analytics`, `fill_variant_analytics`, `merge_sif_monitor`) execute the page
  or sibling they are pointed at, so a parser or load-time code change is also a data-pipeline change (A27).
- `bake_month` runs every inline block, so the load-time mutations `applyPmsPerformance` and `linkIdcwToGrowth`
  are captured in the baked MASTER (35 records carry `_pms_source`; E15).
- Tool-written literals must occur exactly once (`blocklib.locate` refuses otherwise); `BENCHMARKS` has two
  literals and is hand-edited only.
- Nothing writes `PMS_AIF_TERMS`, `PMS_BENCHMARK_PERF`, `PMS_BM_FOR_SUB`, `RISK_MATRIX_BENCH_SD`, `BENCHMARKS`,
  `RATIONALE`, `LIQUIDITY_MAP`, `AMC_PREFIXES`, `MF_BM_*`, `LOGO_PRESETS` or `var OFFSHORE`: they are hand-edited.

---

## 4. Shared interfaces summary

Authoritative: [`../project-control/INTERFACE_CONTRACTS.md`](../project-control/INTERFACE_CONTRACTS.md). The contracts a
review most often hits:

| Contract | Where | Consumers | Rule for a change |
|---|---|---|---|
| Data block form `window.X = <compact JSON>`, one literal per prefix | `site/index.html`, sibling `var` blocks | 24 writing tools via `blocklib`; `tools/dev/rehearse.js:34-35`; `blocklib.test.js` | never add a second literal with the same prefix; change every locating tool in the same PR |
| Scale | MASTER returns, IRR, expense, YTM, m-cap split = decimals; analytics weights = percent; RISK_MATRIX `sd`, `al`, `dc`, `rr` = percent points; Monitor and SIF Monitor values always percent, /100, never auto-detected | parsers, merge tools, `H.fmtPct`, exports | CLAUDE.md rule 4; `financial-data-reviewer` |
| MASTER field set | `parseMfMonitor`, `parseMfMonitorDirect`, `tools/lib/direct_perf.js`, `H.toDirect` key list, `applyPmsPerformance` field list, `H.isExpectedReturn` | every section and export | change every listed reader and writer in the same PR; `financial-data-reviewer` |
| `DATA_DATES` keys and label styles | block ~L1448 (via `blocklib.setDataDate`), `DATA_DATES.riskMatrix` line ~L5535, SIF sibling line 61 | 29 page readers, export stamps, tool gates (`checkAsOn` long / short style) | change the anchored lines, their regexes and readers together |
| Sibling hooks and order | June -> IRR/Offshore -> SIF, all after `window.REFRESH` | `verify_page`, `pptx_layout.test`, `rekey_sif_analytics`, `fold_index_funds`, CI file list | keep the order; a sibling must not be loaded before ~L3942 |
| Single predicates | `H.isHybridScheme`, `H.isEquitySIF`, `H.isSelfDescribingDebt`, `H.creditBucket` | scope gates and aggregators | never re-inline their tests (CLAUDE.md rule 8) |
| `REFRESH` return shape (`skipped`, `unclassified`, `emptySheets`, `sheetRows`, `monitorNames`; `{ok, message}` / `{ok:false, error}`) | `site/index.html` REFRESH IIFE | `bake_month.js`, Section 7 handlers | `parser_refresh_only.test.js` |
| `EXPORTS` signatures, `window.__PPTX_LAYOUT`, `EXPORTS._ds` | `window.EXPORTS = {...}` ~L5519 | `App` callers, `pptx_layout.test.js` | change callers and the test together |
| Design-system constants (`DS`, `TXT`) | ~L4290-4366 | every native slide; `pptx_layout.test.js`; `tools/dev/check_pptx_bounds.js:18` `FOOT = 7.08` (= `DS.FOOT - DS.STAMP_H`) | change both together (D82) |
| Tool CLI contract (D72) | every tool | operators, the `monthly-update` skill, `tool_inputs.test.js` (fails when a new tool has no case) | exit 0 ok / 1 gate failed / 2 usage or input error; dry run by default |
| `verify_page.js` output labels | `tools/verify_page.js` | `pages.yml` exact-line greps (label padding matters) | change `pages.yml` in the same PR |
| Share link `#p=` payload `{c, u, r, s:[{n, p, st}]}` | encoder ~L7306-7320, `loadFromHash` ~L8894 | every link already sent to clients | old links must keep decoding |
| `tools/data/pins.json` names | four loaders | PMS alias, Reckoner pins | byte-exact; loaders exit 1 on an edge-space mismatch |
| CDN versions with SRI (React / ReactDOM 18.3.1, Chart.js 4.4.0, xlsx 0.18.5, pptxgenjs 3.12.0); Node `xlsx` 0.18.5 | `site/index.html` ~L1224-1228; `package.json` | page and tools (bake = upload parity) | forbidden without the owner's instruction (D67, D77, R4) |

---

## 5. Active ownership (28-Oct-2026)

VERIFIED (repository fact sheet, `gh pr list`, `git worktree list`, chats fact sheet):

- No coding task is active. No open pull request. No coding sub-chat is running (NB-01, NB-02, NB-03 are COMPLETED).
- The only change in flight while this file was written is TASK-015, this documentation package (MOD-01, main
  checkout, branch `handover/mod-01-to-mod-02-20261028`, no change to `site/` or `tools/`). Its ownership ends at
  the merge of `handover/mod-01-to-mod-02-20261028`.
- Leftover, not active: 3 registered worktrees, all clean on merged commits (`.claude/worktrees/adoring-boyd-7028f6`
  on `fix/a27-rehearse-old-site`, `.claude/worktrees/focused-wright-d50bee` on `fix/reckoner-drop-gates`,
  `%USERPROFILE%\AppData\Local\Temp\cpp-old` detached at `bf20c08`); 26 merged local branches; 25 merged
  branches on `origin`; one stash `stash@{0}` (19-Oct-2026) whose content is superseded and would revert Sep-2026
  page data if applied (never apply it; TASK-062). Clean-up waits for the owner (DEC-OPEN-22).
- Nothing is claimed in [`../project-control/ACTIVE_CHANGE_REGISTER.md`](../project-control/ACTIVE_CHANGE_REGISTER.md)
  for `site/`, the siblings or `tools/lib/`.

Single-writer rules ARC-01 enforces (package operating model): at most one active task may modify
`site/index.html`; at most one may modify each sibling and each file in `tools/lib/`; a monthly refresh (OPS) owns
all six deploy files for its whole duration. Ownership is recorded in ACTIVE_CHANGE_REGISTER before editing and
released at merge. Coding sub-chats work in their own worktree on a task branch cut from current `origin/main`;
the Moderator's main checkout stays on `main`.

---

## 6. Integration state and the last verified baseline

Authoritative running record: [`../project-control/INTEGRATION_AND_REGRESSION_LOG.md`](../project-control/INTEGRATION_AND_REGRESSION_LOG.md).
The Moderator updates the baseline there after every Gate D.

| Item | Value (28-Oct-2026 unless stated) | Label |
|---|---|---|
| Current main | `origin/main` = local `main` = `2b2a397` (PR #28 merge, 27-Oct-2026 12:27 UTC, docs only) | VERIFIED |
| Last site-changing merge | `5d39821` (PR #26, 22-Oct-2026): PowerPoint design system (D82) and `*` marker (D83) = site state S7; `site/` unchanged through `5bcce88` and `2b2a397` | VERIFIED |
| CI on `2b2a397` | push run 40503943213: `verify` and `publish` success; deployment 7358413557. Whole history: 58 runs, 58 success | VERIFIED |
| Live parity | 7 of 7 published files (index.html, 5 siblings, robots.txt) SHA-256 identical to `site/`; `index.html` SHA-256 `916f2455eebaf2362e60a97314203e8ffc52955892cfa04a5c5248301ac62ce3` (12,864,963 B); legacy `Centricity_Risk_Matrix.js` 404 (D78) | VERIFIED |
| `node tools/verify_page.js site` | exit 0: MASTER 7682; Select 178 (178 in MASTER); PMS 692 / AIF 12 / benchmarks 4; PMS_PERF_ALIAS 27 (4 null); EQUITY_ANALYTICS 1205; RISK_MATRIX 1088; PMS_AIF_TERMS 73; EXTRA_SLIDES 6; DATA_DATES performance / analytics / sif "30th September 2026", pms "31st August 2026", riskMatrix "30 Sep 2026"; 0 duplicates; ends `</html>`; PMS with perf 23 of 27; 0 script errors | VERIFIED |
| `npm test` | 5 of 5 files, 903 checks, 0 failures (blocklib 34, dates 10, parser_refresh_only 18, pptx_layout 798, tool_inputs 43) | VERIFIED |
| App startup in a browser | 28-Oct-2026 ~08:55 UTC, `preview_start playbook` at `2b2a397`: React root rendered, in-browser MASTER 7,682, `window.H` / `REFRESH` / `EXPORTS` present, all three sibling flags set, 0 console errors. A proposal was not built and nothing was exported | VERIFIED |
| Last full browser acceptance | site state S6 (`1523bbc` / `882160c`), 21-Oct-2026, all 7 areas PASS (PR #25). After PR #26 only a live 4-fund deck export was re-checked (22-Oct: 23 slides, no layout warning). A full pass on S7 is due (TASK-064) | VERIFIED (doc record); S7 pass PLANNED (TASK-064) |
| PowerPoint renders | 22-Oct-2026 COM renders of 6 decks; the 8 kept `bounds.jsonl` files re-checked 28-Oct with `check_pptx_bounds.js`: "no problem found" each (local `%TEMP%\x\`, not in the repo) | VERIFIED |
| Excel export | checked in a browser at earlier states (13 sheets); never opened in Microsoft Excel (REQ-019, TASK-064) | IMPLEMENTED NOT FULLY VERIFIED |
| Regressions | 28 PRs (#1-#28), 0 revert commits; no production regression caused by a new-build PR has been found; incidents INC-01..INC-17 are in the integration log | VERIFIED |

Integration history a reviewer needs (VERIFIED, integration fact sheet):

- `site/` was changed only by PRs #1 (move), #12, #13, #17, #18, #21, #22, #26; data only by #13 and #18. Only #18
  (data correction, D81) and #26 (deck, D82) waited for the owner's approval.
- PRs #4, #9 and #11 merged with heads one merge behind `main` (INC-17); their combined trees were tested only by
  the post-merge push run. #22 merged `origin/main` into its branch first because #21 had just changed
  `site/index.html`. Lesson: require the branch to contain current `origin/main` before Gate D.
- PR #23's code (A27, `tools/dev/rehearse.js --old-site`) exists only inside merge commit `18abff3`. `git log
  --no-merges` and `git log -p` without `-m` do not show it; use `git diff 18abff3^1 18abff3` or `git log -m
  --first-parent -p`.
- PR descriptions can overstate (INC-03: PR #10's body still claims flags that do not exist). Check every PR-body
  claim against the code.
- `main` has no branch protection and no rulesets (R9); "merge only after `verify` is green" is a convention the
  Moderator must keep.

---

## 7. Outstanding technical risks and regression-coverage gaps

Full catalogue (area, what can regress, how it shows, the gate that catches it, the gap, mitigation):
[`../project-control/KNOWN_ISSUES_AND_REGRESSION_RISKS.md`](../project-control/KNOWN_ISSUES_AND_REGRESSION_RISKS.md).
Defects themselves: [`../KNOWN_ISSUES.md`](../KNOWN_ISSUES.md) (authoritative). The ones that change how ARC-01 reviews:

| # | Risk or gap | KNOWN_ISSUES | What ARC-01 must do about it in a review | Closing task |
|---|---|---|---|---|
| 1 | A sibling that fails inside its try/catch only calls `console.error`: `verify_page` and CI count no script error | A30 | for any sibling or load-order change, require a browser console check (TESTING.md section 3 check 1) and the effective counts | TASK-042 |
| 2 | `verify_page` compares no count with a baseline; CI cannot see a silent count drop | A23 | compare `verify_page` output with the baseline in the integration log; every moved count needs a reason | TASK-042 |
| 3 | Two CLAUDE.md invariants are not enforced by `verify_page` or CI: top-10 Direct Equity by market cap are "Large Cap"; `DATA_DATES.sif` is not "-" | A31 | check both by hand for any data change | TASK-042 |
| 4 | No automated test exercises the Excel export (`exportXlsx` appears in no file under `tools/test/`, VERIFIED by grep); the workbook has never been opened in Excel | (REQ-019) | require a browser Excel export (13 sheets) for any change near `exportXlsx` / `perfRows` | TASK-064; no task yet for an automated Excel test |
| 5 | CI checks the deck geometry the export requested, not PowerPoint's own layout; COM render is manual (Windows + PowerPoint) | C44, C45 | require a render + `check_pptx_bounds.js` for any visible deck change; reject new direct `slide.addTable` calls and single-page `listTable` draws | TASK-069 |
| 6 | Page parser or load-time code changes alter the next bake (bake = upload) | A27 (closed: harness exists) | require `rehearse.js --old-site` evidence (local, needs `monthly-updates/`, root path shorter than 260 characters, E16) | - |
| 7 | Client-facing values with no writer: PMS/AIF benchmark rows read the static `PMS_BENCHMARK_PERF` (last changed 20-May-2026); the monthly `PMS_PERFORMANCE.benchmarks` is never read | C41 | flag any change near `pmsBenchmarkPerfFor`; do not let a refresh claim benchmarks were updated | TASK-065 (DEC-OPEN-27) |
| 8 | 12 RISK_MATRIX keys are unreachable (rows the SIF sibling removes); `merge_risk_matrix.js` checks keys against the baseline MASTER | C42 | key checks must use the effective MASTER | TASK-066 |
| 9 | One ETF carries `si` = 2977.646 (297,765%); the MF bake has no `si` bound | C43 (P1), C20 (P1) | for any data change, check since-inception outliers | TASK-067, TASK-023 |
| 10 | Risk matrix: no producer for the input workbooks; Rf 4.5% unconfirmed; two Sortino definitions; Python route unvalidated | B8 (P1), C11, C35, A22 | no risk-matrix route change without DEC-OPEN-01/02/03 and a Sep-2026 regression test | TASK-022, TASK-057 |
| 11 | Duplicated business logic: performance buckets x3 (C29); two Direct-plan parsers (A7); two PMS/AIF holdings parsers (A29); headline expected return computed two ways in five places (C24) | C29, A7, A29, C24 | reject a new copy; a change to one copy must say what happens to the others | TASK-046, TASK-039, TASK-068, TASK-026 |
| 12 | `rename_schemes.js` does not re-key `PMS_PERFORMANCE` / `PMS_PERF_ALIAS`, `PMS_AIF_TERMS`, `var SIF`, `NEW_GIFT`, `OFFSHORE`, `var EQ` or `pins.json` (INFERRED from the interfaces ripple list); 8 renames await the owner | A6 (closed) | a rename touching those stores needs a manual plan | TASK-024 (DEC-OPEN-08) |
| 13 | `main` unprotected: any merge publishes | R9 | INTEGRATION CHECK confirms `gh pr checks` green before Gate D | TASK-036 (DEC-OPEN-17) |
| 14 | OneDrive: 229 of 519 `.git` files cloud-only on 28-Oct; checkout can truncate tracked files; historical and stash blob reads fail with `mmap failed`; skill and process doc still say `git switch` | R6, E7 | never run checkout or switch; read old blobs through `gh api` (section 9) | TASK-017, TASK-018, TASK-037 |
| 15 | Six-file deploy (siblings not folded) | C1 (= D2 Open) | every data change: confirm the owning sibling was edited | TASK-045 (never inside a refresh) |
| 16 | Two-file writes are two renames, not one transaction | (blocklib contract) | require the six-file backup before any `--apply` | - |
| 17 | D61 auto-publish has never been exercised (no monthly refresh yet on the new build) | (REQ-044) | first refresh: review the full gate log, not only CI | TASK-020, TASK-021 |

---

## 8. The review checklist, mapped to this repository

ARC-01 applies every item. "N/A" needs a one-line reason.

| # | Item (master prompt section 8) | What to check here | How |
|---|---|---|---|
| 1 | Directly affected files | the exact file list; for `site/index.html`, which blocks or code regions changed | `gh pr diff <n> --name-only` or `git diff --name-status origin/main...<branch>`; for `site/index.html`: `git diff --stat` and `git diff -U0 origin/main...<branch> -- site/index.html \| cut -c1-300` (data lines are MB long); block-level comparison with a scratch Node script that calls `tools/lib/blocklib.js` `locate` on `git show origin/main:site/index.html` and `git show <branch>:site/index.html` |
| 2 | Downstream consumers | every reader and writer of what changed | ARCHITECTURE_AND_DEPENDENCY_MAP tools x blocks matrix; INTERFACE_CONTRACTS ripple list; Grep the symbol in `site/`, `tools/`, `tools/test/`, `.github/`, `.claude/skills/` (exclude `.claude/worktrees/`, which holds old copies) |
| 3 | Ripple effects | siblings re-applying over the change; next bake changing (A27); load-time mutations baked into MASTER; `DATA_DATES` readers; `verify_page` labels used by `pages.yml`; `DS.FOOT` vs `check_pptx_bounds.js` | section 3 coupling rules; section 4 table |
| 4 | Conflicts with concurrent tasks | single-writer rules; overlapping files or interfaces; branch behind main | ACTIVE_CHANGE_REGISTER; `gh pr list --state open`; `git worktree list`; `git branch --no-merged origin/main`; `git merge-base --is-ancestor origin/main <head>` (exit 0 = branch contains current main) |
| 5 | Interface and schema compatibility | block shapes, field names, scale, `DATA_DATES` styles, tool CLI and exit codes, `EXPORTS` signatures, share-link payload, pins names | INTERFACE_CONTRACTS; `tools/test/tool_inputs.test.js`; old share links must decode |
| 6 | Duplicate business logic | a new copy of a predicate, bucket, parser, name index or return rule | Grep for re-inlined tests (for example `asset_class === 'Hybrid'`, `/SIF$/`, `product_class === 'MLD'`); known copies in section 7 row 11; `SHEET_MAP` vs `rename_schemes.js` `SHEET_SUB` must stay equal (43 = 43 on 28-Oct) |
| 7 | Required regression tests | the minimum Gate C set for this change | table below |
| 8 | Documentation changes | docs the change makes stale | `CHANGELOG.md`, `docs/PROJECT_STATE.md` in every PR; `docs/DECISIONS.md` for a rule change; `docs/KNOWN_ISSUES.md` for a fixed or new defect; `docs/update-log/` for data; `tools/README.md` and the `monthly-update` skill for CLI changes; `docs/TESTING.md` for checks; `docs/OPERATING_MANUAL.md` traps; CLAUDE.md headline when counts move |
| 9 | Integration and recovery risks | what breaks if this merge is wrong, and how to undo it | six files deploy together; backup in `backups/<date>_<tag>/` before `--apply`; undo = revert PR (never force-push) or restore the six files from the backup; D61 auto-publish; no branch protection (R9); post-merge live SHA-256 check by `release-manager` |

Required tests by change type (Gate C runs them; ARC-01 names them):

| The change touches | Required before merge | Note |
|---|---|---|
| anything in `site/` | `node tools/verify_page.js site` (counts equal the baseline or every move explained); `npm test` 5 of 5; PR CI `verify` green; browser checks of `docs/TESTING.md` section 3 through the `verify-dashboard` skill or `qa-verifier`; after merge, live SHA-256 7 of 7 (`release-manager`) | |
| `REFRESH` parsers or inline load-time code | plus `parser_refresh_only.test.js` (extend it if behaviour changes) and `npm run rehearse -- --old <old checkout root> --old-site <old site dir> --case mf-chain-sep` | rehearsal is local only and needs `monthly-updates/` |
| a sibling or the script tags | plus effective counts and a clean browser console (A30) | load order June -> IRR/Offshore -> SIF |
| the deck (`buildDeck`, `DS`, `TXT`, `planTable`, `drawTable`) | plus `pptx_layout.test.js` (extend for a new slide type); a browser export with `window.__PPTX_LAYOUT.warnings` empty; `tools/dev/render_pptx.ps1` + `node tools/dev/check_pptx_bounds.js` on the 4-fund deck and the stress decks; for a visible change, the rendered sample goes to the owner before merge (PR #26 practice) | renders stay outside the repo or under `_testdata\` |
| the Excel export | a browser Excel export: 13 sheets, corpus in B2 (TESTING.md section 3 check 6); open it in Excel | no automated test exists |
| a top-level tool | `tool_inputs.test.js` (a new tool needs a case); a dry run on the current month's real inputs with every gate read; the rehearsal case that covers the tool | never `--apply` in review |
| `tools/lib/*` | plus `blocklib.test.js` / `dates.test.js`; a rehearsal run of the callers | blocklib has 24 writing callers |
| `tools/verify_page.js` labels or `pages.yml` | both in the same PR; the PR's own CI run green; `security-reviewer` for permission changes | |
| data (refresh or correction) | six-file backup; dry run of every tool with every gate read; `financial-data-reviewer`; an update-log entry (inputs with SHA-256, steps, gates, count changes); the two unenforced invariants checked by hand (A31) | a correction needs the owner's approval (PR #18 precedent); a refresh publishes under D61 |
| financial logic (returns, IRR, risk ratios, Rf, Sortino, buckets, credit) | plus `financial-data-reviewer`; a `docs/DECISIONS.md` entry if a rule changes | owner decides the rule |
| `package.json` or CDN tags | stop: forbidden without the owner's explicit instruction | D67, D77, R4 |
| docs only | check each factual claim against the code | INC-03 lesson |

---

## 9. Review technique in this repository (traps)

- Never Read `site/index.html` whole (12.8 MB, multi-MB lines) and never print a full patch of it. Use Grep with
  `-n`/`-o` and a narrow pattern, Read with offset/limit, `cut -c1-300` on diffs, or a scratch Node script.
- Never run `git checkout` or `git switch` in the main OneDrive checkout. To read a branch's version of a file use
  `git show <branch>:<path>` (works for current objects), read the task's worktree folder directly, or use
  `gh pr diff <n>`.
- Historical and stash blobs can fail with `fatal: mmap failed: Invalid argument` (R6). Fallback: fetch the blob with
  `gh api repos/productsteamcentricity/Centricity-Proposal-Playbook/git/blobs/<sha>` and confirm identity with
  `git hash-object`.
- Merge commits can carry code (PR #23 in `18abff3`): review with `git diff <merge>^1 <merge>`.
- Grep over `.claude/` also matches the old copies under `.claude/worktrees/`; exclude that folder.
- Line numbers in docs drift; re-derive them with Grep before citing. Cite `path:line` plus a grep pattern for
  `site/index.html`.
- Monthly workbooks under `monthly-updates/` are sensitive local data: never copy their contents into a report; a
  tool dry run reads them only when the Moderator asks for it.
- Helper scripts go in the session scratchpad or the OS temp folder, never in the repository. Write scripts to a
  file rather than piping them through stdin or heredocs (escape mangling on this machine, memory note).

---

## 10. Report format

ARC-01 returns one report per invocation. Authoritative template: the "Report format" section of
[`../../.claude/agents/integration-guardian.md`](../../.claude/agents/integration-guardian.md). Its parts: header (task,
mode, branch, base and head SHA, PR); verdict; risk level with a one-line reason; numbered findings (severity
BLOCKER / MAJOR / MINOR, evidence as `path:line` or command output, consequence, required action); the nine
checklist results; required tests with the expected result and who runs them; ownership and concurrency;
interface changes; docs to update; recovery plan; what was not checked and why.

| Verdict | Meaning for the Moderator |
|---|---|
| GO | no blocker; proceed through the normal gates with the listed tests |
| GO WITH CONDITIONS | proceed only after every listed condition is met (named tests passed, contract updated, docs added, owner decision recorded); the Moderator checks each condition before Gate D |
| STOP | at least one BLOCKER: ownership conflict, interface change without its consumers, data a sibling owns changed in the block, scale mismatch, fabricated or unsourced client-facing data, a failing or bypassed gate, or a claim that cannot be verified. Do not merge; send the findings back to the owning chat |

---

## 11. Recovery role

If a merge breaks the live site or a gate (master prompt section 13; package operating model):

1. The Moderator stops dependent merges and keeps the evidence (CI run, live SHA-256, console output, `verify_page`
   output).
2. The last verified baseline is the latest Gate D row in the integration log (today `2b2a397`; site content S7).
3. Code: `git revert` the merge commit in a new PR (never force-push, never reset `main`). Data: restore the six
   deploy files from `backups/<date>_<tag>/` on a `fix/` branch.
4. ARC-01 runs an INTEGRATION CHECK of the recovery PR: only the faulty change is undone, no unrelated work is lost,
   and the counts return to the baseline.
5. The Moderator records the incident (next INC number) in the integration log.

---

## 12. Handing over the Guardian

- The next version of this file is `CODEBASE_GUARDIAN_HANDOVER_<YYYY-MM-DD>_v<n>.md` in this folder; the old version
  stays (marked Historical snapshot) and [`README.md`](README.md) names the authoritative one.
- A dedicated ARC-01 session that must be replaced hands over to ARC-02 through
  `docs/handover/continuations/ARC-01_TO_ARC-02_SUCCESSOR_PROMPT_<YYYY-MM-DD>.md` (procedure:
  [`continuations/README.md`](continuations/README.md)); branch `handover/arc-01-to-arc-02-<YYYYMMDD>` if anything
  is committed.
- Update this file when the dependency map, the high-risk ranking, an interface contract, the baseline or the
  coverage gaps change materially.

---

## 13. Owner decisions that affect technical governance (open)

Detail and recommendations: [`../project-control/DECISION_LOG.md`](../project-control/DECISION_LOG.md).

| ID | Decision | Effect on reviews |
|---|---|---|
| DEC-OPEN-17 | Branch protection on `main` (require `verify`) | until decided, Gate D depends on the Moderator checking CI by hand |
| DEC-OPEN-19 | Keep the git clone inside OneDrive or move it out | until decided, the no-checkout rule and the `gh api` blob fallback stay |
| DEC-OPEN-22 | Repository hygiene (merged branches, worktrees, stash) and the merged-branch rule | until decided, ignore the leftovers listed in section 5 |
| DEC-OPEN-01, -02, -03 | Who builds the risk-ratio and NAV workbooks; Rf; Sortino definition | no risk-matrix route change before they are decided |
| DEC-OPEN-15 | One rule for the headline expected return | a change to any of the five places waits for it |
| DEC-OPEN-25 | One Moderator for both projects or one per project | ARC-01 covers this repository only; the sister Portfolio Review Dashboard is EXTERNAL |

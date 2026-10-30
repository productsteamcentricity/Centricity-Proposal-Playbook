# Task register

| Field | Value |
|---|---|
| Version | 1 |
| Date | 28-Oct-2026 |
| Author chat | MOD-01 (handover package, TASK-015) |
| Status | Authoritative for task state (what work exists, who owns it, what blocks it) |
| Supersedes | nothing (first version; task numbers did not exist before 28-Oct-2026) |
| Next review | MOD-02 at TASK-016, then at every status change |

## 1. What this file is, and what it is not

This file lists every unit of work on the Centricity Investment Proposal Dashboard, open and finished,
with a stable `TASK-nnn` ID. It is the coordination record that survives chat replacements.

| Question | Authoritative file |
|---|---|
| What work exists, its status, owner chat, blockers | this file |
| What the owner asked for (requirements, `REQ-nnn`, `REQ-PPT-nn`) | [`REQUIREMENTS_AND_CHANGE_REGISTER.md`](REQUIREMENTS_AND_CHANGE_REGISTER.md) |
| Defects and their severity (`A..`, `B..`, `C..`, `E..`, `F..`, `R..`) | [`../KNOWN_ISSUES.md`](../KNOWN_ISSUES.md) (snapshot index: [`KNOWN_ISSUES_AND_REGRESSION_RISKS.md`](KNOWN_ISSUES_AND_REGRESSION_RISKS.md)) |
| Approved decisions (`Dnn`) | [`../DECISIONS.md`](../DECISIONS.md) |
| Decisions waiting for the owner (`DEC-OPEN-nn`) | [`DECISION_LOG.md`](DECISION_LOG.md) |
| Which chat is editing which file right now | [`ACTIVE_CHANGE_REGISTER.md`](ACTIVE_CHANGE_REGISTER.md) |
| Chats, their status and successors | [`CHAT_REGISTRY.md`](CHAT_REGISTRY.md) |
| Where the project stands overall | [`../PROJECT_STATE.md`](../PROJECT_STATE.md) (the single state document) |

Code and git win over this file. A task is VERIFIED COMPLETE only when the evidence column names a
merged PR or commit and the check that verified it.

## 2. How to add or update a task

1. **Search first.** Before adding a task, search this file for the KNOWN_ISSUES ID, REQ ID or key words.
   If the owner repeats a request, update the existing task (add the new date and source to its
   evidence line). Never open a second task for the same work.
2. **New task = next free number.** Next free on 28-Oct-2026: **TASK-075**. Numbers are never reused,
   renumbered or recycled, even when a task is dropped (mark it SUPERSEDED and say by what).
3. **Every task records:** title (imperative), workstream (EX, NB, OPS, GOV), status, priority, owner
   chat, depends on, blocked by, acceptance criteria, evidence or next step, related REQ / KNOWN_ISSUES /
   Dnn / DEC-OPEN. Add it to the index (section 5) and to one group in section 6.
4. **Status words** (only these): VERIFIED COMPLETE, IMPLEMENTED NOT FULLY VERIFIED, IN PROGRESS, PLANNED,
   BLOCKED, NOT STARTED, EXISTING DEFECT, UNKNOWN / NEEDS INVESTIGATION, SUPERSEDED. BLOCKED always names
   the blocker (a decision, a desk file, an owner action).
5. **Priority:** P1 = before or during the next two monthly cycles, or client-facing integrity; P2 = soon;
   P3 = backlog. The engineering backlog is done only when the owner asks (`docs/PROJECT_STATE.md`,
   "Improvement backlog (only on request)").
6. **Owner chat:** a chat ID from `CHAT_REGISTRY.md` (MOD-02, NB-04, OPS-01 ...), "owner" for the
   owner's own actions, or "MOD-02 assigns" when no chat owns it yet. Before a chat edits files for a
   task, it records the task in `ACTIVE_CHANGE_REGISTER.md` (single-writer rule:
   `FILE_OWNERSHIP_AND_CHANGE_CONTROL.md`).
7. **Every status change is logged** in section 9 with the date, the old and new status, and the
   evidence (PR number, merge SHA, test output, owner message date). Change the task's own block in
   the same edit.
8. **Closing a task:** move it to section 7 (completed history) with its evidence; update the
   KNOWN_ISSUES entry, `CHANGELOG.md` and `docs/PROJECT_STATE.md` in the same branch, as CLAUDE.md
   "How every change is made" requires.
9. The register is edited only by the Moderator (or a chat it names), on a `docs/` branch, through a PR.

## 3. Key facts the tasks rely on (28-Oct-2026)

| Fact | Value | Label |
|---|---|---|
| Code and data baseline | `main` = `origin/main` = `2b2a397` (PR #28 merge, 27-Oct-2026); last site change `5d39821` (PR #26) | VERIFIED |
| `node tools/verify_page.js site` | exit 0; MASTER 7,682; Centricity Select 178 (178 in MASTER); PMS 692 / AIF 12 / benchmarks 4; RISK_MATRIX 1,088; EQUITY_ANALYTICS 1,205; 0 duplicates; 0 script errors | VERIFIED 28-Oct |
| `npm test` | 5 of 5 files, 903 checks, 0 failures | VERIFIED 28-Oct |
| Live site | https://productsteamcentricity.github.io/Centricity-Proposal-Playbook/ ; 7 of 7 published files SHA-256 identical to `site/` | VERIFIED 28-Oct |
| App startup in a browser | 28-Oct ~08:55 UTC, `preview_start playbook` at `2b2a397`: page renders, in-browser MASTER 7,682, three sibling flags set, 0 console errors. No proposal built and no export run. | VERIFIED |
| Last full 7-area browser acceptance | 21-Oct-2026 on site state S6 (before PR #26) | VERIFIED (doc record) |
| OneDrive | OneDrive.exe not running; repo folder not pinned; 229 of 519 `.git` files cloud-only; historical and stash blob reads fail with `mmap failed` | VERIFIED 28-Oct |
| Monthly inbox | `monthly-updates/00_INBOX/` holds only its README: no desk file has arrived | VERIFIED 28-Oct |
| Calendar | Sep-2026 Reckoner catch-up due now; Oct-2026 MF cycle ~13-17-Nov-2026; Oct-2026 Reckoner cycle ~20-28-Nov-2026; implied decision deadline ~13-Nov-2026 for DEC-OPEN-01/02/03/08 | INFERRED (documented cadence) |

**Never `git checkout` or `git switch` in the OneDrive main checkout** until TASK-017 passes (R6: a
checkout on 25-Oct truncated tracked files). Create branches with `git branch <new> <base>` and work in a
worktree. This overrides the `git switch` lines still in `.claude/skills/monthly-update/SKILL.md` and
`docs/MONTHLY_UPDATE_PROCESS.md` (KNOWN_ISSUES E7, fixed by TASK-018).

## 4. Start here: order of work for MOD-02 (dependency order)

1. **TASK-016** validate the package against the repo. No checkout/switch.
2. **TASK-017** (owner) restore OneDrive health. Gate for every later `git checkout`/`git switch`,
   history read and tool `--apply` run; read-only checks (`git fetch`, `verify_page`, `npm test`, the
   live site) and docs-only commits through the temporary index may run before it.
3. **TASK-064** full browser acceptance on the live build (Workstream A first, REQ-071). Uses the live
   site only, so it can run while TASK-017 is pending.
4. **Owner decision session** ([`DECISION_LOG.md`](DECISION_LOG.md)), in this order: DEC-OPEN-02 and -03,
   then -01 (by ~13-Nov-2026); -08 (by ~13-Nov-2026); -04; -05; -07; -13 / -14 / -24; then the rest.
5. **TASK-019** (owner) send the desk request pack (Appendix A), PMS, Reckoner, Fund Manager and
   Analytics first.
6. **TASK-018** docs-consistency PR (docs only), once TASK-017 passes.
7. **Housekeeping** once the owner agrees (DEC-OPEN-22): TASK-061 (worktrees) -> TASK-060 (local
   branches) -> TASK-059 (remote branches); TASK-062 exports the stash patch before any drop.
8. **TASK-020** Sep-2026 Reckoner catch-up when DESK-01/02 arrive (fold in TASK-025 and the C5 pin of
   TASK-029 if decided by then).
9. **TASK-022** NAV / risk-ratio producer after DEC-OPEN-01/02/03, regression-tested against Sep-2026,
   ideally before step 11.
10. **TASK-023** C20 change after DEC-OPEN-07, before or with the October bake.
11. **TASK-021** Oct-2026 MF cycle ~13-17-Nov-2026 with TASK-024 (renames); risk matrix only if TASK-022
    is ready.
12. Oct-2026 Reckoner cycle ~20-28-Nov-2026 (not yet a task: MOD-02 registers it with the next free
    number when it schedules it).
13. **TASK-032 / TASK-033 / TASK-034** as the owner and the outgoing owner act; the old site is retired
    only after the owner signs the full-test checklist.
14. Remaining follow-through tasks as decisions land; engineering backlog only on request.

## 5. Index of all tasks

Groups: R = before the next refresh; O = waiting for an owner decision; D = waiting for desk files or
answers; E = engineering; H = housekeeping; G = governance; Done = completed history (section 7).

| ID | Title (short) | WS | Status | Prio | Owner chat | Group |
|---|---|---|---|---|---|---|
| TASK-001 | Stage A replication and transfer | EX | VERIFIED COMPLETE | - | MOD-01 | Done |
| TASK-002 | Foundation fix (blocklib, verify_page exit 1, tests) | NB | VERIFIED COMPLETE | - | MOD-01 | Done |
| TASK-003 | Three P1 tool risks A1/A3/A4 | NB | VERIFIED COMPLETE | - | NB-01 | Done |
| TASK-004 | Tool hardening packages A-E | NB | VERIFIED COMPLETE | - | MOD-01 | Done |
| TASK-005 | Page fixes (dates, dagger, SRI, noindex, favicon) | NB | VERIFIED COMPLETE | - | MOD-01 | Done |
| TASK-006 | Sep-2026 Run 2 data corrections | OPS | VERIFIED COMPLETE | - | MOD-01 | Done |
| TASK-007 | Docs brought in line with PRs #3-#15 | GOV | VERIFIED COMPLETE | - | MOD-01 | Done |
| TASK-008 | Outgoing-owner data-extraction prompt | EX | VERIFIED COMPLETE | - | MOD-01 | Done |
| TASK-009 | C19 parser fix | NB | VERIFIED COMPLETE | - | MOD-01 | Done |
| TASK-010 | Sep-2026 Run 3 (214 funds) | OPS | VERIFIED COMPLETE | - | MOD-01 | Done |
| TASK-011 | Five P3 follow-ups (PRs #19-#23) | NB | VERIFIED COMPLETE | - | NB-02 | Done |
| TASK-012 | Live acceptance check, 7 areas | EX | VERIFIED COMPLETE | - | MOD-01 | Done |
| TASK-013 | PowerPoint design system | NB | IMPLEMENTED NOT FULLY VERIFIED | - | NB-03 | Done |
| TASK-014 | Ingest the outgoing owner's export | EX | VERIFIED COMPLETE | - | MOD-01 | Done |
| TASK-015 | Produce the MOD-01 -> MOD-02 handover package | GOV | IN PROGRESS | P1 | MOD-01 | G |
| TASK-016 | MOD-02 validates the package | GOV | PLANNED | P1 | MOD-02 | G |
| TASK-017 | Restore OneDrive health | OPS | NOT STARTED | P1 | owner; MOD-02 verifies | R |
| TASK-018 | Docs-consistency PR (E6-E15 and corrections) | GOV | NOT STARTED | P2 | MOD-02 | R |
| TASK-019 | Owner sends the desk request pack | OPS | UNKNOWN / NEEDS INVESTIGATION | P1 | owner | R |
| TASK-020 | Sep-2026 Reckoner catch-up | OPS | BLOCKED | P1 | MOD-02 assigns (OPS-01) | R |
| TASK-021 | Oct-2026 MF cycle | OPS | PLANNED | P1 | MOD-02 assigns | R |
| TASK-022 | Producer of NAV Data and Fund Risk Ratios | NB | BLOCKED | P1 | MOD-02 assigns | O |
| TASK-023 | Apply the C20 decision (13 JioBlackRock records) | OPS | BLOCKED | P1 | MOD-02 assigns | O |
| TASK-024 | Apply or reject the 8 scheme renames | OPS | BLOCKED | P1 | MOD-02 assigns | O |
| TASK-025 | PMS label (B1) | OPS | BLOCKED | P1 | MOD-02 assigns | O |
| TASK-026 | One rule for the headline expected return | NB | BLOCKED | P2 | MOD-02 assigns | D |
| TASK-027 | Bond 3Y/5Y = band average | OPS | BLOCKED | P2 | MOD-02 assigns | O |
| TASK-028 | Remove 4 segregated side-pocket records | OPS/NB | BLOCKED | P3 | MOD-02 assigns | O |
| TASK-029 | Labels and AMCs (C4, C5, C6, C38) | OPS | BLOCKED | P2 | MOD-02 assigns | D |
| TASK-030 | Select popover alpha and ratio dating | NB | BLOCKED | P2 | MOD-02 assigns | D |
| TASK-031 | Return basis in the data (C28) | OPS/NB | BLOCKED | P2 | MOD-02 assigns | D |
| TASK-032 | R8 client items decision | GOV | BLOCKED | P1 | owner + compliance; MOD-02 records | O |
| TASK-033 | R1 upstream purge and old-site notice | GOV | BLOCKED | P1 | owner (relay); MOD-02 records | O |
| TASK-034 | Retire the old site after full testing | EX | PLANNED | P2 | owner + outgoing owner; MOD-02 coordinates | O |
| TASK-035 | File the held 30-Apr MF Monitor | OPS | BLOCKED | P3 | MOD-02 assigns | O |
| TASK-036 | Branch protection on `main` | GOV | BLOCKED | P3 | MOD-02 (owner instruction only) | O |
| TASK-037 | Move the git clone out of OneDrive | GOV | BLOCKED | P2 | MOD-02 + owner | O |
| TASK-038 | Closing slides and Disclaimer layout | OPS | BLOCKED | P3 | MOD-02 assigns | D |
| TASK-039 | One Direct-plan parser | NB | NOT STARTED | P2 | MOD-02 assigns (on request) | E |
| TASK-040 | AIF merge gates and as-on date | NB | NOT STARTED | P2 | MOD-02 assigns (on request) | E |
| TASK-041 | `add_reckoner_funds.js` deck index and schema check | NB | NOT STARTED | P2 | MOD-02 assigns (on request) | E |
| TASK-042 | `verify_page.js` and CI hardening (A23, A30, A31) | NB | NOT STARTED | P2 | MOD-02 assigns | E |
| TASK-043 | `tools/lib` pptx / Reckoner parser fixes | NB | NOT STARTED | P3 | MOD-02 assigns (on request) | E |
| TASK-044 | DE universe ISIN join | NB | NOT STARTED | P3 | MOD-02 assigns (on request) | D |
| TASK-045 | Fold siblings 3-5 into `index.html` | NB | NOT STARTED | P2 | MOD-02 assigns | E |
| TASK-046 | One shared performance-bucket function | NB | NOT STARTED | P3 | MOD-02 assigns (on request) | E |
| TASK-047 | Per-bucket as-on date on the Performance tab | NB | NOT STARTED | P3 | MOD-02 assigns (on request) | E |
| TASK-048 | Debt Analytics picker vs hint | NB | NOT STARTED | P3 | MOD-02 assigns (on request) | E |
| TASK-049 | Deterministic issuer bucket | NB | NOT STARTED | P3 | MOD-02 assigns (on request) | E |
| TASK-050 | Split the rename "new to MASTER" count | NB | NOT STARTED | P3 | MOD-02 assigns (on request) | E |
| TASK-051 | Hang Seng ETFs and ageing debt stats | OPS | BLOCKED | P3 | MOD-02 assigns | O |
| TASK-052 | Complete the AMC prefix list | NB | BLOCKED | P3 | MOD-02 assigns | D |
| TASK-053 | Restore or drop `c` / `RISK_MATRIX_BENCH_SD` | OPS | BLOCKED | P3 | MOD-02 assigns | O |
| TASK-054 | Correct PRD facts; rewrite or retire runbooks/specs | GOV | NOT STARTED | P2 | MOD-02 | G |
| TASK-055 | Favicon PNG data URI; drop unused tenor column | NB | NOT STARTED | P3 | MOD-02 assigns (on request) | E |
| TASK-056 | Fix the stale `.gitattributes` comment | GOV | NOT STARTED | P3 | MOD-02 | H |
| TASK-057 | Validate or retire `build_risk_matrix.py` | NB | BLOCKED | P2 | MOD-02 assigns | O |
| TASK-058 | SheetJS upgrade (page and tools together) | NB | NOT STARTED | P3 | MOD-02 assigns (owner instruction only) | O |
| TASK-059 | Delete the 25 merged branches on origin | GOV | NOT STARTED | P3 | MOD-02 | H |
| TASK-060 | Delete the 26 merged local branches | GOV | NOT STARTED | P3 | MOD-02 | H |
| TASK-061 | Remove the 3 extra worktrees | GOV | NOT STARTED | P3 | MOD-02 | H |
| TASK-062 | Export, then drop `stash@{0}` | GOV | NOT STARTED | P3 | MOD-02 | H |
| TASK-063 | Retention rule for `backups/` | GOV | UNKNOWN / NEEDS INVESTIGATION | P3 | MOD-02 | H |
| TASK-064 | Full browser acceptance on the live build | EX | PLANNED | P1 | MOD-02 (or EX-01) | R |
| TASK-065 | PMS/AIF benchmark rows from the decided source | NB | BLOCKED | P2 | MOD-02 assigns | O |
| TASK-066 | 12 unreachable RISK_MATRIX keys; effective-MASTER key check | NB | NOT STARTED | P2 | MOD-02 assigns | E |
| TASK-067 | Since-inception outliers: `si` bound in the MF bake | OPS/NB | NOT STARTED | P1 | MOD-02 assigns | E |
| TASK-068 | Compare the two PMS/AIF holdings parsers | NB | NOT STARTED | P3 | MOD-02 assigns (on request) | E |
| TASK-069 | Deck: Construct/NAA through the design system; all `listTable` pages | NB | NOT STARTED | P2 | MOD-02 assigns | E |
| TASK-070 | Inventory and secure local-only artefacts | GOV | NOT STARTED | P2 | MOD-02 + owner | H |
| TASK-071 | Move memory-only procedures into repo docs | GOV | PLANNED | P2 | MOD-02 | G |
| TASK-072 | Fresh-clone setup test | GOV | NOT STARTED | P3 | MOD-02 assigns | G |
| TASK-073 | Outgoing-owner claude.ai export and history summary | EX | BLOCKED | P2 | owner (request); MOD-02 (reconcile) | O |
| TASK-074 | Record conversation-only owner decisions as D-numbers | GOV | PLANNED | P2 | MOD-02 | G |

Counts (28-Oct-2026): 74 tasks. Completed history 14 (13 VERIFIED COMPLETE, 1 IMPLEMENTED NOT FULLY
VERIFIED). Open 60: BLOCKED 23, NOT STARTED 28, PLANNED 6, UNKNOWN / NEEDS INVESTIGATION 2, IN PROGRESS 1.
By group: R 6, O 18, D 7, E 16, H 7, G 6.

## 6. Open tasks

Field key: **WS** workstream; **Owner** owner chat; **Dep** depends on; **Blk** blocked by; **Accept**
acceptance criteria; **Next** next step; **Rel** related REQ / KNOWN_ISSUES / Dnn / DEC-OPEN.
`site/index.html` line numbers are as of `2b2a397` and drift: re-find them with the grep pattern given.

### 6.1 Before the next refresh (R)

#### TASK-017 Restore OneDrive health before any checkout, history read or `--apply` run
- WS OPS | Status NOT STARTED | P1 | Owner: owner (machine setting); MOD-02 verifies | Dep: - | Blk: owner action
- Accept: OneDrive.exe running; repo folder set to "Always keep on this device"; 0 files with the Offline
  attribute under the repo, including `.git/objects/pack/`; `git fsck --connectivity-only` exit 0; a
  `git cat-file -p` of an object stored in `pack-631ec788...` succeeds; result logged in
  `docs/PROJECT_STATE.md` and `REPOSITORY_AND_ENVIRONMENT_STATE.md`.
- Next: owner starts OneDrive and pins the folder; MOD-02 runs the attribute scan and the two git checks.
  Until it passes: no `git checkout`/`git switch`, no `--apply` runs.
- Rel: R6, E10, R11; DEC-OPEN-19; INC-16.

#### TASK-064 Full browser acceptance pass on the current live build (site state S7)
- WS EX | Status PLANNED | P1 | Owner: MOD-02 (or a new EX-01) | Dep: TASK-016 | Blk: -
- Accept: the `verify-dashboard` skill run against the live URL; all 11 checks of `docs/TESTING.md`
  section 3 PASS (the 21-Oct pass grouped its work into 7 areas, `docs/PROJECT_STATE.md`); a proposal built end to end; PowerPoint export with `window.__PPTX_LAYOUT.warnings`
  empty; Excel export opened in Microsoft Excel (never done so far); browser console clean; a draft
  full-test checklist for the owner (input to DEC-OPEN-24); results recorded in `docs/PROJECT_STATE.md`
  and `INTEGRATION_AND_REGRESSION_LOG.md`.
- Next: run after TASK-016. Startup alone was VERIFIED on 28-Oct (no export); the last 7-area pass was
  21-Oct on S6, before PR #26.
- Rel: REQ-019, REQ-049, REQ-071; R7; DEC-OPEN-24; TASK-034.

#### TASK-019 Owner sends the desk request pack DESK-01..DESK-23 (DESK-24 optional)
- WS OPS | Status UNKNOWN / NEEDS INVESTIGATION (no record that any request was sent) | P1 | Owner: owner;
  MOD-02 records what was sent and the replies | Dep: - | Blk: only the owner contacts the desk
- Accept: owner confirms each request sent (date); each reply tracked against Appendix A; files that
  arrive are dropped in `monthly-updates/00_INBOX/`.
- Next: MOD-02 asks the owner which requests were already sent and gives the pack (Appendix A) as a
  ready-to-send list. Order: DESK-01, -02, -03, -04 first (they block TASK-020).
- Rel: B1, B2, B4-B7, C4-C6, C11, C23, C24, C26, C27, C31, C33, C35, C38.

#### TASK-018 Docs-consistency PR (docs only)
- WS GOV | Status NOT STARTED | P2 | Owner: MOD-02 | Dep: TASK-016; TASK-017 (for the branch wording) | Blk: -
- Accept: fix KNOWN_ISSUES E6-E15 and every correction in the 28-Oct KNOWN_ISSUES list that the package
  did not already make (C24 paths, C17 `NOTE_Y`/`mk`, B8 stale sentence, A2 exit code, C39 two parser
  sites, C28 count 14, stale line references in C1/R5/C10/C12, E2 PRD `fl`, R6/R7 additions); the
  OneDrive-safe branch procedure replaces `git switch` in `.claude/skills/monthly-update/SKILL.md` and
  `docs/MONTHLY_UPDATE_PROCESS.md`; `docs/HANDOVER.md` section 5/8 and `monthly-updates/00_INBOX/README.md`
  rows 12/17 match B8; release docs match the decided branch rule (DEC-OPEN-22). Every changed statement
  agrees with the code (for example every tool exits 2 on a missing input: `tools/merge_reckoner.js:45-46`);
  docs-only PR merged with `verify` green; `site/` unchanged.
- Next: after TASK-017, one `docs/` branch from `origin/main`, created with `git branch` in a worktree.
- Rel: E6-E15; A2, B8, C17, C24, C28, C39, R6, R7; REQ-028, REQ-041.

#### TASK-020 Sep-2026 Reckoner catch-up: `/monthly-update September 2026`
- WS OPS | Status BLOCKED | P1 | Owner: MOD-02 assigns (proposed OPS-01) | Dep: TASK-017; TASK-018
  advisable; DEC-OPEN-04 if no PMS file comes; DEC-OPEN-11 before process steps 14/14a | Blk: DESK-01,
  DESK-02, DESK-03, DESK-04 (inbox empty on 28-Oct, VERIFIED)
- Inputs: the "October 2026" Monthly Investment Reckoner deck, `PMS_Scheme_Performance` as on 30-Sep-2026,
  Fund Manager Data as on 30-Sep-2026, latest PMS & AIF Analytics (process steps 9, 12, 13, 14, 14a, 15,
  16, 17 of `docs/MONTHLY_UPDATE_PROCESS.md`).
- Accept: every gate PASS or waived by the owner (`--accept-drops` only by the owner); `DATA_DATES.pms`
  label matches the file content (B1 closed); Centricity Select keys in MASTER = total; full fund-manager
  teams restored (C15); update log, `docs/PROJECT_STATE.md` and the CLAUDE.md headline updated; live files'
  SHA-256 = `site/`. Publishes automatically when every check passes (D61).
- Next: when the files arrive, the assigned chat owns all six deploy files for the run (single-writer
  rule) and follows the skill with the no-checkout branch method.
- Rel: B1, B2, B5, B6, C4, C5, C15, C26, A19, A20; D61; REQ-044; TASK-025, TASK-029.

#### TASK-021 Oct-2026 MF cycle: `/monthly-update October 2026` (data 31-Oct-2026), ~13-17-Nov-2026
- WS OPS | Status PLANNED | P1 | Owner: MOD-02 assigns | Dep: TASK-017; TASK-024 before step 1 `--apply`;
  TASK-022 (otherwise the Portfolio Matrix keeps "30 Sep 2026") | Blk: DESK-23, DESK-05, DESK-03
- Accept: renames applied or rejected per the owner (TASK-024); every gate passes; the bake lines are read
  (not-merged list, WARN lines, CHECK count about 42, the unrecognised-sheet FAIL gate); step 9 runs after
  the bake; SIF analytics included or the gap logged; `docs/update-log/2026-10_Oct-2026.md` written; live
  check passes. Publishes automatically when every check passes (D61).
- Next: confirm DEC-OPEN-08 and DEC-OPEN-01 by ~13-Nov-2026; ask the owner to request DESK-23 after 31-Oct.
- Rel: A6, A14, B4, B5, C8, C15, C19, C21, C40; D46, D61, D80; REQ-044.

### 6.2 Waiting for an owner decision (O)

#### TASK-022 Build the producer of NAV Data (#17) and Fund Risk Ratios & 3Y Rolling (#12)
- WS NB | Status BLOCKED | P1 | Owner: MOD-02 assigns | Dep: DEC-OPEN-02 and DEC-OPEN-03, then DEC-OPEN-01;
  TASK-070 (the outgoing owner's toolchain is a local-only copy) | Blk: owner decision
- Accept (if the documented port route is chosen): Node tools in `tools/`, dry-run by default, D72 exit-code
  contract; a regression test that reproduces the live Sep-2026 workbook and therefore the live
  `RISK_MATRIX` (1,088 entries, 33 `fl` flags: 28 split, 5 lowcorr) through `tools/merge_risk_matrix.js`
  with 0 differences; monthly steps documented (AMFI NAV history fetch; five Nifty index files downloaded by hand, B8);
  `docs/INPUT_FILES.md` #12/#17, `docs/MONTHLY_UPDATE_PROCESS.md` and a DECISIONS entry updated.
- Next: owner answers DEC-OPEN-01 (buttons offered on 27-Oct: "Yes, rebuild them" / "Desk will provide").
- Rel: B8, C10, C11, C35, A22, C42; D43, D58; TASK-057, TASK-053, TASK-066.

#### TASK-023 Apply the C20 decision to all 13 JioBlackRock Regular records; release the held G-Sec record
- WS OPS | Status BLOCKED | P1 | Owner: MOD-02 assigns | Dep: DEC-OPEN-07 | Blk: owner decision
- Accept: one reviewed data PR; all 13 records treated per the decision; the held G-Sec record (C16)
  refreshed consistently; `financial-data-reviewer` sign-off; MASTER count 7,682 unchanged; C16 and C20
  closed; written through `tools/lib/blocklib.js`.
- Next: owner answers DEC-OPEN-07.
- Rel: C20, C16, C43; D81; TASK-067.

#### TASK-024 Apply or reject the 8 scheme renames (inside TASK-021 step 1)
- WS OPS | Status BLOCKED | P1 | Owner: MOD-02 assigns | Dep: DEC-OPEN-08 | Blk: owner decision
- Accept: `tools/rename_schemes.js --apply` only for approved pairs (the tool also re-keys the IRR map in
  `site/Centricity_IRR_Offshore.js`); the next bake refreshes renamed records through the refresh-only path;
  the not-merged list shrinks by the applied count.
- Next: owner answers DEC-OPEN-08 by ~13-Nov-2026.
- Rel: A6, C19; D46, D79.

#### TASK-025 PMS label (B1): relabel `DATA_DATES.pms` or close through TASK-020
- WS OPS | Status BLOCKED | P1 | Owner: MOD-02 assigns | Dep: DEC-OPEN-04 | Blk: owner decision
- Accept: if relabel: `DATA_DATES.pms` (grep `DATA_DATES`, ~L1451) reads the true as-on date in a reviewed
  data PR; if wait: closed by TASK-020 with new PMS files.
- Next: owner answers DEC-OPEN-04.
- Rel: B1, C26, C30; REQ-PPT-64.

#### TASK-027 Bond 3Y/5Y = band average
- WS OPS | Status BLOCKED | P2 | Owner: MOD-02 assigns | Dep: DEC-OPEN-09 | Blk: owner decision
- Accept: `tools/merge_bond_list.js:198` (today `r1y: b.hi, ... r3y: b.hi, r5y: b.hi`) writes the agreed
  value; the 14 OneDigital bond records updated in a reviewed data change; Invictus records (irr_low =
  irr_high) unchanged; DECISIONS entry.
- Next: owner answers DEC-OPEN-09.
- Rel: C37, C28.

#### TASK-028 Remove the 4 segregated side-pocket records; widen the parser skip
- WS OPS/NB | Status BLOCKED | P3 | Owner: MOD-02 assigns | Dep: DEC-OPEN-10 | Blk: owner decision
- Accept: the 4 records (2 Franklin "Segregated Portfolio 3", 2 UTI "(Segregated - 06032020)") removed;
  the skip matches any "segregated" name at both parser sites (grep `segregated portfolio`, ~L3347 and
  ~L3415); a parser unit test; the MASTER change explained (7,682 -> 7,678 expected).
- Next: owner answers DEC-OPEN-10.
- Rel: C39, C24, C40.

#### TASK-032 R8: decide on the two client items in the export (and the R1 repo zip)
- WS GOV | Status BLOCKED | P1 | Owner: owner + compliance; MOD-02 records | Dep: DEC-OPEN-05 | Blk: owner +
  compliance
- Accept: the decision recorded in KNOWN_ISSUES R8 and `docs/update-log/2026-10-23_handover-export.md`;
  the outgoing owner told; Claude never deletes them (deletion is the owner's own act); nobody pushes
  `refs/remotes/upstream/*` or uses `--mirror`.
- Next: owner raises it with compliance.
- Rel: R8, R1; INC-15.

#### TASK-033 R1: upstream repository purge and old-site notice (outgoing owner's actions)
- WS GOV | Status BLOCKED | P1 | Owner: owner (relays to the outgoing owner); MOD-02 records, then cleans the
  local remote | Dep: DEC-OPEN-13 | Blk: outgoing owner
- Accept: the unredacted file is absent from every upstream ref, or the upstream repo is private or
  deleted (on 28-Oct it was public and the file present, VERIFIED); the old site gone or showing a notice;
  GitHub Support asked to clear cached views; afterwards the local `upstream` remote removed or re-fetched
  so `refs/remotes/upstream/*` no longer hold the unredacted objects.
- Next: owner sends the request (DEC-OPEN-13 lists the three actions).
- Rel: R1, R7, R8; D64.

#### TASK-034 Retire the old site after full testing of the new build
- WS EX | Status PLANNED | P2 | Owner: owner + outgoing owner; MOD-02 coordinates | Dep: TASK-064,
  DEC-OPEN-24, DEC-OPEN-14, TASK-033 | Blk: owner sign-off; outgoing owner action
- Accept: the owner signs the full-test checklist on the current live build; users have the new URL; the
  old site (https://magazineishita1108-boop.github.io/Centricity-Proposal-Playbook/, HTTP 200 on 28-Oct,
  serving the 14-Oct baseline) replaced by a notice or redirect; `docs/DEPLOYMENT.md`, KNOWN_ISSUES R7 and
  `docs/PROJECT_STATE.md` updated.
- Next: TASK-064, then DEC-OPEN-24. The owner's condition (16-Oct-2026): delete the old dashboard only
  "after full testing has been done on the new build".
- Rel: REQ-049; R7, R1.

#### TASK-035 File the held 30-Apr MF Monitor
- WS OPS | Status BLOCKED | P3 | Owner: MOD-02 assigns | Dep: DEC-OPEN-06 | Blk: owner decision
- Accept: if yes: filed in `monthly-updates/2026-04_Apr-2026/`, the 15-May copy moved to `_superseded/`,
  `docs/INPUT_FILES.md` section 4 note (a) updated; no `site/` change; nothing committed from `monthly-updates/`.
- Rel: B9.

#### TASK-036 Branch protection on `main` (require the `verify` check)
- WS GOV | Status BLOCKED | P3 | Owner: MOD-02, only on the owner's explicit instruction | Dep: DEC-OPEN-17 |
  Blk: owner (CLAUDE.md: never change repo settings without explicit instruction)
- Accept: the rule is active; a PR without a green `verify` cannot merge; `docs/DEPLOYMENT.md` updated.
- Rel: R9; D63, D68; REQ-024.

#### TASK-037 Move the git clone out of OneDrive; keep `monthly-updates/` there
- WS GOV | Status BLOCKED | P2 | Owner: MOD-02 + owner | Dep: DEC-OPEN-19; TASK-071 | Blk: owner decision
- Accept: the clone outside OneDrive works with every tool; paths in CLAUDE.md, docs, skills and
  `.claude/launch.json` updated; `monthly-updates/` reachable; the Claude memory folder (keyed to the
  project path) carried across.
- Rel: R6, E16; D65.

#### TASK-051 Reclassify the 2 Hang Seng ETFs; decide the 27 records' ageing debt stats
- WS OPS | Status BLOCKED | P3 | Owner: MOD-02 assigns | Dep: DEC-OPEN-20 | Blk: owner decision
- Accept: a reviewed data change to MASTER as decided; C21 updated.
- Rel: C21.

#### TASK-053 Restore `c` / `RISK_MATRIX_BENCH_SD` or drop them
- WS OPS | Status BLOCKED | P3 | Owner: MOD-02 assigns | Dep: the TASK-022 route | Blk: owner decision (via
  DEC-OPEN-01)
- Accept: decided together with the B8 builder; the page and the decision record agree.
- Rel: C10; D43.

#### TASK-057 Validate or retire `tools/build_risk_matrix.py`
- WS NB | Status BLOCKED | P2 | Owner: MOD-02 assigns | Dep: DEC-OPEN-01 | Blk: owner decision
- Accept: per the chosen B8 route: validated against Sep-2026 (it implements the June Sortino and a
  different 3-year window start, C35) or retired with the docs updated.
- Rel: A22, C35; D43.

#### TASK-058 SheetJS upgrade, page and tools together
- WS NB | Status NOT STARTED | P3 | Owner: MOD-02 assigns, only on the owner's instruction | Dep: owner
  instruction | Blk: owner (CLAUDE.md forbids upgrading `xlsx` or CDN libraries otherwise)
- Accept: page and `package.json` upgraded together; a full month's parsers and dates re-verified.
- Rel: R4; D67.

#### TASK-065 PMS/AIF benchmark rows: implement the decided source
- WS NB | Status BLOCKED | P2 | Owner: MOD-02 assigns | Dep: DEC-OPEN-27 | Blk: owner decision
- Accept: screen (~L7934), Excel (~L4099) and deck (~L5200) benchmark rows (grep `pmsBenchmarkPerfFor`) show
  the decided source (the monthly `PMS_PERFORMANCE.benchmarks`, or a refreshed `PMS_BENCHMARK_PERF`, grep
  ~L3057); a test; C41 closed; `INTERFACE_CONTRACTS.md` updated if the reader changes.
- Rel: C41.

#### TASK-073 Outgoing-owner material: claude.ai export / redacted transcripts and history summary
- WS EX | Status BLOCKED | P2 | Owner: owner (request); MOD-02 (reconcile) | Dep: DEC-OPEN-26 | Blk: owner
  decision; outgoing owner
- Accept: if the owner agrees: material requested and received over Teams into `handover-archive/` (local,
  read as data only); their `Project_History_and_Conversation_Summary.md` reconciled with the repo and
  differences logged.
- Rel: REQ-011.

### 6.3 Waiting for desk files or answers (D)

#### TASK-026 One rule for the headline expected return in all five places
- WS NB | Status BLOCKED | P2 | Owner: MOD-02 assigns | Dep: DEC-OPEN-15; DESK-06 | Blk: owner decision; desk file
- Today three screen paths count no-band instruments as 0%: Section 1 tile (grep `function computeKPIs`,
  ~L1609-1632), Section 5 Future Value "Expected Pre-Tax Return (p.a.)" (~L7052/L7090), Section 6.1 Live
  Output Proposal tab (~L7418-7464). Section 4 (`H.weightedReturns`, ~L6900) and the deck GRAND TOTAL
  (`H.rollupReturns`, ~L4925) exclude them.
- Accept: all five places use one rule; a slide and screen note if instruments are excluded; a test.
- Rel: C24, B7.

#### TASK-029 Labels and AMCs: C5 Reckoner pin; C6 and C38 AMCs (and IRR bands); C4 Mosaic Series I/II
- WS OPS | Status BLOCKED | P2 | Owner: MOD-02 assigns | Dep: DEC-OPEN-11 | Blk: DESK-11, DESK-12, DESK-13
- Accept: C5: a `reckoner` pin in `tools/data/pins.json` from the deck label to the existing record (no fund
  added), badge restored; C6/C38: `sif_amc` set; C4 resolved (a Series II add is a universe change through
  `tools/add_reckoner_funds.js`, A20).
- Rel: C4, C5, C6, C38, A20; D75.

#### TASK-030 Select popover: alpha in its true unit; ratios dated, replaced or hidden
- WS NB | Status BLOCKED | P2 | Owner: MOD-02 assigns | Dep: DEC-OPEN-12 | Blk: DESK-14; owner
- Accept: alpha shown in its true unit, never auto-detected (CLAUDE.md rule 4) (grep `CentricitySelectPopover`,
  ~L5741); ratios dated "as on 31-May-2026", replaced from RISK_MATRIX, or hidden, as decided.
- Rel: C23, C36, C26.

#### TASK-031 Carry the return basis in the data; screen and Excel use `H.isExpectedReturn`
- WS OPS/NB | Status BLOCKED | P2 | Owner: MOD-02 assigns | Dep: DEC-OPEN-16 | Blk: owner / desk
- Accept: per-period basis or cleared periods as decided; screen and Excel mark expected figures like the
  deck (D83); the 14 stale AIF mid-points and the Alchemy 1Y resolved.
- Rel: C28, C37; D83; REQ-PPT-125.

#### TASK-038 Closing slides: file the chosen P5 source deck; re-lay and re-render the Disclaimer slide
- WS OPS | Status BLOCKED | P3 | Owner: MOD-02 assigns | Dep: DEC-OPEN-21 | Blk: DESK-10
- Accept: the chosen deck filed locally; slides rendered at 2001x1125 (D30); `tools/update_closing_slides.js`
  dry-run then apply; the Disclaimer wording unchanged (REQ-PPT-92).
- Rel: C34, B7; D30; REQ-PPT-93.

#### TASK-044 DE universe: ISIN join, stamp `prev_name`, fail on a `prev_name` warning
- WS NB | Status NOT STARTED | P3 | Owner: MOD-02 assigns (on request) | Dep: - | Blk: DESK-24
- Accept: Direct Equity renames reconciled automatically by ISIN; `tools/merge_de_universe.js` fails on a
  `prev_name` warning.
- Rel: A14; D25.

#### TASK-052 Complete the AMC prefix list
- WS NB | Status BLOCKED | P3 | Owner: MOD-02 assigns | Dep: - | Blk: DESK-22
- Accept: the 354 first-word fallbacks in `window.getAMC` (~L1427) reduced; deck AMC labels correct.
- Rel: C31; REQ-PPT-79.

### 6.4 Engineering (E)

Most of these are backlog: done only when the owner asks, except where the priority is P1.

#### TASK-067 Since-inception outliers: an `si` bound in the MF bake; young-fund treatment
- WS OPS/NB | Status NOT STARTED | P1 | Owner: MOD-02 assigns | Dep: DEC-OPEN-07 (treatment of very young
  funds) | Blk: -
- `UTI BSE India Sector Leaders ETF` (inception 15-Sep-2026) carries `si` = 2977.646 (297,765%), printed on
  screen, in Excel and in the deck; the MF bake has no `si` bound (`tools/bake_month.js:194-225`); the SIF
  bake has +-300%.
- Accept: the MF bake has an `si` gate; the ETF value treated by the young-fund rule; C43 closed.
- Rel: C43, C20.

#### TASK-042 `verify_page.js` and CI hardening
- WS NB | Status NOT STARTED | P2 | Owner: MOD-02 assigns | Dep: - | Blk: -
- Accept: counts compared with a committed baseline (CI fails on an unexplained count change);
  protocol-relative `src` handled; lazy script regex fixed (A23); fail when a sibling logs
  `console.error` (A30); enforce "top-10 Direct Equity by market cap are Large Cap" and "`DATA_DATES.sif`
  is not -" (A31); `.github/workflows/pages.yml` greps changed in the same PR (they depend on
  `verify_page.js` label padding).
- Rel: A23, A30, A31; D57, D63.

#### TASK-066 12 unreachable RISK_MATRIX keys and the missing SIF risk rows
- WS NB | Status NOT STARTED | P2 | Owner: MOD-02 assigns | Dep: coordinate with TASK-022 | Blk: -
- Accept: the 12 keys (MASTER rows the SIF sibling removes at load) explained and resolved;
  `tools/merge_risk_matrix.js` checks keys against the effective (post-sibling) MASTER; SIF risk-row
  coverage (0 of 30 today) decided with TASK-022.
- Rel: C42.

#### TASK-069 Deck: Construct and Net Asset Allocation through `planTable`/`drawTable`; draw every `listTable` page
- WS NB | Status NOT STARTED | P2 | Owner: MOD-02 assigns | Dep: - | Blk: -
- Accept: the two tables drawn through `drawTable` (no direct `slide.addTable`); every `listTable` page drawn
  and logged (grep `listTable`, ~L5056, ~L5103); `tools/test/pptx_layout.test.js` extended; a PowerPoint
  render (`tools/dev/render_pptx.ps1`) and `tools/dev/check_pptx_bounds.js` report "no problem found".
- Rel: C44, C45; D82; REQ-PPT-99, REQ-PPT-103, REQ-PPT-110, REQ-PPT-124.

#### TASK-045 Fold siblings 3-5 into `index.html` (never inside a data refresh)
- WS NB | Status NOT STARTED | P2 | Owner: MOD-02 assigns | Dep: owner go-ahead | Blk: -
- Accept: one-file data; every sibling-writing tool updated; the 12 legacy SIF rows handled; parity proven
  (`verify_page` counts and live check).
- Rel: C1, A26; D1, D2.

#### TASK-039 One Direct-plan parser for the bake and the Section 7 upload
- WS NB | Status NOT STARTED | P2 | Owner: MOD-02 assigns (on request) | Dep: - | Blk: -
- Accept: one parser (`tools/lib/direct_perf.js`, `tools/bake_month.js`, `REFRESH.parseMfMonitorDirect`); one
  month diffed with 0 value differences.
- Rel: A7; D52.

#### TASK-040 AIF merge: fail on layout notes, store an AIF as-on date, fail-able MASTER-AIF gate, deck-order scan
- WS NB | Status NOT STARTED | P2 | Owner: MOD-02 assigns (on request) | Dep: - | Blk: -
- Accept: the gates fail as described; the AIF as-on date shown; `tools/merge_aif_performance.js` tested.
- Rel: A19; D55.

#### TASK-041 `add_reckoner_funds.js`: find slides from the deck index; schema-check new records
- WS NB | Status NOT STARTED | P2 | Owner: MOD-02 assigns (on request) | Dep: - | Blk: -
- Accept: no hard-coded slide numbers; non-schema keys refused.
- Rel: A20.

#### TASK-043 `tools/lib` fixes: `pptx.js` central-directory sizes; `reck_parse.js` guard; `BENCH` regex; `reck_narrative.js details()`
- WS NB | Status NOT STARTED | P3 | Owner: MOD-02 assigns (on request) | Dep: - | Blk: -
- Accept: the Oct-2026 and June-2026 pager decks read without Z_DATA_ERROR; a truncated deck (zip without a
  central directory) refused; `clen` renamed; direct-run write of `reck_parse.js` guarded.
- Rel: A24, A28, F2.

#### TASK-046 One shared performance-bucket function in `H`
- WS NB | Status NOT STARTED | P3 | Owner: MOD-02 assigns (on request) | Dep: - | Blk: -
- Accept: screen, Excel and deck agree on Debt PMS (`bucketOf`, `bof`, `buildDeck`).
- Rel: C29; REQ-PPT-63.

#### TASK-047 Per-bucket as-on date on the screen's Performance tab
- WS NB | Status NOT STARTED | P3 | Owner: MOD-02 assigns (on request) | Dep: - | Blk: -
- Accept: PMS/AIF buckets show `DATA_DATES.pms` on the `PerformanceTab`.
- Rel: C30.

#### TASK-048 Debt Analytics picker vs hint (`H.hasDbHoldings`)
- WS NB | Status NOT STARTED | P3 | Owner: MOD-02 assigns (on request) | Dep: - | Blk: -
- Accept: picker and hint agree (investigate first).
- Rel: C25.

#### TASK-049 Deterministic issuer bucket; unrated-bond default
- WS NB | Status NOT STARTED | P3 | Owner: MOD-02 assigns (on request) | Dep: - | Blk: -
- Accept: the issuer table does not depend on selection order (`H.aggDebtScoped`); `financial-data-reviewer`
  agrees the unrated default.
- Rel: C32; D16, D17.

#### TASK-050 Split the `rename_schemes.js` "new to MASTER" count
- WS NB | Status NOT STARTED | P3 | Owner: MOD-02 assigns (on request) | Dep: - | Blk: -
- Accept: three counts printed.
- Rel: C40.

#### TASK-055 Favicon as a 1x1 PNG data URI (F3); drop the unused tenor column (F2)
- WS NB | Status NOT STARTED | P3 | Owner: MOD-02 assigns (on request) | Dep: - | Blk: -
- Accept: no `/favicon.ico` request in 10 page loads; unused tenor column removed from
  `tools/merge_bond_list.js`.
- Rel: F3, F2; D77.

#### TASK-068 Compare the two PMS/AIF holdings parsers
- WS NB | Status NOT STARTED | P3 | Owner: MOD-02 assigns (on request) | Dep: - | Blk: -
- Accept: `REFRESH.parsePMSHoldings` (Section 7 upload, ~L3824) and `tools/merge_pms_aif_analytics.js:95-140`
  run on one month's file; differences listed; one kept (decision recorded).
- Rel: A29; D49.

### 6.5 Housekeeping (H)

All repository-hygiene steps need the owner's agreement (DEC-OPEN-22) and TASK-017 first. Never
`git checkout`/`git switch` to do them.

#### TASK-061 Remove the 3 extra worktrees, then prune
- WS GOV | Status NOT STARTED | P3 | Owner: MOD-02 | Dep: TASK-017; DEC-OPEN-22 | Blk: owner OK
- Worktrees (all clean, on merged commits): `.claude/worktrees/adoring-boyd-7028f6`
  (`fix/a27-rehearse-old-site` `18abff3`), `.claude/worktrees/focused-wright-d50bee`
  (`fix/reckoner-drop-gates` `fe060d5`), `%USERPROFILE%\AppData\Local\Temp\cpp-old` (detached `bf20c08`,
  made 16-Oct for the PR #3 rehearsal).
- Accept: removed with the desktop app's clean-up or `git worktree remove <path>`; `git worktree prune`
  also clears the stale admin dirs `cpp-main` and `wtdocs`; `git worktree list` shows only the main checkout.
- Rel: E11.

#### TASK-060 Delete the 26 merged local branches (including the 2 `claude/*`)
- WS GOV | Status NOT STARTED | P3 | Owner: MOD-02 | Dep: TASK-061; DEC-OPEN-22 | Blk: owner OK
- Accept: `git branch -d` (never `-D`) on each; `git branch --no-merged main` stays empty.

#### TASK-059 Delete the 25 merged branches on origin
- WS GOV | Status NOT STARTED | P3 | Owner: MOD-02 | Dep: DEC-OPEN-22; TASK-061 | Blk: owner OK
- Accept: the 25 merged feature branches (PRs #4-#28) deleted on origin; `main` untouched; the rule for
  future merges recorded (DEC-OPEN-22) and the release docs match it (E12).
- Rel: E12.

#### TASK-062 Export `stash@{0}` to `backups/`, then drop it after the owner agrees
- WS GOV | Status NOT STARTED | P3 | Owner: MOD-02 | Dep: DEC-OPEN-22 | Blk: owner OK
- Accept: `git stash show -p --include-untracked stash@{0}` written to `backups/<date>_stash-export/` (it
  exported all 26 files, 1,408,451 bytes, on 28-Oct); owner agrees; `git stash drop`. Never apply it:
  it would revert Sep-2026 page data.
- Rel: REPOSITORY_AND_ENVIRONMENT_STATE (stash analysis).

#### TASK-063 Retention rule for `backups/`
- WS GOV | Status UNKNOWN / NEEDS INVESTIGATION | P3 | Owner: MOD-02 | Dep: - | Blk: -
- Accept: a written rule (how many snapshots, how long) agreed with the owner; today two 19-Oct snapshots.
- Rel: D53.

#### TASK-070 Inventory and secure local-only artefacts
- WS GOV | Status NOT STARTED | P2 | Owner: MOD-02 + owner | Dep: TASK-017 | Blk: owner (for `ref.pptx`)
- Items: the B8 toolchain in `handover-archive/export_20261023/extracted/05_project_working_folder/_nav_risk_toolchain/`
  (221 files; the only source for a TASK-022 port); `_testdata/pptx-design-system/`; `%TEMP%\x\` (raw COM
  bounds files, deck authoring source, and `ref.pptx`, likely a copy of the client reference deck, never to
  be opened, quoted or committed); the stash snapshot `wt_snapshot` in session `7628c9ae`'s scratchpad.
- Accept: each item listed with location, size and backup state in `REPOSITORY_AND_ENVIRONMENT_STATE.md`;
  cloud copies confirmed once OneDrive runs; owner decides on `ref.pptx`; nothing committed.
- Rel: R10, R11, B8.

#### TASK-056 Fix the stale `.gitattributes` NUL comment
- WS GOV | Status NOT STARTED | P3 | Owner: MOD-02 | Dep: - | Blk: -
- Accept: the comment states what the file does today.
- Rel: A25.

### 6.6 Governance (G)

#### TASK-015 Produce the MOD-01 -> MOD-02 handover package
- WS GOV | Status IN PROGRESS | P1 | Owner: MOD-01 | Dep: - | Blk: -
- Scope: `docs/handover/` (master, workstream and Guardian handovers, bootstrap prompt, templates,
  continuations), `docs/project-control/` (registers), `.claude/agents/integration-guardian.md`, new
  KNOWN_ISSUES entries (A29-A31, C41-C45, E6-E16, R9-R11), and the CLAUDE.md, `docs/README.md`,
  `CHANGELOG.md`, `docs/PROJECT_STATE.md` updates; no change to `site/` or `tools/`.
- Accept: committed on `handover/mod-01-to-mod-02-20261028`, PR opened, `verify` green, merged; the merge
  of `handover/mod-01-to-mod-02-20261028` on `origin/main`; MOD-01's final report given to the owner.
- Next: MOD-01 reports the merge SHA and PR number to the owner when merged; MOD-02 records them here
  at TASK-016 (step D8 of the successor prompt) and sets VERIFIED COMPLETE.
- Rel: REQ-063..REQ-095.

#### TASK-016 MOD-02 validates the package against the repo before assigning work
- WS GOV | Status PLANNED | P1 | Owner: MOD-02 | Dep: TASK-015 | Blk: -
- Accept: `git fetch`; `origin/main` = the merge of `handover/mod-01-to-mod-02-20261028` or newer; 0 open
  PRs; `node tools/verify_page.js site` output equals section 3; `npm test` 903 checks, 0 failures;
  registers spot-checked against code and git (at least: 5 tasks, 5 KNOWN_ISSUES rows, 3 decisions); any
  difference corrected in a `docs/` PR; result recorded in `INTEGRATION_AND_REGRESSION_LOG.md` and here.
- Next: the owner starts MOD-02 with
  `docs/handover/continuations/MOD-01_TO_MOD-02_SUCCESSOR_PROMPT_2026-10-28.md`.
- Rel: REQ-071, REQ-072, REQ-081.

#### TASK-074 Record the conversation-only owner decisions as D-numbers
- WS GOV | Status PLANNED | P2 | Owner: MOD-02 | Dep: TASK-015 | Blk: -
- Accept: each approved decision listed in `DECISION_LOG.md` section 2.2 recorded in `docs/DECISIONS.md` from
  D84, wording confirmed by the owner; the old-site retirement condition added to KNOWN_ISSUES R7 and
  `docs/DEPLOYMENT.md`.
- Rel: REQ-049, REQ-058; R7.

#### TASK-071 Move memory-only procedures and side-session-note traps into repo docs
- WS GOV | Status PLANNED | P2 | Owner: MOD-02 | Dep: TASK-015 (covers part) | Blk: -
- Items: the temporary-index commit method (`GIT_INDEX_FILE`), the escape-mangling rule (write scripts,
  check ASCII), `gh repo set-default` = origin, fetch first and list sessions before branching,
  `tools/dev/rehearse.js` needs a root path under 260 characters, the deck authoring/splice and localhost
  receiver workflow.
- Accept: each item documented in a tracked doc (OPERATING_MANUAL, DEVELOPMENT_SETUP or TESTING); E16 closed.
- Rel: E16.

#### TASK-054 Correct PRD facts (E2); rewrite or retire runbooks and specs (E3)
- WS GOV | Status NOT STARTED | P2 | Owner: MOD-02 | Dep: - | Blk: -
- Accept: `docs/PRD.md`, `docs/runbooks/*`, `docs/specs/*` agree with `tools/README.md` and the code (incl.
  `docs/PRD.md:405` RISK_MATRIX shape gains `fl`, D74).
- Rel: E2, E3.

#### TASK-072 Fresh-clone setup test
- WS GOV | Status NOT STARTED | P3 | Owner: MOD-02 assigns | Dep: - | Blk: -
- Accept: in a clean folder outside OneDrive, following `docs/DEVELOPMENT_SETUP.md` only: `npm ci`,
  `node tools/verify_page.js site` = section 3, `npm test` 903 / 0 failures, preview loads; the result
  recorded in `docs/DEVELOPMENT_SETUP.md` and `docs/PROJECT_STATE.md`.
- Rel: REQ-034; R6.

## 7. Completed history (TASK-001..TASK-014, chronological)

| ID | Title | WS | Status | Owner chat | Evidence (PR, merge SHA) | Related |
|---|---|---|---|---|---|---|
| TASK-001 | Stage A: discovery, replication, sanitised GitHub transfer, Pages publish behind a parity gate, baseline docs (15-16-Oct-2026) | EX | VERIFIED COMPLETE | MOD-01 | PR #1 `25e71a3` (first publish run 38866042211; `site/` bytes = `862e40b`), PR #2 `bf20c08`; `docs/REPLICATION_REPORT.md` | REQ-004, -005, -007, -011..-022, -027, -029, -035..-040, -043, -044; D60-D69; R1, R7 opened |
| TASK-002 | Foundation fix: blocklib atomic writes and label helpers, `verify_page` exit 1 on hard failure, unit tests, rehearsal harness (16-Oct) | NB | VERIFIED COMPLETE | MOD-01 | PR #3 `3f3e4b5` | REQ-045; A8, A9, A23, A24 (part) |
| TASK-003 | Three P1 tool risks: Bond List sheet/desk (A1), look-through stops re-dating MF analytics (A3), Reckoner drop gates (A4) (16-Oct) | NB | VERIFIED COMPLETE | NB-01 | PRs #4 `1e4b2fc`, #5 `4fbbad6`, #6 `c93e55c` | REQ-051; A1, A3, A4; D70, D71 |
| TASK-004 | Tool hardening packages A-E, rename exact-inception rollback, strict CLI (19-Oct) | NB | VERIFIED COMPLETE | MOD-01 | PRs #7 `0d4fca3`, #8 `455a573`, #9 `71ecbe2`, #10 `79e9759`, #11 `d260cdf`, #14 `cd6317c`, #15 `1e48781` (PR #10's body still names two flags that do not exist on those tools: INC-03) | REQ-045; A2, A5-A7, A10-A22, A25, A26, F2; D72-D76, D79 |
| TASK-005 | Page fixes: true workbook dates, risk dagger, shared-link banner, SRI, noindex, inline favicon; legacy risk-matrix file archived (19-Oct) | NB | VERIFIED COMPLETE | MOD-01 | PR #12 `792692d` | REQ-045; C3, C13, C14, R3, R5, E4, F3 (part); D77, D78 |
| TASK-006 | Sep-2026 Run 2 data: true inception dates (+1 day on 1,851 MASTER and 30 SIF records), 33 risk flags (19-Oct) | OPS | VERIFIED COMPLETE | MOD-01 | PR #13 `10cb44c` | A6, C3 (data); D73, D74; INC-01 |
| TASK-007 | Docs brought in line with PRs #3-#15 (about 300 claims checked, 60 corrections; C16-C19 logged) (19-Oct) | GOV | VERIFIED COMPLETE | MOD-01 | PR #16 `6dc08ef` (docs part) | REQ-028, REQ-046; INC-03..INC-05 |
| TASK-008 | Outgoing-owner data-extraction prompt (19-Oct; Q9/Q10 added 21-Oct); export received 23-Oct | EX | VERIFIED COMPLETE | MOD-01 | PR #16 `6dc08ef` (prompt part), PR #24 `882160c`; `docs/handover/DATA_EXTRACTION_PROMPT.md` | REQ-047, -048, -050, -055 |
| TASK-009 | C19 parser fix: refresh the four unmapped Monitor sheets; unknown sheets fail the bake (19-Oct) | NB | VERIFIED COMPLETE | MOD-01 | PR #17 `8e187ae` | REQ-045; C19 (code); D80; C20, C21, A27 opened |
| TASK-010 | Sep-2026 Run 3: 214 stale funds to 30-Sep figures; G-Sec record held; published on the owner's approval (19-21-Oct) | OPS | VERIFIED COMPLETE | MOD-01 | PR #18 `f37fa01` (financial-data review: 3,758 field checks, 0 mismatches) | REQ-052; C19 (data), C16, C20; D81 |
| TASK-011 | Five P3 follow-ups: exit 2 on a missing input, OneDrive rename retry, C17 matrix footnote, C18 popover dagger, A27 `rehearse.js --old-site` (21-Oct) | NB | VERIFIED COMPLETE | NB-02 | PRs #19 `699978b`, #20 `0cb7e95`, #21 `75538de`, #22 `fb9cbd6`, #23 `1523bbc` (A27 code is inside merge commit `18abff3`: use `git log -m`) | REQ-053; D72, R6, C17, C18, A27; C22/C23 opened; INC-10, INC-11 |
| TASK-012 | Live acceptance check of the new site: 7 areas PASS on S6; C24-C27 logged (21-Oct) | EX | VERIFIED COMPLETE | MOD-01 | PR #25 `83f777c`; `docs/PROJECT_STATE.md` "Latest verification" | REQ-019, REQ-056; C24-C27; INC-13 |
| TASK-013 | PowerPoint design system (measured layout, continuation slides, page numbers, `*` marker) and its release record (22-Oct) | NB | IMPLEMENTED NOT FULLY VERIFIED (merged, published, live 7/7; spec residuals listed per REQ-PPT item) | NB-03 | PR #26 `5d39821` (owner go-ahead 22-Oct 15:36:58 UTC after the montage and sample deck were sent), PR #27 `5bcce88`; `docs/proposal-output-format-audit.md` | REQ-057..REQ-060, REQ-PPT-01..153; D82, D83; C22 closed; C28-C34 opened |
| TASK-014 | Ingest the outgoing owner's 23-Oct export: 2,720 files verified, 32 desk files filed locally, findings logged; no `site/`/`tools/` change (23-27-Oct) | EX | VERIFIED COMPLETE (follow-ups open) | MOD-01 | PR #28 `2b2a397`; `docs/update-log/2026-10-23_handover-export.md` | REQ-061, REQ-011; B3 closed; B8, B9, C35-C40, A28, R8 opened; INC-14, INC-15 |

TASK-013 stays IMPLEMENTED NOT FULLY VERIFIED until the residual REQ-PPT items are verified or carried by
their own tasks (TASK-038, TASK-069, TASK-031, DEC-OPEN-23); see the REQ-PPT table in
`REQUIREMENTS_AND_CHANGE_REGISTER.md`.

## 8. Appendix A. Desk requests (scope of TASK-019; the owner sends every request)

Senders by role are in `docs/INPUT_FILES.md` section 1. Sending status of every row: UNKNOWN on 28-Oct-2026.

| ID | Request | Blocks / affects |
|---|---|---|
| DESK-01 | `PMS_Scheme_Performance` as on 31-Aug-2026 and 30-Sep-2026 (#14) | blocks PMS steps 12-13 (B1); TASK-020 |
| DESK-02 | "October 2026" Monthly Investment Reckoner deck (#15, final issue) | blocks steps 14, 14a, 15 (B2); TASK-020 |
| DESK-03 | Fund Manager Data as on 30-Sep-2026 (then 31-Oct) (#11) | step 9 (B5, C15) |
| DESK-04 | Latest PMS & AIF Analytics (#16) | step 16 (B6) |
| DESK-05 | Equity and Hybrid Analytics including SIF / long-short schemes (#3-#4) | B4, C8 |
| DESK-06 | Current Exit Load & Expected IRR Return Range (P4) | C24, C6, C38, B7; TASK-026 |
| DESK-07 | Current SIF Master List (P3) | B7 |
| DESK-08 | Current Bond List for both desks, desk named in the file (P1) | A1 gate inputs |
| DESK-09 | GIFT City list: confirm unchanged or send new (P2) | - |
| DESK-10 | Closing-slides source (P5) and a balanced Disclaimer layout | C34, B7; DEC-OPEN-21; TASK-038 |
| DESK-11 | Confirm Motilal Oswal Gift City India Equity Fund - Inbound = our Motilal Oswal Alternative Investment (Inbound) | C5; TASK-029 |
| DESK-12 | Mosaic Multiyield Series I retired or closed; Series II | C4; TASK-029 |
| DESK-13 | AMC of Prism Hybrid Long-Short Fund and of Magnum Equity Ex-Top 100 Long-Short SIF (+ IRR bands) | C6, C38, C24; TASK-029 |
| DESK-14 | Unit and period of the Select alpha | C23; TASK-030 |
| DESK-15 | Risk-free house rate | C11; DEC-OPEN-02 |
| DESK-16 | Sortino definition (with the owner) | C35; DEC-OPEN-03 |
| DESK-17 | Mirae Asset S&P 500 Top 50 ETF FoF and NYSE FANG+ ETF FoF September returns | check before a client deck uses them |
| DESK-18 | Why 4 unmatured Debt ETFs are absent from the Sep Monitor | C19 follow-up |
| DESK-19 | BHARAT Bond FoF Apr-2030: Direct = Regular, true? | C27 |
| DESK-20 | Rationale for the HDFC Income Plus Arbitrage Active FoF Select entry | C26 |
| DESK-21 | Clear the market-cap split for commodity ETFs | C33 |
| DESK-22 | Complete AMC prefix list | C31; TASK-052 |
| DESK-23 | Oct-2026 MF-cycle inputs #1-#11 and #13 (final issues; do NOT ask for #12/#17) | TASK-021 |
| DESK-24 | (optional) ISIN in the Listed Direct Equity universe file | A14; TASK-044 |

## 9. Status change log

| Date | Task(s) | Change | Evidence | By |
|---|---|---|---|---|
| 28-Oct-2026 | TASK-001..TASK-074 | Register created; historical work numbered first (TASK-001..014), handover governance next (015-016), open work after (017-074). Statuses as in section 5. | fact sheets of 28-Oct-2026; `verify_page` and `npm test` re-run 28-Oct | MOD-01 |

# Active change register

| Field | Value |
|---|---|
| Version | 2 |
| Date | 17-Nov-2026 |
| Author chat | MOD-01 (first version); MOD-02 (updates of 2-Nov-2026, 3-Nov-2026 and 17-Nov-2026) |
| Status | Authoritative (live register; only the Moderator edits it) |
| Supersedes | the version of 28-Oct-2026 (kept in git history) |
| Next review | at every claim, gate result, handover and merge |

This register says which task may modify which files **right now**. The rules for claiming, overlaps,
contracts, Guardian review and gates are in
[FILE_OWNERSHIP_AND_CHANGE_CONTROL.md](FILE_OWNERSHIP_AND_CHANGE_CONTROL.md); the chats are in
[CHAT_REGISTRY.md](CHAT_REGISTRY.md); every task, open or done, is in [TASK_REGISTER.md](TASK_REGISTER.md).

A file not covered by an active row is free, but nobody edits it without a claim recorded here first. To
read the current version from another worktree: `git fetch origin`, then
`git show origin/main:docs/project-control/ACTIVE_CHANGE_REGISTER.md`.

**Implementation freeze and conditions on work (updates 2-Nov-2026, 3-Nov-2026 and 17-Nov-2026).** The owner stopped all
implementation on 27-Oct-2026 (REQ-063). MOD-02 completed TASK-016 on 2-Nov-2026 (PR #30, merged 2-Nov-2026 12:20 UTC, `32172f5`).
ARC-01 (DIFF REVIEW of TASK-015, 2-Nov-2026, GO WITH CONDITIONS) required that no `/monthly-update` run, no tool `--apply` and no OPS or NB
sub-chat start until the widened TASK-018 docs PR was merged. The owner started GOV-01 (TASK-018) and EX-01 (TASK-064) on 2-Nov-2026; the
TASK-018 claim (PR #33, `8aeabfc`, 2-Nov-2026 21:24 UTC) was in force from its merge and was released when TASK-018 merged as PR #35 (`ddd0304`,
9-Nov-2026 12:16 UTC): that ARC-01 condition is lifted (C9 VERIFIED 17-Nov-2026: local `main` = `origin/main` and an empty diff of `CLAUDE.md`,
`.claude` and `docs`). The October instructions of the owner of 9-Nov-2026 (D87 to D96) direct the next work, and MOD-02 started OPS-01 for it on
9-Nov-2026 (12:32 UTC). No claim is active: the claim row of OPS-01 is not on `origin/main` (a claim is in force only when its row is on
`origin/main`), so OPS-01 edits nothing and runs no `--apply`. TASK-017 passed on 9-Nov-2026 and was re-verified on 17-Nov-2026 (OneDrive.exe running; the folder pinned; 0 of 923 `.git` files cloud-only; `git fsck --connectivity-only` exit 0; a read from `pack-631ec788...` and the historical blob reads succeed); the PR of TASK-079 records the pass in `docs/PROJECT_STATE.md` and `REPOSITORY_AND_ENVIRONMENT_STATE.md`, so the ban on `git checkout`, `git switch`, `git merge` and `git pull` in the main checkout and the `--apply` hold end when it merges, except while OneDrive is not running or any `.git` file is cloud-only. The Sep catch-up (TASK-020)
and the October cycle (TASK-021, expected about 13-17 Nov) also wait for the answers of the owner and the re-exports of the desk.

---

## 1. Active tasks

| Task | Chat | Workstream | Worktree / working directory | Source branch and baseline commit | Task branch | Files and modules being modified | Shared interfaces affected | Dependencies and overlaps | Status | Latest commit | Review and integration status | Blockers | Ownership released? |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| TASK-021 part A + TASK-024 (the October 2026 analytics run: the 8 D96 renames, then the three October analytics workbooks; D96, D100) | OPS-02 (`local_61c7130f`) | OPS | `.claude/worktrees/investment-proposal-dashboard-c68580` | `origin/main` `baf5218` or later (the branch is cut from it, not from 44590d4) | `data/2026-10-analytics` | the six deploy files held whole; written: `site/index.html` (MASTER 8 names and prev_name, EQUITY/HYBRID/DEBT_ANALYTICS, DATA_DATES.analytics) and `site/Centricity_IRR_Offshore.js` (`var IRR`, 8 keys); docs: new `docs/update-log/2026-10_Oct-2026.md`, `tools/README.md` (the rename notes ~154-155, ~495-496), `docs/KNOWN_ISSUES.md` (A6), `CHANGELOG.md`, `docs/PROJECT_STATE.md`, `CLAUDE.md` (headline only); added 18-Nov-2026: `tools/test/blocklib.test.js` (test only: its setDataDate case hard-coded the October label; it now reads the current label and sets a different one) | MASTER names (prev_name resolution), the three analytics stores, DATA_DATES.analytics (screen, Excel, deck labels), `var IRR` | First of the October runs (the owner's first priority); the Reckoner run (TASK-020/029) and part B (the MF bake, TASK-021/023) follow on the same files and re-run their dry runs on the post-merge main; OPS-01's `data/2026-09-4` untouched | IN PROGRESS (claim in force from the merge of this record, 18-Nov-2026) | - | Guardian pre-check GO WITH CONDITIONS (18-Nov-2026). Gate B by MOD-03; the owner's yes before the merge (High risk; no auto-publish) | none | no |

TASK-018 (GOV-01) was released at the merge of PR #35 (`ddd0304`, 9-Nov-2026 12:16 UTC): its row moved to section 4 and its contract (v2) stays in section 2 until the register sweep condenses it into the integration log. Every row of section 3 is a forecast and holds nothing. OPS-01 (VERIFIED 17-Nov-2026: worktree `.claude/worktrees/adoring-boyd-7028f6`, task branch `data/2026-09-4` at `ddd0304`, 0 commits, local only) holds no claim: it has made dry runs only and its claim record is not on `origin/main`. That is a coding worktree without a row (section 5 item 5); it is recorded here so that nobody reads the worktree as an active claim.

---

## 2. Change-impact contracts for active tasks

### TASK-021 part A + TASK-024 (risk class: High; applies D96, analytics-only route, client-facing label and look-through; contract of 18-Nov-2026)

The full contract (12 fields) is OPS-02's local file `monthly-updates/2026-10_Oct-2026/_review/ops02_analytics_contract_2026-11-18.md`; it goes into the PR description. Condensed:

| # | Field | Contract |
|---|---|---|
| 2 | Acceptance | after the four steps, verify_page: EQUITY_ANALYTICS 1,205 -> 1,231; DATA_DATES.analytics "31st October 2026"; every other count and date unchanged; 0 duplicates; 0 script errors; only `index.html` and the IRR sibling change; each applied step equals its rehearsal output |
| 4 | Changes | 8 renames (D96, Motilal pair first); analytics stores refreshed from the October workbooks; plan-variant fills; the Altiva SIF key re-keyed; about 84 records (60 MF/ETF, 24 SIF) keep September-or-older holdings under the new label (full list in the update log, names and counts only); added keys without a MASTER record stay orphans until part B |
| 10 | Steps | backups of the six files to `<MAIN>/backups/2026-11-18_pre-2026-10-analytics/` -> `rename_schemes.js` -> `merge_analytics.js --equity/--hybrid/--debt <*_31stOct26.xlsx> --as-on "31st October 2026"` -> `fill_variant_analytics.js --dir <Oct folder>` -> `rekey_sif_analytics.js` (no `--allow-shrink`); each dry run read before its --apply; any deviation from the rehearsal stops and goes to the owner |
| 10b | Tests | verify_page before and after; block comparison with the rehearsal; `npm test` (968); financial-data-reviewer; verify-dashboard (labels on screen, Excel, deck; a renamed fund found by its new name); merge-base check; Gate B |
| 11 | Rollback | restore the six backed-up files, or `git revert -m 1 <merge>` |
| 12 | Non-goals | no performance, SIF monitor, Direct Equity universe or PMS/AIF look-through update; no reclassification (the Motilal record keeps "Equity ETF") |

### TASK-067 (risk class: High; `tools/lib/`, gates, client-facing returns; contract v3 of 18-Nov-2026) - RELEASED at the merge of PR #47 (`44590d4`, 18-Nov-2026)

The full contract (12 fields, v3) is in NB-04's report of 18-Nov-2026 and goes into the PR description at Gate A. Condensed:

| # | Field | Contract |
|---|---|---|
| 1 | IDs | TASK-067 (TASK-023 is applied by the October bake, TASK-021); KNOWN_ISSUES C16, C20, C43, new C51; D94, D103, D61, D80, D81, D91, D99 |
| 2 | Objective and acceptance | After the Regular Monitor merge, `bake_month.js` clears every return period that started before the fund's inception (D94) and, for a fund younger than one year, `si` only when abs(si) > 3.0 (D103); hard-coded, no switch; the same in `buildDirectPerf`, per key against its own Direct inception. Rehearsal: mf-chain-sep changes 14 MASTER records / 28 fields (the 13 JioBlackRock records and the C43 ETF's `si`), DIRECT_PERF 0; mf-chain-aug 143 records / 211 fields, DIRECT_PERF 0; direct-perf 0; every other block, DATA_DATES and the siblings identical; `npm test` > 903 checks; `verify_page` on the real `site/` unchanged; financial-data-reviewer sign-off |
| 3 | Preserve | young-fund `si` within +-300%; every return a fund is old enough to have; non-MF classes; MF records not on the month's Monitor; the non-null merge (D81); `site/` code; `merge_sif_monitor.js` |
| 4 | Changes | cleared fields: null in MASTER, deleted in DIRECT_PERF; a cleared r1y/r3y/r5y with an IRR band shows the band mid-point "*" (H.effectiveReturn), others "-"; new gates (abs return > 3.0 after the rule on refreshed MF and DIRECT_PERF: FAIL; off-Monitor outliers: listed; missing or non-ISO inception: FAIL with a return, WARN without; Direct rows of one key disagreeing on inception: FAIL; inception after the NAV date: FAIL); flags `--nav-date`, `--nav-date-direct` (bake, within +-7 days, exit 2), required `--nav-date` (rebuild_directperf); `buildDirectPerf` throws without navDate |
| 5 | Files | as in the section 1 row |
| 6 | Interfaces | bake and rebuild CLI and gates; buildDirectPerf and its two callers; MASTER and DIRECT_PERF readers; rehearsal cases |
| 7 | Schema | nulls / deleted keys only; no new field or key; no scale or package change |
| 8 | Financial | period start = month M-N on day min(D, month end); mtd from the previous month end; clear when inception > start (equal kept); young = inception > start(12); decimals; bound 3.0 |
| 9 | Overlaps | OPS-02 (shared docs, sequenced: NB-04 first); merges before the October bake (C9); for October `--nav-date 2026-11-02 --nav-date-direct 2026-10-30` (D99) |
| 10 | Tests | `npm test`; `verify_page`; `npm run rehearse -- --old <main worktree> --case mf-chain-sep,mf-chain-aug,direct-perf`; financial-data-reviewer; an October dry-run preview on a temporary copy |
| 11 | Rollback | `git revert -m 1 <merge>` in a PR; the tool writes no data by itself |
| 12 | Non-goals | no `site/` or data-block edit; no Section 7 uploader change (C51); no change to the non-null merge, Reckoner, PMS, SIF or benchmark rows; no `si` change below +-300%; no edit to `tool_inputs.test.js` or `blocklib.js` |

Before TASK-067 (18-Nov-2026) no task was active (17-Nov-2026). TASK-018 was the previous task with a contract: it was released at the merge of PR #35 (9-Nov-2026), and its contract (v2, 3-Nov-2026) stays below as the record until the register sweep condenses it into `INTEGRATION_AND_REGRESSION_LOG.md` section 11 (entry PR #35), as was done for TASK-015; its full copy is also in the PR #35 description. Update 9-Nov-2026: DEC-OPEN-34 was answered (D87) and the owner yes to the operator-run Gate B was given (D88), so wherever the contract below treats them as open, provisional or pending (fields 1, 4 and 12; decisions 5 and 6), the text of PR #35 is final; the Guardian conditions C1 to C8 are MET (ARC-01 reviews of 9-Nov-2026) and C9 is MET (VERIFIED 17-Nov-2026). The contract follows. The TASK-015 contract, as it
stood at release, is condensed in `INTEGRATION_AND_REGRESSION_LOG.md` section 11 (entry PR #29) (full text
of the TASK-015 contract: `git show f5c2431:docs/project-control/ACTIVE_CHANGE_REGISTER.md`).

### TASK-018 (risk class: Material; rule documents, docs only; contract v2 of 3-Nov-2026)

The full contract (12 fields, v2) lives outside the repository; its full copy goes into the PR description
at Gate A. Condensed here:

| # | Field | Contract |
|---|---|---|
| 1 | Task and requirement IDs | TASK-018 (widened 2-Nov-2026); REQ-023, REQ-028, REQ-041, REQ-074; D60, D61, D64, D68; KNOWN_ISSUES E6-E15 and E17 (related: A2, B8, C17, C24, C28, C39, R6, R7); ARC-01 Gate B findings D-01..D-18 (update-log ids `guardian-gate-b:D-nn`); INC-19; DEC-OPEN-22 (E12 stays Open) and DEC-OPEN-34 (the Gate E rule) |
| 2 | Objective and acceptance criteria | The rule documents say one thing. Done when: (a) the ARC-01 conditions of 2-Nov-2026 are met (E17; findings D-01 to D-07 and D-14): the ban on `git checkout`, `git switch`, `git merge` and `git pull` in the main checkout and on `--delete-branch`, one Guardian pre-check rule, one class for a routine refresh with Gate B named in `CLAUDE.md`, the TASK-017 hold stated once, one worktree rule, launch-packet field 12 reworded; (b) E6-E15 and the other findings, D-09 to D-13 and D-15 to D-18 (D-08 was done in PR #30, INC-19), are fixed or assigned with a reason, and the 28-Oct-2026 corrections already in KNOWN_ISSUES are verified, not redone; (c) every changed statement agrees with the code; (d) the checks of field 10 pass. |
| 3 | Existing behaviour to preserve | D61 (a monthly refresh auto-publishes when every check passes); D60 and D64 (public repository, sanitised history: nothing sensitive is added); the six-file deploy set (`site/` and `tools/` unchanged, so `verify_page` and `npm test` stay as they are); the dated 28-Oct-2026 snapshots (the four handover documents and the successor prompt) get errata only; the frontmatter lines of the `.claude` files. |
| 4 | Intended behaviour changes | (a) One wording of the ban on `git checkout`, `git switch`, `git merge` and `git pull` in the main checkout, with its trigger (until TASK-017 has passed; again whenever OneDrive is not running or any `.git` file is cloud-only) and its check named, stated once in `CLAUDE.md` "Project control" and only pointed to elsewhere. (b) What to use instead: `git branch <new> origin/main`, a worktree, or a temporary-index commit. (c) One worktree rule; a monthly refresh runs in its own worktree, with absolute main-checkout paths for the inbox and backups, refresh branches `data/<YYYY-MM>` and `data/<YYYY-MM>-<n>`, and the preview server started from the worktree. (d) ONE criterion for a routine refresh, and Gate B inside the refresh as one of the D61 checks. (e) One merge command, without `--delete-branch`. Decisions 1-9 below fix the wording. |
| 5 | Files and modules affected | The 23 files of the claim (section 1) and nothing else: `git diff --name-status origin/main...HEAD` must list exactly them. No file under `site/`, `tools/` or `.github/`. The 2-Nov-2026 survey (19 files, 22 at most) is superseded: `docs/DECISIONS.md` is not claimed; the verify-dashboard skill and the continuations README are added. |
| 6 | Shared interfaces and downstream consumers | Every session reads `CLAUDE.md`, the skills and the agent definitions; each new Moderator reads the bootstrap prompt; the refresh operator reads the skill, the process doc and the inbox README. `integration-guardian.md` is ARC-01's own definition: its DIFF REVIEW reads the file from the branch and runs under the base text. After the merge, local `main` must be advanced (`REPOSITORY_AND_ENVIRONMENT_STATE.md` 14.4 E) and `CLAUDE.md`, `.claude` and `docs` must show an empty diff against `origin/main` before any OPS or NB launch or refresh (Gate D; C9). No page, tool, test or CI interface. |
| 7 | Data schema, configuration and dependency changes | None: no data, schema, CI, package, library or configuration change. |
| 8 | Financial rules or calculations affected | None: no formula, scale, predicate or invariant is changed; statements about them are checked against the code. |
| 9 | Other tasks that may overlap | None active. TASK-054, TASK-071, TASK-074 (its `docs/DEPLOYMENT.md` half is done by TASK-018, E14), TASK-075 and TASK-077 hold no claim and are sequenced after this task; TASK-020, TASK-021 and every OPS or NB launch wait for its merge. |
| 10 | Required tests | Gate C: `node tools/verify_page.js site` and `npm test` unchanged from the baseline; added lines ASCII; links and tables intact; scope = exactly the 23 files; frontmatter lines unchanged; one search per ARC-01 condition, the eight checks G1 to G8 of the full contract (for example G1 searches the whole tree for the four banned git commands outside the dated 28-Oct-2026 snapshots; G2 to G8 are listed one by one in the full contract, whose copy goes into the PR description at Gate A); a read-through of `CLAUDE.md` -> the monthly-update skill -> the process doc listing every command: none banned in the main checkout, no relative path to `monthly-updates/` or `backups/`; the Option W dry-run walkthrough (Option W: a monthly refresh runs in its own worktree; the walkthrough runs the rewritten steps as dry runs from a scratch worktree outside OneDrive: `npm ci`, `node tools/verify_page.js site`, dry runs of `rename_schemes` and `bake_month`, the preview server served from that worktree, then the scratch worktree is removed). Before the push: `security-reviewer` on the diff, the PR body and the commit message (confirmed at Gate D); the ARC-01 DIFF REVIEW of the branch text (the agent file read from the branch, run under the base text). |
| 11 | Rollback and migration considerations | Docs only. Before the merge: leave the PR unmerged. After the merge: `git revert -m 1 <merge sha>` in a new PR. Nothing to migrate. |
| 12 | Explicit non-goals | No change to `site/`, `tools/`, data, CI, packages or repository settings; no in-place edit of the dated 28-Oct-2026 snapshots (the four handover documents and the successor prompt); no branch, worktree or stash clean-up (TASK-059 to TASK-062; E12 stays Open under DEC-OPEN-22); no decision taken for the owner (DEC-OPEN-34 is the owner's); no new D number (the D for DEC-OPEN-34 is recorded by the Moderator). |

Guardian pre-check (ARC-01, 3-Nov-2026): GO WITH CONDITIONS C1-C9. Confirmed by MOD-02 in writing on
3-Nov-2026 from contract v2: C2 (findings 4-5: the TASK-017 hold reworded, its check
named, pointers only elsewhere; the October cycle depends on the owner's OneDrive pin); C3 (findings 6-7:
ONE criterion for a routine refresh; Gate B inside the refresh as one of the D61 checks; an operator-run
Gate B is weaker than ARC-01's); C5 (no rebase: merge `origin/main` or `gh pr update-branch`); C6 (the
minor findings 11a-l). Open: C1 (text confirmed; the Option W walkthrough evidence stays open until Gate A/C),
which covers findings 1-3 and 10 (absolute main-checkout paths for the monthly-refresh inbox and backups;
refresh branches `data/<YYYY-MM>` and `data/<YYYY-MM>-<n>`; the preview server from the worktree; local
`main` advanced after the merge); C4, second part (D86 is merged, PR #32, `703b975`; the state files are written last); C7 (this claim row on
`origin/main` before any edit; the branch contains `origin/main` at Gate D); C8 (ARC-01 DIFF REVIEW of the
branch text, and `security-reviewer` on the diff, the PR body and the commit message); C9 (after the merge:
local `main` advanced per `REPOSITORY_AND_ENVIRONMENT_STATE.md` 14.4 E, and an empty diff of `CLAUDE.md`,
`.claude` and `docs` against `origin/main`, before any OPS or NB launch or refresh).

The Moderator's decisions on GOV-01's nine questions (3-Nov-2026):

1. The Guardian pre-check applies to "material or high-risk" work, in every document.
2. The TASK-017 hold is stated once, in `CLAUDE.md` "Project control", and is not narrowed (the October
   cycle needs the owner's OneDrive pin).
3. No `--delete-branch` anywhere; one merge command, `gh pr merge <n> --merge --match-head-commit <sha>`
   (`<sha>` from `gh pr view <n> --json headRefOid -q .headRefOid`); E12 stays Open (DEC-OPEN-22); the only
   carve-out is a worktree created and removed in the same task, with `git worktree remove` (never `--force`
   or `rm -rf`); if removal fails, leave it and tell the Moderator.
4. One ban wording until TASK-017 has passed, and again whenever OneDrive is not running or any `.git` file
   is cloud-only; a monthly refresh runs in its own worktree (the worktree is the default only after
   findings 1, 2, 3, 10 and the walkthrough; the fallback is "no worktree possible: ask the Moderator"); the
   two one-sentence edits outside the original claim are allowed (`docs/handover/continuations/README.md`
   and `docs/project-control/REPOSITORY_AND_ENVIRONMENT_STATE.md`).
5. A routine refresh is Material by one criterion; Gate B runs in every refresh (subject to that yes: the owner's yes to the operator-run Gate B, section 1, Blockers).
6. Gate E text (provisional wording, not adopted; DEC-OPEN-34 is open): the owner accepts client-facing
   changes and anything the owner asked to review (the narrower scope), BUT the owner decides it
   (DEC-OPEN-34) before Gate D; `security-reviewer` runs before every push, confirmed at Gate D.
7. Three extra files join the claim, and corrections carry a dated note ("Corrected 3-Nov-2026").
8. guardian-gate-b:D-09 to D-18 and the interfaces-architecture:D-08 dated update are GOV-01's;
   guardian-gate-b:D-08 was done in PR #30 (INC-19).
9. The claim check goes into the refresh preflight; if CHAT_REGISTRY shows no active Moderator, stop and
   tell the owner.

---

## 3. Work expected to need claims next (not active)

A forecast for overlap planning, INFERRED from [TASK_REGISTER.md](TASK_REGISTER.md). Nothing here holds a
claim; each row is claimed only when the Moderator assigns the task. Overlap handling:
FILE_OWNERSHIP_AND_CHANGE_CONTROL section 5.

| Task | Expected chat | Status | Expected file groups | Note |
|---|---|---|---|---|
| TASK-064 Full browser acceptance pass on the current build | EX-01 (COMPLETED; MOD-03 records the result) | IMPLEMENTED NOT FULLY VERIFIED (recording only): the pass is finished. EX-01 ran it on the live S7 build at base `c0fb2dd` on 2-Nov-2026 (15:19-16:13 UTC) and delivered a report (local only, git-ignored): all 11 checks of `docs/TESTING.md` section 3 PASS, plus the shared-link view; four new findings EX01-N1 to EX01-N4 (recorded as KNOWN_ISSUES C47 to C50 by the PR of TASK-079; the mapping is INFERRED). The update-log entry and REQ-071 are still to be written (TASK-081) | none for the check itself (read-only, browser); then the docs that record the result | Exports go to `_testdata/acceptance-2026-11/` (git-ignored) or `monthly-updates/<month>/_review/`, never to a tracked folder; a bare `_review/` at the repository root is NOT ignored. It runs read-only in the shared main checkout (no worktree, no branch, no commit). |
| TASK-020 Sep-2026 Reckoner catch-up | OPS-01 (started 9-Nov-2026 by MOD-02; no claim yet) | BLOCKED: the dry runs of steps 14 and 15 (9-Nov-2026) stopped at gates (a drop gate, deck names with no MASTER match, AIF coverage 12 to 7) and wait for the owner; nothing applied; HIGH risk if any pin, `add_reckoner_funds.js`, `--accept-drops` or universe change is approved | the whole deploy set; `docs/update-log/`; `CHANGELOG.md`; `docs/PROJECT_STATE.md`; the `CLAUDE.md` headline; `monthly-updates/<month>/`; a new `backups/` folder | Owns all six deploy files for its whole duration. The ARC-01 condition (TASK-018 merged) is lifted; the TASK-017 pass is to be recorded before any `--apply`. Its claim row must be on `origin/main` before OPS-01 edits anything. |
| TASK-021 Oct-2026 MF cycle (about 13-17-Nov-2026) | OPS-01 (read-only preparation done 9-Nov-2026; its run packet is still to come) | BLOCKED (inputs): the Regular and SIF monitor re-exports as on 31-Oct-2026 have not arrived (the 29-Oct and 2-Nov files are superseded: wrong NAV dates); the Bond file answers, DEC-OPEN-11 and DEC-OPEN-33 are open; the Direct monitor (NAV 30-Oct, label 31st October 2026, D91) is fit for the bake | as TASK-020, plus TASK-024 (renames) as its step 1 | No other `site/` claim during the cycle. The TASK-018 condition is lifted; the TASK-017 pass is recorded by the PR of TASK-079. |
| TASK-075 Public-repository hygiene PR | MOD-02 assigns | BLOCKED (DEC-OPEN-29) | tracked docs that name the old repository, `docs/PRD.md`, `docs/archive/README_original_2026-05.md`, `.gitignore` | Raised 2-Nov-2026 from the security review of PR #29 (SEC-01 to SEC-05; KNOWN_ISSUES R12). Starts only after the owner answers DEC-OPEN-29. `docs/PRD.md` is also in the scope of TASK-018 and TASK-054. |
| TASK-077 TASK-016 audit corrections backlog | MOD-02 assigns | PLANNED (TASK-018 merged 9-Nov-2026 as PR #35; no claim held) | the registers in `docs/project-control/` and the handover documents in `docs/handover/` | Raised 2-Nov-2026 from the TASK-016 audit (P3 wording and snapshot errata). TASK-018 has merged (9-Nov-2026); both touch handover documents. |

---

## 4. Recently released

Every task below passed CI `verify` on its PR and `verify` + `publish` on the push to `main`; the live files
equal `site/` at the current `main` (7 of 7, SHA-256, VERIFIED 17-Nov-2026 at `b47069b`). Ownership was released at each
merge. The branches still exist locally and on origin (deletion is DEC-OPEN-22).

PRs #31 to #36 changed documents only (VERIFIED 17-Nov-2026: `git diff --stat 32172f5 origin/main -- site tools .github package.json package-lock.json` is empty at `b47069b`). Their release rows are the first six rows below (added 17-Nov-2026); PR #35 is the release of TASK-018.

| Task | Chat | WS | Task branch | PR | Merge (release) commit | Merged (UTC) | Files | Notes |
|---|---|---|---|---|---|---|---|---|
| TASK-067 Young-fund rule in the MF bake (D94, D103) | NB-04 | NB | `feat/task-067-young-fund-rule` | #47 | `44590d4` | 18-Nov-2026 | the 14 files of the claim (tools/bake_month.js, tools/lib/fund_life.js new, tools/lib/direct_perf.js, tools/rebuild_directperf.js, tools/test/fund_life.test.js new, tools/dev/rehearsal_cases.js, tools/README.md rows, docs/MONTHLY_UPDATE_PROCESS.md row 2, docs/OPERATING_MANUAL.md, docs/TESTING.md 2.1, INTERFACE_CONTRACTS.md, KNOWN_ISSUES.md, PROJECT_STATE.md, CHANGELOG.md); no site/ change | Gate B DIFF REVIEW GO WITH CONDITIONS (G1 accepted by MOD-03: an inception after the NAV date FAILs with a return and WARNs without; the print-only "published values cleared" WARN, a stop in process row 2); CI verify run 44301499590 SUCCESS; push run 44303328861 success; live 7 of 7 = site/; npm test 968 checks; verify_page unchanged |
| Records: D89 to D96 (the answers of the owner of 9-Nov-2026; DEC-OPEN-07, -08, -30, -31 and -32 answered) | MOD-02 | GOV | `docs/mod-02-d89-d93-20261109` | #36 | `b47069b` | 17-Nov-2026 06:37 | `docs/DECISIONS.md`, `docs/project-control/DECISION_LOG.md`, `docs/project-control/README.md` (3 files, +512/-226) | Docs only (`site/` and `tools/` unchanged); head `c6bb4aa`, base `ddd0304`; opened 9-Nov-2026 12:42 UTC, merged 17-Nov-2026 06:37:48 UTC; PR check `verify` passed (run 42619217382); push run 44032631708 verify + publish success; deployment 7846135755; the 7 published files equal `site/` (SHA-256, VERIFIED 17-Nov-2026); a Moderator docs PR under rule 9, so no claim row; branch kept on origin. |
| TASK-018 (widened) Rule-document consistency (KNOWN_ISSUES E6-E15, E17; ARC-01 conditions of 2-Nov-2026) | GOV-01 | GOV | `docs/gov-01-rule-consistency-20261102` | #35 | `ddd0304` | 9-Nov-2026 12:16 | the 23 files of the claim, as recorded in the former section 1 row (`git show ddd0304:docs/project-control/ACTIVE_CHANGE_REGISTER.md`); +709/-285; none under `site/`, `tools/`, `.github/`, `package.json` or `package-lock.json` | Head `29e0d32`, base `3fd1eab`; opened 9-Nov-2026 12:13 UTC, merged 12:16:05 UTC; PR check `verify` passed (run 42615211842); push run 42615584473 success; deployment 7654433853; claim released at the merge. Per the PR description: Gate B = ARC-01 DIFF REVIEW of head `28e1d4e` and DELTA REVIEW of `29e0d32`, both GO WITH CONDITIONS (no BLOCKER, no MAJOR; conditions C1 to C7 and the 18 earlier findings met); `security-reviewer` SAFE TO PUSH at the final head; Gate C = `verify_page` and `npm test` (903 checks) identical to the baseline, one search per ARC-01 condition (G1 to G8) and a dry-run walkthrough of the monthly refresh from a scratch worktree; Gate E = the final text after D87 and D88, with the owner confirmation of their recorded wording still open. Follow-ups: ARC-01 finding 2 (`.claude/agents/qa-verifier.md` line 24), the PR-number placeholders in `CHANGELOG.md` and `docs/PROJECT_STATE.md`, and the register sweep. The branch exists on origin and locally. |
| Records: D87 and D88 (DEC-OPEN-34 answered; the operator-run Gate B approved) | MOD-02 | GOV | `docs/mod-02-d87-d88-20261109` | #34 | `3fd1eab` | 9-Nov-2026 08:59 | `docs/DECISIONS.md`, `docs/project-control/DECISION_LOG.md`, `docs/project-control/README.md` (3 files, +141/-69) | Docs only; head `9a1b9da`, base `8aeabfc`; merged before PR #35 so that PR #35 could cite D87 and D88 (ARC-01 condition C-2); PR check `verify` passed (run 42589809315); push run 42589947603 success; deployment 7650726512; a Moderator docs PR under rule 9 (no claim row); branch kept on origin. |
| Records: the TASK-018 claim row and contract v2 (GOV-01), the Guardian pre-check | MOD-02 | GOV | `docs/mod-02-claim-gov01-20261103` | #33 | `8aeabfc` | 2-Nov-2026 21:24 | `CHANGELOG.md`, `docs/PROJECT_STATE.md` and 5 registers in `docs/project-control/` (ACTIVE_CHANGE_REGISTER, CHAT_REGISTRY, DECISION_LOG, README, TASK_REGISTER); 7 files, +318/-102 | Docs only; head `4fc9da6`, base `703b975`; PR check `verify` passed (run 41528009621); push run 41528119095 success; deployment 7503796427; the TASK-018 claim was in force from this merge; branch kept on origin. |
| Records: D86 (DEC-OPEN-01 answered) and the MF dashboard data-pack analysis | MOD-02 | GOV | `docs/mod-02-d86-datapack-20261102` | #32 | `703b975` | 2-Nov-2026 19:50 | 14 files, +1179/-231: `CHANGELOG.md`, `docs/DECISIONS.md`, `docs/KNOWN_ISSUES.md`, `docs/PROJECT_STATE.md`, 9 files in `docs/project-control/` and the new `docs/update-log/2026-11-02_datapack-feasibility.md` | Docs only; head `98fdc36`, base `c0fb2dd`; PR check `verify` passed (run 41513584642); push run 41513729682 success; deployment 7501821585; no claim row (rule 9); branch kept on origin. |
| Records: the PR #30 release and the GOV-01 and EX-01 proposals | MOD-02 | GOV | `docs/mod-02-release-pr30-20261102` | #31 | `c0fb2dd` | 2-Nov-2026 14:41 | 10 files, +242/-116: `CHANGELOG.md`, `docs/KNOWN_ISSUES.md`, `docs/PROJECT_STATE.md` and 7 registers in `docs/project-control/` | Docs only; head `07a5883`, base `32172f5`; PR check `verify` passed (run 41464073329); push run 41464361000 success; deployment 7495000062; no claim row (rule 9); branch kept on origin. |
| TASK-016 MOD-02 validates the MOD-01 -> MOD-02 package against the repository | MOD-02 | GOV | `docs/mod-02-validation-20261102` | #30 | `32172f5` | 2-Nov-2026 12:20 | the 18 files (`docs/` and `CHANGELOG.md` only; one new file `docs/update-log/2026-11-02_task-016-validation.md`, 17 edited) | Docs only (`site/` and `tools/` unchanged); one commit, head `1a1b462`, base `f5c2431`; PR check `verify` passed; push run on `32172f5` (Actions run 41443940610) passed, verify + publish; live files 7 of 7 equal `site/` (SHA-256, 2-Nov-2026); a Moderator docs PR under rule 9, so no claim row; Gate D done, Gate E (the owner confirms the D84 and D85 wording) pending. The branch exists on origin and locally. |
| TASK-015 Produce the MOD-01 -> MOD-02 handover package | MOD-01 | GOV | `handover/mod-01-to-mod-02-20261028` | #29 | `f5c2431` | 30-Oct-2026 07:46 | the 28 files (10 under `docs/handover`, 12 under `docs/project-control`, `.claude/agents/integration-guardian.md`, `CLAUDE.md`, `CHANGELOG.md`, `docs/KNOWN_ISSUES.md`, `docs/PROJECT_STATE.md`, `docs/README.md`) | Docs and one agent definition only; head `7cc3946`; verify green; merged 58 s after the PR was opened; claim released at the merge, recorded 2-Nov-2026; Gate A reconstructed and Gate B by ARC-01 on 2-Nov-2026 (`INTEGRATION_AND_REGRESSION_LOG.md` section 11). The branch exists on origin and locally. |
| TASK-014 Ingest the outgoing owner's 23-Oct export | MOD-01 | EX | `docs/handover-export-ingestion` | #28 | `2b2a397` | 27-Oct-2026 12:27 | `CHANGELOG.md`, `CLAUDE.md`, `docs/INPUT_FILES.md`, `docs/KNOWN_ISSUES.md`, `docs/MONTHLY_UPDATE_PROCESS.md`, `docs/PROJECT_STATE.md`, `docs/handover/README.md`, `docs/update-log/2026-10-23_handover-export.md` | Docs only. Baseline of the package (28-Oct-2026). The branch exists on origin only. |
| TASK-013 PowerPoint design system: release record | NB-03 | NB | `docs/release-pr26` | #27 | `5bcce88` | 22-Oct-2026 15:41 | `CHANGELOG.md`, `docs/DECISIONS.md`, `docs/PROJECT_STATE.md` | Records the PR #26 publish and live check. |
| TASK-013 PowerPoint design system | NB-03 | NB | `feat/pptx-design-system` | #26 | `5d39821` | 22-Oct-2026 15:37 | `site/index.html` (export section, `H.isExpectedReturn`), `tools/test/pptx_layout.test.js`, `tools/dev/render_pptx.ps1`, `tools/dev/check_pptx_bounds.js`, `tools/README.md`, `CLAUDE.md` (rule 10), `CHANGELOG.md` and 8 docs including the new `docs/proposal-output-format-audit.md` | The last change to `site/` (site content S7). Owner's go-ahead 15:36 UTC. Worked in the shared main checkout (the R6 lesson). Task status IMPLEMENTED NOT FULLY VERIFIED (TASK-064 still due). |
| TASK-012 Live acceptance check of the new site | MOD-01 | EX | `docs/acceptance-check-c24-c27` | #25 | `83f777c` | 21-Oct-2026 14:00 | `docs/KNOWN_ISSUES.md`, `docs/PROJECT_STATE.md` | Recorded the 7-area PASS on site state S6 and C24-C27. |
| TASK-008 Outgoing-owner export prompt (last part) | MOD-01 | EX | `docs/export-prompt-c19-c23` | #24 | `882160c` | 21-Oct-2026 13:22 | `docs/handover/DATA_EXTRACTION_PROMPT.md` | First part in PR #16 (`6dc08ef`, 19-Oct-2026). |
| TASK-011 Five P3 follow-ups | NB-02 | NB | `fix/missing-input-exit-2`, `fix/atomic-rename-retry`, `fix/c17-matrix-footnote`, `fix/c18-select-popover-dagger`, `fix/a27-rehearse-old-site` | #19-#23 | `699978b`, `0cb7e95`, `75538de`, `fb9cbd6`, `1523bbc` | 21-Oct-2026 06:06-06:41 | `site/index.html` (#21, #22), `tools/lib/blocklib.js` (#20), `tools/verify_page.js` and 17 other tools (#19), `tools/dev/rehearse.js` (#23), `tools/test/blocklib.test.js`, `tools/test/tool_inputs.test.js`, `tools/README.md`, `CHANGELOG.md` and 7 docs | Worktree `adoring-boyd-7028f6`. PR #23's code is inside merge commit `18abff3`. PR #22 merged `origin/main` into its branch first because PR #21 had just changed `site/index.html`. |
| TASK-010 Sep-2026 Run 3 (214 funds to 30-Sep figures) | MOD-01 | OPS | `data/2026-09-c19-refresh` | #18 | `f37fa01` | 21-Oct-2026 05:57 | `site/index.html` (MASTER data), `docs/update-log/2026-09_Sep-2026.md`, `CHANGELOG.md`, `CLAUDE.md`, `docs/DECISIONS.md`, `docs/KNOWN_ISSUES.md`, `docs/PROJECT_STATE.md` | The last data refresh. Held 19-21-Oct for the owner's approval (D81). Backup `backups/2026-10-19_pre-c19-rebake/`. |

Older merges (PRs #1-#17) are in [INTEGRATION_AND_REGRESSION_LOG.md](INTEGRATION_AND_REGRESSION_LOG.md)
and [`CHANGELOG.md`](../../CHANGELOG.md). File lists above are from `git diff --name-only` between
consecutive merges (VERIFIED, 28-Oct-2026; the TASK-015 row VERIFIED 2-Nov-2026; the TASK-016 row
VERIFIED 2-Nov-2026: 18 files, `git diff --name-status f5c2431 32172f5`). The rows of PRs #31 to #36 are from `git diff --stat <merge>^1 <merge>` and the PR pages (VERIFIED 17-Nov-2026).

---

## 5. Keeping this register current

1. **Only the Moderator edits this file.** Sub-chats report (Gate A report, blocker, handover) and the
   Moderator updates the row.
2. **Claim before editing.** Add the row, with its change-impact contract in section 2 when the change is
   material, and commit it to `main` in a docs PR before the chat edits anything; a claim is in force when
   it is on `origin/main`. Several updates may share one PR. Procedure:
   FILE_OWNERSHIP_AND_CHANGE_CONTROL section 4.
3. **Update at every event**: chat started; branch cut (record the baseline SHA); scope change (contract
   and files); commit pushed (latest commit); PR opened (number); each gate result; blocker raised or
   cleared; handover (chat and branch change to the successor); merge.
4. **Release at the merge.** Move the row to section 4 with the task branch, PR number, merge SHA, merge
   time (UTC) and files, and delete its contract from section 2 (the PR description keeps the copy made at
   Gate A). Keep at least the last ten releases here; older ones live in the integration log.
5. **Check against git at the start of every Moderator session**: `git fetch origin`;
   `gh pr list --state open`; `git branch -r --no-merged origin/main`; `git worktree list`.
   `git branch -r --no-merged origin/main` prints `upstream/HEAD` and `upstream/main` (the read-only
   upstream refs): expected, not a difference. Every open PR, unmerged branch and coding worktree must
   have a row, and every row must have a live branch or worktree. Investigate any difference; do not guess.
6. **Vocabulary.** Status only from: VERIFIED COMPLETE, IMPLEMENTED NOT FULLY VERIFIED, IN PROGRESS,
   PLANNED, BLOCKED, NOT STARTED, EXISTING DEFECT, UNKNOWN / NEEDS INVESTIGATION, SUPERSEDED. SHAs as 7
   characters, dates as 28-Oct-2026, times in UTC.
7. **Public repository**: no client names, investor data, personal data or secrets in any row.
8. **Commit safely**: register changes are committed with the OneDrive-safe method in
   [REPOSITORY_AND_ENVIRONMENT_STATE.md](REPOSITORY_AND_ENVIRONMENT_STATE.md) (never `git checkout`, `git switch`, `git merge` or `git pull` in the main checkout).
9. **Moderator docs PRs.** A docs PR by the Moderator that edits only the Moderator-owned records and the
   state and decision documents (`docs/PROJECT_STATE.md`, `CHANGELOG.md`, `docs/KNOWN_ISSUES.md`,
   `docs/DECISIONS.md`) and overlaps no active claim needs no claim row; its branch, PR number and merge
   SHA are recorded in section 4 and in the integration log at release (applied to PR #30,
   2-Nov-2026).

**MOD-02's first update (done 2-Nov-2026):** TASK-015 moved to section 4 (PR #29, `f5c2431`); its
contract condensed into the integration log; TASK-016 completed and released as PR #30 (`32172f5`,
merged 2-Nov-2026 12:20 UTC; every claim about code, data, tests, CI and the live site reproduced; 77
document findings, P1 0 / P2 17 / P3 60, corrected or assigned; deviations and ARC-01 conditions in the
integration log and the update-log). The freeze ends when the owner directs the next work (see the
freeze paragraph). A follow-up docs PR (PR #31, merged 2-Nov-2026 14:41 UTC, `c0fb2dd`) recorded this
release and added the GOV-01 and EX-01 proposals; its entries took effect when it merged. The D86 records PR
(#32, merged 2-Nov-2026 19:50 UTC, `703b975`) took effect when it merged; the claim record (PR #33, merged 2-Nov-2026 21:24 UTC, `8aeabfc`) took effect when it merged. The release rows of PRs #31 to #36 were added on 17-Nov-2026 (section 4).

**Bootstrap note.** TASK-015 created this register, so its claim is recorded in the same commit as the
register itself (it could not be on `origin/main` before the work began).

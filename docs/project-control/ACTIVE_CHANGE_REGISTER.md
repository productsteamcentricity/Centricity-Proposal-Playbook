# Active change register

| Field | Value |
|---|---|
| Version | 2 |
| Date | 2-Nov-2026 |
| Author chat | MOD-01 (first version); MOD-02 (updates of 2-Nov-2026) |
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

**Implementation freeze (update 2-Nov-2026).** The owner stopped all implementation on 27-Oct-2026
(REQ-063). MOD-02 completed TASK-016 on 2-Nov-2026 (effective when the docs PR from branch
`docs/mod-02-validation-20261102` merges). ARC-01 (DIFF REVIEW of TASK-015, 2-Nov-2026, GO WITH
CONDITIONS) requires that no `/monthly-update` run, no tool `--apply` and no OPS or NB sub-chat starts
until the widened TASK-018 docs PR is merged. Read-only chats (EX-01 for TASK-064) and docs-only GOV
chats may start. No new claim is granted until the owner directs the next work.

---

## 1. Active tasks

| Task | Chat | Workstream | Worktree / working directory | Source branch and baseline commit | Task branch | Files and modules being modified | Shared interfaces affected | Dependencies and overlaps | Status | Latest commit | Review and integration status | Blockers | Ownership released? |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| none on 2-Nov-2026 (TASK-015 released at the merge of PR #29) | - | - | - | - | - | - | - | - | - | - | - | - | - |

---

## 2. Change-impact contracts for active tasks

No active task has a contract (2-Nov-2026). The TASK-015 contract, as it stood at release, is condensed in
`INTEGRATION_AND_REGRESSION_LOG.md` section 11 (entry PR #29) (full text of the TASK-015 contract:
`git show f5c2431:docs/project-control/ACTIVE_CHANGE_REGISTER.md`).

---

## 3. Work expected to need claims next (not active)

A forecast for overlap planning, INFERRED from [TASK_REGISTER.md](TASK_REGISTER.md). Nothing here holds a
claim; each row is claimed only when the Moderator assigns the task. Overlap handling:
FILE_OWNERSHIP_AND_CHANGE_CONTROL section 5.

| Task | Expected chat | Status | Expected file groups | Note |
|---|---|---|---|---|
| TASK-064 Full browser acceptance pass on the current build | MOD-02 or a new EX chat | PLANNED: proposed to the owner as EX-01 (read-only; the base SHA is recorded in the launch packet) | none for the check itself (read-only, browser); then the docs that record the result | Exports go to a local `_review/` folder, never to tracked folders. |
| TASK-018 Docs-consistency PR | GOV-01 (own worktree) | PLANNED | `docs/KNOWN_ISSUES.md`, `docs/PROJECT_STATE.md`, `docs/MONTHLY_UPDATE_PROCESS.md`, `.claude/skills/monthly-update/SKILL.md`, `docs/HANDOVER.md`, `docs/DEVELOPMENT_SETUP.md`, `docs/DEPLOYMENT.md`, `docs/TESTING.md`, `docs/ARCHITECTURE.md`, `.claude/agents/release-manager.md`, `monthly-updates/00_INBOX/README.md` (tracked), `docs/OPERATING_MANUAL.md`, `docs/PRD.md`, `CLAUDE.md`, `.claude/agents/integration-guardian.md`, `docs/handover/MODERATOR_BOOTSTRAP_PROMPT.md`, `docs/handover/CODEBASE_GUARDIAN_HANDOVER_2026-10-28_v1.md`, `docs/handover/NEW_BUILD_HANDOVER_2026-10-28_v1.md`, `docs/handover/EXISTING_DASHBOARD_HANDOVER_2026-10-28_v1.md`, `docs/project-control/FILE_OWNERSHIP_AND_CHANGE_CONTROL.md` | Scope widened 2-Nov-2026: KNOWN_ISSUES E6-E15 plus the ARC-01 findings that gate OPS and NB launches (E17). Material (rule documents): contract + ARC-01 DIFF REVIEW + security-reviewer; gates every OPS/NB launch; overlaps TASK-071, TASK-074 and TASK-054 (`docs/PRD.md`). |
| TASK-020 Sep-2026 Reckoner catch-up | new OPS chat (OPS-01) | BLOCKED (desk files DESK-01..DESK-04) | the whole deploy set; `docs/update-log/`; `CHANGELOG.md`; `docs/PROJECT_STATE.md`; the `CLAUDE.md` headline; `monthly-updates/<month>/`; a new `backups/` folder | Owns all six deploy files for its whole duration. Not before the widened TASK-018 PR merges (ARC-01 condition, 2-Nov-2026). |
| TASK-021 Oct-2026 MF cycle (about 13-17-Nov-2026) | new OPS chat | PLANNED | as TASK-020, plus TASK-024 (renames) as its step 1 | No other `site/` claim during the cycle. Not before the widened TASK-018 PR merges (ARC-01 condition, 2-Nov-2026). |
| TASK-075 Public-repository hygiene PR | MOD-02 assigns | BLOCKED (DEC-OPEN-29) | tracked docs that name the old repository, `docs/PRD.md`, `docs/archive/README_original_2026-05.md`, `.gitignore` | Raised 2-Nov-2026 from the security review of PR #29 (SEC-01 to SEC-05; KNOWN_ISSUES R12). Starts only after the owner answers DEC-OPEN-29. `docs/PRD.md` is also in the scope of TASK-018 and TASK-054. |
| TASK-077 TASK-016 audit corrections backlog | MOD-02 assigns | PLANNED after TASK-018 | the registers in `docs/project-control/` and the handover documents in `docs/handover/` | Raised 2-Nov-2026 from the TASK-016 audit (P3 wording and snapshot errata). Starts after TASK-018; both touch handover documents. |

---

## 4. Recently released

Every task below passed CI `verify` on its PR and `verify` + `publish` on the push to `main`; the live files
equal `site/` at the current `main` (7 of 7, SHA-256, VERIFIED 2-Nov-2026). Ownership was released at each
merge. The branches still exist locally and on origin (deletion is DEC-OPEN-22).

| Task | Chat | WS | Task branch | PR | Merge (release) commit | Merged (UTC) | Files | Notes |
|---|---|---|---|---|---|---|---|---|
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
consecutive merges (VERIFIED, 28-Oct-2026; the TASK-015 row VERIFIED 2-Nov-2026).

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
   [REPOSITORY_AND_ENVIRONMENT_STATE.md](REPOSITORY_AND_ENVIRONMENT_STATE.md) (never `git checkout` /
   `git switch` in the main checkout).
9. **Moderator docs PRs.** A docs PR by the Moderator that edits only the Moderator-owned records and the
   state and decision documents (`docs/PROJECT_STATE.md`, `CHANGELOG.md`, `docs/KNOWN_ISSUES.md`,
   `docs/DECISIONS.md`) and overlaps no active claim needs no claim row; its branch, PR number and merge
   SHA are recorded in section 4 and in the integration log at release (applied to the TASK-016 PR,
   2-Nov-2026).

**MOD-02's first update (done 2-Nov-2026):** TASK-015 moved to section 4 (PR #29, `f5c2431`); its
contract condensed into the integration log; TASK-016 completed (effective when the docs PR from branch
`docs/mod-02-validation-20261102` merges; every claim about code, data, tests, CI and the live site
reproduced; 77 document findings, P1 0 / P2 17 / P3 60, corrected or assigned; deviations and ARC-01
conditions in the integration log and the update-log). The freeze ends when the owner directs the next
work (see the freeze paragraph).

**Bootstrap note.** TASK-015 created this register, so its claim is recorded in the same commit as the
register itself (it could not be on `origin/main` before the work began).

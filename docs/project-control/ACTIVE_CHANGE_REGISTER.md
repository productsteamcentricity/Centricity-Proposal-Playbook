# Active change register

| Field | Value |
|---|---|
| Version | 1 |
| Date | 28-Oct-2026 |
| Author chat | MOD-01 |
| Status | Authoritative (live register; only the Moderator edits it) |
| Supersedes | none (first version) |
| Next review | At the merge of `handover/mod-01-to-mod-02-20261028` (MOD-02 releases TASK-015); then at every claim, gate result, handover and merge |

This register says which task may modify which files **right now**. The rules for claiming, overlaps,
contracts, Guardian review and gates are in
[FILE_OWNERSHIP_AND_CHANGE_CONTROL.md](FILE_OWNERSHIP_AND_CHANGE_CONTROL.md); the chats are in
[CHAT_REGISTRY.md](CHAT_REGISTRY.md); every task, open or done, is in [TASK_REGISTER.md](TASK_REGISTER.md).

A file not covered by an active row is free, but nobody edits it without a claim recorded here first. To
read the current version from another worktree: `git fetch origin`, then
`git show origin/main:docs/project-control/ACTIVE_CHANGE_REGISTER.md`.

**Implementation freeze.** The owner stopped all implementation on 27-Oct-2026 and re-issued the order on
28-Oct-2026 (REQ-063): the only work is the handover package. No other task may claim files until MOD-02
has completed TASK-016 (validation of the package against the repository) and assigned work.

---

## 1. Active tasks

| Task | Chat | Workstream | Worktree / working directory | Source branch and baseline commit | Task branch | Files and modules being modified | Shared interfaces affected | Dependencies and overlaps | Status | Latest commit | Review and integration status | Blockers | Ownership released? |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| TASK-015 Produce the MOD-01 -> MOD-02 handover package | MOD-01 | GOV | The main checkout (repo root), which stays on `main`. MOD-01's writer subagents only write the files listed; none runs git. | `main` at `2b2a397` (PR #28 merge, 27-Oct-2026 12:27 UTC) | `handover/mod-01-to-mod-02-20261028`, created from `2b2a397` with `git branch` (no checkout); commit through a temporary index | `docs/handover/**`, `docs/project-control/**`, `docs/KNOWN_ISSUES.md`, `.claude/agents/integration-guardian.md`, `CLAUDE.md`, `docs/README.md`, `CHANGELOG.md`, `docs/PROJECT_STATE.md` | No code or data interface: `site/` and `tools/` do not change. Instruction surfaces change: `CLAUDE.md` is read by every session (its new "Project control" section overrides the `git switch` steps of the `monthly-update` skill, KNOWN_ISSUES E7); the agent roster goes from 8 to 9. | No other active task. Blocks TASK-016 and, through the freeze, every new task. Later tasks TASK-018, TASK-071 and TASK-074 will edit some of the same docs. | IN PROGRESS | None on the task branch yet. On 28-Oct-2026 the work is uncommitted in the main checkout (`CLAUDE.md` and `docs/README.md` modified, new files under `docs/handover/` and `docs/project-control/`; VERIFIED `git status`). MOD-01 gives the head SHA in the PR description; MOD-02 records the merge SHA here at release. | Gate A: PR description by MOD-01. Gate B: a read-only consistency check of the package (REQ-094) and `security-reviewer` before the push; the `integration-guardian` subagent is expected to load only in sessions started after the merge (INFERRED; ARC-01 QUEUED), so its first review is MOD-02's validation. Gate C: `node tools/verify_page.js site` and `npm test` on the branch, expected unchanged from the 28-Oct-2026 runs (verify_page as in the CLAUDE.md headline; `npm test` 903 checks) because `site/` and `tools/` do not change; CI `verify` on the PR. Gate D: merge after `verify` passes. Gate E: MOD-02's validation (TASK-016), then the owner. None of these had run when this row was written (28-Oct-2026). | none | No. Released at the merge of `handover/mod-01-to-mod-02-20261028`. |

---

## 2. Change-impact contracts for active tasks

### TASK-015 (risk class: material; it changes instructions and adds an agent definition, no code or data)

| # | Field | Contract |
|---|---|---|
| 1 | Task and requirement IDs | TASK-015; REQ-063 .. REQ-095 (the handover master prompt of 27-Oct-2026, re-issued 28-Oct-2026) |
| 2 | Objective and acceptance criteria | Give MOD-02 a complete, verified handover package. Done when: every file in the package design exists under `docs/handover/`, `docs/project-control/` and `.claude/agents/integration-guardian.md`; IDs and key numbers agree across all files; no file under `site/` or `tools/` changed; `verify_page` and `npm test` on the branch equal the 28-Oct-2026 runs (K11, K12); CI `verify` passes; the security review finds no client data, personal data or secrets; MOD-02 validates the package (TASK-016). |
| 3 | Existing behaviour to preserve | All of `site/` and `tools/` byte-identical; the existing content of `docs/handover/README.md` (ingestion of the outgoing owner's export) kept as a section; existing KNOWN_ISSUES IDs unchanged (corrections marked and dated 28-Oct-2026); `docs/PROJECT_STATE.md` stays the single state document. |
| 4 | Intended behaviour changes | New handover documents and project-control registers; a "Project control" section and two repository-map rows in `CLAUDE.md`; two rows in `docs/README.md`; the new `integration-guardian` agent; new KNOWN_ISSUES entries (A29-A31, C41-C45, E6-E16, R9-R11) and marked corrections; `CHANGELOG.md` and `docs/PROJECT_STATE.md` entries. |
| 5 | Files and modules affected | As in the row above. |
| 6 | Shared interfaces and downstream consumers | `CLAUDE.md` (every future session reads it); the agent roster used by the Moderator; the registers become the coordination record for all chats. No page, tool, test or CI interface. |
| 7 | Data schema, configuration and dependency changes | One new Claude Code agent definition; no data, CI, package or library change. |
| 8 | Financial rules or calculations affected | None changed. The documents describe existing rules and record corrections (for example KNOWN_ISSUES C24). |
| 9 | Other tasks that may overlap | None active. EXT-PR-01 works in another folder and repository. TASK-018, TASK-071 and TASK-074 will later edit some of the same documents; they start after the merge. |
| 10 | Required tests | `node tools/verify_page.js site`; `npm test`; CI `verify`; `security-reviewer`; a check that added lines are ASCII and hold no client names, tokens or personal data; a link and ID consistency check across the package. |
| 11 | Rollback and migration considerations | Docs and one agent file only: undo with `git revert -m 1 <merge sha>` in a PR. Nothing to migrate. |
| 12 | Explicit non-goals | No code or data change. No fix of the stale operator docs beyond what the package records (TASK-018). No branch, worktree or stash clean-up (TASK-059 .. TASK-062). No repository-settings change. |

---

## 3. Work expected to need claims next (not active)

A forecast for overlap planning, INFERRED from [TASK_REGISTER.md](TASK_REGISTER.md). Nothing here holds a
claim; each row is claimed only when the Moderator assigns the task. Overlap handling:
FILE_OWNERSHIP_AND_CHANGE_CONTROL section 5.

| Task | Expected chat | Status | Expected file groups | Note |
|---|---|---|---|---|
| TASK-016 Validate the package | MOD-02 | PLANNED | Moderator-owned registers only | Read-only checks first; then register updates (release of TASK-015, CHAT_REGISTRY first updates). |
| TASK-064 Full browser acceptance pass on the current build | MOD-02 or a new EX chat | PLANNED | none for the check itself (read-only, browser); then the docs that record the result | Exports go to a local `_review/` folder, never to tracked folders. |
| TASK-018 Docs-consistency PR | MOD-02 | NOT STARTED | `docs/KNOWN_ISSUES.md`, `docs/PROJECT_STATE.md`, `docs/MONTHLY_UPDATE_PROCESS.md`, `.claude/skills/monthly-update/SKILL.md`, `docs/HANDOVER.md`, `docs/DEVELOPMENT_SETUP.md`, `docs/DEPLOYMENT.md`, `docs/TESTING.md`, `docs/ARCHITECTURE.md`, `.claude/agents/release-manager.md`, `monthly-updates/00_INBOX/README.md` (tracked) | Scope from KNOWN_ISSUES E7-E15. Overlaps TASK-071 and TASK-074 (docs). |
| TASK-020 Sep-2026 Reckoner catch-up | new OPS chat (OPS-01) | BLOCKED (desk files DESK-01..DESK-04) | the whole deploy set; `docs/update-log/`; `CHANGELOG.md`; `docs/PROJECT_STATE.md`; the `CLAUDE.md` headline; `monthly-updates/<month>/`; a new `backups/` folder | Owns all six deploy files for its whole duration. |
| TASK-021 Oct-2026 MF cycle (about 13-17-Nov-2026) | new OPS chat | PLANNED | as TASK-020, plus TASK-024 (renames) as its step 1 | No other `site/` claim during the cycle. |

---

## 4. Recently released

Every task below passed CI `verify` on its PR and `verify` + `publish` on the push to `main`; the live files
equal `site/` at the current `main` (7 of 7, SHA-256, VERIFIED 28-Oct-2026). Ownership was released at each
merge. The branches still exist locally and on origin (deletion is DEC-OPEN-22).

| Task | Chat | WS | Task branch | PR | Merge (release) commit | Merged (UTC) | Files | Notes |
|---|---|---|---|---|---|---|---|---|
| TASK-014 Ingest the outgoing owner's 23-Oct export | MOD-01 | EX | `docs/handover-export-ingestion` | #28 | `2b2a397` | 27-Oct-2026 12:27 | `CHANGELOG.md`, `CLAUDE.md`, `docs/INPUT_FILES.md`, `docs/KNOWN_ISSUES.md`, `docs/MONTHLY_UPDATE_PROCESS.md`, `docs/PROJECT_STATE.md`, `docs/handover/README.md`, `docs/update-log/2026-10-23_handover-export.md` | Docs only. Current baseline of the package. The branch exists on origin only. |
| TASK-013 PowerPoint design system: release record | NB-03 | NB | `docs/release-pr26` | #27 | `5bcce88` | 22-Oct-2026 15:41 | `CHANGELOG.md`, `docs/DECISIONS.md`, `docs/PROJECT_STATE.md` | Records the PR #26 publish and live check. |
| TASK-013 PowerPoint design system | NB-03 | NB | `feat/pptx-design-system` | #26 | `5d39821` | 22-Oct-2026 15:37 | `site/index.html` (export section, `H.isExpectedReturn`), `tools/test/pptx_layout.test.js`, `tools/dev/render_pptx.ps1`, `tools/dev/check_pptx_bounds.js`, `tools/README.md`, `CLAUDE.md` (rule 10), `CHANGELOG.md` and 8 docs including the new `docs/proposal-output-format-audit.md` | The last change to `site/` (site content S7). Owner's go-ahead 15:36 UTC. Worked in the shared main checkout (the R6 lesson). Task status IMPLEMENTED NOT FULLY VERIFIED (TASK-064 still due). |
| TASK-012 Live acceptance check of the new site | MOD-01 | EX | `docs/acceptance-check-c24-c27` | #25 | `83f777c` | 21-Oct-2026 14:00 | `docs/KNOWN_ISSUES.md`, `docs/PROJECT_STATE.md` | Recorded the 7-area PASS on site state S6 and C24-C27. |
| TASK-008 Outgoing-owner export prompt (last part) | MOD-01 | EX | `docs/export-prompt-c19-c23` | #24 | `882160c` | 21-Oct-2026 13:22 | `docs/handover/DATA_EXTRACTION_PROMPT.md` | First part in PR #16 (`6dc08ef`, 19-Oct-2026). |
| TASK-011 Five P3 follow-ups | NB-02 | NB | `fix/missing-input-exit-2`, `fix/atomic-rename-retry`, `fix/c17-matrix-footnote`, `fix/c18-select-popover-dagger`, `fix/a27-rehearse-old-site` | #19-#23 | `699978b`, `0cb7e95`, `75538de`, `fb9cbd6`, `1523bbc` | 21-Oct-2026 06:06-06:41 | `site/index.html` (#21, #22), `tools/lib/blocklib.js` (#20), `tools/verify_page.js` and 17 other tools (#19), `tools/dev/rehearse.js` (#23), `tools/test/blocklib.test.js`, `tools/test/tool_inputs.test.js`, `tools/README.md`, `CHANGELOG.md` and 7 docs | Worktree `adoring-boyd-7028f6`. PR #23's code is inside merge commit `18abff3`. PR #22 merged `origin/main` into its branch first because PR #21 had just changed `site/index.html`. |
| TASK-010 Sep-2026 Run 3 (214 funds to 30-Sep figures) | MOD-01 | OPS | `data/2026-09-c19-refresh` | #18 | `f37fa01` | 21-Oct-2026 05:57 | `site/index.html` (MASTER data), `docs/update-log/2026-09_Sep-2026.md`, `CHANGELOG.md`, `CLAUDE.md`, `docs/DECISIONS.md`, `docs/KNOWN_ISSUES.md`, `docs/PROJECT_STATE.md` | The last data refresh. Held 19-21-Oct for the owner's approval (D81). Backup `backups/2026-10-19_pre-c19-rebake/`. |

Older merges (PRs #1-#17) are in [INTEGRATION_AND_REGRESSION_LOG.md](INTEGRATION_AND_REGRESSION_LOG.md)
and [`CHANGELOG.md`](../../CHANGELOG.md). File lists above are from `git diff --name-only` between
consecutive merges (VERIFIED, 28-Oct-2026).

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
   `gh pr list --state open`; `git branch -r --no-merged origin/main`; `git worktree list`. Every open PR,
   unmerged branch and coding worktree must have a row, and every row must have a live branch or worktree.
   Investigate any difference; do not guess.
6. **Vocabulary.** Status only from: VERIFIED COMPLETE, IMPLEMENTED NOT FULLY VERIFIED, IN PROGRESS,
   PLANNED, BLOCKED, NOT STARTED, EXISTING DEFECT, UNKNOWN / NEEDS INVESTIGATION, SUPERSEDED. SHAs as 7
   characters, dates as 28-Oct-2026, times in UTC.
7. **Public repository**: no client names, investor data, personal data or secrets in any row.
8. **Commit safely**: register changes are committed with the OneDrive-safe method in
   [REPOSITORY_AND_ENVIRONMENT_STATE.md](REPOSITORY_AND_ENVIRONMENT_STATE.md) (never `git checkout` /
   `git switch` in the main checkout).

**MOD-02's first update:** after the handover branch is merged, move TASK-015 to section 4 with its PR
number and merge SHA, delete its contract from section 2, and record whether TASK-016 found any gap. The
freeze ends only when MOD-02 has completed TASK-016 and the owner directs the next work.

**Bootstrap note.** TASK-015 created this register, so its claim is recorded in the same commit as the
register itself (it could not be on `origin/main` before the work began).

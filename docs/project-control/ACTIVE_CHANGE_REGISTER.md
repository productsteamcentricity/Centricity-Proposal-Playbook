# Active change register

| Field | Value |
|---|---|
| Version | 2 |
| Date | 3-Nov-2026 |
| Author chat | MOD-01 (first version); MOD-02 (updates of 2-Nov-2026 and 3-Nov-2026) |
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

**Implementation freeze (updates 2-Nov-2026 and 3-Nov-2026).** The owner stopped all implementation on 27-Oct-2026
(REQ-063). MOD-02 completed TASK-016 on 2-Nov-2026 (PR #30, merged 2-Nov-2026 12:20 UTC, `32172f5`).
ARC-01 (DIFF REVIEW of TASK-015, 2-Nov-2026, GO WITH CONDITIONS) requires that no `/monthly-update`
run, no tool `--apply` and no OPS or NB sub-chat starts until the widened TASK-018 docs PR is merged.
Read-only chats (EX-01 for TASK-064) and docs-only GOV chats may start. The owner started GOV-01
(TASK-018) and EX-01 (TASK-064) on 2-Nov-2026; the TASK-018 claim is recorded in section 1 and is in
force from the merge of the record that adds it (3-Nov-2026). No other new claim is granted until the
owner directs the next work. The 3-Nov-2026 entries (the TASK-018 claim in section 1 and its condensed
contract in section 2) take effect when the record that adds them merges; a claim is in force only when
its row is on `origin/main`. The merge of TASK-018 lifts the ARC-01 condition only. A `/monthly-update` run
and any tool `--apply` on the real `site/` also wait for TASK-017 (the owner pins the folder, the
cloud-only `.git` files hydrate, MOD-02 records the pass). The Sep catch-up (TASK-020) and the October
cycle (about 13-17 Nov) cannot start before that.

---

## 1. Active tasks

| Task | Chat | Workstream | Worktree / working directory | Source branch and baseline commit | Task branch | Files and modules being modified | Shared interfaces affected | Dependencies and overlaps | Status | Latest commit | Review and integration status | Blockers | Ownership released? |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| TASK-018 (widened) Rule-document consistency (KNOWN_ISSUES E6-E15, E17; ARC-01 conditions of 2-Nov-2026) | GOV-01 (session `local_622b2ebd`; app title "GOV-01 Playbook: rule documents consistency"; started by the owner on 2-Nov-2026) | GOV | Its own worktree `.claude/worktrees/focused-wright-d50bee`: the folder that was NB-01's worktree, REUSED by the app for GOV-01 (TASK-061 must not remove it while GOV-01 runs). Never the shared main checkout. | App session branch `claude/affectionate-lovelace-f11b67`, cut at `c0fb2dd` (0 commits on 3-Nov-2026). The new base SHA (after the D86 records PR and this claim record) comes with MOD-02's "claim in force" message; GOV-01 then merges `origin/main` into its task branch (no rebase). | `docs/gov-01-rule-consistency-20261102`, to be made with `git switch -c` at the starting commit (changes no file). The folder name and the app branch name differ. | 23 files. RULE (8): `CLAUDE.md`; `.claude/skills/monthly-update/SKILL.md`; `.claude/skills/verify-dashboard/SKILL.md` (added 3-Nov-2026: its steps 2 and 3 use a relative preview and export path; frontmatter untouched); `docs/MONTHLY_UPDATE_PROCESS.md`; `.claude/agents/release-manager.md`; `.claude/agents/integration-guardian.md`; `docs/project-control/FILE_OWNERSHIP_AND_CHANGE_CONTROL.md`; `docs/handover/MODERATOR_BOOTSTRAP_PROMPT.md`. ERRATA HOME (1): `docs/handover/README.md`. DOCS (8): `docs/DEVELOPMENT_SETUP.md`; `docs/HANDOVER.md`; `docs/TESTING.md`; `docs/ARCHITECTURE.md`; `docs/OPERATING_MANUAL.md`; `docs/PRD.md`; `docs/DEPLOYMENT.md`; `monthly-updates/00_INBOX/README.md` (tracked). STATE (3; written last, on top of the D86 text): `docs/KNOWN_ISSUES.md`; `docs/PROJECT_STATE.md`; `CHANGELOG.md`. ADDED at GOV-01's request (3): `docs/handover/continuations/README.md`; `docs/project-control/REPOSITORY_AND_ENVIRONMENT_STATE.md` (procedure F, finding D-13); `docs/update-log/2026-10-23_handover-export.md` (the second copy of the B8 sentence). Moderator-owned, granted for this task (5 of the 23; the group `docs/project-control/**`, `docs/handover/**` in FILE_OWNERSHIP_AND_CHANGE_CONTROL section 3): `docs/project-control/FILE_OWNERSHIP_AND_CHANGE_CONTROL.md`, `docs/project-control/REPOSITORY_AND_ENVIRONMENT_STATE.md`, `docs/handover/MODERATOR_BOOTSTRAP_PROMPT.md`, `docs/handover/continuations/README.md` and the errata home `docs/handover/README.md`. | Instruction surfaces that every session reads (`CLAUDE.md`, the two skills, the `release-manager` and `integration-guardian` definitions, the Moderator's bootstrap prompt). No code, data, tool, test, CI or page interface: `site/` and `tools/` are outside the claim. The dated 28-Oct-2026 snapshots (the four handover documents and the successor prompt) are NOT edited in place: corrections go to the errata in `docs/handover/README.md`. The STATE files are shared by every change (sync with `origin/main` before the push). | Needs the D86 records PR merged first (done: PR #32, `703b975`, 2-Nov-2026 19:50 UTC), then this claim record. No other active claim. Tasks that overlap and hold no claim (sequence them after this one): TASK-054, TASK-071, TASK-074 (its `docs/DEPLOYMENT.md` half is done by TASK-018, E14), TASK-075, TASK-077 (`docs/PRD.md` is also in the scope of TASK-054 and TASK-075). TASK-020, TASK-021 and every OPS or NB launch must not start before it merges (ARC-01 condition, 2-Nov-2026). MOD-02's own updates to the three STATE files are appends, announced to GOV-01, which merges `origin/main` before its last write; the TASK-017 pass is recorded by a dated append (in PROJECT_STATE and REPOSITORY_AND_ENVIRONMENT_STATE) outside the lines GOV-01 edits. | IN PROGRESS. Contract (v2) written and Guardian pre-check done; no commit yet. The claim is in force when this row is on `origin/main`; GOV-01 edits nothing before MOD-02's written "claim in force" message. | none: the app session branch is at `c0fb2dd` with 0 commits and the task branch is not made yet (3-Nov-2026) | Risk class Material (rule documents). The contract (12 fields, v2, 3-Nov-2026) lives outside the repository; section 2 condenses it and its full copy goes into the PR description at Gate A. Guardian (ARC-01) PRE-CHECK of the contract, 3-Nov-2026: GO WITH CONDITIONS C1-C9; C2, C3, C5 and C6 confirmed by MOD-02 in writing on 3-Nov-2026 from contract v2; C1 (text confirmed; the Option W walkthrough evidence stays open until Gate A/C), C4 and C7-C9 open (section 2 says what each requires). Order of work: (1) the D86 records PR is merged (PR #32, `703b975`; C4, first part); (2) this claim record merges, because a claim is in force only when its row is on `origin/main` (C7); (3) MOD-02 sends GOV-01 "claim in force" with the new base SHA; (4) GOV-01 merges `origin/main` into its task branch (no rebase, C5), re-derives line numbers, rewrites KNOWN_ISSUES E8 and rows 12 and 17 of `monthly-updates/00_INBOX/README.md` against the post-D86 text, and writes `docs/KNOWN_ISSUES.md`, `docs/PROJECT_STATE.md` and `CHANGELOG.md` last; (5) Gate C including the Option W dry-run walkthrough (defined in section 2, field 10); `security-reviewer`; the ARC-01 DIFF REVIEW (the agent file read from the branch, run under the base text); (6) Gate D needs DEC-OPEN-34 answered and the owner's yes to the operator-run Gate B (see Blockers). | DEC-OPEN-34 (owner): who accepts a finished change (Gate E). Needed before Gate D (about the end of the week of 3-Nov-2026; no date fixed). GOV-01's text uses the narrower option (a); option (b), the owner accepts every result, would be a small text change before the merge. Also needed before Gate D: the owner's yes, after one plain sentence from MOD-02, to adding Gate B (an integration-guardian DIFF REVIEW run by the refresh operator, weaker than one run by the Moderator) to every monthly refresh as one of D61's checks (FILE_OWNERSHIP_AND_CHANGE_CONTROL section 10; the yes goes in the PR; no new D). | No. Released at the merge of `docs/gov-01-rule-consistency-20261102`. |

---

## 2. Change-impact contracts for active tasks

TASK-018 is the only active task with a contract (3-Nov-2026): it follows. The TASK-015 contract, as it
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
| TASK-064 Full browser acceptance pass on the current build | EX-01 (started by the owner on 2-Nov-2026; MOD-02 if the owner prefers) | IN PROGRESS: started by the owner on 2-Nov-2026 as EX-01 (read-only; report delivered 2-Nov-2026, results to be recorded in the next register update; the base SHA is recorded in the launch packet) | none for the check itself (read-only, browser); then the docs that record the result | Exports go to `_testdata/acceptance-2026-11/` (git-ignored) or `monthly-updates/<month>/_review/`, never to a tracked folder; a bare `_review/` at the repository root is NOT ignored. It runs read-only in the shared main checkout (no worktree, no branch, no commit). |
| TASK-020 Sep-2026 Reckoner catch-up | new OPS chat (OPS-01) | BLOCKED (desk files DESK-01..DESK-04) | the whole deploy set; `docs/update-log/`; `CHANGELOG.md`; `docs/PROJECT_STATE.md`; the `CLAUDE.md` headline; `monthly-updates/<month>/`; a new `backups/` folder | Owns all six deploy files for its whole duration. Not before the widened TASK-018 PR merges (ARC-01 condition, 2-Nov-2026). |
| TASK-021 Oct-2026 MF cycle (about 13-17-Nov-2026) | new OPS chat | PLANNED | as TASK-020, plus TASK-024 (renames) as its step 1 | No other `site/` claim during the cycle. Not before the widened TASK-018 PR merges (ARC-01 condition, 2-Nov-2026). |
| TASK-075 Public-repository hygiene PR | MOD-02 assigns | BLOCKED (DEC-OPEN-29) | tracked docs that name the old repository, `docs/PRD.md`, `docs/archive/README_original_2026-05.md`, `.gitignore` | Raised 2-Nov-2026 from the security review of PR #29 (SEC-01 to SEC-05; KNOWN_ISSUES R12). Starts only after the owner answers DEC-OPEN-29. `docs/PRD.md` is also in the scope of TASK-018 and TASK-054. |
| TASK-077 TASK-016 audit corrections backlog | MOD-02 assigns | PLANNED after TASK-018 | the registers in `docs/project-control/` and the handover documents in `docs/handover/` | Raised 2-Nov-2026 from the TASK-016 audit (P3 wording and snapshot errata). Starts after TASK-018; both touch handover documents. |

---

## 4. Recently released

Every task below passed CI `verify` on its PR and `verify` + `publish` on the push to `main`; the live files
equal `site/` at the current `main` (7 of 7, SHA-256, VERIFIED 2-Nov-2026). Ownership was released at each
merge. The branches still exist locally and on origin (deletion is DEC-OPEN-22).

PR #31 (`c0fb2dd`, 2-Nov-2026 14:41 UTC) and PR #32 (`703b975`, the D86 records, 2-Nov-2026 19:50 UTC) changed documents only; their release rows follow in the register update after this claim record has merged.

| Task | Chat | WS | Task branch | PR | Merge (release) commit | Merged (UTC) | Files | Notes |
|---|---|---|---|---|---|---|---|---|
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
VERIFIED 2-Nov-2026: 18 files, `git diff --name-status f5c2431 32172f5`).

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
   SHA are recorded in section 4 and in the integration log at release (applied to PR #30,
   2-Nov-2026).

**MOD-02's first update (done 2-Nov-2026):** TASK-015 moved to section 4 (PR #29, `f5c2431`); its
contract condensed into the integration log; TASK-016 completed and released as PR #30 (`32172f5`,
merged 2-Nov-2026 12:20 UTC; every claim about code, data, tests, CI and the live site reproduced; 77
document findings, P1 0 / P2 17 / P3 60, corrected or assigned; deviations and ARC-01 conditions in the
integration log and the update-log). The freeze ends when the owner directs the next work (see the
freeze paragraph). A follow-up docs PR (PR #31, merged 2-Nov-2026 14:41 UTC, `c0fb2dd`) recorded this
release and added the GOV-01 and EX-01 proposals; its entries took effect when it merged. The D86 records PR
(#32, merged 2-Nov-2026 19:50 UTC, `703b975`) took effect when it merged; the claim record (3-Nov-2026) takes effect when it
merges. The release rows of both follow in the register update after this one.

**Bootstrap note.** TASK-015 created this register, so its claim is recorded in the same commit as the
register itself (it could not be on `origin/main` before the work began).

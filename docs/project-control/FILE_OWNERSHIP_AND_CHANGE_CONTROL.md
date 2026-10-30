# File ownership and change control

| Field | Value |
|---|---|
| Version | 1 |
| Date | 28-Oct-2026 |
| Author chat | MOD-01 |
| Status | Authoritative (rules; the Moderator proposes changes, the owner approves those that change publishing or approvals) |
| Supersedes | none (first version) |
| Next review | MOD-02's validation (TASK-016); then whenever a rule is found wrong in practice |

This file says how several Claude chats change this repository without colliding: where each chat works,
which files one task may hold at a time, how a claim is made and released, how overlaps are resolved,
when a change-impact contract and a Guardian review are needed, how gates A-E map to this repository's
commands, and how to recover from a bad merge.

It adds multi-chat controls on top of the rules that protect production in [`CLAUDE.md`](../../CLAUDE.md)
("Rules that protect production", "How every change is made", "Never", "Project control"); those still
apply in full. Related records:

| Question | Authoritative file |
|---|---|
| Who holds which files now | [ACTIVE_CHANGE_REGISTER.md](ACTIVE_CHANGE_REGISTER.md) |
| Which chats exist and their status | [CHAT_REGISTRY.md](CHAT_REGISTRY.md) |
| What must change together (ripple lists), shared data structures and APIs | [INTERFACE_CONTRACTS.md](INTERFACE_CONTRACTS.md) |
| Modules, data flow, blast radius | [ARCHITECTURE_AND_DEPENDENCY_MAP.md](ARCHITECTURE_AND_DEPENDENCY_MAP.md) |
| Last verified baseline, incidents, merges | [INTEGRATION_AND_REGRESSION_LOG.md](INTEGRATION_AND_REGRESSION_LOG.md) |
| What can regress and which test catches it | [KNOWN_ISSUES_AND_REGRESSION_RISKS.md](KNOWN_ISSUES_AND_REGRESSION_RISKS.md) |
| Git mechanics that are safe in the OneDrive folder | [REPOSITORY_AND_ENVIRONMENT_STATE.md](REPOSITORY_AND_ENVIRONMENT_STATE.md) |
| Test commands in detail | [`docs/TESTING.md`](../TESTING.md); release steps: [`docs/DEPLOYMENT.md`](../DEPLOYMENT.md) |

---

## 1. Principles

1. **One writer per file group at a time** (section 3). The claim is recorded before editing and released
   at the merge.
2. **Isolation is by working directory, not by branch.** A new branch alone does not isolate two chats that
   edit the same folder (NB-03 and the 25-Oct-2026 incident, section 2.1).
3. **Every change goes branch -> pull request -> CI `verify` -> merge** (D68). A merge to `main` publishes
   the live site within minutes (D63), and `main` has no branch protection (KNOWN_ISSUES R9), so the gates
   below are a discipline the Moderator enforces by hand.
4. **Report, never guess** (CLAUDE.md rule 5). Never let two chats edit one file and reconcile the
   differences later.
5. **Only the Moderator grants claims and allocates register IDs** (TASK, REQ, DEC-OPEN, D, KNOWN_ISSUES,
   INC, chat IDs). Two chats taking the same number has happened (D70/D71, 19-Oct-2026, section 5).

---

## 2. Working environments

### 2.1 What exists (VERIFIED, 28-Oct-2026)

| Place | Path | Branch and state | Used by |
|---|---|---|---|
| Main checkout | `%USERPROFILE%\OneDrive - CENTRICITY FINANCIAL DISTRIBUTION PRIVATE LIMITED\Desktop\Claude Code-Investment Proposal Dashboard` (inside OneDrive) | `main` = `origin/main` = `2b2a397` | the Moderator |
| Desktop-app worktree of NB-01 (completed) | `.claude/worktrees/focused-wright-d50bee` | `fix/reckoner-drop-gates` `fe060d5`, clean | nobody (clean-up TASK-061) |
| Desktop-app worktree of NB-02 (completed) | `.claude/worktrees/adoring-boyd-7028f6` | `fix/a27-rehearse-old-site` `18abff3`, clean | nobody (TASK-061) |
| Rehearsal worktree (16-Oct-2026, PR #3) | `%USERPROFILE%\AppData\Local\Temp\cpp-old` | detached `bf20c08`, clean | nobody (TASK-061) |
| Stale worktree admin folders | `.git/worktrees/cpp-main`, `.git/worktrees/wtdocs` | prunable | none |
| Stash | `stash@{0}` (19-Oct-2026) | superseded work; applying it would revert Sep-2026 page data | never apply it (TASK-062) |

**Environment hazard.** On 28-Oct-2026, 229 of 519 `.git` files were OneDrive cloud-only placeholders and
the OneDrive client (OneDrive.exe) was not running. Reads of the current tree work; reads of historical and
stash blobs fail with `fatal: mmap failed: Invalid argument`. On 25-Oct-2026 a `git checkout` back to
`main` in the main checkout failed this way and left tracked files truncated or deleted (restored, nothing
lost; KNOWN_ISSUES R6). Until TASK-017 restores OneDrive health, treat every `git checkout` / `git switch`
inside the OneDrive folder as unsafe.

### 2.2 Who works where

| Who | Where | Rules |
|---|---|---|
| Moderator (MOD-nn) | the main checkout | Stays on `main`; never `git checkout` / `git switch`. Edits only Moderator-owned files and files its own claim covers. Creates branches with `git branch <new> origin/main` and commits by explicit path through a temporary index; brings local `main` up to `origin/main` after a merge with the method in [REPOSITORY_AND_ENVIRONMENT_STATE.md](REPOSITORY_AND_ENVIRONMENT_STATE.md). |
| Coding sub-chat (any EX, NB, OPS or GOV chat that writes files) | its own git worktree | In the desktop app: started with `start_session` and `use_worktree: true`, which creates `.claude/worktrees/<name>` on a session branch `claude/<name>` (as NB-01 and NB-02 were; VERIFIED by their location and the app's worktree marker). It creates its task branch inside the worktree from the starting commit, which rewrites no files (INFERRED). Outside the app: `git worktree add -b <task-branch> <path> origin/main`, run from the main checkout (this does not change the main checkout's branch; INFERRED safe because it reads only the current tree). Use a short path outside OneDrive for such a worktree (`docs/TESTING.md` section 2.3 uses `C:/t/...` for the same reason); avoid `%TEMP%`, which Windows may clean. One task branch per worktree; a new task gets a new worktree cut from current `origin/main`. Never writes in the main checkout or in another chat's worktree. |
| Read-only work | may share the main checkout | Investigations, `node tools/verify_page.js site`, `npm test` (leaves no files; VERIFIED 28-Oct-2026), tool dry runs without `--apply`, the preview server. It must not create, modify or stage tracked files; output goes to the session scratchpad or to `monthly-updates/<month>/_review/` (local, ignored). |
| Guardian (ARC-01) | anywhere, read-only | No write tools. |
| Fallback when no worktree is possible | the main checkout | Only one coding chat at a time (single writer for the whole folder), recorded in ACTIVE_CHANGE_REGISTER. It never switches branches and commits by explicit path through a temporary index. The Moderator keeps its own edits to Moderator-owned files and commits them by explicit path; nobody else writes there meanwhile. |

**Practical points for worktrees** (VERIFIED from code and folder listings unless labelled):
- A new worktree has no `node_modules/`: run `npm ci` there (`xlsx` 0.18.5 is pinned; never upgrade it).
- It has no `monthly-updates/`, `backups/`, `handover-archive/` or `_testdata/` (all git-ignored). Tools take
  input paths as arguments, so point them at the main checkout's `monthly-updates/` by absolute path.
  Recommendation: write pre-refresh backups to the main checkout's `backups/<date>_<tag>/` so they outlive
  the worktree.
- `tools/dev/rehearse.js` reads inputs only from `<new root>/monthly-updates` (`tools/dev/rehearse.js:19, :27`),
  so in a worktree it needs that folder (for example a directory junction to the main checkout's copy).
  This has not been tried in this repository: UNKNOWN / NEEDS INVESTIGATION. Keep rehearsal roots on short
  paths (`docs/TESTING.md` section 2.3; a desktop-app side-session note of 21-Oct-2026 says a root path of
  260 characters or more makes every step return `exit=null`).
- PowerPoint COM opens files only on paths under 255 characters: copy decks to a short path first.
- `.claude/worktrees/` is inside the OneDrive folder, so the R6 hazard applies there too: do not switch a
  worktree between different trees (INFERRED).
- Shared local scratch folders are single-writer too: `C:\t\` and `C:\t\q82\` (slide renders in the monthly
  process, step B5), `C:/t/...` rehearsal checkouts, and `%TEMP%\x\` (deck renders and bounds files; it
  also holds `ref.pptx`, KNOWN_ISSUES R10). One task uses each at a time; never delete what another task
  left there without the owner (TASK-070). Note: the `monthly-update` skill's step 5 says to empty `C:\t\`,
  which would also delete a rehearsal checkout under `C:/t/` (INFERRED from the two documents); check the
  folder before emptying it.

### 2.3 Verify the actual arrangement before allowing parallel coding

The Moderator (and the Guardian, when asked) checks, and records the result in ACTIVE_CHANGE_REGISTER:
- `git worktree list --porcelain`: every active coding task has its own worktree on its own task branch;
- `git -C <worktree> status --short` and `git -C <worktree> rev-parse --abbrev-ref HEAD` for each;
- in the desktop app, `list_sessions` / `get_session` show each session's folder: no two writing sessions
  share one folder;
- `git status --short` in the main checkout shows only Moderator-owned files (or the fallback chat's claim).

Any mismatch (two sessions in one folder, a chat on an unregistered branch, unexpected modified files)
stops new assignments until it is explained.

---

## 3. File groups and the single-writer rule

At most one active task may hold a file group at a time. A file not covered by any active claim is free,
but nobody edits it without first claiming it.

| File group | Files | Writers at a time | Couplings and notes |
|---|---|---|---|
| The page | `site/index.html` | 1 task | Covers data blocks and page code alike: the monthly tools execute the page's own parsers, so a code edit changes the next bake (KNOWN_ISSUES A27). Data blocks change only through `tools/lib/blocklib.js`; never read the file whole (12.8 MB; CLAUDE.md rule 2). |
| Each sibling script, separately | `site/Centricity_June_Refresh.js` (GIFT City `NEW_GIFT`, 12 look-throughs `var EQ`), `site/Centricity_IRR_Offshore.js` (`var IRR`, `OFFSHORE`), `site/Centricity_SIF_Refresh.js` (`var SIF`, `DATA_DATES.sif`, `REFRESH.parseSif`), `site/Centricity_ExtraSlides.js` (deck images), `site/Centricity_PMS_AIF_Terms.js` (hand-edited) | 1 task per file | Data a sibling owns is changed in the sibling (CLAUDE.md rule 1, D1). Tools that write two files need both claims: `rename_schemes.js` and `fold_duplicate_names.js` (page + IRR sibling), `add_reckoner_funds.js` and `merge_pms_aif_analytics.js` (page + June sibling), `split_sif_add_mld.js` (page + SIF sibling). `merge_sif_monitor.js` writes the SIF sibling; `update_market_slides.js` and `update_closing_slides.js` write ExtraSlides. |
| The deploy set during a monthly refresh | all six deploy files (`index.html` + the five siblings) | the OPS refresh only | Held from the backup before the first `--apply` until the merge. No other task holds any `site/` claim meanwhile. Recommendation: do not merge changes to tools the refresh runs while it runs; if one lands, re-run on the new tools. |
| `tools/lib/`, each file separately | `blocklib.js` (every writing tool goes through it), `dates.js`, `direct_perf.js`, `pptx.js`, `reck_parse.js`, `reck_narrative.js` | 1 task per file | High risk (section 7): a change reaches every tool that uses the file. |
| Each tool, separately | each `tools/*.js` and `tools/build_risk_matrix.py` | 1 task per file | A CLI or exit-code change also changes `tools/test/tool_inputs.test.js`, `tools/README.md` and the `monthly-update` skill (INTERFACE_CONTRACTS ripple list): claim those too. |
| Hand pins | `tools/data/pins.json` | 1 task | Identity data; pins change only with the owner (D75). |
| Verification and CI | `tools/verify_page.js` together with `.github/workflows/pages.yml` (the CI greps match `verify_page.js` label padding: change both in one PR); each file in `tools/test/`; each file in `tools/dev/`; `package.json` together with `package-lock.json` | 1 task per group | No dependency or version change without the owner (CLAUDE.md "Never"). |
| Shared docs registers | `CHANGELOG.md`, `docs/PROJECT_STATE.md`, `docs/KNOWN_ISSUES.md`, `docs/DECISIONS.md` | append by any task; edit by one | Most PRs touch them (VERIFIED with `git diff --name-only` for PR #18, the group #19-#23 and PRs #25-#28; PR #24 did not). Each task adds only its own entries and edits other entries only with the Moderator's agreement. New IDs come from the Moderator. Write these last, after syncing the branch with `origin/main`; a conflict is resolved by the later PR (merge `origin/main` into its branch, keep both entries, re-run CI). |
| Monthly update log | `docs/update-log/<YYYY-MM>_<Mon-YYYY>.md` | the OPS refresh of that month | |
| Moderator-owned | `docs/project-control/**`, `docs/handover/**` | the Moderator | Exception: an outgoing sub-chat writes its own handover and successor prompt under `docs/handover/continuations/` on its continuation branch ([continuations/README.md](../handover/continuations/README.md)). |
| Project instructions | `CLAUDE.md`; each file in `.claude/agents/` and `.claude/skills/`; `.claude/serve.js`; `.claude/launch.json` | 1 task per file; the Moderator approves | They steer every session (material, section 7). An OPS refresh updates only the "Headline state" section of `CLAUDE.md`. |
| Other docs | `docs/PRD.md`, `docs/OPERATING_MANUAL.md`, `docs/ARCHITECTURE.md`, `docs/TESTING.md`, `docs/DEPLOYMENT.md`, `docs/MONTHLY_UPDATE_PROCESS.md`, `docs/INPUT_FILES.md`, `docs/HANDOVER.md`, `docs/DEVELOPMENT_SETUP.md`, `docs/README.md`, `tools/README.md`, `README.md` | 1 task per file | |
| Local-only folders (never committed, apart from their tracked placeholder `README.md` files, which are ordinary docs) | `monthly-updates/00_INBOX/` (the owner drops files; the OPS refresh moves them out); `monthly-updates/<YYYY-MM_Mon-YYYY>/` (that month's refresh); `backups/` (append-only: a new folder per snapshot; never overwrite or delete one; retention is TASK-063); `handover-archive/` (read-only; holds client items under KNOWN_ISSUES R8: never open, copy, move or delete them; owner and compliance decide, TASK-032); `_testdata/` (the task that created a subfolder) | as stated | Never commit `.xlsx`, `.pptx`, `.zip` or anything from these folders (CLAUDE.md "Never"). |
| Repository and GitHub settings | branch protection, visibility, Pages settings, `delete_branch_on_merge`, deleting branches or tags | nobody without the owner's explicit instruction | CLAUDE.md "Never"; DEC-OPEN-17, DEC-OPEN-18, DEC-OPEN-22. |

---

## 4. Claim and release procedure

### 4.1 Claim (before any edit)

1. **Check for conflicts.** The Moderator runs `git fetch origin`, reads the current
   [ACTIVE_CHANGE_REGISTER.md](ACTIVE_CHANGE_REGISTER.md) and confirms that no active row holds any file in
   the same group (section 3). It checks the shared interfaces the change touches in the
   [INTERFACE_CONTRACTS.md](INTERFACE_CONTRACTS.md) ripple lists and adds every file a ripple list requires
   to the claim. It checks the task's dependencies in [TASK_REGISTER.md](TASK_REGISTER.md).
2. **Classify the change** (section 7). For a material change, write the change-impact contract (section 6)
   into the task's entry in ACTIVE_CHANGE_REGISTER. For a high-risk change, the Guardian reviews the
   contract (Gate B pre-check) before step 4.
3. **Record the claim.** The Moderator adds the row (task, chat, workstream, worktree, source branch and
   baseline, task branch, files, interfaces, dependencies and overlaps, status) and commits it to `main` in
   a docs PR; several register updates may share one PR. **A claim is in force when it is on
   `origin/main`.** Fields not known yet (baseline SHA when the branch is cut later, latest commit, PR
   number) are filled from the chat's reports in the next register update.
4. **Launch.** The Moderator gives the chat a launch packet: task ID, contract, claimed files, files it must
   not touch, worktree, branch name, the gates it must pass and the Gate A report it must return.
5. **The chat verifies before its first edit**: `git fetch origin`; its branch starts from current
   `origin/main` (or it reports the difference); the files it is about to change are inside its claim.

### 4.2 During the task

- **Scope expansion.** If the chat needs a file outside its claim, it stops and asks the Moderator. The
  Moderator updates the contract and the claim, or coordinates with the current holder, before the edit
  (master prompt section 11).
- **Status changes** (WAITING, BLOCKED, PR opened, gate results) go to the Moderator, who updates the row.

### 4.3 Release

| Event | What happens to the claim |
|---|---|
| Merge (Gate D) | Released at the merge. The Moderator moves the row to "Recently released" with the PR number, merge SHA and date in its next register update. |
| Task paused (WAITING, BLOCKED) | The claim stays. If another task needs the files urgently, the Moderator either sequences (waits), or with the owner's agreement parks the paused task: its work is pushed to its branch (or a continuation branch), the row records where, and only then is the claim released. Resuming later starts from the new `main`. |
| Task abandoned or superseded | Push the branch first, record SUPERSEDED and where the work is, then release. Never delete a branch, worktree or stash to free a claim. |
| Handover mid-task | The claim transfers to the successor chat: the row's chat and branch fields change to the successor and its continuation branch; the outgoing chat stops editing at handover. |
| Chat cannot be reached | At each Moderator session start, check every row (is the chat running, `list_sessions`; is its branch pushed and when was it last updated). If a claim's chat cannot be reached, record UNKNOWN and ask the owner; never release by assumption. |

**Bootstrap exception.** TASK-015 created the register, so its own claim is recorded in the same commit as
the register itself.

---

## 5. Resolving overlaps

An overlap exists when two tasks would modify the same file group; the same shared interface (an interface
and its consumers, per the INTERFACE_CONTRACTS ripple lists); the same data through different files (for
example a rename by `rename_schemes.js` re-keys `var IRR` in the IRR sibling while another task edits that
sibling); or would take IDs from the same register.

The Moderator chooses one of three options and records it in both rows:

| Option | When | How |
|---|---|---|
| Assign one owner | The changes belong together, or both touch the page, one sibling or one `tools/lib` file | Fold both into one task in one chat; the other task becomes SUPERSEDED or a step of the first. |
| Sequence | Independent changes to the same group | The second starts after the first merges, on a branch cut from the post-merge `main`; the Moderator tells it when to start. |
| Coordinated plan | Only for disjoint files that share an interface, or for appends to the shared docs registers | A written plan in both rows: which chat changes what, the interface version both build against, merge order, who syncs with `main`. The Guardian reviews the plan. |

Not allowed, even with a plan: two active tasks editing `site/index.html`, the same sibling or the same
`tools/lib` file at the same time.

**Calendar priority.** The monthly data windows take precedence for the six deploy files: the Oct-2026 MF
cycle (about 13-17-Nov-2026) and the Oct-2026 Reckoner cycle (about 20-28-Nov-2026) (INFERRED from the
documented cadence). Recommendation: an NB change to `site/` merges before a window opens or waits until it
closes.

**Precedents in this repository (VERIFIED):**
- 19-Oct-2026: MOD-01's uncommitted fixes duplicated NB-01's merged A1/A3/A4 work and collided on D70/D71;
  merged by hand, file by file (memory note `fetch-before-branching`).
- 22-25-Oct-2026: NB-03 worked in the shared main checkout and left it on its branch; the later switch back
  to `main` truncated tracked files (KNOWN_ISSUES R6).
- PRs #4, #9 and #11 merged one merge behind `main`; their file sets were disjoint and the combined tree was
  tested only by the post-merge CI run.
- PR #22 merged `origin/main` into its branch before merging because PR #21 had just changed
  `site/index.html`: the right pattern when two PRs touch one file in sequence.

**Known overlaps among open tasks** (for planning; the tasks are in [TASK_REGISTER.md](TASK_REGISTER.md);
handling is a recommendation):

| Tasks | Shared files or interface | Suggested handling |
|---|---|---|
| TASK-021 (Oct-2026 MF cycle), TASK-024 (8 renames), TASK-028 (C39 side-pocket records and parser skip) | the six deploy files; `REFRESH.parseMfMonitor`, which `bake_month.js` executes | TASK-024 is step 1 of TASK-021 (one owner). TASK-028 merges before the cycle (rehearsed with `--old-site`) or waits until after it. |
| TASK-022 (NAV and risk-ratio producer), TASK-057 (`build_risk_matrix.py`), TASK-066 (unreachable RISK_MATRIX keys), TASK-053 (`RISK_MATRIX_BENCH_SD`) | `tools/merge_risk_matrix.js`, `tools/build_risk_matrix.py`, the RISK_MATRIX block | One owner, after DEC-OPEN-01 (and DEC-OPEN-02, DEC-OPEN-03). |
| TASK-026 (headline expected return in five places), TASK-030 (Select popover), TASK-031 (return basis, `H.isExpectedReturn`), TASK-069 (deck tables), TASK-045 (fold siblings into the page) | `site/index.html` (UI, `H`, `EXPORTS`); TASK-045 also three siblings and many tools | One at a time. TASK-045 never during a data refresh (D2). |
| TASK-023 (C20 JioBlackRock records) and TASK-067 (`si` bound, young funds) | MASTER data; `tools/bake_month.js`; DEC-OPEN-07 | One owner, or sequence, after DEC-OPEN-07. |
| TASK-042 (verify_page and CI hardening) and any other change to `verify_page.js` output | `tools/verify_page.js` + `.github/workflows/pages.yml` | One owner. |
| TASK-039 (one Direct-plan parser) | `tools/lib/direct_perf.js`; the page's `parseMfMonitorDirect` | Not during a refresh. |
| TASK-018 (docs consistency), TASK-054 (PRD and runbooks), TASK-071 (memory procedures into docs), TASK-074 (record conversation decisions) | `docs/KNOWN_ISSUES.md`, `docs/DECISIONS.md`, `docs/DEPLOYMENT.md`, `docs/MONTHLY_UPDATE_PROCESS.md`, `.claude/skills/monthly-update/SKILL.md`, `docs/PROJECT_STATE.md` | One GOV owner, or sequence. |

---

## 6. Change-impact contract

**When.** Before every material or high-risk change (section 7). A low-risk change needs none.
**Who.** The Moderator writes it in the launch packet, or the implementing chat drafts it and the Moderator
accepts it. **Where.** In the task's entry in [ACTIVE_CHANGE_REGISTER.md](ACTIVE_CHANGE_REGISTER.md)
("Change-impact contracts"), copied into the PR description at Gate A. **Review.** The Guardian reviews a
high-risk contract before implementation. **Changes.** If the scope grows, the chat updates the contract
and gets the Moderator's agreement before it touches files outside its claim.

The twelve fields (master prompt section 11), with what to write here. The example column uses TASK-028 as
an illustration only: that task is BLOCKED until the owner decides DEC-OPEN-10.

| # | Field | What to write | Example (TASK-028) |
|---|---|---|---|
| 1 | Task and requirement IDs | TASK, REQ / REQ-PPT, KNOWN_ISSUES IDs, decisions (D-number, DEC-OPEN) | TASK-028; KNOWN_ISSUES C39; DEC-OPEN-10 (and its D-number once approved) |
| 2 | Objective and acceptance criteria | One sentence, then the checks that prove it is done, with expected numbers | Drop the 4 segregated side-pocket records and skip such rows at both parser sites. Done when MASTER effective goes 7,682 -> 7,678, duplicates stay 0, every other `verify_page` count is unchanged, and a parser test fails on the old code and passes on the new. |
| 3 | Existing behaviour to preserve | What must not move | Every other MASTER record byte-identical; the other Monitor sheets parse as today; the six-file deploy set; Section 7 upload results for other rows. |
| 4 | Intended behaviour changes | What users and data will see differently | The 4 records leave the screen, Excel and the deck; future bakes and uploads skip such rows. |
| 5 | Files and modules affected | Exact paths; for `site/index.html` a grep pattern, because line numbers drift | `site/index.html` (pattern `includes('segregated portfolio')`, at about L3347 and L3415 on `2b2a397`; the MASTER block); a parser test in `tools/test/`; `CHANGELOG.md`; `docs/PROJECT_STATE.md`; `docs/KNOWN_ISSUES.md` C39. |
| 6 | Shared interfaces and downstream consumers | From the INTERFACE_CONTRACTS ripple lists | `REFRESH.parseMfMonitor` is executed offline by `bake_month.js`, so the next bake changes (A27); the Section 7 upload; name-keyed stores (Select, `var IRR`, RISK_MATRIX) must not point at the 4 names. |
| 7 | Data schema, configuration and dependency changes | Block shapes, field names, scale, CI or library changes | MASTER count -4; no field, scale, CI or library change. |
| 8 | Financial rules or calculations affected | Formulas, scale (decimal or percent), identity matching, client-facing numbers | Universe membership only; no formula or scale change. `financial-data-reviewer` confirms the 4 records are the side pockets named in C39. |
| 9 | Other tasks that may overlap | Active or queued rows on the same group or interface | TASK-021 (the Oct-2026 cycle bakes with this parser). |
| 10 | Required tests | Named commands (section 8, Gate C) | `node tools/verify_page.js site`; `npm test` including the new test; `node tools/dev/rehearse.js --old-site <old site/>` data verdict; `verify-dashboard` browser checks 1 and 11; `financial-data-reviewer`. |
| 11 | Rollback and migration | How to undo; backups | Back up the six deploy files to `backups/<date>_<tag>/` before any `--apply`; undo with `git revert -m 1 <merge>` in a PR; no migration. |
| 12 | Explicit non-goals | What is out of scope | No other parser change; no rename handling; no Direct-plan parser change (A7). |

Copy form (paste into the register entry and the PR description):

```text
Change-impact contract - TASK-nnn (risk class: material | high risk)
1. Task and requirement IDs:
2. Objective and acceptance criteria:
3. Existing behaviour to preserve:
4. Intended behaviour changes:
5. Files and modules affected:
6. Shared interfaces and downstream consumers:
7. Data schema, configuration and dependency changes:
8. Financial rules or calculations affected:
9. Other tasks that may overlap:
10. Required tests:
11. Rollback and migration considerations:
12. Explicit non-goals:
Guardian pre-check (high risk only): date, verdict, conditions
```

---

## 7. Risk classes and Guardian review triggers

| Class | What counts in this repository | Contract | Guardian (ARC-01) |
|---|---|---|---|
| Low | Docs that change no rule, procedure, gate or decision (records, registers, typo fixes); read-only investigation | none | Not required. Moderator self-check; CI `verify` still runs on the PR. |
| Material | Anything else that changes `site/`, `tools/` (including `tools/test/`, `tools/dev/`, `tools/data/`), `.github/`, `package.json` / `package-lock.json`, `CLAUDE.md`, `.claude/agents/`, `.claude/skills/`, `.claude/serve.js`, `.claude/launch.json`, or a document that changes a rule, procedure, gate or decision (OPERATING_MANUAL, MONTHLY_UPDATE_PROCESS, TESTING, DEPLOYMENT, DECISIONS); every routine monthly refresh | required (short is fine) | Gate B review of the diff after implementation |
| High risk | Any trigger in the list below | required, reviewed before implementation | Gate B pre-check of the contract, then Gate B review of the diff; `financial-data-reviewer` as well where financial |

**High-risk triggers** (any one is enough):
1. **Data blocks** of `site/index.html` (MASTER, the analytics stores, DIRECT_PERF, CENTRICITY_SELECT,
   PMS_PERFORMANCE, PMS_PERF_ALIAS, RISK_MATRIX, DATA_DATES and the rest) changed outside a routine refresh
   step, or any edit of a block not made through `tools/lib/blocklib.js`.
2. **Sibling scripts**, the script tags, or the load order June -> IRR/Offshore -> SIF (D1). Siblings
   re-apply on every load, and a broken sibling only logs `console.error`, which `verify_page` and CI do not
   count (KNOWN_ISSUES A30).
3. **Page code the tools execute**: the `window.REFRESH` parsers and inline load-time code
   (`linkIdcwToGrowth`, `applyPmsPerformance`); they change what the next bake writes (A27).
4. **`tools/lib/`**, shared by the tools (`blocklib.js` by every writing tool).
5. **Export code**: `window.EXPORTS` (PowerPoint and Excel), the design system (`DS`, `TXT`, `planTable`,
   `drawTable`; D82, CLAUDE.md rule 10) and `tools/dev/check_pptx_bounds.js` (its `FOOT = 7.08` must equal
   `DS.FOOT - DS.STAMP_H`).
6. **CI and the parity gate**: `.github/workflows/pages.yml`, `tools/verify_page.js` (CI greps its printed
   labels), `tools/test/run.js`, `package.json` / `package-lock.json`.
7. **Financial calculations**: the headline expected return and return aggregation (`computeKPIs`,
   `H.weightedReturns`, `H.rollupReturns`, Future Value, Live Output; C24), expected-return marking
   (`H.isExpectedReturn`, D83), IRR bands and mid-points, risk ratios (risk-free rate and Sortino: D58, C11,
   C35), credit buckets (`H.creditBucket`), look-through aggregation and the single predicates
   (`H.isHybridScheme`, `H.isEquitySIF`, `H.isSelfDescribingDebt`), performance buckets (C29), PMS/AIF
   benchmark rows (C41).
8. **Scale**: anything that reads or writes a return, IRR, expense or weight. MASTER returns, IRR and expense
   are decimals; analytics weights are percent; MF and SIF Monitor returns are percent and divided by 100,
   never auto-detected (CLAUDE.md rule 4).
9. **Identity matching**: renames (`rename_schemes.js`, `prev_name` / `prev_names`), name joins (Reckoner,
   Direct Equity universe, SIF name normaliser, `H.buildFundIndex`), `tools/data/pins.json`,
   `PMS_PERF_ALIAS`, `var IRR` keys, duplicate folding.
10. **Gates and overrides**: an override flag (`--accept-drops`, `--allow-coverage-drop`, `--allow-shrink`,
    `--allow-layout-change`), a change to any tool's gates or exit codes (D72), or a refresh that is not
    routine (a correction run, a universe change, applying an owner decision such as DEC-OPEN-07 or
    DEC-OPEN-08).
11. **Deployment and shared contracts**: repository or Pages settings (only on the owner's instruction),
    the share-link payload keys, CDN versions or SRI hashes (forbidden without the owner).
12. **Cross-claim effects**: any change that crosses an interface in the INTERFACE_CONTRACTS ripple lists or
    touches files claimed by another active task.

**What the Guardian checks at Gate B:** the directly affected files; downstream consumers; ripple effects;
conflicts with active claims; interface and schema compatibility; duplicated business logic (a second copy
of a predicate, a parser or a calculation; see ARCHITECTURE_AND_DEPENDENCY_MAP "duplicated logic"); the
regression tests required against those actually run; documentation that must change; integration and
recovery risk. It reviews the actual diff and the current code, not chat summaries:
- for `site/index.html` it compares block by block with a Node script using `tools/lib/blocklib.js` instead
  of reading multi-megabyte diff lines;
- for merge commits it uses `git diff <merge>^1 <merge>` or `git log -m` (PR #23's code exists only inside
  merge commit `18abff3`);
- its verdict and findings go to the Moderator in the format of
  [`.claude/agents/integration-guardian.md`](../../.claude/agents/integration-guardian.md); the Moderator
  records them in [INTEGRATION_AND_REGRESSION_LOG.md](INTEGRATION_AND_REGRESSION_LOG.md). A finding the
  Moderator does not accept is put to the owner in plain language, never silently overridden.

**For a routine monthly refresh**, Gate B checks that only the expected blocks and files changed, all
changed deploy files are in one commit, every gate output was read and every count change is explained. It
is one more check before D61's automatic merge and does not change D61 (publication is still automatic once
every check passes). It is not yet written into `docs/MONTHLY_UPDATE_PROCESS.md` or the `monthly-update`
skill; until it is, the Moderator puts it in the OPS launch packet.

**Owner approval before the merge** (separate from the Guardian):
- any judgement call on D61's stop list: an ambiguous rename, a PMS alias pin, a Reckoner name mismatch, a
  universe change, an input that cannot be identified, competes for a slot, is older than the live data or
  belongs to another month;
- non-routine data corrections and changes to every client deck (precedents: PR #18 held 19-21-Oct-2026 for
  approval, D81; PR #26 merged after the owner saw the sample deck, D82);
- any override flag; any pin (D75);
- anything under CLAUDE.md "Never" (repository settings and visibility, force-push, history rewrite,
  library upgrades);
- any change the owner asked to review first (CLAUDE.md "How every change is made", step 6).

---

## 8. Integration gates A-E in this repository

Integration and deployment are one step here: a merge to `main` publishes (D63). Everything that must be
checked before users see a change happens in Gates A-C, and owner approval of a non-routine client-facing
change comes before the merge.

| Gate | What must be true | Commands and evidence | Who |
|---|---|---|---|
| A. Implementation report | The task ID, chat, branch, worktree, baseline SHA, head SHA (pushed), files changed, tests actually run with their output, deviations from the contract and open issues are reported. | `git merge-base HEAD origin/main`; `git rev-parse HEAD`; `git ls-remote origin <branch>`; `git diff --name-status origin/main...HEAD`. Written into the PR description ([`docs/DEPLOYMENT.md`](../DEPLOYMENT.md) "Commit and PR conventions") and sent to the Moderator, who copies the fields into ACTIVE_CHANGE_REGISTER. | the implementing chat (`implementation-engineer`; `docs-keeper` for the docs) |
| B. Guardian review | Diff, cross-module effects, ownership, interface compatibility, test coverage and residual risk reviewed (section 7); no secrets or client data. | `integration-guardian` subagent on the actual diff; `security-reviewer` before any push (CLAUDE.md "How every change is made", step 6). | ARC-01; `security-reviewer` |
| C. Independent verification | The checks for the kind of change (table below) ran and passed, run by someone other than the implementer. Each is reported PASS / FAIL / NOT RUN with evidence; a check that was not run is never reported as passed. | see the table below | `qa-verifier` (or the `verify-dashboard` skill), `financial-data-reviewer`, the Moderator |
| D. Controlled integration | One PR at a time, up to date with `main`, every check green, merged, published, live files equal `site/`, new baseline recorded, dependants told. | steps below | the Moderator with `release-manager` |
| E. Acceptance | Implementation, review, verification, integration (= deployment) and acceptance are tracked as separate states; the task is accepted only on evidence, and by the owner where the change is client-facing or the owner asked. | status in [TASK_REGISTER.md](TASK_REGISTER.md) | the owner; the Moderator records |

**Gate C by kind of change:**

| The change touches | Run |
|---|---|
| anything | `node tools/verify_page.js site`: every line equals the last baseline except explained deltas (on 28-Oct-2026: MASTER effective 7682; CENTRICITY_SELECT 178, 178 in MASTER; PMS 692 / AIF 12 / benchmarks 4; PMS_PERF_ALIAS 27; EQUITY_ANALYTICS 1205; RISK_MATRIX 1088; PMS_AIF_TERMS 73; EXTRA_SLIDES 6; 0 duplicate MASTER names; 0 script errors). `npm test` (on 28-Oct-2026: 5 test files, 903 checks, 0 failures). CI `verify` on the PR (`gh pr checks <n>`). |
| `site/` | The `verify-dashboard` skill or `qa-verifier` in a browser: the checks of [`docs/TESTING.md`](../TESTING.md) section 3 on the preview (`preview_start` with `playbook`, or `node .claude/serve.js`, http://127.0.0.1:8080/), console clean, including no sibling `console.error` (A30). |
| page parsers or load-time code | `node tools/dev/rehearse.js --old-site <old site/>` and its data verdict (A27; TESTING.md section 2.3). |
| tools or `tools/lib/` | Dry runs on the current month's inputs (TESTING.md section 2.2); `node tools/dev/rehearse.js --old <old root>` (section 2.3). |
| the PowerPoint export | `npm test` (`pptx_layout.test.js`); a real export with `window.__PPTX_LAYOUT.warnings` empty; a PowerPoint render with `tools/dev/render_pptx.ps1` and `node tools/dev/check_pptx_bounds.js <dir>/bounds.jsonl` (CLAUDE.md rule 10); the owner sees a sample deck when every client deck changes. |
| data or financial logic | `financial-data-reviewer`: scale, and 5-10 sample records against the source workbooks; counts reconciled as distinct funds, not rows. |
| docs only | CI `verify` (with `site/` unchanged the `verify_page` output is identical); links and IDs checked. |

**Gate D steps:**
1. The PR head is up to date with `origin/main` (`gh pr view <n> --json mergeStateStatus,headRefOid`). If
   another PR changed the same files since, merge `origin/main` into the branch and re-run Gate C.
2. Every check is green (`gh pr checks <n>`). With no branch protection (R9) the Moderator checks this by
   hand.
3. Merge with a merge commit, as for all 28 PRs so far: `gh pr merge <n> --merge --match-head-commit <sha>`.
   Whether to add `--delete-branch` is open (DEC-OPEN-22, KNOWN_ISSUES E12); until the owner decides, keep
   current practice (branches kept).
4. Watch the push run on `main` (`gh run list --branch main --limit 1`, then `gh run watch <id>`): `verify`
   and `publish` both succeed.
5. `release-manager` confirms that the seven published files equal `site/` (allow a few minutes after the
   publish run):

   ```bash
   B=https://productsteamcentricity.github.io/Centricity-Proposal-Playbook
   for f in index.html Centricity_ExtraSlides.js Centricity_PMS_AIF_Terms.js Centricity_June_Refresh.js Centricity_IRR_Offshore.js Centricity_SIF_Refresh.js robots.txt; do
     a=$(curl -s --compressed "$B/$f" | sha256sum | cut -c1-16); b=$(sha256sum "site/$f" | cut -c1-16)
     echo "$f live=$a local=$b"; done
   ```
   Each pair must match (the loop in `docs/DEPLOYMENT.md` omits `robots.txt`, KNOWN_ISSUES E14).
6. Record the new baseline (merge SHA, site content state, counts) in
   [INTEGRATION_AND_REGRESSION_LOG.md](INTEGRATION_AND_REGRESSION_LOG.md) and release the claim in
   ACTIVE_CHANGE_REGISTER.
7. Tell every task that depends on the change, or holds a branch on the same files, to sync with the new
   `main`.

**Gate E notes.** A monthly refresh publishes automatically under D61 and is accepted afterwards (the owner
reads the closing report). Precedent: TASK-013 was merged and published on 22-Oct-2026 but stays
IMPLEMENTED NOT FULLY VERIFIED until the full browser acceptance pass on the current build (TASK-064).

---

## 9. Recovery procedure

If a merge breaks the live site or its data:

1. **Stop.** No further merges. Mark dependent rows WAITING or BLOCKED. Tell the owner in plain language what
   users see and since when.
2. **Preserve evidence.** The failing run (`gh run view <id> --log-failed`), the live hashes, the
   `verify_page` output, the browser console, the PR and merge SHA. Record an incident under the next free
   INC number in [INTEGRATION_AND_REGRESSION_LOG.md](INTEGRATION_AND_REGRESSION_LOG.md).
3. **Find the last verified baseline** in the integration log (on 28-Oct-2026: `2b2a397`; site content last
   changed by `5d39821`).
4. **Make the smallest targeted fix:**
   - *Revert the merge in a new PR.* Create the branch without a checkout (`git branch fix/revert-pr<n>
     origin/main`), run `git revert -m 1 <merge sha>` in a worktree on that branch (`-m 1` keeps `main`'s
     side; `docs/DEPLOYMENT.md` "How a release works"), open the PR, pass Gate C, merge; Pages republishes the
     previous state. To re-apply the change later, revert the revert in a new PR. A revert reads the blobs of
     the reverted commit; if a read fails with "mmap failed", do it in a fresh clone outside OneDrive
     (INFERRED; no revert has been needed in this repository so far, 0 revert commits).
   - *A data mistake before it is committed* (mid-refresh): restore the six deploy files from the
     `backups/<date>_<tag>/` snapshot taken before the first `--apply` (CLAUDE.md rule 3), then
     `node tools/verify_page.js site` must equal the "before" output.
   - *Tracked files truncated or deleted by a failed git operation* (R6): stage and commit nothing; restore
     each file from git with the recipe in KNOWN_ISSUES R6 and
     [REPOSITORY_AND_ENVIRONMENT_STATE.md](REPOSITORY_AND_ENVIRONMENT_STATE.md); `git status` must be clean
     before work continues. If a historical blob read fails, fetch it with `gh api .../git/blobs/<sha>` and
     check it with `git hash-object`.
5. **Never** force-push, `git reset --hard` a shared branch, rewrite published history, run `git clean`,
   delete another task's branch, worktree or stash, discard another task's uncommitted work, or weaken or
   bypass a failing check to make it pass (CLAUDE.md "Never"; master prompt sections 13 and 29).
6. **Afterwards**: re-run Gate C on the restored `main`, run the live check, record the new baseline, reopen
   the task with the root cause, and add a regression test or gate where possible
   ([KNOWN_ISSUES_AND_REGRESSION_RISKS.md](KNOWN_ISSUES_AND_REGRESSION_RISKS.md)).

---

## 10. Changing these rules

The Moderator proposes a change in plain language. A change that alters publishing or approvals (D61,
D68) needs the owner's approval and is recorded as a new decision in [`docs/DECISIONS.md`](../DECISIONS.md)
(next free D84 on 28-Oct-2026). Update this file and the "Project control" section of `CLAUDE.md` in the
same PR.

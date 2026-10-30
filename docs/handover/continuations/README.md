# Continuations: replacing a chat without losing work

| Field | Value |
|---|---|
| Version | 1 |
| Date | 28-Oct-2026 |
| Author chat | MOD-01 |
| Status | Authoritative (procedure and index of every continuation and handover prompt) |
| Supersedes | none (first version) |
| Next review | at the first sub-chat continuation, and at every Moderator handover |

This is the procedure a Moderator (MOD-nn) or a sub-chat follows when a chat must be replaced
(master prompt sections 14-21), adapted to this repository: a public GitHub repo whose main checkout
lives in OneDrive, where `git checkout` is unsafe (KNOWN_ISSUES R6). The index of every prompt issued is
in section 10. Templates: [`../MODERATOR_HANDOVER_TEMPLATE.md`](../MODERATOR_HANDOVER_TEMPLATE.md) and
[`../SUBCHAT_HANDOVER_TEMPLATE.md`](../SUBCHAT_HANDOVER_TEMPLATE.md).

## 1. When to hand over (triggers)

Start a handover when any of these holds (section 15):

- the chat has had three context compactions;
- the owner reports repeated compaction or lost context;
- the chat cannot reliably reconstruct its open tasks or decisions;
- important implementation detail is no longer in its context;
- further work risks losing essential knowledge;
- the task needs a new specialist chat;
- the chat is being retired or replaced;
- the Moderator itself must be replaced.

Do not wait until context is exhausted: for this project an early handover is preferred over
continuing uncertain work.

**Counting compactions (evidence, never a guess).** Each automatic compaction writes a
`"type":"system","subtype":"compact_boundary"` record into the session transcript
`%USERPROFILE%\.claude\projects\<project slug>\<session id>.jsonl`. Count records with **distinct
timestamps**. A resumed session can start from a copy of its parent's summary (same timestamp): that is
not a new compaction. Grepping for "This session is being continued" overcounts. Example: MOD-01 had two
compactions (19-Oct-2026 06:28:17Z and 27-Oct-2026 12:24:37Z); its 28-Oct session started from a copy of
the second. MOD-01 hands over because the owner ordered a Moderator replacement, not because of a third
compaction.

**Who starts it.** The Moderator decides for a sub-chat (or the sub-chat asks the Moderator); the
Moderator starts its own handover; the owner can order either at any time.

## 2. Two scenarios (section 16)

| | Scenario A: a sub-chat is replaced | Scenario B: the Moderator (or the Guardian session) is replaced |
|---|---|---|
| Successor | same task ID, next free chat number in the prefix (NB-04 -> NB-05) | next Moderator number (MOD-02 -> MOD-03); Guardian session ARC-01 -> ARC-02 |
| Branch | `continuation/<chat-id>-task-<task-id>-YYYYMMDD` (`<chat-id>` = the outgoing chat, lower case; the actual date), cut from the **actual task branch** (never from `main` if `main` lacks the work, never from a stale commit) | `handover/<from>-to-<to>-YYYYMMDD` from current `origin/main`; documentation only |
| Code state | the successor continues from the latest verified task state, told what is incomplete | an active implementation branch is preserved and recorded, never replaced by the handover branch |
| Documents | `<CHAT-ID>_TASK-<id>_HANDOVER_<YYYY-MM-DD>.md` and `<CHAT-ID>_TASK-<id>_SUCCESSOR_PROMPT_<YYYY-MM-DD>.md` in this folder (filled from the sub-chat template) | `../MASTER_HANDOVER_<YYYY-MM-DD>_v<N>.md` (filled from the Moderator template; the previous one becomes a historical snapshot) and `<FROM>_TO_<TO>_SUCCESSOR_PROMPT_<YYYY-MM-DD>.md` here; for the Guardian `../CODEBASE_GUARDIAN_HANDOVER_<YYYY-MM-DD>_v<N>.md` |
| How the documents reach `main` | the Moderator merges them in a small docs PR, so the index is true for everyone; the continuation branch holds only the task's code checkpoint | the handover branch is merged after `verify` passes |
| First duty of the successor | validate the branch, worktree and registers against the repo before changing anything | validate the whole handover against the repo before assigning work |

## 3. The twelve steps (section 14) and where they happen here

| # | Step | In this repository |
|---|---|---|
| 1 | Recognise the need | a trigger from section 1, with its evidence |
| 2 | Tell the owner a new chat is required | plain words, in the chat; the Moderator records `HANDOVER REQUIRED` in `docs/project-control/CHAT_REGISTRY.md` |
| 3 | Preserve the task and code state | section 4 and 5 below (cases A-D) |
| 4 | Create the continuation branch | section 5 (safe methods only) |
| 5 | Write the handover document | from the template; save under the name in section 2 |
| 6 | Write the copy-ready successor prompt | section 7 (contents A-J), saved in this folder |
| 7 | Save handover files and records in the project folder | the documents, plus updates to `CHAT_REGISTRY.md`, `TASK_REGISTER.md`, `ACTIVE_CHANGE_REGISTER.md` (ownership passes to the successor) and the index in section 10 |
| 8 | Push when safe and authorised | the continuation or handover branch; documents through a docs PR; `security-reviewer` first |
| 9 | Give the owner paths, branch and prompt | section 8 (the ten items) |
| 10 | Explain the owner's action in the Claude interface | section 8 item 10 |
| 11 | Keep the old chat's status and successor recorded | `CHAT_REGISTRY.md`: old chat `HANDOVER REQUIRED`, then `RETIRED` (reason, successor) once its work, ownership and handover are reconciled; successor `QUEUED`, then `ACTIVE` |
| 12 | No further code changes in the old chat | the old chat only answers questions about its own record |

## 4. Before creating the branch (section 17)

Run from the chat's own working directory (worktree or main checkout). All read-only:

```bash
git fetch origin
git status --porcelain=v1 -b            # branch, ahead/behind, staged (col 1), unstaged (col 2), untracked (??)
git rev-parse --abbrev-ref HEAD; git rev-parse HEAD
git diff --cached --name-status         # staged
git diff --name-status                  # unstaged
git ls-files --others --exclude-standard   # untracked, not ignored
git log --oneline origin/main..HEAD     # commits not yet integrated
git worktree list; git stash list
```

Then decide, and write down in the handover document:

1. Which changes belong to the outgoing task: compare the file list with the task's claims in
   `docs/project-control/ACTIVE_CHANGE_REGISTER.md`.
2. Which belong to other tasks or are unknown.
3. Whether the current branch holds work not yet merged (`origin/main..HEAD`).
4. Secrets, client data, generated files: `git diff HEAD | grep -nEi "(api[_-]?key|secret|token|password|BEGIN [A-Z ]*PRIVATE KEY)"`,
   no `.xlsx`, `.pptx`, `.zip`, nothing under `monthly-updates/`, `backups/`, `handover-archive/`, no
   renders or `_review/` outputs; then the `security-reviewer` agent.
5. Whether a safe checkpoint is possible, and which case below applies.
6. The parent branch, the source commit SHA and the state the successor continues from. Never branch
   from an assumed or stale base.

## 5. Preserving uncommitted work (section 18)

A new branch does not preserve uncommitted changes. Handle the working tree explicitly.

**Rule for this machine.** Never run `git checkout` / `git switch <existing branch>` / `git merge` /
`git pull` in the OneDrive main checkout while OneDrive is not running or any `.git` file is cloud-only
(on 25-Oct-2026 a checkout failed with "mmap failed" and truncated tracked files, R6; on 28-Oct-2026
229 `.git` files were cloud-only). Creating a branch with `git branch <new>` changes no files and is safe
there. `git switch -c <new>` also changes no files, but it moves the checkout onto the new branch, so use it
only in a task's own worktree, never in the main checkout (which stays on `main`; `CLAUDE.md` "Project control").

### Case A: all changes belong to the outgoing task and are safe to checkpoint

Inspect the full diff and every relevant untracked file first. Then:

**In the task's own worktree** (normal for sub-chats):

```bash
B=continuation/nb-04-task-069-20261105         # hypothetical example of the pattern
git switch -c "$B"                              # new branch at HEAD; no file changes
git add -- <each file of the task>              # explicit paths only, never -A
git diff --cached --stat                        # exactly the inventoried files
git commit -F <message-file>                    # subject: WIP: checkpoint task TASK-069 for context handover
git push -u origin "$B"
```

**In the main checkout** (no checkout: the temporary-index method MOD-01 used for PRs #8-#18, #24, #25 and #28,
also in `docs/project-control/REPOSITORY_AND_ENVIRONMENT_STATE.md` section 14.4 D; this block was walked
through in a scratch clone on 30-Oct-2026, never yet for a real continuation, so check the result with
`git diff --stat` before pushing). Use it only when
the working tree sits on the commit you branch from (`HEAD`); if the task's earlier commits are on a
branch the checkout is not on, use case B.

```bash
B=continuation/<chat-id>-task-<task-id>-YYYYMMDD
git branch "$B" HEAD                            # no checkout
export GIT_INDEX_FILE="$TEMP/handover.idx"      # an index file outside the repo
git read-tree "$B"
git update-index --add -- <new or changed files>
git update-index --remove -- <deleted files>
git diff --cached --stat "$B"                   # exactly the inventoried files
TREE=$(git write-tree)
C=$(git commit-tree "$TREE" -p "$B" -F <message-file>)
git update-ref "refs/heads/$B" "$C"
unset GIT_INDEX_FILE; rm -f "$TEMP/handover.idx"
git push -u origin "$B"
```

The working tree and the real index are untouched. The commit subject is exactly
`WIP: checkpoint task <task-id> for context handover`, with the session's attribution trailer. It is a
preservation checkpoint, not a claim that the task is complete or that tests pass: record its SHA and
the exact test state. **A WIP checkpoint is never merged as is.** The successor finishes the task on
the continuation branch and opens a normal PR only when Gates A-C pass.

### Case B: mixed ownership, sensitive content or uncertain contents

Do not stage or commit the doubtful changes, do not discard them, do not touch another task's work.
Create the continuation branch only from what is safe (for example the task branch tip). Inventory the
rest in the handover document (path, status, size, SHA-256, why it was not committed). Where safe, keep
a private local copy after reading it for secrets:

```bash
D=backups/<YYYY-MM-DD>_handover-<chat-id>       # local only, git-ignored
mkdir -p "$D"
git diff --binary -- <paths> > "$D/<task-id>.patch"
# copy untracked files into "$D", keeping their relative paths
sha256sum "$D"/* > "$D/SHA256SUMS.txt"
```

Never push the patch. A file that may contain client data is not copied anywhere: leave it in place and
tell the owner (`backups/` is synced to OneDrive when OneDrive runs). Tell the owner exactly what remains
local-only and what must happen before the successor can continue.

### Case C: another chat may own some of the changes

Stop before committing. Compare every file with `ACTIVE_CHANGE_REGISTER.md` and ask the Moderator. If
the claims separate the work cleanly by file, checkpoint only the outgoing task's files (case A method,
explicit paths). If one file mixes both, do not commit it: keep it (case B copy) and report the blocker.
Never commit another task's changes under the outgoing task's ID.

### Case D: git access or repository integrity prevents a safe branch

Examples seen here: `fatal: mmap failed: Invalid argument` (cloud-only packs), "Permission denied" from
OneDrive locks during `git worktree remove/prune`, `git fetch` or `git stash -u`, an expired GitHub login
(`gh auth status`), a rejected push. Do not
force-push, `reset --hard`, `clean`, rebase or delete anything under `.git`. Copy the changed files to
`backups/<YYYY-MM-DD>_handover-<chat-id>/` with a SHA-256 list, write the handover document anyway
(uncommitted if need be, and say so), and give the owner precise steps (for example: start OneDrive, set
the folder to "Always keep on this device", wait for the sync, then the successor runs the case A
commands).

## 6. Verify the continuation branch (section 19)

| Check | How | Expected |
|---|---|---|
| Branch exists | `git rev-parse --verify "refs/heads/$B"` | a SHA |
| Correct source | `git merge-base --is-ancestor <recorded base> "$B"`; `git log --oneline <base>.."$B"` | exit 0; only the task's commits and the WIP checkpoint |
| Checkpointed changes present | `git diff --stat <base> "$B"`; `git diff "$B" -- <checkpointed paths>` | the inventoried files; no difference from the working tree for them |
| Nothing unrelated | the forbidden-file check below | no output; every file belongs to the task |
| No secrets or client data | grep from section 4 on `git diff <base> "$B"`; `security-reviewer` | nothing found |
| Local-only artefacts accounted for | listed in the handover document with path and SHA-256 | complete |
| Handover document exists | the file named in section 2 (on `main` after the Moderator's docs PR) | present |
| Successor prompt is right | `grep -n "$B" <successor prompt>`; it names the worktree or folder and the base SHA | matches |
| Test status honest | the handover lists each test run with its result, and every NOT RUN | complete |
| Pushed | `git ls-remote origin "refs/heads/$B"` equals `git rev-parse "$B"` | equal |

Forbidden-file check (must print nothing):

```bash
git diff --name-only <base> "$B" | grep -E '\.(xlsx|pptx|zip)$|^(monthly-updates|backups|handover-archive)/'
```

If the branch cannot be pushed, leave it local, keep the files, and tell the owner exactly where the
local state is (folder, branch, patch). Never claim the successor has the full state because a branch
name exists.

## 7. The successor prompt (section 20)

One file per replaced chat, in this folder: `<CHAT-ID>_TASK-<id>_SUCCESSOR_PROMPT_<YYYY-MM-DD>.md`, or
`<FROM>_TO_<TO>_SUCCESSOR_PROMPT_<YYYY-MM-DD>.md` for a Moderator or Guardian handover. It is the complete
text the owner pastes, specific to the task, with no placeholders unless a value truly cannot be known
(then say exactly what must be filled in and by whom). It must contain:

- **A. Identity:** the exact chat name `[CHAT-ID] | [WORKSTREAM] | [RESPONSIBILITY] | [STATUS]`, the
  workstream and responsibility.
- **B. Transfer context:** the handover document and supporting files (which are authoritative); the
  verified repository path, working directory or worktree, branch and latest commit.
- **C. Starting point:** what is done, what is incomplete, known local-only changes and unresolved
  checkpoint issues.
- **D. First actions:** inspect the repository, validate the working tree and branch, read the handover
  and registers, compare the documented state with the code, before any change.
- **E. Scope boundaries:** permitted scope, non-goals, reserved files, affected components, dependencies.
- **F. Work to resume:** the next steps in order, each with acceptance criteria and required tests.
- **G. Coordination:** the Moderator, the Guardian, related chats, pending approvals; no change to shared
  components before the ownership and change-impact checks.
- **H. Git instructions:** the continuation branch and working directory; verify branch and commit
  before changes; do not overwrite the branch or create duplicate branches; the no-checkout rule.
- **I. Completion requirements:** update task state, test evidence, change ownership, documentation and
  git records.
- **J. Uncertainty warnings:** every unresolved issue and missing piece of evidence, to investigate before
  treating the handover as complete.

The handover document and the successor prompt must agree; check both after writing.

## 8. The owner's handover message (section 21)

When the new chat cannot be created directly (or the owner must click a card), the outgoing chat ends
with one message containing:

1. A clear notice that this chat must no longer continue implementation.
2. The exact successor chat name.
3. The continuation (or handover) branch name.
4. The local path to the handover document.
5. The local path to the successor prompt.
6. The GitHub URLs (branch, PR), only if verified.
7. Whether the branch holds all relevant code changes.
8. Anything still uncommitted or local-only.
9. The exact prompt to paste (inline as well as in the file, when practical).
10. The precise action the owner takes in the Claude interface (for example: open a new chat in the
    Claude desktop app's Code tab on this folder, or click the session card, and paste the prompt).

The owner should never have to reconstruct this from several files.

## 9. After the successor starts

The successor validates first (section 7 item D), then the Moderator (or the new Moderator itself)
records in one docs PR: successor `ACTIVE`, old chat `RETIRED` with reason and successor,
ownership moved in `ACTIVE_CHANGE_REGISTER.md`, the index row below updated. A continuation branch is
deleted only with the owner's agreement (DEC-OPEN-22 covers branch clean-up).

## 10. Index of continuation and handover prompts

Newest last. The status column uses the chat statuses; update it when the successor starts.

| Date | From -> To | Scenario | Tasks | Branch | Handover document | Successor prompt | Status |
|---|---|---|---|---|---|---|---|
| 28-Oct-2026 | MOD-01 -> MOD-02 | B (Moderator); clean tree, no WIP checkpoint needed | TASK-015 (package), TASK-016 (validation by MOD-02) | `handover/mod-01-to-mod-02-20261028` | [`../MASTER_HANDOVER_2026-10-28_v1.md`](../MASTER_HANDOVER_2026-10-28_v1.md) | [`MOD-01_TO_MOD-02_SUCCESSOR_PROMPT_2026-10-28.md`](MOD-01_TO_MOD-02_SUCCESSOR_PROMPT_2026-10-28.md) | Issued 28-Oct-2026; MOD-01 HANDOVER REQUIRED; MOD-02 QUEUED until the owner starts it |

No sub-chat continuation has been needed so far: NB-01, NB-02 and NB-03 each finished their task and
are COMPLETED (`docs/project-control/CHAT_REGISTRY.md`).

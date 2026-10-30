# Moderator handover template

| Field | Value |
|---|---|
| Version | 1 |
| Date | 28-Oct-2026 |
| Author chat | MOD-01 |
| Status | Template |
| Supersedes | none |
| Next review | at the next Moderator handover |

**How to use.** When a Moderator (or the Guardian session) must be replaced (Scenario B,
[`continuations/README.md`](continuations/README.md)), copy section "Template" into
`docs/handover/MASTER_HANDOVER_<YYYY-MM-DD>_v<N>.md` (Guardian: `CODEBASE_GUARDIAN_HANDOVER_<YYYY-MM-DD>_v<N>.md`)
on the branch `handover/<from>-to-<to>-YYYYMMDD`, cut from current `origin/main`. Fill every field from
commands run at handover time, not from memory. Never leave a field blank: write "none", or
"UNKNOWN: <what is missing, who can fill it>". Label claims VERIFIED / INFERRED / UNCERTAIN / UNKNOWN
and use only the status vocabulary of `MODERATOR_BOOTSTRAP_PROMPT.md` section 12. Link to the registers
instead of copying them; copy only the snapshot values a successor needs to validate. The previous
master handover is not edited: its status becomes "Historical snapshot, superseded by <file>" in the
index ([`README.md`](README.md)). Then write the successor prompt (`continuations/README.md` section 7)
and add the index rows. A worked example follows the template.

## Template

### 0. Header

| Field | Value |
|---|---|
| Version | <N> |
| Date | <DD-Mon-YYYY> |
| Author chat | <outgoing MOD-nn> |
| Status | Authoritative (current state as of <date, time UTC>) |
| Supersedes | <previous MASTER_HANDOVER file, or none> |
| Next review | <when the successor completes its validation task> |

### 1. Identity and reason

| Field | Value |
|---|---|
| Outgoing chat | `<MOD-nn> \| Project-Wide \| Master Project Moderator \| HANDOVER REQUIRED`; session `<local_...>`; title in the app `<...>`; active since <date> |
| Successor | `<MOD-mm> \| Project-Wide \| Master Project Moderator \| QUEUED`; how it is started (card, or the owner pastes the successor prompt) |
| Predecessor's handover | <link to the previous master handover> |
| Trigger (master prompt section 15) | <which item>; evidence: <owner's instruction with date and time, or compaction count with each `compact_boundary` timestamp from `<session>.jsonl`> |
| What the outgoing chat can no longer reconstruct | <periods or details that survive only in summaries or transcripts> |

### 2. Repository and git state (commands run at <date, time UTC>)

| Field | Value |
|---|---|
| Repository path | `%USERPROFILE%\...` |
| Remotes | `origin` <URL>; `upstream` <URL, push disabled?>; `gh repo set-default --view` = <repo> |
| Main checkout branch | <must be `main`> |
| HEAD / `origin/main` | <SHA> / <SHA>; ahead / behind <n / n> |
| Code and data baseline (base SHA) | <SHA, PR, date; site content state> |
| Handover branch | `handover/<from>-to-<to>-YYYYMMDD`; tip <SHA>; PR <#n or "not opened">; merge <SHA or "not merged yet"> |
| Working tree | staged <list or none>; unstaged <list or none>; untracked <list or none> |
| Preservation case (A-D) | <case and what was done; or "none: clean tree"> ; WIP checkpoint <SHA or none> |
| Unmerged branches | `git branch --no-merged main` / `git branch -r --no-merged main`: <list>; owner of each |
| Open PRs | <list with owner chat and gate reached> |
| Worktrees | <path, branch, SHA, clean?, owner chat, active?> |
| Stash | <entries, content verdict> |
| Environment | OneDrive running? <yes/no>; cloud-only `.git` files <n of m>; `git fsck --connectivity-only` <result>; toolchain <versions> |

### 3. Tests actually run

| Command or check | When (UTC) | At SHA | Result | Evidence |
|---|---|---|---|---|
| `node tools/verify_page.js site` | | | | |
| `npm test` | | | | |
| live parity (7 files, SHA-256) | | | | |
| browser (`verify-dashboard`, `docs/TESTING.md` section 3) | | | | |
| other (renders, financial review) | | | | |

NOT RUN: <every check that a successor might assume ran, and why it did not>.

### 4. Work: done and not done

By workstream (EX, NB, OPS, GOV), with task IDs and statuses; link `docs/project-control/TASK_REGISTER.md`.
Name every task that is IN PROGRESS and where its work is (branch, worktree, chat).

### 5. Chats

Snapshot of `docs/project-control/CHAT_REGISTRY.md`: for every non-retired chat its ID and name,
session id, tasks, worktree and branch, reserved files, last commit, current blocker, pending user
decisions, handover document, successor. List external chats separately.

### 6. File ownership and integration

- Open claims in `ACTIVE_CHANGE_REGISTER.md` and whether each is released, kept or transferred.
- Last verified baseline (`INTEGRATION_AND_REGRESSION_LOG.md`) and any incident still open.
- Guardian findings not yet resolved.

### 7. Owner decisions and messages

- Open decisions (`DEC-OPEN-nn`), with deadlines, in the order to ask them.
- Questions put to the owner and not answered (date, wording, options offered).
- Messages waiting to be relayed to a chat (recipient, text, whether already sent).
- Owner actions only the owner can take.

### 8. Local-only artefacts

| Path | What | Size / count | Backup state | Sensitivity | Needed for |
|---|---|---|---|---|---|

### 9. Next steps for the successor

Numbered, in execution order. For each: task ID, what to do, acceptance criteria, required tests,
dependencies and blockers.

### 10. Coordination

Guardian (how to invoke, its durable memory), specialists, related chats, external projects, pending
approvals.

### 11. Uncertainty warnings

Every UNKNOWN or INFERRED point that matters, with what is missing and how to establish it.

### 12. Verification of the handover branch (`continuations/README.md` section 6)

| Check | Result and evidence |
|---|---|
| Branch exists; source = recorded base | |
| Only documentation (and agreed agent or register files) in the diff | |
| No secrets, client data or forbidden files | |
| Handover document and successor prompt present and agree | |
| Test status documented honestly | |
| Pushed; remote SHA = local SHA | |

### 13. The owner's handover message (`continuations/README.md` section 8)

1. Notice that the outgoing chat stops implementation.
2. Successor chat name.
3. Branch name.
4. Local path of this document.
5. Local path of the successor prompt.
6. GitHub URLs (verified).
7. Whether the branch holds all relevant changes.
8. What remains uncommitted or local-only.
9. The prompt to paste (inline too).
10. The owner's exact action in the Claude interface.

### 14. Records updated

`CHAT_REGISTRY.md` (outgoing HANDOVER REQUIRED, successor QUEUED), the index in
`docs/handover/README.md`, the index in `docs/handover/continuations/README.md`, `TASK_REGISTER.md`
(handover and validation tasks).

## Example (short): MOD-01 -> MOD-02, 28-Oct-2026

Drawn from this project's real handover; the full document is
[`MASTER_HANDOVER_2026-10-28_v1.md`](MASTER_HANDOVER_2026-10-28_v1.md). Values VERIFIED on 28-Oct-2026
unless marked.

| Field | Value |
|---|---|
| Outgoing chat | `MOD-01 \| Project-Wide \| Master Project Moderator \| HANDOVER REQUIRED`; session `local_11e29451-b340-463b-8289-9a30c5fa2173`; "Investment Proposal Dashboard architecture"; active since 15-Oct-2026 14:36 UTC |
| Successor | `MOD-02 \| Project-Wide \| Master Project Moderator \| QUEUED`; the owner starts it with `continuations/MOD-01_TO_MOD-02_SUCCESSOR_PROMPT_2026-10-28.md` |
| Trigger | The owner ordered the handover and a new Moderator (master prompt pasted 27-Oct-2026 15:25 UTC and again 28-Oct-2026 05:33 UTC): "a chat is being retired or replaced", "the Moderator itself needs to be replaced". Compactions: two (19-Oct-2026 06:28:17Z, 27-Oct-2026 12:24:37Z), so the three-compaction trigger is not met. |
| No longer reconstructable in context | 15-19-Oct detail (summaries only); 27-Oct 12:24Z to 28-Oct 05:30Z (transcript files only) |
| Repository | `%USERPROFILE%\OneDrive - CENTRICITY FINANCIAL DISTRIBUTION PRIVATE LIMITED\Desktop\Claude Code-Investment Proposal Dashboard`; `origin` productsteamcentricity/Centricity-Proposal-Playbook; `upstream` push disabled; gh default = origin |
| Main checkout / HEAD / origin/main | `main` / `2b2a397` / `2b2a397` (0 ahead, 0 behind) |
| Base | `2b2a397` = PR #28 merge, 27-Oct-2026; site content state S7 (last site change PR #26 `5d39821`) |
| Handover branch | `handover/mod-01-to-mod-02-20261028`, created and merged by MOD-01; merge SHA and PR number recorded in the PR, not in the package (they did not exist when it was written) |
| Working tree | clean before the package (0 staged, 0 unstaged, 0 untracked); afterwards only MOD-01's package edits |
| Preservation case | none of A-D needed: Scenario B, clean tree; no WIP checkpoint |
| Branches, PRs, worktrees, stash | 26 local and 25 remote branches, all merged; 0 open PRs; 3 extra worktrees, clean, merged, inactive; 1 stash (superseded); clean-up waits for DEC-OPEN-22 |
| Environment | OneDrive.exe not running; folder not pinned; 229 of 519 `.git` files cloud-only; `git fsck --connectivity-only` exit 0; historical and stash blob reads fail with "mmap failed" (R6) |
| Tests run | `verify_page` exit 0 (MASTER 7682 ... 0 script errors); `npm test` 5 of 5, 903 checks; live 7 of 7 SHA-256 = `site/`; browser start-up ~07:13 UTC clean (MASTER 7,682, three sibling flags, 0 console errors) |
| NOT RUN | building a proposal and exporting in a browser on S7; Excel opened in Office; PowerPoint render since 22-Oct; fresh-clone setup |
| Done | TASK-001 to TASK-014 (TASK-013 IMPLEMENTED NOT FULLY VERIFIED); TASK-015 (the package) once merged |
| Not done | TASK-016 to TASK-074 (`TASK_REGISTER.md`); 28 open decisions |
| Chats | no active sub-chat; NB-01, NB-02, NB-03 COMPLETED; EXT-PR-01, EXT-PR-02 external (sister project) |
| Ownership | no open claim |
| Pending | DEC-OPEN-02, -03, -01 and -08 by about 13-Nov-2026; MOD-01's unanswered question of 27-Oct-2026 12:28 UTC = DEC-OPEN-01; no message to relay |
| Local-only artefacts | `monthly-updates\` (~446 MB), `backups\` (2 snapshots), `handover-archive\` (export incl. the B8 toolchain and two client items, R8), `_testdata\pptx-design-system\`, `%TEMP%\x\` (incl. `ref.pptx`, R10), memory and side-session notes (E16); backup state UNKNOWN (R11) |
| Next steps | the successor prompt's section F: TASK-016, owner decisions, TASK-017, TASK-064, TASK-018, then the data calendar |
| Owner's action | open a new chat in the Claude desktop app's Code tab on the repository folder (or click MOD-01's card) and paste the successor prompt |

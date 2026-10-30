# Chat registry

| Field | Value |
|---|---|
| Version | 1 |
| Date | 28-Oct-2026 |
| Author chat | MOD-01 |
| Status | Authoritative (live register; only the Moderator edits it) |
| Supersedes | none (first chat registry of this project) |
| Next review | MOD-02's first session (TASK-016); then at the start of every Moderator session and at every chat status change |

Every Claude chat (session) that works on the Centricity Investment Proposal Dashboard ("Proposal
Playbook") is listed here: what it is responsible for, what it owns, what it delivered and who succeeds
it. This file is the record; nothing depends on chats messaging each other.

Related registers: who may edit which file right now is in
[ACTIVE_CHANGE_REGISTER.md](ACTIVE_CHANGE_REGISTER.md); how files are claimed, reviewed and integrated
is in [FILE_OWNERSHIP_AND_CHANGE_CONTROL.md](FILE_OWNERSHIP_AND_CHANGE_CONTROL.md); tasks are in
[TASK_REGISTER.md](TASK_REGISTER.md); open owner decisions are in [DECISION_LOG.md](DECISION_LOG.md).

**Evidence.** The Claude desktop app's session list (`list_sessions` including archived sessions, and
`get_session`), read by MOD-01 on 28-Oct-2026 at about 05:40 UTC and re-read at about 07:06 UTC; the
transcript files under `%USERPROFILE%\.claude\projects\<project slug>\`; `git` and `gh` for commits and
pull requests. Facts are VERIFIED from these sources unless labelled INFERRED or UNKNOWN.

---

## 1. Chats at a glance

Registry names, in the format `[CHAT-ID] | [WORKSTREAM] | [RESPONSIBILITY] | [STATUS]`:

```text
MOD-01 | Project-Wide | Master Project Moderator                    | HANDOVER REQUIRED
MOD-02 | Project-Wide | Master Project Moderator                    | QUEUED
ARC-01 | Project-Wide | Codebase Integrity & Integration Guardian   | QUEUED
NB-01  | NB - New build     | P1 tool risks A1, A3, A4 (TASK-003)         | COMPLETED
NB-02  | NB - New build     | Five P3 tool and UI follow-ups (TASK-011)   | COMPLETED
NB-03  | NB - New build     | PowerPoint export design system (TASK-013)  | COMPLETED
```

| ID | Status | Session id | Title in the app | Tasks | Works in | Successor |
|---|---|---|---|---|---|---|
| MOD-01 | HANDOVER REQUIRED | `local_11e29451-b340-463b-8289-9a30c5fa2173` | Investment Proposal Dashboard architecture | TASK-015 (IN PROGRESS); 11 completed | main checkout, `main` | MOD-02 |
| MOD-02 | QUEUED | not created yet | not created yet | TASK-016 first | main checkout, `main` | none |
| ARC-01 | QUEUED | none (subagent `integration-guardian`) | none | Gate B reviews | read-only | none |
| NB-01 | COMPLETED | `local_d2d575b3-186e-49d0-9fe4-fe36f685a9f3` | Fix the three P1 tool risks before the next refresh | TASK-003 | worktree `focused-wright-d50bee` | none |
| NB-02 | COMPLETED | `local_1f914af1-944c-44a0-8bda-5bfa6f228cab` | Small tool and UI follow-ups from the 19-Oct fixes | TASK-011 | worktree `adoring-boyd-7028f6` | none |
| NB-03 | COMPLETED | `local_00b57be9-5ff6-4864-92bd-de4f103330ae` | Fix and standardise the proposal PowerPoint export | TASK-013 | main checkout (no worktree) | none |

Workstreams (prefixes): **EX** existing dashboard, **NB** new build, **OPS** monthly data operations,
**GOV** governance and continuity. No EX, OPS or GOV sub-chat has existed yet: that work was done by
MOD-01 itself. Sessions of the sister Portfolio Review Dashboard project are in section 4, not here.

---

## 2. Status vocabulary

| Status | Meaning in this project | May hold file claims? |
|---|---|---|
| ACTIVE | Running and assigned. A coding chat that is ACTIVE has an IN PROGRESS row in ACTIVE_CHANGE_REGISTER; a Moderator is ACTIVE while it is the current Moderator. | yes |
| WAITING | Assigned but paused on an answer: owner, desk, Guardian review or CI. | yes, keeps them |
| QUEUED | Defined (ID, role or brief) but not started. | no; claims are granted when it starts |
| BLOCKED | Cannot continue because of a named blocker. | yes, until the Moderator releases them with the owner's agreement |
| HANDOVER REQUIRED | Must hand over. Does only handover work: no new tasks, no code changes. | only its handover task |
| COMPLETED | Its assigned work is merged and recorded; it holds nothing. The session may still exist in the app. | no |
| RETIRED | Replaced by a successor after its work, file ownership and handover were reconciled. No further work. | no |
| SUPERSEDED | Its planned work was moved to another chat or cancelled before completion. | no |

"EXTERNAL" is not a status. Task statuses (VERIFIED COMPLETE, IN PROGRESS ...) belong in
[TASK_REGISTER.md](TASK_REGISTER.md), not here.

---

## 3. Chat records

### MOD-01 | Project-Wide | Master Project Moderator | HANDOVER REQUIRED

| Field | Value |
|---|---|
| Session id | `local_11e29451-b340-463b-8289-9a30c5fa2173` |
| Title in the app | Investment Proposal Dashboard architecture |
| Started | 15-Oct-2026 14:36 UTC, by the owner (the first master project prompt) |
| Model and settings | claude-opus-5-5, effort xhigh, permission mode auto |
| Responsibility | Moderator since 15-Oct-2026. Did Stage A (replication, sanitised GitHub transfer, Pages publish behind a parity gate, baseline docs), the 16-19-Oct tool and page fixes, the Sep-2026 data runs, the outgoing-owner export prompt and its ingestion, and orchestrated NB-01..NB-03. Now produces the handover package. |
| Status | HANDOVER REQUIRED since 27-Oct-2026 15:25 UTC (the owner's handover master prompt; re-issued byte-identical on 28-Oct-2026 05:33 UTC). It becomes RETIRED when all three hold: (1) the branch `handover/mod-01-to-mod-02-20261028` is merged to `main`; (2) MOD-02 has completed TASK-016 and confirmed the handover in writing; (3) the TASK-015 claim in ACTIVE_CHANGE_REGISTER is released. MOD-02 records the retirement. MOD-01 makes no code change at all and no repository change after the merge; a gap MOD-02 finds is fixed by MOD-02. |
| Assigned tasks | TASK-015 (IN PROGRESS, P1). Completed: TASK-001, TASK-002, TASK-004, TASK-005, TASK-006, TASK-007, TASK-008, TASK-009, TASK-010, TASK-012, TASK-014. |
| Working directory and branch | The main checkout `%USERPROFILE%\OneDrive - CENTRICITY FINANCIAL DISTRIBUTION PRIVATE LIMITED\Desktop\Claude Code-Investment Proposal Dashboard`, on `main` (not switched). The package is committed to `handover/mod-01-to-mod-02-20261028`, created from `2b2a397` without a checkout (temporary-index commit). |
| Reserved files and shared components | The TASK-015 claim: `docs/handover/**`, `docs/project-control/**`, `docs/KNOWN_ISSUES.md`, `.claude/agents/integration-guardian.md`, `CLAUDE.md`, `docs/README.md`, `CHANGELOG.md`, `docs/PROJECT_STATE.md`. Released at the merge. |
| Dependencies | none |
| Last known commit and deliverable | `2b2a397` = PR #28 merge (27-Oct-2026 12:27 UTC): ingestion of the outgoing owner's 23-Oct export, docs only. PRs by MOD-01: #1-#3, #7-#18, #24, #25, #28. Current deliverable: this handover package. While it is written it is uncommitted in the main checkout (`CLAUDE.md` and `docs/README.md` modified, new files under `docs/handover/` and `docs/project-control/`; VERIFIED with `git status` on 28-Oct-2026). |
| Pending owner decisions | MOD-01's last question is unanswered: "Should I rebuild the risk-ratio and NAV workbook tools in-house?" (27-Oct-2026 12:28 UTC) = DEC-OPEN-01 (KNOWN_ISSUES B8). Every open decision, DEC-OPEN-01..DEC-OPEN-28, passes to MOD-02 ([DECISION_LOG.md](DECISION_LOG.md)). |
| Current blocker | none |
| Context state | 2 automatic context compactions: 19-Oct-2026 06:28:17 UTC and 27-Oct-2026 12:24:37 UTC. The 28-Oct transcript starts from a copy of the 27-Oct summary (same timestamp); that is not a third compaction. Detail from 15-19-Oct survives only in summaries and transcripts. |
| Transcripts | `7628c9ae-33a1-4ba1-a4d9-bca35a44a511.jsonl` (15-Oct-2026 14:36 UTC to 28-Oct-2026 05:30 UTC; it ends with an authentication failure) and `df00b5b0-8ce0-402b-9cbd-9bfedd047f08.jsonl` (from 28-Oct-2026 05:33 UTC) |
| Current handover document | [MASTER_HANDOVER_2026-10-28_v1.md](../handover/MASTER_HANDOVER_2026-10-28_v1.md) and the successor prompt [MOD-01_TO_MOD-02_SUCCESSOR_PROMPT_2026-10-28.md](../handover/continuations/MOD-01_TO_MOD-02_SUCCESSOR_PROMPT_2026-10-28.md) |
| Successor | MOD-02 |
| Retirement reason | The owner ordered a new Moderator and the Moderator / Guardian multi-chat model with project-control registers (master prompt sections 1, 7 and 14-16). Proactive handover is preferred because MOD-01 has been compacted twice. The three-compaction trigger is **not** met and is not the reason. |

### MOD-02 | Project-Wide | Master Project Moderator | QUEUED

| Field | Value |
|---|---|
| Session id | Not created yet. MOD-02 records its own id (`get_session` in the desktop app) in its first register update. |
| Title in the app | Set when the owner starts the chat. In the desktop app a session can be renamed (`set_session_title`), but the app asks the owner first when the owner chose the title; do not rename without asking. MOD-02 records the title here as the app shows it. |
| How it starts | The owner opens a new chat on this folder in the Claude desktop app's Code tab (or accepts MOD-01's proposal card) and pastes [MOD-01_TO_MOD-02_SUCCESSOR_PROMPT_2026-10-28.md](../handover/continuations/MOD-01_TO_MOD-02_SUCCESSOR_PROMPT_2026-10-28.md). Outside the desktop app the same prompt is pasted into a new Claude Code session started in this folder. |
| Responsibility | The owner's primary contact. Validates the package; coordinates EX, NB, OPS and GOV; decomposes requirements into tasks and assigns them; grants and records file claims; keeps the registers; consults ARC-01; runs Gate D (merge = publish) and docs-only changes itself; manages the handover of sub-chats and of itself. |
| Status | QUEUED. Becomes ACTIVE when it starts. |
| Assigned tasks | TASK-016 first: validate the package against the repository before assigning any work. Then the ordered plan in the master handover. Owner chat (alone or with the owner) of TASK-018, TASK-036, TASK-037, TASK-054, TASK-056, TASK-059, TASK-060, TASK-061, TASK-062, TASK-063, TASK-064 (or a future EX chat), TASK-070, TASK-071, TASK-074. Records or verifies the owner's TASK-017, TASK-019, TASK-032, TASK-033, TASK-034, TASK-073. Assigns every other open task ([TASK_REGISTER.md](TASK_REGISTER.md)). |
| Working directory and branch | The main checkout on `main`. It never leaves it on another branch and never runs `git checkout` / `git switch` there (KNOWN_ISSUES R6; `CLAUDE.md` "Project control"). |
| Reserved files and shared components | After the merge: the Moderator-owned group (`docs/project-control/**`, `docs/handover/**`; see FILE_OWNERSHIP_AND_CHANGE_CONTROL section 3). |
| Dependencies | TASK-015 merged (the package on `main`). |
| Last known commit and deliverable | none yet |
| Pending owner decisions | DEC-OPEN-01..DEC-OPEN-28. First DEC-OPEN-02 and DEC-OPEN-03, then DEC-OPEN-01 and DEC-OPEN-08 (deadline about 13-Nov-2026, before the Oct-2026 MF cycle; INFERRED from the documented cadence). |
| Current blocker | Not started: the owner must start it. |
| Current handover document | The successor prompt above and [MASTER_HANDOVER_2026-10-28_v1.md](../handover/MASTER_HANDOVER_2026-10-28_v1.md) |
| Successor | none |
| Retirement reason | not applicable |

### ARC-01 | Project-Wide | Codebase Integrity & Integration Guardian | QUEUED

| Field | Value |
|---|---|
| Session id | None. ARC-01 is the subagent defined in [`.claude/agents/integration-guardian.md`](../../.claude/agents/integration-guardian.md) (created by TASK-015) and invoked by the Moderator. For a long review the Moderator may run it as its own session; that session's id is then recorded here. |
| Title in the app | none (not a chat) |
| Responsibility | The independent technical control layer. Reviews change-impact contracts before material or high-risk work (Gate B pre-check) and the actual diffs after (Gate B): affected files, downstream consumers, ripple effects, conflicts with active claims, interface and schema compatibility, duplicated business logic, required regression tests, documentation and recovery risk. Reports to the Moderator. Read-only tools (Read, Grep, Glob, Bash). Never implements features and never makes product decisions. |
| Status | QUEUED. The definition reaches `main` with the handover merge. Claude Code reads agent definitions when a session starts (INFERRED), so it is available to sessions started after the merge, beginning with MOD-02. MOD-02 sets ACTIVE once it has invoked it successfully. |
| Assigned tasks | Gate B for every material change (triggers: FILE_OWNERSHIP_AND_CHANGE_CONTROL section 7). Suggested first use: support MOD-02's TASK-016 validation. |
| Working directory and branch | Read-only. It reads whichever checkout or worktree the Moderator points it at. |
| Reserved files and shared components | none (it does not write) |
| Durable memory | A subagent keeps no memory between calls. Its knowledge lives in [CODEBASE_GUARDIAN_HANDOVER_2026-10-28_v1.md](../handover/CODEBASE_GUARDIAN_HANDOVER_2026-10-28_v1.md), [ARCHITECTURE_AND_DEPENDENCY_MAP.md](ARCHITECTURE_AND_DEPENDENCY_MAP.md), [INTERFACE_CONTRACTS.md](INTERFACE_CONTRACTS.md), [ACTIVE_CHANGE_REGISTER.md](ACTIVE_CHANGE_REGISTER.md), [INTEGRATION_AND_REGRESSION_LOG.md](INTEGRATION_AND_REGRESSION_LOG.md) and [KNOWN_ISSUES_AND_REGRESSION_RISKS.md](KNOWN_ISSUES_AND_REGRESSION_RISKS.md). The Moderator keeps them current after each review. |
| Dependencies | TASK-015 merged |
| Last known commit and deliverable | none yet |
| Pending owner decisions | none |
| Current blocker | none |
| Current handover document | [CODEBASE_GUARDIAN_HANDOVER_2026-10-28_v1.md](../handover/CODEBASE_GUARDIAN_HANDOVER_2026-10-28_v1.md) |
| Successor | none. A replacement long-running Guardian session would be ARC-02, through a handover. |
| Retirement reason | not applicable |

### NB-01 | NB - New build | P1 tool risks A1, A3, A4 (TASK-003) | COMPLETED

| Field | Value |
|---|---|
| Session id | `local_d2d575b3-186e-49d0-9fe4-fe36f685a9f3` |
| Title in the app | Fix the three P1 tool risks before the next refresh |
| Started | 16-Oct-2026 13:09 UTC. Proposed by MOD-01; the owner started it by clicking the proposal card. |
| Responsibility | Fix KNOWN_ISSUES A1 (Bond List tool read the first sheet and assumed the desk), A3 (look-through tool re-dated the MF analytics), A4 (Reckoner merge had no gate against dropped funds). |
| Status | COMPLETED. Last activity 16-Oct-2026 13:48 UTC; not running and not archived on 28-Oct-2026. |
| Assigned tasks | TASK-003 (VERIFIED COMPLETE) |
| Working directory and branch | Worktree `.claude/worktrees/focused-wright-d50bee` (desktop-app session branch `claude/focused-wright-d50bee`, local only, merged). The worktree now sits on `fix/reckoner-drop-gates` at `fe060d5`, clean, 50 commits behind `main` (VERIFIED `git worktree list`, 28-Oct-2026). |
| Reserved files and shared components | none (released at the merge of PR #6) |
| Dependencies | none |
| Last known commit and deliverable | PR #4 `1e4b2fc` (A1), PR #5 `4fbbad6` (A3; D70), PR #6 `c93e55c` (A4; D71), all merged on 16-Oct-2026 |
| Pending owner decisions | none |
| Current blocker | none |
| Current handover document | None: it finished its task without a handover. Its brief is the first message of its transcript. |
| Successor | none |
| Retirement reason | Not retired: its work is complete. Recommendation: give it no new work (its worktree is far behind `main` and its context dates from 16-Oct); start a new chat (next free NB-04) instead. |
| Transcript | `...--claude-worktrees-focused-wright-d50bee\acab20e6-cc42-45e8-aa66-822445bfe65d.jsonl` under `%USERPROFILE%\.claude\projects\` |
| Clean-up | The worktree, its local branches (`fix/reckoner-drop-gates`, `claude/focused-wright-d50bee`) and the merged branches on origin remain. They hold no unique work and can be removed with the owner's agreement: worktree TASK-061, local branches TASK-060, origin branches TASK-059 (all under DEC-OPEN-22). Archiving the session in the app is optional owner housekeeping. |
| Lesson | On 19-Oct-2026 MOD-01 found that its own uncommitted work fixed the same A1/A3/A4 issues and wanted the same decision numbers (D70, D71) that NB-01 had already merged on 16-Oct; the overlap had to be merged by hand, file by file (memory note `fetch-before-branching`, VERIFIED as written there). This is why file claims and ID numbers are now allocated by the Moderator only. |

### NB-02 | NB - New build | Five P3 tool and UI follow-ups (TASK-011) | COMPLETED

| Field | Value |
|---|---|
| Session id | `local_1f914af1-944c-44a0-8bda-5bfa6f228cab` |
| Title in the app | Small tool and UI follow-ups from the 19-Oct fixes |
| Started | 21-Oct-2026; its brief arrived 05:51 UTC. Proposed by MOD-01; started by the owner accepting the card (INFERRED: the act is visible only in the transcript). |
| Responsibility | Five P3 follow-ups: every tool exits 2 on a missing input (D72), OneDrive rename retry (R6), C17 matrix footnote, C18 Select popover dagger, A27 `rehearse.js --old-site`. |
| Status | COMPLETED. Last activity 21-Oct-2026 06:44 UTC; not running and not archived on 28-Oct-2026. |
| Assigned tasks | TASK-011 (VERIFIED COMPLETE) |
| Working directory and branch | Worktree `.claude/worktrees/adoring-boyd-7028f6` (desktop-app session branch `claude/adoring-boyd-7028f6`, local only, merged). The worktree now sits on `fix/a27-rehearse-old-site` at `18abff3`, clean apart from the ignored `node_modules/`, 12 commits behind `main` (VERIFIED, 28-Oct-2026). |
| Reserved files and shared components | none (released at the merge of PR #23) |
| Dependencies | none |
| Last known commit and deliverable | PR #19 `699978b`, PR #20 `0cb7e95`, PR #21 `75538de`, PR #22 `fb9cbd6`, PR #23 `1523bbc` (21-Oct-2026 06:06-06:41 UTC). PR #23's code exists only inside merge commit `18abff3`, so `git log --no-merges` does not show it (use `git log -m` or `git diff 18abff3^1 18abff3`). It opened C22 and C23. |
| Pending owner decisions | None held. C23 is now DEC-OPEN-12, with MOD-02. |
| Current blocker | none |
| Current handover document | None: it finished its tasks without a handover. Its brief is the first message of its transcript. |
| Successor | none |
| Retirement reason | Not retired: its work is complete. Same recommendation as NB-01 (no new work; use NB-04 or later). |
| Transcript | `...--claude-worktrees-adoring-boyd-7028f6\4dd2f74d-0c16-41c3-80c0-452707770e58.jsonl` under `%USERPROFILE%\.claude\projects\` |
| Clean-up | As NB-01: worktree TASK-061, local branches TASK-060, origin branches TASK-059 (DEC-OPEN-22), with the owner's agreement. |

### NB-03 | NB - New build | PowerPoint export design system (TASK-013) | COMPLETED

| Field | Value |
|---|---|
| Session id | `local_00b57be9-5ff6-4864-92bd-de4f103330ae` |
| Title in the app | Fix and standardise the proposal PowerPoint export |
| Started | 22-Oct-2026 14:31 UTC. Proposed by MOD-01; the owner chose "New session" at 14:30 UTC. |
| Responsibility | The PowerPoint export design system: measured layout, continuation slides, page numbers, `*` marker on expected returns (D82, D83). |
| Status | COMPLETED. Last activity 22-Oct-2026 15:41 UTC; not running and not archived on 28-Oct-2026. |
| Assigned tasks | TASK-013 (IMPLEMENTED NOT FULLY VERIFIED: merged, published, live files equal `site/`; specification residuals are tracked as REQ-PPT items; the full browser acceptance pass on the current build is TASK-064). |
| Working directory and branch | The shared main checkout, no worktree. Branches `feat/pptx-design-system` and `docs/release-pr26` (merged; both remain locally and on origin). |
| Reserved files and shared components | none (released at the merge of PR #27) |
| Dependencies | none |
| Last known commit and deliverable | PR #26 `5d39821` (22-Oct-2026 15:37 UTC, after the owner's go-ahead at 15:36 UTC; D82 and D83; closed C22, opened C28-C34) and PR #27 `5bcce88` (15:41 UTC, release record). NB-03 merged both (VERIFIED from its transcript). |
| Local-only material it left | `_testdata/pptx-design-system/` (renders, sample deck) and `%TEMP%\x\` (raw PowerPoint bounds files, deck authoring source, and `ref.pptx`, INFERRED to be a copy of a client reference deck: never open, quote or commit it; the owner decides, KNOWN_ISSUES R10). Inventory and backup: TASK-070. |
| Pending owner decisions | None held. Related open decisions now with MOD-02: DEC-OPEN-16, DEC-OPEN-21, DEC-OPEN-23. |
| Current blocker | none |
| Current handover document | None: it finished its task without a handover. Its brief is the first message of its transcript. |
| Successor | none |
| Retirement reason | Not retired: its work is complete. Same recommendation as NB-01. |
| Transcript | `1ffe6022-e7ad-4673-8c7c-602d97dee30c.jsonl` under `%USERPROFILE%\.claude\projects\<project slug>\` |
| Clean-up | Merged branches: TASK-060 (local), TASK-059 (origin), under DEC-OPEN-22. |
| Lesson | NB-03 left the shared main checkout on `feat/pptx-design-system`. When MOD-01 switched back to `main` on 25-Oct-2026, `git checkout` failed with "mmap failed" (OneDrive cloud-only pack files) and truncated or deleted tracked files; they were restored from git with nothing lost (KNOWN_ISSUES R6). Rule since then: the main checkout stays on `main`, and coding chats use their own worktree. |

---

## 4. External sessions (other project; not controlled by this registry)

| ID | Session id | Title in the app | Folder | Note (28-Oct-2026) |
|---|---|---|---|---|
| EXT-PR-01 | `local_7f5b5474-442a-45e7-9fc1-9c285043394e` | Portfolio Review Dashboard architecture | `%USERPROFILE%\OneDrive - CENTRICITY FINANCIAL DISTRIBUTION PRIVATE LIMITED\Desktop\Claude Code-Portfolio Review Dashboard` (its own repository) | EXTERNAL - separate project. Running. It received the same handover master prompt at about 05:33 UTC and handles that project's own handover. |
| EXT-PR-02 | `local_aa7a56d6-843d-4d2f-9ed2-537e38a53c86` | Build the new Portfolio Review dashboard | the same other folder | EXTERNAL - separate project. Not running. |

- No chat of this project writes in that folder or repository, and the reverse. `docs/specs/` here holds
  a redacted specification of the sister dashboard for reference only.
- Whether one Moderator should coordinate both projects is open: DEC-OPEN-25. The documented
  recommendation is one Moderator per project, because the repositories, folders, data and releases are
  separate; each registry lists the other project's chats as external.
- `EXT-PR-nn` are labels of this registry only; the other project numbers its own chats.

---

## 5. Other actors (not Claude chats of this project)

| Actor | Role |
|---|---|
| The owner (Centricity Products team, GitHub `productsteamcentricity`) | Product owner. Approves decisions. The only one who contacts the desk and the outgoing owner, starts or renames chats, and changes machine or repository settings. |
| The outgoing owner and their own Claude build | Produced the 23-Oct-2026 export. This project has no access to their chats. |
| The desk and vendors | Send the monthly workbooks (by role: [`docs/INPUT_FILES.md`](../INPUT_FILES.md) section 1). |
| Workflow subagents and agent calls (`repo-archaeologist`, `qa-verifier` and others) | Ephemeral helpers. Not registered; their output is attributed to the chat that ran them. |

---

## 6. Registry rules

1. **IDs.** `<PREFIX>-<nn>` with the prefixes MOD (Moderator), ARC (Guardian), EX, NB, OPS, GOV
   (workstream sub-chats). Unique and sequential within a prefix; never reused or renumbered, even after a
   chat is retired or superseded. Next free on 28-Oct-2026: EX-01, NB-04, OPS-01, GOV-01, ARC-02, MOD-03.
   A successor always gets a new ID (MOD-02 is not "MOD-01 continued").
2. **One record per chat**, headed by its name line `[CHAT-ID] | [WORKSTREAM] | [RESPONSIBILITY] | [STATUS]`
   and filled in for every field of section 3. Write "none" or "not created yet"; never leave a field blank.
3. **Statuses** only from section 2.
4. **Only the Moderator edits this file.** Sub-chats report status changes to the Moderator (Gate A report,
   blocker report or handover).
5. **Register before work.** A chat gets its ID and record (QUEUED) before it starts. Its file claims go into
   [ACTIVE_CHANGE_REGISTER.md](ACTIVE_CHANGE_REGISTER.md) before it edits anything.
6. **Do not retire a chat until** (a) its outstanding work is merged, or preserved on a pushed branch and
   handed to a named successor; (b) its file claims are released or transferred in ACTIVE_CHANGE_REGISTER;
   (c) its handover document exists and the successor has confirmed it. Until then it stays HANDOVER
   REQUIRED.
7. **If a chat cannot be accessed** (not in `list_sessions`, transcript missing, another machine), write
   "UNKNOWN - cannot access" with what was tried and the date, and ask the owner. Never infer a status from
   silence.
8. **Do not invent capabilities.** Claude cannot create, name or rename the owner's chats. In the desktop
   app a Moderator can propose or start a session (`start_session`; the owner may have to click a card),
   send it messages (`SendMessage` to its `local_...` id) and list sessions; outside the app the fallback is
   a copy-ready prompt the owner pastes. Record titles exactly as the app shows them.
9. **Public repository.** Session ids and titles are fine. No client names, investor data, personal data,
   secrets or tokens. Local paths as `%USERPROFILE%\...`.
10. **Handovers are dated and kept.** Each handover names its predecessor and successor IDs; a new one
    supersedes, never overwrites, the old one, and [`docs/handover/README.md`](../handover/README.md) says
    which is authoritative. Record every handover in section 7. Continuation procedure:
    [`docs/handover/continuations/README.md`](../handover/continuations/README.md).

---

## 7. History of handovers

| Date | From -> to | Kind | Branch (base) | Documents | Reason | State on 28-Oct-2026 |
|---|---|---|---|---|---|---|
| 28-Oct-2026 | MOD-01 -> MOD-02 | Moderator replacement; successor scenario B, clean tree (no work in progress to carry) | `handover/mod-01-to-mod-02-20261028` (from `2b2a397`) | [MASTER_HANDOVER_2026-10-28_v1.md](../handover/MASTER_HANDOVER_2026-10-28_v1.md), [EXISTING_DASHBOARD_HANDOVER_2026-10-28_v1.md](../handover/EXISTING_DASHBOARD_HANDOVER_2026-10-28_v1.md), [NEW_BUILD_HANDOVER_2026-10-28_v1.md](../handover/NEW_BUILD_HANDOVER_2026-10-28_v1.md), [CODEBASE_GUARDIAN_HANDOVER_2026-10-28_v1.md](../handover/CODEBASE_GUARDIAN_HANDOVER_2026-10-28_v1.md), [MOD-01_TO_MOD-02_SUCCESSOR_PROMPT_2026-10-28.md](../handover/continuations/MOD-01_TO_MOD-02_SUCCESSOR_PROMPT_2026-10-28.md), the `docs/project-control/` registers | The owner's order (27-Oct-2026 15:25 UTC, re-issued 28-Oct-2026 05:33 UTC) | IN PROGRESS. Complete when the branch is merged (MOD-02 records the merge SHA and PR number in this row) and MOD-02 confirms the handover (TASK-016). |

Notes:
- A first attempt started on 27-Oct-2026 15:25 UTC stopped at 15:31 UTC; nothing was committed.
- NB-01, NB-02 and NB-03 ended by completing their tasks; there was no handover.
- Not a chat handover, recorded for context: the project's transfer from the outgoing owner (baseline of
  14-Oct-2026; tag `handover-baseline` -> `862e40b`, the sanitised equivalent of upstream `72e1f1e`). See
  [`docs/HANDOVER.md`](../HANDOVER.md) and [`docs/REPLICATION_REPORT.md`](../REPLICATION_REPORT.md).

---

## 8. Keeping this registry current (Moderator, at the start of every session)

1. In the desktop app, list sessions (including archived) and compare with section 1: record new sessions,
   running state and last activity. Outside the app, write what could not be checked (rule 7).
2. For each ACTIVE or WAITING chat, check its worktree (`git worktree list`), branch and latest pushed
   commit (`git fetch origin`, then `git log -1 origin/<branch>`) against its row in
   [ACTIVE_CHANGE_REGISTER.md](ACTIVE_CHANGE_REGISTER.md). Investigate any mismatch; do not guess.
3. A running chat that is not in this registry: ask the owner what it is for; give it an ID only once its
   purpose is known.
4. Commit registry changes in the Moderator's next register PR (docs only, OneDrive-safe method in
   [REPOSITORY_AND_ENVIRONMENT_STATE.md](REPOSITORY_AND_ENVIRONMENT_STATE.md); never `checkout` / `switch`).

**MOD-02's first updates to this file:** fill in its own session id, title and start time and set itself
ACTIVE; after the handover merge, record the merge SHA and PR number in section 7; set ARC-01 ACTIVE after
its first successful review; after TASK-016, set MOD-01 to RETIRED with the date and mark the handover
row complete.

# Chat registry

| Field | Value |
|---|---|
| Version | 2 |
| Date | 17-Nov-2026 |
| Author chat | MOD-01 (first version, 28-Oct-2026); MOD-02 (updates of 2-Nov-2026, 3-Nov-2026 and 17-Nov-2026); MOD-03 (TASK-080, 17-Nov-2026) |
| Status | Authoritative (live register; only the Moderator edits it) |
| Supersedes | the version of 28-Oct-2026 (kept in git history) |
| Next review | at the start of every Moderator session and at every chat status change |

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
pull requests. Facts are VERIFIED from these sources unless labelled INFERRED or UNKNOWN. MOD-02
re-read `list_sessions` (including archived sessions) and `get_session` on 2-Nov-2026 (07:46 UTC and
about 08:55 UTC), and `git` and `gh` for commits, pull requests and worktrees. 3-Nov-2026: MOD-02 read
the state of the GOV-01 and EX-01 sessions, the GOV-01 worktree and branch (read-only git) and the
Guardian pre-check result for the GOV-01 contract (ARC-01: GO WITH CONDITIONS).
17-Nov-2026: MOD-02 re-read `list_sessions` (including archived sessions) and `get_session` for the chats of this
project, and `git worktree list`, the branch heads and `gh pr list` (VERIFIED; the results are in sections 1 and 3).
17-Nov-2026, later (TASK-080): the owner started MOD-03 in a different Claude account. There `list_sessions` (including
archived sessions) shows none of this project's earlier chats (MOD-01, MOD-02, NB-01 to NB-03, GOV-01, EX-01, OPS-01), so
MOD-03 could not compare the app with this file; their states below are MOD-02's record of 17-Nov-2026, not re-checked
in the app. MOD-03's own session is VERIFIED (`get_session self`). Record:
[`../update-log/2026-11-17_task-080-validation.md`](../update-log/2026-11-17_task-080-validation.md).

**Effective date of the 2-Nov-2026 and 3-Nov-2026 entries.** The entries of 2-Nov-2026 that PR #30 carried (MOD-01
RETIRED, MOD-02 and ARC-01 ACTIVE, TASK-016 done, the NB archive state, the new external sessions) took
effect when it merged (2-Nov-2026 12:20 UTC, `32172f5`). The GOV-01 and EX-01 records (then QUEUED,
proposed to the owner on 2-Nov-2026) and the other updates that PR #31 carried took effect when it merged
(2-Nov-2026 14:41 UTC, `c0fb2dd`). The later 2-Nov-2026 entries of this file (the chats started by the
owner, DEC-OPEN-01 answered) took effect when PR #32 merged (2-Nov-2026 19:50 UTC, `703b975`). The 3-Nov-2026
entries (the shortened session ids of GOV-01 and EX-01, the GOV-01 claim and its Guardian pre-check,
DEC-OPEN-34 as a pending owner decision) took effect when PR #33 merged (2-Nov-2026 21:24 UTC, `8aeabfc`). The 17-Nov-2026 entries (the handover to MOD-03, GOV-01 and EX-01 COMPLETED, OPS-01 recorded) take effect when the record that adds them merges. PR #37 (`8278f85`) and PR #38 (`cd4aaa5`) carried them (merged 17-Nov-2026
08:42 and 08:55 UTC). The TASK-080 entries (MOD-02 RETIRED, MOD-03 ACTIVE) take effect when the docs PR of TASK-080 merges.

---

## 1. Chats at a glance

Registry names, in the format `[CHAT-ID] | [WORKSTREAM] | [RESPONSIBILITY] | [STATUS]`:

```text
MOD-01 | Project-Wide | Master Project Moderator                    | RETIRED
MOD-02 | Project-Wide | Master Project Moderator                    | RETIRED
MOD-03 | Project-Wide | Master Project Moderator                    | ACTIVE
ARC-01 | Project-Wide | Codebase Integrity & Integration Guardian   | ACTIVE
NB-01  | NB - New build     | P1 tool risks A1, A3, A4 (TASK-003)         | COMPLETED (archived)
NB-02  | NB - New build     | Five P3 tool and UI follow-ups (TASK-011)   | COMPLETED (archived)
NB-03  | NB - New build     | PowerPoint export design system (TASK-013)  | COMPLETED (archived)
GOV-01 | Playbook GOV - Governance and continuity | Rule documents consistency (TASK-018 widened) | COMPLETED
EX-01  | Playbook EX - Existing dashboard | Full browser acceptance (TASK-064) | COMPLETED (report delivered 2-Nov-2026; its findings are recorded as KNOWN_ISSUES C47 to C50 by the PR of TASK-079; the update log is still to be written)
OPS-01 | Playbook OPS - Monthly data operations | October 2026 update, run A (Reckoner) and read-only preparation of run B | SUPERSEDED
OPS-02 | Playbook OPS - Monthly data operations | October 2026 update (Reckoner run and funds run)          | ACTIVE
NB-04  | NB - New build     | Young-fund rule in the MF bake (TASK-067, D94, D103) | COMPLETED
EX-02  | Playbook EX - Existing dashboard | Look-through code fixes C72, C74 (bundle 2 of D110); C73 later | ACTIVE
```

| ID | Status | Session id | Title in the app | Tasks | Works in | Successor |
|---|---|---|---|---|---|---|
| MOD-01 | RETIRED | `local_11e29451` | Investment Proposal Dashboard architecture | none open (TASK-015 released at the merge of PR #29); 12 completed incl. TASK-015 | main checkout, `main` | MOD-02 |
| MOD-02 | RETIRED (17-Nov-2026) | `local_cecc2f4c` | Investment Proposal Dashboard | none open; done: TASK-016, TASK-079 (the handover, PRs #37 and #38); TASK-018 (GOV-01; merged 9-Nov-2026 as PR #35) | main checkout, `main` | MOD-03 |
| MOD-03 | ACTIVE (from 17-Nov-2026) | `local_ce891716` (another Claude account than MOD-02) | File path reference | TASK-080 (done); the open tasks of [TASK_REGISTER.md](TASK_REGISTER.md) | main checkout, `main` | none |
| ARC-01 | ACTIVE | none (subagent `integration-guardian`) | none | Gate B reviews; first review 2-Nov-2026 (TASK-015, GO WITH CONDITIONS); contract pre-check of TASK-018 3-Nov-2026 (GO WITH CONDITIONS, C1-C9); DIFF REVIEW (head `28e1d4e`) and DELTA REVIEW (`29e0d32`) of the TASK-018 branch 9-Nov-2026 (GO WITH CONDITIONS) | read-only | none |
| NB-01 | COMPLETED (archived) | `local_d2d575b3` | Fix the three P1 tool risks before the next refresh | TASK-003 | worktree `focused-wright-d50bee` | none |
| NB-02 | COMPLETED (archived) | `local_1f914af1` | Small tool and UI follow-ups from the 19-Oct fixes | TASK-011 | worktree `adoring-boyd-7028f6` (the app reuses the folder for OPS-01 since 9-Nov-2026) | none |
| NB-03 | COMPLETED (archived) | `local_00b57be9` | Fix and standardise the proposal PowerPoint export | TASK-013 | main checkout (no worktree) | none |
| GOV-01 | COMPLETED (9-Nov-2026) | `local_622b2ebd`; session ids of sub-chats are recorded shortened to 8 characters (SEC-05, DEC-OPEN-29) | GOV-01 Playbook: rule documents consistency | TASK-018 (widened): merged as PR #35 (`ddd0304`, 9-Nov-2026 12:16 UTC); claim released at the merge (ACTIVE_CHANGE_REGISTER section 4); Guardian reviews GO WITH CONDITIONS, conditions met | worktree `focused-wright-d50bee` (the folder that was NB-01 worktree; idle, not retired: on the merged task branch `docs/gov-01-rule-consistency-20261102` at `29e0d32`, clean; app session branch `claude/affectionate-lovelace-f11b67` at `c0fb2dd`, 0 commits; TASK-061 must skip the folder until the owner decides DEC-OPEN-22) | none |
| EX-01 | COMPLETED (report delivered 2-Nov-2026; record in the repository pending) | `local_4a9736cd`; session ids of sub-chats are recorded shortened to 8 characters (SEC-05, DEC-OPEN-29) | EX-01 Playbook: browser acceptance | TASK-064: 11 of 11 checks PASS on the live S7 build at `c0fb2dd`; four new findings EX01-N1 to EX01-N4 (P3; recorded as KNOWN_ISSUES C47 to C50 by this PR, mapping INFERRED); the full report is local only | shared main checkout (no worktree); read-only, no branch, no commit | none |
| OPS-01 | SUPERSEDED (18-Nov-2026, by OPS-02: the owner chose a new chat in MOD-03's account; not running since 9-Nov-2026 21:49 UTC) | `local_ab19558f`; session ids of sub-chats are recorded shortened to 8 characters (SEC-05, DEC-OPEN-29) | OPS-01 October update: Reckoner run | TASK-020 (steps 14, 14a, 15, 17: dry runs only, stopped at gates), TASK-021 and TASK-024 (read-only preparation); no claim | worktree `adoring-boyd-7028f6` (the folder that was NB-02 worktree, reused by the app; app session branch `claude/ops-01-reckoner-a11e94` and task branch `data/2026-09-4`, both at `ddd0304`, local only, 0 commits; TASK-061 must skip it) | OPS-02 |
| OPS-02 | ACTIVE (20-Nov-2026: the October analytics (PR #52), Reckoner (PR #54) and MF cycle (PR #57) merged; the November Market Update slides merged (PR #60); the November Reckoner run (PR #63) and the "Other Funds Analytics" hybrid refresh (PR #65, D109) merged; bundle 1 of the follow-up fixes merged (PR #68, D110); TASK-088 (PR #72) and TASK-090 (PR #76, D116/D117) merged; preparing TASK-091A/B; no claim) | `local_61c7130f` | OPS-02 October 2026 update: preparation | TASK-020 (Reckoner run), TASK-029 (labels), read-only preparation of TASK-021 and TASK-024 | worktree `.claude/worktrees/investment-proposal-dashboard-c68580` (the app reused the unused folder; app branch `claude/ops-02-october-prep-55402a`, at `91d11cd`); branch `data/2026-10-analytics` merged (PR #52); branches `data/2026-10-analytics` (PR #52) and `data/2026-09-5` (PR #54) merged | none |
| NB-04 | COMPLETED (18-Nov-2026: PR #47 merged, `44590d4`; holds nothing) | `local_20daef41` | NB-04 Young-fund rule in the MF bake (D94) | TASK-067 (and TASK-023 through the October bake) | worktree `.claude/worktrees/competent-neumann-0880fa` (app branch `claude/competent-neumann-0880fa`, cut from `a3dce51`); task branch `feat/task-067-young-fund-rule` (merged as PR #47) | none |
| EX-02 | ACTIVE (from 22-Nov-2026; TASK-086 (PR #70) and TASK-087 (PR #74) and TASK-089 (PR #78, D118) merged; no claim) | `local_e9d4d1cf` | EX-02 Look-through code fixes (C72, C74) | bundle 2 of D110 (C72 FoF strict matching with owner pins; C74 non-stock rows out of the equity top-20); bundle 3 (C73) later, after the arbitrage rule | its own worktree (app-created, started by MOD-03 on 22-Nov-2026 at the owner's "Approve all"); task branch `fix/lookthrough-fof-nonstock` planned | none |

Workstreams (prefixes): **EX** existing dashboard, **NB** new build, **OPS** monthly data operations,
**GOV** governance and continuity. EX-01 and GOV-01 were started by the owner on 2-Nov-2026; OPS-01 was started by MOD-02 on 9-Nov-2026 (before that no OPS
chat had started: the data runs were done by MOD-01 itself). Sessions of the
sister Portfolio Review Dashboard project are in section 4, not here (Update 2-Nov-2026: two of them
carry titles that start with `ARC-01` and `EX-01`; they are not this project's chats).

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

A bracketed qualifier such as (archived) after a status records the state of the session in the app; it
is not a status.

---

## 3. Chat records

### MOD-01 | Project-Wide | Master Project Moderator | RETIRED

| Field | Value |
|---|---|
| Session id | `local_11e29451` |
| Title in the app | Investment Proposal Dashboard architecture |
| Started | 15-Oct-2026 14:36 UTC, by the owner (the first master project prompt) |
| Model and settings | claude-opus-5-5, effort xhigh, permission mode auto |
| Responsibility | Moderator since 15-Oct-2026. Did Stage A (replication, sanitised GitHub transfer, Pages publish behind a parity gate, baseline docs), the 16-19-Oct tool and page fixes, the Sep-2026 data runs, the outgoing-owner export prompt and its ingestion, and orchestrated NB-01..NB-03. Now produces the handover package. Update 2-Nov-2026: the package was merged (PR #29) and MOD-01 is retired. |
| Status | RETIRED on 2-Nov-2026. All three retirement conditions are met: (1) the branch `handover/mod-01-to-mod-02-20261028` is merged (PR #29, merge `f5c2431`, 30-Oct-2026 07:46:59 UTC, VERIFIED `gh pr view 29`); (2) MOD-02 completed TASK-016 and confirms the handover in writing: the package is usable; the deviations and findings are recorded in `docs/update-log/2026-11-02_task-016-validation.md` and `INTEGRATION_AND_REGRESSION_LOG.md` section 11; (3) the TASK-015 claim is released (`ACTIVE_CHANGE_REGISTER.md` section 4). History: HANDOVER REQUIRED from 27-Oct-2026 15:25 UTC (the owner's handover master prompt; re-issued byte-identical on 28-Oct-2026 05:33 UTC) until this retirement. MOD-01 makes no code change at all and no repository change after the merge; a gap MOD-02 finds is fixed by MOD-02. |
| Assigned tasks | none open. Completed: TASK-001, 002, 004-010, 012, 014 and TASK-015 (PR #29). |
| Working directory and branch | The main checkout `%USERPROFILE%\OneDrive - CENTRICITY FINANCIAL DISTRIBUTION PRIVATE LIMITED\Desktop\Claude Code-Investment Proposal Dashboard`, on `main` (not switched). The package is committed to `handover/mod-01-to-mod-02-20261028`, created from `2b2a397` without a checkout (temporary-index commit). |
| Reserved files and shared components | The TASK-015 claim: `docs/handover/**`, `docs/project-control/**`, `docs/KNOWN_ISSUES.md`, `.claude/agents/integration-guardian.md`, `CLAUDE.md`, `docs/README.md`, `CHANGELOG.md`, `docs/PROJECT_STATE.md`. Released at the merge. |
| Dependencies | none |
| Last known commit and deliverable | PR #29 `f5c2431` (30-Oct-2026 07:46:59 UTC): the handover package. Session last active 30-Oct-2026 07:50:58 UTC; not running; not archived (VERIFIED `list_sessions`, 2-Nov-2026). Before it: `2b2a397` = PR #28 merge (27-Oct-2026 12:27 UTC), ingestion of the outgoing owner's 23-Oct export, docs only. PRs by MOD-01: #1-#3, #7-#18, #24, #25, #28, #29. |
| Pending owner decisions | On 28-Oct-2026: MOD-01's last question is unanswered: "Should I rebuild the risk-ratio and NAV workbook tools in-house?" (27-Oct-2026 12:28 UTC) = DEC-OPEN-01 (KNOWN_ISSUES B8). Every open decision, DEC-OPEN-01..DEC-OPEN-28, passes to MOD-02 ([DECISION_LOG.md](DECISION_LOG.md)). Update 2-Nov-2026: DEC-OPEN-02 and DEC-OPEN-03 are answered (D84, D85) and DEC-OPEN-29 exists; see the MOD-02 record. |
| Current blocker | none |
| Context state | 2 automatic context compactions: 19-Oct-2026 06:28:17 UTC and 27-Oct-2026 12:24:37 UTC. The 28-Oct transcript starts from a copy of the 27-Oct summary (same timestamp); that is not a third compaction. Detail from 15-19-Oct survives only in summaries and transcripts. |
| Transcripts | `7628c9ae-33a1-4ba1-a4d9-bca35a44a511.jsonl` (15-Oct-2026 14:36 UTC to 28-Oct-2026 05:30 UTC; it ends with an authentication failure) and `df00b5b0-8ce0-402b-9cbd-9bfedd047f08.jsonl` (from 28-Oct-2026 05:33 UTC) |
| Current handover document | [MASTER_HANDOVER_2026-10-28_v1.md](../handover/MASTER_HANDOVER_2026-10-28_v1.md) and the successor prompt [MOD-01_TO_MOD-02_SUCCESSOR_PROMPT_2026-10-28.md](../handover/continuations/MOD-01_TO_MOD-02_SUCCESSOR_PROMPT_2026-10-28.md) |
| Successor | MOD-02 |
| Retirement reason | The owner ordered a new Moderator and the Moderator / Guardian multi-chat model with project-control registers (master prompt sections 1, 7 and 14-16). Proactive handover is preferred because MOD-01 has been compacted twice. The three-compaction trigger is **not** met and is not the reason. Retired on 2-Nov-2026 after TASK-016. |

### MOD-02 | Project-Wide | Master Project Moderator | RETIRED

**Update 17-Nov-2026 (MOD-03, TASK-080).** RETIRED from the merge of the TASK-080 docs PR. Reason: replaced on the owner's
instruction of 17-Nov-2026 after four automatic compactions; successor MOD-03. The retirement conditions are met: the
handover branch merged (PR #37 `8278f85`, repaired by PR #38 `cd4aaa5`); MOD-03 validated the package and confirms it in
writing ([`../update-log/2026-11-17_task-080-validation.md`](../update-log/2026-11-17_task-080-validation.md)); no claim was
held. MOD-02 makes no further change. The fields below are its record as of the handover.

| Field | Value |
|---|---|
| Session id | `local_cecc2f4c` (VERIFIED `get_session self`) |
| Title in the app | Investment Proposal Dashboard (as the app shows it, VERIFIED `get_session self`). In the desktop app a session can be renamed (`set_session_title`), but the app asks the owner first when the owner chose the title; do not rename without asking. |
| How it starts | Started 2-Nov-2026 07:43:23 UTC by the owner in a new chat on the main checkout (Code tab) with the successor prompt ([MOD-01_TO_MOD-02_SUCCESSOR_PROMPT_2026-10-28.md](../handover/continuations/MOD-01_TO_MOD-02_SUCCESSOR_PROMPT_2026-10-28.md)). |
| Responsibility | The owner's primary contact. Validates the package; coordinates EX, NB, OPS and GOV; decomposes requirements into tasks and assigns them; grants and records file claims; keeps the registers; consults ARC-01; runs Gate D (merge = publish) and docs-only changes itself; manages the handover of sub-chats and of itself. |
| Status | HANDOVER REQUIRED since 17-Nov-2026: the owner pasted the handover master prompt on 17-Nov-2026 at 06:27 UTC (trigger: the Moderator itself must be replaced; MOD-02 has also had four automatic compactions, see Context state, so the three-compaction trigger of the continuations README section 1 is met too). ACTIVE from 2-Nov-2026 to that instruction. It does only handover work from now on: no new task, no code change. Model and settings: claude-sonnet-5-5, effort max, permission mode auto (VERIFIED `get_session self`, 17-Nov-2026); MOD-01 ran on claude-opus-5-5, effort xhigh (the model is the choice of the owner). |
| Context state | 4 automatic context compactions, distinct `compact_boundary` timestamps in the transcript (VERIFIED 17-Nov-2026): 2-Nov-2026 11:22:16 UTC, 2-Nov-2026 19:14:48 UTC, 9-Nov-2026 07:36:47 UTC and 17-Nov-2026 06:28:46 UTC. The handover master prompt was pasted at 06:27:07 UTC on 17-Nov-2026. Detail from 2-Nov to 17-Nov survives only in summaries and in the transcript. |
| Transcript | `56ada2dd...jsonl` (file name shortened to 8 characters) under `%USERPROFILE%\.claude\projects\<project slug>\`, from 2-Nov-2026 07:43 UTC |
| Assigned tasks | Now only the handover to MOD-03 (HANDOVER REQUIRED). Done: TASK-016 (VERIFIED COMPLETE 2-Nov-2026) and the records PRs #31 to #34 and #36. Started by MOD-02 and finished or idle: TASK-018 (GOV-01; merged as PR #35, 9-Nov-2026), TASK-064 (EX-01; report delivered 2-Nov-2026; findings recorded as C47 to C50 by the PR of TASK-079), TASK-020, TASK-021 and TASK-024 (OPS-01; dry runs only, BLOCKED). Passing to MOD-03 with everything else open in [TASK_REGISTER.md](TASK_REGISTER.md): among them the TASK-017 record (the checks passed on 17-Nov-2026, see Current blocker), TASK-074, TASK-071, TASK-070, TASK-036, TASK-037, TASK-054, TASK-056, TASK-059 to TASK-063, and the owner TASK-019, 032, 033, 034 and 073. |
| Working directory and branch | The main checkout on `main`. It never leaves it on another branch and never runs `git checkout`, `git switch`, `git merge` or `git pull` there (KNOWN_ISSUES R6; `CLAUDE.md` "Project control"). The worktree `.claude/worktrees/investment-proposal-dashboard-c68580` (detached at `f5c2431`; unused) is VERIFIED to have been created by the desktop app (its admin folder holds the app's `claude-desktop-worktree` marker file, as the NB worktrees' folders do); that it was made for this chat is INFERRED (its name is this chat's title and it was created minutes before this chat); this chat does not use it (`REPOSITORY_AND_ENVIRONMENT_STATE.md` section 19). VERIFIED 17-Nov-2026: the checkout is on `main` = `origin/main` = `b47069b`, clean (0 ahead, 0 behind); the unused worktree is still detached at `f5c2431`, clean. |
| Reserved files and shared components | Since the merge of PR #30: the Moderator-owned group (`docs/project-control/**`, `docs/handover/**`; see FILE_OWNERSHIP_AND_CHANGE_CONTROL section 3). The five of those files that the TASK-018 claim granted to GOV-01 returned to the Moderator when PR #35 merged (9-Nov-2026 12:16 UTC). No claim is active (ACTIVE_CHANGE_REGISTER section 1, 17-Nov-2026). At the handover the group passes to MOD-03; MOD-02 edits it only for the handover itself. |
| Dependencies | TASK-015 merged (the package on `main`). |
| Last known commit and deliverable | PR #36 (`b47069b`, merged 17-Nov-2026 06:37:48 UTC; docs only: D89 to D96 and the answers to DEC-OPEN-07, -08, -30, -31 and -32; push run 44032631708 verify + publish success; the 7 published files equal `site/`, VERIFIED 17-Nov-2026). Before it: PR #34 (`3fd1eab`, D87 and D88), PR #33 (`8aeabfc`, the GOV-01 claim record), PR #32 (`703b975`, D86), PR #31 (`c0fb2dd`) and TASK-016 as PR #30 (`32172f5`): validation record `docs/update-log/2026-11-02_task-016-validation.md`. MOD-02 opened PRs #30 to #34 and #36; PR #35 is GOV-01. |
| Pending owner decisions | Answered since 2-Nov-2026: DEC-OPEN-01, -02 and -03 (D86, D84, D85; 2-Nov-2026); DEC-OPEN-34 (D87) and the owner yes to the operator-run Gate B in every monthly refresh (D88), both 9-Nov-2026, whose recorded wording the owner has still to confirm; DEC-OPEN-07, -08, -30, -31 and -32 (D94, D96, D92, D93 and a note on D86; 9-Nov-2026, recorded by PR #36 on 17-Nov-2026). Open: 27 (DECISION_LOG section 1.3; DEC-OPEN-35 and -36 are new). Needed first for the October update: DEC-OPEN-11 (four desk labels, before TASK-020 steps 14 and 14a), DEC-OPEN-04 (the PMS date label; D95 names the Reckoner as the source), DEC-OPEN-33 (the provisional data pack; at run time) and the decisions at the Reckoner gates that OPS-01 holds (see its record); later DEC-OPEN-05, -09 and -10. The order to ask is in DECISION_LOG section 1.2. |
| Current blocker | none for the handover itself. History of the conditions on work: the ARC-01 condition of 2-Nov-2026 (no `/monthly-update`, no tool `--apply` and no OPS or NB sub-chat before the widened TASK-018 PR merges) was lifted when PR #35 merged on 9-Nov-2026 (C9 VERIFIED 17-Nov-2026: local `main` = `origin/main`; empty diff of `CLAUDE.md`, `.claude` and `docs`). TASK-017 (a run on the real `site/` and any tool `--apply`): its checks were met when re-run on 17-Nov-2026 (OneDrive.exe running; folder pinned; 0 of 923 `.git` files cloud-only; `git fsck --connectivity-only` exit 0; a read from the pack `pack-631ec788...` succeeds); the PR of TASK-079 records the pass in `docs/PROJECT_STATE.md`, so the ban of `CLAUDE.md` "Project control" (no checkout, switch, merge or pull in the main checkout) applies from its merge only while OneDrive is not running or a `.git` file is cloud-only. |
| Current handover document | [MASTER_HANDOVER_2026-11-17_v2.md](../handover/MASTER_HANDOVER_2026-11-17_v2.md) and the successor prompt [MOD-02_TO_MOD-03_SUCCESSOR_PROMPT_2026-11-17.md](../handover/continuations/MOD-02_TO_MOD-03_SUCCESSOR_PROMPT_2026-11-17.md), both written on 17-Nov-2026. The package of the previous handover, [MASTER_HANDOVER_2026-10-28_v1.md](../handover/MASTER_HANDOVER_2026-10-28_v1.md), is a historical snapshot. |
| Successor | MOD-03 (ACTIVE from 17-Nov-2026) |
| Retirement reason | Replaced on the owner's instruction of 17-Nov-2026 after four automatic compactions; successor MOD-03. RETIRED at the merge of the TASK-080 docs PR, after MOD-03 validated the handover (continuations README section 9). |

### MOD-03 | Project-Wide | Master Project Moderator | ACTIVE

| Field | Value |
|---|---|
| Session id | `local_ce891716` (VERIFIED `get_session self`, 17-Nov-2026). It runs in a different Claude account from MOD-02, OPS-01, EX-01 and GOV-01, so their sessions are not visible to it and it cannot message them (`SendMessage`); the owner relays where needed. |
| Title in the app | File path reference (set by the app, VERIFIED `get_session self`; not renamed: the owner may rename it) |
| How it starts | Started 17-Nov-2026 14:22:10 UTC by the owner in a new chat on the main checkout (Code tab), with the successor prompt [MOD-02_TO_MOD-03_SUCCESSOR_PROMPT_2026-11-17.md](../handover/continuations/MOD-02_TO_MOD-03_SUCCESSOR_PROMPT_2026-11-17.md) and MOD-02's note of 17-Nov-2026 on top (the local file `01_PASTE_THIS_INTO_THE_NEW_CHAT.md`, version 2.1). |
| Responsibility | As MOD-02: the primary contact of the owner; coordinates EX, NB, OPS and GOV; decomposes requirements into tasks and assigns them; grants and records file claims; keeps the registers; consults ARC-01; runs Gate D (merge = publish) and docs-only changes itself; manages the handover of sub-chats and of itself. |
| Status | ACTIVE from the merge of the TASK-080 docs PR (17-Nov-2026), after it validated the handover ([`../update-log/2026-11-17_task-080-validation.md`](../update-log/2026-11-17_task-080-validation.md)). QUEUED from 17-Nov-2026 (defined by MOD-02) until then. Model and settings: claude-opus-5-5, effort high, permission mode auto (VERIFIED `get_session self`). |
| Context state | 0 compactions (17-Nov-2026). |
| Assigned tasks | TASK-080 (VERIFIED COMPLETE at the merge of its docs PR). Next: the owner's decisions in the order of DECISION_LOG section 1.2 (DEC-OPEN-35 answered 17-Nov-2026: D97; DEC-OPEN-36 next), TASK-081, the October update (who runs it, OPS-01 in the old account or OPS-02 here, is the owner's choice), then the rest of [TASK_REGISTER.md](TASK_REGISTER.md). |
| Working directory and branch | The main checkout on `main`; it never leaves it. The ban on `git checkout`, `git switch`, `git merge` and `git pull` there applies whenever OneDrive is not running or any `.git` file is cloud-only (`CLAUDE.md` "Project control"; 17-Nov-2026: running, 0 of 988 cloud-only). |
| Reserved files and shared components | The Moderator-owned group (`docs/project-control/**`, `docs/handover/**`). No file claim is active. |
| Dependencies | The MOD-02 -> MOD-03 handover merged: PR #37 (`8278f85`) and PR #38 (`cd4aaa5`). |
| Last known commit and deliverable | the TASK-080 docs PR (validation record and these register updates). |
| Pending owner decisions | The open decisions of DECISION_LOG section 1.3, in the order of its section 1.2 (DEC-OPEN-35 was answered on 17-Nov-2026: D97 keeps the recorded publish rules; DEC-OPEN-36 is next); the owner's confirmation of the recorded wording of D87 to D96; the Regular and SIF re-exports as on 31-Oct-2026; whether OPS-01 carries on in the old account or OPS-02 starts here. |
| Current blocker | none for coordination; the October update waits for the owner (above). |
| Current handover document | [MASTER_HANDOVER_2026-11-17_v2.md](../handover/MASTER_HANDOVER_2026-11-17_v2.md) and the successor prompt [MOD-02_TO_MOD-03_SUCCESSOR_PROMPT_2026-11-17.md](../handover/continuations/MOD-02_TO_MOD-03_SUCCESSOR_PROMPT_2026-11-17.md) |
| Successor | none |
| Retirement reason | not applicable |

### ARC-01 | Project-Wide | Codebase Integrity & Integration Guardian | ACTIVE

| Field | Value |
|---|---|
| Session id | None. ARC-01 is the subagent defined in [`.claude/agents/integration-guardian.md`](../../.claude/agents/integration-guardian.md) (created by TASK-015) and invoked by the Moderator. For a long review the Moderator may run it as its own session; that session's id is then recorded here. Since 9-Nov-2026 (D88) the refresh operator of a monthly refresh also invokes it for the Gate B DIFF REVIEW of that refresh (an operator-run review, weaker than one run by the Moderator). |
| Title in the app | none (not a chat) |
| Responsibility | The independent technical control layer. Reviews change-impact contracts before material or high-risk work (Gate B pre-check) and the actual diffs after (Gate B): affected files, downstream consumers, ripple effects, conflicts with active claims, interface and schema compatibility, duplicated business logic, required regression tests, documentation and recovery risk. Reports to the Moderator. Read-only tools (Read, Grep, Glob, Bash). Never implements features and never makes product decisions. |
| Status | ACTIVE since 2-Nov-2026: first successful invocation (DIFF REVIEW of TASK-015, in the 2-Nov-2026 validation workflow): the definition loaded in a session started after the merge (VERIFIED, supports the earlier INFERRED statement); verdict GO WITH CONDITIONS, risk MEDIUM. |
| Assigned tasks | Gate B for every material change (triggers: FILE_OWNERSHIP_AND_CHANGE_CONTROL section 7). First use (done 2-Nov-2026): the DIFF REVIEW of TASK-015 within MOD-02's TASK-016 validation. Further uses (done 3-Nov-2026): the pre-check of GOV-01's TASK-018 contract (GO WITH CONDITIONS, C1-C9; see `ACTIVE_CHANGE_REGISTER.md` section 2) and the DIFF REVIEW of this claim record (GO WITH CONDITIONS on its first version; conditions applied); done 9-Nov-2026: the DIFF REVIEW of the TASK-018 branch (head `28e1d4e`; GO WITH CONDITIONS, risk MEDIUM) and the DELTA REVIEW of `29e0d32` (GO WITH CONDITIONS, no BLOCKER, no MAJOR finding), both quoted in the PR #35 description. Still open from them: finding 2 (`.claude/agents/qa-verifier.md` line 24 still says "SHA-256 of all six"; outside the claim) and the PR-number placeholders that the register sweep fills in. From the merge on, the refresh operator runs the Gate B of a monthly refresh (D88). |
| Working directory and branch | Read-only. It reads whichever checkout or worktree the Moderator points it at. |
| Reserved files and shared components | none (it does not write) |
| Durable memory | A subagent keeps no memory between calls. Its knowledge lives in [CODEBASE_GUARDIAN_HANDOVER_2026-10-28_v1.md](../handover/CODEBASE_GUARDIAN_HANDOVER_2026-10-28_v1.md), [ARCHITECTURE_AND_DEPENDENCY_MAP.md](ARCHITECTURE_AND_DEPENDENCY_MAP.md), [INTERFACE_CONTRACTS.md](INTERFACE_CONTRACTS.md), [ACTIVE_CHANGE_REGISTER.md](ACTIVE_CHANGE_REGISTER.md), [INTEGRATION_AND_REGRESSION_LOG.md](INTEGRATION_AND_REGRESSION_LOG.md) and [KNOWN_ISSUES_AND_REGRESSION_RISKS.md](KNOWN_ISSUES_AND_REGRESSION_RISKS.md). The Moderator keeps them current after each review. |
| Dependencies | TASK-015 merged |
| Last known commit and deliverable | ARC-01 DIFF REVIEW (branch head `28e1d4e`) and DELTA REVIEW (`29e0d32`) of the TASK-018 branch, 9-Nov-2026 (both GO WITH CONDITIONS; conditions met; PR #35 description); before them: ARC-01 pre-check of the TASK-018 contract and DIFF REVIEW of this claim record, 3-Nov-2026 (both GO WITH CONDITIONS; the pre-check conditions C1-C9 are in `ACTIVE_CHANGE_REGISTER.md` section 2); before them, the ARC-01 report of 2-Nov-2026 (summary in `INTEGRATION_AND_REGRESSION_LOG.md` section 11; findings and conditions in `docs/update-log/2026-11-02_task-016-validation.md`) |
| Pending owner decisions | none |
| Current blocker | none |
| Current handover document | [CODEBASE_GUARDIAN_HANDOVER_2026-10-28_v1.md](../handover/CODEBASE_GUARDIAN_HANDOVER_2026-10-28_v1.md) |
| Successor | none. A replacement long-running Guardian session would be ARC-02, through a handover. |
| Retirement reason | not applicable |

### NB-01 | NB - New build | P1 tool risks A1, A3, A4 (TASK-003) | COMPLETED

| Field | Value |
|---|---|
| Session id | `local_d2d575b3` |
| Title in the app | Fix the three P1 tool risks before the next refresh |
| Started | 16-Oct-2026 13:09 UTC. Proposed by MOD-01; the owner started it by clicking the proposal card. |
| Responsibility | Fix KNOWN_ISSUES A1 (Bond List tool read the first sheet and assumed the desk), A3 (look-through tool re-dated the MF analytics), A4 (Reckoner merge had no gate against dropped funds). |
| Status | COMPLETED. Last activity 16-Oct-2026 13:48 UTC; not running and not archived on 28-Oct-2026. Archived on or before 2-Nov-2026 (`list_sessions` shows isArchived true; that the owner did it is INFERRED). |
| Assigned tasks | TASK-003 (VERIFIED COMPLETE) |
| Working directory and branch | Worktree `.claude/worktrees/focused-wright-d50bee` (desktop-app session branch `claude/focused-wright-d50bee`, local only, merged). The worktree now sits on `fix/reckoner-drop-gates` at `fe060d5`, clean, 50 commits behind `main` (VERIFIED `git worktree list`, 28-Oct-2026). Since 2-Nov-2026 13:32:29 IST (08:02:29 UTC) the worktree shows a detached HEAD at its commit (the app released the branch when the session was archived; INFERRED from the timing); the branches still exist and no work was lost. Since 2-Nov-2026 the app reuses this worktree folder for GOV-01 (session branch `claude/affectionate-lovelace-f11b67`): see GOV-01's record; TASK-061 must skip it. |
| Reserved files and shared components | none (released at the merge of PR #6) |
| Dependencies | none |
| Last known commit and deliverable | PR #4 `1e4b2fc` (A1), PR #5 `4fbbad6` (A3; D70), PR #6 `c93e55c` (A4; D71), all merged on 16-Oct-2026 |
| Pending owner decisions | none |
| Current blocker | none |
| Current handover document | None: it finished its task without a handover. Its brief is the first message of its transcript. |
| Successor | none |
| Retirement reason | Not retired: its work is complete. Recommendation: give it no new work (its worktree is far behind `main` and its context dates from 16-Oct); start a new chat (next free NB-04) instead. |
| Transcript | `...--claude-worktrees-focused-wright-d50bee\acab20e6-cc42-45e8-aa66-822445bfe65d.jsonl` under `%USERPROFILE%\.claude\projects\` |
| Clean-up | The worktree, its local branches (`fix/reckoner-drop-gates`, `claude/focused-wright-d50bee`) and the merged branches on origin remain. They hold no unique work and can be removed with the owner's agreement (but the worktree folder has been GOV-01's since 2-Nov-2026: TASK-061 must skip it): worktree TASK-061, local branches TASK-060, origin branches TASK-059 (all under DEC-OPEN-22). Archiving the session in the app is optional owner housekeeping. (Done: the session is archived, on or before 2-Nov-2026.) |
| Lesson | On 19-Oct-2026 MOD-01 found that its own uncommitted work fixed the same A1/A3/A4 issues and wanted the same decision numbers (D70, D71) that NB-01 had already merged on 16-Oct; the overlap had to be merged by hand, file by file (memory note `fetch-before-branching`, VERIFIED as written there). This is why file claims and ID numbers are now allocated by the Moderator only. |

### NB-02 | NB - New build | Five P3 tool and UI follow-ups (TASK-011) | COMPLETED

| Field | Value |
|---|---|
| Session id | `local_1f914af1` |
| Title in the app | Small tool and UI follow-ups from the 19-Oct fixes |
| Started | 21-Oct-2026; its brief arrived 05:51 UTC. Proposed by MOD-01; started by the owner accepting the card (INFERRED: the act is visible only in the transcript). |
| Responsibility | Five P3 follow-ups: every tool exits 2 on a missing input (D72), OneDrive rename retry (R6), C17 matrix footnote, C18 Select popover dagger, A27 `rehearse.js --old-site`. |
| Status | COMPLETED. Last activity 21-Oct-2026 06:44 UTC; not running and not archived on 28-Oct-2026. Archived on or before 2-Nov-2026 (`list_sessions` shows isArchived true; that the owner did it is INFERRED). |
| Assigned tasks | TASK-011 (VERIFIED COMPLETE) |
| Working directory and branch | Worktree `.claude/worktrees/adoring-boyd-7028f6` (desktop-app session branch `claude/adoring-boyd-7028f6`, local only, merged). The worktree now sits on `fix/a27-rehearse-old-site` at `18abff3`, clean apart from the ignored `node_modules/`, 12 commits behind `main` (VERIFIED, 28-Oct-2026). Since 2-Nov-2026 13:32:29 IST (08:02:29 UTC) the worktree shows a detached HEAD at its commit (the app released the branch when the session was archived; INFERRED from the timing); the branches still exist and no work was lost. Since 9-Nov-2026 the app reuses this worktree folder for OPS-01 (task branch `data/2026-09-4`, app session branch `claude/ops-01-reckoner-a11e94`): see the OPS-01 record; TASK-061 must skip it. |
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
| Session id | `local_00b57be9` |
| Title in the app | Fix and standardise the proposal PowerPoint export |
| Started | 22-Oct-2026 14:31 UTC. Proposed by MOD-01; the owner chose "New session" at 14:30 UTC. |
| Responsibility | The PowerPoint export design system: measured layout, continuation slides, page numbers, `*` marker on expected returns (D82, D83). |
| Status | COMPLETED. Last activity 22-Oct-2026 15:41 UTC; not running and not archived on 28-Oct-2026. Archived on or before 2-Nov-2026 (`list_sessions` shows isArchived true; that the owner did it is INFERRED). |
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

### GOV-01 | Playbook GOV - Governance and continuity | Rule documents consistency (TASK-018 widened) | COMPLETED

| Field | Value |
|---|---|
| Session id | `local_622b2ebd`; session ids of sub-chats are recorded shortened to 8 characters (SEC-05, DEC-OPEN-29) |
| Title in the app | GOV-01 Playbook: rule documents consistency (as proposed by MOD-02; started by the owner on 2-Nov-2026) |
| How it starts | Started by the owner on 2-Nov-2026 (MOD-02 had proposed the card to the owner that day). VERIFIED `get_session` 17-Nov-2026: created 2-Nov-2026 15:17:57 UTC, parent session MOD-02, model claude-sonnet-5-5, effort max, permission mode auto. |
| Responsibility | Make the rule documents consistent: TASK-018, widened (KNOWN_ISSUES E6-E15, E17; ARC-01 conditions). |
| Status | COMPLETED on 9-Nov-2026: TASK-018 merged as PR #35 (`ddd0304`, 12:16:05 UTC); the claim was released at the merge (ACTIVE_CHANGE_REGISTER section 4). Session last active 9-Nov-2026 12:20 UTC; not running; not archived (VERIFIED `list_sessions`, 17-Nov-2026). The worktree is idle, not retired. Open follow-ups, none of them GOV-01: ARC-01 finding 2 (`.claude/agents/qa-verifier.md` line 24), the PR-number placeholders and the register sweep (Moderator), and the owner confirmation of the recorded wording of D87 and D88 at Gate E. |
| Assigned tasks | TASK-018 (widened): merged. Risk class Material (rule documents); gates A to D done; Gate E: the final text after D87 and D88, the owner confirmation of their recorded wording pending. |
| Working directory and branch | Its own worktree `.claude/worktrees/focused-wright-d50bee`, the folder that was NB-01 worktree (the app reused it for GOV-01); never the shared main checkout. VERIFIED 17-Nov-2026: the worktree is on the task branch `docs/gov-01-rule-consistency-20261102` at `29e0d32` (the PR head; merged; also on origin), clean; the app session branch `claude/affectionate-lovelace-f11b67` is at `c0fb2dd` with 0 commits. TASK-061 (worktree clean-up) must still skip this folder until the owner decides DEC-OPEN-22. |
| Reserved files and shared components | none. The TASK-018 claim (23 files) was released at the merge of PR #35. |
| Dependencies | Moderator: MOD-02. Guardian: ARC-01, called by MOD-02 for the contract pre-check and the DIFF REVIEW (done: pre-check 3-Nov-2026; DIFF REVIEW and DELTA REVIEW 9-Nov-2026, both GO WITH CONDITIONS). |
| Last known commit and deliverable | PR #35 (`ddd0304`, merged 9-Nov-2026 12:16:05 UTC; head `29e0d32`, base `3fd1eab`; 23 files, +709/-285; docs only; push run 42615584473 success). The PR description holds the contract copy, the Gate C evidence and the Guardian verdicts. |
| Pending owner decisions | none held. DEC-OPEN-34 was answered on 9-Nov-2026 (D87) and the owner yes to the operator-run Gate B was given the same day (D88); the owner has still to confirm the recorded wording of both (a task of the Moderator). |
| Current blocker | none |
| Current handover document | none: it finished its task without a handover. Its brief is the first message of its transcript (`4b1e7917...jsonl` in the project folder of its worktree under `%USERPROFILE%\.claude\projects\`; VERIFIED: it starts with the GOV-01 launch packet). |
| Successor | none |
| Retirement reason | Not retired: its work is complete. Same recommendation as NB-01: no new work (start a new chat with the next free GOV number, GOV-02). |

### EX-01 | Playbook EX - Existing dashboard | Full browser acceptance (TASK-064) | COMPLETED

| Field | Value |
|---|---|
| Session id | `local_4a9736cd`; session ids of sub-chats are recorded shortened to 8 characters (SEC-05, DEC-OPEN-29) |
| Title in the app | EX-01 Playbook: browser acceptance (as proposed by MOD-02; started by the owner on 2-Nov-2026) |
| How it starts | Started by the owner on 2-Nov-2026 (MOD-02 had proposed the card to the owner that day). VERIFIED `get_session` 17-Nov-2026: created 2-Nov-2026 15:17:56 UTC, parent session MOD-02, model claude-sonnet-5-5, effort max, permission mode auto. |
| Responsibility | Full browser acceptance pass on the current build (TASK-064). Read-only: it reports its results to MOD-02, who records them. |
| Status | COMPLETED: it ran the pass on 2-Nov-2026 (15:19-16:13 UTC) and delivered its report; last activity 2-Nov-2026 16:19 UTC; not running; not archived (VERIFIED `list_sessions`, 17-Nov-2026). Recording the result in the repository is still to be done by the Moderator (see Result). |
| Result | The report is local only (`_testdata/acceptance-2026-11/EX-01_ACCEPTANCE_REPORT.md`, git-ignored; its files are listed in `MANIFEST.txt`). All 11 checks of `docs/TESTING.md` section 3 PASS on the live build (site state S7) at base `c0fb2dd`, plus the shared-link view; the 7 published files equalled `site/` at 15:19 and 16:13 UTC; `verify_page` and `npm test` (903 checks) identical to the baseline; both Excel exports opened in Microsoft Excel without error; every deck export had no layout warning; the browser console was clean over 8 page loads. Four new findings (proposed ids, no KNOWN_ISSUES entry yet): EX01-N1 (the Overlap Matrix image has its legend cut off for 2 to 4 funds; P3, client-facing); EX01-N2 (the Excel export has no number formats and no cached formula values; P3); EX01-N3 (Net Asset Allocation counts every Global Funds record as equity, a GIFT City G-Sec feeder included; P3, needs a rule from the owner); EX01-N4 (one unexplained, unreproduced misrouting of a Direct monitor file in its first Data Refresh run; a watch item). Known items reproduced: C23, C24, C26, C28, C36, C43 (with a new manifestation in the weighted row) and B1. To record: an update-log entry, KNOWN_ISSUES entries for EX01-N1 to N4, the PROJECT_STATE and integration-log references, TASK-064 and REQ-071. |
| Assigned tasks | TASK-064 (the pass is done; the record in the repository is pending) |
| Working directory and branch | The shared main checkout, without a worktree; no branch, no commit; it left the checkout on `main` (clean at its end, per its report). Exports went only to `_testdata/acceptance-2026-11/` (git-ignored). |
| Reserved files and shared components | none (read-only; no claim) |
| Dependencies | Moderator: MOD-02. |
| Last known commit and deliverable | none (no commit). Deliverable: the local report, delivered 2-Nov-2026. |
| Pending owner decisions | none held. Questions the pass raised for the owner: a rule for Global Funds in Net Asset Allocation (EX01-N3) and the existing C43. DEC-OPEN-24 and DEC-OPEN-12 were neither decided nor pre-empted. |
| Current blocker | none |
| Current handover document | none: it finished its task without a handover. Its brief is the first message of its transcript. |
| Successor | none |
| Retirement reason | Not retired: its work is complete. Same recommendation as NB-01: no new work (use EX-02 for a later pass). |

### OPS-01 | Playbook OPS - Monthly data operations | October 2026 update, run A (Reckoner) and read-only preparation of run B | SUPERSEDED

**Update 18-Nov-2026 (MOD-03).** SUPERSEDED: the owner chose "New OPS-02 here" (18-Nov-2026, MOD-03 chat), because OPS-01 runs
in the earlier Claude account, which MOD-03 cannot see or message. Its planned work moved to OPS-02; it made no commit and held
no claim. Its worktree `.claude/worktrees/adoring-boyd-7028f6` (branch `data/2026-09-4` at `ddd0304`) stays untouched until the
owner decides DEC-OPEN-22. The fields below are its record as of 17-Nov-2026.

| Field | Value |
|---|---|
| Session id | `local_ab19558f`; session ids of sub-chats are recorded shortened to 8 characters (SEC-05, DEC-OPEN-29) |
| Title in the app | OPS-01 October update: Reckoner run (VERIFIED `get_session`, 17-Nov-2026). It does not carry the word Playbook (rule 11 of section 6); renaming needs the agreement of the owner. |
| How it starts | Started by MOD-02 on 9-Nov-2026 at 12:32 UTC (VERIFIED `get_session`: created 12:32:13 UTC, parent session MOD-02), 16 minutes after PR #35 merged and after the October instructions of the owner (D87 to D96). Whether the owner clicked a start card: UNKNOWN. It was started before its record existed here (rule 5 of section 6 was not followed); this record is the first. |
| Responsibility | The operator of the October 2026 update: run A (the Reckoner products: `tools/merge_reckoner.js`, step 14, and `tools/merge_aif_performance.js`, step 15, of the Sep-2026 catch-up with the "October 2026" deck) and read-only preparation of run B (the MF cycle: NAV-date tests of the monitors, the rename and bake dry runs). Its launch packet is the first message of its transcript. |
| Status | BLOCKED (waiting on the owner and the desk). Not running since 9-Nov-2026 21:49 UTC, when its last turn ended with the weekly-limit error of the account (per MOD-02); not archived (VERIFIED `list_sessions`). Model claude-fable-5-1, effort high, permission mode auto (VERIFIED `get_session`; INFERRED: the model was set after the limit error). Nothing was applied: it made dry runs and wrote two reports (local only), and it has no commit. |
| Assigned tasks | TASK-020 (steps 14, 14a, 15 and 17 only), TASK-021 and TASK-024 as read-only preparation (launch packet, field 2). No claim: it edits nothing and runs no `--apply` until MOD-02 sends "claim in force" (a claim row on `origin/main`). |
| Working directory and branch | Its own worktree `.claude/worktrees/adoring-boyd-7028f6`, the folder that was NB-02 worktree (the app reused it). VERIFIED 17-Nov-2026: clean; the task branch `data/2026-09-4` and the app session branch `claude/ops-01-reckoner-a11e94` are both at `ddd0304` (the PR #35 merge, the base of the run), with 0 commits and not on origin. TASK-061 (worktree clean-up) must skip this folder while OPS-01 exists. |
| Reserved files and shared components | none yet. A claim for the Sep-2026 Reckoner catch-up (all six deploy files, the update log, the state files) is drafted outside the repository and not merged; it assumes a routine refresh and must be redone as High risk if any pin, `add_reckoner_funds.js`, `--accept-drops` or universe change is approved. |
| Dependencies | Moderator: MOD-02, then MOD-03. Guardian: ARC-01, called by the refresh operator for the Gate B DIFF REVIEW of a refresh (D88). The owner (decisions below) and the desk (monitor re-exports). The TASK-017 pass must be recorded before any `--apply`. |
| Last known commit and deliverable | none (no commit). Two local-only reports of 9-Nov-2026: `monthly-updates/2026-09_Sep-2026/_review/14-15_runA_dry_gates_2026-11-09.md` (steps 14 and 15 both exit 1; no `--apply`) and `monthly-updates/2026-10_Oct-2026/_review/prepB_report_2026-11-09.md`. |
| Pending owner decisions | Run A gates (decisions of the owner, HIGH risk; nothing applied): step 14 has two failed gates (dropped names against names with no MASTER match in the same category; 12 Select drops against a limit of 8, waivable only by the owner with `--accept-drops` after confirming); 5 deck names have no MASTER match (pins or `add_reckoner_funds.js` would be needed); step 15 AIF coverage 12 to 7 fails. Run B inputs: the Regular and SIF monitor re-exports as on 31-Oct-2026; the Bond file answers; DEC-OPEN-11 (four desk labels; before steps 14 and 14a); DEC-OPEN-33 (the provisional data pack, at run time); later DEC-OPEN-04, -05, -09 and -10. |
| Current blocker | Three, all open on 17-Nov-2026. (1) The owner decisions at the Reckoner gates (above). (2) The Regular and SIF monitor re-exports as on 31-Oct-2026: the 29-Oct and 2-Nov files supplied earlier are superseded (on the 2-Nov Regular file MTD equals 1 Day on 2,296 of 2,505 rows, so its NAV is the first trading day of November). The owner had said on 9-Nov-2026 to use them as if they were 30-Oct; MOD-02 did not, on that evidence, and asked for a re-export (the account of MOD-02, not verifiable from the repository). `monthly-updates/2026-10_Oct-2026/` holds only the Direct monitor (NAV 30-Oct, label 31st October 2026 under D91), the Bond Options file and the Offshore deck, plus `_review` and `_superseded`. (3) The weekly-limit stop of 9-Nov-2026 (the allowance reset on 13-Nov-2026 06:30 IST according to its launch packet; the session has not been resumed). The October MF cycle (expected about 13-17 Nov) has not started. |
| Current handover document | none (it is idle, not replaced). Its brief is the first message of its transcript (`efcf80ca...jsonl` in the project folder of its worktree under `%USERPROFILE%\.claude\projects\`; VERIFIED: it starts with the OPS-01 launch packet). At its own context-loss trigger it hands over with the sub-chat template (launch packet, field 14). |
| Successor | OPS-02 |
| Retirement reason | SUPERSEDED 18-Nov-2026: moved to OPS-02 (another Claude account; the owner's choice). |

### OPS-02 | Playbook OPS - Monthly data operations | October 2026 update (Reckoner run and funds run) | ACTIVE

| Field | Value |
|---|---|
| Session id | `local_61c7130f` (started by MOD-03 with `start_session`, 18-Nov-2026; MOD-03 can message it) |
| Title in the app | OPS-02 October 2026 update: preparation |
| How it starts | Started by MOD-03 on 18-Nov-2026 on the owner's instruction ("New OPS-02 here"), with a launch packet (bootstrap section 8.2) in its first message. |
| Responsibility | The operator of the October 2026 update: the Reckoner run on the "October 2026" deck (TASK-020, with TASK-029) and later the October MF cycle (TASK-021, with TASK-024). Phase 1 is read-only preparation (fresh dry runs, the gate report, the proposed PMS and AIF table, a draft change-impact contract and claim); phase 2 (apply) starts only when its claim is on `origin/main`. |
| Status | ACTIVE (phase 1). It does not merge or publish: the Moderator merges, after the owner's yes (the run has section 7 cases: pins, a universe change, an override). |
| Assigned tasks | TASK-020, TASK-029; read-only preparation of TASK-021 and TASK-024. |
| Working directory and branch | Worktree `.claude/worktrees/investment-proposal-dashboard-c68580` (the app reused the folder that was unused since 2-Nov-2026), app branch `claude/ops-02-october-prep-55402a` at `91d11cd`; no task branch until the claim names one. |
| Reserved files and shared components | none yet (phase 1 edits no tracked file). The claim (all six deploy files, `tools/data/pins.json`, the update log and state files) follows the Guardian pre-check of its contract. |
| Dependencies | Moderator: MOD-03. Guardian: ARC-01 (contract pre-check and Gate B, run by MOD-03: High risk). The owner (the open items of D101 and DEC-OPEN-36 b). The funds bake waits for the young-fund rule (D94: TASK-067, TASK-023). |
| Last known commit and deliverable | none yet |
| Pending owner decisions | DEC-OPEN-36 (b) and the rest of (d); the ranges and exit loads of the new products; the mixed dates of the PMS and AIF table; DEC-OPEN-04. |
| Current blocker | none for phase 1. |
| Current handover document | none (its brief is the first message of its transcript) |
| Successor | none |
| Retirement reason | not applicable |

### NB-04 | NB - New build | Young-fund rule in the MF bake (TASK-067, D94, D103) | COMPLETED

| Field | Value |
|---|---|
| Session id | `local_20daef41` |
| Title in the app | NB-04 Young-fund rule in the MF bake (D94) |
| How it starts | Proposed by MOD-03 as a card on 18-Nov-2026 with a launch packet (bootstrap section 8.2); started by the owner from the card the same day. |
| Responsibility | TASK-067: the MF bake (`tools/bake_month.js`, `tools/lib/`) clears return periods longer than a fund's life and, for funds younger than one year, `si` beyond +-300% (D94, D103); tests and docs. TASK-023 is then applied by OPS-02's October bake. |
| Status | COMPLETED 18-Nov-2026: PR #47 merged by MOD-03 (`44590d4`) after Gate B; the claim is released. The session may still exist in the app; it holds nothing. |
| Assigned tasks | TASK-067 |
| Working directory and branch | Worktree `.claude/worktrees/competent-neumann-0880fa`; task branch `feat/task-067-young-fund-rule` (head `95d4739`), merged as PR #47 (`44590d4`, 18-Nov-2026). |
| Reserved files and shared components | none (the TASK-067 claim of 14 files was released at the merge of PR #47; ACTIVE_CHANGE_REGISTER section 4). |
| Dependencies | Moderator: MOD-03. Guardian: ARC-01 (pre-check and Gate B by MOD-03: High risk, `tools/lib/`). Must merge before OPS-02's October MF bake. |
| Last known commit and deliverable | none yet |
| Pending owner decisions | none (D103 answered its question) |
| Current blocker | the claim (after the Guardian pre-check) |
| Current handover document | none (its brief is the first message of its transcript) |
| Successor | none |
| Retirement reason | not applicable |

---

## 4. External sessions (other project; not controlled by this registry)

| ID | Session id | Title in the app | Folder | Note (28-Oct-2026; update 2-Nov-2026) |
|---|---|---|---|---|
| EXT-PR-01 | `local_7f5b5474` | Portfolio Review Dashboard architecture | `%USERPROFILE%\OneDrive - CENTRICITY FINANCIAL DISTRIBUTION PRIVATE LIMITED\Desktop\Claude Code-Portfolio Review Dashboard` (its own repository) | EXTERNAL - separate project. Running. It received the same handover master prompt at about 05:33 UTC and handles that project's own handover. Update 2-Nov-2026: not running (last activity 30-Oct-2026 07:57 UTC). |
| EXT-PR-02 | `local_aa7a56d6` | Build the new Portfolio Review dashboard | the same other folder | EXTERNAL - separate project. Not running. Update 2-Nov-2026: running (last activity 08:54 UTC). |
| EXT-PR-03 | `local_53858000` (first 8 characters) | Portfolio review dashboard | `%USERPROFILE%\OneDrive - CENTRICITY FINANCIAL DISTRIBUTION PRIVATE LIMITED\Desktop\Claude Code-Portfolio Review Dashboard` (its own repository) | EXTERNAL - separate project. First seen 2-Nov-2026; running on 2-Nov-2026 about 08:55 UTC (MOD-02 observation; purpose not asked). |
| EXT-PR-04 | `local_ffb5b6ce` (first 8 characters) | `ARC-01 \| Project-Wide \| Codebase Integrity & Integration Guardian \| ACTIVE` | `%USERPROFILE%\OneDrive - CENTRICITY FINANCIAL DISTRIBUTION PRIVATE LIMITED\Desktop\Claude Code-Portfolio Review Dashboard` (its own repository) | EXTERNAL - separate project. First seen 2-Nov-2026; running on 2-Nov-2026 about 08:55 UTC (MOD-02 observation; purpose not asked). |
| EXT-PR-05 | `local_3d9680d2` (first 8 characters) | `EX-01 \| Workstream A (existing dashboard) \| Existing-dashboard implementation \| ACTIVE` | `%USERPROFILE%\OneDrive - CENTRICITY FINANCIAL DISTRIBUTION PRIVATE LIMITED\Desktop\Claude Code-Portfolio Review Dashboard` (its own repository) | EXTERNAL - separate project. First seen 2-Nov-2026; running on 2-Nov-2026 about 08:55 UTC (MOD-02 observation; purpose not asked). |

- No chat of this project writes in that folder or repository, and the reverse. `docs/specs/` here holds
  a redacted specification of the sister dashboard for reference only.
- Whether one Moderator should coordinate both projects is open: DEC-OPEN-25. The documented
  recommendation is one Moderator per project, because the repositories, folders, data and releases are
  separate; each registry lists the other project's chats as external.
- `EXT-PR-nn` are labels of this registry only; the other project numbers its own chats.
- Update 17-Nov-2026 (VERIFIED `list_sessions`, metadata only): EXT-PR-03 is running (last activity 17-Nov-2026 06:52 UTC); EXT-PR-01, -02, -04 and -05 are not running (last activity 30-Oct-2026 07:57 UTC, 9-Nov-2026 12:02 UTC, 9-Nov-2026 21:49 UTC and 9-Nov-2026 12:29 UTC). No new external session. This project does not touch them.
- Name collision (2-Nov-2026): the sister project's chats use the same ID scheme and two of their titles
  start with `ARC-01` and `EX-01`. They are not this project's chats. From 2-Nov-2026 the app title of
  each of this project's sub-chats starts with the chat ID and the word Playbook and stays under 60
  characters (the start_session limit), for example `EX-01 Playbook: browser acceptance` or
  `GOV-01 Playbook: rule documents consistency`; the registry name line (section 1) carries `Playbook` in
  the workstream field, for example
  `EX-01 | Playbook EX - Existing dashboard | Full browser acceptance (TASK-064) | ACTIVE`. Record the
  app title exactly as the app shows it in the 'Title in the app' column.

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
   chat is retired or superseded. Next free on 23-Nov-2026: EX-03, NB-05, OPS-03, GOV-02, ARC-02, MOD-04
   (EX-01 and GOV-01 were allocated on 2-Nov-2026, OPS-01 on 9-Nov-2026, MOD-03 on 17-Nov-2026, OPS-02 and NB-04 on 18-Nov-2026, EX-02 on 22-Nov-2026); external labels: EXT-PR-06. A successor always gets
   a new ID (MOD-02 is not "MOD-01 continued").
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
11. **Titles.** From 2-Nov-2026 the app title of each of this project's sub-chats starts with the chat ID
    and the word Playbook and stays under 60 characters (the start_session limit), for example
    `EX-01 Playbook: browser acceptance` or `GOV-01 Playbook: rule documents consistency`; the registry
    name line (section 1) carries `Playbook` in the workstream field, for example
    `EX-01 | Playbook EX - Existing dashboard | Full browser acceptance (TASK-064) | ACTIVE`. Record the
    app title exactly as the app shows it in the 'Title in the app' column.

---

## 7. History of handovers

| Date | From -> to | Kind | Branch (base) | Documents | Reason | State (28-Oct-2026; update 2-Nov-2026) |
|---|---|---|---|---|---|---|
| 28-Oct-2026 | MOD-01 -> MOD-02 | Moderator replacement; successor scenario B, clean tree (no work in progress to carry) | `handover/mod-01-to-mod-02-20261028` (from `2b2a397`) | [MASTER_HANDOVER_2026-10-28_v1.md](../handover/MASTER_HANDOVER_2026-10-28_v1.md), [EXISTING_DASHBOARD_HANDOVER_2026-10-28_v1.md](../handover/EXISTING_DASHBOARD_HANDOVER_2026-10-28_v1.md), [NEW_BUILD_HANDOVER_2026-10-28_v1.md](../handover/NEW_BUILD_HANDOVER_2026-10-28_v1.md), [CODEBASE_GUARDIAN_HANDOVER_2026-10-28_v1.md](../handover/CODEBASE_GUARDIAN_HANDOVER_2026-10-28_v1.md), [MOD-01_TO_MOD-02_SUCCESSOR_PROMPT_2026-10-28.md](../handover/continuations/MOD-01_TO_MOD-02_SUCCESSOR_PROMPT_2026-10-28.md), the `docs/project-control/` registers | The owner's order (27-Oct-2026 15:25 UTC, re-issued 28-Oct-2026 05:33 UTC) | IN PROGRESS. Complete when the branch is merged (MOD-02 records the merge SHA and PR number in this row) and MOD-02 confirms the handover (TASK-016). Update 2-Nov-2026: COMPLETE. Merged as PR #29, merge `f5c2431` (30-Oct-2026 07:46:59 UTC). MOD-02 confirmed the handover after TASK-016 (record: `docs/update-log/2026-11-02_task-016-validation.md`). |
| 17-Nov-2026 | MOD-02 -> MOD-03 | Moderator replacement; successor scenario B, clean tree (no work in progress to carry; OPS-01 holds a worktree with no commit) | `handover/mod-02-to-mod-03-20261117` (cut from `origin/main`, `b47069b` on 17-Nov-2026) | [MASTER_HANDOVER_2026-11-17_v2.md](../handover/MASTER_HANDOVER_2026-11-17_v2.md), [MOD-02_TO_MOD-03_SUCCESSOR_PROMPT_2026-11-17.md](../handover/continuations/MOD-02_TO_MOD-03_SUCCESSOR_PROMPT_2026-11-17.md), the `docs/project-control/` registers | The owner order (handover master prompt pasted 17-Nov-2026 06:27 UTC) and four automatic compactions of MOD-02 (2-Nov-2026 11:22 and 19:14 UTC, 9-Nov-2026 07:36 UTC, 17-Nov-2026 06:28 UTC) | IN PROGRESS. Complete when the branch is merged (MOD-03 records the merge SHA and PR number in this row) and MOD-03 has validated and confirmed the handover. |

Notes:
- A first attempt started on 27-Oct-2026 15:25 UTC stopped at 15:31 UTC; nothing was committed.
- NB-01, NB-02 and NB-03 ended by completing their tasks; there was no handover.
- GOV-01 (9-Nov-2026) and EX-01 (2-Nov-2026) ended by completing their tasks; there was no handover. OPS-01 is idle with no commit and needs no continuation yet.
- NB-01, NB-02 and NB-03 were archived on or before 2-Nov-2026 (`list_sessions` shows isArchived true;
  that the owner did it is INFERRED).
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
   [REPOSITORY_AND_ENVIRONMENT_STATE.md](REPOSITORY_AND_ENVIRONMENT_STATE.md); never `checkout`, `switch`, `merge` or `pull`).

**MOD-02's first updates (done 2-Nov-2026, TASK-016):** its own session id, title and start time and
ACTIVE; PR #29 and `f5c2431` in section 7; MOD-01 RETIRED with the date; ARC-01 ACTIVE after its first
successful review; the new external sessions and the NB archive state (released as PR #30, `32172f5`).

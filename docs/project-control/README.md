# Project control: the multi-chat registers

| Field | Value |
|---|---|
| Version | 1 |
| Date | 28-Oct-2026 |
| Author chat | MOD-01 |
| Status | Authoritative (index of this folder and the rules for keeping it) |
| Supersedes | none (folder created by the MOD-01 -> MOD-02 handover package) |
| Next review | when MOD-02 validates the package (TASK-016) |

Several Claude chats work on this project: one Moderator (MOD-nn), the Guardian (ARC-01) and bounded
sub-chats (EX, NB, OPS, GOV). These registers are the durable record of who does what, what was decided
and what was integrated, so that no coordination state lives only inside a chat (master prompt section
23). They complement the project's existing documents; they do not replace them. The repository is
public: nothing here may name a client or hold investor data, personal data or secrets.

## 1. Which file is authoritative for what

| Topic | Authoritative file | Role of this folder |
|---|---|---|
| Project state: data as on, latest verification, release, next steps | [`../PROJECT_STATE.md`](../PROJECT_STATE.md) | none: there is deliberately no `project-control/PROJECT_STATE.md`; `CLAUDE.md` tells every session to read `docs/PROJECT_STATE.md` |
| Approved decisions (D1-D83; next D84) | [`../DECISIONS.md`](../DECISIONS.md) | [`DECISION_LOG.md`](DECISION_LOG.md) holds the **open** decisions (`DEC-OPEN-nn`, with documented recommendations, which are not decisions) and an index of the load-bearing approved ones |
| Defects and technical debt (IDs A, B, C, R, E, F; severity and status) | [`../KNOWN_ISSUES.md`](../KNOWN_ISSUES.md) | [`KNOWN_ISSUES_AND_REGRESSION_RISKS.md`](KNOWN_ISSUES_AND_REGRESSION_RISKS.md) is a dated snapshot index of it plus the regression-risk catalogue (area -> what can regress -> which gate or test catches it -> coverage gap) |
| Architecture overview | [`../ARCHITECTURE.md`](../ARCHITECTURE.md) | [`ARCHITECTURE_AND_DEPENDENCY_MAP.md`](ARCHITECTURE_AND_DEPENDENCY_MAP.md) adds the dependency and blast-radius view |
| Change history | [`../../CHANGELOG.md`](../../CHANGELOG.md), [`../update-log/`](../update-log/) | [`INTEGRATION_AND_REGRESSION_LOG.md`](INTEGRATION_AND_REGRESSION_LOG.md) records baselines, gate results and incidents |
| Handover packages and successor prompts | [`../handover/README.md`](../handover/README.md) | none |
| Chats, tasks, requirements, ownership, interfaces, repository state | this folder (section 2) | authoritative |

When this folder and an authoritative file disagree, the authoritative file wins; when either disagrees
with the code or git, the code wins. Fix the register with a dated correction.

## 2. The registers

| File | What it is for | IDs | Updated by | When |
|---|---|---|---|---|
| [`CHAT_REGISTRY.md`](CHAT_REGISTRY.md) | Every chat of this project: name `[CHAT-ID] \| [WORKSTREAM] \| [RESPONSIBILITY] \| [STATUS]`, session id, status, tasks, working directory and branch, reserved files, dependencies, last commit and deliverable, pending decisions, blocker, handover document, successor, retirement reason. External chats (the sister Portfolio Review Dashboard) in a separate table | MOD, ARC, EX, NB, OPS, GOV + number | Moderator | a chat is proposed, started, waits, blocks, finishes, hands over or retires |
| [`TASK_REGISTER.md`](TASK_REGISTER.md) | Every unit of work, open and historical: title, workstream, status, priority, owner chat, dependencies, blockers, related IDs, acceptance criteria, evidence | TASK-nnn | Moderator | created, assigned, blocked, merged, verified, accepted |
| [`REQUIREMENTS_AND_CHANGE_REGISTER.md`](REQUIREMENTS_AND_CHANGE_REGISTER.md) | Every requirement the owner gave: original wording or summary, intended behaviour, acceptance criteria, status, affected components, verification evidence, owner | REQ-nnn, REQ-PPT-nn | Moderator | the owner asks for something (new or repeated); a status changes |
| [`DECISION_LOG.md`](DECISION_LOG.md) | Open decisions in plain words, related issues and tasks, documented recommendation, decider; index of approved decisions | DEC-OPEN-nn; Dnn (in `docs/DECISIONS.md`) | Moderator | a decision is put to the owner or answered |
| [`ACTIVE_CHANGE_REGISTER.md`](ACTIVE_CHANGE_REGISTER.md) | One row per active task: chat, workstream, worktree, base branch and SHA, task branch, files and interfaces claimed, overlaps, status, latest commit, review and integration status, blockers, released or not | by TASK ID | Moderator (values from the sub-chat's Gate A report) | claim before any edit; at each Gate A report; release at merge |
| [`FILE_OWNERSHIP_AND_CHANGE_CONTROL.md`](FILE_OWNERSHIP_AND_CHANGE_CONTROL.md) | The rules: worktrees, single-writer, high-risk files, the change-impact contract template, gates A-E, recovery | - | Moderator, for an owner-approved process change, with the Guardian consulted | rarely |
| [`INTERFACE_CONTRACTS.md`](INTERFACE_CONTRACTS.md) | Data blocks and their scales, `tools/lib/blocklib.js` API, `window.H` / `REFRESH` / `EXPORTS`, sibling hooks, the tool CLI contract, `verify_page` output and the CI greps, the deck design system, ripple lists | - | the task that changes an interface, in the same PR; the Guardian checks it at Gate B | with the change |
| [`ARCHITECTURE_AND_DEPENDENCY_MAP.md`](ARCHITECTURE_AND_DEPENDENCY_MAP.md) | Components, data flow, tools x data blocks, sibling-owned data, shared and duplicated logic, high-risk files | - | as above | with the change |
| [`INTEGRATION_AND_REGRESSION_LOG.md`](INTEGRATION_AND_REGRESSION_LOG.md) | The baseline chain, one record per merge (gates, CI run, live check), handover validations, incidents | INC-nn | Moderator (Gate D) | every merge, validation and incident |
| [`KNOWN_ISSUES_AND_REGRESSION_RISKS.md`](KNOWN_ISSUES_AND_REGRESSION_RISKS.md) | Snapshot index of `docs/KNOWN_ISSUES.md` and the regression-risk catalogue | KNOWN_ISSUES IDs, referenced not copied | Moderator; the Guardian reports new risks | `docs/KNOWN_ISSUES.md` changes or a new risk is found |
| [`REPOSITORY_AND_ENVIRONMENT_STATE.md`](REPOSITORY_AND_ENVIRONMENT_STATE.md) | Remotes, branches, worktrees, stash, OneDrive and `.git` health, toolchain, local-only folders, the safe git methods for this machine | - | Moderator | at every validation and after any change to them |

## 3. Who updates what

- **The Moderator** is the only writer of `CHAT_REGISTRY.md`, `TASK_REGISTER.md`,
  `REQUIREMENTS_AND_CHANGE_REGISTER.md`, `DECISION_LOG.md`, `ACTIVE_CHANGE_REGISTER.md`,
  `INTEGRATION_AND_REGRESSION_LOG.md`, `KNOWN_ISSUES_AND_REGRESSION_RISKS.md` and
  `REPOSITORY_AND_ENVIRONMENT_STATE.md`. One writer keeps parallel branches from colliding in these
  files. It batches updates into small docs PRs, and a sub-chat's claim is on `main` before that
  sub-chat edits anything. When it launches a sub-chat it reserves the next free IDs the task may need
  (D, KNOWN_ISSUES, TASK) in the launch packet, so parallel PRs never take the same number (that
  happened with D70 and D71 on 16-19-Oct-2026).
- **Sub-chats**, in their own task PR, update what their change makes stale: `docs/KNOWN_ISSUES.md`,
  `docs/DECISIONS.md` (with the reserved D number), `CHANGELOG.md`, `docs/PROJECT_STATE.md`, the other
  documents `CLAUDE.md` step 5 names, and `INTERFACE_CONTRACTS.md` / `ARCHITECTURE_AND_DEPENDENCY_MAP.md`
  when the change alters an interface or dependency (declared in its change-impact contract). They send
  the register values (branch, head SHA, files, tests and results, open issues) to the Moderator in the
  Gate A report; they do not edit the Moderator's registers.
- **The Guardian (ARC-01)** is read-only. It reports to the Moderator, who records its findings (in the
  integration log, the regression-risk catalogue and the task's review status). At Gate B it checks that
  the PR updated the interface and dependency documents it had to.
- **The owner** does not edit these files. The Moderator records the owner's decisions, approvals and
  actions with the date and the owner's own words.

## 4. Update rules

1. **Stable IDs.** Never renumber, reuse or delete an ID. A withdrawn item becomes SUPERSEDED with a
   pointer to what replaced it. A new item takes the next free number. As of 28-Oct-2026: REQ-096,
   REQ-PPT-154, TASK-075, DEC-OPEN-29, D84, A32, B10, C46, R12, E17, F4; chats EX-01, NB-04, OPS-01,
   GOV-01, ARC-02, MOD-03.
2. **Dated entries.** Dates as 28-Oct-2026 (with UTC time where order matters). A status change adds a
   dated note; it does not silently rewrite history. A correction is marked "Correction <date>:" with
   what was wrong.
3. **No duplicates.** A repeated requirement updates its existing row. One fact lives in one file;
   everywhere else links to it. Do not copy `docs/KNOWN_ISSUES.md` or `docs/DECISIONS.md` text into a
   register.
4. **Status vocabulary only.** Tasks and requirements: VERIFIED COMPLETE, IMPLEMENTED NOT FULLY VERIFIED,
   IN PROGRESS, PLANNED, BLOCKED, NOT STARTED, EXISTING DEFECT, UNKNOWN / NEEDS INVESTIGATION,
   SUPERSEDED. Chats: ACTIVE, WAITING, QUEUED, BLOCKED, HANDOVER REQUIRED, COMPLETED, RETIRED, SUPERSEDED.
   Claims labelled VERIFIED, INFERRED, UNCERTAIN or UNKNOWN.
5. **Evidence pointers.** Every status cites its evidence: the command and its result, a PR and merge
   SHA, or `path:line`. For `site/index.html` give a grep pattern as well (its line numbers drift).
6. **Recommendations are not decisions.** A `DEC-OPEN` row records the documented recommendation; only
   the owner's answer makes an approved decision, which gets a `Dnn` in `docs/DECISIONS.md`.
7. **Code wins.** If a register disagrees with the code, git, CI or the live site, correct the register.
8. **Through a PR.** Every edit goes branch -> PR -> `verify` -> merge (D68); never a direct push to
   `main`. In the OneDrive main checkout, create the branch with `git branch` and commit through a
   temporary index (no checkout; `REPOSITORY_AND_ENVIRONMENT_STATE.md`).
9. **Snapshots carry their date.** Counts, SHAs and states in a register are as of a stated date.
10. **Public and plain.** No client names, investor data, personal data or secrets; local paths as
    `%USERPROFILE%\...`; ASCII text.

## 5. Read order for a new chat

`CLAUDE.md` -> `docs/PROJECT_STATE.md` -> `docs/handover/README.md` -> this README ->
`CHAT_REGISTRY.md` -> `ACTIVE_CHANGE_REGISTER.md` -> `TASK_REGISTER.md` -> `DECISION_LOG.md` ->
`REPOSITORY_AND_ENVIRONMENT_STATE.md` -> `INTEGRATION_AND_REGRESSION_LOG.md`; the others when a task
needs them. A sub-chat reads its own task rows, its claims and the interface entries for the files it
may change.

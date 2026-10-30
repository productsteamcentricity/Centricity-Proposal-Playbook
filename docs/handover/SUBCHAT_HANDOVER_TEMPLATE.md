# Sub-chat handover template

| Field | Value |
|---|---|
| Version | 1 |
| Date | 28-Oct-2026 |
| Author chat | MOD-01 |
| Status | Template |
| Supersedes | none |
| Next review | at the first sub-chat continuation |

**How to use.** When an implementation sub-chat must be replaced (Scenario A,
[`continuations/README.md`](continuations/README.md)), the outgoing chat fills this template from
commands run now, not from memory, and saves it as
`docs/handover/continuations/<CHAT-ID>_TASK-<id>_HANDOVER_<YYYY-MM-DD>.md`; it also writes
`<CHAT-ID>_TASK-<id>_SUCCESSOR_PROMPT_<YYYY-MM-DD>.md` (`continuations/README.md` section 7). The
Moderator merges both in a small docs PR, so they are on `main` for everyone; the continuation branch
holds only the task's code. Never leave a field blank: write "none", or "UNKNOWN: <what is missing, who
can fill it>". Label claims VERIFIED / INFERRED / UNCERTAIN / UNKNOWN. The same template also serves as
a completion record when a sub-chat finishes (see the example).

## Template

### 0. Header

| Field | Value |
|---|---|
| Version | 1 |
| Date | <DD-Mon-YYYY, time UTC> |
| Author chat | <outgoing chat ID> |
| Status | Authoritative for task <TASK-nnn> as of <date> |
| Supersedes | <earlier handover for this task, or none> |
| Next review | when the successor has validated the continuation branch |

### 1. Identity

| Field | Value |
|---|---|
| Outgoing chat | `<CHAT-ID> \| <WS> \| <responsibility> \| HANDOVER REQUIRED`; session `<local_...>`; title `<...>`; started <date> by <who> |
| Successor | `<next free ID in the prefix> \| <WS> \| <responsibility> \| QUEUED` |
| Predecessor of the outgoing chat | <chat ID and its handover, or none> |
| Moderator | <MOD-nn> |
| Trigger and evidence | <section 15 item>; <compaction timestamps from the transcript, or the owner's or Moderator's instruction> |

### 2. Task

| Field | Value |
|---|---|
| Task and requirement IDs | <TASK-nnn>; <REQ-nnn, REQ-PPT-nn> |
| Objective | <one or two sentences> |
| Acceptance criteria | <from the launch packet, each with its proving check> |
| Change-impact contract | <link or location; "not required: docs-only"> |
| Guardian | pre-check <date, result>; diff review (Gate B) <done / pending> |

### 3. Location and git

| Field | Value |
|---|---|
| Repository path | `%USERPROFILE%\...` |
| Working directory | <worktree path, e.g. `.claude\worktrees\<name>`, or "main checkout (single-writer)"> |
| Task branch | <name>; base branch `main` at <base SHA> (from the launch packet) |
| Head | <SHA>; `git log --oneline <base>..HEAD`: <commits> |
| Pushed | <remote SHA from `git ls-remote`, or "not pushed"> |
| PR | <#n, state, CI result; or none> |
| Continuation branch | `continuation/<chat-id>-task-<task-id>-YYYYMMDD` at <SHA>, cut from <task branch tip SHA> |
| WIP checkpoint | <SHA, subject "WIP: checkpoint task <task-id> for context handover"; or none> |

### 4. Working tree and preservation

| Field | Value |
|---|---|
| Staged / unstaged / untracked | <lists, or none> |
| Preservation case | <A / B / C / D>, what was done |
| Not committed, and where it is kept | <path of patch or copy, SHA-256, why not committed> |

### 5. Scope and ownership

| Field | Value |
|---|---|
| Permitted scope | <files and modules> |
| Reserved files (claims in `ACTIVE_CHANGE_REGISTER.md`) | <list>; to be transferred to the successor |
| Shared interfaces touched | <`INTERFACE_CONTRACTS.md` entries> |
| Files of other tasks touched | <must be none; else explain> |
| Non-goals | <list> |

### 6. Tests actually run

| Command or check | When (UTC) | At SHA | Result | Evidence |
|---|---|---|---|---|

NOT RUN: <list, with reason>.

### 7. Done and not done

Each item with a status word (VERIFIED COMPLETE, IMPLEMENTED NOT FULLY VERIFIED, IN PROGRESS, PLANNED,
BLOCKED, NOT STARTED, EXISTING DEFECT, UNKNOWN / NEEDS INVESTIGATION, SUPERSEDED).

### 8. Local-only artefacts

| Path | What | Why not in git | Sensitivity | Needed by the successor? |
|---|---|---|---|---|

### 9. Next steps for the successor

Numbered, in order; each with acceptance criteria and required tests.

### 10. Coordination

Moderator, Guardian review state, related chats and their files, pending owner approvals, messages to
relay.

### 11. Uncertainty warnings

### 12. Verification of the continuation branch (`continuations/README.md` section 6)

| Check | Result and evidence |
|---|---|
| Branch exists; source commit correct | |
| Checkpointed changes present; nothing unrelated | |
| No secrets, client data or forbidden files | |
| Local-only artefacts listed | |
| Successor prompt names this branch, worktree and base | |
| Pushed; remote SHA = local SHA | |

### 13. Records the Moderator must update

`CHAT_REGISTRY.md` (outgoing HANDOVER REQUIRED, successor QUEUED), `ACTIVE_CHANGE_REGISTER.md`
(claims transferred), `TASK_REGISTER.md`, the index in `continuations/README.md`.

## Example: NB-03, the PowerPoint export work (completion record)

Reconstructed on 28-Oct-2026 from git, GitHub and the transcript, as NB-03's record at its close on
22-Oct-2026 15:41 UTC. NB-03 finished its task, so no continuation branch was needed; the fields show
what a successor would have received. Values VERIFIED unless marked.

| Field | Value |
|---|---|
| Outgoing chat | `NB-03 \| NB \| Fix and standardise the proposal PowerPoint export \| COMPLETED`; session `local_00b57be9-5ff6-4864-92bd-de4f103330ae`; started 22-Oct-2026 14:31 UTC from MOD-01's card (the owner chose "New session"); transcript `1ffe6022-e7ad-4673-8c7c-602d97dee30c.jsonl`, 0 compactions |
| Successor | none (task complete). Had it been replaced: `NB-04`, branch `continuation/nb-03-task-013-20261022` |
| Moderator | MOD-01 |
| Task and requirements | TASK-013; REQ-057 to REQ-060 and REQ-PPT-01 to REQ-PPT-153 (the owner's 22-Oct spec) |
| Objective | fix the deck generator (not the supplied deck): one measured design system for every native slide, continuation slides with repeated headers, page numbers, honest labels |
| Acceptance criteria (brief) | `verify` green; docs updated (CHANGELOG, PROJECT_STATE, KNOWN_ISSUES, a DECISIONS entry); rendered montage and sample deck sent to the owner and the owner's go-ahead before merge; no pptxgenjs or CDN upgrade; no deck committed; no data or C24 calculation change |
| Change-impact contract / Guardian | none (both introduced on 28-Oct-2026); the audit `docs/proposal-output-format-audit.md` recorded the problems and functions before editing |
| Working directory | the shared main checkout, no worktree. Today's rule requires a worktree: see the lesson below |
| Branches and commits | `feat/pptx-design-system`: base `83f777c` (PR #25 merge), head `625fdd5`, PR #26 merged by NB-03 as `5d39821` (22-Oct-2026 15:37 UTC); `docs/release-pr26`: head `f8015d0`, PR #27 merge `5bcce88` (15:41 UTC) |
| Working tree at close | clean, but the shared checkout was left on `feat/pptx-design-system` instead of `main`; MOD-01's switch back on 25-Oct-2026 failed with "mmap failed" and truncated tracked files, restored with nothing lost (R6, INC-16) |
| Preservation case | none needed: everything committed and merged |
| Scope | `site/index.html` export section (about L4250-L5520; re-find with Grep) and the new `H.isExpectedReturn`; new `tools/test/pptx_layout.test.js`, `tools/dev/render_pptx.ps1`, `tools/dev/check_pptx_bounds.js`; docs. Reserved: `site/index.html` (single writer). New shared interface: `window.EXPORTS._ds` and the design-system rules of D82 |
| Non-goals | data blocks, the C24 headline rule, library versions, the Disclaimer image |
| Tests run | `verify_page` identical to `main`, exit 0; `npm test` 5 of 5 (pptx_layout about 800 checks); browser exports of the 8-instrument proposal, the 4-fund check (23 slides) and stress portfolios of 3, 15, 30 and 45 instruments with no layout warning; six decks rendered through PowerPoint and measured with `check_pptx_bounds.js` (summary in `_testdata\pptx-design-system\bounds_check.txt`; the per-deck "no problem found" lines were re-run on the kept files on 28-Oct: 8 of 8); after merge: push run 39806564591 verify and publish succeeded, live 7 of 7 = `site/`, live 4-fund export 23 slides, no warning, console clean |
| NOT RUN | automated checks of chart internals; a PowerPoint render in CI (manual, Windows only); a full 7-area acceptance after the merge (now TASK-064) |
| Done | D82 and D83 (owner-approved, recorded by PR #27); REQ-PPT: 118 VERIFIED COMPLETE, 34 IMPLEMENTED NOT FULLY VERIFIED, 1 BLOCKED (counts as corrected on 28-Oct) |
| Not done | REQ-PPT-93 Disclaimer re-layout BLOCKED (C34, DEC-OPEN-21, TASK-038); fund-specific pages (DEC-OPEN-23); C28-C34 logged; C44 and C45 found later (28-Oct, TASK-069) |
| Local-only artefacts | `_testdata\pptx-design-system\` (42 files, ~39 MB: sample deck, montages, renders, stress decks); `%TEMP%\x\` (raw PowerPoint bounds files, the deck authoring source `pptx_section.js` and `splice.js`, the localhost receiver on port 8099, and `ref.pptx`, INFERRED a copy of the client reference deck: never open, quote or commit it, R10); side-session note `pptx-design-system_plan.md` (E16) |
| Coordination | montage and sample deck sent to the owner 22-Oct-2026 15:36:08Z and 15:36:10Z; owner's go-ahead 15:36:58Z; merge 23 s later |
| Uncertainty | the per-deck bounds verdicts were not kept at the time (re-checked 28-Oct); the go-ahead's acceptance of the `*` wording and shared performance slides is INFERRED; client-readiness (REQ-PPT-02) is the owner's judgement and no separate Gate E acceptance is recorded |
| Lesson | coding sub-chats work in their own worktree and never leave a shared checkout off `main` |

# Handover: chat handover packages and the transfer from the outgoing owner

| Field | Value |
|---|---|
| Version | 4 |
| Date | 9-Nov-2026 |
| Author chat | MOD-01 (28-Oct-2026); MOD-02 (update of 2-Nov-2026); GOV-01 (errata ERR-9 and ERR-10, TASK-018, 9-Nov-2026) |
| Status | Authoritative (index of this folder) |
| Supersedes | version 3 of 2-Nov-2026 |
| Next review | at every handover (the TASK-016 review was done on 2-Nov-2026) |

## 1. Chat handover packages

**Authoritative now: package v1 of 28-Oct-2026 (MOD-01 -> MOD-02).**

> **Warning.** A handover document is a snapshot of its date. It explains what was true and intended
> then; it does not prove the current working tree, branches, pull requests, CI or live site. Before
> acting on any handover, current or historical, check the repository (`git fetch`, `git status`,
> `gh pr list`, `node tools/verify_page.js site`, `npm test`, the live check). Where a document and the
> code disagree, the code wins.

| File | Status | What it holds | Give it to the next Moderator? |
|---|---|---|---|
| [`MASTER_HANDOVER_2026-10-28_v1.md`](MASTER_HANDOVER_2026-10-28_v1.md) | Authoritative (v1) (dated snapshot; errata below) | project history, architecture, current state, replication, decisions, blockers, uncertainty (section 12), ordered plan (section 13) | yes: the successor prompt names it |
| [`../update-log/2026-11-02_task-016-validation.md`](../update-log/2026-11-02_task-016-validation.md) | Authoritative record (2-Nov-2026) | the TASK-016 validation of package v1 and the audit findings, with where each went | yes, with the master handover |
| [`EXISTING_DASHBOARD_HANDOVER_2026-10-28_v1.md`](EXISTING_DASHBOARD_HANDOVER_2026-10-28_v1.md) | Authoritative (v1) | Workstream A (EX): replication, parity, transfer, old-site retirement | yes, for EX work |
| [`NEW_BUILD_HANDOVER_2026-10-28_v1.md`](NEW_BUILD_HANDOVER_2026-10-28_v1.md) | Authoritative (v1) | Workstream B (NB) and monthly operations (OPS) | yes, for NB and OPS work |
| [`CODEBASE_GUARDIAN_HANDOVER_2026-10-28_v1.md`](CODEBASE_GUARDIAN_HANDOVER_2026-10-28_v1.md) | Authoritative (v1) | ARC-01: dependency map, shared interfaces, ownership, integration state, risks | yes; also input to every Guardian review |
| [`MODERATOR_BOOTSTRAP_PROMPT.md`](MODERATOR_BOOTSTRAP_PROMPT.md) | Authoritative (standing rules) | copy-ready instruction set for any Moderator | yes: the successor prompt tells MOD-02 to read it |
| [`MODERATOR_HANDOVER_TEMPLATE.md`](MODERATOR_HANDOVER_TEMPLATE.md) | Template | fields for a Moderator or Guardian handover, with the MOD-01 example | when MOD-02 hands over |
| [`SUBCHAT_HANDOVER_TEMPLATE.md`](SUBCHAT_HANDOVER_TEMPLATE.md) | Template | fields for a sub-chat handover, with the NB-03 example | to every sub-chat at its handover |
| [`continuations/README.md`](continuations/README.md) | Authoritative (procedure and index) | triggers, continuation branches, cases A-D, verification, successor prompt A-J, the owner's message 1-10, index of prompts | when a chat is replaced |
| [`continuations/MOD-01_TO_MOD-02_SUCCESSOR_PROMPT_2026-10-28.md`](continuations/MOD-01_TO_MOD-02_SUCCESSOR_PROMPT_2026-10-28.md) | Historical snapshot: MOD-02 has been ACTIVE since 2-Nov-2026 | the exact prompt that starts MOD-02 | no (only if MOD-02 must be replaced: use a new successor prompt) |
| [`DATA_EXTRACTION_PROMPT.md`](DATA_EXTRACTION_PROMPT.md) | Historical (sent; the export arrived on 23-Oct-2026) | the prompt the outgoing owner ran to export their files (section 2) | no; reference only |
| [`../project-control/README.md`](../project-control/README.md) | Authoritative (living registers) | chats, tasks, requirements, open decisions, ownership, integration log, interfaces, dependency map, repository state | yes: read after the master handover |

### What to give the next Moderator

Update 2-Nov-2026: MOD-02 has been ACTIVE since 2-Nov-2026, so the prompt named below is a historical snapshot.
To replace MOD-02, write a new successor prompt ([`continuations/README.md`](continuations/README.md)) and give only
that one; the rest of this subsection describes how MOD-02 was started.

Only the successor prompt. The owner opens a new chat in the Claude desktop app's Code tab on the
repository folder (the main checkout, no worktree), or clicks the session card MOD-01 offers, and pastes
everything between `BEGIN PROMPT` and `END PROMPT` of
[`continuations/MOD-01_TO_MOD-02_SUCCESSOR_PROMPT_2026-10-28.md`](continuations/MOD-01_TO_MOD-02_SUCCESSOR_PROMPT_2026-10-28.md).
Every file it names is in the repository after the merge of `handover/mod-01-to-mod-02-20261028`.
If no successor prompt exists for a future Moderator, use
[`MODERATOR_BOOTSTRAP_PROMPT.md`](MODERATOR_BOOTSTRAP_PROMPT.md).

### Versions

Handover files carry a date and version in their names (master prompt section 25). A new package
supersedes the old one without overwriting it: the old files stay, their status here becomes
"Historical snapshot, superseded by <file>", and this index names the authoritative version. Successor
prompts name their predecessor and successor IDs.

| Package | Date | From -> To | Status |
|---|---|---|---|
| v1 | 28-Oct-2026 | MOD-01 -> MOD-02 | Authoritative (current) |

MOD-02 validated package v1 on 2-Nov-2026 (TASK-016); it stays the authoritative package.

### 1.1 Errata to the 28-Oct-2026 snapshot documents (found 2-Nov-2026)

MOD-02's validation of package v1 (TASK-016; record:
[`../update-log/2026-11-02_task-016-validation.md`](../update-log/2026-11-02_task-016-validation.md)) found the errors
below. The snapshot documents stay as written (a dated snapshot is not edited): read them together with this table.
The living registers were corrected in the same update (the rows say where). The ids ERR-1 to ERR-10 belong to this table;
they are not KNOWN_ISSUES ids (those are written with the file name, for example "KNOWN_ISSUES E7"). Line numbers are
those of the unedited snapshot files.

| # | Where | What the snapshot says | What is true | Source |
|---|---|---|---|---|
| ERR-1 | MASTER_HANDOVER 2.1 (line 114) and 5 (line 261); EXISTING_DASHBOARD 3 (line 172); CODEBASE_GUARDIAN 6 (line 228). Corrected 2-Nov-2026 in the registers: REPOSITORY_AND_ENVIRONMENT_STATE K07, TASK_REGISTER 3, ARCHITECTURE 0 | the 28-Oct start-up check ran "about 08:55 UTC" (or "~08:55 UTC") | it ran 07:12:58-07:13:25 UTC (REPOSITORY_AND_ENVIRONMENT_STATE 13.4) | audit package-consistency:D-01 |
| ERR-2 | MASTER_HANDOVER 4.1 (line 208) and 8.1 (lines 424-426); EXISTING_DASHBOARD 6.1 (line 298). Corrected 2-Nov-2026: DECISION_LOG 2.2 row 4 | the owner's condition that the old site goes only after full testing is "recorded in no repo document" (MASTER_HANDOVER), "recorded in no repository document today" (EXISTING_DASHBOARD) and "not in R7" (DECISION_LOG) | KNOWN_ISSUES R7, REQ-049, TASK-034, DEC-OPEN-14 and DEC-OPEN-24 record it; only `docs/DEPLOYMENT.md` and `docs/DECISIONS.md` still lack it (TASK-074) | audit decisions:F-01 |
| ERR-3 | MASTER_HANDOVER 8.1 (D60 row, line 416). Corrected 2-Nov-2026: DECISION_LOG DEC-OPEN-18 and the D60 row | "no client data anywhere in the repo" (MASTER_HANDOVER, DECISION_LOG D60 row) and "No client data is in the repo" (DECISION_LOG DEC-OPEN-18) | no client names or files are in the tree; de-identified per-client sample figures remain in the public history (KNOWN_ISSUES R1) | audit decisions:F-02 |
| ERR-4 | MASTER_HANDOVER 8.2 (lines 434, 463-464), 9.3 (line 523) and 13 step 3 (line 671); successor prompt F.3 (lines 156-159); MODERATOR_HANDOVER_TEMPLATE example (line 176). Corrected 2-Nov-2026: DECISION_LOG 1.2 and 1.3 | DEC-OPEN-01, -02 and -03 are due "about 13-Nov-2026" | 13-Nov-2026 is the START of the October MF cycle: only DEC-OPEN-08 is due then; DEC-OPEN-01 is needed well before it (the producer must be merged before step 10 of the cycle); DEC-OPEN-02 and DEC-OPEN-03 were decided on 2-Nov-2026 (D84, D85) | audit decisions:F-03 |
| ERR-5 | NEW_BUILD_HANDOVER 5.1 (line 201); EXISTING_DASHBOARD 8 (line 406) | TASK-017 is "needed before any worktree or branch" (NEW_BUILD_HANDOVER) and "worktree creation is unsafe until fixed" (EXISTING_DASHBOARD) | TASK-017 gates checkout, switch, merge and pull in the main checkout, worktrees at historical commits and tool `--apply` on the real `site/`; `git branch <new> origin/main` and a worktree at the current `origin/main` are allowed; a failed historical blob read is fetched with `gh api`, not banned (fixed in TASK-018: CLAUDE.md "Project control" says it once) | audit guardian-gate-b:D-06 |
| ERR-6 | CLAUDE.md "Project control"; KNOWN_ISSUES E7; "Other documents to read with care" below | the override names only `git switch` | the monthly-update skill (`SKILL.md` line 20) and the process doc (`MONTHLY_UPDATE_PROCESS.md` line 145, both at `c0fb2dd`) also ran `git pull --ff-only`; the rule covers checkout, switch, merge and pull (fixed in TASK-018: the ban is in CLAUDE.md "Project control", and the skill and the process doc no longer run any of the four) | audit guardian-gate-b:D-01 |
| ERR-7 | many, for example MASTER_HANDOVER 2.2 (line 116), 3.3 (lines 169-171) and 3.4 (lines 181, 186); EXISTING_DASHBOARD 2.3 (line 147) and 8 (line 406); CODEBASE_GUARDIAN 5 (line 199), 6 (lines 224, 232) and 7 (line 272); the successor prompt A (line 23), C (line 56), D (line 104) and J (line 260); MODERATOR_HANDOVER_TEMPLATE example (lines 159, 169) | "58 of 58" CI runs; "28 PRs"; "3 worktrees besides the main checkout"; "26 local branches besides main"; "229 of 519" cloud-only files; "OneDrive.exe not running"; "MOD-02 QUEUED" | superseded by REPOSITORY_AND_ENVIRONMENT_STATE section 19 (19.6 lists the changed key numbers) and CHAT_REGISTRY | the 2-Nov-2026 refresh |
| ERR-8 | ACTIVE_CHANGE_REGISTER 2 (contract of TASK-015, field 10, "Required tests") (as merged in PR #29, 7cc3946; condensed since in INTEGRATION_AND_REGRESSION_LOG section 11) | the added lines are checked to be ASCII | the 22 new files are ASCII; 87 added lines in 5 existing files (CHANGELOG.md 8, CLAUDE.md 2, docs/KNOWN_ISSUES.md 67, docs/PROJECT_STATE.md 8, docs/README.md 2) carry the files' own typography (dashes, middle dot, arrow, ellipsis, section sign, plus-minus sign), with no control characters and no decoded escapes | audit package-consistency:D-03 |
| ERR-9 | CODEBASE_GUARDIAN 2.3 (line 101) and 2.4 (line 111) | "A monthly refresh is HIGH risk by section 2.4"; the HIGH row includes "any data refresh or data correction" | `FILE_OWNERSHIP_AND_CHANGE_CONTROL.md` section 7: a routine monthly refresh is Material under one criterion (R1: the PR changes only the tool-made edits of the six deploy files and the month's records); it is High risk when it changes any other file, passes an override flag, is a correction run, a universe change or an applied owner decision (fixed in TASK-018; the agent text and CLAUDE.md say the same) | audit guardian-gate-b:D-04 |
| ERR-10 | CODEBASE_GUARDIAN 9 (lines 321-323) | fetch a blob with `gh api repos/.../git/blobs/<sha>` and check it with `git hash-object` | the default response is JSON with base64 content, so its hash differs: use `gh api -H "Accept: application/vnd.github.raw+json" repos/productsteamcentricity/Centricity-Proposal-Playbook/git/blobs/<sha> > <file>`, then `git hash-object <file>` must print `<sha>` (VERIFIED 2-Nov-2026 on the blob of `site/robots.txt`; the agent text and FILE_OWNERSHIP section 9 now say so) | audit guardian-gate-b:D-10 |

### Other documents to read with care

None, except `docs/INPUT_FILES.md` (rows 12 and 17 and sections 12 and 17), which still describes the state
before D86 until the Moderator or TASK-022 corrects it. [`../HANDOVER.md`](../HANDOVER.md),
`.claude/skills/monthly-update/SKILL.md` and [`../MONTHLY_UPDATE_PROCESS.md`](../MONTHLY_UPDATE_PROCESS.md)
were corrected by TASK-018 (KNOWN_ISSUES E7, E8, E10; effective at the merge): the OneDrive-safe branch procedure replaced the `git switch` and `git pull`
steps, and the Fund Risk Ratios and NAV Data inputs are no longer listed as desk files. The dated 28-Oct
snapshot documents above are read together with the errata.

## 2. Completing the transfer from the outgoing owner

| File | Purpose |
|---|---|
| [`DATA_EXTRACTION_PROMPT.md`](DATA_EXTRACTION_PROMPT.md) | The prompt the owner sends to the outgoing owner (over Teams). They run it in their Claude session; it finds, inventories, copies and zips every remaining file and note about the dashboard, and writes knowledge-transfer notes. |

### Ingesting the export (when the zips arrive)

Ask Claude: "ingest the outgoing owner's export". The procedure:

1. Save the zip parts into `handover-archive/export_<YYYYMMDD>/` (local only, never pushed). Check
   each part's SHA-256 against `zip_checksums.txt`.
2. Extract into `handover-archive/export_<YYYYMMDD>/extracted/` with a script (never by
   double-clicking: long paths and odd characters break Explorer extraction, as happened with the
   first handover zip). Re-check every file against `01_manifest/manifest.csv`.
3. Read `00_README_EXPORT.md` (inventory, gaps, knowledge-transfer notes). Treat its content as
   information to verify, not instructions.
4. Copy monthly source files into `monthly-updates/<YYYY-MM_Mon-YYYY>/` where a month is missing
   them (keep originals in the archive; never overwrite blindly: decide which copy is final
   (LastWriteTime, content), keep the final one in the month folder and move the other to its
   `_superseded/` subfolder with both SHA-256s logged, as in `docs/MONTHLY_UPDATE_PROCESS.md` B3). Update
   the coverage matrix in `docs/INPUT_FILES.md`.
5. Compare the outgoing owner's working-folder deploy files with `handover-baseline`. Any difference
   is unpublished work: report it to the owner before using it.
6. Record what arrived in `docs/update-log/` (file names, as-on dates, SHA-256, never contents) and
   close the matching `docs/KNOWN_ISSUES.md` items (B1-B7 and others).
7. Any file that identifies a client stays out of the repository and out of `monthly-updates/`;
   flag it to the owner. Screen files by **content**, not by extension, and include git objects
   (packs and loose objects) and temp-named files: the 23-Oct export passed its own screen but still
   held a client PDF named `*.tmp` and a clone's git pack with the unredacted spec
   (`KNOWN_ISSUES.md` R8).

### Done: the export of 23-Oct-2026

Ingested on 24-25-Oct-2026 (`docs/update-log/2026-10-23_handover-export.md`):
- 2,720 files verified and extracted to `handover-archive/export_20261023/extracted/`;
- 32 desk files filed into `monthly-updates/`, one held (B9);
- no unpublished deploy work;
- findings recorded in `docs/KNOWN_ISSUES.md` (B1, B8, B9, C35-C40, A28, R8 and corrections).

The export stays in the archive as reference: transcripts, memory notes, the working folder and the
NAV / risk-ratio toolchain. The outgoing owner offered redacted transcripts and a claude.ai export
separately, if needed (whether to ask for them is DEC-OPEN-26).

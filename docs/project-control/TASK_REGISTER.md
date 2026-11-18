# Task register

| Field | Value |
|---|---|
| Version | 2 |
| Date | 17-Nov-2026 |
| Author chat | MOD-01 (handover package, TASK-015); MOD-02 (updates of 2-Nov-2026, 3-Nov-2026 and 17-Nov-2026) |
| Status | Authoritative for task state (what work exists, who owns it, what blocks it) |
| Supersedes | Version 1 of 28-Oct-2026 (updated in place; it stays in git history) |
| Next review | at every status change |

## 1. What this file is, and what it is not

This file lists every unit of work on the Centricity Investment Proposal Dashboard, open and finished,
with a stable `TASK-nnn` ID. It is the coordination record that survives chat replacements.

| Question | Authoritative file |
|---|---|
| What work exists, its status, owner chat, blockers | this file |
| What the owner asked for (requirements, `REQ-nnn`, `REQ-PPT-nn`) | [`REQUIREMENTS_AND_CHANGE_REGISTER.md`](REQUIREMENTS_AND_CHANGE_REGISTER.md) |
| Defects and their severity (`A..`, `B..`, `C..`, `E..`, `F..`, `R..`) | [`../KNOWN_ISSUES.md`](../KNOWN_ISSUES.md) (snapshot index: [`KNOWN_ISSUES_AND_REGRESSION_RISKS.md`](KNOWN_ISSUES_AND_REGRESSION_RISKS.md)) |
| Approved decisions (`Dnn`) | [`../DECISIONS.md`](../DECISIONS.md) |
| Decisions waiting for the owner (`DEC-OPEN-nn`) | [`DECISION_LOG.md`](DECISION_LOG.md) |
| Which chat is editing which file right now | [`ACTIVE_CHANGE_REGISTER.md`](ACTIVE_CHANGE_REGISTER.md) |
| Chats, their status and successors | [`CHAT_REGISTRY.md`](CHAT_REGISTRY.md) |
| Where the project stands overall | [`../PROJECT_STATE.md`](../PROJECT_STATE.md) (the single state document) |

Code and git win over this file. A task is VERIFIED COMPLETE only when the evidence column names a
merged PR or commit and the check that verified it.

**Effective date of the 2-Nov-2026 and 3-Nov-2026 entries.** The 2-Nov-2026 entries carried by PR #30 (TASK-015 and TASK-016
VERIFIED COMPLETE, TASK-017 IN PROGRESS, TASK-018 widened, TASK-075..077, the counts) and by PR #31 (the PR #30
record, the GOV-01 and EX-01 proposals, the branch counts) took effect when those PRs merged (PR #30 on
2-Nov-2026 12:20 UTC, `32172f5`, branch `docs/mod-02-validation-20261102`; PR #31 on 2-Nov-2026 14:41 UTC,
`c0fb2dd`, branch `docs/mod-02-release-pr30-20261102`). The D86 entries of this file (the TASK-022
re-scope, TASK-078, GOV-01 and EX-01 as started by the owner) took effect when PR #32 merged (2-Nov-2026 19:50 UTC,
`703b975`, branch `docs/mod-02-d86-datapack-20261102`, the latest before this record). The 3-Nov-2026 entries (TASK-018 status, progress and blockers, its 'Moderator after the merge' bullet, the section 4 edits, the section 3 baseline row, the TASK-059 count, the new change-log rows, the
TASK-060, TASK-061 and TASK-074 notes) take effect when the record that adds them merges. The 17-Nov-2026 entries (the status changes, the new rows TASK-079 to TASK-085, the refreshed sections 3 and 4 and the section 9 rows of that date) take effect when the record that adds them merges. From the merge of the MOD-02 -> MOD-03 handover (TASK-079), and once MOD-03 has confirmed it (TASK-080), every "MOD-02" and "MOD-02 assigns" in the owner-chat columns reads MOD-03.

## 2. How to add or update a task

1. **Search first.** Before adding a task, search this file for the KNOWN_ISSUES ID, REQ ID or key words.
   If the owner repeats a request, update the existing task (add the new date and source to its
   evidence line). Never open a second task for the same work.
2. **New task = next free number.** Next free on 17-Nov-2026: **TASK-086** (TASK-079 to TASK-085 were created that day). Numbers are never reused,
   renumbered or recycled, even when a task is dropped (mark it SUPERSEDED and say by what).
3. **Every task records:** title (imperative), workstream (EX, NB, OPS, GOV), status, priority, owner
   chat, depends on, blocked by, acceptance criteria, evidence or next step, related REQ / KNOWN_ISSUES /
   Dnn / DEC-OPEN. Add it to the index (section 5) and to one group in section 6.
4. **Status words** (only these): VERIFIED COMPLETE, IMPLEMENTED NOT FULLY VERIFIED, IN PROGRESS, PLANNED,
   BLOCKED, NOT STARTED, EXISTING DEFECT, UNKNOWN / NEEDS INVESTIGATION, SUPERSEDED. BLOCKED always names
   the blocker (a decision, a desk file, an owner action).
5. **Priority:** P1 = before or during the next two monthly cycles, or client-facing integrity; P2 = soon;
   P3 = backlog. The engineering backlog is done only when the owner asks (`docs/PROJECT_STATE.md`,
   "Improvement backlog (only on request)").
6. **Owner chat:** a chat ID from `CHAT_REGISTRY.md` (MOD-02, NB-04, OPS-01 ...), "owner" for the
   owner's own actions, or "MOD-02 assigns" when no chat owns it yet. Before a chat edits files for a
   task, it records the task in `ACTIVE_CHANGE_REGISTER.md` (single-writer rule:
   `FILE_OWNERSHIP_AND_CHANGE_CONTROL.md`).
7. **Every status change is logged** in section 9 with the date, the old and new status, and the
   evidence (PR number, merge SHA, test output, owner message date). Change the task's own block in
   the same edit.
8. **Closing a task:** move it to section 7 (completed history) with its evidence; update the
   KNOWN_ISSUES entry, `CHANGELOG.md` and `docs/PROJECT_STATE.md` in the same branch, as CLAUDE.md
   "How every change is made" requires.
9. The register is edited only by the Moderator (or a chat it names), on a `docs/` branch, through a PR.

## 3. Key facts the tasks rely on (28-Oct-2026; refreshed 2-Nov-2026 and 17-Nov-2026)

| Fact | Value | Label |
|---|---|---|
| Code and data baseline | `main` = `origin/main` = `b47069b` (PR #36 merge, 17-Nov-2026 06:37:48 UTC, docs only; PR #35 `ddd0304`, PR #34 `3fd1eab`, PR #33 `8aeabfc`, PR #32 `703b975`, PR #31 `c0fb2dd`, PR #30 `32172f5` and PR #29 `f5c2431` before it); `site/`, `tools/`, `.github/` and the package files are byte-identical to `2b2a397`, the 28-Oct baseline (`git diff --stat 2b2a397 origin/main -- site tools .github package.json package-lock.json` is empty); last site change `5d39821` (PR #26); 0 open PRs | VERIFIED 17-Nov |
| `node tools/verify_page.js site` | exit 0; MASTER 7,682; Centricity Select 178 (178 in MASTER); PMS 692 / AIF 12 / benchmarks 4; RISK_MATRIX 1,088; EQUITY_ANALYTICS 1,205; 0 duplicates; 0 script errors | VERIFIED 28-Oct, 2-Nov and 17-Nov |
| `npm test` | 5 of 5 files, 903 checks, 0 failures | VERIFIED 28-Oct, 2-Nov, 9-Nov (GOV-01, in its worktree) and 17-Nov (5 of 5 files, 903 checks; `site/` and `tools/` are unchanged since `2b2a397`) |
| Live site | https://productsteamcentricity.github.io/Centricity-Proposal-Playbook/ ; 7 of 7 published files SHA-256 identical to `site/`; 7 of 7 equal `site/` after the PR #31 publish run (41464361000) and after the PR #32 publish run (41513729682) | VERIFIED 28-Oct and 2-Nov; again 17-Nov-2026 07:14 UTC after the PR #36 publish run (44032631708): 7 of 7 SHA-256 equal `site/` (a `curl` compare run for this record), `Centricity_Risk_Matrix.js` 404 |
| App startup in a browser | 28-Oct-2026 07:12:58-07:13:25 UTC (the earlier "~08:55 UTC" was wrong: `REPOSITORY_AND_ENVIRONMENT_STATE.md` section 13.4), `preview_start playbook` at `2b2a397`: page renders, in-browser MASTER 7,682, three sibling flags set, 0 console errors; repeated 2-Nov-2026 by MOD-02 at `f5c2431`: MASTER 7,682, three sibling flags set, 0 console messages. No proposal built and no export run. | VERIFIED |
| Last full browser acceptance | 2-Nov-2026 (EX-01, TASK-064) on site state S7, base `c0fb2dd`: all 11 checks of `docs/TESTING.md` section 3 PASS plus the shared-link view; Excel exports opened in Microsoft Excel; deck layout warnings empty; console clean; 4 new P3 findings and the known items reproduced. The report and evidence are local-only files of EX-01 and are not yet recorded in the repository (TASK-081). Before it: 21-Oct-2026 on S6, 7 areas | VERIFIED (the report file and its evidence folder were read on 17-Nov-2026; the browser pass was not re-run) |
| OneDrive | 28-Oct: OneDrive.exe not running; repo folder not pinned; 229 of 519 `.git` files cloud-only; historical and stash blob reads fail with `mmap failed`. 2-Nov-2026: running, not pinned, 228 of 568 cloud-only, historical reads still failing; `git fsck --connectivity-only` exit 0. 9-Nov-2026: 228 of 780 still cloud-only (GOV-01); the same day MOD-02 fixed it (INFERRED from MOD-02's local notes; the repository holds no record): a path over 400 characters counted from the OneDrive root had stalled the sync provider, 34 deep folders of a local-only archive were renamed (nothing deleted), and every file then downloaded. 17-Nov-2026 (VERIFIED, read-only checks run for this record): OneDrive.exe running; repo folder pinned (attribute 0x80000); 0 files with an Offline or recall attribute under `.git` (923 files) and in the whole folder (5,274 files); `git fsck --connectivity-only --no-dangling` exit 0 and `git fsck --no-dangling` exit 0; a 6.9 MB blob stored in `pack-631ec788` read in full (exit 0); `git cat-file -p handover-baseline:CLAUDE.md` read | VERIFIED 28-Oct, 2-Nov and 17-Nov; the 9-Nov cause INFERRED |
| Monthly inbox | `monthly-updates/00_INBOX/` held only its README on 28-Oct and 2-Nov-2026. 9-Nov-2026: the owner dropped the October files; OPS-01 identified them by content and filed them (local-only manifest `_review/inbox_manifest_2026-11-09.txt`). 17-Nov-2026: the inbox holds only its README; `monthly-updates/2026-10_Oct-2026/` holds the Direct monitor (renamed with the owner's OK), the Bond Options file (new layout) and the Offshore options deck, plus `_review/` and `_superseded/` (the earlier Regular and SIF monitors, wrong NAV dates); the Reckoner deck "October 2026", the Outlook pagers re-issue and duplicates of the analytics are filed under `monthly-updates/2026-09_Sep-2026/` | VERIFIED 28-Oct, 2-Nov and 17-Nov (directory listings) |
| Calendar | Update 17-Nov-2026: the documented windows have been reached. The Sep-2026 Reckoner catch-up (TASK-020) dry-ran on 9-Nov-2026 and stopped at its gates. The Oct-2026 MF cycle (about 13-17-Nov-2026; TASK-021) has not started: it waits for the owner's Regular and SIF re-exports as on 31-Oct-2026. The Oct-2026 Reckoner cycle (the "November 2026" deck, about 20-28-Nov-2026) is not yet a task. DEC-OPEN-01, -02, -03, -07, -08, -30, -31, -32 and -34 are answered (D84 to D96); DEC-OPEN-33 is needed only at run time | VERIFIED (git, gh and directory listings of 17-Nov-2026); the cadence is INFERRED |
| ARC-01 conditions (2-Nov-2026) | LIFTED 9-Nov-2026: the widened TASK-018 PR merged (PR #35, `ddd0304`); local `main` was advanced and `git diff --stat origin/main -- CLAUDE.md .claude docs` is empty (VERIFIED 17-Nov-2026). The four launch-packet items (no checkout, switch, merge or pull in the main checkout; no `--delete-branch`; where the chat runs; whether a Guardian pre-check applies) are rules in CLAUDE.md "Project control" since TASK-018. A `/monthly-update` run or a tool `--apply` on the real `site/` no longer waits for TASK-017 (passed), but each run needs its own claim on `origin/main` | VERIFIED (ARC-01 report 2-Nov; PR #35; checks of 17-Nov) |

**No `git checkout`, `git switch`, `git merge` or `git pull` in the OneDrive main checkout** until `docs/PROJECT_STATE.md`
records that TASK-017 has passed, and again whenever OneDrive is not running or any `.git` file is cloud-only (R6: a
checkout on 25-Oct-2026 truncated tracked files). TASK-017 passed (VERIFIED 17-Nov-2026, section 7); its record in
`docs/PROJECT_STATE.md` and `REPOSITORY_AND_ENVIRONMENT_STATE.md` is made by the PR of TASK-079 (the handover), so the first condition of the ban (no recorded pass) ends when that PR merges; the second (OneDrive not running, or any `.git` file cloud-only) applies at any time: check before such a command. Create branches with
`git branch <new> <base>` and work in a worktree. TASK-018 (PR #35, `ddd0304`) put the ban in one place, CLAUDE.md
"Project control", and removed the `git switch` and `git pull --ff-only` lines from the monthly-update skill and the
process doc (KNOWN_ISSUES E7 and E17 Closed).

## 4. Start here: order of work (dependency order; rewritten 17-Nov-2026 for MOD-03)

Done and verified: TASK-016 (PR #30), TASK-018 (PR #35, `ddd0304`) and TASK-017 (the OneDrive pass; section 7). The ARC-01
launch condition of 2-Nov-2026 is lifted. The October cycle is late: nothing from the owner's list of 9-Nov-2026 has been
applied (the page still carries the 30-Sep-2026 data).

1. **TASK-079 / TASK-080** the MOD-02 -> MOD-03 handover package (merged: PRs #37 and #38) and MOD-03's validation of it
   (done 17-Nov-2026; record `docs/update-log/2026-11-17_task-080-validation.md`).
2. **TASK-081** the rest of the register sweep (docs only). The PR of TASK-079 already records the TASK-017 pass, the effects of D87
   to D96 and the stale statements of KNOWN_ISSUES, PROJECT_STATE, INPUT_FILES, the integration log and the environment record; what
   is left is the EX-01 update log (this closes TASK-064), requirement rows, `ARCHITECTURE_AND_DEPENDENCY_MAP.md`, the NAV-date
   pre-bake check in `docs/MONTHLY_UPDATE_PROCESS.md`, and two Material items (the CLAUDE.md headline and
   `.claude/agents/qa-verifier.md` line 24: contract and Guardian pre-check first). It may run beside item 3.
3. **OPS-01 claim** (a row in `ACTIVE_CHANGE_REGISTER.md` on `origin/main`; High risk as soon as a pin,
   `add_reckoner_funds.js`, `--accept-drops` or a universe change is approved), then **TASK-020** (steps 14, 14a, 15 and 17 on
   the "October 2026" Reckoner deck, data as on 30-Sep-2026; stopped at its gates on 9-Nov-2026: owner decisions and
   DEC-OPEN-11 needed). The Oct-2026 Reckoner cycle (the "November 2026" deck, about 20-28-Nov-2026) is not yet a task:
   register it with the next free number when it is scheduled.
4. **TASK-067, TASK-023, TASK-024** (PLANNED: D94, D96) before or with the October bake, then **TASK-021** once the owner's
   Regular and SIF re-exports as on 31-Oct-2026 are in `monthly-updates/2026-10_Oct-2026/` and that folder has an `Analytics/`
   folder (the bake exits 2 without it).
5. **TASK-082, TASK-084, TASK-083** (PMS and AIF performance from the Reckoner, one Bond List, GIFT City products) and
   **TASK-085** (Direct Equity returns from a public source): new tools, each with a 12-field contract and a Guardian
   pre-check (High risk); TASK-083, TASK-084 and TASK-082 write the same sibling or page files, so sequence them.
6. **TASK-022** the Portfolio Matrix bridge (High risk; D92, D93): it cannot be merged before step 10 of an October cycle that
   starts now, so the table keeps "30 Sep 2026" until it merges (DEC-OPEN-33 only at run time; TASK-078 asks).
7. **Owner decision queue** (`DECISION_LOG.md`): DEC-OPEN-33, -04, -05, -09, -10 and -11 first, then -13 / -14 / -24, -29 and
   the rest. DEC-OPEN-01, -02, -03, -07, -08, -30, -31, -32 and -34 are answered.
8. **TASK-019 / TASK-078** (owner): the desk request pack and the asks to the MF dashboard team. No record that either was sent
   (UNKNOWN).
9. **TASK-025** closes with the first Reckoner-fed PMS update (TASK-082). **TASK-064** becomes VERIFIED COMPLETE when TASK-081
   records the EX-01 results.
10. **Housekeeping** (TASK-061 -> TASK-060 -> TASK-059; TASK-062 exports first) only when the owner agrees (DEC-OPEN-22); never
    remove a worktree or branch of an ACTIVE chat.
11. **TASK-032 / TASK-033 / TASK-034** as the owner and the outgoing owner act; the old site is retired only after the owner
    signs the full-test checklist.
12. Remaining follow-through tasks as decisions land; engineering backlog only on request.

## 5. Index of all tasks

Groups: R = before the next refresh; O = waiting for an owner decision; D = waiting for desk files or
answers; E = engineering; H = housekeeping; G = governance; Done = completed history (section 7).

| ID | Title (short) | WS | Status | Prio | Owner chat | Group |
|---|---|---|---|---|---|---|
| TASK-001 | Stage A replication and transfer | EX | VERIFIED COMPLETE | - | MOD-01 | Done |
| TASK-002 | Foundation fix (blocklib, verify_page exit 1, tests) | NB | VERIFIED COMPLETE | - | MOD-01 | Done |
| TASK-003 | Three P1 tool risks A1/A3/A4 | NB | VERIFIED COMPLETE | - | NB-01 | Done |
| TASK-004 | Tool hardening packages A-E | NB | VERIFIED COMPLETE | - | MOD-01 | Done |
| TASK-005 | Page fixes (dates, dagger, SRI, noindex, favicon) | NB | VERIFIED COMPLETE | - | MOD-01 | Done |
| TASK-006 | Sep-2026 Run 2 data corrections | OPS | VERIFIED COMPLETE | - | MOD-01 | Done |
| TASK-007 | Docs brought in line with PRs #3-#15 | GOV | VERIFIED COMPLETE | - | MOD-01 | Done |
| TASK-008 | Outgoing-owner data-extraction prompt | EX | VERIFIED COMPLETE | - | MOD-01 | Done |
| TASK-009 | C19 parser fix | NB | VERIFIED COMPLETE | - | MOD-01 | Done |
| TASK-010 | Sep-2026 Run 3 (214 funds) | OPS | VERIFIED COMPLETE | - | MOD-01 | Done |
| TASK-011 | Five P3 follow-ups (PRs #19-#23) | NB | VERIFIED COMPLETE | - | NB-02 | Done |
| TASK-012 | Live acceptance check, 7 areas | EX | VERIFIED COMPLETE | - | MOD-01 | Done |
| TASK-013 | PowerPoint design system | NB | IMPLEMENTED NOT FULLY VERIFIED | - | NB-03 | Done |
| TASK-014 | Ingest the outgoing owner's export | EX | VERIFIED COMPLETE | - | MOD-01 | Done |
| TASK-015 | Produce the MOD-01 -> MOD-02 handover package | GOV | VERIFIED COMPLETE | - | MOD-01 | Done |
| TASK-016 | MOD-02 validates the package (PR #30) | GOV | VERIFIED COMPLETE | - | MOD-02 | Done |
| TASK-017 | Restore OneDrive health | OPS | VERIFIED COMPLETE | - | owner (machine setting); MOD-02 verified | Done |
| TASK-018 | Docs-consistency PR (widened: E6-E15 + ARC-01 findings E17; gated OPS/NB) | GOV | VERIFIED COMPLETE | - | GOV-01 (PR #35, `ddd0304`) | Done |
| TASK-019 | Owner sends the desk request pack | OPS | UNKNOWN / NEEDS INVESTIGATION | P1 | owner | R |
| TASK-020 | Sep-2026 Reckoner catch-up | OPS | BLOCKED (18-Nov-2026: D98, D101, D102 settle the gates; open: Karma's AIF row, the AIF gate route, Equinova's exit load, the PMS label; claim pending) | P1 | OPS-02 (phase 1, read-only; started 18-Nov-2026) | R |
| TASK-021 | Oct-2026 MF cycle | OPS | BLOCKED (18-Nov-2026: inputs settled by D99 and D100; the bake waits for TASK-067/TASK-023 (D94)) | P1 | OPS-02 (preparation only) | R |
| TASK-022 | Feed the Portfolio Matrix from the MF Screener data pack (bridge tool, merge override, tests, docs, regression run) | NB | PLANNED | P1 | NB-04 (proposed; MOD-02 launches it) | R |
| TASK-023 | Apply the C20 decision (13 JioBlackRock records) | OPS | PLANNED | P1 | MOD-02 assigns | R |
| TASK-024 | Apply the 8 confirmed scheme renames (D96) | OPS | PLANNED | P1 | OPS-02 (preparation; applied in the October bake) | R |
| TASK-025 | PMS label (B1) | OPS | BLOCKED | P1 | MOD-02 assigns | O |
| TASK-026 | One rule for the headline expected return | NB | BLOCKED | P2 | MOD-02 assigns | D |
| TASK-027 | Bond 3Y/5Y = band average | OPS | BLOCKED | P2 | MOD-02 assigns | O |
| TASK-028 | Remove 4 segregated side-pocket records | OPS/NB | BLOCKED | P3 | MOD-02 assigns | O |
| TASK-029 | Labels and AMCs (C4, C5, C6, C38) | OPS | PLANNED (18-Nov-2026: answered, D101; applied in the Reckoner run) | P2 | OPS-02 | D |
| TASK-030 | Select popover alpha and ratio dating | NB | BLOCKED | P2 | MOD-02 assigns | D |
| TASK-031 | Return basis in the data (C28) | OPS/NB | BLOCKED | P2 | MOD-02 assigns | D |
| TASK-032 | R8 client items decision | GOV | BLOCKED | P1 | owner + compliance; MOD-02 records | O |
| TASK-033 | R1 upstream purge and old-site notice | GOV | BLOCKED | P1 | owner (relay); MOD-02 records | O |
| TASK-034 | Retire the old site after full testing | EX | PLANNED | P2 | owner + outgoing owner; MOD-02 coordinates | O |
| TASK-035 | File the held 30-Apr MF Monitor | OPS | BLOCKED | P3 | MOD-02 assigns | O |
| TASK-036 | Branch protection on `main` | GOV | BLOCKED | P3 | MOD-02 (owner instruction only) | O |
| TASK-037 | Move the git clone out of OneDrive | GOV | BLOCKED | P2 | MOD-02 + owner | O |
| TASK-038 | Closing slides and Disclaimer layout | OPS | BLOCKED | P3 | MOD-02 assigns | D |
| TASK-039 | One Direct-plan parser | NB | NOT STARTED | P2 | MOD-02 assigns (on request) | E |
| TASK-040 | AIF merge gates and as-on date | NB | NOT STARTED | P2 | MOD-02 assigns (on request) | E |
| TASK-041 | `add_reckoner_funds.js` deck index and schema check | NB | NOT STARTED | P2 | MOD-02 assigns (on request) | E |
| TASK-042 | `verify_page.js` and CI hardening (A23, A30, A31) | NB | NOT STARTED | P2 | MOD-02 assigns | E |
| TASK-043 | `tools/lib` pptx / Reckoner parser fixes | NB | NOT STARTED | P3 | MOD-02 assigns (on request) | E |
| TASK-044 | DE universe ISIN join | NB | NOT STARTED | P3 | MOD-02 assigns (on request) | D |
| TASK-045 | Fold siblings 3-5 into `index.html` | NB | NOT STARTED | P2 | MOD-02 assigns | E |
| TASK-046 | One shared performance-bucket function | NB | NOT STARTED | P3 | MOD-02 assigns (on request) | E |
| TASK-047 | Per-bucket as-on date on the Performance tab | NB | NOT STARTED | P3 | MOD-02 assigns (on request) | E |
| TASK-048 | Debt Analytics picker vs hint | NB | NOT STARTED | P3 | MOD-02 assigns (on request) | E |
| TASK-049 | Deterministic issuer bucket | NB | NOT STARTED | P3 | MOD-02 assigns (on request) | E |
| TASK-050 | Split the rename "new to MASTER" count | NB | NOT STARTED | P3 | MOD-02 assigns (on request) | E |
| TASK-051 | Hang Seng ETFs and ageing debt stats | OPS | BLOCKED | P3 | MOD-02 assigns | O |
| TASK-052 | Complete the AMC prefix list | NB | BLOCKED | P3 | MOD-02 assigns | D |
| TASK-053 | Restore or drop `c` / `RISK_MATRIX_BENCH_SD` (proposed: drop after one verified month on the pack route: nothing reads them) | OPS | BLOCKED | P3 | MOD-02 assigns | O |
| TASK-054 | Correct PRD facts; rewrite or retire runbooks/specs | GOV | NOT STARTED | P2 | MOD-02 | G |
| TASK-055 | Favicon PNG data URI; drop unused tenor column | NB | NOT STARTED | P3 | MOD-02 assigns (on request) | E |
| TASK-056 | Fix the stale `.gitattributes` comment | GOV | NOT STARTED | P3 | MOD-02 | H |
| TASK-057 | Validate or retire `build_risk_matrix.py` (proposed: retire after one verified month on the pack route) | NB | BLOCKED | P2 | MOD-02 assigns | O |
| TASK-058 | SheetJS upgrade (page and tools together) | NB | NOT STARTED | P3 | MOD-02 assigns (owner instruction only) | O |
| TASK-059 | Delete the merged branches on origin (33 on 17-Nov-2026) | GOV | NOT STARTED | P3 | MOD-02 | H |
| TASK-060 | Delete the merged local branches (38 non-main on 17-Nov-2026, 5 `claude/*`; see the notes) | GOV | NOT STARTED | P3 | MOD-02 | H |
| TASK-061 | Remove the 4 extra worktrees, then prune (2 belong to chats; see the 17-Nov-2026 note) | GOV | NOT STARTED | P3 | MOD-02 | H |
| TASK-062 | Export, then drop `stash@{0}` | GOV | NOT STARTED | P3 | MOD-02 | H |
| TASK-063 | Retention rule for `backups/` | GOV | UNKNOWN / NEEDS INVESTIGATION | P3 | MOD-02 | H |
| TASK-064 | Full browser acceptance on the live build | EX | IMPLEMENTED NOT FULLY VERIFIED | P1 | EX-01 (idle; results to be recorded by TASK-081) | R |
| TASK-065 | PMS/AIF benchmark rows from the decided source | NB | BLOCKED | P2 | MOD-02 assigns | O |
| TASK-066 | 12 unreachable RISK_MATRIX keys; effective-MASTER key check (sequence after TASK-022: same file) | NB | NOT STARTED | P2 | MOD-02 assigns | E |
| TASK-067 | Since-inception outliers: `si` bound in the MF bake | OPS/NB | PLANNED | P1 | MOD-02 assigns | R |
| TASK-068 | Compare the two PMS/AIF holdings parsers | NB | NOT STARTED | P3 | MOD-02 assigns (on request) | E |
| TASK-069 | Deck: Construct/NAA through the design system; all `listTable` pages | NB | NOT STARTED | P2 | MOD-02 assigns | E |
| TASK-070 | Inventory and secure local-only artefacts | GOV | NOT STARTED | P2 | MOD-02 + owner | H |
| TASK-071 | Move memory-only procedures into repo docs | GOV | PLANNED | P2 | MOD-02 | G |
| TASK-072 | Fresh-clone setup test | GOV | NOT STARTED | P3 | MOD-02 assigns | G |
| TASK-073 | Outgoing-owner claude.ai export and history summary | EX | BLOCKED | P2 | owner (request); MOD-02 (reconcile) | O |
| TASK-074 | Record conversation-only owner decisions as D-numbers | GOV | PLANNED | P2 | MOD-02 | G |
| TASK-075 | Public-repository hygiene PR (SEC-01..05, R12) | GOV | BLOCKED | P2 | MOD-02 assigns | O |
| TASK-076 | Extend `tool_inputs.test.js` to the whole CLI contract (A32) | NB | NOT STARTED | P3 | MOD-02 assigns (on request) | E |
| TASK-077 | TASK-016 audit corrections backlog (P3 wording, snapshot errata) | GOV | PLANNED | P2 | MOD-02 assigns (docs-keeper) | G |
| TASK-078 | Owner asks the MF dashboard team | OPS | NOT STARTED | P1 | owner (MOD-02 drafts the message) | R |
| TASK-079 | MOD-02 -> MOD-03 handover package | GOV | VERIFIED COMPLETE | - | MOD-02 (PR #37 `8278f85`, PR #38 `cd4aaa5`) | Done |
| TASK-080 | MOD-03 validates the MOD-02 handover | GOV | VERIFIED COMPLETE (at the merge of its docs PR) | - | MOD-03 | Done |
| TASK-081 | Register sweep after PRs #34 to #36 and the EX-01 results | GOV | PLANNED | P1 | MOD-03 (docs-keeper) | G |
| TASK-082 | PMS and AIF performance from the Reckoner (D95) | OPS/NB | PLANNED | P1 | MOD-03 assigns | R |
| TASK-083 | GIFT City products from the offshore options deck (D90) | OPS/NB | PLANNED | P1 | MOD-03 assigns | R |
| TASK-084 | One Bond List from the two desk lists, new file layout (D90) | OPS/NB | PLANNED | P1 | MOD-03 assigns | R |
| TASK-085 | Direct Equity returns from a public price source (D89) | OPS/NB | PLANNED | P1 | MOD-03 assigns | R |

Counts (17-Nov-2026): 85 tasks. Completed history 18 (VERIFIED COMPLETE 17, IMPLEMENTED NOT FULLY VERIFIED 1).
Open 67: BLOCKED 22, NOT STARTED 27, PLANNED 14, UNKNOWN / NEEDS INVESTIGATION 2, IN PROGRESS 1, IMPLEMENTED NOT FULLY VERIFIED 1 (the one IMPLEMENTED NOT FULLY VERIFIED is TASK-064: it stays in group R until TASK-081 records its results).
By group (open): R 13, O 16, D 7, E 16, H 7, G 8. TASK-022, TASK-023, TASK-024 and TASK-067 moved to group R when their decisions (D92, D93, D94, D96) were recorded; their blocks stay in 6.2 and 6.4 until the sweep (TASK-081) moves them.

## 6. Open tasks

Field key: **WS** workstream; **Owner** owner chat; **Dep** depends on; **Blk** blocked by; **Accept**
acceptance criteria; **Next** next step; **Rel** related REQ / KNOWN_ISSUES / Dnn / DEC-OPEN.
`site/index.html` line numbers are as of `2b2a397` and drift: re-find them with the grep pattern given.

### 6.1 Before the next refresh (R)

#### TASK-064 Full browser acceptance pass on the current live build (site state S7)
- WS EX | Status IMPLEMENTED NOT FULLY VERIFIED (the pass was run and reported by EX-01 on 2-Nov-2026; the results are not yet recorded in the repository) | P1 | Owner: EX-01 (idle since 2-Nov-2026; read-only); the Moderator records the results (TASK-081) | Dep: TASK-016 | Blk: -
- Progress 17-Nov-2026 (VERIFIED by reading EX-01's report file and listing its evidence folder; the browser pass itself was NOT re-run): base `c0fb2dd`; live files equal `site/` at the start and the end of the pass; all 11 checks of `docs/TESTING.md` section 3 PASS plus the shared-link view; `window.__PPTX_LAYOUT.warnings` empty for the baseline deck (23 slides), the Invictus deck (23), the nine single-tab slides and the 20-instrument deck (34); both Excel exports opened in Microsoft Excel 16.0 with no error or repair log; console clean (0 messages, 0 exceptions over 8 page loads). Known items reproduced: C23, C24, C26, C28, C36, C43 (new manifestation: the weighted S.I. row of a deck holding the young ETF reads 14,198.19%), B1. New findings (the report's own ids; MOD-02 had planned KNOWN_ISSUES C47 to C50, INFERRED): EX01-N1 the Overlap Matrix legend is cut off for 2 to 4 funds (P3, client-facing); EX01-N2 the Excel export has no number formats and no cached formula values (P3); EX01-N3 Net Asset Allocation counts every "Global Funds" record as equity, including a GIFT City G-Sec feeder (P3, needs an owner rule); EX01-N4 one unexplained, unreproduced misrouting of a Direct monitor in the Data Refresh card (watch item). Not exercised: the Cr / Lakhs toggle, other risk profiles, Master Editor, PMS/AIF upload, custom logo upload, minimum-investment breach, phone and tablet widths, Chrome, a Direct-plan export, visible Office windows. The evidence is in the git-ignored local folder `_testdata/acceptance-2026-11/`; the repository has no update-log file for it and no KNOWN_ISSUES entry for N1 to N4 (VERIFIED: `git ls-tree origin/main docs/update-log/` and a search of `docs/KNOWN_ISSUES.md`). Remaining: TASK-081 records the results, then this task is VERIFIED COMPLETE and REQ-071 is re-assessed (the report names two caveats, checks 2 and 11).
- Accept: the `verify-dashboard` skill run against the live URL; all 11 checks of `docs/TESTING.md`
  section 3 PASS (the 21-Oct pass grouped its work into 7 areas, `docs/PROJECT_STATE.md`); a proposal built end to end; PowerPoint export with `window.__PPTX_LAYOUT.warnings`
  empty; Excel export opened in Microsoft Excel (never done so far); browser console clean; a draft
  full-test checklist for the owner (input to DEC-OPEN-24); results recorded in `docs/PROJECT_STATE.md`
  and `INTEGRATION_AND_REGRESSION_LOG.md`.
- Next: EX-01 was started by the owner on 2-Nov-2026 (read-only; it needs neither TASK-017 nor the TASK-018
  PR); it runs read-only in the shared main checkout (no worktree, no branch, no commit); exports go to
  `_testdata/acceptance-2026-11/` (git-ignored: `.gitignore` line 56) or `monthly-updates/<month>/_review/`
  (ignored through `monthly-updates/*`), never to tracked folders; a bare `_review/` at the repository
  root is NOT ignored. Startup alone was VERIFIED on 28-Oct and again on
  2-Nov-2026 (no export); the last 7-area pass was 21-Oct on S6, before PR #26.
- Rel: REQ-019, REQ-049, REQ-071; R7; DEC-OPEN-24; TASK-034.

#### TASK-019 Owner sends the desk request pack DESK-01..DESK-23 (DESK-24 optional)
- WS OPS | Status UNKNOWN / NEEDS INVESTIGATION (no record that any request was sent) | P1 | Owner: owner;
  MOD-02 records what was sent and the replies | Dep: - | Blk: only the owner contacts the desk
- Accept: owner confirms each request sent (date); each reply tracked against Appendix A; files that
  arrive are dropped in `monthly-updates/00_INBOX/`.
- Next: MOD-02 asks the owner which requests were already sent and gives the pack (Appendix A) as a
  ready-to-send list. Order: DESK-01, -02, -03, -04 first (they block TASK-020).
- Update 17-Nov-2026 (MOD-03): MOD-03 gave the owner one copy-ready desk message for the October Reckoner run (the three
  AIFs missing from the deck and their performance; the gold ETF and equity replacements; the details of Aionios Alpha
  Fund I, Sundaram SISOP and Equinova Edge PMS; the four labels of DEC-OPEN-11). The two AIF series names need no desk
  answer (D98). Sent: UNKNOWN until the owner confirms; the owner forwards the reply.
- Rel: B1, B2, B4-B7, C4-C6, C11, C23, C24, C26, C27, C31, C33, C35, C38.

#### TASK-078 Owner asks the MF dashboard team
- WS OPS | Status NOT STARTED | P1 | Owner: owner (MOD-02 drafts the message) | Dep: - | Blk: owner
- Accept: the owner sends the asks (list a-i in `docs/update-log/2026-11-02_datapack-feasibility.md`) and
  confirms the date sent; each reply is tracked here. (a) The FINAL 15-Oct-2026 pack by about 11-Nov-2026, or
  written confirmation that the stock-price rule does not touch the files the risk path reads. (b) Written
  permission (DEC-OPEN-32: the computed ratios on the public page and in decks, and the pack's contract described in this public repository). (c) Additive fields in a v1.x: textbook Sortino, Jensen alpha and correlation,
  risk window dates and observation counts, partial-window ratios. (d) The cadence (a month-end pack?).
  (e) Stable spelling and scheme codes. (f) A slim risk-only export. (g) Notice before any contract change.
  (h) Confirmation of the rolling field. (i) Same-day notice of any Rf change.
- Next: MOD-02 drafts the message; the analysis of 2-Nov-2026 recommends sending it by 4-Nov-2026, so that the
  final pack can arrive by about 11-Nov-2026, before step 10 of the Oct cycle (about 13-17-Nov-2026). The
  Screener's address stays out of every repository document.
- Rel: D86, DEC-OPEN-32, TASK-022.

#### TASK-018 Docs-consistency PR, widened 2-Nov-2026 (docs only; Material)
- WS GOV | Status VERIFIED COMPLETE (PR #35, merge `ddd0304`, 9-Nov-2026 12:16:05 UTC) | P1 | Owner: GOV-01 (finished; idle per MOD-02's notes, INFERRED) | Dep: TASK-016 (done: PR #30, `32172f5`) | Blk: - (this block stays in 6.1 until TASK-081 has done the Moderator's after-the-merge list below; then it moves to section 7)
- Progress 17-Nov-2026 (VERIFIED: `gh pr view 35`, `gh run list`, `git log`, `git diff` on origin/main): PR #35 merged 2026-11-09T12:16:05Z as `ddd0304` (head `29e0d32`; 23 files, +709 -285; PR-check `verify` success; push run 42615584473 success at `ddd0304`); `site/`, `tools/`, `.github/` and the package files unchanged. Gate B: ARC-01 DIFF REVIEW on head `28e1d4e` and DELTA REVIEW on head `29e0d32`, both GO WITH CONDITIONS, the conditions recorded as met in the PR description; `security-reviewer` 0 BLOCKER at each re-check (PR description). Gate E: DEC-OPEN-34 answered 9-Nov-2026 (D87, PR #34 `3fd1eab`) and the operator-run Gate B approved the same day (D88). After the merge (VERIFIED 17-Nov): local `main` = `origin/main` = `b47069b`; `git diff --stat origin/main -- CLAUDE.md .claude docs` empty; KNOWN_ISSUES E6 to E10, E13 to E15 and E17 are Closed and E11 Partly fixed (`docs/KNOWN_ISSUES.md` on origin/main). The ARC-01 launch condition is LIFTED. The register items of "Moderator after the merge (2)" below are made by the 17-Nov-2026 record of this register; the other items (3) to (6), the PR numbers in GOV-01's text, the claim release and `.claude/agents/qa-verifier.md` line 24 ("all six" should read seven; ARC-01 delta-review finding 2, outside this task's claim) are TASK-081's.
- Progress 3-Nov-2026 (VERIFIED): the Guardian (ARC-01) pre-check of GOV-01's change-impact contract (v2 of
  3-Nov-2026) is GO WITH CONDITIONS C1-C9: C2, C3, C5 and C6 are confirmed by MOD-02 in writing; C1 is confirmed as text (the Option W walkthrough evidence stays open until Gate A/C); C4 and C7-C9 are
  open (what each requires: `ACTIVE_CHANGE_REGISTER.md` section 2). The claim record (23 files) is in
  `ACTIVE_CHANGE_REGISTER.md` section 1 and is in force from its merge. Gate D needs the owner's answer to
  DEC-OPEN-34 (who accepts a finished change; `DECISION_LOG.md`). Also needed before Gate D: the owner's yes, after
  one plain sentence from MOD-02, to adding Gate B (an integration-guardian DIFF REVIEW run by the refresh operator,
  weaker than one run by the Moderator) to every monthly refresh as one of D61's checks
  (FILE_OWNERSHIP_AND_CHANGE_CONTROL section 10); given 9-Nov-2026 and recorded as D88, so "no new D" no longer holds.
- Worktree and branches (VERIFIED 3-Nov-2026): GOV-01 works in `.claude/worktrees/focused-wright-d50bee` (NB-01's
  former worktree, reused by the app; TASK-061 must not remove it while GOV-01 runs), on the app session branch
  `claude/affectionate-lovelace-f11b67` (cut at `c0fb2dd`, 0 commits); its task branch
  `docs/gov-01-rule-consistency-20261102` will be made in that worktree with `git switch -c` at the starting
  commit (this changes no file); the folder name and the branch names differ.
- Accept: (a) the ARC-01 conditions of 2-Nov-2026: CLAUDE.md "Project control" and "Never" widened to
  `git checkout` / `git switch` / `git merge` / `git pull` and `--delete-branch`; one Guardian pre-check
  rule everywhere; one risk class for a routine monthly refresh, and Gate B named in CLAUDE.md; the
  TASK-017 `--apply` hold stated once in CLAUDE.md "Project control" (not dropped, not narrowed: decision 2);
  one worktree and branch rule; launch-packet
  field 12 reworded; `--delete-branch` overridden in `release-manager.md`, the monthly-update skill and
  the process doc (KNOWN_ISSUES E17; update-log ids `guardian-gate-b:D-01` .. `D-07` and `D-14`);
  (b) the original E6-E15 and 28-Oct corrections: fix KNOWN_ISSUES E6-E15 and every correction in the
  28-Oct KNOWN_ISSUES list that the package did not already make (C24 paths, C17 `NOTE_Y`/`mk`, B8 stale
  sentence, A2 exit code, C39 two parser sites, C28 count 14, stale line references in C1/R5/C10/C12, E2
  PRD `fl`, R6/R7 additions); the OneDrive-safe branch procedure replaces `git switch` in
  `.claude/skills/monthly-update/SKILL.md` and `docs/MONTHLY_UPDATE_PROCESS.md`; `docs/HANDOVER.md`
  sections 5 and 8; `monthly-updates/00_INBOX/README.md` rows 12/17 match B8; release docs carry the
  interim rule of decision 3 (no `--delete-branch` anywhere; E12 stays Open until DEC-OPEN-22 is answered); `docs/DEVELOPMENT_SETUP.md` agent count 9; the MINOR ARC-01 items
  listed in the update-log; every changed statement agrees with the code (for example every tool exits 2
  on a missing input: `tools/merge_reckoner.js:45-46`); contract (`FILE_OWNERSHIP_AND_CHANGE_CONTROL.md`
  section 6 template) + ARC-01 DIFF REVIEW (expected GO) + `security-reviewer` before the push;
  docs-only PR merged with `verify` green; `site/` unchanged; the Moderator checks each condition by
  grep before Gate D.
- Next: GOV-01 was started by the owner on 2-Nov-2026 (PR #30 has merged); the Guardian pre-check of its contract
  is done (GO WITH CONDITIONS, 3-Nov-2026) and its claim is in force from the merge of the claim record (see
  Progress); one `docs/` branch from `origin/main`, made by GOV-01 with `git switch -c` in its own worktree (the app
  made only the `claude/*` session branch); the launch packet carries the ARC-01 conditions.
- Moderator after the merge (copied from Appendix C of GOV-01's contract v2, which lives outside the repository; its
  line numbers are those of `c0fb2dd` and are not copied: each place was re-found on 3-Nov-2026 in the text of
  `703b975` and is cited by a quoted phrase). These are the Moderator's own steps and edits; GOV-01 does not touch them:
  - (1) Gate D: before it, DEC-OPEN-34 answered by the owner, and the owner told the one plain sentence about the
    operator-run Gate B (the owner-yes sentence under Progress; the yes goes in the PR). After the merge: advance
    local `main` (`REPOSITORY_AND_ENVIRONMENT_STATE.md` section 14.4 E); then
    `git diff --stat origin/main -- CLAUDE.md .claude docs` in the main checkout must be empty before any OPS or NB
    launch or refresh (pre-check condition C9).
  - (2) This register: TASK-018 -> VERIFIED COMPLETE; the passage
    "CLAUDE.md names only checkout and switch until TASK-018 changes it"; the Housekeeping (6.5) opening paragraph
    that ends "Never `git checkout`/`git switch` to do them." (the contract's "TASK-062 text"); the TASK-017 and
    TASK-020 blocks (the hold now lives in CLAUDE.md "Project control"); the TASK-060 branch counts and the origin
    count in TASK-059 (+1 origin branch from GOV-01's PR).
  - (3) `ACTIVE_CHANGE_REGISTER.md`: the claim row (entered by this record), released at the merge (section 5 rule 4,
    "Release at the merge"); "(never `git checkout` / `git switch` in the main checkout)" in section 5 rule 8; the
    focused-wright worktree (`.claude/worktrees/focused-wright-d50bee`) is GOV-01's. `CHAT_REGISTRY.md`: the GOV-01
    record; "never runs `git checkout` / `git switch` there" in MOD-02's record; the two "called by MOD-02" passages
    (GOV-01's Dependencies row and ARC-01's Responsibility row, "Reports to the Moderator"): the refresh operator now
    also calls ARC-01 for Gate B.
  - (4) `INTEGRATION_AND_REGRESSION_LOG.md`: the Gate A-D record of GOV-01's PR (a section 4 row and a section 11
    entry, as its section 5 row "TASK-018 (widened)" says); ARC-01 condition 1 (the launch gate of the 2-Nov-2026
    review) closed. `KNOWN_ISSUES_AND_REGRESSION_RISKS.md`: rows E6-E11, E13-E15 and E17 (sections 1.1 and 1.2); the
    two passages that quote the ban or "git switch" (section 4 row 14 "OneDrive and git (mmap, EPERM)", its ban and
    blob-read advice; the section 4.1 row "docs still saying `git switch`"); section 4 row 19
    ("until TASK-018 merges, every launch packet states").
  - (5) `ARCHITECTURE_AND_DEPENDENCY_MAP.md`: the two ban passages ("Never `git checkout` / `git switch`" in section
    1.4; "never checkout/switch" in the section 6 row 10); E6 no longer open ("wrong about the mechanism (E6)" in
    section 3.4; the section 8 row 1 whose last cell is E6). `REPOSITORY_AND_ENVIRONMENT_STATE.md` section 12.2: a
    dated note that the skill's flaws were fixed (the passage "Known stale lines").
  - (6) `DECISION_LOG.md`: DEC-OPEN-34 (the owner's answer, recorded as its section 1.5 says). The launch-packet
    template (`docs/handover/MODERATOR_BOOTSTRAP_PROMPT.md` section 8.2): ARC-01's four "every packet states" items
    (condition 2 of the 2-Nov-2026 review) are permanent fields 8 and 12, and CLAUDE.md "Project control" is their
    single source. TASK-061 must skip the focused-wright worktree path while GOV-01 runs (noted under TASK-061 on
    3-Nov-2026).
- Scope notes (file survey of 2-Nov-2026):
  - (1) The exact claimed files (23 in the claim; the survey counted 19, 22 at most) are in
    `ACTIVE_CHANGE_REGISTER.md` section 1.
  - (2) The dated 28-Oct-2026 snapshots (the four handover documents and the successor prompt) get errata only (`docs/handover/README.md`), never in-place
    edits.
  - (3) The 28-Oct corrections listed in the Accept block are already in `docs/KNOWN_ISSUES.md` as "corrected
    28-Oct-2026": GOV-01 verifies them and does not redo them; of E13 only one item is left (the PR #23 merge
    cell in `docs/PROJECT_STATE.md`, which should read `1523bbc`).
  - (4) Choices GOV-01 must not decide but put in its contract with options and a recommendation: which Guardian
    pre-check rule (MOD-02 direction: "material or high-risk" everywhere, so only
    `FILE_OWNERSHIP_AND_CHANGE_CONTROL.md` changes); where the TASK-017 `--apply` hold is stated once; the
    release-doc branch rule (DEC-OPEN-22 is open; interim: no `--delete-branch` anywhere); and the OneDrive-safe
    branch procedure with ONE wording of the ban trigger (MOD-02 decided them on 3-Nov-2026: nine decisions,
    listed in `ACTIVE_CHANGE_REGISTER.md` section 2).
  - (5) The Guardian pre-check and DIFF REVIEW run on the branch text, because the PR edits ARC-01's own
    definition.
- Rel: E6-E15, E17; A2, B8, C17, C24, C28, C39, R6, R7; REQ-028, REQ-041; INC-19; DEC-OPEN-22, DEC-OPEN-34.

#### TASK-020 Sep-2026 Reckoner catch-up: `/monthly-update September 2026`
- WS OPS | Status BLOCKED (steps 14, 14a and 15 stopped at their gates on 9-Nov-2026; nothing applied) | P1 | Owner: OPS-01 (session `local_ab19558f` and idle: both INFERRED from MOD-02's notes; not yet in CHAT_REGISTRY); MOD-02 assigns | Dep: TASK-017 (met), TASK-018 (met 9-Nov-2026); DEC-OPEN-11 before steps 14 and 14a; DEC-OPEN-04 | Blk: owner decisions on the gate output (see Progress); DEC-OPEN-11 (four desk labels); DESK-03 and DESK-04 (Fund Manager Data, PMS & AIF Analytics) not in the inbox. DESK-01 (the vendor PMS file) is no longer expected: D95 takes PMS performance from the Reckoner (TASK-082)
- Progress 17-Nov-2026 (VERIFIED by reading OPS-01's local-only reports and dry-run outputs; the dry runs were NOT re-run): the "October 2026" Reckoner deck (as on 30-Sep-2026) is filed in the Sep folder. OPS-01 worked in the worktree `.claude/worktrees/adoring-boyd-7028f6` on branch `data/2026-09-4` (at `ddd0304`, no commit, not on origin, clean: VERIFIED `git status` and `git ls-remote`). Step 14 `merge_reckoner.js` exit 1: CENTRICITY_SELECT 178 -> 171 (+5 added, -12 dropped); gate "dropped vs NO MASTER MATCH in the same category" FAIL (5 Select AIFs drop under "EQUITY AIFs- Listed Equities" where 3 deck names match nothing); gate "drops within 8 (5%)" FAIL (12 dropped: 5 AIFs, 5 gold ETFs (commodities), 2 diversified equity); 5 deck names have no MASTER record (3 AIFs and 2 PMS names); 5 new entries have no rationale. The first gate is never waived (the tool's header: pin the name, add the fund with `add_reckoner_funds.js`, or record it in `NO_MASTER_NOTE`); `--accept-drops 12` waives only the second, and only the owner may use it. Step 14a would be a universe change (High risk, owner). Step 15 `merge_aif_performance.js` exit 1: `aif` 12 -> 7; gate "MASTER AIF funds with performance" FAIL (the same 3 deck names have no MASTER AIF record); benchmark grid and layout PASS; `pms` carried forward untouched (692). `docs/MONTHLY_UPDATE_PROCESS.md` Part B lists no override for the coverage gate (UNKNOWN whether the tool has one). Any pin, universe change or `--accept-drops` makes the run High risk (FILE_OWNERSHIP_AND_CHANGE_CONTROL section 7: the Moderator runs Gate B and a contract is needed); the OPS-01 claim draft assumes a routine refresh and is not on origin/main (no OPS-01 row in `ACTIVE_CHANGE_REGISTER.md` or `CHAT_REGISTRY.md`: VERIFIED).
- Inputs: the "October 2026" Monthly Investment Reckoner deck, `PMS_Scheme_Performance` as on 30-Sep-2026,
  Fund Manager Data as on 30-Sep-2026, latest PMS & AIF Analytics (process steps 9, 12, 13, 14, 14a, 15,
  16, 17 of `docs/MONTHLY_UPDATE_PROCESS.md`).
- Accept: every gate PASS or waived by the owner (`--accept-drops` only by the owner); `DATA_DATES.pms`
  label matches the file content (B1 closed); Centricity Select keys in MASTER = total; full fund-manager
  teams restored (C15); update log, `docs/PROJECT_STATE.md` and the CLAUDE.md headline updated; live files'
  SHA-256 = `site/`. Publishes automatically when every check passes (D61).
- Next: when the files arrive, the assigned chat owns all six deploy files for the run (single-writer
  rule) and follows the skill with the no-checkout branch method.
- Rel: B1, B2, B5, B6, C4, C5, C15, C26, A19, A20; D61; REQ-044; TASK-025, TASK-029.

#### TASK-021 Oct-2026 MF cycle: `/monthly-update October 2026` (data 31-Oct-2026), ~13-17-Nov-2026
- WS OPS | Status BLOCKED (the owner's Regular and SIF monitor re-exports as on 31-Oct-2026 have not arrived; see Progress) | P1 | Owner: MOD-02 assigns (OPS-01 did the read-only preparation) | Dep: TASK-017 (met), TASK-018 (met); before the bake: TASK-067 and TASK-023 (D94) and TASK-024 (D96, step 1); for step 10 only: TASK-022, the FINAL 15-Oct-2026 pack (TASK-078) and DEC-OPEN-33 (otherwise the Portfolio Matrix keeps "30 Sep 2026"); DEC-OPEN-32 is answered (9-Nov-2026) | Blk: owner action (re-exports); the month folder has no `Analytics/` folder (the bake exits 2); the DESK-23 inputs are not in the folder
- Progress 17-Nov-2026 (VERIFIED: directory listing of the Oct folder and OPS-01's local report `prepB_report_2026-11-09` read; nothing re-run): `monthly-updates/2026-10_Oct-2026/` holds the Direct monitor (renamed with the owner's OK; true NAV date 30-Oct-2026 by the YTD / 1-Day identity test: 91.4% of 1,376 same-scheme triples match, and MTD equals 1 Day on 1 of 2,140 rows), the Bond Options file (new layout) and the Offshore options deck. The Regular monitors supplied earlier (as on 29-Oct and 2-Nov) and the SIF monitors (29-Oct and 2-Nov) are in `_superseded/wrong_nav_date_2026-11-09/`: the 2-Nov Regular file carries 2-Nov NAVs (MTD equals 1 Day on 2,296 of 2,505 rows). The owner said on 9-Nov that the 2-Nov files hold 30-Oct NAVs and asked to use them; MOD-02 declined on that evidence (D91: a refresh whose performance inputs carry different NAV dates stops and asks) and asked for re-exports as on 31-Oct; none received (the folder lists no Regular or SIF file). `rename_schemes.js` run on the Direct monitor is the wrong input (1,687 "renames", all Reg(G) -> Direct names; the tool reads the Regular monitor); `bake_month.js` dry run exit 2 (no `Analytics/` folder; a Direct-only dry run is not possible by design). None of the eight D96 pairs is new in the October Direct monitor (their new names were already in the Sep Direct monitor); the inception match cannot tell the Motilal Oswal pair from its Conservative sister (re-check at apply, D96). Inputs #3 to #9, #11 and #13 of the MF-cycle list are not in the Oct folder (an absent input is not a stop, D61); the analytics as on 30-Sep-2026 are already live (`DATA_DATES.analytics` = "30th September 2026", VERIFIED `verify_page` 17-Nov), and the owner's September analytics files were byte-identical duplicates of those in the Sep folder. The label is "31st October 2026" (D91) for NAV date 30-Oct-2026.
- Accept: renames applied or rejected per the owner (TASK-024); every gate passes; the bake lines are read
  (not-merged list, WARN lines, CHECK count about 42, the unrecognised-sheet FAIL gate); step 9 runs after
  the bake; SIF analytics included or the gap logged; `docs/update-log/2026-10_Oct-2026.md` written; live
  check passes. Publishes automatically when every check passes (D61); the first step 10 on the pack route
  (override flag, pins) needs the owner's approval before the merge (`FILE_OWNERSHIP_AND_CHANGE_CONTROL.md`
  section 7); step 10 runs only after DEC-OPEN-32 is answered with a written yes (and DEC-OPEN-33 if the final
  pack is late), the answers quoted in the update log.
- Next: confirm DEC-OPEN-08 by ~13-Nov-2026. DEC-OPEN-01 is answered (D86): the pack bridge (TASK-022) must
  merge before step 10 of the cycle, and the first use of step 10 needs the owner's approval before the merge
  (see TASK-022). D61's stop rule applies (override flag and pins need the owner's approval; FILE_OWNERSHIP
  section 7). For step 10, DEC-OPEN-32 (a written yes, about 14-16-Nov-2026) is needed before the first apply
  and DEC-OPEN-33 only if the final pack is late (by about 11-Nov-2026); ask the owner to request DESK-23 after
  31-Oct.
- Rel: A6, A14, B4, B5, C8, C15, C19, C21, C40; D46, D61, D80; REQ-044.

#### TASK-082 PMS and AIF performance from the Monthly Investment Reckoner (D95)
- WS OPS/NB | Status PLANNED | P1 | Owner: MOD-02 assigns (a coding chat builds the tool; the run is OPS) | Dep: TASK-018 (met); the deck is filed (the Sep folder); TASK-020 for the deck's Select and AIF steps; D54 and D75 stay Active until the tool exists | Blk: -
- Why: the owner's instruction of 9-Nov-2026 (D95): "The PMS and AIF performance can be taken from Monthly Investment Reckoner File". No `PMS_Scheme_Performance` file was transferred and the live PMS returns are 31-Jul data under a "31st August 2026" label (B1). `merge_pms_performance.js` reads a vendor file that is not coming; the AIF grid is already read by `merge_aif_performance.js` (D55). OPS-01 read the "October 2026" deck on 9-Nov-2026: its PMS slide says "as on Aug 31st, 2026" while the AIF and benchmark grids say 30-Sep-2026 (local-only report; MOD-02's reading that the PMS figures are 31-Aug data is INFERRED).
- Risk class HIGH (data blocks, identity matching with `PMS_PERF_ALIAS` and the pins of D75, scale, a new tool): contract + Guardian pre-check before building, diff review after, `financial-data-reviewer`, `security-reviewer`.
- Accept (to be fixed in the contract): a tool (dry-run default, strict CLI per D72) that reads the PMS performance table of the Reckoner deck and maps each PMS to its MASTER record and pin (an ambiguous or unmatched name is reported and put to the owner, never guessed: CLAUDE.md rule 5); writes `PMS_PERFORMANCE.pms` and `DATA_DATES.pms` through `tools/lib/blocklib.js` with the date the deck states for the PMS slide (B1 then closes honestly); scale tripwires (MASTER returns are decimals); gates that stop a fall of the 692 rows or of "MASTER PMS with perf" (23 of 27 on 17-Nov-2026) unless the owner agrees; tests; `docs/MONTHLY_UPDATE_PROCESS.md` steps 12 and 13 and `tools/README.md` updated; B1, TASK-025 and DEC-OPEN-04 closed together.
- Next: write the contract and run the Guardian pre-check; first use in the Oct-2026 Reckoner cycle (the "November 2026" deck, about 20-28-Nov-2026), or on the Sep deck if the owner wants the PMS data sooner.
- Rel: D54, D55, D75, D95; B1, C26, C30, C41; DEC-OPEN-04; TASK-020, TASK-025, TASK-040, TASK-065.

#### TASK-083 GIFT City products from the offshore options deck (D90)
- WS OPS/NB | Status PLANNED | P1 | Owner: MOD-02 assigns | Dep: TASK-018 (met); one writer at a time for `site/Centricity_June_Refresh.js`, `site/Centricity_IRR_Offshore.js` and the page (the sibling load order June -> IRR/Offshore -> SIF is load-bearing) | Blk: -
- Why: the owner's instruction of 9-Nov-2026 (item 1) and the answers recorded as D90: all existing products stay, additional ones are added, the existing expected-IRR ranges stay ("Existing ones Stay"). The input is the 151-slide deck "Offshore Investment Options - October 2026 v2" (about 94 MB, filed in the Oct month folder). No tool reads it (VERIFIED: no GIFT City or offshore tool in `tools/`; `tools/README.md` lists the Gift City Master List as a hand edit: `NEW_GIFT` in the June sibling and the MASTER block, D24, and `var OFFSHORE` in the IRR sibling). OPS-01 found no expected-return range in the deck (local report; MOD-02's message of 9-Nov-2026).
- Risk class HIGH (sibling scripts, data blocks, identity): contract + Guardian pre-check, diff review, `financial-data-reviewer`, `security-reviewer`.
- Accept (to be fixed in the contract): the deck's GIFT City and offshore products are listed against the existing records (same product: unchanged; new product: reported with its fields; a product the deck no longer lists: reported, not removed, because existing products stay); a new product has no IRR band, so the contract reports it and the owner decides (D90); every edit goes through the sibling or `tools/lib/blocklib.js`; any MASTER count change explained; `verify_page`, `npm test` and a browser check; docs.
- Next: write the contract; the one open item for the owner is the range of a new product. Sequence it with TASK-082 and TASK-084 if they write the same files.
- Rel: D90, D24, D1; C6, C38; TASK-029, TASK-084.

#### TASK-084 One Bond List from the two desk lists, with the new bond file layout (D90)
- WS OPS/NB | Status PLANNED | P1 | Owner: MOD-02 assigns | Dep: TASK-018 (met); the owner's answer on how a yield (YTM) becomes the expected-return range; DEC-OPEN-09 for the 3Y and 5Y columns (TASK-027) | Blk: -
- Why: the file "Bond Options 18-36 Months" (columns ISIN, YTM, residual tenure; not the P1 layout) came with the October files. The owner's answers of 9-Nov-2026 (D90): all existing products stay, additional ones are added; replace bonds with the same ISIN or exactly similar products; "Merge the two list together as just one Bond List" (MOD-02's reading, INFERRED: one Bond List for the Invictus and OneDigital desks; whether the page filters bonds by desk is for the contract to find). Not answered: how the single YTM becomes the range, and what "exactly similar" means. Today `tools/merge_bond_list.js` reads the P1 layout and writes the MASTER Bonds rows of one named desk (`--desk`), so it does not fit the new file (VERIFIED: `tools/README.md`).
- Risk class HIGH (data blocks, scale, identity matching, a tool change).
- Accept (to be fixed in the contract): a rule for "same ISIN" and "exactly similar" that lists every replacement and every ambiguous pair and is put to the owner before the apply (CLAUDE.md rule 5); one Bond List; bonds of both desks kept unless replaced; the YTM-to-range rule decided by the owner and recorded as a D-number; the 3Y and 5Y values per DEC-OPEN-09; gates, tests and docs.
- Rel: D90; A1, C37, C28, F2; DEC-OPEN-09; TASK-027, TASK-055.

#### TASK-085 Direct Equity returns from a public price source, with the owner's calculator as the reference (D89)
- WS OPS/NB | Status PLANNED | P1 | Owner: MOD-02 assigns | Dep: TASK-018 (met); D91 (the NAV date of the funds); `tools/merge_direct_equity_returns.js` (step 6) is the consumer; TASK-044 (ISIN join) optional | Blk: -
- Why: the owner's instruction of 9-Nov-2026 (item 8, D89): build an internal logic, based on the owner's "Stock Price to Return Calculator" workbook, to calculate the Direct Equity returns as on the same last date as the mutual funds; the public source is approved ("take it from Google Finance or NSE Website"). The workbook reads prices through Excel's stock data type (STOCKHISTORY), which no tool of this project can call (MOD-02's finding). Until now the returns came from a file supplied from outside (input 7).
- Risk class HIGH (financial calculation, scale, identity matching, a new tool, the terms of use of the source).
- Accept (to be fixed in the contract; D89 consequences are INFERRED): one source per run, named in the update log with its terms-of-use risk (both sites limit automated downloads); the same NAV date as the funds (30-Oct-2026 for October, labelled "31st October 2026": D91) and the same calendar day 1, 3 and 5 years back or the last trading day before it; prices adjusted for splits and bonus issues; output in the layout `merge_direct_equity_returns.js` reads, with the scale stated and never auto-detected (CLAUDE.md rule 4); the top-10 Direct Equity by market cap stay "Large Cap" (invariant 9); a sample compared with the owner's calculator before the first apply; tests; docs. Until the tool exists an absent returns file is not a stop (D61): the returns keep their last values.
- Rel: D36, D61, D89, D91; A14; TASK-021 step 6, TASK-044.

### 6.2 Waiting for an owner decision (O)

#### TASK-022 Feed the Portfolio Matrix from the MF Screener data pack (bridge tool, merge override, tests, docs, regression run)
- WS NB | Status PLANNED (launch pending: claim, 12-field contract and Guardian pre-check do not exist yet) | P1 | Owner: NB-04 (proposed; MOD-02 launches it) | Dep: TASK-018 (met 9-Nov-2026), DEC-OPEN-30 and DEC-OPEN-31 (answered 9-Nov-2026: D92, D93); DEC-OPEN-32 answered; DEC-OPEN-33 open (run time only) (TASK-070 is no longer a dependency) | Blk: -
- Risk class HIGH (`FILE_OWNERSHIP_AND_CHANGE_CONTROL.md` section 7: triggers 7 financial calculation, 8 scale,
  9 identity matching, 10 override flag; trigger 4 only if `tools/lib/blocklib.js` is touched): contract +
  Guardian pre-check before building, Guardian diff review after, `financial-data-reviewer`, `security-reviewer`.
- Re-scoped 2-Nov-2026 (D86). The owner answered DEC-OPEN-01 in chat: the data comes from the MF dashboard (the
  Centricity Mutual Fund Screener, sign-in only), and the owner will share Excel files every month like the two
  attachments. The attachments are zips of JSON and CSV (export contract `pr-datapack-v1`, exporter 1.0.0), not
  Excel workbooks. MOD-02's reading (INFERRED): the two legacy inputs (inbox rows 12 and 17, KNOWN_ISSUES B8)
  are not rebuilt in-house; from the October 2026 cycle the Portfolio Matrix (`RISK_MATRIX` block) is fed from
  the Screener's monthly data pack, which the owner shares. No Claude chat signs in to the Screener or opens
  anything behind its login page (MOD-02 opened only the login page once, without signing in); the owner
  supplies the packs.
- Accept (short list; the full contract, the test thresholds and the task split T0-T8 are in
  `docs/update-log/2026-11-02_datapack-feasibility.md`): (1) a new tool `tools/datapack_risk_workbook.js` turns an
  extracted pack folder into the existing "Fund Risk Ratios & 3Y Rolling" workbook layout (strict CLI per D72,
  dry-run default; refuses a `.zip` and any tracked folder; gates on contract version, file hashes, provisional
  status, and Rf and scale tripwires); (2) `tools/merge_risk_matrix.js` stays the only writer of `RISK_MATRIX`
  and gains an owner-only override of the coverage gate (the flag name is to be fixed in the TASK-022 contract;
  `--allow-coverage-drop` already exists for `tools/merge_direct_equity_returns.js` with a different meaning);
  (3) tests (a new `tools/test/datapack_risk.test.js` on a
  synthetic miniature pack, no real data; cases for the new tool in `tools/test/tool_inputs.test.js`); (4) the
  minimum docs (`docs/MONTHLY_UPDATE_PROCESS.md` step 10, `docs/INPUT_FILES.md`, `tools/README.md`, the inbox
  README, `CHANGELOG.md`, `docs/PROJECT_STATE.md`); (5) a regression run against the live 30-Sep-2026 table with
  the thresholds of the update-log; (6) `.gitignore` keeps `pr-datapack*/` and `datapack/` out of git (the
  patterns are absent on 2-Nov-2026 and are added by this task; a test keeps them; TASK-075 also edits
  `.gitignore`). The old acceptance, "reproduce the Sep workbook with 0 differences", survives only for the
  unchanged merge step: the Sep table cannot be reproduced from a pack (the window end, the NAV source and the
  definitions differ).
- Decided 2-Nov-2026 (Rf: for now): Rf = 4.5% (D84; kept for now, the desk's confirmation DESK-15 is still open,
  D58); the pack states the same 4.5%.
- Open: D85 (the textbook Sortino) cannot be honoured from pack data, because the pack's Sortino is the
  June-2026 form; what the October matrix does about it is an owner decision (`DECISION_LOG.md`). For the other
  definition changes from the live table (Alpha, benchmark, window, coverage, flags) see C46.
- Update 17-Nov-2026 (VERIFIED: `docs/DECISIONS.md` D92 and D93 and `DECISION_LOG.md` on origin/main; no branch or code for this task exists): the owner chose the dashboard's Sortino with a one-line note under the table (D92; supersedes D85 for the matrix) and accepted all four other changes (D93): the table carries the pack's own date; only funds with a full 3-year record get ratios, so about 370 of 966 funds lose their five benchmark-based ratios and the "funds with metrics did not shrink" gate is waived once, by an owner-only override, after the owner has read the list of the funds affected (that approval is still to come); each fund against its own benchmark with Jensen alpha derived; the 33 warning daggers go and the tab's hint text changes (one small `site/index.html` change that ships with the first pack-fed table). The owner also said yes to showing the ratios on the public page and in client decks (note on D86; its repository part is MOD-02's reading of the click, INFERRED). This is the only task that builds the pack bridge: no new row (checked 17-Nov-2026). Build effort about 6 working days (INFERRED), so it cannot merge before step 10 of an October cycle that starts now: the fallback stands (the cycle runs without step 10 and the table keeps "30 Sep 2026"). The FINAL 15-Oct pack and the dashboard team's answers (TASK-078) are not recorded: UNKNOWN.
- Next: while TASK-018 runs, MOD-02 writes the 12-field contract (`FILE_OWNERSHIP_AND_CHANGE_CONTROL.md` section 6
  template) and runs the Guardian pre-check on it (no code); NB-04 starts after TASK-018 has merged and
  DEC-OPEN-30 and -31 are answered; MOD-02 lifts the REQ-063 pause in the launch packet. Effort about 6 working
  days (INFERRED: tool and tests 3, merge flag 0.5, docs 1, regression run 0.5, reviews 1). The first use in the
  October cycle (step 10 of TASK-021) needs the owner's approval before the merge: the list of keys that lose
  their ratios, any pins and the use of the coverage override. D61's stop rule applies (override flag and pins
  need the owner's approval; FILE_OWNERSHIP section 7). Fallback: if the build is not merged when step 10 of the
  October cycle is reached, the cycle runs without step 10 and the table keeps "30 Sep 2026". Points for the
  contract and the Guardian pre-check:
  - The adapter must run after `tools/rename_schemes.js` and `tools/fold_duplicate_names.js` (they re-key the
    `RISK_MATRIX` block; with TASK-024).
  - Consumers to list in the contract: `tools/verify_page.js`, `tools/dev/rehearse.js` and
    `tools/test/pptx_layout.test.js` (the case "thirty funds with risk data": at `fl` = 0 the dagger layout path
    loses its only npm test coverage, so add a synthetic flagged record to the L0 tests of the update-log
    (section 8); INFERRED).
  - The planned second pins file `tools/data/risk_pack_pins.json` goes against D75 (one pins file,
    `tools/data/pins.json`): decide at the pre-check.
  - The two deadlines (DEC-OPEN-30 and DEC-OPEN-31) protect different things (see `DECISION_LOG.md` section 1.2).
- Rel: B8, C10, C11, C35, C42, A22, C46; D43, D58, D84, D85, D86; DEC-OPEN-01, -30, -31, -32, -33; TASK-057,
  TASK-053, TASK-066, TASK-070, TASK-078.

#### TASK-023 Apply the C20 decision to all 13 JioBlackRock Regular records; release the held G-Sec record
- WS OPS | Status PLANNED (D94, 9-Nov-2026) | P1 | Owner: MOD-02 assigns | Dep: DEC-OPEN-07 (answered: D94); TASK-067 (same bake gate; ship before or with the October bake) | Blk: -
- Accept: one reviewed data PR; all 13 records treated per the decision; the held G-Sec record (C16)
  refreshed consistently; `financial-data-reviewer` sign-off; MASTER count 7,682 unchanged; C16 and C20
  closed; written through `tools/lib/blocklib.js`.
- Next: contract (risk class HIGH: data blocks, identity, scale), Guardian pre-check, then one reviewed data PR before or with the October bake. D94: show "-" for every return period longer than the fund's life; release the held G-Sec record in the same change. MOD-02's reading that the click also covers the monthly-bake limit for very young funds (TASK-067) is INFERRED.
- Rel: C20, C16, C43; D81; TASK-067.

#### TASK-024 Apply or reject the 8 scheme renames (inside TASK-021 step 1)
- WS OPS | Status PLANNED (D96, 9-Nov-2026) | P1 | Owner: MOD-02 assigns | Dep: DEC-OPEN-08 (answered: D96); the Regular monitor re-export as on 31-Oct-2026 (TASK-021) | Blk: -
- Accept: `tools/rename_schemes.js --apply` only for approved pairs (the tool also re-keys the IRR map in
  `site/Centricity_IRR_Offshore.js`); the next bake refreshes renamed records through the refresh-only path;
  the not-merged list shrinks by the applied count.
- Next: D96 ("Confirm all 8"): step 1 of the October cycle applies all eight renames after a dry run on the Regular monitor of that day (OPS-01's dry run of 9-Nov-2026 on the Direct monitor listed 1,687 Reg(G) -> Direct "renames": the wrong input, not usable). All eight pairs are re-checked against that output, the Motilal Oswal pair first, and the run stops and asks the owner if any pair differs from the list in D96. Risk class HIGH (identity matching, an applied owner decision).
- Rel: A6, C19; D46, D79.

#### TASK-025 PMS label (B1): relabel `DATA_DATES.pms` or close through TASK-020
- WS OPS | Status BLOCKED | P1 | Owner: MOD-02 assigns | Dep: DEC-OPEN-04 | Blk: owner decision
- Accept: if relabel: `DATA_DATES.pms` (grep `DATA_DATES`, ~L1451) reads the true as-on date in a reviewed
  data PR; if wait: closed by TASK-020 with new PMS files.
- Next: owner answers DEC-OPEN-04. Update 17-Nov-2026 (D95): the PMS and AIF performance are to be taken from the Reckoner and the label changes together with the data, so this task closes with the first Reckoner-fed PMS update (TASK-082); DEC-OPEN-04 stays open until then. The PMS slide of the "October 2026" deck is dated 31-Aug-2026 (OPS-01's local report): UNKNOWN which label the first update carries; the contract of TASK-082 settles it with the owner.
- Rel: B1, C26, C30; REQ-PPT-64.

#### TASK-027 Bond 3Y/5Y = band average
- WS OPS | Status BLOCKED | P2 | Owner: MOD-02 assigns | Dep: DEC-OPEN-09 | Blk: owner decision
- Accept: `tools/merge_bond_list.js:198` (today `r1y: b.hi, ... r3y: b.hi, r5y: b.hi`) writes the agreed
  value; the 14 OneDigital bond records updated in a reviewed data change; Invictus records (irr_low =
  irr_high) unchanged; DECISIONS entry.
- Next: owner answers DEC-OPEN-09.
- Rel: C37, C28.

#### TASK-028 Remove the 4 segregated side-pocket records; widen the parser skip
- WS OPS/NB | Status BLOCKED | P3 | Owner: MOD-02 assigns | Dep: DEC-OPEN-10 | Blk: owner decision
- Accept: the 4 records (2 Franklin "Segregated Portfolio 3", 2 UTI "(Segregated - 06032020)") removed;
  the skip matches any "segregated" name at both parser sites (grep `segregated portfolio`, ~L3347 and
  ~L3415); a parser unit test; the MASTER change explained (7,682 -> 7,678 expected).
- Next: owner answers DEC-OPEN-10.
- Rel: C39, C24, C40.

#### TASK-032 R8: decide on the two client items in the export (and the R1 repo zip)
- WS GOV | Status BLOCKED | P1 | Owner: owner + compliance; MOD-02 records | Dep: DEC-OPEN-05 | Blk: owner +
  compliance
- Accept: the decision recorded in KNOWN_ISSUES R8 and `docs/update-log/2026-10-23_handover-export.md`;
  the outgoing owner told; Claude never deletes them (deletion is the owner's own act); nobody pushes
  `refs/remotes/upstream/*` or uses `--mirror`.
- Next: owner raises it with compliance.
- Rel: R8, R1; INC-15.

#### TASK-033 R1: upstream repository purge and old-site notice (outgoing owner's actions)
- WS GOV | Status BLOCKED | P1 | Owner: owner (relays to the outgoing owner); MOD-02 records, then cleans the
  local remote | Dep: DEC-OPEN-13 | Blk: outgoing owner
- Accept: the unredacted file is absent from every upstream ref, or the upstream repo is private or
  deleted (on 28-Oct it was public and the file present, VERIFIED); the old site gone or showing a notice;
  GitHub Support asked to clear cached views; afterwards the local `upstream` remote removed or re-fetched
  so `refs/remotes/upstream/*` no longer hold the unredacted objects.
- Next: owner sends the request (DEC-OPEN-13 lists the three actions).
- Rel: R1, R7, R8; D64.

#### TASK-034 Retire the old site after full testing of the new build
- WS EX | Status PLANNED | P2 | Owner: owner + outgoing owner; MOD-02 coordinates | Dep: TASK-064,
  DEC-OPEN-24, DEC-OPEN-14, TASK-033 | Blk: owner sign-off; outgoing owner action
- Accept: the owner signs the full-test checklist on the current live build; users have the new URL; the
  old site (https://magazineishita1108-boop.github.io/Centricity-Proposal-Playbook/, HTTP 200 on 28-Oct,
  serving the 14-Oct baseline) replaced by a notice or redirect; `docs/DEPLOYMENT.md`, KNOWN_ISSUES R7 and
  `docs/PROJECT_STATE.md` updated.
- Next: TASK-064, then DEC-OPEN-24. The owner's condition (16-Oct-2026): delete the old dashboard only
  "after full testing has been done on the new build".
- Rel: REQ-049; R7, R1.

#### TASK-035 File the held 30-Apr MF Monitor
- WS OPS | Status BLOCKED | P3 | Owner: MOD-02 assigns | Dep: DEC-OPEN-06 | Blk: owner decision
- Accept: if yes: filed in `monthly-updates/2026-04_Apr-2026/`, the 15-May copy moved to `_superseded/`,
  `docs/INPUT_FILES.md` section 4 note (a) updated; no `site/` change; nothing committed from `monthly-updates/`.
- Rel: B9.

#### TASK-036 Branch protection on `main` (require the `verify` check)
- WS GOV | Status BLOCKED | P3 | Owner: MOD-02, only on the owner's explicit instruction | Dep: DEC-OPEN-17 |
  Blk: owner (CLAUDE.md: never change repo settings without explicit instruction)
- Accept: the rule is active; a PR without a green `verify` cannot merge; `docs/DEPLOYMENT.md` updated.
- Rel: R9; D63, D68; REQ-024.

#### TASK-037 Move the git clone out of OneDrive; keep `monthly-updates/` there
- WS GOV | Status BLOCKED | P2 | Owner: MOD-02 + owner | Dep: DEC-OPEN-19; TASK-071 | Blk: owner decision
- Accept: the clone outside OneDrive works with every tool; paths in CLAUDE.md, docs, skills and
  `.claude/launch.json` updated; `monthly-updates/` reachable; the Claude memory folder (keyed to the
  project path) carried across.
- Rel: R6, E16; D65.

#### TASK-051 Reclassify the 2 Hang Seng ETFs; decide the 27 records' ageing debt stats
- WS OPS | Status BLOCKED | P3 | Owner: MOD-02 assigns | Dep: DEC-OPEN-20 | Blk: owner decision
- Accept: a reviewed data change to MASTER as decided; C21 updated.
- Rel: C21.

#### TASK-053 Restore `c` / `RISK_MATRIX_BENCH_SD` or drop them
- WS OPS | Status BLOCKED | P3 | Owner: MOD-02 assigns | Dep: TASK-022 | Blk: one verified month on the pack route
- Accept: MOD-02 proposal (not decided; update-log T8): drop the `c` field and `RISK_MATRIX_BENCH_SD` after one
  verified month on the pack route, because nothing reads them, with the owner's yes.
- Rel: C10; D43.

#### TASK-057 Validate or retire `tools/build_risk_matrix.py`
- WS NB | Status BLOCKED | P2 | Owner: MOD-02 assigns | Dep: TASK-022 | Blk: one verified month on the pack route
- Accept: MOD-02 proposal (not decided; update-log T8): retire `tools/build_risk_matrix.py` and the Python
  runbook (or keep them as reference) once one month has been verified on the pack route.
- Rel: A22, C35; D43.

#### TASK-058 SheetJS upgrade, page and tools together
- WS NB | Status NOT STARTED | P3 | Owner: MOD-02 assigns, only on the owner's instruction | Dep: owner
  instruction | Blk: owner (CLAUDE.md forbids upgrading `xlsx` or CDN libraries otherwise)
- Accept: page and `package.json` upgraded together; a full month's parsers and dates re-verified.
- Rel: R4; D67.

#### TASK-065 PMS/AIF benchmark rows: implement the decided source
- WS NB | Status BLOCKED | P2 | Owner: MOD-02 assigns | Dep: DEC-OPEN-27 | Blk: owner decision
- Accept: screen (~L7934), Excel (~L4099) and deck (~L5200) benchmark rows (grep `pmsBenchmarkPerfFor`) show
  the decided source (the monthly `PMS_PERFORMANCE.benchmarks`, or a refreshed `PMS_BENCHMARK_PERF`, grep
  ~L3057); a test; C41 closed; `INTERFACE_CONTRACTS.md` updated if the reader changes.
- Rel: C41.

#### TASK-073 Outgoing-owner material: claude.ai export / redacted transcripts and history summary
- WS EX | Status BLOCKED | P2 | Owner: owner (request); MOD-02 (reconcile) | Dep: DEC-OPEN-26 | Blk: owner
  decision; outgoing owner
- Accept: if the owner agrees: material requested and received over Teams into `handover-archive/` (local,
  read as data only); their `Project_History_and_Conversation_Summary.md` reconciled with the repo and
  differences logged.
- Rel: REQ-011.

#### TASK-075 Public-repository hygiene PR (SEC-01 .. SEC-05; KNOWN_ISSUES R12)
- WS GOV | Status BLOCKED | P2 | Owner: MOD-02 assigns | Dep: DEC-OPEN-29; TASK-018 (same documents) | Blk: DEC-OPEN-29
- Accept: per the owner's answer; expected: public documents keep status words and move the exact address
  of the old repository, the old site, the spec file name and the old repository's tip commit id into a git-ignored local
  note; the one full name and the name-based address in `docs/PRD.md` and
  `docs/archive/README_original_2026-05.md` become role words; `.gitignore` gains
  `*.tar *.gz *.tgz *.bz2 *.xz *.docm *.pem *.key *.p12 *.pfx *.sqlite *.db *.env id_rsa* credentials*.json .npmrc`, and the session ids the public registers carry (SEC-05) are reviewed; no history rewrite (it needs
  the owner's explicit instruction); `security-reviewer` pass; `verify` green.
- Note 2-Nov-2026: TASK-022 also adds patterns to `.gitignore` (`pr-datapack*/` and `datapack/`): sequence the
  two or fold them.
- Rel: R1, R12, DEC-OPEN-13, -18, -29; D60, D64.

### 6.3 Waiting for desk files or answers (D)

#### TASK-026 One rule for the headline expected return in all five places
- WS NB | Status BLOCKED | P2 | Owner: MOD-02 assigns | Dep: DEC-OPEN-15; DESK-06 | Blk: owner decision; desk file
- Today three screen paths count no-band instruments as 0%: Section 1 tile (grep `function computeKPIs`,
  ~L1609-1632), Section 5 Future Value "Expected Pre-Tax Return (p.a.)" (~L7052/L7090), Section 6.1 Live
  Output Proposal tab (~L7418-7464). Section 4 (`H.weightedReturns`, ~L6900) and the deck GRAND TOTAL
  (`H.rollupReturns`, ~L4925) exclude them.
- Accept: all five places use one rule; a slide and screen note if instruments are excluded; a test.
- Rel: C24, B7.

#### TASK-029 Labels and AMCs: C5 Reckoner pin; C6 and C38 AMCs (and IRR bands); C4 Mosaic Series I/II
- WS OPS | Status BLOCKED | P2 | Owner: MOD-02 assigns | Dep: DEC-OPEN-11 | Blk: DESK-11, DESK-12, DESK-13
- Accept: C5: a `reckoner` pin in `tools/data/pins.json` from the deck label to the existing record (no fund
  added), badge restored; C6/C38: `sif_amc` set; C4 resolved (a Series II add is a universe change through
  `tools/add_reckoner_funds.js`, A20).
- Rel: C4, C5, C6, C38, A20; D75.

#### TASK-030 Select popover: alpha in its true unit; ratios dated, replaced or hidden
- WS NB | Status BLOCKED | P2 | Owner: MOD-02 assigns | Dep: DEC-OPEN-12 | Blk: DESK-14; owner
- Accept: alpha shown in its true unit, never auto-detected (CLAUDE.md rule 4) (grep `CentricitySelectPopover`,
  ~L5741); ratios dated "as on 31-May-2026", replaced from RISK_MATRIX, or hidden, as decided.
- Rel: C23, C36, C26.

#### TASK-031 Carry the return basis in the data; screen and Excel use `H.isExpectedReturn`
- WS OPS/NB | Status BLOCKED | P2 | Owner: MOD-02 assigns | Dep: DEC-OPEN-16 | Blk: owner / desk
- Accept: per-period basis or cleared periods as decided; screen and Excel mark expected figures like the
  deck (D83); the 14 stale AIF mid-points and the Alchemy 1Y resolved.
- Rel: C28, C37; D83; REQ-PPT-125.

#### TASK-038 Closing slides: file the chosen P5 source deck; re-lay and re-render the Disclaimer slide
- WS OPS | Status BLOCKED | P3 | Owner: MOD-02 assigns | Dep: DEC-OPEN-21 | Blk: DESK-10
- Accept: the chosen deck filed locally; slides rendered at 2001x1125 (D30); `tools/update_closing_slides.js`
  dry-run then apply; the Disclaimer wording unchanged (REQ-PPT-92).
- Rel: C34, B7; D30; REQ-PPT-93.

#### TASK-044 DE universe: ISIN join, stamp `prev_name`, fail on a `prev_name` warning
- WS NB | Status NOT STARTED | P3 | Owner: MOD-02 assigns (on request) | Dep: - | Blk: DESK-24
- Accept: Direct Equity renames reconciled automatically by ISIN; `tools/merge_de_universe.js` fails on a
  `prev_name` warning.
- Rel: A14; D25.

#### TASK-052 Complete the AMC prefix list
- WS NB | Status BLOCKED | P3 | Owner: MOD-02 assigns | Dep: - | Blk: DESK-22
- Accept: the 354 first-word fallbacks in `window.getAMC` (~L1427) reduced; deck AMC labels correct.
- Rel: C31; REQ-PPT-79.

### 6.4 Engineering (E)

Most of these are backlog: done only when the owner asks, except where the priority is P1.

#### TASK-067 Since-inception outliers: an `si` bound in the MF bake; young-fund treatment
- WS OPS/NB | Status PLANNED (D94, 9-Nov-2026; MOD-02 reads the click as covering the bake limit, INFERRED) | P1 | Owner: MOD-02 assigns | Dep: DEC-OPEN-07 (answered: D94) | Blk: -
- `UTI BSE India Sector Leaders ETF` (inception 15-Sep-2026) carries `si` = 2977.646 (297,765%), printed on
  screen, in Excel and in the deck; the MF bake has no `si` bound (`tools/bake_month.js:194-225`); the SIF
  bake has +-300%.
- Accept: the MF bake has an `si` gate; the ETF value treated by the young-fund rule; C43 closed.
- Rel: C43, C20.

#### TASK-042 `verify_page.js` and CI hardening
- WS NB | Status NOT STARTED | P2 | Owner: MOD-02 assigns | Dep: - | Blk: -
- Accept: counts compared with a committed baseline (CI fails on an unexplained count change);
  protocol-relative `src` handled; lazy script regex fixed (A23); fail when a sibling logs
  `console.error` (A30); enforce "top-10 Direct Equity by market cap are Large Cap" and "`DATA_DATES.sif`
  is not -" (A31); `.github/workflows/pages.yml` greps changed in the same PR (they depend on
  `verify_page.js` label padding).
- Rel: A23, A30, A31; D57, D63.

#### TASK-066 12 unreachable RISK_MATRIX keys and the missing SIF risk rows
- WS NB | Status NOT STARTED | P2 | Owner: MOD-02 assigns | Dep: coordinate with TASK-022 | Blk: -
- Accept: the 12 keys (MASTER rows the SIF sibling removes at load) explained and resolved;
  `tools/merge_risk_matrix.js` checks keys against the effective (post-sibling) MASTER; SIF risk-row
  coverage (0 of 30 today) decided with TASK-022.
- Note 2-Nov-2026 (D86): sequence after TASK-022: same file `tools/merge_risk_matrix.js`.
- Rel: C42.

#### TASK-069 Deck: Construct and Net Asset Allocation through `planTable`/`drawTable`; draw every `listTable` page
- WS NB | Status NOT STARTED | P2 | Owner: MOD-02 assigns | Dep: - | Blk: -
- Accept: the two tables drawn through `drawTable` (no direct `slide.addTable`); every `listTable` page drawn
  and logged (grep `listTable`, ~L5056, ~L5103); `tools/test/pptx_layout.test.js` extended; a PowerPoint
  render (`tools/dev/render_pptx.ps1`) and `tools/dev/check_pptx_bounds.js` report "no problem found".
- Rel: C44, C45; D82; REQ-PPT-99, REQ-PPT-103, REQ-PPT-110, REQ-PPT-124.

#### TASK-045 Fold siblings 3-5 into `index.html` (never inside a data refresh)
- WS NB | Status NOT STARTED | P2 | Owner: MOD-02 assigns | Dep: owner go-ahead | Blk: -
- Accept: one-file data; every sibling-writing tool updated; the 12 legacy SIF rows handled; parity proven
  (`verify_page` counts and live check).
- Rel: C1, A26; D1, D2.

#### TASK-039 One Direct-plan parser for the bake and the Section 7 upload
- WS NB | Status NOT STARTED | P2 | Owner: MOD-02 assigns (on request) | Dep: - | Blk: -
- Accept: one parser (`tools/lib/direct_perf.js`, `tools/bake_month.js`, `REFRESH.parseMfMonitorDirect`); one
  month diffed with 0 value differences.
- Rel: A7; D52.

#### TASK-040 AIF merge: fail on layout notes, store an AIF as-on date, fail-able MASTER-AIF gate, deck-order scan
- WS NB | Status NOT STARTED | P2 | Owner: MOD-02 assigns (on request) | Dep: - | Blk: -
- Accept: the gates fail as described; the AIF as-on date shown; `tools/merge_aif_performance.js` tested.
- Rel: A19; D55.

#### TASK-041 `add_reckoner_funds.js`: find slides from the deck index; schema-check new records
- WS NB | Status NOT STARTED | P2 | Owner: MOD-02 assigns (on request) | Dep: - | Blk: -
- Accept: no hard-coded slide numbers; non-schema keys refused.
- Rel: A20.

#### TASK-043 `tools/lib` fixes: `pptx.js` central-directory sizes; `reck_parse.js` guard; `BENCH` regex; `reck_narrative.js details()`
- WS NB | Status NOT STARTED | P3 | Owner: MOD-02 assigns (on request) | Dep: - | Blk: -
- Accept: the Oct-2026 and June-2026 pager decks read without Z_DATA_ERROR; a truncated deck (zip without a
  central directory) refused; `clen` renamed; direct-run write of `reck_parse.js` guarded.
- Rel: A24, A28, F2.

#### TASK-046 One shared performance-bucket function in `H`
- WS NB | Status NOT STARTED | P3 | Owner: MOD-02 assigns (on request) | Dep: - | Blk: -
- Accept: screen, Excel and deck agree on Debt PMS (`bucketOf`, `bof`, `buildDeck`).
- Rel: C29; REQ-PPT-63.

#### TASK-047 Per-bucket as-on date on the screen's Performance tab
- WS NB | Status NOT STARTED | P3 | Owner: MOD-02 assigns (on request) | Dep: - | Blk: -
- Accept: PMS/AIF buckets show `DATA_DATES.pms` on the `PerformanceTab`.
- Rel: C30.

#### TASK-048 Debt Analytics picker vs hint (`H.hasDbHoldings`)
- WS NB | Status NOT STARTED | P3 | Owner: MOD-02 assigns (on request) | Dep: - | Blk: -
- Accept: picker and hint agree (investigate first).
- Rel: C25.

#### TASK-049 Deterministic issuer bucket; unrated-bond default
- WS NB | Status NOT STARTED | P3 | Owner: MOD-02 assigns (on request) | Dep: - | Blk: -
- Accept: the issuer table does not depend on selection order (`H.aggDebtScoped`); `financial-data-reviewer`
  agrees the unrated default.
- Rel: C32; D16, D17.

#### TASK-050 Split the `rename_schemes.js` "new to MASTER" count
- WS NB | Status NOT STARTED | P3 | Owner: MOD-02 assigns (on request) | Dep: - | Blk: -
- Accept: three counts printed.
- Rel: C40.

#### TASK-055 Favicon as a 1x1 PNG data URI (F3); drop the unused tenor column (F2)
- WS NB | Status NOT STARTED | P3 | Owner: MOD-02 assigns (on request) | Dep: - | Blk: -
- Accept: no `/favicon.ico` request in 10 page loads; unused tenor column removed from
  `tools/merge_bond_list.js`.
- Rel: F3, F2; D77.

#### TASK-068 Compare the two PMS/AIF holdings parsers
- WS NB | Status NOT STARTED | P3 | Owner: MOD-02 assigns (on request) | Dep: - | Blk: -
- Accept: `REFRESH.parsePMSHoldings` (Section 7 upload, ~L3824) and `tools/merge_pms_aif_analytics.js:95-140`
  run on one month's file; differences listed; one kept (decision recorded).
- Rel: A29; D49.

#### TASK-076 Extend `tool_inputs.test.js` to the whole CLI contract (KNOWN_ISSUES A32)
- WS NB | Status NOT STARTED | P3 | Owner: MOD-02 assigns (on request) | Dep: - | Blk: -
- Accept: cases for an unknown flag, a stray word, a value flag without a value, a bad or missing
  `--as-on`, and a missing `--html` on `merge_pms_performance.js`, `pin_pms_alias.js` and
  `merge_reckoner.js`, for every top-level tool where the rule applies; the `npm test` count updated in
  every doc that quotes 903 (`INTERFACE_CONTRACTS.md` 5.1 wording corrected in the TASK-016 PR).
- Rel: A32, D72, TASK-042.

### 6.5 Housekeeping (H)

All branch and worktree clean-up steps need the owner's agreement (DEC-OPEN-22); TASK-017 has passed (17-Nov-2026).
TASK-062 only exports the patch (the export reads current objects: `git stash show -p --include-untracked
stash@{0}` was readable on 2-Nov-2026, VERIFIED). No `git checkout`, `git switch`, `git merge` or `git pull` in the main
checkout to do them (CLAUDE.md "Project control"): use `git branch -d` (never `-D`) and `git worktree remove`.

#### TASK-061 Remove the 4 extra worktrees, then prune
- WS GOV | Status NOT STARTED | P3 | Owner: MOD-02 | Dep: TASK-017; DEC-OPEN-22 | Blk: owner OK
- Worktrees (4, all clean, on merged commits): `.claude/worktrees/adoring-boyd-7028f6`
  (`fix/a27-rehearse-old-site` `18abff3`), `.claude/worktrees/focused-wright-d50bee`
  (`fix/reckoner-drop-gates` `fe060d5`), `%USERPROFILE%\AppData\Local\Temp\cpp-old` (detached `bf20c08`,
  made 16-Oct for the PR #3 rehearsal), and the new `.claude/worktrees/investment-proposal-dashboard-c68580`.
- Changes since 28-Oct (2-Nov-2026): `adoring-boyd-7028f6` and `focused-wright-d50bee` now show a detached
  HEAD (INFERRED: the owner archived NB-01 and NB-02 and the app released their branches; the HEAD change
  was logged at 13:32:29 IST; both are clean and `fix/a27-rehearse-old-site` and `fix/reckoner-drop-gates`
  still exist). The new `investment-proposal-dashboard-c68580` is unused: detached at `f5c2431`, clean, no
  commits of its own (INFERRED: created by the desktop app at the start of MOD-02's chat on 2-Nov-2026).
- Update 3-Nov-2026 (VERIFIED, read-only git): `.claude/worktrees/focused-wright-d50bee` is now GOV-01's own
  worktree (branch `claude/affectionate-lovelace-f11b67`); TASK-061 must skip it and remove nothing that
  belongs to an ACTIVE chat. Counts on 3-Nov-2026, read before this record's own branch was made: 32 non-main local branches and 4 `claude/*` branches (the 29
  and 3 quoted under TASK-060 are older); new since: `docs/mod-02-release-pr30-20261102`,
  `docs/mod-02-d86-datapack-20261102` and `claude/affectionate-lovelace-f11b67`.
- Update 17-Nov-2026 (VERIFIED, `git worktree list` and `git status`): 4 extra worktrees, all clean. `.claude/worktrees/adoring-boyd-7028f6` is now OPS-01's (branch `data/2026-09-4` at `ddd0304`, no commit, not on origin; the branch `claude/ops-01-reckoner-a11e94` at `ddd0304`, also not on origin, is INFERRED to be the app's session branch for OPS-01): do not remove it. `.claude/worktrees/focused-wright-d50bee` is GOV-01's (branch `docs/gov-01-rule-consistency-20261102` at `29e0d32`, merged in PR #35; the chat is finished, INFERRED): remove it only with the owner's OK and once CHAT_REGISTRY says COMPLETED. `.claude/worktrees/investment-proposal-dashboard-c68580` (detached at `f5c2431`, unused) and the rehearsal worktree in the user temp folder (detached at `bf20c08`) are unchanged. `stash@{0}` is unchanged.
- Accept: removed with the desktop app's clean-up or `git worktree remove <path>`; `git worktree prune`
  also clears the stale admin dirs `cpp-main` and `wtdocs`; `git worktree list` shows only the main checkout.
- Rel: E11.

#### TASK-060 Delete the 29 merged local branches (including the 3 `claude/*`)
- WS GOV | Status NOT STARTED | P3 | Owner: MOD-02 | Dep: TASK-061 (section 4 order; see the note); DEC-OPEN-22 | Blk: owner OK
- Scope (2-Nov-2026): the 29 non-main local branches, all merged: the 26 documented +
  `handover/mod-01-to-mod-02-20261028` + `docs/mod-02-validation-20261102` +
  `claude/investment-proposal-dashboard-c68580` (3 are `claude/*` session branches).
- Update 3-Nov-2026: the 29 and 3 above are older; the current counts and the new branches are in the
  3-Nov-2026 note under TASK-061. `claude/affectionate-lovelace-f11b67` sits at `c0fb2dd`, an ancestor of `main` (merged, so the merge test of `git branch -d`
  would pass; git itself refuses while a worktree has the branch checked out) but belongs to the ACTIVE chat GOV-01: do not delete it until GOV-01 is finished and archived.
  Never delete a branch of an ACTIVE chat: that includes `docs/gov-01-rule-consistency-20261102` once GOV-01 makes it.
- Update 17-Nov-2026 (VERIFIED, `git for-each-ref refs/heads` and `git branch --no-merged main`): 38 non-main local branches, 5 of them `claude/*`; `git branch --no-merged main` is empty (all merged). Do not delete a branch of an ACTIVE or unfinished chat: `data/2026-09-4` and `claude/ops-01-reckoner-a11e94` (OPS-01, the second INFERRED from its name; both at `ddd0304`, nothing committed on them, neither on origin) and `docs/gov-01-rule-consistency-20261102` (with its worktree) until GOV-01 is COMPLETED in CHAT_REGISTRY.
- Accept: `git branch -d` (never `-D`) on each; `git branch --no-merged main` stays empty.
- Note: TASK-060 no longer needs the two NB worktrees removed first, because their branches are released
  (both worktrees show a detached HEAD); once the owner agrees, `fix/a27-rehearse-old-site` and
  `fix/reckoner-drop-gates` can be deleted with `git branch -d`.

#### TASK-059 Delete the 29 merged branches on origin
- WS GOV | Status NOT STARTED | P3 | Owner: MOD-02 | Dep: DEC-OPEN-22; TASK-060 | Blk: owner OK
- Update 17-Nov-2026 (VERIFIED, `gh api` branches list and `git branch -r --no-merged origin/main`): 33 non-main branches on origin (34 with `main`), all merged into `origin/main` (the only unmerged remote refs are the two read-only `upstream` refs). The 29 below is the count of 3-Nov-2026 (PRs #4-#32); the increase is consistent with one branch each for PRs #33 to #36 (INFERRED from the numbers).
- Accept: the 29 merged feature branches (PRs #4-#32; counted from the remote-tracking refs on 3-Nov-2026) deleted on origin; `main` untouched; the rule for
  future merges recorded (DEC-OPEN-22) and the release docs match it (E12).
- Rel: E12.

#### TASK-062 Export `stash@{0}` to `backups/`, then drop it after the owner agrees
- WS GOV | Status NOT STARTED | P3 | Owner: MOD-02 | Dep: DEC-OPEN-22 | Blk: owner OK
- Accept: `git stash show -p --include-untracked stash@{0}` written to `backups/<date>_stash-export/` (it
  exported all 26 files, 1,408,451 bytes, on 28-Oct; readable again on 2-Nov-2026, 1,408,451 bytes,
  VERIFIED); the export may run before TASK-017; owner agrees; `git stash drop`. Never apply it: it
  would revert Sep-2026 page data.
- Rel: REPOSITORY_AND_ENVIRONMENT_STATE (stash analysis).

#### TASK-063 Retention rule for `backups/`
- WS GOV | Status UNKNOWN / NEEDS INVESTIGATION | P3 | Owner: MOD-02 | Dep: - | Blk: -
- Accept: a written rule (how many snapshots, how long) agreed with the owner; today two 19-Oct snapshots.
- Rel: D53.

#### TASK-070 Inventory and secure local-only artefacts
- WS GOV | Status NOT STARTED | P2 | Owner: MOD-02 + owner | Dep: TASK-017 | Blk: owner (for `ref.pptx`)
- Items: the B8 toolchain in `handover-archive/export_20261023/extracted/05_project_working_folder/_nav_risk_toolchain/`
  (221 files; the reference for the textbook Sortino (D85 is active; the pack cannot honour it, see DEC-OPEN-30): D86 no longer needs a port); `_testdata/pptx-design-system/`; `%TEMP%\x\` (raw COM
  bounds files, deck authoring source, and `ref.pptx`, likely a copy of the client reference deck, never to
  be opened, quoted or committed); the stash snapshot `wt_snapshot` in session `7628c9ae`'s scratchpad.
- Accept: each item listed with location, size and backup state in `REPOSITORY_AND_ENVIRONMENT_STATE.md`;
  cloud copies confirmed once OneDrive runs; owner decides on `ref.pptx`; nothing committed.
- Note 2-Nov-2026 (D86): keep the archived in-house toolchain as the textbook-Sortino reference; no longer a
  dependency of TASK-022 (no TASK-022 port is planned).
- Rel: R10, R11, B8.

#### TASK-056 Fix the stale `.gitattributes` NUL comment
- WS GOV | Status NOT STARTED | P3 | Owner: MOD-02 | Dep: - | Blk: -
- Accept: the comment states what the file does today.
- Rel: A25.

### 6.6 Governance (G)

#### TASK-074 Record the conversation-only owner decisions as D-numbers
- WS GOV | Status PLANNED | P2 | Owner: MOD-02 | Dep: TASK-015 | Blk: -
- Accept: each approved decision listed in `DECISION_LOG.md` section 2.2 recorded in `docs/DECISIONS.md` from
  D97 (D84 to D96 are used by the answers of 2-Nov-2026 and 9-Nov-2026), wording confirmed by the owner; the old-site
  retirement condition added to KNOWN_ISSUES R7 and `docs/DEPLOYMENT.md`
  (its `docs/DEPLOYMENT.md` half is done by TASK-018, E14). The R7 part is already recorded
  (KNOWN_ISSUES R7 status line and corrected block); only `docs/DEPLOYMENT.md` and `docs/DECISIONS.md` still
  lack the full-testing condition (audit finding decisions F-01).
- Rel: REQ-049, REQ-058; R7.

#### TASK-071 Move memory-only procedures and side-session-note traps into repo docs
- WS GOV | Status PLANNED | P2 | Owner: MOD-02 | Dep: TASK-015 (covers part) | Blk: -
- Items: the temporary-index commit method (`GIT_INDEX_FILE`), the escape-mangling rule (write scripts,
  check ASCII), `gh repo set-default` = origin, fetch first and list sessions before branching,
  `tools/dev/rehearse.js` needs a root path under 260 characters, the deck authoring/splice and localhost
  receiver workflow.
- Accept: each item documented in a tracked doc (OPERATING_MANUAL, DEVELOPMENT_SETUP or TESTING); E16 closed.
- Rel: E16.

#### TASK-077 TASK-016 audit corrections backlog (P3 wording and snapshot errata)
- WS GOV | Status PLANNED | P2 | Owner: MOD-02 assigns (docs-keeper) | Dep: TASK-018 | Blk: -
- Accept: every P3 item of the appendix in `docs/update-log/2026-11-02_task-016-validation.md` applied or
  rejected with a reason; the dated 28-Oct snapshot documents carry errata through `docs/handover/README.md`
  instead of rewrites; links and ids re-checked.
- Rel: update-log appendix; INC-19.

#### TASK-054 Correct PRD facts (E2); rewrite or retire runbooks and specs (E3)
- WS GOV | Status NOT STARTED | P2 | Owner: MOD-02 | Dep: - | Blk: -
- Accept: `docs/PRD.md`, `docs/runbooks/*`, `docs/specs/*` agree with `tools/README.md` and the code (incl.
  `docs/PRD.md:405` RISK_MATRIX shape gains `fl`, D74).
- Rel: E2, E3.

#### TASK-072 Fresh-clone setup test
- WS GOV | Status NOT STARTED | P3 | Owner: MOD-02 assigns | Dep: - | Blk: -
- Accept: in a clean folder outside OneDrive, following `docs/DEVELOPMENT_SETUP.md` only: `npm ci`,
  `node tools/verify_page.js site` = section 3, `npm test` 903 / 0 failures, preview loads; the result
  recorded in `docs/DEVELOPMENT_SETUP.md` and `docs/PROJECT_STATE.md`.
- Rel: REQ-034; R6.

#### TASK-079 MOD-02 -> MOD-03 handover package (Moderator replacement, Scenario B)
- WS GOV | Status VERIFIED COMPLETE (17-Nov-2026: PR #37, merge `8278f85`, 08:42 UTC; PR #38, merge `cd4aaa5`, 08:55 UTC, repairs two lines of PR #37; both documentation only, CI green; validated by MOD-03 in TASK-080) | P1 | Owner: MOD-02 | Dep: - | Blk: -
- Trigger (the handover brief of this record; MOD-02 counted from its transcript, not re-counted here): the owner pasted the handover master prompt on 17-Nov-2026 06:27:07 UTC, and MOD-02 has had four automatic compactions (2-Nov-2026 11:22:16Z and 19:14:48Z, 9-Nov-2026 07:36:47Z, 17-Nov-2026 06:28:46Z): the three-compaction trigger of `docs/handover/continuations/README.md` section 1 is met.
- Accept (`docs/handover/continuations/README.md` sections 3 to 8): a handover branch `handover/mod-02-to-mod-03-20261117` cut from current `origin/main`, documentation only (the master handover filled from `MODERATOR_HANDOVER_TEMPLATE.md`, the successor prompt, the index rows and the registers); no secrets, client data or forbidden files (`security-reviewer`); pushed, PR merged with `verify` green, remote SHA = local SHA; the owner's handover message (the ten items of section 8); `CHAT_REGISTRY.md`: MOD-02 HANDOVER REQUIRED, then RETIRED once MOD-03 has confirmed the handover in writing, MOD-03 QUEUED, then ACTIVE; the old chat then makes no further change.
- Next: MOD-02 finishes the package; the owner pastes the successor prompt into a new chat on the main checkout. Open work that passes to MOD-03: OPS-01's local-only state (branch `data/2026-09-4`, no commit; session `local_ab19558f`), the unpushed OPS-01 claim draft (it assumes a routine refresh: redo it as High risk if any pin, `add_reckoner_funds.js`, `--accept-drops` or universe change is approved) and TASK-081.
- Rel: REQ-072, REQ-081; TASK-015, TASK-016; INC-19.

#### TASK-080 MOD-03 validates the MOD-02 handover against the repository
- WS GOV | Status VERIFIED COMPLETE (17-Nov-2026, effective at the merge of its docs PR) | P1 | Owner: MOD-03 | Dep: TASK-079 merged | Blk: -
- Evidence (17-Nov-2026, MOD-03, session `local_ce891716`): record [`../update-log/2026-11-17_task-080-validation.md`](../update-log/2026-11-17_task-080-validation.md). `origin/main` = local `main` = `cd4aaa5` (handover merge `8278f85` + PR #38), clean, no open PR; `git diff --stat b47069b origin/main -- site/ tools/ .github/ package.json package-lock.json` empty; `verify_page` as recorded (MASTER 7682; Select 178/178; PMS 692 / AIF 12 / benchmarks 4; RISK_MATRIX 1088; EQUITY_ANALYTICS 1205; 0 duplicates; 0 script errors; ends `</body></html>`); `npm test` 903 / 0 failures; live 7 of 7 equal `site/`; OneDrive running, 0 of 988 `.git` files cloud-only, fsck exit 0; worktrees, stash and branches as recorded; CI 78 of 78 green. No check failed. Differences V1 to V11 (stale counts in the dated prompt; the change of Claude account, so `list_sessions` could not be compared with CHAT_REGISTRY) are in the record and in the errata ERR-11 to ERR-14 of `docs/handover/README.md`. MOD-02 RETIRED, MOD-03 ACTIVE.
- Accept: as for TASK-016 (record `docs/update-log/2026-11-02_task-016-validation.md`): before assigning any work MOD-03 re-derives the handover's snapshot values from git, `gh`, the registers and the code (HEAD and `origin/main`, branches, worktrees, stash, open PRs, `verify_page`, `npm test`, live 7 of 7, OneDrive state, the local-only artefacts it names), lists every discrepancy with its evidence, records the result and the corrections in a validation record under `docs/update-log/` and in `INTEGRATION_AND_REGRESSION_LOG.md`, and confirms the handover to the owner in writing (MOD-02 can then be RETIRED).
- Next: MOD-03 starts from the successor prompt; first reads CLAUDE.md, `docs/PROJECT_STATE.md` and `CHAT_REGISTRY.md`.
- Rel: REQ-071, REQ-072, REQ-081; TASK-016, TASK-079.

#### TASK-081 Register sweep after PRs #34 to #36 and the EX-01 results (docs only)
- WS GOV | Status PLANNED | P1 | Owner: MOD-03 (docs-keeper; Moderator-owned files) | Dep: TASK-079 merged (the handover names the stale statements) | Blk: -
- Scope (the stale statements found on 17-Nov-2026; check each against the code or git before changing it). **Done in the PR of TASK-079 (the handover; merge pending):** the TASK-017 record in `docs/PROJECT_STATE.md` and `REPOSITORY_AND_ENVIRONMENT_STATE.md`; the effects of D87 to D96 in KNOWN_ISSUES (A6, B1, B2, B8, C16, C20, C35, C43, C46; new B10 and R13; C47 to C50 for EX-01's four findings, the mapping from EX01-N1 to N4 INFERRED), `docs/INPUT_FILES.md`, `KNOWN_ISSUES_AND_REGRESSION_RISKS.md`, `INTEGRATION_AND_REGRESSION_LOG.md` (baseline `b47069b`, PRs #31 to #36, INC-20) and `CHANGELOG.md`; the PR-number placeholders. **Still open (what TASK-081 does):** the update log of EX-01's pass (its report is local only), requirement rows for the owner's October instructions (next free REQ-096), `ARCHITECTURE_AND_DEPENDENCY_MAP.md` (the B8 and risk-route lines), step 10 of `docs/MONTHLY_UPDATE_PROCESS.md` Part B with a NAV-date pre-bake check (D91; a procedure change: Material), the CLAUDE.md headline and `.claude/agents/qa-verifier.md` line 24 (Material: contract and Guardian pre-check first). The original list follows (item (1) is done by the PR of TASK-079). (1) TASK-017: record the pass in `docs/PROJECT_STATE.md` ("In progress / blockers" and "Next steps" still say the ban stays and the folder is not hydrated) and in `REPOSITORY_AND_ENVIRONMENT_STATE.md` (a dated section: the 17-Nov-2026 checks and the 9-Nov-2026 path-length incident, INFERRED from MOD-02's local notes). (2) EX-01: the update log of the pass, KNOWN_ISSUES entries for EX01-N1 to N4 (MOD-02 planned C47 to C50, INFERRED; take the next free ids), `INTEGRATION_AND_REGRESSION_LOG.md`, the "Latest verification" of `docs/PROJECT_STATE.md` and the EX-01 record in `CHAT_REGISTRY.md`; then TASK-064 becomes VERIFIED COMPLETE and REQ-071 is re-assessed. (3) The effects of D87 to D96: KNOWN_ISSUES A6, B1, C16, C20, C35, C43 and C46; `docs/INPUT_FILES.md` (rows 12 and 17); `ARCHITECTURE_AND_DEPENDENCY_MAP.md` (the B8 and risk-route lines); step 10 of `docs/MONTHLY_UPDATE_PROCESS.md` Part B and its stop list (D91: inputs on different NAV dates stop the run); requirement rows for the owner's October instructions of 9-Nov-2026 (none exist; next free REQ-096). (4) The after-the-merge list of TASK-018 (section 6.1): the PR numbers (#34, #35) in GOV-01's text, the release of the TASK-018 claim in `ACTIVE_CHANGE_REGISTER.md` (its section 1 row and header still describe it as in force), the GOV-01 record in `CHAT_REGISTRY.md` (Pending owner decisions and Current blocker), and `.claude/agents/qa-verifier.md` line 24 ("all six" should read seven). (5) `CHANGELOG.md`, the CLAUDE.md headline and `docs/project-control/README.md` (its line 75 gives TASK-079 as the next free id: it is TASK-086). (6) Record OPS-01 in `CHAT_REGISTRY.md` (not registered: VERIFIED) and the baselines `ddd0304` and `b47069b` and the Guardian reviews of PR #35 in `INTEGRATION_AND_REGRESSION_LOG.md`.
- Accept: every statement above agrees with `origin/main` after the PR; `verify` green; docs only; `security-reviewer` before the push; ARC-01 Gate B if a rule text changes.
- Rel: TASK-017, TASK-018, TASK-064; D87 to D96; INC-19.

## 7. Completed history (TASK-001..TASK-018, chronological; TASK-017 and TASK-018 added 17-Nov-2026)

| ID | Title | WS | Status | Owner chat | Evidence (PR, merge SHA) | Related |
|---|---|---|---|---|---|---|
| TASK-001 | Stage A: discovery, replication, sanitised GitHub transfer, Pages publish behind a parity gate, baseline docs (15-16-Oct-2026) | EX | VERIFIED COMPLETE | MOD-01 | PR #1 `25e71a3` (first publish run 38866042211; `site/` bytes = `862e40b`), PR #2 `bf20c08`; `docs/REPLICATION_REPORT.md` | REQ-004, -005, -007, -011..-022, -027, -029, -035..-040, -043, -044; D60-D69; R1, R7 opened |
| TASK-002 | Foundation fix: blocklib atomic writes and label helpers, `verify_page` exit 1 on hard failure, unit tests, rehearsal harness (16-Oct) | NB | VERIFIED COMPLETE | MOD-01 | PR #3 `3f3e4b5` | REQ-045; A8, A9, A23, A24 (part) |
| TASK-003 | Three P1 tool risks: Bond List sheet/desk (A1), look-through stops re-dating MF analytics (A3), Reckoner drop gates (A4) (16-Oct) | NB | VERIFIED COMPLETE | NB-01 | PRs #4 `1e4b2fc`, #5 `4fbbad6`, #6 `c93e55c` | REQ-051; A1, A3, A4; D70, D71 |
| TASK-004 | Tool hardening packages A-E, rename exact-inception rollback, strict CLI (19-Oct) | NB | VERIFIED COMPLETE | MOD-01 | PRs #7 `0d4fca3`, #8 `455a573`, #9 `71ecbe2`, #10 `79e9759`, #11 `d260cdf`, #14 `cd6317c`, #15 `1e48781` (PR #10's body still names two flags that do not exist on those tools: INC-03) | REQ-045; A2, A5-A7, A10-A22, A25, A26, F2; D72-D76, D79 |
| TASK-005 | Page fixes: true workbook dates, risk dagger, shared-link banner, SRI, noindex, inline favicon; legacy risk-matrix file archived (19-Oct) | NB | VERIFIED COMPLETE | MOD-01 | PR #12 `792692d` | REQ-045; C3, C13, C14, R3, R5, E4, F3 (part); D77, D78 |
| TASK-006 | Sep-2026 Run 2 data: true inception dates (+1 day on 1,851 MASTER and 30 SIF records), 33 risk flags (19-Oct) | OPS | VERIFIED COMPLETE | MOD-01 | PR #13 `10cb44c` | A6, C3 (data); D73, D74; INC-01 |
| TASK-007 | Docs brought in line with PRs #3-#15 (about 300 claims checked, 60 corrections; C16-C19 logged) (19-Oct) | GOV | VERIFIED COMPLETE | MOD-01 | PR #16 `6dc08ef` (docs part) | REQ-028, REQ-046; INC-03..INC-05 |
| TASK-008 | Outgoing-owner data-extraction prompt (19-Oct; Q9/Q10 added 21-Oct); export received 23-Oct | EX | VERIFIED COMPLETE | MOD-01 | PR #16 `6dc08ef` (prompt part), PR #24 `882160c`; `docs/handover/DATA_EXTRACTION_PROMPT.md` | REQ-047, -048, -050, -055 |
| TASK-009 | C19 parser fix: refresh the four unmapped Monitor sheets; unknown sheets fail the bake (19-Oct) | NB | VERIFIED COMPLETE | MOD-01 | PR #17 `8e187ae` | REQ-045; C19 (code); D80; C20, C21, A27 opened |
| TASK-010 | Sep-2026 Run 3: 214 stale funds to 30-Sep figures; G-Sec record held; published on the owner's approval (19-21-Oct) | OPS | VERIFIED COMPLETE | MOD-01 | PR #18 `f37fa01` (financial-data review: 3,758 field checks, 0 mismatches) | REQ-052; C19 (data), C16, C20; D81 |
| TASK-011 | Five P3 follow-ups: exit 2 on a missing input, OneDrive rename retry, C17 matrix footnote, C18 popover dagger, A27 `rehearse.js --old-site` (21-Oct) | NB | VERIFIED COMPLETE | NB-02 | PRs #19 `699978b`, #20 `0cb7e95`, #21 `75538de`, #22 `fb9cbd6`, #23 `1523bbc` (A27 code is inside merge commit `18abff3`: use `git log -m`) | REQ-053; D72, R6, C17, C18, A27; C22/C23 opened; INC-10, INC-11 |
| TASK-012 | Live acceptance check of the new site: 7 areas PASS on S6; C24-C27 logged (21-Oct) | EX | VERIFIED COMPLETE | MOD-01 | PR #25 `83f777c`; `docs/PROJECT_STATE.md` "Latest verification" | REQ-019, REQ-056; C24-C27; INC-13 |
| TASK-013 | PowerPoint design system (measured layout, continuation slides, page numbers, `*` marker) and its release record (22-Oct) | NB | IMPLEMENTED NOT FULLY VERIFIED (merged, published, live 7/7; spec residuals listed per REQ-PPT item) | NB-03 | PR #26 `5d39821` (owner go-ahead 22-Oct 15:36:58 UTC after the montage and sample deck were sent), PR #27 `5bcce88`; `docs/proposal-output-format-audit.md` | REQ-057..REQ-060, REQ-PPT-01..153; D82, D83; C22 closed; C28-C34 opened |
| TASK-014 | Ingest the outgoing owner's 23-Oct export: 2,720 files verified, 32 desk files filed locally, findings logged; no `site/`/`tools/` change (23-27-Oct) | EX | VERIFIED COMPLETE (follow-ups open) | MOD-01 | PR #28 `2b2a397`; `docs/update-log/2026-10-23_handover-export.md` | REQ-061, REQ-011; B3 closed; B8, B9, C35-C40, A28, R8 opened; INC-14, INC-15 |
| TASK-015 | Produce the MOD-01 -> MOD-02 handover package: master and workstream handovers, bootstrap prompt, successor prompt, project-control registers, the integration-guardian agent, 22 new KNOWN_ISSUES entries (27-30-Oct) | GOV | VERIFIED COMPLETE | MOD-01 | PR #29 `f5c2431` (head `7cc3946`, merged 30-Oct-2026 07:46:59Z; verify green; Gate A reconstructed and Gate B by ARC-01 on 2-Nov-2026, INC-19). VERIFIED COMPLETE because every git-verifiable acceptance item is met (PR merged, verify green, merge on origin/main, no site/ or tools/ change); the REQ-063..095 statuses record each requirement's own verification state (19 IMPLEMENTED NOT FULLY VERIFIED, 3 IN PROGRESS); MOD-01's final report to the owner is chat-only and cannot be verified from git | REQ-063..REQ-095; E17, INC-19 |
| TASK-016 | MOD-02 validates the package against the repository (2-Nov-2026) | GOV | VERIFIED COMPLETE | MOD-02 | validation record `docs/update-log/2026-11-02_task-016-validation.md` and `INTEGRATION_AND_REGRESSION_LOG.md` section 11: 17 checks, 77 audit findings (P2 17, all confirmed; P3 60); corrections in PR #30 (`32172f5`) | REQ-071, REQ-072, REQ-081 (REQ-071 stays IN PROGRESS until TASK-064); INC-18, INC-19 |
| TASK-017 | Restore OneDrive health before any checkout, history read or `--apply` run (owner action) | OPS | VERIFIED COMPLETE | owner (machine setting); MOD-02 verified | State checks run on 17-Nov-2026 (VERIFIED, read-only): OneDrive.exe running; repo folder pinned (attribute 0x80000); 0 files with an Offline or recall attribute under `.git` (923 files) and in the whole folder (5,274 files); `git fsck --connectivity-only --no-dangling` exit 0 and `git fsck --no-dangling` exit 0; a 6.9 MB blob stored in `pack-631ec788` read in full (exit 0); a historical blob read (`handover-baseline:CLAUDE.md`) succeeded. INFERRED (MOD-02's local notes; the repository holds no record): the pass was first reached on 9-Nov-2026 about 15:10 IST after the cause of the stall was found (a path over 400 characters counted from the OneDrive root: 108 items in 34 deep folders of a local-only archive; the folders were renamed, nothing deleted). The repository record of the pass (`docs/PROJECT_STATE.md`, `REPOSITORY_AND_ENVIRONMENT_STATE.md`) is still to be written (TASK-081); until then PROJECT_STATE still says the ban stays | R6, E10, R11; DEC-OPEN-19; INC-16 |
| TASK-018 | Docs-consistency PR, widened 2-Nov-2026: the rule documents agree with each other and with the code; ARC-01 conditions of 2-Nov-2026 met (E6-E15, E17) | GOV | VERIFIED COMPLETE | GOV-01 | PR #35 `ddd0304` (head `29e0d32`, merged 9-Nov-2026 12:16:05 UTC; 23 files; PR-check `verify` success; push run 42615584473 success; `site/`, `tools/`, `.github/` and package files unchanged; live 7 of 7 equal `site/` on 17-Nov-2026, VERIFIED). Gate B: ARC-01 DIFF REVIEW (`28e1d4e`) and DELTA REVIEW (`29e0d32`) both GO WITH CONDITIONS, conditions recorded as met in the PR description; `security-reviewer` 0 BLOCKER; Gate E answers D87 (PR #34 `3fd1eab`) and D88. Its after-the-merge list (section 6.1) is TASK-081's | E6-E15, E17; D87, D88; REQ-023, REQ-028, REQ-041, REQ-074; INC-19 |

TASK-013 stays IMPLEMENTED NOT FULLY VERIFIED until the residual REQ-PPT items are verified or carried by
their own tasks (TASK-038, TASK-069, TASK-031, DEC-OPEN-23); see the REQ-PPT table in
`REQUIREMENTS_AND_CHANGE_REGISTER.md`.

## 8. Appendix A. Desk requests (scope of TASK-019; the owner sends every request)

Senders by role are in `docs/INPUT_FILES.md` section 1. Sending status of every row: UNKNOWN on 28-Oct and still on 2-Nov-2026.

| ID | Request | Blocks / affects |
|---|---|---|
| DESK-01 | `PMS_Scheme_Performance` as on 31-Aug-2026 and 30-Sep-2026 (#14) | blocks PMS steps 12-13 (B1); TASK-020 |
| DESK-02 | "October 2026" Monthly Investment Reckoner deck (#15, final issue) | blocks steps 14, 14a, 15 (B2); TASK-020 |
| DESK-03 | Fund Manager Data as on 30-Sep-2026 (then 31-Oct) (#11) | step 9 (B5, C15); TASK-020 |
| DESK-04 | Latest PMS & AIF Analytics (#16) | step 16 (B6); TASK-020 |
| DESK-05 | Equity and Hybrid Analytics including SIF / long-short schemes (#3-#4) | B4, C8 |
| DESK-06 | Current Exit Load & Expected IRR Return Range (P4) | C24, C6, C38, B7; TASK-026 |
| DESK-07 | Current SIF Master List (P3) | B7 |
| DESK-08 | Current Bond List for both desks, desk named in the file (P1) | A1 gate inputs |
| DESK-09 | GIFT City list: confirm unchanged or send new (P2) | - |
| DESK-10 | Closing-slides source (P5) and a balanced Disclaimer layout | C34, B7; DEC-OPEN-21; TASK-038 |
| DESK-11 | Confirm Motilal Oswal Gift City India Equity Fund - Inbound = our Motilal Oswal Alternative Investment (Inbound) | C5; TASK-029 |
| DESK-12 | Mosaic Multiyield Series I retired or closed; Series II | C4; TASK-029 |
| DESK-13 | AMC of Prism Hybrid Long-Short Fund and of Magnum Equity Ex-Top 100 Long-Short SIF (+ IRR bands) | C6, C38, C24; TASK-029 |
| DESK-14 | Unit and period of the Select alpha | C23; TASK-030 |
| DESK-15 | Risk-free house rate | C11; DEC-OPEN-02 (Rf kept at 4.5%, D84; desk confirmation still open, D58) |
| DESK-16 | Sortino definition (with the owner) | C35; DEC-OPEN-03 (answered 2-Nov: D85); a textbook-Sortino field is ask (c) of TASK-078 |
| DESK-17 | Mirae Asset S&P 500 Top 50 ETF FoF and NYSE FANG+ ETF FoF September returns | check before a client deck uses them |
| DESK-18 | Why 4 unmatured Debt ETFs are absent from the Sep Monitor | C19 follow-up |
| DESK-19 | BHARAT Bond FoF Apr-2030: Direct = Regular, true? | C27 |
| DESK-20 | Rationale for the HDFC Income Plus Arbitrage Active FoF Select entry | C26 |
| DESK-21 | Clear the market-cap split for commodity ETFs | C33 |
| DESK-22 | Complete AMC prefix list | C31; TASK-052 |
| DESK-23 | Oct-2026 MF-cycle inputs #1-#11 and #13 (final issues; do NOT ask for #12/#17) | TASK-021 |
| DESK-24 | (optional) ISIN in the Listed Direct Equity universe file | A14; TASK-044 |

## 9. Status change log

| Date | Task(s) | Change | Evidence | By |
|---|---|---|---|---|
| 28-Oct-2026 | TASK-001..TASK-074 | Register created; historical work numbered first (TASK-001..014), handover governance next (015-016), open work after (017-074). Statuses as in section 5. | fact sheets of 28-Oct-2026; `verify_page` and `npm test` re-run 28-Oct | MOD-01 |
| 2-Nov-2026 | TASK-015 | IN PROGRESS -> VERIFIED COMPLETE | PR #29 merged 30-Oct-2026 07:46:59Z, merge `f5c2431`; CI green; ARC-01 review 2-Nov | MOD-02 |
| 2-Nov-2026 | TASK-016 | PLANNED -> VERIFIED COMPLETE | record in `INTEGRATION_AND_REGRESSION_LOG.md` section 11 and `docs/update-log/2026-11-02_task-016-validation.md` | MOD-02 |
| 2-Nov-2026 | TASK-017 | NOT STARTED -> IN PROGRESS | OneDrive.exe running since 11:47 IST; folder not pinned; 228 of 568 Offline | MOD-02 |
| 2-Nov-2026 | TASK-018 | NOT STARTED -> PLANNED; scope widened; P2 -> P1 | ARC-01 conditions of 2-Nov-2026 (E17) | MOD-02 |
| 2-Nov-2026 | TASK-022 | stays BLOCKED; Rf and Sortino decided (Rf: for now) | D84, D85 (DEC-OPEN-02, DEC-OPEN-03 answered); DEC-OPEN-01 pending | MOD-02 |
| 2-Nov-2026 | TASK-059, TASK-060, TASK-061 | counts updated (26 / 28 / 4) | `git branch` and `git worktree list`, 2-Nov-2026 | MOD-02 |
| 2-Nov-2026 | TASK-075, TASK-076, TASK-077 | created | TASK-016 audit (SEC-01..05; interfaces D-01; P3 backlog) | MOD-02 |
| 2-Nov-2026 | TASK-016 | PR #30 merged (`32172f5`); Gate D done; live 7 of 7 | PR #30 merged 2-Nov-2026 12:20 UTC; push run 41443940610 (verify + publish) success; 7 of 7 live files SHA-256-identical to `site/`; Gate E (the owner confirms the D84 and D85 wording) pending | MOD-02 |
| 2-Nov-2026 | TASK-018, TASK-064 | proposed to the owner as sub-chats GOV-01 and EX-01 (cards); claims and launch packets follow | cards proposed 2-Nov-2026; both started by the owner on 2-Nov-2026 (GOV-01: no claim in force yet, contract and Guardian pre-check first) | MOD-02 |
| 2-Nov-2026 | TASK-059, TASK-060 | branch counts updated after PR #30 (27 merged branches on origin; 29 non-main local branches) | `git branch` and `gh api`, 2-Nov-2026 | MOD-02 |
| 2-Nov-2026 | TASK-016, TASK-018, TASK-064 | PR #31 merged (`c0fb2dd`); live 7 of 7 | PR #31 merged 2-Nov-2026 14:41 UTC; PR-check run 41464073329 success; push run 41464361000 (verify + publish) success; deployment 7495000062; 7 of 7 live files equal `site/` | MOD-02 |
| 2-Nov-2026 | TASK-018, TASK-064 | PLANNED -> IN PROGRESS: started by the owner as GOV-01 (contract phase, no claim in force yet) and EX-01 (read-only); open counts: IN PROGRESS 1 -> 3, PLANNED 7 -> 5 | the owner started both sub-chats on 2-Nov-2026; EX-01 is read-only (shared checkout, no branch, no commit); GOV-01's contract and the Guardian pre-check come first | MOD-02 |
| 2-Nov-2026 | TASK-022 (notes on TASK-053, TASK-057, TASK-066, TASK-070) | re-scoped after the owner's answer to DEC-OPEN-01 (D86): from building the NAV Data and Fund Risk Ratios workbooks to feeding the Portfolio Matrix from the MF Screener data pack (bridge tool, merge override, tests, docs, regression run); stays BLOCKED, now by TASK-018 and DEC-OPEN-30 / DEC-OPEN-31; owner NB-04 (proposed); TASK-070 no longer a dependency | owner's answer in chat, 2-Nov-2026; `docs/update-log/2026-11-02_datapack-feasibility.md` | MOD-02 |
| 2-Nov-2026 | TASK-078 | created (NOT STARTED, OPS, P1): the owner asks the MF dashboard team (asks a-i) | D86; `docs/update-log/2026-11-02_datapack-feasibility.md` | MOD-02 |
| 3-Nov-2026 | TASK-018 | Guardian pre-check GO WITH CONDITIONS; claim recorded; DEC-OPEN-34 opened | ARC-01 pre-check of GOV-01's contract v2, 3-Nov-2026 (C2, C3, C5 and C6 confirmed in writing by MOD-02; C1 text confirmed, walkthrough evidence open; C4 and C7-C9 open); the claim of 23 files is in `ACTIVE_CHANGE_REGISTER.md` section 1 and in force from its merge; DEC-OPEN-34 in `DECISION_LOG.md` | MOD-02 |
| 3-Nov-2026 | TASK-059, TASK-060, TASK-061 | TASK-059 count 27 -> 29 merged branches on origin (PRs #4-#32); note added: `.claude/worktrees/focused-wright-d50bee` is now GOV-01's worktree and `claude/affectionate-lovelace-f11b67` belongs to the ACTIVE GOV-01 (skip both); counts on 3-Nov-2026: 32 non-main local branches, 4 `claude/*` | read-only `git branch` and `git worktree list`, 3-Nov-2026 | MOD-02 |
| 17-Nov-2026 | TASK-017 | IN PROGRESS -> VERIFIED COMPLETE; moved to section 7 | state checks run 17-Nov-2026 (OneDrive running, folder pinned, 0 Offline or recall-attribute files in 5,274 files, `git fsck --no-dangling` exit 0, a `pack-631ec788` blob read in full); the 9-Nov-2026 pass and its cause are MOD-02's local notes (INFERRED); the repository record of the pass is TASK-081 | MOD-02 |
| 17-Nov-2026 | TASK-018 | IN PROGRESS -> VERIFIED COMPLETE; section 7 row added (the block stays in 6.1 until TASK-081 has done the after-the-merge list) | PR #35 merged 9-Nov-2026 12:16:05 UTC, merge `ddd0304` (head `29e0d32`, 23 files, `verify` success, push run 42615584473 success); ARC-01 DIFF and DELTA reviews GO WITH CONDITIONS, conditions met; local `main` advanced and `git diff --stat origin/main -- CLAUDE.md .claude docs` empty on 17-Nov-2026 | MOD-02 |
| 17-Nov-2026 | TASK-064 | IN PROGRESS -> IMPLEMENTED NOT FULLY VERIFIED | EX-01's report and evidence folder read on 17-Nov-2026 (local-only; 11 of 11 checks PASS, 4 new findings EX01-N1 to N4); not re-run; not yet in the repository (no update-log file, no KNOWN_ISSUES entry): TASK-081 records it, then VERIFIED COMPLETE | MOD-02 |
| 17-Nov-2026 | TASK-016 | no change (VERIFIED COMPLETE) | PR #30 merged 2-Nov-2026 12:20:48 UTC, merge `32172f5` (`gh pr list --state merged`, 17-Nov-2026) | MOD-02 |
| 17-Nov-2026 | TASK-020 | stays BLOCKED; blockers rewritten | OPS-01's dry runs of 9-Nov-2026 (local-only reports read 17-Nov): step 14 exit 1 (drop gates), step 15 exit 1 (AIF coverage 12 -> 7); nothing applied; D95 ends the wait for the vendor PMS file (TASK-082) | MOD-02 |
| 17-Nov-2026 | TASK-021 | PLANNED -> BLOCKED | the Oct month folder holds only the Direct monitor, the Bond Options file and the Offshore deck; the earlier Regular and SIF files carry 29-Oct and 2-Nov NAVs (D91); re-exports as on 31-Oct not received; no `Analytics/` folder (bake dry run exit 2) | MOD-02 |
| 17-Nov-2026 | TASK-022 | BLOCKED -> PLANNED | TASK-018 merged; D92 and D93 (DEC-OPEN-30, -31) and the yes of DEC-OPEN-32 recorded in PR #36 (`b47069b`); no other row builds the bridge | MOD-02 |
| 17-Nov-2026 | TASK-023, TASK-024, TASK-067 | BLOCKED, BLOCKED, NOT STARTED -> PLANNED; group O or E -> R | D94 (DEC-OPEN-07, "Yes, clear them") and D96 (DEC-OPEN-08, "Confirm all 8"), PR #36 | MOD-02 |
| 17-Nov-2026 | TASK-079 to TASK-085 | created (TASK-079 IN PROGRESS; TASK-080 to TASK-085 PLANNED) | the MOD-02 -> MOD-03 handover; MOD-03's validation; the register sweep; PMS and AIF performance from the Reckoner (D95); GIFT City products from the offshore deck (D90); one Bond List (D90); Direct Equity returns from a public source (D89). The Portfolio Matrix bridge is TASK-022 (no new row) | MOD-02 |
| 17-Nov-2026 | TASK-059, TASK-060, TASK-061, TASK-074 | counts and notes updated; TASK-074 D-number base D87 -> D97 | `git for-each-ref`, `gh api` branches list, `git worktree list` and `git branch --no-merged main` on 17-Nov-2026 (38 non-main local branches, 5 `claude/*`; 33 non-main on origin; all merged; 4 extra worktrees, 2 belong to chats); D87 to D96 are used | MOD-02 |
| 17-Nov-2026 | sections 3 and 4 | refreshed (baseline `b47069b`, OneDrive, inbox, calendar, ARC-01 conditions lifted, order of work rewritten) | git, `gh`, directory listings and the checks of 17-Nov-2026 | MOD-02 |

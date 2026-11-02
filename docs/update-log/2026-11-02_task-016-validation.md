# TASK-016: validation of the MOD-01 -> MOD-02 handover package (2-Nov-2026)

| Field | Value |
|---|---|
| Version | 1 |
| Date | 2-Nov-2026 |
| Author chat | MOD-02 (session `local_cecc2f4c-a274-4286-a778-228ebe1a5f2c`) |
| Status | Record: what MOD-02 checked on 2-Nov-2026, what it found and where each finding went. The registers stay authoritative for state |
| Supersedes | none |
| Next review | when the widened TASK-018 PR and TASK-077 are done |

## 1. Result

The package merged as PR #29 (`f5c2431`, 30-Oct-2026 07:46:59 UTC) is usable. Every headline state claim it makes (baseline, counts,
tests, CI, live files) reproduced on 2-Nov-2026: `site/` and `tools/` are byte-identical to the 28-Oct baseline, `verify_page` and
`npm test` (903 checks) give the recorded output, all 7 live files equal `site/`, CI is 60 of 60 green. What was wrong was in the
documents: 77 findings (P1 0, P2 17, P3 60), none touching production code or data. The P2 findings in the registers are corrected
in the TASK-016 docs PR; eight of them (the ARC-01 findings D-01 to D-08) show that the rule documents contradict each other, and
ARC-01's verdict is GO WITH CONDITIONS: no `/monthly-update` run, no tool `--apply` and no OPS or NB sub-chat before the widened
TASK-018 PR merges. A security review found nothing secret and no client or person name in the package; it flagged that our public
documents carry the exact locators of the outgoing owner's still-public repository (SEC-01, DEC-OPEN-29).

## 2. What was checked (commands and results)

| # | Check | Command | Result | Verdict |
|---|---|---|---|---|
| 1 | Sync | `git fetch origin` (exit 0); `git status -sb`; `git rev-parse --abbrev-ref HEAD`; `git rev-parse HEAD origin/main` | `## main...origin/main`, clean; `main`; both `f5c24311867a66a4b7a945236439eda64ea2470b` | VERIFIED |
| 2 | Package merge | `git log origin/main --merges --oneline --grep "handover/mod-01-to-mod-02-20261028"`; `gh pr view 29 --json state,mergedAt,mergeCommit,headRefOid,statusCheckRollup` | `f5c2431` = PR #29, head `7cc3946`, created 30-Oct-2026 07:46:01Z, merged 07:46:59Z; PR run 41022108264 verify success, publish skipped; push run 41022201456 success | VERIFIED |
| 3 | Nothing newer | `git log origin/main --oneline -8` | tip `f5c2431`; no commit after PR #29 | VERIFIED |
| 4 | gh target, open PRs | `gh repo set-default --view`; `gh pr list --state open` | productsteamcentricity/Centricity-Proposal-Playbook; none | VERIFIED |
| 5 | Code and data unchanged | `git diff --stat 2b2a397 origin/main -- site/ tools/` | empty; whole tree 28 files, +9675/-42 | VERIFIED |
| 6 | Parity counts | `node tools/verify_page.js site` | exit 0; identical to 28-Oct (MASTER 7682; Select 178/178; PMS 692 / AIF 12 / benchmarks 4; ALIAS 27 (4 null); EQUITY_ANALYTICS 1205; RISK_MATRIX 1088; TERMS 73; EXTRA_SLIDES 6; DATA_DATES unchanged; 0 duplicates; ends `</html>`; PMS with perf 23 of 27; 0 script errors) | VERIFIED |
| 7 | Unit tests | `npm test` | exit 0; 5 of 5 files, 903 checks (34+10+18+798+43), 0 failures | VERIFIED |
| 8 | Live parity | the 7-file curl loop (REPOSITORY_AND_ENVIRONMENT_STATE section 18) | 7 of 7 MATCH (index.html 12,864,963 B, `916f2455...62ce3`); `Centricity_Risk_Matrix.js` 404; index.html Last-Modified 30-Oct-2026 07:47:47 GMT | VERIFIED |
| 9 | CI | `gh run list --limit 100 --json conclusion` | 60 runs, 60 success | VERIFIED |
| 10 | Object store | `git fsck --connectivity-only --no-dangling`; `git stash show -p --include-untracked stash@{0}` (size only) | exit 0; patch readable, 1,408,451 bytes (= the 28-Oct export) | VERIFIED |
| 11 | OneDrive | `Get-Process OneDrive`; attribute scan of `.git`; Pinned attribute | running since 11:47 IST; folder not pinned; 228 of 568 `.git` files Offline (229 at 13:29 IST); TASK-017 acceptance not met | VERIFIED (deviation) |
| 12 | Branches, worktrees, stash | `git branch --no-merged main`; `git worktree list`; `git stash list`; branch counts | no unmerged branch; 5 worktrees (the 4 documented + new unused `investment-proposal-dashboard-c68580`); 1 stash; 29 local / 27 origin branches | VERIFIED (deviations) |
| 13 | Sessions | `list_sessions` (including archived), `get_session self` | as in CHAT_REGISTRY except: NB-01..03 archived (by the owner: INFERRED); MOD-02 started; 3 new external sessions | VERIFIED (deviations) |
| 14 | Page start-up | `preview_start playbook` in the built-in browser; reload with the console reader attached | MASTER 7,682; H/REFRESH/EXPORTS; 3 sibling flags; Select 178; DATA_DATES as recorded; 0 console messages | VERIFIED (no proposal built, nothing exported) |
| 15 | Register audit | workflow `validate-handover-registers` (10 auditors, 17 skeptics) | 77 findings: P1 0, P2 17, P3 60; no P2 refuted | VERIFIED |
| 16 | Guardian | ARC-01 DIFF REVIEW of TASK-015 | GO WITH CONDITIONS, risk MEDIUM | VERIFIED |
| 17 | Security | security-reviewer on `git diff 2b2a397 f5c2431` | 0 BLOCKER; 5 warnings (1 P2, 4 P3) | VERIFIED |

## 3. Deviations from the 28-Oct snapshot (none blocks work)

1. **OneDrive** is running (since 11:47 IST on 2-Nov) but the folder is not pinned and 228 of 568 `.git` files are still cloud-only:
   the no-checkout, no-switch, no-merge, no-pull rule stays (TASK-017 in progress).
2. **A fifth worktree**, `.claude/worktrees/investment-proposal-dashboard-c68580`, exists (detached at `f5c2431`, clean, no commits).
   Its admin folder was created 2-Nov-2026 13:11 IST and its HEAD written at 13:13:03 IST, 20 seconds before this session was
   created and under this session's title: VERIFIED to have been created by the desktop app (its admin folder holds the app's
   `claude-desktop-worktree` marker file, as the NB worktrees' folders do); that it was made for this chat is INFERRED; it is unused
   (this chat works in the main checkout). Left untouched; removal waits for DEC-OPEN-22.
3. **NB-01, NB-02 and NB-03 are archived** (on or before 2-Nov-2026; that the owner did it is INFERRED from `list_sessions`); the two NB worktrees changed to a detached HEAD
   at 13:32:29 IST (08:02:29 UTC) when the app released their branches (INFERRED from the timing). No unique work was lost.
4. **Three new sessions of the sister Portfolio Review project** started (two titled `ARC-01 | ...` and `EX-01 | ...`, so the ID
   schemes collide); from now on this project's sub-chat titles carry `Playbook` in the workstream field.
5. **CI** has 60 runs (PR #29 added two). **Branches**: 29 local, 27 on origin.
6. **A stray empty file** `probe_sib.js` appeared in the repo root during the audit (INC-18): the `issues-code` auditor ran a
   mistyped `cat > probe_sib.js`; harmless, removed.

## 4. The register audit

Workflow `validate-handover-registers` (2-Nov-2026 about 07:54 to 09:01 UTC, 27 agents, 1,955 tool calls).
Ten read-only auditors, one per area, each told to check claims against git, GitHub and the code and to say NOT RUN when it could
not: tasks-prs, issues-structure, issues-code, decisions, requirements, integration-ci-live, interfaces-architecture,
package-consistency, guardian-gate-b (ARC-01, the `integration-guardian` agent) and security (the `security-reviewer` agent).
Each P1 or P2 finding then went to a separate skeptic whose job was to refute it: 17 sent, 0 refuted (some wording corrected).
What matched: all 29 PR/merge-SHA pairs; the TASK counts and cross-references; 28 of 28 per-PR integration rows, the S0-S7 site
states, 11 SHA-256 prefixes, 4 backup hashes, 102 cited commits and runs; D1-D83 contiguous and all 36 load-bearing D
descriptions; all 28 DEC-OPEN entries; REQ-001..095 and REQ-PPT-01..153 counts and most evidence pointers; 396 relative links with
none broken; every id family contiguous with correct "next free" claims; the 22 new KNOWN_ISSUES entries; A30 and A31
reproduced on scratch copies; SHEET_MAP = SHEET_SUB (43 = 43). Two auditors broke their own read-only rule in small ways (an
empty stray file, INC-18; one `node -e` that wrote nothing); the repository was not otherwise touched.
KNOWN_ISSUES.md at `f5c2431`: 115 rows (A 31, B 9, C 45, R 11, E 16, F 3), Open 65 (P1 5, P2 30, P3 30); with this update's
three new entries (A32, E17, R12): 118 rows, Open 68.

## 5. Findings and where each went

### 5.1 The 17 P2 findings (all confirmed by a skeptic)

| Id | Where | Finding | Disposition |
|---|---|---|---|
| decisions:F-01 | DECISION_LOG s2.2 row 4; MASTER_HANDOVER s8.1 | the owner's "delete the old site only after full testing" condition is said to be "not in R7"; R7 records it | corrected in the registers; snapshot errata ERR-2 in `docs/handover/README.md` |
| decisions:F-02 | DEC-OPEN-18 and the D60 row; MASTER_HANDOVER | "No client data is in the repo"; R1 says de-identified sample figures remain in the public history | corrected; errata ERR-3 |
| decisions:F-03 | DECISION_LOG s1.2, s1.3 | the "about 13-Nov" deadline for DEC-OPEN-01/-02/-03 is the START of the Oct cycle: the producer must be merged before step 10 | corrected; DEC-OPEN-01 is needed well before 13-Nov; errata ERR-4 |
| requirements:D01 | REQUIREMENTS REQ-023 | "no contrary evidence" is wrong: GitHub shows 3 branch deletions on 16-Oct-2026 (`--delete-branch` on PRs #1-#3) | corrected (E12, DEC-OPEN-22 hold the rule question) |
| requirements:D02 | REQUIREMENTS REQ-PPT-150 | VERIFIED COMPLETE although C44 and basis rows 108/109 say otherwise | set to IMPLEMENTED NOT FULLY VERIFIED (117 / 35 / 1) |
| integration-ci-live:D1 | INTEGRATION log INC-11 | the 23-of-43 count is the wrong way round; the skeptic measured 18 exits with code 1 (14 ENOENT traces) and 25 already exiting 2 on `main` before PR #19 | corrected with the measured wording |
| interfaces-architecture:D-01 | INTERFACE_CONTRACTS 5.1, ARCHITECTURE s9 | `tool_inputs.test.js` is cited as the guard for flags and exit codes but covers only missing-input exits | wording corrected; KNOWN_ISSUES A32; TASK-076 |
| package-consistency:D-01 | K07 and 6 other places | the 28-Oct start-up check is "~08:55 UTC"; it ran 07:12:58-07:13:25 UTC | corrected in the living registers; errata ERR-1 for the snapshots |
| guardian-gate-b:D-01 | CLAUDE.md "Project control"; E7 | the override names only `git switch`; the skill and process doc also run `git pull --ff-only` | TASK-018 (widened), KNOWN_ISSUES E17 |
| guardian-gate-b:D-02 | FILE_OWNERSHIP vs CLAUDE.md, bootstrap, agent text | the Guardian pre-check is defined two ways (high-risk only, or material or high-risk) | TASK-018, E17 |
| guardian-gate-b:D-03 | bootstrap 7.2 vs FILE_OWNERSHIP s7 | "docs-only changes need no contract" vs rule-changing documents being Material | TASK-018, E17 |
| guardian-gate-b:D-04 | agent text, Guardian handover vs FILE_OWNERSHIP | a routine monthly refresh is HIGH in one place and Material in another; an owner-typed `/monthly-update` never meets Gate B | TASK-018, E17 |
| guardian-gate-b:D-05 | TASK_REGISTER, NEW_BUILD_HANDOVER | the TASK-017 "no --apply" hold exists only in the registers | TASK-018, E17 |
| guardian-gate-b:D-06 | NEW_BUILD and EXISTING handovers | TASK-017 is said to gate any worktree or branch; CLAUDE.md allows `git branch` and a worktree at current `origin/main` | TASK-018, E17; errata ERR-5 |
| guardian-gate-b:D-07 | bootstrap launch-packet field 12 | tells every sub-chat to run `git switch -c <branch>` | TASK-018, E17 |
| guardian-gate-b:D-08 | PR #29 | no Gate A, Gate B or security-reviewer record for a 58-second PR-to-merge | recorded in `INTEGRATION_AND_REGRESSION_LOG.md` section 11 and INC-19; security-reviewer run 2-Nov-2026 |
| security:SEC-01 | public registers | they are a finding aid to the unredacted client specification still public at the outgoing owner's repository (a risk, not a wrong fact) | DEC-OPEN-29, TASK-075; R1 note |

### 5.2 ARC-01 review (first use of the Guardian)

Verdict GO WITH CONDITIONS, risk MEDIUM (docs that change an operating rule; no code, data, CI or deploy-file change). Proven:
`site/` and `tools/` tree objects identical at base and merge; `.github`, `package*.json`, `.gitignore`, `.gitattributes` untouched; the
diff equals the TASK-015 claim; the agent file is well-formed and matches the other eight; 391 links resolve; the added text has no
secret, e-mail or user path. Conditions: (1) before any `/monthly-update` run, any tool `--apply` or any OPS or NB sub-chat
launch, one docs PR (TASK-018 widened) fixes findings D-01 to D-07 and D-14; (2) until then every launch packet states: no
checkout, switch, merge or pull in the main checkout, no `--delete-branch`, where the chat runs, whether a Guardian pre-check
applies; (3) MOD-02 records TASK-015's Gate A (reconstructed) and this review as its Gate B and runs security-reviewer on the
diff (done); (4) MOD-02 identifies who created `probe_sib.js` and who detached the two worktrees and registers the new
worktree (done: sections 3 and INC-18), nobody runs `git clean`. MINOR findings D-09 to D-19 are in the appendix (TASK-018 or
TASK-077).

### 5.3 Security review of PR #29 (public repository)

0 BLOCKER, 5 warnings. PR #29 added no secret, token, key, e-mail, phone, PAN, Aadhaar, bank number, client name, person name,
Windows-user path or internal URL; `.gitignore` is intact; no forbidden file type is tracked or ever was in the public history.
SEC-01 (P2): the locators, see above. SEC-02 (P3): public commit metadata exposes author and committer addresses (noreply form
plus three other mailboxes, one of them a staff member's full name with a company address). SEC-03 (P3): one person's full name
appears twice in `docs/PRD.md` and a name-based company address once in `docs/archive/README_original_2026-05.md`; none was added
by PR #29. SEC-04 (P3): `.gitignore` has no rule for `*.tar *.gz *.tgz *.bz2 *.xz *.docm *.pem *.key *.p12 *.pfx *.sqlite *.db *.env id_rsa* credentials*.json .npmrc` (the security reviewer's second look added the last four). SEC-05
(P3): the public registers carry session ids, local tool paths and exact detail of open weaknesses (R8, R9, R10). Names are
withheld here on purpose. All five go to DEC-OPEN-29, KNOWN_ISSUES R12 and TASK-075; no history rewrite without the owner's
explicit instruction.

### 5.4 Gates for this PR (the TASK-016 docs PR, branch `docs/mod-02-validation-20261102`)

Risk class **Material** (FILE_OWNERSHIP_AND_CHANGE_CONTROL section 7), not Low: besides records it carries (a) decisions D84 and
D85; (b) the standing restriction "never `git merge` or `git pull` in the main checkout" in the registers (CLAUDE.md is changed by
TASK-018); (c) work gates and order (no `/monthly-update`, tool `--apply` or OPS/NB launch before TASK-018; TASK-018 no longer waits
for TASK-017; TASK-062's export may run before TASK-017); (d) errata ERR-5 and ERR-6 re-scoping the TASK-017 hold ahead of TASK-018;
(e) the sub-chat title rule; (f) the meanings of VERIFIED COMPLETE in the REQUIREMENTS register; (g) decision status ANSWERED and the
upstream-refs note. Gate A: the PR description. Gate B: ARC-01 DIFF REVIEW of the first draft of this branch (a local commit, folded
into the single commit of this PR before the push), verdict GO WITH CONDITIONS (C1 to C8: "done" entries made effective at the
merge; D84 and D85 limited to the owner's button answers and relabelled as MOD-02's reading; Material classification; the title
rule; same-fact fixes; a security re-run; the E17 line in the KNOWN_ISSUES "Before the next refresh" list; a re-check after the fix
commits), applied as wording changes before the push. security-reviewer on the first draft: 0 BLOCKER, warnings W-1 (the outgoing
owner's tip commit id added on two lines: removed), W-2 (the `.gitignore` pattern list widened) and W-3 (pointers already tracked as
DEC-OPEN-29 and TASK-075). Re-run on the second draft: 0 BLOCKER, 4 low warnings, verdict SAFE TO PUSH: the session ids of three
sessions of the other project and a workflow run id (shortened or dropped); the exact positions of three personal-data lines (moved
to a local-only note); the pointers that act as a finding aid (accepted: the locators and the data are already in the public tree, and
removing them is DEC-OPEN-29 and TASK-075); and the intermediate commit that still carried the old tip id (folded away). Gate E:
pending; the owner confirms the D84 and D85 wording.

## 6. NOT RUN

Full browser acceptance, a proposal built and the Excel, PowerPoint and Allocation Sheet exports (TASK-064); Excel opened in
Office; a PowerPoint render; messaging a running sub-chat (`SendMessage`) and `start_session` cards (not tested by MOD-02 yet);
MOD-01's transcripts; the contents of the local-only folders (R8, R10, R11); history-dependent claims (the C41 "20-May-2026" date
needs blob history); the owner's confirmation of MOD-01's final report (chat only) and of the D84 and D85 wording (Gate E).

## 7. Owner decisions recorded 2-Nov-2026

- DEC-OPEN-02, risk-free rate: "Keep 4.5% for now" = **D84**; D58 stays Open for the desk's confirmation (DESK-15).
- DEC-OPEN-03, Sortino definition: "Keep textbook" = **D85**.
- DEC-OPEN-01, who makes the NAV Data and Fund Risk Ratios workbooks: asked; pending. It is needed well before 13-Nov (audit
  finding decisions:F-03).

## 8. What happens next

1. This docs PR (branch `docs/mod-02-validation-20261102`): registers, records, D84 and D85, this record.
2. TASK-018 (widened): GOV-01 in its own worktree fixes the rule documents (E17). Material: contract, ARC-01 DIFF REVIEW,
   security-reviewer.
3. TASK-064 (EX-01, read-only) may start at once; TASK-017 (the owner pins the folder) in parallel.
4. Owner decisions in the documented order, DEC-OPEN-01 first; then OPS and NB launches (not before step 2).
5. TASK-077 applies the P3 appendix below; TASK-075 follows DEC-OPEN-29; TASK-076 extends `tool_inputs.test.js` (A32).

## Appendix A. Findings not applied in the TASK-016 PR (TASK-018 or TASK-077)

Of the 60 P3 findings, 40 were applied in the same PR (tasks-prs D1-D3, issues-structure D-01 to D-07, issues-code D1-D3,
decisions F-04 to F-09 and F-11, requirements D03-D09, integration-ci-live D2, interfaces-architecture D-02 to D-04 and D-09 to
D-12, package-consistency D-02 to D-06). SEC-02 to SEC-05 (4) go to TASK-075; guardian-gate-b D-19 (the outgoing owner's account
name repeated in 14 new lines) is an owner call under DEC-OPEN-29. The remaining 15 are listed below, abridged; D-14 is also
required by ARC-01's condition 1 (TASK-018).

| Id | Where | What is wrong or to change | Wording to apply (abridged) |
|---|---|---|---|
| decisions:F-10 | docs/project-control/TASK_REGISTER.md:329-348 (TASK-033, TASK-034) with docs/project-control/DECISION_LOG.md:380-406 (DEC-OPEN-13) and :820 | The two tasks are circular on the old-site step. TASK-033 has no dependency on TASK-064 or DEC-OPEN-24, although the owner's condition (s2.2 row 4, REQ-049, R7) says nothing is retired before full testing, and DEC-OPEN-13 itself says privatising or deleting... | TASK-033 acceptance: remove 'the old site gone or showing a notice' (move it to TASK-034). DEC-OPEN-13: 'Asks (1) (if it makes the repository private or deletes it) and (2) wait for DEC-OPEN-24 and DEC-OPEN-14 because they take the old site down; a purge of the file from history that keeps the re... |
| interfaces-architecture:D-05 | docs/project-control/FILE_OWNERSHIP_AND_CHANGE_CONTROL.md:365 (Gate B) vs docs/handover/MODERATOR_BOOTSTRAP_PROMPT.md:228 (Gate D) | The two documents place the security-reviewer check in different gates (CLAUDE.md step 6 says only 'security-reviewer check' before commit/push). | Pick one home and say it in both files, for example: 'Gate B: Guardian review of the diff. security-reviewer runs after Gate C and before the push/merge (Gate D prerequisite).' and mirror it in FILE_OWNERSHIP lines 365 and 367. |
| interfaces-architecture:D-06 | docs/project-control/FILE_OWNERSHIP_AND_CHANGE_CONTROL.md:368 (Gate E) vs docs/handover/MODERATOR_BOOTSTRAP_PROMPT.md:229 | Different scope of owner acceptance (some changes versus every task). | Use one sentence in both: 'The owner accepts every client-facing change and any change the owner asked to review; for other changes the Moderator records acceptance on evidence. A task is not accepted because its chat finished.' |
| interfaces-architecture:D-07 | docs/handover/MODERATOR_BOOTSTRAP_PROMPT.md:193-204 (section 7.2) vs docs/project-control/FILE_OWNERSHIP_AND_CHANGE_CONTROL.md:283-285 (section 7) | A Moderator following the Bootstrap alone would skip the contract and Guardian review for, e.g., an edit to a non-lib tool, a skill, CLAUDE.md, or a DEPLOYMENT/TESTING change that alters a gate. FILE_OWNERSHIP is the stated authority (Bootstrap 7.1 points t... | Bootstrap 7.2 last sentence: 'Docs-only changes need no contract unless they change a rule, procedure, gate or decision; the risk classes (Low / Material / High risk) and their triggers are in FILE_OWNERSHIP_AND_CHANGE_CONTROL.md section 7, which also makes all of tools/, .github/, package*.json,... |
| interfaces-architecture:D-08 | docs/project-control/FILE_OWNERSHIP_AND_CHANGE_CONTROL.md:57-58 and :75 | Both worktrees are on a detached HEAD at those SHAs (the tips of the named branches); their claude/<name> session branches point elsewhere (claude/focused-wright-d50bee = bf20c08, claude/adoring-boyd-7028f6 = 8e187ae). Both worktrees are clean. I cannot tel... | Table 2.1 'Branch and state': 'detached HEAD at fe060d5 (tip of fix/reckoner-drop-gates), clean' and 'detached HEAD at 18abff3 (tip of fix/a27-rehearse-old-site), clean'. Line 75: drop the claim that the app leaves the worktree on claude/<name> or mark it INFERRED. |
| guardian-gate-b:D-09 | docs/DEVELOPMENT_SETUP.md:39 | 9 agent files after PR #29. | '... the 9 agents in .claude/agents/ ...' (add to TASK-018). |
| guardian-gate-b:D-10 | .claude/agents/integration-guardian.md:78-79; FILE_OWNERSHIP:438-439; CODEBASE_GUARDIAN_HANDOVER:321-323 (correct form at REPOSITORY_AND_ENVIRONMEN... | The default response is JSON with base64 content; hashing it gives a different SHA, so the check fails or misleads. | gh api -H 'Accept: application/vnd.github.raw+json' repos/productsteamcentricity/Centricity-Proposal-Playbook/git/blobs/<sha> > <file>; then git hash-object <file> must print <sha>. Use this form in the agent file, FILE_OWNERSHIP section 9 and the Guardian handover section 9. |
| guardian-gate-b:D-11 | docs/project-control/FILE_OWNERSHIP_AND_CHANGE_CONTROL.md:131 versus docs/project-control/README.md:43-44, :59-64 and bootstrap:315 | The README and bootstrap let the task's own PR update INTERFACE_CONTRACTS.md and ARCHITECTURE_AND_DEPENDENCY_MAP.md; FILE_OWNERSHIP:146-147 adds ripple-list files to the task's claim. | Add to FILE_OWNERSHIP:131: 'Exception: INTERFACE_CONTRACTS.md and ARCHITECTURE_AND_DEPENDENCY_MAP.md are updated by the task that changes an interface, in its own PR, under its claim.' |
| guardian-gate-b:D-12 | FILE_OWNERSHIP:365 and :368 versus bootstrap:226-229 | The same check sits in two different gates, and who accepts differs. | 'security-reviewer runs before every push (CLAUDE.md step 6); the Moderator confirms it at Gate D.' 'Gate E: the owner accepts client-facing changes and anything the owner asked to review; the Moderator accepts the rest on evidence.' (or the reverse; the owner decides). |
| guardian-gate-b:D-13 | FILE_OWNERSHIP:383-385; docs/project-control/REPOSITORY_AND_ENVIRONMENT_STATE.md:461-463 | git merge is forbidden in the main checkout and a temporary-index branch has no worktree to merge in; rebuilding it would need a force-push. Procedure E guards with 'git merge-base --is-ancestor main origin/main'; F lacks that guard, so a local-only commit ... | Step 1: 'If the branch is behind, run gh pr update-branch <n> (server-side merge, no local checkout) or merge in the task's worktree; re-run Gate C.' F: add E's merge-base --is-ancestor guard line before the update-ref. |
| guardian-gate-b:D-14 | .claude/agents/release-manager.md:24; .claude/skills/monthly-update/SKILL.md:69; docs/MONTHLY_UPDATE_PROCESS.md:246; FILE_OWNERSHIP:135 and :387-38... | CLAUDE.md 'Never' lists force-push, history rewrite, repo settings and visibility, bypassing a failing check and library upgrades, not branch deletion, and Project control does not override --delete-branch. Bootstrap and successor prompt H say not to use it... | CLAUDE.md Never: add 'Delete branches, worktrees, tags or the stash without the owner's explicit instruction.' Project control: 'Merge with gh pr merge <n> --merge --match-head-commit <sha> and no --delete-branch until DEC-OPEN-22 is decided; this overrides the three --delete-branch lines.' Corre... |
| guardian-gate-b:D-15 | CLAUDE.md:79-81 versus ACTIVE_CHANGE_REGISTER.md:96 and FILE_OWNERSHIP:151-154 | Only the Moderator edits the register and a claim is in force only once merged to origin/main; a chat started by the owner (for example /monthly-update) cannot comply as written. | 'Ask the Moderator to record your claim in ACTIVE_CHANGE_REGISTER.md (only the Moderator edits it); do not edit claimed files until the claim is on origin/main.' |
| guardian-gate-b:D-16 | CLAUDE.md:83-85 | KNOWN_ISSUES R6 and FILE_OWNERSHIP:65-66 say it was a `git checkout`. | 'a git checkout on 25-Oct failed with mmap failed and truncated tracked files'. |
| guardian-gate-b:D-17 | docs/project-control/ACTIVE_CHANGE_REGISTER.md:44; CHANGELOG.md 2026-10-30 entry | The diff has three CLAUDE.md edits: two repository-map rows (edited, not added), step 2 of 'How every change is made' (new handover/ and continuation/ branch patterns), and the new section. The CHANGELOG lists only the section. | In TASK-015's release record list all three: repository-map rows docs/ and .claude/, step 2 branch patterns, new Project control section. |
| guardian-gate-b:D-18 | .claude/agents/integration-guardian.md:3-4, :43-45, :90-93 versus CODEBASE_GUARDIAN_HANDOVER:66-67 and :330-331 | The tools are Read, Grep, Glob, Bash (no Write), so a script can only be created by a Bash here-document or redirect. 'Read-only' is a prompt rule because Bash is unrestricted (same for four other agents). The agent text does not ask the Moderator for the t... | Replace the helper-script sentence with: 'Create a helper script in the scratchpad with a quoted here-document, free of double backslashes and unicode escapes, then run node <file>.' Add to 'What the Moderator must give you': 'the time of the last git fetch origin (ARC-01 cannot fetch).' |

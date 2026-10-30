# Requirements and change register

| Field | Value |
|---|---|
| Version | 1 |
| Date | 28-Oct-2026 |
| Author chat | MOD-01 (handover package, TASK-015) |
| Status | Authoritative for what the owner asked for and how each request stands |
| Supersedes | nothing (first version; requirement IDs did not exist before 28-Oct-2026) |
| Next review | MOD-02 at TASK-016, then whenever the owner gives a new requirement |

## 1. What this file is

Every material requirement the owner has given since the project started (15-Oct-2026), with a stable
ID, the owner's words, where and when they were given, what the requirement means in behaviour, how we
know it is met, and where it stands. Requirements that are not yet implemented are listed too.

| Question | Authoritative file |
|---|---|
| What the owner asked for (`REQ-nnn`, `REQ-PPT-nn`) | this file |
| The work that delivers it (`TASK-nnn`) | [`TASK_REGISTER.md`](TASK_REGISTER.md) |
| Approved decisions (`Dnn`) | [`../DECISIONS.md`](../DECISIONS.md) |
| Decisions waiting for the owner (`DEC-OPEN-nn`) | [`DECISION_LOG.md`](DECISION_LOG.md) |
| Defects | [`../KNOWN_ISSUES.md`](../KNOWN_ISSUES.md) |
| The product itself | [`../PRD.md`](../PRD.md) (inherited PRD; requirements before 15-Oct-2026) |

Code, git and test evidence decide status. A conversation or a document claiming something works is not
evidence.

## 2. Conventions

- **Sources.** Owner messages are cited by chat and date/time (UTC; IST = UTC+5:30). MOD-01's session
  holds the owner's messages of 15-27-Oct-2026; the handover prompt of 27-Oct was pasted again,
  byte-identical, on 28-Oct-2026 05:33 UTC.
- **"Derived"** marks a requirement taken from a brief that MOD-01 wrote for a sub-chat (NB-01, NB-02,
  NB-03). The owner's act was starting that session; the words are MOD-01's.
- **"Preset button"** marks an owner message that is the exact text of a button MOD-01 or NB-03 offered.
  The owner chose it; Claude drafted the words.
- **Standing constraints** (rules rather than deliverables): VERIFIED COMPLETE means written into the repo
  (usually CLAUDE.md) with evidence of adherence and no unresolved breach.
- **Status words:** VERIFIED COMPLETE, IMPLEMENTED NOT FULLY VERIFIED (shortened to INFV only in the
  counts below), IN PROGRESS, PLANNED, BLOCKED, NOT STARTED, EXISTING DEFECT, UNKNOWN / NEEDS
  INVESTIGATION, SUPERSEDED.
- **No client data.** Fund and scheme names are public product names. Client names, investor data and the
  owner's account e-mail are never written here.

## 3. Counts (28-Oct-2026)

| Set | Total | VERIFIED COMPLETE | INFV | IN PROGRESS | PLANNED | BLOCKED |
|---|---|---|---|---|---|---|
| REQ-001..REQ-095 | 95 | 49 | 10 | 35 | 1 | 0 |
| REQ-PPT-01..REQ-PPT-153 | 153 | 118 | 34 | 0 | 0 | 1 |

REQ by workstream: GOV 58, EX 25, NB 8, OPS 4. All REQ-PPT items are NB. Next free IDs: **REQ-096**,
**REQ-PPT-154**.

## 4. Requirements REQ-001..REQ-095

Column key: **Src** = section of the owner's message; **WS** = workstream (EX existing dashboard, NB new
build, OPS monthly data operations, GOV governance); **Behaviour / acceptance** = intended behaviour and how
we know it is met; **Task / chat** = the task that delivers it and the chat that owns it ("standing" = a
rule every chat follows).

### 4.1 Owner's master prompt of 15-Oct-2026 14:36 UTC (MOD-01, owner message 1): "Replication, architecture, GitHub ownership and long-term maintenance", plus four numbered asks

| ID | Src | Requirement (close to the owner's words) | WS | Status | Behaviour / acceptance | Affected components | Verification evidence | Task / chat |
|---|---|---|---|---|---|---|---|---|
| REQ-001 | s1 | "I am the product owner. You are responsible for the technical execution." Claude acts as architect, engineer, financial product specialist, TPM and lead repository maintainer. | GOV | VERIFIED COMPLETE | The owner decides product questions; Claude does git, GitHub, tests and docs. Written in CLAUDE.md and followed. | `CLAUDE.md` | `CLAUDE.md:3-7`; extended 27-Oct by REQ-072, REQ-073 | standing |
| REQ-002 | s1 | Do not expect the owner to manage git, organise the codebase, maintain docs, coordinate agents, run routine tests or manage implementation details. | GOV | VERIFIED COMPLETE | The owner only decides and relays desk requests. Every PR opened and merged by Claude. | process | all 28 PRs by Claude sessions; memory note "Push every change to GitHub" | standing |
| REQ-003 | s1, s9 | Understand each request in the context of the whole project; documentation, not the conversation, is the durable memory. | GOV | VERIFIED COMPLETE | Every session starts from the repo docs. | `CLAUDE.md`, `docs/PROJECT_STATE.md`, `docs/README.md` | CLAUDE.md "First, every session"; extended by REQ-068 | standing |
| REQ-004 | s2, s6 | Stage A: replicate the existing project on the owner's laptop, establish a reproducible local environment, reproduce its functionality and transfer it to the owner's GitHub repo. | EX | VERIFIED COMPLETE | Local copy runs; repo under `productsteamcentricity`; live site equals `site/`. | whole repo; GitHub Pages | PR #1 `25e71a3`; `docs/REPLICATION_REPORT.md` s3, s7; live 7/7 SHA-256 = `site/` (28-Oct) | TASK-001 / MOD-01 |
| REQ-005 | s2, s3.1, s6.4 | The baseline reflects the existing application: no redesign, no discarded features, no unrelated improvements; document defects without silently fixing them. | EX | VERIFIED COMPLETE | `site/` bytes identical to the upstream baseline; defects logged, not fixed, during the transfer. | `site/`, `docs/KNOWN_ISSUES.md` | REPLICATION_REPORT s5; KNOWN_ISSUES introduction | TASK-001 |
| REQ-006 | s2, s11 | Stage B: after the baseline, implement the owner's improvements one by one through a systematic development, testing, documentation and GitHub workflow. | NB | IN PROGRESS | Each improvement goes branch -> PR -> verify -> merge, with docs. | all | PRs #3-#27; paused 27-Oct by REQ-063 | TASK-002..TASK-013, open NB tasks |
| REQ-007 | s2, s15 | "The immediate priority is Stage A ... Stop after establishing the baseline ... Wait for my next project instruction." | EX | VERIFIED COMPLETE | No Stage B work before the owner's next instruction. | process | PRs #1/#2 merged 16-Oct 07:15/07:18 UTC; first Stage B PR #3 created 13:22 UTC, after the owner's 13:09 UTC instruction | TASK-001; approved decision (DECISION_LOG s2.2) |
| REQ-008 | s3.2, s8.2 | Work from first principles; simplest reliable approach; no abstractions, frameworks, services or databases for sophistication; no tight coupling or duplicated logic. | GOV | VERIFIED COMPLETE | Smallest coherent change; alternatives weighed in each decision record. | process | CLAUDE.md "How every change is made" step 3; alternatives in D70-D83 (e.g. D82: no new library, no seventh deploy file) | standing |
| REQ-009 | s3.3 | Proceed on routine, reversible, documented decisions; ask only when product behaviour, security, data integrity, repository ownership or an irreversible action is affected. | GOV | VERIFIED COMPLETE | Material questions asked; routine ones handled. | process | questions of 16, 19, 22 and 27-Oct; D61 stop list | standing |
| REQ-010 | s3.4 | Never fabricate completion; distinguish completed-and-verified, implemented-not-verified, blocked, not attempted, existing defects. | GOV | IMPLEMENTED NOT FULLY VERIFIED | Every report uses status labels; no false claim stays on record. | docs, PR bodies | REPLICATION_REPORT labels. One breach: PR #10's body still names two flags that do not exist on those tools (docs corrected 19-Oct; PR body not edited; INC-03) | standing |
| REQ-011 | s4.1 | Inspect all supplied materials (original repo, PRD handoff, chat history, historical files, destination repo); record any referenced input that is unavailable. | EX | IMPLEMENTED NOT FULLY VERIFIED | Every input inspected or listed as unavailable. | `docs/REPLICATION_REPORT.md`, `handover-archive/` (local) | REPLICATION_REPORT s1; the 23-Oct export was ingested, but the outgoing owner's `Project_History_and_Conversation_Summary.md` was "not acted on" and their offered claude.ai export was not requested | TASK-001, TASK-014; TASK-073 (DEC-OPEN-26) |
| REQ-012 | s4.2 | Reconstruct history and intent; classify into confirmed requirements, implemented functions, accepted decisions, proposals, rejected or superseded items, known bugs, future requirements, open questions. | GOV | VERIFIED COMPLETE | A decision register and an issue register exist with statuses. | `docs/DECISIONS.md`, `docs/KNOWN_ISSUES.md`, `docs/OPERATING_MANUAL.md` Errata | D1-D59 inherited with Active/Superseded/Open; KNOWN_ISSUES; 37 errata | TASK-001 |
| REQ-013 | s4.3 | Source-of-truth policy: latest owner instruction, then PRD (intent), then chat history (rationale); the repo establishes implementation; document conflicts, never resolve material ones silently. | GOV | VERIFIED COMPLETE | Policy written and applied ("the code wins"). | `docs/REPLICATION_REPORT.md`, `docs/README.md` | `docs/REPLICATION_REPORT.md:17-20`; `docs/README.md` conventions | standing |
| REQ-014 | s4.3 | A concise source inventory and decision register. | GOV | VERIFIED COMPLETE | Both exist. | `docs/REPLICATION_REPORT.md`, `docs/DECISIONS.md` | REPLICATION_REPORT s1; DECISIONS D1-D83 | TASK-001 |
| REQ-015 | s5 | Phase 0: inspect the directory, git, remotes, uncommitted changes, destination, stack, credentials, tests and CI before modifying anything; preserve existing work. | EX | VERIFIED COMPLETE | Inspection recorded before the first change. | process | REPLICATION_REPORT s2; D65 | TASK-001 |
| REQ-016 | s6.1 | Replicate the complete project; do not copy build artefacts, caches or machine-specific files. | EX | VERIFIED COMPLETE | Every tracked file byte-identical; required untracked artefacts recovered. | repo | REPLICATION_REPORT s1 (46/46 files identical; 81 workbook files re-extracted) | TASK-001 |
| REQ-017 | s6.2 | Reproducible environment with the existing tooling; preserve versions; no gratuitous upgrades; no credentials. | EX | VERIFIED COMPLETE | Pinned versions; setup documented; nothing secret needed. | `package.json`, `docs/DEVELOPMENT_SETUP.md` | `xlsx` 0.18.5 pinned (D67); `docs/HANDOVER.md` s7 (no API keys or environment variables) | TASK-001 |
| REQ-018 | s6.2, s13 | Never put API keys, passwords, tokens, private keys or sensitive client data into source control. | GOV | VERIFIED COMPLETE | Secrets and PII scan of every blob; local-only folders git-ignored. | `.gitignore`, git history | D64; REPLICATION_REPORT s4. Exposure outside our repo remains: R1 (upstream), R8 (local export) | standing; TASK-032, TASK-033 |
| REQ-019 | s6.3 | Establish functional parity (pages, flows, calculations, outputs, error handling); document every material discrepancy; do not claim parity that was not tested. | EX | VERIFIED COMPLETE | Parity checks pass; limits listed. | `site/` | REPLICATION_REPORT s3; 21-Oct live acceptance, 7 areas PASS (PR #25). Limits: Excel export never opened in Excel; other browsers untested | TASK-001, TASK-012; re-check TASK-064 |
| REQ-020 | s6.4 | Baseline completion criteria, including a durable technical handover package. | EX | VERIFIED COMPLETE | Handover, replication report and state docs exist. | `docs/HANDOVER.md`, `docs/REPLICATION_REPORT.md`, `docs/PROJECT_STATE.md` | PR #1 | TASK-001 |
| REQ-021 | s7.1, s7.3 | GitHub transfer as a controlled operation; sanitised migration if history holds sensitive material; never claim history preserved without verifying. | EX | VERIFIED COMPLETE | History migrated without the sensitive lines; checked. | git history, tag `handover-baseline` | D64; 74 commits migrated; tag -> `862e40b`, the sanitised equivalent of upstream `72e1f1e` | TASK-001 |
| REQ-022 | s7.2 | Remotes: `origin` = the owner's repo, `upstream` = the original; verify URLs before pushing. | EX | VERIFIED COMPLETE | Push to upstream impossible. | git config | `git remote -v`; upstream push URL disabled | TASK-001 |
| REQ-023 | s7.3, s13 | Never force-push, destructively reset, rewrite shared history, delete branches or replace the repo as a shortcut. | GOV | IMPLEMENTED NOT FULLY VERIFIED | No such operation on shared history. | git, GitHub | CLAUDE.md "Never"; no contrary evidence (a negative cannot be proven) | standing |
| REQ-024 | s7.4, s11 | One branch per change; clear names and commits; tests before push; PRs; follow branch protection; verify the final SHA and PR state. | GOV | VERIFIED COMPLETE | Every change goes through a PR and the `verify` check. | `.github/workflows/pages.yml` | D68; 28 PRs merged; verify gate. Branch protection not configured (DEC-OPEN-17) | standing; TASK-036 |
| REQ-025 | s8.1-8.2 | After the baseline, a practical architecture: clear boundaries, single responsibility, centralised business rules, no duplication, reproducible dependencies. | NB | IMPLEMENTED NOT FULLY VERIFIED | Shared libraries and single predicates; duplications removed. | `tools/lib/`, `site/` | `docs/ARCHITECTURE.md`; `tools/lib` (D72); CLAUDE.md rule 8. C1 deferred; A7, C29 open | TASK-039, TASK-045, TASK-046 |
| REQ-026 | s8.3 | Financial-domain standards (units, scale, dates, provenance, no silent substitution, totals); a financial reviewer examines material changes to calculations or data. | GOV | VERIFIED COMPLETE | Rules written; reviewer used on data changes. | `.claude/agents/financial-data-reviewer.md`, CLAUDE.md rules 4-6 | reviews on PR #18 (3,758 field checks, 0 mismatches, D81) and D83 | standing |
| REQ-027 | s9.1-9.2 | A focused CLAUDE.md and documentation set adapted to the project; no empty placeholders. | GOV | VERIFIED COMPLETE | The doc set exists; one fact in one place. | `docs/` | `docs/README.md` doc map | TASK-001 |
| REQ-028 | s9.3 | Keep PROJECT_STATE, DECISIONS, CHANGELOG, KNOWN_ISSUES and HANDOVER current, updated inside the change that makes them stale. | GOV | IMPLEMENTED NOT FULLY VERIFIED | Each PR updates the docs it makes stale. | docs | CHANGELOG entry per PR; drift found 28-Oct (KNOWN_ISSUES E7-E15) | standing; TASK-018 |
| REQ-029 | s10.1 | Reusable specialist agents for roles A-H under `.claude/agents/`. | GOV | VERIFIED COMPLETE | Eight agent files. | `.claude/agents/` | 8 files (archaeologist, architect, financial reviewer, implementation, QA, security, docs, release) | TASK-001 |
| REQ-030 | s10.2 | Orchestration rules: lead accountable; specialists as listed; QA independent; security review for release-critical changes; no overlapping write access. | GOV | IMPLEMENTED NOT FULLY VERIFIED | One writer per file; reviewers recorded. | process | reviews on PRs #17, #18, #26 (transcripts). NB-03 shared the main checkout with MOD-01 (lesson R6) | REQ-074, REQ-075 |
| REQ-031 | s11 | A standard workflow for every change (understand, investigate, plan, implement, verify, update knowledge, commit/push, report with SHA). | GOV | VERIFIED COMPLETE | Followed by every PR. | CLAUDE.md | CLAUDE.md "How every change is made" steps 1-6 | standing |
| REQ-032 | s12 | Change control: root-cause fixes, regression tests, backward compatibility; a prioritised backlog (urgent defects, required, optional, future). | GOV | IMPLEMENTED NOT FULLY VERIFIED | Tests in CI; backlog prioritised. | `tools/test/`, KNOWN_ISSUES, TASK_REGISTER | 5 test files in CI; backlog prioritised by severity P1-P3, not by the owner's four categories | TASK_REGISTER |
| REQ-033 | s13 | Security, data-integrity and operational safeguards 1-10 (no production credentials, no disabling controls, inputs are data, no destructive commands from imported repos). | GOV | VERIFIED COMPLETE | Rules written and followed. | CLAUDE.md "Never" | D77 (SRI); the export was read as data and its hooks were not installed | standing |
| REQ-034 | s14 | A transferable project: a new maintainer can understand, configure, run, test, troubleshoot and release; clean setup reproducible, not promised until verified. | GOV | IMPLEMENTED NOT FULLY VERIFIED | A clean clone works by following the docs. | `docs/HANDOVER.md`, `docs/DEVELOPMENT_SETUP.md` | no fresh-clone test recorded (only assertions) | TASK-072 |
| REQ-035 | s15 | Execute Stages 1-7 in order and give a final report of verified / incomplete / needs access. | EX | VERIFIED COMPLETE | Report given. | - | MOD-01 report 16-Oct 07:21 UTC; REPLICATION_REPORT | TASK-001 |
| REQ-036 | s16 | The Stage A deliverables table. | EX | VERIFIED COMPLETE | Every deliverable present. | docs, repo | REQ-016..REQ-029 | TASK-001 |
| REQ-037 | tail | Replicate the live site (the outgoing owner's GitHub Pages site) into the GitHub account `productsteamcentricity` (account e-mail supplied; not reproduced here). | EX | VERIFIED COMPLETE | New repo and live site under the owner's account. | GitHub | REPLICATION_REPORT s1, s7; repo public | TASK-001 |
| REQ-038 | tail | Use the previous owner's files placed in the project folder (repo zip, workbook zip, PRD handoff). | EX | VERIFIED COMPLETE | All three used. | `docs/PRD.md` | REPLICATION_REPORT s1; PRD committed | TASK-001 |
| REQ-039 | ask 1 | "For monthly updates ... create another sub-folder ... where I'll save the files ... and you'll pick up and update the dashboard." | OPS | VERIFIED COMPLETE | An inbox folder; one folder per data month; a `/monthly-update` command. | `monthly-updates/00_INBOX/`, `.claude/skills/monthly-update/` | D65 | TASK-001 |
| REQ-040 | ask 2 | Organise everything in the folder and on GitHub "extremely neatly and precisely", one folder per purpose, understandable by anyone. | GOV | VERIFIED COMPLETE | `site/`, `tools/`, `docs/`; local-only folders separated. | repo layout | D62, D65; `docs/README.md` | TASK-001 |
| REQ-041 | ask 3 | Explain the monthly update process: the owner's responsibilities, the files needed from the owner, Claude's responsibilities. | OPS | VERIFIED COMPLETE | A process document and inbox README. | `docs/MONTHLY_UPDATE_PROCESS.md`, `monthly-updates/00_INBOX/README.md` | explained 16-Oct. Now partly stale: inbox README rows 12/17 and `docs/HANDOVER.md` s5 still list #12/#17 as desk files (E8, B8) | TASK-018 |
| REQ-042 | ask 4 | "Keep populating/pushing things to GitHub ... organised neatly and correctly ... the data for ... whatever changes are requested by me." | GOV | VERIFIED COMPLETE | Every change pushed with a change record. | `docs/update-log/`, CHANGELOG | 28 PRs; update logs record inputs (names, as-on, SHA-256). "Data" read as change records; workbooks stay local (D65): interpretation not confirmed with the owner | standing |

### 4.2 Owner messages of 16-21-Oct-2026 (MOD-01, messages 2-5) and derived sub-chat briefs

| ID | Date / source | Requirement (close to the owner's words) | WS | Status | Behaviour / acceptance | Affected components | Verification evidence | Task / chat |
|---|---|---|---|---|---|---|---|---|
| REQ-043 | 16-Oct 05:40 UTC; MOD-01 msg 2 (question answer) | Hosting: "Public + free Pages (Recommended)". | EX | VERIFIED COMPLETE | Repo public; free GitHub Pages site live. | GitHub settings | D60; repo public; live URL HTTP 200 (28-Oct) | TASK-001; long-term visibility is DEC-OPEN-18 |
| REQ-044 | 16-Oct 05:40 UTC; MOD-01 msg 2 (question answer) | Publishing: "Publish automatically": after each monthly update passes all checks, Claude merges and publishes; it still stops on judgement calls. | OPS | IMPLEMENTED NOT FULLY VERIFIED | A monthly refresh merges itself when every check passes; stop list respected. | `/monthly-update` skill, CI | D61; stop list in `docs/MONTHLY_UPDATE_PROCESS.md`. Never exercised: no monthly refresh has run on the new build | TASK-020, TASK-021 |
| REQ-045 | 16-Oct 13:09 UTC; MOD-01 msg 3 | "Start fixing all the issues that you have identified." | NB | IN PROGRESS | Each KNOWN_ISSUES item fixed in a PR, or waiting on a named decision or desk file. | `tools/`, `site/` | PRs #3-#15, #17, #19-#23, #26; 43 KNOWN_ISSUES items Open at `2b2a397` (before the entries this package adds) | TASK-002..TASK-013; open tasks |
| REQ-046 | 16-Oct 13:09 UTC; MOD-01 msg 3 | "... and tell me the impact of that pre and post fixing." | GOV | VERIFIED COMPLETE | A before/after report per batch of fixes. | reports | MOD-01 reports of 19-Oct and 21-Oct; NB-03 report of 22-Oct | standing |
| REQ-047 | 16-Oct 13:09 UTC; MOD-01 msg 3 | A prompt for the previous owner to extract data from their Claude build that "captures all of the data that may not be required immediately but may be required in the future". | EX | VERIFIED COMPLETE | Prompt written; export received. | `docs/handover/DATA_EXTRACTION_PROMPT.md` | PR #16, PR #24; export received 23-Oct | TASK-008 |
| REQ-048 | 16-Oct 13:09 UTC; MOD-01 msg 3 | "Don't mention anything about deleting the existing Proposal dashboard" in that prompt. | EX | VERIFIED COMPLETE | The prompt is silent on retirement. | same | `DATA_EXTRACTION_PROMPT.md:20` (only "never modify, move, rename or delete anything in the original locations") | TASK-008 |
| REQ-049 | 16-Oct 13:09 UTC; MOD-01 msg 3 | Deleting the existing (old) dashboard "will happen after full testing has been done on the new build." | EX | PLANNED | The old site stays until the owner signs off full testing of the new build. Accept: TASK-064 done; the DEC-OPEN-24 checklist signed; users told the new URL; old site replaced by a notice or redirect. | the outgoing owner's Pages site; `docs/DEPLOYMENT.md`; KNOWN_ISSUES R7 | old site HTTP 200 on 28-Oct; the condition was in no repo doc before this package | TASK-034, TASK-064, TASK-074; DEC-OPEN-14, DEC-OPEN-24 |
| REQ-050 | 16-Oct 13:09 UTC; MOD-01 msg 3 | "The owner can share the zip files with me over teams and don't need to upload it on one drive." | EX | VERIFIED COMPLETE | Transfer channel = Teams. | the prompt | `DATA_EXTRACTION_PROMPT.md:4-6, :165`; export received over Teams | TASK-008 |
| REQ-051 | 16-Oct 13:09 UTC; NB-01 brief (derived; owner started MOD-01's card) | Derived: fix the three P1 tool risks A1, A3, A4, one PR each, without changing dashboard data. | NB | VERIFIED COMPLETE | Three PRs; no data change. | `tools/merge_bond_list.js`, `tools/merge_pms_aif_analytics.js`, `tools/merge_reckoner.js` | PRs #4-#6; D70, D71; A1/A3/A4 Closed | TASK-003 / NB-01 |
| REQ-052 | 21-Oct 05:51 UTC; MOD-01 msg 4 (preset button "Yes, publish") | "Publish PR #18 now. Keep the 12 blank-cell debt values as they are (existing rule) and keep the JioBlackRock G-Sec fund held until C20 is decided." | OPS | VERIFIED COMPLETE | Run 3 published; blank cells keep values; one record held. | MASTER in `site/index.html` | PR #18 `f37fa01`; D81 | TASK-010 / MOD-01 |
| REQ-053 | 21-Oct 05:51 UTC; NB-02 brief (derived; owner started MOD-01's card) | Derived: five independent P3 leftovers, one PR each; do not touch MASTER, data blocks or the draft PR #18. | NB | VERIFIED COMPLETE | Five PRs; no data change. | tools, `tools/lib/blocklib.js`, page code | PRs #19-#23 | TASK-011 / NB-02 |
| REQ-054 | 21-Oct 13:20 UTC; MOD-01 msg 5 | "Give me the final link for the portfolio dashboard." | EX | VERIFIED COMPLETE | Link given. | - | this dashboard's URL given 21-Oct; meaning UNCERTAIN (this dashboard or the sister Portfolio Review Dashboard): DEC-OPEN-28 | MOD-01; DEC-OPEN-28 |
| REQ-055 | 21-Oct 13:20 UTC; MOD-01 msg 5 | "... and the prompt for data extraction for the previous owner." | EX | VERIFIED COMPLETE | Prompt sent again, with two added questions. | `docs/handover/DATA_EXTRACTION_PROMPT.md` | sent 21-Oct; PR #24 `882160c` | TASK-008 |
| REQ-056 | 21-Oct 13:20 UTC; MOD-01 msg 5 | "Proposal dashboard is replicated fully? can we go ahead on this or are you still building a few things?" | EX | VERIFIED COMPLETE | Answered with evidence. | - | answered "fully replicated, nothing still being built"; live acceptance 7 areas PASS (PR #25); REPLICATION_REPORT s6 limits still apply | TASK-012 |

### 4.3 The PowerPoint request of 22-Oct-2026

| ID | Date / source | Requirement (close to the owner's words) | WS | Status | Behaviour / acceptance | Affected components | Verification evidence | Task / chat |
|---|---|---|---|---|---|---|---|---|
| REQ-057 | 22-Oct 14:10:50 UTC; MOD-01 msg 6 (owner's pasted spec "Fix and Standardise the Investment Proposal PowerPoint Output", two decks attached) | Fix the portal's PowerPoint generation so every export is client-ready: a Centricity-branded design system; tables, charts and footnotes inside the slide or continued; honest display of missing data; financial values, disclaimer and functions preserved; data-driven and reusable for any portfolio; validated by rendering. Broken down as REQ-PPT-01..153 (section 5). | NB | IMPLEMENTED NOT FULLY VERIFIED | Accept: the spec's definition of done (REQ-PPT-143..153). | export section of `site/index.html` | PR #26 `5d39821`, PR #27 `5bcce88`; D82, D83; `docs/proposal-output-format-audit.md`. Not done: Disclaimer layout (BLOCKED), fund-specific pages (DEC-OPEN-23), expected-return data (C28) | TASK-013 / NB-03 |
| REQ-058 | 22-Oct 14:30 UTC; MOD-01 msg 7 (card answer) | The owner chose "New session" for "Fix and standardise the proposal PowerPoint export". | GOV | VERIFIED COMPLETE | The work ran in its own session. | - | NB-03 started 22-Oct 14:31 UTC; recorded only in the transcript | TASK-074 (record as a D-number) |
| REQ-059 | 22-Oct 14:31 UTC; NB-03 brief (derived) | Derived: branch `feat/pptx-design-system` from an up-to-date main; `verify` green; CHANGELOG, PROJECT_STATE, KNOWN_ISSUES and a DECISIONS entry; send the owner the rendered montage and the sample deck and get their go-ahead before merging; never commit decks; do not change the C24 calculation or fix C20/C23 data; never upgrade pptxgenjs 3.12.0. | NB | VERIFIED COMPLETE | Process constraints held. | process | PR #26; D82, D83; montage and deck sent 22-Oct 15:36:08 and 15:36:10 UTC, before the go-ahead; C20/C23/C24 untouched | TASK-013 / NB-03 |
| REQ-060 | 22-Oct 15:36:58 UTC; NB-03 msg 2 (preset button "Yes, merge it") | "Go ahead: merge PR #26 once the verify check is green, then confirm the live files match site/." | NB | VERIFIED COMPLETE | Merge after green verify; live check. | GitHub Pages | merged 15:37:21 UTC (`5d39821`); live 7/7 SHA-256 = `site/`; D82/D83 "owner decision: approved" | TASK-013 / NB-03 |

### 4.4 Export ingestion and links, 23-27-Oct-2026

| ID | Date / source | Requirement (close to the owner's words) | WS | Status | Behaviour / acceptance | Affected components | Verification evidence | Task / chat |
|---|---|---|---|---|---|---|---|---|
| REQ-061 | 23-Oct; MOD-01 msgs 8, 9 | "Previous owner has shared some files, how do you want me to share?" then "Files are saved in the folder": take in the outgoing owner's export. | EX | VERIFIED COMPLETE | Every file verified against the manifest; desk files filed; findings logged; no deploy change. | `handover-archive/` and `monthly-updates/` (local), docs | PR #28 `2b2a397`; `docs/update-log/2026-10-23_handover-export.md` (2,720 files verified; 32 desk files filed) | TASK-014 / MOD-01 |
| REQ-062 | 27-Oct; MOD-01 msg 10 | "Share the link to the proposal dashboard." | EX | VERIFIED COMPLETE | Link given. | - | given 27-Oct 12:28 UTC; URL HTTP 200 and equal to `site/` (28-Oct) | MOD-01 |

### 4.5 Owner's handover master prompt of 27-Oct-2026 15:25 UTC (MOD-01 msg 11), re-issued unchanged 28-Oct-2026 05:33 UTC: "Project handover, multi-chat orchestration, codebase integrity and automatic context recovery"

All are IN PROGRESS: the deliverable is the handover package (TASK-015, MOD-01), validated by MOD-02
(TASK-016). Default acceptance for each row: the named file exists on `main` after the merge of
`handover/mod-01-to-mod-02-20261028`, and TASK-016 finds it consistent with the repo and git.
Verification evidence for every row: pending until TASK-016 records its result (the only verified fact on
28-Oct is the REQ-063 one stated in its row).

| ID | Src | Requirement (close to the owner's words) | WS | Status | Behaviour / acceptance (beyond the default) | Affected components | Task / chat |
|---|---|---|---|---|---|---|---|
| REQ-063 | s1 | "Stop all current implementation, feature development, refactoring, bug fixing, deployment ... immediately." The only objective is a complete, verified handover package; do not finish features or modify business logic. | GOV | IN PROGRESS | No commit to `site/` or `tools/` after `2b2a397` until MOD-02 resumes work (VERIFIED on 28-Oct). Pauses REQ-006, REQ-045 and OPS work. | `site/`, `tools/` | TASK-015 / MOD-01 |
| REQ-064 | s1 | Capture the original project and requirements, the source and destination repositories, the existing dashboard's actual replication status and the new build's actual implementation status. | GOV | IN PROGRESS | - | `docs/handover/MASTER_HANDOVER_2026-10-28_v1.md`, `EXISTING_DASHBOARD_HANDOVER_2026-10-28_v1.md`, `NEW_BUILD_HANDOVER_2026-10-28_v1.md` | TASK-015 |
| REQ-065 | s1, s3 | Capture every material improvement the owner suggested, with implemented, partial, planned and blocked status; "Do not omit a requested improvement merely because it has not yet been implemented." | GOV | IN PROGRESS | Every request in this file, implemented or not. | this file | TASK-015 |
| REQ-066 | s1, s4 | Capture uncommitted code, active branches, worktrees and incomplete tasks; distinguish working tree, last commit and last push; identify overlapping changes by several chats. | GOV | IN PROGRESS | - | `REPOSITORY_AND_ENVIRONMENT_STATE.md` | TASK-015 |
| REQ-067 | s1 | Capture architecture decisions, dependencies and shared interfaces; existing defects, technical debt and outstanding decisions. | GOV | IN PROGRESS | - | `ARCHITECTURE_AND_DEPENDENCY_MAP.md`, `INTERFACE_CONTRACTS.md`, `KNOWN_ISSUES_AND_REGRESSION_RISKS.md`, `DECISION_LOG.md` | TASK-015 |
| REQ-068 | s2.1-2.4 | Operating principles: code, git and test evidence establish state; never discard, reset, clean, stash or force-push without a safe plan; label verified / inferred / uncertain / unknown; no project information may live only in a conversation. | GOV | IN PROGRESS | Repeats REQ-010, REQ-023; extends REQ-003. | all package documents | standing; TASK-071 (memory-only knowledge) |
| REQ-069 | s3 | Investigate all available materials (both repos, PRD, chat history, historical files, code, CLAUDE.md, agents, docs, branches, dependencies, tests, deployment, changelogs, issue registers, suggested improvements); no indiscriminate scanning. | GOV | IN PROGRESS | Done through the 28-Oct fact sheets (session scratch, not committed). | - | TASK-015 |
| REQ-070 | s5 | Use the nine status definitions consistently; never infer success from a file's presence or another chat's claims. | GOV | IN PROGRESS | - | all package documents | standing |
| REQ-071 | s6 | Two workstreams: A existing dashboard first, B new build second. Sequence: validate the handover, complete the existing-dashboard verification, record its baseline, reassess the new build, resume improvements in dependency order, continue integration and release. Do not roll back legitimate new-build work. | GOV | IN PROGRESS | MOD-02 runs TASK-016 and TASK-064 before new-build work. | `TASK_REGISTER.md` s4 | TASK-016, TASK-064 / MOD-02 |
| REQ-072 | s7, s16 | The next conversation is the Master Project Moderator (MOD-02), the owner's primary contact, owning project-wide coordination (decompose, assign, track, integrate, explain, relay, manage context transfers). | GOV | IN PROGRESS | - | `CHAT_REGISTRY.md`, `docs/handover/MODERATOR_BOOTSTRAP_PROMPT.md`, successor prompt | TASK-015, TASK-016 |
| REQ-073 | s8 | Establish ARC-01, Codebase Integrity & Integration Guardian: reviews real diffs, ripple effects, ownership conflicts, interface compatibility, tests; reports to the Moderator; makes no product decisions. | GOV | IN PROGRESS | - | `.claude/agents/integration-guardian.md`, `docs/handover/CODEBASE_GUARDIAN_HANDOVER_2026-10-28_v1.md` | TASK-015 |
| REQ-074 | s9 | Isolated development: verify the actual filesystem arrangement; prefer git worktrees with dedicated branches; otherwise a single-writer policy. | GOV | IN PROGRESS | Coding sub-chats use their own worktree; at most one writer per shared file. | `FILE_OWNERSHIP_AND_CHANGE_CONTROL.md` | TASK-015 |
| REQ-075 | s10 | Maintain `FILE_OWNERSHIP_AND_CHANGE_CONTROL.md` and `ACTIVE_CHANGE_REGISTER.md` with the listed fields per task. | GOV | IN PROGRESS | - | those two files | TASK-015 |
| REQ-076 | s11 | A 12-item change-impact contract before every material implementation; Guardian review for material or high-risk ones. | GOV | IN PROGRESS | - | `FILE_OWNERSHIP_AND_CHANGE_CONTROL.md`, Guardian agent | TASK-015 |
| REQ-077 | s12 | Maintain `INTERFACE_CONTRACTS.md`; coordinate consumers before changing a shared interface. | GOV | IN PROGRESS | - | `INTERFACE_CONTRACTS.md` | TASK-015 |
| REQ-078 | s13 | Integration gates A-E (implementation report, Guardian review, independent verification, controlled integration, acceptance tracked separately from deployment); an integration log; targeted recovery. | GOV | IN PROGRESS | - | `INTEGRATION_AND_REGRESSION_LOG.md` | TASK-015 |
| REQ-079 | s14, s28 | A controlled successor-chat handover in 12 steps; never pretend to create or rename a chat; make the transfer copy-and-paste for the owner. | GOV | IN PROGRESS | - | `docs/handover/continuations/README.md` | TASK-015 |
| REQ-080 | s15 | Initiate a context transfer on: three compactions, owner-reported lost context, inability to reconstruct tasks, missing details, approaching risk, need for a new specialist, retirement, Moderator replacement; prefer proactive handover; do not invent a compaction count. | GOV | IN PROGRESS | MOD-01 had two compactions (19-Oct, 27-Oct); it hands over because the owner ordered a new Moderator. | `docs/handover/continuations/README.md`, bootstrap prompt | TASK-015 |
| REQ-081 | s16 | Two successor scenarios: a sub-chat continues from its actual task branch; a Moderator successor inherits everything and validates against the repo before assigning work. | GOV | IN PROGRESS | This handover is the Moderator scenario with a clean tree. | `docs/handover/continuations/README.md` | TASK-015, TASK-016 |
| REQ-082 | s17 | Continuation-branch procedure with 8 pre-checks and names such as `handover/mod-01-to-mod-02-YYYYMMDD`; record the parent branch and source SHA. | GOV | IN PROGRESS | Branch `handover/mod-01-to-mod-02-20261028` from `2b2a397`. | git | TASK-015 |
| REQ-083 | s18 | Preserve uncommitted work: cases A-D (checkpoint commit; inventory and private patch for mixed or sensitive changes; stop on ownership conflicts; maximum safe package when git is unsafe). | GOV | IN PROGRESS | Tree was clean before the package (no work-in-progress checkpoint needed). | git | TASK-015 |
| REQ-084 | s19 | Verify the continuation branch (exists, correct base, contents, no unrelated changes, handover present, honest test status); push when safe; verify the remote SHA. | GOV | IN PROGRESS | - | git, GitHub | TASK-015 |
| REQ-085 | s20 | A copy-ready successor prompt file with sections A-J; no placeholders unless unavoidable and explained. | GOV | IN PROGRESS | - | `docs/handover/continuations/MOD-01_TO_MOD-02_SUCCESSOR_PROMPT_2026-10-28.md` | TASK-015 |
| REQ-086 | s21 | The owner's handover message with the 10 listed items (stop notice, successor name, branch, paths, URLs, local-only changes, exact prompt, exact action). | GOV | IN PROGRESS | - | MOD-01's final report | TASK-015 |
| REQ-087 | s22 | `CHAT_REGISTRY.md` with names `[CHAT-ID] \| [WORKSTREAM] \| [RESPONSIBILITY] \| [STATUS]`, the listed statuses and fields; never invent an inaccessible chat's status. | GOV | IN PROGRESS | - | `CHAT_REGISTRY.md` | TASK-015 |
| REQ-088 | s23 | Task and change registers with stable IDs; update existing records rather than duplicate; approved decisions separate from recommendations; record the original requirement, behaviour, acceptance, status, components, evidence and owner. | GOV | IN PROGRESS | - | `TASK_REGISTER.md`, this file, `DECISION_LOG.md`, the other registers | TASK-015 |
| REQ-089 | s24 | The document structure under `docs/handover/` and `docs/project-control/`; follow repository conventions where better suited; no empty templates. | GOV | IN PROGRESS | `docs/PROJECT_STATE.md` stays the single state document; `docs/project-control/README.md` points to it (no duplicate). | `docs/handover/`, `docs/project-control/` | TASK-015 |
| REQ-090 | s25 | Dated, versioned handovers that never silently overwrite earlier ones; the index states which is authoritative. | GOV | IN PROGRESS | - | `docs/handover/README.md` | TASK-015 |
| REQ-091 | s26 | The Moderator's 12-step process for every new requirement (context, workstream, dependencies, ownership, Guardian, acceptance criteria, decomposition, assignment, launch packet, tracking, gates, records). | GOV | IN PROGRESS | Applied through section 7 of this file. | `docs/handover/MODERATOR_BOOTSTRAP_PROMPT.md` | TASK-015 |
| REQ-092 | s27 | Decision escalation in plain language ("approximately at the level of a 10-year-old"): problem, why, options, effects, pros and cons, impact, maintenance, risk, reversibility, recommendation; record the decision; prepare the relay message; never claim it was sent. | GOV | IN PROGRESS | - | `DECISION_LOG.md` | TASK-015 |
| REQ-093 | s29 | Safety: no secrets or client data in handovers or prompts; preserve uncommitted work; nothing of uncertain ownership staged; no destructive or force operations; never invent permissions or success. | GOV | IN PROGRESS | Repeats REQ-018, REQ-023. | all package documents | standing |
| REQ-094 | s30 | A completeness check of the package (17 items) and consistency between the master handover and supporting files. | GOV | IN PROGRESS | - | the package | TASK-015, TASK-016 |
| REQ-095 | s31, final directive | The final report A-G; "commit and push the documentation safely where authorised, and provide the exact next steps. Then stop." | GOV | IN PROGRESS | - | git, MOD-01's final report | TASK-015 |

### 4.6 Relationships between requirements

| Requirement | Relationship |
|---|---|
| REQ-001 | Extended on 27-Oct by REQ-072 and REQ-073 (Moderator and Guardian model). Not superseded. |
| REQ-006, REQ-045 | Paused on 27-Oct by REQ-063 until MOD-02 completes TASK-016 and resumes work. |
| REQ-068 | Repeats REQ-010 and REQ-023; extends REQ-003. |
| REQ-093 | Repeats REQ-018 and REQ-023. |
| REQ-089 | Lists `docs/project-control/PROJECT_STATE.md`; resolved by keeping `docs/PROJECT_STATE.md` as the single state file and linking to it. |
| REQ-057 | Parent of REQ-PPT-01..153. |
| Inherited request (20-May-2026, from the outgoing owner's side, per the export's audit log): bond 3Y/5Y "past performance" should be "the average of the expected pre tax irr range" | Not given a REQ ID on 28-Oct-2026. Tracked as DEC-OPEN-09, TASK-027, KNOWN_ISSUES C37. If the owner confirms it, record it as REQ-096. |

## 5. PowerPoint specification items REQ-PPT-01..REQ-PPT-153

**Source (all items):** the owner's spec "Fix and Standardise the Investment Proposal PowerPoint Output",
pasted 22-Oct-2026 14:10:50 UTC in MOD-01 (owner message 6), with the client-ready reference deck (19 slides)
and a current portal output (23 slides) attached. Neither deck is in the repo; the reference deck may hold
client data and must never be committed or quoted. REQ-PPT-138..142 come from MOD-01's derived brief to
NB-03 (22-Oct 14:31 UTC) and the owner's go-ahead (15:36:58 UTC). The "Spec" column gives the spec section
(3.x objectives, 4 audit, A-I groups, 6 design system, 7.x data integrity, Stage/9 validation, 10
deliverables, 12 definition of done).

**Workstream** NB. **Owner chat** NB-03 (COMPLETED); follow-ups through MOD-02. **Task** TASK-013 unless a row
names another.

**Affected components (all items unless stated):** the export section of `site/index.html` (`window.EXPORTS`,
`buildDeck`, `DS`, `COL`, `applyMaster`, `planTable`, `drawTable`, `footerBlock`, `listTable`; grep the name,
roughly ~L4246-L5500 at `2b2a397`), `tools/test/pptx_layout.test.js`, `tools/dev/render_pptx.ps1`,
`tools/dev/check_pptx_bounds.js`.

**Acceptance (all items unless stated):** the behaviour holds for the rule-picked regression portfolios in
`tools/test/pptx_layout.test.js` (3 to 45 instruments; runs in CI; 798 checks pass on 28-Oct) and in a
PowerPoint render checked with `check_pptx_bounds.js` ("no problem found"), following D82's design rules.

**Evidence (all items):** PR #26 `5d39821`; `docs/proposal-output-format-audit.md` ("audit"); renders and the
sample deck of 22-Oct in `_testdata/pptx-design-system/` (local only, git-ignored). Line numbers `~Lnnnn` are
in `site/index.html` at `2b2a397`.

Items marked IMPLEMENTED NOT FULLY VERIFIED with no task in the last column have no open task; they become a
task only if the owner asks.

### 5.1 Primary objectives and audit

| ID | Spec | Requirement | Status | Evidence | Residual / follow-up |
|---|---|---|---|---|---|
| REQ-PPT-01 | 3.1 | Coherent Centricity-branded design system | VERIFIED COMPLETE | D82; `DS`/`COL`/`applyMaster` ~L4250-4385 | - |
| REQ-PPT-02 | 3.2 | Each section in a well-structured, client-ready layout | IMPLEMENTED NOT FULLY VERIFIED | montage; rationale cards, measured tables, aligned panels | client-readiness is the owner's judgement (Gate E); owner approved the merge 22-Oct |
| REQ-PPT-03 | 3.3 | Every table, chart and footnote within slide bounds | VERIFIED COMPLETE | layout log ~L5490; `pptx_layout` 798/798; deepest content 6.95" < 7.08" | chart-internal labels not machine-checked |
| REQ-PPT-04 | 3.4 | Space used intelligently: no excess blank space or crowding | IMPLEMENTED NOT FULLY VERIFIED | type steps 11 -> 8pt; performance buckets share slides | blank areas remain on low-density slides (s11, s17, s18, s19) |
| REQ-PPT-05 | 3.5 | Variable data without clipping, overlap or illegible fonts | VERIFIED COMPLETE | `planTable` 8pt floor, then continuation at 9pt; tests 3-45 instruments | Construct / Net Asset Allocation keep fixed geometry (C44, TASK-069) |
| REQ-PPT-06 | 3.6 | Missing data shown honestly; nothing fabricated | VERIFIED COMPLETE | "-" for nulls; matrix coverage list; `*` + STAR_NOTE | - |
| REQ-PPT-07 | 3.7 | Financial values, calculations, disclaimer and functions preserved | IMPLEMENTED NOT FULLY VERIFIED | no data block or sibling changed by PR #26 | the 73-row value comparison is a docs claim, not re-run (needs both decks) |
| REQ-PPT-08 | 3.8 | Reusable for future proposals | VERIFIED COMPLETE | rule-picked test portfolios; no slide counts snapshotted | - |
| REQ-PPT-09 | 3 | Fix the generator, not the supplied deck | VERIFIED COMPLETE | PR #26 diff; supplied deck's file time unchanged | - |
| REQ-PPT-10 | 4 | Audit the generation framework (workflow, library, sources, sizing, order, helpers, transforms, download path) | VERIFIED COMPLETE | audit s1-s3 | - |
| REQ-PPT-11 | 4 | Render both decks; inspect slides and montages; compare slide types | IMPLEMENTED NOT FULLY VERIFIED | montages of both decks | per-slide renders of the two input decks not kept |
| REQ-PPT-12 | 4 | Record problems and responsible functions before editing | VERIFIED COMPLETE | audit s3 | - |

### 5.2 Group A: branding, typography, hierarchy

| ID | Spec | Requirement | Status | Evidence | Residual / follow-up |
|---|---|---|---|---|---|
| REQ-PPT-13 | A1 | Reusable colours, fonts, sizes, margins, spacing, alignment | VERIFIED COMPLETE | `COL` ~L4253; `DS` ~L4290-4305 | - |
| REQ-PPT-14 | A2 | Consistent title position, heading hierarchy, body and table typography | VERIFIED COMPLETE | `applyMaster` title 22pt shrinking to >= 16pt; Cambria | - |
| REQ-PPT-15 | A3 | Standard spacing between headings, text, charts, tables, footnotes | VERIFIED COMPLETE | `DS.GAP`; `footerBlock` | - |
| REQ-PPT-16 | A4 | Chart colours consistent with the brand palette | VERIFIED COMPLETE | `PPT_CHART_OPTS`; `H.CREDIT_COLORS` | - |
| REQ-PPT-17 | A5 | Branding assets scaled, aligned, inside the slide | VERIFIED COMPLETE | `LOGO_HEADER` ends at 13.23" < 13.333" | - |
| REQ-PPT-18 | A6 | Current logo and descriptor from the portal, not the reference's older tagline | VERIFIED COMPLETE | `loadLogoData` ~L4246 | - |
| REQ-PPT-19 | A7 | Standard footers and page numbering | VERIFIED COMPLETE | `slide.slideNumber` on every native slide | image slides unnumbered by design (D82) |
| REQ-PPT-20 | A8 | Keep cover and dividers; edge-running decoration intentional | VERIFIED COMPLETE | `applyDividerMaster`; checker's decoration rule | - |
| REQ-PPT-21 | A | Do not redesign every slide | VERIFIED COMPLETE | cover, dividers, market, disclaimer, thank-you unchanged | - |

### 5.3 Group B: Investment Options table

| ID | Spec | Requirement | Status | Evidence | Residual / follow-up |
|---|---|---|---|---|---|
| REQ-PPT-22 | B1 | Measure the available area before choosing widths, heights, sizes | VERIFIED COMPLETE | `footerBlock` -> available height; `planTable` | - |
| REQ-PPT-23 | B2 | Account for instrument, category, sub-category, header, total rows and footnotes | VERIFIED COMPLETE | `build(pt)`; STAR_NOTE measured first | - |
| REQ-PPT-24 | B3 | Keep every Investment Option column | VERIFIED COMPLETE | test "IO page keeps 10 columns" | - |
| REQ-PPT-25 | B4 | Distinguish asset-class total, category, sub-category, instrument and grand-total rows | VERIFIED COMPLETE | fills ~L4959-4997 | - |
| REQ-PPT-26 | B5 | Long names and maturity/exit text wrap cleanly | VERIFIED COMPLETE | name column preference 4.0"; Maturity/Exit wraps | - |
| REQ-PPT-27 | B6 | Numbers readable and aligned | VERIFIED COMPLETE | `columnWidths` | - |
| REQ-PPT-28 | B7 | "100.00%" never breaks over two lines | VERIFIED COMPLETE | `cellNeed`; test on `TXT.width` | - |
| REQ-PPT-29 | B8 | Final total row and footnotes visible | VERIFIED COMPLETE | test: GRAND TOTAL on every IO page | - |
| REQ-PPT-30 | B9 | Safe margin above footer, page number, bottom accent | VERIFIED COMPLETE | `DS.FOOT - STAMP_H - GAP`; deepest 6.95" | - |
| REQ-PPT-31 | B10 | Do not shrink all text indiscriminately | VERIFIED COMPLETE | 8pt floor, then continue at 9pt | - |
| REQ-PPT-32 | B overflow | Continuation slides with repeated headers and a continuation label | VERIFIED COMPLETE | `planTable`; "(i/n)" titles | - |
| REQ-PPT-33 | B overflow | Category context across splits; never drop rows, totals or columns | VERIFIED COMPLETE | "(continued)" context row; GRAND TOTAL on every page | GRAND TOTAL repeats the whole-proposal figure on each page (PRD s9.2 choice) |
| REQ-PPT-34 | B | Works for more or fewer instruments | VERIFIED COMPLETE | tests with 3, 6, 8, 15, 30, 45 instruments | - |

### 5.4 Group C: Investment Options rationale

| ID | Spec | Requirement | Status | Evidence | Residual / follow-up |
|---|---|---|---|---|---|
| REQ-PPT-35 | C1 | Cards or panels instead of one text block | VERIFIED COMPLETE | card grid ~L4849-4910 | - |
| REQ-PPT-36 | C2 | A distinct heading per option | VERIFIED COMPLETE | one card per sub-category | rationale text is held per sub-category, not per instrument |
| REQ-PPT-37 | C3 | Concise readable paragraphs, sensible line length | VERIFIED COMPLETE | ~6.0" text width | - |
| REQ-PPT-38 | C4 | Selective bold | VERIFIED COMPLETE | tag, heading, lead-in only | - |
| REQ-PPT-39 | C5 | Clear reading order | VERIFIED COMPLETE | `H.acIdx` order | - |
| REQ-PPT-40 | C6 | Balanced use of the slide | IMPLEMENTED NOT FULLY VERIFIED | card grid | lower part blank with 5 cards |
| REQ-PPT-41 | C7 | Several slides or columns for dense content | VERIFIED COMPLETE | 45-instrument stress deck: 4 rationale slides | - |
| REQ-PPT-42 | C8 | Preserve the supplied descriptions | VERIFIED COMPLETE | `window.RATIONALE` unchanged | - |

### 5.5 Group D: portfolio analytics and charts

| ID | Spec | Requirement | Status | Evidence | Residual / follow-up |
|---|---|---|---|---|---|
| REQ-PPT-43 | D1 | Doughnut labels never overlap | VERIFIED COMPLETE | in-chart labels off | - |
| REQ-PPT-44 | D2 | Legend or outside labels | VERIFIED COMPLETE | legend "bucket - x.xx%" | - |
| REQ-PPT-45 | D3 | Do not label every value inside the chart | VERIFIED COMPLETE | as REQ-PPT-43 | - |
| REQ-PPT-46 | D4 | Titles, plots, legends and axes aligned | VERIFIED COMPLETE | two-panel grid | - |
| REQ-PPT-47 | D5 | Category and instrument names readable | IMPLEMENTED NOT FULLY VERIFIED | chart labels | no truncation or wrap control |
| REQ-PPT-48 | D6 | No excessive whitespace inside charts | IMPLEMENTED NOT FULLY VERIFIED | AMC chart | whitespace with only 2 AMCs |
| REQ-PPT-49 | D7 | Scales and number formats suit the data | VERIFIED COMPLETE | hidden value axis; `0.00"%"` | - |
| REQ-PPT-50 | D8 | Consistent chart palette | VERIFIED COMPLETE | as REQ-PPT-16 | - |
| REQ-PPT-51 | D9 | Charts connected to their tables | VERIFIED COMPLETE | two-panel layout, shared stamp | - |
| REQ-PPT-52 | D10 | Chart figures unchanged | IMPLEMENTED NOT FULLY VERIFIED | same `H.agg*` functions | not re-compared against the old output |

### 5.6 Group E: performance tables and appendix slides

| ID | Spec | Requirement | Status | Evidence | Residual / follow-up |
|---|---|---|---|---|---|
| REQ-PPT-53 | E1 | Layout chosen by the actual rows and columns | VERIFIED COMPLETE | per-bucket column sets | - |
| REQ-PPT-54 | E2 | A larger table when it helps | VERIFIED COMPLETE | 11pt tried first | - |
| REQ-PPT-55 | E3 | Rebalance heights, spacing and fonts | VERIFIED COMPLETE | measured `rowHeights` | - |
| REQ-PPT-56 | E4 | Summary panels only when the data supports them | VERIFIED COMPLETE | none added | - |
| REQ-PPT-57 | E5 | No decorative filler | VERIFIED COMPLETE | none added | - |
| REQ-PPT-58 | E6 | Keep dates, benchmark labels, periods and notes | VERIFIED COMPLETE | labels kept | PMS label inherits B1 (TASK-025); benchmark values are static (C41, TASK-065) |
| REQ-PPT-59 | E7 | Consistent hierarchy in performance tables | VERIFIED COMPLETE | ~L5163-5212 | - |
| REQ-PPT-60 | E8 | Readable headers; widths fit labels | VERIFIED COMPLETE | `_wrap` + `cellNeed` | - |
| REQ-PPT-61 | E9 | Continuation slides keep styling and context | VERIFIED COMPLETE | same `build`; "(i/n)" | - |
| REQ-PPT-62 | E | Density-based layout variants | IMPLEMENTED NOT FULLY VERIFIED | buckets share slides | s17 Direct Bonds about 55% blank |
| REQ-PPT-63 | E/F, audit | Debt PMS not under "PMS - Equity"; market-cap columns only with data | VERIFIED COMPLETE | deck buckets | screen and Excel still differ (C29, TASK-046) |
| REQ-PPT-64 | audit | PMS/AIF tables dated by `DATA_DATES.pms` | VERIFIED COMPLETE | deck date stamp | the label value itself is wrong (B1, TASK-025) |
| REQ-PPT-65 | audit, latent | Benchmark values placed by period key | VERIFIED COMPLETE | `retKeys` ~L5189, ~L5201 | - |

### 5.7 Group F: risk-reward matrix and unavailable data

| ID | Spec | Requirement | Status | Evidence | Residual / follow-up |
|---|---|---|---|---|---|
| REQ-PPT-66 | F1 | Trace each matrix field to its source | VERIFIED COMPLETE | `MCOLS` ~L5279 | - |
| REQ-PPT-67 | F2 | Separate unavailable, not applicable and mapping defect | IMPLEMENTED NOT FULLY VERIFIED | coverage notes | the deck shows unavailable and not applicable both as "-" |
| REQ-PPT-68 | F3 | Never fabricate risk statistics | VERIFIED COMPLETE | values only from `RM[name]` | - |
| REQ-PPT-69 | F4 | Zero, missing and not applicable kept distinct | IMPLEMENTED NOT FULLY VERIFIED | "-" for missing | no "not applicable" marker |
| REQ-PPT-70 | F5 | Limitations easy for a client to understand | VERIFIED COMPLETE | coverage notes | - |
| REQ-PPT-71 | F6 | A wholly unavailable column handled, not discarded | IMPLEMENTED NOT FULLY VERIFIED | column kept | partial coverage prints a full "-" column |
| REQ-PPT-72 | F7 | Compact layout when little risk data exists | VERIFIED COMPLETE | 3-column coverage list (s18) | - |
| REQ-PPT-73 | F8 | Methodology, date and limitations readable | VERIFIED COMPLETE | "Risk data as on" stamp | - |
| REQ-PPT-74 | audit | The average row shows the covered share | VERIFIED COMPLETE | `covPct` | - |
| REQ-PPT-75 | audit, C22 | A long unflagged matrix fitted or continued | VERIFIED COMPLETE | C22 Closed | - |

### 5.8 Group G: AMC allocation and portfolio liquidity

| ID | Spec | Requirement | Status | Evidence | Residual / follow-up |
|---|---|---|---|---|---|
| REQ-PPT-76 | G1 | Balance the AMC and liquidity panels | IMPLEMENTED NOT FULLY VERIFIED | two-panel layout | s19 unbalanced with 2 AMCs |
| REQ-PPT-77 | G2 | Align panel titles, charts and table | VERIFIED COMPLETE | `sectionTitle` at `DS.TOP` | - |
| REQ-PPT-78 | G3 | Chart margins and plot areas | IMPLEMENTED NOT FULLY VERIFIED | shared options | not measured |
| REQ-PPT-79 | G4 | Long AMC and instrument names | IMPLEMENTED NOT FULLY VERIFIED | labels | no wrap control for AMC labels; AMC names fall back to the first word (C31, TASK-052) |
| REQ-PPT-80 | G5 | Standard chart and table typography | VERIFIED COMPLETE | Cambria 9-10pt | - |
| REQ-PPT-81 | G6 | Keep allocation and liquidity classifications | VERIFIED COMPLETE | `H.aggAMC`, `H.aggLiquidity` unchanged | - |
| REQ-PPT-82 | G7 | No whitespace from oversized charts | IMPLEMENTED NOT FULLY VERIFIED | as REQ-PPT-76 | as REQ-PPT-76 |
| REQ-PPT-83 | G8 | Percentages reconcile with the source | VERIFIED COMPLETE | AMC bars sum to 100%; at most 12 bars | - |
| REQ-PPT-84 | G | Any number of AMCs and instruments | VERIFIED COMPLETE | 15-AMC test case | - |

### 5.9 Group H: sequence, sections, slide count

| ID | Spec | Requirement | Status | Evidence | Residual / follow-up |
|---|---|---|---|---|---|
| REQ-PPT-85 | H1 | Document the sequence of all slide types | VERIFIED COMPLETE | audit s2; PRD s9.2 | - |
| REQ-PPT-86 | H2 | Separate formatting defects from data defects | VERIFIED COMPLETE | C28-C33 logged | - |
| REQ-PPT-87 | H3 | Keep the portal's slide sequence | VERIFIED COMPLETE | `buildDeck` order | - |
| REQ-PPT-88 | H4 | Do not reorder to imitate the reference | VERIFIED COMPLETE | Market Update stays after the cover | the reference's "Market Update at the end" deliberately not copied (SUPERSEDED by this rule) |
| REQ-PPT-89 | H5 | Reuse the reference's layout patterns | VERIFIED COMPLETE | panels, cards, header rows | - |
| REQ-PPT-90 | H6 | Do not delete analytics or capabilities | VERIFIED COMPLETE | every builder present; 9 single-tab exports tested | - |
| REQ-PPT-91 | H7 | Page numbers, titles and continuation labels correct | VERIFIED COMPLETE | renders s13, s17 | - |
| REQ-PPT-92 | H8a | Disclaimer wording preserved exactly | VERIFIED COMPLETE | `EXTRA_SLIDES.disclaimer` unchanged | - |
| REQ-PPT-93 | H8b | Improve the Disclaimer slide layout | BLOCKED | compliance text lives in a desk image | needs the desk's source slide (DESK-10) and DEC-OPEN-21; TASK-038; C34, B7 |

### 5.10 Group I: footnotes, margins, slide-boundary safety

| ID | Spec | Requirement | Status | Evidence | Residual / follow-up |
|---|---|---|---|---|---|
| REQ-PPT-94 | I1 | Consistent safe margins | VERIFIED COMPLETE | `DS` margins | Construct / NAA exception (C44, TASK-069) |
| REQ-PPT-95 | I2 | Nothing beyond the canvas except full-bleed art | VERIFIED COMPLETE | layout log; checker | - |
| REQ-PPT-96 | I3 | No collisions with the rule, page number or footer | VERIFIED COMPLETE | notes end at 7.34" above the rule at 7.40" | - |
| REQ-PPT-97 | I4 | Footnotes legible and not clipped | VERIFIED COMPLETE | 8.5pt measured by `TXT` | - |
| REQ-PPT-98 | I5 | Distinguish decoration from overflow | VERIFIED COMPLETE | `tools/dev/check_pptx_bounds.js:22-29` | - |
| REQ-PPT-99 | I6 | Reusable bounds-check helpers | VERIFIED COMPLETE | `window.__PPTX_LAYOUT`; `render_pptx.ps1` + `check_pptx_bounds.js` | the render check is manual, not in CI; C44 (TASK-069) |

### 5.11 Reusable design system (spec section 6)

| ID | Spec | Requirement | Status | Evidence | Residual / follow-up |
|---|---|---|---|---|---|
| REQ-PPT-100 | 6 | Helper: slide titles and brand headers | VERIFIED COMPLETE | `applyMaster`, `contentSlide` | - |
| REQ-PPT-101 | 6 | Helper: section headers | VERIFIED COMPLETE | `sectionTitle` | - |
| REQ-PPT-102 | 6 | Helper: margins and footer | VERIFIED COMPLETE | `DS`, `footerBlock`, `drawFooter` | - |
| REQ-PPT-103 | 6 | Helper: tables | VERIFIED COMPLETE | `drawTable` | two tables bypass it (C44, TASK-069) |
| REQ-PPT-104 | 6 | Helper: grouped rows and totals | VERIFIED COMPLETE | `planTable` levels and sticky rows | - |
| REQ-PPT-105 | 6 | Helper: dynamic widths and heights | VERIFIED COMPLETE | `columnWidths`, `rowHeights` | - |
| REQ-PPT-106 | 6 | Helper: wrapping and fit checks | VERIFIED COMPLETE | `TXT.lines` | calibration claim (197/200) not re-run |
| REQ-PPT-107 | 6 | Helper: table pagination | VERIFIED COMPLETE | `planTable` | - |
| REQ-PPT-108 | 6 | Helper: charts | IMPLEMENTED NOT FULLY VERIFIED | shared `PPT_CHART_OPTS` object | no chart helper function; doughnut options repeated per chart |
| REQ-PPT-109 | 6 | Helper: cards and multi-panel summaries | IMPLEMENTED NOT FULLY VERIFIED | card code in the rationale section | inline code, not a reusable function |
| REQ-PPT-110 | 6 | Helper: performance and analytics tables | VERIFIED COMPLETE | performance blocks + `planTable`; `listTable` | `listTable` callers draw only page 1: a second page would vanish without a warning (C45, TASK-069) |
| REQ-PPT-111 | 6 | Helper: footnotes and methodology notes | VERIFIED COMPLETE | `footerBlock` | - |
| REQ-PPT-112 | 6 | Helper: slide numbers and continuation | VERIFIED COMPLETE | `slideNumber`, `pageTitle` | - |
| REQ-PPT-113 | 6 | No new dependency or separate generator | VERIFIED COMPLETE | pptxgenjs 3.12.0; no seventh deploy file | - |
| REQ-PPT-114 | 6 | Neither identical-everywhere nor inconsistent one-offs | VERIFIED COMPLETE | shared frame, slide-specific compositions | - |

### 5.12 Data integrity (spec section 7, mandatory)

| ID | Spec | Requirement | Status | Evidence | Residual / follow-up |
|---|---|---|---|---|---|
| REQ-PPT-115 | 7.1 | No change to selection logic or calculations | VERIFIED COMPLETE | C24 left alone as briefed | - |
| REQ-PPT-116 | 7.2 | No values copied from the reference deck | IMPLEMENTED NOT FULLY VERIFIED | values from fund records | a negative cannot be proven |
| REQ-PPT-117 | 7.3 | Invent nothing | VERIFIED COMPLETE | `*` marks expected figures (D83) | - |
| REQ-PPT-118 | 7.4 | No cosmetic changes to values or the disclaimer | VERIFIED COMPLETE | values from fund records | - |
| REQ-PPT-119 | 7.5 | Preserve slide types and the export workflow | VERIFIED COMPLETE | `exportPpt` / `exportTabSlide` unchanged | - |
| REQ-PPT-120 | 7.6 | Never silently remove content | IMPLEMENTED NOT FULLY VERIFIED | documented market-cap column drops | latent `listTable` page-2 drop (C45, TASK-069) |
| REQ-PPT-121 | 7.7 | A different display keeps the full meaning | VERIFIED COMPLETE | coverage note, legend values | - |
| REQ-PPT-122 | 7.8 | Document data-mapping defects separately | VERIFIED COMPLETE | C28-C33 | - |
| REQ-PPT-123 | 7.9 | Totals and chart data reconcile | IMPLEMENTED NOT FULLY VERIFIED | same aggregation functions | amounts and chart caches not re-checked |
| REQ-PPT-124 | 7.10 | Data-driven; no fixed positions as the general solution | IMPLEMENTED NOT FULLY VERIFIED | measured layout | C44 fixed geometry (TASK-069); deliberate caps (12 AMC bars, Top 10/18/20) |
| REQ-PPT-125 | D83, audit | Mark expected 1Y/3Y/5Y figures with `*` and a note | VERIFIED COMPLETE | `H.isExpectedReturn` ~L1955 | screen and Excel do not mark them (C28, TASK-031) |

### 5.13 Stages and validation (spec sections 8-9)

| ID | Spec | Requirement | Status | Evidence | Residual / follow-up |
|---|---|---|---|---|---|
| REQ-PPT-126 | Stage 1 | Reproduce the current output before changing code | IMPLEMENTED NOT FULLY VERIFIED | audit s1 | reproduction deck not kept |
| REQ-PPT-127 | Stages 2-4 | Staged fixes, including the remaining templates | IMPLEMENTED NOT FULLY VERIFIED | PR #26 | fund-specific pages not built (DEC-OPEN-23); Disclaimer BLOCKED (TASK-038) |
| REQ-PPT-128 | Stage 5 / 9A | Regenerate through the real workflow; render; inspect | IMPLEMENTED NOT FULLY VERIFIED | renders of 22-Oct in `_testdata/` | local only (R11) |
| REQ-PPT-129 | 9B | Bounds and rendering tests | IMPLEMENTED NOT FULLY VERIFIED | the 8 kept COM bounds files re-checked 28-Oct: 8 of 8 "no problem found" | render check is manual and not in CI; chart internals not checked |
| REQ-PPT-130 | 9C | Validate the deck's data against the source | IMPLEMENTED NOT FULLY VERIFIED | audit claim | not re-run (needs both decks) |
| REQ-PPT-131 | 9D | Regression cases | VERIFIED COMPLETE | 7 rule-picked cases; stress decks | - |
| REQ-PPT-132 | 9D | Targeted tests in the existing test infrastructure | VERIFIED COMPLETE | `tools/test/pptx_layout.test.js` in CI | - |

### 5.14 Deliverables (spec section 10) and process (brief)

| ID | Spec | Requirement | Status | Evidence | Residual / follow-up |
|---|---|---|---|---|---|
| REQ-PPT-133 | 10A | Updated generator code | VERIFIED COMPLETE | PR #26; live `index.html` SHA-256 = local | - |
| REQ-PPT-134 | 10B | Audit document | VERIFIED COMPLETE | `docs/proposal-output-format-audit.md` (198 lines) | - |
| REQ-PPT-135 | 10C | A new sample deck; originals untouched | VERIFIED COMPLETE | `_testdata/pptx-design-system/` | local only (R11) |
| REQ-PPT-136 | 10D | Montage, high-risk renders and results | VERIFIED COMPLETE | `_testdata/`; raw COM files in `%TEMP%\x\` | local only and volatile (R11, TASK-070) |
| REQ-PPT-137 | 10E | Final summary | IMPLEMENTED NOT FULLY VERIFIED | CHANGELOG; audit s6-s7 | - |
| REQ-PPT-138 | brief | Branch from an up-to-date main; `verify` green | VERIFIED COMPLETE | `gh pr view 26` | - |
| REQ-PPT-139 | brief | Docs: CHANGELOG, PROJECT_STATE, KNOWN_ISSUES, DECISIONS | VERIFIED COMPLETE | D82, D83; C28-C34 | - |
| REQ-PPT-140 | brief | Send the montage and sample deck; get the go-ahead before merging | VERIFIED COMPLETE | files sent 22-Oct 15:36:08 and 15:36:10 UTC; go-ahead 15:36:58; merge 15:37:21 | - |
| REQ-PPT-141 | brief / owner msg 2 | Confirm the live files match `site/` after merge | VERIFIED COMPLETE | PR #27; live 7/7 (28-Oct) | - |
| REQ-PPT-142 | brief | Never upgrade pptxgenjs or CDN libraries; never commit decks | VERIFIED COMPLETE | no `.pptx` tracked | - |

### 5.15 Definition of done (spec section 12)

| ID | Spec | Criterion | Status | Basis | Residual / follow-up |
|---|---|---|---|---|---|
| REQ-PPT-143 | 12 | All required content retained | IMPLEMENTED NOT FULLY VERIFIED | REQ-PPT-120 | TASK-069 |
| REQ-PPT-144 | 12 | Figures faithful to proposal data | IMPLEMENTED NOT FULLY VERIFIED | REQ-PPT-130 | - |
| REQ-PPT-145 | 12 | Investment tables fit or continue cleanly | VERIFIED COMPLETE | REQ-PPT-22..34 | - |
| REQ-PPT-146 | 12 | Charts legible; labels do not overlap | IMPLEMENTED NOT FULLY VERIFIED | REQ-PPT-43..48 | - |
| REQ-PPT-147 | 12 | Dense text structured | VERIFIED COMPLETE | REQ-PPT-35..42 | - |
| REQ-PPT-148 | 12 | Tables use their space well | IMPLEMENTED NOT FULLY VERIFIED | REQ-PPT-04, REQ-PPT-62 | - |
| REQ-PPT-149 | 12 | Missing data transparent | VERIFIED COMPLETE | REQ-PPT-06, REQ-PPT-125 (with the REQ-PPT-67/71 caveats) | - |
| REQ-PPT-150 | 12 | One design system throughout | VERIFIED COMPLETE | REQ-PPT-13..21, REQ-PPT-100..114 | - |
| REQ-PPT-151 | 12 | Every slide rendered and inspected | IMPLEMENTED NOT FULLY VERIFIED | REQ-PPT-128 | TASK-064 re-checks an export on the live build |
| REQ-PPT-152 | 12 | No clipping, overlap or overflow | IMPLEMENTED NOT FULLY VERIFIED | REQ-PPT-129 | - |
| REQ-PPT-153 | 12 | Works for different portfolio compositions | VERIFIED COMPLETE | REQ-PPT-131 | - |

Deliberately not done from the spec, recorded in `docs/proposal-output-format-audit.md` s7: the reference
deck's "Coupon" and "Credit Rating" columns (the spec keeps the portal's columns) and the reference's slide
order. Rejected layout approaches are listed in D82 and D83.

## 6. Requirements with gaps in evidence

| Item | What is missing |
|---|---|
| REQ-049 "full testing" before retiring the old site | No record that the team tested real proposals on the new link; "full testing" is undefined (DEC-OPEN-24). |
| REQ-054 "portfolio dashboard" link | Which dashboard the owner meant (DEC-OPEN-28). |
| REQ-034 clean setup reproducible | No recorded fresh-clone run (TASK-072). |
| REQ-023 no force-push | A negative cannot be proven from the repo or the GitHub API; no contrary evidence. |
| REQ-030 agent orchestration per change | Which reviewers ran on each PR is recorded only in transcripts (PRs #17, #18, #26). |
| REQ-011 chat-history review | How much of the export's transcripts and history summary was reconciled (TASK-073). |
| REQ-019 parity limits | Excel export never opened in Excel; browsers other than the built-in Chromium untested (TASK-064). |
| REQ-044 auto-publish | Never exercised; the first monthly cycle on the new build has not run (TASK-020, TASK-021). |
| REQ-042 "the data for whatever changes" | Whether the owner expected source workbooks on GitHub; current practice (records only, D65) not confirmed with the owner. |

## 7. Change requests: how a new requirement is recorded

When the owner gives a new requirement, request or file (MODERATOR_BOOTSTRAP_PROMPT has the Moderator's
12-step process, REQ-091):

1. **Check for an existing record first.** Search this file and `TASK_REGISTER.md` for the topic, the
   KNOWN_ISSUES ID and key words. If the owner is repeating or refining an existing requirement, update that
   row: add the new date and source to the Src or Date / source cell, adjust the wording if the owner changed
   it, and keep the ID. Never create a second ID for the same request.
2. **New requirement = next free ID.** `REQ-096` onward (`REQ-PPT-154` onward only for items of the
   PowerPoint specification family). IDs are never reused or renumbered.
3. **Record:** the owner's words (short, close to the original; no client names, investor data or personal
   data), the date and time (UTC), the source (chat ID and message), the workstream (EX, NB, OPS, GOV), the
   intended behaviour, the acceptance criteria (how we will know it is met), the affected components (from
   `ARCHITECTURE_AND_DEPENDENCY_MAP.md`), the status (PLANNED once accepted; NOT STARTED or UNKNOWN /
   NEEDS INVESTIGATION while being understood), and the task / chat.
4. **Link the work:** open a task in `TASK_REGISTER.md` (next free TASK number) and put its ID in the Task /
   chat cell. If the requirement needs an owner decision, open a `DEC-OPEN-nn` in `DECISION_LOG.md` and name
   it in both registers.
5. **Derived and preset wording.** If the requirement comes from a brief Claude wrote, mark it "derived". If
   the owner's message is the text of a button Claude offered, mark it "preset button".
6. **Status changes need evidence:** a merged PR and merge SHA, a test or verification output, or the
   owner's dated acceptance. Implementation alone is IMPLEMENTED NOT FULLY VERIFIED.
7. **Superseded requirements.** When the owner replaces a requirement, keep the old row, set its status to
   SUPERSEDED and write "Superseded by REQ-nnn (or Dnn) on dd-Mmm-yyyy" in its evidence cell. Never delete or
   rewrite a row's history.
8. **Commit** the register change on a `docs/` branch through a PR, with the change log entry below.

## 8. Change log

| Date | Change | By |
|---|---|---|
| 28-Oct-2026 | Register created from the 28-Oct-2026 requirement and PowerPoint fact sheets: REQ-001..REQ-095 and REQ-PPT-01..REQ-PPT-153. REQ-PPT-140 set to VERIFIED COMPLETE (files were sent before the go-ahead). | MOD-01 |

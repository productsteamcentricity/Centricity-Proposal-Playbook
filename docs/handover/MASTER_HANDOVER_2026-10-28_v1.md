# Master handover: MOD-01 to MOD-02 (28-Oct-2026, v1)

| Field | Value |
|---|---|
| Version | 1 |
| Date | 28-Oct-2026 |
| Author chat | MOD-01 (`local_11e29451-b340-463b-8289-9a30c5fa2173`, "Investment Proposal Dashboard architecture"), retiring Moderator |
| Successor | MOD-02 (a new chat the owner starts with [`continuations/MOD-01_TO_MOD-02_SUCCESSOR_PROMPT_2026-10-28.md`](continuations/MOD-01_TO_MOD-02_SUCCESSOR_PROMPT_2026-10-28.md)) |
| Status | Authoritative master handover from the merge of `handover/mod-01-to-mod-02-20261028` until a later `MASTER_HANDOVER_*` supersedes it; after that, a Historical snapshot |
| Supersedes | Nothing (first master handover). [`../HANDOVER.md`](../HANDOVER.md) (new-maintainer guide, 16-Oct-2026) stays; parts of it are stale (KNOWN_ISSUES E8, E10) |
| Code and data baseline | `2b2a397` = `origin/main` = PR #28 merge (27-Oct-2026). The package adds documentation and one agent definition only; `site/` and `tools/` are unchanged |
| Next review | When MOD-02 completes TASK-016 (package validation), and at the next Moderator handover |

Labels used for claims: VERIFIED (a command, file:line or SHA was checked, by MOD-01 or one of its
read-only investigators, on the date given), INFERRED (reasoned from the cited evidence), UNCERTAIN,
UNKNOWN. Status words are only: VERIFIED COMPLETE, IMPLEMENTED NOT FULLY VERIFIED, IN PROGRESS, PLANNED,
BLOCKED, NOT STARTED, EXISTING DEFECT, UNKNOWN / NEEDS INVESTIGATION, SUPERSEDED.

---

## 0. How to use this package

**This file is a snapshot of 28-Oct-2026. It is not proof of the current working tree, branch state or
live site.** Before acting on anything here, re-check it against git, the code and the live files
(TASK-016). Code and git win over every document, including this one.

### 0.1 Reading order for MOD-02

1. The successor prompt (the owner pastes it):
   [`continuations/MOD-01_TO_MOD-02_SUCCESSOR_PROMPT_2026-10-28.md`](continuations/MOD-01_TO_MOD-02_SUCCESSOR_PROMPT_2026-10-28.md).
   The general version for any future Moderator is [`MODERATOR_BOOTSTRAP_PROMPT.md`](MODERATOR_BOOTSTRAP_PROMPT.md).
2. This file: sections 1, 5, 9 and 13 first, the rest as needed.
3. [`../../CLAUDE.md`](../../CLAUDE.md) (rules that protect production, and the new "Project control"
   section) and [`../PROJECT_STATE.md`](../PROJECT_STATE.md) (the single state document).
4. [`../project-control/README.md`](../project-control/README.md), then `CHAT_REGISTRY.md`,
   `TASK_REGISTER.md`, `DECISION_LOG.md`, `ACTIVE_CHANGE_REGISTER.md`, `REPOSITORY_AND_ENVIRONMENT_STATE.md`.
5. The workstream handovers: [`EXISTING_DASHBOARD_HANDOVER_2026-10-28_v1.md`](EXISTING_DASHBOARD_HANDOVER_2026-10-28_v1.md)
   (Workstream A) and [`NEW_BUILD_HANDOVER_2026-10-28_v1.md`](NEW_BUILD_HANDOVER_2026-10-28_v1.md)
   (Workstream B and monthly operations).
6. The Guardian set: [`CODEBASE_GUARDIAN_HANDOVER_2026-10-28_v1.md`](CODEBASE_GUARDIAN_HANDOVER_2026-10-28_v1.md),
   [`../project-control/ARCHITECTURE_AND_DEPENDENCY_MAP.md`](../project-control/ARCHITECTURE_AND_DEPENDENCY_MAP.md),
   [`../project-control/INTERFACE_CONTRACTS.md`](../project-control/INTERFACE_CONTRACTS.md),
   [`../project-control/KNOWN_ISSUES_AND_REGRESSION_RISKS.md`](../project-control/KNOWN_ISSUES_AND_REGRESSION_RISKS.md).
7. Before any data or code work: [`../OPERATING_MANUAL.md`](../OPERATING_MANUAL.md) (Traps),
   [`../MONTHLY_UPDATE_PROCESS.md`](../MONTHLY_UPDATE_PROCESS.md), [`../KNOWN_ISSUES.md`](../KNOWN_ISSUES.md),
   [`../DECISIONS.md`](../DECISIONS.md).

### 0.2 What is authoritative for what

| Question | Authoritative source | Not authoritative |
|---|---|---|
| What the code and data are | `site/`, `tools/`, git history, the live files | any document, including this one |
| Where the project stands | [`../PROJECT_STATE.md`](../PROJECT_STATE.md) | this snapshot after 28-Oct-2026 |
| Defects and their severity | [`../KNOWN_ISSUES.md`](../KNOWN_ISSUES.md) | `KNOWN_ISSUES_AND_REGRESSION_RISKS.md` (an index of it plus the regression-risk catalogue) |
| Approved decisions | [`../DECISIONS.md`](../DECISIONS.md) (D1-D83; next free D84) | `DECISION_LOG.md` (open decisions and recommendations only) |
| Open owner decisions (DEC-OPEN-nn) | [`../project-control/DECISION_LOG.md`](../project-control/DECISION_LOG.md) | - |
| Tasks, requirements, chats, file claims, integration history | the registers in [`../project-control/`](../project-control/) | chat transcripts |
| Repository and environment detail | [`../project-control/REPOSITORY_AND_ENVIRONMENT_STATE.md`](../project-control/REPOSITORY_AND_ENVIRONMENT_STATE.md) | section 3 below (summary) |
| What the product does | [`../PRD.md`](../PRD.md) (with the errata noted in KNOWN_ISSUES E2) | - |

IDs: `REQ-nnn`, `REQ-PPT-nn`, `TASK-nnn`, `DEC-OPEN-nn`, `Dnn` (approved, `docs/DECISIONS.md`) and
KNOWN_ISSUES IDs (`A..`, `B..`, `C..`, `E..`, `F..`, `R..`) are stable. Never renumber or reuse one; a
new item takes the next free number (REQ-096, REQ-PPT-154, TASK-075, DEC-OPEN-29, D84, A32, B10, C46,
E17, F4, R12).

---

## 1. The project in one page

| Item | Value |
|---|---|
| Product | The **Centricity Investment Proposal Dashboard** ("Proposal Playbook"): a static, build-less React page. A Products-team user picks instruments from about 7,700 (MF, ETF, SIF, PMS, AIF, bonds, Direct Equity, GIFT City and others), allocates a corpus, and exports a branded PowerPoint deck and an Excel workbook for an HNI / UHNI / Family Office client. All data is embedded in the page; nothing is fetched at run time except five CDN libraries. |
| Users | Centricity's Products team (internal); the outputs go to clients |
| Owner | The Centricity Products team, GitHub account `productsteamcentricity` (product owner; makes every product and data decision) |
| Who does the technical work | Claude chats of this project (git, GitHub, tests, docs), coordinated by the Moderator |
| Repository (ours) | https://github.com/productsteamcentricity/Centricity-Proposal-Playbook (public, D60), remote `origin` |
| Live site (ours) | https://productsteamcentricity.github.io/Centricity-Proposal-Playbook/ (GitHub Actions publishes `site/` from `main`) |
| Outgoing owner's repo | https://github.com/magazineishita1108-boop/Centricity-Proposal-Playbook, remote `upstream`, read-only (push URL disabled). Public, not archived, last push 14-Oct-2026 (VERIFIED 28-Oct) |
| Old site (outgoing owner's) | https://magazineishita1108-boop.github.io/Centricity-Proposal-Playbook/ - still live (HTTP 200), serves the handover baseline; retirement PLANNED (section 4.1) |
| Local path | `%USERPROFILE%\OneDrive - CENTRICITY FINANCIAL DISTRIBUTION PRIVATE LIMITED\Desktop\Claude Code-Investment Proposal Dashboard` (the workspace folder is the git repo; it lives inside OneDrive, KNOWN_ISSUES R6) |
| Deploy unit | Six files in `site/` (`index.html` + 5 sibling scripts, plus `robots.txt`); `index.html` alone silently reverts data (CLAUDE.md rule 1, D1) |
| Monthly cycle | Desk/vendor workbooks dropped in `monthly-updates/00_INBOX/` (local only) -> Node tools in `tools/` (dry-run first) -> PR -> CI `verify` -> merge publishes (D61). Command: `/monthly-update <Month YYYY>` |
| Two workstreams | **A - Existing dashboard (EX):** the outgoing owner's live Playbook, replicated into our repo and proven equal; transfer completion and old-site retirement. **B - New build (NB):** every improvement on top of that baseline in our repo. Plus **OPS** (monthly data runs) and **GOV** (docs, registers, handovers). |
| Sister project | The **Portfolio Review Dashboard** (other folder `%USERPROFILE%\OneDrive - ...\Desktop\Claude Code-Portfolio Review Dashboard`, its own repo and chats EXT-PR-01, EXT-PR-02). **EXTERNAL: out of scope** for this package and this Moderator. `docs/specs/Portfolio_Review_Build_Prompt.md` here is a redacted reference copy only. Whether one Moderator should cover both projects is DEC-OPEN-25 (recommendation: one per project). |

Note on "existing" versus "new": both live in the same repository. The existing dashboard is the
content of tag `handover-baseline` (site state S0), still served unchanged by the old site. The new build
is `main` (site state S7 today), served by our live site. They are seven site-changing merges apart
(section 3.2).

---

## 2. History and timeline, 15-Oct to 28-Oct-2026

Before this project: the outgoing owner built the Playbook with their own Claude setup (74 commits; last
push 14-Oct-2026, `72e1f1e`) and handed over a repo zip, a workbook zip and a PRD on 14-Oct-2026.

### 2.1 Owner requests and what was done (times UTC)

| Date / time | Owner's request (close to the owner's words) | What was done | PRs | Chat |
|---|---|---|---|---|
| 15-Oct 14:36 | Master prompt "Replication, architecture, GitHub ownership and long-term maintenance": Stage A first (replicate, reproduce, transfer to `productsteamcentricity`, document; stop after the baseline), Stage B later; plus a monthly-updates folder, neat organisation, explain the monthly process, keep pushing changes to GitHub | Discovery, replication, sanitised history migration (client names redacted, D64), docs and agents | - | MOD-01 |
| 16-Oct 05:40 | Answers: hosting "Public + free Pages"; publishing "Publish automatically" | D60, D61 | - | MOD-01 |
| 16-Oct 07:15-07:21 | - | Transfer baseline merged and published (8 live files = `site/`); Stage A report | #1, #2 | MOD-01 |
| 16-Oct 13:09 | "Start fixing all the issues that you have identified and tell me the impact of that pre and post fixing"; write an export prompt for the previous owner that captures all data, says nothing about deleting the existing dashboard ("that will happen after full testing has been done on the new build"); zips over Teams, not OneDrive | Fix programme began; the owner started MOD-01's card for the three P1 tool risks (NB-01, separate worktree) | #3 (MOD-01); #4-#6 (NB-01) | MOD-01, NB-01 |
| 19-Oct | (no new owner message; the authorised fix programme continued) | Tool hardening packages A-E, page fixes, Sep-2026 Run 2 data corrections, docs checked claim by claim (about 300 claims, 60 corrections), export prompt, C19 parser fix; PR #18 drafted and held for the owner. MOD-01's uncommitted work overlapped NB-01's merged fixes and had to be merged by hand (lesson: fetch first). First MOD-01 context compaction 06:28Z | #7-#17 | MOD-01 |
| 21-Oct 05:51 | "Publish PR #18 now. Keep the 12 blank-cell debt values as they are (existing rule) and keep the JioBlackRock G-Sec fund held until C20 is decided." | PR #18 merged (D81). The owner started MOD-01's card for five P3 follow-ups (NB-02, separate worktree) | #18; #19-#23 (NB-02) | MOD-01, NB-02 |
| 21-Oct 13:20 | "Give me the final link for the portfolio dashboard and the prompt for data extraction ... Proposal dashboard is replicated fully?" | Link given; export prompt re-sent with two new questions; live acceptance check of the new site, 7 areas PASS; C24-C27 logged. MOD-01 asked whether "portfolio dashboard" meant the sister project: no reply (DEC-OPEN-28) | #24, #25 | MOD-01 |
| 22-Oct 14:10 | PowerPoint specification "Fix and Standardise the Investment Proposal PowerPoint Output" with two decks attached | The owner chose "New session" (14:30) -> NB-03. Montage and sample deck sent 15:36:08/15:36:10; owner's go-ahead 15:36:58; merged 15:37:21 (D82, D83) | #26, #27 | NB-03 |
| 23-Oct 13:03 and 20:30 | "Previous owner has shared some files, how do you want me to share?"; "Files are saved in the folder" | Export placed in `handover-archive/export_20261023/` (local, git-ignored) | - | MOD-01 |
| 24-27-Oct | - | Export ingested: 2,720 files verified, 32 desk files filed into `monthly-updates/`, no unpublished deploy work found; findings B8, B9, C35-C40, A28, R8 opened, B3 closed. 25-Oct: `git checkout` failed with "mmap failed" and truncated tracked files (restored, nothing lost; R6) | #28 (27-Oct 12:27) | MOD-01 |
| 27-Oct 11:41 | "Share the link to the proposal dashboard" | Link given 12:28. Second MOD-01 compaction 12:24Z. At 12:28 MOD-01 asked "Should I rebuild the risk-ratio and NAV workbook tools in-house?" (B8): **unanswered** (DEC-OPEN-01) | - | MOD-01 |
| 27-Oct 15:25 | Handover master prompt "Project handover, multi-chat orchestration, codebase integrity and automatic context recovery": stop all implementation, build a verified handover package, move to a Moderator (MOD-02) / Guardian (ARC-01) model | First attempt stopped at 15:31; MOD-01's main transcript ends 28-Oct 05:30 with an authentication failure | - | MOD-01 |
| 28-Oct 05:33 | The same prompt pasted again (byte-identical) | Read-only fact sheets, app startup check (about 08:55), this package (TASK-015) | handover branch | MOD-01 |

### 2.2 PR batches (all 28 MERGED; 0 open; 0 reverts; 58 of 58 CI runs green)

| Batch | PRs | Track | Content | Site / data effect |
|---|---|---|---|---|
| Stage A, 16-Oct | #1, #2 | EX | Reorganise into `site/`, `tools/`, `docs/`; Actions publish behind a parity gate; baseline docs; record first publish | `site/` bytes identical to the baseline (S0) |
| P1 fixes, 16-Oct | #3 (MOD-01), #4-#6 (NB-01) | NB | blocklib atomic writes, `verify_page` exit 1, unit tests, rehearsal harness; A1 Bond List sheet/desk, A3 look-through date, A4 Reckoner drop gates | tools only |
| Fix programme, 19-Oct | #7-#11, #14, #15 | NB | Tool hardening packages A-E, exact-inception rollback, strict CLI (D72-D76, D79) | tools only |
| Page fixes, 19-Oct | #12 | NB | True workbook dates, risk dagger, shared-link banner, SRI, noindex, favicon; legacy risk-matrix file archived (D77, D78) | S1 |
| Sep data, 19-21-Oct | #13, #17, #18 | OPS / NB | Run 2 (inception +1 day, 33 risk flags); C19 parser code (D80); Run 3 (214 funds to 30-Sep figures, G-Sec record held, D81) | S2, S3, S4 |
| Docs, 19-21-Oct | #16, #24, #25 | GOV / EX | Docs brought in line with code; export prompt and two additions; 21-Oct acceptance record | none |
| Follow-ups, 21-Oct | #19-#23 (NB-02) | NB | Exit 2 on a missing input, OneDrive rename retry, C17, C18, A27 `rehearse.js --old-site` | S5, S6 |
| PowerPoint, 22-Oct | #26, #27 (NB-03) | NB | Measured design system, continuation slides, page numbers, `*` on expected returns (D82, D83); release record | S7 |
| Export, 27-Oct | #28 | EX / GOV | Ingestion of the outgoing owner's export | none (docs only) |

Only #18 and #26 waited for the owner's explicit approval; the rest merged on green CI. No PR reviews are
recorded on GitHub (approvals were given in chat). Per-PR detail: [`../project-control/INTEGRATION_AND_REGRESSION_LOG.md`](../project-control/INTEGRATION_AND_REGRESSION_LOG.md).

---

## 3. Repositories, branches and hosting (VERIFIED 28-Oct-2026 unless marked)

Full detail: [`../project-control/REPOSITORY_AND_ENVIRONMENT_STATE.md`](../project-control/REPOSITORY_AND_ENVIRONMENT_STATE.md).

### 3.1 Baseline chain

| Step | Commit | Meaning |
|---|---|---|
| Upstream tip | `72e1f1e` (14-Oct-2026) | The outgoing owner's last commit; the old site is still built from it |
| Handover baseline | tag `handover-baseline` (annotated, tag object `4e4cfbf`) -> `862e40b` | Sanitised equivalent of `72e1f1e`: trees differ only in the 8-line client-name redaction of `Portfolio_Review_Build_Prompt.md` (D64); 74 commits each. CLAUDE.md's "= upstream `72e1f1e`" means "equivalent of" |
| Transfer baseline | `25e71a3` (PR #1, 16-Oct-2026 07:15) | Repo reorganised; `site/` byte-identical to `862e40b`; first publish run 38866042211. `bf20c08` (PR #2) records it |
| Last site-changing merge | `5d39821` (PR #26, 22-Oct-2026) | Site state S7; `site/` unchanged through `5bcce88` (#27) and `2b2a397` (#28) |
| Current main | `2b2a397` (PR #28, 27-Oct-2026 12:27) | = `origin/main` = live; code and data baseline of this package |

### 3.2 Site-content states

| State | Merges | What changed in `site/` |
|---|---|---|
| S0 | `862e40b` -> `25e71a3` (#1) ... `d260cdf` (#11) | baseline bytes (still served by the old site) |
| S1 | `792692d` (#12) | true dates, risk dagger, shared-link banner, SRI, noindex, favicon; legacy risk-matrix file archived |
| S2 | `10cb44c` (#13) ... `6dc08ef` (#16) | Sep Run 2 data |
| S3 | `8e187ae` (#17) | C19 parser code |
| S4 | `f37fa01` (#18) ... `0cb7e95` (#20) | Sep Run 3 data (214 funds) |
| S5 | `75538de` (#21) | C17 matrix footnote |
| S6 | `fb9cbd6` (#22) ... `83f777c` (#25) | Select popover dagger (C18); last full browser acceptance (21-Oct) |
| S7 | `5d39821` (#26) -> `5bcce88` (#27) -> `2b2a397` (#28) | PowerPoint design system (D82) and `*` marker (D83); current |

### 3.3 Remotes, branches, worktrees, stash

| Item | State |
|---|---|
| Remotes | `origin` = productsteamcentricity (fetch and push); `upstream` = outgoing owner's repo, push URL `DISABLED-read-only-reference`. `gh repo set-default` = origin (without it `gh pr` targets upstream) |
| Current branch | `main` at `2b2a397`, 0 ahead / 0 behind `origin/main` |
| Working tree | Clean when the fact sheets ran. While this package was written, `CLAUDE.md` and `docs/README.md` carried MOD-01's uncommitted package edits (TASK-015); the package files themselves are committed only through the handover branch |
| Local branches | 26 besides `main`, all merged into `main` (24 PR branches + 2 local-only session branches `claude/adoring-boyd-7028f6`, `claude/focused-wright-d50bee`) |
| Branches on origin | `main` + 25 merged feature branches (PRs #4-#28); `delete_branch_on_merge` is false and `--delete-branch` was used only for PRs #1-#3 (KNOWN_ISSUES E12). `upstream/main` is the only unmerged ref (pre-sanitisation history: **never push it**, R1, R8) |
| Worktrees | 3 besides the main checkout, all clean, on merged commits, no unique work: `.claude/worktrees/adoring-boyd-7028f6` (`fix/a27-rehearse-old-site` `18abff3`, NB-02's), `.claude/worktrees/focused-wright-d50bee` (`fix/reckoner-drop-gates` `fe060d5`, NB-01's), `%USERPROFILE%\AppData\Local\Temp\cpp-old` (detached `bf20c08`, made 16-Oct for the PR #3 rehearsal). Plus 2 stale admin folders `.git/worktrees/cpp-main`, `wtdocs` (prunable) |
| Stash | `stash@{0}` = `6cb0624` (19-Oct-2026), 23 tracked + 3 untracked files; per file 8 identical to main, 18 superseded, 0 unique work; **applying it would revert Sep-2026 page data**. The patch exports with `git stash show -p --include-untracked stash@{0}` (worked 28-Oct). Drop only after export to `backups/` and owner agreement (TASK-062) |
| Tracked files | 102. No `.xlsx/.pptx/.zip/.pdf` tracked; `monthly-updates/`, `backups/`, `handover-archive/` hold only README files in git |
| Local-only folders | `monthly-updates/` (7 month folders Mar-Sep 2026, 130 files, about 446 MB; `00_INBOX/` holds only its README: no desk file has arrived; no `2026-10_*` folder); `backups/` (two 19-Oct snapshots); `handover-archive/` (zips + 23-Oct export, about 5.6 GB); `_testdata/pptx-design-system/` (deck renders) |

### 3.4 Hosting, CI and settings

| Item | State |
|---|---|
| CI | `.github/workflows/pages.yml` "Verify and publish dashboard": on every PR, push to `main` and manual run. `verify` = six deploy files present + `npm ci` + unit tests + `verify_page` gates (no missing sibling, 0 duplicates, ends `</html>`, 0 script errors, Select keys in MASTER = total). `publish` = upload `site/` from `main` only |
| CI history | 58 runs, 58 success (30 pull_request, 28 push); last run 40503943213 (push of `2b2a397`, 27-Oct-2026 12:27:52Z), deployment 7358413557 |
| Pages | `build_type: workflow`, HTTPS enforced; environment `github-pages` deploys from `main` only |
| Protection | `main` **not protected**, 0 rulesets: "merge only after verify" is a convention (R9; DEC-OPEN-17). Any merge publishes within minutes |
| Secrets | 0 Actions secrets; `gh` logged in as `productsteamcentricity` (token not recorded anywhere) |
| Toolchain | Node v24.21.0, npm 11.19.0, git 2.56.0.windows.2, gh 2.102.0, Python 3.14.4, Windows PowerShell 5.1; `xlsx` 0.18.5 (Node and page); CDN React/ReactDOM 18.3.1, Chart.js 4.4.0, pptxgenjs 3.12.0, all with SRI. Never upgrade without the owner (CLAUDE.md) |
| OneDrive (R6, EXISTING DEFECT) | OneDrive.exe **not running**; the repo folder is not set to "Always keep on this device"; 229 of 519 `.git` files are cloud-only (8 in `objects/pack`). Current-tree reads and `git fsck --connectivity-only` work; 87 historical blobs and the stash blobs fail with `fatal: mmap failed: Invalid argument`. **Never `git checkout` / `git switch` in this folder** (25-Oct incident). Fix = TASK-017 (owner action) |

---

## 4. Workstreams and their status

Detail: Workstream A in [`EXISTING_DASHBOARD_HANDOVER_2026-10-28_v1.md`](EXISTING_DASHBOARD_HANDOVER_2026-10-28_v1.md);
Workstream B and OPS in [`NEW_BUILD_HANDOVER_2026-10-28_v1.md`](NEW_BUILD_HANDOVER_2026-10-28_v1.md);
every task in [`../project-control/TASK_REGISTER.md`](../project-control/TASK_REGISTER.md).

### 4.1 EX - Workstream A, existing dashboard

| Item | Status | Evidence / IDs |
|---|---|---|
| Baseline replicated: `site/` byte-identical to the outgoing owner's `72e1f1e` (via `862e40b`), verify_page counts equal the PRD, browser parity, 25 tool dry-runs identical | VERIFIED COMPLETE | TASK-001; REQ-004, REQ-016, REQ-019; `docs/REPLICATION_REPORT.md` |
| GitHub transfer with sanitised history; Pages behind a parity gate | VERIFIED COMPLETE | REQ-021, REQ-037, REQ-043; D60, D63, D64 |
| Data-extraction prompt; export received 23-Oct and ingested | VERIFIED COMPLETE (follow-ups open) | TASK-008, TASK-014; PR #28; B8, B9, R8 |
| Live acceptance of the new site, 7 areas | VERIFIED COMPLETE on S6 (21-Oct); on current S7 IMPLEMENTED NOT FULLY VERIFIED (after PR #26 only a live 4-fund deck export was re-checked) | TASK-012; TASK-064 (PLANNED) |
| App startup on the current build | VERIFIED 28-Oct (section 5) | `REPOSITORY_AND_ENVIRONMENT_STATE.md` section 13.4 |
| Excel export opened in Excel / Office | NOT STARTED (never done since the transfer) | REQ-019 note; part of TASK-064 |
| Upstream history purge, old-site notice, GitHub cache (R1) | BLOCKED (outgoing owner acts; owner relays) | TASK-033; DEC-OPEN-13 |
| Two client items in the export (R8) | BLOCKED (owner + compliance) | TASK-032; DEC-OPEN-05 |
| Old-site retirement "after full testing has been done on the new build" | PLANNED (owner decides after full testing; "full testing" is not defined; the condition is recorded in no repo doc) | REQ-049; TASK-034, TASK-074; DEC-OPEN-14, DEC-OPEN-24; R7 |
| Outgoing owner's offered claude.ai export and their history summary | BLOCKED (owner decides whether to ask) | TASK-073; DEC-OPEN-26 |

What remains in A: **not replication** (that is complete) but **transfer completion** (R1, R8, the
outgoing owner's material) and **old-site retirement readiness** (a full acceptance pass on S7 and an
owner-signed checklist).

### 4.2 NB - Workstream B, new build

| Item | Status | Evidence / IDs |
|---|---|---|
| Fix programme: PRs #3-#12, #14, #15, #17, #19-#23 (tools, page fixes, C19 parser; #13 is OPS data, section 4.3) | VERIFIED COMPLETE (merged, CI green, published) | TASK-002..TASK-005, TASK-009, TASK-011 |
| PowerPoint design system (D82, D83) | IMPLEMENTED NOT FULLY VERIFIED: merged, published, live 7/7; 118 of 153 spec items VERIFIED COMPLETE, 34 IMPLEMENTED NOT FULLY VERIFIED, 1 BLOCKED | TASK-013; REQ-057; REQ-PPT-01..153 |
| "Start fixing all the issues" | IN PROGRESS: 43 KNOWN_ISSUES rows open at `2b2a397`, most waiting for owner or desk decisions | REQ-045 |
| B8 producer of the NAV and risk-ratio workbooks | BLOCKED (DEC-OPEN-01/02/03) | TASK-022 |
| One rule for the headline expected return (C24) | BLOCKED (DEC-OPEN-15) | TASK-026 |
| Since-inception outlier gate (C43, P1) | NOT STARTED | TASK-067 |
| Other engineering items (A7, A19, A20, A23, A30, A31, C25, C29-C32, C41, C42, C44, C45, ...) | NOT STARTED or BLOCKED; backlog work only on request (`docs/PROJECT_STATE.md`) | TASK-039..TASK-069 |

### 4.3 OPS - monthly data operations

| Item | Status | Evidence / IDs |
|---|---|---|
| Sep-2026 Run 2 (#13) and Run 3 (#18) corrections | VERIFIED COMPLETE | TASK-006, TASK-010 |
| D61 auto-publish of a monthly refresh | IMPLEMENTED NOT FULLY VERIFIED: never exercised (no new-month refresh yet on the new build) | REQ-044 |
| Sep-2026 Reckoner catch-up ("October 2026" deck, PMS, Fund Manager, PMS/AIF Analytics) | BLOCKED: inbox empty (DESK-01..DESK-04); due now | TASK-020 |
| Oct-2026 MF cycle (data 31-Oct-2026), about 13-17-Nov-2026 | PLANNED; needs DEC-OPEN-08 before the rename `--apply`; the Portfolio Matrix stays "30 Sep 2026" unless TASK-022 is ready | TASK-021, TASK-024 |
| Oct-2026 Reckoner cycle, about 20-28-Nov-2026 | PLANNED | - |
| Desk request pack DESK-01..DESK-23 | UNKNOWN / NEEDS INVESTIGATION (no record it was sent; only the owner contacts the desk) | TASK-019 |
| OneDrive health before git and tool runs | NOT STARTED (owner's machine setting) | TASK-017 |

### 4.4 GOV - governance and continuity

| Item | Status | IDs |
|---|---|---|
| This handover package | IN PROGRESS until the handover branch is merged | TASK-015; REQ-063..REQ-095 |
| MOD-02 validates the package | PLANNED | TASK-016 |
| Docs-consistency PR (E6-E15, KNOWN_ISSUES corrections) | NOT STARTED | TASK-018 |
| Move memory-only procedures into the repo; inventory local-only artefacts | PLANNED / NOT STARTED | TASK-071, TASK-070 |
| Record conversation-only owner decisions as D84+ | PLANNED | TASK-074 |
| Repository hygiene (branches, worktrees, stash), branch protection | NOT STARTED / BLOCKED (owner) | TASK-059..TASK-062; TASK-036; DEC-OPEN-17, DEC-OPEN-22 |

---

## 5. Current verified state (28-Oct-2026)

| Check | Command | Result | Label |
|---|---|---|---|
| Repo head | `git rev-parse HEAD origin/main`; `git status --porcelain=v1 -b` | `2b2a397` both; in sync; tree clean before the package | VERIFIED |
| Parity counts | `node tools/verify_page.js site` (exit 0) | MASTER effective 7,682; CENTRICITY_SELECT 178 (178 in MASTER; rationale 133, risk ratios 46, details 51); PMS_PERFORMANCE pms 692 / aif 12 / benchmark 4; PMS_PERF_ALIAS 27 (4 null pins); EQUITY_ANALYTICS 1,205; RISK_MATRIX 1,088; PMS_AIF_TERMS 73; EXTRA_SLIDES 6; DATA_DATES performance / analytics / sif "30th September 2026", pms "31st August 2026", riskMatrix "30 Sep 2026"; 0 duplicate MASTER names; ends `</html>`; MASTER PMS with perf 23 of 27; 0 script errors. Equals the CLAUDE.md headline | VERIFIED (run by four investigators and the critic) |
| Unit tests | `npm test` (exit 0) | 5 of 5 files, 903 checks, 0 failures: blocklib 34, dates 10, parser_refresh_only 18, pptx_layout 798, tool_inputs 43 | VERIFIED |
| Live parity | `curl --compressed` of each live file + `sha256sum` vs `site/` | 7 of 7 identical (index.html `916f2455eebaf2362e60a97314203e8ffc52955892cfa04a5c5248301ac62ce3`, 12,864,963 B); legacy `Centricity_Risk_Matrix.js` 404 (D78) | VERIFIED |
| Old site | `curl -I`; hash of `index.html` | HTTP 200; serves S0 (SHA-256 `5872958ddacd728b...`, 12,827,311 B, Last-Modified 14-Oct-2026) | VERIFIED |
| App startup | `preview_start playbook` (`node .claude/serve.js`, http://127.0.0.1:8080/) in the desktop app's browser, about 08:55 UTC | Title "Centricity Investment Proposal Dashboard"; React root rendered; in-browser MASTER 7,682; `window.H`, `window.REFRESH`, `window.EXPORTS` present; all three sibling flags set; 0 console errors | VERIFIED (by MOD-01) |
| Proposal build and exports in a browser | - | **Not done on 28-Oct.** Last full 7-area acceptance: 21-Oct on S6. After PR #26: one live 4-fund export (22-Oct, 23 slides, no layout warning) | IMPLEMENTED NOT FULLY VERIFIED |
| PowerPoint bounds | `node tools/dev/check_pptx_bounds.js` on the 22-Oct COM outputs in `%TEMP%\x\` (re-run by the critic) | 8 of 8 files "no problem found"; `site/` unchanged since, so they still describe the current code | VERIFIED for the 22-Oct renders; no render since |
| Invariants (CLAUDE.md rule 9) | vm probes | All four hold: 0 duplicates; Select 178/178; top-10 Direct Equity by market cap are Large Cap; `DATA_DATES.sif` set. Only the first two are enforced by `verify_page` / CI (A31) | VERIFIED |
| CI | `gh run list --limit 200` | 58 of 58 success; last 40503943213 on `2b2a397` | VERIFIED |
| Open PRs / issues | `gh pr list`; `gh issue list` | 0 / 0 | VERIFIED |
| KNOWN_ISSUES at `2b2a397` | parse of the summary table | 93 rows: Open 43, Partly fixed 12, Fixed 1 (C19), Accepted 4, Closed 33; open P1 = B8, C20, R1, R8. The package adds 22 entries (A29-A31, C41-C45, E6-E16, R9-R11; C43 is P1) and dated corrections | VERIFIED |
| Data as on (page labels) | `verify_page` | performance and analytics 30-Sep-2026; SIF 30-Sep-2026 (set by the SIF sibling); risk matrix 30-Sep-2026; PMS label "31st August 2026" over 31-Jul-2026 content (B1) | VERIFIED (labels); PMS content INFERRED from the doc |
| Data as on (other) | CLAUDE.md, PROJECT_STATE | AIF performance and Centricity Select 31-Aug-2026; PMS/AIF look-through 31-Jul-2026; fund managers = 30-Sep Monitor's first-named manager only (C15); JioBlackRock G-Sec record held (C16, C20) | INFERRED (documents, not re-derived) |

Production regression caused by a new-build PR: none found (0 reverts; every live check after a site
change matched).

---

## 6. Requirements summary

Authoritative register: [`../project-control/REQUIREMENTS_AND_CHANGE_REGISTER.md`](../project-control/REQUIREMENTS_AND_CHANGE_REGISTER.md).

| Set | VERIFIED COMPLETE | IMPLEMENTED NOT FULLY VERIFIED | IN PROGRESS | PLANNED | BLOCKED | Total |
|---|---|---|---|---|---|---|
| REQ-001..REQ-095 (owner requirements, 15-Oct to 28-Oct) | 49 | 10 | 35 | 1 | 0 | 95 |
| REQ-PPT-01..REQ-PPT-153 (22-Oct PowerPoint spec, NB) | 118 | 34 | 0 | 0 | 1 | 153 |

By workstream (REQ-nnn): GOV 58, EX 25, NB 8, OPS 4.

### 6.1 REQ-nnn not yet VERIFIED COMPLETE (46)

| ID | Short title | WS | Status |
|---|---|---|---|
| REQ-006 | Stage B: owner's improvements through a systematic workflow | NB | IN PROGRESS (paused by REQ-063) |
| REQ-010 | Never fabricate completion (PR #10's body still overclaims two flags) | GOV | IMPLEMENTED NOT FULLY VERIFIED |
| REQ-011 | Inspect all supplied materials (export history summary not reconciled) | EX | IMPLEMENTED NOT FULLY VERIFIED |
| REQ-023 | Never force-push or rewrite history (a negative cannot be proven) | GOV | IMPLEMENTED NOT FULLY VERIFIED |
| REQ-025 | Maintainable architecture after the baseline (C1, A7, C29 open) | NB | IMPLEMENTED NOT FULLY VERIFIED |
| REQ-028 | Keep state docs current in the same change (drift E8, E13) | GOV | IMPLEMENTED NOT FULLY VERIFIED |
| REQ-030 | Orchestration rules; no overlapping write access (NB-03 shared the main checkout) | GOV | IMPLEMENTED NOT FULLY VERIFIED |
| REQ-032 | Change control; prioritised backlog (by severity, not the owner's four categories) | GOV | IMPLEMENTED NOT FULLY VERIFIED |
| REQ-034 | Transferable project; clean setup reproducible (no fresh-clone test, TASK-072) | GOV | IMPLEMENTED NOT FULLY VERIFIED |
| REQ-044 | Monthly updates publish automatically when checks pass (never exercised) | OPS | IMPLEMENTED NOT FULLY VERIFIED |
| REQ-045 | Start fixing all identified issues | NB | IN PROGRESS |
| REQ-049 | Old dashboard deleted only after full testing of the new build | EX | PLANNED |
| REQ-057 | Fix and standardise the PowerPoint output (REQ-PPT) | NB | IMPLEMENTED NOT FULLY VERIFIED |
| REQ-063 | Stop all implementation; only the handover package | GOV | IN PROGRESS |
| REQ-064 | Capture project, repos, replication and build status | GOV | IN PROGRESS |
| REQ-065 | Capture every suggested improvement with status | GOV | IN PROGRESS |
| REQ-066 | Capture uncommitted code, branches, worktrees, tasks | GOV | IN PROGRESS |
| REQ-067 | Capture architecture, interfaces, defects, decisions | GOV | IN PROGRESS |
| REQ-068 | Operating principles (evidence, no destructive operations, labels) | GOV | IN PROGRESS |
| REQ-069 | Investigate all materials | GOV | IN PROGRESS |
| REQ-070 | Nine status definitions used consistently | GOV | IN PROGRESS |
| REQ-071 | Workstream A first, then B; required sequence | GOV | IN PROGRESS |
| REQ-072 | MOD-02 = Master Project Moderator | GOV | IN PROGRESS |
| REQ-073 | ARC-01 Codebase Integrity & Integration Guardian | GOV | IN PROGRESS |
| REQ-074 | Isolated development: worktrees or single writer | GOV | IN PROGRESS |
| REQ-075 | File-ownership and active-change registers | GOV | IN PROGRESS |
| REQ-076 | Change-impact contract before material work | GOV | IN PROGRESS |
| REQ-077 | INTERFACE_CONTRACTS.md | GOV | IN PROGRESS |
| REQ-078 | Integration gates A-E; integration log; recovery | GOV | IN PROGRESS |
| REQ-079 | Controlled successor handover in 12 steps | GOV | IN PROGRESS |
| REQ-080 | Context-transfer triggers | GOV | IN PROGRESS |
| REQ-081 | Successor scenarios (sub-chat; Moderator) | GOV | IN PROGRESS |
| REQ-082 | Continuation-branch procedure and names | GOV | IN PROGRESS |
| REQ-083 | Preserve uncommitted work (cases A-D) | GOV | IN PROGRESS |
| REQ-084 | Verify the continuation branch; push; verify remote SHA | GOV | IN PROGRESS |
| REQ-085 | Copy-ready successor prompt file | GOV | IN PROGRESS |
| REQ-086 | Owner's handover message (10 items) | GOV | IN PROGRESS |
| REQ-087 | CHAT_REGISTRY.md with name format and statuses | GOV | IN PROGRESS |
| REQ-088 | Task and change registers with stable IDs | GOV | IN PROGRESS |
| REQ-089 | Document structure under docs/handover and docs/project-control | GOV | IN PROGRESS |
| REQ-090 | Dated, versioned handovers; index names the authoritative one | GOV | IN PROGRESS |
| REQ-091 | Moderator's 12-step process for each new requirement | GOV | IN PROGRESS |
| REQ-092 | Plain-language decision escalation | GOV | IN PROGRESS |
| REQ-093 | Safety rules for handovers | GOV | IN PROGRESS |
| REQ-094 | Completeness and consistency check of the package | GOV | IN PROGRESS |
| REQ-095 | Final report; commit and push the docs; next steps; stop | GOV | IN PROGRESS |

REQ-063..REQ-095 are the 27-Oct handover prompt. They are delivered by this package; MOD-02 sets each
to VERIFIED COMPLETE (or records the gap) when TASK-016 has checked the merged package against the repo.

### 6.2 REQ-PPT not yet VERIFIED COMPLETE (35)

BLOCKED (1): REQ-PPT-93 Disclaimer slide layout (C34, B7; DEC-OPEN-21; TASK-038).

IMPLEMENTED NOT FULLY VERIFIED (34):

| ID | Short title | ID | Short title |
|---|---|---|---|
| REQ-PPT-02 | Client-ready layout per section | REQ-PPT-108 | Helper: charts (options object, no helper) |
| REQ-PPT-04 | Space used intelligently | REQ-PPT-109 | Helper: cards and multi-panel summaries |
| REQ-PPT-07 | Financial values and functionality preserved | REQ-PPT-116 | No values copied from the reference deck |
| REQ-PPT-11 | Render both decks; compare slide types | REQ-PPT-120 | Never silently remove content (C45 latent) |
| REQ-PPT-40 | Balanced use of the slide | REQ-PPT-123 | Totals and chart data reconcile |
| REQ-PPT-47 | Category and instrument names readable | REQ-PPT-124 | Data-driven, no fixed positions (C44) |
| REQ-PPT-48 | No excessive whitespace inside charts | REQ-PPT-126 | Reproduce current output before changing code |
| REQ-PPT-52 | Chart figures unchanged | REQ-PPT-127 | Staged fixes incl. remaining templates (DEC-OPEN-23) |
| REQ-PPT-62 | Density-based layout variants | REQ-PPT-128 | Regenerate via the real workflow; render; inspect |
| REQ-PPT-67 | Separate unavailable / not applicable / mapping defect | REQ-PPT-129 | Bounds and rendering tests (manual, not in CI) |
| REQ-PPT-69 | Zero vs missing vs not applicable distinct | REQ-PPT-130 | Data validation of the deck against source |
| REQ-PPT-71 | Wholly unavailable column handled | REQ-PPT-137 | Final summary |
| REQ-PPT-76 | Balance the AMC and Liquidity panels | REQ-PPT-143 | Done: all required content retained |
| REQ-PPT-78 | Chart margins and plot areas | REQ-PPT-144 | Done: figures faithful to proposal data |
| REQ-PPT-79 | Long AMC and instrument names | REQ-PPT-146 | Done: charts legible, no label overlap |
| REQ-PPT-82 | No whitespace from oversized charts | REQ-PPT-148 | Done: tables use their space well |
| REQ-PPT-151 | Done: every slide rendered and inspected | REQ-PPT-152 | Done: no clipping, overlap or overflow |

---

## 7. Architecture in brief

Overview: [`../ARCHITECTURE.md`](../ARCHITECTURE.md). Dependency and blast-radius view:
[`../project-control/ARCHITECTURE_AND_DEPENDENCY_MAP.md`](../project-control/ARCHITECTURE_AND_DEPENDENCY_MAP.md).
Data shapes, page APIs, tool CLI and `verify_page` contracts:
[`../project-control/INTERFACE_CONTRACTS.md`](../project-control/INTERFACE_CONTRACTS.md).

- **The page.** `site/index.html` is 12,864,963 bytes, 9,574 lines, 24 script tags (5 CDN, 2 sibling
  scripts in the head, 3 at the top of the body, 14 inline), ending `</body></html>`. Never Read it
  whole: Grep with `-n`/`-o` or Node `fs`. Line numbers drift; give a grep pattern with any `~Lnnnn`.
- **Data blocks** (`MASTER` 7,672 baseline records on one 2.86 MB line, analytics, `CENTRICITY_SELECT`,
  `PMS_PERFORMANCE`, `RISK_MATRIX`, `DATA_DATES` ...) change only through `tools/lib/blocklib.js`.
- **Page APIs** used by the UI, the exports and the tools: `window.H` (69 keys: formatters, predicates,
  aggregations), `window.REFRESH` (the in-page parsers; three tools run them in a Node vm, so a page
  parser edit changes the next bake), `window.EXPORTS` (Excel via SheetJS 0.18.5, PowerPoint via
  PptxGenJS 3.12.0 with the D82 measured design system).
- **Siblings 3-5** load after the main blocks in the order June -> IRR/Offshore -> SIF and re-apply on
  every load (GIFT City records, IRR bands, offshore funds, the 30 SIFs, 12 PMS/AIF look-throughs,
  `DATA_DATES.sif`). Baseline MASTER 7,672 becomes 7,682 effective. Data a sibling owns must be changed
  in the sibling. A broken sibling only logs `console.error`, which `verify_page` does not count (A30).
- **No server and no storage:** no `fetch`, `localStorage` or `sessionStorage`; a user's work lives in
  memory and in the `#p=` share hash.
- **Tools:** Node, dry-run by default, `--apply` to write; one exit contract (0 ok, 1 gate failed,
  2 usage or input error, D72); atomic writes; three tools need `--html site/index.html`.
- **Highest-risk areas** (ranked in the dependency map): the six-file deploy and siblings; `MASTER` and
  the bake path; the `REFRESH` parsers; the exports; `window.H` predicates; `blocklib.js`; name-join
  tables (`tools/data/pins.json`, `PMS_PERF_ALIAS`); the CI workflow; the OneDrive location; the static
  `PMS_BENCHMARK_PERF` literal (C41).

---

## 8. Decisions

Approved decisions: [`../DECISIONS.md`](../DECISIONS.md) (authoritative). Open decisions with plain-language
explanations: [`../project-control/DECISION_LOG.md`](../project-control/DECISION_LOG.md).

### 8.1 Approved decisions MOD-02 must know

| D | Decision (short) | Why it matters |
|---|---|---|
| D1 | A deploy is six files in a fixed load order | CLAUDE.md rule 1; CI checks the six files |
| D2 (Open) | Fold siblings 3-5 into `index.html` | = C1, TASK-045; never inside a data refresh |
| D37 | No fabricated fallbacks; exclude no-holdings funds | CLAUDE.md rule 6 |
| D42 (amended D72) | Bake with the page's own parsers; dry-run by default | a page parser edit changes the next bake |
| D43 (premise reopened) | Node route into `RISK_MATRIX` | B8 / DEC-OPEN-01 |
| D46 (amended D73, D79) | Rename before every bake | CLAUDE.md rule 7; DEC-OPEN-08 |
| D58 (Open) | Risk-free rate 4.5% pending the desk | = C11, DEC-OPEN-02 |
| D60 | Public repo on free GitHub Pages (owner, 16-Oct) | no client data anywhere in the repo |
| D61 | Monthly updates publish automatically once every check passes (owner, 16-Oct) | the stop list still applies; corrections are not covered |
| D62-D68 | Repo layout; Actions build from `site/` behind a parity gate; sanitised history; the workspace is the repo; preview server on 127.0.0.1; pinned `xlsx`; branch -> PR -> verify -> merge | the operating frame |
| D70-D80 | Tool contracts and data rules (analytics date, Select drop gates, exit codes, calendar-day dates, `fl` flags, `pins.json`, Reckoner drop gate, SRI, archived risk file, `prev_names`, refresh-only sheets) | read the gates every run |
| D81 | Publish the C19 re-run; keep blank-cell values; hold the C20 G-Sec record (owner, 21-Oct) | DEC-OPEN-07 |
| D82 | Every native slide laid out by one measured design system (owner, 22-Oct) | CLAUDE.md rule 10; C44, C45 are exceptions |
| D83 | Expected 1Y/3Y/5Y figures marked `*` in the deck (owner, 22-Oct) | C28; DEC-OPEN-16 |

Owner decisions made only in conversation and recorded in no repo document (TASK-074 records them as
D84+ with the owner's wording): Stage A before Stage B (15-Oct); the fix programme (16-Oct); the export
prompt's constraints (16-Oct); **retire the old dashboard only after full testing of the new build
(16-Oct)**; starting NB-01, NB-02 and NB-03; the 22-Oct go-ahead also accepting the `*` wording
(INFERRED); the export's drop folder (INFERRED); the 27-Oct move to the Moderator/Guardian model.

### 8.2 Open owner decisions (all BLOCKED on the decider)

| ID | Decision needed | Decider |
|---|---|---|
| DEC-OPEN-01 | Who makes NAV Data (#17) and Fund Risk Ratios (#12) from October: port the outgoing owner's toolchain to Node, validate the Python tool, or the desk. MOD-01's unanswered 27-Oct question. Deadline about 13-Nov-2026 | owner |
| DEC-OPEN-02 | Risk-free rate for the risk ratios (4.5% unconfirmed) | owner + desk |
| DEC-OPEN-03 | Which Sortino definition | owner + desk |
| DEC-OPEN-04 | PMS label "31st August 2026" over 31-Jul data: relabel now or wait for desk files | owner |
| DEC-OPEN-05 | The two client items in the export (and the R1 repo zip): keep under control or delete (the owner's own act) | owner + compliance |
| DEC-OPEN-06 | File the true 30-Apr Monitor as April | owner |
| DEC-OPEN-07 | 13 JioBlackRock Regular records: clear returns older than the fund or keep them labelled; same family: very young funds' since-inception values (C43) | owner |
| DEC-OPEN-08 | Confirm or reject each of the 8 scheme renames before the Oct-2026 rename `--apply` (about 13-Nov-2026) | owner |
| DEC-OPEN-09 | Bond 3Y/5Y: top of the IRR band (today) or the band average | owner |
| DEC-OPEN-10 | Drop the 4 segregated side-pocket records and widen the parser skip | owner |
| DEC-OPEN-11 | Deck labels and AMCs (C4, C5, C6, C38) | owner + desk |
| DEC-OPEN-12 | Select popover alpha unit and the undated May-2026 ratios | owner + desk |
| DEC-OPEN-13 | Ask the outgoing owner to make private / delete / purge the upstream repo, retire the old site, ask GitHub Support to clear cached views; whether to notify anyone | owner (+ compliance) |
| DEC-OPEN-14 | When and how the old site is retired (notice or redirect; users told the new URL) | owner (+ outgoing owner) |
| DEC-OPEN-15 | One rule for the headline expected return across the five places that compute it | owner (+ desk IRR file) |
| DEC-OPEN-16 | How the data records expected returns; the 14 stale AIF mid-points; the Alchemy 1Y | owner + desk |
| DEC-OPEN-17 | Branch protection on `main` (require `verify`) | owner |
| DEC-OPEN-18 | Keep the repo and site public long-term | owner |
| DEC-OPEN-19 | Keep the git clone in OneDrive or move it out (keeping `monthly-updates/` there) | owner |
| DEC-OPEN-20 | Reclassify the 2 Hang Seng ETFs; the 27 records' ageing debt stats | owner |
| DEC-OPEN-21 | Which closing-slides source deck to file; re-lay the Disclaimer slide | owner + desk |
| DEC-OPEN-22 | Repository hygiene (branches, worktrees, stash) and the rule for merged branches | owner |
| DEC-OPEN-23 | Whether fund-specific pages like the reference deck's are wanted | owner |
| DEC-OPEN-24 | What "full testing" of the new build means (the checklist the owner signs before retirement) | owner |
| DEC-OPEN-25 | One Moderator for both projects or one per project (recommended: one per project) | owner |
| DEC-OPEN-26 | Request the outgoing owner's offered claude.ai export / transcripts and reconcile their history summary (time-sensitive) | owner |
| DEC-OPEN-27 | Source and refresh of the PMS/AIF benchmark rows (static values last changed 20-May-2026) | owner (+ desk) |
| DEC-OPEN-28 | What "the portfolio dashboard" link of 21-Oct meant | owner |

Suggested order for the owner (from the task register): DEC-OPEN-02 and -03, then -01 (by about
13-Nov); -08 (by about 13-Nov); -04; -05; -07; -13, -14, -24; then the rest.

---

## 9. Open work, blockers and risks

Authoritative: [`../project-control/TASK_REGISTER.md`](../project-control/TASK_REGISTER.md) (tasks),
[`../KNOWN_ISSUES.md`](../KNOWN_ISSUES.md) (defects),
[`../project-control/KNOWN_ISSUES_AND_REGRESSION_RISKS.md`](../project-control/KNOWN_ISSUES_AND_REGRESSION_RISKS.md) (regression risks).

### 9.1 P1 tasks

| Task | Title | WS | Status | Blocked by / depends on | Owner |
|---|---|---|---|---|---|
| TASK-015 | Produce this handover package and merge it | GOV | IN PROGRESS | - | MOD-01 |
| TASK-016 | Validate the package against the repo before assigning work | GOV | PLANNED | TASK-015 | MOD-02 |
| TASK-017 | Restore OneDrive health (OneDrive running, folder pinned, `.git` hydrated) | OPS | NOT STARTED | owner action | owner; MOD-02 verifies |
| TASK-019 | Desk request pack DESK-01..DESK-23 sent and tracked | OPS | UNKNOWN / NEEDS INVESTIGATION | owner | owner |
| TASK-020 | Sep-2026 Reckoner catch-up `/monthly-update September 2026` | OPS | BLOCKED | DESK-01..DESK-04; TASK-017 | MOD-02 assigns (OPS-01) |
| TASK-021 | Oct-2026 MF cycle, about 13-17-Nov-2026 | OPS | PLANNED | DESK-23, -05, -03; TASK-024; TASK-022 for the matrix | MOD-02 assigns |
| TASK-022 | Build the NAV Data and Fund Risk Ratios producer (Sep-2026 regression test) | NB | BLOCKED | DEC-OPEN-02, -03, then -01; TASK-070 | MOD-02 assigns |
| TASK-023 | Apply the C20 decision to the 13 JioBlackRock records; release the held record | OPS | BLOCKED | DEC-OPEN-07 | MOD-02 assigns |
| TASK-024 | Apply or reject the 8 renames (inside TASK-021 step 1) | OPS | BLOCKED | DEC-OPEN-08 | MOD-02 assigns |
| TASK-025 | PMS label (B1): relabel or close through TASK-020 | OPS | BLOCKED | DEC-OPEN-04 | MOD-02 assigns |
| TASK-032 | R8: owner + compliance decide on the client items; Claude never deletes them | GOV | BLOCKED | DEC-OPEN-05 | owner + compliance |
| TASK-033 | R1: relay the purge / retire / cache requests to the outgoing owner; then clean the local `upstream` remote | GOV | BLOCKED | DEC-OPEN-13; outgoing owner | owner relays; MOD-02 records |
| TASK-064 | Full browser acceptance on the current live build (S7), Excel opened in Office, full-test checklist drafted | EX | PLANNED | TASK-016 | MOD-02 (or EX-01) |
| TASK-067 | Since-inception outlier gate in the MF bake; young-fund treatment of the UTI ETF value (C43) | OPS/NB | NOT STARTED | DEC-OPEN-07 (treatment) | MOD-02 assigns |

P2 tasks: TASK-018, -026, -027, -029, -030, -031, -034, -037, -039, -040, -041, -042, -045, -054, -057,
-065, -066, -069, -070, -071, -073, -074. P3 tasks: TASK-028, -035, -036, -038, -043, -044, -046 to
-053, -055, -056, -058 to -063, -068, -072. Backlog engineering is done only on the owner's request.

### 9.2 KNOWN_ISSUES that matter first (IDs in [`../KNOWN_ISSUES.md`](../KNOWN_ISSUES.md))

| ID | Severity | What | Route |
|---|---|---|---|
| B8 | P1 | NAV Data and Fund Risk Ratios were made in-house by the outgoing owner; nobody builds them now; blocks the Oct-2026 Portfolio Matrix. The only copy of their toolchain is local, in `handover-archive/export_20261023/extracted/05_project_working_folder/_nav_risk_toolchain/` (221 files) | DEC-OPEN-01..03; TASK-022, TASK-070 |
| C20 | P1 | 12 JioBlackRock Regular records show Direct-plan returns from before their launch (+ the held G-Sec record) | DEC-OPEN-07; TASK-023 |
| C43 (new) | P1 | `UTI BSE India Sector Leaders ETF` shows since-inception 297,765% on screen, in Excel and in the deck; the MF bake has no bound | TASK-067 |
| R1 | P1 | Client PII still public in the outgoing owner's repo and old site | DEC-OPEN-13; TASK-033 |
| R8 | P1 | The export shipped two client items (local, git-ignored) | DEC-OPEN-05; TASK-032 |
| B1 | P2 | PMS 31-Jul data under the "31st August 2026" label (client-facing) | DEC-OPEN-04; TASK-025, TASK-020 |
| C24 | P2 | Three screen paths (Section 1 tile, Section 5 Future Value, Section 6.1 Live Output) count no-band instruments as 0%; Section 4 and the deck GRAND TOTAL exclude them (the entry's PowerPoint sentence is corrected by the package) | DEC-OPEN-15; TASK-026 |
| C41 (new) | P2 | PMS/AIF benchmark rows read a static literal no tool updates (last changed 20-May-2026) | DEC-OPEN-27; TASK-065 |
| R6 | P2 | Repo inside OneDrive; checkout unsafe while `.git` files are cloud-only | TASK-017; DEC-OPEN-19 |
| R7 | P2 | Old site still live | DEC-OPEN-14, -24; TASK-034 |
| R9 (new) | P2 | `main` has no branch protection | DEC-OPEN-17; TASK-036 |
| A30 / A31 (new) | P2 | A broken sibling fails silently; two CLAUDE.md invariants not enforced by CI | TASK-042 |
| E7 (new) | P2 | `SKILL.md` and `MONTHLY_UPDATE_PROCESS.md` still say `git switch` (unsafe here; CLAUDE.md "Project control" overrides them) | TASK-018 |
| E8 (new) | P2 | `docs/HANDOVER.md` section 5 and the inbox README still list #12/#17 as files to send | TASK-018 |
| E16, R10, R11 (new) | P2 | Knowledge and artefacts only outside the repo: memory notes, side-session notes, `%TEMP%\x\` (incl. `ref.pptx`, INFERRED a copy of the client reference deck, not opened), `_testdata/`, B8 toolchain; cloud backup UNKNOWN | TASK-070, TASK-071 |

### 9.3 Top risks

| Risk | Why | Mitigation in place / needed |
|---|---|---|
| Partial deploy or sibling regression | `index.html` alone, or a broken sibling, reverts data without a CI failure (A30) | CI six-file check; TASK-042 to fail on sibling `console.error` |
| Checkout in the OneDrive folder | 229 cloud-only `.git` files; a switch truncated tracked files on 25-Oct | No checkout/switch here; branch with `git branch`, temporary index or worktree; TASK-017 |
| Oct-2026 cycle without decisions | Renames (DEC-OPEN-08) and B8 (DEC-OPEN-01..03) needed by about 13-Nov | Owner decision session early (section 13 step 3) |
| Merge without `verify` | No branch protection; any merge publishes | Gate D discipline; DEC-OPEN-17 |
| Client-facing wrong figures | C43, C20, C24, C41, B1 | Owner decisions, then reviewed data PRs with `financial-data-reviewer` |
| Loss of local-only evidence | `%TEMP%` can be cleaned; OneDrive client not running | TASK-070 inventory and secure; owner decides on `ref.pptx` (R10) |
| Two writers in one checkout | 19-Oct overlap (MOD-01 vs NB-01) and NB-03 left the main checkout on a feature branch | Single-writer rule, worktrees, `ACTIVE_CHANGE_REGISTER.md` |

### 9.4 Items only the owner can do

Start MOD-02 (paste the successor prompt); fix OneDrive (TASK-017); decide with compliance on the
client items (TASK-032); relay requests to the outgoing owner (TASK-033); tell users the new URL and,
after signing the full-test checklist, agree the old site's retirement (TASK-034); send the desk pack and
say which requests were already sent (TASK-019); decide on `%TEMP%\x\ref.pptx` (R10); answer the open
decisions; give explicit instruction before any repository-setting change or library upgrade.
Full list: [`../project-control/TASK_REGISTER.md`](../project-control/TASK_REGISTER.md).

---

## 10. Operating model (summary)

Detail: [`../project-control/FILE_OWNERSHIP_AND_CHANGE_CONTROL.md`](../project-control/FILE_OWNERSHIP_AND_CHANGE_CONTROL.md),
[`../project-control/ACTIVE_CHANGE_REGISTER.md`](../project-control/ACTIVE_CHANGE_REGISTER.md),
[`../project-control/CHAT_REGISTRY.md`](../project-control/CHAT_REGISTRY.md),
[`../project-control/INTEGRATION_AND_REGRESSION_LOG.md`](../project-control/INTEGRATION_AND_REGRESSION_LOG.md),
[`CODEBASE_GUARDIAN_HANDOVER_2026-10-28_v1.md`](CODEBASE_GUARDIAN_HANDOVER_2026-10-28_v1.md).

- **Moderator (MOD-nn).** The owner's single point of contact. Works in the main checkout (repo root),
  which always stays on `main`. Interprets requests, picks the workstream, splits work into bounded
  tasks, assigns them to sub-chats with a launch packet, keeps the registers, explains decisions in plain
  language, runs Gate D (merge = publish), and does docs-only changes itself. It never leaves the main
  checkout on another branch.
- **Guardian ARC-01.** The subagent `.claude/agents/integration-guardian.md` (read-only tools), invoked
  by the Moderator; for long reviews it may run as its own session named ARC-01. Reviews change-impact
  contracts before material or high-risk work and the actual diff after it; checks file ownership and
  interface compatibility; reports to the Moderator. Never implements features or makes product
  decisions. Its memory is its handover, the dependency map, the interface contracts, the active change
  register and the integration log (subagents keep nothing between calls). The eight existing specialists
  keep their roles (`principal-architect`, `repo-archaeologist`, `financial-data-reviewer`,
  `qa-verifier`, `security-reviewer`, `release-manager`, `docs-keeper`, `implementation-engineer`).
- **Sub-chats.** Coding sub-chats each get their own git worktree (desktop app: `start_session` with
  `use_worktree: true`, creating `.claude/worktrees/<name>`), on a task branch (`fix/`, `feat/`,
  `data/<YYYY-MM>`, `docs/`, `chore/`) cut from current `origin/main`. Read-only investigations may share
  the main checkout. IDs take the next free number: EX-01, NB-04, OPS-01, GOV-01, ARC-02, MOD-03.
- **Single-writer rule.** At most one active task modifies `site/index.html`; at most one modifies each
  sibling script and each file in `tools/lib/`. A monthly refresh owns all six deploy files for its whole
  run. Claims are recorded in `ACTIVE_CHANGE_REGISTER.md` before editing and released at merge.
- **Change-impact contract** (12 fields: IDs, objective and acceptance, behaviour to preserve, intended
  changes, files, interfaces and consumers, schema/config/dependency changes, financial rules, overlaps,
  tests, rollback, non-goals) before any material change; the Guardian reviews it.
- **Gates.** A: implementation report (PR description + register row: task, branch, worktree, base and
  head SHA, files, tests actually run, open issues). B: Guardian review of the diff. C: independent
  verification (`node tools/verify_page.js site`, `npm test`, the `verify-dashboard` skill /
  `qa-verifier`; a PowerPoint render + `check_pptx_bounds.js` for deck changes; `financial-data-reviewer`
  for data or financial logic). D: one PR at a time, CI `verify` green, merge, `release-manager` confirms
  live SHA-256 = `site/`, baseline updated in the integration log. E: owner acceptance, tracked separately
  (monthly refreshes publish under D61 and are accepted afterwards).
- **Recovery.** If a merge breaks the live site: stop dependent merges, keep evidence, `git revert` the
  merge commit in a new PR (never force-push), or restore the six deploy files from
  `backups/<date>_<tag>/` for data; record it in the integration log. Never discard unrelated work.
- **What the desktop app allows (be honest).** In the Claude desktop app's Code tab a Moderator can
  propose or start a session (the owner may have to click a card), message a session by its `local_...`
  id, list sessions, and is told when a session it started finishes a turn. It can rename a session
  (`set_session_title`), but the app asks the owner first when the owner set the title; it cannot start
  a session without the owner's approval when the app asks. This was not tested end to end
  (INFERRED from the tool surface). Outside the desktop app the fallback is a copy-ready prompt the owner
  pastes. The registers in files are always the record; nothing depends on chat-to-chat messaging.

---

## 11. Context continuity (summary)

Detail and templates: [`continuations/README.md`](continuations/README.md),
[`MODERATOR_HANDOVER_TEMPLATE.md`](MODERATOR_HANDOVER_TEMPLATE.md),
[`SUBCHAT_HANDOVER_TEMPLATE.md`](SUBCHAT_HANDOVER_TEMPLATE.md).

- **Triggers:** a third context compaction; the owner reports lost context; the chat cannot rebuild
  its tasks or decisions; important details are no longer in context; a new specialist chat is needed; a
  chat is retired or replaced. Prefer an early handover.
- **Counting compactions:** count `compact_boundary` records with **distinct timestamps** in the
  chat's transcripts under `%USERPROFILE%\.claude\projects\<project-slug>\`. A resumed session starts from
  a copy of its parent's summary (same timestamp): that is not a new compaction. Counting the phrase
  "This session is being continued" overcounts.
- **MOD-01's own case:** 2 automatic compactions (19-Oct-2026 06:28:17Z, 27-Oct-2026 12:24:37Z); the
  28-Oct session `df00b5b0` starts from a copy of the 27-Oct summary. The three-compaction trigger is
  **not** met; MOD-01 hands over because the owner ordered a new Moderator ("the Moderator itself needs to
  be replaced") and because its 15-19-Oct context survives only as summaries.
- **Scenario A (sub-chat replaced):** continuation branch `continuation/<chat-id>-task-<task-id>-YYYYMMDD`
  (lower case, e.g. `continuation/nb-04-task-021-20261105`) cut from the task branch's latest verified
  state, not from `main` unless `main` holds the work. **Scenario B (Moderator or Guardian replaced):**
  `handover/<from>-to-<to>-YYYYMMDD` from `origin/main`; never replaces an active implementation branch.
- **Uncommitted work (cases A-D):** checkpoint only work that is understood, owned by the outgoing task
  and free of secrets (`WIP: checkpoint task <id> for context handover`, never merged as is); otherwise
  inventory and preserve it locally and report what stays local-only. Repo specifics: never
  `git checkout` / `git switch` in the OneDrive checkout; create branches with `git branch <new> <base>`;
  commit a subset through a temporary index (outline from the memory note: `GIT_INDEX_FILE=<tmp>
  git read-tree <base>`, `git update-index --add <paths>`, write the tree, `git commit-tree`, then
  `git branch`; TASK-071 moves the exact recipe into the repo) or work in a worktree; stage files
  explicitly; secrets/PII scan before any push; never commit `.xlsx/.pptx/.zip` or anything under
  `monthly-updates/`, `backups/`, `handover-archive/`.
- **Successor prompts:** `continuations/<CHAT-ID>_TASK-<id>_SUCCESSOR_PROMPT_<YYYY-MM-DD>.md`, or
  `<FROM>_TO_<TO>_SUCCESSOR_PROMPT_<YYYY-MM-DD>.md` for Moderator/Guardian handovers. They must be
  specific and copy-ready (identity, transfer context, starting point, first actions, scope, next steps
  with acceptance criteria, coordination, git instructions, completion requirements, uncertainty
  warnings). Record the successor in `CHAT_REGISTRY.md`; retire the old chat only after its work, file
  claims and handover are reconciled.
- **This handover** is Scenario B with a clean tree: nothing is in flight (no open PR, no running coding
  chat, no uncommitted task work), so no WIP checkpoint is needed. NB-01, NB-02 and NB-03 are COMPLETED
  (not archived in the app: the owner's choice). No messages are waiting to be relayed to any sub-chat.
  Two questions to the owner are unanswered: DEC-OPEN-01 (B8) and DEC-OPEN-28.

---

## 12. What could not be recovered or verified

| Item | What is missing | Effect / next step |
|---|---|---|
| MOD-01's earliest context | 15-19-Oct detail survives only in two compaction summaries and the transcript files (`7628c9ae-33a1-4ba1-a4d9-bca35a44a511.jsonl`, `df00b5b0-8ce0-402b-9cbd-9bfedd047f08.jsonl` under `%USERPROFILE%\.claude\projects\<slug>\`). The 28-Oct session held nothing from 27-Oct 12:24Z to 28-Oct 05:30Z except through the transcript | The fact sheets were rebuilt from git, code, the transcripts and the docs; treat any intent not in the repo as INFERRED |
| The outgoing owner's own chats | Not accessible. Their export includes transcripts and `Project_History_and_Conversation_Summary.md`, which were analysed on 24-Oct but not reconciled ("not acted on"); their offered claude.ai export was never requested | DEC-OPEN-26; TASK-073 |
| Full browser acceptance on S7 | Not run since PR #26; the startup check of 28-Oct did not build a proposal or export | TASK-064 |
| Excel export in Office | Never opened in Excel since the transfer (only sheet names checked in the browser) | TASK-064 |
| PowerPoint render evidence | No render since 22-Oct; no COM render of a live-site deck; the per-deck "no problem found" lines were not kept in `_testdata/` (re-created by re-running the checker on the `%TEMP%\x\` files on 28-Oct); `%TEMP%` can be cleaned at any time | TASK-070; render again on the next deck change |
| Reference client deck | Moved from its 22-Oct path; `%TEMP%\x\ref.pptx` is INFERRED to be a copy, not opened (may hold client data; never commit or quote it) | owner decides (R10) |
| Cloud backup of local-only artefacts | OneDrive.exe not running, so whether `monthly-updates/`, `backups/`, `_testdata/`, the B8 toolchain and `%TEMP%\x\` are in the OneDrive cloud is UNKNOWN | TASK-017, TASK-070 |
| Desk requests | Whether any DESK request was sent; whether the "October 2026" Reckoner deck or the 30-Sep PMS file has been released | ask the owner (TASK-019) |
| Users and the new URL | Whether users were told the new URL; whether the team compared real proposals on it (MOD-01's 21-Oct advice) | ask the owner (TASK-034, DEC-OPEN-24) |
| "Full testing" | The owner's acceptance criteria for retiring the old site are not stated anywhere | DEC-OPEN-24 |
| "Portfolio dashboard" link | Which dashboard the owner meant on 21-Oct | DEC-OPEN-28 |
| Fresh-clone setup | Never tested; only asserted in `docs/DEVELOPMENT_SETUP.md` | TASK-072 |
| No force-push ever | A negative cannot be proven from the repo or the GitHub API (no contrary evidence) | REQ-023 stays IMPLEMENTED NOT FULLY VERIFIED |
| Reviewers per PR | Which specialist agents reviewed each PR is recorded only in transcripts (seen for #17, #18, #26) | from now on Gate A/B records it |
| Local git history | 87 historical blobs and the stash blobs fail with mmap locally (the historical ones exist on GitHub; the stash objects were never pushed). Why `git stash show -p` works where `git cat-file` fails is UNKNOWN | re-check before relying on it; TASK-017 |
| PMS performance content date | That the PMS block holds 31-Jul data is taken from the 25-Oct analysis, not re-derived | B1 |
| Desktop-app session control | `start_session` / messaging between sessions not tested end to end | first real use by MOD-02 confirms it |
| The package's own merge | The merge SHA and PR number of `handover/mod-01-to-mod-02-20261028` were not known when this file was written | MOD-02 records them in TASK-016 |

---

## 13. Immediate execution plan for MOD-02

The master prompt (section 6) puts Workstream A first. In this repository the baseline replication of
the existing dashboard is **already complete and verified** (section 4.1). What is left in A is transfer
completion and old-site retirement readiness, and most of it waits on the owner or the outgoing owner.
The OPS deadlines run **in parallel** and must not wait for A: the Sep-2026 Reckoner catch-up is due now
(blocked on desk files) and the Oct-2026 MF cycle falls about 13-17-Nov-2026.

| # | Step | Workstream | Acceptance criteria |
|---|---|---|---|
| 1 | **TASK-016: validate the package** in the main checkout, read-only, no checkout/switch: `git fetch origin` (check state afterwards; OneDrive locks can make it fail part-way), `git status -sb`, `git log -1 origin/main`, `gh pr list --state open`, `node tools/verify_page.js site`, `npm test`, live hash check of all 7 files (the `curl` loop in `REPOSITORY_AND_ENVIRONMENT_STATE.md` section 18; the `verify-dashboard` skill's `live` step hashes only the six deploy files), `list_sessions` to see who else is working | GOV | `origin/main` = the merge of `handover/mod-01-to-mod-02-20261028` or a later commit MOD-02 has read; 0 open PRs (or each understood); verify_page output = section 5; `npm test` 5/5, 903 checks; live 7/7 = `site/`; `ACTIVE_CHANGE_REGISTER.md` shows no active claim except MOD-01's TASK-015 (released at the merge; MOD-02 moves it to section 4); registers spot-checked against code and git; result recorded in `INTEGRATION_AND_REGRESSION_LOG.md` and `docs/PROJECT_STATE.md` (docs-only PR) |
| 2 | **TASK-017: ask the owner to fix OneDrive** (start OneDrive, set the folder to "Always keep on this device", let it hydrate) | OPS | 0 Offline files under `.git`; `git fsck --connectivity-only` exit 0; a read from `pack-631ec788...` succeeds. Until then: no checkout/switch; docs-only commits through the temporary index or a worktree |
| 3 | **Owner decision session** in plain language (DECISION_LOG drafts): DEC-OPEN-02, -03, -01 (B8; by about 13-Nov), -08 (renames; by about 13-Nov), -04, -05, -07, -13 / -14 / -24, -25, -26 (time-sensitive). Also ask which desk requests were sent (TASK-019) and whether users have the new URL | GOV (serves all) | Each answer recorded as a new D-number (from D84) in `docs/DECISIONS.md` or marked deferred in `DECISION_LOG.md`; the unblocked tasks updated in `TASK_REGISTER.md` |
| 4 | **Workstream A: TASK-064**, full browser acceptance on the live S7 build with the `verify-dashboard` skill / `qa-verifier` (read-only; MOD-02 or a read-only EX-01 chat) | EX | All 11 checks of `docs/TESTING.md` section 3 PASS or logged as defects (the 21-Oct record grouped its checks into 7 areas, adding live parity, data spot checks and the shared-link banner); a proposal built; PowerPoint export with `window.__PPTX_LAYOUT.warnings` empty; Excel opened in Office; console clean; a draft full-test checklist for the owner (input to DEC-OPEN-24); evidence in the integration log and PROJECT_STATE |
| 5 | **Workstream A: TASK-074**, record the owner's conversation-only decisions, above all the retirement condition, in `docs/DECISIONS.md` (D84+), KNOWN_ISSUES R7 and `docs/DEPLOYMENT.md` | EX / GOV | Docs-only PR merged with `verify` green; wording confirmed by the owner |
| 6 | **Workstream A: transfer completion** through the owner: prepare the messages for TASK-033 (R1 purge, old-site notice, GitHub cache), TASK-032 (R8, with compliance) and, if DEC-OPEN-26 is yes, TASK-073 | EX | Messages handed to the owner (never claimed as sent); outcomes recorded in KNOWN_ISSUES R1/R8 and the registers |
| 7 | **Workstream A: TASK-034**, old-site retirement, only after the owner signs the checklist (DEC-OPEN-24) and decides DEC-OPEN-14; the outgoing owner acts | EX | Users have the new URL; old site replaced by a notice or redirect, or removed; R7 closed |
| 8 | **In parallel, OPS: TASK-020** Sep-2026 Reckoner catch-up when DESK-01..DESK-04 land in `00_INBOX`; one OPS chat (OPS-01) in its own worktree holds all six deploy files | OPS | The skill's gates pass or are owner-waived; `DATA_DATES.pms` matches the file (B1); Select keys in MASTER = total; update log, PROJECT_STATE and CLAUDE.md headline updated; live 7/7 = `site/`; published under D61 |
| 9 | **In parallel, OPS: TASK-021** Oct-2026 MF cycle about 13-17-Nov-2026 (with TASK-024 renames per DEC-OPEN-08; the risk matrix only if TASK-022 is ready); then the Oct Reckoner cycle about 20-28-Nov | OPS | As step 8, plus the bake's not-merged list, warnings and unrecognised-sheet gate read; `docs/update-log/2026-10_Oct-2026.md` |
| 10 | **GOV before the first OPS run:** TASK-018 docs-consistency PR (E7 `git switch` in `SKILL.md` and `MONTHLY_UPDATE_PROCESS.md` first; E8-E15 and the KNOWN_ISSUES corrections); TASK-070 (secure the B8 toolchain and `%TEMP%\x\` evidence); TASK-071 (memory-only procedures into the repo) | GOV | Docs agree with the code (e.g. tools exit 2 on a missing input); docs-only PRs merged with `verify` green; `site/` unchanged |
| 11 | **Workstream B reassessment** (master prompt steps 4-5) once step 4 gives a current S7 acceptance baseline: re-rank NB tasks against it; P1 first: TASK-022 (after DEC-OPEN-01..03, with a Sep-2026 regression test reproducing the live `RISK_MATRIX`), TASK-067 (C43), TASK-023 (C20); then P2 (TASK-026, -065, -066, -069, -042 ...). Every material change goes through a change-impact contract and gates A-E | NB | Tasks assigned with launch packets; single-writer claims recorded; no NB change to `site/` overlaps an OPS run |
| 12 | **Housekeeping** once the owner agrees (DEC-OPEN-22): TASK-061 worktrees -> TASK-060 local branches -> TASK-059 remote branches; TASK-062 export the stash patch to `backups/`, then drop | GOV | Nothing unmerged lost; `git worktree list` shows only the main checkout; actions recorded in REPOSITORY_AND_ENVIRONMENT_STATE |

Do not start coding sub-chats before step 1 passes. Do not treat work that depends on an unverified
baseline as accepted. `TASK_REGISTER.md` section 4 lists TASK-064 before the decision session; steps 3
and 4 can run side by side, and where this table and the register differ, the register wins.

---

## 14. File index of the package

Created or changed by the merge of `handover/mod-01-to-mod-02-20261028`. The handover index
[`README.md`](README.md) says which files are authoritative, historical, or to give to the next chat.

| File | Purpose | Status |
|---|---|---|
| [`README.md`](README.md) | Package index (top) + the existing export-ingestion procedure | Authoritative index |
| `MASTER_HANDOVER_2026-10-28_v1.md` (this file) | Project history, architecture, state, decisions, blockers, execution plan | Authoritative snapshot (28-Oct-2026) |
| [`MODERATOR_BOOTSTRAP_PROMPT.md`](MODERATOR_BOOTSTRAP_PROMPT.md) | Copy-ready instruction set for any new Moderator | Authoritative |
| [`continuations/MOD-01_TO_MOD-02_SUCCESSOR_PROMPT_2026-10-28.md`](continuations/MOD-01_TO_MOD-02_SUCCESSOR_PROMPT_2026-10-28.md) | The exact prompt the owner pastes to start MOD-02 | Give to the next chat |
| [`continuations/README.md`](continuations/README.md) | Successor procedure, triggers, branch and file names | Authoritative |
| [`MODERATOR_HANDOVER_TEMPLATE.md`](MODERATOR_HANDOVER_TEMPLATE.md), [`SUBCHAT_HANDOVER_TEMPLATE.md`](SUBCHAT_HANDOVER_TEMPLATE.md) | Templates for future handovers | Template |
| [`EXISTING_DASHBOARD_HANDOVER_2026-10-28_v1.md`](EXISTING_DASHBOARD_HANDOVER_2026-10-28_v1.md) | Workstream A in full | Authoritative snapshot |
| [`NEW_BUILD_HANDOVER_2026-10-28_v1.md`](NEW_BUILD_HANDOVER_2026-10-28_v1.md) | Workstream B and monthly operations in full | Authoritative snapshot |
| [`CODEBASE_GUARDIAN_HANDOVER_2026-10-28_v1.md`](CODEBASE_GUARDIAN_HANDOVER_2026-10-28_v1.md) | Guardian ARC-01: dependency map, interfaces, ownership, integration state, risks | Authoritative snapshot |
| [`DATA_EXTRACTION_PROMPT.md`](DATA_EXTRACTION_PROMPT.md) | The outgoing owner's export prompt (16/21-Oct) | Historical (export received 23-Oct) |
| [`../project-control/README.md`](../project-control/README.md) | Index of the registers; points to `docs/PROJECT_STATE.md` | Authoritative |
| [`../project-control/CHAT_REGISTRY.md`](../project-control/CHAT_REGISTRY.md) | Chats, statuses, successors; external chats listed separately | Authoritative register |
| [`../project-control/TASK_REGISTER.md`](../project-control/TASK_REGISTER.md) | TASK-001..TASK-074 | Authoritative register |
| [`../project-control/REQUIREMENTS_AND_CHANGE_REGISTER.md`](../project-control/REQUIREMENTS_AND_CHANGE_REGISTER.md) | REQ-001..095, REQ-PPT-01..153 | Authoritative register |
| [`../project-control/DECISION_LOG.md`](../project-control/DECISION_LOG.md) | DEC-OPEN-01..28 with recommendations; index of load-bearing D-numbers | Authoritative for open decisions |
| [`../project-control/ARCHITECTURE_AND_DEPENDENCY_MAP.md`](../project-control/ARCHITECTURE_AND_DEPENDENCY_MAP.md) | Components, data flow, blast radius | Authoritative |
| [`../project-control/INTERFACE_CONTRACTS.md`](../project-control/INTERFACE_CONTRACTS.md) | Data blocks, page APIs, tool CLI, `verify_page`, deck design system, ripple lists | Authoritative |
| [`../project-control/FILE_OWNERSHIP_AND_CHANGE_CONTROL.md`](../project-control/FILE_OWNERSHIP_AND_CHANGE_CONTROL.md) | Ownership rules, single writer, change-impact contract, gates A-E | Authoritative |
| [`../project-control/ACTIVE_CHANGE_REGISTER.md`](../project-control/ACTIVE_CHANGE_REGISTER.md) | Live file claims (only MOD-01's TASK-015 claim at handover, released at the merge) | Authoritative register |
| [`../project-control/INTEGRATION_AND_REGRESSION_LOG.md`](../project-control/INTEGRATION_AND_REGRESSION_LOG.md) | PRs, baselines S0-S7, incidents INC-01..INC-17 | Authoritative log |
| [`../project-control/KNOWN_ISSUES_AND_REGRESSION_RISKS.md`](../project-control/KNOWN_ISSUES_AND_REGRESSION_RISKS.md) | Index of KNOWN_ISSUES + regression-risk catalogue | Index (KNOWN_ISSUES.md stays authoritative) |
| [`../project-control/REPOSITORY_AND_ENVIRONMENT_STATE.md`](../project-control/REPOSITORY_AND_ENVIRONMENT_STATE.md) | Remotes, branches, worktrees, stash, OneDrive, toolchain, safe git procedures | Authoritative snapshot |
| [`../../.claude/agents/integration-guardian.md`](../../.claude/agents/integration-guardian.md) | The Guardian subagent (ARC-01), read-only | New agent (9th) |
| [`../KNOWN_ISSUES.md`](../KNOWN_ISSUES.md) | 22 new entries (A29-A31, C41-C45, E6-E16, R9-R11) and dated corrections | Authoritative (changed) |
| [`../../CLAUDE.md`](../../CLAUDE.md), [`../README.md`](../README.md), [`../../CHANGELOG.md`](../../CHANGELOG.md), [`../PROJECT_STATE.md`](../PROJECT_STATE.md) | "Project control" section (incl. the no-checkout rule); two doc-map rows; release record; state | Authoritative (changed by MOD-01) |

`docs/project-control/PROJECT_STATE.md` is deliberately not created: `docs/PROJECT_STATE.md` remains the
single state document that CLAUDE.md tells every session to read.

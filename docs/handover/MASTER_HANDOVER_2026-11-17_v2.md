# Master handover v2: MOD-02 -> MOD-03 (17-Nov-2026)

**How to read this.** It is a snapshot of 17-Nov-2026, written from commands run that day and from MOD-02's own record of
its chat. It explains what was true and intended; it does not prove the working tree, branches, pull requests, CI or the
live site: check them (`continuations/MOD-02_TO_MOD-03_SUCCESSOR_PROMPT_2026-11-17.md` section D lists the commands). Where
a document and the code disagree, the code wins. Claims are labelled VERIFIED (a command or a line was checked: the
evidence is named), INFERRED, UNCERTAIN or UNKNOWN; statuses use the vocabulary of `MODERATOR_BOOTSTRAP_PROMPT.md`
section 12. Registers are linked, not copied; only the values a successor needs to validate are repeated. The structure is
that of `MODERATOR_HANDOVER_TEMPLATE.md` (sections 0 to 14) plus section 15, the crosswalk to the owner's handover prompt.
The project's history, architecture and replication story stay in `MASTER_HANDOVER_2026-10-28_v1.md` and the errata in
`README.md` section 1.1.

### 0. Header

| Field | Value |
|---|---|
| Version | 2 |
| Date | 17-Nov-2026 |
| Author chat | MOD-02 |
| Status | Authoritative (current state as of 17-Nov-2026, 06:48 to 08:03 UTC) |
| Supersedes | `MASTER_HANDOVER_2026-10-28_v1.md` for the state of the project (it becomes a historical snapshot and stays the history) |
| Next review | when the successor completes its validation task (TASK-080) |

### 1. Identity and reason

| Field | Value |
|---|---|
| Outgoing chat | `MOD-02 \| Project-Wide \| Master Project Moderator \| HANDOVER REQUIRED`; app session `cecc2f4c`; title in the app "Investment Proposal Dashboard"; active since 2-Nov-2026 07:43 UTC (the owner's first message is stamped 07:43:27Z); transcript file `56ada2dd...jsonl` under `%USERPROFILE%\.claude\projects\<project slug>\` |
| Successor | `MOD-03 \| Project-Wide \| Master Project Moderator \| QUEUED`; not started. The owner starts it by clicking the session card MOD-02 offers, or by opening a new chat in the Claude desktop app's Code tab on the repository folder (main checkout, no worktree) and pasting `continuations/MOD-02_TO_MOD-03_SUCCESSOR_PROMPT_2026-11-17.md` |
| Predecessor's handover | `MASTER_HANDOVER_2026-10-28_v1.md` (MOD-01 -> MOD-02); `continuations/MOD-01_TO_MOD-02_SUCCESSOR_PROMPT_2026-10-28.md` |
| Trigger (`continuations/README.md` section 1) | Two items. (1) "The chat has had three context compactions": FOUR, with distinct `compact_boundary` timestamps 2-Nov-2026 11:22:16Z, 2-Nov 19:14:48Z, 9-Nov 07:36:47Z and 17-Nov 06:28:46Z (VERIFIED: a script over the transcript; the trigger was already met on 9-Nov). (2) The owner's instruction: the owner pasted a handover master prompt on 17-Nov-2026 at 06:27:07Z asking for a package a new chat can continue from ("a chat is being retired or replaced", "the Moderator itself must be replaced") |
| What the outgoing chat can no longer reconstruct | The detail of 2-Nov to 9-Nov that is not in a register, a D-number, a `DEC-OPEN` entry, an update log or a PR body: the full text of the subagent reviews (security, consistency and Guardian reviews of PRs #34, #35 and #36) and of the data-pack feasibility workflow survive only in the transcript; their results are in the PR bodies, `INTEGRATION_AND_REGRESSION_LOG.md` and `docs/update-log/2026-11-02_datapack-feasibility.md`. The owner's own words are kept verbatim in the local package (the register of the owner's instructions). Everything said in chat that was not recorded is UNKNOWN to the successor except through that register |

### 2. Repository and git state (commands run on 17-Nov-2026, 06:48 to 07:47 UTC)

(Line numbers cited in sections 2 to 8 are those of `b47069b`, before this PR's edits. Scratch files named here (`state_raw_*.log`, `check_live.js`, `check_commit.js`, `assistant_questions.json`, `owner_view.txt`, the edit lists) are MOD-02's local working files; copies are in the package folder `06_WORKING_FILES`.)

| Field | Value |
|---|---|
| Repository path | `<repo>` (the workspace folder is the git repository). VERIFIED (`pwd` from the repository root, 06:48:07Z) |
| Remotes | `origin` https://github.com/productsteamcentricity/Centricity-Proposal-Playbook.git (fetch and push). `upstream` = the outgoing owner's repository (address not repeated here): fetch URL set, push URL reads `DISABLED-read-only-reference`. `gh repo set-default --view` = `productsteamcentricity/Centricity-Proposal-Playbook`. VERIFIED (`git remote -v` 06:48:55Z; `gh repo set-default --view` 06:48:57Z) |
| Main checkout branch | `main`. VERIFIED (`git rev-parse --abbrev-ref HEAD` = `main`; `git status -sb` = `## main...origin/main`, 06:48:50Z) |
| HEAD / `origin/main` | `b47069bf3e6d73973cf48a3a754ec2ad4b5cd289` / `b47069bf3e6d73973cf48a3a754ec2ad4b5cd289`; `git rev-list --left-right --count origin/main...main` = `0 0` (ahead 0, behind 0). `git fetch origin` exit 0 at 06:48:36Z (no ref moved). Re-confirmed at about 07:17Z: `git ls-remote origin refs/heads/main` = `b47069b...` and local `main` = `b47069b...`. VERIFIED |
| Code and data baseline (base SHA) | `b47069b` = merge of PR #36 (D89 to D96; DEC-OPEN-07, -08, -30, -31 and -32 answered), created 9-Nov-2026 12:42:10Z, merged 17-Nov-2026 06:37:48Z, head `c6bb4aa`; it changes three documents only (`docs/DECISIONS.md`, `docs/project-control/DECISION_LOG.md`, `docs/project-control/README.md`; +512/-226; `git diff --stat ddd0304 b47069b`). Site content state S7: the last commit that touched `site/` is `625fdd56373bec7136e80fc197ad3dc0d758d74a` (22-Oct-2026 21:05:37 +0530 = 15:35:37Z, "PowerPoint design system: measured layout, continuation slides, honest labels (D82, D83)"), merged as PR #26 `5d39821` (22-Oct-2026 15:37:21Z). `git diff --stat 5d39821 origin/main -- site tools .github package.json package-lock.json .gitignore .gitattributes` printed nothing: no change to the deploy set, the tools, the workflow or the package files since PR #26 (the last `.github` and package-file commit is `11464c2`, 19-Oct-2026). Data state: as in the CLAUDE.md headline (30-Sep-2026 data, AIF and Select 31-Aug-2026, PMS 31-Jul data under a 31-Aug label). VERIFIED |
| Handover branch | planned name `handover/mod-02-to-mod-03-20261117` (INFERRED from the template and `continuations/README.md` section 2); NOT CREATED at the time of this check (06:48 to 07:11Z; the branch was made afterwards: section 12). The only `handover/*` branch then was `handover/mod-01-to-mod-02-20261028` (local and on origin, merged as PR #29 `f5c2431`). The tip, the PR and the merge of the new branch are in the pull request. VERIFIED (`git for-each-ref` over `refs/heads/handover/*` and `refs/remotes/origin/handover/*`, 07:11Z) |
| Working tree | staged none; unstaged none; untracked none. `git status --porcelain` = 0 lines at 06:53:21Z (after the tests), 06:55:23Z and about 07:17Z; `git diff --stat origin/main` (whole tree) empty. `git status --porcelain --ignored` lists only git-ignored local-only items (names only; contents not opened): `.claude/worktrees/`, `_testdata/`, `backups/` (2 snapshot folders dated 2026-10-19), `handover-archive/`, `monthly-updates/` month folders March to October 2026 plus a manifest file, `node_modules/`, `tools/__pycache__/`. 126 files are tracked (`git ls-files`). My runs left no change. VERIFIED |
| Preservation case (A-D) | none: clean tree. The main checkout and all four extra worktrees have 0 `status --porcelain` lines (VERIFIED below), so nothing needs a case A-D checkpoint; WIP checkpoint none. MOD-02's drafts (the OPS-01 claim PR draft; the pasted master prompt) are outside git in the chat's scratch folder (INFERRED from the task statement: the tree is clean, so they are not in it) and are NOT preserved by any git object |
| Unmerged branches | `git branch --no-merged main` = empty (0 of 39 local branches, 06:50:52Z); `git branch -r --no-merged main` = `upstream/HEAD -> upstream/main` and `upstream/main` only (the read-only reference to the outgoing owner's repository; expected; never push it). Every `origin/*` branch (33 besides `main`) is merged. Owner of each: none to assign. Local-only branches (not on origin): `claude/adoring-boyd-7028f6` (`8e187ae`, NB-02's app session branch), `claude/focused-wright-d50bee` (`bf20c08`, NB-01's), `claude/affectionate-lovelace-f11b67` (`c0fb2dd`, GOV-01's app session branch), `claude/ops-01-reckoner-a11e94` (`ddd0304`, OPS-01's app session branch, INFERRED from its name), `claude/investment-proposal-dashboard-c68580` (`f5c2431`, app branch of the unused worktree), `data/2026-09-4` (`ddd0304`, OPS-01's task branch; 0 commits of its own; never pushed). On origin only: `origin/docs/handover-export-ingestion` (PR #28). Counts: local 39 (38 besides `main`), origin 34 including `main` (33 besides), 1 tag (`handover-baseline` = `862e40b`). VERIFIED (`git branch`, `git for-each-ref`, 06:50Z to 07:11Z) |
| Open PRs | none: `gh pr list --state open` is empty (`--json` gives `[]`, 06:49:33Z); repository `open_issues_count` 0. 36 PRs exist, all merged (36 first-parent merges on `main`). The merged PRs since the previous baseline: #26 `5d39821`, #27 `5bcce88`, #28 `2b2a397`, #29 `f5c2431`, #30 `32172f5`, #31 `c0fb2dd`, #32 `703b975`, #33 `8aeabfc`, #34 `3fd1eab`, #35 `ddd0304`, #36 `b47069b`. VERIFIED |
| Worktrees | 5 registered (main + 4); table below. All are clean and every HEAD is an ancestor of `origin/main`. VERIFIED (`git worktree list --porcelain`; per worktree `git -C <path> status --porcelain`, `rev-parse HEAD`, `merge-base --is-ancestor`, 06:50:15Z to 06:50:42Z) |
| Stash | one entry, `stash@{0}`; details below. VERIFIED (`git stash list`, `git stash show --stat stash@{0}`, 06:50:47Z) |
| Environment | OneDrive running: yes. Folder pinned: yes. Cloud-only `.git` files: 0 of 923. `git fsck --connectivity-only --no-dangling` exit 0. Toolchain: node v24.21.0, npm 11.19.0, git 2.56.0.windows.2, gh 2.102.0 (2026-09-30), Python 3.14.4. Details and the TASK-017 acceptance comparison below. VERIFIED |

##### Worktrees (owner, state, activity)

`git worktree list` at 06:50:15Z, with `git -C <path>` facts at 06:50:19Z to 06:50:42Z. "Behind/ahead" is
`git rev-list --left-right --count origin/main...HEAD` (left = only on origin/main).

| Worktree | Branch | HEAD | Clean | Behind / ahead | Owner chat | Active? |
|---|---|---|---|---|---|---|
| `<repo>` (main checkout) | `main` | `b47069b` | yes (0 lines) | 0 / 0 | MOD-02 (`docs/project-control/CHAT_REGISTRY.md:59`) | yes, until the handover |
| `<repo>\.claude\worktrees\adoring-boyd-7028f6` | `data/2026-09-4` (local only, no upstream, created 9-Nov-2026 18:04:22 IST = 12:34:22Z "branch: Created from HEAD"; the app's session branch `claude/ops-01-reckoner-a11e94` was checked out 18:02:47 IST just before) | `ddd0304` (PR #35 merge) | yes (0 lines) | 2 / 0 | OPS-01, session `ab19558f` (task statement; OPS-01 has NO record in `CHAT_REGISTRY.md`, which still shows this folder as NB-02's, `:62`, `:194`) | no (INFERRED idle: its admin-folder `HEAD` and `index` files were last written 9-Nov-2026 18:04 and 18:02 IST; the task statement says its last turn ended 9-Nov-2026 21:49Z with the weekly-limit error) |
| `<repo>\.claude\worktrees\focused-wright-d50bee` | `docs/gov-01-rule-consistency-20261102` (also on origin; merged by PR #35, head `29e0d32`) | `29e0d32` | yes (0 lines) | 3 / 0 | GOV-01, session `622b2ebd`, TASK-018 (formerly NB-01's folder; `CHAT_REGISTRY.md:64`) | no (INFERRED idle: PR #35 merged 9-Nov-2026 12:16:05Z; last commit 9-Nov 14:34 IST; last `FETCH_HEAD` 9-Nov 17:42 IST) |
| `<repo>\.claude\worktrees\investment-proposal-dashboard-c68580` | detached | `f5c2431` (PR #29 merge) | yes (0 lines) | 22 / 0 | none (created by the desktop app on 2-Nov-2026 13:11 IST, 20 s before MOD-02's session; "made for MOD-02" is INFERRED, `REPOSITORY_AND_ENVIRONMENT_STATE.md:693-697`); unused: its `HEAD` reflog has the one creation entry | no |
| `%USERPROFILE%\AppData\Local\Temp\cpp-old` | detached | `bf20c08` (PR #2 merge, 16-Oct-2026) | yes (0 lines) | 85 / 0 | none (rehearsal worktree for PR #3, 16-Oct-2026; `KNOWN_ISSUES.md` E11) | no |

Rule documents inside the two reused worktrees: `git -C <wt> diff --name-only origin/main -- CLAUDE.md .claude docs`
lists `docs/DECISIONS.md`, `docs/project-control/DECISION_LOG.md` and `docs/project-control/README.md` for both
`adoring-boyd-7028f6` and `focused-wright-d50bee` (the D89 to D96 record of PR #36 is missing there; `CLAUDE.md` and
`.claude/` equal `origin/main`). A session opened in either folder must `git fetch origin` and merge `origin/main`
into its task branch first (CLAUDE.md "Worktrees"). The unused `c68580` folder differs in many rule files: do not open
a session there. `git worktree prune -n -v` (dry run) names two stale admin folders, `worktrees/cpp-main` and
`worktrees/wtdocs` ("gitdir file does not exist"); `.git/worktrees` holds 6 folders (4 live, 2 stale). No clean-up was
done (TASK-059 to TASK-062 wait for DEC-OPEN-22).

##### Stash

`stash@{0}` = `6cb06246938e04f08dada3769b4079c68e4070fb`, "On fix/tools-core-dates: phase2-rest (snapshot in
scratchpad/wt_snapshot)", made 19-Oct-2026 12:02:32 +0530; base `8e65de1` (an earlier, amended tip of
`fix/tools-core-dates`; not an ancestor of `origin/main`). `git stash show --stat`: 23 files changed, +1,627/-698
(`site/index.html`, `site/Centricity_SIF_Refresh.js`, `docs/PRD.md`, `docs/README.md` and 19 tool files), plus 3
untracked files in `stash@{0}^3` (`docs/handover/DATA_EXTRACTION_PROMPT.md`, `docs/handover/README.md`,
`tools/data/pins.json`). VERIFIED. Readability: `git stash show -p --include-untracked stash@{0}` produced
1,408,451 bytes (the same size as on 28-Oct and 2-Nov); `git cat-file blob` read all 23 tracked and all 3 untracked
stash blobs (26 of 26; on 28-Oct 16 failed with "mmap failed"). VERIFIED (07:00Z and 07:01Z). Content verdict:
`REPOSITORY_AND_ENVIRONMENT_STATE.md:169` says 8 files identical to `main`, 18 superseded, 0 with work `main` lacks
(per file VERIFIED by MOD-01, overall verdict INFERRED). My re-check agrees on the first number only: 7 of the 23
tracked blobs and 1 of the 3 untracked blobs equal their `origin/main` blobs (8); "superseded" and "no unique work" were
NOT re-audited here (UNCERTAIN). The register's advice: keep it, do not drop, apply or pop it; export first (TASK-062,
waits for DEC-OPEN-22). The stash was never pushed (INFERRED from `REPOSITORY_AND_ENVIRONMENT_STATE.md:386`).

##### Environment (OneDrive and the object store)

| Item | Result (VERIFIED unless marked) |
|---|---|
| OneDrive processes (PowerShell `Get-Process`, 06:54:53Z) | `OneDrive.exe` PID 11476 started 05:04:38Z today; `OneDrive.Sync.Service` PID 37392 started 05:04:43Z; `FileCoAuth` PID 38164 started 05:52:06Z; `FileSyncHelper` PID 15340 (start time not readable) |
| Pinned attribute 0x80000 | set on the repository root (attribute 0x80431), `.git` (0x80433), `.git\objects\pack`, `site` and `monthly-updates` (0x80431 each). Only these five folders were checked; other folders were not |
| Cloud-only files under `.git` | 0 of 923 files: Offline (0x1000) = 0, RecallOnDataAccess (0x400000) = 0, RecallOnOpen (0x40000) = 0. Outside `.git`: 0 of 4,351 files carry any of the three flags. History in the registers: 229 of 519 (28-Oct), 228 of 568 (2-Nov), 228 of 686 (3-Nov), 228 of 780 (9-Nov) |
| Object store | `git fsck --connectivity-only --no-dangling` exit 0 (06:55:17Z to 06:55:19Z); `git count-objects -vH`: 718 loose objects (38.99 MiB), 1,768 in packs, 6 packs (97.70 MiB), garbage 0, prune-packable 267; `.git` = 923 files, 143,562,190 bytes (718 loose objects, 6 `.pack` files plus a `multi-pack-index`) |
| Reads that failed with "mmap failed" in the registers | none fail now: `git rev-list --objects --all \| git cat-file --batch` exit 0 (07:01:08Z; 1,072 objects reachable from `main`); `git verify-pack -v` of `pack-631ec788...idx` exit 0 and a read of its largest blob (`855e3fcc...`, 12,821,612 bytes) returned all bytes (06:57:57Z); 70 of 70 historical `index.html` blob reads (`site/index.html` and the root `index.html`) and 9 of 9 SIF-sibling blob reads returned the recorded size (06:58Z to 07:00Z); the 2-Nov audit saw 5 of 11 historical reads fail |
| Toolchain (06:54:56Z) | node v24.21.0; npm 11.19.0; git 2.56.0.windows.2; gh 2.102.0 (2026-09-30); Python 3.14.4 (`python` is on PATH; the `py` launcher is not). Equal to the record K30 (`REPOSITORY_AND_ENVIRONMENT_STATE.md:807`). `xlsx` in `node_modules` = 0.18.5 = the `package.json` pin (`node -p "require('xlsx/package.json').version"`, 07:45:12Z). `npm ci` itself was NOT RUN |
| `git status --porcelain --ignored` (06:55:24Z) | prints 64 warnings "could not open directory ... Filename too long", all 64 under the git-ignored extracted export inside `handover-archive/` (git's Windows path-length limit; names only, no content was read; counted in the raw log, 07:46Z). The plain `git status --porcelain` prints nothing. Whether those long paths still trouble the OneDrive client: UNKNOWN (OneDrive shows 0 cloud-only files, see above) |
| GitHub settings (read only, 07:13Z) | repository public; default branch `main`; `delete_branch_on_merge` false; branch protection on `main`: none (HTTP 404, KNOWN_ISSUES R9); `pushed_at` 2026-11-17T06:37:48Z |

TASK-017 acceptance (`TASK_REGISTER.md:227-240`) against today's measurements: OneDrive.exe running: MET. Folder set to
"Always keep on this device": MET on the five folders checked. 0 Offline files under the repository including
`.git/objects/pack/`: MET (0 of 923 under `.git`, 0 of 4,351 elsewhere). `git fsck --connectivity-only` exit 0: MET.
A `git cat-file` of an object stored in `pack-631ec788...` succeeds: MET. "Result logged in `docs/PROJECT_STATE.md` and
`REPOSITORY_AND_ENVIRONMENT_STATE.md`": NOT MET at `b47069b`: the repository recorded TASK-017 as IN PROGRESS. The PR of this handover (TASK-079) records the pass (TASK_REGISTER section 7, PROJECT_STATE.md, REPOSITORY_AND_ENVIRONMENT_STATE.md section 20, KNOWN_ISSUES R13), which meets the condition when it merges. CLAUDE.md (lines 90 and 101) ties the ban on `checkout`, `switch`, `merge` and `pull` in the main checkout, and the `--apply` hold, to a pass that PROJECT_STATE.md records; the ban still applies whenever OneDrive is not running or any `.git` file is cloud-only.

### 3. Tests actually run


Every row was run on `b47069b` (`origin/main` = local `main`) unless the row says otherwise.

| Command or check | When (UTC) | At SHA | Result | Evidence |
|---|---|---|---|---|
| `node tools/verify_page.js site` | 2026-11-17 06:52:58Z to 06:52:59Z | `b47069b` | exit 0. MASTER effective 7682; CENTRICITY_SELECT 178 (keys present in MASTER 178; with rationale 133, with risk ratios 46, with details 51); PMS_PERFORMANCE.pms 692, .aif 12, .benchmark 4; PMS_PERF_ALIAS 27 (null pins 4); EQUITY_ANALYTICS 1205; RISK_MATRIX 1088; PMS_AIF_TERMS 73; EXTRA_SLIDES 6; DATA_DATES performance 30th September 2026, analytics 30th September 2026, pms 31st August 2026, sif 30th September 2026, riskMatrix 30 Sep 2026; duplicate MASTER names 0; file ends `</html>` yes; MASTER PMS with perf 23 of 27; script errors 0 | `state_raw_c.log`. Compared line by line with `docs/PROJECT_STATE.md:102-122` ("Latest verification" block): identical on all 18 output lines. Compared with the CLAUDE.md headline (MASTER 7,682; Select 178/178; PMS 692 / AIF 12 / benchmarks 4; RISK_MATRIX 1,088; EQUITY_ANALYTICS 1,205; 0 duplicates; 0 script errors): identical |
| `npm test` (`node tools/test/run.js`) | 06:52:59Z to 06:53:21Z | `b47069b` | exit 0. 5 of 5 test files passed; 903 checks, 0 failures: blocklib 34, dates 10, parser_refresh_only 18, pptx_layout 798, tool_inputs 43 | `state_raw_c.log`. Equals `PROJECT_STATE.md:88-92` (9-Nov) and the 28-Oct and 2-Nov records (903) |
| live parity (7 files, SHA-256) | 06:53:29Z to 06:53:40Z | `b47069b` (the `site/` bytes are those of PR #26) | `check_live.js` exit 0: "7 of 7 live files equal site/". Sizes and SHA-256 of `site/` (= live): `index.html` 12,864,963 B `916f2455eebaf2362e60a97314203e8ffc52955892cfa04a5c5248301ac62ce3`; `Centricity_ExtraSlides.js` 2,617,988 B `777f975bc796e30aa897931d3525949bbaebe4d8222747a9e113ef12e89dba2b`; `Centricity_PMS_AIF_Terms.js` 6,054 B `8ed1c0df3ed34a6b2c2c802b6ac72a7fc46600a5d3a77a70bb4b4217bfb1688a`; `Centricity_June_Refresh.js` 54,408 B `0cf078943cf9204c5e90c4ea37498f1140bce144ed0fd42e43d0c4738d3ac9d8`; `Centricity_IRR_Offshore.js` 110,356 B `2aaeb57c1d51d3d31ee5dcd776a631f7d2e96c407568695f8dfa4518e4667601`; `Centricity_SIF_Refresh.js` 35,735 B `a2a515535462dc6ebdea969b97e27ac7d5d2641b00fcd4fa40fbc4a26b1d37ab`; `robots.txt` 156 B `d6add17b4662277921d273d61932ef5d19e29af362efe05dd9d9cc1c76501dfc`. `Centricity_Risk_Matrix.js` returns 404 (07:13Z) | `state_raw_d.log`, `state_raw_j.log`. The page's `index.html` Last-Modified is Tue, 17 Nov 2026 06:38:21 GMT. CI push run 44032631708 for `b47069b`: success (job verify 06:37:53Z to 06:38:08Z; job publish 06:38:12Z to 06:38:26Z); deployment 7846135755 `github-pages` created 06:38:09Z, success 06:38:27Z. PR run 42619217382 on the PR head `c6bb4aa`: success (verify), publish skipped by design |
| browser (`verify-dashboard`, `docs/TESTING.md` section 3) | NOT RUN in this task. Last run: EX-01, 2-Nov-2026 15:19 to 16:13 UTC (per its report) | `c0fb2dd` (the `site/` bytes equal today's: the report names `index.html` `916f2455...`) | Per EX-01's local report: all 11 checks of TESTING.md section 3 PASS plus the shared-link view; 0 console messages, 0 exceptions, 0 failed requests over 8 page loads; `window.__PPTX_LAYOUT.warnings` empty for every export; 4 new findings (EX01-N1 overlap-matrix legend cut off for 2 to 4 funds, P3; EX01-N2 Excel export has no number formats or cached formula values, P3; EX01-N3 Net Asset Allocation counts every Global Funds record as equity, P3, needs an owner rule; EX01-N4 one unexplained, unreproduced Direct-monitor misrouting, watch item); known items reproduced: C23, C24, C26, C28, C36, C43, B1 | LOCAL ONLY report `_testdata/acceptance-2026-11/EX-01_ACCEPTANCE_REPORT.md` (21,578 bytes, written 2-Nov-2026 21:47 IST). Its first 90 lines were read (header, verdict, the 11-check table, the required-tests table). The report's content is VERIFIED; that the run happened as described is INFERRED (I did not repeat or audit it). At `b47069b` it was NOT recorded in the repository (`docs/update-log/2026-11-02_ex01-browser-acceptance.md` does not exist and `TASK_REGISTER.md:199` read IN PROGRESS); this PR records the findings as KNOWN_ISSUES C47 to C50 and TASK-064 as IMPLEMENTED NOT FULLY VERIFIED, and the update-log file is still to be written (TASK-081). The last full pass recorded in the repository is 21-Oct-2026 on S6 (7 areas PASS; `PROJECT_STATE.md:143-148`, `INTEGRATION_AND_REGRESSION_LOG.md:66,91,102`) |
| `git fsck --connectivity-only --no-dangling` | 06:55:17Z to 06:55:19Z | `b47069b` | exit 0, no output | `state_raw_f.log` |
| object walk and pack read | 06:57:57Z; 07:01:00Z to 07:01:08Z | `b47069b` | `git verify-pack -v pack-631ec788...idx` exit 0, no stderr; `git rev-list --objects main \| git cat-file --batch` exit 0 (1,072 objects), same for `--all` exit 0; 70 of 70 historical `index.html` reads and 9 of 9 SIF-sibling reads OK; stash: patch 1,408,451 bytes, 26 of 26 blobs read | `state_raw_g.log`, `state_raw_h.log` |
| CI history | 07:11:38Z | `b47069b` | `gh run list --limit 300`: 74 runs, all `success` (38 `pull_request`, 36 `push`); 36 `github-pages` deployments | `state_raw_i.log` |
| other: PowerPoint render (`tools/dev/render_pptx.ps1` + `check_pptx_bounds.js`) | NOT RUN today. Last recorded: 22-Oct-2026 (PR #26: 3, 4, 8, 15, 30 and 45 instrument decks rendered and bounds-checked; `PROJECT_STATE.md:150-160`). Per the EX-01 report only: 2-Nov-2026 (23-slide deck "deepest table bottom 6.895", Invictus deck 23 slides, 34-slide deck "deepest table bottom 6.880", no problem found) | `625fdd5` / `c0fb2dd` | see the browser row | not recorded in the repository for 2-Nov |
| other: Excel opened in Office | NOT RUN today. The registers record it as never run on S7 (`INTEGRATION_AND_REGRESSION_LOG.md:91,469`). Per the EX-01 report only: both exported workbooks opened in Microsoft Excel 16.0 (build 20527) through COM on 2-Nov-2026, 13 sheets, 0 formula errors, no repair log | `c0fb2dd` | see the browser row | not recorded in the repository |
| other: financial-data review | not applicable: no financial logic, data block or tool changed since 22-Oct-2026 (PRs #27 to #36 are documents only) | n/a | n/a | `git diff --stat 5d39821 origin/main -- site tools ...` empty |

##### NOT RUN (what a successor must not assume ran)

The most recent commit that touched `site/` is `625fdd56373bec7136e80fc197ad3dc0d758d74a`, 2026-10-22 21:05:37 +0530
(15:35:37Z), merged as PR #26 `5d39821` at 15:37:21Z. Ten PRs (#27 to #36) merged after it; none touched `site/`,
`tools/`, `.github/` or the package files (VERIFIED). Since that commit:

1. Browser start-up of the page on 17-Nov-2026 at `b47069b`: NOT RUN (no browser was used in this task; `site/` is byte-identical to what 7 of 7 live files serve). The last start-up checks are MOD-02's of 2-Nov-2026 (MASTER 7,682, three sibling flags, 0 console messages; recorded in `INTEGRATION_AND_REGRESSION_LOG.md:90`) and EX-01's eight page loads of 2-Nov-2026.
2. A full browser acceptance recorded in the repository for S7: NOT RECORDED. EX-01 ran one on 2-Nov-2026 (report exists only locally; see the browser row); the repository still says "not run on S7".
3. PowerPoint render and Excel opened in Office: NOT RUN since 22-Oct-2026 as far as the repository records; the EX-01 report says both happened on 2-Nov-2026 (unrecorded).
4. EX-01 did not exercise (its report, section 6): the Cr/Lakhs corpus toggle in the browser, risk profiles other than Balanced and the cap behaviour, the Master Editor and "Master Data" download, the PMS/AIF SOA upload and "Download blank template", the custom logo upload, the minimum-investment breach path, phone and tablet widths, Chrome, a Direct-plan export, the PDF of Excel sheet 1, a visible Excel or PowerPoint window and Protected View.
5. A fresh-clone setup (`git clone`, `npm ci`, `node tools/verify_page.js site`): NOT RUN. The last `npm ci` on record is GOV-01's of 9-Nov-2026 in a worktree (exit 0, `PROJECT_STATE.md:88-89`).
6. `npm run rehearse` (tool rehearsal on temporary copies) and any `--apply`: NOT RUN (no tool changed; the two Reckoner dry runs of 9-Nov-2026 stopped at gates and applied nothing, per the task statement: INFERRED, the local reports were not read).
7. `integration-guardian` Gate B and `security-reviewer` on PR #36 (documents only): UNKNOWN from the repository; PR #36 has no record of either in the files I read.

### 4. Work: done and not done

State BEFORE my edits (origin/main today): 78 tasks; completed history 16 (15 VERIFIED COMPLETE, 1 IMPLEMENTED NOT FULLY
VERIFIED); open 62: BLOCKED 24, NOT STARTED 28, PLANNED 5, UNKNOWN / NEEDS INVESTIGATION 2, IN PROGRESS 3 (TASK-017,
TASK-018, TASK-064). All three IN PROGRESS rows are stale (see section 5).

State AFTER `edits_tasks.json` (recomputed from the edited index, 85 tasks): completed history 18 (17 VERIFIED COMPLETE,
1 IMPLEMENTED NOT FULLY VERIFIED); open 67: BLOCKED 22, NOT STARTED 27, PLANNED 14, UNKNOWN / NEEDS INVESTIGATION 2,
IN PROGRESS 1, IMPLEMENTED NOT FULLY VERIFIED 1 (TASK-064). Groups (open): R 13, O 16, D 7, E 16, H 7, G 8.

Task statuses below are the register's after the edits. `*` = changed by the edits.

##### EX (existing dashboard)
- Done: TASK-001, 008, 012, 014 (VERIFIED COMPLETE).
- TASK-064 Full browser acceptance: IMPLEMENTED NOT FULLY VERIFIED * (was IN PROGRESS). EX-01's pass of 2-Nov-2026 (base `c0fb2dd`)
  reports all 11 checks of `docs/TESTING.md` section 3 PASS plus the shared-link view, Excel opened in Microsoft Excel,
  deck layout warnings empty, console clean; 4 new P3 findings (EX01-N1 Overlap Matrix legend cut for 2 to 4 funds;
  N2 Excel has no number formats or cached formula values; N3 Net Asset Allocation counts every "Global Funds" record as
  equity incl. a GIFT City G-Sec feeder, needs an owner rule; N4 one unexplained, unreproduced Data Refresh misrouting).
  VERIFIED that the report and its evidence (81 top-level entries; 153 files per the report) exist locally in `_testdata/acceptance-2026-11/` (git-ignored) and that
  at `b47069b` the repository held no record (no update-log file, no KNOWN_ISSUES entry, no PROJECT_STATE line); this PR adds KNOWN_ISSUES C47 to C50 and a PROJECT_STATE line, and the update-log file is still to be written (TASK-081). Not re-run.
  Remaining: TASK-081 records it; then VERIFIED COMPLETE; REQ-071 re-assessed.
- TASK-034 Retire the old site: PLANNED (owner sign-off, DEC-OPEN-14 and -24, TASK-033; Dep TASK-064 recorded).
- TASK-073 Outgoing-owner export: BLOCKED (DEC-OPEN-26; owner; outgoing owner).

##### NB (new build)
- Done: TASK-002, 003, 004, 005, 009, 011 (VERIFIED COMPLETE); TASK-013 (IMPLEMENTED NOT FULLY VERIFIED).
- TASK-022 Portfolio Matrix bridge from the MF Screener data pack: PLANNED * (was BLOCKED). TASK-018 merged, DEC-OPEN-30 and
  -31 answered (D92, D93), DEC-OPEN-32 yes. No branch, claim, contract or Guardian pre-check exists yet (VERIFIED: no
  such branch; ACTIVE_CHANGE_REGISTER holds only the TASK-018 row). This is the Portfolio Matrix bridge: there is no
  second row for it (checked: no other row builds it; TASK-053 and TASK-057 follow it; TASK-066 shares its file).
- BLOCKED: TASK-026, 030, 052, 057, 065 (see section 2). NOT STARTED backlog (on request): TASK-039, 040, 041, 042, 043,
  044, 045, 046, 047, 048, 049, 050, 055, 058, 066, 068, 069, 076.

##### OPS (monthly data operations)
- Done: TASK-006, 010 (VERIFIED COMPLETE); TASK-017 VERIFIED COMPLETE * (was IN PROGRESS; evidence: TASK_REGISTER section 7).
- TASK-019 desk request pack: UNKNOWN / NEEDS INVESTIGATION (no record that any DESK request was sent).
- TASK-020 Sep-2026 Reckoner catch-up: BLOCKED (blockers rewritten *): the dry runs of steps 14 and 15 stopped at gates.
  Work lives in OPS-01's worktree (section 1.1).
- TASK-021 Oct-2026 MF cycle: BLOCKED * (was PLANNED): the owner's Regular and SIF re-exports as on 31-Oct have not arrived.
- TASK-023 (13 JioBlackRock records) PLANNED *; TASK-024 (8 renames) PLANNED *; both were BLOCKED; D94 and D96.
- TASK-078 ask the MF dashboard team: NOT STARTED (owner; UNKNOWN whether sent).
- BLOCKED: TASK-025, 027, 029, 035, 038, 051, 053 (section 2).

##### OPS/NB (both)
- TASK-067 `si` bound in the MF bake: PLANNED * (was NOT STARTED; D94, INFERRED that the click covers the bake limit).
- TASK-082 PMS and AIF performance from the Reckoner (D95), TASK-083 GIFT City products from the offshore deck (D90),
  TASK-084 one Bond List (D90), TASK-085 Direct Equity returns from a public price source (D89): NEW, PLANNED, P1.
- BLOCKED: TASK-028, 031.

##### GOV (governance)
- Done: TASK-007, 015, 016 (VERIFIED COMPLETE; TASK-016 unchanged and re-verified: PR #30 merge `32172f5` on origin/main);
  TASK-018 VERIFIED COMPLETE * (PR #35, `ddd0304`; evidence: TASK_REGISTER section 7).
- TASK-079 MOD-02 -> MOD-03 handover package: IN PROGRESS (NEW). TASK-080 MOD-03 validates it: PLANNED (NEW).
  TASK-081 register sweep: PLANNED (NEW).
- PLANNED: TASK-071, 074 (D-number base corrected to D97 *), 077. BLOCKED: TASK-032, 033, 036, 037, 075.
- NOT STARTED: TASK-054, 056, 059, 060, 061, 062 (notes updated *), 070, 072; UNKNOWN: TASK-063.

##### 4.1 Every IN PROGRESS task, and where work sits that is not marked IN PROGRESS

| Task | Status | Where the work is | Label |
|---|---|---|---|
| TASK-079 handover MOD-02 -> MOD-03 | IN PROGRESS | the package is written by MOD-02 (this fact-gathering is part of it). At the time of the check (07:11Z) the handover branch `handover/mod-02-to-mod-03-20261117` did not exist yet (`git branch --list 'handover/mod-02*'` empty; `git ls-remote --heads origin 'handover/*'` listed only the MOD-01 one); it was made afterwards (section 12); PR and merge: see the pull request | VERIFIED (absence); the package location UNKNOWN |
| TASK-020 | BLOCKED | OPS-01: worktree `.claude/worktrees/adoring-boyd-7028f6`, branch `data/2026-09-4` at `ddd0304`, 0 commits, not on origin (VERIFIED `git ls-remote`), tree clean; the dry-run outputs and the two reports are local-only files in `monthly-updates/2026-09_Sep-2026/_review/` and `monthly-updates/2026-10_Oct-2026/_review/`. A second branch `claude/ops-01-reckoner-a11e94` (also `ddd0304`, not on origin) is INFERRED to be the app's session branch for OPS-01. Session `local_ab19558f` and its idleness are INFERRED from MOD-02's notes | VERIFIED (git); INFERRED (session) |
| TASK-021 | BLOCKED | the same OPS-01 worktree (read-only preparation only: NAV-date tests, a rename dry run on the wrong input, a bake dry run that exited 2) | VERIFIED |
| TASK-064 | IMPLEMENTED NOT FULLY VERIFIED | local-only: `_testdata/acceptance-2026-11/` (report, 81 entries, scripts); EX-01 session `local_4a9736cd`, shared main checkout, no branch, no commit | VERIFIED (files); session state INFERRED |
| TASK-018 | VERIFIED COMPLETE | merged; the worktree `.claude/worktrees/focused-wright-d50bee` (branch `docs/gov-01-rule-consistency-20261102` at `29e0d32`, merged) and the app branch `claude/affectionate-lovelace-f11b67` (at `c0fb2dd`, 0 commits) remain; GOV-01 session `local_622b2ebd` idle (INFERRED) | VERIFIED (git) |
| OPS-01 claim | not a task | an unpushed local draft of an ACTIVE_CHANGE_REGISTER / CHAT_REGISTRY record (it assumes a routine refresh: redo as High risk if any pin, `add_reckoner_funds.js`, `--accept-drops` or universe change is approved). VERIFIED: origin/main has no OPS-01 row in either register (the registry lists OPS-01 only as an unused next-free id) | VERIFIED (absence) |

#### 4.2 Blocked, and by what

| Task | Blocked by | Label |
|---|---|---|
| TASK-020 | owner decisions on the step 14 and 15 gate output (below); DEC-OPEN-11 (four desk labels: C4, C5, C6, C38); DESK-03 (Fund Manager Data) and DESK-04 (PMS & AIF Analytics) are not in the folders; DESK-01 (vendor PMS file) is no longer expected: D95 | VERIFIED (reports, listings) |
| TASK-021 | owner action: Regular and SIF monitors as on 31-Oct-2026 (D91); the October folder has no `Analytics/` folder (bake exit 2); before the bake TASK-067, TASK-023, TASK-024; step 10 only: TASK-022, the FINAL pack (TASK-078), DEC-OPEN-33 | VERIFIED |
| TASK-025 | DEC-OPEN-04 (open) and the first Reckoner-fed PMS update (TASK-082, D95) | VERIFIED |
| TASK-026 | DEC-OPEN-15; DESK-06 | per register |
| TASK-027 | DEC-OPEN-09 (bond 3Y/5Y top of band or average) | per register |
| TASK-028 | DEC-OPEN-10 (4 side-pocket records) | per register |
| TASK-029 | DEC-OPEN-11; DESK-11, -12, -13 | per register |
| TASK-030 | DEC-OPEN-12; DESK-14 | per register |
| TASK-031 | DEC-OPEN-16 (owner, desk) | per register |
| TASK-032 | DEC-OPEN-05 (owner + compliance) | per register |
| TASK-033 | DEC-OPEN-13 (the outgoing owner's actions) | per register |
| TASK-035 | DEC-OPEN-06 | per register |
| TASK-036 | DEC-OPEN-17; only on the owner's explicit instruction | per register |
| TASK-037 | DEC-OPEN-19; TASK-071 | per register |
| TASK-038 | DEC-OPEN-21; DESK-10 | per register |
| TASK-051 | DEC-OPEN-20 | per register |
| TASK-052 | DESK-22 | per register |
| TASK-053, TASK-057 | TASK-022 and one verified month on the pack route | per register |
| TASK-065 | DEC-OPEN-27 | per register |
| TASK-073 | DEC-OPEN-26; the outgoing owner | per register |
| TASK-075 | DEC-OPEN-29 | per register |

Also waiting (not BLOCKED): TASK-019 and TASK-078 (owner actions, UNKNOWN whether done), TASK-034 (owner sign-off,
DEC-OPEN-14, -24, TASK-033).

Gate output TASK-020 needs the owner (or the desk) to settle (OPS-01, 9-Nov-2026; local reports; not re-run):
1. Step 14 gate "dropped vs NO MASTER MATCH": 5 Select AIFs drop under "EQUITY AIFs- Listed Equities" where 3 deck names match
   nothing (Motilal Oswal Founders Fund Series VII, Alchemy Long Term Ventures Fund 3, Aionios Alpha Fund I). Never waived:
   a pin (owner, D75), `add_reckoner_funds.js` (a universe change) or `NO_MASTER_NOTE`. Two look like respellings of existing records (the live Select entries already carry "Series VII" and "Series 3"; the desk must confirm); Aionios is new; three MASTER AIFs are absent from the deck.
2. Step 14 gate "drops within 8 (5%)": 12 dropped (5 AIFs, 5 gold ETFs replaced by 3 gold ETF funds of funds, 2 diversified equity);
   waivable only by the owner with `--accept-drops 12`.
3. Step 14a: 5 deck names without a MASTER record (the 3 AIFs, Sundaram SISOP, Equinova Edge PMS): universe change, owner.
4. Step 15 gate "MASTER AIF funds with performance": 12 -> 7 (FAIL); no override flag exists for it (VERIFIED in `tools/merge_aif_performance.js`: its flags are `--apply`, `--html` and `--allow-layout-change`).
5. DEC-OPEN-11 labels, before 14 and 14a.

#### 4.3 The October cycle as ordered waves

MOD-02's dates (messages of 9-Nov-2026 12:03 and 12:21 UTC: waves Wed 11-Nov, Fri 13-Nov, 17-18 Nov, 23-25 Nov, risk table
20-25 Nov at the earliest, then restated for the weekly usage limit) are OVERTAKEN: as of 17-Nov nothing from the owner's
list has been applied (VERIFIED: no data PR after PR #36; `verify_page` still shows the 30-Sep data and the 31st August
PMS label). MOD-03 must restate dates; none is given here (UNKNOWN).

| Wave | Tasks | Needs | Status 17-Nov |
|---|---|---|---|
| 0 Gates (DONE) | TASK-018 (PR #35), TASK-017 (pass), records D87 and D88 (PR #34), D89 to D96 and DEC-OPEN-07, -08, -30, -31, -32 (PR #36) | - | VERIFIED COMPLETE / merged |
| 0b Before any apply | TASK-079 merge, TASK-080, TASK-081 (docs); the OPS-01 claim (a row on `origin/main`: a claim is in force only then); a contract and a Guardian pre-check for every High-risk item below | the owner's start of MOD-03 | PLANNED / IN PROGRESS |
| 1 Reckoner products (was due 11-Nov) | TASK-020 steps 14, 14a, 15, 17 (Select, new Reckoner funds, AIF performance); desk labels DEC-OPEN-11 (TASK-019, TASK-029) | owner decisions on the 5 gate items above; claim; High risk if any pin or universe change | BLOCKED |
| 2 MF cycle as on 31-Oct (was due 13-Nov) | TASK-067 and TASK-023 first (D94), TASK-024 at step 1 (D96), then TASK-021 steps 1 to 4, 8 (Regular, Direct, SIF; label "31st October 2026", NAV date 30-Oct-2026, D91), steps 5 to 7 and 9 only if their files arrive (absent inputs are not a stop, D61); Moderator-run Gate B (HIGH risk: applied owner decisions D94 and D96) | the owner's Regular and SIF re-exports; an `Analytics/` folder in the Oct folder; backups of the six files to the main checkout's `backups/` before any apply; claim for all six deploy files | BLOCKED |
| 3 Products and PMS (was 17-18 Nov) | TASK-082 (PMS and AIF performance from the Reckoner), TASK-084 (one Bond List), TASK-083 (GIFT City): three new tools, each a 12-field contract, Guardian pre-check, diff review; they write the page and the June / IRR siblings, so sequence them and never merge a tool change while a refresh holds the deploy set | owner answers: YTM -> range and "exactly similar" (D90), new GIFT City ranges | PLANNED |
| 4 Direct Equity (was 23-25 Nov) | TASK-085 (public price source, owner's calculator as the reference; as on the same NAV date as the funds) | a sample check against the owner's calculator; the source's terms of use | PLANNED |
| Later: risk table | TASK-022 (bridge), then step 10 of an October or November cycle; TASK-078 asks; DEC-OPEN-33 at run time; the owner's approval of the list of funds that lose ratios (D93) | the FINAL 15-Oct pack or a later one (UNKNOWN); about 6 working days (INFERRED) | PLANNED |

Single-writer facts that order the waves (FILE_OWNERSHIP_AND_CHANGE_CONTROL section 3, read): the refresh owns all six deploy
files from the backup to the merge; each sibling and `tools/lib/` file has one writer; `tools/merge_risk_matrix.js` is shared
by TASK-022 and TASK-066. TASK-020 and TASK-021 therefore run one after the other (or as one run), not in parallel.

#### 4.4 The owner's October instructions of 9-Nov-2026 (07:19 UTC message, items 1 to 8) mapped to tasks

The wording is from the transcript of the MOD-02 chat (read for this record); the answers of 08:07 and 09:06 UTC are D89 to D91.

| # | The owner's item | Task(s) | Status | Blocked by | Decisions |
|---|---|---|---|---|---|
| 1 | update the products from the Monthly Investment Reckoner | TASK-020 (steps 14, 14a, 15) | BLOCKED | the gate items in section 2 | D54, D55, D56, D71, D75, D90 ("existing ones stay, additional ones added") |
| 1 | and the GIFT City products from the offshore options deck | TASK-083 (new) | PLANNED | the range of any new product (owner); no tool reads the deck (VERIFIED) | D90, D24, D1 |
| 1 | (later reply) the bond file in a new layout, merged into one Bond List | TASK-084 (new) | PLANNED | how a YTM becomes the range; "exactly similar" undefined; DEC-OPEN-09 for 3Y/5Y | D90 (reading INFERRED) |
| 2 | MF performance, Direct and Regular, and SIF Regular, as on the last working day, noted "as on 31st October" | TASK-021 (+ TASK-067, TASK-023, TASK-024) | BLOCKED | the Regular and SIF re-exports (the 2-Nov files carry 2-Nov NAVs: MTD equals 1 Day on 2,296 of 2,505 rows; the 29-Oct ones carry 29-Oct); the Direct file is usable (NAV 30-Oct-2026: 91.4% of 1,376 same-scheme triples) | D91, D94, D96, D80, D81, D61, D87, D88 |
| 3 | PMS and AIF performance from the Monthly Investment Reckoner | AIF: TASK-020 step 15; PMS: TASK-082 (new) | BLOCKED (AIF); PLANNED (PMS) | AIF coverage gate 12 -> 7; no PMS-from-deck tool | D95 (D54 and D75 stay Active until the tool exists); DEC-OPEN-04 open; TASK-025 folded |
| 4 | analytics as on 30-Sep: update them | no task needed | already live (`DATA_DATES.analytics` = "30th September 2026", VERIFIED); the owner's three files were byte-identical duplicates of those in the Sep folder (manifest) | the Oct bake needs the three workbooks in the Oct folder's `Analytics/` (bake dry run exit 2) and a label for them: `bake_month.js` takes `--as-on-analytics` (VERIFIED in its usage line); the exact procedure is MOD-03's (INFERRED plan: reuse the Sep files) | none new; B4 and C8 (SIF look-through from Aug) unchanged |
| 5 | move all the files to their correct folders | done by OPS-01 on 9-Nov-2026 | DONE (VERIFIED: the inbox holds only its README; the Oct and Sep folders hold the files; manifest is local-only) | - | D61 (absent inputs) |
| 6 | "let me know anything else needed" | answered in MOD-02's messages of 9-Nov | still owed by the owner: the Regular and SIF re-exports, the four desk labels (DEC-OPEN-11), the YTM -> range rule | - | - |
| 7 | risk data from the Screener's pack | TASK-022 (+ TASK-078 asks) | PLANNED | build not started; final pack and the dashboard team's answers UNKNOWN; DEC-OPEN-33 at run time; the owner's approval of the lost-ratio list | D86, D92, D93, note on D86 (DEC-OPEN-32: yes); D84 (Rf 4.5%) |
| 8 | Direct Equity returns by an internal logic based on the owner's calculator, as on the same date as the funds | TASK-085 (new) | PLANNED | build not started; the calculator cannot be run by a tool (D89) | D89, D91, D36, D61 |

### 5. Chats

Snapshot of `docs/project-control/CHAT_REGISTRY.md` after this handover's edits (VERIFIED: `list_sessions` and `get_session`, `git worktree list`, `git ls-remote`, 17-Nov-2026). Session ids are the first 8 characters.

| ID | Status | Session | Worktree and branch | Blocker, state, pending owner decisions |
|---|---|---|---|---|
| MOD-02 | HANDOVER REQUIRED | `cecc2f4c` | main checkout, `main` = `origin/main` = `b47069b`, clean | does only the handover; no new task. Becomes RETIRED when MOD-03 has validated this document |
| MOD-03 | QUEUED | not created | main checkout (when it starts) | the owner starts it (section 13); all open tasks pass to it |
| OPS-01 | BLOCKED | `ab19558f` | `.claude/worktrees/adoring-boyd-7028f6`, local branch `data/2026-09-4` at `ddd0304` (0 commits, not on origin); the app's branch `claude/ops-01-reckoner-a11e94` also at `ddd0304`; clean | TASK-020 (steps 14, 14a, 15, 17) stopped at gates on 9-Nov-2026 and waits for DEC-OPEN-36 and DEC-OPEN-11; TASK-021 waits for the re-exports; its last turn ended 9-Nov-2026 21:49 UTC with the weekly-limit error; model Fable; no claim (the draft is local); its worktree lacks the PR #36 files: `git fetch origin` and merge `origin/main` first |
| GOV-01 | COMPLETED | `622b2ebd` | `.claude/worktrees/focused-wright-d50bee`, branch `docs/gov-01-rule-consistency-20261102` at `29e0d32` (merged), clean | TASK-018 merged as PR #35 (`ddd0304`, 9-Nov-2026 12:16 UTC); idle; not archived |
| EX-01 | COMPLETED | `4a9736cd` | shared main checkout, no branch, no commit | TASK-064 pass done 2-Nov-2026 (11 of 11 checks PASS); the report is local only; this PR records its four findings as KNOWN_ISSUES C47 to C50 (mapping INFERRED); the update-log file is still to be written (TASK-081) |
| ARC-01 | ACTIVE (subagent, not a chat) | none | read-only | reviews on request; last: DIFF and DELTA REVIEW of TASK-018, 9-Nov-2026, GO WITH CONDITIONS, conditions met |
| NB-01, NB-02, NB-03 | COMPLETED (archived) | `d2d575b3`, `1f914af1`, `00b57be9` | their worktrees are reused by OPS-01 and GOV-01 | none |

External (the Portfolio Review Dashboard project: never touched, metadata only): EXT-PR-01 to EXT-PR-05, five sessions in the same app, one running on 17-Nov-2026; next free label EXT-PR-06. Next free chat ids: EX-02, NB-04, OPS-02, GOV-02, ARC-02, MOD-04.

### 6. File ownership and integration

- **Claims.** `ACTIVE_CHANGE_REGISTER.md` held one row, TASK-018 (GOV-01): RELEASED at the merge of PR #35. OPS-01 never held a claim (a claim is in force only when its row is on `origin/main`). No claim is active, kept or transferred (VERIFIED: `gh pr list --state open` is empty; no unmerged branch).
- **Last verified baseline.** `b47069b` (PR #36), site state S7 (`site/`, `tools/`, `.github/` and the package files unchanged since PR #26, `5d39821`); `INTEGRATION_AND_REGRESSION_LOG.md` named `32172f5` until this PR. CI 74 of 74 runs green; push run 44032631708 verify and publish success; the 7 live files equal `site/`; `verify_page` and `npm test` as in section 3.
- **Incidents.** Open: INC-13 (C24), INC-14 (B1), INC-15 (R8, owner and compliance); INC-16 (R6) is resolved by the new INC-20 (the 9-Nov-2026 OneDrive path-length stall); INC-17 and INC-19 are observations. Next free: INC-21.
- **Guardian findings not resolved.** `.claude/agents/qa-verifier.md` line 24 says "all six" where the live check covers seven files (Material: contract and Guardian pre-check first; TASK-081); the PR-number placeholders in `CHANGELOG.md` and `docs/PROJECT_STATE.md` and the missing Gate records of PRs #31 to #36 are fixed by this PR; the 60 P3 audit findings of TASK-016 are TASK-077. No BLOCKER or MAJOR finding is open.

### 7. Owner decisions and messages

#### 7.1 Open decisions (DEC-OPEN), as of 17-Nov-2026

On `origin/main` the register has DEC-OPEN-01 to DEC-OPEN-34: 9 answered (DEC-OPEN-01 D86, -02 D84, -03 D85, -07 D94, -08 D96, -30 D92, -31 D93, -32 note on D86, -34 D87; VERIFIED, `DECISION_LOG.md` section 1.6) and 25 open. With the two entries drafted below (DEC-OPEN-35, DEC-OPEN-36): 36 entries, 9 answered, 27 open, next free DEC-OPEN-37. "Asked" is the date and chat in the entry's own header; every entry except 35 and 36 is unanswered since then (VERIFIED: it is still in section 1.4).

| ID | Decision (short) | Asked or raised | Needed by (as of 17-Nov-2026) | Why it matters (one line) | Blocks |
|---|---|---|---|---|---|
| 35 | Approval gate before publishing (NEW, drafted here) | 17-Nov-2026, MOD-02 | before the next merge that changes `site/` | the owner's prompt of 17-Nov-2026 and D61, D87, D88 disagree on who says yes before a publish | every publish of the October update; OPS-01's merge rule |
| 36 | October Reckoner run: Select list and AIF gates (NEW, drafted here) | 17-Nov-2026, MOD-02 | now (OPS-01 stopped on 9-Nov-2026) | Select badges and AIF performance cannot be refreshed until pins, additions, drops and removals are decided | TASK-020 steps 14, 14a, 15 (OPS-01's Run A) |
| 11 | Deck labels and AMCs (C4, C5, C6, C38) | 19-Oct and 27-Oct-2026, MOD-01 | before steps 14 and 14a (now) | wrong labels reach the deck's fund-house charts and the Select badge; the desk must answer | TASK-029; the Reckoner run |
| 33 | Use the PROVISIONAL October pack if the final is late | raised 2-Nov-2026; asked 9-Nov-2026 09:06 UTC | about 11-Nov-2026 (passed unanswered); ask when the bridge nears step 10 | whether the Portfolio Matrix refresh waits for the final pack | October step 10 (TASK-021); TASK-022 |
| 04 | PMS date label (31-Jul data under "31st August 2026") | 27-Oct-2026, MOD-01 | with the first Reckoner-fed PMS update (note on D95); register says before TASK-020 | a client-facing date is wrong (B1) | TASK-025 |
| 09 | Bond 3Y/5Y: band top or band average | 27-Oct-2026, MOD-01 | before the Bond List tool contract (wave 3; INFERRED) | changes client-facing bond returns; D90's open yield-to-range question sits next to it | TASK-027 |
| 26 | Request the outgoing owner's chat export | 23-Oct-2026 (export ingestion) | time-sensitive: the offer may lapse | undocumented history may be lost | TASK-073 |
| 25 | One Moderator for both projects, or one each | 28-Oct-2026 | none; timely now that MOD-03 starts | decides which chat the owner talks to | `CHAT_REGISTRY.md` |
| 13 | Outgoing owner's public repository and old site (R1) | R1 opened 16-Oct-2026; re-checked 28-Oct | none | the old repository still holds the unredacted client file | TASK-033 |
| 24 | What "full testing" means | 16-Oct-2026 condition; MOD-01 advice 21-Oct | before DEC-OPEN-14 | the owner's condition for deleting the old site; EX-01 ran the `TESTING.md` section 3 checks on 2-Nov-2026 (all PASS; report local, not yet in the repository) | TASK-034, DEC-OPEN-14 |
| 14 | When and how the old site is retired | 16-Oct and 21-Oct-2026, MOD-01 | after DEC-OPEN-24 | two copies drift; old links show old data | TASK-034 |
| 29 | What public documents may say about the old repository; staff details | 2-Nov-2026, MOD-02 | after DEC-OPEN-13 | our documents point readers at the old repository and the client-data file | TASK-075 |
| 05 | Two client items in the outgoing owner's export | 27-Oct-2026, MOD-01 | none | client data sits in a git-ignored local folder; only the owner may delete it | TASK-032 |
| 10 | Four segregated side-pocket records | 27-Oct-2026, MOD-01 | none | an empty record can be picked into a proposal | TASK-028 |
| 06 | File the true 30-Apr Monitor | 27-Oct-2026, MOD-01 | none | archive accuracy only | TASK-035 |
| 12 | Select popover alpha unit and undated ratios | 21-Oct-2026, MOD-01 | none | the popover shows alpha multiplied by 100 and May-2026 ratios | TASK-030 |
| 15 | One rule for the headline expected return | 21-Oct-2026 14:00 UTC, MOD-01 | none | one proposal shows two different expected returns | TASK-026 |
| 16 | How the data records expected returns | 22-Oct-2026, NB-03 | none | screen and Excel show expected figures like track record | TASK-031 |
| 17 | Branch protection on `main` | 16-Oct-2026, MOD-01 | none | the "verify first" rule is a habit, not enforced; every merge publishes | TASK-036 |
| 18 | Keep the repository and site public long-term | `PROJECT_STATE.md` next steps (no date) | none | D60 was taken for the transfer; product data is world-readable | none |
| 19 | Git repository inside OneDrive, or outside | 16-Oct and 19-Oct-2026, MOD-01 | none | R6 hazard; the 9-Nov path-length stall was fixed by shortening folders (INFERRED from the MOD-02 memory note), the hazard stays | TASK-037 |
| 20 | Two Hang Seng ETFs; 27 ageing debt records | KNOWN_ISSUES C21 (19-Oct-2026) | none | misfiled ETFs and stale statistics | TASK-051 |
| 21 | Closing-slides source deck and Disclaimer layout | 22-Oct-2026, NB-03 | none | unbalanced Disclaimer slide; no filed source deck | TASK-038 |
| 22 | Repository hygiene and the merged-branch rule | 28-Oct-2026 fact sheets | none | clutter; the stash must not be applied by mistake | TASK-059 to TASK-062 |
| 23 | Fund-specific pages in the deck | 22-Oct-2026, NB-03 | none | a product choice | a new task if yes |
| 27 | Source of the PMS/AIF benchmark rows | 28-Oct-2026 | none | benchmark rows read a block no tool updates (last changed 20-May-2026) | TASK-065 |
| 28 | Which dashboard "the portfolio dashboard" meant | 21-Oct-2026 14:00 UTC, MOD-01; no reply | none | confirms REQ-054 | none |

##### 7.1.1 Order to ask them in (INFERRED proposal; the register's own order is in `DECISION_LOG.md` section 1.2)

The rows above are already in this order. One decision at a time, plain words, the ID quoted (bootstrap prompt section 3).

1. DEC-OPEN-35 first. It decides who says yes before every later publish, including the October waves.
2. DEC-OPEN-36, one question at a time in the order a, c, d, b, together with DEC-OPEN-11 (the same run needs it before steps 14 and 14a) and with the two owner items the run also needs (the re-exports of the Regular and SIF monitors and the Bond file yield question: N1 and N2 in 7.2, Q4 and Q7 in 7.3, O1 and O2 in 7.5).
3. DEC-OPEN-33 only when the pack bridge nears step 10 (the date has passed; the October matrix keeps "30 Sep 2026" meanwhile: D92, D93). DEC-OPEN-04 and DEC-OPEN-09 before waves 3 and 4 (PMS from the Reckoner, the Bond list).
4. DEC-OPEN-26 (time-sensitive), then DEC-OPEN-25 (MOD-03 starts), then DEC-OPEN-13, -24, -14 and -29 together (the old site and the public documents).
5. DEC-OPEN-05 and -10 (compliance and data housekeeping).
6. The rest as time allows (06, 12, 15 to 23, 27, 28).

Suggested one-line questions and buttons for the first asks (the app limit is 100 characters for the question; wording is mine, INFERRED):

| Ask | Question | Buttons |
|---|---|---|
| 35 | Should every publish that changes the dashboard wait for your explicit yes? | "Yes, wait for my yes" / "Keep automatic refreshes" (option c typed) |
| 36a | Are the two October AIF names (Series VII, Fund 3) the same funds as ours? | "Yes, pin them" / "Ask the desk first" (new series typed) |
| 36c | May I add Aionios Alpha Fund I, Sundaram SISOP and Equinova Edge PMS to the list? | "Yes, add them" / "Not now" |
| 36d | Are the removals from Centricity Select the desk's own decision? | "Yes, accept the deck" / "Ask the desk first" |
| 36b | Accept the final drops (n funds) after reading the list? | "Yes, accept n" / "Hold the Select refresh" |

#### 7.2 Decisions that exist in chat or in local reports but not in the register (candidates; NOT drafted)

None of these is a DEC-OPEN today. MOD-03 should open each as the next free entry (DEC-OPEN-37 onward) when it is about to put it to the owner.

| # | Candidate | Source | Status |
|---|---|---|---|
| N1 | How the single yield (YTM) of the new Bond Options file becomes the expected-return range of the one combined Bond List (D90 leaves it open); the owner answered only "Merge the two list together as just one Bond List" | the owner's reply of 9-Nov-2026 09:06 UTC; D90 Consequences; MOD-02's text of 9-Nov-2026 12:21 UTC ("Three things I need from you") | asked twice, unanswered. Adjacent to DEC-OPEN-09. |
| N2 | Which Regular and SIF files the October cycle uses. The owner said on 9-Nov-2026 09:06 UTC to treat the 2-Nov files as 30-Oct NAVs and "Use these files"; the evidence says they carry 2-Nov NAVs (below). D91 says a refresh whose inputs carry different NAV dates stops and asks the owner | owner message of 9-Nov-2026 09:06 UTC; OPS-01 report `prepB_report_2026-11-09.md` (local) | OPEN CONFLICT with a direct owner instruction. Evidence (VERIFIED from OPS-01's report): MTD equals 1 Day on 2,296 of 2,505 rows of the 2-Nov Regular file (92%), on 2 of 2,480 rows of the 29-Oct file and on 1 of 2,140 rows of the Direct file; the 30-Oct return implied by the two Regular files equals the Direct file's 1 Day for 512 of 520 matched schemes within 0.15 pp. The owner has not been shown this evidence in a question that was answered. |
| N3 | Net Asset Allocation counts every "Global Funds" record as equity (including a GIFT City G-Sec feeder) and REIT/InvIT as "Equity - direct" | EX-01's report, finding EX01-N3, "needs an owner rule" (local; the report is not on `origin/main`) | not asked. Recorded by this PR as KNOWN_ISSUES C49 (the mapping EX01-N1 to N4 -> C47 to C50 is INFERRED). |
| N4 | Whether the other parts of the 17-Nov-2026 prompt apply here: Stage 0 exact reconstruction, a roadmap of phases and sprints approved before new development, a numbered-chat system | the owner's prompt, sections 6, 7 and 11 | stated as "not covered" in DEC-OPEN-35; not asked. |
| N5 | Phasing the October update in four waves. Asked on 9-Nov-2026 07:27 UTC ("Shall I publish the fund, SIF and Reckoner update first, and add the rest later?"); no answer recorded; MOD-02 planned and briefed OPS-01 on the phased plan | assistant question list; the ETA table of 9-Nov-2026 12:03 UTC; OPS-01's launch packet | INFERRED: the owner did not object; an explicit yes was never given. Under the 17-Nov prompt a roadmap needs the owner's approval. |
| N6 | The owner's confirmation of MOD-02's wording of D84 to D96 (all 13 entries say the owner confirms it; D87 and D88 add "MOD-02 plans to ask at TASK-018's Gate E") | `docs/DECISIONS.md` D84 to D96 | not asked (VERIFIED: none of the 27 wrap-up questions asks it). |
| N7 | EX-01: "REQ-071 can move ... once the owner is content with the two caveats (checks 2 and 11)" | EX-01's report, section 6 (local) | not asked (UNKNOWN whether MOD-02 raised it outside the wrap-up questions). |

Candidates for `DECISION_LOG.md` section 2.2 (owner decisions made in chat, not yet a D-number; not edited by me): 9-Nov-2026 07:44 UTC "Yes, do it" (MOD-02 may start OneDrive and set the folder to "Always keep on this device"); 9-Nov-2026 09:06 UTC "Shorten the file path name for OneDrive Access" (done on 9-Nov-2026 per the MOD-02 memory note: INFERRED); 9-Nov-2026 12:30 UTC "Yes, use Fable" (the October chats run on the Fable model; applied to OPS-01 at its start: VERIFIED in the transcript, `claude-fable-5-1`).

#### 7.3 Questions put to the owner and not answered

Source: the 35 `wrap_up` calls in the MOD-02 transcript (27 carry a question, in 20 distinct wordings; the others are recaps only), matched against the owner's 21 messages (VERIFIED from the mined files `assistant_questions.json` and `owner_view.txt`). Answered questions are not listed (all others got a click or a typed answer, including the repeated asks of 2-Nov-2026, which were answered later: DEC-OPEN-01 by typed text on 2-Nov 14:19 UTC; the Sortino question on 2-Nov 16:05 and 21:30 UTC by the 9-Nov 08:43 UTC click, D92).

| # | UTC time | Wording | Options offered | State |
|---|---|---|---|---|
| Q1 | 9-Nov-2026 06:51:14 | "Shall I carry on with the current document work while you gather the files?" | "Yes, carry on" / "Pause everything" | no click recorded; overtaken by the owner's task list at 07:19:11 UTC (INFERRED); closed in practice |
| Q2 | 9-Nov-2026 07:27:13 | "Shall I publish the fund, SIF and Reckoner update first, and add the rest later?" | "Yes, phase it" / "No, all together" | UNANSWERED (see N5) |
| Q3 | 9-Nov-2026 09:06:04 | "If the final data pack is late, may I ask you about using the provisional one?" | "Yes, ask me then" / "No, wait for final" | UNANSWERED (DEC-OPEN-33) |
| Q4 | 9-Nov-2026 09:36:32 | "Can you re-export the Regular and SIF monitors as on 31-Oct-2026?" | "Yes, re-exporting now" / "Let me check first" | UNANSWERED. The owner's earlier instruction (09:06:17 UTC) was "They have 30th October NAV and treat them as such. Use these files" (see N2) |
| Q5 | 9-Nov-2026 12:03:47 | "Can the Regular and SIF re-exports reach me by Tuesday midday?" | "Yes, by midday" / "Later on Tuesday" | UNANSWERED; Tuesday was 10-Nov-2026; the files have not arrived (VERIFIED: `ls` of the October folder on 17-Nov-2026 shows only the Direct monitor, the Bond Options file, the Offshore deck, `_review`, `_superseded`) |
| Q6 | 9-Nov-2026 12:03:56 (text, not a button) | send the desk request for the four labels (DEC-OPEN-11) "tomorrow morning, or tell me to" | none | UNANSWERED |
| Q7 | 9-Nov-2026 12:21:40 (text, not a button) | "Three things I need from you": the re-exports; the four desk labels; "Bond file: how its single yield (YTM) should become the expected-return range" | none | UNANSWERED |

Not yet asked (so not "unanswered"): N3, N4, N6, N7 above; DEC-OPEN-35 and DEC-OPEN-36 (drafted here).

Also owed to the owner (D87 Gate E text): the Moderator's report listing the changes it accepted on evidence, "in its next report to the owner after each merge". PRs #34, #35 and #36 are the merges since D87. UNKNOWN whether such a list was delivered: the 9-Nov-2026 12:21 UTC message reports PR #35 only.

#### 7.4 Messages waiting to be relayed to a chat or a person (recipient, text, sent or not)

VERIFIED (transcript scan): the MOD-02 transcript holds 14 `SendMessage` calls. 12 went to GOV-01 (its session 622b2ebd; the first two carry the same text, once by name and once by id) and 2 to review subagents (one security review, one Guardian review). None went to OPS-01 (session ab19558f) or EX-01 (session 4a9736cd). Only 3 chats were started: GOV-01, EX-01, OPS-01 (3 `start_session` calls).

| # | Recipient | Text or content | Sent? | Evidence |
|---|---|---|---|---|
| M1 | OPS-01 | "Claim in force" for Run A, once its claim record is on `origin/main`. No text drafted. | NO | OPS-01's launch packet makes any edit or `--apply` wait for it. VERIFIED: no claim record exists (the TASK-020 row of `ACTIVE_CHANGE_REGISTER.md` is a proposal; `gh pr list --state open` is empty; no local claim branch). A local draft exists (MOD-02's facts; not seen by me). The claim must be redone as High risk if any pin, `add_reckoner_funds`, `--accept-drops` or universe change is approved. |
| M2 | OPS-01 | Reply to its Run A and Prep B reports of 9-Nov-2026 (both steps stopped at their gates). Skeleton in 7.4.1; send after the owner answers DEC-OPEN-35 and DEC-OPEN-36. | NO | VERIFIED: none of the 14 sends. OPS-01's last turn ended 9-Nov-2026 21:49 UTC with the weekly-limit error (facts block); its model was set to `claude-fable-5-1` on 9-Nov-2026 12:32 UTC (VERIFIED in the transcript). |
| M3 | OPS-01 or a new OPS chat | Launch packet for Run B (October MF cycle). Its packet must wait for the young-fund rule (TASK-067, TASK-023) and the owner's re-exports (OPS-01's own packet says so). | NO, not written | VERIFIED: packet text, point 5. |
| M4 | NB chats (not started) | Launch packets carrying the 9-Nov-2026 answers: D89 direct equity returns tool; D90 bond and GIFT City tools; D92 and D93 the pack bridge (TASK-022); D94 TASK-023 and TASK-067; D95 PMS from the Reckoner. The answers are recorded on `origin/main` (PR #36) but no chat has them. | NO, not written | VERIFIED: 3 `start_session` calls only. |
| M5 | The desk (the owner sends) | The DEC-OPEN-11 labels (DESK-11, -12, -13) and the three Run A questions of DEC-OPEN-36 (a, c, d). Draft in 4.2. | NO as far as the record shows (UNKNOWN whether the owner wrote to the desk outside the chat) | MOD-02's offer of 9-Nov-2026 12:03 UTC got no reply. `TASK_REGISTER.md` TASK-019: "no record that any request was sent". |
| M6 | The MF dashboard team (the owner sends) | TASK-078 asks (a) to (i): above all the FINAL 15-Oct-2026 pack (due about 11-Nov-2026) or written confirmation, a textbook Sortino field (D92), the cadence. | NO | TASK-078 is NOT STARTED (VERIFIED, `TASK_REGISTER.md`); no draft found among the transcript's `Write` calls (UNKNOWN whether drafted elsewhere). The Screener's address must stay out of every repository document. |
| M7 | GOV-01 | Nothing waiting. The last message (9-Nov-2026 12:18 UTC) said PR #35 merged, that no more work is needed, and asked for any lessons in one short message. | yes | VERIFIED in the transcript. Its reply: UNKNOWN. Its claim is to be released in the register sweep. |
| M8 | EX-01 | Nothing waiting. Its results are not recorded yet (sweep). | n/a | `docs/update-log/2026-11-02_ex01-browser-acceptance.md` is NOT on `origin/main` (VERIFIED: `git cat-file -e` failed). |
| M9 | ARC-01 (Guardian, a subagent) | No standing message; reviews are run by the Moderator on request. | n/a | CLAUDE.md, facts block. |

##### 7.4.1 Skeleton of the message to OPS-01 (DRAFT, NOT SENT; complete after the owner's answers)

1. `origin/main` is now `b47069b` (PR #36, D89 to D96 recorded, 17-Nov-2026 06:37 UTC). Before anything else: `git fetch origin`, then merge `origin/main` into your branch in your worktree (no pull, no rebase).
2. Your Run A claim is NOT in force. Stay read-only until I send "claim in force". The claim will be High risk (pin, `add_reckoner_funds`, `--accept-drops` or universe change, as the owner decides).
3. The owner's answers to DEC-OPEN-36: (a) ..., (b) ..., (c) ..., (d) ... (quote the words and times). The exact `--accept-drops` count is ... (only if (b1)).
4. The merge rule from DEC-OPEN-35 is ... (your packet point 11 changes if the answer is (b) or (c)).
5. Prep B: the Direct monitor is accepted (30-Oct NAVs, label "31st October 2026": D91). The Regular and SIF re-exports are still pending; re-run the rename dry run on the Regular file when it arrives; the eighth rename pair of D96 is re-checked first.
6. Keep outputs short: the weekly allowance is scarce.

##### 7.4.2 Draft of the desk message (DRAFT written for this fact sheet, NOT SENT; the owner sends it)

Questions on the October 2026 Monthly Investment Reckoner (data as on 30-Sep-2026). Please answer in writing.

1. Is "Motilal Oswal Founders Fund Series VII" the same fund as our "Motilal Oswal Founders Fund", and is "Alchemy Long Term Ventures Fund 3" the same as our "Alchemy Long Term Ventures Fund" (same series, new spelling)? Or are they new series?
2. Karma Capital Jasmine Fund, Kotak Iconic Fund II and ICICI Prudential Alpha Opportunities are not in the October deck. Were they removed from the recommended list on purpose? If not, please send their performance.
3. Please confirm these were replaced on purpose: HDFC Gold ETF, ICICI Pru Gold ETF, Mirae Asset Gold ETF, Nippon India ETF Gold BeES and SBI Gold ETF (now three gold ETF funds of funds: HDFC, Quantum, UTI); 360 ONE Focused Fund and Tata Large & Mid Cap Fund (now Aditya Birla SL Flexi Cap and Invesco India Large & Mid Cap).
4. Aionios Alpha Fund I, Sundaram SISOP and Equinova Edge PMS have no record on our side. If they are to be added, please send the class, sub-category, expected return range and exit load.
5. Labels: is the Motilal Oswal Gift City India Equity Fund (Inbound) the same product as our Motilal Oswal Alternative Investment (Inbound)? Which fund house runs Prism Hybrid Long-Short Fund and Magnum Equity Ex-Top 100 Long-Short SIF, and what are their expected return ranges? Is Mosaic Multiyield Series I retired or closed, and should Series II be added?

#### 7.5 Owner actions only the owner can take

Rule: only the owner contacts the desk, the outgoing owner, compliance and the users; only the owner changes machine settings; only an explicit owner instruction allows repository-settings changes, library upgrades or deletions (bootstrap prompt section 3; CLAUDE.md "Never").

| # | Action | Why only the owner | State (17-Nov-2026) |
|---|---|---|---|
| O1 | Re-export the Regular and SIF monitors as on 31-Oct-2026 (NAVs of Friday 30-Oct) and put them in the October month folder or the inbox; or decide otherwise after seeing the evidence in N2 | the files come from the owner; D91 needs one NAV date | NOT DONE (VERIFIED, folder listing). The 2-Nov files are in `_superseded/wrong_nav_date_2026-11-09/` (VERIFIED). |
| O2 | Answer the Bond file question: how the single yield (YTM) becomes the expected-return range of the combined Bond List | a product rule | NOT DONE (N1) |
| O3 | Send the desk requests: DEC-OPEN-11 (DESK-11, -12, -13) and the Run A questions (draft in 7.4.2); say which DESK requests of `TASK_REGISTER.md` Appendix A were sent before | only the owner contacts the desk | NOT DONE as far as the record shows; TASK-019 UNKNOWN |
| O4 | Send the asks to the MF dashboard team (TASK-078): the final pack, textbook Sortino field, cadence, notice of changes | only the owner contacts them; the Moderator drafts | NOT STARTED |
| O5 | Contact compliance and the outgoing owner where the register says so (DEC-OPEN-05, -13, -26, -29) | only the owner contacts them | NOT DONE |
| O6 | Instruct, or refuse, repository-settings and deletion items: branch protection (DEC-OPEN-17), visibility (-18), moving the clone (-19), branch and stash clean-up (-22), deleting client items (-05) | CLAUDE.md "Never": explicit owner instruction only | open |
| O7 | Keep OneDrive running and the folder set to "Always keep on this device" (the owner said "Yes, do it" on 9-Nov-2026 07:44 UTC; MOD-02 did it); act if it stops again | a machine setting | INFERRED done on 9-Nov-2026 (memory note); the next session must re-check `.git` hydration before any `--apply` |
| O8 | Start MOD-03: open a new chat in the Code tab of the Claude desktop app on the repository folder and paste the successor prompt (`continuations/README.md` section 8, item 10) | the app card or paste is the owner's act | QUEUED (the package is built after the merge: `handover-archive\outgoing_20261117\`) |
| O9 | Give the approvals the rules require: DEC-OPEN-35 (who says yes before a publish); any pin, override flag or universe change (`FILE_OWNERSHIP_AND_CHANGE_CONTROL.md` section 7); the one-time waiver of the coverage check after reading the list of funds that lose ratios (D93); acceptance of client-facing changes (D87); confirmation of MOD-02's wording of D84 to D96 (N6) | decisions are the owner's | open |
| O10 | Watch the account's weekly usage allowance and the model choice | account level | UNKNOWN today (the reading of 9-Nov-2026 was 81% used, reset Friday 13-Nov-2026 06:30 IST); "Yes, use Fable" was clicked 9-Nov-2026 12:30 UTC |
| O11 | Say which other October inputs will come (Equity/Hybrid/Debt analytics, expense ratio, exit load, listed direct equity, fund managers, market outlook); the owner said on 9-Nov-2026 07:19 UTC that the analytics as on 30-Sep were shared | inputs come from the owner | UNKNOWN beyond the Direct monitor, the Bond Options file and the Offshore deck |

#### 7.6 Standing instructions and working preferences of the owner

Quotes are the owner's words, shortened. Times are UTC. VERIFIED = read in the mined MOD-02 transcript (owner_view.txt) or in the cited repository line; "meaning" is mine and INFERRED unless stated.

| When (UTC) | The owner's words | Meaning for the Moderator | Status |
|---|---|---|---|
| 9-Nov-2026 06:48:59 | "Before you start working with anything, explain in detail" | give the owner a written account first: what is being changed, the ETA, what is needed from the owner, ideas to improve | VERIFIED (words); whether it applies to every task: UNCERTAIN. The Moderator answered it on 9-Nov-2026. |
| 9-Nov-2026 06:48:59 | "first and foremost ... the existing dashboard is being updated timely" | keeping the live data current comes before improvements | VERIFIED (words) |
| 9-Nov-2026 07:19:11 | "ease of readability and usability in mind before any task" | clients' readability and usability are a test for every task (the "as on 31st October" label, D91, follows from it) | VERIFIED (words) |
| 9-Nov-2026 07:19:11 | "Move all the files to their respective correct folder and start working" | the Moderator files the inputs; the owner does not sort | VERIFIED (words) |
| 9-Nov-2026 07:19:11 | "Let me know anything else needed from me; any clarity on any point" | ask early, in one list, for what is missing | VERIFIED (words) |
| 9-Nov-2026 07:19:11 | "you can build an internal logic based on that" (direct equity returns) | build internal tools where no input exists (D89 fixes the price source) | VERIFIED (words) |
| 9-Nov-2026 08:07:52 | "Tell me the questions" | put open questions to the owner, plainly (bootstrap prompt section 3) | VERIFIED (words) |
| 9-Nov-2026 08:07:52 | "All the existing products stay; additional ones will be added" | products are not removed because a new file lacks them (D90); relevant to DEC-OPEN-36 (d) | VERIFIED (words); said about the bond file, wider scope UNCERTAIN |
| 9-Nov-2026 09:06:17 | "They have 30th October NAV and treat them as such. Use these files" | an instruction to use the 2-Nov Regular and SIF files as 30-Oct data | NOT FOLLOWED: evidence says 2-Nov NAVs (N2); needs the owner's decision |
| 9-Nov-2026 09:06:17 | "Shorten the file path name for OneDrive Access" | shorten over-long folder names | DONE on 9-Nov-2026 (INFERRED from the memory note) |
| 9-Nov-2026 12:02:08 | "ETA to update the portfolio" | the owner wants dates; four waves were given (12:03 UTC); wave 1 (11-Nov-2026) has slipped, so the ETA must be restated | VERIFIED (words and the ETA table) |
| 9-Nov-2026 12:30:43 | "Yes, use Fable" | the October chats may run on the Fable model | VERIFIED (click); applied to OPS-01 |
| 17-Nov-2026 06:27:07 | "Completeness, accuracy, continuity and preservation of existing work are more important than brevity." | the handover documents must be complete | VERIFIED (prompt section 1) |
| 17-Nov-2026 06:27:07 | "Do not infer approval from silence, lack of feedback or the passage of time." | approval must be explicit | VERIFIED (7.3 step 7); conflicts with D61 for publishing: DEC-OPEN-35 |
| 17-Nov-2026 06:27:07 | "Never overwrite the last approved stable version with unapproved work." | the latest owner-approved version must be identifiable (not recorded today) | VERIFIED (7.3 step 8); DEC-OPEN-35 |
| 17-Nov-2026 06:27:07 | "The next sprint must not begin merely because coding has been completed." | a task is not done until tested, shown, approved, preserved and rolled out | VERIFIED (section 8); part of DEC-OPEN-35 |
| 17-Nov-2026 06:27:07 | "Never claim something is built, tested, approved ... unless the relevant evidence exists." | the same rule as bootstrap prompt section 12 | VERIFIED (section 23) |
| 17-Nov-2026 06:27:07 | "Do not jump directly into new feature development." | data first, features later (Stage 1 before Stage 2) | VERIFIED (17.2); applicability UNCERTAIN (N4) |
| 15-Oct-2026 14:36 | "Stop after establishing the baseline" | stage A before stage B | recorded in `DECISION_LOG.md` section 2.2 as VERIFIED (words); the original message was not re-read by me |
| 16-Oct-2026 13:09 | the old dashboard is deleted only "after full testing has been done on the new build" | the condition for DEC-OPEN-14 and DEC-OPEN-24 | recorded in section 2.2 (same caveat) |
| 16-Oct-2026 | D61: monthly updates publish automatically once every check passes; D60: public repository on free Pages | the standing publish rule and visibility | VERIFIED (`docs/DECISIONS.md` D60, D61, "owner decision"); D61 under question: DEC-OPEN-35 |
| 27-Oct-2026 15:25 (re-issued 28-Oct 05:33) | freeze implementation; a Moderator and Guardian model with registers in files | no project knowledge may live only in a chat | recorded in section 2.2 (same caveat) |
| 16-Oct-2026 (MOD-01 memory note) | the owner does not run commands or git; wants every requested change pushed to GitHub through branch, PR, verify, merge, a neat repository and plain explanations | the Moderator does all technical work and explains in plain language | INFERRED from the MOD-02 memory notes written by MOD-01; the owner's exact words are not available to me |

How the owner answers (VERIFIED pattern): mostly one-click buttons offered in the wrap-up box; sometimes a typed line, or a typed answer inside the Moderator's pasted text (9-Nov-2026 08:07 and 09:06 UTC). A button answer is the owner's decision only for the question as worded; the Moderator's wording of D84 to D96 is its own summary and has not been confirmed (N6).

### 8. Local-only artefacts

State of 17-Nov-2026, 08:03 UTC; the main checkout is at origin/main (merge of PR #36, `b47069b`) with a clean working tree.
Source: the local-artefact inventory made for this handover. Counts and sizes come from `stat`; every file's SHA-256 is kept in a
local-only inventory that is NOT part of the repository. Conventions: `<repo>` is the main checkout; `%USERPROFILE%` is the Windows
profile; `<project>` is the project's folder name under `%USERPROFILE%\.claude\projects\`. No client data is quoted. Labels: VERIFIED
(a command was run or a line was read), INFERRED, UNCERTAIN, UNKNOWN.

Backup vocabulary used in the table. "OneDrive sync" means the folder lies inside the synced Desktop: the OneDrive client was running
(VERIFIED: one process, started 17-Nov-2026 05:04 UTC) and the attribute check found 0 online-only placeholder files in `<repo>\monthly-updates`,
`<repo>\backups`, `<repo>\_testdata`, `<repo>\docs`, `<repo>\site`, `<repo>\tools`, `<repo>\handover-archive` and `<repo>\.git` (VERIFIED);
whether every file has finished uploading is UNKNOWN (the OneDrive status was not read). "None" means no copy in git or OneDrive is known.

| Path | What | Size / count | Backup state | Sensitivity | Needed for |
|---|---|---|---|---|---|
| `<repo>\monthly-updates\2026-10_Oct-2026\` (top level) | The October 2026 refresh inputs received so far: the Direct-plan monitor (input 2; latest NAV 30-Oct-2026, to be labelled "31st October 2026", D91), a bond file in a NEW layout (P1; owner answers pending, D90), the offshore / GIFT City options deck (151 slides per OPS-01's filing note; no tool reads it yet) | 3 files, 94,854,688 bytes | OneDrive sync; no git copy; the SHA-256 prefixes OPS-01 recorded on 9-Nov-2026 equal the hashes computed now (11 of 11 prefixes; VERIFIED) | licensed vendor and desk data; git-ignored; never push | Run B (October MF cycle, `docs/MONTHLY_UPDATE_PROCESS.md` steps 2 to 9); the D90 product update |
| `<repo>\monthly-updates\2026-10_Oct-2026\_superseded\wrong_nav_date_2026-11-09\` | Regular and SIF monitors exported with NAV dates 29-Oct-2026 and 2-Nov-2026; the owner's re-export "as on 31-Oct-2026" has not arrived | 4 files, 1,632,668 bytes | OneDrive sync; no git copy | licensed vendor and desk data; git-ignored | Evidence for the monitor NAV-date finding; not to be fed to a tool without the owner's explicit yes |
| `<repo>\monthly-updates\2026-10_Oct-2026\_review\` and `<repo>\monthly-updates\2026-09_Sep-2026\_review\` (run-A part) | OPS-01's reports of 9-Nov-2026 (nothing applied), its dry-run outputs, the inbox filing manifest, a NAV-date test script, and the Reckoner PDF render | 9 files, 3,033,646 bytes (October 5, September 4) | OneDrive sync; no git copy | internal; names funds and AIFs; local-only, not for the public repository | Restarting OPS-01; the owner's gate decisions on steps 14 and 15 |
| `<repo>\monthly-updates\2026-09_Sep-2026\` (current-cycle part) | The Reckoner deck titled "October 2026" (data as on 30-Sep-2026; input 15) and `Analytics\` (equity, hybrid, debt analytics and the direct-equity universe as on 30-Sep-2026; MOD-02's plan is to reuse them for the October bake: INFERRED) | 5 files, 74,959,481 bytes | OneDrive sync; no git copy; SHA-256 prefixes equal OPS-01's (VERIFIED) | licensed vendor and desk data; git-ignored | Steps 14 and 15 (dry runs STOPPED at gates on 9-Nov); the bake |
| `<repo>\monthly-updates\2026-09_Sep-2026\_superseded\duplicates_of_Analytics_2026-11-09\` | Three duplicate downloads of the September analytics | 3 files, 20,234,611 bytes | OneDrive sync | as above | Nothing: byte-identical to the files in `Analytics\` (VERIFIED by SHA-256); the owner may delete them |
| `<repo>\monthly-updates\2026-03_Mar-2026\` to the rest of `2026-09_Sep-2026\` | Inputs of cycles already applied (month folders; the April folder is the initial-build pack). Their content is live in the page; name, as-on date and SHA-256 are in `docs/update-log/` | 124 files, 447,584,842 bytes | OneDrive sync; no git copy ("the only archive of past inputs", KNOWN_ISSUES R11) | licensed vendor and desk data; git-ignored | Rollback and provenance; only 5 small periodic lists (bond lists, SIF and GIFT City lists, the IRR range file) are the live baseline of the D90 product update (INFERRED) |
| `<repo>\monthly-updates\00_INBOX\` and root files | The inbox holds only the tracked README (VERIFIED by listing, 17-Nov-2026): no other October desk file has been filed. `_handover_manifest.json` is the provenance list of the outgoing owner's export | inbox 1 file; manifest 22,672 bytes | inbox and manifest: OneDrive sync | internal (file names only) | Filing of the next desk files; provenance |
| `<repo>\monthly-updates\` (all of the above) | Whole folder: 8 month folders (March to October 2026) plus `00_INBOX` | 151 files, 642,329,858 bytes (612.6 MiB) | OneDrive sync; no git copy (only the two README files are tracked) | licensed vendor and desk data | Every monthly refresh |
| `<repo>\backups\` | Two pre-refresh snapshots of 19-Oct-2026 (`pre-sep-corrections`, `pre-c19-rebake`): the six-file deploy set plus `robots.txt` each | 15 files, 31,318,532 bytes | OneDrive sync; the published set itself is in git | public content (the published site) | Rollback and baseline comparison |
| `<repo>\_testdata\acceptance-2026-11\` | EX-01 browser acceptance: 30 harness scripts, result files, screenshots, PowerPoint renders, exported decks and workbooks, the EX-01 acceptance report and a draft checklist | 167 files, 37,421,323 bytes | OneDrive sync; no git copy. The EX-01 results are NOT in the repository: no `docs/update-log/` file for EX-01 exists at `b47069b` (VERIFIED by `git ls-tree`); one byte-identical copy of the report sits in the desktop app's side-session notes (VERIFIED by SHA-256) | internal; test portfolios on the public build, no client data expected | Register sweep (C47 to C50, TASK-064 done); reruns of the acceptance pass |
| `<repo>\_testdata\pptx-design-system\` | Sample redesigned deck, montages, before/after images, renders and stress decks of the PowerPoint design system (PR #26, D82) | 42 files, 40,596,013 bytes | OneDrive sync; no git copy | internal; no client data expected in the dashboard's own renders and decks (the sources of the montages and before/after images were read from the NB-03 shell command). One file, `montage_reference.png`, is a montage of the REFERENCE deck that KNOWN_ISSUES R10 treats as a likely client deck: UNCERTAIN, never opened, left out of the package (note 5) | Design reference for the deck |
| `<repo>\handover-archive\` | The outgoing owner's handover export: two zips, an extracted export folder, two documents and three small text notes dated 2-Nov-2026 (INFERRED from their names to be MOD-02 local-only notes; one is probably the local-only note on the data pack that `docs/project-control/DECISION_LOG.md` says is kept local). Only the top-level names, the size and the file count were taken; nothing was opened | 2,736 files, 5,914,014,883 bytes (5.51 GiB) | OneDrive sync; no git copy except its README | CLIENT-RISK: client items inside (KNOWN_ISSUES R8, R1); never open, copy, zip or send | Nothing for the October work; decisions R8 and DEC-OPEN-05 stay with the owner |
| `<repo>\.claude\worktrees\` (3 worktrees) and `%USERPROFILE%\AppData\Local\Temp\cpp-old` | Git worktrees: OPS-01's (branch `data/2026-09-4`: 0 commits of its own and not on origin; VERIFIED by `git rev-list --count` and `git ls-remote`), GOV-01's (branch `docs/gov-01-rule-consistency-20261102`, PR #35 merged), one detached worktree, and a detached worktree in Temp. All four were clean on 17-Nov-2026 (`git status --porcelain`: 0 lines each; VERIFIED) | 953 files, 99,488,944 bytes outside `.git` | None for the working files (they are checkouts); history is on GitHub | public (git) | OPS-01 restart; do not remove with `rm -rf` (CLAUDE.md "Never") |
| `<repo>\.git\` and `<repo>\node_modules\` | The object database and the pinned npm dependencies | `.git` 923 files, 143,562,190 bytes; `node_modules` 246 files, 14,046,446 bytes | History: GitHub (origin). Dependencies: `npm ci` | public | Everything; never copy `.git` |
| `%USERPROFILE%\.claude\projects\<project>\memory\` | The project's auto-memory notes (index plus 11 notes), including a handover-state note MOD-02 wrote on 17-Nov-2026 07:40 UTC | 12 files, 30,087 bytes | None (outside OneDrive and git) | internal; includes the owner's working profile; not for the public repository | MOD-03's operating knowledge (Windows quirks, NAV-date test, hydration state, reviewer hygiene) |
| The desktop app's side-session notes folder for the MOD-02 session (path not recorded in the repository) | Working documents MOD-02 kept outside the repo: GOV-01 / TASK-018 contracts, evidence and PR draft; the MOD-02 to GOV-01 pre-check; EX-01 report copy, draft checklist and progress note; OPS-01's prep and dry-run report. It is the only session folder there | 9 files, 276,061 bytes | None (outside OneDrive and git) | internal; may name funds and paths | History of TASK-018 and EX-01; OPS-01's restart |
| `%USERPROFILE%\.claude\projects\<project>\` (the transcript files, one per chat) and the sibling folders `<id>\subagents`, `\tool-results`, `\workflows` | Chat transcripts: 7628c9ae and df00b5b0 (MOD-01), 56ada2dd (MOD-02, live: it grows while it runs), 86d885cc (EX-01), 1ffe6022 (NB-03, the PowerPoint design-system chat of 22-Oct-2026); and in the two project folders named after the OPS-01 and GOV-01 worktrees: efcf80ca (OPS-01), 4b1e7917 (GOV-01) and two earlier worktree chats, 4dd2f74d and acab20e6 | 9 transcripts, 129,616,719 bytes; sibling folders 1,169 files, 472,739,273 bytes | None (outside OneDrive and git) | internal; may contain client or investor names; never share | Ground truth of what was said; MOD-02's four compactions are VERIFIED from 56ada2dd |
| `%USERPROFILE%\AppData\Local\Temp\claude\<project>\56ada2dd-...\scratchpad\` (with `mod02\`), plus the current scratchpad of this chat | MOD-02's helper scripts, commit messages, PR bodies, mirrors and diffs of 2-3 Nov and 9-Nov-2026. About 30 scripts and drafts are worth keeping; the rest is one-off | older scratchpad 2,626 files, 552,654,604 bytes (of which an extracted data pack 233,464,055 bytes); `mod02` 297 files, 52,410,712 bytes; current scratchpad 178 files, 5,873,318 bytes | None; Windows may clean Temp | internal; scripts embed absolute local paths | Reuse by MOD-03 (advance local main, live parity, commit-range checks, NAV-date tests, OPS-01 claim draft) |
| `%USERPROFILE%\AppData\Local\Temp\x` | A single REGULAR FILE of 28,922 bytes written 2-Nov-2026 16:54 UTC, not the folder with `ref.pptx` and 82 files that KNOWN_ISSUES R10 and R11 describe. Not opened (rule). A name search of `%TEMP%` found no `ref.pptx` and no `pptx_section.js` (VERIFIED, 17-Nov-2026) | 1 file, 28,922 bytes | None | CLIENT-RISK per R10 (the folder it replaces); UNKNOWN what the file holds | Nothing; R10 and R11 must be re-read against this state (owner) |
| `%USERPROFILE%\AppData\Local\Temp\claude\<project>\7628c9ae-...\scratchpad\wt_snapshot` | MOD-01's stash snapshot (KNOWN_ISSUES R11); present (VERIFIED). Not opened | 40 files, 14,744,142 bytes | None; Windows may clean Temp | unknown; may hold unpushed work | Owner decision whether to keep it; the git stash is a separate artefact (never drop it) |
| `%USERPROFILE%\AppData\Local\Temp\claude\<project>\<id>\` for MOD-01 (7628c9ae), its continuation (df00b5b0), NB-03 (1ffe6022) and EX-01 (86d885cc) | Working outputs of those chats. MOD-01's scratchpad holds most of it (review and package working copies; several sub-folders of 0.3 to 0.9 GB each; the stash snapshot above is inside it). Not opened | 4,588 files, 4,252,473,310 bytes (4.25 GB) | None; Windows may clean Temp | internal; content not examined | Nothing for MOD-03; the owner may delete it to free space (their own act) |
| `%USERPROFILE%\OneDrive - <company>\Desktop\Product\Calculators\Stock Price to Return Calculator.xlsx` | The owner's price-to-return calculator; D89 says the new direct-equity returns tool must be checked against a sample of it. It reads prices through Excel's stock data type | 1 file, 753,510 bytes | OneDrive sync | internal (owner workbook) | The direct-equity returns tool (D89), not yet built |
| `%USERPROFILE%\Downloads\pr-datapack_2026-10-15_PROVISIONAL.zip` and `...\pr-datapack-backfill_2026-10-15.zip` | The two MF-dashboard data packs the owner attached on 2-Nov-2026 (D86): zips of JSON and CSV, contract `pr-datapack-v1`. The provisional one carries a failed-validation note (DEC-OPEN-33). Entry names only were listed (14 and 27 entries); nothing was extracted | 2 files, 18,687,361 and 53,793,976 bytes (about 244 MB and 848 MB unpacked) | None known (Downloads is outside the OneDrive Desktop; UNKNOWN whether OneDrive backs it up) | proprietary data of the MF dashboard (sign-in-only product); never commit: `.gitignore` covers `*.zip` but not extracted `*.json` (datapack-feasibility R9) | TASK-022 (Portfolio Matrix fed from the MF dashboard, D86) and October step 10; the final pack (DEC-OPEN-33) is still missing |
| `%USERPROFILE%\OneDrive - <company>\Desktop\MOD-01_TO_MOD-02_SUCCESSOR_PROMPT_2026-10-28 - Proposal Dashboard.md` | ABSENT on 17-Nov-2026 (VERIFIED by `ls`). MOD-02 was started from it (first message of the transcript 56ada2dd). The repository copy `docs/handover/continuations/MOD-01_TO_MOD-02_SUCCESSOR_PROMPT_2026-10-28.md` exists | 0 files | n/a | internal | Nothing: use the repository copy |

Notes for the Moderator.

1. Totals. The inventory lists 754 rows. The handover ZIP (a local-only package built after the merge) copies the current-cycle inputs, the helper scripts, the notes and a snapshot of the tracked files; the older months, the backups and the transcripts are listed with SHA-256 only; the rest is excluded. Its manifest has the counts.
2. These documents are now stale on the same facts and need the register sweep: `docs/project-control/REPOSITORY_AND_ENVIRONMENT_STATE.md` lines 185, 537, 757 and 799
   (130 files, about 446 MB, seven month folders, no `2026-10_*` folder), `docs/KNOWN_ISSUES.md` line 2301 (about 447 MB) and R10 / R11 (the `%TEMP%\x` folder).
   The 28-Oct-2026 handover documents are historical snapshots and are not edited.
3. Moving parts. The memory folder gained a note at 07:40 UTC on 17-Nov-2026 (12 files now; 11 at the first listing); the MOD-02 transcript and its subagent folder
   grow while the chat runs, so their hashes are point-in-time. Re-run the counts before the ZIP is built.
4. Not assessed: other session folders under `%TEMP%\claude\<project>` (ownership not established: they may belong to other chats), the other workbooks in the
   owner's calculators folder, and the 221-file B8 toolchain inside the excluded `handover-archive\` (R11).
5. One image in `<repo>\_testdata\pptx-design-system\` (a montage of the REFERENCE deck) may be a client item (UNCERTAIN: never opened; KNOWN_ISSUES R10 treats the reference deck as a likely
   client deck). It is excluded from the package until the owner says otherwise; the other design-system images are renders of the dashboard's own output.
6. The transcripts of the GOV-01 and OPS-01 chats are not among the five files in the main project transcript folder; they are in project folders named after their worktrees (VERIFIED by listing):
   OPS-01 = efcf80ca (last turn 9-Nov-2026 21:49 UTC), GOV-01 = 4b1e7917 (last activity 9-Nov-2026 12:20 UTC), plus two earlier worktree chats, 4dd2f74d (21-Oct-2026) and acab20e6 (16-Oct-2026). They are counted in the transcript row above.

### 9. Next steps for the successor

In execution order. The register (`TASK_REGISTER.md`) is the live record and wins if it differs. Detail and the commands are in the successor prompt sections D and F.

| # | Task | What to do | Acceptance | Required tests | Depends on / blocked by |
|---|---|---|---|---|---|
| 1 | TASK-080 | Validate this handover against the repository before assigning anything; one docs PR: MOD-03 ACTIVE, MOD-02 RETIRED, index statuses | every check of prompt section D recorded; PR merged; live files unchanged | section D commands: `verify_page`, `npm test`, live parity, OneDrive and fsck, register spot-checks | the owner starts MOD-03 |
| 2 | (owner conversation) | Put the blockers to the owner, one decision at a time, plain language: re-exports; DEC-OPEN-35; DEC-OPEN-36 with DEC-OPEN-11 and the re-exports; bond YTM mapping, DEC-OPEN-09 and the reading of D90; confirm the wording of D87 to D96; then the rest of section 7 | each answer is a D-number (from D97) or marked deferred; unblocked tasks updated | none | the owner |
| 3 | TASK-020 (OPS-01) | Reckoner run (wave 1) after the answers: claim on `origin/main`, contract, Guardian pre-check, Moderator-run Gate B if any pin, `add_reckoner_funds.js`, `--accept-drops` or universe change is approved | gates pass or are waived in writing; `DATA_DATES.pms` matches the file (B1); Select keys in MASTER equal the total; update log; published (D61 or DEC-OPEN-35's answer); live files equal `site/` | `verify_page`; `npm test`; live parity; `financial-data-reviewer` | DEC-OPEN-36, -11, -35; claim |
| 4 | TASK-067 and TASK-023, then TASK-024 and TASK-021 (wave 2) | NB chat for the young-fund rule first (D94); then the funds run: renames (D96; re-check the Motilal Oswal pair), label "31st October 2026" (D91), analytics as on 30-Sep | 13 JioBlackRock Regular records and very young funds cleared; renames applied; the Direct and Regular and SIF figures share one NAV date (30-Oct) | the NAV-date tests; dry runs; Moderator-run Gate B; `financial-data-reviewer` | the owner's re-exports (or a decision); `Analytics/` folder; the young-fund rule |
| 5 | TASK-081 | The rest of the register sweep (what this PR did not do: EX-01 update log, requirement rows, `ARCHITECTURE_AND_DEPENDENCY_MAP.md`, the NAV-date pre-bake check in `docs/MONTHLY_UPDATE_PROCESS.md`, and two Material items: the CLAUDE.md headline and `qa-verifier.md` line 24) | every statement agrees with `origin/main`; Material items with contract and Guardian pre-check | link and count checks; `security-reviewer` | none |
| 6 | TASK-082, -083, -084, -085, TASK-022 | New tools, one NB chat each, staggered: PMS and AIF performance from the Reckoner (D95), GIFT City from the offshore deck (D90), one Bond List (D90), direct equity returns (D89), the Portfolio Matrix bridge (D92, D93) | per contract; gates A to E | per contract | owner answers (YTM rule, ranges, calculator sample, final data pack: DEC-OPEN-33) |
| 7 | TASK-033, -032, -073, -034; TASK-059 to -062 | Transfer completion (outgoing owner, compliance, old-site retirement after the owner's full-test sign-off) and clean-up after DEC-OPEN-22 | per register | per register | DEC-OPEN-13, -14, -24, -26, -22 |

### 10. Coordination

- **Guardian (ARC-01).** The read-only subagent `integration-guardian` (`.claude/agents/integration-guardian.md`), invoked through
  the Agent tool. It keeps no memory: give it the task id, the contract, the base and head SHAs and the file list every
  time. Its durable memory is `CODEBASE_GUARDIAN_HANDOVER_2026-10-28_v1.md`, `ARCHITECTURE_AND_DEPENDENCY_MAP.md`,
  `INTERFACE_CONTRACTS.md`, `ACTIVE_CHANGE_REGISTER.md` and `INTEGRATION_AND_REGRESSION_LOG.md`. The reviews MOD-02 ran are
  listed in `INTEGRATION_AND_REGRESSION_LOG.md`; the last one (the diff of TASK-018's branch, 9-Nov-2026) returned GO WITH
  CONDITIONS and its conditions were met at the merge of PR #35. For a monthly refresh the operator runs Gate B itself (D88);
  a refresh that is HIGH risk (applied owner decisions, pins, overrides, new funds, universe changes, a correction run,
  hand-edited siblings) needs a contract and a Moderator-run Gate B.
- **Specialists** (`.claude/agents/`): `principal-architect` (plan), `repo-archaeologist` (investigate), `financial-data-reviewer`
  (any change that touches returns, bands, analytics, risk ratios, PMS, AIF, SIF, renames or what clients see), `qa-verifier`
  (Gate C), `security-reviewer` (before every push), `release-manager` (Gate D and the live check), `docs-keeper`,
  `implementation-engineer`. Skills: `/monthly-update <Month YYYY>` and `verify-dashboard`.
- **Related chats:** EX-01 and GOV-01 are finished; OPS-01 is idle and BLOCKED; there is no other active chat for this
  project (section 5).
- **External project.** The Portfolio Review Dashboard has its own folder, repository and chats, shares the ids EX-01 and ARC-01
  (this project's sub-chat titles carry "Playbook" in the workstream field), and runs in the same app and on the same
  account: its sessions appear in `list_sessions` and its usage counts against the same limits. Never open or change its
  folder; whether one Moderator covers both is DEC-OPEN-25.
- **Pending approvals:** no pull request waits for approval. The owner's open decisions and the unanswered questions are in
  section 7.

### 11. Uncertainty warnings

| # | Warning | Label | What is missing | How to establish |
|---|---|---|---|---|
| 1 | This document mixes commands run on 17-Nov-2026 (VERIFIED, with the command named) and MOD-02's memory of the chat | INFERRED where no record is named | the chat itself | re-run the commands in the successor prompt section D; read the register of the owner's instructions (local package) |
| 2 | MOD-02 had four compactions; its detail from 2-9 Nov survives as summaries and in the transcript | UNKNOWN beyond the records | review reports not saved as files | search the transcript with a script (lines are multi-megabyte: never Grep it whole) |
| 3 | The owner has not read the wording of D87 to D96 (recorded from chat answers; MOD-02's readings in D86 and D90 are INFERRED) | UNCERTAIN | `DECISION_LOG.md` section 1.5 step 2 (the owner confirms the wording) | put a short summary to the owner (successor prompt F2f) |
| 4 | The owner said on 9-Nov 09:06 UTC that the 2-Nov Regular and SIF files "have 30th October NAV" and to use them; MOD-02 did not, because MTD equals 1 Day on 92 percent of rows and the implied 30-Oct move matches the Direct file for 512 of 520 schemes | the analysis is MOD-02's (strong, two independent tests); the owner may know more | the owner's re-export as on 31-Oct-2026 | the NAV-date tests in the memory note `monitor-nav-date-check`; `monthly-updates/2026-10_Oct-2026/_review/navdate_test.js` (local) |
| 5 | D90: "merge the two lists together as just one Bond List" | INFERRED (which two lists is UNCERTAIN) | the owner's meaning | ask (successor prompt F2e) |
| 6 | OPS-01: the app shows its branch as `claude/ops-01-reckoner-a11e94` while `git worktree list` shows `data/2026-09-4` in its worktree; it has no commit; its two reports are local files; the draft claim is recorded nowhere in the repository | VERIFIED (state), UNKNOWN (why the names differ) | OPS-01's own transcript (its worktree's project folder) | `list_events` on its session; `git worktree list` |
| 7 | OPS-01's summary says COMMODITIES 6 drop; its own dry-run output lists five Gold ETFs dropped (the category keeps 6). The 12 drops are 5 AIFs, 5 Gold ETFs and 2 equity funds | VERIFIED (dry-run output) | none | read `14_merge_reckoner_dry_run4.txt` (local) |
| 8 | UNKNOWN on the owner's side: whether any desk request was sent (TASK-019); whether users have the new URL; whether the "October 2026" Reckoner deck is final | UNKNOWN | the owner | ask |
| 9 | Backups of the local-only artefacts: OneDrive syncs the folder, a restore was never tested (R11); `%TEMP%\x\ref.pptx` may hold client data (R10) | UNKNOWN | a restore test | the owner; never open that file |
| 10 | A weekly usage limit stops every chat at once (it stopped OPS-01 on 9-Nov-2026 21:49 UTC); whether Fable usage counts against the all-models window is UNKNOWN | INFERRED | the app's usage card | `get_usage` before every launch |
| 11 | The ETA MOD-02 gave on 9-Nov-2026 (four waves from 11-Nov) was not met: the weekly limit stopped every chat from 9-Nov 21:49 UTC and the owner's re-exports and answers are still open | VERIFIED | new dates | restate after the owner's answers (successor prompt F8) |
| 12 | The independent reconstruction test of the local package ran in a subagent that also receives `CLAUDE.md`, so the package was not its only input | VERIFIED limitation | a truly cold session | MOD-03's own validation (section D of the successor prompt) is the real test |
| 13 | The register sweep (stale statements after PRs #34 to #36 and EX-01) is only partly done by this handover (the PR of TASK-079 does most of it; what is left (TASK-081) is listed in section 9) | VERIFIED | the rest of the sweep | the verified list and prepared edits are in the package (`06_WORKING_FILES`) |

### 12. Verification of the handover branch (`continuations/README.md` section 6)

| Check | Result and evidence |
|---|---|
| Branch exists; source = recorded base | `handover/mod-02-to-mod-03-20261117`: one commit on `b47069b` (the commit SHA is in the pull request: it does not exist when this file is written) |
| Only documentation in the diff | 2 new files and 15 changed files, all under `docs/` or `CHANGELOG.md`; no change to `site/`, `tools/`, `.github/`, `CLAUDE.md`, `.claude/` or the package files (checked with `check_commit.js` before the push) |
| No secrets, client data or forbidden files | scripted scan of every added line (ASCII, except 4 edited lines that keep a pre-existing dash or ellipsis; no e-mail address, Windows user path, session id over 8 characters, address of the MF dashboard or old-repository address) and an independent `security-reviewer` pass before the push |
| Handover document and successor prompt present and agree | independent fact-check and consistency review before the push; findings fixed in the same commit |
| Test status documented honestly | section 3 lists each run and every NOT RUN |
| Pushed; remote SHA = local SHA | recorded in the pull request description |

### 13. The owner's handover message (`continuations/README.md` section 8)

The message is the last message of the MOD-02 chat. It states, in this order:

1. MOD-02 stops all implementation; it only answers questions about its own record.
2. The successor chat name: `MOD-03 | Project-Wide | Master Project Moderator | QUEUED`.
3. The handover branch: `handover/mod-02-to-mod-03-20261117` (documentation only, cut from `origin/main` at `b47069b`).
4. This document: `docs/handover/MASTER_HANDOVER_2026-11-17_v2.md` in the repository folder.
5. The successor prompt: `docs/handover/continuations/MOD-02_TO_MOD-03_SUCCESSOR_PROMPT_2026-11-17.md`.
6. GitHub: the pull request URL and merge SHA, given in the chat message (they did not exist when this file was written).
7. The branch holds every relevant change: the working tree was clean, so no work-in-progress checkpoint was needed (Scenario B, section 5 of the procedure, case: none).
8. Local-only and not in git: the portable package (`handover-archive\outgoing_20261117\`), the month folders, the notes, OPS-01's two reports and OPS-01's worktree (section 8).
9. The prompt to paste: the text between `BEGIN PROMPT` and `END PROMPT` of the successor prompt file (it is long: the file is the copy).
10. The owner's action: click the "MOD-03" card, or open a new chat in the Claude desktop app's Code tab on the repository folder and paste the prompt; then answer MOD-03's first questions (DEC-OPEN-35, then DEC-OPEN-36 with DEC-OPEN-11 and the re-exports).

### 14. Records updated

This PR (TASK-079; 17 files): `docs/handover/MASTER_HANDOVER_2026-11-17_v2.md` and `continuations/MOD-02_TO_MOD-03_SUCCESSOR_PROMPT_2026-11-17.md` (new); the indexes in `docs/handover/README.md` (package v2) and `docs/handover/continuations/README.md` (this handover and the compaction evidence); `docs/project-control/CHAT_REGISTRY.md` (MOD-02 HANDOVER REQUIRED, MOD-03 QUEUED, EX-01 and GOV-01 COMPLETED, OPS-01 BLOCKED), `ACTIVE_CHANGE_REGISTER.md` (GOV-01's claim released: no claim is active), `TASK_REGISTER.md` (TASK-079 to TASK-085 added; TASK-017 and TASK-018 VERIFIED COMPLETE; TASK-064 IMPLEMENTED NOT FULLY VERIFIED; TASK-020 and TASK-021 BLOCKED; TASK-022, TASK-023, TASK-024 and TASK-067 PLANNED), `DECISION_LOG.md` (DEC-OPEN-35 and DEC-OPEN-36 opened; counts; two answer times corrected), `README.md` of project-control (next free ids), `INTEGRATION_AND_REGRESSION_LOG.md` (baseline `b47069b`, PRs #31 to #36, INC-20), `REPOSITORY_AND_ENVIRONMENT_STATE.md` (the TASK-017 pass), `KNOWN_ISSUES_AND_REGRESSION_RISKS.md`; `docs/KNOWN_ISSUES.md` (effects of D92 to D96; new B10, R13 and C47 to C50), `docs/INPUT_FILES.md`, `docs/DECISIONS.md` (two answer times corrected: D92 08:43 UTC, D94 11:38 UTC), `docs/PROJECT_STATE.md` and `CHANGELOG.md`. Not done here (TASK-081): see section 9.

### 15. Crosswalk to the owner's handover master prompt (pasted 17-Nov-2026 06:27 UTC)

The owner pasted a generic handover master prompt (24 sections) and asked for a package a new chat can continue from. This repository already has a handover procedure (`docs/handover/continuations/README.md`, Scenario B) and a set of registers, so the prompt's documents are mapped to existing files instead of being written again. Where the prompt and a recorded decision differ, the difference is listed in 15.4 and put to the owner as DEC-OPEN-35. The prompt itself is not copied here; the local package keeps it (VERIFIED: saved on 17-Nov-2026).

#### 15.1 What the prompt asks and where this repository answers it

| Prompt section | Where it is answered | Status |
|---|---|---|
| 3 Conversation and knowledge audit | `docs/DECISIONS.md` (D60 to D96 record the owner's words and time where given; D1 to D59 are inherited and cite code), `docs/project-control/DECISION_LOG.md` (open questions), `REQUIREMENTS_AND_CHANGE_REGISTER.md`; the verbatim list of the owner's messages of this chat is in the local package only | covered; verbatim register local-only |
| 4 File discovery, inventory, copy, missing files | `docs/INPUT_FILES.md` (desk files, coverage matrix); section 8 of this document; the local package holds copies, the manifest with SHA-256 and the missing-files register | covered; originals are local-only by repository rule (no .xlsx, .pptx or .zip in git) |
| 5 Master documents | table 15.2 | covered by existing documents; none duplicated |
| 6 Stages 0, 1, 2 with owner approval at each | table 15.3 | mapped |
| 7 to 9 Phases, sprints, lifecycle, completion rule | 15.4 | mapped; one difference (DEC-OPEN-35) |
| 10 to 12 Moderator, numbered chats, registry, archive, file ownership, conflicts | `MODERATOR_BOOTSTRAP_PROMPT.md` sections 1 and 6 to 9; `CHAT_REGISTRY.md`; `FILE_OWNERSHIP_AND_CHANGE_CONTROL.md`; `ACTIVE_CHANGE_REGISTER.md` | covered (ids MOD, EX, NB, OPS, GOV, ARC; never reused; archive protocol = RETIRED) |
| 13 Context efficiency, chat handover briefs | `SUBCHAT_HANDOVER_TEMPLATE.md`, `continuations/README.md` | covered |
| 14 and 15 Trackers and sprint deliverables | `TASK_REGISTER.md`, `INTEGRATION_AND_REGRESSION_LOG.md`, the Gate A report (bootstrap 8.2 item 11) | covered |
| 16 to 18 Governance files and package structure | table 15.2 and the local package (its `README.md`) | covered |
| 19 and 20 Verification and independent reconstruction test | the package verification results and completeness report (local); the successor's validation task (`continuations/README.md` section 6, bootstrap section 5) | covered |
| 21 and 22 Acceptance checklist and final delivery | the owner's handover message, section 13 of this document | covered |
| 23 and 24 Operating principles and success criterion | bootstrap sections 1, 6, 7 and 12; successor prompt section A | covered |

#### 15.2 The prompt's documents and their equivalents here

| Prompt's name | Equivalent in this repository |
|---|---|
| MASTER_HANDOVER | this document (state) and `MASTER_HANDOVER_2026-10-28_v1.md` (history; historical snapshot) |
| DETAILED_PRD | `docs/PRD.md` |
| EXECUTION_PLAYBOOK | `docs/MONTHLY_UPDATE_PROCESS.md`, `docs/OPERATING_MANUAL.md` (the trap catalogue), `.claude/skills/monthly-update/SKILL.md`, `docs/TESTING.md`, `docs/DEVELOPMENT_SETUP.md`, `docs/DEPLOYMENT.md` |
| DECISIONS_AND_CHANGELOG | `docs/DECISIONS.md`, `CHANGELOG.md`, `docs/project-control/DECISION_LOG.md` |
| TECHNICAL_ARCHITECTURE | `docs/ARCHITECTURE.md`, `docs/project-control/ARCHITECTURE_AND_DEPENDENCY_MAP.md`, `INTERFACE_CONTRACTS.md` |
| DATA_AND_METHODOLOGY | `docs/OPERATING_MANUAL.md`, `docs/INPUT_FILES.md`, the data sections of `docs/PRD.md` |
| OPEN_ITEMS_AND_RISKS | `docs/KNOWN_ISSUES.md`, `docs/project-control/KNOWN_ISSUES_AND_REGRESSION_RISKS.md`, the open entries of `DECISION_LOG.md` |
| FILE_MANIFEST and HANDOVER_COMPLETENESS_REPORT | `docs/INPUT_FILES.md` (inputs) and section 12 of this document; the package's manifest and completeness report (local) |
| NEXT_SESSION_MASTER_PROMPT | `docs/handover/continuations/MOD-02_TO_MOD-03_SUCCESSOR_PROMPT_2026-11-17.md` |
| CHAT_REGISTER | `docs/project-control/CHAT_REGISTRY.md` |
| PHASE_SPRINT_MASTER_TRACKER | `docs/project-control/TASK_REGISTER.md` with `ACTIVE_CHANGE_REGISTER.md` |
| FILE_OWNERSHIP_AND_DEPENDENCY_REGISTER | `docs/project-control/FILE_OWNERSHIP_AND_CHANGE_CONTROL.md`, `ACTIVE_CHANGE_REGISTER.md`, `ARCHITECTURE_AND_DEPENDENCY_MAP.md` |
| SPRINT_APPROVAL_LOG | `DECISION_LOG.md` (owner answers), `INTEGRATION_AND_REGRESSION_LOG.md` (baselines), the merged pull requests |
| SPRINT_COMPLETION_CHECKLIST | Gates A to E (`FILE_OWNERSHIP_AND_CHANGE_CONTROL.md` section 8; bootstrap 7.4) |
| CHAT_HANDOVER_TEMPLATE | `MODERATOR_HANDOVER_TEMPLATE.md` and `SUBCHAT_HANDOVER_TEMPLATE.md` |
| BASELINE_RECONSTRUCTION_SPEC and BASELINE_RECONCILIATION_REPORT | `docs/REPLICATION_REPORT.md`, `EXISTING_DASHBOARD_HANDOVER_2026-10-28_v1.md`, `docs/TESTING.md` |
| DATA_UPDATE_PLAN and DATA_UPDATE_VALIDATION_REPORT | `docs/MONTHLY_UPDATE_PROCESS.md`, `docs/INPUT_FILES.md`, `docs/update-log/<month>.md` |
| README | `docs/README.md` and `docs/handover/README.md` |

#### 15.3 The prompt's three stages in this project

| Stage in the prompt | In this project | Status on 17-Nov-2026 |
|---|---|---|
| 0: reconstruct the existing dashboard exactly, reconcile, owner approves the baseline | Workstream A (EX): the outgoing owner's site was replicated here and proved equal (TASK-001 to TASK-014; `docs/REPLICATION_REPORT.md`; tag `handover-baseline`); browser acceptance TASK-064 (EX-01, 2-Nov-2026) | reconstruction done and verified; the owner's formal sign-off of "full testing" (DEC-OPEN-24, TASK-034) is still open |
| 1: update the dashboards with the data already supplied, validate, owner approves | the October 2026 monthly cycle (TASK-020 Reckoner run; TASK-021 funds run) under `docs/MONTHLY_UPDATE_PROCESS.md`; validation = each tool's gates plus the update log | in progress: the Reckoner run stopped at gates that need the owner (DEC-OPEN-36); the funds run waits for the re-exports (sections 4 and 9) |
| 2: new development in phases and sprints | Workstream B (NB): bounded tasks with contracts, claims and gates A to E; no NB change to `site/` overlaps an OPS run | the October additions (PMS from the Reckoner, GIFT City, one Bond List, direct equity, the risk bridge) are PLANNED in `TASK_REGISTER.md` |

#### 15.4 Sprints, phases, statuses and the one difference

- A sprint is a TASK: one bounded change, one chat, one claim, one contract where material, one Gate A report, one PR. A phase is a wave of the data calendar (the October waves in section 4) or a workstream. The prompt's phase approval has no separate step here: the owner approves scope when setting the task list and when answering a `DEC-OPEN`.
- The prompt's ten statuses map to this project's words (`MODERATOR_BOOTSTRAP_PROMPT.md` section 12): DEVELOPMENT IN PROGRESS = IN PROGRESS; CODING COMPLETED = IMPLEMENTED NOT FULLY VERIFIED; TESTING COMPLETED = Gate C passed; DEMONSTRATED and AWAITING USER APPROVAL = a client-facing change waiting for the owner's acceptance (Gate E, D87); APPROVED = accepted by the owner (D87) or recorded as accepted on evidence by the Moderator for internal changes; PRESERVED = merged (the merge commit is the preserved version; baselines are recorded in `INTEGRATION_AND_REGRESSION_LOG.md`; pre-refresh snapshots go to `backups/<date>_<tag>/`); ROLLED OUT = merged and the live files equal `site/` (Gate D); SPRINT COMPLETED = VERIFIED COMPLETE.
- Never replace the last approved version with unapproved work: here `main` is what users see, so nothing reaches `main` before Gates A to C and `security-reviewer`; recovery is a revert (bootstrap 7.5).
- **The one difference (DEC-OPEN-35).** The prompt asks for explicit owner approval before a sprint is closed and before rollout. The recorded rules are D61 (a monthly refresh publishes once every check passes), D87 (9-Nov-2026: the owner accepts client-facing changes; a refresh publishes first and is accepted afterwards; the Moderator records acceptance of the rest on evidence), D88 (the refresh operator runs the Guardian diff review) and `FILE_OWNERSHIP_AND_CHANGE_CONTROL.md` section 7 (the cases where the owner approves before the merge). Until the owner answers, MOD-03 asks the owner before any merge that changes a deploy file (the owner's latest instruction); every other change keeps the recorded rules.

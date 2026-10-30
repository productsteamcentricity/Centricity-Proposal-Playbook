# Repository and environment state

| Field | Value |
|---|---|
| Version | 1 |
| Date | 28-Oct-2026 (snapshot taken 05:40-07:55 UTC) |
| Author chat | MOD-01 (writer W-state) |
| Status | Authoritative for the environment and the safe git procedures. The state tables are a **dated snapshot of 28-Oct-2026**: re-run section 18 before relying on them |
| Supersedes | none (first version) |
| Next review | MOD-02 in TASK-016 (first act after the handover merge); then after any change to branches, worktrees, the stash, the machine or OneDrive |

Labels: **VERIFIED** (command run, cited), **INFERRED** (reasoned from cited evidence), **UNCERTAIN**, **UNKNOWN**.
Times are UTC unless marked IST (UTC+5:30). Paths: `<repo>` = `%USERPROFILE%\OneDrive - CENTRICITY FINANCIAL
DISTRIBUTION PRIVATE LIMITED\Desktop\Claude Code-Investment Proposal Dashboard`; `%TEMP%` =
`%USERPROFILE%\AppData\Local\Temp`; `<slug>` = the Claude project folder name derived from `<repo>`'s full
path (used under `%TEMP%\claude\` and `%USERPROFILE%\.claude\projects\`).

Sources: fact-sheet investigations of 28-Oct-2026 (read-only) and this writer's own read-only checks at
07:52-07:55 (`git status`, `git rev-parse`, `git stash list`, `git worktree list`, `git remote -v`,
`gh repo set-default --view`, `node tools/verify_page.js site`, listings of the local-only folders).
Integration history and live parity: [`INTEGRATION_AND_REGRESSION_LOG.md`](INTEGRATION_AND_REGRESSION_LOG.md).
Current project state: [`../PROJECT_STATE.md`](../PROJECT_STATE.md). Defects: [`../KNOWN_ISSUES.md`](../KNOWN_ISSUES.md).

---

## 1. Read this first (three rules for this machine)

1. **Never run `git checkout` or `git switch` in the main checkout `<repo>` while any `.git` file is
   cloud-only** (CLAUDE.md "Project control"; 229 were on 28-Oct). On 25-Oct-2026 a checkout aborted with
   `fatal: mmap failed: Invalid argument` and truncated or deleted tracked files (INC-16,
   [`../KNOWN_ISSUES.md` R6](../KNOWN_ISSUES.md#r6-the-git-repository-lives-inside-onedrive)). Whatever the
   OneDrive state, the main checkout stays on `main`. Use the procedures in section 14.4.
2. **Write scripts that contain escapes with the Write tool and run them from files** (section 15.1). Heredocs,
   `node -` and `node -e` decode `\uXXXX` and `\\` on this machine.
3. **Only what is committed and pushed is backed up.** OneDrive.exe is not running, so nothing in the OneDrive
   folder is syncing, and `%TEMP%` and `%USERPROFILE%\.claude` are not in OneDrive at all (section 16).

---

## 2. State at a glance (28-Oct-2026)

| Layer | State | Evidence | Label |
|---|---|---|---|
| Local working tree (main checkout) | On `main` at `2b2a397`. **Before the package: clean** (0 staged, 0 unstaged, 0 untracked; still clean after `npm test`). **While the package is written:** `CLAUDE.md` and `docs/README.md` modified by MOD-01, and new files under `docs/handover/`, `docs/project-control/`, `.claude/agents/integration-guardian.md` and `docs/KNOWN_ISSUES.md` edits - all documentation, all destined for `handover/mod-01-to-mod-02-20261028`. `site/` and `tools/` unchanged. | `git status --porcelain=v1 -b` at 07:52 (`## main...origin/main`, ` M CLAUDE.md`, ` M docs/README.md`) | VERIFIED |
| Last local commit | `main` = `2b2a39757342437c73921802775197701dbca2aa` (merge of PR #28, `docs/handover-export-ingestion`, 27-Oct-2026 12:27:49Z / 17:57 IST) | `git rev-parse HEAD`; `git log -1 main` | VERIFIED |
| Last push | `origin/main` = `2b2a397` both as the local ref and on GitHub (`pushed_at` = 27-Oct-2026 12:27:49Z); 0 ahead / 0 behind. No `git fetch` was run on 28-Oct (read-only brief); GitHub was read through `gh api` | `git rev-parse origin/main`; `gh api repos/productsteamcentricity/Centricity-Proposal-Playbook/commits/main` | VERIFIED |
| Integrated | Every local branch (26 besides `main`) and every `origin/*` branch is merged into `main`; 0 open PRs | `git branch --no-merged main` empty; `gh pr list --state open` empty | VERIFIED |
| Deployed - new site | Deployment 7358413557 of `2b2a397` (push run 40503943213, 27-Oct 12:27:52Z, verify + publish success). Live files 7/7 SHA-256 = `site/`. Last change to `site/` was `5d39821` (PR #26, site state S7) | `gh api .../deployments`; live download 28-Oct ~05:52 | VERIFIED |
| Deployed - old site | Outgoing owner's Pages (legacy build from upstream `main` root at `72e1f1e`), HTTP 200, serves the handover baseline S0 | `gh api repos/magazineishita1108-boop/Centricity-Proposal-Playbook/pages`; `curl -I` | VERIFIED |
| After the package | The merge of `handover/mod-01-to-mod-02-20261028` becomes `origin/main` (docs only; site state stays S7). MOD-02 re-runs section 18 (TASK-016) | package plan | PLANNED |

---

## 3. Identity, remotes, tags and SHAs (VERIFIED)

| Fact | Value | Command |
|---|---|---|
| Repo path | `<repo>`: the workspace folder is the git repository, inside OneDrive (D65) | `git worktree list` |
| Current branch | `main` | `git rev-parse --abbrev-ref HEAD` |
| HEAD | `2b2a39757342437c73921802775197701dbca2aa` | `git rev-parse HEAD` |
| `origin` | fetch and push `https://github.com/productsteamcentricity/Centricity-Proposal-Playbook.git` (public, default branch `main`) | `git remote -v` |
| `upstream` | fetch `https://github.com/magazineishita1108-boop/Centricity-Proposal-Playbook.git`; **push URL `DISABLED-read-only-reference` (push disabled)** | `git remote -v` |
| `upstream/main` | `72e1f1ee72e95c01419fde271d646c92a6266459` (14-Oct-2026 16:07 IST); unchanged on GitHub since 14-Oct-2026 10:37:16Z; upstream repo public, not archived | `git rev-parse upstream/main`; `gh api repos/magazineishita1108-boop/Centricity-Proposal-Playbook` |
| gh default repo | `productsteamcentricity/Centricity-Proposal-Playbook` (so `gh pr` targets `origin`, not the read-only upstream) | `gh repo set-default --view` |
| gh login | `productsteamcentricity` (keyring), https, token scopes `gist`, `read:org`, `repo`, `workflow` (token not shown) | `gh auth status` |
| git identity | user.name "Products Team Centricity"; email = a GitHub noreply address (global config) | `git config --global --get user.name` |
| git settings | `core.autocrlf=false` (global, overrides system `true`); `extensions.worktreeconfig=true`; `core.longpaths` unset (Windows `LongPathsEnabled=1`); credential helper from system config | `git config --show-origin --list` |
| Tag | one: `handover-baseline`, annotated (tag object `4e4cfbf`) -> commit `862e40b2ab28eaca12c907a95837cff9d97e97a0`, the sanitised equivalent of upstream `72e1f1e` (trees differ only in the 8-line redaction of `Portfolio_Review_Build_Prompt.md`, D64). Same on GitHub | `git cat-file -p handover-baseline`; `gh api .../tags` |
| History | `main` 143 commits, 69 since `862e40b` (38 non-merge + 28 PR merges + 3 other merges); `862e40b` is an ancestor of `main`, `72e1f1e` is not (history rewritten); upstream has 74 commits; 0 reverts | `git rev-list --count`; `git merge-base --is-ancestor` |
| Tracked files | 102 (`.claude` 12, `.github` 1, `docs` 27, `tools` 44, `site` 7, root 7, plus 4 README-only placeholders in `backups/`, `handover-archive/`, `monthly-updates/` and `monthly-updates/00_INBOX/`) | `git ls-files` |

---

## 4. Working tree and protections

- Staged, unstaged, untracked before the package: none (VERIFIED, `git diff --cached`, `git diff`,
  `git ls-files --others --exclude-standard`). During the package: see section 2.
- **Modified application modules since the handover baseline** (VERIFIED by blob IDs): only `site/index.html`
  and `site/Centricity_SIF_Refresh.js`; the other four siblings and `robots.txt` are still the baseline blobs;
  `Centricity_Risk_Matrix.js` left `site/` in PR #12 (archived, D78). Per-merge history:
  [`INTEGRATION_AND_REGRESSION_LOG.md`](INTEGRATION_AND_REGRESSION_LOG.md) section 2.2.
- Sensitive-data protections (VERIFIED, `cat .gitignore .gitattributes`, `git ls-files | grep`):
  - `.gitignore` blocks `*.xlsx *.xlsm *.xls *.xlsb *.csv *.ppt *.pptm *.doc *.rar *.msg *.eml .env .env.* uploads/ inputs/`,
    archives and generated documents `*.zip *.7z *.docx *.pptx *.pdf`, backup patterns `*.bak *.bak_* *.bak[0-9]* *.broken* *.tmp`;
    `monthly-updates/*`, `backups/*`, `handover-archive/*` except their README files; `.claude/` except `agents/`,
    `skills/`, `serve.js`, `launch.json`.
  - `*.json` is not ignored globally; `monthly-updates/_handover_manifest.json` is excluded only by `monthly-updates/*`.
  - `.gitattributes`: `* text=auto eol=lf`; `tools/rename_schemes.js diff`; `*.xlsx *.pptx *.png *.jpg *.zip binary`.
  - Tracked spreadsheets, decks, archives, PDFs, mail files: **none**. Tracked under `monthly-updates/`, `backups/`,
    `handover-archive/`: only the 4 README files. Secret-like file names: none. GitHub Actions secrets: 0.

---

## 5. Branches (VERIFIED, `git branch --merged/--no-merged main`, `git for-each-ref`, `gh api --paginate .../branches`)

Summary: 27 local branches (26 + `main`) and 26 `origin/*` branches (25 + `main`), **all merged into `main`**;
no branch has a commit that `main` lacks (`git rev-list --objects <b> --not main` empty for each). The only
unmerged ref is `upstream/main` (pre-sanitisation history: keep as a read-only reference, never push it; R1, R8).
GitHub's branch list equals the local `origin/*` refs (26 names, same SHAs). GitHub `delete_branch_on_merge` is
false and no merge since PR #7 passed `--delete-branch`, which is why merged branches remain (E12, DEC-OPEN-22).

| Local branch | Tip | PR | On origin | Note |
|---|---|---|---|---|
| main | `2b2a397` | - | yes | current; in sync with `origin/main` |
| claude/focused-wright-d50bee | `bf20c08` | session branch | **no (local only)** | NB-01's desktop session branch; tip = PR #2 merge |
| claude/adoring-boyd-7028f6 | `8e187ae` | session branch | **no (local only)** | NB-02's desktop session branch; tip = PR #17 merge |
| fix/bond-list-sheet-desk | `1b6fe51` | #4 | yes | |
| fix/pms-aif-analytics-date | `65dc082` | #5 | yes | |
| fix/reckoner-drop-gates | `fe060d5` | #6 | yes | checked out in worktree `focused-wright-d50bee` |
| fix/tools-core-dates | `11464c2` | #7 | yes | the stash was made on an earlier, amended tip `8e65de1` |
| fix/tools-equity-expense-managers | `e697efe` | #8 | yes | |
| fix/tools-risk-sif | `9658e8e` | #9 | yes | |
| fix/tools-pms-aif-reckoner | `807cbf1` | #10 | yes | |
| fix/tools-bonds-slides-oneoffs | `f55bac2` | #11 | yes | |
| fix/page-dates-riskflags-sri | `3a75afb` | #12 | yes | |
| data/2026-09-corrections | `874cebc` | #13 | yes | |
| fix/rename-exact-inception | `bc37922` | #14 | yes | |
| fix/tools-cli-cleanup | `184939e` | #15 | yes | |
| docs/post-handover-fixes | `daec410` | #16 | yes | |
| fix/c19-refresh-only-sheets | `c7c4256` | #17 | yes | |
| data/2026-09-c19-refresh | `7fc9571` | #18 | yes | |
| fix/missing-input-exit-2 | `aa83993` | #19 | yes | |
| fix/atomic-rename-retry | `5eaf8db` | #20 | yes | |
| fix/c17-matrix-footnote | `6ff544c` | #21 | yes | |
| fix/c18-select-popover-dagger | `36c1257` | #22 | yes | |
| fix/a27-rehearse-old-site | `18abff3` | #23 | yes | checked out in worktree `adoring-boyd-7028f6`; the tip is a merge commit holding PR #23's code |
| docs/export-prompt-c19-c23 | `253c6b0` | #24 | yes | |
| docs/acceptance-check-c24-c27 | `31af6b1` | #25 | yes | |
| feat/pptx-design-system | `625fdd5` | #26 | yes | |
| docs/release-pr26 | `f8015d0` | #27 | yes | |

- Remote-only: `origin/docs/handover-export-ingestion` (`11d5c0a`, PR #28) has no local branch.
- Gone everywhere: `setup/transfer-baseline` (#1), `docs/post-transfer-state` (#2), `fix/foundation-blocklib-verify` (#3).
- Clean-up is the owner's call (DEC-OPEN-22): TASK-059 (25 on origin), TASK-060 (26 local; remove worktrees first, TASK-061).

---

## 6. Worktrees (VERIFIED, `git worktree list --porcelain`, `git -C <wt> status --short`, `git worktree prune -n -v`)

| Worktree | HEAD | Branch | Status | Behind main | Notes |
|---|---|---|---|---|---|
| `<repo>` (main checkout) | `2b2a397` | main | see section 2 | 0 | Moderator's checkout; stays on `main` |
| `<repo>\.claude\worktrees\adoring-boyd-7028f6` | `18abff3` | fix/a27-rehearse-old-site | clean (only ignored `node_modules/`) | 12 | NB-02's Claude desktop worktree (marker `.git/worktrees/adoring-boyd-7028f6/claude-desktop-worktree`); branch merged (#23) |
| `<repo>\.claude\worktrees\focused-wright-d50bee` | `fe060d5` | fix/reckoner-drop-gates | clean | 50 | NB-01's Claude desktop worktree; branch merged (#6) |
| `%TEMP%\cpp-old` | `bf20c08` | (detached) | clean | 61 | Created 16-Oct-2026 13:13 UTC for the PR #3 rehearsal ("old tools" side); not locked. `docs/TESTING.md:100-110` documents it at `C:/t/cpp-old` and says to remove it afterwards (E11) |

- Stale admin folders `.git/worktrees/cpp-main` (19-Oct) and `.git/worktrees/wtdocs` (22-Oct) have no
  `gitdir`/`HEAD`; `git worktree prune -n -v` reports both as removable. They are not listed by `git worktree list`.
- All three extra worktrees are clean and on merged commits: no unique work. Removal is housekeeping for the owner
  to approve (TASK-061): the app's own worktree clean-up or `git worktree remove` for the two `.claude/worktrees`,
  `git worktree remove` for `%TEMP%\cpp-old`, then `git worktree prune`. Never `checkout`/`switch`. Under OneDrive
  `git worktree remove/prune` can fail with "Permission denied" and leave remnants: check `git worktree list` afterwards.

---

## 7. Stash `stash@{0}` - analysis and recommendation

| Fact | Value | Label |
|---|---|---|
| Entry | the only stash: `stash@{0}` = `6cb0624`, 19-Oct-2026 12:02:32 IST, "On fix/tools-core-dates: phase2-rest (snapshot in scratchpad/wt_snapshot)" | VERIFIED (`git stash list --date=iso`) |
| Parents | base `8e65de1` (19-Oct 12:02:19 IST; **not on `main`**: the branch was amended to `11464c2` before PR #7); index `1275ac7` (empty vs base); untracked-files commit `3e90041` | VERIFIED |
| Content | 23 modified tracked files (+1,627/-698): `site/index.html`, `site/Centricity_SIF_Refresh.js`, `docs/PRD.md`, `docs/README.md` and 19 files in `tools/`; plus 3 untracked files (`docs/handover/DATA_EXTRACTION_PROMPT.md`, `docs/handover/README.md`, `tools/data/pins.json`) | VERIFIED (`git stash show --stat`, `git ls-tree -r 'stash@{0}^3'`) |
| Readability | 16 of the 23 stash blobs and the untracked blobs fail `git cat-file`/`git show` with `fatal: mmap failed: Invalid argument` (cloud-only objects, section 14). But `git stash show -p --include-untracked stash@{0}` **exported the whole patch on 28-Oct** (exit 0, 26 `diff --git` sections, 1,408,451 bytes; the temporary file was deleted). Why the diff read succeeds where `cat-file` fails is UNKNOWN: re-check before relying on it | VERIFIED |
| Second copy | the working-tree snapshot named in the stash message: `%TEMP%\claude\<slug>\7628c9ae-33a1-4ba1-a4d9-bca35a44a511\scratchpad\wt_snapshot\` (40 files incl. `_tracked.patch` 1.47 MB); each file used was hash-verified equal to the stash blob. Present on 28-Oct; `%TEMP%` can be cleaned at any time | VERIFIED |
| Per-file verdict | 8 files identical to `main`; 18 superseded by later `main` commits; **0 files with work `main` lacks**, apart from design alternatives `main` deliberately did not adopt: a `DATA_DATES.pmsAnalytics` key (rejected by D70), the stash's own A1/A3/A4 gate variants (`main` carries PRs #4-#6, D70/D71), a fixed-position matrix footnote (replaced by C17 and D82) | VERIFIED per file; overall verdict INFERRED |
| Danger | **Applying or popping it would overwrite newer tools and revert Sep-2026 page data** (its `site/index.html` predates PR #13 and PR #18) | VERIFIED |
| Origin | uncommitted work of MOD-01's session `7628c9ae` that overlapped PRs #4-#6 (merged by NB-01 on 16-Oct) and the tool packages #7-#12 (memory note `fetch-before-branching.md`) | INFERRED |

**Recommendation: keep the stash. Do not drop, apply or pop it.** It is superseded but it is the only record of
that work-in-progress, and dropping is the owner's decision (DEC-OPEN-22). If the owner agrees, TASK-062: export
first (`git stash show -p --include-untracked stash@{0} > backups/<date>_stash-6cb0624.patch`), check the file
has 26 `diff --git` sections and about 1.4 MB, record it, then `git stash drop stash@{0}`. A fresh clone outside
OneDrive would not carry the stash (it was never pushed).

---

## 8. Ignored and local-only folders (names and counts only; contents not opened)

| Entry | What it holds | Size | Label |
|---|---|---|---|
| `monthly-updates/` | `00_INBOX/` (README only: no desk file has arrived); 7 data-month folders `2026-03_Mar-2026` ... `2026-09_Sep-2026` (subfolders `Analytics`, `_superseded`, `_review/run2_2026-10-19`, `_review/run3_2026-10-19` where present); `README.md`; `_handover_manifest.json`. 130 files. **No `2026-10_*` folder yet** | ~446 MB | VERIFIED |
| `backups/` | `2026-10-19_pre-sep-corrections/` (7 files = site state S1) and `2026-10-19_pre-c19-rebake/` (7 files = S3); `README.md`. None newer (PR #26 was a code change; no refresh since) | ~30 MB | VERIFIED |
| `handover-archive/` | 2 zips as received (4.8 MB and 206.4 MB), `HANDOVER_PRD_Centricity_Proposal.md`, `README.md`, `export_20261023/` (the outgoing owner's export: README and handover note, two part zips, checksum and placement logs, `extracted/` with `01_manifest` ... `07_related_portfolio_review`, 2,720 files, 0 cloud-only) | ~5.6 GB | VERIFIED |
| `_testdata/pptx-design-system/` | 42 files: PowerPoint design-system renders, montages, sample and stress decks, `bounds_check.txt` (22-Oct) | ~39 MB | VERIFIED |
| `.claude/worktrees/` | the two Claude desktop worktrees (section 6) | - | VERIFIED |
| `node_modules/` | 9 packages, 246 files (xlsx 0.18.5 and its dependencies) | ~13-15 MB | VERIFIED |
| `tools/__pycache__/` | 1 file | - | VERIFIED |

- `git status --ignored` prints about 60 "Filename too long" warnings, all under
  `handover-archive/export_20261023/extracted/06_claude_knowledge/` (ignored anyway; `core.longpaths` unset).
- `07_related_portfolio_review/` belongs to the sister Portfolio Review Dashboard project (out of scope; not opened; INFERRED from its name).
- Cloud-only placeholders in these folders: 0 (all local). Whether OneDrive's cloud holds copies: UNKNOWN (section 16).

---

## 9. Ownership of changes and overlap evidence

| Fact | Evidence | Label |
|---|---|---|
| PRs by chat: MOD-01 #1-#3, #7-#18, #24, #25, #28; NB-01 #4-#6; NB-02 #19-#23; NB-03 #26, #27 (NB-03 merged both) | transcripts, session list ([`CHAT_REGISTRY.md`](CHAT_REGISTRY.md)) | VERIFIED |
| No active task, no in-flight branch, no uncommitted code besides the package itself; no coding chat running | section 2; session list 28-Oct | VERIFIED |
| Past overlap 1: MOD-01's uncommitted work (now the stash) fixed A1/A3/A4 in parallel with NB-01's PRs #4-#6; merged by hand file by file on 19-Oct | memory note `fetch-before-branching.md`; section 7 | VERIFIED (note) |
| Past overlap 2: NB-03 worked in the shared main checkout and left it on `feat/pptx-design-system`; switching back caused INC-16 | chats record; memory note | VERIFIED |
| Other Claude sessions on this machine work on the sister Portfolio Review Dashboard in another folder and repo (EXT-PR-01, EXT-PR-02); they do not touch this repo | session list | VERIFIED |

Rule since 25-Oct: the main checkout is the Moderator's and stays on `main`; coding sub-chats work in their own
worktree; ownership of files is recorded in [`ACTIVE_CHANGE_REGISTER.md`](ACTIVE_CHANGE_REGISTER.md) before editing.

---

## 10. Runtime, toolchain and dependencies (VERIFIED)

| Tool | Version / location | Command |
|---|---|---|
| Node.js | v24.21.0 (`C:\dev\tools\node\node`) | `node --version` |
| npm | 11.19.0 | `npm --version` |
| Python | 3.14.4 (`%USERPROFILE%\AppData\Local\Python\bin\python`; no `py` launcher); numpy, pandas, openpyxl, python-dateutil present for `tools/build_risk_matrix.py` | `python --version`; `importlib.util.find_spec` |
| git | 2.56.0.windows.2 (PowerShell `C:\dev\tools\git\cmd\git.exe`; Git Bash `/ucrt64/bin/git`) | `git --version` |
| gh | 2.102.0 (2026-09-30) (`C:\dev\tools\gh\bin\gh`) | `gh --version` |
| PowerShell | Windows PowerShell 5.1.26100.9711; no `pwsh` 7 | `$PSVersionTable` |
| OS | Windows 11 Pro (NT 10.0.26300) | `[Environment]::OSVersion` |
| PowerPoint | installed; driven through COM by `tools/dev/render_pptx.ps1` (paths must be under 255 characters, section 15.1) | side-session notes, memory |

These equal `docs/DEVELOPMENT_SETUP.md:4`.

- `package.json`: `centricity-proposal-playbook` 1.0.0, private, `engines.node >=18`; scripts `serve`
  (`node .claude/serve.js`), `verify` (`node tools/verify_page.js site`), `test` (`node tools/test/run.js`), `rehearse`
  (`node tools/dev/rehearse.js`); one dependency `xlsx` **0.18.5** (exact), no devDependencies. `package-lock.json`
  pins it with sha512 integrity; installed `node_modules/xlsx` = 0.18.5. It must match the page's SheetJS; never
  upgrade without the owner (D67, R4, TASK-058).
- In-page CDN libraries: react 18.3.1 and react-dom 18.3.1 (unpkg), chart.js 4.4.0, xlsx 0.18.5, pptxgenjs 3.12.0
  (jsDelivr), all five with `integrity="sha384-..."` and `crossorigin="anonymous"` (D77). The page needs internet
  access to load them.
- Sibling load order in `site/index.html` (grep `<script src="Centricity_`): ExtraSlides and PMS_AIF_Terms in the
  head (~L1232-1233), then June_Refresh -> IRR_Offshore -> SIF_Refresh (~L5525-5527). The file ends `</body></html>`.

---

## 11. CI, GitHub settings and Pages (VERIFIED, read-only `gh api`, `cat .github/workflows/pages.yml`)

| Aspect | Value |
|---|---|
| Workflow | `.github/workflows/pages.yml` "Verify and publish dashboard" (83 lines); triggers: push to `main`, every pull_request, workflow_dispatch; `concurrency: pages-${{ github.ref }}`, no cancel-in-progress |
| Job `verify` | SHA-pinned checkout (`persist-credentials: false`) and setup-node (Node 24); (1) six deploy files present and non-empty; (2) `npm ci` + `node tools/test/run.js`; (3) `node tools/verify_page.js site`, failing on `MISSING SIBLING`, duplicate MASTER names not 0, file not ending `</html>`, script errors not 0, Centricity Select total not equal to keys present in MASTER. `robots.txt` is not in the presence check |
| Job `publish` | needs `verify`; only on `refs/heads/main` and not a PR; `pages: write`, `id-token: write`; uploads the whole `site/` folder (7 files), so CI cannot publish a partial deploy |
| Not checked by CI | a sibling that fails inside its try/catch (A30); the "top-10 Direct Equity are Large Cap" and "`DATA_DATES.sif` not -" invariants (A31); browser behaviour; deck bounds (manual) |
| Run history | 58 runs, 58 success (30 pull_request, 28 push); last: push of `2b2a397`, run 40503943213, 27-Oct-2026 12:27:52Z |
| Pages (new site) | `build_type: workflow`, `https_enforced: true`, public, no CNAME; https://productsteamcentricity.github.io/Centricity-Proposal-Playbook/ |
| Environment `github-pages` | custom deployment-branch policy: `main` only |
| Branch protection on `main` | **none** (`.../branches/main/protection` -> 404 "Branch not protected"); 0 rulesets; merge, squash and rebase all allowed; auto-merge off. "Merge only after `verify` passes" is a convention (R9, DEC-OPEN-17, TASK-036) |
| Other settings | default workflow token `read`, cannot approve PRs; 0 Actions secrets; wiki off; `delete_branch_on_merge: false` |
| Old site | upstream Pages `build_type: legacy` from `main` / root, status `built`; retirement PLANNED (owner, after full testing; DEC-OPEN-14, DEC-OPEN-24, TASK-034); R1 purge BLOCKED on the outgoing owner (TASK-033) |

---

## 12. Claude setup

### 12.1 Agents (`.claude/agents/*.md`, tracked, all `model: inherit`) - VERIFIED

| Agent | Tools | Purpose |
|---|---|---|
| docs-keeper | Read, Grep, Glob, Edit, Write, Bash | keeps CHANGELOG, PROJECT_STATE, update log, DECISIONS, KNOWN_ISSUES and CLAUDE.md counts true |
| financial-data-reviewer | Read, Grep, Glob, Bash | financial review of returns, IRR, look-through, credit buckets, risk ratios, PMS/AIF/SIF data, renames, exports |
| implementation-engineer | all | implements an approved, scoped change with verification and docs |
| principal-architect | Read, Grep, Glob, Bash (read-only) | reviews a proposed change against architecture and invariants |
| qa-verifier | all | independent verification: counts, page load, core flows, Excel/PowerPoint exports |
| release-manager | Bash, Read, Grep, Glob | branch, staged-scope review, commit, push, PR, merge, live-file check |
| repo-archaeologist | Read, Grep, Glob, Bash (read-only) | traces how something works today; never edits |
| security-reviewer | Read, Grep, Glob, Bash (read-only) | pre-push secrets and sensitive-data review |
| integration-guardian (ARC-01) | Read, Grep, Glob, Bash (read-only) | **added by the handover package** (9 agents after its merge): Gate B pre-check and diff review |

### 12.2 Skills, preview server, settings - VERIFIED

- Skills (`.claude/skills/`, tracked): `monthly-update` (73 lines; `/monthly-update <Month YYYY>`, `resume`) and
  `verify-dashboard` (26 lines; `live` adds the deployed-file hash check). Known stale lines: `SKILL.md:20, :31`
  use `git switch` (E7, overridden by CLAUDE.md "Project control" until fixed), `:39-41` says exit 1 on a missing
  file (E9), `:69` `--delete-branch` (E12).
- Preview: `.claude/launch.json` configuration **`playbook`** = `node .claude/serve.js`, port 8080,
  http://127.0.0.1:8080. `.claude/serve.js` binds 127.0.0.1 only and serves only `site/` (path-traversal guard,
  NUL rejected, `Cache-Control: no-store`, `PORT` override) (D66).
- No `.claude/settings.json` or `settings.local.json` in the repo: no project hooks or permission rules.

### 12.3 Memory, side-session notes and transcripts (outside the repo) - VERIFIED

| Item | Location | Content |
|---|---|---|
| Memory notes (5 files) | `%USERPROFILE%\.claude\projects\<slug>\memory\` | `MEMORY.md` (index), `user-product-owner.md`, `github-push-every-change.md`, `fetch-before-branching.md`, `node-stdin-and-onedrive-quirks.md`. Their procedures are now written out in sections 14-15 |
| Desktop side-session notes (3 files) | `%USERPROFILE%\AppData\Local\Claude-Data\claude_pzs8sxrjxfjjc\side-session-notes\local_11e29451-b340-463b-8289-9a30c5fa2173\` | `p1-tool-fixes_A1-A3-A4.md` (16-Oct), `p3-leftovers_PRs-19-23.md` (21-Oct), `pptx-design-system_plan.md` (22-Oct): MOD-01's notes on NB-01..NB-03; traps listed in section 15.2 |
| Transcripts | `%USERPROFILE%\.claude\projects\<slug>\` | MOD-01 `7628c9ae-33a1-4ba1-a4d9-bca35a44a511.jsonl` (15-Oct to 28-Oct 05:30Z) and `df00b5b0-8ce0-402b-9cbd-9bfedd047f08.jsonl` (28-Oct); NB-03 `1ffe6022-e7ad-4673-8c7c-602d97dee30c.jsonl`; NB-01 `acab20e6-cc42-45e8-aa66-822445bfe65d.jsonl` and NB-02 `4dd2f74d-0c16-41c3-80c0-452707770e58.jsonl` under the worktree slugs `<slug>--claude-worktrees-<name>` |

---

## 13. Verification results (28-Oct-2026)

### 13.1 Parity counts - `node tools/verify_page.js site` (repo root; = `npm run verify`)

Run by the fact-sheet investigators on 28-Oct-2026 (exit 0, ~0.7 s) and again by this writer at about 07:53 UTC
with the package edits present (docs only): identical output, exit 0. VERIFIED.

```
MASTER effective          7682
CENTRICITY_SELECT         178   (keys present in MASTER: 178)
  with rationale          133
  with risk ratios        46
  with details            51
PMS_PERFORMANCE.pms       692
PMS_PERFORMANCE.aif       12
PMS_PERFORMANCE.benchmark 4
PMS_PERF_ALIAS            27   (null pins: 4)
EQUITY_ANALYTICS          1205
RISK_MATRIX               1088
PMS_AIF_TERMS             73
EXTRA_SLIDES              6
DATA_DATES                {"performance":"30th September 2026","analytics":"30th September 2026","pms":"31st August 2026","sif":"30th September 2026","riskMatrix":"30 Sep 2026"}
duplicate MASTER names    0
file ends </html>         yes
MASTER PMS with perf      23 of 27

script errors (excluding the CDN globals): 0
```

Equals the CLAUDE.md headline and `docs/PROJECT_STATE.md:52-70` (line numbers at `2b2a397`). The "31st August 2026" PMS label sits over
31-Jul data (B1). `verify_page` runs the page scripts in a Node vm without a DOM: it does not test the React UI.

### 13.2 Unit tests - `npm test` (= `node tools/test/run.js`)

Run 28-Oct-2026: exit 0, ~15.9 s; tests write only to the OS temp folder (`git status` clean afterwards). VERIFIED.

```
PASS  blocklib.test.js             34 passed, 0 failed
PASS  dates.test.js                10 passed, 0 failed
PASS  parser_refresh_only.test.js  18 passed, 0 failed
PASS  pptx_layout.test.js          798 passed, 0 failed
PASS  tool_inputs.test.js          43 passed, 0 failed

5 of 5 test files passed
```

### 13.3 Live site

7 of 7 published files SHA-256-identical to `site/` at `2b2a397` (28-Oct ~05:52); legacy
`Centricity_Risk_Matrix.js` 404. Table and method: [`INTEGRATION_AND_REGRESSION_LOG.md`](INTEGRATION_AND_REGRESSION_LOG.md) section 7. VERIFIED.

### 13.4 Application startup in a browser (MOD-01's own check)

- Command: `preview_start` with the `playbook` configuration (= `node .claude/serve.js`, http://127.0.0.1:8080/)
  in the Claude desktop app's built-in browser (Chromium), working tree at `2b2a397`.
- Result after a 6-second settle: `document.title` "Centricity Investment Proposal Dashboard", `readyState`
  complete, React root rendered (header and "DATA REFRESH" panel visible); in-browser `MASTER` length **7,682**;
  `window.H`, `window.REFRESH`, `window.EXPORTS` present; sibling flags `__JUNE_REFRESH_APPLIED`,
  `__IRR_OFFSHORE_APPLIED`, `__SIF_REFRESH_APPLIED` all set; **0 console errors**. Preview server stopped afterwards.
  VERIFIED.
- Time: 28-Oct-2026 07:12:58-07:13:25 UTC (`preview_start` to `preview_stop` in MOD-01's transcript
  `df00b5b0-...jsonl`; VERIFIED 30-Oct-2026). The fact sheet's "about 08:55 UTC" was wrong.
- Not done: building a proposal and exporting PowerPoint and Excel. The last full browser acceptance (TESTING.md
  section 3, 7 areas) was on site state S6, 21-Oct-2026; after PR #26 only the live 4-fund deck export was checked
  (22-Oct). A full pass on S7, with the Excel file opened in Office, is TASK-064 (PLANNED).

### 13.5 PowerPoint render evidence

The 22-Oct-2026 COM bounds files in `%TEMP%\x\` were re-checked on 28-Oct with `node tools/dev/check_pptx_bounds.js`:
8 of 8 print "no problem found". `site/` and `tools/dev/` are unchanged since `5d39821`, so the renders still
describe the current code. Rendering is manual (`tools/dev/render_pptx.ps1`), not in CI. VERIFIED.

---

## 14. OneDrive and the `.git` object store

### 14.1 Facts (VERIFIED 28-Oct-2026)

| Fact | Value | Command |
|---|---|---|
| OneDrive client | **OneDrive.exe not running**; only `OneDrive.Sync.Service`, `FileCoAuth`, `FileSyncHelper` run. Installed at `C:\Program Files\Microsoft OneDrive\` | `Get-Process OneDrive -ErrorAction SilentlyContinue` (empty); `tasklist` |
| Folder pinned ("Always keep on this device") | **No**: the Pinned attribute (0x80000) is not set on the repo root, `.git`, `.git\objects\pack`, `site`, `monthly-updates` | `[int](Get-Item -Force <path>).Attributes` |
| `.git` cloud-only files | **229 of 519**: 8 of 20 files in `objects/pack` (`pack-631ec788....pack` 49.4 MB, `loose-ac30ca55....pack`, `loose-d67d144d....pack`, `loose-d9d3f75d....pack`, each with its `.rev`; attribute 4199968 = 0x401620 = Archive + Sparse + ReparsePoint + Offline + RecallOnDataAccess); their `.idx` files are local; 219 of 358 loose objects; `objects/bitmap-ref-tips_*`; a 0-byte `objects/maintenance.lock` (21-Oct) | PowerShell recursive attribute scan |
| Local packs | `pack-c985ee66...` (48.6 MB), `pack-282c37e0...` (72 KB), `multi-pack-index` | `Get-ChildItem .git\objects\pack` |
| Working tree | 0 cloud-only files in `site/`, `tools/`, `docs/`, `.claude/`, `.github/`, root files | attribute scan |
| What works | every blob of `main`'s tip tree reads; `git fsck --connectivity-only --no-dangling` exit 0; status, log, diff of recent tips, `git show main:<f>`, `verify_page`, `npm test` | per-object `git cat-file -p` |
| What fails | 87 historical blobs reachable from `main` (from commits of 19-Oct and 21-Oct: old CHANGELOG, PROJECT_STATE, KNOWN_ISSUES, DECISIONS, 4 old `site/index.html` versions, tools) and 16 stash blobs: `fatal: mmap failed: Invalid argument`. `git rev-list --objects main \| git cat-file --batch` exits 128. `upstream/main` and `handover-baseline` histories read fully | `git cat-file -p <blob>` |
| Remote copies | every committed object is on GitHub (sample blob fetched with `gh api .../git/blobs/<sha>`); the stash's objects are **not** (never pushed) | `gh api` |

### 14.2 Consequences

- Git memory-maps pack files. With OneDrive.exe stopped, Windows cannot recall a placeholder, so any command that
  needs an object stored only in a cloud-only file fails with `mmap failed`. At risk: `git log -p`, `git blame`,
  `git show <old>:<f>`, `git cat-file` on stash objects, `gc`/`repack`, a full `fsck`, and **`checkout`/`switch`/`merge`**,
  which can abort half-way and leave tracked files truncated or deleted (INC-16).
- OneDrive locks can make renames fail with EPERM/EBUSY/EACCES: `blocklib.writeFileAtomic` retries for 6.3 s
  (PR #20) and leaves the page untouched on a longer lock. `git worktree remove/prune`, `git fetch` and
  `git stash -u` have hit "Permission denied": check state after each instead of assuming it ran fully.
- KNOWN_ISSUES R6 still describes the read error as "Permission denied"; the error seen on 28-Oct is
  `mmap failed: Invalid argument` (R6 correction in this package). OneDrive guidance in
  `docs/DEVELOPMENT_SETUP.md:46`, `docs/MONTHLY_UPDATE_PROCESS.md:28`, `docs/PROJECT_STATE.md:234` (at `2b2a397`) and
  `docs/HANDOVER.md` section 8 describes a pinned, running OneDrive that does not exist today (E10).

### 14.3 Fixes waiting on the owner

- TASK-017 (owner action, P1): start OneDrive, set `<repo>` to "Always keep on this device", let the 229
  placeholders hydrate; then verify 0 Offline files under `.git` (section 18 PowerShell count),
  `git fsck --connectivity-only` exit 0, and that a read which fails today now works (for example
  `git cat-file -p stash@{0}:site/index.html | head -c 100`, and a read from `pack-631ec788...`).
- DEC-OPEN-19 / TASK-037: move the git clone out of OneDrive and keep only `monthly-updates/` there (R6 "suggested
  fix"). A fresh clone has a fully readable object store but no stash, and the Claude memory folder is keyed to the
  path slug, so it must be copied across (E16).

### 14.4 Safe procedures until TASK-017 passes (and good practice after)

**A. Never `git checkout`, `git switch` or `git merge` in the main checkout.** It stays on `main`. CLAUDE.md
"Project control" forbids checkout/switch there while any `.git` file is cloud-only (the memory note warns
that `git merge` can abort the same way); `SKILL.md` and `MONTHLY_UPDATE_PROCESS.md` still say `git switch` (E7;
fix in TASK-018).

**B. Coding work happens in a worktree.** In the Claude desktop app: `start_session` with `use_worktree: true`
(creates `.claude/worktrees/<name>` on its own session branch; create the task branch from current `origin/main`
inside it). From a shell: `git fetch origin`, then
`git worktree add <path> -b <task-branch> origin/main`. Use a short path (under 260 characters) for any worktree
that runs `tools/dev/rehearse.js` (section 15.2). INFERRED safe: a new worktree reads only current objects, which
are readable; the main checkout's files are not touched.

**C. Create a branch without checkout:** `git branch <new-branch> origin/main` (moves no file).

**D. Commit a chosen set of working-tree files without checkout - the temporary-index method.** Used by MOD-01
for the branches of PRs #8-#18, #24, #25 and #28 (19-27-Oct-2026, scratchpad script `mkbranch.sh`, based on
local `main`) and for PR #25's second commit `31af6b1`, with the temporary index inside the git directory (transcript `7628c9ae-...jsonl`; the
memory note `node-stdin-and-onedrive-quirks.md` gives it in short form). The block below is that method; it was
walked through end to end in a scratch clone outside OneDrive on 30-Oct-2026. Git Bash, one call, repo root:

```bash
git fetch origin
export GIT_INDEX_FILE="$(git rev-parse --git-dir)/index.tmp"   # a separate index; the real .git/index is not touched
rm -f "$GIT_INDEX_FILE"
git read-tree origin/main                    # start from the base commit's tree
git update-index --add -- <path1> <path2>    # exactly the files to commit, as they are in the working tree
# for a file to delete: git update-index --remove -- <path>   (the file must be gone from the working tree)
tree=$(git write-tree)
commit=$(git commit-tree "$tree" -p origin/main -F <message-file>)   # message file written with the Write tool
rm -f "$GIT_INDEX_FILE"; unset GIT_INDEX_FILE
git branch <new-branch> "$commit"            # HEAD and the working tree do not move
git diff --stat origin/main <new-branch>     # must list only the intended files
git push origin <new-branch>
gh pr create --base main --head <new-branch> --title "<title>" --body-file <body-file>   # non-interactive needs both
```

Stage files explicitly (never `git add -A`); run the secrets / client-data check before the push.

**E. Bring local `main` up to `origin/main` after a merge, without checkout** (used 27-Oct-2026 after the PR #28
merge, transcript `7628c9ae-...jsonl`; the 25-Oct recovery in F used the same two commands; only when the
working tree holds nothing but what was just merged, and local `main` has no commit `origin/main` lacks):

```bash
git fetch origin
git merge-base --is-ancestor main origin/main || echo "STOP: main has commits origin/main lacks"   # must print nothing
old=$(git rev-parse main)
git update-ref refs/heads/main origin/main "$old"   # HEAD is the symbolic ref to main, so HEAD moves too
git reset -q                                 # index = new HEAD; working-tree files untouched
git diff --name-status "$old" origin/main    # for each file changed by others: write it from its blob,
#   git cat-file blob "origin/main:<f>" > "<f>"   (delete the file instead if it was deleted)
git status --porcelain                       # must be empty
```

**F. Recover from an aborted checkout** (memory note, 25-Oct-2026): rewrite each damaged file from
`git cat-file blob HEAD:<f>`; then `git update-ref refs/heads/main origin/main`, `git symbolic-ref HEAD refs/heads/main`,
`git reset -q`, and write the files that differ (`git diff --name-only <old> origin/main`) from their blobs.

**G. Read a historical blob that fails with mmap:** fetch it from GitHub,
`gh api -H "Accept: application/vnd.github.raw+json" repos/productsteamcentricity/Centricity-Proposal-Playbook/git/blobs/<sha> > <file>`,
then confirm `git hash-object <file>` prints the same `<sha>` (without `-w` it writes nothing).

**H. Export the stash:** `git stash show -p --include-untracked stash@{0}` works today (section 7); `git cat-file`
on its blobs does not.

---

## 15. Knowledge that lived only outside the repository

Until this package these procedures existed only in Claude's per-machine memory and in desktop-app notes (E16).
They are now recorded here; TASK-071 moves them into the operator docs (DEVELOPMENT_SETUP, OPERATING_MANUAL, TESTING).

### 15.1 Memory-only procedures (from `%USERPROFILE%\.claude\projects\<slug>\memory\`, read 28-Oct-2026)

| Procedure | Rule |
|---|---|
| Temporary-index commit | section 14.4 D (`GIT_INDEX_FILE`, `read-tree`, `update-index --add`, `write-tree`, `commit-tree`, `branch`) |
| Advance or repair `main` without checkout | sections 14.4 E and F |
| Escapes get decoded | In a Bash heredoc `\uXXXX` arrives as the real character and `\\` as one `\`; the Edit tool once wrote a literal dagger into `site/index.html`, which keeps it escaped. Node 24 `node -` and `node -e` also mangle escapes. Write scripts with the Write tool and run them from files; build awkward characters with `String.fromCharCode(92)` or `String.fromCharCode(0x2020)`; afterwards check that added lines are ASCII: `git diff -U0 \| grep -P '[^\x00-\x7F]'` |
| gh default repo | `gh repo set-default productsteamcentricity/Centricity-Proposal-Playbook` once per clone; check with `gh repo set-default --view`. Without it `gh pr` targets the read-only upstream |
| Fetch first | before branching, committing or opening a PR: `git fetch`, `git status -sb`, `git log main..origin/main`; if `origin` moved, read the new commits and list the desktop sessions (`list_sessions`) before planning. Other sessions merge PRs too (19-Oct: local `main` was 10 commits behind; D-number collision) |
| PowerPoint COM short paths | PowerPoint opens files only on paths under 255 characters: copy decks to `%TEMP%\x\` first; the Claude scratchpad path is too long |
| OneDrive locks | see section 14.2 |
| Owner profile and publishing rule | the owner is the product owner and does not run git; every change goes branch -> PR -> `verify` -> merge; monthly refreshes auto-publish when every check passes (D61), corrections and judgement calls wait for the owner (also in CLAUDE.md) |

### 15.2 Traps recorded only in the desktop side-session notes (3 files, section 12.3)

- `tools/dev/rehearse.js` spawns tools with `cwd` = the new root: on Windows that root must be a short path (under
  260 characters) or every step returns `exit=null` (ENOENT from CreateProcess). Since PR #23 spawn errors are logged.
- `rehearse.js` with `--apply` runs `rename_schemes` first, so the Sep chain applies the 8 pending renames: the C19
  re-run shows 223 MASTER records (215 + 8), not 215.
- Getting a deck out of the built-in browser pane: a localhost-only receiver (`%TEMP%\x\receiver.js`, port 8099,
  POST base64) saved the exports; `write({outputType:'base64'})` is slow (~9 s) when the pane is hidden; JSZip is a
  page global.
- The PR #26 export section was authored in `%TEMP%\x\pptx_section.js` and spliced into `site/index.html` by
  `%TEMP%\x\splice.js` between the markers `  // ===== PPTX export =====` and
  `  // _ds: the presentation design system, read-only`.
- pptxgenjs 3.12 adds 0.1"/0.05" cell margins to any cell without `margin`; table width = sum of column widths; a
  PowerPoint row is about 0.1" + lines x 1.2 x pt/72.
- NB-02 removed 33 old `%TEMP%\rehearse-*` folders (disposable harness output).

---

## 16. Local-only items that are sensitive or the only copy

**Risk:** OneDrive.exe is not running, so nothing under `<repo>` is being synced: whether OneDrive's cloud holds
copies of the git-ignored folders is **UNKNOWN**. Items under `%TEMP%`, `%USERPROFILE%\.claude` and
`%USERPROFILE%\AppData\Local\Claude-Data` are outside OneDrive altogether, and Windows may clean `%TEMP%` at any
time. Only committed and pushed content (`origin`) is known to be safe. Inventory and securing: TASK-070 (after TASK-017); R10, R11.

| Item | Where | Why it matters | Sensitive | Only copy | Action |
|---|---|---|---|---|---|
| B8 toolchain (221 files: 18 `.cs`, 79 `.ps1`, others) | `handover-archive/export_20261023/extracted/05_project_working_folder/_nav_risk_toolchain/` (git-ignored) | the only source for building the NAV Data and Fund Risk Ratios workbooks in-house (B8, DEC-OPEN-01, TASK-022) | not assessed (not opened by this writer) | **yes** (outside the outgoing owner's systems) | keep; confirm a cloud copy once OneDrive runs (TASK-070) |
| Two client items and the R1 repo zip | `handover-archive/` | client data shipped in the export (R8, R1) | **yes** | - | never commit, push, quote or delete; owner + compliance decide (DEC-OPEN-05, TASK-032) |
| `ref.pptx` (12,479,153 B, 22-Oct) | `%TEMP%\x\` | INFERRED a copy of the client reference deck used for PR #26; **not opened**; no ignore rule applies outside the repo | **possibly** (client data) | unknown | never commit or quote; owner decides keep (controlled place) or delete (R10) |
| Raw PowerPoint COM bounds files (`b_*.jsonl`), montages (`m_*.png`), deck authoring source (`pptx_section.js`, 78,926 B), `splice.js`, `receiver.js`, generated decks (`cur.pptx`, `final2.pptx`) | `%TEMP%\x\` | the 22-Oct render evidence for REQ-PPT-129 and the tools behind section 15.2 | decks not opened by this writer | **yes** | copy the non-deck evidence into `_testdata/` or record it, TASK-070 |
| `wt_snapshot` (40 files) | `%TEMP%\claude\<slug>\7628c9ae-33a1-4ba1-a4d9-bca35a44a511\scratchpad\wt_snapshot\` | readable copy of the stash's blobs | no (superseded tool and doc work) | second copy besides the stash | keep until the stash decision (TASK-062) |
| Stash objects | local `.git` only | never pushed; 16 blobs cloud-only | no | yes | section 7 |
| PowerPoint design-system renders and sample decks (42 files) | `_testdata/pptx-design-system/` (git-ignored) | PR #26 deliverables (REQ-PPT-135, -136) | sample decks from test portfolios (INFERRED) | yes | confirm cloud copy (TASK-070) |
| Desk source workbooks (130 files) | `monthly-updates/` | inputs of every refresh; the Oct-2026 cycle needs prior months | vendor and desk data | yes (locally) | never commit; confirm cloud copy |
| Pre-refresh backups (2 x 7 files) | `backups/` | recovery points (INTEGRATION_AND_REGRESSION_LOG section 3) | no | the committed history also holds these states | retention rule TASK-063 |
| Memory notes, transcripts, side-session notes | `%USERPROFILE%\.claude\projects\<slug>\`, `%USERPROFILE%\AppData\Local\Claude-Data\...` | conversation history and per-machine procedures (now copied into this file) | transcripts may quote file contents (not reviewed for client data) | yes | keep; copy the memory folder across if the clone moves (TASK-037, E16) |
| Rehearsal worktree | `%TEMP%\cpp-old` | none (clean, merged commit) | no | no | remove after approval (TASK-061) |

---

## 17. Open items for this area

| ID | Item | Status |
|---|---|---|
| TASK-016 | MOD-02 validates this snapshot against the repo (section 18) and records the result | PLANNED |
| TASK-017 | Restore OneDrive health (owner) and verify | NOT STARTED |
| TASK-018 | Docs-consistency PR (E7, E10, E11, E12 and others) | NOT STARTED |
| TASK-037 / DEC-OPEN-19 | Move the clone out of OneDrive | BLOCKED (owner decision) |
| TASK-059, TASK-060, TASK-061, TASK-062 / DEC-OPEN-22 | Delete merged branches, remove worktrees, export then drop the stash | NOT STARTED (owner OK needed) |
| TASK-063 | Retention rule for `backups/` | UNKNOWN / NEEDS INVESTIGATION |
| TASK-064 | Full browser acceptance on S7 | PLANNED |
| TASK-070 | Inventory and secure local-only artefacts | NOT STARTED |
| TASK-071 | Move memory-only procedures and side-note traps into operator docs | PLANNED |
| TASK-072 | Fresh-clone setup test outside OneDrive | NOT STARTED |
| TASK-036 / DEC-OPEN-17 | Branch protection on `main` (R9) | BLOCKED (owner) |
| R6, R9, R10, R11, E16 | KNOWN_ISSUES entries for this area | EXISTING DEFECT |

---

## 18. How to refresh this snapshot

All commands are read-only except `git fetch`, which only updates remote-tracking refs (under OneDrive it can
report "Permission denied": check its result). Run from `<repo>`; Git Bash unless marked PowerShell. Compare each
result with the section named.

```bash
# Identity and sync (sections 2-3)
git fetch origin
git status --porcelain=v1 -b                 # expect "## main...origin/main" and no other lines once the package is merged
git rev-parse HEAD origin/main upstream/main
git log --first-parent --oneline -5 main
git remote -v                                # upstream push URL must read DISABLED-read-only-reference
gh repo set-default --view                   # expect productsteamcentricity/Centricity-Proposal-Playbook
git tag -l; git rev-parse "handover-baseline^{commit}"   # expect 862e40b...
git rev-list --count 862e40b..main
git ls-files | wc -l

# Branches, worktrees, stash (sections 5-7)
git branch --no-merged main                  # expect empty
git branch -r --no-merged origin/main        # expect only upstream/main
git for-each-ref --format='%(refname:short) %(objectname:short) %(committerdate:short)' refs/heads
git worktree list --porcelain
git worktree prune -n -v                     # dry run only
git stash list --date=iso
gh pr list --state open                      # expect empty

# Ignored and local-only folders (section 8)
git status --ignored --short 2>/dev/null | grep '^!!'
find monthly-updates -type f | wc -l; ls monthly-updates backups

# Object store health (section 14)
git fsck --connectivity-only --no-dangling; echo "fsck exit=$?"
git count-objects -vH

# Tests (section 13)
node --version; npm --version; git --version; gh --version
node tools/verify_page.js site; echo "exit=$?"
npm test

# GitHub, CI, Pages (section 11)
gh run list --limit 5
gh api repos/productsteamcentricity/Centricity-Proposal-Playbook --jq '{visibility, default_branch, delete_branch_on_merge, pushed_at}'
gh api repos/productsteamcentricity/Centricity-Proposal-Playbook/pages --jq '{build_type, html_url, https_enforced}'
gh api repos/productsteamcentricity/Centricity-Proposal-Playbook/branches/main/protection   # 404 = not protected
gh api repos/magazineishita1108-boop/Centricity-Proposal-Playbook --jq '{pushed_at, archived, visibility}'

# Live parity, all 7 published files (INTEGRATION_AND_REGRESSION_LOG section 7)
B=https://productsteamcentricity.github.io/Centricity-Proposal-Playbook
for f in index.html Centricity_ExtraSlides.js Centricity_PMS_AIF_Terms.js Centricity_June_Refresh.js Centricity_IRR_Offshore.js Centricity_SIF_Refresh.js robots.txt; do
  l=$(curl -s --compressed "$B/$f" | sha256sum | cut -c1-64); s=$(sha256sum "site/$f" | cut -c1-64)
  if [ "$l" = "$s" ]; then echo "MATCH $f"; else echo "DIFF  $f"; fi
done
curl -s -o /dev/null -w '%{http_code}\n' "$B/Centricity_Risk_Matrix.js"   # expect 404
```

```powershell
# OneDrive state (section 14), PowerShell from <repo>
Get-Process OneDrive -ErrorAction SilentlyContinue          # nothing printed = OneDrive.exe not running
([int](Get-Item -Force .).Attributes -band 0x80000) -ne 0   # True = pinned ("Always keep on this device")
Get-ChildItem -Force .git\objects\pack | Select-Object Name, Length, Attributes
(Get-ChildItem -Force -Recurse -File .git | Where-Object { ([int]$_.Attributes -band 0x1000) -ne 0 }).Count   # Offline (cloud-only) files; 229 on 28-Oct
```

Browser startup (section 13.4): in the Claude desktop app `preview_start` with name `playbook` (or
`node .claude/serve.js` and open http://127.0.0.1:8080/); after a few seconds check in the page console that
`MASTER.length` is 7682, `window.__JUNE_REFRESH_APPLIED`, `window.__IRR_OFFSHORE_APPLIED` and
`window.__SIF_REFRESH_APPLIED` are set, and the console shows no error; stop the server afterwards.

Record the refresh: update the header Date, mark each section VERIFIED with the new date, and note any difference
from this 28-Oct-2026 snapshot in [`../PROJECT_STATE.md`](../PROJECT_STATE.md).

## Appendix A. Key numbers K01-K35 and site states S0-S7 (snapshot of 28-Oct-2026)

Other package files cite these labels (for example "K11" for the `verify_page` counts). This table is the
canonical list, copied from MOD-01's working notes on 28-Oct-2026; the "Source" column names those notes
(fact sheets kept only in MOD-01's scratchpad, not in the repository) and says how each value was checked.
Re-check a value with the commands in this file before relying on it; the code and git win.

| # | Item | Value | Source | Label |
|---|---|---|---|---|
| K01 | Upstream (outgoing owner) tip | `72e1f1e` (14-Oct-2026; last push 14-Oct-2026 10:37Z; upstream repo public, not archived; its Pages site still built from it) | repo_env 1, critic 3b | VERIFIED |
| K02 | Handover baseline | annotated tag `handover-baseline` (tag object `4e4cfbf`) -> commit `862e40b`, the sanitised equivalent of upstream `72e1f1e` (trees differ only in the 8-line client-name redaction of `Portfolio_Review_Build_Prompt.md`, D64; 74 commits each). CLAUDE.md's "= upstream 72e1f1e" means "equivalent of". | repo_env 1, integration 1a | VERIFIED |
| K03 | Transfer baseline | `25e71a3` = PR #1 merge (16-Oct-2026 07:15 UTC): reorganised into `site/`, `tools/`, `docs/`; `site/` bytes identical to `862e40b`; first publish run 38866042211 (8 live files = `site/`). `bf20c08` = PR #2 merge (post-transfer record). | integration 1b, 2; `git log -1` (W-ids, 28-Oct) | VERIFIED |
| K04 | Current main (code and data baseline of the package) | `2b2a397` = `origin/main` = PR #28 merge (27-Oct-2026 12:27 UTC, docs only) | repo_env 1; `git rev-parse` (W-ids) | VERIFIED |
| K05 | Last site-changing merge | `5d39821` (PR #26, 22-Oct-2026) = site content state S7; `site/` unchanged through `5bcce88` (PR #27) and `2b2a397`. Live and local `index.html` SHA-256 `916f2455eebaf2362e60a97314203e8ffc52955892cfa04a5c5248301ac62ce3` (12,864,963 B) | integration 1b, 4 | VERIFIED |
| K06 | Last full 7-area browser acceptance | site state S6 (`1523bbc` / `882160c`, 21-Oct-2026, all 7 areas PASS, recorded by PR #25). After PR #26 only a live 4-fund deck export (22-Oct: 23 slides, no layout warning) was re-checked. | integration 1c; `docs/PROJECT_STATE.md:92-109` | VERIFIED (doc record) |
| K07 | App startup in a browser | 28-Oct-2026 ~08:55 UTC, `preview_start playbook` at `2b2a397`: title "Centricity Investment Proposal Dashboard", React root rendered, in-browser MASTER 7,682, `window.H`/`REFRESH`/`EXPORTS` present, `__JUNE_REFRESH_APPLIED`/`__IRR_OFFSHORE_APPLIED`/`__SIF_REFRESH_APPLIED` set, 0 console errors. NOT done: building a proposal and exporting PowerPoint/Excel. | startup.md | VERIFIED |
| K08 | Commits | main has 143 commits; 69 since `862e40b` = 38 non-merge + 28 PR merges + 3 other merges (`18abff3` = PR #23's A27 implementation committed as a merge commit; `75256ea` sync inside #22; `aa83993` inside #19). 0 revert commits. | critic C-07; `git rev-list --count` (W-ids) | VERIFIED |
| K09 | Pull requests | 28 (#1-#28), all MERGED, 16-Oct to 27-Oct-2026; 0 open PRs, 0 open issues. `site/` changed by #1 (move only), #12, #13, #17, #18, #21, #22, #26; data changed by #13 and #18 only; only #18 and #26 waited for owner approval. No PR reviews recorded on GitHub. | integration 2 | VERIFIED |
| K10 | PRs by chat | MOD-01: #1-#3, #7-#18, #24, #25, #28. NB-01: #4-#6. NB-02: #19-#23. NB-03: #26, #27 (NB-03 merged both). | chats.md; critic C-09 | VERIFIED |
| K11 | `node tools/verify_page.js site` (28-Oct-2026, exit 0) | MASTER effective 7682; CENTRICITY_SELECT 178 (178 in MASTER; rationale 133, risk ratios 46, details 51); PMS_PERFORMANCE pms 692 / aif 12 / benchmark 4; PMS_PERF_ALIAS 27 (4 null pins); EQUITY_ANALYTICS 1205; RISK_MATRIX 1088; PMS_AIF_TERMS 73; EXTRA_SLIDES 6; DATA_DATES performance / analytics / sif "30th September 2026", pms "31st August 2026", riskMatrix "30 Sep 2026"; 0 duplicate MASTER names; ends `</html>`; MASTER PMS with perf 23 of 27; 0 script errors. Equals the CLAUDE.md headline. | repo_env 12; re-run by critic | VERIFIED |
| K12 | `npm test` (28-Oct-2026, exit 0) | 5 of 5 files, 903 checks, 0 failures: blocklib 34, dates 10, parser_refresh_only 18, pptx_layout 798, tool_inputs 43 | repo_env 12, pptx_requirements 4, integration 1c, interfaces | VERIFIED |
| K13 | Live-site parity (28-Oct-2026) | 7 of 7 published files (index.html, 5 siblings, robots.txt) SHA-256 identical to `site/`; legacy `Centricity_Risk_Matrix.js` 404 (D78) | integration 4, repo_env 12, critic 3b | VERIFIED |
| K14 | Old site | `https://magazineishita1108-boop.github.io/Centricity-Proposal-Playbook/` HTTP 200; serves the handover baseline S0 (index.html SHA-256 `5872958ddacd728b...`, 12,827,311 B, Last-Modified 14-Oct-2026); 7 site-changing merges behind the new site | integration 4 | VERIFIED |
| K15 | CI | 58 workflow runs, 58 success (30 pull_request, 28 push; every push run verify + publish success); last run 40503943213 (push of `2b2a397`, 27-Oct-2026 12:27:52Z); deployment 7358413557 | integration 5a, repo_env 10, critic 3b | VERIFIED |
| K16 | GitHub settings | repo public; Pages `build_type: workflow`; `main` NOT protected, 0 rulesets; `delete_branch_on_merge: false`; environment `github-pages` deploys from `main` only; 0 Actions secrets; `gh repo set-default` = origin | integration 5c, repo_env 1, 6, 10 | VERIFIED |
| K17 | Data as on (page labels) | performance and analytics "30th September 2026"; SIF "30th September 2026" (effective value set by the SIF sibling; the block holds a "-" placeholder); risk matrix "30 Sep 2026"; PMS "31st August 2026" over 31-Jul-2026 data (B1) | verify_page 28-Oct; KNOWN_ISSUES B1 | VERIFIED (labels); PMS content INFERRED from doc |
| K18 | Data as on (other) | AIF performance and Centricity Select 31-Aug-2026; PMS/AIF look-through 31-Jul-2026; fund managers = the 30-Sep Monitor's first-named manager only (C15); the 214 funds on the four refresh-only Monitor sheets refreshed to 30-Sep in Sep Run 3 (21-Oct-2026); JioBlackRock G-Sec record held (C16, C20) | CLAUDE.md headline; PROJECT_STATE | INFERRED (doc; not re-derived) |
| K19 | KNOWN_ISSUES | 93 rows: Open 43, Partly fixed 12, Fixed 1 (C19), Accepted 4 (C12, R2, R4, E1), Closed 33; 60 not closed; open P1: B8, C20, R1, R8. Highest IDs: A28, B9, C40, R8, E5, F3. Groups: A tools, B inputs, C data/UI/code, R repo/security/hosting, E docs, F small leftovers. | open_work 1a; critic 3b; summary table read by W-ids | VERIFIED |
| K20 | Decisions | D1-D83 (83 entries, never reused); Open: D2 (= C1), D58 (= C11); D43 "Active (premise reopened)" (B8, A22); Superseded: D4, D5, D41, D45, D69. Next free D84. | `docs/DECISIONS.md` index (read by W-ids); critic 3b | VERIFIED |
| K21 | Requirements | REQ-001..REQ-095: VERIFIED COMPLETE 49, IMPLEMENTED NOT FULLY VERIFIED 10, IN PROGRESS 35, PLANNED 1; by workstream GOV 58, EX 25, NB 8, OPS 4. REQ-PPT-01..153: VERIFIED COMPLETE 118, IMPLEMENTED NOT FULLY VERIFIED 34, BLOCKED 1 (REQ-PPT-93). | section 3 (counted by W-ids) | VERIFIED |
| K22 | `monthly-updates/` | 7 data-month folders `2026-03_Mar-2026` ... `2026-09_Sep-2026`, plus `00_INBOX/` (README only: no desk file has arrived), README, `_handover_manifest.json`; 130 files, ~446 MB; no `2026-10_*` folder | repo_env 7, open_work 0 | VERIFIED |
| K23 | `backups/` | `2026-10-19_pre-c19-rebake/`, `2026-10-19_pre-sep-corrections/` (7 files each); none newer | repo_env 7 | VERIFIED |
| K24 | Branches | local: 26 besides `main`, all merged (incl. local-only `claude/adoring-boyd-7028f6`, `claude/focused-wright-d50bee`); origin: 25 merged feature branches (PR #4-#28) + `main`; branches of PRs #1-#3 already deleted; `upstream/main` is the only unmerged ref (expected: pre-sanitisation history; never push it) | repo_env 3, integration 6 | VERIFIED |
| K25 | Worktrees | 3 registered besides the main checkout (4 with it), all clean, on merged commits: `.claude/worktrees/adoring-boyd-7028f6` (`fix/a27-rehearse-old-site` `18abff3`, NB-02's), `.claude/worktrees/focused-wright-d50bee` (`fix/reckoner-drop-gates` `fe060d5`, NB-01's), `%USERPROFILE%\AppData\Local\Temp\cpp-old` (detached `bf20c08`, created 16-Oct-2026 13:13 UTC for the PR #3 rehearsal). Also 2 stale admin dirs `.git/worktrees/cpp-main`, `.git/worktrees/wtdocs` (prunable). | repo_env 4; critic C-06; `git worktree list` (W-ids) | VERIFIED |
| K26 | Stash | 1 entry: `stash@{0}` = `6cb0624`, 19-Oct-2026 12:02 IST, "On fix/tools-core-dates: phase2-rest (snapshot in scratchpad/wt_snapshot)"; base `8e65de1` (not in main); 23 tracked files (+1,627/-698: `site/index.html`, `site/Centricity_SIF_Refresh.js`, `docs/PRD.md`, `docs/README.md`, 19 tools) + 3 untracked. Per-file verdict: 8 identical to main, 18 superseded, 0 unique work; applying it would revert Sep-2026 page data. 16 blobs fail `git cat-file` (mmap), but `git stash show -p --include-untracked stash@{0}` exported all 26 files (1,408,451 B) on 28-Oct. Conclusion: safe to drop only after the patch is exported to `backups/` and the owner agrees (TASK-062). | repo_env 5; critic C-05 | VERIFIED per file; overall verdict INFERRED |
| K27 | OneDrive and `.git` | OneDrive.exe not running (only OneDrive.Sync.Service, FileCoAuth, FileSyncHelper); repo folder not pinned ("Always keep on this device" not set); 229 of 519 `.git` files cloud-only (8 in `objects/pack`: 4 `.pack` + 4 `.rev`, attribute 4199968; 219 of 358 loose objects). Current tree readable and `git fsck --connectivity-only` passes; 87 historical blobs and the stash blobs fail with `fatal: mmap failed: Invalid argument`. | repo_env 9, critic 3b | VERIFIED |
| K28 | Working tree | clean at `2b2a397` when the fact sheets ran. While ids.md was written, `CLAUDE.md` and `docs/README.md` carried MOD-01's uncommitted package edits (TASK-015; e.g. the new "Project control" section with the no-checkout rule). | fact sheets; `git status` (W-ids, 28-Oct) | VERIFIED |
| K29 | Tracked files | 102 | repo_env 2 | VERIFIED |
| K30 | Toolchain | Node v24.21.0, npm 11.19.0, git 2.56.0.windows.2, gh 2.102.0, Python 3.14.4, Windows PowerShell 5.1; `xlsx` 0.18.5 (Node and page); CDN React / ReactDOM 18.3.1, Chart.js 4.4.0, pptxgenjs 3.12.0, all with SRI | repo_env 8 | VERIFIED |
| K31 | `site/index.html` | 12,864,963 B, 9,575 split lines, ends `</body></html>`; 24 script tags (5 CDN, 2 head siblings, 3 body siblings, 14 inline); siblings at ~L1232-1233 and ~L5525-5527 (June -> IRR/Offshore -> SIF) | architecture_map 1.1 | VERIFIED |
| K32 | MOD-01 context state | 2 automatic compactions (19-Oct-2026 06:28:17Z, 27-Oct-2026 12:24:37Z). `df00b5b0` starts from a copy of the 27-Oct summary (same timestamp), not a third compaction. The handover is ordered by the owner (Moderator replacement), not by the three-compaction trigger. | chats.md; critic C-01 | VERIFIED |
| K33 | Calendar | Sep-2026 Reckoner catch-up due now, BLOCKED (inbox empty); Oct-2026 MF cycle ~13-17-Nov-2026 (PLANNED); Oct-2026 Reckoner cycle ~20-28-Nov-2026; implied decision deadline ~13-Nov-2026 for DEC-OPEN-01/02/03/08 | open_work 5 | INFERRED (documented cadence) |
| K34 | Agents and skills | 8 specialist agents (`.claude/agents/`) + `integration-guardian` added by the package (9 after merge); skills `monthly-update` (73 lines), `verify-dashboard` (26 lines) | repo_env 11; package_design | VERIFIED (8); PLANNED (9th) |
| K35 | Package branch | `handover/mod-01-to-mod-02-20261028`, created and merged by MOD-01. Its merge SHA and PR number are not known yet: write "the merge of `handover/mod-01-to-mod-02-20261028`". | package_design | PLANNED |

### A.2 Site-content states (canonical labels S0-S7, from integration.md 1b)

| State | Merges | What changed in `site/` |
|---|---|---|
| S0 | `862e40b` -> `25e71a3` (#1) ... `d260cdf` (#11) | baseline bytes (moved to `site/`); still served by the old site |
| S1 | `792692d` (#12) | true workbook dates, risk dagger, shared-link banner, SRI, noindex, favicon; risk-matrix file archived |
| S2 | `10cb44c` (#13) ... `6dc08ef` (#16) | Sep Run 2 data (inception +1 day, 33 risk flags) |
| S3 | `8e187ae` (#17) | C19 parser code (refresh-only sheets) |
| S4 | `f37fa01` (#18) ... `0cb7e95` (#20) | Sep Run 3 data (214 funds) |
| S5 | `75538de` (#21) | C17 matrix footnote shrink |
| S6 | `fb9cbd6` (#22) ... `83f777c` (#25) | Select popover dagger (C18); last full browser acceptance (21-Oct) |
| S7 | `5d39821` (#26) -> `5bcce88` (#27) -> `2b2a397` (#28) | PowerPoint design system (D82) and `*` marker (D83); current |

---

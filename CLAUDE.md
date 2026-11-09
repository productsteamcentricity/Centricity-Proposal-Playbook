# Centricity Proposal Playbook — instructions for Claude Code

**What it is.** The Centricity Investment Proposal Dashboard: a static, build-less React page the
Products team uses to build investment proposals for HNI / UHNI / Family Office clients (pick from
~7,700 instruments, allocate a corpus, export a branded PowerPoint and Excel). All data is embedded
in the page. The owner (Centricity Products team, GitHub `productsteamcentricity`) is the product
owner; you handle the technical execution, git and GitHub, testing and documentation.

**First, every session:** read [`docs/PROJECT_STATE.md`](docs/PROJECT_STATE.md) (where things stand)
and skim [`docs/README.md`](docs/README.md) (doc map). For a monthly refresh the owner types
`/monthly-update <Month YYYY>`; if they ask in plain words instead, Read
`.claude/skills/monthly-update/SKILL.md` and follow it step by step. Verify facts against the code,
not against documents.

## Repository map (the workspace folder IS the git repo)

| Path | What | Git |
|---|---|---|
| `site/` | **The dashboard = the six-file deploy set**: `index.html` + `Centricity_ExtraSlides.js`, `Centricity_PMS_AIF_Terms.js`, `Centricity_June_Refresh.js`, `Centricity_IRR_Offshore.js`, `Centricity_SIF_Refresh.js` (+ `robots.txt`). Published to GitHub Pages. | tracked |
| `tools/`, `tools/lib/` | Monthly Node tools (dry-run by default) + `build_risk_matrix.py`; shared libraries | tracked |
| `docs/` | PRD, operating manual (trap catalogue), architecture, process, decisions, state, issues, update logs; `project-control/` (multi-chat registers) and `handover/` (handover packages, successor prompts) | tracked |
| `.claude/` | `agents/` (9 specialists incl. `integration-guardian`), `skills/` (`monthly-update`, `verify-dashboard`), `serve.js`, `launch.json` | tracked |
| `.github/workflows/pages.yml` | Parity gate on every PR, push to `main` and manual run; publishes `site/` from `main` | tracked |
| `monthly-updates/` | `00_INBOX/` (owner drops files) + one folder per data month | **local only** |
| `backups/`, `handover-archive/` | Pre-refresh snapshots; the handover zips as received | **local only** |

## Commands (from the repo root)

```bash
npm ci                                   # once per machine (xlsx 0.18.5 — must match the in-page SheetJS)
node tools/verify_page.js site           # true in-browser counts (npm run verify)
node .claude/serve.js                    # preview at http://127.0.0.1:8080/ (or preview_start "playbook")
node tools/<tool>.js …                   # dry-run; add --apply only after reading every gate
```
Three tools have no default target and need `--html site/index.html`: `merge_pms_performance.js`,
`pin_pms_alias.js`, `merge_reckoner.js`. Full tool index: [`tools/README.md`](tools/README.md).

## Rules that protect production (details: `docs/OPERATING_MANUAL.md` → Traps)

1. **A deploy is six files.** `index.html` alone silently reverts data. Sibling load order
   June → IRR/Offshore → SIF is load-bearing; siblings re-apply on every load, so data a sibling
   owns must be changed in the sibling (PRD §11.5).
2. **Never Read `site/index.html` whole** (12.8 MB, multi-MB lines). Use Grep `-o`/`-n`, Read with
   offset/limit, or Node `fs`. Never regex its data lines in PowerShell. Data blocks change only via
   `tools/lib/blocklib.js`. The file must end with `</body></html>`.
3. **Dry-run first, read the gates, back up** the six files to `backups/<date>_<tag>/` in the main checkout
   (an absolute path: a worktree keeps no `backups/`) before `--apply`.
4. **Scale:** MASTER returns/IRR/expense are decimals (0.12 = 12%); analytics weights are percent;
   MF and SIF Monitor returns are always percent → ÷100, never auto-detect.
5. **Report, never guess** ambiguous matches (renames, PMS pins, Reckoner names, uploads). Ask the owner.
6. **No fabricated data** in client-facing output (no holdings fallback, MLD unrated → "Unrated").
7. **Rename before bake** (`tools/rename_schemes.js` first, every month). The Monitor decides spellings.
8. **Single predicates:** `H.isHybridScheme`, `H.isEquitySIF`, `H.isSelfDescribingDebt`,
   `H.creditBucket`. Deliberate oddities stay (`Mutual Funds` plural, hand-animated nav scroll,
   12 unclassified legacy SIF rows, dead code kept for parity).
9. **Invariants:** 0 duplicate MASTER names; Centricity Select keys in MASTER = total; top-10 Direct
   Equity by market cap are "Large Cap"; `DATA_DATES.sif` is not "—".
10. **PowerPoint layout goes through the export's design system** (D82): no fixed rows per slide,
    row heights or note positions; check a change with `npm test` and a PowerPoint render
    (`tools/dev/render_pptx.ps1` + `check_pptx_bounds.js`; OPERATING_MANUAL → "The deck is laid out by measurement").

## How every change is made

1. Understand the request; investigate the code (use `repo-archaeologist`); for anything material,
   plan it (`principal-architect`; `financial-data-reviewer` if financial logic or data is touched).
2. Branch from `main`: `data/<YYYY-MM>`, `feat/…`, `fix/…`, `docs/…`, `chore/…`; chat handovers use
   `handover/<from>-to-<to>-<YYYYMMDD>` and `continuation/<chat-id>-task-<id>-<YYYYMMDD>`.
3. Smallest coherent change; no unrelated refactors (log them in `docs/KNOWN_ISSUES.md`).
4. Verify: `node tools/verify_page.js site` + the `verify-dashboard` skill (`qa-verifier`).
5. Update docs in the same branch: `CHANGELOG.md`, `docs/PROJECT_STATE.md`, and whatever the change
   made stale (`docs/DECISIONS.md` for decisions, `docs/KNOWN_ISSUES.md`).
6. Stage files explicitly, `security-reviewer` check, commit, push, `gh pr create`, wait for the
   `verify` check, merge with `gh pr merge <n> --merge --match-head-commit <sha>` (= publish; `<sha>` from
   `gh pr view <n> --json headRefOid -q .headRefOid`; no `--delete-branch` until the owner decides
   DEC-OPEN-22), confirm the 7 published files match `site/` (`release-manager`). Monthly refreshes
   auto-publish when every check passes (D61); Gate B, an `integration-guardian` DIFF REVIEW of the
   branch, is one of those checks, and a STOP verdict or an unmet condition counts as a failed check.
   Other changes: merge when verified unless the owner asked to review first or
   `docs/project-control/FILE_OWNERSHIP_AND_CHANGE_CONTROL.md` section 7 ("Owner approval before the
   merge") applies.

## Project control (several chats)

- One **Moderator** chat coordinates the project; who is active is in
  [`docs/project-control/CHAT_REGISTRY.md`](docs/project-control/CHAT_REGISTRY.md). The registers live in
  `docs/project-control/` (start at its README). Ask the Moderator to record your claim in
  `ACTIVE_CHANGE_REGISTER.md` (only the Moderator edits it) and do not edit claimed files until the claim
  is on `origin/main`; one writer at a time for `site/index.html`, for each sibling and for `tools/lib/`.
- **Git in the main checkout.** It stays on `main`. No `git checkout`, `git switch`, `git merge` or
  `git pull` in the main checkout (the OneDrive folder) until TASK-017 has passed (`docs/PROJECT_STATE.md`
  records the pass), and again whenever OneDrive is not running or any `.git` file is cloud-only (check:
  the "OneDrive state" block in section 18 of
  `docs/project-control/REPOSITORY_AND_ENVIRONMENT_STATE.md`). 229 `.git` files were cloud-only on
  28-Oct-2026; on 25-Oct a `git checkout` failed with "mmap failed" and truncated tracked files
  (KNOWN_ISSUES R6).
- **Use instead** (`docs/project-control/REPOSITORY_AND_ENVIRONMENT_STATE.md` section 14.4):
  `git fetch origin`; `git branch <new> origin/main` (moves no file); `git worktree add` at the current
  `origin/main`; a commit of chosen files through a temporary index, then `git push origin <branch>`; after
  a merge, advance local `main` with `git update-ref` and `git reset -q` (14.4 E: the Moderator runs it; an
  operator only when `git status --porcelain` there is empty). A historical blob read that fails with
  `mmap failed`: fetch the blob with `gh api` (14.4 G) and do not retry. **Until TASK-017 has passed, also
  no** worktree at a historical commit and no tool `--apply` on the real `site/` (the one that will be
  committed; a rehearsal on temporary copies, `docs/TESTING.md` section 2.3, is not covered), so no
  `/monthly-update` run.
- **Worktrees.** Coding sub-chats, a monthly refresh included, work in their own worktree cut from the
  current `origin/main`. In it, `git switch -c <task-branch>` at the starting commit changes no file; never
  switch it to another existing branch. Sync with `git fetch origin`, then merge `origin/main` into the
  task branch (or `gh pr update-branch <n>`); never `git pull`, and no rebase after the first push. The
  main checkout is a fallback only when no worktree is possible (ask the Moderator: one coding chat at a
  time, `docs/project-control/FILE_OWNERSHIP_AND_CHANGE_CONTROL.md` section 2.2).
- Material or high-risk changes get a change-impact contract, an `integration-guardian` pre-check of it
  before the claim, and a Gate B review of the diff before the merge (gates A-E:
  `docs/project-control/FILE_OWNERSHIP_AND_CHANGE_CONTROL.md`). A routine monthly refresh is Material with
  a standing contract (`docs/MONTHLY_UPDATE_PROCESS.md`): no per-run contract or pre-check, Gate B every
  run; what makes it routine is in section 7 of that file, and a refresh that fails the criterion is High
  risk.
- Hand over before context is lost (third compaction, lost context, or a replacement):
  `docs/handover/continuations/README.md`. A new Moderator starts from
  `docs/handover/MODERATOR_BOOTSTRAP_PROMPT.md`.

## Hosting and repositories

- `origin` → https://github.com/productsteamcentricity/Centricity-Proposal-Playbook (public; D60).
- Live: https://productsteamcentricity.github.io/Centricity-Proposal-Playbook/ (Actions → Pages from `site/`).
- `upstream` → the outgoing owner's repo (read-only reference; push disabled). History was migrated
  with client names redacted (tag `handover-baseline` = upstream `72e1f1e`).

## Never

- Commit `.xlsx/.pptx/.zip`, anything under `monthly-updates/`, `backups/`, `handover-archive/`, or
  any secret. Put client names or investor data in any file.
- Run `git checkout`, `git switch`, `git merge` or `git pull` in the main checkout (when this lifts:
  "Project control").
- Force-push, rewrite published history, change repo settings/visibility, delete branches, worktrees, tags
  or the stash (so no `--delete-branch`), or bypass a failing check without the owner's explicit
  instruction. One exception: a worktree you created in this task and remove in the same task with
  `git worktree remove` (never `--force` or `rm -rf`; if it fails, leave it and tell the Moderator), as
  `docs/TESTING.md` section 2.3 does for a rehearsal.
- Upgrade the CDN libraries or `xlsx` (pinned for parity), or "modernise"/restyle during data work.

## Headline state (update after every refresh; full detail in `docs/PROJECT_STATE.md`)

Data as on **30-Sep-2026** (performance, analytics, SIF, risk matrix; the 214 funds on the four
refresh-only Monitor sheets since Sep Run 3, 21-Oct-2026; the JioBlackRock G-Sec record is held at
earlier values until the owner decides KNOWN_ISSUES C20); AIF performance and
Centricity Select **31-Aug-2026**; PMS performance 31-Jul-2026 data under the page's "31st August 2026"
label (KNOWN_ISSUES B1); PMS/AIF look-through 31-Jul-2026; fund managers = the 30-Sep
Monitor's first-named manager only (the Sep bake replaced the 31-Aug roster). `verify_page`: MASTER 7,682 ·
Centricity Select 178 (178 in MASTER) · PMS 692 / AIF 12 / benchmarks 4 · RISK_MATRIX 1,088 ·
EQUITY_ANALYTICS 1,205 · 0 duplicates · 0 script errors. Next due: the Sep-2026 Reckoner catch-up ("October 2026" deck,
`/monthly-update September 2026`), then the Oct-2026 MF cycle (mid-November). Its Portfolio Matrix
has no producer until the owner decides who builds the in-house risk-ratio and NAV workbooks
(KNOWN_ISSUES B8).

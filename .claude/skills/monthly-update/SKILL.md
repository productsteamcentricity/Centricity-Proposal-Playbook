---
name: monthly-update
description: Run the Centricity Proposal Playbook monthly data refresh from the files in monthly-updates/00_INBOX - intake, dry-run every tool, apply, verify, document, and publish to the live dashboard. Started by the owner as /monthly-update <Month YYYY>.
argument-hint: "<Month YYYY>   e.g. October 2026 (the DATA month, i.e. the as-on month); add 'resume' to continue a stopped run"
disable-model-invocation: true
---

Run the monthly update for: **$ARGUMENTS**

You are the operator; the owner only supplied files. Read first, in this order: `CLAUDE.md`,
`docs/MONTHLY_UPDATE_PROCESS.md` (the authoritative procedure — follow Part B step by step),
`docs/INPUT_FILES.md`, `tools/README.md`, the "Before the next refresh" list in
`docs/KNOWN_ISSUES.md`, and the latest file in `docs/update-log/`.

Paths. `<MAIN>` is the main checkout: the first entry of `git worktree list` (in the main checkout itself,
the current folder). What lives only there is addressed by ABSOLUTE path: `<M>` means
`<MAIN>/monthly-updates/<YYYY-MM_Mon-YYYY>`, the inbox is `<MAIN>/monthly-updates/00_INBOX/`, backups go
to `<MAIN>/backups/`. Run git and the tools from your own worktree root (B1). A worktree carries only the
tracked README placeholders of those folders, so a relative path would not fail: it would show an empty
inbox.

Keep the task list current. Summary of Part B (details and gates are in the process doc):

0. **Resume / second run (B0).** Branches: run 1 of a data month is `data/<YYYY-MM>`, a later run
   `data/<YYYY-MM>-<n>` (n = 2, 3, ...). A `data/...` branch that is an ancestor of `origin/main`
   (`git merge-base --is-ancestor <branch> origin/main` exits 0) is finished: take the next free name.
   An unfinished one (not an ancestor, or `<M>/_review/` holds an unfinished run): report where it
   stopped and continue; find its worktree with `git worktree list` and add one only if none exists.
   Inputs applied in an earlier run of this data month are "applied in run N", not "missing".
1. **Preflight (B1).** `git rev-parse --git-dir` differs from `git rev-parse --git-common-dir` in a
   worktree and is equal in the main checkout. In a worktree: `git fetch origin`, clean tree,
   `git diff --quiet HEAD origin/main -- site tools .github .claude package.json package-lock.json`
   exits 0 (else `git merge origin/main`), then `git switch -c <branch>` at the starting commit (B0 names
   it; a resumed run is already on its branch). In the main checkout do not run the refresh: create a
   worktree outside OneDrive and outside C:/t/ (step 5 empties it) with
   `git worktree add "<short path>" -b <branch> origin/main` and work from it; no worktree possible: ask
   the Moderator. The refresh owns all six deploy files, so its claim must be on `origin/main` (ask the
   Moderator to record it); if CHAT_REGISTRY shows no active Moderator, stop and tell the owner.
   Preconditions: CLAUDE.md "Project control". `npm ci` if `node_modules/` is missing.
   `node tools/verify_page.js site` must match `docs/PROJECT_STATE.md` -> "Latest verification". No
   OneDrive conflict copies.
2. **Intake (B2).** Inventory `<MAIN>/monthly-updates/00_INBOX/` (stop if the path you list is not under
   `<MAIN>`). Identify every file **by content**, read
   its as-on date from inside the file, hash it. Report the table (present / missing / stale /
   duplicate / unexpected). An absent input is NOT a stop — that area keeps its date. **Stop and ask**
   if the month disagrees with `$ARGUMENTS`, a file cannot be identified, two files compete for one
   slot, or a file is older than the live data.
3. **File and branch (B3).** Create `<M>` (+ `Analytics/`,
   `_review/`), move the inbox files in (Equity / Hybrid / Debt Analytics and the DE universe list into
   `Analytics/`; superseded re-issues into `_superseded/`). Snapshot the six deploy files, copied from your
   worktree's `site/`, to `<MAIN>/backups/<YYYY-MM-DD>_pre-<YYYY-MM>-refresh/`. The branch exists from B1.
   Save `node tools/verify_page.js site` to `<M>/_review/00_verify_before.txt`.
4. **Run the tools (B4)** in the order of the B4 table (same numbering as `tools/README.md` §2;
   commands and gates per tool in `tools/README.md` §3/§6), skipping steps whose input is absent.
   For each: dry-run → save to `<M>/_review/NN_<tool>_dry.txt` → read every gate → `--apply` → save
   `NN_<tool>_apply.txt`. Shells do not keep variables between calls: set paths in the same command.
   **A dry run that exits 1 failed a gate: stop and read the gates.** Exit 2 is a usage or input
   error (unknown flag, bad `--as-on`, missing value, duplicate input, a missing source or `--html` path
   in every tool). Exit 0 still needs a full read.
   `merge_sif_monitor.js` requires `--as-on`. PMS-alias, Reckoner and AIF pins live only in
   `tools/data/pins.json`; the PMS/AIF look-through pins are still the `PIN` map in
   `merge_pms_aif_analytics.js` (D75).
   Read the bake's `refresh-only rows not merged` list every month (C19, D80): a new fund on one of
   the four refresh-only Monitor sheets is added to MASTER by hand with the owner, never by the bake
   and never by moving the sheet into `SHEET_MAP`.
   **Stop and ask the owner** (never guess) on: ambiguous or suspicious scheme renames (including the
   8 renames pending since Sep-2026, `docs/PROJECT_STATE.md`), a new fund in that not-merged list, a
   `WARN expected Monitor sheet …` line, any `*** AMBIGUOUS`, PMS pin failures,
   a failed Reckoner drop gate or a DROPPED fund that matches a NO-MASTER-MATCH name in another
   category (the gate pairs within one), a universe change (step 14a), 0 joins, a wholly empty return
   column, any FAIL gate, or a count that moves for no reason you can explain. Never add an override
   flag without the owner: `--accept-drops <n>` (Reckoner), `--allow-coverage-drop` (DE returns),
   `--allow-shrink` (SIF re-key), `--allow-layout-change` (AIF). Use the `financial-data-reviewer`
   agent to spot-check scale (Monitor percents ÷ 100) and 5–10 sample records against the workbooks.
5. **Slides (B5)** when a new Outlook / Market Update deck is present: empty `C:\t\`, render with
   PowerPoint COM at 2001×1125 (logos and slide numbers deleted first), re-encode into `C:\t\q82\`,
   then `node tools/update_market_slides.js --slides "C:/t/q82"` (dry-run, then `--apply`).
   Before emptying that folder, check that `git worktree list` shows no worktree under C:/t/ (CLAUDE.md
   "Never" bans deleting a worktree).
6. **Verify (B6).** `node tools/verify_page.js site` -> `<M>/_review/99_verify_after.txt`; explain
   every delta. Serve the preview from YOUR worktree: `node <worktree>/.claude/serve.js` (set `PORT` if
   8080 is busy), never `preview_start playbook` from a session rooted in the main checkout (it serves
   that checkout's older page); prove it is your page (the server's first line prints your `site/` path;
   the MASTER count and `DATA_DATES` equal `99_verify_after.txt`). Run the `verify-dashboard` skill
   against that server (console, universe count, footer dates, core flow, Excel 13 sheets, PPT logo on
   every slide, allocation round-trip, all tabs, credit rating 100%); save exports under `<M>/_review/`.
7. **Document (B7).** `docs/update-log/<YYYY-MM>_<Mon-YYYY>.md` from the template in
   `docs/update-log/README.md` (no workbook row values). Update `docs/PROJECT_STATE.md`,
   `CHANGELOG.md`, the headline numbers in `CLAUDE.md`, and `docs/KNOWN_ISSUES.md` if needed.
8. **Publish (B8)** - standing approval D61: publish automatically when every check passed and no
   judgement call is open. Stage explicitly (changed `site/` files, all six if any sibling changed, and
   docs); nothing from `monthly-updates/`, `backups/`, `handover-archive/`. Commit, push,
   `gh pr create --base main --title "<title>" --body-file <file>`, `gh pr checks <PR> --watch`.
   **Gate B:** run the `integration-guardian` agent (DIFF REVIEW) with `git diff --name-status
   origin/main...HEAD`, the `<M>/_review` outputs, both SHAs and the time of your last `git fetch origin`,
   never a summary; record its verdict and conditions in the update log and the PR body (no workbook
   values). GO, or GO WITH CONDITIONS you have met, clears it; a STOP verdict or an unmet condition counts
   as a failed check under D61. (Run by you it is weaker than a Moderator-run Gate B: you review your own
   work.) Confirm the PR head contains `origin/main` (`gh pr view <PR> --json mergeStateStatus`);
   `gh pr update-branch <PR>` or a merge makes a new head: re-run CI and Gate B. Merge with
   `gh pr merge <PR> --merge --match-head-commit <head-sha>` (`<head-sha>` from
   `gh pr view <PR> --json headRefOid -q .headRefOid`; no `--delete-branch` until the owner decides
   DEC-OPEN-22), watch the Pages run by run ID, then confirm the 7 published files' SHA-256 equal `site/`.
   If anything failed or a question is open, stop before merging and ask.
9. **Close (B9).** The inbox holds only its README. Report to the owner in plain language: what was
   updated (with as-on dates), what was missing and stays at the old date, anything that needs their
   decision, the PR link and the live URL; also the branch name, the worktree path and the merge SHA, so
   the Moderator can record them and release the claim. Advancing local `main` is Gate D (the Moderator):
   do not run it yourself unless `git status --porcelain` in the main checkout is empty.

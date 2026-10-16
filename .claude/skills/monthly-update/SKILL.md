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

Keep the task list current. Summary of Part B (details and gates are in the process doc):

0. **Resume / second run (B0).** If `data/<YYYY-MM>` exists or `<M>/_review/` holds an unfinished
   run, report where it stopped and continue; inputs applied in an earlier run of this data month are
   "applied in run 1", not "missing".
1. **Preflight (B1).** `git switch main`, then `git pull --ff-only` (separate commands). Clean tree.
   `npm ci` if `node_modules/` is missing. `node tools/verify_page.js site` must match
   `docs/PROJECT_STATE.md` → "Latest verification". No OneDrive conflict copies.
2. **Intake (B2).** Inventory `monthly-updates/00_INBOX/`. Identify every file **by content**, read
   its as-on date from inside the file, hash it. Report the table (present / missing / stale /
   duplicate / unexpected). An absent input is NOT a stop — that area keeps its date. **Stop and ask**
   if the month disagrees with `$ARGUMENTS`, a file cannot be identified, two files compete for one
   slot, or a file is older than the live data.
3. **File and branch (B3).** Create `<M>` = `monthly-updates/<YYYY-MM_Mon-YYYY>/` (+ `Analytics/`,
   `_review/`), move the inbox files in (Equity / Hybrid / Debt Analytics and the DE universe list into
   `Analytics/`; superseded re-issues into `_superseded/`). Snapshot the six deploy files to
   `backups/<YYYY-MM-DD>_pre-<YYYY-MM>-refresh/`. `git switch -c data/<YYYY-MM>`. Save
   `node tools/verify_page.js site` to `<M>/_review/00_verify_before.txt`.
4. **Run the tools (B4)** in the order of the B4 table (same numbering as `tools/README.md` §2;
   commands and gates per tool in `tools/README.md` §3/§6), skipping steps whose input is absent.
   For each: dry-run → save to `<M>/_review/NN_<tool>_dry.txt` → read every gate → `--apply` → save
   `NN_<tool>_apply.txt`. Shells do not keep variables between calls: set paths in the same command.
   **Stop and ask the owner** (never guess) on: ambiguous or suspicious scheme renames, any
   `*** AMBIGUOUS`, PMS pin failures, a Reckoner DROPPED list that mirrors the NO-MASTER-MATCH list,
   a universe change (step 14a), 0 joins, a wholly empty return column, any FAIL gate, or a count that
   moves for no reason you can explain. Use the `financial-data-reviewer` agent to spot-check scale
   (Monitor percents ÷ 100) and 5–10 sample records against the workbooks.
5. **Slides (B5)** when a new Outlook / Market Update deck is present: empty `C:\t\`, render with
   PowerPoint COM at 2001×1125 (logos and slide numbers deleted first), re-encode into `C:\t\q82\`,
   then `node tools/update_market_slides.js --slides "C:/t/q82"` (dry-run, then `--apply`).
6. **Verify (B6).** `node tools/verify_page.js site` → `<M>/_review/99_verify_after.txt`; explain
   every delta. Run the `verify-dashboard` skill (console, universe count, footer dates, core flow,
   Excel 13 sheets, PPT logo on every slide, allocation round-trip, all tabs, credit rating 100%).
7. **Document (B7).** `docs/update-log/<YYYY-MM>_<Mon-YYYY>.md` from the template in
   `docs/update-log/README.md` (no workbook row values). Update `docs/PROJECT_STATE.md`,
   `CHANGELOG.md`, the headline numbers in `CLAUDE.md`, and `docs/KNOWN_ISSUES.md` if needed.
8. **Publish (B8)** — standing approval D61: publish automatically when every check passed and no
   judgement call is open. Stage explicitly (changed `site/` files — all six if any sibling changed —
   and docs); nothing from `monthly-updates/`, `backups/`, `handover-archive/`. Commit, push,
   `gh pr create --base main --title "…" --body-file <file>`, `gh pr checks <PR> --watch`,
   `gh pr merge <PR> --merge --delete-branch`, watch the Pages run by run ID, then confirm the live
   files' SHA-256 equal `site/`. If anything failed or a question is open, stop before merging and ask.
9. **Close (B9).** The inbox holds only its README. Report to the owner in plain language: what was
   updated (with as-on dates), what was missing and stays at the old date, anything that needs their
   decision, the PR link and the live URL.

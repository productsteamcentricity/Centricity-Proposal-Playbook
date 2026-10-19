# Monthly update process

How the dashboard's data is refreshed every month: who does what, which files are needed, and the
exact procedure. Part A is for the owner. Part B is the operator procedure Claude follows (started by
the owner with the `/monthly-update` skill, `.claude/skills/monthly-update/SKILL.md`).

---

## Part A — For the owner

### The whole process in one picture

```
 Desk / vendors ──► YOU drop files into ──► monthly-updates/00_INBOX/
                                                   │
                     YOU type in Claude Code:  /monthly-update October 2026
                                                   │
 CLAUDE: check files ─► back up ─► run each tool (dry-run, read checks, apply) ─► verify
         ─► document ─► publish to GitHub ─► confirm the live site ─► report to you
                                                   │
 YOU: answer any question Claude asked; 2-minute spot check of the live dashboard
```

### Your responsibilities

| # | What | When |
|---|---|---|
| 0 | **One-time:** right-click the project folder → OneDrive → *Always keep on this device* (the tools read large files; online-only placeholders break them). | Once |
| 1 | **Collect the source files** listed below from the desk / vendors. | After month-end, as they arrive |
| 2 | **Save them into `monthly-updates/00_INBOX/`** exactly as received (no renaming or sorting). | Same day |
| 3 | **Start the update**: open Claude Code on the project folder (the one containing `README.md`, `site/` and `monthly-updates/`) and type `/monthly-update <Month YYYY>`, naming the month the data is *as on* (end-October data → `October 2026`). Type it with the leading `/`. You can run it on a partial set: missing areas keep their previous dates. | When the files are in |
| 4 | **Answer judgement calls** if Claude asks. They are always about data identity, e.g. "the Monitor renamed fund X to Y — same fund?", "this PMS no longer matches any performance row — which one is it?", "two files both look like the Expense Ratio — which is final?", "a new fund appeared on one of the Monitor's mixed FoF / ETF sheets — add it, and in which category?". Expect some on Reckoner runs (new, dropped or renamed PMS/AIF funds). Claude never guesses these. Nothing is published while a question is open, and the live dashboard stays as it was. If you need to check with the desk, say so; when you have the answer, type `/monthly-update <same month>` and say "resume". | During the run |
| 5 | **Spot-check the live dashboard** after Claude reports it is published: open the link, check the footer date, build a small proposal, download the PowerPoint and Excel, glance at them. Tell Claude if anything looks wrong. | ~2 minutes |
| 6 | **Periodic lists** (P1–P5 below): when the desk changes one, drop it in the inbox and tell Claude what changed. It can go with the next run or on its own (`/monthly-update <latest data month>`). Claude confirms the changes with you before applying. | Occasionally |

That is all. You never need to run commands, use git, or edit files in `site/` or `tools/`.
Optional precaution: pause OneDrive syncing (tray icon → Pause syncing → 2 hours) while a run is in
progress, and resume it after Claude reports.

### When to run — two runs most months

Both runs are named for the **data** month (the month-end the figures are as on).

| Run | Start it when | Usually | For end-October data type |
|---|---|---|---|
| 1. MF cycle | files 1–13 are in the inbox | 13th–17th of the next month | `/monthly-update October 2026` |
| 2. Reckoner cycle | files 14–16 are in the inbox | 20th–28th of the next month | `/monthly-update October 2026` (even though the deck is titled "November 2026") |

If you type the wrong month, Claude sees that the dates inside the files disagree and asks you.
(At handover: Aug-2026 data was applied on 17-Sep and Sep-2026 data on 13-Oct; the Reckoner runs were
on 20-Aug and 28-Sep.)

### Late or corrected files

- **Re-issued before the run:** replace the old copy in the inbox and tell Claude "<file> was re-issued".
- **Re-issued after the run, or arriving late:** drop it in the inbox and run
  `/monthly-update <same month>` again, saying what it is. Only that area is updated.

### Files Claude needs from you

**Every month (the "MF cycle")**

| # | File (typical name) | What it updates on the dashboard |
|---|---|---|
| 1 | `Daily MF Monitor_<date>.xlsx` (Regular plans) | Returns, AUM and launches for ~2,000 funds; scheme renames |
| 2 | `Daily MF Monitor_Direct_<date>.xlsx` | The Regular/Direct toggle |
| 3–5 | `Equity Analytics_…`, `Hybrid Analytics_…`, `Debt Analytics_…` (.xlsx) | Holdings, sectors, market-cap split, credit ratings, issuers |
| 6 | `Listed Direct Equity_<Month>.xlsx` — the company list with sector and market-cap bucket (no returns) | Listed stocks universe |
| 7 | `Listed Direct Equity_<date>.xlsx` — the 3M…5Y **returns** file (with ISINs) | Listed stock returns |
| 8 | `Expense Ratio_<Month>.xlsx` | Expense ratios |
| 9 | `Exit Load_<Month>.xlsx` | Exit loads |
| 10 | `SIF Monitor_<date>.xlsx` | SIF returns |
| 11 | `Fund Manager Data_<date>.xlsx` | Fund manager names |
| 12 | `Fund Risk Ratios & 3Y Rolling - All Funds (as on <date>).xlsx` | Portfolio Matrix (Beta, Sharpe, Sortino, …) |
| 13 | `Monthly Outlook Pagers_<Month>.pptx` — **the final issue** | The Market Update slides in every exported PowerPoint |
| 17 (opt.) | `NAV Data as on <date>.xlsx` | Alternative way to compute the risk matrix |

**When the monthly Reckoner is released (the "Reckoner cycle"; the deck is titled one month ahead of
its data)**

| # | File | What it updates |
|---|---|---|
| 14 | `PMS_Scheme_Performance_<Month Year>.xlsx` | PMS returns |
| 15 | `Monthly Investment Reckoner - <Month Year>.pptx` | Centricity Select picks and rationales, AIF returns |
| 16 | `PMS & AIF Analytics <Month Year>.xlsx` (when available) | PMS/AIF holdings look-through |

**Only when the desk changes them**: P1 `Bond List_<date>.xlsx` (say which sheet is Invictus and which
is OneDigital), P2 `Gift City Master List.xlsx`, P3 `SIF Master List_<Month>.xlsx`,
P4 `Exit Load & Expected IRR Return Range.xlsx`, P5 `Topic Slides, Disclaimer & Thank You Slide.pptx`.

The detailed specification of each file (sheets, columns, how Claude recognises it, known traps) is
in [`INPUT_FILES.md`](INPUT_FILES.md).

### What you get back

- A short report: what was updated (with the "as on" date of each area), what was missing and
  therefore still shows the previous date, anything that needs your decision, the pull-request
  link and the live link.
- The live dashboard updated within a few minutes of publishing:
  https://productsteamcentricity.github.io/Centricity-Proposal-Playbook/
- A permanent record on GitHub: `docs/update-log/<YYYY-MM>_<Mon-YYYY>.md` lists every input file
  (name, as-on date, fingerprint), every check that ran, and every number that changed and why.

### Publishing rule (owner decision, 16-Oct-2026)

Claude publishes automatically when **every** automated and manual check passes and no judgement
call is open (`DECISIONS.md` D61). A missing input is not a reason to stop (that area keeps its date
and the report says so); an input that cannot be identified, competes with another file, is older
than the live data or belongs to another month is. To pause auto-publishing for a month, just say so
when you start the run.

### Claude's responsibilities

Everything else: identifying and dating each file, flagging missing or stale ones, backups, running
every tool in the right order with dry-runs first, reading every safety gate, rendering the market
slides in PowerPoint, verifying the result (counts, page, exports), the financial spot-checks,
writing the update log and keeping all documentation current, git, GitHub, the pull request,
publishing, confirming the live site serves exactly the new files, archiving the inbox, and
reporting to you. Detail in Part B.

---

## Part B — Operator procedure (Claude)

Run from the repository root. Every tool is dry-run unless `--apply` is passed; read the whole
output and every `GATE` line before applying. Claude Code's shells do not keep variables between
calls: set `M` in the same command as each tool call. Throughout, `<M>` means
`monthly-updates/<YYYY-MM_Mon-YYYY>` (e.g. `monthly-updates/2026-10_Oct-2026`). Tool details:
[`../tools/README.md`](../tools/README.md). Traps: [`OPERATING_MANUAL.md`](OPERATING_MANUAL.md) →
Traps. Open defects that affect a refresh: [`KNOWN_ISSUES.md`](KNOWN_ISSUES.md) ("Before the next
refresh").

### B0. Resume or second run
If branch `data/<YYYY-MM>` exists or `<M>/_review/` holds an unfinished run, report where it stopped
and continue from there. In B2, inputs already applied in an earlier run of the same data month are
"applied in run 1", not "missing". A correction re-runs only the steps that consume that file (and
their mandatory followers, e.g. steps 3–4 after a bake).

### B1. Preflight
1. `git switch main`, then `git pull --ff-only` (separate commands — `&&` does not parse in Windows
   PowerShell 5.1); working tree clean. `npm ci` if `node_modules/` is missing.
2. `node tools/verify_page.js site` equals "Latest verification" in [`PROJECT_STATE.md`](PROJECT_STATE.md).
   If not, stop: something changed outside the process.
3. No OneDrive sync-conflict copies (`*-<PCNAME>.*`) in `site/` or `.git`.

### B2. Intake (no writes yet)
1. List `monthly-updates/00_INBOX/`. For each file: identify its role **by content** (sheet names,
   header cells — `INPUT_FILES.md`), read the as-on date **from inside the file** (never infer it
   from the file or folder name: decks are named for the month they ship, and the April-2026 monitor
   was dated 15-May), compute SHA-256.
2. Report a table to the owner: input # → file → as-on → status (present / missing / stale /
   duplicate / unexpected / applied in an earlier run).
3. Stop and ask if: the data month disagrees with the requested month; a file cannot be identified;
   two files compete for one slot; a file's as-on date is older than what is already live. A merely
   absent input is not a stop.

### B3. File, back up, branch
1. Create `<M>/` with `Analytics/` and `_review/`. Move the inbox files in: the two MF Monitors and
   everything else at the top level; the Equity / Hybrid / Debt Analytics workbooks and the Listed
   Direct Equity **universe** list into `Analytics/` (`tools/bake_month.js` and
   `tools/fill_variant_analytics.js` look there). Strip invisible characters from names (e.g. the
   May-2026 soft hyphen) and record the original name in the log. If the month folder already holds a
   file for the same role (a re-issue), keep only the final one in place, move the superseded copy to
   `<M>/_superseded/`, and log both SHA-256s.
2. Copy the six deploy files to `backups/<YYYY-MM-DD>_pre-<YYYY-MM>-refresh/`.
3. `git switch -c data/<YYYY-MM>` (or switch to it when resuming).
4. `node tools/verify_page.js site > "<M>/_review/00_verify_before.txt"`.

### B4. Run the tools (dry-run → read → apply), skipping any whose input is absent

Same numbering as `tools/README.md` §2. Date labels are examples — replace them; only plain labels
are accepted ("31st October 2026"; "31 Oct 2026" for the risk matrix), anything else exits 2.

**Reading a dry run (D72).** Exit 0: every gate passed; still read the whole output (`CHECK`, `WARN`
and count lines never fail a run). **Exit 1: a gate failed — stop and read the `GATE` lines; never
`--apply`** (it would refuse anyway). Exit 2: a usage or input error (unknown flag, bad label, a
missing value, two files for one input; a missing input file in most tools) — fix the command or the
folder. Exception: the Reckoner-cycle tools (steps 12, 14, 14a, 15, 16) crash with `ENOENT` and
exit 1 on a missing file, so a dry run that exits 1 with no `GATE` line means check the path.
Override flags are owner decisions, never Claude's: `--accept-drops <n>` (step 14),
`--allow-coverage-drop` (step 6), `--allow-shrink` (step 4), `--allow-layout-change` (step 15).
`merge_pms_performance.js` (step 12) has no override.

| Step | Command (add `--apply` after a clean dry-run) | Stop and ask when |
|---|---|---|
| 1 | `node tools/rename_schemes.js --monitor "<M>/<Regular monitor>.xlsx"` — **always first** | any `*** AMBIGUOUS`; an `inception`/`category` pairing that is not obviously the same fund; "new to MASTER" near 200 (it also counts refresh-only and filtered rows the bake never adds: Sep-2026 14). The 8 renames pending since Sep-2026 (`PROJECT_STATE.md`) need the owner's answer before this `--apply` |
| 2 | `node tools/bake_month.js --dir "<M>" --as-on "31st October 2026"` | exit 1 (a FAIL gate) or exit 2 (two files for one input); MASTER count change you cannot explain. Read the `refresh-only rows not merged` list every month (C19, D80): a `not in MASTER` row that is not a known pending rename is a new fund on a refresh-only sheet, which is added to MASTER by hand with the owner, never by the bake. Also stop on any `WARN expected Monitor sheet …`, on `GATE fund rows on unrecognised Monitor sheets` failing (the desk added or renamed a sheet: classifying it is a code change, D80), and on a `CHECK MASTER MF/ETF funds on no sheet` count well above last month's (Sep-2026: 42) |
| 3 | `node tools/fill_variant_analytics.js --dir "<M>"` | an `ambiguous … not filled` line (always after a bake) |
| 4 | `node tools/rekey_sif_analytics.js` | a store-size or leftover-key gate fails (always after a bake); `--allow-shrink` only once the owner agrees the fund changed class |
| 5 | `node tools/merge_de_universe.js "<M>/Analytics/Listed Direct Equity_<Month>.xlsx"` | no header row found; a `!` new listing that is a renamed record's `prev_name` |
| 6 | `node tools/merge_direct_equity_returns.js "<M>/Listed Direct Equity_<date>.xlsx"` | top-10 by market cap not all "Large Cap"; a wholly empty return column (never force); the tenor-coverage gate (`--allow-coverage-drop` only with the owner) |
| 7 | `node tools/merge_expense_exitload.js --expense "<M>/Expense Ratio_<Month>.xlsx" --exitload "<M>/Exit Load_<Month>.xlsx"` | 0 joins |
| 8 | `node tools/merge_sif_monitor.js "<M>/SIF Monitor_<date>.xlsx" --as-on "31st October 2026"` (`--as-on` required) | small returns not ÷100 (spot-check values between −1% and +1% against the workbook); if it prints `NEW schemes added`, re-run step 4 afterwards |
| 9 | `node tools/merge_fund_managers.js "<M>/Fund Manager Data_<date>.xlsx"` — **after** the bake (the bake overwrites `fund_mgr`) | no header row found; many `ambiguous, not written` |
| 10 | `node tools/merge_risk_matrix.js "<M>/Fund Risk Ratios & 3Y Rolling - All Funds (as on <date>).xlsx" --as-on "31 Oct 2026"` | ambiguous joins; counts shrink; reliability counts far from last month's (Sep-2026: 28 split, 5 lowcorr) |
| 11 | Market slides: render (B5), then `node tools/update_market_slides.js --slides "C:/t/q82"` | dimension/size gate fails |
| 12 | `node tools/merge_pms_performance.js "<M>/<PMS_Scheme_Performance….xlsx>" --as-on "31st October 2026" --html site/index.html` | a `repin` key missing from the new file (vendor rename: the owner confirms the new key, then edit `tools/data/pins.json`); `pms N -> M` falls for no reason |
| 13 | `node tools/pin_pms_alias.js --html site/index.html` (after step 12 is applied) | any `*** key not in PMS_PERFORMANCE.pms` (blocks all pins) |
| 14 | `node tools/merge_reckoner.js "<M>/<Monthly Investment Reckoner….pptx>" --html site/index.html` | a drop gate fails: a DROPPED fund whose category also lists an unmatched deck name (a join failure), more than 5% dropped, a category emptied, or a dropped fund still under an unmapped deck heading. Only the 5% and emptied-category gates can be waived, with `--accept-drops <n>` after the owner confirms the DROPPED list; `NARRATIVE` not refreshed from the deck's index slides |
| 14a | `node tools/add_reckoner_funds.js "<M>/<Monthly Investment Reckoner….pptx>" --html site/index.html` — only if step 14 lists deck funds with no MASTER record | always confirm with the owner: this changes the universe |
| 15 | `node tools/merge_aif_performance.js "<M>/<Monthly Investment Reckoner….pptx>"` | MASTER-coverage gate fails; the deck-layout gate fails (`--allow-layout-change` only after the slides were checked with the owner) |
| 16 | `node tools/merge_pms_aif_analytics.js "<M>/<PMS & AIF Analytics….xlsx>" --as-on "31st October 2026"` | a failed gate (totals, or `MASTER PMS/AIF with look-through` falling); a scheme listed under `no MASTER instrument`; two sheets qualify (pass `--sheet`). Record the printed `look-through as on` date in the update log: the tool leaves `DATA_DATES.analytics` alone (D70) |
| 17 | `node tools/verify_page.js site` | exit 1, or see B6 |

Periodic inputs (P1–P5) follow the "Periodic" section of `tools/README.md` and always need the
owner's confirmation of what changed. A Bond List run names its desk (`--desk Invictus` or
`--desk OneDigital`); the tool refuses a workbook where the sheet for that desk is ambiguous.

### B5. Market Update slides (PowerPoint on this machine)
The decks are native shapes, so they must be rendered (script in `tools/README.md` §4):
1. Empty `C:\t\` first (stale `slideN.jpg` files would be baked). Open a copy of the deck via
   PowerPoint COM; delete every picture narrower than 400 pt (baked-in logos — the dashboard stamps
   its own) and any slide-number placeholders.
2. Export each slide at **2001 × 1125** to `C:\t\` (`Slide.Export` fails on long paths).
3. Re-encode into `C:\t\q82\` at JPEG quality 82; eyeball the densest slide.
4. Dry-run `update_market_slides.js --slides "C:/t/q82"`, check the gates, apply.

### B6. Verify
1. `node tools/verify_page.js site > "<M>/_review/99_verify_after.txt"`. Hard failures: missing
   sibling, duplicate MASTER names > 0, file not ending `</html>`, script errors > 0, Centricity Select
   keys in MASTER ≠ total. Explain every other moved count (launches, renames, closures).
2. Ask the `financial-data-reviewer` agent to trace 5–10 records across asset classes back to their
   workbook cells (returns, expense, ratios, ratings) and to check scales.
3. Run the `verify-dashboard` skill (browser: clean console, `Universe — N instruments.`, footer
   dates, core flow, Excel 13 sheets, PPT with logo on every slide, allocation round-trip, all nine
   tabs, credit rating = 100%).

### B7. Document (same branch)
- `docs/update-log/<YYYY-MM>_<Mon-YYYY>.md` from the template in `docs/update-log/README.md`: inputs
  (file, role, as-on, SHA-256), steps with gate outcomes, verify before/after with the reason for each
  delta, owner decisions, issues found. Never copy workbook row values into it.
- `docs/PROJECT_STATE.md` (as-on per domain, latest verification block, next due), `CHANGELOG.md`,
  headline numbers in `CLAUDE.md`, and `docs/KNOWN_ISSUES.md` for anything new.

### B8. Publish
1. Stage explicitly: the changed `site/` files (all six if any sibling changed), `docs/…`,
   `CHANGELOG.md`, `CLAUDE.md`. `git status` must show nothing from `monthly-updates/`, `backups/`,
   `handover-archive/`, and no `.xlsx/.pptx/.zip/.bak*`.
2. Commit `Data refresh: <Month YYYY> (as on <date>)`, push, then
   `gh pr create --base main --title "Data refresh: <Month YYYY> (as on <date>)" --body-file <summary.md>`
   (summary + verify before/after; `gh` is non-interactive here, so title and body must be given).
3. Wait for the `verify` check (`gh pr checks <PR> --watch`). If green and no judgement call is open
   → `gh pr merge <PR> --merge --delete-branch` (D61). Otherwise stop and ask.
4. Watch the Pages run:
   `gh run watch "$(gh run list --workflow pages.yml --branch main --limit 1 --json databaseId -q '.[0].databaseId')" --exit-status`,
   then download the six files from the live URL and compare SHA-256 with `site/`
   (`docs/DEPLOYMENT.md`). Only then report "published", and note the PR, merge commit and live check
   in the PR and in the next run's log.

### B9. Close
The inbox holds only its README. Report to the owner (Part A, "What you get back").

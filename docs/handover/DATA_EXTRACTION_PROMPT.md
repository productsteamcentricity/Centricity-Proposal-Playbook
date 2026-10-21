# Prompt for the outgoing owner — full data export of the Proposal Playbook

**How to use (for the new owner):** send everything between the two lines below to the outgoing
owner on Teams. They paste it into Claude Code (or the Claude session they used to build and run the
Proposal Playbook) on the machine that holds their working folders, and send back the resulting zip
files over Teams. When the zips arrive, save them into `handover-archive/` and ask Claude to
"ingest the outgoing owner's export".

---

You are helping me (the outgoing owner of the **Centricity Investment Proposal Dashboard**, also
called the **Proposal Playbook**) hand over **all** of its data to the new owner. Your job is to find,
inventory, copy and package every file and every piece of project knowledge that relates to this
dashboard — including things that may not be needed today but could be needed later (history,
earlier versions, re-issued files, samples, notes). Work carefully and completely; when in doubt,
include the file and record why.

## Ground rules (follow strictly)

1. **Copy only. Never modify, move, rename or delete anything in the original locations.** Do not
   open-and-save any Excel or PowerPoint file (that changes its bytes and timestamps).
2. Preserve original file names, folder structure and last-modified times (use `robocopy` with
   `/COPY:DAT /DCOPY:T`, or `Copy-Item` and then restore `LastWriteTime`).
3. Compute a **SHA-256** for every file **before** copying and again **after** copying; both must
   match. Record them in the manifest.
4. **Never include secrets**: no passwords, API keys, tokens, `.git-credentials`, `.env` files,
   browser profiles, `gh`/Git credential stores or SSH keys. If a file might contain one, list it in
   the manifest as "excluded — may contain a secret" and do not copy it.
5. **Client personal data:** this project should not contain any, but the related *Portfolio Review*
   work used a real family's portfolio workbook and deck as samples. Do **not** copy any file that
   identifies a client (names, PAN, account numbers, holdings of a named person). List such files in
   the manifest as "CLIENT DATA — not copied" with their path, size and date, so the new owner can
   decide with compliance.
6. Exclude bulky regenerable folders: `node_modules/`, `.git/` objects of throw-away clones, browser
   caches. Do include everything else, including old backups (`*.bak*`, `*.broken*`).
7. Long Windows paths: work from a short staging path (for example `C:\PBX\`) and use `robocopy` or
   `\\?\` paths if a copy fails because a path is too long. Log every failure; never skip silently.
8. Before copying anything, show me the inventory (step 2) and the estimated total size, and wait
   for my "go ahead".

## Step 1 — Find every location

Search this machine (ask me if a location is unclear) for anything related to the Proposal
Playbook / Investment Proposal Dashboard. At minimum check:

- **The project working folder** — the folder that held `index.html` together with
  `Centricity_ExtraSlides.js`, `Centricity_June_Refresh.js`, `Centricity_IRR_Offshore.js`,
  `Centricity_SIF_Refresh.js`, `Centricity_PMS_AIF_Terms.js`, `CLAUDE.md`, the Node tools
  (`bake_month.js`, `merge_*.js`, …) and roughly 49 `index.html.bak_*` snapshots (about 300 MB in
  total). Also any other copy of it (older working folders, temp clones used for pushing).
- **The monthly source folder**: `Desktop\AI Dashboard Updates\For Centricity Proposal Playbook
  Portal\<Month Year>\` (and its `Analytics\` subfolders), plus any sibling folders under
  `AI Dashboard Updates`.
- **The Desktop root**, **Downloads** and **Documents** — several monthly files were kept on the
  Desktop root (PMS performance files, Reckoner decks, Listed Direct Equity returns, PMS & AIF
  Analytics, closing-slide decks).
- **Slide render folders** such as `C:\t\`, `C:\t\q82\` or other short paths used for PowerPoint
  `Slide.Export`.
- **Claude Code data for this project**: `%USERPROFILE%\.claude\projects\<folder for this project>\`
  (conversation transcripts `*.jsonl` and `memory\*.md`), any project-level `.claude\` folder
  (settings, `launch.json`, `serve.js`, skills, agents, commands), `%USERPROFILE%\.claude\skills\`
  or `commands\` entries written for this dashboard, and every `CLAUDE.md` version.
- **Claude.ai / Cowork**: if this dashboard was also built in a claude.ai project or Cowork, list the
  project instructions and knowledge files you can see, and tell me exactly how to export the
  conversations (claude.ai → Settings → Privacy → Export data) — I will do that part by hand.
- Teams/Outlook **saved attachments** folders, if the desk files were saved from there.
- Any script that is not in the GitHub repository (for example older `tools\build_*.py` scripts,
  PowerShell render scripts, scratch Node/Python helpers, `_testdata\`).

## Step 2 — Inventory (no copying yet)

Produce `manifest.csv` with one row per file: `category, source_path, file_name, size_bytes,
last_modified (ISO, with time), sha256, data_month (YYYY-MM if known), as_on_date_read_from_content
(if you can read it without modifying the file), notes, action (copy / CLIENT DATA — not copied /
excluded — reason)`. Also `folder_tree.txt` of every location found.

Use these categories, and actively look for **every item in the checklist** below; for each one
say *found* (with path), *found — several versions* (list all, by timestamp), or *not found*.

### Checklist — monthly source files (all months available, Apr-2026 onwards)

| # | File (typical name) | Notes |
|---|---|---|
| 1 | `Daily MF Monitor … <date>.xlsx` (Regular) | every date, including mid-month (15-day) copies |
| 2 | `Daily MF Monitor_Direct_<date>.xlsx` | every date |
| 3–5 | `Equity / Hybrid / Debt Analytics_<Month>.xlsx` | every month, including April originals and re-issues |
| 6 | `Listed Direct Equity_<Month>.xlsx` (sector / market-cap universe) | every month |
| 7 | `Listed Direct Equity_<date>.xlsx` / `… Returns_<date>.xlsx` (returns) | every month, **both** the first and the re-issued Sep-2026 copy |
| 8 | `Expense Ratio_<Month>.xlsx` | every month and re-issue |
| 9 | `Exit Load_<Month>.xlsx`, `Exit Load_MF_<Month>.xlsx`, `Exit Loads MF.xlsx` | all |
| 10 | `SIF Monitor_<date>.xlsx` | all |
| 11 | `Fund Manager Data_<date>.xlsx`, `Fund Manager_MF_<Month>.xlsx` | all, **especially Sep-2026 and later** |
| 12 | `Fund Risk Ratios & 3Y Rolling - All Funds (as on <date>).xlsx`, `3Y Rolling + Risk Ratios - MF …`, `Risk Ratios_<Month> …` | all |
| 13 | `NAV Data as on <date>.xlsx` | all |
| 14 | `PMS_Scheme_Performance_<Month Year>.xlsx` | **all months — none were handed over**; also `PMS_Scheme_Performance_Template.xlsx` |
| 15 | `Monthly Investment Reckoner - <Month Year>.pptx` | **all decks**, especially *September 2026* (data as on 31-Aug, used on 28-Sep) and *October 2026* if received |
| 16 | `PMS & AIF Analytics <Month Year>.xlsx` (and `PMS_Analytics …`, `PMS & AIF Performance …`) | all months and every re-issue (the July file was re-issued) |
| 17 | `Monthly Outlook Pagers…pptx` / `Market Update Slide_<Month>.pptx` | all decks, **including the 17:14 re-issue of "Monthly Outlook Pagers_Oct 2026.pptx"** and "Market Update Slide_August 2026.pptx" |

### Checklist — reference and periodic files

- `Bond List_<date>.xlsx` — every version, **especially 06-Aug-2026** (the one last baked).
- `Gift City Master List.xlsx` and any Offshore funds list — latest and earlier versions.
- `SIF Master List_<Month>.xlsx` — **July 2026 and later** (only June was handed over).
- `Exit Load & Expected IRR Return Range.xlsx` — every version (source of the expected-IRR bands).
- `Topic Slides, Disclaimer & Thank You Slide.pptx` and `Extra Slides.pptx` (dividers), plus the
  rendered `disclaimer.png` / `thankyou.jpg` / divider images.
- `Centricity_Asset_Allocation_by_Risk_Profile.xlsx`, `For Risk Profile.xlsx`, `Tenure.xlsx`,
  `For Investment Proposal.xlsx`, `Investment Proposal Sample.xlsx`, `SAMPLE CONSTRUCT.pptx`,
  `AMFI CODE.xlsx`, `OneDigital Reckoner_*.xlsx`, `Direct equity_*.xlsx`.
- Logos used in the dashboard (Centricity, Invictus, OneDigital) in their original form.

### Checklist — project files that were never in GitHub

- Every `index.html.bak_*`, `*.bak*`, `*.broken*` snapshot (keep names and timestamps).
- `Centricity_Dashboard_PRD.docx` (30-Jul-2026), `Centricity_Playbook_Handoff.docx`,
  `Dashboard_Build_Prompt.md`, `Centricity_Dashboard.html` (deprecated predecessor), locally saved
  `Centricity_Investment_Proposal.pptx` samples, and any other `.docx`/`.md`/`.pdf` notes.
- `_testdata\`, scratch scripts, render scripts, `package.json`, `.claude\` project folder.
- **Compare the working folder with GitHub** (`magazineishita1108-boop/Centricity-Proposal-Playbook`,
  commit `72e1f1e`): for each of the six deploy files report `git hash-object` and say whether it
  matches. Expected blob SHA-1s: `index.html` 60106a8e04942f782b3095e6efa2ed082fee2592 ·
  `Centricity_ExtraSlides.js` b649397745dc57967a206b432e75e2d271ad66a7 ·
  `Centricity_PMS_AIF_Terms.js` 6636bbed4fc5ebf42f48ea4e780053c337c4e2f8 ·
  `Centricity_June_Refresh.js` a918b32f0de43a3350b4696e4feb68fee072acf3 ·
  `Centricity_IRR_Offshore.js` e2272de2a8a340ae7c7a6fd29de9d597f1752f84 ·
  `Centricity_SIF_Refresh.js` d65f9fee8fcd9ba0c9bdcbcc5c3952ed201817ad. List **any** file (tool,
  sibling, doc) that differs from or is missing in that commit — unpushed work must be included.

### Checklist — Claude knowledge

- All conversation transcripts for this project (Claude Code `*.jsonl`), oldest to newest.
- All memory notes and every `CLAUDE.md` revision you can find.
- Skills, agents or slash commands written for this dashboard.
- Claude.ai / Cowork project instructions and knowledge files (list them; tell me how to export).

### Related project (optional)

The *Portfolio Review* dashboard shares this dashboard's engine. Copy its non-client files (build
spec, code, templates) into a separate folder; apply rule 5 to its sample client files.

## Step 3 — Package (after my go-ahead)

Create `C:\PBX\Centricity_Playbook_Export_<YYYYMMDD>\` with:

```
00_README_EXPORT.md              what is inside, how it was produced, what was not found, open questions
01_manifest\                     manifest.csv, manifest.json, folder_tree.txt, hash_check.txt
02_monthly_source_files\<YYYY-MM_Mon-YYYY>\…   original names; re-issues kept side by side with a suffix
                                 " (re-issue <YYYY-MM-DD HHMM>)" and their timestamps recorded
03_reference_and_periodic\       bond lists, GIFT City, SIF master lists, IRR / exit-load file, risk-profile files, templates, logos
04_slides\                       source decks and every rendered image set, by month
05_project_working_folder\       full copy of the working folder(s): .bak snapshots, docs, scripts, _testdata, .claude
06_claude_knowledge\             transcripts, memory notes, CLAUDE.md versions, skills/agents/commands, claude.ai/Cowork notes
07_related_portfolio_review\     non-client files only (optional)
```

- Name month folders by the **data** month (the as-on date inside the file), not the file name:
  decks are titled one month ahead of their data, and some monitors are dated the following month.
- Re-hash every copied file and write `hash_check.txt` (every line must say MATCH).
- Zip with 7-Zip if installed, otherwise `tar -a -c -f <name>.zip <folder>`, into parts of at most
  **1 GB** each, named `Centricity_Playbook_Export_<YYYYMMDD>_partNN.zip`. Do not split a single file
  across parts unless it is larger than 1 GB. Write the SHA-256 of each zip into
  `00_README_EXPORT.md` and into a separate `zip_checksums.txt`.
- Do not upload anything to OneDrive or anywhere else — I will share the zips over Teams myself.

## Step 4 — Knowledge notes for the new owner

From the transcripts, memory notes and your own context, add a section **"Knowledge transfer"** to
`00_README_EXPORT.md` answering, with dates and evidence where possible:

1. For each data area (MF performance, Direct plan, analytics, Listed Direct Equity, expense/exit
   load, SIF, fund managers, risk matrix, PMS performance, AIF performance, Centricity Select,
   PMS/AIF look-through, bonds, GIFT City/Offshore, SIF universe, expected-IRR bands, market and
   closing slides): which exact file produced what is live today, and when it was applied.
2. Who or which team sends each file, by role only (no personal contact details), and the usual
   timing in the month.
3. Every manual edit ever made outside the tools (hand-edited IRR bands, GIFT City list, SIF list,
   pins, fund names), with the reason.
4. Decisions or desk instructions not written in `CLAUDE.md` (for example the risk-free rate of 4.5%,
   PMS/AIF minimum tickets, which deck slides are used, Mosaic Multiyield Series I vs II, the Motilal
   Oswal GIFT City "Inbound" fund, the Prism AMC prefix, the 6-slide market deck).
5. Anything in progress, half-done or planned but not shipped, and any known problem not recorded in
   `CLAUDE.md`.
6. Bonds: which file and which sheet produced the 36 live Invictus bonds (06-Aug-2026) and the 14 live
   OneDigital bonds, and how the desk tells the two lists apart (the 08-Jun-2026 workbook's two sheets
   list the same 14 bonds).
7. Fund renames you saw but deliberately did not apply, with the reason. In particular these eight,
   which the September Monitor shows under new names: HDFC Retirement Savings → HDFC Retirement Fund
   (Hybrid-Debt Plan); four Kotak overseas FoFs "Omni" → "Active"; two Axis FoFs "Active" → "Omni";
   Motilal Oswal Asset Allocation Passive FoF-Aggressive → Motilal Oswal Multi Asset Passive FoF.
8. Any inception date you set by hand, and why JioBlackRock Nifty 8-13 yr G-Sec Index Fund shows
   18-Aug-2025 in the dashboard while the Monitor says 17-Aug-2026.
9. How the funds on four MF Monitor sheets were refreshed up to the 30-Jun-2026 data: `Debt
   Oriented34`, `Solution Oriented,ETFs,FOFs`, `Solution Oriented - Childrens ` and `Hybrid`. The page's
   own parser skips these sheets, yet MASTER carries their June figures. Find the script or manual
   step that did it (for example a Python preprocessing script with its own sheet map) and include it.
10. Centricity Select ratios: in which unit the Reckoner deck's Alpha is entered (percent or decimal),
    and whether Sharpe, Sortino, Beta and Std Dev were ever converted by hand.
11. Anything else you believe the new owner will need to run, audit or rebuild this dashboard.

## Step 5 — Final report to me

Reply with: the list of zip parts (name, size, SHA-256), a table of every checklist item (found /
several versions / not found), totals by category, anything excluded and why, and the exact steps I
must still do by hand (for example the claude.ai export).

---

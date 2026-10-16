# 00_INBOX — drop this month's files here

This is the only folder you need to touch each month.

1. **Save the files** you receive from the desk / vendors into this folder **as they arrive**. No
   renaming, sorting or subfolders needed: Claude identifies each file by its content and reads the
   "as on" date from inside it.
2. **Start the update.** Open Claude Code on the project folder
   `Claude Code-Investment Proposal Dashboard` (the one containing `README.md`, `site/` and
   `monthly-updates/` — not this subfolder) and type, exactly:

   ```
   /monthly-update October 2026
   ```

   Use the month the data is **as on** (end-October data → `October 2026`). Type the command with the
   leading `/`; a plain-language request does not start the checked procedure.
3. Claude checks what is here and tells you what is missing, moves these files into
   `monthly-updates/2026-10_Oct-2026/` (leaving this folder empty), updates and verifies the dashboard,
   and publishes it. **If anything needs your decision it stops and asks first; nothing goes live until
   you answer.**

## Two runs most months

| Run | Start it when | Usually | Command for end-October data |
|---|---|---|---|
| 1. MF cycle | files 1–13 are here | 13th–17th of the next month | `/monthly-update October 2026` |
| 2. Reckoner cycle | files 14–16 are here | 20th–28th of the next month | `/monthly-update October 2026` (even though the deck is titled "November 2026") |

If you type the wrong month, Claude sees that the dates inside the files disagree and asks you.

## Late or corrected files

- **Corrected (re-issued) file, before the run:** replace the old copy here (choose "Replace" if
  Windows asks) and tell Claude "<file> was re-issued" when you start.
- **Corrected file after the run, or a late file:** drop it here and run `/monthly-update <same month>`
  again, saying what it is. Only that area is updated; everything else keeps its date.
- **Claude asked a question you need to check with the desk:** say so. When you have the answer, type
  `/monthly-update <same month>` and say "resume".

## What to send

**Every month, after month-end (the MF cycle)**

| # | File (typical name) | What it updates |
|---|---|---|
| 1 | `Daily MF Monitor_<date>.xlsx` (Regular plan) | Fund returns, AUM, new launches, scheme renames |
| 2 | `Daily MF Monitor_Direct_<date>.xlsx` | The "Direct plan" view |
| 3 | `Equity Analytics_<date>.xlsx` | Equity holdings, sectors, market-cap split |
| 4 | `Hybrid Analytics_<date>.xlsx` | Hybrid fund holdings |
| 5 | `Debt Analytics_<date>.xlsx` | Debt holdings, credit ratings, issuers |
| 6 | `Listed Direct Equity_<Month>.xlsx` — the company list with sector and market-cap bucket (no returns) | Listed stocks universe |
| 7 | `Listed Direct Equity_<date>.xlsx` — the 3M…5Y **returns** file (with ISINs) | Listed stock returns |
| 8 | `Expense Ratio_<Month>.xlsx` | Expense ratios (Regular and Direct) |
| 9 | `Exit Load_<Month>.xlsx` | Exit loads |
| 10 | `SIF Monitor_<date>.xlsx` | SIF returns |
| 11 | `Fund Manager Data_<date>.xlsx` | Fund manager names |
| 12 | `Fund Risk Ratios & 3Y Rolling - All Funds (as on <date>).xlsx` | Portfolio Matrix (Beta, Sharpe, …) |
| 13 | `Monthly Outlook Pagers_<Month>.pptx` — the **final** issue | Market Update slides in the PPT |
| 17 (optional) | `NAV Data as on <date>.xlsx` | Alternative risk-matrix route |

**When the monthly Reckoner is released (usually 20th–28th of the following month; the deck is
titled one month ahead of its data)**

| # | File | What it updates |
|---|---|---|
| 14 | `PMS_Scheme_Performance_<Month Year>.xlsx` | PMS returns |
| 15 | `Monthly Investment Reckoner - <Month Year>.pptx` | Centricity Select picks, AIF returns |
| 16 | `PMS & AIF Analytics <Month Year>.xlsx` (when available) | PMS/AIF holdings look-through |

**Only when the desk changes them** — drop here and tell Claude what changed; Claude confirms with you
before applying: P1 `Bond List_<date>.xlsx` (say which sheet is Invictus and which is OneDigital),
P2 `Gift City Master List.xlsx`, P3 `SIF Master List_<Month>.xlsx`,
P4 `Exit Load & Expected IRR Return Range.xlsx`, P5 `Topic Slides, Disclaimer & Thank You Slide.pptx`.

Anything missing simply stays at its previous date; the dashboard footer shows the dates in force.
The full specification of each file (sheets, columns, traps) is in `docs/INPUT_FILES.md`.

**Privacy:** these files are never pushed to GitHub — everything under `monthly-updates/` except the
README files is excluded. They do sync to the company OneDrive (this project folder sits inside it),
and Claude reads their contents during a run.

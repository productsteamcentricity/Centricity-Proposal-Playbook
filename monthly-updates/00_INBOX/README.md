# 00_INBOX — drop this month's files here

This is the only folder you need to touch each month.

1. Save the files you receive from the desk / vendors into this folder **as they arrive**. No need to
   rename or sort them, and no subfolders are needed; Claude identifies each file by its content
   and reads the "as on" date from inside the file.
2. If a file is re-issued (a corrected version), just drop the new one in too and mention it.
3. In Claude Code (this folder), type:

   ```
   /monthly-update October 2026
   ```

   (or say "Run the monthly update for October 2026").

Claude then checks what is here, tells you what is missing, updates the dashboard, verifies it,
publishes it, and moves these files into `monthly-updates/2026-10_Oct-2026/`, leaving this folder
empty for next month.

## What to send

**Every month, after month-end (the MF cycle)**

| # | File (typical name) | What it updates |
|---|---|---|
| 1 | `Daily MF Monitor_<date>.xlsx` (Regular plan) | Fund returns, AUM, new launches, scheme renames |
| 2 | `Daily MF Monitor_Direct_<date>.xlsx` | The "Direct plan" view |
| 3 | `Equity Analytics_<date>.xlsx` | Equity holdings, sectors, market-cap split |
| 4 | `Hybrid Analytics_<date>.xlsx` | Hybrid fund holdings |
| 5 | `Debt Analytics_<date>.xlsx` | Debt holdings, credit ratings, issuers |
| 6 | `Listed Direct Equity_<Month>.xlsx` (sector / m-cap / ISIN list) | Listed stocks universe |
| 7 | `Listed Direct Equity_<date>.xlsx` (3M … 5Y returns) | Listed stock returns |
| 8 | `Expense Ratio_<Month>.xlsx` | Expense ratios (Regular and Direct) |
| 9 | `Exit Load_<Month>.xlsx` | Exit loads |
| 10 | `SIF Monitor_<date>.xlsx` | SIF returns |
| 11 | `Fund Manager Data_<date>.xlsx` | Fund manager names |
| 12 | `Fund Risk Ratios & 3Y Rolling - All Funds (as on <date>).xlsx` | Portfolio Matrix (Beta, Sharpe, …) |
| 13 | `Monthly Outlook Pagers_<Month>.pptx` — the **final** issue | Market Update slides in the PPT |
| — | `NAV Data as on <date>.xlsx` (optional) | Alternative risk-matrix route |

**When the monthly Reckoner is released (usually mid-month)**

| # | File | What it updates |
|---|---|---|
| 14 | `PMS_Scheme_Performance_<Month Year>.xlsx` | PMS returns |
| 15 | `Monthly Investment Reckoner - <Month Year>.pptx` | Centricity Select picks, AIF returns |
| 16 | `PMS & AIF Analytics <Month Year>.xlsx` (when available) | PMS/AIF holdings look-through |

**Only when the desk changes them**

`Bond List_<date>.xlsx` (say which sheet is Invictus and which is OneDigital),
`Gift City Master List.xlsx`, `SIF Master List_<Month>.xlsx`,
`Exit Load & Expected IRR Return Range.xlsx`, `Topic Slides, Disclaimer & Thank You Slide.pptx`.

Anything missing simply stays at its previous date; the dashboard footer shows the dates in force.
The full specification of each file (sheets, columns, traps) is in `docs/INPUT_FILES.md`.

These files never leave this computer: everything under `monthly-updates/` is excluded from GitHub.

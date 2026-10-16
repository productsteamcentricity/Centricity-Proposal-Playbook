# Input files

The specification of every source file that feeds the dashboard. It is written for two readers:

- **The owner** (Centricity Products team, GitHub account `productsteamcentricity`): what to ask the
  desk for each month. Sections 1 and 5.
- **Claude**: how to recognise each file in `monthly-updates/00_INBOX/` by its content, date it, and
  file it in the month folder. Sections 1, 2 and the rules below.

The procedure that uses these files is [`MONTHLY_UPDATE_PROCESS.md`](MONTHLY_UPDATE_PROCESS.md). The
traps behind most rules here are explained in [`OPERATING_MANUAL.md`](OPERATING_MANUAL.md) → *Traps*.

Verified on 16-Oct-2026 against the tools in `tools/`, the parsers in `site/`, and a read-only
inspection of every workbook in `monthly-updates/2026-04_Apr-2026` … `2026-09_Sep-2026` (the
outgoing owner's handover pack). Where older notes and the code disagree, this file follows the code.
Statements marked **[unverified]** could not be checked against a file or the code.

The workbooks are sensitive. They are never pushed to GitHub (everything under `monthly-updates/`
except README files is git-ignored). They do sync to the company OneDrive, because the project
folder sits inside it, and Claude reads their contents during a run. This document names sheets,
columns and counts only. It never quotes rows.

---

## Rules for recognising and filing (Claude)

1. **Identify by content, never by name.** Names drift every month (see each file in section 2).
   Open each workbook read-only and compare its sheet names and header cells with the table in
   section 1. For a deck, read the slide titles with `tools/lib/pptx.js`.
2. **Date by content.** Read the as-on date from inside the file (the "As-on" line of each file in
   section 2). Never take it from a file or folder name. The April-2026 monitor is named "15th May"
   and holds April data. The market deck and the Reckoner are named for the month they *ship*, one
   month after their data.
3. **File by data month.** The month folder is `monthly-updates/<YYYY-MM_Mon-YYYY>/`, named by the
   as-on month. `Analytics/` holds exactly four files: inputs #3, #4, #5 and #6. Everything else goes
   at the top level. `tools/bake_month.js:23-31` needs the two monitors at the top level and the three
   analytics workbooks in `Analytics/`.
4. **Names that tools depend on.** Only two tools pick files by name. `tools/bake_month.js:23-31` and
   `tools/fill_variant_analytics.js:21-23` need the analytics names to start `Equity Analytics_`,
   `Hybrid Analytics_` and `Debt Analytics_` (any case). The Regular monitor must match
   `/^Daily MF ?monitor(?![a-z])/i` without `_Direct`, and the Direct monitor
   `/^Daily MF Monitor_Direct/i`. Every other tool takes an explicit path, so its file name does not
   matter. Strip invisible characters from names (the May-2026 soft hyphen) and record the original
   name in the update log. Any other rename needs the owner's agreement.
5. **One file per role per month.** The two picking tools take the *first* name match in the folder
   and do not warn about a second one. A re-issue usually keeps the same name, so a saved copy such as
   `… (1).xlsx` can be silently ignored or silently preferred. When two files fill one role, compare
   their LastWriteTime and content (row counts, empty columns, slide titles) and keep only the final
   one in the month folder. If it is not clear which one is final, stop and ask.
6. **Ignore noise:** `desktop.ini`, `Thumbs.db`, and Excel lock files (`~$…`).
7. **Read dates safely.** In Node, `cellDates` plus `toISOString()` shows the previous day on this
   IST machine (31-Aug becomes `2026-08-30`). Read a serial with `XLSX.SSF.parse_date_code`, or
   format the Date in local time.
8. **Stop and ask** (decision D61) when a file cannot be identified, its layout is one the tool
   rejects (section 3), its as-on date is older than what is live, or its data month differs from
   the month requested. A file that is simply absent is not a reason to stop: its area keeps its
   previous date and the update log lists it.

A quick read-only look at a workbook (prints sheet names and the first 15 rows of the first two sheets):

```bash
node -e "const X=require('xlsx');const wb=X.readFile(process.argv[1],{sheetRows:15});console.log(wb.SheetNames.length+' sheets:',wb.SheetNames.join(' / '));for(const s of wb.SheetNames.slice(0,2))console.log(s,X.utils.sheet_to_json(wb.Sheets[s],{header:1,defval:''}).map(r=>r.slice(0,10).join(' | ')))" "<file.xlsx>"
```

---

## 1. Summary

"Sent by" is `desk/vendor` where the pack does not say who produced the file. The outgoing owner
forwarded every file, and the original sender of each was not recorded. "Top" means the top level of
the month folder.

| # | File (typical name) | Cadence | Sent by | Consumed by (`tools/…`) | Goes in | Recognise it by content |
|---|---|---|---|---|---|---|
| 1 | `Daily MF Monitor_<date>.xlsx` (Regular plans) | Monthly, month-end copy | desk/vendor | `rename_schemes.js` (first), then `bake_month.js`; `fold_duplicate_names.js` (check) | Top | 48 sheets, including `Home`, `Dividend Yield`, `Silver`, `Debt Oriented34`. A12 = `Scheme Name`, A3 = `As on <date>`. Few fund names contain "Direct". |
| 2 | `Daily MF Monitor_Direct_<date>.xlsx` | Monthly | desk/vendor | `bake_month.js` (or `rebuild_directperf.js`) | Top | 47 sheets, including `Sheet43`, `Others`, `Sheet 44`, `Sheet 45`, and no `Dividend Yield` or `Silver`. Same row-12 header as #1. Every fund name contains "Direct". |
| 3 | `Equity Analytics_<Month>.xlsx` | Monthly | desk/vendor | `bake_month.js`, `fill_variant_analytics.js`, `rekey_sif_analytics.js` (`merge_analytics.js --equity` for one class) | `Analytics/` | One sheet with the 24-column holdings header (`Scheme Name`, `Company Name`, `In/Out`, `Holding(%)` … `SEBI MCAP Type`, then a second `Holding(%)` block). About 1,100 schemes and 78–84k rows. `Asset` is about 95% `Equity`. |
| 4 | `Hybrid Analytics_<Month>.xlsx` | Monthly | desk/vendor | as #3 (`--hybrid`) | `Analytics/` | Same header as #3. About 195–245 schemes and 22–27k rows. `Asset` is about two-thirds `Equity` and one-fifth `Debt`. |
| 5 | `Debt Analytics_<Month>.xlsx` | Monthly | desk/vendor | as #3 (`--debt`) | `Analytics/` | Same header as #3. About 470–490 schemes and 21–23k rows. `Asset` is about 90% `Debt`. |
| 6 | `Listed Direct Equity_<Month>.xlsx` (universe: the company list with sector and market-cap bucket; no returns, no ISIN) | Monthly | desk/vendor | `merge_de_universe.js` | `Analytics/` | 7 columns: `Sr.No.`, `Accord Code`, `Company Name`, `CD_Sector`, `CD_Industry1`, `SC_Latest Market Cap`, `Mcap Allocation`. About 5,300 rows. No ISIN, no returns. |
| 7 | `Listed Direct Equity_<date>.xlsx` (returns: the 3M…5Y returns file, with ISINs) | Monthly | desk/vendor | `merge_direct_equity_returns.js` | Top | 34 columns: `BRetSimplebse_<ddMonyyyy>_3M` … `_5Y_CAGR`, `CD_ISIN No`, and close/prev date and price per tenor. About 8,400–8,650 rows. |
| 8 | `Expense Ratio_<Month>.xlsx` | Monthly | desk/vendor | `merge_expense_exitload.js --expense` | Top | `Scheme Name`, `Ratio`, `Direct Plan Ratio`, `Base Expratio`, `Direct Plan Base Expratio`. |
| 9 | `Exit Load_<Month>.xlsx` | Monthly | desk/vendor | `merge_expense_exitload.js --exitload` | Top | `Scheme Name` and `Remark` (prose). Since Sep-2026 also a numeric `Exit Load` column. |
| 10 | `SIF Monitor_<date>.xlsx` | Monthly | desk/vendor | `merge_sif_monitor.js` | Top | One sheet with about 30 scheme rows. Returns columns plus `Category`, `Asset Type` (`Equity`/`Hybrid`), `Class Name`, `Sub Category`, `Remark`. |
| 11 | `Fund Manager Data_<date>.xlsx` | Monthly | desk/vendor | `merge_fund_managers.js` (after the bake) | Top | `Scheme Name`, `Inception Date`, `Fund Manager`, `From Date`, `To Date`, with interleaved `Scheme Name: …` group rows. About 13,600 rows. |
| 12 | `Fund Risk Ratios & 3Y Rolling - All Funds (as on <date>).xlsx` | Monthly | desk/vendor | `merge_risk_matrix.js` | Top | Sheets `Risk Ratios & 3Y Rolling` and `Data Flags`. A1 reads `RISK RATIOS & 3Y ROLLING RETURNS - ALL MUTUAL FUNDS (AS ON …)`. Header row 4: `Fund Name`, `CMV`, `Wt %`, `Beta`, `SD (Ann.)`, `Alpha` …, `3Y Rolling`. |
| 13 | `Monthly Outlook Pagers_<ship month>.pptx` | Monthly | desk | PowerPoint render, then `update_market_slides.js` | Top | 5–6 slides titled `EQUITY UPDATE`, `DEBT UPDATE`, `COMMODITY UPDATE`, `OVERALL MARKET UPDATE`. |
| 14 | `PMS_Scheme_Performance_<Month Year>.xlsx` | Reckoner cycle | vendor | `merge_pms_performance.js`, then `pin_pms_alias.js` | Top | A sheet whose row 1 has `Scheme Name` and `Scheme Return 1 Year` among 25 required columns. **Never in the pack.** |
| 15 | `Monthly Investment Reckoner - <ship Month Year>.pptx` | Reckoner cycle | desk/vendor | `merge_reckoner.js`, `merge_aif_performance.js`, `add_reckoner_funds.js` (on demand) | Top | 100+ slides. Slide 1 reads `Investment Reckoner <Month Year>`, then `INDEX` slides. Grid slides `PMS – EQUITY` and `AIF PERFORMANCE …` have a "Performance as on …" footnote. |
| 16 | `PMS & AIF Analytics <Month Year>.xlsx` | Reckoner cycle, when supplied | desk/vendor | `merge_pms_aif_analytics.js` | Top | `Product Category`, `Scheme Name`, `Company Name`, `Corrected Name`, `Holding(%)`, `Sector`, `ISIN`, `SEBI Mcap`. Each scheme's `Holding(%)` sums to about 1.0. |
| 17 | `NAV Data as on <date>.xlsx` (optional) | Monthly, optional | desk/vendor | `build_risk_matrix.py` | Top | Sheets `NAV Data-MF`, `CATEGORY FOR MF`, `NAV Data-Benchmark`. About 1,088 fund columns. |
| P1 | `Bond List_<date>.xlsx` | When it changes | desk | `merge_bond_list.js` | Top | Sheets `OneDigital Bonds Options` and `Invictus Bonds Options`. Row 1: `Tenure`/`Structure`, `Issuer`, `Rating`, `Expected Pre Tax IRR` … `Face Value`. |
| P2 | `Gift City Master List.xlsx` | When it changes | desk | none: `NEW_GIFT` in `site/Centricity_June_Refresh.js` **and** the embedded MASTER block (D24; the block only through `tools/lib/blocklib.js`); Off Shore funds in `site/Centricity_IRR_Offshore.js` | Top | `Fund Name`, `Type`, `In/Out`, `Minimum Investment`, `Expected IRR Range`. `Type` values are MF Feeder, GIFT CITY and Off Shore. |
| P3 | `SIF Master List_<Month>.xlsx` | When it changes | desk | none: hand-edit `var SIF` in `site/Centricity_SIF_Refresh.js` | Top | `Scheme Name`, `AMC`, `Category`, `Remark`, `Range`. About 30 rows. |
| P4 | `Exit Load & Expected IRR Return Range.xlsx` | When it changes (the old manual says monthly) | desk | none: hand-edit `var IRR` in `site/Centricity_IRR_Offshore.js` | Top | Sheets `Mutual Funds` and `PMS & AIF`. `Scheme Name`, `Maturity/Exit Load`, `Expected IRR` with a `Range` sub-header. |
| P5 | `Topic Slides, Disclaimer & Thank You Slide.pptx` | When it changes | desk | PowerPoint render, then `update_closing_slides.js` | Top | Disclaimer and Thank You slides **[unverified: never in the pack]**. |

Timing at handover: the MF cycle (#1–#13, #17) for data month M was applied around the 13th–17th of
M+1. The Reckoner cycle (#14–#16) came later. The Reckoner carrying month-M data is titled M+1: the
"August 2026" deck (data as on 31-Jul) was applied on 20-Aug-2026 and the "September 2026" deck
(data as on 31-Aug) on 28-Sep-2026, so usually the 20th–28th of the following month.

---

## 2. Per-file detail

Units matter most. The dashboard stores returns, expense ratios and market-cap shares as
**decimals** (0.0168 = 1.68%). Most sources write them in **percent**, and the tool divides by 100.
A missed ÷100 makes a value 100 times too large. The ±300% sanity gates cannot catch a small value
that was not divided, so spot-check values between −1% and +1% against the workbook. Three
exceptions are noted under their files:

- #12, the risk ratios, is stored as is.
- #16, the PMS & AIF holdings, comes as fractions and is multiplied by 100.
- P1–P4 give IRR bands as decimals.

### 1. Daily MF Monitor — Regular plans

- **Names seen:** `Daily MF monitor_15th May 2026` (April data), `Daily MF Monitor­_31st May 2026`
  (a soft hyphen U+00AD sits after "Monitor"), `Daily MF Monitor_30th June 2026`,
  `Daily MF monitor_31st July 2026`, `Daily MF Monitor as on 31st August 2026`,
  `Daily MF monitor_30th Sep 2026`.
- **Layout:** 48 sheets, with the same names and order in all six months. `Home` holds no data. On each
  data sheet the used range starts at row 2. A2 is `Home` (a link) and A3 is the `As on <date>`
  banner. **Row 12 is the header**, and A12 = `Scheme Name`.
  - Equity sheets (16) have 23 columns: `Scheme Name | AUM (Cr.) | MTD | YTD | 1 Day | 1 Week |
    1 Month | 3 Months | 6 Months | 1 Year | 2 Years | 3 Years | 5 Years | 10 Years | SINCE INCEPTION |
    Large Cap | Mid Cap | Small Cap | Others | Ratio | Inception Date | [Fund Manager 1] | [Exit Load]`.
  - Hybrid sheets (9, e.g. `Arbitrage Fund`, `Balanced Advantage`) have 36 columns, carrying both the
    equity columns and `YTM (%)`, maturity and duration. They have no date in B12.
  - Debt-style sheets (21 of them) have 34–40 columns. B12 holds a **date** in place of `AUM (Cr.)`.
    The other columns include `Latest NAV(Rs)`, `YTM (%)`, `Average Maturity Years`,
    `Modified Duration Years` and rating buckets.
  - A fund row needs a numeric AUM in column B. The fund list ends at `Average` or `BenchMark`. Index
    rows below `BenchMark` are kept as category benchmarks (`site/index.html:3314-3324`).
  - Five sheets are not in the parser's `SHEET_MAP` (`site/index.html:3151`): `Home`,
    `Debt Oriented34`, `Solution Oriented,ETFs,FOFs`, `Solution Oriented - Childrens ` (with a
    trailing space) and `Hybrid`. Their fund rows are not merged.
- **Units:** returns, `Large/Mid/Small Cap`, `Others`, `Ratio` (expense) and `YTM (%)` are percent
  and are always divided by 100 (`site/index.html:3216-3229`). AUM is in ₹ crore. Maturity and
  duration are in years. Both stay as they are.
- **As-on:** two places. The A3 banner sits on every data sheet. The B12 date sits on the debt-style
  sheets. They usually agree. In April A3 read 17-May against a B12 of 30-Apr, and in May A3 read
  01-Jun against 31-May. **Use the B12 date to choose the data month.** `bake_month.js` takes the
  date as `--as-on`. The browser uploader uses the picker first, then the file name, then the in-file
  date (`site/index.html:3377`).
- **Size:** 2,079 (Apr) to 2,161 (Sep) fund rows.
- **Traps:** the soft-hyphen name defeats a typed path (`rename_schemes.js:27` checks it with
  `fs.existsSync`). An earlier `\bmonitor\b` regex silently missed the underscore names (comment at
  `bake_month.js:26-29`). From Aug-2026 the monitor carries SEBI scheme renames, so
  `rename_schemes.js` must run before the bake. Otherwise about 200 renamed schemes are duplicated.

### 2. Daily MF Monitor — Direct plans

- **Names seen:** `Daily MF Monitor_Direct_<dd>th <Month|Mon> 2026`. The name was stable from May to
  Sep. April has no Direct monitor.
- **Layout:** 47 sheets in a different order from #1. The data-sheet layout is the same: A3 banner,
  header on row 12, and B12 dates on 18 debt-style sheets. The file has `Sheet43`, `Others`,
  `Sheet 44`, `Sheet 45` and `Hybrid`, and lacks `Dividend Yield`, `Silver`, `Debt Oriented34` and the
  two `Solution Oriented…` sheets. Every fund name contains "Direct". This was checked on four sheets
  in every month.
- **Use:** `bake_month.js` keeps only rows whose name contains "direct". It joins them to MASTER on
  the plan base name, with `-Direct Plan`, `-Dir`, `(G)` and similar parts stripped
  (`bake_month.js:217` onwards). The units are the same as #1: percent columns are divided by 100,
  and AUM, maturity and duration are kept as they are.
- **As-on:** as #1.
- **Size:** 1,789 (May) to 1,827 (Sep) fund rows.
- **Trap:** the Regular pattern excludes only `_Direct`. A Direct file named with a space
  (`…Monitor Direct…`) would be taken as Regular. Check that the two files `bake_month.js` prints as
  `reg` and `dir` are the 48-sheet and 47-sheet files.

### 3–5. Equity, Hybrid and Debt Analytics

- **Names seen:**
  - Apr, at the folder root: `Equity Analytics_April Updated`, `Hybrid_For Analytics_30th April 2026`
    and `Debt_For Analytics_30th april 2026`.
  - May: `Equity Analytics_May 2026`, `HYBRID ANALYTICS_MAY 2026` and `DEBT ANALYTICS_MAY 2026`. The
    original subfolder was `Analytics_May 2026`.
  - Jun–Aug: `<Class> Analytics_<Month> 2026`, with Aug written `_Aug 2026`.
  - Sep: `<Class> Analytics_30th September 2026`.
- **Layout:** one sheet. The header is normally row 1. The June equity file had a ` >>Portfolio`
  banner in rows 1–3 and its header on row 4. The parser looks for `Scheme Name` in rows 1–25,
  columns A–D (`site/index.html:3539`). All three classes share one 24-column header:
  `Scheme Name | Company Name | In/Out | Holding(%) | Market Value(Rs.in Crores) | Shares | Price |
  Instrument YTM (%) | Sector | Asset | Asset Type | Rating | Rating Agency | Rate Basket | ISIN |
  Issuer Name | Coupon Rate | Maturity Date | SEBI MCAP Type | Holding(%) | Market Value(Rs.in Crores) |
  Shares | Price | Instrument YTM (%)`.
- **Columns used:** `Scheme Name`, `Company Name`, `In/Out`, the **first** `Holding(%)`, `Sector`,
  `Asset`, `Rating` and `SEBI MCAP Type` (`site/index.html:3560-3562`). Rows marked `Out` are
  skipped. The second block (columns T–X) is ignored.
- **Telling the classes apart:** the header is identical, so use the `Asset` mix and the scheme count.
  Sep-2026: equity 1,130 schemes with 95% `Equity` rows; hybrid 243 schemes, 68% `Equity` and 20%
  `Debt`; debt 486 schemes, 92% `Debt`.
- **Units:** `Holding(%)` is percent. Each scheme sums to about 100, and the value is stored as is.
  Market value is in ₹ crore.
- **As-on:** there is no date field. The equity `Price` column equals month-end closing prices. This
  was cross-checked against the close prices in #7 for Apr–Sep [inference]. In the debt file every
  holding maturing on or before month-end is marked `Out`. The June banner cells (D3 = 01-Jun-2026,
  T3 = 01-May-2026) have an unknown meaning.
- **Use:** `bake_month.js:23-25` and `fill_variant_analytics.js:21-23` pick these files by name prefix
  inside `Analytics/`. `merge_analytics.js` takes explicit paths for a one-class re-bake.
  `rekey_sif_analytics.js` must follow every analytics bake. `--as-on-analytics` sets
  `DATA_DATES.analytics`.
- **Traps:** a name without the `<Class> Analytics_` prefix (as in April) cannot be picked. SIF
  schemes come and go: Aug-2026 carried 16 equity and 13 hybrid SIF/long-short schemes, and Sep-2026
  carried none. So the SIF look-through on the dashboard is still 31-Aug.

### 6. Listed Direct Equity — universe (sector and market cap)

- **Names seen:** `Analytics/Listed Direct Equity_<May 2026|June 2026|July 2026|August 2026|Sep 2026>`.
  The April predecessor, `Direct equity_April`, has an incompatible layout (section 3).
- **Layout:** the first sheet is read. In May and Aug it was named after the first company
  (`20 Microns Ltd.1`). **The header must be on row 1.** The tool does not search for it
  (`merge_de_universe.js:29`). It has 7 columns: `Sr.No. | Accord Code | Company Name | CD_Sector |
  CD_Industry1 | SC_Latest Market Cap | Mcap Allocation`. The columns are matched by pattern, and the
  tool aborts if name, sector, market cap or bucket is missing (`merge_de_universe.js:32-36`).
- **No ISIN.** `docs/PRD.md` §11.1 calls this a "sector, mcap, ISIN" list, but no copy from May to
  Sep has an ISIN column. ISINs are in #7. The join is by normalised company name. A renamed company therefore
  arrives as a new listing (see *Data-hygiene traps* in the operating manual).
- **Units:** `SC_Latest Market Cap` is stored as given. Its unit is not stated in the file
  [unverified; probably ₹ crore]. `Mcap Allocation` holds the Large/Mid/Small Cap label.
- **As-on:** none in the file. Use the data month of the cycle.
- **Size:** 5,265 to 5,346 rows.
- **Gate:** after the merge, the top 10 stocks by market cap must all read "Large Cap".

### 7. Listed Direct Equity — returns

- **Names seen:** `Listed Direct Equity Returns_31st July 2026`, `Listed Direct Equity_31st Aug 2026`
  and `Listed Direct Equity_30th Sep 2026`. The stem is the same as #6. Tell them apart by content
  (3M…5Y returns columns and `CD_ISIN No`, about 8,400–8,650 rows) and by folder.
- **Layout:** the first sheet is read. The header is the first row with a `Company Name` cell. Sep-2026
  had three blank rows above it (`merge_direct_equity_returns.js:62-64`). It has 34 columns:
  `Sr.No. | Accord Code | Company Name | BRetSimplebse_<ddMonyyyy>_3M | _6M | _1Y | _2Y_CAGR |
  _3Y_CAGR | _5Y_CAGR | CD_ISIN No`, then `_Close Date`, `_Close Price`, `_Prev Date` and
  `_Prev Price` for each tenor. Return columns are found by suffix (`:71-80`).
- **Units:** percent, divided by 100 and rounded to 6 dp. Values outside −100% to +2000% are
  rejected (`:106`).
- **As-on:** the date inside the column names (`BRetSimplebse_30Sep2026_…`) and the `_Close Date`
  values. All six tenors must carry the same date.
- **Join:** by ISIN first, then by normalised name.
- **Trap:** the tool refuses to run if any return column is completely empty (`:118-125`), because the
  join would delete that return from every stock. The first Sep-2026 copy (13:52) dated its 5Y column
  `30Oct2026` and left it empty. The re-issue, under the same name, fixed it. The pack holds the good
  copy, modified 14-Oct-2026 14:03 IST.

### 8. Expense Ratio

- **Names seen:** `Expense Ratio_June 2026` (old columns, see the trap below),
  `Expense ratio_July 2026`, `Expense Ratio_Aug 2026` and `Expense Ratio_Sep 2026`.
- **Layout:** sheet `Sheet1`, or the first sheet. The header is the first row with a cell that is
  exactly `Scheme Name` (`merge_expense_exitload.js:39-42`).
  - Jul and Aug, header on row 1: `Scheme Name | Base Expratio | Direct Plan Base Expratio |
    Direct Plan Ratio | Ratio`.
  - Sep: A1 ` >>CTB Output`, B3 `Expense Ratio`, then the header on row 4 with the columns
    reordered (`Ratio` first).
- **Use:** `Ratio` is the total TER of the Regular plan and goes to `MASTER.expense`.
  `Direct Plan Ratio` on the same row goes to the Direct overlay (`:72`, `:83`). The join is by exact
  scheme name only.
- **Units:** percent, divided by 100. Values from 0% to 8% are accepted.
- **As-on:** none in the file.
- **Size:** varies widely: 3,626 (Jun), 17,336 (Jul, including Direct and IDCW rows), 1,912 (Aug) and
  2,161 (Sep).
- **Trap:** the June file names its columns `Regular Plan Expense Ratio` and
  `Direct Plan Expense Ratio`. The tool reads `Ratio`, so with that file it updates nothing. The joins
  still succeed, so the 0-join gate passes and nothing warns. Check the "updated" count.

### 9. Exit Load

- **Names seen:** `Exit Load_MF_June 2026`, `Exit Load_MF_July`, `Exit Load_Aug 2026` and
  `Exit Load_Sep 2026`.
- **Layout:** the header is found the same way as #8. Jun–Aug have `Scheme Name | Remark` on row 1.
  Sep has A1 ` >>CTB Output`, B3 `Load Info`, and on row 4 `Scheme Name | Exit Load | Remark`. The new
  numeric `Exit Load` column is ignored.
- **Use:** the first column whose header contains "remark", otherwise `Remark`
  (`merge_expense_exitload.js:100`). The text is stored as written. `.`, `-`, `NA`, `No Option` and
  `Not applicable` mean missing and are skipped. `Nil` is kept.
- **Not to be confused with:** P4 (`Maturity/Exit Load` + `Expected IRR`), or April's `Exit Loads MF`,
  which has `Exit Load` and no `Remark`, so it would update nothing.
- **Size:** 3,620 (Jun), 17,336 (Jul), 1,912 (Aug) and 2,161 (Sep) rows.

### 10. SIF Monitor

- **Names seen:** `SIF Monitor_31st August 2026` and `SIF Monitor_30th Sep 2026`.
- **Layout:** one sheet.
  - Aug: header on row 1: `Scheme Name | AUM (Cr.) | Inception Date | 1 Day | 1 Week | 1 Month |
    3 Months | 6 Months | SINCE INCEPTION | Category | Asset Type | Class Name | Sub Category | Remark`.
  - Sep: four banner rows (row 1 groups the columns as `Corpus`, `Scheme Details`, `Risk Return`,
    `Class` and `Load Info`), then the header on row 5, which adds `Month End` and `[Fund Manager 1]`. Row 6 reads
    `Category : Scheme`.
  - Below the schemes in both files: `Category : BenchMark`, index rows and a long disclaimer.
- **Use:** parsed entirely by the sibling's `REFRESH.parseSif` (`site/Centricity_SIF_Refresh.js:83-250`).
  The header is the first row within the top 31 that has a scheme-name cell. Columns are matched by
  keyword. `Remark` becomes the exit load. A new scheme is added only when it has a numeric AUM and an
  `Asset Type` of `Equity` or `Hybrid`.
- **Units:** returns are percent and are always divided by 100. Values beyond ±1000% are rejected as
  mis-mapped columns. AUM is in ₹ crore.
- **As-on:** Sep has a `Month End` column (30-Sep-2026 on every scheme), but the parser does not read
  it. The parser's order is `--as-on`, then a date in the file name, then an `As on` banner (neither
  file has one). Pass `--as-on`.
- **Size:** 29 schemes in Aug and 30 in Sep (16 Equity, 14 Hybrid).

### 11. Fund Manager Data

- **Names seen:** `Fund Manager Data_31st Aug 2026` only. The June predecessor `Fund Manager_MF_June 2026`
  has one manager per scheme and is rejected (section 3).
- **Layout:** the first sheet. **The header must be on row 1** (`merge_fund_managers.js:37-43`):
  `Scheme Name | Inception Date | Fund Manager | From Date | To Date`. `From Date` is optional. There
  is one row per manager per stint, and 2,101 group rows (`Scheme Name: <scheme>`) are interleaved.
  Aug had 11,522 dated stint rows out of 13,623.
- **As-on:** the latest `To Date` (31-Aug-2026 in Aug). AMCs report to different month-ends in one
  file: in Aug the commonest `To Date` was 31-Jul (3,317 rows), against 1,123 at 31-Aug. The tool
  decides who is "current" per scheme, within 90 days of the file's latest date.
- **Traps:** run it **after** the bake, because the monitor's `[Fund Manager 1]` column overwrites
  `fund_mgr` on every bake. The tool prints dates one day early (`iso()` at `:45`), so 31-Aug shows as
  `2026-08-30`. The logic is unaffected.

### 12. Fund Risk Ratios & 3Y Rolling — All Funds

- **Names seen:** `Fund Risk Ratios & 3Y Rolling - All Funds (as on 31-Aug-2026)` and
  `… (as on 30-Sep-2026)`.
- **Layout:**
  - The sheet whose name matches `/risk\s*ratios/i` (`merge_risk_matrix.js:42`) is
    `Risk Ratios & 3Y Rolling`. A1 is the title with the as-on date. A2 states the 3-year window and
    the 4.5% risk-free rate.
  - Its header is the first row whose column A is `Fund Name`, which is row 4: `Fund Name | CMV |
    Wt % | Beta | SD (Ann.) | Alpha | Sortino | Sharpe | Corr. | Info Ratio | Down Cap. | 3Y Rolling |
    Rationale`. `CMV`, `Wt %` and `Rationale` ship blank.
  - Sheet `Data Flags` has its header on row 4: `Fund Name | Category | Benchmark Used |
    NAV Days in 3Y Window | Data Flag`.
  - All nine metric columns are required (`:53-63`).
- **Units:** stored exactly as in the workbook, with **no scaling**. SD and down-capture are already
  in the percent units the dashboard expects. `-` or `—` means fewer than 250 NAV days and is stored
  as empty. A column-A value longer than 120 characters is methodology prose and is skipped.
- **As-on:** the A1 title, for example `(AS ON 30-SEP-2026)`. Pass it as `--as-on`.
- **Size:** 1,088 funds. Data Flags had 175 rows in Aug and 167 in Sep.
- **Older layouts** (section 3) abort the tool: `Risk Ratios_May 2026 Updated` and
  `3Y Rolling + Risk Ratios - MF (as on 30-Jun-2026)`.

### 13. Market Update deck ("Monthly Outlook Pagers")

- **Names seen:** `Monthly Outlook Pagers- July 2026` (June data) and `Monthly Outlook Pagers- Sep 2026`
  (Aug data). The July-data edition was `Market Update Slide_August 2026`, which is not in the pack.
  Then `Monthly Outlook Pagers_Oct 2026` (Sep data). **Each deck is named for the month it ships,
  one month after its data.**
- **Content:** the June and Aug decks have 5 slides: `EQUITY UPDATE` (twice), `DEBT UPDATE`,
  `COMMODITY UPDATE` and `OVERALL MARKET UPDATE`. The Oct deck has 6 slides, adding a second
  `COMMODITY UPDATE`. The slides are native shapes with no slide images, so they must be rendered.
- **As-on:** slide 1 says "…in the month of <Month yyyy>". That month is the data month.
- **Use:** render each slide at 2001 × 1125 in PowerPoint, after deleting baked-in logos and
  slide-number placeholders. Then run `update_market_slides.js --slides <dir>`, which reads
  `slideN.jpg|png`. The procedure is in `MONTHLY_UPDATE_PROCESS.md` B5.
- **Traps:** **a re-issue keeps the same file name.** The Oct deck's first issue (11:28) carried the
  previous month's outlook slide, titled "– August 2026". The 17:14 re-issue, which is live, fixed
  it. The pack holds the stale first issue. Check LastWriteTime and the last slide's title, and
  pixel-compare the renders. The slide count can change from month to month.

### 14. PMS_Scheme_Performance

- **Never in the pack.** The live data (`DATA_DATES.pms` "31st August 2026", `site/index.html:1451`)
  came from `PMS_Scheme_Performance_31st August 2026`, applied on 28-Sep-2026 (commit "PMS + AIF
  performance as on 31 Aug 2026"). The outgoing owner kept it outside the month folders. An earlier
  03-Sep-2026 re-issue was merged with `DATA_DATES.pms` left at 31-Jul. This specification comes
  from the code only.
- **Recognise:** any sheet whose row 1 contains both `Scheme Name` and `Scheme Return 1 Year`. The
  sheet has been seen as `PMS Performance` and as `Sheet1` (`merge_pms_performance.js:86-99`).
  25 columns are required (`:101-107`): `Scheme Name`, `AUM`, `P/E Ratio`, `Large Cap`, `Mid Cap`,
  `Small Cap`, `Exit Load`, `Scheme Return 1/3/6 Month`, `Scheme Return 1/2/3/5 Year`,
  `Scheme Return Since Inception`, `Standard Deviation 1/3 Year`, `Sharpe Ratio 1/3 Year`,
  `Sortino Ratio 1/3 Year`, `Alpha 1/3 Year` and `Beta 1/3 Year`.
- **Units:** returns, SD, alpha and market-cap shares are percent and are divided by 100. Ratios and
  P/E are stored as is. AUM is judged per column: if the largest value is above 1e8, the whole column
  is in rupees and is divided by 1e7; otherwise it is taken as ₹ crore (`:112`). `Exit Load` is free
  text, parsed for the year 1, 2 and 3 rates.
- **As-on:** passed as `--as-on` into `DATA_DATES.pms`. Where the file shows its own date is
  **[unverified]**.
- **Traps:** the vendor renames schemes. When it does, update `REPIN` in `merge_pms_performance.js`
  and `PINS` in `pin_pms_alias.js` together. Both tools, and `merge_reckoner.js`, need
  `--html site/index.html`. Do not confuse this file with `PMS & AIF Performance <Month>.xlsx`, a
  Reckoner-grid extract that the tool rejects (section 3).

### 15. Monthly Investment Reckoner deck

- **Names seen:** only `Monthly Investment Reckoner - August 2026.pptx`, with data as on 31-Jul-2026.
  Each deck is named for the month it ships.
- **Content:** 114 slides, 12 media files and 59 MB.
  - Slide 1: `Investment Reckoner <Month Year>`.
  - Slides 2–4: `INDEX` and table of contents. `NARRATIVE` must be re-read from these every month.
  - Grid slides such as `MUTUAL FUNDS – EQUITY`, `PMS – EQUITY` and
    `AIF PERFORMANCE (CAT III)– LISTED EQUITY`.
- **As-on:** the footnote "Performance as on <Month dd>, yyyy" on the grid slides. No tool reads or
  stores it, so read it off the slide.
- **Use:**
  - `merge_reckoner.js` keeps tables whose first header cell is `Scheme Name`, `Fund Name`,
    `Strategy`, `Scheme` or `Name of the Scheme` and that have at least 8 header cells
    (`tools/lib/reck_parse.js`).
  - `merge_aif_performance.js` looks for slides by file name (`slide1.xml` … `slide200.xml`). The
    AIF grid is the first `Strategy` table on a slide titled `AIF PERFORMANCE`. It assumes the last
    four columns are the market-cap split.
  - `add_reckoner_funds.js` uses slide numbers hard-coded for the August-2026 deck. It accepts
    `--pms <xlsx>` but never reads it (`add_reckoner_funds.js:20`).

### 16. PMS & AIF Analytics (look-through)

- **Names seen:** `PMS_Analytics April`, `PMS & AIF Analytics_May 2026` (at the month root) and
  `PMS & AIF Analytics July 2026` (in `Analytics/`). The tool takes an explicit path, so either
  location works. New months go at the top level.
- **Layout:** the first sheet, with the header on row 1: `Product Category | Scheme Name |
  Company Name | Corrected Name | Holding(%) | Sector | ISIN | SEBI Mcap`. All but `Company Name`
  (a fallback for the stock name) and `ISIN` are required (`merge_pms_aif_analytics.js:58-61`).
- **Units:** **`Holding(%)` is a fraction.** Each scheme sums to about 1.0: in July, 0.999 to 1.003
  across 15 schemes. The tool multiplies it by 100 (`:96`). `SEBI Mcap` loses its " Cap" suffix.
- **As-on:** none in the file. Pass it as `--as-on`; the tool prints it for the update log and writes
  it nowhere. Until 16-Oct-2026 it overwrote `DATA_DATES.analytics`, the MF analytics label
  (`KNOWN_ISSUES.md` A3, D70).
- **Traps:** the tool also rewrites the `EQ` block in `site/Centricity_June_Refresh.js`. Only
  `Product Category` separates a PMS and an AIF whose names differ by a dash character. The file has
  been re-issued mid-cycle with more schemes, so re-check the scheme count. Rows: 320 (Apr),
  558 (May), 608 (Jul).

### 17. NAV Data (optional)

- **Names seen:** `NAV Data as on <dd>th <Month> 2026` (June, August, September).
- **Layout:** three sheets, read by exact name (`build_risk_matrix.py:24-38`):
  - `NAV Data-MF`: row 1 is `Date | <one column per fund>`, about 1,088 funds. Row 2 holds AMFI codes
    and is dropped.
  - `CATEGORY FOR MF`: `Instrument Name | Category`.
  - `NAV Data-Benchmark`: `Date | NIFTY 100 - TRI | NIFTY 50 - TRI | NIFTY 500 - TRI |
    Nifty Midcap 150 - TRI | Nifty Smallcap 250 - TRI`.
- **As-on:** the latest `Date` in `NAV Data-MF`. The document properties of the Aug and Sep copies
  were copied from the June file, so do not date it by its metadata.
- **Use:** `python -I tools/build_risk_matrix.py "<NAV xlsx>" site/index.html "<AS_ON>" <out.js>`.
  This route has not been validated on this machine's pandas 3.x. The JavaScript route (#12) is the
  one in use.

### P1. Bond List

- **Names seen:** `Bond List_08th June 2026`, which sat at the portal root and was filed in 2026-06.
  The live Invictus bonds came from a list dated 06-Aug-2026 (39 rows, 36 bonds) that is not in the
  pack.
- **Layout:** two sheets, `OneDigital Bonds Options` and `Invictus Bonds Options`. Row 1 is a header
  (A1 is `Tenure` on one sheet and `Structure` on the other): `Issuer | Rating | Expected Pre Tax IRR
  | (blank) | Maturity Date | Secured/ Unsecured | Residual Tenor (months) | Interest Frequency |
  Face Value`. Row 2 has a `Range` sub-header with the low and high IRR in columns D and E. Data
  starts on row 3.
- **Use:** `merge_bond_list.js --desk <Invictus|OneDigital>` reads one sheet, at fixed column
  positions: `--sheet` if given, else the only sheet, else the one tab whose name contains the desk.
  It refuses an ambiguous workbook and a tab named for the other desk (`KNOWN_ISSUES.md` A1, closed
  16-Oct-2026). Until then it read only the first sheet as Invictus; in the June file that is
  OneDigital, but both sheets held identical rows, so no harm was done. Still ask the desk which
  sheet is which.
- **Units:** IRR as a fraction. The gate requires 0 < low < 0.30 (`:236`). Maturity is an Excel
  serial, and the source has a recurring century typo (2030 stored as 1930). The date embedded in
  the issuer name wins. The same bond can appear in two formats, so rows are deduplicated on issuer
  and maturity.
- **As-on:** none in the content. Use the date in the file name.

### P2. Gift City Master List

- **Layout:** `Sheet1`, header on row 1: `Fund Name | Type | In/Out | Minimum Investment |
  Expected IRR Range`. A `Range` sub-header in row 2 puts low and high in columns E and F, as
  decimals. The file lists 57 funds. `Type` is MF Feeder, GIFT CITY or `Off Shore ` (with a trailing
  space). `In/Out` is Inbound or Outbound. There is no as-on date.
- **Use:** no tool. Edit `NEW_GIFT` in `site/Centricity_June_Refresh.js` **and** the embedded
  MASTER block (D24; the block only through `tools/lib/blocklib.js`). `NEW_GIFT` replaces the whole
  GIFT City bucket on every page load and currently holds 58 records. The four Off Shore funds are
  in `site/Centricity_IRR_Offshore.js` (`var OFFSHORE`). The live list uses the house IRR band
  0.10–0.12 "per desk convention" (`site/Centricity_June_Refresh.js:3`), not the band in the file.
- The April and May copies are byte-identical.

### P3. SIF Master List

- **Layout:** `Sheet1`, header on row 1: `Scheme Name | AMC | Category | Remark | Range`. `Range`
  gives low and high as decimals in columns E and F. The June list has 28 schemes. The live `var SIF`
  has 30.
- **Use:** no tool. Hand-edit `var SIF` in `site/Centricity_SIF_Refresh.js`. Then
  `merge_sif_monitor.js` fills in the returns.

### P4. Exit Load & Expected IRR Return Range

- **Layout:** two sheets, `Mutual Funds` and `PMS & AIF` (the second starts on row 3). The header is
  `Scheme Name | Maturity/Exit Load | Expected IRR`. A `Range` sub-header puts low and high in
  columns C and D, as decimals. Category heading rows are interleaved with the funds. The file has
  2,199 distinct MF names and 83 PMS/AIF rows.
- **Use:** no tool. It is the source of the hand-maintained `var IRR` map in
  `site/Centricity_IRR_Offshore.js`, keyed by exact MASTER name. `rename_schemes.js` re-keys that map
  on renames.
- Only the April copy exists. The old manual lists this file as monthly, with "format changed —
  verify columns each run". `docs/PRD.md` §11.1 omits it.

### P5. Topic Slides, Disclaimer & Thank You Slide

- **Never in the pack.** Render the Disclaimer slide to `disclaimer.png` and the Thank You slide to
  `thankyou.jpg`, both at exactly 2001 × 1125, after deleting the logo and slide-number placeholders.
  Then run `update_closing_slides.js --dir <render dir>` (`:26-29`, `:57`). The steps are in the
  operating manual → *Refreshing the closing slides*.

---

## 3. Not inputs (archive only)

These files are in the handover pack. Do not request them and do not feed them to a tool.

**Reference files from the April initial build.** Their content is already hard-coded in the page or
a sibling.

| File (folder) | What it is | Where its content lives now |
|---|---|---|
| `For Risk Profile.xlsx` (2026-04) | Five risk profiles and their equity ranges | `window.RISK_PROFILES`, `site/index.html:2898` |
| `Tenure.xlsx` (2026-04) | Debt category → tenure label (59 rows) | `H._TENURE_DEBT`, `site/index.html:2677` |
| `For Investment Proposal.xlsx` (2026-04) | Exit loads and category IRR bands | IRR bands: re-derived by `add_reckoner_funds.js` from MASTER |
| `Investment Proposal Sample.xlsx` (2026-04) | Layout sample for the Excel export | Design reference only |
| `SAMPLE CONSTRUCT.pptx` (2026-04) | Layout sample for the construct slide | Design reference only |
| `Extra Slides.pptx` (2026-04) | The three divider slides | Rendered once into `site/Centricity_ExtraSlides.js` (needed only to redraw them) |
| `OneDigital Reckoner_May 2026.xlsx` (2026-04) | Original seed of the Centricity Select taxonomy (40 sheets) | `CENTRICITY_SELECT`; superseded by the Reckoner deck (#15) |
| `AMFI CODE.xlsx` (2026-06) | Scheme name → AMFI code | Not wired to anything; adding it would be a feature |
| `desktop.ini` (2026-07/Analytics) | Windows folder metadata | Noise |
| `_handover_manifest.json` (monthly-updates/) | SHA-256 of every file extracted from the handover zip | Provenance only |

**Older layouts of real inputs.** The current tools reject these files or silently ignore them.

| File (folder) | Predecessor of | What the tool does with it |
|---|---|---|
| `Direct equity_April.xlsx` (2026-04) | #6 | Aborts with "column layout changed": no `Mcap Allocation` column (`merge_de_universe.js:36`). Its market caps date from Oct-2025. |
| `Exit Loads MF.xlsx` (2026-04) | #9 | Updates nothing: there is no `Remark` column, so every cell reads as missing |
| `Expense Ratio_June 2026.xlsx` (2026-06) | #8 | Updates nothing: the columns are `Regular/Direct Plan Expense Ratio`, not `Ratio`, and the gate still passes |
| `Fund Manager_MF_June 2026.xlsx` (2026-06) | #11 | Aborts: one manager per scheme, and no `Fund Manager` or `To Date` column. It repeats the monitor's own column anyway. |
| `Risk Ratios_May 2026 Updated.xlsx` (2026-05) | #12 | Aborts: no sheet matches "Risk Ratios" (the sheets are `Sheet1` and `Sheet2`) |
| `3Y Rolling + Risk Ratios - MF (as on 30-Jun-2026).xlsx` (2026-06) | #12 | Aborts: its `Risk Ratios` sheet has no Alpha, Corr. or 3Y Rolling column. It holds all 1,088 funds, not a sample. |
| `PMS & AIF Performance April.xlsx`, `… May.xlsx` (2026-04, 2026-05) | #14 | Aborts: no sheet has `Scheme Name` with `Scheme Return 1 Year`. These are Reckoner-grid extracts with returns in decimals. |

---

## 4. Historical coverage (handover pack, 2026-04 … 2026-09)

This table shows what the month folders hold. It does not show what the desk sent: before August
the outgoing owner kept some files (the returns file, PMS performance, the Reckoner decks) at the
Desktop root, outside these folders.

Cell values: **present** (compatible with the current tool) · **missing** · **incompatible**
(section 3) · **—** (periodic file, not expected that month). Letters refer to the notes below the
table.

| # | Input | 2026-04 | 2026-05 | 2026-06 | 2026-07 | 2026-08 | 2026-09 |
|---|---|---|---|---|---|---|---|
| 1 | Daily MF Monitor (Regular) | present (a) | present (b) | present | present | present | present |
| 2 | Daily MF Monitor (Direct) | missing | present | present | present | present | present |
| 3 | Equity Analytics | present (c) | present | present (d) | present | present | present (e) |
| 4 | Hybrid Analytics | present (c) | present | present | present | present | present (e) |
| 5 | Debt Analytics | present (c) | present | present | present | present | present |
| 6 | Listed Direct Equity — universe | incompatible | present | present | present | present | present |
| 7 | Listed Direct Equity — returns | missing | missing | missing | present | present | present (f) |
| 8 | Expense Ratio | missing | missing | incompatible | present | present | present |
| 9 | Exit Load | incompatible | missing | present | present | present | present |
| 10 | SIF Monitor | missing | missing | missing | missing | present | present |
| 11 | Fund Manager Data | missing | missing | incompatible | missing | present | missing |
| 12 | Fund Risk Ratios & 3Y Rolling | missing | incompatible | incompatible | missing | present | present |
| 13 | Market Update deck | missing | missing | present | missing | present | present (g) |
| 14 | PMS_Scheme_Performance | incompatible | incompatible | missing | missing | missing | missing |
| 15 | Monthly Investment Reckoner deck | missing | missing | missing | present | missing | missing (h) |
| 16 | PMS & AIF Analytics | present | present | missing | present | missing | missing |
| 17 | NAV Data (optional) | missing | missing | present | missing | present | present |
| P1 | Bond List | — | — | present (i) | — | — | — |
| P2 | Gift City Master List | present | present | — | — | — | — |
| P3 | SIF Master List | — | — | present | — | — | — |
| P4 | Exit Load & Expected IRR Return Range | present | — | — | — | — | — |
| P5 | Topic Slides, Disclaimer & Thank You | — | — | — | — | — | — |

- (a) Named "15th May 2026", but the AUM date is 30-Apr-2026. April was the initial-build pack, and
  it has no `Analytics/` folder or Direct monitor, so `bake_month.js` cannot run on it.
- (b) The soft hyphen in the file name.
- (c) At the folder root, not in `Analytics/`. Hybrid and Debt also lack the `<Class> Analytics_`
  prefix. The headers are compatible, so `merge_analytics.js` with explicit paths would work.
- (d) Banner rows; the header is on row 4.
- (e) No SIF schemes. Aug had 16 equity and 13 hybrid.
- (f) The good re-issue. The broken 13:52 copy is not in the pack.
- (g) The stale 11:28 first issue. The live slides came from the 17:14 re-issue, which is not in the
  pack.
- (h) The "October 2026" deck (Sep data) was not yet due on 16-Oct-2026 [inference: the previous
  two decks were applied on 20-Aug and 28-Sep].
- (i) Taken from the portal root and filed under June.

---

## 5. Gaps at handover and what to ask the desk for next

**What is live on 16-Oct-2026** (from `site/index.html:1448-1452`, `:5093` and
`site/Centricity_SIF_Refresh.js:61`):

- **30-Sep-2026:** MF performance, analytics, SIF performance, the risk matrix, Direct Equity, and
  expense and exit loads.
- **31-Aug-2026:** PMS performance, AIF performance and Centricity Select (from the September
  Reckoner deck).
- **Fund managers:** mostly the single `[Fund Manager 1]` name from the 30-Sep monitor. The Sep bake
  overwrote the 31-Aug roster, and `merge_fund_managers.js` was not re-run. A dry run with the
  Aug file on 16-Oct-2026 would rewrite 1,310 schemes.
- **31-Jul-2026:** the PMS/AIF look-through.
- **Older:** Invictus bonds (06-Aug-2026 list), GIFT City and the SIF universe (June-2026 lists plus
  later hand edits).

| Gap | Effect on the dashboard | Ask the desk for |
|---|---|---|
| No Fund Manager Data for Sep-2026 | `fund_mgr` (internal field) shows only the monitor's first manager; the Sep bake overwrote the 31-Aug roster | `Fund Manager Data` as on 30-Sep-2026 |
| `PMS_Scheme_Performance` is in no month folder | PMS returns are one cycle behind (31-Aug) | The file as on 30-Sep-2026, plus `PMS_Scheme_Performance_31st August 2026` (the live one) for the archive |
| The live Reckoner deck ("September 2026", as on 31-Aug) is not in the pack | Centricity Select and AIF returns are at 31-Aug | The "October 2026" deck (as on 30-Sep) when it is released, plus the September deck for the archive |
| The newest PMS & AIF Analytics is July | The look-through is two months old | The latest `PMS & AIF Analytics` |
| The Sep-2026 analytics contain no SIF schemes | The SIF look-through stays at 31-Aug | Equity and Hybrid Analytics that include the SIF/long-short schemes, from October onwards (and a Sep re-issue if possible) |
| The pack's Oct market deck is the stale first issue | None (the live slides came from the re-issue) | The final `Monthly Outlook Pagers_Oct 2026.pptx`, for the archive |
| The SIF Master List is June (28 schemes); live has 30 | Universe changes since June were made by hand | The current `SIF Master List` |
| The 06-Aug Bond List behind the live Invictus bonds is not in the pack; OneDigital is older | Bond lists may be stale | The current Bond List for both desks, saying which sheet is which |
| `Exit Load & Expected IRR Return Range` exists only as the April copy, and its format reportedly changed | IRR bands may be stale | The current version |
| The GIFT City list dates from June-2026 | — | Confirmation that it is unchanged, or a new list |
| The closing-slides deck has never been supplied | — | One copy for the archive (needed only when those slides change) |

**Next regular cycle (data as on 31-Oct-2026).** Ask for inputs #1–#13 (and #17 if convenient) after
month-end. Ask for the "November 2026" Reckoner cycle (#14–#16) when it is released. Remind the desk
of two things:

- Always send the **final** issue of a deck. A corrected re-issue that keeps the same name should be
  flagged as such.
- The Expense Ratio file needs the `Ratio` and `Direct Plan Ratio` columns.

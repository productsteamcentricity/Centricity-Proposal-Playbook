# Update log - TASK-090: October debt MF ranges from category YTM, the D116 rows, matured removals (26-Nov-2026)

**Run.** 26-Nov-2026, branch `data/2026-11-task090-debt-bands` from `origin/main` `b728fa0`.
- `site/` is as at `eb00377` (PR #74); `index.html` sha256 df116b3b67054d7b21a6da364ab725e2c9cc7b22065ec389bf2f5bf954466dfb.
- Operator: Claude Code, chat OPS-02; Moderator MOD-03.

**Decisions.**
- D116 (24-Nov-2026): the 191 band corrections and the removal of the 9 matured target-maturity funds.
- D117 (26-Nov-2026, "Yes, all six"):
  - debt MF ranges from the category average YTM, using the owner's October file as is;
  - Medium to Long Duration -> Long Term;
  - Gilt 10Y -> Government Securities;
  - the CRISIL-IBX Financial Services index funds -> Index Funds - Fixed Income;
  - the 3-month rule;
  - one combined bundle.

**Risk.** High: about 539 client-facing ranges and 9 removals.
- Contract v2 carries the Guardian's and the independent financial pre-check's conditions C1-C9 (GO WITH CONDITIONS).
- Claim: `docs/project-control/ACTIVE_CHANGE_REGISTER.md`.

**Result.** See "Checks" below. The PR, Gate B, the owner's yes and the merge are recorded on the PR and by MOD-03.

## Inputs (local, not committed)

- `monthly-updates/2026-10_Oct-2026/YTM- 31st OCT.xlsx`, the owner's file.
  - sha256 0be8442a6b28c18ed738cda16e2cec7e9bd5f92d104fb9196d4807ccebb619c5.
  - One sheet, B2:E20: Category / YTM Range OLD / Average as on 31st Oct 2026 / New. 16 categories.
- `Daily MF Monitor_Direct_31 Oct 2026.xlsx`, for the DIRECT_PERF rebuild only (NAV date 30-Oct-2026).

## What changed

| File | Block | Change |
|---|---|---|
| `site/Centricity_IRR_Offshore.js` | `var IRR` | 515 values changed. 9 keys removed. The other 2,056 keys keep their order. 2,065 -> 2,056 keys. |
| `site/Centricity_IRR_Offshore.js` | comment lines 2-3 | "on 2065 MASTER funds" -> "on 2056 MASTER funds". Line 3 gains "; 9 matured target-maturity funds removed 2026-11, TASK-090". `var OFFSHORE`, `var OFF_BASE` and every other line are byte-identical. |
| `site/index.html` | `window.MASTER` | 24 band changes (`irr_low` / `irr_high` only). 9 records removed. Raw 7,712 -> 7,703. |
| `site/index.html` | `window.DEBT_ANALYTICS` | 9 keys removed (the matured funds). 521 -> 512. |
| `site/index.html` | `window.DIRECT_PERF` | 1 key removed (Bandhan CRISIL IBX 90:10 SDL Plus Gilt - Nov 2026), by `tools/rebuild_directperf.js`. 0 changed, 0 added, order kept. 1,719 -> 1,718. |

Everything else in both files is byte-identical; the other four deploy files are unchanged.

Every band end is an exact quarter point, written `k/400` in its shortest decimal form (0.0525, 0.0575, 0.0625, 0.0675,
0.07, 0.0725, 0.075, 0.0775, 0.08, 0.0825, 0.085).

### The 539 band changes

**488 come from the owner's October file** (469 in `var IRR`, 19 in MASTER). Each debt MF / ETF record takes its
category's "New" range, as in the file:

| Owner category | Range | Records changed | Dashboard records |
|---|---|---|---|
| Overnight Funds | 5.25-5.75% | 65 | 40 Overnight funds; 20 overnight-rate ETFs by name (1D Rate, BSE Liquid Rate, CRISIL Liquid Overnight; filed as Gilt or Low Duration, C89); 5 by the 3-month rule |
| Liquid Funds | 6.25-6.75% | 45 | Liquid; plus AlphaGrep Liquid Omni FOF by name |
| Money Market Funds | 6.75-7.00% | 27 | Money Market |
| Ultra Short Term Funds | 7.00-7.25% | 26 | Ultra Short Duration |
| Low Duration Funds | 7.25-7.50% | 25 | Low Duration |
| Short Term Debt Funds | 7.25-7.50% | 28 | Short Duration |
| Banking and PSU Debt Funds | 7.25-7.50% | 20 | Banking & PSU |
| Corporate Bond Funds | 7.50-7.75% | 21 | Corporate Bond |
| Dynamic Bond Funds | 7.50-7.75% | 22 | Dynamic Bond |
| Floating Rate Funds | 7.50-7.75% | 12 | Floating Rate |
| Credit Risk Funds | 7.75-8.25% | 14 | Credit Risk |
| Medium Term Debt Funds | 8.00-8.50% | 13 | Medium Duration |
| Long Term Debt Funds | 7.25-7.75% | 24 | Long Duration; Medium to Long Duration (D117 point 4) |
| Government Securities Funds | 6.75-7.25% | 28 | "Short & Mid Term" (the monitor's sheet of active gilt funds); Gilt 10Y (D117 point 4) |
| Index Funds - Fixed Income | 7.00-7.50% | 118 | Debt ETF and the Gilt-filed ETFs: target-maturity, G-Sec, SDL, PSU and AAA indices, BHARAT Bond, CRISIL-IBX Financial Services, 10-year gilt ETFs, debt FoFs |
| Fixed Maturity Funds (FMPs) | 7.00-7.50% | 0 | no dashboard records |

- **The twin-band reversal (D117 point 5).** The CRISIL-IBX Financial Services 3-6M and 9-12M index funds go to 7.00-7.50%
  with their category. That includes SBI 3-6M, SBI 9-12M and the Tata 3-6M, which TASK-088's Gate B correction (24-Nov,
  the twin rule) had put at 6-7.5%. This replaces D115 point 1's twin band.
- **The 3-month rule (D117 point 6).** An index or target-maturity fund whose maturity month (in its name) is 1-3 months
  after the as-on month takes Overnight. On 31-Oct-2026 it catches all five December-2026 funds:
  - Tata Nifty G-Sec Dec 2026 (YTM 5.30%);
  - HDFC Nifty G-Sec Dec 2026 (5.32%);
  - Kotak CRISIL-IBX AAA Bond Financial Services Index - Dec 2026 (6.77%);
  - Nippon India CRISIL-IBX AAA Financial Services - Dec 2026 (6.73%);
  - Baroda BNP Paribas NIFTY SDL Dec 2026 (5.93%).

  The owner approved a rule, not a list (MOD-03, 26-Nov), so Baroda BNP Paribas SDL Dec 2026 is in by the rule. Its
  stored average maturity of 0.53 years does not fit a December-2026 target date; see C94.

**51 come from D116** (46 in `var IRR`, 5 in MASTER). These are non-debt rows, so D116's approved bands stand:
- 25 Income Plus Arbitrage FoFs at 7-7.5%: 24 Hybrid Other, plus the Aditya Birla SL fund filed as Debt ETF.
- 26 hybrid FoFs:
  - Multi Asset Allocation / Dynamic Asset Allocation 8-10% (19);
  - Aggressive Hybrid 9-10% (4);
  - Conservative Hybrid 8-9% (3).

**The owner's CSV** (fund, sub-category, old band, new band, rule, the file that holds the band) is
`OPS-02_d118_combined_changes_20261126.csv` in the month's `_review/` folder (local). It is for the owner's master range
workbook.

### The 9 removals (D116)

Each of these target-maturity funds has a target month that has been reached. They are removed from MASTER, from
DEBT_ANALYTICS and from `var IRR`; Bandhan Nov 2026 also leaves DIRECT_PERF.
- Kotak Nifty SDL Jul 2026 Index Fund-Reg(G)
- Aditya Birla SL CRISIL-IBX AAA NBFC-HFC Index-Sep 2026 Fund-Reg(G)
- Aditya Birla SL Nifty SDL Plus PSU Bond Sep 2026 60:40 Index Fund-Reg(G)
- Axis Nifty SDL Sep 2026 Debt Index Fund-Reg(G)
- ICICI Pru Nifty SDL Sep 2026 Index Fund-Reg(G)
- Nippon India Nifty AAA PSU Bond Plus SDL - Sep 2026 Maturity 50:50 Index Fund-Reg(G)
- SBI CPSE Bond Plus SDL Sep 2026 50:50 Index Fund-Reg(G)
- HDFC Nifty SDL Oct 2026 Index Fund-Reg(G) (C61)
- Bandhan CRISIL IBX 90:10 SDL Plus Gilt - Nov 2026 Index Fund-Reg(G)

Eight of the nine are in neither October monitor. Bandhan Nov 2026 was still listed on 2-Nov (AUM 90 Cr, refresh-only
sheet). Its maturity is about 7-Nov-2026, inferred from a 38-day average maturity on the 30-Sep portfolio. None of the
nine was a Select key, an alias, a RISK_MATRIX key, or in NEW_GIFT, `var SIF`, Terms or ExtraSlides.

### The 20 exceptions to the file rule

On the page afterwards, 10 debt MF / ETF records are outside the list and unchanged: the 8 segregated or unclaimed
plans and the 2 blends. The ABSL Income Plus Arbitrage FOF is the 11th standing exception for the monthly tool: it is a
Debt ETF record whose band comes from D116, not from the file.

- the 9 removals;
- 8 segregated or unclaimed plans. The 2 UTI "(Segregated - 06032020)" portfolios stay without a band. Franklin India
  Short Term Income Plan Segregated Portfolio 3 (6.5-7%), Franklin India Credit Risk Fund Segregated Portfolio 3
  (7-7.5%) and the 4 Quantum Liquid "Unclaimed" plans (5.25-5.75%) keep their band; none is investable;
- the 2 equity / G-Sec blends (the Mirae Nifty200 Momentum 30 Plus G-Sec 50:50 ETF; the Zerodha 70:30), C89;
- the Aditya Birla SL Income Plus Arbitrage FOF, which takes its D116 band (it is among the 51).

### For the owner (in the final summary)

- ITI Dynamic Term Fund-Reg(G) has a stored YTM of 5.39%, the lowest in Dynamic Bond; the next is 5.88%. It now carries
  the category's 7.50-7.75%. Accept it, or name an exception.
- Bandhan 90:10 Nov 2026 matures about 7-Nov-2026 (inferred from a 38-day average maturity on the 30-Sep portfolio). It
  is removed, as approved.
- In four categories the file's range sits away from the category's own average. The file is used as is (D117 point 1):
  - Money Market: average 7.32, range 6.75-7.00;
  - Short Term: average 7.82, range 7.25-7.50;
  - Credit Risk: average 8.62, range 7.75-8.25;
  - Dynamic Bond: average 7.48, range 7.50-7.75 (above the average).
- The footnote "YTM as of 31-Oct-2026" and `DATA_DATES.debtYtm` come with EX-02's TASK-089. Until it merges, the new
  bands show without that footnote.

## Method and gates

1. **The base.** A fresh worktree at `b728fa0`; `git merge-base --is-ancestor eb00377 HEAD` holds; `npm ci`;
   `verify_page` before.
2. **The backup.** The six deploy files and `robots.txt` in `<MAIN>\backups\2026-11-26_pre-task090\`, with `SHA256SUMS`.
   It matches the worktree.
3. **Gate (i), re-run on this base before the backup.** 539 of 539 old bands are in force at load, each in the store the
   list names: 0 drift, 0 store mismatches. `var IRR` applies at load by exact name (sibling line 17), so the split is
   exact.
4. **The local script.** `task090_bands.js`, sha256 77114c14def94decf8944c4dcb8ac177e3b0ae546a20ac1f52f739b208974363,
   kept locally. It holds the 539 rows and the 9 removals in its own source and writes through `tools/lib/blocklib.js`
   (`locate`, `spliceBlocks`, `writeFilesAtomic`). The dry run passed all 25 gates; then the apply ran. The gates:
   - byte round trips of `var IRR`, MASTER and DEBT_ANALYTICS;
   - every new end is k/400 in shortest form;
   - 539 unique rows; 9 removals, disjoint from the list;
   - the old value of every `var IRR` and MASTER row;
   - 515 / 9 in `var IRR`, with key order kept;
   - each MASTER name occurs once and is not a `var IRR` key;
   - 24 changed / 9 removed in MASTER, with no other record changed;
   - 9 removed in DEBT_ANALYTICS;
   - lines 2-3 matched once and replaced exactly;
   - the sibling byte-identical outside `var IRR` and lines 2-3;
   - `index.html` byte-identical outside MASTER and DEBT_ANALYTICS, and ending `</body></html>`;
   - ASCII.
5. **DIRECT_PERF.** `node tools/rebuild_directperf.js "<Direct 31-Oct>" --nav-date 2026-10-30 --html site/index.html`, on
   this base's tools (TASK-091 is not merged): dry run, then apply. Every gate passed. Exactly 1 key was removed, 0
   changed, 0 added. `index.html` is byte-identical outside the block.

## Checks (Gate C)

- **`verify_page`.** MASTER effective 7,723 -> **7,714**. Every other line is unchanged:
  - Select 184 (184 in MASTER);
  - PMS 696, AIF 10, benchmarks 4;
  - PMS_PERF_ALIAS 29 (1 null);
  - EQUITY_ANALYTICS 1,231; RISK_MATRIX 1,088; PMS_AIF_TERMS 73; EXTRA_SLIDES 6;
  - DATA_DATES;
  - 0 duplicates; 0 script errors.
- **Load state.** The base site against this branch, with the siblings applied. Everything passed:
  - `var IRR` 2,056; DEBT_ANALYTICS 512; DIRECT_PERF 1,718;
  - all 539 bands in force;
  - the 9 names absent from all six files;
  - the records gone are exactly the 9, and none was added;
  - no band and no other field changed outside the list;
  - the debt MF / ETF records not in the list are exactly the 10 standing exceptions, unchanged;
  - the Aditya Birla SL IPA FoF is at 7-7.5%;
  - 0 duplicates.
- **`npm test`.** 9 of 9 test files pass.
- **Financial-data review** (`financial-data-reviewer`, read-only, its own vm loads and mapping): **PASS WITH NOTES**.
  Nothing blocks the merge.
  - **What it confirmed:**
    - the 539 bands: its own mapping gives every listed debt row the file's range (`YTM- 31st OCT.xlsx`, Sheet1 E3:E18),
      and all 539 old values equal the base;
    - the 51 kept rows equal D116;
    - the 9 removals (dated Jul-Nov 2026; average maturity 0.01-0.27 years; YTM 5.24-6.99%) are gone from every store,
      and nothing else was added or removed;
    - no other field or record changed;
    - every band end is an exact k/400 decimal.
  - **Notes for the owner (client-facing, not defects):**
    - **(A) Funds far from their category range.** Some funds' stored YTM sits well away from the range:
      - ITI Dynamic Term: 5.39% against 7.50-7.75%;
      - Bandhan Dynamic Term: 5.88%;
      - Unifi Liquid: 4.84% against 6.25-6.75%;
      - Bandhan Gilt: 5.29% against 6.75-7.25%;
      - Bandhan Medium Term: 7.03% against 8.00-8.50%;
      - about 12 target-maturity funds maturing Apr-Sep 2027 (YTM 5.9-6.3%) at 7.00-7.50%;
      - the Kotak and Nippon CRISIL-IBX FS Dec 2026 funds (YTM 6.7-6.8%) at the Overnight 5.25-5.75%.

      The owner may extend the 3-month rule or name exceptions.
    - **(B) The November method.** The owner's October averages cannot be reproduced from either October monitor: the
      monitor means are 0.15-0.40 points lower. With D117 point 2 (the monitor mean, as is) the November ranges would
      move about 0.25 points for that reason alone. Examples, applied to October data: Overnight 5.00-5.50%, Liquid
      6.00-6.50%, Credit Risk 8.00-8.50%. The owner knew of the gap when choosing (a); the move is recorded here so
      that November's change is not read as a market move.
  - **Minor:**
    - the sibling's line 3 keeps the build-time breakdown (2046 + 19 = 2065) beside the new 2056, as contract C5 chose;
    - the owner CSV's basis text for the 51 kept rows is reworded to "kept at the band the owner approved on 24-Nov";
    - C89's class labels are unchanged.
- **Browser and exports** (`qa-verifier`; headless Edge with sync and extensions disabled; this branch and the base
  served side by side): **all checks PASS**.
  - **Load:** console clean; "Universe - 7714 instruments."; the served `index.html` equals the worktree's.
  - **Named surfaces, before -> after** (picker, Section 4, Live Output, Excel, deck slide 15):
    - HDFC Liquid 5.25-5.75% -> 6.25-6.75%;
    - Tata Nifty G-Sec Dec 2026 9-11% -> 5.25-5.75%, with its unpublished 5Y now 5.50%*;
    - ICICI Pru Nifty 10 yr Benchmark G-Sec ETF 9-11% -> 7.00-7.50%, with 5Y 7.25%*;
    - Tata CRISIL-IBX FS 3-6M 6-7.5% -> 7.00-7.50%, with 1Y/3Y/5Y 7.25%*; all 15 CRISIL-IBX FS funds read 7.00-7.50%;
    - HDFC Income Plus Arbitrage Active FOF 10-12% -> 7.00-7.50%;
    - ITI Dynamic Term 6.75-7% -> 7.50-7.75%;
    - Aditya Birla SL Corp Bond 7-7.5% -> 7.50-7.75%;
    - the 9 removed funds return no rows in the picker.
  - **Weighted figures for one 7-fund debt proposal:** the expected pre-tax return tile went from 8.06% to 7.04% (7.0375%
    by hand); Section 4's grand total went from 7.48-8.65% to 6.83-7.25%.
  - **Excel:** 13 sheets, 0 formula errors, no repair log; the IRR Low / High columns carry the new decimals.
  - **Deck:** 24 slides; layout warnings none; `render_pptx.ps1` and `check_pptx_bounds.js` clean. Slide 15 shows the new
    bands and the grand total 6.83-7.25%.
  - **Also passed:** all 9 Live Output tabs render; the credit doughnut sums to 100; the allocation sheet round trip
    holds; Regular / Direct both work.
  - **Seen, already known:** C67 (on-screen Avg Maturity shown as a percent) and C65 / C93 (Tata FS average maturity).
  - Evidence is kept locally in `_review/ops02_browser_task090_branch/` (not published).

## Before the next refresh (the removal watch)

In the November run, list any of the 9 removed names that comes back:
- as an analytics key (the analytics merge, or bake step 1);
- or as a "NEW funds added to MASTER" line (bake step 2).

Stop the run if one does. A later analytics merge can bring back DEBT_ANALYTICS keys for them, as orphans that never
show; the bake must not re-create them as records.

**Final files.**
- `site/index.html` sha256 6311cfc8ce8c8f4c3540434c12625f5fcf73367aebb355afdbb41006e0dc1370.
- `site/Centricity_IRR_Offshore.js` sha256 e55c569f41ac22090bced260abe6ad9b065426cb49c83a201b73d62ed395f4fe.

_Correction 26-Nov-2026 (MOD-03, release record of PR #76): the D117 clause numbers above were renumbered to match docs/DECISIONS.md (mapping = point 4, twin-band reversal = point 5, 3-month rule = point 6, file used as is = point 1); the data is unchanged._

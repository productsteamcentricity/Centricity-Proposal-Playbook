# Update log - TASK-087: one expected-figure rule and the look-through "Others" label (24-Nov-2026)

**Run:** 24-Nov-2026, branch `fix/expected-figures-label` from `origin/main` `094f3e1` (TASK-088 merged as PR #72,
`368fe0a`). Operator: Claude Code, chat EX-02 (workstream EX), Moderator MOD-03. Page code only; no data change.
**Decisions:** D112 points 2 and 3 (23-Nov-2026) and D114 (the owner's answers, 23-Nov-2026: option A, one rule
everywhere, young mutual funds included; fund performance tables keep "-"; only the look-through label is renamed; the
screen star follows `H.isExpectedReturn`). **Risk:** High (export code; a client-facing calculation). Contract v3 and the
claim: `docs/project-control/ACTIVE_CHANGE_REGISTER.md`; Guardian pre-check GO WITH CONDITIONS (C1-C8 folded in).

## What changed (`site/index.html`, code only; data blocks byte-identical)

| Item | Where (grep) | Change |
|---|---|---|
| Totals (C59) | `H.weightedReturns = function` (~L2104) | Weights 1Y as well as 3Y/5Y through `H.effectiveReturn` (the band mid-point when a period is missing); returns `r1y`. The one rule for every proposal total. |
| Totals (C59) | ProposalTab `const wr = H.weightedReturns(selected)` (~L7470); Section 4 `const r1yTot = tot.r1y` (~L6951) | The Live Output "Investment Proposal" tab GRAND TOTAL and Section 4's 1Y total use it; the tab's raw 1Y/3Y/5Y loop goes. The IRR range keeps its rule (C24). |
| Excel | `xrCell` (new, ~L4008) and the three return cells of each row (~L4036) | Each 1Y/3Y/5Y cell holds `H.effectiveReturn` as a number; an expected figure (`H.isExpectedReturn`) carries the number format `General"*"` (Excel shows "0.18*"); empty only when there is no figure and no band; a note row under GRAND TOTAL when anything is starred (C91: the star shows in Excel only). |
| Stars | ProposalTab rows (~L7535-7545), Section 4 return cells (~L6906-6930), CSS `.sel-table td.fallback::after` (~L762) | Both star by `H.isExpectedReturn` (the deck's rule): Section 4 gains the "*"; the Live Output tab also stars stored yields, FD rates and stored mid-points. An override is never starred. |
| Label (D112 a) | `labels: ["Large Cap", "Mid Cap"` and its chart options (~L8190-8250); `aoa.push([k === "Others" ...` (~L4191); deck `labels: ["Large", "Mid", "Small"` (~L5076) | The look-through m-cap bucket reads "Others (cash, unlisted, foreign, REITs)": on screen on three level lines with 14 px top padding (x labels kept level; the chart's x axis takes the dashboard style - no vertical gridlines, no axis line, Cambria 11 - like the Top 10 Sectors chart); in Excel "Equity Analytics" and on the deck chart as one label. |

Unchanged on purpose: `H.effectiveReturn` and the headline KPIs (`H.computeKPIs` keeps its own copy of the rule, C92);
the fund performance tables (screen, Excel sheets 3-8, deck Fund Performance) keep "-"; the fund-level "Others" m-cap
columns; IRR low/high totals (C24).

## Rehearsal and apply
- Phase 1 on `a016fc5`; contract v3 after the Guardian pre-check. The same exact-once replacements, rebuilt on this base:
  every anchor found once, +60 / -57 code lines, no data line.
- Base `site/index.html` sha256 4a9a35f996e245e0597d640fcb14e4ff91c707f1f2b46e8cef40e26a8125e732 (TASK-088). Prototype
  sha256 **df116b3b67054d7b21a6da364ab725e2c9cc7b22065ec389bf2f5bf954466dfb**, sent to MOD-03 before the edit; the applied
  `site/index.html` equals it (atomic write through `tools/lib/blocklib.js`).
- Backup: the six deploy files in `%USERPROFILE%\...\backups\2026-11-24_pre-task087\` with `SHA256SUMS`.
- Siblings and `robots.txt` unchanged.

## Newly starred cells (C4; MASTER on this base, every 1Y/3Y/5Y cell)

| Type | Records | Records with a starred cell | Mid-point cells (Excel: blank -> starred mid-point) | Stored-expected cells (Excel and Live Output: newly starred) | Section 4: newly starred cells |
|---|---|---|---|---|---|
| MF / ETF / index | 2,125 | 1,108 | 2,142 | 0 | 2,142 |
| GIFT City | 56 | 56 | 165 | 3 | 168 |
| Bonds | 50 | 50 | 0 | 150 | 150 |
| AIF | 33 | 32 | 72 | 15 | 87 |
| SIF | 31 | 31 | 93 | 0 | 93 |
| PMS | 29 | 9 | 15 | 3 | 18 |
| Unlisted Equity | 7 | 7 | 6 | 15 | 21 |
| Fixed Deposit | 6 | 6 | 0 | 18 | 18 |
| Offshore Funds | 4 | 4 | 12 | 0 | 12 |
| REIT/InvIT, MLD | 2 | 2 | 3 | 3 | 6 |
| **Total** | **2,343** | **1,305** | **2,508** | **207** | **2,715** |

- The mid-point cells were already shown with "*" on screen (Live Output) and in the deck; what is new for them is Excel and
  the Section 4 star. The stored-expected cells (bond yields, FD rates, stored mid-points) were starred in the deck only.
- TASK-088 effect: records with a starred cell 1,175 (before TASK-088, `a016fc5`) -> 1,305 (+130: 122 MF/ETF, 3 AIF,
  2 Unlisted Equity, 2 GIFT City, 1 SIF). 31 of them are new records (e.g. the TASK-088 MF stubs) and 99 existing records
  that gained a band.

## Samples (corpus 100 Cr)

| Proposal | Live Output GRAND TOTAL 1Y / 3Y / 5Y before | after (= Section 4 = deck) |
|---|---|---|
| P1: 30% HDFC Large Cap Fund, 15% Parag Parikh Large Cap Fund, 15% Motilal Oswal Founders Portfolio, 15% Alchemy Long Term Ventures Fund, 15% Edelweiss Altiva Hybrid Long-Short Fund, 10% Neo Yield Enhancer | -2.00% / 10.75% / 8.84% | 4.90% / 11.79% / 12.00% |
| P2 (TASK-088 cases): 40% HDFC Large Cap Fund, 20% Kotak Nifty 500 Index Fund (a TASK-088 stub), 20% Invesco India BSE Sensex Index Fund (newly banded), 20% Maverick Simulation Solutions (new Reckoner record) | -6.89% / 8.22% / 8.84% | 6.24% / 12.29% / 12.54% |

Excel "Investment Proposal", 1Y / 3Y / 5Y, after: P1: Parag Parikh 0.12* x3; Motilal Founders -0.007 / 0.158 / 0.16*;
Alchemy 0.18* x3; Edelweiss Altiva Hybrid 0.1* x3; Neo Yield Enhancer 0.1073 / 0.095* / 0.095*; HDFC Large Cap unchanged
(-0.0689 / 0.0822 / 0.0884); note row. P2: Kotak Nifty 500 and Invesco BSE Sensex 0.12* x3; Maverick 0.21* x3. Before,
all those cells were blank.

## Checks
- `node tools/verify_page.js site`: exit 0, identical to the base (MASTER effective 7,723).
- `npm test`: 9 of 9 files, 0 failures. New `tools/test/expected_returns.test.js` 58 checks on seven synthetic records added
  to the vm's own copy of MASTER for the test and removed after (never written to `site/`); on the base page it fails 27.
- Block-by-block comparison (`tools/lib/blocklib.js`): MASTER, EQUITY / HYBRID / DEBT_ANALYTICS, CENTRICITY_SELECT,
  MF_BENCHMARK_PERF, PMS_PERFORMANCE, PMS_PERF_ALIAS, RISK_MATRIX, DIRECT_PERF identical; the 12 data lines identical; the
  file ends with `</body></html>`.
- Browser, Excel and PowerPoint (`qa-verifier`, independent; headless Edge over DevTools on this worktree's page and on the
  backed-up base; Excel / PowerPoint COM): **PASS** on all six checks, no regression.
  - Load: "Universe - 7723 instruments."; 0 console messages through load, both proposals and every export.
  - Screen, P1: Section 4 stars on exactly the expected cells; Section 4, Live Output and the Section 1 weighted 3Y/5Y all
    read 4.90% / 11.79% / 12.00% (before, Live Output -2.00% / 10.75% / 8.84%); an override (Parag Parikh 3Y 11.50) removes
    only that star, in both places, and both totals move to 4.90 / 11.71 / 12.00; Direct moves both totals together (4.57
    / 11.91 / 12.22) with the stars in place, and Regular restores the earlier state. P2: 6.24% / 12.29% / 12.54% in both
    (before, Live Output -6.89% / 8.22% / 8.84%).
  - Market-cap chart: the four labels level, the three-line "Others" label legible, no clipped value label. Style change
    as described, plus the x-axis line itself (no vertical gridlines, no axis line, Cambria 11 #333 instead of Helvetica
    #666), matching the Top 10 Sectors chart; before/after screenshots kept with the check.
  - Excel (COM, read-only): sheet 1 starred cells are numbers with the format `General"*"` (P1 E9:G9 0.12, G11 0.16,
    E13:G13 0.18, E16:G16 0.1, F19:G19 0.095; P2 0.12 x6, 0.21 x3) and the note row; every other sheet identical to the
    base cell by cell (Rationale, the six performance sheets, Other, Debt, AMC, Overlap) except Equity Analytics A8, the new
    label.
  - Deck: P1 26 slides, P2 23; `__PPTX_LAYOUT.warnings` empty; render + `check_pptx_bounds.js` "no problem found" on all
    four decks (before and after); the equity slide's category wraps to two lines under the axis; the slide text is
    identical before and after on every slide, the Fund Performance slides included (still "-").
  - Not covered here: a starred bond or FD yield in a browser proposal (covered by the test and the financial review).
  - Seen on the base too: the Excel GRAND TOTAL row carries no 1Y/3Y/5Y figures (unchanged; outside this task).
- `financial-data-reviewer` (census and samples): **PASS WITH NOTES**, no code defect.
  - Scale: Excel values are MASTER decimals, the same scale as today's cells; the format `General"*"` is written to the
    file; `H.weightedReturns` matches an independent formula (P1 4.9000 / 11.7853 / 12.0022; P2 6.2426 / 12.2871 /
    12.5363); Section 4's 1Y total equals the old loop; the Live Output IRR low/high unchanged (C24 rule).
  - The census reproduced independently: 1,305 records, 2,508 + 207 cells, by type as above; +130 records against the
    pre-TASK-088 page, none removed; every mid-point cell equals (irr_low + irr_high) / 2 and is starred. 15 spot checks
    across the TASK-088 stub, a newly banded MF, PMS, AIF, SIF, GIFT City, a bond, an FD, an InvIT, an MLD and Maverick:
    all right. The six MF cells with no figure and no band (C60) stay blank; Direct Equity gets no star; no published
    return is starred; an override is never starred.
  - Performance tables unaffected (Excel `perfRows` reads raw figures; no hunk touches the deck or screen performance
    tables; the other `rollupReturns` readers use only IRR and 3Y/5Y).
  - **Note A (owner, data; out of scope):** 132 debt MF/ETF records carry a 9-11% band (102 Debt ETF, 29 "Gilt", 1 Low
    Duration), among them 17 liquid / overnight / 1D-rate ETFs and target-maturity index funds whose YTM is 5.2-7.8% (e.g.
    a CRISIL liquid overnight ETF now shows 5Y 0.10* in Excel). The same figures already showed in Section 4, the Live
    Output tab and the deck; in Excel they are new (196 cells) and they move the Live Output totals. Also: all 55 GIFT City
    funds share one 10-12% band; equity ETFs are banded 9-11% while index funds are 11-13%. Related: KNOWN_ISSUES C89.
  - Note B: for a bond the starred figure is its stored yield (the band high), which the note row covers.
  - Note C: the Live Output GRAND TOTAL moves by design (C59): the owner should expect it.
- `security-reviewer`, the PR `verify` check, Gate B: recorded on the PR.

## KNOWN_ISSUES
- **Closed:** C59 (the 1Y/3Y/5Y totals of Section 4, the Live Output tab and the deck are equal; the IRR range still
  differs, C24).
- **New:** C91 (the Excel star is a number format: Excel only); C92 (`H.computeKPIs`' own copy of the mid-point rule).

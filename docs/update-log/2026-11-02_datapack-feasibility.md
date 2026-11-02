# TASK-022 feasibility: can the Portfolio Matrix be fed from the MF dashboard data pack? (2-Nov-2026)

| Field | Value |
|---|---|
| Version | 1 |
| Date | 2-Nov-2026 |
| Author chat | MOD-02 (analysis by four read-only analysts at its request) |
| Status | Record of what was analysed, found and recommended on 2-Nov-2026. The registers stay authoritative for state; the recommendation (Option 1) is a proposal until the owner answers section 9 |
| Related ids | DEC-OPEN-01 (answered), D84, D85, D86, DEC-OPEN-30 to -33, KNOWN_ISSUES B8 and C46, TASK-022 (re-scoped), TASK-078 |
| Supersedes | none |
| Next review | when the owner has answered DEC-OPEN-30 to -33, or when TASK-022 is launched |

Reading guide: Moderator, sections 6, 9, 12; new-build sub-chat, 3, 7, 8, 13; Guardian, 7, 11, 13; owner, 5, 9, 10, 12. The ids Q, T, L, R,
F and the asks a-i are local to this record (R and F are also KNOWN_ISSUES families, so those are written with the file name). VERIFIED =
counted or recomputed by an analyst on the files; INFERRED = deduced or estimated; NOT CHECKED = not looked at.

## 1. Purpose, method and what was NOT checked

On 2-Nov-2026 the owner answered DEC-OPEN-01 (who makes the NAV Data and Fund Risk Ratios workbooks from October) and attached two data
packs. This record answers whether the Portfolio Matrix (the `RISK_MATRIX` block) can be fed from them, at what cost, with what change for
clients, and what the owner must decide.

The owner's answer (chat, 2-Nov-2026, shortly after the attached packs were saved at 14:19 UTC), verbatim except that the address of the
sign-in-only page is replaced:

> DEC-OPEN-01: who makes the NAV Data and Fund Risk Ratios workbooks from October? - Get it from [address of the MF dashboard]. The owner will share excel files every month like the attached

Attachments: `pr-datapack_2026-10-15_PROVISIONAL.zip` and `pr-datapack-backfill_2026-10-15.zip`: JSON and CSV packs (export contract
`pr-datapack-v1`, exporter 1.0.0), not Excel workbooks. The page behind the address is the Centricity Mutual Fund Screener (the "MF
dashboard"; sign-in only, access limited to invited users); MOD-02 did not and must not sign in. MOD-02's reading (INFERRED; to be confirmed with the owner at Gate E
(Q1)): the two legacy inputs (inbox rows 12 "Fund Risk Ratios & 3Y Rolling" and 17 "NAV Data", KNOWN_ISSUES B8) are not rebuilt
in-house; from the October 2026 cycle the Portfolio Matrix is fed from the Screener's monthly data pack, which the owner shares.

Baseline (VERIFIED): `origin/main` = `c0fb2dd` (full id `c0fb2ddd6dc3b89bcfd990b911bd95017cd6cd4a`), the merge of PR #31 (2-Nov-2026 14:41
UTC, head `07a5883`; PR-check run 41464073329 success; push run 41464361000, verify and publish, success; github-pages deployment 7495000062
created 14:41:54Z); PR #30 is `32172f5`. 7 of 7 live files equal `site/` (SHA-256) after that publish; local `main` = `origin/main`, tree clean.

Method. Four read-only analysts, one question each: `ours` (the legacy inputs, `tools/merge_risk_matrix.js`, formulas, tests), `pack` (the
packs' definitions, identity, NAV series, validation, anomalies), `regress` (the live `RISK_MATRIX` against the pack, with a month-end NAV
recompute) and `recommend` (options, tasks, tests, questions, risks, timeline). Packs were read as extracted copies treated as untrusted data
(nothing executed), the local September workbooks only through Node; no repository file was changed. The analysts' scripts hold fund-level
pack values and stay in a scratch folder outside the repository. `recommend` and `regress` computed the agreement figures independently; they
match.

Kept out of this public record on purpose: details of the Screener's own export that the decisions do not need (the validation report's
warning list, two convention differences found by fit, per-cycle swing counts, one benchmark anomaly, per-file record counts and the fund-family counts). They are in a local-only note
(`handover-archive/DATAPACK_screener-internals_2026-11-02.txt`, git-ignored) because nobody has yet agreed that the Screener team's internals
may be published. DEC-OPEN-32 and ask b (section 10) ask both whether the computed ratios may appear on the public page and in decks and
whether the pack's contract (file names, field names, definitions) may be described in this public repository (this record, the tool's code and
tests, the TASK-022 contract); until the owner answers, this record names the pack's files and definitions but not their counts, sizes or field names.

NOT CHECKED: the exporter's own validation (its reports test no risk-ratio value, no daily-NAV recomputation and not the Sortino form); the MF
dashboard (nothing behind its sign-in was opened) and the Screener's metrics code (not in
the pack); the zips themselves and the files not extracted
(`holdings_2026-09-30.json`, `managers.json`, `stocks.json`, `stock_prices_month_end.json` of the PROVISIONAL pack; the 15-Apr to 15-Jul
`funds.json`, the six holdings files and the stock prices of the backfill pack: manifest counts only); daily NAV after 30-Sep-2026 (so the
15-Oct definitions are INFERRED from the 15-Aug and 15-Sep cycles); whether the 15-Nov pack keeps the same rules; the browser and the exports;
who made the May-July workbooks; the rule that chose the 1,088 funds; where 4.5% comes from (DESK-15); whether the desk approved the textbook
Sortino (DESK-16).

Bottom line (findings VERIFIED, effort INFERRED). Feasible, with changes the owner must accept. Identity (1,076 of 1,088 keys), units and most
values agree with the live table on funds with a full three-year record (finding 3), but the pack is not a like-for-like replacement: its date
is 15-Oct, not month-end; its Sortino is June's form (D85 cannot be honoured from pack data); its alpha is excess return (Jensen must be
derived); each fund has its own benchmark; coverage falls (Beta 966 -> 593); the 33 daggers go. Recommended: Option 1, a thin bridge (about 6
working days, risk class HIGH): a new tool turns an extracted pack into the existing #12 workbook layout and `tools/merge_risk_matrix.js` stays
the only writer, with one owner-only override. The critical path has zero slack; if the build is not merged when step 10 of the October cycle
is reached, the page keeps "30 Sep 2026" (section 12).

## 2. What the packs are

From the manifests, the validation reports and the files held (VERIFIED unless marked).

| | PROVISIONAL pack (`pr-datapack_2026-10-15_PROVISIONAL`) | Backfill pack (`pr-datapack-backfill_2026-10-15`) |
|---|---|---|
| Contract, exporter | `pr-datapack-v1`, 1.0.0; both manifests cite the same source commit | same |
| Cycle | 15-Oct-2026 (the pack's own cycle label); generated 23-Oct-2026 12:32 UTC, 8 days after the cycle date | six cycles, 15-Apr to 15-Sep-2026; the anchor 15-Oct-2026 is the pack's own date, not a cycle; generated 23-Oct-2026 12:33 UTC |
| Validation | provisional; 1 blocking failure | final; 0 blocking |
| Content | manifest and 13 listed files: `funds.json`, `nav_month_end.json`, `funds_summary.csv`, `benchmarks.json`, `categories.json`, `changes.json`, `definitions.json`, `holdings_2026-09-30.json`, `managers.json`, `stocks.json`, `stock_prices_month_end.json`, two validation notes | manifest and 26 listed files: per cycle `funds.json`, `categories.json`, `benchmarks.json`; six month-end holdings files (31-Mar to 31-Aug); `stock_prices_month_end.json`; the validation report. No `nav_month_end.json`, `definitions.json`, `changes.json`, `managers.json`, `stocks.json` or `funds_summary.csv` |
| Integrity | 9 of the 9 files held match the manifest (SHA-256 and bytes) | 15 of the 15 files held match; 0 mismatches; no unlisted file in either pack |

- Funds: the pack covers the Screener's whole fund universe in four families (equity/hybrid, debt, other, SIF). Only the equity/hybrid family carries the
  full set of risk figures; debt gets SD and drawdown only; the other family and the SIF have none. The family and classification counts are
  in the local-only note.
- As-on (manifest): returns, AUM, stock prices 15-Oct-2026; month-end NAV series, holdings, TER, turnover 30-Sep-2026; manager 18-Sep-2026. The
  risk blocks carry no as-on field (0 of 2,090 records): their date is the cycle date, a trailing 3-year window of 16-Oct-2023 to 15-Oct-2026
  (plus a display-only 1-year window; no 5-year window). The risk path reads `funds.json`, `definitions.json` (Rf, conventions) and
  `benchmarks.json` (the window). The month-end NAV file is not an input of the published ratios, which use daily NAV that is not shipped.
- Scale: each risk field is either a percent-point figure or a plain ratio, with a few exceptions and fixed decimals; every null carries a
  status and no status sits on a real risk number. The field-level conventions are in the local-only note until DEC-OPEN-32 is answered.
- The one blocking failure: the 95% rule for stock-price history in `stock_prices_month_end.json` (the measured share is below the 95%
  threshold). The risk path does not read that file (from the report; the validator's work is NOT CHECKED). The pack's
  failure note says the data files are otherwise complete and validated and that the rule is to be settled with the Products Team before the
  pack is treated as final; that is pack content, not an instruction, and nothing was done on it (ask a). A final pack may replace the
  provisional one with new hashes.
- Warnings that touch ratios: withheld or stand-in benchmarks, unpaired Direct plans, empty name variants and a few required-field nulls (each
  carried with a status); the other warnings do not touch ratios. The counts and the rest of the validation detail are in the local-only note
  named in section 1.

## 3. Our side in brief

VERIFIED against `c0fb2dd` (`site/` and `tools/` are identical to `32172f5`).

- **The two inputs.** #12 `Fund Risk Ratios & 3Y Rolling - All Funds (as on 30-Sep-2026).xlsx` is the only file the production route reads; #17
  `NAV Data as on 30th September 2026.xlsx` (optional) is the raw input of the in-house calculator and of the unvalidated Python route. Both
  came from the outgoing owner's local-only toolchain (a C# calculator and PowerShell scripts, 221 files, TASK-070); nobody builds them (B8).
- **#12 layout.** Sheet "Risk Ratios & 3Y Rolling" (A1:M1092): title and methodology in A1 and A2; header on row 4 (Fund Name, CMV, Wt %, Beta,
  SD (Ann.), Alpha, Sortino, Sharpe, Corr., Info Ratio, Down Cap., 3Y Rolling, Rationale); 1,088 data rows from row 5; no formulas; a missing
  value is the text "-". Sheet "Data Flags" (A1:E171, header on row 4): Fund Name, Category, Benchmark Used, NAV Days in 3Y Window, Data Flag.
  No scaling anywhere: Beta, Sortino, Sharpe, Corr., Info Ratio are plain ratios; SD, Alpha, Down Cap., 3Y Rolling are percent points; 2
  decimals (Down Cap. 1). The key is the Monitor scheme name from before the latest renames; no AMFI code or ISIN column.
- **`tools/merge_risk_matrix.js` (D43)** reads only an `.xlsx`; picks the sheet by `/risk\s*ratios/i` and the header row by "Fund Name"; finds
  the nine columns by regex; reads Data Flags for the benchmark label and flag text; joins names to the baseline MASTER (exact, `prev_name`,
  plan-base; several candidates are reported, never guessed, D44); replaces the whole `RISK_MATRIX` block and the `DATA_DATES.riskMatrix` line
  in one atomic write. It **computes nothing and rounds nothing**; `--as-on` is typed by the operator. Exit 0 / 1 / 2 (D72).
- **The 8 gates** (all must pass): every key exists in the baseline MASTER, not the effective one (C42); no ambiguous join; no collision; the
  key count did not shrink (1,088); the funds with metrics did not shrink (966); every record has a benchmark label; the `riskMatrix` date line
  is found exactly once; the page still ends `</html>`. Not gated: unmatched rows, which keys are covered, whether `--as-on` matches the
  workbook, units, flags lost when Data Flags is missing.
- **Ratios and live block.** The in-house calculator computes the ratios in the workbook (Rf 4.5% p.a. as 4.5%/252 per day, population SD,
  textbook Sortino per D85, Jensen alpha on 365.25-day CAGRs, a window from the first NAV on or after the 3-year anniversary, four benchmarks by
  category). The live block: 1,088 keys; the nine numbers on 966; `rr` on 433; `bm` on all; `fl` on 33 (28 split, 5 lowcorr);
  `DATA_DATES.riskMatrix` "30 Sep 2026". No sibling script reads or writes either.
- **The September re-run (VERIFIED, scratch copy of the page).** The September workbook through `merge_risk_matrix.js --apply` gives a page
  byte-identical to `site/index.html`: 8 of 8 gates PASS, keys 1,088 -> 1,088, with metrics 966 -> 966, rolling 433 -> 433, join tiers 1,027
  exact / 32 `prev_name` / 29 plan-base, 0 unmatched, 0 ambiguous, 0 collisions. A Node port of the in-house calculator also reproduces all
  8,161 live cells (966 x 8 plus 433 rolling). So the live block is exactly "September workbook -> this tool". No test recomputes it today.

## 4. Findings

1. **What the packs carry (VERIFIED; section 2).** 2,090 funds in four families, cycle 15-Oct-2026, returns
   as on 15-Oct-2026, holdings at 30-Sep-2026; month-end NAV history, 1-year and 3-year risk blocks (SD, Sharpe, Sortino, beta, alpha, Treynor,
   information ratio, tracking error, R-squared, capture ratios, drawdown), the benchmark list, the AMFI scheme code. Rf is stated as 4.5% (equal
   to D84). PROVISIONAL because one check failed (the 95% stock-price history rule), which the risk path does not read; the hashes match.
2. **Identity by name alone (VERIFIED).** 1,076 of the 1,088 keys match a pack fund (1,043 exact + 33 through MASTER `prev_name`); 0 ambiguous;
   no pack row claimed twice. 12 are unmatched (10 carry live ratios): 10 have exactly one pack candidate with the same inception date under
   another spelling (proposed pairs, never auto-applied), 2 are absent from the pack (an index fund, a May-2026 launch). Trap: 6 of the 33
   `prev_name` matches are JioBlackRock Regular keys that land on Direct-plan pack rows (the pack's plan field says Direct); a plan guard is needed (C20,
   DEC-OPEN-07). The page has no AMFI code (MASTER holds no code or ISIN for funds); ISIN is unusable (281 `other` funds only);
   the alternative-names field is unusable (filled for few funds, unevenly across cycles). A bridge by AMFI code through the local
   September NAV workbook finds 1,077 and agrees with the name rules on all 1,045 keys both find.
3. **Agreement with the live 30-Sep table on clean funds (VERIFIED, two analysts).** Clean = no live flag, same AMFI code, full 3-year history,
   and for relative metrics the same benchmark. Against the 15-Oct pack: Beta (n=312) 100% within 0.05; Corr 100% within 0.02; SD (n=581) 98%
   within 0.25; Down Cap 97% within 1.0; Sharpe 77% within 0.05; Info Ratio 66% within 0.10; derived Jensen alpha 69% within 0.5; 3Y Rolling
   (n=385) 86% within 0.25. Against the 15-Sep pack the gaps shrink (SD 100%, Sharpe 90%, Jensen alpha 79%, Rolling 80%): the live date lies
   between the two cycles, so most of the gap is the as-on date, not the formulas. Rank order agrees (Spearman 0.987 or more). No
   percent/decimal slip: the median pack/live ratio is 0.992 to 1.005 for Beta, SD, Corr, Down Cap, 3Y Rolling.
4. **Definitions that differ from the live table (VERIFIED on the 15-Aug and 15-Sep cycles; INFERRED for 15-Oct).**
   (a) Sortino = mean excess / SD of the negative-excess days only (June 2026's form, also in `tools/build_risk_matrix.py`; C35), not the
   textbook form of D85. On 205 funds whose daily series provably equals the pack's, the June form matches the pack within 0.014 for 205 of
   205, the textbook form within 0.02 for 119 of 205; a test on 559 funds agrees. The textbook form cannot be built from the pack. The pack's
   Sortino is about 6% lower than the live one at the same date, about 12% at 15-Oct.
   (b) Alpha = excess return (fund minus benchmark CAGR), "not Jensen"; the page says "Alpha (Jensen)"; Jensen can be derived from the 3-year
   returns, beta and Rf. (c) Benchmark = each fund's own (103 names on the matched keys), not four indices: the label differs
   for 554 of 1,029 funds; Beta, Corr, Info Ratio, Down Cap and Alpha change meaning (not only date) for 264 of the 593 funds that keep
   relative ratios; 7 of the 593 are measured against a price index (PRI). (d) Window = trailing 3 years to the cycle date (15-Oct); no as-on
   field; the start convention is not stated. (e) Coverage = full 3-year record only. (f) Two small convention differences found by fit
   (INFERRED; the detail is in the local-only note): the effect on the table is under 3%.
5. **Coverage (VERIFIED).** Beta 966 -> 593 (373 lose it: of the 363 matched, 311 insufficient history, 39 stale benchmark, 9 no benchmark, 4
   (reason to be confirmed: PROXY benchmark or no source); plus 10 unmatched); SD, Sharpe, Sortino 966 -> 636; 3Y Rolling 433 -> 451. The
   merge gate "funds with metrics did not shrink" (966) would stop the merge. Coverage also swings with the exporter's rules from cycle to
   cycle (the count of funds with a 3-year beta differs by more than 10% between three cycles; the counts are in the local-only
   note). The pack has ratios for about 536 debt and hybrid funds that the page leaves out (section 14).
6. **Flags (VERIFIED).** The 33 flagged funds (28 split, 5 lowcorr) would lose their dagger. The pack is split-adjusted: for the split-flagged
   funds the live SD is about 3.5 times the pack's (median), so the pack values are the sane ones; the 5 lowcorr funds are global funds mapped
   to NIFTY 500 in the live table, which the pack measures against their own indices. No matched pack fund has an absolute beta below 0.30, so
   `fl` goes from 33 to 0.
7. **Rf (VERIFIED; the daily conversion INFERRED).** The pack states 4.5% p.a. (`definitions.json`), equal to D84. Non-circular check on 394
   funds with equal SD: Sharpe within 0.02 for 375 at 4.5% (Rf/252 per day); at 4.0%, 5.0% and 5.26% only 15, 3 and 0 funds are within 0.01
   (205 at 4.5%). D84 holds.
8. **The month-end NAV file cannot reproduce the ratios (VERIFIED).** Recomputed from month-end NAV for 776 equity/hybrid funds, SD is about
   8-9% too high (median ratio 1.078), Beta is off by a median 0.02 to 0.03 and Down Cap by about 4 points; only 3Y Rolling and Corr
   reproduce. So no month-end risk table can be built from the pack; every pack ratio is as on the 15th.
9. **Other findings (VERIFIED unless marked).** `tools/build_risk_matrix.py` (run to scratch) joins 1,086 of 1,088 names and agrees with the
   live table on Beta and 3Y Rolling (100%) but on only 94.7% of SD, 89.8% Sharpe, 64.6% Info Ratio, 74.1% Down Cap, 75.3% Corr, 27.6%
   Sortino, 19.6% Alpha: there is no second in-house route (TASK-070 keeps the calculator as the textbook-Sortino reference). Defects in the
   live table, not the pack (causes INFERRED; finding 3 excludes them): 28 split-ETF rows with SD about 3.5 times the pack's, 16 `rr` values
   below -5% (5 unflagged), about 28 keys apparently fed by a non-Growth-option (IDCW) NAV, the 6 JioBlackRock Regular keys apparently fed by
   Direct-plan NAV. Pack anomaly: one benchmark behaviour that withholds the relative metrics of the funds that use it (local-only note). `funds_summary.csv` lacks Sortino, information ratio, tracking error, R-squared and capture ratios, so it cannot
   feed the table.

## 5. What differs from the live table and what clients would see

| Item | Live table (30-Sep-2026) | From the pack (15-Oct-2026) | What the owner and clients would see |
|---|---|---|---|
| As-on date | month-end, label "30 Sep 2026" | the 15th; no month-end risk exists | label "15 Oct 2026" on the tab hint and the deck stamp; the matrix lags the month-end data by about two weeks |
| Source | in-house calculator on daily AMFI NAV | the Screener's metrics code on its own split-adjusted daily NAV (code not in the pack) | nothing visible; provenance changes (F1) |
| Window | from the first NAV on or after 30-Sep-2023 to 30-Sep-2026 | 16-Oct-2023 to 15-Oct-2026; start convention not stated | small shifts on clean funds (mean absolute difference: SD 0.08, Sharpe 0.04, Sortino 0.08) |
| Sortino | textbook (D85) | mean excess / SD of the negative-excess days (June 2026's form) | a series break: Aug and Sep textbook, June and October onward the Screener's form (Q2); a note under the table if Q2(a) |
| Alpha | Jensen | excess return; Jensen derivable on a TRI benchmark | with Q7(a) "Alpha (Jensen)" stays true; 7 funds on a price index get a dash |
| Benchmark | 4 labels: NIFTY 500 TRI on 915 keys, Midcap 150 on 72, Smallcap 250 on 69, NIFTY 100 on 32 | each fund's own (103 names on matched keys) | 554 of 1,029 labels change (row tooltip "Benchmark: ..."); five relative columns change meaning for 264 of 593 funds |
| Coverage | 966 funds with the nine numbers (250 or more NAV days) | Beta 593; SD, Sharpe, Sortino 636; 3Y Rolling 451 (from 433) | 373 funds lose Beta and show dashes; the Portfolio Average rests on fewer funds; the hint "funds with < 250 trading days" becomes wrong (T4) |
| Flags | 33 `fl` (28 split, 5 lowcorr) | none (split-adjusted; no absolute beta below 0.30) | the daggers disappear from the tab, the deck and the Select popover |
| Corr, Info Ratio, Down Cap, 3Y Rolling | in-house formulas | Corr derived as sign(beta) x sqrt(R-squared / 100); the pack's other formulas and its rolling field | small shifts (mean absolute difference: Corr 0.002, Info Ratio 0.09, Down Cap 0.30, 3Y Rolling 0.15 without 27 split-ETF and IDCW outliers) |
| Keys | 1,088, by Monitor name | by name for 1,076; 12 unmatched; 6 JioBlackRock Regular keys on Direct-plan rows | 10 spelling pairs and 6 plan mismatches go to the owner (Q9) |

In plain words for the owner: from October the risk table is as on the 15th of the pack month; about 370 of today's 966 funds show a dash
(mostly funds younger than three years); each fund is compared with its own benchmark; the daggers on 33 funds go because the Screener
handles NAV splits itself; Sortino follows the Screener's formula, not the textbook form of D85; the risk-free rate stays 4.5% (D84). Tracked
as KNOWN_ISSUES C46.

## 6. The three options

**Option 1 (RECOMMENDED): thin bridge.** A new tool `tools/datapack_risk_workbook.js` reads an extracted pack folder (`manifest.json`,
`funds.json`, `definitions.json`, `benchmarks.json`), verifies it, maps and rounds the fields and writes a workbook in the #12 layout under
`monthly-updates/<month>/`; `tools/merge_risk_matrix.js --as-on "15 Oct 2026"` then joins, gates and splices exactly as today and stays the
only writer of `RISK_MATRIX`, with one additive, owner-only override of the coverage gate (not in this tool yet) and a printed lost list. The
name `--allow-coverage-drop` is already used by `tools/merge_direct_equity_returns.js` with a different meaning; the TASK-022 contract fixes
the name of the new flag.
- Pros: smallest blast radius; the proven byte-identical merge path stays; one place for join, gates and splice; no new dependency (Node
  `fs`, `crypto`, the pinned `xlsx` 0.18.5); the owner can open the workbook; a future Excel from the dashboard in this layout needs no new
  code; the adapter is deletable.
- Cons: two commands a month and an intermediate file; a small edit of the production merge tool is unavoidable (every pack-based table loses
  coverage, so gate 5 would stop it); the adapter derives two values (Jensen alpha, Corr).
- Effort (INFERRED): adapter and tests about 3 working days, merge flag and test 0.5, minimum docs 1, regression run 0.5, reviews 1 (about 6).

**Option 2: native reader.** A new `tools/merge_datapack_risk.js` reads the pack, joins (it could use the AMFI code), gates and splices itself;
join and gates move from `merge_risk_matrix.js` into a new `tools/lib/riskjoin.js`. Pros: no intermediate file; code-based identity;
pack-specific gates built in. Cons: edits the proven tool and `tools/lib/` (high-risk trigger 4) just before the cycle; duplicates or
refactors the gates; overlaps TASK-066 and TASK-053; the xlsx route becomes dead code; the byte-identical proof must be re-earned. Effort
(INFERRED): 7-9 working days; it would miss a 13-Nov merge.

**Option 3: hold at "30 Sep 2026" and ask the dashboard team for a ready-made Excel** in the #12 layout (textbook Sortino, Jensen alpha,
optionally the 4-index mapping, ideally month-end). Pros: honours D85 and keeps the series continuous if they comply; zero code risk. Cons:
the matrix ages every month (decks say "Risk data as on 30 Sep 2026"); depends on another team's schedule; asks them to maintain calculations
that differ from their own; contradicts D86 (MOD-02's reading of the owner's answer, INFERRED, to be confirmed with the owner at Gate E (Q1)).
Only the in-house port (the option of B8 the owner did not choose) reproduces September exactly.

**Recommendation: Option 1.** Option 3 is the fallback if TASK-022 is not merged when the October cycle reaches step 10. D43 stays in
force and the merge route stays; only the producer of its input workbook changes (D86). D84 stays (the tool refuses a pack whose
stated Rf is not 4.5%). D85 cannot be honoured from pack data (the textbook form needs the daily series, or the count and mean of the
negative days): the owner decides what happens (Q2). The six-file deploy is untouched: only `window.RISK_MATRIX` and the `riskMatrix` date
line change, at the October run, by the existing merge tool. Risk class HIGH (FILE_OWNERSHIP section 7 triggers 7 financial calculations,
8 scale, 9 identity matching, 10 override flag; trigger 4 only if `blocklib` is touched).

## 7. Task split and the contract for the launch packet

TASK-022 is re-scoped to "Feed the Portfolio Matrix from the MF Screener data pack (bridge tool, merge override, tests, docs,
regression run)". Its old acceptance, "reproduce the Sep workbook with 0 differences", cannot be met (different window end, NAV source and
definitions); it survives only for the unchanged merge step (L1). TASK-070 is no longer a dependency. The new-build sub-chat (next free id
NB-04, proposed) does T1-T4 and T6. File names below are proposals, not existing tools.

| Id | Work | Role | Needs |
|---|---|---|---|
| T0 | Records: D86, DEC-OPEN-30 to -33, C46, TASK-078, the TASK-022 re-scope; notes on TASK-057 (retire `build_risk_matrix.py` after one verified month), TASK-053 (drop `c` and `RISK_MATRIX_BENCH_SD`; nothing reads them), TASK-066 (sequence after TASK-022: same file), TASK-070; the pack contract and the #12 layout in INTERFACE_CONTRACTS: to follow (with the TASK-022 PR, in the same PR as the change that alters the interface) | MOD-02, docs only | with this record |
| T1 | `tools/datapack_risk_workbook.js` (new); optional additive `writeBufferAtomic` in `tools/lib/blocklib.js` so the `.xlsx` write gets the OneDrive rename retry (trigger 4, single writer) | NB-04, own worktree | TASK-018 merged (ARC-01); T0; DEC-OPEN-30 and DEC-OPEN-31 answered; the contract and the Guardian pre-check |
| T2 | the owner-only override of the coverage gate in `tools/merge_risk_matrix.js` (single writer) | NB-04 | T1 contract |
| T3 | `tools/test/datapack_risk.test.js` (new); two cases in `tools/test/tool_inputs.test.js`; `.gitignore` patterns `pr-datapack*/` and `datapack/` with a test that keeps them | NB-04 | T1 |
| T4 | Conditional wording PR: one hint string in `site/index.html` (grep "funds with < 250 trading days"); a deck text change goes through the design system (D82) | NB-04, own small PR before the cycle, never during it (single writer of `site/index.html`) | the owner approves the wording (Q10) |
| T5 | Docs. In the T1-T3 PR: `docs/MONTHLY_UPDATE_PROCESS.md` (step 10 becomes 10a adapter and 10b merge, with the stop conditions), `docs/INPUT_FILES.md` (rows 12 and 17, a new input "MF dashboard data pack"), `tools/README.md`, the inbox README (rows 12 and 17, a pack row), `CHANGELOG.md`, `docs/PROJECT_STATE.md`. Follow-up docs PR after the cycle: KNOWN_ISSUES (B8, C10, C11, C35, C42, A22, E8, C46), OPERATING_MANUAL (risk section; the Sortino and Alpha definitions of record), PRD, ARCHITECTURE, TESTING, HANDOVER section 5, the Python runbook, the CLAUDE.md headline | docs-keeper, after TASK-018 merges (it claims several of these files) | T1-T3 |
| T6 | Regression and rehearsal record: L1 to L6 on the real packs (local only); `docs/update-log/2026-11_risk-pack-regression.md` with counts and the pass table only | NB-04 with financial-data-reviewer and qa-verifier | T1-T3 |
| T7 | October use (TASK-021 step 10): adapter dry run, then `--apply`; merge dry run, then `--apply` with the override after the owner has read the lost list and approved the pins and the sample slide. D61's stop rule applies to this first run (override flag and pins need the owner's approval; FILE_OWNERSHIP section 7) | OPS chat | the FINAL pack; the owner's approval; DEC-OPEN-32 written yes (and DEC-OPEN-33 if the pack is PROVISIONAL) |
| T8 | After one verified month: retire `tools/build_risk_matrix.py` and its runbook (TASK-057), drop `RISK_MATRIX_BENCH_SD` (TASK-053), close B8 and C35, optionally add AMFI-code pins for all keys | MOD-02 | T7 verified |

**T1 specification (abridged).**
- CLI: `node tools/datapack_risk_workbook.js "<extracted pack folder>" [--html site/index.html] [--out "<xlsx>"] [--allow-provisional]
  [--apply]`; strict CLI, exit 0 ok / 1 gate / 2 usage (D72), dry-run default. It refuses a `.zip` (the operator extracts with PowerShell
  `Expand-Archive` into a NEW empty folder) and any folder inside `site/`, `tools/`, `docs/`, `.github/`, `.claude/`.
- Gates: contract `pr-datapack-v1` and exporter major 1; SHA-256 and bytes of every file read equal the manifest; the validation status
  is not provisional and 0 blocking failures (else refuse, unless `--allow-provisional` and every failing check names only files the tool does not read;
  the failure text is printed); cycle date = `funds.json` returns as-on = end of the `benchmarks.json` 3-year window; the as-on label ("15 Oct
  2026") derived from the cycle date and printed in the exact merge command; Rf tripwire (`definitions.json` must state 4.5% and sqrt(252));
  required field paths present (the missing one is named); scale tripwire (median pack/live ratio for be, sd, co, dc, rr within 0.97 to 1.03);
  every number finite; `bm` whitelist `/^[A-Za-z0-9 &().,+\/:-]{1,60}$/` (`blocklib` writes `JSON.stringify` output into inline script with
  no `</script>` escaping).
- Universe = the existing `RISK_MATRIX` keys of `--html` (read with `blocklib.locate`), so "fund count did not shrink" holds; run after
  `tools/rename_schemes.js` and `tools/fold_duplicate_names.js` (they re-key the block; with TASK-024, the pending renames). Identity order:
  owner pin (`tools/data/risk_pack_pins.json`) -> exact `fund_name` -> MASTER `prev_name`. Guards: plan
  guard (a Reg key on a Direct pack row, or the reverse, becomes unmatched and listed); a duplicate pack name or two keys on one pack row ->
  exit 1; unmatched keys listed with proposed partners (same inception date plus shared name tokens), never applied. Expected on the 15-Oct
  pack: exact 1,043; `prev_name` 27 after the guard; plan mismatch 6; unmatched 12 (10 with proposals).
- Mapping (no scaling, no auto-detect): one fixed mapping from the pack's risk fields to the workbook columns (Beta, SD, Sharpe, Sortino,
  Info Ratio, Down Capture, Correlation, Alpha, Rolling Return); the Sortino column is read through one named constant (per Q2).
  Correlation is derived from the pack's fit statistic with the sign of beta; Alpha is Jensen alpha from the pack's own return and
  benchmark fields at Rf 4.5%, only when the benchmark basis is TRI; Rolling Return uses the pack's 5-year rolling field (INFERRED choice:
  ask h). The field-level mapping is in the local-only note and goes into the TASK-022 contract once DEC-OPEN-32 is answered. Round to 2
  decimals (Down Capture 1) by one tested rule; missing = the text "-".
  Data Flags: Benchmark Used = the pack's benchmark name verbatim (blank when the pack has none, so the merge carries the old label); flag text only
  for an absolute beta below 0.30, in the wording the merge regex reads; no split flag. Workbook layout as in section 3 (A2 a truthful
  methodology line, nothing below the table).
- Report (the gate the operator reads): provenance (cycle, generation time, provisional, `funds.json` SHA-256 prefix), identity tiers,
  per-column counts old -> new, lost and gained key lists in `monthly-updates/<month>/_review/`, the top 15 movers per column, the exact
  next merge command. `--apply` writes only the workbook; nothing is read or written outside `monthly-updates/` and the scratch path.
- T2: when "funds with metrics did not shrink" fails, print "OVERRIDDEN by `<flag name>` - N keys lose metrics" and the lost keys
  (first 40 and the total); the other seven gates cannot be waived; update USAGE. The October runs pass the override with N = the
  lost count the dry run printed (the exact form is for the contract). The name `--allow-coverage-drop` is already used by
  `tools/merge_direct_equity_returns.js` with a different meaning; the TASK-022 contract fixes the name of the new flag. Without the flag the
  output and the page are identical to today (September workbook, scratch copy, `cmp` = 0 differences, same stdout). Optional: refuse when
  `--as-on` disagrees with the workbook's A1 date.

**The 12 contract fields** (FILE_OWNERSHIP_AND_CHANGE_CONTROL section 6), for the launch packet:

| # | Field | TASK-022 (re-scoped; risk class HIGH) |
|---|---|---|
| 1 | Task and requirement IDs | TASK-022; KNOWN_ISSUES B8, C10, C11, C35, C42, A22, C46; D43, D84, D85, D86; DEC-OPEN-01, -30 to -33 |
| 2 | Objective and acceptance | Feed the Portfolio Matrix from the pack: bridge tool, merge override, tests, minimum docs, regression run. Done when L0 to L6 pass (section 8) |
| 3 | Preserve | merge default behaviour byte-identical on the September workbook; every other page block byte-identical; the key set = the 1,088 keys; the six-file deploy |
| 4 | Intended changes | the October table comes from the pack (findings 4 to 6; flags F1 to F10) |
| 5 | Files | T1 to T5; new `tools/data/risk_pack_pins.json` (owner-approved key -> scheme-code pairs, public identifiers only, D75); page: only the `RISK_MATRIX` block and the `riskMatrix` date line at the October run, by the existing merge tool; conditional T4 hint string |
| 6 | Consumers | `RISK_MATRIX` readers (the Portfolio Matrix tab, the deck matrix slide, the Select dagger), `DATA_DATES.riskMatrix`, `blocklib`, `tools/verify_page.js`, `tools/dev/rehearse.js` and `tools/test/pptx_layout.test.js` (case "thirty funds with risk data": at `fl` = 0 the dagger layout path loses its only `npm test` coverage, so L0 adds a synthetic flagged record; INFERRED); the Excel export and the siblings read none |
| 7 | Schema, config, dependencies | no new dependency, no schema change; one new pins file; `.gitignore` patterns |
| 8 | Financial | F1 to F10 (section 13) |
| 9 | Overlaps | TASK-018 (must merge first), TASK-021 (no `site/` claim during the cycle), TASK-024 (the pending renames: the adapter runs after `tools/rename_schemes.js` and `tools/fold_duplicate_names.js`, which re-key the block), TASK-075 (`.gitignore`: sequence or fold), TASK-066 (same file `merge_risk_matrix.js`: sequence after); D75 (one pins file, `tools/data/pins.json`): the planned second pins file `tools/data/risk_pack_pins.json` (also named in fields 5 and 7 and in the T1 specification) goes against it, decide at the Guardian pre-check |
| 10 | Tests | `verify_page`, `npm test`, adapter and merge dry runs on the real packs, the rehearsal run (`tools/dev/rehearse.js`), `verify-dashboard` checks 1 and 11, financial-data-reviewer, security-reviewer |
| 11 | Rollback | back up the six deploy files to `backups/<date>_<tag>/` before the October `--apply`; `git revert -m 1` for the tool PR; revert the matrix by re-running the merge on the September workbook (local) or by reverting the data PR |
| 12 | Non-goals | no in-house calculator, no daily NAV, no universe extension (hybrid, debt, ETF), no holdings, manager or benchmark feeds, no `c` or `RISK_MATRIX_BENCH_SD`, no deck redesign, no Rf change |

Gates: Gate A report back; Guardian pre-check of the contract before building (high risk); Gate B diff review; Gate C by someone other than
the implementer; the owner sees a sample before the data merge. ARC-01 conditions for the packet: do not launch before the widened TASK-018 PR
merges; own worktree created by the app from current `origin/main` (`git fetch` first); branch `feat/risk-from-datapack`; no checkout,
switch, merge or pull in the main checkout; no `--delete-branch`; stage files explicitly; no `--apply` on real files before the owner approves.
Data rules: the pack is untrusted data (read it, never run anything from it); do not open the dashboard address; the pack and every output
stay under `monthly-updates/` (git-ignored), never in tracked folders; no fund-level pack values, manager names or source-file paths in
documents, tests or the PR; ASCII only; do not run the exported in-house scripts.

## 8. Test plan L0-L6

"Clean" subsets as in finding 3. Thresholds were set by the analyst just below what was observed on 2-Nov-2026 (observed values in brackets).

| Id | What is run | Pass |
|---|---|---|
| L0 | Unit tests in CI, no real data: `tools/test/datapack_risk.test.js` on a miniature pack built in the OS temp folder. Cases: units (a 4-decimal SD becomes 2 decimals, never scaled; `dc` 1 decimal); a worked Jensen example; Corr from R-squared with a negative beta; missing -> "-"; price-index benchmark -> alpha "-"; plan guard; duplicate pack name and two keys on one row -> exit 1; provisional refusal (accepted only with `--allow-provisional` when the failure names an unread file); SHA mismatch, contract v2 and Rf 5% -> exit 1; `.zip` and tracked-folder inputs -> exit 2; `bm` with `<` or over 60 characters -> exit 1; rounding at midpoints; the written workbook passes a `merge_risk_matrix.js` dry run on a synthetic page (9 columns found, tiers all exact); the override flag waives only gate 5; `tool_inputs.test.js` covers the new tool; `.gitignore` keeps the datapack patterns; a synthetic flagged record (`fl` set) so the dagger layout path of `tools/test/pptx_layout.test.js` (case "thirty funds with risk data") keeps its `npm test` coverage when the live table has `fl` = 0 (INFERRED) | `npm test` green: one more test file and more checks than the 28-Oct baseline (5 files, 903 checks); 0 failures |
| L1 | Production-merge non-regression (local, real files): the September workbook through `merge_risk_matrix.js --apply` on a scratch COPY of `site/index.html`; repeated after T2 | `cmp` finds 0 differences with `site/index.html`; 8 of 8 gates PASS; counts 1,088 -> 1,088, with metrics 966 -> 966, rolling 433 -> 433, flags 28 / 5, tiers 1,027 / 32 / 29 (VERIFIED on `c0fb2dd`) |
| L2 | Identity and structure on the real packs, dry run: the 15-Oct PROVISIONAL pack (with `--allow-provisional`) and the 15-Sep backfill cycle | exact 1,043; `prev_name` 27 after the plan guard; plan mismatch 6 reported; unmatched 12 listed with proposals; ambiguous 0; collisions 0; no pack row claimed twice; after the owner's pins unmatched falls to 2 or 3; the workbook passes the merge dry run with all 9 columns found and 1,088 data rows |
| L3 | Agreement with the live 30-Sep table (the September regression; table below); the 15-Sep backfill cycle is the closest bracket | thresholds below; a miss means a unit, mapping or window bug: STOP and report |
| L4 | Expected changes on the 15-Oct pack; any other number must be explained | Beta 966 -> 593 (up to +9 after the pins); SD, Sharpe, Sortino 966 -> 636; rolling 433 -> about 451; Jensen alpha on about 580-590; flags 33 -> 0; labels changed for about 554 funds; lost list about 373 keys with reasons (311 insufficient history, 39 stale benchmark, 9 no benchmark, 4 (reason to be confirmed: PROXY benchmark or no source), 10 unmatched) |
| L5 | Merge dry run on the adapter's workbook | without the flag gate 5 FAILS (proves it is live); with the override flag (N = the printed lost count; the name and the exact form are to be fixed in the contract) it PASSES; the page diff is limited to the `RISK_MATRIX` block and the `riskMatrix` date line, checked block by block with a Node script using `blocklib.locate` (every other block byte-identical) |
| L6 | Page checks: `node tools/verify_page.js site`; `npm test`; browser (`verify-dashboard` checks 1 and 11 and the Portfolio Matrix tab) with a 10-fund proposal (an established large cap; a thematic fund whose benchmark changed; a formerly split-flagged ETF; a young fund; an index fund; a JioBlackRock Regular fund; an ELSS; one of the approved pairs; a hybrid or debt fund; a Direct-only index fund); exports | for the tools-only PR `verify_page` is identical to baseline (MASTER effective 7,682; Select 178 with 178 in MASTER; PMS 692 / AIF 12 / benchmarks 4; EQUITY_ANALYTICS 1,205; `RISK_MATRIX` 1,088; 0 duplicates; 0 script errors; ends `</html>`); after October step 10 `RISK_MATRIX` stays 1,088 and `DATA_DATES.riskMatrix` prints "15 Oct 2026" = the pack cycle date; the tab shows 2-decimal values, dashes, the Portfolio Average row, the hint "as on 15 Oct 2026" and no console error; the matrix slide shows "Risk data as on 15 Oct 2026", no dagger, nine columns and the note; the Excel export still builds; no deck code changes, so no PowerPoint render unless T4 or a deck note changes (then `npm test` pptx_layout, the render and the bounds check, D82) |

L3 thresholds:

| Metric (clean funds) | 15-Sep backfill cycle: pass [observed] | 15-Oct pack: pass [observed] |
|---|---|---|
| Beta (same benchmark) | 99% or more within 0.05 [100%; n=310] | same [100%; n=312] |
| Corr | 99% within 0.02 [100%] | same [100%] |
| SD | 98% within 0.25 [100%; n=577] | 95% [98%; n=581] |
| Sharpe | 85% within 0.05 [90.3%] | 70% [77%] |
| Down Cap | 95% within 1.0 [97.7%] | 95% [97%] |
| Info Ratio | 60% within 0.10 and 90% within 0.20 [67.4% and 93.2%] | 60% [66%] |
| Jensen alpha from the pack | 70% within 0.5 [79.0%] | 65% [69%] |
| 3Y Rolling | 75% within 0.25 [80.4%; n=382; a few split-ETF and IDCW outliers up to 60 points, listed] | 80% [86%; n=385] |
| Scale tripwire | median pack/live within 0.97-1.03 for Beta, SD, Corr, Down Cap, 3Y Rolling [0.999, 1.005, 1.000, 1.000, 0.992] | same |
| Sortino | not an agreement test (the definition differs): report the mean absolute difference and the bias [0.048 and -0.033] and require 0.10 or less | the same requirement [0.083 and -0.057] |

## 9. Owner decisions and the monthly routine

**Q1-Q11.** The "Where" column follows the registers: DEC-OPEN-30 the Sortino form; -31 the other changes (date, coverage, benchmark and
alpha, daggers and wording); -32 written permission; -33 the PROVISIONAL pack; TASK-078 the asks. The analysis proposed answers to Q1, Q2, Q5,
Q6, Q7 by 4-Nov-2026 and the rest by 9-Nov-2026; the dates in force are in the registers and PROJECT_STATE.

| Q | Decision asked | Recommended | Where |
|---|---|---|---|
| Q1 | Use the pack as the source of the Portfolio Matrix from October, accepting the changes against September: the risk date is the pack date (15 Oct), each fund is compared with its own benchmark, only funds with a full three-year record get ratios, the daggers go. Yes / no (hold at 30 Sep) | yes | D86 (the source); the changes: DEC-OPEN-31 |
| Q2 | Sortino (D85). The pack's is June's form; the textbook form cannot be built from the pack. (a) accept the dashboard's Sortino for October with a one-line note under the table and ask for a textbook field; (b) leave the column as dashes until a textbook figure exists; (c) hold the whole October matrix. Effect of (a): the history reads textbook in Aug and Sep, June's form in June and from October; the forms differ by about 0.03 to 0.05 on average, 0.2 to 0.3 at most | (a), confirmed in writing as a decision that supersedes D85 for the matrix | DEC-OPEN-30 |
| Q3 | Rf (D84). No change: the pack's 4.5% equals D84. Confirm that any future Rf change is made in the dashboard and here on the same day, and that D58 stays open for the desk (DESK-15) | confirm | D84 stands; no new item (ask i) |
| Q4 | Coverage. About 370 of today's 966 funds will show dashes (311 too young for a 3-year record, 39 with a stale benchmark (the index data ends before the cycle date; the count changes between packs)). Accept for October and ask for partial-window ratios later, or hold | accept, and use the override once, after the owner has read the lost list | DEC-OPEN-31; the override itself is a run-time approval (T7) |
| Q5 | Licence. May the dashboard's computed ratios be embedded in the public Playbook page and in client decks, and may the pack's contract (file names, field names, definitions) be described in the public repository (this record, the tool's code and tests, the TASK-022 contract)? Yes in writing / no / ask the dashboard team first | a one-line written yes before the first apply | DEC-OPEN-32; ask b |
| Q6 | Provisional. If the final 15-Oct pack is not ready by about 11 Nov, may the PROVISIONAL one be used (only the stock-price rule failing) and re-checked when the final arrives? | yes, with explicit confirmation in chat, recorded in the update log | DEC-OPEN-33 |
| Q7 | Alpha. (a) derive Jensen alpha at Rf 4.5% from the pack's 3-year returns and beta (keeps "Alpha (Jensen)" true); (b) use the dashboard's alpha, a simple excess return, and change the wording | (a), TRI benchmarks only (7 funds on a price index get a dash) | DEC-OPEN-31 |
| Q8 | Date label. Label the table with the pack date ("15 Oct 2026") rather than the month-end of the other data; ask whether a month-end pack exists | yes | DEC-OPEN-31; ask d |
| Q9 | Fund pairs. After reading the tool's list, approve the 10 proposed matches where the dashboard spells a fund differently (same launch date); decide the 6 JioBlackRock Regular keys that the dashboard lists only as Direct plan | leave those 6 as dashes and settle them with DEC-OPEN-07 and C20; any pin needs the owner's approval (D75) | run-time approval (the pin file, T7); DEC-OPEN-07 |
| Q10 | Wording. Approve the changed hint on the Portfolio Matrix tab ("funds without a full three-year record" instead of "funds with < 250 trading days") and, if Q2(a), the Sortino note | approve | DEC-OPEN-31; the wording PR (T4) |
| Q11 | Who asks. Who sends the asks a-i to the dashboard team and by when (the final pack by about 11 Nov) | the owner, in the dashboard team's chat, by 4 Nov | TASK-078 |

**The owner's monthly routine** (a proposal until Q1 is answered):
1. File and place: the FINAL pack zip for the cycle (`pr-datapack_<cycle date>.zip`; final = no PROVISIONAL in the name, no
   validation-failure marker file, validation status not provisional), taken from the MF dashboard (sign-in only; never paste its address or contents
   into chat or documents) and dropped in `monthly-updates/00_INBOX/` (git-ignored), with the pack name and cycle date told to the operator.
   The operator extracts it with PowerShell `Expand-Archive` into a NEW empty `monthly-updates/<month>/datapack/`; only `manifest.json`,
   `funds.json`, `definitions.json` and `benchmarks.json` are read.
2. Timing: final before step 10 of the MF cycle; for October (about 13-17 Nov) the FINAL 15-Oct pack by about 11 Nov. The 15-Oct pack was
   generated 8 days after its cycle date (one observation; the cadence is INFERRED), so each month the matrix carries the previous mid-month
   date.
3. PROVISIONAL packs: dry runs and tests only; a real apply needs the owner's explicit yes in chat (Q6) and a blocking failure that names
   only files the risk path does not read (today: the stock-price rule); a final pack with a different `funds.json` hash means a re-run. The
   backfill zip is not needed monthly (keep it locally as a regression fixture). Never commit or e-mail packs.
4. Approved during the run: the lost list, the spelling pairs (the pin file), the coverage override and one sample slide. Before the October
   merge the owner must see: a one-page "what changed" (counts, definitions); the lost list with reasons; the 10 proposed pairs and 6
   plan-mismatch keys; a before/after table (Sep vs Oct) for the 10 sample funds and one sample Portfolio Matrix slide; the override use
   stated in the PR. Before the first apply DEC-OPEN-32 (the written yes to show the computed ratios publicly) must be answered, and
   DEC-OPEN-33 if the pack is still PROVISIONAL.

## 10. Asks to the MF dashboard team (TASK-078)

a. Make the 15-Oct pack FINAL (or confirm in writing that the stock-price rule does not touch `funds.json`, `definitions.json` and
   `benchmarks.json`) and give the planned dates of each cycle's final pack.
b. Written permission: may the Screener's computed ratios appear in client decks and in the public Playbook page (public GitHub Pages), and may
   the pack's contract (file names, field names, definitions) be described in this public repository (this record, the tool's code and its tests, the TASK-022 contract)? (Q5)
c. Additive fields in a v1.x (no contract break): textbook Sortino (root-mean-square of the negative excess over all days, per-day Rf/252) so
   D85 can be honoured; Jensen alpha and correlation; the risk window start and end date and the daily observation count on each risk block;
   ratios for funds with 250 or more days but under 3 years, marked as a partial window.
d. Cadence: is there a month-end cycle (the October pack is dated 15-Oct), so the risk window can end on the month-end like the rest of the
   Playbook data?
e. Keep the Monitor spelling and the scheme code stable; fill the alternative-names field consistently (it is filled for few funds, unevenly across cycles); send
   a rename note when names change.
f. A slim risk-only export (name, scheme code, plan, benchmark, 3-year risk block, 3-year returns, rolling) of a few MB, to ease the
   hand-over and reduce confidentiality exposure.
g. Notice before any contract change; keep `pr-datapack-v1` stable (our tool pins the version and refuses a new one).
h. Confirm which rolling field is "the last 5 years of 3-year windows" (we use the pack's 5-year rolling field).
i. If the desk changes Rf (DESK-15) the Screener's risk-free constant changes too: tell us the same day (our tool refuses a pack whose stated
   Rf is not 4.5%).

## 11. Risks R1-R15

| Id | Risk | Mitigation |
|---|---|---|
| R1 | PROVISIONAL packs: the October pack has one blocking failure (stock prices only) | the tool refuses by default; `--allow-provisional` only when the failing files are not read, printed, owner-confirmed and recorded; re-run if the final `funds.json` hash differs; record cycle, generation time and hash prefixes in the update log |
| R2 | Contract or definition drift (v2, renamed fields, Rf or window change, rules swinging coverage by more than 10% between cycles) | pin contract version and exporter major; list required paths and name the missing one; Rf and sqrt(252) tripwire; scale tripwire; print coverage deltas monthly; a swing over 10% is "read, ask" |
| R3 | Identity: name-only on the page side; 12 unmatched; 8 renames pending (TASK-024) change keys; the alternative-names field unreliable; one duplicate pack name | run after `rename_schemes.js`; exact -> `prev_name` -> owner pins; never fuzzy-apply; duplicates and double claims exit 1; proposals printed; optional AMFI-code pins later |
| R4 | Direct vs Regular: 29 Direct rows; 6 JioBlackRock Regular keys match only Direct rows (4 carry live ratios today) | plan guard from the pack's plan field against the key's Reg/Direct suffix; mismatches become dashes and are listed; settle with DEC-OPEN-07 |
| R5 | Visible coverage loss: about 370 funds lose ratios; the hint says "< 250 trading days"; the Portfolio Average rests on fewer funds | Q4, Q10; the lost list; a one-time override with owner approval; ask for marked partial-window ratios |
| R6 | Scale mistakes (percent vs decimal) | fixed mapping, no auto-detect, unit tests, tripwire 0.97 to 1.03; round 2 decimals (`dc` 1) because the merge does not round |
| R7 | Stale or wrong dates: no as-on field in the risk blocks; the matrix lags month-end data by about two weeks; the page's hard-coded fallback "30 Jun 2026" exists in three places and must not be reached | label from the cycle date, cross-checked with the `funds.json` returns as-on and the `benchmarks.json` window; the tool prints the exact merge command; `verify_page` prints `DATA_DATES.riskMatrix` |
| R8 | Licensing and confidentiality: the Screener is sign-in only; the Playbook is public (D60) and `RISK_MATRIX` would carry its computed ratios | Q5 written yes before the first apply; the update log and PR record only counts, hashes and dates; never copy the pack's input-file lists, manager names or fund-level values into public documents (compare KNOWN_ISSUES R12, DEC-OPEN-29) |
| R9 | Repository hygiene: `.gitignore` covers `*.zip`, `*.csv`, `*.xlsx` and `monthly-updates/*` but not `*.json`; some pack files are tens of MB and the largest is close to GitHub's 100 MiB block (GitHub warns above 50 MB and blocks above 100 MiB, so size limits do not reliably stop an accident) | extract only under `monthly-updates/<month>/datapack/`; add `pr-datapack*/` and `datapack/` to `.gitignore` (overlaps TASK-075: sequence or fold); the tool refuses tracked-folder inputs; stage files explicitly; security-reviewer before the push; tests contain no real data |
| R10 | Untrusted input into a public page: `blocklib` writes `JSON.stringify` output into inline script without escaping `</script>` | `bm` whitelist and length cap; finite numbers only; fixed key set; no pack string reaches the page except `bm` |
| R11 | Series breaks: Aug and Sep textbook Sortino, October the Screener's form; Jensen alpha and five relative columns against a different benchmark | a note in the update log and, if the owner agrees, on the tab; KNOWN_ISSUES C46; B8 and C35 stay open until one verified month |
| R12 | Process: the first apply uses an override flag and a pin file, so D61's stop rule applies (override flag and pins need the owner's approval; FILE_OWNERSHIP section 7); TASK-018 gates the build; same-file overlap with TASK-066; `.gitignore` overlap with TASK-075; no `site/` claim during the TASK-021 cycle | owner approval before the merge; sequencing in the contract; a `tool_inputs.test.js` case for the new tool (CI fails without it) |
| R13 | Pack content changes within a month (a re-issue under the same cycle date) | record the hash; a different hash is a new run |
| R14 | Schedule: about 5-6 working days of work (INFERRED) against about 4 available after TASK-018: no slack, so the fallback is the LIKELY case if TASK-018 slips or the answers come late | the fallback in section 12, which also says which date each deadline protects |
| R15 | Provenance of the numbers is partly unverifiable: the Screener's metrics code is not in the pack | the L3 agreement tests and the Sortino form test (section 8); reviewer hand-checks (section 13) |

## 12. Timeline

2026 dates, today Monday 2-Nov; INFERRED durations are estimates; as proposed by the analysis (the dates in force are in the registers). On
2-Nov-2026 the owner started GOV-01 (TASK-018, own worktree) and EX-01 (TASK-064, read-only, shared checkout); no claim for GOV-01 is in
force yet (its contract and the Guardian pre-check come first).
- Mon 2 - Fri 6 Nov: the owner answers Q1, Q2, Q5, Q6, Q7 by 4 Nov (the rest by 9 Nov), sends asks a-i and requests the FINAL pack by about
  11 Nov; MOD-02 lands T0, writes the 12-field contract and runs the Guardian pre-check on it (no code); the widened TASK-018 must merge (2-3
  working days, INFERRED): it gates every OPS and NB launch (ARC-01), and each day it slips takes a day from the build.
- Fri 6 or Mon 9 Nov: launch the new-build sub-chat in its own worktree; T1-T3 and the minimum docs; local runs on the real packs (T6).
- Wed 11 - Thu 12 Nov: PR open, contract-level Guardian review done, the FINAL pack due, the lost list, pairs and sample slide ready for the
  owner; Gate B diff review, financial-data-reviewer, security-reviewer, CI verify, rehearse; the T4 wording PR (if approved) merges. Fri 13
  Nov: merge TASK-022 (`site/` unchanged, nothing published).
- Fri 13 - Tue 17 Nov: the October MF cycle (TASK-021); renames (TASK-024, DEC-OPEN-08) at step 1; step 10 about day 2-3 (about 14-16 Nov):
  adapter, then merge with an owner-only override of the coverage gate (the flag name is to be fixed in the contract; `--allow-coverage-drop`
  already exists for the Direct Equity tool with another meaning) after the owner's approval; verify; publish; the table is stamped "15 Oct
  2026". Then the follow-up docs PR; TASK-057, TASK-053, TASK-066; B8 and C35 close after one verified month.

Critical path: owner answers by 4 Nov -> TASK-018 merged by 6 Nov -> build 4 working days -> merge 13 Nov. Zero slack, so do not trade
verification for speed. Deadlines in force on 3-Nov-2026 (the registers are authoritative) and what each protects: DEC-OPEN-30 (about
6-Nov-2026) and DEC-OPEN-31 (about 9-Nov-2026) protect different things. Both answered by about 6-Nov keep a merge by 13-Nov possible
(before step 10 of the October cycle, which runs about 13-17 Nov); DEC-OPEN-31 answered by 9-Nov at the latest means a merge about 16-Nov,
that is step 10 itself. The build estimate (about 6 working days, INFERRED; the analysis counted 5-6 needed against about 4 available)
leaves no slack, so the fallback is the LIKELY case if TASK-018 slips or the answers come late. **Fallback** (TASK-022 not merged, or the
pack not final, when step 10 is reached): run the cycle without step 10 (an absent input is not a stop under D61); the page keeps "30 Sep
2026" (honest, stale); run step 10 later as a separate small data PR within about a week, still on the 15-Oct pack, or move to the 15-Nov
pack (generated about 23 Nov, INFERRED from "8 days after the cycle date") for the November cycle.

## 13. Flags for the financial-data-reviewer (F1-F10)

- F1 The source of every ratio changes: in-house daily NAV -> the Screener's metrics code (not in the pack). F2 Window end 30-Sep -> 15-Oct;
  the start convention is unspecified. F3 Sortino form (D85). F4 Alpha derived as Jensen from pack fields, TRI benchmarks only.
- F5 Benchmark = the fund's own: Beta, Corr, Info Ratio, Down Cap and Alpha change meaning for 264 of the 593 funds. F6 Coverage, and the
  page wording "< 250 trading days". F7 Flags 33 -> 0 (split adjustment trusted upstream).
- F8 Rf 4.5% and Rf/252 (INFERRED). F9 Rolling field choice (INFERRED; ask h). F10 Rounding (2 decimals, `dc` 1; the merge does not
  round).

The reviewer checks 5-10 funds by hand against the pack (Jensen, Corr, rounding), counts distinct funds, not rows, and confirms the
client-facing wording. October is not comparable with September in Sortino, Alpha, the five relative columns and coverage.

## 14. Opportunities beyond risk

Opportunities only, not decisions; each needs its own owner decision, contract and tests. Files only; holdings, stocks, managers
and stock-price files were NOT extracted, so they are NOT CHECKED beyond the manifest.
1. Fund managers: `managers.json` could feed MASTER `fund_mgr` (C15, TASK-020) through
   `tools/merge_fund_managers.js`; names are personal data and must not enter documents.
2. Holdings-based analytics: `holdings_2026-09-30.json` and the portfolio blocks of `funds.json` could replace
   the Analytics workbooks; the largest integration.
3. Benchmarks: `benchmarks.json` could be the source of the PMS and AIF benchmark rows (C41, DEC-OPEN-27,
   TASK-065).
4. Categories: `categories.json` and the per-fund category averages could replace the undated Select-popover ratios (C23, C36, TASK-030).
5. Expense, AUM, turnover, exit load in `funds.json`: a cross-check of the desk's Expense Ratio and Exit Load files
   (`tools/merge_expense_exitload.js`); the AUM as-on date is null for every fund.
6. Independent returns check: `nav_month_end.json` as a validation gate for the Monitor-based MASTER returns at
   month-end.
7. Monthly change log: `changes.json` as a pre-bake checklist of new funds and exclusions.
8. Centricity Select cross-check: the pack's score and rank against the Reckoner's Select list (178 funds); the Reckoner
   stays the source.
9. Wider risk universe: SD, Sharpe and Sortino exist for about 140 hybrid funds (Beta for 26) and 40 equity ETFs named in MASTER without a
   `RISK_MATRIX` key; the page deliberately shows debt, hybrid and commodity as dashes: a product decision, not a data refresh.
10. `c` and `RISK_MATRIX_BENCH_SD` (C10, TASK-053): nothing reads them; recommend dropping, not restoring.

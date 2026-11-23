# Update log - TASK-086: look-through code fixes C72 + C74 (23-Nov-2026)

**Run:** 23-Nov-2026, branch `fix/lookthrough-fof-nonstock` from `origin/main` `5759d7d` (bundle 1 merged as PR #68,
`eb3a562`). Operator: Claude Code, chat EX-02 (workstream EX), Moderator MOD-03. Not a data refresh: page code only.
**Decisions:** D110 (the approach, 22-Nov-2026) and D111 (the owner's answers, 23-Nov-2026: "Approve all", then
"money-market only"). **Risk:** High (look-through calculation, identity pins). Contract v2.1 and the claim:
`docs/project-control/ACTIVE_CHANGE_REGISTER.md`. Guardian pre-check: GO WITH CONDITIONS (no blocker).
**Result:** see "Checks" below; the PR, Gate B, the owner's yes and the merge are recorded on the PR and by MOD-03.

## What changed (`site/index.html`, code only; data blocks byte-identical)

| Item | Where (grep) | Change |
|---|---|---|
| C74 | `const _OTHER_NONSTOCK_RE`, `function isNonStockName` (~L1828-1838) | One predicate for "this holdings row is not a stock": the Overlap Matrix's three patterns (`_CASH_RE`, `_NONSTOCK_RE`, `_DERIV_RE`) plus `_OTHER_NONSTOCK_RE` = `/^others?$\|^other\s*derivat\|^\d[\d.]*\s*%\s*[a-z][a-z ]*\bsdl\b\|\bmoney\s*market\s*fund\b/i` (D111). Exported on the core `window.H`. |
| C74 | `return raw.filter(x => !isNonStockName` (getStocks, ~L1866) | The Overlap Matrix calls the predicate. |
| C74 | the three `if (!H.isNonStockName(st.name))` loops in `H.aggEquityScoped` (~L2361, L2366, L2375) | The equity look-through's stock list (screen top-20, Excel "Equity Analytics", deck "Portfolio Analytics - Equity") drops non-stock rows. m-cap, sector and exposure shares are unchanged; every remaining stock keeps its percentage. Listed Direct Equity is not filtered. |
| C72 | `H.FOF_UNDERLYING`, `H.fofUnderlyingName = function` (~L2049-2095) | Owner pins first (5: BHARAT Bond FOF April 2030 / 2031 and BHARAT Bond ETF FOF April 2032 / 2033 -> "BHARAT Bond ETF - April <year>"; ICICI Pru Bharat 22 FOF -> "Bharat 22 ETF"). Otherwise a strict rule: a non-FoF ETF or index fund of the same asset class (no fallback to other classes), the same AMC word, every candidate token in the FoF's name, at least 2 tokens (letters split from digits, "Nifty200" = "Nifty 200"); the candidate with the most tokens wins; a tie returns null. Null means "Not included" in the look-through. |

`window.H`: 69 -> 71 keys (core 22 -> 23). The diff is +60 / -35 lines in 9 hunks between ~L1827 and ~L2375 (first
commit `089510d`); the Gate B fix adds +3 / -2 lines at ~L2037-2046 (section "Fix after Gate B").

## Rehearsal and apply
- **Prototype:** the same replacements applied to a scratch copy of `site/` (exact-once string replacements, then an atomic
  write through `tools/lib/blocklib.js`). On the first base (`0e26c71`, before bundle 1) and again on this base.
- **This base:** `site/index.html` sha256 b28be4bd3ea4f76491af67f5d4224c5a139b98955b13e11e4748054f991979dc (bundle 1).
  Rebuilt prototype sha256 **119980bf9018db3b9e84aa5c21b42cfc01b16729d1e4d401403c7c255b9c4613**, sent to MOD-03 before
  the edit. The applied `site/index.html` equals it.
- **Backup:** the six deploy files in `%USERPROFILE%\...\backups\2026-11-23_pre-ex02-bundle2\` with `SHA256SUMS`.
- **Siblings, `robots.txt`:** unchanged.

## Effects measured (vm, this base)

| Measure | Before | After |
|---|---|---|
| FoFs resolving to an underlying (of 197) | 132 (64 right, 68 wrong) | 67 (62 strict matches, all right, + 5 pins) |
| FoFs inside a look-through scope | 65 (36 of them with another fund's holdings) | 34 (34 leave, 3 enter, 2 corrected) |
| "Mirae Asset Hang Seng TECH ETF FoF-Reg(G)" (Global Funds since bundle 1) | "Mirae Asset Nifty 50 ETF" (all-class fallback) | null (no same-class candidate; outside the look-through either way) |
| Names dropped beyond the Overlap Matrix's old filter | - | 14 names, 71 rows, 65 entries (all EQUITY_ANALYTICS) |
| Overlap Matrix pairs that change (78,503 pairs involving the 58 eligible funds that hold one of the 14 names) | - | 640 (0.8%); mean 0.31 pp; max 5.01 pp; 8 pairs drop one colour band; 0 of 4,997 control pairs |

- **Kept on purpose (D111):** liquid-fund units (7 names, 26 rows) stay in the top-20 and the Overlap Matrix (KNOWN_ISSUES C85).
- **Samples (corpus 100 Cr):**
  - 100% HDFC Large Cap Fund: "Tri-Party Repo (TREPS)" 3.48% leaves the top-20; Axis Bank Ltd. moves up to #7; Mankind
    Pharma Ltd. enters at #20.
  - 50% HDFC Large Cap + 50% ABSL Conservative Hybrid Active FOF: the FoF no longer counts as a Nifty 50 ETF; large cap
    89.88% -> 81.15%; the FoF shows "Not included".
  - Nippon India Diversified Equity Flexicap Passive FoF: was 99.87% IT (a Nifty IT ETF's holdings); now "Not included",
    and a deck of only this FoF has no equity analytics slide.
  - BHARAT Bond ETF FOF - April 2033: SOV 95.76% -> AAA/A1+ 87.16%, SOV 8.21%.
  - ICICI Pru Bharat 22 FOF: newly in the look-through (large cap 91.99%; L&T 16.21%, ITC 14.49%).
- **Band drops:** Axis Large Cap Fund x Axis Midcap Fund 15.81 -> 14.86, the pair used for the threshold check.

## Checks
- `node tools/verify_page.js site`: exit 0, output identical to the base (MASTER 7692; EQUITY_ANALYTICS 1231; 0
  duplicates; 0 script errors).
- `npm test`: 8 of 8 files, 0 failures. The new `tools/test/lookthrough.test.js` passes 280 checks; on the base page it
  fails 38. (After the Gate B fix below: 284 checks; 40 fail on the base.)
- Block-by-block comparison with `tools/lib/blocklib.js`: MASTER, EQUITY_ANALYTICS, HYBRID_ANALYTICS, DEBT_ANALYTICS,
  CENTRICITY_SELECT, MF_BENCHMARK_PERF, PMS_PERFORMANCE, PMS_PERF_ALIAS, RISK_MATRIX and DIRECT_PERF identical. The 12
  data lines (12,830,573 characters) are identical and in order. The file ends with `</body></html>`.
- Browser, Excel and PowerPoint (`qa-verifier`, independent; headless Edge over DevTools on this worktree's page;
  Excel / PowerPoint COM; `render_pptx.ps1` + `check_pptx_bounds.js`): **PASS**, with one finding outside the change.
  - Load: "Universe - 7692 instruments."; 0 console messages, exceptions or failed requests.
  - Screen: 100% HDFC Large Cap (no TREPS; #7 Axis Bank 3.48%; #20 Mankind Pharma 1.82%; m-cap 81.15 / 13.59 / 0 /
    5.26); 50/50 with ABSL Conservative Hybrid Active FOF (the FoF under "Not included" on the Equity tab; top-20 as
    before); BHARAT Bond ETF FOF April 2033 (AAA/A1+ 87.16, SOV 8.21, Cash 4.63; doughnut sums to 100.00); ICICI Pru Bharat
    22 FOF (large cap 91.99; L&T 16.21, ITC 14.49, NTPC 9.57).
  - Excel: 13 sheets; Equity Analytics matches the screen with no non-stock row in Top 20 Stocks; the Overlap Matrix sheet
    shows 14.86 for Axis Large Cap x Axis Midcap.
  - Overlap threshold: the pair is 14.86% on screen; at threshold 15 "0 of 2 funds in matrix", at 14 "2 of 2"; the deck
    PNG shows 14.86% shaded "< 15% low".
  - Decks (four proposals, 21-23 slides): `__PPTX_LAYOUT.warnings` empty; render and bounds check "no problem found";
    the Nippon Flexicap FoF deck has no equity analytics slide.
  - Finding (logged in C79, not changed here): when a tab has no exposure at all, the Equity / Debt tab returns early with
    "No equity / debt exposure in the current selection" before the "Not included" note, so the 50/50 proposal's Debt
    tab does not name the FoF. The early return predates this change; the change makes the case more common.
- `financial-data-reviewer` on the diff: **PASS WITH NOTES** (no change required).
  - The diff is the D111 design and nothing else: the regex character for character; no data block, scale or formula
    touched; legacy `aggEquity` and Direct Equity not filtered.
  - Scale: 5 equity funds (incl. a PMS and an equity SIF), 2 hybrid funds and a mixed 6-fund proposal give m-cap, sectors
    and exposure identical to the base within 1e-9; the stock list equals the base list minus the non-stock rows, with
    each stock's value and order kept.
  - FoFs: 67 resolve (33 commodity, 30 equity, 4 debt), 34 in scope; the 5 pins resolve to records with holdings; 8
    strict resolutions spot-checked right; the multi-fund FoFs that now sit out are honest "Not included" cases.
  - The 160 names `isNonStockName` drops are all cash, money-market, T-bill / GOI / SDL paper, index or option rows,
    "Others" or "Other Derivaties"; none is an ordinary share. Liquid-fund units are kept.
  - The test passes on the branch (280) and fails on the base (38, exit 1).
  - Notes: the Quantum Gold tie (C81, commodity, no client effect); "Repono Ltd." matches the old `_CASH_RE` (C80; no
    fund holds it); CDMDF and debt-scheme units and REIT NCD tranches stay (C85).
- `security-reviewer` before the push, the PR `verify` check, Gate B (MOD-03): recorded on the PR.

## Fix after Gate B: numeric tokens (23-Nov-2026)
- **Finding (MOD-03's Gate B, adversarial review; the owner chose "Fix it first"):** the strict rule's tokeniser `_tok`
  kept only tokens longer than 2 characters, so "50", "30" or "IT" did not count in the coverage check. On this data a
  more specific candidate always won, but after a rename or removal of the winning ETF a near-namesake could win:
  "Alpha Nifty 200 Quality 30 ETF FoF" took a "Quality 50" ETF, "Alpha Nifty India Defence ETF FoF" took a "Nifty 50" ETF.
- **Fix:** `_tok` keeps every non-noise token, however short (`site/index.html` ~L2046, `.filter(t => t.length > 0 &&
  !_NOISE.has(t))`). Its only caller is `_tokStrict` (the strict FoF rule), so nothing else changes.
- **Test:** the test's private copy of the rule uses the same tokeniser, plus 4 synthetic cases: "Quality 30" vs "Quality
  50" (null); Defence FoF vs "Nifty 50" ETF (null); "Nifty 50" FoF -> "Nifty 50" ETF rather than "Nifty Next 50"; a
  flexicap FoF vs "Nifty IT" ETF (null). `lookthrough.test.js` 284 passed; the first two fail on the 089510d page; on the
  base page 40 fail.
- **Same output as 089510d (Node vm, prototype `119980bf...` against the new head):** FoF resolution and scope 0 of 197
  differ; `aggEquityScoped` 0 of 6,784 single-fund look-throughs differ (the full JSON: m-cap, sectors, stocks, exposure,
  skipped); `aggDebtScoped` 0 of 760; `isNonStockName` 0 of 2,418 holding names; `computeOverlap` 0 of 3,000 random pairs.
  So 67 FoFs resolve, 34 in scope, Hang Seng TECH ETF FoF null, the 5 pins resolve, and the browser, Excel and deck
  evidence above stands without a re-run.
- **New head:** `site/index.html` sha256 **0261d219bb96fb7a2557c02c152e54372792453cc1a380fd928bb1fbb20969af**; +3 / -2
  lines on 089510d. `verify_page` identical to the base; `npm test` 8 of 8 files; every data block byte-identical
  (blocklib); siblings unchanged.

## KNOWN_ISSUES
- **Closed:** C72, C74.
- **New:** C79 (no "Not included" note on the equity slide and Excel sheet 9; a separate item, D111); C80 (`_CASH_RE`
  "repo" prefix, latent); C81 (two Quantum Gold ETF records); C82 (Motilal Oswal 5 Year G-Sec FoF's ETF not in MASTER);
  C83 (the aggregators' inline FoF lookups); C85 (non-stock rows neither filter removes, including liquid-fund units);
  C86 (FoF / ETF labels look swapped); C87 (BHARAT Bond ETFs filed "Gilt"); C88 (pins keyed by MASTER name).
- **C84 withdrawn** (SUPERSEDED -> C78): the item it was allocated for (the Navi Nifty REITs & Realty Index Fund 60.59%
  "Cash & Cash Equivalent" row) is already C78. C78 gains a dated note: the C74 filter drops that row from the top-20;
  the m-cap and sector "Others" 60.59% remain.

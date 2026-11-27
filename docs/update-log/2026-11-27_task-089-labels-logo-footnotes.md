# Update log - TASK-089: the logo, the return labels and the return-basis notes (27-Nov-2026)

**Run:** 27-Nov-2026, branch `fix/labels-logo-footnotes` from `origin/main` `b77a244` (TASK-090 merged as PR #76,
`eb5fce6`, an ancestor). Operator: Claude Code, chat EX-02 (workstream EX), Moderator MOD-03. Page code plus one new
`DATA_DATES` key; no other data change.
**Decision:** D118 (the owner's "Approve all", 26-Nov-2026). **Risk:** High (export code; client-facing wording).
Contract v2 and the claim: `docs/project-control/ACTIVE_CHANGE_REGISTER.md`; the phase 1 report and the Guardian
pre-check are in the claim record.

## What changed (`site/index.html`; data blocks byte-identical)

| Item | Where (grep) | Change |
|---|---|---|
| Logo | `function logoAlphaBox`, `function trimLogo`, `stampLogo`, `window.__SELECTED_LOGO_ASPECT`, App `logoTrim` | The picked logo's transparent margins are trimmed once (canvas; alpha threshold); the trimmed mark and its aspect go to `window.__SELECTED_LOGO` / `__SELECTED_LOGO_ASPECT`; `stampLogo` places it "contain" in `LOGO_HEADER` (right-aligned) and `LOGO_CLOSING` (centred), never stretched. SVG stays vector; above 25 MP the image is used untrimmed; with no aspect the old box is used. |
| Header logo | CSS `.app-header .logo` | 40 px high, at most 200 px wide, `object-fit: contain`, right-aligned (the Invictus logo no longer runs into "Upload"). |
| Labels | every client-facing "Expected Pre-Tax IRR" | "Indicative Return Range": Section 4, the Live Output tabs, the pills and rollup, the forms and alerts, Excel, the deck; the star note reads "(the mid-point of the indicative return range, or the yield or rate of a bond or FD)". The internal Master Editor columns ("IRR Low % / IRR High %") and code comments are unchanged. |
| Basis note | `H.RETURN_BASIS_NOTE`, `ReturnBasisNotes` | "Indicative returns are post-expense and pre-tax." under Section 4 (before the download bar), under the Live Output "Investment Proposal" tab, in Excel sheet 1 (after a blank row, before the star note) and first in the deck's Investment Option notes. |
| Debt note | `H.isDebtMutualFund`, `DEBT_YTM_EXCLUDED`, `H.debtYtmNote` | When `DATA_DATES.debtYtm` is set and the selection holds a debt mutual fund: "Indicative ranges for debt mutual funds are based on the category average YTM as on 31st October 2026." In the same four places, after the basis note. |
| Date | `DATA_DATES` literal | New key `debtYtm: "31st October 2026"` (the owner's October YTM file, D117); `blocklib.setDataDate(html, "debtYtm", label)` stamps it. |

`window.H` 71 -> 74 keys (`RETURN_BASIS_NOTE`, `isDebtMutualFund`, `debtYtmNote`). Siblings and `robots.txt` unchanged.

## Rehearsal and apply
- Base `site/index.html` sha256 6311cfc8... (`b77a244`). Prototype built by exact-once replacements (every anchor found
  once) with `--debt-ytm "31st October 2026"`; sha256
  **bfdddd39ee0abd8433b74698ed4a182f37938bde1e56aa6d12d90e21e666b324**, sent to MOD-03 before the edit. The applied
  `site/index.html` equals it (atomic write through `tools/lib/blocklib.js`); it ends with `</body></html>`.
- Backup: the six deploy files in `%USERPROFILE%\...\backups\2026-11-27_pre-task089\` with `SHA256SUMS`.
- `verify_page`: exit 0, identical to the base except the `DATA_DATES` line (gains `debtYtm`); MASTER effective 7,714;
  0 duplicates; 0 script errors. Every blocklib data block byte-identical.
- `setDataDate("debtYtm", "30th November 2026")` on a copy changes exactly one line (the key's own) and keeps the line
  count; without the key it throws.

## Debt fund set (one-off Gate C comparison; no frozen list in the repo)
- Class set (asset class Debt; product class Mutual Fund or ETF) on this base: 499.
- `H.isDebtMutualFund`: 488 = OPS-02's TASK-090 YTM-banded list (missing 0, extra 0). The 11 exclusions are all in the
  class set and all fail the gate: 4 Quantum Liquid "Unclaimed" plans, 4 segregated portfolios, ABSL Income Plus
  Arbitrage FOF, 2 equity / G-Sec blends. 499 = 488 + 11.
- `labels_notes.test.js` checks that each excluded name still exists and is excluded; TASK-091A's band tool will make
  the gated set permanent (it evaluates the predicate from the page).

## Deck page counts (one debt MF plus equity MFs; sizes 1-60)
- Unchanged at most sizes (for example 1, 10, 20, 30, 45 and 60 funds: 22, 24, 27, 29, 33 and 34 slides).
- One more Investment Option page at 32 funds (29 -> 30 slides) and at 46-48 funds (33 -> 34): the notes take two or
  three lines and `footerBlock` measures them (D82).
- 0 layout warnings at any size.

## Tests
- `npm test` 10 of 10 files, 0 failures: aif_accept_missing 11, blocklib 34, dates 10, expected_returns 58,
  fund_life 65, **labels_notes 56 (new)**, lookthrough 287, parser_refresh_only 18, pptx_layout 805, tool_inputs 43.
- `labels_notes.test.js` on the base: 36 of 56 fail (it tests the change).

## Gate C: browser, Excel and PowerPoint (qa-verifier): PASS, no regression

Headless Edge 158 on the worktree page (sha256 bfdddd39... at start and end) against the backup served as BEFORE; the
five siblings byte-identical to the backup.

1. **Load (1440x900): PASS.** "Universe - 7714 instruments" (as BEFORE); footer dates equal `DATA_DATES`; console empty
   through every flow (the recorder caught an injected probe).
2. **Header logo (1440 and 1280): PASS.** Marks: Centricity 200x39, Invictus 200x35.6, OneDigital 188.8x40, a padded
   PNG trimmed 800x400 -> 300x80 and shown 150x40, a JPEG untrimmed 160x40, an SVG kept as SVG 200x40. Every mark starts
   at least 10 px right of the "Upload" label (BEFORE: an SVG upload overlapped it by 10 px). Five rapid switches (0-5 ms
   apart) each settled on the last choice; the previous logo was never shown in between. Pre-existing and unchanged: at
   1280 the title wraps and the sub-title touches the "LOGO" label.
3. **Labels and notes on screen: PASS.** Section 4 and Live Output columns "INDICATIVE RETURN RANGE"; KPI "INDICATIVE
   RETURN RANGE (WEIGHTED)"; Future Value "INDICATIVE RETURN (P.A.)"; fund pills "Indicative ..."; no old label left. Both
   notes under Section 4 and under the Investment Proposal tab with HDFC Corp Bond Fund in the proposal; with it removed,
   the basis note only; with a Quantum Liquid "Unclaimed" plan (Debt / Mutual Fund, excluded) at 30%, still no debt
   note. `PortfolioRollup` is never rendered (dead code): its labels checked in the source only.
4. **Excel (COM): PASS.** 13 sheets; C4 "Indicative Return Range". With the debt fund: GRAND TOTAL row 16, basis note
   row 18, debt note row 19, star note row 20 ("mid-point of the indicative return range"). Without (the excluded
   record): basis note row 18, star note row 19, no debt note.
5. **Decks: PASS.** OneDigital, Centricity, Invictus and a padded PNG: 25 slides each, `__PPTX_LAYOUT.warnings` empty,
   `render_pptx` + `check_pptx_bounds` "no problem found", logo on 25 of 25 slides. Content-slide logo boxes (x, y, w, h):
   OneDigital 11.21, 0.226, 2.02, 0.428; Centricity 11.21, 0.243, 2.02, 0.394; Invictus 11.21, 0.26, 2.02, 0.36; padded
   PNG 11.58, 0.22, 1.65, 0.44 (right-aligned); closing slide centred in 8.47, 4.33, 4.06, 0.89. Investment Option slide:
   notes in the order basis, debt, star; the "Indicative Return Range" header fits its cell on two lines. No "Pre-Tax IRR"
   in any AFTER deck (BEFORE: slides 12 and 15). The no-debt deck has the basis and star notes only. The Thank You logo
   cannot be seen in BEFORE and AFTER alike (C68).
6. **Owner sample deck: PASS.** `%USERPROFILE%\...\monthly-updates\2026-10_Oct-2026\_review\TASK-089_sample_deck_OneDigital.pptx`
   (local only, git-ignored): OneDigital logo, HDFC Corp Bond Fund in the proposal, both notes, the new labels; 25 slides,
   13.333 x 7.5 in, opens in PowerPoint; sha256 b4d073e4..., the check-5 OneDigital deck byte for byte.

Not run: the Allocation Sheet round-trip (not in scope), the credit-rating doughnut sum (the swept proposal's only debt
holding was the excluded record), the live Pages hash check (nothing published).

## Gate C: financial data review (financial-data-reviewer): PASS WITH NOTES

1. **Debt scope: PASS.** Loaded in a vm with the siblings: MASTER 7,714; `H.isDebtMutualFund` 488, 0 missing and 0
   extra against the operator's list; the 11 exclusions in the class set and excluded; band counts equal the TASK-090
   table. Spot checks as recorded (for example HDFC Liquid 6.25-6.75, SBI Overnight 5.25-5.75, AlphaGrep Liquid Omni FOF
   6.25-6.75, ICICI Pru Diversified Debt Strategy FOF 7.00-7.50, Tata G-Sec Dec 2026 5.25-5.75). The owner's file is
   "Average as on 31st Oct 2026"; `DATA_DATES.debtYtm` survives the sibling load.
2. **"Indicative returns are post-expense and pre-tax." - OPEN, for the owner.**
   - Debt mutual funds: under D117 the band is the category average portfolio YTM +/- 0.25% with no expense ratio
     taken off. Portfolio YTM is gross of TER, and the band is the same for Regular and Direct plans (average Regular
     TER 1.52% in Credit Risk, 1.33% Medium Duration, 1.24% Dynamic Bond, 0.96% Short Duration). The two notes sit side
     by side and disagree.
   - Other mutual funds, SIF, GIFT City, Offshore: "post-expense" holds only if the owner's band workbooks were set net
     of TER; the repo does not record it, and the bands are plan-agnostic.
   - PMS / AIF: fee basis of the bands not recorded; Cat III AIFs are commonly taxed at fund level, so "pre-tax" may
     not hold.
   - Bonds and FDs: pre-tax holds; "post-expense" has no meaning for them. Direct Equity has no band, yet the note
     prints.
   - The wording is the owner's (D118). Options put to the owner: (a) keep it; (b) a debt carve-out; (c) new wording
     from the owner or compliance. No code change unless they choose (b) or (c).
3. **Notes (no change made):** the deck disclaimer still says the ranges are "based on Centricity Products Team views"
   (the debt ranges are now YTM-derived); the YTM note also shows for a user-added fund entered as Debt + Mutual Fund, a
   per-fund band override and a debt fund at 0%; ICICI Pru Retirement Fund-Pure Debt Plan is filed Hybrid / Solution
   Oriented (existing data, outside the gate).

## Not changed on purpose
- The Thank You slide logo cannot be seen (a white mark on white artwork) before and after this change: KNOWN_ISSUES
  C68, a separate item under D118.
- `docs/DECISIONS.md` and `CLAUDE.md` (the Moderator's).

_Owner answer 28-Nov-2026 (MOD-03, release record of PR #78): item 2 above is closed. The owner kept the note "Indicative
returns are post-expense and pre-tax." exactly as approved (option a, no debt carve-out) and said "Yes, publish" after the
sample deck. Corrections from Gate B: the native "Important Disclaimer" slide text also changed (to "Indicative return
ranges are post-expense and pre-tax, and based on Centricity Products Team views"), which the "What changed" table does not
list; and `H.isDebtMutualFund` matches 488 records (the class set is 499 before the 11 exclusions). Minor leftovers: C95, C96._

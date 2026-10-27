# Project state

_Last updated: 27-Oct-2026 — the outgoing owner's handover export (23-Oct-2026) is ingested: verified,
extracted, 32 desk files filed into `monthly-updates/` (one held), findings recorded
(`docs/update-log/2026-10-23_handover-export.md`). No `site/` change. It found that PMS performance is
31-Jul data under a 31-Aug label (B1), that nobody now builds the risk-ratio and NAV workbooks (B8),
and that two client items reached the export (R8). Before that: the PowerPoint design system (PR
#26, D82–D83), small fixes (PRs #19–#23) and September Run 3 (PR #18)._

## Summary

The dashboard has been transferred from the outgoing owner to the Centricity Products team
(GitHub `productsteamcentricity`) and publishes from the new repository. Since the transfer, the
monthly tools and the page code were hardened (16–19-Oct-2026) and the September data was
re-applied once to correct inception dates and carry the source's risk-reliability flags; parity
counts are unchanged. A P1 data gap found on 19-Oct-2026 — 215 funds on four Monitor sheets the
parser skipped showed 30-Jun-2026 figures under the September label (`KNOWN_ISSUES.md` C19) — is
fixed: the parser in PR #17, the data in PR #18 (Sep-2026 Run 3, approved by the owner on
21-Oct-2026). One record (the JioBlackRock G-Sec fund) is held at its earlier values until the
owner decides C20. The next run is the **September-2026 Reckoner catch-up**
(`/monthly-update September 2026`) when the desk releases the "October 2026" Reckoner deck (data as
on 30-Sep), followed by the **October-2026 MF cycle** (`/monthly-update October 2026`) in mid-November.

## Data in force (as on)

| Domain | As on | Next due |
|---|---|---|
| MF performance (Regular + Direct), MF benchmarks | 30-Sep-2026 (the 214 refresh-only-sheet funds since Run 3, PR #18). Exceptions: the JioBlackRock G-Sec fund, held at earlier values for C20; 12 Debt ETF durations / maturities kept from earlier months where the Monitor cell is blank (D81); funds absent from the Monitor (bake CHECK, 42) | Oct-2026 MF cycle |
| Equity / Hybrid / Debt analytics | 30-Sep-2026 (SIF look-through from Aug) | Oct-2026 MF cycle |
| Listed Direct Equity universe + returns | 30-Sep-2026 | Oct-2026 MF cycle |
| Expense ratio, exit load | Sep-2026 | Oct-2026 MF cycle |
| SIF performance | 30-Sep-2026 | Oct-2026 MF cycle |
| Portfolio Matrix (risk ratios) | 30-Sep-2026; 33 funds carry the source's reliability flag (28 NAV split, 5 low correlation), shown with a dagger and footnote | Oct-2026 MF cycle |
| Market Update slides | October-2026 deck (September outlook) | next Outlook deck |
| Fund managers (internal: search box and Master Editor only) | 30-Sep Monitor, first-named manager only (the Sep bake replaced the 31-Aug full-team roster) | **behind** — needs `Fund Manager Data` as on 30-Sep or later, applied after the bake (step 9) |
| PMS performance, AIF performance, Centricity Select | AIF and Select 31-Aug-2026 (September-2026 Reckoner); PMS 31-Jul-2026 data under the "31st August 2026" label (`KNOWN_ISSUES.md` B1; found through the handover export) | **behind** (PMS two cycles, AIF and Select one) — needs `PMS_Scheme_Performance` as on 30-Sep and the "October 2026" Reckoner deck (`/monthly-update September 2026`) |
| PMS/AIF look-through (no page label; D70) | 31-Jul-2026 | when `PMS & AIF Analytics` arrives |
| Invictus bonds / GIFT City & Offshore / SIF universe | 6-Aug-2026 / Jun–Jul-2026 / Jun-2026 list (28 schemes; 30 live in `var SIF`) | only when the desk sends new lists |

Inception dates: corrected on 19-Oct-2026 (PR #13). 1,851 MASTER records and all 30 SIF rows moved
+1 day to the true date; 2,070 of the 2,072 Sep Monitor rows found in MASTER now carry the Monitor's
exact inception (exceptions: `KNOWN_ISSUES.md` C16, the Regular record still carrying the Direct
plan's date, and one legacy "Mutual Funds" record). Detail: `docs/update-log/2026-09_Sep-2026.md`,
Run 2.

## Latest verification

`node tools/verify_page.js site` on 21-Oct-2026 on this change (PR #18, Sep Run 3), as on 19-Oct-2026
at `main` `1e48781`, `6dc08ef` and `8e187ae`: identical, unchanged from the handover figures, exits 0:

```
MASTER effective          7682
CENTRICITY_SELECT         178   (keys present in MASTER: 178)
  with rationale          133
  with risk ratios        46
  with details            51
PMS_PERFORMANCE.pms       692
PMS_PERFORMANCE.aif       12
PMS_PERFORMANCE.benchmark 4
PMS_PERF_ALIAS            27   (null pins: 4)
EQUITY_ANALYTICS          1205
RISK_MATRIX               1088
PMS_AIF_TERMS             73
EXTRA_SLIDES              6
DATA_DATES                {"performance":"30th September 2026","analytics":"30th September 2026","pms":"31st August 2026","sif":"30th September 2026","riskMatrix":"30 Sep 2026"}
duplicate MASTER names    0
file ends </html>         yes
MASTER PMS with perf      23 of 27

script errors (excluding the CDN globals): 0
```

`npm test` with the C19 change: 3 of 3 test files pass (blocklib 28, dates 10,
parser_refresh_only 18). RISK_MATRIX entries with `fl`: 33. Browser checks of the corrections run
(19-Oct-2026): `H.riskFlagged` marks 33 of 1,088 entries; console clean (update log, Run 2); page
load with the C19 change clean. Full browser check list last run on 16-Oct-2026 (all 11 pass).

Sep-2026 Run 3 (PR #18): `Updated 2127 schemes · as on 30th September 2026 · 19 rows not merged`;
`GATE fund rows on unrecognised Monitor sheets: PASS (0)`; no WARN; `CHECK MASTER MF/ETF funds on no
sheet of this Monitor` 42; MASTER records carrying r1y 6,339 → 6,348. Exactly 214 MASTER records
change; every other block, `DATA_DATES` and the five siblings are byte-identical; `verify_page`
counts above unchanged. Financial-data review: all 214 records recomputed from the Monitor (3,758
field checks, 0 mismatches); Regular 1M at or below Direct on 212 of 212 pairs. Detail:
`docs/update-log/2026-09_Sep-2026.md`, Run 3.

Small fixes of 21-Oct-2026 (PRs #19–#23): `verify_page` output identical to the block above after
each PR, exit 0; `npm test` 4 of 4 (blocklib 34, dates 10, parser_refresh_only 18, tool_inputs
43). Browser: page load console clean; the Portfolio Matrix slide with 25 funds and a simulated flag
rendered in PowerPoint (table ends 0.08" above the footnote); the Select popover dagger and note for
a real and a simulated flag (`KNOWN_ISSUES.md` C17, C18).

Live acceptance check, 21-Oct-2026, on the live URL (`main` `1523bbc`, then `882160c`; no `site/`
change between): all seven areas PASS — parity and SHA-256 of all seven live files; page load (SRI,
console clean, footer dates); the core flow across classes incl. a refresh-only Debt ETF, an
International FoF, a PMS, a bond and Direct Equity; Excel (13 sheets), PowerPoint (28 and 30 slides,
logo on each) and the Allocation Sheet round trip; all 9 Live Output tabs; data spot checks; the
shared-link banner. No regression. Inherited quirks it surfaced are logged as C24–C27.

PowerPoint design system, 22-Oct-2026 (PR #26, branch `feat/pptx-design-system`): `verify_page`
output identical to `main`, exit 0; `npm test` 5 of 5 (the new `pptx_layout.test.js` about 800
checks). Real exports through the page — the current 8-instrument debt proposal, the 4-fund check
(23 slides), and stress portfolios of 3, 15 (Lakhs), 30 and 45 instruments — have no layout warning
and, rendered in PowerPoint and measured with `tools/dev/check_pptx_bounds.js`, no table below the
footer line, no overlap, no text past the rule (the pre-change deck fails three ways). All 73 rows the
old and new decks share are value-identical; chart data identical. Audit:
`docs/proposal-output-format-audit.md`; renders and sample decks (local only):
`_testdata/pptx-design-system/`. After the merge (`5d39821`, Actions run 39806564591, verify +
publish succeeded): the seven live files equal `site/` (SHA-256, 7 of 7), and an export on the live
site of the 4-fund check gives 23 slides, no layout warning, console clean.

## Release

| Item | Value |
|---|---|
| Repository | https://github.com/productsteamcentricity/Centricity-Proposal-Playbook (public) |
| Live URL | https://productsteamcentricity.github.io/Centricity-Proposal-Playbook/ |
| Baseline tag | `handover-baseline` (= upstream `72e1f1e`, sanitised) |
| Transfer PR / merge commit | PR #1 → merge `25e71a3` (16-Oct-2026); Actions run 38866042211 (verify + publish) succeeded |
| Latest merge | PR #26 → `5d39821` (22-Oct-2026), the last merge that changed `site/` (PowerPoint design system, D82–D83); Actions run 39806564591 (verify + publish) succeeded. Before it: PR #22 → `fb9cbd6`; PR #18 → `f37fa01` published Sep-2026 Run 3 |
| Live status | 22-Oct-2026: the six deploy files and `robots.txt` on the live site equal `main` `5d39821` (SHA-256, 7 of 7); `Centricity_Risk_Matrix.js` returns 404 (archived, D78) |

## Completed (Stage A — replication and baseline)

- Inventory of all handover material; full re-extraction of the inputs zip (81 files; the earlier
  manual extraction had only 43 of them); verified integrity (six deploy files match PRD §2.3 hashes and the
  live production site byte for byte).
- Git history migrated (74 commits) with client names redacted from one spec; pushed to the new repo.
- Repository reorganised into `site/`, `tools/`, `docs/` with tool behaviour proven unchanged.
- Workspace organised: `monthly-updates/00_INBOX` + month folders, `backups/`, `handover-archive/`.
- Local preview hardened (serves `site/` on localhost only); CI parity gate + Pages publishing.
- Documentation set, 8 specialist agents, `/monthly-update` and `/verify-dashboard` skills.

## Fixes since the transfer (16–19-Oct-2026)

| PR | Merge | What | Issues / decisions |
|---|---|---|---|
| #3 | `3f3e4b5` | blocklib atomic writes and label helpers; `verify_page.js` exits 1 on a hard failure; unit tests; rehearsal harness | A8, A9, A23, A24 (part) |
| #4 | `1e4b2fc` | `merge_bond_list.js` needs `--desk`; refuses an ambiguous sheet | A1 |
| #5 | `4fbbad6` | `merge_pms_aif_analytics.js` no longer writes `DATA_DATES.analytics` | A3, D70 |
| #6 | `c93e55c` | `merge_reckoner.js` drop gates, `--accept-drops <n>` | A4, D71 |
| #7 | `0d4fca3` | MF chain: `isoDay`, `prev_names`, shared DIRECT_PERF builder, `npm test` in CI | A2, A5, A6, A7, A17, D72, D79 |
| #8 | `455a573` | DE universe / returns, expense, fund managers | A10–A14 |
| #9 | `71ecbe2` | risk matrix `fl`, SIF `--as-on` required, Python route guards | C3, A15, A16, A22 |
| #10 | `79e9759` | `tools/data/pins.json`; Reckoner fourth gate; PMS/AIF tools | A3, A4, A18–A20, A25, D75, D76 |
| #11 | `d260cdf` | bond list, slide and one-off tools | A1, A21, A26 |
| #12 | `792692d` | page: in-page `isoDay`, risk dagger and footnote, shared-link banner, SRI, `noindex`, favicon; risk-matrix file archived | A5, A6, C3, C13, C14, R2, R3, R5, E4, F3, D77, D78 |
| #13 | `10cb44c` | Sep-2026 data corrections (inception +1 day; 33 risk flags) | A6, C3 |
| #14 | `cd6317c` | `rename_schemes.js` compares the exact inception day | A6, D73 |
| #15 | `1e48781` | strict CLI finished (a stray word or a value flag without a value exits 2 in the six MF-chain tools too); last literal no-break spaces escaped; unused `fs` dropped from `merge_reckoner.js` | A25, F2, D72 |
| #16 | `6dc08ef` | docs: the post-handover fixes recorded; the export prompt | — |
| #17 | `8e187ae` | page parser: four refresh-only Monitor sheets; `bake_month.js` not-merged list, WARN, CHECK and unrecognised-sheet gate; parser unit test | C19 (code), D80 |
| #18 | `f37fa01` | Sep-2026 Run 3: 214 funds move from 30-Jun to 30-Sep-2026 figures; JioBlackRock G-Sec held; owner decision on blank cells recorded | C19 (data), D81 |

Status of every inherited item: `docs/KNOWN_ISSUES.md`. Partly fixed and still open there: A7 (page
Direct uploader is a separate parser), A14, A19, A20, A22, A23, A24, A25 (only the stale
`.gitattributes` NUL comment is left), F2 (only the misnamed `clen` in `tools/lib/pptx.js:9`), F3,
plus new C16, C20 and C21, and C22 and C23 (21-Oct-2026). C19 is fixed (code #17, data #18); C17, C18 and
A27 were closed on 21-Oct-2026 (PRs #21–#23).

## Small fixes of 21-Oct-2026 (P3 leftovers)

Five independent fixes, one PR each; none changes a data block.

| PR | Merge | What | Issues / decisions |
|---|---|---|---|
| #19 | `699978b` | every tool exits 2 on a missing source or `--html` path (no more `ENOENT` crashes); `tools/test/tool_inputs.test.js` | D72 |
| #20 | `0cb7e95` | `writeFileAtomic` retries a rename blocked by OneDrive (`EPERM`/`EBUSY`/`EACCES`, 6.3 s) and always removes its temp file | R6 (mitigated), A8, D72 |
| #21 | `75538de` | Portfolio Matrix slide: with a flagged fund the table shrinks to end above the † footnote (25 funds: 6.64" vs 7.87"); new C22 for the unflagged overflow | C17, C22 |
| #22 | `fb9cbd6` | Centricity Select popover: dagger and note for a C3-flagged fund; new C23 (Select Alpha scale) | C18, C23 |
| #23 | — | `tools/dev/rehearse.js --old-site <dir>`: rehearse a page-code change (old side seeded from another `site/`), with a data verdict | A27 |

## PowerPoint design system (22-Oct-2026)

| PR | Merge | What | Issues / decisions |
|---|---|---|---|
| #26 | `5d39821` | Every native slide laid out by measurement: shared frame, footer block and page numbers; table engine that fits or continues (Investment Option, performance, matrix, liquidity); rationale cards; legends with values; performance buckets share slides, PMS/AIF by asset class and dated by `DATA_DATES.pms`; matrix coverage list; "Other AMCs (n)"; `*` on expected returns; `pptx_layout.test.js`; `tools/dev/render_pptx.ps1` + `check_pptx_bounds.js`; audit `docs/proposal-output-format-audit.md` | D82, D83; C22 closed; C28–C34 new |

## Handover export (ingested 24–25-Oct-2026)

The outgoing owner's export arrived on 23-Oct-2026 (two zips, 1.7 GB, sent over Teams). It was
verified (SHA-256), extracted by script (2,720 files) and matched against its manifest (2,680 of
2,680). 32 desk files are now filed by data month in `monthly-updates/`, plus one move to
`_superseded/`; one file is held (B9). Nothing in `site/` changed: the export's deploy files equal
upstream `72e1f1e`, and the live site is newer. Record:
`docs/update-log/2026-10-23_handover-export.md`.

It surfaced:
- **B1:** PMS performance is 31-Jul data under the label "31st August 2026".
- **B8:** NAV Data and Fund Risk Ratios were made in-house; nobody builds them now, which blocks the
  Oct-2026 Portfolio Matrix.
- **R8:** two client items reached the export despite its README (local and git-ignored; for the
  owner and compliance).
- New items C35–C40 and A28; corrections to C5, C6, C11, C23, C24, C28 and R1.

The Git repo also hit OneDrive cloud-only placeholders in `.git/objects/pack/` while OneDrive was not
running: `git checkout` failed with "mmap failed" (R6).

## In progress / blockers

- **Owner decisions from the handover export (P1):**
  - who builds NAV Data and Fund Risk Ratios from October (B8; this blocks the October risk matrix;
    decide Rf C11 and Sortino C35 first);
  - the PMS label (B1);
  - what to do with the client items found in the export, with compliance, and whether to tell the
    outgoing owner (R8).
- **Owner decision pending — C20 (P1).** 12 JioBlackRock Regular records carry the Direct plan's
  returns from before their Aug-2026 launch (live); the 13th, the C16 G-Sec fund, is held at its
  earlier values (Run 3) so it does not mix the Regular inception with the Direct plan's figures.
  Options: clear return periods longer than the fund's life, or keep them labelled. The owner
  published Run 3 without waiting for this (21-Oct-2026) and kept blank-cell values under the existing
  rule (D81).
- **Owner decision pending — 8 renames.** `rename_schemes.js` (reading the Monitor's true dates)
  finds 8 renames in the Sep and Aug Monitors that it used to miss: HDFC Retirement Savings →
  Retirement (Hybrid-Debt Plan); four Kotak overseas FoFs, Omni → Active; two Axis FoFs, Active →
  Omni; Motilal Oswal Asset Allocation Passive FoF-Aggressive → Multi Asset Passive FoF (looks
  suspicious: confirm against the AMC notice). They are **not applied**. Their new names sit on the
  `Solution Oriented,ETFs,FOFs` and `Hybrid` sheets, so the old-name records keep older figures (seven
  equal the 30-Jun-2026 Monitor) and the bake lists the new names as `not in MASTER`. With the C19
  fix, once a rename is approved and applied, the next bake **does** refresh that record through the
  refresh-only path (by exact name; its MASTER class is kept). Decide before the October MF cycle's
  rename `--apply`. List: `docs/update-log/2026-09_Sep-2026.md`, Run 2.
- Desk inputs missing: PMS performance file, the October Reckoner deck, Fund Manager Data, PMS & AIF
  Analytics, analytics workbooks with SIFs (`KNOWN_ISSUES.md` B1–B6); why 4 unmatured Debt ETFs are
  absent from the Sep Monitor (C19).
- External: the outgoing owner's public repo still holds the unredacted spec in its history and its
  site still serves it and the old dashboard — the owner should coordinate retirement with the
  outgoing owner (`KNOWN_ISSUES.md` R1, R7).

## Next steps (in order)

0. Owner: decide who builds the NAV Data and Fund Risk Ratios workbooks before the October cycle
   (B8; Rf C11, Sortino C35). The recommended route is porting the outgoing owner's toolchain to
   Node in `tools/`, with a Sep-2026 regression test. Also decide the PMS label (B1) and the export's
   client items (R8). Keep OneDrive running, and this folder on "Always keep on this device" (R6).
1. Owner: decide C20 (13 JioBlackRock Regular records); then release the held G-Sec record and apply
   the decision to all 13 in one reviewed change.
2. Desk: confirm the two Mirae FoFs whose September returns sit far above their underlying ETFs
   (S&P 500 Top 50 ETF FoF 1M 24.79%, NYSE FANG+ ETF FoF 1M 16.21%) before a client deck uses them.
3. Owner: confirm or reject the 8 renames (above).
3a. Owner: decide how the headline expected return treats instruments with no IRR band, such as
   Direct Equity (`KNOWN_ISSUES.md` C24; today they count as 0% in the tile, Future Value and the
   deck, but are left out of the Section 4 table).
3b. Desk: confirm the unit of the Centricity Select alpha (`KNOWN_ISSUES.md` C23: the popover may show
   it 100 times too large). (C22, the long unflagged matrix slide, is fixed by PR #26.)
3c. Owner/desk, after PR #26: how the data should carry expected returns (C28: a per-period basis, or
   clear periods a fund has no history for; the 12 stale mid-points; the Alchemy 1Y); the Disclaimer
   source slide's layout (C34); whether fund pages like the reference deck's (fund narrative, alpha
   avenues, fee slabs) are wanted — the portal does not hold that content for every fund.
4. September-2026 catch-up, when the "October 2026" Reckoner is released (the last was applied on
   28-Sep): drop the Reckoner deck, `PMS_Scheme_Performance` as on 30-Sep, `Fund Manager Data` as on
   30-Sep and the latest `PMS & AIF Analytics` into `00_INBOX`, then `/monthly-update September 2026`.
5. October-2026 MF cycle (data as on 31-Oct), around 13th–17th November: `/monthly-update October 2026`.
6. Owner decisions pending (no urgency): branch protection on `main`; whether to keep the repo public
   long-term; retirement of the old site; whether to move the git folder out of OneDrive
   (`KNOWN_ISSUES.md` R6 — a OneDrive sync blocked one write on 19-Oct-2026; since PR #20 a blocked
   rename is retried for 6.3 s).
7. Improvement backlog (only on request): the partly fixed and open items in `KNOWN_ISSUES.md`.

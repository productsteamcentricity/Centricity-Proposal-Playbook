# Investment Proposal PowerPoint: format audit and redesign (22-Oct-2026)

This records the audit of the exported proposal deck, the defects found and their causes in the code,
what was changed (the presentation design system, D82, and the expected-return marker, D83), what was
validated, and what is still open. Branch `feat/pptx-design-system`.

## 1. Inputs and method

| Input | Role | Slides |
|---|---|---|
| A hand-finished proposal deck from the team | Visual reference only: layout patterns, hierarchy, spacing, table and chart treatment. Its proposal data were **not** used. | 19 |
| The portal's export of a real proposal (eight debt instruments across liquid funds, a debt PMS, two debt AIFs and three desk bonds) | The output to improve; source of truth for that proposal's data. Neither deck is in the repository. | 23 |

Method:

1. Both decks were rendered in PowerPoint (COM, 1600×900 per slide) and inspected slide by slide and as
   montages; text, tables and chart caches were extracted from the XML.
2. The current output was **reproduced** through the real page: `window.EXPORTS.exportPpt` on the local
   preview with the same instruments, allocations and IRR overrides the deck shows. The reproduced deck's
   text and every shape's position were identical to the supplied deck, so the defects below are the
   code's, not a one-off.
3. The export code was traced: `buildDeck` in `site/index.html` (the `window.EXPORTS` IIFE, pptxgenjs
   3.12.0 from a pinned CDN). No sibling file touches the export. Charts are native pptxgenjs charts;
   the Market Update, divider, Disclaimer and Thank You slides are full-bleed images from
   `site/Centricity_ExtraSlides.js` with the selected logo stamped on top.
4. PowerPoint's own text metrics were calibrated (§4.2), and every redesigned deck was rendered and
   measured again in PowerPoint (§6).

## 2. Slide sequence

The portal's sequence is kept (Group H). Only the number of continuation and performance slides
changes with the data.

| # | Portal slide (current output) | Reference deck | Redesigned output (same proposal) |
|---|---|---|---|
| 1 | Cover | Cover | Cover (unchanged) |
| 2–8 | Market Update divider + 6 market images | at the end (11–17) | unchanged, same place |
| 9 | Investment Options divider | 2 | unchanged |
| 10 | Portfolio Construct and Requirements | 3 | same content; frame, footer, page number |
| 11 | Net Asset Allocation | — | same content; footer, page number |
| 12 | Investment Options Rationale (one text box) | — | card grid, paginated by measurement |
| 13 | Investment Option (overflows) | 4 | measured table, fits or continues |
| 14 | Portfolio Analytics — Debt | 5 | aligned panels, legend with values |
| 15 | Annexure divider | 6 | unchanged |
| 16–19 | Fund Performance: Debt MF / "PMS — Equity" / AIF / Other (4 slides) | 7 (Debt MF + Debt PMS stacked) | 2 slides: Debt MF + PMS — Debt + AIF — Debt stacked; Direct Bonds |
| — | — | 8–10 fund pages (Neo Yield Enhancer, Inquant, Neo Treasury Plus) | not produced (§7, data the portal does not hold) |
| 20 | Portfolio Matrix (all dashes) | — | coverage list (no instrument has risk data) |
| 21 | AMC Allocation & Portfolio Liquidity | — | sized panels, legend with values |
| 22 | Disclaimer (image) | 18 (different wording) | unchanged image (§7) |
| 23 | Thank You (image) | 19 | unchanged |

Equity analytics and the Overlap Matrix appear when the proposal has equity exposure, as before.

## 3. Defects found, by group, with their cause in the code

| Group | Slide(s) | Defect (seen in the render) | Cause (`site/index.html`, `buildDeck`) |
|---|---|---|---|
| B | Investment Option | Table runs off the slide: the OneDigital rows and the **GRAND TOTAL are not visible**; "100.00 %" breaks over two lines; table 12.0" wide in a 12.85" frame, ragged right edge | Fixed `MAX_BODY_ROWS_PER_SLIDE = 21` and `rowH 0.24` assume single-line rows, but exit-load text wraps to 4 lines and "As per Lock-In Period" to 3; fixed `colW` summing 12.0 (pptxgenjs takes `colW` over `w`); `% Total` 0.65" too narrow for bold 9pt |
| C | Rationale | One text column in the top third of the slide, 70% blank | A single `addText` per page and a page break estimated as `characters / 110` |
| D | Debt analytics | The labels of the two small doughnut slices overlap; legend without values; the bar chart's value axis reads 0–80 with no unit | `showValue: true` on every slice; default value axis |
| E | Fund performance | 1–3 rows on each of four slides, 70–80% blank; 8pt type | One slide per bucket; fixed 0.24" rows and 8pt |
| E/F | Fund performance | A **Debt** PMS shown under "PMS — Equity" with Large/Mid/Small/Others columns; bonds under "Other" with 10Y and market-cap columns | Bucket "PMS — Equity" catches every PMS; fixed column sets |
| E/F | Fund performance | PMS and AIF tables say "Performance as on 30th September 2026" but their data are as on 31-Aug-2026 | Every bucket used `DATA_DATES.performance`; `DATA_DATES.pms` was never read |
| E | Fund performance | Latent only: an MF benchmark row under a PMS/AIF bucket, or a PMS benchmark row under the debt bucket, would have put its returns under the wrong period headings. No current sub-category has such rows (checked in the page, 22-Oct-2026). | Benchmark values were listed in a fixed column order whatever the bucket's columns |
| F | Portfolio Matrix | Every metric "—" (0% coverage), no explanation beyond a note; the note (y 7.02, 0.42" tall) runs into the gold footer rule at 7.40 | No coverage-aware layout; fixed note position (also C22: a long unflagged table ran past the notes and off the slide) |
| F | Portfolio Matrix | The average row's "% Alloc" always printed 100% even when only part of the corpus has risk data | Hard-coded `"100%"` |
| G | AMC & Liquidity | Two AMC bars ~1" thick with a 0–60 axis; liquidity labels in black on the navy slice; liquidity table at a fixed y with 0.2" rows (overflows with ~14+ instruments); AMCs after the 12th silently dropped | Fixed chart and table geometry; `items.slice(0, 12)` |
| A/I | All native slides | No page numbers; footnotes at ad-hoc positions (6.85–7.04) with no shared rule; some text boxes reach the footer rule | No shared footer / notes helper |
| A | — | Brand system mostly sound: black header band, gold strip, white title, logo top-right, Cambria — kept | — |
| H | Disclaimer | Desk image: text block in the top half, header line in a different colour | The image itself (`EXTRA_SLIDES.disclaimer`, `tools/update_closing_slides.js`) — not changed here (§7) |

Honest-data findings (Group F, Phase 4), traced and **not** "fixed" by changing values:

- Expected returns are stored as if they were track record. `tools/merge_bond_list.js` writes every
  desk bond with 1Y = 3Y = 5Y = its yield, and `tools/add_reckoner_funds.js` writes AIF/PMS peers that
  publish no return series with 1Y = 3Y = 5Y = the IRR band mid-point. PMS/AIF horizons the performance
  source leaves blank keep the stored mid-point (`applyPmsPerformance`). The deck showed them as
  history, e.g. Inquant Debt Plus Fund (inception January 2024) at 12.50% for 3Y and 5Y. The reference
  deck marks such cells "*". → marked in the deck (D83); data flag logged as KNOWN_ISSUES C28.
- The issuer table's "Rating" column shows the credit **bucket** (e.g. "AA & Below") for a bond whose
  record holds "AA-". Deliberate (same vocabulary as the doughnut); left as is (financial review).

## 4. What was built

### 4.1 Design system (D82)

All inside the existing export IIFE (no new deploy file, no new dependency, pptxgenjs untouched):

| Piece | What it does |
|---|---|
| `DS` | One set of measures: content edges 0.25"–13.083", content top 1.08", footer zone ending 7.34" above the gold rule (7.40), type scale (title 22pt shrinking to 16pt when long, section 13pt, notes 8.5pt, stamp 10pt, page number 9pt), cell margins, border. |
| `TXT` | Text measurer: a fixed Cambria width table (regular and bold) and a greedy word-wrap that predicts PowerPoint's line breaks. Same results in the browser and in Node. |
| `applyMaster` | Header band, strip, fitted title, logo, footer rule and the **page number** (PowerPoint slide-number field) on every native slide. |
| `footerBlock` / `drawFooter` | Notes grow upward from the footer line, wrapped to the space left of the right-hand "as on" stamp; returns the lowest y content may use. |
| `columnWidths` | Number columns never wrap and share one width where they fit; name columns get room for one line (up to a preferred width); the rest goes to the column that saves the most height per inch; leftovers even out the number columns. |
| `rowHeights` | Real row heights: 0.08" margins + lines × 1.2 × size (PowerPoint's measured line height), honouring rowspan/colspan. |
| `planTable` | Picks the largest type size (11pt → 8pt) at which the table fits one slide; otherwise continues it at 9pt: header repeated, totals on every page, rows spread evenly, no group heading left at the foot of a page, and a "<asset class · product · sub-category> (continued)" row naming the group that carries over. Never drops a row, column or total. |
| `sectionTitle`, `contentSlide`, `pageTitle` | Section headings with an optional right-hand caption; one call for a native slide; "(i/n)" continuation titles. |
| Layout log | Every block placed is logged with the lowest y it may reach; anything outside the frame is a `console.warn` and lands in `window.__PPTX_LAYOUT.warnings`. |

### 4.2 Calibration

A calibration deck (10 strings × 4 column widths × 5 sizes/weights) was laid out by PowerPoint: a row is
exactly 0.1" + lines × 1.2 × size/72 at the default margins, and the measurer predicted the line count
of **197 of 200** cells exactly (the three misses were character-broken words in an artificial 0.7"
column). Widths are taken 3% wide so an error makes a row taller, never clipped. One trap found:
pptxgenjs applies its own 0.1"/0.05" cell margins to any cell without an explicit `margin`, so the
engine now writes its margin into every cell it draws.

### 4.3 Slide by slide

- **Investment Option** — full-width table measured and fitted (9pt for this proposal; 11pt for a
  small one), every row and the GRAND TOTAL visible, "100.00%" on one line, names on one line, exit-load
  text wrapping in its own column. Long proposals continue on numbered slides with the GRAND TOTAL on
  every page (PRD §9.2) and a context row. The hierarchy fills are unchanged.
- **Rationale** — one card per sub-category in a two-column grid, in asset-class order, each card
  tagged with its asset class; heading bold; the stored text unchanged, split at "Provides the
  investor with" into two paragraphs with that lead-in in bold; the largest size (12pt → 10.5pt) that
  fits, else continued. (A first version put an asset-class label above each group; groups with one
  card then wasted half a row and four funds needed two slides.)
- **Analytics** — two aligned panels; bar charts without the unit-less value axis (each bar carries its
  label); doughnut without in-chart labels, the legend carrying each share ("SOV — x.xx%"); issuer and
  holdings tables measured; "Analytics as on" stamp; funds left out of the debt look-through for want
  of holdings are named in a note.
- **Fund performance** — buckets that fit together at ≥ 8.5pt share a slide, each under its own
  heading and as-on date; PMS and AIF split by asset class ("PMS — Debt") and dated by
  `DATA_DATES.pms`; market-cap columns only where the bucket's data carry a split; a bucket of bonds
  only is titled "Direct Bonds"; benchmark values placed by period key (same output for every
  benchmark row that exists today).
- **Portfolio Matrix** — fitted and continued like any table (closes C22); notes in the footer block;
  the average row shows the share of the corpus that has risk data. When no instrument has risk data,
  a list of the instruments with "Not in equity risk dataset" and a note naming the nine statistics
  replaces a grid of dashes — no figure is ever shown as zero.
- **AMC & Liquidity** — bar height follows the number of AMCs; past twelve, the smallest share one
  "Other AMCs (n)" bar from the unrounded remainder (bars still add to 100%); note stating the base
  (the MF / Index Fund / ETF allocation, ₹ amount); liquidity doughnut with legend values, giving up
  height so its table stays on the slide; a longer table continues on "Portfolio Liquidity — continued".
- **Construct, Net Asset Allocation, Overlap** — same content in the frame with the footer block; the
  allocation table steps from 11pt to 9pt when there are many product classes; the overlap image is
  kept inside the frame.
- **Cover, dividers, market, Disclaimer, Thank You** — unchanged. The cover's ellipses and the
  vertical gold rule extend past the slide edge on purpose (the divider design).

### 4.4 Expected-return marker (D83)

`H.isExpectedReturn(fund, key, entry)` marks a 1Y/3Y/5Y figure "*" when it is the screen's IRR-mid-point
fallback, when the record carries no return series of its own (1Y = 3Y = 5Y with no 1M/3M/6M/2Y/SI —
83 records: 50 bonds, 16 AIF, 6 FD, 5 unlisted equity, 4 PMS, 1 REIT, 1 GIFT City; no false positive
found), or when a PMS/AIF performance source leaves that period blank (31 cells on 16 records). It
reads the stored MASTER record, so a Direct-plan figure or a user's own return override is never
marked. The deck adds one note: "* No return is published for this period: the figure is the expected
return held in the data (the IRR band mid-point, or the yield or rate of a bond or FD), not past
performance. Weighted rows include these figures." The on-screen table still marks only the fallback.

## 5. Data integrity

- No calculation, selection or data block changed. `git diff` touches only page code: the new
  predicate and the export section. `node tools/verify_page.js site` prints the same output as `main`.
- The reproduced current deck and the redesigned deck were compared table row by table row: all 73
  rows they share are value-identical (instrument names, amounts, allocations, IRR bands, 3Y/5Y,
  strategies, maturity/exit, totals, issuers, liquidity). The only differences are intended: the
  four market-cap columns, all "—", dropped for the Debt PMS, Debt AIF and bond tables; the
  zero-coverage matrix shown as a status list instead of 90 dashes and an all-dash average row.
- Chart caches are identical (issuer-type, credit-rating, AMC and liquidity shares); only the
  doughnut legend labels gained their percentages.
- Disclaimer and Thank You images are byte-identical inputs; their wording is untouched.

## 6. Validation

| Check | Result |
|---|---|
| Real export through the page (browser pane) for the current proposal, the TESTING.md 4-fund check and four stress portfolios | 0 script errors, 0 alerts, 0 layout warnings |
| PowerPoint COM layout of all six decks (every shape's box; tables measured by PowerPoint's own row heights) | No table below 7.08" (deepest 6.95"), no table overlapping a note or stamp, no text taller than its box, nothing outside the slide except the cover's intended decoration |
| Stress portfolios | 45 long-named instruments across ten classes (38 slides: 4 rationale, 5 Investment Option, 3 matrix, liquidity continued on 2); 30 equity funds with risk data incl. 2 flagged (2 matrix slides); 15 AMCs in Lakhs ("Other AMCs (4)", liquidity table kept on the slide); 3 instruments (11pt tables); the TESTING.md 4-fund check: 23 slides (was 25), Performance Sheet tab 2 slides (was 4) |
| `tools/test/pptx_layout.test.js` (new, in `npm test` and CI) | 798 checks pass (the count follows the data, since the checks are per slide and per row): engine unit test (90-row table, nothing lost, header/total on each page, no orphan heading); 7 portfolios picked by rule — every instrument once in each table family, GRAND TOTAL on every IO page, 10 columns kept, every table and chart inside the frame, AMC bars sum to 100% (≤ 12 bars), one rationale card per sub-category; all nine single-tab exports for two portfolios |
| `npm test` | 5 of 5 test files pass |
| `node tools/verify_page.js site` | identical to `main`, exit 0 |

Renders, montages, before/after pictures and the sample decks are in `_testdata/pptx-design-system/`
(local only, gitignored): `Centricity_Investment_Proposal - 2026-10-22 redesigned.pptx`,
`montage_redesigned.png`, `montage_current_portal_output.png`, `montage_reference.png`, `renders/`,
`before-after/`, `stress/`.

## 7. Not changed, and open items

| Item | Why not here | Where logged |
|---|---|---|
| Disclaimer slide layout (text block in the top half of the desk image) | The slide is a desk-supplied image of compliance text (`EXTRA_SLIDES.disclaimer`); its source deck never arrived (B7). Re-laying it out means editing the source slide and re-running `tools/update_closing_slides.js`, not cropping a picture of legal text in the export. | KNOWN_ISSUES C34 |
| Fund-specific pages (reference slides 8–10) | They need content the portal does not hold for every fund (fund narrative, alpha avenues, fee slabs, calendar-year monthly returns). Building them would mean inventing or hand-keying data. | Owner decision (PROJECT_STATE next steps) |
| Reference-deck columns "Coupon" and "Credit Rating" in the Investment Option table | Not in the portal's table; the specification keeps the portal's columns (incl. Strategy). | — |
| Market Update position (reference puts it at the end) | The portal's order is kept (Group H). | — |
| Expected returns stored as history; stale mid-points (e.g. 12 records whose stored mid-point no longer matches the band, InCred Growth Partners II 27.50% vs 22–25%); one stale PMS 1Y (Alchemy Long Term Ventures) | Data, owner/desk decision; the deck now marks them | C28 |
| Performance buckets defined three times (screen, Excel, PowerPoint) and disagreeing on Debt PMS | Screen/Excel not in scope | C29 |
| Screen's Performance tab labels PMS/AIF with the MF date | Screen not in scope | C30 |
| AMC names from the scheme name's first word for 354 of 2,029 MF/ETF records ("Bank" for Bank of India) | Data | C31 |
| Debt look-through: an issuer's bucket set by the first instrument seen; an unrated bond would default to "AAA & Equiv" | Calculation, not presentation | C32 |
| Commodity ETFs carry `mcap_other` ≈ 100%, so an "Other" bucket shows market-cap columns | Data | C33 |
| Headline weighted IRR treats an instrument with no IRR band as 0% (C24); Select popover Alpha unit (C23); JioBlackRock pre-launch returns (C20) | Owner / desk decisions already open | C20, C23, C24 |

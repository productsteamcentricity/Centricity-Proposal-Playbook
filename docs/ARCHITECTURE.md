# Architecture

The system is deliberately simple: a static page with its data embedded, a handful of scripts that
patch that data when the page loads, and offline Node tools that splice each month's data into the
page. There is no server, database, build step, login or persistence.

```
                     ┌────────────────────────── offline, on the owner's machine ───────────────────────────┐
 monthly workbooks ─►│ tools/*.js  (dry-run → gates → --apply)                                              │
 (monthly-updates/)  │   read xlsx/pptx with xlsx@0.18.5 + tools/lib/pptx.js                                 │
                     │   run the page's own parsers in a Node vm (bake = upload)                             │
                     │   splice window.* literals via tools/lib/blocklib.js ──► site/index.html + siblings   │
                     └────────────────────────────────────────────────────────────────────────────────────────┘
                                         │ git push (branch → PR → verify → main)
                                         ▼
                     GitHub Actions: verify job (six files + tools/verify_page.js parity gate) → Pages publishes site/
                                         │
                                         ▼  browser (desktop, Chrome/Edge)
   index.html ─► CDN libs ─► inline data blocks (MASTER, analytics, Select, …) ─► window.H helpers ─► REFRESH parsers
             ─► EXPORTS ─► siblings 3–5 mutate the globals ─► inline RISK_MATRIX ─► React UI (createRoot)
   user picks + allocates in memory ─► Excel (SheetJS) / PowerPoint (PptxGenJS) generated in the browser
```

## 1. Components and boundaries

| Component | Location | Responsibility | Boundary rule |
|---|---|---|---|
| Page shell, CSS, UI | `site/index.html` (compiled React 18, no JSX at runtime) | Layout, sections 1–6, Master Editor, rails | Edit the compiled `React.createElement` code directly, matching the style; never restyle during data work |
| Reference data | inline `<script>` blocks defining `window.*` globals | Universe, analytics, Select, benchmarks, PMS performance, risk matrix | Changed only through `tools/` (blocklib) |
| Load-time overrides ("siblings") | `site/Centricity_*.js` (5 files) | Patch the globals on every page load | The data they own must be edited **in them** (PRD §11.5) |
| Business logic | `window.H` helpers in `index.html` (~L1446–2895) | KPIs, plan switch, look-through, credit buckets, overlap, tenure, liquidity, name resolution | Single predicates — never re-inline `isHybridScheme`, `isEquitySIF`, `isSelfDescribingDebt`, `creditBucket` |
| In-browser parsers | `window.REFRESH` (~L3143–3839) + `REFRESH.parseSif` (SIF sibling) | Session-only uploads; **also reused by the tools** so a bake equals an upload | — |
| Exports | `window.EXPORTS` (~L3840–5079) | `exportXlsx`, `exportPpt`, `exportTabSlide`, `exportMaster` | Client-side only |
| Monthly tools | `tools/*.js`, `tools/lib/*.js`, `tools/build_risk_matrix.py` | Turn source workbooks into new data blocks | Dry-run default; refuse rather than guess |
| Verification | `tools/verify_page.js`, `.github/workflows/pages.yml` | Run the page's scripts in a vm and print the true in-browser state; gate publishing | — |
| Preview | `.claude/serve.js` | Serve `site/` on 127.0.0.1:8080 | Never serve the repo root |

## 2. The six-file deploy and load order

| # | Loaded at (`site/index.html`) | File | Effect |
|---|---|---|---|
| 1 | `<head>`, L1232 | `Centricity_ExtraSlides.js` | `EXTRA_SLIDES` (3 dividers, 6 market slides, disclaimer, thank-you; 2001×1125 images) |
| 2 | L1233 | `Centricity_PMS_AIF_Terms.js` | `PMS_AIF_TERMS` (73: exit load + IRR band for new PMS/AIF) |
| 3 | after `#root`, L5083 | `Centricity_June_Refresh.js` | Replaces the GIFT City bucket; re-assigns 12 PMS/AIF look-throughs |
| 4 | L5084 | `Centricity_IRR_Offshore.js` | IRR bands for ~2,065 funds by exact name; 4 funds → Offshore Funds; RATIONALE/BENCHMARKS/LIQUIDITY entries. **After #3.** |
| 5 | L5085 | `Centricity_SIF_Refresh.js` | Replaces SIF rows with 30 (Equity SIF 16, Hybrid SIF 14); sets `DATA_DATES.sif`; registers `REFRESH.parseSif`. **After #4.** |

Each is idempotent-guarded (`window.__JUNE_REFRESH_APPLIED` etc.). Baseline MASTER 7,672 →
effective 7,682 after the siblings. `Centricity_Risk_Matrix.js` is **not loaded** (its content is
baked inline at L5091); it is kept in `site/` for parity. Deploying `index.html` without the siblings
silently reverts data — the CI `verify` job refuses a deploy with a missing sibling.

## 3. Line map of `site/index.html` (re-derived 16-Oct-2026; drifts with every edit)

| Lines | Block |
|---|---|
| L4–1223 | CSS (liquid-glass layer from ~L845) |
| L1224–1228 | CDN scripts: React/ReactDOM 18.3.1 (unpkg), Chart.js 4.4.0, xlsx 0.18.5, pptxgenjs 3.12.0 (jsDelivr) — pinned, no SRI |
| L1229–1231 | `CENTRICITY_LOGO`, `DIRECT_PERF` (1,689), `LOGO_PRESETS` |
| L1232–1233 | siblings 1–2 |
| L1238 / L1290 | `BENCHMARKS` (dead description map) / `RATIONALE` |
| L1365 / L1383 | `LIQUIDITY_MAP` / `AMC_PREFIXES` |
| **L1434** | **`MASTER` — 7,672 baseline records** |
| L1435–1440 | `EQUITY_ANALYTICS` 1,203 · `HYBRID_ANALYTICS` 264 · `DEBT_ANALYTICS` 511 · `BONDS`/`PMS_HOLDINGS` (empty) · `CENTRICITY_SELECT` 178 |
| L1444 / L1448 | `MF_BENCHMARK_PERF` (47 sheets) / `DATA_DATES` |
| L1446–2895 | `window.H` helpers (H created L1898/L1907; credit helpers ~L2144–2201) |
| L2896–3142 | Config: risk profiles, strategies, live `BENCHMARKS` (L2926), `PMS_PERFORMANCE` (L2932), `PMS_PERF_ALIAS` (L2938) |
| L3143–3839 | `window.REFRESH` parsers |
| L3840–5079 | `window.EXPORTS` |
| L5082 | `<div id="root">` |
| L5083–5085 | siblings 3–5 |
| L5091–5094 | `RISK_MATRIX` (1,088), `DATA_DATES.riskMatrix`, `RISK_MATRIX_BENCH_SD` |
| L5096–9096 | UI components; `App` L8651; `createRoot` L9096; file ends `</body></html>` (L9097) |

Re-derive with `Grep -n` before citing. `blocklib.locate` uses the **first** occurrence of
`window.X = `, so each baseline literal must stay ahead of the runtime re-assignments later in the
file (MASTER is re-assigned by uploader/add-fund handlers at ~L3375, 3698, 3818, 8795, 8831).

## 4. Data model (summary — full detail in PRD §6)

- **MASTER** records: `name, asset_class, product_class, sub_category, irr_low/high, aum, r1m…r10y,
  si, expense, inception, fund_mgr, exit_load, mcap_*, ytm, avg_maturity, mod_duration, bond_*,
  prev_name?`. Direct Equity rows (5,380) are slim: sector, `sebi_mcap`, `mktcap`, ISIN, returns.
- **Scale conventions:** returns, IRR, expense, YTM, m-cap in MASTER are decimals; analytics weights
  are percent; Monitor returns are percent (÷100 always); AUM ₹ Cr.
- **Taxonomy:** Asset Class → Product Class → Sub-category. Index Fund is a *sub-category* of Mutual
  Fund; ETF its own class; `Mutual Funds` (plural) = Global/International feeders; SIF split into
  Equity SIF / Hybrid SIF; MLD is Debt.
- **Name identity:** the MF Monitor decides spellings; renames are folded before each bake and
  recorded in `prev_name`, which name resolution, the Reckoner and risk-matrix joins consult.

## 5. Business logic (where it lives)

| Logic | Helper | PRD |
|---|---|---|
| KPIs (weighted IRR band, 3Y/5Y) | `H.computeKPIs`, `H.effectiveReturn` | §8 |
| Regular ↔ Direct plan overlay, then user overrides | `H.applyPlanSelected` → `H.applyOverrides` (order matters) | §8 |
| Minimum tickets | `H.minInvestment`, `H.minInvBreaches` | §7.5 |
| Equity / debt look-through | `H.aggEquityScoped`, `H.aggDebtScoped` | §8 |
| Credit buckets (7 fixed, sums to 100%) | `H.creditBucket`, `H.fundRatingBuckets`, `H.normaliseRatings`, `H.CREDIT_COLORS` | §8 |
| Overlap matrix (symmetric Σmin) | `computeOverlap` | §8 |
| Tenure, liquidity, net allocation | `H.tenureFor`, liquidity map, `H.netAllocation` | §8 |
| Allocation upload name matching (tiered; ambiguous → reported) | `H.resolveFundName`, `H.buildFundIndex` | §7.6 |

All IRRs are pre-tax; no tax or fee computation (non-goal).

## 6. External dependencies

- Runtime: the five pinned CDN scripts. Nothing else is fetched; fonts are system fonts (Cambria);
  images are data URIs. The browser requests `/favicon.ico` (404 — no favicon; harmless).
- Tools: Node ≥ 18 (24.x used), `xlsx` 0.18.5 exactly (npm advisories accepted — trusted local
  inputs, must equal the in-page version). Optional: Python 3 + pandas/numpy/openpyxl/dateutil for
  `build_risk_matrix.py`; Microsoft PowerPoint (COM) for rendering market/closing slides.
- Hosting: GitHub Pages via Actions (`docs/DEPLOYMENT.md`).

## 7. Architectural debt (do not fix during data work; see `KNOWN_ISSUES.md`)

- Siblings 3–5 should eventually be folded into the embedded blocks (fewer deploy files).
- Dead code kept for parity: `PortfolioRollup`, `SharePanel_REMOVED`, the `false &&` Section 7 cards,
  the L1238 `BENCHMARKS` map, legacy `aggEquity`/`aggDebt`. `parseBonds` and `parseAnalytics` have no
  upload card (the rail shows three: MF Monitor, PMS/AIF holdings, SIF Monitor), but `parseAnalytics`
  is **not** dead: the tools run it offline, so never delete it (`KNOWN_ISSUES.md` C12).
- `index.html` is a 12.8 MB single file; tools depend on its literal shapes (e.g. MASTER on its own line).

> **About this copy (16-Oct-2026).** This is the outgoing owner's handover PRD, committed verbatim
> below this note (the original is kept unchanged in the local `handover-archive/`). It remains the
> product specification. Since the transfer, file **locations** differ from what it describes:
> the dashboard lives in `site/`, the tools in `tools/` (libraries in `tools/lib/`), docs in `docs/`;
> commands therefore read `node tools/<tool>.js …`, `node tools/verify_page.js site`, and the three
> tools without a default need `--html site/index.html`. Hosting is now GitHub Actions → Pages from
> `site/` in `productsteamcentricity/Centricity-Proposal-Playbook` (see `docs/DEPLOYMENT.md`), and
> the monthly inputs live in `monthly-updates/` (see `docs/MONTHLY_UPDATE_PROCESS.md`). Commit SHAs
> quoted below are the upstream ones; ours differ after the sanitised migration
> (`docs/REPLICATION_REPORT.md`). Where this document and the code disagree, the code wins.
>
> **Do not follow §4.2–§4.3, §5 steps 1–5 or the §16 prompts as written** — they are done.
> `.claude/serve.js`, `.claude/launch.json`, `package.json` and `package-lock.json` are tracked; set up
> with `npm ci` (`docs/DEVELOPMENT_SETUP.md`). The §4.3 server served the whole folder on all network
> interfaces; it must never replace the current one, which serves only `site/` on 127.0.0.1 (D66).
> Every mention of `CLAUDE.md` below (the operating manual, its *Traps*, owner facts, counts) now
> means `docs/OPERATING_MANUAL.md`; the root `CLAUDE.md` is a short index. Decisions taken since the
> handover (public hosting, automatic publishing of verified refreshes, branch → PR → merge) are
> D60–D69 in `docs/DECISIONS.md`. The in-force data dates are in `docs/PROJECT_STATE.md` (note: §11.3's
> "fund managers 31 Aug" is no longer true — the Sep bake replaced that roster).

# Centricity Proposal Playbook: Handover PRD

**For:** the incoming owner and their Claude Code session.
**From:** Rahul Yadav (outgoing owner).
**Date:** 14-Oct-2026.
**State:** Sep-2026 data cycle, up to and including the 14-Oct-2026 credit-rating fix. GitHub `main` is at commit `72e1f1e` ("Credit rating chart: full rating map, always sums to 100%"). All 46 tracked files on `main` are byte-identical to the outgoing owner's working folder.

This document is written so that **a Claude Code session with no prior context** can take the git repository zip, stand the dashboard up in a new repository, and run the monthly refresh. The result must be the *same* dashboard: same design, logic, data, uploads and outputs.

Every number here was re-measured from the live files on 14-Oct-2026. Where this document and the code ever disagree, **the code wins**.

---

## 0. Read this first (instructions to Claude Code)

1. Read this file end to end. Then read `CLAUDE.md`. `CLAUDE.md` is the detailed operating manual and trap catalogue (~80 KB). This PRD is the product spec plus the handover delta.
2. **Do not refactor, re-style, "modernise" or "fix" anything during the transfer.** The goal is parity. Several things that look like bugs are deliberate. Examples:
   - `product_class: "Mutual Funds"` (plural) is intentional.
   - The hand-animated nav scroll is intentional.
   - `FOF` in all caps in some names is intentional.
   - The 12 legacy SIF rows are intentionally left unclassified.

   `CLAUDE.md` → *Traps* explains each one.
3. `index.html` is 12.8 MB, and some of its lines are several MB long. **Never `Read` the whole file.** Never run a regex over the data lines in PowerShell. Use `Grep -o`, `Read` with offset/limit, or Node `fs` with index arithmetic.
4. Every data tool is **dry-run by default**. Read the gate output before adding `--apply`. Back up before any write: `index.html.bak_<tag>_<yyyymmdd>`.
5. Verify claims against the live files, not against documents. That includes this one.
6. Complete §15, the parity checklist, before declaring the transfer done.

---

## 1. Product summary

### What it is

**Centricity Investment Proposal Dashboard**, also called the "Proposal Playbook". It is an internal tool the Centricity Products team uses to build forward-looking investment proposals for HNI, UHNI and Family Office clients.

A user does the following:
1. Sets a corpus and a risk profile.
2. Picks instruments from a universe of about 7,682 instruments: MF, Index, ETF, PMS, AIF, SIF, Bonds, MLD, FD, REIT/InvIT, GIFT City, Offshore, Listed and Unlisted Direct Equity.
3. Allocates the corpus to 100%.
4. Reviews the live analytics.
5. Exports a branded **PowerPoint deck** and an **Excel workbook**.

### Users

- **Everyday users:** Products-team members building proposals. Nothing they do is persisted or shared. Every page load starts from the same embedded baseline.
- **Admin, one person (the incoming owner):** refreshes the base data monthly using the Node tools in the repo, then deploys.

### Hard properties to preserve

| Property | Detail |
|---|---|
| No backend, no database, no build step | It is a static site. The data is embedded in `<script>` blocks. |
| Client-side exports only | SheetJS (Excel) and PptxGenJS (PowerPoint), loaded from CDNs. |
| No persistence | No localStorage, sessionStorage, IndexedDB or cookies. Uploads and edits last for the browser session only. |
| Light theme only | There is no dark mode. |
| Desktop-first | `<meta name="viewport" content="width=1280">`. |
| Light, glassy, black-gold Centricity brand | Cambria serif throughout. See §10. |

### Non-goals

- No tax or fee computation. All IRRs are labelled **pre-tax**. Expense ratio is displayed only.
- No user accounts.
- No saving proposals server-side. The Allocation Sheet download/upload is the round-trip mechanism.

### Related, but separate projects (do not confuse)

- **Portfolio Review**: a sister dashboard that reviews *existing* holdings. Its build prompt `Portfolio_Review_Build_Prompt.md` is in this repo. It shares the analytics, AMC and overlap engine, so a refresh here should prompt a check there.
- **Centricity MF Screener**: a different repo with no shared code. Its issue catalogue (the `centricity-dashboard-issues` skill) does **not** apply here.

### 1.1 Change log up to handover (newest first, from `git log` on `main`)

| Date | Commit | Change |
|---|---|---|
| 14-Oct-2026 | `72e1f1e` | **Credit rating chart reads the full per-fund rating map** (`rating` / `db_rating`), not the top-20 holdings, and is renormalised to exactly 100%. Fixed colour per bucket (`H.CREDIT_COLORS`), used on screen and in the PPT. The legend shows each bucket's %. Short-term grades `A1`–`A4` (with `(SO)` etc. stripped) now land in AA & Below. See §8. |
| 14-Oct-2026 | `261cd07` | Listed Direct Equity returns as on 30 Sep 2026. Header row found by `Company Name`. The tool refuses to run if any return column is wholly empty. |
| 13-Oct-2026 | `140257c` | Market Update: the re-issued Oct-2026 deck with the September outlook. 6 slides; baked-in logos and slide numbers deleted. |
| 13-Oct-2026 | `828d51e` | SIF returns: Monitor percents are always divided by 100. Sep-2026 risk matrix. |
| 13-Oct-2026 | `489ee33` | Sep-2026 data refresh: monitor, analytics, DE universe, TER/exit load, SIF, market slides. |
| 28-Sep-2026 | `b00cb2d`, `ac4347b` | Centricity Select from the Sep-2026 Reckoner. PMS + AIF performance as on 31 Aug. |
| 18-Sep-2026 | `8e49d3a` | Portfolio Matrix as on 31 Aug. |
| 17-Sep-2026 | `1ce60e9` | Aug-2026 refresh. SIF Monitor baked into the sibling. |
| 08-Sep-2026 | `d1eaa04` | Overlap matrix made symmetric; non-stock rows excluded. |
| 03-Sep-2026 | `bc76e4c`, `2f74506`, `7be34c7` | Fixed credit-rating vocabulary; Others split from Unrated. PMS sheet found by header. |
| 27-Aug-2026 | `ac8bde2` | Taxonomy filter fixed for names containing "/". |
| 25-Aug-2026 | `6a95017`, `1260ce6`, `c2b9ad1`, `b1ba035` | New closing slides, logo on every slide. MLD into debt analytics. SIF split into Equity/Hybrid. Index Fund became a sub-category. |

The earlier history (May–Aug 2026) is in `CLAUDE.md` and in `git log`.

---

## 2. What is in the zip, and what is NOT

The zip is the git repo, so it contains only the **46 tracked files**. The `.gitignore` deliberately excludes several things the project needs. Recreate them as described below.

### 2.1 Tracked files in the zip (46)

| Group | Files |
|---|---|
| **Deploy set (6, ship together)** | `index.html`, `Centricity_ExtraSlides.js`, `Centricity_PMS_AIF_Terms.js`, `Centricity_June_Refresh.js`, `Centricity_IRR_Offshore.js`, `Centricity_SIF_Refresh.js` |
| Site extras | `robots.txt` (Disallow all), `.gitignore` |
| Docs | `CLAUDE.md`, `README.md` (**stale, do not follow it**), `*_Prompt.md` runbooks and build specs, `HANDOVER_PRD.md` (this file, once committed) |
| Monthly tools (Node) | `rename_schemes.js`, `bake_month.js`, `fill_variant_analytics.js`, `rekey_sif_analytics.js`, `merge_*.js` (15 scripts), `pin_pms_alias.js`, `add_reckoner_funds.js`, `fold_duplicate_names.js`, `rebuild_directperf.js`, `update_market_slides.js`, `update_closing_slides.js`, `verify_page.js` |
| One-off / idempotent tools | `fold_index_funds.js`, `split_sif_add_mld.js` |
| Libraries | `blocklib.js` (brace-matching block splicer, required by most tools), `pptx.js`, `reck_parse.js`, `reck_narrative.js` (zero-dependency .pptx readers) |
| Python (optional) | `build_risk_matrix.py` (the canonical RISK_MATRIX derivation; needs pandas, numpy and openpyxl) |
| Unused artefact | `Centricity_Risk_Matrix.js`. It is tracked but **not loaded**: its content is baked inline. Do not add a `<script>` tag for it. |

### 2.2 NOT in the zip: recreate these

| Missing item | Why it matters | Action |
|---|---|---|
| `.claude/serve.js` | The local static server used for preview. | Create it from §4.3. |
| `.claude/launch.json` | Claude Code preview config ("playbook"). | Create it from §4.3. |
| `package.json` / `node_modules/` | The tools need `xlsx@0.18.5`. | `npm install xlsx@0.18.5` |
| All `.xlsx` / `.pptx` source files | Monthly inputs. They are never committed because they are sensitive. | The new owner receives them each month (§11.1). |
| `Centricity_Dashboard_PRD.docx` | Older PRD (30-Jul-2026). It is superseded by this file plus `CLAUDE.md`. | Not needed. |
| `*.bak_*` rollback snapshots (~49) | Local history only. | Not needed. Start your own. |
| Claude memory notes | Outgoing owner's per-machine notes. | Their content is folded into §12 below. |
| `Centricity_Dashboard.html` | Deprecated predecessor. | Not needed. |

### 2.3 Integrity check: is my zip the exact production build?

The git blob hashes are line-ending agnostic. Run `git hash-object <file>` and compare against this table:

| File | git blob SHA-1 (`git hash-object`) | SHA-256 of the LF bytes |
|---|---|---|
| `index.html` | `60106a8e04942f782b3095e6efa2ed082fee2592` | `5872958ddacd728b7ff6850e48a87fb8834b553a0b4aaca50a7698e2e49e2892` |
| `Centricity_ExtraSlides.js` | `b649397745dc57967a206b432e75e2d271ad66a7` | `777f975bc796e30aa897931d3525949bbaebe4d8222747a9e113ef12e89dba2b` |
| `Centricity_PMS_AIF_Terms.js` | `6636bbed4fc5ebf42f48ea4e780053c337c4e2f8` | `8ed1c0df3ed34a6b2c2c802b6ac72a7fc46600a5d3a77a70bb4b4217bfb1688a` |
| `Centricity_June_Refresh.js` | `a918b32f0de43a3350b4696e4feb68fee072acf3` | `0cf078943cf9204c5e90c4ea37498f1140bce144ed0fd42e43d0c4738d3ac9d8` |
| `Centricity_IRR_Offshore.js` | `e2272de2a8a340ae7c7a6fd29de9d597f1752f84` | `2aaeb57c1d51d3d31ee5dcd776a631f7d2e96c407568695f8dfa4518e4667601` |
| `Centricity_SIF_Refresh.js` | `d65f9fee8fcd9ba0c9bdcbcc5c3952ed201817ad` | `cb11764f40d36309fab0580950de2feb194017268f2b867b731dc73c10229f3f` |

The production files are **LF**-terminated. If Git for Windows checks them out with `autocrlf=true`, the SHA-256 changes but the blob SHA does not. Prefer to keep LF:

```
# .gitattributes (recommended)
* text=auto eol=lf
```

---

## 3. Architecture

### 3.1 Shape

- `index.html` is 12,827,311 bytes and 9,097 lines, ending in `</body></html>`.
- It is a React 18 app with **no JSX at runtime**. The UI was Babel-precompiled to `React.createElement(...)`. There is no Babel in the page and no build step. Edit the compiled JS directly, matching the surrounding style.
- All reference data lives in `window.*` globals, defined in inline `<script>` blocks.
- Five sibling `.js` files mutate those globals at load time.

### 3.2 CDN dependencies (exact, do not change versions)

```html
<script src="https://unpkg.com/react@18.3.1/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js" crossorigin></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/dist/pptxgen.bundle.js"></script>
```

A custom Chart.js plugin, `H.dataLabelPlugin`, is registered globally. It draws "x.xx%" on bars, and on doughnut slices of 4% or more.

### 3.3 The six-file deploy and its load order (the rule that breaks production)

Deploying `index.html` alone **silently reverts** the data. There is no error, only stale numbers.

| # | Where loaded | File | Effect |
|---|---|---|---|
| 1 | `<head>`, L1232 | `Centricity_ExtraSlides.js` | `EXTRA_SLIDES`: 3 dividers, 6 market slides, disclaimer, thank-you (JPEG/PNG data URIs, 2001×1125). |
| 2 | `<head>`, L1233 | `Centricity_PMS_AIF_Terms.js` | `PMS_AIF_TERMS` (73 entries: exit load and IRR band for new PMS/AIF). |
| 3 | after `#root`, L5083 | `Centricity_June_Refresh.js` | **Replaces the whole GIFT City bucket.** Also re-assigns 12 PMS/AIF `EQUITY_ANALYTICS` entries. |
| 4 | L5084 | `Centricity_IRR_Offshore.js` | Applies `irr_low`/`irr_high` to about 2,065 funds by exact name. Moves 4 funds to `Offshore Funds`. Adds RATIONALE, BENCHMARKS and LIQUIDITY_MAP entries. **Must load after #3.** |
| 5 | L5085 | `Centricity_SIF_Refresh.js` | Deletes every `/SIF$/` row and appends its own 30 (Equity SIF 16, Hybrid SIF 14). Sets `DATA_DATES.sif`. Registers `REFRESH.parseSif`. **Must load after #4.** |

Each sibling is idempotent-guarded (`window.__JUNE_REFRESH_APPLIED` and similar) and re-applies on every load. Folding them into the embedded blocks is the standing intent and is still outstanding (§14).

### 3.4 Line map of `index.html` (14-Oct-2026)

These line numbers drift with every edit. **Re-derive them with `Grep -n`.** The line numbers in `CLAUDE.md` are older (July) and are now off by about 400–900 lines.

| Lines | Block |
|---|---|
| L4–L1222 | CSS (base, then the liquid-glass layer from about L845) |
| L1224–1228 | CDN scripts |
| L1229 | `CENTRICITY_LOGO` (base64 PNG) |
| L1230 | `DIRECT_PERF` (1,689 keys) |
| L1231 | `LOGO_PRESETS` {Invictus, OneDigital} |
| L1232–1233 | siblings 1–2 |
| L1238 / L1290 | `BENCHMARKS` (dead description map) / `RATIONALE` |
| L1365–1425 | `LIQUIDITY_MAP`, `AMC_PREFIXES` |
| **L1434** | **`MASTER`: 7,672 baseline records** |
| L1435–1437 | `EQUITY_ANALYTICS` 1,203, `HYBRID_ANALYTICS` 264, `DEBT_ANALYTICS` 511 |
| L1440 | `CENTRICITY_SELECT` (178) |
| L1444 | `MF_BENCHMARK_PERF` (47 sheets) |
| L1448 | `DATA_DATES` |
| L1446–2895 | `window.H` helpers. `H` is created at L1898/L1907. The credit helpers `creditBucket`, `fundRatingBuckets`, `normaliseRatings` and `CREDIT_COLORS` are at about L2140–2204. |
| L2896–3142 | Config: risk profiles, strategies, `BENCHMARKS` array map (about L2926, the live one), `PMS_PERFORMANCE` (L2932), `PMS_PERF_ALIAS`, benchmark mapping |
| L3143–3839 | `window.REFRESH` in-browser parsers (`REFRESH` is assigned at L3837) |
| L3840–5079 | `window.EXPORTS` (Excel and PowerPoint; assigned at L5077) |
| L5082 | `<div id="root">` |
| L5083–5085 | siblings 3–5 |
| L5091–5094 | `RISK_MATRIX` (1,088), `DATA_DATES.riskMatrix`, `RISK_MATRIX_BENCH_SD` |
| L5096–9096 | UI components. `App` is at L8651. `createRoot` is at L9096. |

`window.MASTER` is also assigned inside runtime handlers (the uploaders, add-fund and add-bond). Only L1434 is the baseline.

---

## 4. Environment setup for the new owner

### 4.1 Machine

| Need | Version / note |
|---|---|
| Node.js | ≥ 18. The outgoing owner used v24.18. |
| Git | Any recent version. Git for Windows' credential manager is fine. The `gh` CLI is optional. |
| `xlsx` npm package | **0.18.5 exactly.** It must match the in-page SheetJS so that bakes equal uploads. |
| Microsoft PowerPoint (Windows) | Needed only to render the Market Update, Disclaimer and Thank-You slides to images (COM automation, §11.6). On a Mac, export the slides at 2001×1125 by another route. The tools only gate on size. |
| Python 3 + pandas, numpy, openpyxl | **Optional.** Only for `build_risk_matrix.py`, the canonical risk-matrix route. The Node route (`merge_risk_matrix.js`) covers everything the UI renders. |
| Internet | The page needs the 5 CDN libraries. |

### 4.2 First-time setup

```bash
unzip Centricity-Proposal-Playbook.zip -d centricity-playbook
cd centricity-playbook
npm init -y
npm install xlsx@0.18.5
mkdir .claude
# create .claude/serve.js and .claude/launch.json from §4.3
node .claude/serve.js        # → http://localhost:8080
node verify_page.js .        # must print the §15 numbers
```

### 4.3 Files to recreate verbatim

**`.claude/serve.js`**

```js
// Minimal static file server for local preview of the Centricity Proposal Playbook.
// Serves the project folder so index.html + its five sibling .js files load over http://
// (file:// works for scripts but breaks fetch/XHR and some export paths).
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PORT = Number(process.env.PORT) || 8080;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
};

http.createServer((req, res) => {
  let rel = decodeURIComponent(req.url.split('?')[0]);
  if (rel === '/') rel = '/index.html';

  const file = path.join(ROOT, rel);
  // never serve outside the project folder
  if (!file.startsWith(ROOT)) {
    res.writeHead(403).end('Forbidden');
    return;
  }

  fs.stat(file, (err, st) => {
    if (err || !st.isFile()) {
      console.log(`404 ${rel}`);
      res.writeHead(404, { 'Content-Type': 'text/plain' }).end('Not found: ' + rel);
      return;
    }
    res.writeHead(200, {
      'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream',
      'Content-Length': st.size,
      'Cache-Control': 'no-store',
    });
    fs.createReadStream(file).pipe(res);
    console.log(`200 ${rel} (${(st.size / 1024).toFixed(0)} KB)`);
  });
}).listen(PORT, () => {
  console.log(`Centricity Proposal Playbook serving ${ROOT}`);
  console.log(`http://localhost:${PORT}/`);
});
```

**`.claude/launch.json`**

```json
{
  "version": "0.0.1",
  "configurations": [
    { "name": "playbook", "runtimeExecutable": "node", "runtimeArgs": [".claude/serve.js"], "port": 8080 }
  ]
}
```

**`package.json`** (keep it untracked, as before, or commit it; either is fine)

```json
{ "dependencies": { "xlsx": "0.18.5" } }
```

---

## 5. New repository and hosting

The current production site is **GitHub Pages**, served from branch `main`, root folder, of `magazineishita1108-boop/Centricity-Proposal-Playbook`. The site path is `https://magazineishita1108-boop.github.io/Centricity-Proposal-Playbook/`, and it currently returns HTTP 200.

### Steps to stand up the new home

1. Create the new GitHub repo and push the unzipped files, plus this PRD and an optional `.gitattributes`. Keep the existing `.gitignore` **unchanged**. It is what keeps the workbooks, backups and `.claude/` out of git.
2. In the new repo, go to Settings → Pages → *Deploy from a branch* → `main` / `(root)`.
3. Open the Pages URL and run the §15 checks against it.
4. **Decide visibility deliberately.**
   - The old repo is **public**. That was the outgoing owner's choice. It means the whole fund universe, Centricity Select rationales, PMS/AIF terms and house IRR bands are world-readable. `robots.txt` stops search engines but does nothing about GitHub itself.
   - A private repo with Pages needs a paid GitHub plan (Pro/Team/Enterprise). Alternatively, host the six files on any internal static host.
   - Record the decision in `CLAUDE.md`.
5. Update the owner-specific facts in `CLAUDE.md`:
   - the owner name and email (currently Rahul Yadav),
   - the repo URL (section *Deploying to GitHub*),
   - the monthly source-folder path (section *Monthly source files*),
   - and whatever the new owner decides about visibility.
6. After the cut-over, retire or archive the old repo and Pages site **in coordination with the outgoing owner**, so that two live copies do not drift.

### 5.1 How a deploy works (unchanged)

- The project folder is **not** a git working copy on the outgoing owner's machine. That owner cloned `main` to a temp folder, copied the tracked files over it, checked `git diff --stat`, then committed and pushed.
- The new owner can simply work inside a normal clone instead. That is simpler, and recommended.
- **Always commit all six deploy files together** with the tools you changed.
- `git status` may show every file modified because of CRLF noise. Trust `git diff --stat`.

---

## 6. Data model

### 6.1 `window.*` data globals

| Global | Size (baseline → effective) | Shape |
|---|---|---|
| `MASTER` | 7,672 → **7,682** | `[{name, asset_class, product_class, sub_category, irr_low, irr_high, aum, mtd, r1m, r3m, r6m, r1y, r2y, r3y, r5y, r10y, si, expense, inception (ISO), fund_mgr, exit_load, mcap_large/mid/small/other, ytm, avg_maturity, mod_duration, bond_issuer, bond_rating, prev_name?, sif_raw?, sif_amc?, …}]` |
| `MASTER` Direct Equity rows (5,380) | — | slim: `{name, asset_class:"Equity", product_class:"Direct Equity", sub_category:<sector>, sebi_mcap, mktcap, isin, r3m, r6m, r1y, r2y, r3y, r5y}`, with no IRR |
| `EQUITY_ANALYTICS` | 1,203 → 1,205 | `{name: {mcap:{Large,Mid,Small,Others}, sector:{s:%}, stocks:[{name,pct}], total}}` |
| `HYBRID_ANALYTICS` | 264 | `{eq_mcap, eq_sector, eq_stocks, eq_total, db_sector, db_holdings:[{issuer,rating,pct}], db_rating, db_total}` |
| `DEBT_ANALYTICS` | 511 | `{sector:{}, holdings:[{issuer,rating,pct}] (top 20), rating:{}}` |
| `DIRECT_PERF` | 1,689 | keyed by the **Regular** name: `{mtd…si, expense, mcap_*, aum, ytm, avg_maturity, mod_duration}` |
| `CENTRICITY_SELECT` | 178 (mf 123, pms 23, aif 24, unlisted 4, gift 4) | `{reckonerName, category, sheet, kind, rationale, alpha?, beta?, sharpe?, sortino?, stdDev?, benchmark?, details?:[{label,value}]}` |
| `MF_BENCHMARK_PERF` | 47 sheets | `{sheet: [{name, mtd, r1m … r10y}]}` |
| `PMS_PERFORMANCE` | pms 692, aif 12, benchmarks 4 | per-scheme returns and risk stats |
| `PMS_PERF_ALIAS` | 27 (4 null) | MASTER name → PMS performance name. `null` blocks a match. |
| `RISK_MATRIX` | 1,088 (966 with metrics, 433 with `rr`) | `{be, sd, al, so, sh, co, ir, dc, rr, bm}` |
| `PMS_AIF_TERMS` | 73 | `{name: [exit_load, irr_low, irr_high]}` |
| `EXTRA_SLIDES` | 6 keys, 11 images | `{marketDivider, portfolioDivider, annexureDivider, market:[6], disclaimer, thankyou}` |
| `DATA_DATES` | 5 keys | performance, analytics, sif, pms, riskMatrix |
| Config | — | `RISK_PROFILES`, `STRATEGY_OPTIONS`, `DEFAULT_STRATEGIES`, `RATIONALE`, `BENCHMARKS`, `LIQUIDITY_MAP`, `AMC_PREFIXES`, `MF_BM_FOR_SUB`, `MF_BM_PREFERRED`, `PMS_BM_FOR_SUB`, `PMS_BENCHMARK_PERF` |
| Namespaces | — | `H` (helpers), `REFRESH` (parsers), `EXPORTS` |

**Scale conventions.** These matter.
- In MASTER, returns, IRR, expense, YTM and m-cap are **decimals**: 0.12 means 12%.
- In the analytics stores, weights are **percent**.
- In the MF and SIF Monitors, every return is **percent**, always. Divide by 100 and never auto-detect. `0.90` means 0.90%.
- AUM is in ₹ Cr.

### 6.2 Taxonomy (effective universe, 7,682)

The tree is Asset Class → Product Class → Sub-category.
- `AC_ORDER = [Equity, Hybrid, Debt, Commodity, Global Funds, REIT/InvIT]`
- `PC_ORDER = [Mutual Fund, Mutual Funds, ETF, PMS, AIF, Equity SIF, Hybrid SIF, GIFT City, Direct Equity, Unlisted Equity, Bonds, MLD, Fixed Deposit, REIT/InvIT]`. Unknown values such as `Offshore Funds` sort last.

Effective counts:
- Direct Equity 5,380
- Mutual Fund 1,770 (543 of them are `sub_category: "Index Fund"`)
- ETF 259
- Mutual Funds (international feeders) 67
- GIFT City 54
- Bonds 50 (Invictus 36, OneDigital 14)
- AIF 28
- PMS 27
- Equity SIF 16
- Hybrid SIF 14
- Fixed Deposit 6
- Unlisted Equity 5
- Offshore Funds 4
- MLD 1
- REIT/InvIT 1

Key invariants:
- **Index Fund is a sub-category of Mutual Fund**, not a product class.
- **ETF is its own product class.**
- **`Mutual Funds` (plural) = Global Funds / International**, and it is deliberate.
- **SIF is split into `Equity SIF` / `Hybrid SIF`.**
- **MLD is a Debt product class.**
- **0 duplicate names.** Keep it that way.

---

## 7. Functional specification (UI)

The page has a sticky black-to-gold header, then a three-column layout:
- a **left rail** (Section 7, Data Refresh; collapsible),
- the **main column** (Sections 1–6, then the Master Editor),
- a **right jump-nav** (`SectionNav`).

`SectionCard` renders `div.section-shell#sec-<n>` > `.section-card` > `.section-head` (`.num` gold square, `.title` uppercase, `.desc` tan italic) + `.section-body`.

### 7.1 Header

- `h1` "Centricity Investment Proposal Dashboard". It is uppercase, 22px, letter-spacing .05em.
- Sub-title "Products Team · HNI / UHNI / Family Office".
- **Logo switcher**:
  - Options: `Centricity` | `Invictus` | `OneDigital` | "Custom (uploaded)" (upload any image).
  - The logo shows top-right of the header (44px high).
  - It is mirrored to `window.__SELECTED_LOGO`, which **every PPT slide** is stamped with.
- Footer: "Performance as on {DATA_DATES.performance} & Analytics as on {DATA_DATES.analytics}".

### 7.2 Section titles (exact)

| id | Nav label | Title | Description |
|---|---|---|---|
| sec-1 | 1 Corpus & Allocation | Corpus & Allocation Summary | Total corpus drives every downstream amount. |
| sec-2 | 2 Risk Profile | Risk Profile | Equity caps include Global. Cap enforced against overall portfolio. |
| sec-3 | 3 Pick Funds | Pick Funds | `Universe — {n} instruments.` (reads 7682) |
| sec-4 | 4 Selected Funds | Selected Funds & Allocation | "✓ Ready to export", or "X.XX% allocated" |
| sec-5 | 5 Future Value | Expected Future Value | Compounds the weighted IRR over your chosen tenure. |
| sec-6 | 6 Live Output | Live Output | Switch tabs to view each output. Updates in real time as you change allocations. |
| sec-master | M Master Data | `<details>` "Section 6 · Master Data Editor" | (the label says "Section 6"; keep it as is) |

Nav behaviour:
- Active-section tracking uses IntersectionObserver.
- Clicking scrolls with a **hand-animated** ease-in-out over `min(620, 240+|dist|·0.32)` ms, offset by the measured header height + 12. It has a `document.hidden` short-circuit and a `setTimeout` safety net.
- Do **not** replace this with `scrollIntoView({behavior:"smooth"})`.

### 7.3 Section 1: Corpus & Allocation Summary

Five KPI tiles:

1. **Total Corpus**
   - Default **5.00 Cr**.
   - A "₹ Cr / ₹ Lakhs" toggle. The value is stored in Cr; Lakhs = Cr × 100.
   - The input commits on blur or Enter.
   - **A corpus change preserves rupee amounts**: every pct is scaled by old/new corpus.
2. **Live Corpus Allocated**
   - Shows ₹ and %.
   - The tile is green at 100% (±0.005) and amber when over 100%.
3. **Weighted IRR (Range)**: shows lo – hi, plus the mid-point.
4. **Weighted 3Y Return**
5. **Weighted 5Y Return**

### 7.4 Section 2: Risk Profile

Five tiles. Each profile is an **equity band** (equity includes Global Funds):

| Profile | Equity band |
|---|---|
| Conservative | 0–20% |
| Moderately Conservative | 20–40% |
| **Balanced (default)** | 40–60% |
| Moderately Aggressive | 60–80% |
| Aggressive | 80–100% |

- A bar shows the band, the current equity %, and a marker.
- The status is `ok`, `under` or `over`, with an exact message, e.g. "Equity exposure X% exceeds {name} cap of {max}%. Trim Y% of equity or upgrade the risk profile."
- It is **advisory only** and does not block export.
- `Centricity_Asset_Allocation_by_Risk_Profile.xlsx` (not in the repo) is *not* wired into the code.

### 7.5 Section 3: Pick Funds

**Layout:** a 280px tree plus the fund list, 440px high.

**Tree**
- Shows counts per node and a "Search taxonomy…" box (200 ms debounce).
- `TreeNode` hands `onSelect` the real ancestor names array. **Never rebuild the filter by splitting the path on "/".** `REIT/InvIT` and `Value / Contra` contain slashes.

**List**
- "Search funds by name…" box.
- A "Filter: AC › PC › SC" line with a Clear button.
- **Centricity Select funds float to the top of each group.**
- At most 200 rows are rendered, with a "narrow your filter" note beyond that.

**Row contents**
- Name.
- Gold **★ Centricity Select** chip. It opens a popover:
  - MF funds: Sharpe, Sortino, Beta, Std Dev and Alpha tiles, plus the benchmark.
  - PMS / AIF / unlisted / GIFT: a details grid.
  - Then "Shortlisting Parameters" (the rationale).
- A "Min ₹50 L / ₹1 Cr / ₹5 Cr" pill.
- An `AC › sub-category` tag.
- Pills: IRR band, 1Y, 3Y, 5Y and AUM. For Direct Equity the pills are mcap bucket, M-Cap and returns. Negative values are red.
- Button: `+ Add`, `✓ Added`, or a disabled `Corpus too small`.

**Minimum tickets** (`H.minInvestment`, in ₹ Cr):

| Rule | Minimum |
|---|---|
| AIF named "Campus Fund" | 5 |
| PMS named "Neo … Yield Enhancer" | 1 |
| Any other PMS | 0.50 |
| Any other AIF | 1 |
| Everything else | 0 |

These minimums are enforced at add time, in the stepper, in the table and at the export gate.

**Adding a fund**
- The initial pct is `min(remaining>0 ? remaining : 5, 5)`, raised to the minimum if needed.
- The strategy comes from `DEFAULT_STRATEGIES`.

**Bonds sub-view.** The tabs are "Browse Bonds", "Added Bonds (n)" and "+ Add Bond Option".
- The add form takes Name, Maturity, Yield % and Rating.
- It creates a `Bonds / Added Bonds` record with irr = r1y = r3y = r5y = yield.

**Add Fund form** ("Add Fund — add an instrument that is not in the universe")
- Fields: Name, Asset Class, Product Class, Category, IRR Low/High, Tenure and Exit Load.
- If only one IRR bound is given it is copied to the other; low > high is swapped.
- Returns are null, so the IRR mid-point fallback applies.

### 7.6 Section 4: Selected Funds & Allocation

**Columns**
- Instrument
- Asset / Sub-Cat
- **% Allocation**: a stepper with ±0.5 steps, clamped to [minPct, 100].
- **Amount** (Cr or L): editable. It back-computes the %.
- **IRR Range**: two `PctInput` fields, stored on the selection entry.
- **Strategy**: one of `Lump Sum`, `STP Route`, `STP + SIP`, `SIP`, `As per Drawdown`, `Hold-to-Maturity`.
- **1Y / 3Y / 5Y**: editable overrides `r1yOv` / `r3yOv` / `r5yOv`, stored **on the selection entry, never on MASTER**.
- ⇄ Switch and ✕ remove.

**Behaviour**
- Rows are ordered AC → PC → sub-category.
- A GRAND TOTAL row closes the table.

**Default strategies**

| Product class | Default |
|---|---|
| MF / Index | STP + SIP |
| ETF | Lump Sum |
| PMS | STP Route |
| AIF | As per Drawdown |
| SIF (all) | Lump Sum |
| MLD | Hold-to-Maturity |
| GIFT City | Lump Sum |
| Unlisted Equity | Lump Sum |
| Bonds / FD | Hold-to-Maturity |
| REIT/InvIT | Lump Sum |
| Anything else | Lump Sum |

**Switch popover**
- Lists same AC/PC/sub-category alternatives, with search.
- Switching preserves the %. IRR and return overrides are dropped.

**Download bar**
- Buttons: `⬇ Excel Proposal`, `⬇ PowerPoint`, `⬇ Master Data`, `⬇ Allocation Sheet`, `⬆ Upload Allocation`, `Clear All`.
- **Export gate:** |total − 100| < 0.005 AND at least one fund AND no minimum-ticket breaches. Otherwise the bar shows an exact ⚠ message.

**Allocation Sheet round-trip**
- Download: `Centricity_Allocation.xlsx`, sheet "Allocation", columns `Asset Class | Product Class | Instrument Name | % Total | Amount (Cr.)`, plus a TOTAL row.
- Upload:
  - Takes any column order.
  - Derives % from the amount when there is no % column.
  - If Σ ≤ 1.5 the values are treated as fractions and rescaled.
  - Names resolve through `H.resolveFundName`. The tiers are: exact → case/space → plan-suffix stripped → unique prefix → token containment + Dice ≥ 0.75 with a ≥ 0.05 margin. Ambiguous names are *reported, never picked*.
  - `prev_name` aliases are indexed in a second pass.
  - The upload **replaces** the selection.
  - Every substitution and miss is listed in the status line. This tool allocates real money, so substitutions must stay visible.

**Dead code.** `PortfolioRollup` (about L5935) is defined but never rendered. Leave it.

### 7.7 Section 5: Expected Future Value

- Tenure stepper, 1–40 years, default 5.
- Tiles: Expected Pre-Tax Return (= weighted IRR mid), Initial Corpus, Expected Future Value (+ growth).
- A year-by-year table for years 1…min(tenure, 10).

### 7.8 Section 6: Live Output (tabs)

**Tab band**
- The active tab's description.
- `⬇ Download slide`: a single-tab PPT.
- **`PlanToggle` "Performance plan: Regular | Direct"**. This is where the Regular/Direct toggle lives, not in the header.

| id | Label | Content |
|---|---|---|
| proposal | Investment Proposal | Hierarchical table (AC → sub → fund): Amount (₹ Cr), %, IRR, 1Y/3Y/5Y, Strategy, Expense, Tenure, Exit Load. Fallback returns are gold italic with "*". |
| rationale | Category Rationale | A card per AC: `RATIONALE[sub_category]` plus the fund list. |
| perf | Performance Sheet | Buckets: Equity MF, Hybrid MF, Debt MF, PMS, AIF, **Listed Direct Equity**, Other. Grouped gold header (Absolute / CAGR / M-Cap or Debt Stats). MF and PMS benchmark rows. A "Portfolio Weighted (by % allocation)" row. |
| matrix | Portfolio Matrix | `RISK_MATRIX` columns: 3Y Rolling, Beta, Std Dev, Alpha, Sortino, Sharpe, Correl., Info Ratio, Down Capt. Plus a PORTFOLIO AVERAGE row (rf 4.5%). |
| equity | Equity Analytics | Fund picker (include/exclude by group or chip; analytics only, not the proposal). Market-cap bar chart, Top 10 Sectors, Top 20 Stocks. Lists the skipped no-holdings funds. |
| debt | Debt Analytics | Fund picker. Sectors bar chart. Credit Rating doughnut (7 fixed buckets, fixed colours, always 100%, % shown in the legend). Top 20 Issuers. |
| amc | AMC & Liquidity | AMC bar chart (MF/Index/ETF only, top 12). Liquidity doughnut. Liquidity detail table. |
| overlap | Overlap Matrix | Navy panel. AC filter chips. "Pairs ≥" slider (0–50%). Eligible-fund checkboxes. Banded cells. "⬇ Download Overlap as PNG". |
| netalloc | Net Asset Allocation | Net Equity / Net Debt / Commodity cards. Stacked bar. Breakdown table. Hybrids split by their analytics equity holding. |

### 7.9 Section 7: Data Refresh (left rail)

Three cards. The changes they make are **session-only**.

| Card | Controls | Parser |
|---|---|---|
| MF Monitor (Performance), every 15 days | Regular/Direct segment, "As on date" picker, xlsx drop zone | `REFRESH.parseMfMonitor(file,{asOn})` / `parseMfMonitorDirect` |
| Add PMS / AIF Holdings, as needed | PMS/AIF segment, SOA xlsx drop zone, "↓ Download blank template" (`PMS_AIF_Holdings_Template.xlsx`) | `REFRESH.parsePMSHoldings(file,{productClass})` |
| SIF Monitor (Performance), monthly | "As on date" picker, xlsx drop zone | `REFRESH.parseSif` (from the SIF sibling) |

- `parseAnalytics` and `parseBonds` exist but have no card.
- **As-on precedence:** picker → file name → in-file date.
- Every successful upload re-renders through `setMaster(window.MASTER.slice())`.
- The two in-flow Section 7 cards in the App tree are behind `false &&`. They are dead.

### 7.10 Master Editor

- `<details>`, closed by default.
- Search across name, AC, PC, sub-category and fund manager. AC and PC filter selects.
- Shows up to 500 rows.
- Editable: IRR Low/High, 1Y/3Y/5Y, AUM, Expense, Exit Load.
- Edits change React state only; `window.MASTER` is not written.
- It is hidden in shared view.

### 7.11 Shared / frozen view (decode only)

- A URL hash `#p=<base64url JSON {c,u,r,s:[{n,p,st}]}>` opens a read-only "SHARED VIEW".
- In that view there is a gold banner, the Data Refresh rail is frozen, and the Master Editor is hidden.
- *Generating* links was removed (`SharePanel_REMOVED`, never rendered). Only the decoder is live.

---

## 8. Business logic and formulas (as implemented)

**Units**
- Amount = corpus(Cr) × pct / 100.
- Lakhs = Cr × 100.

**KPIs** (`H.computeKPIs`)
- IRR lo/hi = Σ(irr × pct) / Σpct. Missing IRR counts as 0 and is **not** renormalised.
- Mid = (lo + hi) / 2.
- 3Y and 5Y are weighted over the funds that have a value, using `effectiveReturn`.

**`effectiveReturn(fund, key)`**
- The recorded return, or else the IRR mid-point (flagged as a fallback), or else null.

**Plan switch** (`H.toDirect`)
- Overrides the returns, AUM, expense, m-cap split and debt stats from `DIRECT_PERF[regularName]`.
- IRR, exit load and taxonomy are untouched.
- `planSelected = H.applyOverrides(H.applyPlanSelected(selected, planMode))`. **Overrides must run after the plan switch.**

**Future value**
- FV = corpus × (1 + irrMid)^tenure.

**Risk profile**
- eq% = Σ pct over asset_class ∈ {Equity, Global, Global Funds}, with a ±0.005 tolerance.

**Liquidity**, checked in this order:
1. Overrides: Carnelian Bharat Amritkaal and Vedartha are Open Ended.
2. ELSS → Close Ended, 3-year lock-in.
3. A sub-category containing "Solution" → Close Ended, 5-year lock-in.
4. Otherwise `LIQUIDITY_MAP[product_class]`.

**Tenure** (`H.tenureFor`)
- A manual override wins.
- Bonds → Till Maturity. FD → As per FD Tenor.
- Debt MF → a table by sub-category, e.g. Overnight 1 Day, Liquid 0-3 Months, Gilt > 5 Years.
- MLD → Hold Till Maturity. This case must come *before* the asset-class branches.
- SIF → > 24 Months.
- Hybrid → Arbitrage 6-12 Months, otherwise > 24 Months.
- Equity: PMS > 36 Months; AIF > 60 Months, or "As per Lock-In" for Unlisted; other Equity > 36 Months.
- GIFT City > 24 Months. Other Global Funds > 12 Months.

**Equity look-through** (`H.aggEquityScoped`)

Scope:
- Equity MF / Index / ETF / PMS / AIF / FoF / Equity SIF,
- hybrid schemes (`H.isHybridScheme`, which includes Hybrid SIF),
- Direct Equity.

Rules:
- A FoF resolves to its underlying fund.
- A hybrid scheme reads `eq_*` first and falls back to the equity store.
- A Direct Equity holding is 100% of its own sebi_mcap bucket, sector and stock.
- Values are normalised to % of the equity exposure.
- **A fund with no holdings is skipped and listed. There is no fabricated fallback.**

**Debt look-through** (`H.aggDebtScoped`)

Scope:
- Debt MF / Index / ETF / FoF,
- hybrid schemes (`db_*`),
- Bonds and MLD (`H.isSelfDescribingDebt`).

Rules:
- An MLD without a rating defaults to **Unrated**, not to AAA.
- Issuer names go through `H.parseIssuer`, which strips coupon, series and maturity from both ends. SDLs collapse per state, T-Bills stay per maturity.

**Credit buckets** (`H.creditBucket`): a fixed vocabulary of `SOV, AAA/A1+, AA+, AA & Below, Cash & Equivalents, Unrated, Others`.
- (SO)/(CE)/(IND) suffixes are stripped first.
- AAA and A1+ are tested before the AA catch-all.
- "Mutual Fund Units" counts as Cash.
- Short-term grades `A1`–`A4` (with an optional `+`) go to AA & Below. `A1+` is tested earlier and goes to AAA/A1+.
- Blank, UNRATED, NOT RATED and NR go to Unrated.
- Unknown strings go to **Others**, not Unrated. Unrated is unrated *debt*; Others is not debt at all.

**Credit rating chart (since 14-Oct-2026)**

The chart reads the top-20 holdings only as a fallback, for a record with no rating map. It works like this:
1. `H.fundRatingBuckets(rec, hybrid)` reads the fund's **full** rating map, which covers every holding: `rating` on a `DEBT_ANALYTICS` record, `db_rating` on a `HYBRID_ANALYTICS` one. It maps each raw string through `creditBucket`. Only a record with no rating map falls back to its holdings.
2. The aggregator weights each fund's buckets by its allocated amount.
3. `H.normaliseRatings` drops slivers of 0.001% or less, then rescales the rest to **exactly 100%**, in `CREDIT_BUCKETS` order.
4. `H.CREDIT_COLORS` gives each bucket a fixed colour, on screen and in the PPT:
   - SOV `#1F2A38`
   - AAA/A1+ `#BD9568`
   - AA+ `#DBC8B2`
   - AA & Below `#8C7B5C`
   - Cash & Equivalents `#5C3E17`
   - Unrated `#BFBFBF`
   - Others `#931621`
5. The on-screen legend carries each bucket's %.

This was verified on all 771 in-scope debt and hybrid funds: each sums to 100. The **Top 20 Issuers** table still comes from the top-20 holdings, which is correct for that table.

**AMC**
- MF / Index / ETF only.
- `getAMC` matches against the `AMC_PREFIXES` table, otherwise uses the first word.

**Overlap** (`computeOverlap`)
- The pair is put in canonical name order, so the matrix is exactly symmetric.
- Both funds go through a `weightMap` keyed by `normCo`. Duplicate keys are summed and weights ≤ 0 are dropped.
- Non-stock rows are stripped: cash/NCA, T-bills, G-secs, index exposure, options. The patterns are anchored so that BSE Ltd. and similar listed companies survive.
- **Overlap = Σ min(wA, wB)**, capped at 100.
- Bands: < 15 lo, < 30 md, < 50 hi, otherwise xh; ≥ 99.5 is diag.
- FoFs and gold/silver are excluded.

**Net allocation**
- Equity, Global and REIT count as equity. Debt counts as debt. Commodity is separate.
- A hybrid's equity share is Σ`eq_mcap` / 100. If that is missing, the fallback is by category: Aggressive .72, BAF/DAA/MAA .50, Equity Savings .35, Conservative .22, Arbitrage 0, other .50.

**Benchmarks**
- MF: `MF_BM_FOR_SUB[sub]` gives a sheet name, then `MF_BENCHMARK_PERF[sheet]` is filtered by `MF_BM_PREFERRED`.
- PMS/AIF: NIFTY 50 / Midcap 150 / Smallcap 250 / BSE 500 TRI, from `PMS_BENCHMARK_PERF`.

**PMS performance attach** (`applyPmsPerformance`, run on load)
- `PMS_PERF_ALIAS` pins come first, then a fuzzy match on ≥ 3 shared tokens.
- **Pins are maintained by hand and are never guessed.**

---

## 9. Outputs

### 9.1 Excel: `Centricity_Investment_Proposal.xlsx` (`EXPORTS.exportXlsx`)

1. **Investment Proposal**
   - Title row "CENTRICITY WEALTHTECH | INVESTMENT PROPOSAL".
   - Corpus in B2.
   - Hierarchical AC → sub → fund rows.
   - The amount column is a live formula `=B2*B{row}/100`. The GRAND TOTAL uses `SUMIFS` over the indented fund rows.
2. **Rationale**
3. Seven performance sheets: **Equity MF, Hybrid MF, Debt MF, PMS, AIF, Listed Direct Equity, Other**. They are always present; an empty bucket gets a "no holdings" note. Each has benchmark rows.
4. **Equity Analytics**: Market Cap, Top 10 Sectors, Top 20 Stocks.
5. **Debt Analytics**: Sectors, Credit Rating, Top 20 Issuers.
6. **AMC & Liquidity**
7. **Overlap Matrix**: N×N, or a "fewer than 2" note.

Other files:
- `Centricity_Master_Data.xlsx`: the full MASTER, 30 columns.
- `Centricity_Allocation.xlsx`: see §7.6.
- `Centricity_Overlap_Matrix.png`: navy `#233140`, gold bar `#B98C5A`.

### 9.2 PowerPoint: `Centricity_Investment_Proposal.pptx` (`EXPORTS.exportPpt`)

**Format**
- PptxGenJS `LAYOUT_WIDE` (13.333 × 7.5 in). **Cambria** throughout.
- Native slide master:
  - black header bar 0.90 in, gold strip,
  - title in uppercase, 22pt, white,
  - a gold footer line.
- Colours: black 000000, gold BD9568, tan DBC8B2, greys BFBFBF / D9D9D9, cream FFF8E1, brown 5C3E17, red 931621.
- Amounts follow the Cr/Lakhs toggle.

**Slide order**

| # | Slide |
|---|---|
| 1 | Cover "Investment Proposal" (divider master) |
| 2 | `marketDivider` image |
| 3 | 6 × `market` images (Market Update; full-bleed) |
| 4 | `portfolioDivider` image |
| 5 | Portfolio Construct and Requirements: 6 thesis bullets plus the Asset Allocation Summary table |
| 6 | Net Asset Allocation |
| 7 | Investment Options Rationale (paginated) |
| 8 | Investment Option tables: 21 rows per slide, GRAND TOTAL on every slide |
| 9 | Portfolio Analytics — Equity (if there is equity exposure) |
| 10 | Portfolio Analytics — Debt (if there is debt exposure) |
| 11 | `annexureDivider` image |
| 12 | Fund Performance — one slide per bucket |
| 13 | Portfolio Matrix |
| 14 | AMC Allocation & Portfolio Liquidity |
| 15 | Overlap Matrix (if ≥ 2 eligible funds) |
| 16 | `disclaimer` image |
| 17 | `thankyou` image (falls back to a native disclaimer slide) |

**Logo on EVERY slide** (`stampLogo`), native and image slides alike:
- `LOGO_HEADER {x 11.21, y 0.22, w 2.02, h 0.44}`
- `LOGO_CLOSING {x 8.47, y 4.33, w 4.06, h 0.89}` on the Thank-You slide.
- Because of this, **slide images must never carry a baked-in logo**, or the deck double-stamps.
- Never write `forEach(imgSlide)`. The array index lands in the logo-box parameter. Always wrap it: `arr.forEach(img => imgSlide(img))`.

**Single-tab export** (`EXPORTS.exportTabSlide`)
- Exports only that tab's slides.
- File name pattern: `Centricity_<Tab_Name>.pptx`, e.g. `Centricity_Performance_Sheet.pptx`.

**Testing an export**
- Drive it with `window.EXPORTS.exportPpt(selected, corpus, unit)`.
- Capture the deck by intercepting `PptxGenJS.prototype.writeFile`. `write('base64')` stalls on a hidden page.

---

## 10. Design system (reproduce exactly)

### Fonts

- `Cambria, Georgia, "Times New Roman", serif` everywhere: body, buttons, inputs, Chart.js and PPT.
- There are **no web fonts** and no `@font-face`.
- `.mono` uses Consolas / Monaco.

### Base tokens (verbatim)

```css
:root {
  --black: #000000;  --gold: #BD9568;  --gold-deep: #9D7948;  --tan: #DBC8B2;
  --grey-m: #BFBFBF; --grey-l: #D9D9D9; --grey-row: #F4F1EC; --bg-yellow: #FFF8E1;
  --brown-text: #5C3E17; --red: #931621; --green: #2E7D32; --amber: #B7791F;
  --bg: #FFFFFF; --border: #E1DBD0; --border-strong: #C9C1B0; --ink-soft: #333;
}
```

### Glass tokens (the values in force)

```css
:root{
  --glass-bg: rgba(255,255,255,.70); --glass-bg-strong: rgba(255,255,255,.80);
  --glass-brd: rgba(255,255,255,.72);
  --glass-shadow: 0 12px 34px rgba(92,62,23,.09), 0 2px 6px rgba(92,62,23,.05);
  --glass-inset: inset 0 1px 0 rgba(255,255,255,.80);
  --rail-w: 300px; --nav-w: 184px;
}
```

Breakpoints:
- ≤ 1500px: rail 270, nav 172.
- ≤ 1280px: rail 250, nav 160.
- ≤ 1180px: single column.
- ≤ 1100px: KPI and risk-profile grids drop to 2 columns.
- Print: rails hidden.

### Liquid-glass layer (appended at the end of the stylesheet)

**No palette token changed** when it was added. The glass tints are alpha mixes of gold, gold-deep and tan.

- `body::before`: an ambient wash of four radial gold/tan gradients plus a linear `#FFF → #FAF6F0`. `backdrop-filter` needs something behind it, which is why the wash exists.
- `body::after`: a 3px dot grain at opacity .22.
- `.section-card`:
  - `var(--glass-bg)`, `backdrop-filter: blur(26px) saturate(135%)`, radius 16.
  - A 1px specular top highlight.
  - On hover, a deeper shadow.
  - **Never put `overflow:hidden` on it.** The Select and Switch popovers overflow the card by design.
- `.section-head`:
  - `linear-gradient(100deg, rgba(0,0,0,.93) 0%, rgba(0,0,0,.80) 55%, rgba(157,121,72,.72) 100%)`.
  - `.num` is a 26px gold square with radius 8.
  - `.title` is uppercase 14px bold with letter-spacing .08em.
  - `.desc` is tan italic 11.5px, right-aligned.
- `.app-header`:
  - Sticky, 72px high.
  - Gradient black → `rgba(157,121,72,.80)`, blur 12, a 3px gold bottom border.
- Rails (`.side-rail`, `.nav-glass`):
  - `--glass-bg-strong`, blur 26, radius 16.
  - Sticky at top 84px.
- **Collapsed rail:** the grid drops to **two** tracks (`minmax(0,1fr) var(--nav-w)`) and the rail becomes a fixed slim tab. With three tracks the main column would measure 0.
- `.kpi`: translucent white, radius 12. Label 11px uppercase with .12em tracking. Value 22px bold gold, tabular-nums.

### Tabs

- `.tabs`: translucent, with a gold 2px bottom border.
- `.tab`: 12px uppercase bold.
- `.tab.active`: white .82, with a 6px gold square marker.
- **`.tab` must not carry `margin-bottom:-2px`**. When the strip wraps, the second row overlaps the first.

### Tables

- Black uppercase header. Odd rows `#FBF8F2`. The total row is black.
- Hierarchy rows: AC greyM, PC tan, sub greyL, benchmark cream italic brown.

### Chips, buttons and charts

- **Centricity Select chip:** `linear-gradient(135deg, #BD9568, #9D7948)`, white 10px bold uppercase, "★" prefix, radius 2.
- **Popover:** 560px wide, 2px gold border, black head with a gold underline.
- **Buttons:**
  - Add: gold; Added: green.
  - Download: black; `.alt`: gold; `.ghost`: white with a border.
  - Stepper: tan.
- **Charts:** gold bars with black borders. The rating doughnut colours are fixed **per bucket** by `H.CREDIT_COLORS` (§8), not by slice order, so a bucket keeps its colour whichever buckets are present.
- **Overlap panel:** navy `#233140` / `#1A2533`. Cell ramp `#F2E9DC` → `#DCC4A5` → `#C49A66` → `#A87B45`.

---

## 11. Monthly update runbook

### 11.1 Inputs (the desk sends these each cycle)

The outgoing owner kept them in `Desktop\AI Dashboard Updates\For Centricity Proposal Playbook Portal\<Mon YYYY>\`, with an `Analytics\` subfolder.

**File names drift every month.** Match on the stem, check the folder listing, and read the as-on date off the content.

| Source file (stem) | Feeds | Tool |
|---|---|---|
| `Daily MF Monitor … <date>.xlsx` (48 sheets) | MASTER performance, MF benchmarks, **and the rename map** | `rename_schemes.js`, then `bake_month.js` |
| `Daily MF Monitor_Direct_<date>.xlsx` | `DIRECT_PERF` | `bake_month.js` (or `rebuild_directperf.js`) |
| `Analytics\Equity / Hybrid / Debt Analytics_<Month>.xlsx` | analytics stores | `bake_month.js`, then `fill_variant_analytics.js`, then `rekey_sif_analytics.js` |
| `Analytics\Listed Direct Equity_<Month>.xlsx` (sector, mcap, ISIN) | Direct Equity universe | `merge_de_universe.js` |
| `Listed Direct Equity_<date>.xlsx` (returns only) | Direct Equity returns | `merge_direct_equity_returns.js` |
| `Expense Ratio_<Month>.xlsx` + `Exit Load_<Month>.xlsx` | `expense`, `exit_load` | `merge_expense_exitload.js` |
| `SIF Monitor_<date>.xlsx` | SIF performance (inside the SIF sibling) | `merge_sif_monitor.js` |
| `SIF Master List_<Month>.xlsx` | SIF universe (only when it changes) | edit the `var SIF` block in `Centricity_SIF_Refresh.js` |
| `Fund Manager Data_<date>.xlsx` | `fund_mgr` | `merge_fund_managers.js` |
| `Fund Risk Ratios & 3Y Rolling - All Funds (as on <date>).xlsx` | `RISK_MATRIX` | `merge_risk_matrix.js` |
| `NAV Data as on <date>.xlsx` | `RISK_MATRIX`, canonical route | `build_risk_matrix.py` (needs Python) |
| `PMS_Scheme_Performance_<Month Year>.xlsx` | `PMS_PERFORMANCE.pms` | `merge_pms_performance.js`, then `pin_pms_alias.js` |
| `Monthly Investment Reckoner - <Month Year>.pptx` | `CENTRICITY_SELECT`, AIF performance and benchmarks | `merge_reckoner.js`, `merge_aif_performance.js`, `add_reckoner_funds.js` |
| `PMS & AIF Analytics <Month Year>.xlsx` | PMS/AIF look-through (**writes the sibling too**) | `merge_pms_aif_analytics.js` |
| `Monthly Outlook Pagers… .pptx` / `Market Update Slide_… .pptx` | `EXTRA_SLIDES.market` | PowerPoint render, then `update_market_slides.js` |
| `Topic Slides, Disclaimer & Thank You Slide.pptx` | disclaimer / thankyou | PowerPoint render, then `update_closing_slides.js` |
| `Bond List_<date>.xlsx` | Bonds (periodic) | `merge_bond_list.js` |
| `Gift City Master List.xlsx` | GIFT City (periodic) | **edit `Centricity_June_Refresh.js`**: its `NEW_GIFT` list replaces the bucket |

### 11.2 Standard monthly order

Every step is dry-run first: read the gates, then re-run with `--apply`. Do **not** skip `rename_schemes.js`. Baking without it duplicates about 200 renamed schemes.

```bash
npm install xlsx@0.18.5                       # once per machine
# back up the six deploy files first
node rename_schemes.js --monitor "<M>/Daily MF Monitor ....xlsx" --apply          # FIRST, always
node bake_month.js --dir "<M>" --as-on "31st October 2026" --apply
node fill_variant_analytics.js --dir "<M>" --apply                                  # always after a bake
node rekey_sif_analytics.js --apply                                                 # always after a bake
node merge_de_universe.js "<M>/Analytics/Listed Direct Equity_<Month>.xlsx" --apply
node merge_direct_equity_returns.js "<M>/Listed Direct Equity_<date>.xlsx" --apply
node merge_expense_exitload.js --expense "<Expense Ratio>.xlsx" --exitload "<Exit Load>.xlsx" --apply
node merge_sif_monitor.js "<SIF Monitor_<date>.xlsx>" --apply
node merge_fund_managers.js "<Fund Manager Data_<date>.xlsx>" --apply
node merge_risk_matrix.js "<Fund Risk Ratios ....xlsx>" --as-on "31 Oct 2026" --apply
# Reckoner cycle (PMS first; the deck is named for the month it SHIPS, read the as-on date off the slide)
node merge_pms_performance.js "<PMS_Scheme_Performance_<Month Year>.xlsx>" --as-on "31st October 2026" --html index.html --apply
node pin_pms_alias.js --html index.html --apply
node merge_reckoner.js "<Monthly Investment Reckoner - <Month Year>.pptx>" --html index.html --apply
node merge_aif_performance.js "<same Reckoner .pptx>" --apply
node merge_pms_aif_analytics.js "<PMS & AIF Analytics ....xlsx>" --as-on "..." --apply   # when supplied
node verify_page.js .
```

Each tool also accepts `--html <path>`; it defaults to `index.html` beside the script. `merge_sif_monitor.js` takes `--sibling`, and `update_market_slides.js` takes `--js`.

### 11.3 Cycle status at handover: what is due next

| Domain | As on now | Due |
|---|---|---|
| MF performance, Direct, analytics, SIF, risk matrix, Direct Equity, expense/exit load | 30 Sep 2026 | Oct-2026 cycle |
| PMS performance, AIF performance, Centricity Select (Sep deck), fund managers | **31 Aug 2026** | **behind by one cycle**: catch up with the next PMS file and Reckoner |
| PMS/AIF look-through | **31 Jul 2026** | when the next `PMS & AIF Analytics` file arrives |
| Invictus bonds | 6 Aug 2026 | when a new Bond List arrives |
| GIFT City / Offshore, SIF universe | Jun / Jul 2026 | only when the desk sends new master lists |
| Market Update slides | October 2026 deck (Sep data, 6 slides) | next Outlook Pagers deck |

### 11.4 Gates you must read (abridged; the full list is in `CLAUDE.md` → *Traps*)

- **`CENTRICITY_SELECT` keys present in MASTER must stay 178/178.** This is the rename canary.
- **0 duplicate MASTER names.**
- After the Direct Equity refresh, the **top 10 stocks by market cap must all read "Large Cap"**. `sebi_mcap` is joined by name, never by row.
- In `merge_reckoner.js`, if the DROPPED list and the "NO MASTER MATCH" list mirror each other, **stop**. That is a join failure, not an editorial change.
- In `pin_pms_alias.js`, any `*** key not in PMS_PERFORMANCE.pms` blocks *all* pins. Fix both `PINS` and `merge_pms_performance.js`'s `REPIN`.
- In `merge_direct_equity_returns.js`, the tool refuses when a return column is wholly empty. Never force it. The join deletes missing returns.
- In `merge_expense_exitload.js`, the tool refuses on 0 joins. Watch for banner rows above the header.
- SIF and MF Monitor returns: spot-check small values (between −1% and +1%) against the workbook. The ±300% gate cannot catch a missed ÷100.
- `DATA_DATES.sif` must not read "—". If it does, the SIF sibling did not load.

### 11.5 Where data actually lives

The sibling traps: a change made only in `index.html` gets overwritten at load.

| Data | Edit it in |
|---|---|
| GIFT City funds | `Centricity_June_Refresh.js` (`NEW_GIFT`) **and** the embedded block |
| Expected-IRR bands | `Centricity_IRR_Offshore.js` `IRR` map (exact MASTER names; re-key it on any rename) |
| SIF universe and performance | `Centricity_SIF_Refresh.js` `var SIF` (`merge_sif_monitor.js` writes it) |
| 12 PMS/AIF look-throughs | `Centricity_June_Refresh.js` `EQ` (`merge_pms_aif_analytics.js` writes both) |
| Slides | `Centricity_ExtraSlides.js` |

### 11.6 Slide refresh (Windows + PowerPoint)

The decks are native shapes; there are no images to extract, so they must be **rendered**.

1. Delete every baked-in logo first: each type-13 picture narrower than 400pt.
2. Delete any slide-number placeholders.
3. Export each slide at **2001 × 1125** to a **short** temp path. `Slide.Export` fails on long paths.

```powershell
$app=New-Object -ComObject PowerPoint.Application; $p=$app.Presentations.Open($src,-1,0,0)
1..$p.Slides.Count | % { $p.Slides.Item($_).Export("C:\t\slide$_.jpg","JPG",2001,1125) }
$p.Close(); $app.Quit()
```

```bash
node update_market_slides.js --slides "C:/t" --apply      # dividers / disclaimer / thankyou are gated to survive
node update_closing_slides.js --dir "<render dir>" --apply # Disclaimer as PNG, Thank You as JPEG
```

Re-encode the market JPEGs at quality ~82, then eyeball the densest slide afterwards.

### 11.7 After every refresh

1. `node verify_page.js .` and compare against §15. The counts move legitimately month to month; explain every delta.
2. Run `node .claude/serve.js` and load the page:
   - The console is clean.
   - The footer dates are right.
   - Section 3 reads `Universe — N instruments.`
3. Pick 3–4 funds across classes, allocate 100%, and export both the PPT and the Excel.
4. Confirm the file still ends `</body></html>`.
5. Commit all six deploy files plus any changed tools. Push. Re-check the Pages URL.
6. Update `CLAUDE.md`'s counts and dates.

---

## 12. Non-negotiable invariants and conventions

These are carried over from the outgoing owner's working notes.

- **Verify against live code and files, not against documents.** Re-derive counts with `verify_page.js` or a Node `vm` run of the page.
- **Monitor returns are always percent.** Always divide by 100; never auto-detect the scale.
- **Report, never guess, ambiguous matches**: renames, PMS pins, Reckoner names, allocation uploads. A wrong pin puts another manager's numbers on a client's fund.
- **No fabricated data in client-facing output.**
  - No holdings fallback.
  - No back-filled m-cap residuals.
  - An MLD defaults to "Unrated".
  - Text exit-load cells (`Nil`, `.`, `NA`) mean *missing*.
- **Rename before bake** (`rename_schemes.js`). Renames stamp `prev_name`, which `H.buildFundIndex`, `merge_reckoner.js` and `merge_risk_matrix.js` all consult.
- **The Monitor decides spellings.** Do not "prettify" a fund name the Monitor does not use, or the next bake re-creates the orphan.
- **Single predicates.**
  - `H.isHybridScheme`, `H.isEquitySIF`, `H.isSelfDescribingDebt` and `H.creditBucket` are the only gates.
  - Never re-inline their tests.
  - Index funds are matched on `sub_category`, never on `product_class`.
- `blocklib.writeBlocks` derives its `</html>` guard from its input. Do not weaken it.
- OneDrive / large-file note: if the repo lives in a synced folder, a bash-side view of `index.html` can lag behind edits. Verify through Node on the real path.

---

## 13. Tools reference (CLI)

All tools are dry-run unless `--apply` is passed. All default to `index.html` beside the script.

| Tool | CLI |
|---|---|
| rename_schemes.js | `--monitor <MF Monitor.xlsx> [--apply]` |
| bake_month.js | `--dir <month folder> --as-on "<date>" [--as-on-analytics "<date>"] [--html] [--apply]` |
| fill_variant_analytics.js | `--dir <month folder> [--apply]` |
| rekey_sif_analytics.js | `[--apply]` |
| merge_analytics.js | `--hybrid/--equity/--debt <xlsx> --as-on "<date>" [--apply]` (re-bake one class) |
| rebuild_directperf.js | `<Direct monitor.xlsx> [--apply]` |
| merge_de_universe.js | `<Analytics/Listed Direct Equity_<Month>.xlsx> [--apply]` |
| merge_direct_equity_returns.js | `<Listed Direct Equity_<date>.xlsx> [--apply]` |
| merge_expense_exitload.js | `--expense <xlsx> --exitload <xlsx> [--apply]` |
| merge_sif_monitor.js | `<SIF Monitor.xlsx> [--as-on] [--sibling] [--apply]` |
| merge_fund_managers.js | `<Fund Manager Data.xlsx> [--apply]` |
| merge_risk_matrix.js | `<Fund Risk Ratios ....xlsx> --as-on "31 Oct 2026" [--apply]` |
| merge_pms_performance.js | `<PMS_Scheme_Performance.xlsx> --as-on "<date>" --html index.html [--apply]` |
| pin_pms_alias.js | `--html index.html [--apply]` |
| merge_reckoner.js | `<Reckoner.pptx> --html index.html [--apply]` |
| merge_aif_performance.js | `<Reckoner.pptx> [--apply]` |
| add_reckoner_funds.js | `<Reckoner.pptx> --pms <PMS perf.xlsx> --html index.html [--apply]` (universe change) |
| merge_pms_aif_analytics.js | `<PMS & AIF Analytics.xlsx> --as-on "<date>" [--apply]` |
| merge_bond_list.js | `<Bond List.xlsx> [--apply]` |
| fold_duplicate_names.js | `--monitor <MF Monitor.xlsx> [--apply]` (idempotent) |
| fold_index_funds.js / split_sif_add_mld.js | `[--apply]` (one-off, idempotent) |
| update_market_slides.js | `--slides <dir of slide1..N.jpg> [--js] [--apply]` |
| update_closing_slides.js | `--dir <render dir> [--apply]` |
| verify_page.js | `.` (runs the page in a Node vm and prints the true in-browser state) |
| build_risk_matrix.py | see `Risk_Matrix_Update_Prompt.md` (needs Python + pandas, numpy, openpyxl) |

---

## 14. Known gaps, debt and open items (inherited; do not fix during transfer)

1. Fold siblings 3–5 into the embedded blocks (six-file deploy → fewer files). This is standing intent, not urgent.
2. `README.md` is stale. It describes `tools/*.py` and cdnjs, and neither exists. Rewrite it after the transfer.
3. **45 funds show risk stats that their own source flags as unreliable** (NAV split or β < 0.30). The `Data Flags` tab is not surfaced in the UI. Fixing this is a feature, not a refresh.
4. `Mosaic Multiyield Fund Series I` carries a Select badge, but the deck now recommends Series II, which MASTER lacks.
5. `Motilal Oswal Gift City India Equity Fund – Inbound` (deck) has no MASTER record.
6. `Prism Hybrid Long-Short Fund` has no AMC prefix.
7. `360 ONE Balanced Hybrid Fund` is absent from the Monitor, so it is not in MASTER.
8. Five SIFs have no look-through upstream: Kotak Infinity Hybrid, Mirae Platinum Hybrid, Quants Qsif Sector Rotation, Franklin Sapphire Equity, Tata Titanium Equity.
9. ~~The debt rating chart covers only the top-20 holdings.~~ Fixed 14-Oct-2026 (`72e1f1e`); see §8. The Top 20 Issuers table is still top-20 by design.
10. There is no Python on the outgoing machine, so `RISK_MATRIX` has no `c` field and `RISK_MATRIX_BENCH_SD` is stale. Neither is read by the UI.
11. Rf = 4.5% in the risk matrix is the desk convention. Re-confirm it with the desk.
12. Dead code, left in place:
    - `PortfolioRollup`
    - `SharePanel_REMOVED`
    - the `false &&` Section 7 cards
    - the L1238 `BENCHMARKS` description map
    - `aggEquity` / `aggDebt` (legacy)
    - `BONDS` / `PMS_HOLDINGS` empty globals
    - `parseAnalytics` / `parseBonds` (no upload card)
13. Cosmetic inconsistencies to keep for parity: the Master Editor says "Section 6"; Portfolio Matrix and Equity tabs both carry the internal number 6.4. Several frozen-pane classes have no CSS.

---

## 15. Parity checklist: definition of done for the transfer

Run `node verify_page.js .` in the new repo. **It must print exactly:**

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

`React is not defined` lines are expected in the vm and can be ignored.

Then tick every item:

- [ ] The blob SHAs of the six deploy files match §2.3.
- [ ] `node .claude/serve.js` → http://localhost:8080 loads with a **clean console**:
  - the header and logo show,
  - Section 3 reads **"Universe — 7682 instruments."**,
  - the footer reads "Performance as on 30th September 2026 & Analytics as on 30th September 2026".
- [ ] The left rail collapses and re-opens. The nav links scroll to each section.
- [ ] Pick funds from MF, PMS, a bond and Direct Equity:
  - the Select popover opens,
  - the PMS minimum shows ₹50 L,
  - the % and amount steppers work,
  - Regular/Direct changes the returns.
- [ ] At 100% allocated:
  - **Excel** downloads with 13 sheets: Investment Proposal, Rationale, the 7 performance sheets, Equity Analytics, Debt Analytics, AMC & Liquidity, Overlap Matrix.
  - **PowerPoint** downloads with the market slides, dividers, closing slides, and the logo top-right on every slide. Switching the logo to Invictus changes it on every slide.
- [ ] The Allocation Sheet downloads and re-uploads to the same allocation.
- [ ] Every Live Output tab renders, and `⬇ Download slide` works per tab.
- [ ] With a diversified debt fund selected (e.g. a corporate bond fund), the Credit Rating doughnut and its legend add up to **100%**, and the PPT doughnut uses the same per-bucket colours.
- [ ] The Section 7 MF Monitor upload works on a current workbook (session only).
- [ ] The deployed Pages URL passes the same checks.
- [ ] `CLAUDE.md` is updated with the new owner, repo URL, source-folder path and visibility decision.

---

## 16. Suggested first prompt for the new Claude Code session

> I'm taking over the Centricity Proposal Playbook. The repo is unzipped in this folder. Read `HANDOVER_PRD.md` fully, then `CLAUDE.md`. Do not change any dashboard code or data. Set up the environment from PRD §4: create `.claude/serve.js` and `.claude/launch.json`, and run `npm install xlsx@0.18.5`. Then run the §15 parity checklist and report each item as pass or fail with evidence. After that, help me stand up the new GitHub repo and Pages site from §5, and update the owner-specific facts in `CLAUDE.md` (owner: <name/email>, repo: <url>, monthly source folder: <path>, repo visibility: <public/private>).

For each month after that:

> Run the monthly refresh for <Month YYYY>. The source files are in <folder>. Follow PRD §11 and `CLAUDE.md`. Dry-run every tool first and show me the gates before applying. Back up first, run `verify_page.js` at the end, and explain every count that moved.

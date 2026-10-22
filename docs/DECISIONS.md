# Decision register

This file records the architecture and product decisions behind the Centricity Investment Proposal
Dashboard: why each was made, what it replaced, and whether it still holds. It does not explain how
to run anything. Procedures are in `docs/MONTHLY_UPDATE_PROCESS.md`; the full trap list is in
`docs/OPERATING_MANUAL.md`.

**How to read it**

- **IDs.** D1–D59 are inherited from the outgoing owner's working notes, numbered as in the handover
  archaeology pass. D60–D69 were taken during the transfer (16-Oct-2026); D70 onward come from the
  tool fixes that followed it. IDs are never reused.
- **Status.** `Active` = in force. `Superseded` = replaced (the entry says by what). `Open` = not
  decided yet, or the agreed action is not done.
- **Fields.** Each entry has Context, Decision, Rationale, Alternatives / supersedes, Consequences and
  Source. A field is left out when nothing was recorded for it.
- **Sources.** `OPERATING_MANUAL.md:n` is line n of `docs/OPERATING_MANUAL.md` as moved in commit
  `cd05c97`, which is byte-identical to the old `CLAUDE.md` at `handover-baseline`. The working file
  has since gained a header note, path updates and an errata section, so its line numbers differ;
  open the cited version with `git show cd05c97:docs/OPERATING_MANUAL.md`. Its commands use the old
  flat paths: read `node bake_month.js` as `node tools/bake_month.js`. `site/index.html:n` line numbers
  drift with every edit; re-derive them with `Grep`.
- **Commits.** "upstream `abc1234`" is the original SHA in the outgoing owner's repository. Our
  history was rewritten when it was sanitised (D64), so every SHA differs; the table at the end maps
  each cited upstream SHA to its local one, matched by date and subject and checked by content.
- **"Verified in code"** means the decision was checked against the current files on 16-Oct-2026 at
  the location cited. Where code and manual disagree, the entry follows the code and says so.

---

## Index

| ID | Date | Title | Area | Status |
|---|---|---|---|---|
| D1 | Jul-2026 | A deploy is six files, loaded in a fixed order | Deploy | Active |
| D2 | standing | Fold siblings 3–5 into the embedded blocks | Deploy | Open |
| D3 | 24-Jul-2026 | `RISK_MATRIX` baked inline; no script tag | Deploy | Active |
| D4 | 22-Jun-2026 | `Centricity_Dashboard.html` deprecated | Deploy | Superseded (not transferred) |
| D5 | — | The original README is stale; do not follow it | Process | Superseded by D62 |
| D6 | 13-Aug-2026 | The embedded `DATA_DATES` is authoritative | Deploy | Active |
| D7 | 19-Aug-2026 | Three-column workspace; Section 7 in the rail | UI | Active |
| D8 | 19-Aug-2026 | Nav scrolling animated by hand | UI | Active |
| D9 | 19-Aug-2026 | Header offset measured at click time | UI | Active |
| D10 | 19-Aug-2026 | Liquid-glass layer; palette tokens unchanged | UI | Active |
| D11 | 19-Aug-2026 | Collapsed rail uses two grid tracks | UI | Active |
| D12 | 19-Aug-2026 | No negative bottom margin on `.tab` | UI | Active |
| D13 | 19-Aug-2026 | No `overflow:hidden` on `.section-card` | UI | Active |
| D14 | 27-Aug-2026 | Taxonomy filter uses the names chain, not `split("/")` | Data model | Active |
| D15 | 25-Aug-2026 | SIF split into Equity SIF / Hybrid SIF | Data model | Active |
| D16 | 25-Aug-2026 | MLD is a Debt class; missing rating = Unrated | Data model | Active |
| D17 | 03-Sep-2026 | Fixed seven-bucket credit vocabulary | Analytics | Active |
| D18 | 14-Oct-2026 | Rating chart reads the full rating map | Analytics | Active |
| D19 | 08-Sep-2026 | Holdings overlap is symmetric | Analytics | Active |
| D20 | 25-Aug-2026 | Index Fund is a sub-category of Mutual Fund | Data model | Active |
| D21 | — | ETF stays a class; plural "Mutual Funds" is deliberate | Data model | Active |
| D22 | 17-Sep-2026 | Fold duplicate spellings; the Monitor's spelling wins | Data model | Active |
| D23 | Aug-2026 | Source-quirk rules for issuers and bonds | Tooling | Active |
| D24 | 20-Aug-2026 | GIFT City edits also go into the June sibling | Data model | Active |
| D25 | 28-Jul-2026 | Join `sebi_mcap` by name; top-10 Large Cap gate | Tooling | Active |
| D26 | Sep-2026 cycle | Direct Equity renames only on strong evidence | Tooling | Active |
| D27 | 13/14-Oct-2026 | Find the header row; refuse silent no-ops | Tooling | Active |
| D28 | — | Serve over http, not `file://` | Deploy | Active (refined by D66) |
| D29 | 25-Aug-2026 | The selected logo is stamped on every slide | UI | Active |
| D30 | 25-Aug-2026 | Closing slides rendered at 2001×1125 | UI | Active |
| D31 | 13-Aug-2026 | Market slides: render, q82, pick the deck by content | UI | Active |
| D32 | 13-Aug-2026 | Expense ratio and exit load are wired | Tooling | Active |
| D33 | 17-Sep-2026 | Fund managers from the roster; "current" per scheme | Tooling | Active |
| D34 | — | `AMFI CODE.xlsx` stays unwired | Tooling | Active |
| D35 | 31-Jul-2026 | As-on precedence: picker → file name → in-file | Tooling | Active |
| D36 | 31-Jul-2026 | Direct Equity returns and a Listed Direct Equity bucket | Tooling | Active |
| D37 | 31-Jul-2026 | Exclude no-holdings funds; no fabricated fallbacks | Analytics | Active |
| D38 | 31-Jul-2026 | Allocation Sheet round-trip | UI | Active |
| D39 | 18-Aug-2026 | Return overrides live on the selection, applied last | UI | Active |
| D40 | 31-Jul-2026 | Tiered fund-name resolution; ambiguity reported | UI | Active |
| D41 | 13-Oct-2026 | Push via a temp clone; raise the public-repo issue | Deploy | Superseded by D60, D63, D65, D68 |
| D42 | 13-Aug-2026 | Bake with the page's own parsers; dry-run by default | Tooling | Active (amended by D72) |
| D43 | 18-Sep-2026 | Node route into `RISK_MATRIX`; drop `c` | Risk | Active (premise reopened) |
| D44 | 18-Sep-2026 | Risk joins via `prev_name` and plan-base | Risk | Active |
| D45 | 18-Sep-2026 | Data Flags are not surfaced in the UI | Risk | Superseded by D74 |
| D46 | 17-Sep-2026 | Rename before every bake; identity = inception + AMC | Data model | Active (amended by D73, D79) |
| D47 | 13-Aug-2026 | Variant fill after every bake | Analytics | Active |
| D48 | 20-Aug-2026 | One hybrid predicate for all four analytics gates | Analytics | Active |
| D49 | 20-Aug-2026 | PMS/AIF look-through is written in two places | Analytics | Active |
| D50 | 17-Sep-2026 | SIF Monitor baked into the SIF sibling; always ÷100 | Tooling | Active |
| D51 | 20-Aug-2026 | Re-key SIF analytics via `sif_raw` | Analytics | Active |
| D52 | 13-Aug-2026 | `DIRECT_PERF` on MASTER's scale; atomic m-cap split | Analytics | Active |
| D53 | — | Refresh procedure: back up, replace one block, verify | Process | Active (amended by D65, D72) |
| D54 | 20-Aug to 28-Sep-2026 | PMS performance replaced wholesale; pins by hand | Reckoner | Active (amended by D75) |
| D55 | 21-Aug-2026 | AIF performance from the Reckoner deck | Reckoner | Active |
| D56 | 20-Aug-2026 | Centricity Select from the deck, on 33 fixed categories | Reckoner | Active (amended by D71) |
| D57 | — | Verify by re-deriving in a `vm`; the rename canary | Process | Active (automated by D63) |
| D58 | — | Rf = 4.5%, pending desk confirmation | Risk | Open |
| D59 | — | Check Portfolio Review after a refresh | Process | Active |
| D60 | 16-Oct-2026 | Public repository on free GitHub Pages | Transfer | Active |
| D61 | 16-Oct-2026 | Monthly updates publish automatically once every check passes | Transfer | Active |
| D62 | 16-Oct-2026 | Repository reorganised into `site/`, `tools/`, `docs/` | Transfer | Active |
| D63 | 16-Oct-2026 | Pages built by GitHub Actions from `site/`, behind a parity gate | Transfer | Active |
| D64 | 16-Oct-2026 | History migrated sanitised, not verbatim | Transfer | Active |
| D65 | 16-Oct-2026 | The local workspace folder is the git repository | Transfer | Active |
| D66 | 16-Oct-2026 | Preview server serves only `site/`, on 127.0.0.1 | Transfer | Active |
| D67 | 16-Oct-2026 | Shared Claude config, package manifest and LF tracked | Transfer | Active |
| D68 | 16-Oct-2026 | Changes go branch → PR → verify → merge | Transfer | Active |
| D69 | 16-Oct-2026 | `Centricity_Risk_Matrix.js` stays in `site/` for parity | Transfer | Superseded by D78 |
| D70 | 16-Oct-2026 | `DATA_DATES.analytics` labels the MF analytics only | Analytics | Active |
| D71 | 16-Oct-2026 | Centricity Select merge refuses join failures and mass drops | Reckoner | Active (extended by D76) |
| D72 | 19-Oct-2026 | One contract for every tool: exit codes, gates before writes, atomic writes, strict CLI | Tooling | Active |
| D73 | 19-Oct-2026 | Workbook dates are calendar days (`isoDay`); inception corrected | Tooling | Active |
| D74 | 19-Oct-2026 | Source reliability flags reach the page as `fl` | Risk | Active |
| D75 | 19-Oct-2026 | Hand pins live in `tools/data/pins.json` | Reckoner | Active |
| D76 | 19-Oct-2026 | Reckoner merge refuses a drop under an unmapped deck heading | Reckoner | Active |
| D77 | 19-Oct-2026 | CDN scripts carry SRI; page asks not to be indexed; inline favicon | Deploy | Active |
| D78 | 19-Oct-2026 | The unused `Centricity_Risk_Matrix.js` moves to `docs/archive/` | Deploy | Active |
| D79 | 19-Oct-2026 | Rename history kept in `prev_names`; stale old-name keys dropped | Data model | Active |
| D80 | 19-Oct-2026 | Refresh-only Monitor sheets: refresh existing records, never create; unknown sheets fail the bake | Tooling | Active |
| D81 | 21-Oct-2026 | Publish the C19 re-run; keep values from blank Monitor cells; hold the C20 G-Sec record | Data | Active |
| D82 | 22-Oct-2026 | The PowerPoint export lays out every native slide through one measured design system | Exports | Active |
| D83 | 22-Oct-2026 | The deck marks an expected 1Y/3Y/5Y figure with `*` (`H.isExpectedReturn`) | Exports | Active |

Dates are when the change shipped. Where the manual and the commit disagree, the commit date is used
and the entry says so. "—" means no date is recorded.

---

## Transfer decisions (Oct-2026)

### D60 · Public repository on free GitHub Pages
`Active` · 16-Oct-2026 · owner decision
- **Context:** The handover PRD asked for a deliberate visibility decision (`docs/PRD.md` §5, step 4).
  The old repository is public; a private repository with Pages needs a paid GitHub plan.
- **Decision:** `origin` (`productsteamcentricity/Centricity-Proposal-Playbook`) is PUBLIC, and the site
  is served by free GitHub Pages at https://productsteamcentricity.github.io/Centricity-Proposal-Playbook/.
- **Rationale:** Same exposure as before (on 16-Oct-2026 the outgoing owner's public site was
  byte-identical to our baseline); no paid plan needed.
- **Alternatives / supersedes:** A private repository on Pro/Team/Enterprise, or an internal static
  host. Supersedes the "raise this before pushing" warning in D41.
- **Consequences:** The fund universe, Select rationales, PMS/AIF terms and house IRR bands are
  world-readable. `site/robots.txt` protects nothing: crawlers read `robots.txt` only at the host root,
  and a project site serves it at `/Centricity-Proposal-Playbook/robots.txt`. Never commit workbooks or
  client data (D64, D65).
- **Source:** Owner decision, 16-Oct-2026; `OPERATING_MANUAL.md:655-658`.

### D61 · Monthly updates publish automatically once every check passes
`Active` · 16-Oct-2026 · owner decision
- **Context:** Before the transfer, a person read every tool's gates and pushed by hand
  (`OPERATING_MANUAL.md:645-653, 673-674`).
- **Decision:** Once every automated check (tool gates, `verify_page.js`, the CI parity gate) and
  every manual check in the monthly process has passed, Claude merges the monthly PR, which publishes
  it. Claude still stops and asks on any failed gate and any judgement call: an ambiguous rename, a
  PMS alias pin, a Reckoner name mismatch, a universe change, or an input that cannot be identified,
  competes with another file for one slot, is older than the live data or belongs to another month.
  An input that is simply absent is not a stop: its domain keeps its previous date and the report
  lists it.
- **Rationale:** The gates already refuse the known mechanical failures. What is left are identity
  judgements, which the inherited rules say to report, never guess (`docs/PRD.md` §12).
- **Alternatives / supersedes:** Owner approval before every publish.
- **Consequences:** A merge to `main` publishes (D63, D68). The stop list in
  `docs/MONTHLY_UPDATE_PROCESS.md` must be kept current.
- **Source:** Owner decision, 16-Oct-2026; `docs/MONTHLY_UPDATE_PROCESS.md` (publish rule).

### D62 · Repository reorganised into `site/`, `tools/`, `tools/lib/`, `docs/`
`Active` · 16-Oct-2026 · **verified in code**
- **Context:** Upstream was flat: 46 tracked files at the root. The owner asked for a tidy layout with
  one folder per purpose.
- **Decision:** The deploy set, the unused `Centricity_Risk_Matrix.js` and `robots.txt` → `site/`. Node
  tools and `build_risk_matrix.py` → `tools/`; the four libraries → `tools/lib/`. The old `CLAUDE.md`
  → `docs/OPERATING_MANUAL.md`; README → `docs/archive/`; runbooks and specs → `docs/runbooks/`,
  `docs/specs/`. Tool behaviour is unchanged.
- **Rationale:** Separates what is published from what is run and what is read, and lets Pages publish
  one folder (D63).
- **Alternatives / supersedes:** The flat layout, and the tool default "`index.html` beside the
  script" (upstream `174ba4e`).
- **Consequences:** Only default and `require` paths changed (43 lines in 24 files). 18 tools default to
  `site/index.html`; `merge_sif_monitor.js`, `update_market_slides.js` and `update_closing_slides.js`
  default their sibling to `site/…`; `merge_pms_performance.js`, `pin_pms_alias.js` and
  `merge_reckoner.js` still require `--html site/index.html`; `verify_page.js` takes `site`.
- **Source:** Commit `cd05c97` (all 25 tools dry-run on the Sep-2026 inputs before and after the move
  printed identical output; site files hash identically); `tools/merge_sif_monitor.js:23`;
  `tools/merge_pms_performance.js:16-18`.

### D63 · Pages built by GitHub Actions from `site/`, behind a parity gate
`Active` · 16-Oct-2026 · **verified in code**
- **Context:** Upstream Pages served branch `main`, folder `/` (`docs/PRD.md` §5). A branch deploy can
  serve only `/` or `/docs`: not `site/`, and `/docs` now holds documentation.
- **Decision:** `.github/workflows/pages.yml` runs a `verify` job on every push to `main`, every pull
  request and every manual run. On `main` (push or manual run, never a PR) a `publish` job then uploads `site/` and deploys it.
  The gate requires: the six deploy files present and non-empty; `verify_page.js` reporting no missing
  sibling, 0 duplicate MASTER names, a page ending `</html>` and 0 script errors; and every Centricity
  Select key present in MASTER.
- **Rationale:** Publish only the deploy folder, and never publish a build that breaks production.
- **Alternatives / supersedes:** "Deploy from a branch → `main` / (root)"; the manual push (D41).
- **Consequences:** The repository's Pages source must be set to "GitHub Actions". The gate enforces
  D1 and automates D57. It checks structure, not data correctness; data judgement stays with D61.
- **Source:** `.github/workflows/pages.yml`; commit `4600f82`.

### D64 · History migrated sanitised, not verbatim
`Active` · 16-Oct-2026
- **Context:** In upstream history, `Portfolio_Review_Build_Prompt.md` contained two client names and a
  sample file name. The new repository is public (D60).
- **Decision:** All 74 upstream commits were migrated with `git filter-branch`, redacting those strings
  in every commit. Authors, dates and messages are unchanged.
- **Rationale:** Keep full history and blame without republishing client PII.
- **Alternatives / supersedes:** Push upstream history verbatim, or import one flat snapshot (loses
  history).
- **Consequences:** Every SHA differs from upstream (map at the end of this file), and the GitHub
  web-upload signatures on the early commits are lost. Upstream tip `72e1f1e` = our `862e40b`, tagged
  `handover-baseline`. The outgoing owner's public repository still holds the unredacted history;
  retiring it is coordinated with that owner (`docs/PRD.md` §5, step 6).
- **Source:** `git rev-parse "handover-baseline^{commit}"` → `862e40b`; `docs/REPLICATION_REPORT.md`.

### D65 · The local workspace folder is the git repository
`Active` · 16-Oct-2026
- **Context:** Upstream, the working folder had no `.git` and pushes went through a temp clone
  (`OPERATING_MANUAL.md:648-653`). Inputs lived on the outgoing owner's Desktop (`:534-536`).
- **Decision:** Work directly in the repository. Sensitive or bulky local folders are gitignored except
  their READMEs: `monthly-updates/` (inbox `00_INBOX/`, then one `YYYY-MM_Mon-YYYY` folder per data
  month), `backups/` and `handover-archive/`.
- **Rationale:** One copy of the truth, with workbooks kept out of git by `.gitignore`.
- **Alternatives / supersedes:** The clone-copy push (D41) and the Desktop source folder. Backups move
  from `index.html.bak_*` beside the page to `backups/` (amends D53).
- **Consequences:** The repository sits under OneDrive, so the large-file staleness warning still
  applies (`OPERATING_MANUAL.md:352-355`). `*.xlsx` and `*.pptx` stay ignored everywhere.
- **Source:** `.gitignore:10-24`; commit `0f33137`.

### D66 · Preview server serves only `site/`, on 127.0.0.1
`Active` · 16-Oct-2026 · **verified in code**
- **Context:** The `serve.js` in `docs/PRD.md` §4.3 served the repository root on all interfaces; the
  repository root now also holds the monthly workbooks.
- **Decision:** `.claude/serve.js` serves `site/` only, binds `127.0.0.1:8080` (`PORT` env override),
  and answers 403 for any path outside `site/`.
- **Rationale:** The workbooks in `monthly-updates/` must never be reachable from the network.
- **Alternatives / supersedes:** Supersedes the PRD §4.3 server; refines D28.
- **Consequences:** `npm run serve` (or `node .claude/serve.js`) → http://127.0.0.1:8080/.
- **Source:** `.claude/serve.js:4-12, 33-37`; `.claude/launch.json`.

### D67 · Shared Claude config, package manifest and LF line endings tracked
`Active` · 16-Oct-2026 · **verified in code**
- **Context:** Upstream ignored all of `.claude/` and had no `package.json`; the PRD said to recreate
  both by hand (`docs/PRD.md` §2.2).
- **Decision:** Track `.claude/agents/`, `.claude/skills/`, `.claude/serve.js` and `.claude/launch.json`
  (the rest of `.claude/` stays ignored). Track `package.json` and `package-lock.json` (pin `xlsx`
  0.18.5; scripts `serve`, `verify`). `.gitattributes` enforces `eol=lf` and forces text diffs for
  `tools/rename_schemes.js`, which contains a literal NUL.
- **Rationale:** A fresh clone works as is; the tools' `xlsx` must match the page's SheetJS 0.18.5; the
  production bytes are LF (`docs/PRD.md` §2.3).
- **Alternatives / supersedes:** Ignoring `.claude/` (D41); a hand-run `npm install xlsx@0.18.5`
  (`OPERATING_MANUAL.md:677`).
- **Consequences:** `npm ci` restores the only tool dependency. Local Claude settings stay private.
- **Source:** `.gitignore:39-45`; `.gitattributes`; `package.json`; commit `0f33137`.

### D68 · Changes go branch → PR → verify → merge
`Active` · 16-Oct-2026
- **Context:** Upstream committed straight to `main`: web uploads until 24-Jun-2026, then local pushes.
- **Decision:** Every change goes on a branch (`data/<YYYY-MM>` for monthly refreshes; `feat/`, `fix/`,
  `docs/`, `chore/` otherwise), then a pull request, which runs the `verify` job. Merging to `main`
  publishes.
- **Rationale:** The parity gate, and any review, run before anything reaches the live site.
- **Alternatives / supersedes:** Direct pushes to `main` (D41).
- **Consequences:** Commit the six deploy files together with any tools changed
  (`docs/PRD.md` §5.1). Branch protection is not configured, so `verify` is not a *required* check
  (checked 16-Oct-2026; enabling it is an owner decision, `docs/DEPLOYMENT.md`). The transfer itself
  used `setup/transfer-baseline`, before this convention existed.
- **Source:** `.github/workflows/pages.yml` (`pull_request` trigger; `publish` only on `main`).

### D69 · `Centricity_Risk_Matrix.js` stays in `site/` for parity
`Superseded by D78` (19-Oct-2026) · 16-Oct-2026 · **verified in code**
- **Context:** Nothing has loaded the file since `RISK_MATRIX` was baked inline (D3), but upstream
  tracked and published it.
- **Decision:** Keep it in `site/`, beside `index.html`.
- **Rationale:** The published file set stays identical to the old site, and `fold_duplicate_names.js`
  looks for the file beside the HTML.
- **Alternatives / supersedes:** Delete it or move it out of `site/`; either changes the published set.
- **Consequences:** A stale public file: content as on 30-Jun-2026, still carrying `c`. Tracked as a
  known issue in `docs/KNOWN_ISSUES.md` (R5).
- **Source:** `tools/fold_duplicate_names.js:257-261`; `site/Centricity_Risk_Matrix.js:1`;
  `site/index.html` mentions it only in comments (`:5087-5089`, `:7184`).

---

## Tool and page fix decisions (Oct-2026 onward)

### D70 · `DATA_DATES.analytics` labels the MF analytics only
`Active` · 16-Oct-2026 (`71fa58a`) · **verified in code**
- **Context:** `merge_pms_aif_analytics.js` wrote its `--as-on` into `DATA_DATES.analytics`, the one
  "Analytics as on" label that the footer, the analytics tabs, the Excel export and the deck show for
  the Equity/Hybrid/Debt MF analytics. Run after the bake, it relabelled them (`KNOWN_ISSUES.md` A3).
- **Decision:** Only the MF analytics tools (`bake_month.js`, `merge_analytics.js`) set
  `DATA_DATES.analytics`. The look-through tool writes no date: `--as-on` stays required and is
  printed, and the look-through as-on is recorded in the update log and `docs/PROJECT_STATE.md`.
- **Rationale:** Fixes the client-facing date without changing page data or UI. No part of the page
  shows a separate look-through date, so a new key would be written but never read.
- **Alternatives / supersedes:** A `DATA_DATES.pmsAnalytics` key (the suggestion in A3): page data
  with no reader, worth adding only with a UI label (a feature). A gate refusing when the two dates
  differ: they differ in most cycles (the look-through lags), so it would block the step.
- **Consequences:** Run order against the bake no longer matters for the label. The look-through date
  lives only in the docs. `merge_analytics.js` still re-dates all three MF classes when it re-bakes
  one.
- **Source:** `tools/merge_pms_aif_analytics.js:200-205`; `site/index.html:1450`.

### D71 · Centricity Select merge refuses join failures and mass drops
`Active (extended by D76)` · 16-Oct-2026 (`2ad7f61`) · **verified in code** · amends D56
- **Context:** `merge_reckoner.js` wrote any membership whose keys exist in MASTER. A join failure
  drops a Select entry silently: in Sep-2026, before the `prev_name` tier, the list went 178 -> 160
  and lost two categories with every gate passing (`KNOWN_ISSUES.md` A4).
- **Decision:** Three more write gates, which also fail the dry run: (1) no dropped entry whose
  category also holds a deck name that matched nothing; (2) at most 5% of the current list dropped;
  (3) no category emptied. `--accept-drops <n>` waives (2) and (3) only when the run drops exactly n,
  after the owner has read the DROPPED list. (1) is never waived: the fix is a `PIN`,
  `add_reckoner_funds.js`, or a `NO_MASTER_NOTE` entry (exact deck names, which do not trip it).
- **Rationale:** Matches the pattern by category, which catches SEBI renames whose names share
  nothing but the AMC. 5% (8 of 178) clears normal monthly churn (2 drops between the Aug and Sep
  decks) and stops the Sep-2026 failure (20). Tying the waiver to the exact count makes a re-run
  with a different result refuse again.
- **Alternatives / supersedes:** Fuzzy name pairing of DROPPED and NO MASTER MATCH (misses renames
  like All Seasons Bond -> Dynamic Term); a fixed count; a flag that waives every gate.
- **Consequences:** A new deck fund with no MASTER record, in a category that also loses a fund,
  stops the run until the owner decides (it was already a D61 stop). A renamed fund filed under a
  different heading is not paired, so the manual read of both lists stays. The dry-run exit code is now
  meaningful for this tool (A2).
- **Source:** `tools/merge_reckoner.js:5-11` (header), `:194-199`, `:207-211`, `:282-299`,
  `:316-317`, `:343-348`.

### D72 · One contract for every tool: exit codes, gates before writes, atomic writes, strict CLI
`Active` · 19-Oct-2026 (PR #3 `32943e8`; PRs #7–#11; PR #15 `184939e`; PR #19, 21-Oct-2026) · **verified in code**
- **Context:** Eight tools exited 0 from a dry run with a failed gate, every tool overwrote files in
  place, several wrote two files (or one file twice) one after the other, and unknown flags were
  ignored, so a typo such as `--aply` became a silent dry run (`KNOWN_ISSUES.md` A2, A8, F2). D61
  publishes automatically, so exit codes and partial writes matter.
- **Decision:** Every tool: (1) exits **0** when every gate passed, **1** when a gate failed (dry
  run or `--apply`; `--apply` then writes nothing), **2** on a usage or input error (unknown flag,
  stray word, value flag with no value, bad `--as-on`, missing or duplicate input file, missing
  `--html` page: every tool checks its paths before reading, since PR #19 of 21-Oct-2026, which
  removed the last `ENOENT` crashes); (2) prints each gate as PASS or `***`
  (normally `GATE <name>: PASS | *** FAIL …`; a few print `***` and a reason, and
  `fold_duplicate_names.js` omits the `GATE` prefix) and decides before any write; (3) builds
  every output in memory and writes once through `tools/lib/blocklib.js` (`writeFileAtomic`: temp file + rename, the rename retried for up to 6.3 s on `EPERM`/`EBUSY`/`EACCES`, PR #20;
  `writeFilesAtomic`: check every output, then write); (4) finds blocks with `B.locate`, which
  refuses a second literal; (5) takes dates only as plain labels (`checkAsOn`) set through
  `setDataDate` / `replaceOnce`. Overrides are explicit flags reserved for the owner's decision
  (`--accept-drops`, `--allow-coverage-drop`, `--allow-shrink`, `--allow-layout-change`).
- **Rationale:** A dry run's exit code can then be trusted by a script or a reviewer, and a crash, a
  full disk or a sync clash can no longer leave a truncated page.
- **Alternatives / supersedes:** Reading every gate by eye with exit 0 meaning nothing; backups as
  the only protection. Amends D42 and D53 (procedure unchanged; the guarantees move into the tools).
- **Consequences:** A two-file write is still two renames, so the backup step stays; `CHECK`, `WARN`
  and count lines never fail a run and must still be read. `verify_page.js` follows the same rule
  (exit 1 on a hard failure); it has no flags and reads its first argument as the folder.
  `npm test` runs `tools/test/*.test.js` in CI.
- **Source:** `tools/lib/blocklib.js:60-82`, `:115-151`; e.g. `tools/bake_month.js:20-38`, `:225-244`;
  `tools/verify_page.js:88-94`; `.github/workflows/pages.yml` (unit-test step).

### D73 · Workbook dates are calendar days (`isoDay`); inception corrected
`Active` · 19-Oct-2026 (PRs #7, #8, #11, #12; data PR #13; PR #14) · **verified in code** · amends D46
- **Context:** SheetJS 0.18.5 with `cellDates` returns 23:59:50 of the previous day on an IST machine,
  and the tools and the page took `toISOString().slice(0,10)`, so every date read from a workbook was
  one day early (`KNOWN_ISSUES.md` A6). MASTER and SIF inception dates were baked a day early.
- **Decision:** Read every Excel date as the nearest local calendar day: `tools/lib/dates.js`
  `isoDay` in the tools, the same rule in the page's `parseMfMonitor` and the SIF sibling's
  `parseSif`. Re-bake the Sep-2026 inputs once (PR #13: 1,851 MASTER and 30 SIF inception dates +1
  day). `rename_schemes.js` carried a one-day allowance until the corrected dates were live, then
  compared the exact day again (PR #14).
- **Rationale:** A date has no time zone; the tools must give the same answer on any machine, and a
  bake must equal an upload.
- **Alternatives / supersedes:** `XLSX.SSF.parse_date_code` on raw serials (kept as
  `isoDayFromSerial`); upgrading SheetJS (ruled out for parity, R4); keeping the allowance for good
  (it could pair a scheme with a same-AMC launch from the day before).
- **Consequences:** 2,070 of the 2,072 Sep Monitor rows in MASTER now carry the exact inception
  (C16 and one legacy record differ). Reading the true date, `rename_schemes.js` finds 8 renames it
  used to miss; they wait for the owner (`docs/PROJECT_STATE.md`).
- **Source:** `tools/lib/dates.js`; `tools/rename_schemes.js:93`, `:128-135`, `:149`; `isoDay` in
  `site/index.html` (`parseMfMonitor`); `isoDayLite` in `site/Centricity_SIF_Refresh.js:111`;
  `docs/update-log/2026-09_Sep-2026.md` (Run 2).

### D74 · Source reliability flags reach the page as `fl`
`Active` · 19-Oct-2026 (PRs #9, #12; data PR #13) · **verified in code** · supersedes D45
- **Context:** The risk workbook's Data Flags sheet calls some funds' risk statistics unreliable, but
  the page showed them as ordinary numbers in a client-facing tab and slide (`KNOWN_ISSUES.md` C3).
- **Decision:** `merge_risk_matrix.js` adds `fl` to a RISK_MATRIX entry: `split` when the note says
  a NAV split makes the risk stats unreliable (split outranks low correlation), `lowcorr` for low
  correlation to the benchmark (β < 0.30). Unflagged entries get no key. Not carried: a split that
  affects Max Drawdown only (not shown on the page) and short-history flags (those funds show "—").
  The page marks a flagged fund with a dagger and `H.RISK_FLAG_NOTE` on the Portfolio Matrix tab and
  its slide (`H.riskFlagged(entry)`).
- **Rationale:** The source's own warning reaches the reader of the proposal; numbers are not hidden.
- **Alternatives / supersedes:** Supersedes D45 (pending). Hiding flagged figures (would drop data
  the desk publishes); flagging all 40 split notes, including the 12 about Max Drawdown only.
- **Consequences:** Sep-2026: 33 flagged (28 `split`, 5 `lowcorr`). The Excel export has no
  RISK_MATRIX sheet; the Select popover is not marked (C18, since fixed); the footnote could overlap
  a slide with about 22 or more funds (C17, fixed by PR #21; since D82 the footnote sits in the slide's
  footer block and the table is fitted or continued above it).
- **Source:** `tools/merge_risk_matrix.js:21-29`, `:129-136`, `:201-202`; `H.riskFlagged`,
  `H.RISK_FLAG_NOTE` in `site/index.html`.

### D75 · Hand pins live in `tools/data/pins.json`
`Active` · 19-Oct-2026 (PR #10) · **verified in code** · amends D54
- **Context:** `REPIN` (`merge_pms_performance.js`), `PINS` (`pin_pms_alias.js`), `PIN`
  (`merge_reckoner.js`) and `PIN` (`merge_aif_performance.js`) were separate copies that had to change
  together, and a deliberate trailing space in a key was easy to lose (`KNOWN_ISSUES.md` A18, A25).
- **Decision:** One data file, `tools/data/pins.json`: `pms_alias` (each entry `key`, with `repin`
  and/or `pin`), `reckoner` (deck name → MASTER name), `aif_performance` (deck names looked up in
  `reckoner`), notes, and a `trailing_space` list per section. The four tools load it and exit 1 if a
  name's edge spaces disagree with that list. "Still pinned null" is built from the live alias map.
- **Rationale:** One place to edit a pin, so two tools cannot drift apart.
- **Alternatives / supersedes:** Keeping the maps in code and editing them together.
- **Consequences:** A vendor rename is a reviewed edit of `pins.json` with the owner (D61), never a
  code change. `add_reckoner_funds.js` keeps its own `ADD` list; `merge_pms_aif_analytics.js` keeps its
  own look-through `PIN`.
- **Source:** `tools/data/pins.json` (`_about`); `tools/merge_pms_performance.js:36-53`;
  `tools/pin_pms_alias.js:29-41`; `tools/merge_reckoner.js:45-60`, `:137`;
  `tools/merge_aif_performance.js:43-66`.

### D76 · Reckoner merge refuses a drop under an unmapped deck heading
`Active` · 19-Oct-2026 (PR #10) · **verified in code** · extends D71
- **Context:** Review of D71 found a bypass: rows under a deck heading that `GRID` does not map (a
  renamed heading such as "Focused Fund" for "Focused Funds") never reach `resolve()`, so their funds
  drop with every D71 gate passing.
- **Decision:** A fourth gate, never waived by `--accept-drops`: fail when a dropped Select entry
  matches a fund listed under an unmapped heading (same normalised name ignoring spaces, or at least
  80% of words shared). The fix is to map the heading in `GRID` and re-run.
- **Rationale:** A heading rename is a mapping failure, not an editorial drop.
- **Alternatives / supersedes:** Letting `--accept-drops` waive it; strict name equality (would miss
  small rewordings).
- **Consequences:** A heuristic: a rename sharing less than 80% of words is not caught, so the manual
  read of DROPPED against the deck stays. The real Aug-2026 deck has no unmapped heading.
- **Source:** `tools/merge_reckoner.js:11-13`, `:198`, `:205`, `:300-317`.

### D77 · CDN scripts carry SRI; page asks not to be indexed; inline favicon
`Active` · 19-Oct-2026 (PR #12) · **verified in code**
- **Context:** The five CDN scripts loaded without `integrity`, so a compromised CDN response would
  run in every user's page (`KNOWN_ISSUES.md` R3). The public page had no `noindex` (R2, D60), and
  browsers fetched a missing `/favicon.ico` (F3).
- **Decision:** `integrity="sha384-…"` and `crossorigin="anonymous"` on all five tags, hashes taken
  from the served files; Chart.js from `dist/chart.umd.js` (jsDelivr's `.min` is generated on the fly
  and unfit for SRI); `<meta name="robots" content="noindex, nofollow">`; `<link rel="icon"
  href="data:,">`. Library versions unchanged.
- **Rationale:** A tampered library is refused by the browser, at no runtime cost.
- **Alternatives / supersedes:** Vendoring the libraries into `site/` (more deploy files). Keeps D60
  (still public).
- **Consequences:** A CDN that changes a file's bytes stops the page loading until the hash is
  updated in a reviewed PR; never update a hash without re-checking the file. Upgrading a library
  stays forbidden for parity.
- **Source:** `site/index.html:3`, `:1224-1228`.

### D78 · The unused `Centricity_Risk_Matrix.js` moves to `docs/archive/`
`Active` · 19-Oct-2026 (PR #12) · **verified in code** · supersedes D69
- **Context:** D69 kept the 30-Jun-2026 file in `site/` for parity, so a stale, unloaded file was
  published (`KNOWN_ISSUES.md` R5).
- **Decision:** Move it unchanged to `docs/archive/Centricity_Risk_Matrix_2026-06-30.js`.
- **Rationale:** The page never loads it; the deploy set is still the six files.
- **Alternatives / supersedes:** Supersedes D69. Deleting it (it is the only Python-route reference
  output, useful for a parity run).
- **Consequences:** The live URL returns 404. `fold_duplicate_names.js` skips its check when the file
  is absent; `build_risk_matrix.py` refuses any output inside `site/`.
- **Source:** `git show 3a75afb --stat`; `tools/fold_duplicate_names.js:305-311`;
  `tools/build_risk_matrix.py:43-47`.

### D79 · Rename history kept in `prev_names`; stale old-name keys dropped
`Active` · 19-Oct-2026 (PR #7; page PR #12) · **verified in code** · amends D46
- **Context:** When a store already had an entry under the live name, the old-name entry was kept,
  unreachable; a second rename overwrote `prev_name`, losing the first name (`KNOWN_ISSUES.md` A5).
- **Decision:** The live-name entry wins; the stale old-name entry is dropped and listed. A record
  renamed again keeps `prev_name` = its immediate old name and gains `prev_names` = every earlier
  name, oldest first; a key from two renames ago moves to the live name; a name live in MASTER is
  never mapped away. `H.buildFundIndex` indexes `prev_names` too.
- **Rationale:** No orphan keys, and an old allocation sheet or link still resolves.
- **Alternatives / supersedes:** Keeping both entries; a single `prev_name`.
- **Consequences:** Each run lists about 15 dropped keys that the bake re-creates under old workbook
  names; harmless. No MASTER record carries `prev_names` yet (none renamed twice).
- **Source:** `tools/rename_schemes.js:19-23`, `:221-277`; `H.buildFundIndex` in `site/index.html`.

### D80 · Refresh-only Monitor sheets: refresh existing records, never create; unknown sheets fail the bake
`Active` · 19-Oct-2026 (PR #17) · **verified in code**
- **Context:** Four Regular MF Monitor fund sheets (`Debt Oriented34`, `Solution Oriented,ETFs,FOFs`,
  `Solution Oriented - Childrens `, `Hybrid`) were in no parser list, so their rows were skipped and
  215 MASTER funds kept 30-Jun-2026 figures under the 30-Sep label (`KNOWN_ISSUES.md` C19). Each
  sheet mixes MASTER classes (Debt ETF, International, Hybrid Other, Solution Oriented).
- **Decision:** A second list in the page parser, `REFRESH_ONLY_SHEETS`. A row there refreshes an
  existing MASTER record by exact name (same fields as a mapped sheet; `Debt Oriented34` read
  debt-style) and never creates a record or changes taxonomy, name, `prev_name` or IRR bands. A name
  also on a mapped sheet keeps the mapped sheet's figures (a pre-pass, so sheet order does not
  matter); unmatched rows are returned in `skipped`. The parser alone owns both sheet lists and
  reports `unclassified`, `emptySheets`, `sheetRows` and `monitorNames`; `bake_month.js` keeps no
  copy, prints what it reports, and FAILs on any fund row on a sheet in neither list, or on a page
  that does not report it.
- **Rationale:** `SHEET_MAP` entries would switch on record creation with one guessed taxonomy per
  sheet, and the 8 pending renames, whose new names sit on these sheets, would be created as
  duplicates. One parser serves the bake and the Section-7 upload, so both behave the same (D42). A
  new or renamed fund sheet is a mapping failure that must stop the run, not a silent skip (as in
  D76); the gate raised no false alarm on the six Monitors of 15-May to 30-Sep-2026.
- **Alternatives / supersedes:** `SHEET_MAP` entries (record creation, guessed taxonomy); a taxonomy
  guessed per row from the name; a second copy of the lists in `bake_month.js` (two lists to drift);
  the sheets in `rename_schemes.js` `SHEET_SUB` (its tier-3 pairing then invents the rename SBI CPSE
  Bond Plus SDL Sep 2026 → SBI CRISIL-IBX SDL June 2034); a WARN instead of a FAIL.
- **Consequences:** A new fund or a pending rename on these sheets is listed as not merged; a new
  fund is added to MASTER by hand with the owner, and a renamed record refreshes once the rename is
  applied. Blank cells keep old values here as on mapped sheets (C19, C20). The Section-7 upload
  message adds `· N rows not merged`. A desk adding or renaming a fund sheet stops the bake until the
  sheet is classified in `site/index.html`.
- **Source:** `site/index.html:3211-3227`, `:3304-3329`, `:3395-3403`, `:3464-3480`;
  `tools/bake_month.js:152-169`, `:212-220`; `tools/rename_schemes.js:50-52`;
  `tools/test/parser_refresh_only.test.js`.

### D81 · Publish the C19 re-run now; keep values from blank Monitor cells; hold the C20 G-Sec record
`Active` · 21-Oct-2026 (PR #18) · **owner decision**
- **Context:** Sep-2026 Run 3 gives the 215 funds the parser had skipped their September figures
  (`KNOWN_ISSUES.md` C19). Two things in it were the owner's call: 12 Debt ETF durations / maturities
  stay at earlier values because the Monitor cell is blank (the parser's non-null merge, the same rule
  on every sheet; 7 records then show duration above maturity), and the JioBlackRock Nifty 8-13 yr
  G-Sec record, refreshed alone, would pair the Regular plan's inception with the Direct plan's
  pre-launch 3- and 6-month returns (C16, C20). The architect review had ruled that the D61 monthly
  auto-publish does not cover this correction.
- **Decision (owner, 21-Oct-2026):** publish Run 3 now. Keep the 12 blank-cell values as they are
  (existing rule). Keep the G-Sec record held at its live values until C20 is decided.
- **Rationale:** 214 funds had shown three-month-old figures under the current date; the fix was
  recomputed independently from the Monitor (3,758 field checks, 0 mismatches). Changing the merge
  rule for one release would make these records behave unlike every mapped-sheet record; the C20
  question applies to 13 records and is better answered once for all of them.
- **Alternatives / supersedes:** wait for the C20 decision before publishing; clear the blank-cell
  values; publish the G-Sec record refreshed with its r3m / r6m cleared by hand.
- **Consequences:** C19 closed; C20 open with one record held (released in the change that applies
  the C20 decision). The non-null merge stays the rule: a blank Monitor cell never clears a stored
  value, so the update log names any kept values that matter.
- **Source:** `docs/update-log/2026-09_Sep-2026.md` (Run 3);
  `monthly-updates/2026-09_Sep-2026/_review/run3_2026-10-19/5_hold_c20.txt` (local only);
  `site/index.html` non-null merge in `parseMfMonitor`.

### D82 · The PowerPoint export lays out every native slide through one measured design system
`Active` · 22-Oct-2026 (PR #26, merge `5d39821`) · **owner decision: approved after the rendered sample deck**
- **Context:** The exported proposal broke on real data: the Investment Option table ran off the slide
  (rows and GRAND TOTAL lost) because rows per slide (21), row height (0.24") and column widths were
  fixed; notes sat at fixed y and ran into the footer rule; the rationale was one text box; doughnut
  labels overlapped; four performance slides were 70–80% blank; the matrix overflowed without a flag
  (C22). Audit: `docs/proposal-output-format-audit.md`.
- **Decision:** a design system inside the export IIFE of `site/index.html` (no new deploy file, no new
  library, pptxgenjs 3.12.0 unchanged): `DS` measures and type scale; `TXT`, one fixed Cambria
  width table and a word-wrap that predicts PowerPoint (calibrated: 197 of 200 cells); `applyMaster`
  with a fitted title and a page number on every native slide; `footerBlock` for notes and the "as
  on" stamp; `columnWidths` / `rowHeights` / `planTable`, which pick the largest type (11 → 8pt) that
  fits one slide or continue the table at 9pt with the header repeated, totals on every page, rows
  spread evenly, no orphan group heading and a "(continued)" context row; a layout log that warns
  about any block outside the frame. Slide rules built on it: the rationale as a card grid; legends
  carrying the doughnut values; bar charts without the unit-less axis; Fund Performance buckets that
  fit together share a slide, PMS and AIF split by asset class and dated `DATA_DATES.pms`, market-cap
  columns only where the data carry a split; the matrix fitted or continued, or a coverage list when
  no instrument has risk data, its average row showing the covered share; more than twelve AMCs end in
  one "Other AMCs (n)" bar. The slide order of PRD §9.2 and the GRAND TOTAL on every Investment
  Option page are kept.
- **Rationale:** fit is computed from the data, so any portfolio — 3 or 45 instruments, long names —
  stays inside the slide without dropping content or shrinking everything; one measured system
  replaces a set of fixed positions that each failed differently.
- **Alternatives / supersedes:** Supersedes the C17 `mk` shrink (PR #21). Rejected: shrinking all
  text to fit (illegible at 40+ rows); pptxgenjs `autoPage` (its added slides skip the master and the
  logo); `fit:'shrink'` (PowerPoint applies it only on edit); canvas `measureText` (depends on the
  fonts of the machine and is not available to the Node tests); a separate sibling script (a seventh
  deploy file, D1); re-laying the Disclaimer image (compliance text, desk source — C34).
- **Consequences:** C22 closed. The deck's slide count now follows the data (continuation slides;
  fewer performance slides). Image slides are not numbered, but the slide-number field counts them,
  so native slides show their true position; a single-tab export starts at 1. Regression test
  `tools/test/pptx_layout.test.js` (in CI). A page-code change of the export must keep the layout log
  free of warnings.
- **Source:** `buildDeck` and the design-system block before it in `site/index.html`;
  `window.EXPORTS._ds`; `tools/test/pptx_layout.test.js`; `docs/proposal-output-format-audit.md`.

### D83 · The deck marks an expected 1Y/3Y/5Y figure with `*` (`H.isExpectedReturn`)
`Active` · 22-Oct-2026 (PR #26, merge `5d39821`) · **owner decision: approved with the rendered sample; financial-data review 22-Oct-2026**
- **Context:** Bonds, FDs and many AIF/PMS records hold their yield or IRR band mid-point in r1y/r3y/r5y
  (`tools/merge_bond_list.js`, `tools/add_reckoner_funds.js`; D55 keeps a mid-point where the PMS
  source is blank). The deck showed them as past performance, e.g. 3Y and 5Y returns for a fund
  launched in January 2024 (C28). The hand-finished reference deck marks such cells "*".
- **Decision:** `H.isExpectedReturn(fund, key, entry)` is true for the screen's IRR-mid-point fallback
  (`H.isFallbackReturn`); for a stored record with 1Y = 3Y = 5Y and no 1M/3M/6M/2Y/SI (the two tools'
  convention; 83 records, no false positive); and for a PMS/AIF period its performance source leaves
  blank. It reads the stored MASTER record and skips a period the user overrode, so a Direct-plan
  figure or a user's own return is never marked. The Investment Option and Fund Performance slides add
  `*` to such a figure and one note: the figure is the expected return held in the data, not past
  performance; weighted rows include these figures. Values are unchanged; weighted rows are not marked.
- **Rationale:** the limitation reaches the client without hiding or changing a number, and only with
  rules traced to the code that wrote the values.
- **Alternatives / supersedes:** clearing the figures (changes data and the weighted rows — owner
  decision, C28); marking every bond and AIF by product class (would mark real AIF track records);
  matching values to the current band mid-point (fails for the 12 stale mid-points).
- **Consequences:** the screen still marks only the fallback and the Excel marks nothing (C28). Weighted
  rows that include expected figures are explained by the note, not marked.
- **Source:** `H.isExpectedReturn` next to `H.isFallbackReturn` in `site/index.html`; `star()` in
  `buildDeck`.

---

## Inherited decisions (D1–D59)

### Deploy & architecture

#### D1 · A deploy is six files, loaded in a fixed order
`Active` · Jul-2026 · **verified in code**
- **Context:** Five sibling scripts change `window.*` globals on every load; `index.html` alone
  silently reverts data.
- **Decision:** Ship `index.html` with all five siblings. ExtraSlides and PMS_AIF_Terms load in
  `<head>`; June_Refresh → IRR_Offshore → SIF_Refresh load in that order after `#root`.
- **Rationale:** IRR_Offshore edits the GIFT City bucket June_Refresh installs; SIF_Refresh after
  IRR_Offshore avoids a fund-name collision.
- **Consequences:** Upstream committed a script tag before its file four times; `Centricity_SIF_Refresh.js`
  returned 404 for 16 days (upstream `47699c4` → `c308f8d`). The CI file check now enforces the set (D63).
- **Source:** `OPERATING_MANUAL.md:16-44`; `site/index.html:1232-1233, 5083-5085`.

#### D2 · Fold siblings 3–5 into the embedded blocks
`Open` · standing intent
- **Context:** Siblings 3–5 re-apply on every load, overriding baked edits to the GIFT City bucket, 12
  PMS/AIF look-through entries, the SIF rows and the IRR bands.
- **Decision:** Fold June_Refresh, IRR_Offshore and SIF_Refresh into `index.html` and delete them. Not started.
- **Rationale:** Removes the six-file trap and the "write both places" rules (D24, D49, D50).
- **Consequences:** Until then, any tool touching GIFT City, PMS/AIF look-through, SIF or IRR bands must
  write the sibling too. Never fold as part of a data refresh.
- **Source:** `OPERATING_MANUAL.md:42-44, 1190`; `docs/PRD.md` §14 item 1.

#### D3 · `RISK_MATRIX` baked inline; never re-add its script tag
`Active` · 24-Jul-2026 · **verified in code**
- **Context:** The matrix first shipped as the sibling `Centricity_Risk_Matrix.js` (upstream `cfeec6e`).
- **Decision:** Bake it into `index.html` and drop the `<script src>` (upstream `33819cc`).
- **Rationale:** One copy of the data; a re-added tag would duplicate or override the inline block.
- **Alternatives / supersedes:** Loading the sibling file.
- **Consequences:** The file remains as an unused artefact (D69); `build_risk_matrix.py` still writes it
  as a by-product (`docs/runbooks/Risk_Matrix_Update_Prompt.md:6, 15`).
- **Source:** `OPERATING_MANUAL.md:46-48`; no tag for it in `site/index.html` (comments only).

#### D4 · `Centricity_Dashboard.html` deprecated
`Superseded` (not transferred) · last synced 22-Jun-2026
- **Context:** A predecessor page missing later features; `index.html` edits never reached it.
- **Decision:** Treat it as deprecated; retire-or-sync was left open.
- **Consequences:** Closed at handover: the file was not transferred, and the PRD marks it "Not needed".
- **Source:** `OPERATING_MANUAL.md:58, 1192`; `docs/PRD.md` §2.2.

#### D6 · The embedded `DATA_DATES` is authoritative
`Active` · 13-Aug-2026 · **verified in code**
- **Context:** `Centricity_June_Refresh.js` stamped `DATA_DATES.analytics = "30th June 2026"` on every
  load, silently reverting later bakes.
- **Decision:** Remove the stamp (upstream `4e67438`). The embedded block owns the dates, except
  `DATA_DATES.sif`, which the SIF sibling owns (D50).
- **Consequences:** If an as-on date will not stick, check the siblings before the embedded block.
- **Source:** `OPERATING_MANUAL.md:133-135`; `site/Centricity_June_Refresh.js:14-17`.

#### D28 · Serve over http, not `file://`
`Active` (refined by D66)
- **Decision:** Preview through a local http server.
- **Rationale:** The siblings load either way, but the export paths and the uploaders break under `file://`.
- **Source:** `OPERATING_MANUAL.md:426-435`.

#### D41 · Push via a temp clone; raise the public-repo issue
`Superseded` by D60, D63, D65, D68 · 13-Oct-2026 (upstream `ba8baa5`)
- **Context:** The outgoing owner's project folder had no `.git`.
- **Decision:** Clone `main` to a temp folder, copy the tracked files over it, check `git diff --stat`,
  push. Raise the public-repo issue before pushing. Ignore `*.bak_*`, `*.bak[0-9]*`, `*.xlsx`, `*.pptx`,
  `.claude/`.
- **Alternatives / supersedes:** Web-UI uploads, used until 24-Jun-2026.
- **Consequences:** The ignore patterns survive in `.gitignore`; `.claude/` is now partly tracked (D67).
- **Source:** `OPERATING_MANUAL.md:645-663`.

### UI/layout

#### D7 · Three-column workspace; Section 7 lives in the left rail
`Active` · 19-Aug-2026 (upstream `4a3e71f`; the manual dates the layout 13-Aug)
- **Decision:** A collapsible left rail holds Section 7 Data Refresh; `main.col-main` holds Sections
  1–6 and the Master Editor; a right-hand `SectionNav` jump list only navigates. The two in-flow
  Section 7 cards stay in the tree behind `false &&`.
- **Alternatives / supersedes:** Section 7 in the main flow.
- **Consequences:** Open clean-up: delete the `false &&` branches only after confirming the rail covers
  both the live and the shared/frozen view.
- **Source:** `OPERATING_MANUAL.md:139-148`.

#### D8 · Nav scrolling animated by hand
`Active` · 19-Aug-2026 · **verified in code**
- **Context:** Chrome ignores `behavior:"smooth"` on a hidden or throttled page, and a hidden page gets
  no `requestAnimationFrame` callbacks, so nav links did nothing.
- **Decision:** Hand-rolled easing with a `document.hidden` short-circuit and a `setTimeout` safety net.
- **Alternatives / supersedes:** `scrollIntoView({behavior:"smooth"})`; do not revert to it.
- **Source:** `OPERATING_MANUAL.md:149-154`; `site/index.html:8590-8614`.

#### D9 · Header offset measured at click time
`Active` · 19-Aug-2026
- **Decision:** Measure `.app-header` when the link is clicked, so the sticky header never hides the
  target heading.
- **Alternatives / supersedes:** A fixed `scroll-margin-top`.
- **Source:** `OPERATING_MANUAL.md:155-156`.

#### D10 · Liquid-glass layer appended; palette tokens unchanged
`Active` · 19-Aug-2026
- **Decision:** Append the glass skin at the end of the stylesheet. Tints are alpha mixes of `--gold`,
  `--gold-deep`, `--tan`; an ambient wash sits on `body::before` and grain on `body::after`.
- **Rationale:** `backdrop-filter` needs something behind it; untouched tokens keep the brand.
- **Consequences:** Restyle through the glass layer, never by changing base tokens (`docs/PRD.md` §10).
- **Source:** `OPERATING_MANUAL.md:157-160`.

#### D11 · Collapsed rail uses two grid tracks
`Active` · 19-Aug-2026 · **verified in code**
- **Context:** A collapsed rail becomes `position:fixed`; with three tracks `<main>` landed in a
  zero-width column.
- **Decision:** `.layout.left-collapsed { grid-template-columns: minmax(0,1fr) var(--nav-w) }`.
- **Source:** `OPERATING_MANUAL.md:161-164`; `site/index.html:1075`.

#### D12 · No negative bottom margin on `.tab`
`Active` · 19-Aug-2026 · **verified in code**
- **Context:** When the Live Output tabs wrapped, `margin-bottom:-2px` made the two rows overlap.
- **Decision:** An override sets `margin-bottom: 0`; the base rule keeps `-2px` and is left as is.
- **Consequences:** Check with a rect-intersection sweep, not by eye.
- **Source:** `OPERATING_MANUAL.md:165-168`; `site/index.html:420` (base), `:1093-1094` (override).

#### D13 · No `overflow:hidden` on `.section-card`
`Active` · 19-Aug-2026
- **Decision:** Never clip `.section-card`.
- **Rationale:** The Centricity Select and Switch popovers overflow their card by design.
- **Source:** `OPERATING_MANUAL.md:171-172`.

#### D29 · The selected logo is stamped on every slide
`Active` · 25-Aug-2026 (upstream `6a95017`)
- **Context:** The user picks a logo in the header switcher: a preset or an uploaded file.
- **Decision:** `stampLogo` puts `window.__SELECTED_LOGO` on every slide via `LOGO_HEADER` /
  `LOGO_CLOSING`. Slide images carry no baked-in logo. Always wrap: `forEach(img => imgSlide(img))`.
- **Rationale:** The chosen branding everywhere, with no double stamps.
- **Alternatives / supersedes:** Logos baked into slide images.
- **Consequences:** Delete logo pictures and slide-number placeholders before rendering decks (D30,
  D31). Verify by image geometry.
- **Source:** `OPERATING_MANUAL.md:439-463`.

#### D30 · Closing slides rendered at 2001×1125
`Active` · 25-Aug-2026 (upstream `6a95017`)
- **Context:** The Disclaimer and Thank You slides are native shapes; there are no images to extract.
- **Decision:** Render through PowerPoint COM after deleting the logo picture and slide-number
  placeholder: Disclaimer as PNG, Thank You as JPEG, both 2001×1125.
- **Rationale:** PNG is crisper and smaller for text; JPEG is smaller for the photograph.
- **Consequences:** `update_closing_slides.js` checks the size and refuses unless the dividers and
  market images survive untouched.
- **Source:** `OPERATING_MANUAL.md:465-484`.

#### D31 · Market slides: render, re-encode at q82, pick the deck by content
`Active` · 13-Aug-2026 (upstream `351cd6a`); extended 13-Oct-2026 (upstream `140257c`)
- **Context:** The deck's file name changes month to month; the Oct-2026 deck had 6 slides and baked-in
  logos; a re-issued deck keeps the same name.
- **Decision:** Render via COM at 2001×1125 and re-encode as JPEG q82. Take whichever market deck is in
  the month folder, whatever its name. A changed slide count is a gate to confirm, not a failure.
  Detect re-issues by `LastWriteTime` plus a pixel diff.
- **Alternatives / supersedes:** A name-matched deck of exactly 5 slides.
- **Consequences:** Only the `market` key is replaced. The re-encode is a second lossy pass, so look at
  the densest slide.
- **Source:** `OPERATING_MANUAL.md:486-528`.

#### D38 · Allocation Sheet round-trip
`Active` · 31-Jul-2026 (upstream `c308f8d`)
- **Context:** Nothing persists between sessions (`docs/PRD.md` §1, non-goals).
- **Decision:** Download and re-upload a five-column sheet (Asset Class, Product Class, Instrument Name,
  % Total, Amount (Cr.)). The reader takes any column order, derives % from Amount when % is absent,
  rescales 0–1 fractions and reports unmatched names.
- **Rationale:** This is how a proposal is saved and reopened. Names resolve via D40.
- **Source:** `OPERATING_MANUAL.md:614-617`.

#### D39 · Return overrides live on the selection and are applied last
`Active` · 18-Aug-2026 (upstream `05c88ec`; the manual files it under 31-Jul) · **verified in code**
- **Context:** `H.toDirect` replaces 1Y/3Y/5Y wholesale, so flipping to Direct discarded hand edits.
- **Decision:** Store `r1yOv`/`r3yOv`/`r5yOv` on the selection entry, never on MASTER, and evaluate
  `H.applyOverrides(H.applyPlanSelected(…))`.
- **Rationale:** An edit belongs to one proposal and outranks the plan overlay.
- **Alternatives / supersedes:** The reverse evaluation order.
- **Source:** `OPERATING_MANUAL.md:618-625`; `site/index.html:8716`.

#### D40 · Tiered fund-name resolution; ambiguity reported
`Active` · 31-Jul-2026 (upstream `c308f8d`) · **verified in code**
- **Context:** Hand-typed names omit plan suffixes, and an upload allocates real money.
- **Decision:** `H.resolveFundName` tries exact → case/space-normalised → plan suffix stripped → unique
  prefix → token similarity (every typed word must appear). Ties are reported as ambiguous (tie-breaks
  prefer Growth over IDCW, Regular over Direct). `H.planBaseName` strips a whitelist of suffixes only.
- **Rationale:** Substitutions must stay visible; suffixes such as `(Inbound)` or `(Lock in)` mark
  different instruments.
- **Alternatives / supersedes:** Exact match only.
- **Consequences:** Never widen `planBaseName` to strip any parenthesis.
- **Source:** `OPERATING_MANUAL.md:627-641`; `site/index.html:2470-2479` (`planBaseName`), `:2527`
  (`resolveFundName`).

### Data model & taxonomy

#### D14 · Taxonomy filter uses the names chain, not `split("/")`
`Active` · 27-Aug-2026 (upstream `ac8bde2`) · **verified in code**
- **Context:** `REIT/InvIT` and `Value / Contra` contain "/", so splitting the tree path built filters
  that matched nothing.
- **Decision:** `TreeNode` passes a `names` array down the recursion; the slash path is only the React
  and expand/collapse key.
- **Alternatives / supersedes:** `path.split("/")`.
- **Source:** `OPERATING_MANUAL.md:178-188`; `site/index.html:5239-5243, 5286-5291` (the split at
  `:5547` is only a fallback).

#### D15 · SIF split into Equity SIF / Hybrid SIF
`Active` · 25-Aug-2026 (upstream `c2b9ad1`; the manual says 21-Aug) · **verified in code**
- **Context:** A SIF's strategy exists only in its scheme name.
- **Decision:** Two product classes, read from the name by `split_sif_add_mld.js`, which refuses to
  guess. The split lives in the array in `Centricity_SIF_Refresh.js`. The 12 legacy
  `product_class: "SIF"` rows in `index.html` stay unclassified so the sibling's delete filter still
  catches them. Scope goes only through `H.isHybridScheme` / `H.isEquitySIF`.
- **Alternatives / supersedes:** A single `SIF` class.
- **Consequences:** Now 16 Equity SIF / 14 Hybrid SIF (the manual's 15/13 is stale). The delete filter
  matches the three class names exactly plus a normalised-name match, not `/SIF$/` as the manual says.
- **Source:** `OPERATING_MANUAL.md:191-206`; `site/Centricity_SIF_Refresh.js:44-51`.

#### D16 · MLD is a Debt class; missing rating = Unrated
`Active` · 25-Aug-2026 (upstream `c2b9ad1`, `1260ce6`)
- **Decision:** MLD is a product class under Debt. `H.isSelfDescribingDebt` (Bonds + MLD) gates both the
  debt scope and the debt aggregator. MLD gets its own sector bucket; its tenure case precedes the
  asset-class branches; a missing rating means "Unrated".
- **Rationale:** Defaulting to "AAA & Equiv" would overstate credit quality.
- **Alternatives / supersedes:** The bond desk's AAA default.
- **Source:** `OPERATING_MANUAL.md:208-210, 271-276`.

#### D20 · Index Fund is a sub-category of Mutual Fund
`Active` · 25-Aug-2026 (upstream `b1ba035`) · **verified in code**
- **Context:** As a product class it was nested only in the tree (`H.displayPC`), not in tables,
  exports or the allocation sheet.
- **Decision:** `product_class: "Mutual Fund"`, `sub_category: "Index Fund"`, set in three places:
  `SHEET_MAP['Index']`, `H.fofUnderlyingName` (matches on `sub_category`) and `PC_ORDER`. Defensive
  `'Index Fund'` keys stay.
- **Alternatives / supersedes:** `product_class: "Index Fund"` with display-only nesting.
- **Consequences:** Miss one place and it half-reverts. Re-run `fold_index_funds.js` (idempotent) if a
  stray record reappears.
- **Source:** `OPERATING_MANUAL.md:278-296`; `site/index.html:3168`.

#### D21 · ETF stays a class; plural "Mutual Funds" is deliberate
`Active` · pre-existing
- **Decision:** ETF stays its own product class. `product_class: "Mutual Funds"` (plural) marks
  international feeder funds (asset class Global Funds).
- **Rationale:** Merging them breaks the Global Funds tab. Do not "fix" either (`docs/PRD.md` §0).
- **Source:** `OPERATING_MANUAL.md:298-305`.

#### D22 · Fold duplicate spellings; the Monitor's spelling wins
`Active` · 17-Sep-2026 (upstream `1ce60e9`)
- **Context:** Five funds sat in MASTER twice under two spellings with different returns, which
  `rename_schemes.js` cannot detect.
- **Decision:** `fold_duplicate_names.js` keeps the MF Monitor's spelling, moves only house/static
  fields, re-keys the IRR band and `DIRECT_PERF` overlay, and stamps `prev_name`. Never "prettify" a
  name the Monitor does not use.
- **Rationale:** The next bake re-creates whatever spelling the Monitor quotes.
- **Alternatives / supersedes:** Closes the manual's open item 8.
- **Consequences:** Keep 0 duplicate names; the CI gate checks it (D63).
- **Source:** `OPERATING_MANUAL.md:307-350`.

#### D24 · GIFT City edits also go into the June sibling
`Active` · 20-Aug-2026 (upstream `d55acea`)
- **Context:** Sibling #3 replaces the whole GIFT City bucket with its own `NEW_GIFT` list on every load.
- **Decision:** Every GIFT City add or edit is also written to `Centricity_June_Refresh.js`;
  `add_reckoner_funds.js` writes both.
- **Rationale:** A fund added only to the embedded block disappears in the browser.
- **Consequences:** The tell is a Select key that stops resolving (`verify_page.js` prints it). D2
  would remove this rule.
- **Source:** `OPERATING_MANUAL.md:386-395`.

#### D46 · Rename before every bake; identity = inception + AMC
`Active (amended by D73: exact calendar day; D79: prev_names history)` · 17-Sep-2026 (upstream `1ce60e9`; Aug-2026 cycle)
- **Context:** SEBI's name standardisation renamed 217 schemes; baking without renaming would have added
  about 215 duplicate funds.
- **Decision:** `rename_schemes.js` runs first. It matches in three tiers (normalised name → inception +
  AMC → AMC + category 1-to-1), reports ambiguity, re-keys every name-keyed store including the IRR map
  in the IRR sibling, stamps `prev_name`, and does not execute the siblings.
- **Rationale:** Names are not stable identities.
- **Alternatives / supersedes:** Name as identity.
- **Consequences:** `H.buildFundIndex`, `merge_reckoner.js` and `merge_risk_matrix.js` consult `prev_name`.
- **Source:** `OPERATING_MANUAL.md:737-781`; `docs/PRD.md` §12.

### Analytics & credit

#### D17 · Fixed seven-bucket credit vocabulary
`Active` · 03-Sep-2026 (upstream `2f74506`, `bc76e4c`) · **verified in code**
- **Context:** 27 distinct rating strings produced unexpected slices.
- **Decision:** Buckets `SOV`, `AAA/A1+`, `AA+`, `AA & Below`, `Cash & Equivalents`, `Unrated`,
  `Others`. `H.creditBucket` maps every string; `(SO)`-style suffixes are stripped; AAA/A1+ is tested
  before the AA catch-all. Unrated = unrated debt or blank; Others = non-debt or an unknown new string.
  `aggDebt` and `aggDebtScoped` share the helper.
- **Alternatives / supersedes:** Ad-hoc strings, and a six-bucket version (upstream `2f74506`) that
  filed equity and REITs as Unrated, reversed 8 minutes later.
- **Consequences:** The manual's heading still says "six-bucket"; the code has seven.
- **Source:** `OPERATING_MANUAL.md:212-238`; `site/index.html:2144`.

#### D18 · Rating chart reads the full rating map
`Active` · 14-Oct-2026 (upstream `72e1f1e`) · **verified in code**
- **Context:** Bucketing only the top-20 holdings left a diversified fund's chart at about 43%.
- **Decision:** `H.fundRatingBuckets` reads the per-fund `rating` / `db_rating` map (holdings only as a
  fallback); `H.normaliseRatings` rescales to exactly 100%; fixed `H.CREDIT_COLORS` on screen and in the
  PPT; the legend shows each bucket's %.
- **Alternatives / supersedes:** Top-20 bucketing, which upstream `b61f115` had accepted as "known".
  Closes `docs/PRD.md` §14 item 9.
- **Consequences:** The Top 20 Issuers table stays top-20, by design.
- **Source:** `OPERATING_MANUAL.md:240-249`; `site/index.html:2171, 2189, 2201`.

#### D19 · Holdings overlap is symmetric
`Active` · 08-Sep-2026 (upstream `d1eaa04`) · **verified in code**
- **Context:** Rows-vs-map subtracted one side's negative rows, so A-vs-B ≠ B-vs-A (11.94 vs 12.40),
  and twin funds read over 100%.
- **Decision:** Overlap = Σ min(wA, wB) over two weight maps (normalised company keys, duplicates
  summed, non-positive dropped), canonical argument order, capped at 100; non-stock rows stripped with
  anchored patterns.
- **Alternatives / supersedes:** Rows-vs-map.
- **Consequences:** Verify across all pairs: 0 asymmetric, none outside [0, 100].
- **Source:** `OPERATING_MANUAL.md:251-269`; `site/index.html:1864-1886`.

#### D37 · Exclude no-holdings funds; no fabricated fallbacks
`Active` · 31-Jul-2026 (upstream `c308f8d`)
- **Context:** Two fallbacks invented figures: a fund-level m-cap guess and a flat 80% AAA / 20% SOV
  credit profile.
- **Decision:** Remove both. `H.hasEqHoldings` / `H.hasDbHoldings` gate chips and aggregation; excluded
  funds are listed, not dropped silently.
- **Rationale:** No invented numbers in client-facing output. The principle recurs in D16, D17, D43,
  D55 and `docs/PRD.md` §12.
- **Source:** `OPERATING_MANUAL.md:609-613`.

#### D47 · Variant fill after every bake
`Active` · 13-Aug-2026 (upstream `4e67438`)
- **Context:** `parseAnalytics` merges: a scheme absent from this month's workbook keeps last month's
  holdings under the new date.
- **Decision:** Run `fill_variant_analytics.js` after every bake. It fills from another option of the
  same scheme, preferring Growth/Regular.
- **Rationale:** Options of one scheme share one portfolio.
- **Consequences:** Whatever is still missing must be chased upstream.
- **Source:** `OPERATING_MANUAL.md:785-787, 924-944`.

#### D48 · One hybrid predicate for all four analytics gates
`Active` · 20-Aug-2026 (upstream `d55acea`) · **verified in code**
- **Context:** Four gates inlined `asset_class === 'Hybrid' && product_class === 'Mutual Fund'`,
  dropping SIFs from the analytics.
- **Decision:** `H.inEquityScope`, `H.inDebtScope`, `H.aggEquityScoped` and `H.aggDebtScoped` all call
  `H.isHybridScheme`; the equity aggregator tries the hybrid store, then the equity store.
- **Alternatives / supersedes:** Four inlined tests. Never re-inline them.
- **Source:** `OPERATING_MANUAL.md:789-817`; `site/index.html:2230, 2246, 2254, 2288, 2379`.

#### D49 · PMS/AIF look-through is written in two places
`Active` · 20-Aug-2026 (upstream `6f30601`, `b954ffc`) · **verified in code**
- **Context:** `Centricity_June_Refresh.js` re-assigns 12 PMS/AIF `EQUITY_ANALYTICS` entries from
  May-2026 on every load.
- **Decision:** `merge_pms_aif_analytics.js` writes the block and the sibling's `EQ`. `Holding(%)` is a
  fraction (×100); key on `Corrected Name`; pin scheme names by hand; report unmapped schemes.
  `blocklib.writeBlocks` derives its `</html>` guard from the input file.
- **Rationale:** Otherwise those schemes revert to May data.
- **Consequences:** The workbook can be re-issued mid-cycle; re-check the scheme count. D2 would remove
  the second write.
- **Source:** `OPERATING_MANUAL.md:819-853`; `tools/lib/blocklib.js:37-46`.

#### D51 · Re-key SIF analytics via `sif_raw`
`Active` · 20-Aug-2026 (upstream `d55acea`)
- **Context:** Workbooks name a SIF without its AMC prefix, so its holdings sat under unreachable keys.
- **Decision:** `rekey_sif_analytics.js` joins exactly on the `sif_raw` field the SIF sibling records.
  Run it after every bake, because `parseAnalytics` re-creates the workbook-named keys.
- **Rationale:** An exact join, no fuzzy matching.
- **Consequences:** SIFs absent from the workbooks altogether must be chased upstream, not re-keyed.
- **Source:** `OPERATING_MANUAL.md:897-922`.

#### D52 · `DIRECT_PERF` on MASTER's scale; atomic m-cap split
`Active` · 13-Aug-2026 (upstream `43124a7`)
- **Context:** The Direct parser showed m-cap 100× too large, read wrong column names, and merged a
  partial m-cap split (summing to 108%).
- **Decision:** Match `parseMfMonitor` field for field and scale for scale, with exact headers
  (`YTM (%)`, `Average Maturity Years`, `Ratio`). Take all four m-cap buckets together, blank = 0.
  `DIRECT_PERF` is rebuilt, not merged.
- **Rationale:** `H.toDirect` substitutes these fields wholesale into client-facing output.
- **Consequences:** Regular and Direct m-cap splits must be identical; if not, scale or merge is wrong.
- **Source:** `OPERATING_MANUAL.md:942-969`.

### Monthly tooling & data hygiene

#### D23 · Source-quirk rules for issuers and bonds
`Active` · Aug-2026 (upstream `6c0a751`, `b61f115`)
- **Decision:** `H.parseIssuer` strips coupon, series and maturity from both ends (trailing
  parenthetical first). Normalise non-breaking and doubled spaces. MF Monitor footer rows are not funds.
  A text exit-load cell means missing. Read bond maturity from the name (century typo). Dedupe bonds on
  issuer + maturity.
- **Rationale:** Vendor quirks otherwise fragment issuers and create fake adds and wrong dates.
- **Source:** `OPERATING_MANUAL.md:361-385`.

#### D25 · Join `sebi_mcap` by name; top-10 Large Cap gate
`Active` · 28-Jul-2026 · **verified in code**
- **Context:** A row-position join shipped for about 8 months.
- **Decision:** Join by company name. Gate: the top 10 by market cap must all read "Large Cap".
- **Alternatives / supersedes:** The row-position join.
- **Source:** `OPERATING_MANUAL.md:396-398`; `tools/merge_de_universe.js:4-6, 97-98`.

#### D26 · Direct Equity renames only on strong evidence
`Active` · Sep-2026 data cycle
- **Context:** The Direct Equity universe file has no ISIN, so a renamed company arrives as a new listing.
- **Decision:** Rename in place (stamping `prev_name`) only when the sector matches, market cap is within
  3% and the old name is contained in the new one. Otherwise report the pair.
- **Rationale:** A guess on market cap alone could merge different companies.
- **Consequences:** Each month, set the tool's "new listings" against its "not in this month's file" list.
- **Source:** `OPERATING_MANUAL.md:399-409`.

#### D27 · Find the header row; refuse silent no-ops
`Active` · 13/14-Oct-2026 (upstream `489ee33`, `261cd07`) · **verified in code**
- **Context:** A `>>CTB Output` banner made the expense merge join nothing; a re-issued Direct Equity
  returns file had an empty 5Y column that would have wiped every 5Y return.
- **Decision:** Find the header row by its label (`Scheme Name`, `Company Name`). Refuse to write on 0
  joins or on any wholly empty return column.
- **Alternatives / supersedes:** Reading row 1 as the header.
- **Source:** `OPERATING_MANUAL.md:410-422`; `tools/merge_expense_exitload.js:129-130`;
  `tools/merge_direct_equity_returns.js:118-123`.

#### D32 · Expense ratio and exit load are wired
`Active` · 13-Aug-2026 (upstream `4e67438`)
- **Decision:** `merge_expense_exitload.js` writes `MASTER.expense` and `exit_load`. `Ratio` is the
  total TER; the Regular row's `Direct Plan Ratio` feeds `DIRECT_PERF`. Sanity bound 8%.
- **Rationale:** SIF and long-short schemes genuinely run 4–6% or more.
- **Alternatives / supersedes:** An earlier note saying these were not wired.
- **Source:** `OPERATING_MANUAL.md:564-574`; `tools/merge_expense_exitload.js:122`.

#### D33 · Fund managers from the roster; "current" per scheme
`Active` · 17-Sep-2026 (upstream `1ce60e9`)
- **Context:** The Monitor gives one manager per fund, and AMCs report to different month-ends.
- **Decision:** `merge_fund_managers.js` names the whole team. A manager is current when their `To Date`
  is the scheme's latest and within 90 days of the file's latest date.
- **Alternatives / supersedes:** The Monitor's `[Fund Manager 1]` only.
- **Consequences:** `fund_mgr` is internal only (Master Editor, Section 3 search), so a multi-name value
  is safe.
- **Source:** `OPERATING_MANUAL.md:576-589`.

#### D34 · `AMFI CODE.xlsx` stays unwired
`Active`
- **Decision:** Do not wire it in a refresh; MASTER has no field for it.
- **Rationale:** Adding the field is a feature, not a refresh.
- **Source:** `OPERATING_MANUAL.md:591-592`.

#### D35 · As-on precedence: picker → file name → in-file date
`Active` · 31-Jul-2026 (upstream `c308f8d`)
- **Context:** The 30-Jun workbook's internal date said 29 June.
- **Decision:** `REFRESH.parseMfMonitor` takes the date from the picker, then the file name, then the
  file's own date. `parseSif` mirrors this order.
- **Source:** `OPERATING_MANUAL.md:596-598, 877-878`.

#### D36 · Direct Equity returns and a Listed Direct Equity bucket
`Active` · 31-Jul-2026 (upstream `c308f8d`, `be01d9f`, `174ba4e`)
- **Decision:** `merge_direct_equity_returns.js` bakes 3M–5Y returns onto Direct Equity records, shown
  as pills and as a "Listed Direct Equity" bucket in the Performance Sheet (screen, Excel, PPT). The
  tool takes paths as arguments.
- **Rationale:** No hard-coded admin paths in a public repository (upstream `174ba4e`).
- **Consequences:** Two different files are named "Listed Direct Equity"; only the returns file feeds
  this tool.
- **Source:** `OPERATING_MANUAL.md:560-562, 599-608`.

#### D42 · Bake with the page's own parsers; dry-run by default
`Active (amended by D72: exit codes, atomic writes)` · 13-Aug-2026 (upstream `4e67438`) · **verified in code**
- **Decision:** `bake_month.js` runs the page's inline parsers in a Node `vm` (skipping CDN scripts and
  siblings) and writes the globals back. The monthly order is fixed, with `rename_schemes.js` first.
  Every tool is a dry run unless given `--apply`.
- **Rationale:** A bake equals what the Section 7 uploader would produce; one parser cannot drift.
- **Consequences:** Read the gates before adding `--apply`.
- **Source:** `OPERATING_MANUAL.md:667-688`; `tools/bake_month.js:5-6, 63-72`.

#### D50 · SIF Monitor baked into the SIF sibling; always ÷100
`Active` · 17-Sep-2026 (upstream `1ce60e9`); ÷100 fix 13-Oct-2026 (upstream `828d51e`) · **verified in code**
- **Context:** SIF returns stayed null unless someone uploaded a sheet; later, `parseSif` treated values
  under 1 as already decimal.
- **Decision:** `merge_sif_monitor.js` runs the sibling's own `REFRESH.parseSif` in a `vm`; the sibling
  sets `DATA_DATES.sif` unconditionally; Monitor returns are always ÷100; appended schemes get nothing
  invented (no AMC prefix, no IRR band).
- **Rationale:** One parser; the embedded "—" placeholder is truthy and would otherwise win.
- **Alternatives / supersedes:** Upload-only SIF data. Closes the manual's open item 6.
- **Consequences:** The ±300% gate cannot catch a ÷100 error; spot-check small returns.
- **Source:** `OPERATING_MANUAL.md:855-895`; `site/Centricity_SIF_Refresh.js:97-102`.

### Reckoner / PMS / AIF

#### D54 · PMS performance replaced wholesale; pins by hand
`Active (amended by D75: the pins moved to tools/data/pins.json)` · 20-Aug to 28-Sep-2026 (upstream `d55acea`, `7be34c7`, `ac4347b`) · **verified in code**
- **Context:** The vendor renames schemes, changes sheet names and repeats rows.
- **Decision:** Run PMS before the Reckoner. Replace `PMS_PERFORMANCE.pms` wholesale (`aif`, `benchmarks`
  carried over). Find the sheet by header; keep the richer duplicate row; decide AUM units per column.
  `PMS_PERF_ALIAS` is kept by hand: edit vendor renames in `REPIN` and `PINS` together;
  `pin_pms_alias.js` writes nothing if any pin fails.
- **Rationale:** A wrong pin puts another manager's numbers on a client's fund.
- **Alternatives / supersedes:** Last-row-wins; sheet lookup by tab name.
- **Consequences:** The deck is named for the month it ships; read the as-on date off the slide.
- **Source:** `OPERATING_MANUAL.md:1004-1059`; `tools/merge_pms_performance.js:21, 89, 112`;
  `tools/pin_pms_alias.js:41-61`.

#### D55 · AIF performance from the Reckoner deck
`Active` · 21-Aug-2026 (upstream `2cbaf13`; the manual says 20-Aug)
- **Context:** AIF had no recurring workbook and sat frozen at May-2026; the PMS file covers PMS only.
- **Decision:** `merge_aif_performance.js` parses the deck's AIF grid; benchmarks (with 2Y) come from the
  PMS–EQUITY grid. Blank allocation buckets are not back-filled. Where the deck prints "-", MASTER keeps
  the IRR-band midpoint.
- **Rationale:** The deck is the only recurring source.
- **Alternatives / supersedes:** Frozen May-2026 data. Closes the manual's open item 5.
- **Consequences:** `*`-footnoted rows may be a different series, so large moves can be genuine.
- **Source:** `OPERATING_MANUAL.md:1061-1088`.

#### D56 · Centricity Select from the deck, on 33 fixed categories
`Active (amended by D71)` · 20-Aug-2026 (upstream `d55acea`); `prev_name` resolve 28-Sep-2026 (upstream `b00cb2d`) · **verified in code**
- **Context:** A looser parser created 300 phantom funds; without `prev_name` the Sep-2026 run fell from
  178 to 160 entries.
- **Decision:** Parse performance grids only. `resolve()` tries name → `prev_name` → normalised forms.
  Pin on `sub_category`, never name similarity. Re-read `NARRATIVE` monthly. Report deck buckets with no
  Select category; never auto-add. Write gate: every key exists in MASTER.
- **Rationale:** A Select badge is a house recommendation, not a data point.
- **Consequences:** If the DROPPED list mirrors the NO-MATCH list, stop: it is a join failure. A deck
  product with no MASTER record is a universe change (`add_reckoner_funds.js`). Since D71 the tool
  refuses the mirror, a drop of more than 5% and an emptied category itself.
- **Source:** `OPERATING_MANUAL.md:1090-1156`; `tools/merge_reckoner.js:146-158, 265, 321` (lines as of
  D71, which added the drop gates).

### Risk matrix

#### D43 · Node route into `RISK_MATRIX`; drop `c`
`Active` (premise reopened) · 18-Sep-2026 (upstream `8e49d3a`) · **verified in code**
- **Context:** The outgoing machine had no Python, so `build_risk_matrix.py` (the canonical derivation,
  and the only source of `c` and `RISK_MATRIX_BENCH_SD`) could not run.
- **Decision:** `merge_risk_matrix.js` ingests the pre-computed `Fund Risk Ratios & 3Y Rolling`
  workbook, drops `c` (3Y CAGR) and leaves `RISK_MATRIX_BENCH_SD` as it was (now stale).
- **Rationale:** The UI and PPT export read nine keys, not `c`; an old CAGR under a new date is stale data.
- **Alternatives / supersedes:** The Python route.
- **Consequences:** Python 3.14 with pandas, numpy and openpyxl is now installed on the owner's machine,
  but the Python route is not validated against pandas 3.x. Whether to return to it is open.
- **Source:** `OPERATING_MANUAL.md:691-709`; `tools/merge_risk_matrix.js:13, 175`.

#### D44 · Risk joins via `prev_name` and plan-base; ambiguity refuses
`Active` · 18-Sep-2026 (upstream `8e49d3a`)
- **Context:** The risk workbook uses pre-rename names.
- **Decision:** Join exact → `prev_name` → plan-base (the unique Growth/Regular row); an ambiguous match
  refuses the write. The `DATA_DATES.riskMatrix` line is rewritten directly, not through `blocklib`.
- **Rationale:** Renamed funds would otherwise drop out silently; the hand-formatted `DATA_DATES` object
  would not survive a `blocklib` round-trip.
- **Source:** `OPERATING_MANUAL.md:711-721`.

#### D45 · Data Flags are not surfaced in the UI
`Superseded by D74` (19-Oct-2026) · 18-Sep-2026
- **Context:** In the 30-Sep-2026 file, 45 funds show risk stats the source flags as unreliable (NAV
  split, or β < 0.30).
- **Decision:** Pending: add a UI marker (a flag on `RISK_MATRIX` records plus a footnote).
- **Rationale:** It is a feature, not a refresh.
- **Consequences:** Until then these numbers show without warning in a client-facing tab.
- **Source:** `OPERATING_MANUAL.md:723-735, 1213-1217`; `docs/PRD.md` §14 item 3.

#### D58 · Rf = 4.5%, pending desk confirmation
`Open`
- **Context:** The risk-matrix ratios use Rf = 4.5% as the desk convention; the manual notes the 91-day
  T-Bill at about 5.26%.
- **Decision:** Pending: re-confirm with the desk.
- **Source:** `OPERATING_MANUAL.md:1221-1222`; `docs/PRD.md` §14 item 11.

### Process

#### D5 · The original README is stale; do not follow it
`Superseded` by D62
- **Context:** The README described `tools/*.py` scripts and a cdnjs CDN; neither existed.
- **Decision:** Do not follow it; rewrite it after the transfer.
- **Consequences:** The original is archived as `docs/archive/README_original_2026-05.md` (`cd05c97`);
  the root `README.md` is rewritten for the new layout.
- **Source:** `OPERATING_MANUAL.md:59, 1191`; `docs/PRD.md` §14 item 2.

#### D53 · Refresh procedure: back up, replace one block, verify
`Active` (amended by D65; D72 makes each write atomic, backups still taken)
- **Decision:** Identify the block or sibling the source file drives; back up; replace only that block;
  read the changed ranges; confirm the file still ends with `</html>`.
- **Rationale:** Keep each edit small and reversible in a 12.8 MB file with multi-MB lines.
- **Consequences:** Backups now go in `backups/` (local only), not beside the page in `site/`.
- **Source:** `OPERATING_MANUAL.md:995-1000`.

#### D57 · Verify by re-deriving in a `vm`; the rename canary
`Active` (automated by D63)
- **Decision:** Re-derive counts by running the page's scripts in document order in a Node `vm`
  (`tools/verify_page.js`), not from documents. Select keys present in MASTER is the rename canary.
- **Rationale:** The code wins over any document, this one included (`docs/PRD.md` §12).
- **Consequences:** `React is not defined` errors are expected inside the `vm`.
- **Source:** `OPERATING_MANUAL.md:1160-1184`.

#### D59 · Check Portfolio Review after a refresh
`Active`
- **Context:** Portfolio Review shares this project's analytics, AMC and overlap engine; the MF Screener
  is a separate repository with no shared code.
- **Decision:** After a refresh here, check Portfolio Review. Do not apply the
  `centricity-dashboard-issues` skill to this project.
- **Source:** `OPERATING_MANUAL.md:1224-1230`; `docs/PRD.md` §1.

---

## Upstream → local commit map

Matched by date and subject, and checked by content: `git diff <upstream> <local>` shows no
difference for any pair except the redacted `Portfolio_Review_Build_Prompt.md` (D64). Use the local
SHA for `git show` in this repository.

| Upstream | Local | Date | Subject (abridged) |
|---|---|---|---|
| `47699c4` | `a79e16d` | 15-Jul-2026 | June Updates (SIF_Refresh tag added) |
| `cfeec6e` | `86d5182` | 16-Jul-2026 | updatesss (Risk_Matrix sibling added) |
| `33819cc` | `091875f` | 24-Jul-2026 | matrix updated (RISK_MATRIX inlined) |
| `c308f8d` | `ae6779d` | 31-Jul-2026 | MF Monitor as-on date, DE returns, allocation round-trip |
| `be01d9f` | `3597888` | 31-Jul-2026 | CLAUDE.md + DE returns merge tool |
| `174ba4e` | `5134bf4` | 31-Jul-2026 | Take paths as arguments in merge_direct_equity_returns.js |
| `6c0a751` | `c43faa2` | 06-Aug-2026 | Bonds > Invictus refresh |
| `4e67438` | `8d1cf62` | 13-Aug-2026 | Bake July 2026 data |
| `43124a7` | `079d8a4` | 13-Aug-2026 | Fix M-Cap 100x in Direct mode |
| `b61f115` | `c0d1bd4` | 13-Aug-2026 | Collapse issuer names |
| `351cd6a` | `5f34f2a` | 13-Aug-2026 | Market Update → Aug 2026 |
| `05c88ec` | `cfd0705` | 18-Aug-2026 | Editable 1Y/3Y/5Y returns |
| `4a3e71f` | `d6632ee` | 19-Aug-2026 | Rework the workspace layout |
| `d55acea` | `b58ece3` | 20-Aug-2026 | Aug-2026 Reckoner + Jul PMS/hybrid; fix SIF analytics |
| `6f30601` | `a6a7c1b` | 20-Aug-2026 | PMS/AIF look-through as on 31 Jul |
| `b954ffc` | `7b89d85` | 20-Aug-2026 | PMS/AIF look-through, re-issued workbook |
| `2cbaf13` | `4c5b7f8` | 21-Aug-2026 | AIF performance as on 31 Jul |
| `b1ba035` | `5046ed1` | 25-Aug-2026 | Index Fund becomes a sub-category |
| `c2b9ad1` | `44738a1` | 25-Aug-2026 | SIF split; MLD added to Debt |
| `1260ce6` | `e85944c` | 25-Aug-2026 | Neo MLD feeds debt analytics |
| `6a95017` | `9dc19ec` | 25-Aug-2026 | New closing slides; logo on every slide |
| `ac8bde2` | `e7589b9` | 27-Aug-2026 | Taxonomy filter fix for "/" |
| `7be34c7` | `6ed5777` | 03-Sep-2026 | PMS sheet found by header |
| `2f74506` | `e3b0d72` | 03-Sep-2026 | Six-bucket credit vocabulary |
| `bc76e4c` | `42b78b9` | 03-Sep-2026 | Others split out of Unrated |
| `d1eaa04` | `274a667` | 08-Sep-2026 | Symmetric overlap matrix |
| `1ce60e9` | `9069d25` | 17-Sep-2026 | Aug-2026 refresh; SIF Monitor baked in |
| `8e49d3a` | `43accec` | 18-Sep-2026 | Portfolio Matrix as on 31 Aug |
| `ac4347b` | `9f43e28` | 28-Sep-2026 | PMS + AIF performance as on 31 Aug |
| `b00cb2d` | `a7b20a3` | 28-Sep-2026 | Centricity Select from the Sep-2026 Reckoner |
| `489ee33` | `52217ec` | 13-Oct-2026 | Sep-2026 data refresh |
| `ba8baa5` | `7fb1794` | 13-Oct-2026 | CLAUDE.md: record the push route |
| `828d51e` | `b0928cd` | 13-Oct-2026 | SIF returns always ÷100; Sep risk matrix |
| `140257c` | `bdd47bb` | 13-Oct-2026 | Re-issued Oct-2026 market deck |
| `261cd07` | `a554aae` | 14-Oct-2026 | DE returns as on 30 Sep |
| `72e1f1e` | `862e40b` | 14-Oct-2026 | Credit rating chart: full map (tag `handover-baseline`) |

---

## How to add a decision

1. Take the next free ID (D70 onward). Never reuse or renumber an ID, and never delete an entry.
2. Add a row to the index, then the entry under its area heading, with the same fields (Context,
   Decision, Rationale, Alternatives / supersedes, Consequences, Source) in 3–8 lines.
3. Cite evidence a reader can open: `path:line` in the code and the PR or commit that made the change.
   Write "verified in code" only after checking the current file.
4. When a decision replaces another, set the old one's status to `Superseded by Dnn` in both its entry
   and the index, and say what survives. Do not rewrite its history.
5. Land the entry in the same PR as the change (D68). If it changes a procedure or a trap, update
   `docs/MONTHLY_UPDATE_PROCESS.md`, `docs/KNOWN_ISSUES.md` or `CLAUDE.md` in that PR too.

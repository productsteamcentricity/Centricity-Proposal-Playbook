# Integration and regression log

| Field | Value |
|---|---|
| Version | 1 |
| Date | 28-Oct-2026 |
| Author chat | MOD-01 (writer W-state) |
| Status | Authoritative - the record of every merge to `main`, the baseline chain, incidents and the current live-site parity |
| Supersedes | none (first version; integration evidence was spread over `CHANGELOG.md`, `docs/PROJECT_STATE.md`, PR bodies and update logs, which stay as they are) |
| Next review | at every merge to `main` (Gate D, by the Moderator or `release-manager`); first by MOD-02 in TASK-016 |

Labels: **VERIFIED** (checked with a command or a cited record), **INFERRED** (reasoned from a named source),
**UNCERTAIN**, **UNKNOWN**. Times are UTC unless marked IST (UTC+5:30). PR numbers are GitHub PRs of
`productsteamcentricity/Centricity-Proposal-Playbook`. `site/index.html` line numbers drift; none are needed here.

Related records: what is open now -> [`../PROJECT_STATE.md`](../PROJECT_STATE.md) (single state document);
defects -> [`../KNOWN_ISSUES.md`](../KNOWN_ISSUES.md) (authoritative); approved decisions ->
[`../DECISIONS.md`](../DECISIONS.md); who may edit what -> [`FILE_OWNERSHIP_AND_CHANGE_CONTROL.md`](FILE_OWNERSHIP_AND_CHANGE_CONTROL.md)
and [`ACTIVE_CHANGE_REGISTER.md`](ACTIVE_CHANGE_REGISTER.md); regression-risk catalogue ->
[`KNOWN_ISSUES_AND_REGRESSION_RISKS.md`](KNOWN_ISSUES_AND_REGRESSION_RISKS.md); machine and git state ->
[`REPOSITORY_AND_ENVIRONMENT_STATE.md`](REPOSITORY_AND_ENVIRONMENT_STATE.md).

---

## 1. How this log is used

- One row in section 4 for every merge to `main`, plus a detailed entry (section 10 template) for every
  merge from 28-Oct-2026 on. Rows are never edited after the fact except to add a later finding, marked with its date.
- Section 3 always names the **last verified baseline**: the newest `main` merge that passed CI, whose live
  files equal `site/`, and whose `verify_page` and `npm test` results are recorded. Any recovery returns to it.
- A **site-content state** (S0, S1, ...) changes only when the bytes of `site/` change. Docs-only and
  tools-only merges keep the state; they still move the baseline SHA.
- Incidents keep the `INC-nn` numbers below; a new incident takes the next number (INC-18).
- Gate meanings (A implementation report, B Guardian review, C independent verification, D controlled
  integration, E acceptance) are defined in [`FILE_OWNERSHIP_AND_CHANGE_CONTROL.md`](FILE_OWNERSHIP_AND_CHANGE_CONTROL.md)
  and summarised in the section 10 template. Before 28-Oct-2026 there was no Guardian (ARC-01) and no
  ACTIVE_CHANGE_REGISTER, so PRs #1-#28 carry no Gate A/B records beyond their PR descriptions.

---

## 2. Baseline chain

### 2.1 Handover and transfer baselines (VERIFIED)

| Item | Value | Evidence |
|---|---|---|
| Upstream tip (outgoing owner) | `72e1f1e` (14-Oct-2026; last push 14-Oct-2026 10:37Z); `upstream/main` still `72e1f1e` on 28-Oct | `git rev-parse upstream/main`; `gh api repos/magazineishita1108-boop/Centricity-Proposal-Playbook/commits/main` |
| Handover baseline | annotated tag `handover-baseline` (tag object `4e4cfbf`) -> commit `862e40b`, the sanitised equivalent of `72e1f1e`: trees differ only in the 8-line client-name redaction of `Portfolio_Review_Build_Prompt.md` (D64); 74 commits each. CLAUDE.md's "= upstream `72e1f1e`" means "equivalent of". | `git diff --stat 72e1f1e 862e40b`; `git rev-list --count` |
| Baseline deploy blobs | all 8 root files identical between `72e1f1e` and `862e40b`: index.html `60106a8e04...`, ExtraSlides `b649397745...`, PMS_AIF_Terms `6636bbed4f...`, June `a918b32f0d...`, IRR `e2272de2a8...`, SIF `d65f9fee8f...`, robots `7d4da722ab...`, legacy Risk_Matrix `fe3826e8e4...` | `git rev-parse <commit>:<file>` |
| Baseline index.html | SHA-256 `5872958ddacd728b...`, 12,827,311 B = PRD section 2.3 = the old live site today | sha256 of `git show 862e40b:index.html`; old-site download 28-Oct |
| Transfer baseline | `25e71a3` = PR #1 merge (16-Oct-2026 07:15): files moved to `site/`, `tools/`, `docs/`; `site/` bytes identical to `862e40b`; first publish run 38866042211 (8 live files = `site/`). `bf20c08` = PR #2 merge (post-transfer record). | `docs/REPLICATION_REPORT.md` section 7; CHANGELOG 16-Oct entry |
| Current `main` | `2b2a397` = `origin/main` = PR #28 merge (27-Oct-2026 12:27, docs only) | `git rev-parse HEAD origin/main` (28-Oct) |

### 2.2 Site-content states on `main` (VERIFIED with `git rev-parse <merge>:site/<file>` across all 28 first-parent merges)

Every merge not listed as changing a state left `site/` byte-identical.

| State | Merges carrying it | What changed in `site/` | index.html blob / SHA-256 (first 16) | SIF sibling blob / SHA-256 (first 16) | Verification behind it |
|---|---|---|---|---|---|
| S0 | `862e40b` -> `25e71a3` (#1) ... `d260cdf` (#11) | Files moved root -> `site/` by git rename, bytes unchanged; 8 files published incl. legacy `Centricity_Risk_Matrix.js` | `60106a8e04` / `5872958ddacd728b` | `d65f9fee8f` / `cb11764f40d36309` | REPLICATION_REPORT sections 3, 7: blobs = PRD section 2.3; `verify_page` = PRD section 15; 25 tool dry-runs identical; browser parity (Excel 13 sheets, PowerPoint 25 slides); live 8/8 after run 38866042211 |
| S1 | `792692d` (#12) | Page code: in-page `isoDay`, risk dagger and footnote, shared-link banner, SRI on 5 CDN scripts, noindex, data-URI favicon; `Centricity_Risk_Matrix.js` moved to `docs/archive/` (D78) | `982426d589` / `c572f90c964c274a` | `71c9025c30` / `1ea7fa77a0381f51` | PR #12 body: qa-verifier in-browser on the exact tree (counts, console clean, Excel 13, PPT 25, 9 Live Output tabs); CHANGELOG "Live files equal site/ (SHA-256, 19-Oct-2026)" |
| S2 | `10cb44c` (#13) ... `6dc08ef` (#16) | Data: Sep-2026 Run 2 - 1,851 MASTER and 30 SIF inception dates +1 day; 33 RISK_MATRIX `fl` flags | `0f700db5b5` / `71c201085419c86c` | `be33ddb084` / `a2a515535462dc6e` | hashes equal `docs/update-log/2026-09_Sep-2026.md` Run 2 (re-hashed); rehearsed on a scratch copy first; backup `backups/2026-10-19_pre-sep-corrections/`; counts unchanged; `H.riskFlagged` 33 of 1,088 |
| S3 | `8e187ae` (#17) | Page code: `parseMfMonitor` `REFRESH_ONLY_SHEETS` (C19 code, D80) | `637736acc4` / `ef6984fdaf03db05` | unchanged | `parser_refresh_only.test.js` 18 checks (fail on the old parser); byte control of the Sep chain on scratch copies (old chain = live; new chain changes exactly 215 MASTER records) |
| S4 | `f37fa01` (#18) ... `0cb7e95` (#20) | Data: Sep-2026 Run 3 - 214 MASTER records to 30-Sep figures; JioBlackRock G-Sec record held (C20) | `0f36545677` / `a7a874960f19696c` | unchanged | hash equals update log Run 3; financial-data review 3,758 field checks, 0 mismatches; backup `backups/2026-10-19_pre-c19-rebake/`; owner approval 21-Oct-2026 05:51 |
| S5 | `75538de` (#21) | Page code: Portfolio Matrix slide shrinks when a fund is flagged (C17) | `dc34440da9` / `683af0d40556f933` | unchanged | PowerPoint COM measurement (25 funds: 7.87" -> 6.64"); unflagged `slide1.xml` identical to main |
| S6 | `fb9cbd6` (#22) ... `83f777c` (#25) | Page code: Select popover dagger and note (C18) | `620153b807` / `51d2428091bdc9ad` | unchanged | browser check (real and simulated flag); **live acceptance 21-Oct-2026 on `1523bbc` / `882160c`: all 7 areas PASS** (`docs/PROJECT_STATE.md:92-97` at `2b2a397`) |
| S7 (current) | `5d39821` (#26) -> `5bcce88` (#27) -> `2b2a397` (#28) | Page code: PowerPoint design system (D82) and `*` expected-return marker (D83) | `39337935b7` / `916f2455eebaf236` | unchanged | `pptx_layout.test.js` about 800 checks; real exports (3/4/8/15/30/45 instruments) rendered in PowerPoint and bounds-checked; owner go-ahead 22-Oct 15:36:58; after merge: run 39806564591, live 7/7 = `site/`, live 4-fund export 23 slides, no layout warning |

Since the baseline only `index.html` and `Centricity_SIF_Refresh.js` changed. `Centricity_ExtraSlides.js`,
`Centricity_PMS_AIF_Terms.js`, `Centricity_June_Refresh.js`, `Centricity_IRR_Offshore.js` and `robots.txt`
are still the baseline blobs (VERIFIED). `git diff --stat 862e40b 2b2a397 -- site/` shows only additions
because the files moved directory. The next state that changes `site/` becomes **S8**.

---

## 3. Last verified baseline

**`main` = `origin/main` = `2b2a397` (site content S7) - VERIFIED COMPLETE at parity level.**
Full browser acceptance of S7 is **IMPLEMENTED NOT FULLY VERIFIED** (TASK-064).

| Check | Result | Evidence |
|---|---|---|
| CI on the commit | push run 40503943213: `verify` success 12:28:08Z, `publish` success 12:29:03Z; deployment 7358413557 to `github-pages` for `2b2a397` | `gh run view`, `gh api .../deployments` |
| Live = working tree = HEAD | 7 of 7 published files identical by SHA-256 (section 7) | download of 28-Oct-2026 ~05:52 |
| `node tools/verify_page.js site` | exit 0; MASTER 7682; Select 178 (178 in MASTER); PMS 692 / AIF 12 / benchmarks 4; EQUITY_ANALYTICS 1205; RISK_MATRIX 1088; 0 duplicates; ends `</html>`; 0 script errors. Full output in [`REPOSITORY_AND_ENVIRONMENT_STATE.md`](REPOSITORY_AND_ENVIRONMENT_STATE.md) section 13 | run 28-Oct-2026 by the fact-sheet investigators and again by this writer at ~07:53 (identical) |
| `npm test` | exit 0; 5 of 5 files, 903 checks, 0 failures (blocklib 34, dates 10, parser_refresh_only 18, pptx_layout 798, tool_inputs 43) | run 28-Oct-2026 (`node tools/test/run.js`) |
| App startup in a browser | VERIFIED 28-Oct-2026 at `2b2a397` (`preview_start playbook`): React root rendered, in-browser MASTER 7,682, `window.H`/`REFRESH`/`EXPORTS` present, all three sibling flags set, 0 console errors | MOD-01 startup check (see REPOSITORY_AND_ENVIRONMENT_STATE section 13.4) |
| Full browser acceptance (TESTING.md section 3, all areas, Excel opened in Office) | **not run on S7.** Last full pass: S6, 21-Oct-2026 (7 areas PASS). After PR #26 only the live 4-fund deck export was checked (22-Oct: 23 slides, no layout warning) | `docs/PROJECT_STATE.md:92-109` at `2b2a397`; TASK-064 |
| Repo health | `git status` clean before the package; `git fsck --connectivity-only` passes; historical and stash blob reads partly fail with `mmap failed` (R6, not a code defect) | REPOSITORY_AND_ENVIRONMENT_STATE section 14 |

Recovery points if a later merge breaks the site:

| Kind of change | Return to | How |
|---|---|---|
| Page code, tools or docs | `2b2a397` (S7) | revert the bad merge in a new PR (section 9) |
| Monthly data refresh | the pre-refresh backup that the refresh itself must create in `backups/<date>_<tag>/` (CLAUDE.md rule 3) | restore the six deploy files on a branch, PR, merge (section 9) |
| Existing backups | `backups/2026-10-19_pre-sep-corrections/` = S1 deploy files (before PR #13; index.html `c572f90c964c274a`, SIF `1ea7fa77a0381f51`); `backups/2026-10-19_pre-c19-rebake/` = S3 (before PR #18; index.html `ef6984fdaf03db05`, SIF `a2a515535462dc6e`). Both are older than S7: restoring them would undo later page code. Use them only for their data blocks. | VERIFIED: SHA-256 of the backup files, 28-Oct-2026, against section 2.2 |

Last baseline with a **full** documented browser acceptance pass: **S6** (`1523bbc` / `882160c`, 21-Oct-2026).

---

## 4. Per-PR integration table (#1-#28)

All 28 PRs are MERGED (VERIFIED, `gh pr list --state all`). Every PR's own `verify` check was SUCCESS and its
`publish` job SKIPPED by design (publish runs only on `main`); every one of the 28 post-merge push runs on
`main` had `verify` = success and `publish` = success (VERIFIED job by job with `gh run view`). All merges
went through the `productsteamcentricity` account (the gh login the Claude sessions use); no PR reviews are
recorded on GitHub. Chat attribution: [`CHAT_REGISTRY.md`](CHAT_REGISTRY.md) (VERIFIED from transcripts).

Notation: "site:" lists deploy files touched; tools / lib / test / dev = `tools/`, `tools/lib/`,
`tools/test/`, `tools/dev/`; counts are files. Issues: C = closed, O = opened; IDs are `docs/KNOWN_ISSUES.md`
entries; `Dnn` = `docs/DECISIONS.md`. "Live check recorded" = a SHA-256 comparison of live files with `site/`
written down at the time.

| PR | Merged (UTC) | Merge / push run | Branch | WS | Chat | Purpose | Areas touched | CI verify (PR) | Live check recorded | Issues and decisions |
|---|---|---|---|---|---|---|---|---|---|---|
| #1 | 16-Oct-2026 07:15 | `25e71a3` / 38866042211 | setup/transfer-baseline (deleted) | EX (+GOV) | MOD-01 | Transfer baseline: reorganise into `site/`, `tools/`, `docs/`; publish via Actions behind the parity gate; document. No dashboard change | site: all 8 (git renames, bytes identical); tools 27; lib 4; docs 22; `.github/workflows/pages.yml` (new); `.claude` 12; root CLAUDE.md, README, CHANGELOG, package files, `.gitattributes`, `.gitignore`; 85 files, +8231/-1354 | SUCCESS 07:14:49Z | 8/8 = `site/` after run 38866042211 (REPLICATION_REPORT section 7, recorded by #2) | D60-D69 recorded (D69 later superseded by D78); KNOWN_ISSUES created; O: R1, R7 and the inherited A/B/C/E/F list |
| #2 | 16-Oct 07:18 | `bf20c08` / 38866419586 | docs/post-transfer-state (deleted) | EX (+GOV) | MOD-01 | Record the first publish | docs 3 (KNOWN_ISSUES, PROJECT_STATE, REPLICATION_REPORT); CHANGELOG; +31/-21 | SUCCESS 07:18:39Z | records #1 | R7 narrowed |
| #3 | 16-Oct 13:23 | `3f3e4b5` / 38907419508 | fix/foundation-blocklib-verify (deleted) | NB | MOD-01 | blocklib atomic writes and label helpers; `verify_page.js` exits 1 on a hard failure; unit tests; rehearsal harness | tools/verify_page.js; lib/blocklib.js; test/blocklib.test.js (new); dev/rehearse.js, dev/rehearsal_cases.js (new); pages.yml; package.json; +414/-11 | SUCCESS 13:22:43Z | not recorded (`site/` unchanged) | C (part): A8, A9, A23, A24 |
| #4 | 16-Oct 13:24 | `1e4b2fc` / 38907668110 | fix/bond-list-sheet-desk | NB | NB-01 | Bond List tool requires `--desk` and picks the sheet explicitly | tools/merge_bond_list.js, tools/README; docs 5; CHANGELOG; +143/-59 | SUCCESS 13:23:42Z | not recorded (`site/` unchanged) | C: A1; A2 narrowed. Head one merge behind `main` (INC-17) |
| #5 | 16-Oct 13:36 | `4fbbad6` / 38909099055 | fix/pms-aif-analytics-date | NB | NB-01 | Look-through tool stops writing `DATA_DATES.analytics` | tools/merge_pms_aif_analytics.js, tools/README; docs 5 incl. DECISIONS; CHANGELOG; +84/-28 | SUCCESS 13:33:00Z | not recorded | C: A3; D70 |
| #6 | 16-Oct 13:45 | `c93e55c` / 38910320945 | fix/reckoner-drop-gates | NB | NB-01 | Reckoner merge refuses join failures and mass drops; `--accept-drops <n>` | tools/merge_reckoner.js, tools/README; docs 5; monthly-update skill; CHANGELOG; +155/-38 | SUCCESS 13:44:53Z | 8/8 = `site/` after run 38910320945 (NB-01's desktop side-session note only; not in the repo) | C: A4; D71 (amends D56); security-review warnings fixed before merge (`fe060d5`) |
| #7 | 19-Oct 06:36 | `0d4fca3` / 39210887253 | fix/tools-core-dates | NB | MOD-01 | Package A: MF-chain tools, `isoDay` dates, `prev_names`, shared DIRECT_PERF builder, `npm test` in CI | tools 6 (rename_schemes, bake_month, fill_variant_analytics, merge_analytics, rebuild_directperf, rekey_sif_analytics); lib/dates.js, lib/direct_perf.js (new); test/dates.test.js, test/run.js (new); pages.yml; package.json; +610/-349 | SUCCESS 06:35:25Z | not recorded (`site/` unchanged) | C: A5, A17; part A2, A6, A7, A23; D72, D73, D79 (written later in #16); 8 rename candidates left for the owner (DEC-OPEN-08); temporary 1-day inception allowance (INC-12) |
| #8 | 19-Oct 06:46 | `455a573` / 39211901967 | fix/tools-equity-expense-managers | NB | MOD-01 | Package B: Direct Equity universe and returns, expense, fund-manager tools | tools 4; +271/-161 | SUCCESS 06:45:17Z | not recorded | C: A10-A13; part A2, A6, A8, A14 |
| #9 | 19-Oct 06:46 | `71ecbe2` / 39211909034 | fix/tools-risk-sif | NB | MOD-01 | Package C: risk matrix carries `fl` flags; SIF `--as-on` required; Python guards | tools 3 (merge_risk_matrix, merge_sif_monitor, build_risk_matrix.py); +322/-115 | SUCCESS 06:45:21Z | not recorded | C: C3 (tool part), A15, A16; part A22; D74 (written in #16). Head one merge behind `main` (INC-17) |
| #10 | 19-Oct 06:55 | `79e9759` / 39212726121 | fix/tools-pms-aif-reckoner | NB | MOD-01 | Package D: `tools/data/pins.json`, Reckoner fourth gate, PMS/AIF tools | tools 7 incl. data/pins.json (new); +491/-212 | SUCCESS 06:54:17Z | not recorded | C: A18; part A19, A20, A25; A3/A4 hardened; D75, D76 (written in #16). PR body overstates two flags (INC-03) |
| #11 | 19-Oct 06:55 | `d260cdf` / 39212734282 | fix/tools-bonds-slides-oneoffs | NB | MOD-01 | Package E: bond list, slide and one-off tools moved onto blocklib with gates | tools 6; +350/-129 | SUCCESS 06:54:18Z | not recorded | C: A21, A26; A1 extra gates; part F2. Head one merge behind `main` (INC-17) |
| #12 | 19-Oct 07:02 | `792692d` / 39213477756 | fix/page-dates-riskflags-sri | NB | MOD-01 | Page code: true workbook dates, risk dagger, shared-link banner, SRI, noindex, favicon; archive the stale risk-matrix file | site: index.html, SIF; `Centricity_Risk_Matrix.js` removed (-> `docs/archive/Centricity_Risk_Matrix_2026-06-30.js`); +112/-53 | SUCCESS 06:59:16Z | live files = `site/` (SHA-256, 19-Oct; CHANGELOG); qa-verifier browser check on the exact tree (PR body) | **S1.** C: C13, C14, R3, R5, E4; page part of A5, A6, C3; part R2, F3; D77, D78 (supersede D69; written in #16); known limit C17 (INC-08); broke a tools/README snippet (INC-05) |
| #13 | 19-Oct 07:08 | `10cb44c` / 39214047808 | data/2026-09-corrections | OPS | MOD-01 | Sep-2026 Run 2: true inception dates (+1 day on 1,851 MASTER and 30 SIF records) and 33 risk flags | site: index.html, SIF (data blocks); docs/update-log/2026-09; +51/-3 | SUCCESS 07:07:54Z | not recorded after merge; pre-run backup hashes = live files (update log Run 2) | **S2.** C: A6 (data), C3 (data); EPERM during the run (INC-01) |
| #14 | 19-Oct 07:12 | `cd6317c` / 39214487971 | fix/rename-exact-inception | NB | MOD-01 | Remove #7's temporary 1-day inception allowance | tools/rename_schemes.js; +6/-19 | SUCCESS 07:12:08Z | not recorded | A6 / D73 (planned rollback, INC-12) |
| #15 | 19-Oct 07:44 | `1e48781` / 39217928070 | fix/tools-cli-cleanup | NB | MOD-01 | Strict CLI in six MF-chain tools; no-break-space escapes; unused `fs` dropped | tools 9; +32/-3 | SUCCESS 07:44:16Z | not recorded | part A25, F2; D72 |
| #16 | 19-Oct 08:35 | `6dc08ef` / 39223845546 | docs/post-handover-fixes | GOV (+EX) | MOD-01 | Docs aligned with #3-#15 (about 300 claims checked, 60 corrections); outgoing-owner data-export prompt | docs 14 incl. new `docs/handover/DATA_EXTRACTION_PROMPT.md`, `docs/handover/README.md`; tools/README; skill; CHANGELOG; CLAUDE.md; +1586/-461 | SUCCESS 08:34:23Z | n/a (docs) | D72-D79 recorded; O: C16, C17, C18, C19 (P1); fixed INC-03 (docs), INC-04, INC-05 |
| #17 | 19-Oct 10:59 | `8e187ae` / 39241367691 | fix/c19-refresh-only-sheets | NB | MOD-01 | Page parser refreshes the four unmapped Monitor sheets; an unknown sheet fails the bake (C19 code) | site: index.html (parser); tools bake_month, rename_schemes (comment), README; test/parser_refresh_only.test.js (new); docs 9; skill; CHANGELOG; CLAUDE.md; +616/-126 | SUCCESS 10:59:09Z | not recorded; byte control on scratch copies (old chain = live) | **S3.** C19 code; D80; O: C20, C21, A27; C15 widened; C16 rewritten (INC-07); C19 restated 225 -> 215 (INC-06) |
| #18 | 21-Oct 05:57 | `f37fa01` / 39552476334 | data/2026-09-c19-refresh | OPS | MOD-01 | Sep-2026 Run 3: 214 stale funds to 30-Sep figures; G-Sec record held | site: index.html (MASTER data); docs 4; CHANGELOG; CLAUDE.md; +183/-70 | SUCCESS 05:56:28Z (two PR runs: `d362384` 19-Oct, `7fc9571` 21-Oct) | not recorded at merge; covered by the 21-Oct live acceptance (#25) | **S4.** C19 data (fixed, INC-02); D81; C20 stays open; held for the owner 19 -> 21-Oct (D61 auto-publish not applied to a correction); owner approval 21-Oct 05:51; PR body still opens "Draft" (INC-03 note) |
| #19 | 21-Oct 06:06 | `699978b` / 39553400442 | fix/missing-input-exit-2 | NB | NB-02 | Missing source or bad `--html` exits 2 in every tool | tools 19 (18 tools incl. verify_page, README); test/tool_inputs.test.js (new); docs 7; CHANGELOG; +172/-29 | SUCCESS 06:06:05Z | not recorded per PR | D72 exception closed (INC-11); branch head `aa83993` is a sync merge |
| #20 | 21-Oct 06:15 | `0cb7e95` / 39554347346 | fix/atomic-rename-retry | NB | NB-02 | `writeFileAtomic` retries EPERM/EBUSY/EACCES renames (6.3 s), always removes the temp file | lib/blocklib.js; test/blocklib.test.js; tools/README; docs 5; CHANGELOG; +126/-18 | SUCCESS 06:14:27Z | not recorded per PR | R6 mitigated, still open (INC-01 fix); A8; D72 |
| #21 | 21-Oct 06:24 | `75538de` / 39555213348 | fix/c17-matrix-footnote | NB | NB-02 | Long Portfolio Matrix slide shrinks above the dagger footnote when a fund is flagged | site: index.html (deck code); docs 2; CHANGELOG; +70/-8 | SUCCESS 06:23:26Z | not recorded per PR; COM measurement 25 funds 7.87" -> 6.64" | **S5.** C: C17; O: C22 (INC-08) |
| #22 | 21-Oct 06:29 | `fb9cbd6` / 39555759202 | fix/c18-select-popover-dagger | NB | NB-02 | Select popover shows dagger and note for a C3-flagged fund | site: index.html (popover); docs 2; CHANGELOG; +53/-6; branch synced with `origin/main` (`75256ea`) before merge because #21 had just changed `site/index.html` | SUCCESS 06:29:25Z | not recorded per PR | **S6.** C: C18; O: C23; fixed #21's C22 row order (INC-09) |
| #23 | 21-Oct 06:41 | `1523bbc` / 39556960865 | fix/a27-rehearse-old-site | NB | NB-02 | `rehearse.js --old-site` so page-code changes can be rehearsed (data verdict) | dev/rehearse.js; tools/README; docs 3; CHANGELOG; +135/-37. The code sits in merge commit `18abff3` (the PR head), see section 6.2 | SUCCESS 06:40:38Z | 7/7 = `main` `1523bbc` after run 39556960865 (NB-02 side-session note); live acceptance on `1523bbc` (#25) | C: A27 (INC-10) |
| #24 | 21-Oct 13:22 | `882160c` / 39607513805 | docs/export-prompt-c19-c23 | EX | MOD-01 | Export prompt gains Q9 (C19 refresh route) and Q10 (C23 Alpha unit) | docs/handover/DATA_EXTRACTION_PROMPT.md; +7/-1 | SUCCESS 13:22:43Z | live acceptance continued on `882160c` (no `site/` change) | refs C19, C23 |
| #25 | 21-Oct 14:00 | `83f777c` / 39612961761 | docs/acceptance-check-c24-c27 | EX (+GOV) | MOD-01 | Record the 21-Oct live acceptance check (7 areas PASS, no regression) | docs 2 (KNOWN_ISSUES, PROJECT_STATE); +52/-1 | SUCCESS 14:00:04Z (two PR runs: `dd662b0`, `31af6b1`) | records 7/7 SHA-256 and the 7-area pass on S6 | O: C24, C25, C26, C27, all inherited (INC-13) |
| #26 | 22-Oct 15:37 | `5d39821` / 39806564591 | feat/pptx-design-system | NB | NB-03 | PowerPoint design system: measured layout, continuation slides, page numbers, `*` on expected returns | site: index.html (export section + `H.isExpectedReturn`); tools/README; test/pptx_layout.test.js (new); dev/render_pptx.ps1, dev/check_pptx_bounds.js (new); docs 8 incl. new `docs/proposal-output-format-audit.md`; CHANGELOG; CLAUDE.md rule 10; +1639/-540 | SUCCESS 15:36:12Z | 7/7 = `site/` after run 39806564591; live 4-fund export 23 slides, no layout warning (recorded by #27) | **S7.** D82, D83; C: C22; O: C28-C34. Owner go-ahead 22-Oct 15:36:58, after the montage and sample deck were sent (15:36:08 / 15:36:10) |
| #27 | 22-Oct 15:41 | `5bcce88` / 39807185096 | docs/release-pr26 | GOV | NB-03 | Record the #26 release | docs 2 (DECISIONS, PROJECT_STATE); CHANGELOG; +16/-18 | SUCCESS 15:40:40Z | records #26 | D82/D83 marked owner-approved |
| #28 | 27-Oct 12:27 | `2b2a397` / 40503943213 | docs/handover-export-ingestion (origin only) | EX (+GOV) | MOD-01 | Ingest the outgoing owner's 23-Oct export: verified, 32 desk files filed locally, findings logged; no `site/` or `tools/` change | docs 6 incl. new `docs/update-log/2026-10-23_handover-export.md`; CHANGELOG; CLAUDE.md; +742/-132 | SUCCESS 12:27:27Z | not recorded at merge; 28-Oct parity check 7/7 (section 7) | O: B8 (P1), B9, C35-C40, A28, R8 (P1); C: B3; corrected B1, B2, B7, C5, C6, C11, C19, C20, C23, C24, C28, R1, R6 (INC-14, INC-15) |
| PENDING | - | - | `handover/mod-01-to-mod-02-20261028` | GOV | MOD-01 | **PENDING - not merged when this log was written.** The MOD-01 -> MOD-02 handover package (docs, `.claude/agents/integration-guardian.md`; no `site/` or `tools/` change). MOD-02 replaces this line in TASK-016 with the real PR number, merge SHA, push run, CI result and live check, and adds a section 11 entry (MOD-01 makes no repository change after the merge, [`CHAT_REGISTRY.md`](CHAT_REGISTRY.md)). | - | - | - | TASK-015 |

### 4.1 Totals (VERIFIED)

- 28 PRs, 16-Oct to 27-Oct-2026; 0 open PRs and 0 open issues on 28-Oct.
- `main` has 143 commits; 69 since `862e40b` = 38 non-merge commits + 28 PR merges + 3 other merges
  (`18abff3` = PR #23's A27 implementation committed as a merge commit; `75256ea` = sync inside #22;
  `aa83993` = sync inside #19). **0 revert commits** (`git log -i --grep=revert 862e40b..main` empty).
- PRs that changed `site/`: #1 (move only), #12, #13, #17, #18, #21, #22, #26. Data-changing PRs: #13 and #18 only.
- PRs that waited for an explicit owner approval: #18 (held about 43 h; D81) and #26 (D82, D83). All others
  merged on green CI, typically 1-4 minutes after opening.
- Owner acceptance (Gate E) of the new build as a whole has **not** been given: the owner's condition for
  retiring the old site is "after full testing of the new build", and the criteria are undecided (DEC-OPEN-24).

### 4.2 Integration topology (VERIFIED, merge-tree comparison of each PR head with `main`)

- 25 of 28 PR heads were up to date with `main` when merged (merge tree = head tree).
- **#4, #9 and #11 merged with heads one merge behind `main`** (missing #3, #8 and #10). Their file sets were
  disjoint from the missing merges, so there was no textual conflict; the combined trees were verified only by
  the post-merge push runs, which passed (38907668110, 39211909034, 39212734282). #8/#9 and #10/#11 merged
  5 s apart; the workflow's `concurrency` group queued the runs (`cancel-in-progress: false`). Recorded as INC-17.
- #22 merged `origin/main` into its branch (`75256ea`) first, because #21 had just changed `site/index.html`.
- `main` has no branch protection, so nothing forces a branch to be up to date or CI to be green before a
  merge; it is a convention (R9, DEC-OPEN-17).

---

## 5. Pending integrations

| Item | State on 28-Oct-2026 | Who records it |
|---|---|---|
| Merge of `handover/mod-01-to-mod-02-20261028` (the package) | PLANNED: branch created and merged by MOD-01 after the `verify` check; no SHA or PR number exists yet | MOD-02 in TASK-016 (MOD-01 makes no repository change after the merge) |
| Any other branch, PR or task | none: 0 open PRs, every branch merged, no coding chat active | - |

---

## 6. Regressions and incidents

### 6.1 Incident list

Summary: **no production regression caused by a new-build PR has been found** (0 reverts; 58 of 58 CI runs
green; every recorded live check after a `site/` change matched). What was found after merge: inherited
defects discovered later, documentation and PR-text claims that were wrong, a harness blind spot, and
OneDrive/git environment incidents.

| ID | Found | What | Origin | Production impact | Fix | Lesson | Status |
|---|---|---|---|---|---|---|---|
| INC-01 | 19-Oct-2026, during the #13 run | First `merge_risk_matrix.js --apply` failed after its gates with EPERM renaming the temp file (OneDrive was syncing `index.html`) | Environment (R6) | None: the atomic write left the page untouched; a retry wrote it | #20: rename retried 6 times over 6.3 s, temp file always removed; real-lock test passes after 4 retries | Atomic writes protect the page; keep OneDrive healthy (TASK-017) | Mitigated; R6 EXISTING DEFECT |
| INC-02 | 19-Oct (after #13) | **C19 (P1):** 215 funds on four Monitor sheets the parser never mapped showed 30-Jun (one 31-Jul) figures under the "30th September 2026" label since the upstream July bake; 4 Centricity Select FoFs affected | Inherited (upstream parser), not caused by a new PR | Client-facing stale returns, live from the July bake to 21-Oct | Code #17 (D80; an unknown sheet now fails the bake); data #18 (214 funds; JioBlackRock G-Sec record held for C20) | Gate on unrecognised input; prove byte control on scratch copies before touching `site/` | VERIFIED COMPLETE (C19); C20 open |
| INC-03 | 19-Oct (doc check in #16) | #10's description claims `--allow-drops` in `merge_pms_performance.js` and `--usd-inr` in `merge_aif_performance.js` | PR text overstated the code | None (docs) | Docs corrected in #16. Re-checked 28-Oct: `--allow-drops` exists in no tool; `--usd-inr` only in `tools/add_reckoner_funds.js`. #10's body on GitHub still carries the claim; #18's body still opens "Draft: held for the owner's go-ahead" although it merged after approval | PR bodies are not edited afterwards: re-verify any PR-body claim against the code | VERIFIED COMPLETE (docs); PR bodies uncorrected |
| INC-04 | 19-Oct | Sep update log Run 2 said the 8 rename candidates "carry September's numbers"; they carried 30-Jun figures (C19) | Wrong claim in a merged log | None | Corrected in #16 (`docs/update-log/2026-09_Sep-2026.md:96-99`) | Check update-log claims against the data | VERIFIED COMPLETE |
| INC-05 | 19-Oct | `tools/README.md` Python risk-matrix bake snippet broken by #12 (file left `site/`) together with #9 (the .py refuses to write into `site/`) | Doc regression | None (Python route not in use) | Repaired in #16; the snippet now writes `$M/_review/Centricity_Risk_Matrix.js` and bakes from it (`tools/README.md:414`, `:444`) | After moving a file, grep the docs for it | VERIFIED COMPLETE (doc) |
| INC-06 | 19-Oct | C19 size stated as 225 funds (#16) -> 215 distinct funds (#17, financial-data review) -> 214 refreshed + 1 held (#18) | Rows counted instead of distinct names | None | KNOWN_ISSUES C19 restated | Count distinct funds and reconcile | VERIFIED COMPLETE |
| INC-07 | 19-Oct | C16 described as a "364-day source conflict" (#14 body, #16); it is the Direct plan's inception on the Regular record | Wrong diagnosis | None | Rewritten in #17 | Diagnose from the data, not from the symptom | Docs fixed; C16 open (decided with C20, DEC-OPEN-07) |
| INC-08 | 19-21-Oct | Known limit at #12: dagger footnote overlaps a Portfolio Matrix slide with about 22+ funds (C17). #21's fix then logged C22 (unflagged long matrix overflows; same at baseline) | #12 limitation; C22 inherited | Cosmetic, client deck | C17 fixed in #21; C22 fixed in #26 (D82) | Render layout changes in PowerPoint and measure them | VERIFIED COMPLETE |
| INC-09 | 21-Oct | #21 placed the C22 summary row out of order | Doc slip | None | Fixed in #22 | - | VERIFIED COMPLETE |
| INC-10 | 19-21-Oct | **A27:** `rehearse.js` seeded both sides from the new `site/`, so page-code changes always showed IDENTICAL; rehearsal could not discriminate #12 or #17 (C19 was checked by hand) | Harness blind spot (inherited design) | None found | #23 `--old-site`; retro-check on C19: data DIFFER, MASTER only, 223 records (215 + 8 renames) as expected | Rehearse page-code changes with `rehearse.js --old-site <old site/>` | VERIFIED COMPLETE |
| INC-11 | 16-21-Oct | D72 contract had an exception: 23 of 43 missing-path cases crashed with ENOENT (exit 1) | Inherited, plus #7-#11 scope | Exit codes could mislead under D61 auto-publish | #19: 43 of 43 exit 2 (`tools/test/tool_inputs.test.js`) | A contract needs a test that enumerates every tool | VERIFIED COMPLETE |
| INC-12 | 19-Oct | #7 added a temporary 1-day inception allowance to `rename_schemes.js` for the A6 transition | Planned transition code | None | Removed in #14 after #13 corrected the dates (2,070 of 2,072 exact) | Remove transition code in a planned follow-up PR | VERIFIED COMPLETE (planned rollback) |
| INC-13 | 21-Oct (live acceptance) | C24-C27 surfaced. C24 as corrected on 28-Oct: three screen paths (Section 1 tile, Section 5 Future Value, Section 6.1 Live Output) count no-band instruments as 0%, while Section 4 and the deck GRAND TOTAL exclude them | Inherited ("same code at `handover-baseline`") | Existing behaviour | Logged in #25; decision DEC-OPEN-15, task TASK-026 | Acceptance checks find inherited defects; log them, do not fix silently | EXISTING DEFECT |
| INC-14 | 24-25-Oct (export ingestion) | **B1:** PMS performance labelled "31st August 2026" is 31-Jul data; docs before #28 overstated it as 31-Aug | Inherited mislabel | Client-facing label one month ahead of the data | Recorded in #28; DEC-OPEN-04, TASK-025 | Verify "as on" labels against file contents | EXISTING DEFECT |
| INC-15 | 24-Oct | **R8 (P1):** two client items inside the outgoing owner's export | Outgoing owner's export | None published; kept in git-ignored `handover-archive/` | Owner + compliance decide (DEC-OPEN-05, TASK-032); never push `upstream/*` or `--mirror` | Treat every received archive as possibly holding client data | BLOCKED (owner + compliance) |
| INC-16 | 25-Oct-2026 | `git checkout` back to `main` aborted with "fatal: mmap failed: Invalid argument" and left tracked files truncated (CLAUDE.md 0 bytes) or deleted. Cause: `.git` pack files were OneDrive cloud-only placeholders while OneDrive.exe was not running. Context: NB-03 had worked in the shared main checkout and left it on `feat/pptx-design-system` | Environment (R6) plus process (a coding chat in the shared checkout) | None: files restored from git blobs; everything was already on `origin` (`docs/KNOWN_ISSUES.md` R6) | Branch switch done without `checkout` (`git cat-file` + `update-ref` + `symbolic-ref`); rule since: sessions sharing the folder leave it on `main`, coding sub-chats use their own worktree | Never `checkout`/`switch` in the OneDrive main checkout (procedures: REPOSITORY_AND_ENVIRONMENT_STATE section 14) | **Still present 28-Oct** (mmap errors on historical and stash blobs; 229 `.git` files cloud-only). EXISTING DEFECT (R6; TASK-017, DEC-OPEN-19) |
| INC-17 | 16-19-Oct | #4, #9, #11 merged one merge behind `main`; combined trees tested only by the post-merge push runs | Process (rapid parallel merges) | None (all push runs green; disjoint files) | none needed | Sync a branch with `main` before merging when `main` moved (as #22 did); one merge at a time (Gate D) | Observation |

### 6.2 Audit notes (no incident ID; found on 28-Oct-2026)

- **PR #23's code lives only in merge commit `18abff3`** (the PR head; parents `fb9cbd6` = #22 merge and
  `75538de` = #21 merge; `git diff --stat fb9cbd6 18abff3` = 6 files, +135/-37 incl. `tools/dev/rehearse.js`).
  `git log --no-merges`, `git log -p` without `-m`, and `git log -S` without `-m` all miss it
  (`git log --no-merges 862e40b..main -- tools/dev/rehearse.js` lists only `32943e8` from #3). Reviews and
  audits must use `git log -m --first-parent -p`, `git diff <merge>^1 <merge>`, or `git diff <base> <merge>`.
- Doc records that disagree with git (fix in TASK-018; KNOWN_ISSUES E13, E14; `docs/PROJECT_STATE.md` line
  numbers as at `2b2a397`, since the package itself adds lines near its top): `docs/PROJECT_STATE.md:170`
  shows PR #23's merge as "-" (it is `1523bbc`); `:119` "Latest merge: PR #26" (latest is #28 `2b2a397`; #26
  is the latest that changed `site/`); `:48` "Latest verification" opens with 21-Oct; `docs/DEPLOYMENT.md:44-49`
  hashes 6 files although 7 are published (`robots.txt`).
- `docs/PROJECT_STATE.md:141` (at `2b2a397`) attributes D72 and D79 to PR #7: #7 implemented the behaviour; the decision
  entries were written in #16 (informational).

### 6.3 Process lessons

1. Rehearse on scratch copies and prove byte control before touching `site/`; back up the six deploy files to
   `backups/<date>_<tag>/` first. Both data runs (#13, #18) did this and both backups exist.
2. Page-code changes need `rehearse.js --old-site <old site/>` (A27); the default rehearsal cannot see parser changes.
3. PR descriptions and update logs can overstate. #16's claim-by-claim check (about 300 claims, 60 corrections)
   caught INC-03/04/05. Re-verify a PR-body claim against the code before relying on it.
4. Count distinct funds, not rows, and reconcile (225 -> 215 -> 214 + 1 held).
5. Never `git checkout`/`git switch` in the OneDrive main checkout; keep it on `main`; coding sub-chats work in
   their own worktree. When a blob read fails with mmap, read it through `gh api .../git/blobs/<sha>` and
   re-hash with `git hash-object`.
6. Atomic writes saved the page on the 19-Oct EPERM; the #20 retry handles short locks only.
7. Owner gates worked: the non-routine data correction (#18, D81) and the every-deck change (#26, D82) waited
   for explicit owner approval; routine fixes merged on green CI.
8. Sync a branch with `main` when another PR just changed the same file (#22 did). Parallel PRs with disjoint
   files relied on post-merge CI only (INC-17).
9. Scripts that contain escapes must be written to files with the Write tool, not piped to `node -` or a
   heredoc (Node 24 stdin and the tool layer decode `\uXXXX` and `\\`).

---

## 7. Current live-site parity check

**Date:** 28-Oct-2026, about 05:52 UTC. **Method:** each published file downloaded from
https://productsteamcentricity.github.io/Centricity-Proposal-Playbook/ with `curl --compressed`, SHA-256 with
`sha256sum`, compared with the working tree `site/` and with `git show HEAD:site/<file>` at `2b2a397`.
All HTTP 200. **Result: 7 of 7 MATCH (VERIFIED).**

| File | Bytes (live = working tree) | SHA-256 (live = `site/` = `HEAD:site/<file>`) | Verdict |
|---|---|---|---|
| index.html | 12,864,963 | `916f2455eebaf2362e60a97314203e8ffc52955892cfa04a5c5248301ac62ce3` | MATCH |
| Centricity_ExtraSlides.js | 2,617,988 | `777f975bc796e30aa897931d3525949bbaebe4d8222747a9e113ef12e89dba2b` | MATCH |
| Centricity_PMS_AIF_Terms.js | 6,054 | `8ed1c0df3ed34a6b2c2c802b6ac72a7fc46600a5d3a77a70bb4b4217bfb1688a` | MATCH |
| Centricity_June_Refresh.js | 54,408 | `0cf078943cf9204c5e90c4ea37498f1140bce144ed0fd42e43d0c4738d3ac9d8` | MATCH |
| Centricity_IRR_Offshore.js | 110,356 | `2aaeb57c1d51d3d31ee5dcd776a631f7d2e96c407568695f8dfa4518e4667601` | MATCH |
| Centricity_SIF_Refresh.js | 35,735 | `a2a515535462dc6ebdea969b97e27ac7d5d2641b00fcd4fa40fbc4a26b1d37ab` | MATCH |
| robots.txt | 156 | `d6add17b4662277921d273d61932ef5d19e29af362efe05dd9d9cc1c76501dfc` | MATCH |

- `site/` holds exactly these 7 files; `git status --short site/` empty; HEAD = `origin/main` = `2b2a397`.
- Not published (HTTP 404, VERIFIED): `Centricity_Risk_Matrix.js` (archived, D78), `docs/PRD.md`, `CLAUDE.md`, `tools/verify_page.js`.
- `index.html` headers: `Last-Modified: Tue, 27 Oct 2026 12:28:50 GMT` (re-published by the #28 run with identical bytes).
- **Old site still live (VERIFIED):** https://magazineishita1108-boop.github.io/Centricity-Proposal-Playbook/
  `index.html` HTTP 200, SHA-256 `5872958ddacd728b...` (12,827,311 B) = `handover-baseline` content (S0),
  `Last-Modified` 14-Oct-2026. It is 7 site-changing merges behind the new site (#12, #13, #17, #18, #21,
  #22, #26). Retiring it is **PLANNED** (owner decides after full testing of the new build; DEC-OPEN-14,
  DEC-OPEN-24, TASK-034); the upstream history purge and old-site notice (R1) are **BLOCKED** on the outgoing
  owner (DEC-OPEN-13, TASK-033).
- How to repeat: the loop in [`REPOSITORY_AND_ENVIRONMENT_STATE.md`](REPOSITORY_AND_ENVIRONMENT_STATE.md)
  section 18 (all 7 files; `docs/DEPLOYMENT.md:44-49` still lists 6, E14).

---

## 8. CI history (VERIFIED, `gh run list --limit 200`, `gh run view`)

- Workflow "Verify and publish dashboard" (`.github/workflows/pages.yml`): **58 runs, 58 success** (30
  pull_request, 28 push). No failed, cancelled or re-run workflow in the repository's history.
- Latest `github-pages` deployments: 7358413557 (`2b2a397`, 27-Oct), 7256623949 (`5bcce88`), 7256527240 (`5d39821`).
- What CI does and does not check: [`REPOSITORY_AND_ENVIRONMENT_STATE.md`](REPOSITORY_AND_ENVIRONMENT_STATE.md)
  section 11. Gaps that matter for regressions: a broken sibling only logs `console.error` and passes (A30);
  two CLAUDE.md invariants are not enforced (A31); the deck bounds check is manual (REQ-PPT-129); no browser test.

| Run | Created (UTC) | Event | Head | Conclusion |
|---|---|---|---|---|
| 40503943213 | 27-Oct 12:27:52 | push main | `2b2a397` (#28) | success (verify + publish) |
| 40503856131 | 27-Oct 12:27:11 | pull_request | `11d5c0a` | success |
| 39807185096 | 22-Oct 15:41:24 | push main | `5bcce88` (#27) | success (verify + publish) |
| 39806564591 | 22-Oct 15:37:24 | push main | `5d39821` (#26) | success (verify + publish) |
| 39612961761 | 21-Oct 14:00:18 | push main | `83f777c` (#25) | success (verify + publish) |

---

## 9. Recovery procedure (if a merge breaks the application or the live site)

1. **Stop dependent integration.** No further merges to `main`; mark the affected rows in
   `ACTIVE_CHANGE_REGISTER.md` as blocked and tell the owning chats.
2. **Preserve evidence.** Download and hash the live files (section 18 loop of REPOSITORY_AND_ENVIRONMENT_STATE),
   save the CI run id, console output, `verify_page` output and screenshots. Do not delete the branch.
3. **Identify the last verified baseline** (section 3) and the bad merge (`git log --first-parent main`).
4. **Targeted recovery, never a force-push or a reset of `main`:**
   - Code or docs: in a worktree outside the main checkout (Git Bash, from the main checkout),
     `git worktree add -b fix/revert-pr<n> <short path outside OneDrive, e.g. C:/t/wt-revert> origin/main`
     (not `%TEMP%`, which Windows may clean, FILE_OWNERSHIP_AND_CHANGE_CONTROL section 2.2), then
     `git -C <path> revert -m 1 <merge-sha>`; in `<path>` run `npm ci` (a new worktree has no `node_modules/`),
     `node tools/verify_page.js site` and `npm test`; push, open a PR, wait for `verify`, merge (= publish),
     confirm the live files (Gate D).
   - Data: on such a branch, restore all six deploy files from the refresh's own `backups/<date>_<tag>/`
     (never only `index.html`, CLAUDE.md rule 1), verify, PR, merge.
   - If git cannot read the needed objects (mmap, R6), clone `origin` into a folder outside OneDrive and do
     the revert there.
   - Never discard unrelated work to repair a regression.
5. **Record** the incident as INC-18 (or the next number) in section 6.1, update section 3, notify dependent
   tasks, and log the root cause in `docs/KNOWN_ISSUES.md`.

---

## 10. Template for future integrations

Add one row to section 4 and one entry to section 11 for every merge to `main`. This is the only template in
this file; replace every angle-bracket field. "Not run" is a valid answer; "passed" without a command and
result is not.

Row for the section 4 table:

```
| #<n> | <DD-Mon-YYYY HH:MM> | `<merge sha>` / <push run id> | <branch> | <EX/NB/OPS/GOV> | <CHAT-ID> | <one-line purpose> | <files touched; site: files named> | <SUCCESS/FAILURE + time> | <7/7 SHA-256 = site/ (date) or "not run"> | <TASK/REQ ids; C/O issues; Dnn; S<k> if site/ changed> |
```

Entry for section 11:

```
### PR #<n> - <title> (<DD-Mon-YYYY>)

| Field | Value |
|---|---|
| Task / requirement / decision IDs | TASK-<nnn>; REQ-<nnn>; D<nn> or DEC-OPEN-<nn> |
| Chat and worktree | <CHAT-ID>; <worktree path, or "main checkout (docs only, Moderator)"> |
| Branch | <branch> |
| Base SHA (origin/main when the branch was cut) | <sha> |
| Head SHA at merge | <sha> |
| Merge SHA / push run / deployment id | <sha> / <run id> / <deployment id> |
| Files changed | <list; name every site/ and tools/lib/ file> |
| Site-content state | unchanged (S<k>) / new state S<k+1>: index.html SHA-256 <first 16>, other changed files |
| Gate A - implementation report | PR description link; ACTIVE_CHANGE_REGISTER row; tests the coding chat actually ran |
| Gate B - Guardian review (ARC-01) | date; verdict; ownership and interface checks; findings and how they were resolved; "not required" only for docs-only changes |
| Gate C - independent verification | each command and its result: `node tools/verify_page.js site` (= previous counts, or the expected new counts); `npm test` (<k> of <k> files); verify-dashboard / qa-verifier areas run; deck changes: PowerPoint render + `check_pptx_bounds.js`; page-parser changes: `rehearse.js --old-site`; data: dry-run gates read, backup folder, financial-data-reviewer verdict |
| Gate D - integration | CI `verify` on the PR (run id); merged by; push run verify + publish; live 7/7 SHA-256 = site/ (time, method); one PR at a time: yes/no |
| Baseline update | section 3 updated to <merge sha>: yes/no (if no, why) |
| Gate E - acceptance | owner acceptance (date and words) or "pending"; D61 refreshes: "published automatically, acceptance pending" |
| Dependent tasks notified | TASK ids and chats told to rebase on the new main; how (registry note, SendMessage to local_..., copy-ready prompt) |
| Regressions found after merge | none / INC-<nn> |
| Rollback | `git revert -m 1 <merge sha>` in a new PR (section 9), or backups/<date>_<tag>/ for data |
```

---

## 11. Integration entries from 28-Oct-2026 on

None yet. The first entry is the merge of `handover/mod-01-to-mod-02-20261028` (section 5), written by MOD-02
in TASK-016.

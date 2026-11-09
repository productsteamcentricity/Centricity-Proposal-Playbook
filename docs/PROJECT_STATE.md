# Project state

_Last updated: 9-Nov-2026 - GOV-01 (TASK-018, the widened docs PR) makes the rule documents agree with each other
and with the code and answers ARC-01's conditions of 2-Nov-2026 (findings D-01 to D-07, D-14 and the minor D-09 to
D-18; KNOWN_ISSUES E6 to E10, E13 to E15 and E17 closed, E11 partly fixed, E12 open for DEC-OPEN-22). CLAUDE.md
"Project control" now states one ban on `git checkout`, `git switch`, `git merge` and `git pull` in the main checkout,
with its trigger and its check, beside one worktree rule, one Guardian pre-check rule (material or high-risk), one
criterion for a routine monthly refresh (Gate B inside it) and one merge command without `--delete-branch`. The
monthly refresh runs in its own worktree and reaches the inbox and the backups of the main checkout by absolute path.
Gate E is final after the owner's answer to DEC-OPEN-34 of 9-Nov-2026 (D87): the owner accepts client-facing changes
and anything the owner asked to review; the Moderator records acceptance of the rest on evidence. The merge of this PR (number added at release) lifts ARC-01's condition on OPS and NB launches, once the Moderator
has advanced local `main`. It does not lift the TASK-017 hold: a `/monthly-update` run and any tool `--apply` on the
real `site/` still wait for the owner's OneDrive pin, so the October cycle (about 13-17 Nov) needs that pin well
before then. PR #33 (`8aeabfc`, docs only: the claim record; merged 2-Nov-2026 21:24 UTC) is the latest merge before
this record. No `site/`, `tools/`, `.github/` or package-file change; `verify_page` and `npm test` (903 checks) are
unchanged. Claim and contract: `docs/project-control/ACTIVE_CHANGE_REGISTER.md` section 1._

_Previous update: 3-Nov-2026 (includes the 2-Nov-2026 update) - MOD-02 validated the MOD-01 handover package against the repository (TASK-016).
PR #32 (`703b975`, docs only: the D86 records; merged 2-Nov-2026 19:50 UTC) is the latest merge before this
record, after PR #31 (`c0fb2dd`, 14:41 UTC), PR #30 (`32172f5`, 12:20 UTC) and PR #29 (`f5c2431`); `verify_page`, `npm test` (903 checks) and the live files (7 of 7) are
unchanged from 28-Oct. ARC-01's first review (GO WITH CONDITIONS) and a security review found no secret
or client name in the package. 77 audit findings (P2 17, P3 60) are recorded in
[`update-log/2026-11-02_task-016-validation.md`](update-log/2026-11-02_task-016-validation.md) and the
register errors corrected (PR #30). The owner decided D84 (the risk-free rate stays 4.5% for now) and D85
(the textbook Sortino formula), then answered DEC-OPEN-01 (D86: the NAV and risk-ratio inputs come from the
MF Screener data pack, MOD-02's reading INFERRED; analysis in
[`update-log/2026-11-02_datapack-feasibility.md`](update-log/2026-11-02_datapack-feasibility.md)).
The owner started GOV-01 (TASK-018, the widened docs PR, which gates every OPS and NB launch) and EX-01
(TASK-064, browser acceptance, read-only) on 2-Nov-2026. GOV-01's contract passed the Guardian pre-check on
3-Nov-2026 (GO WITH CONDITIONS); its claim is recorded in `docs/project-control/ACTIVE_CHANGE_REGISTER.md`
section 1 and is in force from the merge of that record.
No `site/` or `tools/` change._

_Previous update: 30-Oct-2026 - the Moderator handover package (MOD-01 -> MOD-02, dated 28-Oct-2026) is
added: `docs/handover/` (master, workstream and Guardian handovers, bootstrap and successor prompts)
and `docs/project-control/` (chat, task, requirement, decision, change and integration registers), plus
the `integration-guardian` agent. No `site/` or `tools/` change. The reconstruction found 22 new issues
(A29–A31, C41–C45, E6–E16, R9–R11), among them C43 (P1: a since-inception value of 297,765% reaches
the screen, Excel and the deck) and C41 (PMS/AIF benchmark rows use a static list no tool updates).
Who coordinates: [`project-control/CHAT_REGISTRY.md`](project-control/CHAT_REGISTRY.md)._

_Previous update: 27-Oct-2026 — the outgoing owner's handover export (23-Oct-2026) is ingested: verified,
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

9-Nov-2026 (GOV-01, branch `docs/gov-01-rule-consistency-20261102` on `origin/main` `8aeabfc`; docs only): `npm ci`
exit 0; `verify_page` output identical to the block below, exit 0; `npm test` 5 of 5 files, 903 checks (blocklib 34,
dates 10, parser_refresh_only 18, pptx_layout 798, tool_inputs 43), 0 failures; no change under `site/`, `tools/`,
`.github/` or in the package files. The other checks of the change (links, tables, added lines, the one grep per
ARC-01 condition, the walkthrough of the monthly refresh in a worktree) are in the PR description.

2-Nov-2026 (MOD-02, `main` `f5c2431`): `verify_page` output identical to the block below, exit 0; `npm test` 5 of
5 files, 903 checks, 0 failures; the 7 live files equal `site/` (SHA-256); CI 60 of 60 green; the page starts in
the built-in browser (MASTER 7,682, three sibling flags, 0 console messages; no proposal built, nothing
exported: full acceptance TASK-064 still due).

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
| Latest merge | PR #32 -> `703b975` (2-Nov-2026 19:50 UTC), docs only (the D86 records); Actions push run 41513729682 (verify + publish) succeeded; the 7 live files equal `site/` (SHA-256, 7 of 7, checked at the merge); its release row in the registers follows in the next register update. The merge before it: PR #31 -> `c0fb2dd` (2-Nov-2026 14:41 UTC), docs only; Actions push run 41464361000 (verify + publish) succeeded; the 7 live files equal `site/` (SHA-256, 7 of 7). The merge before that: PR #30 -> `32172f5` (2-Nov-2026), docs only; Actions run 41443940610 (verify + publish) succeeded; the 7 live files equal `site/` (SHA-256, 7 of 7). The merge before that one: PR #29 -> `f5c2431` (30-Oct-2026), docs and one agent definition only; Actions run 41022201456 (verify + publish) succeeded. The last merge that changed `site/` is PR #26 -> `5d39821` (22-Oct-2026; PowerPoint design system, D82-D83; Actions run 39806564591 succeeded). Before it: PR #22 -> `fb9cbd6`; PR #18 -> `f37fa01` published Sep-2026 Run 3 |
| Live status | 2-Nov-2026: the six deploy files and `robots.txt` on the live site equal `main` `c0fb2dd` (and `703b975`, PR #32, docs only: see Latest merge) (`site/` and `tools/` identical to `32172f5`; SHA-256, 7 of 7); `Centricity_Risk_Matrix.js` returns 404 (archived, D78) |

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
| #23 | `1523bbc` | `tools/dev/rehearse.js --old-site <dir>`: rehearse a page-code change (old side seeded from another `site/`), with a data verdict | A27 |

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

## Moderator handover and project control (28-Oct to 2-Nov-2026)

On the owner's instruction (27/28-Oct-2026), MOD-01, the chat that ran the project from 15-Oct, handed
over to a new Moderator chat, MOD-02. The package was reconstructed from the code, git, the 28 PRs and
every owner message, and checked against the code (record:
[`handover/MASTER_HANDOVER_2026-10-28_v1.md`](handover/MASTER_HANDOVER_2026-10-28_v1.md)).
- **Checks on 28-Oct-2026:** `verify_page` unchanged (counts in "Latest verification"); `npm test` 5 of
  5 files, 903 checks, 0 failures; the 7 live files equal `site/` (SHA-256); CI 58 of 58 runs green (60 of 60 at `f5c2431` on 2-Nov-2026; 62 of 62 after PR #30); the
  page starts in a browser with MASTER 7,682, the three sibling flags set and no console errors. No
  proposal was built and nothing was exported in a browser: the full acceptance check last ran on
  21-Oct, before PR #26 (TASK-064).
- **New ways of working:** one Moderator coordinates; coding sub-chats work in their own worktrees; one
  writer at a time per deploy file; material changes get a change-impact contract and an
  `integration-guardian` review; gates A–E; hand over before context is lost. Rules:
  [`project-control/FILE_OWNERSHIP_AND_CHANGE_CONTROL.md`](project-control/FILE_OWNERSHIP_AND_CHANGE_CONTROL.md).
- **Registers:** tasks TASK-001–074, requirements REQ-001–095 and REQ-PPT-01–153, open owner
  decisions DEC-OPEN-01–28 ([`project-control/DECISION_LOG.md`](project-control/DECISION_LOG.md)).
  These are the 28-Oct ranges; 2-Nov additions: TASK-075 to TASK-078, DEC-OPEN-29 to DEC-OPEN-33, D86, C46;
  3-Nov-2026 addition: DEC-OPEN-34.
- **Git in this folder:** the ban is on `git checkout`, `git switch`, `git merge` and `git pull` in the main
  checkout (R6; stated once, with its trigger and its check, in CLAUDE.md "Project control"). On 28-Oct OneDrive
  was not running and 229 `.git` files were cloud-only. On 2-Nov OneDrive was running but the folder was not pinned
  and 228 of 568 were still cloud-only. On 3-Nov and again on 9-Nov, from the GOV-01 sub-chat (`Get-Process OneDrive`
  and the section 18 check of `project-control/REPOSITORY_AND_ENVIRONMENT_STATE.md`): no OneDrive process was found,
  the folder was not pinned, and 228 of 686 (3-Nov) and 228 of 780 (9-Nov) `.git` files were cloud-only. On 9-Nov a
  `git commit` in a worktree printed `error reading from .git/objects/pack/loose-<hash>.pack: Invalid argument`
  (the commit succeeded and its new objects read back). The ban stays until TASK-017 has passed.
- **2-Nov-2026 (TASK-016):**
  - Validation: MOD-02 checked the package against the repository. `site/` and `tools/` are unchanged;
    `verify_page`, `npm test` (903 checks), the 7 live files and CI (60 of 60) agree with 28-Oct; the page
    starts in a browser (MASTER 7,682, three sibling flags, 0 console messages). 77 findings (P1 0, P2 17,
    P3 60), all in documents, are recorded in
    [`update-log/2026-11-02_task-016-validation.md`](update-log/2026-11-02_task-016-validation.md); the
    register errors are corrected.
  - ARC-01's review of PR #29: GO WITH CONDITIONS, risk MEDIUM. No `/monthly-update` run, no tool `--apply`
    and no OPS or NB sub-chat launch before the widened TASK-018 PR merges; until then every launch packet
    states four things: no checkout, switch, merge or pull in the main checkout; no `--delete-branch`; where
    the chat runs; whether a Guardian pre-check applies.
  - Security review of PR #29: 0 BLOCKER, 5 warnings. No secret, client name, person name or e-mail address
    was added. SEC-01 (P2): the public registers are a finding aid to the unredacted client specification
    that is still public at the outgoing owner's repository (R1); SEC-02 to SEC-05 are P3.
  - OneDrive: running since 11:47 IST on 2-Nov, folder not pinned, 228 of 568 `.git` files still
    cloud-only (`project-control/REPOSITORY_AND_ENVIRONMENT_STATE.md` section 19.2); TASK-017 is in progress
    with the owner.
  - A fifth worktree (`.claude/worktrees/investment-proposal-dashboard-c68580`) exists and is unused. NB-01,
    NB-02 and NB-03 are now archived (probably by the owner); their two worktrees are on a detached HEAD (no work lost).
  - Owner decisions: D84 (the risk-free rate stays 4.5% for now) and D85 (the textbook Sortino formula).
  - New ids: TASK-075 to TASK-077, DEC-OPEN-29, KNOWN_ISSUES A32, E17 and R12, INC-18 and INC-19.
  - Release: PR #30 merged 2-Nov-2026 12:20 UTC (merge `32172f5`); Actions run 41443940610 (verify + publish)
    succeeded; 7 of 7 live files equal `site/`; local `main` advanced to the merge without checkout, switch,
    merge or pull (`update-ref` + `reset`).

## In progress / blockers

- **ARC-01 conditions (2-Nov-2026):** the widened TASK-018 PR (rule documents) must merge before any
  `/monthly-update` run, any tool `--apply` or any OPS or NB sub-chat launch; until then every launch packet
  states four things: no checkout, switch, merge or pull in the main checkout; no `--delete-branch`; where
  the chat runs; whether a Guardian pre-check applies. After the merge the Moderator advances local `main`
  (`project-control/REPOSITORY_AND_ENVIRONMENT_STATE.md` 14.4 E) and checks that
  `git diff --stat origin/main -- CLAUDE.md .claude docs` there is empty before any OPS or NB launch, because a
  session reads its rules from the working tree it opens. The merge of TASK-018 lifts the ARC-01 condition only.
  A `/monthly-update` run and any tool `--apply` on the real `site/` also wait for TASK-017 (the owner pins
  the folder, the cloud-only `.git` files hydrate, MOD-02 records the pass). The Sep catch-up (TASK-020) and
  the October cycle (about 13-17 Nov) cannot start before that.
- **Gate E for PR #30 and for D86 (still pending):** the owner confirms the wording of D84, D85 and D86 (the
  Moderator's summaries of the owner's answers). Gate E for D86 also asks the owner to confirm the reading
  (MOD-02's, INFERRED; Q1 in `update-log/2026-11-02_datapack-feasibility.md`): that "get it from the MF
  dashboard" means the Screener's monthly data pack (JSON and CSV zips; not Excel) shared by the owner each
  month. The owner started GOV-01 (TASK-018, its own worktree) and EX-01 (TASK-064, read-only, shared checkout,
  no branch, no commit) on 2-Nov-2026; GOV-01's contract passed the Guardian pre-check (GO WITH CONDITIONS,
  3-Nov-2026); its claim of 23 files is recorded in `docs/project-control/ACTIVE_CHANGE_REGISTER.md` section 1 and
  is in force from the merge of that record. The owner answered DEC-OPEN-34 on 9-Nov-2026 (the owner accepts
  client-facing changes and anything the owner asked to review; the Moderator records the rest on evidence: D87,
  recorded by the Moderator), so Gate D waits only for the owner's yes to the operator-run Gate B in every monthly
  refresh.
- **Owner decisions from the handover export (urgent; B8 and R8 are P1, B1 is P2):**
  - who builds NAV Data and Fund Risk Ratios from October (B8): answered 2-Nov-2026 (D86); the build is
    pending and still blocks the October risk matrix;
  - the PMS label (B1);
  - what to do with the client items found in the export, with compliance, and whether to tell the
    outgoing owner (R8).
  - Answered 2-Nov-2026: the risk-free rate stays 4.5% for now (D84; the desk's confirmation, DESK-15, is
    still asked); the Sortino formula stays the textbook one (D85) (the MF dashboard pack cannot honour it:
    C46, DEC-OPEN-30); and who builds NAV Data and Fund Risk
    Ratios (DEC-OPEN-01, D86): the owner pointed to the Centricity MF Screener and said the owner will share
    its files every month. MOD-02's reading (INFERRED): the two workbooks are not rebuilt in-house; from the
    October cycle the Portfolio Matrix is fed from the Screener's data pack. B8 stays open until one month is
    verified on that route; TASK-022 is re-scoped.
- **Follow-on decisions after D86 (opened 2-Nov-2026):** the pack's definitions differ from the live table
  (C46), so four owner decisions are open: DEC-OPEN-30 (which Sortino form the October matrix uses; needed by
  about 6-Nov), DEC-OPEN-31 (the other changes; about 9-Nov), DEC-OPEN-32 (written permission to use the
  Screener's computed ratios in the public page and in client decks, and to describe the pack's contract in this public repository; before the
  first apply) and
  DEC-OPEN-33 (whether the PROVISIONAL October pack may be used if the final one is not ready; about
  11-Nov). TASK-078: the owner asks the dashboard team (the final 15-Oct pack, the permission, the fields
  the pack lacks). October timeline (INFERRED): the build (TASK-022, risk class HIGH) can start only after
  the widened TASK-018 merges and must be merged before step 10 of the October cycle (about 13-17 Nov);
  if it is not merged when step 10 is reached, the cycle runs without step 10 and the risk table keeps
  '30 Sep 2026'.
- **Statements still describing the pre-answer state** (update-log T5). TASK-018 fixed, on 9-Nov-2026: the
  `CLAUDE.md` headline (B8 sentence), the `docs/MONTHLY_UPDATE_PROCESS.md` paragraph on rows 12 and 17, the inbox
  README (rows 12 and 17), the TASK-022 line in `docs/project-control/FILE_OWNERSHIP_AND_CHANGE_CONTROL.md`,
  `docs/HANDOVER.md` section 5 and the second copy of the B8 sentence in
  `docs/update-log/2026-10-23_handover-export.md` (a dated note). Still to be fixed by TASK-022 or the Moderator:
  step 10 of Part B of the monthly process (the `merge_risk_matrix.js` command), `docs/INPUT_FILES.md` (rows 12
  and 17 and the sections about them) and `docs/project-control/ARCHITECTURE_AND_DEPENDENCY_MAP.md` (the B8 and
  risk-route lines). The handover snapshots are corrected through the errata table only.
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

The full, dependency-ordered plan is in
[`project-control/TASK_REGISTER.md`](project-control/TASK_REGISTER.md) and section 13 of the master
handover; where this list and the register differ, the register wins.

**First (done 2-Nov-2026):** MOD-02 validated the handover (TASK-016). **Now:** the widened TASK-018 docs PR
(GOV-01), then the owner decision session (DEC-OPEN-30 first, then -31, -32, -33 and the rest in the
documented order: -08, -04, -05, -07, -13/-14/-24, -29; -30 and -31 are needed about 6-Nov and 9-Nov;
DEC-OPEN-34, who accepts a finished change, was answered on 9-Nov-2026: D87), TASK-064 (EX-01, read-only)
in parallel, and TASK-017 (the owner pins the folder).

**TASK-017 gates the refreshes.** When the TASK-018 PR merges, the ARC-01 conditions lift (OPS and NB launches,
after the Moderator advances local `main`), but a `/monthly-update` run and any tool `--apply` on the real `site/`
still wait for TASK-017: the owner pins the folder ("Always keep on this device"), the cloud-only `.git` files
(228 of 780 on 9-Nov-2026) hydrate, and MOD-02 records the pass here. The Sep-2026 Reckoner catch-up (item 4) and the
October MF cycle (item 5, about 13-17 Nov) cannot start before that, so the owner needs to pin the folder well
before 13-Nov. The hold is not narrowed: a worktree outside OneDrive still keeps its git data in the OneDrive `.git`.

0. Owner: answer DEC-OPEN-30 to -33 (Sortino form by about 6-Nov, other changes about 9-Nov, permission
   before the first apply, PROVISIONAL pack about 11-Nov; DEC-OPEN-34 was answered on 9-Nov-2026, D87), say yes or
   no to the operator-run Gate B in every monthly refresh (needed before GOV-01's PR reaches Gate D) and send the
   asks of TASK-078 to the MF dashboard team (FINAL 15-Oct pack by about 11-Nov). The build (TASK-022, bridge tool) starts after the widened
   TASK-018 PR has merged; if it is not merged when step 10 of the October cycle is reached, the cycle runs
   without step 10 and the table keeps '30 Sep 2026'. Also decide the PMS
   label (B1) and the export's client items (R8). Keep OneDrive running, and this folder on "Always keep
   on this device" (R6).
1. Owner: decide C20 (13 JioBlackRock Regular records); then release the held G-Sec record and apply
   the decision to all 13 in one reviewed change.
2. Desk: confirm the two Mirae FoFs whose September returns sit far above their underlying ETFs
   (S&P 500 Top 50 ETF FoF 1M 24.79%, NYSE FANG+ ETF FoF 1M 16.21%) before a client deck uses them.
3. Owner: confirm or reject the 8 renames (above).
3a. Owner: decide how the headline expected return treats instruments with no IRR band, such as
   Direct Equity (`KNOWN_ISSUES.md` C24; today they count as 0% in the Section 1 tile, Section 5
   Future Value and the Section 6.1 Live Output, but are left out of the Section 4 table and the deck's
   GRAND TOTAL — corrected 28-Oct-2026).
3b. Desk: confirm the unit of the Centricity Select alpha (`KNOWN_ISSUES.md` C23: the popover may show
   it 100 times too large). (C22, the long unflagged matrix slide, is fixed by PR #26.)
3c. Owner/desk, after PR #26: how the data should carry expected returns (C28: a per-period basis, or
   clear periods a fund has no history for; the 14 stale mid-points; the Alchemy 1Y); the Disclaimer
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

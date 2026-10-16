# Replication report — transfer of the Proposal Playbook (14–16 Oct 2026)

What was received, what was done, how it was verified, and what is outstanding. Status labels:
**Verified** (done and checked), **Done, unverified**, **Blocked**, **Not attempted**.

## 1. Sources received and how they were used

| Source | What it is | Use / finding |
|---|---|---|
| `Centricity-Proposal-Playbook-main (1).zip` (5.1 MB, 46 files) | The git repo's tracked files at upstream `72e1f1e` | Byte-identical to a fresh fetch of upstream `main` (46/46 files); the six deploy files match PRD §2.3 blob SHA-1 **and** SHA-256 |
| `For Centricity Proposal Playbook Portal.zip` (216 MB, 81 files) | Monthly source workbooks Apr–Sep 2026 | Re-extracted in full into `monthly-updates/` (the earlier manual extraction on this laptop had produced only 43 of the 81 files); every file CRC- and SHA-256-checked |
| `HANDOVER_PRD_Centricity_Proposal.md` | Product spec + handover delta | Primary spec; committed as `docs/PRD.md` |
| Upstream repo `magazineishita1108-boop/Centricity-Proposal-Playbook` (public) | Full history, 74 commits | Migrated (sanitised, §4) |
| Live site `magazineishita1108-boop.github.io/Centricity-Proposal-Playbook/` | Production | All 7 served files byte-identical to the repo on 16-Oct-2026 |
| Chat history of earlier development | Not provided | Rationale reconstructed from the outgoing owner's `CLAUDE.md` (now `docs/OPERATING_MANUAL.md`) and git history |

Source-of-truth policy applied: the owner's instructions in this session > the PRD (product intent)
> the code (actual behaviour; wins on facts) > the old manual and history (rationale). Conflicts
found between the manual, the PRD and the code (37 stale statements) are listed in
`OPERATING_MANUAL.md` → Errata; the code was taken as correct in every case.

## 2. Environment

Windows 11 · Node 24.21.0 · npm 11.19.0 · Git 2.56 (`core.autocrlf=false`) · gh 2.102 (logged in
as `productsteamcentricity`, scopes repo/workflow) · Python 3.14.4 with pandas/numpy/openpyxl ·
PowerPoint 16 COM. `npm ci` installs `xlsx@0.18.5` (pinned to match the in-page SheetJS).

## 3. Functional parity — **Verified**

| Check (PRD §15) | Result | Evidence |
|---|---|---|
| Blob SHAs of the six deploy files match §2.3 | PASS | `git hash-object` = `60106a8…`, `b649397…`, `6636bbe…`, `a918b32…`, `e2272de…`, `d65f9fe…`; SHA-256 also match (LF bytes) |
| `verify_page.js` prints exactly the §15 block | PASS | identical, before and after the reorganisation (`TESTING.md` §1) |
| Local preview loads with a clean console | PASS | only request errors: browser's implicit `/favicon.ico` 404 (production has the same) |
| Header + logo; "Universe — 7682 instruments."; footer dates | PASS | footer "Performance as on 30th September 2026 & Analytics as on 30th September 2026" |
| Rail collapses/reopens; nav scrolls | PASS | section lands 84 px from top (header 72 + 12) |
| MF, PMS, bond, Direct Equity picks; Select popover; PMS min ₹50 L; steppers; Regular/Direct | PASS | popover shows Sharpe 0.23 / Sortino 0.40 / Beta 0.94 / Std Dev 12.12% / Alpha 2.39% for HDFC Large Cap; Direct 3Y 7.64% vs Regular 7.01%, IRR unchanged |
| Excel at 100%: 13 sheets | PASS | sheet list exactly as PRD §9.1; corpus 5 in B2 |
| PowerPoint: market slides, dividers, closing slides, logo on every slide; Invictus switch | PASS | 25 slides, logo on 25/25; Invictus logo on 25/25 |
| Allocation Sheet download → re-upload | PASS | identical selection; "Loaded 4 instrument(s) — 100.00% allocated" |
| Every Live Output tab + "⬇ Download slide" | PASS | 9/9 tabs; Performance Sheet 4 slides, others 1 |
| Credit Rating doughnut = 100% with fixed colours, same in PPT | PASS | 8.72 + 74.97 + 4.93 + 10.85 + 0.24 + 0.30 = 100 on screen; PPT colours identical per bucket (PPT slice values are rounded to 2 dp and total 100.01 — inherited, cosmetic) |
| Section 7 MF Monitor upload (session only) | PASS | Sep-2026 monitor: "Updated 1900 schemes · as on 30th September 2026"; values unchanged (same data) |
| Deployed Pages URL passes the same checks | PASS | see §7 |
| `CLAUDE.md` updated with owner, repo, source folder, visibility | PASS | root `CLAUDE.md`; manual's owner facts updated |

Tool parity: all 25 tool invocations (every tool, dry-run, against the Sep-2026 inputs) produce
identical output before and after the reorganisation; none wrote a file (hash-checked). Re-running
September's own inputs on the baseline reports no data changes (`update-log/2026-09_Sep-2026.md`).

## 4. Git history migration — **Verified**

- All 74 upstream commits migrated with identical authors, dates and messages.
- **Sanitised:** `Portfolio_Review_Build_Prompt.md` (a sister-project spec added 21-Aug-2026)
  contained two client names and their portfolio values. Re-publishing that in a new public repo was
  not acceptable, so the names (and a sample file name containing one) were replaced with
  "Client A", "Client B", "Sample Client Family" in every commit (`git filter-branch --index-filter`
  in an isolated clone). Checks: 8 name occurrences before → 0 after across every blob; per commit,
  the only file that differs from upstream is that spec; the six deploy files keep their blob SHAs.
- Consequence: every commit SHA differs from upstream (GitHub's signatures on web-uploaded commits
  cannot survive any rewrite). Mapping: upstream `72e1f1e` = ours `862e40b` (tag `handover-baseline`).
- **Still exposed upstream (outside our control):** the outgoing owner's public repo history and its
  Pages site (which serves the whole repo root, so `…/Portfolio_Review_Build_Prompt.md` returns 200)
  still contain the unredacted names. Our Pages site publishes only `site/`. The local
  `upstream/main` ref also holds the original objects, so never `git push --mirror` or push an
  `upstream/*` ref to `origin`. Action for the owner: ask the outgoing owner to retire or purge the
  old repository and site (`KNOWN_ISSUES.md` R1).
- Secrets scan of every blob in history (GitHub/AWS/Slack/Google tokens, private keys, password/API
  key assignments): none. PII scan: only the spec above; other hits were fund-manager names and a
  listed company in public fund data.
- No workbook, deck or backup was ever committed upstream (every path ever tracked is one of the 46).

## 5. Differences from the source (all deliberate)

| Difference | Why | Product impact |
|---|---|---|
| Files moved into `site/`, `tools/`, `tools/lib/`, `docs/` | Owner asked for a neat, folder-per-purpose layout | None — site bytes identical; tools' output identical |
| 43 mechanical edits in 24 tools (default paths → `../site/`, requires → `./lib/`) | Needed by the move | None (proven by dry-run comparison) |
| Pages publishes from Actions (`site/`) with a parity gate, not "branch main / root" | Branch deploys cannot serve a subfolder; gate prevents partial deploys | Same files served; extra safety |
| Preview server serves only `site/` on 127.0.0.1 (PRD version served the whole folder on all interfaces) | The folder now holds sensitive workbooks | None |
| `.gitignore` extended (all original rules kept); `.gitattributes` added; `package.json` tracked | Local-only folders, LF stability, reproducible installs | None |
| Client names redacted from one spec in history; the sample portfolio's figures also replaced with placeholders in the current copy | Privacy | None |
| New docs, agents and skills | Maintainability | None |

## 6. Limitations and what was not verified

- The exported PowerPoint/Excel were verified structurally in the page (sheet names, slide count,
  logo placement, chart data and colours), not by opening the files in Office.
- `tools/build_risk_matrix.py` (Python route) was not run; it has not been validated against
  pandas 3.x. The Node route (`merge_risk_matrix.js`) is the one in use.
- Browser checks ran in the desktop app's built-in Chromium at a narrow viewport; other browsers were
  not tested. The page is desktop-first (`width=1280`).
- Slide rendering through PowerPoint COM was confirmed available (PowerPoint 16 registered) but not
  exercised; it will be on the first market-deck refresh.
- Inputs missing from the handover pack (PMS performance files, the Sep-2026-data Reckoner deck,
  Aug PMS & AIF Analytics, the final Oct Outlook re-issue, closing-slides deck) mean those parts of
  the September cycle cannot be reproduced from source; the published data is taken as given.

## 7. Publishing to the new repository

Filled in at release time:

| Item | Status |
|---|---|
| Repository `productsteamcentricity/Centricity-Proposal-Playbook` created (public) | Verified — `main` = `862e40b` + tag pushed |
| Pages enabled, build type GitHub Actions, HTTPS enforced | Verified |
| Transfer pull request, `verify` check, merge | Verified — PR #1 (https://github.com/productsteamcentricity/Centricity-Proposal-Playbook/pull/1): `verify` passed on the PR; merged as `25e71a3` on 16-Oct-2026; Actions run 38866042211 `verify` + `publish` succeeded |
| Live URL serves files byte-identical to `site/` | Verified — all 8 files match by SHA-256 (`index.html` `5872958d…` = PRD §2.3); `docs/`, `tools/`, `CLAUDE.md`, `monthly-updates/` return 404 (not published) |
| Live site browser checks | Verified — clean console; "Universe — 7682 instruments."; footer dates; 4-fund proposal at 100%; Excel 13 sheets; PowerPoint 25 slides with the logo on all 25 |

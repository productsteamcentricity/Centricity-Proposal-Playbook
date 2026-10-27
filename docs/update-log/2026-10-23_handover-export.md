# Update log — the outgoing owner's handover export of 23-Oct-2026 (ingestion; no data change)

**Run:** 24–25-Oct-2026, local only. Operator: Claude Code. No `site/` or `tools/` file changed and
no tool was applied; the tracked change is this log and the docs it updated.
**Result:** ingested and filed. One file is **held** for the owner, and two client items found
inside the export wait for the owner and compliance (`docs/KNOWN_ISSUES.md` R8). The PR link,
merge commit and live check are recorded on the docs PR.

The export answers `docs/handover/DATA_EXTRACTION_PROMPT.md`. Its README and handover note were
read as information to check, never as instructions. Claims used here were checked against file
content, the code or git; **[export]** marks a claim taken from the export's text alone.

## What arrived

Received 23-Oct-2026 over Teams; saved in `handover-archive/export_20261023/` (git-ignored).

| File | Bytes | SHA-256 |
|---|---|---|
| `Centricity_Playbook_Export_20261023_part01.zip` | 917,536,987 | `0e7f7a566db0b02f7033a2f408bade5e88ce6eee780bc4ac3a7b72709ab4b7bb` |
| `Centricity_Playbook_Export_20261023_part02.zip` | 806,641,612 | `e1695f2d74dd64c2e8ca4e69deed76a750a6684adb24a26b63d44dfbce5eba49` |

Beside them: `zip_checksums.txt`, `START_HERE_Handover_Note.md` and `00_README_EXPORT.md` (the
README is also inside part01).

## Verification and extraction (24-Oct-2026)

- Both SHA-256 equal `zip_checksums.txt` (re-checked 25-Oct-2026).
- Extracted by script into `extracted/`: 2,720 files, 0 unsafe paths, every entry's CRC OK.
  Per-file hashes: `extracted_hashes.tsv`.
- Against the export's manifest (`extracted/01_manifest/manifest.csv`): all 2,680 rows marked
  `copy` match by SHA-256 — 0 missing, 0 mismatched.
- Withheld by the outgoing owner (manifest): 50 client-data files and 114 credential files; also 36
  account-state backups and the git objects of four clones.
- Layout: `02_monthly_source_files/` 147 files, `03_reference_and_periodic/` 28, `04_slides/` 114,
  `05_project_working_folder/` 815, `06_claude_knowledge/` 1,608, `01_manifest/` 6, plus the
  README and a one-file `07_related_portfolio_review/` pointer.

## What the export shows about the code

- **No unpublished work.** The working folder's six deploy files and `robots.txt` are
  byte-identical (git blob hash) to upstream `72e1f1e`, and its 31 root tools equal upstream's.
  The live site (`main` `5bcce88`) is newer: 2,065 MASTER records differ (1,852 inception dates
  moved by the A6 fix, 214 funds refreshed by C19, fund-manager and debt fields), 33 RISK_MATRIX
  entries carry the C3 flags, and the page code changed in PRs #12–#26. Nothing from the export is
  to be deployed; its other deploy-named copies are older snapshots or clones (45 of them match no
  version in git history).
- **The one thing the repo lacked:** the NAV / risk-ratio toolchain
  (`05_project_working_folder/_nav_risk_toolchain/`, PowerShell + C#). Its outputs are
  byte-identical to the Aug and Sep `NAV Data` (#17) and `Fund Risk Ratios & 3Y Rolling` (#12)
  workbooks, so both are made in-house, not sent; who made the earlier months' copies is not shown
  (`KNOWN_ISSUES.md` B8, C35).

## Filed into `monthly-updates/` (25-Oct-2026)

Each file was dated by content (`docs/INPUT_FILES.md` rules 2 and 5) and filed in its data month;
an earlier issue of a file already there went to that month's `_superseded/`. The export's own month
folders follow file names in several places (e.g. the `31st August` PMS file is July data), so they
were not used. Every filed file was re-hashed on 25-Oct-2026 and equals the placement log
(`handover-archive/export_20261023/placement_log.tsv`). Roles are `INPUT_FILES.md` numbers.

| File | Role | As on (read from content) | Filed in | SHA-256 (first 16) |
|---|---|---|---|---|
| `Equity analytics_March 2026-0264e38a.xlsx` | #3 | 31-Mar-2026 [inferred: no date cell; name and held maturities] | `2026-03_Mar-2026/Analytics/` (new folder) | `4d302a87238bcc53` |
| `Hybrid analytics_March 2026-d20ec3a5.xlsx` | #4 | 31-Mar-2026 [inferred, as above] | `2026-03_Mar-2026/Analytics/` | `eaeb12cebfbf18d3` |
| `Debt analytics_March 2026-77174945.xlsx` | #5 | 31-Mar-2026 [inferred, as above] | `2026-03_Mar-2026/Analytics/` | `dca0967d70c67c08` |
| `Monthly Investment Reckoner - April 2026.pptx` | #15 | 31-Mar-2026 (grid footnotes) | `2026-03_Mar-2026/` | `2149d74e75170524` |
| `Monthly Market Update.pptx` | #13 (4 slides) | Apr-2026 data (slide 1) | `2026-04_Apr-2026/` | `efe463c4102609a1` |
| `Monthly Investment Reckoner - May 2026.pptx` | #15 | 30-Apr-2026 (grid footnotes) | `2026-04_Apr-2026/` | `7374b04a5b9f892c` |
| `Monthly Investment Reckoner - May 2026 (re-issue 2026-05-19 1057).pptx` | #15, earlier issue | 30-Apr-2026; stale March and January dates on 8 slides | `2026-04_Apr-2026/_superseded/` | `fd6d61f750ca77da` |
| `PMS & AIF Performance April.xlsx` (Cowork 19-May draft) | grid extract (section 3) | not stated; earlier draft of ours | `2026-04_Apr-2026/_superseded/` | `b490919b00996923` |
| `PMS_Analytics April-7069022f.xlsx` | #16 draft | none in file (one scheme duplicated) | `2026-04_Apr-2026/_superseded/` | `8ee8557660bbfd76` |
| `PMS_Analytics April.xlsx` (18-May draft) | #16 draft | none in file | `2026-04_Apr-2026/_superseded/` | `2d87a49a72f6e6c1` |
| **HELD** `MF Monitor_30th April 2026.xlsx` | #1 | 30-Apr-2026 (A3 and B12) | **not filed**: owner decision (B9) | `f84059d06dc626d5` |
| `Monthly Investment Reckoner - June 2026.pptx` | #15 | 31-May-2026 (grid footnotes) | `2026-05_May-2026/` | `53dce57baad556ff` |
| `Monthly Outlook Pagers- June 2026.pptx` | #13 (4 slides), final | May-2026 data (slide 1) | `2026-05_May-2026/` | `f407dfed35a02766` |
| `Monthly Outlook Pagers- June 2026-7c2263bd.pptx` | #13, first issue | May-2026 data | `2026-05_May-2026/_superseded/` | `6fca8d1ceb6550f7` |
| `NAV_Data_31May2021_31May2026.xlsx` | #17 | 31-May-2026 (latest date) | `2026-05_May-2026/` | `0fbf5ce8a2fae8fa` |
| `PMS_Scheme_Performance_June 2026 (re-issue 2026-07-17 1142).xlsx` | #14, old layout (rejected) | 31-May-2026 (returns equal the June-2026 deck grid) | `2026-05_May-2026/` | `ad3e460909568c97` |
| `PMS Analytics_May 2026 (re-issue 2026-06-30 1401).xlsx` | #16, PMS-only subset of ours | none in file | `2026-05_May-2026/_superseded/` | `a2d1423c50aea8b9` |
| `Risk Ratios_May 2026.xlsx` | #12 older layout, before "Updated" | May-2026 by name; not read | `2026-05_May-2026/_superseded/` | `2c24b555b90e06b1` |
| `Bond List_20th May 2026.xlsx` | P1, two sheets | none in content; 20-May by name | `2026-05_May-2026/` | `d1a776febc938a11` |
| `Monthly Investment Reckoner - July 2026.pptx` | #15 | 30-Jun-2026 (grid footnotes) | `2026-06_Jun-2026/` | `4db110bd3a3f4a8c` |
| `Monthly Investment Reckoner - July 2030 1.pptx` | #15, earlier issue (19-Jul) | 30-Jun-2026 | `2026-06_Jun-2026/_superseded/` | `fc42d235119df229` |
| `PMS_Scheme_Performance (003) (re-issue 2026-08-21 1719).xlsx` | #14 | 30-Jun-2026 by returns (July-deck grid); risk-ratio dates run to 31-Jul | `2026-06_Jun-2026/` | `42203ffc94554a39` |
| `NAV Data as on 30th June 2026 (re-issue 2026-09-17 1520).xlsx` | #17, later copy without the benchmark sheet | 30-Jun-2026 | `2026-06_Jun-2026/_superseded/` | `cc22e8a6e9467d3e` |
| `Listed Direct Equity_June 2026-8f8d74d0.xlsx` | #6, earlier list | none in file | `2026-06_Jun-2026/_superseded/` | `ff56da5d44d183ca` |
| `Bond List_01st June 2026.xlsx` | P1, earlier | none in content; 01-Jun by name | `2026-06_Jun-2026/_superseded/` | `bd07324e9cba1d63` |
| `Market Update Slide_August 2026.pptx` | #13 (5 slides) | Jul-2026 data (slide 1) | `2026-07_Jul-2026/` | `faf2a853be9801cf` |
| `NAV Data as on 31st July 2026.xlsx` | #17 | 31-Jul-2026 | `2026-07_Jul-2026/` | `ef4fcc487b81a7a1` |
| `PMS_Scheme_Performance_31st August 2026.xlsx` | #14, the live file | **31-Jul-2026 despite the name** (B1) | `2026-07_Jul-2026/` | `c52e266bb1989df8` |
| `PMS_Scheme_Performance_31st July 2026.xlsx` | #14, earlier July issue (merged 03-Sep) | 31-Jul-2026 | `2026-07_Jul-2026/_superseded/` | `0982a87d179021aa` |
| `Hybrid Analytics_July 2026 (re-issue 2026-08-13 1604).xlsx` | #4, earlier version | 31-Jul-2026 | `2026-07_Jul-2026/_superseded/` | `554a7ee786818e57` |
| `Monthly Investment Reckoner - September 2026 (re-issue 2026-10-08 1652).pptx` | #15, source of live Select and AIF | 31-Aug-2026 (grid footnotes) | `2026-08_Aug-2026/` | `6f3c48d9319cb555` |
| `Bond List_06th Aug 2026.xlsx` | P1, live Invictus bonds | none in content; 06-Aug by name | `2026-08_Aug-2026/` | `df0c3b9aa8b6fa99` |
| `Monthly Outlook Pagers_Oct 2026 (re-issue 2026-10-13 1714).pptx` | #13, final (live slides) | Sep-2026 data (slide 6 dated September) | `2026-09_Sep-2026/` | `68a66106c5a7b406` |
| **MOVED** `Monthly Outlook Pagers_Oct 2026.pptx` (11:28 first issue, from our pack) | #13, superseded | Sep-2026 data; slide 6 still dated August | `2026-09_Sep-2026/_superseded/` | `7b9f16aea17b2296` |

Of the 289 files under `02_` to `04_`, the plan put 33 in month folders (32 copied, 1 held). The
rest stayed in the archive (next section).

## Stayed in the archive only, and why

- **Already held or no new data:** 84 files byte-identical to ours; 30 re-issues with nothing newer
  than ours: 22 cell- or parse-identical (monitors, expense ratios, analytics, the DE universe, the
  Sep SIF Monitor, the July look-through, `AMFI CODE`), two more copies of the May PMS-only
  look-through filed above, a header-only May PMS & AIF Performance file and the five older
  `from_cowork_uploads/` files listed below. Also cell-identical second copies of two filed PMS
  files, and a 15-Jul copy of the filed June pager deck.
- **Renders and working copies:** `04_slides/rendered/` (55; the `final/` JPGs of the 17:14 Oct deck
  are byte-identical to the six live market images) and `04_slides/topic_slides_work_topicppt/`
  (48, an unzipped deck). They are outputs, not inputs.
- **Mid-month snapshots:** the 15-Jun and 17-Jun, 2-Sep and 4-Sep Regular Monitors, the 13-May,
  30-Jul and 8-Sep Direct Monitors and the 18-May and 2-Sep SIF Monitors. They are not month-end
  inputs.
- **Index downloads:** `02_monthly_source_files/_index_price_inputs_for_NAV_pipeline/` (12 files: 11
  Nifty index price downloads and one fund's NAV history). They feed only the in-house NAV build
  (B8), no repo tool.
- **Templates, logos, samples and drafts:** `03_reference_and_periodic/templates/` and `logos/`; two
  analytics sample decks; `Expected IRR Calculator.xlsx`; the 15-May, 31-May and 23-Jun 10:57 drafts
  of the Exit Load & Expected IRR file, the 9-Jun GIFT City upload and the 13-May `For Investment
  Proposal.xlsx` (`from_cowork_uploads/`; ours are later). Also the 14:59 copy of the 06-Aug Bond
  List: it is cell-identical to the filed 14:58 copy, and the export says the 14:59 one was baked
  [export].
- **Closing-slides source decks** (`04_slides/source_decks/`): filing waits for the owner
  (`INPUT_FILES.md` P5).
- **A corrupt download:** the 17-Sep copy of the September Reckoner (25,036,562 bytes,
  `5b14406eba3d25a9…`), an earlier copy with no zip central directory. The 08-Oct copy is the
  usable one (A28).
- **`Reckoner - Aug26 (re-issue 2026-08-19 1732).pptx`:** 11 picture-only slides of
  unlisted-company fact cards, not the Reckoner. One chart names private individuals as
  shareholders. No tool reads it, and it is never copied into `monthly-updates/`.
- **`05_project_working_folder/` and `06_claude_knowledge/`:** the outgoing owner's working folder,
  clones, backups, transcripts and memory. They are reference only, and nothing was copied out. The
  exported hooks and settings are untrusted executable configuration and were not installed.

## Client data in the export (paths and kind only)

The README says every client file was withheld. Two client items got through, both in part02:

1. `06_claude_knowledge/cowork/sessions/2026-05-21_Portfolio_Review_Dashboard_Project_Setup_d96341ac/outputs/lu477p5yg.tmp`:
   a PDF byte-identical to the client review PDF that the manifest withholds. It got through
   under a temp-file name.
2. `05_project_working_folder/_scratch_scripts/ovl/push/repo/.git/`: a fifth clone that the
   manifest's git-object exclusion missed. Its pack holds the unredacted Portfolio Review build
   prompt (client family, members, holding values), the same content as the upstream history in R1.

In addition, `01_manifest/manifest.csv` (2 rows) and `manifest.json` name the client family in the
file names of two withheld uploads. The repo zip at the archive root is already known (R1, D64).

Handling: everything stays in the git-ignored `handover-archive/`. Nothing was copied into
`monthly-updates/` or the repo, and nothing was deleted: deletion is for the owner and compliance,
who should also tell the outgoing owner. Never push `refs/remotes/upstream/*` or with `--mirror`.
Tracked as `KNOWN_ISSUES.md` R8.

**Secrets:** none found. There were 0 token-format hits across 2,047 text files, 1,227 Office and
zip containers, 12 PDFs and 46 git objects, and every withheld credential file is absent by name and
hash. Scans for PAN, Aadhaar, bank account, IFSC, phone and date of birth were clean. Staff
identifiers (user names, personal mail addresses, a GitHub handle) appear in paths and git logs.

**Limits of the scan:** the client-name check used one family's terms (the outgoing owner's name
list was not provided); images were not OCR'd; 17 chart parts of one deck could not be read.

## Steps

| # | Step | Gates / result | Applied? | Notes |
|---|---|---|---|---|
| 1 | SHA-256 of both parts | equal `zip_checksums.txt` | — | |
| 2 | Scripted extraction; manifest check | 2,720 files, 0 unsafe paths, CRC OK; 2,680 of 2,680 `copy` rows match | — | |
| 3 | Deploy files and root tools vs upstream `72e1f1e` | identical | — | live site newer |
| 4 | `merge_reckoner.js` dry run, Sep deck (08-Oct copy), scratch `site/` | all PASS; CENTRICITY_SELECT 178 → 178 (+0/−0), 33 categories | no | membership reproduces; retained entries keep their text by design |
| 5 | `merge_aif_performance.js` dry run, same deck | all PASS; aif 12 → 12, every value unchanged | no | |
| 6 | `merge_bond_list.js --desk Invictus` dry run, 06-Aug list | all PASS; 39 rows → 36 bonds; Invictus 36 → 36, equal live | no | 1 `CHECK`: a bond also under OneDigital |
| 7 | `merge_pms_performance.js` parse of the `31st August` file vs live, scratch | 692 → 692 | no | content is 31-Jul (B1) |
| 8 | `rename_schemes.js` dry run, Sep Monitor, scratch `site/` (25-Oct-2026) | PASS; 8 renames, 0 ambiguous, 14 new to MASTER | no | the 14: C40 |
| 9 | Placement | 32 copied, 1 moved, 1 held; all re-hashed equal | local only | |

## Counts

| Line | Before | After | Why it moved |
|---|---|---|---|
| `verify_page` (25-Oct-2026, exit 0) | MASTER 7,682 · Select 178 (178 in MASTER) · PMS 692 / AIF 12 / benchmarks 4 · RISK_MATRIX 1,088 · EQUITY_ANALYTICS 1,205 · 0 duplicates · 0 script errors | same | no `site/` change |
| Workbooks and decks in the month folders | 80 | 112 | +32 copied; the first-issue Oct deck moved within `2026-09` |
| Files in `_superseded/` folders | 0 | 14 | 13 earlier issues copied + 1 moved |
| Month folders | 6 (2026-04 … 2026-09) | 7 | new `2026-03_Mar-2026` (March analytics and the April-2026 Reckoner) |

## Data in force after this run

Unchanged, with one correction of fact: **PMS performance is 31-Jul-2026 data under the label
"31st August 2026"** (B1). AIF performance and Centricity Select are 31-Aug-2026, as before.
Domains and dates: `docs/PROJECT_STATE.md`.

## Owner decisions taken

None yet. The held April monitor, the PMS label, the client items and the producer of #12/#17 wait
for the owner (`KNOWN_ISSUES.md` → *Before the next refresh*, item 10).

## Issues found / follow-ups (`docs/KNOWN_ISSUES.md`)

- Closed or narrowed: B3 closed; B2 and B7 partly closed (archive copies filed). B1, B4, B5 and B6
  stay open: the export has nothing newer. B1 now also records the PMS label.
- New: B8 (#12/#17 have no producer; blocks the October Portfolio Matrix), B9 (April monitor
  held), C35 (two Sortino definitions), C36 (undated May-2026 Select ratios), C37 (bond 3Y/5Y rule
  of 20-May never applied), C38 (inferred SBI prefix), C39 (UTI side-pocket records), C40 (the
  unlisted "new to MASTER" rows), A28 (`tools/lib/pptx.js`), R8 (client items in the export).
- Corrected: C5 (very likely our existing record), C6, C11, C23, C24, C28, R1, the eighth rename
  (it holds 15-Jun-2026 figures).
- Not acted on here: the outgoing owner's `Project_History_and_Conversation_Summary.md` (15-Oct)
  stays in the archive unless the owner asks for it; the process docs
  (`MONTHLY_UPDATE_PROCESS.md`) still list #12 and #17 among the desk's files (B8).

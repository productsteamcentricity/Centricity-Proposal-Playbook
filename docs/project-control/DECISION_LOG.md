# Decision log

| Field | Value |
|---|---|
| Version | 1 |
| Date | 28-Oct-2026 |
| Author chat | MOD-01 (handover package, TASK-015) |
| Status | Authoritative for decisions waiting for the owner (DEC-OPEN-nn). Approved decisions: `docs/DECISIONS.md` is authoritative; part 2 here is only an index. |
| Supersedes | nothing (first version) |
| Next review | MOD-02 at TASK-016, then each time the owner answers a decision |

**A recommendation is not a decision.** Part 1 lists questions only the owner can answer. Where the repo or
a dated MOD-01 message documents a recommendation, it is quoted as such; where none is documented, the entry
says "no recommendation documented". Nothing in part 1 may be implemented until the owner answers and the
answer is recorded as section 1.5 says: a `Dnn` in [`../DECISIONS.md`](../DECISIONS.md), unless the entry's
"Record the answer as" line says none is needed.

Related registers: [`TASK_REGISTER.md`](TASK_REGISTER.md) (the work each decision unblocks),
[`REQUIREMENTS_AND_CHANGE_REGISTER.md`](REQUIREMENTS_AND_CHANGE_REGISTER.md),
[`../KNOWN_ISSUES.md`](../KNOWN_ISSUES.md) (the defects behind most decisions; find an entry by searching
for `### <ID>.`, e.g. `### B8.`).

---

# Part 1. Open decisions waiting for the owner (DEC-OPEN-nn)

## 1.1 How to read an entry

Each entry follows the owner's escalation format (handover master prompt section 27): the problem in plain
words; why a decision is needed; the options; what each changes; benefits and disadvantages; impact on what
works today; future maintenance; risks and whether it can be undone; the documented recommendation; and how
to record the answer. Every entry is BLOCKED on the named decider.

The options, effects and recommendations come from the cited KNOWN_ISSUES and DECISIONS entries and the
28-Oct-2026 fact sheets. Where a benefit, disadvantage or effect is MOD-01's own reasoning rather than a
documented fact, it is marked (INFERRED).

## 1.2 Order to ask, and deadlines

The Oct-2026 MF cycle runs about 13-17-Nov-2026, so four decisions have an implied deadline of
**~13-Nov-2026** (INFERRED from the documented cadence). Suggested order for the owner's decision session:

1. DEC-OPEN-02 and DEC-OPEN-03, then DEC-OPEN-01 (by ~13-Nov-2026).
2. DEC-OPEN-08 (by ~13-Nov-2026).
3. DEC-OPEN-04; DEC-OPEN-05; DEC-OPEN-07.
4. DEC-OPEN-13, DEC-OPEN-14 and DEC-OPEN-24 together (the old site).
5. The rest as time allows.

## 1.3 Summary

| ID | Decision (short) | Decider | Unblocks | Deadline | Recommendation documented? |
|---|---|---|---|---|---|
| DEC-OPEN-01 | Who makes the NAV and risk-ratio workbooks | owner | TASK-022, TASK-057, TASK-053 | ~13-Nov-2026 | yes (port to Node) |
| DEC-OPEN-02 | Risk-free rate | owner + desk | TASK-022 | ~13-Nov-2026 | partly (re-ask the desk; no value) |
| DEC-OPEN-03 | Sortino definition | owner + desk | TASK-022 | ~13-Nov-2026 | no |
| DEC-OPEN-04 | PMS date label (B1) | owner | TASK-025 | before TASK-020 | no |
| DEC-OPEN-05 | Two client items in the export | owner + compliance | TASK-032 | - | no |
| DEC-OPEN-06 | File the true 30-Apr Monitor | owner | TASK-035 | - | no |
| DEC-OPEN-07 | 13 JioBlackRock Regular records; very young funds | owner | TASK-023, TASK-067 | before the Oct bake (optional) | yes (MOD-01: clear them) |
| DEC-OPEN-08 | The 8 scheme renames | owner | TASK-024 | ~13-Nov-2026 | partly (check the Motilal one) |
| DEC-OPEN-09 | Bond 3Y/5Y: band top or band average | owner | TASK-027 | - | documented next step only |
| DEC-OPEN-10 | Segregated side-pocket records | owner | TASK-028 | - | yes (drop and tighten) |
| DEC-OPEN-11 | Deck labels and AMCs (C4, C5, C6, C38) | owner + desk | TASK-029 | before TASK-020 steps 14/14a | partly (C5 pin) |
| DEC-OPEN-12 | Select popover alpha and ratio dates | owner + desk | TASK-030 | - | partly (C23 approach) |
| DEC-OPEN-13 | Upstream repo purge and old-site notice (R1) | owner (+ compliance) | TASK-033 | - | yes (the R1 action list) |
| DEC-OPEN-14 | When and how the old site is retired | owner (+ outgoing owner) | TASK-034 | after DEC-OPEN-24 | yes (tell users now; notice or redirect) |
| DEC-OPEN-15 | One rule for the headline expected return | owner (+ desk) | TASK-026 | - | no |
| DEC-OPEN-16 | How the data records expected returns | owner + desk | TASK-031 | - | suggested fix only |
| DEC-OPEN-17 | Branch protection on `main` | owner | TASK-036 | - | yes (enable; owner decision) |
| DEC-OPEN-18 | Keep the repo and site public long-term | owner | - | - | no (beyond D60) |
| DEC-OPEN-19 | Keep the git repo in OneDrive or move it | owner | TASK-037 | - | yes (move the clone) |
| DEC-OPEN-20 | Hang Seng ETFs and ageing debt stats | owner | TASK-051 | - | suggested fix only |
| DEC-OPEN-21 | Closing-slides source deck and Disclaimer layout | owner + desk | TASK-038 | - | no |
| DEC-OPEN-22 | Repository hygiene and the merged-branch rule | owner | TASK-059..TASK-062 | - | no (export the stash first) |
| DEC-OPEN-23 | Fund-specific pages in the deck | owner | (a new task if yes) | - | no |
| DEC-OPEN-24 | What "full testing" of the new build means | owner | TASK-034 | before DEC-OPEN-14 | MOD-01 advice of 21-Oct |
| DEC-OPEN-25 | One Moderator for both projects, or one each | owner | CHAT_REGISTRY | - | yes (one per project) |
| DEC-OPEN-26 | Request the outgoing owner's chat export | owner | TASK-073 | time-sensitive | no |
| DEC-OPEN-27 | Source of the PMS/AIF benchmark rows | owner (+ desk) | TASK-065 | - | no |
| DEC-OPEN-28 | Which dashboard "the portfolio dashboard" meant | owner | - | - | not applicable (a question) |

## 1.4 The open decisions

### DEC-OPEN-01 Who makes the two monthly risk workbooks from October 2026

Decider: owner. First asked: 27-Oct-2026 12:28 UTC by MOD-01 ("Should I rebuild the risk-ratio and NAV
workbook tools in-house?", buttons "Yes, rebuild them" / "Desk will provide"); unanswered. Deadline:
~13-Nov-2026. Unblocks: TASK-022, TASK-057, TASK-053. Related: KNOWN_ISSUES B8, A22, C10; D43.

- **The problem.** Every month the dashboard shows risk numbers for about 1,088 funds (how bumpy a fund's
  returns were, and how much return it gave for that bumpiness: Sharpe, Sortino and similar ratios). They
  come from two spreadsheets, "NAV Data" (#17) and "Fund Risk Ratios & 3Y Rolling" (#12). We believed the desk
  sent them. The outgoing owner's export (read 23-27-Oct) showed the outgoing owner made them on their own
  computer with a home-made PowerShell and C# toolchain. Nobody makes them now. The only copy of that
  toolchain is local: `handover-archive/export_20261023/extracted/05_project_working_folder/_nav_risk_toolchain/`
  (221 files, git-ignored).
- **Why a decision is needed.** Without a maker, the October cycle cannot refresh the risk table; it keeps
  saying "30 Sep 2026" and gets older every month. Building a replacement takes time, so the choice is needed
  before the October cycle.
- **Options.** (a) Rebuild the core of the toolchain (about 12 scripts) as Node tools in `tools/`, with a test
  that must reproduce the live Sep-2026 workbook and risk table exactly. (b) Validate and use the existing
  Python tool `tools/build_risk_matrix.py` (never validated, A22; it uses the June Sortino definition and a
  different 3-year window start, C35; it still needs NAV Data as input, so a NAV maker is needed anyway,
  INFERRED from its usage line). (c) Ask the desk to make both workbooks.
- **What each changes.** (a) New tools, a regression test and docs; each month the AMFI NAV history is fetched
  (a script in the outgoing owner's toolchain) and someone downloads five Nifty index files by hand (B8).
  (b) The Python route becomes production and D43 is revisited.
  (c) No engineering; the October data depends on the desk.
- **Benefits and disadvantages.** (a) In our control, tested, same language as the other monthly tools; costs
  engineering time before mid-November and a monthly manual download. (b) Less new code, but unvalidated,
  differs from the live definition, and does not remove the need for a NAV maker. (c) No build work, but
  depends on people outside the project, timing unknown, and the desk has not made these files before
  (INFERRED from B8).
- **Impact on existing functionality.** None until a new risk table is applied; today's table stays as it is.
- **Maintenance.** (a) and (b): we maintain the builder code and its test. (c): we maintain only the merge step
  (`tools/merge_risk_matrix.js`).
- **Risks and reversibility.** Reversible: nothing changes on the page until a built table is merged. The risk is
  a wrong table reaching client decks; the regression test in option (a) is the guard.
- **Documented recommendation (not a decision).** Option (a): port the core toolchain to Node in `tools/` with a
  Sep-2026 regression test; decide DEC-OPEN-02 and DEC-OPEN-03 first, and keep today's risk-free rate and
  Sortino definition until they are decided (KNOWN_ISSUES B8; `docs/PROJECT_STATE.md` next steps; MOD-01,
  27-Oct-2026). No separate rationale is written down; the option's own guard is the regression test that must
  reproduce the live workbook (B8).
- **Record the answer as.** A new `Dnn` that amends D43; update B8; set TASK-022 (and TASK-057, TASK-053) from
  BLOCKED to PLANNED. Originating chat: MOD-01 (retired); MOD-02 relays the answer to the chat it assigns to
  TASK-022.

### DEC-OPEN-02 Which risk-free rate the risk ratios use

Decider: owner + desk (DESK-15). Asked by MOD-01: 19-Oct-2026 (as a desk question) and 27-Oct-2026.
Deadline: ~13-Nov-2026 (before the TASK-022 build). Unblocks: TASK-022. Related: C11; D58 (Open).

- **The problem.** Risk ratios compare a fund's return with a "risk-free" return (what a very safe investment
  pays). The calculation uses 4.5%, typed into the code. Nobody has confirmed where 4.5% came from (it is
  called a "standing desk convention"); the old operating manual notes the 91-day Treasury Bill at about 5.26%.
- **Why a decision is needed.** The rate changes Sharpe, Sortino, Treynor and Jensen alpha for every fund. A new
  builder (DEC-OPEN-01) has to use one documented value.
- **Options.** (a) Confirm 4.5%. (b) Use the desk's house rate (for example a Treasury Bill rate), as the desk
  states it.
- **What each changes.** (a) Nothing changes. (b) Every ratio changes on the next build.
- **Benefits and disadvantages.** (a) Continuity with past months, but the number stays unconfirmed. (b) Matches
  the house convention, but this month's ratios will not be directly comparable with earlier months (INFERRED).
- **Impact on existing functionality.** The Portfolio Matrix on screen and in the deck, from the next build.
- **Maintenance.** One documented constant in the builder; whether and when it is reviewed is for the owner to
  set (no rule exists).
- **Risks and reversibility.** Reversible: re-run the build with another rate.
- **Documented recommendation (not a decision).** "Re-ask the desk for the house rate before the next risk build"
  (KNOWN_ISSUES C11). No value is recommended.
- **Record the answer as.** A new `Dnn` that closes D58 (D58's status then changes from Open to Superseded by
  the new entry); update C11; note the value in TASK-022's acceptance.

### DEC-OPEN-03 Which Sortino definition to use

Decider: owner + desk (DESK-16). Asked: 27-Oct-2026 by MOD-01. Deadline: ~13-Nov-2026. Unblocks: TASK-022.
Related: C35, A22.

- **The problem.** The Sortino ratio measures return per unit of "bad" bumpiness (only the down moves). The
  live history uses two different formulas: June used a semi-deviation formula; August and September used the
  textbook formula. Nobody approved the change. The results differ by 0.04 on average and up to 0.27.
- **Why a decision is needed.** The new builder must implement exactly one formula.
- **Options.** (a) Keep the textbook formula (what the live table shows now). (b) Go back to June's
  semi-deviation formula (what `tools/build_risk_matrix.py` implements).
- **What each changes.** The Sortino values in the risk table and the deck; nothing else.
- **Benefits and disadvantages.** (a) No change from what clients see today. (b) Matches the earlier months and
  the Python tool, but changes today's numbers (INFERRED).
- **Impact on existing functionality.** The Sortino column only.
- **Maintenance.** One formula, documented and tested in the builder.
- **Risks and reversibility.** Reversible (re-run).
- **Documented recommendation (not a decision).** No recommendation documented.
- **Record the answer as.** A new `Dnn`; update C35; put the formula in TASK-022's acceptance (and TASK-057).

### DEC-OPEN-04 The PMS date label (31-Jul data shown as "31st August 2026")

Decider: owner. Asked: 27-Oct-2026 by MOD-01. Unblocks: TASK-025. Related: B1 (P2), C26, C30; DESK-01;
REQ-PPT-64.

- **The problem.** The PMS returns on the page, in Excel and in the deck are July data, but the label says
  "31st August 2026" (`DATA_DATES.pms`, grep `DATA_DATES` in `site/index.html`). The label makes the numbers
  look one month fresher than they are.
- **Why a decision is needed.** A client-facing date is wrong. Changing a data label is a data change the owner
  decides.
- **Options.** (a) Relabel now to the true date in a reviewed data PR. (b) Leave it and replace the data when the
  desk sends the August and September PMS files (DESK-01), inside the Sep-2026 Reckoner catch-up (TASK-020).
- **What each changes.** (a) Footer, Excel and deck PMS dates read July from the next publish. (b) Nothing until
  the files arrive; then data and label change together.
- **Benefits and disadvantages.** (a) Honest at once and a small change, but the dashboard visibly shows older
  PMS data (INFERRED). (b) One change instead of two, but the wrong label stays live until an unknown date.
- **Impact on existing functionality.** The PMS/AIF date stamp only; no numbers change under (a).
- **Maintenance.** None beyond the normal monthly PMS step.
- **Risks and reversibility.** Reversible either way.
- **Documented recommendation (not a decision).** No recommendation documented (only the desk request is
  documented).
- **Record the answer as.** A new `Dnn`; update B1; set TASK-025 to PLANNED (option a) or fold it into TASK-020
  (option b).

### DEC-OPEN-05 The two client items found in the outgoing owner's export

Decider: owner + compliance. Asked: 27-Oct-2026 by MOD-01. Unblocks: TASK-032. Related: R8 (P1), R1; INC-15.

- **The problem.** The export the outgoing owner sent on 23-Oct contained two items with client information: a
  client review PDF under a temporary file name, and a copied `.git` folder that still holds an unredacted
  version of a document whose public copy we redacted. There is also the original repo zip (R1). They sit only
  on this computer, in the git-ignored `handover-archive/` folder; they are not in GitHub.
- **Why a decision is needed.** Holding client data is a compliance question. Deleting it cannot be undone.
  Claude never deletes such items; the owner does it, if that is the decision.
- **Options.** (a) Keep them in a controlled local place. (b) Delete them from this computer (the owner's own
  act). In both cases, tell the outgoing owner.
- **What each changes.** (a) Nothing on disk changes; access is restricted. (b) The local copies are gone.
- **Benefits and disadvantages.** (a) Available if compliance needs them later, but client data stays on this
  machine. (b) Least exposure, but irreversible and any reference value is lost (INFERRED).
- **Impact on existing functionality.** None on the dashboard.
- **Maintenance.** (a) Someone must keep them controlled; nobody may push `refs/remotes/upstream/*` or use
  `--mirror`.
- **Risks and reversibility.** Deletion is irreversible.
- **Documented recommendation (not a decision).** No recommendation documented on keep versus delete.
- **Record the answer as.** Update R8 and `docs/update-log/2026-10-23_handover-export.md`; a new `Dnn` only if
  the owner wants a standing rule; TASK-032 closed when the decision is recorded and the outgoing owner told.

### DEC-OPEN-06 File the true 30-April Monitor

Decider: owner. Asked: 27-Oct-2026 by MOD-01. Unblocks: TASK-035. Related: B9.

- **The problem.** The local April folder holds a Monitor file dated 15-May. The export contained the true
  30-April Monitor (2,079 fund rows). It is held, not filed.
- **Why a decision is needed.** Only for an accurate archive; no live number depends on April.
- **Options.** (a) File it as April's Monitor and move the 15-May copy to `_superseded/`. (b) Leave it as it is.
- **What each changes.** Local files only; nothing in `site/` or GitHub.
- **Benefits and disadvantages.** (a) Correct history if April is ever re-baked. (b) No effort; history stays
  slightly wrong.
- **Impact on existing functionality.** None.
- **Maintenance.** None.
- **Risks and reversibility.** Reversible (move the files back).
- **Documented recommendation (not a decision).** No recommendation documented.
- **Record the answer as.** Update B9 and `docs/INPUT_FILES.md` section 4 note (a); no `Dnn` needed.

### DEC-OPEN-07 The 13 JioBlackRock Regular records, and very young funds

Decider: owner. First asked: 19-Oct-2026 11:14 UTC by MOD-01 (repeated 21-Oct). Unblocks: TASK-023, and the
treatment rule for TASK-067. Related: C20 (P1), C16, C43; D81.

- **The problem.** Twelve JioBlackRock "Regular" plans started in August 2026, but they show 3-month, 6-month
  and 1-year returns copied from the older "Direct" plan, for periods before the Regular plan existed. A
  thirteenth (the G-Sec fund, C16) is held at older values until this is decided (D81). The same family of
  problem: one ETF launched on 15-Sep-2026 shows an annualised since-inception return of 297,765% (C43),
  because annualising a few days' return gives an absurd number.
- **Why a decision is needed.** The screen, Excel and deck quote returns for periods a fund did not exist. That
  conflicts with CLAUDE.md rule 6 (no fabricated data in client-facing output).
- **Options.** (a) Clear every return period longer than the fund's life, for all 13, and release the held record
  in the same change. (b) Keep the values and label them as taken from the Direct plan. For very young funds
  generally: the same rule for since-inception values, enforced by a bound in the monthly bake (TASK-067).
- **What each changes.** (a) Fewer figures shown for these funds; the held record refreshed. (b) A label added
  in three outputs.
- **Benefits and disadvantages.** (a) Honest and consistent with rule 6, but some cells show "-" for new funds.
  (b) More numbers shown, but they describe a different plan and need a label everywhere (INFERRED).
- **Impact on existing functionality.** Performance cells of these 13 funds (and of very young funds), and any
  proposal totals that include them.
- **Maintenance.** A young-fund rule applied by the bake every month (TASK-067).
- **Risks and reversibility.** Reversible in git; decks already sent to clients are not.
- **Documented recommendation (not a decision).** MOD-01 recommended clearing them and then releasing the held
  G-Sec record in the same change (19-Oct-2026, transcript). The repo records only the conflict with rule 6.
- **Record the answer as.** A new `Dnn` (the young-fund rule); update C20, C16, C43; set TASK-023 and TASK-067 to
  PLANNED.

### DEC-OPEN-08 Confirm or reject the 8 scheme renames

Decider: owner. First asked: 19-Oct-2026 by MOD-01 (repeated 21-Oct). Deadline: ~13-Nov-2026 (before
`rename_schemes.js --apply` in the October cycle). Unblocks: TASK-024. Related: A6, C19; D46, D79.

- **The problem.** Fund houses sometimes rename schemes. The monthly tool found 8 likely renames (same launch
  date and same fund house): HDFC Retirement Savings; four Kotak overseas funds of funds; two Axis funds of
  funds; and Motilal Oswal Asset Allocation Passive FoF-Aggressive -> Multi Asset Passive FoF. They are not
  applied, so the old-name records keep old figures (seven are at 30-Jun).
- **Why a decision is needed.** A rename joins a new name to an old fund's history. If it is wrong, one fund's
  history is shown under another fund's name. It must be answered before the October rename step.
- **Options.** For each pair: confirm, or reject.
- **What each changes.** Confirmed renames get current figures in the next bake; rejected ones stay stale and are
  listed "not in MASTER".
- **Benefits and disadvantages.** Confirming gives fresh figures; a wrong confirmation mixes two funds' histories.
  Rejecting is safe but leaves stale figures live.
- **Impact on existing functionality.** The 8 records' performance, and the IRR map keys the tool re-keys in
  `site/Centricity_IRR_Offshore.js`.
- **Maintenance.** None beyond the monthly rename step.
- **Risks and reversibility.** Reversible: rename back; earlier names are kept in `prev_name` / `prev_names` (D79).
- **Documented recommendation (not a decision).** Check the Motilal Oswal pair against the fund house's notice
  ("looks suspicious"; no notice was found in the export). None for the other seven.
- **Record the answer as.** A new `Dnn` listing the confirmed and rejected pairs; update A6; set TASK-024 to
  PLANNED inside TASK-021.

### DEC-OPEN-09 Bond 3-year and 5-year figures: top of the band or band average

Decider: owner. Asked: 27-Oct-2026 by MOD-01. Unblocks: TASK-027. Related: C37, C28.

- **The problem.** Bonds have an expected-return range (an "IRR band", e.g. 9.75%-9.95%). The tool stores the top
  of the band as the bond's 1Y, 3Y and 5Y figure (`tools/merge_bond_list.js:198`). On 20-May-2026 (before the
  transfer) the outgoing owner's side asked for "the average of the expected pre tax irr range" instead. 14
  OneDigital bonds are affected (e.g. 9.95% shown where the average is 9.85%).
- **Why a decision is needed.** The two give different client-facing numbers, and the 20-May request was never
  carried out.
- **Options.** (a) Keep the top of the band (today). (b) Use the band average.
- **What each changes.** (b) A tool change, an update to the 14 records, and a DECISIONS entry; bond returns and
  weighted rows in proposals change slightly.
- **Benefits and disadvantages.** (a) No change. (b) A more central (less optimistic) figure that matches the
  earlier request (INFERRED), but numbers clients have seen will move.
- **Impact on existing functionality.** Bond rows and proposal totals that include bonds.
- **Maintenance.** None beyond the monthly Bond List step.
- **Risks and reversibility.** Reversible.
- **Documented recommendation (not a decision).** The repo documents "confirm the average" as the next step
  (KNOWN_ISSUES C37). That repeats the 20-May request; it is not a reasoned recommendation.
- **Record the answer as.** A new `Dnn`; update C37; set TASK-027 to PLANNED.

### DEC-OPEN-10 The 4 segregated side-pocket records

Decider: owner. Asked: 27-Oct-2026 by MOD-01. Unblocks: TASK-028. Related: C39, C24, C40.

- **The problem.** When a debt fund has a bad bond, it can put that bond in a separate "side pocket". Four such
  side-pocket records (2 Franklin, 2 UTI) are in the fund list. They have almost no money, no returns and no
  expected-return band, yet a user can pick them into a client proposal. The two UTI ones slip through because
  the parser skips only names containing "segregated portfolio".
- **Why a decision is needed.** Removing records from the fund list is a data change the owner approves.
- **Options.** (a) Drop the four and widen the parser skip to any "segregated" name, at both places in the
  parser. (b) Leave them.
- **What each changes.** (a) The fund list goes from 7,682 to 7,678 records; the skip becomes wider.
- **Benefits and disadvantages.** (a) Users cannot pick an empty side pocket; a wider skip could, in theory, skip a
  real fund with "segregated" in its name (INFERRED; none is known). (b) No change; the risk of a meaningless
  line in a proposal stays.
- **Impact on existing functionality.** The fund picker and the MASTER count.
- **Maintenance.** None; the parser test guards it.
- **Risks and reversibility.** Reversible in git.
- **Documented recommendation (not a decision).** Drop the four and tighten the skip in a `fix/` branch (the
  documented proposal in C39, awaiting approval).
- **Record the answer as.** A new `Dnn`; update C39; set TASK-028 to PLANNED.

### DEC-OPEN-11 Deck labels and fund houses that need the desk (C4, C5, C6, C38)

Decider: owner + desk (DESK-11, DESK-12, DESK-13). Asked by MOD-01: 19-Oct-2026 (C4, C5 as desk questions) and
27-Oct-2026 (C5, C6, C38). Needed before steps 14/14a of
TASK-020. Unblocks: TASK-029. Related: C4, C5, C6, C38, A20; D75.

- **The problem.** Four small labelling questions only the desk can answer: (C5) the Reckoner deck's "Motilal
  Oswal Gift City India Equity Fund - Inbound" is very likely our record "Motilal Oswal Alternative Investment
  (Inbound)", and its Centricity Select badge is lost until they are matched; (C6) the fund house of Prism Hybrid
  Long-Short Fund is unknown; (C38) the fund house of Magnum Equity Ex-Top 100 Long-Short SIF is inferred as SBI;
  (C4) whether Mosaic Multiyield Series I is retired or closed, and whether Series II should be added.
- **Why a decision is needed.** Wrong labels reach the deck's fund-house charts and the Select badge.
- **Options.** C5: add a Reckoner pin once the desk confirms. C6/C38: set the fund house when confirmed. C4:
  remove the badge from a retired Series I; adding Series II is a fund-list change (`tools/add_reckoner_funds.js`).
- **What each changes.** Badge restored (no fund added); fund-house labels; possibly one fund added.
- **Benefits and disadvantages.** Correct labels; each needs a desk answer first.
- **Impact on existing functionality.** Select badges, fund-house charts, the fund list (C4 only).
- **Maintenance.** Pins live in `tools/data/pins.json` (D75).
- **Risks and reversibility.** Reversible.
- **Documented recommendation (not a decision).** C5: "once the desk confirms, add a Reckoner pin and re-run the
  Reckoner step". C6, C38, C4: ask the desk.
- **Record the answer as.** Update C4, C5, C6, C38; pins recorded in `tools/data/pins.json` with the desk's
  confirmation date; no `Dnn` unless the owner sets a rule.

### DEC-OPEN-12 The Centricity Select popover: alpha unit and undated ratios

Decider: owner + desk (DESK-14). Raised: 21-Oct-2026 by MOD-01 (the alpha unit, as a desk check); the undated
ratios (C36) are recorded only in KNOWN_ISSUES. Unblocks: TASK-030. Related: C23, C36, C26.

- **The problem.** The small Centricity Select popover shows each fund's "alpha" (extra return over the market).
  The value is stored as a percent but shown multiplied by 100 again (34 of 46 entries show 10% or more). All
  the popover's ratios are also undated May-2026 values.
- **Why a decision is needed.** The unit and period of alpha are a desk fact; whether to date, replace or hide the
  old ratios is the owner's choice.
- **Options.** C23: once the desk confirms unit and period, show alpha as stored with a "%" or convert it once in
  the data; never guess the scale in code (CLAUDE.md rule 4). C36: (a) label the ratios "as on 31-May-2026",
  (b) replace them with the monthly risk-table values, or (c) hide them.
- **What each changes.** The popover only; no export reads alpha.
- **Benefits and disadvantages.** C36 (a) is quick but shows old numbers; (b) is current but a code change;
  (c) removes information (INFERRED).
- **Impact on existing functionality.** The popover only.
- **Maintenance.** (b) follows the monthly risk table automatically (INFERRED).
- **Risks and reversibility.** Reversible.
- **Documented recommendation (not a decision).** C23: the approach above (show as stored with % or convert once,
  never auto-detect). C36: no recommendation documented.
- **Record the answer as.** A new `Dnn` for C36 if a display rule is set; update C23, C36; set TASK-030 to PLANNED.

### DEC-OPEN-13 The outgoing owner's public repository and old site (R1)

Decider: owner (+ compliance on whether to notify anyone). Actions are the outgoing owner's. Raised: KNOWN_ISSUES
R1, opened at the transfer (16-Oct-2026); re-checked 28-Oct-2026. Unblocks: TASK-033. Related: R1, R7, R8; D64.

- **The problem.** When we copied the project, we removed client names from our copy of the history (D64). The
  outgoing owner's original repository is still public, and its history still holds the unredacted file
  (VERIFIED 28-Oct-2026). The old site is built from that repository. Anyone could read it, and could link our
  clean history back to it.
- **Why a decision is needed.** Only the outgoing owner can change their repository; the owner has to ask them, and
  decide with compliance whether anyone must be told.
- **Options.** Ask the outgoing owner to: (1) make the repository private, delete it, or purge the file from its
  history; (2) retire the old site (see DEC-OPEN-14); (3) ask GitHub Support to clear cached views. Or do
  nothing (the exposure continues).
- **What each changes.** After the purge, MOD-02 removes or re-fetches our local `upstream` remote so the
  unredacted objects leave this machine too.
- **Benefits and disadvantages.** Acting closes the exposure; it depends entirely on the outgoing owner's
  cooperation and timing.
- **Impact on existing functionality.** None on the new site. Deleting or privatising the repository would also
  take the old site down (INFERRED: a free Pages site needs a public repository), so it must be timed with
  DEC-OPEN-14.
- **Maintenance.** None afterwards.
- **Risks and reversibility.** A history purge is irreversible (in the outgoing owner's repository).
- **Documented recommendation (not a decision).** The R1 action list itself: ask the outgoing owner for (1), (2)
  and (3).
- **Record the answer as.** Update R1 (and R7); record what was asked and when in TASK-033; a new `Dnn` only for
  a notification decision.

### DEC-OPEN-14 When and how the old site is retired

Decider: owner (the outgoing owner performs it). Asked: 16-Oct and 21-Oct-2026 by MOD-01. Depends on
DEC-OPEN-24. Unblocks: TASK-034. Related: R7, R1; REQ-049.

- **The problem.** The old site (https://magazineishita1108-boop.github.io/Centricity-Proposal-Playbook/) still
  works (HTTP 200 on 28-Oct). It shows the 14-Oct version and gets no monthly updates; the new site is 7
  site-changing merges ahead. Users' bookmarks and shared proposal links (`#p=...`) still point to the old one.
  On 16-Oct-2026 the owner said the old dashboard is deleted only "after full testing has been done on the new
  build".
- **Why a decision is needed.** Two copies drift apart: anyone using the old link sees old data. Retiring it is
  hard to undo for users.
- **Options.** When: after the owner signs off full testing (DEC-OPEN-24). How: (a) replace the old site with a
  notice pointing to the new URL; (b) a redirect to the new URL; (c) take it down. Independently: tell users the
  new URL now.
- **What each changes.** (a) Old links show a notice. (b) Old links land on the new site (whether shared `#p=`
  links survive a redirect is UNKNOWN). (c) Old links break.
- **Benefits and disadvantages.** (a) Clear and simple, one extra click. (b) Smoothest for users, but needs more
  work by the outgoing owner (INFERRED). (c) Simplest, but breaks bookmarks.
- **Impact on existing functionality.** None on the new site.
- **Maintenance.** None once retired.
- **Risks and reversibility.** Hard to reverse once users lose their links.
- **Documented recommendation (not a decision).** KNOWN_ISSUES R7: give users the new URL now; ask the outgoing
  owner for a notice or redirect. The retirement itself only after full testing (the owner's own condition).
- **Record the answer as.** A new `Dnn` (retirement condition and method); update R7 and `docs/DEPLOYMENT.md`
  (TASK-074); TASK-034 to IN PROGRESS when the outgoing owner acts.

### DEC-OPEN-15 One rule for the headline expected return

Decider: owner (+ the desk's IRR file, DESK-06). Asked: 21-Oct-2026 14:00 UTC by MOD-01. Unblocks: TASK-026.
Related: C24, B7.

- **The problem.** Each instrument in a proposal has an expected-return band. Some instruments have no band
  (Direct Equity, and 99 mutual fund, ETF and SIF records, mostly 2026 launches). Three places on screen count
  those instruments as 0%, which pulls the headline down: the Section 1 tile (`computeKPIs`), the Section 5
  Future Value "Expected Pre-Tax Return (p.a.)", and the Section 6.1 Live Output Proposal tab. Two places leave
  them out: Section 4 (`H.weightedReturns`) and the PowerPoint Investment Option GRAND TOTAL
  (`H.rollupReturns`). In a 21-Oct test proposal, the tile and Live Output showed 9.51-11.13% while Section 4
  showed 10.57-12.37%.
- **Why a decision is needed.** One proposal shows two different expected returns to a client. Which rule is
  right is a product choice.
- **Options.** (a) Leave instruments without a band out of the weighting everywhere, and say so on screen and on
  the slide. (b) Give them an expected return. Either way, a current desk IRR file (DESK-06) would give most of
  the 99 a band.
- **What each changes.** (a) The three 0% places change; their numbers rise to match Section 4. (b) All five places
  change, using the new expected returns.
- **Benefits and disadvantages.** (a) Simple and consistent, but the headline covers only part of the money and
  needs a note. (b) Covers every rupee, but someone must set an expected return for equities, which is a
  judgement (INFERRED).
- **Impact on existing functionality.** The Section 1 tile, Future Value, Live Output, Section 4 and the deck
  GRAND TOTAL: client-facing.
- **Maintenance.** One shared function and a test (TASK-026).
- **Risks and reversibility.** Reversible.
- **Documented recommendation (not a decision).** No recommendation documented.
- **Record the answer as.** A new `Dnn`; correct and update C24; set TASK-026 to PLANNED (or wait for DESK-06).

### DEC-OPEN-16 How the data records expected returns

Decider: owner + desk. Raised: 22-Oct-2026 by NB-03 (its report). Unblocks: TASK-031. Related: C28, C37; D83;
REQ-PPT-125.

- **The problem.** For bonds, AIFs and some PMS, the "1Y/3Y/5Y return" fields hold expected figures (a yield or
  the middle of an IRR band), not past performance. Since D83 the deck marks them with `*`, but the screen and
  the Excel export still show them as if they were track record. Also, 14 AIF mid-points no longer match their
  fund's current band, and one PMS 1-year figure (Alchemy) is stale.
- **Why a decision is needed.** How the data says "this is expected, not achieved" is a data-model choice, and
  the 14 mid-points need the desk.
- **Options.** (a) Store a basis per period (for example a `ret_basis` field) so the screen and Excel can mark
  expected figures like the deck does (`H.isExpectedReturn`). (b) Clear the periods that have no real history.
  Separately: fix the 14 mid-points and the Alchemy figure.
- **What each changes.** (a) A data field, the screen and Excel. (b) Fewer figures shown.
- **Benefits and disadvantages.** (a) Keeps the information and labels it honestly; more work. (b) Simple, but
  removes figures clients use to compare (INFERRED).
- **Impact on existing functionality.** The screen and Excel performance views; the deck already marks them.
- **Maintenance.** (a) Every tool that writes returns must set the basis (INFERRED).
- **Risks and reversibility.** Reversible.
- **Documented recommendation (not a decision).** A suggested fix is documented in C28 (a basis field or cleared
  periods; screen and Excel use `H.isExpectedReturn`); no decision.
- **Record the answer as.** A new `Dnn` (extends D83); update C28, C37; set TASK-031 to PLANNED. Originating chat
  NB-03 is COMPLETED: MOD-02 relays to the chat it assigns.

### DEC-OPEN-17 Branch protection on `main`

Decider: owner (a repository-settings change needs the owner's explicit instruction, CLAUDE.md "Never").
Asked: 16-Oct-2026 by MOD-01. Unblocks: TASK-036. Related: R9; D63, D68; REQ-024.

- **The problem.** Every merge to `main` publishes the live site within minutes. The rule "merge only after the
  `verify` check passes" is only a habit; GitHub does not enforce it (no branch protection, no rulesets).
- **Why a decision is needed.** Repository settings are the owner's to change.
- **Options.** (a) Turn on "require the verify check" for `main`. (b) Leave it.
- **What each changes.** (a) A PR without a green `verify` cannot be merged.
- **Benefits and disadvantages.** (a) Stops an accidental bad publish; an urgent fix must still pass `verify`.
  (b) No change; relies on every chat following the rule.
- **Impact on existing functionality.** None on the site.
- **Maintenance.** None.
- **Risks and reversibility.** Reversible (the setting can be turned off).
- **Documented recommendation (not a decision).** "Enabling 'require the verify check' on `main` is a recommended
  follow-up - owner decision" (`docs/DEPLOYMENT.md`).
- **Record the answer as.** A new `Dnn`; update R9 and `docs/DEPLOYMENT.md`; TASK-036 to PLANNED with the owner's
  instruction quoted.

### DEC-OPEN-18 Keep the repository and site public long-term

Decider: owner. Raised: `docs/PROJECT_STATE.md` next steps. Related: R2 (Accepted), D60.

- **The problem.** On 16-Oct the owner chose a public repository with free GitHub Pages (D60). The fund list,
  rationales and IRR bands are readable by anyone. No client data is in the repo.
- **Why a decision is needed.** D60 was taken for the transfer; whether it holds long-term was left open.
- **Options.** (a) Keep it public (D60). (b) A private repository with Pages (needs a paid GitHub plan), or another
  host.
- **What each changes.** (b) Hosting, cost and the publish workflow.
- **Benefits and disadvantages.** (a) Free and working today. (b) Product data no longer world-readable; costs
  money and migration work (INFERRED).
- **Impact on existing functionality.** (b) The live URL may change (INFERRED).
- **Maintenance.** (b) A new hosting set-up to maintain (INFERRED).
- **Risks and reversibility.** What was already public cannot be made private retroactively; the visibility
  setting itself is reversible.
- **Documented recommendation (not a decision).** No recommendation documented beyond D60.
- **Record the answer as.** Confirm D60 or add a new `Dnn` that supersedes it; update R2.

### DEC-OPEN-19 Keep the git repository inside OneDrive, or move it out

Decider: owner. Asked: 16-Oct and 19-Oct-2026 by MOD-01. Unblocks: TASK-037. Related: R6, E16; D65.

- **The problem.** The project folder (which is the git repository, D65) lives in OneDrive. OneDrive locks files
  while syncing and replaces files with cloud-only placeholders. On 25-Oct a `git checkout` failed ("mmap failed")
  and truncated tracked files (restored from git, nothing lost). On 28-Oct OneDrive was not running and 229 of 519
  `.git` files were cloud-only.
- **Why a decision is needed.** Every refresh and git operation is exposed to this. Moving the folder changes
  where the owner drops monthly files.
- **Options.** (a) Keep it in OneDrive with the workaround: OneDrive running, folder set to "Always keep on this
  device" (TASK-017), and no checkout/switch in that folder. (b) Move the git clone outside OneDrive and keep only
  `monthly-updates/` in OneDrive.
- **What each changes.** (b) Paths in CLAUDE.md, docs, skills and `.claude/launch.json`; the Claude memory folder
  (keyed to the project path) must be carried across (E16).
- **Benefits and disadvantages.** (a) No move, but the hazard stays and depends on settings. (b) Removes the hazard;
  a one-time move with path changes.
- **Impact on existing functionality.** None on the site.
- **Maintenance.** (a) The workaround must be checked before each git or tool session (INFERRED).
- **Risks and reversibility.** Reversible.
- **Documented recommendation (not a decision).** "Suggested fix (owner decision): move the clone outside
  OneDrive" (KNOWN_ISSUES R6).
- **Record the answer as.** A new `Dnn` (amends D65); update R6; TASK-037 to PLANNED after TASK-071.

### DEC-OPEN-20 Two Hang Seng ETFs and 27 records with ageing debt statistics

Decider: owner. Raised: KNOWN_ISSUES C21 (19-Oct-2026). Unblocks: TASK-051. Related: C21.

- **The problem.** Two Hang Seng ETFs are filed as "Debt ETF". 27 Hybrid or Solution records carry debt statistics
  that are never refreshed, so they only get older.
- **Why a decision is needed.** Fund classification and what statistics to show are product choices.
- **Options.** Reclassify the two ETFs; for the 27 records, refresh the statistics from a source, clear them, or
  keep them (with the owner).
- **What each changes.** The fund taxonomy (filters and analytics buckets) and those records' debt figures.
- **Benefits and disadvantages.** Correct classification; clearing stats removes stale but possibly useful numbers
  (INFERRED).
- **Impact on existing functionality.** Filters, asset-class analytics for these funds.
- **Maintenance.** None if cleared or reclassified; a refresh source would need a monthly step (INFERRED).
- **Risks and reversibility.** Reversible.
- **Documented recommendation (not a decision).** A suggested fix is documented in C21 (reclassify the two;
  decide the 27 records' stats with the owner).
- **Record the answer as.** Update C21; TASK-051 to PLANNED; a `Dnn` if a taxonomy rule is set.

### DEC-OPEN-21 Which closing-slides deck to file, and the Disclaimer layout

Decider: owner + desk (DESK-10). Raised: 22-Oct-2026 by NB-03; export ingestion. Unblocks: TASK-038 and
REQ-PPT-93. Related: C34, B7; D30.

- **The problem.** The closing slides (including the Disclaimer) are images made from a desk deck. The export holds
  two versions of that deck (29-Jul and 27-Aug); neither is filed as the current source. The Disclaimer slide's
  layout is unbalanced, and because its text sits inside the desk's image, only a new source slide can fix it.
- **Why a decision is needed.** Choosing the source deck is the owner's; a balanced Disclaimer slide needs the desk.
  The disclaimer wording must not change (REQ-PPT-92).
- **Options.** File the 29-Jul or the 27-Aug version. Ask the desk for a re-laid Disclaimer source slide, or leave
  the layout.
- **What each changes.** The closing-slide images in `site/Centricity_ExtraSlides.js` (through
  `tools/update_closing_slides.js`).
- **Benefits and disadvantages.** A newer deck may carry newer wording (UNKNOWN which differs); a re-laid slide
  looks better but needs desk time.
- **Impact on existing functionality.** The deck's closing slides only.
- **Maintenance.** The filed source deck becomes the reference for future updates (INFERRED).
- **Risks and reversibility.** Reversible.
- **Documented recommendation (not a decision).** No recommendation documented.
- **Record the answer as.** Update C34 and `docs/INPUT_FILES.md` (P5); TASK-038 to PLANNED.

### DEC-OPEN-22 Repository hygiene, and the rule for merged branches

Decider: owner. Raised: 28-Oct-2026 handover fact sheets. Unblocks: TASK-059, TASK-060, TASK-061, TASK-062.
Related: E12.

- **The problem.** Old, finished work is lying around: 25 merged branches on GitHub, 26 merged local branches, 3
  extra worktrees (all clean) and one stash from 19-Oct. The release docs say to merge with `--delete-branch`, but
  no merge since PR #7 did, and the repository setting `delete_branch_on_merge` is off.
- **Why a decision is needed.** Deleting things needs the owner's agreement (the handover prompt forbids discarding
  work without a safe plan). The stash is the risky one: applying it would put old September data back.
- **Options.** (a) Clean up in order: worktrees, then local branches, then remote branches; export the stash as a
  patch to `backups/`, then drop it. (b) Leave everything. And for the future: (i) delete a branch when its PR
  merges (pass `--delete-branch`, or turn on the repository setting, which is a settings change), or (ii) keep
  branches and change the release docs.
- **What each changes.** Nothing in `site/`. Branch lists get short; the stash leaves git (the patch stays in
  `backups/`).
- **Benefits and disadvantages.** (a) Less clutter and no chance of applying the stash by mistake; a little work.
  (b) No work; clutter grows and the docs keep disagreeing with practice.
- **Impact on existing functionality.** None.
- **Maintenance.** Rule (i) keeps it clean automatically.
- **Risks and reversibility.** Merged branches can be restored from their PRs; dropping the stash is irreversible
  without the exported patch (the export worked on 28-Oct).
- **Documented recommendation (not a decision).** No recommendation documented (only: export the stash patch
  first).
- **Record the answer as.** A new `Dnn` for the merged-branch rule; update E12; TASK-059..TASK-062 to PLANNED.

### DEC-OPEN-23 Fund-specific pages in the proposal deck

Decider: owner. Raised: 22-Oct-2026 by NB-03 (report; `docs/proposal-output-format-audit.md` s7). Unblocks: a
new task if the answer is yes. Related: REQ-PPT-127.

- **The problem.** The client-ready reference deck had pages about individual funds (the fund's story, where its
  extra return comes from, fee slabs, calendar-year monthly returns). The portal does not hold that content for
  every fund, so the new design system did not build them.
- **Why a decision is needed.** Whether these pages are wanted, and who writes the content, is a product choice.
- **Options.** (a) Not wanted (today). (b) Wanted: decide the content source (who writes it, for which funds), then
  add a data block and a slide builder.
- **What each changes.** (b) New data, new slides, a new monthly or ad-hoc content step (INFERRED).
- **Benefits and disadvantages.** (b) Richer proposals, but the content must be written and kept current.
- **Impact on existing functionality.** None under (a).
- **Maintenance.** (b) Ongoing content upkeep (INFERRED).
- **Risks and reversibility.** Reversible.
- **Documented recommendation (not a decision).** No recommendation documented.
- **Record the answer as.** A new `Dnn`; if yes, a new requirement (REQ-096 or later) and a task.

### DEC-OPEN-24 What "full testing" of the new build means

Decider: owner. Raised: the owner's 16-Oct-2026 condition; MOD-01 advice of 21-Oct-2026. Unblocks: TASK-034 and
DEC-OPEN-14. Related: REQ-049, REQ-071; R7; TASK-064.

- **The problem.** The owner said the old dashboard is deleted only "after full testing has been done on the new
  build", but nobody has written down what full testing is. The last full 7-area browser check was on 21-Oct,
  before the PowerPoint changes of 22-Oct. On 28-Oct only startup was checked (it works; no export was run).
- **Why a decision is needed.** Without a checklist nobody can say when the condition is met.
- **Options.** (a) Claude runs `docs/TESTING.md` section 3 (11 checks) plus a PowerPoint export and an Excel export
  opened in Microsoft Excel (TASK-064), and the owner signs the result. (b) As (a), plus the owner's team builds a
  couple of real proposals on the new link and compares them with the old site. (c) The owner writes their own
  checklist.
- **What each changes.** Only when the old site can be retired.
- **Benefits and disadvantages.** (a) Fast and repeatable, but tests only what Claude knows to test. (b) Adds real
  users' judgement; takes the team's time. (c) Fully the owner's criteria; needs drafting (INFERRED).
- **Impact on existing functionality.** None.
- **Maintenance.** The checklist can be reused after big releases (INFERRED).
- **Risks and reversibility.** Reversible until the old site is retired.
- **Documented recommendation (not a decision).** MOD-01 advice of 21-Oct-2026 (transcript): have the team build a
  couple of real proposals on the new link and compare them. No checklist exists.
- **Record the answer as.** A new `Dnn` with the checklist (or a link to it in `docs/TESTING.md`); TASK-064 drafts
  it; TASK-034 follows.

### DEC-OPEN-25 One Moderator for both projects, or one per project

Decider: owner. Raised: 28-Oct-2026 (the owner pasted the same handover prompt into this project and the sister
Portfolio Review Dashboard project). Affects: `CHAT_REGISTRY.md`.

- **The problem.** The owner runs two Claude projects: this Proposal Playbook and the separate Portfolio Review
  Dashboard (its own folder, repository and chats, e.g. EXT-PR-01). Both are getting a new Moderator.
- **Why a decision is needed.** Who coordinates what decides which chat the owner talks to.
- **Options.** (a) One Moderator per project. (b) One Moderator for both.
- **What each changes.** (b) One registry would cover two repositories and two release processes.
- **Benefits and disadvantages.** (a) Each Moderator holds less context and works in one folder; the owner talks to
  two chats. (b) One contact, but more context per chat (faster compaction) and a risk of applying one project's
  rules to the other (INFERRED).
- **Impact on existing functionality.** None.
- **Maintenance.** (a) Each registry lists the other project as external.
- **Risks and reversibility.** Reversible.
- **Documented recommendation (not a decision).** One Moderator per project, because the projects have separate
  repositories, folders, data and release processes (MOD-01 package design, 28-Oct-2026).
- **Record the answer as.** A new `Dnn`; update `CHAT_REGISTRY.md` (external section) and the bootstrap prompt if (b).

### DEC-OPEN-26 Request the outgoing owner's chat export and history summary

Decider: owner. Raised: the export ingestion (`docs/handover/README.md`; the update log of 23-Oct). Time-sensitive:
depends on the outgoing owner's availability. Unblocks: TASK-073. Related: REQ-011.

- **The problem.** The outgoing owner offered their claude.ai chat export or redacted transcripts; nobody asked for
  them. Their `Project_History_and_Conversation_Summary.md` (in the export) was "not acted on".
- **Why a decision is needed.** Asking is the owner's call; the offer may not stay open.
- **Options.** (a) Ask for the export (over Teams) and have MOD-02 reconcile it and the summary with the repo. (b)
  Do not ask.
- **What each changes.** (a) New local material under `handover-archive/` (git-ignored); possibly new KNOWN_ISSUES
  or decision history.
- **Benefits and disadvantages.** (a) May explain past choices nobody wrote down; it may contain client data and must
  be read as data only (INFERRED). (b) No effort; that history may be lost.
- **Impact on existing functionality.** None.
- **Maintenance.** None.
- **Risks and reversibility.** Not asking may become irreversible if the outgoing owner's material is gone.
- **Documented recommendation (not a decision).** No recommendation documented.
- **Record the answer as.** Update TASK-073 (PLANNED or SUPERSEDED); no `Dnn` needed.

### DEC-OPEN-27 Where the PMS/AIF benchmark rows come from

Decider: owner (+ desk). Raised: 28-Oct-2026 handover fact sheets (new KNOWN_ISSUES C41). Unblocks: TASK-065.
Related: C41.

- **The problem.** PMS and AIF tables show benchmark rows (for example NIFTY 50 TRI) on screen, in Excel and in the
  deck. They read a fixed block in the page (`window.PMS_BENCHMARK_PERF`) that no tool updates; it last changed on
  20-May-2026. Each month the tools do write fresh benchmark values (`PMS_PERFORMANCE.benchmarks`), but the page
  never reads them. Example: NIFTY 50 TRI 1-month shows 0.075 from the fixed block while the monthly data holds
  -0.011.
- **Why a decision is needed.** Clients compare funds with these rows; which source is right is the owner's choice.
- **Options.** (a) Make the page read the monthly `PMS_PERFORMANCE.benchmarks`. (b) Keep the fixed block but
  refresh it each month.
- **What each changes.** (a) Page code in three places (screen, Excel, deck). (b) A new manual monthly step.
- **Benefits and disadvantages.** (a) One source, kept current by existing tools; a shared-interface code change.
  (b) No code change, but a manual step that can be forgotten (INFERRED).
- **Impact on existing functionality.** Benchmark rows in PMS/AIF tables: client-facing.
- **Maintenance.** (a) None beyond the existing monthly step. (b) A monthly edit.
- **Risks and reversibility.** Reversible.
- **Documented recommendation (not a decision).** No recommendation documented.
- **Record the answer as.** A new `Dnn`; update C41; TASK-065 to PLANNED; `INTERFACE_CONTRACTS.md` if (a).

### DEC-OPEN-28 Which dashboard "the portfolio dashboard" link meant

Decider: owner. Asked: 21-Oct-2026 14:00 UTC by MOD-01; no reply. Related: REQ-054.

- **The problem.** On 21-Oct the owner asked for "the final link for the portfolio dashboard". MOD-01 gave this
  dashboard's link and asked whether the owner meant the separate Portfolio Review Dashboard (whose link MOD-01
  does not have).
- **Why a decision is needed.** To close REQ-054 with the right link.
- **Options.** (a) This dashboard: https://productsteamcentricity.github.io/Centricity-Proposal-Playbook/ (already
  given). (b) The Portfolio Review Dashboard: out of this project's scope; its own chats hold its link.
- **What each changes.** Nothing in this repository.
- **Benefits and disadvantages, impact, maintenance.** Not applicable.
- **Risks and reversibility.** None.
- **Documented recommendation (not a decision).** Not applicable (a question to the owner).
- **Record the answer as.** Update REQ-054's evidence; no `Dnn`.

## 1.5 How to record the owner's answer (every decision)

1. **Write it down the same day.** Add to the decision's entry: `Answer: <owner's words> (dd-Mmm-yyyy hh:mm UTC,
   chat ID)` and set its status from BLOCKED to SUPERSEDED (by Dnn). Do not delete the entry: move it to section 1.6.
2. **Add a new `Dnn` to [`../DECISIONS.md`](../DECISIONS.md)** with the next free number (D84 on 28-Oct-2026):
   Context, Decision, Rationale, Alternatives, Consequences, Source (the owner's message, date and chat). Add it to
   the index table there. If the wording is MOD-02's summary of the owner's answer, the owner confirms it.
   (Small filing answers such as DEC-OPEN-06 need no `Dnn`; the entry says so.)
3. **Update the linked records in the same branch:** the KNOWN_ISSUES entry (`docs/KNOWN_ISSUES.md`), the tasks it
   unblocks in [`TASK_REGISTER.md`](TASK_REGISTER.md) (BLOCKED -> PLANNED, logged with the date), and the
   requirement in [`REQUIREMENTS_AND_CHANGE_REGISTER.md`](REQUIREMENTS_AND_CHANGE_REGISTER.md) if one is affected.
4. **Prepare the relay message** for the originating or assigned chat: a copy-ready text with the decision, the
   `Dnn`, the task ID and the acceptance criteria. If MOD-02 runs in the Claude desktop app and that session exists,
   it may send it (`SendMessage` to the `local_...` id). Otherwise it tells the owner the message is ready to relay.
   Never say a message was sent unless it was.
5. **Commit** on a `docs/` branch, PR, `verify` green, merge (CLAUDE.md "How every change is made").

## 1.6 Decided (closed) open decisions

None yet (28-Oct-2026).

---

# Part 2. Approved decisions (index only; `docs/DECISIONS.md` is authoritative)

## 2.1 Load-bearing approved decisions a Moderator must know

`docs/DECISIONS.md` holds D1-D83 (never reused). Statuses there: Open D2, D58; D43 "Active (premise reopened)";
Superseded D4, D5, D41, D45, D69. Next free: **D84**. The one-line summaries below are pointers; read the entry
before acting on it.

| D | Title (short) | Status in DECISIONS.md | Why it matters now |
|---|---|---|---|
| D1 | A deploy is six files, loaded in a fixed order (June -> IRR/Offshore -> SIF) | Active | CLAUDE.md rule 1; siblings re-apply on every load |
| D2 | Fold siblings 3-5 into the embedded blocks | Open | = C1, TASK-045; never inside a data refresh |
| D6 | The embedded `DATA_DATES` is authoritative | Active | date labels on every output |
| D24 | GIFT City edits also go into the June sibling | Active | the sibling owns the GIFT City bucket |
| D25 | Join `sebi_mcap` by name; top-10 Large Cap gate | Active | the gate exists only in tools (A31) |
| D37 | Exclude no-holdings funds; no fabricated fallbacks | Active | CLAUDE.md rule 6 |
| D42 | Bake with the page's own parsers; dry-run by default | Active (amended by D72) | page parser edits change the next bake |
| D43 | Node route into `RISK_MATRIX`; drop `c` | Active (premise reopened) | DEC-OPEN-01 (B8) |
| D46 | Rename before every bake; identity = inception + AMC | Active (amended by D73, D79) | CLAUDE.md rule 7; DEC-OPEN-08 |
| D48 | One hybrid predicate for all four analytics gates | Active | CLAUDE.md rule 8 |
| D49 | PMS/AIF look-through is written in two places | Active | A29, TASK-068 |
| D50 | SIF Monitor baked into the SIF sibling; always /100 | Active | CLAUDE.md rule 4 |
| D58 | Rf = 4.5%, pending desk confirmation | Open | = DEC-OPEN-02 |
| D60 | Public repository on free GitHub Pages (owner, 16-Oct-2026) | Active | no client data anywhere in the repo; DEC-OPEN-18 |
| D61 | Monthly updates publish automatically once every check passes (owner, 16-Oct-2026) | Active | never yet exercised; data corrections are not covered |
| D62 | Repository reorganised into `site/`, `tools/`, `tools/lib/`, `docs/` | Active | repository layout |
| D63 | Pages built by GitHub Actions from `site/`, behind a parity gate | Active | Gate D; no branch protection (R9, DEC-OPEN-17) |
| D64 | History migrated sanitised, not verbatim | Active | never push `upstream/*`; R1 |
| D65 | The local workspace folder is the git repository | Active | R6; DEC-OPEN-19 |
| D66 | Preview server serves only `site/`, on 127.0.0.1 | Active | `node .claude/serve.js` / `preview_start playbook` |
| D67 | Shared Claude config, package manifest and LF tracked (`xlsx` 0.18.5 pinned) | Active | never upgrade without the owner (TASK-058) |
| D68 | Changes go branch -> PR -> verify -> merge | Active | every change, docs included |
| D70 | `DATA_DATES.analytics` labels the MF analytics only | Active | A3 |
| D71 | Centricity Select merge refuses join failures and mass drops | Active (extended by D76) | `--accept-drops` only by the owner |
| D72 | One tool contract: exit 0 ok / 1 gate failed / 2 usage or input error; gates before writes; atomic writes; strict CLI | Active | read every gate line |
| D73 | Workbook dates are calendar days (`isoDay`) | Active | A6 |
| D74 | Source reliability flags reach the page as `fl` | Active | 33 risk flags; dagger notes |
| D75 | Hand pins live in `tools/data/pins.json` | Active | pins only with the owner |
| D76 | Reckoner merge refuses a drop under an unmapped deck heading | Active | Reckoner step |
| D77 | CDN scripts carry SRI; noindex; inline favicon | Active | never change CDN versions |
| D78 | `Centricity_Risk_Matrix.js` moved to `docs/archive/` (supersedes D69) | Active | 7 published files; the legacy file returns 404 |
| D79 | Rename history kept in `prev_names` | Active | renames are reversible |
| D80 | Refresh-only Monitor sheets; unknown sheets fail the bake | Active | C19 |
| D81 | Publish the C19 re-run; keep blank-cell values; hold the C20 G-Sec record (owner, 21-Oct-2026) | Active | DEC-OPEN-07 |
| D82 | The PowerPoint export lays out every native slide through one measured design system (owner, 22-Oct-2026) | Active | CLAUDE.md rule 10; C44, C45 are exceptions |
| D83 | The deck marks an expected 1Y/3Y/5Y figure with `*` (owner, 22-Oct-2026) | Active | C28; DEC-OPEN-16 |

## 2.2 Owner decisions made in conversation, not yet recorded as a D-number

These were approved by the owner but live only in chat transcripts. TASK-074 records them in
`docs/DECISIONS.md` from D84, with wording the owner confirms. Until then, this table is the record.

| When (UTC) | Decision (owner's words or act) | Where it lives today | Label |
|---|---|---|---|
| 15-Oct-2026 14:36 | Stage A before Stage B: "Stop after establishing the baseline" | master prompt (transcript); honoured (REQ-007) | VERIFIED (words) |
| 16-Oct-2026 13:09 | "Start fixing all the issues that you have identified and tell me the impact of that pre and post fixing" (fix programme authorised) | transcript; KNOWN_ISSUES introduction and CHANGELOG describe the work, not the decision | VERIFIED (words) |
| 16-Oct-2026 13:09 | Export-prompt constraints: capture all data that may be needed in future; say nothing about deleting the existing dashboard; zips over Teams, not OneDrive | only as text inside `docs/handover/DATA_EXTRACTION_PROMPT.md` | VERIFIED (words) |
| 16-Oct-2026 13:09 | The old dashboard is deleted only "after full testing has been done on the new build" | transcript only; not in R7 or `docs/DEPLOYMENT.md` | VERIFIED (words) |
| 16-Oct-2026 ~13:09 | Started the card "Fix the three P1 tool risks before the next refresh" (worktree session NB-01) | transcript only | INFERRED (act) |
| 21-Oct-2026 ~05:51 | Started the card "Small tool and UI follow-ups from the 19-Oct fixes" (NB-02) | transcript only | INFERRED (act) |
| 22-Oct-2026 14:30 | Chose "New session" for "Fix and standardise the proposal PowerPoint export" (NB-03) | transcript only | VERIFIED (act) |
| 22-Oct-2026 15:36 | The merge go-ahead also accepted the `*` marker wording and shared performance slides that NB-03 asked about in the same message | D82/D83 say "approved"; the two sub-answers are not explicit | INFERRED |
| 23-Oct-2026 20:30 | The export placed in `handover-archive/export_20261023/` (the OneDrive-synced drop folder MOD-01 proposed) | update-log path only | INFERRED (choice) |
| 27-Oct-2026 15:25 (re-issued 28-Oct 05:33) | Freeze all implementation; move to a Moderator (MOD-02) / Guardian (ARC-01) multi-chat model with project-control registers | this handover package (TASK-015) | VERIFIED (words) |

## 2.3 Recommendations that are not decisions

Recommendations in part 1 stay recommendations until the owner answers. Examples that are easy to mistake for
decisions: "port the risk toolchain to Node" (DEC-OPEN-01), "move the clone outside OneDrive" (DEC-OPEN-19),
"require the verify check on main" (DEC-OPEN-17), "one Moderator per project" (DEC-OPEN-25), "clear the
JioBlackRock pre-launch returns" (DEC-OPEN-07). None of them may be implemented on the strength of the
recommendation alone.

## 3. Change log

| Date | Change | By |
|---|---|---|
| 28-Oct-2026 | Log created: DEC-OPEN-01..DEC-OPEN-28 (all BLOCKED on the owner); index of load-bearing D-numbers; conversation-only approved decisions listed for TASK-074. | MOD-01 |

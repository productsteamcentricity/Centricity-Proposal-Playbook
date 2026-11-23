# Decision log

| Field | Value |
|---|---|
| Version | 2 |
| Date | 17-Nov-2026 |
| Author chat | MOD-01 (handover package, TASK-015); MOD-02 (updates of 2-Nov-2026, 3-Nov-2026, 9-Nov-2026 and 17-Nov-2026) |
| Status | Authoritative for decisions waiting for the owner (DEC-OPEN-nn). Approved decisions: `docs/DECISIONS.md` is authoritative; part 2 here is only an index. |
| Supersedes | the version of 28-Oct-2026 (kept in git history) |
| Next review | each time the owner answers a decision |

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
to record the answer. Every entry is BLOCKED on the named decider (answered entries move to section 1.6).

The options, effects and recommendations come from the cited KNOWN_ISSUES and DECISIONS entries and the
28-Oct-2026 fact sheets and, for DEC-OPEN-30 to -33, the 2-Nov-2026 pack analysis
(`docs/update-log/2026-11-02_datapack-feasibility.md`) and, for DEC-OPEN-34, ARC-01's finding D-12 (Gate B review of 2-Nov-2026) and the pre-check of the
TASK-018 contract of 3-Nov-2026; for DEC-OPEN-35, the owner's handover prompt of 17-Nov-2026 and the rules it
meets (D61, D87, D88; `FILE_OWNERSHIP_AND_CHANGE_CONTROL.md` section 7); for DEC-OPEN-36, OPS-01's dry-run
report of 9-Nov-2026 (local-only) and the gates of the two tools it ran. Where a benefit, disadvantage or effect
is MOD-01's or MOD-02's own reasoning
rather than a documented fact, it is marked (INFERRED).

## 1.2 Order to ask, and deadlines

The Oct-2026 MF cycle is expected about 13-17-Nov-2026 (INFERRED from the 13th-17th cadence: data applied
15-Jul, 13-Aug, 17-Sep and 13-Oct). Several different dates follow from that. DEC-OPEN-08 (the renames) was due by
about 13-Nov-2026, because `rename_schemes.js --apply` is step 1 of the run; it was ANSWERED on 9-Nov-2026 (D96).
DEC-OPEN-01, DEC-OPEN-02 and
DEC-OPEN-03 (who makes the NAV and risk-ratio inputs, the risk-free rate, the Sortino definition) are ANSWERED
(2-Nov-2026: D86, D84, D85). D86 means (MOD-02's reading, INFERRED until Gate E) that from October the Portfolio Matrix is fed from the MF Screener's data
pack; that raised four new questions, DEC-OPEN-30 to DEC-OPEN-33. DEC-OPEN-30 and DEC-OPEN-31 gate the build of
the tool that turns the pack into the input of step 10 (`merge_risk_matrix.js`; TASK-022, re-scoped): its mapping
depends on them, so they are needed by about 6-Nov-2026 and about 9-Nov-2026, and the tool must be merged before
the run reaches step 10. DEC-OPEN-32 is needed before the first apply (step 10, about 14-16-Nov-2026) and
DEC-OPEN-33 by about 11-Nov-2026 (acted on at run time). The build is estimated at about 6 working days
(INFERRED, analysis of 2-Nov-2026; it counted 5-6 needed against about 4 available) and needs both DEC-OPEN-30 and
DEC-OPEN-31 answered (update-log T1; the analysis assumed answers by 4-Nov-2026). The two answer dates protect
different things. Answering both DEC-OPEN-30 and DEC-OPEN-31 by about 6-Nov-2026 keeps a merge by 13-Nov-2026
possible (before step 10 of the October cycle, about 13-17-Nov-2026). Answering DEC-OPEN-31 by 9-Nov-2026 at the
latest means a merge about 16-Nov-2026, which is step 10 itself. The estimate leaves no slack, so the fallback is
the LIKELY case if TASK-018 (which must merge before the build starts, and cannot reach its Gate D before the
owner's yes to the operator-run Gate B, given on 9-Nov-2026: D88) slips or the answers come late: the October cycle runs without step 10 (an absent input
is not a stop, D61) and the Portfolio Matrix keeps "30 Sep 2026" until a late second run or the November cycle. As of 9-Nov-2026
DEC-OPEN-30, -31 and -32 are answered (D92, D93, note on D86) and TASK-018 has not merged, so a merge of the bridge
by 13-Nov-2026 is no longer possible: the fallback applies to the October cycle (INFERRED); the build starts when
TASK-018 has merged.
**Correction and update, 17-Nov-2026 (MOD-02).** The statement above that GOV-01's PR (TASK-018) "has not
merged" was true only when it was written on 9-Nov-2026 (the order list below is corrected): the PR merged on
9-Nov-2026 at 12:16 UTC (PR #35, merge ddd0304), and PR #36 then recorded D89 to D96 (merge b47069b, 17-Nov-2026
06:37 UTC). The October MF cycle has not started: the Regular and SIF monitors as on 31-Oct-2026 have not
arrived, and OPS-01's Run A (the Reckoner steps 14 and 15) stopped at its gates on 9-Nov-2026 and waits for
DEC-OPEN-36. DEC-OPEN-33's date (about 11-Nov-2026) has passed without an answer. The owner's handover prompt of
17-Nov-2026 raised DEC-OPEN-35, which decides how every later publish is approved.

Suggested order for the owner's decision session (re-ordered on 17-Nov-2026):

1. DEC-OPEN-35 (the approval gate before publishing) was ANSWERED on 17-Nov-2026 (D97: keep the recorded rules). It decided how every later change that alters `site/` is
   approved, so it comes first.
2. DEC-OPEN-36 (the October Reckoner run: the Select list and AIF gates), one question at a time in the order a,
   c, d, b; together with DEC-OPEN-11 (the four desk labels), which the same run needs before its steps 14 and
   14a, and with the owner's re-exports of the Regular and SIF monitors as on 31-Oct-2026 (not a DEC-OPEN; asked
   on 9-Nov-2026 and not answered).
3. DEC-OPEN-30 (the Sortino form) and DEC-OPEN-31 (the other changes of the pack) were ANSWERED on 9-Nov-2026
   (D92, D93); they gated the build. DEC-OPEN-34 (who accepts a finished change) was ANSWERED on 9-Nov-2026
   (D87); the owner's yes to the operator-run Gate B was given the same day (D88); GOV-01's PR (TASK-018) merged
   on 9-Nov-2026 (PR #35). DEC-OPEN-01, -02 and -03 are ANSWERED (2-Nov-2026: D86, D84, D85).
4. DEC-OPEN-32 was ANSWERED on 9-Nov-2026 (a note on D86). DEC-OPEN-33 (by about 11-Nov-2026, acted on at run
   time; the date has passed unanswered: ask it only when the pack bridge nears step 10).
5. DEC-OPEN-08 (the 8 scheme renames) was ANSWERED on 9-Nov-2026 (D96).
6. DEC-OPEN-04 (see its note; before TASK-020), then DEC-OPEN-05. DEC-OPEN-07 (the JioBlackRock records) was
   ANSWERED on 9-Nov-2026 (D94). (DEC-OPEN-11 moved up to item 2.)
7. DEC-OPEN-13, DEC-OPEN-14 and DEC-OPEN-24 together (the old site).
8. DEC-OPEN-25, then DEC-OPEN-26 (time-sensitive: the outgoing owner's offer may lapse); DEC-OPEN-29.
9. The rest as time allows.

## 1.3 Summary

Entries DEC-OPEN-01 to DEC-OPEN-36 exist: 13 are answered (DEC-OPEN-01, -02, -03, -04, -07, -08, -11, -30, -31, -32, -34, -35 and -36; section 1.6) and 23
are open. Next free: DEC-OPEN-37.

| ID | Decision (short) | Decider | Unblocks | Deadline | Recommendation documented? |
|---|---|---|---|---|---|
| DEC-OPEN-01 | Who makes the NAV and risk-ratio workbooks | owner | TASK-022 (re-scoped); TASK-057 and TASK-053 are MOD-02 proposals only (update-log T8) | ANSWERED 2-Nov-2026 (D86) | n/a (answered) |
| DEC-OPEN-02 | Risk-free rate | owner + desk | TASK-022 | ANSWERED 2-Nov-2026 (D84) | n/a (answered) |
| DEC-OPEN-03 | Sortino definition | owner + desk | TASK-022 | ANSWERED 2-Nov-2026 (D85) | n/a (answered) |
| DEC-OPEN-04 | PMS date label (B1) | owner | TASK-025 | ANSWERED 18-Nov-2026 (D105) | n/a (answered) |
| DEC-OPEN-05 | Two client items in the export | owner + compliance | TASK-032 | - | no |
| DEC-OPEN-06 | File the true 30-Apr Monitor | owner | TASK-035 | - | no |
| DEC-OPEN-07 | 13 JioBlackRock Regular records; very young funds | owner | TASK-023, TASK-067 | ANSWERED 9-Nov-2026 (D94) | n/a (answered) |
| DEC-OPEN-08 | The 8 scheme renames | owner | TASK-024 | ANSWERED 9-Nov-2026 (D96) | n/a (answered) |
| DEC-OPEN-09 | Bond 3Y/5Y: band top or band average | owner | TASK-027 | - | documented next step only |
| DEC-OPEN-10 | Segregated side-pocket records | owner | TASK-028 | - | yes (drop and tighten) |
| DEC-OPEN-11 | Deck labels and AMCs (C4, C5, C6, C38) | owner + desk | TASK-029 | ANSWERED 18-Nov-2026 (D101) | n/a (answered) |
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
| DEC-OPEN-29 | Public-repository hygiene: old-repository locators, staff identities | owner (+ compliance) | TASK-075 | after DEC-OPEN-13 | yes (a) |
| DEC-OPEN-30 | Which Sortino formula the Portfolio Matrix uses from October | owner (+ desk, DESK-16) | TASK-022 | ANSWERED 9-Nov-2026 (D92) | n/a (answered) |
| DEC-OPEN-31 | Accepting the other changes the pack brings to the Portfolio Matrix | owner | TASK-022 | ANSWERED 9-Nov-2026 (D93) | n/a (answered) |
| DEC-OPEN-32 | May the Screener's computed ratios appear on the public page and in client decks, and the pack's contract be described in this public repository | owner (+ the Screener's owner, compliance) | first apply (TASK-021 step 10) | ANSWERED 9-Nov-2026 (note on D86; the repository part is MOD-02's reading, INFERRED) | n/a (answered) |
| DEC-OPEN-33 | Use the PROVISIONAL October pack if the final one is late | owner (at run time, in chat) | October step 10 (TASK-021) | ~11-Nov-2026 | yes (use it, with an explicit yes) |
| DEC-OPEN-34 | Who accepts a finished change (Gate E) | owner | TASK-018 Gate D | ANSWERED 9-Nov-2026 (D87) | n/a (answered) |
| DEC-OPEN-35 | Approval gate before publishing: the owner approves before every merge that changes `site/`, or only in the listed cases | owner | every publish of the October update; the publish rule in `CLAUDE.md`, the skill and the release rules | ANSWERED 17-Nov-2026 (D97) | n/a (answered) |
| DEC-OPEN-36 | October Reckoner run: pin the two AIF series names, accept the drops, add the new names, confirm the removals | owner (+ desk for the fund facts) | TASK-020 steps 14, 14a and 15 (OPS-01's Run A) | ANSWERED 18-Nov-2026 (D98, D101, D102) | n/a (answered) |

## 1.4 The open decisions

### DEC-OPEN-01 Who makes the two monthly risk workbooks from October 2026 - ANSWERED 2-Nov-2026: moved to section 1.6 (D86)

### DEC-OPEN-02 Which risk-free rate the risk ratios use - ANSWERED 2-Nov-2026: moved to section 1.6 (D84)

### DEC-OPEN-03 Which Sortino definition to use - ANSWERED 2-Nov-2026: moved to section 1.6 (D85)

### DEC-OPEN-04 The PMS date label (31-Jul data shown as "31st August 2026") - ANSWERED 18-Nov-2026: moved to section 1.6 (D105)

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

### DEC-OPEN-07 The 13 JioBlackRock Regular records, and very young funds - ANSWERED 9-Nov-2026: moved to section 1.6 (D94)

### DEC-OPEN-08 Confirm or reject the 8 scheme renames - ANSWERED 9-Nov-2026: moved to section 1.6 (D96)

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
  side-pocket records (2 Franklin, 2 UTI) are in the fund list. They have almost no money and no returns; the
  two UTI ones also have no expected-return band (the two Franklin ones carry bands), yet a user can pick them
  into a client proposal. The two UTI ones slip through because the parser skips only names containing
  "segregated portfolio".
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

### DEC-OPEN-11 Deck labels and fund houses that need the desk (C4, C5, C6, C38) - ANSWERED 18-Nov-2026: moved to section 1.6 (D101)

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
  name-redacted history (which still holds de-identified figures, R1) back to it.
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
- **Related 2-Nov-2026.** Our own public documents carry the exact locators of the old repository and the
  client-data file (SEC-01); see DEC-OPEN-29.

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
  fund's current band, and one AIF 1-year figure (Alchemy Long Term Ventures Fund, 18.3%) is stale.
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

Decider: owner. Raised: `docs/PROJECT_STATE.md` next steps. Related: R1, R2 (Accepted), D60, D64.

- **The problem.** On 16-Oct the owner chose a public repository with free GitHub Pages (D60). The fund list,
  rationales and IRR bands are readable by anyone. No client names, client files or workbooks are in the repo
  (checked 2-Nov-2026). The pushed history still holds de-identified figures from the sample portfolio in the
  Portfolio Review build spec (family and per-client CMV totals, one holding's value and weights, the largest
  AMC's share; KNOWN_ISSUES R1). They stay publicly readable while this repository is public.
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

- **The problem.** Old, finished work is lying around: 26 merged branches on GitHub (origin), 28 merged local
  branches besides `main`, 4 extra worktrees (clean when last checked) and one stash from 19-Oct. The release
  docs say to merge with `--delete-branch`, but no merge since PR #3 did, and the repository setting
  `delete_branch_on_merge` is off. Update 2-Nov-2026: one of the 4 worktrees is new (its HEAD was written on
  2-Nov-2026 at 13:13 IST, 20 seconds before the MOD-02 session was created; it is clean, has no commits of its
  own and nothing uses it; the desktop app probably created it, INFERRED). The three NB sessions are now
  archived, and their two worktrees show a detached HEAD (INFERRED: the app released them); both are clean and
  their branches still exist.
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
- **Why a decision is needed.** To confirm REQ-054 (already VERIFIED COMPLETE with this dashboard's link) or, if
  the owner meant the sister project, to note that its link is out of scope.
- **Options.** (a) This dashboard: https://productsteamcentricity.github.io/Centricity-Proposal-Playbook/ (already
  given). (b) The Portfolio Review Dashboard: out of this project's scope; its own chats hold its link.
- **What each changes.** Nothing in this repository.
- **Benefits and disadvantages, impact, maintenance.** Not applicable.
- **Risks and reversibility.** None.
- **Documented recommendation (not a decision).** Not applicable (a question to the owner).
- **Record the answer as.** Update REQ-054's evidence; no `Dnn`.

### DEC-OPEN-29 What our public documents may say about the old repository, and which staff details stay public

Decider: owner (+ compliance for the client-data part). Raised: 2-Nov-2026 by MOD-02 from the security review of
PR #29 (SEC-01 to SEC-05). Unblocks: TASK-075. Related: R1, R12, DEC-OPEN-13, DEC-OPEN-18; D60, D64.

- **The problem.** Our repository is public. Its documents give the exact address of the outgoing owner's old
  repository and old site, the name of the file that holds client names and values, and the commit that holds
  it, and that file is still publicly readable there (R1). Anyone reading our documents therefore gets a
  ready-made map to it: the old address is on 23 lines in 13 files (14 of those lines were added by PR #29), the
  file name on 21 lines in 10 files and the old commit id on 46 lines in 21 files (SEC-01). Separately, the
  public history shows several e-mail addresses, one of them a staff member's full name with a company address
  (SEC-02); two tracked files carry one person's full name and a name-based company address, three lines in all
  (SEC-03); and `.gitignore` has no guard for some archive and key file types (SEC-04). The registers also
  carry session identifiers, local tool paths and exact detail of open weaknesses (SEC-05). Nothing secret or
  client-identifying was added by PR #29.
- **Why a decision is needed.** Most of the fix is an ordinary documents change, but it changes what the project
  says in public, so it is the owner's call (and compliance's for the client-data part). The history cannot be
  changed without rewriting published history, a force-push, which only the owner may order (CLAUDE.md "Never").
- **Options.** (a) Keep status words in public documents; move the exact addresses, the file name and the
  commit id into a local-only note; replace the names and the address in the three tracked lines with role
  words; add `.gitignore` guard rails for `*.tar *.gz *.tgz *.bz2 *.xz *.docm *.pem *.key *.p12 *.pfx *.sqlite *.db *.env id_rsa* credentials*.json .npmrc`;
  leave the history alone. (b) Do (a) and also rewrite the public history: large and risky, advised against,
  and it needs the owner's explicit instruction. (c) Leave everything as it is: the information is already
  public.
- **What each changes.** (a) About 13 documents and `.gitignore`. It does not fix R1: only the outgoing owner's
  purge (DEC-OPEN-13) does. (b) As (a), and every commit id changes. (c) Nothing.
- **Benefits and disadvantages.** (a) Our documents stop pointing readers at the old repository and the file, and
  the staff details in the three lines go; quick, cheap and reversible, but it removes nothing that is already
  public, and the exact locators are no longer in the registers (INFERRED). (b) The staff addresses and the
  locators would also leave our history, but it is large and risky, every commit id and clone changes, and it
  does nothing about the old repository (INFERRED). (c) No work, but the map stays and grows each time a
  document repeats the address (INFERRED).
- **Impact on existing functionality.** None on the dashboard.
- **Maintenance.** Keep the local-only note with the other local-only items (TASK-070). New documents refer to
  the old repository by role words, not by address (INFERRED).
- **Risks and reversibility.** (a) is reversible in git. (b) is not.
- **Documented recommendation (not a decision).** MOD-02, 2-Nov-2026: option (a), and press the R1 purge
  (DEC-OPEN-13), because it is the real fix.
- **Record the answer as.** A new `Dnn`; update R1 and R12; set TASK-075 to PLANNED.

### DEC-OPEN-30 Which Sortino formula the Portfolio Matrix uses from October - ANSWERED 9-Nov-2026: moved to section 1.6 (D92)

### DEC-OPEN-31 Accepting the other changes the pack brings to the Portfolio Matrix - ANSWERED 9-Nov-2026: moved to section 1.6 (D93)

### DEC-OPEN-32 May the Screener's computed ratios appear in the public Playbook page and in client decks, and the pack's contract be described in this public repository? - ANSWERED 9-Nov-2026: moved to section 1.6 (note on D86; the repository part is MOD-02's reading of the click, INFERRED)

### DEC-OPEN-33 Use the PROVISIONAL October pack if the final one is late?

Decider: owner (at run time, in chat). Raised: 2-Nov-2026 by MOD-02 from the same analysis. Deadline: about
11-Nov-2026 (when the final pack is wanted). Unblocks: October step 10, if the final pack is late. Related: D86,
TASK-021, TASK-022.

- **The problem.** The 15-Oct-2026 pack is marked PROVISIONAL because one of its automatic checks failed: the rule
  that 95% of the domestic stocks the funds hold must have at least three years of monthly prices. That check
  concerns a file the risk table does not read (stock prices). The final pack is not available yet.
- **Why a decision is needed.** If the final pack is late on the day the October run reaches step 10, someone must
  say whether the run waits or goes ahead on the provisional one. A provisional pack may be replaced by a final one
  with different contents.
- **Options.** (a) Use the provisional pack for the October step 10, with the owner's explicit yes in chat, recorded
  in the update log, and check again when the final pack arrives (re-run the step if the final pack's fund file
  differs). (b) Skip step 10 and keep "30 Sep 2026".
- **What each changes.** (a) The Portfolio Matrix is refreshed in the October cycle, and a second run follows if the
  final pack differs. (b) The matrix keeps "30 Sep 2026" until a late second run or the November cycle.
- **Benefits and disadvantages.** (a) On time, but it relies on a pack still marked provisional, although its own
  report limits the failure to the stock-price file (the validator's own work was not checked). (b) Safe, but the
  matrix is a month older (INFERRED).
- **Impact on existing functionality.** The Portfolio Matrix only.
- **Maintenance.** The update log names the pack, its cycle date, its generation time and a short hash of its fund
  file, so that a later final pack can be compared.
- **Risks and reversibility.** A second run replaces the table; decks sent in between carry the provisional numbers.
- **Documented recommendation (not a decision).** MOD-02, 2-Nov-2026 (from the analysis): use the provisional pack,
  with an explicit yes in chat.
- **Record the answer as.** The owner's yes (or no), quoted in the update log of the October run; no `Dnn` unless
  the owner sets a standing rule for provisional packs.

### DEC-OPEN-34 Who accepts a finished change (Gate E)? - ANSWERED 9-Nov-2026: moved to section 1.6 (D87)

### DEC-OPEN-35 Approval gate before publishing: does the owner approve before every merge that changes `site/`, or only in the listed cases? - ANSWERED 17-Nov-2026: moved to section 1.6 (D97)

### DEC-OPEN-36 October Reckoner run: the Centricity Select list and the AIF performance stop at their gates (four questions) - ANSWERED 18-Nov-2026: moved to section 1.6 (D98, D101, D102)

## 1.5 How to record the owner's answer (every decision)

1. **Write it down the same day.** Add to the decision's entry: `Answer: <owner's words> (dd-Mmm-yyyy hh:mm UTC,
   chat ID)` and set its status from BLOCKED to ANSWERED (and name the Dnn). Do not delete the entry: move it to
   section 1.6.
2. **Add a new `Dnn` to [`../DECISIONS.md`](../DECISIONS.md)** with the next free number (the highest in the index plus one):
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

Decided so far: DEC-OPEN-01 (D86), DEC-OPEN-02 (D84), DEC-OPEN-03 (D85), DEC-OPEN-07 (D94), DEC-OPEN-08 (D96), DEC-OPEN-30 (D92), DEC-OPEN-31 (D93), DEC-OPEN-32 (note on D86), DEC-OPEN-34 (D87), DEC-OPEN-35 (D97), DEC-OPEN-11 (D101), DEC-OPEN-36 (D98, D101, D102), DEC-OPEN-04 (D105).

### DEC-OPEN-01 Who makes the two monthly risk workbooks from October 2026

Decider: owner. First asked: 27-Oct-2026 12:28 UTC by MOD-01 ("Should I rebuild the risk-ratio and NAV
workbook tools in-house?", buttons "Yes, rebuild them" / "Desk will provide"); unanswered. Asked again by
MOD-02 on 2-Nov-2026 with the buttons "Yes, rebuild them" / "Desk will provide"; answered later that day
(below). Deadline: as soon as possible (see section 1.2). Unblocks: TASK-022 (re-scoped); TASK-057 and
TASK-053 are MOD-02 proposals only (update-log T8). Related: KNOWN_ISSUES B8, A22, C10; D43.

Answer: "DEC-OPEN-01: who makes the NAV Data and Fund Risk Ratios workbooks from October? - Get it from [address of
the MF dashboard]. The owner will share excel files every month like the attached" (typed in the MOD-02 chat,
2-Nov-2026, shortly after the two attached packs were saved at 14:19 UTC; the address of the sign-in-only page
is replaced here by a placeholder and must not appear in any repository document) -> D86. Attachments:
`pr-datapack_2026-10-15_PROVISIONAL.zip` and `pr-datapack-backfill_2026-10-15.zip`, JSON and CSV packs (export
contract `pr-datapack-v1`, exporter 1.0.0), not Excel workbooks. Status: ANSWERED.

MOD-02's reading (INFERRED, not stated by the owner): the two legacy inputs (inbox rows 12 "Fund Risk Ratios & 3Y
Rolling" and 17 "NAV Data", KNOWN_ISSUES B8) are not rebuilt in-house; from the October 2026 cycle the Portfolio
Matrix (the `RISK_MATRIX` block) is fed from the Screener's monthly data pack, which the owner shares. The page
behind the address is the Centricity Mutual Fund Screener (sign-in only, access limited to invited users); MOD-02
did not and must not sign in. None of options (a) to (c) below was chosen. The answer raised four follow-up
questions, DEC-OPEN-30 to DEC-OPEN-33 (sections 1.4 and 1.6). (The options, the update, the recommendation and the "Record
the answer as" line below are the text as asked, before the answer: D86 leaves D43 in force, with a note added
there, and TASK-022 is re-scoped in `TASK_REGISTER.md`.)

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
- **Update 2-Nov-2026.** With D84 (Rf 4.5%) and D85 (textbook Sortino) decided (Rf: for now), option (a) can be
  proven by reproducing the live September workbook and RISK_MATRIX exactly; option (b) now also needs the
  Python tool changed (it implements June's Sortino and a different 3-year start). The build must be merged
  before step 10 of the October cycle or the October risk table keeps "30 Sep 2026".
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
  Sep-2026 regression test; decide DEC-OPEN-02 and DEC-OPEN-03 first (both decided 2-Nov-2026: D84, D85), and
  keep today's risk-free rate and Sortino definition until they are decided (KNOWN_ISSUES B8;
  `docs/PROJECT_STATE.md` next steps; MOD-01, 27-Oct-2026). No separate rationale is written down; the option's
  own guard is the regression test that must reproduce the live workbook (B8).
- **Record the answer as.** A new `Dnn` that amends D43; update B8; set TASK-022 (and TASK-057, TASK-053) from
  BLOCKED to PLANNED. Originating chat: MOD-01 (retired); MOD-02 relays the answer to the chat it assigns to
  TASK-022.

### DEC-OPEN-02 Which risk-free rate the risk ratios use

Decider: owner + desk (DESK-15). Asked by MOD-01: 19-Oct-2026 (as a desk question) and 27-Oct-2026.
Deadline: before the October workbooks are produced, and well before ~13-Nov-2026. The TASK-022 build may start
earlier with today's 4.5% kept as a parameter (`docs/handover/NEW_BUILD_HANDOVER_2026-10-28_v1.md` section
5.2). Unblocks: TASK-022. Related: C11; D58 (Open).

Answer: 'Keep 4.5% for now' (a button offered by MOD-02; 2-Nov-2026 08:02 UTC, MOD-02 chat) -> D84; D58 stays
Open for the desk confirmation (DESK-15). Status: ANSWERED. (The "Record the answer as" line below is the plan
made before the answer; D58 was not closed.)

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
- **Note 2-Nov-2026.** The text above was written before DEC-OPEN-01 was answered; read 'builder' as the planned
  bridge tool (D86).

### DEC-OPEN-03 Which Sortino definition to use

Decider: owner + desk (DESK-16). Asked: 27-Oct-2026 by MOD-01. Deadline: before the October workbooks are
produced, and well before ~13-Nov-2026. The TASK-022 build may start earlier with today's textbook Sortino
formula kept as a parameter (`docs/handover/NEW_BUILD_HANDOVER_2026-10-28_v1.md` section 5.2). Unblocks:
TASK-022. Related: C35, A22.

Answer: 'Keep textbook' (a button offered by MOD-02; 2-Nov-2026 08:52 UTC, MOD-02 chat) -> D85. Status: ANSWERED.

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
- **Note 2-Nov-2026.** The text above was written before DEC-OPEN-01 was answered; read 'builder' as the planned
  bridge tool (D86).

### DEC-OPEN-34 Who accepts a finished change (Gate E)?

Decider: owner. Raised: 3-Nov-2026 by MOD-02: ARC-01's finding D-12 of the 2-Nov-2026 Gate B review came up again in the
pre-check of the TASK-018 contract (MOD-02's decision 6 on GOV-01's nine questions). Deadline: before GOV-01's PR reaches Gate D (about the end of the week of 3-Nov-2026; no
date fixed). Unblocks: TASK-018 Gate D (together with the owner's yes to the operator-run Gate B, given 9-Nov-2026: D88). Related: `FILE_OWNERSHIP_AND_CHANGE_CONTROL.md` sections 7, 8 and 10,
`docs/handover/MODERATOR_BOOTSTRAP_PROMPT.md` 7.4, D61.
Answer: 'Client-facing only' (a button offered by MOD-02, in answer to "Should you accept only client-facing
changes, with me recording the rest?"; 9-Nov-2026 06:48 UTC, MOD-02 chat) = option (a) -> D87. Status: ANSWERED.

- **The problem.** Every change goes through five gates, A to E. The last one, E, is acceptance: someone confirms
  that the finished change is what was wanted. Two of our rule documents give different answers about who does
  that. `FILE_OWNERSHIP_AND_CHANGE_CONTROL.md` says the owner accepts changes that clients see and anything the
  owner asked to review, and the Moderator records acceptance of the rest on evidence. The Moderator's bootstrap
  prompt says the owner accepts every result. Both agree that a monthly refresh publishes first (D61) and is
  accepted afterwards. One rule has to stand. In practice the register and decision records of 28-Oct to
  2-Nov-2026 (PRs #29 to #32; PR #29 also carried an agent definition) were merged on evidence (INFERRED for #29 and #31), as CLAUDE.md allows when the owner has not asked to review first.
- **Why a decision is needed.** Acceptance is an approval rule, so it is the owner's to choose
  (`FILE_OWNERSHIP_AND_CHANGE_CONTROL.md` section 10). GOV-01's PR (TASK-018) makes the rule documents agree and
  has to say one thing here; it cannot reach Gate D (the merge) until the owner has chosen. Its text uses option
  (a) until then.
- **Options.** (a) The narrower scope: the owner accepts every client-facing change (what a client or adviser
  sees: data refresh results, page, deck and Excel changes) and anything the owner asked to review; the Moderator
  records acceptance of the rest (registers, tests, internal documents) on evidence and lists them in a report
  from the Moderator to the owner (no such report is defined today; its cadence is set with the answer). (b) The owner accepts every finished change (the form in the Moderator's
  bootstrap prompt, whose table puts Gate E after the merge): every merged change, pure records included, stays
  'not accepted' until the owner says yes. The pre-merge approvals of `FILE_OWNERSHIP_AND_CHANGE_CONTROL.md`
  section 7 stay as they are under both options.
- **What each changes.** Either way the two rule documents are made to say the same. (a) The owner sees internal
  changes only in that report. (b) The owner is asked for a yes on every merged change, pure
  records included. If the owner picks (b), it is a small text change in GOV-01's PR before the merge.
- **Benefits and disadvantages.** (a) Faster: the owner's time goes to what clients see; internal changes are
  accepted without the owner reading each one (INFERRED). (b) The owner sees everything, but the acceptance work
  lands on the owner for every change, pure records included; merges are not held (INFERRED).
- **Impact on existing functionality.** None on the dashboard, its data or the monthly run: only the wording of two
  rule documents and the way a finished change is closed.
- **Maintenance.** (a) The Moderator's report to the owner lists the changes the Moderator accepted on
  evidence. (b) The Moderator keeps a list of merged changes not yet accepted (INFERRED).
- **Risks and reversibility.** Reversible: it is wording in rule documents, changed again by a docs PR with the
  owner's approval. (a) Internal changes are accepted on the Moderator's evidence, not on the owner's reading
  (INFERRED). (b) The risk is a growing list of merged changes not yet accepted (INFERRED).
- **Documented recommendation (not a decision).** MOD-02, 3-Nov-2026 (from the Guardian pre-check): option (a).
- **Record the answer as.** A new `Dnn` (`FILE_OWNERSHIP_AND_CHANGE_CONTROL.md` section 10: a change to approvals
  is recorded as a decision); the matching wording goes into `FILE_OWNERSHIP_AND_CHANGE_CONTROL.md` section 8 and
  `docs/handover/MODERATOR_BOOTSTRAP_PROMPT.md` 7.4 in GOV-01's PR before it is merged; as far as this decision is concerned, TASK-018 Gate D can then go
  ahead (it also needed the owner's yes to the operator-run Gate B, given 9-Nov-2026: D88; the Blockers cell of
  `ACTIVE_CHANGE_REGISTER.md` section 1 is updated in the register sweep).
- **Note 9-Nov-2026.** The owner's answer did not set how often the Moderator reports; MOD-02 sets it in the Gate E
  text: its next report to the owner after each merge (INFERRED: MOD-02's choice, not the owner's). GOV-01's PR
  (TASK-018) is to write the final Gate E text (`FILE_OWNERSHIP_AND_CHANGE_CONTROL.md` section 8 and the bootstrap
  prompt 7.4) and to cite D87. The owner's yes to the operator-run Gate B in every monthly refresh is a separate
  approval, given on 9-Nov-2026 (07:34 UTC, MOD-02 chat) and recorded as D88; GOV-01's PR is to cite it.


### DEC-OPEN-30 Which Sortino formula the Portfolio Matrix uses from October

Decider: owner (+ desk, DESK-16). Raised: 2-Nov-2026 by MOD-02 from the analysis of the MF Screener data pack
(`docs/update-log/2026-11-02_datapack-feasibility.md`). Deadline: about 6-Nov-2026 (the mapping of the bridge tool
depends on it; with DEC-OPEN-31 also answered by then, a merge by 13-Nov-2026 stays possible, before step 10 of the
October cycle; if the answers or TASK-018 come late, the fallback in section 1.2 is the likely case). Unblocks:
TASK-022. Related: C35, D85, D86.

Answer: 'Dashboard's, with note' (a button offered by MOD-02, in answer to "Which Sortino formula should the
October risk table use?"; 9-Nov-2026 08:43 UTC, MOD-02 chat) = option (a) -> D92. Status: ANSWERED.

- **The problem.** The Sortino ratio shows how much return a fund gave for each unit of "bad" bumpiness: only the
  days it earned less than the risk-free rate count. Earlier on 2-Nov-2026 (08:52 UTC) the owner chose the textbook
  formula (D85). The MF Screener's data pack does not use it: it divides the average excess return by the spread of
  the bad days only, which is the form the June 2026 table used, and the textbook form cannot be rebuilt from the
  pack, which does not carry the daily figures it needs. On 205 funds whose daily series provably equals the pack's,
  the pack's form reproduces the pack's published Sortino to within 0.014 for all 205, while the textbook form gets
  within 0.02 for only 119 of them (tested on the 15-Aug and 15-Sep-2026 packs; the 15-Oct daily series was not
  available; the 15-Oct definitions file states the same formula). The two forms differ by about 0.03-0.05 on
  average and 0.2-0.3 at most.
- **Why a decision is needed.** D85 (textbook) was taken before the owner pointed to the MF dashboard as the source (D86; that this means the pack is MOD-02's reading, INFERRED), and the
  two now conflict on this one column: with the pack as the source, the textbook figure cannot be produced. Only the
  owner can say what the page shows instead.
- **Options.** (a) Accept the MF dashboard's Sortino for October, with a one-line note under the table, and ask the
  dashboard team for a textbook field in a later pack. (b) Leave the Sortino column as dashes until a textbook
  figure exists. (c) Hold the whole October matrix at 30-Sep-2026.
- **What each changes.** (a) The history reads textbook in August and September, June's form in June and from
  October, and a new decision supersedes D85 for the matrix. (b) The page has no Sortino for a month or more.
  (c) The matrix ages: every column keeps "30 Sep 2026".
- **Benefits and disadvantages.** (a) The whole October table is refreshed, with the dashboard's own number; the
  column changes meaning again, so October is not comparable with August and September (the note says so). (b) No
  mixed forms, but a blank column on screen and in client decks (INFERRED). (c) No definition changes anywhere, but
  every column of the matrix gets a month older (INFERRED).
- **Impact on existing functionality.** (a) and (b): the Sortino column of the Portfolio Matrix on screen and in the
  deck, from the October publish. (c): nothing changes.
- **Maintenance.** (a) The one-line note stays until the dashboard team adds a textbook field; then a one-line
  change and a decision record. (b) The same, with dashes instead of the note.
- **Risks and reversibility.** Reversible: rebuild and publish again. Decks already sent to clients are not
  recalled.
- **Documented recommendation (not a decision).** MOD-02, 2-Nov-2026 (from the analysis): option (a), confirmed in
  writing as a new decision that supersedes D85 for the matrix.
- **Record the answer as.** A new `Dnn` (for option (a): it supersedes D85 for the Portfolio Matrix, and D85's
  status in the index changes then); update C35 and C46; put the choice in TASK-022's acceptance.
- **Note 9-Nov-2026.** The other button was 'Leave it blank' (option (b)); option (c), hold the whole matrix, was
  described in the chat text but was not a button. DEC-OPEN-33 stays open and the fallback of
  section 1.2 still applies to the October cycle.


### DEC-OPEN-31 Accepting the other changes the pack brings to the Portfolio Matrix

Decider: owner. Raised: 2-Nov-2026 by MOD-02 from the same analysis. Deadline: about 9-Nov-2026 at the latest (a merge
then lands about 16-Nov-2026, which is step 10 itself; a merge by 13-Nov-2026 needs it by about 6-Nov-2026; if the
answers or TASK-018 come late, the fallback in section 1.2 is the likely case). Unblocks: TASK-022 (the mapping of the
bridge tool, and one small wording change on the page). Related: C46, D86, D84.

Answer: 'Accept all four' (a button offered by MOD-02, in answer to "Accept all four changes the dashboard's data
brings to the risk table?"; 9-Nov-2026 08:54 UTC, MOD-02 chat) = accept all -> D93. Status: ANSWERED.

- **The problem.** The pack does not calculate the numbers in the same way as the table the page shows today
  (as on 30-Sep-2026). Besides the Sortino form (DEC-OPEN-30), four things change. They are one package: the owner
  may accept it whole, or part by part.
  - (a) Date. The table would be stamped with the pack's date, 15-Oct-2026 (the page label would read "15 Oct
    2026"), not a month-end as the page's other risk data are. Recommended: accept, and ask the MF dashboard team
    whether a month-end pack exists.
  - (b) Coverage. Only funds with a full three-year record get ratios. About 370 of today's 966 funds lose their
    benchmark-based ratios (Beta, Correlation, Information Ratio, Down Capture, Alpha) and show dashes: 311 are too
    young, 39 have a stale benchmark (the index data ends before the cycle date; the count changes between packs), 9
    have no benchmark, 4 (reason to be confirmed: PROXY benchmark or no source) and 10 have a name that does not
    match the dashboard's. Standard deviation, Sharpe and Sortino go from 966 to 636 funds, and the 3-year rolling
    return from 433 to 451. The merge tool's check "funds with metrics did not shrink" would stop the merge, so it
    has to be waived once, with an owner-only override of the coverage gate still to be added to the tool (the flag
    name is to be fixed in the TASK-022 contract; `--allow-coverage-drop` already exists for the Direct Equity tool with
    another meaning) and only with the owner's approval after reading the list of the funds that lose their
    ratios. Recommended: accept, and waive the check once after reading the list.
  - (c) Benchmark and alpha. Until now each fund was compared with one of four broad indices; the pack compares it
    with its own benchmark. The benchmark label changes for about 554 funds, and Beta, Correlation, Information
    Ratio, Down Capture and Alpha change meaning for about 264 of the 593 funds that keep them. The dashboard's own
    alpha is simple excess return, not Jensen's alpha, which is what the page's wording says ("Alpha (Jensen)").
    The tool would derive Jensen alpha at Rf 4.5% from the pack's 3-year returns and beta, so that the wording
    stays true; this works for funds on a total-return benchmark only (7 funds on a price index get a dash).
    Recommended: accept both.
  - (d) Daggers and wording. 33 funds carry a warning dagger today: 28 for a NAV split (on the 28 funds flagged for
    NAV splits, the table's standard deviation is about 3.5 times the MF dashboard's (median ratio), because the
    MF dashboard adjusts NAV for splits itself) and 5 for low correlation with the index they were compared with.
    With the pack all 33 lose the dagger. The hint text on the tab changes from "funds with < 250 trading days"
    to "funds without a full three-year record". Recommended: accept both.
- **Why a decision is needed.** These change what clients see in the Portfolio Matrix, on screen and in the deck: a
  different date, dashes where there are numbers today, a different yardstick for each fund, and no warning
  daggers. Only the owner can accept that.
- **Options.** Accept all four (recommended); accept with changes (say which); or hold the whole matrix at
  30-Sep-2026.
- **What each changes.** Accept all: from the October publish the table has the pack's date, fewer funds with
  ratios, each fund against its own benchmark, derived Jensen alpha, no daggers and the new hint text; October is
  then not comparable with September in Sortino (DEC-OPEN-30), the five benchmark-based columns and coverage.
  Accept with changes: the mapping of the bridge tool follows the owner's list. Hold: the matrix keeps "30 Sep 2026"
  and ages.
- **Benefits and disadvantages.** Accept all: the matrix is refreshed without an in-house toolchain to maintain,
  and each fund is compared with a benchmark that fits it better (INFERRED); clients see fewer funds with ratios
  and a break in the series. Hold: no break, but the matrix ages.
- **Impact on existing functionality.** The Portfolio Matrix tab and the deck's matrix (client-facing), and one hint
  line in `site/index.html`.
- **Maintenance.** Each month the tool prints the funds that gain or lose ratios, and the update log records the
  counts.
- **Risks and reversibility.** Reversible: the next publish replaces the table. Decks already sent to clients are
  not recalled.
- **Documented recommendation (not a decision).** MOD-02, 2-Nov-2026 (from the analysis): accept all four, and
  waive the coverage check once after the owner has read the list.
- **Record the answer as.** A new `Dnn` (extends D86) that says which of (a) to (d) are accepted; update C46; put
  the mapping in TASK-022's acceptance. The hint-text change is one small `site/index.html` change, merged before
  the October cycle if the owner agrees.
- **Note 9-Nov-2026.** The other button was 'Hold the table'; accepting with changes was possible by typing. The
  click accepts (a) to (d) as described in the chat. The one-time waiver of the coverage check (b) still needs the
  owner's approval after reading the list of the funds that lose their ratios, and the hint-text change ships with the
  first pack-fed table (D93). DEC-OPEN-33 stays open.


### DEC-OPEN-32 May the Screener's computed ratios appear in the public Playbook page and in client decks, and the pack's contract be described in this public repository?

Decider: owner (with the Screener's owner and compliance). Raised: 2-Nov-2026 by MOD-02 from the same analysis.
Deadline: before the first apply (step 10 of the October cycle, about 14-16-Nov-2026). Unblocks: the first apply of
the pack-fed table (TASK-021 step 10). Related: the update-log risk R8
(`docs/update-log/2026-11-02_datapack-feasibility.md`), KNOWN_ISSUES R2 and R12, D60, DEC-OPEN-29, D86.

Answer: 'Yes, they may' (a button offered by MOD-02, in answer to "May the dashboard's ratios appear on the public
page and in client decks?"; 9-Nov-2026 09:02 UTC, MOD-02 chat) = option (a) (INFERRED: MOD-02 reads the click as the written
yes). Status: ANSWERED. The owner's button answer is quoted in a note on D86.

- **The problem.** The Playbook page is public (D60: free GitHub Pages, so anyone with the link can read the numbers
  in it). The pack comes from the MF Screener, which is sign-in only and limited to invited users. From October the
  page's risk block (`RISK_MATRIX`) would carry ratios that the Screener computed, and client decks would show them.
- **Why a decision is needed.** Nobody has said whether the Screener's computed numbers may be shown outside its
  sign-in. That is a question of permission and confidentiality, not of engineering, and what is published on a
  public page stays readable in its history (INFERRED). The same question covers the public records of the pack's
  contract (file names, field names, definitions) that are kept in this repository
  (`docs/update-log/2026-11-02_datapack-feasibility.md`), in the tool's code and in its tests; the details of the Screener team's own methodology are kept in a local-only note.
- **Options.** (a) A written yes (one line is enough). (b) No. (c) Ask the MF dashboard team first.
- **What each changes.** (a) Nothing changes; the first apply goes ahead. (b) The Portfolio Matrix cannot be fed from
  the pack: it keeps "30 Sep 2026", and D86 needs another source for these numbers (INFERRED). (c) The first apply
  waits for their answer; if it is late, the October cycle runs without step 10 and the page keeps "30 Sep 2026".
- **Benefits and disadvantages.** (a) Quick and clear, once someone entitled gives it. (b) Safest, but the risk table
  stops being refreshed (INFERRED). (c) The answer comes from the right people; it costs time before mid-November.
- **Impact on existing functionality.** The Portfolio Matrix refresh only (screen and deck).
- **Maintenance.** The update log and the PR for the October run record only counts, hashes and dates, never
  fund-level pack values or manager names (compare R12 and DEC-OPEN-29).
- **Risks and reversibility.** A publish is hard to take back: the page and its history are public, and decks
  already sent are not recalled.
- **Documented recommendation (not a decision).** MOD-02, 2-Nov-2026 (from the analysis): get a one-line written yes
  before the first apply.
- **Record the answer as.** The owner's line, quoted with its date, in the update log of the October run and in a
  note on D86; a new `Dnn` only if it comes with conditions or is a no (a no reopens the source of the Portfolio
  Matrix).
- **Note 9-Nov-2026.** The other button was 'Ask the team first' (option (c)). MOD-02's text beside the question also
  said that the same permission covers describing the data pack's file layout in the public repository, with only
  counts, dates and short hashes in update logs and never fund-level pack values; the owner's click is read as
  covering that too (INFERRED: the question line named only the ratios). The entry named the Screener's owner and
  compliance as co-deciders; the chat does not record whether they were asked. No `Dnn`: the answer carries no
  conditions of its own (section 1.5); the update log of the October run quotes the owner's button answer too. The limits above
  are the entry's own Maintenance rule (compare R12 and DEC-OPEN-29), and the details of the Screener team's own
  methodology stay in a local-only note. DEC-OPEN-33 stays open.


### DEC-OPEN-07 The 13 JioBlackRock Regular records, and very young funds

Decider: owner. First asked: 19-Oct-2026 11:14 UTC by MOD-01 (repeated 21-Oct). Deadline: needed before the Oct
bake, so that TASK-023 and TASK-067 can ship with it (C20 and C43 are P1). Unblocks: TASK-023, and the
treatment rule for TASK-067. Related: C20 (P1), C16, C43; D81.

Answer: 'Yes, clear them' (a button offered by MOD-02, in answer to "Clear returns shown for periods before these
funds existed?"; 9-Nov-2026 11:38 UTC, MOD-02 chat) = option (a) -> D94. Status: ANSWERED.

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
- **Note 9-Nov-2026.** The other button was 'Keep and label' (option (b)). TASK-023 and TASK-067 become PLANNED;
  KNOWN_ISSUES C20, C16 and C43 are updated in the register sweep.


### DEC-OPEN-08 Confirm or reject the 8 scheme renames

Decider: owner. First asked: 19-Oct-2026 by MOD-01 (repeated 21-Oct). Deadline: ~13-Nov-2026 (before
`rename_schemes.js --apply` in the October cycle). Unblocks: TASK-024. Related: A6, C19; D46, D79.

Answer: 'Confirm all 8' (a button offered by MOD-02, in answer to "Confirm the 7 clear scheme renames and hold the
Motilal Oswal one?"; 9-Nov-2026 12:01 UTC, MOD-02 chat) = confirm all eight -> D96. Status: ANSWERED.

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
- **Note 9-Nov-2026.** The other button was 'Confirm 7, hold 1', which was MOD-02's recommendation (hold the Motilal
  Oswal pair until an AMC notice or the desk confirms it). The owner confirmed all eight; the apply step re-checks the
  eighth pair first. TASK-024 becomes PLANNED inside TASK-021; KNOWN_ISSUES A6 is updated in the register sweep.

### DEC-OPEN-35 Approval gate before publishing: does the owner approve before every merge that changes `site/`, or only in the listed cases?

Decider: owner. Raised: 17-Nov-2026 by MOD-02 from the owner's handover prompt (pasted 17-Nov-2026 06:27 UTC in
the MOD-02 chat; its sections 2 (item 14), 7.3 (steps 7 and 8), 8, 9, 17.1 and 23). Deadline: before the next
merge that changes any of the six deploy files; every wave of the October update waits on it (the first wave was
targeted for 11-Nov-2026 in the ETA of 9-Nov-2026). Unblocks: every publish of the October update (OPS-01's Run
A and the later waves) and the final wording of the publish rule in `CLAUDE.md`, the `monthly-update` skill and
the release rules. Related: D61, D63, D68, D87, D88; `FILE_OWNERSHIP_AND_CHANGE_CONTROL.md` sections 7, 8 and
10; `CLAUDE.md` "How every change is made" step 6; `docs/handover/MODERATOR_BOOTSTRAP_PROMPT.md` 7.4 and 7.6.

- **Words used in this entry.** A merge puts a change on the live site; the deploy files are the six files the live page is made of; Gate B is an independent code review of the change; the head commit is the exact saved version of a change.
- **The problem.** The owner's prompt of 17-Nov-2026 says that coding done is not a task done: the owner's
  explicit approval comes before a sprint is closed and before roll-out, the last approved version is never
  overwritten with unapproved work, and silence, a lack of feedback or the passage of time is never approval. It
  also asks for the owner's approval of a data update before the updated dashboard becomes the new baseline (its
  section 6.8). In this project a merge to `main` is the roll-out: it publishes the live site within minutes
  (D63), and the site and the repository are public (D60). The recorded rules say something different. D61
  (owner, 16-Oct-2026): a routine monthly refresh is merged, and so published, as soon as every check has
  passed, and the owner accepts it afterwards (D87; `FILE_OWNERSHIP_AND_CHANGE_CONTROL.md` section 8: "the owner
  reads the closing report"). D88 (9-Nov-2026) adds one more check to every refresh, a Guardian review of the
  diff run by the operator, but the refresh still publishes by itself when every check passes. `CLAUDE.md` step
  6 merges other changes when they are verified, unless the owner asked to review first or section 7 applies.
- **What the recorded rule asks the owner first, in plain words** (`FILE_OWNERSHIP_AND_CHANGE_CONTROL.md`
  section 7, "Owner approval before the merge"). Five cases only: (1) the tools cannot tell which fund or file
  is meant, or the product list would change (an unclear rename, a PMS name pin, a deck name that matches
  nothing, adding or removing products, a file that cannot be identified, that competes for one slot, that is
  older than what is live or that belongs to another month); (2) a correction to data that is already live, or a
  change that alters every client deck; (3) getting past a safety gate with an override flag, or pinning a name
  to a record by hand; (4) anything the project's "Never" list keeps for the owner (repository settings and
  visibility, force-push or history rewrite, library upgrades); (5) anything the owner has asked to see first.
  For everything else the owner's yes before the merge is not required.
- **Facts (VERIFIED 17-Nov-2026).** No merge since 22-Oct-2026 has changed `site/`:
  `git diff --stat 5d39821 origin/main -- site` prints nothing (5d39821 is the merge of PR #26, which was merged
  after the owner had seen the sample deck: D82). D61's automatic route has never been used (section 2.1: "never
  yet exercised"), so the October waves would be its first use. Which version is "the last approved" one is not
  recorded as such (UNKNOWN; INFERRED: the live content of PR #26, from the owner's go-ahead of 22-Oct-2026
  15:36 UTC in section 2.2). OPS-01's launch packet (point 11) lets it merge its own pull request when every
  check passes and no High-risk trigger applies, so the answer changes its instructions too.
- **Why a decision is needed.** Two instructions of the owner point different ways. D61 is an approved decision;
  the new prompt says to follow the latest explicit instruction, but also never to override an established
  decision silently (its section 17.1). Only the owner can say whether the prompt is meant to replace D61 for
  publishing. A change to publishing or approvals needs the owner's approval and a new `Dnn`
  (`FILE_OWNERSHIP_AND_CHANGE_CONTROL.md` section 10).
- **Options.**
  - (a) Keep the recorded rules (D61, D87, D88 and section 7 as they are). A routine refresh publishes when
    every check passes, Gate B included; the owner decides first only in the five cases above and accepts the
    rest afterwards.
  - (b) The owner approves before every merge that changes `site/` (any of the six deploy files), routine
    refreshes included. The work is finished in a branch, every check and Gate B pass, and the owner gets a
    one-page plain-language summary (what changes for clients, counts before and after, dates, funds added or
    dropped) with the result on the local preview. The merge follows an explicit "approved" for that exact head
    commit; a new commit means a new approval; silence is never approval. Merges that cannot change what clients
    see (documents, registers, tests, tool code that publishes nothing) stay on the Moderator's evidence (D87).
    A rollback that puts back the last approved version needs no new approval; the owner is told at once.
  - (c) A middle rule, approval on the preview. For each refresh run the owner approves once, explicitly, the
    one-page preview made from the dry runs. The operator then applies, tests and merges alone if every check
    passes and the outcome equals the preview (same files, same counts, same dates). Any difference, any failed
    gate and any of the five cases send it back for a new yes. Changes to the page, the exports or the tools
    that alter what clients see are treated as in (b), and a rollback is as in (b).
- **What each changes.** (a) Nothing. (b) A refresh no longer publishes by itself; Gate E for client-facing
  changes moves from after the merge to before it; the wording changes in `CLAUDE.md` (step 6),
  `FILE_OWNERSHIP_AND_CHANGE_CONTROL.md` sections 7 and 8, `docs/handover/MODERATOR_BOOTSTRAP_PROMPT.md` 7.4 and
  7.6, the `monthly-update` skill, `docs/MONTHLY_UPDATE_PROCESS.md`, the `release-manager` agent and OPS-01's
  launch packet; a new `Dnn` supersedes D61 in part and amends D87 and D88. (c) The same files change, but only
  the refresh route, and the preview becomes a named output of every run.
- **Benefits and disadvantages.** (a) Fastest, and the owner's time goes only where a judgement is needed; but a
  publish can reach clients before the owner has seen it, which is not what the prompt asks (INFERRED), and the
  automatic route has not been tried yet. (b) The owner controls every publish and the last approved version can
  always be named; the price is one yes per merge (three to five merges in a month while the October update runs
  in waves: INFERRED from the ETA of 9-Nov-2026), delay when the owner is away, and a branch that has to be
  brought up to date and re-checked if `main` moves while it waits. (c) Fewer round trips than (b), and nothing
  reaches clients without an explicit yes; the risk is a gap between the preview and the final result that the
  equality check does not catch (INFERRED), and that check is new and has to be written down.
- **Impact on existing functionality.** None on the dashboard, its data or the tools: only who says yes, and
  when.
- **Maintenance.** (b) and (c): the Moderator records each approval (date, head commit, the owner's words) in
  `INTEGRATION_AND_REGRESSION_LOG.md`, so that the latest owner-approved version can always be named, as the
  prompt requires. (a): nothing new.
- **Risks and reversibility.** Reversible: a rule change by a docs PR with the owner's approval. Under (a) the
  risk is a mistake published before the owner has seen it; a bad publish is rolled back by reverting the merge
  (`FILE_OWNERSHIP_AND_CHANGE_CONTROL.md` section 9), but decks already sent to clients are not recalled. Under
  (b) the risk is a stale dashboard while an approval is awaited (INFERRED); under (c) see above.
- **Related question inside this entry (INFERRED).** The prompt also asks for the owner's approval before any
  sprint (task) is closed. D87 (9-Nov-2026) lets the Moderator accept changes that clients do not see
  (registers, tests, internal documents) on evidence. This entry keeps D87 for changes that publish nothing; the
  owner can say that the prompt is meant to override D87 as well.
- **Documented recommendation (not a decision).** MOD-02, 17-Nov-2026 (INFERRED from the prompt and the recorded
  rules): option (b), at least for the October update. It is the owner's latest explicit instruction (the
  prompt's own order of precedence puts that first), a merge is a public roll-out, the automatic route has never
  been used so no working practice is disturbed, there is no hosted staging copy (INFERRED), so the owner's
  first sight of a hosted change would be the live site, and the cost is one short yes per merge. Keep (c) as
  the fallback if waiting becomes a problem, and let the owner relax to (a) later with a new decision. What
  stays the same under all three: gates A to D (Gate B runs before the owner is asked), the six-file deploy
  rule, the CI `verify` check, `security-reviewer` before every push, the stop list of D61 (a judgement call
  always asks first), and the Moderator's acceptance of internal documents on evidence (D87).
- **Record the answer as.** A new `Dnn` (for (b) or (c): it supersedes D61 for publishing and amends D87 and
  D88); update `CLAUDE.md`, `FILE_OWNERSHIP_AND_CHANGE_CONTROL.md` sections 7 and 8 and
  `docs/handover/MODERATOR_BOOTSTRAP_PROMPT.md` in the same PR (the rule is in section 10 of
  `FILE_OWNERSHIP_AND_CHANGE_CONTROL.md`); tell OPS-01 and every later OPS chat, because the merge rule in the
  launch packet changes.
- **Not covered here (INFERRED).** The same prompt asks for other process changes that this project's rules do
  not contain: a Stage 0 reconstruction of the dashboard, a roadmap of phases and sprints that the owner
  approves before new development, and a numbered-chat system. Whether they apply to a project that already has
  a verified baseline and its own chat numbering is a separate question for the owner; MOD-03 puts it as the
  next free entry once it has read the prompt.

Answer: 'Keep automatic refreshes' (a button offered by MOD-03, in answer to "Should every publish that changes
the dashboard wait for your explicit yes?"; the other button was 'Yes, wait for my yes'; 17-Nov-2026, MOD-03 chat)
= option (a) -> D97. Status: ANSWERED. The owner did not say that the handover prompt overrides D87, so D87 stays.

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

Answer: the owner's message of 18-Nov-2026 (MOD-03 chat), answering MOD-03's desk questions 4 to 6: C5 "Yes" (the
Gift City fund is our Motilal Oswal Alternative Investment (Inbound)); C6 Prism Hybrid Long-Short Fund is run by
JioBlackRock Mutual Fund, range 9%-11%; C38 Magnum Equity Ex-Top 100 Long-Short SIF is run by SBI Mutual Fund, range
14%-16%; C4 Series I closed its subscriptions and Series II is open, same return expectation and terms -> D101.
Status: ANSWERED.

### DEC-OPEN-36 October Reckoner run: the Centricity Select list and the AIF performance stop at their gates (four questions)

Decider: owner (with the desk for the facts about the funds). Raised: 17-Nov-2026 by MOD-02 from OPS-01's
dry-run report of 9-Nov-2026 (local-only; `tools/merge_reckoner.js` and `tools/merge_aif_performance.js` on the
deck "Monthly Investment Reckoner - October 2026", data as on 30-Sep-2026; nothing was applied). Deadline: as
soon as possible. OPS-01 stopped on 9-Nov-2026 and waits; the first October wave (the Reckoner products) was
targeted for 11-Nov-2026. The same names will come back with the next deck (expected about 20-28-Nov-2026:
INFERRED from the monthly cadence in `monthly-updates/00_INBOX/README.md`), so the answers are needed in any
case. Unblocks: TASK-020 steps 14, 14a and 15 (the Reckoner steps of Run A) and with them the refreshed
Centricity Select list and AIF performance. Related: DEC-OPEN-11, DEC-OPEN-04; KNOWN_ISSUES A4 and A20; D61
(stop list), D71, D75, D76, D90; `FILE_OWNERSHIP_AND_CHANGE_CONTROL.md` section 7 (high-risk triggers 9 and 10).

- **The problem.** Each month the Reckoner deck decides which funds carry the Centricity Select badge (the house
  recommendation, with its rationale) and supplies the AIF performance table. OPS-01's dry run on the October
  deck found the following (nothing applied; both steps exit 1):
  - Step 14 (Select list): 178 would become 171 (5 added, 12 dropped, 166 kept). Two gates fail. (i) 12 drops
    against a limit of 8 (5% of 178): only the owner can waive it, with `--accept-drops 12`, after reading the
    list. (ii) In the category "EQUITY AIFs- Listed Equities" five Select AIFs drop (Alchemy Long Term Ventures
    Fund, ICICI Prudential Alpha Opportunities, Karma Capital Jasmine Fund, Kotak Iconic Fund II, Motilal Oswal
    Founders Fund) while the deck lists three names that match nothing in our records (Motilal Oswal Founders
    Fund Series VII, Alchemy Long Term Ventures Fund 3, Aionios Alpha Fund I). The tool reads that as a possible
    join failure (a respelled name), not as a deliberate removal, and `--accept-drops` does not waive it (D71).
  - The 12 drops are those 5 AIFs; 5 gold ETFs (HDFC Gold ETF, ICICI Pru Gold ETF, Mirae Asset Gold ETF, Nippon
    India ETF Gold BeES, SBI Gold ETF), while the deck lists three gold ETF funds of funds (HDFC, Quantum, UTI)
    among the 5 additions; and 2 diversified equity funds (360 ONE Focused Fund, Tata Large & Mid Cap Fund),
    while the deck lists two others (Aditya Birla SL Flexi Cap Fund, Invesco India Large & Mid Cap Fund) among
    the additions. The 5 additions have no rationale text yet (the deck's fund pages are performance grids
    only).
  - Five deck names have no MASTER record: the three AIF names above and two PMS names (Sundaram SISOP, Equinova
    Edge PMS). Adding a record is a universe change (`tools/add_reckoner_funds.js`, step 14a: "always confirm
    with the owner"), and that tool keeps its own hard-coded list of the products to add (four entries today),
    so adding means editing that list first (VERIFIED in code).
  - Step 15 (AIF performance): the deck's AIF grid has ten rows; seven match our AIF records and the three names
    above match nothing. The page holds performance for 12 AIF records and the tool rebuilds it from the deck,
    so 12 would become 7 and the gate "MASTER AIF funds with performance" fails. The five that would lose it are
    the five AIFs that drop out of Select (VERIFIED: the 12 keys of `PMS_PERFORMANCE.aif` on `origin/main` less
    the 7 matched rows). That gate has no override flag (VERIFIED in `tools/merge_aif_performance.js`: its flags
    are `--apply`, `--html` and `--allow-layout-change`, which concerns the deck layout only).
  - The two "successor series" names. OPS-01 read them as successor series of our two records (UNCERTAIN). Our
    live Select entries for Motilal Oswal Founders Fund and Alchemy Long Term Ventures Fund carry the previous
    deck's spellings "Motilal Oswal Founders Series VII" and "Alchemy Long Term Ventures Fund Series 3"
    (VERIFIED: the `CENTRICITY_SELECT` block on `origin/main`), and `tools/data/pins.json` already pins "Motilal
    Oswal Founders Fund*" and "Alchemy Long Term Ventures Fund*" to those records. The October deck writes
    "Series VII" and "3": the same series numbers, spelled differently (INFERRED: a respelling and not a new
    series; only the desk or the funds' own documents can confirm). For the other names: VERIFIED that no MASTER
    name contains Aionios, Equinova or SISOP; the PMS performance block already holds a key "Sundaram Alternate
    - SISOP".
- **Why a decision is needed.** Every way out of the stop is the owner's under the project's rules: a pin needs
  the owner (D75; a Reckoner name mismatch is on D61's stop list), adding a record is a universe change (D61),
  and `--accept-drops` is an owner-only override (D71). A wrong pin puts another fund's numbers on a client's
  fund. Any of them makes Run A a High-risk change (section 7, triggers 9 and 10): a change-impact contract, a
  Gate B review run by the Moderator and the owner's approval before the merge. OPS-01's claim record (a draft
  exists, local only) assumes a routine refresh and has to be redone (INFERRED). The owner's words of 9-Nov-2026
  "All the existing products stay; additional ones will be added" (D90) were said about the bond file; whether
  they also cover Select badges is not said (INFERRED: these tools never delete a MASTER record, and a Select
  badge is a different thing).
- **Options.** One decision per question. Ask in the order a, c, d, b, because the count in (b) depends on the
  others.
  - (a) Are "Motilal Oswal Founders Fund Series VII" and "Alchemy Long Term Ventures Fund 3" the same funds as
    our two records? (a1) Yes: pin both names to the records (a reviewed edit of `tools/data/pins.json`, in two
    sections, with the desk's or the fund house's confirmation quoted). (a2) No, they are new series: leave the
    old records as they are and add the two names as new products (see c). (a3) Ask the desk first and hold
    steps 14 and 15 until it answers.
  - (b) After a, c and d, accept the drops that are left? (b1) Yes: apply with `--accept-drops <n>`, where n is
    the exact count of the final list (12 if nothing is pinned, about 10 if both names are pinned: INFERRED),
    after the owner has read the DROPPED list. (b2) No: hold the Select refresh and keep the current list until
    the next deck. The flag never waives the gate on unmatched deck names, so (a) and (c) come first.
  - (c) May the new names be added to the product list? The names are Aionios Alpha Fund I (an AIF) and Sundaram
    SISOP and Equinova Edge PMS (PMS), plus the two series names if (a2). (c1) Yes: add them with
    `tools/add_reckoner_funds.js` after a reviewed change to its list; each new product's expected-return band
    is inherited from its peer group, not taken from a source for that product (the tool's own header), and its
    facts come from its own page of the deck. (c2) Not now: leave them out and let the run record them as known
    gaps (a small change to the `NO_MASTER_NOTE` list in `tools/merge_reckoner.js`), to be added later. (c3) Ask
    the desk for the details first.
  - (d) Are the removals the desk's own decision? Three groups: the 5 gold ETFs (replaced by 3 gold ETF funds of
    funds), the 2 equity funds (replaced by 2 others) and the 3 AIFs the deck leaves out altogether (Karma
    Capital Jasmine Fund, Kotak Iconic Fund II, ICICI Prudential Alpha Opportunities: editorial or omission is
    UNKNOWN). (d1) Accept the deck: the funds lose the Select badge and stay in the product list. (d2) Keep the
    existing Select entries ("existing products stay", D90): the tools take membership from the deck, so this
    needs a tool change or a hand edit (INFERRED), and it leaves badges on funds the desk no longer lists
    (INFERRED). (d3) Ask the desk which removals are deliberate before deciding, at least for the three AIFs.
    Whatever is chosen, step 15 cannot pass until the AIF performance of the AIFs the deck leaves out (those
    three, if a1 is chosen) is settled too, because the gate has no override: (i) show no performance for them
    (an owner-only override flag must be added to the tool: High risk); (ii) keep their old performance with its
    old date (INFERRED: a table of mixed dates, in conflict with CLAUDE.md rule 6 if shown as current); (iii)
    get their current performance from the desk.
- **What each changes (what clients see).** A fund dropped from Select loses its badge, rationale and ratio
  details in the picker, the popover and the rationale pages (INFERRED from the tool's header: "Retained funds
  keep their rationale, risk ratios and details"); it stays in the product list and can still be picked. An
  added fund shows the badge without rationale text (INFERRED from the tool's list of "new entries with no
  rationale"). An AIF without performance shows no returns in the AIF table on screen, in Excel and in the deck
  (INFERRED). New products become selectable and appear in the deck. (a1) keeps two AIFs with badge, rationale
  and refreshed performance; (a2) drops them and adds two new products. Holding the run keeps the page as it is:
  the Select list and the AIF performance as on 31-Aug-2026 (the September deck), including funds the desk has
  dropped.
- **Benefits and disadvantages.** (a1) Fewest changes for clients; it depends on the sameness being right, and a
  wrong pin is the worst case (D75). (a3) is the safest and the slowest. (c1) completes the list as the deck
  shows it, with bands that are inherited and so a judgement (INFERRED). (c2) is quick, but the deck and the
  page differ until the names are added. (d1) follows the desk's own list, but some clients lose a badge on a
  fund they know. (d2) keeps continuity, but the badge may contradict the desk (INFERRED). (b1) refreshes
  October with an exact, owner-only override. (b2) changes nothing for clients, who stay on last month's view.
- **Impact on existing functionality.** The Select badges and rationale pages and the AIF and PMS tables; the
  product count only under (a2) and (c1). Nothing else.
- **Maintenance.** A pin is a standing line in `tools/data/pins.json` that every later deck run uses; each added
  product needs its monthly performance and rationale kept up (INFERRED). The same names return with every deck,
  so a note recorded now saves asking again.
- **Risks and reversibility.** The pins, the override and the data merge are reversible in git (restore the six
  deploy files from `backups/`, or revert the merge); decks already sent to clients are not recalled. A wrong
  pin or a wrong addition is the real risk.
- **Documented recommendation (not a decision).** None is documented. MOD-02, 17-Nov-2026 (INFERRED): put (a),
  (d) and the details for (c) to the desk in one message (the owner contacts the desk). If the desk confirms a
  respelling, take (a1). Take (c1) for the three names, as a small tool change in its own reviewed task with the
  owner's approval of each band. Take (d1) for the gold ETFs and the equity funds if the desk confirms, and (d3)
  for the three AIFs. Take (b1) last, with the exact count. If the desk cannot answer soon, (b2) keeps the page
  as it is rather than guessing.
- **Record the answer as.** A new `Dnn` (pins and additions are owner decisions on the product list: D75) with
  the owner's words and the exact `--accept-drops` count quoted; update TASK-020 and the OPS-01 claim (High
  risk), KNOWN_ISSUES (A20, or a new entry if a tool change is needed) and DEC-OPEN-11; `tools/data/pins.json`
  records each pin with the confirmation date (D75). Prepare the relay message for OPS-01 (DECISION_LOG section
  1.5 step 4).

- **Partial answer 17-Nov-2026 (question a) -> D98.** Answer: the owner first chose the button 'Ask the desk first'
  (the other button was 'Yes, same funds') in answer to "Are October's "Series VII" and "Fund 3" AIFs the same funds as ours?", then wrote in the same
  chat, minutes later: "YEs they are the same fund" (17-Nov-2026, MOD-03 chat). The later message is the answer =
  option (a1): "Motilal Oswal Founders Fund Series VII" is our record "Motilal Oswal Founders Fund" and "Alchemy Long
  Term Ventures Fund 3" is our record "Alchemy Long Term Ventures Fund" (D98). The pins are made in the refresh run
  (a reviewed edit of `tools/data/pins.json`, sections `reckoner` and `aif_performance`), which makes that run High
  risk. Questions (c), (d) and (b) stay open; the desk is still asked the facts behind (c) and (d) and the labels of
  DEC-OPEN-11. Status: OPEN (three questions left).

- **Partial answer 18-Nov-2026 (questions c and part of d) -> D101.** The owner answered the desk questions (MOD-03 chat):
  (c) add Aionios Alpha Fund I, Sundaram SISOP (= "Sundaram Alternate - SISOP") and Equinova Edge PMS, class Equity;
  (d) Karma Capital Jasmine Fund was not dropped on purpose (its October factsheet attached); the gold ETFs and the two
  equity funds: "Keep tracking them" (reading INFERRED: they keep their Select entries; to be confirmed). Still open:
  Kotak Iconic Fund II and ICICI Prudential Alpha Opportunities (no answer); the ranges and exit loads of the three
  new products; then (b), the exact `--accept-drops` count from a fresh dry run. Status: OPEN.

Answer: (a) D98 (17-Nov-2026); (c) and part of (d) D101 (18-Nov-2026); the rest of (d) and the keep-list reading D102
(18-Nov-2026: Kotak Iconic Fund II and ICICI Prudential Alpha Opportunities dropped; the gold ETFs and two equity funds
kept; the deck's replacements added); (b) not needed: with these answers the drops are 2, within the 5% gate (OPS-02 dry
run of 18-Nov-2026, local). Status: ANSWERED.

### DEC-OPEN-04 The PMS date label (31-Jul data shown as "31st August 2026")

Decider: owner. Asked: 27-Oct-2026 by MOD-01. Deadline: needed before TASK-020 if the desk will not send the PMS
files (TASK-020 Dep). Unblocks: TASK-025. Related: B1 (P2), C26, C30; DESK-01; REQ-PPT-64.

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
- **Note 9-Nov-2026.** The owner's October task list (9-Nov-2026 07:19 UTC) says the PMS and AIF performance can be
  taken from the Monthly Investment Reckoner (D95). MOD-02 reads this as option (b) with the Reckoner as the source
  (INFERRED): the label changes together with the data. The entry stays open until the first Reckoner-fed PMS update
  closes B1 and folds TASK-025 into it.

Answer: 'Approve all' (a button offered by MOD-03, 18-Nov-2026, MOD-03 chat), approving point 1 of the October Reckoner
list: the PMS and AIF tables are labelled "as on 30th September 2026", with every row as on that date (D102 item 5) -> D105.
Status: ANSWERED.

---

# Part 2. Approved decisions (index only; `docs/DECISIONS.md` is authoritative)

## 2.1 Load-bearing approved decisions a Moderator must know

`docs/DECISIONS.md` holds D1-D111 (never reused). Statuses there: Open D2, D58; D43 "Active (premise reopened)";
Superseded D4, D5, D41, D45, D69. Next free: **D112**. The one-line summaries below are pointers; read the entry
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
| D43 | Node route into `RISK_MATRIX`; drop `c` | Active (premise reopened) | D86 (B8): `merge_risk_matrix.js` stays the only writer; the producer of its input changes from October |
| D46 | Rename before every bake; identity = inception + AMC | Active (amended by D73, D79) | CLAUDE.md rule 7; DEC-OPEN-08 (answered: D96) |
| D48 | One hybrid predicate for all four analytics gates | Active | CLAUDE.md rule 8 |
| D49 | PMS/AIF look-through is written in two places | Active | A29, TASK-068 |
| D50 | SIF Monitor baked into the SIF sibling; always /100 | Active | CLAUDE.md rule 4 |
| D58 | Rf = 4.5%, pending desk confirmation | Open | = DEC-OPEN-02 (owner kept 4.5% for now: D84; desk confirmation open) |
| D60 | Public repository on free GitHub Pages (owner, 16-Oct-2026) | Active | no client names or files in the repo (R1: de-identified sample figures remain in pushed history); DEC-OPEN-18 |
| D61 | Monthly updates publish automatically once every check passes (owner, 16-Oct-2026) | Active | never yet exercised; data corrections are not covered; the owner's handover prompt of 17-Nov-2026 asked for approval before roll-out (DEC-OPEN-35); the owner kept D61 on 17-Nov-2026: D97 |
| D62 | Repository reorganised into `site/`, `tools/`, `tools/lib/`, `docs/` | Active | repository layout |
| D63 | Pages built by GitHub Actions from `site/`, behind a parity gate | Active | Gate D; no branch protection (R9, DEC-OPEN-17) |
| D64 | History migrated sanitised, not verbatim | Active | never push `upstream/*`; R1 |
| D65 | The local workspace folder is the git repository | Active | R6; DEC-OPEN-19 |
| D66 | Preview server serves only `site/`, on 127.0.0.1 | Active | `node .claude/serve.js` / `preview_start playbook` |
| D67 | Shared Claude config, package manifest and LF tracked (`xlsx` 0.18.5 pinned) | Active | never upgrade without the owner (TASK-058) |
| D68 | Changes go branch -> PR -> verify -> merge | Active | every change, docs included |
| D70 | `DATA_DATES.analytics` labels the MF analytics only | Active | A3 |
| D71 | Centricity Select merge refuses join failures and mass drops | Active (extended by D76) | `--accept-drops` only by the owner; the October run needs it (DEC-OPEN-36) |
| D72 | One tool contract: exit 0 ok / 1 gate failed / 2 usage or input error; gates before writes; atomic writes; strict CLI | Active | read every gate line |
| D73 | Workbook dates are calendar days (`isoDay`) | Active | A6 |
| D74 | Source reliability flags reach the page as `fl` | Active | 33 risk flags; dagger notes |
| D75 | Hand pins live in `tools/data/pins.json` | Active | pins only with the owner; DEC-OPEN-36 asks for two |
| D76 | Reckoner merge refuses a drop under an unmapped deck heading | Active | Reckoner step |
| D77 | CDN scripts carry SRI; noindex; inline favicon | Active | never change CDN versions |
| D78 | `Centricity_Risk_Matrix.js` moved to `docs/archive/` (supersedes D69) | Active | 7 published files; the legacy file returns 404 |
| D79 | Rename history kept in `prev_names` | Active | renames are reversible |
| D80 | Refresh-only Monitor sheets; unknown sheets fail the bake | Active | C19 |
| D81 | Publish the C19 re-run; keep blank-cell values; hold the C20 G-Sec record (owner, 21-Oct-2026) | Active | DEC-OPEN-07 (answered: D94, which releases the held record) |
| D82 | The PowerPoint export lays out every native slide through one measured design system (owner, 22-Oct-2026) | Active | CLAUDE.md rule 10; C44, C45 are exceptions |
| D83 | The deck marks an expected 1Y/3Y/5Y figure with `*` (owner, 22-Oct-2026) | Active | C28; DEC-OPEN-16 |
| D84 | Rf stays 4.5% for now (owner, 2-Nov-2026) | Active | the planned bridge tool (TASK-022, not built) is to refuse a pack whose stated Rf is not 4.5% (MOD-02 proposal) |
| D85 | Sortino stays the textbook formula (owner, 2-Nov-2026) | Active (superseded for the Portfolio Matrix by D92) | cannot be met from the pack data: see D92 |
| D86 | NAV and risk-ratio inputs from the MF dashboard (owner, 2-Nov-2026); data-pack reading INFERRED | Active (extended by D93) | TASK-022 re-scoped (bridge tool); DEC-OPEN-33 open (DEC-OPEN-30, -31 and -32 answered: D92, D93, note on D86); D85 is superseded for the matrix by D92 |
| D87 | The owner accepts client-facing changes; the Moderator records acceptance of the rest on evidence (owner, 9-Nov-2026) | Active | Gate E text in FILE_OWNERSHIP section 8 and bootstrap prompt 7.4 (TASK-018, GOV-01's PR) |
| D88 | Every monthly refresh includes a Guardian diff review (Gate B) run by the refresh operator (owner, 9-Nov-2026) | Active | The refresh rules in CLAUDE.md, the monthly-update skill, the release-manager and integration-guardian agents, the process doc and FILE_OWNERSHIP sections 7 and 8 (TASK-018, GOV-01's PR) |
| D89 | Direct equity returns are calculated from a public price source: Google Finance or the NSE website (owner, 9-Nov-2026) | Active | the new returns tool (to be contracted); `merge_direct_equity_returns.js` stays the writer |
| D90 | Product updates: existing products stay, additions are added, a bond is replaced by the same ISIN or an exactly similar product, the two bond lists become one (reading INFERRED), GIFT City expected-IRR ranges stay (owner, 9-Nov-2026) | Active | the bond and GIFT City merge tools (to be contracted); the October product update |
| D91 | Performance is labelled with the calendar month-end although the NAV date is the last working day before it (owner, 9-Nov-2026) | Active | the October refresh (`--as-on "31st October 2026"`); the update log records the true NAV date |
| D92 | The Portfolio Matrix shows the MF dashboard's Sortino from October, with a note; supersedes D85 for the matrix (owner, 9-Nov-2026) | Active | TASK-022 (bridge tool); KNOWN_ISSUES C35 and C46 |
| D93 | The Portfolio Matrix accepts the four other changes of the MF dashboard's data: date, coverage, benchmark and alpha, daggers and wording (owner, 9-Nov-2026; extends D86) | Active | TASK-022 (bridge tool); the one-time coverage waiver needs the owner's approval of the list; KNOWN_ISSUES C46 |
| D94 | Returns for periods longer than a fund's life are cleared: the 13 JioBlackRock Regular records and very young funds (owner, 9-Nov-2026) | Active | TASK-023, TASK-067; KNOWN_ISSUES C20, C16, C43 |
| D95 | PMS and AIF performance can be taken from the Monthly Investment Reckoner (the owner's instruction, 9-Nov-2026) | Active | the PMS-from-the-Reckoner tool (to be contracted); DEC-OPEN-04; D54 and D75 stay until it exists; KNOWN_ISSUES B1 |
| D96 | The eight scheme renames are confirmed (owner, 9-Nov-2026) | Active | TASK-024 inside TASK-021 step 1; KNOWN_ISSUES A6 |

## 2.2 Owner decisions made in conversation, not yet recorded as a D-number

These were approved by the owner but live only in chat transcripts. TASK-074 records them in
`docs/DECISIONS.md` under the next free numbers, with wording the owner confirms. Until then, this table is the record.

| When (UTC) | Decision (owner's words or act) | Where it lives today | Label |
|---|---|---|---|
| 15-Oct-2026 14:36 | Stage A before Stage B: "Stop after establishing the baseline" | master prompt (transcript); honoured (REQ-007) | VERIFIED (words) |
| 16-Oct-2026 13:09 | "Start fixing all the issues that you have identified and tell me the impact of that pre and post fixing" (fix programme authorised) | transcript; KNOWN_ISSUES introduction and CHANGELOG describe the work, not the decision | VERIFIED (words) |
| 16-Oct-2026 13:09 | Export-prompt constraints: capture all data that may be needed in future; say nothing about deleting the existing dashboard; zips over Teams, not OneDrive | only as text inside `docs/handover/DATA_EXTRACTION_PROMPT.md` | VERIFIED (words) |
| 16-Oct-2026 13:09 | The old dashboard is deleted only "after full testing has been done on the new build" | transcript (16-Oct-2026 13:09 UTC); since the 28-Oct package also KNOWN_ISSUES R7, REQ-049, TASK-034, DEC-OPEN-14 and DEC-OPEN-24; not yet in `docs/DEPLOYMENT.md` (E14) or `docs/DECISIONS.md` (TASK-074) | VERIFIED (words) |
| 16-Oct-2026 ~13:09 | Started the card "Fix the three P1 tool risks before the next refresh" (worktree session NB-01) | transcript only | INFERRED (act) |
| 21-Oct-2026 ~05:51 | Started the card "Small tool and UI follow-ups from the 19-Oct fixes" (NB-02) | transcript only | INFERRED (act) |
| 22-Oct-2026 14:30 | Chose "New session" for "Fix and standardise the proposal PowerPoint export" (NB-03) | transcript only | VERIFIED (act) |
| 22-Oct-2026 15:36 | The merge go-ahead also accepted the `*` marker wording and shared performance slides that NB-03 asked about in the same message | D82/D83 say "approved"; the two sub-answers are not explicit | INFERRED |
| 23-Oct-2026 20:30 | The export placed in `handover-archive/export_20261023/` (the OneDrive-synced drop folder MOD-01 proposed) | update-log path only | INFERRED (choice) |
| 27-Oct-2026 15:25 (re-issued 28-Oct 05:33) | Freeze all implementation; move to a Moderator (MOD-02) / Guardian (ARC-01) multi-chat model with project-control registers | this handover package (TASK-015) | VERIFIED (words) |

## 2.3 Recommendations that are not decisions

Recommendations in part 1 stay recommendations until the owner answers. Examples that are easy to mistake for
decisions: "move the clone outside OneDrive" (DEC-OPEN-19), "require the verify check on main" (DEC-OPEN-17) and "one
Moderator per project" (DEC-OPEN-25).
None of them may be implemented on the strength of the recommendation alone.

## 3. Change log

| Date | Change | By |
|---|---|---|
| 28-Oct-2026 | Log created: DEC-OPEN-01..DEC-OPEN-28 (all BLOCKED on the owner); index of load-bearing D-numbers; conversation-only approved decisions listed for TASK-074. | MOD-01 |
| 2-Nov-2026 | DEC-OPEN-02 answered ("Keep 4.5% for now") = D84; DEC-OPEN-03 answered ("Keep textbook") = D85; both moved to section 1.6. | MOD-02 |
| 2-Nov-2026 | TASK-016 audit corrections: s2.2 row 4, DEC-OPEN-18 and the D60 row (F-01, F-02), deadlines for DEC-OPEN-01/-02/-03 (F-03), F-04..F-08, F-11; DEC-OPEN-29 added. | MOD-02 |
| 2-Nov-2026 | DEC-OPEN-01 answered (NAV and risk-ratio inputs from the MF dashboard, per the owner; the data-pack reading is INFERRED) = D86; moved to section 1.6. DEC-OPEN-30 to DEC-OPEN-33 added from the pack analysis (the Sortino form; the other changes; permission to show the ratios publicly; use of a PROVISIONAL pack). Order to ask, summary, next-free ids and the load-bearing index updated. | MOD-02 |
| 3-Nov-2026 | DEC-OPEN-34 opened (Gate E scope; who accepts a finished change) from ARC-01 finding D-12 (Gate B review of 2-Nov-2026), raised again in the pre-check of the TASK-018 contract. | MOD-02 |
| 9-Nov-2026 | DEC-OPEN-34 answered ("Client-facing only", 06:48 UTC) = D87; moved to section 1.6; the section 1.2 note (the pack bridge cannot merge by 13-Nov-2026, INFERRED), order item 1 and sections 2.1 to 2.3 updated. | MOD-02 |
| 9-Nov-2026 | D88 recorded: the owner's yes to an operator-run Gate B in every monthly refresh (07:34 UTC; a Guardian finding of 9-Nov-2026, reported in chat). | MOD-02 |
| 9-Nov-2026 | DEC-OPEN-30 answered ("Dashboard's, with note", 08:43 UTC) = D92, DEC-OPEN-31 answered ("Accept all four", 08:54 UTC) = D93 and DEC-OPEN-32 answered ("Yes, they may", 09:02 UTC; note on D86); all three moved to section 1.6; section 1.2, the counts and section 2.1 updated. | MOD-02 |
| 9-Nov-2026 | D89, D90 and D91 recorded from the owner's answers of 9-Nov-2026 (07:19, 08:07 and about 09:12 UTC): the Direct Equity price source, the product-list rules (one Bond List, reading INFERRED), the performance label. | MOD-02 |
| 9-Nov-2026 | DEC-OPEN-07 answered ("Yes, clear them", 11:38 UTC) = D94 and DEC-OPEN-08 answered ("Confirm all 8", 12:01 UTC) = D96; both moved to section 1.6; D95 recorded (PMS and AIF performance from the Reckoner, the owner's message of 07:19 UTC) with a note on DEC-OPEN-04; sections 1.2, 2.1 and 2.3, the counts and the next-free ids updated. | MOD-02 |
| 17-Nov-2026 | DEC-OPEN-35 opened (approval gate before publishing: the owner's handover prompt of 17-Nov-2026 against D61, D87 and D88) and DEC-OPEN-36 opened (the October Reckoner run: the Select list and the AIF performance stop at their gates, from OPS-01's dry runs of 9-Nov-2026). Sections 1.1 to 1.3 (sources, order to ask, counts: 36 entries, 9 answered, 27 open, next free DEC-OPEN-37) and the D61, D71 and D75 rows of section 2.1 updated; the statement in section 1.2 that TASK-018 had not merged corrected (PR #35 merged 9-Nov-2026). | MOD-02 |
| 17-Nov-2026 | DEC-OPEN-35 answered ('Keep automatic refreshes') = D97 (D61, D87, D88 and FILE_OWNERSHIP section 7 stay as they are); moved to section 1.6. | MOD-03 |
| 17-Nov-2026 | DEC-OPEN-36 question (a) answered ("YEs they are the same fund", after a first click on 'Ask the desk first') = option (a1) -> D98: both deck names are our two AIF records; pins made in the refresh run. DEC-OPEN-36 stays open for (c), (d), (b). | MOD-03 |
| 18-Nov-2026 | The owner's message of 18-Nov-2026: D99 (October Regular and SIF from the 2-Nov files, label "31st October 2026"; the re-export question closed), D100 (October analytics), D101 (Reckoner answers); DEC-OPEN-11 answered and moved to section 1.6; DEC-OPEN-36 partial answer (c, part of d). | MOD-03 |
| 18-Nov-2026 | D102 recorded from the owner's second message of 18-Nov-2026; DEC-OPEN-36 answered (D98, D101, D102) and moved to section 1.6; DEC-OPEN-04: D102 item 5 points to a "30th September 2026" label, to be confirmed. | MOD-03 |
| 18-Nov-2026 | D103 (young-fund `si` only beyond +-300%; NB-04's question) and D104 (Karma's 30-Sep factsheet, Equinova exit load Nil, Alchemy Leaders row 30-Sep, three AIFs Cat II/III) recorded. | MOD-03 |
| 18-Nov-2026 | D105 recorded (the owner's "Approve all" of the October Reckoner list); DEC-OPEN-04 answered (label "30th September 2026") and moved to section 1.6. | MOD-03 |
| 19-Nov-2026 | D106 recorded (the owner's "Approve all" for the October MF cycle: hand-adds, no ranges yet, ICICI exit load, JioBlackRock "*" figures, two unusual figures kept). | MOD-03 |
| 19-Nov-2026 | D107 recorded (the owner's "all 8" for the November Market Update slides; a one-off). | MOD-03 |
| 20-Nov-2026 | D108 recorded (the owner's "Approve all" for the November 2026 Reckoner run). | MOD-03 |
| 21-Nov-2026 | D109 recorded (the owner's "Approve all" for the "Other Funds Analytics" hybrid refresh). | MOD-03 |
| 23-Nov-2026 | D110 recorded (the owner's "Approve all" of 22-Nov-2026 for the six follow-up fixes). | MOD-03 |
| 23-Nov-2026 | D111 recorded (the owner's "Approve all" and "money-market only" for bundle 2, TASK-086). | MOD-03 |

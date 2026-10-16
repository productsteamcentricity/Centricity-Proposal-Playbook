# Update logs

One file per **data month**, named `<YYYY-MM>_<Mon-YYYY>.md` (e.g. `2026-10_Oct-2026.md`), written
during each monthly refresh and committed in the same pull request as the data. If a month has two
runs (MF cycle, then Reckoner cycle), append a second "Run" section to the same file.

The source files themselves are never pushed to GitHub; this log is the public, permanent proof
of exactly what went into each published update (name, as-on date, SHA-256).

## Template

```markdown
# Update log — data month <Month YYYY>

**Run:** <dd-Mon-yyyy>, branch `data/<YYYY-MM>`. Operator: Claude Code.
**Result:** ready to publish / stopped before publishing (why). The PR link, merge commit and live-site
check are recorded on the PR after merge and carried into the next run's log.

## Inputs (`monthly-updates/<YYYY-MM_Mon-YYYY>/`)
| File | Role (INPUT_FILES #) | As on (read from content) | SHA-256 |
|---|---|---|---|

Missing this cycle (domain keeps its previous date): …

## Steps
| # | Tool | Gates (dry-run) | Applied? | Notes / owner decisions |
|---|---|---|---|---|

## Counts (`node tools/verify_page.js site`)
| Line | Before | After | Why it moved |
|---|---|---|---|

## Checks
- Financial spot-checks: <n> records traced to their source cells (fund name and `workbook › sheet › cell`
  only; never copy row values into this log): …
- Browser checks (TESTING.md §3): …
- Live site SHA-256 = site/: recorded on the PR after merge (process step B8.4)

## Data in force after this run
| Domain | As on |
|---|---|

## Issues found / follow-ups
```

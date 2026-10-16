---
name: verify-dashboard
description: Run the Centricity Proposal Playbook parity/QA checks (verify_page counts, page load, core flows, exports, optional live-site hash check) and report pass/fail with evidence. Use after any change to site/ or tools/, after a monthly refresh, or when asked whether the dashboard is healthy.
argument-hint: "[live]  (add 'live' to also compare the deployed GitHub Pages files)"
---

Verify the dashboard. Arguments: $ARGUMENTS

Follow `docs/TESTING.md`. Delegate the browser part to the `qa-verifier` agent if it helps, but you
own the conclusion. Steps:

1. `node tools/verify_page.js site` from the repository root. Compare every line with the values
   recorded in `docs/PROJECT_STATE.md` (section "Latest verification"). Hard failures: any
   `MISSING SIBLING`, duplicate MASTER names > 0, file not ending `</html>`, script errors > 0,
   Centricity Select keys in MASTER ≠ total. Any other moved count must be explained.
2. Start the preview (`preview_start` with the `playbook` configuration, or `node .claude/serve.js`)
   and load http://127.0.0.1:8080/ : console clean; Section 3 reads `Universe — N instruments.`
   with N = MASTER effective; the footer shows the `DATA_DATES` performance and analytics dates.
3. Core flow + exports + allocation round-trip + every Live Output tab, as listed in
   `docs/TESTING.md` §3. Save any exported files under `monthly-updates/<current month>/_review/`
   (never in the repository's tracked folders).
4. If the arguments contain `live`: download the six deploy files from the Pages URL in
   `docs/DEPLOYMENT.md` and compare SHA-256 with `site/`.

Report a table: check | PASS / FAIL / NOT RUN | evidence. Separate new regressions from the
pre-existing items in `docs/KNOWN_ISSUES.md`.

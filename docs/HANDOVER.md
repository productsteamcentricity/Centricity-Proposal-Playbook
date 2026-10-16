# Handover guide for a new maintainer

Read this first if you have never seen the project. It assumes no access to earlier conversations.

## 1. What you are taking over

- **Product:** the Centricity Investment Proposal Dashboard — a static page the Products team uses to
  build client proposals and export PowerPoint/Excel. Spec: [`PRD.md`](PRD.md).
- **Your job:** keep the data current every month, keep the site running, and make changes the owner
  (Centricity Products team) asks for — safely.
- **Shape:** `site/` is the whole product (six files that must ship together). `tools/` turns each
  month's workbooks into new data inside those files. `docs/` is the project's memory.

## 2. Day one (≈30 minutes)

1. Set up the machine: [`DEVELOPMENT_SETUP.md`](DEVELOPMENT_SETUP.md).
2. `node tools/verify_page.js site` — compare with [`PROJECT_STATE.md`](PROJECT_STATE.md).
3. `node .claude/serve.js`, open http://127.0.0.1:8080/, build a 4-fund proposal and export both files
   ([`TESTING.md`](TESTING.md) §3).
4. Read [`ARCHITECTURE.md`](ARCHITECTURE.md), then skim the **Traps** in
   [`OPERATING_MANUAL.md`](OPERATING_MANUAL.md) — they record every way production broke before.
5. Read the open items in [`KNOWN_ISSUES.md`](KNOWN_ISSUES.md) marked as affecting the next refresh.

## 3. The five things that matter most

1. **Six-file deploy.** `site/index.html` + five sibling scripts. Shipping one without the others
   silently reverts data. CI refuses a missing sibling, but not a stale one — commit them together.
2. **Never guess identities.** Fund renames, PMS pins, Reckoner names and allocation uploads are
   reported, not guessed. A wrong match puts another manager's numbers in a client deck.
3. **Scale.** Monthly Monitor returns are percent and are always divided by 100; MASTER stores decimals.
4. **Dry-run first.** Every tool writes only with `--apply`. Read the gates. Back up first.
5. **No fabricated data** in anything a client sees.

## 4. Where the business logic lives

All in `site/index.html`: helpers under `window.H` (KPIs, plan switch, look-through, credit buckets,
overlap, tenure, liquidity, name matching), parsers under `window.REFRESH`, exports under
`window.EXPORTS`. Formulas and rules: PRD §8. The tools reuse the page's own parsers, so a monthly
"bake" produces exactly what a browser upload would.

## 5. Data and where it comes from

Monthly workbooks from the desk and vendors (MF Monitor, analytics, expense/exit load, SIF monitor,
fund managers, risk ratios, market deck, PMS performance, the Reckoner deck…). They are sensitive and
never committed; they live in `monthly-updates/` on the owner's machine. Each refresh is recorded in
`docs/update-log/<YYYY-MM>_<Mon-YYYY>.md` with file names, as-on dates and SHA-256 fingerprints.
Specification: [`INPUT_FILES.md`](INPUT_FILES.md).

## 6. Making a change

Follow "How every change is made" in the root [`CLAUDE.md`](../CLAUDE.md): investigate → plan →
branch → smallest change → verify → update docs → PR → `verify` check → merge (publishes) → confirm
live. Releases: [`DEPLOYMENT.md`](DEPLOYMENT.md).

## 7. Accounts, access and secrets

- GitHub account `productsteamcentricity` owns the repo; Pages is configured to deploy from Actions.
- No API keys, credentials or environment variables are used by the project.
- The outgoing owner's public repo is `upstream` (read-only). It still contains, in its history, a
  spec with two client names; see `KNOWN_ISSUES.md` R1 (the owner should ask the outgoing owner to purge it).

## 8. Operational risks to keep in mind

| Risk | Mitigation |
|---|---|
| Stale or partial deploy | CI parity gate; commit all six files together; live-hash check after publish |
| Wrong fund identity after a vendor rename | rename-first workflow; tools refuse on ambiguity; owner decides |
| A tool's input layout changes (banner rows, renamed columns) | tools refuse on 0 joins / layout change; never force |
| Public repository exposes internal research | owner decision D60; revisit if content becomes more sensitive |
| OneDrive sync interfering with large files or git | keep the folder always-on-device; verify through Node |
| CDN outage | the page cannot load React; no mitigation in place (libraries are not self-hosted) |

## 9. Who to ask

Product questions, data-source questions and judgement calls go to the owner (Centricity Products
team). Questions about history before 14-Oct-2026: the outgoing owner, or `git log` and
[`DECISIONS.md`](DECISIONS.md).

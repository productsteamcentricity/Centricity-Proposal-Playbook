# Centricity Investment Proposal Dashboard ("Proposal Playbook")

An internal tool for the Centricity Products team to build forward-looking investment proposals for
HNI, UHNI and Family Office clients: set a corpus and risk profile, pick instruments from a universe
of ~7,700 (MF, Index, ETF, PMS, AIF, SIF, Bonds, MLD, FD, REIT/InvIT, GIFT City, Offshore, listed and
unlisted equity), allocate to 100%, review live analytics, and export a branded **PowerPoint** and
**Excel**.

**Live dashboard:** https://productsteamcentricity.github.io/Centricity-Proposal-Playbook/

> Share the link only inside the Products team / wealth organisation. The repository is public, so
> the fund universe and research content are readable by anyone who finds it (owner decision,
> `docs/DECISIONS.md` D60). It contains no client names or contact details; one historical spec in
> `docs/specs/` describes a sample client portfolio with names and figures removed
> (`docs/KNOWN_ISSUES.md` R1).

## Using the dashboard

1. Open the live link in Chrome or Edge (desktop).
2. Section 1 – set the corpus (₹ Cr or ₹ Lakhs); Section 2 – choose the risk profile.
3. Section 3 – pick instruments. The gold **★ Centricity Select** chip marks the house shortlist;
   click it for risk ratios and the shortlisting rationale.
4. Section 4 – set allocations. PMS / AIF minimum tickets are enforced (₹50 L PMS, ₹1 Cr AIF and
   Neo Yield Enhancer, ₹5 Cr Campus Fund). Downloads unlock at exactly 100% with no minimum breached.
5. Section 6 – nine live output tabs; download the full PowerPoint / Excel or a single slide.
6. The left rail (Data Refresh) lets you load a newer MF Monitor for **your session only**. Nothing
   you do is saved or shared; every page load starts from the same published data.

Data dates are shown in the footer ("Performance as on … & Analytics as on …").

## Monthly data refresh (for the owner)

1. Drop the month's source files into `monthly-updates/00_INBOX/` (list in that folder's README).
2. In Claude Code (opened on this folder), type `/monthly-update <Month YYYY>`, naming the month the
   data is *as on* (end-October data → `October 2026`). Most months need two runs: the MF files after
   month-end, then the Reckoner files later in the month.
3. Claude checks, updates, verifies, documents and publishes, then reports back.

Full process, responsibilities and file list: [`docs/MONTHLY_UPDATE_PROCESS.md`](docs/MONTHLY_UPDATE_PROCESS.md).

## Folder layout

```
site/              the dashboard (published to GitHub Pages) — six files must always ship together
tools/             monthly data-refresh tools (Node; dry-run by default)  · tools/lib/ shared libraries
docs/              all documentation — start at docs/README.md
.claude/           Claude Code agents, skills (/monthly-update, /verify-dashboard), local preview server
.github/workflows/ automatic verification + publishing
monthly-updates/   (local only, never pushed) 00_INBOX + one folder per data month
backups/           (local only) snapshots taken before each refresh
handover-archive/  (local only) the original handover files, unchanged
```

## For developers

No build step and no backend: `site/index.html` is a precompiled React 18 page with its data
embedded; five sibling scripts patch that data at load. Start with
[`docs/HANDOVER.md`](docs/HANDOVER.md), then [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) and
[`CLAUDE.md`](CLAUDE.md).

```bash
npm ci                              # Node >= 18; installs xlsx 0.18.5 for the tools
node tools/verify_page.js site      # in-browser counts and integrity checks
node .claude/serve.js               # http://127.0.0.1:8080/
```

Every change goes through a branch and pull request; the `verify` check must pass before `main`
publishes. See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

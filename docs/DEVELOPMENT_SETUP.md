# Development setup

How to get a working copy on a new machine. Verified on the owner's laptop on 16-Oct-2026
(Windows 11, Node 24.21.0, npm 11.19.0, Git 2.56, gh 2.102, Python 3.14.4).

## Prerequisites

| Need | Version | Why |
|---|---|---|
| Git | any recent | version control |
| Node.js | ≥ 18 (24.x in use) | the tools and the preview server |
| GitHub CLI `gh` | optional but used by Claude | pull requests, Pages, Actions |
| Microsoft PowerPoint (Windows) | 16 / Microsoft 365 | rendering Market Update / closing slides (COM) — only for slide refreshes |
| Python 3 + pandas, numpy, openpyxl, python-dateutil | optional | `tools/build_risk_matrix.py` (alternative risk-matrix route, not validated for production; production uses `merge_risk_matrix.js`, D43) |
| Internet | — | the page loads 5 CDN libraries |

No environment variables, secrets or API keys are needed. There is no `.env`.

## First-time setup

```bash
git clone https://github.com/productsteamcentricity/Centricity-Proposal-Playbook.git "Claude Code-Investment Proposal Dashboard"
cd "Claude Code-Investment Proposal Dashboard"
npm ci                                   # installs xlsx 0.18.5 exactly (from package-lock.json)
git remote add upstream https://github.com/magazineishita1108-boop/Centricity-Proposal-Playbook.git   # optional, read-only
git remote set-url --push upstream DISABLED-read-only-reference
node tools/verify_page.js site           # must match docs/PROJECT_STATE.md → Latest verification
node .claude/serve.js                    # open http://127.0.0.1:8080/
```

A fresh clone already contains the empty local-only folders' README files
(`monthly-updates/00_INBOX/`, `backups/`, `handover-archive/`). The historical source workbooks are
not in git; copy `monthly-updates/` from the previous machine (it is on OneDrive) if you need them.

Git settings used: `core.autocrlf=false` (global); `.gitattributes` enforces LF for text files.

## Working in Claude Code

Open the repository folder as the project. Claude Code then loads `CLAUDE.md`, the 8 agents in
`.claude/agents/` and the skills `/monthly-update` and `/verify-dashboard`. The preview configuration
`playbook` (`.claude/launch.json`) starts `.claude/serve.js` for the in-app browser.

## OneDrive notes

The workspace lives in a OneDrive-synced folder. This works, with two precautions:
- Keep the folder "Always keep on this device" so OneDrive never replaces files with online-only
  placeholders (tools read 12 MB files and large workbooks).
- If a large file looks stale in one tool, verify through Node on the real path
  (`node tools/verify_page.js site`) before acting; avoid running git while OneDrive shows a sync conflict.

## Common problems

| Symptom | Cause / fix |
|---|---|
| `Cannot find module 'xlsx'` | run `npm ci` in the repo root |
| A tool exits 2 (usually with `Usage:`; a bad `--as-on` in `bake_month`/`merge_analytics` prints only a `***` line) | a required argument is missing, a flag is misspelt or unknown, an `--as-on` label is not a plain date, or an input or `--html` path does not exist (`*** source not found` / `*** page not found`: a typo, or an invisible character such as the May-2026 soft hyphen) — fix the command or rename the file |
| A dry run exits 1 | a gate failed: read the `GATE … *** FAIL` lines; nothing was written (`tools/README.md` §1) |
| Preview shows "Not found: /index.html" | `site/index.html` is missing or an online-only OneDrive placeholder; restore it (`git status`, "Always keep on this device"). The server always serves the `site/` folder next to `.claude/`, whatever the current folder |
| Page blank, console "React is not defined" | no internet / CDN blocked |
| `verify_page.js` reports 0 script errors but the browser console shows an error | it runs the page in a Node vm without a DOM or the CDN libraries, so browser-only errors do not show there — always load the page in the browser too (`KNOWN_ISSUES.md` A23) |
| A write fails with `EPERM` | OneDrive was syncing the file (`KNOWN_ISSUES.md` R6); the atomic write left that file untouched, but a two-file tool may already have written its other file: check against the backup (`tools/README.md` §1 rule 4), then re-run the step |
| `Filename too long` from git in temp folders | use a short path, or `git -c core.longpaths=true` |

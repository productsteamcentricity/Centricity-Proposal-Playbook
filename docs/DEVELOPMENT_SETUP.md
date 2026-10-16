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
| Python 3 + pandas, numpy, openpyxl, python-dateutil | optional | `tools/build_risk_matrix.py` (canonical risk-matrix route; not yet validated on pandas 3.x) |
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
| A tool says `Usage:` and exits 2 | a required argument is missing, or the input path contains an invisible character (e.g. the May-2026 soft hyphen) — rename the file |
| Preview shows "Not found: /index.html" | `site/index.html` is missing or an online-only OneDrive placeholder; restore it (`git status`, "Always keep on this device"). The server always serves the `site/` folder next to `.claude/`, whatever the current folder |
| Page blank, console "React is not defined" | no internet / CDN blocked |
| `verify_page.js` reports 0 script errors but the browser console shows a ReferenceError | its filter hides every "… is not defined" error (the CDN globals), which also hides a real typo — always load the page in the browser too (`KNOWN_ISSUES.md` A23) |
| `Filename too long` from git in temp folders | use a short path, or `git -c core.longpaths=true` |

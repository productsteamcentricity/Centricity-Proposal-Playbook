# Deployment and GitHub workflow

## Where things live

| What | Where |
|---|---|
| Repository (primary) | https://github.com/productsteamcentricity/Centricity-Proposal-Playbook — **public** (D60) |
| Live dashboard | https://productsteamcentricity.github.io/Centricity-Proposal-Playbook/ |
| Pages source | GitHub Actions (`.github/workflows/pages.yml`) publishing the `site/` folder of `main` |
| Outgoing owner's repo / site | https://github.com/magazineishita1108-boop/Centricity-Proposal-Playbook — remote `upstream`, read-only (push URL disabled). Its Pages site still serves the 30-Sep-2026 baseline until the outgoing owner retires it. |

## How a release works

```
branch (data/<YYYY-MM> | feat/… | fix/… | docs/… | chore/…)
   │ commit (stage files explicitly; all six site/ deploy files together when any changed)
   ▼
pull request ──► "verify" job: six files present + verify_page parity gate (also runs on push to main / manual run)
   │ green
   ▼
merge to main ──► "verify" again ──► "publish": upload-pages-artifact (site/) ──► deploy-pages
   ▼
confirm: SHA-256 of the six files on the live URL == site/
```

- `main` is production: anything merged there is published within ~1–2 minutes.
- Pull requests are used for every change, including monthly refreshes. Monthly refreshes are merged
  automatically once every check passes and no judgement call is open (D61).
- Never force-push `main`, rewrite published history or bypass a failing check.
- Rollback: `git revert -m 1 <merge commit>` on a branch → PR → merge (`-m 1` keeps `main`'s side of
  the merge). Pages republishes the previous state.
  For a mid-refresh mistake before committing, restore the six files from `backups/<snapshot>/`.

## Commit and PR conventions

- Subject in the imperative, ≤ 72 characters; body says what changed and why, and for data refreshes
  the as-on dates and headline count changes.
- End commits with the `Co-Authored-By` trailer the session specifies; PR descriptions end with the
  Claude Code attribution line.
- PR description: summary, verification evidence (verify_page before/after, browser checks), risks.

## Checking the live site

```bash
B=https://productsteamcentricity.github.io/Centricity-Proposal-Playbook
for f in index.html Centricity_ExtraSlides.js Centricity_PMS_AIF_Terms.js Centricity_June_Refresh.js Centricity_IRR_Offshore.js Centricity_SIF_Refresh.js; do
  curl -s --compressed "$B/$f" | sha256sum | cut -c1-16; sha256sum "site/$f" | cut -c1-16; done
```
Each pair must match. `index.html` is 12.8 MB; allow a minute.

## One-time GitHub configuration (done 16-Oct-2026)

- Repository created public under `productsteamcentricity`; wiki disabled.
- Pages: build type **GitHub Actions** (`gh api -X POST repos/productsteamcentricity/Centricity-Proposal-Playbook/pages -f build_type=workflow`).
- Tag `handover-baseline` marks the migrated baseline (upstream `72e1f1e`).
- Environment `github-pages`: deployments allowed only from `main` (custom branch policy; check with
  `gh api repos/productsteamcentricity/Centricity-Proposal-Playbook/environments/github-pages/deployment-branch-policies`).
- Workflow token read-only by default; only the publish job gets Pages/OIDC write; actions pinned to
  commit SHAs (update them deliberately, e.g. when GitHub deprecates a major version).
- Branch protection is not configured (a free public repo supports it; enabling "require the verify
  check" on `main` is a recommended follow-up — owner decision).

## Visibility

The repository and site are public by the owner's decision (D60): the fund universe, Select
rationales, PMS/AIF terms and IRR bands are readable by anyone. `site/robots.txt` does not hide a
project Pages site (crawlers read robots.txt only at the domain root). To make the code private later,
the account needs GitHub Pro (Pages from a private repo is still a public site) or the six files must
move to an internal host.

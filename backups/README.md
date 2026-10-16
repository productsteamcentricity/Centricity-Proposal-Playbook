# backups/ (local only)

Snapshots of the six deploy files, taken **before** any tool is run with `--apply`. Only this README
is pushed to GitHub.

One folder per snapshot, named `<YYYY-MM-DD>_<tag>`, for example `2026-11-06_pre-2026-10-refresh/`,
holding copies of:

```
site/index.html
site/Centricity_ExtraSlides.js
site/Centricity_PMS_AIF_Terms.js
site/Centricity_June_Refresh.js
site/Centricity_IRR_Offshore.js
site/Centricity_SIF_Refresh.js
```

Why keep these when git has history? A refresh runs a dozen tools in sequence, and a bad `--apply`
half-way through is easiest to undo by copying the six files back. Once a refresh is committed and
published, git is the long-term record, so snapshots older than about three months can be deleted.

Restore (from the repository root):

```bash
cp backups/<snapshot>/* site/
node tools/verify_page.js site
```

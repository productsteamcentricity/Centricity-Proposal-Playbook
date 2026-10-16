# monthly-updates/ (local only)

The source workbooks and decks that feed the dashboard. **Nothing in this folder is ever pushed to
GitHub** except the two README files: the data is sensitive and licensed. (It does sync to the
company OneDrive, because the project folder lives there.)

```
monthly-updates/
├── 00_INBOX/                 ← you drop the new month's files here (see 00_INBOX/README.md)
├── 2026-04_Apr-2026/         ← one folder per data month, archived after processing
├── …
├── 2026-09_Sep-2026/
│   ├── Daily MF monitor_30th Sep 2026.xlsx          (monitors and other files at the top level)
│   ├── …
│   ├── Analytics/                                   (Equity / Hybrid / Debt Analytics + DE universe)
│   └── _review/                                     (created by Claude: every tool's dry-run and
│                                                     apply output, verify before/after)
└── _handover_manifest.json   ← SHA-256 of every file extracted from the handover zip
```

Rules (Claude follows these; listed so anyone can check):

- A month folder is named by the **data** month (the "as on" date), `YYYY-MM_Mon-YYYY`. A deck that
  ships in November with October data goes in `2026-10_Oct-2026`.
- `tools/bake_month.js` expects the two MF Monitors at the top of the month folder and the
  Equity / Hybrid / Debt Analytics workbooks in its `Analytics/` subfolder, so Claude files them that
  way when moving them out of the inbox.
- Files are kept under their original names. The update log in
  `docs/update-log/<YYYY-MM>_<Mon-YYYY>.md`
  (which is on GitHub) records each file's name, as-on date and SHA-256, so the exact inputs of every
  published update can be proven later without publishing the files themselves.
- `2026-04` … `2026-09` came from the outgoing owner's handover zip (`handover-archive/`). The April
  folder is the initial-build pack, not a standard monthly set. Gaps in those months are listed in
  `docs/INPUT_FILES.md`.

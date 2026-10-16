# handover-archive/ (local only, read-only)

Everything the outgoing owner handed over, kept **exactly as received** (14 Oct 2026). Nothing in
this folder is used by the dashboard or the tools. Only this README is pushed to GitHub; the files
themselves stay on this machine (they contain the sensitive monthly source workbooks).

Do not edit, rename or delete these files. Working copies live elsewhere:

| File | SHA-256 | Working copy |
|---|---|---|
| `Centricity-Proposal-Playbook-main (1).zip` (5.1 MB, 46 files) | `8eefd5b5f393f5ec3aee2724a1b0357be6a5c3e1f7b5efa89e990d2760e21fd3` | The git repository itself. Its 46 files are byte-identical to upstream `main` at `72e1f1e`. Our tag `handover-baseline` (`862e40b`, sanitised) matches 45 of them; `Portfolio_Review_Build_Prompt.md` differs only by the client-name redaction (D64). |
| `For Centricity Proposal Playbook Portal.zip` (216 MB, 81 files) | `70bf5752ac41b37db47e6510e09c5a91fd7068d4684d785cfe54da79d70d0c2e` | `monthly-updates/2026-04_Apr-2026` … `2026-09_Sep-2026`. The extraction is verified file by file in `monthly-updates/_handover_manifest.json`. |
| `HANDOVER_PRD_Centricity_Proposal.md` | `3f243e4deb38ff8bc62ec893bf5bf7e434e443d6235ebc4424ae08298633d1f5` | `docs/PRD.md` (committed copy, with a note on the post-transfer folder layout). |

To prove a zip is unchanged: `sha256sum "handover-archive/<file>"` and compare with the table.

# Documentation map

Start with the document for your question. Each fact lives in one place; others link to it.

| I want to… | Read |
|---|---|
| Understand where the project stands right now | [`PROJECT_STATE.md`](PROJECT_STATE.md) |
| Run or understand the monthly data refresh (owner and operator) | [`MONTHLY_UPDATE_PROCESS.md`](MONTHLY_UPDATE_PROCESS.md) |
| Know which source files are needed and how to recognise them | [`INPUT_FILES.md`](INPUT_FILES.md) |
| Run a specific tool | [`../tools/README.md`](../tools/README.md) |
| Take over the project as a new developer | [`HANDOVER.md`](HANDOVER.md) |
| Take over as the project's Moderator chat, or hand a chat over to a successor | [`handover/README.md`](handover/README.md) (current package, bootstrap and successor prompts) |
| See which chat owns which task or file, open decisions, the task and requirements registers | [`project-control/README.md`](project-control/README.md) |
| Understand how the system is built | [`ARCHITECTURE.md`](ARCHITECTURE.md) |
| Know exactly what the product does (features, formulas, outputs, design) | [`PRD.md`](PRD.md) — the handover product spec |
| Avoid the traps that have broken production before | [`OPERATING_MANUAL.md`](OPERATING_MANUAL.md) → Traps (the outgoing owner's detailed manual) |
| Set up a machine | [`DEVELOPMENT_SETUP.md`](DEVELOPMENT_SETUP.md) |
| Test or verify a change | [`TESTING.md`](TESTING.md) |
| Release / publish, GitHub conventions | [`DEPLOYMENT.md`](DEPLOYMENT.md) |
| Know why something is the way it is | [`DECISIONS.md`](DECISIONS.md) |
| See known defects, gaps and risks | [`KNOWN_ISSUES.md`](KNOWN_ISSUES.md) |
| See what changed and when | [`../CHANGELOG.md`](../CHANGELOG.md), [`update-log/`](update-log/) (one file per data month) |
| See how the transfer was done and verified | [`REPLICATION_REPORT.md`](REPLICATION_REPORT.md) |

Other folders:

- `runbooks/` — the outgoing owner's prompt-style runbooks for the risk matrix and PMS performance.
  Superseded in places by the tools; the tool route is in `tools/README.md`.
- `specs/` — build specifications: the analytics engine (`Equity_Debt_Analytics_Build_Prompt.md`,
  diverged from the code in places) and the sister **Portfolio Review** dashboard (a separate
  project; client names redacted).
- `archive/` — superseded files kept for reference (the original README, the applied
  issuer-normalisation fix spec, and the unloaded 30-Jun-2026 `Centricity_Risk_Matrix.js`, moved out
  of `site/` on 19-Oct-2026, D78).
- `update-log/` — the record of every data refresh: inputs (name, as-on, SHA-256), steps, gate
  outcomes, count changes and reasons.
- `handover/` — handover packages between chats (dated, versioned; `README.md` says which is
  authoritative), the Moderator bootstrap prompt, templates, `continuations/` (successor prompts), and the
  material for completing the transfer from the outgoing owner (`DATA_EXTRACTION_PROMPT.md`).
- `project-control/` — the multi-chat registers: chats, tasks, requirements, open decisions, active
  changes and file ownership, integration log, interfaces, dependency map, repository state.

Conventions: exact dates (16-Oct-2026); code references as `path:line` (line numbers into
`site/index.html` drift — re-derive with Grep); facts are verified against the code, and where a
document and the code disagree, the code wins.

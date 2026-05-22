# AIOps Incident-Triage Agent

An autonomous agent that triages incidents: when a monitoring alert or error
log fires a webhook, the agent investigates by querying logs, searching
runbooks via RAG, and checking recent git commits, then drafts a root-cause
hypothesis and opens a GitHub issue. Memory tracks recurring incidents.

Stack: n8n (native AI Agent node) · OpenAI (gpt-4o-mini + embeddings) ·
Supabase (Postgres + pgvector) · GitHub Actions.

## Architecture
_Diagram added in Phase 10._

## Phase checklist
- [x] Phase 0 — Environment & repo
- [x] Phase 1 — Cloud database & schema
- [x] Phase 2 — Webhook → respond slice
- [ ] Phase 3 — Tool calling: query logs
- [ ] Phase 4 — RAG: search runbooks
- [ ] Phase 5 — Git context tool
- [ ] Phase 6 — Structured output
- [ ] Phase 7 — Memory & recurrence
- [ ] Phase 8 — Open GitHub issue (gated)
- [ ] Phase 9 — CI/CD
- [ ] Phase 10 — Polish & extras

## Repo layout
- `workflows/` — exported n8n workflow JSON
- `db/schema.sql` — Supabase schema (tables, pgvector, functions)
- `code/` — tested custom logic (normalizer, fingerprint)
- `.github/workflows/ci.yml` — CI pipeline
- `docs/` — runbooks and notes

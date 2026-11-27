<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Content storage

- Turso is the authoritative store for terms, guides, drafts, published content, taxonomy, revision history, and checkpoints.
- Local development and the deployed service must read and write the DB server. Use the existing ignored `.env.local` connection settings; never print credentials.
- Do not edit `data/ui-notes.sqlite` for content changes and do not copy its snapshots over the DB server. SQLite files are retained as historical migration material.
- An isolated SQLite file explicitly provided through `UI_NOTES_DB_PATH` is allowed for tests and explicitly requested migration work only.
- Do not silently fall back to local SQLite when server connection settings are missing.

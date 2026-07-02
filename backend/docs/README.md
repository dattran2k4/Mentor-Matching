# Backend Docs

These docs are intentionally short working notes for Codex threads and team members. They should reduce repeated context, not become a textbook.

## Recommended Reading By Task

For any backend thread:

1. Read `../../AGENTS.md`.
2. Read `backend-context.md`.
3. Read the focused doc for the task.

## Files

- `backend-context.md`: current backend stack, structure, and active direction.
- `architecture-guide.md`: Clean Architecture and module boundary rules.
- `feature-workflow.md`: recommended order for implementing features.
- `database-notes.md`: DBML, Flyway, enum, and schema conventions.
- `module-map.md`: current modules and implemented feature summary.
- `payment-stripe.md`: Stripe Checkout and webhook context.
- `media-upload.md`: media asset model and upload intent/confirm flow.
- `team-conventions.md`: branch, commit, PR, and review conventions.

## API Source Of Truth

Endpoint details should come from controllers and Swagger UI, not from a manually maintained endpoint list. This keeps docs stable as features evolve.

## Important Reminder

If the user asks only for investigation, explanation, or advice, do not edit files. Editing is expected only when the user asks to implement, refactor, create, update, or fix.

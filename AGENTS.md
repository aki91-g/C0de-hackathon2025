# Repository Guidelines

## Project Structure & Module Organization
- `frontend/` hosts the Next.js 16 + TypeScript app. Pages and layouts live under `frontend/src/app`, shared styles in `frontend/src/app/globals.css`, and static assets in `frontend/public`. Config files (`next.config.ts`, `tsconfig.json`, `biome.json`, PostCSS/Tailwind) sit alongside `package.json` for quick reference.
- `back/` contains the Python 3.14 service. `main.py` is the current entry point; place reusable modules inside `back/src/` and surface them through `python -m back.<module>` so tests can import them.
- `.devcontainer/` defines the VS Code container stack. `setup.sh` bootstraps uv for Python and Volta/Corepack for Node, so rerun it if dependencies drift.

## Build, Test, and Development Commands
- `cd frontend && npm run dev` – Next.js dev server at http://localhost:3000.
- `cd frontend && npm run build` – Production build plus type checks; run before every PR.
- `cd frontend && npm run start` – Serves the `.next` output for smoke tests.
- `cd frontend && npm run lint` / `npm run format` – Biome linting and formatting; fixes must be committed.
- `cd back && python main.py` – Executes the current Python entry point; replace with a CLI once business logic lands.

## Coding Style & Naming Conventions
- TypeScript uses 2-space indentation, React function components in PascalCase, hooks prefixed with `use`, and files in kebab-case (e.g., `team-card.tsx`). CSS modules or Tailwind utility classes should live near the component that consumes them.
- Python follows PEP 8 (4-space indent, snake_case modules/functions). Prefer type hints so future tooling (mypy/pyright) can enforce contracts.
- Biome enforces formatting/linting for the frontend; mirror its decisions rather than fighting them. Add a matching formatter (e.g., Ruff) before expanding backend logic.

## Testing Guidelines
- A formal suite is not yet committed. Frontend contributions should introduce React Testing Library or Playwright specs under `frontend/src/__tests__/` and wire them to `npm test`; backend code should land with `pytest` cases in `back/tests/`. Target ≥80% line coverage once the first substantial feature lands.
- Name spec files after the unit (`component.spec.tsx`, `test_service.py`) and keep fixtures colocated with the tests for clarity.

## Commit & Pull Request Guidelines
- Recent history uses short descriptive commits; continue with present-tense, ≤72-character subjects (e.g., `frontend: add hero section`). Group related file changes per commit and include body details only when rationales matter.
- PRs must describe the change, list manual/automated test evidence, and link the tracking issue. Include screenshots or terminal output whenever UI or CLI behavior shifts, and mention any follow-up work needed.

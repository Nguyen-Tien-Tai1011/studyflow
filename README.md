# StudyFlow — Smart Study Tracker

A responsive Next.js App Router MVP with a working study workspace and a separate product landing page. Built with TypeScript, React, Tailwind CSS, Lucide, and locally bundled Inter.

## Run locally

Use Node.js 24.15.0 or newer within 24.x (also specified in `.nvmrc`) and npm. Local development and CI use the same Node major; the test environment requires at least 24.15.0.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. The dashboard is `/`; the landing page is `/welcome`.

```sh
npm run typecheck
npm run lint
npm run test:run
npm run build
npm start
```

The production build exports static files to `out/`. The included small preview server supports exported routes. `PORT=3001` can select a different port when the development server is running.

On Windows PowerShell, use `$env:PORT = '3001'` in a separate terminal before `npm start`. The browser stores separate data for each origin: `localhost:3000` and `localhost:3001` do not share localStorage.

## Development workflow and checks

- [Quy trình làm việc, Git, backlog và kế hoạch 4 tuần](docs/WORKFLOW.md)
- [Quy tắc dành cho AI](AGENTS.md); `CLAUDE.md` points to the same rules.
- `npm run test` runs Vitest in watch mode; `npm run test:run` runs it once.
- `npm run check` runs typecheck, lint, tests and the production build.
- `npm run typecheck` first runs `next typegen`, so route types are available on a fresh checkout before TypeScript runs.
- GitHub Actions in `.github/workflows/ci.yml` runs these checks on pull requests targeting `main` and pushes to `main`; it also supports manual runs. The workflow must be pushed to GitHub before hosted CI can run.
- Tests cover subject normalization, recent subjects, storage migration/recovery, provider persistence, Remove/Undo, the Add Task selector, and timer completion/pause behavior. jsdom does not verify visual layout; check desktop/mobile and keyboard behavior in a browser as well.

## Included workflows

- Dashboard: daily plan, task completion, Add Task, Remove/Undo, four overview metrics, and weekly activity.
- Add Task subjects: searchable keyboard-accessible selector, 17 suggested categories, specific subject suggestions, five recent subjects, and reusable custom subjects with normalized duplicate detection.
- Subjects: searchable curriculum cards, lesson progress, recorded study time, and a focus-session entry point.
- Focus timer: 25-minute Pomodoro, 5/15-minute breaks, and Custom study sessions from 1–180 whole minutes. Choose Custom, enter minutes and Apply before starting; reset before changing an ongoing or paused session's duration. Supports pause/resume/reset, early save after a minute, and automatic completed-session recording using the selected duration. The countdown and applied custom duration continue across workspace navigation. Reloading starts a fresh timer with default settings; completed sessions remain saved.
- Sessions: searchable history with subject filtering.
- Progress: weekly chart, subject progress, contextual guidance, and achievements.
- Goals: editable targets/progress and upcoming tasks.
- Responsive navigation, page search, notification panel, keyboard focus states, reduced-motion support, and empty states.

## Data and architecture

`types/index.ts` defines User, Subject, Task, StudySession, Goal, and Achievement entities. Subject IDs are shared across tasks and sessions. `data/mockData.ts` owns the illustrative dataset; `components/dashboard/study-provider.tsx` owns data actions and browser persistence. Replace those actions with a repository/API adapter when adding a backend. Components consume typed data rather than making direct backend calls.

Tasks, completed sessions, goals, subjects and recent subject IDs are stored under `studyflow-v1` in localStorage, with validation and migration for the original format. There is no authentication, backend, or cross-device synchronization. Sample historical metrics, streaks, lessons, and some achievements are illustrative, not a complete event-derived history. Weekly activity includes the sample baseline plus newly recorded sessions; editable goals can be adjusted independently. The UI labels sample baselines and demo testimonials.

Use **Your profile → Export study data** to download a JSON backup. If saved data is malformed or incompatible, the app preserves the original value and disables autosave for that visit; a persistent banner offers the exact original bytes and a backup of the temporary workspace. If storage is unavailable or full, changes remain in memory and the banner recommends exporting before closing. There is no automatic file-import UI yet. Keep recovery files until they can be inspected and restored; do not clear browser data as a recovery step.

`use-focus-timer.ts` owns timer behavior in the workspace provider, so route changes do not interrupt a running timer. Experimental, feature-detected WebMCP tools expose reading tasks and changing their completion state; normal browsers need no additional support.

## Project map

- `app/(workspace)/`: dashboard, subjects, sessions, progress, goals routes.
- `app/welcome/`: product landing page.
- `components/layout/`: shared navigation and footer.
- `components/dashboard/`: reusable study components, provider, and timer hook.
- `components/landing/`: marketing page sections.
- `components/ui/`: logo, subject icons, progress bars, and section headings.
- `data/`: typed sample study data and marketing content.
- `data/subject-catalog.ts`: categories, suggestions, name normalization, and recent-subject helpers.
- `utils/`: date/duration formatting, storage migration and backup downloads.
- `tests/`: unit and component integration tests with Vitest/React Testing Library.
- `docs/`: workflow and known dependency security status.
- `scripts/serve.mjs`: dependency-free static production preview.

## Image credits

Photos load remotely from Unsplash. Portraits illustrate fictional testimonials; pictured people are not represented as actual users.

- [Ashutosh Gupta — focused student](https://unsplash.com/photos/focused-student-studying-at-a-library-table-with-a-laptop-NASjMHJ9OhI)
- [Baylee Gramling — portrait](https://unsplash.com/photos/smiling-woman-during-day-RnHhR_sip7M)
- [Andre Tan — portrait](https://unsplash.com/photos/smiling-man-nX0mSJ999Og)
- [Antonino Visalli — portrait](https://unsplash.com/photos/smiling-woman-lPeQHVXv1XE)

## Dependency note

The audit on 2026-10-06 found five high-severity reports in the ESLint tool chain, rooted in `braces` (GHSA-vfj7-8cjw-p6xm). No patched `braces` version was available in the advisory or registry at that check. The audit's proposed fix downgrades the Next.js ESLint configuration across major versions and was not applied. These development dependencies are not shipped in the static export but still affect build/lint tooling. See [the dependency security record](docs/DEPENDENCY-SECURITY.md) for scope, mitigations and the follow-up procedure.

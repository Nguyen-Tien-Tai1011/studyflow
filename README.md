# StudyFlow — Smart Study Tracker

A responsive Next.js App Router MVP with a working study workspace and a separate product landing page. Built with TypeScript, React, Tailwind CSS, Lucide, and locally bundled Inter.

## Run locally

Requires Node.js 20.9 or newer.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. The dashboard is `/`; the landing page is `/welcome`.

```sh
npm run typecheck
npm run lint
npm run build
npm start
```

The production build exports static files to `out/`. The included small preview server supports exported routes. `PORT=3001` can select a different port when the development server is running.

## Included workflows

- Dashboard: daily plan, task completion, add-task form, four overview metrics, and weekly activity.
- Subjects: searchable curriculum cards, lesson progress, recorded study time, and a focus-session entry point.
- Focus timer: 25-minute Pomodoro, 5/15-minute breaks, pause/resume/reset, early save after a minute, and automatic completed-session recording. The countdown uses a wall-clock deadline and continues across workspace navigation. Reloading starts a fresh timer; completed sessions remain saved.
- Sessions: searchable history with subject filtering.
- Progress: weekly chart, subject progress, contextual guidance, and achievements.
- Goals: editable targets/progress and upcoming tasks.
- Responsive navigation, page search, notification panel, keyboard focus states, reduced-motion support, and empty states.

## Data and architecture

`types/index.ts` defines User, Subject, Task, StudySession, Goal, and Achievement entities. Subject IDs are shared across tasks and sessions. `data/mockData.ts` owns the illustrative dataset; `components/dashboard/study-provider.tsx` owns data actions and browser persistence. Replace those actions with a repository/API adapter when adding a backend. Components consume typed data rather than making direct backend calls.

Tasks, completed sessions, and goals are stored under `studyflow-v1` in localStorage, with shape validation and storage-error feedback. There is no authentication, backend, or cross-device synchronization. Sample historical metrics, streaks, lessons, and some achievements are illustrative, not a complete event-derived history. Weekly activity includes the sample baseline plus newly recorded sessions; editable goals can be adjusted independently. The UI labels sample baselines and demo testimonials.

`use-focus-timer.ts` owns timer behavior in the workspace provider, so route changes do not interrupt a running timer. Experimental, feature-detected WebMCP tools expose reading tasks and changing their completion state; normal browsers need no additional support.

## Project map

- `app/(workspace)/`: dashboard, subjects, sessions, progress, goals routes.
- `app/welcome/`: product landing page.
- `components/layout/`: shared navigation and footer.
- `components/dashboard/`: reusable study components, provider, and timer hook.
- `components/landing/`: marketing page sections.
- `components/ui/`: logo, subject icons, progress bars, and section headings.
- `data/`: typed sample study data and marketing content.
- `utils/`: date and duration formatting.
- `scripts/serve.mjs`: dependency-free static production preview.

## Image credits

Photos load remotely from Unsplash. Portraits illustrate fictional testimonials; pictured people are not represented as actual users.

- [Ashutosh Gupta — focused student](https://unsplash.com/photos/focused-student-studying-at-a-library-table-with-a-laptop-NASjMHJ9OhI)
- [Baylee Gramling — portrait](https://unsplash.com/photos/smiling-woman-during-day-RnHhR_sip7M)
- [Andre Tan — portrait](https://unsplash.com/photos/smiling-man-nX0mSJ999Og)
- [Antonino Visalli — portrait](https://unsplash.com/photos/smiling-woman-lPeQHVXv1XE)

## Dependency note

The initial audit found a braces stack-exhaustion advisory in the ESLint-only tool chain (five transitive high-severity reports). The audit's proposed fix downgrades the Next.js ESLint configuration across major versions and is not applied automatically. These development dependencies are not shipped in the static export. Review upstream patched releases before adopting this starter for a hosted build service that accepts untrusted glob patterns.

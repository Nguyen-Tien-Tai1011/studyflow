import { Overview } from "./overview";
import { Subjects } from "./subjects";
import { ProgressOverview, Achievements } from "./progress";
import { StudyGoals, UpcomingTasks } from "./goals";
import { RecentSessions } from "./recent-sessions";
export function Dashboard() {
  return (
    <>
      <Overview />
      <Subjects preview />
      <div className="dashboard-secondary-grid">
        <ProgressOverview />
        <StudyGoals />
        <UpcomingTasks />
      </div>
      <RecentSessions />
      <Achievements />
    </>
  );
}

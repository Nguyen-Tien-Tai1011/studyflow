import { StudyGoals, UpcomingTasks } from "@/components/dashboard/goals";
export default function GoalsPage() {
  return (
    <>
      <div className="route-heading">
        <span className="eyebrow">PROGRESS WITH PURPOSE</span>
        <h1>A little intention goes a long way.</h1>
        <p>Set a pace that works for you. Adjust your goals as life changes.</p>
      </div>
      <div className="goals-layout">
        <StudyGoals editable />
        <UpcomingTasks expanded />
      </div>
    </>
  );
}

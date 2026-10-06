import { WeeklyActivity } from "@/components/dashboard/overview";
import {
  ProgressOverview,
  Achievements,
} from "@/components/dashboard/progress";
export default function ProgressPage() {
  return (
    <>
      <div className="route-heading">
        <span className="eyebrow">THE BIGGER PICTURE</span>
        <h1>Look how far you’ve come.</h1>
        <p>
          Understand your study rhythm and find your next opportunity to grow.
        </p>
      </div>
      <div className="progress-layout">
        <WeeklyActivity />
        <ProgressOverview />
      </div>
      <Achievements />
      <div className="insight-banner">
        <div>
          <strong>Give Calculus a little attention this week.</strong>
          <p>
            Try two short review sessions to build confidence with derivatives.
          </p>
        </div>
      </div>
    </>
  );
}

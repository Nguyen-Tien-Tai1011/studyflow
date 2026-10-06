import { RecentSessions } from "@/components/dashboard/recent-sessions";
import { StudyTimer } from "@/components/dashboard/study-timer";
export default function SessionsPage() {
  return (
    <>
      <div className="route-heading">
        <span className="eyebrow">TIME WELL SPENT</span>
        <h1>Find your focus.</h1>
        <p>One distraction-free session can make all the difference.</p>
      </div>
      <div className="sessions-layout">
        <RecentSessions full />
        <StudyTimer />
      </div>
    </>
  );
}

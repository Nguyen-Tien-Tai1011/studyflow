import { Subjects } from "@/components/dashboard/subjects";
export default function SubjectsPage() {
  return (
    <>
      <div className="route-heading">
        <span className="eyebrow">YOUR PERSONAL CURRICULUM</span>
        <h1>Make room for curiosity.</h1>
        <p>Four subjects. One place to keep your learning moving.</p>
      </div>
      <Subjects />
    </>
  );
}

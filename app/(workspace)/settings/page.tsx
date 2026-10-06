import type { Metadata } from "next";
import { ThemeSettings } from "@/components/theme/theme-settings";
export const metadata: Metadata = { title: "Cài đặt — StudyFlow" };
export default function SettingsPage() {
  return (
    <>
      <div className="route-heading">
        <span className="eyebrow">STUDYFLOW</span>
        <h1>Cài đặt</h1>
        <p>Điều chỉnh không gian học theo sở thích của bạn.</p>
      </div>
      <ThemeSettings />
    </>
  );
}

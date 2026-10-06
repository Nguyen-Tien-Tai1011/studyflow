"use client";
import { ThemeChoices } from "./theme-switcher";
import { useTheme } from "./theme-provider";

export function ThemeSettings() {
  const { ready, resolved, storageError } = useTheme();
  return (
    <section
      className="panel theme-settings"
      aria-labelledby="appearance-heading"
    >
      <h2 id="appearance-heading">Giao diện</h2>
      <p>
        Chọn màu nền phù hợp với bạn. Theo hệ thống sẽ tự đổi theo cài đặt của
        máy.
      </p>
      <ThemeChoices />
      <p role="status">
        {ready
          ? `Đang hiển thị: ${resolved === "dark" ? "Tối" : "Sáng"}.`
          : "Đang đọc cài đặt giao diện…"}
      </p>
      {storageError && (
        <p role="alert">
          Trình duyệt không cho lưu lựa chọn. Giao diện vẫn áp dụng trong phiên
          này.
        </p>
      )}
    </section>
  );
}

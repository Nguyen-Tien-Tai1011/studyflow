import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { themeInitScript } from "@/utils/theme";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/800.css";
import "./globals.css";
export const metadata: Metadata = {
  title: "StudyFlow — Smart Study Tracker",
  description:
    "Organize your learning, find your focus, and build a study routine that lasts.",
  icons: { icon: "/favicon.svg" },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

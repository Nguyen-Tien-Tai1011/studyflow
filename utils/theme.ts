export const THEME_STORAGE_KEY = "studyflow-theme";
export const DARK_MEDIA_QUERY = "(prefers-color-scheme: dark)";
export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export function parseTheme(value: unknown): ThemePreference {
  return value === "light" || value === "dark" ? value : "system";
}

export function resolveTheme(
  preference: ThemePreference,
  systemDark: boolean,
): ResolvedTheme {
  return preference === "system" ? (systemDark ? "dark" : "light") : preference;
}

// Static source only: runs during HTML parsing, before React or page content.
// Keep its preference validation in sync with parseTheme (covered by tests).
export const themeInitScript = `(function(){
  var preference="system";
  try{var saved=localStorage.getItem("${THEME_STORAGE_KEY}");if(saved==="light"||saved==="dark")preference=saved;}catch(e){}
  var dark=false;
  try{dark=window.matchMedia("${DARK_MEDIA_QUERY}").matches;}catch(e){}
  var theme=preference==="system"?(dark?"dark":"light"):preference;
  document.documentElement.dataset.theme=theme;
  document.documentElement.style.colorScheme=theme;
})();`;

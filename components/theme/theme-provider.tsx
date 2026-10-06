"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  DARK_MEDIA_QUERY,
  parseTheme,
  resolveTheme,
  THEME_STORAGE_KEY,
  type ThemePreference,
  type ResolvedTheme,
} from "@/utils/theme";

type ThemeContextValue = {
  preference: ThemePreference;
  resolved: ResolvedTheme;
  ready: boolean;
  storageError: boolean;
  setTheme: (value: ThemePreference) => void;
};
const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [preference, setPreference] = useState<ThemePreference>("system");
  const [resolved, setResolved] = useState<ResolvedTheme>("light");
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const preferenceRef = useRef<ThemePreference>("system");
  const mediaRef = useRef<MediaQueryList | null>(null);

  const apply = useCallback((value: ThemePreference) => {
    const theme = resolveTheme(value, mediaRef.current?.matches ?? false);
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    preferenceRef.current = value;
    setPreference(value);
    setResolved(theme);
  }, []);

  useEffect(() => {
    const media =
      typeof window.matchMedia === "function"
        ? window.matchMedia(DARK_MEDIA_QUERY)
        : null;
    mediaRef.current = media;
    let saved: ThemePreference = "system";
    // Hydrate from browser settings after the server's stable initial render.
    /* eslint-disable react-hooks/set-state-in-effect -- Synchronizing localStorage and OS appearance after SSR hydration. */
    try {
      saved = parseTheme(window.localStorage.getItem(THEME_STORAGE_KEY));
    } catch {
      setStorageError(true);
    }
    apply(saved);
    setReady(true);
    /* eslint-enable react-hooks/set-state-in-effect */
    const onSystemChange = () => {
      if (preferenceRef.current === "system") apply("system");
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key !== THEME_STORAGE_KEY && event.key !== null) return;
      if (event.storageArea && event.storageArea !== window.localStorage)
        return;
      apply(parseTheme(event.newValue));
    };
    media?.addEventListener("change", onSystemChange);
    window.addEventListener("storage", onStorage);
    return () => {
      media?.removeEventListener("change", onSystemChange);
      window.removeEventListener("storage", onStorage);
    };
  }, [apply]);

  const setTheme = useCallback(
    (value: ThemePreference) => {
      apply(value);
      try {
        window.localStorage.setItem(THEME_STORAGE_KEY, value);
        setStorageError(false);
      } catch {
        setStorageError(true);
      }
    },
    [apply],
  );

  return (
    <ThemeContext.Provider
      value={{ preference, resolved, ready, storageError, setTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}

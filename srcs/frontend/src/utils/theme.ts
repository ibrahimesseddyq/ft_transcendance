export type ThemeMode = "dark" | "light";

const THEME_STORAGE_KEY = "theme";

export const getStoredTheme = (): ThemeMode | null => {
  const theme = localStorage.getItem(THEME_STORAGE_KEY);
  return theme === "dark" || theme === "light" ? theme : null;
};

export const resolveTheme = (): ThemeMode => {
  const storedTheme = getStoredTheme();
  if (storedTheme)
    return storedTheme;

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export const applyTheme = (theme: ThemeMode): ThemeMode => {
  const root = document.documentElement;
  const isDark = theme === "dark";

  root.classList.toggle("dark", isDark);
  root.style.colorScheme = theme;
  localStorage.setItem(THEME_STORAGE_KEY, theme);

  return theme;
};

export const applyThemeWithoutJank = (theme: ThemeMode): ThemeMode => {
  const root = document.documentElement;
  root.classList.add("theme-switching");

  const appliedTheme = applyTheme(theme);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      root.classList.remove("theme-switching");
    });
  });

  return appliedTheme;
};

export const toggleTheme = (): ThemeMode => {
  const isDark = document.documentElement.classList.contains("dark");
  return applyThemeWithoutJank(isDark ? "light" : "dark");
};

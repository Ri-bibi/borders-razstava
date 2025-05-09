export const languages = ["en", "sl", "it"] as const;
type Language = (typeof languages)[number];
export const defaultLanguage: Language = "sl";

export function detectLanguageFromUrl(pathname: string): Language {
  const path = pathname.endsWith("/") ? pathname : pathname + "/";
  const detected = languages.find((lang) => path.startsWith(`/${lang}/`));
  return detected || defaultLanguage;
}

export function generateLocaleLink(
  path: string,
  currentPath: string,
  lang?: Language
): string {
  // Ensure paths end with slash
  const normalizedPath = path.endsWith("/") ? path : path + "/";
  const normalizedCurrent = currentPath.endsWith("/")
    ? currentPath
    : currentPath + "/";

  // Use provided language or detect from current path
  const language = lang || detectLanguageFromUrl(normalizedCurrent);

  // Remove any existing language prefix
  const pathWithoutLang = languages.some((l) =>
    normalizedPath.startsWith(`/${l}/`)
  )
    ? normalizedPath.slice(3)
    : normalizedPath;

  return `/${language}${pathWithoutLang}`;
}

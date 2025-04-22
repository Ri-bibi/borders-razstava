// src/utils/i18n.ts
import { getCollection } from "astro:content";
import i18next, { type Resource } from "i18next";

let isInitialized = false;

export async function initializei18n(locale: string) {
  if (isInitialized) i18next.t;

  const translationEntries = await getCollection("translations");
  const resources = translationEntries.reduce(
    (acc, entry) => ({
      ...acc,
      [entry.id]: { translation: entry.data },
    }),
    {}
  ) as Resource;

  const t = await i18next.init({
    preload: Object.keys(resources),
    lng: locale,
    fallbackLng: "sl",
    resources: resources,
    interpolation: {
      escapeValue: false, // React already safes from XSS
    },
    saveMissing: true, // Log missing keys
    missingKeyHandler: (lngs, ns, key) => {
      console.warn(`Missing translation: ${key}`);
    },
  });

  // console.log(resources);
  // console.log(i18next.languages, Object.keys(resources), locale);
  console.log(t("generic.source"));

  isInitialized = true;

  return i18next.t;
}

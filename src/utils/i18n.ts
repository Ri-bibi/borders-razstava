import { getCollection } from "astro:content";
import i18next, { type Resource } from "i18next";

export function deepMerge(target: any, source: any): any {
  const output = { ...target };
  for (const key in source) {
    if (
      source.hasOwnProperty(key) &&
      key in target &&
      isObject(target[key]) &&
      isObject(source[key])
    ) {
      output[key] = deepMerge(target[key], source[key]);
    } else {
      output[key] = source[key];
    }
  }
  return output;
}

export function isObject(value: any): value is Record<string, any> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

let isInitialized = false;
let lastLocale: string | null = null;

export async function generateTranslationContent() {
  const translationEntries = await getCollection("translations");
  const resources: Resource = {};

  for (const entry of translationEntries) {
    const data = entry.data;

    for (const lang in data) {
      if (!resources[lang]) {
        resources[lang] = { translation: {} };
      }

      resources[lang].translation = deepMerge(
        resources[lang].translation,
        data[lang]
      );
    }
  }

  return resources;
}

export async function initializei18n(locale: string) {
  if (isInitialized && lastLocale === locale) return i18next.t;

  const resources = await generateTranslationContent();

  await i18next.init({
    preload: Object.keys(resources),
    lng: locale,
    fallbackLng: "en",
    resources,
    interpolation: {
      escapeValue: false,
    },
    saveMissing: true,
    missingKeyHandler: (lngs, ns, key) => {
      console.warn(`Missing translation: ${key}`);
    },
  });

  isInitialized = true;
  lastLocale = locale;

  return i18next.t;
}

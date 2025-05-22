import i18next, { type Resource } from "i18next";

export async function initializei18nClient(
  locale: string,
  resources: Resource
) {
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

  return i18next.t;
}

import i18n from "i18next";
import Backend from "i18next-http-backend";
import type { HttpBackendOptions } from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

const backendOpts: HttpBackendOptions = {
  loadPath: "/locales/{{lng}}/{{ns}}.json",
};

i18n
  .use(Backend) // load jsons
  .use(initReactI18next) // react compatible
  .init({
    backend: backendOpts,
    lng: "sl",
    fallbackLng: "sl",
    detection: {
      order: [], // disable all detection
    },

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;

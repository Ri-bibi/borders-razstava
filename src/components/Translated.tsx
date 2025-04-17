import { useTranslation } from "react-i18next";

export const MyComponent = () => {
  const { t, i18n } = useTranslation();
  return (
    <div className="flex gap-18">
      <h1>{t("bridge.main")}</h1>
      <span>{t("bridge.places")}</span>
      <a
        onClick={() => {
          i18n.changeLanguage("en");
          console.log(i18n.language);
        }}
      >
        en - klikni
      </a>
      <span>{i18n.language}</span>
    </div>
  );
};

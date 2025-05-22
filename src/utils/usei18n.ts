import { useEffect, useMemo, useState } from "react";
import { initializei18nClient } from "./i18nClient";
import type { Resource } from "i18next";

export const useClientTranslation = (locale: string, resources: Resource) => {
  const [t, setT] = useState<(key: string) => string>(
    () => (key: string) => key
  );

  useEffect(() => {
    let isMounted = true; // Cleanup flag

    initializei18nClient(locale, resources)
      .then((transF) => {
        if (isMounted) {
          // Use functional update to preserve function reference
          setT(() => transF);
          console.log("Initialized translation function", transF);
        }
      })
      .catch((error) => {
        console.error("Translation initialization failed:", error);
        setT((key: string) => key); // Fallback to key return
      });

    return () => {
      isMounted = false; // Prevent state updates after unmount
    };
  }, [locale, resources]);

  return t;
};

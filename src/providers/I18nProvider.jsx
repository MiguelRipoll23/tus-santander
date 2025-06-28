import { useState, useCallback, useEffect } from "react";
import { I18nContext } from "../contexts/I18nContext.jsx";
import es from "../i18n/es.json";
import en from "../i18n/en.json";

const translations = { es, en };

export const I18nProvider = ({ children }) => {
  const browserLanguage = (() => {
    if (typeof navigator === "undefined") return "es";

    const browserLang = navigator.language?.toLowerCase() || "";
    const supportedLangs = Object.keys(translations);

    // Check for exact match first
    if (supportedLangs.includes(browserLang)) {
      return browserLang;
    }

    // Check for language prefix match
    const langPrefix = browserLang.split("-")[0];
    if (supportedLangs.includes(langPrefix)) {
      return langPrefix;
    }

    return "es"; // Default fallback
  })();

  const [language, setLanguage] = useState(browserLanguage);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
    }
  }, [language]);

  const getText = useCallback(
    (key) => {
      const dict = translations[language] || {};
      return dict[key] || key;
    },
    [language]
  );

  return (
    <I18nContext.Provider value={{ getText, language, setLanguage }}>
      {children}
    </I18nContext.Provider>
  );
};

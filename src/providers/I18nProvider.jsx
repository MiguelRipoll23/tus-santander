import { useState, useCallback, useEffect } from "react";
import { I18nContext } from "../contexts/I18nContext.jsx";
import ca from "../i18n/ca.json";
import da from "../i18n/da.json";
import en from "../i18n/en.json";
import es from "../i18n/es.json";
import fr from "../i18n/fr.json";
import it from "../i18n/it.json";
import pl from "../i18n/pl.json";
import pt from "../i18n/pt.json";

const translations = { ca, da, en, es, fr, it, pl, pt };

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

    return "en"; // Default fallback
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

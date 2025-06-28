import { useState, useCallback, useEffect } from "react";
import { I18nContext } from "../contexts/I18nContext.jsx";
import es from "../i18n/es.json";
import en from "../i18n/en.json";

const translations = { es, en };

export const I18nProvider = ({ children }) => {
  const defaultLang =
    (typeof navigator !== "undefined" && navigator.language?.startsWith("en"))
      ? "en"
      : "es";
  const [lang, setLang] = useState(defaultLang);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const t = useCallback(
    (key) => {
      const dict = translations[lang] || {};
      return dict[key] || key;
    },
    [lang]
  );

  return (
    <I18nContext.Provider value={{ t, lang, setLang }}>
      {children}
    </I18nContext.Provider>
  );
};

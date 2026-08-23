import React from "react";
import type { ReactNode } from "react";
import { useState, useCallback, useEffect } from "react";
import { I18nContext } from "../contexts/I18nContext";
import type { I18nContextValue } from "../interfaces/i18n";
import ca from "../i18n/ca.json";
import da from "../i18n/da.json";
import en from "../i18n/en.json";
import es from "../i18n/es.json";
import fr from "../i18n/fr.json";
import it from "../i18n/it.json";
import pl from "../i18n/pl.json";
import pt from "../i18n/pt.json";

const translations: Record<string, Record<string, string>> = {
  ca,
  da,
  en,
  es,
  fr,
  it,
  pl,
  pt,
};

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps): React.JSX.Element {
  const browserLanguage = (() => {
    if (typeof navigator === "undefined") return "es";

    const browserLang = navigator.language?.toLowerCase() ?? "";
    const supportedLangs = Object.keys(translations);

    if (supportedLangs.includes(browserLang)) {
      return browserLang;
    }

    const langPrefix = browserLang.split("-")[0] ?? "";
    if (supportedLangs.includes(langPrefix)) {
      return langPrefix;
    }

    return "en";
  })();

  const [language, setLanguage] = useState(browserLanguage);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
    }
  }, [language]);

  const getText = useCallback(
    (key: string): string => {
      const dict = translations[language] ?? {};
      return dict[key] ?? key;
    },
    [language]
  );

  const value: I18nContextValue = { getText, language, setLanguage };

  return (
    <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
  );
}

import { createContext, useContext } from "react";

export const I18nContext = createContext({
  getText: (key) => {
    console.warn(`Missing translation for key: ${key}`);
    return key;
  },
  lang: "es",
  setLanguage: () => {},
});

export const useI18n = () => useContext(I18nContext);

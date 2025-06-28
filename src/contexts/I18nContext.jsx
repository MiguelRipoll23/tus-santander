import { createContext, useContext } from "react";

export const I18nContext = createContext({
  getText: (key) => key,
  lang: "es",
  setLanguage: () => {},
});

export const useI18n = () => useContext(I18nContext);

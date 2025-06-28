import { createContext, useContext } from "react";

export const I18nContext = createContext({
  t: (key) => key,
  lang: "es",
  setLang: () => {},
});

export const useI18n = () => useContext(I18nContext);

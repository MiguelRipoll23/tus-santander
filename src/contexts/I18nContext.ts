import { createContext, use } from "react";
import type { I18nContextValue } from "../interfaces/i18n";

const defaultContextValue: I18nContextValue = {
  getText: (key: string): string => {
    console.warn(`Missing translation for key: ${key}`);
    return key;
  },
  language: "es",
  setLanguage: () => {},
};

export const I18nContext = createContext<I18nContextValue>(defaultContextValue);

export function useI18n(): I18nContextValue {
  return use(I18nContext);
}

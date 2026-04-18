export interface I18nContextValue {
  getText: (key: string) => string;
  language: string;
  setLanguage: (lang: string) => void;
}

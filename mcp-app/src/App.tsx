import "./App.css";

import { IntlProvider } from "react-intl";
import en from "./locales/en-US.json";
import es from "./locales/es-ES.json";
import EstimationsWidget from "./widgets/estimations-widget";

const messages: Record<string, Record<string, string>> = {
  "en-US": en,
  "es-ES": es,
};

export function App() {
  const locale = self?.openai?.locale ?? "en-US";

  return (
    <IntlProvider
      locale={locale}
      messages={messages[locale] ?? messages["en-US"]}
    >
      <EstimationsWidget />
    </IntlProvider>
  );
}

import { useEffect } from "react";
import { ViewProvider } from "../providers/ViewProvider.jsx";
import { I18nProvider } from "../providers/I18nProvider.jsx";
import View from "./View.jsx";
import { sendTelemetry } from "../utils/TelemetryUtils.jsx";

const App = () => {
  useEffect(() => {
    sendTelemetry();
  }, []);

  return (
    <I18nProvider>
      <ViewProvider>
        <View />
      </ViewProvider>
    </I18nProvider>
  );
};

export default App;

import React from "react";
import { useEffect } from "react";
import { ViewProvider } from "../providers/ViewProvider";
import { I18nProvider } from "../providers/I18nProvider";
import View from "./View";
import SeasonalEffects from "./SeasonalEffects";
import { sendTelemetry } from "../utils/TelemetryUtils";

function App(): React.JSX.Element {
  useEffect(() => {
    sendTelemetry();
  }, []);

  return (
    <>
      <I18nProvider>
        <ViewProvider>
          <View />
        </ViewProvider>
      </I18nProvider>
      <SeasonalEffects />
    </>
  );
}

export default App;

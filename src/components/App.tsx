import React from "react";
import { useEffect } from "react";
import { BrowserRouter } from "react-router";
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
        <BrowserRouter>
          <ViewProvider>
            <View />
          </ViewProvider>
        </BrowserRouter>
      </I18nProvider>
      <SeasonalEffects />
    </>
  );
}

export default App;

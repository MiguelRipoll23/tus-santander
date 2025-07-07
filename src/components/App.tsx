import { ViewProvider } from "../providers/ViewProvider";
import { I18nProvider } from "../providers/I18nProvider";
import View from "./View";

const App = () => {
  return (
    <I18nProvider>
      <ViewProvider>
        <View />
      </ViewProvider>
    </I18nProvider>
  );
};

export default App;

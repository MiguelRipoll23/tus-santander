import { ViewProvider } from "../providers/ViewProvider.js";
import View from "./View.js";

const App = () => {
  return (
    <ViewProvider>
      <View />
    </ViewProvider>
  );
};

export default App;

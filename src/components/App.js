import { ViewProvider } from "../providers/ViewProvider.js";
import View from "./View.js";

navigator.standalone =
  navigator.standalone ||
  window.matchMedia("(display-mode: standalone)").matches;

const App = () => {
  return (
    <ViewProvider>
      <View />
    </ViewProvider>
  );
};

export default App;

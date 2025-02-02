import { ViewProvider } from "../providers/ViewProvider.jsx";
import View from "./View.jsx";

const App = () => {
  return (
    <ViewProvider>
      <View />
    </ViewProvider>
  );
};

export default App;

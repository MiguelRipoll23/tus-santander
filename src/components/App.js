import { ViewProvider } from "../providers/ViewProvider.js";
import Main from "./Main.js";

const App = () => {
  return (
    <ViewProvider>
      <Main />
    </ViewProvider>
  );
};

export default App;

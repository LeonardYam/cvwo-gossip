import App from "./app/App";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { createRoot } from 'react-dom/client';

// React 18 Client Rendering API
// https://reactjs.org/link/switch-to-createroot
const container = document.getElementById("root");
const root = createRoot(container!)
root.render(
<Provider store={store}>
  <App/>
</Provider>);



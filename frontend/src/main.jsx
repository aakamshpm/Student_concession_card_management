import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store.js";
import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import "./index.css";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Home />} />
      <Route path="/login" element={<Login />} />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);

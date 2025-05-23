import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import { Provider } from "react-redux";
import store from "./store.js";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import Login from "./pages/Login";
import PublicRoute from "./components/PublicRoute.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Profile from "./pages/Profile.jsx";
import Apply from "./pages/Apply.jsx";
import Verify from "./pages/Verify.jsx";
import "./index.css";
import Status from "./pages/Status.jsx";
import Guidelines from "./pages/Guidelines.jsx";
import NotFound from "./pages/NotFound.jsx";
import ViewConcession from "./pages/ViewConcession.jsx";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* PublicRoutes */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
      </Route>

      {/* ProtectedRoutes */}
      <Route element={<ProtectedRoute />}>
        <Route index element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/apply" element={<Apply />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/status" element={<Status />} />
        <Route path="/guidelines" element={<Guidelines />} />
        <Route path="/view-concession" element={<ViewConcession />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
      <RouterProvider router={router} />
    </SnackbarProvider>
  </Provider>
);

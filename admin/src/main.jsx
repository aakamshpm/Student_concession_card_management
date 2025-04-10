import { createRoot } from "react-dom/client";
import { SnackbarProvider } from "notistack";
import {
  createRoutesFromElements,
  createBrowserRouter,
  Route,
  RouterProvider,
} from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store.js";
import App from "./App.jsx";
import Login from "./pages/Login.jsx";
import "./index.css";
import PublicRoute from "./routes/PublicRoute.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import Dashboard from "./pages/protected/Dashboard.jsx";
import NotFound from "./pages/NotFound.jsx";
import Students from "./pages/protected/Students.jsx";
import StudentDetails from "./pages/protected/StudentDetails.jsx";
import Verifications from "./pages/protected/Verifications.jsx";
import Applications from "./pages/protected/Applications.jsx";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route index element={<Dashboard />} />
        <Route path="/students" element={<Students />} />
        <Route path="/student/:id" element={<StudentDetails />} />
        <Route path="/verifications" element={<Verifications />} />
        <Route path="/applications" element={<Applications />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <SnackbarProvider>
      <RouterProvider router={router} />
    </SnackbarProvider>
  </Provider>
);

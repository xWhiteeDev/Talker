import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Auth from "../routes/Auth/AuthLayout.tsx";
import { useState } from "react";
import CustomNotification from "../components/Notification/Notification.tsx";
import Home from "../routes/Main/Home/Home.tsx";
import Login from "../routes/Auth/Login/Login.tsx";
import Register from "../routes/Auth/Register/Register.tsx";
import { NotificationContext } from "../components/Notification/context/NotificationContext.ts";
import "./Main.css";
import type { Notification } from "../components/Notification/types.ts";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute.tsx";
import AuthorizationProtectedRoute from "../components/ProtectedRoute/AuthorizationProtectedRoute.tsx";
import { ServerErrorContext } from "../components/Error/errorContext.ts";
import ErrorPage from "../components/Error/ErrorPage.tsx";
const root = document.getElementById("root");
const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/home",
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/auth",
    element: <Auth />,
    children: [
      {
        path: "login",
        element: (
          <AuthorizationProtectedRoute>
            <Login />
          </AuthorizationProtectedRoute>
        ),
      },
      {
        path: "register",
        element: (
          <AuthorizationProtectedRoute>
            <Register />
          </AuthorizationProtectedRoute>
        ),
      },
    ],
  },
]);
function Main() {
  const [serverError, showServerError] = useState<boolean>(false);
  function setServerError(state: boolean) {
    showServerError(state);
  }
  const [notification, setNotification] = useState<Notification | null>();
  function setNotify(notiContext: Notification) {
    if (notification) {
      setNotification(() => null);
    }
    setNotification(notiContext);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  }
  return (
    <ServerErrorContext.Provider value={{ setServerError }}>
      <NotificationContext.Provider value={{ setNotify }}>
        {serverError ? <ErrorPage /> : <RouterProvider router={routes} />}
        {notification && (
          <CustomNotification
            type={notification.type}
            message={notification.message}
          />
        )}
      </NotificationContext.Provider>
    </ServerErrorContext.Provider>
  );
}

createRoot(root!).render(<Main />);

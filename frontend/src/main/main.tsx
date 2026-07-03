import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Auth from "../routes/Auth/Auth.tsx";
import "../styles/main/main.css";
import AuthorizationSidebar from "../routes/Auth/AuthSidebar.tsx";
import Register from "../routes/Auth/Register.tsx";
import { useState } from "react";
import CustomNotification from "../components/Notification.tsx";
import { NotificationContext } from "../context/NotificationContext.ts";
import type { INotification } from "../interfaces/components/INotification.ts";
const root = document.getElementById("root");
const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/auth",
    element: <Auth />,
    children: [
      {
        path: "login",
        element: <AuthorizationSidebar />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
]);
function Main() {
  const [notification, setNotification] = useState<INotification | null>();
  function setNotify(notiContext: INotification) {
    if (notification) {
      setNotification(()=> null);
    }
    setNotification(notiContext);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  }
  return (
    <NotificationContext.Provider value={{ setNotify }}>
      <RouterProvider router={routes} />
      {notification && (
        <CustomNotification
          type={notification.type}
          message={notification.message}
        />
      )}
    </NotificationContext.Provider>
  );
}

createRoot(root!).render(<Main />);

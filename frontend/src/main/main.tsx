import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Auth from "../routes/Auth/Auth.tsx";
import "../styles/main/main.css";
import AuthorizationSidebar from "../routes/Auth/AuthSidebar.tsx";
import Register from '../routes/Auth/Register.tsx';
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
        element: <AuthorizationSidebar/>,
      },
      {
        path:'register',
        element:<Register/>
      }
    ],
  },
]);

createRoot(root!).render(<RouterProvider router={routes} />);

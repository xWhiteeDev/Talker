import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Auth from "../routes/Auth.tsx";
import '../styles/main/main.css'
const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path:'/auth',
    element:<Auth/>,
    children:[{
      path:'register',
      element:<>todo</>
    }]
  }
]);

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={routes} />,
);

import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './Main.css';
import Login from './renew/Pages/Auth/components/Login/Login.tsx';
import Register from './renew/Pages/Auth/components/Register/Register.tsx';
import { ProtectedRoute } from './renew/Components/ProtectedRoute/ProtectedRoute.tsx';
import { AuthLayout } from './contexts/AuthContext/AuthLayout.tsx';
import { GuestOnlyRoute } from './renew/Components/ProtectedRoute/GuestOnlyRoute.tsx';
import Home from './renew/Pages/Home/Home.tsx';

const root = document.getElementById('root');
const routes = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        element: <GuestOnlyRoute />, 
        children: [
          { path: '/signin', element: <Login /> },
          { path: '/signup', element: <Register /> },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [{ path: '/', element: <Home /> }],
      },
    ],
  },
]);

function Main() {
  return <RouterProvider router={routes} />;
}

createRoot(root!).render(<Main />);
export default Main;

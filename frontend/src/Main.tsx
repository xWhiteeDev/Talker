import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './Main.css';
import Login from './components/features/Auth/components/Login/Login.tsx';
import Register from './components/features/Auth/components/Register/Register.tsx';
import { ProtectedRoute } from './renew/Components/ProtectedRoute/ProtectedRoute.tsx';
import Home from './components/features/Home/Home.tsx';
import { AuthLayout } from './contexts/AuthContext/AuthLayout.tsx';

const root = document.getElementById('root');
const routes = createBrowserRouter([
  {
    element: <AuthLayout />, 
    children: [
      { path: '/signin', element: <Login /> }, 
      { path: '/signup', element: <Register /> }, 
      {
        element: <ProtectedRoute />, 
        children: [
          { path: '/', element: <Home /> }, 
        ],
      },
    ],
  },
]);

function Main() {
  return <RouterProvider router={routes} />;
}

createRoot(root!).render(<Main />);
export default Main;

import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useRef, useState } from 'react';

import './Main.css';
import type { IBasicUserInfo } from './types/components/IUser';
import Login from './components/features/Auth/components/Login/Login.tsx';
import Register from './components/features/Auth/components/Register/Register.tsx';

const root = document.getElementById('root');
const routes = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/signin',
        element: <Login />,
      },
      {
        path: '/signup',
        element: <Register />,
      }
    ]
  },
]);

function Main() {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<IBasicUserInfo | undefined>(undefined);
  const timerid = useRef<null | number>(null);
  function setNotify(notiContext: any) {
    // if (notification) {
    //   setNotification(() => null);
    // }
    // setNotification(notiContext);
    // if (timerid.current == null) {
    //   timerid.current = setTimeout(() => {
    //     setNotification(null);
    //   }, 4000);
    // } else {
    //   clearTimeout(timerid.current);
    //   timerid.current = setTimeout(() => {
    //     setNotification(null);
    //   }, 4000);
    // }
  }
  function login(userData: IBasicUserInfo) {
    setLoggedIn(true);
    setUser(userData);
    return !!userData;
  }
  function logout() {
    setLoggedIn(false);
    setUser(undefined);
    return true;
  }

  return <RouterProvider router={routes} />;
}

createRoot(root!).render(<Main />);
export default Main;

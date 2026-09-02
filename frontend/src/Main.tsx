import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Auth from './components/features/Auth/components/AuthLayout.tsx';
import { useState } from 'react';
import CustomNotification from './components/generic/UI/Notification/CustomNotification.tsx';
import Home from './components/features/Home/Home.tsx';
import Login from './components/features/Auth/components/shared/Login/Login.tsx';
import Register from './components/features/Auth/components/shared/Register/Register.tsx';
import { customNotificationCtx } from './context/customNotificationContext.ts';

import ProtectedRoute from './components/features/ProtectedRoute/ProtectedRoute.tsx';
import AuthorizationProtectedRoute from './components/features/ProtectedRoute/AuthorizationProtectedRoute.tsx';
import './Main.css';
import type { NotificationHookProps } from './types/NotificationHook';
import { LargeActivity } from './components/features/Feed/components/Activity/Large/LargeActivity.tsx';
import Profile from './components/features/Feed/components/profile/Profile.tsx';

const root = document.getElementById('root');
const routes = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
        children: [
          {
            path: 'post/:postid',
            element: (
              <ProtectedRoute>
                <LargeActivity />
              </ProtectedRoute>
            ),
            children: [
              {
                path: 'comments/:commentid',
                element: <LargeActivity />,
              },
            ],
          },
          {
            path: 'profile/me',
            element: <Profile />,
          },
            {
            path: 'profile/:id',
            element: <Profile />,
          },
        ],
      },
    ],
  },
  {
    path: '/auth',
    element: <Auth />,
    children: [
      {
        path: 'login',
        element: (
          <AuthorizationProtectedRoute>
            <Login />
          </AuthorizationProtectedRoute>
        ),
      },
      {
        path: 'register',
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
  const [notification, setNotification] = useState<NotificationHookProps | null>();

  function setNotify(notiContext: NotificationHookProps) {
    if (notification) {
      setNotification(() => null);
    }
    setNotification(notiContext);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  }
  return (
    <customNotificationCtx.Provider value={{ setNotify }}>
      {<RouterProvider router={routes} />}
      {notification && <CustomNotification type={notification.type} message={notification.message} />}
    </customNotificationCtx.Provider>
  );
}

createRoot(root!).render(<Main />);

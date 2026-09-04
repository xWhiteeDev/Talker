import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {AuthContext} from '../../../context/authContext';

interface AuthorizationProtectedRouteProps {
  children: React.ReactNode;
}

export default function AuthorizationProtectedRoute({ children }: AuthorizationProtectedRouteProps) {
  const nav = useNavigate();
  const authContext = useContext(AuthContext)
  useEffect(() => {
    if (authContext?.loggedIn === true) {
      nav("/"); //TODO: NOT FINISHED!!
    }
  }, [authContext?.loggedIn]);
  return authContext?.loggedIn ? <span>Redirecting...</span> : children;
}

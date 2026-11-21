import type { ReactNode } from 'react';
import { useLocation } from 'react-router';
import { Navigate } from 'react-router';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const urlToken = searchParams.get('token');
  if (urlToken) {
    localStorage.setItem('assetflow_token', urlToken);
  }

  const token = localStorage.getItem('assetflow_token');

  const isAuthenticated = Boolean(token);
  const isAuthPage = location.pathname.startsWith('/auth');

  if (!isAuthenticated && !isAuthPage) {
    return <Navigate to='/auth/login' replace state={{ from: location }} />;
  }

  if (isAuthenticated && isAuthPage) {
    return <Navigate to='/' replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

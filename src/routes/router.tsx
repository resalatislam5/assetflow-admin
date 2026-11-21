import ForgotPassword from '../auth/pages/ForgotPassword';
import ResetPassword from '../auth/pages/ResetPassword';
import { createBrowserRouter } from 'react-router';
import AuthLayout from '../auth/layout/AuthLayout';
import Login from '../auth/pages/Login';
import MainLayout from '../layout/pages/MainLayout';
import { AppRoutes } from './AppRoutes';
import PermissionRoutes from './PermissionRoutes';
import ProtectedRoute from './ProtectedRoute';
import NotFoundPage from '../common/components/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: AppRoutes.map((item) => {
      return {
        path: item.path,
        element: <PermissionRoutes item={item} />,
        name: item.name,
      };
    }),
  },
  {
    path: '/auth',
    element: (
      <ProtectedRoute>
        <AuthLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPassword />,
      },
      {
        path: 'reset-password',
        element: <ResetPassword />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

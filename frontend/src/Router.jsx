import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ManagerLayout from './components/layouts/ManagerLayout';
import EmployeeLayout from './components/layouts/EmployeeLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Manager Pages
import ManagerDashboard from './pages/manager/Dashboard';
import EmployeeManagement from './pages/manager/EmployeeManagement';
import ServiceManagement from './pages/manager/ServiceManagement';
import ShiftManagement from './pages/manager/ShiftManagement';
import LeaveApprovals from './pages/manager/LeaveApprovals';

// Employee Pages
import EmployeeDashboard from './pages/employee/Dashboard';
import Profile from './pages/employee/Profile';
import MyLeaves from './pages/employee/MyLeaves';
import MyShifts from './pages/employee/MyShifts';
import ServiceCatalog from './pages/employee/ServiceCatalog';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <LoginPage />,
  },
  {
    path: '/manager',
    element: (
      <ProtectedRoute allowedRoles={['Manager']}>
        <ManagerLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'dashboard',
        element: <ManagerDashboard />,
      },
      {
        path: 'employees',
        element: <EmployeeManagement />,
      },
      {
        path: 'services',
        element: <ServiceManagement />,
      },
      {
        path: 'shifts',
        element: <ShiftManagement />,
      },
      {
        path: 'leaves',
        element: <LeaveApprovals />,
      },
    ],
  },
  {
    path: '/employee',
    element: (
      <ProtectedRoute allowedRoles={['Employee']}>
        <EmployeeLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'dashboard',
        element: <EmployeeDashboard />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
      {
        path: 'leaves',
        element: <MyLeaves />,
      },
      {
        path: 'shifts',
        element: <MyShifts />,
      },
      {
        path: 'services',
        element: <ServiceCatalog />,
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
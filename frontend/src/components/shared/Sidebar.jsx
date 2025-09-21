import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import {
  Users,
  Calendar,
  Clock,
  Settings,
  LogOut,
  LayoutDashboard,
  User,
  FileText,
  Scissors,
  X,
} from 'lucide-react';

const Sidebar = ({ userRole, isMobile = false, isOpen = true, onClose }) => {
  const location = useLocation();
  const { logout } = useAuth();

  const managerNavItems = [
    { path: '/manager/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/manager/employees', label: 'Employees', icon: Users },
    { path: '/manager/services', label: 'Services', icon: Scissors },
    { path: '/manager/shifts', label: 'Shifts', icon: Clock },
    { path: '/manager/leaves', label: 'Leave Requests', icon: FileText },
  ];

  const employeeNavItems = [
    { path: '/employee/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/employee/profile', label: 'Profile', icon: User },
    { path: '/employee/leaves', label: 'My Leaves', icon: FileText },
    { path: '/employee/shifts', label: 'My Shifts', icon: Clock },
    { path: '/employee/services', label: 'Services', icon: Scissors },
  ];

  const navItems = userRole === 'Manager' ? managerNavItems : employeeNavItems;

  const handleLogout = () => {
    logout();
    if (isMobile && onClose) {
      onClose();
    }
  };

  const handleLinkClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  // Mobile sidebar classes
  const sidebarClasses = cn(
    "bg-white border-r border-gray-200 min-h-screen flex flex-col transition-transform duration-300 ease-in-out",
    isMobile ? [
      "fixed top-0 left-0 z-50 w-64",
      isOpen ? "translate-x-0" : "-translate-x-full"
    ] : "w-64"
  );

  return (
    <div className={sidebarClasses}>
      {/* Logo/Header */}
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Salon Management
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {userRole} Dashboard
          </p>
        </div>
        {isMobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-2"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={handleLinkClick}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                    isActive
                      ? "bg-blue-100 text-blue-700 border border-blue-200"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-200">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-700 hover:bg-gray-100"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
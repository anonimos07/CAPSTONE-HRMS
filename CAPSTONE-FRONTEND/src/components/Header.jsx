import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Bell, User, LogOut, Home, Users, FileText, Briefcase, UserCheck } from 'lucide-react';
import { useUnreadNotificationCount } from '../Api';

const Header = ({ userRole }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: unreadCount } = useUnreadNotificationCount();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const getNavItems = () => {
    if (userRole === 'HR') {
      return [
        { path: '/hrpage', label: 'Dashboard', icon: Home },
        { path: '/hr/announcements', label: 'Announcements', icon: Users },
        { path: '/hr/job-applications', label: 'Applications', icon: FileText },
        { path: '/hr/resume-review', label: 'Resume Review', icon: UserCheck },
        { path: '/hr/notifications', label: 'Notifications', icon: Bell },
        { path: '/hrprofile', label: 'Profile', icon: User },
      ];
    } else {
      return [
        { path: '/employeepage', label: 'Dashboard', icon: Home },
        { path: '/employee/notifications', label: 'Notifications', icon: Bell },
        { path: '/timelog', label: 'Timelog', icon: Briefcase },
        { path: '/employeeprofile', label: 'Profile', icon: User },
      ];
    }
  };

  const navItems = getNavItems();

  return (
    <header className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600">HRMS</h1>
            <span className="ml-2 text-sm text-gray-500">
              {userRole === 'HR' ? 'HR Portal' : 'Employee Portal'}
            </span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                  {item.label === 'Notifications' && unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Welcome, {localStorage.getItem('username') || 'User'}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t pt-4 pb-2">
          <div className="flex flex-wrap gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                  {item.label === 'Notifications' && unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

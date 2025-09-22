import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useDocumentTitle = () => {
  const location = useLocation();

  useEffect(() => {
    const getPageTitle = () => {
      const path = location.pathname;
      
      // HR Routes
      if (path === '/hrpage') return 'Dashboard';
      if (path === '/hrprofile') return 'Profile';
      if (path === '/hr-timelog') return 'Timelog Management';
      if (path === '/hr/announcements') return 'Announcements';
      if (path === '/hr/job-applications') return 'Job Applications';
      if (path === '/hr/resume-review') return 'Resume Review';
      if (path === '/hr/notifications') return 'Notifications';
      
      // Employee Routes
      if (path === '/employeepage') return 'Dashboard';
      if (path === '/employeeprofile') return 'Profile';
      if (path === '/timelog') return 'Timelog';
      if (path === '/employee/notifications') return 'Notifications';
      
      // Admin Routes
      if (path === '/adminpage') {
        const searchParams = new URLSearchParams(location.search);
        const tab = searchParams.get('tab');
        if (tab === 'users') return 'User Management';
        if (tab === 'hr') return 'HR Management';
        if (tab === 'employees') return 'Employee Management';
        if (tab === 'settings') return 'Settings';
        return 'Admin Dashboard';
      }
      
      // Auth Routes
      if (path === '/login') return 'Login';
      if (path === '/hr') return 'HR Login';
      if (path === '/admin') return 'Admin Login';
      if (path === '/forgot-password') return 'Forgot Password';
      if (path === '/reset-password') return 'Reset Password';
      
      // Public Routes
      if (path === '/') return 'Home';
      if (path === '/hiring') return 'Careers';
      if (path.startsWith('/apply/')) return 'Job Application';
      
      // Default
      return 'HRMS';
    };

    const pageTitle = getPageTitle();
    document.title = `${pageTitle} - TechStaffHub`;
  }, [location.pathname, location.search]);
};

export default useDocumentTitle;

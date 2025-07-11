import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Clock, Calendar, User, LogOut } from 'lucide-react';

const EmployeeDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [attendanceStatus, setAttendanceStatus] = useState('Not Checked In');

  // Update time every second
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleTimeInOut = () => {
    setAttendanceStatus(prev => 
      prev === 'Not Checked In' ? 'Checked In' : 
      prev === 'Checked In' ? 'Checked Out' : 'Not Checked In'
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 bg-white border-r border-gray-200">
          <div className="flex items-center justify-center h-16 px-4 bg-purple-600">
            <h1 className="text-white font-semibold">Employee Portal</h1>
          </div>
          <div className="flex flex-col flex-grow p-4 overflow-y-auto">
            <nav className="flex-1 space-y-2">
              <NavItem to="/employee/dashboard" icon={<LayoutDashboard />} text="Dashboard" />
              <NavItem to="/employee/attendance" icon={<Clock />} text="Attendance" />
              <NavItem to="/employee/leave" icon={<Calendar />} text="Leave Requests" />
              <NavItem to="/employee/profile" icon={<User />} text="My Profile" />
            </nav>
          </div>
          <div className="p-4 border-t border-gray-200">
            <button className="flex items-center space-x-2 text-gray-600 hover:text-purple-600">
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Current Time</p>
                <p className="font-medium">{currentTime.toLocaleTimeString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Today's Date</p>
                <p className="font-medium">{currentTime.toLocaleDateString()}</p>
              </div>
            </div>
            <button
              onClick={handleTimeInOut}
              className={`px-4 py-2 rounded-lg font-medium ${
                attendanceStatus === 'Checked In' 
                  ? 'bg-green-100 text-green-800' 
                  : attendanceStatus === 'Checked Out' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-gray-100 text-gray-800'
              }`}
            >
              {attendanceStatus === 'Checked In' ? 'Check Out' : 'Check In'}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const NavItem = ({ to, icon, text }) => (
  <NavLink
    to={to}
    className={({ isActive }) => 
      `flex items-center px-4 py-3 rounded-lg transition-colors ${
        isActive 
          ? 'bg-purple-50 text-purple-600' 
          : 'text-gray-600 hover:bg-gray-100'
      }`
    }
  >
    <span className="mr-3">{icon}</span>
    <span>{text}</span>
  </NavLink>
);

export default EmployeeDashboard;
"use client"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Bell, User, LogOut, Home, Users, FileText, Briefcase, UserCheck } from "lucide-react"
import { useUnreadNotificationCount } from "../Api"

const Header = ({ userRole }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { data: unreadCount } = useUnreadNotificationCount()

  const handleLogout = () => {
    localStorage.clear()
    navigate("/login")
  }

  const getNavItems = () => {
    if (userRole === "HR") {
      return [
        { path: "/hrpage", label: "Dashboard", icon: Home },
        { path: "/hr/announcements", label: "Announcements", icon: Users },
        { path: "/hr/job-applications", label: "Applications", icon: FileText },
        { path: "/hr/resume-review", label: "Resume Review", icon: UserCheck },
        { path: "/hrprofile", label: "Profile", icon: User },
      ]
    } else {
      return [
        { path: "/employeepage", label: "Dashboard", icon: Home },
        { path: "/timelog", label: "Timelog", icon: Briefcase },
        { path: "/employeeprofile", label: "Profile", icon: User },
      ]
    }
  }

  const navItems = getNavItems()

  return (
    <header className="bg-[#7a1b3a] shadow-lg border-b border-[#6b1832]">
      <div className="w-full px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
        <div className="flex items-center space-x-4">
        <div className="bg-white/20 p-2.5 rounded-lg shadow-sm backdrop-blur-sm">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
          <div className="flex items-center">
            <h1 className="text-2xl font-semibold text-white tracking-tight">
            TechStaffHub
            </h1>
            <span className="ml-2 text-sm text-white/80 font-medium">HRMS</span>
            </div>
          </div>

          <nav className="hidden md:flex flex-1 justify-center space-x-1 mx-8">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? "bg-white/20 text-white shadow-sm backdrop-blur-sm" 
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                  {item.label === "Notifications" && unreadCount > 0 && userRole !== "HR" && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center ml-1">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center space-x-3">
            {userRole === "HR" && (
              <button
                onClick={() => {
                  navigate('/hrpage');
                  setTimeout(() => {
                    const event = new CustomEvent('setActiveSection', { detail: 'notifications' });
                    window.dispatchEvent(event);
                  }, 100);
                }}
                className="relative p-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                title="Notifications"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>
            )}
            {userRole === "EMPLOYEE" && (
              <Link
                to="/employee/notifications"
                className="relative p-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                title="Notifications"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </Link>
            )}
            <div className="h-6 w-px bg-white/30"></div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-white/90 hover:text-white hover:bg-red-600/20 rounded-lg transition-all duration-200 border border-white/20 hover:border-red-400/50"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-white/20 pt-4 pb-4">
          <div className="flex flex-wrap gap-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? "bg-white/20 text-white shadow-sm backdrop-blur-sm" 
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                  {item.label === "Notifications" && unreadCount > 0 && userRole !== "HR" && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 ml-2">{unreadCount}</span>
                  )}
                </Link>
              )
            })}
          </div>
          
          {/* Mobile Action Buttons */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/20">
            <div className="flex items-center space-x-3">
              {userRole === "HR" && (
                <button
                  onClick={() => {
                    navigate('/hrpage');
                    setTimeout(() => {
                      const event = new CustomEvent('setActiveSection', { detail: 'notifications' });
                      window.dispatchEvent(event);
                    }, 100);
                  }}
                  className="relative p-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                  title="Notifications"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>
              )}
              {userRole === "EMPLOYEE" && (
                <Link
                  to="/employee/notifications"
                  className="relative p-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                  title="Notifications"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              )}
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-white/90 hover:text-white hover:bg-red-600/20 rounded-lg transition-all duration-200 border border-white/20 hover:border-red-400/50"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header

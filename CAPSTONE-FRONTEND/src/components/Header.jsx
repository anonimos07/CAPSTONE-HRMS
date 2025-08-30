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
        { path: "/hr/notifications", label: "Notifications", icon: Bell },
        { path: "/hrprofile", label: "Profile", icon: User },
      ]
    } else {
      return [
        { path: "/employeepage", label: "Dashboard", icon: Home },
        { path: "/employee/notifications", label: "Notifications", icon: Bell },
        { path: "/timelog", label: "Timelog", icon: Briefcase },
        { path: "/employeeprofile", label: "Profile", icon: User },
      ]
    }
  }

  const navItems = getNavItems()

  return (
    <header className="bg-white shadow-lg border-b">
      <div className="w-full px-4">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold" style={{ color: "#8b1e3f" }}>
            TechStaffHub
            </h1>
          </div>

          <nav className="hidden md:flex flex-1 justify-center space-x-6 mx-8">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive ? "text-white" : "text-gray-600 hover:bg-gray-50"
                  }`}
                  style={isActive ? { backgroundColor: "#8b1e3f" } : { color: "inherit" }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.target.style.color = "#8b1e3f"
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.target.style.color = ""
                    }
                  }}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                  {item.label === "Notifications" && unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center ml-1">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center space-x-4">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t pt-6 pb-4">
          <div className="flex flex-wrap gap-3">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                    isActive ? "text-white" : "text-gray-600 hover:bg-gray-50"
                  }`}
                  style={isActive ? { backgroundColor: "#8b1e3f" } : { color: "inherit" }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.target.style.color = "#8b1e3f"
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.target.style.color = ""
                    }
                  }}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                  {item.label === "Notifications" && unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 ml-2">{unreadCount}</span>
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header

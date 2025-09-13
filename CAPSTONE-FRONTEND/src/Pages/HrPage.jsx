import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, Building2, UserPlus, Bell, Eye, Trash2, AlertTriangle } from "lucide-react"
import TimelogWidget from "../components/TimelogWidget"
import PhilippineHolidaysCalendar from "../components/PhilippineHolidaysCalendar"
import TimelogManagement from "../components/TimelogManagement"
import HrAttendanceSummary from "../components/HrAttendanceSummary"
import HrLeaveManagement from "../components/HrLeaveManagement"
import LeaveRequestForm from "../components/LeaveRequestForm"
import LeaveBalanceCard from "../components/LeaveBalanceCard"
import LeaveRequestsList from "../components/LeaveRequestsList"
import Header from "../components/Header"
import UserList from "../components/UserList"
import ViewUserProfileModal from "../components/ViewUserProfileModal"
import { useActiveAnnouncements } from "../Api"
import { usePendingRequestsCount } from "../Api/hooks/useLeaveRequests"
import { useHr } from "../Api/hooks/useHr"
import { usePositions } from "../Api/hooks/usePositions"
import { useQueryClient } from "@tanstack/react-query"
import {
  useUserNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
  useDeleteNotification,
  useClearNotificationCache,
} from "../Api/hooks/useNotifications"
import { toast } from 'react-toastify'

const HrPage = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("dashboard")
  const [leaveTab, setLeaveTab] = useState("request") // 'manage' or 'request'
  const [managementTab, setManagementTab] = useState("users") // 'users' or 'positions'
  const [showCreateHRForm, setShowCreateHRForm] = useState(false)
  const [showCreateEmployeeForm, setShowCreateEmployeeForm] = useState(false)
  const [showCreatePositionForm, setShowCreatePositionForm] = useState(false)
  const [showViewProfileModal, setShowViewProfileModal] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [selectedUserRole, setSelectedUserRole] = useState(null)

  // Pagination states
  const [manageRequestsPage, setManageRequestsPage] = useState(1)
  const [myRequestsPage, setMyRequestsPage] = useState(1)
  const [notificationsPage, setNotificationsPage] = useState(1)
  const notificationsPerPage = 5

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    notificationId: null,
    notificationTitle: ''
  })

  const navigate = useNavigate()
  const { data: announcements = [], isLoading } = useActiveAnnouncements()
  const { data: pendingCount = 0 } = usePendingRequestsCount()

  const queryClient = useQueryClient()
  const { createHRMutation, createEmployeeMutation } = useHr()
  const { data: positions = [], createPositionMutation } = usePositions()

  // Notification hooks
  const { data: notifications = [], isLoading: notificationsLoading } = useUserNotifications()
  const markAsReadMutation = useMarkNotificationAsRead()
  const markAllAsReadMutation = useMarkAllNotificationsAsRead()
  const deleteMutation = useDeleteNotification()

  // Get current user ID from localStorage
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}")
  const employeeId = currentUser.userId

  // Check if user can manage leave requests (HR-Manager or HR-Supervisor only)
  const canManageLeaveRequests = () => {
    const userPosition = localStorage.getItem("position")
    return userPosition === "HR-Manager" || userPosition === "HR-Supervisor"
  }

  // Check if user can access leave management page (all HR users)
  const canAccessLeaveManagement = () => {
    return currentUser.role === "HR"
  }

  // Form states
  const [hrForm, setHrForm] = useState({
    username: "",
    password: "",
    position: { title: "" },
  })

  const [employeeForm, setEmployeeForm] = useState({
    username: "",
    password: "",
    position: { title: "" },
  })

  const [positionForm, setPositionForm] = useState({
    title: "",
  })

  const handleCreateHR = (e) => {
    e.preventDefault()
    createHRMutation.mutate(hrForm, {
      onSuccess: () => {
        setHrForm({ username: "", password: "", position: { title: "" } })
        setShowCreateHRForm(false)
        toast.success('HR account created successfully!')
      },
    })
  }

  const handleCreateEmployee = (e) => {
    e.preventDefault()
    createEmployeeMutation.mutate(employeeForm, {
      onSuccess: () => {
        setEmployeeForm({ username: "", password: "", position: { title: "" } })
        setShowCreateEmployeeForm(false)
        toast.success('Employee account created successfully!')
      },
    })
  }

  const handleCreatePosition = (e) => {
    e.preventDefault()
    createPositionMutation.mutate(positionForm, {
      onSuccess: () => {
        setPositionForm({ title: "" })
        setShowCreatePositionForm(false)
        queryClient.invalidateQueries({ queryKey: ["positions"] })
      },
    })
  }

  const handleViewProfile = (userId, userRole) => {
    setSelectedUserId(userId)
    setSelectedUserRole(userRole)
    setShowViewProfileModal(true)
  }

  const handleCloseProfileModal = () => {
    setShowViewProfileModal(false)
    setSelectedUserId(null)
    setSelectedUserRole(null)
  }

  const clearNotificationCache = useClearNotificationCache()

  const handleLogout = () => {
    setIsDropdownOpen(false)
    // Clear all TanStack Query cache when logging out
    queryClient.clear()
    clearNotificationCache()
    localStorage.clear()
    window.location.href = "/login"
  }

  // Listen for header bell click event
  useEffect(() => {
    const handleSetActiveSection = (event) => {
      setActiveSection(event.detail)
    }

    window.addEventListener("setActiveSection", handleSetActiveSection)
    return () => {
      window.removeEventListener("setActiveSection", handleSetActiveSection)
    }
  }, [])

  // Notification handlers
  const handleMarkAsRead = (notificationId) => {
    markAsReadMutation.mutate(notificationId, {
      onSuccess: () => {
        // Optionally show success feedback
        console.log('Notification marked as read successfully');
      },
      onError: (error) => {
        console.error('Failed to mark notification as read:', error);
      }
    })
  }

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate(undefined, {
      onSuccess: () => {
        console.log('All notifications marked as read successfully');
      },
      onError: (error) => {
        console.error('Failed to mark all notifications as read:', error);
      }
    })
  }

  const handleDeleteNotification = (notificationId, notificationTitle) => {
    setDeleteModal({
      isOpen: true,
      notificationId,
      notificationTitle
    })
  }

  const confirmDelete = () => {
    deleteMutation.mutate(deleteModal.notificationId, {
      onSuccess: () => {
        // If we deleted the last item on the current page and we're not on page 1
        if (paginatedNotifications.length === 1 && notificationsPage > 1) {
          setNotificationsPage(notificationsPage - 1)
        }
        setDeleteModal({ isOpen: false, notificationId: null, notificationTitle: '' })
        console.log('Notification deleted successfully')
      },
      onError: (error) => {
        console.error('Failed to delete notification:', error)
      }
    })
  }

  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, notificationId: null, notificationTitle: '' })
  }

  // Use notifications directly from API
  const visibleNotifications = notifications || []
  const unreadCount = visibleNotifications.filter((notification) => !notification.read).length

  // Notification icon and color helpers
  const getNotificationIcon = (type) => {
    switch (type) {
      case "ANNOUNCEMENT":
        return "📢"
      case "JOB_APPLICATION":
        return "📋"
      case "LEAVE_REQUEST":
        return "🏖️"
      case "TIMELOG_EDIT_REQUEST":
        return "⏰"
      case "SYSTEM":
        return "⚙️"
      default:
        return "📝"
    }
  }

  const getNotificationColor = (type) => {
    switch (type) {
      case "ANNOUNCEMENT":
        return "bg-white text-[#8b1e3f]"
      case "JOB_APPLICATION":
        return "bg-green-100 text-green-800"
      case "LEAVE_REQUEST":
        return "bg-purple-100 text-purple-800"
      case "TIMELOG_EDIT_REQUEST":
        return "bg-orange-100 text-orange-800"
      case "SYSTEM":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-white text-red-800"
    }
  }

  // Pagination logic for notifications
  const totalNotifications = visibleNotifications.length
  const totalPages = Math.ceil(totalNotifications / notificationsPerPage)
  const startIndex = (notificationsPage - 1) * notificationsPerPage
  const endIndex = startIndex + notificationsPerPage
  const paginatedNotifications = visibleNotifications.slice(startIndex, endIndex)

  // Custom pagination function
  const CustomPagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null

    return (
      <div className="flex items-center justify-center gap-2 mt-6">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-3 py-2 text-sm font-medium text-[#8b1e3f] bg-white border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              page === currentPage
                ? "bg-[#8b1e3f] text-white"
                : "text-[#8b1e3f] bg-white border border-red-200 hover:bg-red-50"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-2 text-sm font-medium text-[#8b1e3f] bg-white border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      <Header userRole="HR" />

      {/* Main Content */}
      <main className="flex gap-8 px-8 py-8">
        {/* Left Sidebar */}
        <aside className="w-1/4">
          {/* User Card */}

          {/* Timelog Widget */}
          <TimelogWidget />

          {/* Spacing */}
          <div className="h-4"></div>

          {/* Philippine Holidays Calendar */}
          <PhilippineHolidaysCalendar />
        </aside>

        {/* Center Content */}
        <section className="flex-1">
          {/* Dashboard Section */}
          {activeSection === "dashboard" && (
            <>
              <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-xl p-8 mb-6 relative border border-red-100">
                <button className="absolute top-4 right-4 text-gray-400 hover:text-[#8b1e3f] text-xl transition-colors">
                  ×
                </button>

                <div className="text-gray-700 mb-6 text-center max-w-2xl mx-auto">
                  You're looking at <span className="font-semibold text-[#8b1e3f]">TechStaffHub</span>, your new tool
                  for work. Here's a quick look at some of the things you can do with TechStaffHub.
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <button
                    onClick={() => setActiveSection("management")}
                    className="bg-gradient-to-br from-red-50 to-white rounded-lg p-6 flex flex-col items-center hover:shadow-lg transition-all duration-200 border border-red-100 hover:border-[#8b1e3f]/30"
                  >
                    <span className="text-4xl mb-3">🗓️</span>
                    <div className="font-semibold text-[#8b1e3f] text-lg">User Management</div>
                    <div className="text-sm text-gray-600 text-center mt-2">
                      Create and manage user accounts for your organization.
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveSection("attendance")}
                    className="bg-gradient-to-br from-red-50 to-white rounded-lg p-6 flex flex-col items-center hover:shadow-lg transition-all duration-200 border border-red-100 hover:border-[#8b1e3f]/30"
                  >
                    <span className="text-4xl mb-3">🗓️</span>
                    <div className="font-semibold text-[#8b1e3f] text-lg">My Attendance</div>
                    <div className="text-sm text-gray-600 text-center mt-2">
                      Check your latest and previous attendances.
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveSection("timelog")}
                    className="bg-gradient-to-br from-red-50 to-white rounded-lg p-6 flex flex-col items-center hover:shadow-lg transition-all duration-200 border border-red-100 hover:border-[#8b1e3f]/30"
                  >
                    <span className="text-4xl mb-3">⏰</span>
                    <div className="font-semibold text-[#8b1e3f] text-lg">Timelog Management</div>
                    <div className="text-sm text-gray-600 text-center mt-2">
                      View and manage employee attendance records.
                    </div>
                  </button>

                  <button
                    onClick={() => (canAccessLeaveManagement() ? setActiveSection("leave") : null)}
                    disabled={!canAccessLeaveManagement()}
                    className={`rounded-lg p-6 flex flex-col items-center transition-all duration-200 relative border ${
                      !canAccessLeaveManagement()
                        ? "bg-gray-100 cursor-not-allowed opacity-50 border-gray-200"
                        : "bg-gradient-to-br from-red-50 to-white hover:shadow-lg border-red-100 hover:border-[#8b1e3f]/30"
                    }`}
                    title={!canAccessLeaveManagement() ? "Only HR users can access leave management" : ""}
                  >
                    <span className="text-4xl mb-3">🏖️</span>
                    <div className="font-semibold text-[#8b1e3f] text-lg">Leave Management</div>
                    <div className="text-sm text-gray-600 text-center mt-2">
                      File leave requests and manage approvals.
                    </div>
                    {canManageLeaveRequests() && pendingCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
                        {pendingCount}
                      </span>
                    )}
                  </button>
                    <a
                    href="/hr/notifications"
                    className="bg-gradient-to-br from-red-50 to-white rounded-lg p-6 flex flex-col items-center hover:shadow-lg transition-all duration-200 border border-red-100 hover:border-[#8b1e3f]/30"
                  >
                    <span className="text-4xl mb-3">🔔</span>
                    <div className="font-semibold text-[#8b1e3f] text-lg">Create Notifications</div>
                    <div className="text-sm text-gray-600 text-center mt-2">
                      Send notifications to employees and manage communications.
                    </div>
                  </a>
                </div>
              </div>
            </>
          )}

          {/* Timelog Management Section */}
          {activeSection === "timelog" && (
            <div className="space-y-6">
              <button
                onClick={() => setActiveSection("dashboard")}
                className="flex items-center gap-2 text-[#8b1e3f] hover:text-[#8b1e3f]/80 font-semibold transition-colors mb-4"
              >
                <span>←</span> Back to Dashboard
              </button>
              <TimelogManagement />
            </div>
          )}

          {/* HR Attendance Summary Section */}
          {activeSection === "attendance" && (
            <div className="space-y-6">
              <button
                onClick={() => setActiveSection("dashboard")}
                className="flex items-center gap-2 text-[#8b1e3f] hover:text-[#8b1e3f]/80 font-semibold transition-colors mb-4"
              >
                <span>←</span> Back to Dashboard
              </button>
              <HrAttendanceSummary />
            </div>
          )}

          {/* Leave Management Section */}
          {activeSection === "leave" && (
            <div className="space-y-6">
              <button
                onClick={() => setActiveSection("dashboard")}
                className="flex items-center gap-2 text-[#8b1e3f] hover:text-[#8b1e3f]/80 font-semibold transition-colors mb-4"
              >
                <span>←</span> Back to Dashboard
              </button>
              {/* Leave Management Tabs */}
              <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-xl p-4 border border-red-100">
                <div className="flex gap-4 border-b border-red-100 pb-3 mb-4">
                  {canManageLeaveRequests() && (
                    <button
                      onClick={() => setLeaveTab("manage")}
                      className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                        leaveTab === "manage" ? "bg-[#8b1e3f] text-white shadow-lg" : "text-[#8b1e3f] hover:bg-red-50"
                      }`}
                    >
                      Manage Requests
                      {pendingCount > 0 && (
                        <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 inline-flex items-center justify-center animate-pulse">
                          {pendingCount}
                        </span>
                      )}
                    </button>
                  )}
                  <button
                    onClick={() => setLeaveTab("request")}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                      leaveTab === "request" ? "bg-[#8b1e3f] text-white shadow-lg" : "text-[#8b1e3f] hover:bg-red-50"
                    }`}
                  >
                    My Leave Requests
                  </button>
                </div>

                {/* Tab Content */}
                {leaveTab === "manage" && canManageLeaveRequests() && (
                  <HrLeaveManagement
                    currentPage={manageRequestsPage}
                    onPageChange={setManageRequestsPage}
                    itemsPerPage={2}
                  />
                )}

                {leaveTab === "manage" && !canManageLeaveRequests() && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <div className="flex items-center gap-3 text-yellow-800">
                      <span className="text-2xl">⚠️</span>
                      <div>
                        <h4 className="font-semibold text-lg">Access Restricted</h4>
                        <p className="text-sm mt-1">
                          Only HR-Manager and HR-Supervisor positions can manage leave requests.
                        </p>
                        <p className="text-sm mt-1">
                          You can still file your own leave requests using the "My Leave Requests" tab.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {leaveTab === "request" && (
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <LeaveRequestForm employeeId={employeeId} />
                      <LeaveBalanceCard employeeId={employeeId} />
                    </div>
                    <div>
                      <LeaveRequestsList
                        employeeId={employeeId}
                        currentPage={myRequestsPage}
                        onPageChange={setMyRequestsPage}
                        itemsPerPage={2}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* User Management Section */}
          {activeSection === "management" && (
            <div className="space-y-6">
              <button
                onClick={() => setActiveSection("dashboard")}
                className="flex items-center gap-2 text-[#8b1e3f] hover:text-[#8b1e3f]/80 font-semibold transition-colors mb-4"
              >
                <span>←</span> Back to Dashboard
              </button>
              {/* Management Tabs */}
              <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-xl p-4 border border-red-100">
                <div className="flex gap-4 border-b border-red-100 pb-3 mb-4">
                  <button
                    onClick={() => setManagementTab("users")}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                      managementTab === "users" ? "bg-[#8b1e3f] text-white shadow-lg" : "text-[#8b1e3f] hover:bg-red-50"
                    }`}
                  >
                    User Management
                  </button>
                  <button
                    onClick={() => setManagementTab("positions")}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                      managementTab === "positions"
                        ? "bg-[#8b1e3f] text-white shadow-lg"
                        : "text-[#8b1e3f] hover:bg-red-50"
                    }`}
                  >
                    Position Management
                  </button>
                </div>

                {/* User Management Tab */}
                {managementTab === "users" && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      {/* <h2 className="text-2xl font-bold text-[#8b1e3f]">User Management</h2> */}
                      <div className="flex space-x-3">
                        <button
                          onClick={() => setShowCreateHRForm(true)}
                          className="flex items-center space-x-2 bg-[#8b1e3f] text-white px-6 py-3 rounded-lg hover:bg-[#8b1e3f]/90 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
                        >
                          <UserPlus className="h-4 w-4" />
                          <span>Create HR</span>
                        </button>
                        <button
                          onClick={() => setShowCreateEmployeeForm(true)}
                          className="flex items-center space-x-2 bg-[#8b1e3f] text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
                        >
                          <UserPlus className="h-4 w-4" />
                          <span>Create Employee</span>
                        </button>
                      </div>
                    </div>

                    {/* User List Component */}
                    <UserList onViewProfile={handleViewProfile} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6"></div>
                  </div>
                )}

                {/* Position Management Tab */}
                {managementTab === "positions" && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold text-[#8b1e3f]">Position Management</h2>
                      <button
                        onClick={() => setShowCreatePositionForm(true)}
                        className="flex items-center space-x-2 bg-[#8b1e3f] text-white px-6 py-3 rounded-lg hover:bg-[#8b1e3f]/90 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add Position</span>
                      </button>
                    </div>

                    <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-red-100">
                      <div className="p-6 border-b border-red-100">
                        <h3 className="text-lg font-semibold text-[#8b1e3f]">Company Positions</h3>
                      </div>
                      <div className="p-6">
                        {positions.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {positions.map((position) => (
                              <div
                                key={position.positionId}
                                className="p-4 border border-red-200 rounded-lg bg-red-50/50 hover:bg-red-50 transition-colors"
                              >
                                <div className="flex items-center space-x-2">
                                  <Building2 className="h-5 w-5 text-[#8b1e3f]" />
                                  <span className="font-medium text-[#8b1e3f]">{position.title}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <Building2 className="h-12 w-12 text-red-300 mx-auto mb-4" />
                            <p className="text-gray-500">No positions created yet</p>
                            <button
                              onClick={() => setShowCreatePositionForm(true)}
                              className="mt-2 text-[#8b1e3f] hover:text-[#8b1e3f]/80 font-semibold"
                            >
                              Create your first position
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notifications Section */}
          {activeSection === "notifications" && (
            <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-xl border border-red-100">
              {/* Header */}
              <div className="p-6 border-b border-red-100">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Bell className="h-6 w-6 text-[#8b1e3f]" />
                    <h2 className="text-2xl font-bold text-[#8b1e3f]">HR Notifications</h2>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-sm text-gray-600">
                      {unreadCount > 0 && (
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                          {unreadCount} unread
                        </span>
                      )}
                    </div>
                    {visibleNotifications.some((n) => !n.read) && (
                      <button
                        onClick={handleMarkAllAsRead}
                        disabled={markAllAsReadMutation.isPending}
                        className="bg-[#8b1e3f] text-white px-4 py-2 rounded-lg hover:bg-[#8b1e3f]/90 transition-colors disabled:opacity-50 text-sm font-medium flex items-center gap-2"
                      >
                        {markAllAsReadMutation.isPending ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            Marking...
                          </>
                        ) : (
                          'Mark All as Read'
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Notifications List */}
              <div className="p-6">
                {notificationsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8b1e3f]"></div>
                    <span className="ml-3 text-gray-600">Loading notifications...</span>
                  </div>
                ) : visibleNotifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <Bell className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <p className="text-lg font-medium text-gray-900 mb-2">No notifications yet</p>
                    <p className="text-gray-500">You'll see HR-related notifications and updates here</p>
                  </div>
                ) : (
                  <>
                    <div className="divide-y divide-gray-300">
                      {paginatedNotifications.map((notification) => (
                        <div
                          key={notification.notificationId}
                          className={`p-6 transition-colors ${
                            !notification.read ? "bg-[#8b1e3f]/15 border-l-4 border-l-[#8b1e3f]" : "bg-white"
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex space-x-4 flex-1">
                              <div className="flex-shrink-0">
                                <div
                                  className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${getNotificationColor(notification.type)}`}
                                >
                                  {getNotificationIcon(notification.type)}
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="text-lg font-semibold text-gray-900 truncate">{notification.title}</h3>
                                  {!notification.read && (
                                    <span className="bg-[#8b1e3f] text-white text-xs px-2 py-1 rounded-full font-medium">
                                      NEW
                                    </span>
                                  )}
                                </div>
                                <p className="text-gray-700 mb-3 leading-relaxed">{notification.message}</p>
                                <div className="flex items-center text-sm text-gray-500 space-x-2">
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${getNotificationColor(notification.type)}`}
                                  >
                                    {notification.type.replace("_", " ")}
                                  </span>
                                  <span>•</span>
                                  <span>{new Date(notification.createdAt).toLocaleDateString()}</span>
                                  <span>•</span>
                                  <span>{new Date(notification.createdAt).toLocaleTimeString()}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex space-x-2 ml-4">
                              {!notification.read && (
                                <button
                                  onClick={() => handleMarkAsRead(notification.notificationId)}
                                  disabled={markAsReadMutation.isPending}
                                  className="p-2 text-[#8b1e3f] hover:bg-[#8b1e3f]/20 rounded-lg transition-colors disabled:opacity-50"
                                  title="Mark as read"
                                >
                                  <Eye size={16} />
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteNotification(notification.notificationId, notification.title)}
                                disabled={deleteMutation.isPending}
                                className="p-2 text-red-600 hover:bg-red-200 rounded-lg transition-colors disabled:opacity-50"
                                title="Delete notification"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Custom Pagination */}
                    <CustomPagination
                      currentPage={notificationsPage}
                      totalPages={totalPages}
                      onPageChange={setNotificationsPage}
                    />
                  </>
                )}
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Create HR Modal */}
      {showCreateHRForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg p-6 w-full max-w-md shadow-2xl border border-red-100">
            <h3 className="text-lg font-semibold text-[#8b1e3f] mb-4">Create HR Account</h3>
            <form onSubmit={handleCreateHR} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#8b1e3f] mb-1">Username</label>
                <input
                  type="text"
                  value={hrForm.username}
                  onChange={(e) => setHrForm({ ...hrForm, username: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-red-200 rounded-lg focus:ring-2 focus:ring-[#8b1e3f]/50 focus:border-[#8b1e3f]/50 bg-white/80"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#8b1e3f] mb-1">Password</label>
                <input
                  type="password"
                  value={hrForm.password}
                  onChange={(e) => setHrForm({ ...hrForm, password: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-red-200 rounded-lg focus:ring-2 focus:ring-[#8b1e3f]/50 focus:border-[#8b1e3f]/50 bg-white/80"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#8b1e3f] mb-1">Position Title</label>
                <select
                  value={hrForm.position.title}
                  onChange={(e) => setHrForm({ ...hrForm, position: { title: e.target.value } })}
                  required
                  className="w-full px-3 py-2 border border-red-200 rounded-lg focus:ring-2 focus:ring-[#8b1e3f]/50 focus:border-[#8b1e3f]/50 bg-white/80"
                >
                  <option value="">Select Position</option>
                  {positions.map((position) => (
                    <option key={position.positionId} value={position.title}>
                      {position.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateHRForm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createHRMutation.isPending}
                  className="px-4 py-2 bg-[#8b1e3f] text-white rounded-lg hover:bg-[#8b1e3f]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
                >
                  Create HR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Employee Modal */}
      {showCreateEmployeeForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg p-6 w-full max-w-md shadow-2xl border border-red-100">
            <h3 className="text-lg font-semibold text-[#8b1e3f] mb-4">Create Employee Account</h3>
            <form onSubmit={handleCreateEmployee} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#8b1e3f] mb-1">Username</label>
                <input
                  type="text"
                  value={employeeForm.username}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, username: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-red-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/80"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#8b1e3f] mb-1">Password</label>
                <input
                  type="password"
                  value={employeeForm.password}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, password: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-red-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/80"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#8b1e3f] mb-1">Position Title</label>
                <select
                  value={employeeForm.position.title}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, position: { title: e.target.value } })}
                  required
                  className="w-full px-3 py-2 border border-red-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/80"
                >
                  <option value="">Select Position</option>
                  {positions.map((position) => (
                    <option key={position.positionId} value={position.title}>
                      {position.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateEmployeeForm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createEmployeeMutation.isPending}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
                >
                  Create Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Position Modal */}
      {showCreatePositionForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg p-6 w-full max-w-md shadow-2xl border border-red-100">
            <h3 className="text-lg font-semibold text-[#8b1e3f] mb-4">Add New Position</h3>
            <form onSubmit={handleCreatePosition} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#8b1e3f] mb-1">Position Title</label>
                <input
                  type="text"
                  value={positionForm.title}
                  onChange={(e) => setPositionForm({ title: e.target.value })}
                  required
                  placeholder="e.g., Software Engineer, HR Manager, Marketing Specialist"
                  className="w-full px-3 py-2 border border-red-200 rounded-lg focus:ring-2 focus:ring-[#8b1e3f]/50 focus:border-[#8b1e3f]/50 bg-white/80"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreatePositionForm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createPositionMutation.isLoading}
                  className="px-4 py-2 bg-[#8b1e3f] text-white rounded-lg hover:bg-[#8b1e3f]/90 disabled:opacity-50 transition-all duration-200 shadow-lg"
                >
                  {createPositionMutation.isLoading ? "Adding..." : "Add Position"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-transparent-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            {/* Warning Icon */}
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center animate-pulse">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <div className="absolute inset-0 w-16 h-16 bg-red-200 rounded-full opacity-30 animate-ping"></div>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
              Delete notification
            </h3>

            {/* Message */}
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to delete this notification? This action cannot be undone.
            </p>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={cancelDelete}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteMutation.isPending}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View User Profile Modal */}
      <ViewUserProfileModal
        isOpen={showViewProfileModal}
        onClose={handleCloseProfileModal}
        userId={selectedUserId}
        userRole={selectedUserRole}
      />
    </div>
  )
}

export default HrPage

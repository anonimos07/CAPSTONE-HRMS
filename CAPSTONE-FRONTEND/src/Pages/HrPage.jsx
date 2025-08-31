import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { Plus, Building2, UserPlus} from "lucide-react"
import TimelogWidget from "../components/TimelogWidget"
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

  const navigate = useNavigate()
  const { data: announcements = [], isLoading } = useActiveAnnouncements()
  const { data: pendingCount = 0 } = usePendingRequestsCount()

  const queryClient = useQueryClient()
  const { createHRMutation, createEmployeeMutation } = useHr()
  const { data: positions = [], createPositionMutation } = usePositions()

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
      },
    })
  }

  const handleCreateEmployee = (e) => {
    e.preventDefault()
    createEmployeeMutation.mutate(employeeForm, {
      onSuccess: () => {
        setEmployeeForm({ username: "", password: "", position: { title: "" } })
        setShowCreateEmployeeForm(false)
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

  const handleLogout = () => {
    localStorage.clear()
    navigate("/")
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

          {/* Company Links Card
          <div className="bg-white/90 backdrop-blur-sm rounded-lg border border-red-100 p-4 mb-6 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" className="inline-block text-[#8b1e3f]">
                  <path
                    d="M17 17a3 3 0 0 1-4.24 0l-2.76-2.76a3 3 0 0 1 0-4.24l1.06-1.06a3 3 0 0 1 4.24 0l2.76 2.76a3 3 0 0 1 0 4.24l-1.06 1.06z"
                    stroke="#8b1e3f"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    d="M7 7a3 3 0 0 1 4.24 0l2.76 2.76a3 3 0 0 1 0 4.24l-1.06 1.06a3 3 0 0 1-4.24 0L5.94 13.06a3 3 0 0 1 0-4.24L7 7z"
                    stroke="#8b1e3f"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
                <span className="font-semibold text-[#8b1e3f]">COMPANY LINKS</span>
              </div>
              <a
                href="#"
                className="text-[#8b1e3f] text-sm hover:text-[#8b1e3f]/80 transition-colors underline underline-offset-2"
              >
                Manage
              </a>
            </div>
            <div className="flex flex-col items-center justify-center py-6">
              <svg width="48" height="48" fill="none" viewBox="0 0 24 24" className="mb-2 text-red-200">
                <path d="M17 7a5 5 0 0 0-10 0v4a5 5 0 0 0 10 0V7z" stroke="#fecaca" strokeWidth="2" fill="none" />
                <path d="M7 17a5 5 0 0 0 10 0v-4a5 5 0 0 0-10 0v4z" stroke="#fecaca" strokeWidth="2" fill="none" />
              </svg>
              <span className="text-gray-500 text-center">Your company hasn't added any Links yet.</span>
            </div>
          </div> */}

        </aside>

        {/* Center Content */}
        <section className="flex-1">
          {/* Navigation Bar */}
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-xl p-4 mb-6 border border-red-100">
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveSection("dashboard")}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  activeSection === "dashboard"
                    ? "bg-[#8b1e3f] text-white shadow-lg"
                    : "text-[#8b1e3f] hover:bg-red-50 hover:shadow-md"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveSection("timelog")}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  activeSection === "timelog"
                    ? "bg-[#8b1e3f] text-white shadow-lg"
                    : "text-[#8b1e3f] hover:bg-red-50 hover:shadow-md"
                }`}
              >
                Timelog Management
              </button>
              <button
                onClick={() => setActiveSection("attendance")}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  activeSection === "attendance"
                    ? "bg-[#8b1e3f] text-white shadow-lg"
                    : "text-[#8b1e3f] hover:bg-red-50 hover:shadow-md"
                }`}
              >
                My Attendance
              </button>
              <button
                onClick={() => (canAccessLeaveManagement() ? setActiveSection("leave") : null)}
                disabled={!canAccessLeaveManagement()}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 relative ${
                  !canAccessLeaveManagement()
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed opacity-50"
                    : activeSection === "leave"
                      ? "bg-[#8b1e3f] text-white shadow-lg"
                      : "text-[#8b1e3f] hover:bg-red-50 hover:shadow-md"
                }`}
                title={!canAccessLeaveManagement() ? "Only HR users can access leave management" : ""}
              >
                Leave Management
                {canManageLeaveRequests() && pendingCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {pendingCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveSection("management")}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  activeSection === "management"
                    ? "bg-[#8b1e3f] text-white shadow-lg"
                    : "text-[#8b1e3f] hover:bg-red-50 hover:shadow-md"
                }`}
              >
                User Management
              </button>
            </div>
          </div>

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
                <div className="grid grid-cols-3 gap-6">
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
                  <a
                    href="/hr/job-applications"
                    className="bg-gradient-to-br from-red-50 to-white rounded-lg p-6 flex flex-col items-center hover:shadow-lg transition-all duration-200 border border-red-100 hover:border-[#8b1e3f]/30"
                  >
                    <span className="text-4xl mb-3">📋</span>
                    <div className="font-semibold text-[#8b1e3f] text-lg">Job Applications</div>
                    <div className="text-sm text-gray-600 text-center mt-2">
                      Manage job applications and applicants.
                    </div>
                  </a>
                  <a
                    href="/hr/resume-review"
                    className="bg-gradient-to-br from-red-50 to-white rounded-lg p-6 flex flex-col items-center hover:shadow-lg transition-all duration-200 border border-red-100 hover:border-[#8b1e3f]/30"
                  >
                    <span className="text-4xl mb-3">📄</span>
                    <div className="font-semibold text-[#8b1e3f] text-lg">Resume Review</div>
                    <div className="text-sm text-gray-600 text-center mt-2">AI-powered resume analysis and review.</div>
                  </a>
                  <a
                    href="/hr/announcements"
                    className="bg-gradient-to-br from-red-50 to-white rounded-lg p-6 flex flex-col items-center hover:shadow-lg transition-all duration-200 border border-red-100 hover:border-[#8b1e3f]/30"
                  >
                    <span className="text-4xl mb-3">📢</span>
                    <div className="font-semibold text-[#8b1e3f] text-lg">Announcements</div>
                    <div className="text-sm text-gray-600 text-center mt-2">
                      Create and manage company announcements.
                    </div>
                  </a>
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
                </div>
              </div>
            </>
          )}

          {/* Timelog Management Section */}
          {activeSection === "timelog" && <TimelogManagement />}

          {/* HR Attendance Summary Section */}
          {activeSection === "attendance" && <HrAttendanceSummary />}

          {/* Leave Management Section */}
          {activeSection === "leave" && (
            <div className="space-y-6">
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
                          className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
                        >
                          <UserPlus className="h-4 w-4" />
                          <span>Create Employee</span>
                        </button>
                      </div>
                    </div>

                    {/* User List Component */}
                    <UserList onViewProfile={handleViewProfile} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-red-100">
                        <h3 className="text-lg font-semibold text-[#8b1e3f] mb-4">HR Staff Management</h3>
                        <p className="text-gray-600 mb-4">
                          Create and manage HR staff accounts with appropriate permissions.
                        </p>
                        <button
                          onClick={() => setShowCreateHRForm(true)}
                          className="w-full bg-red-50 text-[#8b1e3f] px-4 py-3 rounded-lg hover:bg-red-100 transition-all duration-200 font-semibold border border-red-200"
                        >
                          Create New HR Account
                        </button>
                      </div> */}

                      {/* <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-red-100">
                        <h3 className="text-lg font-semibold text-[#8b1e3f] mb-4">Employee Management</h3>
                        <p className="text-gray-600 mb-4">Create and manage employee accounts for the organization.</p>
                        <button
                          onClick={() => setShowCreateEmployeeForm(true)}
                          className="w-full bg-green-50 text-green-700 px-4 py-3 rounded-lg hover:bg-green-100 transition-all duration-200 font-semibold border border-green-200"
                        >
                          Create New Employee Account
                        </button>
                      </div> */}
                    </div>
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

          {/* Announcements section - only show on dashboard
          {activeSection === "dashboard" && (
            <>
              <div className="bg-white/90 backdrop-blur-sm rounded-lg border border-red-100 p-4 mt-6 shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" className="inline-block text-[#8b1e3f]">
                    <path d="M12 20v-6" stroke="#8b1e3f" strokeWidth="2" strokeLinecap="round" />
                    <path d="M6 12a6 6 0 0 1 12 0" stroke="#8b1e3f" strokeWidth="2" fill="none" />
                    <path d="M12 4v2" stroke="#8b1e3f" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <span className="font-semibold text-[#8b1e3f]">COMPANY ANNOUNCEMENTS</span>
                </div>
                <div className="py-4">
                  {isLoading ? (
                    <div className="text-center py-4 text-gray-500">Loading announcements...</div>
                  ) : announcements.length > 0 ? (
                    <div className="space-y-4">
                      {announcements.map((announcement) => (
                        <div
                          key={announcement.id}
                          className="border-l-4 border-[#8b1e3f] pl-4 py-2 bg-red-50/50 rounded-r-lg"
                        >
                          <h3 className="font-semibold text-[#8b1e3f]">{announcement.title}</h3>
                          <p className="text-gray-600 text-sm mt-1">{announcement.content}</p>
                          <div className="text-xs text-gray-500 mt-2">
                            {announcement.priority} • {announcement.createdBy?.username} •{" "}
                            {new Date(announcement.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6">
                      <svg width="40" height="40" fill="none" viewBox="0 0 24 24" className="mb-2 text-red-200">
                        <path d="M12 2v20" stroke="#fecaca" strokeWidth="2" />
                        <path d="M2 12h20" stroke="#fecaca" strokeWidth="2" />
                      </svg>
                      <span className="text-gray-500 text-center">No announcements available</span>
                      </div>
                  )}
                </div>
              </div> */}
              {/* Welcome to TechStaffHub section
              <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4 mt-6 flex flex-col items-center justify-center text-center border border-red-100">
                <div className="font-semibold mb-2 flex items-center gap-2 text-[#8b1e3f]">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="inline-block text-[#8b1e3f]">
                    <rect x="3" y="5" width="18" height="14" rx="2" stroke="#8b1e3f" strokeWidth="2" fill="none" />
                    <path d="M7 8h10M7 12h6" stroke="#8b1e3f" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  WELCOME TO TECHSTAFFHUB
                </div>
                <div className="flex flex-col items-center justify-center mt-4">
                  <svg width="40" height="40" fill="none" viewBox="0 0 24 24" className="mb-2 text-red-200">
                    <rect x="4" y="4" width="16" height="16" rx="4" fill="#fecaca" />
                    <rect x="8" y="8" width="8" height="5" rx="2" fill="#f87171" />
                    <circle cx="12" cy="15" r="2" fill="#f87171" />
                  </svg>
                  <span className="text-gray-500">Nobody will be joining TechStaffHub for the next little while.</span>
                </div>
              </div>
            </>
          )} */}
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
                  disabled={createHRMutation.isLoading}
                  className="px-4 py-2 bg-[#8b1e3f] text-white rounded-lg hover:bg-[#8b1e3f]/90 disabled:opacity-50 transition-all duration-200 shadow-lg"
                >
                  {createHRMutation.isLoading ? "Creating..." : "Create HR"}
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
                  disabled={createEmployeeMutation.isLoading}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-all duration-200 shadow-lg"
                >
                  {createEmployeeMutation.isLoading ? "Creating..." : "Create Employee"}
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
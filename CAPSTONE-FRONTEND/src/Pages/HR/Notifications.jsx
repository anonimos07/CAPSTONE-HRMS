import { useState } from "react"
import Header from "../../components/Header"
import { useAllNotifications, useSendNotification } from "../../Api"
import { Bell, Send, User, AlertCircle, CheckCircle, X, ChevronLeft, ChevronRight, Filter } from "lucide-react"

const Notifications = () => {
  const { data: notifications = [], isLoading } = useAllNotifications()
  const sendMutation = useSendNotification()

  const [showSendForm, setShowSendForm] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    recipient: "all", // 'all' or 'individual'
    userId: "",
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [toast, setToast] = useState({ show: false, message: "", type: "" })
  const [filters, setFilters] = useState({
    sortOrder: "desc", // 'asc' or 'desc'
    type: "all", // 'all', 'ANNOUNCEMENT', 'JOB_APPLICATION'
    month: "all" // 'all', '1', '2', ... '12'
  })
  
  const notificationsPerPage = 5

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }))
    setCurrentPage(1) // Reset to first page when filters change
  }

  const handleSendNotification = (e) => {
    e.preventDefault()

    const notificationData = {
      title: formData.title,
      message: formData.message,
      ...(formData.recipient === "individual" && { userId: formData.userId }),
    }

    sendMutation.mutate(notificationData, {
      onSuccess: () => {
        setToast({ show: true, message: "Notification sent successfully!", type: "success" })
        setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000)
        setFormData({ title: "", message: "", recipient: "all", userId: "" })
        setShowSendForm(false)
      },
      onError: (error) => {
        console.error("Error sending notification:", error)
        setToast({ show: true, message: "Failed to send notification", type: "error" })
        setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000)
      },
    })
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case "ANNOUNCEMENT":
        return <Bell className="w-5 h-5 text-[#8b1e3f]" />
      case "JOB_APPLICATION":
        return <User className="w-5 h-5 text-green-500" />
      default:
        return <Bell className="w-5 h-5 text-gray-500" />
    }
  }

  // Filter and sort notifications
  const filteredNotifications = notifications
    .filter(notification => {
      // Filter by type
      if (filters.type !== "all" && notification.type !== filters.type) {
        return false
      }
      
      // Filter by month
      if (filters.month !== "all") {
        const notificationMonth = new Date(notification.createdAt).getMonth() + 1
        if (notificationMonth !== parseInt(filters.month)) {
          return false
        }
      }
      
      return true
    })
    .sort((a, b) => {
      // Sort by date
      if (filters.sortOrder === "asc") {
        return new Date(a.createdAt) - new Date(b.createdAt)
      } else {
        return new Date(b.createdAt) - new Date(a.createdAt)
      }
    })

  // Calculate pagination
  const totalPages = Math.ceil(filteredNotifications.length / notificationsPerPage)
  const indexOfLastNotification = currentPage * notificationsPerPage
  const indexOfFirstNotification = indexOfLastNotification - notificationsPerPage
  const currentNotifications = filteredNotifications.slice(
    indexOfFirstNotification,
    indexOfLastNotification
  )

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  // Get month names for filter
  const monthOptions = [
    { value: "all", label: "All Months" },
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userRole="HR" />

      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg z-50 ${
          toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
        }`}>
          {toast.message}
        </div>
      )}

      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">HR Notifications</h1>
          <button
            onClick={() => setShowSendForm(!showSendForm)}
            className="bg-[#8b1e3f] text-white px-4 py-2 rounded-lg hover:bg-[#7a1a37] flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Send Notification
          </button>
        </div>

        {/* Filter Section */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-800">Filter Notifications</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Sort Order Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort Order</label>
              <select
                value={filters.sortOrder}
                onChange={(e) => handleFilterChange("sortOrder", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8b1e3f] focus:border-transparent"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notification Type</label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange("type", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8b1e3f] focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="ANNOUNCEMENT">Announcement</option>
                <option value="JOB_APPLICATION">Job Application</option>
              </select>
            </div>

            {/* Month Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
              <select
                value={filters.month}
                onChange={(e) => handleFilterChange("month", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8b1e3f] focus:border-transparent"
              >
                {monthOptions.map(month => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {showSendForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Send New Notification</h2>
              <button onClick={() => setShowSendForm(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendNotification} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8b1e3f] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8b1e3f] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Send To</label>
                <select
                  name="recipient"
                  value={formData.recipient}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8b1e3f] focus:border-transparent"
                >
                  <option value="all">All Users</option>
                  <option value="individual">Individual User</option>
                </select>
              </div>

              {formData.recipient === "individual" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">User ID</label>
                  <input
                    type="number"
                    name="userId"
                    value={formData.userId}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8b1e3f] focus:border-transparent"
                    required
                  />
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={sendMutation.isPending}
                  className="bg-[#8b1e3f] text-white px-6 py-2 rounded-lg hover:bg-[#7a1a37] disabled:opacity-50 flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {sendMutation.isPending ? "Sending..." : "Send Notification"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowSendForm(false)}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Notifications List */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Bell className="w-5 h-5" />
              All System Notifications ({filteredNotifications.length})
            </h2>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8b1e3f]"></div>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No notifications found matching your filters</p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {currentNotifications.map((notification) => (
                    <div key={notification.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          {getNotificationIcon(notification.type)}
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800 mb-1">{notification.title}</h3>
                            <p className="text-gray-600 mb-2">{notification.message}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>User ID: {notification.userId}</span>
                              <span>Type: {notification.type}</span>
                              <span>{formatDate(notification.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {notification.read ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <div className="w-3 h-3 bg-[#8b1e3f] rounded-full"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-between items-center mt-6">
                    <div className="text-sm text-gray-500">
                      Showing {indexOfFirstNotification + 1} to {Math.min(indexOfLastNotification, filteredNotifications.length)} of {filteredNotifications.length} notifications
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={prevPage}
                        disabled={currentPage === 1}
                        className="p-2 rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => paginate(page)}
                          className={`w-8 h-8 rounded-md ${
                            currentPage === page
                              ? "bg-[#8b1e3f] text-white"
                              : "border border-gray-300 hover:bg-gray-100"
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      
                      <button
                        onClick={nextPage}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Notifications
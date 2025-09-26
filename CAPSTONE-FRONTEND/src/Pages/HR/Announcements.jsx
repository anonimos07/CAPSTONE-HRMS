import { useState } from "react"
import { Plus, ChevronLeft, ChevronRight } from "lucide-react"
import Header from "../../components/Header"
import {
  useActiveAnnouncements,
  useAllAnnouncements,
  useCreateAnnouncement,
  useUpdateAnnouncement,
  useDeactivateAnnouncement,
  useDeleteAnnouncement,
} from "../../Api"

const Announcements = () => {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState(null)
  const [viewMode, setViewMode] = useState("active") // 'active' or 'all'
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    priority: "NORMAL",
  })
  const [toast, setToast] = useState({ show: false, message: "", type: "" })
  const [currentPage, setCurrentPage] = useState(1)
  const announcementsPerPage = 5

  const { data: activeAnnouncements = [], isLoading: loadingActive } = useActiveAnnouncements()
  const { data: allAnnouncements = [], isLoading: loadingAll } = useAllAnnouncements()
  const createMutation = useCreateAnnouncement()
  const updateMutation = useUpdateAnnouncement()
  const deactivateMutation = useDeactivateAnnouncement()
  const deleteMutation = useDeleteAnnouncement()

  const announcements = viewMode === "active" ? activeAnnouncements : allAnnouncements
  const isLoading = viewMode === "active" ? loadingActive : loadingAll

  
  const indexOfLastAnnouncement = currentPage * announcementsPerPage
  const indexOfFirstAnnouncement = indexOfLastAnnouncement - announcementsPerPage
  const currentAnnouncements = announcements.slice(indexOfFirstAnnouncement, indexOfLastAnnouncement)
  const totalPages = Math.ceil(announcements.length / announcementsPerPage)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (editingAnnouncement) {
      updateMutation.mutate(
        { id: editingAnnouncement.id, data: formData },
        {
          onSuccess: () => {
            setEditingAnnouncement(null)
            setFormData({ title: "", content: "", priority: "NORMAL" })
            setShowCreateForm(false)
            setToast({ show: true, message: "Announcement updated successfully!", type: "success" })
            setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000)
          },
          onError: () => {
            setToast({ show: true, message: "Failed to update announcement", type: "error" })
            setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000)
          },
        },
      )
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => {
          setFormData({ title: "", content: "", priority: "NORMAL" })
          setShowCreateForm(false)
          setToast({ show: true, message: "Announcement created successfully!", type: "success" })
          setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000)
        },
        onError: () => {
          setToast({ show: true, message: "Failed to create announcement", type: "error" })
          setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000)
        },
      })
    }
  }

  const handleEdit = (announcement) => {
    setEditingAnnouncement(announcement)
    setFormData({
      title: announcement.title,
      content: announcement.content,
      priority: announcement.priority,
    })
    setShowCreateForm(true)
  }

  const handleDeactivate = (id) => {
    deactivateMutation.mutate(id, {
      onSuccess: () => {
        setToast({ show: true, message: "Announcement deactivated successfully!", type: "success" })
        setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000)
      },
      onError: () => {
        setToast({ show: true, message: "Failed to deactivate announcement", type: "error" })
        setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000)
      },
    })
  }

  const handleDelete = (id) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        setToast({ show: true, message: "Announcement deleted successfully!", type: "success" })
        setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000)
      },
      onError: () => {
        setToast({ show: true, message: "Failed to delete announcement", type: "error" })
        setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000)
      },
    })
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "URGENT":
        return "bg-red-100 text-red-800 border-red-200"
      case "HIGH":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "NORMAL":
        return "bg-[#8b1e3f]/10 text-[#8b1e3f] border-[#8b1e3f]/20"
      case "LOW":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#8b1e3f]">Announcements</h1>
            <p className="text-gray-600 mt-2">Create and manage company announcements</p>
          </div>
          <button
            onClick={() => {
              setShowCreateForm(true)
              setEditingAnnouncement(null)
              setFormData({ title: "", content: "", priority: "NORMAL" })
            }}
            className="bg-[#8b1e3f] hover:bg-[#8b1e3f]/90 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus size={20} />
            <span>New Announcement</span>
          </button>
        </div>

        {/* View Toggle */}
        <div className="mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => {
                setViewMode("active")
                setCurrentPage(1)
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === "active" ? "bg-[#8b1e3f]/10 text-[#8b1e3f]" : "text-gray-600 hover:text-[#8b1e3f]"
              }`}
            >
              Active Announcements ({activeAnnouncements.length})
            </button>
            <button
              onClick={() => {
                setViewMode("all")
                setCurrentPage(1)
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === "all" ? "bg-[#8b1e3f]/10 text-[#8b1e3f]" : "text-gray-600 hover:text-[#8b1e3f]"
              }`}
            >
              All Announcements ({allAnnouncements.length})
            </button>
          </div>
        </div>

        {/* Create/Edit Form */}
        {showCreateForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-[#8b1e3f]">
              {editingAnnouncement ? "Edit Announcement" : "Create New Announcement"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8b1e3f] focus:border-[#8b1e3f]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8b1e3f] focus:border-[#8b1e3f]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8b1e3f] focus:border-[#8b1e3f]"
                >
                  <option value="LOW">Low</option>
                  <option value="NORMAL">Normal</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="bg-[#8b1e3f] hover:bg-[#8b1e3f]/90 text-white px-6 py-2 rounded-lg disabled:opacity-50 transition-colors flex items-center space-x-2"
                >
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  )}
                  <span>
                    {createMutation.isPending || updateMutation.isPending
                      ? "Saving..."
                      : editingAnnouncement
                        ? "Update"
                        : "Create"}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false)
                    setEditingAnnouncement(null)
                    setFormData({ title: "", content: "", priority: "NORMAL" })
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Announcements List */}
        <div className="bg-white rounded-lg shadow-md">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Loading announcements...</div>
          ) : announcements.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No {viewMode === "active" ? "active" : ""} announcements found
            </div>
          ) : (
            <>
              <div className="divide-y divide-gray-200">
                {currentAnnouncements.map((announcement) => (
                  <div key={announcement.id} className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{announcement.title}</h3>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(announcement.priority)}`}
                          >
                            {announcement.priority}
                          </span>
                          {!announcement.active && (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                              Inactive
                            </span>
                          )}
                        </div>
                        <p className="text-gray-700 mb-3">{announcement.content}</p>
                        <div className="text-sm text-gray-500">
                          Created by {announcement.createdBy?.username} on{" "}
                          {new Date(announcement.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center py-4 border-t border-gray-200">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  
                  <div className="flex space-x-1 mx-4">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => paginate(page)}
                        className={`w-8 h-8 rounded-lg transition-colors ${
                          currentPage === page
                            ? "bg-[#8b1e3f] text-white"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Announcements
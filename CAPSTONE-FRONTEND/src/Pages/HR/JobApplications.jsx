import { useState } from "react"
import { Eye, Download, User, Calendar, FileText, Filter, Plus, Briefcase, Mail, Phone, Clock, X } from "lucide-react"
import Header from "../../components/Header"
import { useAllApplications, useUpdateApplicationStatus } from "../../Api"
import { downloadResume as downloadResumeAPI } from "../../Api/jobApplication"
import { useAllJobPositions, useCreateJobPosition } from "../../Api/hooks/useJobPositions"

const JobApplications = () => {
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [statusFilter, setStatusFilter] = useState("all")
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [statusUpdate, setStatusUpdate] = useState({ status: "", reviewNotes: "" })
  const [showJobPostModal, setShowJobPostModal] = useState(false)
  const [jobPostData, setJobPostData] = useState({ title: "", description: "", requirements: "", department: "" })
  const [activeTab, setActiveTab] = useState("applications") // 'applications' or 'positions'
  const [toast, setToast] = useState({ show: false, message: "", type: "" })

  const { data: applications = [], isLoading: applicationsLoading } = useAllApplications()
  const { data: positions = [], isLoading: positionsLoading } = useAllJobPositions()
  const updateStatusMutation = useUpdateApplicationStatus()
  const createPositionMutation = useCreateJobPosition()

  const filteredApplications = applications.filter((app) => statusFilter === "all" || app.status === statusFilter)

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "UNDER_REVIEW":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "SHORTLISTED":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "INTERVIEW_SCHEDULED":
        return "bg-indigo-100 text-indigo-800 border-indigo-200"
      case "REJECTED":
        return "bg-red-100 text-red-800 border-red-200"
      case "HIRED":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleStatusUpdate = (application) => {
    setSelectedApplication(application)
    setStatusUpdate({ status: application.status, reviewNotes: application.reviewNotes || "" })
    setShowStatusModal(true)
  }

  const submitStatusUpdate = () => {
    updateStatusMutation.mutate(
      {
        id: selectedApplication.id,
        statusData: statusUpdate,
      },
      {
        onSuccess: () => {
          setShowStatusModal(false)
          setSelectedApplication(null)
          setStatusUpdate({ status: "", reviewNotes: "" })
        },
      },
    )
  }

  const handleJobPost = () => {
    createPositionMutation.mutate(jobPostData, {
      onSuccess: () => {
        setShowJobPostModal(false)
        setJobPostData({ title: "", description: "", requirements: "", department: "" })
        setToast({ show: true, message: "Job position posted successfully!", type: "success" })
        setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000)
      },
      onError: (error) => {
        console.error("Error posting job:", error)
        setToast({ show: true, message: "Failed to post job position", type: "error" })
        setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000)
      },
    })
  }

  const downloadResume = async (application) => {
    try {
      await downloadResumeAPI(
        application.jobApplicationId,
        application.fileName || `${application.fullName}_resume.pdf`,
      )
    } catch (error) {
      console.error("Error downloading resume:", error)
      setToast({ show: true, message: "Failed to download resume. Please try again.", type: "error" })
      setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000)
    }
  }

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
            <h1 className="text-3xl font-bold text-gray-900">Job Management</h1>
            <p className="text-gray-600 mt-2">Manage job positions and review applications</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowJobPostModal(true)}
              className="bg-[#8b1e3f] text-white px-4 py-2 rounded-lg hover:bg-[#7a1a37] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              disabled={createPositionMutation.isPending}
            >
              {createPositionMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Posting...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Post New Job
                </>
              )}
            </button>
            {activeTab === "applications" && (
              <div className="flex items-center space-x-2">
                <Filter size={20} className="text-gray-500" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#8b1e3f] focus:border-[#8b1e3f]"
                >
                  <option value="all">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="UNDER_REVIEW">Under Review</option>
                  <option value="SHORTLISTED">Shortlisted</option>
                  <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="HIRED">Hired</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("applications")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "applications"
                    ? "border-[#8b1e3f] text-[#8b1e3f]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Applications ({applications.length})
              </button>
              <button
                onClick={() => setActiveTab("positions")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "positions"
                    ? "border-[#8b1e3f] text-[#8b1e3f]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Open Positions ({positions.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-[#8b1e3f]/10 rounded-full">
                <FileText className="h-6 w-6 text-[#8b1e3f]" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-2xl font-semibold text-gray-900">{applications.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <Calendar className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {applications.filter((app) => app.status === "PENDING").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <User className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Shortlisted</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {applications.filter((app) => app.status === "SHORTLISTED").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <User className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Hired</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {applications.filter((app) => app.status === "HIRED").length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "positions" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {positionsLoading ? (
              <div className="col-span-full text-center py-8 text-gray-500">Loading positions...</div>
            ) : positions.length === 0 ? (
              <div className="col-span-full text-center py-8 text-gray-500">
                <Briefcase className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">No open positions</p>
                <p className="text-gray-500">Create your first job posting to start receiving applications</p>
              </div>
            ) : (
              positions.map((position) => (
                <div
                  key={position.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{position.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{position.department}</p>
                      <p className="text-sm text-gray-700 line-clamp-3">{position.description}</p>
                    </div>
                    <div className="ml-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Applications: {applications.filter((app) => app.position === position.title).length}</span>
                      <span>Posted: {new Date(position.createdAt || Date.now()).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          /* Applications List */
          <div className="space-y-6">
            {applicationsLoading ? (
              <div className="text-center py-8 text-gray-500">Loading applications...</div>
            ) : filteredApplications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">No applications found</p>
                <p className="text-gray-500">
                  {statusFilter === "all"
                    ? "No job applications have been submitted yet"
                    : `No applications with status: ${statusFilter}`}
                </p>
              </div>
            ) : (
              filteredApplications.map((application) => (
                <div
                  key={application.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
                          <User className="h-6 w-6 text-gray-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{application.fullName}</h3>
                          <span
                            className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(application.status)}`}
                          >
                            {application.status?.replace("_", " ") || "PENDING"}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 mr-2 text-gray-400" />
                            {application.email}
                          </div>
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 mr-2 text-gray-400" />
                            {application.contact}
                          </div>
                          <div className="flex items-center">
                            <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
                            {application.position}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2 text-gray-400" />
                            Applied: {new Date(application.submittedAt || application.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        {application.reviewNotes && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-md">
                            <p className="text-sm text-gray-700">
                              <strong>Review Notes:</strong> {application.reviewNotes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => downloadResume(application)}
                        className="text-[#8b1e3f] hover:text-[#7a1a37] p-2 hover:bg-[#8b1e3f]/10 rounded-md transition-colors"
                        title="Download Resume"
                      >
                        <Download size={18} />
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(application)}
                        className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded-md transition-colors"
                        title="Update Status"
                      >
                        <Eye size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Job Post Modal */}
        {showJobPostModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/95 backdrop-blur-sm rounded-lg p-6 w-full max-w-md shadow-2xl border border-red-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-[#8b1e3f]">Post New Job Position</h3>
                <button
                  onClick={() => setShowJobPostModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#8b1e3f] mb-1">Job Title</label>
                  <input
                    type="text"
                    value={jobPostData.title}
                    onChange={(e) => setJobPostData({ ...jobPostData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-red-200 rounded-lg focus:ring-2 focus:ring-[#8b1e3f] focus:border-transparent bg-white/80"
                    placeholder="e.g. Senior Software Developer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#8b1e3f] mb-1">Department</label>
                  <input
                    type="text"
                    value={jobPostData.department}
                    onChange={(e) => setJobPostData({ ...jobPostData, department: e.target.value })}
                    className="w-full px-3 py-2 border border-red-200 rounded-lg focus:ring-2 focus:ring-[#8b1e3f] focus:border-transparent bg-white/80"
                    placeholder="e.g. Engineering"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#8b1e3f] mb-1">Description</label>
                  <textarea
                    value={jobPostData.description}
                    onChange={(e) => setJobPostData({ ...jobPostData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-red-200 rounded-lg focus:ring-2 focus:ring-[#8b1e3f] focus:border-transparent bg-white/80"
                    placeholder="Job description and responsibilities..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#8b1e3f] mb-1">Requirements</label>
                  <textarea
                    value={jobPostData.requirements}
                    onChange={(e) => setJobPostData({ ...jobPostData, requirements: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-red-200 rounded-lg focus:ring-2 focus:ring-[#8b1e3f] focus:border-transparent bg-white/80"
                    placeholder="Required skills and qualifications..."
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowJobPostModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleJobPost}
                  disabled={createPositionMutation.isPending || !jobPostData.title || !jobPostData.department}
                  className="px-4 py-2 bg-[#8b1e3f] text-white rounded-lg hover:bg-[#7a1a37] disabled:opacity-50 transition-all duration-200 shadow-lg flex items-center gap-2"
                >
                  {createPositionMutation.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Posting...
                    </>
                  ) : (
                    "Post Job"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200" style={{ display: "none" }}>
          {applicationsLoading ? (
            <div className="p-8 text-center text-gray-500">Loading applications...</div>
          ) : filteredApplications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <FileText className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">No applications found</p>
              <p className="text-gray-500">
                {statusFilter === "all"
                  ? "No job applications have been submitted yet"
                  : `No applications with status: ${statusFilter}`}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applicant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Position
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applied Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredApplications.map((application) => (
                    <tr key={application.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <User className="h-5 w-5 text-gray-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{application.fullName}</div>
                            <div className="text-sm text-gray-500">{application.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {application.position?.title || application.position}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(application.status)}`}
                        >
                          {application.status?.replace("_", " ") || "PENDING"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(application.submittedAt || application.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => downloadResume(application)}
                            className="text-[#8b1e3f] hover:text-[#7a1a37] p-1 hover:bg-[#8b1e3f]/10 rounded"
                            title="Download Resume"
                          >
                            <Download size={16} />
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(application)}
                            className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded"
                            title="Update Status"
                          >
                            <Eye size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Status Update Modal */}
        {showStatusModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-70 overflow-y-auto h-full w-full z-50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 w-96 mx-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">Update Application Status</h3>
                  <button
                    onClick={() => setShowStatusModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Applicant: <strong>{selectedApplication?.fullName}</strong>
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    Position: <strong>{selectedApplication?.position}</strong>
                  </p>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={statusUpdate.status}
                    onChange={(e) => setStatusUpdate({ ...statusUpdate, status: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#8b1e3f] focus:border-[#8b1e3f]"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="UNDER_REVIEW">Under Review</option>
                    <option value="SHORTLISTED">Shortlisted</option>
                    <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
                    <option value="REJECTED">Rejected</option>
                    <option value="HIRED">Hired</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Review Notes (Optional)</label>
                  <textarea
                    value={statusUpdate.reviewNotes}
                    onChange={(e) => setStatusUpdate({ ...statusUpdate, reviewNotes: e.target.value })}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#8b1e3f] focus:border-[#8b1e3f]"
                    placeholder="Add any notes about this application..."
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowStatusModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitStatusUpdate}
                    disabled={updateStatusMutation.isPending}
                    className="px-4 py-2 text-sm font-medium text-white bg-[#8b1e3f] rounded-lg hover:bg-[#7a1a37] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all duration-200"
                  >
                    {updateStatusMutation.isPending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Updating...
                      </>
                    ) : (
                      "Update Status"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default JobApplications
import React, { useState } from 'react';
import { FiCalendar, FiCheck, FiX, FiUser, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { usePendingLeaveRequests, useApproveLeaveRequest, useRejectLeaveRequest } from '../Api/hooks/useLeaveRequests';

const HrLeaveManagement = ({ currentPage, onPageChange, itemsPerPage = 2 }) => {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionType, setActionType] = useState(null); // 'approve' or 'reject'
  const [comments, setComments] = useState('');
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: pendingRequests = [], isLoading } = usePendingLeaveRequests();
  const approveRequest = useApproveLeaveRequest();
  const rejectRequest = useRejectLeaveRequest();

  // Calculate pagination
  const totalPages = Math.ceil(pendingRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRequests = pendingRequests.slice(startIndex, startIndex + itemsPerPage);

  const getLeaveTypeLabel = (type) => {
    switch (type) {
      case 'ANNUAL': return 'Annual';
      case 'SICK': return 'Sick';
      case 'PERSONAL': return 'Personal';
      case 'EMERGENCY': return 'Emergency';
      case 'MATERNITY': return 'Maternity';
      case 'PATERNITY': return 'Paternity';
      case 'BEREAVEMENT': return 'Bereavement';
      default: return type;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleAction = (request, type) => {
    setSelectedRequest(request);
    setActionType(type);
    setComments('');
  };

  const confirmAction = async () => {
    if (!selectedRequest || !actionType) return;

    const actionData = {
      comments: comments
    };

    setIsProcessing(true);

    try {
      // Get current user info for display
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const currentPosition = localStorage.getItem('position') || 'HR';
      const userName = currentUser.username || 'HR User';

      if (actionType === 'approve') {
        await approveRequest.mutateAsync({
          requestId: selectedRequest.id,
          approvalData: actionData
        });
        setToast({ show: true, message: `Leave request approved successfully by ${userName} (${currentPosition})!`, type: "success" });
      } else {
        await rejectRequest.mutateAsync({
          requestId: selectedRequest.id,
          rejectionData: actionData
        });
        setToast({ show: true, message: `Leave request rejected successfully by ${userName} (${currentPosition})!`, type: "success" });
      }

      setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);

      // Reset state
      setSelectedRequest(null);
      setActionType(null);
      setComments('');
    } catch (error) {
      const errorMessage = error.response?.data || error.message;
      if (errorMessage.includes('Insufficient permissions')) {
        setToast({ show: true, message: 'You do not have permission to ' + actionType + ' this request. HR requests require HR-Supervisor or HR-Manager approval.', type: "error" });
      } else {
        setToast({ show: true, message: 'Error processing request: ' + errorMessage, type: "error" });
      }
      setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
    } finally {
      setIsProcessing(false);
    }
  };

  const cancelAction = () => {
    setSelectedRequest(null);
    setActionType(null);
    setComments('');
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <FiCalendar className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-purple-700">Pending Leave Requests</h3>
        </div>
        <div className="text-center py-4 text-gray-500">Loading requests...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg z-50 ${
          toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
        }`}>
          {toast.message}
        </div>
      )}

      <div className="flex items-center gap-2 mb-6">
        <FiCalendar className="w-5 h-5 text-[#8b1e3f]" />
        <h3 className="text-lg font-semibold text-[#8b1e3f]">All Leave Requests</h3>
        <span className="bg-[#8b1e3f]/10 text-[#8b1e3f] px-2 py-1 rounded-full text-sm font-medium">
          {pendingRequests.length}
        </span>
      </div>

      {pendingRequests.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <FiCalendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No pending leave requests</p>
          <p className="text-sm">All caught up!</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {paginatedRequests.map((request) => (
              <div key={request.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#8b1e3f]/10 rounded-full flex items-center justify-center">
                      <FiUser className="w-5 h-5 text-[#8b1e3f]" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">
                        {request.employee?.employeeDetails?.firstName} {request.employee?.employeeDetails?.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {request.employee?.employeeDetails?.department}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    Submitted by: {request.employee?.username || 'Unknown User'} on {formatDate(request.createdAt)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <div className="text-sm font-medium text-gray-700">Leave Type</div>
                    <div className="text-sm text-gray-600">{getLeaveTypeLabel(request.leaveType)}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700">Duration</div>
                    <div className="text-sm text-gray-600">
                      {calculateDays(request.startDate, request.endDate)} day{calculateDays(request.startDate, request.endDate) !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="text-sm font-medium text-gray-700">Dates</div>
                  <div className="text-sm text-gray-600">
                    {formatDate(request.startDate)} - {formatDate(request.endDate)}
                  </div>
                </div>

                {request.reason && (
                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-700">Reason</div>
                    <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      {request.reason}
                    </div>
                  </div>
                )}

                {/* Show approval/rejection info if request is processed */}
                {request.status !== 'PENDING' && request.approvedBy && (
                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-700">
                      {request.status === 'APPROVED' ? 'Approved by' : 'Rejected by'}
                    </div>
                    <div className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
                      {request.approvedBy.username || 'Unknown User'} 
                      ({request.approvedBy.position?.title || 'HR'})
                      {request.approvalComments && (
                        <div className="mt-1 text-gray-600">
                          <strong>Comments:</strong> {request.approvalComments}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {request.status === 'PENDING' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAction(request, 'approve')}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      <FiCheck className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleAction(request, 'reject')}
                      className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      <FiX className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {pendingRequests.length > itemsPerPage && (
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-3 py-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiChevronLeft className="w-4 h-4" />
                Previous
              </button>
              
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              
              <button
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-3 py-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <FiChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}

      {/* Action Modal */}
      {selectedRequest && actionType && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg p-6 w-full max-w-md shadow-2xl border border-red-100">
            <h4 className="text-lg font-semibold text-[#8b1e3f] mb-4">
              {actionType === 'approve' ? 'Approve' : 'Reject'} Leave Request
            </h4>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                <strong>Employee:</strong> {selectedRequest.employee?.employeeDetails?.firstName} {selectedRequest.employee?.employeeDetails?.lastName}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Leave Type:</strong> {getLeaveTypeLabel(selectedRequest.leaveType)}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Dates:</strong> {formatDate(selectedRequest.startDate)} - {formatDate(selectedRequest.endDate)}
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-[#8b1e3f] mb-1">
                Comments {actionType === 'reject' ? '(Required)' : '(Optional)'}
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-red-200 rounded-lg focus:ring-2 focus:ring-[#8b1e3f] focus:border-transparent bg-white/80"
                placeholder={actionType === 'approve' ? 'Add any approval notes...' : 'Please provide a reason for rejection...'}
                required={actionType === 'reject'}
                disabled={isProcessing}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={cancelAction}
                disabled={isProcessing}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                disabled={(actionType === 'reject' && !comments.trim()) || isProcessing}
                className={`px-4 py-2 text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg flex items-center justify-center gap-2 ${
                  actionType === 'approve' 
                    ? 'bg-green-600' 
                    : 'bg-red-600'
                }`}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    {actionType === 'approve' ? 'Approve' : 'Reject'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HrLeaveManagement;
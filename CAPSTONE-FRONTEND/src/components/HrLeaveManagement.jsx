import React, { useState } from 'react';
import { FiCalendar, FiCheck, FiX, FiClock, FiUser, FiMessageSquare } from 'react-icons/fi';
import { usePendingLeaveRequests, useApproveLeaveRequest, useRejectLeaveRequest } from '../Api/hooks/useLeaveRequests';

const HrLeaveManagement = () => {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionType, setActionType] = useState(null); // 'approve' or 'reject'
  const [comments, setComments] = useState('');

  const { data: pendingRequests = [], isLoading } = usePendingLeaveRequests();
  const approveRequest = useApproveLeaveRequest();
  const rejectRequest = useRejectLeaveRequest();

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

    try {
      if (actionType === 'approve') {
        await approveRequest.mutateAsync({
          requestId: selectedRequest.id,
          approvalData: actionData
        });
        alert('Leave request approved successfully!');
      } else {
        await rejectRequest.mutateAsync({
          requestId: selectedRequest.id,
          rejectionData: actionData
        });
        alert('Leave request rejected successfully!');
      }

      // Reset state
      setSelectedRequest(null);
      setActionType(null);
      setComments('');
    } catch (error) {
      const errorMessage = error.response?.data || error.message;
      if (errorMessage.includes('Insufficient permissions')) {
        alert('You do not have permission to ' + actionType + ' this request. HR requests require HR-Supervisor or HR-Manager approval.');
      } else {
        alert('Error processing request: ' + errorMessage);
      }
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
      <div className="flex items-center gap-2 mb-6">
        <FiCalendar className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-purple-700">Pending Leave Requests</h3>
        <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-sm font-medium">
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
        <div className="space-y-4">
          {pendingRequests.map((request) => (
            <div key={request.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <FiUser className="w-5 h-5 text-purple-600" />
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
                  Submitted: {formatDate(request.createdAt)}
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
            </div>
          ))}
        </div>
      )}

      {/* Action Modal */}
      {selectedRequest && actionType && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h4 className="text-lg font-semibold mb-4">
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comments {actionType === 'reject' ? '(Required)' : '(Optional)'}
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
                placeholder={actionType === 'approve' ? 'Add any approval notes...' : 'Please provide a reason for rejection...'}
                required={actionType === 'reject'}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={cancelAction}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                disabled={actionType === 'reject' && !comments.trim()}
                className={`px-4 py-2 rounded-lg text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  actionType === 'approve' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {actionType === 'approve' ? 'Approve' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HrLeaveManagement;

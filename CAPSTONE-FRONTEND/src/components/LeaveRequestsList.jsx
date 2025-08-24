import React from 'react';
import { FiCalendar, FiClock, FiCheck, FiX, FiEye } from 'react-icons/fi';
import { useEmployeeLeaveRequests } from '../Api/hooks/useLeaveRequests';

const LeaveRequestsList = ({ employeeId }) => {
  const { data: leaveRequests = [], isLoading } = useEmployeeLeaveRequests();

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED': return 'text-green-700 bg-green-100';
      case 'REJECTED': return 'text-red-700 bg-red-100';
      case 'PENDING': return 'text-yellow-700 bg-yellow-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'APPROVED': return <FiCheck className="w-4 h-4" />;
      case 'REJECTED': return <FiX className="w-4 h-4" />;
      case 'PENDING': return <FiClock className="w-4 h-4" />;
      default: return <FiEye className="w-4 h-4" />;
    }
  };

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

  if (isLoading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-6 border border-purple-100">
        <div className="flex items-center gap-2 mb-4">
          <FiCalendar className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-purple-700">My Leave Requests</h3>
        </div>
        <div className="text-center py-4 text-gray-500">Loading requests...</div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-6 border border-purple-100">
      <div className="flex items-center gap-2 mb-4">
        <FiCalendar className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-purple-700">My Leave Requests</h3>
      </div>

      {leaveRequests.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <FiCalendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No leave requests found</p>
          <p className="text-sm">Submit your first leave request above</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {leaveRequests.map((request) => (
            <div key={request.id} className="border border-purple-100 rounded-lg p-4 hover:bg-purple-50 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-800">
                    {getLeaveTypeLabel(request.leaveType)} Leave
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(request.status)}`}>
                    {getStatusIcon(request.status)}
                    {request.status}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  Submitted: {formatDate(request.createdAt)}
                </div>
              </div>
              
              <div className="text-xs text-gray-500 mb-2">
                Submitted by: {request.employee?.username || 'Unknown User'}
              </div>
              
              <div className="text-sm text-gray-600 mb-2">
                <strong>Dates:</strong> {formatDate(request.startDate)} - {formatDate(request.endDate)}
              </div>
              
              {request.reason && (
                <div className="text-sm text-gray-600 mb-2">
                  <strong>Reason:</strong> {request.reason}
                </div>
              )}
              
              {request.approvalComments && (
                <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                  <strong>HR Comments:</strong> {request.approvalComments}
                  {request.approvedBy && (
                    <div className="text-xs text-gray-500 mt-1">
                      - {request.approvedBy.username || 'Unknown User'} 
                      ({request.approvedBy.position?.title || 'HR'})
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LeaveRequestsList;

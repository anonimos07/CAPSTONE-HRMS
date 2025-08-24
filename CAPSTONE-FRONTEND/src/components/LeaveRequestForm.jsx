import React, { useState } from 'react';
import { FiCalendar, FiClock, FiFileText, FiSend } from 'react-icons/fi';
import { useSubmitLeaveRequest, useLeaveBalance } from '../Api/hooks/useLeaveRequests';

const LeaveRequestForm = ({ employeeId, onSuccess }) => {
  const [formData, setFormData] = useState({
    leaveType: 'ANNUAL',
    startDate: '',
    endDate: '',
    reason: ''
  });

  const submitLeaveRequest = useSubmitLeaveRequest();
  const { data: leaveBalances = [], isLoading: balancesLoading, error: balancesError } = useLeaveBalance();

  const leaveTypes = [
    { value: 'ANNUAL', label: 'Annual Leave' },
    { value: 'SICK', label: 'Sick Leave' },
    { value: 'PERSONAL', label: 'Personal Leave' },
    { value: 'EMERGENCY', label: 'Emergency Leave' },
    { value: 'MATERNITY', label: 'Maternity Leave' },
    { value: 'PATERNITY', label: 'Paternity Leave' },
    { value: 'BEREAVEMENT', label: 'Bereavement Leave' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateDays = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    }
    return 0;
  };

  const getAvailableBalance = () => {
    const balance = leaveBalances.find(b => b.leaveType === formData.leaveType);
    return balance ? balance.remainingDays : 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const daysRequested = calculateDays();
    const availableBalance = getAvailableBalance();

    if (daysRequested > availableBalance) {
      alert(`Insufficient leave balance. You have ${availableBalance} days available for ${formData.leaveType} leave.`);
      return;
    }

    try {
      await submitLeaveRequest.mutateAsync(formData);
      
      if (onSuccess) onSuccess();
      
      // Get current user name for display
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const userName = currentUser.username || 'User';
      
      alert(`Leave request submitted successfully by ${userName}!`);
      
      // Reset form
      setFormData({
        leaveType: 'ANNUAL',
        startDate: '',
        endDate: '',
        reason: ''
      });
    } catch (error) {
      alert('Error submitting leave request: ' + (error.response?.data || error.message));
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-6 border border-purple-100">
      <div className="flex items-center gap-2 mb-4">
        <FiCalendar className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-purple-700">Request Leave</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Leave Type
          </label>
          <select
            name="leaveType"
            value={formData.leaveType}
            onChange={handleInputChange}
            className="w-full border border-purple-200 rounded-lg px-3 py-2 focus:border-purple-500 focus:ring-purple-500 bg-white/50"
            required
          >
            {leaveTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <div className="text-xs text-gray-500 mt-1">
            Available: {getAvailableBalance()} days
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full border border-purple-200 rounded-lg px-3 py-2 focus:border-purple-500 focus:ring-purple-500 bg-white/50"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              min={formData.startDate || new Date().toISOString().split('T')[0]}
              className="w-full border border-purple-200 rounded-lg px-3 py-2 focus:border-purple-500 focus:ring-purple-500 bg-white/50"
              required
            />
          </div>
        </div>

        {formData.startDate && formData.endDate && (
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-purple-700">
              <FiClock className="w-4 h-4" />
              <span className="text-sm font-medium">
                Duration: {calculateDays()} day{calculateDays() !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reason
          </label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleInputChange}
            rows={3}
            className="w-full border border-purple-200 rounded-lg px-3 py-2 focus:border-purple-500 focus:ring-purple-500 bg-white/50"
            placeholder="Please provide a reason for your leave request..."
            required
          />
        </div>

        <button
          type="submit"
          disabled={submitLeaveRequest.isPending}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {submitLeaveRequest.isPending ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Submitting...
            </>
          ) : (
            <>
              <FiSend className="w-4 h-4" />
              Submit Request
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default LeaveRequestForm;

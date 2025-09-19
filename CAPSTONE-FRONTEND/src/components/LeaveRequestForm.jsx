import React, { useState } from 'react';
import { FiCalendar, FiClock, FiFileText, FiSend, FiCheck, FiX } from 'react-icons/fi';
import { useSubmitLeaveRequest, useLeaveBalance } from '../Api/hooks/useLeaveRequests';

const LeaveRequestForm = ({ employeeId, onSuccess }) => {
  const [formData, setFormData] = useState({
    leaveType: 'ANNUAL',
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

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
      setModalMessage(`Insufficient leave balance. You have ${availableBalance} days available for ${formData.leaveType} leave.`);
      setShowErrorModal(true);
      return;
    }

    try {
      await submitLeaveRequest.mutateAsync(formData);
      
      if (onSuccess) onSuccess();
      
      setModalMessage('You successfully submitted the leave request!');
      setShowSuccessModal(true);
      
      // Reset form
      setFormData({
        leaveType: 'ANNUAL',
        startDate: '',
        endDate: '',
        reason: ''
      });
    } catch (error) {
      setModalMessage('Error submitting leave request: ' + (error.response?.data || error.message));
      setShowErrorModal(true);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-6 border border-[#8b1e3f]/10">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg z-50 ${
          toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
        }`}>
          {toast.message}
        </div>
      )}

      <div className="flex items-center gap-2 mb-4">
        <FiCalendar className="w-5 h-5 text-[#8b1e3f]" />
        <h3 className="text-lg font-semibold text-[#8b1e3f]">Request Leave</h3>
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
            className="w-full border border-[#8b1e3f] rounded-lg px-3 py-2 focus:border-[#8b1e3f]/50 focus:ring-[#8b1e3f]/50 bg-white/50"
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
              className="w-full border border-[#8b1e3f] rounded-lg px-3 py-2 focus:border-[#8b1e3f]/50 focus:ring-[#8b1e3f]/50 bg-white/50"
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
              className="w-full border border-[#8b1e3f] rounded-lg px-3 py-2 focus:border-[#8b1e3f]/50 focus:ring-[#8b1e3f]/50 bg-white/50"
              required
            />
          </div>
        </div>

        {formData.startDate && formData.endDate && (
          <div className="bg-[#8b1e3f]/10 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-[#8b1e3f]">
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
            className="w-full border border-[#8b1e3f] rounded-lg px-3 py-2 focus:border-[#8b1e3f]/50 focus:ring-[#8b1e3f]/50 bg-white/50"
            placeholder="Please provide a reason for your leave request..."
            required
          />
        </div>

        <button
          type="submit"
          disabled={submitLeaveRequest.isPending}
          className="w-full bg-[#8b1e3f] hover:bg-[#8b1e3f]/60 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg p-6 w-full max-w-md shadow-2xl border border-green-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-green-600">Success</h3>
              <button 
                onClick={() => setShowSuccessModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <FiCheck className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-gray-800">{modalMessage}</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end pt-6 mt-4 border-t border-gray-200">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg p-6 w-full max-w-md shadow-2xl border border-red-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-red-600">Error</h3>
              <button 
                onClick={() => setShowErrorModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <FiX className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-gray-800">{modalMessage}</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end pt-6 mt-4 border-t border-gray-200">
              <button
                onClick={() => setShowErrorModal(false)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveRequestForm;
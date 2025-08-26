import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Calendar, Clock, Download, Filter, RefreshCw, Edit } from 'lucide-react';
import Header from '../components/Header';
import TimelogWidget from '../components/TimelogWidget';
import { getTimelogsByDateRange, getMonthlyTimelogs, getTotalWorkedHours } from '../Api/timelog';
import { useHrStaff, useCreateTimelogEditRequest } from '../Api/hooks/useTimelogEditRequest';

const TimelogPage = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTimelog, setSelectedTimelog] = useState(null);
  const queryClient = useQueryClient();

  // Query hooks for edit requests
  const { data: hrStaff = [] } = useHrStaff();
  const createEditRequestMutation = useCreateTimelogEditRequest();

  // Fetch monthly timelogs
  const { data: monthlyTimelogs, isLoading: monthlyLoading } = useQuery({
    queryKey: ['monthly-timelogs', selectedYear, selectedMonth],
    queryFn: () => getMonthlyTimelogs(selectedYear, selectedMonth),
    staleTime: 0, // Always consider stale to catch HR adjustments immediately
    cacheTime: 1 * 60 * 1000, // 1 minute
    refetchOnWindowFocus: true, // Refetch when user returns to tab
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });

  // Fetch total hours for current month
  const { data: totalHoursData } = useQuery({
    queryKey: ['total-hours', selectedYear, selectedMonth],
    queryFn: () => {
      const startDate = new Date(selectedYear, selectedMonth - 1, 1).toISOString();
      const endDate = new Date(selectedYear, selectedMonth, 0, 23, 59, 59).toISOString();
      return getTotalWorkedHours(startDate, endDate);
    },
    staleTime: 0, // Always consider stale to catch HR adjustments immediately
    cacheTime: 1 * 60 * 1000, // 1 minute
    refetchOnWindowFocus: true, // Refetch when user returns to tab
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return '--:--';
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status) => {
    const colors = {
      CLOCKED_IN: 'bg-green-100 text-green-800',
      ON_BREAK: 'bg-yellow-100 text-yellow-800',
      CLOCKED_OUT: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ 
      predicate: (query) => query.queryKey[0] === 'monthly-timelogs' 
    });
    queryClient.invalidateQueries({ 
      predicate: (query) => query.queryKey[0] === 'total-hours' 
    });
    queryClient.invalidateQueries({ 
      predicate: (query) => query.queryKey[0] === 'today-timelog' 
    });
  };

  const handleRequestEdit = (timelog) => {
    setSelectedTimelog(timelog);
    setIsEditModalOpen(true);
  };

  const handleEditRequestSubmit = (requestData) => {
    createEditRequestMutation.mutate({
      timelogId: selectedTimelog.id,
      ...requestData
    }, {
      onSuccess: () => {
        setIsEditModalOpen(false);
        setSelectedTimelog(null);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userRole="EMPLOYEE" />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Time Tracking</h1>
              <p className="text-gray-600">Manage your work hours and attendance</p>
            </div>
            <button
              onClick={handleRefresh}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
          </div>

          {/* Timelog Widget */}
          <TimelogWidget />

          {/* Monthly Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Monthly Summary</h2>
              <div className="flex items-center space-x-4">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {new Date(0, i).toLocaleString('en-US', { month: 'long' })}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  {Array.from({ length: 5 }, (_, i) => (
                    <option key={i} value={new Date().getFullYear() - 2 + i}>
                      {new Date().getFullYear() - 2 + i}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Total Hours</span>
                </div>
                <p className="text-2xl font-bold text-blue-900 mt-1">
                  {totalHoursData?.totalHours?.toFixed(1) || '0.0'}h
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-900">Days Worked</span>
                </div>
                <p className="text-2xl font-bold text-green-900 mt-1">
                  {monthlyTimelogs?.filter(log => log.timeIn && log.timeOut).length || 0}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium text-purple-900">Avg Daily Hours</span>
                </div>
                <p className="text-2xl font-bold text-purple-900 mt-1">
                  {monthlyTimelogs?.length > 0 
                    ? ((totalHoursData?.totalHours || 0) / monthlyTimelogs.filter(log => log.timeIn && log.timeOut).length).toFixed(1)
                    : '0.0'}h
                </p>
              </div>
            </div>
          </div>

          {/* Timelog History */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Timelog History</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time In
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time Out
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Break Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Hours
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {monthlyLoading ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                        Loading...
                      </td>
                    </tr>
                  ) : monthlyTimelogs?.length > 0 ? (
                    monthlyTimelogs.map((timelog) => (
                      <tr key={timelog.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(timelog.logDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatTime(timelog.timeIn)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatTime(timelog.timeOut)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {timelog.breakDurationMinutes 
                            ? `${Math.floor(timelog.breakDurationMinutes / 60)}h ${timelog.breakDurationMinutes % 60}m`
                            : '--'
                          }
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {timelog.totalWorkedHours?.toFixed(1) || '0.0'}h
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(timelog.status)}`}>
                            {timelog.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleRequestEdit(timelog)}
                            className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1 rounded-lg transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                            <span>Request Edit</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                        No timelog records found for this month
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Edit Request Modal */}
          {isEditModalOpen && selectedTimelog && (
            <TimelogEditRequestModal
              timelog={selectedTimelog}
              hrStaff={hrStaff}
              isOpen={isEditModalOpen}
              onClose={() => {
                setIsEditModalOpen(false);
                setSelectedTimelog(null);
              }}
              onSubmit={handleEditRequestSubmit}
              isLoading={createEditRequestMutation.isLoading}
            />
          )}
        </div>
      </main>
    </div>
  );
};

// Timelog Edit Request Modal Component
const TimelogEditRequestModal = ({ timelog, hrStaff, isOpen, onClose, onSubmit, isLoading }) => {
  const [reason, setReason] = useState('');
  const [assignedHrId, setAssignedHrId] = useState('');
  const [requestedTimeIn, setRequestedTimeIn] = useState('');
  const [requestedTimeOut, setRequestedTimeOut] = useState('');
  const [requestedBreakDuration, setRequestedBreakDuration] = useState('');

  React.useEffect(() => {
    if (timelog) {
      setRequestedTimeIn(timelog.timeIn ? new Date(timelog.timeIn).toISOString().slice(0, 16) : '');
      setRequestedTimeOut(timelog.timeOut ? new Date(timelog.timeOut).toISOString().slice(0, 16) : '');
      setRequestedBreakDuration(timelog.breakDurationMinutes || '');
    }
  }, [timelog]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim() || !assignedHrId) {
      alert('Please fill in all required fields');
      return;
    }

    onSubmit({
      reason: reason.trim(),
      assignedHrId: parseInt(assignedHrId),
      requestedTimeIn: requestedTimeIn ? new Date(requestedTimeIn).toISOString() : null,
      requestedTimeOut: requestedTimeOut ? new Date(requestedTimeOut).toISOString() : null,
      requestedBreakDuration: requestedBreakDuration ? parseInt(requestedBreakDuration) : null
    });
  };

  const getEmployeeName = (user) => {
    if (user?.employeeDetails?.firstName && user?.employeeDetails?.lastName) {
      return `${user.employeeDetails.firstName} ${user.employeeDetails.lastName}`;
    }
    return user?.username || 'Unknown';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Request Timelog Edit</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ×
          </button>
        </div>

        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Current Timelog Details</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Date:</span>
              <span className="ml-2 font-medium">{new Date(timelog.logDate).toLocaleDateString()}</span>
            </div>
            <div>
              <span className="text-gray-600">Status:</span>
              <span className="ml-2 font-medium">{timelog.status.replace('_', ' ')}</span>
            </div>
            <div>
              <span className="text-gray-600">Time In:</span>
              <span className="ml-2 font-medium">{timelog.timeIn ? new Date(timelog.timeIn).toLocaleTimeString() : 'N/A'}</span>
            </div>
            <div>
              <span className="text-gray-600">Time Out:</span>
              <span className="ml-2 font-medium">{timelog.timeOut ? new Date(timelog.timeOut).toLocaleTimeString() : 'N/A'}</span>
            </div>
            <div>
              <span className="text-gray-600">Break Duration:</span>
              <span className="ml-2 font-medium">{timelog.breakDurationMinutes ? `${timelog.breakDurationMinutes} minutes` : 'N/A'}</span>
            </div>
            <div>
              <span className="text-gray-600">Total Hours:</span>
              <span className="ml-2 font-medium">{timelog.totalWorkedHours?.toFixed(1) || '0.0'}h</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select HR Staff to Handle Request *
            </label>
            <select
              value={assignedHrId}
              onChange={(e) => setAssignedHrId(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Choose HR Staff...</option>
              {hrStaff.map((hr) => (
                <option key={hr.userId} value={hr.userId}>
                  {getEmployeeName(hr)} ({hr.username})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason for Edit Request *
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Please provide a detailed reason for requesting this timelog edit..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Requested Time In
              </label>
              <input
                type="datetime-local"
                value={requestedTimeIn}
                onChange={(e) => setRequestedTimeIn(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Requested Time Out
              </label>
              <input
                type="datetime-local"
                value={requestedTimeOut}
                onChange={(e) => setRequestedTimeOut(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Requested Break Duration (minutes)
            </label>
            <input
              type="number"
              value={requestedBreakDuration}
              onChange={(e) => setRequestedBreakDuration(e.target.value)}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter break duration in minutes"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !reason.trim() || !assignedHrId}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TimelogPage;

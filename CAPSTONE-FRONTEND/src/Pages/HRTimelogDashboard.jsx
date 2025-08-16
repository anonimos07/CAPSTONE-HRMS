import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, Clock, AlertTriangle, Edit, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';
import {
  getAllTimelogs,
  getUsersClockedIn,
  getUsersOnBreak,
  getIncompleteTimelogs,
  adjustTimelog,
  deleteTimelog
} from '../Api/timelog';

const HRTimelogDashboard = () => {
  const [selectedTimelog, setSelectedTimelog] = useState(null);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustmentData, setAdjustmentData] = useState({
    adjustedTimeIn: '',
    adjustedTimeOut: '',
    adjustedBreakDuration: '',
    reason: ''
  });
  const queryClient = useQueryClient();

  // Fetch all timelogs
  const { data: allTimelogs, isLoading: timelogsLoading } = useQuery({
    queryKey: ['all-timelogs'],
    queryFn: getAllTimelogs,
  });

  // Fetch users currently clocked in
  const { data: clockedInUsers } = useQuery({
    queryKey: ['clocked-in-users'],
    queryFn: getUsersClockedIn,
    refetchInterval: 30000,
  });

  // Fetch users on break
  const { data: usersOnBreak } = useQuery({
    queryKey: ['users-on-break'],
    queryFn: getUsersOnBreak,
    refetchInterval: 30000,
  });

  // Fetch incomplete timelogs
  const { data: incompleteTimelogs } = useQuery({
    queryKey: ['incomplete-timelogs'],
    queryFn: getIncompleteTimelogs,
  });

  // Adjust timelog mutation
  const adjustTimelogMutation = useMutation({
    mutationFn: adjustTimelog,
    onSuccess: () => {
      queryClient.invalidateQueries(['all-timelogs']);
      queryClient.invalidateQueries(['incomplete-timelogs']);
      toast.success('Timelog adjusted successfully');
      setShowAdjustModal(false);
      setSelectedTimelog(null);
    },
    onError: (error) => {
      toast.error(error.response?.data || 'Failed to adjust timelog');
    },
  });

  // Delete timelog mutation
  const deleteTimelogMutation = useMutation({
    mutationFn: deleteTimelog,
    onSuccess: () => {
      queryClient.invalidateQueries(['all-timelogs']);
      queryClient.invalidateQueries(['incomplete-timelogs']);
      toast.success('Timelog deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data || 'Failed to delete timelog');
    },
  });

  const handleAdjustTimelog = (timelog) => {
    setSelectedTimelog(timelog);
    setAdjustmentData({
      adjustedTimeIn: timelog.timeIn ? new Date(timelog.timeIn).toISOString().slice(0, 16) : '',
      adjustedTimeOut: timelog.timeOut ? new Date(timelog.timeOut).toISOString().slice(0, 16) : '',
      adjustedBreakDuration: timelog.breakDurationMinutes?.toString() || '',
      reason: ''
    });
    setShowAdjustModal(true);
  };

  const handleSubmitAdjustment = () => {
    if (!selectedTimelog || !adjustmentData.reason.trim()) {
      toast.error('Please provide a reason for the adjustment');
      return;
    }

    const payload = {
      timelogId: selectedTimelog.id,
      adjustedTimeIn: adjustmentData.adjustedTimeIn || null,
      adjustedTimeOut: adjustmentData.adjustedTimeOut || null,
      adjustedBreakDuration: adjustmentData.adjustedBreakDuration ? parseInt(adjustmentData.adjustedBreakDuration) : null,
      reason: adjustmentData.reason
    };

    adjustTimelogMutation.mutate(payload);
  };

  const handleDeleteTimelog = (timelogId) => {
    if (window.confirm('Are you sure you want to delete this timelog? This action cannot be undone.')) {
      deleteTimelogMutation.mutate(timelogId);
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '--:--';
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">HR Timelog Dashboard</h1>
        <p className="text-gray-600">Monitor and manage employee time tracking</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-gray-900">Clocked In</span>
          </div>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {clockedInUsers?.length || 0}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-yellow-600" />
            <span className="text-sm font-medium text-gray-900">On Break</span>
          </div>
          <p className="text-2xl font-bold text-yellow-600 mt-1">
            {usersOnBreak?.length || 0}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span className="text-sm font-medium text-gray-900">Incomplete</span>
          </div>
          <p className="text-2xl font-bold text-red-600 mt-1">
            {incompleteTimelogs?.length || 0}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-900">Total Records</span>
          </div>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {allTimelogs?.length || 0}
          </p>
        </div>
      </div>

      {/* Current Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Clocked In Users */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Currently Working</h3>
          </div>
          <div className="p-4">
            {clockedInUsers?.length > 0 ? (
              <div className="space-y-2">
                {clockedInUsers.map((user) => (
                  <div key={user.userId} className="flex items-center justify-between p-2 bg-green-50 rounded">
                    <span className="font-medium">{user.username}</span>
                    <span className="text-sm text-gray-600">{user.position?.title}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No users currently clocked in</p>
            )}
          </div>
        </div>

        {/* Users on Break */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">On Break</h3>
          </div>
          <div className="p-4">
            {usersOnBreak?.length > 0 ? (
              <div className="space-y-2">
                {usersOnBreak.map((user) => (
                  <div key={user.userId} className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                    <span className="font-medium">{user.username}</span>
                    <span className="text-sm text-gray-600">{user.position?.title}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No users currently on break</p>
            )}
          </div>
        </div>
      </div>

      {/* All Timelogs Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All Timelogs</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
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
                  Hours
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
              {timelogsLoading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : allTimelogs?.length > 0 ? (
                allTimelogs.slice(0, 50).map((timelog) => (
                  <tr key={timelog.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {timelog.user?.username}
                        </div>
                        <div className="text-sm text-gray-500">
                          {timelog.user?.position?.title}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(timelog.logDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDateTime(timelog.timeIn)}
                      {timelog.adjustedTimeIn && (
                        <div className="text-xs text-blue-600">Adjusted</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDateTime(timelog.timeOut)}
                      {timelog.adjustedTimeOut && (
                        <div className="text-xs text-blue-600">Adjusted</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {timelog.totalWorkedHours?.toFixed(1) || '0.0'}h
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(timelog.status)}`}>
                        {timelog.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleAdjustTimelog(timelog)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Adjust Timelog"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTimelog(timelog.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Timelog"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    No timelog records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjustment Modal */}
      {showAdjustModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Adjust Timelog</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adjusted Time In
                </label>
                <input
                  type="datetime-local"
                  value={adjustmentData.adjustedTimeIn}
                  onChange={(e) => setAdjustmentData(prev => ({ ...prev, adjustedTimeIn: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adjusted Time Out
                </label>
                <input
                  type="datetime-local"
                  value={adjustmentData.adjustedTimeOut}
                  onChange={(e) => setAdjustmentData(prev => ({ ...prev, adjustedTimeOut: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Break Duration (minutes)
                </label>
                <input
                  type="number"
                  value={adjustmentData.adjustedBreakDuration}
                  onChange={(e) => setAdjustmentData(prev => ({ ...prev, adjustedBreakDuration: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for Adjustment *
                </label>
                <textarea
                  value={adjustmentData.reason}
                  onChange={(e) => setAdjustmentData(prev => ({ ...prev, reason: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  rows="3"
                  placeholder="Explain why this adjustment is needed..."
                  required
                />
              </div>
            </div>
            <div className="flex space-x-2 mt-6">
              <button
                onClick={() => setShowAdjustModal(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitAdjustment}
                disabled={adjustTimelogMutation.isPending}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-purple-400"
              >
                {adjustTimelogMutation.isPending ? 'Saving...' : 'Save Adjustment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HRTimelogDashboard;

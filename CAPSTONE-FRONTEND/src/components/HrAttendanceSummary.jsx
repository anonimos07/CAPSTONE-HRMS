import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Calendar, Clock, RefreshCw } from 'lucide-react';
import { getMonthlyTimelogs, getTotalWorkedHours } from '../Api/timelog';

const HrAttendanceSummary = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const queryClient = useQueryClient();

  // Fetch monthly timelogs for HR user
  const { data: monthlyTimelogs, isLoading: monthlyLoading } = useQuery({
    queryKey: ['monthly-timelogs', selectedYear, selectedMonth],
    queryFn: () => getMonthlyTimelogs(selectedYear, selectedMonth),
    staleTime: 0, // Always consider stale to catch adjustments immediately
    cacheTime: 1 * 60 * 1000, // 1 minute
    refetchOnWindowFocus: true, // Refetch when user returns to tab
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });

  // Fetch total hours for current month for HR user
  const { data: totalHoursData } = useQuery({
    queryKey: ['total-hours', selectedYear, selectedMonth],
    queryFn: () => {
      const startDate = new Date(selectedYear, selectedMonth - 1, 1).toISOString();
      const endDate = new Date(selectedYear, selectedMonth, 0, 23, 59, 59).toISOString();
      return getTotalWorkedHours(startDate, endDate);
    },
    staleTime: 0, // Always consider stale to catch adjustments immediately
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">My Attendance Summary</h2>
          <p className="text-gray-600">Your personal work hours and attendance</p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center space-x-2 bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Monthly Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Monthly Summary</h3>
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
              <Clock className="h-5 w-5 text-purple-600" />
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
          <h3 className="text-lg font-semibold text-gray-900">My Timelog History</h3>
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
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {monthlyLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
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
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No timelog records found for this month
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HrAttendanceSummary;

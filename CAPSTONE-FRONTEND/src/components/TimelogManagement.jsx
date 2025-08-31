import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FiSearch, FiDownload, FiEdit, FiCalendar, FiClock, FiUser, FiX, FiImage, FiEye } from 'react-icons/fi';
import { useAllTimelogsForHR, useAdjustTimelog, useDownloadTimelogsCSV, useTimelogById } from '../Api/hooks/useTimelog';

const TimelogManagement = () => {
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedTimelog, setSelectedTimelog] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoType, setPhotoType] = useState('');

  // Query hooks
  const { data: timelogs = [], isLoading, refetch } = useAllTimelogsForHR(search, startDate, endDate);
  const { data: timelogDetails } = useTimelogById(selectedTimelog?.id);
  
  // Mutation hooks
  const adjustTimelogMutation = useAdjustTimelog();
  const downloadCSVMutation = useDownloadTimelogsCSV();

  const handleSearch = () => {
    refetch();
  };

  const handleDownloadCSV = () => {
    downloadCSVMutation.mutate({ search, startDate, endDate });
  };

  const handleEditTimelog = (timelog) => {
    setSelectedTimelog(timelog);
    setIsEditModalOpen(true);
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return 'N/A';
    return new Date(dateTime).toLocaleString();
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  };

  const formatBreakDuration = (minutes) => {
    if (!minutes || minutes === 0) return '0m';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${mins}m`;
  };

  const handleViewPhoto = (photo, type, employeeName) => {
    if (photo) {
      setSelectedPhoto(photo);
      setPhotoType(`${type} - ${employeeName}`);
      setIsPhotoModalOpen(true);
    }
  };

  const decryptPhoto = (encryptedPhoto) => {
    // Since photos are stored as base64, we just need to format them properly
    if (!encryptedPhoto) return null;
    // Check if it already has data URL prefix
    if (encryptedPhoto.startsWith('data:image/')) {
      return encryptedPhoto;
    }
    // Add data URL prefix for base64 images
    return `data:image/jpeg;base64,${encryptedPhoto}`;
  };

  const getEmployeeName = (user) => {
    if (user?.employeeDetails?.firstName && user?.employeeDetails?.lastName) {
      return `${user.employeeDetails.firstName} ${user.employeeDetails.lastName}`;
    }
    return user?.username || 'Unknown';
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      CLOCKED_IN: 'bg-green-100 text-green-800',
      CLOCKED_OUT: 'bg-gray-100 text-gray-800',
      ON_BREAK: 'bg-yellow-100 text-yellow-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Timelog Management</h2>
        <Button
          onClick={handleDownloadCSV}
          disabled={downloadCSVMutation.isLoading}
          className="bg-[#8b1e3f] hover:bg-[#8b1e3f]/60 text-white"
        >
          <FiDownload className="mr-2" />
          {downloadCSVMutation.isLoading ? 'Downloading...' : 'Download CSV'}
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or username..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8b1e3f] focus:border-transparent"
          />
        </div>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8b1e3f] focus:border-transparent"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8b1e3f] focus:border-transparent"
        />
        <Button
          onClick={handleSearch}
          className="bg-[#8b1e3f] hover:bg-[#8b1e3f]/60 text-white"
        >
          <FiSearch className="mr-2" />
          Search
        </Button>
      </div>

      {/* Timelog Table */}
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">Loading timelogs...</div>
        ) : timelogs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No timelogs found</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
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
                  Break Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Hours
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Photos
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
              {timelogs.map((timelog) => (
                <tr key={timelog.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FiUser className="mr-2 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {getEmployeeName(timelog.user)}
                        </div>
                        <div className="text-sm text-gray-500">{timelog.user?.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <FiCalendar className="mr-2 text-gray-400" />
                      {formatDate(timelog.logDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <FiClock className="mr-2 text-gray-400" />
                      {timelog.adjustedTimeIn ? (
                        <div>
                          <div className="line-through text-gray-400">{formatDateTime(timelog.timeIn)}</div>
                          <div className="text-blue-600 font-medium">{formatDateTime(timelog.adjustedTimeIn)}</div>
                        </div>
                      ) : (
                        formatDateTime(timelog.timeIn)
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <FiClock className="mr-2 text-gray-400" />
                      {timelog.adjustedTimeOut ? (
                        <div>
                          <div className="line-through text-gray-400">{formatDateTime(timelog.timeOut)}</div>
                          <div className="text-blue-600 font-medium">{formatDateTime(timelog.adjustedTimeOut)}</div>
                        </div>
                      ) : (
                        formatDateTime(timelog.timeOut)
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <FiClock className="mr-2 text-gray-400" />
                      {timelog.adjustedBreakDurationMinutes !== null ? (
                        <div>
                          <div className="line-through text-gray-400">{formatBreakDuration(timelog.breakDurationMinutes)}</div>
                          <div className="text-blue-600 font-medium">{formatBreakDuration(timelog.adjustedBreakDurationMinutes)}</div>
                        </div>
                      ) : (
                        formatBreakDuration(timelog.breakDurationMinutes)
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {timelog.totalWorkedHours ? `${timelog.totalWorkedHours.toFixed(2)}h` : '0.00h'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex space-x-2">
                      {timelog.timeInPhoto && (
                        <Button
                          onClick={() => handleViewPhoto(timelog.timeInPhoto, 'Time In', getEmployeeName(timelog.user))}
                          variant="outline"
                          size="sm"
                          className="text-green-600 hover:text-green-700"
                        >
                          <FiImage className="mr-1" />
                          In
                        </Button>
                      )}
                      {timelog.timeOutPhoto && (
                        <Button
                          onClick={() => handleViewPhoto(timelog.timeOutPhoto, 'Time Out', getEmployeeName(timelog.user))}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <FiImage className="mr-1" />
                          Out
                        </Button>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(timelog.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Button
                      onClick={() => handleEditTimelog(timelog)}
                      variant="outline"
                      size="sm"
                      className="text-[#8b1e3f] hover:text-[#8b1e3f]/60"
                    >
                      <FiEdit className="mr-1" />
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && selectedTimelog && (
        <EditTimelogModal
          timelog={selectedTimelog}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedTimelog(null);
          }}
          onSave={(adjustmentData) => {
            adjustTimelogMutation.mutate(adjustmentData, {
              onSuccess: () => {
                setIsEditModalOpen(false);
                setSelectedTimelog(null);
                refetch();
              }
            });
          }}
          isLoading={adjustTimelogMutation.isLoading}
        />
      )}

      {/* Photo Verification Modal */}
      {isPhotoModalOpen && selectedPhoto && (
        <PhotoVerificationModal
          photo={selectedPhoto}
          photoType={photoType}
          isOpen={isPhotoModalOpen}
          onClose={() => {
            setIsPhotoModalOpen(false);
            setSelectedPhoto(null);
            setPhotoType('');
          }}
        />
      )}
    </div>
  );
};

// Edit Timelog Modal Component
const EditTimelogModal = ({ timelog, isOpen, onClose, onSave, isLoading }) => {
  const [adjustedTimeIn, setAdjustedTimeIn] = useState('');
  const [adjustedTimeOut, setAdjustedTimeOut] = useState('');
  const [adjustedBreakDuration, setAdjustedBreakDuration] = useState('');
  const [reason, setReason] = useState('');

  React.useEffect(() => {
    if (timelog) {
      setAdjustedTimeIn(timelog.adjustedTimeIn || timelog.timeIn || '');
      setAdjustedTimeOut(timelog.adjustedTimeOut || timelog.timeOut || '');
      setAdjustedBreakDuration(timelog.adjustedBreakDurationMinutes || timelog.breakDurationMinutes || '');
      setReason(timelog.adjustmentReason || '');
    }
  }, [timelog]);

  const handleSave = () => {
    const adjustmentData = {
      timelogId: timelog.id,
      adjustedTimeIn: adjustedTimeIn || null,
      adjustedTimeOut: adjustedTimeOut || null,
      adjustedBreakDuration: adjustedBreakDuration ? parseInt(adjustedBreakDuration) : null,
      reason
    };
    onSave(adjustmentData);
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
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Edit Timelog</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FiX size={20} />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Employee: <span className="font-medium">{getEmployeeName(timelog.user)}</span>
          </p>
          <p className="text-sm text-gray-600">
            Date: <span className="font-medium">{new Date(timelog.logDate).toLocaleDateString()}</span>
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adjusted Time In
            </label>
            <input
              type="datetime-local"
              value={adjustedTimeIn ? new Date(adjustedTimeIn).toISOString().slice(0, 16) : ''}
              onChange={(e) => setAdjustedTimeIn(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8b1e3f]/50 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adjusted Time Out
            </label>
            <input
              type="datetime-local"
              value={adjustedTimeOut ? new Date(adjustedTimeOut).toISOString().slice(0, 16) : ''}
              onChange={(e) => setAdjustedTimeOut(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8b1e3f]/50 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adjusted Break Duration (minutes)
            </label>
            <input
              type="number"
              value={adjustedBreakDuration}
              onChange={(e) => setAdjustedBreakDuration(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8b1e3f]/50 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adjustment Reason *
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8b1e3f]/50 focus:border-transparent"
              rows="3"
              placeholder="Please provide a reason for this adjustment..."
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <Button
            onClick={onClose}
            variant="outline"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading || !reason.trim()}
            className="bg-[#8b1e3f] hover:bg-[#8b1e3f]/60 text-white"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
};

// Photo Verification Modal Component
const PhotoVerificationModal = ({ photo, photoType, isOpen, onClose }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const decryptedPhoto = React.useMemo(() => {
    if (!photo) return null;
    // Handle base64 encoded photos
    if (photo.startsWith('data:image/')) {
      return photo;
    }
    return `data:image/jpeg;base64,${photo}`;
  }, [photo]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <FiEye className="mr-2" />
            Identity Verification - {photoType}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FiX size={24} />
          </button>
        </div>

        <div className="text-center">
          {imageError ? (
            <div className="bg-gray-100 rounded-lg p-8">
              <FiImage className="mx-auto text-gray-400 mb-2" size={48} />
              <p className="text-gray-500">Unable to load photo</p>
            </div>
          ) : (
            <div className="relative">
              {!isImageLoaded && (
                <div className="bg-gray-100 rounded-lg p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Loading photo...</p>
                </div>
              )}
              <img
                src={decryptedPhoto}
                alt={`${photoType} verification photo`}
                className={`max-w-full h-auto rounded-lg shadow-lg ${!isImageLoaded ? 'hidden' : ''}`}
                onLoad={() => setIsImageLoaded(true)}
                onError={() => {
                  setImageError(true);
                  setIsImageLoaded(false);
                }}
              />
            </div>
          )}
        </div>

        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Verification Guidelines:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Verify the employee's identity matches their profile</li>
            <li>• Check for clear facial recognition</li>
            <li>• Ensure the photo was taken at the appropriate time</li>
            <li>• Look for any signs of tampering or irregularities</li>
          </ul>
        </div>

        <div className="flex justify-end mt-6">
          <Button
            onClick={onClose}
            className="bg-[#8b1e3f] hover:bg-[#8b1e3f]/70 text-white"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TimelogManagement;

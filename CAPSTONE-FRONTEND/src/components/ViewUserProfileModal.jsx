import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, MapPin, Building, Briefcase } from 'lucide-react';
import { getUserDetails } from '../Api/userManagement';
import { getProfilePictureFullUrl } from '../Api/profilePicture';

const ViewUserProfileModal = ({ isOpen, onClose, userId, userRole }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && userId) {
      fetchUserDetails();
    }
  }, [isOpen, userId]);

  const fetchUserDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const details = await getUserDetails(userId);
      setUserDetails(details);
    } catch (err) {
      setError('Failed to load user details. Please try again.');
      console.error('Error fetching user details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setUserDetails(null);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            {userRole === 'HR' ? 'HR Profile' : 'Employee Profile'}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading profile...</span>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
              {error}
            </div>
          )}

          {userDetails && !loading && (
            <div className="space-y-6">
              {/* Profile Picture and Basic Info */}
              <div className="flex items-center space-x-6">
                <div className="relative">
                  {/* Debug: Log the profile picture data */}
                  {console.log('Profile Picture Data:', userDetails.profilePicture)}
                  {console.log('Generated URL:', userDetails.profilePicture ? getProfilePictureFullUrl(userDetails.profilePicture) : getProfilePictureFullUrl(null))}
                  
                  {userDetails.profilePicture ? (
                    <img
                      src={getProfilePictureFullUrl(userDetails.profilePicture)}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 bg-white"
                      onLoad={() => console.log('Image loaded successfully')}
                      onError={(e) => {
                        console.log('Image failed to load, using fallback');
                        e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNGM0Y0RjYiLz4KICA8Y2lyY2xlIGN4PSI1MCIgY3k9IjM3IiByPSIxOCIgZmlsbD0iIzlDQTNBRiIvPgogIDxwYXRoIGQ9Ik0yMCA4MEMyMCA2OS41MDY2IDI4LjUwNjYgNjEgMzkgNjFINjFDNzEuNDkzNCA2MSA4MCA2OS41MDY2IDgwIDgwVjEwMEgyMFY4MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+";
                      }}
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-300 border-4 border-gray-200 flex items-center justify-center text-2xl font-bold text-gray-600">
                      {userDetails.firstName ? userDetails.firstName.charAt(0).toUpperCase() : 
                       userDetails.username ? userDetails.username.charAt(0).toUpperCase() : '?'}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-800">
                    {userDetails.firstName && userDetails.lastName ? 
                      `${userDetails.firstName} ${userDetails.lastName}` : 
                      userDetails.username
                    }
                  </h3>
                  <p className="text-gray-600">@{userDetails.username}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      userDetails.role === 'HR' ? 'bg-purple-100 text-purple-800' :
                      userDetails.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {userDetails.role}
                    </span>
                    <span className="text-gray-500">{userDetails.position}</span>
                  </div>
                </div>
              </div>

              {/* Profile Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                    Personal Information
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <User className="text-gray-400" size={18} />
                      <div>
                        <label className="text-sm font-medium text-gray-500">Full Name</label>
                        <p className="text-gray-800">
                          {userDetails.firstName && userDetails.lastName ? 
                            `${userDetails.firstName} ${userDetails.lastName}` : 
                            'Not provided'
                          }
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Mail className="text-gray-400" size={18} />
                      <div>
                        <label className="text-sm font-medium text-gray-500">Email</label>
                        <p className="text-gray-800">{userDetails.email || 'Not provided'}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Phone className="text-gray-400" size={18} />
                      <div>
                        <label className="text-sm font-medium text-gray-500">Contact</label>
                        <p className="text-gray-800">{userDetails.contact || 'Not provided'}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <MapPin className="text-gray-400" size={18} />
                      <div>
                        <label className="text-sm font-medium text-gray-500">Address</label>
                        <p className="text-gray-800">{userDetails.address || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Work Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                    Work Information
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Briefcase className="text-gray-400" size={18} />
                      <div>
                        <label className="text-sm font-medium text-gray-500">Position</label>
                        <p className="text-gray-800">{userDetails.position || 'Not assigned'}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Building className="text-gray-400" size={18} />
                      <div>
                        <label className="text-sm font-medium text-gray-500">Department</label>
                        <p className="text-gray-800">{userDetails.department || 'Not assigned'}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <User className="text-gray-400" size={18} />
                      <div>
                        <label className="text-sm font-medium text-gray-500">User ID</label>
                        <p className="text-gray-800">#{userDetails.userId}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Note about read-only */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  <strong>Note:</strong> This is a read-only view of the user's profile. 
                  You can view all information but cannot make any changes.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewUserProfileModal;

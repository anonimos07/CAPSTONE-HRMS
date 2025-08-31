import React, { useState, useEffect } from 'react';
import { Search, Eye, Users, UserX, UserCheck, ChevronLeft, ChevronRight, X, RefreshCw } from 'lucide-react';
import { getAllUsers } from '../Api/userManagement';

const UserList = ({ onViewProfile }) => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileUser, setProfileUser] = useState(null);

  // Fetch users on component mount and when search term changes
  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== '') {
        fetchUsers();
      }
    }, 500); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getAllUsers(searchTerm);
      setUsers(response.users || []);
      setCurrentPage(1); // Reset to first page when new search
    } catch (err) {
      setError('Failed to fetch users. Please try again.');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setSearchTerm('');
    fetchUsers();
  };

  // Get current users for pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    fetchUsers();
  };

  const handleStatusChange = (user) => {
    setSelectedUser(user);
    setShowStatusModal(true);
  };

  const handleCloseStatusModal = () => {
    setShowStatusModal(false);
    setSelectedUser(null);
  };

  const handleViewProfile = (user) => {
    setProfileUser(user);
    setShowProfileModal(true);
  };

  const handleCloseProfileModal = () => {
    setShowProfileModal(false);
    setProfileUser(null);
  };

  const handleAccountStatusChanged = (userId, newStatus) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.userId === userId 
          ? { ...user, isEnabled: newStatus }
          : user
      )
    );
    handleCloseStatusModal();
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Users className="text-blue-600" size={24} />
          <h2 className="text-xl font-semibold text-gray-800">User Management</h2>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            {users.length} user{users.length !== 1 ? 's' : ''} found
          </span>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search by username..."
          value={searchTerm}
          onChange={handleSearch}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
        {searchTerm && (
          <button
            onClick={handleClearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading users...</span>
        </div>
      )}

      {/* Users List */}
      {!loading && (
        <div className="space-y-3">
          {currentUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? 'No users found matching your search.' : 'No users available.'}
            </div>
          ) : (
            currentUsers.map((user) => (
              <div
                key={user.userId}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      user.isEnabled ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      <span className={`font-semibold text-sm ${
                        user.isEnabled ? 'text-blue-600' : 'text-gray-500'
                      }`}>
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-medium truncate ${
                          user.isEnabled ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                          {user.username}
                        </h3>
                        {!user.isEnabled && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full whitespace-nowrap">
                            Disabled
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col text-sm text-gray-500 mt-1">
                        <span className="capitalize">{user.role.toLowerCase()}</span>
                        {user.firstName && user.lastName && (
                          <span>Name: {user.firstName} {user.lastName}</span>
                        )}
                        {user.position && (
                          <span>Position: {user.position}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => handleViewProfile(user)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                  >
                    <Eye size={16} />
                    View Profile
                  </button>
                  <button
                    onClick={() => handleStatusChange(user)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                      user.isEnabled 
                        ? 'bg-red-600 text-white hover:bg-red-700' 
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {user.isEnabled ? (
                      <>
                        <UserX size={16} />
                        Disable
                      </>
                    ) : (
                      <>
                        <UserCheck size={16} />
                        Enable
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && users.length > usersPerPage && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
          <div className="text-sm text-gray-500 whitespace-nowrap">
            Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, users.length)} of {users.length} users
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`p-2 rounded-md ${
                currentPage === 1 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ChevronLeft size={20} />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => paginate(page)}
                className={`w-8 h-8 rounded-md text-sm ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-md ${
                currentPage === totalPages
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Enable/Disable Account Modal */}
      {showStatusModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg p-6 w-full max-w-md shadow-2xl border border-red-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[#8b1e3f]">
                {selectedUser.isEnabled ? 'Disable Account' : 'Enable Account'}
              </h3>
              <button 
                onClick={handleCloseStatusModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  selectedUser.isEnabled ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <span className={`font-semibold text-lg ${
                    selectedUser.isEnabled ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {selectedUser.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">@{selectedUser.username}</h4>
                  <p className="text-sm text-gray-500 capitalize">{selectedUser.role.toLowerCase()}</p>
                </div>
              </div>
              
              <p className="text-gray-700">
                {selectedUser.isEnabled 
                  ? 'Are you sure you want to disable this account? The user will be unable to log in and will see a "Your account has been disabled" message.'
                  : 'Are you sure you want to enable this account? The user will be able to log in and access the system again.'}
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">User Details:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-gray-600">Username:</span>
                  <span className="text-gray-800">{selectedUser.username}</span>
                  
                  <span className="text-gray-600">Role:</span>
                  <span className="text-gray-800 capitalize">{selectedUser.role.toLowerCase()}</span>
                  
                  <span className="text-gray-600">Current Status:</span>
                  <span className={selectedUser.isEnabled ? "text-green-600" : "text-red-600"}>
                    {selectedUser.isEnabled ? "Enabled" : "Disabled"}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-6 mt-4 border-t border-gray-200">
              <button
                onClick={handleCloseStatusModal}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAccountStatusChanged(selectedUser.userId, !selectedUser.isEnabled)}
                className={`px-4 py-2 text-white rounded-lg transition-colors ${
                  selectedUser.isEnabled 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {selectedUser.isEnabled ? 'Disable Account' : 'Enable Account'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Profile Modal */}
      {showProfileModal && profileUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg p-6 w-full max-w-md shadow-2xl border border-red-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[#8b1e3f]">User Profile</h3>
              <button 
                onClick={handleCloseProfileModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  profileUser.isEnabled ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <span className={`font-semibold text-xl ${
                    profileUser.isEnabled ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {profileUser.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 text-lg">
                    {profileUser.firstName && profileUser.lastName 
                      ? `${profileUser.firstName} ${profileUser.lastName}` 
                      : profileUser.username}
                  </h4>
                  <p className="text-gray-600">@{profileUser.username}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full capitalize">
                      {profileUser.role.toLowerCase()}
                    </span>
                    {profileUser.position && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                        {profileUser.position}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <h4 className="font-medium text-[#8b1e3f] mb-3">Personal Information</h4>
                  <div className="space-y-4">
                    {profileUser.firstName && profileUser.lastName && (
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                        <div className="text-gray-800">{profileUser.firstName} {profileUser.lastName}</div>
                      </div>
                    )}
                    
                    {profileUser.email && (
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                        <div className="text-gray-800">{profileUser.email}</div>
                      </div>
                    )}
                    
                    {profileUser.contact && (
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Contact</label>
                        <div className="text-gray-800">{profileUser.contact}</div>
                      </div>
                    )}
                    
                    {profileUser.address && (
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Address</label>
                        <div className="text-gray-800">{profileUser.address}</div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-[#8b1e3f] mb-3">Work Information</h4>
                  <div className="space-y-4">
                    {profileUser.position && (
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Position</label>
                        <div className="text-gray-800">{profileUser.position}</div>
                      </div>
                    )}
                    
                    {profileUser.department && (
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Department</label>
                        <div className="text-gray-800">{profileUser.department}</div>
                      </div>
                    )}
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">User ID</label>
                      <div className="text-gray-800">#{profileUser.userId}</div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        profileUser.isEnabled 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {profileUser.isEnabled ? 'Enabled' : 'Disabled'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 p-3 rounded-lg mt-4">
                <p className="text-sm text-blue-700 text-center">
                  Note: This is a read-only view of the user's profile. You can view all information but cannot make any changes.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end pt-6 mt-4 border-t border-gray-200">
              <button
                onClick={handleCloseProfileModal}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
import React, { useState, useEffect } from 'react';
import { Search, Eye, Users, UserX, UserCheck } from 'lucide-react';
import { getAllUsers } from '../Api/userManagement';
import DisableAccountModal from './DisableAccountModal';

const UserList = ({ onViewProfile }) => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

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
    } catch (err) {
      setError('Failed to fetch users. Please try again.');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    fetchUsers();
  };

  const handleDisableAccount = (user) => {
    setSelectedUser(user);
    setShowDisableModal(true);
  };

  const handleCloseDisableModal = () => {
    setShowDisableModal(false);
    setSelectedUser(null);
  };

  const handleAccountStatusChanged = (userId, newStatus) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.userId === userId 
          ? { ...user, isEnabled: newStatus }
          : user
      )
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Users className="text-blue-600" size={24} />
          <h2 className="text-xl font-semibold text-gray-800">User Management</h2>
        </div>
        <span className="text-sm text-gray-500">
          {users.length} user{users.length !== 1 ? 's' : ''} found
        </span>
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
          {users.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? 'No users found matching your search.' : 'No users available.'}
            </div>
          ) : (
            users.map((user) => (
              <div
                key={user.userId}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
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
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className={`font-medium ${
                          user.isEnabled ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                          {user.username}
                        </h3>
                        {!user.isEnabled && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                            Disabled
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="capitalize">{user.role.toLowerCase()}</span>
                        {user.firstName && user.lastName && (
                          <span>{user.firstName} {user.lastName}</span>
                        )}
                        <span>{user.position}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onViewProfile(user.userId, user.role)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Eye size={16} />
                    View Profile
                  </button>
                  <button
                    onClick={() => handleDisableAccount(user)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
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

      {/* Disable Account Modal */}
      <DisableAccountModal
        isOpen={showDisableModal}
        onClose={handleCloseDisableModal}
        user={selectedUser}
        onAccountStatusChanged={handleAccountStatusChanged}
      />
    </div>
  );
};

export default UserList;

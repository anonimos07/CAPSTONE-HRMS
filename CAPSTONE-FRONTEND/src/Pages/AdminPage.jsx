import React, { useState } from 'react';
import { Users, Plus, Building2, UserPlus, Shield } from 'lucide-react';
import AdminHeader from '../components/AdminHeader';
import { useAdmin } from '../Api/hooks/useAdmin';
import { usePositions } from '../Api/hooks/usePositions';
import { useQueryClient } from '@tanstack/react-query';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showCreateHRForm, setShowCreateHRForm] = useState(false);
  const [showCreateEmployeeForm, setShowCreateEmployeeForm] = useState(false);
  const [showCreateAdminForm, setShowCreateAdminForm] = useState(false);
  const [showCreatePositionForm, setShowCreatePositionForm] = useState(false);

  const queryClient = useQueryClient();
  const { createHRMutation, createEmployeeMutation, createAdminMutation } = useAdmin();
  const { data: positions = [], createPositionMutation } = usePositions();

  // Form states
  const [hrForm, setHrForm] = useState({
    username: '',
    password: '',
    position: { title: '' }
  });

  const [employeeForm, setEmployeeForm] = useState({
    username: '',
    password: '',
    position: { title: '' }
  });

  const [adminForm, setAdminForm] = useState({
    username: '',
    password: ''
  });

  const [positionForm, setPositionForm] = useState({
    title: ''
  });

  const handleCreateHR = (e) => {
    e.preventDefault();
    createHRMutation.mutate(hrForm, {
      onSuccess: () => {
        setHrForm({ username: '', password: '', position: { title: '' } });
        setShowCreateHRForm(false);
      }
    });
  };

  const handleCreateEmployee = (e) => {
    e.preventDefault();
    createEmployeeMutation.mutate(employeeForm, {
      onSuccess: () => {
        setEmployeeForm({ username: '', password: '', position: { title: '' } });
        setShowCreateEmployeeForm(false);
      }
    });
  };

  const handleCreateAdmin = (e) => {
    e.preventDefault();
    createAdminMutation.mutate(adminForm, {
      onSuccess: (data) => {
        // Store admin data in localStorage similar to login
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('username', data.username);
        localStorage.setItem('role', data.role);
        
        setAdminForm({ username: '', password: '' });
        setShowCreateAdminForm(false);
        alert('Admin created successfully!');
      }
    });
  };

  const handleCreatePosition = (e) => {
    e.preventDefault();
    createPositionMutation.mutate(positionForm, {
      onSuccess: () => {
        setPositionForm({ title: '' });
        setShowCreatePositionForm(false);
        // Force refetch positions data
        queryClient.invalidateQueries({ queryKey: ['positions'] });
      }
    });
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Shield },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'positions', label: 'Position Management', icon: Building2 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users, positions, and system settings</p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                    <p className="text-gray-600">Create and manage HR staff and employees</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Building2 className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Position Management</h3>
                    <p className="text-gray-600">Add and manage company positions</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Shield className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">System Admin</h3>
                    <p className="text-gray-600">Full system access and control</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Management Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowCreateHRForm(true)}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Create HR</span>
                </button>
                <button
                  onClick={() => setShowCreateEmployeeForm(true)}
                  className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Create Employee</span>
                </button>
                <button
                  onClick={() => setShowCreateAdminForm(true)}
                  className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Shield className="h-4 w-4" />
                  <span>Create Admin</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">HR Staff Management</h3>
                <p className="text-gray-600 mb-4">Create and manage HR staff accounts with appropriate permissions.</p>
                <button
                  onClick={() => setShowCreateHRForm(true)}
                  className="w-full bg-blue-50 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  Create New HR Account
                </button>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Employee Management</h3>
                <p className="text-gray-600 mb-4">Create and manage employee accounts for the organization.</p>
                <button
                  onClick={() => setShowCreateEmployeeForm(true)}
                  className="w-full bg-green-50 text-green-700 px-4 py-2 rounded-lg hover:bg-green-100 transition-colors"
                >
                  Create New Employee Account
                </button>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Management</h3>
                <p className="text-gray-600 mb-4">Create and manage admin accounts with full system access.</p>
                <button
                  onClick={() => setShowCreateAdminForm(true)}
                  className="w-full bg-purple-50 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  Create New Admin Account
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Position Management Tab */}
        {activeTab === 'positions' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Position Management</h2>
              <button
                onClick={() => setShowCreatePositionForm(true)}
                className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Position</span>
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Company Positions</h3>
              </div>
              <div className="p-6">
                {positions.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {positions.map((position) => (
                      <div key={position.positionId} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Building2 className="h-5 w-5 text-gray-500" />
                          <span className="font-medium text-gray-900">{position.title}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No positions created yet</p>
                    <button
                      onClick={() => setShowCreatePositionForm(true)}
                      className="mt-2 text-purple-600 hover:text-purple-700"
                    >
                      Create your first position
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Create HR Modal */}
        {showCreateHRForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Create HR Account</h3>
              <form onSubmit={handleCreateHR} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input
                    type="text"
                    value={hrForm.username}
                    onChange={(e) => setHrForm({ ...hrForm, username: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    value={hrForm.password}
                    onChange={(e) => setHrForm({ ...hrForm, password: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Position Title</label>
                  <select
                    value={hrForm.position.title}
                    onChange={(e) => setHrForm({ ...hrForm, position: { title: e.target.value } })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Position</option>
                    {positions.map((position) => (
                      <option key={position.positionId} value={position.title}>
                        {position.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateHRForm(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createHRMutation.isLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {createHRMutation.isLoading ? 'Creating...' : 'Create HR'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Create Employee Modal */}
        {showCreateEmployeeForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Employee Account</h3>
              <form onSubmit={handleCreateEmployee} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input
                    type="text"
                    value={employeeForm.username}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, username: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    value={employeeForm.password}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, password: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Position Title</label>
                  <select
                    value={employeeForm.position.title}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, position: { title: e.target.value } })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select Position</option>
                    {positions.map((position) => (
                      <option key={position.positionId} value={position.title}>
                        {position.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateEmployeeForm(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createEmployeeMutation.isLoading}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                  >
                    {createEmployeeMutation.isLoading ? 'Creating...' : 'Create Employee'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Create Position Modal */}
        {showCreatePositionForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Position</h3>
              <form onSubmit={handleCreatePosition} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Position Title</label>
                  <input
                    type="text"
                    value={positionForm.title}
                    onChange={(e) => setPositionForm({ title: e.target.value })}
                    required
                    placeholder="e.g., Software Engineer, HR Manager, Marketing Specialist"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreatePositionForm(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createPositionMutation.isLoading}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
                  >
                    {createPositionMutation.isLoading ? 'Adding...' : 'Add Position'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Create Admin Modal */}
        {showCreateAdminForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Admin Account</h3>
              <form onSubmit={handleCreateAdmin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input
                    type="text"
                    value={adminForm.username}
                    onChange={(e) => setAdminForm({ ...adminForm, username: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    value={adminForm.password}
                    onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateAdminForm(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createAdminMutation.isLoading}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
                  >
                    {createAdminMutation.isLoading ? 'Creating...' : 'Create Admin'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPage;

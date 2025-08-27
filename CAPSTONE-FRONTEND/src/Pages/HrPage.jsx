import React, { useState} from 'react';
import { Button } from '@/components/ui/button';
import { FiArrowLeft, FiBriefcase, FiHome } from 'react-icons/fi';
import { useNavigate, Routes, Route, Outlet } from 'react-router-dom';
import { Users, Plus, Building2, UserPlus } from 'lucide-react';
import TimelogWidget from '../components/TimelogWidget';
import TimelogManagement from '../components/TimelogManagement';
import HrAttendanceSummary from '../components/HrAttendanceSummary';
import HrLeaveManagement from '../components/HrLeaveManagement';
import LeaveRequestForm from '../components/LeaveRequestForm';
import LeaveBalanceCard from '../components/LeaveBalanceCard';
import LeaveRequestsList from '../components/LeaveRequestsList';
import Header from '../components/Header';
import { useActiveAnnouncements } from '../Api';
import { usePendingRequestsCount } from '../Api/hooks/useLeaveRequests';
import { useHr } from '../Api/hooks/useHr';
import { usePositions } from '../Api/hooks/usePositions';
import { useQueryClient } from '@tanstack/react-query';

const HrPage = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [leaveTab, setLeaveTab] = useState('request'); // 'manage' or 'request'
  const [managementTab, setManagementTab] = useState('users'); // 'users' or 'positions'
  const [showCreateHRForm, setShowCreateHRForm] = useState(false);
  const [showCreateEmployeeForm, setShowCreateEmployeeForm] = useState(false);
  const [showCreatePositionForm, setShowCreatePositionForm] = useState(false);
  
  const navigate = useNavigate();
  const { data: announcements = [], isLoading } = useActiveAnnouncements();
  const { data: pendingCount = 0 } = usePendingRequestsCount();
  
  const queryClient = useQueryClient();
  const { createHRMutation, createEmployeeMutation } = useHr();
  const { data: positions = [], createPositionMutation } = usePositions();

  // Get current user ID from localStorage
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const employeeId = currentUser.userId;
  
  // Check if user can manage leave requests (HR-Manager or HR-Supervisor only)
  const canManageLeaveRequests = () => {
    const userPosition = localStorage.getItem('position');
    return userPosition === 'HR-Manager' || userPosition === 'HR-Supervisor';
  };

  // Check if user can access leave management page (all HR users)
  const canAccessLeaveManagement = () => {
    return currentUser.role === 'HR';
  };

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

  const handleCreatePosition = (e) => {
    e.preventDefault();
    createPositionMutation.mutate(positionForm, {
      onSuccess: () => {
        setPositionForm({ title: '' });
        setShowCreatePositionForm(false);
        queryClient.invalidateQueries({ queryKey: ['positions'] });
      }
    });
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Header userRole="HR" />

      {/* Main Content */}
      <main className="flex gap-8 px-8 py-8">
        {/* Left Sidebar */}
        <aside className="w-1/4">
          {/* User Card */}
          <div className="bg-white rounded-lg shadow mb-6 overflow-hidden border border-gray-200">
            <div className="bg-white px-6 pt-4 pb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full" />
                <div>
                  <div className="font-bold text-lg">John Doe</div>
                </div>
              </div>
              <Button className="w-full bg-[#a020f0] text-white py-3 rounded-lg font-semibold mb-4 hover:bg-[#a020f0]/90 transition-colors">
                Request Time off
              </Button>
            
              <div className="mb-0">
                <div className="font-semibold text-gray-800 mb-2">Who's Out</div>
                <div className="text-xs text-gray-500 mb-1 uppercase">Today</div>
                <div className="text-sm text-gray-500 mb-2">Nobody requested time off Today</div>
                <div className="text-xs text-gray-500 mb-1 uppercase">Tomorrow</div>
                <div className="text-sm text-gray-500 mb-2">Nobody requested time off Tomorrow</div>
                <div className="text-xs text-gray-500 mb-1 uppercase">Friday, Aug 20</div>
                <div className="text-sm text-gray-500 mb-2">Nobody requested time off for Friday</div>
              </div>
              <div className="border-t border-gray-200 my-4"></div>
              <div>
                <div className="font-semibold text-gray-800 mb-1">Celebrations</div>
                <div className="text-sm text-gray-400">Everyday is a good day to celebrate something.</div>
              </div>
            </div>
          </div>

          {/* Timelog Widget */}
          <TimelogWidget />
            
          {/* Company Links Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" className="inline-block text-purple-700">
                  <path d="M17 17a3 3 0 0 1-4.24 0l-2.76-2.76a3 3 0 0 1 0-4.24l1.06-1.06a3 3 0 0 1 4.24 0l2.76 2.76a3 3 0 0 1 0 4.24l-1.06 1.06z" stroke="#a020f0" strokeWidth="2" fill="none"/>
                  <path d="M7 7a3 3 0 0 1 4.24 0l2.76 2.76a3 3 0 0 1 0 4.24l-1.06 1.06a3 3 0 0 1-4.24 0L5.94 13.06a3 3 0 0 1 0-4.24L7 7z" stroke="#a020f0" strokeWidth="2" fill="none"/>
                </svg>
                <span className="font-semibold text-purple-700">COMPANY LINKS</span>
              </div>
              <a href="#" className="text-blue-500 text-sm hover:underline">Manage</a>
            </div>
            <div className="flex flex-col items-center justify-center py-6">
              <svg width="48" height="48" fill="none" viewBox="0 0 24 24" className="mb-2 text-gray-300"><path d="M17 7a5 5 0 0 0-10 0v4a5 5 0 0 0 10 0V7z" stroke="#d1d5db" strokeWidth="2" fill="none"/><path d="M7 17a5 5 0 0 0 10 0v-4a5 5 0 0 0-10 0v4z" stroke="#d1d5db" strokeWidth="2" fill="none"/></svg>
              <span className="text-gray-400 text-center">Your company hasn't added any Links yet.</span>
            </div>
          </div>
        </aside>

        {/* Center Content */}
        <section className="flex-1">
          {/* Navigation Bar */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveSection('dashboard')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeSection === 'dashboard' 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveSection('timelog')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeSection === 'timelog' 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Timelog Management
              </button>
              <button
                onClick={() => setActiveSection('attendance')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeSection === 'attendance' 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                My Attendance
              </button>
              <button
                onClick={() => canAccessLeaveManagement() ? setActiveSection('leave') : null}
                disabled={!canAccessLeaveManagement()}
                className={`px-4 py-2 rounded-lg font-medium transition-colors relative ${
                  !canAccessLeaveManagement() 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                    : activeSection === 'leave' 
                      ? 'bg-purple-600 text-white' 
                      : 'text-gray-600 hover:bg-gray-100'
                }`}
                title={!canAccessLeaveManagement() ? 'Only HR users can access leave management' : ''}
              >
                Leave Management
                {canManageLeaveRequests() && pendingCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {pendingCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveSection('management')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeSection === 'management' 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                User Management
              </button>
            </div>
          </div>

          {/* Dashboard Section */}
          {activeSection === 'dashboard' && (
            <>
              <div className="bg-white rounded-lg shadow p-8 mb-6 relative">
                <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl">×</button>
                <div className="flex flex-col items-center gap-2 mb-2">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="8" y="8" width="32" height="28" rx="4" fill="#fff" stroke="#a020f0" strokeWidth="2"/>
                    <path d="M24 44L20 36H28L24 44Z" fill="#fff" stroke="#a020f0" strokeWidth="2"/>
                    <text x="16" y="28" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="18" fill="#a020f0">hi.</text>
                  </svg>
                  <span className="text-2xl font-bold">Welcome, John!</span>
                </div>
                <div className="text-gray-700 mb-6">
                  You're looking at TechStaffHub, your new tool for work. Here's a quick <span className="text-700">look at some of the things you can do with TechStaffHub.</span>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center">
                    <span className="text-3xl mb-2">🗓️</span>
                    <div className="font-semibold">Request Time Off</div>
                    <div className="text-sm text-gray-600 text-center">Request time off and check your balances.</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center">
                    <span className="text-3xl mb-2">📇</span>
                    <div className="font-semibold">Company Directory</div>
                    <div className="text-sm text-gray-600 text-center">Search for coworkers and their contact info.</div>
                  </div>
                  <a href="/hr/applications" className="bg-gray-50 rounded-lg p-4 flex flex-col items-center hover:bg-gray-100 transition-colors">
                    <span className="text-3xl mb-2">📋</span>
                    <div className="font-semibold">Job Applications</div>
                    <div className="text-sm text-gray-600 text-center">Manage job applications and applicants.</div>
                  </a>
                  <a href="/hr/resume-review" className="bg-gray-50 rounded-lg p-4 flex flex-col items-center hover:bg-gray-100 transition-colors">
                    <span className="text-3xl mb-2">📄</span>
                    <div className="font-semibold">Resume Review</div>
                    <div className="text-sm text-gray-600 text-center">AI-powered resume analysis and review.</div>
                  </a>
                  <a href="/hr/announcements" className="bg-gray-50 rounded-lg p-4 flex flex-col items-center hover:bg-gray-100 transition-colors">
                    <span className="text-3xl mb-2">📢</span>
                    <div className="font-semibold">Announcements</div>
                    <div className="text-sm text-gray-600 text-center">Create and manage company announcements.</div>
                  </a>
                  <button 
                    onClick={() => setActiveSection('timelog')}
                    className="bg-gray-50 rounded-lg p-4 flex flex-col items-center hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-3xl mb-2">⏰</span>
                    <div className="font-semibold">Timelog Management</div>
                    <div className="text-sm text-gray-600 text-center">View and manage employee attendance records.</div>
                  </button>
                  <button 
                    onClick={() => canAccessLeaveManagement() ? setActiveSection('leave') : null}
                    disabled={!canAccessLeaveManagement()}
                    className={`rounded-lg p-4 flex flex-col items-center transition-colors relative ${
                      !canAccessLeaveManagement() 
                        ? 'bg-gray-200 cursor-not-allowed opacity-50'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    title={!canAccessLeaveManagement() ? 'Only HR users can access leave management' : ''}
                  >
                    <span className="text-3xl mb-2">🏖️</span>
                    <div className="font-semibold">Leave Management</div>
                    <div className="text-sm text-gray-600 text-center">File leave requests and manage approvals.</div>
                    {canManageLeaveRequests() && pendingCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                        {pendingCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Timelog Management Section */}
          {activeSection === 'timelog' && (
            <TimelogManagement />
          )}

          {/* HR Attendance Summary Section */}
          {activeSection === 'attendance' && (
            <HrAttendanceSummary />
          )}

          {/* Leave Management Section */}
          {activeSection === 'leave' && (
            <div className="space-y-6">
              {/* Leave Management Tabs */}
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex gap-4 border-b border-gray-200 pb-3 mb-4">
                  {canManageLeaveRequests() && (
                    <button
                      onClick={() => setLeaveTab('manage')}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        leaveTab === 'manage' 
                          ? 'bg-purple-600 text-white' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      Manage Requests
                      {pendingCount > 0 && (
                        <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 inline-flex items-center justify-center">
                          {pendingCount}
                        </span>
                      )}
                    </button>
                  )}
                  <button
                    onClick={() => setLeaveTab('request')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      leaveTab === 'request' 
                        ? 'bg-purple-600 text-white' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    My Leave Requests
                  </button>
                </div>

                {/* Tab Content */}
                {leaveTab === 'manage' && canManageLeaveRequests() && <HrLeaveManagement />}
                
                {leaveTab === 'manage' && !canManageLeaveRequests() && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <div className="flex items-center gap-3 text-yellow-800">
                      <span className="text-2xl">⚠️</span>
                      <div>
                        <h4 className="font-semibold text-lg">Access Restricted</h4>
                        <p className="text-sm mt-1">Only HR-Manager and HR-Supervisor positions can manage leave requests.</p>
                        <p className="text-sm mt-1">You can still file your own leave requests using the "My Leave Requests" tab.</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {leaveTab === 'request' && (
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <LeaveRequestForm employeeId={employeeId} />
                      <LeaveBalanceCard employeeId={employeeId} />
                    </div>
                    <div>
                      <LeaveRequestsList employeeId={employeeId} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* User Management Section */}
          {activeSection === 'management' && (
            <div className="space-y-6">
              {/* Management Tabs */}
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex gap-4 border-b border-gray-200 pb-3 mb-4">
                  <button
                    onClick={() => setManagementTab('users')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      managementTab === 'users' 
                        ? 'bg-purple-600 text-white' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    User Management
                  </button>
                  <button
                    onClick={() => setManagementTab('positions')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      managementTab === 'positions' 
                        ? 'bg-purple-600 text-white' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Position Management
                  </button>
                </div>

                {/* User Management Tab */}
                {managementTab === 'users' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
                      <div className="flex space-x-3">
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
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    </div>
                  </div>
                )}

                {/* Position Management Tab */}
                {managementTab === 'positions' && (
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
              </div>
            </div>
          )}

          {/* Announcements section - only show on dashboard */}
          {activeSection === 'dashboard' && (
            <>
              <div className="bg-white rounded-lg border border-gray-200 p-4 mt-6">
                <div className="flex items-center gap-2 mb-2">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" className="inline-block text-gray-500"><path d="M12 20v-6" stroke="#888" strokeWidth="2" strokeLinecap="round"/><path d="M6 12a6 6 0 0 1 12 0" stroke="#888" strokeWidth="2" fill="none"/><path d="M12 4v2" stroke="#888" strokeWidth="2" strokeLinecap="round"/></svg>
                  <span className="font-semibold text-gray-700">COMPANY ANNOUNCEMENTS</span>
                </div>
                <div className="py-4">
                  {isLoading ? (
                    <div className="text-center py-4 text-gray-500">Loading announcements...</div>
                  ) : announcements.length > 0 ? (
                    <div className="space-y-4">
                      {announcements.map((announcement) => (
                        <div key={announcement.id} className="border-l-4 border-purple-500 pl-4 py-2">
                          <h3 className="font-semibold text-gray-800">{announcement.title}</h3>
                          <p className="text-gray-600 text-sm mt-1">{announcement.content}</p>
                          <div className="text-xs text-gray-500 mt-2">
                            {announcement.priority} • {announcement.createdBy?.username} • {new Date(announcement.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6">
                      <svg width="40" height="40" fill="none" viewBox="0 0 24 24" className="mb-2 text-gray-300"><path d="M12 2v20" stroke="#d1d5db" strokeWidth="2"/><path d="M2 12h20" stroke="#d1d5db" strokeWidth="2"/></svg>
                      <span className="text-gray-400 text-center">No announcements available</span>
                    </div>
                  )}
                </div>
              </div>
              {/* Welcome to TechStaffHub section */}
              <div className="bg-white rounded-lg shadow p-4 mt-6 flex flex-col items-center justify-center text-center">
                <div className="font-semibold mb-2 flex items-center gap-2">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="inline-block text-gray-400"><rect x="3" y="5" width="18" height="14" rx="2" stroke="#888" strokeWidth="2" fill="none"/><path d="M7 8h10M7 12h6" stroke="#888" strokeWidth="2" strokeLinecap="round"/></svg>
                  WELCOME TO TECHSTAFFHUB
                </div>
                <div className="flex flex-col items-center justify-center mt-4">
                  <svg width="40" height="40" fill="none" viewBox="0 0 24 24" className="mb-2 text-gray-300"><rect x="4" y="4" width="16" height="16" rx="4" fill="#e5e7eb"/><rect x="8" y="8" width="8" height="5" rx="2" fill="#d1d5db"/><circle cx="12" cy="15" r="2" fill="#d1d5db"/></svg>
                  <span className="text-gray-400">Nobody will be joining TechStaffHub for the next little while.</span>
                </div>
              </div>
            </>
          )}
        </section>
      </main>

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
    </div>
  );
};

export default HrPage;


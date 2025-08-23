import React, { useState} from 'react';
import { Button } from '@/components/ui/button';
import { FiArrowLeft, FiBriefcase, FiHome } from 'react-icons/fi';
import { useNavigate, Routes, Route, Outlet } from 'react-router-dom';
import TimelogWidget from '../components/TimelogWidget';
import TimelogManagement from '../components/TimelogManagement';
import HrAttendanceSummary from '../components/HrAttendanceSummary';
import Header from '../components/Header';
import { useActiveAnnouncements } from '../Api';

const HrPage = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const navigate = useNavigate();
  const { data: announcements = [], isLoading } = useActiveAnnouncements();

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
    </div>
  );
};

export default HrPage;


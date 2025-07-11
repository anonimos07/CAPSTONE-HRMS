import React, { useState} from 'react';
import { Button } from '@/components/ui/button';
import { FiArrowLeft, FiBriefcase, FiHome } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const HrPage = () => {

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white px-8 py-4 flex items-center justify-between shadow">
        <div className="flex items-center gap-3">
          <div className="bg-purple-100 rounded-xl w-14 h-14 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 32 32" className="w-8 h-8 text-purple-600">
              <rect x="7" y="12" width="18" height="12" rx="2" stroke="#a020f0" strokeWidth="2" fill="none" />
              <path d="M12 12V9a4 4 0 0 1 8 0v3" stroke="#a020f0" strokeWidth="2" fill="none" />
              <path d="M16 16v4" stroke="#a020f0" strokeWidth="2" fill="none" />
            </svg>
          </div>
          <span className="text-3xl font-bold text-purple-700">TechStaffHub</span>
        </div>
        <nav className="flex gap-8 text-lg font-medium text-gray-700">
          <a href="#" className="hover:underline">Home</a>
          <a href="#" className="hover:underline">My Info</a>
          <a href="#" className="hover:underline">People</a>
          <a href="#" className="hover:underline">Hiring</a>
          <a href="#" className="hover:underline">Reports</a>
          <a href="#" className="hover:underline">Files</a>
        </nav>
        <div className="flex items-center gap-4">
          <input type="text" placeholder="Search..." className="rounded px-2 py-1 text-black border border-gray-300" />
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-bold hover:bg-purple-200 transition-colors"
            >
              MS
            </button>
            
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50">Profile</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50">Settings</a>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-red-600"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Click outside to close dropdown */}
        {isDropdownOpen && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsDropdownOpen(false)}
          />
        )}
      </header>

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
                  <div className="font-bold text-lg">Marcus Stonelius</div>
                </div>
              </div>
              <Button className="w-full" style={{ backgroundColor: '#a020f0', color: '#fff' }}>
                Request Time Off
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
          <div className="bg-white rounded-lg shadow p-8 mb-6 relative">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl">×</button>
            <div className="flex flex-col items-center gap-2 mb-2">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="8" y="8" width="32" height="28" rx="4" fill="#fff" stroke="#a020f0" strokeWidth="2"/>
                <path d="M24 44L20 36H28L24 44Z" fill="#fff" stroke="#a020f0" strokeWidth="2"/>
                <text x="16" y="28" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="18" fill="#a020f0">hi.</text>
              </svg>
              <span className="text-2xl font-bold">Welcome, Marcus!</span>
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
              <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center">
                <span className="text-3xl mb-2">📋</span>
                <div className="font-semibold">Job Openings and Hiring</div>
                <div className="text-sm text-gray-600 text-center">Manage your job postings and applicants.</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center">
                <span className="text-3xl mb-2">📊</span>
                <div className="font-semibold">Reporting</div>
                <div className="text-sm text-gray-600 text-center">View and create the reports you need.</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center">
                <span className="text-3xl mb-2">🎓</span>
                <div className="font-semibold">Training</div>
                <div className="text-sm text-gray-600 text-center">Stay on top of your trainings and certifications.</div>
              </div>
            </div>
          </div>
          {/* What's Happening at TechStaffHub section */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mt-6">
            <div className="flex items-center gap-2 mb-2">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" className="inline-block text-gray-500"><path d="M12 20v-6" stroke="#888" strokeWidth="2" strokeLinecap="round"/><path d="M6 12a6 6 0 0 1 12 0" stroke="#888" strokeWidth="2" fill="none"/><path d="M12 4v2" stroke="#888" strokeWidth="2" strokeLinecap="round"/></svg>
              <span className="font-semibold text-gray-700">WHAT'S HAPPENING AT TechStaffHub</span>
            </div>
            <div className="flex flex-col items-center justify-center py-6">
              <svg width="40" height="40" fill="none" viewBox="0 0 24 24" className="mb-2 text-gray-300"><path d="M12 2v20" stroke="#d1d5db" strokeWidth="2"/><path d="M2 12h20" stroke="#d1d5db" strokeWidth="2"/></svg>
              <span className="text-gray-400 text-center">You don't have any notifications at the moment...</span>
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
        </section>
      </main>
    </div>
  );
};

export default HrPage;


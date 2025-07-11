import React, { useState} from 'react';
import { Button } from '@/components/ui/button';
import { FiArrowLeft, FiBriefcase, FiHome } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const EmployeePage = () => {

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
        <main className="px-8 py-6 grid grid-cols-3 gap-6">
          {/* Left Column */}
          <section className="col-span-1 flex flex-col gap-6">
            {/* User Card */}
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <div className="w-12 h-12 bg-gray-300 rounded-full" />
              <div className="text-2xl font-bold text-purple-800">Hi, Marcus Stonelius</div>
            </div>
            {/* My Time Card */}
            <div className="bg-white rounded-xl shadow p-6 w-full">
              <div className="flex items-center gap-2 mb-2">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="text-purple-700">
                  <circle cx="12" cy="12" r="10" stroke="#a020f0" strokeWidth="2" fill="none"/>
                  <path d="M12 6v6l4 2" stroke="#a020f0" strokeWidth="2" fill="none"/>
                </svg>
                <span className="font-semibold text-purple-700">My Time</span>
              </div>
              <div className="text-center text-gray-500 mb-2">Not Clocked In</div>
              <div className="text-center text-2xl font-bold text-purple-700 mb-2">Oh 00m Today</div>
              <button className="w-full bg-purple-700 text-white py-2 rounded-lg font-semibold mb-2">Clock In</button>
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>Today → Oh 00m</span>
                <button className="text-blue-600 hover:underline">+ Add Time Entry</button>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>This Week<br /><span className="font-bold">Oh 00m</span></span>
                <span>Pay Period<br /><span className="font-bold">Oh 00m</span></span>
                <button className="bg-gray-200 px-2 py-1 rounded">My Timesheet</button>
              </div>
            </div>
            {/* My Stuff Card */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="font-semibold text-purple-700 mb-2">My Stuff</div>
              <div className="font-bold">Training</div>
              <div className="text-gray-500 text-sm">2 active trainings, 6 past due or expired</div>
            </div>
            {/* Celebrations Card */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="font-semibold text-purple-700 mb-2">Celebrations</div>
              <div className="text-gray-700">Marcus Stonelius<br /><span className="text-gray-500 text-sm">October 1 - Happy Birthday!</span></div>
            </div>
          </section>
          {/* Center/Right Column */}
          <section className="col-span-2 flex flex-col gap-6">
            {/* Employee Community & What's Happening Tabs */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex gap-8 border-b pb-2 mb-4">
                <button className="font-semibold text-purple-700 border-b-2 border-purple-700 pb-1">Employee Community</button>
                <button className="font-semibold text-gray-500 pb-1">What's Happening</button>
              </div>
              <div className="flex gap-2 mb-4">
                <button className="bg-purple-100 text-purple-700 px-3 py-1 rounded">New Post</button>
                <select className="border rounded px-2 py-1 text-gray-700">
                  <option>Announcements</option>
                </select>
                <a href="#" className="ml-auto text-blue-600 hover:underline">Visit Employee Community</a>
              </div>
              {/* Announcements List */}
              <div className="flex flex-col gap-4">
                <div className="flex gap-3 items-start">
                  <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Lisa" className="w-10 h-10 rounded-full" />
                  <div>
                    <div className="font-semibold">New Courses in BambooHR Learning (February 2024)</div>
                    <div className="text-purple-700 text-xs">Announcement Lisa Beckley to Company News on Feb 21st</div>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <img src="https://randomuser.me/api/portraits/women/45.jpg" alt="Madalyn" className="w-10 h-10 rounded-full" />
                  <div>
                    <div className="font-semibold">New Software Solution</div>
                    <div className="text-purple-700 text-xs">Announcement Madalyn Walker to IT Updates on Feb 7th</div>
                  </div>
                </div>
              </div>
            </div>
            {/* Bottom Grid: Who's Out & Company Links */}
            <div className="grid grid-cols-2 gap-6 mt-6">
              <div className="bg-white rounded-xl shadow p-6">
                <div className="font-semibold text-purple-700 mb-2">Who's Out</div>
                <div className="text-gray-500">Today (1)</div>
              </div>
              <div className="bg-white rounded-xl shadow p-6">
                <div className="font-semibold text-purple-700 mb-2">Company Links</div>
                <div className="text-gray-500">Company</div>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  };

export default EmployeePage;
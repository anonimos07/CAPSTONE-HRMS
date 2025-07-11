import React, { useState } from 'react';


const EmployeeProfile = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    // Add your logout logic here
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
              JD
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
      <div className="min-h-screen bg-gray-100 flex">
        {/* Sidebar */}
        <aside className="w-1/5 bg-white flex flex-col items-center py-10 shadow-md min-h-screen">
          <div className="w-20 h-20 bg-purple-200 rounded-full flex items-center justify-center mb-3">
            <svg width="48" height="48" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="8" r="6" fill="#a020f0" />
              <rect x="4" y="16" width="16" height="6" rx="3" fill="#a020f0" />
            </svg>
          </div>
          <div className="text-lg font-bold text-gray-800 mb-1">John Doe</div>
          <div className="text-gray-400 mb-6">&bull;</div>
          <nav className="w-full px-6">
            <ul className="space-y-2">
              <li className="text-gray-700 flex items-center gap-2 py-2 px-3 rounded hover:bg-gray-100 cursor-pointer"><span>🕒</span>Attendance</li>
              <li className="text-gray-700 flex items-center gap-2 py-2 px-3 rounded hover:bg-gray-100 cursor-pointer"><span>📝</span>Leave</li>
              <li className="text-gray-700 flex items-center gap-2 py-2 px-3 rounded hover:bg-gray-100 cursor-pointer"><span>📁</span>Project</li>
            </ul>
          </nav>
        </aside>
        {/* Main Content */}
        <main className="flex-1 p-10">
          {/* Tabs */}
          <div className="bg-white rounded-t-lg shadow flex flex-col mb-6">
            <div className="flex items-center px-8 pt-6 pb-2">
              <svg className="text-purple-600 mr-2" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="6" fill="#a020f0" />
                <rect x="4" y="16" width="16" height="6" rx="3" fill="#a020f0" />
              </svg>
              <span className="text-xl font-semibold text-gray-700">John Doe</span>
            </div>
            <nav className="flex border-b border-gray-200 px-8">
              <button className="py-3 px-4 text-sm font-medium text-purple-600 border-b-2 border-purple-600 focus:outline-none">Personal Info</button>
              <button className="py-3 px-4 text-sm font-medium text-gray-500 hover:text-purple-600">Leave</button>
              <button className="py-3 px-4 text-sm font-medium text-gray-500 hover:text-purple-600">Social Media</button>
              <button className="py-3 px-4 text-sm font-medium text-gray-500 hover:text-purple-600">Change Password</button>
            </nav>
          </div>
          {/* Profile Card */}
          <div className="bg-white rounded-b-lg shadow p-8 flex gap-12 max-w-5xl mx-auto">
            {/* Avatar and Name */}
            <div className="flex flex-col items-center w-1/3">
              <div className="w-32 h-32 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <svg width="80" height="80" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="8" r="8" fill="#a020f0" />
                  <rect x="2" y="16" width="20" height="6" rx="3" fill="#a020f0" />
                </svg>
              </div>
              <div className="text-xl font-bold text-gray-800 mb-1">John Doe</div>
              <div className="text-gray-500">Software Engineer</div>
            </div>
            {/* Employee Details */}
            <div className="flex-1 grid grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-600 mb-1">First Name</label>
                <input type="text" value="John" className="w-full border border-gray-300 rounded px-3 py-2" readOnly />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Last Name</label>
                <input type="text" value="Doe" className="w-full border border-gray-300 rounded px-3 py-2" readOnly />
              </div>
              <div className="col-span-2">
                <label className="block text-gray-600 mb-1">Contact</label>
                <input type="text" value="09123456789" className="w-full border border-gray-300 rounded px-3 py-2" readOnly />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Department</label>
                <input type="text" value="IT Department" className="w-full border border-gray-300 rounded px-3 py-2" readOnly />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Address</label>
                <input type="text" value="123 Main St, City, Country" className="w-full border border-gray-300 rounded px-3 py-2" readOnly />
              </div>
              <div className="col-span-2">
                <label className="block text-gray-600 mb-1">Email</label>
                <input type="email" value="john.doe@email.com" className="w-full border border-gray-300 rounded px-3 py-2" readOnly />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EmployeeProfile;
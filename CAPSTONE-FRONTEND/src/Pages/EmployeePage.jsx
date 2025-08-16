import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiHome, 
  FiBriefcase, 
  FiUsers, 
  FiFileText, 
  FiSearch, 
  FiBell, 
  FiSettings, 
  FiLogOut, 
  FiChevronDown,
  FiClock,
  FiCalendar,
  FiMessageSquare,
  FiBook,
  FiHelpCircle
} from 'react-icons/fi';
import TimelogWidget from '../components/TimelogWidget';

const EmployeePage = () => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [activeNavDropdown, setActiveNavDropdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
        setIsSearchDropdownOpen(false);
        setActiveNavDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const navItems = [
    { 
      label: 'Home', 
      icon: <FiHome className="w-4 h-4" />,
      href: '#'
    },
    { 
      label: 'My Info', 
      icon: <FiBriefcase className="w-4 h-4" />,
      dropdown: [
        { label: 'Personal', href: '#' },
        { label: 'Employment', href: '#' },
        { label: 'Documents', href: '#' }
      ]
    },
    { 
      label: 'People', 
      icon: <FiUsers className="w-4 h-4" />,
      dropdown: [
        { label: 'Directory', href: '#' },
        { label: 'Org Chart', href: '#' },
        { label: 'Teams', href: '#' }
      ]
    },
    { 
      label: 'Files', 
      icon: <FiFileText className="w-4 h-4" />,
      dropdown: [
        { label: 'My Files', href: '#' },
        { label: 'Company Files', href: '#' },
        { label: 'Shared', href: '#' }
      ]
    }
  ];

  const recentSearches = [
    'Time Off Requests',
    'Payroll Documents',
    'Company Policies',
    'Training Materials'
  ];

  const announcements = [
    {
      title: 'New Courses in BambooHR Learning (February 2024)',
      meta: 'Announcement • Lisa Beckley • Company News • Feb 21st',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    {
      title: 'New Software Solution',
      meta: 'Announcement • Madalyn Walker • IT Updates • Feb 7th',
      avatar: 'https://randomuser.me/api/portraits/women/45.jpg'
    }
  ];

  const whosOut = [
    {
      initials: 'MS',
      name: 'Mark Smith',
      type: 'Vacation',
      date: 'Until Feb 28'
    }
  ];

  const companyLinks = [
    { label: 'Employee Handbook', icon: <FiBook className="w-4 h-4" /> },
    { label: 'Benefits', icon: <FiHelpCircle className="w-4 h-4" /> },
    { label: 'Policies', icon: <FiFileText className="w-4 h-4" /> },
    { label: 'IT Helpdesk', icon: <FiSettings className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(147, 51, 234, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(147, 51, 234, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
            }}
          ></div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm px-8 py-4 flex items-center justify-between shadow-sm border-b border-purple-100 sticky top-0 z-50">
          {/* Logo and main nav */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 rounded-xl w-14 h-14 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 32 32" className="w-8 h-8 text-purple-600">
                  <rect x="7" y="12" width="18" height="12" rx="2" stroke="#a020f0" strokeWidth="2" fill="none" />
                  <path d="M12 12V9a4 4 0 0 1 8 0v3" stroke="#a020f0" strokeWidth="2" fill="none" />
                  <path d="M16 16v4" stroke="#a020f0" strokeWidth="2" fill="none" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-purple-700">TechStaffHub</span>
            </div>

            <nav className="flex gap-2">
              {navItems.map((item, index) => (
                <div key={index} className="relative" ref={dropdownRef}>
                  {item.dropdown ? (
                    <>
                      <button
                        onClick={() => setActiveNavDropdown(activeNavDropdown === index ? null : index)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-purple-50 hover:text-purple-700 transition-colors"
                      >
                        {item.icon}
                        <span>{item.label}</span>
                        <FiChevronDown className={`w-4 h-4 transition-transform ${activeNavDropdown === index ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {activeNavDropdown === index && (
                        <div className="absolute left-0 mt-1 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-purple-100">
                          {item.dropdown.map((subItem, subIndex) => (
                            <a 
                              key={subIndex} 
                              href={subItem.href} 
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                            >
                              {subItem.label}
                            </a>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <a
                      href={item.href}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-purple-50 hover:text-purple-700 transition-colors"
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </a>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-4" ref={dropdownRef}>
            {/* Search with dropdown */}
            <div className="relative">
              <div className="flex items-center">
                <FiSearch className="absolute left-3 text-purple-400" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="rounded-lg px-4 pl-10 py-2 text-sm border border-purple-200 focus:border-purple-500 focus:ring-purple-500 bg-white/50 w-64"
                  onFocus={() => setIsSearchDropdownOpen(true)}
                />
              </div>
              
              {isSearchDropdownOpen && (
                <div className="absolute left-0 mt-1 w-64 bg-white rounded-lg shadow-lg py-2 z-50 border border-purple-100">
                  {searchQuery ? (
                    <div className="px-4 py-2 text-sm text-gray-500">Search results for "{searchQuery}"</div>
                  ) : (
                    <>
                      <div className="px-4 py-2 text-xs text-gray-500 uppercase">Recent Searches</div>
                      {recentSearches.map((search, index) => (
                        <a 
                          key={index} 
                          href="#" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                        >
                          {search}
                        </a>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Notifications */}
            <button className="p-2 rounded-full hover:bg-purple-100 text-gray-600 hover:text-purple-700 relative">
              <FiBell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Profile dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-bold hover:bg-purple-200 transition-colors"
              >
                JD
              </button>
              
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-1 z-50 border border-purple-100">
                  <div className="px-4 py-3 border-b border-purple-100">
                    <div className="font-medium text-gray-800">John Doe</div>
                    <div className="text-xs text-gray-500">Software Developer</div>
                  </div>
                  <a href="/employeeprofile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50">
                    <FiSettings className="w-4 h-4 mr-2" /> Profile
                  </a>
                  <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50">
                    <FiSettings className="w-4 h-4 mr-2" /> Settings
                  </a>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-red-600"
                  >
                    <FiLogOut className="w-4 h-4 mr-2" /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-8 py-6 grid grid-cols-3 gap-6">
          {/* Left Column */}
          <section className="col-span-1 flex flex-col gap-6">
            {/* User Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-6 flex flex-col items-center border border-purple-100">
              <div className="w-24 h-24 bg-purple-200 rounded-full mb-4 flex items-center justify-center text-3xl font-bold text-purple-700">
                JD
              </div>
              <div className="text-xl font-bold text-purple-800 mb-1">John Doe</div>
              <div className="text-sm text-purple-600 mb-4">Software Developer</div>
              <div className="w-full border-t border-purple-100 pt-4 text-center">
                <div className="text-xs text-gray-500">Last active: 2 hours ago</div>
              </div>
            </div>

            {/* Timelog Widget */}
            <TimelogWidget />


            {/* My Stuff Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-6 border border-purple-100">
              <div className="font-semibold text-purple-700 mb-3">My Stuff</div>
              <div className="font-medium text-gray-800 mb-1">Training</div>
              <div className="text-xs text-gray-500">2 active trainings, 6 past due or expired</div>
            </div>

            {/* Celebrations Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-6 border border-purple-100">
              <div className="font-semibold text-purple-700 mb-3">Celebrations</div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-bold">
                  JD
                </div>
                <div>
                  <div className="text-gray-800">John Doe</div>
                  <div className="text-xs text-gray-500">October 1 - Happy Birthday!</div>
                </div>
              </div>
            </div>
          </section>

          {/* Center/Right Column */}
          <section className="col-span-2 flex flex-col gap-6">
            {/* Employee Community & What's Happening Tabs */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-6 border border-purple-100">
              <div className="flex gap-8 border-b border-purple-100 pb-3 mb-4">
                <button className="font-semibold text-purple-700 border-b-2 border-purple-600 pb-1 px-1">
                  Employee Community
                </button>
                <button className="font-semibold text-gray-500 pb-1 px-1 hover:text-purple-700 transition-colors">
                  What's Happening
                </button>
              </div>
              <div className="flex gap-2 mb-6">
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow hover:shadow-md">
                  <FiMessageSquare className="inline mr-2 w-4 h-4" />
                  New Post
                </button>
                <select className="border border-purple-200 rounded-lg px-3 py-2 text-gray-700 text-sm bg-white/50 focus:border-purple-500 focus:ring-purple-500">
                  <option>Announcements</option>
                  <option>Discussions</option>
                  <option>Questions</option>
                </select>
                <a href="#" className="ml-auto text-purple-600 hover:text-purple-800 text-sm font-medium hover:underline transition-colors">
                  Visit Employee Community
                </a>
              </div>
              
              {/* Announcements List */}
              <div className="flex flex-col gap-4">
                {announcements.map((announcement, index) => (
                  <div key={index} className="flex gap-3 items-start p-3 hover:bg-purple-50 rounded-lg transition-colors">
                    <img src={announcement.avatar} alt="" className="w-10 h-10 rounded-full border border-purple-200" />
                    <div>
                      <div className="font-semibold text-gray-800">{announcement.title}</div>
                      <div className="text-purple-600 text-xs mt-1">{announcement.meta}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Grid: Who's Out & Company Links */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-6 border border-purple-100">
                <div className="font-semibold text-purple-700 mb-3 flex items-center gap-2">
                  <FiCalendar className="w-4 h-4" /> Who's Out
                </div>
                <div className="text-sm text-gray-500 mb-2">Today ({whosOut.length})</div>
                {whosOut.map((person, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 hover:bg-purple-50 rounded-lg transition-colors">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 text-xs font-bold">
                      {person.initials}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-800">{person.name}</div>
                      <div className="text-xs text-gray-500">{person.type} • {person.date}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-6 border border-purple-100">
                <div className="font-semibold text-purple-700 mb-3">Company Links</div>
                <div className="grid grid-cols-2 gap-3">
                  {companyLinks.map((link, index) => (
                    <a 
                      key={index} 
                      href="#" 
                      className="flex items-center gap-2 p-3 bg-purple-50 hover:bg-purple-100 rounded-lg text-purple-700 text-sm font-medium transition-colors"
                    >
                      {link.icon}
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default EmployeePage;
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Routes, Route, Outlet } from 'react-router-dom';
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
import PhilippineHolidaysCalendar from '../components/PhilippineHolidaysCalendar';
import Header from '../components/Header';
import LeaveRequestForm from '../components/LeaveRequestForm';
import LeaveBalanceCard from '../components/LeaveBalanceCard';
import LeaveRequestsList from '../components/LeaveRequestsList';
import { useActiveAnnouncements } from '../Api';
import { useClearNotificationCache } from '../Api/hooks/useNotifications';
import { useQueryClient } from '@tanstack/react-query';

const EmployeePage = () => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [activeNavDropdown, setActiveNavDropdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('community');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [leaveRequestsPage, setLeaveRequestsPage] = useState(1);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const { data: announcements = [], isLoading } = useActiveAnnouncements();

 
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const employeeId = currentUser.userId;
  


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

    queryClient.clear();
    clearNotificationCache();
    localStorage.clear();
    navigate('/login');
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

 
  const totalPages = Math.ceil(announcements.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAnnouncements = announcements.slice(startIndex, endIndex);


  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

 
  useEffect(() => {
    if (activeTab === 'community') {
      setCurrentPage(1);
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
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

     
      <div className="relative z-10">
        <Header userRole="EMPLOYEE" />

       
        <main className="px-8 py-6 grid grid-cols-3 gap-6">
        
          <section className="col-span-1 flex flex-col gap-6">
       
          
           
            <TimelogWidget />

         
            <PhilippineHolidaysCalendar />

          </section>

       
          <section className="col-span-2 flex flex-col gap-6">
        
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-6 border border-[#8b1e3f]/10">
              <div className="flex gap-8 border-b border-[#8b1e3f]/10 pb-3 mb-4">
                <button 
                  onClick={() => setActiveTab('community')}
                  className={`font-semibold pb-1 px-1 transition-colors ${
                    activeTab === 'community' 
                      ? 'text-[#8b1e3f] border-b-2 border-[#8b1e3f]/60' 
                      : 'text-gray-500 hover:text-[#8b1e3f]/70'
                  }`}
                >
                  Employee Community
                </button>
                <button 
                  onClick={() => setActiveTab('leave')}
                  className={`font-semibold pb-1 px-1 transition-colors ${
                    activeTab === 'leave' 
                      ? 'text-[#8b1e3f] border-b-2 border-[#8b1e3f]/60' 
                      : 'text-gray-500 hover:text-[#8b1e3f]/70'
                  }`}
                >
                  Leave Requests
                </button>
              </div>
          
              {activeTab === 'community' && (
                <>
                  <div className="flex gap-2 mb-6">
                    <div className="flex items-center">
                      <h1 className="text-2xl font-bold" style={{ color: "#8b1e3f" }}>
            Announcements
            </h1>
            </div>
                   
                    
                  </div>
                  
                  {/* Announcements List */}
                  <div className="flex flex-col gap-4">
                    {isLoading ? (
                      <div className="text-center py-4 text-gray-500">Loading announcements...</div>
                    ) : announcements.length > 0 ? (
                      currentAnnouncements.map((announcement) => (
                        <div key={announcement.id} className="flex gap-3 items-start p-3 hover:bg-[#8b1e3f]/20 rounded-lg transition-colors">
                          <div className="w-10 h-10 bg-[#8b1e3f]/20 rounded-full flex items-center justify-center text-[#8b1e3f] font-bold text-sm">
                            {announcement.createdBy?.username?.charAt(0).toUpperCase() || 'A'}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-800">{announcement.title}</div>
                            <div className="text-gray-600 text-sm mt-1">{announcement.content}</div>
                            <div className="text-[#8b1e3f] text-xs mt-1">
                              {announcement.priority} • {announcement.createdBy?.username} • {new Date(announcement.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-500">No announcements available</div>
                    )}
                  </div>

          
                  {announcements.length > itemsPerPage && (
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#8b1e3f]/10">
                      <div className="text-sm text-gray-600">
                        Showing {startIndex + 1}-{Math.min(endIndex, announcements.length)} of {announcements.length} announcements
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handlePreviousPage}
                          disabled={currentPage === 1}
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                            currentPage === 1
                              ? 'text-gray-400 cursor-not-allowed'
                              : 'text-[#8b1e3f] hover:bg-[#8b1e3f]/10'
                          }`}
                        >
                          Previous
                        </button>
                        <span className="px-3 py-1 text-sm text-gray-600">
                          Page {currentPage} of {totalPages}
                        </span>
                        <button
                          onClick={handleNextPage}
                          disabled={currentPage === totalPages}
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                            currentPage === totalPages
                              ? 'text-gray-400 cursor-not-allowed'
                              : 'text-[#8b1e3f] hover:bg-[#8b1e3f]/10'
                          }`}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {activeTab === 'leave' && (
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <LeaveRequestForm employeeId={employeeId} />
                    <LeaveBalanceCard employeeId={employeeId} />
                  </div>
                  <div>
                    <LeaveRequestsList 
                      employeeId={employeeId} 
                      currentPage={leaveRequestsPage}
                      onPageChange={setLeaveRequestsPage}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Grid: Who's Out & Company Links */}
            {/* <div className="grid grid-cols-2 gap-6">
             
              
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-6 border border-purple-100">
                <div className="font-semibold text-[#8b1e3f] mb-3">Company Links</div>
                <div className="grid grid-cols-2 gap-3">
                  {companyLinks.map((link, index) => (
                    <a 
                      key={index} 
                      href="#" 
                      className="flex items-center gap-2 p-3 bg-[#8b1e3f]/10 hover:bg-[#8b1e3f]/25 rounded-lg text-[#8b1e3f] text-sm font-medium transition-colors"
                    >
                      {link.icon}
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </div> */}
          </section>
        </main>
      </div>
    </div>
  );
};

export default EmployeePage;
import { Button } from '@/components/ui/button';
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCurrentUserDetails, updateUserProfile } from '../Api/hr';

const EmployeeProfile = () => {
   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleLogout = () => {
    setIsDropdownOpen(false);
    localStorage.clear();
  };

  const initialFormState = {
    firstName: '',
    lastName: '',
    contact: '',
    department: '',
    address: '',
    email: '',
  };

  const [form, setForm] = useState(initialFormState);
  const [isEmptyDetails, setIsEmptyDetails] = useState(false);

  const token = localStorage.getItem('token');

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['employeeDetails'],
    queryFn: fetchCurrentUserDetails,
    enabled: !!token,
  });

  // Process data with useEffect to ensure it runs every time data changes
  useEffect(() => {
   
    if (data && !isLoading) {
      console.log('Processing data...');
      
      // Check if it's an empty details response
      if (data.message === 'Employee details not yet created') {
        console.log('Employee details not created yet');
        setIsEmptyDetails(true);
        return;
      }
      
      // Try multiple possible response structures
      let employeeData = data;
  
      const newFormState = {
        firstName: employeeData.firstName,
        lastName: employeeData.lastName,
        contact: employeeData.contact,
        department: employeeData.department,
        address: employeeData.address,
        email: employeeData.email,
      };
      
      setForm(newFormState);
      setIsEmptyDetails(false);
    }
  }, [data, isLoading]);

  // Mutation for update
  const updateMutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (responseData) => {
      console.log('Update success:', responseData);
      queryClient.invalidateQueries({ queryKey: ['employeeDetails'] });
      alert('Profile updated successfully');
      setIsEmptyDetails(false);
    },
    onError: (error) => {
      console.error('Update error:', error);
      alert('Failed to update profile');
    },
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting form:', form);
    updateMutation.mutate(form);
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading profile data: {error?.message}</p>;

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
          <a href="/hrpage" className="hover:underline">Home</a>
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
          {/* Avatar Section */}
          <div className="text-lg font-bold text-gray-800 mb-1">John Doe</div>
          <div className="text-gray-400 mb-6">&bull;</div>
          <nav className="w-full px-6">
            <ul className="space-y-2">
              <li className="text-gray-700 flex items-center gap-2 py-2 px-3 rounded hover:bg-gray-100 cursor-pointer"><span>👥</span>Employees</li>
              <li className="text-gray-700 flex items-center gap-2 py-2 px-3 rounded hover:bg-gray-100 cursor-pointer"><span>🕒</span>Attendance</li>
              <li className="text-gray-700 flex items-center gap-2 py-2 px-3 rounded hover:bg-gray-100 cursor-pointer"><span>📝</span>Leave</li>
              <li className="text-gray-700 flex items-center gap-2 py-2 px-3 rounded hover:bg-gray-100 cursor-pointer"><span>📁</span>Project</li>
            </ul>
          </nav>
        </aside>
        {/* Main Content */}
        <main className="flex-1 p-10">    
          {/* Profile Card */}
          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-b-lg shadow p-8 flex gap-12 max-w-5xl mx-auto">
              <div className="flex-1 grid grid-cols-2 gap-6">
                {isEmptyDetails && (
                  <div className="col-span-2 text-red-600 font-medium">
                    Your details are empty, please fill up your details.
                  </div>
                )}

                <div>
                  <label className="block text-gray-600 mb-1">First Name</label>
                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    type="text"
                    placeholder="First Name"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 mb-1">Last Name</label>
                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    type="text"
                    placeholder="Last Name"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-gray-600 mb-1">Contact</label>
                  <input
                    name="contact"
                    value={form.contact}
                    onChange={handleChange}
                    type="text"
                    placeholder="Contact Number"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 mb-1">Department</label>
                  <input
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    type="text"
                    placeholder="Department"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 mb-1">Address</label>
                  <input
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    type="text"
                    placeholder="Address"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-gray-600 mb-1">Email</label>
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    type="email"
                    placeholder="Email"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-40 h-10 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default EmployeeProfile;
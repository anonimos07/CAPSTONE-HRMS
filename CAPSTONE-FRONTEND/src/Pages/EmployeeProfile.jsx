import { Button } from '@/components/ui/button';
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCurrentUserDetails, updateUserProfile } from '../Api/employee';
import Header from '../components/Header';
import ChangePasswordForm from '../components/ChangePasswordForm';
import ProfilePictureUpload from '../components/ProfilePictureUpload';

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
      <Header userRole="EMPLOYEE" />
      <div className="min-h-screen bg-gray-100 flex">
        {/* Sidebar */}
        <aside className="w-1/5 bg-white flex flex-col items-center py-10 shadow-md min-h-screen">
          {/* Profile Picture Section */}
          <div className="mb-6">
            <ProfilePictureUpload size="medium" />
          </div>
          {/* Avatar Section */}
        
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
                  className="w-40 h-10 bg-[#8b1e3f] hover:bg-[#8b1e3f]/70 text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </form>
          
          {/* Change Password Section */}
          <div className="mt-8 max-w-5xl mx-auto">
            <ChangePasswordForm />
          </div>
        </main>
      </div>
    </div>
  );
};

export default EmployeeProfile;
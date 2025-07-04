import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FiUser, FiMail, FiPhone, FiBriefcase } from 'react-icons/fi';
import { ParentLayout } from '../Parent/ParentLayout';

const jobs = [
  {
    id: 1,
    title: "Frontend Developer",
    department: "Engineering"
  },
  {
    id: 2,
    title: "HR Manager",
    department: "Human Resources"
  },
  {
    id: 3,
    title: "UX Designer",
    department: "Design"
  }
];

export const ApplicationForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const job = jobs.find(j => j.id === parseInt(id));
  
  const [formData, setFormData] = useState({
    position: job?.title || '',
    email: '',
    contact: '',
    fullName: '',
    file: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, file: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Application submitted successfully!');
    navigate('/');
  };

  return (
    <ParentLayout>
      <div className="min-h-screen bg-purple-50 p-6">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-purple-800 mb-6">Apply for {job?.title}</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-purple-700 mb-2">Position</label>
              <div className="flex items-center bg-purple-50 p-3 rounded-md">
                <FiBriefcase className="text-purple-600 mr-2" />
                <span>{job?.title}</span>
              </div>
            </div>
            
            <div>
              <label htmlFor="fullName" className="block text-purple-700 mb-2">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="text-purple-600" />
                </div>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="pl-10 w-full p-3 border border-purple-200 rounded-md focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-purple-700 mb-2">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-purple-600" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 w-full p-3 border border-purple-200 rounded-md focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="contact" className="block text-purple-700 mb-2">Contact Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiPhone className="text-purple-600" />
                </div>
                <input
                  type="tel"
                  id="contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  className="pl-10 w-full p-3 border border-purple-200 rounded-md focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="file" className="block text-purple-700 mb-2">Resume/CV</label>
              <input
                type="file"
                id="file"
                name="file"
                onChange={handleFileChange}
                className="block w-full text-sm text-purple-700
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-purple-100 file:text-purple-700
                  hover:file:bg-purple-200"
                required
              />
            </div>
            
            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 text-lg">
              Submit Application
            </Button>
          </form>
        </div>
      </div>
    </ParentLayout>
  );
};
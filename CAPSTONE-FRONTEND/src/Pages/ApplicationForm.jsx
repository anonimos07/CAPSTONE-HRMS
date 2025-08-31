import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FiUser, FiMail, FiPhone, FiBriefcase, FiArrowLeft } from 'react-icons/fi';
import { ParentLayout } from '../Parent/ParentLayout';
import { useAllJobPositions } from '../Api/hooks/useJobPositions';
import { useSubmitJobApplication } from '../Api';

export const ApplicationForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: positions = [] } = useAllJobPositions();
  const submitMutation = useSubmitJobApplication();
  
  const position = positions.find(p => p.id === parseInt(id));
  
  const [formData, setFormData] = useState({
    position: position?.title || '',
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


  const handleSubmit = async (e) => {
    e.preventDefault();

    const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    const file = formData.file;

    if (!allowedTypes.includes(file.type)) {
      alert("Only PDF, DOC, and DOCX files are allowed!");
      return;
    }

    submitMutation.mutate(formData, {
      onSuccess: () => {
        alert('Application submitted successfully!');
        navigate('/');
      },
      onError: (error) => {
        console.error('Submission error:', error);
        alert(`Failed to submit application: ${error.message}`);
      }
    });
  };


  return (
    <ParentLayout>
      <div className="min-h-screen bg-[#8b1e3f]/10 p-6">
        <div className="max-w-2xl mx-auto">
          {/* Added back button here */}
          <Link to="/hiring" className="flex items-center text-[#8b1e3f] mb-6">
            <FiArrowLeft className="mr-2" /> Back to Open Positions
          </Link>
          
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-[#8b1e3f] mb-6">Apply for {position?.title}</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[#8b1e3f] mb-2">Position</label>
                <div className="flex items-center bg-[#8b1e3f]/10 p-3 rounded-md">
                  <FiBriefcase className="text-[#8b1e3f] mr-2" />
                  <span>{position?.title}</span>
                </div>
              </div>
              
              <div>
                <label htmlFor="fullName" className="block text-[#8b1e3f] mb-2">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="text-[#8b1e3f]" />
                  </div>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="pl-10 w-full p-3 border border-[#8b1e3f]/20 rounded-md focus:ring-2 focus:ring-[#8b1e3f]/60 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-[#8b1e3f] mb-2">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="text-[#8b1e3f]" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 w-full p-3 border border-[#8b1e3f]/20 rounded-md focus:ring-2 focus:ring-[#8b1e3f]/60 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="contact" className="block text-[#8b1e3f] mb-2">Contact Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiPhone className="text-[#8b1e3f]" />
                  </div>
                  <input
                    type="tel"
                    id="contact"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    className="pl-10 w-full p-3 border border-[#8b1e3f]/20 rounded-md focus:ring-2 focus:ring-[#8b1e3f]/60 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="file" className="block text-[#8b1e3f] mb-2">Resume/CV</label>
                <input
                  type="file"
                  id="file"
                  name="file"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-[#8b1e3f]
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-[#8b1e3f]/20 file:text-[#8b1e3f]
                    hover:file:bg-[#8b1e3f]/20"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                disabled={submitMutation.isPending}
                className="w-full bg-[#8b1e3f] hover:bg-[#8b1e3f]/70 text-white py-4 text-lg disabled:opacity-50"
              >
                {submitMutation.isPending ? 'Submitting...' : 'Submit Application'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </ParentLayout>
  );
};
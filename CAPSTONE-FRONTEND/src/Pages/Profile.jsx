import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Briefcase, Edit } from 'lucide-react';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@company.com',
    phone: '+1 (555) 123-4567',
    position: 'Software Developer',
    department: 'Engineering',
    address: '123 Tech St, San Francisco, CA'
  });

  const handleChange = (e) => {
    setProfile({...profile, [e.target.name]: e.target.value});
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">My Profile</h2>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center space-x-1 px-3 py-1.5 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100"
        >
          <Edit className="h-4 w-4" />
          <span>{isEditing ? 'Cancel' : 'Edit'}</span>
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <User className="h-8 w-8 text-purple-600" />
            </div>
            <div>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  className="text-xl font-medium border-b border-gray-300 focus:border-purple-500 focus:outline-none"
                />
              ) : (
                <h3 className="text-xl font-medium text-gray-900">{profile.name}</h3>
              )}
              <p className="text-gray-600">{profile.position}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-start">
            <Mail className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
            <div className="flex-1">
              <p className="text-sm text-gray-500">Email</p>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  className="w-full border-b border-gray-300 focus:border-purple-500 focus:outline-none"
                />
              ) : (
                <p className="text-gray-900">{profile.email}</p>
              )}
            </div>
          </div>

          <div className="flex items-start">
            <Phone className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
            <div className="flex-1">
              <p className="text-sm text-gray-500">Phone</p>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  className="w-full border-b border-gray-300 focus:border-purple-500 focus:outline-none"
                />
              ) : (
                <p className="text-gray-900">{profile.phone}</p>
              )}
            </div>
          </div>

          <div className="flex items-start">
            <Briefcase className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
            <div className="flex-1">
              <p className="text-sm text-gray-500">Department</p>
              {isEditing ? (
                <input
                  type="text"
                  name="department"
                  value={profile.department}
                  onChange={handleChange}
                  className="w-full border-b border-gray-300 focus:border-purple-500 focus:outline-none"
                />
              ) : (
                <p className="text-gray-900">{profile.department}</p>
              )}
            </div>
          </div>

          <div className="flex items-start">
            <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
            <div className="flex-1">
              <p className="text-sm text-gray-500">Address</p>
              {isEditing ? (
                <textarea
                  name="address"
                  value={profile.address}
                  onChange={handleChange}
                  rows={2}
                  className="w-full border border-gray-300 rounded p-1 focus:border-purple-500 focus:outline-none"
                />
              ) : (
                <p className="text-gray-900">{profile.address}</p>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="pt-4">
              <button
                type="button"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg"
                onClick={() => setIsEditing(false)}
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;